import { base62 } from '../base62';

const MIN_VALUE = Math.pow(62, 7);
const MAX_VALUE = Math.pow(62, 8);

export default function () {
  const numericVal = Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1) + MIN_VALUE);
  return base62(numericVal);
}
