import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

function AllBilldetails() {
  useEffect(() => {
    customerData();
  }, []);

  // get customers URL
  let [customers, setCustomers] = useState([]);
  let customerData = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/users/getcustomers`;
      const response = await axios.get(url);
      setCustomers(response.data.customers);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  // Delete Customers Information
  let handleDelete = async (id) => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/users/deletecustomer/${id}`;
      const response = await axios.delete(url);
      if (response.data) {
        customerData();
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  return (
    <>
      <div className="content">
        <div className="d-flex justify-content-end">
          <Link
            to="/customars/new"
            className="btn text-white shadow-none"
            style={{ backgroundColor: "#0d47a1" }}
          >
            Add New Customar
          </Link>
        </div>
        <div>
          <h4>Customers Information</h4>
          <Table
            bordered
            responsive="lg"
            className="text-center text-dark m-auto p-2"
          >
            <thead className="thead-dark">
              <tr>
                <th scope="col">No.</th>
                <th scope="col">Name</th>
                <th scope="col">Email id</th>
                <th scope="col">Date</th>
                <th scope="col">Phone no.</th>
                <th scope="col">GST No.</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers?.map((e, i) => {
                return (
                  <tr key={i}>
                    <th>{i + 1}</th>
                    <td className="text-left">{e.name}</td>
                    <td className="text-left">{e.email}</td>
                    <td>{e.date}</td>
                    <td>{e.phone}</td>
                    <td>{e.gstno}</td>
                    <td>
                      <div className="d-flex flex-row justify-content-center align-items-center gap-2">
                        <div className="mr-1">
                          <Link to={`/customars/${e._id}`}>
                            <Button
                              variant="warning"
                              size="sm"
                              className="shadow none rounded-circle"
                            >
                              <EditIcon />
                            </Button>
                          </Link>
                        </div>
                        <div className="ml-1">
                          <Button
                            variant="danger"
                            size="sm"
                            className="shadow none rounded-circle"
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
    </>
  );
}

export default AllBilldetails;
