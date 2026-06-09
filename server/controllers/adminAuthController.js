const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Admin = require('../models/Admin')

const loginAdmin = async (req, res) => {

  const { username, password } = req.body

  const admin = await Admin.findOne({ username })

  if (!admin) {
    return res.status(401).json({
      message: 'Invalid username'
    })
  }

  const isMatch =
    await bcrypt.compare(password, admin.password)

  if (!isMatch) {
    return res.status(401).json({
      message: 'Invalid password'
    })
  }

  const token = jwt.sign(
    {
      id: admin._id,
      role: 'admin'
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )

  res.json({
    token
  })

}

module.exports = { loginAdmin }