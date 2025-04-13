import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import pool from "./libs/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// app.use(cors({ origin: ["*"] }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// app.use(cors("*"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  // res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // ระบุ origin ที่อนุญาต
  res.header("Access-Control-Allow-Credentials", "true"); // อนุญาตการส่ง credentials
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS"); // อนุญาต HTTP methods
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization"); // อนุญาต headers
  next();
});

app.use("/api-v1", routes);

app.use("*", (req, res) => {
  res.status(404).json({
    status: "404 Not Found",
    message: "Not Found",
  });
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Database connected!", time: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Database connection failed!" });
  }
});

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
