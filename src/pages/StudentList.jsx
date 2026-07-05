import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import studentApi from '../api/studentApi'

export default function StudentList() {

    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('ALL')

    const navigate = useNavigate()
    const [students, setStudents] = useState([])

    const fetchData = async () => {
        try {

            const res = await studentApi.get(
                '/student/students-view'
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
            return 'border-0 card rounded-4'
        }

        if (status === 'ABSENT') {
            return 'border-0 re-card rounded-4'
        }

        return 'border-0 rounded-4'
    }

    const getBadge = (status) => {

        if (status === 'PRESENT') {
            return 'bg-official rounded-4'
        }

        if (status === 'ABSENT') {
            return 'bg-danger  rounded-4'
        }

        return 'bg-secondary'
    }

    return (

        <div
            className="d-flex flex-column h-100 pt-3"
        >

            {/* Search */}
            <div className="sticky-top mx-4 mb-3 rounded-5">

                <input
                    type="text"
                    className="form-control shadow-sm px-3 py-2 rounded-5"
                    placeholder="Search by room number or name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>

            {/* Scrollable Student List */}
            <div
                className="flex-grow-1 overflow-auto px-4 pb-3 hide-scrollbar"
            >
                {/* Filter Buttons */}
                <div className="d-flex gap-2 mb-3 overflow-auto flex-nowrap hide-scrollbar">

                    <button
                        className={`btn btn-sm flex-shrink-0 ${filter === 'ALL' ? 'btn rounded-5 px-3 activeTab' : 'btn-outline-secondary rounded-5 px-3'}`}
                        onClick={() => setFilter('ALL')}
                    >
                        All
                    </button>

                    <button
                        className={`btn btn-sm flex-shrink-0 ${filter === 'VEG' ? 'btn rounded-5 activeTab' : 'btn-outline-secondary rounded-5'}`}
                        onClick={() => setFilter('VEG')}
                    >
                        Pure Veg
                    </button>

                    <button
                        className={`btn btn-sm flex-shrink-0 ${filter === 'CHICKEN' ? 'btn rounded-5 activeTab' : 'btn-outline-secondary rounded-5'}`}
                        onClick={() => setFilter('CHICKEN')}
                    >
                        No Chicken
                    </button>

                    <button
                        className={`btn btn-sm flex-shrink-0 ${filter === 'FISH' ? 'btn rounded-5 activeTab' : 'btn-outline-secondary rounded-5'}`}
                        onClick={() => setFilter('FISH')}
                    >
                        No Fish
                    </button>

                    <button
                        className={`btn btn-sm flex-shrink-0 flex-shrink-0 ${filter === 'EGG' ? 'btn rounded-5 activeTab' : 'btn-outline-secondary rounded-5'}`}
                        onClick={() => setFilter('EGG')}
                    >
                        No Egg
                    </button>

                    <button
                        className={`btn btn-sm flex-shrink-0 ${filter === 'PRESENT' ? 'btn rounded-5 activeTab' : 'btn-outline-secondary rounded-5'}`}
                        onClick={() => setFilter('PRESENT')}
                    >
                        Present
                    </button>

                    <button
                        className={`btn btn-sm flex-shrink-0 ${filter === 'ABSENT' ? 'btn rounded-5 activeTab' : 'btn-outline-secondary rounded-5'}`}
                        onClick={() => setFilter('ABSENT')}
                    >
                        Absent
                    </button>

                    <button
                        className={`btn btn-sm flex-shrink-0 ${filter === 'UNREGISTERED' ? 'btn rounded-5 activeTab' : 'btn-outline-secondary rounded-5'}`}
                        onClick={() => setFilter('UNREGISTERED')}
                    >
                        Unregistered
                    </button>

                </div>

                {/* Students List */}
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

                            if (filter === 'PRESENT') {
                                matchesFilter = s.status === 'PRESENT'
                            }

                            if (filter === 'ABSENT') {
                                matchesFilter = s.status === 'ABSENT'
                            }

                            if (filter === 'UNREGISTERED') {
                                matchesFilter = s.status === 'UNREGISTERED'
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

                                                <p className="m-0 d-flex gap-1 text-muted border-bottom border-secondary">

                                                    {s.lastStatusChange
                                                        ? <span >from</span>
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
                                                    : <div className='d-flex gap-3'>
                                                        <p className='mb-1 d-flex gap-1 align-items-center'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" className="color-official bi bi-telephone-fill" viewBox="0 0 16 16">
                                                                <path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                                                            </svg>
                                                            {s.mobile}
                                                        </p>
                                                        <p className="mb-1">
                                                            Room: {s.roomNo}
                                                        </p>
                                                    </div>
                                                }

                                                {s.foodPreference === 'Veg' && (
                                                    <p className='mb-1'>
                                                        Food Preference: Pure Veg
                                                    </p>
                                                )}

                                                {s.dontEat?.length > 0 && (
                                                    <p className='mb-1'>
                                                        Doesn't Eat: {s.dontEat.join(', ')}
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

        </div>

    )
}