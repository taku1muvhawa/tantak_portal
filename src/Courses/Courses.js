import React, { useEffect, useState } from "react"; // Import useState
import Sidebar from "../sidebar";
import Topnav from "../TopNav";
import { API_URL, token } from "../config";
import './Courses.css'

const Courses = () => {
    const [dataSource, setDataSource] = useState([]);
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [search, setSearch] = useState('');
    const [hide, setHide] = useState(false);

    const toggleSidebar = () => {
        setHide(prevHide => !prevHide); // Toggle the hide state
    };

    const handleChannelClick = (id, name, admin_id) => {
        console.log(`Channel: ${name}`);
        localStorage.setItem('courseId', id);
        localStorage.setItem('Admin', admin_id);
    };

    const fetchColleges = async () => {
        try {
            const response = await fetch(`${API_URL}/colleges`, {
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
            setFilteredDataSource(data);
        } catch (error) {
            console.error("Error fetching colleges:", error);
        }
    };

    useEffect(() => {
        fetchColleges();
    }, []);

    useEffect(() => {
        const filtered = dataSource.filter(data =>
        (data.name.toLowerCase().includes(search.toLowerCase()) ||
            data.description.toLowerCase().includes(search.toLowerCase()))
        );
        // setDataSource(filtered);
        setFilteredDataSource(filtered)
    }, [search]);

    const handleSearch = (data) => {
        setSearch(data);
    }

    return (
        <html lang="en">

            <body id="page-top">

                <div id="wrapper">

                    <Sidebar hide={hide}></Sidebar>

                    <div id="content-wrapper" className="d-flex flex-column" >
                        <div id="content">

                            <Topnav handleSearch={handleSearch} toggleSidebar={toggleSidebar}></Topnav>

                            <div className="container-fluid" style={{ textAlign: 'left', overflow: 'auto', maxHeight: '550px' }}>

                                {/* <!-- Page Heading --> */}
                                {/* <h1>Data from child: {search}</h1> */}
                                <h1 className="h3 mb-4 text-gray-800" style={{ textAlign: 'left' }}>Available Colleges</h1>
                                <div style={{ backgroundColor: 'white' }}>
                                    <div className="courses-table">
                                        {filteredDataSource.map((element) => (
                                            <div className="course-item" key={element.college_id}>
                                                <img src={element.profile_pic} alt="" className="course-img" />
                                                <div className="course-info">
                                                    <a
                                                        href="/level"
                                                        style={{ color: "blue" }}
                                                        onClick={() => handleChannelClick(element.college_id, element.name, element.admin_id)}
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



