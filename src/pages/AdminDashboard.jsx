import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from "react-hot-toast"

import adminApi from '../api/adminApi'
import AdminHostelStatus from './AdminHostelStatus'
import AdminAllStudents from './AdminAllStudents'
import StudentDetail from './StudentDetail'

import logo from '../assets/textlogo.png'

export default function AdminDashboard() {

  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('status')
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const [showModal, setShowModal] = useState(false)

  const [form, setForm] = useState({
    name: '',
    rollNo: '',
    email: ''
  })

  const [stats, setStats] = useState(null)

  const fetchStats = async () => {
    try {

      const res = await adminApi.get(
        '/hostel/stats'
      )

      setStats(res.data)

    } catch (err) {
      console.log(err)
    }
  }

  const handleLogout = () => {

    localStorage.removeItem('adminToken')
    navigate('/admin-login')
    localStorage.removeItem("saveAdminTab")
    localStorage.removeItem("markActiveAdmin")
    localStorage.removeItem("selectedStudents")
    localStorage.removeItem("studentId")
  }

  const addStudent = async () => {
    try {

      await adminApi.post(
        '/approved-students',
        form
      )

      await fetchStats()

      setShowModal(false)

      setForm({
        name: '',
        rollNo: '',
        email: ''
      })

      toast.success('Student Added Successfully');

    } catch (err) {

      console.log(err)

      toast.error(
        err.response?.data?.message ||
        'Failed to add student'
      );
    }
  }

  useEffect(() => {

    const savedTab = localStorage.getItem("saveAdminTab") || "status"
    setActiveTab(savedTab)

    const savedId = localStorage.getItem("studentId") || null
    setSelectedStudentId(savedId)
  })

  return (

    <div className="d-flex flex-column vh-100 bgColor">

      {/* Header */}
      <div className='p-4 pb-3 bg-white border-bottom border-opacity-25 border-secondary'>

        <div className='d-flex justify-content-between'>
          <div>
            <img src={logo} alt="hostelLog text logo" srcset="" style={{ height: '30px' }} />
            < p className='m-0 ' > Admin Dashboard</p >
          </div >

          <div>
            <button className="p-0 btn d-flex align-items-center text-danger fw-bold gap-1" onClick={handleLogout}>
              <small className='m-0'>LOGOUT</small>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
              </svg>
            </button>
          </div>
        </div >


      </div >

      {/* Scrollable Main Content View */}
      <div className="flex-grow-1 overflow-hidden">

        {activeTab === 'status' && (
          <AdminHostelStatus />
        )}

        {activeTab === 'students' && (
          <AdminAllStudents
            setActiveTab={setActiveTab}
            setSelectedStudentId={setSelectedStudentId}
          />
        )}

        {activeTab === "single" && (
          <StudentDetail
            id={selectedStudentId}
          />
        )}

      </div>

      {/* Footer */}
      <div className='bg-white border-top border-opacity-25 border-secondary px-4 py-2 w-100 d-flex flex-column gap-3'>

        {/* NAV BUTTONS */}
        <div className=' mt-1 d-flex gap-5 justify-content-center'>

          <button className='btn border-0 p-0 d-flex flex-column align-items-center justify-content-center' onClick={() => {
            setActiveTab('status')
            localStorage.removeItem("saveAdminTab")
            localStorage.removeItem("studentId")
          }
          }>
            <div className={` px-4 p-1 rounded-5 transition-colors ${activeTab === 'status'
              ? 'activeTa color-official'
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
          </button>

          <button className='btn border-0 p-0 d-flex flex-column align-items-center justify-content-center' onClick={() =>
            setShowModal(true)
          }>
            <div className='color-official'>
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
              </svg>
            </div>
          </button>

          <button className='btn border-0 p-0 d-flex flex-column align-items-center justify-content-center' onClick={() => {
            setActiveTab('students')
            localStorage.setItem("saveAdminTab", "students")
            localStorage.removeItem("studentId")
          }
          }>
            <div className={` px-4 p-1 rounded-5 transition-colors ${activeTab === 'students'
              ? 'activeTa color-official'
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

      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-75" onClick={() => setShowModal(false)}>

          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>

            <div className="modal-content">

              <div className="modal-header">

                <h5 className="modal-title color-official">
                  Add New Student
                </h5>

              </div>

              <div className='modal-body'>

                <div className="form-floating mb-3">
                  <input
                    type='text'
                    required
                    className="form-control rounded-3"
                    id="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value
                      })
                    }
                  />
                  <label htmlFor="name">
                    Full Name
                  </label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type='number'
                    required
                    className="form-control rounded-3"
                    id="rollNo"
                    placeholder="University Roll No"
                    value={form.rollNo}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        rollNo: e.target.value
                      })
                    }
                  />
                  <label htmlFor="rollNo">
                    University Roll No
                  </label>
                </div>

                <div className="form-floating">
                  <input
                    type='email'
                    required
                    className="form-control rounded-3"
                    id="email"
                    placeholder="Student Email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value
                      })
                    }
                  />
                  <label htmlFor="email">
                    Student Email
                  </label>
                </div>

              </div>

              <div className="modal-footer">

                <button
                  className="btn bg-secondary text-white rounded-3 "
                  onClick={() => {
                    setShowModal(false)
                  }}
                >Cancel</button>

                <button
                  className="btn bg-official text-white rounded-3 "
                  onClick={addStudent}
                >
                  Add
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>

  )

}