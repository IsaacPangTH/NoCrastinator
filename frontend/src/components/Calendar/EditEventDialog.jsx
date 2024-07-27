import React, { useState, useEffect } from "react";
import {
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
import DtPicker from "../UI/DtPicker";
import { isAfter } from "date-fns";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function EditEventDialog(props) {
  const { open, onClose, event } = props;
  const [startDateTime, setStartDateTime] = useState(event.start);
  const [endDateTime, setEndDateTime] = useState(event.end);
  const [openInvalidInput, setOpenInvalidInput] = useState(false);

  useEffect(() => {
    if (event) {
      setStartDateTime(event.start);
      setEndDateTime(event.end);
    }
  }, [event]);

  const handleChangeStart = (newValue) => setStartDateTime(newValue);
  const handleChangeEnd = (newValue) => setEndDateTime(newValue);

  const handleClose = () => {
    onClose();
    setStartDateTime(event.start);
    setEndDateTime(event.end);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (e) => {
            e.preventDefault();
            if (
              startDateTime === null ||
              endDateTime === null ||
              isAfter(startDateTime, endDateTime)
            ) {
              setOpenInvalidInput(true);
            } else {
              try {
                const form = new FormData(e.currentTarget);
                const formJson = Object.fromEntries(form.entries());
                formJson.id = event.id;
                const response = await axios.patch(`${BACKEND_URL}/events`, formJson, {
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
              } catch (error) {
                console.log(error);
                alert("Backend is down! Please try again later.");
              }
              handleClose();
            }
          },
        }}
      >
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <Stack spacing={3} width={300}>
            <TextField
              autoFocus
              autoComplete="off"
              required
              margin="dense"
              id="title"
              name="title"
              label="Event Title"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={event.title}
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
          <Button type="submit">Edit event</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openInvalidInput}
        autoHideDuration={5000}
        onClose={() => setOpenInvalidInput(false)}
        message="Input valid start and end times."
      />
    </>
  );
}
