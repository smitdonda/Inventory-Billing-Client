import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { BillBook } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import Header from "./Header";
import SiderBar from "./SiderBar";

function Products() {
  let context = useContext(BillBook);

  let navigate = useNavigate();
  let { id } = useParams();

  // products post url
  let productsurl =
    "https://inventory-billing-server-1.vercel.app/users/postproducts";

  // product put url
  let putproducturl =
    "https://inventory-billing-server-1.vercel.app/users/putproducts/";

  if (id !== "new") {
    if (context.products) {
      let findindex = context?.products?.findIndex((e) => e._id === id);
      var Edata = context?.products[findindex];
    }
    var handleSubmit = async (values) => {
      let res = await axios.put(putproducturl + id, values);
      if (res) {
        if (res.status === 200) {
          navigate("/productsdetails");
        }
      }
    };
  } else {
    handleSubmit = async (values) => {
      let data = await axios.post(productsurl, values);
      if (data) {
        if (data.status === 200) {
          navigate("/productsdetails");
        }
      }
    };
  }

  var formik = useFormik({
    initialValues: {
      productname: Edata && Edata.productname ? Edata.productname : "",
      availableproductqty:
        Edata && Edata.availableproductqty ? Edata.availableproductqty : "",
      unitprice: Edata && Edata.unitprice ? Edata.unitprice : "",
    },
    validationSchema: yup.object({
      productname: yup.string().required("Required"),
      availableproductqty: yup.number().required("Required"),
      unitprice: yup.number().required("Required"),
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
        <div style={{ marginTop: "100px" }}>
          <h2 className="text-center">Products Form</h2>
          <div className="container col-sm-6 d-flex justify-content-center align-items-center">
            <form className="col-md-6 m-auto" onSubmit={formik.handleSubmit}>
              <div className="form-group mt-5 mb-2">
                <div className="form-floating">
                  <input
                    id="productname"
                    name="productname"
                    type="text"
                    className="form-control"
                    placeholder="Enter Name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.productname}
                    required
                  />
                  <label htmlFor="productname">Product Name</label>
                </div>
                {formik.touched.productname && formik.errors.productname ? (
                  <div style={{ color: "red" }}>
                    {formik.errors.productname}
                  </div>
                ) : null}
              </div>
              <div className="form-group">
                <div className="form-floating">
                  <input
                    id="availableproductqty"
                    name="availableproductqty"
                    type="text"
                    className="form-control"
                    placeholder="Add Qty"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.availableproductqty}
                    required
                  />
                  <label htmlFor="availableproductqty">
                    Available Product Qty
                  </label>
                </div>
                {formik.touched.availableproductqty &&
                formik.errors.availableproductqty ? (
                  <div style={{ color: "red" }}>
                    {formik.errors.availableproductqty}
                  </div>
                ) : null}
              </div>
              <div className="form-group">
                <div className="form-floating">
                  <input
                    id="unitprice"
                    name="unitprice"
                    type="number"
                    className="form-control"
                    placeholder="Enter One Product Price"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.unitprice}
                    required
                  />
                  <label htmlFor="unitprice">Unit Price</label>
                </div>
                {formik.touched.unitprice && formik.errors.unitprice ? (
                  <div style={{ color: "red" }}>{formik.errors.unitprice}</div>
                ) : null}
              </div>
              {id !== "new" ? (
                <Button variant="warning" type="submit" className="shadow none">
                  Update
                </Button>
              ) : (
                <Button className="shadow none" type="submit">
                  Submit
                </Button>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Products;
