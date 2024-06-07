import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Customer from './components/Customer';
import './App.css';
import Doctor from './components/Doctor';
import Vaccination from './components/Vaccination';
import Animal from './components/Animal';
import Appointment from './components/Appointment';
import Report from './components/Report';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="container">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/customers" component={Customer} />
            <Route path="/doctors" component={Doctor} />
            <Route path="/vaccinations" component={Vaccination} />
            <Route path="/animals" component={Animal} />
            <Route path="/appointments" component={Appointment} /> 
            <Route path="/reports" component={Report} />
           
          </Switch>
        </div>
     
      </div>
    </Router>
  );
}

export default App;
