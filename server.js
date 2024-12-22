const express = require("express");
const http = require("http");
const connectDB = require("./config/db");
require("dotenv").config();
const app = express();
const server = http.createServer(app);
const routes = require("./routes");
connectDB();

// Middleware
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server running fine.....");
  });

  app.use("/api", routes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
