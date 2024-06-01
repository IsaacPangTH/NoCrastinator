const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/login", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", (req, res) => {
  res.send("Success!")
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
