import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Typography,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function NusmodsDialog({ open, onClose }) {
  const [link, setLink] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [openInvalidInput, setOpenInvalidInput] = useState(false);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    setUpdate(false);
    const fetchData = async () => {
      const response = await axios.post(
        `${BACKEND_URL}/link`,
        { user: sessionStorage.getItem("user") },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLink(response.data);
    };
    fetchData();
  }, [update, openInvalidInput]);

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setLink(clipboardText);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.patch(
        `${BACKEND_URL}/link`,
        { user: sessionStorage.getItem("user"), link: "" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.log(error);
      alert("Backend is down! Please try again later.");
    }
    setUpdate(true);
    setDeleteOpen(false);
  };

  const handleCancel = () => {
    setUpdate(true);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event) => {
            event.preventDefault();
            if (!link.startsWith("https://nusmods.com/timetable/")) {
              setOpenInvalidInput(true);
            } else {
              try {
                const response = await axios.patch(
                  `${BACKEND_URL}/link`,
                  { user: sessionStorage.getItem("user"), link: link },
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );
              } catch (error) {
                console.log(error);
                alert("Backend is down! Please try again later.");
              }
            }
            setUpdate(true);
            onClose();
          },
        }}
      >
        <DialogTitle>Sync NUSMods</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", paddingTop: 2, paddingBottom: 3 }}>
            <Typography>
              Use the "Share/Sync" link from NUSMods to add classes and exams to your calendar
            </Typography>
            <Box display="flex" paddingTop={2}>
              <TextField
                autoComplete="off"
                required
                disabled
                margin="none"
                id="link"
                name="link"
                label="Share/Sync Link"
                type="url"
                fullWidth
                variant="outlined"
                value={link}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                }}
              />
              {link === "" ? (
                <Button
                  variant="contained"
                  onClick={() => handlePaste()}
                  disableElevation
                  sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                >
                  <ContentPasteIcon />
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setDeleteOpen(true)}
                  disableElevation
                  sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                >
                  <DeleteForeverIcon />
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} variant="contained">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Sync
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Unsync NUSMods</DialogTitle>
        <DialogContent>
          Continuing will delete all currently synced classes and exams from your calendar. This
          action is IRREVERSIBLE. Are you sure you wish to continue?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} variant="contained">
            Cancel
          </Button>
          <Button onClick={() => handleDelete()} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openInvalidInput}
        autoHideDuration={5000}
        onClose={() => setOpenInvalidInput(false)}
        message="Paste a valid link"
      />
    </>
  );
}
