"use client";

import { useState, useEffect, createContext, useContext, Suspense } from 'react';
import { format } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  X, 
  Menu, 
  Heart, 
  MessageSquare, 
  Star ,
  AlertCircle, CheckCircle, AlertTriangle, Info
} from 'lucide-react';
import { Playfair_Display, Inter, Montserrat } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion'; // Added framer-motion

// Font definitions
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

const modalVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

const heartVariants = {
  liked: { scale: [1, 1.3, 1], transition: { duration: 0.4 } },
  unliked: { scale: 1 }
};

// constants
export const VIEW_TYPES = {
  HOME: 'home',
  ARTICLE: 'article',
  PROFILE: 'profile',
  TOPICS: 'topics',
  TOPIC: 'topic',
  CREATE: 'create',
} as const;
export type ViewType = (typeof VIEW_TYPES)[keyof typeof VIEW_TYPES];


// Mock Data
const MOCK_USERS = [
  {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
    bio: 'Tech enthusiast and writer',
    avatar: 'https://placehold.co/80x80',
    followers: 1200,
    following: 45,
    averageRating: 4.7,
    joinedDate: '2023-01-15',
    isTrusted: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane@example.com',
    password: 'password123',
    bio: 'Science writer and researcher',
    avatar: 'https://placehold.co/80x80',
    followers: 850,
    following: 32,
    averageRating: 4.3,
    joinedDate: '2023-02-20',
    isTrusted: false,
  },
  {
    id: '3',
    name: 'David Wilson',
    username: 'davidwilson',
    email: 'david@example.com',
    password: 'password123',
    bio: 'Political analyst and journalist',
    avatar: 'https://placehold.co/80x80',
    followers: 2300,
    following: 67,
    averageRating: 4.8,
    joinedDate: '2022-11-05',
    isTrusted: true,
  },
];

const MOCK_TOPICS = [
  { id: '1', name: 'Technology' },
  { id: '2', name: 'Science' },
  { id: '3', name: 'Politics' },
  { id: '4', name: 'Health' },
  { id: '5', name: 'Business' },
];

const MOCK_ARTICLES = [
  {
    id: '1',
    title: 'The Future of Artificial Intelligence',
    content: `<p>Artificial Intelligence (AI) has evolved dramatically over the past decade. From simple algorithms to complex neural networks, the technology behind AI has made significant strides.</p>
    <p>Machine learning, a subset of AI, allows computers to learn from data and improve over time without being explicitly programmed. Deep learning, a further specialized subset, uses layered neural networks to simulate human decision-making.</p>
    <p>As we look to the future, AI is poised to revolutionize industries from healthcare to transportation. Autonomous vehicles, powered by AI, are already being tested on roads worldwide. In healthcare, AI algorithms can analyze medical images with accuracy rivaling that of human experts.</p>
    <p>However, with these advancements come ethical concerns. Issues of privacy, security, and the potential for AI to replace human jobs are at the forefront of discussions. As we continue to develop and deploy AI technologies, it's crucial that we address these concerns thoughtfully.</p>
    <p>The future of AI is not just about technological advancement but also about ensuring these technologies benefit humanity as a whole. This requires collaboration between technologists, ethicists, policymakers, and the public.</p>`,
    excerpt: 'Exploring the rapid advancements in AI technology and the implications for our future.',
    authorId: '1',
    topicId: '1',
    publishedDate: '2023-06-15',
    readTime: '5 min read',
    imageUrl: 'https://placehold.co/800x400',
    likes: 245,
    comments: 37,
    ratings: [
      { userId: '2', rating: 5 },
      { userId: '3', rating: 4 },
    ],
  },
  {
    id: '2',
    title: 'Understanding Quantum Computing',
    content: `<p>Quantum computing represents a paradigm shift in computational power and approach. Unlike classical computing, which uses bits as the smallest unit of data (either 0 or 1), quantum computing uses quantum bits or qubits.</p>
    <p>Qubits can exist in multiple states simultaneously, thanks to a property known as superposition. Another quantum property, entanglement, allows qubits to be interconnected in ways that classical bits cannot. These properties enable quantum computers to perform certain calculations exponentially faster than classical computers.</p>
    <p>The potential applications of quantum computing are vast. From drug discovery to optimization problems in logistics, quantum computers could revolutionize how we approach complex computational challenges. They could potentially break encryption algorithms that would take classical computers millions of years to crack.</p>
    <p>However, quantum computing is still in its early stages. Building stable qubits that can maintain their quantum state long enough to perform calculations is a significant challenge. Researchers are exploring various physical systems to serve as qubits, including superconducting circuits, trapped ions, and topological qubits.</p>
    <p>Despite these challenges, progress in quantum computing has been accelerating. Companies like IBM, Google, and Microsoft are investing heavily in quantum research, and quantum supremacy (the point at which a quantum computer can perform a calculation that a classical computer cannot in a reasonable amount of time) has reportedly been achieved for specific problems.</p>
    <p>As quantum computing continues to evolve, it promises to open new frontiers in computational capabilities and scientific discovery.</p>`,
    excerpt: 'Delving into the fascinating world of quantum computing and its revolutionary potential.',
    authorId: '2',
    topicId: '2',
    publishedDate: '2023-05-22',
    readTime: '7 min read',
    imageUrl: 'https://placehold.co/800x400',
    likes: 187,
    comments: 23,
    ratings: [
      { userId: '1', rating: 5 },
      { userId: '3', rating: 4 },
    ],
  },
  {
    id: '3',
    title: 'Global Economic Trends 2023',
    content: `<p>The global economy has been shaped by several significant trends in 2023. From the ongoing effects of the pandemic to the acceleration of digital transformation, these trends are reshaping how businesses operate and economies function.</p>
    <p>One notable trend is the continued shift towards digital commerce. E-commerce, already on an upward trajectory before the pandemic, has seen unprecedented growth. Businesses that have successfully adapted to this digital shift have thrived, while those that have been slow to adapt have struggled.</p>
    <p>Another significant trend is the focus on sustainability. Investors, consumers, and regulators are increasingly prioritizing environmental, social, and governance (ESG) factors. Companies are responding by incorporating sustainability into their business strategies, from sourcing raw materials to managing their carbon footprint.</p>
    <p>The labor market has also seen substantial changes. Remote work, once a necessity during lockdowns, has become a permanent fixture for many companies. This has implications for everything from office real estate to talent acquisition strategies.</p>
    <p>In terms of global economic powers, we're seeing a continued shift towards Asia. China's economy continues to grow, despite challenges, and other Asian economies like Vietnam and India are also showing strong growth.</p>
    <p>Looking ahead, the global economy faces both challenges and opportunities. Inflationary pressures, supply chain disruptions, and geopolitical tensions present risks. However, technological innovation, the transition to renewable energy, and emerging market growth offer potential for continued economic expansion.</p>`,
    excerpt: 'Analyzing the major economic trends that are shaping global markets and businesses in 2023.',
    authorId: '3',
    topicId: '5',
    publishedDate: '2023-06-01',
    readTime: '6 min read',
    imageUrl: 'https://placehold.co/800x400',
    likes: 156,
    comments: 19,
    ratings: [
      { userId: '1', rating: 4 },
      { userId: '2', rating: 5 },
    ],
  },
];

