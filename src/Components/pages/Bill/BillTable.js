import React, { useState, useEffect, useRef } from "react";
import { Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Pdf from "react-to-pdf";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import axiosInstance from "../../../config/AxiosInstance";
import moment from "moment";

const options = {
  orientation: "landscape",
  unit: "in",
  format: [13.6, 10],
};

function BillTable() {
  const { id } = useParams();
  const ref = useRef();

  const [invoiceObj, setInvoiceObj] = useState({});

  // Fetch my profile data
  const [myprofile, setMyProfile] = useState([]);
  const fetchProfileData = async () => {
    try {
      const response = await axiosInstance.get(`/my-profile`);
      setMyProfile(response.data.profile[0]);
    } catch (error) {
      // Handle error if needed
      console.log("Error", error);
    }
  };

  useEffect(() => {
    return () => fetchProfileData();
  }, []);

  const findBillInformationData = async () => {
    // get existing bill Information
    try {
      const res = await axiosInstance.get(`/billInformation/${id}`);
      if (res.data?.success) {
        setInvoiceObj(res.data?.bill);
      }
    } catch (error) {
      console.error("Error get bill:", error);
    }
  };

  useEffect(() => {
    return () => findBillInformationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <div className="d-flex justify-content-end align-items-end mb-1">
        <h3>Genrate PDF</h3>
      </div>
      <div className="d-flex justify-content-end align-items-end mb-4 mr-4">
        <Pdf targetRef={ref} filename="Invoice.pdf" options={options}>
          {({ toPdf }) => (
            <button className="btn btn-primary shadow-none" onClick={toPdf}>
              <FileDownloadIcon />
              &nbsp;Invoice
            </button>
          )}
        </Pdf>
      </div>
      <div
        ref={ref}
        className="mb-5"
        style={{
          width: "auto",
          height: "auto",
          fontFamily: "VT323, monospace",
        }}
      >
        <div className="container">
          <div className="text-center mb-5 mt-5">
            <div>
              <h2>{myprofile?.companyname}</h2>
            </div>
            <div>
              <div className="text-uppercase">{myprofile?.address}</div>
              <div className="text-uppercase">
                {myprofile?.state} ,{myprofile?.city}
              </div>
              <div>Phone: {myprofile?.phone}</div>
              <div>Email: {myprofile?.cemail}</div>
            </div>
          </div>
          <Table size="sm" className="m-auto table table-borderless">
            <tr>
              <th scope="col">Bill to&nbsp;</th>
            </tr>
            <tr>
              <th scope="col">
                Name:&nbsp;
                <span className="fw-normal">{invoiceObj?.name}</span>
              </th>
              <th scope="col">
                Invoice Id No:&nbsp; &#35;
                <span className="fw-normal">{invoiceObj?.id}</span>
              </th>
            </tr>
            <tr>
              <th scope="col">
                Phone No:&nbsp;
                <span className="fw-normal">{invoiceObj?.phoneNo}</span>
              </th>
              <th scope="col">
                Invoice Date:&nbsp;
                <span className="fw-normal">
                  {moment(invoiceObj?.createdAt).format("DD/MM/YYYY")}
                </span>
              </th>
            </tr>
            <tr>
              <th scope="col" colSpan="2">
                GST No:&nbsp;
                <span className="fw-normal">{invoiceObj?.gstNo}</span>
              </th>
            </tr>
          </Table>
          <table className="table table-bordered text-center mt-5 m-auto mb-5">
            <thead>
              <tr>
                <th scope="col" style={{ width: "10px" }}>
                  sr.no
                </th>
                <th scope="col" style={{ width: "300px" }}>
                  Products
                </th>
                <th scope="col" style={{ width: "80px" }}>
                  Qty
                </th>
                <th scope="col" style={{ width: "90px" }}>
                  Unit Price
                </th>
                <th scope="col" style={{ width: "100px" }}>
                  Gst Tax
                </th>
                <th scope="col" style={{ width: "100px" }}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {invoiceObj?.products?.map((e, i) => {
                return (
                  <tr key={i}>
                    <th>{i + 1}</th>
                    <td className="text-left">{e?.productname}</td>
                    <td>{e?.quantity}</td>
                    <td>{e?.unitprice}</td>
                    <td>
                      {e?.gst?.map((g, i) => {
                        return (
                          <div key={i}>
                            {g?.title}&nbsp;{g?.taxAmount?.toFixed(2)}
                            <br />
                          </div>
                        );
                      })}
                    </td>
                    <td>{e?.gsttex?.toFixed(2)}</td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan="5" className="fw-bold text-right">
                  Total:
                </td>
                <td className="fw-bold">
                  &#x20B9;{invoiceObj?.totalproductsprice?.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="d-flex justify-content-end align-items-center">
            <h4 className="border-top border-dark mr-2">Signature</h4>
          </div>
        </div>
      </div>
    </>
  );
}

export default BillTable;
