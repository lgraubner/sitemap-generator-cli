# Node Sitemap Generator
Creates a XML-Sitemap by crawling a given site.

## Usage

```BASH
npm install -g sitemap-generator

# sitemap-gen [options] <url>
sitemap-gen --query example.com
```

*Important*: Relative Links without leading slash are producing errors.

### Options

|command|description
|:---|:---
|-q, --query|consider query string
