const axios = require("axios");
const { parse, addMinutes, nextDay, addWeeks } = require("date-fns");
const pg = require("pg");
const { Client } = pg;
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://nocrastinator:nocrastinator@localhost:5432/nocrastinator";

const nusmods = async (data) => {
  const SEMESTER_MAP = { 1: "1", 2: "2", i: "3", ii: "4" };

  const DAY_MAP = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const SEM_START = {
    1: new Date(2024, 7, 4),
    2: new Date(2025, 0, 5),
    3: new Date(2025, 4, 4),
    4: new Date(2025, 5, 15),
  };

  const filterTimetable = (classes, timetable) => {
    return timetable.filter((obj) => {
      for (const [type, no] of Object.entries(classes)) {
        if (obj.lessonType.substring(0, 3).toUpperCase() == type && obj.classNo == no) {
          return true;
        }
      }
      return false;
    });
  };

  const client = new Client({
    connectionString: DATABASE_URL,
  });
  await client.connect();
  try {
    const res = await client.query(`SELECT link FROM accounts WHERE id=$1`, [data.user]);
    const link = res.rows[0].link;
    if (link == "") {
      return [];
    }
    const array = [];
    const sem = SEMESTER_MAP[link.split("-")[1].split("/")[0]];
    const splitHidden = link.split("?")[1].split("&hidden=");
    const hidden = splitHidden[1] ? splitHidden[1].split(",") : [];
    await Promise.all(
      splitHidden[0].split("&").map(async (el) => {
        const split1 = el.split("=");
        const mod = split1[0];
        if (hidden.includes(mod)) {
          return;
        }
        const response = await axios.get(
          `https://api.nusmods.com/v2/2024-2025/modules/${mod}.json`
        );
        const semData = response.data.semesterData.filter((obj) => obj.semester == sem)[0];

        if (semData.examDate && semData.examDuration) {
          const exam = {};
          exam.title = `${mod} Final Exam`;
          exam.startTime = new Date(semData.examDate);
          exam.endTime = addMinutes(semData.examDate, semData.examDuration);
          array.push(exam);
        }

        const classes = {};
        split1[1].split(",").map((el) => {
          if (el == "") {
            return;
          }
          const split2 = el.split(":");
          classes[split2[0]] = split2[1];
        });

        const timetable = filterTimetable(classes, semData.timetable);
        timetable.map((lesson) => {
          lesson.weeks.map((week) => {
            const event = {};
            event.title = `${mod} ${lesson.lessonType}`;
            const weekStart = addWeeks(SEM_START[sem], week);
            const date = nextDay(weekStart, DAY_MAP[lesson.day]);
            event.startTime = parse(lesson.startTime, "HHmm", date);
            event.endTime = parse(lesson.endTime, "HHmm", date);
            array.push(event);
          });
        });
      })
    );
    return array;
  } catch (err) {
    console.error(err);
    return "Error! Please try again later.";
  } finally {
    await client.end();
  }
};

module.exports = {
  nusmods,
};
