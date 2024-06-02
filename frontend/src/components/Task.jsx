import React, { useState } from "react";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Task({ title, category = null, dueDate = null }) {
  const [isCompleted, setIsCompleted] = useState(false);
  const handleComplete = () => {
    setIsCompleted(true);
  };
  const handleUncomplete = () => {
    setIsCompleted(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <IconButton onClick={isCompleted ? handleUncomplete : handleComplete}>
        {isCompleted ? <CheckCircleIcon /> : <CircleOutlinedIcon />}
      </IconButton>
      <Typography>{title}</Typography>
    </Box>
  );
}
