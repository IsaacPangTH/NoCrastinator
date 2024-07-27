const pg = require("pg");
const { Client } = pg;
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://nocrastinator:nocrastinator@localhost:5432/nocrastinator";

const editevent = async (form) => {
  if (!form.title && !form.startDateTime && !form.endDateTime && !form.user) {
    return "Invalid Form!";
  }
  const client = new Client({
    connectionString: DATABASE_URL,
  });
  await client.connect();
  try {
    await client.query(`UPDATE events SET title=$1, start_time=$2, end_time=$3 WHERE id=$4`, [
      form.title,
      form.startDateTime,
      form.endDateTime,
      form.id,
    ]);
    return "Success!";
  } catch (err) {
    console.error(err);
    return "Error! Please try again later.";
  } finally {
    await client.end();
  }
};

module.exports = {
  editevent,
};
