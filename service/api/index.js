/* eslint-env node */

const _ = require('lodash');
const express = require('express');
const registry = require('./registry');
const repostitory = require('./repository');
const image = require('./image');

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

  router.get('/registrys', http(registry.list));
  router.post('/registrys', http(registry.add));
  router.delete('/registrys/:registryKey', http(registry.del));

  router.get('/registrys/:key/repos', http(repostitory.list));
  router.get('/registrys/:key/repos/:repoName', http(repostitory.get));

  router.delete('/registrys/:key/repos/:repoName/image/:imageName', http(image.del));

  return router;
};
