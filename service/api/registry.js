/* global APPROOT_PATH:false, REGISTRY_CONFIG_PATH:false, REGISTRY_CACHE_KEY:false */
/* eslint-env node */

const cache = require('../utils/cache');
const fs = require('fs');
const Promise = require('bluebird');

const stringUtil = require('../utils/string');
const client = require('../utils/client');
const logger = require('../utils/logger').getLogger(__filename.replace(APPROOT_PATH, ''));

function flush(registrys) {
  // flush registrys into cache
  cache.set(REGISTRY_CACHE_KEY, registrys);
  logger.info('Success flush registry into cache');

  // flush registrys into fs
  fs.writeFileSync(REGISTRY_CONFIG_PATH, JSON.stringify(registrys));
  logger.info('Success flush registry into fs');
}

const registry = {
  browse: function browse() {
    const registrys = cache.get(REGISTRY_CACHE_KEY);
    return Promise.resolve(registrys);
  },

  add: function add(object) {
    const key = stringUtil.md5(object.name);
    const registrys = cache.get(REGISTRY_CACHE_KEY);
    const newRegistry = {};

    if (key in registrys) {
      return Promise.reject(new Error('Already had exists the registry'));
    }
    return new Promise(((resolve, reject) => {
      client.get(object.url, (error, response) => {
        if (error) {
          reject(error);
        }
        if (response && response.statusCode === 200) {
          try {
            registrys[key] = object;
            flush(registrys);
          } catch (e) {
            reject(e);
          }
          newRegistry[key] = object;
          resolve(newRegistry);
        }
      });
    }));
  },

  del: function del(object, options) {
    const key = options.registryKey;
    const registrys = cache.get(REGISTRY_CACHE_KEY) || {};

    if (key in registrys) {
      delete registrys[key];
      flush(registrys);

      return Promise.resolve(registrys);
    }
    return Promise.reject(new Error('Can not contains the registry'));
  },
};

module.exports = registry;
