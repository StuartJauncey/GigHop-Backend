require("dotenv").config({ path: "./config.env" });
const apiRouter = require("./routes/api-router");

const express = require("express");
const cors = require("cors");

// get MongoDB connection
const dbo = require("./connection");

const PORT = process.env.PORT || 8080;
const uri = process.env.MONGODB_URI;
const app = express();

console.log(process.env.PORT, "here", PORT);
console.log(process.env.MONGODB_URI);
console.log(process.env.ATLAS_URI);

app.use(cors());
app.use(express.json());

// App Routers
app.use("/api", apiRouter);

// Error Handling
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Server error");
});

// Connect to database when server starts
dbo.connectToServer(function(err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  // Start Express server
  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
});
