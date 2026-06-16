import { useEffect, useState } from 'react'
import studentApi from '../api/studentApi'

export default function StudentProfile() {

  const [user, setUser] = useState(null)

  const [showModal, setShowModal] = useState(false)

  const [showPasswords, setShowPasswords] = useState(false)

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleChangePassword = async () => {

    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      return alert('All fields are required')
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      return alert(
        'Passwords do not match'
      )
    }

    try {

      const res =
        await studentApi.put(
          '/auth/change-password',
          passwordData
        )

      alert(res.data.message)

      setShowModal(false)

      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      })

    } catch (err) {

      alert(
        err.response?.data?.message ||
        'Something went wrong'
      )

    }
  }

  const resetPasswordModal = () => {

    setPasswordData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    setShowPasswords(false)

  }

  useEffect(() => {
    const fetchUser = async () => {

      try {

        const token =
          localStorage.getItem('token')

        const res = await studentApi.get(
          '/auth/me',
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        )

        setUser(res.data.user)

      } catch (err) {
        console.log(err)
      }

    }

    fetchUser()
  }, [])


  if (!user) {
    return <div className='container px-4'>
      <p className='text-center'>
        <span
          className="spinner-border"
          role="status"
        ></span>
      </p>
    </div>
  }

  return (

    <div className="card mx-4 border-0">

      <div className="card-body p-0">

        <p className={`badge mb-2 text-center ${user.hostelStatus === 'IN' ? 'bg-official' : 'bg-danger'} `}>
          {user.hostelStatus === 'IN' ?
            'PRESENT NOW' : 'ABSENT NOW'}
        </p>
        <h4>{user.name}</h4>

        <p className='m-0'>Roll: {user.rollNo}</p>
        <p className='m-0'>Email: {user.email}</p>
        <p className='m-0'>Mobile: {user.mobile}</p>
        <p className='m-0'>Department: {user.department}</p>
        <p className='m'>Blood Group: {user.bloodGroup}</p>

        <p className='m-0'>Room: {user.roomNo}</p>
        <p className='m-0'>Food Preference: {user.foodPreference}</p>
        {user.dontEat?.length > 0 && (
          <p className='mb-1'>
            But, Don't Eat: {user.dontEat.join(', ')}
          </p>
        )}

        <p className='activeTab rounded-3 mt-4 text-center p-2'>Note: Contact your Hostel Authority to update any of your details.</p>

        <div className='d-flex mt-4 justify-content-center'>

          <button
            className="bg-transparent p-0 border-0 fw-bold color-official d-flex gap-1 align-items-center"
            onClick={() => setShowModal(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
            </svg>
            Change Password
          </button>

        </div>

      </div>

      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-75" onClick={() => {
          setShowModal(false)
          resetPasswordModal()
        }}>

          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>

            <div className="modal-content">

              <div className="modal-header">

                <h5 className="modal-title color-official">
                  Change Password
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    resetPasswordModal()
                    setShowModal(false)
                  }}
                ></button>

              </div>

              <div className="modal-body">

                <div className="form-floating mb-3">
                  <input
                    type={
                      showPasswords
                        ? 'text'
                        : 'password'
                    }
                    required
                    className="form-control rounded-3"
                    id="oldPassword"
                    placeholder="Old Password"
                    value={passwordData.oldPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        oldPassword: e.target.value
                      })
                    }
                  />
                  <label htmlFor="oldPassword">
                    Current Password
                  </label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type={
                      showPasswords
                        ? 'text'
                        : 'password'
                    }
                    required
                    className="form-control rounded-3"
                    id="newPassword"
                    placeholder="New Password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value
                      })
                    }
                  />
                  <label htmlFor="newPassword">
                    New Password
                  </label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type={
                      showPasswords
                        ? 'text'
                        : 'password'
                    }
                    required
                    className="form-control rounded-3"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value
                      })
                    }
                  />
                  <label htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                </div>

                <button
                  type="button"
                  className="p-0 border-0 color-official bg-transparent"
                  onClick={() =>
                    setShowPasswords(
                      !showPasswords
                    )
                  }
                >
                  {showPasswords
                    ? 'Hide Passwords'
                    : 'Show Passwords'}
                </button>

              </div>

              <div className="modal-footer">

                <button
                  className="btn bg-official text-white rounded-3"
                  onClick={handleChangePassword}
                >
                  Update Password
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>

  )
}