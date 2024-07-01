import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Home from "../src/pages/Home";

describe("Home Component", () => {
  test("Renders the login button", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole("button", { name: /log in/i });
    expect(loginButton).toBeInTheDocument();
  });

  test("Renders the sign-up button", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const signUpButton = screen.getByRole("button", { name: /sign up/i });
    expect(signUpButton).toBeInTheDocument();
  });
});
