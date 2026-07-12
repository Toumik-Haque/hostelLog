import { useEffect, useState } from 'react'
import studentApi from '../api/studentApi'

export default function StudentHostelStatus({
  stats,
  user,
  fetchingData,
}) {

  const [loading, setLoading] = useState(false)

  const toggleStatus = async () => {

    try {

      setLoading(true)
      const token = localStorage.getItem('token')

      const res = await studentApi.put('/hostel/toggle-status',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      // console.log(res.data)

      // update UI instantly
      // setUser({
      //   ...user,
      //   hostelStatus: res.data.hostelStatus,
      //   lastStatusChange: res.data.lastStatusChange
      // })

      await fetchingData()


    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }

  }

  if (!stats || !user) {
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

    <div className='h-100 overflow-auto py-3 hide-scrollbar '>

      {/* STUDENT STATUS MANAGE */}
      <div className="card border-0 shadow-sm mb-3 mx-4 rounded-4">

        <div className='card-body'>

          {user.hostelStatus === 'IN' ?
            <p className='green-info d-flex align-items-center gap-2'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
              </svg>
              Allowed to take next meals
            </p>
            : <p className='red-info d-flex align-items-center gap-2'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
              </svg>
              Not allowed to take next meals
            </p>
          }

          <div className='d-flex flex-column gap-3'>

            <div className='d-flex flex-column align-items-center'>

              <div className='d-flex gap-1'>

                <h5 className='m-0'>You're</h5>

                <h5
                  className={`fw-bold m-0
                    ${user.hostelStatus === 'IN'
                      ? 'color-official'
                      : 'text-danger'
                    }
                  `}
                >
                  {user.hostelStatus === 'IN'
                    ? 'PRESENT'
                    : 'ABSENT'
                  }
                </h5>

              </div>

              <small className="text-muted block d-flex gap-1">
                {user.lastStatusChange
                  ? <span className='m-0 text-muted'>From</span>
                  : null}

                {user.lastStatusChange
                  ? new Date(
                    user.lastStatusChange
                  ).toLocaleString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                  })
                  : 'Mark PRESENT, if needed 👇'}
              </small>

            </div>

            {/* Mark Button */}
            <button
              className={`w-100 btn shadow-sm rounded-5
              ${user.hostelStatus === 'IN'
                  ? 'border-danger text-danger'
                  : 'border-official color-official'}
            `}
              onClick={toggleStatus}
              disabled={loading}
            >

              {loading ?
                <p className='m-0'>
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

        </div>

      </div>

      {/* HOSTEL STATUS CARDS */}
      <div className='px-4 d-flex flex-column gap-3'>

        {/* PRESENT CARD */}
        <div className="card border-0 shadow-sm rounded-4">

          <div className="card-body d-flex">
            <div className='w-50 d-flex flex-column align-items-center justify-content-center'>

              <p className='color-official fs-1 fw-bold m-0'>
                {stats.presentNow.totalPresentNow}
              </p>
              <p className='fw-medium m-0'>Present Now</p>

            </div>

            <div className='w-50 d-flex flex-column gap-1'>

              <p className="m-0 badge p-2 bg-official">Pure Veg: {stats.presentNow.totalVegPresentNow}</p>
              <p className="m-0 badge p-2 bg-official">No Chicken: {stats.presentNow.totalDontEatChickenPresentNow}</p>
              <p className="m-0 badge p-2 bg-official">No Fish: {stats.presentNow.totalDontEatFishPresentNow}</p>
              <p className="m-0 badge p-2 bg-official">No Egg: {stats.presentNow.totalDontEatEggPresentNow}</p>

            </div>
          </div>

        </div>

        {/* TOTAL UNREGISTERED */}
        <div className='d-flex justify-content-between'>

          <div className='d-flex flex-column'>
            <div className='d-flex gap-2 align-items-center'>
              <p className='m-0 fs-5 fw-medium'>UNREGISTERED</p>
            </div>
            <small className='text-muted'>Have no <small>hostelLog</small> account</small>
          </div>

          <div className=''>
            <span className=' border border-secondary bg-white px-4 p-2 text-danger rounded-3 badge '>
              {stats.unregisteredNow.unregisteredStudents}
            </span>
          </div>

        </div>

        {/* TOTAL STUDENTS CARD*/}
        <div className="card card2 border-0 shadow-sm rounded-4">

          <div className="card-body d-flex">

            <div className='w-50 d-flex flex-column gap-1'>

              <p className="m-0 badge p-2 border border-white">Pure Veg: {stats.total.totalVegStudents}</p>
              <p className="m-0 badge p-2 border border-white">No Chicken: {stats.total.totalDontEatChickenStudents}</p>
              <p className="m-0 badge p-2 border border-white">No Fish: {stats.total.totalDontEatFishStudents}</p>
              <p className="m-0 badge p-2 border border-white">No Egg: {stats.total.totalDontEatEggStudents}</p>

            </div>

            <div className='w-50 d-flex flex-column align-items-center justify-content-center'>

              <p className='fw-medium m-0'>Total Hostellers</p>
              <p className='color-official fs-1 fw-bold m-0'>
                {stats.total.totalStudents}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  )
}