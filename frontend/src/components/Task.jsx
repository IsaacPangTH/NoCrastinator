import React, { useState } from "react";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DateTime } from "luxon";

export default function Task({ id, title, handleComplete, completed, dueDate = "", dueTime = "" }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%" }}>
      <IconButton onClick={() => handleComplete(id)}>
        {completed ? <CheckCircleIcon /> : <CircleOutlinedIcon />}
      </IconButton>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          flexGrow: 1,
          justifyContent: "space-around",
        }}
      >
        <Typography
          fontSize="large"
          sx={completed ? { textDecoration: "line-through", color: "#818181" } : null}
        >
          {title}
        </Typography>

        {dueDate !== "" && (
          <Typography
            variant="caption"
            color={
              (dueTime === "" && DateTime.fromISO(dueDate).hasSame(DateTime.now(), "day")) ||
              DateTime.fromISO(dueDate + "T" + dueTime) >= DateTime.now()
                ? "black"
                : "red"
            }
          >
            Due: {dueDate} {dueTime !== "" && "at " + dueTime}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
