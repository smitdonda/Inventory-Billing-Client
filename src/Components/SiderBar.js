import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import CategoryIcon from "@mui/icons-material/Category";

function SiderBar() {
  // let navigate = useNavigate();

  return (
    <div className="sidebar bg-dark" style={{ marginTop: "60px" }}>
      <Link to="/myprofile" className="text-white">
        MyProfile
      </Link>
      <Link to="/home" className="text-white">
        <HomeIcon />
        &nbsp;Home
      </Link>
      <Link to="/customersdetails" className="text-white">
        <PersonIcon />
        &nbsp;Customers
      </Link>
      <Link to="/productsdetails" className="text-white">
        <CategoryIcon />
        &nbsp;Products
      </Link>
      <Link to="/billinformation" className="text-white">
        <InfoIcon />
        &nbsp;Bill Info
      </Link>
    </div>
  );
}

export default SiderBar;
