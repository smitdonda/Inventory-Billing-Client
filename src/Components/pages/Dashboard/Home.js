import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BillBook } from "../../../App";
import Chart from "react-google-charts";
import axiosInstance from "../../../config/AxiosInstance";
import { SpinLoader } from "../Loaders/loaders";

function Home() {
  let context = useContext(BillBook);

  const [countdata, setCountData] = useState({
    customer: 0,
    product: 0,
    billInformation: 0,
  });

  const getCountData = async () => {
    try {
      const result = await axiosInstance.get("/dashboard/count");
      if (result.data.success) {
        setCountData({
          customer: result.data.customer,
          product: result.data.product,
          billInformation: result.data.billInformation,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCountData();
  }, []);

  // Create products chart data
  const productChartData = [["Task", "Hours per Day"]];
  if (context && context?.products) {
    context.products.forEach((product) => {
      productChartData.push([
        product.productname,
        +product.availableproductqty,
      ]);
    });
  }

  const productChartOptions = {
    title: "Products Chart",
  };

  return (
    <>
      <div className="d-flex flex-wrap row justify-content-center align-items-center">
        {/*Add new bill  */}
        <div className="col d-flex flex-row justify-content-center align-items-center">
          <Link
            to="/billform/new"
            style={{ borderLeft: "10px solid #ffbb33" }}
            className="text-decoration-none new-bill d-flex flex-row justify-content-center align-items-center gap-3 shadow-lg p-3 mb-5 rounded"
          >
            <div className="icons bg-warning d-flex justify-content-center align-items-center">
              <img
                src={require("../../../Images/AddBill.png")}
                style={{ width: "50px", height: "50px" }}
                alt="Add Bill"
              />
            </div>
            <div className="text-dark d-flex justify-content-center align-items-center ml-2">
              <h6>Add New bill </h6>
            </div>
          </Link>
        </div>
        {/* Billing information */}
        <div className="col d-flex flex-row justify-content-center align-items-center">
          <Link
            to="/billinformation"
            className="new-bill text-decoration-none d-flex flex-row justify-content-center align-items-center gap-3 shadow-lg p-3 mb-5 rounded  "
            style={{ borderLeft: "10px solid seagreen" }}
          >
            <div className="icons bg-success d-flex  justify-content-center align-items-center">
              <i
                className="bi bi-receipt text-white"
                style={{ fontSize: "40px" }}
              ></i>
            </div>
            <div className="text-dark align-items-center ml-2">
              <h6>Billing Information</h6>
              <div>Added Bill {countdata?.billInformation || 0}</div>
            </div>
          </Link>
        </div>

        {/* total customers */}
        <div className="col  d-flex flex-row justify-content-center align-items-center">
          <Link
            to="/customersdetails"
            className="new-bill text-decoration-none d-flex flex-row justify-content-center align-items-center gap-3 shadow-lg p-3 mb-5 rounded"
            style={{ borderLeft: "10px solid #4285F4" }}
          >
            <div className="icons bg-primary d-flex justify-content-center align-items-center">
              <i
                className="bi bi-person-lines-fill text-white"
                style={{ fontSize: "40px" }}
              ></i>
            </div>
            <div className="text-dark align-items-center ml-2">
              <h6>Total Customer</h6>
              <div>{countdata?.customer || 0}</div>
            </div>
          </Link>
        </div>

        {/* Available Products */}
        <div className="col d-flex flex-row justify-content-center align-items-center">
          <Link
            to="/productsdetails"
            style={{ borderLeft: "10px solid #ff4444" }}
            className="new-bill text-decoration-none d-flex flex-row justify-content-center align-items-center gap-3 shadow-lg p-3 mb-5 bg-body rounded"
          >
            <div className="icons bg-danger d-flex  justify-content-center align-items-center">
              <i
                className="bi bi-box text-white"
                style={{ fontSize: "40px" }}
              ></i>
            </div>
            <div className="text-dark align-items-center ml-2">
              <h6>Available Products</h6>
              <div>{countdata?.product || 0}</div>
            </div>
          </Link>
        </div>

        {/* chart and product and aqty */}
        <div className="d-flex flex-wrap justify-content-around p-2">
          {/* graph */}
          <div
            className="border border-2 d-flex flex-wrap justify-content-center align-items-center"
            style={{ zIndex: "-1" }}
          >
            <Chart
              className="product-chart"
              chartType="PieChart"
              loader={
                <div
                  className="d-flex flex-wrap justify-content-center  align-items-center"
                  style={{ width: "28rem", height: "12rem" }}
                >
                  <SpinLoader />
                </div>
              }
              data={productChartData}
              width="100%"
              options={productChartOptions}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
