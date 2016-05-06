import { combineReducers } from 'redux';

const initialTorrents = {
  list: [],
  byId: {}
};
function torrents (state = initialTorrents, action) {
  return state;
}

function loggedIn (state = false, action) {
  return state;
}

export default combineReducers({
  loggedIn,
  torrents
});
