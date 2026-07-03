import QRCode from '../assets/agecboyshosii@sbi.png'
import toast from "react-hot-toast"

function BankAccount() {

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

    return (
        <div className='h-100 overflow-auto py-3 hide-scrollbar'>
            <div className='mx-4'>

                <div className='mx-4 text-center mb-4'>
                    <div className='fw-bold fs- border-official color-official border-bottom border-dark pb-1'>AGEMC BOYS HOSTEL II</div>

                    <div className='mx- mt- d-flex justify-content-between border-bottom border-dark pb-1'>
                        <div className='d-flex gap-2 align-items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-cash-stack" viewBox="0 0 16 16">
                                <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                                <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z" />
                            </svg>
                            <p className='m-0'>Fees of JUL'26 to DEC'26</p>
                        </div>
                        <p className='m-0 fw-bold color-official'>₹13500</p>
                    </div>

                    <div className='d-flex justify-content-between text-secondary'>
                        <p className='m-0'>Hostel Seat Rent</p>
                        <p className='m-0'>₹1000</p>
                    </div>

                    <div className='d-flex justify-content-between text-secondary'>
                        <p className='m-0'>Electricity Charges</p>
                        <p className='m-0'>₹500</p>
                    </div>

                    <div className='d-flex justify-content-between text-secondary border-bottom border-dark pb-1'>
                        <p className='m-0'>Mess Fees</p>
                        <p className='m-0'>₹12000</p>
                    </div>

                    <div className='fw-medium mb-3 mt-4 fs-4'>SCAN & PAY</div>
                    <img src={QRCode} alt="QR Code" srcset="" />
                    <div className='fs-small text-center text-secondary mt-3'>SBI - KAMKHYAGURI BRANCH</div>
                </div>

                <div className='mx-4 d-flex flex-column gap-2'>

                    <div className='d-flex justify-content-between'>
                        <div className='d-flex flex-column'>
                            <p className='m-0 text-secondary'>UPI ID</p>
                            <p className='m-0 fw-medium'>agecboyshosii@sbi</p>
                        </div>
                        <button onClick={copyUPI} className='btn p-0 color-official d-flex gap-1 align-items-end'>
                            <p className='m-0'>Copy</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                            </svg>
                        </button>
                    </div>

                    <div className='d-flex justify-content-between'>
                        <div className='d-flex flex-column'>
                            <p className='m-0 text-secondary'>Account No</p>
                            <p className='m-0 fw-medium'>44665967145</p>
                        </div>
                        <button onClick={copyACNo} className='btn p-0 color-official d-flex gap-1 align-items-end'>
                            <p className='m-0'>Copy</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                            </svg>
                        </button>
                    </div>

                    <div className='d-flex justify-content-between'>
                        <div className='d-flex flex-column'>
                            <p className='m-0 text-secondary'>IFSC</p>
                            <p className='m-0 fw-medium'>SBIN0012409</p>
                        </div>
                        <button onClick={copyIFSC} className='btn p-0 color-official d-flex gap-1 align-items-end'>
                            <p className='m-0'>Copy</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                            </svg>
                        </button>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default BankAccount