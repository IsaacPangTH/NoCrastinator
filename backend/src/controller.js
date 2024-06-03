const express = require("express");
const cors = require("cors");
const { signup } = require("./signup");
const { login } = require("./login");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/login", async (req, res) => {
  try {
    const name = await login(req.body);
    res.json({ message: "Login successful!", name: name });
  } catch (error) {
    res.json({ message: error.message });
  }
});

app.post("/signup", async (req, res) => {
  try {
    await signup(req.body);
    res.json("Sign Up successful!");
  } catch (error) {
    res.json(error.message);
  }
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
