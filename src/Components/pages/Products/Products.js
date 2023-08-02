import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { BillBook } from "../../../App";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

function Products() {
  let context = useContext(BillBook);
  let [editData, setEditData] = useState({});
  let navigate = useNavigate();
  let { id } = useParams();

  const handleSubmit = async (values) => {
    const apiUrl =
      id !== "new"
        ? `${process.env.REACT_APP_BACKEND_URL}/users/putproducts/${id}`
        : `${process.env.REACT_APP_BACKEND_URL}/users/postproducts`;
    try {
      const response = await axios[id !== "new" ? "put" : "post"](
        apiUrl,
        values
      );
      if (response && response.status === 200) {
        navigate("/productsdetails");
      }
    } catch (error) {
      console.error("Error occurred while submitting data: ", error);
    }
  };

  var formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      productname: editData.productname || "",
      availableproductqty: editData.availableproductqty || "",
      unitprice: editData.unitprice || "",
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

  useEffect(() => {
    // Check if id is not "new", then pre-fill form with data
    if (id !== "new" && context && context.products) {
      const findindex = context.products.findIndex((e) => e._id === id);

      // Check if the product with the given id is found
      if (findindex !== -1) {
        const edata = context.products[findindex];

        // Check if edata is defined before updating the state
        if (edata) {
          setEditData({
            productname: edata.productname,
            availableproductqty: edata.availableproductqty,
            unitprice: edata.unitprice,
          });
        }
      }
    }
  }, [id, context]);

  return (
    <>
      <div className="content">
        <div>
          <h2 className="text-center">Products Form</h2>
          <div className="container col-sm-6 d-flex justify-content-center align-items-center">
            <form className="col-md-6 m-auto" onSubmit={formik.handleSubmit}>
              <div className="form-group mt-5 mb-3">
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
              <div className="form-group mt-3">
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
              <div className="form-group mt-3">
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
              <div className="form-group mt-3">
                {id !== "new" ? (
                  <Button
                    variant="warning"
                    type="submit"
                    className="shadow none"
                  >
                    Update
                  </Button>
                ) : (
                  <Button className="shadow none" type="submit">
                    Submit
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

export default Products;
