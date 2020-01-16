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
npx sitemap-generator-cli https://example.com
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

    -V, --version                           output the version number
    -f, --filepath <filepath>               path to file including filename (default: sitemap.xml)
    -m, --max-entries <maxEntries>          limits the maximum number of URLs per sitemap file (default: 50000)
    -d, --max-depth <maxDepth>              limits the maximum distance from the original request (default: 0)
    -q, --query                             consider query string
    -u, --user-agent <agent>                set custom User Agent
    -v, --verbose                           print details when crawling
    -c, --max-concurrency <maxConcurrency>  maximum number of requests the crawler will run simultaneously (default: 5)
    -r, --no-respect-robots-txt             controls whether the crawler should respect rules in robots.txt
    -l, --last-mod                          add Last-Modified header to xml
    -g, --change-freq <changeFreq>          adds a <changefreq> line to each URL in the sitemap.
    -p, --priority-map <priorityMap>        priority for each depth url, values between 1.0 and 0.0, example: "1.0,0.8 0.6,0.4"
    -h, --help                              output usage information
```

### filepath

Path to file to write including the filename itself. Path can be absolute or relative. Default is `sitemap.xml`.

Examples:

- `sitemap.xml`
- `mymap.xml`
- `/var/www/sitemap.xml`
- `./sitemap.myext`

### maxConcurrency

Sets the maximum number of requests the crawler will run simultaneously (default: 5).

### maxEntries

Define a limit of URLs per sitemap files, useful for site with lots of urls. Defaults to 50000.

### maxDepth

Set a maximum distance from the original request to crawl URLs, useful for generating smaller `sitemap.xml` files. Defaults to 0, which means it will crawl all levels.

### noRespectRobotsTxt

Controls whether the crawler should respect rules in robots.txt.

### query

Consider URLs with query strings like `http://www.example.com/?foo=bar` as individual sites and add them to the sitemap.

### user-agent

Set a custom User Agent used for crawling. Default is `Node/SitemapGenerator`.

### verbose

Print debug messages during crawling process. Also prints out a summery when finished.

### last-mod

add Last-Modified header to xml

### change-freq

adds a <changefreq> line to each URL in the sitemap.

### priority-map

add priority for each depth url, values between 1.0 and 0.0, example: "1.0,0.8 0.6,0.4"

## License

[MIT](https://github.com/lgraubner/sitemap-generator/blob/master/LICENSE) © [Lars Graubner](https://larsgraubner.com)
