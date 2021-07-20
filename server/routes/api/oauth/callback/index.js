'use strict'

const fetch = require('node-fetch')

module.exports = async function (fastify) {
  fastify.get('', { schema: { tags: ['oauth'] } }, async (request, reply) => {
    const token = await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)

    const { id, email, picture } = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token.access_token}`
    ).then((res) => res.json())

    const user = await fastify.db.User.findOneAndUpdate(
      { oauth_uid: id },
      { email, avatar: picture, platform: 'Google' },
      { new: true, upsert: true, projection: '_id username', setDefaultsOnInsert: true }
    )

    const { accessToken, refreshToken } = await fastify.generateTokens(user._id)

    reply.setCookie('accessToken', accessToken, fastify.cookieOptions)
    reply.setCookie('refreshToken', refreshToken, fastify.cookieOptions)

    if (user.username.split('_')[0] === 'user') return reply.redirect(`${process.env.BASE_URL}/profile`)
    reply.redirect(`${process.env.BASE_URL}`)
  })
}
