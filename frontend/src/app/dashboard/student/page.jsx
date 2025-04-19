'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaGraduationCap, FaBook, FaPlay, FaClock, 
  FaCalendarAlt, FaComments, FaBell, FaArrowRight
} from 'react-icons/fa';
import StudentLayout from '../../components/layout/StudentLayout';

const studentData = {
  _id: "68035537159d7673f4032cc2",
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: "/images/students/alex.jpg",
  enrollments: [
    {
      _id: "68035693b925c54c3cf171b1",
      course: {
        _id: "68034910156720d4a255e6de",
        title: "Web Development Fundamentals",
        description: "Learn the basics of web development with HTML, CSS and JavaScript",
        thumbnail: "/images/courses/web-dev.jpg",
        tutor: {
          _id: "68034015ff6522d2a982be57",
          name: "Professor Chad",
          avatar: "/images/teachers/chad.jpg"
        }
      },
      progress: {
        completedVideos: ["68034933156720d4a255e6e1"],
        percentage: 25
      },
      createdAt: "2025-04-18T10:13:55.255Z"
    },
    {
      _id: "68035693b925c54c3cf171b2",
      course: {
        _id: "68034701bc4ca4202c0380f9",
        title: "React for Beginners",
        description: "Learn React from scratch",
        thumbnail: "/images/courses/react.jpg",
        tutor: {
          _id: "68034015ff6522d2a982be57",
          name: "Professor Chad",
          avatar: "/images/teachers/chad.jpg"
        }
      },
      progress: {
        completedVideos: [],
        percentage: 0
      },
      createdAt: "2025-04-17T15:27:29.805Z"
    }
  ],
  recentActivity: [
    {
      _id: "1",
      type: "video_watched",
      title: "HTML Fundamentals",
      course: "Web Development Fundamentals",
      time: "2 hours ago"
    },
    {
      _id: "2",
      type: "enrollment",
      title: "New course enrollment",
      course: "React for Beginners",
      time: "Yesterday"
    },
    {
      _id: "3",
      type: "message",
      title: "New message from Professor Chad",
      course: "Web Development Fundamentals",
      time: "Yesterday"
    }
  ],
  notifications: [
    {
      _id: "1",
      type: "message",
      content: "Professor Chad replied to your question",
      course: "Web Development Fundamentals",
      time: "10 minutes ago",
      read: false
    },
    {
      _id: "2",
      type: "course_update",
      content: "New video added to React for Beginners",
      course: "React for Beginners",
      time: "1 hour ago",
      read: false
    },
    {
      _id: "3",
      type: "announcement",
      content: "Live Q&A session scheduled for tomorrow at 3PM",
      course: "Web Development Fundamentals",
      time: "3 hours ago",
      read: false
    },
    {
      _id: "4",
      type: "system",
      content: "Your certificate is available for download",
      course: "Python Basics",
      time: "1 day ago",
      read: true
    }
  ],
  recommendedCourses: [
    {
      _id: "68034701bc4ca4202c0380f8",
      title: "Advanced JavaScript",
      description: "Master advanced JavaScript concepts like closures, promises, and async/await",
      thumbnail: "/images/courses/js-advanced.jpg",
      price: 49.99,
      isPremium: true,
      tutor: {
        _id: "68034015ff6522d2a982be57",
        name: "Professor Chad",
        avatar: "/images/teachers/chad.jpg"
      },
      rating: 4.9,
      studentsCount: 1240
    },
    {
      _id: "68034701bc4ca4202c0380f7",
      title: "Node.js Essentials",
      description: "Learn server-side JavaScript with Node.js and Express",
      thumbnail: "/images/courses/nodejs.jpg",
      price: 39.99,
      isPremium: true,
      tutor: {
        _id: "68034015ff6522d2a982be59",
        name: "Dr. Sarah Johnson",
        avatar: "/images/teachers/sarah.jpg"
      },
      rating: 4.7,
      studentsCount: 980
    },
    {
      _id: "68034701bc4ca4202c0380f6",
      title: "Responsive Web Design",
      description: "Create beautiful responsive websites that work on all devices",
      thumbnail: "/images/courses/responsive.jpg",
      price: 0,
      isPremium: false,
      tutor: {
        _id: "68034015ff6522d2a982be60",
        name: "Mark Wilson",
        avatar: "/images/teachers/mark.jpg"
      },
      rating: 4.8,
      studentsCount: 2100
    }
  ],
  upcomingEvents: [
    {
      _id: "1",
      title: "Live Q&A Session",
      course: "Web Development Fundamentals",
      date: "2025-04-20T15:00:00Z",
      type: "live"
    },
    {
      _id: "2",
      title: "Group Project Discussion",
      course: "React for Beginners",
      date: "2025-04-22T17:30:00Z",
      type: "discussion"
    }
  ]
};

