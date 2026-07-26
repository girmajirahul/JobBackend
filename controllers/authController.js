const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const otpGenerator = require("otp-generator");
const transporter = require('../config/mail')
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      companyName,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user),
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid Credentials" });

    res.status(200).json({
      success: true,
      message: "Login successfull",
      token: generateToken(user),
      data: {
        _id: user._id,
        name: user.name,
        role: user.role,
      }

    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.sendOTP = async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 mins

    await user.save();

    await transporter.sendMail({
      from: "Job Board <girmajirahul2@gmail.com>",
      to: email,
      subject: "Password Reset OTP",
      html: `
<div style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px 0;">
    <tr>
      <td align="center">
        <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">

          <!-- Header Image -->
          <tr>
            <td>
              <img src="https://job-backend-lac.vercel.app/images/jobboard.png" 
                   alt="Security" 
                   style="width:100%; height:180px; object-fit:cover;">
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:25px; text-align:center;">
              
              <h2 style="margin:0; color:#333;">Reset Your Password</h2>
              
              <p style="color:#555; font-size:14px; margin:15px 0;">
                We received a request to reset your password. Use the OTP below to continue:
              </p>

              <!-- OTP Box -->
              <div style="font-size:32px; font-weight:bold; letter-spacing:6px; color:#2d89ef; margin:20px 0;">
                ${otp}
              </div>

              <p style="color:#777; font-size:13px;">
                This OTP is valid for <b>5 minutes</b>.
              </p>

              <!-- Button (optional if you add verify link later) -->
              <a href="#" style="
                display:inline-block;
                margin-top:20px;
                padding:12px 25px;
                background:#2d89ef;
                color:#fff;
                text-decoration:none;
                border-radius:6px;
                font-size:14px;
              ">
                Verify Now
              </a>

              <p style="color:#999; font-size:12px; margin-top:20px;">
                If you didn’t request this, you can safely ignore this email.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; padding:15px; text-align:center;">
              <p style="font-size:12px; color:#aaa; margin:0;">
                © ${new Date().getFullYear()} Your App. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</div>
`
    });

    res.json({
      message: "OTP sent to email"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }

};

exports.verifyOTP = async (req, res) => {

  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.otp !== otp) {
    return res.status(400).json({
      message: "Invalid OTP"
    });
  }

  if (user.otpExpiry < Date.now()) {
    return res.status(400).json({
      message: "OTP expired"
    });
  }

  res.json({
    message: "OTP verified"
  });

};

exports.verifyOTP = async (req, res) => {

  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.otp !== otp) {
    return res.status(400).json({
      message: "Invalid OTP"
    });
  }

  if (user.otpExpiry < Date.now()) {
    return res.status(400).json({
      message: "OTP expired"
    });
  }

  res.json({
    message: "OTP verified"
  });

};


exports.resetPassword = async (req, res) => {

  const { email, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.otp = null;
  user.otpExpiry = null;

  await user.save();

  res.json({
    message: "Password reset successful"
  });

};