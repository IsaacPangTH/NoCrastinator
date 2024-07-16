import React, { useState } from "react";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
import { LocalizationProvider, MobileDateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { formatISO, parseISO, isBefore, isFuture } from "date-fns";
import { Snackbar, TextField } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function DueDateTimeTask({
  id,
  title,
  handleComplete,
  handleEdit,
  handleAddSchedule,
  handleDelete,
  completed,
  dueDate = "",
  dueTime = "",
  className = "task",
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [scheduleTaskDialogOpen, setScheduleTaskDialogOpen] = useState(false);
  const [taskStartDateTime, setTaskStartDateTime] = useState(null);
  const [taskEndDateTime, setTaskEndDateTime] = useState(null);
  const [openInvalidStartEndTime, setOpenInvalidStartEndTime] = useState(false);
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const [editTaskDueDateSelected, setEditTaskDueDateSelected] = useState(false);

  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditTask = () => {
    setEditTaskDialogOpen(true);
    setEditTaskDueDateSelected(true);
  };
  const handleCloseEditTask = () => {
    setEditTaskDialogOpen(false);
    setEditTaskDueDateSelected(true);
  };

  const handleSchedule = () => setScheduleTaskDialogOpen(true);

  const handleCloseScheduleDialog = () => {
    setTaskStartDateTime(null);
    setTaskEndDateTime(null);
    setScheduleTaskDialogOpen(false);
  };
  return (
    <>
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
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={navigator.language}>
              <DatePicker
                label="Due Date (optional)"
                defaultValue={parseISO(dueDate)}
                id="dueDate"
                name="dueDate"
                slotProps={{
                  field: { clearable: true, onClear: () => setEditTaskDueDateSelected(false) },
                }}
                format="yyyy-LL-dd"
                onChange={() => setEditTaskDueDateSelected(true)}
              />
              {editTaskDueDateSelected && (
                <TimePicker
                  label="Time Due (optional)"
                  defaultValue={parseISO(dueTime)}
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
          <Button onClick={handleCloseEditTask}>Cancel</Button>
          <Button type="submit">Edit Task</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%" }}>
        <IconButton onClick={() => handleComplete(id)}>
          {completed ? <CheckCircleIcon /> : <CircleOutlinedIcon />}
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
          <Typography
            fontSize="large"
            sx={completed ? { textDecoration: "line-through", color: "#818181" } : null}
          >
            {title}
          </Typography>

          <Typography variant="caption" color={isFuture(parseISO(dueDate)) ? "black" : "red"}>
            Due: {dueDate + " at " + dueTime}
          </Typography>
        </Box>

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
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <MobileDateTimePicker
                required
                label="Start"
                id="startDateTime"
                name="startDateTime"
                slotProps={{
                  textField: {
                    required: true,
                  },
                }}
                orientation="landscape"
                value={taskStartDateTime}
                onChange={(newValue) => setTaskStartDateTime(newValue)}
                format="yyyy-MM-dd HH:mm"
              />
              <MobileDateTimePicker
                required
                label="End"
                id="endDateTime"
                name="endDateTime"
                slotProps={{
                  textField: {
                    required: true,
                  },
                }}
                orientation="landscape"
                value={taskEndDateTime}
                onChange={(newValue) => setTaskEndDateTime(newValue)}
                format="yyyy-MM-dd HH:mm"
              />
            </Stack>
          </LocalizationProvider>
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
    </>
  );
}
