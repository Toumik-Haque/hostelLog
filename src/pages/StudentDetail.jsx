import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import adminApi from '../api/adminApi'

export default function StudentDetail() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [approved, setApproved] = useState(null)
  const [user, setUser] = useState(null)

  const [type, setType] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const [approvedForm, setApprovedForm] = useState({})
  const [userForm, setUserForm] = useState({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {

      const res = await adminApi.get(
        `/admin/student/${id}`
      )

      console.log(res.data.user)

      setType(res.data.type)
      setApproved(res.data.approved)
      setApprovedForm(res.data.approved)

      if (res.data.user) {

        setUser(res.data.user)
        setUserForm(res.data.user)

      }

    } catch (err) {
      console.log(err)
    }
  }

  if (!approved) {
    return <p className='text-center mt-3'>Loading...</p>
  }

  const handleLogout = () => {

    localStorage.removeItem('adminToken')

    navigate('/admin-login')
  }

  const handleApprovedChange = (e) => {

    setApprovedForm({

      ...approvedForm,

      [e.target.name]:
        e.target.value

    })

  }

  const handleUserChange = (e) => {

    setUserForm({

      ...userForm,

      [e.target.name]:
        e.target.value

    })

  }

  const handleSave = async () => {

    try {

      await adminApi.put(
        `/admin/student/${id}`,
        {
          approvedData: approvedForm,
          userData: userForm
        }
      )

      alert(
        'Updated Successfully'
      )

      setIsEditing(false)

      fetchData()

    }

    catch (err) {

      console.log(err)

      alert(
        err.response?.data?.message ||
        'Update Failed'
      )

    }

  }



  const handleDelete = async () => {

    const confirmDelete =
      window.confirm(
        'Delete this student permanently?'
      )

    if (!confirmDelete) return

    try {

      await adminApi.delete(
        `/admin/student/${id}`
      )

      alert('Student Deleted')

      navigate('/admin/students')

    }

    catch (err) {

      console.log(err)

      alert('Delete Failed')

    }

  }

  const handleDontEatChange = (item) => {

    let updated = [...(userForm.dontEat || [])]

    if (updated.includes(item)) {

      updated =
        updated.filter(
          x => x !== item
        )

    } else {

      updated.push(item)

    }

    setUserForm({
      ...userForm,
      dontEat: updated
    })

  }

  return (

    <div>

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

        {/* After Header Actions */}
        <div className='mx-4 mb-3 d-flex justify-content-between'>

          {/* Back Button */}
          <button className='btn p-0' onClick={() => navigate('/admin/students')}>

            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
            </svg>

          </button>

          {/* Edit & Save Buttons */}
          {!isEditing ? (

            <div className='d-flex gap-3'>
              <button
                className="btn px-0 py-1"
                onClick={() =>
                  setIsEditing(true)
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-pencil-square text-primary" viewBox="0 0 16 16">
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                </svg>
              </button>

              <button
                className="btn px-0 py-1"
                onClick={handleDelete}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person-x-fill text-danger" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m6.146-2.854a.5.5 0 0 1 .708 0L14 6.293l1.146-1.147a.5.5 0 0 1 .708.708L14.707 7l1.147 1.146a.5.5 0 0 1-.708.708L14 7.707l-1.146 1.147a.5.5 0 0 1-.708-.708L13.293 7l-1.147-1.146a.5.5 0 0 1 0-.708" />
                </svg>
              </button>
            </div>

          ) : (

            <div className='d-flex gap-2'>
              <button
                className="btn btn-secondary"
                onClick={() =>
                  setIsEditing(false)
                }
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={handleSave}
              >
                Save
              </button>
            </div>

          )}

          {!isEditing ? (
            <></>
          ) : (
            <div></div>
          )}

        </div>



        {/* Scrollable Student Card */}
        <div
          className="flex-grow-1 overflow-auto px-4 py-3 admin-bg"
        >

          {/* CARD */}
          <div className="card shadow-sm mx-4">

            <div className="card-body">

              {/* STATUS BADGE */}
              <div className="mb-2">

                <div className='d-flex justify-content-center'>
                  <span
                    className={`badge ${type === 'REGISTERED'
                      ? 'bg-success'
                      : 'bg-danger'
                      }`}
                  >
                    {type}
                  </span>
                </div>

              </div>

              {/* Student Details */}
              <div className="row g-3">

                {/* Name */}
                <div className="col-md-6">
                  <label>Name</label>
                  <input
                    className="form-control"
                    name="name"
                    value={approvedForm.name || ''}
                    disabled={!isEditing}
                    onChange={handleApprovedChange}
                  />
                </div>

                {/* Roll Number */}
                <div className="col-md-6">
                  <label>Roll Number</label>
                  <input
                    className="form-control"
                    name="rollNo"
                    value={approvedForm.rollNo || ''}
                    disabled={!isEditing}
                    onChange={handleApprovedChange}
                  />
                </div>

                {/* Email */}
                <div className="col-md-6">
                  <label>Email</label>
                  <input
                    className="form-control"
                    name="email"
                    value={approvedForm.email || ''}
                    disabled={!isEditing}
                    onChange={handleApprovedChange}
                  />
                </div>

                {/* Registered Deteails */}
                {type === 'REGISTERED' && (
                  <>
                    {/* Mobile */}
                    <div className="col-md-6">
                      <label>Mobile</label>
                      <input
                        className="form-control"
                        name="mobile"
                        value={userForm.mobile || ''}
                        disabled={!isEditing}
                        onChange={handleUserChange}
                      />
                    </div>

                    {/* Department */}
                    <div className="col-md-6">
                      <label>Department</label>
                      <select
                        className="form-select"
                        name="department"
                        value={userForm.department || ''}
                        disabled={!isEditing}
                        onChange={handleUserChange}
                      >

                        <option value="">
                          Select Department
                        </option>

                        <option>CSE</option>
                        <option>ECE</option>
                        <option>EE</option>
                        <option>AI</option>

                      </select>
                    </div>

                    {/* Room Number  */}
                    <div className="col-md-6">
                      <label>Room Number</label>
                      <select
                        className="form-select"
                        name="roomNo"
                        value={userForm.roomNo || ''}
                        disabled={!isEditing}
                        onChange={handleUserChange}
                      >

                        <option value="">
                          Select Room
                        </option>

                        {
                          Array.from(
                            { length: 75 },
                            (_, i) => 101 + i
                          ).map(room => (

                            <option
                              key={room}
                              value={room}
                            >
                              {room}
                            </option>

                          ))
                        }

                      </select>
                    </div>

                    {/* Food Preference */}
                    <div className="col-md-6">
                      <label className="fw-bold">Food Preference</label>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="foodPreference"
                          value="Veg"
                          checked={userForm.foodPreference === 'Veg'}
                          onChange={handleUserChange}
                          disabled={!isEditing}
                        />
                        <label className="form-check-label">
                          Veg
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="foodPreference"
                          value="Non-Veg"
                          checked={userForm.foodPreference === 'Non-Veg'}
                          onChange={handleUserChange}
                          disabled={!isEditing}
                        />
                        <label className="form-check-label">
                          Non-Veg
                        </label>
                      </div>
                    </div>

                    {/* Don't Eat */}
                    <div className="col-12">
                      <label className="fw-bold">
                        Doesn't Eat
                      </label>

                      <div className="form-check">

                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={
                            userForm.dontEat?.includes(
                              'Chicken'
                            )
                          }
                          disabled={!isEditing}
                          onChange={() =>
                            handleDontEatChange(
                              'Chicken'
                            )
                          }
                        />

                        <label className="form-check-label">
                          Chicken
                        </label>

                      </div>

                      <div className="form-check">

                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={
                            userForm.dontEat?.includes(
                              'Fish'
                            )
                          }
                          disabled={!isEditing}
                          onChange={() =>
                            handleDontEatChange(
                              'Fish'
                            )
                          }
                        />

                        <label className="form-check-label">
                          Fish
                        </label>

                      </div>

                      <div className="form-check">

                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={
                            userForm.dontEat?.includes(
                              'Egg'
                            )
                          }
                          disabled={!isEditing}
                          onChange={() =>
                            handleDontEatChange(
                              'Egg'
                            )
                          }
                        />

                        <label className="form-check-label">
                          Egg
                        </label>

                      </div>
                    </div>

                    {/* Blood Group */}
                    <div className="col-md-6">
                      <label>Blood Group</label>
                      <select
                        className="form-select"
                        name="bloodGroup"
                        value={userForm.bloodGroup || ''}
                        disabled={!isEditing}
                        onChange={handleUserChange}
                      >

                        <option value="">
                          Select Blood Group
                        </option>

                        <option>A+</option>
                        <option>A-</option>
                        <option>B+</option>
                        <option>B-</option>
                        <option>AB+</option>
                        <option>AB-</option>
                        <option>O+</option>
                        <option>O-</option>

                      </select>
                    </div>
                  </>
                )}

                {/* Status show */}
                {type === 'REGISTERED' && (

                  <div className="col-md-6">

                    <label>Hostel Status</label>

                    <select
                      className="form-select"
                      name="hostelStatus"
                      value={userForm.hostelStatus || ''}
                      disabled={!isEditing}
                      onChange={handleUserChange}
                    >

                      <option value="IN">IN</option>
                      <option value="OUT">OUT</option>

                    </select>

                  </div>

                )}

                {/* Last Status Update (Read Only) */}
                {type === 'REGISTERED' && userForm.lastStatusChange && (

                  <div className="col-12">

                    <label>Last Status Update</label>

                    <input
                      className="form-control"
                      value={new Date(
                        userForm.lastStatusChange
                      ).toLocaleString()}
                      disabled
                    />

                  </div>

                )}

              </div>

            </div>

          </div>
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

    </div>

  )
}