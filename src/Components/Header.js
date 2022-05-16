import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Button, Nav } from "react-bootstrap";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

function Header() {
  let navigate = useNavigate();
  // logOut

  var token = sessionStorage.getItem("token");
  let logOut = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
      <Navbar expand="sm" fixed="top" variant="dark" >
        <Navbar.Brand href="/">
          <h2 className="text-white">Bill Book</h2>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav bg-white" />
        <Navbar.Collapse id="basic-navbar-nav">
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
        </Navbar.Collapse>
      </Navbar>
  );
}

export default Header;
