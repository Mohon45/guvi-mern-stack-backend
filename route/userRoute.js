const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongoose").Types.ObjectId;
const router = express.Router();
const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("users", userSchema);
const checkLogin = require("../middlewares/checkLogin");

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(200).json({
      message: "Signup was successful!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Signup failed!",
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ email: req.body.email });
    const email = user[0].email;
    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      if (isValidPassword) {
        // generate token
        const token = jwt.sign(
          {
            name: user[0].name,
            userId: user[0]._id,
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );

        res.status(200).json({
          email: email,
          access_token: token,
          message: "Login successful!",
        });
      } else {
        res.status(401).json({
          error: "Authetication failed!",
        });
      }
    } else {
      res.status(401).json({
        error: "Authetication failed!",
      });
    }
  } catch {
    res.status(401).json({
      error: "Authetication failed!",
    });
  }
});

// get a user
router.get("/:email", async (req, res) => {
  try {
    const data = await User.find({ email: req.params.email });
    res.status(200).json({
      result: data,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
});

// user update
router.put("/:id", (req, res) => {
  // console.log(req.body);
  const { title, age, gender, dob, mobile, address, designation, company } =
    req.body;
  User.updateOne(
    { _id: ObjectId(req.params.id) },
    {
      $set: {
        title: title,
        age: age,
        gender: gender,
        dob: dob,
        mobile: mobile,
        address: address,
        designation: designation,
        company: company,
      },
    },

    (err) => {
      if (err) {
        res.status(500).json({
          error: "There was a server side error!",
        });
      } else {
        res.status(200).json({
          message: "User was updated successfully!",
        });
      }
    }
  );
});

module.exports = router;
