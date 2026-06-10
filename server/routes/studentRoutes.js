import express from "express"
const router = express.Router()

import protect from "../middleware/authMiddleware"

import {
  getAllStudentsView
} from "../controllers/adminController"

router.get(
  '/students-view',
  protect,
  getAllStudentsView
)

export default router