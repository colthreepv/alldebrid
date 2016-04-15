import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import App from '../src/app';
import Login from '../src/login';

const store = process.env.NODE_ENV === 'development' ?
  require('../src/store.dev').default :
  require('../src/store').default;

const history = syncHistoryWithStore(browserHistory, store);

store.subscribe(() => {
  console.log(store.getState().routing);
});

function isAuthenticated (nextState, replace) {
  if (store.getState().loggedIn) return;
  replace('/login');
}

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App} onEnter={isAuthenticated}/>
      <Route path="/login" component={Login}/>
    </Router>
  </Provider>,
  document.getElementById('container')
);
