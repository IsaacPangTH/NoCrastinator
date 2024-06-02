import React, { useState } from "react";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Task({ id, title, onComplete, onUncomplete, completed }) {
  const [isCompleted, setIsCompleted] = useState(completed);
  const handleComplete = () => {
    onComplete(id);
    setIsCompleted(true);
  };
  const handleUncomplete = () => {
    onUncomplete(id);
    setIsCompleted(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <IconButton onClick={isCompleted ? handleUncomplete : handleComplete}>
        {isCompleted ? <CheckCircleIcon /> : <CircleOutlinedIcon />}
      </IconButton>
      <Typography sx={isCompleted ? { textDecoration: "line-through", color: "#818181" } : null}>
        {title}
      </Typography>
    </Box>
  );
}
