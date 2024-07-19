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

export default function AddEventDialog(props) {
  const { open, onClose } = props;
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [openInvalidInput, setOpenInvalidInput] = useState(false);

  const handleChangeStart = (newValue) => setStartDateTime(newValue);
  const handleChangeEnd = (newValue) => setEndDateTime(newValue);

  const handleClose = () => {
    onClose();
    setStartDateTime(null);
    setEndDateTime(null);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event) => {
            event.preventDefault();
            if (
              startDateTime === null ||
              endDateTime === null ||
              isAfter(startDateTime, endDateTime)
            ) {
              setOpenInvalidInput(true);
            } else {
              try {
                const form = new FormData(event.currentTarget);
                const formJson = Object.fromEntries(form.entries());
                formJson.user = sessionStorage.getItem("user");
                const response = await axios.post(`${BACKEND_URL}/events`, formJson, {
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
        <DialogTitle>Schedule Task</DialogTitle>
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
          <Button type="submit">Add event</Button>
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
