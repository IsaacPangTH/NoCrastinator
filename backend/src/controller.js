const express = require("express");
const cors = require("cors");
const { signup } = require("./signup");
const { login } = require("./login");
const { addtask } = require("./addtask");
const { readtask } = require("./readtask");
const { patchtask } = require("./patchtask");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/login", async (req, res) => {
  const response = await login(req.body);
  if (response.name) {
    res.json(response);
  } else {
    res.json({ message: response });
  }
});

app.post("/signup", async (req, res) => {
  const response = await signup(req.body);
  res.json(response);
});

app.post("/readtask", async (req, res) => {
  const response = await readtask(req.body);
  res.json(response);
});

app.post("/tasks", async (req, res) => {
  const response = await addtask(req.body);
  res.json(response);
});

app.patch("/tasks", async (req, res) => {
  const response = await patchtask(req.body);
  res.json(response);
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
