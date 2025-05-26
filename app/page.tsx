"use client"
import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  Play,
  Pause,
  Heart,
  Share2,
  MessageCircle,
  Users,
  Target,
  Calendar,
  DollarSign,
  Gift,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  User,
  LogOut,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp,
  Shield,
  Award,
  Clock,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link,
  Copy,
  Eye,
  ThumbsUp,
  Bookmark,
  Flag,
  ExternalLink,
  Bell,
  Settings,
  Search,
  Filter,
  Download,
  Upload,
  Camera,
  ArrowRight,
  PlayCircle,
  Users2,
  Zap,
  Globe,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface Video {
  id: string;
  title: string;
  embedId: string;
  thumbnail: string;
  duration: string;
  description: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  amount: number;
  stock: number;
  claimed: number;
  estimatedDelivery: string;
  image: string;
  features: string[];
  popularity: "limited" | "popular" | "early-bird" | null;
}

interface Comment {
  id: string;
  user: User;
  content: string;
  timestamp: Date;
  isSupporter: boolean;
  likes: number;
  replies: Comment[];
  isLiked?: boolean;
}

interface Update {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  image?: string;
  likes: number;
  views: number;
  isLiked?: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  amount?: string;
  comment?: string;
}

interface ProjectStats {
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  averageContribution: number;
  repeatBackers: number;
}

