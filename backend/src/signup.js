const sqlite3 = require("sqlite3").verbose();

const signup = async (signUpInfo) => {
  const db = new sqlite3.Database("../sql_database");
  db.serialize(() => {
    db.run("INSERT INTO accounts () VALUES(info TEXT)");
  });
  db.close();
  return;
};

module.exports = {
  signup,
};
