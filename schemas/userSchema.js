const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: String,
  },
  gender: {
    type: String,
  },
  dob: {
    type: String,
  },
  mobile: {
    type: String,
  },
  address: {
    type: String,
  },
  designation: {
    type: String,
  },
  company: {
    type: String,
  },
});

module.exports = userSchema;
