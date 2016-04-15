import React from 'react';
import { Router, Route } from 'react-router';


export default (
  <Router history={history}>
    <Route path="/" component={App} onEnter={isAuthenticated}/>
    <Route path="/login" component={Login}/>
  </Router>
);
