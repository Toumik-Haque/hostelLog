const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const ApprovedStudent = require('../models/ApprovedStudent')
const nodemailer = require('nodemailer')

// Temporary OTP store (for now)
const otpStore = {}

const sendOtp = async (req, res) => {
  try {
    const { rollNo, email } = req.body

    // 1. Check approved student
    const student = await ApprovedStudent.findOne({
      rollNo,
      email
    })

    if (!student) {
      return res.status(400).json({
        message: 'Roll number and email do not match approved list'
      })
    }

    if (student.registered) {
      return res.status(400).json({
        message: 'Student already registered'
      })
    }

    // 2. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000)

    // 3. Store OTP temporarily
    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 min
    }

    // 4. Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    // 5. Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'hostelLog OTP Verification',
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`
    }

    // 6. Send email
    await transporter.sendMail(mailOptions)

    res.json({
      message: 'OTP sent successfully'
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const verifyOtp = async (req, res) => {
  try {

    const { email, otp } = req.body

    const record = otpStore[email]

    // 1. Check if OTP exists
    if (!record) {
      return res.status(400).json({
        message: 'OTP not found or expired'
      })
    }

    // 2. Check expiry
    if (Date.now() > record.expiresAt) {
      delete otpStore[email]

      return res.status(400).json({
        message: 'OTP expired'
      })
    }

    // 3. Check OTP match
    if (Number(otp) !== record.otp) {
      return res.status(400).json({
        message: 'Invalid OTP'
      })
    }

    // 4. Success → delete OTP
    delete otpStore[email]

    return res.json({
      message: 'OTP verified successfully'
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const completeRegistration = async (req, res) => {
  try {

    const {
      rollNo,
      email,
      mobile,
      department,
      roomNo,
      foodPreference,
      dontEat,
      bloodGroup,
      password
    } = req.body

    // 1. Check approved student
    const approved =
      await ApprovedStudent.findOne({
        rollNo,
        email
      })

    if (!approved) {
      return res.status(400).json({
        message: 'Student not approved'
      })
    }

    // 2. Check if already registered
    const existingUser =
      await User.findOne({ rollNo })

    if (existingUser) {
      return res.status(400).json({
        message: 'User already registered'
      })
    }

    // 3. Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10)

    // 4. Create user
    const user = await User.create({
      name: approved.name,
      rollNo,
      email,
      mobile,
      department,
      roomNo,
      foodPreference,
      dontEat,
      bloodGroup,
      password: hashedPassword,
      hostelStatus: 'OUT'
    })

    // 5. Update approved student
    approved.registered = true
    await approved.save()

    res.status(201).json({
      message: 'Registration successful',
      user
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const loginUser = async (req, res) => {
  try {

    const { rollNo, password } = req.body

    // 1. Find user
    const user = await User.findOne({
      rollNo
    })

    if (!user) {
      return res.status(400).json({
        message: 'User not found'
      })
    }

    // 2. Check password
    const isMatch =
      await require('bcryptjs').compare(
        password,
        user.password
      )

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials'
      })
    }

    // 3. Generate token
    const token = jwt.sign(
      {
        id: user._id,
        rollNo: user.rollNo
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        rollNo: user.rollNo,
        department: user.department,
        roomNo: user.roomNo,
        hostelStatus: user.hostelStatus
      }
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const changePassword = async (
  req,
  res
) => {
  try {

    const {
      oldPassword,
      newPassword,
      confirmPassword
    } = req.body

    if (
      newPassword === oldPassword
    ) {
      return res.status(400).json({
        message:
          'New password must be different from the current password'
      })
    }

    const user =
      await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    const isMatch =
      await bcrypt.compare(
        oldPassword,
        user.password
      )

    if (!isMatch) {
      return res.status(400).json({
        message:
          'Current password is incorrect'
      })
    }

    if (
      newPassword !== confirmPassword
    ) {
      return res.status(400).json({
        message:
          'New password and confirm password do not match'
      })
    }

    user.password =
      await bcrypt.hash(
        newPassword,
        10
      )

    await user.save()

    res.json({
      message:
        'Password updated successfully'
    })

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }
}

const forgotPasswordSendOtp = async (
  req,
  res
) => {

  try {

    const { email } = req.body

    const user =
      await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        message: 'Email not found'
      })
    }

    const otp =
      Math.floor(
        100000 + Math.random() * 900000
      )

    otpStore[email] = {
      otp,
      expiresAt:
        Date.now() + 5 * 60 * 1000,
      verified: false
    }

    const transporter =
      nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject:
        'hostelLog Password Reset OTP',
      text:
        `Your OTP is ${otp}`
    })

    res.json({
      message:
        'OTP sent successfully'
    })

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}

const verifyForgotPasswordOtp = async (
  req,
  res
) => {

  try {

    const { email, otp } = req.body

    const record = otpStore[email]

    if (!record) {
      return res.status(400).json({
        message: 'OTP not found or expired'
      })
    }

    if (
      Date.now() > record.expiresAt
    ) {

      delete otpStore[email]

      return res.status(400).json({
        message: 'OTP expired'
      })

    }

    if (
      Number(otp) !== record.otp
    ) {
      return res.status(400).json({
        message: 'Invalid OTP'
      })
    }

    otpStore[email].verified = true

    return res.json({
      message: 'OTP verified successfully'
    })

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}

const resetPassword = async (
  req,
  res
) => {

  try {

    const {
      email,
      newPassword,
      confirmPassword
    } = req.body

    const record = otpStore[email]

    if (!record || !record.verified) {
      return res.status(400).json({
        message: 'OTP verification required'
      })
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      return res.status(400).json({
        message:
          'Passwords do not match'
      })
    }

    const user =
      await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        message:
          'User not found'
      })
    }

    user.password =
      await bcrypt.hash(
        newPassword,
        10
      )

    await user.save()
    delete otpStore[email]

    res.json({
      message:
        'Password reset successful'
    })

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    })

  }

}

module.exports = {
  sendOtp,
  verifyOtp,
  completeRegistration,
  loginUser,
  changePassword,
  forgotPasswordSendOtp,
  verifyForgotPasswordOtp,
  resetPassword,
  otpStore
}