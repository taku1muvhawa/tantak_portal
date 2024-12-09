import React, { useEffect, useState } from "react"; // Import useState
import Sidebar from "../sidebar";
import Topnav from "../TopNav";
import { API_URL, token } from "../config";
import Swal from 'sweetalert2';
import { ClipLoader, BarLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import '../Courses/Courses.css';
import { getCurrentDate } from "../Components/DateFunction";
import { useNavigate } from "react-router-dom";

const Feedback2 = () => {
    const [dataSource, setDataSource] = useState([]);
    const [dataSource2, setDataSource2] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [moduleId] = useState(localStorage.getItem('moduleId'));
    const [userId] = useState(localStorage.getItem('userId'));
    const [adminId] = useState(localStorage.getItem('Admin'));
    const [teacherId] = useState(localStorage.getItem('teacher'));
    const [assignments, setAssignments] = useState([]);
    const [assignment_id, setAssignment_id] = useState([]);
    const [marked] = useState("F");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [file, setFile] = useState(null);
    const [hide, setHide] = useState(false);

    const toggleSidebar = () => {
        setHide(prevHide => !prevHide); // Toggle the hide state
    };

    // Search state for student selection
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('sd') !== "true") {
            navigate('/courses')
        } 

    }, [])

    const fetchAssignments = async () => {
        try {
            const response = await fetch(`${API_URL}/assignments/mod/${moduleId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token()}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAssignments(data);
        } catch (error) {
            console.error("Error fetching colleges:", error);
        }
    };

    const fetchMarkAssignments = async () => {
        try {
            const response = await fetch(`${API_URL}/feedback/marked/${moduleId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token()}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDataSource2(data);
            console.log(data)
        } catch (error) {
            console.error("Error fetching colleges:", error);
        }
    };

    const fetchSubAssignments = async () => {
        try {
            const response = await fetch(`${API_URL}/feedback/submitted/${moduleId}`, {
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
            console.log(data)
        } catch (error) {
            console.error("Error fetching colleges:", error);
        }
    };

    const fetchStudents = async () => {
        const response = await fetch(`${API_URL}/subscriptions/module/mod/${moduleId}/${getCurrentDate()}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token()}`
            }
        });
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
    };

    useEffect(() => {
        fetchSubAssignments();
        fetchMarkAssignments();
        fetchAssignments();
        fetchStudents();
    }, []);

    useEffect(() => {
        const matches = students.filter(student =>
            student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (student.student_surname && student.student_surname.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredStudents(matches);

    }, [searchTerm, students]);

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
            }else{
                checkSub();
            }
        };

        checkAdmin();
    }, []);

    const handleSubmitAssignmnt = () => {
        setShowAddModal(true);
    }

    const handleUploadAssignmnt = () => {
        setShowUploadModal(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('student_id', userId);
            formData.append('module_id', moduleId);
            formData.append('assignment_id', assignment_id);
            formData.append('marked', marked);
            if (file) {
                formData.append('file', file); // Append the file
            }

            // Upload Assignment
            const response = await fetch(`${API_URL}/feedback/assignment`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token()}`
                },
                body: formData, // Send FormData directly
            });

            if (!response.ok) throw new Error('Addition failed');
            setShowAddModal(false);
            Swal.fire({
                text: "Assignment uploaded successfully!",
                icon: "success"
            });

            setIsLoading(false);
            fetchSubAssignments(); // Fetch updated assignments
        } catch (error) {
            Swal.fire({
                text: error.message || "An error occurred!",
                icon: "error"
            });
            setIsLoading(false);
        }
    }
    const handleUpload = async (e) => {
        e.preventDefault();

        let marked2 = "T";

        try {
            const formData = new FormData();
            formData.append('student_id', studentId);
            formData.append('module_id', moduleId);
            formData.append('assignment_id', assignment_id);
            formData.append('marked', marked2);
            if (file) {
                formData.append('file', file); // Append the file
            }

            // Upload Assignment
            const response = await fetch(`${API_URL}/feedback/assignment`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token()}`
                },
                body: formData, // Send FormData directly
            });

            if (!response.ok) throw new Error('Addition failed');
            setShowUploadModal(false);
            Swal.fire({
                text: "Assignment uploaded successfully!",
                icon: "success"
            });

            fetchMarkAssignments(); // Fetch updated assignments
        } catch (error) {
            Swal.fire({
                text: error.message || "An error occurred!",
                icon: "error"
            });
        }
    }

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
                await fetch(`${API_URL}/feedback/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token()}`
                    },
                });
                fetchMarkAssignments();
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

                            <div className="container-fluid" style={{ textAlign: 'left', overflow: 'auto', maxHeight: '550px' }}>

                                {/* <!-- Page Heading --> */}
                                {/* <h1 className="h3 mb-4 text-gray-800" style={{ textAlign: 'left' }}>Marked Assignments</h1> */}

                                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                    <h1 className="h3 mb-0 text-gray-800">Feedback</h1>
                                    {!isAdmin && (
                                        <button onClick={handleSubmitAssignmnt} className="d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                                            className="fas fa-upload fa-sm text-white-50"></i> Submit Assignment</button>
                                    )}
                                    {isAdmin && (
                                        <button onClick={handleUploadAssignmnt} className="d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                                            className="fas fa-upload fa-sm text-white-50"></i> Upload Marked Assignment</button>
                                    )}
                                </div>

                                {/* Marked Assignments */}
                                <div className="card shadow mb-4">
                                    <div className="card-header py-3">
                                        <h6 className="m-0 font-weight-bold text-primary">Marked Assignments</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table" id="dataTable" width="100%" cellspacing="0">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Name</th>
                                                        <th>Surname</th>
                                                        <th>Topic</th>
                                                        <th>Type</th>
                                                        <th>Download</th>
                                                        <th>Delete</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dataSource2.map((element) => (
                                                        <tr key={element.feedback_id}>
                                                            <td>{element.date.slice(0, 10)}</td>
                                                            <td>{element.name}</td>
                                                            <td>{element.surname}</td>
                                                            <td>{element.topic}</td>
                                                            <td>{element.type}</td>
                                                            <td><a href={element.path}>download</a></td>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <button type="button" className="btn btn-link" onClick={() => handleDelete(element.feedback_id)}>
                                                                        <FontAwesomeIcon icon={faTrash} />
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
                                {/* <h1 className="h3 mb-4 text-gray-800" style={{ textAlign: 'left' }}>Submitted Assignments</h1> */}
                                {/* Submitted Assignments */}
                                <div className="card shadow mb-4">
                                    <div className="card-header py-3">
                                        <h6 className="m-0 font-weight-bold text-primary">Submitted Assignments</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table" id="dataTable" width="100%" cellspacing="0">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Name</th>
                                                        <th>Surname</th>
                                                        <th>Topic</th>
                                                        <th>Type</th>
                                                        <th>Download</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dataSource.map((element) => (
                                                        <tr key={element.feedback_id}>
                                                            <td>{element.date.slice(0, 10)}</td>
                                                            <td>{element.name}</td>
                                                            <td>{element.surname}</td>
                                                            <td>{element.topic}</td>
                                                            <td>{element.type}</td>
                                                            <td><a href={element.path}>download</a></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
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
                                    <h5 className="modal-title">Submit Assignment</h5>
                                    <button type="button" className="close" onClick={() => setShowAddModal(false)}>&times;</button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label className="modal-label">Assignment</label>
                                            <select
                                                className="form-control"
                                                value={assignment_id}
                                                onChange={(e) => setAssignment_id((e.target.value))}
                                                required
                                            >
                                                <option value="">Select Assignment</option>
                                                {assignments.map(assignment => (
                                                    <option key={assignment.assignment_id} value={assignment.assignment_id}>
                                                        {assignment.topic}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <div style={{ float: 'left' }}>
                                                <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
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

                {/* Upload Assignment Modal */}
                {showUploadModal && (
                    <div className="modal fade show" style={{ display: 'block' }} onClick={() => setShowUploadModal(false)}>
                        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', borderRadius: '8px' }}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Upload Marked Assignment</h5>
                                    <button type="button" className="close" onClick={() => setShowUploadModal(false)}>&times;</button>
                                </div>
                                <form onSubmit={handleUpload}>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label className="modal-label">Student</label>
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                placeholder="Search either by Name or Surname"
                                                style={{ backgroundColor: '#c3f3f580' }}
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                            <select
                                                className="form-control"
                                                value={studentId}
                                                onChange={(e) => setStudentId(e.target.value)}
                                                required
                                            >
                                                <option value="">Select Student</option>
                                                {filteredStudents.map(student => (
                                                    <option key={student.subscription_id} value={student.student_id}>
                                                        {student.student_name} {student.student_surname}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="modal-label">Assignment</label>
                                            <select
                                                className="form-control"
                                                value={assignment_id}
                                                onChange={(e) => setAssignment_id((e.target.value))}
                                                required
                                            >
                                                <option value="">Select Assignment</option>
                                                {assignments.map(assignment => (
                                                    <option key={assignment.assignment_id} value={assignment.assignment_id}>
                                                        {assignment.topic}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <div style={{ float: 'left' }}>
                                                <input type="file"
                                                    accept=".doc, .doxc, .pdf, .txt, .ppt, .pptx"
                                                    onChange={(e) => setFile(e.target.files[0])} required />
                                                <small className="form-text text-muted" style={{ marginLeft: '-175px' }}>Upload document.</small>
                                            </div><br></br>
                                        </div><br></br>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>Close</button>
                                        <button type="submit" className="btn btn-primary">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

            </body>

        </html >
    );


};

export default Feedback2;