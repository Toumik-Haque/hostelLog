const express = require('express')
const router = express.Router()

const adminAuth = require('../middleware/adminAuth')

const {
  getAllStudentsView,
  getStudentDetails,
  deleteStudent,
  updateStudent
} = require('../controllers/adminController')

router.use(adminAuth)
router.get('/students-view', getAllStudentsView)
router.get('/student/:id', getStudentDetails)

// delete student
router.delete('/student/:id', deleteStudent)

// update student
router.put('/student/:id', updateStudent)

module.exports = router