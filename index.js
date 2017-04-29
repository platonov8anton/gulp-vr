'use strict'

const hash = require('./lib/hash')
const base64 = require('./lib/normalize/base64')
// const Vinyl = require('vinyl')
const {obj: through2} = require('through2')

/**
 * Modifies vinyl files: file.ext => ia-Gd5r_5P3C8IwhDTkpEC7rQI.ext
 *
 * @param {Function} [modify] Should modify file, this === vinyl file
 * @param {String} [hash.algorithm]
 * @param {String} [hash.encoding]
 * @return {Stream}
 */
exports.modify = ({
    modify,
    hash: {
        algorithm: hashAlgorithm = 'sha1',
        encoding: hashEncoding = 'base64'
    } = {}
} = {}) => {
  let createHash = null

  if (typeof modify !== 'function') {
    modify = null
  }

  if (!modify || modify.length > 0) {
    if (hashEncoding === 'base64') {
      createHash = (data) => base64(hash(hashAlgorithm, data, 'base64'))
    } else if (hashEncoding === 'hex') {
      createHash = (data) => hash(hashAlgorithm, data, 'hex')
    } else {
      throw new Error(`Hash encoding "${hashEncoding}" not supported`)
    }
  }

  return through2(
      function (file, encoding, callback) {
        if (file.isStream()) {
          return callback(new TypeError('Streaming not supported'))
        }

        let {base, path} = file

        if (modify) {
          let parameters = []

          if (createHash) {
            parameters.push(file.isBuffer() ? createHash(file.contents) : null)
          }

          modify.apply(file, parameters)
        } else if (file.isBuffer()) {
          file.stem = createHash(file.contents)
        }

        if (path !== file.path) {
          file.vr = {base, path}
        }

        callback(null, file)
      }
  )
}

/*
exports.manifest = () => {
  let manifest = {};

  return through2(
      function (file, encoding, callback) {
        callback()
      },
      function (callback) {
        let file = new Vinyl()

        this.push(file)
        callback()
      }
  )
}
*/
