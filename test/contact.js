"use strict";
const should = require("should");

const zapier = require("zapier-platform-core");

const App = require("../index");
const appTester = zapier.createAppTester(App);

const testData = {
    email: process.env.EMAIL,
    firstName: "Joe",
    lastName: "Doe",
    customFields: {"city" : "Nowhere"},
    listName: ["zapier-test"]
};

describe("add contact action", () => {
    it("should add contact", (done) => {
        const bundle = {
            authData: {
                secretKey: process.env.API_KEY,
                publicaccountid: process.env.PUBLIC_ACCOUNT_ID
            },
            inputData: testData
          };
        appTester(App.creates.contact.operation.perform, bundle)
          .then((response) => {
            response.should.be.an.instanceOf(Object);
            done();
          })
          .catch(done);
      });
});