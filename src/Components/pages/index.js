import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
import { getItem } from "../../config/cookieStorage";
import Sidebar from "./navBar/Sidebar";
import Header from "./navBar/Header";
import Home from "./Dashboard/Home";
import CustomerDetails from "./Customars/CustomerDetails";
import ProductsDetails from "./Products/ProducstDetails";
import BillForm from "./Bill/BillForm";
import BillInformation from "./Bill/BillInformation";
import BillTable from "./Bill/BillTable";
import MyProfile from "./Profile/MyProfile";
import ProfileForm from "./Profile/ProfileForm";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";

function Public({ children }) {
  const isSignedIn = getItem("token");
  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }
  return <>{children || <Outlet />}</>;
}

function MainLayout() {
  const token = getItem("token");
  const [isSignedIn, setIsSignedIn] = useState(token ? true : false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!token) {
      return setIsSignedIn(false);
    }
  }, [pathname, token]);

  // Check if the token is present
  if (isSignedIn === false) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <Sidebar />
      <div id="main">
        <Header />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </>
  );
}

function Router() {
  return (
    <>
      <Routes>
        <Route element={<Public />}>
          {/* {token} */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/customersdetails" element={<CustomerDetails />} />
          <Route path="/productsdetails" element={<ProductsDetails />} />
          <Route path="/billform/:id" element={<BillForm />} />
          <Route path="/billinformation" element={<BillInformation />} />
          <Route path="/billtable/:id" element={<BillTable />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/profileform/:id" element={<ProfileForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}

export default Router;
