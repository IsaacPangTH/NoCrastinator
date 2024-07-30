import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PageTitle from "../src/components/UI/PageTitle";

describe("PageTitle Component", () => {
  test("Renders the correct title text", () => {
    render(<PageTitle>Test Title</PageTitle>);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });
});
