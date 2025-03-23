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
      text: "SELECT * FROM tbluser WHERE email = $1",
      values: [email],
    });

    if (userExist.rows.length > 0) {
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
      data: user.rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failed", message: err.message });
  }
};

export const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;

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
