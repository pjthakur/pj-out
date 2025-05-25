"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  Bell,
  User,
  ChevronDown,
  MessageSquare,
  Heart,
  Share2,
  Reply,
  Award,
  Filter,
  Settings,
  Menu,
  X,
  Hash,
  ThumbsUp,
  Send,
  Clock,
  Bookmark,
  Home,
  Compass,
  LogOut,
  UserCircle,
  HelpCircle,
  Star,
  Briefcase,
  Shield,
  Calendar,
  Inbox,
  BarChart2,
  Users,
  Edit,
  Trash,
  Flag,
  ExternalLink,
  Building2,
  Lightbulb,
  Wrench,
  TrendingUp,
} from "lucide-react";

// TypeScript interfaces
interface UserType {
  id: string;
  name: string;
  avatar: string;
  role: string;
  isOnline: boolean;
}

interface ThreadType {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: UserType;
  tags: string[];
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
  replies: ReplyType[];
  category: string;
  views: number;
  isPinned?: boolean;
  isFeatured?: boolean;
}

interface ReplyType {
  id: string;
  content: string;
  createdAt: string;
  author: UserType;
  likes: number;
  isLiked: boolean;
  replies: ReplyType[];
}

// Mock data
const mockUsers: UserType[] = [
  {
    id: "1",
    name: "Alex Morgan",
    avatar: "https://randomuser.me/api/portraits/men/20.jpg",
    role: "Product Manager",
    isOnline: true,
  },
  {
    id: "2",
    name: "Jamie Chen",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    role: "Developer",
    isOnline: true,
  },
  {
    id: "3",
    name: "Taylor Swift",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    role: "Designer",
    isOnline: false,
  },
  {
    id: "4",
    name: "Morgan Freeman",
    avatar: "https://randomuser.me/api/portraits/men/23.jpg",
    role: "Marketing",
    isOnline: true,
  },
  {
    id: "5",
    name: "Casey Jordan",
    avatar: "https://randomuser.me/api/portraits/men/24.jpg",
    role: "CEO",
    isOnline: false,
  },
  {
    id: "6",
    name: "Robin Patel",
    avatar: "https://randomuser.me/api/portraits/women/25.jpg",
    role: "Senior Engineer",
    isOnline: true,
  },
  {
    id: "7",
    name: "Jordan Smith",
    avatar: "https://randomuser.me/api/portraits/men/26.jpg",
    role: "Product Designer",
    isOnline: false,
  },
  {
    id: "8",
    name: "Avery Wilson",
    avatar: "https://randomuser.me/api/portraits/women/27.jpg",
    role: "Customer Success",
    isOnline: true,
  },
  {
    id: "9",
    name: "Dylan Kim",
    avatar: "https://randomuser.me/api/portraits/men/28.jpg",
    role: "Data Analyst",
    isOnline: true,
  },
  {
    id: "10",
    name: "Riley Thompson",
    avatar: "https://randomuser.me/api/portraits/women/29.jpg",
    role: "UX Researcher",
    isOnline: false,
  },
  {
    id: "11",
    name: "Chris Evans",
    avatar: "https://randomuser.me/api/portraits/men/30.jpg",
    role: "CTO",
    isOnline: true,
  },
  {
    id: "12",
    name: "Natalie Woods",
    avatar: "https://randomuser.me/api/portraits/women/31.jpg",
    role: "HR Manager",
    isOnline: false,
  },
  {
    id: "13",
    name: "Ethan Brown",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "DevOps Engineer",
    isOnline: true,
  },
  {
    id: "14",
    name: "Sophia Davis",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    role: "QA Lead",
    isOnline: true,
  },
  {
    id: "15",
    name: "Leo Martinez",
    avatar: "https://randomuser.me/api/portraits/men/34.jpg",
    role: "Scrum Master",
    isOnline: false,
  },
  {
    id: "16",
    name: "Isabella Nguyen",
    avatar: "https://randomuser.me/api/portraits/women/35.jpg",
    role: "Support Engineer",
    isOnline: true,
  },
];

