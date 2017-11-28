const log4js = require('log4js');

log4js.configure({
  appenders: {
    accessFileBackend: { type: 'file', filename: 'log/access.log' },
    appFileBackend: { type: 'file', filename: 'log/app.log' },
  },
  categories: {
    default: { appenders: ['appFileBackend'], level: 'info' },
    access: { appenders: ['accessFileBackend'], level: 'info' },
  },
});

module.exports = log4js;
