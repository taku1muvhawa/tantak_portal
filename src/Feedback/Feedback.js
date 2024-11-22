import React, { useEffect, useState } from "react"; // Import useState
import Sidebar from "../sidebar";
import Topnav from "../TopNav";
import { API_URL } from "../config";
import Swal from 'sweetalert2';
import { ClipLoader, BarLoader } from 'react-spinners';
import '../Courses/Courses.css'

const Feedback = () => {
    const [dataSource, setDataSource] = useState([]);
    const [dataSource2, setDataSource2] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [moduleId, setmoduleId] = useState(localStorage.getItem('moduleId'));
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const [adminId, setAdminId] = useState(localStorage.getItem('Admin'));
    const [teacherId, setTeacherId] = useState(localStorage.getItem('teacher'));
    const [assignments, setAssignments] = useState([]);
    const [assignment_id, setAssignment_id] = useState([]);
    const [marked, setMarked] = useState("F");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [file, setFile] = useState(null);

    // Search state for student selection
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState([]);

    const fetchAssignments = async () => {
        try {
            const response = await fetch(`${API_URL}/assignments/mod/${moduleId}`);
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
            const response = await fetch(`${API_URL}/feedback/marked/${moduleId}/${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDataSource2(data);
        } catch (error) {
            console.error("Error fetching colleges:", error);
        }
    };

    const fetchSubAssignments = async () => {
        try {
            const response = await fetch(`${API_URL}/feedback/submitted/${moduleId}/${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDataSource(data);
        } catch (error) {
            console.error("Error fetching colleges:", error);
        }
    };

    const fetchStudents = async () => {
        const response = await fetch(`${API_URL}/subscriptions/module/mod/1`);
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

    useEffect(() => {
        const checkAdmin = () => {
            if (userId == adminId || userId == teacherId) {
                setIsAdmin(true);
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
                                {/* <h1 className="h3 mb-4 text-gray-800" style={{ textAlign: 'left' }}>Marked Assignments</h1> */}

                                <div class="d-sm-flex align-items-center justify-content-between mb-4">
                                    <h1 class="h3 mb-0 text-gray-800">Feedback</h1>
                                    {!isAdmin && (
                                        <button onClick={handleSubmitAssignmnt} class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                                            class="fas fa-upload fa-sm text-white-50"></i> Submit Assignment</button>
                                    )}
                                    {isAdmin && (
                                        <button onClick={handleUploadAssignmnt} class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                                            class="fas fa-upload fa-sm text-white-50"></i> Upload Marked Assignment</button>
                                    )}
                                </div>

                                {/* Marked Assignments */}
                                <div class="card shadow mb-4">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-primary">Marked Assignments</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive">
                                            <table class="table" id="dataTable" width="100%" cellspacing="0">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Topic</th>
                                                        <th>Type</th>
                                                        <th>Download</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dataSource2.map((element) => (
                                                        <tr key={element.feedback_id}>
                                                            <td>{element.date.slice(0, 10)}</td>
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
                                {/* <h1 className="h3 mb-4 text-gray-800" style={{ textAlign: 'left' }}>Submitted Assignments</h1> */}
                                {/* Submitted Assignments */}
                                <div class="card shadow mb-4">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-primary">Submitted Assignments</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive">
                                            <table class="table" id="dataTable" width="100%" cellspacing="0">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Topic</th>
                                                        <th>Type</th>
                                                        <th>Download</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dataSource.map((element) => (
                                                        <tr key={element.feedback_id}>
                                                            <td>{element.date.slice(0, 10)}</td>
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
                                                <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
                                            </div>
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

export default Feedback;



