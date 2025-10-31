import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, PlusCircle } from 'lucide-react';
import axios from '../axiosConfig';

import IdeaCard from '../components/ideas/IdeaCard';
import AuthContext from '../context/AuthContext';

const CATEGORIES = [
  'All', 'SaaS', 'E-commerce', 'Mobile App', 'FinTech', 'HealthTech', 
  'EdTech', 'Social Media', 'AI/ML', 'IoT', 'Other'
];

const Home = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      fetchIdeas();
    }
  }, [selectedCategory, isAuthenticated]);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      params.status = 'Approved';
      
      const response = await axios.get('/api/ideas', { params });
      setIdeas(response.data);
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleVote = (ideaId, newVotes) => {
    setIdeas(prevIdeas => 
      prevIdeas.map(idea => 
        idea._id === ideaId 
          ? { ...idea, votes: newVotes } 
          : idea
      )
    );
  };

  const filteredIdeas = ideas
    .filter(idea => 
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (idea.techStack && idea.techStack.some(tech => 
        tech.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'most-upvoted') {
        return (b.votes?.up || 0) - (a.votes?.up || 0);
      } else if (sortBy === 'most-downvoted') {
        return (b.votes?.down || 0) - (a.votes?.down || 0);
      }
      return 0;
    });

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4 rounded-lg mb-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Validate Your Startup Ideas With Real Feedback
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Get honest opinions, valuable insights, and connect with potential users and collaborators.
          </p>
          {isAuthenticated ? (
            <Link 
              to="/dashboard" 
              className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-blue-50 transition-colors shadow-md"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Submit Your Idea
            </Link>
          ) : (
            <Link 
              to="/register" 
              className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-blue-50 transition-colors shadow-md"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      {isAuthenticated && (
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-auto order-2 md:order-1">
              <div className="flex space-x-2 overflow-x-auto py-2 md:py-0">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex w-full md:w-auto space-x-2 order-1 md:order-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search ideas..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="most-upvoted">Most Upvoted</option>
                  <option value="most-downvoted">Most Downvoted</option>
                </select>
                <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ideas List */}
      {!isAuthenticated ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Please log in to view ideas</h3>
          <p className="text-gray-500 mb-4">You need to be logged in to browse and interact with ideas.</p>
          <Link 
            to="/login" 
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
          >
            Log In
          </Link>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredIdeas.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas found</h3>
          <p className="text-gray-500 mb-4">Try changing your search or filters</p>
          {isAuthenticated && (
            <Link 
              to="/dashboard" 
              className="inline-flex items-center text-blue-600 font-medium hover:underline"
            >
              <PlusCircle className="mr-1 h-4 w-4" />
              Submit a new idea
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeas.map(idea => (
            <IdeaCard 
              key={idea._id} 
              idea={idea} 
              onVote={handleVote}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;