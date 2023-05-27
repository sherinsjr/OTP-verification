const express = require('express');
const router = express.Router();
const generateOTP = require("otp-generator")
const nodemailer = require('nodemailer');
const User = require('../models/otpMOdel');

// Generate and send OTP
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    // Generate OTP
    const otp = generateOTP.generate(6, { digits: true });

    // Save OTP to the database
    await User.findOneAndUpdate(
      { email },
      { otp },
      { upsert: true }
    );

    // Send OTP to the user's email
    const transporter = nodemailer.createTransport({
      service: 'Your email service provider',
      auth: {
        user: 'Your email address',
        pass: 'Your email password',
      },
    });

    const mailOptions = {
      from: 'Your email address',
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

module.exports = router;
