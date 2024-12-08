import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import Topnav from "../TopNav";
import { API_URL, token } from "../config";
import { useNavigate } from 'react-router-dom';
import '../Courses/Courses.css'
import { expDate } from "../Components/ExpDate";

const MyClasses = () => {
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState([]);
    // const [moduleId, setmoduleId] = useState(localStorage.getItem('moduleId'));
    const [userId] = useState(localStorage.getItem('userId'));
    const [countMod, setCouuntMod] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [textHeader, setTextHeader] = useState('');
    const [text, setText] = useState('');
    const [hide, setHide] = useState(false);

    const toggleSidebar = () => {
        setHide(prevHide => !prevHide); // Toggle the hide state
    };

    const fetchModules = async () => {
        try {
            const response = await fetch(`${API_URL}/modules/teacher/${userId}}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token()}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('ExpDate: ', expDate())
            setDataSource(data);
            setCouuntMod(data.length);

            if (data.length < 1) {
                setSubscribed(false);
                setTextHeader(`Welcome to TANTAK e-learning portal.`)
                setText(`To get started click "Explore Colleges" 
                    in the sidebar and select available colleges and courses`)
            } else {
                setSubscribed(true);
            }

        } catch (error) {
            console.error("Error fetching colleges:", error);
        }
    };

    useEffect(() => {
        fetchModules();
    }, []);

    const functionNavigate = (id) => {
        localStorage.setItem('moduleId', id);
        localStorage.setItem('Admin', userId);
        navigate('/dashboard');
    }

    return (
        <html lang="en">

            <body id="page-top">

                <div id="wrapper">

                    <Sidebar hide={hide}></Sidebar>

                    <div id="content-wrapper" className="d-flex flex-column" >
                        <div id="content">

                            <Topnav title="My Classes" toggleSidebar={toggleSidebar}></Topnav>

                            <div className="container-fluid" style={{ textAlign: 'left', overflow: 'auto', maxHeight: '550px', scrollbarWidth: 'none' }}>

                                {/* <h1 className="h3 mb-4 text-gray-800" style={{ textAlign: 'left' }}>My Classes</h1> */}

                                <div className="row mb-4">
                                    <div className="col-xl-4 col-md-6 mb-4">
                                        <div className="card border-left-primary shadow h-100 py-2">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Total Modules</div>
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
                                                        <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Active Modules</div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">{countMod}</div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <i className="las la-clock fa-2x text-gray-300"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    
                                </div>

                                <div style={{ height: '35rem', overflowY: 'auto' }}>
                                    {subscribed && (
                                        <>
                                            <table className="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                                <thead>
                                                    <tr>
                                                        <th>College</th>
                                                        <th>Course</th>
                                                        <th>Module</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dataSource.map((element) => (
                                                        <tr key={element.module_id}> 
                                                            <td>{element.course_name} </td>
                                                            <td>{element.level_name} </td>
                                                            <td>{element.module_name}</td>
                                                            <td>
                                                                <button className="btn btn-primary" style={{ height: '35px' }} onClick={() => functionNavigate(element.module_id)}>
                                                                    Enter
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </>
                                    )}
                                    {!subscribed && (
                                        <>
                                            <div>
                                                <p style={{ fontSize: '18px', textAlign: 'center' }}><b>{textHeader}</b></p>
                                                <p style={{ fontSize: '16px', textAlign: 'center' }}>{text}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </body>

        </html >
    );


};

export default MyClasses;



