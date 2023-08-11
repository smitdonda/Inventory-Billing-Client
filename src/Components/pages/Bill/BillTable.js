import React, { useState, useEffect, useContext, useRef } from "react";
import { Table } from "react-bootstrap";
import { BillBook } from "../../../App";
import { useParams } from "react-router-dom";
import Pdf from "react-to-pdf";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const options = {
  orientation: "landscape",
  unit: "in",
  format: [13.6, 10],
};

function BillTable() {
  const context = useContext(BillBook);
  const { id } = useParams();
  const ref = useRef();

  const [invoiceObj, setInvoiceObj] = useState([]);
  const [InvoceId, setInvoceId] = useState();

  const invoiceData = () => {
    if (context?.allbilldetails) {
      const findIndex = context.allbilldetails.findIndex(
        (invoice) => invoice?._id === id
      );
      setInvoiceObj(context?.allbilldetails[findIndex]);
      setInvoceId(findIndex + 1);
    }
  };

  useEffect(() => {
    invoiceData();
  }, [context]);

  return (
    <>
      <div className="content">
        <div>
          <div>
            <div className="d-flex justify-content-end align-items-end mb-1">
              <h3>Genrate PDF</h3>
            </div>
            <div className="d-flex justify-content-end align-items-end mb-4 mr-4">
              <Pdf targetRef={ref} filename="Invoice.pdf" options={options}>
                {({ toPdf }) => (
                  <button
                    className="btn btn-primary shadow-none "
                    onClick={toPdf}
                  >
                    <FileDownloadIcon />
                    &nbsp;Invoice
                  </button>
                )}
              </Pdf>
            </div>
          </div>
          <div
            ref={ref}
            className="mb-5 "
            style={{
              width: "auto",
              height: "auto",
              fontFamily: "VT323, monospace",
            }}
          >
            <div className="container">
              <div className="text-center mb-5 mt-5">
                <div>
                  <h2>{context?.myprofile?.companyname}</h2>
                </div>
                <div>
                  <div className="text-uppercase">
                    {context?.myprofile?.address}
                  </div>
                  <div className="text-uppercase">
                    {context?.myprofile?.state}&nbsp;,&nbsp;
                    {context?.myprofile?.city}
                  </div>
                  <div>Phone&nbsp;:{context?.myprofile?.phone}</div>
                  <div>Email&nbsp;:{context?.myprofile?.cemail}</div>
                </div>
              </div>
              <Table size="sm" className="m-auto table table-borderless ">
                <tr>
                  <th scope="col">Bill to&nbsp;</th>
                </tr>
                <tr>
                  <th scope="col">
                    Name&nbsp;:&nbsp;
                    <span className="font-weight-normal ">
                      {invoiceObj?.name}
                    </span>
                  </th>
                </tr>
                <tr>
                  <th scope="col">
                    Address&nbsp;:&nbsp;
                    <span className="font-weight-normal">
                      {invoiceObj?.address}
                    </span>
                  </th>
                  <th scope="col">
                    Invoice Id No&nbsp;:&nbsp;
                    <span className="font-weight-normal">&#35;{InvoceId}</span>
                  </th>
                </tr>
                <tr>
                  <th scope="col">
                    Phone No&nbsp;:&nbsp;
                    <span className="font-weight-normal">
                      {invoiceObj?.phone}
                    </span>
                  </th>
                  <th scope="col">
                    Invoice Date&nbsp;:&nbsp;
                    <span className="font-weight-normal">
                      {invoiceObj?.date}
                    </span>
                  </th>
                </tr>
                <tr>
                  <th scope="col" colSpan="2">
                    GST No&nbsp;:&nbsp;
                    <span className="font-weight-normal">
                      {invoiceObj?.gstno}
                    </span>
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
                                {g?.title}&nbsp;{g?.taxAmount}
                                <br />
                              </div>
                            );
                          })}
                        </td>
                        <td>{e?.gsttex}</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan="5" className="font-weight-bold text-right">
                      Total&nbsp;:
                    </td>
                    <td>&#x20B9;{invoiceObj?.totalproductsprice}</td>
                  </tr>
                </tbody>
              </table>
              <div className="d-flex justify-content-end align-items-center">
                <h4 className="border-top border-dark mr-2">Signature</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BillTable;
