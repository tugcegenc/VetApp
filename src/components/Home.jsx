import React from 'react';
import { Button } from 'react-bootstrap';
import '../App.css'; 

const Home = () => {
  return (
    <div style={{ backgroundColor: '#d8e7d6', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Roboto, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#ffffff', fontWeight: '500' }}>Welcome to Veterinary Management System</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <Button variant="primary" href="/login" style={{ backgroundColor: '#a4c2a8', borderColor: '#a4c2a8', fontWeight: '500' }}>Login</Button>
      </div>
    </div>
  );
};

export default Home;
