'use strict';

function createState (reqSession) {
  // :: magic here ::
  console.log('createState');
  console.log(reqSession);
  return {};
}

module.exports = createState;
