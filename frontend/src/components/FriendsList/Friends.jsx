import { React, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

export default function Friends() {
  const [friends, setFriends] = useState(
    /* test friends, should be removed*/ ["Tom", "Jim", "Dick", "Harry", "Harvey", "Miun", "Ron"]
  );
  const [addFriendDialogOpen, setAddFriendDialogOpen] = useState(false);
  const handleCloseAddFriend = () => setAddFriendDialogOpen(false);
  const handleAddFriend = () => handleCloseAddFriend();
  return (
    <>
      <Button onClick={() => setAddFriendDialogOpen(true)}>Add Friends</Button>
      <Grid container spacing={7} padding={2}>
        {friends.map((name) => (
          <Grid item xs={4}>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
              <Avatar /> <Typography>{name}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
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
