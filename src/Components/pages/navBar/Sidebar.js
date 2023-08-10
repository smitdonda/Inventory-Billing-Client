import React from "react";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import CategoryIcon from "@mui/icons-material/Category";
import WestIcon from "@mui/icons-material/West";

function Sidebar() {
  const location = useLocation();
  const iconFontSize = { fontSize: "26px" };

  const SiderBarData = [
    {
      to: "/",
      name: "Home",
      icon: <HomeIcon sx={iconFontSize} />,
    },
    {
      to: "/customersdetails",
      name: "Customers",
      icon: <PersonIcon sx={iconFontSize} />,
    },
    {
      to: "/productsdetails",
      name: "Products",
      icon: <CategoryIcon sx={iconFontSize} />,
    },
    {
      to: "/billinformation",
      name: "Bill Info",
      icon: <InfoIcon sx={iconFontSize} />,
    },
    {
      to: "/myprofile",
      name: "MyProfile",
      icon: <AccountCircleIcon sx={iconFontSize} />,
    },
  ];

  const closeSideNav = () => {
    document.getElementById("mySidenav").style.width = "80px";
    document.getElementById("main").style.marginLeft = "80px";
    document.getElementById("menuToggle").style.display = "inline-block";
    document.getElementsByClassName("closebtn")[0].style.display = "none";
    document.getElementsByClassName("nav-menu-section")[0].style.marginLeft =
      "110px";
  };

  return (
    <div id="mySidenav" className="sidenav bg-dark">
      <sapn className="closebtn text-white" onClick={() => closeSideNav()}>
        <WestIcon sx={iconFontSize} />
      </sapn>
      <div className="mt-2">
        {SiderBarData.map((e, i) => {
          return (
            <Link
              key={i}
              to={e.to}
              className={`${
                location.pathname === e.to
                  ? "text-white d-flex align-items-center gap-4"
                  : "d-flex align-items-center gap-4"
              }`}
            >
              {e.icon} <span id="sidenav-text">{e.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
