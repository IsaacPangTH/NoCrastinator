import React, { useEffect, useRef } from "react";
import NavBar from "../components/UI/NavBar";
import Tasks from "../components/TaskList/Tasks";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import WelcomeHeading from "../components/UI/WelcomeHeading";

export default function TaskList() {
  const alertShownRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!alertShownRef.current && !sessionStorage.getItem("name")) {
      alert("Please Login!");
      alertShownRef.current = true;
      return navigate("/login");
    }
  }, []);

  return (
    <NavBar p={3}>
      <WelcomeHeading />
      <Typography variant="h4">Task List</Typography>
      <Tasks />
    </NavBar>
  );
}
