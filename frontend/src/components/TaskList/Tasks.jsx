import React, { useState, useEffect } from "react";
import axios from "axios";
import Task from "./Task";
import DueDateTask from "./DueDateTask";
import DueDateTimeTask from "./DueDateTimeTask";
import CompletedTask from "./CompletedTask";
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
  Typography,
} from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import NoCrastinatorLogo from "../../assets/NoCrastinatorLogo.png";
import DtPicker from "../UI/DtPicker";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);
  const [newTaskDueDate, setNewTaskDueDate] = useState(null);
  const [update, setUpdate] = useState(false);

  const sendNoti = (tasks) => {
    if (Notification.permission === "granted" && !sessionStorage.getItem("notification")) {
      const incomplete = tasks.filter((el) => !el.isCompleted);
      let title = "";
      let body = "";
      if (incomplete[0]) {
        title = `You still have tasks to do`;
        const due = incomplete[0].dueTime
          ? `which is due on ${incomplete[0].dueDate}, ${incomplete[0].dueTime}`
          : incomplete[0].dueDate
          ? `which is due on ${incomplete[0].dueDate}`
          : "which has no deadline";
        body = `The most urgent is ${incomplete[0].title} ${due}`;
      } else {
        title = "You have no more tasks";
        body = "Add more tasks or take a break!";
      }
      new Notification(title, {
        body: body,
        icon: NoCrastinatorLogo,
      });
      sessionStorage.setItem("notification", true);
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.patch(
        `${BACKEND_URL}/completed`,
        { id: id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      alert("Backend is down! Please try again later.");
    }
    setUpdate(true);
  };

  const handleEdit = async (event) => {
    try {
      const form = new FormData(event.currentTarget);
      const formJson = Object.fromEntries(form.entries());
      await axios.patch(`${BACKEND_URL}/tasks`, formJson, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log(error);
      alert("Backend is down! Please try again later.");
    }
    setUpdate(true);
  };

  const handleAddSchedule = async (obj) => {
    try {
      await axios.patch(`${BACKEND_URL}/schedule`, obj, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log(error);
      alert("Backend is down! Please try again later.");
    }
    setUpdate(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/tasks`, {
        data: { id: id },
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.log(err);
      alert("Backend is down! Please try again later.");
    }
    setUpdate(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const form = new FormData(event.currentTarget);
      const formJson = Object.fromEntries(form.entries());
      formJson.user = sessionStorage.getItem("user");
      formJson.isCompleted = false;
      await axios.post(`${BACKEND_URL}/tasks`, formJson, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      alert("Backend is down! Please try again later.");
    }
    handleCloseAddTask();
    setUpdate(true);
  };

  const handleAddTask = () => {
    setAddTaskDialogOpen(true);
    setNewTaskDueDate(null);
    setUpdate(true);
  };
  const handleCloseAddTask = () => {
    setAddTaskDialogOpen(false);
    setNewTaskDueDate(null);
    setUpdate(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.post(
        `${BACKEND_URL}/readtasks`,
        { user: sessionStorage.getItem("user") },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      sendNoti(response.data);
      setTasks(response.data);
    };
    fetchData();
    setUpdate(false);
  }, [addTaskDialogOpen, update]);

  return (
    <>
      <Typography variant="h5" fontWeight="bold">
        To-do
      </Typography>
      <List>
        {tasks
          .filter((task) => !task.isCompleted)
          .map((task) => (
            <React.Fragment key={task.id}>
              <ListItem key={task.id} sx={{ width: "100%" }}>
                {makeTask(task)}
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        <ListItem key="AddTask">
          <ListItemButton onClick={handleAddTask}>
            <ListItemIcon>
              <AddCircleOutlineOutlinedIcon />
            </ListItemIcon>
            <ListItemText>Add Task</ListItemText>
          </ListItemButton>
        </ListItem>
      </List>

      <Typography variant="h5" fontWeight="bold">
        Completed
      </Typography>
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
            <DtPicker
              type="Date"
              label="Due Date (optional)"
              id="dueDate"
              name="dueDate"
              value={newTaskDueDate}
              onChange={(newValue) => setNewTaskDueDate(newValue)}
              onClear={() => setNewTaskDueDate(null)}
            />
            {newTaskDueDate && (
              <DtPicker type="Time" label="Time Due (optional)" id="dueTime" name="dueTime" />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddTask}>Cancel</Button>
          <Button type="submit">Add Task</Button>
        </DialogActions>
      </Dialog>
    </>
  );

  function makeTask(task) {
    if (task.dueDate === undefined) {
      return (
        <Task
          id={task.id}
          title={task.title}
          handleComplete={handleComplete}
          handleEdit={handleEdit}
          handleAddSchedule={handleAddSchedule}
          handleDelete={handleDelete}
          completed={task.isCompleted}
          start={task.startTime}
          end={task.endTime}
        />
      );
    }
    if (task.dueTime === undefined) {
      return (
        <DueDateTask
          id={task.id}
          title={task.title}
          handleComplete={handleComplete}
          handleEdit={handleEdit}
          handleAddSchedule={handleAddSchedule}
          handleDelete={handleDelete}
          completed={task.isCompleted}
          dueDate={task.dueDate}
          start={task.startTime}
          end={task.endTime}
        />
      );
    }
    return (
      <DueDateTimeTask
        id={task.id}
        title={task.title}
        handleComplete={handleComplete}
        handleEdit={handleEdit}
        handleAddSchedule={handleAddSchedule}
        handleDelete={handleDelete}
        completed={task.isCompleted}
        dueDate={task.dueDate}
        dueTime={task.dueTime}
        start={task.startTime}
        end={task.endTime}
      />
    );
  }

  function getCompleted(tasks) {
    return tasks
      .filter((task) => task.isCompleted)
      .map((task) => (
        <React.Fragment key={task.id}>
          <ListItem key={task.id}>
            <CompletedTask
              id={task.id}
              title={task.title}
              handleComplete={handleComplete}
              handleDelete={handleDelete}
              completed={task.isCompleted}
            />
          </ListItem>
          <Divider />
        </React.Fragment>
      ));
  }
}
