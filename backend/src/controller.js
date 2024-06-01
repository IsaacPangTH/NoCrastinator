const express = require("express");
const cors = require("cors");
const { signup } = require("./signup");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/login", async (req, res) => {
  res.json("Login successful!");
});

app.post("/signup", async (req, res) => {
  try {
    await signup(req.body);
    res.json("Sign Up successful!");
  } catch (error) {
    res.json(error.error);
  }
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
