import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function Dashboard() {
  const [claimStats, setClaimStats] = useState({
    today: { submitted: 0, approved: 0, rejected: 0, pending: 0 },
    thisMonth: { submitted: 0, approved: 0, rejected: 0, pending: 0 },
    allTime: { submitted: 0, approved: 0, rejected: 0, pending: 0 }
  });
  const jwt = Cookies.get('jwt');

  useEffect(() => {
    const fetchClaimStats = async () => {
      try {
        const response = await axios.get('http://localhost:8080/claims/manager/all', {
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
          }
        });
        const claims = response.data;

        const today = new Date();
        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1); // Set to start of current month

        const stats = {
          today: { submitted: 0, approved: 0, rejected: 0, pending: 0 },
          thisMonth: { submitted: 0, approved: 0, rejected: 0, pending: 0 },
          allTime: { submitted: 0, approved: 0, rejected: 0, pending: 0 }
        };

        claims.forEach(claim => {
          // Check if claim was submitted today
          if (new Date(claim.createdAt).toDateString() === today.toDateString()) {
            stats.today.submitted++;
            if (claim.status === 'APPROVED') stats.today.approved++;
            else if (claim.status === 'REJECTED') stats.today.rejected++;
            else if (claim.status === 'SENT') stats.today.pending++;
          }

          // Check if claim was submitted this month
          if (new Date(claim.createdAt) >= thisMonthStart) {
            stats.thisMonth.submitted++;
            if (claim.status === 'APPROVED') stats.thisMonth.approved++;
            else if (claim.status === 'REJECTED') stats.thisMonth.rejected++;
            else if (claim.status === 'SENT') stats.thisMonth.pending++;
          }

          // Count for all time
          stats.allTime.submitted++;
          if (claim.status === 'APPROVED') stats.allTime.approved++;
          else if (claim.status === 'REJECTED') stats.allTime.rejected++;
          else if (claim.status === 'SENT') stats.allTime.pending++;
        });

        setClaimStats(stats);
      } catch (error) {
        console.error('Failed to fetch claim stats', error);
      }
    };

    fetchClaimStats();
  }, [jwt]);

  return (
    <div className="bg-base-300 ">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-semibold mb-6">Claims Overview</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(claimStats).map(([period, stats]) => (
            <div key={period} className="bg-slate-50 p-5 m-2 rounded-md flex justify-between items-center shadow">
              <div>
                <h3 className="font-bold">Claims ({period})</h3>
                <p className="text-gray-500">Approved: {stats.approved}</p>
                <p className="text-gray-500">Rejected: {stats.rejected}</p>
                <p className="text-gray-500">Pending: {stats.pending}</p>
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-chart-pie p-4 bg-gray-200 rounded-md">{stats.submitted}</i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
