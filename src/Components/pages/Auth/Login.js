import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button } from "react-bootstrap";
import { SpinLoader } from "../Loaders/loaders";
import { toast } from "react-toastify";

function Login() {
  let navigate = useNavigate();
  const [loadding, setLoadding] = useState(false);
  let handleSubmit = async (values) => {
    try {
      setLoadding(true);
      let res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        values
      );
      console.log(res.data);
      if (res.data.success) {
        setLoadding(false);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userInfo", res.data);
        navigate("/");
      }
    } catch (error) {
      setLoadding(false);
      toast.error(error.response.data.message);
      console.log("Error", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().email("Invalid Email").required("Required"),
      password: yup
        .string()
        .required("No Password Provided")
        .min(8, "Password is too short")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain One Uppercase, One Lowercase, One Number and one special case Character"
        ),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  return (
    <div
      className="bg-dark d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="container">
        <div className="d-flex justify-content-center align-items-center">
          <form
            onSubmit={formik.handleSubmit}
            className="p-4 border border-3"
            style={{ borderRadius: "2%", width: "30rem" }}
          >
            <h2 className="mb-4 text-center text-primary">Login</h2>
            <div className="mb-3 ">
              <div className="form-floating">
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="name@example.com"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                <label htmlFor="email">Email Id</label>
              </div>
              {formik.touched.email && formik.errors.email ? (
                <div style={{ color: "red" }}>{formik.errors.email}</div>
              ) : null}
            </div>

            <div className="mb-3">
              <div className="form-floating ">
                <input
                  className="form-control"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
                <label htmlFor="password">Password</label>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div style={{ color: "red" }}>{formik.errors.password}</div>
              ) : null}
            </div>
            <div className="d-grid mb-3">
              <Button
                type="submit"
                variant="primary"
                className="text-uppercase"
                size="lg"
              >
                {loadding ? <SpinLoader /> : "Login"}
              </Button>
            </div>
            <Link
              className="d-block text-center mt-2 text-white text-decoration-none h6"
              to="/signup"
            >
              Have New account? Sign Up
            </Link>
            <hr className="text-white" />
            <div className="text-white">
              <h3>Demo Credentials</h3>
              <p>
                Email:&nbsp;user@gmail.com &nbsp;&nbsp; Password:&nbsp;User@123
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
