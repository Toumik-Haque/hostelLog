import express from "express"
const router = express.Router()

import protect from "../middleware/authMiddleware"

import {
  toggleHostelStatus,
  getHostelStats
} from "../controllers/hostelController"

// Toggle IN/OUT
router.put(
  '/toggle-status',
  protect,
  toggleHostelStatus
)

router.get('/stats', getHostelStats)

export default router