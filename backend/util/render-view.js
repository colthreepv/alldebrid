'use strict';
const path = require('path');

const config = require('../config');
const createState = require('./create-state');
const freshReq = require('./fresh-require').createFreshRequire;

const createStoreReq = freshReq('../../shared/store');

// loads appropriate reducers for the specific appName
function resolveReducers (appName) {
  return path.join(config.apps[appName], 'reducers');
}

function renderView (templateFn, appName) {
  const reducersReq = freshReq(resolveReducers(appName));
  return function (req) {
    const createStore = createStoreReq().default;
    const reducers = reducersReq().default;

    const initialState = createState(req.session);
    const store = createStore(initialState, reducers);

    return templateFn(store);
  };
}

module.exports = renderView;
