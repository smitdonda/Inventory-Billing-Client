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
  const iconFontSize = { fontSize: "29px" };

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
      name: "Bills",
      icon: <InfoIcon sx={iconFontSize} />,
    },
    {
      to: "/myprofile",
      name: "Profile",
      icon: <AccountCircleIcon sx={iconFontSize} />,
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
    <div id="mySidenav" className="sidenav bg-dark">
      <span className="closebtn text-white" onClick={() => closeSideNav()}>
        <WestIcon sx={iconFontSize} />
      </span>
      <div className="mt-2">
        {SiderBarData.map((e, i) => {
          return (
            <Link
              key={i}
              to={e.to}
              className={`${
                location.pathname === e.to
                  ? "text-white d-flex gap-4 nav-text-link"
                  : "d-flex gap-4 nav-text-link"
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
