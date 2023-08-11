import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Nav } from "react-bootstrap";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

function Header() {
  let navigate = useNavigate();

  // logOut
  var token = localStorage.getItem("token");
  let logOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  const openSidenav = () => {
    document.getElementById("mySidenav").style.width = "230px";
    document.getElementById("main").style.marginLeft = "230px";
    document.getElementById("menuToggle").style.display = "none";
    document.getElementsByClassName("closebtn")[0].style.display =
      "inline-block";
    document.getElementsByClassName(
      "nav-bar-heading-title"
    )[0].style.marginLeft = "230px";
    var elements = document.getElementsByClassName("sidenav-text");
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.display = "inline-block";
    }
  };

  return (
    <div>
      <div
        class="header fw-bold position-fixed d-flex justify-content-between align-items-center"
        style={{ zIndex: "1" }}
      >
        <div
          className="text-dark d-flex justify-content-between align-items-center gap-2 nav-bar-heading-title"
          style={{
            fontSize: "25px",
            marginLeft: "220px",
          }}
        >
          <sapn id="menuToggle" onClick={() => openSidenav()}>
            &#9776;
          </sapn>

          <Link
            to="/"
            className="text-decoration-none text-dark"
            style={{
              fontSize: "25px",
              // marginLeft: "18%",
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
                  <Button
                    className="text-white btn-dark shadow-none"
                    onClick={logOut}
                  >
                    {window.innerWidth >= 600 ? <span>Logout&nbsp;</span> : ""}
                    <LogoutIcon />
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link
                    href="/login"
                    className="text-white mr-2 mt-2 shadow-none"
                  >
                    <LoginIcon />
                    &nbsp;Login
                  </Nav.Link>
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
