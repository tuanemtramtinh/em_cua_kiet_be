const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    //Basic information
    username: String,
    email: String,
    password: String,
    phone: String,
    dob: Date,
    //Additional information
    tick: Boolean
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
