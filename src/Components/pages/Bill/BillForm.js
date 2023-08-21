import React, { useContext, useState } from "react";
import ProductsModal from "./ProductsModal";
import { useNavigate, useParams } from "react-router-dom";
import { Dropdown, Table, Button } from "react-bootstrap";
import { BillBook } from "../../../App";
import { useFormik } from "formik";
import * as yup from "yup";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import axiosInstance from "../../../config/AxiosInstance";
import { SpinLoader } from "../Loaders/loaders";

function BillForm() {
  let context = useContext(BillBook);
  const { id } = useParams();
  const navigate = useNavigate();

  //  Products modal Visible or Invisible
  const [modalShow, setModalShow] = useState(false);

  const [loadding, setLoadding] = useState(false);

  const handleSubmit = async (values) => {
    setLoadding(true);
    values.totalproductsprice = context.custdata.totalproductsprice;
    if (id !== "new") {
      // Update existing bill Information
      try {
        const res = await axiosInstance.put(`/billInformation/${id}`, values);
        if (res.data?.success) {
          updateProductQuantities(values.products);
          navigate("/billinformation");
          toast.success(res.data?.message);
          setLoadding(false);
        }
      } catch (error) {
        console.error("Error updating bill:", error);
        if (error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
        setLoadding(false);
      }
    } else {
      // Create a new bill Information
      try {
        setLoadding(true);
        const billInfo = await axiosInstance.post("/billInformation", values);
        if (billInfo.data?.success) {
          updateProductQuantities(values.products);
          navigate("/billinformation");
          setLoadding(false);
          toast.success(billInfo.data?.message);
        }
      } catch (error) {
        setLoadding(false);
        console.error("Error creating bill:", error);
        if (error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    }
  };

  const updateProductQuantities = async (products) => {
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const pfindIndex = context.products?.findIndex(
        (e) => e._id === product._id
      );
      if (pfindIndex !== -1) {
        context.products[pfindIndex].availableproductqty -= product?.quantity;
        try {
          await axiosInstance.put(
            `/products/${context?.products[pfindIndex]._id}`,
            {
              availableproductqty:
                context?.products[pfindIndex].availableproductqty,
            }
          );
        } catch (error) {
          console.error("Error updating product quantity:", error);
        }
      }
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: context?.custdata?.name || "",
      email: context?.custdata?.email || "",
      phoneNo: context?.custdata?.phoneNo || "",
      gstNo: context?.custdata?.gstNo || "",
      totalproductsprice: context?.custdata?.totalproductsprice || "",
      products: context?.prod || [],
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

  // produts delete
  // one product object delete
  const handleDelete = (product) => {
    const sub = context.custdata.totalproductsprice - product.gsttex;
    context.setCustData((prevData) => ({
      ...prevData,
      totalproductsprice: sub,
    }));
    context.setProd((prevProd) => prevProd.filter((p) => p !== product));
  };

  return (
    <>
      <div id="bill-form">
        <div className="text-center">
          <h2>Bill Form</h2>
          <hr />
        </div>

        <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
          <div className="d-flex justify-content-between">
            <div className="ml-3">
              <Dropdown>
                <Dropdown.Toggle
                  variant="primary"
                  className="shadow-none"
                  size="md"
                >
                  Select Customers
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {context?.customers?.map((e, i) => {
                    return (
                      <div key={i}>
                        <Dropdown.Item
                          onClick={() => {
                            formik.setFieldValue("name", e.name);
                            formik.setFieldValue("email", e.email);
                            formik.setFieldValue("phoneNo", e.phoneNo);
                            formik.setFieldValue("gstNo", e.gstNo);
                          }}
                        >
                          {e?.name}&nbsp;<span>({e.id})</span>
                        </Dropdown.Item>
                      </div>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            {/* update and  submit buttons  */}
            <div>
              {/* save and updated */}
              {id !== "new" ? (
                <Button
                  type="submit"
                  variant="warning"
                  className="mr-3 shadow-none"
                >
                  {loadding ? <SpinLoader /> : "Update"}
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="success"
                  className="mr-3 shadow-none"
                >
                  {loadding ? <SpinLoader /> : "Save"}
                </Button>
              )}
            </div>
          </div>
          <div className="col-xl-6 col-lg-5">
            <div className="form-group mt-3">
              <label htmlFor="name">Customer Name</label>
              <input
                name="name"
                type="text"
                className="form-control"
                placeholder="Customers Name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
                disabled
              />
              {formik.touched.name && formik.errors.name ? (
                <div style={{ color: "red" }}>{formik.errors.name}</div>
              ) : null}
            </div>
            <div className="form-group  mt-3">
              <label htmlFor="email">Email Id</label>
              <input
                name="email"
                type="email"
                className="form-control"
                placeholder="Enter Your Email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-danger">{formik.errors.email}</div>
              ) : null}
            </div>
            <div className="row  mt-3">
              <div className="form-group col">
                <label htmlFor="phoneNo">Phone</label>
                <input
                  name="phoneNo"
                  type="number"
                  className="form-control"
                  placeholder="Enter Phone No."
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.phoneNo}
                />
                {formik.touched.phoneNo && formik.errors.phoneNo ? (
                  <div className="text-danger">{formik.errors.phoneNo}</div>
                ) : null}
              </div>
              <div className="form-group  mt-3">
                <label htmlFor="gstNo">Gst No.</label>
                <input
                  name="gstNo"
                  type="text"
                  className="form-control"
                  placeholder="Gst No."
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.gstNo}
                />
                {formik.touched.gstNo && formik.errors.gstNo ? (
                  <div className="text-danger">{formik.errors.gstNo}</div>
                ) : null}
              </div>
            </div>
          </div>
        </form>
        {/* add product modal */}
        <div className="d-flex justify-content-end mt-1">
          <Button
            className="mt-4 mb-3 mr-4  shadow none"
            onClick={() => {
              setModalShow(true);
              context.setEditProduct({});
              context.setNewOne(true);
            }}
          >
            Add Products
          </Button>
          <ProductsModal show={modalShow} onHide={() => setModalShow(false)} />
        </div>

        {/* table product */}
        <div>
          <Table bordered responsive="sm" className="text-center mb-5">
            <thead>
              <tr className="bg-dark text-white">
                <th scope="col">No.</th>
                <th scope="col">Product Name</th>
                <th scope="col">Quantity</th>
                <th scope="col">Unitprice</th>
                <th scope="col">Tax</th>
                <th scope="col">Product Total</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {context?.prod?.map((e, i) => {
                return (
                  <tr key={i}>
                    <th scope="col">{i + 1}</th>
                    <td>{e?.productname}</td>
                    <td>{e?.quantity}</td>
                    <td>{e?.unitprice}</td>
                    <td>
                      {e?.gst?.map((g, i) => {
                        return (
                          <div key={i}>
                            <li type="none">
                              {g?.title}&nbsp;
                              {g?.taxAmount ? (
                                <>{g?.taxAmount?.toFixed(2)}</>
                              ) : (
                                <></>
                              )}
                            </li>
                          </div>
                        );
                      })}
                    </td>
                    <td>{e?.gsttex ? <>{e?.gsttex?.toFixed(2)}</> : <></>}</td>
                    <td className="d-flex flex-row justify-content-center align-items-center gap-2">
                      <Button
                        variant="warning"
                        size="sm"
                        className="mr-2 shadow-none rounded-circle"
                        onClick={() => {
                          setModalShow(true);
                          context.editProduct = e;
                          context.setEditProduct(context.editProduct);
                          context.setNewOne(false);
                        }}
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="shadow-none rounded-circle"
                        onClick={() => {
                          handleDelete(e);
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-dark text-white">
                <td colSpan="4"></td>
                <td className="font-weight-bold">Total Products Price</td>
                <td className="h6">
                  {context?.custdata?.totalproductsprice?.toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}

export default BillForm;
