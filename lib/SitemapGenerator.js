'use strict';

var Crawler = require('simplecrawler');
var _ = require('lodash');
var fs = require('fs');
var builder = require('xmlbuilder');
var chalk = require('chalk');
var path = require('path');
var URL = require('url-parse');

/**
 * Generator object, handling the crawler and file generation.
 *
 * @param  {String} url URL to parse
 */
function SitemapGenerator(options) {
  var port = 80;
  var exclude = ['gif', 'jpg', 'jpeg', 'png', 'ico', 'bmp', 'ogg', 'webp',
    'mp4', 'webm', 'mp3', 'ttf', 'woff', 'json', 'rss', 'atom', 'gz', 'zip',
    'rar', '7z', 'css', 'js', 'gzip', 'exe', 'svg'];
  var exts = exclude.join('|');
  var regex = new RegExp('\.(' + exts + ')', 'i');
  var baseUrlRegex = new RegExp('^' + options.url + '.*');

  this.options = options;
  this.chunk = [];

  this.uri = new URL(this.options.url);
  this.crawler = new Crawler(this.uri.host);

  this.crawler.initialPath = '/';
  if (this.uri.pathname) {
    this.crawler.initialPath = this.uri.pathname;
  }

  // only crawl regular links
  this.crawler.parseScriptTags = false;
  this.crawler.parseHTMLComments = false;

  if (process.env.NODE_ENV === 'development') {
    port = 8000;
  }
  this.crawler.initialPort = port;

  if (!this.uri.protocol) {
    this.uri.set('protocol', 'http:');
  }

  this.crawler.initialProtocol = this.uri.protocol.replace(':', '');
  this.crawler.userAgent = 'Node/Sitemap-Generator';

  if (!this.options.query) {
    this.crawler.stripQuerystring = true;
  }

  this.crawler.addFetchCondition(function (parsedURL) {
    return !parsedURL.path.match(regex);
  });

  if (this.options.baseurl) {
    this.crawler.addFetchCondition(function (parsedURL) {
      var currentUrl = parsedURL.protocol + '://' + parsedURL.host + parsedURL.uriPath;
      return currentUrl.match(baseUrlRegex);
    });
  }
}

/**
 * Create the crawler instance.
 */
SitemapGenerator.prototype.start = function () {
  this.crawler.on('fetchcomplete', function (item) {
    this.chunk.push({
      loc: item.url,
    });

    if (!this.options.silent) {
      console.log(chalk.cyan.bold('Found:'), chalk.gray(item.url));
    }
  }.bind(this));

  this.crawler.on('fetchdisallowed', function (item) {
    if (!this.options.silent) {
      console.log(chalk.bold.magenta('Ignoring:'), chalk.gray(item.url));
    }
  });

  this.crawler.on('fetch404', function (item) {
    if (!this.options.silent) {
      console.log(chalk.red.bold('Not found:'), chalk.gray(item.url));
    }
  }.bind(this));

  this.crawler.on('fetcherror', function (item) {
    console.log(chalk.red.bold('Fetch error:'), chalk.gray(item.url));
  });

  this.crawler.on('complete', function () {
    if (_.isEmpty(this.chunk)) {
      console.error(chalk.red.bold('Error: Site "%s" could not be found.'), this.options.url);
      process.exit(1);
    }

    this.write(function (err) {
      if (err) {
        console.error(chalk.red.bold(err));
        process.exit(1);
      } else {
        console.log(chalk.white('Added %s sites, encountered %s %s.'),
          this.chunk.length,
          this.crawler.queue.errors(),
          (this.crawler.queue.errors() === 1 ? 'error' : 'errors'));
        console.log(chalk.green.bold('Sitemap successfully created!'));
        process.exit();
      }
    }.bind(this));
  }.bind(this));

  this.crawler.start();
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

  if (this.options.path) {
    outputPath = this.options.path.replace(/\/+$/, '');
  }

  if (this.options.filename) {
    fileName = this.options.filename.replace(/\.xml$/i, '');
  }
  outputPath = path.join(outputPath, fileName + '.xml');

  fs.writeFile(outputPath, sitemap, function (err) {
    if (typeof callback === 'function') {
      return callback(err, outputPath);
    }
    return err;
  });
};

module.exports = SitemapGenerator;
