import { React, useState } from "react";
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

export default function Friends() {
  const [friends, setFriends] = useState(
    /* test friends, should be removed*/ ["Tom", "Jim", "Dick", "Harry", "Harvey", "Miun", "Ron"]
  );
  const [requests, setRequests] = useState([
    "Tom",
    "Jim",
    "Dick",
    "Harry",
    "Harvey",
    "Miun",
    "Ron",
  ]);
  const [addFriendDialogOpen, setAddFriendDialogOpen] = useState(false);
  const handleCloseAddFriend = () => setAddFriendDialogOpen(false);
  const handleAddFriend = () => handleCloseAddFriend();
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
                {requests.map((name) => (
                  <Grid
                    item
                    xs={4}
                    paddingY={2}
                    paddingX={8}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box
                      sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}
                    >
                      <Avatar /> <Typography>{name}</Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}
                    >
                      <Fab
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{ boxShadow: "none" }}
                      >
                        <CheckIcon />
                      </Fab>
                      <Fab
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ boxShadow: "none" }}
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
              {friends.map((name) => (
                <Grid item xs={4}>
                  <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                    <Avatar /> <Typography>{name}</Typography>
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
          onSubmit: handleAddFriend,
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
