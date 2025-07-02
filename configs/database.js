const mongoose = require('mongoose');
require('dotenv').config();

module.exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      authSource: 'admin',
      user: process.env.MONGODB_USER,
      pass: process.env.MONGODB_PASS
    })
    console.log("Kết nối database thành công");
  } catch (error) {
    console.log("Kết nối database không thành công");
    console.log(error);
  }
}