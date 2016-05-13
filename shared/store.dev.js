import { base64, decode64 } from './modules/safe-base64';
import createStore from './store';

const location = window.location;

const lochash = location.hash.substr(1);
const hashState = lochash.substr(lochash.indexOf('state=')).split('&')[0].split('=')[1];

if (hashState) { // recover application state from the hash
  const b64state = decode64(hashState);
  window.STATE_FROM_SERVER = JSON.parse(b64state);
}

function createDevStore (initialState) {
  const store = createStore(initialState);

  // in development every change to the store gets serialized into
  // window.CURRENT_STATE
  store.subscribe(() => {
    const state = store.getState();
    const b64state = base64(JSON.stringify(state));
    const baseUrl = location.origin;
    window.CURRENT_STATE = `${baseUrl}/#state=${b64state}`;
  });
  return store;
}
export default createDevStore;
