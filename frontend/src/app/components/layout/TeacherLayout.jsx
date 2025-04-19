'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaHome, FaBook, FaUsers, FaVideo, 
  FaChartBar, FaCog, FaSignOutAlt, FaBars, FaTimes,
  FaPlusCircle, FaUpload
} from 'react-icons/fa';

export default function TeacherLayout({ children }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  
  useEffect(() => {
    // Set time only on client side to avoid hydration mismatch
    setCurrentTime('2025-04-19 07:31:14');
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    // Remove the Token cookie
    document.cookie = "Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Redirect to the homepage
    router.push('/');
  };

  const navItems = [
    { 
      icon: <FaHome />, 
      label: 'Dashboard', 
      href: '/dashboard/teacher'
    },
    { 
      icon: <FaBook />, 
      label: 'Courses', 
      href: '/dashboard/teacher/courses'
    },
    { 
      icon: <FaVideo />, 
      label: 'Videos', 
      href: '/dashboard/teacher/videos'
    },
    { 
      icon: <FaUsers />, 
      label: 'Students', 
      href: '/dashboard/teacher/students'
    }
    // { 
    //   icon: <FaChartBar />, 
    //   label: 'Analytics', 
    //   href: '/dashboard/teacher/analytics'
    // },
    // { 
    //   icon: <FaCog />, 
    //   label: 'Settings', 
    //   href: '/dashboard/teacher/settings'
    // },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile top bar */}
      <header className="bg-white shadow-sm lg:hidden">
        <div className="flex items-center justify-between p-4">
          <button onClick={toggleSidebar} className="text-gray-600 focus:outline-none">
            {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <div className="text-lg font-semibold">Teacher Portal</div>
          <div className="text-sm text-gray-500">@ZainJ5</div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <aside className={`
          bg-white shadow-md fixed inset-y-0 left-0 z-30 transform 
          lg:relative lg:translate-x-0 lg:w-64 lg:flex lg:flex-col
          ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
          transition-transform duration-300 ease-in-out
        `}>
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Teacher Portal</h2>
            <div className="text-sm text-gray-500 mt-2">@ZainJ5</div>
          </div>
          
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link 
                    href={item.href} 
                    className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors w-full"
                  >
                    <span className="mr-3 text-gray-500">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Quick Actions</h3>
              <ul className="space-y-1">
                <li>
                  <Link 
                    href="/dashboard/teacher/courses?create=true"
                    className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors"
                  >
                    <span className="mr-3 text-green-600"><FaPlusCircle /></span>
                    <span>Create New Course</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/dashboard/teacher/videos/upload"
                    className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors"
                  >
                    <span className="mr-3 text-purple-600"><FaUpload /></span>
                    <span>Upload Videos</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          
          <div className="p-4 border-t border-gray-100">
            <div className="text-sm font-medium mb-4">{currentTime}</div>
            <div className="text-xs text-gray-500 mb-2">Current User's Login:</div>
            <div className="text-sm font-medium mb-4">ZainJ5</div>
            <button 
              onClick={handleLogout}
              className="flex items-center p-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors w-full"
            >
              <span className="mr-3"><FaSignOutAlt /></span>
              <span>Logout</span>
            </button>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
      
      {/* <footer className="bg-white border-t p-4 text-center text-gray-500 text-sm">
        <p>
          {currentTime} | User: ZainJ5
        </p>
      </footer> */}
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}