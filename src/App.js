import "./App.css";
import React, { useState, useEffect } from "react";

import Home from "./Components/Home";
import Customars from "./Components/Customars";
import CustomerDetails from "./Components/CustomerDetails";

import Products from "./Components/Products";
import ProductsDetails from "./Components/ProducstDetails";

import BillForm from "./Components/BillForm";
import BillInformation from "./Components/BillInformation";
import BillTable from "./Components/BillTable";

import MyProfile from "./Components/MyProfile";
import ProfileForm from "./Components/ProfileForm";

import SignUp from "./Components/SignUp";
import Login from "./Components/Login";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
export const BillBook = React.createContext();

function App() {
  //  Products modal Visible or Invisible
  const [modalShow, setModalShow] = React.useState(false);

  // products modal edit or add products
  let [newOne, setNewOne] = useState(true);

  // edit product object
  let [editProduct, setEditProduct] = useState();

  // customers selected object data and after saveData all details in this variable
  let [custdata, setCustData] = useState([]);

  // selected all products data in new Array
  let [prod, setProd] = useState([]);

  // Customers count Number
  let [custCount, setCustCount] = useState();

  // Product Count Number
  let [productCount, setProductCount] = useState();

  // bill Count Number
  let [billinfoCount, setBillinfoCount] = useState();
  // siderbar
  const [collapsed, setCollapsed] = useState(false);

  // customer get method
  let customerurl = "https://bill-book-server.herokuapp.com/users/getcustomers";
  let [customers, setCustomers] = useState();

  let customerData = async () => {
    let cust = await axios.get(customerurl);
    if (cust) {
      setCustomers(cust.data.customer);
      setCustCount(cust.data.customer.length);
    }
  };

  // products product get method
  let getproductsurl =
    "https://bill-book-server.herokuapp.com/users/getproducts";
  let [products, setproducts] = useState();

  let productsData = async () => {
    let details = await axios.get(getproductsurl);
    if (details) {
      setproducts(details.data.product);
      setProductCount(details.data.product.length);
    }
  };

  // Bill Info get method
  let getbillinfourl =
    "https://bill-book-server.herokuapp.com/users/getbillinformation";
  let [allbilldetails, setAllBillDetails] = useState();

  let billData = async () => {
    let bill = await axios.get(getbillinfourl);
    if (bill) {
      setAllBillDetails(bill.data.billinfo);
      setBillinfoCount(bill.data.billinfo.length);
    }
  };

  // my profile get method
  let profileurl = "https://bill-book-server.herokuapp.com/users/getmyprofile";
  let [myprofile, setMyProfile] = useState();

  let profileData = async () => {
    let mypro = await axios.get(profileurl);
    if (mypro) {
      setMyProfile(mypro.data.profile[0]);
    }
  };

  useEffect(() => {
    customerData(); // customer data
    productsData(); // products data
    billData(); //bill data
    profileData(); // my profile data
  }, []);

  return (
    <>
      <BrowserRouter>
        <BillBook.Provider
          value={{
            customers,
            products,
            prod,
            setProd,
            modalShow,
            setModalShow,
            allbilldetails,
            setAllBillDetails,
            custdata,
            setCustData,
            custCount,
            setCustCount,
            productCount,
            setProductCount,
            billinfoCount,
            setBillinfoCount,
            myprofile,
            setMyProfile,
            editProduct,
            setEditProduct,
            newOne,
            setNewOne,
            collapsed,
            setCollapsed,
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />

            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />

            <Route path="/customars/:id" element={<Customars />} />
            <Route path="/customersdetails" element={<CustomerDetails />} />

            <Route path="/products/:id" element={<Products />} />
            <Route path="/productsdetails" element={<ProductsDetails />} />

            <Route path="/billform/:id" element={<BillForm />} />
            <Route path="/billinformation" element={<BillInformation />} />
            <Route path="/billtable/:id" element={<BillTable />} />

            <Route path="/myprofile" element={<MyProfile />} />
            <Route path="/profileform/:id" element={<ProfileForm />} />
          </Routes>
        </BillBook.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
