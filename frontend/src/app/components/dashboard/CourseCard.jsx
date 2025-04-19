import Link from 'next/link';
import Image from 'next/image';
import { FaUsers, FaVideo, FaStar, FaEllipsisV } from 'react-icons/fa';

export default function CourseCard({ course }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative h-36">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover"
        />
        {course.progress < 100 && (
          <div className="absolute inset-x-0 bottom-0 bg-white bg-opacity-90 px-4 py-1">
            <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-blue-600 rounded-full"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-right mt-0.5 text-gray-500">
              {course.progress}% complete
            </p>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 truncate">
          <Link href={`/dashboard/teacher/courses/${course.id}`} className="hover:text-blue-600">
            {course.title}
          </Link>
        </h3>
        
        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
          <div className="flex items-center">
            <FaUsers className="mr-1 text-gray-400" size={14} />
            <span>{course.students}</span>
          </div>
          <div className="flex items-center">
            <FaVideo className="mr-1 text-gray-400" size={14} />
            <span>{course.videos}</span>
          </div>
          <div className="flex items-center">
            <FaStar className="mr-1 text-yellow-400" size={14} />
            <span>{course.rating}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Last updated: <span className="font-medium">{course.lastUpdated}</span>
          </div>
          <div className="flex space-x-2">
            <Link 
              href={`/dashboard/teacher/courses/${course.id}/edit`}
              className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
            >
              Edit
            </Link>
            <Link 
              href={`/dashboard/teacher/courses/${course.id}/content`}
              className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
            >
              Content
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}