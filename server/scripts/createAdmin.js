import mongoose from "mongoose"
import Admin from "../models/Admin.js"
import bcrypt from "bcryptjs"
import dotenv from 'dotenv'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI

const createAdmin = async () => {
  try {

    await mongoose.connect(MONGO_URI)

    console.log('MongoDB connected')

    // 🔥 CHECK IF ADMIN EXISTS
    const existingAdmin =
      await Admin.findOne({ username: 'admin' })

    if (existingAdmin) {
      console.log('Admin already exists')
      process.exit(0)
    }

    // 🔐 HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash('admin123', 10)

    // 👤 CREATE ADMIN
    await Admin.create({
      username: 'admin',
      password: hashedPassword
    })

    console.log('Admin created successfully')

  } catch (err) {

    console.error('Error creating admin:', err.message)

  } finally {

    await mongoose.connection.close()
    process.exit()

  }
}

createAdmin()