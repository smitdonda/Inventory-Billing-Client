import React, { useContext, useState } from "react";
import ProductsModal from "../Products/ProductsModal";
import { useNavigate, useParams } from "react-router-dom";
import { Dropdown, Table, Button } from "react-bootstrap";
import { BillBook } from "../../../App";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { SpinLoader } from "../Loaders/loaders";

function BillForm() {
  let context = useContext(BillBook);
  let { id } = useParams();

  //  Products modal Visible or Invisible
  const [modalShow, setModalShow] = useState(false);

  const [loadding, setLoadding] = useState(false);
  let navigate = useNavigate();

  //bill info post method
  let postBillInfoUrl = `${process.env.REACT_APP_BACKEND_URL}/users/addbillinformation`;

  // bill Information updated  // all Bill details updated  // updated customer product data
  let updateBillInfoUrl = `${process.env.REACT_APP_BACKEND_URL}/users/updatebillinfo/`;

  const handleSubmit = async (values) => {
    setLoadding(true);
    values.totalproductsprice = context.custdata.totalproductsprice;
    if (id !== "new") {
      // Update existing bill
      try {
        const res = await axios.put(updateBillInfoUrl + id, values);
        if (res.status === 200) {
          updateProductQuantities(values.products);
          navigate("/billinformation");
          setLoadding(false);
        }
      } catch (error) {
        console.error("Error updating bill:", error);
        setLoadding(false);
      }
    } else {
      // Create a new bill
      try {
        setLoadding(true);
        const billInfo = await axios.post(postBillInfoUrl, values);
        if (billInfo.status === 200) {
          updateProductQuantities(values.products);
          navigate("/billinformation");
          setLoadding(false);
        }
      } catch (error) {
        setLoadding(false);
        console.error("Error creating bill:", error);
      }
    }
  };

  const updateProductQuantities = async (products) => {
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const pfindIndex = context.products.findIndex(
        (e) => e._id === product._id
      );
      if (pfindIndex !== -1) {
        context.products[pfindIndex].availableproductqty -= product.quantity;
        try {
          await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/users/putproducts/` +
              context.products[pfindIndex]._id,
            {
              availableproductqty:
                context.products[pfindIndex].availableproductqty,
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
      name: context && context?.custdata?.name ? context?.custdata?.name : "",
      email:
        context && context?.custdata?.email ? context?.custdata?.email : "",
      phone:
        context && context?.custdata?.phone ? context?.custdata?.phone : "",
      date: context && context?.custdata?.date ? context?.custdata?.date : "",
      gstno:
        context && context?.custdata?.gstno ? context?.custdata?.gstno : "",
      address:
        context && context?.custdata?.address ? context?.custdata?.address : "",
      totalproductsprice:
        context && context?.custdata && context?.custdata.totalproductsprice
          ? context?.custdata.totalproductsprice
          : "",
      products: context && context?.prod ? context?.prod : "",
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
      <div className="content">
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
                    id="dropdown-basic"
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
                              formik.setFieldValue("phone", e.phone);
                              formik.setFieldValue("date", e.date);
                              formik.setFieldValue("gstno", e.gstno);
                              formik.setFieldValue("address", e.address);
                            }}
                          >
                            {e?.name}&nbsp;<span>({i + 1})</span>
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
                    className="mr-3  shadow-none"
                  >
                    {loadding ? <SpinLoader /> : "Update"}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="success"
                    className="mr-3  shadow-none"
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
                  id="name"
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
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="Enter Your Email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  required
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-danger">{formik.errors.email}</div>
                ) : null}
              </div>
              <div className="row  mt-3">
                <div className="form-group col">
                  <label htmlFor="phone">Phone</label>
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
                  {formik.touched.phone && formik.errors.phone ? (
                    <div className="text-danger">{formik.errors.phone}</div>
                  ) : null}
                </div>
                <div className="form-group col">
                  <label htmlFor="date">Date</label>
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
                  {formik.touched.date && formik.errors.date ? (
                    <div className="text-danger">{formik.errors.date}</div>
                  ) : null}
                </div>
              </div>
              <div className="form-group  mt-3">
                <label htmlFor="gstno">Gst No.</label>
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
                {formik.touched.gstno && formik.errors.gstno ? (
                  <div className="text-danger">{formik.errors.gstno}</div>
                ) : null}
              </div>
              <div className="form-group  mt-3">
                <label htmlFor="address">Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className="form-control"
                  placeholder="Address"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.address}
                />
                {formik.touched.address && formik.errors.address ? (
                  <div className="text-danger">{formik.errors.address}</div>
                ) : null}
              </div>
            </div>
          </form>
          {/* add product modal */}
          <div className="d-flex justify-content-end  mt-1">
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
            <ProductsModal
              show={modalShow}
              onHide={() => setModalShow(false)}
              setModalShow={setModalShow}
            />
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
                                {g?.taxAmount ? <>{g?.taxAmount}</> : <></>}
                              </li>
                            </div>
                          );
                        })}
                      </td>
                      <td>{e?.gsttex ? <>{e?.gsttex}</> : <></>}</td>
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
                    {context?.custdata?.totalproductsprice}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}

export default BillForm;
