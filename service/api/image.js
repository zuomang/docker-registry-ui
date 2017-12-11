/* global APPROOT_PATH:false, REGISTRY_CACHE_KEY:false */
/* eslint-env node */

const axios = require('axios');
const Promise = require('bluebird');
const cache = require('../utils/cache');

const logger = require('../utils/logger').getLogger(__filename.replace(APPROOT_PATH, ''));

const image = {
  del(option) {
    // the option lead registry enabled deleted;
    const { key, repoName, imageName } = option;
    const address = cache.get(REGISTRY_CACHE_KEY)[key].url;
    const getDigestURL = `${address}/v2/${repoName}/manifests/${imageName}`;
    const baseDeleteURL = `${address}/v2/${repoName}/manifests`;

    logger.info(`will delete ${key} ${repoName} ${imageName}`);
    return new Promise((resolve, reject) => {
      if (!key || !repoName || !imageName) {
        logger.info(`verify the input params failed ${key} ${repoName} ${imageName}`);
        reject(new Error('verify the input params failed'));
      }

      axios({
        method: 'head',
        url: getDigestURL,
        headers: {
          Accept: 'application/vnd.docker.distribution.manifest.v2+json',
        },
      }).then(({ headers: { 'docker-content-digest': imageDigest } }) => {
        if (imageDigest) {
          logger.info(`success get ${key} ${repoName} ${imageName} digest`);
          axios({
            method: 'delete',
            url: `${baseDeleteURL}/${imageDigest}`,
          }).then(({ status }) => {
            if (status && status === 202) {
              logger.info(`success delete image ${key} ${repoName} ${imageName}`);
              resolve({});
            }
          }).catch((err) => {
            logger.info(`failed delete image ${key} ${repoName} ${imageName}`);
            reject(err);
          });
        }
      }).catch(({ err }) => {
        logger.info(`failed delete image ${key} ${repoName} ${imageName}`);
        reject(err);
      });
    });
  },
};

module.exports = image;
