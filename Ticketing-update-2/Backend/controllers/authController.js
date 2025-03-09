// authController - handles authentication logic
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();
const { getUserModel } = require('../models/Users');

// Signup/Register 
const registerUser = async (req, res) => {
    try {
        const { username, email, password, role, companyId } = req.body;

        console.log("🔹 Received Registration Request:", req.body);  // ✅ Debug Log 1

        if (!companyId) {
            console.log("❌ Error: Missing companyId");  // ✅ Debug Log 2
            return res.status(400).json({ message: "companyId is required" });
        }

        // Retrieve the appropriate user model based on the companyId
        const User = await getUserModel(companyId);
        console.log("🔹 Retrieved User Model for Company:", companyId);  // ✅ Debug Log 3

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("❌ Error: User already exists");  // ✅ Debug Log 4
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("🔹 Password Hashed Successfully");  // ✅ Debug Log 5

        // Create the new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();
        console.log("✅ User Saved Successfully:", newUser);  // ✅ Debug Log 6

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role, companyId },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        console.log("✅ Token Generated Successfully");  // ✅ Debug Log 7

        res.status(201).json({
            message: "User registered successfully",
            token: token
        });

    } catch (error) {
        console.error("❌ Registration Error:", error);  // ✅ Debug Log 8
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};


const loginUser = async (req, res) => {
    try {
        const { companyId, email, password } = req.body;

        if (!companyId) {
            return res.status(400).json({ message: 'companyId is required' });
        }

        const User = await getUserModel(companyId);
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, companyId },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send user details along with token
        res.status(200).json({ 
            message: 'Login successful', 
            token, 
            user: { id: user._id, email: user.email, companyId, role: user.role }  
        });

    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

module.exports = { registerUser, loginUser };