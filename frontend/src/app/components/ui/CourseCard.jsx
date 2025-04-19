import Link from 'next/link';
import Image from 'next/image';
import { FaStar, FaUsers, FaClock } from 'react-icons/fa';

export default function CourseCard({ course }) {
  return (
    <div className="card overflow-hidden flex flex-col h-full transition-all hover:translate-y-[-5px]">
      <div className="relative h-48">
        <Image
          src={course.image || '/images/course-placeholder.jpg'}
          alt={course.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-sm font-medium px-2 py-1 rounded">
          {course.category}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center mb-2">
          <div className="flex items-center text-yellow-400 mr-2">
            <FaStar />
            <span className="ml-1 text-gray-800 text-sm font-medium">{course.rating}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <FaUsers className="mr-1" />
            <span>{course.students.toLocaleString()} students</span>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
          <Link href={`/courses/${course.id}`} className="hover:text-blue-600 transition-colors">
            {course.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <FaClock className="mr-1" />
            <span>{course.duration}</span>
          </div>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {course.level}
          </span>
        </div>
        
        <div className="border-t pt-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src={course.instructor.avatar}
              alt={course.instructor.name}
              width={32}
              height={32}
              className="rounded-full mr-2"
            />
            <span className="text-sm font-medium">{course.instructor.name}</span>
          </div>
          <div className="font-bold text-blue-600">
            ${course.price.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}