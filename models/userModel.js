import { writeDataToFile } from "../utils.js";
import { users } from "./users.j";
import { v4 as uuidv4 } from "uuid";

export const fetchAllUsers = async () => {
  return await users;
};

export const findById = async (id) => {
  try {
    const user = users.find((user) => user._id === id);

    return user;
  } catch (error) {
    console.error(`Error getting user with id ${id}`, error);
    throw new Error(`User with id not found`);
  }
};

export const createUser = async (newUser) => {
  try {
    const { name, password, email, role } = JSON.parse(newUser);

    const user = {
      name,
      password,
      email,
      role,
    };

    const _id = uuidv4().split("-", 28).join("");
    console.log(_id);
    const createNewUser = {
      _id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
      ...user,
    };

    users.push(createNewUser);
    await writeDataToFile(users);
    return createNewUser;
  } catch (error) {
    console.error(`Error creating user`, error);
    throw error;
  }
};

export const updateUserModel = async (user, id) => {
  try {
    const index = users.findIndex((user) => user._id === id);
    console.log(index);
    if (index === -1) {
      throw new Error(`User with id: ${id} not found`);
    }

    users[index] = {
      ...users[index],
      ...user,
      updatedAt: new Date().toISOString(),
    };
    await writeDataToFile(users);
    return users[index];
  } catch (error) {
    console.error(`Error updating user`);
    throw error;
  }
};

// Delete user

export const removeUser = async (id) => {
  try {
    const initialLength = users.length;
    const filteredUser = users.filter((user) => user._id !== id);
    if (initialLength === filteredUser.length) {
      throw new Error(`User with id: ${id} not found`);
    }

    users.length = 0;
    users.push(...filteredUser);

    await writeDataToFile(filteredUser);
    return filteredUser;
  } catch (error) {
    console.error(`Error occured removing user with id: ${id}`, error);
    throw new Error("Unable to remove user with id: ${id}");
  }
};
