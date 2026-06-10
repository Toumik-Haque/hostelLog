import express from "express"
const router = express.Router()

import adminAuth from "../middleware/adminAuth.js"

import {
  getAllStudentsView,
  getStudentDetails,
  deleteStudent,
  updateStudent
} from "../controllers/adminController.js"

router.use(adminAuth)
router.get('/students-view', getAllStudentsView)
router.get('/student/:id', getStudentDetails)

// delete student
router.delete('/student/:id', deleteStudent)

// update student
router.put('/student/:id', updateStudent)

export default router