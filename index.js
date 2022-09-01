const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const userRoutes = require("./route/userRoute");
const port = process.env.PORT || 5001;
const dbname = "guvi";

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m0coh.mongodb.net/${dbname}?retryWrites=true&w=majority`;
// Mongoose Connect
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connection successful"))
  .catch((err) => console.log(err));

//application route
app.use("/api/v1/user", userRoutes);

// default error handler
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
};

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("GUVI MERN-Stack Server Running!");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
