const User = require("../models/user.model");

module.exports.test = async (req, res) => {
  await User.create({
    username: "test",
  });
  res.json("Hello");
};
