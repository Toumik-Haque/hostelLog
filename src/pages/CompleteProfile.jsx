import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import publicApi from '../api/publicApi'
import { Alert } from 'bootstrap'
import logo from '../assets/textlogo.png'

function CompleteProfile() {

    const navigate = useNavigate()

    const [loading, setLoading] =
        useState(false)

    const [showPassword,
        setShowPassword] =
        useState(false)

    const [
        showConfirmPassword,
        setShowConfirmPassword
    ] = useState(false)

    const [formData, setFormData] = useState({
        mobile: '',
        department: '',
        roomNo: '',
        foodPreference: '',
        dontEat: [],
        bloodGroup: '',
        password: '',
        confirmPassword: ''
    })

    const [errors, setErrors] = useState({})
    const [successMessage, setSuccessMessage] = useState('')

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleDontEatChange = (e) => {

        const { value, checked } = e.target

        if (checked) {
            setFormData({
                ...formData,
                dontEat: [
                    ...formData.dontEat,
                    value
                ]
            })
        } else {
            setFormData({
                ...formData,
                dontEat: formData.dontEat.filter(
                    item => item !== value
                )
            })
        }
    }

    const validateForm = () => {

        const newErrors = {}

        if (!formData.mobile.trim()) {
            newErrors.mobile = 'Mobile number is required'
        } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
            newErrors.mobile =
                'Please enter a valid 10-digit mobile number'
        }

        if (!formData.department) {
            newErrors.department =
                'Please select your department'
        }

        if (!formData.roomNo) {
            newErrors.roomNo =
                'Please select your room number'
        }

        if (!formData.foodPreference) {
            newErrors.foodPreference =
                'Please select your food preference'
        }

        if (!formData.bloodGroup) {
            newErrors.bloodGroup =
                'Please select your blood group'
        }

        if (!formData.password) {
            newErrors.password =
                'Password is required'
        } else if (formData.password.length < 8) {
            newErrors.password =
                'Password must be at least 8 characters'
        }

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            newErrors.confirmPassword =
                'Passwords do not match'
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        if (validateForm()) {

            try {

                const email =
                    localStorage.getItem(
                        'registrationEmail'
                    )

                const rollNo =
                    localStorage.getItem(
                        'registrationRollNo'
                    )

                await publicApi.post(
                    '/auth/register',
                    {
                        rollNo,
                        email,
                        mobile: formData.mobile,
                        department: formData.department,
                        roomNo: formData.roomNo,
                        foodPreference: formData.foodPreference,
                        dontEat: formData.dontEat,
                        bloodGroup: formData.bloodGroup,
                        password: formData.password
                    }
                )

                setSuccessMessage(
                    'Registration successful!'
                )

                alert('Registration successful!')

                navigate('/')

            } catch (err) {

                console.log(err)

                setSuccessMessage('')

                alert(
                    err.response?.data?.message ||
                    'Error'
                )
            }
        }
    }

    return (
        <div className="container-fluid vh-100 overflow-auto py-4">

            {/* BACK */}
            <div className="m-2">

                <button
                    className="btn p-0 border-0 bg-transparent"
                    onClick={() =>
                        navigate('/verify-otp')
                    }
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

            <div className="row justify-content-center">

                <div className="col-md-6">

                    <div className="card border-0">

                        <div className="card-body">

                            <div className="text-center mb-4">

                                <div className="fw-bold mb-1">
                                    <img src={logo} alt="" srcset="" style={{ height: '30px' }} />
                                </div>

                                <p className="text-muted">
                                    Just one more step - Complete profile
                                </p>

                            </div>

                            {
                                successMessage && (
                                    <div className="alert alert-success">
                                        {successMessage}
                                    </div>
                                )
                            }

                            <form onSubmit={handleSubmit}>

                                {/* Mobile Number */}
                                <div className="form-floating mb-3">

                                    <input
                                        type="tel"
                                        name="mobile"
                                        id="mobile"
                                        className="form-control rounded-3"
                                        placeholder="Mobile Number"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                    />

                                    <label htmlFor="mobile">
                                        Mobile Number
                                    </label>

                                </div>

                                {/* Department */}
                                <div className="form-floating mb-3">

                                    <select
                                        name="department"
                                        id="department"
                                        className="form-select rounded-3"
                                        value={formData.department}
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            Select Department
                                        </option>

                                        <option value="CSE">CSE</option>
                                        <option value="ECE">ECE</option>
                                        <option value="EE">EE</option>
                                        <option value="AI">AI</option>

                                    </select>

                                    <label htmlFor="department">
                                        Department
                                    </label>

                                </div>

                                {/* Room Number */}
                                <div className="form-floating mb-3">

                                    <select
                                        name="roomNo"
                                        id="roomNo"
                                        className="form-select rounded-3"
                                        value={formData.roomNo}
                                        onChange={handleChange}
                                    >

                                        <option value="">
                                            Select Room Number
                                        </option>

                                        {Array.from(
                                            { length: 75 },
                                            (_, index) => 101 + index
                                        ).map((room) => (

                                            <option
                                                key={room}
                                                value={room}
                                            >
                                                {room}
                                            </option>

                                        ))}

                                    </select>

                                    <label htmlFor="roomNo">
                                        Room Number
                                    </label>

                                </div>

                                {/* Food Preference */}
                                <div className="mb-3">

                                    <label className="fw-semibold mb-2">
                                        Food Preference
                                    </label>

                                    <div className="d-flex gap-2">

                                        <button
                                            type="button"
                                            className={
                                                formData.foodPreference === 'Veg'
                                                    ? 'btn bg-official text-white'
                                                    : 'btn btn-outline-secondary'
                                            }
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    foodPreference: 'Veg'
                                                })
                                            }
                                        >
                                            Veg
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                formData.foodPreference === 'Non-Veg'
                                                    ? 'btn bg-official text-white'
                                                    : 'btn btn-outline-secondary'
                                            }
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    foodPreference: 'Non-Veg'
                                                })
                                            }
                                        >
                                            Non-Veg
                                        </button>

                                    </div>

                                </div>

                                {/* Non Veg Restrictions */}
                                {formData.foodPreference === 'Non-Veg' && (

                                    <div className="border rounded-3 p-3 mb-3">

                                        <small className="fw-semibold">
                                            But, I Don't Eat
                                        </small>

                                        <div className="form-check mt-2">

                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                value="Chicken"
                                                checked={
                                                    formData.dontEat.includes(
                                                        'Chicken'
                                                    )
                                                }
                                                onChange={handleDontEatChange}
                                            />

                                            <label className="form-check-label">
                                                Chicken
                                            </label>

                                        </div>

                                        <div className="form-check">

                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                value="Fish"
                                                checked={
                                                    formData.dontEat.includes(
                                                        'Fish'
                                                    )
                                                }
                                                onChange={handleDontEatChange}
                                            />

                                            <label className="form-check-label">
                                                Fish
                                            </label>

                                        </div>

                                        <div className="form-check">

                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                value="Egg"
                                                checked={
                                                    formData.dontEat.includes(
                                                        'Egg'
                                                    )
                                                }
                                                onChange={handleDontEatChange}
                                            />

                                            <label className="form-check-label">
                                                Egg
                                            </label>

                                        </div>

                                    </div>

                                )}

                                {/* Blood Group */}
                                <div className="form-floating mb-3">

                                    <select
                                        name="bloodGroup"
                                        id="bloodGroup"
                                        className="form-select rounded-3"
                                        value={formData.bloodGroup}
                                        onChange={handleChange}
                                    >

                                        <option value="">
                                            Select Blood Group
                                        </option>

                                        <option>A+</option>
                                        <option>A-</option>
                                        <option>B+</option>
                                        <option>B-</option>
                                        <option>AB+</option>
                                        <option>AB-</option>
                                        <option>O+</option>
                                        <option>O-</option>

                                    </select>

                                    <label htmlFor="bloodGroup">
                                        Blood Group
                                    </label>

                                </div>

                                {/* Password */}
                                <div className="input-group">

                                    <div className="form-floating">

                                        <input
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            name="password"
                                            id="password"
                                            className="form-control"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleChange}
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
                                <p className="mb-3 color-official">
                                    <small>Minimum length should be 8</small>
                                </p>

                                {/* Confirm Password */}
                                <div className="input-group mb-4">

                                    <div className="form-floating">

                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            name="confirmPassword"
                                            id="confirmPassword"
                                            className="form-control"
                                            placeholder="Confirm Password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />

                                        <label htmlFor="confirmPassword">
                                            Confirm Password
                                        </label>

                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                    >
                                        {showConfirmPassword
                                            ? 'Hide'
                                            : 'Show'}
                                    </button>

                                </div>

                                <button
                                    type="submit"
                                    className="btn bg-official text-white w-100 rounded-3 py-2 fw-semibold"
                                    disabled={loading}
                                >

                                    {loading ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                            />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Account'
                                    )}

                                </button>

                            </form>

                        </div>

                    </div>

                </div>

                {/* FOOTER */}
                <small className='text-center mt-4 mb-1 p-0'>
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

export default CompleteProfile