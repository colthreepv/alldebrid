import { createStore as create, applyMiddleware } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';

let store;

function createStore (initialState) {
  if (store) return store; // singleton

  store = create(
    reducers,
    initialState || window.STATE_FROM_SERVER,
    applyMiddleware(thunk)
  );
}
export default createStore;
