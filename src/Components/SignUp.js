import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

function SignUp() {
  let navigate = useNavigate();

  let handleSubmit = async (values) => {
    let res = await axios.post("http://localhost:5000/users/signup", values);
    if (res.data.statusCode === 200) {
      navigate("/");
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
        <div className="col-lg-4 col-xl-5 m-auto ">
          <form
            onSubmit={formik.handleSubmit}
            className="p-4 border border-3 "
            style={{ borderRadius: "2%" }}
          >
            <h2 className="text-center text-primary mb-5">Sign Up</h2>
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
                  id="email"
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
              <div className="form-floating ">
                <input
                  className="form-control"
                  type="password"
                  placeholder="Password"
                  id="password"
                  name="password"
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

            <div className="mb-3">
              <div className="form-floating ">
                <input
                  className="form-control"
                  type="password"
                  id="cpassword"
                  name="cpassword"
                  placeholder="Confirm Password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.cpassword}
                />
                <label htmlFor="password">Confirm Password</label>
              </div>
              {formik.touched.cpassword && formik.errors.cpassword ? (
                <div style={{ color: "red" }}>{formik.errors.cpassword}</div>
              ) : null}
            </div>
            <div>
              <button
                className="btn btn-md btn-primary shadow-none text-uppercase "
                type="submit"
              >
                Register
              </button>
            </div>

            <a
              className="d-block text-center text-bold mt-2 text-muted "
              href="/login"
            >
              Have an account? Sign In
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
