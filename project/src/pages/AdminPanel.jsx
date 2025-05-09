import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Eye, Check, X, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Pending');

  useEffect(() => {
    fetchIdeas();
  }, [statusFilter]);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') {
        params.status = statusFilter;
      }
      
      const response = await axios.get('/api/admin/ideas', { params });
      setIdeas(response.data);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      toast.error('Failed to load ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ideaId, status) => {
    try {
      await axios.put(`/api/admin/ideas/${ideaId}/status`, { status });
      
      // Update idea in state
      setIdeas(ideas.map(idea => 
        idea._id === ideaId 
          ? { ...idea, status } 
          : idea
      ));
      
      toast.success(`Idea marked as ${status}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteIdea = async (ideaId) => {
    if (window.confirm('Are you sure you want to delete this idea? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/admin/ideas/${ideaId}`);
        setIdeas(ideas.filter(idea => idea._id !== ideaId));
        toast.success('Idea deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete idea');
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Manage Ideas</h2>
            
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border-0 bg-transparent font-medium text-gray-600 focus:ring-0 focus:outline-none"
              >
                <option value="All">All Ideas</option>
                <option value="Pending">Pending Ideas</option>
                <option value="Approved">Approved Ideas</option>
                <option value="Rejected">Rejected Ideas</option>
              </select>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : ideas.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No ideas found</h3>
            <p className="text-gray-500">
              {statusFilter === 'All' 
                ? 'There are no ideas in the system yet.' 
                : `There are no ${statusFilter.toLowerCase()} ideas at the moment.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Idea
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ideas.map(idea => (
                  <tr key={idea._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {idea.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {idea.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {idea.user?.username || 'Anonymous'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(idea.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${idea.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                          idea.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {idea.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link
                          to={`/ideas/${idea._id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Idea"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        
                        {idea.status !== 'Approved' && (
                          <button
                            onClick={() => handleStatusChange(idea._id, 'Approved')}
                            className="text-green-600 hover:text-green-900"
                            title="Approve Idea"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                        )}
                        
                        {idea.status !== 'Rejected' && (
                          <button
                            onClick={() => handleStatusChange(idea._id, 'Rejected')}
                            className="text-red-600 hover:text-red-900"
                            title="Reject Idea"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteIdea(idea._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Idea"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;