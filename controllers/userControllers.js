const User = require("../models/otpMOdel");
const nodemailer = require('nodemailer');
const crypto = require('crypto');


exports.sentMailWithOtp = async (req,res) => {
    try {

        const { email } = req.body;

    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.updateOne({ email: email }, { otp: otp }, { upsert: true });

 
    await sendOTPByEmail(email, otp);

    res.status(200).json({ message: 'OTP sent successfully' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
}


exports.verifyOtp = async (req,res) => {
    try {

        const { otp } = req.body;

    // Find the user by OTP
    const user = await User.findOne({ otp });

    if (!user) {
      return res.status(404).json({ message: 'Invalid OTP' });
    }

    // Clear the OTP after successful verification
    await User.updateOne({ _id: user._id }, { otp: '' });

    res.status(200).json({ message: 'OTP verified successfully' });
        
    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Failed to verify OTP' });
        
    }
}


// Function to send OTP by email using Nodemailer
async function sendOTPByEmail(email, otp) {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.USER_EMAIL, // Enter your Gmail email address
        pass: process.env.USER_PASSWORD // Enter your Gmail password
      }
    });
  
    // Email content
    const mailOptions = {
      from: process.env.USER_EMAIL, // Sender's email address
      to: email, // Recipient's email address
      subject: 'OTP Verification',
      text: `Your OTP is: ${otp}`
    };
  
    // Send the email
    await transporter.sendMail(mailOptions);
  }