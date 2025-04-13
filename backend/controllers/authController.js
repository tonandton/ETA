import { compare } from "bcrypt";
import { createJWT, hashPassword } from "../libs/index.js";
import pool from "../libs/database.js";

export const signupUser = async (req, res) => {
  try {
    const { firstName, email, password } = req.body;

    if (!(firstName || email || password)) {
      return res.status(404).json({
        status: "failed",
        message: "Provide Required Fields!",
      });
    }

    const userExist = await pool.query({
      // text: "SELECT EXISTS * (SELECT FROM tbluser WHERE email = $1)",
      text: "SELECT EXISTS(SELECT 1 FROM tbluser WHERE email = $1) AS userExist",
      values: [email],
    });

    if (userExist.rows[0].userExist) {
      return res.status(409).json({
        status: "failed",
        message: "Email Address Already Exists!",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await pool.query({
      text: `INSERT INTO tbluser (firstname, email, password) VALUES($1, $2, $3) RETURNING *`,
      values: [firstName, email, hashedPassword],
    });

    user.rows[0].password = undefined;

    res.status(201).json({
      status: "success",
      message: "User Created Successfully",
      user: user.rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failed", message: err.message });
  }
};

export const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email || password)) {
      return res.status(404).json({
        status: "failed",
        message: "Provide Required Fields!",
      });
    }

    const result = await pool.query({
      text: `SELECT * FROM tbluser WHERE email = $1`,
      values: [email],
    });

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User Not Found!",
      });
    }

    const isMatch = await compare(password, user?.password);

    if (!isMatch) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid Credentials!",
      });
    }

    const token = createJWT(user.id);

    user.password = undefined;

    res.status(200).json({
      status: "success",
      message: "User Logged In Successfully",
      data: {
        user,
        token,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failed", message: err.message });
  }
};

export const signInWithOAuthUser = async (req, res) => {
  try {
    const { name, email, provider, uid } = req.body;

    if (!(email || provider || uid)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // เช็คว่ามีอยู่แล้วไหม
    const userRes = await pool.query("SELECT * FROM tbluser WHERE email = $1", [
      email,
    ]);

    let user = userRes.rows[0];

    if (!user) {
      const newUserRes = await pool.query(
        `INSERT INTO tbluser (firstname, email, provider, uid) VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, email, provider, uid]
      );
      user = newUserRes.rows[0];
    }

    const token = createJWT(user.id);
    user.password = undefined;

    res.status(200).json({
      status: "success",
      message: "OAuth User Signed In",
      user,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
