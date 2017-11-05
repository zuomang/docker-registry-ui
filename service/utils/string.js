const crypto = require('crypto');

const REGISTRY_CACHE_KEY = "registrys";

module.exports.md5 = function(str) {
    let hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
};

module.exports.toRigstryKey = function(str) {
    return `${REGISTRY_CACHE_KEY}:${str}`;
}