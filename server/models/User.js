'use strict'

const { Schema, model } = require('mongoose')
const { nanoid } = require('nanoid')

const schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    default: () => `user_${nanoid(6)}`,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  avatar: { type: String },
  platform: { type: String, default: 'Direct', required: true },
  registered: { type: Date, default: Date.now },
})

module.exports = model('User', schema)
