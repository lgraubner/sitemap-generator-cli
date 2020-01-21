const execa = require('execa');
const fs = require('fs');

afterEach(done => {
  fs.access('sitemap.xml', err => {
    if (!err) {
      fs.unlink('sitemap.xml', done);
    }
  });
});

test('should create sitemap file', () => {
  expect.assertions(1);

  return execa('node', ['index.js', 'http://example.com', 'sitemap.xml']).then(
    () => {
      expect(() => fs.accessSync('sitemap.xml')).not.toThrow();
    }
  );
}, 20000);

test('should write to stdout in verbose mode', () => {
  expect.assertions(1);

  return execa('node', [
    'index.js',
    'http://example.com',
    'sitemap.xml',
    '--verbose'
  ]).then(result => {
    expect(result.stdout).not.toBe('');
  });
}, 20000);

test('should adds last-mod header to xml', () => {
  return execa('node', [
    'index.js',
    'http://example.com',
    'sitemap.xml',
    '--last-mod'
  ]).then(() => {
    fs.readFile('sitemap.xml', 'utf8', (err, data) => {
      if (err) throw err;
      expect(data).toContain('<lastmod>');
    });
  });
}, 20000);
