import React, { useState, useEffect } from 'react';
import { X, Plus, ChevronDown } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'SaaS', 'E-commerce', 'Mobile App', 'FinTech', 'HealthTech', 
  'EdTech', 'Social Media', 'AI/ML', 'IoT', 'Other'
];

const TECH_OPTIONS = [
  'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js',
  'Node.js', 'Python', 'Django', 'Flask', 'Ruby on Rails',
  'PHP', 'Laravel', 'Java', 'Spring Boot', '.NET',
  'C#', 'Go', 'Rust', 'AWS', 'Azure',
  'GCP', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
  'Docker', 'Kubernetes', 'Blockchain', 'Machine Learning', 'Other'
];

const IdeaForm = ({ idea = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    techStack: []
  });
  const [techInput, setTechInput] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showTechSuggestions, setShowTechSuggestions] = useState(false);

  useEffect(() => {
    if (idea) {
      setFormData({
        title: idea.title || '',
        description: idea.description || '',
        category: idea.category || '',
        techStack: idea.techStack || []
      });
    }
  }, [idea]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleTechInputChange = (e) => {
    setTechInput(e.target.value);
    setShowTechSuggestions(true);
  };

  const handleTechInputKeyDown = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      addTech(techInput.trim());
    }
  };

  const addTech = (tech) => {
    if (tech && !formData.techStack.includes(tech)) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, tech]
      });
      setTechInput('');
      setErrors({
        ...errors,
        techStack: ''
      });
    }
  };

  const handleRemoveTech = (tech) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter(t => t !== tech)
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length > 100) newErrors.title = 'Title must be 100 characters or less';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.length > 2000) newErrors.description = 'Description must be 2000 characters or less';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.techStack.length === 0) newErrors.techStack = 'At least one technology is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (idea) {
        await axios.put(`/api/ideas/${idea._id}`, formData);
        toast.success('Idea updated successfully!');
      } else {
        await axios.post('/api/ideas', formData);
        toast.success('Idea submitted successfully!');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save idea');
    } finally {
      setLoading(false);
    }
  };

  const filteredTechOptions = TECH_OPTIONS.filter(tech => 
    tech.toLowerCase().includes(techInput.toLowerCase()) && 
    !formData.techStack.includes(tech)
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {idea ? 'Edit Idea' : 'Share Your Idea'}
      </h2>

      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="A catchy name for your idea"
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition ${
            errors.title ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
          }`}
        />
        <div className="flex justify-between mt-1">
          {errors.title ? (
            <p className="text-sm text-red-600">{errors.title}</p>
          ) : (
            <p className="text-xs text-gray-500">Max 100 characters</p>
          )}
          <span className="text-xs text-gray-400">
            {formData.title.length}/100
          </span>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your idea in detail. What problem does it solve? Who is it for?"
          rows="6"
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition ${
            errors.description ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
          }`}
        ></textarea>
        <div className="flex justify-between mt-1">
          {errors.description ? (
            <p className="text-sm text-red-600">{errors.description}</p>
          ) : (
            <p className="text-xs text-gray-500">Be as detailed as possible</p>
          )}
          <span className="text-xs text-gray-400">
            {formData.description.length}/2000
          </span>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition ${
              errors.category ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
        </div>
        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
      </div>

      <div className="mb-8">
        <label htmlFor="techStack" className="block text-sm font-medium text-gray-700 mb-2">
          Technologies <span className="text-red-500">*</span>
        </label>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.techStack.map(tech => (
            <span 
              key={tech} 
              className="inline-flex items-center bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full border border-blue-100"
            >
              {tech}
              <button 
                type="button" 
                onClick={() => handleRemoveTech(tech)}
                className="ml-1.5 text-blue-500 hover:text-blue-700 rounded-full p-0.5 hover:bg-blue-100 transition"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
        
        <div className="relative">
          <div className="flex shadow-sm">
            <input
              type="text"
              id="techInput"
              value={techInput}
              onChange={handleTechInputChange}
              onKeyDown={handleTechInputKeyDown}
              onFocus={() => setShowTechSuggestions(true)}
              placeholder="Search or type technology..."
              className={`flex-grow px-4 py-2.5 rounded-l-lg border focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition ${
                errors.techStack ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => {
                if (techInput.trim()) {
                  addTech(techInput.trim());
                }
              }}
              className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          
          {showTechSuggestions && techInput && filteredTechOptions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {filteredTechOptions.slice(0, 10).map(tech => (
                <div
                  key={tech}
                  onClick={() => {
                    addTech(tech);
                    setShowTechSuggestions(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition"
                >
                  <span className="text-sm text-gray-700">{tech}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {errors.techStack && <p className="mt-1 text-sm text-red-600">{errors.techStack}</p>}
        
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2 font-medium">Popular technologies:</p>
          <div className="flex flex-wrap gap-2">
            {TECH_OPTIONS.slice(0, 8).map(tech => (
              <button
                key={tech}
                type="button"
                onClick={() => {
                  addTech(tech);
                  setTechInput('');
                }}
                disabled={formData.techStack.includes(tech)}
                className={`text-xs px-3 py-1.5 rounded-md transition ${
                  formData.techStack.includes(tech) 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition ${
            loading ? 'opacity-80 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <span className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {idea ? 'Updating...' : 'Submitting...'}
            </span>
          ) : idea ? 'Update Idea' : 'Submit Idea'}
        </button>
      </div>
    </form>
  );
};

export default IdeaForm;