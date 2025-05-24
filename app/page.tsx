"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Building2,
  Users,
  Briefcase,
  TrendingUp,
  Globe,
  Phone,
  Mail,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  Award,
  Shield,
  Zap,
  User,
  LogOut,
  Settings,
  Calendar,
  BarChart3,
  FileText,
  Heart,
  MessageSquare,
  Clock,
  Filter,
  SortDesc,
  Eye,
  Download,
  Share2,
  Bookmark,
  ThumbsUp,
  MapPin,
  Link,
  ExternalLink,
  ChevronRight,
  Plus,
  Minus,
  Info,
  HelpCircle,
  BookOpen,
  Video,
  PieChart,
  Target,
  Layers,
  Database,
  Code,
  Lock,
  Cloud,
  Smartphone,
  Monitor,
  Headphones,
  AlertCircle,
  BarChart,
} from "lucide-react";

interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
  icon?: React.ReactNode;
  ref?: React.RefObject<HTMLElement>;
}

interface SearchResult {
  id: string;
  title: string;
  category: string;
  url: string;
  description: string;
  image: string;
  tags: string[];
  date: string;
  views: number;
  rating: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  company: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const NavigationProject: React.FC = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "demo@techcorp.com",
    password: "demo123",
  });
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Navigation state
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [showFullNav, setShowFullNav] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [searchFilter, setSearchFilter] = useState("all");
  const [searchSort, setSearchSort] = useState("relevance");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(
    null
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showDemoBooked, setShowDemoBooked] = useState(false);

  const homeRef = useRef<HTMLElement>(null!);
  const leadersRef = useRef<HTMLElement>(null!);
  const portfolioRef = useRef<HTMLElement>(null!);
  const faqRef = useRef<HTMLElement>(null!);

  const subscribeRef = useRef<HTMLElement>(null!);
  const expertiseRef = useRef<HTMLElement>(null!);
  const clientsRef = useRef<HTMLElement>(null!);
  const businessRef = useRef<HTMLElement>(null!);
  const lastScrollY = useRef(0);
  const searchInputRef = useRef<HTMLInputElement>(null!);
  const searchResultsRef = useRef<HTMLDivElement>(null!);

  // Demo credentials
  const demoUser: User = {
    id: "1",
    name: "John Anderson",
    email: "john.anderson@techcorp.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    role: "Manager",
    company: "TechCorp ",
  };

  // Navigation structure
  const navigationItems: NavigationItem[] = [
    { label: "Home", href: "#home", ref: homeRef },
    { label: "Leaders", href: "#leaders", ref: leadersRef },
    { label: "Portfolio", href: "#portfolio", ref: portfolioRef },
    { label: "FAQ", href: "#faq", ref: faqRef },
    {
      label: "Others",
      href: "#",
      children: [
        {
          label: "Subscribe",
          href: "#",
          icon: <TrendingUp className="w-4 h-4" />,
          ref: subscribeRef,
        },
        {
          label: "Our Expertise",
          href: "#",
          icon: <BarChart className="w-4 h-4" />,
          ref: expertiseRef,
        },
        {
          label: "Clients",
          href: "#",
          icon: <Zap className="w-4 h-4" />,
          ref: clientsRef,
        },
        {
          label: "Business",
          href: "#",
          icon: <Phone className="w-4 h-4" />,
          ref: businessRef,
        },
      ],
    },
  ];

  const scrollToSection = (sectionRef: React.RefObject<HTMLElement>) => {
    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Enhanced search results
  const searchResults: SearchResult[] = [
    {
      id: "1",
      title: "Digital Transformation Strategy Guide 2025",
      category: "Solutions",
      url: "/solutions/digital",
      description:
        "Comprehensive guide to implementing digital transformation in enterprise environments with proven methodologies.",
      image:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      tags: ["Digital", "Strategy", "Enterprise", "Transformation"],
      date: "2025-01-15",
      views: 15420,
      rating: 4.8,
    },
    {
      id: "2",
      title: "Cloud Migration Best Practices",
      category: "Products",
      url: "/products/cloud",
      description:
        "Learn how to migrate your infrastructure to the cloud efficiently with minimal downtime and maximum security.",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      tags: ["Cloud", "Migration", "Infrastructure", "Security"],
      date: "2025-01-10",
      views: 8930,
      rating: 4.9,
    },
    {
      id: "3",
      title: "AI-Powered Analytics Platform",
      category: "Products",
      url: "/products/analytics",
      description:
        "Revolutionary analytics platform that leverages artificial intelligence to provide actionable business insights.",
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      tags: ["AI", "Analytics", "Business Intelligence", "Machine Learning"],
      date: "2025-01-12",
      views: 12650,
      rating: 4.7,
    },
    {
      id: "4",
      title: "Financial Services Security Framework",
      category: "Industries",
      url: "/industries/financial",
      description:
        "Comprehensive security framework designed specifically for financial institutions and regulatory compliance.",
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      tags: ["Finance", "Security", "Compliance", "Banking"],
      date: "2025-01-08",
      views: 6780,
      rating: 4.6,
    },
    {
      id: "5",
      title: "API Management Excellence",
      category: "Products",
      url: "/products/api",
      description:
        "Complete API lifecycle management solution with advanced monitoring, security, and developer tools.",
      image:
        "https://images.unsplash.com/photo-1555949963-ff9fe51c870a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      tags: ["API", "Development", "Integration", "Monitoring"],
      date: "2025-01-05",
      views: 9340,
      rating: 4.8,
    },
    {
      id: "6",
      title: "Enterprise Mobile Solutions",
      category: "Products",
      url: "/products/mobile",
      description:
        "Secure, scalable mobile applications designed for enterprise environments with advanced features.",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      tags: ["Mobile", "Enterprise", "Security", "Apps"],
      date: "2025-01-03",
      views: 7890,
      rating: 4.5,
    },
  ];

  const recentSearches = searchResults.slice(0, 3);
  const popularCategories = [
    "Enterprise Solutions",
    "Cloud Services",
    "Digital Transformation",
    "API Management",
    "Security & Compliance",
    "Analytics",
  ];

  // FAQ Data
  const faqs: FAQ[] = [
    {
      question: "How do I get started with TechCorp's solutions?",
      answer:
        "Getting started is easy! Simply schedule a consultation with our experts, and we'll assess your needs and create a customized implementation plan. Our onboarding process typically takes 2-4 weeks depending on the complexity of your requirements.",
    },
    {
      question: "What security measures do you have in place?",
      answer:
        "We implement enterprise-grade security including end-to-end encryption, multi-factor authentication, regular security audits, and compliance with SOC 2, ISO 27001, and GDPR standards. All data is stored in secure, geographically distributed data centers.",
    },
    {
      question: "Do you offer 24/7 support?",
      answer:
        "Yes, we provide 24/7 support for all enterprise clients with guaranteed response times. Our support team includes technical experts, solution architects, and dedicated account managers to ensure your success.",
    },
    {
      question: "Can your solutions integrate with existing systems?",
      answer:
        "Absolutely! Our platform is designed with integration in mind. We support REST APIs, webhooks, and pre-built connectors for popular enterprise software including Salesforce, SAP, Oracle, and Microsoft products.",
    },
    {
      question: "What is your pricing model?",
      answer:
        "We offer flexible pricing based on your specific needs, including subscription-based models, usage-based pricing, and enterprise licensing. Contact our sales team for a customized quote based on your requirements.",
    },
  ];

  // Notification function
  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  // Authentication functions
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (
      loginForm.email === "demo@techcorp.com" &&
      loginForm.password === "demo123"
    ) {
      setIsAuthenticated(true);
      setUser(demoUser);
      setShowLoginModal(false);
      setLoginForm({ email: "", password: "" });
      showNotificationMessage("Successfully logged in! Welcome back.");
    } else {
      setLoginError(
        "Invalid credentials. Please use demo@techcorp.com / demo123"
      );
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setShowProfileDropdown(false);
    showNotificationMessage("Successfully logged out.");
  };

  // Handle view details
  const handleViewDetails = (result: SearchResult) => {
    setSelectedResult(result);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedResult(null);
  };

  // Newsletter subscription
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setShowSuccessMessage(true);
      setNewsletterEmail("");
    }
  };

  // Demo booking for logged-in users
  const handleDemoBooking = () => {
    if (isAuthenticated && user) {
      // Book demo for authenticated user
      setShowDemoBooked(true);
      showNotificationMessage(`Demo scheduled successfully for ${user.name}! Our team will contact you within 24 hours.`);
      setTimeout(() => setShowDemoBooked(false), 3000);
    } else {
      // Show login modal for non-authenticated users
      setShowLoginModal(true);
    }
  };

  // Navigation click handler
  const handleNavClick = (item: NavigationItem) => {
    if (item.ref) {
      scrollToSection(item.ref);
      setMobileMenuOpen(false);
      setActiveDropdown(null);
    } else if (item.children) {
      handleDropdownToggle(item.label);
    }
  };

  // Scroll detection with throttling - Mobile optimized
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const direction = currentScrollY > lastScrollY.current ? "down" : "up";

    setScrollDirection(direction);
    
    // Mobile-friendly scroll thresholds
    const threshold = window.innerWidth < 768 ? 30 : 50; // Lower threshold for mobile
    
    // Show expanded header when scrolling up or when near top
    setIsScrolledUp(currentScrollY > threshold && direction === "up");
    setShowFullNav((currentScrollY > threshold && direction === "up") || currentScrollY < threshold);

    lastScrollY.current = currentScrollY;
  }, []);

  useEffect(() => {
    let ticking = false;

    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Add both scroll and touch events for better mobile support
    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    window.addEventListener("touchmove", throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
      window.removeEventListener("touchmove", throttledHandleScroll);
    };
  }, [handleScroll]);

  // Search functionality
  const handleSearchOpen = () => {
    setSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      setShowSearchResults(true);
      // Scroll to search results section
      setTimeout(() => {
        searchResultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  // Touch-friendly dropdown handlers
  const handleDropdownToggle = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
      setShowProfileDropdown(false);
    };

    if (activeDropdown || showProfileDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeDropdown, showProfileDropdown]);

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (searchOpen || mobileMenuOpen || showLoginModal || showDetailsModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [searchOpen, mobileMenuOpen, showLoginModal, showDetailsModal]);

  // Filter and sort search results
  const filteredResults = searchResults
    .filter((result) => {
      const matchesQuery =
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesFilter =
        searchFilter === "all" ||
        result.category.toLowerCase() === searchFilter.toLowerCase();
      return matchesQuery && matchesFilter;
    })
    .sort((a, b) => {
      switch (searchSort) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "views":
          return b.views - a.views;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      <div
        className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
          showNotification
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>{notificationMessage}</span>
        </div>
      </div>

      {/* Navigation Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolledUp || showFullNav
            ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between transition-all duration-500 ${
              showFullNav ? "h-16 sm:h-20" : "h-12 sm:h-14"
            }`}
          >
            {/* Logo */}
            <div
              className="flex items-center space-x-2 cursor-pointer transition-all duration-300"
              onClick={() => scrollToSection(homeRef)}
            >
              <div className={`bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 ${
                showFullNav ? "w-10 h-10" : "w-8 h-8"
              }`}>
                <Building2 className={`text-white transition-all duration-300 ${
                  showFullNav ? "w-6 h-6" : "w-5 h-5"
                }`} />
              </div>
              <span className={`font-bold text-gray-900 transition-all duration-300 ${
                showFullNav ? "text-xl opacity-100" : "text-lg opacity-80"
              }`}>TechCorp</span>
            </div>

            {/* Navigation - Desktop only when expanded, mobile uses mobile menu */}
            <nav
              className={`hidden lg:flex items-center space-x-1 transition-all duration-500 ${
                showFullNav
                  ? "opacity-100 scale-100 translate-x-0"
                  : "opacity-0 scale-95 -translate-x-4 pointer-events-none"
              }`}
            >
              {navigationItems.map((item) => (
                <div key={item.label} className="relative group">
                  <button
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 cursor-pointer font-medium transition-colors duration-200 flex items-center space-x-1"
                    onClick={() => handleNavClick(item)}
                  >
                    <span>{item.label}</span>
                    {item.children && <ChevronDown className="w-4 h-4" />}
                  </button>

                  {/* Desktop Dropdown */}
                  {item.children && (
                    <div
                      className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-300 ${
                        activeDropdown === item.label
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible -translate-y-2"
                      }`}
                    >
                      <div className="py-2">
                        {item.children.map((child) => (
                          <button
                            key={child.label}
                            onClick={() => handleNavClick(child)}
                            className="flex items-center space-x-3 cursor-pointer px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200 w-full text-left"
                          >
                            {child.icon}
                            <span>{child.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions - Mobile optimized spacing and sizing */}
            <div className={`flex items-center transition-all duration-500 ${
              showFullNav ? "space-x-3 opacity-100" : "space-x-2 opacity-60"
            }`}>
              {/* Search Button - Always visible, mobile optimized */}
              <button
                onClick={handleSearchOpen}
                className={`text-gray-600 cursor-pointer hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-200 ${
                  showFullNav ? "p-2" : "p-1.5"
                } min-w-[44px] min-h-[44px] flex items-center justify-center sm:min-w-0 sm:min-h-0`}
              >
                <Search className={`transition-all duration-300 ${
                  showFullNav ? "w-5 h-5" : "w-4 h-4"
                }`} />
              </button>

              {/* User Profile or Login - Mobile responsive */}
              {isAuthenticated && user ? (
                <div className={`relative transition-all duration-300 ${
                  showFullNav ? "opacity-100" : "opacity-60 sm:opacity-100"
                }`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowProfileDropdown(!showProfileDropdown);
                    }}
                    className={`flex items-center cursor-pointer space-x-2 hover:bg-gray-100 rounded-lg transition-all duration-200 ${
                      showFullNav ? "p-2" : "p-1.5"
                    } min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className={`rounded-full object-cover transition-all duration-300 ${
                        showFullNav ? "w-8 h-8" : "w-6 h-6"
                      }`}
                    />
                    {showFullNav && (
                      <>
                        <span className="hidden sm:block text-sm font-medium text-gray-700">
                          {user.name.split(" ")[0]}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
                      </>
                    )}
                  </button>

                  {/* Profile Dropdown - Mobile optimized positioning */}
                  <div
                    className={`absolute top-full right-0 mt-2 w-64 sm:w-72 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-300 ${
                      showProfileDropdown
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2"
                    }`}
                  >
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.role}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.company}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200   ">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 cursor-pointer text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className={`items-center space-x-2 border border-gray-300 text-gray-700 cursor-pointer rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 ${
                    showFullNav 
                      ? "hidden sm:flex px-4 py-2" 
                      : "hidden"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Mobile Menu Button - Always visible on mobile */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-200 ${
                  showFullNav ? "p-2" : "p-1.5"
                } min-w-[44px] min-h-[44px] flex items-center justify-center`}
              >
                {mobileMenuOpen ? (
                  <X className={`transition-all duration-300 ${showFullNav ? "w-6 h-6" : "w-5 h-5"}`} />
                ) : (
                  <Menu className={`transition-all duration-300 ${showFullNav ? "w-6 h-6" : "w-5 h-5"}`} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 w-80 max-w-sm h-full bg-white shadow-xl transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    TechCorp
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-600 hover:text-blue-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile User Profile */}
              {isAuthenticated && user ? (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.role}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowLoginModal(true);
                    }}
                    className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 cursor-pointer px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                </div>
              )}
            </div>

            <nav className="p-6 space-y-2 overflow-y-auto">
              {navigationItems.map((item) => (
                <div key={item.label}>
                  <button
                    className="w-full flex items-center justify-between p-3 text-gray-700 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    onClick={() => handleNavClick(item)}
                  >
                    <span className="font-medium">{item.label}</span>
                    {item.children &&
                      (activeDropdown === item.label ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      ))}
                  </button>

                  {/* Mobile Dropdown */}
                  {item.children && (
                    <div
                      className={`ml-4 space-y-1 transition-all duration-300 overflow-hidden ${
                        activeDropdown === item.label
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      {item.children.map((child) => (
                        <button
                          key={child.label}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            handleNavClick(child);
                          }}
                          className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors duration-200 w-full text-left"
                        >
                          {child.icon}
                          <span>{child.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Auth Actions */}
              {isAuthenticated ? (
                <div className="pt-6 mt-6 border-t border-gray-200 space-y-2">
                  <button
                    onClick={() => showNotificationMessage("Opening dashboard")}
                    className="flex items-center space-x-3 p-3 text-gray-700 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors duration-200 w-full text-left"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={() => showNotificationMessage("Opening settings")}
                    className="flex items-center space-x-3 p-3 text-gray-700 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors duration-200 w-full text-left"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="pt-6 mt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleDemoBooking();
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
                  >
                    <span>{isAuthenticated ? "Schedule Demo" : "Get Started"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          showLoginModal ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowLoginModal(false)}
        />
        <div
          className={`relative w-full max-w-full sm:max-w-lg max-h-[90vh] sm:max-h-[90vh] bg-white rounded-2xl shadow-2xl  overflow-y-auto transition-all duration-300 ${
            showLoginModal
              ? "scale-100 translate-y-0"
              : "scale-95 translate-y-4"
          }`}
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back
              </h2>
              <p className="text-gray-600">
                Sign in to access your TechCorp account
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  placeholder="demo@techcorp.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  placeholder="demo123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-red-800">{loginError}</span>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Demo Credentials
                </h4>
                <p className="text-sm text-blue-800">
                  <strong>Email:</strong> demo@techcorp.com
                  <br />
                  <strong>Password:</strong> demo123
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              >
                Sign In
              </button>
            </form>

            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          searchOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleSearchClose}
        />
        <div
          className={`absolute top-20 left-1/2 transform -translate-x-1/2 w-[95%] sm:w-full sm:max-w-2xl bg-white mx-auto rounded-2xl shadow-2xl transition-all duration-300 ${
            searchOpen ? "translate-y-0 scale-100" : "-translate-y-4 scale-95"
          }`}
        >
          {/* Search Input */}
          <form
            onSubmit={handleSearchSubmit}
            className="p-6 border-b border-gray-200"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
              />
              <button
                type="button"
                onClick={handleSearchClose}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Search Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {searchQuery ? (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Search Results
                </h3>
                <div className="space-y-2">
                  {filteredResults.slice(0, 3).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSearchOpen(false);
                        setShowSearchResults(true);
                        setTimeout(() => {
                          searchResultsRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }, 100);
                      }}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 w-full text-left"
                    >
                      <Search className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.category}
                        </div>
                      </div>
                    </button>
                  ))}
                  {filteredResults.length > 3 && (
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full text-center py-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View all {filteredResults.length} results
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Recent Searches */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Recent Searches
                  </h3>
                  <div className="space-y-2">
                    {recentSearches.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSearchQuery(item.title);
                          setSearchOpen(false);
                          setShowSearchResults(true);
                          setTimeout(() => {
                            searchResultsRef.current?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }, 100);
                        }}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 w-full text-left"
                      >
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.category}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Categories */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Popular Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSearchQuery(category);
                          handleSearchSubmit(new Event("submit") as any);
                        }}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section - Home */}
        <section
          ref={homeRef}
          id="home"
          className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900"
        >
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80"
              alt="Technology background"
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6">
                Transform Your Business with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Advanced Technology
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Leading Fortune 500 companies trust our enterprise solutions to
                drive innovation, enhance productivity, and accelerate digital
                transformation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => scrollToSection(leadersRef)}
                  className="flex items-center cursor-pointer justify-center space-x-2 bg-white text-blue-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Search Results Section */}
        {showSearchResults && (
          <section
            ref={searchResultsRef}
            className="py-16 sm:py-20 bg-gray-100"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Search Results Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Search Results
                  </h2>
                  <button
                    onClick={() => setShowSearchResults(false)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                    <span>Close</span>
                  </button>
                </div>
                <div className="text-sm text-gray-500 mb-6">
                  {filteredResults.length} results for "{searchQuery}"
                </div>

                {/* Search Filters */}
                <div className="flex flex-row gap-2 sm:gap-4">
                  <div className="flex items-center space-x-1 sm:space-x-2 flex-1">
                    <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <select
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full min-w-0"
                    >
                      <option value="all">All Categories</option>
                      <option value="solutions">Solutions</option>
                      <option value="products">Products</option>
                      <option value="industries">Industries</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-1 sm:space-x-2 flex-1">
                    <SortDesc className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <select
                      value={searchSort}
                      onChange={(e) => setSearchSort(e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full min-w-0"
                    >
                      <option value="relevance">Most Relevant</option>
                      <option value="date">Newest First</option>
                      <option value="views">Most Viewed</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Search Results Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map((result) => (
                  <div
                    key={result.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={result.image}
                        alt={result.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
                          {result.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded-lg text-xs">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{result.rating}</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                        {result.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {result.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {result.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{result.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(result.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(result)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredResults.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search terms or filters
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Leaders Section */}
        <section
          ref={leadersRef}
          id="leaders"
          className="py-16 sm:py-20 bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Trusted by Industry Leaders
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Our comprehensive platform delivers enterprise-grade solutions
                that scale with your business needs.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: <Shield className="w-8 h-8 text-blue-600" />,
                  title: "Enterprise Security",
                  description:
                    "Bank-level security with end-to-end encryption and compliance certifications.",
                  image:
                    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                },
                {
                  icon: <Zap className="w-8 h-8 text-blue-600" />,
                  title: "Lightning Performance",
                  description:
                    "Ultra-fast processing with 99.9% uptime and global CDN distribution.",
                  image:
                    "https://images.unsplash.com/photo-1584931423298-c576fda54bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                },
                {
                  icon: <Award className="w-8 h-8 text-blue-600" />,
                  title: "Award-Winning Support",
                  description:
                    "24/7 dedicated support team with industry-leading response times.",
                  image:
                    "https://images.unsplash.com/photo-1553484771-047a44eee27a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group bg-gray-50 rounded-2xl p-6 sm:p-8 hover:bg-white hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative overflow-hidden rounded-xl mb-6">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section
          ref={portfolioRef}
          id="portfolio"
          className="py-16 sm:py-20 bg-gray-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Comprehensive Solutions Portfolio
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                From cloud migration to AI implementation, we provide end-to-end
                solutions tailored to your industry needs.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div>
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Digital solutions"
                  className="w-full rounded-2xl shadow-lg"
                />
              </div>
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    Digital Transformation Excellence
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We help organizations modernize their technology stack,
                    streamline operations, and create new digital revenue
                    streams through innovative solutions.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      icon: <Globe className="w-5 h-5" />,
                      title: "Cloud Migration & Optimization",
                      desc: "Seamless transition to cloud infrastructure",
                    },
                    {
                      icon: <BarChart3 className="w-5 h-5" />,
                      title: "Data Analytics & BI",
                      desc: "Transform data into actionable insights",
                    },
                    {
                      icon: <Zap className="w-5 h-5" />,
                      title: "Process Automation",
                      desc: "Streamline operations with AI-powered automation",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => scrollToSection(expertiseRef)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  <span>Explore Solutions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Details Modal */}
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
            showDetailsModal ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseDetailsModal}
          />
          <div
            className={`relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
              showDetailsModal
                ? "scale-100 translate-y-0"
                : "scale-95 translate-y-4"
            }`}
          >
            {selectedResult && (
              <>
                {/* Modal Header */}
                <div className="relative">
                  <img
                    src={selectedResult.image}
                    alt={selectedResult.title}
                    className="w-full h-48 sm:h-56 lg:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  {/* Close button - top right */}
                  <button
                    onClick={handleCloseDetailsModal}
                    className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors duration-200 z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  {/* Bottom content area - tags and rating */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    {/* Category and Rating row */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg">
                        {selectedResult.category}
                      </span>
                      <div className="flex items-center space-x-1 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm shadow-lg">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span className="font-medium">{selectedResult.rating}</span>
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                      {selectedResult.title}
                    </h2>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 sm:p-8 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="space-y-6 lg:col-span-2">
                      {/* Description */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Overview
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {selectedResult.description}
                        </p>
                        <p className="text-gray-600 leading-relaxed mt-4">
                          Our comprehensive approach ensures seamless
                          integration with your existing systems while providing
                          scalable solutions that grow with your business. With
                          industry-leading security standards and 24/7 support,
                          you can trust our platform to deliver exceptional
                          results.
                        </p>
                      </div>

                      {/* Key Features */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Key Features
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {[
                            {
                              icon: <Shield className="w-5 h-5" />,
                              title: "Enterprise Security",
                              desc: "Bank-level encryption",
                            },
                            {
                              icon: <Zap className="w-5 h-5" />,
                              title: "High Performance",
                              desc: "99.9% uptime guarantee",
                            },
                            {
                              icon: <Users className="w-5 h-5" />,
                              title: "24/7 Support",
                              desc: "Expert assistance",
                            },
                            {
                              icon: <Globe className="w-5 h-5" />,
                              title: "Global Scale",
                              desc: "Worldwide deployment",
                            },
                          ].map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                                {feature.icon}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {feature.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {feature.desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="pb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Related Topics
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedResult.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      {/* Stats */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Statistics
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Eye className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                Views
                              </span>
                            </div>
                            <span className="font-semibold text-gray-900">
                              {selectedResult.views.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                Rating
                              </span>
                            </div>
                            <span className="font-semibold text-gray-900">
                              {selectedResult.rating}/5.0
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                Published
                              </span>
                            </div>
                            <span className="font-semibold text-gray-900">
                              {new Date(
                                selectedResult.date
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="bg-blue-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Need Help?
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Phone className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                Call Sales
                              </div>
                              <div className="text-xs text-gray-600">
                                +1 (555) 123-4567
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Mail className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                Email Support
                              </div>
                              <div className="text-xs text-gray-600">
                                support@techcorp.com
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <MessageSquare className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                Live Chat
                              </div>
                              <div className="text-xs text-gray-600">
                                Available 24/7
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <section ref={faqRef} id="faq" className="py-16 sm:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg sm:text-xl text-gray-600">
                Get answers to common questions about our platform and services.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedFAQ(expandedFAQ === index ? null : index)
                    }
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="font-medium text-gray-900">
                      {faq.question}
                    </span>
                    {expandedFAQ === index ? (
                      <Minus className="w-5 h-5 text-gray-500" />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  <div
                    className={`px-6 overflow-hidden transition-all duration-300 ${
                      expandedFAQ === index ? "max-h-96 pb-4" : "max-h-0"
                    }`}
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() =>
                  showNotificationMessage("Opening support center")
                }
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <HelpCircle className="w-5 h-5" />
                <span>Have more questions? Contact Support</span>
              </button>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 sm:py-20 bg-blue-600" ref={subscribeRef}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                Stay Updated with TechCorp
              </h2>
              <p className="text-lg sm:text-xl text-blue-100">
                Get the latest insights, product updates, and industry trends
                delivered to your inbox.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <form onSubmit={handleNewsletterSubmit}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 bg-white focus:ring-white focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className={`bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 hover:scale-105 ${
                      showSuccessMessage ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Subscribe
                  </button>
                </div>
              </form>

              {/* Success message */}
              {showSuccessMessage && (
                <div className="mt-4 p-4 bg-green-400 text-white rounded-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Successfully subscribed to the newsletter!
                  </span>
                  <button
                    onClick={() => setShowSuccessMessage(false)}
                    className="text-white font-bold"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>

            <p className="text-sm text-blue-200 mt-4">
              No spam, unsubscribe at any time. Read our{" "}
              <button
                onClick={() =>
                  showNotificationMessage("Opening privacy policy")
                }
                className="underline hover:text-white"
              >
                Privacy Policy
              </button>
            </p>
          </div>
        </section>

        {/* Industry Focus */}
        <section className="py-16 sm:py-20 bg-white" ref={expertiseRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Industry-Specific Expertise
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Deep domain knowledge across key industries, delivering
                solutions that understand your unique challenges.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Briefcase className="w-8 h-8" />,
                  title: "Financial Services",
                  description:
                    "Regulatory compliance, risk management, and digital banking solutions.",
                  image:
                    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                  stats: "500+ Banks",
                },
                {
                  icon: <CheckCircle className="w-8 h-8" />,
                  title: "Healthcare",
                  description:
                    "HIPAA-compliant solutions for patient care and operational efficiency.",
                  image:
                    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                  stats: "200+ Hospitals",
                },
                {
                  icon: <Building2 className="w-8 h-8" />,
                  title: "Manufacturing",
                  description:
                    "IoT integration, supply chain optimization, and predictive maintenance.",
                  image:
                    "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                  stats: "300+ Factories",
                },
                {
                  icon: <TrendingUp className="w-8 h-8" />,
                  title: "Retail",
                  description:
                    "Omnichannel experiences, inventory management, and customer analytics.",
                  image:
                    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                  stats: "150+ Retailers",
                },
              ].map((industry, index) => (
                <div
                  key={index}
                  className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={industry.image}
                      alt={industry.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-gray-700">
                      {industry.stats}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-blue-600 mb-3">{industry.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {industry.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {industry.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 sm:py-20 bg-gray-900" ref={clientsRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                What Our Clients Say
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
                Hear from industry leaders who've transformed their businesses
                with our solutions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  quote:
                    "TechCorp's digital transformation strategy helped us increase efficiency by 40% while reducing operational costs significantly.",
                  author: "Sarah Johnson",
                  role: "CTO, Global Finance Corp",
                  avatar:
                    "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                  company: "Fortune 100 Financial Services",
                },
                {
                  quote:
                    "The AI-powered analytics platform provided insights we never thought possible. It's revolutionized our decision-making process.",
                  author: "Michael Chen",
                  role: "VP of Operations, MedTech Solutions",
                  avatar:
                    "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                  company: "Leading Healthcare Provider",
                },
                {
                  quote:
                    "Their cloud migration expertise made our transition seamless. Zero downtime and improved performance across all systems.",
                  author: "Emily Rodriguez",
                  role: "IT Director, RetailMax",
                  avatar:
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                  company: "International Retail Chain",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-2xl p-6 sm:p-8 hover:bg-gray-750 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <blockquote className="text-gray-300 mb-6">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center space-x-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-white">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-gray-400">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-gray-500">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                {
                  number: "500+",
                  label: "Enterprise Clients",
                  sublabel: "Fortune 500 Companies",
                },
                {
                  number: "99.9%",
                  label: "Uptime Guarantee",
                  sublabel: "SLA Commitment",
                },
                {
                  number: "50M+",
                  label: "Transactions Daily",
                  sublabel: "Processed Securely",
                },
                {
                  number: "24/7",
                  label: "Expert Support",
                  sublabel: "Global Coverage",
                },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-blue-100 font-medium">{stat.label}</div>
                  <div className="text-blue-200 text-sm">{stat.sublabel}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-white" ref={businessRef}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-8">
              {isAuthenticated && user 
                ? `Hi ${user.name.split(' ')[0]}! Ready to take the next step with your digital transformation journey?`
                : "Join thousands of companies that trust our platform for their digital transformation journey."
              }
            </p>
            
            {/* Status indicator for logged-in users */}
            {isAuthenticated && user && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 max-w-md mx-auto">
                <div className="flex items-center justify-center space-x-2 text-green-800">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Logged in as {user.name}</span>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleDemoBooking}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2 ${
                  showDemoBooked ? "bg-green-600 hover:bg-green-700" : ""
                }`}
              >
                {showDemoBooked ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Demo Scheduled!</span>
                  </>
                ) : isAuthenticated ? (
                  <>
                    <Calendar className="w-5 h-5" />
                    <span>Schedule Demo</span>
                  </>
                ) : (
                  <span>Schedule Demo</span>
                )}
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">TechCorp</span>
              </div>
              <p className="text-gray-400 mb-6">
                Empowering businesses with cutting-edge technology solutions and
                unparalleled support.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() =>
                    showNotificationMessage("Opening email client")
                  }
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <Mail className="w-5 h-5" />
                </button>
                <button
                  onClick={() => showNotificationMessage("Calling support")}
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <Phone className="w-5 h-5" />
                </button>
                <button
                  onClick={() => showNotificationMessage("Opening location")}
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <MapPin className="w-5 h-5" />
                </button>
              </div>
            </div>

            {[
              {
                title: "Solutions",
                links: [
                  "Enterprise Solutions",
                  "Digital Transformation",
                  "Cloud Services",
                  "Security & Compliance",
                  "AI & Machine Learning",
                ],
              },
              {
                title: "Products",
                links: [
                  "Platform Overview",
                  "Analytics Suite",
                  "API Management",
                  "Mobile Solutions",
                  "Integration Tools",
                ],
              },
              {
                title: "Company",
                links: [
                  "About Us",
                  "Careers",
                  "News & Events",
                  "Contact",
                  "Support",
                ],
              },
            ].map((column, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <button
                        onClick={() =>
                          showNotificationMessage(`Navigating to ${link}`)
                        }
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm text-left"
                      >
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2025 TechCorp. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <button
                onClick={() =>
                  showNotificationMessage("Opening privacy policy")
                }
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                Privacy Policy
              </button>
              <button
                onClick={() =>
                  showNotificationMessage("Opening terms of service")
                }
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                Terms of Service
              </button>
              <button
                onClick={() => showNotificationMessage("Opening cookie policy")}
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NavigationProject;