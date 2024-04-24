import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login'; 
import Register from './Components/Register';
import Welcome from './Components/Welcome';
import Navbar from './Components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Welcome />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
