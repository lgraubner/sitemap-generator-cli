# Node Sitemap Generator
Creates a XML-Sitemap by crawling a given site.

![](http://lgraubner.github.io/node-sitemap-generator/sitemap_generator.gif)

## Installation

```BASH
$ npm install -g sitemap-generator
```

## Usage
```BASH
$ sitemap-generator [options] <url>
```

### Options
```BASH
$ sitemap-generator --help

  Usage: sitemap-generator [options] <url>

  Options:

    -h, --help                output usage information
    -V, --version             output the version number
    -q, --query               consider query string
    -i, --include [ext,ext2]  include fetched links by file extension, comma seperated
    -e, --exclude [ext,ext2]  exclude fetched links by file extension, comma seperated
    -o, --output [path]       specify output path
```

**Important**: Executing the sitemap-generator with sites using HTML `base`-tag along with links *without* leading slashes will probably not work.
