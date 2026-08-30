import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";

import AuthLayout, { DemoCredentials } from "../../layout/AuthLayout";
import { Button } from "../../ui/Button";
import { FormikField } from "../../ui/Field";
import { MailIcon } from "../../ui/Icons";
import axiosInstance, { errorMessage } from "../../../config/AxiosInstance";
import { setItem } from "../../../config/cookieStorage";

const DEMO = { email: "user@gmail.com", password: "User@123" };

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/login", values);
      if (res.data?.success) {
        const expiresAt = res.data?.user?.expiresAt;
        setItem("token", res.data.token, {
          expires: expiresAt ? new Date(expiresAt) : undefined,
        });
        navigate("/", { replace: true });
        return;
      }
      toast.error(res.data?.message || "Could not sign you in");
    } catch (error) {
      toast.error(errorMessage(error, "Could not sign you in"));
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Enter a valid email")
        .required("Email is required"),
      password: yup.string().required("Password is required"),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your bills, stock and customers."
      footer={
        <DemoCredentials
          email={DEMO.email}
          password={DEMO.password}
          onUse={() => formik.setValues(DEMO)}
        />
      }
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
        <FormikField
          formik={formik}
          name="email"
          type="email"
          label="Email"
          placeholder="you@company.com"
          autoComplete="email"
          icon={MailIcon}
        />
        <FormikField
          formik={formik}
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={loading}
          loadingText="Signing in..."
        >
          Sign in
        </Button>

        <p className="pt-1 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-fg underline decoration-strong underline-offset-4 transition-colors hover:decoration-fg"
          >
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;
