import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import TaskList from "./pages/TaskList";
import CalendarPage from "./pages/CalendarPage";
import FriendsList from "./pages/FriendsList";
import LeaderboardPage from "./pages/LeaderboardPage";
import Home from "./pages/Home";
import { createTheme, ThemeProvider } from "@mui/material/styles";
function App() {
  const theme = createTheme({
    palette: {
      white: {
        main: "#ffffff",
        light: "#ffffff",
        dark: "#ffffff",
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/newPassword" element={<ForgotPassword />} />
          <Route path="/tasklist" element={<TaskList />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/friends" element={<FriendsList />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
