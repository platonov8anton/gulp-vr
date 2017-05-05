'use strict'

/* global describe, context, before, it */

const _ = require('assert')
const vr = require('../')
const Vinyl = require('vinyl')
const {name, version} = require('../package')

describe(name + '@' + version, function () {
  describe('lib', function () {
    context('hash', function () {
      const hash = require('../lib/hash')

      let data = Buffer.from('this is a test')

      it('should return a "hex" string', function () {
        _.strictEqual(hash('md5', data, 'hex'), '54b0c58c7ce9f2a8b551351102ee0938')
      })
      it('should return a "base64" string', function () {
        _.strictEqual(hash('sha1', data, 'base64'), '+ia+Gd5r/5P3C8IwhDTkpEC7rQI=')
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
  describe(name, function () {
    let files = []

    function writeEnd (stream) {
      files.forEach(file => stream.write(file))
      stream.end()
    }

    before(function () {
      files.push(new Vinyl({cwd: '/', base: '/a', path: '/a/buffer.ext', contents: Buffer.from('this is a test')}))
      files.push(new Vinyl({cwd: '/', base: '/a/b', path: '/a/b/null.ext', contents: null}))
    })

    it('with default settings', function (done) {
      let stream = vr.modifier()

      stream
          .on('data', (file) => {
            if (file.vr) {
              _.deepStrictEqual(file.vr, {base: '/a', path: '/a/buffer.ext'})
              _.strictEqual(file.basename, 'ia-Gd5r_5P3C8IwhDTkpEC7rQI.ext')
            }
          })
          .on('end', () => {
            done()
          })

      writeEnd(stream)
    })
  })
})
