'use strict'

const synonyms = Object.create(null)

synonyms['+'] = '-'
synonyms['/'] = '_'

/**
 * Convert base64 to a valid file name
 * Valid characters in base64: 'A-Z', 'a-z', '0-9', '+', '/', '='
 * '+', '/', '=' symbols in file names are forbidden
 *
 * @param {String} base64
 * @return {String}
 */
module.exports = (base64) => {
  if (typeof base64 !== 'string') {
    throw new TypeError('Base64 must be a string')
  }

  return base64
      .replace(/[^A-Za-z0-9]/g, sign => (synonyms[sign] || ''))
      .replace(/^-+/, '')
}
