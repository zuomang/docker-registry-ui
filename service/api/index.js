const _ = require('lodash');
const express = require('express');
const registry = require('./registry');

let http = function http(apiMethod) {
    return function apiHandler(req, res, next) {
        let object = req.body;
        let options = _.extend({}, {ip: req.ip}, req.query, req.params);

        if(_.isEmpty(object)) {
            object = {};
        }

        return apiMethod(object = object, options = options).then(function(data) {
            res.set('Content-Type', 'application/json');
            res.json({
                message: data
            });
        }).catch(function(error) {
            res.set('Content-Type', 'application/json');
            res.status(500).json({
                message: error.message
            })
        });
    }
}

module.exports = function apiRouter() {
    let apiRouter = express.Router();

    apiRouter.get('/registrys', http(registry.browse));
    apiRouter.post('/registrys', http(registry.add));
    apiRouter.delete('/registrys/:registryKey', http(registry.del));

    return apiRouter;
}