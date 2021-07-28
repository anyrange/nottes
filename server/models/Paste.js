'use strict'

const { Schema, model } = require('mongoose')
const { nanoid } = require('nanoid')

const schema = new Schema(
  {
    _id: { type: String, default: () => nanoid(6) },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    code: { type: String, default: 'text' },
    visibility: { type: String, default: 'public' },
    expiry: { type: Date },
    password: { type: String },
    views: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: 'date', updatedAt: 'updated_at' } }
)

schema.index({ expiry: 1 }, { expireAfterSeconds: 0 })

module.exports = model('Paste', schema)
