import Link from 'next/link';
import Image from 'next/image';
import { FaChalkboardTeacher, FaLaptop, FaUserGraduate, FaComments } from 'react-icons/fa';
import FeaturedCourses from '../app/components/home/FeaturedCourses';
import Testimonials from '../app/components/home/Testimonials';
import InfoStats from '../app/components/home/InfoStats';

export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Learn Without Limits
            </h1>
            <p className="text-xl md:pr-12">
              Join our AI-powered learning platform that connects teachers and students worldwide
              for interactive, accessible education.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link href="/courses" className="btn-secondary">
                Browse Courses
              </Link>
              <Link href="/auth/register" className="bg-white text-blue-700 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-colors">
                Sign Up Free
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <div className="relative h-80 w-full">
              <Image
                src="/images/hero-image.jpg"
                alt="Students learning online"
                fill
                className="object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose EduConnect?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card p-6 text-center">
            <div className="text-4xl text-blue-600 mx-auto mb-4">
              <FaLaptop className="inline" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Enhanced Learning</h3>
            <p className="text-gray-600">
              Smart transcripts, content summarization, and personalized learning recommendations.
            </p>
          </div>
          <div className="card p-6 text-center">
            <div className="text-4xl text-blue-600 mx-auto mb-4">
              <FaChalkboardTeacher className="inline" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
            <p className="text-gray-600">
              Learn from qualified teachers across institutions worldwide.
            </p>
          </div>
          <div className="card p-6 text-center">
            <div className="text-4xl text-blue-600 mx-auto mb-4">
              <FaComments className="inline" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-Time Interaction</h3>
            <p className="text-gray-600">
              Live discussions, Q&A sessions, and community support.
            </p>
          </div>
          <div className="card p-6 text-center">
            <div className="text-4xl text-blue-600 mx-auto mb-4">
              <FaUserGraduate className="inline" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Learn at Your Pace</h3>
            <p className="text-gray-600">
              Flexible course schedules and on-demand access to all materials.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <FeaturedCourses />

      {/* Stats Section */}
      <InfoStats />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning Experience?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of students and teachers already using EduConnect to improve their educational journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link href="/auth/register?role=teacher" className="btn-primary">
              Become an Instructor
            </Link>
            <Link href="/courses" className="btn-outline">
              Explore Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}