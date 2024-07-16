import React from "react";
import { Typography } from "@mui/material";

export default function WelcomeHeading() {
  return <Typography variant="h5">Welcome {sessionStorage.getItem("name")}!</Typography>;
}
