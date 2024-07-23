const pg = require("pg");
const { Client } = pg;
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://nocrastinator:nocrastinator@localhost:5432/nocrastinator";

const readrequests = async (data) => {
  const client = new Client({
    connectionString: DATABASE_URL,
  });
  await client.connect();
  try {
    const res = await client.query(
      `SELECT first_name, friends.id FROM friends INNER JOIN accounts ON accounts.id=user_1 WHERE user_2=$1 AND NOT is_approve
      ORDER BY first_name`,
      [data.user]
    );
    return res.rows;
  } catch (err) {
    console.error(err);
    return "Error! Please try again later.";
  } finally {
    await client.end();
  }
};

module.exports = {
  readrequests,
};
