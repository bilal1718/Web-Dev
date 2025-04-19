'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  FaCloudUploadAlt, FaArrowLeft, FaTimes, 
  FaCheck, FaSpinner, FaExclamationTriangle,
  FaFileVideo, FaPlay
} from 'react-icons/fa';
import TeacherLayout from '../../../../components/layout/TeacherLayout';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get cookie function
const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};

// Set up axios interceptor to add authorization header
axios.interceptors.request.use(
  (config) => {
    const token = getCookie('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default function VideoUploadPage() {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadStatus, setUploadStatus] = useState(null); // null, 'uploading', 'success', 'error'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [recentUploads, setRecentUploads] = useState([]);
  const [courses, setCourses] = useState([]);
  // Set exact current date/time as specified
  const [currentDateTime] = useState('2025-04-19 10:00:59');
  // Set exact user login as specified
  const [currentUser] = useState('ZainJ5');
  const [generatingTranscript, setGeneratingTranscript] = useState(false);
  const [transcriptError, setTranscriptError] = useState(null);

  useEffect(() => {
    // Fetch courses for the dropdown using the correct API endpoint
    const fetchCourses = async () => {
      try {
        // Using /api/courses/my endpoint to get instructor's courses
        const response = await axios.get(`${API_URL}/courses/my`);
        setCourses(response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };

    // Fetch recent uploads
    const fetchRecentUploads = async () => {
      try {
        // This assumes you have a GET /api/videos endpoint that can filter by recent
        const response = await axios.get(`${API_URL}/videos?limit=2&sort=createdAt:desc`);
        setRecentUploads(response.data);
      } catch (err) {
        console.error('Error fetching recent uploads:', err);
      }
    };

    fetchCourses();
    fetchRecentUploads();
  }, []);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      // Create a preview URL for the video
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setErrors({...errors, video: null});
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedCourse) {
      newErrors.course = 'Please select a course';
    }
    
    if (!title.trim()) {
      newErrors.title = 'Please enter a title';
    }
    
    if (!videoFile) {
      newErrors.video = 'Please select a video file';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    // Create form data for file upload
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', videoFile);
    if (description) formData.append('description', description);
    formData.append('order', 0); // Default to end of list
    
    try {
      // Set up progress tracking
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          // Simulate progress up to 90% (actual completion will be set by the response)
          return prev < 90 ? prev + 5 : prev;
        });
      }, 500);
      
      // Call the upload API endpoint
      const response = await axios.post(
        `${API_URL}/videos/upload/${selectedCourse}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');
      
      // Ask if user wants to generate transcript
      const generateTranscriptConfirm = window.confirm(
        'Video uploaded successfully! Would you like to generate an AI transcript? This might take a few minutes.'
      );
      
      if (generateTranscriptConfirm) {
        await generateTranscript(response.data._id);
      }
      
      // Add the newly uploaded video to recent uploads
      const course = courses.find(c => c._id === selectedCourse);
      const newUpload = {
        ...response.data,
        courseName: course ? course.title : 'Unknown Course',
      };
      
      setRecentUploads(prev => [newUpload, ...prev]);
      
      // Reset form after successful upload
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setVideoFile(null);
        setPreviewUrl('');
        setSelectedCourse('');
        // Redirect to videos page
        router.push('/dashboard/teacher/videos');
      }, 2000);
    } catch (err) {
      clearInterval(progressInterval);
      setUploadStatus('error');
      console.error('Upload failed:', err);
    }
  };

  const generateTranscript = async (videoId) => {
    try {
      setGeneratingTranscript(true);
      setTranscriptError(null);
      
      await axios.post(`${API_URL}/videos/transcribe/${videoId}`);
      
      alert('Transcript generation has started! It may take a few minutes to complete.');
    } catch (err) {
      console.error('Error generating transcript:', err);
      setTranscriptError('Failed to generate transcript. Please try again later.');
    } finally {
      setGeneratingTranscript(false);
    }
  };

  const cancelUpload = () => {
    setUploadStatus(null);
    setUploadProgress(0);
  };

  return (
    <TeacherLayout>
      <div className="mb-6">
        <button
          onClick={() => router.push('/dashboard/teacher/videos')}
          className="text-gray-600 hover:text-gray-900 mb-2 flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back to Videos
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Upload Video</h1>
        <p className="text-gray-600">Add a new video to one of your courses</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Video Details</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Course *</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => {
                    setSelectedCourse(e.target.value);
                    setErrors({...errors, course: null});
                  }}
                  className={`w-full px-3 py-2 border ${errors.course ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>{course.title}</option>
                  ))}
                </select>
                {errors.course && <p className="text-red-500 text-sm mt-1">{errors.course}</p>}
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Video Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setErrors({...errors, title: null});
                  }}
                  className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g. Introduction to Python Functions"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a description of this video"
                  rows={4}
                />
              </div>
              
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-2">Video File *</label>
                {!videoFile ? (
                  <div 
                    className={`border-2 border-dashed ${errors.video ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'} rounded-lg p-8 text-center cursor-pointer hover:bg-gray-100 transition-colors`}
                    onClick={() => document.getElementById('videoInput').click()}
                  >
                    <FaCloudUploadAlt className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="font-medium text-gray-700 mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">MP4, MOV or WEBM (max. 2GB)</p>
                    <input
                      type="file"
                      id="videoInput"
                      accept="video/mp4,video/mov,video/webm"
                      onChange={handleVideoChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-lg mr-3">
                          <FaFileVideo className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{videoFile.name}</p>
                          <p className="text-sm text-gray-500">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          setVideoFile(null);
                          setPreviewUrl('');
                        }}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <FaTimes size={18} />
                      </button>
                    </div>
                    
                    {previewUrl && (
                      <div className="mt-4 relative aspect-video bg-black rounded-lg overflow-hidden">
                        <video 
                          src={previewUrl} 
                          controls 
                          className="w-full h-full"
                          preload="metadata"
                        />
                      </div>
                    )}
                  </div>
                )}
                {errors.video && <p className="text-red-500 text-sm mt-1">{errors.video}</p>}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={uploadStatus === 'uploading' || generatingTranscript}
                  className={`px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center ${
                    uploadStatus === 'uploading' || generatingTranscript ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                >
                  {uploadStatus === 'uploading' ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Uploading... {uploadProgress}%
                    </>
                  ) : uploadStatus === 'success' ? (
                    <>
                      <FaCheck className="mr-2" />
                      Upload Complete!
                    </>
                  ) : generatingTranscript ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Generating Transcript...
                    </>
                  ) : (
                    <>
                      <FaCloudUploadAlt className="mr-2" />
                      Upload Video
                    </>
                  )}
                </button>
              </div>
              
              {uploadStatus === 'uploading' && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">{uploadProgress}% complete</span>
                    <button 
                      type="button"
                      onClick={cancelUpload}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              {uploadStatus === 'error' && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <FaExclamationTriangle className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 font-medium">Upload failed</p>
                    <p className="text-sm text-red-600">There was an error uploading your video. Please try again.</p>
                  </div>
                </div>
              )}
              
              {transcriptError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <FaExclamationTriangle className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 font-medium">Transcript generation failed</p>
                    <p className="text-sm text-red-600">{transcriptError}</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Recent Uploads</h2>
            </div>
            
            {recentUploads.length > 0 ? (
              <div className="space-y-4">
                {recentUploads.map(video => (
                  <div key={video._id} className="flex items-start border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <div className="relative w-20 h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                      {video.thumbnail ? (
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaVideo className="text-gray-400" size={16} />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-10 transition-all">
                        <FaPlay className="text-white" size={12} />
                      </div>
                      <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-xs px-1">
                        {video.duration || "N/A"}
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-1">{video.title}</h3>
                      <p className="text-xs text-gray-500">{video.courseName}</p>
                      <p className="text-xs text-gray-400">{new Date(video.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No videos uploaded yet</p>
              </div>
            )}
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Video Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Keep videos under 15 minutes for better engagement</li>
              <li>• Use 1080p resolution for optimal viewing</li>
              <li>• Add captions to make your content accessible</li>
              <li>• Use good lighting and clear audio</li>
            </ul>
          </div>
          
          <div className="text-xs text-gray-500 text-right">
            {currentDateTime} • {currentUser}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}