import React from "react";
import { Typography } from "@mui/material";

export default function WelcomeHeading() {
  return (
    <Typography variant="h5" paddingBottom={3}>
      Welcome {sessionStorage.getItem("name")}!
    </Typography>
  );
}
