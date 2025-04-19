'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  FaArrowLeft, FaVideo, FaTrash, FaPencilAlt, FaPlus, 
  FaCloudUploadAlt, FaGripVertical, FaFilm, FaFileAlt,
  FaInfoCircle, FaSave, FaExclamationCircle, FaEye,
  FaCheck, FaLock, FaLockOpen, FaSyncAlt, FaBrain
} from 'react-icons/fa';
import TeacherLayout from '@/components/layout/TeacherLayout';

// Dummy course data
const courseData = {
  id: 1,
  title: 'Introduction to Python Programming',
  thumbnail: '/images/courses/python.jpg',
  description: 'A comprehensive introduction to Python programming language covering fundamentals, data structures, and real-world applications.',
  sections: [
    {
      id: 's1',
      title: 'Getting Started with Python',
      description: 'Introduction to Python ecosystem and setup',
      lessons: [
        {
          id: 'v1',
          title: 'Introduction to the Course',
          type: 'video',
          duration: '08:45',
          status: 'ready',
          transcript: true,
          preview: true,
        },
        {
          id: 'v2',
          title: 'Installing Python and Setting Up Environment',
          type: 'video',
          duration: '12:20',
          status: 'ready',
          transcript: true,
          preview: false,
        },
        {
          id: 'v3',
          title: 'Your First Python Program',
          type: 'video',
          duration: '15:10',
          status: 'ready',
          transcript: true,
          preview: false,
        },
      ],
    },
    {
      id: 's2',
      title: 'Python Basics',
      description: 'Variables, data types, and basic operations',
      lessons: [
        {
          id: 'v4',
          title: 'Variables and Data Types',
          type: 'video',
          duration: '18:30',
          status: 'ready',
          transcript: true,
          preview: false,
        },
        {
          id: 'v5',
          title: 'Operators and Expressions',
          type: 'video',
          duration: '14:15',
          status: 'ready',
          transcript: true,
          preview: false,
        },
      ],
    },
    {
      id: 's3',
      title: 'Control Structures',
      description: 'Conditional statements and loops',
      lessons: [
        {
          id: 'v6',
          title: 'If-Else Statements',
          type: 'video',
          duration: '16:40',
          status: 'ready',
          transcript: true,
          preview: false,
        },
        {
          id: 'v7',
          title: 'For Loops and While Loops',
          type: 'video',
          duration: '21:05',
          status: 'ready',
          transcript: true,
          preview: false,
        },
      ],
    },
  ],
};

