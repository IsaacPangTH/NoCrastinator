import React, { useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import Leaderboard from "../components/Leaderboard";
import { Typography } from "@mui/material";
import WelcomeHeading from "../components/WelcomeHeading";

export default function LeaderboardPage() {
  const alertShownRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!alertShownRef.current) {
      if (!sessionStorage.getItem("user")) {
        alert("Please Login!");
        alertShownRef.current = true;
        return navigate("/login");
      }
    }
  }, []);

  return (
    <NavBar p={3}>
      <WelcomeHeading />
      <Typography variant="h4">Leaderboard</Typography>
      <Leaderboard />
    </NavBar>
  );
}
