'use strict'

const { Schema, model } = require('mongoose')

const schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String },
  oauth_uid: { type: String },
  platform: { type: String, default: 'Direct', required: true },
})

module.exports = model('User', schema)
