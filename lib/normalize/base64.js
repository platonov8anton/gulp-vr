'use strict'

const synonyms = Object.create(null)

synonyms['+'] = '-'
synonyms['/'] = '_'

module.exports = base64 => {
  if (typeof base64 !== 'string') {
    throw new TypeError('Base64 must be a string')
  }

  return base64
      .replace(/[^A-Za-z0-9]/g, sign => (synonyms[sign] || ''))
      .replace(/^-+/, '')
}
