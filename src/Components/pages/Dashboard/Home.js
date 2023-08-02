import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { BillBook } from "../../../App";

import Chart from "react-google-charts";

function Home() {
  let context = useContext(BillBook);

  // products chart
  const productChartData = [["Task", "Hours per Day"]];
  if (context && context?.products) {
    for (var i = 0; i < context?.products?.length; i++) {
      productChartData.push([
        context?.products[i]?.productname,
        +context?.products[i]?.availableproductqty,
      ]);
    }
  }
  const productChartOptions = {
    title: "Products chart",
  };

  return (
    <>
      <div className="content">
        <div
          className="d-flex flex-wrap row justify-content-center align-items-center"
          style={{ zIndex: "1" }}
        >
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
                <div>
                  Added Bill {context.billinfoCount ? context.billinfoCount : 0}
                </div>
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
                <div>{context.custCount ? context.custCount : 0}</div>
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
                <div>{context.productCount ? context.productCount : 0}</div>
              </div>
            </Link>
          </div>

          {/* chart and product and aqty */}
          <div className="d-flex flex-wrap justify-content-around p-2">
            {/* graph */}
            <div
              className="border border-2 d-flex flex-wrap justify-content-center  align-items-center"
              style={{ zIndex: "-1" }}
            >
              <Chart
                className="product-chart "
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={productChartData}
                width="100%"
                options={productChartOptions}
              />
            </div>
            {/* Products aqty */}
            <div className="border border-2 p-4 bg-light d-flex flex-wrap justify-content-center align-items-center mb-5 mt-3">
              <div>
                <h5 className="text-center">Products Quantity</h5>
                <table className="table table-bordered bg-light text-center">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Qty</th>
                    </tr>
                  </thead>
                  <tbody className="overflow-auto">
                    {context?.products?.map((e, i) => {
                      return (
                        <tr key={i}>
                          <td>{e?.productname}</td>
                          <td>{e?.availableproductqty}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
