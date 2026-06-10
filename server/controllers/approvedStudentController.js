import ApprovedStudent from "../models/ApprovedStudent"

const addApprovedStudent = async (
  req,
  res
) => {
  try {

    const {
      name,
      rollNo,
      email
    } = req.body

    const existingStudent =
      await ApprovedStudent.findOne({
        $or: [
          { rollNo },
          { email }
        ]
      })

    if (existingStudent) {
      return res.status(400).json({
        message:
          'Student already exists'
      })
    }

    const student =
      await ApprovedStudent.create({
        name,
        rollNo,
        email
      })

    res.status(201).json(student)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }
}

export default {
  addApprovedStudent
}