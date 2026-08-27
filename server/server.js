import express from "express";
import "dotenv/config";
import connectDB from "./config/db.js";

connectDB();

const app = express();

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`RazorRecovery server running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("RazorRecovery API is running");
});

