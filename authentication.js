'use strict';
const request = require("request");

const testAuth = (z , bundle) => {
  return z.request({
      url:  'https://api.elasticemail.com/v2/account/verify?apikey={{bundle.authData.secretKey}}',
    }).then((response) => {
      if (!response.json.success) {
        throw new Error(response.json.error);
      }
      return response.json;
    });
};

const getSessionKey = (z, bundle) => {
  return z.request({
    method: 'POST',
    url:  'https://api.elasticemail.com/v2/account/login',
    form: {
      username: bundle.authData.email,
      password: bundle.authData.password
    }
  })
  .then((resp) => {
    if (!resp.json.success) { throw new Error(resp.json.error); }

    return {
      sessionKey: resp.json.data,
      secretKey: resp.json.data
    };
  });
};

const authentication = {
  type: "session",
  test: testAuth,
  connectionLabel: '{{bundle.authData.email}}',
  fields: [
    {
      key: 'email',
      label: 'Email',
      type: 'string',
      required: true,
    },
    {
      key: 'password',
      label: 'Password',
      type: 'password',
      required: true
    },
    {
      key: 'secretKey',
      type: 'string',
      required: false,
      computed: true
    }
  ],
  sessionConfig: {
    perform: getSessionKey
  }
};



module.exports = authentication;