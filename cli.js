#!/usr/bin/env node

'use strict';

var program = require('commander');
var SitemapGenerator = require('sitemap-generator');
var pkg = require('./package.json');
var chalk = require('chalk');

program.version(pkg.version)
  .usage('[options] <url>')
  .option('-b, --baseurl', 'only allow URLs which match given <url>')
  .option('-d, --dry', 'show status messages without generating a sitemap')
  .option('-q, --query', 'consider query string')
  .parse(process.argv);

// display help if no url provided
if (!program.args[0]) {
  program.help();
  process.exit();
}

// create SitemapGenerator instance
var generator = new SitemapGenerator(program.args[0], {
  stripQuerystring: !program.query,
  restrictToBasepath: program.baseurl,
  port: (process.env.NODE_ENV === 'development' ? 5173 : 80),
});

// add event listeners to crawler if dry mode enabled
if (program.dry) {
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
generator.on('done', function (sitemap, store) {
  // show stats if dry mode
  if (program.dry) {
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
  } else {
    // print sitemap
    console.log(sitemap);
  }

  // exit
  process.exit(0);
});

// start crawler
generator.start();
