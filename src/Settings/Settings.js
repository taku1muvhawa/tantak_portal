import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import Topnav from "../TopNav";
import { API_URL, token } from "../config";
import Swal from "sweetalert2";
import '../Courses/Courses.css'

const Settings = () => {
    const [dataSource, setDataSource] = useState([]);
    const [moduleId] = useState(localStorage.getItem('moduleId'));
    const [userId] = useState(localStorage.getItem('userId'));
    const [countMod, setCouuntMod] = useState('');

    const storedUser = localStorage.getItem('user');
    const user = JSON.parse(storedUser);

    const [formData, setFormData] = useState({
        email: user.email,
        oldPassword: '',
        newPassword: '',
        ConfirmPassword: ''
    });

    const [hide, setHide] = useState(false);

    const toggleSidebar = () => {
        setHide(prevHide => !prevHide); // Toggle the hide state
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const fetchModules = async () => {
        try {
            const response = await fetch(`${API_URL}/subscriptions/student/${userId}/${moduleId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token()}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDataSource(data);
            setCouuntMod(data.length);
            console.log(countMod)
            console.log(dataSource)
        } catch (error) {
            console.error("Error fetching colleges:", error);
        }
    };

    useEffect(() => {
        fetchModules();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData);

        if (formData.newPassword === formData.ConfirmPassword) {
            try {
                const response = await fetch(`${API_URL}/onboarding/resetpassword`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    // alert('Password Changed Successfully!');
                    Swal.fire({
                        text: "Password Changed Successfully!",
                        icon: "success"
                    });
                } else {
                    // alert('Password Reset Failed!');
                    Swal.fire({
                        text: "Password Reset Failed!",
                        icon: "error"
                    });
                }
            } catch (error) {
                console.error("Error resetting password:", error);
                Swal.fire({
                    text: "An error occurred while resetting the password.",
                    icon: "error"
                });
            }
        }

        else {
            // alert('Passwords are not matching')
            Swal.fire({
                text: "Passwords are not matching!",
                icon: "error"
            })
        }
    };


    return (
        <html lang="en">

            <body id="page-top">

                <div id="wrapper">

                    <Sidebar hide={hide}></Sidebar>

                    <div id="content-wrapper" className="d-flex flex-column" >
                        <div id="content">

                            <Topnav title="Settings" toggleSidebar={toggleSidebar}></Topnav>

                            <div className="container-fluid" style={{ textAlign: 'left', overflow: 'auto', maxHeight: '550px' }}>

                                <div style={{ width: '90%' }}>
                                    <h1 className="h3 mb-4 text-gray-800" style={{ textAlign: 'left' }}>Change Password</h1>

                                    <div className="row">
                                        <div className="col-lg-6">
                                            <label htmlFor="Name">Old Password</label>
                                            <input
                                                type="password"
                                                name="oldPassword"
                                                id="oldPassword"
                                                className="form-control"
                                                style={{ border: '0.5px solid #0609b9' }}
                                                value={formData.oldPassword}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-lg-6">
                                            <label htmlFor="Surname">New Password</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                id="Surname"
                                                className="form-control"
                                                style={{ border: '0.5px solid #0609b9' }}
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div> <br></br>
                                    <div className="row">
                                    </div><br></br>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <label htmlFor="Surname">Confirm Password</label>
                                            <input
                                                type="password"
                                                name="ConfirmPassword"
                                                id="Surname"
                                                className="form-control"
                                                style={{ border: '0.5px solid #0609b9' }}
                                                value={formData.ConfirmPassword}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-lg-6">
                                            <label>&nbsp;</label>
                                            <button onClick={handleSubmit} className="btn form-control" style={{ backgroundColor: '#0609b9', color: '#ffffff' }}>
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </body>

        </html >
    );


};

export default Settings;



