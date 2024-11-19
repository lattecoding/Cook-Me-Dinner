import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import auth from "../utils/auth";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const Navbar = () => {
  const [loginCheck, setLoginCheck] = useState(false);

  const checkLogin = () => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  useEffect(() => {
    console.log(loginCheck);
    checkLogin();
  }, [loginCheck]);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary w-100">
  <div className="container-fluid">
    {/* Brand Name */}
    <a className="navbar-brand" href="#">
      Cookify
    </a>

    {/* Toggle Button for Small Screens */}
    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    {/* Collapsible Menu */}
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">
            Home
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link active" href="#">
            Profiles
          </a>
        </li>
        <li className="nav-item dropdown">
          <a
            className="nav-link active dropdown-toggle"
            href="#"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Options
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li>
              <a className="dropdown-item" href="#">
                Settings
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Favorites
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Recent Searches
              </a>
            </li>
          </ul>
        </li>
      </ul>

      {/* Login/Logout Section */}
      <div className="d-flex align-items-center">
  {loginCheck ? (
    <>
      {/* Display user's name from the token */}
      <span className="me-3">
        Hey, {auth.getProfile()?.username || "User"}!
      </span>
      <button className="btn btn-outline-success me-2" type="submit">
        Spotify
      </button>
      <button
        className="btn btn-outline-danger"
        type="button"
        onClick={() => {
          auth.logout();
        }}
      >
        Logout
      </button>
    </>
  ) : (
    <button className="btn btn-outline-primary">
      <Link to="/login" className="text-decoration-none text-white">
        Login
      </Link>
    </button>
  )}
</div>
    </div>
  </div>
</nav>

  );
};

export default Navbar;
