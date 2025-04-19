'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  FaUsers, FaSearch, FaSort, FaArrowUp, FaArrowDown,
  FaUserPlus, FaUserMinus, FaAngleRight, FaUserCheck,
  FaCalendarAlt, FaChartLine 
} from 'react-icons/fa';
import TeacherLayout from '../../../components/layout/TeacherLayout';

// Mock data for courses and students
const mockCoursesData = [
  {
    id: 1,
    title: 'Introduction to Python Programming',
    thumbnail: '/images/courses/python.jpg',
    totalStudents: 345,
    activeStudents: 312,
    completionRate: 68,
    averageRating: 4.7,
    lastEnrolled: '2025-04-17 09:42:13',
    trend: 'up', // enrollment trend
    trendPercent: 12,
    enrollment: [
      { month: 'Jan', count: 22 },
      { month: 'Feb', count: 28 },
      { month: 'Mar', count: 35 },
      { month: 'Apr', count: 42 },
    ]
  },
  {
    id: 2,
    title: 'Data Structures and Algorithms',
    thumbnail: '/images/courses/data-structures.jpg',
    totalStudents: 287,
    activeStudents: 243,
    completionRate: 54,
    averageRating: 4.6,
    lastEnrolled: '2025-04-18 14:30:22',
    trend: 'up',
    trendPercent: 8,
    enrollment: [
      { month: 'Jan', count: 18 },
      { month: 'Feb', count: 24 },
      { month: 'Mar', count: 28 },
      { month: 'Apr', count: 32 },
    ]
  },
  {
    id: 3,
    title: 'Machine Learning Fundamentals',
    thumbnail: '/images/courses/ml-basics.jpg',
    totalStudents: 412,
    activeStudents: 378,
    completionRate: 42,
    averageRating: 4.9,
    lastEnrolled: '2025-04-19 02:15:47',
    trend: 'up',
    trendPercent: 15,
    enrollment: [
      { month: 'Jan', count: 28 },
      { month: 'Feb', count: 35 },
      { month: 'Mar', count: 45 },
      { month: 'Apr', count: 52 },
    ]
  },
  {
    id: 4,
    title: 'Advanced Web Development',
    thumbnail: '/images/courses/web-dev.jpg',
    totalStudents: 214,
    activeStudents: 187,
    completionRate: 61,
    averageRating: 4.5,
    lastEnrolled: '2025-04-16 21:08:54',
    trend: 'down',
    trendPercent: 3,
    enrollment: [
      { month: 'Jan', count: 24 },
      { month: 'Feb', count: 20 },
      { month: 'Mar', count: 18 },
      { month: 'Apr', count: 16 },
    ]
  },
];

// Top students data
const topStudentsData = [
  {
    id: 1,
    name: 'Emily Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    enrolledCourses: 3,
    completedCourses: 2,
    lastActive: '2025-04-19 04:18:22',
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    enrolledCourses: 4,
    completedCourses: 3,
    lastActive: '2025-04-18 23:42:15',
  },
  {
    id: 3,
    name: 'Sophia Rodriguez',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    enrolledCourses: 2,
    completedCourses: 2,
    lastActive: '2025-04-19 01:37:49',
  },
  {
    id: 4,
    name: 'James Wilson',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    enrolledCourses: 3,
    completedCourses: 1,
    lastActive: '2025-04-18 18:15:33',
  },
];

