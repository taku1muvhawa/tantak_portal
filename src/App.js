import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';

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
import ManageChannel from './ManageChannel/ManageChannel';
import ManageCourse from './ManageCourse/ManageCourse';

function App() {

    return (
        <BrowserRouter>
            <div className='App'>
                <Routes>
                    <Route path='/' element={<Login/>}></Route>
                    <Route path='/blank' element={<Blank/>}></Route>
                    <Route path='/register' element={<Register />}></Route>
                    <Route path='/courses' element={<Courses />}></Route>
                    <Route path='/level' element={<Levels />}></Route>
                    <Route path='/modules' element={<Modules />}></Route>
                    <Route path='/dashboard' element={<StudentHome />}></Route>
                    <Route path='/lessons' element={<Lessons />}></Route>
                    <Route path='/assignments' element={<Assignments />}></Route>
                    <Route path='/notes' element={<Notes />}></Route>
                    <Route path='/results' element={<Results />}></Route>
                    <Route path='/feedback' element={<Feedback />}></Route>
                    <Route path='/account' element={<MyAccount />}></Route>
                    <Route path='/mycourses' element={<MyCourses />}></Route>
                    <Route path='/myprofile' element={<MyProfile />}></Route>
                    <Route path='/settings' element={<Settings />}></Route>
                    <Route path='/mychannel' element={<ManageChannel />}></Route>
                    <Route path='/manage-course' element={<ManageCourse />}></Route>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;