// Progress Card Component
function ProgressCard({ enrollment }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative h-36">
        <Image
          src={enrollment.course.thumbnail}
          alt={enrollment.course.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-white font-medium line-clamp-1">{enrollment.course.title}</h3>
          <div className="flex items-center text-white/80 text-sm mt-1">
            <Image 
              src={enrollment.course.tutor.avatar} 
              alt={enrollment.course.tutor.name} 
              width={20} 
              height={20} 
              className="rounded-full mr-2"
            />
            <span>{enrollment.course.tutor.name}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{enrollment.progress.percentage}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${enrollment.progress.percentage}%` }}
          ></div>
        </div>
        
        <div className="mt-4 flex justify-between">
          <Link 
            href={`/dashboard/student/learning/${enrollment.course._id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
          >
            Continue Learning <FaArrowRight className="ml-1" />
          </Link>
          <Link 
            href={`/dashboard/student/chat/${enrollment.course._id}`}
            className="text-gray-600 hover:text-gray-800 text-sm flex items-center"
          >
            <FaComments className="mr-1" /> Chat
          </Link>
        </div>
      </div>
    </div>
  );
}

// Course Card Component
function CourseCard({ course }) {
  return (
    <Link href={`/dashboard/student/courses/${course._id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="relative h-36">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover"
          />
          {course.isPremium && (
            <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              Premium
            </span>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-medium mb-1 line-clamp-1">{course.title}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</p>
          
          <div className="flex items-center text-sm">
            <Image 
              src={course.tutor.avatar} 
              alt={course.tutor.name} 
              width={20} 
              height={20} 
              className="rounded-full mr-2"
            />
            <span className="text-gray-700">{course.tutor.name}</span>
          </div>
          
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < Math.floor(course.rating) ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <span className="ml-1 text-gray-600 text-xs">{course.rating}</span>
            </div>
            
            <div>
              {course.price > 0 ? (
                <span className="font-bold text-blue-600">${course.price}</span>
              ) : (
                <span className="text-green-600 text-sm font-medium">Free</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Activity Item Component
function ActivityItem({ activity }) {
  const getIcon = () => {
    switch (activity.type) {
      case 'video_watched':
        return <FaPlay className="text-blue-500" />;
      case 'enrollment':
        return <FaGraduationCap className="text-green-500" />;
      case 'message':
        return <FaComments className="text-purple-500" />;
      default:
        return <FaBook className="text-gray-500" />;
    }
  };
  
  return (
    <div className="flex items-start">
      <div className="p-2 bg-gray-100 rounded-lg mr-3">
        {getIcon()}
      </div>
      <div>
        <h4 className="text-sm font-medium">{activity.title}</h4>
        <p className="text-xs text-gray-600">{activity.course}</p>
        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
      </div>
    </div>
  );
}

// Notification Item Component
function NotificationItem({ notification, onMarkAsRead }) {
  const getIcon = () => {
    switch (notification.type) {
      case 'message':
        return <FaComments className="text-blue-500" />;
      case 'course_update':
        return <FaBook className="text-green-500" />;
      case 'announcement':
        return <FaBell className="text-orange-500" />;
      default:
        return <FaGraduationCap className="text-gray-500" />;
    }
  };
  
  return (
    <div className={`flex items-start p-3 ${notification.read ? 'bg-white' : 'bg-blue-50'} border-b border-gray-100 hover:bg-gray-50`}>
      <div className="p-2 bg-gray-100 rounded-lg mr-3">
        {getIcon()}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium">{notification.content}</h4>
        <p className="text-xs text-gray-600">{notification.course}</p>
        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
      </div>
      {!notification.read && (
        <button 
          onClick={() => onMarkAsRead(notification._id)}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Mark as read
        </button>
      )}
    </div>
  );
}

export default function StudentDashboard() {
  const [student, setStudent] = useState(studentData);
  const [activeTab, setActiveTab] = useState('courses');
  
  const markNotificationAsRead = (notificationId) => {
    setStudent(prev => ({
      ...prev,
      notifications: prev.notifications.map(notification => 
        notification._id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    }));
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  return (
    <StudentLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome back, {student.name.split(' ')[0]}!</h1>
        <p className="text-gray-600 mt-1">
          Continue your learning journey and track your progress.
        </p>
      </div>
      
      {/* My Learning Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">My Learning</h2>
          <Link href="/dashboard/student/learning" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All
          </Link>
        </div>
        
        {student.enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {student.enrollments.map(enrollment => (
              <ProgressCard key={enrollment._id} enrollment={enrollment} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FaGraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-500 mb-6">
              You haven't enrolled in any courses yet. Browse our catalog to find courses that interest you.
            </p>
            <Link 
              href="/dashboard/student/courses" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </div>
      
      {/* Dashboard Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Activity and Events */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b">
              <button 
                className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 'courses' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('courses')}
              >
                Recommended Courses
              </button>
              <button 
                className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 'activity' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('activity')}
              >
                Recent Activity
              </button>
              <button 
                className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 'events' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('events')}
              >
                Upcoming Events
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="p-4">
              {activeTab === 'courses' && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-600">
                    Courses recommended based on your learning history and interests.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {student.recommendedCourses.map(course => (
                      <CourseCard key={course._id} course={course} />
                    ))}
                  </div>
                  <div className="flex justify-center">
                    <Link 
                      href="/dashboard/student/courses" 
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Browse More Courses <FaArrowRight className="ml-2" />
                    </Link>
                  </div>
                </div>
              )}
              
              {activeTab === 'activity' && (
                <div className="space-y-4">
                  {student.recentActivity.length > 0 ? (
                    <>
                      {student.recentActivity.map(activity => (
                        <ActivityItem key={activity._id} activity={activity} />
                      ))}
                      <div className="text-center pt-2">
                        <Link 
                          href="/dashboard/student/activity" 
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View All Activity
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p>No recent activity</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'events' && (
                <div className="space-y-4">
                  {student.upcomingEvents.length > 0 ? (
                    <>
                      {student.upcomingEvents.map(event => (
                        <div key={event._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 bg-blue-100 p-2 rounded-lg text-blue-600 mr-4">
                              <FaCalendarAlt />
                            </div>
                            <div>
                              <h4 className="font-medium">{event.title}</h4>
                              <p className="text-sm text-gray-600">{event.course}</p>
                              <div className="flex items-center mt-2 text-sm">
                                <FaClock className="text-gray-400 mr-1" />
                                <span className="text-gray-600">{formatDate(event.date)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700">
                              {event.type === 'live' ? 'Join Live' : 'View Details'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p>No upcoming events</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column - Notifications */}
        <div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
              <h3 className="font-medium">Notifications</h3>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {student.notifications.filter(n => !n.read).length} new
              </span>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {student.notifications.length > 0 ? (
                student.notifications.map(notification => (
                  <NotificationItem 
                    key={notification._id} 
                    notification={notification} 
                    onMarkAsRead={markNotificationAsRead}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaBell className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                  <p>No notifications</p>
                </div>
              )}
            </div>
            
            <div className="px-4 py-3 bg-gray-50 border-t text-center">
              <Link 
                href="/dashboard/student/notifications" 
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View All Notifications
              </Link>
            </div>
          </div>
          
          {/* Learning Stats */}
          <div className="bg-white rounded-lg shadow-sm mt-6 p-6">
            <h3 className="font-medium mb-4">Learning Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Courses Enrolled</span>
                <span className="font-medium">{student.enrollments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Videos Completed</span>
                <span className="font-medium">
                  {student.enrollments.reduce((acc, curr) => acc + curr.progress.completedVideos.length, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hours Learned</span>
                <span className="font-medium">12.5 hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Streak</span>
                <span className="font-medium">4 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}