const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    //Basic information
    name: String,
    username: String,
    email: String,
    password: String,
    hobby: String,
    sex: String,
    dob: Date,
    avatar: String,
    type: String,
    //Additional information
    tick: Boolean,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
