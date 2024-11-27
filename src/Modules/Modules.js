import React, { useEffect, useState } from "react"; // Import useState
import Sidebar from "../sidebar";
import Topnav from "../TopNav";
import { API_URL } from "../config";
import '../Courses/Courses.css'

const Modules = () => {
    const [dataSource, setDataSource] = useState([]);
    const [levelId] = useState(localStorage.getItem('levelId'))
    const [countLevel, setCountLevel] = useState(true);

    const handleChannelClick = (id, teacher, price) => {
        localStorage.setItem('moduleId',id );
        localStorage.setItem('teacher',teacher );
        localStorage.setItem('price',price );
    };

    const fetchModules = async () => {
        try {
            const response = await fetch(`${API_URL}/modules/course/${levelId}`);
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
        fetchModules();
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
                                <h1 className="h3 mb-4 text-gray-800" style={{ textAlign: 'left' }}>Select Module</h1>
                                {!countLevel && (
                                    <h4 className="h3 mb-4 text-gray-800" style={{ textAlign: 'left' }}>No Modules Available</h4>
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



