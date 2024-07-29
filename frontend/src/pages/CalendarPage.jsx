import React, { useEffect, useRef } from "react";
import NavBar from "../components/UI/NavBar";
import { useNavigate } from "react-router-dom";
import TaskCalendar from "../components/Calendar/Calendar";
import WelcomeHeading from "../components/UI/WelcomeHeading";

export default function CalendarPage() {
  const alertShownRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!alertShownRef.current && !sessionStorage.getItem("user")) {
      alert("Please Login!");
      alertShownRef.current = true;
      return navigate("/login");
    }
  }, []);

  return (
    <NavBar p={3}>
      <WelcomeHeading />
      <TaskCalendar />
    </NavBar>
  );
}
