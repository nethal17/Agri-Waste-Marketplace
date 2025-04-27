import { User } from "../models/user.js"
import  bcrypt  from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const blacklistedTokens = new Set();

export const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendVerificationCode = async (email, code) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
        to: email,
        from: process.env.EMAIL_USER,
        subject: "Your 2-Step Verification Code",
        text: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
};

export const verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ msg: "Invalid or expired token" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.json({ msg: "Email verified successfully. You can now login." });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server Error" });
    }
};

export const registerUser = async (req, res) => {
    const { name, email, phone, password, role } = req.body;

    
    if (!name || !email || !phone || !password || !role) {
        return res.status(400).json({ msg: "Please fill in all fields." });
    }

    const validateEmail = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    if (!validateEmail(email)) {
        return res.status(400).json({ msg: "Invalid email format." });
    }

    if (password.length < 8) {
        return res.status(400).json({ msg: "Password must be at least 8 characters long." });
    }

    const validatePhone = (phone) => /^0\d{9}$/.test(phone);
    if (!validatePhone(phone)) {
        return res.status(400).json({ msg: "Invalid phone number format." });
    }

    const validRoles = ["farmer", "buyer", "truck_driver"];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ msg: "Invalid role provided." });
    }

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verificationToken = crypto.randomBytes(32).toString("hex");

        user = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            role,
            verificationToken
        });

        await user.save();

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const verificationURL = `http://localhost:3000/api/auth/verify-email/${verificationToken}`;
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: "Email Verification",
            text: `Click the link to verify your email: ${verificationURL}`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            msg: "User registered successfully. Please check your email to verify your account."
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server Error" });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            // Track failed login attempt
            const failedUser = await User.findOne({ email });
            if (failedUser) {
                failedUser.loginHistory.push({
                    ipAddress: req.ip,
                    deviceInfo: req.headers['user-agent'],
                    status: "failed"
                });
                await failedUser.save();
            }
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Track failed login attempt
            user.loginHistory.push({
                ipAddress: req.ip,
                deviceInfo: req.headers['user-agent'],
                status: "failed"
            });
            await user.save();
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        if (!user.isVerified) {
            return res.status(400).json({ msg: "Please verify your email first" });
        }

        // If 2FA is enabled, generate and send verification code
        if (user.twoFactorEnabled) {
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            user.twoStepVerificationCode = verificationCode;
            user.twoStepVerificationExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
            await user.save();

            // Send verification code via email
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                to: user.email,
                from: process.env.EMAIL_USER,
                subject: "Two-Step Verification Code",
                text: `Your verification code is: ${verificationCode}. This code will expire in 10 minutes.`
            };

            await transporter.sendMail(mailOptions);

            return res.json({ 
                requiresVerification: true,
                msg: "Verification code sent to your email"
            });
        }

        // Track successful login
        user.loginHistory.push({
            ipAddress: req.ip,
            deviceInfo: req.headers['user-agent'],
            status: "success"
        });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        
        // Send complete user data in response
        res.json({ 
            token, 
            user: { 
                _id: user._id,
                name: user.name, 
                email: user.email, 
                phone: user.phone,
                role: user.role,
                profilePic: user.profilePic,
                isVerified: user.isVerified,
                twoFactorEnabled: user.twoFactorEnabled,
                createdAt: user.createdAt
            } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
};

export const logoutUser = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        console.log("Logout failed: No token provided");
        return res.status(400).json({ message: "No token provided" });
    }

    if (blacklistedTokens.has(token)) {
        return res.status(401).json({ msg: "You are already logged out. Please log in." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        blacklistedTokens.add(token);
        console.log("Token blacklisted:", token);

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout error:", err);

        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ msg: "Invalid token" });
        }

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ msg: "Token has expired" });
        }

        res.status(500).json({ msg: "Server Error" });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 7200000; // 1 hour expiration
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        const resetURL = `http://localhost:5173/reset-password/${resetToken}`;
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: "Password Reset Request",
            html: `
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetURL}"><button>Reset Password</button></a>
                <p>If you did not request this, please ignore this email.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ msg: "Reset link sent to email" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server Error" });
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ msg: "Invalid or expired token" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ msg: "Password successfully reset" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server Error" });
    }
};

export const verifyTwoStepCode = async (req, res) => {
    const { userId, code } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        if (
            user.twoStepVerificationCode === code &&
            user.twoStepVerificationExpire > Date.now()
        ) {
            user.twoStepVerificationCode = undefined;
            user.twoStepVerificationExpire = undefined;
            await user.save();

            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            // Return a single response with all necessary data
            res.json({ 
                token, 
                user: { 
                    _id: user._id,
                    name: user.name, 
                    email: user.email, 
                    phone: user.phone,
                    role: user.role,
                    profilePic: user.profilePic,
                    isVerified: user.isVerified,
                    twoFactorEnabled: user.twoFactorEnabled,
                    createdAt: user.createdAt
                } 
            });
        } else {
            res.status(400).json({ msg: "Invalid or expired verification code" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server Error" });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ count: users.length, data: users });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        res.status(200).json(user);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

export const updateUserDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const { name, email, phone } = req.body;
        if (!name || !email || !phone) {
            return res.status(400).json({ message: "Name, email, and phone are required" });
        }

        let updatedData = { name, email, phone };

        const result = await User.findByIdAndUpdate(id, updatedData, { new: true });

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user: result });

    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateSecurityTimestamp = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndUpdate(
            id,
            { lastSecurityUpdate: new Date() },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Security timestamp updated", lastSecurityUpdate: user.lastSecurityUpdate });
    } catch (err) {
        console.error("Error updating security timestamp:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const changePassword = async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: "New passwords do not match" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.lastSecurityUpdate = new Date();
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        console.error("Error changing password:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await User.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

export const getLoginHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('loginHistory');
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Sort login history by timestamp in descending order (most recent first)
        const sortedHistory = user.loginHistory.sort((a, b) => b.timestamp - a.timestamp);
        
        res.json({ loginHistory: sortedHistory });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
};

export const toggleTwoFactorAuth = async (req, res) => {
  try {
    const { enable } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Record the 2FA toggle in login history
    user.loginHistory.push({
      ipAddress: req.ip,
      deviceInfo: req.headers['user-agent'],
      status: "success",
      action: `Two-factor authentication ${enable ? 'enabled' : 'disabled'}`
    });

    user.twoFactorEnabled = enable;
    user.lastSecurityUpdate = new Date();
    await user.save();

    res.json({ 
      msg: `Two-factor authentication ${enable ? 'enabled' : 'disabled'} successfully`,
      twoFactorEnabled: user.twoFactorEnabled 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};
