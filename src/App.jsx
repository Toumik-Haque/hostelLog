import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

/* =======================
   HOME PAGES
======================= */
import Home from './pages/Home'

/* =======================
   PAGES - STUDENT
======================= */
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyOtp from './pages/VerifyOtp'
import CompleteProfile from './pages/CompleteProfile'
import StudentDashboard from './pages/StudentDashboard'
import StudentProfile from './pages/StudentProfile'
import StudentList from './pages/StudentList'
import StudentHostelStatus from './pages/StudentHostelStatus'

/* =======================
   PAGES - ADMIN
======================= */
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import StudentDetail from './pages/StudentDetail'

/* =======================
   COMPONENTS
======================= */
import ProtectedAdmin from './components/ProtectedAdmin'

function App() {
  return (
    
    <BrowserRouter>

      <>
        <Toaster position="top-center" />
      </>
      <Routes>

        {/* =======================
            PUBLIC / AUTH (STUDENT)
        ======================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />

        {/* =======================
            STUDENT DASHBOARD
        ======================= */}
        <Route path="/student" element={<StudentDashboard />} />

        {/* =======================
            ADMIN AUTH
        ======================= */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* =======================
            ADMIN PROTECTED ROUTES
        ======================= */}
        <Route path="/admin" element={
            <ProtectedAdmin>
              <AdminDashboard />
            </ProtectedAdmin>
          }
        />

        {/* <Route path="/admin/students" element={
            <ProtectedAdmin>
              <AdminAllStudents />
            </ProtectedAdmin>
          }
        /> */}

        <Route path="/admin/student/:id" element={
            <ProtectedAdmin>
              <StudentDetail />
            </ProtectedAdmin>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App