export default function CourseContent({ params }) {
  const router = useRouter();
  const courseId = params.id;
  const [course, setCourse] = useState(courseData);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionDescription, setNewSectionDescription] = useState('');
  const [showAddSectionForm, setShowAddSectionForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingToSection, setUploadingToSection] = useState(null);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editedLessonTitle, setEditedLessonTitle] = useState('');
  
  const fileInputRef = useRef(null);
  
  // Function to handle section reordering
  const handleDragEnd = (result) => {
    const { destination, source, type } = result;
    
    // Dropped outside the list
    if (!destination) return;
    
    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    // Reordering sections
    if (type === 'section') {
      const newSections = Array.from(course.sections);
      const [movedSection] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, movedSection);
      
      setCourse({
        ...course,
        sections: newSections,
      });
      return;
    }
    
    // Reordering lessons within a section or between sections
    if (type === 'lesson') {
      const sectionSourceId = source.droppableId.replace('section-', '');
      const sectionDestId = destination.droppableId.replace('section-', '');
      
      // If moving within the same section
      if (sectionSourceId === sectionDestId) {
        const section = course.sections.find(s => s.id === sectionSourceId);
        const newLessons = Array.from(section.lessons);
        const [movedLesson] = newLessons.splice(source.index, 1);
        newLessons.splice(destination.index, 0, movedLesson);
        
        const newSections = course.sections.map(s => {
          if (s.id === sectionSourceId) {
            return { ...s, lessons: newLessons };
          }
          return s;
        });
        
        setCourse({
          ...course,
          sections: newSections,
        });
      } else {
        // Moving between sections
        const sourceSection = course.sections.find(s => s.id === sectionSourceId);
        const destSection = course.sections.find(s => s.id === sectionDestId);
        
        const sourceLessons = Array.from(sourceSection.lessons);
        const [movedLesson] = sourceLessons.splice(source.index, 1);
        
        const destLessons = Array.from(destSection.lessons);
        destLessons.splice(destination.index, 0, movedLesson);
        
        const newSections = course.sections.map(s => {
          if (s.id === sectionSourceId) {
            return { ...s, lessons: sourceLessons };
          }
          if (s.id === sectionDestId) {
            return { ...s, lessons: destLessons };
          }
          return s;
        });
        
        setCourse({
          ...course,
          sections: newSections,
        });
      }
    }
  };
  
  // Function to add a new section
  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    
    const newSection = {
      id: `s${Date.now()}`,
      title: newSectionTitle,
      description: newSectionDescription,
      lessons: [],
    };
    
    setCourse({
      ...course,
      sections: [...course.sections, newSection],
    });
    
    setNewSectionTitle('');
    setNewSectionDescription('');
    setShowAddSectionForm(false);
  };
  
  // Function to update a section
  const handleUpdateSection = (sectionId) => {
    if (!newSectionTitle.trim()) return;
    
    const updatedSections = course.sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          title: newSectionTitle,
          description: newSectionDescription,
        };
      }
      return section;
    });
    
    setCourse({
      ...course,
      sections: updatedSections,
    });
    
    setNewSectionTitle('');
    setNewSectionDescription('');
    setEditingSectionId(null);
  };
  
  // Function to delete a section
  const handleDeleteSection = (sectionId) => {
    if (window.confirm('Are you sure you want to delete this section and all its content?')) {
      setCourse({
        ...course,
        sections: course.sections.filter(section => section.id !== sectionId),
      });
    }
  };
  
  // Function to edit a section
  const handleEditSection = (section) => {
    setNewSectionTitle(section.title);
    setNewSectionDescription(section.description);
    setEditingSectionId(section.id);
  };
  
  // Function to start editing a lesson title
  const handleEditLessonStart = (lesson) => {
    setEditingLessonId(lesson.id);
    setEditedLessonTitle(lesson.title);
  };
  
  // Function to save edited lesson title
  const handleEditLessonSave = (sectionId, lessonId) => {
    if (!editedLessonTitle.trim()) return;
    
    const updatedSections = course.sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: section.lessons.map(lesson => {
            if (lesson.id === lessonId) {
              return {
                ...lesson,
                title: editedLessonTitle,
              };
            }
            return lesson;
          }),
        };
      }
      return section;
    });
    
    setCourse({
      ...course,
      sections: updatedSections,
    });
    
    setEditingLessonId(null);
    setEditedLessonTitle('');
  };
  
  // Function to delete a lesson
  const handleDeleteLesson = (sectionId, lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      const updatedSections = course.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            lessons: section.lessons.filter(lesson => lesson.id !== lessonId),
          };
        }
        return section;
      });
      
      setCourse({
        ...course,
        sections: updatedSections,
      });
    }
  };
  
  // Function to toggle lesson preview status
  const toggleLessonPreview = (sectionId, lessonId) => {
    const updatedSections = course.sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: section.lessons.map(lesson => {
            if (lesson.id === lessonId) {
              return {
                ...lesson,
                preview: !lesson.preview,
              };
            }
            return lesson;
          }),
        };
      }
      return section;
    });
    
    setCourse({
      ...course,
      sections: updatedSections,
    });
  };
  
  // Function to handle video upload
  const handleVideoUpload = (sectionId, files) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadingToSection(sectionId);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
            setUploadingToSection(null);
            
            // Add the new video lessons to the section
            const newLessons = Array.from(files).map(file => ({
              id: `v${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
              type: 'video',
              duration: '00:00', // This would be determined by the video
              status: 'processing',
              transcript: false,
              preview: false,
            }));
            
            const updatedSections = course.sections.map(section => {
              if (section.id === sectionId) {
                return {
                  ...section,
                  lessons: [...section.lessons, ...newLessons],
                };
              }
              return section;
            });
            
            setCourse({
              ...course,
              sections: updatedSections,
            });
            
            // Simulate processing completion after some time
            setTimeout(() => {
              const processedSections = course.sections.map(section => {
                if (section.id === sectionId) {
                  return {
                    ...section,
                    lessons: section.lessons.map(lesson => {
                      if (lesson.status === 'processing') {
                        return {
                          ...lesson,
                          status: 'ready',
                          transcript: true,
                          duration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
                        };
                      }
                      return lesson;
                    }),
                  };
                }
                return section;
              });
              
              setCourse({
                ...course,
                sections: processedSections,
              });
            }, 5000);
            
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };
  
  // Function to regenerate transcript
  const regenerateTranscript = (sectionId, lessonId) => {
    // Update lesson status to processing transcript
    const updatedSections = course.sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: section.lessons.map(lesson => {
            if (lesson.id === lessonId) {
              return {
                ...lesson,
                transcript: false,
                status: 'processing',
              };
            }
            return lesson;
          }),
        };
      }
      return section;
    });
    
    setCourse({
      ...course,
      sections: updatedSections,
    });
    
    // Simulate processing
    setTimeout(() => {
      const completedSections = course.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            lessons: section.lessons.map(lesson => {
              if (lesson.id === lessonId) {
                return {
                  ...lesson,
                  transcript: true,
                  status: 'ready',
                };
              }
              return lesson;
            }),
          };
        }
        return section;
      });
      
      setCourse({
        ...course,
        sections: completedSections,
      });
    }, 3000);
  };
  
  const handleSaveCourse = () => {
    // This would save the course content to the backend in a real app
    console.log('Saving course content:', course);
    alert('Course content saved successfully!');
  };
  
  return (
    <TeacherLayout>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/dashboard/teacher/courses" className="mr-4 text-gray-600 hover:text-gray-900">
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Course Content</h1>
            <p className="text-gray-600">{course.title}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link 
            href={`/courses/${courseId}`}
            className="btn-outline flex items-center"
            target="_blank"
          >
            <FaEye className="mr-2" />
            Preview Course
          </Link>
          <button 
            className="btn-primary flex items-center"
            onClick={handleSaveCourse}
          >
            <FaSave className="mr-2" />
            Save Changes
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center mb-6">
          <div className="relative h-20 w-36 mr-6">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold">{course.title}</h2>
            <p className="text-gray-600 text-sm">{course.description}</p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-8 flex items-start">
          <FaInfoCircle className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
          <div>
            <p className="text-blue-800 font-medium">Content Management Tips</p>
            <ul className="text-sm text-blue-700 mt-1 list-disc list-inside space-y-1">
              <li>Drag and drop sections or lessons to reorder them</li>
              <li>Mark videos as "Preview" to make them available without enrollment</li>
              <li>All video uploads automatically generate AI transcripts</li>
              <li>Remember to save your changes when you're done</li>
            </ul>
          </div>
        </div>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections" type="section">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-6"
              >
                {course.sections.map((section, sectionIndex) => (
                  <Draggable
                    key={section.id}
                    draggableId={section.id}
                    index={sectionIndex}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        {/* Section Header */}
                        <div className="bg-gray-50 p-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <div {...provided.dragHandleProps} className="mr-3 text-gray-400 cursor-move">
                              <FaGripVertical />
                            </div>
                            {editingSectionId === section.id ? (
                              <div className="flex-grow">
                                <input
                                  type="text"
                                  value={newSectionTitle}
                                  onChange={(e) => setNewSectionTitle(e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded mb-2"
                                  placeholder="Section title"
                                />
                                <textarea
                                  value={newSectionDescription}
                                  onChange={(e) => setNewSectionDescription(e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded text-sm"
                                  placeholder="Section description (optional)"
                                  rows={2}
                                />
                                <div className="mt-2 flex space-x-2">
                                  <button
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                    onClick={() => handleUpdateSection(section.id)}
                                  >
                                    Save
                                  </button>
                                  <button
                                    className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                                    onClick={() => {
                                      setEditingSectionId(null);
                                      setNewSectionTitle('');
                                      setNewSectionDescription('');
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <h3 className="font-medium text-gray-800">
                                  Section {sectionIndex + 1}: {section.title}
                                </h3>
                                {section.description && (
                                  <p className="text-gray-600 text-sm">{section.description}</p>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {editingSectionId !== section.id && (
                            <div className="flex space-x-2">
                              <button
                                className="p-2 text-gray-600 hover:text-blue-600"
                                onClick={() => handleEditSection(section)}
                                title="Edit section"
                              >
                                <FaPencilAlt />
                              </button>
                              <button
                                className="p-2 text-gray-600 hover:text-red-600"
                                onClick={() => handleDeleteSection(section.id)}
                                title="Delete section"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {/* Section Content (Lessons) */}
                        <div className="p-4">
                          <Droppable droppableId={`section-${section.id}`} type="lesson">
                            {(provided) => (
                              <div 
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="space-y-3"
                              >
                                {section.lessons.map((lesson, lessonIndex) => (
                                  <Draggable
                                    key={lesson.id}
                                    draggableId={lesson.id}
                                    index={lessonIndex}
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3"
                                      >
                                        <div className="flex items-center flex-grow mr-4">
                                          <div {...provided.dragHandleProps} className="mr-3 text-gray-400 cursor-move">
                                            <FaGripVertical />
                                          </div>
                                          
                                          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-blue-100 text-blue-600">
                                            <FaVideo />
                                          </div>
                                          
                                          {editingLessonId === lesson.id ? (
                                            <div className="flex-grow">
                                              <input
                                                type="text"
                                                value={editedLessonTitle}
                                                onChange={(e) => setEditedLessonTitle(e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded"
                                                placeholder="Lesson title"
                                              />
                                              <div className="mt-2 flex space-x-2">
                                                <button
                                                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                                  onClick={() => handleEditLessonSave(section.id, lesson.id)}
                                                >
                                                  Save
                                                </button>
                                                <button
                                                  className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                                                  onClick={() => setEditingLessonId(null)}
                                                >
                                                  Cancel
                                                </button>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="flex-grow">
                                              <div className="flex items-center">
                                                <span className="font-medium">{lessonIndex + 1}. {lesson.title}</span>
                                                {lesson.preview && (
                                                  <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                                    Preview
                                                  </span>
                                                )}
                                              </div>
                                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <span className="flex items-center mr-3">
                                                  <FaFilm className="mr-1" />
                                                  {lesson.duration}
                                                </span>
                                                
                                                {lesson.status === 'processing' ? (
                                                  <span className="flex items-center text-yellow-600">
                                                    <FaSyncAlt className="mr-1 animate-spin" />
                                                    Processing
                                                  </span>
                                                ) : lesson.status === 'ready' ? (
                                                  <span className="flex items-center text-green-600">
                                                    <FaCheck className="mr-1" />
                                                    Ready
                                                  </span>
                                                ) : (
                                                  <span className="flex items-center text-red-600">
                                                    <FaExclamationCircle className="mr-1" />
                                                    Error
                                                  </span>
                                                )}
                                                
                                                {lesson.transcript && (
                                                  <span className="ml-3 flex items-center text-purple-600">
                                                    <FaBrain className="mr-1" />
                                                    AI Transcript
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        
                                        {editingLessonId !== lesson.id && (
                                          <div className="flex space-x-2">
                                            <button
                                              className={`p-1.5 rounded ${lesson.preview ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} hover:bg-opacity-80`}
                                              onClick={() => toggleLessonPreview(section.id, lesson.id)}
                                              title={lesson.preview ? "Remove from preview" : "Set as preview"}
                                            >
                                              {lesson.preview ? <FaLockOpen /> : <FaLock />}
                                            </button>
                                            
                                            {lesson.status === 'ready' && (
                                              <button
                                                className="p-1.5 bg-purple-100 text-purple-700 rounded hover:bg-opacity-80"
                                                onClick={() => regenerateTranscript(section.id, lesson.id)}
                                                title="Regenerate AI transcript"
                                              >
                                                <FaBrain />
                                              </button>
                                            )}
                                            
                                            <button
                                              className="p-1.5 bg-blue-100 text-blue-700 rounded hover:bg-opacity-80"
                                              onClick={() => handleEditLessonStart(lesson)}
                                              title="Edit lesson"
                                            >
                                              <FaPencilAlt />
                                            </button>
                                            
                                            <button
                                              className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-opacity-80"
                                              onClick={() => handleDeleteLesson(section.id, lesson.id)}
                                              title="Delete lesson"
                                            >
                                              <FaTrash />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                                
                                {/* Upload Video Button */}
                                <div className="mt-4">
                                  {isUploading && uploadingToSection === section.id ? (
                                    <div className="mt-4">
                                      <p className="text-sm font-medium text-gray-700 mb-1">Uploading video...</p>
                                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                                          style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1">{uploadProgress}% complete</p>
                                    </div>
                                  ) : (
                                    <button
                                      className="flex items-center text-blue-600 hover:text-blue-800"
                                      onClick={() => {
                                        // Create a new file input and trigger it
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'video/*';
                                        input.multiple = true;
                                        input.onchange = (e) => handleVideoUpload(section.id, e.target.files);
                                        input.click();
                                      }}
                                    >
                                      <FaCloudUploadAlt className="mr-2" />
                                      Upload Videos
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </Droppable>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
        {/* Add Section Form */}
        {showAddSectionForm ? (
          <div className="mt-6 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-3">Add New Section</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Title *
                </label>
                <input
                  type="text"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="e.g., Introduction to the Course"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={newSectionDescription}
                  onChange={(e) => setNewSectionDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Briefly describe what this section covers"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowAddSectionForm(false);
                    setNewSectionTitle('');
                    setNewSectionDescription('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={handleAddSection}
                  disabled={!newSectionTitle.trim()}
                >
                  Add Section
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            className="mt-6 flex items-center text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => setShowAddSectionForm(true)}
          >
            <FaPlus className="mr-2" />
            Add New Section
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">AI Transcript Features</h2>
        <div className="text-gray-700 space-y-4">
          <p>
            All uploaded videos automatically generate AI transcripts for enhanced learning. 
            Transcripts help students:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Search for specific content within videos</li>
            <li>Follow along with closed captions</li>
            <li>Review content without rewatching videos</li>
            <li>Access course materials in text format for better accessibility</li>
          </ul>
          <p className="text-sm bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            <strong>Note:</strong> Transcript generation typically takes a few minutes after video upload. 
            You can regenerate transcripts if needed using the AI transcript button next to each video.
          </p>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          className="btn-outline flex items-center"
          onClick={() => router.back()}
        >
          <FaArrowLeft className="mr-2" />
          Back to Course Details
        </button>
        <button
          className="btn-primary flex items-center"
          onClick={handleSaveCourse}
        >
          <FaSave className="mr-2" />
          Save Changes
        </button>
      </div>
    </TeacherLayout>
  );
}