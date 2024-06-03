import React, { useState } from "react";
import Task from "./Task";
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
  TextField,
} from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);

  const handleAddTask = () => setAddTaskDialogOpen(true);
  const handleCloseAddTask = () => setAddTaskDialogOpen(false);
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
        {tasks
          .filter((task) => !task.isCompleted)
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

      <h2>Completed</h2>
      <List>
        {tasks
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
          ))}
      </List>

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
            tasksCopy.push({ id: new Date(), title: title, isCompleted: false });
            setTasks(tasksCopy);
            handleCloseAddTask();
          },
        }}>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="title"
            label="Task"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddTask}>Cancel</Button>
          <Button type="submit">Add Task</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
