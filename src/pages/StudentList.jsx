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
            return 'border-0 card1 rounded-4'
        }

        if (status === 'ABSENT') {
            return 'border-0 red-card rounded-4'
        }

        return 'border-0 rounded-4'
    }

    const getBadge = (status) => {

        if (status === 'PRESENT') {
            return 'bg-white color-official border border-official rounded-4'
        }

        if (status === 'ABSENT') {
            return 'bg-white text-danger border border-danger rounded-4'
        }

        return 'bg-secondary'
    }

    return (

        <div>

            {/* Main Page */}
            <div
                className="d-flex flex-column pt-4"
                style={{ height: '73.5vh' }}
            >

                {/* Search */}
                <div className="position-sticky mx-4">

                    <input
                        type="text"
                        className="bg-search form-control mb-3 px-3 py-2 rounded-5"
                        placeholder="Search by name or room number..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    
                        <div className="d-flex gap-2 mb-3 overflow-auto flex-nowrap hide-scrollbar">

                            <button
                                className={`btn btn-sm flex-shrink-0 ${filter === 'ALL' ? 'btn rounded-5 px-3 btn-official' : 'btn-outline-secondary rounded-5 px-3'}`}
                                onClick={() => setFilter('ALL')}
                            >
                                All
                            </button>

                            <button
                                className={`btn btn-sm flex-shrink-0 ${filter === 'VEG' ? 'btn rounded-5 btn-official' : 'btn-outline-secondary rounded-5'}`}
                                onClick={() => setFilter('VEG')}
                            >
                                Pure Veg
                            </button>

                            <button
                                className={`btn btn-sm flex-shrink-0 ${filter === 'CHICKEN' ? 'btn rounded-5 btn-official' : 'btn-outline-secondary rounded-5'}`}
                                onClick={() => setFilter('CHICKEN')}
                            >
                                No Chicken
                            </button>

                            <button
                                className={`btn btn-sm flex-shrink-0 ${filter === 'FISH' ? 'btn rounded-5 btn-official' : 'btn-outline-secondary rounded-5'}`}
                                onClick={() => setFilter('FISH')}
                            >
                                No Fish
                            </button>

                            <button
                                className={`btn btn-sm flex-shrink-0 ${filter === 'EGG' ? 'btn rounded-5 btn-official' : 'btn-outline-secondary rounded-5'}`}
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

        </div>

    )
}