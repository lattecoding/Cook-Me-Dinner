import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import auth from '../utils/auth';

const Navbar = () => {
  const [ loginCheck, setLoginCheck ] = useState(false);

  const checkLogin = () => {
    if(auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  useEffect(() => {
    console.log(loginCheck);
    checkLogin();
  }, [loginCheck])

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
          </button>
            <h1> Cookify</h1> 
            <div>
    {
      !loginCheck ? (
           <button type='button'>
             <Link to='/login'>Login</Link>
           </button>
       ) : (
        <div><button className="btn btn-outline-success" type="submit">Spotify</button>
         <button type='button' onClick={() => {
             auth.logout();
           }}>Logout</button>
            </div>
         )
        }
       
     </div>
        </div>
    </nav>
    
  )
}

export default Navbar;
