import React, { useContext } from "react";
import Multiselect from "multiselect-react-dropdown";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Dropdown, Modal, Button } from "react-bootstrap";
import { BillBook } from "../../../App";

function ProductsModal(props) {
  let context = useContext(BillBook);
  let selectedGSTs;

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
              <Dropdown>
                <Dropdown.Toggle
                  variant="light"
                  className="shadow-none"
                  id="dropdown-basic"
                >
                  Select Product
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {context.products?.map((e, i) => {
                    return (
                      <div key={i}>
                        <Dropdown.Item
                          onClick={() => {
                            e["quantity"] = 1;
                            context.setEditProduct(e);
                          }}
                        >
                          <span>({i + 1})</span>&nbsp;{e?.productname}
                        </Dropdown.Item>
                      </div>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>

              <Formik
                enableReinitialize={true}
                initialValues={context?.editProduct || {}}
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
                    if (!values.gst) {
                      errors.gst = "Required";
                    }
                  }
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  setTimeout(() => {
                    values["gst"] = context.editProduct.gst || selectedGSTs;
                    let productIndex = context.prod.findIndex(
                      (e) => e.productname === values.productname
                    );
                    if (productIndex > -1 && context.newOne) {
                      alert("Selected product is already added into the bill.");
                      return false;
                    }
                    if (values.availableproductqty === 0) {
                      alert("Selected product is on of stock.");
                    }
                    if (values.availableproductqty >= values.quantity) {
                      values["pandqtotal"] =
                        values.unitprice * parseInt(values.quantity);
                      values["gsttex"] = values.pandqtotal;
                      // s and c gst add in p and q total
                      if (values.gst && values?.gst?.length) {
                        for (let g = 0; g < values?.gst?.length; g++) {
                          values.gst[g]["taxAmount"] =
                            (values.pandqtotal / 100) * values.gst[g].value;
                          values.gsttex += values.gst[g].taxAmount;
                        }
                      }
                      // push all products in this variable context.prod in array
                      if (context.newOne === true) {
                        context.prod.push(values);
                      } else if (productIndex > -1) {
                        context.prod[productIndex] = values;
                      }
                      // total amount of products
                      let sum = 0;
                      for (var t = 0; t < context?.prod?.length; t++) {
                        sum += context.prod[t].gsttex;
                        context.custdata["totalproductsprice"] = sum;
                        context.setCustData(context.custdata);
                      }
                    } else {
                      alert(
                        "Please enter the correct quantity available quantity is : " +
                          values.availableproductqty
                      );
                    }
                    setSubmitting(true);
                    context.setModalShow(false);
                  }, 200);
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="row ml-1">
                      <div className="form-group col-md-8 mt-3">
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
                      <div className="form-group col-md-4 mt-3">
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
                      <div className="form-group col-md-4 mt-3">
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
                      <div className="form-group col-md-8 mt-3">
                        <label htmlFor="gst">Taxes</label>
                        <Multiselect
                          id="gst"
                          displayValue="title"
                          name="gst"
                          placeholder="Please select GSTs"
                          onSelect={function noRefCheck(selectedList) {
                            selectedGSTs = selectedList;
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
                          selectedValues={context?.editProduct?.gst}
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
                    </div>
                    <div className="text-right mt-3">
                      {context.newOne === true ? (
                        <Button
                          type="submit"
                          className="shadow-none"
                          disabled={isSubmitting}
                        >
                          Add
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="btn btn-warning shadow-none"
                          disabled={isSubmitting}
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
