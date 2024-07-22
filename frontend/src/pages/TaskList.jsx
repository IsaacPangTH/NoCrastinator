import React, { useEffect, useRef } from "react";
import NavBar from "../components/UI/NavBar";
import Tasks from "../components/TaskList/Tasks";
import { useNavigate } from "react-router-dom";
import WelcomeHeading from "../components/UI/WelcomeHeading";
import PageTitle from "../components/UI/PageTitle";

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
      <PageTitle>Task List</PageTitle>
      <Tasks />
    </NavBar>
  );
}
