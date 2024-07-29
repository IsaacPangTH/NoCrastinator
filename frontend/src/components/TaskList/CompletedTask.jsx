import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

export default function Task({ id, title, handleComplete, handleDelete, className = "task" }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%" }}>
        <IconButton onClick={() => handleComplete(id)}>
          <CheckCircleIcon />
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
          <Typography fontSize="large" sx={{ textDecoration: "line-through", color: "#818181" }}>
            {title}
          </Typography>
        </Box>

        <IconButton
          id={"menu-button-" + id}
          aria-controls={open ? "task-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleMenuClick}
        >
          <MoreHorizIcon />
        </IconButton>
        <Menu
          id="task-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          MenuListProps={{
            "aria-labelledby": "menu-button-" + id,
          }}
        >
          <MenuItem
            onClick={() => {
              handleDelete(id);
              handleMenuClose();
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
}
