import React, { useState } from "react";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { formatISO, parseISO, isBefore, startOfToday, format } from "date-fns";
import { Chip, Snackbar, TextField } from "@mui/material";
import DtPicker from "../UI/DtPicker";
import ScheduledCard from "./ScheduledCard";

export default function DueDateTask({
  id,
  title,
  handleComplete,
  handleEdit,
  handleAddSchedule,
  handleDelete,
  dueDate,
  start,
  end,
  className = "task",
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [scheduleTaskDialogOpen, setScheduleTaskDialogOpen] = useState(false);
  const [taskStartDateTime, setTaskStartDateTime] = useState(null);
  const [taskEndDateTime, setTaskEndDateTime] = useState(null);
  const [openInvalidStartEndTime, setOpenInvalidStartEndTime] = useState(false);
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const [editDueDate, setEditDueDate] = useState(parseISO(dueDate));

  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditTask = () => {
    setEditTaskDialogOpen(true);
  };
  const handleCloseEditTask = () => {
    setEditTaskDialogOpen(false);
    setEditDueDate(parseISO(dueDate));
  };

  const handleSchedule = () => setScheduleTaskDialogOpen(true);

  const handleCloseScheduleDialog = () => {
    setTaskStartDateTime(null);
    setTaskEndDateTime(null);
    setScheduleTaskDialogOpen(false);
  };
  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%" }}>
        <IconButton onClick={() => handleComplete(id)}>
          <CircleOutlinedIcon />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            flexGrow: 1,
            justifyContent: "space-around",
          }}
        >
          <Typography fontSize="large">{title}</Typography>

          <Chip
            label={"Due: " + format(dueDate, "do MMM yyyy")}
            color={isBefore(parseISO(dueDate), startOfToday()) ? "error" : "primary"}
            size="small"
          />
        </Box>

        {start && end && <ScheduledCard start={start} end={end} />}

        <IconButton
          id={"menu-button-" + id}
          aria-controls={open ? "task-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleMenuClick}
        >
          <MoreHorizIcon />
        </IconButton>
        <Menu
          id="task-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          MenuListProps={{
            "aria-labelledby": "menu-button-" + id,
          }}
        >
          <MenuItem
            onClick={() => {
              handleSchedule();
              handleMenuClose();
            }}
          >
            Schedule
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleEditTask();
              handleMenuClose();
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleDelete(id);
              handleMenuClose();
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </Box>
      <Dialog
        open={scheduleTaskDialogOpen}
        onClose={handleCloseScheduleDialog}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            if (taskStartDateTime !== null && taskEndDateTime !== null) {
              if (isBefore(taskStartDateTime, taskEndDateTime)) {
                const startDateTime = formatISO(taskStartDateTime);
                const endDateTime = formatISO(taskEndDateTime);
                handleCloseScheduleDialog();
                handleAddSchedule({ id: id, start_time: startDateTime, end_time: endDateTime });
              } else {
                setOpenInvalidStartEndTime(true);
              }
            } else {
              setOpenInvalidStartEndTime(true);
            }
          },
        }}
      >
        <DialogTitle>Schedule Task</DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <DtPicker
              type="DateTime"
              label="Start"
              id="startDateTime"
              name="startDateTime"
              value={taskStartDateTime}
              onChange={(newValue) => setTaskStartDateTime(newValue)}
              required={true}
            />
            <DtPicker
              type="DateTime"
              label="End"
              id="endDateTime"
              name="endDateTime"
              value={taskEndDateTime}
              onChange={(newValue) => setTaskEndDateTime(newValue)}
              required={true}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseScheduleDialog}>Cancel</Button>
          <Button type="submit">OK</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openInvalidStartEndTime}
        autoHideDuration={5000}
        onClose={() => setOpenInvalidStartEndTime(false)}
        message="Set valid start and end times"
      />
      <Dialog
        open={editTaskDialogOpen}
        onClose={handleCloseEditTask}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            handleCloseEditTask();
            handleEdit(event);
          },
        }}
      >
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <input type="hidden" name="id" value={id} />
            <TextField
              autoFocus
              autoComplete="off"
              required
              margin="dense"
              defaultValue={title}
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
              value={editDueDate}
              onChange={(newValue) => setEditDueDate(newValue)}
              onClear={() => setEditDueDate(null)}
            />
            {editDueDate && (
              <DtPicker type="Time" label="Time Due (optional)" id="dueTime" name="dueTime" />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditTask}>Cancel</Button>
          <Button type="submit">Edit Task</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
