import express from "express"
const router = express.Router()

import {
  addApprovedStudent
} from "../controllers/approvedStudentController.js"

router.post(
  '/',
  addApprovedStudent
)

router.get('/', (req, res) => {
  res.json({
    message:
      'Approved Student Route Working'
  })
})

export default router