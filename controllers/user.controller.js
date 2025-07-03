const User = require("../models/user.model");

module.exports.register = async (req, res) => {
  const { username, email, password, phone, dob } = req.body;
  const newUser = await User.insertOne({username, email, password, phone, dob});

  try {
    return res.success(newUser, "User registered successfully");
  } catch (error) {
    return res.badRequest(error.message);
  }
};
