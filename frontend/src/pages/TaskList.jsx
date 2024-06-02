import React from "react";
import NavBar from "../components/NavBar";
import Task from "../components/Task";
import Tasks from "../components/Tasks";

export default function TaskList() {
  return (
    <NavBar p={3}>
      <h1>Task List</h1>
      <Tasks />
    </NavBar>
  );
}
