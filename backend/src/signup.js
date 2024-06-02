const db = require("better-sqlite3")("./dev.db");

const signup = async (data) => {
  if (!data.firstName && !data.lastName && !data.email && !data.password) {
    throw new Error("Invalid Form!");
  }
  const check = db.prepare("SELECT * FROM accounts WHERE email=?").get(data.email);
  console.log(check);
  if (!check) {
    db.prepare(
      "INSERT INTO accounts (first_name, last_name, email, password) VALUES (?, ?, ?, ?)"
    ).run(data.firstName, data.lastName, data.email, data.password);
  } else {
    throw new Error("Account already exists!");
  }
};

module.exports = {
  signup,
};
