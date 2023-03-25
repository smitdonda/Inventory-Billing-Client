import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import SiderBar from "./SiderBar";

function ProducstDetails() {
  let getproductsurl =
    "https://inventory-billing-server-1.vercel.app/users/getproducts";
  let [products, setproducts] = useState([]);
  let productsData = async () => {
    let data = await axios.get(getproductsurl);
    if (data) {
      setproducts(data.data.product);
    }
  };

  useEffect(() => {
    productsData();
  }, []);

  let deleteproducturl =
    "https://inventory-billing-server-1.vercel.app/users/deleteproduct/";
  let handleDelete = async (id, e) => {
    let del = await axios.delete(deleteproducturl + id);
    if (del.status === 200) {
      productsData();
    }
  };

  return (
    <>
      <SiderBar />
      <Header />
      <div className="content">
        <div className="" style={{ marginTop: "100px" }}>
          <div className="d-flex  justify-content-end">
            <Link
              to="/products/new"
              className="btn text-white"
              style={{ backgroundColor: "#0d47a1" }}
            >
              Add New Product
            </Link>
          </div>
          <div className="container">
            <h3>Products</h3>
            <Table
              bordered
              responsive="sm"
              className="text-center text-dark m-auto"
            >
              <thead className="thead-dark">
                <tr>
                  <th scope="col">No.</th>
                  <th scope="col">Product Name</th>
                  <th scope="col">Available Product Qty</th>
                  <th scope="col">Unit Price</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((e, i) => {
                  return (
                    <tr key={i}>
                      <th>{i + 1}</th>
                      <td className="text-left">{e.productname}</td>
                      <td>{e.availableproductqty}</td>
                      <td>{e.unitprice}</td>
                      <td>
                        <div className="d-flex flex-row justify-content-center align-items-center">
                          <div className="mr-2">
                            <Link to={`/products/${e._id}`}>
                              <Button
                                variant="warning"
                                size="sm"
                                className="shadow none rounded-circle"
                              >
                                <EditIcon />
                              </Button>
                            </Link>
                          </div>
                          <div className="ml-2">
                            <Button
                              variant="danger"
                              size="sm"
                              className="shadow-none rounded-circle"
                              onClick={() => {
                                handleDelete(e._id);
                              }}
                            >
                              <DeleteIcon />
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProducstDetails;
