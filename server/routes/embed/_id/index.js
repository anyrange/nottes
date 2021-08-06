'use strict'

const bcrypt = require('bcrypt')

module.exports = async function (fastify) {
  fastify.get(
    '',
    {
      schema: {
        params: {
          type: 'object',
          properties: { id: { type: 'string' } },
        },
        querystring: {
          type: 'object',
          properties: { password: { type: 'string' } },
        },
        tags: ['layout'],
      },
    },
    async (request, reply) => {
      const paste = await fastify.db.Paste.findById(request.params.id, 'content visibility author title').lean()

      if (!paste) return reply.code(404).send({ message: 'Paste not found' })

      if (paste.visibility === 'private' && request.session.get('_id') !== String(paste.author)) {
        return reply.code(403).send({ message: 'Private paste' })
      }

      if (paste.password && !request.query.password) return reply.code(403).send({ message: 'Password required' })
      if (paste.password && !(await bcrypt.compare(request.query.password, paste.password)))
        return reply.code(403).send({ message: 'Wrong password' })

      reply.type('text/javascript')
      reply.send(
        'document.write(' +
          JSON.stringify(
            `<div class='paste_embed_container'><style>.paste_embed_container{font-size:12px;color:#333;text-align:left;margin-bottom:1em;border:1px solid #ddd;background-color:#f7f7f7;border-radius:3px}.paste_embed_container a{font-weight:700;color:#666;text-decoration:none;border:0}.paste_embed_container ol{color:#fff;background-color:#f7f7f7;border-right:1px solid #ccc;margin:0}.paste_embed_footer{font-size:14px;padding:10px;overflow:hidden;color:#767676;background-color:#f7f7f7;border-radius:0 0 2px 2px;border-top:1px solid #ccc}.de1,.de2{-moz-user-select:text;-khtml-user-select:text;-webkit-user-select:text;-ms-user-select:text;user-select:text;padding:0 8px;color:#000;border-left:1px solid #ddd;background:#fff;line-height:20px}</style>
${fastify.decrypt(paste.content)}
<div class='paste_embed_footer'><a href='${process.env.BASE_URL + '/' + paste._id}'>
${paste.title}
</a></div></div>`
          ) +
          ')'
      )
    }
  )
}
