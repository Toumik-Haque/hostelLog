import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import adminApi from '../api/adminApi'
import toast from "react-hot-toast"

export default function AdminAllStudents({
    students,
    fetchingData,
    setActiveTab,
    setSelectedStudentId,
}) {

    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('ALL')

    const isMounted = useRef(true)

    const [markActiveAdmin, setMarkActiveAdmin] = useState(false)
    const [selectedStudents, setSelectedStudents] = useState({})
    const [markedList, setMarkedList] = useState([])
    const [markAll, setMarkAll] = useState(false)

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    const [btnShow, setBtnShow] = useState(false)

    const [deleteModal, setDeleteModal] = useState(false)
    const [absentModal, setAbsentModal] = useState(false)
    const [presentModal, setPresentModal] = useState(false)

    const showMark = () => {
        setMarkActiveAdmin(true)
        localStorage.setItem("markActiveAdmin", JSON.stringify(true))
    }

    const hideMark = () => {
        setMarkActiveAdmin(false)
        localStorage.removeItem("markActiveAdmin")

        setSelectedStudents({})
        localStorage.removeItem("selectedStudents")
        setMarkedList([])
        localStorage.removeItem("markedList")
        setMarkAll(false)
        localStorage.removeItem("markAll")

        setBtnShow(false)
    }

    useEffect(() => {

        isMounted.current = true

        const toastId = toast.loading("Loading...", { toasterId: 'center' })

        const loadData = async () => {

            try {
                await fetchingData()
                toast.dismiss(toastId)

                // if (isMounted.current) {
                //     toast.success("Loaded!",
                //         {
                //             id: toastId,
                //             toasterId: 'center',
                //         }
                //     )
                // } else {
                //     toast.dismiss(toastId)
                // }

            } catch (err) {

                if (isMounted.current) {
                    toast.error("Failed!",
                        {
                            id: toastId,
                            toasterId: 'center',
                        }
                    )
                } else {
                    toast.dismiss(toastId)
                }
            }
        }

        loadData()

        return () => {
            isMounted.current = false
            // controller.abort(); // cancel fetch
            toast.dismiss(toastId)    // remove toast
        }

        console.log('Students data fetched')

        const savedMarkAll = JSON.parse(
            localStorage.getItem("markAll") || 'false'
        )

        setMarkAll(savedMarkAll)

        const savedMarkActiveAdmin = JSON.parse(
            localStorage.getItem("markActiveAdmin") || 'false'
        )

        setMarkActiveAdmin(savedMarkActiveAdmin)

        const savedMarks = JSON.parse(
            localStorage.getItem("selectedStudents") || "{}"
        )

        setSelectedStudents(savedMarks)

        const savedList = JSON.parse(
            localStorage.getItem("markedList") || "[]"
        )

        setMarkedList(savedList)

    }, [])

    const toggleMark = (studentId) => {

        // copy previously existed in markedStudent to updatedMarks
        const updatedMarks = {
            ...selectedStudents
        }

        // check is in updatedMarks or not
        if (updatedMarks[studentId]) {

            // if in, remove it
            delete updatedMarks[studentId]

            setMarkAll(false)
            localStorage.removeItem("markAll")

        } else {

            // if not in, add it
            updatedMarks[studentId] = true

            if (students.length === Object.keys(updatedMarks).length) {
                setMarkAll(true)
                localStorage.setItem("markAll", JSON.stringify(true));
            }

        }

        // change selectedStudents with updatedMarks
        setSelectedStudents(updatedMarks)

        // store updatedMarks as string to local-storage in 'selectedStudents' key
        localStorage.setItem(
            "selectedStudents",
            JSON.stringify(updatedMarks)
        )

    }

    const listManage = (student) => {

        // copy previously existed in markedStudent to updatedMarks
        let updatedList = [...markedList]

        // check is in updatedList or not
        const exists = updatedList.some(any =>
            any.id === student.id
        )

        if (exists) {

            // if in, remove it
            updatedList = updatedList.filter(any =>
                any.id !== student.id
            )

        } else {

            // if not in, add it
            updatedList.push(student)

        }
        console.log(updatedList)

        // change markedList with updatedList
        setMarkedList(updatedList)

        // store updatedList as string to local-storage in 'markedList' key
        localStorage.setItem(
            "markedList",
            JSON.stringify(updatedList)
        )

    }

    const toggleAllMark = () => {

        // check is selectedStudents not empty

        if (markAll) {

            setSelectedStudents({});
            localStorage.removeItem("selectedStudents");

            setMarkedList([]);
            localStorage.removeItem("markedList");

            setMarkAll(false);
            localStorage.removeItem("markAll");
        }
        else {
            const allMarked = {};
            const listItem = [];

            students.forEach((student) => {
                allMarked[student.id] = true;
                listItem.push(student);
            });

            setSelectedStudents(allMarked);
            localStorage.setItem("selectedStudents", JSON.stringify(allMarked));

            setMarkedList(listItem);
            localStorage.setItem("markedList", JSON.stringify(listItem));

            setMarkAll(true);
            localStorage.setItem("markAll", JSON.stringify(true));
        }
    }

    const deleteSelected = async () => {
        try {

            setLoading(true)

            const selected = Object.keys(selectedStudents);

            await Promise.all(
                selected.map((studentId) =>
                    adminApi.delete(`/admin/student/${studentId}`)
                )
            );

            await fetchingData()

            hideMark();
            setDeleteModal(false);
            toast.success("Deteted Permanently");

        } catch (err) {

            console.log(err);

            toast.err(err.response?.data?.message || "Delete Failed");

        } finally {
            setLoading(false)
        }
    }

    const absentSelected = async () => {
        try {
            setLoading(true)
            // const selected = Object.keys(markedList);
            const selected = [...markedList];

            await Promise.all(
                selected.filter((student) =>
                    student.hostelStatus === 'IN').map(async (student) => {
                        const res = await adminApi.put(`hostel/toggle-status/${student.id}`,
                            {}
                        )
                        return res.data;
                    }
                    )
            );

            await fetchingData();

            hideMark();
            setAbsentModal(false);
            toast.success("Marked Successfully");
        } catch (err) {

            console.log(err);

            toast.err(err.response?.data?.message || "Marking Failed");

        } finally {
            setLoading(false)
        }
    }

    const presentSelected = async () => {
        try {
            setLoading(true)
            // const selected = Object.keys(markedList);
            const selected = [...markedList];

            await Promise.all(
                selected.filter((student) =>
                    student.hostelStatus === 'OUT').map(async (student) => {
                        const res = await adminApi.put(`hostel/toggle-status/${student.id}`,
                            {}
                        )
                        return res.data;
                    }
                    )
            );

            await fetchingData();

            hideMark();
            setPresentModal(false);
            toast.success("Marked Successfully");
        } catch (err) {

            console.log(err);

            toast.err(err.response?.data?.message || "Marking Failed");

        } finally {
            setLoading(false)
        }
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

        <div className="containerActive d-flex flex-column h-100 pt-3 position-relative">

            {/* Select All */}
            {markActiveAdmin && (
                <div className='position-fixed top-0 end-0 me-4 pt-3 mt-5 d-flex align-items-center gap-2 color-official'>
                    <span>Select All</span>
                    <div className='d-flex' style={{ cursor: 'pointer' }} onClick={toggleAllMark}>
                        {markAll ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-check-square-fill" viewBox="0 0 16 16">
                                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z" />
                            </svg>
                            : <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-square" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                            </svg>
                        }
                    </div>
                </div>
            )}

            {/* Search + markActiveAdmin btn */}
            <div className="search-box sticky-top mx-4 mb-3 d-flex gap-2">

                {/* Search */}
                {markActiveAdmin === true ?
                    <button className='btn bg-dark rounded-1 text-white shadow-sm' onClick={hideMark}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                        </svg>
                    </button>
                    : <button className='btn bg-official rounded-1 text-white shadow-sm' onClick={showMark}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check2-square" viewBox="0 0 16 16">
                            <path d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5z" />
                            <path d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0" />
                        </svg>
                    </button>
                }

                <div className="position-relative flex-grow-1">

                    <input
                        type="text"
                        className={`form-control shadow-sm py-2 rounded-0
                            ${search && ('pe-5')}
                        `}
                        placeholder="Search by room no. or name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {search && (
                        <button
                            type="button"
                            className="btn border-0 position-absolute top-50 end-0 translate-middle-y me-3 p-0"
                            onClick={() => setSearch("")}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-x-circle-fill text-secondary" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                            </svg>
                        </button>
                    )}

                </div>

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
                <div className={`row g-3 containerList
                        ${(Object.keys(selectedStudents).length !== 0) && (
                        'mb-5'
                    )}
                    `}>

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
                                        ${selectedStudents[s.id] && ('card2')}`}
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
                                                        ${selectedStudents[s.id] ?
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
                                                                    <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                                                                </svg>
                                                                {s.mobile}
                                                            </p>
                                                            <p className="mb-1">
                                                                Room: {s.roomNo}
                                                            </p>
                                                        </div>
                                                    }


                                                    <div className={`d-flex justify-content-end align-items-center gap-2
                                                        ${s.status === 'UNREGISTERED' && ('w-100')}
                                                        `}>
                                                        {/* Go to Stident Detail Page */}
                                                        <div className='d-flex' style={{ cursor: "pointer" }} onClick={() => {
                                                            setSelectedStudentId(s.id);
                                                            localStorage.setItem("studentId", (s.id))
                                                            setActiveTab("single");
                                                            localStorage.setItem("saveAdminTab", "single")
                                                        }}>

                                                            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="color-official bi bi-person-fill-gear" viewBox="0 0 16 16">
                                                                <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4m9.886-3.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
                                                            </svg>

                                                        </div>

                                                        {/* Select box */}
                                                        {markActiveAdmin ?

                                                            <div className='d-flex shadow-sm' style={{ cursor: "pointer" }} onClick={() => {
                                                                toggleMark(s.id);
                                                                listManage(s);
                                                            }}>
                                                                {selectedStudents[s.id] ?
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" className="color-official bi bi-check-square-fill" viewBox="0 0 16 16">
                                                                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z" />
                                                                    </svg>
                                                                    : <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" className="color-official bi bi-square" viewBox="0 0 16 16">
                                                                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
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

                    <div className='position-absolute start-0 bottom-0 mb-2 py-0'
                        style={{ width: "min-content" }}
                    >

                        {/* Button - Delete Selected */}
                        {(btnShow) && (Object.keys(selectedStudents).length !== 0) && (
                            <div className='card rounded-5 shadow-sm border-official'>
                                <button className='btn btn-official rounded-5 d-flex py-2 px-3 align-items-center gap-2' onClick={() => setDeleteModal(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                    </svg>
                                    <p className='m-0'>Delete</p>
                                </button>
                            </div>
                        )}

                        {/* Button - Mark Absent */}
                        {(btnShow) && (Object.keys(selectedStudents).length !== 0) && (
                            <div className='card rounded-5 shadow-sm border-official mt-2'>
                                <button className='btn btn-official rounded-5 d-flex py-2 px-3 align-items-center gap-2' onClick={() => setAbsentModal(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-slash-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                        <path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708" />
                                    </svg>
                                    <p className='m-0'>Absent</p>
                                </button>
                            </div>
                        )}

                        {/* Button - Mark Present */}
                        {(btnShow) && (Object.keys(selectedStudents).length !== 0) && (
                            <div className='card rounded-5 shadow-sm border-official mt-2'>
                                <button className='btn btn-official rounded-5 d-flex py-2 px-3 align-items-center gap-2' onClick={() => setPresentModal(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check2-circle" viewBox="0 0 16 16">
                                        <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" />
                                        <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
                                    </svg>
                                    <p className='m-0'>Present</p>
                                </button>
                            </div>
                        )}

                        {/* Cancel Button */}
                        {(btnShow) && (Object.keys(selectedStudents).length !== 0) && (
                            <div className='card rounded-5 shadow-sm mt-2 border-official'>
                                <button className='btn color-official rounded-5 d-flex py-2 px-3 align-items-center gap-2' onClick={() => setBtnShow(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                                    </svg>
                                    <p className='m-0'>Cancel</p>
                                </button>
                            </div>
                        )}

                        {/* Menu Button */}
                        {(!btnShow) && (Object.keys(selectedStudents).length !== 0) && (
                            <div className='card rounded-5 shadow-sm border-official'>
                                <button className='btn btn-official rounded-5 d-flex py-2 px-3 align-items-center gap-2' onClick={() => setBtnShow(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-distribute-vertical" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1 1.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 0-1h-13a.5.5 0 0 0-.5.5m0 13a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 0-1h-13a.5.5 0 0 0-.5.5" />
                                        <path d="M2 7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                                    </svg>
                                    <p className='m-0'>Menu</p>
                                </button>
                            </div>
                        )}


                    </div>





                </div>

            </div>

            {/* Delete Modal */}
            {deleteModal && (
                <div className="modal d-block bg-dark bg-opacity-75" onClick={() => setDeleteModal(false)}>

                    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>

                        <div className="modal-content">

                            <div className='modal-body'>

                                <div>
                                    <p>Are you sure you want to {' '}
                                        {(Object.keys(selectedStudents).length !== students.length) ?
                                            <span className='text-danger fw-medium'>permanently delete the <span className='color-official'>Selected</span> students?</span>
                                            : <span className='text-danger fw-medium'>permanently delete <span className='color-official'>All</span> students?</span>
                                        }
                                    </p>
                                </div>
                                <small className='text-danger'>This action cannot be undone.</small>

                            </div>

                            <div className="modal-footer">

                                <button
                                    className="btn bg-secondary text-white rounded-3 "
                                    onClick={() => {
                                        setDeleteModal(false)
                                    }}
                                >Cancel</button>

                                <button
                                    className="btn btn-danger text-white rounded-3 "
                                    onClick={deleteSelected}
                                    disabled={loading}
                                >
                                    {loading ?
                                        <p className='m-0'>
                                            Deleting...
                                            <span
                                                className="spinner-border spinner-border-sm ms-2"
                                                role="status"
                                            ></span>
                                        </p>
                                        : "Permanent Delete"
                                    }

                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}

            {/* Absent Modal */}
            {absentModal && (
                <div className="modal d-block bg-dark bg-opacity-75" onClick={() => setAbsentModal(false)}>

                    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>

                        <div className="modal-content">

                            <div className='modal-body'>

                                <div>
                                    <p>Are you sure you want to {' '}
                                        {(Object.keys(selectedStudents).length !== students.length) ?
                                            <span className='text-danger fw-medium'>mark absent the <span className='color-official'>Selected</span> students?</span>
                                            : <span className='text-danger fw-medium'>mark absent <span className='color-official'>All</span> students?</span>
                                        }
                                    </p>
                                </div>

                            </div>

                            <div className="modal-footer">

                                <button
                                    className="btn bg-secondary text-white rounded-3 "
                                    onClick={() => {
                                        setAbsentModal(false)
                                    }}
                                >Cancel</button>

                                <button
                                    className="btn btn-danger text-white rounded-3 "
                                    onClick={absentSelected}
                                    disabled={loading}
                                >
                                    {loading ?
                                        <p className='m-0'>
                                            Marking...
                                            <span
                                                className="spinner-border spinner-border-sm ms-2"
                                                role="status"
                                            ></span>
                                        </p>
                                        : "Mark Absent"
                                    }

                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}

            {/* Absent Modal */}
            {presentModal && (
                <div className="modal d-block bg-dark bg-opacity-75" onClick={() => setPresentModal(false)}>

                    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>

                        <div className="modal-content">

                            <div className='modal-body'>

                                <div>
                                    <p>Are you sure you want to {' '}
                                        {(Object.keys(selectedStudents).length !== students.length) ?
                                            <span className='text-danger fw-medium'>mark present the <span className='color-official'>Selected</span> students?</span>
                                            : <span className='text-danger fw-medium'>mark present <span className='color-official'>All</span> students?</span>
                                        }
                                    </p>
                                </div>

                            </div>

                            <div className="modal-footer">

                                <button
                                    className="btn bg-secondary text-white rounded-3 "
                                    onClick={() => {
                                        setPresentModal(false)
                                    }}
                                >Cancel</button>

                                <button
                                    className="btn btn-official text-white rounded-3 "
                                    onClick={presentSelected}
                                    disabled={loading}
                                >
                                    {loading ?
                                        <p className='m-0'>
                                            Marking...
                                            <span
                                                className="spinner-border spinner-border-sm ms-2"
                                                role="status"
                                            ></span>
                                        </p>
                                        : "Mark Present"
                                    }

                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}

        </div>

    )
}