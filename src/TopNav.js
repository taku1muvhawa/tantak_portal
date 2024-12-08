import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Topnav = ({ handleSearch, title, toggleSidebar }) => {

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [search, setSearch] = useState("");

    // const [header, setHeader] = useState("");
    // const [checkHeader, setCheckHeader] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('user') === null) {
            navigate('/')
        } else {
            const storedUser = localStorage.getItem('user');
            const user = JSON.parse(storedUser);

            setName(user.name);
            setSurname(user.Surname);
            setEmail(user.email);

            localStorage.setItem('userId', user.user_id)
        }
        if (sessionStorage.getItem('token') === null) {
            navigate('/')
        }
    }, [])

    useEffect(() => {
        sendData();
    }, [search])

    const sendData = () => {
        if (handleSearch) {
            handleSearch(search);
        }
    }

    // document.addEventListener(
    //     "contextmenu", function(e)
    //     {
    //         e.preventDefault();
    //     }, false
    // )

    return (
        <>
            {/* <!-- Topbar --> */}
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                {/* <!-- Sidebar Toggle (Topbar) --> */}
                <button id="sidebarToggleTop"
                    className="btn btn-link d-md-none rounded-circle mr-3"
                    onClick={toggleSidebar}
                >
                    <i className="fa fa-bars"></i>
                </button>

                {/* <!-- Topbar Search --> */}

                {!title && (
                    <>
                        <form
                            className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                            <div className="input-group">
                                <input type="text" className="form-control bg-light border-0 small"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search for..."
                                    aria-label="Search" aria-describedby="basic-addon2" />
                                <div className="input-group-append">
                                    <button className="btn btn-primary" type="button">
                                        <i className="fas fa-search fa-sm"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </>
                )}


                {title && (
                    <>
                        <h4 className="h4 mb-2 text-gray-800" style={{ textAlign: 'left' }}> &nbsp; {title}</h4>
                    </>
                )}

                {/* <!-- Topbar Navbar --> */}
                <ul className="navbar-nav ml-auto">

                    {/* <!-- Nav Item - Search Dropdown (Visible Only XS) --> */}
                    <li className="nav-item dropdown no-arrow d-sm-none">
                        <a className="nav-link dropdown-toggle" href="0" id="searchDropdown" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fas fa-search fa-fw"></i>
                        </a>
                        {/* <!-- Dropdown - Messages --> */}
                        <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                            aria-labelledby="searchDropdown">
                            <form className="form-inline mr-auto w-100 navbar-search">
                                <div className="input-group">
                                    <input type="text" className="form-control bg-light border-0 small"
                                        placeholder="Search for..." aria-label="Search"
                                        aria-describedby="basic-addon2" />
                                    <div className="input-group-append">
                                        <button className="btn btn-primary" type="button">
                                            <i className="fas fa-search fa-sm"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </li>

                    <div className="topbar-divider d-none d-sm-block"></div>

                    {/* <!-- Nav Item - User Information --> */}
                    <li className="nav-item dropdown no-arrow">
                        <a className="nav-link dropdown-toggle" href="0" id="userDropdown" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img className="img-profile rounded-circle mr-2"
                                src="img/undraw_profile.svg" alt="img" />
                            <div style={{ textAlign: 'left' }}>
                                <span className="mr-2 d-none d-lg-inline text-gray-600 small" >{name} {surname} <br></br> {email}</span> <br></br>
                            </div>
                        </a>
                    </li>

                </ul>

            </nav>
            {/* <!-- End of Topbar --> */}
        </>
    );
}

export default Topnav;