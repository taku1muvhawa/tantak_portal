import React, { useEffect, useState } from "react"; // Import useState
import Sidebar from "../sidebar";
import Topnav from "../TopNav";
import Footer from "../Footer";
import { API_URL } from "../config";
import Swal from "sweetalert2";
import '../Courses/Courses.css'

const Results = () => {
    const [dataSource, setDataSource] = useState([]);
    const [moduleId] = useState(localStorage.getItem('moduleId'));
    const [userId] = useState(localStorage.getItem('userId'));
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminId] = useState(localStorage.getItem('Admin'));
    const [teacherId] = useState(localStorage.getItem('teacher'));
    const [showAddModal, setShowAddModal] = useState(false);

    // Search state for student selection
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [students, setStudents] = useState([]);
    // const [studentId, setStudentId] = useState([]);

    const [assignments, setAssignments] = useState([]);
    // const [assignment_id, setAssignment_id] = useState([]);
    const [totalPM, setTotalPM] = useState('');

    const [formData, setFormData] = useState({
        module_id: moduleId,
        student_id: '',
        assignment_id: '',
        marks: '',
        total_possible: '',
        percentage: '',
        grade: ''
    });

    const fetchResults = async () => {
        try {
            const response = await fetch(`${API_URL}/results/mod/${moduleId}/${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDataSource(data);
        } catch (error) {
            console.error("Error fetching colleges:", error);
        }
    };

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

    const fetchStudents = async () => {
        const response = await fetch(`${API_URL}/subscriptions/module/mod/1`);
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
    };

    useEffect(() => {
        fetchResults();
        fetchStudents();
        fetchAssignments();
    }, []);

    useEffect(() => {
        const checkAdmin = () => {
            if (userId == adminId || userId == teacherId) {
                setIsAdmin(true);
            }
        };

        checkAdmin();
    }, []);

    useEffect(() => {
        const matches = students.filter(student =>
            student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (student.student_surname && student.student_surname.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredStudents(matches);

    }, [searchTerm, students]);

    const openModal = () => {
        setShowAddModal(true);
    };

    useEffect(() => {
        let percentage = (formData.marks / totalPM) * 100;

        setFormData(prevData => ({ ...prevData, total_possible: totalPM }));
        setFormData(prevData => ({ ...prevData, percentage: percentage }));
    }, [totalPM])

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData);

        try {
            // Post results
            const response = await fetch(`${API_URL}/results`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Addition failed');
            setShowAddModal(false);
            Swal.fire({
                text: "Posted successfully!",
                icon: "success"
            });

            fetchResults(); // Fetch updated assignments
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
                                {!isAdmin ? (
                                    <h1 className="h3 mb-4 text-gray-800">Results</h1>
                                ) : (
                                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                        <h1 className="h3 mb-0 text-gray-800">Results</h1>
                                        <button onClick={openModal} className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                                            <i className="fas fa-upload fa-sm text-white-50"></i> Post Results
                                        </button>
                                    </div>
                                )}


                                {/* TABLE TEXT */}
                                <div class="card shadow mb-4">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-primary">Results Table</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive">
                                            <table class="table" id="dataTable" width="100%" cellspacing="0">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Assignment</th>
                                                        <th>Marks</th>
                                                        <th>Percentage</th>
                                                        <th>Grade</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dataSource.map((element) => (
                                                        <tr key={element.result_id}>
                                                            <td>{element.date.slice(0, 10)}</td>
                                                            <td>{element.assignment_id}</td>
                                                            <td>{element.marks} / {element.total_possible}</td>
                                                            <td>{element.percentage}%</td>
                                                            <td>{element.grade}</td>
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
                                    <h5 className="modal-title">Post Results</h5>
                                    <button type="button" className="close" onClick={() => setShowAddModal(false)}>&times;</button>
                                </div>
                                <form onSubmit={handleSubmit}>
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
                                                // value={studentId}
                                                // onChange={(e) => setStudentId(e.target.value)}
                                                value={formData.student_id}
                                                onChange={(e) => setFormData(prevData => ({ ...prevData, student_id: e.target.value }))}
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
                                                // value={assignment_id}
                                                // onChange={(e) => setAssignment_id((e.target.value))}
                                                value={formData.assignment_id}
                                                onChange={(e) => setFormData(prevData => ({ ...prevData, assignment_id: e.target.value }))}
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
                                            <label className="modal-label">Marks</label>
                                            <input type="number" className="form-control" value={formData.marks} onChange={(e) => setFormData(prevData => ({ ...prevData, marks: e.target.value }))} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="modal-label">Total Possible Marks</label>
                                            <input type="number" className="form-control" value={totalPM} onChange={(e) => setTotalPM(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="modal-label">Grade</label>
                                            <input type="text" className="form-control" value={formData.grade} onChange={(e) => setFormData(prevData => ({ ...prevData, grade: e.target.value }))} required />
                                        </div>

                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Close</button>
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

export default Results;