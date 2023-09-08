import React, { useState, useEffect, useMemo } from "react";
import { Button } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { toast } from "react-toastify";
import axiosInstance from "../../../config/AxiosInstance";
import MaterialReactTable from "../../containers/MaterialReactTable";
import ProductForm from "./ProductFrom";

function ProducstDetails() {
  // get product information
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = React.useState(false);
  // edit product information
  const [id, setId] = useState(null);
  const [editData, setEditData] = useState({});

  const getProductsData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/products");
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
    getProductsData();
  }, []);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete(`/products/${id}`);
      if (response?.data.success) {
        getProductsData();
        setLoading(false);
        toast.success("DELETEED");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error deleting product:", error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = (value = {}) => {
    setEditData(value);
    setId(value._id);
    setOpen(true);
  };

  const handleClose = () => {
    setEditData({});
    setId(null);
    setOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        header: "#id",
        accessorKey: "id",
        size: 140,
        enableColumnOrdering: false,
      },
      { header: "Product Name", accessorKey: "productname" },
      { header: "Available Qty", accessorKey: "availableproductqty" },
      { header: "Unit Price", accessorKey: "unitprice" },
    ],
    []
  );

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between mb-4">
        <div>
          <h4 className="page-heading">Products Information</h4>
        </div>
        <div>
          <Button className="shadow-none" onClick={() => setOpen(true)}>
            Add New Product
          </Button>
        </div>
      </div>
      <div>
        <MaterialReactTable
          columns={columns}
          data={products}
          loading={loading}
          renderRowActions={({ row }) => (
            <div className="d-flex flex-row justify-content-center align-items-center gap-1">
              <div>
                <IconButton
                  className="rounded-circle"
                  onClick={() => handleClickOpen(row.original)}
                >
                  <EditIcon />
                </IconButton>
              </div>
              <div>
                <IconButton
                  className="rounded-circle"
                  onClick={() => handleDelete(row.original._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          )}
        />
      </div>
      <ProductForm
        id={id}
        handleClose={handleClose}
        open={open}
        editData={editData}
        getProductsData={getProductsData}
      />
    </>
  );
}

export default ProducstDetails;
