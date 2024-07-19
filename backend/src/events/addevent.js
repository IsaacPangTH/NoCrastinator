const pg = require("pg");
const { Client } = pg;
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://nocrastinator:nocrastinator@localhost:5432/nocrastinator";

const addevent = async (form) => {
  if (!form.title && !form.startDateTime && !form.endDateTime) {
    return "Invalid Form!";
  }
  const client = new Client({
    connectionString: DATABASE_URL,
  });
  await client.connect();
  try {
    await client.query(
      `INSERT INTO events ("user", title, start_time, end_time) VALUES ($1, $2, $3, $4)`,
      [form.user, form.title, form.startDateTime, form.endDateTime]
    );
    return "Success!";
  } catch (err) {
    console.error(err);
    return "Error! Please try again later.";
  } finally {
    await client.end();
  }
};

module.exports = {
  addevent,
};
