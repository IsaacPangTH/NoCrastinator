import React from "react";
import { Box, Card, Divider, Typography } from "@mui/material";
import { format } from "date-fns";

export default function ScheduledCard({ start, end }) {
  return (
    <Box paddingX={3} paddingY={0.5}>
      <Card
        variant="outlined"
        sx={{
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          display: "flex",
          alignItems: "center",
          borderRadius: 3,
        }}
      >
        <Typography variant="body2" paddingX={1}>
          Scheduled
        </Typography>
        <Divider orientation="vertical" flexItem sx={{ backgroundColor: "#FFF" }} />
        <Box display="flex" flexDirection="column" paddingX={1} alignItems="end">
          <Typography variant="body2">Start: {format(start, "do MMM yyyy, HH:mm")}</Typography>{" "}
          <Typography variant="body2">End: {format(end, "do MMM yyyy, HH:mm")}</Typography>
        </Box>
      </Card>
    </Box>
  );
}
