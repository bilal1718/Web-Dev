'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  FaUsers, FaVideo, FaEdit, FaTrash, FaPlus, 
  FaArrowLeft, FaSave, FaTimes, FaUpload, FaDollarSign
} from 'react-icons/fa';
import TeacherLayout from '../../../components/layout/TeacherLayout';
import axios from 'axios';

// Empty course template for new course creation
const emptyCourse = {
  _id: null,
  title: '',
  description: '',
  thumbnail: '/images/courses/placeholder.jpg',
  price: 0,
  isPremium: false,
  students: 0,
  videos: 0,
};

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Configure axios with auth interceptor
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Course card component with edit/delete actions
const CourseCard = ({ course, onEdit, onDelete }) => (
  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
    <div className="relative aspect-video">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
      <div className="absolute bottom-3 left-3 z-20 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
        <FaUsers className="mr-1" size={10} /> {course.students || 0}
      </div>
      <div className="absolute bottom-3 right-3 z-20 bg-gray-800/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
        <FaVideo className="mr-1" size={10} /> {course.videos || 0}
      </div>
      {course.isPremium && (
        <div className="absolute top-3 right-3 z-20 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
          <FaDollarSign className="mr-1" size={10} /> Premium
        </div>
      )}
      <Image
        src={course.thumbnail}
        alt={course.title}
        layout="fill"
        objectFit="cover"
        className="rounded-t-xl"
      />
    </div>
    <div className="p-4">
      <h3 className="font-medium text-gray-900 mb-1">{course.title}</h3>
      <p className="text-gray-500 text-sm mb-3 line-clamp-2">{course.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-gray-700 font-medium">${course.price || 0}</span>
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(course)} 
            className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center"
          >
            <FaEdit className="mr-1" size={14} />
            Edit
          </button>
          <button 
            onClick={() => onDelete(course._id)} 
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

// Course form component for creating/editing courses
const CourseForm = ({ course, onSave, onCancel }) => {
  const [formData, setFormData] = useState(course);
  const [thumbnailPreview, setThumbnailPreview] = useState(course.thumbnail);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) : value 
    });
  };

  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
        setFormData({ ...formData, thumbnailFile: file, thumbnail: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Create form data for file upload
      const courseData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'thumbnailFile' && key !== '_id') {
          courseData.append(key, formData[key]);
        }
      });
      
      // Add the thumbnail file if it exists
      if (formData.thumbnailFile) {
        courseData.append('thumbnail', formData.thumbnailFile);
      }
      
      await onSave(formData, courseData);
    } catch (err) {
      setError(err.message || 'An error occurred while saving the course');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        {course._id ? 'Edit Course' : 'Create New Course'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Course Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course title"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course description"
            rows={4}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Thumbnail</label>
          <div className="flex items-start space-x-4">
            <div className="relative aspect-video w-1/4 min-w-[120px] border border-gray-200 rounded-lg overflow-hidden">
              <Image
                src={thumbnailPreview}
                alt="Course thumbnail"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div>
              <label className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200">
                <FaUpload className="mr-2" />
                Upload New Thumbnail
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Recommended size: 1280x720px (16:9 ratio)
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
          
          <div className="flex items-center h-full pt-8">
            <label className="flex items-center text-gray-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                name="isPremium"
                checked={formData.isPremium}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mr-2"
              />
              Premium Course
            </label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center"
          >
            <FaTimes className="mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <>
                <FaSave className="mr-2" />
                Save Course
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default function CoursesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editCourseId = searchParams.get('edit');
  const isCreateMode = searchParams.get('create') === 'true';
  
  const [courses, setCourses] = useState([]);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Fetch instructor's courses from API
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/courses/my`);
        setCourses(response.data);
        
        // Check if we should be in edit mode based on URL params
        if (editCourseId) {
          const course = response.data.find(c => c._id === editCourseId);
          if (course) {
            setCourseToEdit(course);
            setIsFormVisible(true);
          }
        } else if (isCreateMode) {
          setCourseToEdit(emptyCourse);
          setIsFormVisible(true);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [editCourseId, isCreateMode]);
  
  const handleCreateCourse = () => {
    setCourseToEdit(emptyCourse);
    setIsFormVisible(true);
    router.push('/dashboard/teacher/courses?create=true');
  };
  
  const handleEditCourse = (course) => {
    setCourseToEdit(course);
    setIsFormVisible(true);
    router.push(`/dashboard/teacher/courses?edit=${course._id}`);
  };
  
  const handleDeleteCourse = (courseId) => {
    setCourseToDelete(courseId);
    setShowDeleteModal(true);
  };
  
  const confirmDeleteCourse = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/courses/${courseToDelete}`);
      
      // Update local state after successful deletion
      const updatedCourses = courses.filter(course => course._id !== courseToDelete);
      setCourses(updatedCourses);
      
      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (err) {
      console.error('Error deleting course:', err);
      setError('Failed to delete the course. Please try again.');
      // Keep the modal open to allow retry
    }
  };
  
  const handleSaveCourse = async (formData, courseFormData) => {
    try {
      let response;
      
      if (formData._id) {
        // Update existing course
        response = await axios.patch(
          `${API_BASE_URL}/courses/${formData._id}`, 
          formData, // Using JSON rather than FormData as the controller expects req.body
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Update the courses array with the updated course
        const updatedCourses = courses.map(course => 
          course._id === formData._id ? response.data : course
        );
        
        setCourses(updatedCourses);
      } else {
        // Create new course
        response = await axios.post(
          `${API_BASE_URL}/courses`, 
          formData, // Using JSON rather than FormData as the controller expects req.body
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Add the new course to the courses array
        setCourses([...courses, response.data]);
      }
      
      setIsFormVisible(false);
      setCourseToEdit(null);
      router.push('/dashboard/teacher/courses');
      
      return response.data;
    } catch (err) {
      console.error('Error saving course:', err);
      throw new Error(err.response?.data?.message || 'Failed to save the course');
    }
  };
  
  const handleCancelForm = () => {
    setIsFormVisible(false);
    setCourseToEdit(null);
    router.push('/dashboard/teacher/courses');
  };
  
  if (isLoading && courses.length === 0) {
    return (
      <TeacherLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </TeacherLayout>
    );
  }
  
  return (
    <TeacherLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <button
            onClick={() => router.push('/dashboard/teacher')}
            className="text-gray-600 hover:text-gray-900 mb-2 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold">Manage Your Courses</h1>
          <p className="text-gray-600">Create, edit, and organize your educational content</p>
        </div>
        {!isFormVisible && (
          <button
            onClick={handleCreateCourse}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FaPlus className="mr-2" />
            Create New Course
          </button>
        )}
      </div>
      
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {isFormVisible ? (
        <CourseForm
          course={courseToEdit}
          onSave={handleSaveCourse}
          onCancel={handleCancelForm}
        />
      ) : (
        <>
          {courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <CourseCard
                  key={course._id}
                  course={course}
                  onEdit={handleEditCourse}
                  onDelete={handleDeleteCourse}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses yet</h3>
              <p className="text-gray-500 mb-6">Start creating your first course to share your knowledge with students.</p>
              <button
                onClick={handleCreateCourse}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center"
              >
                <FaPlus className="mr-2" />
                Create Your First Course
              </button>
            </div>
          )}
        </>
      )}
      
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