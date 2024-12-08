import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../config";
import Swal from "sweetalert2";
import { BarLoader, ClipLoader } from "react-spinners";

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [vOtp, setVOtp] = useState('');
    const [showAddModal, setShowAddModal] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formData2, setFormData2] = useState({
        username: '',
        user_email: '',
        otp: ''
    });

    const handleLogin = async () => {
        setIsLoading(true);
        const credObj = { name, surname, email, phone, password };

        try {
            const response = await fetch(`${API_URL}/onboarding`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credObj)
            });

            if (!response.ok) {
                throw new Error('Failed to add user');
            }

            const data = await response.json();
            if (data.status === '200') {
                Swal.fire({
                    text: "Successfully registered! You can proceed to login",
                    icon: "success"
                });
                setIsLoading(false);
                navigate('/');
            } else {
                Swal.fire({
                    text: "User already registered!",
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
        setOtp(random.toString());
        setFormData2({ ...formData2, otp: random });
    };

    const validateOtp = (e) => {
        e.preventDefault();
        if (otp === vOtp) {
            handleLogin();
        } else {
            Swal.fire({
                text: "Incorrect OTP",
                icon: "error"
            });
        }
    };

    const sendOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
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
                throw new Error('Failed to register teacher');
            }
            setIsLoading(false);
            setShowAddModal(true);

        } catch (err) {
            Swal.fire({
                text: "Email verification failed, check your network connection!",
                icon: "error"
            });
            setIsLoading(false);
        }
    };

    useEffect(() => {
        generateOtp();
    }, []);

    useEffect(() => {
        setFormData2({
            username: name,
            user_email: email,
            otp: otp
        });
    }, [name, email]);

    return (
        <div style={{ backgroundColor: 'rgb(246, 243, 237)', height: '100vh', overflow: 'hidden' }}>
            <div className="container">
                <div className="row justify-content-center" style={{ alignItems: 'center', minHeight: '100vh' }}>
                    <div className="col-xl-10 col-lg-12 col-md-9">
                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0" style={{ overflowY: 'scroll', maxHeight: '500px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                {/* Hide scrollbar for Firefox and IE */}
                                <style>
                                    {`
                                        .card-body::-webkit-scrollbar {
                                            display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
                                        }
                                    `}
                                </style>
                                <div className="row">
                                    <div className="col-lg-5 d-none d-lg-block bg-login-image">
                                        <img src="../tantak_logo.png" height="450px" width="480px" alt="Background" />
                                    </div>
                                    <div className="col-lg-7">
                                        <div className="p-5">
                                            <div className="row text-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0 }}>
                                                <div className="col-lg-8">
                                                    <h1 className="h5 mb-1" style={{ margin: 0, color: 'blue' }}>E-LEARNING PORTAL</h1>
                                                    <h1 className="h5 text-gray-900 mb-4" style={{ margin: 0 }}>Create an Account</h1>
                                                </div>
                                            </div>

                                            <form className="user" onSubmit={sendOtp}>
                                                <div className="row">
                                                    <div className="col-sm-6 mb-3 mb-sm-0">
                                                        <div className="form-group">
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-user custom-input"
                                                                id="name"
                                                                placeholder="Name"
                                                                value={name}
                                                                onChange={(e) => setName(e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6 mb-3 mb-sm-0">
                                                        <div className="form-group">
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-user custom-input"
                                                                id="surname"
                                                                placeholder="Surname"
                                                                value={surname}
                                                                onChange={(e) => setSurname(e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-user custom-input"
                                                        id="email"
                                                        placeholder="Email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-user custom-input"
                                                        id="phone"
                                                        placeholder="Phone"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-6 mb-3 mb-sm-0">
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
                                                    </div>
                                                    <div className="col-sm-6 mb-3 mb-sm-0">
                                                        <div className="form-group">
                                                            <input
                                                                type="password"
                                                                className="form-control form-control-user custom-input"
                                                                id="confirmPassword"
                                                                placeholder="Confirm Password"
                                                                value={confirmPassword}
                                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    className="btn btn-dark btn-user btn-block"
                                                    type="submit"
                                                    style={{ backgroundColor: 'rgba(32, 70, 161)', borderColor: 'rgba(32, 70, 161)', width: '100%' }} disabled={isLoading}
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
                                        <label className="modal-label">Enter OTP sent to your email {otp} ({email}):</label>
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
        </div>
    );
};

export default Register;
