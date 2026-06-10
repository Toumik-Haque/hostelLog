import dns from "dns";
dns.setDefaultResultOrder("ipv4first");


import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db"

dotenv.config()

connectDB()

const app = express()

app.use(cors())
app.use(express.json())

import approvedStudentRoutes from "./routes/approvedStudentRoutes"
app.use(
  '/api/approved-students',
  approvedStudentRoutes
)

import adminAuthRoutes from "./routes/adminAuthRoutes"
app.use('/api/admin-auth', adminAuthRoutes)

import authRoutes from "./routes/authRoutes"
app.use('/api/auth', authRoutes)

import hostelRoutes from "./routes/hostelRoutes"
app.use('/api/hostel', hostelRoutes)

import adminRoutes from "./routes/adminRoutes"
app.use('/api/admin', adminRoutes)

import studentRoutes from "./routes/studentRoutes"
app.use('/api/student', studentRoutes)

app.get('/', (req, res) => {
  res.send('Hostel Connect Backend Running')
})

const PORT =
  process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  )
})