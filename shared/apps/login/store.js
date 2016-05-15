import { createStore as create, applyMiddleware } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';

let store;

function createStore (initialState) {
  if (store) return store; // singleton

  store = create(
    reducers,
    initialState,
    applyMiddleware(thunk)
  );
  return store;
}
export default createStore;
