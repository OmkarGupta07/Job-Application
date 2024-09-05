import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import User from '../Pages/User/UserDashboard';
import UserEdit from "../Pages/User/UserEdit";
import SignUp from '../Pages/SignUp/SignUpPage';
import Login from '../Pages/Login/LoginPage';
import UserPage from "../Pages/UserPage/User";
import { Provider } from 'react-redux';
import store from '../Store';
const Router = () =>{

    return(<>
    <Provider store={store}>
    <Routes>
        <Route path="/JobFormDisplay" element={<User/>} />
        <Route path="/JobForm" element={<UserEdit/>} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/SignUp" element={<SignUp/>} />
        <Route path="/UserJobPage" element={<UserPage/>} />
    </Routes>
        </Provider>
    
    </>)
}
export default Router;