import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import adminApi from '../api/adminApi'
import toast from "react-hot-toast"

import logo from '../assets/textlogo.png'

export default function StudentDetail({ id }) {

  // const { id } = useParams()
  const navigate = useNavigate()

  const [approved, setApproved] = useState(null)
  const [user, setUser] = useState(null)

  const [type, setType] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const [approvedForm, setApprovedForm] = useState({})
  const [userForm, setUserForm] = useState({})

  const [loading, setLoading] = useState(false)

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

      setLoading(true)

      await adminApi.put(
        `/admin/student/${id}`,
        {
          approvedData: approvedForm,
          userData: userForm
        }
      )

      toast.success('Updated Successfully')

      setIsEditing(false)

      fetchData()

    }

    catch (err) {

      console.log(err)

      toast.error(
        err.response?.data?.message ||
        'Update Failed'
      )

    } finally {
      setLoading(false)
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

  if (!approved) {
    return <div className='container px-4 py-3'>
      <p className='text-center'>
        <span
          className="spinner-border spinner-border-sm"
          role="status"
        ></span>
      </p>
    </div>
  }

  return (

    <div className="position-relative d-flex flex-column h-100 pt-">

      {/* Edit Actions */}
      <div className='position-absolute mx-4 end-0 mt-2' style={{ zIndex: 10 }}>

        {/* Edit & Save Buttons */}
        {!isEditing ? (

          <div className='shadow-sm rounded-circle'>
            <button className="btn bg-official rounded-circle d-flex p-2" onClick={() => setIsEditing(true)}>

              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="text-white bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
              </svg>

            </button>

            {/* <button
              className="btn px-0 py-1"
              onClick={handleDelete}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person-x-fill text-danger" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m6.146-2.854a.5.5 0 0 1 .708 0L14 6.293l1.146-1.147a.5.5 0 0 1 .708.708L14.707 7l1.147 1.146a.5.5 0 0 1-.708.708L14 7.707l-1.146 1.147a.5.5 0 0 1-.708-.708L13.293 7l-1.147-1.146a.5.5 0 0 1 0-.708" />
              </svg>
            </button> */}

          </div>

        ) : (

          <div className='shadow-sm rounded-circle'>
            {/* SAVE */}
            <button className="btn shadow-sm btn-official rounded-circle d-flex p-2"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ?
                <p className='m-0 px-1'>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></span>
                </p>
                : <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-check2" viewBox="0 0 16 16">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
                </svg>}
            </button>

          </div>

        )}

      </div>

      {/* Scrollable Student Card */}
      <div className="flex-grow-1 overflow-auto py-3 hide-scrollbar">

        {/* STATUS BADGE */}
        <div className="mb-2">

          <div className='mx-4 d-flex'>
            <span
              className={`badge ${type === 'REGISTERED'
                ? 'bg-official'
                : 'bg-danger'
                }`}
            >
              {type}
            </span>
          </div>

        </div>

        {/* CARD */}
        <div className="card shadow-sm mx-4">

          <div className="card-body">



            {/* Student Details */}
            <div className="row g-3">

              {/* Name */}
              <div className="col-md-6">
                <label>Name</label>
                <input
                  className="form-control"
                  name="name"
                  value={
                    type === "UNREGISTERED"
                      ? (approvedForm.name || "")
                      : (userForm.name || "")
                  }
                  disabled={!isEditing}
                  onChange={
                    type === "UNREGISTERED"
                      ? (handleApprovedChange)
                      : (handleUserChange)
                  }
                />
              </div>

              {/* Roll Number */}
              <div className="col-md-6">
                <label>Roll Number</label>
                <input
                  className="form-control"
                  name="rollNo"
                  value={
                    type === "UNREGISTERED"
                      ? (approvedForm.rollNo || "")
                      : (userForm.rollNo || "")
                  }
                  disabled={!isEditing}
                  onChange={
                    type === "UNREGISTERED"
                      ? (handleApprovedChange)
                      : (handleUserChange)
                  }
                />
              </div>

              {/* Email */}
              <div className="col-md-6">
                <label>Email</label>
                <input
                  className="form-control"
                  name="email"
                  value={
                    type === "UNREGISTERED"
                      ? (approvedForm.email || "")
                      : (userForm.email || "")
                  }
                  disabled={!isEditing}
                  onChange={
                    type === "UNREGISTERED"
                      ? (handleApprovedChange)
                      : (handleUserChange)
                  }
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

    </div>

  )
}