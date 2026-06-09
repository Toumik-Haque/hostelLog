import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import adminApi from '../api/adminApi'

export default function AdminDashboard() {

  const [showModal, setShowModal] = useState(false)

  const [form, setForm] = useState({
    name: '',
    rollNo: '',
    email: ''
  })

  const navigate = useNavigate()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const addStudent = async () => {
    try {

      await adminApi.post(
        '/approved-students',
        form
      )

      await fetchStats()

      alert('Student Added Successfully')

      setShowModal(false)

      setForm({
        name: '',
        rollNo: '',
        email: ''
      })

    } catch (err) {

      console.log(err)

      alert(
        err.response?.data?.message ||
        'Failed to add student'
      )
    }
  }

  const handleLogout = () => {

    localStorage.removeItem('adminToken')

    navigate('/admin-login')
  }

  return (

    <div>

      {/* Main Page */}
      <div
        className="d-flex flex-column admin-bg"
        style={{ height: '100vh' }}
      >

        {/* Header */}
        <div className='d-flex border-bottom border-5 p-4 pb-3 justify-content-between mb-1 bg-white'>
          <div>
            <h3 className='mb-0'>Admin Panel</h3>
            <p className='m-0 '>Hostel Connect</p>
          </div>

          <div>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>



        {/* ACTION BUTTONS */}
        <div className='center-view m-4 d-flex gap-3' style={{ maxWidth: '400p' }}>

          <button className="btn btn-primary w-50 py-2" onClick={() => navigate('/admin/students')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16">
              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
            </svg>
            <p className='m-0 m-1 small'>View Student List</p>
          </button>

          <button className="btn btn-primary w-50 py-2" onClick={() => setShowModal(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person-plus-fill" viewBox="0 0 16 16">
              <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
              <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5" />
            </svg>
            <p className='m-0 mt-1 small'>Add New Student</p>
          </button>

        </div>

        {/* Scrollable View */}
        <div
          className="flex-grow-1 overflow-auto py-3 hide-scrollbar"
        >

          {!stats ? (

            <div className='container px-4'>
              <p className='text-center'><i>Loading...</i></p>
            </div>

          ) : (

            <div className='container px-4'>

              {/* PRESENT CARD */}
              <div className="card border-success  mb-3 shadow-sm">

                <div className="card-body">

                  <h5 className='d-flex justify-content-between'>
                    <span className=''>Total Present Now</span>
                    <span className='bg-success text-white px-3 badge'>
                      {stats.presentNow.totalPresentNow}
                    </span>
                  </h5>

                  <p className="mb-0">
                    Pure Veg:
                    {' '}
                    {stats.presentNow.totalVegPresentNow}
                  </p>

                  <p className="mb-0">
                    Don't Eat Chicken:
                    {' '}
                    {stats.presentNow.totalDontEatChickenPresentNow}
                  </p>

                  <p className="mb-0">
                    Don't Eat Fish:
                    {' '}
                    {stats.presentNow.totalDontEatFishPresentNow}
                  </p>

                  <p className="mb-0">
                    Don't Eat Egg:
                    {' '}
                    {stats.presentNow.totalDontEatEggPresentNow}
                  </p>

                </div>

              </div>

              {/* TOTAL STUDENTS */}
              <div className="card border-primary mb-3 shadow-sm">

                <div className="card-body">

                  <h5 className='d-flex justify-content-between'>
                    <span className=''>Total Hostel Students</span>
                    <span className='bg-info text-dark px-3 badge'>
                      {stats.total.totalStudents}
                    </span>
                  </h5>

                  <p className="mb-0">
                    Pure Veg:
                    {' '}
                    {stats.total.totalVegStudents}
                  </p>

                  <p className="mb-0">
                    Don't Eat Chicken:
                    {' '}
                    {stats.total.totalDontEatChickenStudents}
                  </p>

                  <p className="mb-0">
                    Don't Eat Fish:
                    {' '}
                    {stats.total.totalDontEatFishStudents}
                  </p>

                  <p className="mb-0">
                    Don't Eat Egg:
                    {' '}
                    {stats.total.totalDontEatEggStudents}
                  </p>

                </div>

              </div>

              {/* TOTAL UNREGISTERED */}
              <div className="card border-secondary mb-4 shadow-sm">

                <div className="card-body">

                  <div className='d-flex justify-content-between'>

                    <div className='d-flex flex-column'>
                      <h5 className='mb-1'>Still UNREGISTERED</h5>
                      <small >Who have no data here</small>
                    </div>

                    <div>
                      <span className='bg-secondary px-3 badge '>
                        {stats.unregisteredNow.unregisteredStudents}
                      </span>
                    </div>

                  </div>



                </div>

              </div>

            </div>

          )}

        </div>



        {/* Footer */}
        <div className='admin-footer px-4 py-2 w-100 d-flex justify-content-center'>

          <small className='text-center my-1 py-0'>
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

      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-75" onClick={() => setShowModal(false)}>

          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>

            <div className="modal-content p-3">

              <h5 className='text-center'>Add Student</h5>

              <input
                name="name"
                placeholder="Full Name"
                className="form-control my-1"
                onChange={handleChange}
              />

              <input
                name="rollNo"
                placeholder="University Roll No"
                className="form-control my-1"
                onChange={handleChange}
              />

              <input
                name="email"
                placeholder="Student Email"
                className="form-control my-1"
                onChange={handleChange}
              />

              <button
                className="btn btn-warning mt-3"
                onClick={addStudent}
              >
                Add Now
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  )
}