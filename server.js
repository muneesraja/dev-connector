const express = require("express");
const app = express();
const PORT = process.env.PORT || 5001;
const db = require("./db/db_conn");
const userRoute = require("./routes/api/Users");
const expressValidator = require("express-validator");

// Body parser Middleware

app.use(express.json());
// app.use(expressValidator());
app.use("/api/v1/user", userRoute);

// Initializing DB
db();

app.get("/", (req, res) => {
  res.json({
    success: true,
    data: {
      name: "Munees",
    },
  });
});

app.listen(
  PORT,
  console.log(
    `Server started in the port ${PORT} Successfully`.black.bgBrightGreen
  )
);
