"use strict";

module.exports = async function (fastify, opts) {
    fastify.post("/login", async (request, reply) => {
        if (request.body.user !== process.env.USER || request.body.password !== process.env.PASSWORD) {
            return reply.code(403).send({ message: "Неправильные логин или пароль" });
        }
        request.session.isAuth = true;
        reply.code(200).send({ message: "Добро пожаловать" });
    });

    fastify.get("/check", async function (request, reply) {
        reply.code(200).send(request.session.isAuth);
    });
    fastify.delete("/logout", (request, reply) => {
        request.destroySession((err) => {
            if (err) {
                reply.code(200).send({ message: "Сессии не существует" });
            } else {
                reply.code(200).clearCookie("sessionId").send();
            }
        });
    });
};
