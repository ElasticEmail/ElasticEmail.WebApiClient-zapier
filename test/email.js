'use strict';
const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

const testData = {
    subject: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    to: 'joandoe@gmail.com',
    from: 'johndoe@gmail.com',
    replyTo: 'johndoe@gmail.com',
    bodyText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
    ' Curabitur in lectus id ipsum laoreet dignissim in ut odio. Duis volutpat arcu dolor, eu cursus mi vestibulum ut.' +
    ' Etiam eu ipsum orci. Vestibulum aliquam eros in massa dapibus malesuada. Proin sit amet blandit nulla, eu porttitor neque.' +
    ' Duis consequat erat est, sit amet condimentum turpis sagittis sit amet. Nam fringilla, tellus ac euismod elementum,' +
    ' ipsum ante consequat nisi, ut lobortis arcu sapien vel ex. Mauris sit amet magna a ipsum porttitor hendrerit.' +
    ' Nam elementum iaculis tellus, nec euismod ante. Suspendisse nec lobortis magna, at placerat augue.' +
    ' Quisque luctus scelerisque metus, ut facilisis mi consectetur vel. Ut augue diam, ornare dictum tincidunt a,' +
    ' volutpat nec arcu. Mauris iaculis bibendum pulvinar. Quisque vestibulum, magna quis aliquam tincidunt,' +
    ' leo eros luctus nibh, eu dictum nisl velit id mauris.',
    fromName: 'John Doe',
    bodyType: 'Plain'

};

describe('email action', () => {
    it('should send an email', (done) => {
        const bundle = {
            authData: {
                api_key:process.env.API_KEY
            },
            inputData: {
              subject: testData.subject,
              to: testData.to,
              from: testData.from,
              replyTo: testData.replyTo,
              body: testData.bodyText,
              fromName: testData.fromName,
              bodyType: testData.bodyType
            }
          };
        appTester(App.creates.email.operation.perform, bundle)
          .then((response) => {
            response.should.be.an.instanceOf(Object);
            done();
          })
          .catch(done);
      });
});