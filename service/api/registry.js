const cache = require('../utils/cache');
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

const stringUtil = require('../utils/string');
const client = require('../utils/client');
const logger = require('../utils/logger').getLogger(__filename.replace(global.appRoot, ''));

const REGISTRY_CONFIG_PATH = path.join(__dirname, "../config/registry.json");
const REGISTRY_CACHE_KEY = "registrys";

function flush(key, data) {
    let registrys = cache.get(REGISTRY_CACHE_KEY) || {};
    registrys[key] = data;
    cache.set(REGISTRY_CACHE_KEY, registrys);

    fs.writeFileSync(REGISTRY_CONFIG_PATH, JSON.stringify(registrys));
    logger.info("Success flush registry json file");
    return registrys;
}

registrys = {
    browse: function browse(object, options) {
        object = object || {};
        options = options || {};

        let isExistCache = cache.has(REGISTRY_CACHE_KEY);
        let registrys = {};

        if (!isExistCache) {
            if(fs.existsSync(REGISTRY_CONFIG_PATH)) {
                registrys = JSON.parse(fs.readFileSync(REGISTRY_CONFIG_PATH));
                cache.set(REGISTRY_CACHE_KEY, registrys, 0);
            } else {
                cache.set(REGISTRY_CACHE_KEY, {}, 0);
            }
        } else {
            registrys = cache.get(REGISTRY_CACHE_KEY);
        }
        
        return Promise.resolve(registrys);
    },

    add: function add(object, options) {
        object = object || {};
        options = options || {};

        let key = stringUtil.md5(object["name"]);
        let registrys = cache.get(REGISTRY_CACHE_KEY) || {};
        
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
                            registrys = flush(key, object);
                        } catch(e) {
                            reject(e);
                        }
                        resolve(registrys);
                    }
                });
            });
        }
    }
}

module.exports = registrys;