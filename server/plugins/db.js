'use strict'

const fp = require('fastify-plugin')
const mongoose = require('mongoose')

module.exports = fp(async function (fastify) {
  mongoose.connect(process.env.DATABASE, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })

  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', function () {
    console.log('\x1B[32m%s\x1B[0m', `√`, 'Database connected')
  })

  fastify.decorate('db', {
    User: require('../models/User.js'),
    Token: require('../models/Token.js'),
  })
})
