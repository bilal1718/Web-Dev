'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaChalkboardTeacher, FaUsers, FaVideo, FaComments, 
  FaRegChartBar, FaBook, FaPlusCircle, FaBell, FaCog,
  FaChevronRight, FaEdit, FaTrash
} from 'react-icons/fa';
import TeacherLayout from '../../components/layout/TeacherLayout';
import { useRouter } from 'next/navigation';

// Simplified teacher data with only essential features
const teacherData = {
  name: 'Professor Chad Johnson',
  avatar: '/images/teachers/chad.jpg',
  title: 'Computer Science Professor',
  institution: 'Digital University',
  stats: {
    totalStudents: 1258,
    totalCourses: 8,
  },
  courses: [
    {
      id: 1,
      title: 'Introduction to Python Programming',
      thumbnail: '/images/courses/python.jpg',
      students: 345,
      videos: 24,
      lastUpdated: '2025-03-28',
    },
    {
      id: 2,
      title: 'Data Structures and Algorithms',
      thumbnail: '/images/courses/data-structures.jpg',
      students: 287,
      videos: 32,
      lastUpdated: '2025-02-15',
    },
    {
      id: 3,
      title: 'Machine Learning Fundamentals',
      thumbnail: '/images/courses/ml-basics.jpg',
      students: 412,
      videos: 18,
      lastUpdated: '2025-04-05',
    },
    {
      id: 4,
      title: 'Advanced Web Development',
      thumbnail: '/images/courses/web-dev.jpg',
      students: 214,
      videos: 13,
      lastUpdated: '2025-01-20',
    },
  ]
};

// Component for course cards with edit/delete functionality
const CourseCard = ({ course, onEdit, onDelete }) => (
  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
    <div className="relative aspect-video">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
      <div className="absolute bottom-3 left-3 z-20 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
        <FaUsers className="mr-1" size={10} /> {course.students}
      </div>
      <div className="absolute bottom-3 right-3 z-20 bg-gray-800/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
        <FaVideo className="mr-1" size={10} /> {course.videos}
      </div>
      <Image
        src={course.thumbnail}
        alt={course.title}
        layout="fill"
        objectFit="cover"
        className="rounded-t-xl"
      />
    </div>
    <div className="p-4">
      <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{course.title}</h3>
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-xs">Last updated: {new Date(course.lastUpdated).toLocaleDateString()}</span>
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(course)} 
            className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center"
          >
            <FaEdit className="mr-1" size={14} />
            Edit
          </button>
          <button 
            onClick={() => onDelete(course.id)} 
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
  const [teacher, setTeacher] = useState(teacherData);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const router = useRouter();
  
  // Here you would fetch actual teacher data
  useEffect(() => {
    // API call would go here in a real application
    // setTeacher(data)
  }, []);

  const handleEditCourse = (course) => {
    // Navigate to course editor with course details
    router.push(`/dashboard/teacher/courses?edit=${course.id}`);
  };

  const handleDeleteCourse = (courseId) => {
    setCourseToDelete(courseId);
    setShowDeleteModal(true);
  };

  const confirmDeleteCourse = () => {
    // In a real app, you would call an API to delete the course
    const updatedCourses = teacher.courses.filter(course => course.id !== courseToDelete);
    setTeacher({
      ...teacher,
      courses: updatedCourses,
      stats: {
        ...teacher.stats,
        totalCourses: teacher.stats.totalCourses - 1
      }
    });
    setShowDeleteModal(false);
    setCourseToDelete(null);
  };
  
  return (
    <TeacherLayout>
      {/* Top bar with user info */}
      <div className="bg-white mb-6 p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src={teacher.avatar}
              alt={teacher.name}
              width={48}
              height={48}
              className="rounded-full border-2 border-blue-100"
            />
            <div className="ml-3">
              <h2 className="text-lg font-bold text-gray-800">{teacher.name}</h2>
              <p className="text-sm text-gray-600">{teacher.title} | {teacher.institution}</p>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teacher.courses.map(course => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
            />
          ))}
        </div>
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