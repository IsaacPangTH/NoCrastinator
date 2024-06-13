const express = require("express");
const cors = require("cors");
const { signup } = require("./signup");
const { login } = require("./login");

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

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
