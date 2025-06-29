import {
  createUser,
  fetchAllUsers,
  findById,
  removeUser,
  updateUserModel,
} from "../models/userModel.js";

// Get /api/users
export const getAllUsers = async (req, res) => {
  try {
    console.log(req.url);
    const allUsers = await fetchAllUsers();
    res.status(200).json(allUsers);
  } catch (error) {
    console.log(`Error fetching users,error`);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get /api/users:id
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await findById(id);
    if (!user) {
      const error = new Error(`user with id: ${id} not found`);
      error.status = 404;
      return next(error);
      // res.status(404).json({ error: "user with id: ${id} not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(`Error getting user id: ${id}`, error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/users
export const newUser = async (req, res, next) => {
  try {
    const userData = JSON.stringify(req.body);
    const createdUser = await createUser(userData);
    res.status(201).json(createdUser);
  } catch (error) {
    console.error(`Error creating user`, error);
    next();
  }
};

// update api/users/:id
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await findById(id);
    if (!user) {
      const error = new Error(`user with id: ${id} not found`);
      error.status = 404;
      return next(error);
    }

    const { name, email, password, role } = req.body;

    const updateUserData = {
      name: name || name.name,
      email: email || name.email,
      role: role || name.role,
      password: password || name.password,
    };

    console.log(updateUserData);

    const updatedUser = await updateUserModel(updateUserData, id);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(`Error updating user`, error);
    res.status(500).json({ error: "unable to update user with id: ${id}" });
  }
};

// delete api/users/:id
export const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      const error = new Error(`user with id: ${id} not found`);
      error.status = 404;
      return next(error);
    }
    const remainingUsers = await removeUser(id);
    res
      .status(200)
      .json({ message: "User deleted successfully", users: remainingUsers });
  } catch (error) {
    console.error(`cannot delete user with id: ${id} `, error);
    res.status(500).json({ error: "unable to remove user" });
  }
};
