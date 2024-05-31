import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import NoCrastinatorLogo from "../assets/NoCrastinatorLogo.png";

const defaultTheme = createTheme();

export default function ForgotPassword() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src={NoCrastinatorLogo} className="logoBig" />
          <Box sx={{ alignItems: "left" }}>
            <Typography component="h1" variant="h5">
              Forgot Password
            </Typography>
            <Typography component="h2" variant="subtitle1">
              Recover access to your account by resetting your password.
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Request to reset password
            </Button>
            <Grid container>
              <Grid item xs>
                <Typography component="body" variant="body2">
                  Remember your password?
                </Typography>
                <Link href="./login" variant="body2">
                  Try signing in again
                </Link>
              </Grid>
              <Grid item sx={{ display: "flex", flexDirection: "column", alignItems: "right" }}>
                <Typography component="body" variant="body2">
                  Don't have an account?
                </Typography>
                <Link href="./signup" variant="body2" align="right">
                  {"Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
