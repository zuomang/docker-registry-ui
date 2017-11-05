const LRU = require("lru-cache")

let option = {
    max: 1000
}

let cache = LRU(option);

module.exports = cache;