const express = require("express");
const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
const { sendMessage,getMessages,getMediaMessages } = require("../controller/messageController");
const router = express.Router();



router.post("/send",upload.single("image"), sendMessage);
router.get("/:senderId/:receiverId", getMessages);
router.get("/media/:senderId/:receiverId", getMediaMessages);

module.exports = router;



