import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { screen, waitFor } from "@testing-library/dom";
import setupHTML from "../setupHtml.js";
import userEvent from "@testing-library/user-event";
import { users, initializeApp, handleLoadAllUsers } from "../public/index.js";

describe("user management", () => {
  beforeEach(() => {
    setupHTML();
    // Initialize the app after HTML is set up
    initializeApp();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("dom elements", () => {
    test("renders crud buttons", () => {
      const loadAllUsersBtn = screen.getByRole("button", {
        name: "Load All Users",
      });
      const createUserBtn = screen.getByRole("button", {
        name: "Create User",
      });
      const deleteUserBtn = screen.getByRole("button", {
        name: "Delete User",
      });
      const updateUserBtn = screen.getByRole("button", {
        name: "Update User",
      });

      expect(loadAllUsersBtn).toBeInTheDocument();
      expect(createUserBtn).toBeInTheDocument();
      expect(deleteUserBtn).toBeInTheDocument();
      expect(updateUserBtn).toBeInTheDocument();
    });

    test("crud buttons clicks once", async () => {
      const user = userEvent.setup();
      let mockFn = vi.fn();

      const loadAllUsersBtn = screen.getByRole("button", {
        name: "Load All Users",
      });
      const createUserBtn = screen.getByRole("button", {
        name: "Create User",
      });
      const deleteUserBtn = screen.getByRole("button", {
        name: "Delete User",
      });
      const updateUserBtn = screen.getByRole("button", {
        name: "Update User",
      });

      // Mock the event handlers to track calls
      const originalClick = createUserBtn.click;
      createUserBtn.click = mockFn;

      await user.click(createUserBtn);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test("api functions", async () => {
      const dom = document.body.innerHTML;
      console.log(dom);

      // Setup MSW server before making requests
      const { server } = await import("../tests/server.js");
      const { http, HttpResponse } = await import("msw");

      // Configure server to return 500 error
      server.use(
        http.get("/api/users", () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      const user = userEvent.setup();
      const loadAllUsersBtn = screen.getByRole("button", {
        name: "Load All Users",
      });

      expect(loadAllUsersBtn).toBeInTheDocument();

      // Click the button which should trigger the API call
      await user.click(loadAllUsersBtn);

      // Wait for the error message to appear
      await waitFor(
        () => {
          const displayMsg = screen.getByTestId("messageDiv");
          expect(displayMsg).toHaveTextContent("Error loading users");
        },
        { timeout: 3000 }
      );
    });

    test("users function returns empty array on error", async () => {
      const { server } = await import("../tests/server.js");
      const { http, HttpResponse } = await import("msw");

      server.use(
        http.get("/api/users", () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      const result = await users();
      expect(result).toEqual([]);
    });
  });
});
