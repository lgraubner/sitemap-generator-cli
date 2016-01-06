'use strict';

var Crawler = require('simplecrawler');
var _ = require('lodash');
var fs = require('fs');
var builder = require('xmlbuilder');
var program = require('commander');
var chalk = require('chalk');
var path = require('path');
var URL = require('url-parse');
var robotsParser = require('robots-parser');
var request = require('request');

/**
 * Generator object, handling the crawler and file generation.
 *
 * @param  {String} url URL to parse
 */
function SitemapGenerator(url) {
  var port = 80;
  var exclude = ['gif', 'jpg', 'jpeg', 'png', 'ico', 'bmp', 'ogg', 'webp',
    'mp4', 'webm', 'mp3', 'ttf', 'woff', 'json', 'rss', 'atom', 'gz', 'zip',
    'rar', '7z', 'css', 'js', 'gzip', 'exe'];
  var exts = exclude.join('|');
  var regex = new RegExp('\.(' + exts + ')', 'i');

  this.chunk = [];

  this.uri = new URL(url);
  this.crawler = new Crawler(this.uri.host);

  this.crawler.initialPath = '/';

  if (process.env.NODE_ENV === 'development') {
    port = 8000;
  }
  this.crawler.initialPort = port;

  if (!this.uri.protocol) {
    this.uri.set('protocol', 'http:');
  }

  this.crawler.initialProtocol = this.uri.protocol.replace(':', '');
  this.crawler.userAgent = 'Node/Sitemap-Generator';

  if (!program.query) {
    this.crawler.stripQuerystring = true;
  }

  this.crawler.addFetchCondition(function (parsedURL) {
    return !parsedURL.path.match(regex);
  });
}

/**
 * Create the crawler instance.
 */
SitemapGenerator.prototype.start = function () {
  this.crawler.on('fetchcomplete', function (item) {
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
        loc: item.url,
      });

      console.log(chalk.cyan.bold('Found:'), chalk.gray(item.url));
    } else {
      console.log(chalk.bold.magenta('Ignored:'), chalk.gray(item.url));
    }
  }.bind(this));

  this.crawler.on('fetch404', function (item) {
    console.log(chalk.red.bold('Not found:'), chalk.gray(item.url));
  });

  this.crawler.on('fetcherror', function (item) {
    console.log(chalk.red.bold('Fetch error:'), chalk.gray(item.url));
  });

  this.crawler.on('complete', function () {
    if (_.isEmpty(this.chunk)) {
      console.error(chalk.red.bold('Error: Site "%s" could not be found.'), program.args[0]);
      process.exit(1);
    }

    this.write(function (err) {
      if (err) {
        console.error(chalk.red.bold(err));
        process.exit(1);
      } else {
        console.log(chalk.white('Added %s sites, encountered %s errors.'),
          this.chunk.length, this.crawler.queue.errors());
        console.log(chalk.green.bold('Sitemap successfully created!'));
        process.exit();
      }
    });
  }.bind(this));

  request(this.uri.set('pathname', '/robots.txt').toString(), function (error, response, body) {
    if (!error && response.statusCode === 200) {
      self.robots = robotsParser(response.request.uri.href, body);
    }
    this.crawler.start();
  }.bind(this));
};

/**
 * Write the XML file.
 *
 * @param  {Function} callback Callback function to execute
 */
SitemapGenerator.prototype.write = function (callback) {
  var sitemap;
  var outputPath = '.';
  var fileName = 'sitemap';
  var xml = builder.create('urlset', { version: '1.0', encoding: 'UTF-8' })
    .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

  _.forIn(this.chunk, function (value) {
    xml.ele('url')
      .ele(value);
  });

  sitemap = xml.end({ pretty: true, indent: '  ', newline: '\n' });

  if (program.path) {
    outputPath = program.path.replace(/\/+$/, '');
  }

  if (program.filename) {
    fileName = program.filename.replace(/\.xml$/i, '');
  }
  outputPath = path.join(outputPath, fileName + '.xml');

  fs.writeFile(outputPath, sitemap, function (err) {
    if (typeof callback === 'function') {
      return callback(err, outputPath);
    }
  });
};

module.exports = SitemapGenerator;
