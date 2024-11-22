import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import Topnav from "../TopNav";
import {  useNavigate } from 'react-router-dom';
import { API_URL } from "../config";
import { ClipLoader, BarLoader } from "react-spinners";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import '../Courses/Courses.css'

const ManageCourse = () => {
    const [dataSource, setDataSource] = useState([]);
    const [dataSource2, setDataSource2] = useState([]);
    // const [moduleId, setmoduleId] = useState(localStorage.getItem('moduleId'));
    const [courseId] = useState(localStorage.getItem('courseId'));
    const [userId] = useState(localStorage.getItem('userId'));
    const [channelName] = useState(localStorage.getItem('myChannel'));
    const [courseName] = useState(localStorage.getItem('courseName'));
    // const [channelId, setChannelId] = useState(localStorage.getItem('myChannelId'));
    const [showAddModal, setShowAddModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [teacher, setTeacher] = useState('');
    const [file, setFile] = useState('');
    const navigate = useNavigate();

    const fetchModules = async () => {
        try {
            const response = await fetch(`${API_URL}/modules/course/${courseId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDataSource(data);
        } catch (error) {
            console.error("Error fetching colleges:", error);
        }
    };

    const fetchSubscriptions = async () => {
        try {
            const response = await fetch(`${API_URL}/subscriptions/student/${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDataSource(data);
            console.log(dataSource)
        } catch (error) {
            console.error("Error fetching colleges:", error);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await fetch(`${API_URL}/modules/course/${courseId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDataSource2(data);
        } catch (error) {
            console.error("Error fetching colleges:", error);
        }
    };


    useEffect(() => {
        fetchModules();
        fetchSubscriptions();
        fetchCourses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('course_id', courseId);
            formData.append('name', name);
            formData.append('description', description);
            formData.append('instructor', teacher);
            if (file) {
                formData.append('file', file);
            }

            console.log([...formData]); // Log FormData entries for debugging

            // Upload Assignment
            const response = await fetch(`${API_URL}/modules/module`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Addition failed');

            setShowAddModal(false);
            Swal.fire({
                text: "Course added successfully!",
                icon: "success"
            });
            setIsLoading(false);

            fetchCourses();
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

    const handleFileUpload = (event) => {
        setFile(event.target.files[0]);
    };

    const handleEdit = (id) => {
        navigate(`/edit-member/${id}`);
    };

    const handleView = (id, name) => {
        navigate(`/manage/course/${id}`);
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

                                <h2 className="h4 mb-4 text-gray-800" style={{ textAlign: 'left' }}>{channelName} ({courseName})</h2>

                                <div className="row mb-4">
                                    <div className="col-xl-4 col-md-6 mb-4">
                                        <div className="card border-left-primary shadow h-100 py-2">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Status</div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">Active</div>
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
                                                        <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Total Modules</div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">$0.00</div>
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
                                                        <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">Total Subscribers</div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">$0.00</div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <i className="las la-exclamation-triangle fa-2x text-gray-300"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="d-sm-flex align-items-center justify-content-between mb-4">
                                    <h2 class="h4 mb-0 text-gray-800">Available Module</h2>
                                    <button onClick={openModal} class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                                        class="fas fa-upload fa-sm text-white-50"></i> Add Module</button>
                                </div>
                                <div style={{ height: '35rem', overflowY: 'auto' }}>
                                    <table className="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Description</th>
                                                <th>Price</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataSource2.map((element) => (
                                                <tr key={element.course_id}>
                                                    <td>{element.name} </td>
                                                    <td>{element.description}</td>
                                                    <td>{element.description}</td>
                                                    <td>
                                                    <div className="d-flex align-items-center">
                                                        <button type="button" className="btn btn-link" onClick={() => handleEdit(element.course_id)}>
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </button>
                                                        <button type="button" className="btn btn-link" onClick={() => handleView(element.course_id)}>
                                                            <FontAwesomeIcon icon={faEye} />
                                                        </button>
                                                    </div>
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

                {/* Submit Assignment Modal */}
                {showAddModal && (
                    <div className="modal fade show" style={{ display: 'block' }} onClick={() => setShowAddModal(false)}>
                        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', borderRadius: '8px' }}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Add Module</h5>
                                    <button type="button" className="close" onClick={() => setShowAddModal(false)}>&times;</button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label className="modal-label">Name</label>
                                            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="modal-label">Description</label>
                                            <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="modal-label">Teacher</label>
                                            <input type="text" className="form-control" value={teacher} onChange={(e) => setTeacher(e.target.value)} required />
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

export default ManageCourse;



