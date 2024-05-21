import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const UpdateClaim = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [error, setError] = useState('');
  const { id } = useParams();
  const jwt = Cookies.get('jwt');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/claims/${id}`, {
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
          }
        });
        setFormData({
          title: response.data.title,
          description: response.data.description
        });
      } catch (error) {
        setError('Failed to fetch claim. Please try again.');
        console.error('Error fetching claim:', error);
      }
    };

    fetchClaim();
  }, [id, jwt]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.put(`http://localhost:8080/claims/update/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Claim updated:', formData);
      navigate(`/claimDetails/${id}`);
    } catch (error) {
      setError('Failed to update claim. Please try again.');
      console.error('Error updating claim:', error);
    }
  };

  return (
    <div className="bg-base-200 flex flex-col items-center justify-center py-10">
      <h2 className="text-3xl font-semibold mb-6">Update Claim</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="w-full lg:w-1/2 bg-white p-6 shadow-md rounded-lg">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            rows="4"
            required
          ></textarea>
        </div>
        <button type="submit" className="justify-center btn btn-primary hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg">Submit</button>
      </form>
    </div>
  );
};

export default UpdateClaim;
