'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaStar, FaPlay, FaUsers, FaClock, FaGraduationCap, 
  FaChalkboardTeacher, FaGlobe, FaCalendar, FaCertificate, 
  FaRegBookmark, FaBookmark, FaRegHeart, FaHeart, FaShare,
  FaRegCommentDots, FaChevronDown, FaChevronUp, FaDownload,
  FaBrain, FaRegFileAlt, FaSearch, FaRegLightbulb
} from 'react-icons/fa';

// Dummy course data
const courseData = {
  id: 1,
  title: 'Introduction to Machine Learning',
  subtitle: 'Master the fundamentals of ML algorithms and practical applications',
  description: 'This comprehensive course introduces you to the exciting world of Machine Learning. Starting from the basic concepts, you will gradually learn about various algorithms, their implementations, and real-world applications. The course includes hands-on projects, quizzes, and personalized feedback to ensure you gain practical experience alongside theoretical knowledge.',
  image: '/images/courses/machine-learning.jpg',
  previewVideo: 'https://www.youtube.com/embed/videoseries?list=PLLssT5z_DsK-h9vYZkQkYNWcItqhlRJLN',
  instructor: {
    id: 101,
    name: 'Dr. Sarah Johnson',
    avatar: '/images/instructors/sarah.jpg',
    title: 'AI Research Scientist & Professor',
    bio: 'Dr. Sarah Johnson has over 10 years of experience in machine learning research and teaching. She holds a Ph.D. in Computer Science from MIT and has published numerous papers in top AI conferences.',
    students: 15420,
    courses: 8,
    rating: 4.9,
  },
  rating: 4.8,
  reviewsCount: 1247,
  studentsCount: 3245,
  duration: '8 weeks',
  level: 'Intermediate',
  lastUpdated: '2025-03-15',
  language: 'English',
  price: 49.99,
  category: 'Computer Science',
  tags: ['Machine Learning', 'AI', 'Data Science', 'Python'],
  includes: [
    '24 hours on-demand video',
    '10 hands-on projects',
    '15 quizzes',
    '30 articles',
    '25 downloadable resources',
    'Full lifetime access',
    'Certificate of completion',
  ],
  requirements: [
    'Basic programming knowledge in Python',
    'Understanding of basic mathematics (algebra, calculus)',
    'No prior machine learning experience required',
  ],
  whatYouWillLearn: [
    'Understand the fundamental concepts of machine learning',
    'Implement supervised and unsupervised learning algorithms',
    'Apply machine learning models to real-world problems',
    'Evaluate and improve model performance',
    'Use popular machine learning libraries in Python',
  ],
  curriculum: [
    {
      title: 'Introduction to Machine Learning',
      lessons: [
        { title: 'What is Machine Learning?', duration: '15:20', type: 'video', isPreview: true },
        { title: 'Types of Machine Learning', duration: '12:45', type: 'video' },
        { title: 'Machine Learning Workflow', duration: '18:30', type: 'video' },
        { title: 'Introduction Quiz', type: 'quiz' },
      ],
    },
    {
      title: 'Supervised Learning',
      lessons: [
        { title: 'Linear Regression', duration: '22:15', type: 'video' },
        { title: 'Logistic Regression', duration: '19:40', type: 'video' },
        { title: 'Decision Trees', duration: '24:10', type: 'video' },
        { title: 'Support Vector Machines', duration: '28:35', type: 'video' },
        { title: 'Supervised Learning Project', type: 'project' },
      ],
    },
    {
      title: 'Unsupervised Learning',
      lessons: [
        { title: 'Clustering Algorithms', duration: '21:15', type: 'video' },
        { title: 'Dimensionality Reduction', duration: '18:20', type: 'video' },
        { title: 'Unsupervised Learning Project', type: 'project' },
      ],
    },
    {
      title: 'Neural Networks and Deep Learning',
      lessons: [
        { title: 'Introduction to Neural Networks', duration: '25:40', type: 'video' },
        { title: 'Deep Learning Frameworks', duration: '30:15', type: 'video' },
        { title: 'Building a Simple Neural Network', duration: '45:20', type: 'video' },
        { title: 'Deep Learning Project', type: 'project' },
      ],
    },
  ],
  reviews: [
    {
      id: 1,
      user: { name: 'Michael R.', avatar: '/images/users/michael.jpg' },
      rating: 5,
      date: '2025-04-01',
      content: 'Excellent course with in-depth explanations. The practical projects really helped solidify my understanding.',
    },
    {
      id: 2,
      user: { name: 'Sophia T.', avatar: '/images/users/sophia.jpg' },
      rating: 4,
      date: '2025-03-24',
      content: 'Great content, though some advanced topics could use more examples. Overall, definitely worth taking if you want to get into ML.',
    },
    {
      id: 3,
      user: { name: 'David W.', avatar: '/images/users/david.jpg' },
      rating: 5,
      date: '2025-03-15',
      content: 'Dr. Johnson is an excellent instructor who explains complex concepts in an easy-to-understand manner. Highly recommended!',
    },
  ],
  // Dummy transcript data for AI features demo
  aiTranscript: {
    currentVideo: 'What is Machine Learning?',
    transcript: [
      { time: '00:00', text: 'Welcome to the first lecture of our machine learning course.' },
      { time: '00:15', text: 'Today, we\'ll explore what machine learning is and why it\'s becoming increasingly important in today\'s technology landscape.' },
      { time: '00:30', text: 'Machine learning is a subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed.' },
      { time: '00:45', text: 'The process of learning begins with observations or data, such as examples, direct experience, or instruction.' },
      { time: '01:00', text: 'The primary aim is to allow the computers to learn automatically without human intervention or assistance and adjust actions accordingly.' },
      // More transcript entries would be here
    ],
    summary: 'This introductory lecture covers the definition of machine learning, its relationship to artificial intelligence, and why it matters. The video explains how machines learn from data and experience rather than explicit programming, and outlines the main types of machine learning: supervised, unsupervised, and reinforcement learning. Key concepts like training data, features, and models are introduced with simple examples.',
    keyPoints: [
      'Machine learning is a subset of AI focused on automatic learning from data',
      'Learning occurs without explicit programming',
      'Main types: supervised, unsupervised, reinforcement learning',
      'ML systems learn patterns from training data',
      'Applications include recommendation systems, image recognition, and natural language processing'
    ],
    relatedResources: [
      { title: 'Introduction to Statistical Learning', type: 'Book' },
      { title: 'ML Applications in Healthcare', type: 'Article' },
      { title: 'History of AI and Machine Learning', type: 'Video' }
    ]
  }
};

