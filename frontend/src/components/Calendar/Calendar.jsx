import { React, useState, useEffect } from "react";
import axios from "axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { parseISO, addMinutes, nextDay, addWeeks } from "date-fns";
import { Box, Button, Typography } from "@mui/material";
import ScheduleTaskDialog from "./ScheduleTaskDialog";
import AddEventDialog from "./AddEventDialog";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

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

const eventPropGetter = (event, start, end, isSelected) => {
  const style = {};
  if (event.nus) {
    if (isSelected) {
      style.backgroundColor = "#c96d0a";
      style.border = "1px solid #c96d0a";
    } else {
      style.backgroundColor = "#EF7C00";
      style.border = "1px solid #FFF";
    }
  } else if (!event.task) {
    if (isSelected) {
      style.backgroundColor = "#2ab02a";
      style.border = "1px solid #2ab02a";
    } else {
      style.backgroundColor = "limeGreen";
      style.border = "1px solid #FFF";
    }
  }
  if (event.isCompleted) {
    style.textDecoration = "line-through";
    style.backgroundColor = isSelected ? "#a1b3c9" : "LightSteelBlue";
  }
  return { style: style };
};

export default function TaskCalendar() {
  const [nus, setNus] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [scheduleTaskDialogOpen, setScheduleTaskDialogOpen] = useState(false);
  const [addEventDialogOpen, setAddEventDialogOpen] = useState(false);

  function handleOpenScheduleTaskDialog() {
    setScheduleTaskDialogOpen(true);
  }
  function handleCloseScheduleTaskDialog() {
    setScheduleTaskDialogOpen(false);
  }
  function handleOpenAddEventDialog() {
    setAddEventDialogOpen(true);
  }
  function handleCloseAddEventDialog() {
    setAddEventDialogOpen(false);
  }

  useEffect(() => {
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
    const getNus = async () => {
      const response = await axios.post(
        `${BACKEND_URL}/link`,
        { user: sessionStorage.getItem("user") },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const link = response.data;
      const array = [];
      const sem = SEMESTER_MAP[link.split("-")[1].split("/")[0]];
      link
        .split("?")[1]
        .split("&")
        .map(async (el) => {
          const split1 = el.split("=");

          const mod = split1[0];

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

          setNus(array);
        });
    };
    getNus();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response1 = await axios.post(
        `${BACKEND_URL}/readtasks`,
        { user: sessionStorage.getItem("user") },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setTasks(response1.data);

      const response2 = await axios.post(
        `${BACKEND_URL}/readevents`,
        { user: sessionStorage.getItem("user") },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setEvents(response2.data);
    };
    fetchData();
  }, [scheduleTaskDialogOpen, addEventDialogOpen]);

  const calendarEvents = [
    ...tasks
      .filter((task) => task.startTime !== null && task.endTime !== null)
      .map((task) => {
        if (task.endTime) {
          return {
            title: task.title,
            start: parseISO(task.startTime),
            end: parseISO(task.endTime),
            task: true,
            isCompleted: task.isCompleted,
          };
        }
      }),
    ...events.map((event) => {
      return {
        title: event.title,
        start: parseISO(event.startTime),
        end: parseISO(event.endTime),
        task: false,
      };
    }),
    ...nus.map((event) => {
      return {
        title: event.title,
        start: event.startTime,
        end: event.endTime,
        task: false,
        nus: true,
      };
    }),
  ];
  return (
    <>
      <Box display="flex" justifyContent="space-between" gap={1}>
        <Typography variant="h4">Calendar</Typography>
        <Box display="flex" justifyContent="end" gap={1}>
          <Button variant="contained" onClick={handleOpenAddEventDialog}>
            Add Event
          </Button>
          <Button variant="contained" onClick={handleOpenScheduleTaskDialog}>
            Schedule Task
          </Button>
        </Box>
      </Box>
      <Box height={"70vh"} paddingTop={3}>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          defaultView="week"
          views={["month", "week", "day"]}
          scrollToTime={new Date()}
          eventPropGetter={eventPropGetter}
          formats={{
            eventTimeRangeFormat: ({ start, end }, culture, localizer) => "",
          }}
        />
      </Box>
      <ScheduleTaskDialog open={scheduleTaskDialogOpen} onClose={handleCloseScheduleTaskDialog} />
      <AddEventDialog open={addEventDialogOpen} onClose={handleCloseAddEventDialog} />
    </>
  );
}
