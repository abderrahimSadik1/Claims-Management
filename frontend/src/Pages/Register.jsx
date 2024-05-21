import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    username: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { lastName, firstName, username, phoneNumber, email, password, confirmPassword } = formData;

    // Check if both passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return; // Prevent the form from being submitted
    }

    try {
      // Perform the POST request to your API endpoint
      const response = await axios.post('http://localhost:8080/register', JSON.stringify({
        lastName: lastName,
        firstName: firstName,
        username: username,
        phoneNumber: phoneNumber,
        email: email,
        password: password
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

      // Assuming the JWT is in the response
      console.log('JWT:', response.data.token);
      localStorage.setItem('jwt', response.data.token); // Storing JWT in localStorage
      navigate('/login');
      setError(''); // Clear any previous errors
      // Redirect or further processing here after successful registration
    } catch (error) {
      setError('Failed to register. ' + error.message);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-col">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold px-40">Register now!</h1>
          <p className="py-6"></p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={handleSubmit}>

            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="input input-bordered" required />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="input input-bordered" required />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" className="input input-bordered grow" required />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone Number</span>
              </label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" className="input input-bordered" required />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="input input-bordered" required />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="input input-bordered" required />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="input input-bordered" required />
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">Register</button>
            </div>

            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
