import express from "express"
const router = express.Router()
import protect from "../middleware/authMiddleware.js"

import {
  sendOtp,
  verifyOtp,
  completeRegistration,
  loginUser,
  changePassword,
  forgotPasswordSendOtp,
  verifyForgotPasswordOtp,
  resetPassword
} from "../controllers/authController.js"

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

export default router