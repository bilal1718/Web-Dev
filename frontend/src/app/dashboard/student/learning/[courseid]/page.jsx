'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  FaArrowLeft, FaPlay, FaPause, FaExpand, 
  FaVolumeUp, FaVolumeMute, FaCog, FaSearch,
  FaDownload, FaEye, FaCheck, FaComments, FaFilePdf,
  FaBrain, FaLightbulb, FaList, FaTimes
} from 'react-icons/fa';
import StudentLayout from '../../../../components/layout/StudentLayout';

// Dummy course data based on the schema
const courseData = {
  _id: "68034910156720d4a255e6de",
  title: "Web Development Fundamentals",
  description: "Learn the basics of web development with HTML, CSS and JavaScript",
  thumbnail: "/images/courses/web-dev.jpg",
  tutor: {
    _id: "68034015ff6522d2a982be57",
    name: "Professor Chad",
    avatar: "/images/teachers/chad.jpg"
  },
  videos: [
    {
      _id: "68034933156720d4a255e6e1",
      title: "Introduction to HTML",
      videoUrl: "https://res.cloudinary.com/dxx85aaii/video/upload/v1745045807/edtech-videos/video-1745045804365.mp4",
      duration: "10:15",
      order: 0,
      transcript: "Welcome to our introduction to HTML! HTML stands for HyperText Markup Language. It's the standard markup language for documents designed to be displayed in a web browser. It can be assisted by technologies such as Cascading Style Sheets and scripting languages such as JavaScript. HTML elements are the building blocks of HTML pages. With HTML constructs, images and other objects, such as interactive forms, may be embedded into the rendered page."
    },
    {
      _id: "68034933156720d4a255e6e2",
      title: "Working with CSS",
      videoUrl: "https://res.cloudinary.com/dxx85aaii/video/upload/v1745045807/edtech-videos/video-1745045804366.mp4",
      duration: "15:30",
      order: 1,
      transcript: "CSS stands for Cascading Style Sheets. CSS describes how HTML elements are to be displayed on screen, paper, or in other media. CSS saves a lot of work. It can control the layout of multiple web pages all at once. External stylesheets are stored in CSS files. With CSS, you can control the color, font, the size of text, the spacing between elements, how elements are positioned and laid out, what background images or colors are to be used, different displays for different devices and screen sizes, and much more!"
    },
    {
      _id: "68034933156720d4a255e6e3",
      title: "JavaScript Basics",
      videoUrl: "https://res.cloudinary.com/dxx85aaii/video/upload/v1745045807/edtech-videos/video-1745045804367.mp4",
      duration: "20:45",
      order: 2,
      transcript: "JavaScript is a programming language that conforms to the ECMAScript specification. JavaScript is high-level, often just-in-time compiled, and multi-paradigm. It has curly-bracket syntax, dynamic typing, prototype-based object-orientation, and first-class functions. Alongside HTML and CSS, JavaScript is one of the core technologies of the World Wide Web. JavaScript enables interactive web pages and is an essential part of web applications. The vast majority of websites use it for client-side page behavior, and all major web browsers have a dedicated JavaScript engine to execute it."
    }
  ],
  sections: [
    {
      _id: "section1",
      title: "Getting Started",
      videos: ["68034933156720d4a255e6e1"]
    },
    {
      _id: "section2",
      title: "Styling Your Website",
      videos: ["68034933156720d4a255e6e2"]
    },
    {
      _id: "section3",
      title: "Adding Interactivity",
      videos: ["68034933156720d4a255e6e3"]
    }
  ]
};

// Enrollment data
const enrollmentData = {
  _id: "68035693b925c54c3cf171b1",
  student: "68035537159d7673f4032cc2",
  course: "68034910156720d4a255e6de",
  progress: {
    completedVideos: ["68034933156720d4a255e6e1"],
    lastWatched: "68034933156720d4a255e6e2"
  }
};

// Chat messages for this course
const chatMessages = [
  {
    _id: "6803543d1c4c2a70e8847049",
    course: "68034910156720d4a255e6de",
    sender: {
      _id: "68034015ff6522d2a982be57",
      name: "Professor Chad",
      avatar: "/images/teachers/chad.jpg"
    },
    message: "Hey class! Any doubts about the HTML lesson?",
    type: "message",
    createdAt: "2025-04-19T07:30:37.292Z"
  },
  {
    _id: "6803543d1c4c2a70e8847050",
    course: "68034910156720d4a255e6de",
    sender: {
      _id: "68035537159d7673f4032cc2",
      name: "Alex Johnson",
      avatar: "/images/students/alex.jpg"
    },
    message: "I have a question about semantic HTML elements. When should I use <article> vs <section>?",
    type: "message",
    createdAt: "2025-04-19T07:45:12.292Z"
  }
];

