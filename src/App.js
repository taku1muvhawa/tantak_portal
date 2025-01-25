import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Onboarding/Register';
import Courses from './Courses/Courses';
import Blank from './Blank';
import Levels from './Levels/Levels';
import Modules from './Modules/Modules';
import StudentHome from './StudentHome/StudentHome';
import Lessons from './Lessons/Lessons';
import Assignments from './Assignments/Assignments';
import Notes from './Notes/Notes';
import Results from './Results/Results';
import Feedback from './Feedback/Feedback';
import MyAccount from './MyAccount/MyAccount';
import MyCourses from './MyCourses/MyCourses';
import MyProfile from './MyProfile/MyProfile';
import Settings from './Settings/Settings';
import ManageChannel from './CollegeAdmin/ManageChannel/ManageChannel';
import ManageCourse from './CollegeAdmin/ManageCourse/ManageCourse';
import TeacherReg from './CollegeAdmin/TeacherReg/TeacherReg';
import CollegeAccount from './CollegeAdmin/CollegeAccount/CollegeAccount';
import Feedback2 from './Feedback/Feedback2';
import Results2 from './Results/Results2';
import Subscribers from './CollegeAdmin/Subscribers/Subscribers';
import MyClasses from './MyClasses/MyClasses';
import TantakDash from './Admin/AdminTantak/TantakDash';
import Error from './Error';
import PdfViewer from './PdfViewer';

function App() {

    // const pdfUrl = 'file:///C:/Users/HP/educonnect/educonnect/backend/git/tantak_elearning/uploads/1732540527987.pdf';

    return (
        <BrowserRouter>
            <div className='App'>
                <Routes>
                    <Route path='/' element={<Login/>}></Route>
                    <Route path='/blank' element={<Blank/>}></Route>
                    {/* <Route path='/pdfviewer' element={<PdfViewer pdfFile={pdfUrl} />}></Route> */}
                    <Route path='/admin-dashboard' element={<TantakDash/>}></Route>
                    <Route path='/register' element={<Register />}></Route>
                    <Route path='/register-college' element={<TeacherReg />}></Route>
                    <Route path='/courses' element={<Courses />}></Route>
                    <Route path='/level' element={<Levels />}></Route>
                    <Route path='/modules' element={<Modules />}></Route>
                    <Route path='/subscribers' element={<Subscribers />}></Route>
                    <Route path='/dashboard' element={<StudentHome />}></Route>
                    <Route path='/lessons' element={<Lessons />}></Route>
                    <Route path='/assignments' element={<Assignments />}></Route>
                    <Route path='/notes' element={<Notes />}></Route>
                    <Route path='/results' element={<Results />}></Route>
                    <Route path='/results2' element={<Results2 />}></Route>
                    <Route path='/feedback' element={<Feedback />}></Route>
                    <Route path='/feedback2' element={<Feedback2 />}></Route>
                    <Route path='/account' element={<MyAccount />}></Route>
                    <Route path='/college-account' element={<CollegeAccount />}></Route>
                    <Route path='/mycourses' element={<MyCourses />}></Route>
                    <Route path='/myclasses' element={<MyClasses />}></Route>
                    <Route path='/myprofile' element={<MyProfile />}></Route>
                    <Route path='/settings' element={<Settings />}></Route>
                    <Route path='/mychannel' element={<ManageChannel />}></Route>
                    <Route path='/manage-course' element={<ManageCourse />}></Route>
                    <Route path='*' element={<Error />}></Route>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;