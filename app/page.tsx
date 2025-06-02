"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Heart,
  MessageCircle,
  Plus,
  Search,
  Settings,
  Moon,
  Sun,
  MapPin,
  Calendar,
  PawPrint,
  Star,
  User,
  X,
  Send,
  Info,
  Edit3,
  Home,
  Users,
  Megaphone,
  ChevronDown,
  ChevronRight,
  Reply,
  Github,
  Twitter,
  Mail,
  Shield,
} from "lucide-react";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: Date;
  replies?: Comment[];
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  category: "event" | "lost-pet" | "recommendation" | "general";
  timestamp: Date;
  likes: number;
  comments: Comment[];
  location?: string;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
}

const CommunityNoticeBoard = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: "Sarah Johnson",
      avatar: "👩‍💼",
      content:
        "Community BBQ this Saturday at Central Park! Bring your family and friends. We'll have games for kids and live music. Starts at 2 PM.",
      category: "event",
      timestamp: new Date("2025-05-30T10:00:00"),
      likes: 12,
      location: "Central Park",
      comments: [
        {
          id: "1",
          author: "Mike Chen",
          avatar: "👨‍🍳",
          content: "Sounds great! Should I bring anything?",
          timestamp: new Date("2025-05-30T11:30:00"),
          replies: [
            {
              id: "1-1",
              author: "Sarah Johnson",
              avatar: "👩‍💼",
              content: "Maybe some side dishes or drinks would be perfect!",
              timestamp: new Date("2025-05-30T12:00:00"),
            },
            {
              id: "1-2",
              author: "Mike Chen",
              avatar: "👨‍🍳",
              content: "Perfect! I'll bring my famous potato salad 🥗",
              timestamp: new Date("2025-05-30T12:15:00"),
            },
          ],
        },
        {
          id: "2",
          author: "Emma Davis",
          avatar: "👩‍🎨",
          content: "Can I help with decorations? I love organizing events!",
          timestamp: new Date("2025-05-30T13:00:00"),
          replies: [],
        },
      ],
    },
    {
      id: "2",
      author: "Tom Wilson",
      avatar: "😺",
      content:
        "Lost: Orange tabby cat named Whiskers. Last seen near Oak Street. Very friendly, has a blue collar. Please call 555-0123 if found.",
      category: "lost-pet",
      timestamp: new Date("2025-05-29T16:45:00"),
      likes: 8,
      location: "Oak Street",
      comments: [
        {
          id: "3",
          author: "Lisa Brown",
          avatar: "👩‍🦳",
          content:
            "I think I saw an orange cat this morning! I'll keep an eye out.",
          timestamp: new Date("2025-05-29T17:30:00"),
          replies: [
            {
              id: "3-1",
              author: "Tom Wilson",
              avatar: "😺",
              content:
                "Thank you so much! Any sighting helps. Whiskers is very missed.",
              timestamp: new Date("2025-05-29T18:00:00"),
            },
          ],
        },
      ],
    },
    {
      id: "3",
      author: "David Rodriguez",
      avatar: "👨‍🔧",
      content:
        "Highly recommend Johnson's Plumbing! They fixed our kitchen sink yesterday - professional, affordable, and super quick. Ask for Tony!",
      category: "recommendation",
      timestamp: new Date("2025-05-28T14:20:00"),
      likes: 15,
      location: "Maple Street",
      comments: [
        {
          id: "4",
          author: "Jennifer Lee",
          avatar: "👩‍💻",
          content:
            "Thanks for the rec! Our bathroom faucet has been acting up.",
          timestamp: new Date("2025-05-28T15:45:00"),
          replies: [
            {
              id: "4-1",
              author: "David Rodriguez",
              avatar: "👨‍🔧",
              content:
                "Call them at 555-PLUMB, mention my name for a discount!",
              timestamp: new Date("2025-05-28T16:00:00"),
            },
          ],
        },
        {
          id: "5",
          author: "Robert Kim",
          avatar: "👨‍🍳",
          content: "Second this! They helped us last month too. Very reliable.",
          timestamp: new Date("2025-05-28T19:30:00"),
          replies: [],
        },
      ],
    },
    {
      id: "4",
      author: "Maria Garcia",
      avatar: "👩‍🏫",
      content:
        "Neighborhood Watch meeting this Thursday 7 PM at the Community Center. We'll discuss recent security updates and plan the summer safety patrol schedule.",
      category: "general",
      timestamp: new Date("2025-05-27T09:15:00"),
      likes: 23,
      location: "Community Center",
      comments: [
        {
          id: "6",
          author: "Officer James",
          avatar: "👮‍♂️",
          content:
            "I'll be there to present the latest crime statistics for our area.",
          timestamp: new Date("2025-05-27T10:30:00"),
          replies: [
            {
              id: "6-1",
              author: "Maria Garcia",
              avatar: "👩‍🏫",
              content:
                "Excellent! Thanks for your continued support, Officer James.",
              timestamp: new Date("2025-05-27T11:00:00"),
            },
          ],
        },
      ],
    },
    {
      id: "5",
      author: "Alex Thompson",
      avatar: "🐕",
      content:
        "FOUND: Small beagle mix with red collar found near Pine Elementary. Very sweet and well-trained. Waiting at the vet clinic on Main Street.",
      category: "lost-pet",
      timestamp: new Date("2025-05-26T12:30:00"),
      likes: 31,
      location: "Pine Elementary",
      comments: [
        {
          id: "7",
          author: "Nancy Williams",
          avatar: "👵",
          content:
            "That might be Buddy! I'll call the Johnson family right now.",
          timestamp: new Date("2025-05-26T13:00:00"),
          replies: [
            {
              id: "7-1",
              author: "Alex Thompson",
              avatar: "🐕",
              content: "Great! I'm at Pine Vet Clinic until 5 PM today.",
              timestamp: new Date("2025-05-26T13:15:00"),
            },
            {
              id: "7-2",
              author: "Nancy Williams",
              avatar: "👵",
              content: "UPDATE: Buddy is home safe! Thank you Alex! ❤️",
              timestamp: new Date("2025-05-26T14:45:00"),
            },
          ],
        },
      ],
    },
    {
      id: "6",
      author: "Chef Ricardo",
      avatar: "👨‍🍳",
      content:
        "New food truck 'Ricardo's Tacos' will be parked at the corner of 5th and Main every Tuesday and Friday from 11 AM - 3 PM. Authentic Mexican cuisine!",
      category: "recommendation",
      timestamp: new Date("2025-05-25T08:45:00"),
      likes: 42,
      location: "5th and Main",
      comments: [
        {
          id: "8",
          author: "Sofia Martinez",
          avatar: "👩‍🎓",
          content:
            "Finally! I've been craving good tacos. What's your specialty?",
          timestamp: new Date("2025-05-25T09:30:00"),
          replies: [
            {
              id: "8-1",
              author: "Chef Ricardo",
              avatar: "👨‍🍳",
              content:
                "Try the carnitas and our homemade salsa verde! Family recipe 😊",
              timestamp: new Date("2025-05-25T10:00:00"),
            },
          ],
        },
        {
          id: "9",
          author: "Miguel Santos",
          avatar: "👨‍🔧",
          content:
            "Tried them yesterday - absolutely delicious! Highly recommend.",
          timestamp: new Date("2025-05-25T16:20:00"),
          replies: [],
        },
      ],
    },
    {
      id: "7",
      author: "Dr. Patricia White",
      avatar: "👩‍⚕️",
      content:
        "Free health screening event next Saturday 9 AM - 2 PM at the Community Center. Blood pressure, cholesterol, and diabetes checks. No appointment needed!",
      category: "event",
      timestamp: new Date("2025-05-24T11:00:00"),
      likes: 28,
      location: "Community Center",
      comments: [
        {
          id: "10",
          author: "Helen Carter",
          avatar: "👵",
          content:
            "Wonderful initiative! Will there be flu shots available too?",
          timestamp: new Date("2025-05-24T12:15:00"),
          replies: [
            {
              id: "10-1",
              author: "Dr. Patricia White",
              avatar: "👩‍⚕️",
              content:
                "Yes! We'll have flu shots and basic immunizations available.",
              timestamp: new Date("2025-05-24T13:00:00"),
            },
          ],
        },
      ],
    },
    {
      id: "8",
      author: "Teen Volunteer Squad",
      avatar: "👥",
      content:
        "Organizing a neighborhood cleanup on Sunday morning! Meet at 8 AM at Riverside Park. Bring gloves and water bottles. Pizza lunch provided for all volunteers!",
      category: "event",
      timestamp: new Date("2025-05-23T15:30:00"),
      likes: 18,
      location: "Riverside Park",
      comments: [
        {
          id: "11",
          author: "Mark Johnson",
          avatar: "👨‍💼",
          content:
            "Count my family in! Great way to teach kids community service.",
          timestamp: new Date("2025-05-23T16:45:00"),
          replies: [
            {
              id: "11-1",
              author: "Teen Volunteer Squad",
              avatar: "👥",
              content:
                "Awesome! We'll have activities for kids too. See you Sunday!",
              timestamp: new Date("2025-05-23T17:00:00"),
            },
          ],
        },
        {
          id: "12",
          author: "Linda Green",
          avatar: "👩‍🌾",
          content: "I can donate some additional cleaning supplies if needed!",
          timestamp: new Date("2025-05-23T18:30:00"),
          replies: [],
        },
      ],
    },
    {
      id: "9",
      author: "Pet Groomer Sally",
      avatar: "✂️",
      content:
        "Mobile pet grooming service now available in our neighborhood! Professional grooming at your doorstep. Special discount for senior pets. Call 555-GROOM!",
      category: "recommendation",
      timestamp: new Date("2025-05-22T10:20:00"),
      likes: 22,
      comments: [
        {
          id: "13",
          author: "Dog Mom Lisa",
          avatar: "🐕‍🦺",
          content:
            "This is perfect! Max gets so anxious at regular grooming shops.",
          timestamp: new Date("2025-05-22T11:00:00"),
          replies: [
            {
              id: "13-1",
              author: "Pet Groomer Sally",
              avatar: "✂️",
              content: "I specialize in anxious pets! Very gentle approach. 😊",
              timestamp: new Date("2025-05-22T11:30:00"),
            },
          ],
        },
      ],
    },
    {
      id: "10",
      author: "Weather Alert Bot",
      avatar: "🌦️",
      content:
        "Weather Advisory: Heavy rain and possible flooding expected tomorrow evening. Please move vehicles to higher ground and clear storm drains near your property.",
      category: "general",
      timestamp: new Date("2025-05-21T14:00:00"),
      likes: 45,
      comments: [
        {
          id: "14",
          author: "Emergency Coordinator",
          avatar: "🚨",
          content:
            "Sandbags available at City Hall for residents in flood-prone areas.",
          timestamp: new Date("2025-05-21T15:30:00"),
          replies: [
            {
              id: "14-1",
              author: "Janet Miller",
              avatar: "👩‍🦳",
              content:
                "Thank you! Elm Street always floods. We'll get some sandbags.",
              timestamp: new Date("2025-05-21T16:00:00"),
            },
          ],
        },
      ],
    },
    {
      id: "11",
      author: "Library Director",
      avatar: "📚",
      content:
        "Summer Reading Program starts June 1st! Kids and adults welcome. Weekly prizes, book clubs, and author visits. Registration now open at the front desk.",
      category: "event",
      timestamp: new Date("2025-05-20T09:00:00"),
      likes: 33,
      location: "Public Library",
      comments: [
        {
          id: "15",
          author: "Reading Mom",
          avatar: "👩‍👧",
          content: "My daughter loves these programs! Are there age groups?",
          timestamp: new Date("2025-05-20T10:15:00"),
          replies: [
            {
              id: "15-1",
              author: "Library Director",
              avatar: "📚",
              content:
                "Yes! Ages 0-5, 6-12, 13-17, and adults. Something for everyone!",
              timestamp: new Date("2025-05-20T11:00:00"),
            },
          ],
        },
      ],
    },
    {
      id: "12",
      author: "Basketball Coach Mike",
      avatar: "🏀",
      content:
        "Looking for kids ages 8-14 interested in joining our neighborhood basketball team! Practice twice a week at the school court. Focus on fun and teamwork!",
      category: "general",
      timestamp: new Date("2025-05-19T17:45:00"),
      likes: 19,
      location: "School Basketball Court",
      comments: [
        {
          id: "16",
          author: "Sports Dad",
          avatar: "👨‍👦",
          content:
            "My 10-year-old would love this! What's the time commitment?",
          timestamp: new Date("2025-05-19T18:30:00"),
          replies: [
            {
              id: "16-1",
              author: "Basketball Coach Mike",
              avatar: "🏀",
              content:
                "Tuesdays and Thursdays 4-6 PM. Games every other Saturday!",
              timestamp: new Date("2025-05-19T19:00:00"),
            },
          ],
        },
      ],
    },
  ]);

  const [newPost, setNewPost] = useState({
    content: "",
    category: "general" as Post["category"],
    location: "",
  });
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [newReply, setNewReply] = useState<{ [key: string]: string }>({});
  const [isDark, setIsDark] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [replyingTo, setReplyingTo] = useState<{ [key: string]: string }>({});
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setDebouncedSearchTerm(searchTerm);
  }, [searchTerm]);

  // Check if screen is desktop size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Lock background scroll when About modal is open
  useEffect(() => {
    if (showAbout) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showAbout]);

  const addToast = (
    message: string,
    type: "success" | "info" | "warning" | "error" = "info"
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const handleCreatePost = () => {
    if (!newPost.content.trim()) {
      addToast("Please enter some content for your post", "warning");
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      author: "You",
      avatar: "👤",
      content: newPost.content,
      category: newPost.category,
      timestamp: new Date(),
      likes: 0,
      comments: [],
      location: newPost.location || undefined,
    };

    setPosts((prev) => [post, ...prev]);
    setNewPost({ content: "", category: "general", location: "" });
    addToast("Post created successfully!", "success");
  };

  const handleLike = (postId: string) => {
    if (likedPosts.has(postId)) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, likes: post.likes - 1 } : post
        )
      );
      setLikedPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
      addToast("Post unliked!", "info");
    } else {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
      setLikedPosts((prev) => new Set([...prev, postId]));
      addToast("Post liked!", "success");
    }
  };

  const handleComment = (postId: string) => {
    const commentContent = newComment[postId];
    if (!commentContent?.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: "You",
      avatar: "👤",
      content: commentContent,
      timestamp: new Date(),
      replies: [],
    };

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );

    setNewComment((prev) => ({ ...prev, [postId]: "" }));
    addToast("Comment added!", "success");
  };

  const handleReply = (postId: string, commentId: string) => {
    const replyContent = newReply[`${postId}-${commentId}`];
    if (!replyContent?.trim()) return;

    const reply: Comment = {
      id: `${commentId}-${Date.now()}`,
      author: "You",
      avatar: "👤",
      content: replyContent,
      timestamp: new Date(),
    };

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId
                  ? { ...comment, replies: [...(comment.replies || []), reply] }
                  : comment
              ),
            }
          : post
      )
    );

    setNewReply((prev) => ({ ...prev, [`${postId}-${commentId}`]: "" }));
    setReplyingTo((prev) => ({ ...prev, [`${postId}-${commentId}`]: "" }));
    addToast("Reply added!", "success");
  };

  const toggleComments = (postId: string) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const toggleReplies = (commentId: string) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const getCategoryIcon = (category: Post["category"]) => {
    switch (category) {
      case "event":
        return <Calendar className="w-4 h-4" />;
      case "lost-pet":
        return <PawPrint className="w-4 h-4" />;
      case "recommendation":
        return <Star className="w-4 h-4" />;
      default:
        return <Megaphone className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: Post["category"]) => {
    switch (category) {
      case "event":
        return isDark
          ? "text-blue-300 bg-blue-900/30"
          : "text-blue-700 bg-blue-100";
      case "lost-pet":
        return isDark
          ? "text-red-300 bg-red-900/30"
          : "text-red-700 bg-red-100";
      case "recommendation":
        return isDark
          ? "text-yellow-300 bg-yellow-900/30"
          : "text-yellow-700 bg-yellow-100";
      default:
        return isDark
          ? "text-gray-300 bg-gray-700/30"
          : "text-gray-700 bg-gray-100";
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const themeClasses = isDark
    ? "bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900"
    : "bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100";

  return (
    <div
      className={`min-h-screen ${themeClasses} font-['Inter',_'SF_Pro_Display',_system-ui,_sans-serif] transition-all duration-300`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-md border-b ${
          isDark
            ? "bg-gray-900/80 border-gray-700"
            : "bg-white/90 border-blue-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 relative">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className={`text-xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  NeighborHub
                </h1>
                <p
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-blue-600"
                  }`}
                >
                  Connect with your community
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
               <div className="hidden md:block flex-1 max-w-md">
                <div className="relative">
                  <div
                    className={`flex items-center transition-all duration-300 ${
                      showSearch ? "w-full" : "w-10"
                    }`}
                  >
                    {showSearch && (
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search posts..."
                        className={`flex-1 mr-2 px-3 py-2 rounded-lg border transition-all duration-300 ${
                          isDark
                            ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-blue-200 text-gray-900 placeholder-blue-400"
                        } focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                        autoFocus
                      />
                    )}
                    <button
                      onClick={() => setShowSearch(!showSearch)}
                      className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${
                        isDark
                          ? "hover:bg-gray-700 text-gray-300"
                          : "hover:bg-blue-100 text-blue-600"
                      }`}
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowAbout(true)}
                className={`p-2 rounded-lg transition-colors cursor-pointer relative ${
                  isDark
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-blue-100 text-blue-600"
                }`}
              >
                <Info className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg transition-colors cursor-pointer relative ${
                  isDark
                    ? "hover:bg-gray-700 text-yellow-400"
                    : "hover:bg-blue-100 text-blue-600"
                }`}
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Fixed */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Profile Card */}
              <div
                className={`p-6 rounded-2xl backdrop-blur-lg ${
                  isDark
                    ? "bg-gray-800/50"
                    : "bg-white/80"
                } shadow-xl`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-semibold relative">
                    👤
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Alex Morgan
                    </h3>
                    <p
                      className={`text-sm flex items-center ${
                        isDark ? "text-gray-400" : "text-blue-600"
                      }`}
                    >
                      <MapPin className="w-3 h-3 mr-1" />
                      Maple Street, Block A
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      addToast("Profile editing coming soon!", "info")
                    }
                    className={`p-2 rounded-lg transition-colors cursor-pointer relative ${
                      isDark
                        ? "hover:bg-gray-700 text-gray-400"
                        : "hover:bg-blue-100 text-blue-600"
                    }`}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div
                      className={`text-lg font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      23
                    </div>
                    <div
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-blue-600"
                      }`}
                    >
                      Posts
                    </div>
                  </div>
                  <div>
                    <div
                      className={`text-lg font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      156
                    </div>
                    <div
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-blue-600"
                      }`}
                    >
                      Likes
                    </div>
                  </div>
                  <div>
                    <div
                      className={`text-lg font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      45
                    </div>
                    <div
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-blue-600"
                      }`}
                    >
                      Comments
                    </div>
                  </div>
                </div>
              </div>

              {/* Create Post Card */}
              <div
                className={`rounded-2xl backdrop-blur-lg ${
                  isDark
                    ? "bg-gray-800/50"
                    : "bg-white/80"
                } shadow-xl`}
              >
                {/* Mobile Toggle Header */}
                <div className="md:hidden">
                  <button
                    onClick={() => setShowCreatePost(!showCreatePost)}
                    className={`w-full p-4 flex items-center justify-between transition-colors ${
                      isDark
                        ? "hover:bg-gray-700/50 text-white"
                        : "hover:bg-blue-50 text-gray-900"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600">
                        <Plus className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-semibold">Create New Post</h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-200 ${
                        showCreatePost ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Desktop Header */}
                <div className="hidden md:block p-6 pb-4">
                  <h3
                    className={`font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Create New Post
                  </h3>
                </div>

                {/* Collapsible Content */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    showCreatePost || isDesktop
                      ? "max-h-[500px] opacity-100"
                      : "max-h-0 opacity-0 md:max-h-[500px] md:opacity-100"
                  }`}
                >
                  <div className="p-6 pt-0 md:pt-0">
                    <div className="space-y-4">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            isDark ? "text-gray-300" : "text-blue-700"
                          }`}
                        >
                          Category
                        </label>
                        <select
                          value={newPost.category}
                          onChange={(e) =>
                            setNewPost((prev) => ({
                              ...prev,
                              category: e.target.value as Post["category"],
                            }))
                          }
                          className={`w-full p-3 rounded-lg transition-colors cursor-pointer ${
                            isDark
                              ? "bg-gray-600 text-white"
                              : "bg-gray-50 text-gray-900"
                          } focus:ring-2 focus:ring-cyan-500`}
                        >
                          <option value="general">General</option>
                          <option value="event">Event</option>
                          <option value="lost-pet">Lost Pet</option>
                          <option value="recommendation">Recommendation</option>
                        </select>
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            isDark ? "text-gray-300" : "text-blue-700"
                          }`}
                        >
                          Location (optional)
                        </label>
                        <input
                          type="text"
                          value={newPost.location}
                          onChange={(e) =>
                            setNewPost((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          placeholder="e.g., Central Park, Oak Street..."
                          className={`w-full p-3 rounded-lg transition-colors ${
                            isDark
                              ? "bg-gray-600 text-white placeholder-gray-400"
                              : "bg-gray-50 text-gray-900 placeholder-gray-500"
                          } focus:ring-2 focus:ring-cyan-500`}
                        />
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            isDark ? "text-gray-300" : "text-blue-700"
                          }`}
                        >
                          What's happening in your neighborhood?
                        </label>
                        <textarea
                          value={newPost.content}
                          onChange={(e) =>
                            setNewPost((prev) => ({
                              ...prev,
                              content: e.target.value,
                            }))
                          }
                          placeholder="Share an event, ask for recommendations, report a lost pet..."
                          rows={4}
                          className={`w-full p-3 rounded-lg resize-none transition-colors ${
                            isDark
                              ? "bg-gray-600 text-white placeholder-gray-400"
                              : "bg-gray-50 text-gray-900 placeholder-gray-500"
                          } focus:ring-2 focus:ring-cyan-500`}
                        />
                      </div>

                      <button
                        onClick={handleCreatePost}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer relative"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Share with Community</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div
                className={`p-6 rounded-2xl backdrop-blur-lg ${
                  isDark
                    ? "bg-gray-800/50"
                    : "bg-white/80"
                } shadow-xl`}
              >
                <h3
                  className={`font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Community Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-blue-600"
                      }`}
                    >
                      Active Members
                    </span>
                    <span
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      1,247
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-blue-600"
                      }`}
                    >
                      Posts Today
                    </span>
                    <span
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      18
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-blue-600"
                      }`}
                    >
                      Events This Week
                    </span>
                    <span
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      7
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Scrollable */}
          <div className="lg:col-span-2">
            {/* Posts Feed */}
            <div className="space-y-6">
              {filteredPosts.length === 0 ? (
                <div
                  className={`text-center py-12 ${
                    isDark ? "text-gray-400" : "text-blue-600"
                  }`}
                >
                  {debouncedSearchTerm
                    ? "No posts found matching your search."
                    : "No posts yet. Be the first to share!"}
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className={`p-6 rounded-2xl backdrop-blur-lg ${
                      isDark
                        ? "bg-gray-800/50"
                        : "bg-white/80"
                    } shadow-xl`}
                  >
                    {/* Post Header */}
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold relative">
                        {post.avatar}
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Mobile Layout */}
                        <div className="md:hidden">
                          <div className="flex items-center justify-between mb-2">
                            <h4
                              className={`font-semibold truncate ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {post.author}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getCategoryColor(
                                post.category
                              )}`}
                            >
                              {getCategoryIcon(post.category)}
                              <span className="capitalize">
                                {post.category.replace("-", " ")}
                              </span>
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div
                              className={`text-xs ${
                                isDark ? "text-gray-400" : "text-blue-600"
                              }`}
                            >
                              {post.timestamp.toLocaleDateString()} at{" "}
                              {post.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            {post.location && (
                              <div
                                className={`flex items-center space-x-1 text-xs ${
                                  isDark ? "text-gray-400" : "text-blue-600"
                                }`}
                              >
                                <MapPin className="w-3 h-3" />
                                <span>{post.location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden md:block">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4
                              className={`font-semibold ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {post.author}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getCategoryColor(
                                post.category
                              )}`}
                            >
                              {getCategoryIcon(post.category)}
                              <span className="capitalize">
                                {post.category.replace("-", " ")}
                              </span>
                              <div className="w-1 h-1 bg-current rounded-full ml-1"></div>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs">
                            <span
                              className={
                                isDark ? "text-gray-400" : "text-blue-600"
                              }
                            >
                              {post.timestamp.toLocaleDateString()} at{" "}
                              {post.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {post.location && (
                              <>
                                <span
                                  className={
                                    isDark ? "text-gray-500" : "text-blue-400"
                                  }
                                >
                                  •
                                </span>
                                <span
                                  className={`flex items-center space-x-1 ${
                                    isDark ? "text-gray-400" : "text-blue-600"
                                  }`}
                                >
                                  <MapPin className="w-3 h-3" />
                                  <span>{post.location}</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p
                      className={`mb-4 leading-relaxed ${
                        isDark ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      {post.content}
                    </p>

                    <div className="flex items-center space-x-6 mb-4 pt-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-2 transition-colors cursor-pointer relative ${
                          likedPosts.has(post.id)
                            ? "text-red-500"
                            : isDark
                            ? "text-gray-400 hover:text-red-400"
                            : "text-blue-600 hover:text-red-500"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            likedPosts.has(post.id) ? "fill-current" : ""
                          }`}
                        />
                        <span className="text-sm">{post.likes}</span>
                      </button>
                      <button
                        onClick={() => toggleComments(post.id)}
                        className={`flex items-center space-x-2 transition-colors cursor-pointer relative ${
                          showComments[post.id]
                            ? (isDark ? "text-blue-400" : "text-blue-700")
                            : (isDark
                                ? "text-gray-400 hover:text-blue-400"
                                : "text-blue-600 hover:text-blue-700"
                              )
                        }`}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{post.comments.length}</span>
                      </button>
                    </div>

                    {showComments[post.id] && (
                      <div className="space-y-4">
                        <div className="flex space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm relative">
                            👤
                            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 rounded-full border border-white"></div>
                          </div>
                          <div className="flex-1 flex space-x-2">
                            <input
                              type="text"
                              value={newComment[post.id] || ""}
                              onChange={(e) =>
                                setNewComment((prev) => ({
                                  ...prev,
                                  [post.id]: e.target.value,
                                }))
                              }
                              placeholder="Add a comment..."
                              className={`flex-1 p-2 rounded-lg text-sm transition-colors ${
                                isDark
                                  ? "bg-gray-600 text-white placeholder-gray-400"
                                  : "bg-gray-50 text-gray-900 placeholder-gray-500"
                              } focus:ring-2 focus:ring-cyan-500`}
                              onKeyPress={(e) =>
                                e.key === "Enter" && handleComment(post.id)
                              }
                            />
                            <button
                              onClick={() => handleComment(post.id)}
                              className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 cursor-pointer relative"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {post.comments.length > 0 && (
                          <div className="space-y-3">
                            {post.comments.map((comment) => (
                              <div
                                key={comment.id}
                                className={`p-3 rounded-lg ${
                                  isDark ? "bg-gray-700/30" : "bg-blue-50/80"
                                }`}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs relative">
                                    {comment.avatar}
                                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 rounded-full border border-white"></div>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span
                                        className={`font-medium text-sm ${
                                          isDark
                                            ? "text-white"
                                            : "text-gray-900"
                                        }`}
                                      >
                                        {comment.author}
                                      </span>
                                      <span
                                        className={`text-xs ${
                                          isDark
                                            ? "text-gray-400"
                                            : "text-blue-600"
                                        }`}
                                      >
                                        {comment.timestamp.toLocaleTimeString(
                                          [],
                                          { hour: "2-digit", minute: "2-digit" }
                                        )}
                                      </span>
                                    </div>
                                    <p
                                      className={`text-sm mb-2 ${
                                        isDark
                                          ? "text-gray-200"
                                          : "text-gray-800"
                                      }`}
                                    >
                                      {comment.content}
                                    </p>

                                    {/* Reply Actions */}
                                    <div className="flex items-center space-x-4">
                                      <button
                                        onClick={() =>
                                          setReplyingTo((prev) => ({
                                            ...prev,
                                            [`${post.id}-${comment.id}`]:
                                              replyingTo[
                                                `${post.id}-${comment.id}`
                                              ]
                                                ? ""
                                                : comment.id,
                                          }))
                                        }
                                        className={`flex items-center space-x-1 text-xs transition-colors cursor-pointer ${
                                          isDark
                                            ? "text-gray-400 hover:text-blue-400"
                                            : "text-blue-600 hover:text-blue-700"
                                        }`}
                                      >
                                        <Reply className="w-3 h-3" />
                                        <span>Reply</span>
                                      </button>

                                      {comment.replies &&
                                        comment.replies.length > 0 && (
                                          <button
                                            onClick={() =>
                                              toggleReplies(comment.id)
                                            }
                                            className={`flex items-center space-x-1 text-xs transition-colors cursor-pointer ${
                                              isDark
                                                ? "text-gray-400 hover:text-blue-400"
                                                : "text-blue-600 hover:text-blue-700"
                                            }`}
                                          >
                                            {showReplies[comment.id] ? (
                                              <ChevronDown className="w-3 h-3" />
                                            ) : (
                                              <ChevronRight className="w-3 h-3" />
                                            )}
                                            <span>
                                              {comment.replies.length} replies
                                            </span>
                                          </button>
                                        )}
                                    </div>

                                    {/* Reply Input */}
                                    {replyingTo[`${post.id}-${comment.id}`] && (
                                      <div className="flex space-x-2 mt-3">
                                        <input
                                          type="text"
                                          value={
                                            newReply[
                                              `${post.id}-${comment.id}`
                                            ] || ""
                                          }
                                          onChange={(e) =>
                                            setNewReply((prev) => ({
                                              ...prev,
                                              [`${post.id}-${comment.id}`]:
                                                e.target.value,
                                            }))
                                          }
                                          placeholder={`Reply to ${comment.author}...`}
                                          className={`flex-1 p-2 rounded-lg text-xs transition-colors ${
                                            isDark
                                              ? "bg-gray-500 text-white placeholder-gray-400"
                                              : "bg-gray-50 text-gray-900 placeholder-gray-500"
                                          } focus:ring-2 focus:ring-cyan-500`}
                                          onKeyPress={(e) =>
                                            e.key === "Enter" &&
                                            handleReply(post.id, comment.id)
                                          }
                                        />
                                        <button
                                          onClick={() =>
                                            handleReply(post.id, comment.id)
                                          }
                                          className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 cursor-pointer text-xs"
                                        >
                                          <Send className="w-3 h-3" />
                                        </button>
                                      </div>
                                    )}

                                    {/* Replies */}
                                    {showReplies[comment.id] &&
                                      comment.replies &&
                                      comment.replies.length > 0 && (
                                        <div className="ml-4 mt-3 space-y-2 pl-3">
                                          {comment.replies.map((reply) => (
                                            <div
                                              key={reply.id}
                                              className={`p-2 rounded-lg ${
                                                isDark
                                                  ? "bg-gray-600/30"
                                                  : "bg-white/60"
                                              }`}
                                            >
                                              <div className="flex items-start space-x-2">
                                                <div className="w-5 h-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs relative">
                                                  {reply.avatar}
                                                  <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full border border-white"></div>
                                                </div>
                                                <div className="flex-1">
                                                  <div className="flex items-center space-x-2 mb-1">
                                                    <span
                                                      className={`font-medium text-xs ${
                                                        isDark
                                                          ? "text-white"
                                                          : "text-gray-900"
                                                      }`}
                                                    >
                                                      {reply.author}
                                                    </span>
                                                    <span
                                                      className={`text-xs ${
                                                        isDark
                                                          ? "text-gray-400"
                                                          : "text-blue-600"
                                                      }`}
                                                    >
                                                      {reply.timestamp.toLocaleTimeString(
                                                        [],
                                                        {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                        }
                                                      )}
                                                    </span>
                                                  </div>
                                                  <p
                                                    className={`text-xs ${
                                                      isDark
                                                        ? "text-gray-200"
                                                        : "text-gray-800"
                                                    }`}
                                                  >
                                                    {reply.content}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`mt-12 border-t ${
          isDark
            ? "bg-gray-900/50 border-gray-700"
            : "bg-white/80 border-blue-200"
        } backdrop-blur-lg`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 relative">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3
                  className={`font-semibold text-sm ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  NeighborHub
                </h3>
                <p
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-blue-600"
                  }`}
                >
                  Building stronger communities
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex space-x-4">
                <button
                  className={`p-2 rounded-lg transition-colors cursor-pointer relative ${
                    isDark
                      ? "hover:bg-gray-700 text-gray-400"
                      : "hover:bg-blue-100 text-blue-600"
                  }`}
                >
                  <Github className="w-4 h-4" />
                </button>
                <button
                  className={`p-2 rounded-lg transition-colors cursor-pointer relative ${
                    isDark
                      ? "hover:bg-gray-700 text-gray-400"
                      : "hover:bg-blue-100 text-blue-600"
                  }`}
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button
                  className={`p-2 rounded-lg transition-colors cursor-pointer relative ${
                    isDark
                      ? "hover:bg-gray-700 text-gray-400"
                      : "hover:bg-blue-100 text-blue-600"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>

              <div className="h-6 border-l border-gray-300"></div>

              <div className="flex items-center space-x-2">
                <Shield
                  className={`w-4 h-4 ${
                    isDark ? "text-gray-400" : "text-blue-600"
                  }`}
                />
                <span
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-blue-600"
                  }`}
                >
                  Safe & Secure
                </span>
              </div>
            </div>
          </div>

          <div
            className={`mt-4 pt-4 border-t text-center text-xs ${
              isDark
                ? "border-gray-700 text-gray-400"
                : "border-blue-200 text-blue-600"
            }`}
          >
            NeighborHub. Made with ❤️ for communities everywhere.
          </div>
        </div>
      </footer>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className={`max-w-lg w-full p-6 rounded-2xl ${
              isDark
                ? "bg-gray-800"
                : "bg-white"
            } shadow-2xl`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                About NeighborHub
              </h3>
              <button
                onClick={() => setShowAbout(false)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  isDark
                    ? "hover:bg-gray-700 text-gray-400"
                    : "hover:bg-blue-100 text-blue-600"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div
              className={`space-y-4 ${
                isDark ? "text-gray-300" : "text-blue-700"
              }`}
            >
              <p>
                NeighborHub is your community's digital bulletin board, designed
                to bring neighbors together and foster local connections.
              </p>
              <div className="space-y-2">
                <h4
                  className={`font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Features:
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>• Share community events and announcements</li>
                  <li>• Report lost pets and help reunite families</li>
                  <li>• Get and give local recommendations</li>
                  <li>• Connect with neighbors through threaded replies</li>
                  <li>• Stay updated on neighborhood activities</li>
                </ul>
              </div>
              <p className="text-sm">
                Built with love for communities everywhere. Together, we make
                neighborhoods stronger.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed top-20 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg backdrop-blur-lg transform transition-all duration-300 ${
              toast.type === "success"
                ? "bg-green-500/90 text-white"
                : toast.type === "warning"
                ? "bg-yellow-500/90 text-white"
                : toast.type === "error"
                ? "bg-red-500/90 text-white"
                : isDark
                ? "bg-gray-800/90 text-white"
                : "bg-white/90 text-gray-900"
            }`}
          >
            <div className="flex items-center space-x-2">
              {toast.type === "success" && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
              {toast.type === "warning" && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
              {toast.type === "error" && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
              {toast.type === "info" && (
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              )}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityNoticeBoard;