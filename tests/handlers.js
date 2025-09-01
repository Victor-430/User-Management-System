import { http, HttpResponse } from "msw";
import {
  createUser,
  findById,
  removeUser,
  updateUserModel,
} from "../models/userModel";
import { v4 as uuidv4 } from "uuid";

export const handlers = [
  // get users
  http.get("/api/users", async () => {
    try {
      return HttpResponse.json(
        {
          success: true,
          users: [
            {
              _id: "45da68e074934600a3b36529eb3ae6bb",
              createdAt: "2025-06-27T09:51:50.244Z",
              updatedAt: "2025-06-27T09:51:50.244Z",
              __v: 0,
              name: "John jesus1234",
              password: "ddjdjj126GH",
              email: "oyeleke123@gmail.com",
              role: "user",
            },
          ],
        },
        { status: 200 }
      );
    } catch (error) {
      return new HttpResponse(
        JSON.stringify({ error: "failed to fetch users" }),
        {
          status: 500,

          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }),

  // get user with id
  http.get("/api/users/:id", async ({ params }) => {
    try {
      const { id } = params;
      if (!id) {
        return new HttpResponse(
          JSON.stringify({ error: "User ID is required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      const user = await findById(id);
      if (!user) {
        return new HttpResponse(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      return HttpResponse.json(
        {
          success: true,
          user,
        },
        { status: 200 }
      );
    } catch (error) {
      return new HttpResponse(
        JSON.stringify({ error: "Failed to fetch user" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
  // create user
  http.post("/api/users", async ({ request }) => {
    try {
      const userData = await request.json();

      // add id if not provided
      if (!userData._id) {
        userData._id = uuidv4().split("-", 28).join("");
      }
      const createdUser = await createUser(userData);

      return HttpResponse.json(
        {
          success: true,
          message: "User created successfully",
          user: createdUser,
        },
        { status: 201 }
      );
    } catch (error) {
      return new HttpResponse(
        JSON.stringify({
          error: "Error creating user",
          success: false,
          message: error.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
  // update user
  http.put("/api/users/:id", async ({ params, request }) => {
    // get id from body
    // check if id is found from the request
    // check if the user exists
    // update user details
    try {
      const { id } = params;
      if (!id) {
        return new HttpResponse(
          JSON.stringify({ error: "User with ID is required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const existingUser = await findById(id);
      if (!existingUser) {
        return new HttpResponse(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      const updateData = request.json();
      const updateUserData = {
        ...existingUser,
        ...updateData,
        id,
      };

      const updatedUser = await updateUserModel(updateUserData, id);
      return HttpResponse.json(
        {
          success: true,
          message: "User updated succesfully",
          updatedUser,
        },
        { status: 200 }
      );
    } catch (error) {
      return new HttpResponse(
        JSON.stringify(
          {
            error: "Error updating user",
            success: false,
            message: error.message,
          },
          {
            status: 500,

            headers: { "Content-Type": "application/json" },
          }
        )
      );
    }
  }),

  // delete user
  http.delete("/api/users/:id", async ({ params }) => {
    try {
      const { id } = params;
      if (!id) {
        return new HttpResponse(
          JSON.stringify(
            { error: "User ID is required" },
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          )
        );
      }

      const existingUser = await findById(id);
      if (!existingUser) {
        return new HttpResponse(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      const remainingUsers = await removeUser(id);

      return HttpResponse.json(
        {
          users: remainingUsers,
          success: true,
          message: "User successfullly deleted",
        },
        { status: 200 }
      );
    } catch (error) {
      return new HttpResponse(
        JSON.stringify(
          {
            error: "Error deleting user",
            success: false,
            message: error.message,
          },
          {
            status: 500,

            headers: { "Content-Type": "application/json" },
          }
        )
      );
    }
  }),
];
