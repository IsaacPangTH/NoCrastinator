const pg = require("pg");
const { Client } = pg;
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://nocrastinator:nocrastinator@localhost:5432/nocrastinator";

const patchtask = async (form) => {
  console.log(form);
  if (!form.id) {
    return "Invalid Task!";
  }
  const client = new Client({
    connectionString: DATABASE_URL,
  });
  await client.connect();
  try {
    await client.query("UPDATE tasks SET is_completed = NOT is_completed WHERE id=$1", [form.id]);
    return "Success!";
  } catch (err) {
    console.error(err);
    return "Error! Please try again later.";
  } finally {
    await client.end();
  }
};

module.exports = {
  patchtask,
};
