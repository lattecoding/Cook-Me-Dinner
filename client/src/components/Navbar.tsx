import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import auth from '../utils/auth';

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
        <a className="navbar-brand" href="#">Cookify</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="navbar-collapse" id="navbarNav">
          <div className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Profiles</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Options
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Profiles</a></li>
                <li><a className="dropdown-item" href="#">Favorites</a></li>
                <li><a className="dropdown-item" href="#">Recent Searches</a></li>
              </ul>
            </li>
          </div>

          {
            !loginCheck ? (
              <button type='button'>
                <Link to='/login'>Login</Link>
              </button>
            ) : (
              <div>
                <button className="btn btn-outline-success" type="submit">Spotify</button>
                <button type='button' onClick={() => {
                  auth.logout();
                }}>Logout</button>
              </div>
            )
          }
        </div>
      </div>
    </nav>
  );
}

export default Navbar;