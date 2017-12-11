/* global APPROOT_PATH:false, REGISTRY_CACHE_KEY:false */
/* eslint-env node */

const axios = require('axios');
const Promise = require('bluebird');
const cache = require('../utils/cache');
const _ = require('lodash');

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
  get(options) {
    const {
      key, repoName, n = 50, last = '',
    } = options;
    const address = cache.get(REGISTRY_CACHE_KEY)[key].url;
    const getRepoURL = `${address}/v2/${repoName}/tags/list`;
    const repoNameEncoding = encodeURIComponent(repoName);
    const cacheKey = `${key}:${repoName}:${n}:${last}`;
    const data = {};

    return new Promise((resolve, reject) => {
      if (cache.has(cacheKey)) {
        logger.info(`hit cache tag list: ${cacheKey}`);
        resolve(cache.get(cacheKey));
      } else {
        axios({
          method: 'get',
          url: getRepoURL,
          params: {
            n,
          },
        }).then(({ headers, data: { tags } }) => {
          const tagDetailLists = [];

          if (headers && headers.link) {
            const link = headers.link.split(';')[0];
            const query = link.slice(1, link.length - 1).split('?')[1];
            data.nextUrl = `/api/registrys/${key}/repos/${repoNameEncoding}?${query}`;
          }

          if (tags) {
            tags.forEach((element) => {
              const request = axios({
                method: 'get',
                url: `${address}/v2/${repoName}/manifests/${element}`,
              });
              tagDetailLists.push(request);
            });

            axios.all(tagDetailLists)
              .then((response) => {
                const result = [];
                response.forEach(({ data: { name, tag, history } }) => {
                  let createdTime = JSON.parse(history[0].v1Compatibility).created;
                  createdTime = `${createdTime.split('.')[0]}Z`;
                  result.push({ name, tag, createdTime });
                });
                data.tags = _.sortBy(result, ['createdTime']).reverse();
                cache.set(cacheKey, data, TTL);
                resolve(data);
              }).catch((err) => {
                logger.info(`Failed get ${repoName} tags detail info: ${err}`);
                reject(err);
              });
          } else {
            data.tags = tags;
            cache.set(cacheKey, data, TTL);
            resolve(data);
          }
        }).catch((err) => {
          logger.info(`Failed get ${repoName} tag list: ${err}`);
          reject(err);
        });
      }
    });
  },
};

module.exports = repository;
