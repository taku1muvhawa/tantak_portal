import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import Topnav from "../TopNav";
import Footer from "../Footer";
import { API_URL } from "../config";
import { useNavigate } from 'react-router-dom';
import '../Courses/Courses.css'

const MyCourses = () => {
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState([]);
    // const [moduleId, setmoduleId] = useState(localStorage.getItem('moduleId'));
    const [userId] = useState(localStorage.getItem('userId'));
    const [countMod, setCouuntMod] = useState('');
    
    const fetchModules = async () => {
        try {
            const response = await fetch(`${API_URL}/subscriptions/student/${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDataSource(data);
            setCouuntMod(data.length);
        } catch (error) {
            console.error("Error fetching colleges:", error);
        }
    };

    useEffect(() => {
        fetchModules();
    }, []);

    const functionNavigate = (id) => {
        localStorage.setItem('moduleId', id);
        navigate('/dashboard');
    }

    return (
        <html lang="en">

            <body id="page-top">

                <div id="wrapper">

                    <Sidebar></Sidebar>

                    <div id="content-wrapper" className="d-flex flex-column" >
                        <div id="content">

                            <Topnav></Topnav>

                            <div className="container-fluid" style={{ textAlign: 'left', overflow: 'auto', maxHeight: '550px' }}>

                                <h1 className="h3 mb-4 text-gray-800" style={{ textAlign: 'left' }}>My Courses</h1>

                                <div className="row mb-4">
                                    <div className="col-xl-4 col-md-6 mb-4">
                                        <div className="card border-left-primary shadow h-100 py-2">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Total Modules Subscribed</div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">{countMod}</div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <i className="las la-money-bill-wave fa-2x text-gray-300"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xl-4 col-md-6 mb-4">
                                        <div className="card border-left-success shadow h-100 py-2">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Active Courses</div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">{countMod}</div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <i className="las la-clock fa-2x text-gray-300"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xl-4 col-md-6 mb-4">
                                        <div className="card border-left-danger shadow h-100 py-2">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">Courses Expiring Soon</div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">0</div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <i className="las la-exclamation-triangle fa-2x text-gray-300"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ height: '35rem', overflowY: 'auto' }}>
                                    <table className="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                        <thead>
                                            <tr>
                                                <th>Course</th>
                                                <th>Level</th>
                                                <th>Module</th>
                                                <th>Expiry Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataSource.map((element) => (
                                                <tr key={element.subscription_id}>
                                                    <td>{element.course_name} </td>
                                                    <td>{element.level_name} </td>
                                                    <td>{element.module_name}</td>
                                                    <td>{element.exp_date.slice(0, 10)}</td>
                                                    <td>
                                                        <button className="btn btn-primary" style={{height: '35px'}} onClick={()=> functionNavigate(element.module_id)}>
                                                            Enter
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>


                            </div>
                        </div>

                    </div>

                </div>

            </body>

        </html >
    );


};

export default MyCourses;



