const LRU = require('lru-cache');

const option = {
  max: 1000,
};

const cache = LRU(option);

module.exports = cache;
