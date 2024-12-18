import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AirplaneFill } from 'react-bootstrap-icons';
import ThemeToggle from '../Theme/ThemeToggle';
import { useAuthState } from '../Auth/AuthProviderHooks';
import { Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

import { Navbar, Nav, Container, NavDropdown, Offcanvas, Row } from 'react-bootstrap';

const GET_EVENT_META = gql`
  query {
    event_meta {
      last_update
    }
  }
`;
const GlobalNavbar: React.FC = () => {
    const expand = 'lg';
    const { user } = useAuthState();

    const { loading, error, data } = useQuery(GET_EVENT_META);
    const [eventMeta, setEventMeta] = useState(null);

    useEffect(() => {
        if (data) {
            setEventMeta(data.event_meta);
        }
    }, [data]);
    
    return (
        <>
            <div className="h-100 w-100 d-flex flex-column">
                <Navbar expand={expand} className="bg-body-tertiary mb-3">
                    <Container fluid>
                        <Navbar.Brand href="#">
                            <AirplaneFill size={32} />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                        <Navbar.Offcanvas
                            id={`offcanvasNavbar-expand-${expand}`}
                            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                            placement="end"
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                                    Offcanvas
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body className="container-fluid">
                                <Row className="w-100">
                                    <Nav className="col-3 d-flex align-items-center justify-content-start">
                                        {user?.roles.includes('admin') && (
                                            <NavDropdown
                                                title="Admin Panel"
                                                id={`offcanvasNavbarDropdown-expand-${expand}`}
                                                className='ms-3'
                                            >
                                                <NavDropdown.Item as={Link} to="/admin/users">
                                                    User Management
                                                </NavDropdown.Item>
                                                <NavDropdown.Item as={Link} to="/admin/modify-events">
                                                    Event Management
                                                </NavDropdown.Item>
                                                {/* <NavDropdown.Divider />
                                                <NavDropdown.Item href="#action5">Something else here</NavDropdown.Item> */}
                                            </NavDropdown>
                                        )}
                                        <ThemeToggle className="mx-3" />
                                    </Nav>
                                    <Nav className="col-3 d-flex align-items-center justify-content-center">
                                        <Nav.Link as={Link} to="/general-search">
                                            Search
                                        </Nav.Link>
                                        {/* <Nav.Link as={Link} to="/VenueDetail">
                                            Venues
                                        </Nav.Link> */}
                                        <Nav.Link as={Link} to="/favourite-venue">
                                            Favorites
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="/event-page">
                                            Events
                                        </Nav.Link>
                                    </Nav>
                                    <div  className="col-4 d-flex align-items-center justify-content-end">Data fetched: {eventMeta ? eventMeta.last_update : 'not fetched'}</div>
                                    <Nav className="col-2 d-flex align-items-center justify-content-end">
                                        <div>Hello {user?.username}!</div>
                                        <Link to="/logout" className="btn btn-danger ms-3">
                                            Logout
                                        </Link>
                                    </Nav>
                                </Row>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Container>
                </Navbar>
                <Outlet />
            </div>
        </>
    );
};

export default GlobalNavbar;
