'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaGraduationCap, FaChalkboardTeacher, FaExclamationCircle } from 'react-icons/fa';

// Fixed credentials for testing
const DEMO_CREDENTIALS = {
  student: {
    email: 'student@example.com',
    password: 'student123'
  },
  teacher: {
    email: 'teacher@example.com',
    password: 'teacher123'
  }
};

export default function AuthForm() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [userType, setUserType] = useState('student'); // student or teacher
  const [error, setError] = useState('');
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'student'
  });

  useEffect(() => {
    // Update signup data when userType changes
    setSignupData(prev => ({
      ...prev,
      userType: userType
    }));
  }, [userType]);

  // For demonstration: Auto-fill credentials when "Use Demo Credentials" is clicked
  const fillDemoCredentials = (type) => {
    setLoginData({
      email: DEMO_CREDENTIALS[type].email,
      password: DEMO_CREDENTIALS[type].password,
      rememberMe: false
    });
    setError('');
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
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    // Check credentials
    if (loginData.email === DEMO_CREDENTIALS.student.email && 
        loginData.password === DEMO_CREDENTIALS.student.password) {
      // Redirect to student dashboard
      router.push('/dashboard/student');
    } 
    else if (loginData.email === DEMO_CREDENTIALS.teacher.email && 
             loginData.password === DEMO_CREDENTIALS.teacher.password) {
      // Redirect to teacher dashboard
      router.push('/dashboard/teacher');
    } 
    else {
      // Show error message
      setError('Invalid email or password');
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    console.log('Signup form submitted:', signupData);
    
    // For demo purposes, redirect to the appropriate dashboard
    if (signupData.userType === 'teacher') {
      router.push('/dashboard/teacher');
    } else {
      router.push('/dashboard/student');
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
        
        {/* Demo Credentials Notice */}
        {isLogin && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
            <p className="font-medium mb-1">Demo Credentials:</p>
            <div className="flex flex-col space-y-1 mb-2">
              <button 
                type="button"
                onClick={() => fillDemoCredentials('student')}
                className="text-blue-600 hover:underline text-left"
              >
                Student: student@example.com / student123
              </button>
              <button 
                type="button"
                onClick={() => fillDemoCredentials('teacher')}
                className="text-blue-600 hover:underline text-left"
              >
                Teacher: teacher@example.com / teacher123
              </button>
            </div>
          </div>
        )}
        
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
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign in
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
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create account
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