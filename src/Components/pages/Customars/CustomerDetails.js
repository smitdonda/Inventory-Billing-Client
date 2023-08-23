import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import MaterialDataTable from "../../containers/MaterialDataTable";
import CustomersFrom from "./CustomersFrom";
import axiosInstance from "../../../config/AxiosInstance";
import moment from "moment";

function CustomerDetails() {
  // get customers Information
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  // edit customer data
  const [id, setId] = useState(null);
  const [editData, setEditData] = useState({});

  const customerData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/customers");
      if (response.data.customers) {
        setCustomers(response.data.customers);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching customer data:", error);
    }
  };

  useEffect(() => {
    customerData();
  }, []);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete(`/customers/${id}`);
      if (response.data.success) {
        customerData();
        setLoading(false);
        toast.success("DELETEED");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error deleting customer:", error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  };

  // const [productModelOpen, setProductsModelOpen] = useState(false);

  const [productModelOpen, setProductsModelOpen] = useState(false);

  const handleClickOpen = (value) => {
    setEditData(value);
    setId(value._id);
    setProductsModelOpen(true);
  };

  const handleClose = () => {
    setProductsModelOpen(false);
    setEditData({});
    setId(null);
  };

  const columns = [
    { title: "#", field: "id" },
    { title: "Name", field: "name" },
    { title: "Email", field: "email" },
    {
      title: "Date",
      field: "createdAt",
      render: ({ createdAt }) => <>{moment(createdAt).format("DD/MM/YYYY")}</>,
    },
    { title: "Phone", field: "phoneNo" },
    { title: "Gstno", field: "gstNo" },
    {
      field: "actions",
      title: "Actions",
      sorting: false,
      render: (row) => (
        <div className="d-flex flex-row align-items-center gap-1">
          <div>
            <IconButton
              className="rounded-circle"
              onClick={() => handleClickOpen(row)}
            >
              <EditIcon />
            </IconButton>
          </div>
          <div>
            <IconButton
              className="rounded-circle"
              onClick={() => handleDelete(row._id)}
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
      <div className="d-flex justify-content-end mb-4 gap-3">
        <Button
          className="shadow-none"
          onClick={() => setProductsModelOpen(true)}
        >
          Add New Customar
        </Button>
      </div>
      <div>
        <MaterialDataTable
          title="Customers Information"
          columns={columns}
          data={customers}
          loading={loading}
          setState={setCustomers}
          handleGetData={customerData}
        />
      </div>
      <CustomersFrom
        id={id}
        handleClose={handleClose}
        open={productModelOpen}
        editData={editData}
        customerData={customerData}
      />
    </>
  );
}

export default CustomerDetails;
