'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlay, FaCheck, FaSpinner, FaBook } from 'react-icons/fa';
import StudentLayout from '../../../components/layout/StudentLayout';
import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:5000/api';

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

export default function StudentLearningsPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Current date and time in the exact format requested
  const currentDateTime = "2025-04-19 10:37:28";
  const currentUser = "ZainJ5";
  
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the correct endpoint based on your server code
        const enrollmentResponse = await axios.get(`${API_URL}/enroll/my`);
        console.log('Enrollment data:', enrollmentResponse.data);
        
        // If we get here, we have enrollment data
        const enrollments = enrollmentResponse.data;
        
        // Transform the enrollment data to match our UI structure
        let formattedCourses = [];
        
        if (Array.isArray(enrollments) && enrollments.length > 0) {
          // Process each enrollment to get course details
          formattedCourses = await Promise.all(enrollments.map(async (enrollment) => {
            const course = enrollment.course || {};
            
            // Calculate progress from the data we have
            const watchedVideos = enrollment.progress?.completedVideos?.length || 0;
            
            // Try to get total videos count
            let totalVideos = 0;
            let courseDetails = {};
            
            try {
              // Fetch course details if not already populated
              if (!course.title) {
                const courseResponse = await axios.get(`${API_URL}/courses/${enrollment.course}`);
                courseDetails = courseResponse.data;
              } else {
                courseDetails = course;
              }
              
              // Try to get videos for the course
              const videosResponse = await axios.get(`${API_URL}/courses/${enrollment.course}/videos`);
              totalVideos = videosResponse.data.length;
            } catch (err) {
              console.error('Error fetching additional course data:', err);
              totalVideos = 20; // Fallback value
            }
            
            // If we couldn't get the total videos, use the completed ones or a fallback
            if (totalVideos === 0) {
              totalVideos = Math.max(watchedVideos, 10);
            }
            
            // Calculate progress percentage
            const progress = totalVideos > 0 ? Math.round((watchedVideos / totalVideos) * 100) : 0;
            
            // Get instructor name if available
            let instructorName = "Instructor";
            let instructorAvatar = "/images/teachers/default.jpg";
            
            if (courseDetails.tutor) {
              try {
                const tutorResponse = await axios.get(`${API_URL}/auth/${courseDetails.tutor}`);
                instructorName = tutorResponse.data.tutor?.name || "Instructor";
                instructorAvatar = tutorResponse.data.tutor?.avatar || "/images/teachers/default.jpg";
              } catch (err) {
                console.error('Error fetching tutor data:', err);
              }
            }
            
            // Get the last watched video if applicable
            let lastWatched = "Start learning";
            
            if (watchedVideos > 0 && enrollment.progress?.completedVideos?.length > 0) {
              try {
                const lastVideoId = enrollment.progress.completedVideos[watchedVideos - 1];
                const videoResponse = await axios.get(`${API_URL}/videos/${lastVideoId}`);
                lastWatched = videoResponse.data.title || "Continue learning";
              } catch (err) {
                console.error('Error fetching last watched video:', err);
                lastWatched = "Continue your course";
              }
            }
          }));
        }
        
        setCourses(formattedCourses);
      } catch (err) {
        console.error('Error fetching enrollments:', err);
        setError('Unable to load your enrolled courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEnrollments();
  }, []);
  
  return (
    <StudentLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Enrolled Courses</h1>
        <div className="text-sm text-gray-600">
          Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): {currentDateTime}<br />
          Current User's Login: {currentUser}
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FaSpinner className="mx-auto h-8 w-8 text-blue-600 animate-spin" />
            <p className="mt-2 text-gray-600">Loading your courses...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
          >
            Try again
          </button>
        </div>
      ) : courses.length > 0 ? (
        <div className="space-y-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/4 relative">
                  <div className="h-48 md:h-full relative">
                    {/* Use a div with background image for simplicity */}
                    <div 
                      className="w-full h-full bg-cover bg-center flex items-center justify-center"
                      style={{ 
                        backgroundImage: `url(${course.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {/* Fallback icon if image fails */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                        <FaBook className="text-gray-600 text-4xl" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 md:w-3/4">
                  <h2 className="text-xl font-bold">{course.title}</h2>
                  <p className="text-gray-600 mt-1">{course.description}</p>
                  
                  <div className="flex items-center mt-3">
                    <div 
                      className="w-6 h-6 rounded-full mr-2 bg-cover bg-center bg-gray-200 flex items-center justify-center"
                      style={{ 
                        backgroundImage: `url(${course.instructor.avatar})`,
                        backgroundSize: 'cover'
                      }}
                    >
                      <span className="text-xs opacity-0">
                        {course.instructor.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">{course.instructor.name}</span>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Your progress</span>
                      <span>{course.progress}% complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          course.progress === 100 
                            ? 'bg-green-500' 
                            : 'bg-blue-600'
                        }`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {course.watchedVideos} of {course.totalVideos} videos completed
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6">
                    <div className="text-gray-600 text-sm">
                      {course.progress === 100 ? (
                        <div className="flex items-center text-green-600">
                          <FaCheck className="mr-2" />
                          Course completed!
                        </div>
                      ) : (
                        <div>
                          Last watched: <span className="font-medium">{course.lastWatched}</span>
                        </div>
                      )}
                    </div>
                    
                    <Link
                      href={`/dashboard/student/course/${course.id}`}
                      className={`px-4 py-2 rounded-md flex items-center ${
                        course.progress === 100 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {course.progress === 100 ? (
                        <>Review Course</>
                      ) : (
                        <>
                          <FaPlay className="mr-2" size={14} />
                          Continue Learning
                        </>
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-500 mb-6">
            You haven't enrolled in any courses yet. Browse our catalog to find courses that interest you.
          </p>
          <Link
            href="/courses"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Browse Courses
          </Link>
        </div>
      )}
    </StudentLayout>
  );
}