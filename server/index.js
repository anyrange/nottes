import app from "./app.js";

const devEnv = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 8088;

app.listen(PORT, "0.0.0.0", (err) => {
  if (err) return console.error(err);
  console.info(`Server is up.`);
  if (devEnv) console.info(`Docs on http://localhost:${PORT}/docs`);
});
