"use strict";

require("dotenv").config();

const Fastify = require("fastify");
const app = Fastify();

const appService = require("./server/app.js");
app.register(appService);

app.listen(process.env.PORT, (err) => {
    if (!err) return console.log("\x1B[32m%s\x1B[0m", `√`, "Server is up");

    app.log.error(err);
    process.exit(1);
});

process.on("unhandledRejection", (error) => console.error(error));
