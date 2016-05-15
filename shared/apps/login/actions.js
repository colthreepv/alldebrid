export const CHANGE_USERNAME = 'CHANGE_USERNAME';
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';

export function changeUsername (text) {
  return { type: CHANGE_USERNAME, text };
}

export function changePassword (text) {
  return { type: CHANGE_PASSWORD, text };
}
