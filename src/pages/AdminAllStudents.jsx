import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import adminApi from '../api/adminApi'

export default function AdminAllStudents() {

    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('ALL')

    const navigate = useNavigate()
    const [students, setStudents] = useState([])

    const fetchData = async () => {
        try {

            const res = await adminApi.get(
                '/admin/students-view'
            )

            setStudents(res.data)

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const getCardClass = (status) => {

        if (status === 'PRESENT') {
            return 'border-success'
        }

        if (status === 'ABSENT') {
            return 'border-danger'
        }

        return 'border-secondary'
    }

    const getBadge = (status) => {

        if (status === 'PRESENT') {
            return 'bg-success'
        }

        if (status === 'ABSENT') {
            return 'bg-danger'
        }

        return 'bg-secondary'
    }

    const handleLogout = () => {

        localStorage.removeItem('adminToken')

        navigate('/admin-login')
    }

    return (

        <div>

            {/* Main Page */}
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

                {/* Back Button */}
                <div className='mx-4 mb-3'>
                    <button className='btn p-0' onClick={() => navigate(`/admin`)}>

                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                        </svg>

                    </button>
                </div>

                {/* Search */}
                <div className="mx-4 mb-2">

                    <input
                        type="text"
                        className="form-control mb-3 px-3 py-2 rounded-5"
                        placeholder="Search by name or room number..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className="d-flex gap-2 mb-3 overflow-auto flex-nowrap hide-scrollbar">

                        <button
                            className={`btn btn-sm flex-shrink-0 ${filter === 'ALL' ? 'btn-primary rounded-5 px-3' : 'btn-outline-dark rounded-5 px-3'}`}
                            onClick={() => setFilter('ALL')}
                        >
                            All
                        </button>

                        <button
                            className={`btn btn-sm flex-shrink-0 ${filter === 'VEG' ? 'btn-primary rounded-5' : 'btn-outline-dark rounded-5'}`}
                            onClick={() => setFilter('VEG')}
                        >
                            Pure Veg
                        </button>

                        <button
                            className={`btn btn-sm flex-shrink-0 ${filter === 'CHICKEN' ? 'btn-primary rounded-5' : 'btn-outline-dark rounded-5'}`}
                            onClick={() => setFilter('CHICKEN')}
                        >
                            No Chicken
                        </button>

                        <button
                            className={`btn btn-sm flex-shrink-0 ${filter === 'FISH' ? 'btn-primary rounded-5' : 'btn-outline-dark rounded-5'}`}
                            onClick={() => setFilter('FISH')}
                        >
                            No Fish
                        </button>

                        <button
                            className={`btn btn-sm flex-shrink-0 ${filter === 'EGG' ? 'btn-primary rounded-5' : 'btn-outline-dark rounded-5'}`}
                            onClick={() => setFilter('EGG')}
                        >
                            No Egg
                        </button>



                    </div>

                </div>

                {/* Scrollable Student List */}
                <div
                    className="flex-grow-1 overflow-auto px-4 py-3 hide-scrollbar"
                >

                    <div className="row g-3">

                        {students
                            .filter(s => {

                                const matchesSearch =
                                    s.name?.toLowerCase().includes(search.toLowerCase()) ||
                                    String(s.roomNo || '')
                                        .toLowerCase()
                                        .includes(search.toLowerCase())

                                let matchesFilter = true

                                if (filter === 'VEG') {
                                    matchesFilter =
                                        s.foodPreference === 'Veg'
                                }

                                if (filter === 'CHICKEN') {
                                    matchesFilter =
                                        s.dontEat?.includes('Chicken')
                                }

                                if (filter === 'FISH') {
                                    matchesFilter =
                                        s.dontEat?.includes('Fish')
                                }

                                if (filter === 'EGG') {
                                    matchesFilter =
                                        s.dontEat?.includes('Egg')
                                }

                                return matchesSearch && matchesFilter

                            })
                            .map(s => (

                                <div
                                    key={s.id}
                                    className="col-12"
                                >

                                    <div
                                        className={`card shadow-sm ${getCardClass(s.status)}`}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() =>
                                            navigate(`/admin/student/${s.id}`)
                                        }
                                    >

                                        <div className="card-body">

                                            <div className="d-fle justify-content-between">



                                                <div className='d-flex w-100 gap-2 mb-2'>



                                                    <div>
                                                        <span
                                                            className={`badge ${getBadge(s.status)}`}
                                                        >
                                                            {s.status}
                                                        </span>
                                                    </div>

                                                    <p className="m-0 d-flex gap-1 border-bottom pb- border-dark">

                                                        {s.lastStatusChange
                                                            ? <span className='m-0 text-muted'>from</span>
                                                            : null}

                                                        {s.lastStatusChange
                                                            ? new Date(
                                                                s.lastStatusChange
                                                            ).toLocaleString('en-IN', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: '2-digit'
                                                            })
                                                            : null}
                                                    </p>

                                                </div>

                                                <div>

                                                    <h5>{s.name}</h5>

                                                    {s.status === 'UNREGISTERED'
                                                        ? null
                                                        : <div>
                                                            <p className="mb-1">
                                                                Room: {s.roomNo}
                                                            </p>

                                                            <p className='mb-1'>
                                                                Mobile: {s.mobile}
                                                            </p>
                                                        </div>}

                                                    {s.foodPreference === 'Veg' && (
                                                        <p className='mb-1'>
                                                            Food Preference: Pure Veg
                                                        </p>
                                                    )}

                                                    {s.dontEat?.length > 0 && (
                                                        <p className='mb-1'>
                                                            Don't Eat: {s.dontEat.join(', ')}
                                                        </p>
                                                    )}

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            ))}

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