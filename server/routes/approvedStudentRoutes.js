const express = require('express')
const router = express.Router()

const {
  addApprovedStudent
} = require(
  '../controllers/approvedStudentController'
)

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

module.exports = router