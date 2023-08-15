import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import { toast } from "react-toastify";
import MaterialDataTable from "../../containers/MaterialDataTable";

function ProducstDetails() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = React.useState(false);

  const productsData = async () => {
    try {
      setLoading(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/products`;
      const response = await axios.get(url);
      if (response?.data?.success) {
        setProducts(response.data.products);
      } else {
        setProducts([]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    productsData();
  }, []);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/products/${id}`;
      const response = await axios.delete(url);
      if (response?.data.success) {
        productsData();
        setLoading(false);
        toast.success("DELETEED");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error deleting product:", error);
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  const columns = [
    { title: "Product Name", field: "productname" },
    { title: "Available Qty", field: "availableproductqty" },
    { title: "Unit Price", field: "unitprice" },
    {
      field: "actions",
      title: "Actions",
      sorting: false,
      render: (row) => (
        <div className="d-flex flex-row align-items-center gap-1">
          <div>
            <Link to={`/products/${row._id}`}>
              <IconButton className="rounded-circle">
                <EditIcon />
              </IconButton>
            </Link>
          </div>
          <div>
            <IconButton
              className="rounded-circle"
              onClick={() => {
                handleDelete(row._id);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="content">
        <div>
          <div className="d-flex justify-content-end mb-4">
            <Link
              to="/products/new"
              className="btn text-white"
              style={{ backgroundColor: "#0d47a1" }}
            >
              Add New Product
            </Link>
          </div>
          <div>
            {/* <h3>Products</h3>
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
            </Table> */}

            <MaterialDataTable
              title="Products Information"
              columns={columns}
              data={products}
              loading={loading}
              setSate={setProducts}
              handleGetData={productsData}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProducstDetails;
