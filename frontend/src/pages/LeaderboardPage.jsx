import React, { useEffect, useRef } from "react";
import NavBar from "../components/UI/NavBar";
import { useNavigate } from "react-router-dom";
import Leaderboard from "../components/Leaderboard/Leaderboard";
import WelcomeHeading from "../components/UI/WelcomeHeading";
import PageTitle from "../components/UI/PageTitle";

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
      <PageTitle>Leaderboard</PageTitle>
      <Leaderboard />
    </NavBar>
  );
}
