const pg = require("pg");
const { Client } = pg;
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://nocrastinator:nocrastinator@localhost:5432/nocrastinator";

const readlink = async (data) => {
  const client = new Client({
    connectionString: DATABASE_URL,
  });
  await client.connect();
  try {
    const res = await client.query(`SELECT link FROM accounts WHERE id=$1`, [data.user]);
    return res.rows[0] ? res.rows[0].link : "";
  } catch (err) {
    console.error(err);
    return "Error! Please try again later.";
  } finally {
    await client.end();
  }
};

module.exports = {
  readlink,
};
