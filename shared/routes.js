import React from 'react';
import { Route } from 'react-router';

import App from './app';
import Login from './login';

function isAuthenticated (nextState, replace) {
  console.log('nextState');
  console.log(nextState);
  // if (store.getState().loggedIn) return;
  // replace('/login');
}

// TODO: come faccio a mandare gli utenti non autenticati su /login?
export default (
  <Route onEnter={isAuthenticated}>
    <Route path="/" component={App}/>
    <Route path="/login" component={Login} />
  </Route>
);
