const request = require('request');

const option = {
  strictSSL: false,
};
const client = request.defaults(option);

module.exports = client;
