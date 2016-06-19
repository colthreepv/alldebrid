'use strict';
const XError = require('x-error');
const codes = {};

function add (code, message) {
  if (codes[code]) throw new Error(`Code ${code} is not unique. Current: ${codes[code]}`);
  codes[code] = message;
  return function () {
    return new XError(code, message);
  };
}

function list () {
  return Object.keys(codes).map(code => `\x1b[35m${code}: \x1b[36m${codes[code]}\x1b[0m`).join('\n');
}

module.exports = { add, list };
