import React, { useEffect, useState } from "react";
import ProductsModal from "./ProductsModal";
import { useNavigate, useParams } from "react-router-dom";
import { Dropdown, Table, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as yup from "yup";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import axiosInstance from "../../../config/AxiosInstance";
import { SpinLoader } from "../../containers/Loaders/loaders";

function BillForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [totalproductsprice, setTotalProductsPrice] = useState(0);
  const [selectedProd, setSelectedProd] = useState([]);
  const [billInfoData, setBillInfoData] = useState({});
  const [editProduct, setEditProduct] = useState({});

  const [isAddOrEditeProduct, setIsAddOrEditeProduct] = useState(true);

  //  Products modal Visible or Invisible
  const [modalShow, setModalShow] = useState(false);

  const [loadding, setLoadding] = useState(false);

  // Fetch customer data
  const [customers, setCustomers] = useState([]);
  const fetchCustomerData = async () => {
    try {
      const response = await axiosInstance.get(`/customers`);
      if (response?.data?.success) {
        setCustomers(response?.data?.customers);
      }
    } catch (error) {
      // Handle error if needed
      console.log("Error", error);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  useEffect(() => {
    // Calculate total amount of products
    let sum = 0;
    for (var t = 0; t < selectedProd?.length; t++) {
      sum += selectedProd[t]?.gsttex;
    }
    setTotalProductsPrice(sum);
  }, [selectedProd]);

  const findEditeBillInformationData = async () => {
    if (id !== "new") {
      // Update existing bill Information
      try {
        const res = await axiosInstance.get(`/billInformation/${id}`);
        if (res.data?.success) {
          setSelectedProd(res.data?.bill.products);
          setBillInfoData(res.data?.bill);
        }
      } catch (error) {
        console.error("Error updating bill:", error);
        if (error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    }
  };

  useEffect(() => {
    findEditeBillInformationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (values) => {
    setLoadding(true);
    values.totalproductsprice = totalproductsprice?.toFixed(2);
    values.products = selectedProd || [];
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
      const pfindIndex = products?.findIndex((e) => e._id === product._id);
      if (pfindIndex !== -1) {
        products[pfindIndex].availableproductqty -= product?.quantity;
        try {
          await axiosInstance.put(`/products/${products[pfindIndex]._id}`, {
            availableproductqty: products[pfindIndex].availableproductqty,
          });
        } catch (error) {
          console.error("Error updating product quantity:", error);
        }
      }
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: billInfoData?.name || "",
      email: billInfoData?.email || "",
      phoneNo: billInfoData?.phoneNo || "",
      gstNo: billInfoData?.gstNo || "",
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
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values);
      resetForm();
    },
  });

  // produts delete
  // one product object delete
  const handleDelete = (product) => {
    setTotalProductsPrice(totalproductsprice - product.gsttex);
    setSelectedProd((prevProd) => prevProd.filter((p) => p !== product));
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
                  {customers?.map((e, i) => {
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
              setEditProduct({});
              setIsAddOrEditeProduct(true);
            }}
          >
            Add Products
          </Button>
          <ProductsModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            setSelectedProd={setSelectedProd}
            selectedProd={selectedProd}
            editProduct={editProduct}
            setEditProduct={setEditProduct}
            isAddOrEditeProduct={isAddOrEditeProduct}
            setIsAddOrEditeProduct={setIsAddOrEditeProduct}
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
              {selectedProd?.map((row, i) => {
                return (
                  <tr key={i}>
                    <th scope="col">{i + 1}</th>
                    <td>{row?.productname}</td>
                    <td>{row?.quantity}</td>
                    <td>{row?.unitprice}</td>
                    <td>
                      {row?.gst?.map((g, i) => {
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
                    <td>
                      {row?.gsttex ? <>{row?.gsttex?.toFixed(2)}</> : <></>}
                    </td>
                    <td className="d-flex flex-row justify-content-center align-items-center gap-1">
                      <IconButton
                        className="rounded-circle"
                        onClick={() => {
                          setModalShow(true);
                          setEditProduct(row);
                          setIsAddOrEditeProduct(false);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        className="rounded-circle"
                        onClick={() => handleDelete(row)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-dark text-white">
                <td colSpan="4"></td>
                <td className="font-weight-bold">Total Products Price</td>
                <td className="h6">{totalproductsprice.toFixed(2)}</td>
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
