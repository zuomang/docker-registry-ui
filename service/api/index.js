/* eslint-env node */

const _ = require('lodash');
const express = require('express');
const registry = require('./registry');
const repostitory = require('./repository');

const http = function http(apiMethod) {
  return function apiHandler(req, res) {
    let object = req.body;
    const options = _.extend({}, { ip: req.ip }, req.query, req.params);

    if (_.isEmpty(object)) {
      object = {};
    }

    return apiMethod(options, object).then((data) => {
      res.set('Content-Type', 'application/json');
      res.json({
        message: data,
      });
    }).catch((error) => {
      res.set('Content-Type', 'application/json');
      res.status(500).json({
        message: error.message,
      });
    });
  };
};

module.exports = function apiRouter() {
  const router = express.Router();

  router.get('/registrys', http(registry.browse));
  router.post('/registrys', http(registry.add));
  router.delete('/registrys/:registryKey', http(registry.del));

  router.get('/registrys/:key', http(repostitory.list));

  return router;
};
