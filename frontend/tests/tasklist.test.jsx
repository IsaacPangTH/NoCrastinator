import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TaskList from "../src/pages/TaskList";
import { vi } from "vitest";

describe("TaskList component", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  test("Redirects to /login if the user is not logged in", () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={["/tasks"]}>
        <Routes>
          <Route path="/login" element={<div>Sign in</div>} />
          <Route path="/tasks" element={<TaskList />} />
        </Routes>
      </MemoryRouter>
    );

    expect(alertMock).toHaveBeenCalledWith("Please Login!");
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  test("Shows the task list if the user is logged in", () => {
    sessionStorage.setItem("name", "John");

    render(
      <MemoryRouter initialEntries={["/tasks"]}>
        <Routes>
          <Route path="/tasks" element={<TaskList />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Welcome John!")).toBeInTheDocument();
    expect(screen.getByText("To-do")).toBeInTheDocument();
  });
});
