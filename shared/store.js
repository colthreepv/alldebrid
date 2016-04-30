import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';

export default createStore(
  reducers,
  // window.STATE_FROM_SERVER,
  applyMiddleware(thunk)
);
