const express = require("express");
const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
const router = express.Router();
const {registerUser, checkAuth, getAllUser, logout} = require("../controller/userController")
const {logInUser} = require("../controller/userController")
const protectRoute = require("../middlewares/auth")


router.post("/register",upload.single("image"),registerUser) 
router.post("/login",logInUser) 
router.post("/logout",logout) 
router.get("/check",protectRoute,checkAuth)
router.get("/alluser/:userId",getAllUser)

module.exports = router;