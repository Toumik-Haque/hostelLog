const mongoose = require('mongoose')
const Admin = require('../models/Admin')
const bcrypt = require('bcryptjs')

const MONGO_URI =
  'mongodb+srv://hosteladmin:%40786Toumik@hostel-connect.c5f3u9r.mongodb.net/hostelconnect?retryWrites=true&w=majority&appName=hostel-connect'

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