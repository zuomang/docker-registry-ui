const cache = require('../utils/cache');
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

const stringUtil = require('../utils/string');
const client = require('../utils/client');
const logger = require('../utils/logger').getLogger(__filename.replace(APPROOT_PATH, ''));

function flush(registrys) {
    // flush registrys into cache
    cache.set(REGISTRY_CACHE_KEY, registrys);
    logger.info("Success flush registry into cache");

    // flush registrys into fs
    fs.writeFileSync(REGISTRY_CONFIG_PATH, JSON.stringify(registrys));
    logger.info("Success flush registry into fs");
}

registrys = {
    browse: function browse(object, options) {
        object = object || {};
        options = options || {};

        let registrys = cache.get(REGISTRY_CACHE_KEY);
        return Promise.resolve(registrys);
    },

    add: function add(object, options) {
        object = object || {};
        options = options || {};

        let key = stringUtil.md5(object["name"]);
        let registrys = cache.get(REGISTRY_CACHE_KEY);
        
        if(key in registrys) {
            return Promise.reject(new Error("Already had exists the registry"));
        } else {
            return new Promise(function(resolve, reject) {
                client.get(object["url"], function(error, response, body) {
                    if(error) {
                        reject(error);
                    }
                    if(response && response.statusCode === 200) {
                        try {
                            registrys[key] = object;
                            flush(registrys);
                        } catch(e) {
                            reject(e);
                        }
                        resolve(registrys);
                    }
                });
            });
        }
    },

    del: function del(object, options) {
        object = object || {};
        options = options || {};

        let key = options['registryKey'];
        let registrys = cache.get(REGISTRY_CACHE_KEY) || {};

        if(key in registrys) {
            delete registrys[key];
            flush(registrys)

            return Promise.resolve(registrys);
        } else {
            return Promise.reject(new Error("Can not contains the registry"));
        }
    }
}

module.exports = registrys;