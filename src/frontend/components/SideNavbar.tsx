import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './SideNav.css';

function SideNavbar() {
    return (
        <div>
            <Nav className="flex-column">
                <Link className="nav-link" to="/">
                    Home
                </Link>
                <Link className="nav-link" to="/login">
                    Login
                </Link>
                <Link className="nav-link" to="/register">
                    Register
                </Link>
                <Link className="nav-link" to="/locationTable">
                    Locations
                </Link>
                <Link className="nav-link" to="MapView">
                    Map view
                </Link>
            </Nav>
        </div>
    );
}

export default SideNavbar;