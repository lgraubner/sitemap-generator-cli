# node-sitemap-generator
Creates a XML-Sitemap by crawling a given site.

## Usage

```BASH
npm install -g

sitemap-gen -u example.com
```

*Important*: Relative Links without leading slash are producing errors.

### Options

|command|description
|:---|:---
|-u, --url [url]|URL to crawl (required)
|-q, --query|consider query string
