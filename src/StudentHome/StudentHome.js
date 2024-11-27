import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import Topnav from "../TopNav";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faVideo,
    faClipboardList,
    faStickyNote,
    faClipboardCheck
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../config";
import { expDate } from "../Components/ExpDate";
import Swal from "sweetalert2";
import { ClipLoader } from 'react-spinners';

const StudentHome = () => {

    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [moduleId] = useState(localStorage.getItem('moduleId'));
    const [courseId] = useState(localStorage.getItem('moduleId'));
    const [userId] = useState(localStorage.getItem('userId'));
    const [price] = useState(localStorage.getItem('price'));
    const [lessonCount, setLessonCount] = useState('');
    const [assignmentCount, setAssignmentCount] = useState('');
    const [noteCount, setNoteCount] = useState('');
    const [resultCount, setResultCount] = useState('');
    const [feedbackCount, setFeedbackCount] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subState, setSubState] = useState('...loading');

    const [isAdmin, setIsAdmin] = useState(false);
    const [adminId] = useState(localStorage.getItem('Admin'));
    const [teacherId] = useState(localStorage.getItem('teacher'));

    const [subscription, setSubscription] = useState('...Loading')

    //Subcription
    const [formData] = useState({
        course_id: courseId,
        module_id: moduleId,
        student_id: userId,
        amount: price,
        exp_date: expDate()
    });

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const lessonResponse = await fetch(`${API_URL}/lessons/mod/${moduleId}`);
                const lesson = await lessonResponse.json();
                setLessonCount(lesson.length);
                setDataSource(lesson);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            try {
                const assignmentResponse = await fetch(`${API_URL}/assignments/mod/${moduleId}`);
                const assignment = await assignmentResponse.json();
                setAssignmentCount(assignment.length);

                const noteResponse = await fetch(`${API_URL}/notes/mod/${moduleId}`);
                const note = await noteResponse.json();
                setNoteCount(note.length);

                const resultResponse = await fetch(`${API_URL}/results/mod/${moduleId}/${userId}`);
                const result = await resultResponse.json();
                setResultCount(result.length);

                const feedbackResponse = await fetch(`${API_URL}/feedback/marked/${moduleId}/${userId}`);
                const feedback = await feedbackResponse.json();
                setFeedbackCount(feedback.length);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        expDate();
        fetchCounts();
    }, []);

    const functionLessons = () => {
        if (isSubscribed) {
            navigate('/lessons');
        } else {
            Swal.fire({
                text: "Subscribe to access this feature!",
                icon: "warning"
            });
        }
    }

    const functionAssignments = () => {
        if (isSubscribed) {
            navigate('/assignments');
        } else {
            Swal.fire({
                text: "Subscribe to access this feature!",
                icon: "warning"
            });
        }
    }

    const functionNotes = () => {
        if (isSubscribed) {
            navigate('/notes');
        } else {
            Swal.fire({
                text: "Subscribe to access this feature!",
                icon: "warning"
            });
        }
    }

    const functionResults = () => {
        if (isSubscribed) {
            navigate('/results');
        } else {
            Swal.fire({
                text: "Subscribe to access this feature!",
                icon: "warning"
            });
        }
    }

    const functionFeedback = () => {
        if (isSubscribed) {
            navigate('/feedback');
        } else {
            Swal.fire({
                text: "Subscribe to access this feature!",
                icon: "warning"
            });
        }
    }

    const checkSub = async () => {
        try {
            const response = await fetch(`${API_URL}/subscriptions/student/${userId}/${moduleId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.length >= 1) {
                setIsSubscribed(true);
                setSubscription('Subscribed');
            } else {
                // setIsSubscribed(false);
                setSubscription('Not Subscribed')
                setSubState('Subscribe to access all the features')
            }
            console.log(data.length);
        } catch (error) {
            console.error("Error fetching colleges:", error);
        }
    };


    // useEffect(() => {
    //     checkSub();
    // }, [])

    useEffect(() => {
        const checkAdmin = () => {
            if (userId === adminId || userId === teacherId) {
                setIsAdmin(true);
                console.log(isAdmin);
                setIsSubscribed(true);
                setSubscription('Admin');
            }else{
                checkSub();
            }
        };

        checkAdmin();
    }, []);

    const handleSubscribe = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        console.log(formData);

        window.location.href = `${API_URL}/initiate-payment/${formData.course_id}/${formData.module_id}/${formData.student_id}/${formData.amount}/${formData.exp_date}`;

        // try {
        //     // Post results
        //     const response = await fetch(`${API_URL}/initiate-payment`, {
        //         method: 'GET',
        //         headers: { 'Content-Type': 'application/json' },
        //         // body: JSON.stringify(formData),
        //     });

        //     if (!response.ok) throw new Error('Subscription failed');
        // } catch (error) {
        //     Swal.fire({
        //         text: error.message || "An error occurred!",
        //         icon: "error"
        //     });
        // }
    }


    return (

        <html lang="en">

            <body id="page-top">

                <div id="wrapper">

                    <Sidebar></Sidebar>

                    <div id="content-wrapper" className="d-flex flex-column">
                        <div id="content" style={{ backgroundColor: 'rgba(217, 224, 224, 0.863)' }}>

                            <Topnav></Topnav>

                            <div className="container-fluid" style={{ textAlign: 'left', overflow: 'auto', maxHeight: '550px', scrollbarWidth: 'none' }}>

                                {!isSubscribed ?
                                    <div>
                                        <h4>{subState}</h4>
                                    </div>
                                    : null}

                                <div className="cards">
                                    <div className="card-single">
                                        <div>
                                            <h2>{lessonCount}</h2>
                                            <span style={{ fontSize: '22px', fontWeight: 'bold' }}>Lessons</span>
                                        </div>
                                        <div>
                                            {/* <span><img src="../../assets/Icons/BoardIcon.png" width="40px" height="40px" /></span> */}
                                            <span>
                                                <FontAwesomeIcon icon={faVideo} className="icon-xl" style={{ fontSize: '1.8rem', color: '#004d00' }} />
                                            </span>
                                            <div>
                                                <div>
                                                    <p></p>
                                                </div>
                                                <button onClick={functionLessons}>Enter<span></span></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-single">
                                        <div>
                                            <h2>{assignmentCount}</h2>
                                            <span style={{ fontSize: '22px', fontWeight: 'bold' }}>Assignments</span>
                                        </div>
                                        <div>
                                            {/* <span><img src="../../assets/Icons/BoardIcon.png" width="40px" height="40px" /></span> */}
                                            <span>
                                                <FontAwesomeIcon icon={faClipboardList} className="icon-xl" style={{ fontSize: '1.8rem', color: '#004d00' }} />
                                            </span>
                                            <div>
                                                <div>
                                                    <p></p>
                                                </div>
                                                <button onClick={functionAssignments}>Enter<span></span></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-single">
                                        <div>
                                            <h2>{noteCount}</h2>
                                            <span style={{ fontSize: '22px', fontWeight: 'bold' }}>Notes</span>
                                        </div>
                                        <div>
                                            {/* <span><img src="../../assets/Icons/BoardIcon.png" width="40px" height="40px" /></span> */}
                                            <span>
                                                <FontAwesomeIcon icon={faStickyNote} className="icon-xl" style={{ fontSize: '1.8rem', color: '#004d00' }} />
                                            </span>
                                            <div>
                                                <div>
                                                    <p></p>
                                                </div>
                                                <button onClick={functionNotes}>Enter<span></span></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-single">
                                        <div>
                                            <h2>{resultCount}</h2>
                                            <span style={{ fontSize: '22px', fontWeight: 'bold' }}>Results</span>
                                        </div>
                                        <div>
                                            {/* <span><img src="../../assets/Icons/BoardIcon.png" width="40px" height="40px" /></span> */}
                                            <span>
                                                <FontAwesomeIcon icon={faClipboardCheck} className="icon-xl" style={{ fontSize: '1.8rem', color: '#004d00' }} />
                                            </span>
                                            <div>
                                                <div>
                                                    <p></p>
                                                </div>
                                                <button onClick={functionResults}>Enter<span></span></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-single">
                                        <div>
                                            <h2>{feedbackCount}</h2>
                                            <span style={{ fontSize: '22px', fontWeight: 'bold' }}>Feedback</span>
                                        </div>
                                        <div>
                                            {/* <span><img src="../../assets/Icons/BoardIcon.png" width="40px" height="40px" /></span> */}
                                            <span>
                                                <FontAwesomeIcon icon={faClipboardList} className="icon-xl" style={{ fontSize: '1.8rem', color: '#004d00' }} />
                                            </span>
                                            <div>
                                                <div>
                                                    <p></p>
                                                </div>
                                                <button onClick={functionFeedback}>Enter<span></span></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-single">
                                        <div>
                                            <h4 style={{ fontSize: '25px', fontWeight: 'lighter' }}>{subscription}</h4> <p></p>
                                            <span style={{ fontSize: '22px', fontWeight: 'bold' }}>Subscription</span>
                                        </div>
                                        <div>
                                            {/* <span><img src="../../assets/Icons/BoardIcon.png" width="40px" height="40px" /></span> */}
                                            <span>
                                                <FontAwesomeIcon icon={faUsers} className="icon-xl" style={{ fontSize: '1.8rem', color: '#004d00' }} />
                                            </span>
                                            <div>
                                                <div>
                                                    <p></p>
                                                </div>
                                                {!isSubscribed && !isLoading && (
                                                    <button onClick={handleSubscribe} style={{ backgroundColor: 'white', color: '#675dc5', borderColor: '#675dc5' }}>Subscribe<span></span></button>
                                                )}
                                                {isLoading && (
                                                    <div style={{ marginTop: '8px', textAlign: 'center' }}>
                                                        <div className="btn" style={{ width: '5rem' }}>
                                                            <ClipLoader loading={isLoading} size={27} color="white" />
                                                        </div>
                                                    </div>
                                                )}
                                                {isSubscribed && (
                                                    <button style={{ backgroundColor: 'white', color: '#675dc5', borderColor: '#675dc5' }}>Subscribed<span></span></button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row" style={{ width: '100%', marginTop: '20px' }}>
                                    <div className="topics-grid">
                                        <div className="none">
                                            <div className="Projects">
                                                <div className="card" style={{ minHeight: '8rem' }}>
                                                    <div className="card-header">
                                                        <h3 style={{ fontSize: '30px', fontWeight: 'bold' }}>Topics Available</h3>
                                                        <button
                                                            style={{ backgroundColor: 'blue', borderColor: 'blue' }}>See
                                                            All<span className="las la-arrow-right"></span></button>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="table-responsive">
                                                            <table className="table" id="dataTable" width="100%" cellspacing="0">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Lesson No</th>
                                                                        <th>Topic</th>
                                                                        <th>Status</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {dataSource.map((element) => (
                                                                        <tr key={element.lesson_id}>
                                                                            <td>{element.lesson_no} </td>
                                                                            <td>{element.topic}</td>
                                                                            <td>Available</td>
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
                                    <div className="notifications-grid">
                                        <div >
                                            <div className="card">
                                                <div className="card-header">
                                                    <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Notifications</h3>
                                                    <button style={{ backgroundColor: 'blue', borderColor: 'blue' }}>See All<span
                                                        className="las la-arrow-right"></span></button>
                                                </div>
                                                <div className="card-body">
                                                    <div className="customer">
                                                        <h4 style={{ padding: '5px', fontSize: '17px' }}>No Notifications Available</h4>
                                                    </div>

                                                    <div>
                                                        <span className="las la-user-circle"></span>
                                                        <span className="las la-user-comment"></span>
                                                        <span className="las la-user-phone"></span>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

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

export default StudentHome;