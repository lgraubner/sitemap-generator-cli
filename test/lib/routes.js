/* eslint-disable */
var http = require('http');

module.exports = {
  '/': function (req, res) {
    res.writeHead(
      200,
      {
        'Content-Type': 'text/html',
      });
    res.write([
      '<a href="/bla">Link</a>',
      '<a href="/?querypage">Query</a>',
    ].join('\n'));
    res.end();
  },

  '/subpage': function (req, res) {
    res.writeHead(
      200,
      {
        'Content-Type': 'text/html',
      });
    res.write([
      '<a href="/subpage/level-2">Link</a>'
    ].join('\n'));
    res.end();
  },

  '/subpage/level-2': function (req, res) {
    res.writeHead(
      200,
      {
        'Content-Type': 'text/html',
      });
    res.end();
  },

  '/?querypage': function (req, res) {
    res.writeHead(
      200,
      {
        'Content-Type': 'text/html',
      });
    res.end();
  },
};
