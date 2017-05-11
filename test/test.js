'use strict'

/* global describe, context, beforeEach, it */

const _ = require('assert')
const vr = require('../')
const File = require('vinyl')
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
  describe('module', function () {
    let files

    function writeEnd (stream) {
      files.forEach(file => stream.write(file))
      stream.end()
    }

    beforeEach(function () {
      files = [
        new File({
          vrOrder: 0,
          cwd: '/',
          base: '/a',
          path: '/a/buffer.ext',
          contents: Buffer.from('this is a test')
        }),
        new File({
          vrOrder: 1,
          cwd: '/',
          base: '/a/b',
          path: '/a/b/null.ext',
          contents: null
        })
      ]
    })

    context('#modifier', function () {
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
  })
})
