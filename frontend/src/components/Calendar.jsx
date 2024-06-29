import { React, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { parseISO } from "date-fns";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function TaskCalendar() {
  const [tasks, setTasks] = useState([
    //test task object - to be removed when database and backend is linked
    { title: "test", startTime: "2024-06-29T15:00:00", endTime: "2024-06-29T16:00:00" },
  ]);

  const events = tasks
    .filter((task) => task.startTime !== null && task.endTime !== null)
    .map((task) => {
      return { title: task.title, start: parseISO(task.startTime), end: parseISO(task.endTime) };
    });
  return (
    <>
      <Calendar
        localizer={localizer}
        events={events}
        defaultView="week"
        views={["month", "week", "day"]}
      />
    </>
  );
}