const generateMockThreads = (): ThreadType[] => {
  return [
    {
      id: "1",
      title: "Quarterly sales performance review",
      content: `I wanted to start a discussion about our Q2 sales numbers. Overall I think we're performing well, but there are some areas where we could improve our approach. What does everyone think?`,
      createdAt: "2025-05-17T10:30:00Z",
      author: mockUsers[4],
      tags: ["sales", "quarterly-review", "strategy"],
      likes: 24,
      isLiked: true,
      isBookmarked: true,
      category: "Reports",
      views: 156,
      isPinned: true,
      replies: [
        {
          id: "1-1",
          content:
            "Great point, @Casey. I think our East Coast team really outperformed expectations. We should look into what tactics they used that worked so well.",
          createdAt: "2025-05-17T11:15:00Z",
          author: mockUsers[0],
          likes: 12,
          isLiked: false,
          replies: [
            {
              id: "1-1-1",
              content:
                "I agree with @Alex. The East Coast team implemented that new outreach strategy we discussed in January. It seems to be paying off.",
              createdAt: "2025-05-17T12:20:00Z",
              author: mockUsers[3],
              likes: 8,
              isLiked: true,
              replies: [],
            },
          ],
        },
        {
          id: "1-2",
          content: `I've prepared a more detailed breakdown of the numbers by region. We should focus on improving our West Coast performance next quarter.`,
          createdAt: "2025-05-17T14:05:00Z",
          author: mockUsers[1],
          likes: 15,
          isLiked: false,
          replies: [],
        },
      ],
    },
    {
      id: "2",
      title: "New product feature discussion",
      content: `The development team has been working on some exciting new features for our main product. I'd like to get everyone's thoughts on the priority order for rollout.`,
      createdAt: "2025-05-16T09:45:00Z",
      author: mockUsers[1],
      tags: ["product", "development", "features"],
      likes: 18,
      isLiked: false,
      isBookmarked: false,
      category: "Ideas",
      views: 84,
      isFeatured: true,
      replies: [
        {
          id: "2-1",
          content:
            "I think we should prioritize the analytics dashboard first. Our enterprise customers have been requesting this feature for months now.",
          createdAt: "2025-05-16T10:30:00Z",
          author: mockUsers[0],
          likes: 7,
          isLiked: false,
          replies: [],
        },
      ],
    },
    {
      id: "3",
      title: "Marketing campaign for summer launch",
      content: `We need to start planning our marketing strategy for the summer product launch. I'm thinking we should focus heavily on social media this time. Thoughts?`,
      createdAt: "2025-05-15T15:20:00Z",
      author: mockUsers[3],
      tags: ["marketing", "product-launch", "social-media"],
      likes: 10,
      isLiked: false,
      isBookmarked: false,
      category: "General",
      views: 67,
      replies: [],
    },
    {
      id: "4",
      title: "UI redesign feedback needed",
      content: `I've uploaded the latest mockups for our UI redesign. I'd appreciate everyone's feedback, especially regarding the new navigation structure.`,
      createdAt: "2025-05-14T11:00:00Z",
      author: mockUsers[2],
      tags: ["design"],
      likes: 15,
      isLiked: true,
      isBookmarked: true,
      category: "Technical",
      views: 122,
      replies: [
        {
          id: "4-1",
          content:
            "The new design looks amazing, @Taylor! I especially like the improved accessibility features. Could we make the contrast a bit stronger in the sidebar?",
          createdAt: "2025-05-14T13:45:00Z",
          author: mockUsers[0],
          likes: 6,
          isLiked: true,
          replies: [],
        },
      ],
    },
    {
      id: "5",
      title: "Improving team collaboration workflows",
      content: `Our cross-department collaboration could be more efficient. I've been researching some methodologies that might help us streamline communication and reduce redundant meetings.`,
      createdAt: "2025-05-13T08:15:00Z",
      author: mockUsers[5],
      tags: ["collaboration", "productivity", "workflow"],
      likes: 32,
      isLiked: false,
      isBookmarked: false,
      category: "Ideas",
      views: 215,
      isFeatured: true,
      replies: [
        {
          id: "5-1",
          content:
            "I completely agree with this! Our current meeting structure takes up way too much time that could be better spent on actual work.",
          createdAt: "2025-05-13T09:20:00Z",
          author: mockUsers[6],
          likes: 18,
          isLiked: true,
          replies: [],
        },
        {
          id: "5-2",
          content:
            "Have you looked into the async communication model that Gitlab uses? It might be a good fit for our remote team members.",
          createdAt: "2025-05-13T10:45:00Z",
          author: mockUsers[7],
          likes: 14,
          isLiked: false,
          replies: [],
        },
      ],
    },
    {
      id: "6",
      title: "Customer feedback from recent user testing",
      content: `We just completed our latest round of user testing. There are some consistent pain points that came up around the onboarding process that we should address.`,
      createdAt: "2025-05-12T14:30:00Z",
      author: mockUsers[7],
      tags: ["user-testing", "feedback", "onboarding"],
      likes: 22,
      isLiked: false,
      isBookmarked: true,
      category: "Technical",
      views: 187,
      replies: [],
    },
    {
      id: "7",
      title: "Monthly revenue targets and forecasting",
      content: `Looking at our current pipeline, I think we need to adjust our Q3 forecasts. Let's discuss the numbers and make sure we're aligned on the targets.`,
      createdAt: "2025-05-11T11:25:00Z",
      author: mockUsers[4],
      tags: ["revenue"],
      likes: 8,
      isLiked: false,
      isBookmarked: false,
      category: "Reports",
      views: 94,
      replies: [],
    },
    {
      id: "8",
      title: "Accessibility improvements for our platform",
      content: `We need to make our platform more accessible to comply with WCAG 2.1 AA standards. I've created a list of high-priority items we should address first.`,
      createdAt: "2025-05-10T09:10:00Z",
      author: mockUsers[2],
      tags: ["accessibility", "WCAG", "user-experience"],
      likes: 27,
      isLiked: true,
      isBookmarked: false,
      category: "Technical",
      views: 131,
      replies: [],
    },
  ];
};

// Utility functions
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  if (date.getFullYear() !== now.getFullYear()) {
    options.year = "numeric";
  }
  return date.toLocaleDateString("en-US", options);
};

