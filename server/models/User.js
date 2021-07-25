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
  email: { type: String, required: true, unique: true },
  password: { type: String },
  avatar: { type: String },
  platform: { type: String, default: 'Direct', required: true },
  registered: { type: Date, default: Date.now },
})

module.exports = model('User', schema)
