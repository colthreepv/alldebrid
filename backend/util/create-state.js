'use strict';

function createState (reqSession) {
  // :: magic here ::
  console.log('uid', reqSession.uid);
  return { uid: reqSession.uid };
}

module.exports = createState;
