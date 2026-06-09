const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')

const {
  sendOtp,
  verifyOtp,
  completeRegistration,
  loginUser,
  changePassword,
  forgotPasswordSendOtp,
  verifyForgotPasswordOtp,
  resetPassword
} = require('../controllers/authController')

router.post('/send-otp', sendOtp)

router.post('/verify-otp', verifyOtp)

router.post('/register', completeRegistration)

router.post('/login', loginUser)

router.put(
  '/change-password',
  protect,
  changePassword
)

router.get('/me', protect, (req, res) => {
  res.json({
    message: 'Protected route working',
    user: req.user
  })
})

router.post(
  '/forgot-password/send-otp',
  forgotPasswordSendOtp
)

router.post(
  '/forgot-password/verify-otp',
  verifyForgotPasswordOtp
)

router.put(
  '/reset-password',
  resetPassword
)

module.exports = router