const express = require("express");
const cors = require("cors");

const app = express();


app.use(
  cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Hello dari backend Node.js 🚀" });
});

app.listen(5000, () => {
  console.log("Server berjalan di http://localhost:5000");
});