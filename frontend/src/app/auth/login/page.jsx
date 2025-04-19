'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaGraduationCap, FaChalkboardTeacher, FaExclamationCircle } from 'react-icons/fa';
import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:5000/api/auth';

// Set cookie function
const setCookie = (name, value, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

// Get cookie function
const getCookie = (name) => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};

// Configure axios with interceptor for auth headers
axios.interceptors.request.use(
  (config) => {
    const token = getCookie('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default function AuthForm() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [userType, setUserType] = useState('student'); // student or teacher
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentDateTime] = useState('2025-04-19 09:30:05');
  const [currentUser] = useState('ZainJ5');
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

  useEffect(() => {
    // Update signup data when userType changes
    setSignupData(prev => ({
      ...prev,
      role: userType === 'student' ? 'student' : 'tutor'
    }));
  }, [userType]);

  // Function to fetch user data using the /me endpoint
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/me`);
      // Store user data in localStorage for easy access
      localStorage.setItem('userData', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData({
      ...loginData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError(''); // Clear error when user types
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
    setError(''); // Clear error when user types
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: loginData.email,
        password: loginData.password
      });
      
      const { user, token } = response.data;
      
      // Store token in cookie (7 days for remember me, 1 day for session)
      const cookieDuration = loginData.rememberMe ? 7 : 1;
      setCookie('token', token, cookieDuration);
      
      // Store basic user info in localStorage for UI purposes
      localStorage.setItem('userBasicInfo', JSON.stringify({
        id: user._id,
        name: user.name,
        role: user.role
      }));

      // Fetch detailed user data using /me endpoint
      await fetchUserData();
      
      // Redirect based on user role
      if (user.role === 'tutor') {
        router.push('/dashboard/teacher');
      } else {
        router.push('/dashboard/student');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        role: signupData.role
      });
      
      const { user, token } = response.data;
      
      // Store token in cookie (7 days default for new registrations)
      setCookie('token', token, 7);
      
      // Store basic user info in localStorage for UI purposes
      localStorage.setItem('userBasicInfo', JSON.stringify({
        id: user._id,
        name: user.name,
        role: user.role
      }));

      // Fetch detailed user data using /me endpoint
      await fetchUserData();
      
      // Redirect based on user role
      if (user.role === 'tutor') {
        router.push('/dashboard/teacher');
      } else {
        router.push('/dashboard/student');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setAnimating(true);
    setError(''); // Clear any errors when toggling forms
    setTimeout(() => {
      setIsLogin(!isLogin);
      setAnimating(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div className="text-center">
          <Image
            src="/logo.svg"
            alt="EduConnect Logo"
            width={60}
            height={60}
            className="mx-auto"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {currentDateTime} • {currentUser}
          </p>
        </div>
        
        {/* Toggle Buttons */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            className={`w-1/2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isLogin ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-900'
            }`}
            onClick={() => isLogin ? null : toggleForm()}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`w-1/2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              !isLogin ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-900'
            }`}
            onClick={() => isLogin ? toggleForm() : null}
            type="button"
          >
            Sign Up
          </button>
        </div>
        
        <div className={`transition-all duration-300 ${animating ? 'opacity-0 transform translate-x-10' : 'opacity-100'}`}>
          {/* Display error message if there is one */}
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-center">
              <FaExclamationCircle className="mr-2" />
              {error}
            </div>
          )}
          
          {isLogin ? (
            // Login Form
            <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
              <div className="rounded-md shadow-sm space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="appearance-none rounded-md relative block w-full pl-10 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                  <div 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 
                      <FaEyeSlash className="h-5 w-5 text-gray-400" /> : 
                      <FaEye className="h-5 w-5 text-gray-400" />
                    }
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={loginData.rememberMe}
                    onChange={handleLoginChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          ) : (
            // Signup Form
            <form className="mt-8 space-y-6" onSubmit={handleSignupSubmit}>
              <div className="rounded-md shadow-sm space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={signupData.name}
                    onChange={handleSignupChange}
                    className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Full name"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={signupData.email}
                    onChange={handleSignupChange}
                    className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="signup-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={signupData.password}
                    onChange={handleSignupChange}
                    className="appearance-none rounded-md relative block w-full pl-10 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                  <div 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 
                      <FaEyeSlash className="h-5 w-5 text-gray-400" /> : 
                      <FaEye className="h-5 w-5 text-gray-400" />
                    }
                  </div>
                </div>
                
                {/* User Type Selection - Presented as "I want to..." */}
                <div className="mt-4">
                  <p className="mb-2 text-sm text-gray-700">I want to...</p>
                  <div className="flex space-x-4">
                    <div
                      className={`flex-1 cursor-pointer rounded-lg border ${
                        userType === 'student' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      } p-3 transition-colors`}
                      onClick={() => setUserType('student')}
                    >
                      <div className="flex flex-col items-center">
                        <FaGraduationCap className={`h-6 w-6 ${userType === 'student' ? 'text-blue-500' : 'text-gray-400'}`} />
                        <span className="mt-1 text-sm font-medium">Learn</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`flex-1 cursor-pointer rounded-lg border ${
                        userType === 'teacher' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      } p-3 transition-colors`}
                      onClick={() => setUserType('teacher')}
                    >
                      <div className="flex flex-col items-center">
                        <FaChalkboardTeacher className={`h-6 w-6 ${userType === 'teacher' ? 'text-blue-500' : 'text-gray-400'}`} />
                        <span className="mt-1 text-sm font-medium">Teach</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </div>
              
              <p className="text-xs text-center text-gray-500">
                By signing up, you agree to our{' '}
                <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}