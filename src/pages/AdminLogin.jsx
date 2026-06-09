import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import adminApi from '../api/adminApi'
import logo from '../assets/textlogo.png'

export default function AdminLogin() {

  const [username, setUsername] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [showPassword,
    setShowPassword] =
    useState(false)

  const navigate = useNavigate()

  const login = async (e) => {

    e.preventDefault()

    try {

      setLoading(true)

      const res = await adminApi.post(
        '/admin-auth/login',
        {
          username,
          password
        }
      )

      localStorage.setItem(
        'adminToken',
        res.data.token
      )

      navigate('/admin')

    } catch (err) {

      console.log(err)

      alert(
        err.response?.data?.message ||
        'Login failed'
      )

    } finally {

      setLoading(false)

    }

  }

  return (

    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">

      <div className="col-11 col-sm-8 col-md-6 col-lg-4">

        {/* Back Button */}

        <div className="fixed-top m-4">

          <button
            className="btn p-0 border-0 bg-transparent"
            onClick={() => navigate('/')}
          >

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              className="bi bi-chevron-left"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
              />
            </svg>

          </button>

        </div>

        <div className="card border-0 rounded-4">

          <div className="card-body p-4">

            <div className="text-center mb-4">

              <div className="fw-bold mb-1">
                <img src={logo} alt="" srcset="" style={{ height: '30px' }} />
              </div>

              <p className="text-muted mb-0">
                Hostel Administration Login
              </p>

            </div>

            <form onSubmit={login}>

              {/* Username */}

              <div className="form-floating mb-3">

                <input
                  type="text"
                  required
                  className="form-control rounded-3"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) =>
                    setUsername(
                      e.target.value
                    )
                  }
                />

                <label htmlFor="username">
                  Username
                </label>

              </div>

              {/* Password */}

              <div className="input-group mb-4">

                <div className="form-floating">

                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    required
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
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
                className="btn btn-dark w-100 rounded-3 py-2 fw-semibold"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span
                      className="
                      spinner-border
                      spinner-border-sm
                      me-2
                    "
                    />

                    Logging in...
                  </>
                ) : (
                  'Login'
                )}

              </button>

            </form>

          </div>

        </div>

        {/* FOOTER */}
        <small className='fixed-bottom text-center m-4'>
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