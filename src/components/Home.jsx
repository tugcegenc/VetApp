import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css'; 

const Home = () => {
  return (
    <div style={{ minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Roboto, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#000', fontWeight: '500' }}>Welcome to Veterinary Management System</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <Link to="/customers">
          <Button variant="primary" style={{ backgroundColor: '#0050a0', borderColor: '#0050a0', fontWeight: '500' }}>Login</Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;