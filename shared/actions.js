export const ADD_TORRENT = 'ADD_TORRENT';
export const REMOVE_TORRENT = 'REMOVE_TORRENT';
export const SELECT_TORRENT = 'SELECT_TORRENT';
export const DESELECT_TORRENT = 'DESELECT_TORRENT';
export const COMPLETE_TORRENT = 'COMPLETE_TORRENT';

function addTorrent (magnet) {
  return { type: ADD_TORRENT, magnet };
}

// export function saveState () {
//   return function (dispatch, getState) {
//     dispatch({ type: SAVE_STATE_START });
//     return axios.post('/state', getState())
//       .then(() => {
//         dispatch({ type: SAVE_STATE_DONE });
//       });
//   };
// }
