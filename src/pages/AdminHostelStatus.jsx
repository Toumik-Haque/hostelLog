import { useEffect, useState } from 'react'
import adminApi from '../api/adminApi'
import axios from 'axios'

import QRCode from '../assets/agecboyshosii@sbi.png'
import toast from "react-hot-toast"

export default function AdminHostelStatus({ stats, fetchingData, }) {

    const copyUPI = async () => {
        try {
            await navigator.clipboard.writeText("agecboyshosii@sbi");
            toast.success("UPI Id Copied!");
        } catch {
            toast.error("Failed to copy.");
        }
    };

    const copyACNo = async () => {
        try {
            await navigator.clipboard.writeText("44665967145");
            toast.success("A/C No Copied!");
        } catch {
            toast.error("Failed to copy.");
        }
    };

    const copyIFSC = async () => {
        try {
            await navigator.clipboard.writeText("SBIN0012409");
            toast.success("IFSC Copied!");
        } catch {
            toast.error("Failed to copy.");
        }
    };

    useEffect(() => {

        toast.promise(
            fetchingData(),
            {
                loading: "Refreshing hostel data...",
                success: "Hostel data updated!",
                error: "Failed to refresh hostel data"
            }
        )

        console.log('Status fetched')

    }, [])

    if (!stats) {
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

        <div className='h-100 overflow-auto py-3 hide-scrollbar'>

            <div className='heading mx-4'>
                <div className='fw-bold text-center color-official mb-2'>AGEMC BOYS HOSTEL II</div>
            </div>

            {/* HOSTEL STATUS CARDS */}
            <div className='cardsContainer mx-4 d-flex flex-column gap-3'>

                {/* PRESENT CARD */}
                <div className="card border-0 shadow-sm rounded-4">

                    <div className="card-body d-flex gap-3">
                        <div className='bigNum w-50 d-flex flex-column align-items-center justify-content-center'>

                            <p className='color-official fs-1 fw-bold m-0'>
                                {stats.presentNow.totalPresentNow}
                            </p>
                            <p className='fw-medium m-0'>Present Now</p>

                        </div>

                        <div className='w-50 d-flex flex-column gap-1'>

                            <p className="m-0 badge p-2 bg-official border">Pure Veg: {stats.presentNow.totalVegPresentNow}</p>
                            <p className="m-0 badge p-2 bg-official border">No Chicken: {stats.presentNow.totalDontEatChickenPresentNow}</p>
                            <p className="m-0 badge p-2 bg-official border">No Fish: {stats.presentNow.totalDontEatFishPresentNow}</p>
                            <p className="m-0 badge p-2 bg-official border">No Egg: {stats.presentNow.totalDontEatEggPresentNow}</p>

                        </div>
                    </div>

                </div>

                {/* TOTAL UNREGISTERED */}
                <div className='d-flex box-3 justify-content-between unReg gap-5'>

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

                    <div className="card-body d-flex gap-3">

                        <div className='w-50 d-flex flex-column gap-1'>

                            <p className="m-0 badge p-2 border border-white">Pure Veg: {stats.total.totalVegStudents}</p>
                            <p className="m-0 badge p-2 border border-white">No Chicken: {stats.total.totalDontEatChickenStudents}</p>
                            <p className="m-0 badge p-2 border border-white">No Fish: {stats.total.totalDontEatFishStudents}</p>
                            <p className="m-0 badge p-2 border border-white">No Egg: {stats.total.totalDontEatEggStudents}</p>

                        </div>

                        <div className='bigNum w-50 d-flex flex-column align-items-center justify-content-center'>

                            <p className='fw-medium m-0'>Total Hostellers</p>
                            <p className='color-official fs-1 fw-bold m-0'>
                                {stats.total.totalStudents}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* BANK DETAILS */}
            <div className='cardsContainer bankBox d-flex flex-column mx-4 mt-4'>

                <div className='card border-0 rounded-4 shadow-sm'>

                    <div className='card-body'>

                        <div className='d-flex justify-content-between border-bottom border-official pb-1 mb-1'>
                            <div className='d-flex fw-medium gap-1 align-items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-cash-stack" viewBox="0 0 16 16">
                                    <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                                    <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z" />
                                </svg>
                                <p className='m-0'>Fees of Jul'26 to Dec'26</p>
                            </div>
                            <p className='m-0 fw-bold color-official'>₹13500</p>
                        </div>

                        <div className='d-flex small justify-content-between text-secondary'>
                            <p className='m-0'>Hostel Seat Rent</p>
                            <p className='m-0'>₹1000</p>
                        </div>

                        <div className='d-flex small justify-content-between text-secondary'>
                            <p className='m-0'>Electricity Charges</p>
                            <p className='m-0'>₹500</p>
                        </div>

                        <div className='d-flex small justify-content-between text-secondary'>
                            <p className='m-0'>Mess Fees</p>
                            <p className='m-0'>₹12000</p>
                        </div>

                    </div>

                </div>

                <div className='my-4 card shadow-sm mx-4 border border-official text-center rounded p-2'>
                    <div className='fw-medium mb-2 fs-5'>SCAN & PAY</div>
                    <div>
                        <img src={QRCode} alt="QR Code" srcSet="" style={{ height: '175px' }} />
                    </div>
                    <div className='fs-small text-center text-secondary mt-2'>SBI - KAMKHYAGURI BRANCH</div>
                </div>

                <div className='d-flex flex-column gap-1'>

                    <div className='card border-0 p-3'>
                        <p className='m-0 text-secondary small'>UPI ID</p>
                        <div className='d-flex gap-2'>
                            <p className='m-0 fw-medium'>agecboyshosii@sbi</p>
                            <button onClick={copyUPI} className='btn p-0 color-official d-flex align-items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className='card border-0 p-3'>
                        <p className='m-0 text-secondary small'>Account No</p>
                        <div className='d-flex gap-2'>
                            <p className='m-0 fw-medium'>44665967145</p>
                            <button onClick={copyACNo} className='btn p-0 color-official d-flex align-items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className='card border-0 p-3'>
                        <p className='m-0 text-secondary small'>IFSC</p>
                        <div className='d-flex gap-2'>
                            <p className='m-0 fw-medium'>SBIN0012409</p>
                            <button onClick={copyIFSC} className='btn p-0 color-official d-flex align-items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                </div>

            </div>

        </div>

    )

}