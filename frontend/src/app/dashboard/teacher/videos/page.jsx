'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaUpload, FaPlay, FaSearch,
  FaFilter, FaSort, FaChevronDown, FaEye, FaVideo,
  FaGripLines, FaTimes, FaSave, FaCheckCircle, FaSpinner, FaUser
} from 'react-icons/fa';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import TeacherLayout from '../../../components/layout/TeacherLayout';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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

// Set up axios interceptor to add authorization header
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

// Skeleton loader component
const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center px-6 py-4 border-b border-gray-200">
          <div className="h-12 w-20 bg-gray-200 rounded mr-4"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Sortable Video Card component for the grid view
const SortableVideoCard = ({ video }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: video._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <motion.div 
      ref={setNodeRef} 
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-xl shadow-sm overflow-hidden ${
        isDragging ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
      }`}
    >
      <div className="relative aspect-video">
        {video.thumbnail ? (
          <img
            src={video.thumbnail || ''}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <FaVideo className="text-gray-400" size={24} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-4 text-white w-full">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium">{video.duration || 'N/A'}</span>
              <span className="text-xs flex items-center">
                <FaEye className="mr-1" size={12} />
                {video.views || 0}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center hover:bg-black/40 transition-colors opacity-0 hover:opacity-100">
          <button className="bg-white rounded-full p-3 transform hover:scale-110 transition-transform">
            <FaPlay className="text-blue-600" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{video.title}</h3>
        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{video.description || 'No description'}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{video.courseName}</span>
          <span className="text-xs text-gray-400">{new Date(video.createdAt || Date.now()).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 flex justify-between items-center">
        <div {...attributes} {...listeners} className="flex w-full items-center justify-center text-gray-400 cursor-move">
          <FaGripLines title="Drag to reorder" />
          <span className="ml-2 text-sm">Drag to reorder</span>
        </div>
      </div>
    </motion.div>
  );
};

// Sortable table row component for the list view
const SortableTableRow = ({ video }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: video._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
    display: 'table-row',
    backgroundColor: isDragging ? '#EFF6FF' : undefined,
  };

  return (
    <tr 
      ref={setNodeRef} 
      style={style}
      className="hover:bg-gray-50"
    >
      <td className="w-10 px-4 py-4" {...attributes} {...listeners}>
        <FaGripLines className="text-gray-400 cursor-move" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="relative h-12 w-20 flex-shrink-0 rounded overflow-hidden bg-gray-200">
            {video.thumbnail ? (
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaVideo className="text-gray-400" size={16} />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center hover:bg-black hover:bg-opacity-20 transition-colors">
              <FaPlay className="text-white opacity-70" size={16} />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{video.title}</div>
            <div className="text-xs text-gray-500 line-clamp-1">{video.description || 'No description'}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{video.courseName}</div>
        <div className="text-xs text-gray-500">{new Date(video.createdAt || Date.now()).toLocaleDateString()}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{video.duration || 'N/A'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 flex items-center">
          <FaEye className="text-gray-400 mr-1" size={14} />
          {video.views || 0}
        </div>
      </td>
    </tr>
  );
};

// Draggable Video Card for the overlay
const VideoCard = ({ video, isDragging }) => (
  <div className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all ${
    isDragging ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
  }`}>
    <div className="relative aspect-video">
      {video.thumbnail ? (
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <FaVideo className="text-gray-400" size={24} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
        <div className="p-4 text-white w-full">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium">{video.duration || 'N/A'}</span>
            <span className="text-xs flex items-center">
              <FaEye className="mr-1" size={12} />
              {video.views || 0}
            </span>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center hover:bg-black/40 transition-colors opacity-0 hover:opacity-100">
        <button className="bg-white rounded-full p-3 transform hover:scale-110 transition-transform">
          <FaPlay className="text-blue-600" />
        </button>
      </div>
    </div>
    
    <div className="p-4">
      <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{video.title}</h3>
      <p className="text-xs text-gray-500 mb-2 line-clamp-2">{video.description || 'No description'}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{video.courseName}</span>
        <span className="text-xs text-gray-400">{new Date(video.createdAt || Date.now()).toLocaleDateString()}</span>
      </div>
    </div>
    
    <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 flex justify-center items-center">
      <div className="flex items-center text-gray-400">
        <FaGripLines className="cursor-move" title="Drag to reorder" />
        <span className="ml-2 text-sm">Drag to reorder</span>
      </div>
    </div>
  </div>
);

export default function VideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [dragDisabled, setDragDisabled] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [orderSaved, setOrderSaved] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [savingOrder, setSavingOrder] = useState(false);
  
  // Configure DnD sensors for mouse, touch and keyboard
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_URL}/courses/my`);
        setCourses(response.data);
        
        // Set default course filter if no course is selected yet
        if (!courseFilter && response.data.length > 0) {
          setCourseFilter(response.data[0]._id);
          setCurrentCourseId(response.data[0]._id);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    
    fetchCourses();
  }, []);

  // Fetch videos whenever the course filter changes
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        
        if (courseFilter) {
          // Fetch videos for specific course
          const response = await axios.get(`${API_URL}/videos/${courseFilter}`);
          
          // Process the video data to include course names
          const processedVideos = response.data.map(video => {
            const course = courses.find(c => c._id === video.course);
            return {
              ...video,
              courseName: course ? course.title : 'Unknown Course'
            };
          });
          
          setVideos(processedVideos);
          setCurrentCourseId(courseFilter);
          setOrderSaved(true); // Videos are already in their saved order when fetched by course
        } else {
          // Fetch all videos for teacher
          const response = await axios.get(`${API_URL}/videos/teacher`);
          
          // Process the video data to include course names
          const processedVideos = response.data.map(video => {
            const course = courses.find(c => c._id === video.course);
            return {
              ...video,
              courseName: course ? course.title : 'Unknown Course'
            };
          });
          
          setAllVideos(processedVideos);
          setVideos(processedVideos);
          
          // Find course with most videos to set as default
          if (processedVideos.length > 0 && !currentCourseId) {
            const courseGroups = processedVideos.reduce((acc, video) => {
              if (!acc[video.course]) acc[video.course] = 0;
              acc[video.course]++;
              return acc;
            }, {});
            
            let maxCount = 0;
            let mostPopularCourseId = null;
            
            Object.entries(courseGroups).forEach(([courseId, count]) => {
              if (count > maxCount) {
                maxCount = count;
                mostPopularCourseId = courseId;
              }
            });
            
            setCurrentCourseId(mostPopularCourseId);
          }
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch if courses are loaded
    if (courses.length > 0) {
      fetchVideos();
    }
  }, [courseFilter, courses]);

  useEffect(() => {
    // Disable drag and drop when search is applied
    setDragDisabled(!!searchTerm);
  }, [searchTerm]);

  // Hide success message after 3 seconds
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setVideos((items) => {
        // Find the indexes of the source and destination items
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);
        
        // Move the item in the array
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update the order property
        return newItems.map((item, index) => ({
          ...item,
          order: index + 1
        }));
      });
      
      // Reset order saved flag when videos are reordered
      setOrderSaved(false);
    }
    
    setActiveId(null);
  }, []);

  const saveCustomOrder = async () => {
    try {
      if (!currentCourseId) {
        alert('Please select a course to save the custom order');
        return;
      }
      
      setSavingOrder(true);
      
      // Get IDs in the new order from the filtered and course-specific videos
      const orderedIds = filteredVideos
        .filter(video => video.course === currentCourseId)
        .map(video => video._id);
      
      // Call API to save the order
      await axios.patch(`${API_URL}/videos/reorder/${currentCourseId}`, {
        reorderedIds: orderedIds
      });
      
      // Update UI state
      setSortBy('order');
      setSortOrder('asc');
      setOrderSaved(true);
      setShowSuccessMessage(true);
      
      console.log('Custom order saved', orderedIds);
    } catch (err) {
      console.error('Error saving video order:', err);
      alert('Failed to save custom order. Please try again.');
    } finally {
      setSavingOrder(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    // Don't clear course filter as it's our primary navigation
  };

  // Filter and sort videos
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (video.description && video.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'title') {
      return sortOrder === 'asc' 
        ? a.title.localeCompare(b.title) 
        : b.title.localeCompare(a.title);
    } else if (sortBy === 'views') {
      return sortOrder === 'asc' ? (a.views || 0) - (b.views || 0) : (b.views || 0) - (a.views || 0);
    } else if (sortBy === 'duration') {
      return sortOrder === 'asc' 
        ? (a.duration || '').localeCompare(b.duration || '') 
        : (b.duration || '').localeCompare(a.duration || '');
    } else if (sortBy === 'order') {
      return sortOrder === 'asc' ? (a.order || 0) - (b.order || 0) : (b.order || 0) - (a.order || 0);
    } else { // date
      return sortOrder === 'asc' 
        ? new Date(a.createdAt || 0) - new Date(b.createdAt || 0) 
        : new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
  });

  const activeFiltersCount = [
    searchTerm
  ].filter(Boolean).length;

  return (
    <TeacherLayout>
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Your Videos</h1>
          <p className="text-gray-600">Manage all your course videos in one place</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={saveCustomOrder}
            disabled={orderSaved || filteredVideos.length <= 1 || !currentCourseId || savingOrder}
            className={`px-4 py-2 rounded-lg border transition-colors flex items-center justify-center ${
              sortBy === 'order' && orderSaved
                ? 'bg-green-50 border-green-300 text-green-700' 
                : filteredVideos.length <= 1 || !currentCourseId || savingOrder
                  ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {savingOrder ? (
              <>
                <FaSpinner className="mr-2 animate-spin" />
                Saving...
              </>
            ) : sortBy === 'order' && orderSaved ? (
              <>
                <FaCheckCircle className="mr-2" />
                Custom Order Saved
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                Save Custom Order
              </>
            )}
          </button>
          <Link 
            href="/dashboard/teacher/videos/upload"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       transition-colors flex items-center justify-center shadow-sm"
          >
            <FaUpload className="mr-2" />
            Upload New Video
          </Link>
        </div>
      </div>

      {/* Success message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 flex items-center"
          >
            <FaCheckCircle className="text-green-500 mr-3" />
            <p>Your custom video order has been saved successfully.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Course selection dropdown */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:items-center lg:space-x-4">
          <div className="lg:w-1/3">
            <label htmlFor="courseSelect" className="block text-sm font-medium text-gray-700 mb-1">
              Select Course
            </label>
            <div className="relative">
              <select
                id="courseSelect"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {courses.length === 0 ? (
                  <option value="">No courses available</option>
                ) : (
                  courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FaChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search videos..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={16} />
              </button>
            )}
          </div>
          
          <div className="flex space-x-2 lg:w-auto">
            <div className="relative">
              <button
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center"
                onClick={() => {
                  // Toggle sort order if clicking the same field, otherwise set new field and default to desc
                  if (sortBy === 'date') {
                    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                  } else {
                    setSortBy('date');
                    setSortOrder('desc');
                  }
                  // Reset the saved order state if changing sort
                  if (sortBy === 'order') {
                    setOrderSaved(false);
                  }
                }}
              >
                <FaSort className="mr-2" size={14} />
                {sortOrder === 'asc' ? 'Oldest' : 'Newest'} First
              </button>
            </div>
            
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-700' : 'bg-white text-gray-700'}`}
                title="Grid view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-3z"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-700' : 'bg-white text-gray-700'}`}
                title="List view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {activeFiltersCount > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchTerm && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
                <span>Search: {searchTerm}</span>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Instructions for drag & drop */}
      {!dragDisabled && filteredVideos.length > 1 && !orderSaved && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Arrange your videos in your preferred order by dragging and dropping them. Click "Save Custom Order" when done.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Video list */}
      {loading ? (
        <SkeletonLoader />
      ) : filteredVideos.length > 0 ? (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToParentElement]}
        >
          {viewMode === 'grid' ? (
            <SortableContext 
              items={filteredVideos.map(video => video._id)} 
              strategy={horizontalListSortingStrategy}
              disabled={dragDisabled}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVideos.map((video) => (
                  <SortableVideoCard 
                    key={video._id}
                    video={video}
                  />
                ))}
              </div>
            </SortableContext>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {!dragDisabled && (
                      <th className="w-10 px-4 py-3"></th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Video
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                  </tr>
                </thead>
                <SortableContext 
                  items={filteredVideos.map(video => video._id)}
                  strategy={verticalListSortingStrategy}
                  disabled={dragDisabled}
                >
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVideos.map((video) => (
                      <SortableTableRow 
                        key={video._id}
                        video={video}
                      />
                    ))}
                  </tbody>
                </SortableContext>
              </table>
            </div>
          )}
          
          {/* This overlay shows the item being dragged */}
          <DragOverlay>
            {activeId ? (
              viewMode === 'grid' ? (
                <VideoCard 
                  video={videos.find(v => v._id === activeId)}
                  isDragging={true}
                />
              ) : (
                <div className="bg-white border shadow-md rounded-md p-4 max-w-md">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 mr-3">
                      <FaVideo />
                    </div>
                    <div>
                      <div className="font-medium">{videos.find(v => v._id === activeId).title}</div>
                      <div className="text-sm text-gray-500">{videos.find(v => v._id === activeId).courseName}</div>
                    </div>
                  </div>
                </div>
              )
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-12 text-center"
        >
          <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
            <FaVideo className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No videos found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? "Try adjusting your search term" 
              : courseFilter 
                ? "This course doesn't have any videos yet" 
                : "You haven't uploaded any videos yet"}
          </p>
          {!searchTerm && (
            <Link 
              href={`/dashboard/teacher/videos/upload${courseFilter ? `?course=${courseFilter}` : ''}`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaUpload className="mr-2" />
              {courses.length > 0 ? 'Upload a Video' : 'Create a Course First'}
            </Link>
          )}
        </motion.div>
      )}

      {/* User and date info */}
      <div className="mt-6 text-sm text-gray-500 text-right">
        {new Date().toISOString().split('T')[0]} {new Date().toTimeString().split(' ')[0].substring(0, 5)} • {getCookie('name') || 'Teacher'}
      </div>
    </TeacherLayout>
  );
}