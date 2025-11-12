const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  dir: String,
  approve: Boolean,
});

const Image = mongoose.model("image", imageSchema);

module.exports = Image;
