import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AuthContext } from '../api/AuthContext';

const ClaimDetail = () => {
  const [claim, setClaim] = useState(null);
  const [rejection, setRejection] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete modal
  const { id } = useParams();
  const jwt = Cookies.get('jwt');
  const currentUsername = Cookies.get('user')
  const navigate = useNavigate();
  const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const { isManager } = useContext(AuthContext);

  useEffect(() => {
    const fetchClaimAndRejection = async () => {
      try {
        // Fetch claim data
        const claimResponse = await axios.get(`http://localhost:8080/claims/${id}`, {
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
          }
        });

        // Fetch rejection data only if claim status is 'REJECTED'
        if (claimResponse.data.status === 'REJECTED') {
          const rejectionResponse = await axios.get(`http://localhost:8080/rejections/${id}`, {
            headers: {
              'Authorization': `Bearer ${jwt}`,
              'Content-Type': 'application/json'
            }
          });

          // Set rejection data
          setRejection(rejectionResponse.data);
        }

        // Set claim data
        setClaim(claimResponse.data);
      } catch (error) {
        console.error('Failed to fetch claim:', error);
      }
    };

    fetchClaimAndRejection();
  }, [id, jwt]);

  const handleApprove = async () => {
    try {
      claim.status = 'APPROVED';
      await axios.put(`http://localhost:8080/claims/update/${id}`, {
        title: claim.title,
        description: claim.description,
        status: claim.status
      }, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });
      setClaim((prevClaim) => ({ ...prevClaim, status: 'APPROVED' }));
      navigate('/');
    } catch (error) {
      console.error('Failed to approve claim:', error);
    }
  };

  const handleReject = async () => {
    try {
      // Create rejection with claim title and description
      await axios.post(`http://localhost:8080/rejections/${id}`, {
        title: claim.title, // Use claim title
        description: rejectionReason // Use rejection reason as description
      }, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });
      // Update claim status to REJECTED
      claim.status = 'REJECTED';
      await axios.put(`http://localhost:8080/claims/update/${id}`, {
        title: claim.title,
        description: claim.description,
        status: claim.status
      }, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });
      setClaim((prevClaim) => ({ ...prevClaim, status: 'REJECTED' }));
      setShowRejectModal(false);
      setRejectionReason('');
      navigate('/');
    } catch (error) {
      console.error('Failed to reject claim:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/claims/delete/${id}`, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to delete claim:', error);
    }
  };

  if (!claim) {
    return (
      <div className='min-h-screen bg-base-200 flex justify-center items-center'>
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="bg-base-200 flex flex-col items-center justify-center py-10 pb-72">
      <div className="card w-full lg:w-2/3 shadow-xl image-full">
        <div className="card-body bg-white">
          <h2 className="card-title text-black text-4xl">{claim.title}</h2>
          <span
            className={`relative inline-block text-center px-3 py-1 font-semibold leading-tight ${
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
          <p className="text-sm text-black">{new Date(claim.createdAt).toLocaleString('en-US', options)}</p>
          <p className="font-bold text-lg text-black">By {claim.user.firstName} {claim.user.lastName}</p>
          <p className='text-black'>{claim.description}</p>
          {(isManager && claim.status === 'SENT') && (
            <div className="mt-4">
              <button 
                className="btn btn-accent mr-2" 
                onClick={handleApprove}
              >
                Approve
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => setShowRejectModal(true)}
              >
                Reject
              </button>
            </div>
          )}
          {(claim.user.username === currentUsername&&claim.status === 'SENT') && (
            <div className="mt-4">
              <button 
                className="btn btn-accent mr-2" 
                onClick={() => navigate(`/claims/update/${id}`)}
              >
                Update
              </button>
              <button 
                className="btn btn-outline btn-error mr-2" 
                onClick={() => setShowDeleteModal(true)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg z-60">
            <h2 className="text-2xl mb-4">Reject Claim</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows="4"
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            ></textarea>
            <div className="mt-4">
              <button 
                className="btn btn-error mr-2" 
                onClick={handleReject}
              >
                Submit Rejection
              </button>
              <button 
                className="btn btn-default" 
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg z-60">
            <h2 className="text-2xl mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this claim?</p>
            <div className="mt-4">
              <button 
                className="btn btn-error mr-2" 
                onClick={handleDelete}
              >
                Delete
              </button>
              <button 
                className="btn btn-default" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {(claim.status === 'REJECTED') && (
        <div className="card w-full lg:w-2/3 shadow-xl image-full">
          <div className="card-body bg-red-300">
            <h2 className="card-title text-black text-4xl">Rejected Because:</h2>
            <p className='text-black'>{rejection.description}</p>
            <p className="text-sm text-black">{new Date(rejection.rejectedAt).toLocaleString('en-US', options)}</p>
            <p className="text-lg text-black mb-0">Manager: </p>
            <span className="relative inline-block text-center px-3 py-1 font-semibold leading-tight text-red-800">
              <span
                aria-hidden
                className="absolute inset-0 opacity-50 rounded-full bg-red-500"
              ></span>
              <span className="relative">{rejection.manager.firstName} {rejection.manager.lastName}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimDetail;
