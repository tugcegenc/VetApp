import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [show, setShow] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ id: null, name: '', phone: '', city: '', address: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://vet-app-jb21.onrender.com/api/v1/customers');
      console.log('API Response:', response.data); 
      const customersData = response.data.content; 
      setCustomers(Array.isArray(customersData) ? customersData : []);
    } catch (error) {
      console.error('There was an error fetching the customers!', error);
      toast.error('There was an error fetching the customers.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomersByName = async (name) => {
    setLoading(true);
    try {
      const response = await axios.get('https://vet-app-jb21.onrender.com/api/v1/customers/searchByName', {
        params: { name }
      });
      console.log('Customers by Name API Response:', response.data);
      const customersData = response.data.content;
      setCustomers(Array.isArray(customersData) ? customersData : []);
    } catch (error) {
      console.error('There was an error fetching the customers by name!', error);
      toast.error('There was an error fetching the customers by name.');
    } finally {
      setLoading(false);
    }
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setNewCustomer({ id: null, name: '', phone: '', city: '', address: '', email: '' });
    setShow(false);
  };

  const handleSave = async () => {
    if (newCustomer.id) {
      handleUpdate();
    } else {
      try {
        const response = await axios.post('https://vet-app-jb21.onrender.com/api/v1/customers', newCustomer);
        setCustomers([...customers, response.data]);
        toast.success('Customer added successfully!');
        handleClose();
      } catch (error) {
        console.error('There was an error saving the customer!', error);
        toast.error('There was an error saving the customer.');
      }
    }
  };

  const handleEdit = (customer) => {
    setNewCustomer(customer);
    setShow(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`https://vet-app-jb21.onrender.com/api/v1/customers/${newCustomer.id}`, newCustomer);
      const updatedList = customers.map(cust => cust.id === newCustomer.id ? response.data : cust);
      setCustomers(updatedList);
      toast.success('Customer updated successfully!');
      handleClose();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('There was an error updating the customer.');
    }
  };

  const handleDelete = async (customerId) => {
    try {
      await axios.delete(`https://vet-app-jb21.onrender.com/api/v1/customers/${customerId}`);
      const newList = customers.filter(customer => customer.id !== customerId);
      setCustomers(newList);
      toast.success('Customer deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('There was an error deleting the customer.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  return (
    <div>
      <h1 className="mb-4">Customers</h1>
      <div className="d-flex justify-content-between mb-3 search-container">
        <div className="d-flex search-box">
          <Form.Control
            type="text"
            placeholder="Search by customer name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <Button onClick={() => fetchCustomersByName(searchName)} className="search-button">Search</Button>
        </div>
      </div>
      <Button variant="primary" onClick={handleShow} style={{ backgroundColor: '#a4c2a8', borderColor: '#a4c2a8', fontWeight: '500' }}>Add Customer</Button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>City</th>
              <th>Address</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{customer.city}</td>
                <td>{customer.address}</td>
                <td>{customer.email}</td>
                <td>
                  <Button variant="primary" onClick={() => handleEdit(customer)} style={{ backgroundColor: '#a4c2a8', borderColor: '#a4c2a8', fontWeight: '500' }}>Update</Button>
                  {' '}
                  <Button variant="primary" onClick={() => handleDelete(customer.id)} style={{ backgroundColor: '#a4c2a8', borderColor: '#a4c2a8', fontWeight: '500' }}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{newCustomer.id ? 'Edit Customer' : 'Add Customer'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={newCustomer.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone"
                name="phone"
                value={newCustomer.phone}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter city"
                name="city"
                value={newCustomer.city}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                name="address"
                value={newCustomer.address}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={newCustomer.email}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleSave}>{newCustomer.id ? 'Update' : 'Save'}</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Customer;
