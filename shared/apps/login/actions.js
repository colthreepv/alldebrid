export const CHANGE_USERNAME = 'CHANGE_USERNAME';
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const TRY_LOGIN = 'TRY_LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';

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
    dispatch({
      type: TRY_LOGIN,
      data: {
        username: state.username,
        password: state.password
      }
    });

    // FIXME: there is no API for now
    setTimeout(function () {
      dispatch({ type: LOGIN_SUCCESS });
    }, 500);
  };
}
