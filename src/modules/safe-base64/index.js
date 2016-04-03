export function base64 (str) {
  return btoa(str).replace('+', '.').replace('/', '_');
}

export function decode64 (str) {
  return atob(str.replace('.', '+').replace('_', '/'));
}
