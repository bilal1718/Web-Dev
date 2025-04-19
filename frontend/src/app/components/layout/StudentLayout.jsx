'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaGraduationCap, FaBook, FaSearch, FaBell, 
  FaComments, FaUserCircle, FaSignOutAlt, 
  FaBars, FaTimes, FaQuestionCircle, FaCertificate
} from 'react-icons/fa';

export default function StudentLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('2025-04-19 08:08:13');
  
  // Check if mobile on initial render and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024 && isSidebarOpen) {
        setIsSidebarOpen(false);
      } else if (window.innerWidth >= 1024 && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };
    
    // Check on initial render
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Update date time every second
    const timer = setInterval(() => {
      const now = new Date();
      const formattedDateTime = now.toISOString().replace('T', ' ').substring(0, 19);
      setCurrentDateTime(formattedDateTime);
    }, 1000);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('resize', checkIfMobile);
      clearInterval(timer);
    };
  }, [isSidebarOpen]);

  // Mock student data
  const student = {
    name: 'Alex Johnson',
    avatar: '/images/students/alex.jpg',
    role: 'Student',
    unreadNotifications: 4
  };

  // Navigation items
  const navItems = [
    { name: 'Dashboard', path: '/dashboard/student', icon: <FaGraduationCap /> },
    { name: 'Browse Courses', path: '/dashboard/student/courses', icon: <FaSearch /> },
    { name: 'My Learning', path: '/dashboard/student/learning', icon: <FaBook /> },
    { name: 'Messages', path: '/dashboard/student/messages', icon: <FaComments /> },
    { name: 'Certificates', path: '/dashboard/student/certificates', icon: <FaCertificate /> },
    { name: 'Profile', path: '/dashboard/student/profile', icon: <FaUserCircle /> },
  ];

  const isActive = (path) => {
    if (path === '/dashboard/student') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-sm py-3 px-4 flex items-center justify-between">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-700"
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image src="/logo.svg" alt="EduConnect Logo" width={32} height={32} />
            <span className="ml-2 text-lg font-bold text-blue-600">EduConnect</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full relative">
            <FaBell size={20} className="text-gray-600" />
            {student.unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {student.unreadNotifications}
              </span>
            )}
          </button>
          <Image
            src={student.avatar}
            alt={student.name}
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
      </header>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative bg-white w-64 max-w-xs h-full flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <Image
                  src={student.avatar}
                  alt={student.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium">{student.name}</div>
                  <div className="text-xs text-gray-500">{student.role}</div>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-500"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isActive(item.path)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="mt-6">
                  <Link
                    href="/help"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaQuestionCircle className="mr-3" />
                    Help & Support
                  </Link>
                  <Link
                    href="/auth/login"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaSignOutAlt className="mr-3" />
                    Sign Out
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside 
          className={`bg-white fixed inset-y-0 left-0 z-10 w-64 border-r border-gray-200 transition-transform duration-300 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } ${isMobile ? 'lg:translate-x-0' : ''} lg:static lg:translate-x-0`}
        >
          <div className="h-full flex flex-col">
            {/* Sidebar Header with Logo */}
            <div className="p-4 border-b border-gray-200 flex items-center">
              <Link href="/" className="flex items-center">
                <Image src="/logo.svg" alt="EduConnect Logo" width={32} height={32} />
                <span className="ml-2 text-lg font-bold text-blue-600">EduConnect</span>
              </Link>
            </div>
            
            {/* Student Profile */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <Image
                  src={student.avatar}
                  alt={student.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium">{student.name}</div>
                  <div className="text-xs text-gray-500">{student.role}</div>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isActive(item.path)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
            
            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="space-y-1">
                <Link
                  href="/help"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <FaQuestionCircle className="mr-3" />
                  Help & Support
                </Link>
                <Link
                  href="/auth/login"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <FaSignOutAlt className="mr-3" />
                  Sign Out
                </Link>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 relative">
          {/* Desktop Header */}
          <header className="hidden lg:flex sticky top-0 z-10 bg-white border-b border-gray-200 h-16 items-center px-6">
            <div className="flex-1 flex">
              <button
                className="mr-4 text-gray-500 lg:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
              
              <div className="max-w-lg w-full lg:max-w-xs relative">
                <div className="relative">
                  <input
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search for courses..."
                    type="search"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <FaBell size={20} />
                  {student.unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {student.unreadNotifications}
                    </span>
                  )}
                </button>
              </div>
              
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full">
                  <Image
                    src={student.avatar}
                    alt={student.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
                <span className="ml-2 font-medium text-sm text-gray-700">
                  {student.name}
                </span>
              </div>
            </div>
          </header>
          
          {/* Page Content */}
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
      
      {/* Current date/time footer */}
      <footer className="bg-white border-t border-gray-200 py-3 px-6 text-center text-sm text-gray-500">
        <p>Current Date and Time (UTC): {currentDateTime} | User: ZainJ5</p>
      </footer>
    </div>
  );
}