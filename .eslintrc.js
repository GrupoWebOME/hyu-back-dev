module.exports = {
  'env': {
    'node': true,
    'commonjs': true,
    'es2021': true,
    'browser': true
  },
  'extends': 'eslint:recommended',
  'overrides': [
  ],
  'parserOptions': {
    'ecmaVersion': 'latest'
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    /*'linebreak-style': [
      'error',
      'unix'
    ],*/
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'linebreak-style': 'off',
    'no-useless-escape': 'off',
    'no-prototype-builtins': 'off',
    'use-isnan': 'off'
  }
}
