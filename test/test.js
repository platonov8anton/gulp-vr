'use strict'

/* global describe, context, beforeEach, it */

const _ = require('assert')
const {name, version} = require('../package')

describe(name + '@' + version, function () {
  describe('lib', function () {
    context('hash', function () {
      const hash = require('../lib/hash')

      let data = Buffer.from('this is a test')

      it('should return a "base64" string', function () {
        _.strictEqual(hash('sha1', data, 'base64'), '+ia+Gd5r/5P3C8IwhDTkpEC7rQI=')
      })
      it('should return a "hex" string', function () {
        _.strictEqual(hash('md5', data, 'hex'), '54b0c58c7ce9f2a8b551351102ee0938')
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
  describe('module', function () {
    const File = require('vinyl')
    const vr = require('../')

    context('#createHashBase64', function () {
      it('should return a normalized "base64" string', function () {
        _.strictEqual(vr.createHashBase64('sha1', Buffer.from('this is a test')), 'ia-Gd5r_5P3C8IwhDTkpEC7rQI')
      })
    })
    context('#createHashHex', function () {
      it('should return a normalized "hex" string', function () {
        _.strictEqual(vr.createHashHex('sha1', Buffer.from('test')), 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3')
      })
    })

    /* modifier & manifest */

    let files

    function writeEnd (stream) {
      files.forEach(file => stream.write(file))
      stream.end()
    }

    context('#modifier', function () {
      beforeEach(function () {
        files = [
          new File({vrOrder: 0, base: '/a', path: '/a/buffer.ext', contents: Buffer.from('this is a test')}),
          new File({vrOrder: 1, base: '/a/b', path: '/a/b/null.ext', contents: null})
        ]
      })
      it('should perform with default settings', function (done) {
        let stream = vr.modifier()

        stream
            .on('data', (file) => {
              if (file.vrOrder === 0) {
                _.strictEqual(file.vrRelative, 'buffer.ext', 'contents === Buffer (1)')
                _.strictEqual(file.basename, 'ia-Gd5r_5P3C8IwhDTkpEC7rQI.ext', 'contents === Buffer (2)')
              } else if (file.vrOrder === 1) {
                _.strictEqual(file.vrRelative, undefined, 'contents === null (1)')
                _.strictEqual(file.basename, 'null.ext', 'contents === null (2)')
              }
            })
            .on('end', done)

        writeEnd(stream)
      })
      it('should perform with function "modify"', function (done) {
        let stream = vr.modifier({
          modify (file) {
            file.stem += '.v1.0.0'
          }
        })

        stream
            .on('data', (file) => {
              if (file.vrOrder === 0) {
                _.strictEqual(file.vrRelative, 'buffer.ext', 'contents === Buffer (1)')
                _.strictEqual(file.basename, 'buffer.v1.0.0.ext', 'contents === Buffer (2)')
              } else if (file.vrOrder === 1) {
                _.strictEqual(file.vrRelative, 'null.ext', 'contents === null (1)')
                _.strictEqual(file.basename, 'null.v1.0.0.ext', 'contents === null (2)')
              }
            })
            .on('end', done)

        writeEnd(stream)
      })
    })
    context('#manifest', function () {
      beforeEach(function () {
        files = [
          new File({vrRelative: 'buffer.ext', base: '/', path: '/a/buffer.v1.0.0.ext', contents: null}),
          new File({base: '/a/b', path: '/a/b/null.v1.0.0.ext', contents: null})
        ]
      })
      it('should perform with default settings', function (done) {
        let stream = vr.manifest()

        stream
            .on('data', (file) => {
              _.deepStrictEqual(JSON.parse(file.contents.toString()), {'buffer.ext': 'a/buffer.v1.0.0.ext'})
            })
            .on('end', done)

        writeEnd(stream)
      })
    })
  })
})
