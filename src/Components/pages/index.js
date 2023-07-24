import React, { useEffect } from "react";
import { Route, Routes, Navigate, Outlet, useNavigate } from "react-router-dom";
import Home from "./Dashboard/Home";
import Sidebar from "./navBar/Sidebar";
import Header from "./navBar/Header";
import CustomerDetails from "./Customars/CustomerDetails";
import Customers from "./Customars/Customars";
import Products from "./Products/Products";
import ProductsDetails from "./Products/ProducstDetails";
import BillForm from "./Bill/BillForm";
import BillInformation from "./Bill/BillInformation";
import BillTable from "./Bill/BillTable";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Error404 from "./Errors/Error404";
import MyProfile from "./Profile/MyProfile";
import ProfileForm from "./Profile/ProfileForm";

function Index() {
  let navigate = useNavigate();

  // auth post method  and chacked token or not
  let chackAuth = async () => {
    let token = localStorage.getItem("token");
    if (token) {
      let config = {
        headers: {
          token: token,
        },
      };

      // auth post method
      let res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/users/auth`,
        { purpose: "validate access" },
        config
      );
      if (res.data.statusCode !== 200) {
        localStorage.clear();
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };
  useEffect(() => {
    chackAuth();
  }, []);

  return (
    <>
      <Routes element={<Protected />}>
        <Route element={<Public />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/customersdetails" element={<CustomerDetails />} />
          <Route path="/customars/:id" element={<Customers />} />
          <Route path="/products/:id" element={<Products />} />
          <Route path="/productsdetails" element={<ProductsDetails />} />

          <Route path="/billform/:id" element={<BillForm />} />
          <Route path="/billinformation" element={<BillInformation />} />
          <Route path="/billtable/:id" element={<BillTable />} />

          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/profileform/:id" element={<ProfileForm />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
}

function Public({ children }) {
  const isSignedIn = localStorage.getItem("token");
  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }
  return (
    <>
      {children || <Outlet />}
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={false}
        pauseOnHover={true}
        draggable={true}
      />
    </>
  );
}

function MainLayout() {
  return (
    <>
      <Sidebar />
      <div id="main">
        <Header />
        <Outlet />
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick={false}
          pauseOnHover={true}
          draggable={true}
        />
      </div>
    </>
  );
}

function Protected({ children }) {
  const isSignedIn = localStorage.getItem("token");
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children || <Outlet />}</>;
}

export default Index;
