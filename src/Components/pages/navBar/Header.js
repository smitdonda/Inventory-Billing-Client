import React from "react";
import { useNavigate } from "react-router-dom";
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
    document.getElementById("mySidenav").style.width = "240px";
    document.getElementById("main").style.marginLeft = "240px";
    document.getElementById("menuToggle").style.display = "none";
  };

  return (
    <div>
      <div class="header bg-dark">
        <span
          className="text-white"
          style={{ fontSize: "25px", cursor: "pointer" }}
          onClick={() => openSidenav()}
        >
          <sapn id="menuToggle">&#9776;</sapn> Bill Book
        </span>
        <div class="header-right">
          <Nav className="ml-auto">
            <Nav.Item>
              {token ? (
                <>
                  <Button
                    className="text-white btn-dark shadow-none"
                    onClick={() => {
                      logOut();
                    }}
                  >
                    Logout&nbsp;
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
