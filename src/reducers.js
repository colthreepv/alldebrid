import { combineReducers } from 'redux';

const initialTorrents = {
  list: [],
  byId: {}
};
function torrents (state = initialTorrents, action) {
  return state;
}

export default combineReducers({ torrents });
