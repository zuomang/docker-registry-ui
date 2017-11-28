/* eslint-env node */

const _ = require('lodash');
const express = require('express');
const registry = require('./registry');

const http = function http(apiMethod) {
  return function apiHandler(req, res) {
    let object = req.body;
    const options = _.extend({}, { ip: req.ip }, req.query, req.params);

    if (_.isEmpty(object)) {
      object = {};
    }

    return apiMethod(object, options).then((data) => {
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

  return router;
};
