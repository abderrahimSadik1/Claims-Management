import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie
import { AuthContext } from '../api/AuthContext'; // Ensure the path is correct

function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/login', formData, {
                headers: { 'Content-Type': 'application/json' }
            });
            const { token } = response.data; // Assuming the token is returned in response.data.token
            const { role } =response.data;
            // Set the cookie with the JWT
            Cookies.set('jwt', token, { expires: 7, secure: true, sameSite: 'Strict' }); // Adjust cookie settings as needed
            Cookies.set('user',formData.username);
            Cookies.set('role',role,{ expires: 7, secure: true, sameSite: 'Strict' });
            login(token,role); // Assuming login method in context does some additional work
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            setError('Failed to login. Please check your credentials.');
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col">
                <div className="text-center">
                    <h1 className="text-5xl font-bold mb-4">Login</h1>
                    <p>Welcome back! Please enter your details.</p>
                </div>
                <div className="card w-full max-w-xl shadow-2xl bg-base-100">
                    <form className="card-body" onSubmit={handleSubmit}>
                        <div className="form-control">
                            <input type="text" name="username" placeholder="Username" className="input input-bordered pr-10" value={formData.username} onChange={handleChange} required />
                        </div>
                        <div className="form-control">
                            <input type="password" name="password" placeholder="Password" className="input input-bordered" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
