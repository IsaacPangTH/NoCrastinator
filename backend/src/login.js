const pg = require("pg");
const { Client } = pg;
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://nocrastinator:nocrastinator@localhost:5432/nocrastinator";

const login = async (data) => {
  if (!data.email && !data.password) {
    return "Invalid Form!";
  }
  const client = new Client({
    connectionString: DATABASE_URL,
  });
  await client.connect();
  try {
    const exist = await client.query("SELECT * FROM accounts WHERE email=$1", [data.email]);
    if (exist.rows[0]) {
      const check = await client.query("SELECT * FROM accounts WHERE email=$1 AND password=$2", [
        data.email,
        data.password,
      ]);
      if (!check.rows[0]) {
        return "Wrong password!";
      }
      return { message: "Login successful!", name: check.rows[0].first_name };
    } else {
      return "Email is not registered!";
    }
  } catch (err) {
    console.error(err);
    return "Error! Please try again later.";
  } finally {
    await client.end();
  }
};

module.exports = {
  login,
};
