'use strict';
const path = require('path');
const assert = require('assert');

const config = require('../config');
const isProd = process.env.NODE_ENV === 'production';

const CODE_DIR = config.sharedCode;

/**
 * Fresh Require lets you swap require() calls with freshreq()
 * It will watch for changes and reload files accordingly.
 */
function createFreshRequire (file) {
  const resolvedPath = require.resolve(file);
  assert(path.isAbsolute(resolvedPath)); // FIXME

  let isWatching = false;
  let lib = require(file);

  // TODO: convert to tj/debug
  if (!isProd) console.log(`Fresh Require --- : ${resolvedPath}. Loaded`);

  return function () {
    if (!isProd) {
      const watch = require('node-watch');
      if (!isWatching) watch(resolvedPath, updateApp);
      isWatching = true;
    }

    function updateApp () {
      delete require.cache[require.resolve(resolvedPath)];
      lib = require(resolvedPath);
      if (!isProd) console.log(`Fresh Require --- : ${resolvedPath}. Reloaded code`);
    }

    return lib;
  };

}

// reqApp is a shorthand to fresh load the main application
const reqApp = createFreshRequire(CODE_DIR);

module.exports = { reqApp, createFreshRequire };
