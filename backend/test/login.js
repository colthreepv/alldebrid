'use strict';
const path = require('path');
const assert = require('chai').assert;

const lvl = require('../components/storage').lvl;
const api = require('../api');
const testAccount = require(path.join(__dirname, '../..', 'test-account.json'));

describe('login API', function () {
  it('should not work with incorrect values', (done) => {
    const req = {
      body: {
        username: 'dood',
        password: 'blabberish'
      }
    };

    api.login(req)
    .then(done) // should not succeed
    .catch(response => {
      // console.log('Login Response');
      // console.dir(response);
      // expect(response).to.contain.keys(['logged', 'recaptcha']);
      // expect(response.logged).to.be.equal(false);
      assert.isObject(response);
      assert.property(response, 'message');
      assert.include(response.message, 'invalid username/password');
      assert.propertyVal(response, 'message', 'invalid username/password');
    }).then(done);
  });

  it('should work with correct values', () => {
    const req = {
      body: {
        username: testAccount.username,
        password: testAccount.password
      },
      session: {} // mock express-session
    };

    return api.login(req).then(response => {
      // console.log('Login Response');
      // console.dir(response);
      assert.isObject(response);
      assert.property(response, 'redirect');
      assert.propertyVal(response, 'status', 'ok');
    });
  });

  // correctly closes leveldb after every test run
  // otherwise mocha --watch fails
  after(function (done) {
    lvl.close(done);
  });
});
