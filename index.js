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

//Helper fuctions
const getElementById = (id, elementList) => {
  return elementList.find((element) => {
    return element.id === Number(id);
  });
};

const getIndexById = (id, elementList) => {
  return elementList.findIndex((element) => {
    return element.id === Number(id);
  });
};

const updateElement = (id, queryArguments, elementList) => {
  const elementIndex = getIndexById(id, elementList);
  if (elementIndex === -1) {
    throw new Error("updateElement must be called with a valid id parameter");
  }
  if (queryArguments.id) {
    queryArguments.id = Number(queryArguments.id);
  }
  Object.assign(elementList[elementIndex], queryArguments);
  return elementList[elementIndex];
};

const updateBudget = (id, cost, queryArguments, elementList) => {
  const elementIndex = getIndexById(id, elementList);
  if (elementIndex === -1) {
    throw new Error("updateElement must be called with a valid id parameter");
  }
  if (queryArguments.id) {
    queryArguments.id = Number(queryArguments.id);
  }
  //Object.assign(elementList[elementIndex], queryArguments);
  if (balanceCheck(elementList[elementIndex].budget, cost)) {
    elementList[elementIndex].budget -= cost;
  } else {
    return false;
  }

  return elementList[elementIndex];
};

const balanceCheck = (balance, cost) => (balance - cost < 0 ? false : true);

//Sever routes
app.use("/envelopes/:id", (req, res, next) => {
  const foundId = envelopes.filter(
    (envelope) => envelope.id === Number(req.params.id)
  );
  console.log(foundId[0]);
  if (foundId.length > 0) {
    req.body = foundId[0];
    console.log(`Found Id: ${req.body.id}`);
    next();
  } else {
    res.status(404).send("Envelope not found");
  }
});

app.get("/", (req, res, next) => {
  res.send(envelopes);
});

app.get("/envelopes/:id", (req, res, next) => {
  res.send(req.body);
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

app.post("/transfer/:amount/:from/:to", (req, res, next) => {
  const fromIndex = getIndexById(req.params.from, envelopes);
  console.log(fromIndex);
  const toIndex = getIndexById(req.params.to, envelopes);
  console.log(toIndex);
  const amount = Number(req.params.amount);
  console.log(amount);

  if (fromIndex !== -1 && toIndex !== -1) {
    if (balanceCheck(envelopes[fromIndex].budget, amount)) {
      envelopes[fromIndex].budget -= amount;
      envelopes[toIndex].budget += amount;
      res.send([envelopes[fromIndex], envelopes[toIndex]]);
    } else {
      res.status(400).send("Broke MOTHERFUCKER!!");
    }
  } else {
    res.status(404).send();
  }
});

app.put("/envelopes/:id/", (req, res, next) => {
  const index = getIndexById(req.params.id, envelopes);

  if (index !== -1) {
    updateElement(req.params.id, req.query, envelopes);
    res.send(envelopes[index]);
  } else {
    res.status(404).send();
  }
});

app.put("/envelopes/:id/:cost", (req, res, next) => {
  const index = getIndexById(req.params.id, envelopes);

  if (index !== -1) {
    //updateElement(req.params.id, req.query, envelopes);
    updateBudget(req.params.id, req.params.cost, req.query, envelopes);
    if (updateBudget(req.params.id, req.params.cost, req.query, envelopes)) {
      res.send(envelopes[index]);
    } else {
      res.status(400).send("Broke MOTHERFUCKER!!");
    }
  } else {
    res.status(404).send();
  }
});

app.delete("/envelopes/:id", (req, res, next) => {
  const index = getIndexById(req.params.id, envelopes);
  if (index !== -1) {
    envelopes.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send();
  }
});

app.listen(PORT, () =>
  console.log(`We all bout dat Port: ${PORT} in dis BITCH`)
);
