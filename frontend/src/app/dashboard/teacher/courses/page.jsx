'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  FaUsers, FaVideo, FaEdit, FaTrash, FaPlus, 
  FaArrowLeft, FaSave, FaTimes, FaUpload
} from 'react-icons/fa';
import TeacherLayout from '../../../components/layout/TeacherLayout';

// Initial teacher data (would be fetched from API in a real app)
const initialTeacherData = {
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
      description: 'Learn Python programming from scratch. Perfect for beginners.',
    },
    {
      id: 2,
      title: 'Data Structures and Algorithms',
      thumbnail: '/images/courses/data-structures.jpg',
      students: 287,
      videos: 32,
      lastUpdated: '2025-02-15',
      description: 'Master the most important computer science concepts with practical examples.',
    },
    {
      id: 3,
      title: 'Machine Learning Fundamentals',
      thumbnail: '/images/courses/ml-basics.jpg',
      students: 412,
      videos: 18,
      lastUpdated: '2025-04-05',
      description: 'Introduction to machine learning algorithms and applications.',
    },
    {
      id: 4,
      title: 'Advanced Web Development',
      thumbnail: '/images/courses/web-dev.jpg',
      students: 214,
      videos: 13,
      lastUpdated: '2025-01-20',
      description: 'Learn modern web development techniques and frameworks.',
    },
  ]
};

// Empty course template for new course creation
const emptyCourse = {
  id: null,
  title: '',
  description: '',
  thumbnail: '/images/courses/placeholder.jpg',
  students: 0,
  videos: 0,
  lastUpdated: new Date().toISOString().split('T')[0],
};

// Course card component with edit/delete actions
const CourseCard = ({ course, onEdit, onDelete }) => (
  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
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
      <h3 className="font-medium text-gray-900 mb-1">{course.title}</h3>
      <p className="text-gray-500 text-sm mb-3 line-clamp-2">{course.description}</p>
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

// Course form component for creating/editing courses
const CourseForm = ({ course, onSave, onCancel }) => {
  const [formData, setFormData] = useState(course);
  const [thumbnailPreview, setThumbnailPreview] = useState(course.thumbnail);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
        // In a real app, you'd upload this file to your server and get a URL back
        // For now, we'll just update the formData with the preview URL
        setFormData({ ...formData, thumbnail: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      onSave(formData);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        {course.id ? 'Edit Course' : 'Create New Course'}
      </h2>
      
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
  
  const [teacher, setTeacher] = useState(initialTeacherData);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  
  useEffect(() => {
    // In a real app, you would fetch the teacher data here
    // For now, we'll use the initialTeacherData
    
    // Check if we should be in edit mode based on URL params
    if (editCourseId) {
      const course = initialTeacherData.courses.find(c => c.id === parseInt(editCourseId));
      if (course) {
        setCourseToEdit(course);
        setIsFormVisible(true);
      }
    } else if (isCreateMode) {
      setCourseToEdit(emptyCourse);
      setIsFormVisible(true);
    }
  }, [editCourseId, isCreateMode]);
  
  const handleCreateCourse = () => {
    setCourseToEdit(emptyCourse);
    setIsFormVisible(true);
    router.push('/dashboard/teacher/courses?create=true');
  };
  
  const handleEditCourse = (course) => {
    setCourseToEdit(course);
    setIsFormVisible(true);
    router.push(`/dashboard/teacher/courses?edit=${course.id}`);
  };
  
  const handleDeleteCourse = (courseId) => {
    setCourseToDelete(courseId);
    setShowDeleteModal(true);
  };
  
  const confirmDeleteCourse = () => {
    // In a real app, this would be an API call
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
  
  const handleSaveCourse = (formData) => {
    let updatedCourses;
    
    if (formData.id) {
      // Editing existing course
      updatedCourses = teacher.courses.map(course => 
        course.id === formData.id ? { ...formData, lastUpdated: new Date().toISOString().split('T')[0] } : course
      );
    } else {
      // Creating new course
      const newCourse = {
        ...formData,
        id: Math.max(...teacher.courses.map(c => c.id)) + 1,
        students: 0,
        videos: 0,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      updatedCourses = [...teacher.courses, newCourse];
    }
    
    setTeacher({
      ...teacher,
      courses: updatedCourses,
      stats: {
        ...teacher.stats,
        totalCourses: updatedCourses.length
      }
    });
    
    setIsFormVisible(false);
    setCourseToEdit(null);
    router.push('/dashboard/teacher/courses');
  };
  
  const handleCancelForm = () => {
    setIsFormVisible(false);
    setCourseToEdit(null);
    router.push('/dashboard/teacher/courses');
  };
  
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
      
      {isFormVisible ? (
        <CourseForm
          course={courseToEdit}
          onSave={handleSaveCourse}
          onCancel={handleCancelForm}
        />
      ) : (
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