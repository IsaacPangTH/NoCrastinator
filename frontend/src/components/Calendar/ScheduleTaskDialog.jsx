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
} from "@mui/material";
import axios from "axios";
import DtPicker from "../DtPicker";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function ScheduleTaskDialog(props) {
  const { open, onClose } = props;
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState(null);
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);

  const handleChangeStart = (newValue) => setStartDateTime(newValue);
  const handleChangeEnd = (newValue) => setEndDateTime(newValue);

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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: (event) => {
          event.preventDefault();
          if (task !== null && startDateTime !== null && endDateTime !== null) {
            onClose();
          }
        },
      }}
    >
      <DialogTitle>Schedule Task</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Autocomplete
            id="task"
            options={tasks.filter((task) => task.startTime === undefined)}
            getOptionLabel={(option) => option.title}
            sx={{ width: 300 }}
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
          />
          <DtPicker
            type="DateTime"
            label="End"
            id="endDateTime"
            name="endDateTime"
            value={endDateTime}
            onChange={handleChangeEnd}
            onClear={() => null}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Schedule Task</Button>
      </DialogActions>
    </Dialog>
  );
}
