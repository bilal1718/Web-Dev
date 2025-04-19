'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes, FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with actual auth context

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo.svg" alt="EduConnect Logo" width={40} height={40} />
            <span className="ml-2 text-xl font-bold text-blue-600">EduConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/courses" className="text-gray-700 hover:text-blue-600 transition-colors">
              Courses
            </Link>
            <Link href="/teachers" className="text-gray-700 hover:text-blue-600 transition-colors">
              Teachers
            </Link>
            <Link href="/community" className="text-gray-700 hover:text-blue-600 transition-colors">
              Community
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <button className="text-gray-700 hover:text-blue-600 relative">
                  <FaBell size={20} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    3
                  </span>
                </button>
                <Link href="/dashboard" className="flex items-center text-gray-700 hover:text-blue-600">
                  <Image
                    src="/images/avatar.jpg"
                    alt="User avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="ml-2">My Account</span>
                </Link>
                <Link href="/auth/logout" className="btn-outline">
                  Log Out
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="text-gray-700 hover:text-blue-600">
                  Log In
                </Link>
                <Link href="/auth/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-inner">
          <div className="flex flex-col space-y-3">
            <Link
              href="/courses"
              className="text-gray-700 hover:text-blue-600 py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              href="/teachers"
              className="text-gray-700 hover:text-blue-600 py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Teachers
            </Link>
            <Link
              href="/community"
              className="text-gray-700 hover:text-blue-600 py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Community
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            
            <div className="relative my-2">
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-blue-600 py-2 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Image
                    src="/images/avatar.jpg"
                    alt="User avatar"
                    width={24}
                    height={24}
                    className="rounded-full mr-2"
                  />
                  My Account
                </Link>
                <Link
                  href="/notifications"
                  className="text-gray-700 hover:text-blue-600 py-2 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaBell className="mr-2" />
                  Notifications
                  <span className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    3
                  </span>
                </Link>
                <Link href="/auth/logout" className="btn-outline w-full mt-2">
                  Log Out
                </Link>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                <Link
                  href="/auth/login"
                  className="btn-outline text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-primary text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}