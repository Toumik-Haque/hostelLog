import { useEffect, useState } from 'react'
import axios from 'axios'
import studentApi from '../api/studentApi'

export default function StudentHostelStatus() {

  const [stats, setStats] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  // ------------------------
  // FETCH STATS
  // ------------------------
  const fetchStats = async () => {
    try {

      const res = await studentApi.get(
        '/hostel/stats'
      )

      setStats(res.data)

    } catch (err) {
      console.log(err)
    }
  }

  // ------------------------
  // FETCH USER
  // ------------------------
  const fetchUser = async () => {
    try {

      const token =
        localStorage.getItem('token')

      const res = await studentApi.get('/auth/me')

      setUser(res.data.user)

      console.log(res.data)

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchStats()
    fetchUser()
  }, [])

  // ------------------------
  // TOGGLE STATUS
  // ------------------------
  const toggleStatus = async () => {

    try {

      setLoading(true)

      const token =
        localStorage.getItem('token')

      const res = await studentApi.put(
        '/hostel/toggle-status',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      console.log(res.data)

      // update UI instantly
      setUser({
        ...user,
        hostelStatus: res.data.hostelStatus,
        lastStatusChange: res.data.lastStatusChange
      })

      fetchStats()

    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }

  }

  if (!stats || !user) {
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

    <div>

      {/* STUDENT STATUS MANAGE */}
      <div className="mb-4 mx-4">

        <div className="d-flex justify-content-between mb-3">

          <div>

            <small className="text-muted block">
              From {' '}
              {user.lastStatusChange
                ? new Date(
                  user.lastStatusChange
                ).toLocaleString()
                : 'N/A'}
            </small>

            <div className=' outline-2  d-flex justify-content-cente gap-2 align-items-center'>

              <h5>You're</h5>

              <h5
                className='color-official fw-bold'
              >
                {user.hostelStatus === 'IN'
                  ? 'PRESENT'
                  : 'ABSENT'
                }
              </h5>

            </div>

          </div>

          {/* Mark Button */}
          <button
            className={
              user.hostelStatus === 'IN'
                ? 'btn btn-dange border text-danger'
                : 'btn border text-success'
            }
            onClick={toggleStatus}
            disabled={loading}
          >

            {loading ?
              <p className='text-muted m-0'>
                Updating...
                <span
                  className="spinner-border spinner-border-sm ms-2"
                  role="status"
                ></span>
              </p>
              : user.hostelStatus === 'IN'
                ? 'Mark Absent'
                : 'Mark Present'
            }

          </button>

        </div>

        <p className={`d-flex align-items-center justify-content-center gap-2
            ${user.hostelStatus === 'IN'
            ? 'green-info rounded p-2'
            : 'red-info rounded-5 p-2'}
          `}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
          </svg>

          {user.hostelStatus === 'IN'
            ? 'Allowed to take next meals'
            : 'Not allowed to take next meals'
          }
        </p>

      </div>

      {/* HOSTEL STATUS CARDS */}
      {!stats ? (

        <div className='container px-4'>
          <p className='text-center'>
            <i>Loading...</i>
            <span
              className="spinner-border spinner-border-sm ms-2"
              role="status"
            ></span>
          </p>
        </div>

      ) : (

        <div className='px-4'>

          {/* PRESENT CARD */}
          <div className="card mb-3 border-0 card1 rounded-4">

            <div className="card-body">

              <h5 className='d-flex justify-content-between'>
                <span className=''>Present Now</span>
                <span className='bg-white text-dark border border-dark rounded-4 px-3 badge'>
                  {stats.presentNow.totalPresentNow}
                </span>
              </h5>

              <p className="mb-1">
                Pure Veg:
                {' '}
                {stats.presentNow.totalVegPresentNow}
              </p>

              <p className="mb-1">
                Don't Eat Chicken:
                {' '}
                {stats.presentNow.totalDontEatChickenPresentNow}
              </p>

              <p className="mb-1">
                Don't Eat Fish:
                {' '}
                {stats.presentNow.totalDontEatFishPresentNow}
              </p>

              <p className="mb-1">
                Don't Eat Egg:
                {' '}
                {stats.presentNow.totalDontEatEggPresentNow}
              </p>

            </div>

          </div>

          {/* TOTAL STUDENTS */}
          <div className="card border-0 card2 rounded-4">

            <div className="card-body">

              <h5 className='d-flex justify-content-between'>
                <span className=''>Hostel Students</span>
                <span className='bg-white text-dark border border-dark rounded-4 px-3 badge'>
                  {stats.total.totalStudents}
                </span>
              </h5>

              <p className="mb-1">
                Pure Veg:
                {' '}
                {stats.total.totalVegStudents}
              </p>

              <p className="mb-0">
                Don't Eat Chicken:
                {' '}
                {stats.total.totalDontEatChickenStudents}
              </p>

              <p className="mb-1">
                Don't Eat Fish:
                {' '}
                {stats.total.totalDontEatFishStudents}
              </p>

              <p className="mb-1">
                Don't Eat Egg:
                {' '}
                {stats.total.totalDontEatEggStudents}
              </p>

            </div>

          </div>

          {/* TOTAL UNREGISTERED */}
          <div className="card border-0 card-3">

            <div className="card-body">

              <div className='d-flex justify-content-between'>

                <div className='d-flex flex-column'>
                  <h5 className='mb-1'>Still UNREGISTERED</h5>
                  <small >Who have no data here</small>
                </div>

                <div>
                  <span className='bg-white text-dark border border-dark rounded-4 px-3 badge '>
                    {stats.unregisteredNow.unregisteredStudents}
                  </span>
                </div>

              </div>



            </div>

          </div>

        </div>

      )}

    </div>

  )
}