import { Typography } from "@mui/material";
import React from "react";

export default function PageTitle({ children }) {
  return (
    <Typography variant="h4" paddingBottom={2}>
      {children}
    </Typography>
  );
}
