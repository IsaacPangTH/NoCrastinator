const pg = require("pg");
const { Client } = pg;
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://nocrastinator:nocrastinator@localhost:5432/nocrastinator";

pg.types.setTypeParser(pg.types.builtins.DATE, (value) => value);
pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, (value) => value);
const readevents = async (data) => {
  const client = new Client({
    connectionString: DATABASE_URL,
  });
  await client.connect();
  try {
    const res = [];
    const temp = await client.query(`SELECT * FROM events WHERE "user"=$1`, [data.user]);

    for (row of temp.rows) {
      const obj = {
        id: row.id,
        title: row.title,
        startTime: row.start_time,
        endTime: row.end_time,
      };
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
  readevents,
};
