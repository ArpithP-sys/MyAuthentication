// ✅ Updated Backend Authentication Controller (authcontroller.js)
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/usermodels.js';
import transporter from '../config/nodemailer.js';

// ------------------- REGISTER -------------------
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();

    // Send Welcome Email (no token)
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Welcome to Our Service',
      text: `Hello ${name},\n\nThank you for registering! Please login and verify your email to continue.`
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.log("Email send failed: ", err.message);
    }

    return res.status(201).json({ success: true, message: 'Registered successfully. Please login.' });
  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ------------------- LOGIN -------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'All fields required' });

    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 10 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ success: true, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ------------------- LOGOUT -------------------
export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    });
    res.status(200).json({ success: true, message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ------------------- SEND VERIFY OTP -------------------
export const sendverifyotp = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isverified) return res.status(400).json({ message: 'Already verified' });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyotp = otp;
    user.verifyotpexpiredat = Date.now() + 5 * 60 * 1000;

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Verify Your Email',
      text: `Hello ${user.name},\n\nYour OTP is ${otp}. Valid for 5 mins.`
    };

    await transporter.sendMail(mailOptions);
    await user.save();
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ------------------- VERIFY EMAIL -------------------
export const verifyemail = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await userModel.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.verifyotp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (user.verifyotpexpiredat < Date.now()) return res.status(400).json({ message: 'OTP expired' });

    user.isverified = true;
    user.verifyotp = '';
    user.verifyotpexpiredat = 0;
    await user.save();

    res.status(200).json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ------------------- IS AUTHENTICATED -------------------
export const isAuthenticated = async (req, res) => {
  return res.status(200).json({ message: 'User is authenticated' });
};

// ------------------- SEND RESET OTP -------------------
export const sendresetotp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    // Always respond with same message (security)
    const responseMessage = 'If this email is registered, you will receive an OTP shortly.';

    if (!user) {
      return res.status(200).json({ success: true, message: responseMessage });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetotp = otp;
    user.resetotpexpiredat = Date.now() + 5 * 60 * 1000;

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Reset Password',
      text: `Hello ${user.name},\n\nYour reset OTP is ${otp}. Valid for 5 mins.`
    };

    await transporter.sendMail(mailOptions);
    await user.save();

    res.status(200).json({ success: true, message: responseMessage });
  } catch (error) {
    console.error('Reset OTP Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// ------------------- RESET PASSWORD -------------------
export const resetpassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.resetotp !== otp || user.resetotpexpiredat < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetotp = '';
    user.resetotpexpiredat = 0;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
