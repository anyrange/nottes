'use strict'

require('dotenv').config()

const Fastify = require('fastify')
const app = Fastify()

const appService = require('./server/app.js')
app.register(appService)

app.listen(process.env.PORT, '0.0.0.0', (err) => {
  if (!err) return console.log('\x1B[32m%s\x1B[0m', '√', `App is available on ${process.env.BASE_URL}`)

  console.error(err)
  process.exit(1)
})

process.on('unhandledRejection', (error) => console.error(error))
