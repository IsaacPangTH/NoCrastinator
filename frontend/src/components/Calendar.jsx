import { React, useState, useEffect } from "react";
import axios from "axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { parseISO } from "date-fns";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

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
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.post(
        `${BACKEND_URL}/readtask`,
        { user: sessionStorage.getItem("user") },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setTasks(response.data);
    };
    fetchData();
  }, []);

  const events = tasks
    .filter((task) => task.startTime !== null && task.endTime !== null)
    .map((task) => {
      if (task.endTime) {
        console.log(task.endTime);
        return { title: task.title, start: parseISO(task.startTime), end: parseISO(task.endTime) };
      }
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
