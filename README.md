# Sitemap Generator CLI

[![Travis](https://img.shields.io/travis/lgraubner/sitemap-generator-cli.svg)](https://travis-ci.org/lgraubner/sitemap-generator-cli) [![David](https://img.shields.io/david/lgraubner/sitemap-generator-cli.svg)](https://david-dm.org/lgraubner/sitemap-generator-cli) [![npm](https://img.shields.io/npm/v/sitemap-generator-cli.svg)](https://www.npmjs.com/package/sitemap-generator-cli)

> Create xml sitemaps from the command line.

Generates a sitemap by crawling your site. Uses streams to efficiently write the sitemap to your drive. Is cappable of creating multiple sitemaps if threshold is reached. Respects robots.txt and meta tags.

## Table of contents

- [Install](#install)
- [Usage](#usage)
- [Options](#options)
- [License](#license)

## Install

This module is available on [npm](https://www.npmjs.com/).

```BASH
npm install -g sitemap-generator-cli
# or execute it directly with npx (since npm v5.2)
npx sitemap-generator https://example.com
```

## Usage

The crawler will fetch all folder URL pages and file types [parsed by Google](https://support.google.com/webmasters/answer/35287?hl=en). If present the `robots.txt` will be taken into account and possible rules are applied for each URL to consider if it should be added to the sitemap. Also the crawler will not fetch URL's from a page if the robots meta tag with the value `nofollow` is present and ignore them completely if `noindex` rule is present. The crawler is able to apply the `base` value to found links.

```BASH
sitemap-generator [options] <url>
```

When the crawler finished the XML Sitemap will be built and saved to your specified filepath. If the count of fetched pages is greater than 50000 it will be splitted into several sitemap files and create a sitemapindex file. Google does not allow more than 50000 items in one sitemap.

Example:

```BASH
sitemap-generator http://example.com
```

## Options

```BASH
sitemap-generator --help

  Usage: cli [options] <url>

  Options:

    -h, --help                output usage information
    -V, --version             output the version number
    -f, --filepath            path to file including filename
    -m, --max-entries         limits the maximum number of URLS per sitemap file
    -d, --max-depth           limits the maximum distance from the original request
    -q, --query               consider query string
    -u, --user-agent <agent>  set custom User Agent
    -v, --verbose             print details when crawling
```

### filepath

Path to file to write including the filename itself. Path can be absolute or relative. Default is `sitemap.xml`.

Examples:

- `sitemap.xml`
- `mymap.xml`
- `/var/www/sitemap.xml`
- `./sitemap.myext`

### maxEntries

fine a limit of URLs per sitemap files, useful for site with lots of urls. Defaults to 50000.

### maxDepth

Set a maximum distance from the original request to crawl URLs, useful for generating smaller `sitemap.xml` files. Defaults to 0, which means it will crawl all levels.

### query

Consider URLs with query strings like `http://www.example.com/?foo=bar` as indiviual sites and add them to the sitemap.

### user-agent

Set a custom User Agent used for crawling. Default is `Node/SitemapGenerator`.

### verbose

Print debug messages during crawling process. Also prints out a summery when finished.

## License

[MIT](https://github.com/lgraubner/sitemap-generator/blob/master/LICENSE) © [Lars Graubner](https://larsgraubner.com)
