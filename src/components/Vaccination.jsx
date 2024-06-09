import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Vaccine = () => {
  const [vaccines, setVaccines] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [show, setShow] = useState(false);
  const [newVaccine, setNewVaccine] = useState({
    id: null,
    name: '',
    code: '',
    protectionStartDate: '',
    protectionFinishDate: '',
    animalWithoutCustomer: {
      id: '',
      name: '',
      species: '',
      breed: '',
      gender: '',
      dateOfBirth: '',
      colour: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [searchAnimalId, setSearchAnimalId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchVaccines();
    fetchAnimals();
  }, []);

  const fetchVaccines = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://vet-app-jb21.onrender.com/api/v1/vaccinations');
      const vaccinesData = response.data.content.map(vaccine => ({
        ...vaccine,
        protectionStartDate: vaccine.protectionStartDate ? new Date(vaccine.protectionStartDate).toISOString().split('T')[0] : '',
        protectionFinishDate: vaccine.protectionFinishDate ? new Date(vaccine.protectionFinishDate).toISOString().split('T')[0] : '',
        animalWithoutCustomer: vaccine.animalWithoutCustomer || { id: '', name: '' }
      }));
      setVaccines(Array.isArray(vaccinesData) ? vaccinesData : []);
    } catch (error) {
      console.error('There was an error fetching the vaccines!', error);
      toast.error('There was an error fetching the vaccines.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnimals = async () => {
    try {
      const response = await axios.get('https://vet-app-jb21.onrender.com/api/v1/animals');
      const animalsData = response.data.content;
      setAnimals(Array.isArray(animalsData) ? animalsData : []);
    } catch (error) {
      console.error('There was an error fetching the animals!', error);
      toast.error('There was an error fetching the animals.');
    }
  };

  const fetchVaccinesByAnimal = async (animalId) => {
    setLoading(true);
    try {
      const response = await axios.get('https://vet-app-jb21.onrender.com/api/v1/vaccinations/searchByAnimal', {
        params: { id: animalId }
      });
      const vaccinesData = response.data.content.map(vaccine => ({
        ...vaccine,
        protectionStartDate: vaccine.protectionStartDate ? new Date(vaccine.protectionStartDate).toISOString().split('T')[0] : '',
        protectionFinishDate: vaccine.protectionFinishDate ? new Date(vaccine.protectionFinishDate).toISOString().split('T')[0] : '',
        animalWithoutCustomer: vaccine.animalWithoutCustomer || { id: '', name: '' }
      }));
      setVaccines(Array.isArray(vaccinesData) ? vaccinesData : []);
    } catch (error) {
      toast.error('There was an error fetching the vaccines by animal.');
    } finally {
      setLoading(false);
    }
  };

  const fetchVaccinesByDateRange = async (startDate, endDate) => {
    setLoading(true);
    try {
      const response = await axios.get('https://vet-app-jb21.onrender.com/api/v1/vaccinations/searchByVaccinationRange', {
        params: { startDate, endDate }
      });
      const vaccinesData = response.data.content.map(vaccine => ({
        ...vaccine,
        protectionStartDate: vaccine.protectionStartDate ? new Date(vaccine.protectionStartDate).toISOString().split('T')[0] : '',
        protectionFinishDate: vaccine.protectionFinishDate ? new Date(vaccine.protectionFinishDate).toISOString().split('T')[0] : '',
        animalWithoutCustomer: vaccine.animalWithoutCustomer || { id: '', name: '' }
      }));
      setVaccines(Array.isArray(vaccinesData) ? vaccinesData : []);
    } catch (error) {
      toast.error('There was an error fetching the vaccines by date range.');
    } finally {
      setLoading(false);
    }
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setNewVaccine({
      id: null,
      name: '',
      code: '',
      protectionStartDate: '',
      protectionFinishDate: '',
      animalWithoutCustomer: {
        id: '',
        name: '',
        species: '',
        breed: '',
        gender: '',
        dateOfBirth: '',
        colour: ''
      }
    });
    setShow(false);
  };

  const handleSave = async () => {
    const animal = animals.find(an => an.id === parseInt(newVaccine.animalWithoutCustomer.id));
    const formattedVaccine = {
      ...newVaccine,
      animalWithoutCustomer: animal ? { id: animal.id, name: animal.name } : null
    };
  
    if (newVaccine.id) {
      handleUpdate(formattedVaccine);
    } else {
      try {
        console.log('Saving vaccine:', formattedVaccine);
        const response = await axios.post('https://vet-app-jb21.onrender.com/api/v1/vaccinations', formattedVaccine);
        setVaccines([...vaccines, response.data]);
        toast.success('Vaccine added successfully!');
        handleClose();
      } catch (error) {
        console.error('There was an error saving the vaccine!', error.response ? error.response.data : error);
        toast.error('There was an error saving the vaccine. ' + (error.response ? error.response.data.message : error.message));
      }
    }
  };
  

  const handleEdit = (vaccine) => {
    const animal = animals.find(an => an.id === vaccine.animalWithoutCustomer.id) || {};
    setNewVaccine({
      id: vaccine.id,
      name: vaccine.name,
      code: vaccine.code,
      protectionStartDate: vaccine.protectionStartDate,
      protectionFinishDate: vaccine.protectionFinishDate,
      animalWithoutCustomer: {
        id: animal.id || '',
        name: animal.name || '',
        species: animal.species || '',
        breed: animal.breed || '',
        gender: animal.gender || '',
        dateOfBirth: animal.dateOfBirth || '',
        colour: animal.colour || ''
      }
    });
    setShow(true);
  };

  const handleUpdate = async (formattedVaccine) => {
    try {
      const response = await axios.put(`https://vet-app-jb21.onrender.com/api/v1/vaccinations/${newVaccine.id}`, formattedVaccine);
      const updatedList = vaccines.map(vac => vac.id === newVaccine.id ? response.data : vac);
      setVaccines(updatedList);
      toast.success('Vaccine updated successfully!');
      handleClose();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('There was an error updating the vaccine.');
    }
  };

  const handleDelete = async (vaccineId) => {
    try {
      await axios.delete(`https://vet-app-jb21.onrender.com/api/v1/vaccinations/${vaccineId}`);
      const newList = vaccines.filter(vaccine => vaccine.id !== vaccineId);
      setVaccines(newList);
      toast.success('Vaccine deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('There was an error deleting the vaccine.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('animalWithoutCustomer')) {
      const field = name.split('.')[1];
      setNewVaccine({
        ...newVaccine,
        animalWithoutCustomer: {
          ...newVaccine.animalWithoutCustomer,
          [field]: value
        }
      });
    } else {
      setNewVaccine({ ...newVaccine, [name]: value });
    }
  };

  return (
    <div>
      <h1 className="mb-4">Vaccines</h1>
      
      <div className="d-flex flex-wrap justify-content-between mb-3 search-container">
        <div className="d-flex search-box">
          <Form.Control
            as="select"
            name="searchAnimalId"
            value={searchAnimalId}
            onChange={(e) => setSearchAnimalId(e.target.value)}
          >
            <option value="">Select Animal</option>
            {animals.map(animal => (
              <option key={animal.id} value={animal.id}>{animal.name}</option>
            ))}
          </Form.Control>
          <Button onClick={() => fetchVaccinesByAnimal(searchAnimalId)} className="search-button">Search</Button>
        </div>
        <div className="d-flex search-box">
          <Form.Control
            type="date"
            name="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Form.Control
            type="date"
            name="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Button onClick={() => fetchVaccinesByDateRange(startDate, endDate)} className="search-button">Search</Button>
        </div>
      </div>

      <Button variant="primary" onClick={handleShow}>Add Vaccine</Button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Code</th>
              <th>Protection Start Date</th>
              <th>Protection Finish Date</th>
              <th>Animal Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vaccines.map(vaccine => (
              <tr key={vaccine.id}>
                <td>{vaccine.id}</td>
                <td>{vaccine.name}</td>
                <td>{vaccine.code}</td>
                <td>{vaccine.protectionStartDate}</td>
                <td>{vaccine.protectionFinishDate}</td>
                <td>{vaccine.animalWithoutCustomer?.name || 'N/A'}</td>
                <td>
                  <Button variant="info" onClick={() => handleEdit(vaccine)}>Update</Button>
                  {' '}
                  <Button variant="danger" onClick={() => handleDelete(vaccine.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{newVaccine.id ? 'Edit Vaccine' : 'Add Vaccine'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={newVaccine.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter code"
                name="code"
                value={newVaccine.code}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Protection Start Date</Form.Label>
              <Form.Control
                type="date"
                name="protectionStartDate"
                value={newVaccine.protectionStartDate}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Protection Finish Date</Form.Label>
              <Form.Control
                type="date"
                name="protectionFinishDate"
                value={newVaccine.protectionFinishDate}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Animal</Form.Label>
              <Form.Control
                as="select"
                name="animalWithoutCustomer.id"
                value={newVaccine.animalWithoutCustomer.id}
                onChange={handleChange}
              >
                <option value="">Select Animal</option>
                {animals.map(animal => (
                  <option key={animal.id} value={animal.id}>{animal.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleSave}>{newVaccine.id ? 'Update' : 'Save'}</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Vaccine;
