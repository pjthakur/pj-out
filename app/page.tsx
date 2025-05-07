'use client'
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

interface Course {
  id: number;
  title: string;
  category: string;
  level: string;
  duration: string;
  image: string;
  description: string;
  instructor: string;
  rating: number;
  students: number;
  price: string;
}

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  url: string;
  duration: string;
  instructor: string;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  comment: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  host: string;
  type: string;
}

interface Partner {
  id: number;
  name: string;
  logo: string;
  quote: string;
}

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface CalendarDay {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  hasEvent?: boolean;
  events?: Event[];
}

interface EnrollForm {
  name: string;
  email: string;
  phone: string;
  background: string;
}

interface EventRegisterForm {
  name: string;
  email: string;
  organization: string;
}

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

interface EventRegisterModalState {
  open: boolean;
  event: Event | null;
}

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

interface FormInputProps {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

interface ParallaxSectionProps {
  children: React.ReactNode;
  bgImage: string;
  speed?: number;
  className?: string;
}

const COURSES: Course[] = [
  { 
    id: 1, 
    title: 'Introduction to Web Development', 
    category: 'Development', 
    level: 'Beginner', 
    duration: '6 weeks', 
    image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build responsive websites.',
    instructor: 'Sarah Johnson',
    rating: 4.9,
    students: 12450,
    price: '$49.99'
  },
  { 
    id: 2, 
    title: 'Data Science Essentials', 
    category: 'Data Science', 
    level: 'Intermediate', 
    duration: '8 weeks', 
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 
    description: 'Master data analysis techniques and visualization with Python and popular libraries.',
    instructor: 'Michael Chen',
    rating: 4.8,
    students: 8970,
    price: '$79.99'
  },
  { 
    id: 3, 
    title: 'Mobile App Development', 
    category: 'Development', 
    level: 'Advanced', 
    duration: '10 weeks', 
    image: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 
    description: 'Build native applications for iOS and Android using React Native.',
    instructor: 'Emma Rodriguez',
    rating: 4.7,
    students: 15230,
    price: '$69.99'
  },
  { 
    id: 4, 
    title: 'Artificial Intelligence Fundamentals', 
    category: 'AI', 
    level: 'Intermediate', 
    duration: '12 weeks', 
    image: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 
    description: 'Understand machine learning algorithms and their practical applications.',
    instructor: 'Dr. Alex Thompson',
    rating: 4.9,
    students: 7820,
    price: '$89.99'
  },
  { 
    id: 5, 
    title: 'UX/UI Design Principles', 
    category: 'Design', 
    level: 'Beginner', 
    duration: '5 weeks', 
    image: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 
    description: 'Learn design thinking, wireframing, and prototyping to create user-friendly interfaces.',
    instructor: 'Sophia Martinez',
    rating: 4.8,
    students: 9340,
    price: '$59.99'
  },
  { 
    id: 6, 
    title: 'Cloud Computing & DevOps', 
    category: 'Cloud', 
    level: 'Advanced', 
    duration: '9 weeks', 
    image: 'https://images.unsplash.com/photo-1559336197-ded8aaa244bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 
    description: 'Master AWS services and implement CI/CD pipelines for modern applications.',
    instructor: 'James Wilson',
    rating: 4.6,
    students: 5680,
    price: '$89.99'
  },
];

const VIDEOS: Video[] = [
  { 
    id: 1, 
    title: 'The Future of Education', 
    thumbnail: 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '12:45',
    instructor: 'Dr. Emily Chen'
  },
  { 
    id: 2, 
    title: 'Learning Design Principles', 
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '18:30',
    instructor: 'Sarah Johnson'
  },
  { 
    id: 3, 
    title: 'Programming for Beginners', 
    thumbnail: 'https://images.unsplash.com/photo-1523800503107-5bc3ba2a6f81?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '15:20',
    instructor: 'Robert Garcia'
  },
];

const TESTIMONIALS: Testimonial[] = [
  { 
    id: 1, 
    name: 'Emily Johnson', 
    role: 'Student', 
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', 
    comment: 'The interactive lessons and supportive community made learning programming enjoyable and effective.' 
  },
  { 
    id: 2, 
    name: 'David Chen', 
    role: 'Teacher', 
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', 
    comment: 'As an educator, I appreciate the well-structured curriculum and the engagement tools available on this platform.' 
  },
  { 
    id: 3, 
    name: 'Sarah Williams', 
    role: 'Student', 
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', 
    comment: 'I was able to transition to a new career in tech after completing the Data Science course. Highly recommend!' 
  },
];

const EVENTS: Event[] = [
  { 
    id: 1, 
    title: 'Web Development Workshop', 
    date: '2025-05-15', 
    time: '10:00 AM', 
    location: 'Online', 
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    host: 'Dr. Emily Chen',
    type: 'Workshop'
  },
  { 
    id: 2, 
    title: 'AI in Education Conference', 
    date: '2025-05-20', 
    time: '9:00 AM', 
    location: 'San Francisco, CA', 
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    host: 'Various Industry Experts',
    type: 'Conference'
  },
  { 
    id: 3, 
    title: 'Future of Learning Webinar', 
    date: '2025-06-02', 
    time: '3:00 PM', 
    location: 'Online', 
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    host: 'Mark Rodriguez',
    type: 'Webinar'
  },
  { 
    id: 4, 
    title: 'Building Your Personal Brand', 
    date: '2025-06-05', 
    time: '1:00 PM', 
    location: 'Online', 
    image: 'https://images.unsplash.com/photo-1558403194-611308249627?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    host: 'Sarah Johnson',
    type: 'Workshop'
  },
];

const PARTNERS: Partner[] = [
  { 
    id: 1, 
    name: 'Microsoft', 
    logo: 'https://icon2.cleanpng.com/20180606/yti/aa85dpeey.webp',
    quote: 'A leading source of talent for our cloud computing teams.',
  },
  { 
    id: 2, 
    name: 'Google', 
    logo: 'https://icon2.cleanpng.com/20240216/yhs/transparent-google-logo-google-logo-with-colorful-letters-on-black-1710875297222.webp',
    quote: 'We value the problem-solving skills of EduVista graduates.',
  },
  { 
    id: 3, 
    name: 'Amazon', 
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2cPJhDergcinOUbhEcGg-z15OGhqAL7i_1w&s',
    quote: 'A crucial pipeline for our technical hiring needs.',
  },
  { 
    id: 4, 
    name: 'IBM', 
    logo: 'https://w7.pngwing.com/pngs/180/10/png-transparent-ibm-logo-management-business-innovation-ibm-blue-angle-company-thumbnail.png',
    quote: 'EduVista delivers professionals ready for enterprise challenges.',
  },
  
];

const FEATURES: Feature[] = [
  { 
    id: 1, 
    title: 'Interactive Learning', 
    description: 'Engage with dynamic content that adapts to your learning style and pace.', 
    icon: '💡',
  },
  { 
    id: 2, 
    title: 'Expert Instructors', 
    description: 'Learn from industry professionals with years of real-world experience.', 
    icon: '👨‍🏫',
  },
  { 
    id: 3, 
    title: 'Flexible Schedule', 
    description: 'Access course content anytime, anywhere, and learn at your own pace.', 
    icon: '⏰',
  },
  { 
    id: 4, 
    title: 'Certification', 
    description: 'Earn industry-recognized certificates to boost your career prospects.', 
    icon: '🏆',
  },
];

const CATEGORIES: Category[] = [
  { id: 1, name: 'All', icon: '🎓' },
  { id: 2, name: 'Development', icon: '💻' },
  { id: 3, name: 'Data Science', icon: '📊' },
  { id: 4, name: 'Design', icon: '🎨' },
  { id: 5, name: 'AI', icon: '🧠' },
  { id: 6, name: 'Cloud', icon: '☁️' },
];

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => (
  <div className={`backdrop-blur-xl bg-white/30 rounded-xl border border-white/50 shadow-lg ${className}`}>
    {children}
  </div>
);

const FormInput: React.FC<FormInputProps> = ({ label, type = 'text', placeholder, value, onChange, required = false }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2 dark-form-label">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2 backdrop-blur-sm rounded-lg dark-form-input focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative modal-content backdrop-blur-xl rounded-xl shadow-xl border border-modal w-full max-w-md p-6 md:p-8">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-modal-close hover:text-modal-close-hover cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
};

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm">
      <div className={`flex items-center ${type === 'success' ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'} border-l-4 rounded-lg py-3 px-4 shadow-md`}>
        {type === 'success' ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )}
        
        <p className={`text-sm ${type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
          {message}
        </p>
        
        <button 
          onClick={onClose}
          className="ml-auto cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${type === 'success' ? 'text-green-500' : 'text-red-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const ParallaxSection: React.FC<ParallaxSectionProps> = ({ children, bgImage, speed = 0.5, className = '' }) => {
  const [offset, setOffset] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const { top } = sectionRef.current.getBoundingClientRect();
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      if (top < windowHeight && top > -sectionRef.current.offsetHeight) {
        setOffset(-(top * speed));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div 
      ref={sectionRef} 
      className={`relative overflow-hidden ${className}`}
    >
      <div 
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translateY(${offset}px)`,
        }}
      ></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default function EducationalPlatform() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [filter, setFilter] = useState<{ category: string; level: string }>({ category: '', level: '' });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [subscribeEmail, setSubscribeEmail] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLightMode, setIsLightMode] = useState<boolean>(true);
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const [eventRegistered, setEventRegistered] = useState<number[]>([]);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [avatarTooltip, setAvatarTooltip] = useState<boolean>(false);
  
  const [videoLikes, setVideoLikes] = useState<Record<number, boolean>>({});
  const [videoShares, setVideoShares] = useState<Record<number, number>>({});
  
  const [pendingCourseId, setPendingCourseId] = useState<number | null>(null);
  
  const filteredCourses = COURSES.filter((course) => {
    const matchesCategory = !filter.category || course.category === filter.category;
    const matchesLevel = !filter.level || course.level === filter.level;
    const matchesSearch = !searchTerm || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesLevel && matchesSearch;
  });
  
  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
  };
  
  const themeClasses = isLightMode
    ? 'bg-gradient-to-br from-blue-50 to-purple-50 text-slate-800'
    : 'bg-gradient-to-br from-slate-900 to-blue-900 text-white';
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(`Thank you! ${subscribeEmail} has been subscribed to our newsletter.`);
    setSubscribeEmail('');
    setTimeout(() => setSuccessMessage(''), 5000);
  };
  
  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourse) {
      setEnrolledCourses(prev => [...prev, selectedCourse.id]);
    }
    setToast({
      show: true,
      message: `Enrollment successful! Welcome to the "${selectedCourse?.title}" course.`,
      type: 'success'
    });
  };
  
  const handleVideoLike = (videoId: number) => {
    setVideoLikes(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
    setToast({
      show: true,
      message: videoLikes[videoId] ? "Removed like from video." : "Added like to video!",
      type: 'success'
    });
  };

  const handleVideoShare = (videoId: number, videoTitle: string) => {
    setVideoShares(prev => ({
      ...prev,
      [videoId]: (prev[videoId] || 0) + 1
    }));
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Check out this great video: ${videoTitle} - https://eduvista.example/videos/${videoId}`);
    }
    
    setToast({
      show: true,
      message: "Video link copied to clipboard! Ready to share.",
      type: 'success'
    });
  };
  
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const prevMonth = () => {
    setCalendarDate(prev => {
      const date = new Date(prev);
      date.setMonth(date.getMonth() - 1);
      return date;
    });
  };

  const nextMonth = () => {
    setCalendarDate(prev => {
      const date = new Date(prev);
      date.setMonth(date.getMonth() + 1);
      return date;
    });
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = (): CalendarDay[] => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const prevMonthDays: CalendarDay[] = [];
    if (firstDayOfMonth > 0) {
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevMonthYear = month === 0 ? year - 1 : year;
      const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
      
      for (let i = 0; i < firstDayOfMonth; i++) {
        prevMonthDays.unshift({
          day: daysInPrevMonth - i,
          month: prevMonth,
          year: prevMonthYear,
          isCurrentMonth: false,
        });
      }
    }
    
    const currentMonthDays: CalendarDay[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const hasEvent = EVENTS.some(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === i && 
               eventDate.getMonth() === month && 
               eventDate.getFullYear() === year;
      });
      
      const events = EVENTS.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === i && 
               eventDate.getMonth() === month && 
               eventDate.getFullYear() === year;
      });
      
      currentMonthDays.push({
        day: i,
        month,
        year,
        isCurrentMonth: true,
        hasEvent,
        events,
      });
    }
    
    const nextMonthDays: CalendarDay[] = [];
    const totalDays = prevMonthDays.length + currentMonthDays.length;
    const remainingDays = 42 - totalDays; // 6 rows of 7 days
    
    if (remainingDays > 0) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextMonthYear = month === 11 ? year + 1 : year;
      
      for (let i = 1; i <= remainingDays; i++) {
        nextMonthDays.push({
          day: i,
          month: nextMonth,
          year: nextMonthYear,
          isCurrentMonth: false,
        });
      }
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const getMonthName = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
  };

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDay(day);
  };
  
  useEffect(() => {
    if (!avatarTooltip) return;
    function handleClick(e: MouseEvent) {
      if (
        !(document.getElementById('avatar-tooltip')?.contains(e.target as Node)) &&
        !(document.getElementById('avatar-img')?.contains(e.target as Node))
      ) {
        setAvatarTooltip(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [avatarTooltip]);
  
  useEffect(() => {
    if (activeTab === 'courses' && pendingCourseId !== null) {
      const course = COURSES.find(c => c.id === pendingCourseId);
      if (course) setSelectedCourse(course);
      setPendingCourseId(null);
    }
  }, [activeTab, pendingCourseId]);
  
  return (
    <div className={`min-h-screen font-sans ${themeClasses} transition-colors duration-300`}>
      <Head>
        <title>EduVista | Modern Learning Platform</title>
        <meta name="description" content="An innovative educational platform for modern learners" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        body {
          font-family: 'Nunito', sans-serif;
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Poppins', sans-serif;
        }
        .glass-nav {
          background: ${isLightMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 23, 42, 0.8)'};
          backdrop-filter: blur(10px);
          border-bottom: 1px solid ${isLightMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(30, 41, 59, 0.5)'};
        }
        .glassmorphism {
          background: ${isLightMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(15, 23, 42, 0.6)'};
          backdrop-filter: blur(10px);
          border: 1px solid ${isLightMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(30, 41, 59, 0.6)'};
          box-shadow: ${isLightMode 
            ? '0 8px 32px 0 rgba(31, 38, 135, 0.1)' 
            : '0 8px 32px 0 rgba(0, 0, 0, 0.3)'};
        }
        .glass-card-hover:hover {
          transform: translateY(-5px);
          box-shadow: ${isLightMode 
            ? '0 12px 32px 0 rgba(31, 38, 135, 0.15)' 
            : '0 12px 32px 0 rgba(0, 0, 0, 0.4)'};
          border: 1px solid ${isLightMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(59, 130, 246, 0.5)'};
        }
        .modal-content {
          background: ${isLightMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.9)'};
          color: ${isLightMode ? '#1e293b' : '#f1f5f9'};
        }
        .border-modal {
          border-color: ${isLightMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(30, 41, 59, 0.6)'};
        }
        .text-modal-close {
          color: ${isLightMode ? 'rgba(100, 116, 139, 0.8)' : 'rgba(203, 213, 225, 0.8)'};
        }
        .text-modal-close-hover {
          color: ${isLightMode ? 'rgba(51, 65, 85, 1)' : 'rgba(241, 245, 249, 1)'};
        }
        .dark-form-input {
          background: ${isLightMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(30, 41, 59, 0.5)'};
          color: ${isLightMode ? '#1e293b' : '#f1f5f9'};
          border-color: ${isLightMode ? 'rgba(203, 213, 225, 0.5)' : 'rgba(71, 85, 105, 0.5)'};
        }
        .dark-form-input::placeholder {
          color: ${isLightMode ? 'rgba(100, 116, 139, 0.6)' : 'rgba(148, 163, 184, 0.6)'};
        }
        .dark-form-label {
          color: ${isLightMode ? '#334155' : '#cbd5e1'};
        }
        .category-pill.active {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          color: white;
        }
        .video-card:hover .play-button {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1.1);
        }
        .shimmer {
          background: linear-gradient(90deg, 
            rgba(255, 255, 255, 0) 0%, 
            ${isLightMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'} 50%, 
            rgba(255, 255, 255, 0) 100%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
          0% {background-position: 200% 0;}
          100% {background-position: -200% 0;}
        }
        .video-card {
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .video-card:hover {
          transform: scale(1.045) translateY(-4px);
          box-shadow: 0 12px 32px 0 rgba(31,38,135,0.15), 0 2px 8px 0 rgba(0,0,0,0.08);
          z-index: 2;
        }
        .play-button {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.92);
          transition: opacity 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1);
          pointer-events: none;
        }
        .video-card:hover .play-button {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1.08);
          pointer-events: auto;
        }
      `}</style>

      <nav className="glass-nav fixed w-full top-0 z-40 transition-all duration-300">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">EduVista</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => setActiveTab('home')}
              className={`font-medium transition-colors cursor-pointer ${activeTab === 'home' ? 'text-blue-600' : 'hover:text-blue-500'}`}
            >
              Home
            </button>
            <button 
              onClick={() => setActiveTab('courses')}
              className={`font-medium transition-colors cursor-pointer ${activeTab === 'courses' ? 'text-blue-600' : 'hover:text-blue-500'}`}
            >
              Courses
            </button>
            <button 
              onClick={() => setActiveTab('videos')}
              className={`font-medium transition-colors cursor-pointer ${activeTab === 'videos' ? 'text-blue-600' : 'hover:text-blue-500'}`}
            >
              Videos
            </button>
            <button 
              onClick={() => setActiveTab('testimonials')}
              className={`font-medium transition-colors cursor-pointer ${activeTab === 'testimonials' ? 'text-blue-600' : 'hover:text-blue-500'}`}
            >
              Testimonials
            </button>
            <button 
              onClick={() => setActiveTab('events')}
              className={`font-medium transition-colors cursor-pointer ${activeTab === 'events' ? 'text-blue-600' : 'hover:text-blue-500'}`}
            >
              Events
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200/30 transition-colors cursor-pointer"
              aria-label={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
            >
              {isLightMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            {isLoggedIn ? (
              <div className="relative">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-500"
                  id="avatar-img"
                  onClick={() => setAvatarTooltip(v => !v)}
                />
                {avatarTooltip && (
                  <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg py-2 z-50 text-center" id="avatar-tooltip">
                    <button
                      className="block w-full px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => { setIsLoggedIn(false); setAvatarTooltip(false); }}
                      onMouseEnter={() => setAvatarTooltip(true)}
                      onMouseLeave={() => setAvatarTooltip(false)}
                      tabIndex={0}
                      aria-label="Logout"
                      type="button"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsLoggedIn(true)}
                className="glassmorphism px-4 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-md cursor-pointer"
              >
                Login
              </button>
            )}
          </div>
          
          <div className="md:hidden flex items-center space-x-3">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200/30 transition-colors cursor-pointer"
              aria-label={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
            >
              {isLightMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="glassmorphism md:hidden py-4 px-6">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => {
                  setActiveTab('home');
                  setMobileMenuOpen(false);
                }}
                className={`font-medium text-left cursor-pointer ${activeTab === 'home' ? 'text-blue-600' : 'hover:text-blue-500'}`}
              >
                Home
              </button>
              <button 
                onClick={() => {
                  setActiveTab('courses');
                  setMobileMenuOpen(false);
                }}
                className={`font-medium text-left cursor-pointer ${activeTab === 'courses' ? 'text-blue-600' : 'hover:text-blue-500'}`}
              >
                Courses
              </button>
              <button 
                onClick={() => {
                  setActiveTab('videos');
                  setMobileMenuOpen(false);
                }}
                className={`font-medium text-left cursor-pointer ${activeTab === 'videos' ? 'text-blue-600' : 'hover:text-blue-500'}`}
              >
                Videos
              </button>
              <button 
                onClick={() => {
                  setActiveTab('testimonials');
                  setMobileMenuOpen(false);
                }}
                className={`font-medium text-left cursor-pointer ${activeTab === 'testimonials' ? 'text-blue-600' : 'hover:text-blue-500'}`}
              >
                Testimonials
              </button>
              <button 
                onClick={() => {
                  setActiveTab('events');
                  setMobileMenuOpen(false);
                }}
                className={`font-medium text-left cursor-pointer ${activeTab === 'events' ? 'text-blue-600' : 'hover:text-blue-500'}`}
              >
                Events
              </button>
              <div className="flex space-x-3 pt-3">
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsLoggedIn(true);
                  }}
                  className="glassmorphism px-4 py-2 rounded-full font-medium flex-1 transition-all duration-300 cursor-pointer"
                >
                  Login
                </button>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsLoggedIn(true);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full font-medium flex-1 transition-all duration-300 cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      <main className="pt-20 pb-12">
        {activeTab === 'home' && (
          <>
            <section className="relative overflow-hidden pt-10 pb-16 sm:pb-24 px-4">
              <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                  <div className="lg:w-1/2">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                      Unlock Your Potential with Interactive Learning
                    </h1>
                    <p className="text-lg md:text-xl opacity-80 mb-8 max-w-xl">
                      Discover a new way of learning with our modern, interactive platform designed to help you master new skills efficiently.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                      <button 
                        onClick={() => setActiveTab('courses')}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:shadow-xl transition-all duration-300 text-lg cursor-pointer"
                      >
                        Explore Courses
                      </button>
                    </div>
                    <div className="flex items-center mb-8">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map(id => (
                          <div key={id} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                            <img 
                              src={`https://randomuser.me/api/portraits/${id % 2 === 0 ? 'women' : 'men'}/${id + 15}.jpg`} 
                              alt="User" 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        ))}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center text-yellow-500">
                          {[1, 2, 3, 4, 5].map(id => (
                            <svg key={id} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm font-medium">Trusted by over 50,000 students worldwide</span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-1/2 relative">
                    <GlassCard className="rounded-2xl overflow-hidden shadow-2xl">
                      <img 
                        src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                        alt="Students Learning"
                        className="w-full h-full object-cover rounded-2xl" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl pointer-events-none"></div>
                      
                      <div className="absolute top-6 right-6 glassmorphism p-4 rounded-xl max-w-[200px]">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h4 className="ml-2 font-medium">Achievement</h4>
                        </div>
                        <p className="text-sm opacity-80">Completed 5 courses this month!</p>
                      </div>
                      
                      <div className="absolute bottom-6 left-6 glassmorphism p-4 rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="text-xs opacity-80">Active students</p>
                            <p className="text-xl font-bold">24,589</p>
                          </div>
                          <div className="h-12 w-0.5 bg-white/20"></div>
                          <div>
                            <p className="text-xs opacity-80">Total courses</p>
                            <p className="text-xl font-bold">450+</p>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                    
                    <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-1/3 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
            </section>

            <ParallaxSection 
              bgImage="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
              className="py-20"
            >
              <div className="container mx-auto px-4">
                <div className="flex justify-center mb-16">
                  <GlassCard className="max-w-3xl w-full p-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose EduVista?</h2>
                    <p className="text-lg">Our platform offers unique features designed to make learning effective, engaging, and accessible to everyone.</p>
                  </GlassCard>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {FEATURES.map(feature => (
                    <GlassCard 
                      key={feature.id}
                      className="p-6 text-center glass-card-hover transition-all duration-300"
                    >
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="opacity-80">{feature.description}</p>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </ParallaxSection>

            <section className="py-20 px-4">
              <div className="container mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                  <p className="text-lg opacity-80 max-w-2xl mx-auto">
                    Our learning process is designed to be effective and efficient, helping you achieve your goals quickly.
                  </p>
                </div>
                
                <div className="flex flex-col lg:flex-row items-center gap-12">
                  <div className="lg:w-1/2">
                    <img 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                      alt="Learning Process"
                      className="rounded-2xl shadow-xl"
                    />
                  </div>
                  
                  <div className="lg:w-1/2">
                    <div className="space-y-8">
                      {[
                        { number: '01', title: 'Choose Your Course', description: 'Browse our catalog and select the course that matches your goals and interests.' },
                        { number: '02', title: 'Learn at Your Pace', description: 'Access course materials anytime, anywhere, and progress through lessons at your own speed.' },
                        { number: '03', title: 'Practice with Projects', description: 'Apply your knowledge through hands-on projects that reinforce learning.' },
                        { number: '04', title: 'Earn Your Certificate', description: 'Complete the course requirements and receive a certificate to showcase your skills.' }
                      ].map((step, index) => (
                        <div key={index} className="flex">
                          <div className="flex-shrink-0 mr-6">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                              {step.number}
                            </div>
                            {index < 3 && (
                              <div className="h-16 w-0.5 bg-gradient-to-b from-purple-500 to-blue-500 mx-auto my-1"></div>
                            )}
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                            <p className="opacity-80">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <ParallaxSection 
              bgImage="https://images.unsplash.com/photo-1559575706-2d6cd5c7779d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
              className="py-20"
            >
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Leading Companies</h2>
                  <p className="text-lg opacity-80 max-w-2xl mx-auto">
                    Our graduates work at top companies worldwide and our curriculum is recognized by industry leaders.
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-16">
                  {PARTNERS.map(partner => (
                    <div key={partner.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5">
                      <GlassCard className="h-full p-6 flex flex-col items-center justify-between gap-4 text-center glass-card-hover transition-all duration-300">
                        <img 
                          src={partner.logo} 
                          alt={partner.name}
                          className={`h-16 object-contain ${!isLightMode ? 'filter invert' : ''}`}
                        />
                        <p className="text-sm font-medium mt-4 opacity-80">"{partner.quote}"</p>
                      </GlassCard>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: '90%', subtitle: 'Hiring Rate', description: 'Our graduates receive job offers within 3 months of completion' },
                    { title: '250+', subtitle: 'Corporate Partners', description: 'Companies actively recruiting from our talent pool' },
                    { title: '45%', subtitle: 'Salary Increase', description: 'Average salary boost after completing our courses' }
                  ].map((stat, index) => (
                    <GlassCard 
                      key={index}
                      className="p-6 text-center glass-card-hover transition-all duration-300"
                    >
                      <h3 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">{stat.title}</h3>
                      <p className="text-lg font-semibold mb-3">{stat.subtitle}</p>
                      <p className="opacity-80 text-sm">{stat.description}</p>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </ParallaxSection>

            <section className="py-20 px-4">
              <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Active Students', value: '50,000+', icon: '👨‍🎓' },
                    { label: 'Courses', value: '450+', icon: '📚' },
                    { label: 'Expert Instructors', value: '120+', icon: '👨‍🏫' },
                    { label: 'Success Rate', value: '95%', icon: '📈' }
                  ].map((stat, index) => (
                    <GlassCard 
                      key={index}
                      className="p-6 text-center glass-card-hover transition-all duration-300"
                    >
                      <div className="text-4xl mb-4">{stat.icon}</div>
                      <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                      <p className="opacity-80">{stat.label}</p>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
        
        {activeTab === 'courses' && (
          <section className="py-16 px-4">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Our Course Catalog</h2>
                <p className="text-lg opacity-80 max-w-2xl mx-auto">
                  Discover a wide range of courses designed by experts to help you advance your career and personal development.
                </p>
              </div>
              
              {!selectedCourse && (
                <>
                  <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-grow relative">
                      <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 backdrop-blur-sm dark-form-input rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    
                    <select
                      value={filter.category}
                      onChange={(e) => setFilter({...filter, category: e.target.value})}
                      className="px-4 py-2 backdrop-blur-sm dark-form-input rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                    >
                      <option value="">All Categories</option>
                      <option value="Development">Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Design">Design</option>
                      <option value="AI">AI</option>
                      <option value="Cloud">Cloud</option>
                    </select>
                    
                    <select
                      value={filter.level}
                      onChange={(e) => setFilter({...filter, level: e.target.value})}
                      className="px-4 py-2 backdrop-blur-sm dark-form-input rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                    >
                      <option value="">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  
                  <div className="flex overflow-x-auto scrollbar-hide py-4 px-2 mb-8 gap-2 md:gap-4 md:justify-center">
                    {CATEGORIES.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setFilter({...filter, category: category.name === 'All' ? '' : category.name})}
                        className={`category-pill flex items-center px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 cursor-pointer ${
                          (category.name === 'All' && !filter.category) || filter.category === category.name
                            ? 'active' 
                            : 'glassmorphism hover:shadow-md'
                        }`}
                      >
                        <span className="mr-2">{category.icon}</span>
                        <span>{category.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
              
              {selectedCourse ? (
                <GlassCard className="p-6 md:p-8">
                  <button 
                    onClick={() => setSelectedCourse(null)}
                    className="flex items-center text-blue-500 hover:text-blue-700 mb-6 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to all courses
                  </button>
                  
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-2/5">
                      <img 
                        src={selectedCourse.image} 
                        alt={selectedCourse.title}
                        className="rounded-xl shadow-md w-full h-auto"
                      />
                      <div className="mt-6 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{selectedCourse.category}</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">{selectedCourse.level}</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">{selectedCourse.duration}</span>
                      </div>
                      
                      <div className="mt-6 glassmorphism p-4 rounded-xl">
                        <div className="flex justify-between mb-3">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-medium">{selectedCourse.rating} rating</span>
                          </div>
                          <span>{selectedCourse.students.toLocaleString()} students</span>
                        </div>
                        <div className="text-center py-2 border-t border-white/20">
                          <span className="text-2xl font-bold">{selectedCourse.price}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-3/5">
                      <h3 className="text-2xl font-bold mb-4">{selectedCourse.title}</h3>
                      <p className="opacity-80 mb-6">{selectedCourse.description}</p>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-lg mb-3">Instructor</h4>
                        <div className="flex items-center">
                          <img 
                            src={`https://randomuser.me/api/portraits/${selectedCourse.id % 2 === 0 ? 'women' : 'men'}/${selectedCourse.id + 10}.jpg`} 
                            alt={selectedCourse.instructor} 
                            className="w-12 h-12 rounded-full object-cover mr-4" 
                          />
                          <div>
                            <p className="font-medium">{selectedCourse.instructor}</p>
                            <p className="text-sm opacity-70">Lead Instructor</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-lg mb-3">What You'll Learn</h4>
                        <ul className="space-y-2">
                          {[
                            'Master fundamental concepts and principles',
                            'Complete practical assignments with personalized feedback',
                            'Build portfolio-ready projects',
                            'Gain industry-relevant skills and certifications'
                          ].map((item, index) => (
                            <li key={index} className="flex items-start">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <button 
                        onClick={() => {
                          if (!isLoggedIn) {
                            setToast({ show: true, message: 'Please login to enroll/register.', type: 'error' });
                            return;
                          }
                          if (enrolledCourses.includes(selectedCourse.id)) {
                            setEnrolledCourses(prev => prev.filter(id => id !== selectedCourse.id));
                          } else {
                            setEnrolledCourses(prev => [...prev, selectedCourse.id]);
                          }
                        }}
                        className={`w-full md:w-auto px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 cursor-pointer ${
                          enrolledCourses.includes(selectedCourse.id)
                            ? 'bg-green-500 text-white'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        }`}
                      >
                        {enrolledCourses.includes(selectedCourse.id) ? 'Enrolled' : 'Enroll Now'}
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ) : (
                <div>
                  {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCourses.map((course) => (
                        <div 
                          key={course.id}
                          className="backdrop-blur-sm bg-white/40 rounded-xl overflow-hidden border border-white/50 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer glass-card-hover"
                          onClick={() => setSelectedCourse(course)}
                        >
                          <div className="relative">
                            <img 
                              src={course.image} 
                              alt={course.title}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium text-gray-800">
                              {course.level}
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="flex items-center text-sm mb-2">
                              <span className="bg-blue-100 text-blue-800 rounded-full px-3 py-1">
                                {course.category}
                              </span>
                              <span className="ml-2 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="ml-1">{course.rating}</span>
                              </span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                            <p className="text-sm opacity-80 mb-4">
                              By {course.instructor} • {course.students.toLocaleString()} students
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-lg">{course.price}</span>
                              <span className="text-sm opacity-80">{course.duration}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <h3 className="text-xl mb-4">No courses match your search criteria</h3>
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          setFilter({ category: '', level: '' });
                        }}
                        className="px-6 py-2 bg-blue-500 text-white rounded-full cursor-pointer"
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
        
        {activeTab === 'videos' && (
          <section className="py-16 px-4 relative">
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-500/5 to-transparent"></div>
            <div className="container mx-auto relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Video Lessons</h2>
                <p className="text-lg opacity-80 max-w-2xl mx-auto">
                  Get a taste of our teaching style with these free preview videos from our most popular courses.
                </p>
              </div>
              
              {selectedVideo ? (
                <GlassCard className="p-6 md:p-8">
                  <button 
                    onClick={() => setSelectedVideo(null)}
                    className="flex items-center text-blue-500 hover:text-blue-700 mb-6 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to videos
                  </button>
                  
                  <h3 className="text-2xl font-bold mb-4">{selectedVideo.title}</h3>
                  
                  <div className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden shadow-lg mb-6">
                    <iframe 
                      className="absolute top-0 left-0 w-full h-full"
                      src={selectedVideo.url}
                      title={selectedVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="mb-4 sm:mb-0">
                      <p className="font-medium">Instructor: {selectedVideo.instructor}</p>
                      <p className="text-sm opacity-70">Duration: {selectedVideo.duration}</p>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleVideoLike(selectedVideo.id)}
                        className={`flex items-center px-4 py-2 rounded-full cursor-pointer ${
                          videoLikes[selectedVideo.id] 
                            ? 'bg-blue-500 text-white' 
                            : 'glassmorphism'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        {videoLikes[selectedVideo.id] ? 'Liked' : 'Like'}
                      </button>
                      <button 
                        onClick={() => handleVideoShare(selectedVideo.id, selectedVideo.title)}
                        className="flex items-center px-4 py-2 glassmorphism rounded-full cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share
                      </button>
                      <button 
                        onClick={() => {
                          const relatedCourse = COURSES.find(course => 
                            course.instructor === selectedVideo.instructor ||
                            course.title.includes(selectedVideo.title.split(' ')[0])
                          );
                          if (relatedCourse) {
                            setSelectedVideo(null);
                            setActiveTab('courses');
                            setPendingCourseId(relatedCourse.id);
                          }
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full cursor-pointer"
                      >
                        Related Course
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {VIDEOS.map((video) => (
                    <div 
                      key={video.id}
                      className="video-card relative group backdrop-blur-sm bg-white/40 rounded-xl overflow-hidden border border-white/50 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer glass-card-hover"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <div className="relative">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-56 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-sm px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                        <p className="text-sm opacity-80">Instructor: {video.instructor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
        
        {activeTab === 'testimonials' && (
          <section className="py-16 px-4">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Community Says</h2>
                <p className="text-lg opacity-80 max-w-2xl mx-auto">
                  Hear from our students and instructors about their experiences with our platform.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {TESTIMONIALS.map(testimonial => (
                  <GlassCard
                    key={testimonial.id}
                    className="p-6 glass-card-hover transition-all duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-12 h-12 rounded-full object-cover" 
                      />
                      <div className="ml-4">
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-sm opacity-80">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      {[1, 2, 3, 4, 5].map(star => (
                        <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="italic">"{testimonial.comment}"</p>
                  </GlassCard>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <h3 className="text-xl font-semibold mb-4">Share Your Experience</h3>
                <button 
                  onClick={() => setToast({
                    show: true,
                    message: "Thank you for your interest! The testimonial submission form will be available soon.",
                    type: 'success'
                  })}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  Submit a Testimonial
                </button>
              </div>
            </div>
          </section>
        )}
        
        {activeTab === 'events' && (
          <section className="py-16 px-4 relative">
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="container mx-auto relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
                <p className="text-lg opacity-80 max-w-2xl mx-auto">
                  Join our interactive webinars, workshops, and networking sessions to enhance your learning experience.
                </p>
              </div>
              
              <GlassCard className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Featured Events</h3>
                    
                    <div className="space-y-6">
                      {EVENTS.map(event => (
                        <div key={event.id} className="flex gap-4">
                          <div className="flex-shrink-0">
                            <img src={event.image} alt={event.title} className="w-24 h-16 object-cover rounded-lg" />
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20">
                                {event.type}
                              </span>
                              <span className="text-sm opacity-70">
                                {formatEventDate(event.date)} • {event.time}
                              </span>
                            </div>
                            <h4 className="font-semibold">{event.title}</h4>
                            <p className="text-sm opacity-80">Host: {event.host}</p>
                          </div>
                          <div className="flex items-center">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isLoggedIn) {
                                  setToast({ show: true, message: 'Please login to enroll/register.', type: 'error' });
                                  return;
                                }
                                if (eventRegistered.includes(event.id)) {
                                  setEventRegistered(prev => prev.filter(id => id !== event.id));
                                } else {
                                  setEventRegistered(prev => [...prev, event.id]);
                                }
                              }}
                              className={`px-4 py-2 rounded-lg text-sm cursor-pointer transition-all duration-300 ${
                                eventRegistered.includes(event.id)
                                  ? 'bg-green-500 text-white cursor-default'
                                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                              }`}
                            >
                              {eventRegistered.includes(event.id) ? 'Registered' : 'Register'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <button 
                        onClick={() => setToast({
                          show: true,
                          message: "More events coming soon! Check back later for updates.",
                          type: 'success'
                        })}
                        className="glassmorphism px-6 py-2 rounded-full font-medium text-sm hover:bg-white/40 transition-all duration-300 inline-flex items-center cursor-pointer"
                      >
                        <span>View All Events</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Monthly Calendar</h3>
                    
                    <div className="glassmorphism p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-6">
                        <button 
                          onClick={prevMonth}
                          className="p-2 hover:bg-white/20 rounded-full cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <h4 className="font-semibold text-lg">{getMonthName(calendarDate)}</h4>
                        <button 
                          onClick={nextMonth}
                          className="p-2 hover:bg-white/20 rounded-full cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                          <div key={index} className="text-sm font-medium py-1">{day}</div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {generateCalendarDays().map((day, index) => (
                          <div 
                            key={index} 
                            className={`relative py-2 text-sm rounded-full ${
                              !day.isCurrentMonth 
                                ? 'opacity-30' 
                                : day.hasEvent 
                                  ? 'bg-gradient-to-r from-blue-500/40 to-purple-600/40 font-medium cursor-pointer' 
                                  : 'hover:bg-white/10 cursor-pointer'
                            } ${
                              selectedDay && 
                              selectedDay.day === day.day && 
                              selectedDay.month === day.month && 
                              selectedDay.year === day.year 
                                ? 'ring-2 ring-blue-500' 
                                : ''
                            }`}
                            onClick={() => handleDayClick(day)}
                          >
                            {day.day}
                            {day.hasEvent && (
                              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {selectedDay && selectedDay.events && selectedDay.events.length > 0 && (
                      <div className="glassmorphism p-4 rounded-lg mt-6">
                        <h4 className="font-semibold mb-3">
                          {new Date(selectedDay.year, selectedDay.month, selectedDay.day).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </h4>
                        <div className="space-y-3">
                          {selectedDay.events.map(event => (
                            <div 
                              key={event.id}
                              className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors"
                            >
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span className="text-sm">{event.time} - {event.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {(!selectedDay || !selectedDay.events || selectedDay.events.length === 0) && (
                      <div className="glassmorphism p-4 rounded-lg mt-6">
                        <h4 className="font-semibold mb-3">
                          {selectedDay 
                            ? new Date(selectedDay.year, selectedDay.month, selectedDay.day).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                            : `${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                          }
                        </h4>
                        {selectedDay ? (
                          <p className="text-center py-2 opacity-70">No events scheduled for this day.</p>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span className="text-sm">Select a day to see events</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            </div>
          </section>
        )}
        
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <GlassCard className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
              <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter to receive the latest updates on new courses, events, and educational resources.
              </p>
              
              {successMessage ? (
                <div className="p-4 bg-green-100 text-green-800 rounded-xl max-w-xl mx-auto">
                  {successMessage}
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    required
                    className="flex-grow py-3 px-4 dark-form-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </GlassCard>
          </div>
        </section>
      </main>
      
      <footer className="glass-nav py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-4 inline-block">
                EduVista
              </span>
              <p className="text-sm opacity-80 mb-4 max-w-xs">
                An innovative educational platform dedicated to making learning accessible, engaging, and effective for everyone.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="p-2 glassmorphism rounded-full hover:bg-white/30 transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                  </svg>
                </a>
                <a href="#" className="p-2 glassmorphism rounded-full hover:bg-white/30 transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.097 10.097 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.161a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 14-7.496 14-13.986 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="p-2 glassmorphism rounded-full hover:bg-white/30 transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="p-2 glassmorphism rounded-full hover:bg-white/30 transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-blue-500 transition-colors cursor-pointer">Home</button></li>
                <li><button onClick={() => { setActiveTab('courses'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-blue-500 transition-colors cursor-pointer">Courses</button></li>
                <li><button onClick={() => { setActiveTab('videos'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-blue-500 transition-colors cursor-pointer">Video Library</button></li>
                <li><button onClick={() => { setActiveTab('testimonials'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-blue-500 transition-colors cursor-pointer">Testimonials</button></li>
                <li><button onClick={() => { setActiveTab('events'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-blue-500 transition-colors cursor-pointer">Events</button></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors cursor-pointer">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors cursor-pointer">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-500 transition-colors cursor-pointer">Technology</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors cursor-pointer">Business</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors cursor-pointer">Arts & Design</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors cursor-pointer">Health & Wellness</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors cursor-pointer">Languages</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors cursor-pointer">Personal Development</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors cursor-pointer">Science & Math</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-500 transition-colors cursor-pointer">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors cursor-pointer">FAQ</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors cursor-pointer">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors cursor-pointer">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors cursor-pointer">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors cursor-pointer">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors cursor-pointer">Accessibility</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm opacity-70">
            <p>© {new Date().getFullYear()} EduVista. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({...toast, show: false})} 
        />
      )}
    </div>
  );
};