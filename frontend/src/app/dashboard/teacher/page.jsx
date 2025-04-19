'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaChalkboardTeacher, FaUsers, FaVideo, FaComments, 
  FaRegChartBar, FaBook, FaPlusCircle, FaBell, FaCog,
  FaChevronRight, FaEdit, FaTrash, FaSpinner, FaUser
} from 'react-icons/fa';
import TeacherLayout from '../../components/layout/TeacherLayout';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:5000/api/auth';

// Get cookie function
const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  
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

// Component for course cards with edit/delete functionality
const CourseCard = ({ course, onEdit, onDelete }) => (
  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
    <div className="relative aspect-video">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
      <div className="absolute bottom-3 left-3 z-20 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
        <FaUsers className="mr-1" size={10} /> {course.students || 0}
      </div>
      <div className="absolute bottom-3 right-3 z-20 bg-gray-800/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
        <FaVideo className="mr-1" size={10} /> {course.videos || 0}
      </div>
      {course.thumbnail ? (
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover rounded-t-xl"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <FaBook className="text-gray-400 text-4xl" />
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{course.title}</h3>
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-xs">
          Last updated: {course.lastUpdated ? new Date(course.lastUpdated).toLocaleDateString() : 'N/A'}
        </span>
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(course)} 
            className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center"
          >
            <FaEdit className="mr-1" size={14} />
            Edit
          </button>
          <button 
            onClick={() => onDelete(course._id || course.id)} 
            className="text-red-600 text-sm font-medium hover:text-red-800 flex items-center"
          >
            <FaTrash className="mr-1" size={14} />
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  // Use the exact date and time requested
  const [currentDateTime] = useState('2025-04-19 09:39:45');
  // Use the exact user login requested  
  const [currentUser] = useState('ZainJ5');
  const router = useRouter();
  
  // Fetch teacher data from API
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        // Get user data from /me endpoint
        const userResponse = await axios.get(`${API_URL}/me`);
        const userData = userResponse.data;
        
        // Check if the user is a tutor/teacher
        if (userData.role !== 'tutor') {
          router.push('/dashboard/student');
          return;
        }
        
        // For demo purposes, we'll add some demo courses if there are none
        let teacherCourses = [];
        
        if (userData.courses && userData.courses.length > 0) {
          teacherCourses = userData.courses;
        } else {
          // Demo courses if no courses exist
          teacherCourses = [
            {
              _id: 1,
              title: 'Introduction to Programming',
              students: 145,
              videos: 12,
              lastUpdated: new Date().toISOString(),
            },
            {
              _id: 2,
              title: 'Web Development Fundamentals',
              students: 87,
              videos: 18,
              lastUpdated: new Date().toISOString(),
            },
            {
              _id: 3,
              title: 'Data Science Essentials',
              students: 212,
              videos: 15,
              lastUpdated: new Date().toISOString(),
            }
          ];
        }
        
        // Build complete teacher data
        const teacherData = {
          ...userData,
          name: userData.name,
          email: userData.email,
          title: userData.title || 'Instructor',
          institution: userData.institution || 'Online Academy',
          stats: {
            totalStudents: userData.totalStudents || 
              teacherCourses.reduce((total, course) => total + (course.students || 0), 0),
            totalCourses: teacherCourses.length,
          },
          courses: teacherCourses
        };
        
        setTeacher(teacherData);
      } catch (err) {
        console.error('Error fetching teacher data:', err);
        setError('Failed to load your dashboard data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [router]);

  const handleEditCourse = (course) => {
    // Navigate to course editor with course details
    router.push(`/dashboard/teacher/courses?edit=${course._id || course.id}`);
  };

  const handleDeleteCourse = (courseId) => {
    setCourseToDelete(courseId);
    setShowDeleteModal(true);
  };

  const confirmDeleteCourse = async () => {
    try {
      // In a real app, you would call an API to delete the course
      // await axios.delete(`${API_URL}/courses/${courseToDelete}`);
      
      // For demo purposes, we'll just update the state
      const updatedCourses = teacher.courses.filter(course => (course._id || course.id) !== courseToDelete);
      setTeacher({
        ...teacher,
        courses: updatedCourses,
        stats: {
          ...teacher.stats,
          totalCourses: updatedCourses.length
        }
      });
      
      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (err) {
      console.error('Error deleting course:', err);
      // Show error message
    }
  };
  
  if (loading) {
    return (
      <TeacherLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="animate-spin text-blue-600 mx-auto text-4xl mb-4" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </TeacherLayout>
    );
  }
  
  if (error || !teacher) {
    return (
      <TeacherLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center bg-red-50 p-8 rounded-lg max-w-md">
            <p className="text-red-600 mb-4">{error || "Couldn't load your data. Please make sure you're logged in."}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </TeacherLayout>
    );
  }
  
  return (
    <TeacherLayout>
      {/* Top bar with user info */}
      <div className="bg-white mb-6 p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {/* Replace next/image with div and icon to avoid domain issues */}
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <FaUser size={24} />
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-bold text-gray-800">{teacher.name}</h2>
              <p className="text-sm text-gray-600">{teacher.title} | {teacher.institution}</p>
              <p className="text-xs text-gray-500">{currentDateTime} • {currentUser}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dashboard header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {teacher.name.split(' ')[0]}! Here's what's happening with your courses.
        </p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-50 p-3 rounded-full">
              <FaUsers className="text-blue-600" size={20} />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mt-4">Total Students</h3>
          <div className="flex items-baseline mt-1">
            <p className="text-2xl font-bold text-gray-800">{teacher.stats.totalStudents.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-50 p-3 rounded-full">
              <FaBook className="text-blue-600" size={20} />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mt-4">Total Courses</h3>
          <div className="flex items-baseline mt-1">
            <p className="text-2xl font-bold text-gray-800">{teacher.stats.totalCourses}</p>
          </div>
        </div>
      </div>
      
      {/* Create Course Banner */}
      <div className="relative mb-8 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        <div className="relative z-10 p-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-white mb-2">Create a new course</h2>
              <p className="text-blue-100 max-w-lg">Add videos, and we'll automatically generate AI transcripts</p>
            </div>
            <Link href="/dashboard/teacher/courses?create=true" 
              className="px-6 py-3 bg-white text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center">
              <FaPlusCircle className="mr-2" />
              Create New Course
            </Link>
          </div>
        </div>
      </div>
      
      {/* Your Courses */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Your Courses</h2>
            <p className="text-sm text-gray-600 mt-1">Manage your current courses</p>
          </div>
          <Link href="/dashboard/teacher/courses" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
            View All <FaChevronRight className="ml-1" size={12} />
          </Link>
        </div>
        
        {teacher.courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacher.courses.map(course => (
              <CourseCard 
                key={course._id || course.id} 
                course={course} 
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <FaBook className="mx-auto text-gray-400 text-4xl mb-4" />
            <h3 className="font-medium text-gray-700 mb-2">No courses yet</h3>
            <p className="text-gray-500 mb-4">Create your first course to get started</p>
            <Link href="/dashboard/teacher/courses?create=true" 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-flex items-center">
              <FaPlusCircle className="mr-2" />
              Create a Course
            </Link>
          </div>
        )}
      </div>
      
      {/* Quick Access */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            href="/dashboard/teacher/chat"
            className="flex flex-col items-center bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors border border-gray-100"
          >
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <FaComments className="text-blue-600" size={20} />
            </div>
            <span className="text-sm font-medium text-gray-800">Chat Rooms</span>
          </Link>
          <Link 
            href="/dashboard/teacher/students"
            className="flex flex-col items-center bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors border border-gray-100"
          >
            <div className="bg-purple-100 p-3 rounded-full mb-3">
              <FaUsers className="text-purple-600" size={20} />
            </div>
            <span className="text-sm font-medium text-gray-800">View Enrollments</span>
          </Link>
          <Link 
            href="/dashboard/teacher/courses"
            className="flex flex-col items-center bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors border border-gray-100"
          >
            <div className="bg-orange-100 p-3 rounded-full mb-3">
              <FaBook className="text-orange-600" size={20} />
            </div>
            <span className="text-sm font-medium text-gray-800">Manage Content</span>
          </Link>
          <Link 
            href="/dashboard/teacher/videos/upload"
            className="flex flex-col items-center bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors border border-gray-100"
          >
            <div className="bg-green-100 p-3 rounded-full mb-3">
              <FaVideo className="text-green-600" size={20} />
            </div>
            <span className="text-sm font-medium text-gray-800">Upload Videos</span>
          </Link>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this course? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCourse}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </TeacherLayout>
  );
}