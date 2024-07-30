/// <reference types="cypress" />

describe("Login", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("Login with existing email and correct password", () => {
    cy.contains("Log in").click();
    cy.get("#email").type("test@email.com");
    cy.get("#password").type("test");
    cy.contains("Sign In").click();
    cy.on("window:alert", (text) => {
      expect(text).to.contains("Login successful!");
    });
    cy.contains("Task List");
  });

  it("Login with existing email but incorrect password", () => {
    cy.contains("Log in").click();
    cy.get("#email").type("test@email.com");
    cy.get("#password").type("1234");
    cy.contains("Sign In").click();
    cy.on("window:alert", (text) => {
      expect(text).to.contains("Wrong password!");
    });
    cy.contains("Sign in");
  });

  it("Login with non-existing email", () => {
    cy.contains("Log in").click();
    cy.get("#email").type("john@email.com");
    cy.get("#password").type("1234");
    cy.contains("Sign In").click();
    cy.on("window:alert", (text) => {
      expect(text).to.contains("Email is not registered!");
    });
    cy.contains("Sign in");
  });
});

describe("Task", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
    cy.contains("Log in").click();
    cy.get("#email").type("test@email.com");
    cy.get("#password").type("test");
    cy.contains("Sign In").click();
  });

  it("Add task with due date and time", () => {
    cy.contains("Add Task").click();
    cy.get("#title").type("Test task");
    cy.get("[name=dueDate]").type("2024-01-01");
    cy.get("[name=dueTime]").type("23:59");
    cy.get("form").submit();
    cy.contains("Test task");
    cy.contains("Due: 1st Jan 2024, 23:59");
  });

  it("Delete task", () => {
    cy.get("[id*=menu-button-").eq(0).click();
    cy.contains("Delete").click();
    cy.contains("Test task").should("not.exist");
  });
});
