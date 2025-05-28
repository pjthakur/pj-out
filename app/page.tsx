"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  Bookmark,
  Share2,
  Heart,
  MessageCircle,
  ArrowRight,
  BookOpen,
  Clock,
  Tag,
  Rss,
  Mail,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  ChevronUp,
  Send,
} from "lucide-react";

// Import Poppins font from Google Fonts
const fontImport = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
  
  * {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  body {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
`;

// Inject font styles
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('poppins-font');
  if (!existingStyle) {
    const style = document.createElement('style');
    style.id = 'poppins-font';
    style.textContent = fontImport;
    document.head.appendChild(style);
  }
}

// Type definitions
type Post = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  author: Author;
  category: Category;
  tags: string[];
  image: string;
  featured?: boolean;
  likes: number;
  comments: number;
};

type Author = {
  id: string;
  name: string;
  avatar: string;
  role: string;
  bio: string;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Comment = {
  id: string;
  author: Author;
  content: string;
  date: string;
  likes: number;
  replies?: Comment[];
  postId: string; // ← add this
};

// ====== Mock Data ======
const authors: Author[] = [
  {
    id: "author-1",
    name: "Alex Morgan",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    role: "Senior Editor",
    bio: "Writing about technology and future trends for over a decade.",
  },
  {
    id: "author-2",
    name: "Jamie Chen",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    role: "Tech Writer",
    bio: "Passionate about emerging technologies and their impact on society.",
  },
  {
    id: "author-3",
    name: "Sam Wilson",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    role: "Guest Writer",
    bio: "Entrepreneur and tech enthusiast with a focus on AI and machine learning.",
  },
];

const categories: Category[] = [
  { id: "cat-1", name: "Technology", slug: "technology" },
  { id: "cat-2", name: "Design", slug: "design" },
  { id: "cat-3", name: "Business", slug: "business" },
  { id: "cat-4", name: "Science", slug: "science" },
  { id: "cat-5", name: "Productivity", slug: "productivity" },
];

const posts: Post[] = [
  {
    id: "post-1",
    title: "The Future of AI in Everyday Applications in World",
    excerpt:
      "Exploring how artificial intelligence is transforming the way we interact with technology on a daily basis.",
    content: `<p>Artificial intelligence has come a long way in recent years, evolving from a sci-fi concept to an integral part of our daily lives. From voice assistants to recommendation algorithms, AI is silently powering many of the tools we use every day.</p>
              <p>One of the most significant impacts of AI has been in personalization. Services like Netflix, Spotify, and Amazon have leveraged machine learning algorithms to understand user preferences and deliver tailored content recommendations. This level of personalization not only enhances user experience but also drives engagement and retention.</p>
              <h2>The Rise of Conversational AI</h2>
              <p>Conversational AI, which includes chatbots and virtual assistants, has seen remarkable improvements. These systems are no longer limited to following predefined scripts; they can now understand context, remember previous interactions, and even detect emotional cues.</p>
              <p>Tools like ChatGPT have demonstrated that AI can engage in meaningful conversations, assist with creative tasks, and solve complex problems. This has opened up new possibilities for customer service, education, and accessibility.</p>
              <h2>Challenges and Considerations</h2>
              <p>Despite these advancements, there are legitimate concerns about privacy, bias, and the potential misuse of AI technologies. As these tools become more integrated into our lives, it's crucial to establish ethical guidelines and regulatory frameworks.</p>
              <p>The path forward involves balancing innovation with responsibility, ensuring that AI remains a tool that enhances human capabilities rather than diminishes them.</p>`,
    date: "May 15, 2025",
    readTime: "5 min read",
    author: authors[0],
    category: categories[0],
    tags: ["AI", "Machine Learning", "Technology Trends"],
    image: "https://picsum.photos/seed/ai-future/600/400",
    featured: true,
    likes: 245,
    comments: 37,
  },
  {
    id: "post-2",
    title: "Designing for Accessibility: A Comprehensive Guide",
    excerpt:
      "Learn how inclusive design principles can make your products accessible to a wider audience.",
    content: "Full content for the accessibility article would go here...",
    date: "May 12, 2025",
    readTime: "7 min read",
    author: authors[1],
    category: categories[1],
    tags: ["Accessibility", "UX Design", "Inclusive Design"],
    image: "https://picsum.photos/seed/accessibility/600/400",
    featured: true,
    likes: 189,
    comments: 24,
  },
  {
    id: "post-3",
    title:
      "Sustainable Tech: Balancing Innovation and Environmental Responsibility",
    excerpt:
      "Examining how tech companies are addressing environmental concerns while pushing technological boundaries.",
    content: "Full content for the sustainable tech article would go here...",
    date: "May 10, 2025",
    readTime: "6 min read",
    author: authors[2],
    category: categories[0],
    tags: ["Sustainability", "Green Tech", "Innovation"],
    image: "https://picsum.photos/seed/sustainable-tech/600/400",
    featured: false,
    likes: 210,
    comments: 31,
  },
  {
    id: "post-4",
    title: "The Remote Work Revolution: Tools for Distributed Teams",
    excerpt:
      "A curated list of essential tools and practices for effective remote collaboration.",
    content: "Full content for the remote work article would go here...",
    date: "May 8, 2025",
    readTime: "4 min read",
    author: authors[0],
    category: categories[4],
    tags: ["Remote Work", "Productivity", "Collaboration"],
    image: "https://picsum.photos/seed/remote-work/600/400",
    featured: false,
    likes: 176,
    comments: 19,
  },
  {
    id: "post-5",
    title: `Understanding Quantum Computing: A Beginner's Guide`,
    excerpt:
      "Breaking down complex quantum concepts into digestible explanations for non-physicists.",
    content: "Full content for the quantum computing article would go here...",
    date: "May 5, 2025",
    readTime: "8 min read",
    author: authors[1],
    category: categories[3],
    tags: ["Quantum Computing", "Science", "Technology"],
    image: "https://picsum.photos/seed/quantum/600/400",
    featured: false,
    likes: 231,
    comments: 42,
  },
  {
    id: "post-6",
    title: "The Psychology of User Interaction",
    excerpt:
      "How understanding human behavior can lead to more effective digital products.",
    content: "Full content for the psychology of UX article would go here...",
    date: "May 3, 2025",
    readTime: "5 min read",
    author: authors[2],
    category: categories[1],
    tags: ["UX Design", "Psychology", "User Behavior"],
    image: "https://picsum.photos/seed/psychology-ux/600/400",
    featured: false,
    likes: 198,
    comments: 27,
  },
];

