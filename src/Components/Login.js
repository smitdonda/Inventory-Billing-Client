import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

function Login() {
  let navigate = useNavigate();

  let handleSubmit = async (values) => {
    let res = await axios.post("https://bill-book-server.herokuapp.com/users/login", values);
    if (res.data.statusCode === 200) {
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("username", res.data.username);
      navigate("/");
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
    <div className="bg-dark d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="container ">
        <div className="col-lg-4 col-xl-5 m-auto">
          <div>
            <form
              onSubmit={formik.handleSubmit}
              className="p-4 border border-3 "
              style={{borderRadius:"2%"}}
            >
              <h2 className="card-title mb-4 text-center text-primary ">
                Login
              </h2>
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
              <div className="mb-2">
                <button
                  className="btn btn-sm btn-primary shadow-none text-uppercase"
                  type="submit"
                >
                  Login
                </button>
              </div>
              <a
                className="d-block text-center mt-2 text-white text-decoration-none h6"
                href="/signup"
              >
                Have New account? Sign Up
              </a>
              <hr className="text-white" />
              <div className="text-white">
                <h3>Demo Credentials</h3>
                <p>Email:&nbsp;user@gmail.com &nbsp;&nbsp; Password:&nbsp;User@123</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
