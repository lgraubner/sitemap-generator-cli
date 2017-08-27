#!/usr/bin/env node

const program = require('commander');
const SitemapGenerator = require('sitemap-generator');
const chalk = require('chalk');

const pkg = require('./package.json');

function sitemapFactory() {
  program
    .version(pkg.version)
    .usage('[options] <url> <filepath>')
    .option('-q, --query', 'consider query string')
    .option('-u, --user-agent <agent>', 'set custom User Agent')
    .option('-v, --verbose', 'print details when crawling')
    .parse(process.argv);

  // display help if no url/filepath provided
  if (program.args.length < 2) {
    program.help();
    process.exit();
  }

  const options = {
    stripQuerystring: !program.query,
    filepath: program.args[1],
  };

  // only pass if set to keep default
  if (program.userAgent) {
    options.userAgent = program.userAgent;
  }

  const generator = SitemapGenerator(program.args[0], options);

  // add event listeners to crawler if verbose mode enabled
  if (program.verbose) {
    generator.on('add', url => {
      console.log('[', chalk.green('ADD'), ']', chalk.gray(url));
    });

    generator.on('ignore', url => {
      console.log('[', chalk.cyan('IGN'), ']', chalk.gray(url));
    });

    generator.on('error', error => {
      console.error(
        '[',
        chalk.red('ERR'),
        ']',
        chalk.gray(error.url, ` (${error.code})`)
      );
    });
  }

  generator.on('done', ({ added, ignored, errored }) => {
    // show stats if dry mode
    if (program.verbose) {
      const message =
        'Added %s pages, ignored %s pages, encountered %s errors.';
      const stats = [chalk.white(message), added, ignored, errored];
      console.log.apply(this, stats);
    }

    process.exit(0);
  });

  generator.start();
}

sitemapFactory();
