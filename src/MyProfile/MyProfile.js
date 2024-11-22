import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import Topnav from "../TopNav";
import '../MyProfile/MyProfile.css'

const MyProfile = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if (localStorage.getItem('user') === null) {
        } else {
            const storedUser = localStorage.getItem('user');
            const user = JSON.parse(storedUser);

            setName(user.name);
            setSurname(user.Surname);
            setEmail(user.email);
            setPhone(user.phone);

            localStorage.setItem('userId', user.user_id)
        }
    }, [])

    return (
        <html lang="en">

            <body id="page-top">

                <div id="wrapper">

                    <Sidebar></Sidebar>

                    <div id="content-wrapper" className="d-flex flex-column" >
                        <div id="content">

                            <Topnav></Topnav>

                            <div className="container-fluid" style={{ textAlign: 'left', overflow: 'auto', maxHeight: '550px', scrollbarWidth: 'none', background: 'white' }}>

                                <h1 className="h3 mb-4 text-gray-800" style={{ textAlign: 'left' }}>My Profile</h1>

                                <div class="user-wrapper">
                                    <div class="row">
                                        <div class="col-md-4 d-flex align-items-center justify-content-center">
                                            <img src="http://localhost:3003/file/avator.PNG" alt="Profile Picture" />
                                        </div>
                                        <div class="col-md-8">
                                            <h4>Name: {name}</h4>
                                            <p></p>
                                            <h4>Surname: {surname}</h4> 
                                            <p></p>
                                            <h4>Email: {email}</h4>
                                            <p></p>
                                            <h4>Phone: {phone}</h4> 
                                            <p></p>
                                            <h4>Status: Active</h4>
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

export default MyProfile;



