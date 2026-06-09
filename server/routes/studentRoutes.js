const express = require('express')
const router = express.Router()

const protect = require('../middleware/authMiddleware')

const {
  getAllStudentsView
} = require('../controllers/adminController')

router.get(
  '/students-view',
  protect,
  getAllStudentsView
)

module.exports = router