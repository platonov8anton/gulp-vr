'use strict'

const getHash = require('./lib/getHash')
const getFilename = require('./lib/getFilename')
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
exports.digest = (path) => {
  let manifest = {}

  return through2(
      (file, encoding, callback) => {
        if (file.isBuffer()) {
          let base64 = getHash(file.contents)
          let filename = getFilename(base64)

          file._base = file.base
          file._path = file.path

          file.stem = manifest[file.path] = filename
        }

        callback(null, file)
      },
      (callback) => {
        if (path) {
          outputJson(path, manifest, callback)
        } else {
          callback()
        }
      }
  )
}
