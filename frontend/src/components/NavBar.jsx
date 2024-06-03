import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ChecklistIcon from "@mui/icons-material/Checklist";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";

const drawerWidth = 100;
const icons = [
  <ChecklistIcon color="primary" />,
  <CalendarMonthOutlinedIcon color="primary" />,
  <GroupOutlinedIcon color="primary" />,
  <LeaderboardOutlinedIcon color="primary" />,
];

export default function NavBar({ children, p = 3 }) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            NoCrastinator
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}>
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {["Task List", "Calendar", "Friends", "Leaderboard"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "center",
                      width: drawerWidth,
                    }}>
                    {icons[index]}
                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{ variant: "caption", color: "#606060" }}
                    />
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: p }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
