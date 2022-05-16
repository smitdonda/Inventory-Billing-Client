import React, { useState, useEffect, useContext } from "react";
import { Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BillBook } from "../App";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "./Header";
import SiderBar from "./SiderBar";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

function BillInformation() {
  let context = useContext(BillBook);

  // get all Bill Information
  let getbillinfourl =
    "https://bill-book-server.herokuapp.com/users/getbillinformation";
  let [allbilldetails, setAllBillDetails] = useState();
  let billData = async () => {
    let bill = await axios.get(getbillinfourl);
    if (bill) {
      setAllBillDetails(bill.data.billinfo);
    }
  };

  // Delete all Bill Information
  let daletebillinfourl =
    "https://bill-book-server.herokuapp.com/users/deletebillinfo/";
  let handleDelete = async (id) => {
    let del = await axios.delete(daletebillinfourl + id);
    if (del.status === 200) {
      billData();
    }
  };
  useEffect(() => {
    billData();
  }, []);

  return (
    <>
      <SiderBar />
      <Header />
      <div className="content" >
        <div style={{ marginTop: "90px" }}>
          <div className="d-flex justify-content-end align-items-center">
            <Link
              to="/billform/new"
              className="btn btn-ghost-*  text-white shadow-none"
              style={{ backgroundColor: "#0d47a1" }}
            >
              Generate New Bill
            </Link>
          </div>
          <h2 className="text-center">Bill Information</h2>
          <hr />
          <Table bordered responsive="lg" className="text-center text-dark">
            <thead className="bg-dark text-white mt-5 ">
              <tr>
                <th>No.</th>
                <th>Customars Name</th>
                <th>Products</th>
                <th>Products Totals</th>
                <th>Action</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {allbilldetails?.map((e, i) => {
                return (
                  <tr key={i}>
                    <th scope="col">{i + 1}</th>
                    <td className="text-left">{e?.name}</td>
                    <td className="text-left">
                      {e?.products?.map((p, i) => {
                        return (
                          <div key={i}>
                            <span>{i + 1}</span>.&nbsp;{p.productname}
                          </div>
                        );
                      })}
                    </td>
                    <td>{e?.totalproductsprice}</td>
                    <td>
                      <div className="d-flex flex-row justify-content-center align-items-center">
                        <div>
                          <Link to={`/billform/${e._id}`}>
                            <Button
                              variant="warning"
                              size="sm"
                              className="shadow-none mr-2 rounded-circle"
                              onClick={() => {
                                // all details printed in a bill form
                                context?.setCustData(e);
                                context?.setProd(e?.products);
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
                              handleDelete(e._id);
                            }}
                          >
                            <DeleteIcon />
                          </Button>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Link to={`/billtable/${e._id}`}>
                        <Button
                          size="sm"
                          className="border shadow-none"
                          style={{ backgroundColor: "#CC0000" }}
                        >
                          <PictureAsPdfIcon></PictureAsPdfIcon>
                        </Button>
                      </Link>
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

export default BillInformation;
