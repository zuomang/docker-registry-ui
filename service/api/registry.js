/* global APPROOT_PATH:false, REGISTRY_CONFIG_PATH:false, REGISTRY_CACHE_KEY:false */
/* eslint-env node */

const cache = require('../utils/cache');
const fs = require('fs');
const Promise = require('bluebird');
const axios = require('axios');

const stringUtil = require('../utils/string');
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
  list: function browse() {
    const registrys = cache.get(REGISTRY_CACHE_KEY);
    return Promise.resolve(registrys);
  },

  add: function add(options, object) {
    const key = stringUtil.md5(object.name.toLowerCase().replace(' ', '-'));
    const registrys = cache.get(REGISTRY_CACHE_KEY);
    const newRegistry = {};

    logger.info('start add registry function');
    if (key in registrys) {
      logger.error(`named ${object.name} registry had exists the registry`);
      return Promise.reject(new Error('Already had exists the registry'));
    }
    return new Promise(((resolve, reject) => {
      axios({
        method: 'get',
        url: `${object.url}/v2/`,
      }).then((response) => {
        if (response.status === 200) {
          logger.info('verify new registry done');
          try {
            registrys[key] = object;
            flush(registrys);
          } catch (e) {
            reject(e);
          }
          newRegistry[key] = object;
          resolve(newRegistry);
        }
      }).catch((err) => {
        logger.error(`can not access registry server ${object.url}: ${err}`);
        reject(err);
      });
    }));
  },

  del: function del(options) {
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
