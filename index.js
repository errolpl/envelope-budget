const express = require("express");
const { getSystemErrorMap } = require("util");
const app = express();

const PORT = process.env.PORT || 3000;

let envelopes = [
  {
    id: 1,
    title: "gym",
    budget: 200,
  },
  {
    id: 2,
    title: "hoes",
    budget: 500,
  },
  {
    id: 3,
    title: "weed",
    budget: 300,
  },
];

let totalBudget = 0;

app.get("/", (req, res, next) => {
  res.send(envelopes);
});

app.get("/envelopes/:id", (req, res, next) => {
  const foundId = envelopes.filter(
    (envelope) => envelope.id === Number(req.params.id)
  );
  console.log(foundId);
  if (foundId.length > 0) {
    res.send(foundId);
  } else {
    res.status(404).send("Envelope not found");
  }
});

app.post("/envelopes", (req, res, next) => {
  if (req.query.title && Number(req.query.budget)) {
    const newId = envelopes.length + 1;
    console.log(newId);
    const newEnvelope = {
      id: newId,
      title: req.query.title,
      budget: Number(req.query.budget),
    };
    envelopes.push(newEnvelope);
    res.send(newEnvelope);
  } else {
    res.status(400).send();
  }
});

app.listen(PORT, () =>
  console.log(`We all bout dat Port: ${PORT} in dis BITCH`)
);
