import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BillBook } from "../App";
import { useFormik } from "formik";
import * as yup from "yup";
import Header from "./Header";
import SiderBar from "./SiderBar";

function ProfileForm() {
  let context = useContext(BillBook);

  let navigate = useNavigate();
  let { id } = useParams();

  let putproducturl = "https://bill-book-server.herokuapp.com/users/putmyprofile/";

  let companyurl = "https://bill-book-server.herokuapp.com/users/myprofilepost/";

  // find the Id data

  if (id !== "new") {
    var handleSubmit = async (values) => {
      let res = await axios.put(putproducturl + id, values);
      if (res) {
        if (res.status === 200) {
          navigate("/myprofile");
        }
      }
    };
  } else {
    // Post method my profille
    handleSubmit = async (values) => {
      let res = await axios.post(companyurl, values);
      if (res) {
        if (res.status === 200) {
          navigate("/myprofile");
        }
      }
    };
  }

  const companyprofile = useFormik({
    initialValues: {
      companyname:
        context && context.myprofile && context?.myprofile?.companyname
          ? context?.myprofile?.companyname
          : "",
      cemail:
        context && context?.myprofile && context?.myprofile?.cemail
          ? context?.myprofile?.cemail
          : "",
      address:
        context && context?.myprofile && context?.myprofile?.address
          ? context?.myprofile?.address
          : "",
      city:
        context && context?.myprofile && context?.myprofile?.city
          ? context?.myprofile?.city
          : "",
      state:
        context && context?.myprofile && context?.myprofile?.state
          ? context?.myprofile?.state
          : "",
      pinno:
        context && context?.myprofile && context?.myprofile?.pinno
          ? context?.myprofile?.pinno
          : "",
      phone:
        context && context?.myprofile && context?.myprofile?.phone
          ? context?.myprofile?.phone
          : "",
    },
    validationSchema: yup.object({
      companyname: yup.string().required("Required"),
      cemail: yup.string().email("Invalid Email").required("Required"),
      address: yup.string().required("Required"),
      city: yup.string().required("Required"),
      state: yup.string().required("Required"),
      pinno: yup.number().required("Required"),
      phone: yup
        .string()
        .matches(/^\d{10}$/, "Mobile Number is not valid")
        .required("Required"),
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
        <div style={{ marginTop: "90px" }}>
          <div>
            <h2 className="text-center">Company Details </h2>
          </div>

          <form
            className="container col-md-4 col-xl-6 mt-5"
            onSubmit={companyprofile.handleSubmit}
          >
            <div className="row">
              <div className="col ml-3 mb-3">
                {/* company name */}
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="companyname"
                    name="companyname"
                    placeholder="mycompanyname"
                    onBlur={companyprofile.handleBlur}
                    onChange={companyprofile.handleChange}
                    value={companyprofile.values.companyname}
                  />
                  <label htmlFor="companyname">Company Name</label>
                </div>
                {companyprofile.touched.companyname &&
                companyprofile.errors.companyname ? (
                  <div style={{ color: "red" }}>
                    {companyprofile.errors.companyname}
                  </div>
                ) : null}
              </div>
              {/* Company Email */}
              <div className="col mb-3">
                <div className="form-floating">
                  <input
                    type="email"
                    className="form-control"
                    id="cemail"
                    name="cemail"
                    placeholder="mycompanyname"
                    onBlur={companyprofile.handleBlur}
                    onChange={companyprofile.handleChange}
                    value={companyprofile.values.cemail}
                  />
                  <label htmlFor="cemail">company Email Id</label>
                </div>
                {companyprofile.touched.cemail &&
                companyprofile.errors.cemail ? (
                  <div style={{ color: "red" }}>
                    {companyprofile.errors.cemail}
                  </div>
                ) : null}
              </div>
            </div>
            {/*Address*/}
            <div className="col mb-4">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control "
                  id="address"
                  name="address"
                  placeholder="mycompanyname"
                  onBlur={companyprofile.handleBlur}
                  onChange={companyprofile.handleChange}
                  value={companyprofile.values.address}
                />
                <label htmlFor="address">Address</label>
              </div>
              {companyprofile.touched.address &&
              companyprofile.errors.address ? (
                <div style={{ color: "red" }}>
                  {companyprofile.errors.address}
                </div>
              ) : null}
            </div>
            <div className="row ml-1">
              {/* city */}
              <div className="col mr-5 mb-3">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    name="city"
                    placeholder="mycompanyname"
                    onBlur={companyprofile.handleBlur}
                    onChange={companyprofile.handleChange}
                    value={companyprofile.values.city}
                  />
                  <label htmlFor="city">City</label>
                </div>
                {companyprofile.touched.city && companyprofile.errors.city ? (
                  <div style={{ color: "red" }}>
                    {companyprofile.errors.city}
                  </div>
                ) : null}
              </div>
              {/* state */}
              <div className="col mr-5 mb-3">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="state"
                    name="state"
                    placeholder="mycompanyname"
                    onBlur={companyprofile.handleBlur}
                    onChange={companyprofile.handleChange}
                    value={companyprofile.values.state}
                  />
                  <label htmlFor="state">State</label>
                </div>
                {companyprofile.touched.state && companyprofile.errors.state ? (
                  <div style={{ color: "red" }}>
                    {companyprofile.errors.state}
                  </div>
                ) : null}
              </div>
              {/* pinno */}
              <div className="col mr-5 mb-3">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="pinno"
                    name="pinno"
                    placeholder="mycompanyname"
                    onBlur={companyprofile.handleBlur}
                    onChange={companyprofile.handleChange}
                    value={companyprofile.values.pinno}
                  />
                  <label htmlFor="pinno">Pin code</label>
                </div>
                {companyprofile.touched.pinno && companyprofile.errors.pinno ? (
                  <div style={{ color: "red" }}>
                    {companyprofile.errors.pinno}
                  </div>
                ) : null}
              </div>
            </div>
            <div>
              {/* Phone */}
              <div className="col col-md-7 mr-5 mb-3">
                <div className="form-floating">
                  <input
                    type="number"
                    className="form-control"
                    id="phone"
                    name="phone"
                    onBlur={companyprofile.handleBlur}
                    onChange={companyprofile.handleChange}
                    value={companyprofile.values.phone}
                  />
                  <label htmlFor="phone">Mobile No</label>
                </div>
                {companyprofile.touched.phone && companyprofile.errors.phone ? (
                  <div style={{ color: "red" }}>
                    {companyprofile.errors.phone}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="ml-3">
              {id !== "new" ? (
                <Button variant="warning" type="submit">
                  Update
                </Button>
              ) : (
                <Button variant="primary" type="submit">
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

export default ProfileForm;
