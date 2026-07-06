import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import studentApi from '../api/studentApi'

export default function StudentList() {

    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('ALL')

    const [markActive, setMarkActive] = useState(false)
    const [markedStudents, setMarkedStudents] = useState({})

    const navigate = useNavigate()

    const [students, setStudents] = useState([])

    const showMark = () => {
        setMarkActive(true)
        localStorage.setItem(
            "markActive",
            JSON.stringify(true)
        )
    }

    const hideMark = () => {
        setMarkActive(false)
        localStorage.removeItem("markActive")
        setMarkedStudents({})
        localStorage.removeItem("markedStudents")
    }

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

        const savedMarkActive = JSON.parse(
            localStorage.getItem("markActive") || 'false'
        )

        setMarkActive(savedMarkActive)

        const savedMarks = JSON.parse(
            localStorage.getItem("markedStudents") || "{}"
        )

        setMarkedStudents(savedMarks)

    }, [])

    const toggleMark = (studentId) => {

        // copy previously existed in markedStudent to updatedMarks
        const updatedMarks = {
            ...markedStudents
        }

        // check is in updatedMarks or not
        if (updatedMarks[studentId]) {

            // if in, remove it
            delete updatedMarks[studentId]

        } else {

            // if not in, add it
            updatedMarks[studentId] = true

        }

        // change markedStudents with updatedMarks
        setMarkedStudents(updatedMarks)

        // store updatedMarks as string to local-storage in 'markedStudents' key
        localStorage.setItem(
            "markedStudents",
            JSON.stringify(updatedMarks)
        )

    }

    const getCardClass = (status) => {

        if (status === 'PRESENT') {
            return ''
        }

        if (status === 'ABSENT') {
            return ''
        }

        return ''
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

            {/* Search + markActive btn */}
            <div className="sticky-top mx-4 mb-3 d-flex gap-2">

                {/* Search */}
                <div className="position-relative flex-grow-1">

                    <input
                        type="text"
                        className={`form-control shadow-sm px-3 py-2 rounded-0
                            ${search && ('ps-5')}
                        `}
                        placeholder="Search by room no. or name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {search && (
                        <button
                            type="button"
                            className="btn border-0 position-absolute top-50  translate-middle-y ms-3 p-0"
                            onClick={() => setSearch("")}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-x-circle-fill text-secondary" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                            </svg>
                        </button>
                    )}

                </div>

                {markActive === true ?
                    <button className='btn bg-dark rounded text-white shadow-sm' onClick={hideMark}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                        </svg>
                    </button>
                    : <button className='btn bg-official rounded text-white shadow-sm' onClick={showMark}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-toggles" viewBox="0 0 16 16">
                            <path d="M4.5 9a3.5 3.5 0 1 0 0 7h7a3.5 3.5 0 1 0 0-7zm7 6a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m-7-14a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5m2.45 0A3.5 3.5 0 0 1 8 3.5 3.5 3.5 0 0 1 6.95 6h4.55a2.5 2.5 0 0 0 0-5zM4.5 0h7a3.5 3.5 0 1 1 0 7h-7a3.5 3.5 0 1 1 0-7" />
                        </svg>
                    </button>
                }

            </div>

            {/* Scrollable Part */}
            <div
                className="flex-grow-1 overflow-auto px-4 pb-3 hide-scrollbar"
            >
                {/* Filter Buttons */}
                <div className="d-flex gap-2 mb-3 overflow-auto flex-nowrap hide-scrollbar">

                    <button
                        className={`btn btn-sm flex-shrink-0 ${filter === 'ALL' ? 'btn rounded-5 px-3 activeTab btn-outline-official' : 'btn-outline-secondary rounded-5 px-3'}`}
                        onClick={() => setFilter('ALL')}
                    >
                        All
                    </button>

                    <button
                        className={`btn btn-sm flex-shrink-0 ${filter === 'VEG' ? 'btn rounded-5 activeTab btn-outline-official' : 'btn-outline-secondary rounded-5'}`}
                        onClick={() => setFilter('VEG')}
                    >
                        Pure Veg
                    </button>

                    <button
                        className={`btn btn-sm flex-shrink-0 ${filter === 'CHICKEN' ? 'btn rounded-5 activeTab btn-outline-official' : 'btn-outline-secondary rounded-5'}`}
                        onClick={() => setFilter('CHICKEN')}
                    >
                        No Chicken
                    </button>

                    <button
                        className={`btn btn-sm flex-shrink-0 ${filter === 'FISH' ? 'btn rounded-5 activeTab btn-outline-official' : 'btn-outline-secondary rounded-5'}`}
                        onClick={() => setFilter('FISH')}
                    >
                        No Fish
                    </button>

                    <button
                        className={`btn btn-sm flex-shrink-0 flex-shrink-0 ${filter === 'EGG' ? 'btn rounded-5 activeTab btn-outline-official' : 'btn-outline-secondary rounded-5'}`}
                        onClick={() => setFilter('EGG')}
                    >
                        No Egg
                    </button>

                    <button
                        className={`btn btn-sm flex-shrink-0 ${filter === 'PRESENT' ? 'btn rounded-5 activeTab btn-outline-official' : 'btn-outline-secondary rounded-5'}`}
                        onClick={() => setFilter('PRESENT')}
                    >
                        Present
                    </button>

                    <button
                        className={`btn btn-sm flex-shrink-0 ${filter === 'ABSENT' ? 'btn rounded-5 activeTab btn-outline-official' : 'btn-outline-secondary rounded-5'}`}
                        onClick={() => setFilter('ABSENT')}
                    >
                        Absent
                    </button>

                    <button
                        className={`btn btn-sm flex-shrink-0 ${filter === 'UNREGISTERED' ? 'btn rounded-5 activeTab btn-outline-official' : 'btn-outline-secondary rounded-5'}`}
                        onClick={() => setFilter('UNREGISTERED')}
                    >
                        Unregistered
                    </button>

                </div>

                {/* Students List */}
                {(students.length === 0)
                    ? <div className='container px-4 py-3'>
                        <p className='text-center'>
                            <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                            ></span>
                        </p>
                    </div>
                    : <div className="row g-3">

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
                                        className={`card shadow-sm border-0 rounded-4
                                        ${getCardClass(s.status)}
                                        ${markedStudents[s.id] && ('card2')}
                                    `}
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

                                                    <p className={`m-0 d-flex gap-1 border-bottom
                                                        ${markedStudents[s.id] ?
                                                            'color-official border-official'
                                                            : 'text-muted border-secondary'
                                                        }
                                                    `}>

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

                                                    <div className='d-flex justify-content-between'>
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


                                                        <div className={`d-flex justify-content-end
                                                        ${s.status === 'UNREGISTERED' && ('w-100')}
                                                    `}>
                                                            {markActive === true ?

                                                                <div style={{ cursor: "pointer" }} onClick={() => toggleMark(s.id)}>
                                                                    {markedStudents[s.id] ?
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="color-official bi bi-toggle-on" viewBox="0 0 16 16">
                                                                            <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8" />
                                                                        </svg>
                                                                        : <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="color-official bi bi-toggle-off" viewBox="0 0 16 16">
                                                                            <path d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5" />
                                                                        </svg>
                                                                    }
                                                                </div>

                                                                : null
                                                            }
                                                        </div>
                                                    </div>

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

                            ))
                        }

                    </div>
                }

            </div>

        </div >

    )
}