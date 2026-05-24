const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  text: String,
  image: String
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);