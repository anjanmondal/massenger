const messageModel = require("../models/messageModel");
const uploadToCloudinary = require("../services/cloudinary")

// send message

const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text} = req.body;

     let imageUrl = "";

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const newMessage = await messageModel.create({
      senderId,
      receiverId,
      text,
      image:imageUrl
    });

    const savedMessage = await newMessage.save();
  
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get- message

const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const messages = await messageModel.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get-all media or images

const getMediaMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const media = await messageModel.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ],
      image: { $ne: "" }
    }).sort({ createdAt: -1 });

    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {sendMessage,getMessages,getMediaMessages}