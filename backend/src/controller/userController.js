const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const emailService = require("../services/nodeMailer");
const uploadToCloudinary = require("../services/cloudinary")


async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;
        const image = req.file;

      
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        let imageUrl = "";

    if (image) {
      imageUrl = await uploadToCloudinary(image.buffer);
    }
       
        const hashPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name,
            email,
            password: hashPassword,
            image: image ? imageUrl : null 
        });

      
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        
    
        res.cookie("token", token, { httpOnly: true }); 
        await emailService.sendRegistrationMail(user.email,user.name)
        return res.status(201).json({ message: "User register successfully", user,token });


    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

async function logInUser(req,res) {
    
    try {
       const {email,password} = req.body;

       const user = await userModel.findOne({email}).select("+password");

       if (!user) {
        return res.status(409).json({message:"user does not exists"})
       }

       const isVeryfied = await bcrypt.compare(password,user.password)

       if (!isVeryfied) {
        return res.status(401).json({message:"wrong password"})
       }

         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        
    
        res.cookie("token", token, { httpOnly: true }); 
        return res.status(200).json({ message: "User login successfully", user,token });

    } catch (error) {

        return res.status(500).json({ message: "Internal server error", error: error.message });
    }

}
async function checkAuth(req,res) {
    res.status(200).json({success: true, user: req.user});
}
// Get all users except current logged-in user
const getAllUser = async (req, res) => {
  try {
    const currentUserId = req.params.userId;

    const users = await userModel.find({
      _id: { $ne: currentUserId }
    }).sort({ createdAt: -1 }); 

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message
    });
  }
};

const logout = async (req, res) => {
    try {
       
        res.cookie('token', '', {
            httpOnly: true,
          });

        res.status(200).json({ status: "success", message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

module.exports = {registerUser,logInUser,checkAuth,getAllUser,logout};