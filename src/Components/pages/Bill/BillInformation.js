import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import IconButton from "@mui/material/IconButton";
import { toast } from "react-toastify";
import axiosInstance from "../../../config/AxiosInstance";
import MaterialDataTable from "../../containers/MaterialDataTable";
import moment from "moment";

function BillInformation() {
  const [allBillDetails, setAllBillDetails] = useState([]);
  const [loading, setLoading] = React.useState(false);

  const getBillData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/billInformation`);
      if (response?.data?.success) {
        setAllBillDetails(response.data.billinfo);
      } else {
        setAllBillDetails([]);
      }
      setLoading(false);
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
      const response = await axiosInstance.delete(`billInformation/${id}`);
      if (response.data.success) {
        setLoading(false);
        getBillData();
        toast.success("DELETEED");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error deleting bill:", error);
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  const columns = [
    { title: "#", field: "id" },
    { title: "Customers Name", field: "name" },
    {
      title: "Date",
      field: "createdAt",
      render: ({ createdAt }) => <>{moment(createdAt).format("DD/MM/YYYY")}</>,
    },
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
              <IconButton className="rounded-circle">
                <EditIcon />
              </IconButton>
            </Link>
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
  // const detailPanel = [
  //   {
  //     tooltip: "Depth",
  //     render: (rowData) => {
  //       return <div style={{ paddingLeft: "50px" }}>"FIJQEOF"</div>;
  //     },
  //   },
  // ];
  return (
    <>
      <div className="d-flex justify-content-end align-items-center mb-3">
        <Link to="/billform/new" className="btn  btn-primary shadow-none">
          Generate New Bill
        </Link>
      </div>
      <MaterialDataTable
        title="Bill Information"
        loading={loading}
        data={allBillDetails}
        columns={columns}
        setState={setAllBillDetails}
        handleGetData={getBillData}
        // detailPanel={detailPanel}
      />
    </>
  );
}

export default BillInformation;
