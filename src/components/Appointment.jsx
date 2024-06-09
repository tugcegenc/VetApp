import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [show, setShow] = useState(false);
  const [newAppointment, setNewAppointment] = useState({ id: null, date: '', time: '', animalId: '', doctorId: '' });
  const [workDays, setWorkDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchDoctorId, setSearchDoctorId] = useState('');
  const [searchAnimalId, setSearchAnimalId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchAppointments();
    fetchAnimals();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://vet-app-jb21.onrender.com/api/v1/appointments');
      const appointmentsData = response.data.content.map(appointment => {
        const localDate = new Date(appointment.appointmentDate).toLocaleDateString();
        const localTime = new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return {
          ...appointment,
          date: localDate,
          time: localTime,
          animalName: appointment.animal?.name || '',
          customerName: appointment.animal?.customer?.name || '',
          doctorName: appointment.doctor?.name || ''
        };
      });
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (error) {
      toast.error('There was an error fetching the appointments.');
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
      toast.error('There was an error fetching the animals.');
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('https://vet-app-jb21.onrender.com/api/v1/doctors');
      const doctorsData = response.data.content;
      setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
    } catch (error) {
      toast.error('There was an error fetching the doctors.');
    }
  };

  const fetchWorkDays = async (doctorId) => {
    try {
      const response = await axios.get(`https://vet-app-jb21.onrender.com/api/v1/available-dates?doctorId=${doctorId}`);
      const workDaysData = response.data.content.map(workDay => ({
        ...workDay,
        workDate: workDay.workDay ? new Date(workDay.workDay).toISOString().split('T')[0] : ''
      }));
      setWorkDays(Array.isArray(workDaysData) ? workDaysData : []);
      console.log('Work Days:', workDaysData);
    } catch (error) {
      console.error('There was an error fetching the work days:', error);
      toast.error('There was an error fetching the work days.');
    }
  };

  const fetchAppointmentsByDoctorAndDateRange = async (doctorId, startDate, endDate) => {
    setLoading(true);
    try {
      const response = await axios.get('https://vet-app-jb21.onrender.com/api/v1/appointments/searchByDoctorAndDateRange', {
        params: { id: doctorId, startDate, endDate }
      });
      const appointmentsData = response.data.content.map(appointment => {
        const localDate = new Date(appointment.appointmentDate).toLocaleDateString();
        const localTime = new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return {
          ...appointment,
          date: localDate,
          time: localTime,
          animalName: appointment.animal?.name || '',
          customerName: appointment.animal?.customer?.name || '',
          doctorName: appointment.doctor?.name || ''
        };
      });
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (error) {
      toast.error('There was an error fetching the appointments by doctor and date range.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointmentsByAnimalAndDateRange = async (animalId, startDate, endDate) => {
    setLoading(true);
    try {
      const response = await axios.get('https://vet-app-jb21.onrender.com/api/v1/appointments/searchByAnimalAndDateRange', {
        params: { id: animalId, startDate, endDate }
      });
      const appointmentsData = response.data.content.map(appointment => {
        const localDate = new Date(appointment.appointmentDate).toLocaleDateString();
        const localTime = new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return {
          ...appointment,
          date: localDate,
          time: localTime,
          animalName: appointment.animal?.name || '',
          customerName: appointment.animal?.customer?.name || '',
          doctorName: appointment.doctor?.name || ''
        };
      });
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (error) {
      toast.error('There was an error fetching the appointments by animal and date range.');
    } finally {
      setLoading(false);
    }
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setNewAppointment({ id: null, date: '', time: '', animalId: '', doctorId: '' });
    setShow(false);
  };

  const handleSave = async () => {
    if (!newAppointment.date || !newAppointment.time) {
      toast.error('Please select a date and time.');
      return;
    }

    if (newAppointment.id) {
      handleUpdate();
    } else {
      try {
        const animal = animals.find(an => an.id === parseInt(newAppointment.animalId));
        const doctor = doctors.find(doc => doc.id === parseInt(newAppointment.doctorId));
        const appointmentDateTime = new Date(`${newAppointment.date}T${newAppointment.time}`).toISOString();  
        const formattedAppointment = {
          appointmentDate: appointmentDateTime,
          doctor: doctor,
          animal: animal
        };
        console.log('Saving appointment:', formattedAppointment); 
        const response = await axios.post('https://vet-app-jb21.onrender.com/api/v1/appointments', formattedAppointment);
        console.log('API Response:', response.data); 
        setAppointments([...appointments, response.data]);
        toast.success('Appointment added successfully!');
        handleClose();
        fetchAppointments(); 
      } catch (error) {
        console.error('There was an error saving the appointment:', error.response ? error.response.data : error);
        toast.error('There was an error saving the appointment.');
      }
    }
  };

  const handleEdit = (appointment) => {
    const [date, time] = appointment.appointmentDate.split('T');
    setNewAppointment({
      id: appointment.id,
      date: date,
      time: time.split(':00.000Z')[0],
      animalId: appointment.animal.id,
      doctorId: appointment.doctor.id
    });
    fetchWorkDays(appointment.doctor.id);  
    setShow(true);
  };

  const handleUpdate = async () => {
    try {
      const animal = animals.find(an => an.id === parseInt(newAppointment.animalId));
      const doctor = doctors.find(doc => doc.id === parseInt(newAppointment.doctorId));
      const appointmentDateTime = new Date(`${newAppointment.date}T${newAppointment.time}`).toISOString(); 
      const formattedAppointment = {
        appointmentDate: appointmentDateTime,
        doctor: doctor,
        animal: animal
      };
      const response = await axios.put(`https://vet-app-jb21.onrender.com/api/v1/appointments/${newAppointment.id}`, formattedAppointment);
      const updatedList = appointments.map(app => app.id === newAppointment.id ? response.data : app);
      setAppointments(updatedList);
      toast.success('Appointment updated successfully!');
      handleClose();
      fetchAppointments(); 
    } catch (error) {
      toast.error('There was an error updating the appointment.');
    }
  };

  const handleDelete = async (appointmentId) => {
    try {
      await axios.delete(`https://vet-app-jb21.onrender.com/api/v1/appointments/${appointmentId}`);
      const newList = appointments.filter(appointment => appointment.id !== appointmentId);
      setAppointments(newList);
      toast.success('Appointment deleted successfully!');
      fetchAppointments(); 
    } catch (error) {
      toast.error('There was an error deleting the appointment.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment({ ...newAppointment, [name]: value });
    console.log(`Changed ${name} to ${value}`);
    if (name === 'doctorId') {
      fetchWorkDays(value);  
    }
  };

  return (
    <div>
      <h1 className="mb-4">Appointments</h1>
      <div className="d-flex flex-wrap justify-content-between mb-3 search-container">
        <div className="d-flex search-box">
          <Form.Control
            as="select"
            name="searchDoctorId"
            value={searchDoctorId}
            onChange={(e) => setSearchDoctorId(e.target.value)}
          >
            <option value="">Select Doctor</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
            ))}
          </Form.Control>
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
          <Button onClick={() => fetchAppointmentsByDoctorAndDateRange(searchDoctorId, startDate, endDate)} className="search-button">Search</Button>
        </div>
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
          <Button onClick={() => fetchAppointmentsByAnimalAndDateRange(searchAnimalId, startDate, endDate)} className="search-button">Search</Button>
        </div>
      </div>
      <Button variant="primary" onClick={handleShow}>Add Appointment</Button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Time</th>
              <th>Animal Name</th>
              <th>Customer Name</th>
              <th>Doctor Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr key={appointment.id}>
                <td>{appointment.id}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.animalName}</td>
                <td>{appointment.customerName}</td>
                <td>{appointment.doctorName}</td>
                <td>
                  <Button variant="info" onClick={() => handleEdit(appointment)}>Edit</Button>
                  {' '}
                  <Button variant="danger" onClick={() => handleDelete(appointment.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{newAppointment.id ? 'Edit Appointment' : 'Add Appointment'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Doctor</Form.Label>
              <Form.Control
                as="select"
                name="doctorId"
                value={newAppointment.doctorId}
                onChange={handleChange}
              >
                <option value="">Select Doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                as="select"
                name="date"
                value={newAppointment.date}
                onChange={handleChange}
                disabled={!newAppointment.doctorId}
              >
                <option value="">Select Date</option>
                {workDays
                  .filter(workDay => workDay.doctor.id === parseInt(newAppointment.doctorId))
                  .map(workDay => (
                    <option key={workDay.id} value={workDay.workDay}>{workDay.workDay}</option>
                  ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={newAppointment.time}
                onChange={handleChange}
                disabled={!newAppointment.date}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Animal</Form.Label>
              <Form.Control
                as="select"
                name="animalId"
                value={newAppointment.animalId}
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
          <Button variant="primary" onClick={handleSave}>{newAppointment.id ? 'Update' : 'Save'}</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Appointment;
