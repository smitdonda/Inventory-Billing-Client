import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import axios from "axios";

function ProducstDetails() {
  const [products, setProducts] = useState([]);
  const productsData = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/users/getproducts`;
      const response = await axios.get(url);
      if (response?.data?.products) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    productsData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/users/deleteproduct/`;
      const response = await axios.delete(url + id);
      if (response?.status === 200) {
        productsData();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <>
      <div className="content">
        <div>
          <div className="d-flex justify-content-end">
            <Link
              to="/products/new"
              className="btn text-white"
              style={{ backgroundColor: "#0d47a1" }}
            >
              Add New Product
            </Link>
          </div>
          <div>
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
                        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
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
