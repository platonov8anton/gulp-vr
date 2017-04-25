'use strict'

const {createHash} = require('crypto')

module.exports = data => createHash('sha1').update(data).digest('base64')
