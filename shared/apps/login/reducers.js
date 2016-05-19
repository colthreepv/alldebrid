import { CHANGE_USERNAME, CHANGE_PASSWORD } from './actions';
import { TRY_LOGIN, LOGIN_SUCCESS, LOGIN_FAIL, LOGIN_INVALID, RECAPTCHA_APPEAR } from './actions';

import { combineReducers } from 'redux';

function errors (state = [], action) {
  const errs = [];
  switch (action.type) {
  case RECAPTCHA_APPEAR:
    errs.push('Recaptcha appeared, login on alldebrid.com');
    return errs;
  case LOGIN_INVALID:
    errs.push('username/password invalid');
    return errs;
  case LOGIN_FAIL:
    errs.push('Login failed for unknown reasons, check your internet connection.');
    return errs;
  default:
    return state;
  }
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
  case LOGIN_INVALID:
  case RECAPTCHA_APPEAR:
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
