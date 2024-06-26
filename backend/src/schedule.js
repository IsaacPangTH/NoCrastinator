const pg = require("pg");
const { Client } = pg;
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://nocrastinator:nocrastinator@localhost:5432/nocrastinator";

const schedule = async (form) => {
  if (!form.id) {
    return "Invalid Task!";
  }
  const client = new Client({
    connectionString: DATABASE_URL,
  });
  await client.connect();
  try {
    await client.query("UPDATE tasks SET start_time=$1, end_time=$2 WHERE id=$3", [
      form.start_time,
      form.end_time,
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
  schedule,
};
