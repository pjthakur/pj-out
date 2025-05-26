"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  ChevronDown,
  MessageSquare,
  Award,
  Clock,
  Users,
  ArrowUp,
  ThumbsUp,
  Search,
  Menu,
  X,
  Home,
  Filter,
  PlusCircle,
  Book,
  Cpu,
  Plane,
  Paintbrush,
  Bell,
  User,
  LogOut,
  Eye,
  EyeOff,
  X as XIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Types
type Category = {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  threadCount: number;
};

type Thread = {
  id: number;
  categoryId: number;
  title: string;
  author: string;
  authorAvatar: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  replies: Reply[];
  views: number;
  isHelpful: boolean;
};

type Reply = {
  id: number;
  threadId: number;
  author: string;
  authorAvatar: string;
  content: string;
  createdAt: Date;
  isHelpful: boolean;
};

type User = {
  id: number;
  username: string;
  email: string;
  avatar: string;
};

type Notification = {
  id: number;
  userId: number;
  type: "mention" | "reply" | "like" | "system";
  content: string;
  threadId?: number;
  replyId?: number;
  createdAt: Date;
  read: boolean;
};

type SortOption = "newest" | "active";
type View = "categories" | "threads" | "thread";

const CommunityDiscussion = () => {
  // State
  const [view, setView] = useState<View>("categories");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [newReply, setNewReply] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);
  const [popularThreads, setPopularThreads] = useState<Thread[]>([]);
  const [recentActivity, setRecentActivity] = useState<Thread[]>([]);
  const [searchResults, setSearchResults] = useState<Thread[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const [threads, setThreads] = useState<Thread[]>([
    {
      id: 1,
      categoryId: 1,
      title: "What programming language should I learn in 2025?",
      author: "TechEnthusiast",
      authorAvatar: "https://i.pravatar.cc/150?img=1",
      content:
        "I'm looking to start a career in software development and was wondering which language would be most valuable to learn right now. I've heard good things about Rust and TypeScript, but I'm open to suggestions.",
      createdAt: new Date("2025-04-28T09:24:00"),
      updatedAt: new Date("2025-05-02T16:45:00"),
      replies: [
        {
          id: 1,
          threadId: 1,
          author: "CodeMaster",
          authorAvatar: "https://i.pravatar.cc/150?img=2",
          content:
            "TypeScript is definitely a great choice as it builds on JavaScript knowledge and is widely used in the industry. If you're just starting, I'd recommend learning JavaScript fundamentals first, then moving to TypeScript.",
          createdAt: new Date("2025-04-28T10:15:00"),
          isHelpful: true,
        },
        {
          id: 2,
          threadId: 1,
          author: "RustAdvocate",
          authorAvatar: "https://i.pravatar.cc/150?img=3",
          content:
            "Rust is gaining a lot of traction, especially for systems programming and projects where performance is critical. It has a steeper learning curve but offers great safety guarantees.",
          createdAt: new Date("2025-04-29T14:22:00"),
          isHelpful: false,
        },
      ],
      views: 342,
      isHelpful: false,
    },
    {
      id: 2,
      categoryId: 1,
      title: "Best practices for securing a React application",
      author: "SecurityFirst",
      authorAvatar: "https://i.pravatar.cc/150?img=4",
      content:
        "I'm building a React application that handles sensitive user data. What are the current best practices for ensuring my application is secure?",
      createdAt: new Date("2025-04-26T15:30:00"),
      updatedAt: new Date("2025-05-01T12:10:00"),
      replies: [
        {
          id: 3,
          threadId: 2,
          author: "ReactExpert",
          authorAvatar: "https://i.pravatar.cc/150?img=5",
          content:
            "Always sanitize user inputs, use HTTPS, implement proper authentication and authorization, keep dependencies updated, and consider using Content Security Policy (CSP). For sensitive data, you might also want to look into encryption libraries.",
          createdAt: new Date("2025-04-26T16:45:00"),
          isHelpful: true,
        },
      ],
      views: 189,
      isHelpful: false,
    },
    {
      id: 3,
      categoryId: 2,
      title: "Book recommendations for science fiction fans",
      author: "BookWorm",
      authorAvatar: "https://i.pravatar.cc/150?img=6",
      content:
        "I've recently finished the Three-Body Problem trilogy and I'm looking for similar hard sci-fi recommendations. What should I read next?",
      createdAt: new Date("2025-04-30T18:12:00"),
      updatedAt: new Date("2025-05-02T09:22:00"),
      replies: [
        {
          id: 4,
          threadId: 3,
          author: "SciFiLover",
          authorAvatar: "https://i.pravatar.cc/150?img=7",
          content:
            'If you enjoyed the Three-Body Problem, you might like "Children of Time" by Adrian Tchaikovsky or "Project Hail Mary" by Andy Weir. Both feature interesting scientific concepts and alien civilizations.',
          createdAt: new Date("2025-04-30T19:20:00"),
          isHelpful: true,
        },
      ],
      views: 156,
      isHelpful: false,
    },

    {
      id: 4,
      categoryId: 2,
      title: "Which classic novels are worth rereading?",
      author: "LiteraryFan",
      authorAvatar: "https://i.pravatar.cc/150?img=8",
      content: "I want to revisit some timeless literature. Any suggestions?",
      createdAt: new Date("2025-05-02T12:00:00"),
      updatedAt: new Date("2025-05-02T14:00:00"),
      replies: [
        {
          id: 5,
          threadId: 4,
          author: "JaneReader",
          authorAvatar: "https://i.pravatar.cc/150?img=9",
          content:
            '"Pride and Prejudice", "To Kill a Mockingbird", and "1984" are all worth revisiting.',
          createdAt: new Date("2025-05-02T13:00:00"),
          isHelpful: true,
        },
      ],
      views: 98,
      isHelpful: false,
    },
    {
      id: 5,
      categoryId: 3,
      title: "Best places to visit in South India this summer",
      author: "GlobeTrotter",
      authorAvatar: "https://i.pravatar.cc/150?img=10",
      content:
        "Looking for scenic, budget-friendly spots in South India for May.",
      createdAt: new Date("2025-04-25T08:00:00"),
      updatedAt: new Date("2025-05-01T09:00:00"),
      replies: [
        {
          id: 6,
          threadId: 5,
          author: "TravelAddict",
          authorAvatar: "https://i.pravatar.cc/150?img=11",
          content:
            "Try Munnar, Coorg, or Wayanad. They're lush and not too crowded.",
          createdAt: new Date("2025-04-25T10:00:00"),
          isHelpful: false,
        },
      ],
      views: 210,
      isHelpful: false,
    },
    {
      id: 6,
      categoryId: 3,
      title: "Travel checklist for international trips",
      author: "JetSetter",
      authorAvatar: "https://i.pravatar.cc/150?img=12",
      content: "What are your must-carry items when going abroad for 2 weeks?",
      createdAt: new Date("2025-04-20T11:00:00"),
      updatedAt: new Date("2025-04-29T15:00:00"),
      replies: [
        {
          id: 7,
          threadId: 6,
          author: "PackSmart",
          authorAvatar: "https://i.pravatar.cc/150?img=13",
          content:
            "Passport, power bank, universal adapter, medicines, copies of documents.",
          createdAt: new Date("2025-04-20T12:30:00"),
          isHelpful: true,
        },
      ],
      views: 170,
      isHelpful: false,
    },
    {
      id: 7,
      categoryId: 4,
      title: "Best tools for modern UI design",
      author: "UXPro",
      authorAvatar: "https://i.pravatar.cc/150?img=14",
      content:
        "What tools do you recommend for designing responsive, modern interfaces?",
      createdAt: new Date("2025-04-18T13:45:00"),
      updatedAt: new Date("2025-04-30T10:20:00"),
      replies: [
        {
          id: 8,
          threadId: 7,
          author: "FigmaFan",
          authorAvatar: "https://i.pravatar.cc/150?img=15",
          content:
            "Figma and Adobe XD are great. Figma especially for collaboration.",
          createdAt: new Date("2025-04-18T14:10:00"),
          isHelpful: true,
        },
      ],
      views: 132,
      isHelpful: false,
    },
    {
      id: 8,
      categoryId: 4,
      title: "Color theory tips for beginner designers",
      author: "DesignStarter",
      authorAvatar: "https://i.pravatar.cc/150?img=16",
      content: "I struggle with picking good colors. Any practical advice?",
      createdAt: new Date("2025-04-27T10:30:00"),
      updatedAt: new Date("2025-05-01T11:00:00"),
      replies: [
        {
          id: 9,
          threadId: 8,
          author: "ColorWizard",
          authorAvatar: "https://i.pravatar.cc/150?img=17",
          content:
            "Use tools like Coolors.co, and try to stick with 2-3 main colors for simplicity.",
          createdAt: new Date("2025-04-27T11:45:00"),
          isHelpful: true,
        },
      ],
      views: 104,
      isHelpful: false,
    },
  ]);
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const replyInputRef = useRef<HTMLTextAreaElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const loginModalRef = useRef<HTMLDivElement>(null);

  const [isNewDiscussionModalOpen, setIsNewDiscussionModalOpen] =
    useState(false);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState("");
  const [newDiscussionContent, setNewDiscussionContent] = useState("");
  const [newDiscussionCategory, setNewDiscussionCategory] = useState<
    number | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const newDiscussionModalRef = useRef<HTMLDivElement>(null);
  const newDiscussionContentRef = useRef<HTMLTextAreaElement>(null);

  // dynamically compute how many threads are in each category
  const getThreadCount = (categoryId: number) =>
    threads.filter((t) => t.categoryId === categoryId).length;

  // Sample data - in a real app this would come from an API
  const categories: Category[] = [
    {
      id: 1,
      name: "Technology",
      description:
        "Discuss the latest in tech, programming, and digital innovation",
      icon: <Cpu size={24} />,
      threadCount: 128,
    },
    {
      id: 2,
      name: "Books & Literature",
      description: "Share your favorite reads and literary discussions",
      icon: <Book size={24} />,
      threadCount: 95,
    },
    {
      id: 3,
      name: "Travel",
      description: "Explore destinations, travel tips, and adventure stories",
      icon: <Plane size={24} />,
      threadCount: 76,
    },
    {
      id: 4,
      name: "Design",
      description: "Everything about UI/UX, graphic design, and creative arts",
      icon: <Paintbrush size={24} />,
      threadCount: 63,
    },
  ];

  // Sample user data
  const users: User[] = [
    {
      id: 1,
      username: "AdminUser",
      email: "admin@example.com",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
    {
      id: 2,
      username: "TechEnthusiast",
      email: "tech@example.com",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
  ];

  // Sample notifications
  const [notificationsData, setNotificationsData] = useState<Notification[]>([
    {
      id: 1,
      userId: 1,
      type: "reply",
      content:
        'CodeMaster replied to your thread "What programming language should I learn in 2025?"',
      threadId: 1,
      replyId: 1,
      createdAt: new Date("2025-05-02T16:45:00"),
      read: false,
    },
    {
      id: 2,
      userId: 1,
      type: "like",
      content: "ReactExpert marked your reply as helpful",
      threadId: 2,
      replyId: 3,
      createdAt: new Date("2025-05-02T14:12:00"),
      read: false,
    },
    {
      id: 3,
      userId: 1,
      type: "system",
      content:
        "Welcome to CommunityHub! Explore categories and join discussions.",
      createdAt: new Date("2025-05-01T09:00:00"),
      read: true,
    },
  ]);

  // Add custom CSS for fade-in animation and other transitions
  const fadeInAnimation = `
    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(10px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .fade-in {
      animation: fadeIn 0.3s ease-in-out forwards;
    }
  `;

  // Get threads for the selected category
  const getThreadsForCategory = (categoryId: number) => {
    let filteredThreads = threads.filter(
      (thread) => thread.categoryId === categoryId
    );

    // Apply search if query exists
    if (searchQuery.trim() !== "") {
      filteredThreads = filteredThreads.filter(
        (thread) =>
          thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          thread.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortOption === "newest") {
      return [...filteredThreads].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
    } else {
      return [...filteredThreads].sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
      );
    }
  };

  // Handler to navigate to threads view
  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setView("threads");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler to navigate to thread detail view
  const handleThreadClick = (thread: Thread) => {
    setSelectedThread(thread);
    setView("thread");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler to navigate back to categories
  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setView("categories");
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler to navigate back to threads
  const handleBackToThreads = () => {
    setSelectedThread(null);
    setView("threads");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler for marking a post as helpful
  const handleMarkAsHelpful = (replyId: number) => {
    if (selectedThread) {
      const updatedReplies = selectedThread.replies.map((reply) => {
        if (reply.id === replyId) {
          return { ...reply, isHelpful: !reply.isHelpful };
        }
        return reply;
      });

      setSelectedThread({
        ...selectedThread,
        replies: updatedReplies,
      });
    }
  };

  // Handler for submitting a new reply
  const handleSubmitReply = () => {
    if (!currentUser) {
      return;
    }
    if (newReply.trim() === "" || !selectedThread) return;

    const newReplyObj: Reply = {
      id: Math.max(0, ...selectedThread.replies.map((r) => r.id)) + 1,
      threadId: selectedThread.id,
      author: currentUser.username,
      authorAvatar: currentUser.avatar,
      content: newReply,
      createdAt: new Date(),
      isHelpful: false,
    };

    const updatedThread = {
      ...selectedThread,
      replies: [...selectedThread.replies, newReplyObj],
      updatedAt: new Date(),
    };

    setSelectedThread(updatedThread);
    setNewReply("");

    // Scroll to the newly added reply
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  // Format date to show relative time
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  // Handle login form submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    setLoginError(null);
    setLoginSuccess(null);

    // Simple validation
    if (!email || !password) {
      setLoginError("Please fill in all fields");
      return;
    }

    // In a real app, this would make an API call to authenticate
    setTimeout(() => {
      if (email === "admin@example.com" && password === "password") {
        setIsLoggedIn(true);
        setCurrentUser(users[0]);
        setLoginSuccess("Login successful!");

        // Close modal after showing success message
        setTimeout(() => {
          setIsLoginModalOpen(false);
          setEmail("");
          setPassword("");
          setLoginSuccess(null);
        }, 1500);
      } else {
        setLoginError("Invalid email or password");
      }
    }, 800);
  };

  useEffect(() => {
    setLoginError("");
  }, [isRegisterMode]);

  // Add these functions with your other handlers
  const handleNotificationClick = (notification: Notification) => {
    // Mark this notification as read
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }

    // Navigate to the relevant thread if there's a threadId
    if (notification.threadId) {
      const thread = threads.find((t) => t.id === notification.threadId);
      if (thread) {
        const category = categories.find((c) => c.id === thread.categoryId);
        if (category) {
          setSelectedCategory(category);
          setView("threads");
          setTimeout(() => {
            handleThreadClick(thread);
          }, 100);
        }
      }
    }

    // Close notifications panel
    setNotificationsOpen(false);
  };

  const markNotificationAsRead = (notificationId: number) => {
    const updatedNotifications = notificationsData.map((notification) => {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    });
    // In a real app, you'd make an API call here
    // For this example, we'll just update the local state
    setNotificationsData(updatedNotifications);
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notificationsData.map((notification) => {
      return { ...notification, read: true };
    });
    // In a real app, you'd make an API call here
    setNotificationsData(updatedNotifications);
  };

  // Handle registration form submission
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    setLoginError(null);
    setLoginSuccess(null);

    // Simple validation
    if (!email || !password || !username) {
      setLoginError("Please fill in all fields");
      return;
    }

    if (password.length < 5) {
      setLoginError("Password must be at least 8 characters");
      return;
    }

    // In a real app, this would make an API call to register
    setTimeout(() => {
      // Create a new user
      const newUser: User = {
        id: users.length + 1,
        username,
        email,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(
          Math.random() * 70
        )}`,
      };

      setIsLoggedIn(true);
      setCurrentUser(newUser);
      setLoginSuccess("Registration successful!");

      // Close modal after showing success message
      setTimeout(() => {
        setIsLoginModalOpen(false);
        setEmail("");
        setPassword("");
        setUsername("");
        setLoginSuccess(null);
      }, 1500);
    }, 800);
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setMobileMenuOpen(false);
  };

  const getPopularThreads = () => {
    // In a real app, this would be an API call
    // For now, sort threads by view count
    return [...threads].sort((a, b) => b.views - a.views).slice(0, 3);
  };
  // Add this function to get recent activity
  const getRecentActivity = () => {
    // In a real app, this would be an API call
    // For now, sort all threads by update date
    return [...threads]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5);
  };

  // Handler to submit a new discussion
  const handleSubmitNewDiscussion = () => {
    // Reset states
    setFormError(null);
    setFormSuccess(null);

    // Validation
    if (!newDiscussionTitle.trim()) {
      setFormError("Please enter a title for your discussion");
      return;
    }

    if (!newDiscussionContent.trim()) {
      setFormError("Please enter content for your discussion");
      return;
    }

    if (newDiscussionCategory === null) {
      setFormError("Please select a category for your discussion");
      return;
    }

    if (!currentUser) {
      setIsNewDiscussionModalOpen(false);
      setIsLoginModalOpen(true);
      return;
    }

    setIsSubmitting(true);

    // In a real app, you would make an API call here
    setTimeout(() => {
      // Create new thread object
      const newThread: Thread = {
        id: Math.max(0, ...threads.map((t) => t.id)) + 1,
        categoryId: newDiscussionCategory,
        title: newDiscussionTitle,
        author: currentUser.username,
        authorAvatar: currentUser.avatar,
        content: newDiscussionContent,
        createdAt: new Date(),
        updatedAt: new Date(),
        replies: [],
        views: 0,
        isHelpful: false,
      };

      // Add the new thread to the threads array
      setThreads((prevThreads) => [newThread, ...prevThreads]);

      // Show success message
      setFormSuccess("Discussion created successfully!");

      // Reset form fields after a delay
      setTimeout(() => {
        setNewDiscussionTitle("");
        setNewDiscussionContent("");
        setNewDiscussionCategory(null);
        setIsSubmitting(false);
        setFormSuccess(null);
        setIsNewDiscussionModalOpen(false);

        // Navigate to the new thread
        const category = categories.find((c) => c.id === newDiscussionCategory);
        if (category) {
          setSelectedCategory(category);
          setView("threads");
          setTimeout(() => {
            handleThreadClick(newThread);
          }, 100);
        }
      }, 1500);
    }, 800);
  };

  const NewDiscussionButton = () => {
    if (!isLoggedIn) {
      return (
        <button
          className="group flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm transition-all duration-200 ease-in-out cursor-pointer"
          onClick={() => {
            setIsLoginModalOpen(true);
            setIsRegisterMode(false);
          }}
        >
          <PlusCircle
            size={18}
            className="transition-transform group-hover:scale-110"
          />
          <span>Start Discussion</span>
        </button>
      );
    }

    return (
      <button
        className="group flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm transition-all duration-200 ease-in-out cursor-pointer"
        onClick={() => {
          setIsNewDiscussionModalOpen(true);
          // If we're in the categories view, preselect the first category
          if (view === "categories" && categories.length > 0) {
            setNewDiscussionCategory(categories[0].id);
          }
          // If we're in the threads view, preselect the current category
          else if (view === "threads" && selectedCategory) {
            setNewDiscussionCategory(selectedCategory.id);
          }
        }}
      >
        <PlusCircle
          size={18}
          className="transition-transform group-hover:scale-110"
        />
        <span>Start Discussion</span>
      </button>
    );
  };

  const getSortedThreads = (): Thread[] => {
    if (!selectedCategory) return [];

    let filtered = threads.filter(
      (thread) => thread.categoryId === selectedCategory.id
    );

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (thread) =>
          thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          thread.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return [...filtered].sort((a, b) =>
      sortOption === "newest"
        ? (b["createdAt"] as any) - (a["createdAt"] as any)
        : (a["createdAt"] as any) - (b["createdAt"] as any)
    );
  };

  useEffect(() => {
    console.log(
      "Sorted Threads:",
      getSortedThreads().map((t) => ({
        title: t.title,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      }))
    );
  }, [sortOption, selectedCategory, searchQuery]);

  useEffect(() => {
    setPopularThreads(getPopularThreads());
    setRecentActivity(getRecentActivity());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }

      // Close profile dropdown when clicking outside
      if (
        profileDropdownOpen &&
        !(event.target as Element).closest(".profile-dropdown-container")
      ) {
        setProfileDropdownOpen(false);
      }

      if (
        loginModalRef.current &&
        !loginModalRef.current.contains(event.target as Node) &&
        isLoginModalOpen
      ) {
        setIsLoginModalOpen(false);
      }

      if (
        newDiscussionModalRef.current &&
        !newDiscussionModalRef.current.contains(event.target as Node) &&
        isNewDiscussionModalOpen
      ) {
        setIsNewDiscussionModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    notificationsOpen,
    isLoginModalOpen,
    profileDropdownOpen,
    isNewDiscussionModalOpen,
  ]);

  // Add this useEffect for auto-resizing the textarea
  useEffect(() => {
    if (newDiscussionContentRef.current) {
      newDiscussionContentRef.current.style.height = "auto";
      newDiscussionContentRef.current.style.height = `${newDiscussionContentRef.current.scrollHeight}px`;
    }
  }, [newDiscussionContent]);

  // Close notifications panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }

      if (
        loginModalRef.current &&
        !loginModalRef.current.contains(event.target as Node) &&
        !isLoginModalOpen
      ) {
        setIsLoginModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationsOpen, isLoginModalOpen]);

  // Auto-resize textarea
  useEffect(() => {
    if (replyInputRef.current) {
      replyInputRef.current.style.height = "auto";
      replyInputRef.current.style.height = `${replyInputRef.current.scrollHeight}px`;
    }
  }, [newReply]);

  // Close mobile menu when changing views
  useEffect(() => {
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
  }, [view]);

  // Lock body scroll when modals are open
  useEffect(() => {
    const isAnyModalOpen = isLoginModalOpen || isNewDiscussionModalOpen;
    
    if (isAnyModalOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Lock the body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position and unlock
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup function to ensure body scroll is unlocked when component unmounts
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isLoginModalOpen, isNewDiscussionModalOpen]);

  // Add this function to perform search across all threads
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const results = threads.filter(
      (thread) =>
        thread.title.toLowerCase().includes(query.toLowerCase()) ||
        thread.content.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
  };
  // Get unread notifications count
  const unreadNotificationsCount = notificationsData.filter(
    (notification) => !notification.read
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <style>{fadeInAnimation}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div
                className="flex items-center space-x-2 cursor-pointer transition-all duration-200 ease-in-out hover:opacity-80 active:opacity-70"
                onClick={handleBackToCategories}
              >
                <MessageSquare className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <span className="flex text-xl font-bold tracking-tight">
                  CommunityHub
                </span>
              </div>

              <nav className="hidden md:flex space-x-8">
                <button
                  className={`flex items-center space-x-1 transition-all duration-200 cursor-pointer ${
                    view === "categories"
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                  onClick={handleBackToCategories}
                >
                  <Home size={18} />
                  <span>Home</span>
                </button>
              </nav>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search
                    className={`h-5 w-5 ${
                      isSearchFocused
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    performSearch(e.target.value);
                  }}
                  onFocus={() => {
                    setIsSearchFocused(true);
                    // Navigate to categories view when searching
                    if (view !== "categories") {
                      handleBackToCategories();
                    }
                  }}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {searchQuery && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 cursor-pointer"
                      onClick={() => {
                        setSearchQuery("");
                        setIsSearching(false);
                      }}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* User Menu - Desktop */}
            <div className="hidden md:flex items-center space-x-6">
              {isLoggedIn ? (
                <>
                  <div
                    className="relative cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    ref={notificationsRef}
                  >
                    <Bell className="h-6 w-6 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadNotificationsCount}
                      </span>
                    )}

                    {/* Notifications dropdown */}
                    {notificationsOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                          <h3 className="text-sm font-semibold">
                            Notifications
                          </h3>
                          {unreadNotificationsCount > 0 && (
                            <button
                              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 cursor-pointer"
                              onClick={handleMarkAllAsRead}
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notificationsData.length > 0 ? (
                            notificationsData.map((notification) => (
                              <div
                                key={notification.id}
                                className={`px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 ${
                                  notification.read
                                    ? ""
                                    : "bg-indigo-50 dark:bg-indigo-900/20"
                                } cursor-pointer`}
                                onClick={() =>
                                  handleNotificationClick(notification)
                                }
                              >
                                <div className="flex items-start">
                                  <div
                                    className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                                      notification.type === "reply"
                                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                                        : notification.type === "like"
                                        ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                    }`}
                                  >
                                    {notification.type === "reply" ? (
                                      <MessageSquare size={16} />
                                    ) : notification.type === "like" ? (
                                      <ThumbsUp size={16} />
                                    ) : (
                                      <Bell size={16} />
                                    )}
                                  </div>
                                  <div className="ml-3 flex-1">
                                    <p className="text-sm text-gray-900 dark:text-gray-100">
                                      {notification.content}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      {formatDate(notification.createdAt)}
                                    </p>
                                  </div>
                                  {!notification.read && (
                                    <div className="ml-2 h-2 w-2 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                              <p>No notifications yet</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 cursor-pointer relative">
                    <div
                      className="flex items-center space-x-2"
                      onClick={() =>
                        setProfileDropdownOpen(!profileDropdownOpen)
                      }
                    >
                      <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white overflow-hidden transition-transform duration-200 hover:-translate-y-1">
                        {currentUser?.avatar ? (
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.username}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User size={18} />
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">
                          {currentUser?.username || "Profile"}
                        </span>
                        <ChevronDown size={16} className="ml-1 text-gray-500" />
                      </div>
                    </div>

                    {profileDropdownOpen && (
                      <div className="absolute top-12 right-0 w-48 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-40 border border-gray-200 dark:border-gray-700">
                        <div className="py-1">
                          <button
                            className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left cursor-pointer"
                            onClick={handleLogout}
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 font-medium cursor-pointer"
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsRegisterMode(false);
                    }}
                  >
                    Log in
                  </button>
                  <button
                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 font-medium cursor-pointer"
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsRegisterMode(true);
                    }}
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => {
                  setMobileMenuOpen(!mobileMenuOpen);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 cursor-pointer"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg z-40 transition-all duration-200 ease-in-out">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md transition-colors duration-150 cursor-pointer ${
                view === "categories"
                  ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => {
                handleBackToCategories();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <Home size={18} />
              <span>Home</span>
            </button>
          </div>

          {/* Mobile search bar */}
          <div className="px-4 py-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  performSearch(e.target.value);
                }}
                onFocus={() => {
                  // Navigate to categories view when searching
                  if (view !== "categories") {
                    handleBackToCategories();
                  }
                }}
              />
              {searchQuery && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 cursor-pointer"
                    onClick={() => {
                      setSearchQuery("");
                      setIsSearching(false);
                    }}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile notifications panel */}
          {isLoggedIn && (
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                {unreadNotificationsCount > 0 && (
                  <button
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 cursor-pointer"
                    onClick={handleMarkAllAsRead}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700">
                {notificationsData.length > 0 ? (
                  notificationsData.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 ${
                        notification.read
                          ? ""
                          : "bg-indigo-50 dark:bg-indigo-900/20"
                      } cursor-pointer`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start">
                        <div
                          className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                            notification.type === "reply"
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                              : notification.type === "like"
                              ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {notification.type === "reply" ? (
                            <MessageSquare size={16} />
                          ) : notification.type === "like" ? (
                            <ThumbsUp size={16} />
                          ) : (
                            <Bell size={16} />
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            {notification.content}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="ml-2 h-2 w-2 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    <p>No notifications yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile user options */}
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            {isLoggedIn && currentUser ? (
              <>
                <div className="flex items-center px-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white overflow-hidden">
                    {currentUser?.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.username}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium">
                      {currentUser.username}
                    </div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {currentUser.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  <button className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left transition-colors duration-150 cursor-pointer">
                    Your Profile
                  </button>
                  <button className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left transition-colors duration-150 cursor-pointer">
                    Settings
                  </button>
                  <button
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full transition-colors duration-150 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />
                    <span>Sign out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="px-4 py-2 space-y-2">
                <button
                  className="w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 transition-colors duration-150 cursor-pointer"
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsRegisterMode(false);
                    setMobileMenuOpen(false);
                  }}
                >
                  Log in
                </button>
                <button
                  className="w-full px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150 cursor-pointer"
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsRegisterMode(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            {/* Backdrop */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setIsLoginModalOpen(false)} // Close when clicking backdrop
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            {/* Modal Container */}
            <div
              className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50"
              // Stop propagation to prevent closing when clicking inside the modal
              onClick={(e) => e.stopPropagation()}
              ref={loginModalRef}
            >
              {/* Close button */}
              <div className="absolute top-0 right-0 pt-4 pr-4 z-50">
                <button
                  type="button"
                  className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                  onClick={() => setIsLoginModalOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {isRegisterMode
                        ? "Create an account"
                        : "Sign in to your account"}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {isRegisterMode
                          ? "Join our community to start discussions and connect with others."
                          : "Welcome back! Please enter your credentials to continue."}
                      </p>
                    </div>

                    <div className="mt-6">
                      <form
                        onSubmit={isRegisterMode ? handleRegister : handleLogin}
                      >
                        {/* Username field - only for registration */}
                        {isRegisterMode && (
                          <div className="mb-4">
                            <label
                              htmlFor="username"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Username
                            </label>
                            <div className="mt-1">
                              <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="Choose a username"
                              />
                            </div>
                          </div>
                        )}

                        {/* Email field */}
                        <div className="mb-4">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Email address
                          </label>
                          <div className="mt-1">
                            <input
                              id="email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Enter your email"
                            />
                          </div>
                        </div>

                        {/* Password field */}
                        <div className="mb-6">
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Password
                          </label>
                          <div className="mt-1 relative">
                            <input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              autoComplete={
                                isRegisterMode
                                  ? "new-password"
                                  : "current-password"
                              }
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
                              placeholder={
                                isRegisterMode
                                  ? "Create a password"
                                  : "Enter your password"
                              }
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 cursor-pointer"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                          {isRegisterMode && (
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              Password must be at least 8 characters
                            </p>
                          )}
                        </div>

                        {/* Error and success messages */}
                        {loginError && (
                          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md flex items-start">
                            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{loginError}</span>
                          </div>
                        )}

                        {loginSuccess && (
                          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md flex items-start">
                            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{loginSuccess}</span>
                          </div>
                        )}

                        {/* Submit button */}
                        <button
                          type="submit"
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 cursor-pointer"
                        >
                          {isRegisterMode ? "Create account" : "Sign in"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-4 bg-gray-50 dark:bg-gray-700 sm:px-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isRegisterMode
                    ? "Already have an account?"
                    : "Don't have an account?"}
                  <button
                    className="ml-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium cursor-pointer"
                    onClick={() => setIsRegisterMode(!isRegisterMode)}
                  >
                    {isRegisterMode ? "Sign in" : "Create one"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {(view === "categories" || view === "threads") && (
        <div className="md:hidden fixed right-4 bottom-4 z-10">
          <button
            onClick={() => {
              if (isLoggedIn) {
                setIsNewDiscussionModalOpen(true);
                // Set default category
                if (view === "threads" && selectedCategory) {
                  setNewDiscussionCategory(selectedCategory.id);
                } else if (categories.length > 0) {
                  setNewDiscussionCategory(categories[0].id);
                }
              } else {
                setIsLoginModalOpen(true);
                setIsRegisterMode(false);
              }
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 cursor-pointer"
            aria-label="Start new discussion"
          >
            <PlusCircle size={24} />
          </button>
        </div>
      )}

      {isNewDiscussionModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            {/* Backdrop */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setIsNewDiscussionModalOpen(false)}
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            {/* Modal Container */}
            <div
              className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full relative z-50"
              onClick={(e) => e.stopPropagation()}
              ref={newDiscussionModalRef}
            >
              {/* Close button */}
              <div className="absolute top-0 right-0 pt-4 pr-4 z-50">
                <button
                  type="button"
                  className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                  onClick={() => setIsNewDiscussionModalOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
                      <PlusCircle className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      Start a New Discussion
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Share your thoughts, questions, or ideas with the
                        community.
                      </p>
                    </div>

                    <div className="mt-6">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSubmitNewDiscussion();
                        }}
                      >
                        {/* Category Selection */}
                        <div className="mb-4">
                          <label
                            htmlFor="category"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Category
                          </label>
                          <div className="mt-1">
                            <select
                              id="category"
                              name="category"
                              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              value={newDiscussionCategory || ""}
                              onChange={(e) =>
                                setNewDiscussionCategory(Number(e.target.value))
                              }
                              required
                            >
                              <option value="" disabled>
                                Select a category
                              </option>
                              {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Title Field */}
                        <div className="mb-4">
                          <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Title
                          </label>
                          <div className="mt-1">
                            <input
                              id="title"
                              name="title"
                              type="text"
                              required
                              value={newDiscussionTitle}
                              onChange={(e) =>
                                setNewDiscussionTitle(e.target.value)
                              }
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Enter a descriptive title for your discussion"
                              maxLength={100}
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {newDiscussionTitle.length}/100 characters
                          </p>
                        </div>

                        {/* Content Field */}
                        <div className="mb-6">
                          <label
                            htmlFor="content"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Content
                          </label>
                          <div className="mt-1">
                            <textarea
                              id="content"
                              name="content"
                              rows={6}
                              required
                              ref={newDiscussionContentRef}
                              value={newDiscussionContent}
                              onChange={(e) =>
                                setNewDiscussionContent(e.target.value)
                              }
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Describe your question or discussion topic in detail"
                            />
                          </div>
                        </div>

                        {/* Error and success messages */}
                        {formError && (
                          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md flex items-start">
                            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{formError}</span>
                          </div>
                        )}

                        {formSuccess && (
                          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md flex items-start">
                            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{formSuccess}</span>
                          </div>
                        )}

                        {/* Submit button */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 cursor-pointer ${
                            isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                          }`}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center">
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Creating Discussion...
                            </span>
                          ) : (
                            "Post Discussion"
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-4 bg-gray-50 dark:bg-gray-700 sm:px-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  By posting, you agree to our{" "}
                  <a
                    href="#"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                  >
                    community guidelines
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories View */}
        {isSearching && searchResults.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Search Results
              </h2>
              <button
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 cursor-pointer"
                onClick={() => {
                  setSearchQuery("");
                  setIsSearching(false);
                }}
              >
                Clear search
              </button>
            </div>
            <div className="space-y-4">
              {searchResults.map((thread) => (
                <div
                  key={thread.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer"
                  onClick={() => {
                    // First navigate to the thread's category
                    const category = categories.find(
                      (c) => c.id === thread.categoryId
                    );
                    if (category) {
                      setSelectedCategory(category);
                      setView("threads");
                      // Then navigate to the thread
                      setTimeout(() => {
                        handleThreadClick(thread);
                      }, 100);
                    }
                  }}
                >
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center overflow-hidden">
                          {thread.authorAvatar ? (
                            <img
                              src={thread.authorAvatar}
                              alt={thread.author}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="font-medium text-indigo-800 dark:text-indigo-200">
                              {thread.author.charAt(0)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white">
                          {thread.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                          {thread.content}
                        </p>
                        <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <span className="mr-2">
                            in{" "}
                            {
                              categories.find((c) => c.id === thread.categoryId)
                                ?.name
                            }
                          </span>
                          <span>• {formatDate(thread.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "categories" && (
          <div className="opacity-100 transition-opacity duration-300">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex gap-4 md:items-center md:flex-row flex-col">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome to CommunityHub
                </h1>
                <NewDiscussionButton />
              </div>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Join discussions on your favorite topics and connect with
                like-minded individuals.
              </p>
            </div>

            {/* Show "no results" when searching with no matches */}
            {isSearching &&
              searchResults.length === 0 &&
              searchQuery.trim() !== "" && (
                <div className="mb-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
                  <Search className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    No results found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    No threads match your search query "{searchQuery}"
                  </p>
                </div>
              )}

            {/* Only show regular content when not searching or search is empty */}
            {(!isSearching || searchQuery.trim() === "") && (
              <>
                {/* Popular Discussions Section */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Popular Discussions
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {popularThreads.map((thread) => (
                      <div
                        key={thread.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer"
                        onClick={() => {
                          // First navigate to the thread's category
                          const category = categories.find(
                            (c) => c.id === thread.categoryId
                          );
                          if (category) {
                            setSelectedCategory(category);
                            setView("threads");
                            // Then navigate to the thread
                            setTimeout(() => {
                              handleThreadClick(thread);
                            }, 100);
                          }
                        }}
                      >
                        <div className="p-5">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center overflow-hidden">
                                {thread.authorAvatar ? (
                                  <img
                                    src={thread.authorAvatar}
                                    alt={thread.author}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <span className="font-medium text-indigo-800 dark:text-indigo-200">
                                    {thread.author.charAt(0)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="ml-4 flex-1">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                {thread.title}
                              </h3>
                              <p className="mt-1 text-gray-600 dark:text-gray-400 line-clamp-2">
                                {thread.content}
                              </p>
                              <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                {/* Replies & Views */}
                                <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                                  <div className="flex items-center">
                                    <MessageSquare size={16} className="mr-1" />
                                    <span>{thread.replies.length} replies</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Users size={16} className="mr-1" />
                                    <span>{thread.views} views</span>
                                  </div>
                                </div>

                                {/* Category Name */}
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {
                                    categories.find(
                                      (c) => c.id === thread.categoryId
                                    )?.name
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categories Grid */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Browse Categories
                    </h2>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer"
                        onClick={() => handleCategoryClick(category)}
                      >
                        <div className="p-6">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900 rounded-lg p-3">
                              {category.icon}
                            </div>
                            <div className="ml-4">
                              <h2 className="text-xl font-semibold">
                                {category.name}
                              </h2>
                              <p className="mt-1 text-gray-600 dark:text-gray-400">
                                {category.description}
                              </p>
                              <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <MessageSquare size={16} className="mr-1" />
                                <span>
                                  {getThreadCount(category.id)} discussions
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Recent Activity
                    </h2>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {recentActivity.map((thread) => (
                        <li key={thread.id}>
                          <div
                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 cursor-pointer"
                            onClick={() => {
                              // First navigate to the thread's category
                              const category = categories.find(
                                (c) => c.id === thread.categoryId
                              );
                              if (category) {
                                setSelectedCategory(category);
                                setView("threads");
                                // Then navigate to the thread
                                setTimeout(() => {
                                  handleThreadClick(thread);
                                }, 100);
                              }
                            }}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                              {/* Left: Avatar, Title, Author */}
                              <div className="flex items-start">
                                <div className="flex-shrink-0">
                                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center overflow-hidden">
                                    {thread.authorAvatar ? (
                                      <img
                                        src={thread.authorAvatar}
                                        alt={thread.author}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <span className="font-medium text-indigo-800 dark:text-indigo-200">
                                        {thread.author.charAt(0)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {thread.title}
                                  </p>
                                  <div className="flex flex-col sm:flex-row sm:items-center mt-1 text-xs text-gray-500 dark:text-gray-400 space-y-1 sm:space-y-0 sm:space-x-2">
                                    <span>by {thread.author}</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span>
                                      in{" "}
                                      {
                                        categories.find(
                                          (c) => c.id === thread.categoryId
                                        )?.name
                                      }
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Right: Date */}
                              <div className="text-xs text-gray-500 dark:text-gray-400 sm:ml-4 sm:mt-0">
                                {formatDate(thread.updatedAt)}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Community Stats */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Community Stats
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
                      <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {threads.length}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Discussions
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
                      <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {threads.reduce(
                          (total, thread) => total + thread.replies.length,
                          0
                        )}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Replies
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
                      <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {categories.length}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Categories
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
                      <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {users.length}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Members
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Threads View */}
        {view === "threads" && selectedCategory && (
          <div className="opacity-100 transition-opacity duration-300">
            <div className="flex items-center mb-6">
              <button
                className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 cursor-pointer"
                onClick={handleBackToCategories}
              >
                <ArrowUp className="transform rotate-270 h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <div className="mr-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg p-2">
                  {selectedCategory.icon}
                </div>
                {selectedCategory.name}
              </h1>
            </div>

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <p className="text-gray-600 dark:text-gray-400">
                {selectedCategory.description}
              </p>

              <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                <NewDiscussionButton />

                <div className="relative inline-block text-left">
                  <button
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    <Filter size={16} className="mr-2" />
                    <span>
                      Sort by:{" "}
                      {sortOption === "newest" ? "Newest" : "Most Active"}
                    </span>
                    <ChevronDown size={16} className="ml-2" />
                  </button>

                  {sortDropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-36 sm:w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 border border-gray-200 dark:border-gray-700">
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                      >
                        <button
                          className={`block w-full text-left px-4 py-2 text-sm cursor-pointer ${
                            sortOption === "newest"
                              ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => {
                            setSortOption("newest");
                            setSortDropdownOpen(false);
                          }}
                        >
                          Newest
                        </button>
                        <button
                          className={`block w-full text-left px-4 py-2 text-sm cursor-pointer ${
                            sortOption === "active"
                              ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => {
                            setSortOption("active");
                            setSortDropdownOpen(false);
                          }}
                        >
                          Most Active
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {getSortedThreads().length > 0 ? (
                getSortedThreads().map((thread) => (
                  <div
                    key={thread.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer"
                    onClick={() => handleThreadClick(thread)}
                  >
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0 mb-3 sm:mb-0">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center overflow-hidden">
                            {thread.authorAvatar ? (
                              <img
                                src={thread.authorAvatar}
                                alt={thread.author}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="font-medium text-indigo-800 dark:text-indigo-200">
                                {thread.author.charAt(0)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Thread content */}
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {thread.title}
                          </h3>
                          <p className="mt-1 text-gray-600 dark:text-gray-400 line-clamp-2">
                            {thread.content}
                          </p>

                          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                            {/* Replies & Views */}
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center">
                                <MessageSquare size={16} className="mr-1" />
                                <span>{thread.replies.length} replies</span>
                              </div>
                              <div className="flex items-center">
                                <Users size={16} className="mr-1" />
                                <span>{thread.views} views</span>
                              </div>
                            </div>

                            {/* Updated time */}
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <Clock size={16} className="mr-1" />
                              <span>
                                Updated {formatDate(thread.updatedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                    No threads found
                  </h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    {searchQuery
                      ? "No threads match your search query."
                      : "Be the first to start a discussion!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Thread Detail View */}
        {view === "thread" && selectedThread && (
          <div className="opacity-100 transition-opacity duration-300">
            <div className="flex items-center mb-6">
              <button
                className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 cursor-pointer"
                onClick={handleBackToThreads}
              >
                <ArrowUp className="transform rotate-270 h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white line-clamp-1">
                {selectedThread.title}
              </h1>
            </div>

            {/* Original post */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center overflow-hidden">
                      {selectedThread.authorAvatar ? (
                        <img
                          src={selectedThread.authorAvatar}
                          alt={selectedThread.author}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="font-medium text-indigo-800 dark:text-indigo-200">
                          {selectedThread.author.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {selectedThread.author}
                        </h3>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          <p>Posted {formatDate(selectedThread.createdAt)}</p>
                          {selectedThread.updatedAt.getTime() !== selectedThread.createdAt.getTime() && (
                            <p className="flex items-center mt-1">
                              <Clock size={14} className="mr-1" />
                              Last updated {formatDate(selectedThread.updatedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                      {selectedThread.isHelpful && (
                        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-3 py-1 rounded-full flex items-center">
                          <Award size={14} className="mr-1" />
                          Helpful
                        </div>
                      )}
                    </div>
                    <div className="prose prose-indigo dark:prose-invert max-w-none">
                      <p className="text-gray-900 dark:text-gray-100">
                        {selectedThread.content}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <MessageSquare size={16} className="mr-1" />
                          <span>{selectedThread.replies.length} replies</span>
                        </div>
                        <div className="flex items-center">
                          <Users size={16} className="mr-1" />
                          <span>{selectedThread.views} views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Replies */}
            <div className="space-y-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedThread.replies.length} Replies
              </h2>

              {selectedThread.replies.map((reply) => (
                <div
                  key={reply.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 fade-in"
                >
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center overflow-hidden">
                          {reply.authorAvatar ? (
                            <img
                              src={reply.authorAvatar}
                              alt={reply.author}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="font-medium text-indigo-800 dark:text-indigo-200">
                              {reply.author.charAt(0)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {reply.author}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Replied {formatDate(reply.createdAt)}
                            </p>
                          </div>
                          {reply.isHelpful && (
                            <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-3 py-1 rounded-full flex items-center">
                              <Award size={14} className="mr-1" />
                              Helpful
                            </div>
                          )}
                        </div>
                        <div className="prose prose-indigo dark:prose-invert max-w-none">
                          <p className="text-gray-900 dark:text-gray-100">
                            {reply.content}
                          </p>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button
                            className={`inline-flex items-center text-sm ${
                              reply.isHelpful
                                ? "text-indigo-600 dark:text-indigo-400"
                                : "text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                            } transition-colors duration-200 cursor-pointer`}
                            onClick={() => {
                              if (!isLoggedIn) {
                                setIsLoginModalOpen(true);
                                return;
                              }
                              handleMarkAsHelpful(reply.id);
                            }}
                          >
                            <ThumbsUp size={16} className="mr-1" />
                            {reply.isHelpful
                              ? "Marked as helpful"
                              : "Mark as helpful"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply box */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Post a reply
                </h2>
                {isLoggedIn ? (
                  <div className="space-y-4">
                    <textarea
                      ref={replyInputRef}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                      rows={4}
                      placeholder="Write your reply here..."
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <button
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 cursor-pointer ${
                          newReply.trim() === ""
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={handleSubmitReply}
                        disabled={newReply.trim() === ""}
                      >
                        <MessageSquare size={16} className="mr-2" />
                        Post Reply
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      You need to be logged in to post a reply.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-colors duration-200 cursor-pointer"
                        onClick={() => {
                          setIsLoginModalOpen(true);
                          setIsRegisterMode(false);
                        }}
                      >
                        Log in
                      </button>
                      <button
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm transition-colors duration-200 cursor-pointer"
                        onClick={() => {
                          setIsLoginModalOpen(true);
                          setIsRegisterMode(true);
                        }}
                      >
                        Sign up
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <span className="text-lg font-bold tracking-tight">
                  CommunityHub
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                CommunityHub is a platform for meaningful discussions and
                knowledge sharing. Connect with like-minded individuals across
                various topics and interests.
              </p>
              <div className="mt-4 flex space-x-5">
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <span className="sr-only">GitHub</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    Guidelines
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    API
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    Developers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              &copy; {new Date().getFullYear()} CommunityHub. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CommunityDiscussion;

// Zod Schema
export const Schema = {
    "commentary": "I will build a community forum where users can browse categories, read discussions, and post their own topics. The homepage will list discussion categories, each category page will show recent threads, and each thread page will display replies and allow new comments. There will be buttons to sort threads and mark posts as helpful. The layout will be organized and easy to read, using Next.js and TypeScript for a responsive and interactive experience.",
    "template": "nextjs-developer",
    "title": "Community Forum",
    "description": "A platform for users to discuss various topics in an organized manner.",
    "port": 3000,
    "file_path": "pages/index.tsx",
    "code": "<see code above>",
    "additional_dependencies": ["lucide-react"],
    "has_additional_dependencies": true,
    "install_dependencies_command": "npm install lucide-react"
}