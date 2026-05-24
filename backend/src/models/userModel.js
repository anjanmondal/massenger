const mongoose = require("mongoose"); // Fixed typo 'mongosse'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please provide a valid email"]
       
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false 
    },
    image: {
        type: String,
        default: "" 
    },
    createdAt: {
        type: Date,
        default: Date.now 
    }
});

module.exports = mongoose.model("User", userSchema);