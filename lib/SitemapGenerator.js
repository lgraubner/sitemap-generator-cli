#!/usr/bin/env node

"use strict";

const Crawler = require("simplecrawler");
const _ = require("lodash");
const fs = require("fs");
const builder = require("xmlbuilder");
const program = require("commander");
const chalk = require("chalk");
const path = require("path");
const URL = require("url-parse");
const robotsParser = require("robots-parser");
const request = require("request");
const pkg = require("../package.json");

program.version(pkg.version)
        .usage("[options] <url>")
        .option("-q, --query", "consider query string")
        .option("-f, --filename [filename]", "sets output filename")
        .option("-p, --path [path]", "specifies output path")
        .parse(process.argv);

if (!program.args[0]) {
    program.help();
}

/**
 * Generator object, handling the crawler and file generation.
 *
 * @param  {String} url URL to parse
 */
var SitemapGenerator = function(url) {
    this.chunk = [];

    this.uri = new URL(url);
    this.crawler = new Crawler(this.uri.host);

    this.crawler.initialPath = "/";

    var port = 80;
    if (process.env.NODE_ENV === "development") {
        port = 8000;
    }
    this.crawler.initialPort = port;


    if (!this.uri.protocol) {
        this.uri.set("protocol", "http:");
    }

    this.crawler.initialProtocol = this.uri.protocol.replace(":", "");
    this.crawler.userAgent = "Node/Sitemap-Generator";

    if (!program.query) {
        this.crawler.stripQuerystring = true;
    }

    var exclude = ["gif", "jpg", "jpeg", "png", "ico", "bmp", "ogg", "webp", "mp4", "webm", "mp3", "ttf", "woff", "json", "rss", "atom", "gz", "zip", "rar", "7z", "css", "js", "gzip", "exe"];

    var exts = exclude.join("|");
    var regex = new RegExp("\.(" + exts + ")", "i");

    this.crawler.addFetchCondition(function(parsedURL) {
        return !parsedURL.path.match(regex);
    });

    request(this.uri.set("pathname", "/robots.txt").toString(), (error, response, body) => {
        if (!error && response.statusCode == 200) {
            this.robots = robotsParser(response.request.uri.href, body);
        }
        this.create();
    });
};

/**
 * Create the crawler instance.
 */
SitemapGenerator.prototype.create = function() {

    this.crawler.on("fetchcomplete", (item) => {
        var allowed = true;

        if (this.robots) {
            try {
                allowed = this.robots.isAllowed(item.url, this.crawler.userAgent);
            } catch (e) {
                // silent error
            }
        }

        if (allowed) {
            this.chunk.push({
                loc: item.url
            });

            console.log(chalk.cyan.bold("Found:"), chalk.gray(item.url));
        } else {
            console.log(chalk.bold.magenta("Ignored:"), chalk.gray(item.url));
        }
    });

    this.crawler.on("fetch404", function(item, response) {
        console.log(chalk.red.bold("Not found:"), chalk.gray(item.url));
    });

    this.crawler.on("fetcherror", function(item, response) {
        console.log(chalk.red.bold("Fetch error:"), chalk.gray(item.url));
    });

    this.crawler.on("complete", () => {
        if (_.isEmpty(this.chunk)) {
            console.error(chalk.red.bold("Error: Site '%s' could not be found."), program.args[0]);
            process.exit(1);
        }

        this.write((err, path) => {
            if (err) {
                console.error(chalk.red.bold(err));
                process.exit(1);
            } else {
                console.log(chalk.white("Added %s sites, encountered %s errors."), this.chunk.length, this.crawler.queue.errors());
                console.log(chalk.green.bold("Sitemap successfully created!"));
                process.exit();
            }
        });
    });

    this.crawler.start();
};

/**
 * Write the XML file.
 *
 * @param  {Function} callback Callback function to execute
 */
SitemapGenerator.prototype.write = function(callback) {
    var xml = builder.create("urlset", { version: "1.0", encoding: "UTF-8" })
        .att("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");

    _.forIn(this.chunk, function(value, key) {
        xml.ele("url")
            .ele(value);
    });

    var sitemap = xml.end({ pretty: true, indent: '    ', newline: "\n" });

    var outputPath = ".";
    if (program.path) {
        outputPath = program.path.replace(/\/+$/, "");
    }

    var fileName = "sitemap";
    if (program.filename) {
        fileName = program.filename.replace(/\.xml$/i, "");
    }
    outputPath = path.join(outputPath, fileName + ".xml");

    fs.writeFile(outputPath, sitemap, function(err) {
        if (typeof callback === "function") {
            return callback(err, outputPath);
        }
    });
};

var generator = new SitemapGenerator(program.args[0]);
