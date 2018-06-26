
const fs = require('fs');
const path = require('path');

const eeClient = require('elasticemail-webapiclient').client;
const sample = require('../samples/sample_email');

const sendEmail = (z, bundle) => {
    const options = {
        apiKey: bundle.authData.api_key,
        apiUri: 'https://api.elasticemail.com/',
        apiVersion: 'v2'
    };

    const EE = new eeClient(options);
    let params = {
        'subject': bundle.inputData.subject,
        'from': bundle.inputData.from,
        'fromName': bundle.inputData.fromName || null,
        'replyTo': bundle.inputData.replyTo || null,
        'replyToName': bundle.inputData.replyToName || null,
        'msgCC': bundle.inputData.msgCC || null,
        'msgBcc': bundle.inputData.msgBcc || null,
        'isTransactional': false
    };

    if (bundle.inputData.msgCC || bundle.inputData.msgBcc) {
        params.msgTo = bundle.inputData.to;
    } else {
        params.to = bundle.inputData.to;
    }

    if(bundle.inputData.bodyType == "HTML") {
        params.bodyHtml = bundle.inputData.body
    } else {
        params.bodyText = bundle.inputData.body;
    }

    if (bundle.inputData.attachmentFile) {
        params.attachmentFiles = { 
            value: fs.createReadStream(bundle.inputData.attachmentFile),
            options: { filename: path.basename(bundle.inputData.attachmentFile), contentType: null }
        };
    }

    return EE.Email.Send(params);
}

module.exports = {
    key: 'email',
    noun: 'Email',
  
    display: {
      label: 'Send an Email',
      description: 'Submit emails. The default, maximum (accepted by us) size of an email is 10 MB in total, with or without attachments included.',
      important: true
    },
  
    operation: {
      inputFields: [
        {
            key: 'subject',
            label:'Subject',
            required: true,
        },
        {
            key: 'from',
            label: 'From',
            required: true,
            helpText: 'From email address. Please note this email should be verfied in Elastic Email system. You can verify it on [settings](https://elasticemail.com/account/#/settings/domains]) page.'
        },
        {
            key: 'fromName',
            label: 'From name',
            required: false,
            helpText: 'Display name for from email address'
        },
        {
            key: 'replyTo',
            label: 'Reply to',
            required: false,
            helpText: 'Email address to reply to'
        },
        {
            key: 'replyToName',
            label: 'Reply to name',
            required: false,
            helpText: 'Display name of the reply to address'
        },
        {
            type: "string",
            list: true,
            key: 'to',
            label: 'To',
            required: true,
            helpText: 'List of email recipients.'
        },
        {
            type: "string",
            list: true,
            key: 'msgCC',
            label: 'CC',
            required: false,
            helpText: 'List of email recipients (visible to all other recipients of the message as CC MIME header).'
        },
        {
            type: "string",
            list: true,
            key: 'msgBcc',
            label: 'Bcc',
            required: false,
            helpText: 'List of hidden email recipients.'
        },
        {
            key: "bodyType",
            required: true,
            label: "Body Type",
            choices: ["Plain", "HTML"]
        },
        {
            key: "body",
            label: "Body",
            type: "text",
            required: true
        },
        {
            key: 'attachmentFile',
            label: 'Attachment',
            type: 'file',
            required: false,
            helpText: 'Attachment file'
        }
      ],
      perform: sendEmail,
      sample: sample
    }
};