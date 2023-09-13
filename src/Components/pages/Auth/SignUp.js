import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button } from "react-bootstrap";
import axiosInstance from "../../../config/AxiosInstance";
import { SpinLoader } from "../../containers/Loaders/loaders";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function Registration() {
  const navigate = useNavigate();
  const [loadding, setLoadding] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoadding(true);
      const res = await axiosInstance.post(`/signup`, values);
      if (res.data.success) {
        setLoadding(false);
        navigate("/login");
      }
    } catch (error) {
      setLoadding(false);
      toast.error(error.response?.data?.message || error.message);
      console.log("Error", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      cpassword: "",
    },
    validationSchema: yup.object({
      username: yup.string().required("Required"),
      email: yup.string().email("Invalid Email").required("Required"),
      password: yup
        .string()
        .required("No Password Provided")
        .min(8, "Password is too Short")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain One Uppercase, One Lowercase, One Number and one special case Character"
        ),
      cpassword: yup
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
            <h2 className="text-center text-primary mb-4">Sign Up</h2>
            {/* Login Form */}
            <div className=" mb-3">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  placeholder="myusername"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.username}
                />
                <label htmlFor="username">Username</label>
              </div>

              {formik.touched.username && formik.errors.username ? (
                <div style={{ color: "red" }}>
                  {formik.errors.username}
                  <sup>*</sup>
                </div>
              ) : null}
            </div>
            <div className="mb-3 ">
              <div className="form-floating">
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                <label htmlFor="email">Email Id</label>
              </div>
              {formik.touched.email && formik.errors.email ? (
                <div style={{ color: "red" }}>
                  {formik.errors.email}
                  <sup>*</sup>
                </div>
              ) : null}
            </div>
            <div className="mb-3">
              <div className="form-floating">
                <input
                  className="form-control"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
                <label htmlFor="password">Password</label>
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </span>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div style={{ color: "red" }}>{formik.errors.password}</div>
              ) : null}
            </div>

            <div className="mb-3">
              <div className="form-floating ">
                <input
                  className="form-control"
                  type={showPassword ? "text" : "password"}
                  name="cpassword"
                  placeholder="Confirm Password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.cpassword}
                />
                <label htmlFor="password">Confirm Password</label>
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </span>
              </div>
              {formik.touched.cpassword && formik.errors.cpassword ? (
                <div style={{ color: "red" }}>{formik.errors.cpassword}</div>
              ) : null}
            </div>
            <div className="d-grid mb-3">
              <Button
                type="submit"
                variant="primary"
                className="text-uppercase"
                size="lg"
              >
                {loadding ? <SpinLoader /> : "Register"}
              </Button>
            </div>
            <Link
              className="d-block text-center mt-2 text-white text-decoration-none h6"
              to="/login"
            >
              Have an account? Sign In
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Registration;
