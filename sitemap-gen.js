#!/usr/bin/env node

var Crawler = require("simplecrawler"),
    forIn = require("lodash/object/forIn"),
    fs = require("fs"),
    builder = require("xmlbuilder"),
    program = require("commander"),
    chalk = require("chalk"),
    pkg = require("./package.json");

program.version(pkg.version)
        .usage("[options] <url>")
        .option("-q, --query", "consider query string")
        .parse(process.argv);

if (!program.args[0]) {
    program.help();
}

var chunk = [],
    c = new Crawler(program.args[0]);

c.initialPath = "/";
c.initialPort = 80;
c.initialProtocol = "http";
c.userAgent = "Node/Sitemap-Generator";

if (!program.query) {
    c.stripQuerystring = true;
}

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
    var xml = builder.create("urlset", { version: "1.0", encoding: "UTF-8" }).att("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");
    forIn(chunk, function(value, key) {
        xml.ele("url")
            .ele(value);
    });

    var map = xml.end({ pretty: true, indent: '    ', newline: "\n" });

    fs.writeFile("sitemap.xml", map, function(err) {
        if (err) {
            return console.log(err);
        }

        console.log(chalk.white("Fetched %s sites, encountered %s errors."), c.queue.complete(), c.queue.errors());
        console.log(chalk.green.bold("Sitemap successfully created!"));
    });
});

var image = c.addFetchCondition(function(parsedURL) {
    return !parsedURL.path.match(/\.(gif|jpg|jpeg|png|ico|bmp)$/i);
});

var media = c.addFetchCondition(function(parsedURL) {
    return !parsedURL.path.match(/\.(ogg|webp|mp4|webm|mp3)$/i);
});

var font = c.addFetchCondition(function(parsedURL) {
    return !parsedURL.path.match(/\.(ttf|woff)$/i);
});

var data = c.addFetchCondition(function(parsedURL) {
    return !parsedURL.path.match(/\.(json|rss|atom|gz|zip|rar|7z)$/i);
});

var misc = c.addFetchCondition(function(parsedURL) {
    return !parsedURL.path.match(/\.(css|js|gzip)$/i);
});

c.start();
