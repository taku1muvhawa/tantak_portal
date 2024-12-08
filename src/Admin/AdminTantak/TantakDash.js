import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../../sidebar";
import Topnav from "../../TopNav";
import { API_URL, token } from "../../config";
import { ClipLoader, BarLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import '../../Courses/Courses.css'

const TantakDash = () => {
    // const [dataSource, setDataSource] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [adminTtransactions, setAdminTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    // const [moduleId] = useState(localStorage.getItem('moduleId'));
    // const [userId] = useState(localStorage.getItem('userId'));
    // const [channelId] = useState(localStorage.getItem('myChannelId'));
    const userRole = localStorage.getItem('userRole');
    const [accBal, setAccBal] = useState(0);
    const [tantakBal, setTantakBal] = useState(0);
    const [pendingBal, setPendingBal] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPending, setShowPending] = useState(false);
    const [showAdTran, setShowAdTran] = useState(false);
    const navigate = useNavigate();
    const [hide, setHide] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        college_id: 0,
        ecocash: '',
        amount: ''
    });


    const toggleSidebar = () => {
        setHide(prevHide => !prevHide); // Toggle the hide state
    };

    const fetchAdTransactions = async () => {
        try {
            const response = await fetch(`${API_URL}/account/transactions/0`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token()}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAdminTransactions(data);
        } catch (error) {
            console.error("Error fetching account balance:", error);
        }
    };

    const fetchAdBalance = async () => {
        try {
            const response = await fetch(`${API_URL}/account/bal/0`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token()}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTantakBal(data.bal);
            setFormData(prevData => ({ ...prevData, amount: data.bal }));
        } catch (error) {
            console.error("Error fetching account balance:", error);
        }
    };

    const fetchPendingBalance = async () => {
        try {
            const response = await fetch(`${API_URL}/account/acc/pending/bal`, {
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
            // setFormData(prevData => ({ ...prevData, amount: data.bal }));
        } catch (error) {
            console.error("Error fetching account balance:", error);
        }
    };

    const fetchAccountBalances = async () => {
        try {
            const response = await fetch(`${API_URL}/account/admin/college/all/bal`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token()}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAccounts(data);
            console.log("AccBalArray", data)
        } catch (error) {
            console.error("Error fetching account balance:", error);
        }
    };

    useEffect(() => {
        fetchPendingBalance();
        fetchAccountBalances();
        fetchAdTransactions();
        fetchAdBalance();

        if(!userRole){
            navigate('/courses')
        }
    }, []);

    const displayAcc = () => {
        setShowPending(false);
        setShowAdTran(false);
    }

    const displayAdminAcc = () => {
        setShowAdTran(true);
    }

    const displayPending = () => {
        setShowPending(true);
        setShowAdTran(false);
    }

    const handleSubmit = async (data) => {
        // e.preventDefault();
        setIsLoading(true);

        let formData2 = {
            college_id: data.college_id,
            amount: data.balance,
            details: data.details
        }

        console.log(formData2);

        try {
            let response;
            // Add new contribution
            response = await fetch(`${API_URL}/accpending/settle/acc`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData2),
            });
            if (!response.ok) throw new Error('Addition failed');
            setShowAddModal(false);
            Swal.fire({
                text: "Settled Successfully!",
                icon: "success"
            });
            setIsLoading(false);
            // setShowAddModal(false);

            fetchPendingBalance();
        } catch (error) {
            Swal.fire({
                text: error.message || "An error occurred!",
                icon: "error"
            });
            setIsLoading(false);
        }
    };

    const calculateAccBal = useCallback(() => {
        const totalSum = accounts.reduce((sum, pending) => sum + pending.balance, 0);
        setAccBal(totalSum);
    }, [accounts]);

    useEffect(() => {
        calculateAccBal();
    }, [accounts, calculateAccBal]);

    const calculateTotals = useCallback(() => {
        const totalSum = transactions.reduce((sum, pending) => sum + pending.balance, 0);
        setPendingBal(totalSum);
    }, [transactions]);

    useEffect(() => {
        calculateTotals();
    }, [transactions, calculateTotals]);

    const handleSettle = async (element) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        });

        if (result.isConfirmed) {
            try {
                handleSubmit(element);
            } catch (error) {
                Swal.fire({
                    text: "An error occurred while deleting!",
                    icon: "error"
                });
            }
        }
    };

    const openModal = () => {
        if (tantakBal < 10) {
            Swal.fire({
                text: "The minimum cashout amount is $10",
                icon: "warning"
            });
        } else {
            setShowAddModal(true);
        }
    }

    const handleSubmit2 = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log(formData);
        try {
            let response;
            // Add new contribution
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

                                {/* <h1 className="h3 mb-4 text-gray-800" style={{ textAlign: 'left' }}>College Account</h1> */}

                                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                    <h1 className="h3 mb-0 text-gray-800">TANTAK ADMIN</h1>
                                    <div >
                                        <button onClick={displayAdminAcc} className=" d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                                            Show Admin Acc
                                        </button> &nbsp;
                                        {showPending && (
                                            <button onClick={displayAcc} className=" d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                                                Show College Accounts
                                            </button>
                                        )}
                                        {!showPending && (
                                            <button onClick={displayPending} className=" d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                                                Show Pending Settlements
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="row mb-4">
                                    <div className="col-xl-4 col-md-6 mb-4">
                                        <div className="card border-left-primary shadow h-100 py-2">
                                            <div className="card-body">
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col mr-2">
                                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">TANTAK Balance</div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">${tantakBal}</div>
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
                                                        <div className="text-xs font-weight-bold text-success text-uppercase mb-1">College Balances</div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">${accBal}</div>
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
                                                        <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">Pending Payment</div>
                                                        <div className="h5 mb-0 font-weight-bold text-gray-800">{pendingBal}</div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <i className="las la-exclamation-triangle fa-2x text-gray-300"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div style={{ height: '35rem', overflowY: 'auto' }}>

                                    {showPending && !showAdTran && (
                                        <>
                                            <h1 className="h3 mb-4 text-gray-800" style={{ textAlign: 'left' }}>Pending Settlements</h1>
                                            <table className="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>College</th>
                                                        <th>details</th>
                                                        <th>Balance</th>
                                                        <th>Settle</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {transactions.map((element) => (
                                                        <tr key={element.account_id}>
                                                            <td>{element.date.slice(0, 10)} </td>
                                                            <td>{element.name}</td>
                                                            <td>
                                                                {element.details}
                                                            </td>
                                                            <td>${element.balance}</td>
                                                            <td>
                                                                <button onClick={() => handleSettle(element)} className="btn btn-primary">Settle</button>
                                                            </td>
                                                        </tr>

                                                    ))}
                                                </tbody>
                                            </table>
                                        </>
                                    )}

                                    {!showPending && !showAdTran && (
                                        <>
                                            <h1 className="h3 mb-4 text-gray-800" style={{ textAlign: 'left' }}>College Balances</h1>
                                            <table className="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Admin ID</th>
                                                        <th>Balance</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {accounts.map((element) => (
                                                        <tr key={element.college_id}>
                                                            <td>{element.name}</td>
                                                            <td>{element.admin_id}</td>
                                                            <td>${element.balance}</td>
                                                        </tr>

                                                    ))}
                                                </tbody>
                                            </table>
                                        </>
                                    )}

                                    {showAdTran && (
                                        <>
                                            {/* <h1 className="h3 mb-4 text-gray-800" style={{ textAlign: 'left' }}>Admin Transactions</h1>
                                            <button onClick={openModal} className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                                                Cash Out
                                            </button> */}

                                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                                <h1 className="h3 mb-0 text-gray-800">Admin Transactions</h1>
                                                <button onClick={openModal} className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                                                    Cash Out
                                                </button>
                                            </div>

                                            <table className="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Details</th>
                                                        <th>Cash In</th>
                                                        <th>Cash Out</th>
                                                        <th>Balance</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {adminTtransactions.map((element) => (
                                                        <tr key={element.account_id}>
                                                            <td>{element.date.slice(0, 10)} </td>
                                                            <td>
                                                                {element.reason}: <br></br>
                                                                Subscriber: {element.student_id} <br></br>
                                                                {element.course_id} - {element.module_id}
                                                            </td>
                                                            <td>${element.cash_in}</td>
                                                            <td>${element.cash_out}</td>
                                                            <td>${element.balance}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
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
                                    <h5 className="modal-title">CASH OUT</h5>
                                    <button type="button" className="close" onClick={() => setShowAddModal(false)}>&times;</button>
                                </div>
                                <form onSubmit={handleSubmit2}>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label className="modal-label">ECOCASH NUMBER:</label>
                                            <input type="number" className="form-control" value={formData.ecocash} onChange={(e) => setFormData(prevData => ({ ...prevData, ecocash: e.target.value }))} />
                                        </div>
                                        <div className="form-group">
                                            <label className="modal-label">NAME (s)</label>
                                            <input type="text" className="form-control" value={formData.accName} onChange={(e) => setFormData(prevData => ({ ...prevData, name: e.target.value }))} />
                                        </div>
                                        <div className="form-group">
                                            <label className="modal-label">SURNAME</label>
                                            <input type="text" className="form-control" value={formData.accSurname} onChange={(e) => setFormData(prevData => ({ ...prevData, surname: e.target.value }))} />
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

export default TantakDash;



