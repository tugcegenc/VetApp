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
    animal: {
      id: '',
      name: ''
    }
  });
  const [loading, setLoading] = useState(false);

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
        protectionFinishDate: vaccine.protectionFinishDate ? new Date(vaccine.protectionFinishDate).toISOString().split('T')[0] : ''
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

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setNewVaccine({
      id: null,
      name: '',
      code: '',
      protectionStartDate: '',
      protectionFinishDate: '',
      animal: {
        id: '',
        name: ''
      }
    });
    setShow(false);
  };

  const handleSave = async () => {
    if (newVaccine.id) {
      handleUpdate();
    } else {
      try {
        const response = await axios.post('https://vet-app-jb21.onrender.com/api/v1/vaccinations', newVaccine);
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
    setNewVaccine(vaccine);
    setShow(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`https://vet-app-jb21.onrender.com/api/v1/vaccinations/${newVaccine.id}`, newVaccine);
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
    if (name === "animal") {
      const selectedAnimal = animals.find(animal => animal.id === parseInt(value));
      setNewVaccine({ ...newVaccine, animal: selectedAnimal });
    } else {
      setNewVaccine({ ...newVaccine, [name]: value });
    }
  };

  return (
    <div>
      <h1 className="mb-4">Vaccines</h1>
      <Button variant="primary" onClick={handleShow} style={{ backgroundColor: '#a4c2a8', borderColor: '#a4c2a8', fontWeight: '500' }}>Add Vaccine</Button>
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
                <td>{vaccine.animal?.name || 'N/A'}</td>
                <td>
                  <Button variant="primary" onClick={() => handleEdit(vaccine)} style={{ backgroundColor: '#a4c2a8', borderColor: '#a4c2a8', fontWeight: '500' }}>Update</Button>
                  {' '}
                  <Button variant="primary" onClick={() => handleDelete(vaccine.id)} style={{ backgroundColor: '#a4c2a8', borderColor: '#a4c2a8', fontWeight: '500' }}>Delete</Button>
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
                name="animal"
                value={newVaccine.animal.id}
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
