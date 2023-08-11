import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { BillBook } from "../../../App";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import IconButton from "@mui/material/IconButton";
import MaterialDataTable from "../../containers/MaterialDataTable";

function BillInformation() {
  const context = useContext(BillBook);
  const [allBillDetails, setAllBillDetails] = useState([]);
  const [loading, setLoading] = React.useState(false);

  const getBillData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users/getbillinformation`
      );
      if (response?.data?.billinfo) {
        setAllBillDetails(response.data.billinfo);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching bill data:", error);
    }
  };

  useEffect(() => {
    getBillData();
  }, []);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/users/deletebillinfo/${id}`;
      const response = await axios.delete(url);
      if (response.status === 200) {
        setLoading(false);
        getBillData();
      }
    } catch (error) {
      setLoading(false);
      console.error("Error deleting bill:", error);
    }
  };

  const columns = [
    { title: "Customers Name", field: "name" },
    {
      title: "Products",
      field: "products",
      sorting: false,
      render: ({ products }) => (
        <>
          {products?.map((product, i) => (
            <div key={i}>
              <span>{i + 1}</span>.&nbsp;{product.productname}
            </div>
          ))}
        </>
      ),
    },
    { title: "Total Rs.", field: "totalproductsprice" },
    {
      title: "View",
      field: "View",
      sorting: false,
      render: (row) => (
        <Link to={`/billtable/${row._id}`}>
          <IconButton
            className="shadow-none"
            style={{ backgroundColor: "#CC0000" }}
          >
            <PictureAsPdfIcon sx={{ color: "#fff" }} />
          </IconButton>
        </Link>
      ),
    },
    {
      field: "actions",
      title: "Actions",
      sorting: false,
      render: (row) => (
        <div className="d-flex flex-row align-items-center gap-1">
          <div>
            <Link to={`/billform/${row._id}`}>
              <IconButton
                className="rounded-circle"
                onClick={() => {
                  // all details printed in a bill form
                  context?.setCustData(row);
                  context?.setProd(row?.products);
                }}
              >
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
  // const detailPanel = [
  //   {
  //     tooltip: "Depth",
  //     render: (rowData) => {
  //       return <div className="pl-5">"FIJQEOF"</div>;
  //     },
  //   },
  // ];
  return (
    <>
      <div className="content">
        <div className="d-flex justify-content-end align-items-center mb-3">
          <Link
            to="/billform/new"
            className="btn text-white shadow-none"
            style={{ backgroundColor: "#0d47a1" }}
          >
            Generate New Bill
          </Link>
        </div>
        <MaterialDataTable
          title="Bill Information"
          loading={loading}
          data={allBillDetails}
          columns={columns}
          setSate={setAllBillDetails}
          handleGetData={getBillData}
        />
      </div>
    </>
  );
}

export default BillInformation;
