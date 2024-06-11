import React, { useState } from "react";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DateTime } from "luxon";

export default function Task({
  id,
  title,
  onComplete,
  onUncomplete,
  completed,
  dueDate,
  isTimeSpecific = false,
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%" }}>
      <IconButton onClick={completed ? () => onUncomplete(id) : () => onComplete(id)}>
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

        {dueDate !== null ? (
          <Typography
            variant="caption"
            color={
              !isTimeSpecific && dueDate.hasSame(DateTime.now(), "day")
                ? "black"
                : dueDate < DateTime.now()
                ? "red"
                : "black"
            }
          >
            {isTimeSpecific
              ? "Due: " + dueDate.toLocaleString(DateTime.DATETIME_SHORT)
              : "Due: " + dueDate.toLocaleString(DateTime.DATE_SHORT)}
          </Typography>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
}
