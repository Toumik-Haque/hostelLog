import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import StudentProfile from './StudentProfile'
import StudentList from './StudentList'
import StudentHostelStatus from './StudentHostelStatus'

import logo from '../assets/textlogo.png'

export default function StudentDashboard() {

  const navigate = useNavigate()

  const [activeTab, setActiveTab] =
    useState('status')

  const handleLogout = () => {

    localStorage.removeItem('token')
    navigate('/')
  }

  return (

    <div
      className="d-flex flex-column"
      style={{ height: '100vh' }}
    >

      {/* Header */}
      <div className='p-4 pb-3  mb-1 bg-white border-bottom border-opacity-25 border-secondary'>

        <div className='d-flex justify-content-between'>
          <div>
            <img src={logo} alt="" srcset="" style={{ height: '33px' }} />
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

      {/* MAIN CONTENT */}
      {/* Scrollable View */}


      {activeTab === 'students' ?

        <div className='overflow-auto hide-scrollbar'>
          <StudentList />
        </div>

        : <div
          className="flex-grow-1 overflow-auto py-3 hide-scrollbar"
        >

          {activeTab === 'status' && (
            <StudentHostelStatus />
          )}


          {activeTab === 'profile' && (
            <StudentProfile />
          )}

        </div>
      }

      {/* Footer */}
      <div className='bg-white border-top border-opacity-25 border-secondary px-4 py-2 w-100 d-flex flex-column gap-3'>

        {/* NAV BUTTONS */}
        <div className=' mt-1 d-flex justify-content-between'>

          <button className='btn border-0 p-0 d-flex flex-column align-items-center' onClick={() =>
            setActiveTab('status')
          }>
            <div className={` px-4 p-1 rounded-5 transition-colors ${activeTab === 'status'
              ? 'activeTab'
              : ''
              }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-house-door" viewBox="0 0 16 16">
                <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z" />
              </svg>
            </div>
            <small className={`transition ${activeTab === 'status'
              ? 'activeTabText'
              : ''
              }`}>Home</small>
          </button>

          <button className='btn border-0 p-0 d-flex flex-column align-items-center' onClick={() =>
            setActiveTab('students')
          }>
            <div className={` px-4 p-1 rounded-5 transition-colors ${activeTab === 'students'
              ? 'activeTab'
              : ''
              }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
              </svg>
            </div>
            <small className={`transition ${activeTab === 'students'
              ? 'activeTabText'
              : ''
              }`}>Students</small>
          </button>

          <button className='btn border-0 p-0 d-flex flex-column align-items-center' onClick={() =>
            setActiveTab('profile')
          }>
            <div className={` px-4 p-1 rounded-5 transition-colors ${activeTab === 'profile'
              ? 'activeTab'
              : ''
              }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
              </svg>
            </div>
            <small className={`transition ${activeTab === 'profile'
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