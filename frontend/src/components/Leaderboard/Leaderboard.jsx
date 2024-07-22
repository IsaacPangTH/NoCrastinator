import { react, useState } from "react";
import { Avatar, Box, List, ListItem, Typography } from "@mui/material";

export default function Leaderboard() {
  const [friends, setFriends] = useState([{ name: "John", points: 100, user: 1 }]);
  const sortedFriends = friends.toSorted();

  return (
    <>
      <List>
        {sortedFriends.map((friend) => {
          return (
            <ListItem key={friend.user} sx={{ width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                  paddingRight: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <Typography>{sortedFriends.indexOf(friend) + 1}</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Avatar />
                    <Typography>{friend.name}</Typography>
                  </Box>
                </Box>
                <Typography>{friend.points} points</Typography>
              </Box>
            </ListItem>
          );
        })}
      </List>
    </>
  );
}
