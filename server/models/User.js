'use strict'

const { Schema, model } = require('mongoose')
const ShortUniqueId = require('short-unique-id')
const uid = new ShortUniqueId()

const schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    default: () => `user_${uid()}`,
  },
  password: { type: String },
  avatar: { type: String },
  email: { type: String },
  oauth_uid: { type: String },
  platform: { type: String, default: 'Direct', required: true },
})

module.exports = model('User', schema)
