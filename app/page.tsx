"use client";

import { useState, useEffect } from "react";
import { faker } from '@faker-js/faker';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import {
  UserPlusIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  StarIcon,
  MoonIcon,
  SunIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

interface Mentor {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  hourlyRate: number;
  experience: string[];
  expertise: string[];
  company: string;
  chatting: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  college: string;
  major: string;
  avatar: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

interface SuccessStory {
  id: string;
  studentName: string;
  studentAvatar: string;
  mentorName: string;
  story: string;
  outcome: string;
}

const mentorsGenerate = (count: number): Mentor[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatarGitHub(),
    bio: faker.person.bio(),
    hourlyRate: faker.number.int({ min: 40, max: 200 }),
    experience: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => 
      `${faker.company.name()} - ${faker.person.jobTitle()}`
    ),
    expertise: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => 
      faker.person.jobArea()
    ),
    company: faker.company.name(),
    chatting: faker.number.int({ min: 0, max: 3 }),
  }));
};

const succesStoryGenerate = (count: number): SuccessStory[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    studentName: faker.person.fullName(),
    studentAvatar: faker.image.avatarGitHub(),
    mentorName: faker.person.fullName(),
    story: faker.lorem.paragraph(3),
    outcome: faker.lorem.sentence(10),
  }));
};

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentView, setCurrentView] = useState<'home' | 'register' | 'mentors' | 'chat' | 'mentor-dashboard'>('home');
  const [registerType, setRegisterType] = useState<'student' | 'mentor' | null>(null);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [currentUser, setCurrentUser] = useState<Student | Mentor | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    major: '',
    experience: '',
    company: '',
    expertise: '',
    hourlyRate: '',
  });

  useEffect(() => {
    setMentors(mentorsGenerate(12));
    setSuccessStories(succesStoryGenerate(6));
    
    if (typeof window !== 'undefined') {const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDarkMode ? 'dark' : 'light');
  }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    // }
  }
  }, [theme]);

  const handleRegister = (type: 'student' | 'mentor') => {
    setRegisterType(type);
    setCurrentView('register');
  };

  const handlFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerType === 'student') {
      const newStudent: Student = {
        id: faker.string.uuid(),
        name: formData.name,
        email: formData.email,
        college: formData.college,
        major: formData.major,
        avatar: faker.image.avatar(),
      };
      setCurrentUser(newStudent);
      // setCurrentUser(newStudent);
      toast.success('Successfully registered as a student!');
      // toast.success('Successfully registered');
      setCurrentView('mentors');
    } else {
      const newMentor: Mentor = {
        id: faker.string.uuid(),
        name: formData.name,
        email: formData.email,
        avatar: faker.image.avatar(),
        bio: faker.person.bio(),
        hourlyRate: parseInt(formData.hourlyRate),
        experience: formData.experience.split(',').map(exp => exp.trim()),
        expertise: formData.expertise.split(',').map(exp => exp.trim()),
        company: formData.company,
        chatting: 0,
      };
      setMentors([...mentors, newMentor]);
      setCurrentUser(newMentor);
      toast.success('Successfully registered as a mentor!');
      // toast.success('Successfully registered');
      setCurrentView('mentor-dashboard'); 
    }
    
    setFormData({
      name: '',
      email: '',
      password: '',
      college: '',
      major: '',
      experience: '',
      company: '',
      expertise: '',
      hourlyRate: '',
    });
  };

  const handleInitiateChat = (mentor: Mentor) => {
    if (mentor.chatting >= 3) {toast.error('This mentor is currently at full capacity');
      return;
    }
    
    setSelectedMentor(mentor);
    
    toast.promise(
      new Promise((resolve) => {
        setTimeout(resolve, 2000);
      }),
      {
        loading: 'Processing payment...',
        success: () => {
          const updatedMentors = mentors.map(m => 
            m.id === mentor.id ? { ...m, chatting: m.chatting + 1 } : m
          );
          setMentors(updatedMentors);
          
          const initialMessages: Message[] = [
            {
              id: faker.string.uuid(),
              senderId: mentor.id,
              receiverId: currentUser?.id || '',
              content: `Hello! Thanks for connecting with me. How can I help you today?`,
              timestamp: new Date(),
            }
          ];
          setMessages(initialMessages);
          
          setCurrentView('chat');
          return 'Payment successful! Chat session started.';
        },
        error: 'Payment failed. Please try again.',
      }
    );
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentUser || !selectedMentor) return;
    
    const newMsg: Message = {
      id: faker.string.uuid(),
      senderId: currentUser.id,
      receiverId: selectedMentor.id,
      content: newMessage,
      timestamp: new Date(),
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    setTimeout(() => {
      const mentorResponse: Message = {
        id: faker.string.uuid(),
        senderId: selectedMentor.id,
        receiverId: currentUser.id,
        content: faker.helpers.arrayElement(["That's a great question! Let me explain...","I understand your concern. Here's what I think..."
          ,"Based on my experience, I would recommend...",
          "Let's break down this problem step by step.",
          "I've faced similar challenges. Here's how I approached it...",
        ]),
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, mentorResponse]);
    }, 1000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
    toast.success('Successfully logged out');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-slate-50 to-white'
      } transition-colors duration-300`}
    >
      <Toaster position="top-center" richColors />
      
      <header className={`w-full py-4 px-6 md:px-12 flex justify-between items-center ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-sm`}>
        <div className="flex items-center gap-2">
          {/* {currentView !== 'home' && (
            <button 
              onClick={() => setCurrentView('home')}
              className={`p-2 rounded-full ${
                theme === 'dark' 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-100'
              } transition-colors`}
            >
              <ArrowLeftIcon className={`h-5 w-5 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`} />
            </button>
          )} */}
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-8 h-8 rounded-md flex items-center justify-center text-white font-bold">M</div>
            <h1 className={`text-xl md:text-2xl font-bold ml-2 bg-gradient-to-r ${
              theme === 'dark'
                ? 'from-indigo-400 to-purple-400'
                : 'from-indigo-600 to-purple-600'
            } bg-clip-text text-transparent`}>
              MentorMatch
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {currentUser && (
            <>
              <div className="flex items-center gap-2">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-full object-cover border-2 border-purple-500"
                />
                <span className={`text-sm font-medium hidden md:block ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {currentUser.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className={`text-sm py-1 px-3 rounded-md ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                } transition-colors`}
              >
                Logout
              </button>
            </>
          )}
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              theme === 'dark' 
                ? 'hover:bg-gray-700' 
                : 'hover:bg-gray-100'
            } transition-colors`}
          >
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5 text-yellow-400" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pb-32">
        {currentView === 'home' && (
          <>
            <section className="py-12 md:py-20">
              <div className="max-w-5xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className={`text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r ${
                    theme === 'dark'
                      ? 'from-indigo-400 via-purple-400 to-pink-400'
                      : 'from-indigo-600 via-purple-600 to-pink-600'
                  } bg-clip-text text-transparent`}>
                    Connect with Top Industry Mentors
                  </h1>
                  <p className={`text-xl md:text-2xl ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  } max-w-3xl mx-auto mb-10`}>
                    Get personalized guidance from experienced professionals to accelerate your career growth.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRegister('student')}
                      className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                    >
                      <AcademicCapIcon className="h-5 w-5" />
                      Join as Student
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRegister('mentor')}
                      className={`px-8 py-4 ${
                        theme === 'dark' 
                          ? 'bg-gray-800 text-white border-2 border-gray-700' 
                          : 'bg-white text-gray-800 border-2 border-gray-200'
                      } rounded-xl font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all`}
                    >
                      <UserPlusIcon className="h-5 w-5" />
                      Become a Mentor
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </section>
            
            <section className={`py-16 ${
              theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
            } rounded-3xl my-12`}>
              <div className="max-w-6xl mx-auto px-4">
                <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  How MentorMatch Works
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      icon: <UserGroupIcon className="h-10 w-10 text-indigo-500" />,
                      title: "Match with Industry Experts",
                      description: "Browse profiles of experienced mentors from top companies and connect with those who match your career goals."
                    },
                    {
                      icon: <CurrencyDollarIcon className="h-10 w-10 text-purple-500" />,
                      title: "Book Affordable Sessions",
                      description: "Pay for hour-long sessions at rates set by mentors, ensuring accessible guidance for students at all levels."
                    },
                    {
                      icon: <ChatBubbleLeftRightIcon className="h-10 w-10 text-pink-500" />,
                      title: "Chat and Get Guidance",
                      description: "Ask questions, get feedback on your projects, and receive personalized career advice in real-time."
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className={`${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                      } p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow`}
                    >
                      <div className={`${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      } p-3 rounded-lg w-fit mb-4`}>
                        {item.icon}
                      </div>
                      <h3 className={`text-xl font-bold mb-3 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>{item.title}</h3>
                      <p className={`${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>{item.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
            
            <section className="py-16">
              <div className="max-w-6xl mx-auto">
                <h2 className={`text-3xl md:text-4xl font-bold text-center mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  Success Stories
                </h2>
                <p className={`text-center ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                } mb-12 max-w-2xl mx-auto`}>
                  See how MentorMatch has helped students achieve their career goals and land their dream jobs.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {successStories.map((story, index) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                      } p-6 rounded-xl shadow-md hover:shadow-lg transition-all`}
                    >
                      <div className="flex items-center mb-4">
                        <img 
                          src={story.studentAvatar} 
                          alt={story.studentName} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="ml-4">
                          <h3 className={`font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-800'
                          }`}>{story.studentName}</h3>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>Mentored by {story.mentorName}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <p className={`${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        } italic`}>"{story.story}"</p>
                        <p className={`${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                        } font-medium`}>{story.outcome}</p>
                        
                        <div className="flex text-yellow-400">
                          {Array(5).fill(0).map((_, i) => (
                            <StarIcon key={i} className="h-5 w-5" />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
        
        {currentView === 'register' && (
          <div className={`max-w-2xl mx-auto ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-xl shadow-lg p-8 mt-8`}>
            <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Register as a {registerType === 'student' ? 'Student' : 'Mentor'}
            </h2>
            
            <form onSubmit={handleSubmitForm} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  } mb-1`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handlFormChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      theme === 'dark' 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300 bg-white text-gray-800'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  } mb-1`}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handlFormChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      theme === 'dark' 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300 bg-white text-gray-800'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className={`block text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  } mb-1`}>
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handlFormChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      theme === 'dark' 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300 bg-white text-gray-800'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                </div>
                
                {registerType === 'student' ? (
                  <>
                    <div>
                      <label htmlFor="college" className={`block text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                      } mb-1`}>
                        College/University
                      </label>
                      <input
                        type="text"
                        id="college"
                        name="college"
                        required
                        value={formData.college}
                        onChange={handlFormChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === 'dark' 
                            ? 'border-gray-600 bg-gray-700 text-white' 
                            : 'border-gray-300 bg-white text-gray-800'
                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="major" className={`block text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                      } mb-1`}>
                        Major/Field of Study
                      </label>
                      <input
                        type="text"
                        id="major"
                        name="major"
                        required
                        value={formData.major}
                        onChange={handlFormChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === 'dark' 
                            ? 'border-gray-600 bg-gray-700 text-white' 
                            : 'border-gray-300 bg-white text-gray-800'
                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label htmlFor="company" className={`block text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                      } mb-1`}>
                        Current Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        required
                        value={formData.company}
                        onChange={handlFormChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === 'dark' 
                            ? 'border-gray-600 bg-gray-700 text-white' 
                            : 'border-gray-300 bg-white text-gray-800'
                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="experience" className={`block text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                      } mb-1`}>
                        Work Experience (comma separated)
                      </label>
                      <input
                        type="text"
                        id="experience"
                        name="experience"
                        required
                        value={formData.experience}
                        onChange={handlFormChange}
                        placeholder="Company - Position, Company - Position"
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === 'dark' 
                            ? 'border-gray-600 bg-gray-700 text-white' 
                            : 'border-gray-300 bg-white text-gray-800'
                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="expertise" className={`block text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                      } mb-1`}>
                        Areas of Expertise (comma separated)
                      </label>
                      <input
                        type="text"
                        id="expertise"
                        name="expertise"
                        required
                        value={formData.expertise}
                        onChange={handlFormChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === 'dark' 
                            ? 'border-gray-600 bg-gray-700 text-white' 
                            : 'border-gray-300 bg-white text-gray-800'
                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="hourlyRate" className={`block text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                      } mb-1`}>
                        Hourly Rate ($)
                      </label>
                      <input
                        type="number"
                        id="hourlyRate"
                        name="hourlyRate"
                        required
                        min="1"
                        max="500"
                        value={formData.hourlyRate}
                        onChange={handlFormChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === 'dark' 
                            ? 'border-gray-600 bg-gray-700 text-white' 
                            : 'border-gray-300 bg-white text-gray-800'
                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      />
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        )}
        
        {currentView === 'mentors' && (
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Available Mentors
            </h2>
            <p className={`${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            } mb-8`}>
              Browse our list of experienced mentors and connect with someone who can help you achieve your goals.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor, index) => (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  } rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all`}
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <img 
                        src={mentor.avatar} 
                        alt={mentor.name} 
                        className={`w-16 h-16 rounded-full object-cover border-4 ${
                          theme === 'dark' ? 'border-gray-700' : 'border-indigo-100'
                        }`}
                      />
                      <div className="ml-4">
                        <h3 className={`font-bold text-lg ${
                          theme === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}>{mentor.name}</h3>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>{mentor.company}</p>
                      </div>
                    </div>
                    
                    <p className={`${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    } mb-4 line-clamp-3`}>{mentor.bio}</p>
                    
                    <div className="mb-4">
                      <h4 className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                      } mb-2`}>Expertise:</h4>
                      <div className="flex flex-wrap gap-2">
                        {mentor.expertise.map((skill, i) => (
                          <span 
                            key={i}
                            className={`text-xs ${
                              theme === 'dark' 
                                ? 'bg-indigo-900/30 text-indigo-300' 
                                : 'bg-indigo-100 text-indigo-800'
                            } px-3 py-1 rounded-full`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="sticky bottom-4">
                    <div className={`flex justify-between items-center pt-4 border-t ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                    }`}>
                      <div className={`text-xl font-bold ${
                        theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                      }`}>
                        ${mentor.hourlyRate}/hr
                      </div>
                      
                      <button
                        onClick={() => handleInitiateChat(mentor)}
                        disabled={mentor.chatting >= 3}
                        className={`px-4 py-2 rounded-lg font-medium shadow-sm ${
                          mentor.chatting >= 3
                            ? theme === 'dark'
                              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        } transition-colors`}
                      >
                        {mentor.chatting >= 3 ? 'Unavailable' : 'Book Session'}
                      </button>
                    </div>
                    
                    {mentor.chatting >= 3 && (
                      <p className="text-xs text-red-500 mt-2 text-center">
                        This mentor is currently at full capacity
                      </p>
                    )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {currentView === 'chat' && selectedMentor && (
          <div className={`max-w-4xl mx-auto ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-xl shadow-lg overflow-hidden`}>
            <div className={`border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            } p-4 flex items-center`}>
              <img 
                src={selectedMentor.avatar} 
                alt={selectedMentor.name} 
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-4">
                <h3 className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>{selectedMentor.name}</h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>{selectedMentor.company}</p>
              </div>
              <div className="ml-auto flex items-center">
                <span className={`${
                  theme === 'dark'
                    ? 'bg-green-900/30 text-green-300'
                    : 'bg-green-100 text-green-800'
                } text-xs px-3 py-1 rounded-full`}>
                  Active Session
                </span>
              </div>
            </div>
            
            <div className="h-[500px] overflow-y-auto p-6 flex flex-col gap-4">
              {messages.map((msg) => {
                const isFromMentor = msg.senderId === selectedMentor.id;
                
                return (
                  <div 
                    key={msg.id}
                    className={`flex ${isFromMentor ? 'justify-start' : 'justify-end'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        isFromMentor 
                          ? theme === 'dark'
                            ? 'bg-gray-700 text-white rounded-tl-none'
                            : 'bg-gray-100 text-gray-800 rounded-tl-none'
                          : 'bg-indigo-600 text-white rounded-tr-none'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        isFromMentor 
                          ? theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          : 'text-indigo-100'
                      }`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className={`p-4 border-t ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    theme === 'dark' 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-800'
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Send
                </button>
              </div>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              } mt-2`}>
                Your session will expire in 60 minutes. You can extend it for an additional fee.
              </p>
            </div>
          </div>
        )}
        
        {currentView === 'mentor-dashboard' && (
          <div className="max-w-4xl mx-auto">
            <div className={`${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } rounded-xl shadow-lg p-8 mt-8`}>
              <div className="text-center py-10">
                <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 mb-6">
                  <UserGroupIcon className={`h-12 w-12 ${
                    theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                  }`} />
                </div>
                <h2 className={`text-2xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  You don't have any students yet
                </h2>
                <p className={`text-lg mb-8 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  We'll notify you at {currentUser?.email} once a student books a session with you.
                </p>
                <div className="space-y-6 max-w-lg mx-auto">
                  <div className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <h3 className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>Your profile is live!</h3>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Students can now view your profile and book sessions with you.
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <h3 className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>Hourly rate: ${currentUser && 'hourlyRate' in currentUser ? currentUser.hourlyRate : 0}</h3>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      You'll receive 85% of this amount for each session.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="mt-10 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className={`${
        theme === 'dark' ? 'bg-gray-800/80 backdrop-blur-md' : 'bg-gray-50'
      } py-4 mt-12 fixed bottom-0 w-full`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-2 md:mb-0">
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-6 h-6 rounded-md flex items-center justify-center text-white font-bold">M</div>
              <h2 className={`text-lg font-bold ml-2 bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-indigo-400 to-purple-400'
                  : 'from-indigo-600 to-purple-600'
              } bg-clip-text text-transparent`}>
                MentorMatch
              </h2>
            </div>
            
            <div className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              © {new Date().getFullYear()} MentorMatch. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}