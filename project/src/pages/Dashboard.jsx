import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlusCircle, Lightbulb } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import IdeaForm from '../components/ideas/IdeaForm';
import IdeaCard from '../components/ideas/IdeaCard';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentIdea, setCurrentIdea] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchUserIdeas();
  }, [user]);

  useEffect(() => {
    // If we're editing (came from a route like /dashboard/edit/:id)
    const pathParts = window.location.pathname.split('/');
    if (pathParts.includes('edit') && pathParts.length > 3) {
      const editIdea = ideas.find(idea => idea._id === pathParts[3]);
      if (editIdea) {
        setCurrentIdea(editIdea);
        setEditing(true);
        setShowForm(true);
      } else if (ideas.length > 0) {
        // Only fetch the idea to edit if we have already loaded the user's ideas
        fetchIdeaToEdit(pathParts[3]);
      }
    }
  }, [window.location.pathname, ideas]);

  const fetchUserIdeas = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/ideas/user/ideas');
      setIdeas(response.data);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      toast.error('Failed to load your ideas');
    } finally {
      setLoading(false);
    }
  };

  const fetchIdeaToEdit = async (ideaId) => {
    try {
      const response = await axios.get(`/api/ideas/${ideaId}`);
      if (response.data.user._id === user._id) {
        setCurrentIdea(response.data);
        setEditing(true);
        setShowForm(true);
      } else {
        toast.error("You don't have permission to edit this idea");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching idea to edit:', error);
      toast.error('Failed to load idea for editing');
      navigate('/dashboard');
    }
  };

  const handleNewIdea = () => {
    setCurrentIdea(null);
    setEditing(false);
    setShowForm(true);
  };

  const handleEditIdea = (idea) => {
    setCurrentIdea(idea);
    setEditing(true);
    setShowForm(true);
    // Update URL without full page reload
    window.history.pushState({}, '', `/dashboard/edit/${idea._id}`);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setCurrentIdea(null);
    setEditing(false);
    fetchUserIdeas();
    // Reset URL if we were editing
    if (editing) {
      window.history.pushState({}, '', '/dashboard');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setCurrentIdea(null);
    setEditing(false);
    // Reset URL if we were editing
    if (editing) {
      window.history.pushState({}, '', '/dashboard');
    }
  };

  const handleDeleteIdea = async (ideaId) => {
    try {
      await axios.delete(`/api/ideas/${ideaId}`);
      setIdeas(ideas.filter(idea => idea._id !== ideaId));
      toast.success('Idea deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete idea');
    }
  };

  // Generate a label based on idea status
  const getStatusLabel = (status) => {
    switch (status) {
      case 'Approved':
        return 'text-green-800';
      case 'Rejected':
        return 'text-red-800';
      default:
        return 'text-yellow-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {showForm ? (
            editing ? 'Edit Idea' : 'Submit New Idea'
          ) : (
            'Your Dashboard'
          )}
        </h1>
        
        {!showForm && (
          <button
            onClick={handleNewIdea}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition shadow-sm"
          >
            <PlusCircle className="h-5 w-5" />
            <span>New Idea</span>
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <IdeaForm 
            idea={currentIdea} 
            onSuccess={handleFormSuccess} 
            onCancel={handleFormCancel}
          />
        </div>
      ) : (
        <div>
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : ideas.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Lightbulb className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No Ideas Yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't submitted any startup ideas yet. Have a brilliant idea? Submit it now!
              </p>
              <button
                onClick={handleNewIdea}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition shadow-md"
              >
                <PlusCircle className="h-5 w-5" />
                <span>Submit Your First Idea</span>
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Ideas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ideas.map(idea => (
                  <div 
                    key={idea._id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                  >
                    <IdeaCard 
                      idea={idea} 
                      onDelete={handleDeleteIdea}
                      showActions={false}
                    />
                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
                      <div className={`text-sm font-medium ${getStatusLabel(idea.status)}`}>
                        Status: {idea.status}
                      </div>
                      <button
                        onClick={() => handleEditIdea(idea)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Edit Idea
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;