import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { screen, waitFor } from "@testing-library/dom";
import setupHTML from "../setupHtml.js";
import userEvent from "@testing-library/user-event";
import { initializeApp, users } from "../public/index.js";
import { http, HttpResponse } from "msw";
import { server } from "../tests/server.js";
import { v4 as uuidv4 } from "uuid";

const mockData = [
  {
    _id: "45da68e074934600a3b36529eb3ae6bb",
    createdAt: "2025-06-27T09:51:50.244Z",
    updatedAt: "2025-06-27T09:51:50.244Z",
    __v: 0,
    name: "John gabriel",
    password: "ddjdjj126GH",
    email: "oyeleke123@gmail.com",
    role: "user",
  },
  {
    _id: "45da68e074934600a3b36529eb3ae6ba",
    createdAt: "2025-05-27T09:51:50.244Z",
    updatedAt: "2025-07-27T09:51:50.244Z",
    __v: 0,
    name: "John jesus",
    password: "ddjdjj126GH",
    email: "oyeleke@gmail.com",
    role: "admin",
  },
];

describe("user management", () => {
  beforeEach(() => {
    setupHTML();

    initializeApp();

    vi.clearAllMocks();

    server.use(
      http.get("/api/users", () => {
        // return HttpResponse.json(mockData);
        return new HttpResponse(JSON.stringify(mockData), { status: 200 });
      }),
      http.post("/api/users", async ({ request }) => {
        // const reqData = JSON.stringify(request.body);
        // const createdUser = JSON.parse(reqData);

        const createdUser = await request.json();
        if (!createdUser._id) {
          createdUser._id = uuidv4().split("-", 28).join("");
        }

        const { name, password, email, role, _id } = createdUser;

        const newUser = {
          name,
          password,
          email,
          role,
          _id,
          createdAt: "2026-06-27T07:51:50.244Z",
          updatedAt: "2025-06-27T05:51:50.244Z",
          __v: 0,
        };

        mockData.push(newUser);
        return new HttpResponse(JSON.stringify(newUser), { status: 201 });
        // return HttpResponse.json(newUser, { status: 201 });
      }),
      http.put("/api/users/:id", ({ requestId, request }) => {
        return new HttpResponse(
          // JSON.stringify({
          //   _id: "45da68e074934600a3b36529eb3ae6jg",
          //   createdAt: "2025-05-27T09:51:50.244Z",
          //   updatedAt: "2025-07-27T09:51:50.244Z",
          //   __v: 0,
          //   name: "John gabriella",
          //   password: "ddjdjj126GH",
          //   email: "johngabriel@gmail.com",
          //   role: "admin",
          // }),
          { status: 201 }
        );
      }),
      http.delete("/api/users/:id", () => {
        return new HttpResponse(JSON.stringify("User deleted successfully"), {
          status: 200,
        });
      })
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });
  describe("dom elements", () => {
    test.skip("renders crud buttons", () => {
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

    test.skip("crud buttons clicks once", async () => {
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

      const originalClick = createUserBtn.click;
      createUserBtn.click = mockFn;

      await userEvent.click(createUserBtn);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    describe("api function", () => {
      test.skip("returns error whwen a user clicks load btn", async () => {
        // user clicks load all buttons
        // api/users is called
        // api returns an error status of 500
        // message error is displayed to the users

        const { server } = await import("../tests/server.js");
        const { http, HttpResponse } = await import("msw");

        userEvent.setup();
        const loadAllUsersBtn = screen.getByRole("button", {
          name: "Load All Users",
        });

        expect(loadAllUsersBtn).toBeInTheDocument();

        await userEvent.click(loadAllUsersBtn);

        server.use(
          http.get("/api/users", () => {
            return new HttpResponse(null, { status: 500 });
          })
        );

        await waitFor(
          () => {
            const displayMsg = screen.getByTestId("messageDiv");
            expect(displayMsg).toHaveTextContent("Error loading users");
          },
          { timeout: 3000 }
        );
      });

      test.skip("shows table with user", async () => {
        userEvent.setup();

        const loadBtn = screen.getByRole("button", { name: "Load All Users" });
        expect(loadBtn).toBeInTheDocument();

        await userEvent.click(loadBtn);

        await waitFor(
          () => {
            const displayMsg = screen.getByTestId("messageDiv");
            expect(displayMsg).toHaveTextContent("Successfully loaded 2 users");

            const table = screen.getByRole("table");

            expect(table).toBeInTheDocument();

            expect(screen.getByText("John jesus")).toBeInTheDocument();
            expect(screen.getByText("John gabriel")).toBeInTheDocument();
          },
          { timeout: 3000 }
        );
      });
    });

    test.skip("users function returns empty array on error", async () => {
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

    test("create a user by filling form", { timeout: 9000 }, async () => {
      userEvent.setup();

      // input fields
      const passwordField = screen.getByLabelText(/Password/i);
      const emailField = screen.getByLabelText(/Email/i);
      const roleField = screen.getByLabelText(/Role/i);
      const nameField = screen.getByLabelText(/Name/i);
      const createBtn = screen.getByRole("button", { name: "Create User" });

      await userEvent.type(passwordField, "Davinci123");
      await userEvent.type(emailField, "davinci123@gmail.com");
      await userEvent.selectOptions(roleField, "admin");
      await userEvent.type(nameField, "davinci bidemi");

      // create btn
      await userEvent.click(createBtn);

      await waitFor(() => {
        expect(screen.getByTestId(/Creating user.../i)).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          screen.getByTestId(/User created successfully!/i)
        ).toBeInTheDocument();
      }, 3000);

      // expect(screen.getByLabelText(/Password/i)).toHaveValue("");
      // expect(screen.getByLabelText(/Email/i)).toHaveValue("");
      // expect(screen.getByLabelText(/Name/i)).toHaveValue("");
      // expect(screen.getByLabelText(/Role/i)).toHaveValue("");

      // const displayMsg = screen.getByTestId("messageDiv");
      // expect(displayMsg).toHaveTextContent(/User created successfully!/i);

      // expect(screen.getByRole("table")).toBeInTheDocument();

      // expect(screen.getByText("davinci123")).toBeInTheDocument();
      // expect(screen.getByText("davinci123@gmail.com")).toBeInTheDocument();
      // expect(screen.getByText("admin")).toBeInTheDocument();
      // expect(screen.getByText("davinci bidemi")).toBeInTheDocument();
    });

    test.skip("user submits incomplete form when they create a user", async () => {
      userEvent.setup();

      const nameField = screen.getByLabelText("Name *");
      await userEvent.type(nameField, "Victor");

      const createBtn = screen.getByRole("button", { name: "Create User" });
      await userEvent.click(createBtn);

      await waitFor(() => {
        const messageDiv = screen.getByTestId("messageDiv");
        expect(messageDiv).toHaveTextContent(
          "Please fill in all required fields (name, email, password,role)"
        );
      });
    });

    test.skip("user fills an invalid email when they create a user", async () => {
      userEvent.setup();

      const nameField = screen.getByLabelText("Name *");
      const emailField = screen.getByLabelText("Email *");
      const passwordField = screen.getByLabelText(/password/i);
      const roleField = screen.getByRole("combobox", { name: "Role" });

      await userEvent.selectOptions(roleField, "Admin");
      await userEvent.type(passwordField, "Victor123");
      await userEvent.type(nameField, "Victor");
      await userEvent.type(emailField, "Victor.com");

      const createBtn = screen.getByRole("button", { name: "Create User" });
      await userEvent.click(createBtn);

      await waitFor(() => {
        const messageDiv = screen.getByTestId("messageDiv");
        expect(messageDiv).toHaveTextContent(
          "Please enter a valid email address"
        );
      });
    });

    test.skip("user fills a weak password when they create a user", async () => {
      userEvent.setup();

      const nameField = screen.getByLabelText("Name *");
      const emailField = screen.getByLabelText("Email *");
      const passwordField = screen.getByLabelText(/password/i);
      const roleField = screen.getByRole("combobox", { name: "Role" });

      await userEvent.selectOptions(roleField, "Admin");
      await userEvent.type(passwordField, "Victor");
      await userEvent.type(nameField, "Victor");
      await userEvent.type(emailField, "Victor@gmail.com");

      const createBtn = screen.getByRole("button", { name: "Create User" });
      await userEvent.click(createBtn);

      await waitFor(() => {
        const messageDiv = screen.getByTestId("messageDiv");
        expect(messageDiv).toHaveTextContent(
          "Password must be at least 8 characters with uppercase, lowercase, and number"
        );
      });
    });
  });
});
