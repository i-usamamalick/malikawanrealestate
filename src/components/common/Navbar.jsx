import { Link } from "react-router-dom";
const token = localStorage.getItem("token");
import "../../App.css";

const Navbar = () => {

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href="admin-login"
  };
  return (
    <nav className="navbar">
      {token ? <Link className="logo" to='/dashboard'><img src="/src/images/logo.png" /></Link> : <Link className="logo" to='/'><img src="/src/images/logo.png" /></Link>}
      <h2>Malik Awan Real Estate & Builders</h2>
      <div>
        {}
        {!token && <Link to="/">Home</Link>} {!token && `|`} {!token && <Link to="/contact">Contact</Link>} {!token && `|`} {!token && <Link to="/terms-and-conditions">T&Cs</Link>} {token && <Link onClick={handleLogout}>Logout</Link>}
      </div>
    </nav>
  );
};

export default Navbar;
