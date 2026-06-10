import mongoose from "mongoose"

const approvedStudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    rollNo: {
      type: String,
      required: true,
      unique: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    registered: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model(
  'ApprovedStudent',
  approvedStudentSchema
)