const pg = require("pg");
const { Client } = pg;
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://nocrastinator:nocrastinator@localhost:5432/nocrastinator";

const addtask = async (form) => {
  if (!form.title && !form.isCompleted) {
    return "Invalid Form!";
  }
  const client = new Client({
    connectionString: DATABASE_URL,
  });
  await client.connect();
  try {
    let date = null;
    let time = null;
    if (form.dueDate != "") {
      date = form.dueDate;
    }
    if (form.dueTime != "" && form.dueTime != undefined) {
      time = form.dueTime;
    }
    const temp = await client.query("SELECT * FROM accounts WHERE id=$1", [form.user]);
    const id = temp.rows[0].id;
    await client.query(
      `INSERT INTO tasks ("user", title, due_date, due_time, is_completed) VALUES ($1, $2, $3, $4, $5)`,
      [id, form.title, date, time, form.isCompleted]
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
  addtask,
};
