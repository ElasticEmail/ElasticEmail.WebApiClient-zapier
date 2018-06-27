'use strict';
const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);


describe('basic authentication', () => {
  
  zapier.tools.env.inject();

  it('has an exchange for username/password', (done) => {
    // Try changing the values of username or password to see how the test method behaves
    const bundle = {
      authData: {
        email: "email",
        password: "password"
      }
    };

    appTester(App.authentication.sessionConfig.perform, bundle)
      .then((newAuthData) => {
        newAuthData.sessionKey.should.eql(process.env.API_KEY);
        done();
      })
      .catch(done);
  });
});
