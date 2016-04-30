module.exports = {
  extends: [
    'plugin:react/recommended'
  ],
  env: {
    browser: true,
    es6: true
  },
  plugins: ['react'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'react/jsx-curly-spacing': [2, 'never']
  }
};
