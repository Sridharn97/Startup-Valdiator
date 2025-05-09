import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, MessageSquare, Edit, Trash } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import toast from 'react-hot-toast';

const IdeaCard = ({ idea, onVote, onDelete, showActions = true }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleVote = async (voteType) => {
    if (!isAuthenticated) {
      toast.error('Please login to vote on ideas');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`/api/ideas/${idea._id}/vote`, { voteType });
      onVote(idea._id, response.data.votes);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to vote');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      try {
        await axios.delete(`/api/ideas/${idea._id}`);
        onDelete(idea._id);
        toast.success('Idea deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete idea');
      }
    }
  };

  // Convert date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Generate badge color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:shadow-lg">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 hover:text-blue-600 transition">
              <Link to={`/ideas/${idea._id}`}>{idea.title}</Link>
            </h3>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span>By {idea.user?.username || 'Anonymous'}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(idea.createdAt)}</span>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(idea.status)}`}>
            {idea.status}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">{idea.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {idea.category && (
            <span className="text-xs font-semibold bg-blue-100 text-blue-800 rounded-full px-3 py-1">
              {idea.category}
            </span>
          )}
          {idea.techStack && idea.techStack.map((tech, index) => (
            <span key={index} className="text-xs font-semibold bg-purple-100 text-purple-800 rounded-full px-3 py-1">
              {tech}
            </span>
          ))}
        </div>

        {showActions && (
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="flex space-x-4">
              <button
                onClick={() => handleVote('up')}
                disabled={loading}
                className={`flex items-center space-x-1 text-gray-500 hover:text-green-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{idea.votes?.up || 0}</span>
              </button>
              <button
                onClick={() => handleVote('down')}
                disabled={loading}
                className={`flex items-center space-x-1 text-gray-500 hover:text-red-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ThumbsDown className="h-4 w-4" />
                <span>{idea.votes?.down || 0}</span>
              </button>
              <Link
                to={`/ideas/${idea._id}`}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Discuss</span>
              </Link>
            </div>

            {isAuthenticated && user?._id === idea.user?._id && (
              <div className="flex space-x-2">
                <Link
                  to={`/dashboard/edit/${idea._id}`}
                  className="text-gray-500 hover:text-blue-600 transition"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <button
                  onClick={handleDelete}
                  className="text-gray-500 hover:text-red-600 transition"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaCard;