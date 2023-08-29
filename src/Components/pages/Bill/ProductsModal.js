import React, { useEffect, useState } from "react";
import Multiselect from "multiselect-react-dropdown";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Dropdown, Modal, Button } from "react-bootstrap";
import axiosInstance from "../../../config/AxiosInstance";
import { toast } from "react-toastify";

function ProductsModal(props) {
  const [selectedGSTs, setSelectedGSTs] = useState([]);

  // Fetch products data
  const [products, setproducts] = useState([]);
  const fetchProductsData = async () => {
    try {
      const response = await axiosInstance.get(`/products`);
      setproducts(response?.data?.products);
    } catch (error) {
      // Handle error if needed
      console.log("Error", error);
    }
  };
  
  useEffect(() => {
    fetchProductsData();
  }, []);

  const [availableproductqty, setAvailableProductQty] = useState(0);

  return (
    <>
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Products</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center align-self-center">
            <div>
              <Formik
                enableReinitialize={true}
                initialValues={
                  props?.editProduct || {
                    productname: "",
                    unitprice: "",
                    quantity: "",
                    gst: [],
                  }
                }
                validate={(values) => {
                  const errors = {};
                  if (!values.productname) {
                    errors.productname = "Required";
                    if (!values.unitprice) {
                      errors.unitprice = "Required";
                    }
                    if (!values.quantity) {
                      errors.quantity = "Required";
                    }
                    if (!values.gst || values.gst.length === 0) {
                      errors.gst = "Required";
                    }
                  }
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  setTimeout(() => {
                    values["gst"] = selectedGSTs?.length
                      ? selectedGSTs
                      : props?.editProduct?.gst;
                    const productIndex = props.selectedProd.findIndex(
                      (e) => e.productname === values.productname
                    );

                    if (productIndex > -1 && !props?.editProduct?._id) {
                      toast.error(
                        "Selected product is already added into the bill."
                      );
                      return false;
                    }

                    if (availableproductqty === 0) {
                      toast.error("Selected product is out of stock.");
                      return false;
                    }
                    console.log(
                      "Selected product quantity",
                      props.selectedProd
                    );
                    if (availableproductqty >= values.quantity) {
                      values["pandqtotal"] =
                        values.unitprice * parseInt(values.quantity);
                      values["gsttex"] = values.pandqtotal;

                      // Add S GST and C GST in p and q total
                      if (values.gst && values?.gst?.length) {
                        for (let g = 0; g < values?.gst?.length; g++) {
                          values.gst[g]["taxAmount"] =
                            (values.pandqtotal / 100) * values.gst[g].value;
                          values.gsttex += values.gst[g].taxAmount;
                        }
                      }

                      // Add product to props.selectedProd array
                      if (!props?.editProduct._id) {
                        props.setSelectedProd((prevProd) => {
                          return [...prevProd, values];
                        });
                        // props?.selectedProd.push(values);
                      } else if (productIndex > -1) {
                        props.setSelectedProd((prevProd) => {
                          return [(prevProd[productIndex] = values)];
                        });
                        // props.selectedProd[productIndex] = values;
                      }
                    } else {
                      toast.error(
                        "Please enter the correct quantity. Available quantity is: " +
                          availableproductqty
                      );
                      return false;
                    }

                    setSubmitting(true);
                    props.onHide();
                  }, 200);
                }}
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form>
                    <Dropdown>
                      <Dropdown.Toggle variant="light">
                        Select Product
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {products?.map((e, i) => {
                          return (
                            <div key={i}>
                              <Dropdown.Item
                                onClick={() => {
                                  setFieldValue("productname", e?.productname);
                                  setFieldValue("quantity", 1);
                                  setFieldValue("unitprice", e?.unitprice);
                                  setAvailableProductQty(e.availableproductqty);
                                }}
                              >
                                <span>({e.id})</span>&nbsp;{e?.productname}
                              </Dropdown.Item>
                            </div>
                          );
                        })}
                      </Dropdown.Menu>
                    </Dropdown>
                    <div className="row ml-1">
                      <div className="form-group col-md-6 mt-3">
                        <label htmlFor="productname">Product Name</label>
                        <Field
                          className="form-control"
                          type="text"
                          name="productname"
                          placeholder="Product Name"
                        />
                        <ErrorMessage
                          className="text-danger"
                          name="productname"
                          component="div"
                        />
                      </div>
                      <div className="form-group col mt-3">
                        <label htmlFor="unitprice">Unit Price</label>
                        <Field
                          className="form-control"
                          type="number"
                          name="unitprice"
                          placeholder="Unit Price"
                        />
                        <ErrorMessage
                          className="text-danger"
                          name="unitprice"
                          component="div"
                        />
                      </div>
                      <div className="form-group col mt-3">
                        <label htmlFor="quantity">Quantity</label>
                        <Field
                          className="form-control"
                          type="number"
                          name="quantity"
                          placeholder="Quantity"
                        />
                        <ErrorMessage
                          className="text-danger"
                          name="quantity"
                          component="div"
                        />
                      </div>
                    </div>
                    <div className="form-group mt-3">
                      <label htmlFor="gst">Taxes</label>
                      <Multiselect
                        id="gst"
                        displayValue="title"
                        name="gst"
                        placeholder="Please select GSTs"
                        onSelect={function noRefCheck(selectedList) {
                          setSelectedGSTs(selectedList);
                        }}
                        options={[
                          { title: "S GST 2.5%", value: 2.5 },
                          { title: "C GST 2.5%", value: 2.5 },
                          { title: "S GST 9%", value: 9 },
                          { title: "C GST 9%", value: 9 },
                          { title: "S GST 14%", value: 14 },
                          { title: "C GST 14%", value: 14 },
                        ]}
                        selectionLimit={2}
                        selectedValues={props?.editProduct?.gst}
                        hidePlaceholder="true"
                        showArrow="true"
                        showCheckbox="true"
                      />
                      <ErrorMessage
                        className="text-danger"
                        name="gst"
                        component="div"
                      />
                    </div>
                    <div className="d-flex justify-content-end mt-3">
                      {props.isAddOrEditeProduct ? (
                        <Button type="submit" className="shadow-none">
                          Add
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="btn btn-warning shadow-none"
                        >
                          Update
                        </Button>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ProductsModal;
