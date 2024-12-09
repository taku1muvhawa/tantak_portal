import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import Topnav from "../TopNav";
import { API_URL, token } from "../config";
import Swal from "sweetalert2";
import { ClipLoader, BarLoader } from 'react-spinners';
import '../Courses/Courses.css'
import { getCurrentDate } from "../Components/DateFunction";
import { useNavigate } from "react-router-dom";

const Lessons = () => {
    const [dataSource, setDataSource] = useState([]);
    const [moduleId] = useState(localStorage.getItem('moduleId'));
    const [userId] = useState(localStorage.getItem('userId'));
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminId] = useState(localStorage.getItem('Admin'));
    const [teacherId] = useState(localStorage.getItem('teacher'));
    const [showAddModal, setShowAddModal] = useState(false);
    const [populated, setSubscribed] = useState(false);
    const [textHeader, setTextHeader] = useState('');
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lesson_no, setLesson_no] = useState('');
    const [topic, setTopic] = useState('');
    const [objectives, setObjectives] = useState('');
    const [release_date, setRelease_date] = useState('');
    const [file, setFile] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const navigate = useNavigate();

    const [hide, setHide] = useState(false);

    const toggleSidebar = () => {
        setHide(prevHide => !prevHide); // Toggle the hide state
    };

    useEffect(() => {
        if (localStorage.getItem('sd') !== "true") {
            navigate('/courses')
        }

    }, [])

    const fetchLessons = async () => {
        try {
            const response = await fetch(`${API_URL}/lessons/mod/${moduleId}`, {
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

            if (data.length < 1) {
                setSubscribed(false);
                setTextHeader(`No lessons available in this module!`)
                setText(`To get started click "Upload Lesson" 
                    button and enter lesson details and select lesson video.`)
            } else {
                setSubscribed(true);
            }
        } catch (error) {
            console.error("Error fetching colleges:", error);
        }
    };

    useEffect(() => {
        fetchLessons();
        setRelease_date(getCurrentDate());
    }, []);

    const checkSub = async () => {
        try {
            const response = await fetch(`${API_URL}/subscriptions/student/${userId}/${moduleId}/${getCurrentDate()}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token()}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.length < 1) {
                navigate('/courses');
            }
            console.log(data.length);
        } catch (error) {
            console.error("Error fetching colleges:", error);
        }
    };

    useEffect(() => {
        const checkAdmin = () => {
            if (userId === adminId || userId === teacherId) {
                setIsAdmin(true);
            } else {
                checkSub();
            }
        };

        checkAdmin();
    }, []);

    const handleFileUpload = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('module_id', moduleId);
            formData.append('lesson_no', lesson_no);
            formData.append('topic', topic);
            formData.append('objectives', objectives);
            formData.append('release_date', release_date);
            if (file) {
                formData.append('file', file);
            }

            console.log([...formData]); // Log FormData entries for debugging

            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${API_URL}/lessons/lesson`, true);
            xhr.setRequestHeader('Authorization', `Bearer ${token()}`);

            // Update progress event
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(percentComplete); // Update progress state
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    setShowAddModal(false);
                    Swal.fire({
                        text: "Lesson uploaded successfully!",
                        icon: "success"
                    });
                    fetchLessons();
                } else {
                    throw new Error('Addition failed');
                }
                setIsLoading(false);
            };

            xhr.onerror = () => {
                Swal.fire({
                    text: "An error occurred!",
                    icon: "error"
                });
                setIsLoading(false);
            };

            xhr.send(formData); // Send the form data

        } catch (error) {
            Swal.fire({
                text: error.message || "An error occurred!",
                icon: "error"
            });
            setIsLoading(false);
        }
    };

    const openModal = () => {
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        });

        if (result.isConfirmed) {
            try {
                await fetch(`${API_URL}/lessons/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token()}`
                    }
                });
                fetchLessons();
                Swal.fire({
                    text: "Deleted Successfully!",
                    icon: "success"
                });
            } catch (error) {
                Swal.fire({
                    text: "An error occurred while deleting!",
                    icon: "error"
                });
            }
        }
    };

    document.addEventListener(
        "contextmenu", function (e) {
            e.preventDefault();
        }, false
    )

    return (
        <html lang="en">

            <body id="page-top">

                <div id="wrapper">

                    <Sidebar hide={hide}></Sidebar>

                    <div id="content-wrapper" className="d-flex flex-column" >
                        <div id="content">

                            <Topnav toggleSidebar={toggleSidebar}></Topnav>

                            <div className="container-fluid" style={{ textAlign: 'left', overflow: 'auto', maxHeight: '550px' }}>

                                {isAdmin && (
                                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                        {/* <h1 className="h3 mb-0 text-gray-800"></h1> */}
                                        <div style={{ width: '100%' }}>
                                            <button onClick={openModal} style={{ float: 'right' }} className="d-sm-inline-block btn btn-sm btn-primary shadow-sm" ><i
                                                className="fas fa-upload fa-sm text-white-50"></i> Upload Lesson</button>
                                        </div>
                                    </div>
                                )}

                                <table className="lessons" style={{ width: '100%' }}>
                                    <thead>
                                        <th></th>
                                    </thead>
                                    {dataSource.map((element) => (
                                        <tbody key={element.Lesson_id}>
                                            <td>
                                                <h2 style={{ fontSize: '18px' }}>Lesson {element.lesson_no}
                                                    {isAdmin && (
                                                        <div style={{ width: '95%' }}>
                                                            <button className="btn btn-danger" style={{ float: 'right' }} onClick={() => handleDelete(element.lesson_id)}>Delete</button>
                                                        </div>
                                                    )}
                                                </h2>
                                                <h3 style={{ fontSize: '16px' }}>Topic: {element.topic}</h3>
                                                <h4 style={{ fontSize: '16px' }}>Objectives: {element.objectives}</h4>
                                                <video className="video" width="95%px" height="55%" controls controlsList="nodownload">
                                                    <source src={element.video} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            </td>
                                        </tbody>
                                    ))}
                                </table>

                                {!populated && isAdmin && (
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

                {/* Submit Assignment Modal */}
                {showAddModal && (
                    <div className="modal fade show" style={{ display: 'block' }} onClick={() => setShowAddModal(false)}>
                        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', borderRadius: '8px' }}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Upload Lession</h5>
                                    <button type="button" className="close" onClick={() => setShowAddModal(false)}>&times;</button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label className="modal-label">Lesson No</label>
                                            <input type="number" className="form-control" value={lesson_no} onChange={(e) => setLesson_no(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="modal-label">Topic</label>
                                            <input type="text" className="form-control" value={topic} onChange={(e) => setTopic(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="modal-label">Objectives</label>
                                            <textarea type="textarea" className="form-control" value={objectives} onChange={(e) => setObjectives(e.target.value)} required />
                                        </div>
                                        {/* <div className="form-group">
                                            <label className="modal-label">Release date</label>
                                            <input type="date" className="form-control" value={release_date} onChange={(e) => setRelease_date(e.target.value)} required />
                                        </div> */}
                                        <div className="form-group">
                                            <div style={{ float: 'left' }}>
                                                <input type="file"
                                                    accept="video/*"
                                                    onChange={handleFileUpload} required />
                                                <small className="form-text text-muted" style={{ marginLeft: '-165px' }}>Upload lesson video.</small>
                                            </div><br></br>
                                        </div><br></br>
                                        {isLoading && (
                                            <div className="form-group">
                                                {/* <label className="modal-label">File Upload Progress</label> */}
                                                <div style={{ width: '100%', height: '20px', backgroundColor: '#e0e0e0', borderRadius: '5px' }}>
                                                    <div style={{
                                                        width: `${uploadProgress}%`,
                                                        height: '100%',
                                                        backgroundColor: 'blue',
                                                        borderRadius: '5px',
                                                        transition: 'width 0.2s'
                                                    }}></div>
                                                </div>
                                                <small>{uploadProgress}%</small>
                                            </div>
                                        )}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Close</button>
                                        {isLoading && (
                                            <div style={{ marginTop: '8px', textAlign: 'center' }}>
                                                <div className="btn btn-primary" style={{ width: '5rem' }}>
                                                    <ClipLoader loading={isLoading} size={27} color="white" />
                                                </div>
                                            </div>
                                        )}
                                        {!isLoading && (
                                            <button type="submit" className="btn btn-primary">Submit</button>
                                        )}
                                    </div>
                                    {isLoading && (
                                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
                                            <BarLoader size={40} width={'100%'} color="blue" loading />
                                        </div>
                                    )}

                                </form>
                            </div>
                        </div>
                    </div>
                )}

            </body>

        </html >
    );


};

export default Lessons;