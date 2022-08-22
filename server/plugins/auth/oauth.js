'use strict'

const fp = require('fastify-plugin')
const oauthPlugin = require('@fastify/oauth2')

module.exports = fp(async function (fastify) {
  fastify.register(oauthPlugin, {
    name: 'googleOAuth2',
    credentials: {
      client: {
        id: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET,
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: '/api/oauth/google',
    callbackUri: `${process.env.BASE_URL}/api/oauth/callback`,
    scope: ['profile', 'email'],
    schema: { tags: ['oauth'] },
  })
})
