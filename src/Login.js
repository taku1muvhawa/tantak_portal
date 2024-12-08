import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { API_URL, token } from "./config";
import Swal from "sweetalert2";
import { BarLoader, ClipLoader } from "react-spinners";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [vOtp, setVOtp] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [newPass, setNewPass] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData2, setFormData2] = useState({
        user_email: '',
        otp: ''
    })

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const credObj = { email, password };

        try {
            const response = await fetch(`${API_URL}/onboarding/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credObj)
            });

            const data = await response.json();
            sessionStorage.setItem('token', data.token)

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));

                const storedUser = JSON.stringify(data.user);
                const user = JSON.parse(storedUser);

                localStorage.setItem('userId', user.user_id)
                localStorage.setItem('userRole', user.role)
                checkAdmin(user.user_id);

                // if(user.role === "college"){
                //     navigate('/mychannel');
                // }else{
                //     navigate('/mycourses');
                // }
            } else {
                Swal.fire({
                    text: "Incorrect Username or Password!",
                    icon: "error"
                });
                setIsLoading(false);
            }
        } catch (err) {
            Swal.fire({
                text: "Login failed, check your network connection!",
                icon: "error"
            });
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handleLogout = () => {
            localStorage.clear();
            console.log("User logged out");
        };

        handleLogout();
    }, [])

    const checkAdmin = async (user_id) => {
        try {
            const response = await fetch(`${API_URL}/colleges/admin/${user_id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token()}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data)
            console.log(data.length)
            if (data.length >= 1) {
                localStorage.setItem('myChannel', data[0].name);
                localStorage.setItem('myChannelId', data[0].college_id);
                navigate('/mychannel');
            } else {
                console.log("code executed")
                navigate('/mycourses');
            }
            console.log(data.length);
        } catch (error) {
            console.error("Error fetching admin:", error);
        }
    };

    //NEW
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
            setEmailSent(false);
            setNewPass(true);
        } else {
            console.log(otp)
            console.log(vOtp)
            Swal.fire({
                text: "Incorrect OTP",
                icon: "error"
            });
        }
    }

    const forgotPassword = () => {
        setShowAddModal(true);
        setEmailSent(false);
        setNewPass(false);
        setConfirmPassword('');
        setPassword('');
        setEmail('');
        setVOtp('');
    }

    const resetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        let formData = ({
            email: email,
            newPassword: password
        })
        try {
            const response = await fetch(`${API_URL}/onboarding/forgotpassword`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                Swal.fire({
                    text: "Registration failed, check your network connection!",
                    icon: "error"
                });
                throw new Error('Failed to register teacher');
            }
            Swal.fire({
                text: "Password reset successfully! You can proceed to login.",
                icon: "success"
            });
            setIsLoading(false);
            setShowAddModal(false);

            // setEmailSent(true);

        } catch (err) {
            Swal.fire({
                text: "Password reset failed, check your network connection!",
                icon: "error"
            });
            setIsLoading(false);
        }
    }

    const sendOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // console.log(formData2);

        try {
            const response = await fetch(`${API_URL}/mailer/forgotPassword`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData2)
            });

            if (!response.ok) {
                Swal.fire({
                    text: "Email verification failed, check your network connection!",
                    icon: "error"
                });
                setIsLoading(true);
                throw new Error('Failed to register teacher');
            }

            setEmailSent(true);
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
            user_email: email,
            otp: otp
        })
    }, [email])

    document.addEventListener(
        "contextmenu", function(e)
        {
            e.preventDefault();
        }, false
    )

    return (
        <html lang="en">
            <body>

                <div style={{ backgroundColor: 'rgb(246, 243, 237)', height: '100vh', margin: 0 }}>
                    <div className="container" style={{ height: '100%' }}>
                        <div className="row justify-content-center" style={{ height: '100%', alignItems: 'center' }}>
                            <div className="col-xl-10 col-lg-12 col-md-9">
                                <div className="card o-hidden border-0 shadow-lg my-5" style={{ top: '-13px', width: '110%', marginLeft: '-50px' }}>
                                    <div className="card-body p-0" style={{ height: '500px' }}>
                                        <div className="row">
                                            <div className="col-lg-6 d-none d-lg-block bg-login-image">
                                                <img src="../tantak_logo.png" height="480px" width="530px" alt="Background" />
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="p-5">
                                                    <div className="row text-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0 }}>
                                                        <div className="col-lg-8" style={{ marginLeft: '-50px' }}>
                                                            <div>
                                                                {/* <img src="../assets/img/tantak-logo.png" height="50px" width="120px" alt="NLCC Logo" /> */}
                                                                <h1 className="h5 mb-1" style={{ margin: 0, color: 'blue' }}>E-LEARNING PORTAL</h1>
                                                            </div>
                                                            <h1 className="h5 text-gray-900 mb-4" style={{ margin: 0 }}>Sign In!</h1>
                                                        </div>
                                                    </div>

                                                    <form className="user" onSubmit={handleLogin}>
                                                        <div className="form-group">
                                                            <input
                                                                type="email"
                                                                className="form-control form-control-user custom-input"
                                                                id="exampleInputEmail"
                                                                aria-describedby="emailHelp"
                                                                placeholder="Enter Email Address..."
                                                                value={email}
                                                                onChange={(e) => setEmail(e.target.value)}
                                                                required
                                                                style={{ height: '50px' }}
                                                            />
                                                        </div>
                                                        <br />
                                                        <div className="form-group">
                                                            <input
                                                                type="password"
                                                                className="form-control form-control-user custom-input"
                                                                id="exampleInputPassword"
                                                                placeholder="Password"
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        {/* <br /> */}
                                                        <div className="form-group">
                                                            <div className="custom-control custom-checkbox small custom-btn" style={{ float: 'left' }}>
                                                                <input
                                                                    type="checkbox"
                                                                    className="custom-control-input"
                                                                    id="customCheck"
                                                                />
                                                                <label className="custom-control-label" htmlFor="customCheck" onClick={forgotPassword} style={{ cursor: 'pointer' }}>Forgot Password</label>
                                                            </div>
                                                        </div>
                                                        <br />
                                                        <button
                                                            className="btn btn-dark btn-user btn-block"
                                                            type="submit"
                                                            // style={{ backgroundColor: 'rgba(17, 112, 63, 0.866)', borderColor: 'rgba(19, 171, 92, 0.866)', width: '100%' }}
                                                            style={{ backgroundColor: 'rgba(32, 70, 161)', borderColor: 'rgba(32, 70, 161)', width: '100%' }} disabled={isLoading}
                                                        >
                                                            Login
                                                        </button>
                                                        <div className="text-center"><br></br>
                                                            <a className="small" style={{ color: 'black' }} href="/register">Create an Account!</a>
                                                        </div>
                                                    </form>
                                                    <hr />
                                                </div>
                                                {/* <br /><br /><br /><br /><br />   */}
                                            </div>
                                            {isLoading && (
                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
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
                                {!emailSent && !newPass && (
                                    <form onSubmit={sendOtp}>
                                        <div className="modal-body">
                                            <div className="form-group">
                                                <label className="modal-label">Enter your email:</label>
                                                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
                                )}

                                {/* Enter OTP */}
                                {emailSent && (
                                    <form onSubmit={validateOtp}>
                                        <div className="modal-body">
                                            <div className="form-group">
                                                <label className="modal-label">Enter OTP sent to {otp} ({email}):</label>
                                                <input type="number" className="form-control" value={vOtp} onChange={(e) => setVOtp(e.target.value)} required />
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
                                )}
                                {/* Enter OTP */}
                                {newPass && (
                                    <form onSubmit={resetPassword}>
                                        <div className="modal-body">
                                            <div className="form-group">
                                                <label className="modal-label">Enter New Password:</label>
                                                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                            </div>
                                        </div>
                                        <div className="modal-body">
                                            <div className="form-group">
                                                <label className="modal-label">Confirm Password</label>
                                                <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
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
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </body>
        </html>
    );
};

export default Login;
