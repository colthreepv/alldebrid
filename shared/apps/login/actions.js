import axios from 'axios';

export const CHANGE_USERNAME = 'CHANGE_USERNAME';
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const TRY_LOGIN = 'TRY_LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGIN_INVALID = 'LOGIN_INVALID';
export const RECAPTCHA_APPEAR = 'RECAPTCHA_APPEAR';

export function changeUsername (text) {
  return { type: CHANGE_USERNAME, text };
}

export function changePassword (text) {
  return { type: CHANGE_PASSWORD, text };
}

// async action
export function tryLogin () {
  return function (dispatch, getState) {
    const state = getState();
    const payload = {
      username: state.username,
      password: state.password
    };

    dispatch({
      type: TRY_LOGIN
    });

    return axios.post('/login', payload)
    .then(function (response) {
      switch (response.status) {
      case 200:
        return dispatch({ type: LOGIN_SUCCESS });
      case 401:
        return dispatch({ type: LOGIN_INVALID });
      case 403:
        return dispatch({ type: RECAPTCHA_APPEAR });
      default:
        return dispatch({ type: LOGIN_FAIL });
      }
    });
  };
}
