'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaArrowLeft, FaPlay, FaPause, FaCheck, 
  FaVolumeUp, FaVolumeMute, FaExpand 
} from 'react-icons/fa';
import StudentLayout from '../../../../components/layout/StudentLayout';

// Mock courses data
const coursesData = {
  "course1": {
    id: "course1",
    title: "Web Development Fundamentals",
    description: "Learn the basics of web development with HTML, CSS and JavaScript",
    image: "/images/courses/web-dev.jpg",
    instructor: {
      name: "Professor Chad",
      avatar: "/images/teachers/chad.jpg"
    },
    progress: 33,
    videos: [
      {
        id: "video1",
        title: "Introduction to HTML",
        duration: "10:25",
        videoUrl: "https://res.cloudinary.com/dxx85aaii/video/upload/v1745045807/edtech-videos/video-1745045804365.mp4",
        completed: true,
        transcript: "HTML stands for HyperText Markup Language. It is the standard markup language for creating web pages. HTML describes the structure of a web page and consists of a series of elements that tell the browser how to display the content."
      },
      {
        id: "video2",
        title: "Introduction to CSS",
        duration: "15:30",
        videoUrl: "https://res.cloudinary.com/dxx85aaii/video/upload/v1745045807/edtech-videos/video-1745045804366.mp4",
        completed: false,
        transcript: "CSS stands for Cascading Style Sheets. CSS describes how HTML elements are to be displayed on screen, paper, or in other media. CSS saves a lot of work by controlling the layout of multiple web pages all at once."
      },
      {
        id: "video3",
        title: "JavaScript Basics",
        duration: "22:15",
        videoUrl: "https://res.cloudinary.com/dxx85aaii/video/upload/v1745045807/edtech-videos/video-1745045804367.mp4",
        completed: false,
        transcript: "JavaScript is a scripting language that enables you to create dynamically updating content, control multimedia, animate images, and pretty much everything else."
      }
    ]
  },
  "course2": {
    id: "course2",
    title: "React for Beginners",
    description: "Learn React from scratch with hands-on projects",
    image: "/images/courses/react.jpg",
    instructor: {
      name: "Professor Chad",
      avatar: "/images/teachers/chad.jpg"
    },
    progress: 81,
    videos: [
      {
        id: "video1",
        title: "Introduction to React",
        duration: "18:42",
        videoUrl: "https://res.cloudinary.com/dxx85aaii/video/upload/v1745045807/edtech-videos/video-1745045804365.mp4",
        completed: true,
        transcript: "React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies."
      },
      {
        id: "video2",
        title: "React Components",
        duration: "24:15",
        videoUrl: "https://res.cloudinary.com/dxx85aaii/video/upload/v1745045807/edtech-videos/video-1745045804366.mp4",
        completed: true,
        transcript: "Components are the building blocks of any React application. A component is a JavaScript class or function that optionally accepts inputs and returns a React element that describes how a section of the UI should appear."
      },
      {
        id: "video3",
        title: "React Hooks Deep Dive",
        duration: "32:10",
        videoUrl: "https://res.cloudinary.com/dxx85aaii/video/upload/v1745045807/edtech-videos/video-1745045804367.mp4",
        completed: false,
        transcript: "Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class. This lesson explores useState, useEffect, useContext and more."
      }
    ]
  }
};

export default function CourseVideoPage({ params }) {
  const courseId = params.id;
  const course = coursesData[courseId];
  
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(true);
  
  const videoRef = useRef(null);
  
  // Current date and time in the exact format requested
  const currentDateTime = "2025-04-19 08:55:18";
  const currentUser = "ZainJ5";
  
  useEffect(() => {
    // Set first unwatched video as current, or first video if all are watched
    if (course) {
      const unwatchedVideo = course.videos.find(video => !video.completed);
      setCurrentVideo(unwatchedVideo || course.videos[0]);
    }
  }, [course]);
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
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
  
  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };
  
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleVideoEnded = () => {
    setIsPlaying(false);
    
    // Mark video as completed (in a real app, this would update the database)
    if (currentVideo) {
      currentVideo.completed = true;
    }
  };
  
  const changeVideo = (video) => {
    setCurrentVideo(video);
    setCurrentTime(0);
    setIsPlaying(false);
  };
  
  if (!course) {
    return (
      <StudentLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <p className="mb-8">The course you are looking for does not exist or you don't have access to it.</p>
          <Link href="/dashboard/student/learnings" className="text-blue-600 hover:underline">
            Back to My Courses
          </Link>
        </div>
      </StudentLayout>
    );
  }
  
  return (
    <StudentLayout>
      <div className="flex justify-between items-center mb-6">
        <Link href="/dashboard/student/learnings" className="flex items-center text-blue-600">
          <FaArrowLeft className="mr-2" /> Back to My Courses
        </Link>
        <div className="text-sm text-gray-600">
          Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): {currentDateTime}<br />
          Current User's Login: {currentUser}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-gray-600 mt-1">{course.description}</p>
          <div className="flex items-center mt-4">
            <Image 
              src={course.instructor.avatar} 
              alt={course.instructor.name} 
              width={32} 
              height={32} 
              className="rounded-full mr-2"
            />
            <span className="text-gray-700">Instructor: {course.instructor.name}</span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row">
          {/* Video List */}
          <div className="w-full md:w-1/3 border-r border-gray-200">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="font-medium">Course Content</h2>
              <p className="text-sm text-gray-600">
                {course.videos.filter(v => v.completed).length} of {course.videos.length} videos completed
              </p>
            </div>
            <div className="overflow-y-auto max-h-96">
              {course.videos.map((video, index) => (
                <button
                  key={video.id}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 flex items-center hover:bg-gray-50 ${
                    currentVideo?.id === video.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => changeVideo(video)}
                >
                  <div className="mr-3">
                    {video.completed ? (
                      <div className="bg-green-500 rounded-full p-1 text-white">
                        <FaCheck size={10} />
                      </div>
                    ) : currentVideo?.id === video.id ? (
                      <div className="bg-blue-500 rounded-full p-1 text-white">
                        <FaPlay size={10} />
                      </div>
                    ) : (
                      <div className="rounded-full h-5 w-5 flex items-center justify-center border border-gray-400 text-gray-500">
                        {index + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{video.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{video.duration}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Video Player */}
          <div className="w-full md:w-2/3">
            {currentVideo ? (
              <div>
                <div className="relative bg-black">
                  <video
                    ref={videoRef}
                    className="w-full aspect-video"
                    src={currentVideo.videoUrl}
                    onClick={togglePlay}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={handleVideoEnded}
                  />
                  
                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <input
                      type="range"
                      min="0"
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
                    />
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={togglePlay}
                          className="text-white hover:text-blue-300"
                        >
                          {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
                        </button>
                        
                        <button
                          onClick={toggleMute}
                          className="text-white hover:text-blue-300"
                        >
                          {isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
                        </button>
                        
                        <span className="text-white text-sm">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>
                      
                      <button className="text-white hover:text-blue-300">
                        <FaExpand size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Transcript */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Video Transcript</h3>
                    <button
                      onClick={() => setShowTranscript(!showTranscript)}
                      className="text-sm text-blue-600"
                    >
                      {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
                    </button>
                  </div>
                  
                  {showTranscript && (
                    <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700 max-h-40 overflow-y-auto">
                      {currentVideo.transcript}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-12">
                <p>Select a video to start learning</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}