// ====== Main App Component ======
const ModernBlogApp = () => {
  // UI State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "comment-1",
      author: {
        id: "reader-1",
        name: "Taylor Reed",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg",
        role: "Reader",
        bio: "Tech enthusiast and early adopter",
      },
      content:
        "This article really opened my eyes to how pervasive AI has become in our daily lives. I wonder about the privacy implications though.",
      date: "May 16, 2025",
      likes: 12,
      postId: "post-1",
      replies: [
        {
          id: "reply-1",
          postId: "post-1",
          author: authors[0],
          content: `Great point about privacy, Taylor. That's definitely one of the key challenges we need to address as AI becomes more integrated into our lives.`,
          date: "May 16, 2025",
          likes: 5,
        },
      ],
    },
    {
      id: "comment-2",
      postId: "post-1",
      author: {
        id: "reader-2",
        name: "Jordan Smith",
        avatar: "https://randomuser.me/api/portraits/women/57.jpg",
        role: "Reader",
        bio: "Software developer and AI researcher",
      },
      content:
        "I work in the AI field, and I appreciate how this article makes complex concepts accessible without oversimplifying. Looking forward to more articles in this series!",
      date: "May 17, 2025",
      likes: 8,
    },

    // Comments for post-2
    {
      id: "comment-3",
      postId: "post-2",
      author: {
        id: "reader-3",
        name: "Samuel Brooks",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        role: "Product Manager",
        bio: "Always thinking about user experience.",
      },
      content:
        "The UI case studies were spot on. I've forwarded this to my design team!",
      date: "May 18, 2025",
      likes: 9,
    },

    // Comments for post-3
    {
      id: "comment-4",
      postId: "post-3",
      author: {
        id: "reader-4",
        name: "Lena Torres",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        role: "UX Designer",
        bio: "Designing with empathy and data.",
      },
      content:
        "Loved the section on cognitive load—this is often overlooked in fast-paced projects.",
      date: "May 19, 2025",
      likes: 6,
    },

    // Comments for post-4
    {
      id: "comment-5",
      postId: "post-4",
      author: {
        id: "reader-5",
        name: "Dev Patel",
        avatar: "https://randomuser.me/api/portraits/men/33.jpg",
        role: "Full Stack Developer",
        bio: "Building SaaS and writing clean code.",
      },
      content:
        "Nice breakdown of microservices. Would love a follow-up post on deployment strategies.",
      date: "May 20, 2025",
      likes: 10,
    },

    // Comments for post-5
    {
      id: "comment-6",
      postId: "post-5",
      author: {
        id: "reader-6",
        name: "Emily Zhang",
        avatar: "https://randomuser.me/api/portraits/women/22.jpg",
        role: "Cloud Architect",
        bio: "Helping teams scale on the cloud.",
      },
      content:
        "This was a good refresher on Kubernetes fundamentals. Thanks for including diagrams!",
      date: "May 21, 2025",
      likes: 11,
    },

    // Comments for post-6
    {
      id: "comment-7",
      postId: "post-6",
      author: {
        id: "reader-7",
        name: "Marcus Lee",
        avatar: "https://randomuser.me/api/portraits/men/78.jpg",
        role: "Security Analyst",
        bio: "Keeping the web safe one firewall at a time.",
      },
      content:
        "The security checklist is gold. Every startup should bookmark this.",
      date: "May 21, 2025",
      likes: 14,
    },
  ]);
  const [replyText, setReplyText] = useState("");

  // Form State
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // Auth State
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState<Author | null>(null);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [showSavedPosts, setShowSavedPosts] = useState(false);

  // Post Creation State
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [newPost, setNewPost] = useState<Partial<Post>>({
    title: "",
    excerpt: "",
    content: "",
    category: categories[0],
    tags: [],
    image: "",
  });
  const [allPosts, setAllPosts] = useState<Post[]>(posts);

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);

  // New state for scrolling to comments
  const [scrollToCommentsFlag, setScrollToCommentsFlag] = useState(false);

  // Toast state
  const [toasts, setToasts] = useState<Array<{id: string, message: string, type: 'success' | 'error' | 'info'}>>([]);

  // Function to show toast
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  // Handle scroll to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter posts based on search query and selected category
  useEffect(() => {
    const filtered = allPosts.filter((post) => {
      const matchesQuery =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === null || post.category.id === selectedCategory;

      return matchesQuery && matchesCategory;
    });

    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory, allPosts]);

  // Focus search input when search is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    } else {
      // Restore background scrolling
      document.body.style.overflow = 'unset';
    }

    // Add keyboard event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSearchOpen) {
        if (e.key === 'Escape') {
          setIsSearchOpen(false);
        } else if (e.key === 'Enter' && searchQuery && filteredPosts.length > 0) {
          handlePostClick(filteredPosts[0]);
          setIsSearchOpen(false);
        }
      }
    };

    if (isSearchOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    // Cleanup function to restore scrolling if component unmounts
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen, searchQuery, filteredPosts]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    } else {
      // Restore background scrolling
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling if component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handlePostClick = (post: Post, scrollToComments = false) => {
    setCurrentPost(post);
    setScrollToCommentsFlag(scrollToComments);
    if (!scrollToComments) {
      window.scrollTo(0, 0);
    }
  };

  const handleBackToList = () => {
    setCurrentPost(null);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    setCurrentPost(null); // Close single post view when navigating to categories
    setShowSavedPosts(false); // Also close saved posts view if open
    window.scrollTo(0, 0); // Scroll to top when changing views
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Clear search when opening
      setSearchQuery("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Sign in handling
  const handleSignIn = () => {
    // Mock authentication
    if (username && password) {
      // In a real app, this would validate against a backend
      setIsSignedIn(true);

      // Create a mock user based on the username
      const user: Author = {
        id: "current-user",
        name: username,
        avatar: `https://randomuser.me/api/portraits/${
          Math.random() > 0.5 ? "men" : "women"
        }/${Math.floor(Math.random() * 99)}.jpg`,
        role: "Member",
        bio: "Blog member",
      };

      setCurrentUser(user);
      setIsSignInModalOpen(false);

      // Clear form
      setUsername("");
      setPassword("");
    }
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setCurrentUser(null);
  };

  // Post creation handling
  const handleCreatePost = () => {
    if (!isSignedIn || !currentUser) {
      setIsSignInModalOpen(true);
      return;
    }

    // Validate required fields
    if (!newPost.title || !newPost.excerpt || !newPost.content) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    // Create a new post
    const postId = `post-${allPosts.length + 1}`;
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Generate image if none provided
    const imageUrl =
      newPost.image || `https://picsum.photos/seed/${postId}/600/400`;

    // Create full post object
    const fullPost: Post = {
      id: postId,
      title: newPost.title,
      excerpt: newPost.excerpt,
      content: newPost.content,
      date: formattedDate,
      readTime: `${Math.max(
        2,
        Math.ceil(newPost.content.length / 1000)
      )} min read`,
      author: currentUser,
      category: newPost.category || categories[0],
      tags: newPost.tags || [],
      image: imageUrl,
      likes: 0,
      comments: 0,
    };

    // Add to posts and reset form
    setAllPosts([fullPost, ...allPosts]);
    setIsCreatePostModalOpen(false);
    setNewPost({
      title: "",
      excerpt: "",
      content: "",
      category: categories[0],
      tags: [],
      image: "",
    });
  };

  // Comment handling
  const handleSubmitComment = () => {
    if (!currentPost) return;

    if (!isSignedIn) {
      setIsSignInModalOpen(true);
      return;
    }

    if (!comment.trim()) {
      showToast("Please enter a comment", "error");
      return;
    }

    // Create a new comment
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: currentUser!,
      content: comment,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      likes: 0,
      postId: currentPost.id,
    };

    // Add comment to the current post
    const updatedPosts = allPosts.map((post) => {
      if (post.id === currentPost.id) {
        // Create a new post object with updated comment count
        return {
          ...post,
          comments: post.comments + 1,
        };
      }
      return post;
    });

    // Update the current post's comments count
    if (currentPost) {
      setCurrentPost({
        ...currentPost,
        comments: currentPost.comments + 1,
      });
    }

    // Update posts
    setAllPosts(updatedPosts);

    // Add comment to the global comments
    setComments((prev) => [newComment, ...prev]);

    // Clear comment field
    setComment("");
  };

  const handleSubscribe = () => {
    // Mock subscribe functionality
    if (!email.trim()) {
      showToast("Please enter your email", "error");
      return;
    }

    setEmail("");
    setName("");
    showToast("Thanks for subscribing!", "success");
  };

  // Add these functions to ModernBlogApp
  const handleSavePost = (post: Post) => {
    setSavedPosts((prev) => {
      if (!prev.some((p) => p.id === post.id)) {
        return [...prev, post];
      }
      return prev;
    });
  };

  const handleRemoveSavedPost = (postId: string) => {
    setSavedPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 text-gray-900"
      style={{ fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Navigation */}
      <motion.nav 
        className="bg-white shadow-sm fixed w-full z-10 transition-all duration-300"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a
                href="#"
                className="flex-shrink-0 flex items-center cursor-pointer"
                onClick={() => {
                  setCurrentPost(null);
                  setSelectedCategory(null);
                  setShowSavedPosts(false);
                  setSearchQuery("");
                  setIsSearchOpen(false);
                  window.scrollTo(0, 0);
                }}
              >
                <span className="font-bold text-xl text-blue-600">Insight</span>
                <span className="font-bold text-xl text-gray-900">Blog</span>
              </a>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                {categories.slice(0, 4).map((category) => (
                  <a
                    key={category.id}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCategorySelect(category.id);
                    }}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                      selectedCategory === category.id
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {category.name}
                  </a>
                ))}
                <div className="relative group">
                  <button className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors duration-200 cursor-pointer">
                    More <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                    {categories.slice(4).map((category) => (
                      <a
                        key={category.id}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCategorySelect(category.id);
                        }}
                        className={`block px-4 py-2 text-sm cursor-pointer ${
                          selectedCategory === category.id
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {category.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={toggleSearch}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Create new post button */}
              {isSignedIn && (
                <button
                  onClick={() => setIsCreatePostModalOpen(true)}
                  className="hidden md:block ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 cursor-pointer"
                >
                  New Post
                </button>
              )}

              <div className="hidden md:ml-4 md:flex md:items-center">
                {!isSignedIn ? (
                  <button
                    onClick={() => setIsSignInModalOpen(true)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                  >
                    Sign In
                  </button>
                ) : (
                  <div className="relative ml-3 group">
                    <div className="flex items-center">
                      <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={currentUser?.avatar}
                          alt={currentUser?.name}
                        />
                        <span className="ml-2 text-gray-700">
                          {currentUser?.name}
                        </span>
                        <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsCreatePostModalOpen(true);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        New Post
                      </a>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowSavedPosts(true);
                          setCurrentPost(null);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        Saved Posts
                      </a>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSignOut();
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        Sign Out
                      </a>
                    </div>
                  </div>
                )}

                {!isSignedIn && (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsSignInModalOpen(true);
                    }}
                    className="ml-3 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
                  >
                    Subscribe
                  </a>
                )}
              </div>
              <div className="ml-4 md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden bg-white shadow-lg"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              {/* Categories Section */}
              <motion.div 
                className="px-4 py-4 border-b border-gray-100"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Categories
                </h3>
                <div className="space-y-1">
                  {categories.map((category, index) => (
                    <motion.button
                      key={category.id}
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategorySelect(category.id);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition-all duration-200 cursor-pointer touch-manipulation ${
                        selectedCategory === category.id
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {category.name}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* User Section */}
              <motion.div 
                className="px-4 py-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {!isSignedIn ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Account
                    </h3>
                    <div className="space-y-2">
                      <motion.button
                        onClick={() => {
                          setIsSignInModalOpen(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 cursor-pointer touch-manipulation"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.35 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Sign In
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          setIsSignInModalOpen(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 rounded-lg text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 cursor-pointer touch-manipulation text-center"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Subscribe
                      </motion.button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* User Info */}
                    <motion.div 
                      className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.35 }}
                    >
                      <img
                        className="h-10 w-10 rounded-full mr-3"
                        src={currentUser?.avatar}
                        alt={currentUser?.name}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{currentUser?.name}</div>
                        <div className="text-sm text-gray-500">{currentUser?.role}</div>
                      </div>
                    </motion.div>

                    {/* User Actions */}
                    <div className="space-y-2">
                      <motion.button
                        onClick={() => {
                          setIsCreatePostModalOpen(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-base font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 cursor-pointer touch-manipulation"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="mr-2">+</span>
                        New Post
                      </motion.button>
                      
                      <motion.button
                        onClick={() => {
                          setShowSavedPosts(true);
                          setCurrentPost(null);
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 cursor-pointer touch-manipulation"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.45 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Bookmark className="h-5 w-5 mr-3" />
                        Saved Posts
                      </motion.button>

                      <motion.button
                        onClick={() => {
                          handleSignOut();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 cursor-pointer touch-manipulation"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <X className="h-5 w-5 mr-3" />
                        Sign Out
                      </motion.button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search overlay */}
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-start justify-center pt-4 sm:pt-20 px-4 transition-all duration-300 ease-out ${
            isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsSearchOpen(false);
            }
          }}
        >
          <div className={`w-full max-w-2xl transform transition-all duration-300 ease-out ${
            isSearchOpen ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'
          }`}>
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 overflow-hidden max-h-[90vh] flex flex-col">
              {/* Search Header */}
              <div className="px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-b border-gray-100/50 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg sm:rounded-xl">
                      <Search className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Search Articles</h2>
                      <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Find the perfect article for you</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors duration-200 cursor-pointer group touch-manipulation"
                  >
                    <X className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Search Input */}
              <div className="px-4 sm:px-8 py-4 sm:py-6 flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search by title, content, tags, or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 text-base sm:text-lg border-0 rounded-xl sm:rounded-2xl bg-gray-50/80 placeholder-gray-400 focus:outline-none focus:ring-2 sm:focus:ring-3 focus:ring-blue-500/30 focus:bg-white transition-all duration-300 shadow-sm touch-manipulation"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center">
                    <button
                      onClick={() => setSearchQuery("")}
                      className={`text-gray-400 hover:text-gray-600 focus:outline-none transition-all duration-200 cursor-pointer p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-gray-100 touch-manipulation ${
                        searchQuery ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-75"
                      }`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Search Results */}
                {searchQuery && (
                  <div className="mt-4 sm:mt-6 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-1.5 sm:mr-2"></div>
                        Search Results
                      </h3>
                      <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
                        {filteredPosts.length} found
                      </span>
                    </div>

                    <div className="space-y-2 sm:space-y-3 max-h-60 sm:max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                      {filteredPosts.length > 0 ? (
                        filteredPosts.slice(0, 6).map((post) => (
                          <div
                            key={post.id}
                            onClick={() => {
                              handlePostClick(post);
                              setIsSearchOpen(false);
                            }}
                            className="group p-3 sm:p-4 hover:bg-gray-50 rounded-lg sm:rounded-2xl transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-200 hover:shadow-md transform hover:-translate-y-0.5 touch-manipulation"
                          >
                            <div className="flex items-start space-x-3 sm:space-x-4">
                              <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg sm:rounded-xl overflow-hidden shadow-sm">
                                <img 
                                  src={post.image} 
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-1">
                                  {post.title}
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-2">
                                  {post.excerpt.substring(0, 120)}...
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center text-xs text-gray-400">
                                    <span className="font-medium truncate max-w-20 sm:max-w-none">{post.author.name}</span>
                                    <span className="mx-1 sm:mx-2">•</span>
                                    <span className="flex-shrink-0">{post.readTime}</span>
                                  </div>
                                  <div className="flex space-x-1 flex-shrink-0 ml-2">
                                    {post.tags.slice(0, 1).map((tag) => (
                                      <span
                                        key={tag}
                                        className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 max-w-16 sm:max-w-none truncate"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                    {post.tags.length > 1 && (
                                      <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-xs font-medium bg-gray-100 text-gray-600">
                                        +{post.tags.length - 1}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 sm:py-12 animate-in fade-in duration-500">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <Search className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                          </div>
                          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                          <p className="text-sm sm:text-base text-gray-500 max-w-xs sm:max-w-sm mx-auto px-4">
                            We couldn't find any articles matching "<span className="font-medium text-gray-700">{searchQuery}</span>". Try different keywords.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                {!searchQuery && (
                  <div className="mt-4 sm:mt-6 animate-in fade-in duration-300">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1.5 sm:mr-2"></div>
                      Popular Categories
                    </h3>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {categories.slice(0, 4).map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            handleCategorySelect(category.id);
                            setIsSearchOpen(false);
                          }}
                          className="p-2.5 sm:p-3 text-left bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 rounded-lg sm:rounded-xl transition-all duration-200 cursor-pointer group border border-gray-200 hover:border-blue-200 touch-manipulation"
                        >
                          <div className="font-medium text-sm sm:text-base text-gray-900 group-hover:text-blue-700 transition-colors duration-200 truncate">
                            {category.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 sm:mt-1">
                            {posts.filter(p => p.category.id === category.id).length} articles
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 sm:px-8 py-3 sm:py-4 bg-gray-50/80 border-t border-gray-100/50 flex-shrink-0">
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <span className="hidden sm:inline">Press <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white rounded border text-xs font-mono">Esc</kbd> to close</span>
                    <span className="sm:hidden">Tap outside to close</span>
                  </div>
                  <div>
                    {searchQuery && filteredPosts.length > 0 && (
                      <span className="hidden sm:inline">Press <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white rounded border text-xs font-mono">Enter</kbd> to select first result</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      <motion.main 
        className="pt-24 pb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
      >
        {currentPost ? (
          <SinglePostView
            post={currentPost}
            comments={comments.filter((c) => c.postId === currentPost.id)}
            onBack={handleBackToList}
            comment={comment}
            setComment={setComment}
            handleSubmitComment={handleSubmitComment}
            isSignedIn={isSignedIn}
            currentUser={currentUser}
            setIsSignInModalOpen={setIsSignInModalOpen}
            setComments={setComments}
            replyText={replyText}
            setReplyText={setReplyText}
            onSavePost={handleSavePost}
            onRemoveSavedPost={handleRemoveSavedPost}
            scrollToComments={scrollToCommentsFlag}
            onScrollToCommentsComplete={() => setScrollToCommentsFlag(false)}
            showToast={showToast}
          />
        ) : showSavedPosts ? (
          <SavedPostsView
            posts={savedPosts}
            onPostClick={handlePostClick}
            onBack={() => setShowSavedPosts(false)}
            onUnsavePost={handleRemoveSavedPost}
          />
        ) : (
          <BlogListView
            posts={filteredPosts}
            onPostClick={handlePostClick}
            selectedCategory={selectedCategory}
            categories={categories}
            onCategorySelect={handleCategorySelect}
            email={email}
            setEmail={setEmail}
            name={name}
            setName={setName}
            handleSubscribe={handleSubscribe}
            comments={comments}
          />
        )}
      </motion.main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <span className="font-bold text-xl text-blue-400">Insight</span>
                <span className="font-bold text-xl text-white">Blog</span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Insightful perspectives on technology, design, business, and
                more. Join our community of forward-thinking readers.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Categories
              </h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategorySelect(category.id);
                        setCurrentPost(null);
                        window.scrollTo(0, 0);
                      }}
                      className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Subscribe
              </h3>
              <p className="text-gray-300 mb-4">
                Get the latest posts delivered right to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2 bg-gray-800 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSubscribe}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm text-center">
              © {new Date().getFullYear()} InsightBlog. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed right-6 bottom-6 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-300 cursor-pointer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Toast notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className={`px-4 py-3 rounded-md shadow-lg text-white text-sm font-medium ${
                toast.type === 'success' ? 'bg-green-500' :
                toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
              }`}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sign In Modal */}
      <AnimatePresence>
        {isSignInModalOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsSignInModalOpen(false);
              }
            }}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Sign In</h2>
                <motion.button
                  onClick={() => setIsSignInModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your username"
                  />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your password"
                  />
                </motion.div>

                <motion.div 
                  className="flex items-center justify-between"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-700 cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>


                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <motion.button
                    onClick={handleSignIn}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign In
                  </motion.button>
                </motion.div>

                <motion.div 
                  className="text-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Post Modal */}
      {isCreatePostModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Create New Post
              </h2>
              <button
                onClick={() => setIsCreatePostModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="post-title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title *
                </label>
                <input
                  id="post-title"
                  type="text"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter post title"
                />
              </div>

              <div>
                <label
                  htmlFor="post-excerpt"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Excerpt *
                </label>
                <textarea
                  id="post-excerpt"
                  value={newPost.excerpt}
                  onChange={(e) =>
                    setNewPost({ ...newPost, excerpt: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter a brief excerpt of your post"
                  rows={2}
                />
              </div>

              <div>
                <label
                  htmlFor="post-content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Content *
                </label>
                <textarea
                  id="post-content"
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write your post content here. HTML formatting is supported."
                  rows={10}
                />
              </div>

              <div>
                <label
                  htmlFor="post-category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="post-category"
                  value={newPost.category?.id || categories[0].id}
                  onChange={(e) => {
                    const selectedCategory = categories.find(
                      (cat) => cat.id === e.target.value
                    );
                    setNewPost({
                      ...newPost,
                      category: selectedCategory || categories[0],
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="post-tags"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tags (comma separated)
                </label>
                <input
                  id="post-tags"
                  type="text"
                  value={newPost.tags?.join(", ") || ""}
                  onChange={(e) => {
                    const tagsInput = e.target.value;
                    const tagsArray = tagsInput
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter((tag) => tag);
                    setNewPost({ ...newPost, tags: tagsArray });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Technology, AI, Design"
                />
              </div>

              <div>
                <label
                  htmlFor="post-image"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Featured Image URL (optional)
                </label>
                <input
                  id="post-image"
                  type="text"
                  value={newPost.image}
                  onChange={(e) =>
                    setNewPost({ ...newPost, image: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter image URL or leave blank for a random image"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setIsCreatePostModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                >
                  Publish Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ====== Blog List View Component ======
const BlogListView = ({
  posts,
  onPostClick,
  selectedCategory,
  categories,
  onCategorySelect,
  email,
  setEmail,
  name,
  setName,
  handleSubscribe,
  comments,
}: {
  posts: Post[];
  onPostClick: (post: Post, scrollToComments?: boolean) => void;
  selectedCategory: string | null;
  categories: Category[];
  onCategorySelect: (categoryId: string) => void;
  email: string;
  setEmail: (email: string) => void;
  name: string;
  setName: (name: string) => void;
  handleSubscribe: () => void;
  comments: Comment[];
}) => {
  const featuredPosts = posts.filter((post) => post.featured);
  const regularPosts = posts.filter((post) => !post.featured);

  const [locallyLikedPosts, setLocallyLikedPosts] = useState<Record<string, boolean>>({});
  const [localLikeCounts, setLocalLikeCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const initialCounts: Record<string, number> = {};
    const initialLikedStatus: Record<string, boolean> = {};
    posts.forEach(p => {
      initialCounts[p.id] = p.likes;
      initialLikedStatus[p.id] = false; // Assume not liked initially on card view
    });
    setLocalLikeCounts(initialCounts);
    setLocallyLikedPosts(initialLikedStatus);
  }, [posts]);

  const handleToggleLike = (postId: string) => {
    const currentlyLiked = locallyLikedPosts[postId];
    setLocallyLikedPosts(prevLikedStatus => ({
      ...prevLikedStatus,
      [postId]: !currentlyLiked,
    }));
    setLocalLikeCounts(prevCounts => ({
      ...prevCounts,
      [postId]: currentlyLiked
        ? (prevCounts[postId] || 0) - 1 // If it was liked, decrement
        : (prevCounts[postId] || 0) + 1, // If it was not liked, increment
    }));
  };

  // Selected category name for display
  const selectedCategoryName = selectedCategory
    ? categories.find((cat) => cat.id === selectedCategory)?.name
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero/Featured section */}
      {selectedCategory === null ? (
        <section className="mb-16">
          <h1 className="text-4xl font-bold text-center mb-12">
            <span className="text-blue-600">Insights</span> for the Modern World
          </h1>

          {featuredPosts.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-1 gap-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredPosts.slice(0, 2).map((post, index) => (
                  <motion.div
                    key={post.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                    onClick={() => onPostClick(post, false)}
                  >
                    <div className="relative h-64 w-full overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover object-center"
                        style={{ objectPosition: 'center' }}
                      />
                      <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs uppercase py-1 px-2 rounded-md">
                        Featured
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="mb-3">
                        <div className="flex items-center mb-1">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="h-6 w-6 rounded-full mr-2"
                          />
                          <span className="font-medium text-gray-900">{post.author.name}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 ml-8">
                          <span>{post.date}</span>
                          <span className="mx-2">•</span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {post.readTime}
                          </span>
                        </div>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base">{post.excerpt}</p>
                      <div className="flex sm:items-center sm:justify-between sm:flex-row flex-col gap-2">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                              +{post.tags.length - 2}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-3 text-gray-500 sm:justify-start justify-between mt-2 sm:mt-0">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleToggleLike(post.id); }} 
                            className={`flex items-center transition-colors duration-200 cursor-pointer ${locallyLikedPosts[post.id] ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                            aria-label="Like post"
                          >
                            <Heart className={`h-4 w-4 mr-1 ${locallyLikedPosts[post.id] ? 'fill-current' : ''}`} />
                            {localLikeCounts[post.id] !== undefined ? localLikeCounts[post.id] : post.likes}
                          </button>
                          <span 
                            className="flex items-center cursor-pointer" 
                            onClick={(e) => { e.stopPropagation(); onPostClick(post, true); }}
                            role="button"
                            aria-label="View comments"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {comments.filter((c) => c.postId === post.id).length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-gray-500">No featured posts available.</p>
            </motion.div>
          )}
        </section>
      ) : (
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedCategoryName} Articles
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our collection of articles about{" "}
              {selectedCategoryName?.toLowerCase()}, covering the latest trends,
              insights, and practical knowledge.
            </p>
          </div>
        </section>
      )}

      {/* Category filters for mobile */}
      <div className="md:hidden mb-8">
        <div className="flex overflow-x-auto py-2 space-x-2 no-scrollbar">
          <button
            onClick={() => onCategorySelect(selectedCategory || "")}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex-shrink-0 cursor-pointer ${
              selectedCategory === null
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex-shrink-0 cursor-pointer ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Posts list */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6">
            {selectedCategory
              ? `${selectedCategoryName} Posts`
              : "Latest Articles"}
          </h2>

          {posts.length > 0 ? (
            <div className="space-y-8">
              {regularPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col sm:flex-row h-auto"
                  onClick={() => onPostClick(post, false)}
                >
                  <div className="sm:w-1/3 h-48 sm:h-auto sm:min-h-full overflow-hidden flex-shrink-0">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
                      style={{ objectPosition: 'center', minHeight: '100%' }}
                    />
                  </div>
                  <div className="p-4 sm:p-6 sm:w-2/3 flex-1 flex flex-col justify-between">
                    <div className="mb-3">
                      <div className="flex items-center mb-1">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="h-6 w-6 rounded-full mr-2"
                        />
                        <span className="font-medium text-gray-900">{post.author.name}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 ml-8">
                        <span>{post.date}</span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base">{post.excerpt}</p>
                    <div className="flex sm:items-center sm:justify-between sm:flex-row flex-col gap-2">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                            +{post.tags.length - 2}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 text-gray-500 sm:justify-start justify-between mt-2 sm:mt-0">
                         <button 
                          onClick={(e) => { e.stopPropagation(); handleToggleLike(post.id); }} 
                          className={`flex items-center transition-colors duration-200 cursor-pointer ${locallyLikedPosts[post.id] ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                          aria-label="Like post"
                        >
                          <Heart className={`h-4 w-4 mr-1 ${locallyLikedPosts[post.id] ? 'fill-current' : ''}`} />
                          {localLikeCounts[post.id] !== undefined ? localLikeCounts[post.id] : post.likes}
                        </button>
                        <span 
                          className="flex items-center cursor-pointer" 
                          onClick={(e) => { e.stopPropagation(); onPostClick(post, true); }}
                          role="button"
                          aria-label="View comments"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {comments.filter((c) => c.postId === post.id).length}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No posts found
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedCategory
                  ? "There are no posts in this category yet."
                  : "There are no posts matching your criteria."}
              </p>
              {selectedCategory && (
                <button
                  onClick={() => onCategorySelect(selectedCategory)}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 cursor-pointer"
                >
                  View all posts
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="space-y-8">
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900">
                Categories
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onCategorySelect(selectedCategory || "");
                    }}
                    className={`flex items-center justify-between py-2 px-3 rounded-md transition-colors duration-200 cursor-pointer ${
                      selectedCategory === null
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>All Categories</span>
                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                      {posts.length}
                    </span>
                  </a>
                </li>
                {categories.map((category) => {
                  const categoryPostCount = posts.filter(
                    (post) => post.category.id === category.id
                  ).length;

                  return (
                    <li key={category.id}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onCategorySelect(category.id);
                        }}
                        className={`flex items-center justify-between py-2 px-3 rounded-md transition-colors duration-200 cursor-pointer ${
                          selectedCategory === category.id
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                          {categoryPostCount}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Newsletter */}
            <div
              id="subscribe-newsletter"
              className="bg-blue-600 rounded-lg shadow-md p-6 text-white"
            >
              <h3 className="text-lg font-bold mb-2">
                Refer to our newsletter
              </h3>
              <p className="text-blue-100 mb-4">
                Get the latest posts delivered right to your inbox.
              </p>
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Enter referral name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-500 bg-blue-500 rounded-md placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Enter referral email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-500 bg-blue-500 rounded-md placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                <button
                  onClick={handleSubscribe}
                  className="w-full bg-white text-blue-600 font-medium py-2 px-4 rounded-md hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-blue-200 text-xs mt-3">
                We respect your privacy. No spam, ever.
              </p>
            </div>

            {/* Popular tags */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900">
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(posts.flatMap((post) => post.tags)))
                  .slice(0, 12)
                  .map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this new component
const SavedPostsView = ({
  posts,
  onPostClick,
  onBack,
  onUnsavePost,
}: {
  posts: Post[];
  onPostClick: (post: Post, scrollToComments?: boolean) => void;
  onBack: () => void;
  onUnsavePost: (postId: string) => void;
}) => {
  const [locallyLikedSavedPosts, setLocallyLikedSavedPosts] = useState<Record<string, boolean>>({});
  const [localSavedLikeCounts, setLocalSavedLikeCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const initialCounts: Record<string, number> = {};
    const initialLikedStatus: Record<string, boolean> = {};
    posts.forEach(p => {
      initialCounts[p.id] = p.likes;
      initialLikedStatus[p.id] = false; // Assume not liked initially on card view
    });
    setLocalSavedLikeCounts(initialCounts);
    setLocallyLikedSavedPosts(initialLikedStatus);
  }, [posts]);

  const handleToggleLike = (postId: string) => {
    const currentlyLiked = locallyLikedSavedPosts[postId];
    setLocallyLikedSavedPosts(prevLikedStatus => ({
      ...prevLikedStatus,
      [postId]: !currentlyLiked,
    }));
    setLocalSavedLikeCounts(prevCounts => ({
      ...prevCounts,
      [postId]: currentlyLiked
        ? (prevCounts[postId] || 0) - 1
        : (prevCounts[postId] || 0) + 1,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
      >
        <ArrowRight className="h-4 w-4 mr-1 transform rotate-180" />
        Back to all articles
      </button>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Saved Posts</h1>
        <p className="text-gray-600 mt-2">
          Your bookmarked articles for later reading
        </p>
      </header>

      {posts.length > 0 ? (
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col sm:flex-row h-auto"
              onClick={() => onPostClick(post, false)}
            >
              <div className="sm:w-1/3 h-48 sm:h-auto sm:min-h-full overflow-hidden flex-shrink-0">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
                  style={{ objectPosition: 'center', minHeight: '100%' }}
                />
              </div>
              <div className="p-4 sm:p-6 sm:w-2/3 flex-1 flex flex-col justify-between">
                <div className="mb-3">
                  <div className="flex items-center mb-1">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="h-6 w-6 rounded-full mr-2"
                    />
                    <span className="font-medium text-gray-900">{post.author.name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 ml-8">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base">{post.excerpt}</p>
                <div className="flex sm:items-center sm:justify-between sm:flex-row flex-col gap-2">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                        +{post.tags.length - 2}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-gray-500 sm:justify-start justify-between mt-2 sm:mt-0">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleToggleLike(post.id); }} 
                      className={`flex items-center transition-colors duration-200 cursor-pointer ${locallyLikedSavedPosts[post.id] ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                      aria-label="Like post"
                    >
                      <Heart className={`h-4 w-4 mr-1 ${locallyLikedSavedPosts[post.id] ? 'fill-current' : ''}`} />
                      {localSavedLikeCounts[post.id] !== undefined ? localSavedLikeCounts[post.id] : post.likes}
                    </button>
                    <span 
                      className="flex items-center cursor-pointer" 
                      onClick={(e) => { e.stopPropagation(); onPostClick(post, true); }}
                      role="button"
                      aria-label="View comments"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.comments} {/* Assuming comments count on post object is fine for saved view */}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onUnsavePost(post.id); }}
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
                      aria-label="Unsave post"
                    >
                      <Bookmark className="h-4 w-4 mr-1 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No saved posts yet
          </h3>
          <p className="text-gray-600 mb-4">
            Bookmark articles that interest you to read them later.
          </p>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 cursor-pointer"
          >
            Browse all articles
          </button>
        </div>
      )}
    </div>
  );
};

// ====== Single Post View Component ======
const SinglePostView = ({
  post,
  comments,
  onBack,
  comment,
  setComment,
  handleSubmitComment,
  isSignedIn = false,
  currentUser = null,
  setIsSignInModalOpen,
  setComments,
  replyText,
  setReplyText,
  onSavePost,
  onRemoveSavedPost,
  scrollToComments,
  onScrollToCommentsComplete,
  showToast,
}: {
  post: Post;
  comments: Comment[];
  onBack: () => void;
  comment: string;
  setComment: (comment: string) => void;
  handleSubmitComment: () => void;
  isSignedIn?: boolean;
  currentUser?: Author | null;
  setIsSignInModalOpen: (isOpen: boolean) => void;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  replyText: string;
  setReplyText: React.Dispatch<React.SetStateAction<string>>;
  onSavePost: (post: Post) => void;
  onRemoveSavedPost: (postId: string) => void;
  scrollToComments: boolean;
  onScrollToCommentsComplete: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}) => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (!isBookmarked) {
      onSavePost(post); // Add post to saved posts
    } else {
      onRemoveSavedPost(post.id); // Remove post from saved posts
    }
  };

  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const handleCommentLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, likes: likedComments.has(id) ? c.likes - 1 : c.likes + 1 }
          : c
      )
    );
    setLikedComments((pc) => {
      const next = new Set(pc);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleReplyLike = (replyId: string, parentCommentId: string) => {
    setComments(prevComments => 
      prevComments.map(comment => {
        if (comment.id === parentCommentId) {
          return {
            ...comment,
            replies: (comment.replies || []).map(reply => {
              if (reply.id === replyId) {
                const alreadyLiked = likedComments.has(replyId);
                return {
                  ...reply,
                  likes: alreadyLiked ? reply.likes - 1 : reply.likes + 1,
                };
              }
              return reply;
            }),
          };
        }
        return comment;
      })
    );

    setLikedComments(prevLiked => {
      const next = new Set(prevLiked);
      if (next.has(replyId)) {
        next.delete(replyId);
      } else {
        next.add(replyId);
      }
      return next;
    });
  };

  // And for "Reply", you'll need to track which comment is in "reply mode":
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    if (scrollToComments) {
      document.getElementById("comments-section")?.scrollIntoView({ behavior: "smooth" });
      onScrollToCommentsComplete();
    }
  }, [scrollToComments, onScrollToCommentsComplete]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
      >
        <ArrowRight className="h-4 w-4 mr-1 transform rotate-180" />
        Back to articles
      </button>

      {/* Article header */}
      <header className="mb-8">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 mr-2">
            {post.category.name}
          </span>
          <span>{post.date}</span>
          <span className="mx-2">•</span>
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {post.readTime}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-10 w-10 rounded-full mr-3"
            />
            <div>
              <div className="font-medium text-gray-900">
                {post.author.name}
              </div>
              <div className="text-sm text-gray-500">{post.author.role}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
              >
                <Share2 className="h-5 w-5" />
              </button>

              {/* Share dropdown */}
              <div
                className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ${
                  showShareOptions
                    ? "opacity-100 visible"
                    : "opacity-0 invisible"
                } transition-all duration-200`}
              >
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <Twitter className="h-4 w-4 inline mr-2" /> Twitter
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <Facebook className="h-4 w-4 inline mr-2" /> Facebook
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <Linkedin className="h-4 w-4 inline mr-2" /> LinkedIn
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <Mail className="h-4 w-4 inline mr-2" /> Email
                </a>
              </div>
            </div>

            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full ${
                isBookmarked
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } transition-colors duration-200 cursor-pointer`}
            >
              <Bookmark
                className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Featured image */}
      <div className="mb-8 rounded-lg overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Article content */}
      <article className="prose prose-lg max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      {/* Tags */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer transition-colors duration-200"
            >
              <Tag className="h-4 w-4 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Article actions */}
      <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-8">
        <div className="flex space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center ${
              isLiked ? "text-red-500" : "text-gray-600 hover:text-red-500"
            } transition-colors duration-200 cursor-pointer`}
          >
            <Heart
              className={`h-5 w-5 mr-1 ${isLiked ? "fill-current" : ""}`}
            />
            <span>{likeCount}</span>
          </button>
          <button
            onClick={() =>
              document
                .getElementById("comments-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
          >
            <MessageCircle className="h-5 w-5 mr-1" />
            <span>{comments.length}</span>
          </button>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleBookmark}
            className={`flex items-center ${
              isBookmarked
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            } transition-colors duration-200 cursor-pointer`}
          >
            <Bookmark
              className={`h-5 w-5 mr-1 ${isBookmarked ? "fill-current" : ""}`}
            />
            <span>Save</span>
          </button>
          <button
            onClick={() => setShowShareOptions(!showShareOptions)}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
          >
            <Share2 className="h-5 w-5 mr-1" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Author bio */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="h-12 w-12 rounded-full mr-4"
          />
          <div>
            <h3 className="font-bold text-lg text-gray-900">
              {post.author.name}
            </h3>
            <p className="text-sm text-gray-600">{post.author.role}</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4">{post.author.bio}</p>
        <div className="flex space-x-4">
          <a
            href="#"
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a
            href="#"
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="#"
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>

      {/* Related articles would go here */}

      {/* Comments section */}
      <section id="comments-section" className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          Comments ({comments.length})
        </h2>

        {/* Comment form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-medium mb-4">Leave a comment</h3>
          {isSignedIn ? (
            <div>
              <div className="flex items-center mb-4">
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="h-10 w-10 rounded-full mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">
                    {currentUser?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Commenting as {currentUser?.role}
                  </div>
                </div>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                rows={4}
              ></textarea>
              <div className="flex justify-end">
                <button
                  onClick={handleSubmitComment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center cursor-pointer"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Post Comment
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">
                You need to sign in to leave a comment.
              </p>
              <button
                onClick={() => setIsSignInModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
              >
                Sign In to Comment
              </button>
            </div>
          )}
        </div>

        {/* Comments list */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <img
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className="h-10 w-10 rounded-full mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">
                    {comment.author.name}
                  </div>
                  <div className="text-sm text-gray-500">{comment.date}</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{comment.content}</p>
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() =>
                    setReplyingTo(replyingTo === comment.id ? null : comment.id)
                  }
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
                >
                  Reply
                </button>
                <div className="flex items-center">
                  <button
                    onClick={() => handleCommentLike(comment.id)}
                    className={`text-gray-500 transition-colors duration-200 ${
                      likedComments.has(comment.id)
                        ? "text-red-500"
                        : "hover:text-red-500 text-gray-600"
                    } cursor-pointer`}
                  >
                    <Heart
                      className={`h-4 w-4 mr-1 ${
                        likedComments.has(comment.id) ? "fill-current" : ""
                      }`}
                    />
                  </button>
                  <span className="text-gray-500 text-sm ml-1">
                    {comment.likes}
                  </span>
                </div>
              </div>

              {/* Conditionally render a reply box - MOVED AND RESTYLED */}
              {replyingTo === comment.id && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                    placeholder={`Replying to ${comment.author.name}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center text-sm font-medium cursor-pointer"
                      onClick={() => {
                        if (!currentUser) {
                          setIsSignInModalOpen(true);
                          return;
                        }
                        if (!replyText.trim()) {
                          showToast("Reply cannot be empty.", "error");
                          return;
                        }
                        // append a new reply to this comment
                        setComments((prev) =>
                          prev.map((c) =>
                            c.id === comment.id
                              ? {
                                  ...c,
                                  replies: [
                                    ...(c.replies || []),
                                    {
                                      id: `reply-${Date.now()}`,
                                      author: currentUser!,
                                      content: replyText,
                                      postId: post.id,
                                      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                                      likes: 0,
                                    },
                                  ],
                                }
                              : c
                          )
                        );
                        setReplyText("");
                        setReplyingTo(null);
                      }}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Post Reply
                    </button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 pl-6 border-l-2 border-gray-100">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="mt-4">
                      <div className="flex items-center mb-2">
                        <img
                          src={reply.author.avatar}
                          alt={reply.author.name}
                          className="h-8 w-8 rounded-full mr-2"
                        />
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {reply.author.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {reply.date}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">
                        {reply.content}
                      </p>
                      {/* Add Like button for reply */}
                      <div className="flex items-center">
                        <button
                          onClick={() => handleReplyLike(reply.id, comment.id)}
                          className={`text-gray-500 transition-colors duration-200 ${
                            likedComments.has(reply.id)
                              ? "text-red-500"
                              : "hover:text-red-500 text-gray-600"
                          } cursor-pointer flex items-center text-xs`}
                        >
                          <Heart
                            className={`h-3 w-3 mr-1 ${
                              likedComments.has(reply.id) ? "fill-current" : ""
                            }`}
                          />
                           {reply.likes}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ModernBlogApp;

// Zod Schema
export const Schema = {
    "commentary": "Creating a modern blog website interface using Next.js and TypeScript.",
    "template": "nextjs-developer",
    "title": "Modern Blog Interface",
    "description": "A modern blog website interface to share thoughts.",
    "additional_dependencies": [
        "lucide-react"
    ],
    "has_additional_dependencies": true,
    "install_dependencies_command": "npm install lucide-react",
    "port": 3000,
    "file_path": "pages/index.tsx",
    "code": "<see code above>"
}