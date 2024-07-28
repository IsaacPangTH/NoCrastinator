const pg = require("pg");
const { Client } = pg;
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://nocrastinator:nocrastinator@localhost:5432/nocrastinator";

const leaderboard = async (data) => {
  const client = new Client({
    connectionString: DATABASE_URL,
  });
  await client.connect();
  try {
    const response = await client.query(
      `SELECT first_name, friends.user_2 AS id FROM friends INNER JOIN accounts ON accounts.id=user_2 WHERE user_1=$1 AND is_approve 
      UNION SELECT first_name, friends.user_1 AS id FROM friends INNER JOIN accounts ON accounts.id=user_1 WHERE user_2=$1 AND is_approve 
      UNION SELECT first_name, id FROM accounts WHERE id=$1`,
      [data.user]
    );
    const res = await Promise.all(
      response.rows.map(async (el) => {
        const temp = {};
        temp.id = el.id;
        el.id == data.user ? (temp.name = "You") : (temp.name = el.first_name);
        const test = await client.query(
          `SELECT COUNT(*) FROM tasks WHERE "user"=$1 AND is_completed`,
          [el.id]
        );
        temp.points = parseInt(test.rows[0].count * 100);
        return temp;
      })
    );
    return res;
  } catch (err) {
    console.error(err);
    return "Error! Please try again later.";
  } finally {
    await client.end();
  }
};

module.exports = {
  leaderboard,
};
