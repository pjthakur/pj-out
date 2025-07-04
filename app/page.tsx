"use client";
import { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaComment,
  FaBookmark,
  FaReply,
  FaRegBookmark,
  FaSearch,
  FaCrown,
  FaStar,
  FaHeart,
  FaRegHeart,
  FaSmile,
  FaBold,
  FaItalic,
  FaLink,
  FaChevronLeft,
  FaChevronRight,
  FaArrowLeft,
  FaCode,
  FaCss3Alt,
  FaReact,
  FaRocket,
  FaComments,
  FaPaperPlane,
  FaTimes,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const trendingTopics = [
  {
    id: 1,
    title: "React Tips",
    icon: <FaReact className="text-[#A55EEA]" />,
  },
  {
    id: 2,
    title: "TypeScript",
    icon: <FaCode className="text-[#A55EEA]" />,
  },
  {
    id: 3,
    title: "Tailwind CSS",
    icon: <FaCss3Alt className="text-[#A55EEA]" />,
  },
  {
    id: 4,
    title: "State Manage",
    icon: <FaStar className="text-[#A55EEA]" />,
  },
  {
    id: 5,
    title: "Deployment",
    icon: <FaRocket className="text-[#A55EEA]" />,
  },
];

const mockDiscussions: { [key: number]: Discussion[] } = {
  1: [
    {
      id: "d1",
      author: "alice",
      content: "What are some essential tips you follow when using React?",
      replies: [
        {
          id: "r1",
          author: "bob",
          content: "I always use React.memo for performance optimization!",
          timestamp: new Date(Date.now() - 2 * 60 * 1000),
        },
        {
          id: "r2",
          author: "charlie",
          content: "Component composition over inheritance is key.",
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
        },
      ],
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      answered: true,
      likes: 12,
      bookmarked: false,
      reactions: {
        "👍": { count: 5, users: ["bob", "charlie", "dana", "ed", "fiona"] },
        "❤️": { count: 3, users: ["alice", "bob", "charlie"] },
        "🔥": { count: 2, users: ["dana", "greg"] },
      },
    },
    {
      id: "d2",
      author: "bob",
      content: "How do you organize components in a large project?",
      replies: [
        {
          id: "r3",
          author: "dana",
          content: "I use atomic design methodology.",
          timestamp: new Date(Date.now() - 1 * 60 * 1000),
        },
      ],
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      answered: true,
      likes: 8,
      bookmarked: true,
      reactions: {},
    },
    {
      id: "d3",
      author: "charlie",
      content: "Do you use React Context or Redux more often?",
      replies: [],
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      answered: false,
      likes: 15,
      bookmarked: false,
      reactions: {},
    },
  ],
  2: [
    {
      id: "d4",
      author: "dana",
      content: "How do you type API responses in TypeScript?",
      replies: [
        {
          id: "r4",
          author: "ed",
          content: "I create interfaces for each API response.",
          timestamp: new Date(Date.now() - 3 * 60 * 1000),
        },
        {
          id: "r5",
          author: "fiona",
          content: "Generics are useful for reusable types.",
          timestamp: new Date(Date.now() - 7 * 60 * 1000),
        },
      ],
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      answered: true,
      likes: 21,
      bookmarked: true,
      reactions: {
        "💯": { count: 4, users: ["alice", "bob", "charlie", "greg"] },
        "🚀": { count: 2, users: ["dana", "fiona"] },
      },
    },
    {
      id: "d5",
      author: "ed",
      content: "Tips for beginners learning TS?",
      replies: [],
      timestamp: new Date(Date.now() - 35 * 60 * 1000),
      answered: true,
      likes: 17,
      bookmarked: false,
      reactions: {},
    },
  ],
  3: [
    {
      id: "d6",
      author: "fiona",
      content: "How to create responsive layouts quickly?",
      replies: [],
      timestamp: new Date(Date.now() - 1 * 60 * 1000),
      answered: true,
      likes: 9,
      bookmarked: false,
      reactions: {},
    },
  ],
  4: [],
  5: [
    {
      id: "d7",
      author: "greg",
      content: "Netlify vs Vercel for React apps?",
      replies: [
        {
          id: "r6",
          author: "alice",
          content: "Vercel has better Next.js integration.",
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
        },
      ],
      timestamp: new Date(Date.now() - 50 * 60 * 1000),
      answered: true,
      likes: 14,
      bookmarked: false,
      reactions: {
        "👍": { count: 6, users: ["alice", "bob", "charlie", "dana", "ed", "fiona"] },
        "🎉": { count: 1, users: ["greg"] },
      },
    },
  ],
};

const moderators = [
  { name: "Alice", role: "Lead Moderator" },
  { name: "Bob", role: "Community Manager" },
  { name: "Fiona", role: "Technical Expert" },
];

const activeUsers = [
  { name: "Charlie", activity: "Posting" },
  { name: "Dana", activity: "Commenting" },
  { name: "Ed", activity: "Browsing" },
  { name: "Greg", activity: "Reacting" },
];



type FilterType = "Most recent" | "Most replied" | "Unanswered" | "Bookmarks";

const filters: FilterType[] = [
  "Most recent",
  "Most replied",
  "Unanswered",
  "Bookmarks",
];

interface Reply {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
}

interface Discussion {
  id: string;
  author: string;
  content: string;
  replies: Reply[];
  timestamp: Date;
  answered: boolean;
  likes: number;
  bookmarked: boolean;
  likedByUser?: boolean;
  reactions?: { [emoji: string]: { count: number; users: string[] } };
}

const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }
};

