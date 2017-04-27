'use strict'

const hash = require('./lib/hash')
const base64 = require('./lib/normalize/base64')
const {readJsonSync, outputJson} = require('fs-extra')
const {obj: through2} = require('through2')

/**
 * Creates a manifest from the contents of json files
 *
 * @param {...String} [paths] Paths to files
 * @return {Object} Collection, __proto__ === null
 */
exports.createManifest = (...paths) => Object.assign(
    Object.create(null),
    ...paths.map(path => readJsonSync(path))
)

/**
 * Renames files: file.ext => ia-Gd5r_5P3C8IwhDTkpEC7rQI.ext
 *
 * @param {String} [path] Path to file, to save the result
 * @return {Stream}
 */
exports.rename = ({
    hash: {
        algorithm = 'sha1',
        encoding = 'base64'
    },
    rename
}) => {

  if (encoding !== 'hex' && encoding !== 'base64') {
    throw new Error(`Hash encoding "${encoding}" not supported`)
  }

  return through2(
      (file, enc, callback) => {
        if (file.isBuffer()) {
          let stem = hash({algorithm, encoding, data: file.contents})

          if (encoding === 'base64') {
            stem = base64(stem)
          }

          if (typeof rename === 'function') {
            stem = rename(file.stem, stem)

            if (typeof stem !== 'string') {
              throw new TypeError('Base64 must be a string')
            }
            if (!stem) {
              throw new Error('Base64 must be a string')
            }
          }

          // file._base = file.base
          // file._path = file.path

          file.stem = stem
        }

        callback(null, file)
      }
      /*,
      (callback) => {
        if (path) {
          outputJson(path, manifest, callback)
        } else {
          callback()
        }
      }
      */
  )
}
