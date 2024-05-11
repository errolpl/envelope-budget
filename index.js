const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res, next) => {
  console.log("Hello World");
  res.send();
});

app.listen(PORT, () =>
  console.log(`We all bout dat Port: ${PORT} in dis BITCH`)
);
