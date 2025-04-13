import express from "express";
import {
  signinUser,
  signInWithOAuthUser,
  signupUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/sign-up", signupUser);
router.post("/sign-in", signinUser);
router.post("/sign-in-oauth", signInWithOAuthUser);

export default router;