const mockComments = [
  {
    id: '1',
    articleId: '1',
    userId: '2',
    content: 'Great article! The insights on AI ethics are particularly thought-provoking.',
    date: '2023-06-16',
    likes: 12,
  },
  {
    id: '2',
    articleId: '1',
    userId: '3',
    content: 'I wonder how AI will impact job markets in the next decade. Would love to see a follow-up article on that topic.',
    date: '2023-06-17',
    likes: 8,
  },
  {
    id: '3',
    articleId: '2',
    userId: '1',
    content: 'Quantum computing explained in such a clear way! Thanks for making complex concepts accessible.',
    date: '2023-05-23',
    likes: 15,
  },
  {
    id: '4',
    articleId: '3',
    userId: '2',
    content: 'The analysis of Asian markets is spot on. I\'ve been following these trends and your insights align with what I\'ve observed.',
    date: '2023-06-02',
    likes: 7,
  },
];

// Types
type User = typeof MOCK_USERS[0];
type Article = typeof MOCK_ARTICLES[0];
type Comment = typeof mockComments[0];
type Topic = typeof MOCK_TOPICS[0];

// Add this code right after importing the existing contexts
// Alert Context

type AlertType = 'success' | 'error' | 'warning' | 'info';

type Alert = {
  id: string;
  message: string;
  type: AlertType;
  duration?: number;
};

type AlertContextType = {
  alerts: Alert[];
  showAlert: (message: string, type: AlertType, duration?: number) => void;
  hideAlert: (id: string) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
};

const AlertContext = createContext<AlertContextType>({
  alerts: [],
  showAlert: () => {},
  hideAlert: () => {},
  showSuccess: () => {},
  showError: () => {},
  showWarning: () => {},
  showInfo: () => {},
});

const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = (message: string, type: AlertType, duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newAlert = { id, message, type, duration };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
  };

  const hideAlert = (id: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  const showSuccess = (message: string, duration = 3000) => {
    showAlert(message, 'success', duration);
  };

  const showError = (message: string, duration = 3000) => {
    showAlert(message, 'error', duration);
  };

  const showWarning = (message: string, duration = 3000) => {
    showAlert(message, 'warning', duration);
  };

  const showInfo = (message: string, duration = 3000) => {
    showAlert(message, 'info', duration);
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        showAlert,
        hideAlert,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      <AlertContainer />
    </AlertContext.Provider>
  );
};

// Hook for using the alert context
const useAlert = () => useContext(AlertContext);

