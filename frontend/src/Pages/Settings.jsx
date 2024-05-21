import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function Settings() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const jwt = Cookies.get('jwt');

  useEffect(() => {
    // Fetch users data from your backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/users/all', {
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    fetchUsers();
  }, [jwt]);

  const handleRoleChange = async (id, value) => {
    try {
      await axios.put(`http://localhost:8080/users/${id}`, {
        role: value
      }, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });
      const response = await axios.get('http://localhost:8080/users/all', {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });
      setUsers(response.data);
      console.log('Role updated successfully');
    } catch (error) {
      console.error('Failed to update role', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });

      const response = await axios.get('http://localhost:8080/users/all', {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });
      setUsers(response.data);
      console.log('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user', error);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-base-300 min-h-screen ">
      <div className="container py-6 mx-3">
        <h1 className="text-3xl font-semibold mb-6">Users</h1>
        <div className="ml-3 mb-4">
          <input
            type="text"
            placeholder="Search by username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-1"
          />
        </div>
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow ">
          <table className="w-full whitespace-no-wrap mx-3
          ">
            <thead>
              <tr className="text-left font-bold bg-base-200">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Username</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="">
                  <td className="px-6 py-4">{user.firstName} {user.lastName}</td>
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      className="border rounded px-3 py-1"
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="MANAGER">MANAGER</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleDelete(user.id)}
                      className="text-sm btn btn-error focus:shadow-outline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Settings;
