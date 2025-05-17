import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Password validation criteria
  const passwordCriteria = [
    { label: 'At least 6 characters', test: (pass) => pass.length >= 6 },
    { label: 'Contains a number', test: (pass) => /\d/.test(pass) },
    { label: 'Contains a letter', test: (pass) => /[a-zA-Z]/.test(pass) },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const failedCriteria = passwordCriteria.filter(
        criterion => !criterion.test(formData.password)
      );
      
      if (failedCriteria.length > 0) {
        newErrors.password = 'Password does not meet the requirements';
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        adminCode: formData.adminCode
      });
      
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      
      if (errorMessage === 'User already exists') {
        setErrors({
          ...errors,
          email: 'This email is already registered',
        });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-6 px-8">
          <h2 className="text-2xl font-bold text-white">Join StartupValidator</h2>
          <p className="text-blue-100">Create your account to get started</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-5">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Choose a username"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>
          
          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          
          <div className="mb-5">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            <div className="mt-2 space-y-1">
              {passwordCriteria.map((criterion, index) => (
                <div key={index} className="flex items-center text-sm">
                  {criterion.test(formData.password) ? (
                    <Check className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <X className="h-4 w-4 text-gray-300 mr-1" />
                  )}
                  <span className={criterion.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                    {criterion.label}
                  </span>
                </div>
              ))}
            </div>
            
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700">
                Admin Code (Optional)
              </label>
              <button
                type="button"
                onClick={() => setIsAdmin(!isAdmin)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {isAdmin ? 'Hide' : 'Register as Admin?'}
              </button>
            </div>
            {isAdmin && (
              <input
                type="password"
                id="adminCode"
                name="adminCode"
                value={formData.adminCode}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter admin code"
              />
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition duration-200 shadow-sm"
          >
            Create Account
          </button>
          
          <div className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;