import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import axiosInstance from "../../../config/AxiosInstance";
import { SpinLoader } from "../../containers/Loaders/loaders";

function ProductForm({ id, open, handleClose, editData, getProductsData }) {
  const [loadding, setLoadding] = useState(false);

  const handleSubmit = async (values) => {
    debugger;
    try {
      setLoadding(true);
      let response;
      if (id) {
        response = await axiosInstance.put(`/products/${id}`, values);
      } else {
        response = await axiosInstance.post(`/products`, values);
      }
      if (response?.data?.success) {
        getProductsData();
        toast.success(response.data?.message);
        setLoadding(false);
        handleClose();
      }
    } catch (error) {
      setLoadding(false);
      console.error("Error occurred while submitting data: ", error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
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
  return (
    <Modal show={open} onHide={handleClose} centered className="p-0">
      <form onSubmit={formik.handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group mt-1 mb-3">
            <div className="form-floating">
              <input
                name="productname"
                type="text"
                className="form-control"
                placeholder="Enter Name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.productname}
              />
              <label htmlFor="productname">Product Name</label>
            </div>
            {formik.touched.productname && formik.errors.productname ? (
              <div className="text-danger">{formik.errors.productname}</div>
            ) : null}
          </div>
          <div className="form-group mt-3">
            <div className="form-floating">
              <input
                name="availableproductqty"
                type="text"
                className="form-control"
                placeholder="Add Qty"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.availableproductqty}
              />
              <label htmlFor="availableproductqty">Available Product Qty</label>
            </div>
            {formik.touched.availableproductqty &&
            formik.errors.availableproductqty ? (
              <div className="text-danger">
                {formik.errors.availableproductqty}
              </div>
            ) : null}
          </div>
          <div className="form-group mt-3">
            <div className="form-floating">
              <input
                name="unitprice"
                type="number"
                className="form-control"
                placeholder="Enter One Product Price"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.unitprice}
              />
              <label htmlFor="unitprice">Unit Price</label>
            </div>
            {formik.touched.unitprice && formik.errors.unitprice ? (
              <div className="text-danger">{formik.errors.unitprice}</div>
            ) : null}
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
  );
}

export default ProductForm;
