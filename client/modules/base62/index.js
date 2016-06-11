const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function base62 (integer) {
  if (integer === 0) return '0';
  let s = '';
  let decrementing = integer;
  while (decrementing > 0) {
    s = ALPHABET[decrementing % 62] + s;
    decrementing = Math.floor(decrementing/62);
  }
  return s;
}
