import React, { Suspense, lazy } from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BlockLoader } from "../ui/Spinner";
import AppShell from "../layout/AppShell";
import Home from "./Dashboard/Home";
import CustomerDetails from "./Customars/CustomerDetails";
import ProductsDetails from "./Products/ProducstDetails";
import BillForm from "./Bill/BillForm";
import BillInformation from "./Bill/BillInformation";
import MyProfile from "./Profile/MyProfile";
import ProfileForm from "./Profile/ProfileForm";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";

// jsPDF and html2canvas are ~250 kB gzipped between them and are only needed
// on the invoice screen, so that route pulls them in on demand.
const BillTable = lazy(() => import("./Bill/BillTable"));

/** Login and sign-up: bounce signed-in visitors back to the dashboard. */
function PublicOnly() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}

/** Everything else. The session lives in context, so a logout or an expiry
 *  picked up by the axios interceptor takes effect on the next render. */
function RequireAuth() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AppShell /> : <Navigate to="/login" replace />;
}

function Router() {
  const { isLoading } = useAuth();

  /* The session cookie is httpOnly, so whether someone is signed in is only
     known once the server has answered. Rendering routes before that would
     flash the login page at a signed-in user on every reload. */
  if (isLoading) return <BlockLoader />;

  return (
    <Suspense fallback={<BlockLoader />}>
      <Routes>
        <Route element={<PublicOnly />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route index element={<Home />} />
          <Route path="/customersdetails" element={<CustomerDetails />} />
          <Route path="/productsdetails" element={<ProductsDetails />} />
          <Route path="/billform/:id" element={<BillForm />} />
          <Route path="/billinformation" element={<BillInformation />} />
          <Route path="/billtable/:id" element={<BillTable />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/profileform/:id" element={<ProfileForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default Router;
