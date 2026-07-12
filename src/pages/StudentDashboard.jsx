import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import studentApi from '../api/studentApi'

import StudentProfile from './StudentProfile'
import StudentList from './StudentList'
import StudentHostelStatus from './StudentHostelStatus'
import BankAccount from './BankAccount'

import logo from '../assets/textlogo.png'

export default function StudentDashboard() {

  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('status')
  const [stats, setStats] = useState(null)
  const [user, setUser] = useState(null)
  const [students, setStudents] = useState([])

  const fetchStats = async () => {
    try {

      const res = await studentApi.get('/hostel/stats')

      // setStats(res.data) // set the state direct
      return res.data       // return data instead of set the state

    } catch (err) {
      console.log(err)
    }
  }

  const fetchUser = async () => {
    try {

      const token = localStorage.getItem('token')

      const res = await studentApi.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      // setUser(res.data.user)  // set the state direct
      return res.data.user       // return data instead of set the state

    } catch (err) {
      console.log(err)
    }
  }

  const fetchData = async () => {
    try {

      const res = await studentApi.get(
        '/student/students-view'
      )

      // setStudents(res.data)  // set the state direct
      return res.data           // return data instead of set the state

    } catch (err) {
      console.log(err)
    }
  }

  const fetchingData = async () => {
    try {
      // Finish all fetches together
      const [statsData, userData, studentsData] = await Promise.all([
        fetchStats(),
        fetchUser(),
        fetchData(),
      ])

      // Update UI together
      setStats(statsData)
      setUser(userData)
      setStudents(studentsData)

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {

    fetchingData()

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
    }

    const savedTab = localStorage.getItem("saveTab") || "status"
    setActiveTab(savedTab)

  }, [navigate]);

  const handleLogout = () => {

    localStorage.removeItem('token')
    navigate('/', { replace: true })
    localStorage.removeItem('saveTab')
    localStorage.removeItem('markActive')
    localStorage.removeItem('markedStudents')
  }

  return (

    <div className="d-flex flex-column vh-100 bgColor">

      {/* Header */}
      <div className='p-4 pb-3 bg-white border-bottom border-opacity-25 border-secondary'>

        <div className='d-flex justify-content-between'>
          <div>
            <img src={logo} alt="hostelLog text logo" srcSet="" style={{ height: '30px' }} />
            {/* <h className='m-0 '>Welcome</h> */}
          </div>

          <div>
            <button className="p-0 btn d-flex align-items-center text-danger fw-bold gap-1" onClick={handleLogout}>
              <small className='m-0'>LOGOUT</small>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
              </svg>
            </button>
          </div>
        </div>


      </div>

      {/* Scrollable Main Content View */}
      <div className="flex-grow-1 overflow-hidden">

        {activeTab === 'status' && (
          <StudentHostelStatus
            stats={stats}
            user={user}
            fetchingData={fetchingData}
          />
        )}

        {activeTab === 'students' && (
          <StudentList
            students={students}
          />
        )}

        {activeTab === 'bank' && (
          <BankAccount />
        )}

        {activeTab === 'profile' && (
          <StudentProfile
            user={user}
          />
        )}

      </div>

      {/* Footer */}
      <div className='bg-white border-top border-opacity-25 border-secondary px-4 py-2 w-100 d-flex flex-column gap-3'>

        {/* NAV BUTTONS */}
        <div className=' mt-1 d-flex justify-content-between'>

          <button className='btn border-0 p-0 d-flex flex-column align-items-center' onClick={() => {
            setActiveTab('status')
            localStorage.removeItem("saveTab")
          }
          }>
            <div className={` px-4 p-1 rounded-5 transition-colors ${activeTab === 'status'
              ? 'activeTab'
              : ''
              }`}>

              {activeTab === 'status'
                ? <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-house-door-fill" viewBox="0 0 16 16">
                  <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
                </svg>
                : <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-house-door" viewBox="0 0 16 16">
                  <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z" />
                </svg>
              }

            </div>
            <small className={`fw-medium mt-1 transition ${activeTab === 'status'
              ? 'activeTabText'
              : ''
              }`}>Home</small>
          </button>

          <button className='btn border-0 p-0 d-flex flex-column align-items-center' onClick={() => {
            setActiveTab('students')
            localStorage.setItem("saveTab", "students")
          }
          }>
            <div className={` px-4 p-1 rounded-5 transition-colors ${activeTab === 'students'
              ? 'activeTab'
              : ''
              }`}>

              {activeTab === 'students'
                ? <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16">
                  <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                </svg>
                : <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                  <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                </svg>
              }

            </div>
            <small className={`fw-medium mt-1 transition ${activeTab === 'students'
              ? 'activeTabText'
              : ''
              }`}>Students</small>
          </button>

          <button className='btn border-0 p-0 d-flex flex-column align-items-center' onClick={() => {
            setActiveTab('bank')
            localStorage.setItem("saveTab", "bank")
          }
          }>
            <div className={` px-4 p-1 rounded-5 transition-colors ${activeTab === 'bank'
              ? 'activeTab'
              : ''
              }`}>
              {activeTab === 'bank'
                ? <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-pentagon-fill" viewBox="0 0 16 16">
                  <path d="M7.685.256a.5.5 0 0 1 .63 0l7.421 6.03a.5.5 0 0 1 .162.538l-2.788 8.827a.5.5 0 0 1-.476.349H3.366a.5.5 0 0 1-.476-.35L.102 6.825a.5.5 0 0 1 .162-.538l7.42-6.03Z" />
                </svg>
                : <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-pentagon" viewBox="0 0 16 16">
                  <path d="M7.685 1.545a.5.5 0 0 1 .63 0l6.263 5.088a.5.5 0 0 1 .161.539l-2.362 7.479a.5.5 0 0 1-.476.349H4.099a.5.5 0 0 1-.476-.35L1.26 7.173a.5.5 0 0 1 .161-.54l6.263-5.087Zm8.213 5.28a.5.5 0 0 0-.162-.54L8.316.257a.5.5 0 0 0-.631 0L.264 6.286a.5.5 0 0 0-.162.538l2.788 8.827a.5.5 0 0 0 .476.349h9.268a.5.5 0 0 0 .476-.35l2.788-8.826Z" />
                </svg>
              }
            </div>
            <small className={`fw-medium mt-1 transition ${activeTab === 'bank'
              ? 'activeTabText'
              : ''
              }`}>Banking</small>
          </button>

          <button className='btn border-0 p-0 d-flex flex-column align-items-center' onClick={() => {
            setActiveTab('profile')
            localStorage.setItem("saveTab", "profile")
          }
          }>
            <div className={` px-4 p-1 rounded-5 transition-colors ${activeTab === 'profile'
              ? 'activeTab'
              : ''
              }`}>
              {activeTab === 'profile'
                ? <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                </svg>
                : <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                </svg>
              }
            </div>
            <small className={`fw-medium mt-1 transition ${activeTab === 'profile'
              ? 'activeTabText'
              : ''
              }`}>Profile</small>
          </button>

        </div>

        <small className='text-center'>
          Developed by{' '}
          <a
            href="https://www.linkedin.com/in/toumik"
            target="_blank"
            rel="noopener noreferrer"
            className="color-official fw-bold text-decoration-none"
          >
            Toumik Haque
          </a>
        </small>

      </div>

    </div>
  )
}