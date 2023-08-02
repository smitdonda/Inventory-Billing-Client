import React, { useState, useEffect, useContext } from "react";
import { Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BillBook } from "../../../App";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

function BillInformation() {
  const context = useContext(BillBook);
  const [allBillDetails, setAllBillDetails] = useState([]);

  useEffect(() => {
    getBillData();
  }, []);

  const getBillData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users/getbillinformation`
      );
      if (response?.data?.billinfo) {
        setAllBillDetails(response.data.billinfo);
      }
    } catch (error) {
      console.error("Error fetching bill data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const deleteBillInfoUrl = `${process.env.REACT_APP_BACKEND_URL}/users/deletebillinfo/${id}`;
      const response = await axios.delete(deleteBillInfoUrl);
      if (response.status === 200) {
        getBillData();
      }
    } catch (error) {
      console.error("Error deleting bill:", error);
    }
  };

  return (
    <>
      <div className="content">
        <div>
          <div className="d-flex justify-content-end align-items-center">
            <Link
              to="/billform/new"
              className="btn text-white shadow-none"
              style={{ backgroundColor: "#0d47a1" }}
            >
              Generate New Bill
            </Link>
          </div>
          <h3>Bill Information</h3>
          <Table bordered responsive="lg" className="text-center text-dark">
            <thead className="bg-dark text-white mt-5">
              <tr>
                <th>No.</th>
                <th>Customers Name</th>
                <th>Products</th>
                <th>Products Totals</th>
                <th>Action</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {allBillDetails.map((bill, index) => (
                <tr key={bill._id}>
                  <th scope="col">{index + 1}</th>
                  <td className="text-left">{bill?.name}</td>
                  <td className="text-left">
                    {bill?.products?.map((product, i) => (
                      <div key={i}>
                        <span>{i + 1}</span>.&nbsp;{product.productname}
                      </div>
                    ))}
                  </td>
                  <td>{bill?.totalproductsprice}</td>
                  <td>
                    <div className="d-flex flex-row justify-content-center align-items-center gap-2">
                      <div>
                        <Link to={`/billform/${bill._id}`}>
                          <Button
                            variant="warning"
                            size="sm"
                            className="shadow-none mr-2 rounded-circle"
                            onClick={() => {
                              // all details printed in a bill form
                              context?.setCustData(bill);
                              context?.setProd(bill?.products);
                            }}
                          >
                            <EditIcon />
                          </Button>
                        </Link>
                      </div>
                      <div>
                        <Button
                          variant="danger"
                          size="sm"
                          className="shadow-none rounded-circle  "
                          onClick={() => {
                            handleDelete(bill._id);
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Link to={`/billtable/${bill._id}`}>
                      <Button
                        size="sm"
                        className="border shadow-none"
                        style={{ backgroundColor: "#CC0000" }}
                      >
                        <PictureAsPdfIcon />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}

export default BillInformation;
