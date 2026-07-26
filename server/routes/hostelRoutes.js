import express from "express"
const router = express.Router()

import protect from "../middleware/authMiddleware.js"

import {
  toggleHostelStatus,
  getHostelStats
} from "../controllers/hostelController.js"

// Toggle IN/OUT
router.put(
  '/toggle-status/:id?',
  protect,
  toggleHostelStatus
)

router.get('/stats', getHostelStats)

export default router