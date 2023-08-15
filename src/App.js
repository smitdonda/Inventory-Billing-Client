import "./App.css";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
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

  // Customers count Number
  let [custCount, setCustCount] = useState();

  // Product Count Number
  let [productCount, setProductCount] = useState();

  // bill Count Number
  let [billinfoCount, setBillinfoCount] = useState();

  // loadding
  let [loadding, setLoadding] = useState(false);

  // customer get method
  let [customers, setCustomers] = useState();

  const fetchCustomerData = async () => {
    try {
      setLoadding(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/customers`
      );
      if (response?.data?.success) {
        setCustomers(response?.data?.customers);
        setCustCount(response?.data?.customers?.length);
        setLoadding(false);
      }
    } catch (error) {
      // Handle error if needed
      console.log("Error", error);
      setLoadding(false);
    }
  };

  // Fetch products data
  let [products, setproducts] = useState();
  const fetchProductsData = async () => {
    try {
      setLoadding(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/products`
      );
      setproducts(response?.data?.products);
      setProductCount(response?.data?.products?.length);
      setLoadding(false);
    } catch (error) {
      // Handle error if needed
      console.log("Error", error);
    }
  };

  // Fetch bill data
  let [allbilldetails, setAllBillDetails] = useState();

  const fetchBillData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/billInformation`
      );
      setAllBillDetails(response?.data?.billinfo);
      setBillinfoCount(response?.data.billinfo?.length);
    } catch (error) {
      // Handle error if needed
      console.log("Error", error);
    }
  };

  // Fetch my profile data
  let [myprofile, setMyProfile] = useState();

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/my-profile`
      );
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
  }, [loadding]);

  return (
    <BrowserRouter>
      <BillBook.Provider
        value={{
          customers,
          products,
          prod,
          setProd,
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
