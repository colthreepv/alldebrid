import { createStore as create, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

function createStore (initialState, reducers) {
  const middlewares = compose(
    applyMiddleware(thunk),
    typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
  );

  return create(
    reducers,
    initialState,
    middlewares
  );
}

export default createStore;
