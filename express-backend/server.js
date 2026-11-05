require("dotenv").config();
if (process.env.NODE_ENV === "production" && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
  throw new Error("Set JWT_SECRET to a random value of at least 32 characters in production.");
}
const app = require("./app");

const port = Number(process.env.PORT) || 5000;
app.listen(port, () => {
  console.log(`Mtaa Market API listening on http://localhost:${port}`);
});
