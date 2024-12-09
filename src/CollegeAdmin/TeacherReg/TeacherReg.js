import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../../config";
import Swal from "sweetalert2";
import { BarLoader, ClipLoader } from "react-spinners";

const TeacherReg = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [collegeName, setCollegeName] = useState('');
    const [collegeDescription, setCollegeDescription] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [vOtp, setVOtp] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [collegeLogo, setCollegeLogo] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData2, setFormData2] = useState({
        username: '',
        user_email: '',
        otp: ''
    })

    const handleLogin = async () => {
        setIsLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('surname', surname);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('password', password);
        formData.append('collegeName', collegeName);
        formData.append('collegeDescription', collegeDescription);
        formData.append('file', collegeLogo);

        try {
            const response = await fetch(`${API_URL}/onboarding/teacher`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to register teacher');
            }

            const data = await response.json();
            console.log(data.status)
            if (data.status === '200') {
                // Alert user on success 
                Swal.fire({
                    text: "Successfully registered! You can proceed to login",
                    icon: "success"
                });

                setIsLoading(false);
                navigate('/');
            } else if (data.status === '401') {
                Swal.fire({
                    text: "The college name is already taken. Your college name should be unique!",
                    icon: "error"
                });

                setIsLoading(false);
            } else {
                Swal.fire({
                    text: "This email is already registered with another college!",
                    icon: "error"
                });

                setIsLoading(false);
            }

        } catch (err) {
            Swal.fire({
                text: "Registration failed, check your network connection!",
                icon: "error"
            });
            setIsLoading(false);
        }
    };

    const generateOtp = () => {

        const min = 123456;
        const max = 987987;
        const random = min + (Math.floor(Math.random() * (max - min + 1)));
        console.log('random number: ', random);
        setOtp(random.toString());

        setFormData2({ ...formData2, otp: random })
    }

    const validateOtp = (e) => {
        e.preventDefault();
        if (otp === vOtp) {
            handleLogin();
        } else {
            console.log(otp)
            console.log(vOtp)
            Swal.fire({
                text: "Incorrect OTP",
                icon: "error"
            });
        }
    }

    const sendOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // console.log(formData2);

        try {
            const response = await fetch(`${API_URL}/mailer/otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData2)
            });

            if (!response.ok) {
                Swal.fire({
                    text: "Email verification failed, check your network connection!",
                    icon: "error"
                });
                setIsLoading(false);
                throw new Error('Failed to verify email');
            }
            setShowAddModal(true);
            setIsLoading(false);

        } catch (err) {
            Swal.fire({
                text: "Email verification failed, check your network connection!",
                icon: "error"
            });
            setIsLoading(false);
        }
    }

    useEffect(() => {
        generateOtp();
    }, [])
    useEffect(() => {
        setFormData2({
            username: name,
            user_email: email,
            otp: otp
        })
    }, [name, email])

    document.addEventListener(
        "contextmenu", function(e)
        {
            e.preventDefault();
        }, false
    )

    return (
        <html lang="en">

            <body id="page-top">
                <div style={{ backgroundColor: 'rgb(246, 243, 237)', margin: 0 }}>
                    <div className="container" style={{ height: '100%' }}>
                        <div className="row justify-content-center" style={{ height: '100%', alignItems: 'center' }}>
                            <div className="col-xl-10 col-lg-12 col-md-9">
                                <div className="card o-hidden border-0 shadow-lg my-5">
                                    <div className="card-body p-0">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="p-5">
                                                    <div className="sidebar-brand-icon rotate-n-0">
                                                        <img src="../tantak_logo.png" height="80px" width="80px" alt="Background" style={{ borderRadius: '50%' }} />
                                                    </div>
                                                    <h1 className="h5 text-gray-900 mb-4 text-center">Register Your College</h1>
                                                    <p className="text-center">Please fill in the details below to register your college.</p>

                                                    <form className="user" onSubmit={sendOtp}>
                                                    {/* <form className="user" > */}
                                                        <div className="form-group">
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-user"
                                                                placeholder="Name"
                                                                value={name}
                                                                onChange={(e) => setName(e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-user"
                                                                placeholder="Surname"
                                                                value={surname}
                                                                onChange={(e) => setSurname(e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <input
                                                                type="email"
                                                                className="form-control form-control-user"
                                                                placeholder="Email"
                                                                value={email}
                                                                onChange={(e) => setEmail(e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-user"
                                                                placeholder="Phone"
                                                                value={phone}
                                                                onChange={(e) => setPhone(e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-user"
                                                                placeholder="College Name"
                                                                value={collegeName}
                                                                onChange={(e) => setCollegeName(e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <textarea
                                                                className="form-control"
                                                                placeholder="Description of the College"
                                                                value={collegeDescription}
                                                                onChange={(e) => setCollegeDescription(e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <input
                                                                type="file"
                                                                className="form-control"
                                                                accept="image/*"
                                                                onChange={(e) => setCollegeLogo(e.target.files[0])}
                                                                required
                                                            />
                                                            <small className="form-text text-muted">Upload a logo or image for your college profile.</small>
                                                        </div>
                                                        <hr></hr>
                                                        <div className="form-group">
                                                            <input
                                                                type="password"
                                                                className="form-control"
                                                                placeholder="Enter Password"
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <input
                                                                type="password"
                                                                className="form-control"
                                                                placeholder="Confirm Password"
                                                                value={confirmPassword}
                                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                                required
                                                            />
                                                        </div>

                                                        <button
                                                            className="btn btn-dark btn-user btn-block"
                                                            type="submit"
                                                            style={{ backgroundColor: 'rgba(32, 70, 161)', borderColor: 'rgba(32, 70, 161)' }}
                                                            disabled={isLoading}
                                                        >
                                                            Register
                                                        </button>
                                                        <div className="text-center">
                                                            <p></p>
                                                            <a className="small" style={{ color: 'black' }} href="/">Already have an Account? Login!</a>
                                                        </div>
                                                    </form>
                                                    <hr />
                                                </div>
                                            </div>
                                            {isLoading && (
                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-58px' }}>
                                                    <BarLoader size={40} width={'100%'} color="blue" loading />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Assignment Modal */}
                {showAddModal && (
                    <div className="modal fade show" style={{ display: 'block' }} onClick={() => setShowAddModal(false)}>
                        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', borderRadius: '8px' }}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Email verification</h5>
                                    <button type="button" className="close" onClick={() => setShowAddModal(false)}>&times;</button>
                                </div>
                                <form onSubmit={validateOtp}>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label className="modal-label">Enter OTP sent to your email ({email}):</label>
                                            <input type="number" className="form-control" value={vOtp} onChange={(e) => setVOtp(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Close</button>
                                        {isLoading && (
                                            <div style={{ marginTop: '8px', textAlign: 'center' }}>
                                                <div className="btn btn-primary" style={{ width: '5rem' }}>
                                                    <ClipLoader loading={isLoading} size={27} color="white" />
                                                </div>
                                            </div>
                                        )}
                                        {!isLoading && (
                                            <button type="submit" className="btn btn-primary">Submit</button>
                                        )}
                                    </div>
                                    {isLoading && (
                                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
                                            <BarLoader size={40} width={'100%'} color="blue" loading />
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </body>

        </html >
    );
};

export default TeacherReg;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';
// import { API_URL } from "../../config";
// import Swal from "sweetalert2";
// import { BarLoader, ClipLoader } from "react-spinners";

// const TeacherReg = () => {
//     const navigate = useNavigate();
//     const [name, setName] = useState('');
//     const [surname, setSurname] = useState('');
//     const [email, setEmail] = useState('');
//     const [phone, setPhone] = useState('');
//     const [collegeName, setCollegeName] = useState('');
//     const [collegeDescription, setCollegeDescription] = useState('');
//     const [password, setPassword] = useState('');
//     const [otp, setOtp] = useState('');
//     const [vOtp, setVOtp] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [collegeLogo, setCollegeLogo] = useState(null);
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [formData2, setFormData2] = useState({
//         username: '',
//         user_email: '',
//         otp: ''
//     });

//     const handleLogin = async () => {
//         setIsLoading(true);

//         const formData = new FormData();
//         formData.append('name', name);
//         formData.append('surname', surname);
//         formData.append('email', email);
//         formData.append('phone', phone);
//         formData.append('password', password);
//         formData.append('collegeName', collegeName);
//         formData.append('collegeDescription', collegeDescription);
//         formData.append('file', collegeLogo);

//         try {
//             const response = await fetch(`${API_URL}/onboarding/teacher`, {
//                 method: "POST",
//                 body: formData
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to register teacher');
//             }

//             const data = await response.json();
//             if (data.status === '200') {
//                 Swal.fire({
//                     text: "Successfully registered! You can proceed to login",
//                     icon: "success"
//                 });

//                 setIsLoading(false);
//                 navigate('/');
//             } else if (data.status === '401') {
//                 Swal.fire({
//                     text: "The college name is already taken. Your college name should be unique!",
//                     icon: "error"
//                 });

//                 setIsLoading(false);
//             } else {
//                 Swal.fire({
//                     text: "This email is already registered with another college!",
//                     icon: "error"
//                 });

//                 setIsLoading(false);
//             }

//         } catch (err) {
//             Swal.fire({
//                 text: "Registration failed, check your network connection!",
//                 icon: "error"
//             });
//             setIsLoading(false);
//         }
//     };

//     const generateOtp = () => {
//         const min = 123456;
//         const max = 987987;
//         const random = min + (Math.floor(Math.random() * (max - min + 1)));
//         setOtp(random);
//         setFormData2({ ...formData2, otp: random });
//     };

//     const validateOtp = (e) => {
//         e.preventDefault();
//         if (otp == vOtp) {
//             handleLogin();
//         } else {
//             Swal.fire({
//                 text: "Incorrect OTP",
//                 icon: "error"
//             });
//         }
//     };

//     const sendOtp = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch(`${API_URL}/mailer/otp`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(formData2)
//             });

//             if (!response.ok) {
//                 Swal.fire({
//                     text: "Registration failed, check your network connection!",
//                     icon: "error"
//                 });
//                 throw new Error('Failed to register teacher');
//             }
//             setShowAddModal(true);

//         } catch (err) {
//             Swal.fire({
//                 text: "Registration failed, check your network connection!",
//                 icon: "error"
//             });
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         generateOtp();
//     }, []);

//     useEffect(() => {
//         setFormData2({
//             username: name,
//             user_email: email,
//             otp: otp
//         });
//     }, [name, email]);

//     return (
//         <div style={{ backgroundColor: 'rgb(246, 243, 237)', margin: 0, height: '100vh', overflow: 'hidden' }}>
//             <div className="container">
//                 <div className="row justify-content-center" style={{ alignItems: 'center', minHeight: '100vh' }}>
//                     <div className="col-xl-10 col-lg-12 col-md-9">
//                         <div className="card o-hidden border-0 shadow-lg my-5">
//                             <div className="card-body p-0" style={{ overflowY: 'scroll', maxHeight: '500px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
//                                 <style>
//                                     {`
//                                         .card-body::-webkit-scrollbar {
//                                             display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
//                                         }
//                                     `}
//                                 </style>
//                                 <div className="row">
//                                     <div className="col-lg-12">
//                                         <div className="p-5">
//                                             <div className="sidebar-brand-icon rotate-n-0">
//                                                 <img src="../tantak_logo.png" height="80px" width="80px" alt="Background" style={{ borderRadius: '50%' }} />
//                                             </div>
//                                             <h1 className="h5 text-gray-900 mb-4 text-center">Register Your College</h1>
//                                             <p className="text-center">Please fill in the details below to register your college.</p>

//                                             <form className="user" onSubmit={sendOtp}>
//                                                 <div className="form-group">
//                                                     <input
//                                                         type="text"
//                                                         className="form-control form-control-user"
//                                                         placeholder="Name"
//                                                         value={name}
//                                                         onChange={(e) => setName(e.target.value)}
//                                                         required
//                                                     />
//                                                 </div>
//                                                 <div className="form-group">
//                                                     <input
//                                                         type="text"
//                                                         className="form-control form-control-user"
//                                                         placeholder="Surname"
//                                                         value={surname}
//                                                         onChange={(e) => setSurname(e.target.value)}
//                                                         required
//                                                     />
//                                                 </div>
//                                                 <div className="form-group">
//                                                     <input
//                                                         type="email"
//                                                         className="form-control form-control-user"
//                                                         placeholder="Email"
//                                                         value={email}
//                                                         onChange={(e) => setEmail(e.target.value)}
//                                                         required
//                                                     />
//                                                 </div>
//                                                 <div className="form-group">
//                                                     <input
//                                                         type="text"
//                                                         className="form-control form-control-user"
//                                                         placeholder="Phone"
//                                                         value={phone}
//                                                         onChange={(e) => setPhone(e.target.value)}
//                                                         required
//                                                     />
//                                                 </div>
//                                                 <div className="form-group">
//                                                     <input
//                                                         type="text"
//                                                         className="form-control form-control-user"
//                                                         placeholder="College Name"
//                                                         value={collegeName}
//                                                         onChange={(e) => setCollegeName(e.target.value)}
//                                                         required
//                                                     />
//                                                 </div>
//                                                 <div className="form-group">
//                                                     <textarea
//                                                         className="form-control"
//                                                         placeholder="Description of the College"
//                                                         value={collegeDescription}
//                                                         onChange={(e) => setCollegeDescription(e.target.value)}
//                                                         required
//                                                     />
//                                                 </div>
//                                                 <div className="form-group">
//                                                     <input
//                                                         type="file"
//                                                         className="form-control"
//                                                         accept="image/*"
//                                                         onChange={(e) => setCollegeLogo(e.target.files[0])}
//                                                         required
//                                                     />
//                                                     <small className="form-text text-muted">Upload a logo or image for your college profile.</small>
//                                                 </div>
//                                                 <hr />
//                                                 <div className="form-group">
//                                                     <input
//                                                         type="password"
//                                                         className="form-control"
//                                                         placeholder="Enter Password"
//                                                         value={password}
//                                                         onChange={(e) => setPassword(e.target.value)}
//                                                         required
//                                                     />
//                                                 </div>
//                                                 <div className="form-group">
//                                                     <input
//                                                         type="password"
//                                                         className="form-control"
//                                                         placeholder="Confirm Password"
//                                                         value={confirmPassword}
//                                                         onChange={(e) => setConfirmPassword(e.target.value)}
//                                                         required
//                                                     />
//                                                 </div>

//                                                 <button
//                                                     className="btn btn-dark btn-user btn-block"
//                                                     type="submit"
//                                                     style={{ backgroundColor: 'rgba(32, 70, 161)', borderColor: 'rgba(32, 70, 161)' }}
//                                                     disabled={isLoading}
//                                                 >
//                                                     Register
//                                                 </button>
//                                                 <div className="text-center">
//                                                     <p></p>
//                                                     <a className="small" style={{ color: 'black' }} href="/">Already have an Account? Login!</a>
//                                                 </div>
//                                             </form>
//                                             <hr />
//                                         </div>
//                                     </div>
//                                     {isLoading && (
//                                         <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-58px' }}>
//                                             <BarLoader size={40} width={'100%'} color="blue" loading />
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Submit Assignment Modal */}
//             {showAddModal && (
//                 <div className="modal fade show" style={{ display: 'block' }} onClick={() => setShowAddModal(false)}>
//                     <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
//                         <div className="modal-content" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', borderRadius: '8px' }}>
//                             <div className="modal-header">
//                                 <h5 className="modal-title">Email verification</h5>
//                                 <button type="button" className="close" onClick={() => setShowAddModal(false)}>&times;</button>
//                             </div>
//                             <form onSubmit={validateOtp}>
//                                 <div className="modal-body">
//                                     <div className="form-group">
//                                         <label className="modal-label">Enter OTP sent to your email {otp} ({email}):</label>
//                                         <input type="number" className="form-control" value={vOtp} onChange={(e) => setVOtp(e.target.value)} />
//                                     </div>
//                                 </div>
//                                 <div className="modal-footer">
//                                     <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Close</button>
//                                     {isLoading && (
//                                         <div style={{ marginTop: '8px', textAlign: 'center' }}>
//                                             <div className="btn btn-primary" style={{ width: '5rem' }}>
//                                                 <ClipLoader loading={isLoading} size={27} color="white" />
//                                             </div>
//                                         </div>
//                                     )}
//                                     {!isLoading && (
//                                         <button type="submit" className="btn btn-primary">Submit</button>
//                                     )}
//                                 </div>
//                                 {isLoading && (
//                                     <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
//                                         <BarLoader size={40} width={'100%'} color="blue" loading />
//                                     </div>
//                                 )}
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default TeacherReg;

