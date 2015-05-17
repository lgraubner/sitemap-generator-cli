# node-sitemap-generator
Creates a XML-Sitemap by crawling a given site.

## Usage

```BASH
npm install -g

sitemap-gen -u exmaple.com
```

### Options

|command|description
|:---|:---
|-u, --url [url]|url to crawl, required
|-p, --protocol [protocol]|http protocol to use
|-d, --depth [depth]|max depth to crawl
|-q, --query|consider query string
