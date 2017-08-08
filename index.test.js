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

  return execa('node', [
    'index.js',
    'https://larsgraubner.com',
    'sitemap.xml',
  ]).then(() => {
    expect(() => fs.accessSync('sitemap.xml')).not.toThrow();
  });
});

test('should write to stdout in verbose mode', () => {
  expect.assertions(1);

  return execa('node', [
    'index.js',
    'https://larsgraubner.com',
    'sitemap.xml',
    '--verbose',
  ]).then(result => {
    expect(result.stdout).not.toBe('');
  });
});
