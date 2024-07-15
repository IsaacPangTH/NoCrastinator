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
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleOpenDialog() {
    setDialogOpen(true);
  }

  function handleCloseDialog() {
    setDialogOpen(false);
  }

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
        return { title: task.title, start: parseISO(task.startTime), end: parseISO(task.endTime) };
      }
    });
  return (
    <>
      <Box paddingY={3} display="flex" justifyContent="space-between" gap={1}>
        <Typography variant="h4">Calendar</Typography>
        <Box display="flex" justifyContent="end" gap={1}>
          <Button variant="contained">Add Event</Button>
          <Button variant="contained" onClick={handleOpenDialog}>
            Schedule Task
          </Button>
        </Box>
      </Box>
      <Box height={"50%"}>
        <Calendar
          localizer={localizer}
          events={events}
          defaultView="week"
          views={["month", "week", "day"]}
          scrollToTime={new Date()}
        />
      </Box>
      <ScheduleTaskDialog open={dialogOpen} onClose={handleCloseDialog} />
    </>
  );
}