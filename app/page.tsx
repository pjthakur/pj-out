'use client'

import { Inter } from 'next/font/google';
import React, { useState, useEffect, useRef } from 'react';
import { Camera, Calendar, User, FileText, MessageSquare, BarChart2, Settings, LogOut, Clock, MapPin, Laptop, Twitter, Github, Dribbble } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Types
interface Speaker {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  organization: string;
  role: string;
}

interface Session {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  speakerId: string;
  handoutUrl?: string;
  roomName: string;
  streamUrl: string;
  category: 'Development' | 'Design' | 'AI/ML' | 'Security';
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

interface SurveyQuestion {
  id: string;
  question: string;
  options: string[];
}

interface Survey {
  id: string;
  sessionId: string;
  title: string;
  questions: SurveyQuestion[];
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  studentId: string;
  avatar: string;
  savedSessions: string[];
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
}

// Mock Data
const MOCK_SPEAKERS: Speaker[] = [
  {
    id: 's1',
    name: 'Dr. Jane Smith',
    bio: 'AI researcher with 15 years of experience in machine learning and computer vision.',
    avatar: 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg',
    organization: 'Tech University',
    role: 'Professor of Artificial Intelligence'
  },
  {
    id: 's2',
    name: 'Mark Johnson',
    bio: 'Full-stack developer specializing in React and TypeScript applications.',
    avatar: 'https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436185.jpg',
    organization: 'State University.',
    role: 'Professor of Web Development'
  },
  {
    id: 's3',
    name: 'Sarah Williams',
    bio: 'Cybersecurity expert focusing on secure application development practices.',
    avatar: 'https://img.freepik.com/free-psd/3d-illustration-person-with-rainbow-hat_23-2149436197.jpg',
    organization: 'CalTech University',
    role: 'Professor of Cybersecurity'
  },
  {
    id: 's4',
    name: 'David Chen',
    bio: 'UX/UI design expert specializing in design systems and accessibility.',
    avatar: 'https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436178.jpg',
    organization: 'Harvard University',
    role: 'Professor of Design'
  },
  {
    id: 's5',
    name: 'Emily Rodriguez',
    bio: 'Cloud architecture specialist with expertise in serverless and microservices.',
    avatar: 'https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436180.jpg',
    organization: 'Michigan State University',
    role: 'Professor of Cloud Computing'
  },
  {
    id: 's6',
    name: 'Michael Chang',
    bio: 'Mobile development expert focusing on cross-platform solutions.',
    avatar: 'https://img.freepik.com/free-psd/3d-illustration-person-with-rainbow-hat_23-2149436191.jpg',
    organization: 'MobileFirst Inc',
    role: 'CTO Mobile Development'
  }
];

const MOCK_SESSIONS: Session[] = [
  {
    id: 'session1',
    title: 'Introduction to React Hooks',
    description: 'Learn the fundamentals of React Hooks and how they can simplify your code.',
    startTime: new Date(),
    endTime: new Date(Date.now() + 3600000),
    speakerId: 's2',
    handoutUrl: '#handout1',
    roomName: 'Main Hall',
    streamUrl: 'https://example.com/stream1',
    category: 'Development',
  },
  {
    id: 'session2',
    title: 'Machine Learning in Web Applications',
    description: 'Exploring ways to integrate ML models into modern web applications.',
    startTime: new Date(2025, 4, 25, 11, 0),
    endTime: new Date(2025, 4, 25, 12, 30),
    speakerId: 's1',
    handoutUrl: '#handout2',
    roomName: 'Tech Lab',
    streamUrl: 'https://example.com/stream2',
    category: 'AI/ML',
  },
  {
    id: 'session3',
    title: 'Securing Your Frontend Applications',
    description: 'Best practices for creating secure frontend applications.',
    startTime: new Date(2025, 4, 25, 14, 0),
    endTime: new Date(2025, 4, 25, 15, 30),
    speakerId: 's3',
    roomName: 'Security Room',
    streamUrl: 'https://example.com/stream3',
    category: 'Security',
  },
  {
    id: 'session4',
    title: 'Advanced TypeScript Patterns',
    description: 'Explore advanced patterns and techniques in TypeScript development.',
    startTime: new Date(2025, 4, 26, 9, 0),
    endTime: new Date(2025, 4, 26, 10, 30),
    speakerId: 's2',
    handoutUrl: '#handout4',
    roomName: 'Main Hall',
    streamUrl: 'https://example.com/stream4',
    category: 'Development',
  },
  {
    id: 'session5',
    title: 'Design Systems in Practice',
    description: 'Learn how to create and maintain scalable design systems.',
    startTime: new Date(2025, 4, 26, 11, 0),
    endTime: new Date(2025, 4, 26, 12, 30),
    speakerId: 's4',
    handoutUrl: '#handout5',
    roomName: 'Design Studio',
    streamUrl: 'https://example.com/stream5',
    category: 'Design',
  },
  {
    id: 'session6',
    title: 'Serverless Architecture Patterns',
    description: 'Explore modern serverless architecture patterns and best practices.',
    startTime: new Date(2025, 4, 26, 14, 0),
    endTime: new Date(2025, 4, 26, 15, 30),
    speakerId: 's5',
    roomName: 'Cloud Room',
    streamUrl: 'https://example.com/stream6',
    category: 'Development',
  },
  {
    id: 'session7',
    title: 'Cross-Platform Mobile Development',
    description: 'Building efficient mobile applications for multiple platforms.',
    startTime: new Date(2025, 4, 27, 9, 0),
    endTime: new Date(2025, 4, 27, 10, 30),
    speakerId: 's6',
    handoutUrl: '#handout7',
    roomName: 'Mobile Lab',
    streamUrl: 'https://example.com/stream7',
    category: 'Development',
  },
  {
    id: 'session8',
    title: 'Advanced AI Model Training',
    description: 'Deep dive into training complex AI models efficiently.',
    startTime: new Date(2025, 4, 27, 11, 0),
    endTime: new Date(2025, 4, 27, 12, 30),
    speakerId: 's1',
    handoutUrl: '#handout8',
    roomName: 'AI Lab',
    streamUrl: 'https://example.com/stream8',
    category: 'AI/ML',
  }
];

const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'c1',
    userId: 'u1',
    userName: 'Alex',
    message: 'Great presentation so far!',
    timestamp: new Date(2025, 4, 25, 9, 15)
  },
  {
    id: 'c2',
    userId: 'u2',
    userName: 'Taylor',
    message: 'Could you explain the useState hook again?',
    timestamp: new Date(2025, 4, 25, 9, 18)
  },
  {
    id: 'c3',
    userId: 'u3',
    userName: 'Jordan',
    message: 'Is there a GitHub repo with these examples?',
    timestamp: new Date(2025, 4, 25, 9, 20)
  }
];

