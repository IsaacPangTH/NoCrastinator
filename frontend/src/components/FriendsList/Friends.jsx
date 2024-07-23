import { React, useState, useEffect } from "react";
import axios from "axios";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function Friends() {
  const [update, setUpdate] = useState(false);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [addFriendDialogOpen, setAddFriendDialogOpen] = useState(false);
  const handleCloseAddFriend = () => setAddFriendDialogOpen(false);

  useEffect(() => {
    setUpdate(false);
    const fetchData = async () => {
      const response1 = await axios.post(
        `${BACKEND_URL}/readrequests`,
        { user: sessionStorage.getItem("user") },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setRequests(response1.data);

      const response2 = await axios.post(
        `${BACKEND_URL}/readfriends`,
        { user: sessionStorage.getItem("user") },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setFriends(response2.data);
    };
    fetchData();
  }, [addFriendDialogOpen, update]);
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Button variant="contained" onClick={() => setAddFriendDialogOpen(true)}>
          Add Friends
        </Button>
      </Box>
      <Box paddingY={3}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="requests-content"
            id="requests-header"
            sx={{ backgroundColor: "#1976D2", paddingTop: requests.length > 0 && 1 }}
          >
            <Badge badgeContent={requests.length} color="error" sx={{ paddingRight: 1 }}>
              <Typography color="#FFFFFF" variant="h6">
                Requests
              </Typography>
            </Badge>
          </AccordionSummary>
          <AccordionDetails>
            {requests.length > 0 ? (
              <Grid container spacing={7} padding={2}>
                {requests.map((request) => (
                  <Grid
                    key={request.id}
                    item
                    xs={4}
                    paddingY={2}
                    paddingX={8}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box
                      sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}
                    >
                      <Avatar /> <Typography>{request.first_name}</Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}
                    >
                      <Fab
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{ boxShadow: "none" }}
                        onClick={async () => {
                          try {
                            const response = await axios.patch(
                              `${BACKEND_URL}/friends`,
                              { id: request.id },
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
                        }}
                      >
                        <CheckIcon />
                      </Fab>
                      <Fab
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ boxShadow: "none" }}
                        onClick={async () => {
                          try {
                            const response = await axios.delete(`${BACKEND_URL}/friends`, {
                              data: { id: request.id },
                              headers: {
                                "Content-Type": "application/json",
                              },
                            });
                          } catch (error) {
                            console.log(error);
                            alert("Backend is down! Please try again later.");
                          }
                          setUpdate(true);
                        }}
                      >
                        <CloseIcon />
                      </Fab>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography paddingTop={1}>
                No requests received. Use the button above to add new friends.
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="friends-content"
            id="friends-header"
            sx={{ backgroundColor: "#1976D2" }}
          >
            <Typography color="#FFFFFF" variant="h6">
              Friends
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={7} padding={2}>
              {friends.map((friend) => (
                <Grid key={friend.id} item xs={4}>
                  <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                    <Avatar /> <Typography>{friend.first_name}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Dialog
        open={addFriendDialogOpen}
        onClose={handleCloseAddFriend}
        PaperProps={{
          component: "form",
          onSubmit: async (event) => {
            event.preventDefault();
            try {
              const form = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(form.entries());
              formJson.user = sessionStorage.getItem("user");
              const response = await axios.post(`${BACKEND_URL}/friends`, formJson, {
                headers: {
                  "Content-Type": "application/json",
                },
              });
              alert(response.data);
            } catch (error) {
              console.log(error);
              alert("Backend is down! Please try again later.");
            }
            handleCloseAddFriend();
          },
        }}
      >
        <DialogTitle>Add Friend</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            autoComplete="off"
            required
            margin="dense"
            id="email"
            name="email"
            label="Enter friend's email"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddFriend}>Cancel</Button>
          <Button type="submit">Add Friend</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
