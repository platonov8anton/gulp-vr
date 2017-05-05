'use strict'

const {createHash} = require('crypto')

module.exports = (algorithm, data, encoding) => createHash(algorithm).update(data).digest(encoding)
