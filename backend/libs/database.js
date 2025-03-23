import pg from "pg";
import decrypt from "dotenv";
import dotenv from "dotenv";

dotenv.config();

// const { Pool } = pg;

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool
  .connect()
  .then(() => console.log("Database Connected Successfully"))
  .catch((err) => console.log(err));

export default pool;
