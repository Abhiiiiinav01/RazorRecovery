import express from "express";

const app = express();

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`RazorRecovery server running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("RazorRecovery API is running");
});

