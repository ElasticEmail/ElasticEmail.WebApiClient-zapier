'use strict';
const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);


describe('basic authentication', () => {
  
  zapier.tools.env.inject();

  it('should authenticate', (done) => {
    const bundle = {
      authData: {
        api_key: process.env.API_KEY,
        email: "johndoe@foobar.com"
      }
    };

    appTester(App.authentication.test, bundle)
      .then((response) => {
        done();
      })
      .catch(done);
  });

});
