const pg = require("pg");
const { Client } = pg;
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://nocrastinator:nocrastinator@localhost:5432/nocrastinator";

const addfriend = async (form) => {
  if (!form.email && !form.user) {
    return "Invalid Form!";
  }
  const client = new Client({
    connectionString: DATABASE_URL,
  });
  await client.connect();
  try {
    const temp = await client.query(`SELECT id FROM accounts WHERE email=$1`, [form.email]);
    if (temp.rows[0]) {
      const requestee = temp.rows[0].id;
      if (form.user == requestee) {
        return "You cannot add yourself as a friend!";
      }

      const check1 = await client.query(
        `SELECT * FROM friends WHERE user_1=$1 AND user_2=$2 AND NOT is_approve`,
        [form.user, requestee]
      );
      if (check1.rows[0]) {
        return "You have already sent a request to this user!";
      }

      const check2 = await client.query(
        `SELECT * FROM friends WHERE user_1=$2 AND user_2=$1 AND NOT is_approve`,
        [form.user, requestee]
      );
      if (check2.rows[0]) {
        await client.query("UPDATE friends SET is_approve = TRUE WHERE user_1=$2 AND user_2=$1", [
          form.user,
          requestee,
        ]);
        return "This user has an existing request, you are now friends!";
      }

      const check3 = await client.query(
        "SELECT * FROM friends WHERE user_1=$1 AND user_2=$2 UNION SELECT * FROM friends WHERE user_1=$2 AND user_2=$1",
        [form.user, requestee]
      );
      if (check3.rows[0]) {
        return "You are already friends with this user!";
      }

      await client.query(`INSERT INTO friends (user_1, user_2, is_approve) VALUES ($1, $2, $3)`, [
        form.user,
        requestee,
        false,
      ]);
      return "Request sent successfully";
    } else {
      return "User does not exist!";
    }
  } catch (err) {
    console.error(err);
    return "Error! Please try again later.";
  } finally {
    await client.end();
  }
};

module.exports = {
  addfriend,
};
