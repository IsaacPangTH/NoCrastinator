const pg = require("pg");
const { Client } = pg;
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://nocrastinator:nocrastinator@localhost:5432/nocrastinator";

pg.types.setTypeParser(pg.types.builtins.DATE, (value) => value);
pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, (value) => value);
const readtasks = async (data) => {
  const client = new Client({
    connectionString: DATABASE_URL,
  });
  await client.connect();
  try {
    const res = [];
    const temp = await client.query(
      `SELECT * FROM tasks WHERE "user"=$1 ORDER BY due_date NULLS LAST, due_time NULLS LAST`,
      [data.user]
    );

    for (row of temp.rows) {
      const obj = { id: row.id, title: row.title, isCompleted: row.is_completed };
      if (row.due_date) {
        obj.dueDate = row.due_date;
      }
      if (row.due_time) {
        obj.dueTime = JSON.stringify(row.due_time).substring(1, 6);
      }
      if (row.end_time) {
        obj.endTime = row.end_time;
        obj.startTime = row.start_time;
      }

      res.push(obj);
    }
    return res;
  } catch (err) {
    console.error(err);
    return "Error! Please try again later.";
  } finally {
    await client.end();
  }
};

module.exports = {
  readtasks,
};
