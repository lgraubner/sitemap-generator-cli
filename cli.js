#!/usr/bin/env node

'use strict';

var program = require('commander');
var SitemapGenerator = require('./lib/SitemapGenerator.js');
var pkg = require('./package.json');

var generator;

program.version(pkg.version)
  .usage('[options] <url>')
  .option('-b, --baseurl', 'only allow URLs which match given <url>')
  .option('-q, --query', 'consider query string')
  .option('-f, --filename [filename]', 'sets output filename')
  .option('-p, --path [path]', 'specifies output path')
  .option('-s, --silent', 'omit crawler notifications')
  .parse(process.argv);

if (!program.args[0]) {
  program.help();
  process.exit();
}

generator = new SitemapGenerator({
  url: program.args[0],
  baseurl: program.baseurl,
  query: program.query,
  path: program.path,
  filename: program.filename,
  silent: program.silent,
});
generator.start();
