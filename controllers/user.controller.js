import bcrypt from "bcrypt";
import User from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const { username, email, password, phone, dob } = req.body;
    const cryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.insertOne({
      username,
      email,
      password: cryptedPassword,
      phone,
      dob,
    });

    return res.success(newUser, "User registered successfully");
  } catch (error) {
    return res.badRequest(error.message || "Registration failed");
  }
};

export const login = async (req, res) => {
  try{
    const {username, password} = req.body;
    const checkUser = await User.findOne({ username });
    if (!checkUser) {
      return res.badRequest("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, checkUser.password);
    if (!isPasswordValid) {
      return res.badRequest("Invalid password");
    }
    const userData = {
      id: checkUser._id,
      username: checkUser.username,
      email: checkUser.email,
      phone: checkUser.phone,
      dob: checkUser.dob,
    };
    return res.success(userData, "Login successful");
  }catch (error) {
    return res.badRequest(error.message || "Login failed");
  }
}