import React, { useState } from "react";
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

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);
  const [newTaskDueDate, setNewTaskDueDate] = useState(null);
  const [newTaskDueTime, setNewTaskDueTime] = useState(null);

  const handleAddTask = () => {
    setAddTaskDialogOpen(true);
    setNewTaskDueDate(null);
    setNewTaskDueTime(null);
  };
  const handleCloseAddTask = () => {
    setAddTaskDialogOpen(false);
    setNewTaskDueDate(null);
    setNewTaskDueTime(null);
  };
  const handleComplete = (id) => {
    setTasks(
      tasks.map((task) => {
        task.isCompleted = task.id === id ? true : task.isCompleted;
        return task;
      })
    );
  };
  const handleUncomplete = (id) => {
    setTasks(
      tasks.map((task) => {
        task.isCompleted = task.id === id ? false : task.isCompleted;
        return task;
      })
    );
  };

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
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const title = formJson.title;
            const tasksCopy = tasks;
            tasksCopy.push({
              id: DateTime.now(),
              title: title,
              isCompleted: false,
              dueDate:
                newTaskDueTime !== null
                  ? newTaskDueDate.plus({
                      hours: newTaskDueTime.hour,
                      minutes: newTaskDueTime.minute,
                    })
                  : newTaskDueDate,
              isTimeSpecific: newTaskDueTime !== null,
            });
            setTasks(tasksCopy);
            handleCloseAddTask();
          },
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
              id="name"
              name="title"
              label="Task"
              type="text"
              fullWidth
              variant="standard"
            />
            <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={navigator.language}>
              <DatePicker
                label="Due Date (optional)"
                value={newTaskDueDate}
                onChange={(newTaskDueDate) => {
                  setNewTaskDueDate(newTaskDueDate);
                }}
                slotProps={{ field: { clearable: true } }}
              />
              {newTaskDueDate !== null && (
                <TimePicker
                  label="Time Due (optional)"
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                  value={newTaskDueTime}
                  onChange={(time) => {
                    setNewTaskDueTime(time);
                  }}
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
      .toSorted(taskDueDateComparator)
      .map((task) => (
        <>
          <ListItem key={task.id} sx={{ width: "100%" }}>
            <Task
              id={task.id}
              title={task.title}
              onComplete={handleComplete}
              onUncomplete={handleUncomplete}
              completed={task.isCompleted}
              dueDate={task.dueDate}
              isTimeSpecific={task.isTimeSpecific}
              className="task"
            />
          </ListItem>
          <Divider />
        </>
      ));
  }

  function getCompleted(tasks) {
    return tasks
      .filter((task) => task.isCompleted)
      .map((task) => (
        <>
          <ListItem key={task.id}>
            <Task
              id={task.id}
              title={task.title}
              onComplete={handleComplete}
              onUncomplete={handleUncomplete}
              completed={task.isCompleted}
            />
          </ListItem>
          <Divider />
        </>
      ));
  }

  function taskDueDateComparator(task1, task2) {
    if (task1.dueDate === null) {
      return 1;
    }
    if (task2.dueDate === null) {
      return -1;
    }
    if (task1.dueDate.hasSame(task2.dueDate, "day")) {
      if (task1.isTimeSpecific !== task2.isTimeSpecific) {
        if (task1.isTimeSpecific) {
          return -1;
        }
        return 1;
      }
    }
    return task1.dueDate.diff(task2.dueDate).toMillis();
  }
}
