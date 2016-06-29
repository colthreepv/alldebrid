'use strict';

module.exports = {
  extends: 'eslint:recommended',
  env: {
    node: true,
    es6: true
  },
  rules: {
    'arrow-spacing': 2,
    'brace-style': [2, '1tbs', { allowSingleLine: true }],
    'comma-style': [2, 'last'],
    'default-case': 2,
    'func-style': [2, 'declaration', { allowArrowFunctions: true }],
    'guard-for-in': 0,
    'keyword-spacing': 2,
    'new-cap': 0,
    'no-console': 0,
    'no-delete-var': 2,
    'no-floating-decimal': 2,
    'no-mixed-requires': 0,
    'no-nested-ternary': 2,
    'no-sequences': 0,
    'no-shadow': 0,
    'no-undef': 2,
    'no-unused-vars': [1, { vars: 'all', args: 'after-used' }],
    'no-var': 0,
    'object-curly-spacing': [2, 'always'],
    'prefer-const': 1,
    'space-before-blocks': 2,
    'space-before-function-paren': 2,
    'spaced-comment': [2, 'always', { exceptions: ['-'] }],
    'template-curly-spacing': 2,
    'valid-jsdoc': [0, { prefer: { return: 'returns' } }],
    curly: [2, 'multi-line'],
    indent: [2, 2],
    quotes: [1, 'single'],
    radix: 2,
    semi: [2, 'always'],
    strict: 0
  },
  root: true
};
