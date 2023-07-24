import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useSelector } from "react-redux";

function AllBilldetails() {
  // get customers URL
  let customerurl = `${process.env.REACT_APP_BACKEND_URL}/users/getcustomers`;
  let [customers, setCustomers] = useState();
  let customerData = async () => {
    let cust = await axios.get(customerurl);
    if (cust) {
      setCustomers(cust.data.customer);
    }
  };
  const { customersInfo } = useSelector((state) => state.customers);
  console.log("customersInfo", customersInfo);

  useEffect(() => {
    customerData();
  }, []);

  // Delete Customers Information
  let deletecustomerurl = `${process.env.REACT_APP_BACKEND_URL}/users/deletecustomer/`;
  let handleDelete = async (id) => {
    let del = await axios.delete(deletecustomerurl + id);
    if (del.status === 200) {
      customerData();
    }
  };

  return (
    <>
      <div className="content">
        <div>
          <div className="d-flex  justify-content-end">
            <Link
              to="/customars/new"
              className="btn text-white shadow-none "
              style={{ backgroundColor: "#0d47a1" }}
            >
              Add New Customar
            </Link>
          </div>
        </div>
        <div>
          <h2>Customers Information</h2>
          <br />
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
                      <div className="d-flex flex-row justify-content-center align-items-center">
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
