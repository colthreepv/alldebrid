import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Login from '../shared/apps/login';

const createStore = process.env.NODE_ENV === 'development' ?
  require('../shared/store.dev').default :
  require('../shared/store').default;

const store = createStore(window.STATE_FROM_SERVER);

render(
  <Provider store={store}>
    <Login/>
  </Provider>,
  document.getElementById('container')
);
