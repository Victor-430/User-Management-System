import { describe, expect, test } from "vitest";
import { logRoles, prettyDOM, screen, waitFor } from "@testing-library/dom";
import setupHTML from "../setupHtml";
import userEvent from "@testing-library/user-event";

describe("container ", () => {
  beforeEach(() => {
    setupHTML();
  });
  test.todo("heading", () => {
    const containerHeading = screen.getByRole("heading", {
      name: "User Management System",
    });

    expect(containerHeading).toBeInTheDocument();
  });

  describe("display message", () => {
    test.todo("loading all users", async () => {
      const displayMsg = await screen.findByText("Loading users");
      expect(displayMsg).toBeInTheDocument();
    });
  });
  test("user form", async () => {
    logRoles(setupHTML());
    const formHeading = screen.getByRole("heading", {
      name: "User Form",
    });
    expect(formHeading).toBeInTheDocument();
  });

  test("form label", () => {
    const formLabel = screen.getByLabelText(
      "* Select User (for Update/Delete):"
    );
    expect(formLabel).toBeInTheDocument();
  });

  test("form section paragraph", () => {
    const formSectionParagraph = screen.getByText("* Form (for Create/update)");
    expect(formSectionParagraph).toBeInTheDocument();
  });

  test("name placholder value", () => {
    const namePlaceholder = screen.getByRole("textbox", { name: "Name *" });
    expect(namePlaceholder).toContainElement();
  });
  test("form name container ", () => {
    const namePlaceholder = screen.getByTestId("name-container");
    expect(namePlaceholder).toContainHTML(`<input
            data-testId="value-container"
            type="text"
            id="name"
            placeholder="Enter full name"
            required
          />`);
  });

  test("Email placeholder value", () => {
    const emailPlacholder = screen.getByPlaceholderText("Enter email address");
    expect(emailPlacholder).toBeInTheDocument();
  });

  test("role select", () => {
    const displayRole = screen.getByDisplayValue("user");
    expect(displayRole).toBeInTheDocument();
  });

  describe("crud buttons", () => {
    test("renders correctly", () => {
      const createBtn = screen.getByRole("button", { name: "Create User" });
      const updateBtn = screen.getByRole("button", { name: "Update User" });
      const deleteBtn = screen.getByRole("button", { name: "Delete User" });
      const loadBtn = screen.getByRole("button", { name: "Load All Users" });

      expect(createBtn).toBeInTheDocument();
      expect(updateBtn).toBeInTheDocument();
      expect(deleteBtn).toBeInTheDocument();
      expect(loadBtn).toBeInTheDocument();
    });

    test("message display for create user", async () => {
      userEvent.setup();
      const displayMsg = screen.getByTestId("messageDiv");
      const createBtn = screen.getByRole("button", {
        name: "Create User",
      });

      await userEvent.click(createBtn);
      await waitFor(() => {
        expect(displayMsg).toContain("User created successfully!");
      });
    });

    test("message display for update user", async () => {
      userEvent.setup();
      const displayMsg = screen.getByTestId("messageDiv");
      const updateBtn = screen.getByRole("button", {
        name: "Update User",
      });

      await userEvent.click(updateBtn);
      await waitFor(() =>
        expect(displayMsg).toHaveTextContent("User updated successfully!")
      );
      // expect(displayMsg).toHaveTextContent("Updating user ...")
    });
  });
});
test("message display for create user", async () => {
  userEvent.setup();
  const displayMsg = await screen.findByTestId("messageDiv");
  const createBtn = screen.getByRole("button", {
    name: "Create User",
  });

  await userEvent.click(createBtn);
  expect(displayMsg).not.toHaveTextContent("User created successfully!");

  test("loading text should not be found", async () => {
    await waitFor(async () => {
      const displayMsg = await screen.findByTestId("messageDiv");

      expect(displayMsg).not.toHaveTextContent("loading");
    });
  });
});
