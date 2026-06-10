import express from "express"
const router = express.Router()

import protect from "../middleware/authMiddleware.js"

import {
  getAllStudentsView
} from "../controllers/adminController.js"

router.get(
  '/students-view',
  protect,
  getAllStudentsView
)

export default router