const FundForward: React.FC = () => {
  // Refs for navigation
  const heroRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  // UI State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string>("0");
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "updates" | "comments" | "faq" | "risks"
  >("updates");
  const [expandedFAQs, setExpandedFAQs] = useState<Set<string>>(new Set());
  const [isProjectLiked, setIsProjectLiked] = useState(false);
  const [isProjectBookmarked, setIsProjectBookmarked] = useState(false);
  const [showAllRewards, setShowAllRewards] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true);

  // Form State
  const [loginForm, setLoginForm] = useState({
    email: "demo@crowdfund.com",
    password: "demo123",
  });
  const [donateForm, setDonateForm] = useState({ amount: "", message: "" });
  const [commentForm, setCommentForm] = useState({ content: "" });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const loginModalRef = useRef<HTMLDivElement>(null);
  const shareModalRef = useRef<HTMLDivElement>(null);
  const donateModalRef = useRef<HTMLDivElement>(null);

  // Dynamic state for updates and comments
  const [updates, setUpdates] = useState<Update[]>([
    {
      id: "1",
      title: "Prototype Testing Complete!",
      content:
        "We've successfully completed beta testing with 50 households. Results exceeded expectations with 40% faster growth rates and 90% user satisfaction.",
      timestamp: new Date("2024-05-20"),
      image:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
      likes: 156,
      views: 2341,
      isLiked: false,
    },
    {
      id: "2",
      title: "Manufacturing Partnership Secured",
      content:
        "Partnered with leading sustainable manufacturing facility. Production capacity confirmed for all reward tiers with eco-friendly processes.",
      timestamp: new Date("2024-05-15"),
      likes: 89,
      views: 1456,
      isLiked: false,
    },
    {
      id: "3",
      title: "AI Algorithm Enhancement",
      content:
        "Updated our machine learning models to provide even more precise growing recommendations based on 10,000+ data points.",
      timestamp: new Date("2024-05-10"),
      likes: 234,
      views: 3102,
      isLiked: false,
    },
  ]);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      user: {
        id: "2",
        name: "Sarah Chen",
        email: "sarah@example.com",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      },
      content:
        "This looks amazing! Can't wait to grow my own vegetables year-round. The beta results are very promising.",
      timestamp: new Date("2024-05-22"),
      isSupporter: true,
      likes: 24,
      replies: [],
      isLiked: false,
    },
    {
      id: "2",
      user: {
        id: "3",
        name: "Mike Rodriguez",
        email: "mike@example.com",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      },
      content:
        "The beta results are impressive. Looking forward to the professional kit! When will shipping start?",
      timestamp: new Date("2024-05-21"),
      isSupporter: true,
      likes: 18,
      replies: [],
      isLiked: false,
    },
  ]);

  // Sample credentials
  const sampleCredentials = {
    email: "demo@crowdfund.com",
    password: "demo123",
  };

  // Project data with state
  const [projectData, setProjectData] = useState({
    id: "1",
    title: "Revolutionary Smart Garden System",
    description:
      "An AI-powered hydroponic system that grows fresh vegetables year-round with minimal maintenance. Perfect for urban living and sustainable food production.",
    raised: 127500,
    goal: 200000,
    backers: 847,
    daysLeft: 23,
    creator: {
      id: "1",
      name: "GreenTech Innovations",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      verified: true,
      projectsCreated: 3,
      projectsFunded: 12,
      memberSince: "2019",
    },
    location: "San Francisco, CA",
    category: "Technology",
    tags: ["Smart Home", "Sustainable", "AI", "Indoor Gardening"],
    risks: "Manufacturing delays, shipping complications, component shortages",
    timeline: "6-8 months from funding completion",
  });

  const videos: Video[] = useMemo(
    () => [
      {
        id: "0",
        title: "Product Demo & Overview",
        embedId: "6stlCkUDG_s",
        thumbnail:
          "https://images.unsplash.com/photo-1666727099499-ce24449b7b2b?w=800&h=450&fit=crop",
        duration: "3:24",
        description:
          "See our Smart Garden System in action and learn how it works.",
      },
      {
        id: "1",
        title: "Installation Process",
        embedId: "gsnqXt7d1mU",
        thumbnail:
          "https://images.unsplash.com/photo-1560161379-1f26045d6cba?w=800&h=450&fit=crop",
        duration: "2:15",
        description: "Step-by-step guide to setting up your garden system.",
      },
      {
        id: "2",
        title: "Growing Results",
        embedId: "Jh6jZftn2e0",
        thumbnail:
          "https://images.unsplash.com/photo-1655731986321-d9bee041ec88?w=800&h=450&fit=crop",
        duration: "4:02",
        description:
          "Real results from beta testers showing amazing growth rates.",
      },
    ],
    []
  );

  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: "1",
      title: "Early Bird Special",
      description: "Get the Smart Garden System at 30% off retail price.",
      amount: 299,
      stock: 100,
      claimed: 67,
      estimatedDelivery: "March 2025",
      image:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
      features: [
        "Smart Garden System",
        "Starter seed kit",
        "Mobile app access",
        "1-year warranty",
      ],
      popularity: "early-bird",
    },
    {
      id: "2",
      title: "Premium Package",
      description:
        "Smart Garden System + Premium LED grow lights + 6-month seed subscription.",
      amount: 449,
      stock: 75,
      claimed: 23,
      estimatedDelivery: "March 2025",
      image:
        "https://images.unsplash.com/photo-1612523563676-709f47fab6ea?w=400&h=300&fit=crop",
      features: [
        "Everything in Early Bird",
        "Premium LED grow lights",
        "6-month seed subscription",
        "Priority support",
      ],
      popularity: "popular",
    },
    {
      id: "3",
      title: "Professional Kit",
      description:
        "Complete system with advanced monitoring sensors and nutrient automation.",
      amount: 699,
      stock: 50,
      claimed: 12,
      estimatedDelivery: "April 2025",
      image:
        "https://images.unsplash.com/photo-1722192148044-dbf55fd99c76?w=400&h=300&fit=crop",
      features: [
        "Everything in Premium",
        "Advanced sensors",
        "Nutrient automation",
        "Climate control",
        "2-year warranty",
      ],
      popularity: "limited",
    },
    {
      id: "4",
      title: "Supporter Package",
      description: "Support the project and get exclusive updates.",
      amount: 50,
      stock: 500,
      claimed: 234,
      estimatedDelivery: "January 2025",
      image:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
      features: [
        "Exclusive updates",
        "Digital thank you card",
        "Project stickers",
        "Early access to future projects",
      ],
      popularity: null,
    },
    {
      id: "5",
      title: "Ultimate Bundle",
      description: "Everything we offer plus exclusive perks.",
      amount: 999,
      stock: 25,
      claimed: 5,
      estimatedDelivery: "April 2025",
      image:
        "https://images.unsplash.com/photo-1604313476893-31aabc9c7fbb?w=400&h=300&fit=crop",
      features: [
        "Everything in Professional",
        "Personal consultation",
        "Custom engraving",
        "Lifetime support",
        "Beta access to new products",
      ],
      popularity: "limited",
    },
  ]);

  const faqs: FAQ[] = useMemo(
    () => [
      {
        id: "1",
        question: "How much space does the system require?",
        answer:
          "The base unit requires a 2x2 foot footprint and can be placed on any stable surface near a power outlet. Height clearance of 3 feet is recommended.",
      },
      {
        id: "2",
        question: "What vegetables can I grow?",
        answer:
          "You can grow leafy greens, herbs, tomatoes, peppers, and most vegetables that don't require deep root systems. Our AI suggests optimal crops based on your preferences.",
      },
      {
        id: "3",
        question: "How much maintenance is required?",
        answer:
          "The system is designed for minimal maintenance - just refill water weekly and replace nutrients monthly. The app sends reminders and monitors everything automatically.",
      },
      {
        id: "4",
        question: "What if I encounter technical issues?",
        answer:
          "We provide 24/7 customer support and a comprehensive warranty covering all components for 2 years. Remote diagnostics help solve most issues quickly.",
      },
      {
        id: "5",
        question: "How does shipping work internationally?",
        answer:
          "We ship worldwide with tracking. International backers may be responsible for customs duties. Estimated shipping costs are calculated at checkout.",
      },
    ],
    []
  );

  const projectStats: ProjectStats = useMemo(
    () => ({
      totalViews: 45672,
      totalLikes: 1234,
      totalShares: 567,
      averageContribution: 387,
      repeatBackers: 12,
    }),
    []
  );

  // Navigation scroll function
  const scrollToSection = useCallback((section: string) => {
    const refs = {
      discover: projectRef,
      start: howItWorksRef,
      "how-it-works": howItWorksRef,
    };

    const targetRef = refs[section as keyof typeof refs];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
      setShowLandingPage(false);
    }
    setIsMobileMenuOpen(false);
  }, []);

  // Validation functions
  const validateEmail = useCallback((email: string): string | undefined => {
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Invalid email format";
    return undefined;
  }, []);

  const validatePassword = useCallback(
    (password: string): string | undefined => {
      if (!password) return "Password is required";
      if (password.length < 6) return "Password must be at least 6 characters";
      return undefined;
    },
    []
  );

  const validateAmount = useCallback((amount: string): string | undefined => {
    if (!amount) return "Amount is required";
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return "Please enter a valid amount";
    if (num < 10) return "Minimum donation is $10";
    return undefined;
  }, []);

  const validateComment = useCallback((content: string): string | undefined => {
    if (!content.trim()) return "Comment cannot be empty";
    if (content.length < 10) return "Comment must be at least 10 characters";
    return undefined;
  }, []);

  // Auth guard function
  const requireAuth = useCallback(
    (action: () => void) => {
      if (!isLoggedIn) {
        setShowLoginModal(true);
        return;
      }
      action();
    },
    [isLoggedIn]
  );

  // Handlers
  const handleLogin = useCallback(
    (e?: React.MouseEvent | React.KeyboardEvent) => {
      e?.preventDefault();

      const emailError = validateEmail(loginForm.email);
      const passwordError = validatePassword(loginForm.password);

      if (emailError || passwordError) {
        setFormErrors({ email: emailError, password: passwordError });
        return;
      }

      if (
        loginForm.email === sampleCredentials.email &&
        loginForm.password === sampleCredentials.password
      ) {
        const user: User = {
          id: "1",
          name: "Alex Johnson",
          email: loginForm.email,
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        };

        setCurrentUser(user);
        setIsLoggedIn(true);
        setShowLoginModal(false);
        setLoginMessage("Successfully logged in!");
        setLoginForm({ email: "", password: "" });
        setFormErrors({});

        setTimeout(() => setLoginMessage(""), 3000);
      } else {
        setFormErrors({ password: "Invalid credentials" });
      }
    },
    [loginForm, validateEmail, validatePassword]
  );

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setLoginMessage("Successfully logged out!");
    setShowLandingPage(true);
    setTimeout(() => setLoginMessage(""), 3000);
  }, []);

  const handleDonate = useCallback(
    (e?: React.MouseEvent | React.KeyboardEvent) => {
      e?.preventDefault();

      const amountError = validateAmount(donateForm.amount);

      if (amountError) {
        setFormErrors({ amount: amountError });
        return;
      }

      const donationAmount = parseFloat(donateForm.amount);

      // Update project data with new donation
      setProjectData((prev) => ({
        ...prev,
        raised: prev.raised + donationAmount,
        backers: prev.backers + 1,
      }));

      // Update selected reward if applicable
      if (selectedReward) {
        setRewards((prevRewards) =>
          prevRewards.map((reward) =>
            reward.id === selectedReward
              ? { ...reward, claimed: reward.claimed + 1 }
              : reward
          )
        );
      }

      // Simulate donation success
      setShowDonateModal(false);
      setDonateForm({ amount: "", message: "" });
      setSelectedReward(null);
      setFormErrors({});
      setLoginMessage(`Thank you for your ${donationAmount} donation!`);
      setTimeout(() => setLoginMessage(""), 3000);
    },
    [donateForm, validateAmount, selectedReward]
  );

  const handleSelectReward = useCallback(
    (rewardId: string) => {
      const reward = rewards.find((r) => r.id === rewardId);
      if (reward && reward.stock > reward.claimed) {
        setSelectedReward(rewardId);
        setDonateForm((prev) => ({
          ...prev,
          amount: reward.amount.toString(),
        }));
        setShowDonateModal(true);
      }
    },
    [rewards]
  );

  const handleComment = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault();

      const commentError = validateComment(commentForm.content);

      if (commentError) {
        setFormErrors({ comment: commentError });
        return;
      }

      // Add new comment to the list
      const newComment: Comment = {
        id: Date.now().toString(),
        user: currentUser!,
        content: commentForm.content,
        timestamp: new Date(),
        isSupporter: true, // Assume user becomes supporter by commenting
        likes: 0,
        replies: [],
        isLiked: false,
      };

      setComments((prev) => [newComment, ...prev]);
      setCommentForm({ content: "" });
      setFormErrors({});
      setLoginMessage("Comment posted successfully!");
      setTimeout(() => setLoginMessage(""), 3000);
    },
    [commentForm, validateComment, currentUser]
  );

  const handleUpdateLike = useCallback((updateId: string) => {
    setUpdates((prev) =>
      prev.map((update) => {
        if (update.id === updateId) {
          return {
            ...update,
            likes: update.isLiked ? update.likes - 1 : update.likes + 1,
            isLiked: !update.isLiked,
          };
        }
        return update;
      })
    );
  }, []);

  const handleVideoSelect = useCallback((videoIndex: string) => {
    setSelectedVideo(videoIndex);
    // Video will automatically start playing due to the iframe src change
  }, []);

  const handleShare = useCallback(
    (platform: string) => {
      const url = window.location.href;
      const title = projectData.title;
      const text = projectData.description;

      switch (platform) {
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              url
            )}`,
            "_blank"
          );
          break;
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(
              url
            )}&text=${encodeURIComponent(text)}`,
            "_blank"
          );
          break;
        case "linkedin":
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              url
            )}`,
            "_blank"
          );
          break;
        case "email":
          window.open(
            `mailto:?subject=${encodeURIComponent(
              title
            )}&body=${encodeURIComponent(text + "\n\n" + url)}`
          );
          break;
        case "copy":
          navigator.clipboard.writeText(url);
          setLoginMessage("Link copied to clipboard!");
          setTimeout(() => setLoginMessage(""), 3000);
          break;
      }
      setShowShareModal(false);
    },
    [projectData]
  );

  const toggleFAQ = useCallback((id: string) => {
    setExpandedFAQs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const progressPercentage = (projectData.raised / projectData.goal) * 100;

  useEffect(() => {
    document.body.style.fontFamily =
      "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showLoginModal &&
        loginModalRef.current &&
        !loginModalRef.current.contains(event.target as Node)
      ) {
        setShowLoginModal(false);
      }

      if (
        showShareModal &&
        shareModalRef.current &&
        !shareModalRef.current.contains(event.target as Node)
      ) {
        setShowShareModal(false);
      }

      if (
        showDonateModal &&
        donateModalRef.current &&
        !donateModalRef.current.contains(event.target as Node)
      ) {
        setShowDonateModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLoginModal, showShareModal, showDonateModal]);

  useEffect(() => {
    const isScrollBlocked =
      showLoginModal || showShareModal || showDonateModal || isMobileMenuOpen;

    if (isScrollBlocked) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showLoginModal, showShareModal, showDonateModal, isMobileMenuOpen]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCommentLike = useCallback(
    (commentId: string, parentId?: string) => {
      const findAndToggleLike = (
        commentsArray: Comment[]
      ): Comment[] => {
        return commentsArray.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
              isLiked: !comment.isLiked,
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: findAndToggleLike(comment.replies),
            };
          }
          return comment;
        });
      };

      setComments((prevComments) => findAndToggleLike(prevComments));
    },
    []
  );

  const handlePostReply = useCallback(
    (parentId: string) => {
      if (!currentUser || !replyContent.trim()) return;

      const newReply: Comment = {
        id: Date.now().toString(),
        user: currentUser,
        content: replyContent,
        timestamp: new Date(),
        isSupporter: true, 
        likes: 0,
        replies: [],
        isLiked: false,
      };

      const addReplyRecursively = (
        commentsArray: Comment[],
        currentParentId: string
      ): Comment[] => {
        return commentsArray.map((comment) => {
          if (comment.id === currentParentId) {
            return {
              ...comment,
              replies: [newReply, ...comment.replies],
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: addReplyRecursively(comment.replies, currentParentId),
            };
          }
          return comment;
        });
      };

      setComments((prevComments) => addReplyRecursively(prevComments, parentId));
      setReplyContent("");
      setActiveReplyId(null);
      setLoginMessage("Reply posted successfully!");
      setTimeout(() => setLoginMessage(""), 3000);
    },
    [currentUser, replyContent]
  );

  if (!isClient) {
    return "";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <button
                  onClick={() => {
                    setShowLandingPage(true);
                    heroRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex items-center cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="ml-3 text-xl font-bold text-gray-900">
                    FundForward
                  </span>
                </button>
              </div>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button
                  onClick={() => scrollToSection("discover")}
                  className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
                >
                  Discover
                </button>
                <button
                  onClick={() => scrollToSection("start")}
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
                >
                  Start a Project
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
                >
                  How it Works
                </button>
              </div>
            </div>

            {/* User menu */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {currentUser?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 p-2 cursor-pointer"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => scrollToSection("discover")}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 cursor-pointer"
              >
                Discover
              </button>
              <button
                onClick={() => scrollToSection("start")}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Start a Project
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                How it Works
              </button>

              {isLoggedIn ? (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center px-3 py-2">
                    <img
                      src={currentUser?.avatar}
                      alt={currentUser?.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="ml-3 text-base font-medium text-gray-700">
                      {currentUser?.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 flex items-center cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4">
                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Login/Logout Message */}
      {loginMessage && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>{loginMessage}</span>
          </div>
        </div>
      )}

      {/* Landing Page */}
      {showLandingPage && (
        <div
          ref={heroRef}
          className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 min-h-screen flex items-center"
        >
          <div className="absolute inset-0 bg-black/50 opacity-50"></div>
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920&h=1080&fit=crop)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Fund the Future of
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Innovation
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Discover groundbreaking projects, support visionary creators,
                and be part of the next big thing. From tech innovations to
                creative endeavors, every idea deserves a chance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <button
                  onClick={() => {
                    scrollToSection("discover");
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 cursor-pointer flex items-center space-x-2"
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollToSection("start")}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all cursor-pointer"
                >
                  Start Your Project
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    $12M+
                  </div>
                  <div className="text-gray-300">Raised by creators</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    25K+
                  </div>
                  <div className="text-gray-300">Projects funded</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    180+
                  </div>
                  <div className="text-gray-300">Countries reached</div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <button
              onClick={() => scrollToSection("discover")}
              className="text-white hover:text-blue-400 transition-colors cursor-pointer"
            >
              <ChevronDown className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}

      {/* How It Works Section */}
      <div ref={howItWorksRef} className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How FundForward Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to bring your ideas to life or support amazing
              projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Create & Share
              </h3>
              <p className="text-gray-600">
                Launch your project with compelling videos, detailed
                descriptions, and exciting rewards for backers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users2 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Build Community
              </h3>
              <p className="text-gray-600">
                Engage with supporters, share updates, and build a community
                around your vision and passion.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Make It Happen
              </h3>
              <p className="text-gray-600">
                Reach your funding goal and bring your project to life with the
                support of your community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Project Content */}
      <div
        ref={projectRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Left Column - Project Details */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Project Header */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 space-y-4 sm:space-y-0">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {projectData.title}
                  </h1>
                  <p className="text-gray-600 text-base sm:text-lg mb-4">
                    {projectData.description}
                  </p>

                  {/* Project Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {projectData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2 sm:ml-4">
                  <button
                    onClick={() =>
                      requireAuth(() => setIsProjectLiked(!isProjectLiked))
                    }
                    className={`p-2 transition-colors cursor-pointer ${
                      isProjectLiked
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isProjectLiked ? "fill-current" : ""
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => requireAuth(() => setShowShareModal(true))}
                    className="p-2 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      requireAuth(() =>
                        setIsProjectBookmarked(!isProjectBookmarked)
                      )
                    }
                    className={`p-2 transition-colors cursor-pointer ${
                      isProjectBookmarked
                        ? "text-yellow-500"
                        : "text-gray-400 hover:text-yellow-500"
                    }`}
                  >
                    <Bookmark
                      className={`w-5 h-5 ${
                        isProjectBookmarked ? "fill-current" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{projectData.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4" />
                  <span>{projectData.category}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{projectStats.totalViews.toLocaleString()} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{projectStats.totalLikes.toLocaleString()} likes</span>
                </div>
              </div>
            </div>

            {/* Video Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Video Player */}
              <div className="relative aspect-video bg-gray-900">
                <iframe
                  key={selectedVideo} // Force re-render when video changes
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${
                    videos[parseInt(selectedVideo)].embedId
                  }?autoplay=1&mute=1&rel=0&modestbranding=1&enablejsapi=1`}
                  title={videos[parseInt(selectedVideo)].title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>

              {/* Video Playlist */}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-4">Project Videos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videos.map((video, index) => (
                    <div
                      key={video.id}
                      onClick={() =>
                        requireAuth(() => handleVideoSelect(index.toString()))
                      }
                      className={`cursor-pointer rounded-lg overflow-hidden transition-all ${
                        selectedVideo === index.toString()
                          ? "ring-2 ring-blue-500 ring-offset-2"
                          : "hover:shadow-md"
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-24 sm:h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center">
                          <PlayCircle className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/50 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-sm text-gray-900 mb-1">
                          {video.title}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {video.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Creator Info */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <img
                  src={projectData.creator.avatar}
                  alt={projectData.creator.name}
                  className="w-16 h-16 rounded-full mx-auto sm:mx-0"
                />
                <div className="flex-1 text-center sm:text-left pl-2">
                  <div className="flex items-center justify-center sm:justify-start space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {projectData.creator.name}
                    </h3>
                    {projectData.creator.verified && (
                      <Shield className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">
                    Project Creator • Member since{" "}
                    {projectData.creator.memberSince}
                  </p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-500">
                    <span>
                      {projectData.creator.projectsCreated} projects created
                    </span>
                    <span>
                      {projectData.creator.projectsFunded} projects backed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Stats */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Project Statistics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    ${projectStats.averageContribution}
                  </div>
                  <div className="text-gray-600 text-sm">Avg. contribution</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {projectStats.totalShares}
                  </div>
                  <div className="text-gray-600 text-sm">Total shares</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {projectStats.repeatBackers}
                  </div>
                  <div className="text-gray-600 text-sm">Repeat backers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(progressPercentage)}%
                  </div>
                  <div className="text-gray-600 text-sm">Funded</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="border-b border-gray-200 overflow-x-auto">
                <nav className="flex space-x-8 min-w-max px-4 sm:px-6">
                  {[
                    { key: "updates", label: "Updates", count: updates.length },
                    {
                      key: "comments",
                      label: "Comments",
                      count: comments.length,
                    },
                    { key: "faq", label: "FAQ", count: faqs.length },
                    { key: "risks", label: "Risks & Challenges", count: null },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() =>
                        requireAuth(() => setActiveTab(tab.key as any))
                      }
                      className={`px-2 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                        activeTab === tab.key
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label} {tab.count !== null && `(${tab.count})`}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-4 sm:p-6">
                {/* Updates Tab */}
                {activeTab === "updates" && (
                  <div className="space-y-6">
                    {updates.map((update) => (
                      <div
                        key={update.id}
                        className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                              {update.title}
                            </h4>
                            <p className="text-gray-600 mb-3">
                              {update.content}
                            </p>
                            {update.image && (
                              <img
                                src={update.image}
                                alt="Update"
                                className="w-full h-48 object-cover rounded-lg mb-3"
                              />
                            )}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {update.timestamp.toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {update.views.toLocaleString()} views
                              </div>
                              <button
                                onClick={() =>
                                  requireAuth(() => handleUpdateLike(update.id))
                                }
                                className={`flex items-center transition-colors cursor-pointer ${
                                  update.isLiked
                                    ? "text-blue-600"
                                    : "hover:text-blue-600"
                                }`}
                              >
                                <ThumbsUp
                                  className={`w-4 h-4 mr-1 ${
                                    update.isLiked ? "fill-current" : ""
                                  }`}
                                />
                                {update.likes} likes
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comments Tab */}
                {activeTab === "comments" && (
                  <div className="space-y-6">
                    {/* Comment Form */}
                    <div className="space-y-4">
                      <textarea
                        value={commentForm.content}
                        onChange={(e) =>
                          setCommentForm({ content: e.target.value })
                        }
                        placeholder={
                          isLoggedIn
                            ? "Share your thoughts..."
                            : "Please sign in to comment"
                        }
                        disabled={!isLoggedIn}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
                      />
                      {formErrors.comment && (
                        <p className="text-red-500 text-sm flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formErrors.comment}
                        </p>
                      )}
                      <button
                        onClick={() => requireAuth(handleComment)}
                        disabled={!isLoggedIn}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        Post Comment
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id}>
                          <div className="flex space-x-4">
                            <img
                              src={comment.user.avatar}
                              alt={comment.user.name}
                              className="w-10 h-10 rounded-full flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center space-x-2 mb-1">
                                <span className="font-medium text-gray-900">
                                  {comment.user.name}
                                </span>
                                {comment.isSupporter && (
                                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    Supporter
                                  </span>
                                )}
                                <span className="text-gray-500 text-sm">
                                  {comment.timestamp.toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700 mb-2">
                                {comment.content}
                              </p>
                              <div className="flex items-center space-x-4 text-sm">
                                <button
                                  onClick={() => requireAuth(() => handleCommentLike(comment.id))}
                                  className={`flex items-center transition-colors cursor-pointer ${
                                    comment.isLiked
                                      ? "text-blue-600"
                                      : "text-gray-500 hover:text-blue-600"
                                  }`}
                                >
                                  <ThumbsUp className={`w-4 h-4 mr-1 ${comment.isLiked ? "fill-current" : ""}`} />
                                  {comment.likes}
                                </button>
                                <button
                                  onClick={() => requireAuth(() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id))}
                                  className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          </div>
                          {activeReplyId === comment.id && (
                            <div className="ml-14 mt-4 space-y-2">
                              <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder={`Replying to ${comment.user.name}...`}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-20"
                              />
                              <button
                                onClick={() => handlePostReply(comment.id)}
                                className="px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                              >
                                Post Reply
                              </button>
                            </div>
                          )}
                          {/* Render Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="ml-14 mt-4 space-y-4">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex space-x-4">
                                  <img
                                    src={reply.user.avatar}
                                    alt={reply.user.name}
                                    className="w-8 h-8 rounded-full flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center space-x-2 mb-1">
                                      <span className="font-medium text-gray-900">
                                        {reply.user.name}
                                      </span>
                                      {reply.isSupporter && (
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                          Supporter
                                        </span>
                                      )}
                                      <span className="text-gray-500 text-sm">
                                        {reply.timestamp.toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className="text-gray-700 mb-2">
                                      {reply.content}
                                    </p>
                                    <div className="flex items-center space-x-4 text-sm">
                                      <button
                                        onClick={() => requireAuth(() => handleCommentLike(reply.id, comment.id))}
                                        className={`flex items-center transition-colors cursor-pointer ${
                                          reply.isLiked
                                            ? "text-blue-600"
                                            : "text-gray-500 hover:text-blue-600"
                                        }`}
                                      >
                                        <ThumbsUp className={`w-4 h-4 mr-1 ${reply.isLiked ? "fill-current" : ""}`} />
                                        {reply.likes}
                                      </button>
                                      {/* Add reply to reply functionality if needed */}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQ Tab */}
                {activeTab === "faq" && (
                  <div className="space-y-4">
                    {faqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="border border-gray-200 rounded-lg"
                      >
                        <button
                          onClick={() => requireAuth(() => toggleFAQ(faq.id))}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <span className="font-medium text-gray-900 pr-4">
                            {faq.question}
                          </span>
                          {expandedFAQs.has(faq.id) ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        {expandedFAQs.has(faq.id) && (
                          <div className="px-6 pb-4">
                            <p className="text-gray-600">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Risks & Challenges Tab */}
                {activeTab === "risks" && (
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-yellow-800 mb-2">
                            Potential Risks
                          </h4>
                          <p className="text-yellow-700">{projectData.risks}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-blue-800 mb-2">
                            Timeline
                          </h4>
                          <p className="text-blue-700">
                            {projectData.timeline}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-green-800 mb-2">
                            Our Commitment
                          </h4>
                          <p className="text-green-700">
                            We're committed to transparent communication and
                            will provide regular updates on any challenges we
                            encounter. Our experienced team has successfully
                            delivered similar projects before.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Funding Info & Rewards */}
          <div className="space-y-4 sm:space-y-6">
            {/* Funding Progress - Fixed positioning */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6   lg:top-24">
              <div className="space-y-4">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    ${projectData.raised.toLocaleString()}
                  </div>
                  <div className="text-gray-600">
                    raised of ${projectData.goal.toLocaleString()} goal
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">
                      {projectData.backers}
                    </div>
                    <div className="text-gray-600 text-sm">backers</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">
                      {projectData.daysLeft}
                    </div>
                    <div className="text-gray-600 text-sm">days left</div>
                  </div>
                </div>

                <button
                  onClick={() => requireAuth(() => setShowDonateModal(true))}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 cursor-pointer"
                >
                  Back this project
                </button>

                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      requireAuth(() => setIsProjectLiked(!isProjectLiked))
                    }
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 border rounded-lg transition-colors cursor-pointer ${
                      isProjectLiked
                        ? "border-red-300 text-red-600 bg-red-50"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isProjectLiked ? "fill-current" : ""
                      }`}
                    />
                    <span className="text-sm">Like</span>
                  </button>
                  <button
                    onClick={() => requireAuth(() => setShowShareModal(true))}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Rewards */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                Choose your reward
              </h3>
              <div className="space-y-4">
                {rewards
                  .slice(0, showAllRewards ? rewards.length : 3)
                  .map((reward) => (
                    <div
                      key={reward.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all relative ${
                        selectedReward === reward.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      } ${reward.stock <= reward.claimed ? "opacity-60" : ""}`}
                      onClick={() =>
                        requireAuth(() => {
                          if (reward.stock > reward.claimed) {
                            setSelectedReward(reward.id);
                          }
                        })
                      }
                    >
                      {/* Intentionally blank here to remove the old badge code */}
                      <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                        <img
                          src={reward.image}
                          alt={reward.title}
                          className="w-full sm:w-16 h-32 sm:h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="mb-1"> {/* Price */}
                            <span className="text-lg font-bold text-gray-900">
                              ${reward.amount}
                            </span>
                          </div>

                          {/* Absolute positioned Tag + Stock container */}
                          <div className="absolute top-4 right-4 text-right">
                            {reward.popularity && (
                              <span
                                className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-1 ${
                                  reward.popularity === "limited"
                                    ? "bg-red-500 text-white"
                                    : reward.popularity === "popular"
                                    ? "bg-green-500 text-white"
                                    : "bg-orange-500 text-white"
                                }`}
                              >
                                {reward.popularity === "limited"
                                  ? "Limited"
                                  : reward.popularity === "popular"
                                  ? "Popular"
                                  : "Early Bird"}
                              </span>
                            )}
                            <span className={`block text-xs ${
                                  reward.stock <= reward.claimed
                                    ? "text-red-500"
                                    : "text-gray-500"
                                }`}>
                                {reward.stock <= reward.claimed
                                  ? "Sold Out"
                                  : `${reward.stock - reward.claimed} left`}
                            </span>
                          </div>
                          
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {reward.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-2">
                            {reward.description}
                          </p>

                          {/* Features */}
                          <div className="mb-2">
                            <p className="text-xs text-gray-500 mb-1">
                              Includes:
                            </p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {reward.features.map((feature, index) => (
                                <li
                                  key={index}
                                  className="flex items-center space-x-1"
                                >
                                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                            <span>
                              Estimated delivery: {reward.estimatedDelivery}
                            </span>
                            <span>{reward.claimed} claimed</span>
                          </div>

                          {/* Reward Selection Button */}
                          {selectedReward === reward.id ? (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-center justify-between">
                                <span className="text-blue-800 font-semibold text-sm">
                                  Reward Selected
                                </span>
                                <button
                                  onClick={() =>
                                    requireAuth(() =>
                                      handleSelectReward(reward.id)
                                    )
                                  }
                                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                                >
                                  ${reward.amount}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                requireAuth(() => setSelectedReward(reward.id))
                              }
                              disabled={reward.stock <= reward.claimed}
                              className={`mt-3 w-full py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                                reward.stock <= reward.claimed
                                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {reward.stock <= reward.claimed
                                ? "Sold Out"
                                : "Select This Reward"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                {rewards.length > 3 && (
                  <button
                    onClick={() => setShowAllRewards(!showAllRewards)}
                    className="w-full py-3 text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
                  >
                    {showAllRewards
                      ? "Show Less"
                      : `Show ${rewards.length - 3} More Rewards`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Donate Button */}
      <button
        onClick={() => requireAuth(() => setShowDonateModal(true))}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 z-30 cursor-pointer"
      >
        <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            ref={loginModalRef}
            className="bg-white rounded-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Sign In</h2>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Demo Credentials:</strong>
                <br />
                Email: demo@crowdfund.com
                <br />
                Password: demo123
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  onKeyPress={(e) => e.key === "Enter" && handleLogin(e)}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  onKeyPress={(e) => e.key === "Enter" && handleLogin(e)}
                />
                {formErrors.password && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formErrors.password}
                  </p>
                )}
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            ref={shareModalRef}
            className="bg-white rounded-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Share this project
              </h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleShare("facebook")}
                className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Facebook</span>
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer"
              >
                <Twitter className="w-5 h-5 text-blue-400" />
                <span className="text-gray-700">Twitter</span>
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer"
              >
                <Linkedin className="w-5 h-5 text-blue-700" />
                <span className="text-gray-700">LinkedIn</span>
              </button>
              <button
                onClick={() => handleShare("email")}
                className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer"
              >
                <Mail className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Email</span>
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleShare("copy")}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <Copy className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Donate Modal */}
      {showDonateModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            ref={donateModalRef}
            className="bg-white rounded-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedReward ? "Confirm Your Reward" : "Make a Donation"}
              </h2>
              <button
                onClick={() => setShowDonateModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Selected Reward Display */}
            {selectedReward && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                {(() => {
                  const reward = rewards.find((r) => r.id === selectedReward);
                  return reward ? (
                    <div className="flex items-center space-x-3">
                      <img
                        src={reward.image}
                        alt={reward.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-900">
                          {reward.title}
                        </h3>
                        <p className="text-blue-700 text-sm">
                          ${reward.amount} reward selected
                        </p>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Donation Amount ($)
                </label>
                <input
                  type="number"
                  value={donateForm.amount}
                  onChange={(e) =>
                    setDonateForm((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  min="10"
                  step="1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount (minimum $10)"
                  onKeyPress={(e) => e.key === "Enter" && handleDonate(e)}
                />
                {formErrors.amount && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formErrors.amount}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  value={donateForm.message}
                  onChange={(e) =>
                    setDonateForm((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-20"
                  placeholder="Leave a message for the creator"
                />
              </div>

              <button
                onClick={handleDonate}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer"
              >
                {selectedReward ? `Pledge ${donateForm.amount}` : "Donate Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center">
                {/* <Clock className="h-8 w-8 text-blue-400" /> */}
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-white">
                  FundForward
                </span>
              </div>
              <p className="mt-4 text-sm text-gray-400">
                Empowering ideas through community-driven crowdfunding for
                impactful change.
              </p>
              <div className="mt-6 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14v-.648c.959-.689 1.795-1.556 2.455-2.541z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  <span className="sr-only">GitHub</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                Product
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#features"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Discover
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Start a Project
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    How it Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                Company
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Press
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between">
            <p className="text-base text-gray-400">
              &copy; 2025 TimeTrack, Inc. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FundForward;