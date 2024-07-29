import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import NoCrastinatorLogoWhite from "../../assets/NoCrastinatorWhite.png";
import NusmodsDialog from "../Nusmods/NusmodsDialog";

const drawerWidth = 100;

function NavbarButton({ icon, text, link }) {
  const navigate = useNavigate();
  const handleClick = () => navigate(link);
  return (
    <ListItem key={text} disablePadding>
      <ListItemButton onClick={handleClick}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            width: drawerWidth,
          }}
        >
          {icon}
          <ListItemText
            primary={text}
            primaryTypographyProps={{ variant: "caption", color: "#606060" }}
          />
        </Box>
      </ListItemButton>
    </ListItem>
  );
}

export default function NavBar({ children, p = 3 }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const openAccountMenu = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    alert("Logout successful!");
    navigate("../");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("notification")
  };

  const [nusmodsOpen, setNusmodsOpen] = useState(false);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box gap={2} sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <img src={NoCrastinatorLogoWhite} className="logoSmall" />
                <Typography variant="h6" noWrap component="div">
                  NoCrastinator
                </Typography>
              </Box>
              <Button onClick={handleMenuClick} color="inherit">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Avatar />
                  {sessionStorage.getItem("name")}
                </Box>
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              <NavbarButton
                icon={<ChecklistIcon color="primary" />}
                text="Task List"
                link="../tasklist"
              />
              <NavbarButton
                icon={<CalendarMonthOutlinedIcon color="primary" />}
                text="Calendar"
                link="../calendar"
              />
              <NavbarButton
                icon={<GroupOutlinedIcon color="primary" />}
                text="Friends List"
                link="../friends"
              />
              <NavbarButton
                icon={<LeaderboardOutlinedIcon color="primary" />}
                text="Leaderboard"
                link="../leaderboard"
              />
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: p }}>
          <Toolbar />
          {children}
        </Box>
      </Box>
      <Menu
        id="accountMenu"
        anchorEl={anchorEl}
        open={openAccountMenu}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "accountMenuButton",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => {
            setNusmodsOpen(true);
            handleMenuClose();
          }}
        >
          Sync NUSMods
        </MenuItem>
        <MenuItem onClick={handleLogout}>Log Out</MenuItem>
      </Menu>
      <NusmodsDialog open={nusmodsOpen} onClose={() => setNusmodsOpen(false)} />
    </>
  );
}
