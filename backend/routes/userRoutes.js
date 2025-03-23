import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  changePassword,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", authMiddleware, getUser);
router.get("/all-users", getUsers);
router.put("/change-password", authMiddleware, changePassword);
router.put("/:id", authMiddleware, updateUser);

export default router;
