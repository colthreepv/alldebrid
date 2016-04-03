import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './app';

const store = process.env.NODE_ENV === 'development' ?
  require('./store.dev').default :
  require('./store').default;

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('container')
);
