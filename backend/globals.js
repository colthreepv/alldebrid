'use strict';
const isProd = process.env.NODE_ENV === 'production';
if (!isProd) Error.stackTraceLimit = Infinity;

global.isProd = isProd;
global.Promise = require('bluebird');
global.XError = require('x-error');
