#!/usr/bin/env node

'use strict';

var program = require('commander');
var SitemapGenerator = require('./lib/SitemapGenerator.js');
var pkg = require('./package.json');

var gen;

program.version(pkg.version)
  .usage('[options] <url>')
  .option('-q, --query', 'consider query string')
  .option('-f, --filename [filename]', 'sets output filename')
  .option('-p, --path [path]', 'specifies output path')
  .parse(process.argv);

if (!program.args[0]) {
  program.help();
  process.exit();
}

gen = new SitemapGenerator(program.args[0]);
gen.start();
