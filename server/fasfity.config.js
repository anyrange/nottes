"use strict";

const AutoLoad = require("fastify-autoload");
const Cors = require("fastify-cors");

const path = require("path");

/*
const mongoose = require("mongoose");
mongoose.Schema.Types.Boolean.convertToFalse.add("");
mongoose.connect(`mongodb://localhost/${process.env.DATABASE}`, {
 useCreateIndex: true,
 useNewUrlParser: true,
 useFindAndModify: false,
 useUnifiedTopology: true,
});
*/

module.exports = async function (fastify) {
  fastify.register(Cors, {
    origin: process.env.URL_LIST.split(","),
    credentials: true,
  });
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
  });
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
  });
};