// Alert Container component to display alerts
const AlertContainer = () => {
  const { alerts, hideAlert } = useAlert();

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-md">
      <AnimatePresence>
        {alerts.map((alert) => (
          <Alert key={alert.id} alert={alert} onClose={() => hideAlert(alert.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Individual Alert component
const Alert = ({ alert, onClose }: { alert: Alert; onClose: () => void }) => {
  useEffect(() => {
    if (alert.duration) {
      const timer = setTimeout(onClose, alert.duration);
      return () => clearTimeout(timer);
    }
  }, [alert.duration, onClose]);

  // Color variants based on alert type
  const getColorClasses = () => {
    switch (alert.type) {
      case 'success':
        return 'bg-green-50 border-green-500 text-green-700';
      case 'error':
        return 'bg-red-50 border-red-500 text-red-700';
      case 'warning':
        return 'bg-yellow-50 border-yellow-500 text-yellow-700';
      case 'info':
        return 'bg-blue-50 border-blue-500 text-blue-700';
      default:
        return 'bg-gray-50 border-gray-500 text-gray-700';
    }
  };

  // Icon based on alert type
  const getIcon = () => {
    switch (alert.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`p-4 border-l-4 rounded-md shadow-md ${getColorClasses()} ${inter.className}`}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{alert.message}</p>
        </div>
        <motion.button
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500"
          onClick={onClose}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Auth Context
type AuthContextType = {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string) => boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: () => false,
  logout: () => {},
  register: () => false,
  isAuthenticated: false,
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email: string, password: string) => {
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const register = (name: string, email: string, password: string) => {
    // In a real app, this would call an API
    // For demo, just check if email already exists
    const existingUser = MOCK_USERS.find((u) => u.email === email);
    if (existingUser) {
      return false;
    }
    
    // Create new user
    const newUser = {
      id: (MOCK_USERS.length + 1).toString(),
      name,
      username: name.toLowerCase().replace(/\s/g, ''),
      email,
      password,
      bio: '',
      avatar: 'https://placehold.co/80x80',
      followers: 0,
      following: 0,
      averageRating: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      isTrusted: false,
    };
    
    // In a real app, would add to DB
    MOCK_USERS.push(newUser);
    
    // Auto-login
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        register,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// App Context (for state management)
type AppContextType = {
  articles: Article[];
  users: User[];
  topics: Topic[];
  comments: Comment[];
  followUser: (userId: string) => void;
  followTopic: (topicId: string) => void;
  likeArticle: (articleId: string) => void;
  rateArticle: (articleId: string, rating: number) => void;
  addComment: (articleId: string, content: string) => void;
  likeComment: (commentId: string) => void;
  followedUsers: string[];
  followedTopics: string[];
  likedArticles: string[];
  likedComments: string[];
  createArticle: (article: Partial<Article>) => void;
};

const AppContext = createContext<AppContextType>({
  articles: [],
  users: [],
  topics: [],
  comments: [],
  followUser: () => {},
  followTopic: () => {},
  likeArticle: () => {},
  rateArticle: () => {},
  addComment: () => {},
  likeComment: () => {},
  followedUsers: [],
  followedTopics: [],
  likedArticles: [],
  likedComments: [],
  createArticle: () => {},
});

// Helper function to preserve base URL when navigating
const getFullPath = (query?:string[][] | Record<string, string> | string | URLSearchParams) => {
  // Get the current pathname (includes the full base URL path)
  const currentPath = window.location.pathname;
  // Create query string from the query object
  const queryString = new URLSearchParams(query).toString();
  return `${currentPath}?${queryString}`;
};

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useContext(AuthContext);
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [topics] = useState<Topic[]>(MOCK_TOPICS);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);
  const [followedTopics, setFollowedTopics] = useState<string[]>([]);
  const [likedArticles, setLikedArticles] = useState<string[]>([]);
  const [likedComments, setLikedComments] = useState<string[]>([]);

  const followUser = (userId: string) => {
    if (!currentUser) return;
    
    if (followedUsers.includes(userId)) {
      setFollowedUsers(followedUsers.filter((id) => id !== userId));
      setUsers(
        users.map((user) =>
          user.id === userId
            ? { ...user, followers: user.followers - 1 }
            : user
        )
      );
    } else {
      setFollowedUsers([...followedUsers, userId]);
      setUsers(
        users.map((user) =>
          user.id === userId
            ? { ...user, followers: user.followers + 1 }
            : user
        )
      );
    }
  };

  const followTopic = (topicId: string) => {
    if (!currentUser) return;
    
    if (followedTopics.includes(topicId)) {
      setFollowedTopics(followedTopics.filter((id) => id !== topicId));
    } else {
      setFollowedTopics([...followedTopics, topicId]);
    }
  };

  const likeArticle = (articleId: string) => {
    if (!currentUser) return;
    
    if (likedArticles.includes(articleId)) {
      setLikedArticles(likedArticles.filter((id) => id !== articleId));
      setArticles(
        articles.map((article) =>
          article.id === articleId
            ? { ...article, likes: article.likes - 1 }
            : article
        )
      );
    } else {
      setLikedArticles([...likedArticles, articleId]);
      setArticles(
        articles.map((article) =>
          article.id === articleId
            ? { ...article, likes: article.likes + 1 }
            : article
        )
      );
    }
  };

  const rateArticle = (articleId: string, rating: number) => {
    if (!currentUser) return;
    
    const article = articles.find((a) => a.id === articleId);
    if (!article) return;
    
    const existingRatingIndex = article.ratings.findIndex(
      (r) => r.userId === currentUser.id
    );
    
    let newRatings;
    if (existingRatingIndex >= 0) {
      newRatings = [...article.ratings];
      newRatings[existingRatingIndex] = {
        userId: currentUser.id,
        rating,
      };
    } else {
      newRatings = [
        ...article.ratings,
        { userId: currentUser.id, rating },
      ];
    }
    
    setArticles(
      articles.map((a) =>
        a.id === articleId ? { ...a, ratings: newRatings } : a
      )
    );
    
    // Update author's average rating
    const authorId = article.authorId;
    const authorArticles = articles.filter((a) => a.authorId === authorId);
    let totalRatings = 0;
    let ratingCount = 0;
    
    authorArticles.forEach((a) => {
      a.ratings.forEach((r) => {
        totalRatings += r.rating;
        ratingCount++;
      });
    });
    
    const newAvgRating = ratingCount > 0 ? totalRatings / ratingCount : 0;
    
    setUsers(
      users.map((user) =>
        user.id === authorId
          ? {
              ...user,
              averageRating: parseFloat(newAvgRating.toFixed(1)),
              isTrusted: newAvgRating >= 4.5 && user.followers >= 1000,
            }
          : user
      )
    );
  };

  const addComment = (articleId: string, content: string) => {
    if (!currentUser || !content.trim()) return;
    
    const newComment: Comment = {
      id: (comments.length + 1).toString(),
      articleId,
      userId: currentUser.id,
      content,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
    };
    
    setComments([...comments, newComment]);
    setArticles(
      articles.map((article) =>
        article.id === articleId
          ? { ...article, comments: article.comments + 1 }
          : article
      )
    );
  };

  const likeComment = (commentId: string) => {
    if (!currentUser) return;
    
    if (likedComments.includes(commentId)) {
      setLikedComments(likedComments.filter((id) => id !== commentId));
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, likes: comment.likes - 1 }
            : comment
        )
      );
    } else {
      setLikedComments([...likedComments, commentId]);
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, likes: comment.likes + 1 }
            : comment
        )
      );
    }
  };

  const createArticle = (articleData: Partial<Article>) => {
    if (!currentUser) return;
    
    const newArticle: Article = {
      id: (articles.length + 1).toString(),
      title: articleData.title || 'Untitled Article',
      content: articleData.content || '<p>No content provided.</p>',
      excerpt: articleData.excerpt || 'No excerpt provided.',
      authorId: currentUser.id,
      topicId: articleData.topicId || '1',
      publishedDate: new Date().toISOString().split('T')[0],
      readTime: `${Math.max(1, Math.ceil(articleData.content?.length || 0) / 1000)} min read`,
      imageUrl: articleData.imageUrl || 'https://placehold.co/800x400',
      likes: 0,
      comments: 0,
      ratings: [],
    };
    
    setArticles([newArticle, ...articles]);
  };

  return (
    <AppContext.Provider
      value={{
        articles,
        users,
        topics,
        comments,
        followUser,
        followTopic,
        likeArticle,
        rateArticle,
        addComment,
        likeComment,
        followedUsers,
        followedTopics,
        likedArticles,
        likedComments,
        createArticle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const Navbar = () => {
  const { isAuthenticated, currentUser, logout } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const router = useRouter();
  const { showSuccess } = useAlert();

  const searchParams = useSearchParams();
  
  const view = searchParams?.get('view') || 'home';

  // Navigation items
  const navItems = [
    { label: 'Home', viewKey: 'home', path: getFullPath() },
    { label: 'Topics', viewKey: 'topics', path: getFullPath({view:'topics'}) },
  ];

  // Include Create only for authenticated users
  if (isAuthenticated) {
    navItems.push({ label: 'Create', viewKey: 'create', path: getFullPath({view:'create'}) });
  }
  // Handle logout with redirect logic
  const handleLogout = () => {
    logout();
    showSuccess('You have been logged out successfully.');
    // If user is on create article page, redirect to home
    if (view === 'create') {
      router.push(getFullPath());
    }
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <motion.h1 
              className={`text-xl font-bold text-indigo-600 ${playfair.className}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Alexia
            </motion.h1>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.viewKey}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(item.path);
                  }}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${montserrat.className} ${
                    view === item.viewKey
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Desktop Auth / Profile */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <motion.button
                    onClick={() => router.push(getFullPath({ view: 'profile', id: currentUser?.id ?? '' }))}
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      className="h-8 w-8 rounded-full"
                      src={currentUser?.avatar || 'https://placehold.co/80x80'}
                      alt={currentUser?.name || ''}
                    />
                    <span className={`text-sm font-medium text-gray-700 ${montserrat.className}`}>
                      {currentUser?.name}
                    </span>
                  </motion.button>
                  <motion.button
                    onClick={handleLogout}
                    className={`px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 ${montserrat.className}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Logout
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  onClick={() => setShowAuth(true)}
                  className={`px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 ${montserrat.className}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login / Register
                </motion.button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <motion.button
              onClick={() => setShowMenu(!showMenu)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              whileTap={{ scale: 0.9 }}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon based on menu state */}
              {showMenu ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu items */}
      <AnimatePresence>
        {showMenu && (
          <motion.div 
            className="sm:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >  
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <motion.a
                  key={item.viewKey}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(getFullPath(item.path));
                    setShowMenu(false);
                  }}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${montserrat.className} ${
                    view === item.viewKey
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="flex items-center px-4">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={currentUser?.avatar || 'https://placehold.co/80x80'}
                    alt={currentUser?.name || ''}
                  />
                  <div className="ml-3">
                    <div className={`text-base font-medium text-gray-800 ${montserrat.className}`}>{currentUser?.name}</div>
                    <div className={`text-sm font-medium text-gray-500 ${inter.className}`}>{currentUser?.email}</div>
                  </div>
                  <motion.button
                    onClick={handleLogout}
                    className={`ml-auto px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 ${montserrat.className}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Logout
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center justify-center px-4 py-2">
                  <motion.button
                    onClick={() => {
                      setShowAuth(true);
                      setShowMenu(false);
                    }}
                    className={`px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 ${montserrat.className}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Login / Register
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </AnimatePresence>
    </nav>
  );
};

const ArticleCard = ({ article }: { article: Article }) => {
  const { users, topics, likeArticle, likedArticles } = useContext(AppContext);
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  const { showInfo, showSuccess } = useAlert();
  const [justLiked, setJustLiked] = useState(false);
  
  const author = users.find((user) => user.id === article.authorId);
  const topic = topics.find((topic) => topic.id === article.topicId);
  
  const isLiked = likedArticles.includes(article.id);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      showInfo('Please login to like articles');
      return;
    }
    
    likeArticle(article.id);
    if (!isLiked) {
      setJustLiked(true);
      showSuccess('Article added to your likes');
      setTimeout(() => setJustLiked(false), 400);
    } else {
      showInfo('Article removed from your likes');
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg"
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <motion.span 
            className={`text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full ${montserrat.className}`}
            whileHover={{ scale: 1.1 }}
          >
            {topic?.name}
          </motion.span>
          <span className={`text-xs text-gray-500 ${inter.className}`}>
            {formatDate(article.publishedDate)}
          </span>
          <span className={`text-xs text-gray-500 ${inter.className}`}>{article.readTime}</span>
        </div>
        <motion.h2 
          className={`text-xl font-bold mb-2 line-clamp-2 hover:text-indigo-600 cursor-pointer ${playfair.className}`}
          whileHover={{ x: 3 }}
          transition={{ type: 'spring', stiffness: 700, damping: 30 }}
        >
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              router.push(getFullPath({ view: 'article', id: article.id }));
            }}
          >
            {article.title}
          </a>
        </motion.h2>
        <p className={`text-gray-600 mb-4 line-clamp-2 ${inter.className}`}>{article.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.img
              src={author?.avatar || 'https://placehold.co/80x80'}
              alt={author?.name || ''}
              className="w-8 h-8 rounded-full"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 500 }}
            />
            <div>
              <p className={`text-sm font-medium ${montserrat.className}`}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(getFullPath({ view: 'profile', id: author?.id ?? '' }));
                  }}
                  className="hover:text-indigo-600"
                >
                  {author?.name}
                </a>
                {author?.isTrusted && (
                  <span className={`ml-1 text-xs text-white bg-green-500 px-1 py-0.5 rounded ${montserrat.className}`}>
                    Trusted
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                isLiked ? 'text-red-500' : 'text-gray-500'
              }`}
              variants={heartVariants}
              animate={isLiked && justLiked ? 'liked' : 'unliked'}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
              <span className={inter.className}>{article.likes}</span>
            </motion.button>
            <div className="flex items-center space-x-1 text-gray-500">
              <MessageSquare className="h-5 w-5" />
              <span className={inter.className}>{article.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ArticleDetail = ({ articleId }: { articleId: string }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [justLiked, setJustLiked] = useState(false);
  const {
    articles,
    users,
    topics,
    comments,
    likeArticle,
    rateArticle,
    addComment,
    likeComment,
    followUser,
    followedUsers,
    likedArticles,
    likedComments,
  } = useContext(AppContext);
  const { showError, showSuccess, showInfo } = useAlert();
  const { isAuthenticated, currentUser } = useContext(AuthContext);
  const router = useRouter();

  const article = articles.find((a) => a.id === articleId);
  if (!article) return <div>Article not found</div>;

  const author = users.find((user) => user.id === article.authorId);
  const topic = topics.find((topic) => topic.id === article.topicId);
  const articleComments = comments
    .filter((c) => c.articleId === articleId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const isLiked = likedArticles.includes(article.id);
  const isFollowing = followedUsers.includes(author?.id || '');

  // Calculate average rating
  const averageRating =
    article.ratings.length > 0
      ? article.ratings.reduce((sum, r) => sum + r.rating, 0) /
        article.ratings.length
      : 0;

  // Check if current user has rated
  const userRating = currentUser
    ? article.ratings.find((r) => r.userId === currentUser.id)?.rating || 0
    : 0;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const handleRate = (newRating: number) => {
    if (!isAuthenticated) {
      showInfo('Please login to rate this article');
      return;
    }
    setRating(newRating);
    rateArticle(articleId, newRating);
    showSuccess('Your rating has been submitted!');
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showInfo('Please login to comment');
      return;
    }
    if (comment.trim()) {
      addComment(articleId, comment);
      setComment('');
      showSuccess('Your comment has been posted!');
    } else {
      showError('Comment cannot be empty');
    }
  };


  const handleLike = () => {
    likeArticle(articleId);
    if (!isLiked) {
      setJustLiked(true);
      setTimeout(() => setJustLiked(false), 400);
    }
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-64 md:h-96">
        <motion.img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        />
      </div>
      <div className="p-6">
        <div className="flex flex-wrap items-center space-x-2 mb-4">
          <motion.span 
            className={`text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full ${montserrat.className}`}
            whileHover={{ scale: 1.1 }}
          >
            {topic?.name}
          </motion.span>
          <span className={`text-sm text-gray-500 ${inter.className}`}>
            {formatDate(article.publishedDate)}
          </span>
          <span className={`text-sm text-gray-500 ${inter.className}`}>{article.readTime}</span>
          <div className="flex items-center ml-auto">
            <motion.button
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                isLiked ? 'text-red-500' : 'text-gray-500'
              }`}
              variants={heartVariants}
              animate={isLiked && justLiked ? 'liked' : 'unliked'}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
              <span className={inter.className}>{article.likes}</span>
            </motion.button>
          </div>
        </div>
        <motion.h1 
          className={`text-3xl font-bold mb-4 ${playfair.className}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {article.title}
        </motion.h1>

        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <motion.img
              src={author?.avatar || 'https://placehold.co/80x80'}
              alt={author?.name || ''}
              className="w-12 h-12 rounded-full"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            <div>
              <p className={`font-medium ${montserrat.className}`}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(getFullPath({ view: 'profile', id: author?.id ?? '' }));
                  }}
                  className="hover:text-indigo-600"
                >
                  {author?.name}
                </a>
                {author?.isTrusted && (
                  <span className={`ml-2 text-xs text-white bg-green-500 px-1 py-0.5 rounded ${montserrat.className}`}>
                    Trusted
                  </span>
                )}
              </p>
              <p className={`text-sm text-gray-500 ${inter.className}`}>
                {author?.followers.toLocaleString()} followers
              </p>
            </div>
          </div>
          {isAuthenticated && currentUser?.id !== author?.id && (
            <motion.button
              onClick={() => followUser(author?.id || '')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${montserrat.className} ${
                isFollowing
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </motion.button>
          )}
        </div>

        <motion.div 
          className={`prose max-w-none mb-8 ${inter.className}`}
          dangerouslySetInnerHTML={{ __html: article.content }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />

        <motion.div 
          className="my-8 p-4 bg-gray-50 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h3 className={`text-lg font-semibold mb-2 ${montserrat.className}`}>Rate this article</h3>
          <div className="flex items-center mb-2">
  <div className="flex space-x-1 mr-4">
    {[1, 2, 3, 4, 5].map((star) => (
      <motion.button
        key={star}
        onClick={() => handleRate(star)}
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(0)}
        disabled={!isAuthenticated}
        className={`${
          (hoverRating >= star || userRating >= star) ? 'text-yellow-400' : 'text-gray-300'
        } focus:outline-none ${
          !isAuthenticated ? 'cursor-not-allowed' : ''
        }`}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <Star 
          className="h-6 w-6" 
          fill={(hoverRating >= star || userRating >= star) ? "currentColor" : "none"} 
        />
      </motion.button>
    ))}
  </div>
  <span className={`text-sm text-gray-600 ${inter.className}`}>
    {article.ratings.length > 0
      ? `Average: ${averageRating.toFixed(1)} (${
          article.ratings.length
        } ratings)`
      : 'No ratings yet'}
  </span>
</div>
          {!isAuthenticated && (
            <p className={`text-sm text-gray-500 ${inter.className}`}>
              Please login to rate this article
            </p>
          )}
        </motion.div>

        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h3 className={`text-xl font-semibold mb-4 ${playfair.className}`}>Comments ({article.comments})</h3>
          {isAuthenticated ? (
            <form onSubmit={handleSubmitComment} className="mb-6">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500 ${inter.className}`}
                rows={3}
              ></textarea>
              <motion.button
                type="submit"
                className={`mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700 ${montserrat.className}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Post Comment
              </motion.button>
            </form>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className={`text-gray-600 ${inter.className}`}>
                Please{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    // Show login modal here
                  }}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  login
                </a>{' '}
                to leave a comment.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {articleComments.length > 0 ? (
              articleComments.map((comment, index) => {
                const commentUser = users.find((u) => u.id === comment.userId);
                const isCommentLiked = likedComments.includes(comment.id);

                return (
                  <motion.div
                    key={comment.id}
                    className="p-4 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                  >
                    <div className="flex items-start">
                      <img
                        src={commentUser?.avatar || 'https://placehold.co/80x80'}
                        alt={commentUser?.name || ''}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`font-medium ${montserrat.className}`}>
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                router.push(getFullPath({ view: 'profile', id: commentUser?.id ?? '' }));
                              }}
                              className="hover:text-indigo-600"
                            >
                              {commentUser?.name}
                            </a>
                            {commentUser?.isTrusted && (
                              <span className={`ml-2 text-xs text-white bg-green-500 px-1 py-0.5 rounded ${montserrat.className}`}>
                                Trusted
                              </span>
                            )}
                          </p>
                          <span className={`text-xs text-gray-500 ${inter.className}`}>
                            {formatDate(comment.date)}
                          </span>
                        </div>
                        <p className={`mt-1 text-gray-700 ${inter.className}`}>{comment.content}</p>
                        <div className="mt-2 flex items-center">
                          <motion.button
                            onClick={() => likeComment(comment.id)}
                            className={`flex items-center space-x-1 text-sm ${
                              isCommentLiked ? 'text-red-500' : 'text-gray-500'
                            }`}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Heart className="h-4 w-4" fill={isCommentLiked ? "currentColor" : "none"} />
                            <span>{comment.likes}</span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <p className={`text-gray-500 text-center py-4 ${inter.className}`}>
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Profile = ({ userId }: { userId: string }) => {
  const { users, articles, followUser, followedUsers } = useContext(AppContext);
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();

  const user = users.find((u) => u.id === userId);
  if (!user) return <div>User not found</div>;

  const userArticles = articles
    .filter((article) => article.authorId === userId)
    .sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime()
    );

  const isFollowing = followedUsers.includes(userId);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div 
        className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>
        <div className="p-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <motion.div 
              className="absolute -top-12 left-6 sm:relative sm:top-auto sm:left-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-white"
              />
            </motion.div>
            <div className="mt-16 sm:mt-0 sm:ml-6 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <motion.h1 
                    className={`text-2xl font-bold ${playfair.className}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {user.name}
                    {user.isTrusted && (
                      <span className={`ml-2 text-sm text-white bg-green-500 px-2 py-0.5 rounded-full ${montserrat.className}`}>
                        Trusted
                      </span>
                    )}
                  </motion.h1>
                  <p className={`text-gray-600 ${inter.className}`}>@{user.username}</p>
                </div>
                {currentUser && currentUser.id !== user.id && (
                  <motion.button
                    onClick={() => followUser(user.id)}
                    className={`mt-4 sm:mt-0 px-4 py-2 rounded-md text-sm font-medium ${montserrat.className} ${
                      isFollowing
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </motion.button>
                )}
              </div>
              <p className={`mt-2 text-gray-700 ${inter.className}`}>{user.bio}</p>
            </div>
          </div>

          <motion.div 
            className="mt-6 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.div 
              className="bg-gray-50 rounded-lg px-4 py-2"
              whileHover={{ y: -5, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            >
              <p className={`text-sm text-gray-500 ${inter.className}`}>Followers</p>
              <p className={`text-xl font-semibold ${montserrat.className}`}>
                {user.followers.toLocaleString()}
              </p>
            </motion.div>
            <motion.div 
              className="bg-gray-50 rounded-lg px-4 py-2"
              whileHover={{ y: -5, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            >
              <p className={`text-sm text-gray-500 ${inter.className}`}>Following</p>
              <p className={`text-xl font-semibold ${montserrat.className}`}>
                {user.following.toLocaleString()}
              </p>
            </motion.div>
            <motion.div 
              className="bg-gray-50 rounded-lg px-4 py-2"
              whileHover={{ y: -5, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            >
              <p className={`text-sm text-gray-500 ${inter.className}`}>Rating</p>
              <div className="flex items-center">
                <p className={`text-xl font-semibold ${montserrat.className}`}>{user.averageRating}</p>
                <motion.div
                  animate={{ rotate: [0, 15, 0, -15, 0] }}
                  transition={{ duration: 1, delay: 0.6, repeat: 1 }}
                >
                  <Star className="h-5 w-5 ml-1 text-yellow-400" fill="currentColor" />
                </motion.div>
              </div>
            </motion.div>
            <motion.div 
              className="bg-gray-50 rounded-lg px-4 py-2"
              whileHover={{ y: -5, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            >
              <p className={`text-sm text-gray-500 ${inter.className}`}>Joined</p>
              <p className={`text-xl font-semibold ${montserrat.className}`}>
                {formatDate(user.joinedDate)}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        className="bg-white rounded-lg shadow-md overflow-hidden p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2 className={`text-xl font-bold mb-4 ${playfair.className}`}>Published Articles</h2>
        {userArticles.length > 0 ? (
          <div className="space-y-4">
            {userArticles.map((article, index) => (
              <motion.div
                key={article.id}
                className="border-b border-gray-200 pb-4 last:border-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ x: 5 }}
              >
                <h3 className={`font-semibold mb-1 hover:text-indigo-600 ${playfair.className}`}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/?view=article&id=${article.id}`);
                      router.push(getFullPath({ view: 'article', id: article.id }));
                    }}
                  >
                    {article.title}
                  </a>
                </h3>
                <p className={`text-gray-600 text-sm mb-2 ${inter.className}`}>
                  {article.excerpt}
                </p>
                <div className={`flex text-xs text-gray-500 space-x-4 ${inter.className}`}>
                  <span>{formatDate(article.publishedDate)}</span>
                  <span>{article.readTime}</span>
                  <span>{article.likes} likes</span>
                  <span>{article.comments} comments</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className={`text-gray-500 text-center py-4 ${inter.className}`}>
            No published articles yet.
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

const TopicsView = () => {
  const { topics, followTopic, followedTopics, articles } = useContext(AppContext);
  const router = useRouter();

  // Count articles per topic
  const articleCount = topics.reduce((acc, topic) => {
    acc[topic.id] = articles.filter((a) => a.topicId === topic.id).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <motion.div 
      className="max-w-4xl mx-auto"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <motion.h1 
            className={`text-2xl font-bold mb-6 ${playfair.className}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Browse Topics
          </motion.h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic, index) => {
              const isFollowing = followedTopics.includes(topic.id);
              
              return (
                <motion.div
                  key={topic.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                  whileHover={{ y: -5, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h2 className={`text-lg font-semibold ${playfair.className}`}>{topic.name}</h2>
                    <motion.button
                      onClick={() => followTopic(topic.id)}
                      className={`text-xs px-2 py-1 rounded-full ${montserrat.className} ${
                        isFollowing
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </motion.button>
                  </div>
                  <p className={`text-sm text-gray-500 mb-2 ${inter.className}`}>
                    {articleCount[topic.id]} articles
                  </p>
                  <motion.button
                    onClick={() => router.push(getFullPath({ view: 'topic', id: topic.id }))}
                    className={`text-indigo-600 text-sm hover:text-indigo-800 ${montserrat.className}`}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    View Articles
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TopicView = ({ topicId }: { topicId: string }) => {
  const { topics, articles, followTopic, followedTopics } = useContext(AppContext);
  
  const topic = topics.find((t) => t.id === topicId);
  if (!topic) return <div>Topic not found</div>;
  
  const topicArticles = articles
    .filter((article) => article.topicId === topicId)
    .sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime()
    );
  
  const isFollowing = followedTopics.includes(topicId);

  return (
    <motion.div 
      className="max-w-4xl mx-auto"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div 
        className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <motion.h1 
              className={`text-2xl font-bold ${playfair.className}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {topic.name}
            </motion.h1>
            <motion.button
              onClick={() => followTopic(topic.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${montserrat.className} ${
                isFollowing
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </motion.button>
          </div>
          <p className={`text-gray-600 mb-2 ${inter.className}`}>
            {topicArticles.length} articles in this topic
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topicArticles.length > 0 ? (
          topicArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <ArticleCard article={article} />
            </motion.div>
          ))
        ) : (
          <div className={`col-span-2 text-center py-12 ${inter.className}`}>
            <p className="text-gray-500">No articles in this topic yet.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const CreateArticle = () => {
  const { topics, createArticle } = useContext(AppContext);
  const router = useRouter();
  const { showError, showSuccess } = useAlert(); 
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [topicId, setTopicId] = useState(topics[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    createArticle({
      title,
      content: `<p>${content.split('\n').join('</p><p>')}</p>`,
      excerpt: excerpt || title,
      topicId,
    });
    
    // Simulate a delay and show success message
    setTimeout(() => {
      setIsSubmitting(false);
      router.push(getFullPath());
      showSuccess('Your article has been published successfully!');
    }, 1000);
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <motion.h1 
            className={`text-2xl font-bold mb-6 ${playfair.className}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Create New Article
          </motion.h1>
          <form onSubmit={handleSubmit}>
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <label
                htmlFor="title"
                className={`block text-sm font-medium text-gray-700 mb-1 ${montserrat.className}`}
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${inter.className}`}
                required
              />
            </motion.div>
            
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <label
                htmlFor="excerpt"
                className={`block text-sm font-medium text-gray-700 mb-1 ${montserrat.className}`}
              >
                Excerpt (optional)
              </label>
              <input
                type="text"
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${inter.className}`}
              />
              <p className={`text-xs text-gray-500 mt-1 ${inter.className}`}>
                A short description of your article. If left empty, the title will be used.
              </p>
            </motion.div>
            
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <label
                htmlFor="topic"
                className={`block text-sm font-medium text-gray-700 mb-1 ${montserrat.className}`}
              >
                Topic *
              </label>
              <select
                id="topic"
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${inter.className}`}
                required
              >
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </motion.div>
            
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label
                htmlFor="content"
                className={`block text-sm font-medium text-gray-700 mb-1 ${montserrat.className}`}
              >
                Content *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${inter.className}`}
                rows={10}
                required
              ></textarea>
              <p className={`text-xs text-gray-500 mt-1 ${inter.className}`}>
                Write your article content here. Use new lines for paragraphs.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex justify-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.button
                type="button"
                onClick={() => router.push(getFullPath())}
                className={`mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${montserrat.className}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 ${montserrat.className}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <motion.span 
                      className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    ></motion.span>
                    Publishing...
                  </span>
                ) : 'Publish Article'}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

const AuthModal = ({ onClose }: { onClose: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useContext(AuthContext);
  const { showSuccess, showError } = useAlert(); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const success = login(email, password);
      if (success) {
        showSuccess('Login successful! Welcome back.');
        onClose();
      } else {
        setError('Invalid email or password');
        showError('Login failed. Please check your credentials.');
      }
    } else {
      if (!name.trim()) {
        setError('Name is required');
        showError('Registration failed. Name is required.');
        return;
      }
      const success = register(name, email, password);
      if (success) {
        showSuccess('Registration successful! Welcome to Alexia.');
        onClose();
      } else {
        setError('Email already exists');
        showError('Registration failed. Email already exists.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div 
        className="bg-white rounded-lg max-w-md w-full mx-4"
        variants={modalVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <motion.h2 
              className={`text-xl font-bold ${playfair.className}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {isLogin ? 'Login' : 'Create an Account'}
            </motion.h2>
            <motion.button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.button>
          </div>

          {error && (
            <motion.div 
              className={`mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm ${inter.className}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          <motion.form 
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {!isLogin && (
              <motion.div 
                className="mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <label
                  htmlFor="name"
                  className={`block text-sm font-medium text-gray-700 mb-1 ${montserrat.className}`}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${inter.className}`}
                  required
                />
              </motion.div>
            )}

            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <label
                htmlFor="email"
                className={`block text-sm font-medium text-gray-700 mb-1 ${montserrat.className}`}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${inter.className}`}
                required
              />
            </motion.div>

            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <label
                htmlFor="password"
                className={`block text-sm font-medium text-gray-700 mb-1 ${montserrat.className}`}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${inter.className}`}
                required
              />
            </motion.div>

            <motion.button
              type="submit"
              className={`w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${montserrat.className}`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {isLogin ? 'Login' : 'Register'}
            </motion.button>
          </motion.form>

          <motion.div 
            className="mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.button
              onClick={() => setIsLogin(!isLogin)}
              className={`text-indigo-600 hover:text-indigo-800 text-sm ${montserrat.className}`}
              whileHover={{ scale: 1.05 }}
            >
              {isLogin
                ? "Don't have an account? Register"
                : 'Already have an account? Login'}
            </motion.button>
          </motion.div>

          <motion.div 
            className="mt-6 border-t border-gray-200 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <p className={`text-sm text-gray-500 text-center ${inter.className}`}>
              Demo accounts: john@example.com / password123
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const HomePage = () => {
  const { articles, users, topics } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('recent');
  
  // Filter and sort articles based on active tab
  let filteredArticles;
  
  switch (activeTab) {
    case 'trending':
      filteredArticles = [...articles].sort((a, b) => b.likes - a.likes);
      break;
    case 'trusted':
      const trustedUserIds = users
        .filter((user) => user.isTrusted)
        .map((user) => user.id);
      filteredArticles = articles.filter((article) =>
        trustedUserIds.includes(article.authorId)
      );
      break;
    case 'recent':
    default:
      filteredArticles = [...articles].sort(
        (a, b) =>
          new Date(b.publishedDate).getTime() -
          new Date(a.publishedDate).getTime()
      );
  }

  return (
    <motion.div 
      className="max-w-4xl mx-auto"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <motion.div 
            className="bg-white rounded-lg shadow mb-6 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex overflow-x-auto">
                <motion.button
                  onClick={() => setActiveTab('recent')}
                  className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${montserrat.className} ${
                    activeTab === 'recent'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Recent
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab('trending')}
                  className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${montserrat.className} ${
                    activeTab === 'trending'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Trending
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab('trusted')}
                  className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${montserrat.className} ${
                    activeTab === 'trusted'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  From Trusted Authors
                </motion.button>
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              className="grid grid-cols-1 gap-6 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="md:w-1/3">
          <motion.div 
            className="bg-white rounded-lg shadow overflow-hidden mb-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="p-4 border-b border-gray-200">
              <h2 className={`font-bold text-gray-800 ${playfair.className}`}>Popular Topics</h2>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {topics.map((topic, index) => (
                  <motion.a
                    key={topic.id}
                    href={`?view=topic&id=${topic.id}`}
                    className={`px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full hover:bg-gray-200 ${montserrat.className}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * index, duration: 0.3 }}
                    whileHover={{ scale: 1.1, backgroundColor: '#EEF2FF', color: '#4F46E5' }}
                  >
                    {topic.name}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-lg shadow overflow-hidden mb-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="p-4 border-b border-gray-200">
              <h2 className={`font-bold text-gray-800 ${playfair.className}`}>Trusted Authors</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {users
                  .filter((user) => user.isTrusted)
                  .map((user, index) => (
                    <motion.a
                      key={user.id}
                      href={`?view=profile&id=${user.id}`}
                      className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-md"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                      whileHover={{ x: 5, backgroundColor: '#F9FAFB' }}
                    >
                      <motion.img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      />
                      <div>
                        <p className={`font-medium ${montserrat.className}`}>{user.name}</p>
                        <p className={`text-sm text-gray-500 ${inter.className}`}>
                          {user.followers.toLocaleString()} followers
                        </p>
                      </div>
                    </motion.a>
                  ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Main App Component
const InnerPage = () => {
  const searchParams = useSearchParams();
  const view = searchParams?.get('view') || 'home';
  const id = searchParams?.get('id') || '';

  return (
    <AuthProvider>
      <AppProvider>
        <AlertProvider>
          <div className={`min-h-screen bg-gray-100 ${inter.variable} ${playfair.variable} ${montserrat.variable} flex flex-col`}>
            <Navbar />
            <main className="pt-20 pb-10 px-4 flex-grow">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${view}-${id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  {view === 'article' && <ArticleDetail articleId={id} />}
                  {view === 'profile' && <Profile userId={id} />}
                  {view === 'topics' && <TopicsView />}
                  {view === 'topic' && <TopicView topicId={id} />}
                  {view === 'create' && <CreateArticle />}
                  {view === 'home' && <HomePage />}
                </motion.div>
              </AnimatePresence>
            </main>
            <footer className="bg-white py-6 border-t border-gray-200 mt-auto">
              <div className="max-w-7xl mx-auto px-4">
                <motion.p 
                  className={`text-center text-gray-500 text-sm ${montserrat.className}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  &copy; 2025 Alexia. All rights reserved.
                </motion.p>
              </div>
            </footer>
          </div>
        </AlertProvider>
      </AppProvider>
    </AuthProvider>
  );
}

const Page = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div 
          className="h-16 w-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"
        />
      </div>
    }>
      <InnerPage/>
    </Suspense>
  );
}

export default Page