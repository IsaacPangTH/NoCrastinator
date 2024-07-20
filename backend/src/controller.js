const express = require("express");
const cors = require("cors");
const { login } = require("./accounts/login");
const { signup } = require("./accounts/signup");
const { readtask } = require("./tasks/readtask");
const { addtask } = require("./tasks/addtask");
const { edittask } = require("./tasks/edittask");
const { deletetask } = require("./tasks/deletetask");
const { patchcompleted } = require("./tasks/patchcompleted");
const { schedule } = require("./tasks/schedule");
const { readevent } = require("./events/readevent");
const { addevent } = require("./events/addevent");

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
  const response = await edittask(req.body);
  res.json(response);
});

app.delete("/tasks", async (req, res) => {
  const response = await deletetask(req.body.id);
  res.json(response);
});

app.patch("/completed", async (req, res) => {
  const response = await patchcompleted(req.body.id);
  res.json(response);
});

app.patch("/schedule", async (req, res) => {
  const response = await schedule(req.body);
  res.json(response);
});

app.post("/readevent", async (req, res) => {
  const response = await readevent(req.body);
  res.json(response);
});

app.post("/events", async (req, res) => {
  const response = await addevent(req.body);
  res.json(response);
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
