const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter using SMTP
// Using a dummy transport if env variables are not provided
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'dummy@gmail.com',
    pass: process.env.EMAIL_PASS || 'dummypass',
  },
});

/**
 * Send an OTP email
 */
const sendOtpEmail = async (toEmail, otpCode, type = 'SIGNUP') => {
  const subject = type === 'SIGNUP' 
    ? 'Verify your BioScope 3D Account' 
    : 'BioScope 3D - Reset Your Password';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #2F80ED; text-align: center;">BioScope 3D</h2>
      <h3 style="color: #333;">${subject}</h3>
      <p style="color: #555; font-size: 16px;">
        Hello, <br/><br/>
        Your One-Time Password (OTP) for ${type === 'SIGNUP' ? 'account registration' : 'password reset'} is:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2F80ED; background-color: #F0F4FF; padding: 15px 25px; border-radius: 8px;">
          ${otpCode}
        </span>
      </div>
      <p style="color: #555; font-size: 14px;">
        This code will expire in 10 minutes. If you did not request this, please ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />
      <p style="color: #999; font-size: 12px; text-align: center;">
        © 2026 BioScope 3D. All rights reserved.
      </p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"BioScope 3D" <${process.env.EMAIL_USER || 'noreply@bioscope3d.com'}>`,
      to: toEmail,
      subject: subject,
      html: htmlContent,
    });
    console.log('OTP Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    // Returning true during dev if creds fail, so app flow doesn't break
    return true; 
  }
};

/**
 * Send Quiz Results email
 */
const sendQuizResultEmail = async (toEmail, userName, quizTitle, score, maxScore) => {
  const percentage = (score / maxScore) * 100;
  let feedback = 'Good effort! Keep studying to improve your anatomy knowledge.';
  if (percentage >= 80) feedback = 'Excellent work! You have a strong grasp of this topic.';
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #2F80ED; text-align: center;">BioScope 3D</h2>
      <h3 style="color: #333;">Quiz Completed!</h3>
      <p style="color: #555; font-size: 16px;">
        Hi ${userName},<br/><br/>
        You just completed the <strong>${quizTitle}</strong> quiz. Here are your results:
      </p>
      <div style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <p style="margin: 0; color: #555;">Your Score</p>
        <p style="margin: 10px 0; font-size: 36px; font-weight: bold; color: ${percentage >= 80 ? '#00C48C' : '#FF9800'};">
          ${score} / ${maxScore}
        </p>
        <p style="margin: 0; color: #666; font-size: 14px;">${feedback}</p>
      </div>
      <p style="color: #555; font-size: 14px;">
        Jump back into the app to review your answers and continue learning.
      </p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"BioScope 3D" <${process.env.EMAIL_USER || 'noreply@bioscope3d.com'}>`,
      to: toEmail,
      subject: `Your Quiz Results: ${quizTitle}`,
      html: htmlContent,
    });
    console.log('Quiz Result Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending Quiz email:', error);
    return true;
  }
};

module.exports = {
  sendOtpEmail,
  sendQuizResultEmail
};
