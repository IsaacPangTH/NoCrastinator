import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NoCrastinatorLogo from "../assets/NoCrastinatorLogo.png";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <Box
      gap={4}
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <img src={NoCrastinatorLogo} className="logoMid" />
      <Typography component="h1" variant="h3">
        Welcome to NoCrastinator
      </Typography>
      <Box gap={3} sx={{ display: "flex", flexDirection: "row" }}>
        <Button size="large" variant="contained" onClick={() => navigate("/login")}>
          Log in
        </Button>
        <Button size="large" variant="contained" onClick={() => navigate("/signup")}>
          Sign up
        </Button>
      </Box>
    </Box>
  );
}
