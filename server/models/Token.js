'use strict'

const { Schema, model } = require('mongoose')

const schema = new Schema({
  token: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
})

module.exports = model('Token', schema)
