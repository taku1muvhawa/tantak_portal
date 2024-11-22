import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { API_URL } from "./config";
import Swal from "sweetalert2";
import { BarLoader } from "react-spinners";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/courses');
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

    useEffect(()=>{
        const handleLogout = () => {
            localStorage.clear();
            console.log("User logged out");
        };

        handleLogout();
    },[])


    return (
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
                                                        <label className="custom-control-label" htmlFor="customCheck">Remember Me</label>
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
    );
};

export default Login;
