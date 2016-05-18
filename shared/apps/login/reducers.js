import { CHANGE_USERNAME, CHANGE_PASSWORD, TRY_LOGIN, LOGIN_SUCCESS, LOGIN_FAIL } from './actions';

import { combineReducers } from 'redux';

function errors (state = [], action) {
  return state;
}

function username (state = 'Giorgione', action) {
  switch (action.type) {
  case CHANGE_USERNAME:
    return action.text;
  default:
    return state;
  }
}

function password (state = '', action) {
  switch (action.type) {
  case CHANGE_PASSWORD:
    return action.text;
  default:
    return state;
  }
}

function formDisabled (state = false, action) {
  switch (action.type) {
  case TRY_LOGIN:
    return true;
  case LOGIN_FAIL:
  case LOGIN_SUCCESS:
    return false;
  default:
    return state;
  }
}

export default combineReducers({
  username,
  password,
  errors,
  formDisabled
});
