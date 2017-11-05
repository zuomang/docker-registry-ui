const request = require('request');

let option = {
    strictSSL: false
};
let client = request.defaults(option);

module.exports = client;