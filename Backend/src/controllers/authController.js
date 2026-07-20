const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Otp } = require('../models');
const { sendOtpEmail } = require('../services/emailService');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '24h',
  });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
};

// @desc    Request Signup OTP
// @route   POST /api/auth/request-signup-otp
// @access  Public
const requestSignupOtp = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes

    console.log(`\n========================================`);
    console.log(`🔐 DEV MODE: SIGNUP OTP IS: ${otpCode}`);
    console.log(`========================================\n`);

    // Store temporarily in Otp table with payload
    // We could delete old ones, or just create a new one
    await Otp.destroy({ where: { email, type: 'SIGNUP' } });
    await Otp.create({
      email,
      otp_code: otpCode,
      type: 'SIGNUP',
      expires_at: expiresAt,
      payload: { full_name, password },
    });

    await sendOtpEmail(email, otpCode, 'SIGNUP');
    res.status(200).json({ message: 'OTP sent successfully', email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error requesting OTP' });
  }
};

// @desc    Verify OTP and Register user
// @route   POST /api/auth/verify-and-register
// @access  Public
const verifyAndRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await Otp.findOne({ where: { email, type: 'SIGNUP' } });
    
    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP not found. Please request again.' });
    }

    if (new Date() > new Date(otpRecord.expires_at)) {
      await otpRecord.destroy();
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (otpRecord.otp_code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const { full_name, password } = otpRecord.payload;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      full_name,
      email,
      password_hash: hashedPassword,
    });

    // Cleanup OTP
    await otpRecord.destroy();

    if (user) {
      res.status(201).json({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      res.json({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Request Password Reset OTP
// @route   POST /api/auth/request-password-reset
// @access  Public
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const userExists = await User.findOne({ where: { email } });
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60000); 

    console.log(`\n========================================`);
    console.log(`🔐 DEV MODE: RESET OTP IS: ${otpCode}`);
    console.log(`========================================\n`);

    await Otp.destroy({ where: { email, type: 'RESET_PASSWORD' } });
    await Otp.create({
      email,
      otp_code: otpCode,
      type: 'RESET_PASSWORD',
      expires_at: expiresAt,
    });

    await sendOtpEmail(email, otpCode, 'RESET_PASSWORD');
    res.status(200).json({ message: 'Reset OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error requesting password reset' });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const otpRecord = await Otp.findOne({ where: { email, type: 'RESET_PASSWORD' } });
    if (!otpRecord) return res.status(400).json({ message: 'OTP not found' });
    
    if (new Date() > new Date(otpRecord.expires_at)) {
      await otpRecord.destroy();
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (otpRecord.otp_code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.update({ password_hash: hashedPassword }, { where: { email } });
    await otpRecord.destroy();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

// @desc    Google Login/Signup
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    // Replace with real client ID from Google console later
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy_client_id');
    
    // For development, we skip actual verification if dummy is used
    let payload;
    if (process.env.GOOGLE_CLIENT_ID) {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } else {
      // Mock payload for testing without Google keys
      payload = { email: 'googletest@bioscope.com', name: 'Google User', picture: '' };
    }

    const { email, name, picture } = payload;

    let user = await User.findOne({ where: { email } });
    if (!user) {
      // Create user if not exists
      const dummyPassword = crypto.randomBytes(16).toString('hex');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(dummyPassword, salt);
      user = await User.create({
        full_name: name,
        email: email,
        password_hash: hashedPassword,
        profile_image: picture || null
      });
    }

    res.status(200).json({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(400).json({ message: 'Google authentication failed' });
  }
};

module.exports = {
  requestSignupOtp,
  verifyAndRegister,
  loginUser,
  requestPasswordReset,
  resetPassword,
  googleAuth
};
