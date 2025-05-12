"use client";
import { useState, useEffect } from "react";
import {
  Home,
  User,
  MessageCircle,
  Search,
  Moon,
  Sun,
  Heart,
  MessageSquare,
  Image as ImageIcon,
  Send,
  X,
} from "lucide-react";
import { Poppins } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], 
  display: 'swap',
});


interface UserType {
  id: number | string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  role?: string;
  company?: string;
  location?: string;
  experience?: {
    role: string;
    company: string;
    duration: string;
  }[];
  following?: boolean;
  followsYou?: boolean;
  posts?: number;
  followers?: number;
  following_count?: number;
}

interface ReactionType {
  "👍"?: number;
  "❤️"?: number;
  "😂"?: number;
  "😮"?: number;
  "😢"?: number;
  "😠"?: number;
  [key: string]: number | undefined;
}

interface CommentType {
  id: number;
  userId: number | string;
  content: string;
  time: string;
}

interface PostType {
  id: number;
  userId: number | string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  commentsList?: CommentType[];
  time: string;
  liked: boolean;
  reactions: ReactionType;
  userReaction: string | null;
  isEditing?: boolean;
  showComments?: boolean;
}

interface MessageType {
  id: number;
  sender: number | string;
  content: string;
  time: string;
  read: boolean;
  image?: string;
}

interface ChatType {
  id: number;
  userId: number;
  messages: MessageType[];
}

const initialUsers = [
  {
    id: 1,
    name: "David Chen",
    username: "@davidc",
    avatar: "https://media.istockphoto.com/id/1369199360/photo/portrait-of-a-handsome-young-businessman-working-in-office.webp?a=1&b=1&s=612x612&w=0&k=20&c=bcGyGG1qPMyxl3rw4TCVwbJLZTPabFg4twsVFDy-ixs=",
    bio: "Senior Software Engineer @Google | Previously @Microsoft",
    role: "Software Engineer",
    company: "Google",
    location: "San Francisco, CA",
    experience: [
      {
        role: "Senior Software Engineer",
        company: "Google",
        duration: "2020 - Present"
      },
      {
        role: "Software Engineer",
        company: "Microsoft",
        duration: "2017 - 2020"
      }
    ],
    following: false,
    posts: 42,
    followers: 124,
    following_count: 98,
  },
  {
    id: 2,
    name: "Sarah Parker",
    username: "@sarahp",
    avatar: "https://images.unsplash.com/photo-1602233158242-3ba0ac4d2167?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8R2lybHxlbnwwfHwwfHx8MA%3D%3D",
    bio: "Product Designer @Apple | Design Systems Enthusiast",
    role: "Product Designer", 
    company: "Apple",
    location: "Cupertino, CA",
    experience: [
      {
        role: "Senior Product Designer",
        company: "Apple",
        duration: "2019 - Present"
      },
      {
        role: "UX Designer",
        company: "Twitter",
        duration: "2016 - 2019"
      }
    ],
    following: true,
    posts: 67,
    followers: 230,
    following_count: 115,
  },
  {
    id: 3,
    name: "Michael",
    username: "@michaelt",
    avatar: "https://images.unsplash.com/photo-1742518424556-839a9846adee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8SGFuZHNvbWUlMjBndXl8ZW58MHx8MHx8fDA%3D",
    bio: "Tech Lead @Netflix | Cloud Architecture & Distributed Systems",
    role: "Technical Lead",
    company: "Netflix",
    location: "Los Angeles, CA",
    experience: [
      {
        role: "Technical Lead",
        company: "Netflix",
        duration: "2021 - Present"
      },
      {
        role: "Senior Developer",
        company: "Amazon",
        duration: "2018 - 2021"
      }
    ],
    following: false,
    posts: 28,
    followers: 89,
    following_count: 102,
  },
];

const initialPosts: PostType[] = [
  {
    id: 1,
    userId: 1,
    content:
      "Just finished my morning meditation at google. Starting the day with clarity and purpose makes all the difference.",
    image:
      "https://images.unsplash.com/photo-1551808525-51a94da548ce?q=80&w=2007&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    likes: 24,
    comments: 2,
    commentsList: [
      {
        id: 1,
        userId: 2,
        content: "This is so inspiring! I need to start doing this.",
        time: "1h ago",
      },
      {
        id: 2,
        userId: 3,
        content: "Morning meditation changed my life too!",
        time: "30m ago",
      },
    ],
    time: "2h ago",
    liked: false,
    reactions: {
      "👍": 15,
      "❤️": 8,
      "😂": 3,
    },
    userReaction: null,
    showComments: false,
  },
  {
    id: 2,
    userId: 2,
    content:
      "Writing at my favorite café today. There is something magical about the ambient noise that boosts creativity.",
    image:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FmZXxlbnwwfHwwfHx8MA%3D%3D",
    likes: 42,
    comments: 1,
    commentsList: [
      {
        id: 1,
        userId: 3,
        content: "Which café is this? Looks amazing!",
        time: "3h ago",
      },
    ],
    time: "4h ago",
    liked: true,
    reactions: {
      "👍": 24,
      "❤️": 12,
      "😂": 6,
    },
    userReaction: "❤️",
    showComments: false,
  },
  {
    id: 3,
    userId: 3,
    content:
      "Excited to share my latest project! Building tech that helps people connect more meaningfully.",
    likes: 18,
    comments: 0,
    commentsList: [],
    time: "1d ago",
    liked: false,
    reactions: {
      "👍": 10,
      "❤️": 5,
      "😂": 3,
    },
    userReaction: null,
    showComments: false,
  },
];

const initialChats: ChatType[] = [
  {
    id: 1,
    userId: 1,
    messages: [
      {
        id: 1,
        sender: 1,
        content: "Hey, how are you doing today?",
        time: "10:30 AM",
        read: false,
      },
      {
        id: 2,
        sender: "me",
        content: "Doing well, thanks! Just working on a new project.",
        time: "10:35 AM",
        read: true,
      },
      {
        id: 3,
        sender: 1,
        content: "That sounds exciting! What kind of project?",
        time: "10:38 AM",
        read: false,
      },
    ],
  },
  {
    id: 2,
    userId: 2,
    messages: [
      {
        id: 1,
        sender: 2,
        content: "Loved your recent post about mindfulness!",
        time: "9:15 AM",
        read: true,
      },
      {
        id: 2,
        sender: "me",
        content: "Thanks Maya! Been practicing daily meditation.",
        time: "9:20 AM",
        read: true,
        image:
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 3,
        sender: 2,
        content: "This is beautiful! Where do you usually meditate?",
        time: "9:25 AM",
        read: false,
      },
      {
        id: 4,
        sender: "me",
        content: "",
        time: "9:30 AM",
        read: true,
        image:
          "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3VucmlzZXxlbnwwfHwwfHx8MA%3D%3D",
      },
    ],
  },
  {
    id: 3,
    userId: 3,
    messages: [
      {
        id: 1,
        sender: 3,
        content: "Are you attending the tech conference next week?",
        time: "Yesterday",
        read: false,
      },
      {
        id: 2,
        sender: "me",
        content: "Yes, I will be there! Looking forward to it.",
        time: "Yesterday",
        read: true,
      },
    ],
  },
];

