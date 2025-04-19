import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaBell, FaComment, FaUserGraduate, FaInfo, FaCheckCircle, FaTimes } from 'react-icons/fa';

export default function NotificationPanel({ notifications, onClose }) {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return <FaComment className="text-blue-500" />;
      case 'enrollment':
        return <FaUserGraduate className="text-green-500" />;
      case 'system':
        return <FaInfo className="text-purple-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };
  
  const markAllAsRead = () => {
    // In a real app, this would make an API call
    console.log('Marking all notifications as read');
    // For now, just close the panel
    onClose();
  };
  
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
        <h3 className="text-sm font-medium">Notifications</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
          aria-label="Close notifications"
        >
          <FaTimes />
        </button>
      </div>
      
      {notifications.length > 0 ? (
        <>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`px-4 py-3 border-b hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex">
                  <div className="flex-shrink-0 mr-3 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">{notification.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="px-4 py-2 bg-gray-50 flex justify-between items-center text-sm">
            <button 
              onClick={markAllAsRead}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              <FaCheckCircle className="mr-1" />
              Mark all as read
            </button>
            <Link href="/dashboard/teacher/notifications" className="text-gray-600 hover:text-gray-800">
              View all
            </Link>
          </div>
        </>
      ) : (
        <div className="p-4 text-center text-gray-500">
          <div className="flex justify-center mb-2">
            <FaBell className="text-gray-300" size={24} />
          </div>
          <p>No new notifications</p>
        </div>
      )}
    </div>
  );
}