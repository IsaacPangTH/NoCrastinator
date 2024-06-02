const db = require("better-sqlite3")("./dev.db");

const login = async (data) => {
  if (!data.email && !data.password) {
    throw new Error("Invalid Form!");
  }
  const exist = db.prepare("SELECT * FROM accounts WHERE email=?").get(data.email);
  if (exist) {
    const check = db
      .prepare("SELECT * FROM accounts WHERE email=? AND password=?")
      .get(data.email, data.password);
    if (!check) {
      throw new Error("Wrong password!");
    }
  } else {
    throw new Error("Email is not registered!");
  }
};

module.exports = {
  login,
};
