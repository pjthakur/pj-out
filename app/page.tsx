"use client";
import React, { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Montserrat } from 'next/font/google';

// Initialize the Montserrat font with subsets and weights
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

type Course = {
  id: string;
  title: string;
  instructor: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  reviewCount: number;
  institution: string;
  language: string;
  duration: string;
  schedule: string;
  enrolled: number;
  imageUrl: string;
  description: string;
  syllabus: {
    weeks: Array<{
      title: string;
      content: string[];
    }>
  };
  skills: string[];
};

type User = {
  id: string;
  name: string;
  email: string;
  enrolledCourses: Array<{
    courseId: string;
    progress: number;
    dateEnrolled: string;
  }>;
};

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

type UserContextType = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  enrollCourse: (courseId: string) => void;
  updateProgress: (courseId: string, progress: number) => void;
  register: (name: string, email: string, password: string) => boolean;
};

type ToastContextType = {
  showToast: (message: string, duration?: number) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const UserContext = createContext<UserContextType | undefined>(undefined);
const ToastContext = createContext<ToastContextType | undefined>(undefined);

const mockCourses: Course[] = [
  {
    id: 'c1',
    title: 'Automate Cybersecurity Tasks with Python',
    instructor: 'John Smith',
    category: 'Cybersecurity',
    level: 'Intermediate',
    rating: 4.7,
    reviewCount: 3254,
    institution: 'Google',
    language: 'English',
    duration: '1 month',
    schedule: 'Flexible schedule',
    enrolled: 12500,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1682145730713-34bba6d3d14a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Learn to automate essential cybersecurity tasks using Python programming.',
    syllabus: { weeks: [{ title: 'Week 1: Python Basics for Cybersecurity', content: ['Introduction to Python', 'Setting up your environment', 'Basic syntax and data types'] }, { title: 'Week 2: Automation Scripts', content: ['File handling in Python', 'Regular expressions', 'Creating your first automation script'] }, { title: 'Week 3: Network Security Automation', content: ['Network libraries in Python', 'Packet analysis', 'Automated scanning'] }, { title: 'Week 4: Final Project', content: ['Building a comprehensive security tool', 'Testing and validation', 'Deployment best practices'] }] },
    skills: ['Python Programming', 'Cybersecurity', 'Automation', 'Network Security']
  },
  {
    id: 'c2',
    title: 'Foundations of Cybersecurity',
    instructor: 'Sarah Johnson',
    category: 'Cybersecurity',
    level: 'Beginner',
    rating: 4.8,
    reviewCount: 5612,
    institution: 'IBM',
    language: 'English',
    duration: '1 month',
    schedule: 'Flexible schedule',
    enrolled: 28900,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1701179596614-9c64f50cda76?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Rm91bmRhdGlvbnMlMjBvZiUyMEN5YmVyc2VjdXJpdHl8ZW58MHx8MHx8fDA%3D',
    description: 'Get started with cybersecurity concepts and practices in this foundational course.',
    syllabus: { weeks: [{ title: 'Week 1: Introduction to Cybersecurity', content: ['Cybersecurity landscape', 'Common threats and vulnerabilities', 'Security principles'] }, { title: 'Week 2: Security Models', content: ['Access control models', 'Authentication mechanisms', 'Security policies'] }, { title: 'Week 3: Threat Detection', content: ['Monitoring systems', 'Log analysis', 'Incident response basics'] }, { title: 'Week 4: Best Practices', content: ['Security hygiene', 'Risk management', 'Career paths in security'] }] },
    skills: ['Security Fundamentals', 'Risk Assessment', 'Threat Analysis', 'Security Policies']
  },
  {
    id: 'c3',
    title: 'Google Cybersecurity Professional Certificate',
    instructor: 'Michael Chen',
    category: 'Cybersecurity',
    level: 'Intermediate',
    rating: 4.9,
    reviewCount: 4278,
    institution: 'Google',
    language: 'English',
    duration: '3 months',
    schedule: 'Flexible schedule',
    enrolled: 35600,
    imageUrl: 'https://images.unsplash.com/photo-1631632286519-cb83e10e3d98?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8R29vZ2xlJTIwQ3liZXJzZWN1cml0eSUyMFByb2Zlc3Npb25hbCUyMENlcnRpZmljYXRlfGVufDB8fDB8fHww',
    description: 'A comprehensive cybersecurity program developed by Google security experts.',
    syllabus: { weeks: [{ title: 'Module 1: Foundations of Cybersecurity', content: ['Security landscape', 'Role of a security professional', 'Security frameworks'] }, { title: 'Module 2: Play It Safe: Manage Security Risks', content: ['Risk assessment', 'Security controls', 'Compliance frameworks'] }, { title: 'Module 3: Networks and Network Security', content: ['Network architecture', 'Network protocols', 'Defense in depth'] }, { title: 'Module 4: Linux and SQL', content: ['Linux commands', 'SQL basics', 'Security tools in Linux'] }] },
    skills: ['Network Security', 'Linux', 'SQL', 'Risk Management', 'Compliance']
  },
  {
    id: 'c4',
    title: 'Tools of the Trade: Linux and SQL',
    instructor: 'Lisa Rodriguez',
    category: 'IT',
    level: 'Advanced',
    rating: 4.6,
    reviewCount: 2897,
    institution: 'Coursera',
    language: 'English',
    duration: '1 month',
    schedule: 'Flexible schedule',
    enrolled: 18400,
    imageUrl: 'https://images.unsplash.com/photo-1489875347897-49f64b51c1f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U1FMfGVufDB8fDB8fHww',
    description: 'Master essential Linux commands and SQL queries for IT professionals.',
    syllabus: { weeks: [{ title: 'Week 1: Linux Basics', content: ['Linux history and distributions', 'Command line interface', 'File system navigation'] }, { title: 'Week 2: Advanced Linux', content: ['User management', 'Permissions', 'Process management'] }, { title: 'Week 3: SQL Fundamentals', content: ['Database concepts', 'Basic queries', 'Filtering and sorting data'] }, { title: 'Week 4: Advanced SQL', content: ['Joins', 'Subqueries', 'Database security'] }] },
    skills: ['Linux', 'SQL', 'Command Line', 'Database Management']
  },
  {
    id: 'c5',
    title: 'Google Data Analytics Professional Certificate',
    instructor: 'David Kim',
    category: 'Data Science',
    level: 'Beginner',
    rating: 4.8,
    reviewCount: 6647,
    institution: 'Google',
    language: 'English',
    duration: '6 months',
    schedule: 'Flexible schedule',
    enrolled: 125000,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1681487803114-637de228039c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8R29vZ2xlJTIwRGF0YSUyMEFuYWx5dGljcyUyMFByb2Zlc3Npb25hbCUyMENlcnRpZmljYXRlfGVufDB8fDB8fHww',
    description: 'Prepare for a career in data analytics with this comprehensive program.',
    syllabus: { weeks: [{ title: 'Course 1: Foundations: Data, Data, Everywhere', content: ['Analytics ecosystem', 'Thinking analytically', 'Data-driven decision making'] }, { title: 'Course 2: Ask Questions to Make Data-Driven Decisions', content: ['Structured thinking', 'Business questions', 'Data strategy'] }, { title: 'Course 3: Prepare Data for Exploration', content: ['Data types', 'Bias and credibility', 'Data cleaning techniques'] }, { title: 'Course 4: Analyze Data to Answer Questions', content: ['Spreadsheet basics', 'SQL for analysis', 'Data calculations'] }] },
    skills: ['Data Analysis', 'SQL', 'R Programming', 'Data Visualization', 'Tableau']
  },
  {
    id: 'c6',
    title: 'Google Project Management Professional Certificate',
    instructor: 'Jennifer Wu',
    category: 'Business',
    level: 'Beginner',
    rating: 4.8,
    reviewCount: 4185,
    institution: 'Google',
    language: 'English',
    duration: '6 months',
    schedule: 'Flexible schedule',
    enrolled: 95000,
    imageUrl: 'https://images.unsplash.com/photo-1602619593719-83654b67b94c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8R29vZ2xlJTIwUHJvamVjdCUyME1hbmFnZW1lbnQlMjBQcm9mZXNzaW9uYWwlMjBDZXJ0aWZpY2F0ZXxlbnwwfHwwfHx8MA%3D%3D',
    description: 'Learn the essential skills to start a career in project management.',
    syllabus: { weeks: [{ title: 'Course 1: Foundations of Project Management', content: ['Project management overview', 'Organizational structure', 'Project lifecycle'] }, { title: 'Course 2: Project Initiation', content: ['Project charters', 'Stakeholder analysis', 'Project scope'] }, { title: 'Course 3: Project Planning', content: ['Task estimation', 'Scheduling', 'Risk management'] }, { title: 'Course 4: Project Execution', content: ['Leadership skills', 'Team management', 'Project tracking'] }] },
    skills: ['Project Management', 'Risk Management', 'Agile Methodologies', 'Leadership']
  },
  {
    id: 'c7',
    title: 'Google IT Support Professional Certificate',
    instructor: 'Robert Chen',
    category: 'IT',
    level: 'Beginner',
    rating: 4.7,
    reviewCount: 5932,
    institution: 'Google',
    language: 'English',
    duration: '6 months',
    schedule: 'Flexible schedule',
    enrolled: 115000,
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SVQlMjBTdXBwb3J0fGVufDB8fDB8fHww',
    description: 'Prepare for an entry-level role in IT support with a program developed by Google.',
    syllabus: { weeks: [{ title: 'Course 1: Technical Support Fundamentals', content: ['Computer hardware', 'Operating systems', 'Software'] }, { title: 'Course 2: Computer Networking', content: ['Network protocols', 'Internet connectivity', 'Troubleshooting'] }, { title: 'Course 3: Operating Systems', content: ['Windows', 'Linux', 'MacOS'] }, { title: 'Course 4: System Administration', content: ['User management', 'Directory services', 'Cloud computing'] }] },
    skills: ['Technical Support', 'Networking', 'Operating Systems', 'System Administration']
  },
  {
    id: 'c8',
    title: 'Google UX Design Professional Certificate',
    instructor: 'Angela Martinez',
    category: 'Design',
    level: 'Advanced',
    rating: 4.9,
    reviewCount: 3872,
    institution: 'Google',
    language: 'English',
    duration: '6 months',
    schedule: 'Flexible schedule',
    enrolled: 85000,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1661412938808-a0f7be3c8cf1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8VVglMjBEZXNpZ258ZW58MHx8MHx8fDA%3D',
    description: 'Prepare for an entry-level role in UX design with this program developed by Google.',
    syllabus: { weeks: [{ title: 'Course 1: Foundations of UX Design', content: ['UX principles', 'Design thinking', 'User-centered design'] }, { title: 'Course 2: UX Research', content: ['User research methods', 'Interviews', 'Usability testing'] }, { title: 'Course 3: UX Design Process', content: ['Wireframing', 'Prototyping', 'Information architecture'] }, { title: 'Course 4: Responsive Design', content: ['Mobile design', 'Accessibility', 'Cross-platform design'] }] },
    skills: ['UX Design', 'Wireframing', 'Prototyping', 'User Research', 'Figma']
  },
  {
    id: 'c9',
    title: 'Leading People and Teams Specialization',
    instructor: 'Scott DeRue, Ph.D.',
    category: 'Leadership',
    level: 'Intermediate',
    rating: 4.8,
    reviewCount: 6647,
    institution: 'University of Michigan',
    language: 'English',
    duration: '1 month',
    schedule: 'Flexible schedule',
    enrolled: 161700,
    imageUrl: 'https://images.unsplash.com/photo-1590482930637-c8d907ce02bb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8TGVhZGluZyUyMFBlb3BsZSUyMGFuZCUyMFRlYW1zJTIwU3BlY2lhbGl6YXRpb24lMjBjb3Vyc2V8ZW58MHx8MHx8fDA%3D',
    description: 'Leading Effectively. Learn proven management techniques in just four courses.',
    syllabus: { weeks: [{ title: 'Course 1: Inspiring and Motivating Individuals', content: ['Leadership styles', 'Motivation theories', 'Emotional intelligence'] }, { title: 'Course 2: Managing Talent', content: ['Recruiting strategies', 'Performance management', 'Development planning'] }, { title: 'Course 3: Influencing People', content: ['Persuasion techniques', 'Conflict resolution', 'Negotiation skills'] }, { title: 'Course 4: Leading Teams', content: ['Team formation', 'Team dynamics', 'Creating high-performance teams'] }] },
    skills: ['Leadership', 'Conflict Management', 'Employee Onboarding', 'Persuasive Communication', 'Employee Engagement', 'Talent Management']
  }
];

const mockUser: User = {
  id: 'u1',
  name: 'User',
  email: 'user@example.com',
  enrolledCourses: [
    { courseId: 'c1', progress: 65, dateEnrolled: '2025-04-15' },
    { courseId: 'c5', progress: 30, dateEnrolled: '2025-04-28' }
  ]
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    let initialDarkMode = false;
    try {
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme !== null) {
        initialDarkMode = JSON.parse(savedTheme);
      } else if (typeof window !== "undefined" && window.matchMedia) {
        initialDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    } catch (error) {
        console.error("ThemeProvider: Error reading theme preference, defaulting to light mode.", error);
    }
    setDarkMode(initialDarkMode);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        try {
            localStorage.setItem('darkMode', JSON.stringify(darkMode));
        } catch (error) {
            console.error("ThemeProvider: Error saving theme to localStorage:", error);
        }
    }
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prevMode => !prevMode);
  }, []);

  const contextValue = useMemo(() => ({
    darkMode,
    toggleDarkMode,
  }), [darkMode, toggleDarkMode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};


const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<Record<string, { name: string; password: string; enrolledCourses: any[] }>>({});
  

  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem('outlier-users');
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      }
      

      const savedUser = localStorage.getItem('outlier-current-user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Error loading users from localStorage", error);
    }
  }, []);
  

  useEffect(() => {
    if (Object.keys(users).length > 0) {
      localStorage.setItem('outlier-users', JSON.stringify(users));
    }
  }, [users]);
  

  useEffect(() => {
    if (user) {
      localStorage.setItem('outlier-current-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('outlier-current-user');
    }
  }, [user]);

  const register = useCallback((name: string, email: string, password: string): boolean => {
  
    if (users[email.toLowerCase()]) {
      return false;
    }
    
  
    setUsers(prev => ({
      ...prev,
      [email.toLowerCase()]: {
        name,
        password, 
        enrolledCourses: []
      }
    }));
    
    return true;
  }, [users]);

  const login = useCallback((email: string, password: string): boolean => {
    const userRecord = users[email.toLowerCase()];
    
    if (!userRecord || userRecord.password !== password) {
      return false;
    }
    
  
    setUser({
      id: email,
      name: userRecord.name,
      email: email,
      enrolledCourses: userRecord.enrolledCourses || []
    });
    
    return true;
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const enrollCourse = useCallback((courseId: string) => {
    if (!user) return;
    

    setUser(prevUser => {
      if (!prevUser || prevUser.enrolledCourses.some(c => c.courseId === courseId)) {
        return prevUser;
      }
      
      const updatedUser = {
        ...prevUser,
        enrolledCourses: [
          ...prevUser.enrolledCourses,
          { courseId, progress: 0, dateEnrolled: new Date().toISOString().split('T')[0] }
        ]
      };
      
  
      setUsers(prev => ({
        ...prev,
        [prevUser.email.toLowerCase()]: {
          name: prevUser.name,
          password: prev[prevUser.email.toLowerCase()].password,
          enrolledCourses: updatedUser.enrolledCourses
        }
      }));
      
      return updatedUser;
    });
  }, [user]);

  const updateProgress = useCallback((courseId: string, progress: number) => {
    if (!user) return;
    
    setUser(prevUser => {
      if (!prevUser) return prevUser;
      
      const updatedCourses = prevUser.enrolledCourses.map(c =>
        c.courseId === courseId ? { ...c, progress } : c
      );
      
      const updatedUser = {
        ...prevUser,
        enrolledCourses: updatedCourses
      };
      
  
      setUsers(prev => ({
        ...prev,
        [prevUser.email.toLowerCase()]: {
          name: prevUser.name,
          password: prev[prevUser.email.toLowerCase()].password,
          enrolledCourses: updatedCourses
        }
      }));
      
      return updatedUser;
    });
  }, [user]);

  return (
    <UserContext.Provider value={{ user, login, logout, enrollCourse, updateProgress, register }}>
      {children}
    </UserContext.Provider>
  );
};

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toastConfig, setToastConfig] = useState<{ message: string } | null>(null);

  const showToast = useCallback((message: string, duration = 3000) => {
    setToastConfig({ message });
    
    setTimeout(() => {
      setToastConfig(null);
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <AnimatePresence mode="wait">
        {toastConfig && (
          <motion.div
            className="fixed top-5 left-1/2 z-[100] px-6 py-3 rounded-md shadow-lg text-white bg-blue-600"
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {toastConfig.message}
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};

const CourseCard: React.FC<{
  course: Course;
  onSelect?: (courseId: string) => void;
}> = ({ course, onSelect }) => {
  const { showToast } = useToast();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSelect) {
      onSelect(course.id);
    } else {
      showToast("This action will be implemented in the next phase.");
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="h-48 bg-gray-200 relative">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1706426629246-2a3c3e3e3ff2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z29vZ2xlJTIwbG9nbyUyMGljb258ZW58MHx8MHx8fDA%3D')}
        />
        {course.category === 'Cybersecurity' && (
          <motion.span 
            className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white text-xs rounded"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            New AI skills
          </motion.span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center mb-2">
          <img
            src={`https://images.unsplash.com/photo-1706426629246-2a3c3e3e3ff2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z29vZ2xlJTIwbG9nbyUyMGljb258ZW58MHx8MHx8fDA%3D`}
            alt={course.institution}
            className="w-6 h-6 mr-2 rounded-full bg-gray-300"
          />
          <span className="text-sm text-gray-600">{course.institution}</span>
        </div>
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 h-12">
          {course.title}
        </h3>
        <div className="flex items-center mb-2">
          <div className="flex items-center mr-2">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-700 ml-1">{course.rating}</span>
          </div>
          <span className="text-xs text-gray-500">
            ({course.reviewCount.toLocaleString()} reviews)
          </span>
        </div>
        <div className="text-sm text-gray-500 mb-3">
          <div>{course.level} · {course.duration}</div>
        </div>
        <motion.button
          type="button"
          className="mt-auto w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition duration-300"
          onClick={handleClick}
          whileTap={{ scale: 0.95 }}
        >
          View Course
        </motion.button>
      </div>
    </motion.div>
  );
};

const HomePage: React.FC<{
  onCourseSelect: (courseId: string) => void;
}> = ({ onCourseSelect }) => {
  const featuredCourses = mockCourses.slice(0, 4);
  const [showAll, setShowAll] = useState(false);
  const newCourses = showAll ? mockCourses.slice(4) : mockCourses.slice(4, 8);
  const { showToast } = useToast();

  const handleButtonClick = (e: React.MouseEvent, message: string) => {
    e.preventDefault();
    showToast(message);
  };

  const toggleShowMore = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowAll(!showAll);
  };

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300">
      <section className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Learn Without Limits</h1>
            <p className="text-xl mb-8">
              Start, switch, or advance your career with courses, certificates, and degrees from world-class universities and companies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition duration-300"
                onClick={(e) => handleButtonClick(e, "Join for Free: Feature will come in the next version.")}
              >
                Join for Free
              </button>
             <button
                type="button"
                className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-white hover:bg-opacity-10 hover:text-blue-600 transition duration-300"
                    onClick={(e) => handleButtonClick(e, "Try Outlier Skills Plus: Feature will come in the next version.")}
                    >
                    Try Outlier Skills Plus
                    </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <div className="mr-4 text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-700">
                Need help? Tell me a little about yourself so I can make the best recommendations.
              </p>
            </div>
            <button
              type="button"
              className="ml-auto text-blue-600 px-4 py-2 whitespace-nowrap"
              onClick={(e) => handleButtonClick(e, "Set your goal: Feature will come in the next version.")}
            >
              Set your goal
            </button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">
            Recently Viewed Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onSelect={onCourseSelect}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">
            Most Popular Certificates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onSelect={onCourseSelect}
              />
            ))}
          </div>
          <div className="mt-8 text-center">
            <motion.button
              type="button"
              className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 rounded-md shadow-sm font-medium inline-flex items-center"
              onClick={toggleShowMore}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showAll ? "Show less" : "Show more"}
              <motion.span
                className="ml-2"
                animate={{ rotate: showAll ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.span>
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
};

const CatalogPage: React.FC<{
  onCourseSelect: (courseId: string) => void;
  initialSearchTerm?: string;
}> = ({ onCourseSelect, initialSearchTerm = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [sortCriteria, setSortCriteria] = useState<string>("Most Relevant");
  const { showToast } = useToast();

  const categories = useMemo(() => Array.from(new Set(mockCourses.map(course => course.category))), []);
  const levels = useMemo(() => ['Beginner', 'Intermediate', 'Advanced'], []);

  const filteredCourses = useMemo(() => {
    // First filter the courses
    let results = mockCourses.filter(course => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' ||
        course.title.toLowerCase().includes(searchTermLower) ||
        course.instructor.toLowerCase().includes(searchTermLower) ||
        course.institution.toLowerCase().includes(searchTermLower) ||
        course.category.toLowerCase().includes(searchTermLower);
  
      const matchesCategory = selectedCategory === '' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === '' || course.level === selectedLevel;
  
      return matchesSearch && matchesCategory && matchesLevel;
    });
    
    // Then sort the filtered results
    if (sortCriteria === "Highest Rated") {
      return [...results].sort((a, b) => b.rating - a.rating);
    } else if (sortCriteria === "Most Enrolled") {
      return [...results].sort((a, b) => b.enrolled - a.enrolled);
    }
    
    // Default sorting (Most Relevant - no specific sort)
    return results;
  }, [searchTerm, selectedCategory, selectedLevel, sortCriteria]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchTerm(searchTerm.trim());
    } else {
      showToast("Please enter a search term");
    }
  };

  useEffect(() => {
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  return (
    <div className="min-h-screen pb-12 bg-gray-50 transition-colors duration-300">
      <div className="bg-blue-600 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-4">
            Course Catalog
          </h1>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search for courses..."
              className="w-full p-3 pl-10 rounded-md bg-white text-white placeholder-gray-500 outline-none focus:bg-blue-400 focus:ring-2 focus:ring-blue-300 focus:text-black shadow-inner border-0 transition-all duration-200 dark:focus:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white p-1 transition-colors duration-200"
              aria-label="Search"
            >
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Filters</h2>
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-gray-800">Category</h3>
                <div className="flex flex-col space-y-1">
                  <label className="inline-flex items-center">
                    <input type="radio" className="form-radio text-blue-600 border-gray-300 focus:ring-blue-500" name="category" checked={selectedCategory === ''} onChange={() => setSelectedCategory('')} />
                    <span className="ml-2 text-gray-700">All Categories</span>
                  </label>
                  {categories.map(category => (
                    <label key={category} className="inline-flex items-center">
                      <input type="radio" className="form-radio text-blue-600 border-gray-300 focus:ring-blue-500" name="category" checked={selectedCategory === category} onChange={() => setSelectedCategory(category)} />
                      <span className="ml-2 text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-gray-800">Level</h3>
                <div className="flex flex-col space-y-1">
                  <label className="inline-flex items-center">
                    <input type="radio" className="form-radio text-blue-600 border-gray-300 focus:ring-blue-500" name="level" checked={selectedLevel === ''} onChange={() => setSelectedLevel('')} />
                    <span className="ml-2 text-gray-700">All Levels</span>
                  </label>
                  {levels.map(level => (
                    <label key={level} className="inline-flex items-center">
                      <input type="radio" className="form-radio text-blue-600 border-gray-300 focus:ring-blue-500" name="level" checked={selectedLevel === level} onChange={() => setSelectedLevel(level)} />
                      <span className="ml-2 text-gray-700">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {filteredCourses.length} Results
                  </h2>
                  <div className="relative">
                    <select
                      className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                      onChange={(e) => setSortCriteria(e.target.value)}
                      value={sortCriteria}
                    >
                      <option>Most Relevant</option>
                      <option>Highest Rated</option>
                      <option>Most Enrolled</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {filteredCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCourses.map(course => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        onSelect={onCourseSelect}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">
                      No courses found matching your criteria.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseDetailsPage: React.FC<{ courseId: string }> = ({ courseId }) => {
  const { user, enrollCourse } = useUser();
  const { showToast } = useToast();
  const course = useMemo(() => mockCourses.find(c => c.id === courseId), [courseId]);

  if (!course) {
    return (
      <div className="min-h-screen pb-12 bg-gray-50 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
          <p className="text-gray-600 mb-6">The course you are looking for does not exist.</p>
          <button
            type="button"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300"
            onClick={(e) => {
              e.preventDefault();
              if (typeof window !== 'undefined') window.history.back();
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isEnrolled = useMemo(() => user?.enrolledCourses.some(c => c.courseId === courseId), [user, courseId]);

  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      showToast("Please log in to enroll in courses.");
      return;
    }
    enrollCourse(courseId);
    showToast("You have successfully enrolled in this course!");
  };

  return (
    <div className="min-h-screen pb-12 bg-gray-50 transition-colors duration-300">
      <div className="bg-blue-600 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <h1 className="text-3xl font-bold text-white mb-4">{course.title}</h1>
              <p className="text-blue-100 mb-4">{course.description}</p>
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-4"><span className="text-yellow-400">★</span><span className="text-white ml-1">{course.rating} ({course.reviewCount.toLocaleString()} reviews)</span></div>
                <span className="text-blue-200">{course.enrolled.toLocaleString()} already enrolled</span>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="text-white">Instructor: <span className="font-medium">{course.instructor}</span></p>
                <p className="text-white">Offered by <span className="font-medium">{course.institution}</span></p>
              </div>
            </div>
            <div className="md:w-1/3 flex items-center justify-center md:justify-end">
              {isEnrolled ? (
                <button
                  type="button"
                  className="w-full md:w-auto px-6 py-3 bg-gray-500 text-white font-medium rounded-md cursor-not-allowed"
                  disabled
                >
                  Already Enrolled
                </button>
              ) : (
                <button
                  type="button"
                  className="w-full md:w-auto px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition duration-300"
                  onClick={handleEnroll}
                >
                  Enroll Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6 border-b border-gray-200"><h2 className="text-xl font-semibold text-gray-900">What you'll learn</h2></div>
              <div className="p-6">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {course.skills.slice(0,4).map((skill, index) => (
                     <li key={index} className="flex">
                      <svg className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span className="text-gray-700">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200"><h2 className="text-xl font-semibold text-gray-900">Syllabus</h2></div>
              <div className="p-6"><div className="space-y-6">
                {course.syllabus.weeks.map((week, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <h3 className="font-medium text-lg text-gray-900 mb-3">{week.title}</h3>
                    <ul className="space-y-2">
                      {week.content.map((item, i) => (
                        <li key={i} className="flex">
                          <svg className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div></div>
            </div>
          </div>
          <div className="md:w-1/3">
            <div className="bg-white rounded-lg shadow sticky top-24">
              <div className="p-6 border-b border-gray-200"><h2 className="text-xl font-semibold text-gray-900">Details to know</h2></div>
              <div className="p-6"><div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 mr-3 text-gray-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div><h3 className="font-medium text-gray-900">Instructor</h3><p className="text-gray-600">{course.instructor}</p></div>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-5 w-5 mr-3 text-gray-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div><h3 className="font-medium text-gray-900">Duration</h3><p className="text-gray-600">{course.duration}</p></div>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-5 w-5 mr-3 text-gray-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <div><h3 className="font-medium text-gray-900">Level</h3><p className="text-gray-600">{course.level}</p></div>
                  </div>
                  <div className="flex items-start">
                     <svg className="h-5 w-5 mr-3 text-gray-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9A9 9 0 013 12m0 0V3m0 9c0 1.657 1.343 3 3 3s3-1.343 3-3m-3 9c1.657 0 3-1.343 3-3V3M3 3h18" /></svg>
                    <div><h3 className="font-medium text-gray-900">Language</h3><p className="text-gray-600">{course.language}</p><p className="text-gray-500 text-sm">24 languages available</p></div>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-5 w-5 mr-3 text-gray-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    <div><h3 className="font-medium text-gray-900">Shareable certificate</h3><p className="text-gray-600">Add to your LinkedIn profile</p></div>
                  </div>
                </div>
                <div className="mt-8"><h3 className="font-medium text-gray-900 mb-3">Skills you'll gain</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.skills.map((skill, index) => (
                      <motion.span 
                        key={index} 
                        className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          delay: 0.1 * index,
                          duration: 0.3
                        }}
                      >
                        {skill}
                      </motion.span>))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardPage: React.FC<{
  onCourseSelect: (courseId: string) => void;
  onPageChange: (page: string) => void; 
}> = ({ onCourseSelect, onPageChange }) => { 
  const { user, updateProgress } = useUser();
  const { showToast } = useToast();

  const enrolledCoursesDetails = useMemo(() => {
    if (!user) return [];
    return user.enrolledCourses.map(enrollment => {
      const courseDetails = mockCourses.find(course => course.id === enrollment.courseId);
      return courseDetails ? { ...courseDetails, progress: enrollment.progress, dateEnrolled: enrollment.dateEnrolled } : null;
    }).filter(Boolean) as (Course & { progress: number, dateEnrolled: string })[];
  }, [user]);

  const recommendedCourses = useMemo(() => {
    if (!user) return mockCourses.slice(0,3);
    return mockCourses.filter(course => !user.enrolledCourses.some(c => c.courseId === course.id)).slice(0, 3)
  }, [user]);

  const handleProgressUpdate = (e: React.MouseEvent, courseId: string, newProgress: number) => {
    e.preventDefault();
    updateProgress(courseId, newProgress);
    showToast("Your progress has been updated successfully!");
  };

  if (!user) {
    return (
      <div className="min-h-screen pb-12 bg-gray-50 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your dashboard.</p>
          
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 bg-gray-50 transition-colors duration-300">
      <div className="bg-blue-600 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">My Dashboard</h1>
          <p className="text-blue-100">Welcome, {user.name}! Track your progress and continue learning.</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>
          {enrolledCoursesDetails.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 text-lg mb-6">You haven't enrolled in any courses yet.</p>
              <button
                type="button"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange('catalog'); 
                }}
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {enrolledCoursesDetails.map(course => (
                <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 mb-4 md:mb-0 md:pr-4 flex-shrink-0">
                        <img src={course.imageUrl} alt={course.title} className="w-full h-40 object-cover rounded-lg" onError={(e) => (e.currentTarget.src = 'https://source.unsplash.com/400x300/?placeholder,error')} />
                      </div>
                      <div className="md:w-3/4 md:pl-2 flex flex-col">
                        <div className="flex flex-col md:flex-row justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-medium text-gray-900 mb-1">{course.title}</h3>
                            <p className="text-sm text-gray-600 mb-1">By {course.institution}</p>
                            <p className="text-xs text-gray-500">Enrolled on {new Date(course.dateEnrolled).toLocaleDateString()}</p>
                          </div>
                          <button
                            type="button"
                            className="mt-3 md:mt-0 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300 self-start md:self-center whitespace-nowrap"
                            onClick={(e) => {
                              e.preventDefault();
                              onCourseSelect(course.id);
                            }}
                          >
                            Continue Learning
                          </button>
                        </div>
                        <div className="mt-auto">
                          <div className="flex justify-between mb-1"><span className="text-sm font-medium text-gray-700">Progress</span><span className="text-sm font-medium text-gray-700">{course.progress}%</span></div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div></div>
                          <div className="mt-3 flex space-x-2">
                            {[25, 50, 75, 100].map(pVal => (
                              <button
                                type="button"
                                key={pVal}
                                className={`px-2 py-1 text-xs rounded ${course.progress >= pVal ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                                onClick={(e) => handleProgressUpdate(e, course.id, pVal)}
                              >
                                {pVal}%
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended For You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCourses.map(course => (
              <CourseCard key={course.id} course={course} onSelect={onCourseSelect} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginSignupPage: React.FC<{
  onPageChange: (page: string) => void;
}> = ({ onPageChange }) => {
  const { login, register } = useUser();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  
 
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
 
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [agreeToTerms, setSignupAgreeToTerms] = useState(false);
  
 
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
  
  const validateLoginForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!loginEmail.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginEmail)) {
      errors.email = "Email is invalid";
    }
    
    if (!loginPassword) {
      errors.password = "Password is required";
    }
    
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validateSignupForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!signupName.trim()) {
      errors.name = "Name is required";
    } else if (signupName.length < 3) {
      errors.name = "Name must be at least 3 characters";
    }
    
    if (!signupEmail.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(signupEmail)) {
      errors.email = "Email is invalid";
    }
    
    if (!signupPassword) {
      errors.password = "Password is required";
    } else if (signupPassword.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(signupPassword)) {
      errors.password = "Password must contain uppercase, lowercase, and a number";
    }
    
    if (!signupConfirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (signupPassword !== signupConfirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }
    
    if (!agreeToTerms) {
      errors.terms = "You must agree to the terms and conditions";
    }
    
    setSignupErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateLoginForm()) {
      setIsLoading(true);
      
      setTimeout(() => {
        const success = login(loginEmail, loginPassword);
        
        if (success) {
          showToast("Logged in successfully!");
          onPageChange('home');
        } else {
          setLoginErrors({
            auth: "Invalid email or password"
          });
        }
        
        setIsLoading(false);
      }, 800);
    }
  };
  
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateSignupForm()) {
      setIsLoading(true);
      
      setTimeout(() => {
        const success = register(signupName, signupEmail, signupPassword);
        
        if (success) {
          // Explicitly login the user and ensure it works
          const loginSuccess = login(signupEmail, signupPassword);
          
          if (loginSuccess) {
            showToast(`Account created successfully! Welcome, ${signupName}!`);
            onPageChange('home');
          } else {
            // This should never happen since we just created the account
            showToast("Account created but login failed. Please log in manually.");
            setActiveTab('login');
          }
        } else {
          setSignupErrors({
            email: "This email is already registered"
          });
        }
        
        setIsLoading(false);
      }, 1000);
    }
  };
  
  return (
    <div className="min-h-screen pb-12 bg-gray-50 transition-colors duration-300 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Outlier Skills
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {activeTab === 'login' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>
        
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <button
            onClick={() => setActiveTab('login')}
            className={`pb-3 px-4 ${
              activeTab === 'login'
                ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`pb-3 px-4 ${
              activeTab === 'signup'
                ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            Sign Up
          </button>
        </div>
        
        <AnimatePresence mode="wait">
          {activeTab === 'login' ? (
            <motion.form 
              key="login-form"
              className="mt-8 space-y-6" 
              onSubmit={handleLoginSubmit}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {loginErrors.auth && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{loginErrors.auth}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="rounded-md space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        loginErrors.email ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="name@example.com"
                    />
                    {loginErrors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {loginErrors.email}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="login-password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        loginErrors.password ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="••••••••"
                    />
                    {loginErrors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {loginErrors.password}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => showToast("Reset password feature coming soon!")}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>
              
              <div>
                <motion.button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isLoading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {isLoading ? (
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                  ) : (
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0  0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                    </span>
                  )}
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </motion.button>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      setLoginErrors({});
                    }}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Don't have an account? Sign up
                  </button>
                </div>
              </div>
            </motion.form>
          ) : (
            <motion.form 
              key="signup-form"
              className="mt-8 space-y-6" 
              onSubmit={handleSignupSubmit}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="rounded-md space-y-4">
                <div>
                  <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700">
                    Full name
                  </label>
                  <div className="mt-1">
                    <input
                      id="signup-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        signupErrors.name ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="John Doe"
                    />
                    {signupErrors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {signupErrors.name}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="signup-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        signupErrors.email ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="name@example.com"
                    />
                    {signupErrors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {signupErrors.email}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="signup-password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        signupErrors.password ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="••••••••"
                    />
                    {signupErrors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {signupErrors.password}
                      </p>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Must be at least 8 characters and include uppercase, lowercase, and a number
                  </p>
                </div>
                
                <div>
                  <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirm password
                  </label>
                  <div className="mt-1">
                    <input
                      id="signup-confirm-password"
                      name="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        signupErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="••••••••"
                    />
                    {signupErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {signupErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setSignupAgreeToTerms(e.target.checked)}
                  className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                    signupErrors.terms ? 'border-red-300' : ''
                  }`}
                />
                <label htmlFor="terms" className={`ml-2 block text-sm text-gray-700 ${
                  signupErrors.terms ? 'text-red-600' : ''
                }`}>
                  I agree to the <button 
                    type="button"
                    onClick={() => showToast("Terms & Conditions will be available soon!")}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Terms and Conditions
                  </button>
                </label>
              </div>
              {signupErrors.terms && (
                <p className="mt-1 text-sm text-red-600">
                  {signupErrors.terms}
                </p>
              )}
              
              <div>
                <motion.button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isLoading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {isLoading ? (
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                  ) : (
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                    </span>
                  )}
                  {isLoading ? 'Creating account...' : 'Create account'}
                </motion.button>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setSignupErrors({});
                    }}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Already have an account? Sign in
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-3">
            <motion.button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              onClick={() => showToast("Google login coming soon!")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
              </svg>
            </motion.button>
            
            <motion.button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              onClick={() => showToast("Apple login coming soon!")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.152,6.896c-0.948,0-2.415-1.078-3.96-1.04c-2.04,0.027-3.913,1.183-4.962,3.007c-2.12,3.675-0.544,9.125,1.521,12.125c1.013,1.454,2.208,3.09,3.792,3.039c1.52-0.065,2.09-0.987,3.912-0.987c1.82,0,2.341,0.987,3.949,0.948c1.627-0.026,2.685-1.488,3.688-2.948c1.156-1.689,1.636-3.325,1.662-3.415c-0.039-0.013-3.182-1.221-3.22-4.857c-0.026-3.04,2.48-4.494,2.597-4.559c-1.429-2.09-3.623-2.324-4.39-2.376C14.641,5.777,13.099,6.896,12.152,6.896z M15.252,3.484c0.832-1.013,1.396-2.428,1.24-3.835c-1.197,0.052-2.646,0.8-3.519,1.8c-0.767,0.896-1.443,2.334-1.262,3.714C13.012,5.195,14.417,4.497,15.252,3.484z" />
                </svg>
            </motion.button>
            
            <motion.button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              onClick={() => showToast("GitHub login coming soon!")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const GlobalStyles = () => (
  <style>{`
    /* Montserrat font styles */
    h1, h2, h3 {
      font-family: var(--font-montserrat), sans-serif;
      letter-spacing: -0.025em;
    }
    
    h1 {
      font-weight: 700;
    }
    
    h2 {
      font-weight: 600;
    }
    
    h3 {
      font-weight: 500;
    }
    
    /* Ensure all buttons have pointer cursor */
    button {
      cursor: pointer;
    }
    
  
    html.dark body {
      background-color: #111827; 
      color: #f3f4f6; 
    }

   
    
  
    body:not(.dark) input,
    html:not(.dark) input {
      color: #000000 !important; 
    }
    
  
    html:not(.dark) .text-sm.font-medium {
      color: #000000 !important;
    }
    
  
    input[type="text"]:focus {
      background-color: white !important;
    }
    
    html:not(.dark) form input[type="text"]:focus {
      background-color: white !important;
    }
    
 
    
    html.dark .bg-white { background-color: #1f2937 !important; } 
    html.dark .bg-gray-50 { background-color: #111827 !important; } 
    html.dark .bg-gray-100 { background-color: #1f2937 !important; } 
    html.dark .bg-gray-200 { background-color: #374151 !important; } 
    html.dark .bg-gray-300 { background-color: #4b5563 !important; } 
    html.dark .bg-blue-50 { background-color: #1e3a8a !important; } 
    html.dark .bg-blue-100 { background-color: #1e40af !important; } 
    html.dark .bg-blue-600 { background-color: #1d4ed8 !important; } 
    html.dark .bg-blue-500 { background-color: #3b82f6 !important; } 
    html.dark .bg-blue-400 { background-color: #60a5fa !important; } 
    html.dark .bg-gray-900 { background-color: #000000 !important; } 


    html.dark .text-gray-900 { color: #ffffff !important; }
    html.dark .text-gray-800 { color: #f3f4f6 !important; }
    html.dark .text-gray-700 { color: #e5e7eb !important; }
    html.dark .text-gray-600 { color: #d1d5db !important; } 
    html.dark .text-gray-500 { color: #9ca3af !important; } 
    html.dark .text-gray-400 { color: #9ca3af !important; } 
    html.dark .text-gray-300 { color: #d1d5db !important; } 
    html.dark .text-gray-200 { color: #e5e7eb !important; } 

    html.dark .text-blue-600 { color: #60a5fa !important; } 
    html.dark .text-blue-500 { color: #93c5fd !important; } 
    html.dark .text-blue-200 { color: #bfdbfe !important; } 
    html.dark .text-blue-100 { color: #dbeafe !important; } 

    html.dark .border-gray-200 { border-color: #374151 !important; } 
    html.dark .border-gray-300 { border-color: #4b5563 !important; } 
    html.dark .border-gray-700 { border-color: #4b5563 !important; } 
    html.dark .border-blue-600 { border-color: #60a5fa !important; } 

  
    html.dark .hover\\:bg-gray-100:hover { background-color: #374151 !important; } 
    html.dark .hover\\:bg-gray-700:hover { background-color: #4b5563 !important; } 
    html.dark .hover\\:bg-blue-700:hover { background-color: #1e3a8a !important; } 
    html.dark .hover\\:text-blue-600:hover { color: #93c5fd !important; } 
    html.dark .hover\\:text-white:hover { color: #ffffff !important; } 
    html.dark .hover\\:bg-opacity-10:hover { background-color: rgba(255, 255, 255, 0.1) !important; }

  
  
    html.dark button[class*="rounded-md text-sm font-medium"] {
      color: #ffffff !important;
    }
    
    html.dark .text-gray-700.hover\\:bg-gray-100 {
      color: #ffffff !important;
    }

   
    html.dark .focus\\:bg-white:focus { 
      background-color: #374151 !important; 
    }
    
  
    html.dark form input[type="text"]:focus {
      background-color: #374151 !important;
    }
    
    html.dark .bg-blue-50.text-gray-700 { color: #e5e7eb !important; background-color: #1e40af !important; }
    html.dark .bg-blue-50 { background-color: #1e40af !important; }
    html.dark .placeholder-gray-500::placeholder { color: #93c5fd !important; }
    html.dark .placeholder-blue-200::placeholder { color: #bfdbfe !important; }
    html.dark .focus\\:bg-blue-400:focus { background-color: #374151 !important; }
    html.dark .focus\\:ring-blue-300:focus { --tw-ring-color: #60a5fa !important; }
    
  
    html.dark input[type="text"],
    html.dark input[type="email"],
    html.dark input[type="password"],
    html.dark select {
      background-color: #374151 !important; 
      color: #ffffff !important;
      border-color: #4b5563 !important; 
    }
    html.dark input::placeholder {
      color: #9ca3af !important; 
    }
    html.dark .form-radio { 
      border-color: #4b5563 !important; 
    }
    html.dark .form-radio.text-blue-600:checked { 
      border-color: #60a5fa !important; 
      background-color: #60a5fa !important; 
      background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%231f2937' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e") !important;
    }
    html.dark select.text-gray-700 { color: #e5e7eb !important; } 
    html.dark .pointer-events-none.text-gray-700 { color: #e5e7eb !important; } 


    html.dark .bg-green-100 { background-color: #052e16 !important; } 
    html.dark .text-green-800 { color: #a7f3d0 !important; } 

    html.dark .bg-white { background-color: #1f2937 !important; } 
    html.dark .bg-gray-50 { background-color: #111827 !important; } 
    html.dark .bg-gray-100 { background-color: #1f2937 !important; } 
    html.dark .bg-blue-50 { background-color: #1e3a8a !important; } 
    html.dark .border-gray-100 { border-color: #374151 !important; }
    html.dark .shadow-sm { --tw-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3) !important; }
    html.dark .hover\\:bg-gray-50:hover { background-color: #374151 !important; }
  `}</style>
);


const Header: React.FC<{
  currentPage: string;
  onPageChange: (page: string) => void;
  onCourseSelect: (courseId: string) => void;
  onSearch: (term: string) => void;
}> = ({ currentPage, onPageChange, onCourseSelect, onSearch }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useUser();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Save the current position to restore later
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scroll position when menu is closed
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }
  }, [isMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setSearchTerm('');
    } else {
      showToast("Please enter a search term");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => onPageChange('home')}
              className="flex items-center space-x-2 font-bold text-xl text-blue-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Outlier Skills</span>
            </button>
          </div>

          <div className="hidden md:flex items-center">
            <nav className="flex space-x-4 mr-6">
              <button
                onClick={() => onPageChange('home')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'home' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => onPageChange('catalog')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'catalog' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Courses
              </button>
              {user && (
                <button
                  onClick={() => onPageChange('dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
              )}
            </nav>


            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center space-x-2 border border-gray-300 rounded-full p-1 pr-3 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <button
                      onClick={() => {
                        onPageChange('dashboard');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        onPageChange('home');
                        setIsMenuOpen(false);
                        showToast("You have been logged out successfully!");
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onPageChange('login')}
                className="ml-4 px-4 py-2 rounded-md bg-blue-600 !text-white text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Sign in
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>


      {isMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-white dark:bg-gray-800 z-50 overflow-y-auto shadow-lg">
          <div className="flex justify-between items-center px-4 pt-4 pb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h3>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => {
                onPageChange('home');
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                currentPage === 'home' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                onPageChange('catalog');
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                currentPage === 'catalog' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Courses
            </button>
            {user && (
              <button
                onClick={() => {
                  onPageChange('dashboard');
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
            )}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-100">
            {user ? (
              <div className="px-2 space-y-1">
                <div className="flex items-center px-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onPageChange('dashboard');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    logout();
                    onPageChange('home');
                    setIsMenuOpen(false);
                    showToast("You have been logged out successfully!");
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="px-2">
                <button
                  onClick={() => {
                    onPageChange('login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 duration-200"
                >
                  Sign in
                </button>
              </div>
            )}
            <div className="mt-3 px-2">
              <button
                onClick={() => {
                  toggleDarkMode();
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                {darkMode ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Light Mode
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    Dark Mode
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Outlier Skills</h3>
            <p className="text-gray-600 mb-4">Learn without limits with our online courses from world-class institutions.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-blue-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98.059 1.281.073 1.689.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2C6.477,2,2,6.477,2,12c0,4.419,2.865,8.166,6.839,9.489c0.5,0.092,0.682-0.217,0.682-0.482c0-0.237-0.008-0.866-0.013-1.7c-2.782,0.605-3.369-1.343-3.369-1.343c-0.454-1.158-1.11-1.466-1.11-1.466c-0.908-0.62,0.069-0.608,0.069-0.608c1.003,0.07,1.531,1.032,1.531,1.032c0.892,1.53,2.341,1.088,2.91,0.832c0.092-0.647,0.35-1.088,0.636-1.338c-2.22-0.253-4.555-1.113-4.555-4.951c0-1.093,0.39-1.988,1.029-2.688c-0.103-0.253-0.446-1.272,0.098-2.65c0,0,0.84-0.27,2.75,1.026C9.33,7.562,10.666,7.332,12,7.328c1.334,0.004,2.67,0.234,3.912,0.684c1.909-1.296,2.747-1.026,2.747-1.026c0.546,1.378,0.202,2.398,0.1,2.65c0.64,0.7,1.028,1.595,1.028,2.688c0,3.848-2.339,4.695-4.566,4.943c0.359,0.309,0.678,0.92,0.678,1.855c0,1.338-0.012,2.419-0.012,2.747c0,0.268,0.18,0.58,0.688,0.482C19.138,20.161,22,16.416,22,12C22,6.477,17.523,2,12,2z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Courses</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Data Science</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Business</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Computer Science</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Health</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Social Sciences</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Community</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Learners</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Partners</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Developers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Beta Testers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Translators</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">About</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm text-center">© 2023 Outlier Skills. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const OutlierSkillsApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCourseId, setSelectedCourseId] = useState('c9');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = "Outlier Skills";
    }
  }, []);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
     
    
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentPage('details');
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  const handleSearch = (term: string) => {
    setSearchQuery(term);
    setCurrentPage('catalog');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <motion.div
            key="home-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HomePage onCourseSelect={handleCourseSelect} />
          </motion.div>
        );
      case 'login':
        return (
          <motion.div
            key="login-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoginSignupPage onPageChange={handlePageChange} />
          </motion.div>
        );
      case 'catalog':
        return (
          <motion.div
            key="catalog-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CatalogPage onCourseSelect={handleCourseSelect} initialSearchTerm={searchQuery} />
          </motion.div>
        );
      case 'details':
        return (
          <motion.div
            key="details-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CourseDetailsPage courseId={selectedCourseId} />
          </motion.div>
        );
      case 'dashboard':
        return (
          <motion.div
            key="dashboard-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DashboardPage onCourseSelect={handleCourseSelect} onPageChange={handlePageChange} />
          </motion.div>
        );
      default:
        return (
          <motion.div
            key="default-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HomePage onCourseSelect={handleCourseSelect} />
          </motion.div>
        );
    }
  };

  return (
    <ThemeProvider>
      <UserProvider>
        <ToastProvider>
          <GlobalStyles />
          <div className={`flex flex-col min-h-screen bg-white transition-colors duration-300 ${montserrat.className}`}>
            <Header
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onCourseSelect={handleCourseSelect}
              onSearch={handleSearch}
            />
            <main className="flex-grow">
              <AnimatePresence mode="wait">
                {renderPage()}
              </AnimatePresence>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
export default OutlierSkillsApp;