const MOCK_SURVEY: Survey = {
  id: 'survey1',
  sessionId: 'session1',
  title: 'React Hooks Feedback',
  questions: [
    {
      id: 'q1',
      question: 'How would you rate your understanding of React Hooks before this session?',
      options: ['Beginner', 'Intermediate', 'Advanced']
    },
    {
      id: 'q2',
      question: 'Which topic would you like to learn more about?',
      options: ['useState', 'useEffect', 'useContext', 'useReducer', 'Custom Hooks']
    },
    {
      id: 'q3',
      question: 'How would you rate the presenter?',
      options: ['Excellent', 'Good', 'Average', 'Below Average']
    }
  ]
};

const MOCK_USER: UserProfile = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex@studentuniversity.com',
  studentId: '2ke3218321',
  avatar: 'https://img.freepik.com/free-psd/3d-illustration-person-with-glasses-half-length-portrait_23-2149436189.jpg',
  savedSessions: ['session1', 'session3'],
  preferences: {
    theme: 'light',
    notifications: true,
    fontSize: 'medium'
  }
};

// Main Component
const VirtualClassroom: React.FC = () => {
  const [activeView, setActiveView] = useState<'schedule' | 'session' | 'profile' | 'speakers'>('schedule');
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [activeSpeaker, setActiveSpeaker] = useState<Speaker | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER);
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, string>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All Sessions');
  const [downloadButtonText, setDownloadButtonText] = useState('Download Class Materials');

  const calendarRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView, activeSession, activeSpeaker]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isSessionLive = (session: Session): boolean => {
    return session.id === 'session1';
  };

  const groupSessionsByDate = (sessions: Session[]) => {
    const groups: Record<string, Session[]> = {};
    
    sessions.forEach(session => {
      const dateKey = formatDate(session.startTime);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(session);
    });
    
    return groups;
  };

  const sendChatMessage = () => {
    if (newMessage.trim() === '') return;
    
    const newChatMessage: ChatMessage = {
      id: `c${chatMessages.length + 1}`,
      userId: userProfile.id,
      userName: userProfile.name,
      message: newMessage,
      timestamp: new Date()
    };
    
    setChatMessages([...chatMessages, newChatMessage]);
    setNewMessage('');
  };

  const toggleSaveSession = (sessionId: string) => {
    const session = MOCK_SESSIONS.find(s => s.id === sessionId);
    if (!session) return;

    const updatedSavedSessions = userProfile.savedSessions.includes(sessionId)
      ? userProfile.savedSessions.filter(id => id !== sessionId)
      : [...userProfile.savedSessions, sessionId];
    
    setUserProfile({
      ...userProfile,
      savedSessions: updatedSavedSessions
    });

    if (updatedSavedSessions.includes(sessionId)) {
      toast.success(`Added "${session.title}" to your saved sessions`, {
        duration: 2000,
        position: 'bottom-right',
        icon: '★',
      });
    } else {
      toast.success(`Removed "${session.title}" from your saved sessions`, {
        duration: 2000,
        position: 'bottom-right',
        icon: '☆',
      });
    }
  };

  const submitSurvey = () => {
    console.log('Survey submitted:', surveyAnswers);
    setShowSurvey(false);
    alert('Thank you for completing the survey!');
  };

  const getSessionSpeaker = (speakerId: string): Speaker | undefined => {
    return MOCK_SPEAKERS.find(speaker => speaker.id === speakerId);
  };

  const getFilteredSessions = (sessions: Session[]) => {
    if (activeCategory === 'All Sessions') return sessions;
    return sessions.filter(session => session.category === activeCategory);
  };

  const cardStyles = "group bg-[#b7d4fb] rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-transparent cursor-pointer";
  const featureCardStyles = "bg-[#9e8bf8] rounded-xl p-6 shadow-sm hover:shadow-md transition-all text-center";
  const buttonStyles = "cursor-pointer transition-all duration-200 text-white/80";

  const formatCalendarEvents = (sessions: Session[]) => {
    return sessions.map(session => ({
      id: session.id,
      title: session.title,
      start: session.startTime,
      end: session.endTime,
      backgroundColor: 
        session.category === 'Development' ? '#3b82f6' :
        session.category === 'Design' ? '#8b5cf6' :
        session.category === 'AI/ML' ? '#ec4899' :
        '#10b981',
      extendedProps: {
        description: session.description,
        roomName: session.roomName,
        category: session.category
      }
    }));
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setDownloadButtonText('Downloading...');
    
    setTimeout(() => {
      setDownloadButtonText('Downloaded!');
      
      setTimeout(() => {
        setDownloadButtonText('Download Class Materials');
      }, 1000);
    }, 2000);
  };

  const renderScheduleView = () => {
    const filteredSessions = getFilteredSessions(MOCK_SESSIONS);
    const sessionsByDate = groupSessionsByDate(filteredSessions);
    
    return (
      <div className="p-4 max-w-7xl mx-auto">
        <div className="relative mb-16 shadow-lg rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl" />
          <div className="relative p-8 md:p-12">
            <span className="inline-block px-4 py-1 bg-[#9e8bf8] text-blue-600 rounded-full text-white/80 text-sm font-medium mb-4">
              Virtual Classroom Platform
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent text-white">
              Learn. Engage. Excel.
            </h2>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-8">
              Join our interactive virtual classrooms led by expert professors. Experience engaging 
              lectures and real-time collaboration from anywhere in the world.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={featureCardStyles}>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Laptop className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Virtual Classes</h3>
                <p className="text-white/70 text-sm mx-auto max-w-xs">
                  Join live lectures from anywhere with high-quality video streaming
                </p>
              </div>
              
              <div className={featureCardStyles}>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Expert Faculty</h3>
                <p className="text-white/70 text-sm mx-auto max-w-xs">
                  Learn from industry professionals and experienced professors
                </p>
              </div>
              
              <div className={featureCardStyles}>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Interactive Learning</h3>
                <p className="text-sm mx-auto max-w-xs text-white/70">
                  Participate in real-time discussions and Q&A sessions
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-4 mb-12 pb-4 scrollbar-hide">
          {['All Sessions', 'Development', 'Design', 'AI/ML', 'Security'].map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`${buttonStyles} px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                ${activeCategory === category 
                  ? 'bg-[#9e8bf8] text-gray-100 shadow-md' 
                  : 'bg-[#6353f6] text-gray-600 hover:bg-[#9e8bf8]'}`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Sessions Found</h3>
            <p className="text-gray-500">
              There are currently no sessions scheduled for {activeCategory}.
              <br />
              <button 
                onClick={() => setActiveCategory('All Sessions')}
                className={`${buttonStyles} text-blue-500 hover:text-blue-600 mt-2`}
              >
                View all sessions
              </button>
            </p>
          </div>
        ) : (
          Object.entries(sessionsByDate).map(([date, sessions]) => (
            <div key={date} className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-xl font-bold text-white">{date}</h3>
                <div className="h-px flex-1 bg-gray-100" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map(session => {
                  const speaker = getSessionSpeaker(session.speakerId);
                  const isSaved = userProfile.savedSessions.includes(session.id);
                  
                  return (
                    <div 
                      key={session.id} 
                      className={cardStyles}
                      onClick={() => {
                        setActiveSession(session);
                        setActiveView('session');
                      }}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-2">
                            {isSessionLive(session) && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <span className="animate-pulse mr-1.5 h-1.5 w-1.5 bg-green-500 rounded-full"></span>
                                Live Now
                              </span>
                            )}
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                              {formatTime(session.startTime)} - {formatTime(session.endTime)}
                            </div>
                          </div>
                          <button 
                            className={`${buttonStyles} p-2 hover:scale-110 transform transition-all duration-200
                              ${isSaved ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-500'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaveSession(session.id);
                            }}
                          >
                            {isSaved ? '★' : '☆'}
                          </button>
                        </div>

                        <h4 className="font-bold text-lg mb-2 group-hover:text-blue-600 
                          transition-colors duration-200">
                          {session.title}
                        </h4>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {session.description}
                        </p>

                        {speaker && (
                          <div className="flex items-center pt-4 border-t border-[#6353f6]">
                            <img 
                              src={speaker.avatar} 
                              alt={speaker.name}
                              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                            />
                            <div className="ml-3">
                              <p className="text-sm font-medium">{speaker.name}</p>
                              <p className="text-xs text-gray-500">{speaker.role}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  const renderSessionView = () => {
    if (!activeSession) return null;
    
    const speaker = getSessionSpeaker(activeSession.speakerId);
    const isSaved = userProfile.savedSessions.includes(activeSession.id);
    
    return (
      <div className="p-4">
        <button 
          className={`${buttonStyles} mb-4 flex items-center text-blue-500 hover:text-blue-700`}
          onClick={() => setActiveView('schedule')}
        >
          ← Back to Schedule
        </button>

        <div className="bg-[#9e8bf8] text-gray rounded-xl p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div>
              <h2 className="text-2xl text-white/90 font-bold mb-2">{activeSession.title}</h2>
              <p className="text-white/90">{activeSession.description}</p>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-white/90">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-white/90" />
                  <span>{formatDate(activeSession.startTime)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-white/90" />
                  <span>{formatTime(activeSession.startTime)} - {formatTime(activeSession.endTime)}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-white/90" />
                  <span>{activeSession.roomName}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => toggleSaveSession(activeSession.id)}
              className={`${buttonStyles} px-4 py-2 rounded-lg border-2 border-white/20 hover:bg-white/10 
                transition-colors flex items-center gap-2 ${userProfile.savedSessions.includes(activeSession.id) 
                ? 'text-yellow-300' 
                : 'text-white'}`}
            >
              {userProfile.savedSessions.includes(activeSession.id) ? '★ Saved' : '☆ Save Session'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-white/90">Live Stream</h3>
                <div className="aspect-video w-full bg-gray-800 rounded-xl shadow-sm overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isSessionLive(activeSession) ? (
                      <div className="text-center p-8">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Camera className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-200 mb-2">Live Stream Active</h3>
                        <p className="text-gray-400">
                          Stream URL: {activeSession?.streamUrl}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center p-8">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Camera className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-200 mb-2">Live Stream Will Start Soon</h3>
                        <p className="text-gray-400">
                          The session will begin at {activeSession && formatTime(activeSession.startTime)}. 
                          Please stay tuned.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-1 h-full">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-white/90">Live Chat</h3>
                <button 
                  className={`${buttonStyles} text-blue-500 text-sm hover:text-blue-700`}
                  onClick={() => setShowSurvey(true)}
                >
                  Take Survey
                </button>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-transparent flex flex-col h-[calc(100%-2.5rem)]">
                <div className="flex-1 p-4 overflow-y-auto">
                  {chatMessages.map(message => (
                    <div key={message.id} className="mb-4 last:mb-0">
                      <div className="flex items-start space-x-2">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#6353f6] flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {message.userName.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline space-x-2">
                            <span className="font-semibold text-[#6353f6]">{message.userName}</span>
                            <span className="text-xs text-gray-400">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-gray-700 bg-white/50 rounded-lg py-2 px-3">
                            {message.message}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 border-t border-[#6353f6]">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-text"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') sendChatMessage();
                      }}
                    />
                    <button
                      onClick={sendChatMessage}
                      className={`${buttonStyles} px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600`}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-transparent p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
              <h3 className="text-lg font-semibold">About this Lecture</h3>
            </div>
            
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed">
                {activeSession.description}
              </p>

              {speaker && (
                <div className="border-t border-[#6353f6] pt-6">
                  <h4 className="text-sm font-semibold text-gray-500 mb-4">Presented by</h4>
                  <div className="flex items-start gap-4">
                    <img 
                      src={speaker.avatar} 
                      alt={speaker.name}
                      className="w-16 h-16 rounded-full ring-2 ring-purple-100"
                    />
                    <div>
                      <h3 className="font-bold text-lg mb-1">{speaker.name}</h3>
                      <p className="text-purple-600 text-sm mb-2">{speaker.role} at {speaker.organization}</p>
                      <p className="text-gray-600 text-sm">{speaker.bio}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSession.handoutUrl && (
                <div className="border-t border-[#6353f6] pt-6">
                  <h4 className="text-sm font-semibold text-gray-500 mb-4">Resources</h4>
                  <a 
                    href={activeSession.handoutUrl}
                    onClick={handleDownloadClick}
                    className={`${buttonStyles} inline-flex items-center px-4 py-2 bg-[#6353f6] text-white rounded-lg hover:bg-[#4a3bc4] hover:text-white transition-colors`}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {downloadButtonText}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {showSurvey && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-h-[90vh] w-full max-w-lg">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
                  <h3 className="text-xl font-bold">{MOCK_SURVEY.title}</h3>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-6">
                  {MOCK_SURVEY.questions.map(question => (
                    <div key={question.id} className="space-y-4">
                      <p className="font-medium text-gray-900">{question.question}</p>
                      <div className="space-y-2">
                        {question.options.map(option => (
                          <label 
                            key={option} 
                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors
                              ${surveyAnswers[question.id] === option 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-blue-200'}`}
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={option}
                              checked={surveyAnswers[question.id] === option}
                              onChange={() => {
                                setSurveyAnswers({
                                  ...surveyAnswers,
                                  [question.id]: option
                                });
                              }}
                              className="form-radio text-blue-500 focus:ring-blue-500 h-4 w-4"
                            />
                            <span className="ml-3 text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-end items-center gap-3">
                  <button
                    onClick={() => setShowSurvey(false)}
                    className={`${buttonStyles} px-4 py-2 bg-green-500 text-white rounded-lg hover:text-white-900`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitSurvey}
                    className={`${buttonStyles} px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                      transition-colors`}
                  >
                    Submit Survey
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderProfessorView = () => {
    return (
      <div className="p-4 max-w-5xl mx-auto">
        {!activeSpeaker && (
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Our Distinguished Faculty
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Meet our world-class professors who bring years of industry and academic 
              experience to the virtual classroom. Each expert is committed to providing 
              an engaging and interactive learning experience.
            </p>
            <div className="inline-flex items-center space-x-2 text-white/80 bg-white/10 rounded-full px-4 py-2 mb-8">
              <span className="text-sm">
                {MOCK_SESSIONS.length} Active Courses • {MOCK_SPEAKERS.length} Expert Professors
              </span>
            </div>
          </div>
        )}

        {activeSpeaker ? (
          <>
            <button 
              className={`${buttonStyles} mb-4 flex items-center text-blue-500 hover:text-blue-700`}
              onClick={() => setActiveSpeaker(null)}
            >
              ← Back to Faculty
            </button>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-8 mb-8">
              <div className="flex flex-col items-center text-center text-white">
                <img 
                  src={activeSpeaker.avatar} 
                  alt={activeSpeaker.name}
                  className="w-32 h-32 rounded-full border-4 border-white/50 mb-4"
                />
                <h2 className="text-3xl font-bold mb-2">{activeSpeaker.name}</h2>
                <p className="text-purple-100 text-lg mb-1">{activeSpeaker.role}</p>
                <p className="text-blue-100">{activeSpeaker.organization}</p>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-purple-500 to-pink-500" />
                <h3 className="text-xl font-bold">Biography</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{activeSpeaker.bio}</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-purple-500 to-pink-500" />
                <h3 className="text-xl font-bold">Upcoming Lectures</h3>
              </div>
              
              <div className="grid gap-4">
                {MOCK_SESSIONS
                  .filter(session => session.speakerId === activeSpeaker.id)
                  .map(session => (
                    <div 
                      key={session.id}
                      className={`${buttonStyles} group p-4 bg-gray-50/50 rounded-lg border border-gray-100 
                        hover:bg-white transition-all duration-200 cursor-pointer`}
                      onClick={() => {
                        setActiveSession(session);
                        setActiveView('session');
                      }}
                    >
                      <h4 className="font-bold text-gray-900 group-hover:text-purple-600 
                        transition-colors duration-200 mb-2">
                        {session.title}
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        <span className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1.5 text-purple-500" />
                          {formatDate(session.startTime)}
                        </span>
                        <span className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1.5 text-purple-500" />
                          {formatTime(session.startTime)} - {formatTime(session.endTime)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_SPEAKERS.map(speaker => (
                <div 
                  key={speaker.id} 
                  className={cardStyles}
                  onClick={() => setActiveSpeaker(speaker)}
                >
                  <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 
                        text-xs font-medium rounded-full">
                        {speaker.role}
                      </span>
                    </div>

                    <div className="flex items-center mb-4">
                      <img 
                        src={speaker.avatar} 
                        alt={speaker.name}
                        className="w-16 h-16 rounded-full ring-2 ring-purple-100"
                      />
                      <div className="ml-4">
                        <h3 className="font-bold text-lg">{speaker.name}</h3>
                        <p className="text-purple-600 dark:text-[#6353f6] text-sm">{speaker.organization}</p>
                      </div>
                    </div>
                    
                    <p className="text-black/60 text-sm line-clamp-3">
                      {speaker.bio}
                    </p>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {MOCK_SESSIONS.filter(s => s.speakerId === speaker.id).length} Sessions
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStudentProfileView = () => {
    const savedSessions = MOCK_SESSIONS.filter(session => 
      userProfile.savedSessions.includes(session.id)
    );
    const events = formatCalendarEvents(savedSessions);
  
    const handleEventClick = (info: any) => {
      const session = MOCK_SESSIONS.find(s => s.id === info.event.id);
      if (session) {
        setActiveSession(session);
        setActiveView('session');
      }
    };
  
    return (
      <div className="p-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent text-white/80">
          My Profile
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex flex-col items-center text-center">
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.name}
                  className="w-32 h-32 rounded-xl ring-4 ring-purple-100 mb-6"
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{userProfile.name}</h3>
                  <p className="text-gray-600">Email: {userProfile.email}</p>
                  <p className="text-gray-600">Student ID: {userProfile.studentId}</p>
                </div>
              </div>
            </div>
  
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
                <h4 className="font-semibold">Preferences</h4>
              </div>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Notifications</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={userProfile.preferences.notifications}
                      onChange={(e) => setUserProfile({
                        ...userProfile,
                        preferences: {
                          ...userProfile.preferences,
                          notifications: e.target.checked
                        }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                      peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full 
                      peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                      after:left-[2px] after:bg-white after:border-gray-300 after:border 
                      after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500">
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
                <h4 className="font-semibold">My Saved lectures</h4>
              </div>
              
              {userProfile.savedSessions.length === 0 ? (
                <p className="text-gray-600">You haven't saved any lectures yet.</p>
              ) : (
                <div className="space-y-3">
                  {MOCK_SESSIONS
                    .filter(session => userProfile.savedSessions.includes(session.id))
                    .map(session => (
                      <div 
                        key={session.id}
                        className={`${buttonStyles} group p-4 bg-gray-50/50 rounded-lg border border-gray-100 
                          hover:bg-white transition-all duration-200 cursor-pointer`}
                        onClick={() => {
                          setActiveSession(session);
                          setActiveView('session');
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 
                              transition-colors duration-200">
                              {session.title}
                            </h4>
                            <p className="text-gray-600 text-sm mt-1">
                              {formatDate(session.startTime)} • {formatTime(session.startTime)} - {formatTime(session.endTime)}
                            </p>
                          </div>
                          
                          <button 
                            className={`${buttonStyles} p-2 rounded-full text-yellow-500 hover:scale-110 transform transition-all`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaveSession(session.id);
                            }}
                          >
                            ★
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
  
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-6">My Class Schedule</h3>
            <div className="calendar-container overflow-x-auto">
              <style jsx global>{`
                .fc {
                  --fc-border-color: #e5e7eb;
                  --fc-button-bg-color: #6353f6;
                  --fc-button-border-color: #6353f6;
                  --fc-button-hover-bg-color: #4a3bc4;
                  --fc-button-hover-border-color: #4a3bc4;
                  --fc-today-bg-color: #eef2ff;
                }
                .fc .fc-toolbar {
                  flex-direction: column;
                  gap: 1rem;
                }
                .fc .fc-toolbar-title {
                  font-size: 1.25rem;
                  margin: 0;
                }
                @media (min-width: 768px) {
                  .fc .fc-toolbar {
                    flex-direction: row;
                    justify-content: space-between;
                  }
                  .fc .fc-toolbar-title {
                    font-size: 1.5rem;
                  }
                }
                .fc .fc-button {
                  padding: 0.5rem 1rem;
                  font-size: 0.875rem;
                  border-radius: 0.5rem;
                }
                .fc .fc-event {
                  border-radius: 0.375rem;
                  padding: 0.25rem;
                  font-size: 0.875rem;
                }
                .fc-direction-ltr .fc-timegrid-slot-label-frame {
                  text-align: center;
                }
                .fc .fc-timegrid-slot-label {
                  font-size: 0.75rem;
                }
                .fc .fc-timegrid-axis-cushion {
                  font-size: 0.75rem;
                }
                .fc .fc-timegrid-slot-minor {
                  border-top-style: dashed;
                }
                .fc-theme-standard td, .fc-theme-standard th {
                  border-color: var(--fc-border-color);
                }
              `}</style>
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={events}
                eventClick={handleEventClick}
                height="auto"
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                expandRows={true}
                stickyHeaderDates={true}
                nowIndicator={true}
                allDaySlot={false}
                slotDuration="00:30:00"
                eventTimeFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  meridiem: false
                }}
                dayHeaderFormat={{
                  weekday: isMobile ? 'short' : 'long',
                  month: 'numeric',
                  day: 'numeric',
                  omitCommas: true
                }}
                views={{
                  timeGridWeek: {
                    titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
                  },
                  timeGridDay: {
                    titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${inter.className} ${
      userProfile.preferences.theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-[#6353f6] text-gray-900'
    }`}>
      <Toaster />
      <header className="sticky top-0 z-50 bg-[#6353f6] border-b border-white/10">
        <div className="relative max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => {
                  setActiveView('schedule');
                  setActiveSession(null);
                  setActiveSpeaker(null);
                }}
                className={`${buttonStyles} flex items-center space-x-2 hover:opacity-90 transition-opacity`}
              >
                <div className="bg-white/10 p-2 rounded-lg">
                  <Laptop className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                  ClassHive
                </h1>
              </button>
              
              <div 
                onClick={() => {
                  const liveSession = MOCK_SESSIONS.find(s => isSessionLive(s));
                  if (liveSession) {
                    setActiveSession(liveSession);
                    setActiveView('session');
                  }
                }}
                className={`${buttonStyles} hidden md:flex items-center px-3 py-1 bg-white/20 rounded-full text-sm text-white/90 hover:bg-white/30 cursor-pointer transition-colors`}
              >
                <span className="animate-pulse mr-1.5 h-2 w-2 bg-green-400 rounded-full"></span>
                Live Now: {MOCK_SESSIONS[0].title}
              </div>
            </div>
            
            {!isMobile && (
              <nav className="flex items-center space-x-6">
                <button 
                  className={`${buttonStyles} group flex items-center space-x-2 transition-all duration-200 
                    ${activeView === 'schedule' 
                      ? 'text-[#b7d4fb]' 
                      : 'text-white/75 hover:text-[#b7d4fb]'}`}
                  onClick={() => setActiveView('schedule')}
                >
                  <Calendar size={18} className="opacity-75 group-hover:opacity-100" />
                  <span className={`${activeView === 'schedule' ? 'border-b-2 border-[#b7d4fb]' : ''}`}>
                    Schedule
                  </span>
                </button>
                <button 
                  className={`${buttonStyles} group flex items-center space-x-2 transition-all duration-200 
                    ${activeView === 'speakers' && !activeSpeaker 
                      ? 'text-[#b7d4fb]' 
                      : 'text-white/75 hover:text-[#b7d4fb]'}`}
                  onClick={() => {
                    setActiveSpeaker(null);
                    setActiveView('speakers');
                  }}
                >
                  <User size={18} className="opacity-75 group-hover:opacity-100" />
                  <span className={`${activeView === 'speakers' ? 'border-b-2 border-[#b7d4fb]' : ''}`}>
                    Faculty
                  </span>
                </button>

                <div className="ml-4 pl-4 border-l border-white/20">
                  <button 
                    className={`${buttonStyles} flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
                      ${activeView === 'profile' 
                        ? 'bg-[#b7d4fb] text-blue-600' 
                        : 'bg-white/10 text-white/90 hover:bg-white/20'}`}
                    onClick={() => setActiveView('profile')}
                  >
                    <img 
                      src={userProfile.avatar} 
                      alt={userProfile.name}
                      className="w-6 h-6 rounded-full ring-2 ring-white/50"
                    />
                    <span>{userProfile.name}</span>
                  </button>
                </div>
              </nav>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        {isMobile && (
          <nav className="bg-[#6353f6] border-b border-white/10 p-2 flex justify-around sticky top-0 z-50">
            <button 
              className={`${buttonStyles} relative p-2 flex flex-col items-center rounded-lg transition-all duration-200 ${
                activeView === 'schedule' 
                  ? 'text-white bg-[#4a3bc4] shadow-lg' 
                  : 'text-white/75 hover:text-[#b7d4fb]'
              }`}
              onClick={() => setActiveView('schedule')}
            >
              <Calendar size={20} />
              <span className="text-xs mt-1">Schedule</span>
              {activeView === 'schedule' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full" />
              )}
            </button>
            <button 
              className={`${buttonStyles} relative p-2 flex flex-col items-center rounded-lg transition-all duration-200 ${
                activeView === 'speakers' && !activeSpeaker 
                  ? 'text-white bg-[#4a3bc4] shadow-lg' 
                  : 'text-white/75 hover:text-[#b7d4fb]'
              }`}
              onClick={() => {
                setActiveSpeaker(null);
                setActiveView('speakers');
              }}
            >
              <User size={20} />
              <span className="text-xs mt-1">Faculty</span>
              {activeView === 'speakers' && !activeSpeaker && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full" />
              )}
            </button>
            <button 
              className={`${buttonStyles} relative p-2 flex flex-col items-center rounded-lg transition-all duration-200 ${
                activeView === 'profile' 
                  ? 'text-white bg-[#4a3bc4] shadow-lg' 
                  : 'text-white/75 hover:text-[#b7d4fb]'
              }`}
              onClick={() => setActiveView('profile')}
            >
              <img 
                src={userProfile.avatar} 
                alt={userProfile.name}
                className="w-6 h-6 rounded-full ring-2 ring-white/50"
              />
              <span className="text-xs mt-1">Profile</span>
              {activeView === 'profile' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full" />
              )}
            </button>
          </nav>
        )}
        
        <main className="flex-1">
          {activeView === 'schedule' && renderScheduleView()}
          {activeView === 'session' && renderSessionView()}
          {activeView === 'profile' && renderStudentProfileView()}
          {activeView === 'speakers' && renderProfessorView()}
        </main>
      </div>

      <footer className="mt-auto border-t border-[#b7d4fb] text-white/80">
        <div className="bg-[#6353f6] backdrop-blur-sm text-white/80">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="col-span-1 md:col-span-2 ">
                <h3 className="text-xl font-bold bg-clip-text text-transparent text-white/80 mb-4">
                  ClassHive
                </h3>
                <p className="text-white/80 mb-4 max-w-sm">
                  Creating immersive virtual experiences for classrooms and workshops worldwide.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className={`${buttonStyles} text-gray-400 hover:text-blue-500 transition-colors`}>
                    <Twitter className="w-6 h-6" />
                  </a>
                  <a href="#" className={`${buttonStyles} text-gray-400 hover:text-blue-500 transition-colors`}>
                    <Github className="w-6 h-6" />
                  </a>
                  <a href="#" className={`${buttonStyles} text-gray-400 hover:text-blue-500 transition-colors`}>
                    <Dribbble className="w-6 h-6" />
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className={`${buttonStyles} hover:text-white transition-colors`}>About Us</a>
                  </li>
                  <li>
                    <a href="#" className={`${buttonStyles} hover:text-white transition-colors`}>Careers</a>
                  </li>
                  <li>
                    <a href="#" className={`${buttonStyles} hover:text-white transition-colors`}>Blog</a>
                  </li>
                  <li>
                    <a href="#" className={`${buttonStyles} hover:text-white transition-colors`}>Privacy Policy</a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className={`${buttonStyles} text-gray-600 hover:text-white transition-colors`}>Help Center</a>
                  </li>
                  <li>
                    <a href="#" className={`${buttonStyles} text-gray-600 hover:text-white transition-colors`}>Contact Us</a>
                  </li>
                  <li>
                    <a href="#" className={`${buttonStyles} text-gray-600 hover:text-white transition-colors`}>System Status</a>
                  </li>
                  <li>
                    <a href="#" className={`${buttonStyles} text-gray-600 hover:text-white transition-colors`}>Terms of Service</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-[#b7d4fb] pt-8">
              <p className="text-gray-400 text-sm text-center text-white/80">
                © {new Date().getFullYear()} ClassHive. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VirtualClassroom;