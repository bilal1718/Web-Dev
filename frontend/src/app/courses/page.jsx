'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaSearch, FaFilter, FaSortAmountDown, FaChevronDown, 
  FaGraduationCap, FaStar, FaUserTie, FaDesktop,
  FaSpinner
} from 'react-icons/fa';
import CourseCard from '../components/ui/CourseCard';

// Categories for filtering
const categories = [
  "All Categories",
  "Web Development",
  "Programming",
  "Data Science",
  "Design",
  "Mobile Development",
  "DevOps",
  "Business",
  "Marketing"
];

// Levels for filtering
const levels = [
  "All Levels",
  "Beginner",
  "Intermediate",
  "Advanced"
];

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [selectedSort, setSelectedSort] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [priceFilter, setPriceFilter] = useState('all'); // all, free, paid
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Current date and user info 
  const currentDateTime = "2025-04-19 10:19:23";
  const currentUser = "ZainJ5";

  // Fetch courses from the backend API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:5000/api/courses');
        
        if (!response.ok) {
          throw new Error(`Error fetching courses: ${response.status}`);
        }
        
        const data = await response.json();
        setCourses(data);
        setFilteredCourses(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError(err.message || 'Failed to fetch courses');
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);
  
  // Apply filters and search
  useEffect(() => {
    if (courses.length === 0) return;
    
    let result = [...courses];
    
    // Apply search query
    if (searchQuery) {
      result = result.filter(course => 
        course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.tutor?.name && course.tutor.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'All Categories') {
      result = result.filter(course => 
        course.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Apply level filter
    if (selectedLevel !== 'All Levels') {
      result = result.filter(course => 
        course.level?.toLowerCase() === selectedLevel.toLowerCase()
      );
    }
    
    // Apply price filter
    if (priceFilter === 'free') {
      result = result.filter(course => course.price === 0);
    } else if (priceFilter === 'paid') {
      result = result.filter(course => course.price > 0);
    }
    
    // Apply price range
    result = result.filter(course => 
      course.price >= priceRange[0] && course.price <= priceRange[1]
    );
    
    // Apply sorting
    if (selectedSort === 'popularity') {
      result.sort((a, b) => (b.students || 0) - (a.students || 0));
    } else if (selectedSort === 'highest-rated') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (selectedSort === 'newest') {
      // Sort by createdAt date if available
      result.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
      });
    } else if (selectedSort === 'price-low-high') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (selectedSort === 'price-high-low') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    
    setFilteredCourses(result);
  }, [courses, searchQuery, selectedCategory, selectedLevel, selectedSort, priceFilter, priceRange]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <h1 className="text-4xl font-bold mb-4">Explore Courses</h1>
          <p className="text-xl text-blue-100 mb-8">
            Discover thousands of courses to help you grow in your career and personal development
          </p>
          
          {/* Main Search Bar */}
          <div className="relative max-w-3xl">
            <input
              type="text"
              placeholder="Search for courses, topics, or instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-blue-600" size={20} />
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-8">
            <div className="flex space-x-2 items-center">
              <div className="text-sm bg-blue-700 px-3 py-1 rounded-full">
                {filteredCourses.length} courses found
              </div>
              <button 
                className="flex items-center text-blue-100 hover:text-white"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
            <div className="text-sm text-blue-100">
              Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): {currentDateTime}
              <br />
              Current User's Login: {currentUser}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Filters Section */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex flex-wrap -mx-2">
              <div className="px-2 w-full sm:w-1/2 md:w-1/4 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <FaChevronDown className="text-gray-400" size={14} />
                  </div>
                </div>
              </div>
              
              <div className="px-2 w-full sm:w-1/2 md:w-1/4 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <div className="relative">
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none"
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <FaChevronDown className="text-gray-400" size={14} />
                  </div>
                </div>
              </div>
              
              <div className="px-2 w-full sm:w-1/2 md:w-1/4 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <div className="flex space-x-2">
                  <button
                    className={`px-3 py-2 text-sm rounded-md ${priceFilter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                    onClick={() => setPriceFilter('all')}
                  >
                    All
                  </button>
                  <button
                    className={`px-3 py-2 text-sm rounded-md ${priceFilter === 'free' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                    onClick={() => setPriceFilter('free')}
                  >
                    Free
                  </button>
                  <button
                    className={`px-3 py-2 text-sm rounded-md ${priceFilter === 'paid' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                    onClick={() => setPriceFilter('paid')}
                  >
                    Paid
                  </button>
                </div>
              </div>
              
              <div className="px-2 w-full sm:w-1/2 md:w-1/4 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <div className="relative">
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none"
                  >
                    <option value="popularity">Most Popular</option>
                    <option value="highest-rated">Highest Rated</option>
                    <option value="newest">Newest</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <FaSortAmountDown className="text-gray-400" size={14} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <div className="flex space-x-4 items-center">
                <span className="text-sm">$0</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm">$100+</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Featured Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 flex flex-col items-center cursor-pointer" onClick={() => setSelectedCategory('Web Development')}>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <FaDesktop className="text-blue-600" size={20} />
              </div>
              <h3 className="font-medium text-center">Web Development</h3>
              <p className="text-sm text-gray-500 text-center">4,235 courses</p>
            </div>
            
            <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 flex flex-col items-center cursor-pointer" onClick={() => setSelectedCategory('Data Science')}>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <FaGraduationCap className="text-purple-600" size={20} />
              </div>
              <h3 className="font-medium text-center">Data Science</h3>
              <p className="text-sm text-gray-500 text-center">2,123 courses</p>
            </div>
            
            <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 flex flex-col items-center cursor-pointer" onClick={() => setSelectedCategory('Design')}>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3">
                <FaStar className="text-pink-600" size={20} />
              </div>
              <h3 className="font-medium text-center">Design</h3>
              <p className="text-sm text-gray-500 text-center">1,876 courses</p>
            </div>
            
            <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 flex flex-col items-center cursor-pointer" onClick={() => setSelectedCategory('Business')}>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <FaUserTie className="text-green-600" size={20} />
              </div>
              <h3 className="font-medium text-center">Business</h3>
              <p className="text-sm text-gray-500 text-center">3,421 courses</p>
            </div>
          </div>
        </div>
        
        {/* Courses Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">All Courses</h2>
            <div className="text-sm text-gray-500">
              Showing {filteredCourses.length} of {courses.length} courses
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-16">
              <FaSpinner className="animate-spin mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Loading courses...</h3>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <div className="mx-auto h-12 w-12 text-red-600 mb-4">❌</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading courses</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map(course => (
                <CourseCard 
                  key={course._id} 
                  course={{
                    id: course._id,
                    title: course.title,
                    description: course.description,
                    image: course.thumbnail || '/images/courses/placeholder.jpg',
                    price: course.price,
                    category: course.category || 'Uncategorized',
                    instructor: {
                      name: course.tutor?.name || 'Instructor',
                      avatar: course.tutor?.avatar || '/images/teachers/default.jpg'
                    },
                    rating: course.rating || 0,
                    students: course.students || 0,
                    duration: course.duration || 'N/A',
                    level: course.level || 'All Levels'
                  }} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <FaSearch className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                We couldn't find any courses matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Categories');
                  setSelectedLevel('All Levels');
                  setPriceFilter('all');
                  setPriceRange([0, 100]);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Clear All Filters
              </button>
            </div>
          )}
          
          {/* Pagination - only show if there are courses and not loading */}
          {!isLoading && !error && filteredCourses.length > 0 && (
            <div className="mt-12 flex justify-center">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm">
                Load More Courses
              </button>
            </div>
          )}
        </div>
        
        {/* Call to Action */}
        <div className="mt-20 mb-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Become an Instructor</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Share your knowledge and expertise with students around the world. Create engaging courses and earn income.
          </p>
          <Link 
            href="/auth/register" 
            className="inline-block px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50"
          >
            Start Teaching Today
          </Link>
        </div>
      </div>
    </div>
  );
}