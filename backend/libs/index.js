import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config();

export const hashPassword = async (userValue) => {
  const salt = await bcrypt.genSalt(10);

  const hashPassword = await bcrypt.hash(userValue, salt);

  return hashPassword;
};

export const comparePassword = async (userPassword, password) => {
  try {
    const isMatch = await bcrypt.compare(userPassword, password);

    return isMatch;
  } catch (err) {
    console.log(err);
  }
};

export const createJWT = (id) => {
  return jwt.sign(
    {
      userId: id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};
