import { useState, useEffect } from "react";
import axios from "axios";
import { Avatar, Box, List, ListItem, Typography } from "@mui/material";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function Leaderboard() {
  const [friends, setFriends] = useState([]);
  const sortedFriends = friends.toSorted((a, b) => b.points - a.points);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.post(
        `${BACKEND_URL}/leaderboard`,
        { user: sessionStorage.getItem("user") },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setFriends(response.data);
    };
    fetchData();
  }, []);

  return (
    <>
      <List>
        {sortedFriends.map((friend) => {
          return (
            <ListItem key={friend.id} sx={{ width: "100%" }}>
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
