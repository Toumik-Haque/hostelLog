import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import publicApi from '../api/publicApi'
import logo from '../assets/textlogo.png'

function Home() {

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">

      <div className="col-11 col-sm-8 col-md-6 col-lg-4">

        {/* LOGO + TITLE */}
        <div className="card border-0 rounded-4">

          <div className="card-body p-4">

            <div className="text-center mb-4">

              <div className="fw-bold mb-1">
                <img src={logo} alt="" srcset="" style={{ height: '30px' }} />
              </div>

              <p className="text-muted mb-0">
                Hostel Management System
              </p>

            </div>

            <button
                className="btn bg-official text-white w-100 rounded-3 py-2 fw-semibold"
                onClick={() => navigate('/login')}
              >
                Login
              </button>

            <div className="text-center mt-3">

              <button
                className="btn btn-outline-official color-official w-100 rounded-3 py-2 fw-semibold"
                onClick={() => navigate('/admin-login')}
              >
                Hostel Authority
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

  )
}

export default Home
