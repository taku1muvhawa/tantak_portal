import React, { useEffect, useState } from "react"; // Import useState
import Sidebar from "../sidebar";
import Topnav from "../TopNav";
import { API_URL } from "../config";
import '../Courses/Courses.css'

const Levels = () => {
    const [dataSource, setDataSource] = useState([]);
    const [courseId] = useState(localStorage.getItem('courseId'));
    const [countLevel, setCountLevel] = useState(true);

    // useEffect({
    //     setCourseId(localStorage.getItem('courseId'))
    // },[])

    const handleChannelClick = (id) => {
        localStorage.setItem('levelId', id);
    };

    const fetchColleges = async () => {
        try {
            const response = await fetch(`${API_URL}/courses/college/${courseId}`);
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
        fetchColleges();
    }, []);

    return (
        <html lang="en">

            <body id="page-top">

                <div id="wrapper">

                    <Sidebar></Sidebar>

                    <div id="content-wrapper" className="d-flex flex-column" >
                        <div id="content">

                            <Topnav></Topnav>

                            <div className="container-fluid" style={{ textAlign: 'left', overflow: 'auto', maxHeight: '550px' }}>

                                {/* <!-- Page Heading --> */}
                                <h1 className="h3 mb-4 text-gray-800" style={{ textAlign: 'left' }}>Select Course</h1>
                                {!countLevel && (
                                    <h4 className="h3 mb-4 text-gray-800" style={{ textAlign: 'left' }}>No Course levels Available</h4>
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