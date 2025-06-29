import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  newUser,
  updateUser,
} from "../controller/getAllUsers.js";

const router = Router();
// Get /api/users
router.get("/", getAllUsers);

// Get /api/users:id
router.get("/:id", getUserById);

//  POST /api/users
router.post("/", newUser);

// Delete /api/users/:id
router.delete("/:id", deleteUser);

// Put /api/users/:id
router.put("/:id", updateUser);

export default router;
