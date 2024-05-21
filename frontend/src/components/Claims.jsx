import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../api/AuthContext'; 

const Claim = () => {
  const [claims, setClaims] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortByNewest, setSortByNewest] = useState(true);
  const [filterStatus, setFilterStatus] = useState(null);
  const jwt = Cookies.get('jwt');
  const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const navigate = useNavigate();
  const { isManager } = useContext(AuthContext); 

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const url = isManager ? 'http://localhost:8080/claims/manager/all' : 'http://localhost:8080/claims/all';
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
          }
        });
        setClaims(response.data);
      } catch (error) {
        console.error('Failed to fetch claims:', error);
      }
    };

    fetchClaims();
  }, [jwt, isManager]);

  const filteredClaims = claims.filter(claim =>
    claim.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAndSortedClaims = [...filteredClaims]
    .filter(claim => filterStatus ? claim.status === filterStatus : true)
    .sort((a, b) => {
      if (sortByNewest) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

  const handleClick = () => {
    navigate('/addClaim');
  };

  const handleDetailsClick = (claimId) => {
    navigate(`/claimDetails/${claimId}`);
  };

  const toggleSortOrder = () => {
    setSortByNewest(prevState => !prevState);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  return (
    <div className="bg-white p-8 w-full">
      <div className="flex items-center justify-between pb-6">
        <div>
          <h2 className="text-gray-600 font-semibold">Claims</h2>
          <span className="text-xs">All claim items</span>
        </div>
        <div className="dropdown">
            <div tabIndex={0} role="button" className="btn m-1 btn-neutral py-2">
              Filter by Status
            </div>
            <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52 absolute top-full left-0">
              <li><button onClick={() => handleFilterChange(null)}>All</button></li>
              <li><button onClick={() => handleFilterChange('SENT')}>Sent</button></li>
              <li><button onClick={() => handleFilterChange('APPROVED')}>Approved</button></li>
              <li><button onClick={() => handleFilterChange('REJECTED')}>Rejected</button></li>
            </ul>
          </div>
        <div className="flex items-center justify-between">
          <div className="flex bg-gray-300 items-center p-2 rounded-md mx-64">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            <input
              className="bg-gray-300 outline-none block"
              type="text"
              placeholder="search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="lg:ml-40 ml-10 space-x-8">
            {!isManager && (
              <button  onClick={handleClick} className="btn btn-primary px-4 py-2 rounded-md font-semibold tracking-wide cursor-pointer">
                New Claim
              </button>
            )}
            <button className="btn btn-primary px-4 py-2 rounded-md  font-semibold tracking-wide cursor-pointer min-w-[10rem]" onClick={toggleSortOrder}>
              {sortByNewest ? "Sort by Oldest" : "Sort by Newest"}
            </button>
          </div>
        </div>
      </div>
      <div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  {isManager && (
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                  )}
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedClaims.map((claim) => (
                  <tr key={claim.idClaim}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="font-bold text-gray-900 whitespace-no-wrap">{claim.title}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-300 whitespace-no-wrap line-clamp-3 truncate">
                       {claim.description.length > 50 ? `${claim.description.substring(0, 50)}...` : claim.description}
                      </p>
                    </td>
                    {isManager && (
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{claim.user.firstName} {claim.user.lastName}</p>
                      </td>
                    )}
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span
                        className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                          claim.status === 'APPROVED'
                            ? 'text-green-900'
                            : claim.status === 'SENT'
                            ? 'text-blue-900'
                            : 'text-red-900'
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`absolute inset-0 opacity-50 rounded-full ${
                            claim.status === 'APPROVED'
                              ? 'bg-green-200'
                              : claim.status === 'SENT'
                              ? 'bg-blue-200'
                              : 'bg-red-200'
                          }`}
                        ></span>
                        <span className="relative">{claim.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{new Date(claim.createdAt).toLocaleString('en-US', options)}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button className="btn btn-accent btn-outline" onClick={() => handleDetailsClick(claim.idClaim)}>Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
              <span className="text-xs xs:text-sm text-gray-900">Showing {filteredAndSortedClaims.length} of {claims.length} Entries</span>
              <div className="inline-flex mt-2 xs:mt-0">
                <button className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-l">
                  Prev
                </button>
                &nbsp; &nbsp;
                <button className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-r">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Claim;
