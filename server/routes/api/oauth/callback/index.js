'use strict'

const fetch = require('node-fetch')

module.exports = async function (fastify) {
  fastify.get('', { schema: { tags: ['oauth'] } }, async (request, reply) => {
    if (!request.query.state || !request.query.code || !request.query.scope)
      return reply.redirect(`${process.env.BASE_URL}/api/oauth/google`)

    const token = await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)

    const { email, picture } = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token.access_token}`
    ).then((res) => res.json())

    const user = await fastify.db.User.findOneAndUpdate(
      { email },
      { avatar: picture, platform: 'Google' },
      { new: true, upsert: true, projection: 'username avatar', setDefaultsOnInsert: true }
    ).lean()

    request.session.isAuth = true
    request.session._id = String(user._id)

    const userData = `?refresh=true`
    if (user.username.split('_')[0] === 'user') return reply.redirect(`${process.env.BASE_URL}/profile${userData}`)
    reply.redirect(process.env.BASE_URL + userData)
  })
}
