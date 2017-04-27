'use strict'

/* global describe, context, it */

const _ = require('assert')
const {name, version} = require('../package')

describe(name + '@' + version, function () {
  describe('lib', function () {
    context('hash', function () {
      const hash = require('../lib/hash')

      let algorithm = 'sha1'
      let data = Buffer.from('this is a test')

      it('should return a "hex" string', function () {
        _.strictEqual(hash({algorithm, data, encoding: 'hex'}), 'fa26be19de6bff93f70bc2308434e4a440bbad02')
      })
      it('should return a "base64" string', function () {
        _.strictEqual(hash({algorithm, data, encoding: 'base64'}), '+ia+Gd5r/5P3C8IwhDTkpEC7rQI=')
      })
    })
    describe('normalize', function () {
      context('base64', function () {
        const base64 = require('../lib/normalize/base64')

        it('should return a valid filename', function () {
          _.strictEqual(base64('+ia+Gd5r/5P3C8IwhDTkpEC7rQI='), 'ia-Gd5r_5P3C8IwhDTkpEC7rQI')
        })
        it('should throw TypeError', function () {
          _.throws(() => { base64(1) }, TypeError)
        })
      })
    })
  })
})
