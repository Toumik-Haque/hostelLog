import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        name: String,

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

        mobile: String,

        department: String,

        roomNo: String,

        foodPreference: String,

        dontEat: [String],

        bloodGroup: String,

        password: String,

        hostelStatus: {
            type: String,
            default: 'OUT'
        },

        lastStatusChange: {
            type: Date,
            default: null
        },

        prevLastStatusChange: {
            type: Date,
            default: null
        }

    },
    {
        timestamps: true
    }
)

export default mongoose.model(
    'User',
    userSchema
)