// Dummy related courses
const relatedCourses = [
  {
    id: 2,
    title: 'Deep Learning Specialization',
    instructor: 'Prof. Alex Lee',
    image: '/images/courses/deep-learning.jpg',
    rating: 4.9,
    students: 4522,
    price: 59.99,
  },
  {
    id: 3,
    title: 'Python for Data Science',
    instructor: 'Emma Watson',
    image: '/images/courses/python-data.jpg',
    rating: 4.7,
    students: 7845,
    price: 44.99,
  },
  {
    id: 4,
    title: 'Natural Language Processing',
    instructor: 'Dr. James Wilson',
    image: '/images/courses/nlp.jpg',
    rating: 4.8,
    students: 3210,
    price: 54.99,
  },
];

export default function CourseDetail({ params }) {
  // In a real app, you would fetch the course data based on the ID
  const course = courseData;
  const videoRef = useRef(null);
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [expandedSections, setExpandedSections] = useState(
    course.curriculum.map((_, index) => index === 0) // Only first section expanded by default
  );
  const [activeTab, setActiveTab] = useState('overview');
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [searchTranscript, setSearchTranscript] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const toggleSection = (index) => {
    const newExpandedSections = [...expandedSections];
    newExpandedSections[index] = !newExpandedSections[index];
    setExpandedSections(newExpandedSections);
  };
  
  const jumpToTime = (timeStr) => {
    if (videoRef.current) {
      const [minutes, seconds] = timeStr.split(':').map(Number);
      const timeInSeconds = minutes * 60 + seconds;
      videoRef.current.currentTime = timeInSeconds;
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };
  
  // Calculate total course stats
  const totalLessons = course.curriculum.reduce(
    (sum, section) => sum + section.lessons.length, 0
  );
  
  const totalVideoDuration = course.curriculum.reduce((sum, section) => {
    return sum + section.lessons.reduce((sectionSum, lesson) => {
      if (lesson.type === 'video' && lesson.duration) {
        const [minutes, seconds] = lesson.duration.split(':').map(Number);
        return sectionSum + minutes + seconds / 60;
      }
      return sectionSum;
    }, 0);
  }, 0);
  
  // Format total duration as hours and minutes
  const totalHours = Math.floor(totalVideoDuration / 60);
  const totalMinutes = Math.round(totalVideoDuration % 60);
  const formattedDuration = `${totalHours}h ${totalMinutes}m`;

  // Filter transcript based on search
  const filteredTranscript = searchTranscript 
    ? course.aiTranscript.transcript.filter(item => 
        item.text.toLowerCase().includes(searchTranscript.toLowerCase())
      )
    : course.aiTranscript.transcript;

  return (
    <div className="bg-gray-50">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-2/3 lg:pr-8">
              <div className="mb-6">
                <div className="flex items-center space-x-2 text-sm mb-2">
                  <Link href="/courses" className="hover:underline">
                    Courses
                  </Link>
                  <span>›</span>
                  <Link href={`/courses?category=${course.category}`} className="hover:underline">
                    {course.category}
                  </Link>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
                <p className="text-xl text-blue-200 mb-4">{course.subtitle}</p>
                
                <div className="flex items-center flex-wrap gap-4">
                  <div className="flex items-center">
                    <div className="flex items-center text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.floor(course.rating) ? "text-yellow-400" : "text-gray-400"} />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">
                      {course.rating} ({course.reviewsCount} reviews)
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <FaUsers className="mr-2" />
                    <span>{course.studentsCount.toLocaleString()} students</span>
                  </div>
                  
                  <div className="flex items-center">
                    <FaClock className="mr-2" />
                    <span>{formattedDuration} total</span>
                  </div>
                  
                  <div className="flex items-center">
                    <FaGlobe className="mr-2" />
                    <span>{course.language}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <FaCalendar className="mr-2" />
                    <span>Last updated {course.lastUpdated}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <Image
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium">{course.instructor.name}</p>
                  <p className="text-sm text-blue-200">{course.instructor.title}</p>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/3 mt-6 lg:mt-0">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden text-gray-800">
                <div className="relative aspect-video">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                    <button className="bg-white bg-opacity-90 text-blue-600 rounded-full p-4 transition-transform hover:scale-110">
                      <FaPlay size={24} />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl font-bold">${course.price}</div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className="p-2 rounded-full hover:bg-gray-100"
                        aria-label={isBookmarked ? "Remove bookmark" : "Bookmark course"}
                      >
                        {isBookmarked ? 
                          <FaBookmark className="text-blue-600" /> : 
                          <FaRegBookmark />
                        }
                      </button>
                      <button 
                        onClick={() => setIsLiked(!isLiked)}
                        className="p-2 rounded-full hover:bg-gray-100"
                        aria-label={isLiked ? "Remove like" : "Like course"}
                      >
                        {isLiked ? 
                          <FaHeart className="text-red-500" /> : 
                          <FaRegHeart />
                        }
                      </button>
                      <button 
                        className="p-2 rounded-full hover:bg-gray-100"
                        aria-label="Share course"
                      >
                        <FaShare />
                      </button>
                    </div>
                  </div>
                  
                  <button className="w-full btn-primary mb-3 flex items-center justify-center">
                    Enroll Now
                  </button>
                  <button className="w-full btn-outline mb-6">
                    Try Free Preview
                  </button>
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Level:</span>
                      <span className="font-medium">{course.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lectures:</span>
                      <span className="font-medium">{totalLessons}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Video:</span>
                      <span className="font-medium">{formattedDuration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Access:</span>
                      <span className="font-medium">Lifetime</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium mb-2">This course includes:</h4>
                    <ul className="space-y-2">
                      {course.includes.map((item, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <span className="text-green-500 mr-2">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8 border-b">
          <div className="flex flex-wrap -mb-px">
            {['overview', 'curriculum', 'instructor', 'reviews', 'ai-features'].map((tab) => (
              <button
                key={tab}
                className={`inline-block p-4 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                <p className="text-gray-700 mb-8">
                  {course.description}
                </p>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">What You Will Learn</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {course.whatYouWillLearn.map((item, index) => (
                      <div key={index} className="flex">
                        <div className="text-green-500 mr-3 mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Requirements</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {course.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <Link 
                        key={index} 
                        href={`/courses?tag=${tag}`}
                        className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full text-sm text-gray-700 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Curriculum Tab */}
            {activeTab === 'curriculum' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
                <div className="mb-4 flex justify-between items-center text-sm text-gray-600">
                  <div>{totalLessons} lessons</div>
                  <div>Total: {formattedDuration}</div>
                </div>
                
                <div className="space-y-4">
                  {course.curriculum.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        className="w-full bg-gray-50 px-6 py-4 flex justify-between items-center"
                        onClick={() => toggleSection(sectionIndex)}
                      >
                        <div className="font-medium text-left">
                          <span className="mr-2">Section {sectionIndex + 1}:</span>
                          {section.title}
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-3">
                            {section.lessons.length} lessons
                          </span>
                          {expandedSections[sectionIndex] ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                      </button>
                      
                      {expandedSections[sectionIndex] && (
                        <div className="divide-y divide-gray-200">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="flex justify-between items-center p-4 hover:bg-gray-50">
                              <div className="flex items-center">
                                {lesson.type === 'video' ? (
                                  <div className="mr-3 text-blue-600">
                                    <FaPlay size={14} />
                                  </div>
                                ) : lesson.type === 'quiz' ? (
                                  <div className="mr-3 text-green-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                ) : (
                                  <div className="mr-3 text-orange-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium">{lesson.title}</div>
                                  <div className="text-sm text-gray-600">
                                    {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
                                    {lesson.isPreview && (
                                      <span className="ml-2 text-blue-600">(Preview available)</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {lesson.duration && (
                                <div className="text-gray-600 text-sm">{lesson.duration}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Instructor Tab */}
            {activeTab === 'instructor' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Your Instructor</h2>
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                  <div className="md:w-1/4">
                    <Image
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-bold">{course.instructor.name}</h3>
                    <p className="text-gray-600 mb-4">{course.instructor.title}</p>
                    
                    <div className="flex space-x-8 mb-4 text-sm">
                      <div className="flex flex-col items-center">
                        <div className="text-blue-600 text-2xl font-bold">{course.instructor.rating}</div>
                        <div className="text-gray-600">Instructor Rating</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-blue-600 text-2xl font-bold">{course.instructor.reviews || 389}</div>
                        <div className="text-gray-600">Reviews</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-blue-600 text-2xl font-bold">{course.instructor.students.toLocaleString()}</div>
                        <div className="text-gray-600">Students</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-blue-600 text-2xl font-bold">{course.instructor.courses}</div>
                        <div className="text-gray-600">Courses</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700">
                      {course.instructor.bio}
                    </p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-3">Other Courses by {course.instructor.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg shadow-sm p-4 flex">
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src="/images/courses/data-science.jpg"
                          alt="Advanced Machine Learning"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium">Advanced Machine Learning Techniques</h4>
                        <div className="flex items-center text-sm my-1">
                          <div className="flex text-yellow-400">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                          </div>
                          <span className="ml-1 text-gray-600">5.0</span>
                        </div>
                        <p className="text-blue-600 font-medium">$59.99</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm p-4 flex">
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src="/images/courses/ai-ethics.jpg"
                          alt="AI Ethics"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium">AI Ethics and Governance</h4>
                        <div className="flex items-center text-sm my-1">
                          <div className="flex text-yellow-400">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <div className="flex items-center">
                              <FaStar className="text-gray-300" />
                            </div>
                          </div>
                          <span className="ml-1 text-gray-600">4.8</span>
                        </div>
                        <p className="text-blue-600 font-medium">$49.99</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                  <h2 className="text-2xl font-bold">Student Reviews</h2>
                  <button className="mt-2 md:mt-0 btn-outline">Write a Review</button>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg mb-8 flex flex-col md:flex-row items-center">
                  <div className="md:w-1/4 flex flex-col items-center mb-4 md:mb-0">
                    <div className="text-5xl font-bold text-blue-600 mb-2">{course.rating}</div>
                    <div className="flex text-yellow-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < Math.floor(course.rating) ? "text-yellow-400" : "text-gray-300"} 
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">Course Rating</div>
                  </div>
                  
                  <div className="md:w-3/4 w-full">
                    {/* Rating breakdown bars */}
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        // Calculate percentage based on dummy data (normally from API)
                        let percentage;
                        if (stars === 5) percentage = 68;
                        else if (stars === 4) percentage = 20;
                        else if (stars === 3) percentage = 8;
                        else if (stars === 2) percentage = 3;
                        else percentage = 1;
                        
                        return (
                          <div key={stars} className="flex items-center">
                            <div className="flex items-center w-16">
                              <span className="mr-2">{stars}</span>
                              <FaStar className="text-yellow-400" />
                            </div>
                            <div className="flex-1 h-3 mx-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-yellow-400 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <div className="w-12 text-right text-sm text-gray-600">{percentage}%</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Review filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button className="btn-outline py-1 px-3 text-sm">All Reviews</button>
                  <button className="bg-gray-200 text-gray-700 py-1 px-3 rounded-lg text-sm hover:bg-gray-300">5 Stars</button>
                  <button className="bg-gray-200 text-gray-700 py-1 px-3 rounded-lg text-sm hover:bg-gray-300">4 Stars</button>
                  <button className="bg-gray-200 text-gray-700 py-1 px-3 rounded-lg text-sm hover:bg-gray-300">3 Stars</button>
                  <button className="bg-gray-200 text-gray-700 py-1 px-3 rounded-lg text-sm hover:bg-gray-300">2 Stars</button>
                  <button className="bg-gray-200 text-gray-700 py-1 px-3 rounded-lg text-sm hover:bg-gray-300">1 Star</button>
                </div>
                
                {/* Reviews list */}
                <div className="space-y-6">
                  {course.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <Image
                            src={review.user.avatar}
                            alt={review.user.name}
                            width={40}
                            height={40}
                            className="rounded-full mr-3"
                          />
                          <div>
                            <h4 className="font-medium">{review.user.name}</h4>
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <FaStar 
                                  key={i} 
                                  className={i < review.rating ? "text-yellow-400" : "text-gray-300"} 
                                  size={14}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">{review.date}</div>
                      </div>
                      <p className="text-gray-700">{review.content}</p>
                      
                      <div className="flex mt-4 text-sm">
                        <button className="flex items-center text-gray-600 hover:text-blue-600 mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                          Helpful (12)
                        </button>
                        <button className="flex items-center text-gray-600 hover:text-blue-600">
                          <FaRegCommentDots className="mr-1" />
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 text-center">
                  <button className="btn-outline">Load More Reviews</button>
                </div>
              </div>
            )}
            
            {/* AI Features Tab */}
            {activeTab === 'ai-features' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">AI-Enhanced Learning Tools</h2>
                
                {/* Video player with transcript */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                  <div className="p-4 bg-gray-50 border-b">
                    <h3 className="font-bold">{course.aiTranscript.currentVideo}</h3>
                  </div>
                  
                  <div className="aspect-video bg-black relative">
                    <div className="flex items-center justify-center h-full">
                      {/* In a real app, this would be an actual video player */}
                      <video 
                        ref={videoRef}
                        controls
                        className="w-full h-full"
                        poster={course.image}
                        onTimeUpdate={(e) => setCurrentVideoTime(e.target.currentTime)}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      >
                        <source src="/videos/sample.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                  
                  <div className="p-4 flex gap-4 border-b">
                    <button className="btn-outline text-sm py-1 flex items-center">
                      <FaDownload className="mr-2" />
                      Download Transcript
                    </button>
                    <button className="bg-blue-100 text-blue-800 rounded-lg px-3 py-1 text-sm flex items-center">
                      <FaBrain className="mr-2" />
                      AI Summary
                    </button>
                    <button className="bg-purple-100 text-purple-800 rounded-lg px-3 py-1 text-sm flex items-center">
                      <FaRegFileAlt className="mr-2" />
                      Study Notes
                    </button>
                  </div>
                  
                  {/* Transcript section */}
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold">AI-Generated Transcript</h3>
                      <div className="relative w-64">
                        <input
                          type="text"
                          placeholder="Search in transcript..."
                          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={searchTranscript}
                          onChange={(e) => setSearchTranscript(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg">
                      <div className="p-4 space-y-2">
                        {filteredTranscript.map((item, index) => (
                          <div 
                            key={index} 
                            className="flex cursor-pointer hover:bg-blue-50 p-1 rounded"
                            onClick={() => jumpToTime(item.time)}
                          >
                            <div className="w-14 text-sm font-mono text-blue-600">{item.time}</div>
                            <div className="flex-1">{item.text}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* AI Summary */}
                <div className="bg-blue-50 rounded-lg p-6 mb-8">
                  <div className="flex items-center mb-4">
                    <FaBrain className="text-blue-600 mr-2" size={20} />
                    <h3 className="text-xl font-bold">AI-Generated Summary</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    {course.aiTranscript.summary}
                  </p>
                  
                  <div className="mt-4">
                    <h4 className="font-bold mb-2">Key Points:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {course.aiTranscript.keyPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* AI-suggested related resources */}
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <FaRegLightbulb className="text-purple-600 mr-2" size={20} />
                    <h3 className="text-xl font-bold">AI-Suggested Resources</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Based on this lecture, our AI recommends these additional resources to enhance your learning:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {course.aiTranscript.relatedResources.map((resource, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-sm text-purple-600 font-medium mb-1">{resource.type}</div>
                        <h4 className="font-medium">{resource.title}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Sidebar */}
          <div>
            {/* Related Courses */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Related Courses</h3>
              <div className="space-y-4">
                {relatedCourses.map((course) => (
                  <Link href={`/courses/${course.id}`} key={course.id} className="block">
                    <div className="flex items-start">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={course.image}
                          alt={course.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-sm">{course.title}</h4>
                        <p className="text-gray-600 text-xs mb-1">{course.instructor}</p>
                        <div className="flex items-center text-xs">
                          <div className="flex items-center text-yellow-400">
                            <FaStar size={12} />
                            <span className="ml-1 text-gray-700">{course.rating}</span>
                          </div>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-gray-600">{course.students.toLocaleString()} students</span>
                        </div>
                        <div className="font-medium text-blue-600 text-sm mt-1">${course.price}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Course Tags */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Course Tags</h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, index) => (
                  <Link 
                    key={index} 
                    href={`/courses?tag=${tag}`}
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full text-sm text-gray-700 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Share Course */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Share This Course</h3>
              <div className="flex space-x-3">
                <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>
                </button>
                <button className="bg-sky-500 text-white p-2 rounded-full hover:bg-sky-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </button>
                <button className="bg-blue-800 text-white p-2 rounded-full hover:bg-blue-900">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                  </svg>
                </button>
                <button className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
                  </svg>
                </button>
                <button className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                  </svg>
                </button>
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-600 mb-2">Or copy link:</div>
                <div className="flex">
                  <input
                    type="text"
                    value={`https://educonnect.com/courses/${course.id}`}
                    readOnly
                    className="flex-1 text-sm p-2 border border-gray-300 rounded-l-lg focus:outline-none"
                  />
                  <button className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg px-3 hover:bg-gray-200">
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}