const User = require('../models/User')
const ApprovedStudent = require('../models/ApprovedStudent')

const getStudentDetails = async (req, res) => {

  try {

    const { id } = req.params

    // Check User collection first
    const user = await User.findById(id)

    if (user) {

      const approved =
        await ApprovedStudent.findOne({
          rollNo: user.rollNo
        })

      return res.json({

        type: 'REGISTERED',

        approved,

        user

      })

    }

    // Otherwise check ApprovedStudent
    const approved =
      await ApprovedStudent.findById(id)

    if (approved) {

      return res.json({

        type: 'UNREGISTERED',

        approved

      })

    }

    return res.status(404).json({
      message: 'Student not found'
    })

  }

  catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}

const getAllStudentsView = async (req, res) => {
  try {

    const users = await User.find()
    const approved = await ApprovedStudent.find()

    // create map for quick lookup
    const userMap = new Map()

    users.forEach(u => {
      userMap.set(u.rollNo, u)
    })

    const result = []

    // -------------------------
    // 1. Approved + Registered Users
    // -------------------------
    approved.forEach(a => {

      const user = userMap.get(a.rollNo)

      if (user) {

        // REGISTERED USER
        result.push({
          id: user._id,
          name: user.name,
          rollNo: user.rollNo,
          email: user.email,
          mobile: user.mobile,
          department: user.department,
          roomNo: user.roomNo,
          foodPreference: user.foodPreference,
          dontEat: user.dontEat,
          hostelStatus: user.hostelStatus,
          lastStatusChange: user.lastStatusChange,
          status: user.hostelStatus === 'IN'
            ? 'PRESENT'
            : 'ABSENT'
        })

      } else {

        // IN APPROVED BUT NOT USER CREATED YET
        result.push({
          id: a._id,
          name: a.name,
          rollNo: a.rollNo,
          email: a.email,
          mobile: '-',
          department: '-',
          roomNo: '-',

          foodPreference: a.foodPreference,
          dontEat: a.dontEat || [],

          hostelStatus: 'NOT_REGISTERED',
          lastStatusChange: null,
          status: 'UNREGISTERED'
        })

      }

    })

    // -------------------------
    // SORT BY ROOM NUMBER
    // -------------------------
    result.sort((a, b) => {

      const timeA = a.lastStatusChange
        ? new Date(a.lastStatusChange).getTime()
        : 0

      const timeB = b.lastStatusChange
        ? new Date(b.lastStatusChange).getTime()
        : 0

      return timeB - timeA
    })

    res.json(result)

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const deleteStudent = async (req, res) => {

  try {

    const { id } = req.params

    const user =
      await User.findById(id)

    if (user) {

      await ApprovedStudent.findOneAndDelete({
        rollNo: user.rollNo
      })

      await User.findByIdAndDelete(id)

      return res.json({
        message: 'Student deleted'
      })
    }

    const approved =
      await ApprovedStudent.findById(id)

    if (approved) {

      await User.findOneAndDelete({
        rollNo: approved.rollNo
      })

      await ApprovedStudent.findByIdAndDelete(id)

      return res.json({
        message: 'Student deleted'
      })
    }

    return res.status(404).json({
      message: 'Student not found'
    })

  }

  catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}

const updateStudent = async (req, res) => {

  try {

    console.log("ID:", req.params.id)

    console.log("Approved Data:", req.body.approvedData)

    console.log("User Data:", req.body.userData)

    console.log(req.body)

    const { id } = req.params

    const {
      approvedData,
      userData
    } = req.body

    // Registered User
    const user =
      await User.findById(id)

    if (user) {

      await User.findByIdAndUpdate(
        id,
        userData,
        {
          new: true,
          runValidators: true
        }
      )

      await ApprovedStudent.findOneAndUpdate(
        { rollNo: user.rollNo },
        approvedData,
        {
          new: true,
          runValidators: true
        }
      )

      return res.json({
        message: 'Student updated'
      })

    }

    // Unregistered Student
    const approved =
      await ApprovedStudent.findById(id)

    if (approved) {

      await ApprovedStudent.findByIdAndUpdate(
        id,
        approvedData
      )

      return res.json({
        message: 'Student updated'
      })

    }

    return res.status(404).json({
      message: 'Student not found'
    })

  }

  catch (error) {

    console.log(error)

    res.status(500).json({
      message: error.message
    })

  }

}

module.exports = {
  getAllStudentsView,
  getStudentDetails,
  deleteStudent,
  updateStudent
}

