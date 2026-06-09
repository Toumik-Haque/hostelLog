const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

const connectDB = require('./config/db')

dotenv.config()

connectDB()

const app = express()

app.use(cors())
app.use(express.json())

const approvedStudentRoutes = require('./routes/approvedStudentRoutes')
app.use(
  '/api/approved-students',
  approvedStudentRoutes
)

const adminAuthRoutes = require('./routes/adminAuthRoutes')
app.use('/api/admin-auth', adminAuthRoutes)

const authRoutes = require('./routes/authRoutes')
app.use('/api/auth', authRoutes)

const hostelRoutes = require('./routes/hostelRoutes')
app.use('/api/hostel', hostelRoutes)

const adminRoutes = require('./routes/adminRoutes')
app.use('/api/admin', adminRoutes)

const studentRoutes = require('./routes/studentRoutes')
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