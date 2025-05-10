import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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
    techStack: [],
    isPrivate: false
  });
  const [techInput, setTechInput] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Load idea data if editing
  useEffect(() => {
    if (idea) {
      setFormData({
        title: idea.title || '',
        description: idea.description || '',
        category: idea.category || '',
        techStack: idea.techStack || [],
        isPrivate: idea.isPrivate || false
      });
    }
  }, [idea]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleTechInputChange = (e) => {
    setTechInput(e.target.value);
  };

  const handleTechInputKeyDown = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!formData.techStack.includes(techInput.trim())) {
        setFormData({
          ...formData,
          techStack: [...formData.techStack, techInput.trim()]
        });
      }
      setTechInput('');
    }
  };

  const handleAddTech = (tech) => {
    if (!formData.techStack.includes(tech)) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, tech]
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
        // Update existing idea
        await axios.put(`/api/ideas/${idea._id}`, formData);
        toast.success('Idea updated successfully!');
      } else {
        // Create new idea
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

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter a catchy title for your idea"
          className={`w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your startup idea in detail..."
          rows="5"
          className={`w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
        ></textarea>
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category *
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="techStack" className="block text-sm font-medium text-gray-700 mb-1">
          Tech Stack *
        </label>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {formData.techStack.map(tech => (
            <span key={tech} className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center">
              {tech}
              <button 
                type="button" 
                onClick={() => handleRemoveTech(tech)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            id="techInput"
            value={techInput}
            onChange={handleTechInputChange}
            onKeyDown={handleTechInputKeyDown}
            placeholder="Type and press Enter to add technology"
            className={`flex-grow p-2 border rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.techStack ? 'border-red-500' : 'border-gray-300'}`}
          />
          <button
            type="button"
            onClick={() => {
              if (techInput.trim()) {
                handleAddTech(techInput.trim());
                setTechInput('');
              }
            }}
            className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        {errors.techStack && <p className="mt-1 text-sm text-red-600">{errors.techStack}</p>}
        
        <div className="mt-3">
          <p className="text-sm text-gray-600 mb-2">Suggested technologies:</p>
          <div className="flex flex-wrap gap-2">
            {TECH_OPTIONS.slice(0, 15).map(tech => (
              <button
                key={tech}
                type="button"
                onClick={() => handleAddTech(tech)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1 px-2 rounded-md transition"
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isPrivate"
            checked={formData.isPrivate}
            onChange={handleChange}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-sm text-gray-600">
            Make this idea private (only visible to you until approved)
          </span>
        </label>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Saving...' : idea ? 'Update Idea' : 'Submit Idea'}
        </button>
      </div>
    </form>
  );
};

export default IdeaForm;