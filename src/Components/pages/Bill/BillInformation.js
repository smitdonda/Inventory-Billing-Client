import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import IconButton from "@mui/material/IconButton";
import { toast } from "react-toastify";
import axiosInstance from "../../../config/AxiosInstance";

import MaterialReactTable from "../../containers/MaterialReactTable";
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

  const columns = useMemo(
    () => [
      {
        header: "#Id",
        accessorKey: "id",
        size: 135,
      },
      { header: "Name", accessorKey: "name", size: 150 },
      {
        header: "Date",
        accessorKey: "createdAt",
        size: 140,
        Cell: ({ renderedCellValue }) => (
          <>{moment(renderedCellValue).format("DD/MM/YYYY")}</>
        ),
      },
      {
        header: "Products",
        accessorKey: "products",
        size: 150,
        enableSorting: false,
        Cell: ({ renderedCellValue }) => (
          <>
            {renderedCellValue?.map((product, i) => (
              <div key={i}>
                <span>{i + 1}</span>.&nbsp;{product.productname}
              </div>
            ))}
          </>
        ),
      },
      { header: "Total Rs.", accessorKey: "totalproductsprice", size: 140 },
      {
        header: "View",
        accessorKey: "View",
        sorting: false,
        size: 70,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <div>
            <Link to={`/billtable/${row.original._id}`}>
              <IconButton
                className="shadow-none"
                style={{ backgroundColor: "#CC0000" }}
              >
                <PictureAsPdfIcon sx={{ color: "#fff" }} />
              </IconButton>
            </Link>
          </div>
        ),
      },
    ],
    []
  );

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
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
          <h4 className="page-heading">Bill Information</h4>
        </div>
        <div>
          <Link to="/billform/new" className="btn btn-primary shadow-none">
            Generate New Bill
          </Link>
        </div>
      </div>
      <MaterialReactTable
        loading={loading}
        data={allBillDetails}
        columns={columns}
        renderRowActions={({ row }) => (
          <>
            <div className="d-flex flex-row justify-content-center align-items-center gap-1">
              <div>
                <Link to={`/billform/${row.original._id}`}>
                  <IconButton className="rounded-circle">
                    <EditIcon />
                  </IconButton>
                </Link>
              </div>
              <div>
                <IconButton
                  className="rounded-circle"
                  onClick={() => handleDelete(row.original._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          </>
        )}
      />
    </>
  );
}

export default BillInformation;
