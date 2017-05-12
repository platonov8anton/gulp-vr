'use strict'

const hash = require('./lib/hash')
const base64 = require('./lib/normalize/base64')
const File = require('vinyl')
const {obj: through2} = require('through2')
const {join} = require('path')

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
  let proxyHandler = {
    set (file, property, value) {
      switch (property) {
        case 'basename':
        case 'stem':
        case 'extname':
          file[property] = value
          return true
      }
      return false
    }
  }

  if (typeof modify !== 'function') {
    let createHash

    if (hashEncoding === 'base64') {
      createHash = (data) => createHashBase64(hashAlgorithm, data)
    } else if (hashEncoding === 'hex') {
      createHash = (data) => createHashHex(hashAlgorithm, data)
    } else {
      throw new Error(`Hash encoding "${hashEncoding}" not supported`)
    }

    modify = (file) => {
      if (file.isBuffer()) {
        file.stem = createHash(file.contents)
      }
    }
  }

  return through2(
      function (file, encoding, callback) {
        if (file.isStream()) {
          return callback(new Error('gulp-vr: Streaming not supported'))
        }

        let {relative} = file

        modify(new Proxy(file, proxyHandler))

        if (file.relative !== relative) {
          file.vrRelative = relative
        }

        callback(null, file)
      }
  )
}

exports.manifest = ({
    file: {
        base,
        path,
        basename,
        stem,
        extname
    } = {}
} = {}) => {
  let manifest = {}

  return through2(
      function (file, encoding, callback) {
        if (file.vrRelative) {
          manifest[file.vrRelative] = file.relative
        }

        callback()
      },
      function (callback) {
        if (Object.keys(manifest).length > 0) {
          let file = {
            base,
            path: path || join(process.cwd(), 'manifest.json')
          }

          if (basename) {
            file.basename = basename
          } else {
            if (stem) file.stem = stem
            if (extname) file.extname = extname
          }
          file.contents = Buffer.from(JSON.stringify(manifest))

          this.push(new File(file))
        }

        callback()
      }
  )
}
