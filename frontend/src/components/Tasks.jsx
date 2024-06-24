import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Task from "./Task";
import { DateTime } from "luxon";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);
  const [newTaskDueDateSelected, setNewTaskDueDateSelected] = useState(false);
  const alertShownRef = useRef(false);
  const navigate = useNavigate();

  const handleComplete = async (id) => {
    try {
      const obj = { id: id };
      const response = await axios.patch(`${BACKEND_URL}/tasks`, obj, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      alert("Backend is down! Please try again later.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const form = new FormData(event.currentTarget);
      const formJson = Object.fromEntries(form.entries());
      formJson.user = sessionStorage.getItem("user");
      formJson.isCompleted = false;
      const response = await axios.post(`${BACKEND_URL}/tasks`, formJson, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      alert("Backend is down! Please try again later.");
    }
    handleCloseAddTask();
  };

  const handleAddTask = () => {
    setAddTaskDialogOpen(true);
    setNewTaskDueDateSelected(false);
  };
  const handleCloseAddTask = () => {
    setAddTaskDialogOpen(false);
    setNewTaskDueDateSelected(false);
  };

  useEffect(() => {
    if (!alertShownRef.current) {
      if (!sessionStorage.getItem("user")) {
        alert("Please Login!");
        alertShownRef.current = true;
        return navigate("/login");
      }
    }
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
  }, [addTaskDialogOpen, handleComplete]);

  return (
    <>
      <h2>To-do</h2>
      <List>
        {getToDo(tasks)}
        <ListItem key="AddTask">
          <ListItemButton onClick={handleAddTask}>
            <ListItemIcon>
              <AddCircleOutlineOutlinedIcon />
            </ListItemIcon>
            <ListItemText>Add Task</ListItemText>
          </ListItemButton>
        </ListItem>
      </List>

      <h2>Completed</h2>
      <List>{getCompleted(tasks)}</List>

      <Dialog
        open={addTaskDialogOpen}
        onClose={handleCloseAddTask}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
              autoFocus
              autoComplete="off"
              required
              margin="dense"
              id="title"
              name="title"
              label="Task"
              type="text"
              fullWidth
              variant="standard"
            />
            <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={navigator.language}>
              <DatePicker
                label="Due Date (optional)"
                id="dueDate"
                name="dueDate"
                slotProps={{
                  field: { clearable: true, onClear: () => setNewTaskDueDateSelected(false) },
                }}
                format="yyyy-LL-dd"
                onChange={() => setNewTaskDueDateSelected(true)}
              />
              {newTaskDueDateSelected && (
                <TimePicker
                  label="Time Due (optional)"
                  id="dueTime"
                  name="dueTime"
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                  slotProps={{ field: { clearable: true } }}
                  format="HH:mm"
                />
              )}
            </LocalizationProvider>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddTask}>Cancel</Button>
          <Button type="submit">Add Task</Button>
        </DialogActions>
      </Dialog>
    </>
  );

  function getToDo(tasks) {
    return tasks
      .filter((task) => !task.isCompleted)
      .map((task) => (
        <React.Fragment key={task.id}>
          <ListItem key={task.id} sx={{ width: "100%" }}>
            <Task
              id={task.id}
              title={task.title}
              handleComplete={handleComplete}
              completed={task.isCompleted}
              dueDate={task.dueDate}
              dueTime={task.dueTime}
              className="task"
            />
          </ListItem>
          <Divider />
        </React.Fragment>
      ));
  }

  function getCompleted(tasks) {
    return tasks
      .filter((task) => task.isCompleted)
      .map((task) => (
        <React.Fragment key={task.id}>
          <ListItem key={task.id}>
            <Task
              id={task.id}
              title={task.title}
              handleComplete={handleComplete}
              completed={task.isCompleted}
            />
          </ListItem>
          <Divider />
        </React.Fragment>
      ));
  }
}
