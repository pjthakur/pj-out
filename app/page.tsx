"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Users, Bell, MessageCircle, Settings, Moon, Sun,
  Heart, MessageSquare, Share2, MoreHorizontal, Send, X,
  ChevronUp, ChevronDown, User, LogOut, Check, AlertTriangle,
  Bookmark, Compass, TrendingUp, Camera, Calendar, Gift,
  Zap, DollarSign, Music, Film, Coffee, Activity, ThumbsUp,
  Trash
} from "lucide-react";
import { Home as HomeIcon } from "lucide-react";

export default function LetsConnect() {
  const [theme, setTheme] = useState("dark");
  const [searchQuery, setSearchQuery] = useState("");
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [minimizedChats, setMinimizedChats] = useState<number[]>([]);
  const [messages, setMessages] = useState<Record<number, { text: string, sender: 'user' | 'friend', timestamp: Date }[]>>({});
  const [newMessage, setNewMessage] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [friendsListOpen, setFriendsListOpen] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [comments, setComments] = useState<Record<number, { id: number, user: string, avatar: string, text: string, timestamp: string }[]>>({});
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'info' | 'success' | 'warning' } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Mock notifications
  const notifications = [
    { id: 1, user: "Alex Guerrero", avatar: "https://i.pravatar.cc/150?img=1", text: "liked your post", time: "5 min ago" },
    { id: 2, user: "Sara Mendoza", avatar: "https://i.pravatar.cc/150?img=5", text: "commented on your photo", time: "10 min ago" },
    { id: 3, user: "Nick Powell", avatar: "https://i.pravatar.cc/150?img=12", text: "sent you a friend request", time: "1 hour ago" },
  ];

  useEffect(() => {
    // Get the theme from localStorage or default to light
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("theme") || "light";
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark-mode", savedTheme === "dark");

      // Add Montserrat font
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(link);

      // Apply Montserrat font to body
      document.body.style.fontFamily = "'Montserrat', sans-serif";
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom of messages when new message is added
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeChatId]);

  // Prevent body scroll when any popup is open on mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        // Check if any popup is open and visible on mobile
        const anyPopupOpen = (
          (activeChatId && !minimizedChats.includes(activeChatId)) || 
          notificationsOpen || 
          friendsListOpen || 
          profileMenuOpen
        );
        
        if (window.innerWidth < 640 && anyPopupOpen) {
          // Prevent scrolling on the body
          document.body.style.overflow = 'hidden';
        } else {
          // Allow scrolling
          document.body.style.overflow = 'auto';
        }
      };
      
      // Initial call
      handleResize();
      
      // Add resize listener
      window.addEventListener('resize', handleResize);
      
      // Cleanup function to restore scrolling and remove event listener
      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeChatId, minimizedChats, notificationsOpen, friendsListOpen, profileMenuOpen]);

  // Helper function to prevent touch events from propagating to the background
  const preventBackgroundScroll = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
  }, []);

  // Generate more posts when scrolling
  const generatePosts = useCallback((pageNum: number) => {
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const newPosts = Array.from({ length: 3 }, (_, i) => {
        const postId = (pageNum - 1) * 3 + i + 1;
        const uniqueId = postId + Date.now(); // Ensure each ID is truly unique by adding timestamp
        return {
          id: uniqueId,
          user: {
            name: ["Alex Guerrero", "Edward Kelly", "Sandra Rivera", "Marie Jackson", "Nick Powell"][Math.floor(Math.random() * 5)],
            avatar: `https://i.pravatar.cc/150?img=${postId % 30 + 1}`
          },
          image: `https://picsum.photos/800/600?random=${postId + 10}`,
          likes: Math.floor(Math.random() * 1500) + 100,
          comments: Math.floor(Math.random() * 500) + 10,
          hasLiked: false,
          tags: [`#tag${postId}`, `#trend${postId % 5 + 1}`],
          text: "In at iaculis lorem. Praesent tempor dictum tellus ut molestie. Sed sed ullamcorper lorem. Id faucibus odio. Duis eu nisi ut ligula cursus molestie at at dolor."
        };
      });

      setPosts(prev => [...prev, ...newPosts]);
      setLoading(false);
    }, 800);
  }, []);

  // Setup infinite scroll observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observerRef.current.observe(loaderRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading]);

  // Load more posts when page changes
  useEffect(() => {
    generatePosts(page);
  }, [page, generatePosts]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem("theme", newTheme);
    }
    document.documentElement.classList.toggle("dark-mode", newTheme === "dark");
  };

  // Mock data for users
  const users = [
    { id: 1, name: "Alex Guerrero", avatar: "https://i.pravatar.cc/150?img=1", online: true, lastSeen: "10 min" },
    { id: 2, name: "Sara Mendoza", avatar: "https://i.pravatar.cc/150?img=5", online: true, lastSeen: "" },
    { id: 3, name: "Ronald Roberts", avatar: "https://i.pravatar.cc/150?img=8", online: true, lastSeen: "" },
    { id: 4, name: "Nancy Lee", avatar: "https://i.pravatar.cc/150?img=9", online: false, lastSeen: "12 min" },
    { id: 5, name: "Marie Jackson", avatar: "https://i.pravatar.cc/150?img=10", online: false, lastSeen: "7 min" },
    { id: 6, name: "Nick Powell", avatar: "https://i.pravatar.cc/150?img=12", online: true, lastSeen: "" },
    { id: 7, name: "Alex Freeman", avatar: "https://i.pravatar.cc/150?img=15", online: true, lastSeen: "" },
    { id: 8, name: "Sandra Rivera", avatar: "https://i.pravatar.cc/150?img=25", online: false, lastSeen: "12 min" },
    { id: 9, name: "Jerry Jordan", avatar: "https://i.pravatar.cc/150?img=29", online: true, lastSeen: "" },
  ];

  // Mock data for groups
  const groups = [
    { id: 101, name: "Kelly Powell", avatar: "https://i.pravatar.cc/150?img=30", lastSeen: "1h", members: [1, 5, 8] }
  ];

  // Sidebar items
  const sidebarItems = [
    { icon: <HomeIcon className={`w-5 h-5 ${theme === "dark" ? "text-white" : "text-gray-700"}`} />, text: "Feed" },
    { icon: <Users className={`w-5 h-5 ${theme === "dark" ? "text-white" : "text-gray-700"}`} />, text: "Friends" },
    { icon: <Bell className={`w-5 h-5 ${theme === "dark" ? "text-white" : "text-gray-700"}`} />, text: "Event" },
    { icon: <MessageCircle className={`w-5 h-5 ${theme === "dark" ? "text-white" : "text-gray-700"}`} />, text: "Watch Videos" },
    { icon: <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWltYWdlIj48cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiByeT0iMiIvPjxjaXJjbGUgY3g9IjguNSIgY3k9IjguNSIgcj0iMS41Ii8+PHBvbHlsaW5lIHBvaW50cz0iMjEgMTUgMTYgMTAgNSAyMSIvPjwvc3ZnPg==" alt="" style={{ width: '1.25rem', height: '1.25rem', filter: theme === "dark" ? "invert(1)" : "" }} />, text: "Photos" },
    { icon: <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWZpbGUiPjxwYXRoIGQ9Ik0xNC41IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3LjVMIDE0LjUgMnoiLz48cG9seWxpbmUgcG9pbnRzPSIxNCAyIDE0IDggMjAgOCIvPjwvc3ZnPg==" alt="" style={{ width: '1.25rem', height: '1.25rem', filter: theme === "dark" ? "invert(1)" : "" }} />, text: "Files" }
  ];

  // Pages you like
  const likedPages = [
    { text: "Fashion Design", badge: null },
    { text: "Graphic Design", badge: "20" },
    { text: "UI/UX Community", badge: null },
    { text: "Web Designer", badge: null }
  ];

  // Initialize mock comments
  useEffect(() => {
    const initialComments: Record<number, { id: number, user: string, avatar: string, text: string, timestamp: string }[]> = {};

    // Add some initial comments to the first few posts
    for (let i = 1; i <= 5; i++) {
      initialComments[i] = [
        {
          id: 1,
          user: "Alex Freeman",
          avatar: "https://i.pravatar.cc/150?img=15",
          text: "This is amazing! Love the view.",
          timestamp: "2 hours ago"
        },
        {
          id: 2,
          user: "Sara Mendoza",
          avatar: "https://i.pravatar.cc/150?img=5",
          text: "Wish I could be there right now!",
          timestamp: "1 hour ago"
        }
      ];
    }

    setComments(initialComments);
  }, []);

  // Handle post interactions
  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        // Toggle like status
        const newLikeStatus = !post.hasLiked;
        return {
          ...post,
          hasLiked: newLikeStatus,
          likes: newLikeStatus ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  const handleComment = (postId: number) => {
    // Focus on comment input or show comment section
    const commentSection = document.getElementById(`comment-section-${postId}`);
    if (commentSection) {
      commentSection.classList.remove('hidden');
      const commentInput = document.getElementById(`comment-input-${postId}`) as HTMLInputElement;
      if (commentInput) {
        commentInput.focus();
      }
    }
  };

  const addComment = (postId: number) => {
    if (commentInputs[postId]?.trim()) {
      const newComment = {
        id: (comments[postId]?.length || 0) + 1,
        user: "You",
        avatar: "https://i.pravatar.cc/150?img=68",
        text: commentInputs[postId],
        timestamp: "Just now"
      };

      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment]
      }));

      setCommentInputs(prev => ({
        ...prev,
        [postId]: ""
      }));
    }
  };

  const handleShare = (postId: number) => {
    // Copy a mock share link to clipboard
    const shareUrl = `https://letsconnect.example/post/${postId}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        // Show toast notification
        setToast({
          show: true,
          message: 'Link copied to clipboard!',
          type: 'success'
        });

        // Auto-hide toast after 3 seconds
        setTimeout(() => {
          setToast(null);
        }, 3000);
      });
  };

  // Chat functionality
  const startChat = (userId: number) => {
    setActiveChatId(userId);
    if (!messages[userId]) {
      setMessages(prev => ({
        ...prev,
        [userId]: []
      }));
    }
  };

  const closeChat = () => {
    setActiveChatId(null);
  };

  const toggleMinimizeChat = (userId: number) => {
    if (minimizedChats.includes(userId)) {
      setMinimizedChats(minimizedChats.filter(id => id !== userId));
    } else {
      setMinimizedChats([...minimizedChats, userId]);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeChatId && newMessage.trim()) {
      const message = {
        text: newMessage.trim(),
        sender: 'user' as const,
        timestamp: new Date()
      };

      setMessages(prev => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), message]
      }));

      setNewMessage("");

      // Simulate response after 1 second
      setTimeout(() => {
        // Different response format for group vs individual chat
        const isGroupChat = activeChatId >= 100;
        
        const friendMessage = {
          text: isGroupChat 
            ? `This is a response in the ${groups.find(g => g.id === activeChatId)?.name} group chat` 
            : `Thanks for your message: "${newMessage.trim()}"`,
          sender: 'friend' as const,
          timestamp: new Date()
        };

        setMessages(prev => ({
          ...prev,
          [activeChatId]: [...(prev[activeChatId] || []), friendMessage]
        }));
      }, 1000);
    }
  };

  // Handle coming soon feature
  const handleFeatureLink = (e: React.MouseEvent<HTMLAnchorElement>, featureName: string) => {
    e.preventDefault();
    setToast({ show: true, message: `${featureName} feature is coming soon!`, type: 'info' });

    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Delete a comment
  const deleteComment = (postId: number, commentId: number) => {
    setComments(prev => ({
      ...prev,
      [postId]: prev[postId].filter(comment => comment.id !== commentId)
    }));

    // Show success toast
    setToast({
      show: true,
      message: 'Comment deleted successfully',
      type: 'success'
    });

    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Create a random gradient background for posts
  const getRandomGradient = () => {
    const gradients = [
      'from-teal-500 to-emerald-500',
      'from-amber-500 to-orange-500',
      'from-cyan-500 to-blue-500',
      'from-fuchsia-500 to-pink-500',
      'from-violet-500 to-indigo-500',
      'from-amber-500 to-rose-500',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  // Feature icon library
  const getFeatureIcon = (index: number) => {
    const icons = [
      <Compass className="w-5 h-5 text-cyan-500" key="compass" />,
      <TrendingUp className="w-5 h-5 text-emerald-500" key="trending" />,
      <Camera className="w-5 h-5 text-violet-500" key="camera" />,
      <Calendar className="w-5 h-5 text-rose-500" key="calendar" />,
      <Gift className="w-5 h-5 text-pink-500" key="gift" />,
      <Zap className="w-5 h-5 text-amber-500" key="zap" />,
      <Bookmark className="w-5 h-5 text-indigo-500" key="bookmark" />,
      <DollarSign className="w-5 h-5 text-teal-500" key="dollar" />,
      <Music className="w-5 h-5 text-blue-500" key="music" />,
      <Film className="w-5 h-5 text-orange-500" key="film" />,
      <Coffee className="w-5 h-5 text-amber-500" key="coffee" />,
      <Activity className="w-5 h-5 text-fuchsia-500" key="activity" />,
    ];
    return icons[index % icons.length];
  };

  return (
    <div className={`flex flex-col min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${theme === "dark" ? "bg-gray-800/80 backdrop-blur-lg" : "bg-white/80 backdrop-blur-lg"} shadow-lg`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 font-['Montserrat'] drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">Let's Connect</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <div className="relative w-10 h-10 flex items-center justify-center bg-white/90 rounded-full shadow-sm cursor-pointer"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-indigo-600" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </div>
            
            {/* Friends icon */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/90 shadow-sm flex items-center justify-center cursor-pointer"
                onClick={() => setFriendsListOpen(!friendsListOpen)}
              >
                <Users className="w-5 h-5 text-indigo-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">{users.filter(u => u.online).length}</span>
              </div>

              <AnimatePresence>
                {friendsListOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`fixed sm:absolute left-0 sm:left-auto sm:right-0 top-[78px] sm:top-auto sm:mt-2 w-full sm:w-80 rounded-none sm:rounded-xl shadow-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"} z-50 overflow-hidden`}
                    onTouchStart={preventBackgroundScroll}
                    onTouchMove={preventBackgroundScroll}
                  >
                    <div className="p-3">
                      <h3 className="text-lg font-semibold">Online Friends</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {users.filter(user => user.online).map((user) => (
                        <div
                          key={user.id}
                          className={`flex items-center justify-between cursor-pointer p-2 rounded-lg transition-all ${theme === "dark" 
                            ? "hover:bg-gray-700/70 hover:bg-gradient-to-r hover:from-cyan-800/20 hover:to-blue-800/20" 
                            : "hover:bg-gray-100 hover:bg-gradient-to-r hover:from-cyan-100/70 hover:to-blue-100/70"}`}
                          onClick={() => startChat(user.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <img
                                src={user.avatar}
                                alt=""
                                className={user.online ? "shadow-sm" : ""}
                                style={{ width: '2.5rem', height: '2.5rem', borderRadius: '9999px' }}
                              />
                              {user.online && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                              )}
                            </div>
                            <span>{user.name}</span>
                          </div>
                          {user.lastSeen && (
                            <span className="text-xs text-gray-500">{user.lastSeen}</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="p-2 text-center">
                      <a
                        href="#"
                        onClick={(e) => handleFeatureLink(e, "View all friends")}
                        className={`text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text`}
                      >
                        View all friends
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications icon */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/90 shadow-sm flex items-center justify-center cursor-pointer"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell className="w-5 h-5 text-indigo-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">{notifications.length}</span>
              </div>

              {/* Notifications dropdown */}
              {notificationsOpen && (
                <div 
                  className={`fixed sm:absolute left-0 sm:left-auto sm:right-0 top-[78px] sm:top-auto sm:mt-2 w-full sm:w-80 rounded-none sm:rounded-xl shadow-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"} z-50 overflow-hidden`}
                  onTouchStart={preventBackgroundScroll}
                  onTouchMove={preventBackgroundScroll}
                >
                  <div className="p-3">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notification => (
                      <div key={notification.id} className={`p-3 ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} cursor-pointer`}>
                        <div className="flex items-start space-x-3">
                          <img
                            src={notification.avatar}
                            alt=""
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium">
                              <span className="font-semibold">{notification.user}</span> {notification.text}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 text-center">
                    <a 
                      href="#"
                      onClick={(e) => handleFeatureLink(e, "View all notifications")}
                      className={`text-sm font-medium ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`}
                    >
                      View all notifications
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Profile icon */}
            <div className="relative">
              <div 
                className="w-10 h-10 rounded-full cursor-pointer relative"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <img
                  src="https://images.unsplash.com/photo-1745252279105-f5c6e2785889?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D"
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
              </div>

              {profileMenuOpen && (
                <div 
                  className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden z-50 ${theme === "dark" ? "bg-slate-800" : "bg-white"}`}
                  onTouchStart={preventBackgroundScroll}
                  onTouchMove={preventBackgroundScroll}
                >
                  <div>
                    <a
                      href="#"
                      onClick={(e) => handleFeatureLink(e, "Your Profile")}
                      className={`flex items-center px-4 py-3 text-sm ${theme === "dark" ? "text-white hover:bg-slate-700" : "text-gray-800 hover:bg-gray-100"}`}
                    >
                      <User className="w-5 h-5 mr-3" />
                      Your Profile
                    </a>
                    <a
                      href="#"
                      onClick={(e) => handleFeatureLink(e, "Settings")}
                      className={`flex items-center px-4 py-3 text-sm ${theme === "dark" ? "text-white hover:bg-slate-700" : "text-gray-800 hover:bg-gray-100"}`}
                    >
                      <Settings className="w-5 h-5 mr-3" />
                      Settings
                    </a>
                    <a
                      href="#"
                      onClick={(e) => handleFeatureLink(e, "Sign out")}
                      className={`flex items-center px-4 py-3 text-sm ${theme === "dark" ? "text-white hover:bg-slate-700" : "text-gray-800 hover:bg-gray-100"}`}
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Sign out
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside className={`hidden md:flex flex-col w-64 p-4 space-y-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <a 
                key={index}
                href="#"
                onClick={(e) => handleFeatureLink(e, item.text)}
                className={`flex items-center space-x-3 p-2 rounded-lg ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                {item.icon}
                <span>{item.text}</span>
              </a>
            ))}
          </nav>

          <div className="pt-4">
            <h3 className="text-xs uppercase font-semibold mb-3 text-gray-500 dark:text-gray-400">
              PAGES YOU LIKE
            </h3>
            <nav className="space-y-2">
              {likedPages.map((page, index) => (
                <a 
                  key={index}
                  href="#"
                  onClick={(e) => handleFeatureLink(e, page.text)}
                  className={`flex items-center justify-between p-2 rounded-lg ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={`https://i.pravatar.cc/150?img=${30 + index}`}
                      alt=""
                      style={{ width: '1.5rem', height: '1.5rem', borderRadius: '9999px' }}
                    />
                    <span className="text-sm">{page.text}</span>
                  </div>
                  {page.badge && (
                    <span className={`px-2 py-1 text-xs rounded-full ${theme === "dark" ? "bg-purple-600" : "bg-purple-100 text-purple-800"}`}>
                      {page.badge}
                    </span>
                  )}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4 space-y-6">
            {/* Posts Feed */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]">Recent Post</h2>
              </div>

              {posts.map((post) => (
                <motion.article
                  key={post.id}
                  id={`post-${post.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg overflow-hidden shadow-[0_5px_20px_rgba(6,182,212,0.15)] hover:shadow-[0_8px_25px_rgba(6,182,212,0.25)] transition-shadow relative`}
                >
                  <img
                    src={post.image}
                    alt=""
                    style={{ width: '100%', height: '24rem', objectFit: 'cover' }}
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={post.user.avatar}
                          alt=""
                          className="shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                          style={{ width: '2.5rem', height: '2.5rem', borderRadius: '9999px' }}
                        />
                        <span className="font-medium">{post.user.name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleLike(post.id)}
                          className="flex items-center space-x-1 group"
                        >
                          <Heart
                            className={`w-5 h-5 ${post.hasLiked
                              ? 'text-rose-500 fill-rose-500 filter drop-shadow-[0_0_3px_rgba(244,63,94,0.5)]'
                              : `${theme === "dark" ? "text-gray-400 group-hover:text-rose-400" : "text-gray-500 group-hover:text-rose-500"}`
                              } transition-colors`}
                          />
                          <span className={`text-sm ${post.hasLiked ? 'text-rose-500' : 'text-gray-500'}`}>{post.likes}</span>
                        </button>
                        <button
                          onClick={() => handleComment(post.id)}
                          className="flex items-center space-x-1 group"
                        >
                          <MessageSquare
                            className={`w-5 h-5 ${theme === "dark" ? "text-gray-400 group-hover:text-amber-400" : "text-gray-500 group-hover:text-amber-500"} transition-colors`}
                          />
                          <span className="text-sm text-gray-500">{post.comments}</span>
                        </button>
                        <button
                          onClick={() => handleShare(post.id)}
                          className="flex items-center group"
                        >
                          <Share2 className={`w-5 h-5 ${theme === "dark" ? "text-gray-400 group-hover:text-emerald-400" : "text-gray-500 group-hover:text-emerald-500"} transition-colors`} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex space-x-2 mb-2">
                        {post.tags.map((tag: string, index: number) => (
                          <span key={index} className={`text-sm ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"} filter drop-shadow-[0_0_3px_rgba(6,182,212,0.3)]`}>{tag}</span>
                        ))}
                      </div>
                      <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{post.text}</p>
                    </div>

                    {/* Comments section */}
                    <div id={`comment-section-${post.id}`} className={`mt-4 pt-4 space-y-3 ${comments[post.id] && comments[post.id].length > 0 ? '' : 'hidden'}`}>
                      <h4 className="text-sm font-semibold mb-3">Comments</h4>
                      <div className="space-y-3 mb-3">
                        {comments[post.id]?.map((comment) => (
                          <div key={comment.id} className="flex space-x-2">
                            <img
                              src={comment.avatar}
                              alt=""
                              className="shadow-sm"
                              style={{ width: '2rem', height: '2rem', borderRadius: '9999px' }}
                            />
                            <div className={`flex-1 p-2 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                              <div className="flex justify-between">
                                <span className="text-xs font-semibold">{comment.user}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">{comment.timestamp}</span>
                                  {comment.user === "You" && (
                                    <button
                                      onClick={() => deleteComment(post.id, comment.id)}
                                      className="text-rose-500 hover:text-rose-600 filter hover:drop-shadow-[0_0_3px_rgba(244,63,94,0.5)]"
                                      title="Delete comment"
                                    >
                                      <Trash className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm mt-1">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <img
                          src="https://i.pravatar.cc/150?img=68"
                          alt=""
                          className="shadow-sm"
                          style={{ width: '2rem', height: '2rem', borderRadius: '9999px' }}
                        />
                        <form
                          className="flex-1 flex items-center space-x-2"
                          onSubmit={(e) => {
                            e.preventDefault();
                            addComment(post.id);
                          }}
                        >
                          <input
                            id={`comment-input-${post.id}`}
                            type="text"
                            placeholder="Write a comment..."
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs(prev => ({
                              ...prev,
                              [post.id]: e.target.value
                            }))}
                            className={`flex-1 rounded-full p-3 text-sm ${theme === "dark" ? "bg-gray-700 text-white placeholder-gray-400" : "bg-gray-100 text-gray-800 placeholder-gray-500"} focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                          />
                          <button
                            type="submit"
                            disabled={!commentInputs[post.id]}
                            className={`p-3 rounded-full ${commentInputs[post.id] ? 'bg-cyan-500 text-white' : 'bg-gray-300 text-gray-500'}`}
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}

              {/* Loading indicator */}
              <div ref={loaderRef} className="flex justify-center py-6">
                {loading && (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-600 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                    <span className="text-sm text-gray-500">Loading more posts...</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>

        {/* Right sidebar - Friends */}
        <aside className={`hidden lg:flex flex-col w-80 p-4 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]">FRIENDS</h3>
              <div className="mb-4 relative">
                <input
                  type="text"
                  placeholder="Search friends..."
                  value={friendSearchQuery}
                  onChange={(e) => setFriendSearchQuery(e.target.value)}
                  className={`w-full py-2 px-4 pr-10 rounded-full ${theme === "dark" ? "bg-gray-700 text-white placeholder-gray-400" : "bg-gray-100 text-gray-800 placeholder-gray-500"} focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:shadow-[0_0_10px_rgba(6,182,212,0.5)]`}
                />
                <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {users
                  .filter(user =>
                    user.name.toLowerCase().includes(friendSearchQuery.toLowerCase()) ||
                    friendSearchQuery === ""
                  )
                  .map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between cursor-pointer p-2 rounded-lg transition-all ${theme === "dark" 
                        ? "hover:bg-gray-700/70 hover:bg-gradient-to-r hover:from-cyan-800/20 hover:to-blue-800/20" 
                        : "hover:bg-gray-100 hover:bg-gradient-to-r hover:from-cyan-100/70 hover:to-blue-100/70"}`}
                      onClick={() => startChat(user.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={user.avatar}
                            alt=""
                            className={user.online ? "shadow-sm" : ""}
                            style={{ width: '2.5rem', height: '2.5rem', borderRadius: '9999px' }}
                          />
                          {user.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                          )}
                        </div>
                        <span>{user.name}</span>
                      </div>
                      {user.lastSeen && (
                        <span className="text-xs text-gray-500">{user.lastSeen}</span>
                      )}
                    </div>
                  ))}
                {users.filter(user =>
                  user.name.toLowerCase().includes(friendSearchQuery.toLowerCase()) ||
                  friendSearchQuery === ""
                ).length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      No friends match your search
                    </div>
                  )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">GROUPS</h3>
              <div className="space-y-3">
                {groups.map((group) => (
                  <div 
                    key={group.id} 
                    className={`flex items-center justify-between cursor-pointer p-2 rounded-lg transition-all ${theme === "dark" 
                      ? "hover:bg-gray-700/70 hover:bg-gradient-to-r hover:from-cyan-800/20 hover:to-blue-800/20" 
                      : "hover:bg-gray-100 hover:bg-gradient-to-r hover:from-cyan-100/70 hover:to-blue-100/70"}`}
                    onClick={() => startChat(group.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={group.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full"
                        style={{ width: '2.5rem', height: '2.5rem', borderRadius: '9999px' }}
                      />
                      <span>{group.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{group.lastSeen}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Chat Windows */}
      <div className="fixed bottom-0 right-4 sm:right-4 flex space-x-3 items-end z-40">
        {activeChatId && (
          <div
            className={`fixed sm:relative bottom-0 left-0 sm:left-auto sm:bottom-auto w-full sm:w-72 ${theme === "dark" ? "bg-slate-800" : "bg-white"} rounded-lg sm:rounded-t-lg shadow-lg flex flex-col ${minimizedChats.includes(activeChatId) ? 'h-12' : 'h-[85vh] sm:h-96'} z-50`}
            onTouchStart={preventBackgroundScroll}
            onTouchMove={preventBackgroundScroll}
          >
            {/* Chat header */}
            <div
              className={`p-3 flex justify-between items-center cursor-pointer rounded-t-lg ${theme === "dark" ? "bg-slate-800" : "bg-gray-100"}`}
              onClick={() => toggleMinimizeChat(activeChatId)}
            >
              <div className="flex items-center space-x-2">
                <div className="relative">
                  {activeChatId >= 100 ? (
                    /* Group chat display */
                    <img
                      src={groups.find(g => g.id === activeChatId)?.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full shadow-sm"
                    />
                  ) : (
                    /* Individual chat display */
                    <img
                      src={users.find(u => u.id === activeChatId)?.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full shadow-sm"
                    />
                  )}
                  {activeChatId < 100 && users.find(u => u.id === activeChatId)?.online && (
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  )}
                </div>
                <span className="font-medium text-sm">
                  {activeChatId >= 100 
                    ? groups.find(g => g.id === activeChatId)?.name
                    : users.find(u => u.id === activeChatId)?.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {minimizedChats.includes(activeChatId) ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                <X className="w-4 h-4 hover:text-rose-500 hover:drop-shadow-[0_0_3px_rgba(244,63,94,0.5)]" onClick={(e) => { e.stopPropagation(); closeChat(); }} />
              </div>
            </div>

            {!minimizedChats.includes(activeChatId) && (
              <>
                {/* Chat messages */}
                <div className={`flex-1 p-3 overflow-y-auto space-y-3 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
                  {activeChatId >= 100 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Participants</p>
                      <div className="flex flex-wrap gap-1">
                        {groups.find(g => g.id === activeChatId)?.members.map(memberId => {
                          const member = users.find(u => u.id === memberId);
                          return (
                            <div key={memberId} className={`flex items-center ${theme === "dark" ? "bg-slate-800" : "bg-gray-100"} rounded-full px-2 py-1`}>
                              <div className="relative mr-1">
                                <img 
                                  src={member?.avatar} 
                                  alt="" 
                                  className="w-4 h-4 rounded-full"
                                />
                                {member?.online && (
                                  <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                )}
                              </div>
                              <span className="text-xs">{member?.name.split(' ')[0]}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                
                  {messages[activeChatId] && messages[activeChatId].length > 0 ? (
                    messages[activeChatId].map((message, index) => (
                      <div
                        key={index}
                        className={`${message.sender === 'user'
                          ? 'ml-auto bg-cyan-500 text-white shadow-sm'
                          : `${theme === "dark" ? 'bg-slate-800' : 'bg-gray-200'} ${theme === "dark" ? 'text-white' : 'text-gray-800'}`
                          } p-2 rounded-lg max-w-[80%] break-words`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 text-right">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 text-sm py-4">
                      {activeChatId >= 100
                        ? `Start chatting in the ${groups.find(g => g.id === activeChatId)?.name} group`
                        : `Start chatting with ${users.find(u => u.id === activeChatId)?.name}`
                      }
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat input */}
                <form onSubmit={sendMessage} className={`p-3 flex items-center space-x-2 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className={`flex-1 py-2 px-3 rounded-full ${theme === "dark" ? "bg-slate-800 text-white placeholder-gray-400" : "bg-gray-100 text-gray-800 placeholder-gray-500"} border-none focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-full bg-cyan-500 text-white hover:bg-cyan-600 focus:outline-none"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>

      {/* Toast notification */}
      {toast && toast.show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-[0_5px_15px_rgba(0,0,0,0.2)] flex items-center space-x-2 max-w-xs ${theme === "dark"
            ? "bg-cyan-800 text-white"
            : "bg-white text-gray-900"
            } ${toast.type === 'info'
              ? "shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              : toast.type === 'success'
                ? "shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                : "shadow-[0_0_15px_rgba(251,191,36,0.4)]"
            }`}
        >
          <div className={`p-1 rounded-full ${toast.type === 'info'
            ? "bg-cyan-100 text-cyan-500"
            : toast.type === 'success'
              ? "bg-emerald-100 text-emerald-500"
              : "bg-amber-100 text-amber-500"
            }`}>
            {toast.type === 'info' ? (
              <Bell className="w-4 h-4" />
            ) : toast.type === 'success' ? (
              <Check className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
          </div>
          <p className="text-sm flex-1">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}