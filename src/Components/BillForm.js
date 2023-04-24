import React, { useContext } from "react";
import ProductsModal from "../Components/ProductsModal";
import { useNavigate, useParams } from "react-router-dom";
import { Dropdown, Table, Button } from "react-bootstrap";
import { BillBook } from "../App";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "./Header";
import SiderBar from "./SiderBar";

function BillForm() {
  let context = useContext(BillBook);
  console.log(context);
  let { id } = useParams();

  let navigate = useNavigate();

  //bill info post method
  let postbillifourl =
    "https://inventory-billing-server-1.vercel.app/users/addbillinformation/";

  // bill Information updated  // all Bill details updated  // updated customer product data
  let updatebillinfourl =
    "https://inventory-billing-server-1.vercel.app/users/updatebillinfo/";

  if (id !== "new") {
    // update all bill info
    var handleSubmit = async (values) => {
      values["totalproductsprice"] = context.custdata["totalproductsprice"];
      let res = await axios.put(updatebillinfourl + id, values);
      if (res) {
        if (res.status === 200) {
          for (let i = 0; i < values.products.length; i++) {
            // products findIndex qty
            let pfindIndex = context.products.findIndex(
              (e) => e._id === values.products[i]._id
            );
            // subtraction of availableproductqty and quantity
            context.products[pfindIndex].availableproductqty -=
              values.products[i].quantity;

            // products edit qty
            await axios.put(
              "https://inventory-billing-server-1.vercel.app/users/putproducts/" +
                context?.products[pfindIndex]._id,
              {
                availableproductqty:
                  context?.products[pfindIndex]?.availableproductqty,
              }
            );
          }
          navigate("/billinformation");
        }
      }
    };
  } else {
    // Save All Bill Data and Post method
    handleSubmit = async (values) => {
      values["totalproductsprice"] = context.custdata["totalproductsprice"];
      let billinfo = await axios.post(postbillifourl, values);
      if (billinfo.status === 200) {
        editqty(values);
      }
    };
    var editqty = async (values) => {
      let res = await axios.put(updatebillinfourl + id, values);
      if (res) {
        if (res.status === 200) {
          for (let i = 0; i < values.products.length; i++) {
            // products findIndex qty
            let pfindIndex = context.products.findIndex(
              (e) => e._id === values.products[i]._id
            );
            // subtraction of availableproductqty and quantity
            context.products[pfindIndex].availableproductqty -=
              values.products[i].quantity;
            // products edit qty
            await axios.put(
              "https://inventory-billing-server-1.vercel.app/users/putproducts/" +
                context.products[pfindIndex]._id,
              {
                availableproductqty:
                  context.products[pfindIndex].availableproductqty,
              }
            );
          }
          navigate("/billinformation");
        }
      }
    };
  }

  const formik = useFormik({
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

  let handleDelete = (e) => {
    // subtractions of  context.custdata.totalproductsprice and gsttex
    let sub = context?.custdata?.totalproductsprice - e.gsttex;
    context.custdata.totalproductsprice = sub;
    context.setCustData(context.custdata);
    // splice the product object
    context.prod.splice(context.prod.indexOf(e), 1);
    context.setProd(context.prod);
  };

  return (
    <>
      <SiderBar />
      <Header />
      <div className="content">
        <div style={{ marginTop: "90px" }} id="bill-form">
          <div className="text-center">
            <h2>Bill Form</h2>
            <hr />
          </div>

          <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
            <div className="d-flex">
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
              <div className="ml-auto">
                {/* save and updated */}
                {id !== "new" ? (
                  <Button
                    type="submit"
                    variant="warning"
                    className="mr-3  shadow-none"
                  >
                    Update
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="success"
                    className="mr-3  shadow-none"
                  >
                    Save
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
              <div className="form-group">
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
              <div className="row">
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
              <div className="form-group">
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
              <div className="form-group">
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
          <div className="d-flex justify-content-end ">
            <Button
              className="mt-4 mb-3 mr-4  shadow none"
              onClick={() => {
                context.setModalShow(true);
                context.setEditProduct({});
                context.setNewOne(true);
              }}
            >
              Add Products
            </Button>
            <ProductsModal
              show={context.modalShow}
              onHide={() => context.setModalShow(false)}
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
                      <td className="d-flex flex-row justify-content-center align-items-center">
                        <Button
                          variant="warning"
                          size="sm"
                          className="mr-2 shadow-none rounded-circle"
                          onClick={() => {
                            context.setModalShow(true);
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
                  <td colSpan="2" className="h6">
                    {context?.custdata?.totalproductsprice}
                  </td>
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
