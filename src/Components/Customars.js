import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { BillBook } from "../App";
import Header from "./Header";
import SiderBar from "./SiderBar";

function Customars() {
  let context = useContext(BillBook);

  let navigate = useNavigate();

  let { id } = useParams();

  let customerurl =
    "https://inventory-billing-server-1.vercel.app/users/postcustomers/ ";
  let putcustomersurl =
    "https://inventory-billing-server-1.vercel.app/users/putcustomers/";

  if (id !== "new") {
    if (context && context.customers) {
      let findIndex = context?.customers?.findIndex((e) => e._id === id);
      var edata = context?.customers[findIndex];
    }

    var handleSubmit = async (values) => {
      let res = await axios.put(putcustomersurl + id, values);
      if (res) {
        if (res.status === 200) {
          navigate("/customersdetails");
        }
      }
    };
  } else {
    handleSubmit = async (values) => {
      let cust = await axios.post(customerurl, values);
      if (cust) {
        if (cust.status === 200) {
          navigate("/customersdetails");
        }
      }
    };
  }

  var formik = useFormik({
    initialValues: {
      name: edata && edata.name ? edata.name : "",
      email: edata && edata.email ? edata.email : "",
      phone: edata && edata.phone ? edata.phone : "",
      date: edata && edata.date ? edata.date : "",
      gstno: edata && edata.gstno ? edata.gstno : "",
      address: edata && edata.address ? edata.address : "",
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

  return (
    <>
      <SiderBar />
      <Header />
      <div className="content">
        <div className="container" style={{ marginTop: "100px" }}>
          <h2 className="text-dark text-center">Customer Form</h2>
          <hr className="mt-3 mb-4 m-auto" style={{ width: "30%" }} />
          <form
            className="col-lg-3 col-xl-4 m-auto"
            onSubmit={formik.handleSubmit}
            style={{ marginTop: "100px" }}
          >
            <div className="mb-4">
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
                  required
                />
                <label htmlFor="name">Customer Name</label>
              </div>
              {formik.touched.name && formik.errors.name ? (
                <div style={{ color: "red" }}>{formik.errors.name}</div>
              ) : null}
            </div>
            <div className="form-group mt-2">
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
                  required
                />
                <label htmlFor="email">Email</label>
              </div>
              {formik.touched.email && formik.errors.email ? (
                <div className="text-danger">{formik.errors.email}</div>
              ) : null}
            </div>
            <div className="row">
              <div className="form-group col mt-2">
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
                    required
                  />
                  <label htmlFor="phone">Phone No.</label>
                </div>
                {formik.touched.phone && formik.errors.phone ? (
                  <div className="text-danger">{formik.errors.phone}</div>
                ) : null}
              </div>
              <div className="form-group col mt-2">
                <div className="form-floating">
                  <input
                    id="date"
                    name="date"
                    type="date"
                    className="form-control text-uppercase"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.date}
                    required
                  />
                  <label htmlFor="date">Date</label>
                </div>
                {formik.touched.date && formik.errors.date ? (
                  <div className="text-danger">{formik.errors.date}</div>
                ) : null}
              </div>
            </div>
            <div className="form-group mt-2">
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
                  required
                />
                <label htmlFor="gstno">Gst No.</label>
              </div>
              {formik.touched.gstno && formik.errors.gstno ? (
                <div className="text-danger">{formik.errors.gstno}</div>
              ) : null}
            </div>
            <div className="form-group mt-2">
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
            <div>
              {id !== "new" ? (
                <Button type="submit" className="btn btn-warning shadow-none">
                  Update
                </Button>
              ) : (
                <Button type="submit" className="btn  btn-primary shadow-none">
                  Submit
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Customars;
