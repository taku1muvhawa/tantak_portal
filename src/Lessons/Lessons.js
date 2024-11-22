import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import Topnav from "../TopNav";
import { API_URL } from "../config";
import Swal from "sweetalert2";
import { ClipLoader, BarLoader } from 'react-spinners';
import '../Courses/Courses.css'

const Lessons = () => {
    const [dataSource, setDataSource] = useState([]);
    const [moduleId] = useState(localStorage.getItem('moduleId'));
    const [userId] = useState(localStorage.getItem('userId'));
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminId] = useState(localStorage.getItem('Admin'));
    const [teacherId] = useState(localStorage.getItem('teacher'));
    const [showAddModal, setShowAddModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [lesson_no, setLesson_no] = useState('');
    const [topic, setTopic] = useState('');
    const [objectives, setObjectives] = useState('');
    const [release_date, setRelease_date] = useState('');
    const [file, setFile] = useState('');

    const fetchLessons = async () => {
        try {
            const response = await fetch(`${API_URL}/lessons/mod/${moduleId}`);
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
        fetchLessons();
    }, []);

    useEffect(() => {
        const checkAdmin = () => {
            if (userId === adminId || userId === teacherId) {
                setIsAdmin(true);
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

            // Upload Assignment
            const response = await fetch(`${API_URL}/lessons/lesson`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Addition failed');

            setShowAddModal(false);
            Swal.fire({
                text: "Assignment uploaded successfully!",
                icon: "success"
            });
            setIsLoading(false);

            fetchLessons();
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

    return (
        <html lang="en">

            <body id="page-top">

                <div id="wrapper">

                    <Sidebar></Sidebar>

                    <div id="content-wrapper" className="d-flex flex-column" >
                        <div id="content">

                            <Topnav></Topnav>

                            <div className="container-fluid" style={{ textAlign: 'left', overflow: 'auto', maxHeight: '550px' }}>

                                {isAdmin && (
                                    <div class="d-sm-flex align-items-center justify-content-between mb-4">
                                        <h1 class="h3 mb-0 text-gray-800"></h1>
                                        <button onClick={openModal} class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                                            class="fas fa-upload fa-sm text-white-50"></i> Upload Lesson</button>
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
                                                            <button className="btn btn-danger" style={{ float: 'right' }}>Delete</button>
                                                        </div>
                                                    )}
                                                </h2>
                                                <h3 style={{ fontSize: '16px' }}>Topic: {element.topic}</h3>
                                                <h4 style={{ fontSize: '16px' }}>Objectives: {element.objectives}</h4>
                                                <video className="video" width="95%px" height="55%" controls>
                                                    <source src={element.video} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            </td>
                                        </tbody>
                                    ))}
                                </table>

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
                                            <input type="textarea" className="form-control" value={objectives} onChange={(e) => setObjectives(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="modal-label">Release date</label>
                                            <input type="date" className="form-control" value={release_date} onChange={(e) => setRelease_date(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <div style={{ float: 'left' }}>
                                                <input type="file" onChange={handleFileUpload} required />
                                            </div>
                                        </div><br></br>
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



