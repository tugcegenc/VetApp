import React from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';

const Sidebar = ({ closeSidebar }) => {
  return (
    <Offcanvas show onHide={closeSidebar}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Yönetim</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Nav.Link as={Link} to="/customer">Müşteri Yönetimi</Nav.Link>
        <Nav.Link as={Link} to="/doctor">Doktor Yönetimi</Nav.Link>
        <Nav.Link as={Link} to="/pet">Hayvan Yönetimi</Nav.Link>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Sidebar;
