import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css'; 

const Animal = () => {
  const [animals, setAnimals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [show, setShow] = useState(false);
  const [newAnimal, setNewAnimal] = useState({ id: null, name: '', breed: '', colour: '', date_of_birth: '', gender: '', species: '', customer_id: '' });
  const [loading, setLoading] = useState(false);

  const backendUrl = 'https://vet-app-jb21.onrender.com';

  useEffect(() => {
    fetchAnimals();
    fetchCustomers();
  }, []);

  const fetchAnimals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/v1/animals`);
      console.log('Animals API Response:', response.data);
      const animalsData = response.data.content.map(animal => ({
        ...animal,
        date_of_birth: animal.dateOfBirth ? new Date(animal.dateOfBirth).toISOString().split('T')[0] : ''
      }));
      setAnimals(Array.isArray(animalsData) ? animalsData : []);
    } catch (error) {
      console.error('There was an error fetching the animals!', error);
      toast.error('There was an error fetching the animals.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/customers`);
      console.log('Customers API Response:', response.data);
      const customersData = response.data.content;
      setCustomers(Array.isArray(customersData) ? customersData : []);
    } catch (error) {
      console.error('There was an error fetching the customers!', error);
      toast.error('There was an error fetching the customers.');
    }
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setNewAnimal({ id: null, name: '', breed: '', colour: '', date_of_birth: '', gender: '', species: '', customer_id: '' });
    setShow(false);
  };

  const handleSave = async () => {
    if (newAnimal.id) {
      handleUpdate();
    } else {
      try {
        const animalToSave = { ...newAnimal, dateOfBirth: newAnimal.date_of_birth, customer: { id: newAnimal.customer_id } };
        delete animalToSave.date_of_birth;
        console.log('Saving animal:', animalToSave);
        const response = await axios.post(`${backendUrl}/api/v1/animals`, animalToSave);
        setAnimals([...animals, response.data]);
        toast.success('Animal added successfully!');
        handleClose();
        fetchAnimals(); 
      } catch (error) {
        console.error('There was an error saving the animal!', error.response ? error.response.data : error);
        toast.error('There was an error saving the animal. ' + (error.response ? error.response.data.message : error.message));
      }
    }
  };

  const handleEdit = (animal) => {
    setNewAnimal({ ...animal, customer_id: animal.customer ? animal.customer.id : '' });
    setShow(true);
  };

  const handleUpdate = async () => {
    try {
      const animalToUpdate = { ...newAnimal, dateOfBirth: newAnimal.date_of_birth, customer: { id: newAnimal.customer_id } };
      delete animalToUpdate.date_of_birth;
      const response = await axios.put(`${backendUrl}/api/v1/animals/${newAnimal.id}`, animalToUpdate);
      const updatedList = animals.map(an => an.id === newAnimal.id ? response.data : an);
      setAnimals(updatedList);
      toast.success('Animal updated successfully!');
      handleClose();
      fetchAnimals();  
    } catch (error) {
      console.error('Update error:', error);
      toast.error('There was an error updating the animal.');
    }
  };

  const handleDelete = async (animalId) => {
    try {
      await axios.delete(`${backendUrl}/api/v1/animals/${animalId}`);
      const newList = animals.filter(animal => animal.id !== animalId);
      setAnimals(newList);
      toast.success('Animal deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('There was an error deleting the animal.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAnimal({ ...newAnimal, [name]: value });
  };

  return (
    <div className='animal-container'>
      <h1 className="mb-4">Animals</h1>
      <Button variant="primary" onClick={handleShow}>Add Animal</Button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Breed</th>
              <th>Colour</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Species</th>
              <th>Customer Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {animals.map(animal => (
              <tr key={animal.id}>
                <td>{animal.id}</td>
                <td>{animal.name}</td>
                <td>{animal.breed}</td>
                <td>{animal.colour}</td>
                <td>{animal.date_of_birth}</td>
                <td>{animal.gender}</td>
                <td>{animal.species}</td>
                <td>{animal.customer?.name}</td>
                <td>
                  <Button variant="info" onClick={() => handleEdit(animal)}>Update</Button>
                  {' '}
                  <Button variant="danger" onClick={() => handleDelete(animal.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{newAnimal.id ? 'Edit Animal' : 'Add Animal'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={newAnimal.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Breed</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter breed"
                name="breed"
                value={newAnimal.breed}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Colour</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter colour"
                name="colour"
                value={newAnimal.colour}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="date_of_birth"
                value={newAnimal.date_of_birth}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter gender"
                name="gender"
                value={newAnimal.gender}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Species</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter species"
                name="species"
                value={newAnimal.species}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Customer</Form.Label>
              <Form.Control
                as="select"
                name="customer_id"
                value={newAnimal.customer_id}
                onChange={handleChange}
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleSave}>{newAnimal.id ? 'Update' : 'Save'}</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Animal;
