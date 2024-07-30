import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, describe, beforeEach } from "vitest";
import WelcomeHeading from "../src/components/UI/WelcomeHeading";

describe("WelcomeHeading", () => {
  beforeEach(() => {
    sessionStorage.setItem("name", "John");
  });

  test("Renders the welcome message with the name from sessionStorage", () => {
    render(<WelcomeHeading />);
    expect(screen.getByText("Welcome John!")).toBeInTheDocument();
  });
});
