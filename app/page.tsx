"use client";
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Poppins } from 'next/font/google';
import {
    Menu,
    X,
    Star,
    TrendingUp,
    Users,
    Calendar,
    Eye,
    ThumbsUp,
    Share2,
    Plus,
    LogIn,
    LogOut,
    User,
    CheckCircle,
    AlertCircle,
    Search,
    Filter,
    ChevronDown,
    Heart,
    MessageCircle,
    Bookmark,
    Award,
    Target,
    Zap,
    Code,
    Coffee,
    Briefcase,
    Heart as HeartIcon,
    Globe,
    Clock,
    UserPlus,
    Settings,
    Bell,
    BookOpen,
    Lightbulb,
    Shield,
    Smartphone,
    ArrowRight,
    Quote,
    Check,
    HelpCircle,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    SortAsc,
    Copy,
    ExternalLink,
    MoreHorizontal
} from 'lucide-react';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    display: 'swap',
});

interface Recommendation {
    id: string;
    title: string;
    description: string;
    category: string;
    author: string;
    date: string;
    likes: number;
    views: number;
    image: string;
    tags: string[];
    liked: boolean;
    bookmarked: boolean;
    featured?: boolean;
    verified?: boolean;
    readTime?: string;
}

interface User {
    email: string;
    name: string;
    avatar: string;
    joinDate: string;
    reputation: number;
}

interface LoginForm {
    email: string;
    password: string;
}

interface RecommendationForm {
    title: string;
    description: string;
    category: string;
    tags: string;
    image?: File | null;
}

