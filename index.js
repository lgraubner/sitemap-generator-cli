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
    .option('-v, --verbose', 'print details when crawling')
    .parse(process.argv);

  // display help if no url/filepath provided
  if (program.args.length < 2) {
    program.help();
    process.exit();
  }

  const generator = SitemapGenerator(program.args[0], {
    stripQuerystring: !program.query,
    filepath: program.args[1],
  });

  let added = 0;
  let ignored = 0;
  let errored = 0;

  // add event listeners to crawler if verbose mode enabled
  if (program.verbose) {
    generator.on('add', url => {
      added += 1;
      console.log('[', chalk.green('ADD'), ']', chalk.gray(url));
    });

    generator.on('ignore', url => {
      ignored += 1;
      console.log('[', chalk.cyan('IGN'), ']', chalk.gray(url));
    });

    generator.on('error', error => {
      errored += 1;
      console.error(
        '[',
        chalk.red('ERR'),
        ']',
        chalk.gray(error.url, ` (${error.code})`)
      );
    });
  }

  generator.on('done', () => {
    // show stats if dry mode
    if (program.verbose) {
      const message =
        'Added %s pages, ignored %s pages, encountered %s errors.';
      const stats = [chalk.white(message), added, ignored, errored];

      // no results => site not found
      if (added === 0 && errored === 0 && ignored === 0) {
        console.error(
          chalk.red('Site "%s" could not be found'),
          program.args[0]
        );
        // exit with error
        process.exit(1);
      } else {
        console.log.apply(this, stats);
      }
    }

    process.exit(0);
  });

  generator.start();
}

sitemapFactory();
