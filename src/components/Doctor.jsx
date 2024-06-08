import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [workDays, setWorkDays] = useState([]);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showWorkDayModal, setShowWorkDayModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ id: null, name: '', phone: '', city: '', address: '', email: '' });
  const [newWorkDay, setNewWorkDay] = useState({ id: null, doctorId: '', workDate: '' });
  const [loading, setLoading] = useState(false);

  const doctorModalRef = useRef(null);
  const workDayModalRef = useRef(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://vet-app-jb21.onrender.com/api/v1/doctors');
      const doctorsData = response.data.content;
      setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
      fetchWorkDays(); // fetchWorkDays fonksiyonunu burada çağırıyoruz ve doctorsData'yı parametre olarak geçiyoruz
    } catch (error) {
      toast.error('There was an error fetching the doctors.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkDays = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://vet-app-jb21.onrender.com/api/v1/available-dates');
      const workDaysData = response.data.content.map(workDay => ({
        ...workDay,
        workDate: workDay.workDay ? new Date(workDay.workDay).toISOString().split('T')[0] : '',
        doctorName: workDay.doctor?.name || ''
      }));
      setWorkDays(Array.isArray(workDaysData) ? workDaysData : []);
    } catch (error) {
      toast.error('There was an error fetching the work days.');
    } finally {
      setLoading(false);
    }
  };

  const handleShowDoctorModal = () => setShowDoctorModal(true);
  const handleCloseDoctorModal = () => {
    setNewDoctor({ id: null, name: '', phone: '', city: '', address: '', email: '' });
    setShowDoctorModal(false);
  };

  const handleShowWorkDayModal = () => setShowWorkDayModal(true);
  const handleCloseWorkDayModal = () => {
    setNewWorkDay({ id: null, doctorId: '', workDate: '' });
    setShowWorkDayModal(false);
  };

  const handleSaveDoctor = async () => {
    if (newDoctor.id) {
      handleUpdateDoctor();
    } else {
      try {
        const response = await axios.post('https://vet-app-jb21.onrender.com/api/v1/doctors', newDoctor);
        setDoctors([...doctors, response.data]);
        toast.success('Doctor added successfully!');
        handleCloseDoctorModal();
        fetchDoctors();
      } catch (error) {
        toast.error('There was an error saving the doctor.');
      }
    }
  };

  const handleEditDoctor = (doctor) => {
    setNewDoctor(doctor);
    setShowDoctorModal(true);
  };

  const handleUpdateDoctor = async () => {
    try {
      const response = await axios.put(`https://vet-app-jb21.onrender.com/api/v1/doctors/${newDoctor.id}`, newDoctor);
      const updatedList = doctors.map(doc => doc.id === newDoctor.id ? response.data : doc);
      setDoctors(updatedList);
      toast.success('Doctor updated successfully!');
      handleCloseDoctorModal();
      fetchDoctors();
    } catch (error) {
      toast.error('There was an error updating the doctor.');
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    try {
      await axios.delete(`https://vet-app-jb21.onrender.com/api/v1/doctors/${doctorId}`);
      const newList = doctors.filter(doctor => doctor.id !== doctorId);
      setDoctors(newList);
      toast.success('Doctor deleted successfully!');
      fetchDoctors(); 
    } catch (error) {
      toast.error('There was an error deleting the doctor.');
    }
  };

  const handleSaveWorkDay = async () => {
    if (newWorkDay.id) {
      handleUpdateWorkDay();
    } else {
      try {
        const response = await axios.post('https://vet-app-jb21.onrender.com/api/v1/available-dates', newWorkDay);
        setWorkDays([...workDays, response.data]);
        toast.success('Work day added successfully!');
        handleCloseWorkDayModal();
        fetchWorkDays(); 
      } catch (error) {
        toast.error('There was an error saving the work day.');
      }
    }
  };

  const handleEditWorkDay = (workDay) => {
    setNewWorkDay(workDay);
    setShowWorkDayModal(true);
  };

  const handleUpdateWorkDay = async () => {
    try {
      const response = await axios.put(`https://vet-app-jb21.onrender.com/api/v1/available-dates/${newWorkDay.id}`, newWorkDay);
      const updatedList = workDays.map(wd => wd.id === newWorkDay.id ? response.data : wd);
      setWorkDays(updatedList);
      toast.success('Work day updated successfully!');
      handleCloseWorkDayModal();
      fetchWorkDays(); 
    } catch (error) {
      toast.error('There was an error updating the work day.');
    }
  };

  const handleDeleteWorkDay = async (workDayId) => {
    try {
      await axios.delete(`https://vet-app-jb21.onrender.com/api/v1/available-dates/${workDayId}`);
      const newList = workDays.filter(workDay => workDay.id !== workDayId);
      setWorkDays(newList);
      toast.success('Work day deleted successfully!');
      fetchWorkDays(); 
    } catch (error) {
      toast.error('There was an error deleting the work day.');
    }
  };

  const handleDoctorChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor({ ...newDoctor, [name]: value });
  };

  const handleWorkDayChange = (e) => {
    const { name, value } = e.target;
    setNewWorkDay({ ...newWorkDay, [name]: value });
  };

  return (
    <div>
      <h1 className="mb-4">Doctors</h1>
      <Button variant="primary" onClick={handleShowDoctorModal} style={{ backgroundColor: '#a4c2a8', borderColor: '#a4c2a8', fontWeight: '500' }}>Add Doctor</Button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
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
              {doctors.map(doctor => (
                <tr key={doctor.id}>
                  <td>{doctor.id}</td>
                  <td>{doctor.name}</td>
                  <td>{doctor.phone}</td>
                  <td>{doctor.city}</td>
                  <td>{doctor.address}</td>
                  <td>{doctor.email}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleEditDoctor(doctor)} style={{ backgroundColor: '#a4c2a8', borderColor: '#a4c2a8', fontWeight: '500' }}>Update</Button>
                    {' '}
                    <Button variant="primary" onClick={() => handleDeleteDoctor(doctor.id)} style={{ backgroundColor: '#a4c2a8', borderColor: '#a4c2a8', fontWeight: '500' }}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h2 className="mt-4">Work Days</h2>
          <Button variant="primary" onClick={handleShowWorkDayModal} style={{ backgroundColor: '#a4c2a8', borderColor: '#a4c2a8', fontWeight: '500' }}>Add Work Day</Button>
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>Doctor Name</th>
                <th>Work Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workDays.map(workDay => (
                <tr key={workDay.id}>
                  <td>{workDay.id}</td>
                  <td>{workDay.doctorName}</td>
                  <td>{workDay.workDate}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleEditWorkDay(workDay)} style={{ backgroundColor: '#a4c2a8', borderColor: '#a4c2a8', fontWeight: '500' }}>Update</Button>
                    {' '}
                    <Button variant="primary" onClick={() => handleDeleteWorkDay(workDay.id)} style={{ backgroundColor: '#a4c2a8', borderColor: '#a4c2a8', fontWeight: '500' }}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      <Modal ref={doctorModalRef} show={showDoctorModal} onHide={handleCloseDoctorModal}>
        <Modal.Header closeButton>
          <Modal.Title>{newDoctor.id ? 'Edit Doctor' : 'Add Doctor'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={newDoctor.name}
                onChange={handleDoctorChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone"
                name="phone"
                value={newDoctor.phone}
                onChange={handleDoctorChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter city"
                name="city"
                value={newDoctor.city}
                onChange={handleDoctorChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                name="address"
                value={newDoctor.address}
                onChange={handleDoctorChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={newDoctor.email}
                onChange={handleDoctorChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDoctorModal}>Close</Button>
          <Button variant="primary" onClick={handleSaveDoctor}>{newDoctor.id ? 'Update' : 'Save'}</Button>
        </Modal.Footer>
      </Modal>

      <Modal ref={workDayModalRef} show={showWorkDayModal} onHide={handleCloseWorkDayModal}>
        <Modal.Header closeButton>
          <Modal.Title>{newWorkDay.id ? 'Edit Work Day' : 'Add Work Day'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Doctor</Form.Label>
              <Form.Control
                as="select"
                name="doctorId"
                value={newWorkDay.doctorId}
                onChange={handleWorkDayChange}
              >
                <option value="">Select Doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Work Date</Form.Label>
              <Form.Control
                type="date"
                name="workDate"
                value={newWorkDay.workDate}
                onChange={handleWorkDayChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseWorkDayModal}>Close</Button>
          <Button variant="primary" onClick={handleSaveWorkDay}>{newWorkDay.id ? 'Update' : 'Save'}</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Doctor;
