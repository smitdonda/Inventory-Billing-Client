import React, { useState, useEffect, useMemo } from "react";
import { Button } from "react-bootstrap";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ContentCopy } from "@mui/icons-material";

import { toast } from "react-toastify";
import MaterialReactTable from "../../containers/MaterialReactTable";
import CustomersFrom from "./CustomersFrom";
import axiosInstance from "../../../config/AxiosInstance";
import moment from "moment";

function CustomerDetails() {
  // get customers Information
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // edit customer data
  const [id, setId] = useState(null);
  const [editData, setEditData] = useState({});

  const customerData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/customers");
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

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete(`/customers/${id}`);
      if (response.data.success) {
        customerData();
        setLoading(false);
        toast.success("DELETEED");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error deleting customer:", error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  };

  const [productModelOpen, setProductsModelOpen] = useState(false);

  const handleClickOpen = (value) => {
    setEditData(value);
    setId(value._id);
    setProductsModelOpen(true);
  };

  const handleClose = () => {
    setProductsModelOpen(false);
    setEditData({});
    setId(null);
  };

  const renderValue = (value) => {
    return value?.length > 15 ? `${value.substring(0, 15)}...` : value;
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "#Id",
        size: 140,
        enableColumnOrdering: false,
      },
      {
        accessorKey: "name",
        header: "Name",
        maxSize: 150,
        minSize: 130,
      },
      {
        accessorKey: "email",
        header: "Email",
        maxSize: 200,
        minSize: 150,
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        size: 140,
        Cell: ({ renderedCellValue }) => (
          <>{moment(renderedCellValue).format("DD/MM/YYYY")}</>
        ),
      },
      {
        accessorKey: "phoneNo",
        header: "PhoneNo",
        size: 140,
      },
      {
        accessorKey: "gstNo",
        header: "GST No",
        maxSize: 200,
        minSize: 150,
        enableClickToCopy: true,
        Cell: ({ renderedCellValue }) => <>{renderValue(renderedCellValue)}</>,
        muiTableBodyCellCopyButtonProps: {
          fullWidth: true,
          startIcon: <ContentCopy />,
          sx: { justifyContent: "flex-start" },
        },
      },
    ],
    []
  );

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between mb-4">
        <div>
          <h4 className="page-heading">Customers Information</h4>
        </div>
        <div>
          <Button
            className="shadow-none"
            onClick={() => setProductsModelOpen(true)}
          >
            Add New Customar
          </Button>
        </div>
      </div>
      <div>
        <MaterialReactTable
          // renderTopToolbarCustomActions={() => (
          //   <h4 className="MuiTypography-h6">Customers Information</h4>
          // )}
          columns={columns}
          data={customers}
          loading={loading}
          renderRowActions={({ row }) => (
            <div className="d-flex flex-row justify-content-center align-items-center gap-1">
              <IconButton
                className="rounded-circle"
                onClick={() => handleClickOpen(row.original)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                className="rounded-circle"
                onClick={() => handleDelete(row.original._id)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          )}
        />
      </div>
      <CustomersFrom
        id={id}
        handleClose={handleClose}
        open={productModelOpen}
        editData={editData}
        customerData={customerData}
      />
    </>
  );
}

export default CustomerDetails;
