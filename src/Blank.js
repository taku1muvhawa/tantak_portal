import Footer from "./Footer";
import Sidebar from "./sidebar";
import Topnav from "./TopNav";

const Blank = () => {
    return (

        <html lang="en">

            <body id="page-top">

                <div id="wrapper">

                    <Sidebar></Sidebar>

                    <div id="content-wrapper" className="d-flex flex-column">
                        <div id="content">

                            <Topnav></Topnav>

                            <div className="container-fluid">

                                {/* <!-- Page Heading --> */}
                                <h1 className="h3 mb-4 text-gray-800" style={{textAlign: 'left'}}>Blank Page</h1>

                            </div>

                        </div>

                        {/* <!-- Footer --> */}
                       <Footer></Footer>

                    </div>

                </div>

            </body>

        </html>
    );
};

export default Blank;