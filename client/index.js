import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';

import routes from '../shared/routes';

const store = process.env.NODE_ENV === 'development' ?
  require('../shared/store.dev').default :
  require('../shared/store').default;

store.subscribe(() => {
  console.log(store.getState().routing);
});

render(
  <Provider store={store}>
    <Router history={browserHistory} children={routes} />
  </Provider>,
  document.getElementById('container')
);
