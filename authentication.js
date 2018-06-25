'use strict';

const testAuth = (z , bundle) => {

  return z.request({
      url:  'https://api.elasticemail.com/v2/account/verify?apikey={{bundle.authData.api_key}}',
    }).then((response) => {
      if (!response.json.success) {
        throw new Error(response.json.error);
      }
      return response.json;
    });
};

const authentication = {
  type: 'custom',
  test: testAuth,
  connectionLabel: '{{bundle.authData.email}}',
  fields: [
    {
      key: 'api_key',
      label: "API key",
      type: 'string',
      required: true,
      helpText: 'Found on your [settings page](https://elasticemail.com/account/#/settings/apiconfiguration).'
    },
    {
      key: 'email',
      label: 'Email',
      type: 'string',
      required: true,
      helpText: 'Elastic Email login'
    }
  ]
};

module.exports = authentication;
