'use strict';
const createState = require('./create-state');
const freshReq = require('./fresh-require').createFreshRequire;
const storeReq = freshReq('../../shared/store');

function renderView (templateFn) {
  return function (req) {
    const createStore = storeReq().default;

    const initialState = createState(req.session);
    const store = createStore(initialState);

    return templateFn(store);
  };
}

module.exports = renderView;
