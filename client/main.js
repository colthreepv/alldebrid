import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Main from '../shared/apps/main';
import createStore from '../shared/store';
import reducers from '../shared/apps/main/reducers';

const store = createStore(window.STATE_FROM_SERVER, reducers);

render(
  <Provider store={store}>
    <Main/>
  </Provider>,
  document.getElementById('container')
);
