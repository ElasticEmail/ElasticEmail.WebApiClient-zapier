const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const eeClient = require("elasticemail-webapiclient").client;
const sample = require("../samples/sample_email");

const sendEmail = (z, bundle) => {
    const options = {
        apiKey: bundle.authData.secretKey,
        apiUri: "https://api.elasticemail.com/",
        apiVersion: "v2"
    };

    const EE = new eeClient(options);
    console.log(EE, options);
    
    let params = {
        "subject": bundle.inputData.subject,
        "from": bundle.inputData.from
    };

    if (bundle.inputData.fromName) { 
        params.fromName = bundle.inputData.fromName;
    }
    
    if (bundle.inputData.replyTo) {
        params.replyTo = bundle.inputData.replyTo;
    }

    if (bundle.inputData.replyToName) {
        params.replyToName = bundle.inputData.replyToName;
    }

    if (bundle.inputData.msgCC) {
        params.msgCC = (_.isArray(bundle.inputData.msgCC)) ? _.join(bundle.inputData.msgCC, ", ") : bundle.inputData.msgCC;
    }

    if (bundle.inputData.msgBcc) {
        params.msgBcc = (_.isArray(bundle.inputData.msgBcc)) ? _.join(bundle.inputData.msgBcc, ", ") : bundle.inputData.msgBcc; 
    }

    if (bundle.inputData.msgCC || bundle.inputData.msgBcc) {
        params.msgTo = (_.isArray(bundle.inputData.to)) ? _.join(bundle.inputData.to, ", ") : bundle.inputData.to;
    } else {
        params.to = (_.isArray(bundle.inputData.to)) ? _.join(bundle.inputData.to, ", ") : bundle.inputData.to;
    }

    if(bundle.inputData.bodyType == "HTML") {
        params.bodyHtml = bundle.inputData.body;
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

const t = (text) => {
    return _.startCase(_.toLower(text));
}

module.exports = {
    key: "email",
    noun: "Email",
  
    display: {
      label: t("Send Email"),
      description: "Sends an email. The default, maximum (accepted by us) size of an email is 10 MB in total, with or without attachments included.",
      important: true
    },
  
    operation: {
      inputFields: [
        {
            key: "subject",
            label: t("Subject"),
            required: true,
        },
        {
            key: "from",
            label: t("From"),
            required: true,
            helpText: "From email address. Please note this email should be verfied in Elastic Email system. You can verify it on [settings](https://elasticemail.com/account/#/settings/domains) page."
        },
        {
            key: "fromName",
            label: t("From name"),
            required: false,
            helpText: "Display name for from email address"
        },
        {
            key: "replyTo",
            label: t("Reply to"),
            required: false,
            helpText: "Email address to reply to"
        },
        {
            key: "replyToName",
            label: t("Reply to name"),
            required: false,
            helpText: "Display name of the reply to address"
        },
        {
            type: "string",
            list: true,
            key: "to",
            label: t("To"),
            required: true,
            helpText: "List of email recipients."
        },
        {
            type: "string",
            list: true,
            key: "msgCC",
            label: t("CC"),
            required: false,
            helpText: "List of email recipients (visible to all other recipients of the message as CC MIME header)."
        },
        {
            type: "string",
            list: true,
            key: "msgBcc",
            label: t("Bcc"),
            required: false,
            helpText: "List of hidden email recipients."
        },
        {
            key: "bodyType",
            required: true,
            label: t("Body Type"),
            choices: ["Plain", "HTML"]
        },
        {
            key: "body",
            label: t("Body"),
            type: "text",
            required: true
        },
        {
            key: "attachmentFile",
            label: t("Attachment"),
            type: "file",
            required: false
        }
      ],
      perform: sendEmail,
      sample: sample
    }
};