const CommunityDashboard: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<number>(
    trendingTopics[0].id
  );
  const [activeFilter, setActiveFilter] = useState<FilterType>("Most recent");
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newPostContent, setNewPostContent] = useState<string>("");
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>(
    {}
  );
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [isCreatePostExpanded, setIsCreatePostExpanded] = useState<boolean>(false);
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [discussions, setDiscussions] = useState<{
    [key: number]: Discussion[];
  }>(mockDiscussions);

  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [showRightSidebar, setShowRightSidebar] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [userSettings, setUserSettings] = useState({
    notifications: true,
    emailAlerts: false,
    theme: 'dark',
    autoSave: true
  });

  const newPostRef = useRef<HTMLTextAreaElement>(null);
  const replyRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    document.body.style.fontFamily =
      "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);



  const handleSignOut = () => {
    setDiscussions(mockDiscussions);
    setNewPostContent("");
    setReplyContent({});
    setExpandedPost(null);
    setActiveFilter("Most recent");
    setSelectedTopic(trendingTopics[0].id);
    toast.success("Successfully signed out");
  };

  const getUserStats = () => {
    const allDiscussions = Object.values(discussions).flat();
    const userPosts = allDiscussions.filter(d => d.author === "You");
    const userReplies = allDiscussions.reduce((acc, d) => 
      acc + d.replies.filter(r => r.author === "You").length, 0);
    const totalLikes = userPosts.reduce((acc, post) => acc + post.likes, 0);
    const bookmarkedPosts = allDiscussions.filter(d => d.bookmarked).length;
    
    return {
      posts: userPosts.length,
      replies: userReplies,
      likes: totalLikes,
      bookmarks: bookmarkedPosts
    };
  };

  const addModeratorReply = (postId: string, topicId: number) => {
    const moderatorReplies = [
      "Great question! I'd love to help you with this.",
      "This is an interesting topic. Here's what I think...",
      "Thanks for bringing this up! This is a common challenge many developers face.",
      "Good point! I've seen this come up frequently in our community.",
      "This is a valuable discussion. Let me share some insights.",
      "Excellent question! This touches on some important concepts.",
      "I appreciate you starting this conversation. Very relevant topic!",
      "This is definitely worth exploring. Great initiative!",
    ];

    const randomModerator = moderators[Math.floor(Math.random() * moderators.length)];
    const randomReply = moderatorReplies[Math.floor(Math.random() * moderatorReplies.length)];

    const moderatorReply: Reply = {
      id: `r${Date.now()}`,
      author: randomModerator.name,
      content: randomReply,
      timestamp: new Date(),
    };

    setDiscussions((prev) => {
      const updatedDiscussions = [...prev[topicId]];
      const postIndex = updatedDiscussions.findIndex((p) => p.id === postId);

      if (postIndex !== -1) {
        const updatedPost = {
          ...updatedDiscussions[postIndex],
          replies: [...updatedDiscussions[postIndex].replies, moderatorReply],
          answered: true,
        };
        updatedDiscussions[postIndex] = updatedPost;
      }

      return {
        ...prev,
        [topicId]: updatedDiscussions,
      };
    });

    toast.success(`${randomModerator.name} replied to your post!`);
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }

    const newPost: Discussion = {
      id: `d${Date.now()}`,
      author: "You",
      content: newPostContent,
      replies: [],
      timestamp: new Date(),
      answered: false,
      likes: 0,
      bookmarked: false,
      reactions: {},
    };

    setDiscussions((prev) => ({
      ...prev,
      [selectedTopic]: [newPost, ...prev[selectedTopic]],
    }));

    setTimeout(() => {
      addModeratorReply(newPost.id, selectedTopic);
    }, 3000);

    setNewPostContent("");
    setIsCreatePostExpanded(false);
    toast.success("Your post has been published!");
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCreatePostExpanded) {
        setIsCreatePostExpanded(false);
        setShowEmojiPicker(false);
        newPostRef.current?.blur();
      }
      if (e.key === 'Escape' && showReactionPicker) {
        setShowReactionPicker(null);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (showReactionPicker && !(e.target as Element).closest('.reaction-picker-container')) {
        setShowReactionPicker(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isCreatePostExpanded, showReactionPicker]);

  useEffect(() => {
    if (showProfileModal || showSettingsModal || showWelcomeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showProfileModal, showSettingsModal, showWelcomeModal]);

  const handleReply = (postId: string) => {
    if (!replyContent[postId]?.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    const newReply: Reply = {
      id: `r${Date.now()}`,
      author: "You",
      content: replyContent[postId],
      timestamp: new Date(),
    };

    setDiscussions((prev) => {
      const updatedDiscussions = [...prev[selectedTopic]];
      const postIndex = updatedDiscussions.findIndex((p) => p.id === postId);

      if (postIndex !== -1) {
        const currentPost = updatedDiscussions[postIndex];
        const isReplyingToOwnPost = currentPost.author === "You";
        
        const updatedPost = {
          ...currentPost,
          replies: [...currentPost.replies, newReply],
          answered: isReplyingToOwnPost ? currentPost.answered : true,
        };
        updatedDiscussions[postIndex] = updatedPost;
      }

      return {
        ...prev,
        [selectedTopic]: updatedDiscussions,
      };
    });

    setReplyContent((prev) => ({ ...prev, [postId]: "" }));
    toast.success("Reply posted successfully!");

    if (replyRefs.current[postId]) {
      replyRefs.current[postId]?.focus();
    }
  };

  const toggleBookmark = (postId: string) => {
    setDiscussions((prev) => {
      const newDiscussions = { ...prev };

      for (const topicId in newDiscussions) {
        const topicDiscussions = newDiscussions[topicId];
        const postIndex = topicDiscussions.findIndex((p) => p.id === postId);

        if (postIndex !== -1) {
          newDiscussions[topicId] = [
            ...topicDiscussions.slice(0, postIndex),
            {
              ...topicDiscussions[postIndex],
              bookmarked: !topicDiscussions[postIndex].bookmarked,
            },
            ...topicDiscussions.slice(postIndex + 1),
          ];

          break;
        }
      }

      return newDiscussions;
    });
  };

  const toggleLike = (postId: string) => {
    setDiscussions((prev) => {
      const updatedDiscussions = [...prev[selectedTopic]];
      const postIndex = updatedDiscussions.findIndex((p) => p.id === postId);

      if (postIndex !== -1) {
        updatedDiscussions[postIndex] = {
          ...updatedDiscussions[postIndex],
          likes:
            updatedDiscussions[postIndex].likes +
            (updatedDiscussions[postIndex].likedByUser ? -1 : 1),
          likedByUser: !updatedDiscussions[postIndex].likedByUser,
        };
      }

      return {
        ...prev,
        [selectedTopic]: updatedDiscussions,
      };
    });
  };

  const toggleReplyExpansion = (postId: string) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const addReaction = (postId: string, emoji: string) => {
    setDiscussions((prev) => {
      const newDiscussions = { ...prev };
      
      // Find the post across all topics
      for (const topicId in newDiscussions) {
        const topicDiscussions = [...newDiscussions[topicId]];
        const postIndex = topicDiscussions.findIndex((p) => p.id === postId);

        if (postIndex !== -1) {
          const post = topicDiscussions[postIndex];
          const reactions = { ...(post.reactions || {}) };
          const currentReaction = reactions[emoji] || { count: 0, users: [] };
          
          const hasUserReacted = currentReaction.users.includes("You");
          
          if (hasUserReacted) {
            // Remove reaction
            const newUsers = currentReaction.users.filter((user: string) => user !== "You");
            if (newUsers.length > 0) {
              reactions[emoji] = { count: newUsers.length, users: newUsers };
            } else {
              delete reactions[emoji];
            }
          } else {
            // Add reaction
            reactions[emoji] = { 
              count: currentReaction.count + 1, 
              users: [...currentReaction.users, "You"] 
            };
          }

          topicDiscussions[postIndex] = {
            ...post,
            reactions: reactions
          };
          
          newDiscussions[topicId] = topicDiscussions;
          break;
        }
      }

      return newDiscussions;
    });

    setShowReactionPicker(null);
  };

  const getReactionEmojis = () => [
    "👍", "❤️", "😊", "🔥", "🎉", "👏", "💯", "🚀"
  ];

  const currentDiscussions = discussions[selectedTopic] || [];

  let filteredDiscussions = [...currentDiscussions];

  if (activeFilter === "Most recent") {
    filteredDiscussions.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  } else if (activeFilter === "Most replied") {
    filteredDiscussions.sort((a, b) => b.replies.length - a.replies.length);
  } else if (activeFilter === "Unanswered") {
    filteredDiscussions = filteredDiscussions.filter(
      (d) => d.replies.length === 0
    );
  } else if (activeFilter === "Bookmarks") {
    filteredDiscussions = filteredDiscussions.filter(
      (d) => d.bookmarked
    );
  }

  const filteredTopics = trendingTopics.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEmojiClick = (emoji: string) => {
    setNewPostContent((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFormatText = (format: "bold" | "italic" | "link") => {
    const textarea = newPostRef.current;
    if (!textarea) return;

    textarea.focus();

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newPostContent.substring(start, end);

    let formattedText = "";
    let newCursorPos = start;

    switch (format) {
      case "bold":
        if (selectedText) {
          formattedText = `**${selectedText}**`;
          newCursorPos = start + formattedText.length;
        } else {
          formattedText = "**bold text**";
          newCursorPos = start + 2;
        }
        break;
      case "italic":
        if (selectedText) {
          formattedText = `*${selectedText}*`;
          newCursorPos = start + 1;
        } else {
          formattedText = "*italic text*";
          newCursorPos = start + 1;
        }
        break;
      case "link":
        if (selectedText) {
          formattedText = `[${selectedText}](https://example.com)`;
          newCursorPos = start + formattedText.length - 18;
        } else {
          formattedText = "[Click here](https://example.com)";
          newCursorPos = start + formattedText.length - 18;
        }
        break;
    }

    const newText =
      newPostContent.substring(0, start) +
      formattedText +
      newPostContent.substring(end);

    setNewPostContent(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#0E3D8B] hover:underline">$1</a>'
      );
  };

  if (isLoading) {
    return (
      <div className="relative h-screen w-screen overflow-hidden text-[#FFFFFF]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F1A] via-[#1A1A2E] to-[#16213E]">
          <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-[#A855F7] to-[#EC4899] rounded-full opacity-30 blur-3xl animate-pulse"></div>
          <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-full opacity-25 blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-[#EF4444] to-[#F97316] rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-32 right-32 w-64 h-64 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full opacity-25 blur-3xl"></div>
          </div>
        
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        
        <div className="relative z-10 flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
                  <FaComments className="w-12 h-12 text-[#A55EEA]" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-[#A55EEA] to-[#FF6B9D] rounded-full animate-ping"></div>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-2 tracking-wide">
            CommunityHub
          </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-[#A55EEA] to-[#FF6B9D] rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-white/80 mb-8">
            Connecting developers worldwide
          </p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-[#A55EEA] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#A55EEA] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-[#A55EEA] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative h-screen w-screen overflow-hidden text-[#FFFFFF]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F1A] via-[#1A1A2E] to-[#16213E]">
          <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-[#A855F7] to-[#EC4899] rounded-full opacity-30 blur-3xl animate-pulse"></div>
          <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-full opacity-25 blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-[#EF4444] to-[#F97316] rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-32 right-32 w-64 h-64 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full opacity-25 blur-3xl"></div>
        </div>
        
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row h-full w-full">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden fixed left-0 top-1/2 transform -translate-y-1/2 z-50 p-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-r-lg hover:bg-white/10 transition cursor-pointer"
          >
            {showSidebar ? (
                <FaChevronLeft className="text-white/60" />
            ) : (
                <FaChevronRight className="text-white/60" />
            )}
          </button>

          {showWelcomeModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl max-w-md w-full p-8 text-center shadow-2xl">
                <div className="flex justify-center mb-4">
                  <div className="bg-[#A55EEA]/20 p-6 rounded-full">
                    <FaComments className="w-16 h-16 text-[#A55EEA]" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Welcome to CommunityHub!</h2>
                <p className="text-base text-white/60 mb-6 leading-relaxed">
                  Join our vibrant community of developers. Share knowledge, ask questions, and connect.
                </p>
                <button
                  onClick={() => setShowWelcomeModal(false)}
                  className="w-full py-3 bg-gradient-to-r from-[#A55EEA] to-[#FF6B9D] text-white rounded-lg font-semibold hover:from-[#A55EEA]/90 hover:to-[#FF6B9D]/90 transition-colors cursor-pointer text-base"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}

          {showProfileModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl max-w-lg w-full p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Profile</h2>
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="text-white/60 hover:text-white text-xl cursor-pointer"
                  >
                    <FaTimes />
                  </button>
                </div>
                
                <div className="text-center mb-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#A55EEA] to-[#FF6B9D] flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                    JD
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">John Developer</h3>
                  <p className="text-white/60">Full Stack Developer</p>
              </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {Object.entries(getUserStats()).map(([key, value]) => (
                    <div key={key} className="text-center p-4 bg-white/10 rounded-lg">
                      <div className="text-2xl font-bold text-white mb-1">{value}</div>
                      <div className="text-sm text-white/60 capitalize">{key}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Joined</span>
                    <span className="text-white">January 2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Status</span>
                    <span className="text-green-400">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Reputation</span>
                    <span className="text-white">Advanced</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showSettingsModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl max-w-lg w-full p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Settings</h2>
                    <button
                    onClick={() => setShowSettingsModal(false)}
                    className="text-white/60 hover:text-white text-xl cursor-pointer"
                  >
                    ×
                    </button>
            </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Notifications</h3>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Push Notifications</span>
              <button
                        onClick={() => setUserSettings(prev => ({ ...prev, notifications: !prev.notifications }))}
                        className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                          userSettings.notifications ? 'bg-[#A55EEA]' : 'bg-white/20'
                        }`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                          userSettings.notifications ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
              </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Email Alerts</span>
                  <button
                        onClick={() => setUserSettings(prev => ({ ...prev, emailAlerts: !prev.emailAlerts }))}
                        className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                          userSettings.emailAlerts ? 'bg-[#A55EEA]' : 'bg-white/20'
                        }`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                          userSettings.emailAlerts ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                  </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Auto-save Drafts</span>
                  <button
                        onClick={() => setUserSettings(prev => ({ ...prev, autoSave: !prev.autoSave }))}
                        className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                          userSettings.autoSave ? 'bg-[#A55EEA]' : 'bg-white/20'
                        }`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                          userSettings.autoSave ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                  </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Theme</h3>
                    <div className="space-y-2">
                      {['dark', 'light', 'auto'].map((theme) => (
                  <button
                          key={theme}
                          onClick={() => setUserSettings(prev => ({ ...prev, theme }))}
                          className={`w-full p-3 rounded-lg text-left transition-colors cursor-pointer ${
                            userSettings.theme === theme 
                              ? 'bg-[#A55EEA]/20 text-[#A55EEA] border border-[#A55EEA]/30' 
                              : 'bg-white/10 text-white/60 hover:bg-white/20'
                          }`}
                        >
                          <span className="capitalize">{theme}</span>
                  </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowSettingsModal(false);
                      toast.success('Settings saved successfully');
                    }}
                    className="w-full py-3 bg-gradient-to-r from-[#A55EEA] to-[#FF6B9D] text-white rounded-lg font-semibold hover:from-[#A55EEA]/90 hover:to-[#FF6B9D]/90 transition-colors cursor-pointer"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
                </div>
              )}

                    <aside
            className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'
              } lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-black/30 backdrop-blur-xl border-r border-white/20 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl`}
          >
            <div className="overflow-auto flex-1">
              <div className="px-6 py-6">
                <h1 className="text-2xl font-bold text-white mb-0">CommunityHub</h1>
                
                <div className="mt-3 mb-6">
                  <div className="w-16 h-1 bg-gradient-to-r from-[#A55EEA] to-[#FF6B9D] rounded-full"></div>
            </div>

                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-white/10 border border-white/30 rounded-xl focus:outline-none focus:border-[#A55EEA] focus:ring-2 focus:ring-[#A55EEA]/20 text-base text-white placeholder:text-white/60 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                </div>

                <h2 className="text-sm font-semibold mb-4 text-white/60 uppercase tracking-wide">Trending</h2>
                <ul className="space-y-1">
                  {filteredTopics.map((topic) => (
                    <li key={topic.id}>
                        <button
                        onClick={() => {
                          setSelectedTopic(topic.id)
                        }}
                        className={`w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 text-base transition-all duration-300 cursor-pointer min-h-[56px]
                  ${topic.id === selectedTopic
                            ? 'bg-white/10 border border-white/20 text-white font-medium backdrop-blur-sm shadow-lg'
                            : 'hover:bg-white/5 text-white/60 hover:border-white/10 border border-transparent'
                          }`}
                      >
                        <span className="text-base flex-shrink-0">{topic.icon}</span>
                        <span className="truncate">{topic.title}</span>
                        </button>
                    </li>
                      ))}
                </ul>
              </div>
            </div>

            <div className="relative px-6 py-4 border-t border-white/10">
                      <button
                onClick={() => setShowProfileModal(true)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#A55EEA] to-[#FF6B9D] flex items-center justify-center text-white font-semibold">
                  JD
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium text-base text-white">John Developer</p>
                  <p className="text-sm text-white/60">Online</p>
                </div>
                      </button>
                  </div>
          </aside>

          <main className="flex-1 flex flex-col overflow-auto lg:ml-0 text-[#FFFFFF]">
            <div className="border-b border-white/20 px-4 lg:px-8 py-6 bg-black/30 backdrop-blur-xl shadow-lg">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-white mb-0">
                  {trendingTopics.find((t) => t.id === selectedTopic)?.title || "Select a topic"}
                </h1>
              </div>
            </div>

            <section className="flex-1 overflow-auto">
              <div className="p-6 lg:p-8 bg-black/30 backdrop-blur-xl shadow-lg create-post-section">
                <div className="flex flex-row gap-4">
                  <div className="flex-shrink-0">
                      <div className="sm:w-12 sm:h-12 w-10 h-10 rounded-full bg-gradient-to-r from-[#A55EEA] to-[#FF6B9D] flex items-center justify-center">
                      <FaUser className="text-white text-lg" />
                    </div>
                  </div>
                  <div className="flex-1">
                      <div className={`flex gap-4 ${isCreatePostExpanded ? 'flex-col' : 'flex-row items-start'}`}>
                        <div className="relative flex-1">
                      <textarea
                        ref={newPostRef}
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                            onFocus={() => setIsCreatePostExpanded(true)}
                            onBlur={(e) => {
                              setTimeout(() => {
                                if (!e.relatedTarget?.closest('.create-post-section') && !newPostContent.trim()) {
                                  setIsCreatePostExpanded(false);
                                }
                              }, 150);
                            }}
                            placeholder={isCreatePostExpanded ? "Share your thoughts..." : "What's on your mind?"}
                            className={`w-full bg-white/10 border border-white/30 rounded-xl focus:outline-none focus:border-[#A55EEA] focus:ring-2 focus:ring-[#A55EEA]/20 text-white placeholder:text-white/60 transition-colors duration-300 backdrop-blur-sm hover:bg-white/15 ${!isCreatePostExpanded ? 'h-[56px] px-4 py-3 resize-none' : 'p-4'}`}
                            rows={isCreatePostExpanded ? 3 : 1}
                        maxLength={500}
                      />
                          {isCreatePostExpanded && (
                            <div className="absolute bottom-2 right-2 text-xs text-white/60">
                        {newPostContent.length}/500
                      </div>
                          )}
                    </div>

                        {!isCreatePostExpanded && (
                          <button
                            onClick={handleCreatePost}
                            disabled={!newPostContent.trim()}
                            className={`px-6 rounded-xl font-semibold transition-colors duration-300 flex items-center justify-center gap-2 flex-shrink-0 h-[56px] border border-transparent ${newPostContent.trim()
                              ? "bg-gradient-to-r from-[#A55EEA] to-[#FF6B9D] text-white hover:from-[#A55EEA]/90 hover:to-[#FF6B9D]/90 cursor-pointer shadow-lg"
                              : "bg-white/10 text-white/40 cursor-not-allowed"
                              }`}
                          >
                            <FaPaperPlane className="text-base" />
                            <span className="text-base">Post</span>
                          </button>
                        )}
                      </div>

                      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isCreatePostExpanded ? 'max-h-24 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
                      }`}>
                        <div className="flex justify-between items-center gap-4">
                      <div className="flex gap-2">
                        <div className="relative">
                          <button
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white cursor-pointer transition-colors"
                          >
                            <FaSmile />
                          </button>
                          {showEmojiPicker && (
                                <div className="absolute bottom-12 left-0 bg-black/30 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl p-4 z-20 w-64">
                              <div className="grid grid-cols-8 gap-1">
                                {["😊", "👍", "❤️", "🎉", "🔥", "💡", "🚀", "⭐", "😄", "👏", "💪", "🎯", "✨", "🌟", "💎", "🏆"].map(
                                  (emoji) => (
                                    <button
                                      key={emoji}
                                      onClick={() => handleEmojiClick(emoji)}
                                          className="p-1 hover:bg-white/10 rounded text-lg cursor-pointer"
                                    >
                                      {emoji}
                                    </button>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                            <button onClick={() => handleFormatText("bold")} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white cursor-pointer transition-colors"><FaBold /></button>
                            <button onClick={() => handleFormatText("italic")} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white cursor-pointer transition-colors"><FaItalic /></button>
                            <button onClick={() => handleFormatText("link")} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white cursor-pointer transition-colors"><FaLink /></button>
                      </div>

                      <button
                        onClick={handleCreatePost}
                        disabled={!newPostContent.trim()}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 h-[48px] ${newPostContent.trim()
                              ? "bg-gradient-to-r from-[#A55EEA] to-[#FF6B9D] text-white hover:from-[#A55EEA]/90 hover:to-[#FF6B9D]/90 cursor-pointer shadow-lg"
                              : "bg-white/10 text-white/40 cursor-not-allowed"
                              }`}
                          >
                            <FaPaperPlane className="text-base" />
                            <span className="text-base">Post</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
                </div>

              <div className="px-6 lg:px-8 pt-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer flex items-center gap-2 border
            ${activeFilter === filter
                          ? "bg-gradient-to-r from-[#A55EEA] to-[#FF6B9D] text-white border-white/20 shadow-lg"
                          : "bg-white/10 text-white/60 hover:bg-white/20 hover:border-white/30 border-white/20 backdrop-blur-sm"
                        }`}
                      onClick={() => setActiveFilter(filter)}
                    >
                      {filter === "Bookmarks" && (
                        <FaBookmark className={activeFilter === filter ? "text-white" : "text-[#A55EEA]"} />
                      )}
                      <span>{filter}</span>
                      {filter === "Bookmarks" && (
                        <span className={`text-sm px-2 py-0.5 rounded-full ${
                          activeFilter === filter 
                            ? "bg-white/20 text-white" 
                            : "bg-[#A55EEA]/20 text-[#A55EEA]"
                        }`}>
                          {Object.values(discussions).flat().filter(d => d.bookmarked).length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-6 lg:px-8 pt-4 pb-6 lg:pb-8">
              {(() => {
                if (filteredDiscussions.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center h-full text-white/60 py-16">
                      <div className="bg-white/10 border border-white/20 rounded-xl w-20 h-20 mb-6 flex items-center justify-center">
                        {activeFilter === "Bookmarks" ? (
                          <FaBookmark className="text-3xl text-[#A55EEA]" />
                        ) : (
                          <FaComments className="text-3xl text-[#A55EEA]" />
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-white">
                        {activeFilter === "Bookmarks" ? "No bookmarked posts" : "No discussions yet"}
                      </h3>
                      <p className="mb-6 text-base text-white/60">
                        {activeFilter === "Bookmarks"
                          ? "Start bookmarking posts to see them here!"
                          : "Be the first to start a conversation!"}
                      </p>
                      {activeFilter !== "Bookmarks" && (
                        <button
                          onClick={() => newPostRef.current?.focus()}
                          className="px-6 py-3 bg-[#A55EEA]/20 text-[#A55EEA] rounded-lg hover:bg-[#A55EEA]/30 transition-colors cursor-pointer font-medium text-base"
                        >
                          Create a post
                        </button>
                      )}
                    </div>
                  );
                }

                return (
                  <ul className="space-y-8 max-w-4xl mx-auto">
                    {filteredDiscussions.map((d) => (
                      <li
                        key={d.id}
                        className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:bg-black/40 transition-all duration-300"
                      >
                        <div className="flex gap-4">
                          <div className="flex justify-center sm:block">
                            <div className="sm:w-12 sm:h-12 w-10 h-10 rounded-full bg-gradient-to-r from-[#A55EEA] to-[#FF6B9D] flex items-center justify-center text-white font-semibold">
                              {d.author.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-base text-white">{d.author}</span>
                              <span className="text-sm text-white/60">{formatRelativeTime(d.timestamp)}</span>
                              {d.replies.length > 0 ? (
                                <span className="ml-2 px-2 py-0.5 bg-[#2EA043]/20 text-[#2EA043] text-sm rounded-full">Answered</span>
                              ) : (
                                <span className="ml-2 px-2 py-0.5 bg-[#FB8500]/20 text-[#FB8500] text-sm rounded-full">Unanswered</span>
                              )}
                            </div>
                            <div
                              className="text-white mb-4 text-base leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: renderMarkdown(d.content),
                              }}
                            ></div>

                            <div className="flex items-center gap-4 text-white/60">
                              <button onClick={() => toggleLike(d.id)} className="flex items-center gap-1 hover:text-[#F85149] cursor-pointer">
                                {d.likedByUser ? <FaHeart className="text-[#F85149]" /> : <FaRegHeart />}
                                <span>{d.likes}</span>
                              </button>

                              <button onClick={() => toggleReplyExpansion(d.id)} className="flex items-center gap-1 hover:text-[#A55EEA] cursor-pointer">
                                <FaReply />
                                <span>
                                  {expandedPost === d.id ? "Hide" : "View"} {d.replies.length} {d.replies.length === 1 ? "reply" : "replies"}
                                </span>
                              </button>

                              <div className="relative reaction-picker-container">
                                <button 
                                  onClick={() => setShowReactionPicker(showReactionPicker === d.id ? null : d.id)}
                                  className="flex items-center gap-1 hover:text-[#A55EEA] cursor-pointer"
                                >
                                  <FaSmile />
                                  <span>React</span>
                                </button>
                                
                                {showReactionPicker === d.id && (
                                  <div className="absolute bottom-8 left-0 bg-black/60 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl p-4 z-20">
                                    <div className="flex gap-1">
                                      {getReactionEmojis().map((emoji) => (
                                        <button
                                          key={emoji}
                                          onClick={() => addReaction(d.id, emoji)}
                                          className="flex items-center justify-center w-10 h-10 hover:bg-white/20 rounded-lg text-2xl transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
                                          style={{ fontSize: '20px', lineHeight: '1' }}
                                        >
                                          <span role="img" aria-label={`React with ${emoji}`}>
                                            {emoji}
                                          </span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <button onClick={() => toggleBookmark(d.id)} className="ml-auto flex items-center gap-1 hover:text-[#A55EEA] cursor-pointer">
                                {d.bookmarked ? <FaBookmark className="text-[#A55EEA]" /> : <FaRegBookmark />}
                                <span>Bookmark</span>
                              </button>
                            </div>

                            {d.reactions && Object.keys(d.reactions).length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-4">
                                {Object.entries(d.reactions).map(([emoji, reaction]) => (
                                  <button
                                    key={emoji}
                                    onClick={() => addReaction(d.id, emoji)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                                      reaction.users.includes("You")
                                        ? "bg-[#A55EEA]/30 text-[#A55EEA] border-2 border-[#A55EEA]/50 shadow-lg"
                                        : "bg-white/15 text-white/80 hover:bg-white/25 border-2 border-white/20 hover:border-white/30"
                                    }`}
                                  >
                                    <span className="text-lg" style={{ fontSize: '18px', lineHeight: '1' }}>
                                      {emoji}
                                    </span>
                                    <span className="text-sm font-semibold">{reaction.count}</span>
                                  </button>
                                ))}
                              </div>
                            )}

                            {expandedPost === d.id && (
                              <div className="mt-6">
                                {d.replies.length > 0 && (
                                  <div className="mb-4">
                                    <h4 className="font-bold text-xl text-white mb-4">Replies</h4>
                                    <div className="space-y-4">
                                      {d.replies.map((reply) => (
                                        <div key={reply.id} className="flex flex-row gap-3">
                                          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/60 text-sm">
                                            {reply.author.charAt(0)}
                                          </div>
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="font-medium text-base text-white">
                                                {reply.author}
                                              </span>
                                              <span className="text-sm text-white/60">
                                                {formatRelativeTime(reply.timestamp)}
                                              </span>
                                            </div>
                                            <p className="text-white text-base leading-relaxed">
                                              {renderMarkdown(reply.content)}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                <div className="flex gap-3 mt-4">
                                  <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                      <FaUser className="text-white/60" />
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <textarea
                                      ref={(el) => {
                                        replyRefs.current[d.id] = el;
                                      }}
                                      value={replyContent[d.id] || ""}
                                      onChange={(e) =>
                                        setReplyContent((prev) => ({
                                          ...prev,
                                          [d.id]: e.target.value,
                                        }))
                                      }
                                      placeholder="Write a reply..."
                                      className="w-full p-3 border border-white/30 rounded-xl focus:outline-none focus:border-[#A55EEA] focus:ring-2 focus:ring-[#A55EEA]/20 bg-white/10 text-white placeholder:text-white/60 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                                      rows={2}
                                    />
                                    <div className="flex justify-end mt-2">
                                      <button
                                        onClick={() => handleReply(d.id)}
                                        className="px-4 py-2 bg-gradient-to-r from-[#A55EEA] to-[#FF6B9D] text-white rounded-lg text-base font-medium hover:from-[#A55EEA]/90 hover:to-[#FF6B9D]/90 transition cursor-pointer h-[40px] flex items-center gap-2"
                                      >
                                        <FaPaperPlane className="text-sm" />
                                        Reply
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                );
              })()}
              </div>
            </section>
          </main>


          <button
            onClick={() => setShowRightSidebar(!showRightSidebar)}
              className="lg:hidden fixed right-0 top-1/2 transform -translate-y-1/2 z-50 p-2 bg-black/20 backdrop-blur-md rounded-l-lg border border-white/10 border-r-0 hover:bg-white/10 transition-all duration-200 cursor-pointer"
          >
            {showRightSidebar ? (
                <FaChevronRight className="text-white/60 text-sm" />
            ) : (
                <FaChevronLeft className="text-white/60 text-sm" />
            )}
          </button>

          <aside
            className={`${showRightSidebar ? "translate-x-0" : "translate-x-full"
              } lg:translate-x-0 fixed lg:relative inset-y-0 right-0 z-40 w-full sm:w-80 bg-black/30 backdrop-blur-xl border-l border-white/20 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl`}
          >
            <div className="overflow-auto flex-1">
              <div className="px-6 py-6">
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
                  <span className="bg-[#A55EEA]/20 p-1 rounded mr-2">
                    <FaCrown className="text-[#A55EEA]" />
                  </span>
                  Moderators
                </h2>
                <ul className="space-y-4">
                  {moderators.map((mod) => (
                    <li
                      key={mod.name}
                      className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#A55EEA] to-[#FF6B9D] flex items-center justify-center text-white">
                        {mod.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-base truncate text-white">
                          {mod.name}
                        </p>
                        <p className="text-sm text-white/60 truncate">
                          {mod.role}
                        </p>
                      </div>
                      <span className="text-sm px-2 py-1 bg-[#2EA043]/20 text-[#2EA043] rounded-full">
                        Online
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-6 py-6">
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
                  <span className="bg-[#A55EEA]/20 p-1 rounded mr-2">
                    <FaUser className="text-[#A55EEA]" />
                  </span>
                  Active Now
                </h2>
                <ul className="space-y-3">
                  {activeUsers.map((user) => (
                    <li
                      key={user.name}
                      className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/60 text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#2EA043] rounded-full border-2 border-black/20"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-base truncate text-white">
                          {user.name}
                        </p>
                      </div>
                      <span className="text-sm text-white/60">
                        {user.activity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>


            </div>

            <footer className="px-6 py-4 text-sm text-white/60">
              <p className="font-semibold text-base text-white mb-0">CommunityHub v1.0</p>
              <p className="mt-1">Connecting developers worldwide</p>
              <p className="mt-2">
                {new Date().getFullYear()} All rights reserved
              </p>
            </footer>
          </aside>
        </div>
      </div>
      <Toaster position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(16px)",
            color: "#FFFFFF",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          },
          success: {
            style: {
              background: "linear-gradient(135deg, rgba(165, 94, 234, 0.2), rgba(255, 107, 157, 0.2))",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(165, 94, 234, 0.3)",
            },
            iconTheme: {
              primary: "#A55EEA",
              secondary: "#FFFFFF",
            },
          },
          error: {
            style: {
              background: "rgba(239, 68, 68, 0.2)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "#FFFFFF",
            },
          },
        }}
      />
      <style>{`
             @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
      
              body {
                font-family: 'Poppins', sans-serif;
              }
              
              *::-webkit-scrollbar {
                display: none;
              }
              
              * {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              
              `}
      </style>
    </>
  );
};

export default CommunityDashboard;