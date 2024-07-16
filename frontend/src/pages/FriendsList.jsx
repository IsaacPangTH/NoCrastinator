import React, { useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import Friends from "../components/Friends";
import { Typography } from "@mui/material";
import WelcomeHeading from "../components/WelcomeHeading";

export default function FriendsList() {
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
      <Typography variant="h4">Friend's List</Typography>
      <Friends />
    </NavBar>
  );
}
