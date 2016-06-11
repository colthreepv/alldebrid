'use strict';

function createState (reqSession) {
  // :: magic here ::
  console.log('uid', reqSession.uid);
  return { uid: reqSession.uid };
}

exports = module.exports = createState;
exports['@literal'] = true;
