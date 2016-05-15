import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Login from '../shared/apps/login';
import createStore from '../shared/store';
import reducers from '../shared/apps/login/reducers';

const store = createStore(window.STATE_FROM_SERVER, reducers);

render(
  <Provider store={store}>
    <Login/>
  </Provider>,
  document.getElementById('container')
);
