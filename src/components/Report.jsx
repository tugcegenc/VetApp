import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css'; 

const Report = () => {
  const [reports, setReports] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [show, setShow] = useState(false);
  const [newReport, setNewReport] = useState({ id: null, title: '', diagnosis: '', price: '', appointmentId: '' });
  const [loading, setLoading] = useState(false);

  const backendUrl = 'https://vet-app-jb21.onrender.com';

  useEffect(() => {
    fetchReports();
    fetchAppointments();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/v1/reports`);
      console.log('Reports API Response:', response.data);
      const reportsData = response.data.content;
      setReports(Array.isArray(reportsData) ? reportsData : []);
    } catch (error) {
      console.error('There was an error fetching the reports!', error);
      toast.error('There was an error fetching the reports.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/appointments`);
      console.log('Appointments API Response:', response.data);
      const appointmentsData = response.data.content;
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (error) {
      console.error('There was an error fetching the appointments!', error);
      toast.error('There was an error fetching the appointments.');
    }
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setNewReport({ id: null, title: '', diagnosis: '', price: '', appointmentId: '' });
    setShow(false);
  };

  const handleSave = async () => {
    if (!newReport.appointmentId) {
      toast.error('Please select an appointment.');
      return;
    }
    if (newReport.id) {
      handleUpdate();
    } else {
      try {
        console.log('Saving report:', newReport);
        const response = await axios.post(`${backendUrl}/api/v1/reports`, newReport);
        setReports([...reports, response.data]);
        toast.success('Report added successfully!');
        handleClose();
      } catch (error) {
        console.error('There was an error saving the report!', error.response ? error.response.data : error);
        toast.error('There was an error saving the report. ' + (error.response ? error.response.data.message : error.message));
      }
    }
  };

  const handleEdit = (report) => {
    setNewReport(report);
    setShow(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${backendUrl}/api/v1/reports/${newReport.id}`, newReport);
      const updatedList = reports.map(rep => rep.id === newReport.id ? response.data : rep);
      setReports(updatedList);
      toast.success('Report updated successfully!');
      handleClose();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('There was an error updating the report.');
    }
  };

  const handleDelete = async (reportId) => {
    try {
      await axios.delete(`${backendUrl}/api/v1/reports/${reportId}`);
      const newList = reports.filter(report => report.id !== reportId);
      setReports(newList);
      toast.success('Report deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('There was an error deleting the report.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReport({ ...newReport, [name]: value });
  };

  return (
    <div>
      <h1 className="mb-4">Reports</h1>
      <Button variant="primary" onClick={handleShow}>Add Report</Button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Diagnosis</th>
              <th>Price</th>
              <th>Appointment Date</th>
              <th>Appointment Time</th>
              <th>Doctor Name</th>
              <th>Animal Name</th>
              <th>Customer Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => {
              const appointment = report.appointment; 
              return (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.title}</td>
                  <td>{report.diagnosis}</td>
                  <td>{report.price}</td>
                  <td>{appointment ? new Date(appointment.date).toLocaleDateString() : 'N/A'}</td>
                  <td>{appointment ? new Date(appointment.date).toLocaleTimeString() : 'N/A'}</td>
                  <td>{appointment ? appointment.doctorName : 'N/A'}</td>
                  <td>{appointment ? appointment.animalName : 'N/A'}</td>
                  <td>{appointment ? appointment.customerName : 'N/A'}</td>
                  <td>
                    <Button variant="info" onClick={() => handleEdit(report)}>Update</Button>
                    {' '}
                    <Button variant="danger" onClick={() => handleDelete(report.id)}>Delete</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{newReport.id ? 'Edit Report' : 'Add Report'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                name="title"
                value={newReport.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Diagnosis</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter diagnosis"
                name="diagnosis"
                value={newReport.diagnosis}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter price"
                name="price"
                value={newReport.price}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Appointment</Form.Label>
              <Form.Control
                as="select"
                name="appointmentId"
                value={newReport.appointmentId}
                onChange={handleChange}
              >
                <option value="">Select Appointment</option>
                {appointments.map(appointment => (
                  <option key={appointment.id} value={appointment.id}>{new Date(appointment.appointmentDate).toLocaleString()}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleSave}>{newReport.id ? 'Update' : 'Save'}</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Report;
