"use client";
import React, { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";

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
  login: (email: string, password: string) => void;
  logout: () => void;
  enrollCourse: (courseId: string) => void;
  updateProgress: (courseId: string, progress: number) => void;
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

  // We no longer auto-login the user on component mount
  // useEffect(() => {
  //   setUser(mockUser);
  // }, []);

  const login = useCallback((email: string, password: string) => {
    setUser(mockUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const enrollCourse = useCallback((courseId: string) => {
    setUser(prevUser => {
      if (!prevUser || prevUser.enrolledCourses.some(c => c.courseId === courseId)) {
        return prevUser;
      }
      return {
        ...prevUser,
        enrolledCourses: [
          ...prevUser.enrolledCourses,
          { courseId, progress: 0, dateEnrolled: new Date().toISOString().split('T')[0] }
        ]
      };
    });
  }, []);

  const updateProgress = useCallback((courseId: string, progress: number) => {
    setUser(prevUser => {
      if (!prevUser) return prevUser;
      return {
        ...prevUser,
        enrolledCourses: prevUser.enrolledCourses.map(c =>
          c.courseId === courseId ? { ...c, progress } : c
        )
      };
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, enrollCourse, updateProgress }}>
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
      <AnimatePresence>
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
                className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-white hover:bg-opacity-10 transition duration-300"
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
  const { showToast } = useToast();

  const categories = useMemo(() => Array.from(new Set(mockCourses.map(course => course.category))), []);
  const levels = useMemo(() => ['Beginner', 'Intermediate', 'Advanced'], []);

  const filteredCourses = useMemo(() => mockCourses.filter(course => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' ||
      course.title.toLowerCase().includes(searchTermLower) ||
      course.instructor.toLowerCase().includes(searchTermLower) ||
      course.institution.toLowerCase().includes(searchTermLower) ||
      course.category.toLowerCase().includes(searchTermLower);

    const matchesCategory = selectedCategory === '' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === '' || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  }), [searchTerm, selectedCategory, selectedLevel]);

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
              className="w-full p-3 pl-10 rounded-md bg-blue-500 text-white placeholder-blue-200 outline-none focus:bg-blue-400 focus:ring-2 focus:ring-blue-300 shadow-inner border-0 transition-all duration-200"
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
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
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
                      onChange={(e) => showToast("Sorting: Feature will come in the next version.")}
                      defaultValue="Most Relevant"
                    >
                      <option>Most Relevant</option>
                      <option>Newest</option>
                      <option>Highest Rated</option>
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
              <p className="text-white">Offered by <span className="font-medium">{course.institution}</span></p>
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
}> = ({ onCourseSelect }) => {
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
                  showToast("Browsing Courses (Feature Placeholder)");
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

const Header: React.FC<{
  currentPage: string;
  onPageChange: (page: string) => void;
  onCourseSelect: (courseId: string) => void;
  onSearch: (term: string) => void;
}> = ({ currentPage, onPageChange, onCourseSelect, onSearch }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, login, logout } = useUser();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onPageChange('catalog');
      showToast(`Searching for "${searchTerm}"`);
      if (onSearch) {
        onSearch(searchTerm);
      }
    } else {
      showToast("Please enter a search term");
    }
  };

  const handlePageChange = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    onPageChange(page);
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const navItems = [
    { name: 'Home', page: 'home' },
    { name: 'Catalog', page: 'catalog' },
    { name: 'Course Demo', page: 'details', courseId: 'c9' },
    { name: 'Dashboard', page: 'dashboard' }
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto">
        <div className="flex justify-between items-center h-16 px-4">
          <div className="flex items-center">
            <motion.button
              type="button"
              onClick={(e) => handlePageChange(e, 'home')}
              className="mr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Go to homepage"
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl font-bold text-blue-600">Outlier Skills</span>
            </motion.button>
            <nav className="hidden md:flex space-x-8">
              {navItems.map(item => (
                <motion.button
                  type="button"
                  key={item.name}
                  onClick={(e) => {
                    handlePageChange(e, item.page);
                    if (item.courseId) onCourseSelect(item.courseId);
                  }}
                  className={`text-sm font-medium py-1 transition-colors duration-150 ${currentPage === item.page ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                  whileHover={currentPage !== item.page ? { y: -2 } : {}}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  {item.name}
                </motion.button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleDarkMode();
              }}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsUserMenuOpen(!isUserMenuOpen);
                  }}
                  className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full"
                  aria-label="User menu"
                  aria-haspopup="true"
                  aria-expanded={isUserMenuOpen}
                >
                  <motion.div 
                    className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold"
                    whileTap={{ scale: 0.9 }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div 
                      className="absolute right-0 mt-2 w-48 py-1 bg-white rounded-md shadow-lg z-20 border border-gray-200" 
                      role="menu"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                    >
                      <button
                        type="button"
                        role="menuitem"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={(e) => handlePageChange(e, 'dashboard')}
                      >
                        My Courses
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={(e) => {
                          e.preventDefault();
                          showToast("Profile: Feature will come in the next version.");
                          setIsUserMenuOpen(false);
                        }}
                      >
                        Profile
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={(e) => {
                          e.preventDefault();
                          showToast("Settings: Feature will come in the next version.");
                          setIsUserMenuOpen(false);
                        }}
                      >
                        Settings
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={(e) => {
                          e.preventDefault();
                          logout();
                          setIsUserMenuOpen(false);
                          showToast("Logged out.");
                          onPageChange('home');
                        }}
                      >
                        Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  login('user@example.com', 'password');
                  showToast("Logged in successfully!");
                }}
                className="hidden md:block py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Log In
              </motion.button>
            )}
            
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Open main menu"
              aria-expanded={isMenuOpen}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden px-4 pt-2 pb-3 border-t border-gray-100"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <nav className="py-2">
                {navItems.map(item => (
                  <button
                    type="button"
                    key={item.name}
                    onClick={(e) => {
                      handlePageChange(e, item.page);
                      if (item.courseId) onCourseSelect(item.courseId);
                    }}
                    className={`block w-full text-left px-4 py-3 my-1 rounded-md text-base font-medium transition-colors duration-150 ${currentPage === item.page ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {item.name}
                  </button>
                ))}
                
                {user ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                      showToast("Logged out successfully!");
                      onPageChange('home');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 my-1 rounded-md text-base font-medium transition-colors duration-150 text-red-600 hover:bg-red-50"
                  >
                    Log Out
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      login('user@example.com', 'password');
                      showToast("Logged in successfully!");
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 my-1 rounded-md text-base font-medium transition-colors duration-150 text-blue-600 hover:bg-blue-50"
                  >
                    Log In
                  </button>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

const Footer: React.FC = () => {
  const { showToast } = useToast();
  const genericClickHandler = (e: React.MouseEvent, linkName: string) => {
    e.preventDefault();
    showToast(`${linkName} link: Feature will come in the next version.`);
  };

  const footerSections = [
    { title: "Outlier Skills", links: ["About", "What We Offer", "Leadership", "Careers", "Catalog"] },
    { title: "Community", links: ["Learners", "Partners", "Beta Testers", "Developers"] },
    { title: "More", links: ["Press", "Investors", "Terms", "Privacy", "Help"] }
  ];

  const socialIcons = [
    { label: "Facebook", icon: <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg> },
    { label: "LinkedIn", icon: <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg> },
    { label: "Twitter", icon: <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.225 2.19 4.098a4.904 4.904 0 01-2.23-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" /></svg> },
    { label: "YouTube", icon: <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg> }
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerSections.map(section => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link}>
                    <button
                      type="button"
                      className="text-base text-gray-600 hover:text-blue-600 transition-colors duration-150"
                      onClick={(e) => genericClickHandler(e, link)}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Mobile App</h3>
            <div className="space-y-3">
              <button
                type="button"
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 transition-colors duration-150"
                onClick={(e) => genericClickHandler(e, "App Store")}
              >
                App Store
              </button>
              <button
                type="button"
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 transition-colors duration-150"
                onClick={(e) => genericClickHandler(e, "Google Play")}
              >
                Google Play
              </button>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-base text-gray-500 mb-4 md:mb-0">© {new Date().getFullYear()} Outlier Skills Inc. All rights reserved.</p>
            <div className="flex space-x-6">
              {socialIcons.map(social => (
                <button
                  type="button"
                  key={social.label}
                  className="text-gray-500 hover:text-blue-600 transition-colors duration-150"
                  onClick={(e) => genericClickHandler(e, social.label)}
                  aria-label={social.label}
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const GlobalStyles = () => (
  <style>{`
    html.dark body {
      background-color: #111827; 
      color: #f3f4f6; 
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


    /* Search bar - dark mode overrides */
    html.dark .bg-blue-50.text-gray-700 { color: #e5e7eb !important; background-color: #1e40af !important; }
    html.dark .bg-blue-50 { background-color: #1e40af !important; }
    html.dark .placeholder-gray-500::placeholder { color: #93c5fd !important; }
    html.dark .placeholder-blue-200::placeholder { color: #bfdbfe !important; }
    html.dark .focus\\:bg-white:focus { background-color: #2563eb !important; }
    html.dark .focus\\:bg-blue-400:focus { background-color: #2563eb !important; }
    html.dark .focus\\:ring-blue-300:focus { --tw-ring-color: #60a5fa !important; }
    
    /* Form inputs - dark mode override */
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

    /* Dark mode overrides */
    html.dark .bg-white { background-color: #1f2937 !important; } 
    html.dark .bg-gray-50 { background-color: #111827 !important; } 
    html.dark .bg-gray-100 { background-color: #1f2937 !important; } 
    html.dark .bg-blue-50 { background-color: #1e3a8a !important; } 
    html.dark .border-gray-100 { border-color: #374151 !important; }
    html.dark .shadow-sm { --tw-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3) !important; }
    html.dark .hover\\:bg-gray-50:hover { background-color: #374151 !important; }
  `}</style>
);


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
      // Smooth scroll to top with animation
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
            <DashboardPage onCourseSelect={handleCourseSelect} />
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
          <div className="flex flex-col min-h-screen bg-white transition-colors duration-300">
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