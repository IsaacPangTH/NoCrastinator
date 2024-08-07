import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import TaskList from "./pages/TaskList";
import CalendarPage from "./pages/CalendarPage";
import FriendsList from "./pages/FriendsList";
import LeaderboardPage from "./pages/LeaderboardPage";
import Home from "./pages/Home";
function App() {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    if (permission === "default") {
      Notification.requestPermission().then((result) => {
        setPermission(result);
      });
    }
  }, [permission]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/tasklist" element={<TaskList />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/friends" element={<FriendsList />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
