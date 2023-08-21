import "./App.css";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "./config/AxiosInstance";
import { BrowserRouter } from "react-router-dom";

import Main from "./Components/pages";

export const BillBook = React.createContext();

function App() {
  // products modal edit or add products
  let [newOne, setNewOne] = useState(true);

  // edit product object
  let [editProduct, setEditProduct] = useState();

  // customers selected object data and after saveData all details in this variable
  let [custdata, setCustData] = useState({});

  // selected all products data in new Array
  let [prod, setProd] = useState([]);

  // customer get method
  let [customers, setCustomers] = useState();

  const fetchCustomerData = async () => {
    try {
      const response = await axiosInstance.get(`/customers`);
      if (response?.data?.success) {
        setCustomers(response?.data?.customers);
      }
    } catch (error) {
      // Handle error if needed
      console.log("Error", error);
    }
  };

  // Fetch products data
  let [products, setproducts] = useState();
  const fetchProductsData = async () => {
    try {
      const response = await axiosInstance.get(`/products`);
      setproducts(response?.data?.products);
    } catch (error) {
      // Handle error if needed
      console.log("Error", error);
    }
  };

  // Fetch bill data
  let [allbilldetails, setAllBillDetails] = useState();

  const fetchBillData = async () => {
    try {
      const response = await axiosInstance.get(`/billInformation`);
      setAllBillDetails(response?.data?.billinfo);
    } catch (error) {
      // Handle error if needed
      console.log("Error", error);
    }
  };

  // Fetch my profile data
  let [myprofile, setMyProfile] = useState();

  const fetchProfileData = async () => {
    try {
      const response = await axiosInstance.get(`/my-profile`);
      setMyProfile(response.data.profile[0]);
    } catch (error) {
      // Handle error if needed
      console.log("Error", error);
    }
  };

  useEffect(() => {
    fetchCustomerData();
    fetchProductsData();
    fetchBillData();
    fetchProfileData();
  }, []);

  return (
    <BrowserRouter>
      <BillBook.Provider
        value={{
          customers,
          products,
          prod,
          setProd,
          allbilldetails,
          custdata,
          setCustData,
          myprofile,
          setMyProfile,
          editProduct,
          setEditProduct,
          newOne,
          setNewOne,
        }}
      >
        <Main />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </BillBook.Provider>
    </BrowserRouter>
  );
}
export default App;
