'use strict';
const Promise = require('bluebird');

module.exports = function fetchComponentData (store, renderProps) {
  const dispatch = store.dispatch;
  const components = renderProps.components;
  const params = renderProps.params;

  const needs = components.reduce((prev, current) => {

    return current ? (current.needs || []).concat(prev) : prev;
  }, []);

  const promises = needs.map(need => dispatch(need(params)));

  return Promise.all(promises).return([store, renderProps]);
};
