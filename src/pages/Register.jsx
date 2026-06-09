import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MobileContainer from '../components/MobileContainer'
import publicApi from '../api/publicApi'
import logo from '../assets/textlogo.png'

function Register() {
  const [foodPreference, setFoodPreference] = useState('')

  const navigate = useNavigate()

  const [form, setForm] = useState({
    rollNo: '',
    email: ''
  })

  const [loading, setLoading] = useState(false)

  const handleSendOtp = async (e) => {

    e.preventDefault()

    try {

      setLoading(true)

      const res = await publicApi.post(
        '/auth/send-otp',
        form
      )

      alert(res.data.message)

      localStorage.setItem(
        'registrationEmail',
        form.email
      )

      localStorage.setItem(
        'registrationRollNo',
        form.rollNo
      )

      navigate('/verify-otp')

    } catch (err) {

      console.log(err)

      alert(
        err.response?.data?.message ||
        'Failed to send OTP'
      )

    } finally {
      setLoading(false)
    }

  }

  return (
    <div>

      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">

        <div className="col-11 col-sm-8 col-md-6 col-lg-4">

          {/* BACK */}
          <div className='fixed-top m-4 p-0'>

            <svg onClick={() => navigate('/')} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
            </svg>

          </div>

          <div
            className="card border-0 rounded-4"
          >

            <div className="card-body p-4">

              <div className="text-center mb-4">

                <div className="fw-bold mb-1">
                  <img src={logo} alt="" srcset="" style={{ height: '30px' }} />
                </div>

                <p className="text-muted mb-0">
                  Create your hostel account
                </p>

              </div>

              <form onSubmit={handleSendOtp}>

                {/* Roll Number */}

                <div className="form-floating mb-3">

                  <input
                    type="text"
                    required
                    className="form-control rounded-3"
                    id="rollNo"
                    placeholder="University Roll Number"
                    value={form.rollNo}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        rollNo: e.target.value
                      })
                    }
                  />

                  <label htmlFor="rollNo">
                    University Roll Number
                  </label>

                </div>

                {/* Email */}

                <div className="form-floating mb-2">

                  <input
                    type="email"
                    required
                    className="form-control rounded-3"
                    id="email"
                    placeholder="Hostel Approved Email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value
                      })
                    }
                  />

                  <label htmlFor="email">
                    Hostel Approved Email
                  </label>

                </div>

                <small className="text-muted d-block mb-4">
                  Enter the email approved by hostel administration.
                </small>

                <button
                  type="submit"
                  className="btn bg-official text-white w-100 rounded-3 py-2 fw-semibold"
                  disabled={loading}
                >

                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>

                      Sending OTP...
                    </>
                  ) : (
                    'Send OTP'
                  )}

                </button>

              </form>

              <div className="text-center mt-3">

                <button
                  className='btn color-official btn-outline-official w-100 rounded-3 py-2 fw-semibold'
                  onClick={() => navigate('/login')}
                >
                  I already have my account
                </button>

              </div>

            </div>

          </div>

          {/* FOOTER */}
          <small className='fixed-bottom text-center m-4 p-0'>
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

export default Register