import React, { useState, useEffect } from "react";
// import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import MaterialDataTable from "../../containers/MaterialDataTable";

function AllBilldetails() {
  const [loading, setLoading] = React.useState(false);

  // get customers Information
  let [customers, setCustomers] = useState([]);
  let customerData = async () => {
    try {
      setLoading(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/users/getcustomers`;
      const response = await axios.get(url);
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

  let handleDelete = async (id) => {
    try {
      setLoading(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/users/deletecustomer/${id}`;
      const response = await axios.delete(url);
      if (response.data.statusCode === 200) {
        customerData();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error deleting customer:", error);
    }
  };

  const columns = [
    { title: "Name", field: "name" },
    { title: "Email", field: "email" },
    { title: "Date", field: "date" },
    { title: "Phone", field: "phone" },
    { title: "Gstno", field: "gstno" },
    {
      field: "actions",
      title: "Actions",
      sorting: false,
      render: (row) => (
        <div className="d-flex flex-row justify-content-center align-items-center gap-1">
          <div>
            <Link to={`/customars/${row._id}`}>
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
        <div className="d-flex justify-content-end mb-4">
          <Link
            to="/customars/new"
            className="btn text-white shadow-none"
            style={{ backgroundColor: "#0d47a1" }}
          >
            Add New Customar
          </Link>
        </div>
        <div>
          <MaterialDataTable
            title="Customers Information"
            columns={columns}
            data={customers}
            loading={loading}
            setSate={setCustomers}
            handleGetData={customerData}
          />
        </div>
      </div>
    </>
  );
}

export default AllBilldetails;
