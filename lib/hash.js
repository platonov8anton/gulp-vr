'use strict'

const {createHash} = require('crypto')

/**
 * https://nodejs.org/api/crypto.html#crypto_class_hash
 *
 * @param {String} algorithm
 * @param {String|Buffer} data
 * @param {String} [encoding] 'hex', 'latin1', 'base64'
 * @return {String|Buffer} If encoding is not provided a buffer will be returned
 */
module.exports = ({algorithm, data, encoding}) => createHash(algorithm).update(data).digest(encoding)
