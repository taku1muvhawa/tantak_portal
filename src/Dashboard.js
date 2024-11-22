import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faChurch,
    faCalendarAlt,
    // faPeopleArrows,
} from '@fortawesome/free-solid-svg-icons';
import Footer from "./Footer";
import Sidebar from "./sidebar";
import Topnav from "./TopNav";
import { API_URL } from "./config";

const Dashboard = () => {
    const [memberCount, setMemberCount] = useState(0);
    const [ministryCount, setMinistryCount] = useState(0);
    const [ministryMemCount, setMinistryMemCount] = useState(0);
    const [eventCount, setEventCount] = useState(0);
    const [cellGroupCount, setCellGroupCount] = useState(0); 
    const [cellGroupMemCount, setCellGroupMem] = useState(0); 
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const memberResponse = await fetch(`${API_URL}/members/all/Active`);
                const members = await memberResponse.json();
                setMemberCount(members.length);

                const ministryResponse = await fetch(`${API_URL}/ministries`);
                const ministries = await ministryResponse.json();
                setMinistryCount(ministries.length);

                const ministryMemResponse = await fetch(`${API_URL}/ministrymembers`);
                const ministryMem = await ministryMemResponse.json();
                setMinistryMemCount(ministryMem.length);

                const eventResponse = await fetch(`${API_URL}/events-tasks`);
                const eventsData = await eventResponse.json();

                // Sort events by date and get the top 10 latest events
                const sortedEvents = eventsData.sort((a, b) => new Date(b.Date) - new Date(a.Date)).slice(0, 10);
                setEvents(sortedEvents);
                setEventCount(sortedEvents.length);

                // Fetch cell groups count
                const cellGroupResponse = await fetch(`${API_URL}/smallgroups`);
                const cellGroups = await cellGroupResponse.json();
                setCellGroupCount(cellGroups.length);

                const cellGroupMemResponse = await fetch(`${API_URL}/membersmallgrp`);
                const cellGroupMem = await cellGroupMemResponse.json();
                setCellGroupMem(cellGroupMem.length);

                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchCounts();
    }, []);

    return (
        <html lang="en">
            <body>
                <div className="wrapper">
                    <Sidebar />
                    <div className="main-panel">
                        <Topnav />

                        <div className="container">
                            <div className="page-inner">
                                <div>
                                    <h2 style={{textAlign: 'left'}}>Admin Dashboard</h2>
                                </div>
                                <div className="row">
                                    <div className="col-md-3 grid-margin stretch-card">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center justify-content-between flex-wrap mb-4">
                                                    <div>
                                                        <p className="mb-2 text-md-center text-lg-left">Total Members</p>
                                                        <h1 className="mb-0">{memberCount}</h1>
                                                    </div>
                                                    <FontAwesomeIcon icon={faUsers} className="icon-xl" style={{ fontSize: '2.5rem', color: '#004d00' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 grid-margin stretch-card">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center justify-content-between flex-wrap mb-4">
                                                    <div>
                                                        <p className="mb-2 text-md-center text-lg-left">Total Ministries</p>
                                                        <h1 className="mb-0">{ministryCount}</h1>
                                                    </div>
                                                    <FontAwesomeIcon icon={faChurch} className="icon-xl" style={{ fontSize: '2.5rem', color: '#004d00' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 grid-margin stretch-card">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center justify-content-between flex-wrap mb-4">
                                                    <div>
                                                        <p className="mb-2 text-md-center text-lg-left">Members in Ministries</p>
                                                        <h1 className="mb-0">{ministryMemCount}</h1>
                                                    </div>
                                                    <FontAwesomeIcon icon={faUsers} className="icon-xl" style={{ fontSize: '2.5rem', color: '#004d00' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 grid-margin stretch-card">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center justify-content-between flex-wrap mb-4">
                                                    <div>
                                                        <p className="mb-2 text-md-center text-lg-left">Total Cell Groups</p> 
                                                        <h1 className="mb-0">{cellGroupCount}</h1> 
                                                    </div>
                                                    <FontAwesomeIcon icon={faUsers} className="icon-xl" style={{ fontSize: '2.5rem', color: '#004d00' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-3 grid-margin stretch-card">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center justify-content-between flex-wrap mb-4">
                                                    <div>
                                                        <p className="mb-2 text-md-center text-lg-left">Members in Cells</p>
                                                        <h1 className="mb-0">{cellGroupMemCount}</h1>
                                                    </div>
                                                    <FontAwesomeIcon icon={faUsers} className="icon-xl" style={{ fontSize: '2.5rem', color: '#004d00' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 grid-margin stretch-card">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center justify-content-between flex-wrap mb-4">
                                                    <div>
                                                        <p className="mb-2 text-md-center text-lg-left">Total Events</p>
                                                        <h1 className="mb-0">{eventCount}</h1>
                                                    </div>
                                                    <FontAwesomeIcon icon={faCalendarAlt} className="icon-xl" style={{ fontSize: '2.5rem', color: '#004d00' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12">
                                    <h3 style={{textAlign: 'left'}}>Upcoming Events</h3>
                                        <div className="card">
                                            <div className="table-responsive pt-3">
                                                <table className="table table-striped events-table">
                                                    <thead>
                                                        <tr>
                                                            {/*<th>Event ID</th> */}
                                                            <th>Name</th>
                                                            <th>Description</th>
                                                            <th>Date</th>
                                                            <th>Time</th>
                                                            <th>Location</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {events.map(event => (
                                                            <tr key={event.EventID}>
                                                                {/* <td>{event.EventID}</td> */}
                                                                <td>{event.type}</td>
                                                                <td>{event.description}</td>
                                                                <td>{new Date(event.date).toLocaleDateString()}</td>
                                                                <td>{event.time}</td>
                                                                <td>{event.location}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <footer className="footer">
                                <Footer />
                            </footer>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
};

export default Dashboard;
