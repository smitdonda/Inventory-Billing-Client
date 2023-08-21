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

  const SiderBarData = [
    {
      to: "/",
      name: "Home",
      icon: <HomeIcon className="sidenav-icon" />,
    },
    {
      to: "/customersdetails",
      name: "Customers",
      icon: <PersonIcon className="sidenav-icon" />,
    },
    {
      to: "/productsdetails",
      name: "Products",
      icon: <CategoryIcon className="sidenav-icon" />,
    },
    {
      to: "/billinformation",
      name: "Bills",
      icon: <InfoIcon className="sidenav-icon" />,
    },
    {
      to: "/myprofile",
      name: "Profile",
      icon: <AccountCircleIcon className="sidenav-icon" />,
    },
  ];

  const closeSideNav = () => {
    document.getElementById("mySidenav").style.width = "72px";
    document.getElementById("main").style.marginLeft = "72px";
    document.getElementById("menuToggle").style.display = "inline-block";
    document.querySelector(".closebtn").style.display = "none";
    const navBarTitle = document.querySelector(".nav-bar-heading-title");
    navBarTitle.style.marginLeft = "90px";
    navBarTitle.style.transition = "0.5s";
    const sidenavTextElements = document.querySelectorAll(".sidenav-text");
    sidenavTextElements.forEach((element) => {
      element.style.display = "none";
    });
  };

  return (
    <div
      id="mySidenav"
      className="sidenav bg-dark"
      style={{ fontSize: "large" }}
    >
      <span className="closebtn text-white" onClick={() => closeSideNav()}>
        <WestIcon className="sidenav-icon" />
      </span>
      <div className="mt-2">
        {SiderBarData.map((e, i) => {
          return (
            <Link
              key={i}
              to={e.to}
              className={`d-flex gap-4 nav-text-link ${
                location.pathname === e.to ? "text-white" : ""
              }`}
            >
              {e.icon} <span className="sidenav-text">{e.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
