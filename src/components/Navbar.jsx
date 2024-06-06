import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'; 
import Logo from './Logo';

const NavbarComponent = () => {
  return (
    <Navbar bg="custom" variant="custom" expand="lg" style={{ backgroundColor: '#343a40' }}>
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Logo />
          <Nav className="ms-3" style={{ display: 'flex', alignItems: 'center' }}>
            <Nav.Link as={Link} to="/" style={{ color: '#000000', fontSize: '14px', fontFamily: 'Verdana, sans-serif' }}>HOME</Nav.Link>
            <Nav.Link as={Link} to="/appointments" style={{ color: '#000000', fontSize: '14px', fontFamily: 'Verdana, sans-serif' }}>APPOINTMENT</Nav.Link>
            <Nav.Link as={Link} to="/vaccinations" style={{ color: '#000000', fontSize: '14px', fontFamily: 'Verdana, sans-serif' }}>VACCINE</Nav.Link>
            <Nav.Link as={Link} to="/reports" style={{ color: '#000000', fontSize: '14px', fontFamily: 'Verdana, sans-serif' }}>REPORT</Nav.Link>
          </Nav>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavDropdown title={<FontAwesomeIcon icon={faEllipsisH} style={{ color: '#000000' }} />} id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/customers" style={{ fontFamily: 'Verdana, sans-serif' }}>Customer</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/doctors" style={{ fontFamily: 'Verdana, sans-serif' }}>Doctor</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/animals" style={{ fontFamily: 'Verdana, sans-serif' }}>Animal</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
