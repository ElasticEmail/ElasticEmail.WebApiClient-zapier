const _ = require("lodash");

const t = (text) => {
    return _.startCase(_.toLower(text));
}

module.exports = t;