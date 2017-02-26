/* eslint no-unused-vars:0 */
var test = require('ava');
var fs = require('fs');
var path = require('path');

var port = require('./lib/constants').port;
var baseUrl = require('./lib/constants').baseUrl;
// test server
var server = require('./lib/server');
var exec = require('child_process').exec;

// start testserver
test.cb.before(function (t) {
  server.listen(port, baseUrl, function () {
    t.end();
  });
});

test.cb('should return error message for invalid URL\'s', function (t) {
  t.plan(2);

  exec('node cli.js invalid sitemap.xml', function (error, stdout, stderr) {
    t.is(error, null, 'no error');
    t.not(stderr, '');

    t.end();
  });
});

test.cb('should return error message for missing/invalid filepath', function (t) {
  t.plan(2);

  exec('node cli.js ' + baseUrl + ':' + port, function (error, stdout, stderr) {
    t.is(error, null, 'no error');
    t.not(stdout, '');

    t.end();
  });
});

test.cb('should return valid sitemap', function (t) {
  t.plan(7);

  exec('node cli.js ' + baseUrl + ':' + port + ' sitemap_valid.xml',
    function (error, stdout, stderr) {
      t.is(error, null, 'no error');
      t.is(stderr, '', 'no error messages');
      // sitemap
      var filePath = path.resolve('./sitemap_valid.xml');
      t.truthy(fs.existsSync(filePath));

      t.regex(fs.readFileSync(filePath), /^<\?xml version="1.0" encoding="UTF-8"\?>/);
      var urlsRegex = /<urlset xmlns=".+?">(.|\n)+<\/urlset>/;
      t.regex(fs.readFileSync(filePath), urlsRegex, 'has urlset property');
      t.regex(fs.readFileSync(filePath), /<url>(.|\n)+?<\/url>/g, 'contains url properties');
      t.regex(fs.readFileSync(filePath), /<loc>(.|\n)+?<\/loc>/g, 'contains loc properties');

      t.end();
    }
  );
});

test.cb('should restrict crawler to baseurl if option is enabled', function (t) {
  t.plan(4);

  // eslint-disable-next-line
  exec('node cli.js --baseurl ' + baseUrl + ':' + port + '/subpage sitemap_baseurl.xml', function (error, stdout, stderr) {
    t.is(error, null, 'no error');
    t.is(stderr, '', 'no error messages');
    var filePath = path.resolve('sitemap_baseurl.xml');
    t.truthy(fs.existsSync(filePath));
    var regex = new RegExp('http:\/\/' + baseUrl + ':' + port + '/<');
    t.falsy(regex.test(fs.readFileSync(filePath)), 'index page is not included in sitemap');

    t.end();
  });
});

test.cb('should include query strings if enabled', function (t) {
  t.plan(4);

  exec('node cli.js --query ' + baseUrl + ':' + port + ' sitemap_query.xml',
    function (error, stdout, stderr) {
      t.is(error, null, 'no error');
      t.is(stderr, '', 'no error messages');
      var filePath = path.resolve('sitemap_query.xml');
      t.truthy(fs.existsSync(filePath));

      var regex = new RegExp('/?querypage');
      t.truthy(regex.test(fs.readFileSync(filePath)), 'query page included');

      t.end();
    }
  );
});

test.cb.after(function (t) {
  // remove test sitemaps
  fs.unlinkSync(path.resolve('sitemap_baseurl.xml'));
  fs.unlinkSync(path.resolve('sitemap_query.xml'));
  fs.unlinkSync(path.resolve('sitemap_valid.xml'));

  // stop test server
  server.close(function () {
    t.end();
  });
});
