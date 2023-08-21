import React from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
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

function MainLayout() {
  const token = getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/customersdetails" element={<CustomerDetails />} />
          <Route path="/productsdetails" element={<ProductsDetails />} />
          <Route path="/billform/:id" element={<BillForm />} />
          <Route path="/billinformation" element={<BillInformation />} />
          <Route path="/billtable/:id" element={<BillTable />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/profileform/:id" element={<ProfileForm />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </>
  );
}

export default Router;
