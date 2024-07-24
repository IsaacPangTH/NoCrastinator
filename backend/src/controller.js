const express = require("express");
const cors = require("cors");
const { login } = require("./accounts/login");
const { signup } = require("./accounts/signup");
const { readlink } = require("./accounts/readlink");
const { editlink } = require("./accounts/editlink");
const { readtasks } = require("./tasks/readtasks");
const { addtask } = require("./tasks/addtask");
const { edittask } = require("./tasks/edittask");
const { deletetask } = require("./tasks/deletetask");
const { patchcompleted } = require("./tasks/patchcompleted");
const { schedule } = require("./tasks/schedule");
const { readevents } = require("./events/readevents");
const { addevent } = require("./events/addevent");
const { readfriends } = require("./friends/readfriends");
const { readrequests } = require("./friends/readrequests");
const { addfriend } = require("./friends/addfriend");
const { accept } = require("./friends/accept");
const { reject } = require("./friends/reject");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Accounts
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

// Tasks
app.post("/readtasks", async (req, res) => {
  const response = await readtasks(req.body);
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

// Events
app.post("/readevents", async (req, res) => {
  const response = await readevents(req.body);
  res.json(response);
});

app.post("/events", async (req, res) => {
  const response = await addevent(req.body);
  res.json(response);
});

// Friends
app.post("/readfriends", async (req, res) => {
  const response = await readfriends(req.body);
  res.json(response);
});

app.post("/readrequests", async (req, res) => {
  const response = await readrequests(req.body);
  res.json(response);
});

app.post("/friends", async (req, res) => {
  const response = await addfriend(req.body);
  res.json(response);
});

app.patch("/friends", async (req, res) => {
  const response = await accept(req.body.id);
  res.json(response);
});

app.delete("/friends", async (req, res) => {
  const response = await reject(req.body.id);
  res.json(response);
});

// Links
app.post("/link", async (req, res) => {
  const response = await readlink(req.body);
  res.json(response);
});

app.patch("/link", async (req, res) => {
  const response = await editlink(req.body);
  res.json(response);
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
