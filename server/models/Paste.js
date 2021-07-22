'use strict'

const { Schema, model } = require('mongoose')

const schema = new Schema({
  id: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  code: { type: String, default: 'text' },
  visibility: { type: String, default: 'public' },
  expiry: { type: Date },
  password: { type: String },
  views: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
})

module.exports = model('Paste', schema)
