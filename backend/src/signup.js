const pg = require("pg");
const { Client } = pg;
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://nocrastinator:nocrastinator@localhost:5432/nocrastinator";

const signup = async (data) => {
  if (!data.firstName && !data.lastName && !data.email && !data.password) {
    return "Invalid Form!";
  }
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  await client.connect();
  try {
    const check = await client.query("SELECT * FROM accounts WHERE email=$1", [data.email]);
    if (!check.rows[0]) {
      await client.query(
        "INSERT INTO accounts (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
        [data.firstName, data.lastName, data.email, data.password]
      );
      return "Sign Up successful!";
    } else {
      return "Account already exists!";
    }
  } catch (err) {
    console.log(err);
    return "Error! Please try again later.";
  } finally {
    await client.end();
  }
};

module.exports = {
  signup,
};
