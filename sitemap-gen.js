#!/usr/bin/env node

var Crawler = require("simplecrawler"),
    _ = require("lodash"),
    moment = require("moment"),
    fs = require("fs"),
    builder = require("xmlbuilder"),
    program = require("commander"),
    chalk = require("chalk"),
    pkg = require("./package.json");

program.version(pkg.version)
        .usage("<keywords>")
        .option("-u, --url [url]", "url to crawl, required")
        .option("-p, --protocol [protocol]", "http protocol to use")
        .option("-d, --depth [depth]", "max depth to crawl")
        .option("-q, --query", "consider query string")
        .parse(process.argv);

if (!program.url) {
    program.help();
}

var chunk = [],
    c = new Crawler(program.url);

c.initialPath = "/";
c.initialPort = 80;
c.userAgent = "Node/Sitemap-Generator";

if (program.protocol) {
    c.initialProtocol = program.protocol;
} else {
    c.initialProtocol = "http";
}

c.maxDepth = 10;

if (!program.query) {
    c.stripQuerystring = true;
}

c.on("fetchcomplete", function(item) {
    if (!_.has(chunk, item.url)) {
        chunk.push({
            loc: item.url,
            // TODO: date ersetzen, da deprecated?
            lastmod: moment(new Date(item.stateData.headers["last-modified"])).format("YYYY-MM-DD"),
            // TODO: calculate changefreq
            changefreq: "always",
            priority: round((1 - ((item.depth - 1) / 10)), 2)
        });
    }

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
    _.forIn(chunk, function(value, key) {
        xml.ele("url")
            .ele("loc", value.loc);
            //.up().ele("lastmod", value.lastmod)
            //.up().ele("changefreq", value.changefreq)
            //.up().ele("priority", value.priority);
    });

    var map = xml.end({ pretty: true, indent: '    ', newline: "\n" });

    fs.writeFile("sitemap.xml", map, function(err) {
        if (err) {
            return console.log(err);
        }

        console.log(chalk.white("Fetched %s links, encountered %s errors."), c.queue.complete(), c.queue.errors());
        console.log(chalk.green.bold("Sitemap successfully created!"));
    });
});

c.addFetchCondition(function(parsedURL) {
    return !parsedURL.path.match(/\.(pdf|json|xml|gif|jpg|jpeg|png|svg|css|js|rss|atom|ico|ogg|bmp|webp|mp4|webm|gzip|ttf|woff)$/i);
});

c.start();

// helper function for rounding
function round(value, exp) {
    if (typeof exp === 'undefined' || +exp === 0)
        return Math.round(value);

    value = +value;
    exp  = +exp;

    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
        return NaN;

    // Shift
    value = value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}
