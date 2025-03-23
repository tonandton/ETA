import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addMoneyToAccount,
  createAccount,
  getAccounts,
} from "../controllers/accountController.js";

const router = express.Router();

router.get("/:id?", authMiddleware, getAccounts);
router.get("/create", authMiddleware, createAccount);
router.get("/add-money/:id", authMiddleware, addMoneyToAccount);

export default router;
