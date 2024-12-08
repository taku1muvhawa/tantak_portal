import React, { useEffect, useState } from "react";
import Sidebar from "../../sidebar";
import Topnav from "../../TopNav";
import { useNavigate } from 'react-router-dom';
import { API_URL, token } from "../../config";
import { ClipLoader, BarLoader } from "react-spinners";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import '../../Courses/Courses.css'
import { getCurrentDate } from "../../Components/DateFunction";

const ManageCourse = () => {
    const [dataSource, setDataSource] = useState([]);
    const [dataSource2, setDataSource2] = useState([]);
    const [courseId] = useState(localStorage.getItem('courseId'));
    const [moduleId, setModuleId] = useState('');
    const [userId] = useState(localStorage.getItem('userId'));
    const [channelName] = useState(localStorage.getItem('myChannel'));
    const [courseName] = useState(localStorage.getItem('courseName'));
    const [subscribed, setSubscribed] = useState(false);
    const [textHeader, setTextHeader] = useState('');
    const [text, setText] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [teacher, setTeacher] = useState('');
    const [price, setPrice] = useState('');
    const [file, setFile] = useState('');
    const navigate = useNavigate();
    const [hide, setHide] = useState(false);

    const toggleSidebar = () => {
        setHide(prevHide => !prevHide); // Toggle the hide state
    };

    const fetchSubscriptions = async () => {
        try {
            const response = await fetch(`${API_URL}/subscriptions/course/mod/${courseId}/${getCurrentDate()}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token()}`, 
                }
            });
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

    const fetchModules = async () => {
        try {
            const response = await fetch(`${API_URL}/modules/course/${courseId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token()}`, 
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDataSource2(data);

            if (data.length < 1) {
                setSubscribed(false);
                setTextHeader(`No modules available in this course!`)
                setText(`To get started click "Add Module" 
                    button and enter module details. Then you can click the view icon 
                    to go to the module dashboard where you can add video lessons, assignments and notes
                    for the particular module. On the module dashboard you can also see the list of subscribes,
                    view submitted assignments and post results for each assignment.`)
            } else {
                setSubscribed(true);
            }
        } catch (error) {
            console.error("Error fetching modules:", error);
        }
    };


    useEffect(() => {
        fetchSubscriptions();
        fetchModules();

        if(!channelName){
            navigate('/courses')
        }
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
            formData.append('price', price);
            if (file) {
                formData.append('file', file);
            }

            console.log([...formData]); // Log FormData entries for debugging

            // Upload Module
            const response = await fetch(`${API_URL}/modules/module`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token()}`, 
                },
                body: formData,
            });

            if (!response.ok) throw new Error('Addition failed');
            const data = await response.json();
            if (data.status === '200') {
                setShowAddModal(false);
                Swal.fire({
                    text: "Module added successfully!",
                    icon: "success"
                });
                setIsLoading(false);

                fetchModules();
            } else {
                Swal.fire({
                    text: "Teacher email not found in the system. The teacher needs to create a account first at http://localhost:3000/register",
                    icon: "error"
                });
                setIsLoading(false);
            }
        } catch (error) {
            Swal.fire({
                text: error.message || "An error occurred!",
                icon: "error"
            });
            setIsLoading(false);
        }
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('course_id', courseId);
            formData.append('name', name);
            formData.append('description', description);
            formData.append('instructor', teacher);
            formData.append('price', price);
            // if (file) {
            //     formData.append('file', file);
            // }

            console.log([...formData]); // Log FormData entries for debugging

            // Upload Module
            const response = await fetch(`${API_URL}/modules/${moduleId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token()}`, 
                },
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to upload');
            const data = await response.json();

            console.log(data.status);
            if (data.status === '200') {
                setShowEditModal(false);
                Swal.fire({
                    text: "Updated successfully!",
                    icon: "success"
                });
                setIsLoading(false);

                fetchModules();
            } else {
                Swal.fire({
                    text: "Teacher email not found in the system. The teacher needs to create a account first at http://localhost:3000/register",
                    icon: "error"
                });
                setIsLoading(false);
            }

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

    const openEditModal = (element) => {
        setName(element.name);
        setDescription(element.description);
        setTeacher(element.email);
        setPrice(element.price);
        setModuleId(element.module_id);
        setShowEditModal(true);
    };

    const handleFileUpload = (event) => {
        setFile(event.target.files[0]);
    };

    const handleView = (id) => {
        localStorage.setItem('moduleId', id);
        localStorage.setItem('Admin', userId);
        navigate('/dashboard');
    };

    const handleDeleteModule = async (id) => {
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
                await fetch(`${API_URL}/modules/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token()}`, 
                    }
                });
                fetchModules();
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

    return (
        <html lang="en">

            <body id="page-top">

                <div id="wrapper">

                    <Sidebar hide={hide}></Sidebar>

                    <div id="content-wrapper" className="d-flex flex-column" >
                        <div id="content">

                            <Topnav toggleSidebar={toggleSidebar}></Topnav>

                            <div className="container-fluid" style={{ overflow: 'auto', maxHeight: '550px', scrollbarWidth: 'none' }}>

                                <h2 className="h4 mb-4 text-gray-800">{channelName} ({courseName})</h2>

                                <div className="row mb-4">
                                    <div className="col-xl-4 col-md-6 mb-4">
                                        <div className="card border-left-primary shadow h-100 py-2">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Course Status</div>
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
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">{dataSource2.length}</div>
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
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">{dataSource.length}</div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <i className="las la-exclamation-triangle fa-2x text-gray-300"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                    <h2 className="h4 mb-0 text-gray-800">Available Modules</h2>
                                    <button onClick={openModal} className="d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                                        className="fas fa-upload fa-sm text-white-50"></i> Add Module</button>
                                </div>
                                <div style={{ height: '35rem', overflowY: 'auto' }}>
                                    {subscribed && (
                                        <>
                                            <table className="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Description</th>
                                                        <th>Teacher</th>
                                                        <th>Price</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dataSource2.map((element) => (
                                                        <tr key={element.course_id}>
                                                            <td>{element.name} </td>
                                                            <td>{element.description}</td>
                                                            <td>{element.teacherName} {element.surname}</td>
                                                            <td>${element.price}</td>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <button type="button" className="btn btn-link" onClick={() => openEditModal(element)}>
                                                                        <FontAwesomeIcon icon={faEdit} />
                                                                    </button>
                                                                    <button type="button" className="btn btn-link" onClick={() => handleView(element.module_id)}>
                                                                        <FontAwesomeIcon icon={faEye} />
                                                                    </button>
                                                                    <button type="button" className="btn btn-link" onClick={() => handleDeleteModule(element.module_id)}>
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </button>
                                                                </div>
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
                                            <textarea type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="modal-label">Teacher's email</label>
                                            <input type="text" className="form-control" value={teacher} onChange={(e) => setTeacher(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="modal-label">Price</label>
                                            <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <div style={{ float: 'left' }}>
                                                <input type="file"
                                                    accept="image/*"
                                                    onChange={handleFileUpload} required />
                                                <small className="form-text text-muted" style={{ marginLeft: '-40px' }}>Upload an image for your module profile.</small>
                                            </div><br></br>
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

                {/* Edit Contribution Modal */}
                {showEditModal && (
                    <div className="modal fade show" style={{ display: 'block' }} onClick={() => setShowEditModal(false)}>
                        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', borderRadius: '8px' }}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Module</h5>
                                    <button type="button" className="close" onClick={() => setShowEditModal(false)}>&times;</button>
                                </div>
                                <form onSubmit={handleSubmitEdit}>
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
                                            <label className="modal-label">Price</label>
                                            <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
                                        </div>
                                        {/* <div className="form-group">
                                            <div style={{ float: 'left' }}>
                                                <input type="file" onChange={handleFileUpload} required />
                                            </div>
                                        </div><br></br> */}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Close</button>
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