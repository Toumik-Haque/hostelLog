import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"

dotenv.config()

connectDB()

const app = express()

app.use(cors())
app.use(express.json())

// // Disable caching for API responses
// app.use((req, res, next) => {
//   res.set("Cache-Control", "no-store")
//   next()
// })

import approvedStudentRoutes from "./routes/approvedStudentRoutes.js"
app.use(
  '/api/approved-students',
  approvedStudentRoutes
)

import adminAuthRoutes from "./routes/adminAuthRoutes.js"
app.use('/api/admin-auth', adminAuthRoutes)

import authRoutes from "./routes/authRoutes.js"
app.use('/api/auth', authRoutes)

import hostelRoutes from "./routes/hostelRoutes.js"
app.use('/api/hostel', hostelRoutes)

import adminRoutes from "./routes/adminRoutes.js"
app.use('/api/admin', adminRoutes)

import studentRoutes from "./routes/studentRoutes.js"
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