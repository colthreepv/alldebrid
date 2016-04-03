import generator from './modules/id-generator';
import { combineReducers } from 'redux';

const firstTorrent = {
  id: generator(),
  name: 'First bad torrent'
};

const fakeTorrents = {
  list: [],
  byId: {}
};
fakeTorrents.byId[firstTorrent.id] = firstTorrent;
function torrents(state = fakeTorrents, action) {
  return state;
}

export default combineReducers({ torrents });
