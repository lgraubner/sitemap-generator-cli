# Node Sitemap Generator

[![Travis](https://img.shields.io/travis/lgraubner/sitemap-generator-cli.svg)](https://travis-ci.org/lgraubner/sitemap-generator-cli) [![David](https://img.shields.io/david/lgraubner/sitemap-generator-cli.svg)](https://david-dm.org/lgraubner/sitemap-generator-cli) [![David Dev](https://img.shields.io/david/dev/lgraubner/sitemap-generator-cli.svg)](https://david-dm.org/lgraubner/sitemap-generator-cli#info=devDependencies) [![npm](https://img.shields.io/npm/v/sitemap-generator-cli.svg)](https://www.npmjs.com/package/sitemap-generator-cli)

> Create xml sitemaps from the command line.

## Installation

```BASH
$ npm install -g sitemap-generator-cli
```

## Usage
```BASH
$ sitemap-generator [options] <url>
```

The protocol can be omitted, if the domain uses `http` or redirects to `https` are set up.

The crawler will fetch all folder URL pages and file types [parsed by Google](https://support.google.com/webmasters/answer/35287?hl=en). If present the `robots.txt` will be taken into account and possible rules are applied for each URL to consider if it should be added to the sitemap. Also the crawler will not fetch URL's from a page if the robots meta tag with the value `nofollow` is present. The crawler is able to apply the `base` value to found links.

When the crawler finished the XML Sitemap will be built and printed directly to your console. Pass the sitemap to save the sitemap as a file or do something else:

```BASH
$ sitemap-generator example.com > sitemap.xml
```

To save it in a subfolder simply provide a relativ path. You can pick any filename you want.

```BASH
$ sitemap-generator example.com > ./subfolder/mysitemap.xml
```

## Options
```BASH
$ sitemap-generator --help

  Usage: sitemap-generator [options] <url>

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -b, --baseurl          only allow URLs which match given <url>
    -d, --dry              show status messages without generating a sitemap
    -q, --query            consider query string
```

Example:

```Bash
// strictly match given path and consider query string
$ sitemap-generator -bq example.com/foo/
```

###  `--baseurl`

Default: `false`

If you specify an URL with a path (e.g. `example.com/foo/`) and this option is set to `true` the crawler will only fetch URL's matching `example.com/foo/*`. Otherwise it could also fetch `example.com` in case a link to this URL is provided

### `--dry`

Default: `false`

Use this option to make a dry run and check the generation process to see which sites are fetched and if there are any errors.
Will not create a sitemap!

### `--query`

Default: `false`

Consider URLs with query strings like `http://www.example.com/?foo=bar` as indiviual sites and add them to the sitemap.
