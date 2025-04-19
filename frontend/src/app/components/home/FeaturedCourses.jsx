import Link from 'next/link';
import Image from 'next/image';
import { FaStar, FaUsers, FaClock } from 'react-icons/fa';
import CourseCard from '../ui/CourseCard';

// Dummy data for featured courses
const featuredCourses = [
  {
    id: 1,
    title: 'Introduction to Machine Learning',
    description: 'Learn the fundamentals of machine learning algorithms and their applications.',
    image: '/images/courses/machine-learning.jpg',
    instructor: {
      name: 'Dr. Sarah Johnson',
      avatar: '/images/instructors/sarah.jpg',
    },
    rating: 4.8,
    students: 3245,
    duration: '8 weeks',
    level: 'Intermediate',
    price: 49.99,
    category: 'Computer Science',
  },
  {
    id: 2,
    title: 'Modern Web Development',
    description: 'Master the latest web technologies including React, Node.js, and modern CSS.',
    image: '/images/courses/web-dev.jpg',
    instructor: {
      name: 'Michael Chen',
      avatar: '/images/instructors/michael.jpg',
    },
    rating: 4.9,
    students: 5621,
    duration: '10 weeks',
    level: 'All Levels',
    price: 59.99,
    category: 'Web Development',
  },
  {
    id: 3,
    title: 'Data Science Fundamentals',
    description: 'Explore data analysis, visualization, and statistical methods for insights.',
    image: '/images/courses/data-science.jpg',
    instructor: {
      name: 'Prof. James Wilson',
      avatar: '/images/instructors/james.jpg',
    },
    rating: 4.7,
    students: 2876,
    duration: '12 weeks',
    level: 'Beginner',
    price: 39.99,
    category: 'Data Science',
  },
  {
    id: 4,
    title: 'Artificial Intelligence Ethics',
    description: 'Understand the ethical implications and responsible use of AI technologies.',
    image: '/images/courses/ai-ethics.jpg',
    instructor: {
      name: 'Dr. Lisa Wong',
      avatar: '/images/instructors/lisa.jpg',
    },
    rating: 4.6,
    students: 1932,
    duration: '6 weeks',
    level: 'Advanced',
    price: 69.99,
    category: 'Artificial Intelligence',
  },
];

export default function FeaturedCourses() {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Featured Courses</h2>
        <Link href="/courses" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
          View All Courses
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      
      <div className="mt-12 bg-blue-50 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
          <h3 className="text-2xl font-bold mb-4">Become an Instructor</h3>
          <p className="text-gray-700 mb-4">
            Share your knowledge with our global community. Create engaging courses
            and help students achieve their goals while earning revenue.
          </p>
          <Link href="/become-instructor" className="btn-primary inline-block">
            Start Teaching Today
          </Link>
        </div>
        <div className="md:w-1/3 relative h-60 w-full">
          <Image
            src="/images/become-instructor.jpg"
            alt="Teacher with students"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}