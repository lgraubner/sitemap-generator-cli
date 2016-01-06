/* globals it:false, before:false, describe:false */
/* eslint no-unused-expressions: 0 */
/* eslint-env node, mocha */

var should = require('chai').should();
var exec = require('child_process').exec;
var fs = require('fs');

require('./lib/testserver.js');

describe('$ sitemap-generator invalid', function () {
  var _error;
  var _stderr;

  before(function (done) {
    fs.stat('./sitemap.xml', function (err) {
      if (err && err.code !== 'ENOENT') {
        fs.unlink('./sitemap.xml');
      }
    });
    exec('node ./index.js illegal', function cmd(error, stdout, stderr) {
      _error = error;
      _stderr = stderr;
      done();
    });
  });

  it('should fail because of invalid url', function () {
    _stderr.should.not.be.empty;
  });

  it('should exit with error code "1"', function () {
    _error.code.should.equal(1);
  });

  it('should not create an xml file', function (done) {
    fs.stat('./sitemap.xml', function (err) {
      err.code.should.equal('ENOENT');
      done();
    });
  });
});

describe('$ sitemap-generator 127.0.0.1', function () {
  var _error;
  var _stdout;
  var _stderr;
  this.timeout(10000);

  after(function () {
    fs.unlink('./sitemap.xml');
  });

  before(function (done) {
    exec('node ./index.js 127.0.0.1', function cmd(error, stdout, stderr) {
      _error = error;
      _stdout = stdout;
      _stderr = stderr;
      done();
    });
  });

  it('should not throw any errors', function () {
    _stderr.should.be.empty;
    should.equal(_error, null);
  });

  it('should return success message', function () {
    _stdout.should.not.be.empty;
  });

  it('should create an xml file', function (done) {
    fs.stat('./sitemap.xml', function (err) {
      should.equal(err, null);
      done();
    });
  });

  it('should contain xml markup', function (done) {
    fs.readFile('./sitemap.xml', function (err, data) {
      var content = data.toString();
      content.should.contain('<?xml version="1.0" encoding="UTF-8"?>');
      content.should.match(/<url>(\s|\S)*?<loc>\S+?<\/loc>(\s|\S)*?<\/url>/);
      done();
    });
  });

  it('should take robots.txt into account', function (done) {
    fs.readFile('./sitemap.xml', function (err, data) {
      data.toString().should.not.contain('127.0.0.1/ignore');
      done();
    });
  });
});

describe('$ sitemap-generator http://127.0.0.1/foo/bar', function () {
  var _error;
  var _stderr;

  after(function () {
    fs.unlink('./sitemap.xml');
  });

  before(function (done) {
    exec('node ./index.js http://127.0.0.1', function cmd(error, stdout, stderr) {
      _error = error;
      _stderr = stderr;
      done();
    });
  });

  it('should ignore protocol and path', function () {
    _stderr.should.be.empty;
    should.equal(_error, null);
  });
});

describe('$ sitemap-generator --filename=test 127.0.0.1', function () {
  this.timeout(10000);

  after(function () {
    fs.unlink('./test.xml');
  });

  before(function (done) {
    exec('node ./index.js --filename=test 127.0.0.1', function () {
      done();
    });
  });

  it('should create an xml file with the correct name', function (done) {
    fs.stat('./test.xml', function (err) {
      should.equal(err, null);
      done();
    });
  });
});

describe('$ sitemap-generator --query 127.0.0.1', function () {
  after(function () {
    fs.unlink('./sitemap.xml');
  });

  before(function (done) {
    exec('node ./index.js --query 127.0.0.1', function cmd() {
      done();
    });
  });

  it('should include links with query parameters', function (done) {
    fs.readFile('./sitemap.xml', function (err, data) {
      data.toString().should.contain('/site/?foo=bar');
      done();
    });
  });
});

describe('$ sitemap-generator --path=./tmp 127.0.0.1', function () {
  after(function () {
    fs.unlink('./tmp/sitemap.xml');
    fs.rmdir('./tmp');
  });

  before(function (done) {
    fs.mkdir('./tmp');

    exec('node ./index.js --path=./tmp 127.0.0.1', function cmd() {
      done();
    });
  });

  it('should create xml file in given path', function (done) {
    fs.stat('./tmp/sitemap.xml', function (err) {
      should.equal(err, null);
      done();
    });
  });
});
