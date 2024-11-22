import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../config";
import Swal from "sweetalert2";
import { BarLoader } from "react-spinners";

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const credObj = { name, surname, email, phone, password };

        try {
            const response = await fetch(`${API_URL}/onboarding`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credObj)
            });

            // const data = await response.json();

            if (!response.ok) {
                throw new Error('Failed to add user');
            }

            // Alert user on success
            Swal.fire({
                text: "Successfully registered! You can proceed to login",
                icon: "success"
            });

            setIsLoading(false);
            navigate('/');

        } catch (err) {
            Swal.fire({
                text: "Registration failed, check your network connection!",
                icon: "error"
            });
            setIsLoading(false);
        }
    };


    // const handleSubmitAdd = async (e) => {
    //     e.preventDefault();

    //     try {
    //         const response = await fetch(`${API_URL}/users`, {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(formData),
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to add user'); 
    //         }

    //         // Alert user on success
    //         Swal.fire({
    //             text: "User added successfully!",
    //             icon: "success"
    //         });   //*/

    //         fetchUsers();
    //         setShowAddModal(false);
    //     } catch (error) {
    //         console.error("Error adding user:", error);
    //         Swal.fire({
    //             text: "An error occurred while adding the user.",
    //             icon: "error"
    //         });
    //     }
    // };

    return (
        <div style={{ backgroundColor: 'rgb(246, 243, 237)', height: '100vh', margin: 0 }}>
            <div className="container" style={{ height: '100%' }}>
                <div className="row justify-content-center" style={{ height: '100%', alignItems: 'center' }}>
                    <div className="col-xl-10 col-lg-12 col-md-9">
                        <div className="card o-hidden border-0 shadow-lg my-5" style={{ top: '-13px', width: '110%', marginLeft: '-50px' }}>
                            <div className="card-body p-0" style={{ height: '500px' }}>
                                <div className="row">
                                    <div className="col-lg-5 d-none d-lg-block bg-login-image"><br></br>
                                        <img src="../tantak_logo.png" height="450px" width="480px" alt="Background" />
                                    </div>
                                    <div className="col-lg-7">
                                        <div className="p-5">
                                            <div className="row text-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0 }}>
                                                <div className="col-lg-8" style={{ marginLeft: '-50px' }}>
                                                    <div>
                                                        <h1 className="h5 mb-1" style={{ margin: 0, color: 'blue' }}>E-LEARNING PORTAL</h1>
                                                    </div>
                                                    <h1 className="h5 text-gray-900 mb-4" style={{ margin: 0 }}>Create an Account</h1>
                                                </div>
                                            </div>

                                            <form className="user" onSubmit={handleLogin}>
                                                <div className="row">
                                                    <div className="col-sm-6 mb-3 mb-sm-0">
                                                        <div className="form-group">
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-user custom-input"
                                                                id="name"
                                                                aria-describedby="name"
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
                                                                aria-describedby="surname"
                                                                placeholder="Surname"
                                                                value={surname}
                                                                onChange={(e) => setSurname(e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <br /> */}
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
                                                                id="exampleInputPassword"
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
        </div>
    );
};

export default Register;
