import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import publicApi from '../api/publicApi'
import logo from '../assets/textlogo.png'

function Login() {

  const [rollNo, setRollNo] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/student", { replace: true });
    }
  }, [navigate]);

  const [showResetPassword, setShowResetPassword] = useState(false)

  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')

  const [forgotLoading, setForgotLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  const [step, setStep] = useState(1)
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const login = async (e) => {


    e.preventDefault()

    try {

      setLoading(true)

      const res = await publicApi.post(
        '/auth/login',
        {
          rollNo,
          password
        }
      )

      localStorage.setItem(
        'token',
        res.data.token
      )

      navigate('/student')

    } catch (err) {

      console.log(err)

      alert(
        err.response?.data?.message ||
        'Login Failed'
      )

    } finally {
      setLoading(false)
    }

  }

  const sendForgotOtp = async () => {

    if (!forgotEmail.trim()) {
      return alert(
        'Please enter your registered email'
      )
    }

    try {

      setForgotLoading(true)

      const res =
        await publicApi.post(
          '/auth/forgot-password/send-otp',
          {
            email: forgotEmail
          }
        )

      alert(res.data.message)

      setStep(2)

    } catch (err) {

      alert(
        err.response?.data?.message
      )

    } finally {

      setForgotLoading(false)

    }

  }

  const verifyForgotOtp = async () => {

    if (!otp.trim()) {
      return alert('Please enter OTP')
    }

    setVerifyLoading(true)

    try {

      const res =
        await publicApi.post(
          '/auth/forgot-password/verify-otp',
          {
            email: forgotEmail,
            otp
          }
        )

      alert(res.data.message)

      setStep(3)

    } catch (err) {

      alert(
        err.response?.data?.message ||
        'OTP verification failed'
      )

    } finally {

      setVerifyLoading(false)

    }

  }

  const resetForgotPassword = async () => {

    if (!newPassword.trim()) {
      return alert('Please enter new password')
    }

    if (!confirmPassword.trim()) {
      return alert('Please confirm password')
    }

    if (newPassword !== confirmPassword) {
      return alert('Passwords do not match')
    }

    setResetLoading(true)

    try {

      const res =
        await publicApi.put(
          '/auth/reset-password',
          {
            email: forgotEmail,
            newPassword,
            confirmPassword
          }
        )

      alert('Password reset successful. Please login.')

      resetForgotModal()

      setRollNo('')
      setPassword('')

    } catch (err) {

      alert(
        err.response?.data?.message
      )

    } finally {
      setResetLoading(false)
    }

  }

  const resetForgotModal = () => {

    setShowForgotModal(false)

    setStep(1)

    setForgotEmail('')
    setOtp('')
    setNewPassword('')
    setConfirmPassword('')

  }

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">

      <div className="col-11 col-sm-8 col-md-6 col-lg-4">

        {/* BACK */}
        <div className='fixed-top m-4 p-0'>

          <svg onClick={() => navigate('/')} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
          </svg>

        </div>

        {/* LOGO + TITLE */}
        <div className="card border-0 rounded-4">

          <div className="card-body p-4">

            <div className="text-center mb-4">

              <div className="fw-bold mb-1">
                <img src={logo} alt="" srcset="" style={{ height: '30px' }} />
              </div>

              <p className="text-muted mb-0">
                Login to your hostel account
              </p>

            </div>

            <form onSubmit={login}>

              {/* Roll Number */}

              <div className="form-floating mb-3">

                <input
                  type="text"
                  className="form-control rounded-3"
                  id="rollNo"
                  placeholder="University Roll Number"
                  value={rollNo}
                  onChange={(e) =>
                    setRollNo(e.target.value)
                  }
                  required
                />

                <label htmlFor="rollNo">
                  University Roll Number
                </label>

              </div>

              {/* Password */}

              <div className="input-group mb-3">

                <div className="form-floating">

                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    name="password"
                    id="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />

                  <label htmlFor="password">
                    Password
                  </label>

                </div>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword
                    ? 'Hide'
                    : 'Show'}
                </button>

              </div>

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

                    Logging in...
                  </>
                ) : (
                  'Login'
                )}

              </button>

            </form>

            {/* Forgot Password Button */}
            <div className="text-center mt-2">

              <button
                type="button"
                className="btn btn-link color-official text-decoration-none p-0"
                onClick={() => setShowForgotModal(true)}
              >
                Forgotten Password?
              </button>

            </div>

            {/* CREATE ACCOUNT BUTTON */}
            <div className="text-center mt-3">

              <button
                className="btn btn-outline-official color-official w-100 rounded-3 py-2 fw-semibold"
                onClick={() => navigate('/register')}
              >
                Create Hostel Account
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

        {showForgotModal && (

          <div
            className="modal d-block bg-dark bg-opacity-75"
            onClick={resetForgotModal}
          >

            <div
              className="modal-dialog"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="modal-content">

                <div className="modal-header">

                  <h5 className="modal-title color-official">
                    Reset Password
                  </h5>

                  <button
                    className="btn-close"
                    onClick={resetForgotModal}
                  />

                </div>

                <div className="modal-body">

                  {step === 1 && (

                    <div className="form-floating">

                      <input
                        type="email"
                        className="form-control"
                        value={forgotEmail}
                        onChange={(e) =>
                          setForgotEmail(
                            e.target.value
                          )
                        }
                        placeholder="Email"
                      />

                      <label>
                        Enter Registered Email
                      </label>

                    </div>

                  )}

                  {step === 2 && (

                    <div className="form-floating">

                      <input
                        type="number"
                        className="form-control"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value)
                        }
                        placeholder="OTP"
                      />

                      <label>
                        Enter OTP
                      </label>

                    </div>

                  )}

                  {step === 3 && (

                    <>
                      <div className="form-floating mb-3">

                        <input
                          type={
                            showResetPassword
                              ? 'text'
                              : 'password'
                          }
                          className="form-control"
                          value={newPassword}
                          onChange={(e) =>
                            setNewPassword(
                              e.target.value
                            )
                          }
                          placeholder="New Password"
                        />

                        <label>
                          New Password
                        </label>

                      </div>

                      <div className="form-floating">

                        <input
                          type={
                            showResetPassword
                              ? 'text'
                              : 'password'
                          }
                          className="form-control"
                          value={confirmPassword}
                          onChange={(e) =>
                            setConfirmPassword(
                              e.target.value
                            )
                          }
                          placeholder="Confirm Password"
                        />

                        <label>
                          Confirm New Password
                        </label>

                      </div>

                      <button
                        type="button"
                        className="btn btn-link color-official p-0 text-decoration-none"
                        onClick={() =>
                          setShowResetPassword(
                            !showResetPassword
                          )
                        }
                      >
                        {showResetPassword
                          ? 'Hide Passwords'
                          : 'Show Passwords'}
                      </button>
                    </>

                  )}

                </div>

                <div className="modal-footer">

                  {step === 1 && (
                    <button
                      className="btn bg-official text-white"
                      onClick={sendForgotOtp}
                      disabled={forgotLoading}
                    >
                      {forgotLoading ? 'Sending...' : 'Send OTP'}
                    </button>
                  )}

                  {step === 2 && (
                    <button
                      className="btn bg-official text-white"
                      onClick={verifyForgotOtp}
                      disabled={verifyLoading}
                    >
                      {verifyLoading
                        ? 'Verifying...'
                        : 'Verify OTP'}
                    </button>
                  )}

                  {step === 3 && (
                    <button
                      className="btn bg-official text-white"
                      onClick={resetForgotPassword}
                      disabled={resetLoading}
                    >
                      {resetLoading
                        ? 'Resetting...'
                        : 'Reset Password'}
                    </button>
                  )}

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  )
}

export default Login
