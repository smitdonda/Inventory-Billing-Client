import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import axiosInstance from "../../../config/AxiosInstance";
import { SpinLoader } from "../Loaders/loaders";

function CustomersFrom({ id, open, handleClose, editData, customerData }) {
  const [loadding, setLoadding] = useState(false);

  // Helper function to handle form submission
  const handleSubmit = async (values) => {
    try {
      setLoadding(true);
      let response;
      if (id) {
        response = await axiosInstance.put(`/customers/${id}`, values);
      } else {
        response = await axiosInstance.post(`/customers`, values);
      }
      if (response?.data?.success) {
        customerData();
        setLoadding(false);
        toast.success(response?.data?.message);
        handleClose();
      }
    } catch (error) {
      setLoadding(false);
      console.log("Error", error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  };

  // Schema for form validation
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editData?.name || "",
      email: editData?.email || "",
      phoneNo: editData?.phoneNo || "",
      gstNo: editData?.gstNo || "",
    },
    validationSchema: yup.object({
      name: yup.string().required("Required"),
      email: yup.string().email("Invaild Email").required("Required"),
      phoneNo: yup
        .string()
        .matches(/^\d{10}$/, "Mobile Number is not valid")
        .required("Required"),
      gstNo: yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  return (
    <div>
      <Modal show={open} onHide={handleClose} centered className="p-0">
        <form onSubmit={formik.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Customer Form</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div className="form-group mb-3">
                <div className="form-floating">
                  <input
                    name="name"
                    type="text"
                    className="form-control"
                    placeholder="Enter Name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                  />
                  <label htmlFor="name">Customer Name</label>
                </div>
                {formik.touched.name && formik.errors.name ? (
                  <div style={{ color: "red" }}>{formik.errors.name}</div>
                ) : null}
              </div>
              <div className="form-group mt-3">
                <div className="form-floating">
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                  <label htmlFor="email">Email</label>
                </div>
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-danger">{formik.errors.email}</div>
                ) : null}
              </div>
              <div className="row">
                <div className="form-group col mt-3">
                  <div className="form-floating">
                    <input
                      name="phoneNo"
                      type="number"
                      className="form-control"
                      placeholder="Enter Phone No."
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.phoneNo}
                    />
                    <label htmlFor="phoneNo">Phone No.</label>
                  </div>
                  {formik.touched.phoneNo && formik.errors.phoneNo ? (
                    <div className="text-danger">{formik.errors.phoneNo}</div>
                  ) : null}
                </div>
              </div>
              <div className="form-group mt-3">
                <div className="form-floating">
                  <input
                    name="gstNo"
                    type="text"
                    className="form-control"
                    placeholder="Gst No."
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.gstNo}
                  />
                  <label htmlFor="gstNo">Gst No.</label>
                </div>
                {formik.touched.gstNo && formik.errors.gstNo ? (
                  <div className="text-danger">{formik.errors.gstNo}</div>
                ) : null}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {id ? (
              <Button type="submit" variant="warning">
                {loadding ? <SpinLoader /> : "Update"}
              </Button>
            ) : (
              <Button type="submit" variant="primary">
                {loadding ? <SpinLoader /> : "Submit"}
              </Button>
            )}
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default CustomersFrom;
