import { React, useState, useEffect } from "react";
import axios from "axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { parseISO, addMinutes } from "date-fns";
import { Box, Button, Typography } from "@mui/material";
import ScheduleTaskDialog from "./ScheduleTaskDialog";
import AddEventDialog from "./AddEventDialog";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const SEMESTER_MAP = { 1: "1", 2: "2", i: "3", ii: "4" };

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
  if (!event.task) {
    if (isSelected) {
      return { style: { backgroundColor: "#2ab02a" } };
    }
    return { style: { backgroundColor: "limeGreen" } };
  }
  if (event.isCompleted) {
    return {
      style: {
        textDecoration: "line-through",
        backgroundColor: isSelected ? "#a1b3c9" : "LightSteelBlue",
      },
    };
  }
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
          console.log(timetable);
          // Logic to add classes to calendar

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
