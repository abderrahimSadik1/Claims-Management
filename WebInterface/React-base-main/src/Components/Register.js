import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phoneNumber: '',
    email: '',
    password: ''
  });

  const handleChange = (event) => {
    setUserDetails({
      ...userDetails,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response=axios.post("http://localhost:8080/register", {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        username: userDetails.username,
        phoneNumber: userDetails.phoneNumber,
        email: userDetails.email,
        password: userDetails.password
      });
    console.log('Login success:', response.data);
    } catch (error) {
      console.error('Login error:', error.response.data);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: '400px' }}>
        <h2 className="text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input type="text" className="form-control" id="firstName" name="firstName" value={userDetails.firstName} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input type="text" className="form-control" id="lastName" name="lastName" value={userDetails.lastName} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input type="text" className="form-control" id="username" name="username" value={userDetails.username} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
            <input type="text" className="form-control" id="phoneNumber" name="phoneNumber" value={userDetails.phoneNumber} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" name="email" value={userDetails.email} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" name="password" value={userDetails.password} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
        <div className="mt-3 text-center">
          <p>Already have an account? <Link to="/">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