const DailyRecommendatations: React.FC = () => {
    // Authentication state
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
    const [authMessage, setAuthMessage] = useState<string>('');
    const [isClient, setIsClient] = useState(false)
    // UI state
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [activeView, setActiveView] = useState<'all' | 'bookmarks' | 'trending'>('all');
    const [showLoginPrompt, setShowLoginPrompt] = useState<boolean>(false);
    const [showShareModal, setShowShareModal] = useState<string | null>(null);
    const [showDetailModal, setShowDetailModal] = useState<string | null>(null);

    // Form states
    const [loginForm, setLoginForm] = useState<LoginForm>({ email: '', password: '' });
    const [recommendationForm, setRecommendationForm] = useState<RecommendationForm>({
        title: '', description: '', category: 'tech', tags: '', image: null
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Data state
    const [recommendations, setRecommendations] = useState<Recommendation[]>([
        {
            id: '1',
            title: 'Revolutionary AI Code Assistant',
            description: 'This AI-powered coding assistant has transformed my development workflow. It provides intelligent suggestions, explains complex code, and helps debug issues in real-time. The accuracy is incredible and it saves me hours every day.',
            category: 'tech',
            author: 'Sarah Chen',
            date: '2025-05-24',
            likes: 142,
            views: 1205,
            image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop',
            tags: ['AI', 'Development', 'Productivity'],
            liked: false,
            bookmarked: false,
            featured: true,
            verified: true,
            readTime: '3 min read'
        },
        {
            id: '2',
            title: 'Mindfulness App for Busy Professionals',
            description: 'Found this amazing meditation app designed specifically for professionals. Short 5-minute sessions that fit perfectly into busy schedules. The guided meditations are expertly crafted and the progress tracking keeps you motivated.',
            category: 'wellness',
            author: 'Marcus Johnson',
            date: '2025-05-23',
            likes: 189,
            views: 1456,
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
            tags: ['Meditation', 'Wellness', 'Productivity'],
            liked: false,
            bookmarked: false,
            verified: true,
            readTime: '2 min read'
        },
        {
            id: '3',
            title: 'Sustainable Coffee Brand',
            description: 'Discovered this incredible coffee company that sources directly from farmers and uses 100% recyclable packaging. The taste is exceptional too! They support local communities and their transparency about sourcing is refreshing.',
            category: 'lifestyle',
            author: 'Emma Rodriguez',
            date: '2025-05-22',
            likes: 203,
            views: 1891,
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=300&fit=crop',
            tags: ['Sustainability', 'Coffee', 'Ethical'],
            liked: false,
            bookmarked: false,
            readTime: '4 min read'
        },
        {
            id: '4',
            title: 'Project Management Tool Revolution',
            description: 'This new project management platform combines Kanban boards, time tracking, and team collaboration in one seamless interface. Game-changer for remote teams! The integrations are seamless and the UI is incredibly intuitive.',
            category: 'business',
            author: 'David Kim',
            date: '2025-05-21',
            likes: 167,
            views: 1432,
            image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop',
            tags: ['Project Management', 'Team Collaboration', 'Remote Work'],
            liked: false,
            bookmarked: true,
            featured: true,
            verified: true,
            readTime: '5 min read'
        },
        {
            id: '5',
            title: 'Smart Home Security System',
            description: 'Comprehensive home security with AI-powered threat detection, mobile alerts, and integration with all major smart home platforms. The installation was surprisingly easy and the app interface is fantastic.',
            category: 'tech',
            author: 'Lisa Wang',
            date: '2025-05-20',
            likes: 234,
            views: 1987,
            image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=500&h=300&fit=crop',
            tags: ['Smart Home', 'Security', 'IoT'],
            liked: false,
            bookmarked: false,
            readTime: '3 min read'
        },
        {
            id: '6',
            title: 'Eco-Friendly Workout Gear',
            description: 'Sustainable fitness equipment made from recycled materials. High quality, durable, and helps reduce environmental impact while staying fit. The resistance bands are particularly impressive in terms of durability.',
            category: 'wellness',
            author: 'Alex Rivera',
            date: '2025-05-19',
            likes: 176,
            views: 1254,
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop',
            tags: ['Fitness', 'Sustainability', 'Equipment'],
            liked: false,
            bookmarked: false,
            readTime: '2 min read'  
        },
        {
            id: '7',
            title: 'Personal Finance Management App',
            description: 'Revolutionary budgeting app that uses AI to categorize expenses and provide personalized savings recommendations. The insights dashboard helps you understand spending patterns like never before.',
            category: 'business',
            author: 'Jennifer Martinez',
            date: '2025-05-18',
            likes: 198,
            views: 1456,
            image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=300&fit=crop',
            tags: ['Finance', 'AI', 'Personal Growth'],
            liked: false,
            bookmarked: false,
            verified: true,
            readTime: '4 min read'
        },
        {
            id: '8',
            title: 'Language Learning Platform',
            description: 'Interactive language learning with native speakers through video calls. The conversation practice sessions are incredibly effective and the cultural exchange aspect makes it enjoyable.',
            category: 'lifestyle',
            author: 'Roberto Silva',
            date: '2025-05-17',
            likes: 212,
            views: 1623,
            image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&h=300&fit=crop',
            tags: ['Education', 'Language', 'Communication'],
            liked: false,
            bookmarked: true,
            readTime: '3 min read'
        },
        {
            id: '9',
            title: 'Advanced Note-Taking System',
            description: 'This note-taking app combines mind mapping, traditional notes, and AI-powered organization. Perfect for researchers, students, and professionals who need to organize complex information efficiently.',
            category: 'tech',
            author: 'Michael Zhang',
            date: '2025-05-16',
            likes: 156,
            views: 1123,
            image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=500&h=300&fit=crop',
            tags: ['Productivity', 'Organization', 'AI'],
            liked: false,
            bookmarked: false,
            readTime: '4 min read'
        },
        {
            id: '10',
            title: 'Collaborative Design Platform',
            description: 'Revolutionary design tool that lets teams collaborate in real-time with version control, commenting, and seamless handoff to developers. The learning curve is minimal and the results are professional.',
            category: 'business',
            author: 'Sophie Williams',
            date: '2025-05-15',
            likes: 289,
            views: 2134,
            image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=500&h=300&fit=crop',
            tags: ['Design', 'Collaboration', 'UI/UX'],
            liked: false,
            bookmarked: false,
            verified: true,
            readTime: '6 min read'
        },
        {
            id: '11',
            title: 'Virtual Fitness Trainer',
            description: 'AI-powered personal trainer that adapts workouts based on your progress, space, and equipment. The form correction feature using computer vision is incredibly accurate and helpful.',
            category: 'wellness',
            author: 'Carlos Rodriguez',
            date: '2025-05-14',
            likes: 143,
            views: 1087,
            image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&h=300&fit=crop',
            tags: ['Fitness', 'AI', 'Health'],
            liked: false,
            bookmarked: false,
            readTime: '3 min read'
        },
        {
            id: '12',
            title: 'Automated Investment Platform',
            description: 'Smart investment platform that uses machine learning to optimize portfolios automatically. Great for beginners and busy professionals who want to invest without constant monitoring.',
            category: 'business',
            author: 'Rachel Kim',
            date: '2025-05-13',
            likes: 234,
            views: 1789,
            image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&h=300&fit=crop',
            tags: ['Finance', 'Investment', 'Automation'],
            liked: false,
            bookmarked: false,
            verified: true,
            readTime: '5 min read'
        }
    ]);

    // Category configuration
    const categories = [
        { id: 'all', name: 'All', icon: Globe, color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
        { id: 'tech', name: 'Technology', icon: Code, color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
        { id: 'wellness', name: 'Wellness', icon: HeartIcon, color: 'bg-green-100 text-green-700 hover:bg-green-200' },
        { id: 'lifestyle', name: 'Lifestyle', icon: Coffee, color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
        { id: 'business', name: 'Business', icon: Briefcase, color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' }
    ];

    // Smooth scroll function
    const smoothScrollTo = useCallback((elementId: string, offset: number = 0) => {
        const element = document.getElementById(elementId);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, []);

    // Navigation handlers with smooth scroll
    const handleNavigation = useCallback((view: 'all' | 'bookmarks' | 'trending', scrollTarget?: string) => {
        setActiveView(view);
        setIsMobileMenuOpen(false);

        if (scrollTarget) {
            // Add a small delay to ensure state updates are processed
            setTimeout(() => {
                smoothScrollTo(scrollTarget, 80); // 80px offset for fixed navbar
            }, 100);
        } else {
            // Default scroll to main content
            setTimeout(() => {
                smoothScrollTo('main-content', 80);
            }, 100);
        }
    }, [smoothScrollTo]);

    // Get default image for category
    const getDefaultImageForCategory = (category: string): string => {
        const imageMap: Record<string, string> = {
            tech: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop',
            wellness: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=300&fit=crop',
            lifestyle: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=300&fit=crop',
            business: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop'
        };
        return imageMap[category] || 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&h=300&fit=crop';
    };

    // Memoized filtered and sorted recommendations
    const filteredRecommendations = useMemo(() => {
        let filtered = recommendations;

        // Filter by view type
        if (activeView === 'bookmarks') {
            filtered = filtered.filter(rec => rec.bookmarked);
        } else if (activeView === 'trending') {
            filtered = filtered.filter(rec => rec.views > 1800 || rec.likes > 233);
        }

        // Filter by category
        if (activeFilter !== 'all') {
            filtered = filtered.filter(rec => rec.category === activeFilter);
        }

        // Sort by featured first, then by newest
        return filtered.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    }, [recommendations, activeFilter, activeView]);

    const topContributors = useMemo(() => {
        const contributors = recommendations.reduce((acc, rec) => {
            if (!acc[rec.author]) {
                acc[rec.author] = { name: rec.author, posts: 0, totalLikes: 0 };
            }
            acc[rec.author].posts += 1;
            acc[rec.author].totalLikes += rec.likes;
            return acc;
        }, {} as Record<string, { name: string; posts: number; totalLikes: number }>);

        return Object.values(contributors)
            .sort((a, b) => b.totalLikes - a.totalLikes)
            .slice(0, 5);
    }, [recommendations]);

    useEffect(() => {
        if (!isClient) {
            setIsClient(true)
        }
    }, [])

    useEffect(() => {
        const shouldLockScroll = showLoginModal || showAddModal || showShareModal !== null || isMobileMenuOpen || showDetailModal !== null;

        if (shouldLockScroll) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [showLoginModal, showAddModal, showShareModal, isMobileMenuOpen, showDetailModal]);

    // Auto-hide messages
    useEffect(() => {
        if (authMessage) {
            const timer = setTimeout(() => setAuthMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [authMessage]);

    useEffect(() => {
        if (showLoginPrompt) {
            const timer = setTimeout(() => setShowLoginPrompt(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showLoginPrompt]);

    // Validation functions
    const validateLoginForm = useCallback((): boolean => {
        const errors: Record<string, string> = {};

        if (!loginForm.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
            errors.email = 'Email is invalid';
        }

        if (!loginForm.password) {
            errors.password = 'Password is required';
        } else if (loginForm.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }, [loginForm]);

    const validateRecommendationForm = useCallback((): boolean => {
        const errors: Record<string, string> = {};

        if (!recommendationForm.title.trim()) {
            errors.title = 'Title is required';
        } else if (recommendationForm.title.length < 3) {
            errors.title = 'Title must be at least 3 characters';
        }

        if (!recommendationForm.description.trim()) {
            errors.description = 'Description is required';
        } else if (recommendationForm.description.length < 10) {
            errors.description = 'Description must be at least 10 characters';
        }

        if (!recommendationForm.tags.trim()) {
            errors.tags = 'At least one tag is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }, [recommendationForm]);

    // Event handlers
    const handleLogin = useCallback(() => {
        if (!validateLoginForm()) return;

        // Accept any valid email/password combination
        setIsLoggedIn(true);
        setCurrentUser({
            email: loginForm.email,
            name: loginForm.email.split('@')[0], // Use part before @ as name
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            joinDate: new Date().toISOString().split('T')[0],
            reputation: 1250
        });
        setShowLoginModal(false);
        setAuthMessage('Successfully logged in!');
        setLoginForm({ email: '', password: '' });
        setFormErrors({});
    }, [loginForm, validateLoginForm]);

    const handleLogout = useCallback(() => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setAuthMessage('Successfully logged out!');
        setActiveView('all');
        
        // Reset all liked and bookmarked states when logging out
        setRecommendations(prev =>
            prev.map(rec => ({
                ...rec,
                liked: false,
                bookmarked: false
            }))
        );
    }, []);

    const handleAddRecommendation = useCallback(() => {
        if (!validateRecommendationForm()) return;

        // Handle image - convert to URL if file is provided, otherwise use default
        let imageUrl = getDefaultImageForCategory(recommendationForm.category);
        if (recommendationForm.image) {
            imageUrl = URL.createObjectURL(recommendationForm.image);
        }

        const newRecommendation: Recommendation = {
            id: Date.now().toString(),
            title: recommendationForm.title,
            description: recommendationForm.description,
            category: recommendationForm.category,
            author: currentUser?.name || 'Anonymous',
            date: new Date().toISOString().split('T')[0],
            likes: 0,
            views: 0,
            image: imageUrl,
            tags: recommendationForm.tags.split(',').map(tag => tag.trim()),
            liked: false,
            bookmarked: false,
            readTime: '2 min read'
        };

        setRecommendations(prev => [newRecommendation, ...prev]);
        setShowAddModal(false);
        setRecommendationForm({ title: '', description: '', category: 'tech', tags: '', image: null });
        setFormErrors({});
        setAuthMessage('Recommendation added successfully!');
    }, [recommendationForm, currentUser, validateRecommendationForm]);

    const toggleLike = useCallback((id: string) => {
        if (!isLoggedIn) {
            setShowLoginPrompt(true);
            return;
        }

        setRecommendations(prev =>
            prev.map(rec =>
                rec.id === id
                    ? { ...rec, liked: !rec.liked, likes: rec.liked ? rec.likes - 1 : rec.likes + 1 }
                    : rec
            )
        );
    }, [isLoggedIn]);

    const toggleBookmark = useCallback((id: string) => {
        if (!isLoggedIn) {
            setShowLoginPrompt(true);
            return;
        }

        setRecommendations(prev =>
            prev.map(rec =>
                rec.id === id ? { ...rec, bookmarked: !rec.bookmarked } : rec
            )
        );
    }, [isLoggedIn]);

    const handleShare = useCallback((id: string) => {
        setShowShareModal(id);
    }, []);

    const handleCardClick = useCallback((id: string) => {
        setShowDetailModal(id);
    }, []);

    const copyToClipboard = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setAuthMessage('Link copied to clipboard!');
            setShowShareModal(null);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }, []);

    const handleKeyPress = useCallback((e: React.KeyboardEvent, action: () => void) => {
        if (e.key === 'Enter') {
            action();
        }
    }, []);

    if (!isClient) {
        return "";
    }

    return (
        <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ${poppins.className}`}>
            {/* Auth Message */}
            {authMessage && (
                <div className="fixed top-4 right-4 z-[70] bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in">
                    <CheckCircle size={18} />
                    {authMessage}
                </div>
            )}

            {/* Login Prompt */}
            {showLoginPrompt && (
                <div className="fixed top-4 right-4 z-[70] bg-amber-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in">
                    <AlertCircle size={18} />
                    Please login to interact with posts
                </div>
            )}

            {/* Navigation */}
            <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => smoothScrollTo('hero', 0)}>
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                <Star className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                DailyFind
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => handleNavigation('all', 'main-content')}
                                    className={`font-medium transition-colors cursor-pointer ${activeView === 'all' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                                >
                                    Discover
                                </button>
                                <button
                                    onClick={() => handleNavigation('trending', 'main-content')}
                                    className={`font-medium transition-colors flex items-center gap-1 cursor-pointer ${activeView === 'trending' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                                >
                                    <TrendingUp size={16} />
                                    Trending
                                </button>
                                {isLoggedIn && (
                                    <button
                                        onClick={() => handleNavigation('bookmarks', 'main-content')}
                                        className={`font-medium transition-colors flex items-center gap-1 cursor-pointer ${activeView === 'bookmarks' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                                    >
                                        <Bookmark size={16} />
                                        Bookmarks
                                    </button>
                                )}
                                {/* Additional nav links */}
                                <button
                                    onClick={() => smoothScrollTo('how-it-works', 80)}
                                    className="font-medium text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                                >
                                    How It Works
                                </button>
                                <button
                                    onClick={() => smoothScrollTo('features', 80)}
                                    className="font-medium text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                                >
                                    Features
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                {isLoggedIn ? (
                                    <>
                                        <button
                                            onClick={() => setShowAddModal(true)}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium cursor-pointer hover:scale-105"
                                        >
                                            <Plus size={18} />
                                            Add Recommendation
                                        </button>
                                        <div className="flex items-center gap-2  "  >
                                            <img
                                                src={currentUser?.avatar}
                                                alt={currentUser?.name}
                                                className="w-8 h-8 rounded-full object-cover shadow-md"
                                            />
                                            <div className="text-left">
                                                <div className="text-sm font-medium text-gray-900">{currentUser?.name}</div>
                                                <div className="text-xs text-gray-500">{currentUser?.reputation} pts</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="text-gray-600 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                                        >
                                            <LogOut size={18} />
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setShowLoginModal(true)}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium cursor-pointer hover:scale-105"
                                    >
                                        <LogIn size={18} />
                                        Login
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200 animate-slide-down shadow-lg">
                        <div className="px-4 py-4 space-y-4">
                            <button
                                onClick={() => handleNavigation('all', 'main-content')}
                                className={`block w-full text-left font-medium transition-colors cursor-pointer ${activeView === 'all' ? 'text-blue-600' : 'text-gray-700'}`}
                            >
                                Discover
                            </button>
                            <button
                                onClick={() => handleNavigation('trending', 'main-content')}
                                className={`block w-full text-left font-medium transition-colors flex items-center gap-1 cursor-pointer ${activeView === 'trending' ? 'text-blue-600' : 'text-gray-700'}`}
                            >
                                <TrendingUp size={16} />
                                Trending
                            </button>
                            {isLoggedIn && (
                                <button
                                    onClick={() => handleNavigation('bookmarks', 'main-content')}
                                    className={`block w-full text-left font-medium transition-colors flex items-center gap-1 cursor-pointer ${activeView === 'bookmarks' ? 'text-blue-600' : 'text-gray-700'}`}
                                >
                                    <Bookmark size={16} />
                                    Bookmarks
                                </button>
                            )}
                            <button
                                onClick={() => { smoothScrollTo('how-it-works', 80); setIsMobileMenuOpen(false); }}
                                className="block w-full text-left font-medium text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                            >
                                How It Works
                            </button>
                            <button
                                onClick={() => { smoothScrollTo('features', 80); setIsMobileMenuOpen(false); }}
                                className="block w-full text-left font-medium text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                            >
                                Features
                            </button>

                            <div className="pt-4 border-t border-gray-200">
                                {isLoggedIn ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={currentUser?.avatar}
                                                alt={currentUser?.name}
                                                className="w-8 h-8 rounded-full object-cover shadow-md"
                                            />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{currentUser?.name}</div>
                                                <div className="text-xs text-gray-500">{currentUser?.reputation} pts</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => { setShowAddModal(true); setIsMobileMenuOpen(false); }}
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium cursor-pointer"
                                        >
                                            <Plus size={18} />
                                            Add Recommendation
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                        >
                                            <LogOut size={18} />
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => { setShowLoginModal(true); setIsMobileMenuOpen(false); }}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium cursor-pointer"
                                    >
                                        <LogIn size={18} />
                                        Login
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                    <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-400/10 rounded-full blur-xl"></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                            Discover Amazing Things
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 pb-4">
                                Every Single Day
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto animate-fade-in-delay">
                            Join our community of innovators sharing the coolest discoveries, tools, and insights that make life better.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-delay">
                            <button
                                onClick={() => setShowLoginModal(true)}
                                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-8 py-3 rounded-lg font-bold hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-105"
                            >
                                Start Discovering
                            </button>
                            <button
                                onClick={() => smoothScrollTo('how-it-works', 80)}
                                className="border-2 border-white/30 text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-all duration-200 cursor-pointer backdrop-blur-sm"
                            >
                                Learn More
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-8 mt-12">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-400">2.5K+</div>
                                <div className="text-blue-200">Recommendations</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-400">15K+</div>
                                <div className="text-blue-200">Active Users</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-400">98%</div>
                                <div className="text-blue-200">Satisfaction</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-400">24/7</div>
                                <div className="text-blue-200">Discovery</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How DailyFind Works</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Simple steps to discover and share amazing recommendations
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Search className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Explore</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Browse through curated recommendations from industry experts and discover tools that can transform your workflow.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Users className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Connect</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Join a community of like-minded professionals sharing their best discoveries and insights.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Share2 className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Share</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Contribute your own amazing finds and help others discover tools that can improve their lives.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose DailyFind?</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            The most trusted platform for discovering life-changing tools, resources, and insights
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Instant Discovery</h3>
                            <p className="text-gray-600 leading-relaxed">Find amazing tools and resources curated by professionals worldwide, saving you hours of research.</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Expert Community</h3>
                            <p className="text-gray-600 leading-relaxed">Connect with industry leaders and early adopters sharing their best finds and insights.</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Personalized</h3>
                            <p className="text-gray-600 leading-relaxed">AI-powered recommendations tailored to your interests and profession for maximum relevance.</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Verified Quality</h3>
                            <p className="text-gray-600 leading-relaxed">All recommendations are verified by our community and experts to ensure high quality and relevance.</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Smartphone className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Mobile Ready</h3>
                            <p className="text-gray-600 leading-relaxed">Access your discoveries anywhere with our fully responsive design and mobile-optimized experience.</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Learning Hub</h3>
                            <p className="text-gray-600 leading-relaxed">Not just recommendations - learn why tools work and how to implement them effectively.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
                        <p className="text-xl text-gray-600">Trusted by thousands of professionals worldwide</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <Quote className="w-8 h-8 text-blue-600 mb-4" />
                            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                                "DailyFind has completely transformed how I discover new tools. I've found at least 5 game-changing apps in the past month alone!"
                            </p>
                            <div className="flex items-center">
                                <img
                                    src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop"
                                    alt="Sarah Johnson"
                                    className="w-12 h-12 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <div className="font-semibold text-gray-900">Sarah Johnson</div>
                                    <div className="text-gray-600 text-sm">Product Manager, TechCorp</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <Quote className="w-8 h-8 text-purple-600 mb-4" />
                            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                                "The quality of recommendations here is unmatched. Every suggestion I've tried has been incredibly valuable for my business."
                            </p>
                            <div className="flex items-center">
                                <img
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
                                    alt="Michael Chen"
                                    className="w-12 h-12 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <div className="font-semibold text-gray-900">Michael Chen</div>
                                    <div className="text-gray-600 text-sm">Startup Founder</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <Quote className="w-8 h-8 text-green-600 mb-4" />
                            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                                "I love how the community shares not just what to use, but why it works. It's like having a team of consultants at your fingertips."
                            </p>
                            <div className="flex items-center">
                                <img
                                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
                                    alt="Emily Rodriguez"
                                    className="w-12 h-12 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <div className="font-semibold text-gray-900">Emily Rodriguez</div>
                                    <div className="text-gray-600 text-sm">Marketing Director</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search and Filter Section */}
            <section id="search-section" className="bg-gray-50 py-8 border-y border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
                        {/* Category Filters */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {categories.map((category) => {
                                const IconComponent = category.icon;
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveFilter(category.id)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 cursor-pointer ${activeFilter === category.id
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : category.color + ' shadow-sm'
                                            }`}
                                    >
                                        <IconComponent size={16} />
                                        {category.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Enhanced Sidebar - Now on the left */}
                    <div className="space-y-8 lg:order-1">
                        {/* Popular Tags */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Lightbulb className="text-purple-500" size={20} />
                                Popular Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {Array.from(new Set(recommendations.flatMap(rec => rec.tags)))
                                    .sort((a, b) => {
                                        const aCount = recommendations.filter(rec => rec.tags.includes(a)).length;
                                        const bCount = recommendations.filter(rec => rec.tags.includes(b)).length;
                                        return bCount - aCount;
                                    })
                                    .slice(0, 12)
                                    .map((tag) => {
                                        const count = recommendations.filter(rec => rec.tags.includes(tag)).length;
                                        return (
                                            <button
                                                key={tag}
                                                className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 px-3 py-2 rounded-lg text-sm hover:from-blue-100 hover:to-purple-100 transition-all cursor-pointer border border-blue-100 hover:border-purple-200 text-center"
                                            >
                                                #{tag} ({count})
                                            </button>
                                        );
                                    })}
                            </div>
                        </div>

                        {/* Top Contributors */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Award className="text-yellow-500" size={20} />
                                Top Contributors
                            </h3>
                            <div className="space-y-4">
                                {topContributors.map((contributor, index) => (
                                    <div key={contributor.name} className="flex items-center gap-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                        <div className={`text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center ${index === 0 ? 'bg-yellow-400 text-yellow-900' :
                                            index === 1 ? 'bg-gray-300 text-gray-700' :
                                                index === 2 ? 'bg-orange-400 text-orange-900' :
                                                    'bg-gray-100 text-gray-600'
                                            }`}>
                                            #{index + 1}
                                        </div>
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                            {contributor.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold text-gray-900">{contributor.name}</div>
                                            <div className="text-xs text-gray-500">{contributor.posts} posts</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Platform Stats */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <TrendingUp className="text-green-500" size={20} />
                                Platform Stats
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 flex items-center gap-2">
                                        <BookOpen size={16} />
                                        Total Posts
                                    </span>
                                    <span className="font-bold text-gray-900">{recommendations.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 flex items-center gap-2">
                                        <Heart size={16} />
                                        Total Likes
                                    </span>
                                    <span className="font-bold text-red-500">
                                        {recommendations.reduce((sum, rec) => sum + rec.likes, 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 flex items-center gap-2">
                                        <Eye size={16} />
                                        Total Views
                                    </span>
                                    <span className="font-bold text-blue-600">
                                        {recommendations.reduce((sum, rec) => sum + rec.views, 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 flex items-center gap-2">
                                        <Users size={16} />
                                        Active Today
                                    </span>
                                    <span className="font-bold text-green-600">1.2K users</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Clock className="text-blue-500" size={20} />
                                Recent Activity
                            </h3>
                            <div className="space-y-4">
                                {recommendations
                                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                    .slice(0, 5)
                                    .map((rec) => (
                                        <div key={rec.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                            <img
                                                src={rec.image}
                                                alt={rec.title}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-900 truncate">{rec.title}</div>
                                                <div className="text-xs text-gray-500">by {rec.author} • {rec.date}</div>
                                            </div>
                                            <button
                                                onClick={() => toggleLike(rec.id)}
                                                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all duration-200 cursor-pointer ${rec.liked
                                                    ? 'text-red-500 bg-red-50 hover:bg-red-100'
                                                    : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                                                }`}
                                            >
                                                <Heart size={12} fill={rec.liked ? 'currentColor' : 'none'} />
                                                {rec.likes}
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area - Now on the right */}
                    <div className="lg:col-span-3 lg:order-2">
                        {/* View Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    {activeView === 'all' && <><Globe size={24} /> All Recommendations</>}
                                    {activeView === 'trending' && <><TrendingUp size={24} /> Trending Now</>}
                                    {activeView === 'bookmarks' && <><Bookmark size={24} /> Your Bookmarks</>}
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    {filteredRecommendations.length} {filteredRecommendations.length === 1 ? 'recommendation' : 'recommendations'} found
                                </p>
                            </div>
                        </div>

                        {/* Professional Recommendations Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {filteredRecommendations.map((rec, index) => (
                                <article
                                    key={rec.id}
                                    onClick={() => handleCardClick(rec.id)}
                                    className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group animate-fade-in-up border border-gray-100 hover:border-blue-200 flex flex-col h-full cursor-pointer ${rec.featured ? 'ring-2 ring-yellow-400/50 relative' : ''
                                        }`}
                                    style={{ animationDelay: `${index * 100}ms`, cursor: 'pointer' }}
                                >
                                    {rec.featured && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                                <Star size={12} />
                                                Featured
                                            </div>
                                        </div>
                                    )}

                                    <div className="relative overflow-hidden flex-shrink-0">
                                        <img
                                            src={rec.image}
                                            alt={rec.title}
                                            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute top-4 left-4 flex items-center gap-2">
                                            <span className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                                                {rec.category}
                                            </span>
                                            {rec.verified && (
                                                <div className="bg-green-500 text-white p-1 rounded-full">
                                                    <CheckCircle size={12} />
                                                </div>
                                            )}
                                        </div>
                                        {rec.readTime && (
                                            <div className="absolute bottom-4 left-4">
                                                <span className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {rec.readTime}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1 min-h-[3.5rem]">
                                                {rec.title}
                                            </h3>
                                        </div>

                                        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-grow min-h-[4.5rem]">
                                            {rec.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-6 min-h-[2rem]">
                                            {rec.tags.slice(0, 3).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer font-medium flex items-center justify-center"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                            {rec.tags.length > 3 && (
                                                <span className="text-gray-500 text-xs px-2 py-1 text-center">
                                                    +{rec.tags.length - 3} more
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md flex-shrink-0">
                                                    {rec.author.charAt(0)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm font-semibold text-gray-900 truncate">{rec.author}</div>
                                                    <div className="text-xs text-gray-500">{rec.date}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                                <span className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                                    <Eye size={16} />
                                                    {rec.views.toLocaleString()} views
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleLike(rec.id);
                                                    }}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${rec.liked
                                                        ? 'text-red-500 bg-red-50 hover:bg-red-100'
                                                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                                        }`}
                                                >
                                                    <Heart size={16} fill={rec.liked ? 'currentColor' : 'none'} />
                                                    <span className="text-sm font-medium">{rec.likes}</span>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleBookmark(rec.id);
                                                    }}
                                                    className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${rec.bookmarked
                                                        ? 'text-blue-500 bg-blue-50 hover:bg-blue-100'
                                                        : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                                                        }`}
                                                >
                                                    <Bookmark size={16} fill={rec.bookmarked ? 'currentColor' : 'none'} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleShare(rec.id);
                                                    }}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-green-500 hover:bg-green-50 transition-all duration-200 cursor-pointer"
                                                >
                                                    <Share2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {filteredRecommendations.length === 0 && (
                            <div className="text-center py-16">
                                <div className="text-gray-400 mb-6">
                                    {activeView === 'bookmarks' ? <Bookmark size={64} className="mx-auto" /> : <Search size={64} className="mx-auto" />}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    {activeView === 'bookmarks' ? 'No bookmarked posts' : 'No recommendations found'}
                                </h3>
                                <p className="text-gray-600 text-lg">
                                    {activeView === 'bookmarks'
                                        ? 'Start bookmarking posts to see them here!'
                                        : 'Try adjusting your search or filter criteria.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <section id="faq" className="bg-gray-50 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-xl text-gray-600">Everything you need to know about DailyFind</p>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <HelpCircle className="text-blue-600" size={20} />
                                How does DailyFind work?
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                DailyFind is a community-driven platform where professionals share their best tool discoveries. You can browse recommendations, save favorites, and contribute your own finds to help others discover amazing resources.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <HelpCircle className="text-blue-600" size={20} />
                                Is DailyFind free to use?
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Yes! DailyFind is completely free to use. You can browse recommendations, create an account, bookmark posts, and share your own discoveries without any cost.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <HelpCircle className="text-blue-600" size={20} />
                                How are recommendations verified?
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Our community moderates content through upvoting, reviews, and expert verification. Posts with high engagement and positive feedback get featured, ensuring quality recommendations reach more users.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Share Recommendation</h3>
                                <button
                                    onClick={() => setShowShareModal(null)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {(() => {
                                const rec = recommendations.find(r => r.id === showShareModal);
                                if (!rec) return null;

                                return (
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 mb-2">{rec.title}</h4>
                                            <p className="text-gray-600 text-sm line-clamp-2">{rec.description}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{rec.category}</span>
                                                <span className="text-xs text-gray-500">by {rec.author}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <button
                                                onClick={() => copyToClipboard(`${window.location.href}#${rec.id}`)}
                                                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200"
                                            >
                                                <Copy size={20} className="text-gray-600" />
                                                <span className="text-gray-900">Copy Link</span>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    if (navigator.share) {
                                                        navigator.share({
                                                            title: rec.title,
                                                            text: rec.description,
                                                            url: `${window.location.href}#${rec.id}`
                                                        });
                                                    }
                                                    setShowShareModal(null);
                                                }}
                                                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200"
                                            >
                                                <Share2 size={20} className="text-gray-600" />
                                                <span className="text-gray-900">Share via System</span>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(rec.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
                                                    setShowShareModal(null);
                                                }}
                                                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200"
                                            >
                                                <Twitter size={20} className="text-blue-500" />
                                                <span className="text-gray-900">Share on Twitter</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {/* Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                                <button
                                    onClick={() => { setShowLoginModal(false); setFormErrors({}); }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={loginForm.email}
                                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                                        onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${formErrors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your email address"
                                    />
                                    {formErrors.email && (
                                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                            <AlertCircle size={16} />
                                            {formErrors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={loginForm.password}
                                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                                        onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${formErrors.password ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your password"
                                    />
                                    {formErrors.password && (
                                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                            <AlertCircle size={16} />
                                            {formErrors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <p className="text-sm text-blue-800">
                                        Enter any valid email address and password (minimum 6 characters) to sign in.
                                    </p>
                                </div>

                                <button
                                    onClick={handleLogin}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold cursor-pointer hover:scale-105"
                                >
                                    Sign In
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Recommendation Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in max-h-[90vh] overflow-y-auto hide-scrollbar">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">Share Your Discovery</h2>
                                <button
                                    onClick={() => { setShowAddModal(false); setFormErrors({}); }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={recommendationForm.title}
                                        onChange={(e) => setRecommendationForm(prev => ({ ...prev, title: e.target.value }))}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${formErrors.title ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="What amazing thing did you discover?"
                                    />
                                    {formErrors.title && (
                                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                            <AlertCircle size={16} />
                                            {formErrors.title}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        value={recommendationForm.description}
                                        onChange={(e) => setRecommendationForm(prev => ({ ...prev, description: e.target.value }))}
                                        rows={4}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${formErrors.description ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Tell us why this is amazing and how it helps..."
                                    />
                                    {formErrors.description && (
                                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                            <AlertCircle size={16} />
                                            {formErrors.description}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={recommendationForm.category}
                                        onChange={(e) => setRecommendationForm(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                                    >
                                        <option value="tech">Technology</option>
                                        <option value="wellness">Wellness</option>
                                        <option value="lifestyle">Lifestyle</option>
                                        <option value="business">Business</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Upload Image (Optional)
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                setRecommendationForm(prev => ({ ...prev, image: file }));
                                            }}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label htmlFor="image-upload" className="cursor-pointer">
                                            {recommendationForm.image ? (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-center">
                                                        <CheckCircle className="text-green-500" size={24} />
                                                    </div>
                                                    <p className="text-sm text-green-600 font-medium">
                                                        {recommendationForm.image.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Click to change image
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-center">
                                                        <Plus className="text-gray-400" size={24} />
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        Click to upload an image
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG, GIF up to 10MB
                                                    </p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">If no image is uploaded, a relevant image will be automatically added based on your category</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Tags * (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={recommendationForm.tags}
                                        onChange={(e) => setRecommendationForm(prev => ({ ...prev, tags: e.target.value }))}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${formErrors.tags ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="productivity, AI, mobile app, automation"
                                    />
                                    {formErrors.tags && (
                                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                            <AlertCircle size={16} />
                                            {formErrors.tags}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={handleAddRecommendation}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold cursor-pointer hover:scale-105"
                                >
                                    Share Recommendation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in hide-scrollbar relative">
                        {/* Sticky Close Button */}
                        <button
                            onClick={() => setShowDetailModal(null)}
                            className="sticky top-4 right-4 ml-auto mr-4 mt-4 bg-black/40 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/60 transition-all cursor-pointer z-20 shadow-lg block"
                        >
                            <X size={24} />
                        </button>
                        
                        {(() => {
                            const rec = recommendations.find(r => r.id === showDetailModal);
                            if (!rec) return null;

                            return (
                                <div className="relative -mt-16">
                                    {/* Header Image */}
                                    <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
                                        <img
                                            src={rec.image}
                                            alt={rec.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        
                                        {/* Featured Badge */}
                                        {rec.featured && (
                                            <div className="absolute top-4 left-4">
                                                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                                                    <Star size={14} />
                                                    Featured
                                                </div>
                                            </div>
                                        )}

                                        {/* Category and Verified */}
                                        <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                            <span className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                                                {rec.category}
                                            </span>
                                            {rec.verified && (
                                                <div className="bg-green-500 text-white p-1 rounded-full">
                                                    <CheckCircle size={14} />
                                                </div>
                                            )}
                                            {rec.readTime && (
                                                <span className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {rec.readTime}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 md:p-8">
                                        {/* Title and Stats */}
                                        <div className="mb-6">
                                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                                                {rec.title}
                                            </h2>
                                            
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                                                <span className="flex items-center gap-1">
                                                    <Eye size={16} />
                                                    {rec.views.toLocaleString()} views
                                                </span>
                                                <span>{rec.date}</span>
                                            </div>
                                        </div>

                                        {/* Author Info */}
                                        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md">
                                                {rec.author.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-gray-900 text-lg">{rec.author}</div>
                                                <div className="text-gray-600 text-sm">Community Contributor</div>
                                            </div>
                                            {rec.verified && (
                                                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                                    <CheckCircle size={16} />
                                                    Verified
                                                </div>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">About this recommendation</h3>
                                            <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                                                {rec.description}
                                            </p>
                                        </div>

                                        {/* Tags */}
                                        <div className="mb-8">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {rec.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="bg-blue-100 text-blue-800 px-3 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer flex text-center"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleLike(rec.id);
                                                    }}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer font-medium ${rec.liked
                                                        ? 'text-red-500 bg-red-50 hover:bg-red-100'
                                                        : 'text-gray-600 bg-gray-100 hover:text-red-500 hover:bg-red-50'
                                                        }`}
                                                >
                                                    <Heart size={18} fill={rec.liked ? 'currentColor' : 'none'} />
                                                    <span>{rec.likes} Likes</span>
                                                </button>
                                                
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleBookmark(rec.id);
                                                    }}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer font-medium ${rec.bookmarked
                                                        ? 'text-blue-500 bg-blue-50 hover:bg-blue-100'
                                                        : 'text-gray-600 bg-gray-100 hover:text-blue-500 hover:bg-blue-50'
                                                        }`}
                                                >
                                                    <Bookmark size={18} fill={rec.bookmarked ? 'currentColor' : 'none'} />
                                                    <span>{rec.bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                                                </button>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShare(rec.id);
                                                }}
                                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 cursor-pointer font-medium shadow-lg hover:shadow-xl"
                                            >
                                                <Share2 size={18} />
                                                <span>Share</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                    <Star className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold">DailyFind</span>
                            </div>
                            <p className="text-gray-400 mb-6 leading-relaxed">
                                Discover amazing things every day with our community of innovators and early adopters.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                                    <Facebook size={20} />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                                    <Twitter size={20} />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                                    <Instagram size={20} />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-6 text-lg">Product</h3>
                            <ul className="space-y-3 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Features</a></li>
                                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">API</a></li>
                                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Enterprise</a></li>
                                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Mobile App</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-6 text-lg">Company</h3>
                            <ul className="space-y-3 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">About</a></li>
                                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Press</a></li>
                                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Contact</a></li>
                                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Blog</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-6 text-lg">Support</h3>
                            <ul className="space-y-3 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Community</a></li>
                                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Status</a></li>
                                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Documentation</a></li>
                                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Contact Support</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400">&copy; 2025 DailyFind. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">Privacy Policy</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">Terms of Service</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">Cookie Policy</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">GDPR</a>
                        </div>
                    </div>
                </div>
            </footer>

            <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slide-down {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-delay {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in-delay 0.8s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        * {
          cursor: default;
        }

        button, a, input, textarea, select, [role="button"] {
          cursor: pointer !important;
        }

        .cursor-pointer {
          cursor: pointer !important;
        }

        /* Hide scrollbars */
        .hide-scrollbar {
          -ms-overflow-style: none;  /* Internet Explorer 10+ */
          scrollbar-width: none;  /* Firefox */
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;  /* Safari and Chrome */
        }
      `}</style>
        </div>
    );
};

export default DailyRecommendatations;
