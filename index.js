'use strict'

const hash = require('./lib/hash')
const base64 = require('./lib/normalize/base64')
// const Vinyl = require('vinyl')
const {obj: through2} = require('through2')

function createHashBase64 (algorithm, data) {
  return base64(hash(algorithm, data, 'base64'))
}
function createHashHex (algorithm, data) {
  return hash(algorithm, data, 'hex')
}

exports.createHashBase64 = createHashBase64
exports.createHashHex = createHashHex

exports.modifier = ({
    modify,
    hash: {
        algorithm: hashAlgorithm = 'sha1',
        encoding: hashEncoding = 'base64'
    } = {}
} = {}) => {
  if (typeof modify !== 'function') {
    let createHash

    if (hashEncoding === 'base64') {
      createHash = (data) => createHashBase64(hashAlgorithm, data)
    } else if (hashEncoding === 'hex') {
      createHash = (data) => createHashHex(hashAlgorithm, data)
    } else {
      throw new Error(`Hash encoding "${hashEncoding}" not supported`)
    }

    modify = function (file, callback) {
      if (file.isBuffer()) {
        file.stem = createHash(file.contents)
      }

      callback(null, file)
    }
  }

  return through2(
      function (file, encoding, callback) {
        let {base, path} = file

        modify.call(this, file, (error, file) => {
          if (error) {
            callback(error)
          } else if (file) {
            if (path !== file.path) {
              file.vr = {base, path}
            }
            callback(null, file)
          } else {
            callback()
          }
        })
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