// Course card component
const CourseStudentCard = ({ course }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="p-5">
        <div className="flex items-start">
          <div className="relative h-16 w-28 flex-shrink-0 rounded overflow-hidden">
            <Image
              src={course.thumbnail}
              alt={course.title}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="ml-4 flex-grow">
            <h3 className="font-medium text-gray-900 mb-1">{course.title}</h3>
            
            <div className="flex flex-wrap gap-4 mt-3">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaUsers className="text-blue-600" size={14} />
                </div>
                <div className="ml-2">
                  <p className="text-xs text-gray-500">Total Students</p>
                  <p className="text-sm font-semibold text-gray-800">{course.totalStudents}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full">
                  <FaUserCheck className="text-green-600" size={14} />
                </div>
                <div className="ml-2">
                  <p className="text-xs text-gray-500">Active Students</p>
                  <p className="text-sm font-semibold text-gray-800">{course.activeStudents}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full">
                  <FaChartLine className="text-purple-600" size={14} />
                </div>
                <div className="ml-2">
                  <p className="text-xs text-gray-500">Completion Rate</p>
                  <p className="text-sm font-semibold text-gray-800">{course.completionRate}%</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0 ml-4 text-right">
            <div className={`flex items-center ${course.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {course.trend === 'up' ? <FaArrowUp size={12} className="mr-1" /> : <FaArrowDown size={12} className="mr-1" />}
              <span className="text-sm font-semibold">{course.trendPercent}%</span>
            </div>
            <p className="text-xs text-gray-500">this month</p>
            
            <button 
              onClick={() => setExpanded(!expanded)}
              className="mt-3 text-blue-600 text-sm flex items-center hover:text-blue-800 ml-auto"
            >
              {expanded ? 'Hide Details' : 'View Details'}
              <FaAngleRight className={`ml-1 transform transition-transform ${expanded ? 'rotate-90' : ''}`} size={12} />
            </button>
          </div>
        </div>
        
        {expanded && (
          <div className="mt-5 pt-5 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold mb-3">Enrollment Trend</h4>
                <div className="h-40 flex items-end space-x-2">
                  {course.enrollment.map((data, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="bg-blue-500 rounded-t w-8"
                        style={{ height: `${data.count * 2}px` }}
                      ></div>
                      <span className="text-xs mt-1 text-gray-600">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-3">Student Stats</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1 text-xs text-gray-700">
                      <span>Completion Rate</span>
                      <span>{course.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${course.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1 text-xs text-gray-700">
                      <span>Active Students</span>
                      <span>{Math.round(course.activeStudents / course.totalStudents * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.round(course.activeStudents / course.totalStudents * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-gray-700">
                      <div>
                        <span className="font-medium">Last Enrollment:</span>
                        <span className="ml-1 text-gray-600">{course.lastEnrolled}</span>
                      </div>
                      <div>
                        <span className="font-medium">Rating:</span>
                        <span className="ml-1 text-yellow-600">{course.averageRating}/5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                View All Students
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function StudentsPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('totalStudents');
  const [sortOrder, setSortOrder] = useState('desc');
  const [topStudents, setTopStudents] = useState([]);
  
  // Stats
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    averageCompletionRate: 0,
    newEnrollmentsThisMonth: 0
  });
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCourses(mockCoursesData);
      setTopStudents(topStudentsData);
      
      // Calculate stats
      const totalStudents = mockCoursesData.reduce((sum, course) => sum + course.totalStudents, 0);
      const activeStudents = mockCoursesData.reduce((sum, course) => sum + course.activeStudents, 0);
      const avgCompletionRate = mockCoursesData.reduce((sum, course) => sum + course.completionRate, 0) / mockCoursesData.length;
      const newEnrollments = mockCoursesData.reduce((sum, course) => {
        return sum + (course.enrollment[3].count - course.enrollment[2].count);
      }, 0);
      
      setStats({
        totalStudents,
        activeStudents,
        averageCompletionRate: Math.round(avgCompletionRate),
        newEnrollmentsThisMonth: newEnrollments
      });
      
      setLoading(false);
    }, 800);
  }, []);
  
  // Handle sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  
  // Filter and sort courses
  const filteredCourses = courses
    .filter(course => course.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const factor = sortOrder === 'asc' ? 1 : -1;
      return factor * (a[sortBy] - b[sortBy]);
    });

  return (
    <TeacherLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Students</h1>
        <p className="text-gray-600">Monitor student enrollment and engagement across your courses</p>
      </div>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaUsers className="text-blue-600" size={20} />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Total Students</h3>
              <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <FaUserCheck className="text-green-600" size={20} />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Active Students</h3>
              <p className="text-2xl font-bold text-gray-800">{stats.activeStudents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <FaChartLine className="text-purple-600" size={20} />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Avg. Completion Rate</h3>
              <p className="text-2xl font-bold text-gray-800">{stats.averageCompletionRate}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-full">
              <FaUserPlus className="text-orange-600" size={20} />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">New This Month</h3>
              <p className="text-2xl font-bold text-gray-800">+{stats.newEnrollmentsThisMonth}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Course and student filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  className={`px-4 py-2 rounded-md flex items-center ${sortBy === 'totalStudents' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => handleSort('totalStudents')}
                >
                  <span>Students</span>
                  {sortBy === 'totalStudents' && (
                    <span className="ml-1">
                      {sortOrder === 'asc' ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                    </span>
                  )}
                </button>
                
                <button
                  className={`px-4 py-2 rounded-md flex items-center ${sortBy === 'completionRate' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => handleSort('completionRate')}
                >
                  <span>Completion</span>
                  {sortBy === 'completionRate' && (
                    <span className="ml-1">
                      {sortOrder === 'asc' ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Course student list */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="space-y-6">
              {filteredCourses.map(course => (
                <CourseStudentCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-1">No courses found</h3>
              <p className="text-gray-500">Try adjusting your search term</p>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {/* Top active students */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Top Active Students</h2>
            <div className="space-y-4">
              {topStudents.map(student => (
                <div key={student.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                  <Image
                    src={student.avatar}
                    alt={student.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-800">{student.name}</h3>
                    <p className="text-xs text-gray-500">
                      {student.enrolledCourses} courses ({student.completedCourses} completed)
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-xs text-gray-500 flex items-center justify-end">
                      <FaCalendarAlt size={10} className="mr-1" />
                      {student.lastActive.split(' ')[0]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-800">
              View All Students
            </button>
          </div>
          
          {/* Enrollment trend */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Enrollment Trends</h2>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">This Month</span>
                  <span className="text-green-600 font-medium">+{stats.newEnrollmentsThisMonth} students</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-full"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Last Month</span>
                  <span className="text-blue-600 font-medium">+{Math.round(stats.newEnrollmentsThisMonth * 0.85)} students</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: '85%' }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">2 Months Ago</span>
                  <span className="text-gray-600 font-medium">+{Math.round(stats.newEnrollmentsThisMonth * 0.65)} students</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gray-600 h-2 rounded-full" 
                    style={{ width: '65%' }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Total Growth (3mo)</span>
                <span className="text-green-600 font-medium">+{Math.round(stats.newEnrollmentsThisMonth * 2.5)} students</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}