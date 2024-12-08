import React, { useEffect, useState } from "react";
import Sidebar from "../../sidebar";
import Topnav from "../../TopNav";
import { API_URL, token } from "../../config";
import { ClipLoader, BarLoader } from "react-spinners";
import Swal from "sweetalert2";
import '../../Courses/Courses.css'
import { getCurrentDate } from "../../Components/DateFunction";
import { useNavigate } from "react-router-dom";

const Subscribers = () => {
    const [dataSource, setDataSource] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [moduleId] = useState(localStorage.getItem('moduleId'));
    const [userId] = useState(localStorage.getItem('userId'));
    const [channelId] = useState(localStorage.getItem('myChannelId'));
    const [adminId] = useState(localStorage.getItem('Admin'));
    const [teacherId] = useState(localStorage.getItem('teacher'));
    // const [accBal, setAccBal] = useState(0);
    // const [pendingBal, setPendingBal] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [hide, setHide] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        college_id: channelId,
        ecocash: '',
        amount: ''
    })


    const toggleSidebar = () => {
        setHide(prevHide => !prevHide); // Toggle the hide state
    };

    const fetchModules = async () => {
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
            // const data = await response.json();
            // setDataSource(data);
        } catch (error) {
            console.error("Error fetching colleges:", error);
        }
    };

    const fetchSubscriptions = async () => {
        try {
            const response = await fetch(`${API_URL}/subscriptions/student/${userId}`, {
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
            console.log(dataSource)
        } catch (error) {
            console.error("Error fetching colleges:", error);
        }
    };

    const fetchAccountBalance = async () => {
        try {
            const response = await fetch(`${API_URL}/account/bal/${channelId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token()}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // setAccBal(data.bal);
            setFormData(prevData => ({ ...prevData, amount: data.bal }));
        } catch (error) {
            console.error("Error fetching account balance:", error);
        }
    };

    const fetchPendingBalance = async () => {
        try {
            const response = await fetch(`${API_URL}/accpending/bal/${channelId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token()}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // setPendingBal(data.bal);
            setFormData(prevData => ({ ...prevData, amount: data.bal }));
        } catch (error) {
            console.error("Error fetching account balance:", error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await fetch(`${API_URL}/subscriptions/module/mod/${moduleId}/${getCurrentDate()}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token()}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error("Error fetching account balance:", error);
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetchModules();
        fetchSubscriptions();
        fetchAccountBalance();
        fetchPendingBalance();
    }, []);

    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = () => {
            if (userId === adminId || userId === teacherId) {
                setIsAdmin(true);
            }else{
                navigate('/courses');
            }
            console.log(isAdmin);
        };

        checkAdmin();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let response;
                response = await fetch(`${API_URL}/account/cashout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token()}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData),
                }); 
                if (!response.ok) throw new Error('Addition failed');
                setShowAddModal(false);
                Swal.fire({
                    text: "Added Successfully!",
                    icon: "success"
                });
                setIsLoading(false);
                setShowAddModal(false);

            fetchTransactions();
            fetchAccountBalance();
            fetchPendingBalance();
        } catch (error) {
            Swal.fire({
                text: error.message || "An error occurred!",
                icon: "error"
            });
            setIsLoading(false);
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

                            <div className="container-fluid" style={{ textAlign: 'left', overflow: 'auto', maxHeight: '550px', scrollbarWidth: 'none' }}>

                                <h1 className="h3 mb-4 text-gray-800" style={{ textAlign: 'left' }}>Subscribers ({transactions.length})</h1>
                                <div style={{ height: '35rem', overflowY: 'auto' }}>
                                    <table className="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Name</th>
                                                <th>Surname</th>
                                                <th>Email</th>
                                                <th>Exp Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map((element) => (
                                                <tr key={element.subscription_id}>
                                                    <td>{element.date.slice(0, 10)}</td>
                                                    <td>{element.student_name} </td>
                                                    <td>{element.student_surname}</td>
                                                    <td>{element.email}</td>
                                                    <td>{element.exp_date.slice(0, 10)}</td>
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
                                    <h5 className="modal-title">CASH OUT</h5>
                                    <button type="button" className="close" onClick={() => setShowAddModal(false)}>&times;</button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label className="modal-label">ECOCASH NUMBER:</label>
                                            <input type="number" className="form-control" value={formData.ecocash} onChange={(e) => setFormData(prevData => ({ ...prevData, ecocash: e.target.value }))}/>
                                        </div>
                                        <div className="form-group">
                                            <label className="modal-label">NAME (s)</label> 
                                            <input type="text" className="form-control" value={formData.accName} onChange={(e) => setFormData(prevData => ({ ...prevData, name: e.target.value }))} />
                                        </div>
                                        <div className="form-group">
                                            <label className="modal-label">SURNAME</label>
                                            <input type="text" className="form-control" value={formData.accSurname} onChange={(e) => setFormData(prevData => ({ ...prevData, surname: e.target.value }))}/>
                                        </div>
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

export default Subscribers;