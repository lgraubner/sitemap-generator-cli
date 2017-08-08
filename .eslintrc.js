module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier'],
  env: {
    jest: true,
  },
  rules: {
    'no-console': 0,
  },
};
