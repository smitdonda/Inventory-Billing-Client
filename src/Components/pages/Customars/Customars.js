import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { BillBook } from "../../../App";
import { SpinLoader } from "../Loaders/loaders";

function Customars() {
  let context = useContext(BillBook);
  const navigate = useNavigate();
  const [editData, setEditData] = useState({});
  const { id } = useParams();
  const [loadding, setLoadding] = useState(false);
  
  // Helper function to handle form submission
  const handleSubmit = async (values) => {
    try {
      setLoadding(true);
      let url;
      if (id !== "new") {
        url = `${process.env.REACT_APP_BACKEND_URL}/users/putcustomers/${id}`;
      } else {
        url = `${process.env.REACT_APP_BACKEND_URL}/users/postcustomers`;
      }

      const response = await axios[id !== "new" ? "put" : "post"](url, values);
      if (response.status === 200) {
        navigate("/customersdetails");
      }
    } catch (error) {
      console.log("Error", error);
    }
    setLoadding(false);
  };

  // Schema for form validation
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editData.name || "",
      email: editData.email || "",
      phone: editData.phone || "",
      date: editData.date || "",
      gstno: editData.gstno || "",
      address: editData.address || "",
    },
    validationSchema: yup.object({
      name: yup.string().required("Required"),
      email: yup.string().email("Invaild Email").required("Required"),
      phone: yup
        .string()
        .matches(/^\d{10}$/, "Mobile Number is not valid")
        .required("Required"),
      date: yup.string().required("Required"),
      gstno: yup.string().required("Required"),
      address: yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  useEffect(() => {
    // Check if id is not "new", then pre-fill form with data
    if (id !== "new" && context && context.customers) {
      if (context && context.customers) {
        const findIndex = context.customers.findIndex((e) => e._id === id);
        const edata = context.customers[findIndex];
        console.log(edata);
        if (edata) {
          setEditData({
            name: edata.name,
            email: edata.email,
            phone: edata.phone,
            date: edata.date,
            gstno: edata.gstno,
            address: edata.address,
          });
        }
      }
    }
  }, [id, context]);

  return (
    <>
      <div className="content">
        <div>
          <h2 className="text-dark text-center">Customer Form</h2>
          <hr className="mt-3 mb-4 m-auto" style={{ width: "30%" }} />
          <div className="d-flex justify-content-center align-items-center">
            <form onSubmit={formik.handleSubmit}>
              <div className="form-group mb-3">
                <div className="form-floating">
                  <input
                    id="name"
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
                    id="email"
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
                      id="phone"
                      name="phone"
                      type="number"
                      className="form-control"
                      placeholder="Enter Phone No."
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.phone}
                    />
                    <label htmlFor="phone">Phone No.</label>
                  </div>
                  {formik.touched.phone && formik.errors.phone ? (
                    <div className="text-danger">{formik.errors.phone}</div>
                  ) : null}
                </div>
                <div className="form-group col mt-3">
                  <div className="form-floating">
                    <input
                      id="date"
                      name="date"
                      type="date"
                      className="form-control text-uppercase"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.date}
                    />
                    <label htmlFor="date">Date</label>
                  </div>
                  {formik.touched.date && formik.errors.date ? (
                    <div className="text-danger">{formik.errors.date}</div>
                  ) : null}
                </div>
              </div>
              <div className="form-group mt-3">
                <div className="form-floating">
                  <input
                    id="gstno"
                    name="gstno"
                    type="text"
                    className="form-control"
                    placeholder="Gst No."
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.gstno}
                  />
                  <label htmlFor="gstno">Gst No.</label>
                </div>
                {formik.touched.gstno && formik.errors.gstno ? (
                  <div className="text-danger">{formik.errors.gstno}</div>
                ) : null}
              </div>
              <div className="form-group mt-3">
                <div className="form-floating">
                  <input
                    id="address"
                    name="address"
                    type="address"
                    className="form-control"
                    placeholder="Address"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.address}
                  />
                  <label htmlFor="address">Address</label>
                </div>
                {formik.touched.address && formik.errors.address ? (
                  <div className="text-danger">{formik.errors.address}</div>
                ) : null}
              </div>
              <div className="form-group mt-3">
                {id !== "new" ? (
                  <Button type="submit" variant="warning">
                    {loadding ? <SpinLoader /> : "Update"}
                  </Button>
                ) : (
                  <Button type="submit" variant="primary">
                    {loadding ? <SpinLoader /> : "Submit"}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Customars;
