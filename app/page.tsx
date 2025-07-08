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
      topic: "React Tips",
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
      topic: "React Tips",
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
      topic: "React Tips",
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
      topic: "TypeScript",
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
      topic: "TypeScript",
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
      topic: "Tailwind CSS",
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
      topic: "Deployment",
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
type FilterType = "Most recent" | "Most replied" | "Unanswered";
const filters: FilterType[] = [
  "Most recent",
  "Most replied",
  "Unanswered",
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
  topic: string;
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
const calculateDynamicTrendingTopics = (discussions: { [key: number]: Discussion[] }) => {
  const topicCounts: { [topic: string]: number } = {};
  // Count posts for all topics, including those with 0 posts
  trendingTopics.forEach(topic => {
    const topicPosts = discussions[topic.id] || [];
    topicCounts[topic.title] = topicPosts.length;
  });
  const topicScores = Object.keys(topicCounts).map(topic => {
    const count = topicCounts[topic] || 0;
    return {
      topic,
      count,
      activity: 0,
      score: count
    };
  });
  const topicStats = topicScores
    .sort((a, b) => {
      if (b.count === a.count) {
        return a.topic.localeCompare(b.topic);
      }
      return b.count - a.count;
    })
    .slice(0, 5);
  return { 
    topicStats
  };
};
const CommunityDashboard: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("Most recent");
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
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
  const [showBookmarks, setShowBookmarks] = useState<boolean>(false);
  const [selectedTopicForPost, setSelectedTopicForPost] = useState<number>(trendingTopics[0].id);
  const [dynamicTrendingTopics, setDynamicTrendingTopics] = useState<{
    topicStats: { topic: string; count: number; activity: number; score: number; }[];
  }>({ topicStats: [] });
  const [newCommentId, setNewCommentId] = useState<string | null>(null);
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
  const handleTopicChange = (topicId: number | null) => {
    if (selectedTopic === topicId) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedTopic(topicId);
      setShowBookmarks(false);
      setIsTransitioning(false);
    }, 150);
  };
  const handleFilterChange = (filter: FilterType) => {
    if (activeFilter === filter) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveFilter(filter);
      setIsTransitioning(false);
    }, 150);
  };
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
    const userPosts = allDiscussions.filter(d => d.author === "John Doe");
    const userReplies = allDiscussions.reduce((acc, d) => 
      acc + d.replies.filter(r => r.author === "John Doe").length, 0);
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
    // Set the new moderator comment for highlighting
    setNewCommentId(moderatorReply.id);
    // Scroll to the new moderator comment after state update
    setTimeout(() => {
      const repliesContainer = document.getElementById(`replies-container-${postId}`);
      if (repliesContainer) {
        repliesContainer.scrollTop = 0; // Scroll to top since newest is at top
      }
    }, 100);
    // Clear the highlight after animation
    setTimeout(() => {
      setNewCommentId(null);
    }, 2500);
  };
  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }
    const assignedTopic = trendingTopics.find(t => t.id === selectedTopicForPost)?.title || "General";
    const newPost: Discussion = {
      id: `d${Date.now()}`,
      author: "John Doe",
      content: newPostContent,
      replies: [],
      timestamp: new Date(),
      answered: false,
      likes: 0,
      bookmarked: false,
      reactions: {},
      topic: assignedTopic,
    };
    setDiscussions((prev) => ({
      ...prev,
      [selectedTopicForPost]: [newPost, ...(prev[selectedTopicForPost] || [])],
    }));
    setTimeout(() => {
      addModeratorReply(newPost.id, selectedTopicForPost);
    }, 3000);
    setNewPostContent("");
    setIsCreatePostExpanded(false);
    toast.success(`Your post has been published in ${assignedTopic}!`);
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
      if (showEmojiPicker && !(e.target as Element).closest('.emoji-picker-container')) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isCreatePostExpanded, showReactionPicker ?? '', showEmojiPicker]);
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
  useEffect(() => {
    const trending = calculateDynamicTrendingTopics(discussions);
    setDynamicTrendingTopics(trending);
  }, [discussions]);
  const handleReply = (postId: string) => {
    if (!replyContent[postId]?.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }
    const newReply: Reply = {
      id: `r${Date.now()}`,
      author: "John Doe",
      content: replyContent[postId],
      timestamp: new Date(),
    };
    setDiscussions((prev) => {
      const newDiscussions = { ...prev };
      // Find the post across all topics
      for (const topicId in newDiscussions) {
        const topicDiscussions = [...newDiscussions[topicId]];
        const postIndex = topicDiscussions.findIndex((p) => p.id === postId);
        if (postIndex !== -1) {
          const currentPost = topicDiscussions[postIndex];
          const isReplyingToOwnPost = currentPost.author === "John Doe";
          const updatedPost = {
            ...currentPost,
            replies: [...currentPost.replies, newReply],
            answered: isReplyingToOwnPost ? currentPost.answered : true,
          };
          topicDiscussions[postIndex] = updatedPost;
          newDiscussions[topicId] = topicDiscussions;
          break;
        }
      }
      return newDiscussions;
    });
    setReplyContent((prev) => ({ ...prev, [postId]: "" }));
    toast.success("Reply posted successfully!");
    // Set the new comment for highlighting
    setNewCommentId(newReply.id);
    // Scroll to the new comment after state update
    setTimeout(() => {
      const repliesContainer = document.getElementById(`replies-container-${postId}`);
      if (repliesContainer) {
        repliesContainer.scrollTop = 0; // Scroll to top since newest is at top
      }
    }, 100);
    // Clear the highlight after animation
    setTimeout(() => {
      setNewCommentId(null);
    }, 2500);
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
      const newDiscussions = { ...prev };
      // Find the post across all topics
      for (const topicId in newDiscussions) {
        const topicDiscussions = [...newDiscussions[topicId]];
        const postIndex = topicDiscussions.findIndex((p) => p.id === postId);
        if (postIndex !== -1) {
          topicDiscussions[postIndex] = {
            ...topicDiscussions[postIndex],
            likes:
              topicDiscussions[postIndex].likes +
              (topicDiscussions[postIndex].likedByUser ? -1 : 1),
            likedByUser: !topicDiscussions[postIndex].likedByUser,
          };
          newDiscussions[topicId] = topicDiscussions;
          break;
        }
      }
      return newDiscussions;
    });
  };
  const toggleReplyExpansion = (postId: string) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };
  const addReaction = (postId: string, emoji: string) => {
    setDiscussions((prev) => {
      const newDiscussions = { ...prev };
      for (const topicId in newDiscussions) {
        const topicDiscussions = [...newDiscussions[topicId]];
        const postIndex = topicDiscussions.findIndex((p) => p.id === postId);
        if (postIndex !== -1) {
          const post = topicDiscussions[postIndex];
          const reactions = { ...(post.reactions || {}) };
          const currentReaction = reactions[emoji] || { count: 0, users: [] };
          const hasUserReacted = currentReaction.users.includes("John Doe");
          if (hasUserReacted) {
            const newUsers = currentReaction.users.filter((user: string) => user !== "John Doe");
            if (newUsers.length > 0) {
              reactions[emoji] = { count: newUsers.length, users: newUsers };
            } else {
              delete reactions[emoji];
            }
          } else {
            reactions[emoji] = { 
              count: currentReaction.count + 1, 
              users: [...currentReaction.users, "John Doe"] 
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
  const getAllBookmarkedPosts = () => {
    const allPosts = Object.values(discussions).flat();
    return allPosts.filter(post => post.bookmarked);
  };
  const currentDiscussions = showBookmarks 
    ? getAllBookmarkedPosts() 
    : selectedTopic 
      ? (discussions[selectedTopic] || [])
      : Object.values(discussions).flat();
  let filteredDiscussions = [...currentDiscussions];
  if (!showBookmarks) {
    if (activeFilter === "Most recent") {
      filteredDiscussions.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
    } else if (activeFilter === "Most replied") {
      filteredDiscussions.sort((a, b) => b.replies.length - a.replies.length);
    } else if (activeFilter === "Unanswered") {
      filteredDiscussions = filteredDiscussions.filter(
        (d) => d.replies.length === 0
      );
    }
  } else {
    filteredDiscussions.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  }
  const filteredTopics = trendingTopics.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleEmojiClick = (emoji: string) => {
    setNewPostContent((prev) => prev + emoji);
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
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#A55EEA] hover:text-[#FF6B9D] hover:underline transition-colors duration-200">$1</a>'
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
            <h1 className="text-5xl font-bold mb-2 tracking-wide bg-gradient-to-r from-[#A55EEA] via-[#FF6B9D] to-[#3B82F6] bg-clip-text text-transparent animate-pulse">
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
              <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-lg sm:rounded-2xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl">
                <div className="flex justify-center mb-4">
                  <div className="bg-[#A55EEA]/20 p-4 sm:p-6 rounded-full">
                    <FaComments className="w-12 h-12 sm:w-16 sm:h-16 text-[#A55EEA]" />
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Welcome to CommunityHub!</h2>
                <p className="text-sm sm:text-base text-white/60 mb-6 leading-relaxed">
                  Join our vibrant community of developers. Share knowledge, ask questions, and connect.
                </p>
                <button
                  onClick={() => setShowWelcomeModal(false)}
                  className="w-full py-3 bg-gradient-to-r from-[#A55EEA] to-[#FF6B9D] text-white rounded-lg font-semibold hover:from-[#A55EEA]/90 hover:to-[#FF6B9D]/90 transition-colors cursor-pointer text-sm sm:text-base"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
          {showProfileModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-lg sm:rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Profile</h2>
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="text-white/60 hover:text-white text-lg sm:text-xl cursor-pointer"
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="text-center mb-6 sm:mb-8">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-[#A55EEA] to-[#FF6B9D] flex items-center justify-center text-white font-bold text-lg sm:text-2xl mx-auto mb-4">
                    JD
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">John Doe</h3>
                  <p className="text-sm sm:text-base text-white/60">Full Stack Developer</p>
              </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                  {Object.entries(getUserStats()).map(([key, value]) => (
                    <div key={key} className="text-center p-3 sm:p-4 bg-white/10 rounded-lg">
                      <div className="text-lg sm:text-2xl font-bold text-white mb-1">{value}</div>
                      <div className="text-xs sm:text-sm text-white/60 capitalize">{key}</div>
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
              <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-lg sm:rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Settings</h2>
                    <button
                    onClick={() => setShowSettingsModal(false)}
                    className="text-white/60 hover:text-white text-lg sm:text-xl cursor-pointer"
                  >
                    ×
                    </button>
            </div>
                <div className="space-y-5 sm:space-y-6">
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-white">Notifications</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base text-white/80">Push Notifications</span>
              <button
                        onClick={() => setUserSettings(prev => ({ ...prev, notifications: !prev.notifications }))}
                        className={`relative w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-colors cursor-pointer ${
                          userSettings.notifications ? 'bg-[#A55EEA]' : 'bg-white/20'
                        }`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white transition-transform duration-200 ${
                          userSettings.notifications ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0.5'
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
              } lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-40 w-full sm:w-80 lg:w-72 xl:w-80 bg-black/30 backdrop-blur-xl border-r border-white/20 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl`}
          >
            <div className="overflow-auto flex-1">
              <div className="px-4 sm:px-6 py-4 sm:py-6">
                <div className="flex items-center gap-3 mb-0">
                  <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-[#A55EEA] via-[#FF6B9D] to-[#3B82F6] bg-clip-text text-transparent">
                    CommunityHub
                  </h1>
                </div>
                <div className="mt-2 sm:mt-3 mb-4 sm:mb-6">
                  <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-[#A55EEA] to-[#FF6B9D] rounded-full"></div>
            </div>
                <div className="relative mb-4 sm:mb-6">
                  <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 sm:py-4 bg-white/10 border border-white/30 rounded-xl focus:outline-none focus:border-[#A55EEA] focus:ring-2 focus:ring-[#A55EEA]/20 text-sm sm:text-base text-white placeholder:text-white/60 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 text-sm sm:text-base" />
                </div>
                <h2 className="text-sm font-semibold mb-4 text-white/60 uppercase tracking-wide">Trending Topics</h2>
                <ul className="space-y-1">
                  {filteredTopics
                    .map((topic) => {
                      const topicStats = dynamicTrendingTopics.topicStats.find(stat => stat.topic === topic.title);
                      const trendingRank = topicStats ? dynamicTrendingTopics.topicStats.findIndex(stat => stat.topic === topic.title) + 1 : null;
                      return { ...topic, trendingRank };
                    })
                    .sort((a, b) => {
                      if (a.trendingRank && b.trendingRank) {
                        return a.trendingRank - b.trendingRank;
                      }
                      if (a.trendingRank && !b.trendingRank) {
                        return -1;
                      }
                      if (!a.trendingRank && b.trendingRank) {
                        return 1;
                      }
                      return a.id - b.id;
                    })
                    .map((topic) => {
                    return (
                    <li key={topic.id}>
                        <button
                        onClick={() => {
                          handleTopicChange(selectedTopic === topic.id ? null : topic.id);
                        }}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-left flex items-center gap-2 sm:gap-3 text-sm sm:text-base transition-all duration-300 cursor-pointer min-h-[48px] sm:min-h-[56px]
                  ${topic.id === selectedTopic && !showBookmarks
                            ? 'bg-white/10 border border-white/20 text-white font-medium backdrop-blur-sm shadow-lg'
                            : 'hover:bg-white/5 text-white/60 hover:border-white/10 border border-transparent'
                          }`}
                      >
                        <span className="text-base flex-shrink-0">{topic.icon}</span>
                        <span className="truncate flex-1">{topic.title}</span>
                        {topic.trendingRank && topic.trendingRank <= 5 && (
                          <span className="text-xs bg-[#A55EEA]/20 text-[#A55EEA] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0">
                            #{topic.trendingRank}
                          </span>
                        )}
                        </button>
                    </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="relative px-3 sm:px-6 py-3 sm:py-4 border-t border-white/10">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer flex-1 min-w-0"
                >
                  <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gradient-to-r from-[#A55EEA] to-[#FF6B9D] flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
                    JD
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base text-white truncate">John Doe</p>
                    <p className="text-xs sm:text-sm text-white/60">Online</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setShowBookmarks(!showBookmarks);
                      setIsTransitioning(false);
                    }, 150);
                  }}
                  className={`p-2 rounded-lg transition-colors cursor-pointer flex-shrink-0 ${
                    showBookmarks 
                      ? 'bg-[#A55EEA]/20 text-[#A55EEA]' 
                      : 'hover:bg-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <FaBookmark className="text-base sm:text-lg" />
                </button>
              </div>
            </div>
          </aside>
          <main className="flex-1 flex flex-col overflow-auto lg:ml-0 text-[#FFFFFF]">
            <div className="border-b border-white/20 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-black/30 backdrop-blur-xl shadow-lg">
              <div className="flex items-center gap-4">
                <h1 className={`text-xl sm:text-2xl font-bold text-white mb-0 truncate transition-all duration-300 ${
                  isTransitioning ? 'opacity-0 transform translate-y-1' : 'opacity-100 transform translate-y-0'
                }`}>
                  {showBookmarks 
                    ? "Bookmarks" 
                    : selectedTopic 
                      ? trendingTopics.find((t) => t.id === selectedTopic)?.title || "Select a topic"
                      : "All Posts"
                  }
                </h1>
              </div>
            </div>
            <section className="flex-1 overflow-auto">
              {!showBookmarks && (
                <div className={`p-4 sm:p-6 lg:p-8 bg-black/30 backdrop-blur-xl shadow-lg create-post-section transition-all duration-300 ${
                  isTransitioning ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'
                }`}>
                  <div className="flex flex-row gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#A55EEA] to-[#FF6B9D] flex items-center justify-center">
                        <FaUser className="text-white text-sm sm:text-lg" />
                      </div>
                    </div>
                    <div className="flex-1">
                        <div className={`flex gap-3 sm:gap-4 ${isCreatePostExpanded ? 'flex-col' : 'flex-row items-start'}`}>
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
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  if (newPostContent.trim()) {
                                    handleCreatePost();
                                  }
                                }
                              }}
                              placeholder={isCreatePostExpanded ? "Share your thoughts..." : "What's on your mind?"}
                              className={`w-full bg-white/10 border border-white/30 rounded-lg sm:rounded-xl focus:outline-none focus:border-[#A55EEA] focus:ring-2 focus:ring-[#A55EEA]/20 text-sm sm:text-base text-white placeholder:text-white/60 transition-colors duration-300 backdrop-blur-sm hover:bg-white/15 ${!isCreatePostExpanded ? 'h-[48px] sm:h-[56px] px-3 sm:px-4 py-0 leading-[48px] sm:leading-[56px] resize-none' : 'p-3 sm:p-4'}`}
                              rows={isCreatePostExpanded ? 3 : 1}
                          maxLength={500}
                        />
                                                      {isCreatePostExpanded && (
                            <div className="absolute bottom-2 right-2 text-xs text-white/60">
                        {newPostContent.length}/500
                      </div>
                          )}
                    </div>
                        {isCreatePostExpanded && (
                          <div className=" space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-white/80 mb-2">
                                Topic
                              </label>
                              <select
                                value={selectedTopicForPost}
                                onChange={(e) => setSelectedTopicForPost(parseInt(e.target.value))}
                                className="w-full p-2 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#A55EEA] focus:ring-2 focus:ring-[#A55EEA]/20 text-white"
                              >
                                {trendingTopics.map((topic) => (
                                  <option key={topic.id} value={topic.id} className="bg-gray-800 text-white">
                                    {topic.title}
                                  </option>
                                ))}
                              </select>
                              <p className="text-xs text-white/60 mt-1">
                                Select the topic for your post
                              </p>
                            </div>
                          </div>
                        )}
                        {!isCreatePostExpanded && (
                            <button
                              onClick={handleCreatePost}
                              disabled={!newPostContent.trim()}
                              className={`px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold transition-colors duration-300 flex items-center justify-center gap-2 flex-shrink-0 h-[48px] sm:h-[56px] border border-transparent ${newPostContent.trim()
                                ? "bg-gradient-to-r from-[#A55EEA] to-[#FF6B9D] text-white hover:from-[#A55EEA]/90 hover:to-[#FF6B9D]/90 cursor-pointer shadow-lg"
                                : "bg-white/10 text-white/40 cursor-not-allowed"
                                }`}
                            >
                              <FaPaperPlane className="text-sm sm:text-base" />
                              <span className="text-sm sm:text-base">Post</span>
                            </button>
                          )}
                        </div>
                        <div className={`transition-all duration-300 ease-in-out ${!showEmojiPicker ? 'overflow-hidden' : ''} ${
                          isCreatePostExpanded ? 'max-h-24 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
                        }`}>
                          <div className="flex justify-between items-center gap-4">
                        <div className="flex gap-2">
                          <div className="relative emoji-picker-container">
                            <button
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                              className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                                showEmojiPicker 
                                  ? 'bg-gradient-to-r from-[#A55EEA]/20 to-[#FF6B9D]/20 text-[#A55EEA] border border-[#A55EEA]/30' 
                                  : 'hover:bg-white/10 text-white/60 hover:text-white border border-transparent'
                              }`}
                            >
                              <FaSmile />
                            </button>
                            {showEmojiPicker && (
                              <div className="absolute bottom-12 left-0 bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1A] backdrop-blur-xl border border-[#A55EEA]/30 rounded-xl shadow-2xl p-3 z-20 w-72 transform animate-in fade-in-0 zoom-in-95 duration-200">
                                <div className="flex items-center justify-between mb-3">
                                  <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                                    <FaSmile className="text-[#A55EEA] text-xs" />
                                    Pick emoji
                                  </h3>
                                  <button
                                    onClick={() => setShowEmojiPicker(false)}
                                    className="text-white/60 hover:text-white transition-colors hover:bg-white/10 rounded-full w-5 h-5 flex items-center justify-center"
                                  >
                                    <FaTimes className="text-xs" />
                                  </button>
                                </div>
                                <div className="grid grid-cols-8 gap-1">
                                  {["😊", "👍", "❤️", "🎉", "🔥", "💡", "🚀", "⭐", "😄", "👏", "💪", "🎯", "✨", "🌟", "💎", "🏆"].map(
                                    (emoji) => (
                                      <button
                                        key={emoji}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleEmojiClick(emoji)}
                                        className="relative p-2 rounded-lg text-lg cursor-pointer transition-all duration-200 flex items-center justify-center w-8 h-8 hover:scale-110 active:scale-95 hover:bg-[#A55EEA]/20 hover:shadow-lg"
                                        style={{ fontSize: '18px', lineHeight: '1' }}
                                      >
                                        <span role="img" aria-label={`Insert ${emoji}`}>
                                          {emoji}
                                        </span>
                                      </button>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormatText("bold")} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white cursor-pointer transition-colors"><FaBold /></button>
                          <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormatText("italic")} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white cursor-pointer transition-colors"><FaItalic /></button>
                          <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormatText("link")} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white cursor-pointer transition-colors"><FaLink /></button>
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
              )}
              {!showBookmarks && (
                <div className="px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-2">
                  <div className={`flex flex-wrap gap-2 transition-all duration-300 ${
                    isTransitioning ? 'opacity-0 transform translate-y-1' : 'opacity-100 transform translate-y-0'
                  }`}>
                    {filters.map((filter) => (
                      <button
                        key={filter}
                        className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer flex items-center gap-2 border
              ${activeFilter === filter
                            ? "bg-gradient-to-r from-[#A55EEA] to-[#FF6B9D] text-white border-white/20 shadow-lg"
                            : "bg-white/10 text-white/60 hover:bg-white/20 hover:border-white/30 border-white/20 backdrop-blur-sm"
                          }`}
                        onClick={() => handleFilterChange(filter)}
                      >
                        <span>{filter}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-6 lg:pb-8">
              {(() => {
                                if (filteredDiscussions.length === 0) {
                  return (
                    <div className={`flex flex-col items-center justify-center h-full text-white/60 py-12 sm:py-16 transition-all duration-300 ${
                      isTransitioning ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'
                    }`}>
                      <div className="bg-white/10 border border-white/20 rounded-xl w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 flex items-center justify-center">
                        {showBookmarks ? (
                          <FaBookmark className="text-2xl sm:text-3xl text-[#A55EEA]" />
                        ) : (
                          <FaComments className="text-2xl sm:text-3xl text-[#A55EEA]" />
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white text-center px-4">
                        {showBookmarks ? "No bookmarked posts" : "No discussions yet"}
                      </h3>
                      <p className="mb-4 sm:mb-6 text-sm sm:text-base text-white/60 text-center px-4">
                        {showBookmarks
                          ? "Start bookmarking posts to see them here!"
                          : "Be the first to start a conversation!"}
                      </p>
                      {!showBookmarks && (
                        <button
                          onClick={() => newPostRef.current?.focus()}
                          className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#A55EEA]/20 text-[#A55EEA] rounded-lg hover:bg-[#A55EEA]/30 transition-colors cursor-pointer font-medium text-sm sm:text-base"
                        >
                          Create a post
                        </button>
                      )}
                    </div>
                  );
                }
                return (
                  <ul className={`space-y-6 sm:space-y-8 max-w-4xl mx-auto transition-all duration-300 ${
                    isTransitioning ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'
                  }`}>
                    {filteredDiscussions.map((d) => (
                      <li
                        key={d.id}
                        className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl hover:bg-black/40 transition-all duration-300"
                      >
                        <div className="flex gap-3 sm:gap-4">
                          <div className="flex justify-center sm:block">
                            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#A55EEA] to-[#FF6B9D] flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                              {d.author.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="font-semibold text-sm sm:text-base text-white">{d.author}</span>
                              <span className="text-xs sm:text-sm text-white/60">{formatRelativeTime(d.timestamp)}</span>
                              {d.replies.length > 0 ? (
                                <span className="px-2 py-0.5 bg-[#2EA043]/20 text-[#2EA043] text-xs sm:text-sm rounded-full">Answered</span>
                              ) : (
                                <span className="px-2 py-0.5 bg-[#FB8500]/20 text-[#FB8500] text-xs sm:text-sm rounded-full">Unanswered</span>
                              )}
                            </div>
                            <div
                              className="text-white mb-4 text-sm sm:text-base leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: renderMarkdown(d.content),
                              }}
                            ></div>
                            {d.topic && (
                              <div className="mb-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-white/60">Topic:</span>
                                  <span className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full">
                                    {d.topic}
                                  </span>
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-3 sm:gap-4 text-white/60 text-sm sm:text-base flex-wrap">
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
                                  <div className="absolute bottom-8 left-0 bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1A] backdrop-blur-xl border border-[#A55EEA]/30 rounded-xl shadow-2xl p-3 z-20 transform animate-in fade-in-0 zoom-in-95 duration-200">
                                    <div className="flex items-center justify-between mb-2">
                                      <h3 className="text-xs font-semibold text-white flex items-center gap-1">
                                        <FaSmile className="text-[#A55EEA] text-xs" />
                                        React
                                      </h3>
                                      <button
                                        onClick={() => setShowReactionPicker(null)}
                                        className="text-white/60 hover:text-white transition-colors hover:bg-white/10 rounded-full w-5 h-5 flex items-center justify-center"
                                      >
                                        <FaTimes className="text-xs" />
                                      </button>
                                    </div>
                                    <div className="flex gap-1">
                                      {getReactionEmojis().map((emoji) => (
                                        <button
                                          key={emoji}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            addReaction(d.id, emoji);
                                          }}
                                          className="relative flex items-center justify-center w-8 h-8 rounded-lg text-lg transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 hover:bg-[#A55EEA]/20 hover:shadow-lg"
                                          style={{ fontSize: '18px', lineHeight: '1' }}
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
                                <span>{d.bookmarked ? "Bookmarked" : "Bookmark"}</span>
                              </button>
                            </div>
                            {d.reactions && Object.keys(d.reactions).length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-4">
                                {Object.entries(d.reactions).map(([emoji, reaction]) => (
                                  <button
                                    key={emoji}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addReaction(d.id, emoji);
                                    }}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                                      reaction.users.includes("John Doe")
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
                                    <div className="flex items-center justify-between mb-4">
                                      <h4 className="font-bold text-xl text-white">Replies</h4>
                                      {d.replies.length > 3 && (
                                        <span className="text-sm text-white/60 px-2 py-1 bg-white/10 rounded-full">
                                          {d.replies.length} replies
                                        </span>
                                      )}
                                    </div>
                                    <div 
                                      className={`space-y-4 ${d.replies.length > 3 ? 'overflow-y-auto pr-2 replies-scroll pb-2' : ''}`} 
                                      style={d.replies.length > 3 ? { maxHeight: '240px' } : {}}
                                      id={`replies-container-${d.id}`}
                                    >
                                      {[...d.replies].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).map((reply) => (
                                        <div 
                                          key={reply.id} 
                                          className={`flex flex-row gap-3 rounded-xl p-3 -m-3 ${
                                            newCommentId === reply.id ? 'new-comment-highlight' : ''
                                          }`} 
                                          id={`reply-${reply.id}`}
                                        >
                                          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/60 text-sm">
                                            {reply.author === "John Doe" ? "JD" : reply.author.charAt(0)}
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
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                          e.preventDefault();
                                          if (replyContent[d.id]?.trim()) {
                                            handleReply(d.id);
                                          }
                                        }
                                      }}
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
              } lg:translate-x-0 fixed lg:relative inset-y-0 right-0 z-40 w-full sm:w-80 lg:w-72 xl:w-80 bg-black/30 backdrop-blur-xl border-l border-white/20 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl`}
          >
            <div className="overflow-auto flex-1">
              <div className="px-4 sm:px-6 py-4 sm:py-6">
                <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                  <span className="bg-[#A55EEA]/20 p-1 rounded mr-2">
                    <FaCrown className="text-[#A55EEA] text-sm sm:text-base" />
                  </span>
                  Moderators
                </h2>
                <ul className="space-y-3 sm:space-y-4">
                  {moderators.map((mod) => (
                    <li
                      key={mod.name}
                      className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#A55EEA] to-[#FF6B9D] flex items-center justify-center text-white text-sm sm:text-base flex-shrink-0">
                        {mod.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate text-white">
                          {mod.name}
                        </p>
                        <p className="text-xs sm:text-sm text-white/60 truncate">
                          {mod.role}
                        </p>
                      </div>
                      <span className="text-xs sm:text-sm px-2 py-1 bg-[#2EA043]/20 text-[#2EA043] rounded-full flex-shrink-0">
                        Online
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-4 sm:px-6 py-4 sm:py-6">
                <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                  <span className="bg-[#A55EEA]/20 p-1 rounded mr-2">
                    <FaUser className="text-[#A55EEA] text-sm sm:text-base" />
                  </span>
                  Active Now
                </h2>
                <ul className="space-y-2 sm:space-y-3">
                  {activeUsers.map((user) => (
                    <li
                      key={user.name}
                      className="flex items-center gap-2 sm:gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/60 text-xs sm:text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#2EA043] rounded-full border-2 border-black/20"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate text-white">
                          {user.name}
                        </p>
                      </div>
                      <span className="text-xs sm:text-sm text-white/60 flex-shrink-0">
                        {user.activity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <footer className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-white/60">
              <p className="font-semibold text-sm sm:text-base mb-0 bg-gradient-to-r from-[#A55EEA] via-[#FF6B9D] to-[#3B82F6] bg-clip-text text-transparent">CommunityHub v1.0</p>
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
              .replies-scroll {
                scroll-behavior: smooth;
              }
              .replies-scroll::-webkit-scrollbar {
                width: 6px;
              }
              .replies-scroll::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
                margin: 4px 0;
              }
              .replies-scroll::-webkit-scrollbar-thumb {
                background: rgba(165, 94, 234, 0.6);
                border-radius: 3px;
                min-height: 20px;
              }
              .replies-scroll::-webkit-scrollbar-thumb:hover {
                background: rgba(165, 94, 234, 0.8);
              }
              @keyframes highlight-new-comment {
                0% { 
                  background: rgba(165, 94, 234, 0.3);
                  border-radius: 12px;
                  box-shadow: 0 0 0 2px rgba(165, 94, 234, 0.2);
                }
                100% { 
                  background: transparent;
                  border-radius: 12px;
                  box-shadow: 0 0 0 0px rgba(165, 94, 234, 0);
                }
              }
              .new-comment-highlight {
                animation: highlight-new-comment 2s ease-out;
                border-radius: 12px;
              }
              `}
      </style>
    </>
  );
};
export default CommunityDashboard;