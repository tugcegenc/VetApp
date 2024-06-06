import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-custom">
      <Container>
        <Row>
          <Col className="text-center" >
            <h5>VetCare</h5>
            <p>Always the best for our animal friends.</p>
          </Col>
          
          <Col className="text-center">
            <h5>Contact Us</h5>
            <p>Phone: +90 555 555 55 55</p>
            <p>Email: info@vetcare.com</p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            © 2024 VetCare. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
