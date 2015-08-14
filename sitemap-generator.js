#!/usr/bin/env node

var Crawler = require("simplecrawler");
var _ = require("lodash");
var fs = require("fs");
var builder = require("xmlbuilder");
var program = require("commander");
var chalk = require("chalk");
var pkg = require("./package.json");

program.version(pkg.version)
        .usage("[options] <url>")
        .option("-q, --query", "consider query string")
        .option("-i, --include [ext,ext2]", "include fetched links by file extension, comma seperated")
        .option("-e, --exclude [ext,ext2]", "exclude fetched links by file extension, comma seperated")
        .option("-o, --output [path]", "specify output path")
        .parse(process.argv);

if (!program.args[0]) {
    program.help();
}

var chunk = [];
var c = new Crawler(program.args[0]);

c.initialPath = "/";
c.initialPort = 80;
c.initialProtocol = "http";
c.userAgent = "Node/Sitemap-Generator";

if (!program.query) {
    c.stripQuerystring = true;
}

var path = ".";
if (program.output) {
    path = program.output.replace(/\/+$/, "");
}

var exclude = ["gif", "jpg", "jpeg", "png", "ico", "bmp", "ogg", "webp", "mp4", "webm", "mp3", "ttf", "woff", "json", "rss", "atom", "gz", "zip", "rar", "7z", "css", "js", "gzip", "exe"];

if (program.include) {
    exclude = _.difference(exclude, program.include.split(","));
}

if (program.exclude) {
    exclude = _.union(exclude, program.exclude.split(","));
}

var exts = exclude.join("|");
var regex = new RegExp("\.(" + exts + ")", "i");

c.addFetchCondition(function(parsedURL) {
    return !parsedURL.path.match(regex);
});

c.on("fetchcomplete", function(item) {
    chunk.push({
        loc: item.url
    });

    console.log(chalk.cyan.bold("Found:"), chalk.gray(item.url));
});

c.on("fetch404", function(item, response) {
    console.log(chalk.red.bold("Not found:"), chalk.gray(item.url));
});

c.on("fetcherror", function(item, response) {
    console.log(chalk.red.bold("Fetch error:"), chalk.gray(item.url));
});

c.on("complete", function() {
    if (chunk.length === 0) {
        return console.log(chalk.red.bold("Error: Site '" + program.args[0] + "' could not be found."));
    }

    var xml = builder.create("urlset", { version: "1.0", encoding: "UTF-8" }).att("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");
    _.forIn(chunk, function(value, key) {
        xml.ele("url")
            .ele(value);
    });

    var map = xml.end({ pretty: true, indent: '    ', newline: "\n" });

    fs.writeFile(path + "/sitemap.xml", map, function(err) {
        if (err) {
            return console.log(chalk.red.bold("Error:"), chalk.red.bold(err));
        }

        console.log(chalk.white("Fetched %s sites, encountered %s errors."), chunk.length, c.queue.errors());
        console.log(chalk.green.bold("Sitemap successfully created!"));
    });
});

c.start();
