#!/usr/bin/env node

'use strict';

var program = require('commander');
var SitemapGenerator = require('sitemap-generator');
var pkg = require('./package.json');
var chalk = require('chalk');
var path = require('path');
var fs = require('fs');

program.version(pkg.version)
  .usage('[options] <url> <filepath>')
  .option('-b, --baseurl', 'only allow URLs which match given <url>')
  .option('-q, --query', 'consider query string')
  .option('-v, --verbose', 'print details when crawling')
  .parse(process.argv);

// display help if no url provided
if (program.args.length < 2) {
  program.help();
  process.exit();
}

if (!/[a-zA-Z]\.xml$/.test(program.args[1])) {
  console.error(chalk.red('Filepath should contain a filename ending with ".xml".'));
  process.exit();
}

// create SitemapGenerator instance
var generator = new SitemapGenerator(program.args[0], {
  stripQuerystring: !program.query,
  restrictToBasepath: program.baseurl,
});

// add event listeners to crawler if dry mode enabled
if (program.verbose) {
  // fetch status
  generator.on('fetch', function (status, url) {
    var color = 'green';
    if (status !== 'OK') {
      color = 'red';
    }

    console.log('[', chalk[color](status), ']', chalk.gray(url));
  });

  // ignored
  generator.on('ignore', function (url) {
    console.log('[', chalk.cyan('Ignored'), ']', chalk.gray(url));
  });

  // local error
  generator.on('clienterror', function () {
    console.log(chalk.red('Could not request url due to a local error.'));
  });
}

// crawling done
generator.on('done', function (sitemaps, store) {
  // show stats if dry mode
  if (program.verbose) {
    var message = 'Added %s pages, ignored %s pages, encountered %s errors.';
    var stats = [
      chalk.white(message),
      store.found.length,
      store.ignored.length,
      store.error.length,
    ];

    // no results => site not found
    if (!store.found.length && !store.error.length && !store.ignored.length) {
      console.error(chalk.red('Site "%s" could not be found'), program.args[0]);
      // exit with error
      process.exit(1);
    } else {
      // print stats
      console.log.apply(this, stats);
    }
  }

  if (sitemaps !== null) {
    // save files to disk
    sitemaps.map(function write(map, index) {
      var filePath = path.resolve(program.args[1]);
      if (index !== 0) {
        filePath = filePath.replace(/(\.xml)$/, '_part' + index + '$1');
      }

      return fs.writeFileSync(filePath, map);
    });
  } else {
    console.error(chalk.red('URL not found.'));
  }

  // exit
  process.exit(0);
});

// start crawler
generator.start();
