const eeClient = require("elasticemail-webapiclient").client;
const t = require("../utils/TitleCase");
const sample = require("../samples/sample_contact");
const _ = require("lodash");

const addContact = (z, bundle) => {
    const options = {
        apiKey: bundle.authData.secretKey,
        apiUri: "https://api.elasticemail.com/",
        apiVersion: "v2"
    };

    const EE = new eeClient(options);

    let params = {
        "email": bundle.inputData.email,
        "publicaccountid": bundle.authData.publicaccountid
    };

    if (bundle.inputData.listName) {
        params.listName = (_.isArray(bundle.inputData.listName)) ? _.join(bundle.inputData.listName, ", ") : bundle.inputData.listName;
    } else {
        params.allContacts = "true";
    }

    if (bundle.inputData.firstName) params.firstName = bundle.inputData.firstName;
    if (bundle.inputData.lastName) params.lastName = bundle.inputData.lastName;
    if (bundle.inputData.sendActivation) params.sendActivation = bundle.inputData.sendActivation;
    if (bundle.inputData.activationReturnUrl) params.activationReturnUrl = bundle.inputData.activationReturnUrl;

    if (bundle.inputData.customFields && !_.isEmpty(bundle.inputData.customFields)) {
        _.forOwn(bundle.inputData.customFields, (value, key) => {
            params["field_" + key] = value;
        });
    }

    return EE.Contact.Add(params)
    .catch((err) => {
        throw new Error(err);
    });

};

module.exports = {
    key: "contact",
    noun: "Contact",
  
    display: {
      label: t("Add Contact"),
      description: "Add a new contact and optionally to one of your lists.",
      important: true
    },

    operation: {
        inputFields: [
            {
                key: "email",
                label: t("Email"),
                required: true,
            },
            {
                type: "string",
                list: true,
                key: "listName",
                label: t("List Name"),
                required: false,
                helpText: "Name of your existing [list](https://elasticemail.com/account/#/contacts/staticlists). You can create new list in [dashboard](https://elasticemail.com/account/#/contacts/staticlists) by selecting Edit Contacts -> Create List. If name will be not specfied, contact will be added to 'All' list. "
            },
            {
                key: "firstName",
                label: t("First name"),
                required: false
            },
            {
                key: "lastName",
                label: t("Last name"),
                required: false
            },
            {
                key: "customFields",
                label: t("Custom fields"),
                type: "string",
                dict: true,
                required: false,
                helpText: "Custom contact fields like firstname, lastname, city etc. Make sure you added them in [dashboard](https://elasticemail.com/account/#/contacts/managefields) before."
            },
            {
                key: "sendActivation",
                label: t("Send Activation"),
                type: "boolean",
                required: false,
                helpText: "True, if you want to send activation email to this account. Otherwise, false"
            },
            {
                key: "activationReturnUrl",
                label: t("Activation Return Url"),
                required: false,
                helpText: "The url to return the contact to after activation."
            },
        ],
        perform: addContact,
        sample: sample
    }
};