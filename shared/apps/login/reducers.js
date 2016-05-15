import { combineReducers } from 'redux';

function errors (state = [], action) {
  return state;
}

function username (state = 'Giorgione', action) {
  return state;
}

function password (state = '', action) {
  return state;
}

export default combineReducers({
  username,
  password,
  errors
});
