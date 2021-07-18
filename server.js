"use strict";

require("dotenv").config();

const Fastify = require("fastify");

const app = Fastify({ logger: process.env.LOG === 'true' });

const appService = require("./server/fasfity.config.js");
app.register(appService);

app.listen(process.env.PORT, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
