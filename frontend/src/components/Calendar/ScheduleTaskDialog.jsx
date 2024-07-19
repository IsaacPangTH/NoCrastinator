import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import DtPicker from "../DtPicker";
import { isAfter } from "date-fns";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function ScheduleTaskDialog(props) {
  const { open, onClose } = props;
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState(null);
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [openInvalidInput, setOpenInvalidInput] = useState(false);

  const handleChangeStart = (newValue) => setStartDateTime(newValue);
  const handleChangeEnd = (newValue) => setEndDateTime(newValue);

  const handleClose = () => {
    onClose();
    setTask(null);
    setStartDateTime(null);
    setEndDateTime(null);
  };

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
      setTasks(response.data.filter((task) => task.startTime === undefined));
    };
    fetchData();
  }, [task]);

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event) => {
            event.preventDefault();
            if (
              task === null ||
              startDateTime === null ||
              endDateTime === null ||
              isAfter(startDateTime, endDateTime)
            ) {
              setOpenInvalidInput(true);
            } else {
              try {
                const form = new FormData(event.currentTarget);
                const formJson = Object.fromEntries(form.entries());
                const response = await axios.patch(
                  `${BACKEND_URL}/schedule`,
                  {
                    id: task.id,
                    start_time: formJson.startDateTime,
                    end_time: formJson.endDateTime,
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );
              } catch (error) {
                console.log(error);
                alert("Backend is down! Please try again later.");
              }
              handleClose();
            }
          },
        }}
      >
        <DialogTitle>Schedule Task</DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <Autocomplete
              id="task"
              options={tasks}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionLabel={(option) =>
                option.dueDate === undefined
                  ? option.title
                  : option.title + " (Due " + option.dueDate + ")"
              }
              renderInput={(params) => <TextField {...params} label="Task" />}
              value={task}
              onChange={(event, newValue) => {
                setTask(newValue);
              }}
            />
            <DtPicker
              type="DateTime"
              label="Start"
              id="startDateTime"
              name="startDateTime"
              value={startDateTime}
              onChange={handleChangeStart}
              onClear={() => null}
              required={true}
            />
            <DtPicker
              type="DateTime"
              label="End"
              id="endDateTime"
              name="endDateTime"
              value={endDateTime}
              onChange={handleChangeEnd}
              onClear={() => null}
              required={true}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Schedule Task</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openInvalidInput}
        autoHideDuration={5000}
        onClose={() => setOpenInvalidInput(false)}
        message="Select a valid task, start time and end time"
      />
    </>
  );
}
