import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Nav } from "react-bootstrap";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { getItem, removeItem } from "../../../config/cookieStorage";

function Header() {
  const navigate = useNavigate();

  // logOut
  const token = getItem("token");

  const logOut = () => {
    removeItem("token");
    navigate("/login");
  };

  const openSidenav = () => {
    document.getElementById("mySidenav").style.width = "230px";
    document.getElementById("main").style.marginLeft = "230px";
    document.getElementById("menuToggle").style.display = "none";
    document.querySelector(".closebtn").style.display = "inline-block";
    document.querySelector(".closebtn").styletransition = "0.5s";
    document.querySelector(".nav-bar-heading-title").style.marginLeft = "230px";
    const sidenavTextElements = document.querySelectorAll(".sidenav-text");
    sidenavTextElements.forEach((element) => {
      element.style.display = "inline-block";
    });
  };

  return (
    <div>
      <div
        className="header fw-bold position-fixed d-flex justify-content-between align-items-center"
        style={{ zIndex: "1" }}
      >
        <div
          className="text-dark d-flex justify-content-between align-items-center gap-2 nav-bar-heading-title"
          style={{
            fontSize: "25px",
            marginLeft: "220px",
          }}
        >
          <span id="menuToggle" onClick={() => openSidenav()}>
            &#9776;
          </span>

          <Link
            to="/"
            className="text-decoration-none text-dark"
            style={{
              fontSize: "25px",
            }}
          >
            Bill Book
          </Link>
        </div>
        <div>
          <Nav className="auth-btns">
            <Nav.Item>
              {token ? (
                <>
                  <Button className="btn-dark shadow-none" onClick={logOut}>
                    Logout&nbsp;
                    <LogoutIcon />
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-dark mr-2 mt-2 shadow-none">
                    <LoginIcon />
                    &nbsp;Login
                  </Link>
                </>
              )}
            </Nav.Item>
          </Nav>
        </div>
      </div>
    </div>
  );
}

export default Header;