const reactionEmojis = ["👍", "❤️", "😂", "😮", "😢", "😠"];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState("home");
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [posts, setPosts] = useState<PostType[]>(initialPosts);
  const [chats, setChats] = useState<ChatType[]>(initialChats);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newPost, setNewPost] = useState("");
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [newMessageImage, setNewMessageImage] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [currentUser] = useState<UserType>({
    id: "me",
    name: "You",
    username: "@you",
    avatar:
      "https://images.unsplash.com/photo-1599144065776-ea8ed38cb56e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fEhuYWRzb21lJTIwZ3V5fGVufDB8fDB8fHww",
  });
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editPostContent, setEditPostContent] = useState("");
  const [showPostOptions, setShowPostOptions] = useState<number | null>(null);
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [scrolled, setScrolled] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [mounted, setMounted] = useState(false);
  

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  useEffect(() => {
    setUsers(
      users.map((user) => {
        return { ...user, followsYou: user.id === 2 };
      })
    );
  }, []);

  const toggleFollow = (userId: number | string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, following: !user.following } : user
      )
    );
  };

  const toggleLike = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  const sendMessage = () => {
    if (newMessage.trim() === "" && !newMessageImage) return;

    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChat) {
        return {
          ...chat,
          messages: [
            ...chat.messages,
            {
              id: chat.messages.length + 1,
              sender: "me",
              content: newMessage,
              image: newMessageImage || undefined,
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              read: true,
            } as MessageType,
          ],
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setNewMessage("");
    setNewMessageImage(null);
  };

  const createPost = () => {
    if (newPost.trim() === "" && !newPostImage) return;

    const newPostObj: PostType = {
      id: posts.length + 1,
      userId: "me",
      content: newPost,
      image: newPostImage || undefined,
      likes: 0,
      comments: 0,
      commentsList: [],
      time: "Just now",
      liked: false,
      reactions: {},
      userReaction: null,
      showComments: false,
    };

    setPosts([newPostObj, ...posts]);
    setNewPost("");
    setNewPostImage(null);
  };

  const toggleComments = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            showComments: !post.showComments,
          };
        }
        return post;
      })
    );
  };

  const addComment = (postId: number) => {
    const commentContent = newComment[postId];
    if (!commentContent || commentContent.trim() === "") return;

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const newCommentObj: CommentType = {
            id: (post.commentsList?.length || 0) + 1,
            userId: "me",
            content: commentContent,
            time: "Just now",
          };

          return {
            ...post,
            comments: post.comments + 1,
            commentsList: [...(post.commentsList || []), newCommentObj],
          };
        }
        return post;
      })
    );

    setNewComment({ ...newComment, [postId]: "" });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeUploadedImage = () => {
    setNewPostImage(null);
  };

  const getUserById = (userId: string | number): UserType => {
    if (userId === "me") return currentUser;
    return (
      users.find((user) => user.id === userId) || {
        id: 0,
        name: "Unknown",
        username: "@unknown",
        avatar: "",
      }
    );
  };

  const openUserProfile = (userId: string | number) => {
    const user = getUserById(userId);
    setSelectedUser(userId === "me" ? null : user);
    setShowProfileModal(true);
  };

  const addReaction = (postId: number, emoji: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const updatedReactions = { ...post.reactions };
  
          if (post.userReaction === emoji) {
            updatedReactions[emoji] = Math.max(0, (updatedReactions[emoji] || 0) - 1);
            return {
              ...post,
              userReaction: null,
              reactions: updatedReactions,
            };
          } else {
            if (post.userReaction) {
              updatedReactions[post.userReaction] = Math.max(
                0,
                (updatedReactions[post.userReaction] || 0) - 1
              );
            }
            updatedReactions[emoji] = (updatedReactions[emoji] || 0) + 1;
            return {
              ...post,
              userReaction: emoji,
              reactions: updatedReactions,
            };
          }
        }
        return post;
      })
    );
  };
  

  const getTotalReactions = (reactions: ReactionType): number => {
    return Object.values(reactions).reduce(
      (sum: number, count) => sum + (count || 0),
      0
    );
  };

  const getReactionSummary = (reactions: ReactionType): string => {
    const total = getTotalReactions(reactions);
    if (total === 0) return "0 reactions";

    const emojis = Object.keys(reactions).filter(
      (emoji) => reactions[emoji] && reactions[emoji]! > 0
    );
    return `${emojis.slice(0, 3).join(" ")} ${total} reactions`;
  };

  const startEditingPost = (post: PostType) => {
    setEditingPostId(post.id);
    setEditPostContent(post.content);
  };

  const saveEditedPost = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            content: editPostContent,
          };
        }
        return post;
      })
    );
    setEditingPostId(null);
    setEditPostContent("");
  };

  const cancelEditingPost = () => {
    setEditingPostId(null);
    setEditPostContent("");
  };

  const deletePost = (postId: number) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const isFollowing = (userId: number | string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.following : false;
  };

  const getFollowers = () => {
    return users.filter((user) => user.followsYou);
  };

  const getFollowing = () => {
    return users.filter((user) => user.following);
  };

  const markMessagesAsRead = (chatId: number) => {
    setChats(
      chats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: chat.messages.map((message) => ({
              ...message,
              read: true,
            })),
          };
        }
        return chat;
      })
    );
  };

  const hasUnreadMessages = (chatId: number): boolean => {
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return false;

    return chat.messages.some(
      (message) => message.sender !== "me" && !message.read
    );
  };

  const getUnreadCount = (chatId: number): number => {
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return 0;

    return chat.messages.filter(
      (message) => message.sender !== "me" && !message.read
    ).length;
  };

  const handleMessageImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMessageImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMessageImage = () => {
    setNewMessageImage(null);
  };
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; 

  const ProfileModal = () => {
    if (!showProfileModal) return null;

    useEffect(() => {
      // Prevent scrolling on the background when modal is open
      document.body.style.overflow = 'hidden';
      
      // Re-enable scrolling when modal is closed
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, []);

    const userToShow = selectedUser || currentUser;

    return (
      <AnimatePresence>
        {showProfileModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-white/10 backdrop-blur-md"
              onClick={() => {
                setShowProfileModal(false);
                setSelectedUser(null);
              }}
            ></motion.div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={`relative max-w-lg w-full mx-auto rounded-xl shadow-2xl overflow-hidden transition-all transform ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <button 
                onClick={() => {
                  setShowProfileModal(false);
                  setSelectedUser(null);
                }}
                className="absolute top-4 right-4 cursor-pointer p-1 rounded-full text-black hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
              >
                <X size={24} />
              </button>
              
              <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <div className="p-6 relative">
                <div className="absolute -top-10 left-6 w-20 h-20 rounded-full border-4 overflow-hidden bg-white border-white">
                  <img
                    src={userToShow.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-12">
                  <h2 className="text-xl font-bold">{userToShow.name}</h2>
                  <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {userToShow.username}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">
                    {userToShow.bio || "Digital creator and positive vibes spreader. Mindfulness advocate."}
                  </p>
                  <div className="flex gap-4 mt-3">
                    <div>
                      <span className="font-bold">
                        {userToShow.id === "me" 
                          ? posts.filter(post => post.userId === "me").length 
                          : userToShow.posts || 0}
                      </span>{" "}
                      <span className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Posts
                      </span>
                    </div>
                    <div>
                      <span className="font-bold">
                        {userToShow.id === "me" 
                          ? getFollowers().length 
                          : userToShow.followers || 0}
                      </span>{" "}
                      <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Followers
                      </span>
                    </div>
                    <div>
                      <span className="font-bold">
                        {userToShow.id === "me" 
                          ? getFollowing().length 
                          : userToShow.following_count || 0}
                      </span>{" "}
                      <span className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Following
                      </span>
                    </div>
                  </div>
                  
                  {userToShow.id !== "me" && (
                    <div className="mt-4">
                      <button
                        onClick={() => toggleFollow(userToShow.id)}
                        className={`px-4 py-2 rounded-full cursor-pointer font-medium transition-all ${
                          isFollowing(userToShow.id)
                            ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                        }`}
                      >
                        {isFollowing(userToShow.id) ? "Following" : "Follow"}
                      </button>
                    </div>
                  )}
                </div>
                
                {userToShow.id === "me" && (
                  <>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                        <h3 className="font-semibold mb-2">Followers</h3>
                        <div className="space-y-2 max-h-[200px] overflow-auto scrollbar-hide">
                          {getFollowers().length > 0 ? (
                            getFollowers().map(user => (
                              <div key={user.id} className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                  <img 
                                    src={user.avatar} 
                                    alt={user.name} 
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                                <span>{user.name}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">No followers yet</p>
                          )}
                        </div>
                      </div>
                      
                      <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                        <h3 className="font-semibold mb-2">Following</h3>
                        <div className="space-y-2 max-h-[200px] overflow-auto scrollbar-hide">
                          {getFollowing().length > 0 ? (
                            getFollowing().map(user => (
                              <div key={user.id} className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                  <img 
                                    src={user.avatar} 
                                    alt={user.name} 
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                                <span>{user.name}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">Not following anyone yet</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Settings</h3>
                      <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                        <div className="flex items-center justify-between">
                          <span>Dark Mode</span>
                          <button
                            onClick={toggleDarkMode}
                            className={`w-12 h-6 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out ${
                              darkMode
                                ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                                : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                                darkMode ? "translate-x-6" : "translate-x-0"
                              }`}
                            ></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };
 



  return (
    <div
      className={`min-h-screen flex flex-col ${poppins.className} ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <header
        className={`fixed top-0 w-full z-10 py-3 backdrop-blur-md transition-all duration-300 ${
          darkMode
            ? scrolled
              ? "bg-gray-900/30 shadow-md"
              : "bg-gray-900"
            : scrolled
            ? "bg-white/20 shadow-md"
            : "bg-white"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 flex justify-between items-center">
          <h1
            onClick={() => setPage("home")}
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent cursor-pointer transition-transform hover:scale-105"
          >
            Experiences
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full cursor-pointer text-indigo-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div
              className="w-8 h-8 rounded-full overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all"
              onClick={() => {
                setSelectedUser(null);
                if (window.innerWidth >= 1024) {
                  setShowProfileModal(true);
                } else {
                  setPage("profile");
                }
              }}
            >
              <img
                src={currentUser.avatar}
                alt="Your profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="pt-16 pb-16 sm:pb-0 px-2 sm:px-4">
        {page === "home" && (
          <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row px-0 sm:px-4 py-4 gap-4">
            <div className="hidden sm:block w-full lg:w-1/5 order-2 lg:order-1 lg:sticky lg:top-20 self-start overflow-y-auto max-h-[calc(100vh-6rem)] scrollbar-hide">
              <div
                className={`rounded-lg ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } shadow mb-4 overflow-hidden transition-all hover:shadow-lg`}
              >
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center text-white font-bold border-2 border-indigo-500">
                      <img
                        src={currentUser.avatar}
                        alt="Your profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">You</h2>
                      <p
                        className={`${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        @you
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex justify-around mb-4 p-4 rounded-lg ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {getFollowers().length}
                      </p>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Followers
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {getFollowing().length}
                      </p>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Following
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div
                      className={`rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      } overflow-hidden transition-all hover:bg-opacity-90`}
                    >
                      <button
                        onClick={() => setShowFollowers(!showFollowers)}
                        className="flex items-center justify-between w-full p-4 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          <span className="font-medium">Followers</span>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 transform ${
                            showFollowers ? "rotate-180" : ""
                          } transition-transform`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      {showFollowers && (
                        <div className="px-4 pb-4">
                          <div className="space-y-2 max-h-[200px] overflow-auto scrollbar-hide">
                            {getFollowers().map((user) => (
                              <div
                                key={user.id}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                                    onClick={() => openUserProfile(user.id)}
                                  >
                                    <img
                                      src={user.avatar}
                                      alt={user.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p 
                                      className="font-medium text-sm cursor-pointer hover:underline"
                                      onClick={() => openUserProfile(user.id)}
                                    >
                                      {user.name}
                                    </p>
                                    <p
                                      className={`text-xs ${
                                        darkMode
                                          ? "text-gray-400"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      {user.username}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {getFollowers().length === 0 && (
                              <p className="text-sm text-gray-500">
                                No followers yet
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      className={`rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      } overflow-hidden transition-all hover:bg-opacity-90`}
                    >
                      <button
                        onClick={() => setShowFollowing(!showFollowing)}
                        className="flex items-center justify-between w-full p-4 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                          </svg>
                          <span className="font-medium">Following</span>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 transform ${
                            showFollowing ? "rotate-180" : ""
                          } transition-transform`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      {showFollowing && (
                        <div className="px-4 pb-4">
                          <div className="space-y-2 max-h-[200px] overflow-auto scrollbar-hide">
                            {getFollowing().map((user) => (
                              <div
                                key={user.id}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                                    onClick={() => openUserProfile(user.id)}
                                  >
                                    <img
                                      src={user.avatar}
                                      alt={user.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p 
                                      className="font-medium text-sm cursor-pointer hover:underline"
                                      onClick={() => openUserProfile(user.id)}
                                    >
                                      {user.name}
                                    </p>
                                    <p
                                      className={`text-xs ${
                                        darkMode
                                          ? "text-gray-400"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      {user.username}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleFollow(user.id)}
                                  className={`px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800 cursor-pointer hover:bg-gray-300 transition-colors`}
                                >
                                  Unfollow
                                </button>
                              </div>
                            ))}
                            {getFollowing().length === 0 && (
                              <p className="text-sm text-gray-500">
                                Not following anyone yet
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      className={`rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      } overflow-hidden transition-all hover:bg-opacity-90`}
                    >
                      <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="flex items-center justify-between w-full p-4 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="font-medium">Settings</span>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 transform ${
                            showSettings ? "rotate-180" : ""
                          } transition-transform`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      {showSettings && (
                        <div className="px-4 pb-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <span>Dark Mode</span>
                            <button
                              onClick={toggleDarkMode}
                              className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                                darkMode
                                  ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                                  : "bg-gray-300"
                              }`}
                            >
                              <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                                  darkMode ? "translate-x-6" : "translate-x-0"
                                }`}
                              ></div>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-lg ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } shadow p-4 transition-all hover:shadow-lg overflow-auto max-h-[300px] scrollbar-hide`}
              >
                <h3 className="font-bold mb-3">Suggested for you</h3>
                <div className="space-y-3">
                  {users
                    .filter((user) => !user.following)
                    .slice(0, 3)
                    .map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
                            onClick={() => openUserProfile(user.id)}
                          >
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p 
                              className="font-medium cursor-pointer hover:underline"
                              onClick={() => openUserProfile(user.id)}
                            >
                              {user.name}
                            </p>
                            <p
                              className={`text-xs ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {user.username}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFollow(user.id)}
                          className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all ${
                            user.following
                              ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                              : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                          }`}
                        >
                          {user.following ? "Following" : "Follow"}
                        </button>
                      </div>
                    ))}
                  {users.filter((user) => !user.following).length === 0 && (
                    <p className="text-sm text-gray-500">
                      No suggestions available
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-3/5 order-1 lg:order-2 self-start overflow-y-auto max-h-[calc(100vh-6rem)] scrollbar-hide">
              <div
                className={`p-4 mb-4 rounded-lg ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } shadow transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={currentUser.avatar}
                      alt="Your profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <textarea
                      className={`w-full p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-base ${
                        darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                      placeholder="What's on your mind?"
                      rows={3}
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                    ></textarea>

                    {newPostImage && (
                      <div className="relative mt-2 rounded-lg overflow-hidden h-40">
                        <img
                          src={newPostImage}
                          alt="Upload preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={removeUploadedImage}
                          className="absolute top-2 right-2 p-1 rounded-full bg-gray-800 bg-opacity-70 text-white hover:bg-opacity-90 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-2">
                      <label
                        className={`p-2 rounded-full ${
                          darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-600 hover:bg-gray-100"
                        } cursor-pointer transition-colors`}
                      >
                        <ImageIcon size={20} />
                        <input
                          type="file"
                          className="hidden p-2"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <button
                        onClick={createPost}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full font-medium cursor-pointer transition-all transform hover:scale-105 text-sm"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {posts.map((post) => {
                  const postUser = getUserById(post.userId);
                  const isCurrentUserPost = post.userId === "me";
                  const isEditing = post.id === editingPostId;
                  const totalReactions = getTotalReactions(post.reactions);

                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`w-full p-4 rounded-lg ${
                        darkMode ? "bg-gray-800" : "bg-white"
                      } shadow transition-all hover:shadow-md`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all"
                            onClick={() => openUserProfile(post.userId)}
                          >
                            <img
                              src={postUser.avatar}
                              alt={postUser.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div
                              className="font-medium cursor-pointer hover:underline"
                              onClick={() => openUserProfile(post.userId)}
                            >
                              {postUser.name}
                            </div>
                            <div
                              className={`text-xs ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {post.time}
                            </div>
                          </div>
                        </div>

                        {!isCurrentUserPost && (
                          <button
                            onClick={() => toggleFollow(post.userId)}
                            className={`px-3 py-1 cursor-pointer rounded-full text-sm font-medium transition-colors ${
                              isFollowing(post.userId)
                                ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                            }`}
                          >
                            {isFollowing(post.userId) ? "Following" : "Follow"}
                          </button>
                        )}

                        {isCurrentUserPost && (
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowPostOptions(
                                  showPostOptions === post.id ? null : post.id
                                );
                              }}
                              className={`p-1 rounded-full ${
                                darkMode
                                  ? "hover:bg-gray-700"
                                  : "hover:bg-gray-200"
                              } transition-colors`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                              </svg>
                            </button>
                            {showPostOptions === post.id && (
                              <div
                                className={`absolute right-0 mt-1 w-40 rounded-md shadow-lg z-10 ${
                                  darkMode ? "bg-gray-700" : "bg-white"
                                }`}
                              >
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      startEditingPost(post);
                                      setShowPostOptions(null);
                                    }}
                                    className="flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 mr-2"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      deletePost(post.id);
                                      setShowPostOptions(null);
                                    }}
                                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 mr-2"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {post.id === editingPostId ? (
                        <div className="mb-3">
                          <textarea
                            className={`w-full p-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                              darkMode
                                ? "bg-gray-700 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                            rows={3}
                            value={editPostContent}
                            onChange={(e) =>
                              setEditPostContent(e.target.value)
                            }
                          ></textarea>
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={cancelEditingPost}
                              className="px-3 py-1 rounded text-sm bg-gray-300 text-gray-800 cursor-pointer hover:bg-gray-400 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => saveEditedPost(post.id)}
                              className="px-3 py-1 rounded text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white cursor-pointer transition-colors"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="mb-3 break-words text-base leading-relaxed">{post.content}</p>
                      )}

                      {post.image && (
                        <div className="mb-3 rounded-lg overflow-hidden max-h-[50vh]">
                          <img
                            src={post.image}
                            alt="Post"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {totalReactions > 0 && (
                        <div
                          className={`flex items-center mb-2 text-sm ${
                            darkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          <div className="flex mr-2">
                            {Object.keys(post.reactions)
                              .filter(
                                (emoji) =>
                                  post.reactions[emoji] &&
                                  post.reactions[emoji]! > 0
                              )
                              .slice(0, 3)
                              .map((emoji) => (
                                <span key={emoji} className="mr-1">
                                  {emoji}
                                </span>
                              ))}
                          </div>
                          <span>{totalReactions} reactions</span>
                        </div>
                      )}

                      <div
                        className={`flex border-t ${
                          darkMode
                            ? "bg-gray-800 border-gray-600"
                            : "bg-white border-gray-200"
                        } rounded py-2 mb-2`}
                      >
                        <div className="flex justify-between w-full md:px-2 px-0">
                          <motion.button
                            onClick={() => addReaction(post.id, "👍")}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`flex items-center justify-center py-1 px-1 md:px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              post.userReaction === "👍" 
                                ? `${darkMode ? "bg-indigo-900/30" : "bg-indigo-50"}`
                                : ""
                            }`}
                          >
                            <span className="text-xl">👍</span>
                          </motion.button>
                          <motion.button
                            onClick={() => addReaction(post.id, "❤️")}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`flex items-center justify-center py-1 px-1 md:px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              post.userReaction === "❤️" 
                                ? `${darkMode ? "bg-indigo-900/30" : "bg-indigo-50"}`
                                : ""
                            }`}
                          >
                            <span className="text-xl">❤️</span>
                          </motion.button>
                          <motion.button
                            onClick={() => addReaction(post.id, "😂")}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`flex items-center justify-center py-1 px-1 md:px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              post.userReaction === "😂" 
                                ? `${darkMode ? "bg-indigo-900/30" : "bg-indigo-50"}`
                                : ""
                            }`}
                          >
                            <span className="text-xl">😂</span>
                          </motion.button>
                          <motion.button
                            onClick={() => addReaction(post.id, "😮")}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`flex items-center justify-center py-1 px-1 md:px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              post.userReaction === "😮" 
                                ? `${darkMode ? "bg-indigo-900/30" : "bg-indigo-50"}`
                                : ""
                            }`}
                          >
                            <span className="text-xl">😮</span>
                          </motion.button>
                          <motion.button
                            onClick={() => addReaction(post.id, "😢")}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`flex items-center justify-center py-1 px-1 md:px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              post.userReaction === "😢" 
                                ? `${darkMode ? "bg-indigo-900/30" : "bg-indigo-50"}`
                                : ""
                            }`}
                          >
                            <span className="text-xl">😢</span>
                          </motion.button>
                          <motion.button
                            onClick={() => addReaction(post.id, "😠")}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`flex items-center justify-center py-1 px-1 md:px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              post.userReaction === "😠" 
                                ? `${darkMode ? "bg-indigo-900/30" : "bg-indigo-50"}`
                                : ""
                            }`}
                          >
                            <span className="text-xl">😠</span>
                          </motion.button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-3">
                        <div
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {post.comments > 0
                            ? `${post.comments} comments`
                            : "0 comments"}
                        </div>
                        <button
                          onClick={() => toggleComments(post.id)}
                          className="flex items-center gap-1 cursor-pointer hover:text-indigo-500 transition-colors"
                        >
                          <MessageSquare
                            size={18}
                            className={`${
                              darkMode ? "text-gray-300" : "text-gray-600"
                            } mr-1`}
                          />
                          <span>{post.comments}</span>
                        </button>
                      </div>

                      {post.showComments && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`mt-3 pt-3 border-t ${
                            darkMode ? "border-gray-700" : "border-gray-200"
                          }`}
                        >
                          <div className="space-y-3 mb-3">
                            {post.commentsList &&
                            post.commentsList.length > 0 ? (
                              post.commentsList.map((comment) => {
                                const commentUser = getUserById(
                                  comment.userId
                                );
                                return (
                                  <div
                                    key={comment.id}
                                    className="flex gap-2"
                                  >
                                    <div 
                                      className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 cursor-pointer"
                                      onClick={() => openUserProfile(comment.userId)}
                                    >
                                      <img
                                        src={commentUser.avatar}
                                        alt={commentUser.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div
                                      className={`flex-1 p-2 rounded-lg ${
                                        darkMode
                                          ? "bg-gray-700"
                                          : "bg-gray-100"
                                      }`}
                                    >
                                      <div className="flex justify-between items-start">
                                        <span 
                                          className="font-medium cursor-pointer hover:underline"
                                          onClick={() => openUserProfile(comment.userId)}
                                        >
                                          {commentUser.name}
                                        </span>
                                        <span
                                          className={`text-xs ${
                                            darkMode
                                              ? "text-gray-400"
                                              : "text-gray-500"
                                          }`}
                                        >
                                          {comment.time}
                                        </span>
                                      </div>
                                      <p className="text-sm mt-1 break-words leading-relaxed">
                                        {comment.content}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-sm text-center text-gray-500">
                                No comments yet. Be the first to comment!
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                              <img
                                src={currentUser.avatar}
                                alt={currentUser.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  className={`flex-1 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                                    darkMode
                                      ? "bg-gray-700 text-white"
                                      : "bg-gray-100 text-gray-900"
                                  }`}
                                  placeholder="Write a comment..."
                                  value={newComment[post.id] || ""}
                                  onChange={(e) =>
                                    setNewComment({
                                      ...newComment,
                                      [post.id]: e.target.value,
                                    })
                                  }
                                  onKeyPress={(e) =>
                                    e.key === "Enter" && addComment(post.id)
                                  }
                                />
                                <button
                                  disabled={!newComment[post.id]?.trim()}
                                  onClick={() => addComment(post.id)}
                                  className="p-2 rounded-full cursor-pointer text-indigo-500 hover:text-indigo-600 disabled:opacity-50 transition-colors"
                                >
                                  <Send size={20} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="hidden lg:block lg:w-1/5 order-3 lg:sticky lg:top-20 self-start h-[calc(100vh-6rem)] overflow-hidden">
              <div
                className={`rounded-lg ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } shadow overflow-hidden transition-all hover:shadow-lg h-full flex flex-col`}
              >
                <div
                  className={`p-3 border-b flex items-center gap-1 ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className=" flex px-3 py-2">
                    <MessageCircle
                      size={24}
                      className={`${
                        darkMode ? "text-indigo-400" : "text-indigo-500"
                      } mr-1`}
                    />
                    <h3 className="font-bold text-lg">Messages</h3>
                  </div>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                  {!activeChat ? (
                    <div className="overflow-y-auto flex-1 scrollbar-hide min-h-[450px]">
                      <div className="space-y-1">
                        {chats.map((chat) => {
                          const chatUser = getUserById(chat.userId);
                          const lastMessage =
                            chat.messages[chat.messages.length - 1];
                          const hasUnread = hasUnreadMessages(chat.id);
                          const unreadCount = getUnreadCount(chat.id);
                          return (
                            <div
                              key={chat.id}
                              onClick={() => {
                                setActiveChat(chat.id);
                                markMessagesAsRead(chat.id);
                              }}
                              className={`py-2 px-3 flex items-center gap-3 cursor-pointer hover:bg-opacity-80 transition-colors ${
                                darkMode
                                  ? "hover:bg-gray-700"
                                  : "hover:bg-gray-100"
                              } ${
                                hasUnread
                                  ? darkMode
                                    ? "bg-indigo-900/20"
                                    : "bg-indigo-50"
                                  : ""
                              }`}
                            >
                              <div className="relative">
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                  <img
                                    src={chatUser.avatar}
                                    alt={chatUser.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                {hasUnread && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs">
                                    {unreadCount}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">
                                  {chatUser.name}
                                </div>
                                <div
                                  className={`text-sm truncate ${
                                    hasUnread ? "font-semibold" : ""
                                  } ${
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  {lastMessage.sender === "me" ? "You: " : ""}
                                  {lastMessage.content ||
                                    ("image" in lastMessage && lastMessage.image
                                      ? "[Image]"
                                      : "")}
                                </div>
                              </div>
                              <div
                                className={`text-xs ${
                                  hasUnread ? "font-bold text-indigo-500" : ""
                                } ${
                                  darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {lastMessage.time}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full">
                      <div
                        className={`p-3 border-b flex items-center gap-3 ${
                          darkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <button
                          onClick={() => setActiveChat(null)}
                          className={`p-1 rounded-full ${
                            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                          } transition-colors`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                        <div 
                          className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
                          onClick={() => openUserProfile(chats.find((c) => c.id === activeChat)?.userId || 0)}
                        >
                          <img
                            src={
                              getUserById(
                                chats.find((c) => c.id === activeChat)
                                  ?.userId || 0
                              ).avatar
                            }
                            alt="Contact"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div 
                          className="font-medium cursor-pointer hover:underline"
                          onClick={() => openUserProfile(chats.find((c) => c.id === activeChat)?.userId || 0)}
                        >
                          {
                            getUserById(
                              chats.find((c) => c.id === activeChat)?.userId ||
                                0
                            ).name
                          }
                        </div>
                      </div>

                      <div className="overflow-y-auto flex-1 scrollbar-hide min-h-[450px] p-3 space-y-2">
                        {chats
                          .find((c) => c.id === activeChat)
                          ?.messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${
                                message.sender === "me"
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-xs break-words rounded-lg p-2 text-sm ${
                                  message.sender === "me"
                                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-none"
                                    : darkMode
                                    ? "bg-gray-700 rounded-bl-none"
                                    : "bg-gray-200 rounded-bl-none"
                                }`}
                              >
                                {message.content && (
                                  <p className="mb-2 whitespace-pre-wrap break-words leading-relaxed">
                                    {message.content}
                                  </p>
                                )}
                                {message.image && (
                                  <div className="rounded-lg overflow-hidden mb-2">
                                    <img
                                      src={message.image}
                                      alt="Message attachment"
                                      className="w-full max-h-40 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                      onClick={() =>
                                        window.open(message.image, "_blank")
                                      }
                                    />
                                  </div>
                                )}
                                <div className="flex justify-between items-center">
                                  <div
                                    className={`text-xs mt-1 ${
                                      message.sender === "me"
                                        ? "text-indigo-100"
                                        : darkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {message.time}
                                  </div>
                                  {message.sender === "me" && (
                                    <div className="text-xs ml-2">
                                      {message.read ? (
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-3 w-3 text-indigo-100"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      ) : (
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-3 w-3 text-indigo-100"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path d="M10 2a8 8 0 100 16 8 8 0 000-16z" />
                                        </svg>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>

                      <div
                        className={`p-3 border-t ${
                          darkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        {newMessageImage && (
                          <div className="relative mb-3 rounded-lg overflow-hidden">
                            <img
                              src={newMessageImage}
                              alt="Message attachment"
                              className="w-full max-h-32 object-cover rounded-lg"
                            />
                            <button
                              onClick={removeMessageImage}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-800 bg-opacity-70 text-white cursor-pointer hover:bg-opacity-90 transition-opacity"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                        <div className="flex items-center gap-2 w-full overflow-hidden">
                          <label
                            className={`p-2 rounded-full ${
                              darkMode
                                ? "hover:bg-gray-700 text-gray-300"
                                : "hover:bg-gray-100 text-gray-600"
                            } cursor-pointer transition-colors`}
                          >
                            <ImageIcon size={20} />
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleMessageImageUpload}
                            />
                          </label>
                          <input
                            type="text"
                            className={`flex-1 p-2 outline-none rounded-full text-sm truncate min-w-0 transition-all ${
                              darkMode
                                ? "bg-gray-700 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && sendMessage()
                            }
                          />

                          <button
                            onClick={sendMessage}
                            disabled={newMessage.trim() === "" && !newMessageImage}
                            className="p-2 rounded-full cursor-pointer text-indigo-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                          >
                            <Send size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {page === "chat" && (
          <div className="w-full max-w-lg mx-auto px-2 sm:px-4 h-[calc(100vh-8rem)]">
            <div
              className={`h-full rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow overflow-hidden transition-all hover:shadow-md flex flex-col`}
            >
              <div
                className={`p-3 border-b flex items-center justify-between ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <h3 className="font-bold">Messages</h3>
              </div>

              <div className="flex-1 flex flex-col overflow-hidden">
                {!activeChat ? (
                  <div className="overflow-y-auto flex-1 scrollbar-hide">
                    <div className="space-y-1">
                      {chats.map((chat) => {
                        const chatUser = getUserById(chat.userId);
                        const lastMessage =
                          chat.messages[chat.messages.length - 1];
                        const hasUnread = hasUnreadMessages(chat.id);
                        const unreadCount = getUnreadCount(chat.id);

                        return (
                          <div
                            key={chat.id}
                            onClick={() => {
                              setActiveChat(chat.id);
                              markMessagesAsRead(chat.id);
                            }}
                            className={`py-3 px-4 flex items-center gap-3 cursor-pointer transition-colors ${
                              darkMode
                                ? "hover:bg-gray-700"
                                : "hover:bg-gray-100"
                            } ${
                              hasUnread
                                ? darkMode
                                  ? "bg-amber-900/20"
                                  : "bg-amber-50"
                                : ""
                            }`}
                          >
                            <div className="relative">
                              <div 
                                className="w-12 h-12 rounded-full overflow-hidden cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openUserProfile(chat.userId);
                                }}
                              >
                                <img
                                  src={chatUser.avatar}
                                  alt={chatUser.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {hasUnread && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs">
                                  {unreadCount}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div
                                className={`font-medium ${
                                  hasUnread ? "font-semibold" : ""
                                }`}
                              >
                                {chatUser.name}
                              </div>
                              <div
                                className={`text-sm truncate ${
                                  hasUnread ? "font-semibold" : ""
                                } ${
                                  darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {lastMessage.sender === "me" ? "You: " : ""}
                                {lastMessage.content ||
                                  ("image" in lastMessage && lastMessage.image
                                    ? "[Image]"
                                    : "")}
                              </div>
                            </div>
                            <div
                              className={`text-xs ${
                                hasUnread ? "font-bold text-indigo-500" : ""
                              } ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {lastMessage.time}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div
                      className={`p-3 border-b flex items-center gap-3 ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <button
                        onClick={() => setActiveChat(null)}
                        className={`p-1 rounded-full ${
                          darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        } transition-colors`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <div 
                        className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
                        onClick={() => openUserProfile(chats.find((c) => c.id === activeChat)?.userId || 0)}
                      >
                        <img
                          src={
                            getUserById(
                              chats.find((c) => c.id === activeChat)
                                ?.userId || 0
                            ).avatar
                          }
                          alt="Contact"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div 
                        className="font-medium cursor-pointer hover:underline"
                        onClick={() => openUserProfile(chats.find((c) => c.id === activeChat)?.userId || 0)}
                      >
                        {
                          getUserById(
                            chats.find((c) => c.id === activeChat)?.userId || 0
                          ).name
                        }
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide min-h-[450px]">
                      {chats
                        .find((c) => c.id === activeChat)
                        ?.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.sender === "me"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[75%] rounded-lg p-3 ${
                                message.sender === "me"
                                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-none"
                                  : darkMode
                                  ? "bg-gray-700 rounded-bl-none"
                                  : "bg-gray-200 rounded-bl-none"
                              }`}
                            >
                              {message.content && (
                                <p className="mb-2 break-words">
                                  {message.content}
                                </p>
                              )}
                              {message.image && (
                                <div className="rounded-lg overflow-hidden mb-2">
                                  <img
                                    src={message.image}
                                    alt="Message attachment"
                                    className="w-full max-h-60 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() =>
                                      window.open(message.image, "_blank")
                                    }
                                  />
                                </div>
                              )}
                              <div className="flex justify-between items-center">
                                <div
                                  className={`text-xs mt-1 ${
                                    message.sender === "me"
                                      ? "text-indigo-100"
                                      : darkMode
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {message.time}
                                </div>
                                {message.sender === "me" && (
                                  <div className="text-xs ml-2">
                                    {message.read ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3 text-indigo-100"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3 text-indigo-100"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16z" />
                                      </svg>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>

                    <div
                      className={`p-3 ${darkMode ? "bg-gray-800" : "bg-white"}`}
                    >
                      {newMessageImage && (
                        <div className="relative mb-3 rounded-lg overflow-hidden">
                          <img
                            src={newMessageImage}
                            alt="Message attachment"
                            className="w-full max-h-40 object-cover rounded-lg"
                          />
                          <button
                            onClick={removeMessageImage}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-800 bg-opacity-70 text-white cursor-pointer hover:bg-opacity-90 transition-opacity"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <label
                          className={`p-2 rounded-full ${
                            darkMode
                              ? "hover:bg-gray-700 text-gray-300"
                              : "hover:bg-gray-100 text-gray-600"
                          } cursor-pointer transition-colors`}
                        >
                          <ImageIcon size={20} />
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleMessageImageUpload}
                          />
                        </label>
                        <input
                          type="text"
                          className={`flex-1 p-2 outline-none rounded-full focus:ring-2 focus:ring-amber-500 transition-all ${
                            darkMode
                              ? "bg-gray-700 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button
                          onClick={sendMessage}
                          disabled={newMessage.trim() === "" && !newMessageImage}
                          className="p-2 rounded-full text-amber-500 cursor-pointer hover:text-amber-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                          <Send size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <nav
        className={`fixed bottom-0 w-full py-2 px-4 flex justify-around lg:hidden ${
          darkMode
            ? "bg-gray-800 border-t border-gray-700"
            : "bg-white border-t border-gray-200"
        } z-10`}
      >
        <button
          onClick={() => setPage("home")}
          className={`p-2 rounded-full cursor-pointer transition-colors ${
            page === "home"
              ? "text-indigo-500"
              : darkMode
              ? "text-gray-400 hover:text-gray-300"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Home size={24} />
        </button>
        <button
          onClick={() => setPage("chat")}
          className={`p-2 rounded-full cursor-pointer transition-colors ${
            page === "chat"
              ? "text-indigo-500"
              : darkMode
              ? "text-gray-400 hover:text-gray-300"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <MessageCircle size={24} />
        </button>
        <button
          onClick={() => {
            setSelectedUser(null);
            setPage("profile");
          }}
          className={`p-2 rounded-full cursor-pointer transition-colors ${
            page === "profile"
              ? "text-indigo-500"
              : darkMode
              ? "text-gray-400 hover:text-gray-300"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <User size={24} />
        </button>
      </nav>

      {page === "profile" && (
        <div className="w-full max-w-lg mx-auto px-2 sm:px-4">
          <div
            className={`rounded-lg ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow overflow-hidden mb-4 transition-all hover:shadow-md`}
          >
            <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <div className="p-4 relative">
              <div className="absolute -top-10 left-4 w-20 h-20 rounded-full border-4 overflow-hidden bg-white border-white">
                <img
                  src={currentUser.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-12">
                <h2 className="text-xl font-bold">{currentUser.name}</h2>
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {currentUser.username}
                </p>
                <p className="mt-2 text-sm leading-relaxed">
                  Digital creator and positive vibes spreader. Mindfulness
                  advocate.
                </p>
                <div className="flex gap-4 mt-3">
                  <div>
                    <span className="font-bold">
                      {posts.filter((post) => post.userId === "me").length}
                    </span>{" "}
                    <span
                      className={`${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Posts
                    </span>
                  </div>
                  <div>
                    <span className="font-bold">{getFollowers().length}</span>{" "}
                    <span
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Followers
                    </span>
                  </div>
                  <div>
                    <span className="font-bold">{getFollowing().length}</span>{" "}
                    <span
                      className={`${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Following
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <div className="flex border-b mb-4">
              <button
                className={`flex-1 py-2 font-medium text-base border-b-2 border-indigo-500 text-indigo-500 cursor-pointer`}
              >
                Posts
              </button>
            </div>

            <div className="space-y-4 mb-5">
              {posts.filter((post) => post.userId === "me").length > 0 ? (
                posts
                  .filter((post) => post.userId === "me")
                  .map((post) => {
                    const postUser = getUserById(post.userId);
                    const isCurrentUserPost = post.userId === "me";
                    const isEditing = post.id === editingPostId;
                    const totalReactions = getTotalReactions(post.reactions);

                    return (
                      <div
                        key={post.id}
                        className={`w-full p-4 rounded-lg ${
                          darkMode ? "bg-gray-800" : "bg-white"
                        } shadow transition-all hover:shadow-md`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              <img
                                src={postUser.avatar}
                                alt={postUser.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{postUser.name}</div>
                              <div
                                className={`text-xs ${
                                  darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {post.time}
                              </div>
                            </div>
                          </div>

                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowPostOptions(
                                  showPostOptions === post.id ? null : post.id
                                );
                              }}
                              className={`p-1 rounded-full ${
                                darkMode
                                  ? "hover:bg-gray-700"
                                  : "hover:bg-gray-200"
                              } transition-colors`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                              </svg>
                            </button>
                            {showPostOptions === post.id && (
                              <div
                                className={`absolute right-0 mt-1 w-40 rounded-md shadow-lg z-10 ${
                                  darkMode ? "bg-gray-700" : "bg-white"
                                }`}
                              >
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      startEditingPost(post);
                                      setShowPostOptions(null);
                                    }}
                                    className="flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 mr-2"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      deletePost(post.id);
                                      setShowPostOptions(null);
                                    }}
                                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 mr-2"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {post.id === editingPostId ? (
                          <div className="mb-3">
                            <textarea
                              className={`w-full p-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                                darkMode
                                  ? "bg-gray-700 text-white"
                                  : "bg-gray-100 text-gray-900"
                              }`}
                              rows={3}
                              value={editPostContent}
                              onChange={(e) =>
                                setEditPostContent(e.target.value)
                              }
                            ></textarea>
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                onClick={cancelEditingPost}
                                className="px-3 py-1 rounded text-sm bg-gray-300 text-gray-800 cursor-pointer hover:bg-gray-400 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => saveEditedPost(post.id)}
                                className="px-3 py-1 rounded text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white cursor-pointer transition-colors"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="mb-3 break-words text-base leading-relaxed">{post.content}</p>
                        )}

                        {post.image && (
                          <div className="mb-3 rounded-lg overflow-hidden max-h-[50vh]">
                            <img
                              src={post.image}
                              alt="Post"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {totalReactions > 0 && (
                          <div
                            className={`flex items-center mb-2 text-sm ${
                              darkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            <div className="flex mr-2">
                              {Object.keys(post.reactions)
                                .filter(
                                  (emoji) =>
                                    post.reactions[emoji] &&
                                    post.reactions[emoji]! > 0
                                )
                                .slice(0, 3)
                                .map((emoji) => (
                                  <span key={emoji} className="mr-1">
                                    {emoji}
                                  </span>
                                ))}
                            </div>
                            <span>{totalReactions} reactions</span>
                          </div>
                        )}

                        <div
                          className={`flex border-t ${
                            darkMode
                              ? "bg-gray-800 border-gray-600"
                              : "bg-white border-gray-200"
                          } rounded py-2 mb-2`}
                        >
                          <div className="flex justify-between w-full md:px-2 px-0">
                            <motion.button
                              onClick={() => addReaction(post.id, "👍")}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={`flex items-center justify-center py-1 px-1 md:px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              post.userReaction === "👍" 
                                ? `${darkMode ? "bg-indigo-900/30" : "bg-indigo-50"}`
                                : ""
                            }`}
                            >
                              <span className="text-xl">👍</span>
                            </motion.button>
                            <motion.button
                              onClick={() => addReaction(post.id, "❤️")}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={`flex items-center justify-center py-1 px-1 md:px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              post.userReaction === "❤️" 
                                ? `${darkMode ? "bg-indigo-900/30" : "bg-indigo-50"}`
                                : ""
                            }`}
                            >
                              <span className="text-xl">❤️</span>
                            </motion.button>
                            <motion.button
                              onClick={() => addReaction(post.id, "😂")}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={`flex items-center justify-center py-1 px-1 md:px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              post.userReaction === "😂" 
                                ? `${darkMode ? "bg-indigo-900/30" : "bg-indigo-50"}`
                                : ""
                            }`}
                            >
                              <span className="text-xl">😂</span>
                            </motion.button>
                            <motion.button
                              onClick={() => addReaction(post.id, "😮")}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={`flex items-center justify-center py-1 px-1 md:px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              post.userReaction === "😮" 
                                ? `${darkMode ? "bg-indigo-900/30" : "bg-indigo-50"}`
                                : ""
                            }`}
                            >
                              <span className="text-xl">😮</span>
                            </motion.button>
                            <motion.button
                              onClick={() => addReaction(post.id, "😢")}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={`flex items-center justify-center py-1 px-1 md:px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              post.userReaction === "😢" 
                                ? `${darkMode ? "bg-indigo-900/30" : "bg-indigo-50"}`
                                : ""
                            }`}
                            >
                              <span className="text-xl">😢</span>
                            </motion.button>
                            <motion.button
                              onClick={() => addReaction(post.id, "😠")}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={`flex items-center justify-center py-1 px-1 md:px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              post.userReaction === "😠" 
                                ? `${darkMode ? "bg-indigo-900/30" : "bg-indigo-50"}`
                                : ""
                            }`}
                            >
                              <span className="text-xl">😠</span>
                            </motion.button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-3">
                          <div
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {post.comments > 0
                              ? `${post.comments} comments`
                              : "0 comments"}
                          </div>
                          <button
                            onClick={() => toggleComments(post.id)}
                            className="flex items-center gap-1 cursor-pointer hover:text-indigo-500 transition-colors"
                          >
                            <MessageSquare
                              size={18}
                              className={`${
                                darkMode ? "text-gray-300" : "text-gray-600"
                              } mr-1`}
                            />
                            <span>{post.comments}</span>
                          </button>
                        </div>

                        {post.showComments && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`mt-3 pt-3 border-t ${
                              darkMode ? "border-gray-700" : "border-gray-200"
                            }`}
                          >
                            <div className="space-y-3 mb-3">
                              {post.commentsList &&
                              post.commentsList.length > 0 ? (
                                post.commentsList.map((comment) => {
                                  const commentUser = getUserById(
                                    comment.userId
                                  );
                                  return (
                                    <div
                                      key={comment.id}
                                      className="flex gap-2"
                                    >
                                      <div 
                                        className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 cursor-pointer"
                                        onClick={() => openUserProfile(comment.userId)}
                                      >
                                        <img
                                          src={commentUser.avatar}
                                          alt={commentUser.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div
                                        className={`flex-1 p-2 rounded-lg ${
                                          darkMode
                                            ? "bg-gray-700"
                                            : "bg-gray-100"
                                        }`}
                                      >
                                        <div className="flex justify-between items-start">
                                          <span 
                                            className="font-medium cursor-pointer hover:underline"
                                            onClick={() => openUserProfile(comment.userId)}
                                          >
                                            {commentUser.name}
                                          </span>
                                          <span
                                            className={`text-xs ${
                                              darkMode
                                                ? "text-gray-400"
                                                : "text-gray-500"
                                            }`}
                                          >
                                            {comment.time}
                                          </span>
                                        </div>
                                        <p className="text-sm mt-1 break-words leading-relaxed">
                                          {comment.content}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <p className="text-sm text-center text-gray-500">
                                  No comments yet. Be the first to comment!
                                </p>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                <img
                                  src={currentUser.avatar}
                                  alt={currentUser.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    className={`flex-1 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                                      darkMode
                                        ? "bg-gray-700 text-white"
                                        : "bg-gray-100 text-gray-900"
                                    }`}
                                    placeholder="Write a comment..."
                                    value={newComment[post.id] || ""}
                                    onChange={(e) =>
                                      setNewComment({
                                        ...newComment,
                                        [post.id]: e.target.value,
                                      })
                                    }
                                    onKeyPress={(e) =>
                                      e.key === "Enter" && addComment(post.id)
                                    }
                                  />
                                  <button
                                    disabled={!newComment[post.id]?.trim()}
                                    onClick={() => addComment(post.id)}
                                    className="p-2 rounded-full cursor-pointer text-indigo-500 hover:text-indigo-600 disabled:opacity-50 transition-colors"
                                  >
                                    <Send size={20} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })
              ) : (
                <div
                  className={`p-6 text-center rounded-lg ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } shadow transition-all hover:shadow-md`}
                >
                  <p className="text-lg mb-4">
                    You haven't posted anything yet
                  </p>
                  <button
                    onClick={() => setPage("home")}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 cursor-pointer text-white rounded-full transition-all transform hover:scale-105"
                  >
                    Create your first post
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <ProfileModal />
      
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
}