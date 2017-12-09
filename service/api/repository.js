/* global APPROOT_PATH:false, REGISTRY_CACHE_KEY:false */
/* eslint-env node */

const axios = require('axios');
const Promise = require('bluebird');
const cache = require('../utils/cache');

const TTL = 1000 * 60 * 5;
const logger = require('../utils/logger').getLogger(__filename.replace(APPROOT_PATH, ''));

const repository = {
  list(options) {
    const { key, n = 50, last = '' } = options;
    const address = cache.get(REGISTRY_CACHE_KEY)[key].url;
    const url = `${address}/v2/_catalog?n=${n}&last=${last}`;
    const cacheKey = `${key}:${n}:${last}`;

    return new Promise((resolve, reject) => {
      if (cache.has(cacheKey)) {
        resolve(cache.get(cacheKey));
      } else {
        axios.get(url).then(({ headers, data }) => {
          let next;
          if (headers && headers.link) {
            const link = headers.link.split(';')[0];
            const query = link.slice(1, link.length - 1).split('?')[1];
            next = `/api/registrys/${key}/repos?${query}`;
          }
          const result = headers.link ? { nextUrl: next, repositories: data.repositories } :
            { repositories: data.repositories };
          cache.set(cacheKey, result, TTL);
          resolve(result);
        }).catch((error) => {
          logger.error(`Failed list repositorys: ${error}`);
          reject(error);
        });
      }
    });
  },
};

module.exports = repository;
