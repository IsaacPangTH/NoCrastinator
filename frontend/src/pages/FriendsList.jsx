import React, { useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import Friends from "../components/Friends";

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
      <h1>Welcome {sessionStorage.getItem("name")}!</h1>
      <h1>Friend's List</h1>
      <Friends />
    </NavBar>
  );
}
