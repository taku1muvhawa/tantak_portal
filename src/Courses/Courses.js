import React, { useEffect, useState } from "react"; // Import useState
import Sidebar from "../sidebar";
import Topnav from "../TopNav";
import { API_URL } from "../config";
import './Courses.css'

const Courses = () => {
    const [dataSource, setDataSource] = useState([]);

    const handleChannelClick = (id, name, admin_id) => {
        console.log(`Channel: ${name}`);
        localStorage.setItem('courseId',id );
        localStorage.setItem('Admin',admin_id );
    };

    const fetchColleges = async () => {
        try {
            const response = await fetch(`${API_URL}/colleges`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDataSource(data);
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
                                <h1 className="h3 mb-4 text-gray-800" style={{ textAlign: 'left' }}>Available Courses</h1>
                                <div style={{backgroundColor: 'white'}}>
                                    <div className="courses-table">
                                        {dataSource.map((element) => (
                                            <div className="course-item" key={element.college_id}>
                                                <img src={element.profile_pic} alt="" className="course-img" />
                                                <div className="course-info">
                                                    <a
                                                        href="/level"
                                                        style={{ color: "blue" }}
                                                        onClick={() => handleChannelClick( element.college_id, element.name, element.admin_id)}
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

                        {/* <!-- Footer --> */}
                        {/* <Footer></Footer> */}

                    </div>

                </div>

            </body>

        </html >
    );


};

export default Courses;



