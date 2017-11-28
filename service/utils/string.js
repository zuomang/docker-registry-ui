/* global REGISTRY_CACHE_KEY:false */
/* eslint-env node */

const crypto = require('crypto');
const path = require('path');

global.APPROOT_PATH = process.cwd();
global.REGISTRY_CONFIG_PATH = path.join(global.APPROOT_PATH, 'service/config/registry.json');
global.REGISTRY_CACHE_KEY = 'registrys';

module.exports.md5 = function md5(str) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
};

module.exports.toRegistryKey = function toRegistryKey(str) {
  return `${REGISTRY_CACHE_KEY}:${str}`;
};
