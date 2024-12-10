import React from 'react';
import { Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './SideNav.css'; 

function SideNavbar({ routeLinks }) {
  return (
    <div>
      <Nav className="flex-column">

        <Nav.Link href="/">Home</Nav.Link>
        <Nav.Link href="#">Login</Nav.Link>
        <Nav.Link href="#">Locations</Nav.Link>

      </Nav>
    </div>
  );
}

export default SideNavbar;

