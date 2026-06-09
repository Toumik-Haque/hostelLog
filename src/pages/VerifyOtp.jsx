import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import publicApi from '../api/publicApi'
import logo from '../assets/textlogo.png'

function VerifyOtp() {

  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState(
    ['', '', '', '', '', '']
  )

  const navigate = useNavigate()

  const email =
    localStorage.getItem(
      'registrationEmail'
    )

  const handleVerify = async () => {

    try {

      setLoading(true)

      const res = await publicApi.post(
        '/auth/verify-otp',
        {
          email,
          otp: otp.join('')
        }
      )

      console.log(res.data)

      navigate('/complete-profile')

    } catch (err) {

      console.log(err)

      alert(
        err.response?.data?.message ||
        'OTP verification failed'
      )

    } finally {
      setLoading(false)
    }


  }

  const handleOtpChange = (
    e,
    index
  ) => {

    const value =
      e.target.value.replace(
        /\D/g,
        ''
      )

    if (!value) return

    const newOtp = [...otp]

    newOtp[index] = value[0]

    setOtp(newOtp)

    if (
      index < 5 &&
      e.target.nextSibling
    ) {
      e.target.nextSibling.focus()
    }
  }

  const handleKeyDown = (
    e,
    index
  ) => {

    if (
      e.key === 'Backspace'
    ) {

      const newOtp = [...otp]

      if (otp[index]) {

        newOtp[index] = ''
        setOtp(newOtp)

      } else if (
        index > 0
      ) {

        e.target.previousSibling.focus()
      }
    }
  }

  return (

    <div className="container-fluid vh-100 d-flex align-items-cente mt-5 justify-content-center">

      <div className="col-11 col-sm-8 col-md-6 col-lg-4">

        {/* BACK BUTTON */}

        <div className="fixed-top m-4 p-0">

          <button
            className="btn p-0 border-0 bg-transparent"
            onClick={() => navigate('/register')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
            </svg>
          </button>

        </div>

        <div className="card border-0 rounded-4">

          <div className="card-body p-5">

            <div className="text-center mb-4">

              <div className="fw-bold mb-1">
                <img src={logo} alt="" srcset="" style={{ height: '30px' }} />
              </div>

              <p className="text-muted mb-0">
                Verify your email
              </p>

            </div>

            <div className="text-center mb-4">

              <small className="text-muted">
                We sent a 6-digit OTP to
              </small>

              <div className="fw-semibold">
                {email}
              </div>

            </div>

            <div className="d-flex justify-content-center gap-2 mb-4">

              {otp.map((digit, index) => (

                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) =>
                    handleOtpChange(
                      e,
                      index
                    )
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(
                      e,
                      index
                    )
                  }
                  className="form-control text-center fw-bold"
                  style={{
                    width: '40px',
                    height: '45px',
                    fontSize: '1.25rem'
                  }}
                />

              ))}

            </div>

            <button
              className="btn bg-official text-white w-100 rounded-3 py-2 fw-semibold"
              onClick={handleVerify}
              disabled={
                loading ||
                otp.join('').length !== 6
              }
            >

              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>

                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}

            </button>

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


  )
}

export default VerifyOtp
