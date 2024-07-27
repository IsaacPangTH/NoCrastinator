import { React, useState, useEffect } from "react";
import axios from "axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { parseISO } from "date-fns";
import { Box, Button, Typography } from "@mui/material";
import ScheduleTaskDialog from "./ScheduleTaskDialog";
import AddEventDialog from "./AddEventDialog";
import EditEventDialog from "./EditEventDialog";

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
  const [editEventTarget, setEditEventTarget] = useState({ start: null, end: null });
  const [editEventOpen, setEditEventOpen] = useState(false);

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
  function handleOpenEditEvent() {
    setEditEventOpen(true);
  }
  function handleCloseEditEvent() {
    setEditEventOpen(false);
  }

  useEffect(() => {
    const getNus = async () => {
      const response = await axios.post(
        `${BACKEND_URL}/nusmods`,
        { user: sessionStorage.getItem("user") },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setNus(response.data);
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
  }, [scheduleTaskDialogOpen, addEventDialogOpen, editEventOpen]);

  const onDoubleClickEvent = (calEvent) => {
    if (calEvent.nus || calEvent.task) {
      return null;
    }
    setEditEventTarget(calEvent);
    handleOpenEditEvent();
  };

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
        id: event.id,
        title: event.title,
        start: parseISO(event.startTime),
        end: parseISO(event.endTime),
        task: false,
      };
    }),
    ...nus.map((event) => {
      return {
        title: event.title,
        start: parseISO(event.startTime),
        end: parseISO(event.endTime),
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
          onDoubleClickEvent={onDoubleClickEvent}
        />
      </Box>
      <ScheduleTaskDialog open={scheduleTaskDialogOpen} onClose={handleCloseScheduleTaskDialog} />
      <AddEventDialog open={addEventDialogOpen} onClose={handleCloseAddEventDialog} />
      <EditEventDialog
        open={editEventOpen}
        onClose={handleCloseEditEvent}
        event={editEventTarget}
      />
    </>
  );
}
