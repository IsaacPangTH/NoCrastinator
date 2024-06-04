import React, { useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import Task from "../components/Task";
import Tasks from "../components/Tasks";
import { useNavigate } from "react-router-dom";

export default function TaskList() {
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
      <h1>Welcome {sessionStorage.getItem("user")}!</h1>
      <h1>Task List</h1>
      <Tasks />
    </NavBar>
  );
}
