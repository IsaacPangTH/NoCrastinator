const sqlite3 = require("sqlite3").verbose();

const signup = async (data) => {
  if (!data.firstName && !data.lastName && !data.email && !data.password) {
    throw new Error("Invalid Form");
  }

  const db = new sqlite3.Database("./dev.db");
  db.serialize(() => {
    db.prepare(
      "INSERT INTO accounts (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
      [data.firstName, data.lastName, data.email, data.password]
    )
      .run()
      .finalize();
  });
  db.close();
};

module.exports = {
  signup,
};
