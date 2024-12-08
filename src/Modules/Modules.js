import React, { useEffect, useState } from "react"; // Import useState
import Sidebar from "../sidebar";
import Topnav from "../TopNav";
import { API_URL, token } from "../config";
import '../Courses/Courses.css'

const Modules = () => {
    const [dataSource, setDataSource] = useState([]);
    const [levelId] = useState(localStorage.getItem('levelId'))
    const [countLevel, setCountLevel] = useState(true);
    const [courseName, setCourseName] = useState('...Loading');
    const [hide, setHide] = useState(false);

    const toggleSidebar = () => {
        setHide(prevHide => !prevHide); // Toggle the hide state
    };

    const handleChannelClick = (id, teacher, price) => {
        localStorage.setItem('moduleId',id );
        localStorage.setItem('teacher',teacher );
        localStorage.setItem('price',price );
    };

    const checkCourseName = async () => {
        try {
            const response = await fetch(`${API_URL}/courses/${levelId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token()}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCourseName(data[0].name);
        } catch (error) {
            console.error("Error fetching colleges:", error);
        }
    }

    const fetchModules = async () => {
        try {
            const response = await fetch(`${API_URL}/modules/course/${levelId}`, {
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
            if(data.length < 1){
                setCountLevel(false);
            }
        } catch (error) {
            console.error("Error fetching colleges:", error);
        }
    };

    useEffect(() => {
        checkCourseName();
        fetchModules();
    }, []);

    return (
        <html lang="en">

            <body id="page-top">

                <div id="wrapper">

                    <Sidebar hide={hide}></Sidebar>

                    <div id="content-wrapper" className="d-flex flex-column" >
                        <div id="content">

                            <Topnav title={courseName} toggleSidebar={toggleSidebar}></Topnav>

                            <div className="container-fluid" style={{ textAlign: 'left', overflow: 'auto', maxHeight: '550px' }}>

                                {/* <!-- Page Heading --> */}
                                <h1 className="h3 mb-4 text-gray-800" style={{ textAlign: 'left' }}>Select Module</h1>
                                {!countLevel && (
                                    <p style={{ fontSize: '18px', textAlign: 'center' }}><b>No Modules Available!</b></p>
                                )}
                                <div style={{backgroundColor: 'white'}}>
                                    <div className="courses-table">
                                        {dataSource.map((element) => (
                                            <div className="course-item" key={element.module_id}>
                                                <img src={element.profile_pic} alt="" className="course-img" />
                                                <div className="course-info">
                                                    <a
                                                        href="/dashboard"
                                                        style={{ color: "blue" }}
                                                        onClick={() => handleChannelClick(element.module_id, element.teacher, element.price)}
                                                    >
                                                        {element.name}
                                                    </a>
                                                    <br />
                                                    <span>{element.description}</span>
                                                    <span><b> Subcription Fee ${element.price} per month</b></span>
                                                </div>
                                            </div>
                                        ))}
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

export default Modules;