export default function CourseLearningPage({ params }) {
  const router = useRouter();
  const courseId = params.courseId;
  const videoRef = useRef(null);
  const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const currentUser = "ZainJ5";
  
  const [course, setCourse] = useState(courseData);
  const [enrollment, setEnrollment] = useState(enrollmentData);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [showChatPreview, setShowChatPreview] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Generate transcript timestamps for demo
  const generateTimestamps = (transcript) => {
    if (!transcript) return [];
    
    const words = transcript.split(' ');
    const timestamps = [];
    let currentTime = 0;
    
    for (let i = 0; i < words.length; i += 10) {
      const segment = words.slice(i, i + 10).join(' ');
      timestamps.push({
        time: formatTime(currentTime),
        text: segment
      });
      currentTime += Math.floor(Math.random() * 10) + 5; // Random time between 5-15 seconds
    }
    
    return timestamps;
  };
  
  useEffect(() => {
    // Set current video to last watched or first video
    if (course && course.videos.length > 0) {
      const lastWatchedVideo = enrollment?.progress?.lastWatched;
      const videoToLoad = lastWatchedVideo
        ? course.videos.find(v => v._id === lastWatchedVideo)
        : course.videos[0];
        
      if (videoToLoad) {
        setCurrentVideo({
          ...videoToLoad,
          transcriptTimestamps: generateTimestamps(videoToLoad.transcript)
        });
      }
    }
  }, [course, enrollment]);
  
  // Video event handlers
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setVideoCurrentTime(videoRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  
  const handleVideoEnded = () => {
    setIsPlaying(false);
    
    // Mark video as completed if not already
    if (currentVideo && !enrollment.progress.completedVideos.includes(currentVideo._id)) {
      const updatedCompletedVideos = [...enrollment.progress.completedVideos, currentVideo._id];
      setEnrollment({
        ...enrollment,
        progress: {
          ...enrollment.progress,
          completedVideos: updatedCompletedVideos
        }
      });
    }
    
    // Auto-play next video if available
    const currentIndex = course.videos.findIndex(v => v._id === currentVideo._id);
    if (currentIndex < course.videos.length - 1) {
      const nextVideo = course.videos[currentIndex + 1];
      setCurrentVideo({
        ...nextVideo,
        transcriptTimestamps: generateTimestamps(nextVideo.transcript)
      });
      setVideoCurrentTime(0);
      setIsPlaying(true);
    }
  };
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };
  
  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setVideoCurrentTime(seekTime);
    }
  };
  
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const jumpToTimestamp = (timeString) => {
    if (videoRef.current) {
      const [minutes, seconds] = timeString.split(':').map(Number);
      videoRef.current.currentTime = minutes * 60 + seconds;
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };
  
  const changeVideo = (video) => {
    if (video._id !== currentVideo?._id) {
      setCurrentVideo({
        ...video,
        transcriptTimestamps: generateTimestamps(video.transcript)
      });
      setVideoCurrentTime(0);
      setIsPlaying(false);
      
      // Update last watched in enrollment
      setEnrollment({
        ...enrollment,
        progress: {
          ...enrollment.progress,
          lastWatched: video._id
        }
      });
    }
  };
  
  const isVideoCompleted = (videoId) => {
    return enrollment.progress.completedVideos.includes(videoId);
  };
  
  const generateAISummary = () => {
    // In a real app, this would make an API call to generate a summary
    // For demo purposes, we'll use a placeholder
    setGeneratedSummary(
      "This video introduces the fundamentals of HTML, the standard markup language for web pages. " +
      "Key topics covered include:\n\n" +
      "- Basic HTML document structure\n" +
      "- Essential HTML tags and elements\n" +
      "- How to create hyperlinks and add images\n" +
      "- Semantic HTML and its importance for accessibility\n" +
      "- Best practices for clean, maintainable HTML code\n\n" +
      "The instructor demonstrates practical examples of building simple web pages and explains how HTML forms the foundation for more complex web development."
    );
    
    setShowTranscript(false);
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    if (!course || !course.videos || course.videos.length === 0) return 0;
    return Math.round((enrollment.progress.completedVideos.length / course.videos.length) * 100);
  };
  
  // Filter transcript based on search
  const filteredTranscript = searchQuery && currentVideo?.transcriptTimestamps
    ? currentVideo.transcriptTimestamps.filter(item => 
        item.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentVideo?.transcriptTimestamps;
  
  return (
    <StudentLayout>
      <div className="flex items-center justify-between mb-4">
        <Link href="/dashboard/student/learning" className="flex items-center text-blue-600 hover:text-blue-800">
          <FaArrowLeft className="mr-2" />
          Back to My Learning
        </Link>
        <div className="text-xs text-gray-500">
          Current Date and Time (UTC): {currentTime} | User: {currentUser}
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar - Course Content */}
        <div className={`lg:w-1/4 bg-white rounded-lg shadow-sm overflow-hidden ${isSidebarCollapsed ? 'lg:w-auto' : ''}`}>
          {isSidebarCollapsed ? (
            <button 
              onClick={() => setSidebarCollapsed(false)}
              className="p-4 w-full flex justify-center text-blue-600 hover:bg-gray-50"
            >
              <FaList />
            </button>
          ) : (
            <>
              <div className="p-4 border-b flex justify-between items-center">
                <h1 className="text-xl font-bold">{course.title}</h1>
                <button 
                  onClick={() => setSidebarCollapsed(true)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="p-4 border-b">
                <div className="flex items-center mt-2">
                  <Image 
                    src={course.tutor.avatar} 
                    alt={course.tutor.name} 
                    width={24} 
                    height={24} 
                    className="rounded-full mr-2"
                  />
                  <span className="text-sm text-gray-600">{course.tutor.name}</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Your progress</span>
                    <span>{calculateProgress()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${calculateProgress()}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="overflow-y-auto max-h-[calc(100vh-350px)]">
                {course.sections.map(section => (
                  <div key={section._id} className="border-b">
                    <div className="p-3 bg-gray-50 font-medium">{section.title}</div>
                    <div>
                      {section.videos.map(videoId => {
                        const videoData = course.videos.find(v => v._id === videoId);
                        return videoData ? (
                          <button
                            key={videoData._id}
                            className={`w-full text-left p-3 border-b border-gray-100 hover:bg-gray-50 flex items-center ${
                              currentVideo?._id === videoData._id ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => changeVideo(videoData)}
                          >
                            <div className="mr-3">
                              {isVideoCompleted(videoData._id) ? (
                                <div className="bg-green-500 rounded-full p-1 text-white">
                                  <FaCheck size={10} />
                                </div>
                              ) : currentVideo?._id === videoData._id ? (
                                <div className="bg-blue-500 rounded-full p-1 text-white">
                                  <FaPlay size={10} />
                                </div>
                              ) : (
                                <div className="bg-gray-200 rounded-full p-1 text-gray-600">
                                  <FaPlay size={10} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm line-clamp-2">{videoData.title}</p>
                              <p className="text-xs text-gray-500 mt-1">{videoData.duration}</p>
                            </div>
                          </button>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Course Resources */}
              <div className="p-4 border-t">
                <h3 className="font-medium mb-3">Course Resources</h3>
                <div className="space-y-2">
                  <Link 
                    href="#" 
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <FaFilePdf className="mr-2" />
                    Course Slides.pdf
                  </Link>
                  <Link 
                    href="#" 
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <FaFilePdf className="mr-2" />
                    Exercise Files.zip
                  </Link>
                  <Link 
                    href={`/dashboard/student/chat/${courseId}`} 
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <FaComments className="mr-2" />
                    Go to Course Chat
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Main Content - Video Player and Transcript */}
        <div className={`${isSidebarCollapsed ? 'lg:flex-1' : 'lg:w-3/4'} space-y-6`}>
          {currentVideo ? (
            <>
              {/* Video Player */}
              <div className="bg-black rounded-lg overflow-hidden relative">
                <video
                  ref={videoRef}
                  className="w-full aspect-video"
                  src={currentVideo.videoUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={handleVideoEnded}
                />
                
                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  {/* Progress Bar */}
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={videoCurrentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(videoCurrentTime / duration) * 100}%, #d1d5db ${(videoCurrentTime / duration) * 100}%, #d1d5db 100%)`
                    }}
                  />
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={togglePlay}
                        className="text-white hover:text-blue-300 focus:outline-none"
                      >
                        {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={toggleMute}
                          className="text-white hover:text-blue-300 focus:outline-none"
                        >
                          {isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-20 h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
                        />
                      </div>
                      
                      <span className="text-white text-sm">
                        {formatTime(videoCurrentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button 
                        className="text-white hover:text-blue-300 focus:outline-none"
                        onClick={() => setShowChatPreview(!showChatPreview)}
                        title="Toggle chat preview"
                      >
                        <FaComments size={18} />
                      </button>
                      <button 
                        className="text-white hover:text-blue-300 focus:outline-none"
                        title="Video settings"
                      >
                        <FaCog size={18} />
                      </button>
                      <button 
                        className="text-white hover:text-blue-300 focus:outline-none"
                        title="Fullscreen"
                      >
                        <FaExpand size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Chat Preview (conditionally shown) */}
              {showChatPreview && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                    <h3 className="font-medium">Course Chat</h3>
                    <button 
                      onClick={() => setShowChatPreview(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes size={16} />
                    </button>
                  </div>
                  <div className="p-4 max-h-60 overflow-y-auto">
                    {chatMessages.map(message => (
                      <div key={message._id} className="mb-4">
                        <div className="flex items-start">
                          <Image 
                            src={message.sender.avatar} 
                            alt={message.sender.name} 
                            width={32} 
                            height={32} 
                            className="rounded-full mr-2"
                          />
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium text-sm">{message.sender.name}</span>
                              <span className="ml-2 text-xs text-gray-500">
                                {new Date(message.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{message.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t">
                    <Link 
                      href={`/dashboard/student/chat/${courseId}`}
                      className="block w-full py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 text-sm"
                    >
                      Go to Full Chat
                    </Link>
                  </div>
                </div>
              )}
              
              {/* Video Info and Transcript */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-bold">{currentVideo.title}</h2>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <span>Duration: {currentVideo.duration}</span>
                    <span className="mx-2">•</span>
                    <button 
                      className="flex items-center text-blue-600 hover:text-blue-800"
                      onClick={generateAISummary}
                    >
                      <FaBrain className="mr-1" />
                      Generate AI Summary
                    </button>
                    <span className="mx-2">•</span>
                    <button 
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <FaDownload className="mr-1" />
                      Download Transcript
                    </button>
                  </div>
                </div>
                
                {/* Tabs */}
                <div className="flex border-b">
                  <button 
                    className={`flex-1 py-3 text-center text-sm font-medium ${showTranscript ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setShowTranscript(true)}
                  >
                    Transcript
                  </button>
                  <button 
                    className={`flex-1 py-3 text-center text-sm font-medium ${!showTranscript ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setShowTranscript(false)}
                  >
                    AI Summary
                  </button>
                </div>
                
                {showTranscript ? (
                  <div className="p-4">
                    <div className="relative mb-4">
                      <input
                        type="text"
                        placeholder="Search in transcript..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                      </div>
                    </div>
                    
                    {searchQuery && filteredTranscript.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                    
                    <div className="max-h-96 overflow-y-auto">
                      {filteredTranscript?.map((item, index) => (
                        <div 
                          key={index}
                          className="flex py-2 px-1 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          onClick={() => jumpToTimestamp(item.time)}
                        >
                          <div className="w-16 text-blue-600 font-mono text-sm">
                            {item.time}
                          </div>
                          <div className="flex-1 text-sm">
                            {item.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    {generatedSummary ? (
                      <>
                        <div className="flex items-center text-gray-700 mb-4">
                          <FaBrain className="text-purple-600 mr-2" />
                          <h3 className="font-medium">AI-Generated Summary</h3>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="whitespace-pre-line text-sm">
                            {generatedSummary}
                          </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-gray-600">
                          <FaLightbulb className="text-yellow-500 mr-2" />
                          <span>This summary was automatically generated using AI based on the video content.</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <FaBrain className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-gray-600 mb-4">
                          Generate an AI summary to get the key points from this video
                        </p>
                        <button
                          onClick={generateAISummary}
                          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                        >
                          Generate Summary
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex justify-between">
                {course.videos.findIndex(v => v._id === currentVideo._id) > 0 ? (
                  <button
                    className="flex items-center text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      const currentIndex = course.videos.findIndex(v => v._id === currentVideo._id);
                      if (currentIndex > 0) {
                        const prevVideo = course.videos[currentIndex - 1];
                        changeVideo(prevVideo);
                      }
                    }}
                  >
                    <FaArrowLeft className="mr-2" />
                    Previous Lesson
                  </button>
                ) : (
                  <div></div>
                )}
                
                {course.videos.findIndex(v => v._id === currentVideo._id) < course.videos.length - 1 ? (
                  <button
                    className="flex items-center text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      const currentIndex = course.videos.findIndex(v => v._id === currentVideo._id);
                      if (currentIndex < course.videos.length - 1) {
                        const nextVideo = course.videos[currentIndex + 1];
                        changeVideo(nextVideo);
                      }
                    }}
                  >
                    Next Lesson
                    <FaArrowLeft className="ml-2 transform rotate-180" />
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <FaPlay className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No video selected</h3>
              <p className="text-gray-500 mb-6">
                Please select a video from the course content to start learning.
              </p>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}