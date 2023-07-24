import React from "react";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import CategoryIcon from "@mui/icons-material/Category";

function Sidebar() {
  let location = useLocation();

  console.log(location.pathname);

  const SiderBarData = [
    {
      to: "/myprofile",
      name: "MyProfile",
      icon: <AccountCircleIcon />,
    },
    {
      to: "/home",
      name: "Home",
      icon: <HomeIcon />,
    },
    {
      to: "/customersdetails",
      name: "Customers",
      icon: <PersonIcon />,
    },
    {
      to: "/productsdetails",
      name: "Products",
      icon: <CategoryIcon />,
    },
    {
      to: "/billinformation",
      name: "Bill Info",
      icon: <InfoIcon />,
    },
  ];

  const closeSideNav = () => {
    document.getElementById("mySidenav").style.width = "0px";
    document.getElementById("main").style.marginLeft = "0px";
    document.getElementById("menuToggle").style.display = "inline-block";
  };

  return (
    <div id="mySidenav" className="sidenav bg-dark">
      <sapn className="closebtn text-white" onClick={() => closeSideNav()}>
        &times;
      </sapn>
      <div className="mt-2">
        {SiderBarData.map((e, i) => {
          return (
            <Link
              to={e.to}
              className={`${location.pathname === e.to ? "text-white" : ""}`}
            >
              {e.icon} {e.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;