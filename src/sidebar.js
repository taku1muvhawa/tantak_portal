import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./config";

const Sidebar = () => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const storedUser = localStorage.getItem('user');
    const user = JSON.parse(storedUser);

    // const toggleDropdown = (id) => {
    //     setOpenDropdown(openDropdown === id ? null : id);
    // };

    // const handleLogout = () => {
    //     localStorage.clear();
    //     console.log("User logged out");
    // };

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('user') === null) {
            navigate('/')
        }
    }, [])

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await fetch(`${API_URL}/colleges/admin/${user.user_id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data)
                localStorage.setItem('myChannel', data[0].name);
                localStorage.setItem('myChannelId', data[0].college_id);
                if (data.length >= 1) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
                console.log(data.length);
            } catch (error) {
                console.error("Error fetching admin:", error);
            }
        };

        checkAdmin();
    }, [])

    return (
        <div>
            <head>

                {/* <meta charset="utf-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <meta name="description" content="" />
                <meta name="author" content="" />

                <title>SB Admin 2 - Blank</title>

                <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css" />
                <link
                    href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
                    rel="stylesheet" />
                <link href="css/sb-admin-2.min.css" rel="stylesheet" /> */}
            </head>

            {/* Sidebar */}
            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

                {/* Sidebar - Brand */}
                <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                    {/* <div className="sidebar-brand-icon rotate-n-15"> */}
                    {/* <i className="fas fa-laugh-wink"></i> */}
                    <div className="sidebar-brand-icon rotate-n-0">
                        <img src="../tantak_logo.png" height="40px" width="40px" alt="Background" style={{ borderRadius: '50%' }} />
                    </div>
                    <div className="sidebar-brand-text mx-3">E-LEARNING <sup>  </sup></div>
                </a>

                {/* Divider */}
                <hr className="sidebar-divider my-0" />

                {/* Nav Item - Dashboard */}
                <li className="nav-item">
                    <a className="nav-link" href="courses">
                        <i className="fas fa-fw fa-tachometer-alt"></i>
                        <span>Home</span></a>
                </li>

                {/* <!-- Divider --> */}
                {/* <hr className="sidebar-divider"> */}

                {/* <!-- Heading --> */}
                <div className="sidebar-heading">
                    Interface
                </div>

                {/* <!-- Nav Item - Pages Collapse Menu --> */}
                {isAdmin && (
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="mychannel" data-toggle="collapse" data-target="#collapseTwo"
                            aria-expanded="true" aria-controls="collapseTwo">
                            <i className="fas fa-fw fa-money-check"></i>
                            <span>Manage Channel</span>
                        </a>
                    </li>
                )}

                <li className="nav-item">
                    <a className="nav-link collapsed" href="account" data-toggle="collapse" data-target="#collapseTwo"
                        aria-expanded="true" aria-controls="collapseTwo">
                        <i className="fas fa-fw fa-money-check"></i>
                        <span>My Account</span>
                    </a>
                </li>

                {/* <!-- Nav Item - Utilities Collapse Menu --> */}
                <li className="nav-item">
                    <a className="nav-link collapsed" href="mycourses" data-toggle="collapse" data-target="#collapseUtilities"
                        aria-expanded="true" aria-controls="collapseUtilities">
                        <i className="fas fa-fw fa-tasks"></i>
                        <span>My Courses</span>
                    </a>
                </li>

                {/* <!-- Divider --> */}
                <hr className="sidebar-divider" />

                {/* <!-- Heading --> */}
                <div className="sidebar-heading">
                    Addons
                </div>

                {/* <!-- Nav Item - Pages Collapse Menu --> */}
                <li className="nav-item">
                    <a className="nav-link collapsed" href="myprofile" data-toggle="collapse" data-target="#collapseUtilities"
                        aria-expanded="true" aria-controls="collapseUtilities">
                        <i className="fas fa-fw fa-user"></i>
                        <span>My Profile</span>
                    </a>
                </li>

                {/* <!-- Nav Item - Charts --> */}
                <li className="nav-item">
                    <a className="nav-link" href="settings">
                        <i className="fas fa-fw fa-cog"></i>
                        <span>Settings  </span></a>
                </li>

                {/* <!-- Divider --> */}
                <hr className="sidebar-divider d-none d-md-block" />


                <div className="sidebar-card d-none d-lg-flex" style={{ position: 'absolute', bottom: '0', width: '12rem' }}>
                    <a className="text-center mb-2" href="/"
                        style={{ fontSize: 'small', color: 'azure', cursor: 'pointer' }}><strong>Logout</strong></a>
                </div>

            </ul>

        </div >
    );
}

export default Sidebar;
