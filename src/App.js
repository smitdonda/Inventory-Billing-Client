import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Main from "./Components/pages";

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
  let customerurl = `${process.env.REACT_APP_BACKEND_URL}/users/getcustomers`;
  let [customers, setCustomers] = useState();

  let customerData = async () => {
    let cust = await axios.get(customerurl);
    if (cust) {
      setCustomers(cust?.data?.customers);
      setCustCount(cust?.data?.customers?.length);
    }
  };

  // products product get method
  let getproductsurl = `${process.env.REACT_APP_BACKEND_URL}/users/getproducts`;
  let [products, setproducts] = useState();

  let productsData = async () => {
    let details = await axios.get(getproductsurl);
    if (details) {
      setproducts(details?.data?.products);
      setProductCount(details?.data?.products?.length);
    }
  };

  // Bill Info get method
  let getbillinfourl = `${process.env.REACT_APP_BACKEND_URL}/users/getbillinformation`;
  let [allbilldetails, setAllBillDetails] = useState();

  let billData = async () => {
    let bill = await axios.get(getbillinfourl);
    if (bill) {
      setAllBillDetails(bill?.data?.billinfo);
      setBillinfoCount(bill?.data.billinfo?.length);
    }
  };

  // my profile get method
  let profileurl = `${process.env.REACT_APP_BACKEND_URL}/users/getmyprofile`;
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
        <Main />
      </BillBook.Provider>
    </BrowserRouter>
  );
}
export default App;
