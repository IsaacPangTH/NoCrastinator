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
import { formatISO, parseISO, isBefore, startOfToday, format } from "date-fns";
import { Snackbar } from "@mui/material";

export default function Task({
  id,
  title,
  handleComplete,
  completed,
  dueDate = "",
  dueTime = "",
  startTime = null,
  endTime = null,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [scheduleTaskDialogOpen, setScheduleTaskDialogOpen] = useState(false);
  const [taskStartDateTime, setTaskStartDateTime] = useState(null);
  const [taskEndDateTime, setTaskEndDateTime] = useState(null);
  const [openInvalidStartEndTime, setOpenInvalidStartEndTime] = useState(false);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
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

          {dueDate !== "" && (
            <Typography
              variant="caption"
              color={
                isBefore(parseISO(dueDate), startOfToday())
                  ? "red"
                  : dueTime === ""
                  ? "black"
                  : isBefore(parseISO(dueDate + "T" + dueTime), new Date())
                  ? "red"
                  : "black"
              }
            >
              Due: {dueDate} {dueTime !== "" && "at " + dueTime}
            </Typography>
          )}
        </Box>
        {startTime !== null && endTime !== null && (
          <Typography variant="subtitle2">
            Scheduled from {format(startTime, "yyyy-MM-dd HH:mm")} to
            {" " + format(endTime, "yyyy-MM-dd HH:mm")}
          </Typography>
        )}
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
          <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
          <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
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
                console.log("startString: " + taskStartDateTime + " endString: " + taskEndDateTime);
                console.log("startDate: " + startDateTime + " endDate: " + endDateTime);
                handleCloseScheduleDialog();
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
                defaultValue={startTime}
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
                defaultValue={endTime}
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
