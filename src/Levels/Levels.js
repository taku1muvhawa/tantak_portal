import React, { useEffect, useState } from "react"; // Import useState
import Sidebar from "../sidebar";
import Topnav from "../TopNav";
import { API_URL, token } from "../config";
import '../Courses/Courses.css'

const Levels = () => {
    const [dataSource, setDataSource] = useState([]);
    const [courseId] = useState(localStorage.getItem('courseId'));
    const [countLevel, setCountLevel] = useState(true);
    const [collegeName, setCollegeName] = useState('...Loading');
    const [hide, setHide] = useState(false);

    const toggleSidebar = () => {
        setHide(prevHide => !prevHide); // Toggle the hide state
    };

    // useEffect({
    //     setCourseId(localStorage.getItem('courseId'))
    // },[])

    const checkCollegeName = async () => {
        try {
            const response = await fetch(`${API_URL}/colleges/${courseId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token()}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCollegeName(data[0].name);
        } catch (error) {
            console.error("Error fetching colleges:", error);
        }
    }

    const handleChannelClick = (id) => {
        localStorage.setItem('levelId', id);
    };

    const fetchColleges = async () => {
        try {
            const response = await fetch(`${API_URL}/courses/college/${courseId}`, {
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
        checkCollegeName();
        fetchColleges();
    }, []);

    return (
        <html lang="en">

            <body id="page-top">

                <div id="wrapper">

                    <Sidebar hide={hide}></Sidebar>

                    <div id="content-wrapper" className="d-flex flex-column" >
                        <div id="content">

                            <Topnav title={collegeName} toggleSidebar={toggleSidebar}></Topnav>

                            <div className="container-fluid" style={{ textAlign: 'left', overflow: 'auto', maxHeight: '550px' }}>

                                {/* <!-- Page Heading --> */}
                                <h1 className="h3 mb-4 text-gray-800" style={{ textAlign: 'left' }}>Select Course</h1> 
                                {!countLevel && (
                                    <p style={{ fontSize: '18px', textAlign: 'center' }}><b>No Courses Available!</b></p>
                                )}
                                <div style={{ backgroundColor: 'white' }}>
                                    <div className="courses-table">
                                        {dataSource.map((element) => (
                                            <div className="course-item" key={element.college_id}>
                                                <img src={element.profile_pic} alt="" className="course-img" />
                                                <div className="course-info">
                                                    <a
                                                        href="/modules"
                                                        style={{ color: "blue" }}
                                                        onClick={() => handleChannelClick(element.course_id)}
                                                    >
                                                        {element.name}
                                                    </a>
                                                    <br />
                                                    <span>{element.description}</span>
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

export default Levels;