// Component for the threaded discussion forum
const ThreadedDiscussionForum: React.FC = () => {
  // State
  const [threads, setThreads] = useState<ThreadType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentUser] = useState<UserType>(mockUsers[0]);
  const [isCreatingThread, setIsCreatingThread] = useState<boolean>(false);
  const [newThreadTitle, setNewThreadTitle] = useState<string>("");
  const [newThreadContent, setNewThreadContent] = useState<string>("");
  const [newThreadTags, setNewThreadTags] = useState<string>("");
  const [newThreadCategory, setNewThreadCategory] = useState<string>("General");
  const [userSuggestions, setUserSuggestions] = useState<UserType[]>([]);
  const [showUserSuggestions, setShowUserSuggestions] =
    useState<boolean>(false);
  const [replyingTo, setReplyingTo] = useState<{
    threadId: string;
    replyId?: string;
  } | null>(null);
  const [newReplyContent, setNewReplyContent] = useState<string>("");
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(
    new Set()
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set()
  );
  const [activeNavTab, setActiveNavTab] = useState<string>("Discussions");
  const [showProfileDropdown, setShowProfileDropdown] =
    useState<boolean>(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
  const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false);
  const [sortMethod, setSortMethod] = useState<string>("latest");
  const [showAllTags, setShowAllTags] = useState(false);
  const [notifications, setNotifications] = useState<
    { id: string; text: string; isRead: boolean }[]
  >([
    {
      id: "n1",
      text: '@Casey mentioned you in "Quarterly sales performance review"',
      isRead: false,
    },
    {
      id: "n2",
      text: '@Jamie replied to your thread "New product feature discussion"',
      isRead: true,
    },
    {
      id: "n3",
      text: "Your discussion was featured in the weekly digest",
      isRead: false,
    },
    {
      id: "n4",
      text: '@Taylor tagged you in "UI redesign feedback needed"',
      isRead: true,
    },
  ]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showCategoriesOnMobile, setShowCategoriesOnMobile] =
    useState<boolean>(false);
  const [bookmarkedOnly, setBookmarkedOnly] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const newReplyInputRef = useRef<HTMLTextAreaElement>(null);
  const threadInputRef = useRef<HTMLTextAreaElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const notificationsButtonRef = useRef<HTMLButtonElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const sortButtonRef = useRef<HTMLButtonElement>(null);

  // Load threads on component mount
  useEffect(() => {
    // Simulate API call
    const loadThreads = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      setThreads(generateMockThreads());
      setLoading(false);
    };

    loadThreads();
  }, []);

  // Handle clicks outside dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close profile dropdown if clicked outside
      if (
        profileDropdownRef.current &&
        profileButtonRef.current &&
        !profileDropdownRef.current.contains(event.target as Node) &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }

      // Close notifications dropdown if clicked outside
      if (
        notificationsRef.current &&
        notificationsButtonRef.current &&
        !notificationsRef.current.contains(event.target as Node) &&
        !notificationsButtonRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }

      // Close filter dropdown if clicked outside
      if (
        filterDropdownRef.current &&
        filterButtonRef.current &&
        !filterDropdownRef.current.contains(event.target as Node) &&
        !filterButtonRef.current.contains(event.target as Node)
      ) {
        setShowFilterDropdown(false);
      }

      // Close sort dropdown if clicked outside
      if (
        sortDropdownRef.current &&
        sortButtonRef.current &&
        !sortDropdownRef.current.contains(event.target as Node) &&
        !sortButtonRef.current.contains(event.target as Node)
      ) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isCreatingThread) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCreatingThread]);

  // Handle @ mentions
  useEffect(() => {
    if (replyingTo) {
      const content = newReplyContent;
      const lastAtSymbolIndex = content.lastIndexOf("@");

      if (lastAtSymbolIndex !== -1 && content.length > lastAtSymbolIndex) {
        const query = content.substring(lastAtSymbolIndex + 1).toLowerCase();
        if (query) {
          const filteredUsers = mockUsers.filter((user) =>
            user.name.toLowerCase().includes(query)
          );
          setUserSuggestions(filteredUsers);
          setShowUserSuggestions(filteredUsers.length > 0);
        } else {
          setUserSuggestions(mockUsers);
          setShowUserSuggestions(true);
        }
      } else {
        setShowUserSuggestions(false);
      }
    }
  }, [newReplyContent, replyingTo]);

  // Filter and sort threads based on selected options
  const filteredThreads = useMemo(() => {
    return threads
      .filter((thread) => {
        // Apply search filter
        const matchesSearch =
          searchQuery === "" ||
          thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          thread.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          thread.author.name.toLowerCase().includes(searchQuery.toLowerCase());

        // Apply tag filter
        const matchesTags =
          selectedTags.length === 0 ||
          selectedTags.every((tag) => thread.tags.includes(tag));

        // Apply category filter
        const matchesCategory =
          selectedCategory === "All" || thread.category === selectedCategory;

        // Apply bookmarked filter
        const matchesBookmarked = !bookmarkedOnly || thread.isBookmarked;

        return (
          matchesSearch && matchesTags && matchesCategory && matchesBookmarked
        );
      })
      .sort((a, b) => {
        // Apply sort method
        switch (sortMethod) {
          case "latest":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "oldest":
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          case "most-liked":
            return b.likes - a.likes;
          case "most-viewed":
            return b.views - a.views;
          case "most-replies":
            return b.replies.length - a.replies.length;
          default:
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }
      });
  }, [
    threads,
    searchQuery,
    selectedTags,
    selectedCategory,
    bookmarkedOnly,
    sortMethod,
  ]);

  // Get all unique tags from threads
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    threads.forEach((thread) => {
      thread.tags.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }, [threads]);

  // Get categories with counts
  const categories = useMemo(() => {
    const counts = {
      All: threads.length,
      General: 0,
      Ideas: 0,
      Technical: 0,
      Reports: 0,
    };

    threads.forEach((thread) => {
      if (counts[thread.category as keyof typeof counts] !== undefined) {
        counts[thread.category as keyof typeof counts]++;
      }
    });

    return counts;
  }, [threads]);

  // Get bookmarked count
  const bookmarkedCount = useMemo(() => {
    return threads.filter((thread) => thread.isBookmarked).length;
  }, [threads]);

  // Toggle thread expansion
  const toggleThreadExpansion = (threadId: string) => {
    setExpandedThreads((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(threadId)) {
        newSet.delete(threadId);
      } else {
        newSet.add(threadId);
      }
      return newSet;
    });
  };

  // Toggle reply expansion
  const toggleReplyExpansion = (replyId: string) => {
    setExpandedReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(replyId)) {
        newSet.delete(replyId);
      } else {
        newSet.add(replyId);
      }
      return newSet;
    });
  };

  // Handle like thread/reply
  const handleLike = (threadId: string, replyId?: string) => {
    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          if (!replyId) {
            // Like the thread itself
            return {
              ...thread,
              likes: thread.isLiked ? thread.likes - 1 : thread.likes + 1,
              isLiked: !thread.isLiked,
            };
          } else {
            // Like a reply within the thread
            return {
              ...thread,
              replies: updateRepliesWithLike(thread.replies, replyId),
            };
          }
        }
        return thread;
      })
    );
  };

  // Helper function to update nested replies with like
  const updateRepliesWithLike = (
    replies: ReplyType[],
    targetReplyId: string
  ): ReplyType[] => {
    return replies.map((reply) => {
      if (reply.id === targetReplyId) {
        return {
          ...reply,
          likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
          isLiked: !reply.isLiked,
        };
      } else if (reply.replies.length > 0) {
        return {
          ...reply,
          replies: updateRepliesWithLike(reply.replies, targetReplyId),
        };
      }
      return reply;
    });
  };

  // Handle bookmark
  const handleBookmark = (threadId: string) => {
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === threadId
          ? { ...thread, isBookmarked: !thread.isBookmarked }
          : thread
      )
    );
  };

  // Start replying to a thread or reply
  const startReply = (threadId: string, replyId?: string) => {
    setReplyingTo({ threadId, replyId });
    setNewReplyContent("");

    // Focus the reply input after it's rendered
    setTimeout(() => {
      if (newReplyInputRef.current) {
        newReplyInputRef.current.focus();
      }
    }, 0);
  };

  // Cancel reply
  const cancelReply = () => {
    setReplyingTo(null);
    setNewReplyContent("");
    setShowUserSuggestions(false);
  };

  // Add user mention to reply
  const addUserMention = (user: UserType) => {
    const content = newReplyContent;
    const lastAtSymbolIndex = content.lastIndexOf("@");

    if (lastAtSymbolIndex !== -1) {
      // Find the end of the current word being typed after @
      const textAfterAt = content.substring(lastAtSymbolIndex + 1);
      const spaceIndex = textAfterAt.indexOf(" ");
      const endIndex = spaceIndex === -1 ? content.length : lastAtSymbolIndex + 1 + spaceIndex;
      
      const newContent =
        content.substring(0, lastAtSymbolIndex) +
        `@${user.name} ` +
        content.substring(endIndex);

      setNewReplyContent(newContent);
    } else {
      setNewReplyContent(content + `@${user.name} `);
    }

    setShowUserSuggestions(false);

    if (newReplyInputRef.current) {
      newReplyInputRef.current.focus();
    }
  };

  // Submit reply
  const submitReply = () => {
    if (!replyingTo || !newReplyContent.trim()) return;

    const { threadId, replyId } = replyingTo;
    const newReply: ReplyType = {
      id: `reply-${Date.now()}`,
      content: newReplyContent,
      createdAt: new Date().toISOString(),
      author: currentUser,
      likes: 0,
      isLiked: false,
      replies: [],
    };

    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          if (!replyId) {
            // Reply to the thread itself
            return {
              ...thread,
              replies: [...thread.replies, newReply],
            };
          } else {
            // Reply to a reply
            return {
              ...thread,
              replies: addReplyToNestedReplies(
                thread.replies,
                replyId,
                newReply
              ),
            };
          }
        }
        return thread;
      })
    );

    // Expand the thread if it wasn't already
    setExpandedThreads((prev) => {
      const newSet = new Set(prev);
      newSet.add(threadId);
      return newSet;
    });

    // If replying to a reply, expand that reply too
    if (replyId) {
      setExpandedReplies((prev) => {
        const newSet = new Set(prev);
        newSet.add(replyId);
        return newSet;
      });
    }

    cancelReply();
  };

  // Helper function to add reply to nested replies
  const addReplyToNestedReplies = (
    replies: ReplyType[],
    targetReplyId: string,
    newReply: ReplyType
  ): ReplyType[] => {
    return replies.map((reply) => {
      if (reply.id === targetReplyId) {
        return {
          ...reply,
          replies: [...reply.replies, newReply],
        };
      } else if (reply.replies.length > 0) {
        return {
          ...reply,
          replies: addReplyToNestedReplies(
            reply.replies,
            targetReplyId,
            newReply
          ),
        };
      }
      return reply;
    });
  };

  // Create new thread
  const createNewThread = () => {
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;

    const tagsArray = newThreadTags
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag !== "");

    const newThread: ThreadType = {
      id: `thread-${Date.now()}`,
      title: newThreadTitle,
      content: newThreadContent,
      createdAt: new Date().toISOString(),
      author: currentUser,
      tags: tagsArray,
      likes: 0,
      isLiked: false,
      isBookmarked: false,
      replies: [],
      category: newThreadCategory,
      views: 0,
    };

    setThreads((prev) => [newThread, ...prev]);
    setIsCreatingThread(false);
    setNewThreadTitle("");
    setNewThreadContent("");
    setNewThreadTags("");
    setNewThreadCategory("General");
  };

  // Toggle tag selection
  const toggleTagSelection = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  // Handle search
  const handleSearch = () => {
    // The search is already handled via the searchQuery state and filteredThreads memo
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
  };

  // Calculate unread notifications count
  const unreadNotificationsCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  // Handle tab change
  const handleNavTabChange = (tab: string) => {
    setActiveNavTab(tab);

    if (tab === "Bookmarks") {
      setBookmarkedOnly(true);
      setSelectedCategory("All");
    } else {
      setBookmarkedOnly(false);
    }
  };

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setActiveNavTab("Discussions");
    setBookmarkedOnly(false);
    setShowCategoriesOnMobile(false); // Close mobile categories menu
  };

  // Handle sort method change
  const handleSortMethodChange = (method: string) => {
    setSortMethod(method);
    setShowSortDropdown(false);
  };

  // Show toast notification
  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };

  // Parse content and highlight @mentions
  const parseContentWithMentions = (content: string) => {
    // Split by @mentions, keeping the @ symbol and handling names with spaces
    const parts = content.split(/(@[A-Za-z]+(?:\s+[A-Za-z]+)*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        // Extract the mentioned name (remove @ and trim)
        const mentionedName = part.substring(1).trim();
        // Check if this matches any user in our mockUsers
        const isValidMention = mockUsers.some(user => 
          user.name.toLowerCase() === mentionedName.toLowerCase()
        );
        
        if (isValidMention) {
          return (
            <span key={index} className="text-blue-600 font-medium bg-blue-50 px-1 rounded">
              {part}
            </span>
          );
        }
      }
      return part;
    });
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const setUnreadNotificationsCount = (count: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.isRead ? { ...notification, isRead: false } : notification
      )
    );
  };

  const loadMoreThreads = () => {
    // Simulate loading more threads
    if (threads.length >= 40) return; // Limit to 100 threads
    setTimeout(() => {
      const newThreads = generateMockThreads().slice(0, 6);
      // change the ID to avoid duplicates
      newThreads.forEach((thread) => {
        thread.id = `thread-${Date.now() + Math.random()}`;
        // also change the image, name and role
        thread.author = {
          ...thread.author,
          avatar:
            mockUsers[Math.floor(Math.random() * mockUsers.length)].avatar,
          name: mockUsers[Math.floor(Math.random() * mockUsers.length)].name,
          role: mockUsers[Math.floor(Math.random() * mockUsers.length)].role,
        };
      });
      setThreads((prev) => [...prev, ...newThreads]);
    }, 50);
  };

  // Render a single reply and its nested replies
  const renderReply = (
    reply: ReplyType,
    threadId: string,
    depth: number = 0
  ) => {
    const isExpanded = expandedReplies.has(reply.id);
    const hasNestedReplies = reply.replies.length > 0;

    return (
      <div
        key={reply.id}
        className={`transition-all duration-200 ease-in-out ${
          depth > 0 ? "ml-6" : ""
        }`}
        style={{
          marginLeft: `${depth * 1.5}rem`,
          borderLeft: depth > 0 ? "2px solid #e5e7eb" : "none",
          paddingLeft: depth > 0 ? "1rem" : "0",
        }}
      >
        <div className="bg-gray-50 rounded-lg p-4 my-2 transition-all duration-300 hover:shadow-md">
          <div className="flex items-start space-x-3">
            <img
              src={reply.author.avatar}
              alt={reply.author.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">
                    {reply.author.name}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {reply.author.role}
                  </span>
                  {reply.author.isOnline && (
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                  )}
                </div>
                <span className="text-gray-400 text-xs">
                  {formatDate(reply.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 mb-3">{parseContentWithMentions(reply.content)}</p>
              <div className="flex items-center space-x-4 text-gray-500">
                <button
                  onClick={() => handleLike(threadId, reply.id)}
                  className={`flex items-center space-x-1 text-sm transition-colors duration-200 cursor-pointer ${
                    reply.isLiked ? "text-blue-500" : "hover:text-blue-500"
                  }`}
                >
                  <ThumbsUp
                    size={16}
                    className={reply.isLiked ? "fill-blue-500" : ""}
                  />
                  <span>{reply.likes}</span>
                </button>
                <button
                  onClick={() => startReply(threadId, reply.id)}
                  className="flex items-center space-x-1 text-sm hover:text-blue-500 transition-colors duration-200 cursor-pointer"
                >
                  <Reply size={16} />
                  <span>Reply</span>
                </button>
                {hasNestedReplies && (
                  <button
                    onClick={() => toggleReplyExpansion(reply.id)}
                    className="flex items-center space-x-1 text-sm hover:text-blue-500 transition-colors duration-200 cursor-pointer"
                  >
                    <ChevronDown
                      size={16}
                      className={`transform transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                    <span>
                      {reply.replies.length}{" "}
                      {reply.replies.length === 1 ? "reply" : "replies"}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nested replies */}
        {hasNestedReplies && isExpanded && (
          <div
            className={`pl-3 transition-all duration-300 ease-in-out ${
              isExpanded
                ? "opacity-100 max-h-full"
                : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            {reply.replies.map((nestedReply) =>
              renderReply(nestedReply, threadId, depth + 1)
            )}
          </div>
        )}

        {/* Reply form for this reply */}
        {replyingTo &&
          replyingTo.threadId === threadId &&
          replyingTo.replyId === reply.id && (
            <div className="pl-6 py-2 transition-all duration-300 ease-in-out">
              {renderReplyForm()}
            </div>
          )}
      </div>
    );
  };

  // Render the reply form
  const renderReplyForm = () => (
    <div className="bg-white rounded-lg p-4 shadow-md relative">
      <div className="flex items-start space-x-3">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex-1">
          <textarea
            ref={newReplyInputRef}
            value={newReplyContent}
            onChange={(e) => setNewReplyContent(e.target.value)}
            placeholder="Write your reply..."
            className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none resize-none min-h-20"
          ></textarea>

          {/* User suggestions for @mentions */}
          {showUserSuggestions && (
            <div className="absolute z-10 w-64 bg-white shadow-lg rounded-md border border-gray-200 mt-1 max-h-48 overflow-y-auto">
              {userSuggestions.map((user) => (
                <div
                  key={user.id}
                  onClick={() => addUserMention(user)}
                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <div>
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.role}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={cancelReply}
                className="px-3 py-1 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitReply}
                disabled={!newReplyContent.trim()}
                className={`px-3 py-1 rounded-md bg-blue-600 text-white flex items-center space-x-1 transition-all duration-200 cursor-pointer ${
                  newReplyContent.trim()
                    ? "hover:bg-blue-700"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                <Send size={14} />
                <span>Reply</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render a single thread and its replies
  const renderThread = (thread: ThreadType) => {
    const isExpanded = expandedThreads.has(thread.id);

    return (
      <div
        key={thread.id}
        className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden transform transition-all duration-300 hover:shadow-md border border-gray-100"
      >
        {/* Thread header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <img
                src={thread.author.avatar}
                alt={thread.author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">
                    {thread.author.name}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {thread.author.role}
                  </span>
                  {thread.author.isOnline && (
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                  )}
                </div>
                <span className="text-gray-400 text-xs">
                  {formatDate(thread.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className={`text-gray-400 hover:text-blue-500 transition-colors duration-200 cursor-pointer ${
                  thread.isBookmarked ? "text-blue-500" : ""
                }`}
                onClick={() => handleBookmark(thread.id)}
                aria-label="Bookmark"
              >
                <Bookmark
                  size={16}
                  className={thread.isBookmarked ? "fill-blue-500" : ""}
                />
              </button>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex mt-2 mb-1 gap-2">
            {thread.isPinned && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-amber-50 text-amber-800 border border-amber-200">
                <Award size={12} className="mr-1" />
                Pinned
              </span>
            )}
            {thread.isFeatured && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-50 text-green-800 border border-green-200">
                <Star size={12} className="mr-1" />
                Featured
              </span>
            )}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-50 text-gray-500 border border-gray-200">
              <Hash size={12} className="mr-1" />
              {thread.category}
            </span>
          </div>

          {/* Thread title and content */}
          <h3 className="font-semibold text-lg mt-3 mb-2 text-gray-800">
            {thread.title}
          </h3>
          <p className="text-gray-700 mb-3">{parseContentWithMentions(thread.content)}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {thread.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
                onClick={() => toggleTagSelection(tag)}
              >
                <Hash size={12} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>

          {/* Thread actions */}
          <div className="flex items-center space-x-4 text-gray-500 mt-2">
            <button
              onClick={() => handleLike(thread.id)}
              className={`flex items-center space-x-1 text-sm transition-colors duration-200 cursor-pointer ${
                thread.isLiked ? "text-blue-500" : "hover:text-blue-500"
              }`}
            >
              <ThumbsUp
                size={16}
                className={thread.isLiked ? "fill-blue-500" : ""}
              />
              <span>{thread.likes}</span>
            </button>
            <button
              onClick={() => startReply(thread.id)}
              className="flex items-center space-x-1 text-sm hover:text-blue-500 transition-colors duration-200 cursor-pointer"
            >
              <MessageSquare size={16} />
              <span>
                {thread.replies.length > 0
                  ? `${thread.replies.length} ${
                      thread.replies.length === 1 ? "reply" : "replies"
                    }`
                  : "Reply"}
              </span>
            </button>
            <button 
              onClick={() => showToast("This functionality is coming soon")}
              className="flex items-center space-x-1 text-sm hover:text-blue-500 transition-colors duration-200 cursor-pointer"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
            <span className="flex items-center space-x-1 text-sm text-gray-400">
              <Users size={14} />
              <span>{thread.views} views</span>
            </span>

            {thread.replies.length > 0 && (
              <button
                onClick={() => toggleThreadExpansion(thread.id)}
                className="ml-auto flex items-center space-x-1 text-sm hover:text-blue-500 transition-colors duration-200 cursor-pointer"
              >
                <span>{isExpanded ? "Hide replies" : "Show replies"}</span>
                <ChevronDown
                  size={16}
                  className={`transform transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Thread replies */}
        <div
          className={`bg-gray-50 transition-all duration-300 ease-in-out ${
            isExpanded || replyingTo?.threadId === thread.id
              ? "max-h-full p-4"
              : "max-h-0 overflow-hidden p-0"
          }`}
        >
          {/* Reply form for the thread */}
          {replyingTo &&
            replyingTo.threadId === thread.id &&
            !replyingTo.replyId &&
            renderReplyForm()}

          {/* List of replies */}
          {thread.replies.map((reply) => renderReply(reply, thread.id))}
        </div>
      </div>
    );
  };

  // Render categories section for mobile
  const renderMobileCategories = () => (
    <div className="md:hidden mb-4">
      <button
        onClick={() => setShowCategoriesOnMobile(!showCategoriesOnMobile)}
        className="w-full bg-white rounded-lg shadow-sm p-3 flex justify-between items-center cursor-pointer"
      >
        <span className="font-medium text-gray-800">Categories</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            showCategoriesOnMobile ? "rotate-180" : ""
          }`}
        />
      </button>

      {showCategoriesOnMobile && (
        <div className="bg-white rounded-lg shadow-sm mt-1 p-2 divide-y divide-gray-100">
          <button
            onClick={() => handleCategoryChange("All")}
            className={`w-full flex items-center py-2 px-3 rounded-md text-sm transition-colors duration-200 cursor-pointer ${
              selectedCategory === "All"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span>All ({categories["All"]})</span>
          </button>
          <button
            onClick={() => handleCategoryChange("General")}
            className={`w-full flex items-center py-2 px-3 rounded-md text-sm transition-colors duration-200 cursor-pointer ${
              selectedCategory === "General"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Building2 size={16} className="mr-2" />
            <span>General ({categories["General"]})</span>
          </button>
          <button
            onClick={() => handleCategoryChange("Ideas")}
            className={`w-full flex items-center py-2 px-3 rounded-md text-sm transition-colors duration-200 cursor-pointer ${
              selectedCategory === "Ideas"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Lightbulb size={16} className="mr-2" />
            <span>Ideas ({categories["Ideas"]})</span>
          </button>
          <button
            onClick={() => handleCategoryChange("Technical")}
            className={`w-full flex items-center py-2 px-3 rounded-md text-sm transition-colors duration-200 cursor-pointer ${
              selectedCategory === "Technical"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Wrench size={16} className="mr-2" />
            <span>Technical ({categories["Technical"]})</span>
          </button>
          <button
            onClick={() => handleCategoryChange("Reports")}
            className={`w-full flex items-center py-2 px-3 rounded-md text-sm transition-colors duration-200 cursor-pointer ${
              selectedCategory === "Reports"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <TrendingUp size={16} className="mr-2" />
            <span>Reports ({categories["Reports"]})</span>
          </button>
        </div>
      )}
    </div>
  );

  // Main component render
  return (
    <div
      className="flex flex-col min-h-screen bg-gray-50 text-gray-900"
      style={{ fontFamily: "var(--font-roboto), sans-serif" }}
    >
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and title */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-blue-600 w-8 h-8 rounded flex items-center justify-center text-white font-bold">
                  F
                </div>
                <span className="ml-2 text-xl font-semibold">ForumPro</span>
              </div>

              {/* Desktop navigation */}
              <nav className="hidden md:flex ml-10 space-x-8">
                <button
                  onClick={() => handleNavTabChange("Discussions")}
                  className={`px-1 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    activeNavTab === "Discussions"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Discussions
                </button>
                <button
                  onClick={() => handleNavTabChange("Bookmarks")}
                  className={`px-1 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    activeNavTab === "Bookmarks"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Bookmarks
                </button>
              </nav>
            </div>

            {/* Search, notifications, and profile */}
            <div className="flex items-center">
              {/* Search */}
              <div className="relative mr-4 md:block hidden">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search threads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="bg-gray-100 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 w-40 md:w-64"
                />
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>

              {/* Notifications */}
              <div className="relative mr-4">
                <button
                  ref={notificationsButtonRef}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="text-gray-500 hover:text-gray-900 transition-colors duration-200 relative cursor-pointer"
                >
                  <Bell size={20} />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* Notifications dropdown */}
                {showNotifications && (
                  <div
                    ref={notificationsRef}
                    className="absolute md:right-0 -right-20 mt-2 md:w-80 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                  >
                    <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="text-sm font-medium">Notifications</h3>
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-gray-500 text-sm">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                              notification.isRead ? "opacity-70" : ""
                            }`}
                          >
                            <div className="flex items-start">
                              {!notification.isRead && (
                                <span className="h-2 w-2 mt-1 mr-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                              )}
                              <div
                                onClick={() => {
                                  // read notification and decrement unread count
                                  markNotificationAsRead(notification.id);
                                }}
                                className={`flex-1 cursor-pointer ${
                                  !notification.isRead ? "font-medium" : ""
                                }`}
                              >
                                <p className="text-sm">{notification.text}</p>
                                <p className="text-xs text-gray-500 mt-1 flex items-center">
                                  <Clock size={12} className="mr-1" />2 hours
                                  ago
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {/* <div className="px-4 py-2 border-t border-gray-100 text-center">
                      <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200">
                        View all notifications
                      </button>
                    </div> */}
                  </div>
                )}
              </div>

              {/* User profile */}
              <div className="relative">
                <button
                  ref={profileButtonRef}
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 text-sm focus:outline-none cursor-pointer"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                  />
                  <span className="hidden md:block">{currentUser.name}</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform duration-200 ${
                      showProfileDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile dropdown */}
                {showProfileDropdown && (
                  <div
                    ref={profileDropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {currentUser.role}
                      </p>
                    </div>
                    <div className="border-t border-gray-100 mt-1"></div>
                    {/* <a href="#signout" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center">
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </a> */}
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="ml-4 md:hidden text-gray-500 focus:outline-none cursor-pointer"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out ${
              mobileMenuOpen ? "max-h-64" : "max-h-0 overflow-hidden"
            }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
              <button
                onClick={() => {
                  handleNavTabChange("Discussions");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left cursor-pointer ${
                  activeNavTab === "Discussions"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
              >
                Discussions
              </button>
              <button
                onClick={() => {
                  handleNavTabChange("Bookmarks");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left cursor-pointer ${
                  activeNavTab === "Bookmarks"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
              >
                Bookmarks
              </button>
            </div>
          </div>
        </div>
        <div className="relative px-2 pb-2 md:hidden w-full ">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search threads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="bg-gray-100 w-full rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
          />
          <Search
            size={16}
            className="absolute left-6 top-[40%] transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar */}
          <aside className="md:w-64 flex-shrink-0 hidden md:block">
            <div className="sticky top-20 h-[calc(100vh-6rem)]">
              <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
                {/* Fixed header section */}
                <div className="p-4 border-b border-gray-100">
                  {/* Create new thread button */}
                  <button
                    onClick={() => setIsCreatingThread(true)}
                    className="w-full bg-blue-600 text-white rounded-md py-2 px-4 flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
                  >
                    <MessageSquare size={16} />
                    <span>New Discussion</span>
                  </button>
                </div>

                {/* Scrollable content section */}
                <div className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {/* Categories */}
                  <h3 className="font-medium text-gray-900 mb-2">Categories</h3>
                  <nav className="space-y-1 mb-6">
                    <button
                      onClick={() => handleCategoryChange("All")}
                      className={`flex items-center px-3 py-2 rounded-md text-sm w-full text-left cursor-pointer ${
                        selectedCategory === "All"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      }`}
                    >
                      <span>All</span>
                      <span className="ml-auto bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-0.5">
                        {categories["All"]}
                      </span>
                    </button>
                    <button
                      onClick={() => handleCategoryChange("General")}
                      className={`flex items-center px-3 py-2 rounded-md text-sm w-full text-left cursor-pointer ${
                        selectedCategory === "General"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      }`}
                    >
                      <Building2 size={16} className="mr-2" />
                      <span>General</span>
                      <span
                        className={`ml-auto text-xs rounded-full px-2 py-0.5 ${
                          selectedCategory === "General"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {categories["General"]}
                      </span>
                    </button>
                    <button
                      onClick={() => handleCategoryChange("Ideas")}
                      className={`flex items-center px-3 py-2 rounded-md text-sm w-full text-left cursor-pointer ${
                        selectedCategory === "Ideas"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      }`}
                    >
                      <Lightbulb size={16} className="mr-2" />
                      <span>Ideas</span>
                      <span
                        className={`ml-auto text-xs rounded-full px-2 py-0.5 ${
                          selectedCategory === "Ideas"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {categories["Ideas"]}
                      </span>
                    </button>
                    <button
                      onClick={() => handleCategoryChange("Technical")}
                      className={`flex items-center px-3 py-2 rounded-md text-sm w-full text-left cursor-pointer ${
                        selectedCategory === "Technical"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      }`}
                    >
                      <Wrench size={16} className="mr-2" />
                      <span>Technical</span>
                      <span
                        className={`ml-auto text-xs rounded-full px-2 py-0.5 ${
                          selectedCategory === "Technical"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {categories["Technical"]}
                      </span>
                    </button>
                    <button
                      onClick={() => handleCategoryChange("Reports")}
                      className={`flex items-center px-3 py-2 rounded-md text-sm w-full text-left cursor-pointer ${
                        selectedCategory === "Reports"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      }`}
                    >
                      <TrendingUp size={16} className="mr-2" />
                      <span>Reports</span>
                      <span
                        className={`ml-auto text-xs rounded-full px-2 py-0.5 ${
                          selectedCategory === "Reports"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {categories["Reports"]}
                      </span>
                    </button>
                  </nav>

                  {/* Filter by tags */}
                  <h3 className="font-medium text-gray-900 mb-2">Filter by tags</h3>
                  <div className="space-y-2">
                    {allTags
                      .slice(0, showAllTags ? allTags.length - 1 : 8)
                      .map((tag) => (
                        <label
                          key={tag}
                          className="flex items-center space-x-2 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTags.includes(tag)}
                            onChange={() => toggleTagSelection(tag)}
                            className="rounded text-blue-600 focus:ring-blue-500 transition-colors duration-200"
                          />
                          <span
                            className={`text-sm ${
                              selectedTags.includes(tag)
                                ? "text-blue-600"
                                : "text-gray-700 group-hover:text-gray-900"
                            } transition-colors duration-200`}
                          >
                            {tag}
                          </span>
                        </label>
                      ))}
                    {allTags.length > 8 && (
                      <button
                        onClick={() => setShowAllTags(!showAllTags)}
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 mt-1 cursor-pointer"
                      >
                        {showAllTags
                          ? "Show less"
                          : `Show ${allTags.length - 8} more`}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main thread list */}
          <div className="flex-1">
            {/* Mobile actions bar */}
            <div className="md:hidden flex space-x-2 mb-4">
              <button
                onClick={() => setIsCreatingThread(true)}
                className="flex-1 bg-blue-600 text-white rounded-md py-2 px-4 flex items-center justify-center space-x-1 hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
              >
                <MessageSquare size={16} />
                <span>New</span>
              </button>
              <button
                onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
                className={`px-3 py-2 rounded-md border flex items-center space-x-1 cursor-pointer ${
                  bookmarkedOnly
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                } transition-colors duration-200`}
              >
                <Bookmark size={16} className={bookmarkedOnly ? "fill-blue-600" : ""} />
                <span>{bookmarkedCount}</span>
              </button>
            </div>

            {/* Render mobile categories */}
            {renderMobileCategories()}

            {/* Title for thread list */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeNavTab === "Bookmarks"
                  ? "Bookmarked Discussions"
                  : selectedCategory === "All"
                  ? "All Discussions"
                  : `${selectedCategory} Discussions`}
              </h2>
              {/* Description based on current view */}
              <p className="text-gray-500 mt-1">
                {activeNavTab === "Bookmarks"
                  ? `Discussions you've saved for later`
                  : selectedCategory === "Ideas"
                  ? "Share and discuss new ideas and innovations"
                  : selectedCategory === "Technical"
                  ? "Technical discussions and problem-solving"
                  : selectedCategory === "Reports"
                  ? "Reports, analytics, and data discussions"
                  : selectedCategory === "General"
                  ? "General company discussions and announcements"
                  : "Join the conversation and share your thoughts"}
              </p>
            </div>

            {/* Thread filters */}
            <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                {/* Only show filter dropdown when not on Bookmarks tab */}
                {activeNavTab !== "Bookmarks" && (
                  <div className="relative">
                    <button
                      ref={filterButtonRef}
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm text-gray-700 flex items-center space-x-1 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                    >
                      <Filter size={14} />
                      <span>Filter</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          showFilterDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Filter dropdown */}
                    {showFilterDropdown && (
                      <div
                        ref={filterDropdownRef}
                        className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
                      >
                        <div className="px-3 py-2 border-b border-gray-100">
                          <h4 className="text-xs font-medium text-gray-500 uppercase">
                            Filter Options
                          </h4>
                        </div>
                        <label className="flex items-center px-3 py-2 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={bookmarkedOnly}
                            onChange={() => setBookmarkedOnly(!bookmarkedOnly)}
                            className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                          />
                          <span className="text-sm text-gray-700">
                            Bookmarked only
                          </span>
                        </label>
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={() => {
                              setSelectedTags([]);
                              setBookmarkedOnly(false);
                              setShowFilterDropdown(false);
                            }}
                            className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors duration-200 w-full text-left cursor-pointer"
                          >
                            Clear all filters
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="relative">
                  <button
                    ref={sortButtonRef}
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm text-gray-700 flex items-center space-x-1 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  >
                    <Clock size={14} />
                    <span>
                      {sortMethod === "latest"
                        ? "Latest"
                        : sortMethod === "oldest"
                        ? "Oldest"
                        : sortMethod === "most-liked"
                        ? "Most Liked"
                        : sortMethod === "most-viewed"
                        ? "Most Viewed"
                        : "Most Replies"}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        showSortDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Sort dropdown */}
                  {showSortDropdown && (
                    <div
                      ref={sortDropdownRef}
                      className="absolute left-0 mt-1 w-36 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
                    >
                      <button
                        onClick={() => handleSortMethodChange("latest")}
                        className={`px-3 py-2 text-sm w-full text-left cursor-pointer ${
                          sortMethod === "latest"
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-50"
                        } transition-colors duration-200`}
                      >
                        Latest
                      </button>
                      <button
                        onClick={() => handleSortMethodChange("oldest")}
                        className={`px-3 py-2 text-sm w-full text-left cursor-pointer ${
                          sortMethod === "oldest"
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-50"
                        } transition-colors duration-200`}
                      >
                        Oldest
                      </button>
                      <button
                        onClick={() => handleSortMethodChange("most-liked")}
                        className={`px-3 py-2 text-sm w-full text-left cursor-pointer ${
                          sortMethod === "most-liked"
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-50"
                        } transition-colors duration-200`}
                      >
                        Most Liked
                      </button>
                      <button
                        onClick={() => handleSortMethodChange("most-viewed")}
                        className={`px-3 py-2 text-sm w-full text-left cursor-pointer ${
                          sortMethod === "most-viewed"
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-50"
                        } transition-colors duration-200`}
                      >
                        Most Viewed
                      </button>
                      <button
                        onClick={() => handleSortMethodChange("most-replies")}
                        className={`px-3 py-2 text-sm w-full text-left cursor-pointer ${
                          sortMethod === "most-replies"
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-50"
                        } transition-colors duration-200`}
                      >
                        Most Replies
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-sm text-gray-500">
                {filteredThreads.length}{" "}
                {filteredThreads.length === 1 ? "discussion" : "discussions"}
              </div>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
                <p className="text-gray-500">Loading discussions...</p>
              </div>
            )}

            {/* Empty state */}
            {!loading && filteredThreads.length === 0 && (
              <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                <div className="inline-block p-4 rounded-full bg-blue-50 mb-4">
                  <MessageSquare size={32} className="text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No discussions found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || selectedTags.length > 0 || bookmarkedOnly
                    ? "No discussions match your current filters."
                    : "Be the first to start a discussion."}
                </p>
                <button
                  onClick={() => setIsCreatingThread(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
                >
                  Start a discussion
                </button>
              </div>
            )}

            {/* Thread list */}
            {!loading && filteredThreads.length > 0 && (
              <div className="space-y-4">
                {filteredThreads.map(renderThread)}
              </div>
            )}

            {/* Load more button */}
            {!loading && filteredThreads.length > 5 && (
              <div className="text-center mt-6">
                <button
                  onClick={loadMoreThreads}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  Load more discussions
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="bg-blue-600 w-6 h-6 rounded flex items-center justify-center text-white font-bold text-xs">
                  F
                </div>
                <span className="ml-2 text-sm font-semibold">ForumPro</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                © 2025 ForumPro. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
              >
                Help
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-300">
          <div className="bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
            <div className="flex-1">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast({ show: false, message: "" })}
              className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Create New Discussion Modal */}
      {isCreatingThread && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Create a new discussion
                </h2>
                <button
                  onClick={() => setIsCreatingThread(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="modal-thread-title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="modal-thread-title"
                    value={newThreadTitle}
                    onChange={(e) => setNewThreadTitle(e.target.value)}
                    placeholder="Enter a title for your discussion"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                  />
                </div>
                
                <div>
                  <label
                    htmlFor="modal-thread-content"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Content
                  </label>
                  <textarea
                    id="modal-thread-content"
                    ref={threadInputRef}
                    value={newThreadContent}
                    onChange={(e) => setNewThreadContent(e.target.value)}
                    placeholder="What would you like to discuss?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none resize-none h-32"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="modal-thread-category"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Category
                    </label>
                    <select
                      id="modal-thread-category"
                      value={newThreadCategory}
                      onChange={(e) => setNewThreadCategory(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    >
                      <option value="General">General</option>
                      <option value="Ideas">Ideas</option>
                      <option value="Technical">Technical</option>
                      <option value="Reports">Reports</option>
                    </select>
                  </div>
                  
                  <div>
                    <label
                      htmlFor="modal-thread-tags"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tags
                    </label>
                    <input
                      type="text"
                      id="modal-thread-tags"
                      value={newThreadTags}
                      onChange={(e) => setNewThreadTags(e.target.value)}
                      placeholder="e.g. sales, strategy, review"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsCreatingThread(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={createNewThread}
                    disabled={!newThreadTitle.trim() || !newThreadContent.trim()}
                    className={`px-6 py-2 rounded-md bg-blue-600 text-white transition-all duration-200 cursor-pointer ${
                      newThreadTitle.trim() && newThreadContent.trim()
                        ? "hover:bg-blue-700"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    Create Discussion
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreadedDiscussionForum;