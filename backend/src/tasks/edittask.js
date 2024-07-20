const pg = require("pg");
const { Client } = pg;
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://nocrastinator:nocrastinator@localhost:5432/nocrastinator";

const edittask = async (form) => {
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

    await client.query(`UPDATE tasks SET title=$1, due_date=$2, due_time=$3 WHERE id=$4`, [
      form.title,
      date,
      time,
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
  edittask,
};
