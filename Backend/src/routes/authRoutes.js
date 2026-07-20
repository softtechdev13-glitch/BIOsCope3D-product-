const express = require('express');
const router = express.Router();
const { 
  requestSignupOtp, 
  verifyAndRegister, 
  loginUser,
  requestPasswordReset,
  resetPassword,
  googleAuth
} = require('../controllers/authController');

router.post('/request-signup-otp', requestSignupOtp);
router.post('/verify-and-register', verifyAndRegister);
router.post('/login', loginUser);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/google', googleAuth);

module.exports = router;
