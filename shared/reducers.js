import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

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
  torrents,
  routing
});
