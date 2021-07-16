import fastify from "fastify";
import autoLoad from "fastify-autoload";

import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const app = fastify();

app.register(import("fastify-cors"), {
  origin: process.env.CLIENT || "*",
  credentials: true,
});

if (process.env.NODE_ENV !== "production") {
  app.register(import("fastify-swagger"), {
    routePrefix: "/docs",
    uiConfig: { deepLinking: true, displayRequestDuration: true },
    exposeRoute: true,
  });
}

app.register(autoLoad, { dir: "./plugins" });
app.register(autoLoad, { dir: "./schemas" });
app.register(autoLoad, {
  dir: "./routes",
  routeParams: true,
  autoHooks: true,
  cascadeHooks: true,
});

process.on("unhandledRejection", (error) => console.error(error));
export default app;
