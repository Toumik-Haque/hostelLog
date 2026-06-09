const express = require('express')
const router = express.Router()

const protect = require('../middleware/authMiddleware')

const {
  toggleHostelStatus,
  getHostelStats
} = require('../controllers/hostelController')

// Toggle IN/OUT
router.put(
  '/toggle-status',
  protect,
  toggleHostelStatus
)

router.get('/stats', getHostelStats)

module.exports = router