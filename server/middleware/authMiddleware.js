import jwt from "jsonwebtoken"
import User from "../models/User"

const protect = async (req, res, next) => {
  try {

    // 1. Get token from header
    const authHeader =
      req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        message: 'No token, access denied'
      })
    }

    // 2. Format: "Bearer token"
    const token =
      authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        message: 'Invalid token format'
      })
    }

    // 3. Verify token
    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      )

    // 4. Attach user data to request
    const user = await User.findById(decoded.id)
      .select('-password')

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    req.user = user

    next()

  } catch (error) {

    return res.status(401).json({
      message: 'Token is not valid'
    })
  }
}

export default protect