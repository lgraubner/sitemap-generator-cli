# Node Sitemap Generator

[![Travis](https://img.shields.io/travis/lgraubner/node-sitemap-generator-cli.svg)](https://travis-ci.org/lgraubner/node-sitemap-generator-cli) [![David](https://img.shields.io/david/lgraubner/node-sitemap-generator-cli.svg)](https://david-dm.org/lgraubner/node-sitemap-generator-cli) [![David Dev](https://img.shields.io/david/dev/lgraubner/node-sitemap-generator-cli.svg)](https://david-dm.org/lgraubner/node-sitemap-generator-cli#info=devDependencies) [![npm](https://img.shields.io/npm/v/sitemap-generator-cli.svg)](https://www.npmjs.com/package/sitemap-generator-cli)

> Create xml sitemaps from the command line.

![](sitemap-generator.gif)

## Installation

```BASH
$ npm install -g sitemap-generator-cli
```

## Usage
```BASH
$ sitemap-generator [options] <url>
```

The crawler will fetch all sites matching folder URLs and file types [parsed by Google](https://support.google.com/webmasters/answer/35287?hl=en). If present the `robots.txt` will be taken into account and possible rules are applied for any URL to consider if it should be added to the sitemap.

***Tip***: Omit the URL protocol, the crawler will detect the right one.

**Important**: Executing the sitemap-generator with sites using HTML `base`-tag will not work in most cases as it is not parsed by the crawler.

## Options
```BASH
$ sitemap-generator --help

  Usage: sitemap-generator [options] <url>

  Options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -q, --query                consider query string
    -f, --filename [filename]  sets output filename
    -p, --path [path]          specifies output path
    -s, --silent               omit crawler notifications
```

### query

Default: `false`

Consider URLs with query strings like `http://www.example.com/?foo=bar` as indiviual sites and add them to the sitemap.

```BASH
$ sitemap-generator -q example.com
```

### filename

Default: `sitemap`

Specify an alternate filename for the XML output file. The `.xml` file extension is optional, it will be added automatically.

```BASH
$ sitemap-generator --filename="sitemap-foo" example.com
```

### path

Default: `.`

Specify an alternate output path for the generated sitemap. Default is the current working directory.

```BASH
$ sitemap-generator --path="../foo/bar" example.com
```

### silent

Default: `false`

Omit the crawler notifications of found or not found sites.

```BASH
$ sitemap-generator -s example.com
```
