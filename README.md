# Sitemap Generator CLI

[![Travis](https://img.shields.io/travis/lgraubner/sitemap-generator-cli.svg)](https://travis-ci.org/lgraubner/sitemap-generator-cli) [![David](https://img.shields.io/david/lgraubner/sitemap-generator-cli.svg)](https://david-dm.org/lgraubner/sitemap-generator-cli) [![David Dev](https://img.shields.io/david/dev/lgraubner/sitemap-generator-cli.svg)](https://david-dm.org/lgraubner/sitemap-generator-cli#info=devDependencies) [![npm](https://img.shields.io/npm/v/sitemap-generator-cli.svg)](https://www.npmjs.com/package/sitemap-generator-cli)

> Create xml sitemaps from the command line.

## Installation

```BASH
$ npm install -g sitemap-generator-cli
```

## Usage
```BASH
$ sitemap-generator [options] <url> <filepath>
```

The crawler will fetch all folder URL pages and file types [parsed by Google](https://support.google.com/webmasters/answer/35287?hl=en). If present the `robots.txt` will be taken into account and possible rules are applied for each URL to consider if it should be added to the sitemap. Also the crawler will not fetch URL's from a page if the robots meta tag with the value `nofollow` is present and ignore them completely if `noindex` rule is present. The crawler is able to apply the `base` value to found links.

When the crawler finished the XML Sitemap will be built and saved to your specified filepath. If the count of fetched pages is greater than 50000 it will be splitted into several sitemap files and create a sitemapindex file. Google does not allow more than 50000 items in one sitemap.

```BASH
$ sitemap-generator http://example.com some/path/sitemap.xml
```

## Options
```BASH
$ sitemap-generator --help

  Usage: cli [options] <url> <filepath>

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -b, --baseurl  only allow URLs which match given <url>
    -q, --query    consider query string
    -v, --verbose  print details when crawling
```

Example:

```Bash
// strictly match given path and consider query string
$ sitemap-generator -bq example.com/foo/ sitemap.xml
```

###  `--baseurl`

Default: `false`

If you specify an URL with a path (e.g. `http://example.com/foo/`) and this option is set to `true` the crawler will only fetch URL's matching `example.com/foo/*`. Otherwise it could also fetch `example.com` in case a link to this URL is provided


### `--query`

Default: `false`

Consider URLs with query strings like `http://www.example.com/?foo=bar` as indiviual sites and add them to the sitemap.

### `--verbose`

Default: `false`

Print debug messages during crawling process. Also prints out a summery when finished.
