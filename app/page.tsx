"use client"

import { useState, useEffect, useRef } from "react"
import {
  Bell,
  Home,
  MessageSquare,
  Search,
  User,
  Moon,
  Sun,
  Menu,
  X,
  Send,
  ImageIcon,
  MoreHorizontal,
  Compass,
  PenSquare,
  ChevronLeft,
  Code,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
} from "lucide-react"

// Define the AppUser interface
interface AppUser {
  id: string
  name: string
  username: string
  avatar?: string
  bio?: string
  isOnline?: boolean
  isFollowing?: boolean
  followers?: number
  following?: number
}

// Define the Post interface
interface Post {
  id: string
  user: AppUser
  text: string
  image?: string
  timestamp: string
  likes: number
  liked: boolean
  comments: Comment[]
  shares: number
  bookmarked: boolean
}

// Define the Notification interface
interface Notification {
  id: string
  user: AppUser
  text: string
  timestamp: string
  read: boolean
}

// Message interface
interface Message {
  id: string
  sender: string
  text: string
  timestamp: string
}

//Conversation interface
interface Conversation {
  id: string
  user: AppUser
  messages: Message[]
}

// Data 
const sampleUsers: AppUser[] = [
  {
    id: "user-1",
    name: "Alex Chen",
    username: "devAlex",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    bio: "Full-stack developer | AI enthusiast | Building the future 🚀",
    isOnline: true,
    followers: 1234,
    following: 567,
  },
  {
    id: "user-2",
    name: "Emma Watson",
    username: "techEmma",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    bio: "UX/UI Designer | Design systems advocate | Coffee-powered ☕",
    isOnline: false,
    followers: 2456,
    following: 734,
  },
  {
    id: "user-3",
    name: "David Park",
    username: "codeNinja",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1748&q=80",
    bio: "Backend engineer at TechCorp | Open source contributor | Rust & Go 💻",
    isOnline: true,
    followers: 1789,
    following: 345,
  },
  {
    id: "user-4",
    name: "Sophia Rodriguez",
    username: "aiSophia",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1742&q=80",
    bio: "AI researcher | PhD in Machine Learning | Building ethical AI systems 🤖",
    isOnline: false,
    followers: 3234,
    following: 456,
  },
  {
    id: "user-5",
    name: "Daniel Kim",
    username: "devopsDan",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    bio: "DevOps engineer | Cloud architect | Kubernetes enthusiast ☁️",
    isOnline: true,
    followers: 967,
    following: 567,
  },
  {
    id: "user-6",
    name: "Olivia Brown",
    username: "cyberOlivia",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    bio: "Cybersecurity specialist | Ethical hacker | Privacy advocate 🔒",
    isOnline: false,
    followers: 1890,
    following: 678,
  },
  {
    id: "user-7",
    name: "Ethan Wilson",
    username: "gameDevEthan",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    bio: "Game developer | Unity & Unreal | Building virtual worlds 🎮",
    isOnline: true,
    followers: 1321,
    following: 789,
  },
  {
    id: "user-8",
    name: "Ava Garcia",
    username: "dataAva",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    bio: "Data scientist | Python & R | Turning data into insights 📊",
    isOnline: false,
    followers: 2654,
    following: 890,
  },
]

const sampleNotifications: Notification[] = [
  {
    id: "notif-1",
    user: sampleUsers[1],
    text: "liked your post about React 18 features.",
    timestamp: "2023-04-11T08:00:00Z",
    read: false,
  },
  {
    id: "notif-2",
    user: sampleUsers[2],
    text: "commented on your Kubernetes deployment strategy.",
    timestamp: "2023-04-10T21:30:00Z",
    read: true,
  },
  {
    id: "notif-3",
    user: sampleUsers[3],
    text: "shared your AI ethics framework.",
    timestamp: "2023-04-09T12:45:00Z",
    read: true,
  },
]

const sampleConversations: Conversation[] = [
  {
    id: "convo-1",
    user: sampleUsers[1],
    messages: [
      {
        id: "msg-1",
        sender: "user-1",
        text: "Hey! Have you tried the new Next.js 13 features?",
        timestamp: "2023-04-11T07:30:00Z",
      },
      {
        id: "msg-2",
        sender: "user-2",
        text: "Yes! The new app directory and server components are game-changing!",
        timestamp: "2023-04-11T08:00:00Z",
      },
    ],
  },
  {
    id: "convo-2",
    user: sampleUsers[2],
    messages: [
      {
        id: "msg-3",
        sender: "user-1",
        text: "Your Kubernetes article was super helpful. Do you have any tips for optimizing resource allocation?",
        timestamp: "2023-04-10T21:00:00Z",
      },
      {
        id: "msg-4",
        sender: "user-3",
        text: "Thanks! I'd recommend using the Horizontal Pod Autoscaler and setting resource limits properly. I can share some config examples.",
        timestamp: "2023-04-10T21:30:00Z",
      },
    ],
  },
]

const trendingTopics = [
  {
    id: "topic-1",
    category: "Programming",
    title: "TypeScript 5.0",
    posts: 1234,
  },
  {
    id: "topic-2",
    category: "AI",
    title: "GPT-4 Applications",
    posts: 5678,
  },
  {
    id: "topic-3",
    category: "Cloud",
    title: "Serverless Architecture",
    posts: 3101,
  },
  {
    id: "topic-4",
    category: "Hardware",
    title: "Apple M3 Chips",
    posts: 2121,
  },
  {
    id: "topic-5",
    category: "Web",
    title: "Web Assembly",
    posts: 1456,
  },
]

function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  } else {
    return "Just now"
  }
}

//  Comment 
interface Comment {
  id: string
  user: AppUser
  text: string
  timestamp: string
  likes?: number
  liked?: boolean
  replies?: Reply[]
}

// Add a new Reply interface
interface Reply {
  id: string
  user: AppUser
  text: string
  timestamp: string
  likes?: number
  liked?: boolean
}

const samplePosts: Post[] = [
  {
    id: "post-1",
    user: sampleUsers[1],
    text: "Just deployed my first full-stack app with Next.js 13 and Prisma! The new app directory structure is a game-changer. Who else is loving the React Server Components?",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    timestamp: "2023-04-10T14:30:00Z",
    likes: 78,
    liked: false,
    comments: [
      {
        id: "comment-1",
        user: sampleUsers[2],
        text: "The streaming SSR is incredible! Have you tried the new data fetching patterns?",
        timestamp: "2023-04-10T15:00:00Z",
        likes: 5,
        liked: false,
        replies: [
          {
            id: "reply-1",
            user: sampleUsers[1],
            text: "Yes! The loading.js and error.js conventions make the UX so much better.",
            timestamp: "2023-04-10T15:05:00Z",
            likes: 2,
            liked: false,
          },
          {
            id: "reply-2",
            user: sampleUsers[4],
            text: "I'm still figuring out the best patterns for mutations. Any recommendations?",
            timestamp: "2023-04-10T15:30:00Z",
            likes: 1,
            liked: false,
          },
        ],
      },
      {
        id: "comment-2",
        user: sampleUsers[3],
        text: "I'm still on Next.js 12. Is it worth the migration effort?",
        timestamp: "2023-04-10T15:15:00Z",
        likes: 3,
        liked: false,
        replies: [],
      },
    ],
    shares: 12,
    bookmarked: false,
  },
  {
    id: "post-2",
    user: sampleUsers[0],
    text: "Just finished setting up my new M1 Max MacBook Pro for development. The compile times are insane! Docker runs smoothly and battery life is incredible. Best dev machine I've ever used.",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1626&q=80",
    timestamp: "2023-04-09T19:45:00Z",
    likes: 93,
    liked: true,
    comments: [
      {
        id: "comment-3",
        user: sampleUsers[4],
        text: "How's the RAM usage with multiple Docker containers? I'm thinking of upgrading.",
        timestamp: "2023-04-09T20:00:00Z",
        likes: 8,
        liked: true,
        replies: [
          {
            id: "reply-3",
            user: sampleUsers[0],
            text: "I'm running 5-6 containers simultaneously with no issues on 32GB. The memory management is really efficient!",
            timestamp: "2023-04-09T20:15:00Z",
            likes: 3,
            liked: false,
          },
        ],
      },
    ],
    shares: 15,
    bookmarked: true,
  },
  {
    id: "post-3",
    user: sampleUsers[3],
    text: "Just published my research paper on ethical considerations in generative AI. We need more discussions about responsible AI development and deployment. Check it out and let me know your thoughts!",
    image:
      "https://images.unsplash.com/photo-1745681619881-975e836e432c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D",
    timestamp: "2023-04-08T10:15:00Z",
    likes: 156,
    liked: false,
    comments: [
      {
        id: "comment-4",
        user: sampleUsers[0],
        text: "This is so important! We need more focus on the ethical implications as these models become more powerful.",
        timestamp: "2023-04-08T10:30:00Z",
        likes: 4,
        liked: false,
        replies: [],
      },
      {
        id: "comment-5",
        user: sampleUsers[5],
        text: "I'd love to collaborate on a follow-up paper focusing on privacy concerns!",
        timestamp: "2023-04-08T11:00:00Z",
        likes: 2,
        liked: false,
        replies: [
          {
            id: "reply-4",
            user: sampleUsers[3],
            text: "That would be great! DM me and we can discuss the details.",
            timestamp: "2023-04-08T11:15:00Z",
            likes: 1,
            liked: false,
          },
        ],
      },
      {
        id: "comment-6",
        user: sampleUsers[2],
        text: "Have you looked into the recent EU AI Act? It addresses some of these concerns.",
        timestamp: "2023-04-08T12:45:00Z",
        likes: 1,
        liked: false,
        replies: [
          {
            id: "reply-5",
            user: sampleUsers[3],
            text: "Yes, I reference it in section 3.2! It's a good start but still has gaps in enforcement.",
            timestamp: "2023-04-08T13:00:00Z",
            likes: 2,
            liked: false,
          },
        ],
      },
    ],
    shares: 34,
    bookmarked: false,
  },
  {
    id: "post-4",
    user: sampleUsers[4],
    text: "Finally completed my ultimate developer workstation! Dual 4K monitors, custom mechanical keyboard, and perfect cable management. Productivity level: 1000%",
    image:
      "https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    timestamp: "2023-04-07T18:20:00Z",
    likes: 67,
    liked: false,
    comments: [
      {
        id: "comment-7",
        user: sampleUsers[4],
        text: "For those asking about my setup: Standing desk from Fully, Herman Miller Embody chair, and dual Dell U2720Q monitors. Best investment for productivity!",
        timestamp: "2023-04-07T18:25:00Z",
        likes: 6,
        liked: false,
        replies: [],
      },
      {
        id: "comment-8",
        user: sampleUsers[1],
        text: "Love the clean setup! What keyboard is that? I'm looking for a new mechanical.",
        timestamp: "2023-04-07T19:00:00Z",
        likes: 2,
        liked: false,
        replies: [
          {
            id: "reply-6",
            user: sampleUsers[4],
            text: "It's a custom GMMK Pro with Zealios V2 switches and MT3 keycaps. Highly recommend!",
            timestamp: "2023-04-07T19:10:00Z",
            likes: 1,
            liked: false,
          },
        ],
      },
    ],
    shares: 19,
    bookmarked: false,
  },
  {
    id: "post-5",
    user: sampleUsers[2],
    text: "Just open-sourced my Kubernetes operator for automating database backups. It supports PostgreSQL, MySQL, and MongoDB. Contributions welcome! GitHub link in comments.",
    image:
      "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    timestamp: "2023-04-06T09:10:00Z",
    likes: 231,
    liked: false,
    comments: [
      {
        id: "comment-9",
        user: sampleUsers[0],
        text: "This is exactly what I've been looking for! Does it support scheduled backups?",
        timestamp: "2023-04-06T09:30:00Z",
        likes: 7,
        liked: false,
        replies: [],
      },
      {
        id: "comment-10",
        user: sampleUsers[2],
        text: "GitHub: https://github.com/codeNinja/k8s-db-backup-operator - And yes, it supports cron scheduling!",
        timestamp: "2023-04-06T10:15:00Z",
        likes: 5,
        liked: false,
        replies: [
          {
            id: "reply-7",
            user: sampleUsers[7],
            text: "Just starred the repo. Would love to contribute to the MongoDB integration!",
            timestamp: "2023-04-06T10:30:00Z",
            likes: 0,
            liked: false,
          },
          {
            id: "reply-8",
            user: sampleUsers[2],
            text: "That would be awesome! Check the issues labeled 'good first issue' to get started.",
            timestamp: "2023-04-06T10:45:00Z",
            likes: 2,
            liked: false,
          },
        ],
      },
    ],
    shares: 47,
    bookmarked: false,
  },
]

export default function SocialMediaPlatform() {
  // State management
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState("feed")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [posts, setPosts] = useState<Post[]>(samplePosts)
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications)
  const [messages, setMessages] = useState<Conversation[]>(sampleConversations)
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [currentUser, setCurrentUser] = useState(sampleUsers[0])
  const [suggestedUsers, setSuggestedUsers] = useState(sampleUsers.slice(1))
  const [activeTrendingTopic, setActiveTrendingTopic] = useState<string | null>(null)
  const [newPostText, setNewPostText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [viewedUserProfile, setViewedUserProfile] = useState<AppUser | null>(null)
  const [newPostImage, setNewPostImage] = useState<string | null>(null)
  const [newPostFeeling, setNewPostFeeling] = useState<string | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showImageInput, setShowImageInput] = useState(false)
  const [showCreatePost, setShowCreatePost] = useState(false)
  
  // Toast notification state
  const [toast, setToast] = useState<{message: string, type: "success" | "error" | "info"} | null>(null)

  // Show toast notification
  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type })
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      setToast(null)
    }, 3000)
  }
  
  // Handle messages tab click
  const handleMessagesClick = () => {
    showToast("Messages feature is not available", "info")
  }
  
  // Handle explore tab click
  const handleExploreClick = () => {
    showToast("Explore feature is not available", "info")
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  // Handle post reactions
  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked }
          : post,
      ),
    )
  }

  // Handle post bookmarks
  const handleBookmark = (postId: string) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, bookmarked: !post.bookmarked } : post)))
  }

  // Handle comment submission
  const handleComment = (postId: string, comment: string) => {
    if (!comment.trim()) return

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: `comment-${Date.now()}`,
                  user: currentUser,
                  text: comment,
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : post,
      ),
    )
  }

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return

    const updatedMessages = messages.map((convo) => {
      if (convo.id === activeConversation) {
        return {
          ...convo,
          messages: [
            ...convo.messages,
            {
              id: `msg-${Date.now()}`,
              sender: currentUser.id,
              text: newMessage,
              timestamp: new Date().toISOString(),
            },
          ],
        }
      }
      return convo
    })

    setMessages(updatedMessages)
    setNewMessage("")
  }

  // Handle following a user
  const handleFollowUser = (userId: string) => {
    setSuggestedUsers(
      suggestedUsers.map((user) => (user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user)),
    )

    // Update current user's following count
    setCurrentUser({
      ...currentUser,
      following: (currentUser.following ?? 0) + (suggestedUsers.find((u) => u.id === userId)?.isFollowing ? -1 : 1),
    })

    // Add a notification when user follows someone
    if (!suggestedUsers.find((u) => u.id === userId)?.isFollowing) {
      const followedUser = suggestedUsers.find((u) => u.id === userId)
      if (followedUser) {
        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          user: followedUser,
          text: "has been followed by you.",
          timestamp: new Date().toISOString(),
          read: true,
        }
        setNotifications([newNotification, ...notifications])
      }
    }
  }

  // Handle clicking on a trending topic
  const handleTrendingTopicClick = (topicId: string) => {
    setActiveTrendingTopic(topicId === activeTrendingTopic ? null : topicId)

    // filter posts related to topic
    if (topicId !== activeTrendingTopic) {
      const topic = trendingTopics.find((t) => t.id === topicId)
      if (topic) {
        setSearchQuery(topic.title)
        setActiveTab("feed")
      }
    } else {
      setSearchQuery("")
    }
  }

  // Handle viewing another user's profile
  const handleViewUserProfile = (user: AppUser) => {
    setViewedUserProfile(user)
    setActiveTab("profile")
  }

  // Handle going back to own profile
  const handleBackToOwnProfile = () => {
    setViewedUserProfile(null)
  }

  // Toggle dropdown menu
  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id)
  }

  // Handle post actions from dropdown
  const handlePostAction = (action: string, postId: string) => {
    switch (action) {
      case "delete":
        setPosts(posts.filter((post) => post.id !== postId))
        alert("Post deleted")
        break
      case "report":
        alert("Post reported")
        break
      case "save":
        onBookmarkPost(postId)
        break
      case "copy":
        navigator.clipboard.writeText(posts.find((p) => p.id === postId)?.text || "")
        alert("Post content copied to clipboard")
        break
      default:
        break
    }
    setActiveDropdown(null)
  }

  // Handle creating a new post
  const handleCreatePost = () => {
    if (!newPostText.trim() && !newPostImage) return

    const newPost: Post = {
      id: `post-${Date.now()}`,
      user: currentUser,
      text: newPostText + (newPostFeeling ? ` - feeling ${newPostFeeling}` : ""),
      image: newPostImage || undefined,
      timestamp: new Date().toISOString(),
      likes: 0,
      liked: false,
      comments: [],
      shares: 0,
      bookmarked: false,
    }

    setPosts([newPost, ...posts])
    setNewPostText("")
    setNewPostImage(null)
    setNewPostFeeling(null)
    setShowEmojiPicker(false)
    setShowImageInput(false)
    setShowCreatePost(false)
  }

  // Handle adding an image to a new post
  const handleAddImage = (url: string) => {
    setNewPostImage(url)
    setShowImageInput(false)
  }

  // Handle adding a feeling to a new post
  const handleAddFeeling = (feeling: string) => {
    setNewPostFeeling(feeling)
    setShowEmojiPicker(false)
  }

  // sharing a post
  const handleSharePost = (postId: string) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, shares: post.shares + 1 } : post)))

    // Show notification for sharing
    const sharedPost = posts.find((p) => p.id === postId)
    if (sharedPost) {
      alert(`Post shared successfully!`)
    }
  }

  // Mark notifications as read
  const markNotificationsAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeConversation, messages])

  // notifications as read when notifications tab is opened
  useEffect(() => {
    if (activeTab === "notifications") {
      markNotificationsAsRead()
    }
  }, [activeTab])

  // Filter posts based on search query or active trending topic
  const filteredPosts = posts.filter(
    (post) =>
      post.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter users based on search query
  const filteredUsers = suggestedUsers.filter(
    (user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()) && user.id !== currentUser.id,
  )

  const onBookmarkPost = (postId: string) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, bookmarked: !post.bookmarked } : post)))
  }

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [mobileMenuOpen])

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <header
        className={`sticky top-0 z-50 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent cursor-pointer">
              TechNexus
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div
              className={`flex items-center w-full px-3 py-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
            >
              <Search className="h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className={`ml-2 w-full outline-none ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full cursor-pointer ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              className={`relative p-2 rounded-full cursor-pointer md:block hidden ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
              onClick={() => setActiveTab("notifications")}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-0 right-0 h-3 w-3 bg-indigo-500 rounded-full"></span>
              )}
            </button>

            <button
              className="md:hidden p-2 cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <div className="hidden md:block">
              <button className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab("profile")}>
                <img
                  src={currentUser.avatar || "/placeholder.svg"}
                  alt={currentUser.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden fixed inset-0 z-50 ${darkMode ? "backdrop-blur-sm bg-gray-900/95" : "backdrop-blur-sm bg-white/95"}`}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="p-4 flex items-center justify-between">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                TechNexus
              </h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-full cursor-pointer ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <button
                  className="p-2 cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Content */}
            <div className="p-4 overflow-y-auto flex-1">
              <div className="mb-6">
                <div
                  className={`flex items-center w-full px-3 py-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                >
                  <Search className="h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className={`ml-2 w-full outline-none ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <nav className="flex flex-col space-y-4">
                <button
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${activeTab === "feed" ? (darkMode ? "bg-gray-800" : "bg-gray-200") : ""}`}
                  onClick={() => {
                    setActiveTab("feed")
                    setMobileMenuOpen(false)
                  }}
                >
                  <Home className="h-6 w-6" />
                  <span className="text-left">Home</span>
                </button>

                <button
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${activeTab === "messages" ? (darkMode ? "bg-gray-800" : "bg-gray-200") : ""}`}
                  onClick={() => {
                    handleMessagesClick()
                    setMobileMenuOpen(false)
                  }}
                >
                  <MessageSquare className="h-6 w-6" />
                  <span className="text-left">Messages</span>
                </button>

                <button
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${activeTab === "explore" ? (darkMode ? "bg-gray-800" : "bg-gray-200") : ""}`}
                  onClick={() => {
                    handleExploreClick()
                    setMobileMenuOpen(false)
                  }}
                >
                  <Compass className="h-6 w-6" />
                  <span className="text-left">Explore</span>
                </button>

                <button
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${activeTab === "notifications" ? (darkMode ? "bg-gray-800" : "bg-gray-200") : ""}`}
                  onClick={() => {
                    setActiveTab("notifications")
                    setMobileMenuOpen(false)
                  }}
                >
                  <Bell className="h-6 w-6" />
                  <span className="text-left">Notifications</span>
                </button>

                <button
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${activeTab === "profile" ? (darkMode ? "bg-gray-800" : "bg-gray-200") : ""}`}
                  onClick={() => {
                    setActiveTab("profile")
                    setMobileMenuOpen(false)
                  }}
                >
                  <User className="h-6 w-6" />
                  <span className="text-left">Profile</span>
                </button>

                <button
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white`}
                  onClick={() => {
                    setShowCreatePost(true)
                    setMobileMenuOpen(false)
                  }}
                >
                  <PenSquare className="h-6 w-6" />
                  <span className="text-left">Create Post</span>
                </button>
              </nav>
            </div>

            <div className="p-4">
              <div className="flex items-center space-x-3 p-3">
                <img
                  src={currentUser.avatar || "/placeholder.svg"}
                  alt={currentUser.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{currentUser.name}</p>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>@{currentUser.username}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 md:flex">
        {/* Sidebar - Desktop only */}
        <aside className="hidden md:block w-64 mr-8">
          <nav className="sticky top-24 space-y-2">
            <button
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors cursor-pointer ${activeTab === "feed" ? (darkMode ? "bg-gray-800" : "bg-gray-200") : darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
              onClick={() => setActiveTab("feed")}
            >
              <Home className="h-6 w-6" />
              <span>Home</span>
            </button>

            <button
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors cursor-pointer ${activeTab === "explore" ? (darkMode ? "bg-gray-800" : "bg-gray-200") : darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
              onClick={handleExploreClick}
            >
              <Compass className="h-6 w-6" />
              <span>Explore</span>
            </button>

            <button
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors cursor-pointer ${activeTab === "messages" ? (darkMode ? "bg-gray-800" : "bg-gray-200") : darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
              onClick={handleMessagesClick}
            >
              <MessageSquare className="h-6 w-6" />
              <span>Messages</span>
            </button>

            <button
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors cursor-pointer ${activeTab === "notifications" ? (darkMode ? "bg-gray-800" : "bg-gray-200") : darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
              onClick={() => setActiveTab("notifications")}
            >
              <Bell className="h-6 w-6" />
              <span>Notifications</span>
            </button>

            <button
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors cursor-pointer ${activeTab === "profile" ? (darkMode ? "bg-gray-800" : "bg-gray-200") : darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
              onClick={() => setActiveTab("profile")}
            >
              <User className="h-6 w-6" />
              <span>Profile</span>
            </button>

            <button
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white mt-4`}
              onClick={() => setShowCreatePost(true)}
            >
              <PenSquare className="h-6 w-6" />
              <span>Create Post</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 max-w-2xl mx-auto">
          {/* Create Post Modal */}
          {showCreatePost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
              <div className={`w-full max-w-lg p-6 rounded-xl shadow-xl ${darkMode ? "bg-gray-800" : "bg-white"} mx-4`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Create Post</h2>
                  <button
                    className={`p-2 rounded-full cursor-pointer ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                    onClick={() => setShowCreatePost(false)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={currentUser.avatar || "/placeholder.svg"}
                    alt={currentUser.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{currentUser.name}</p>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>@{currentUser.username}</p>
                  </div>
                </div>

                <textarea
                  placeholder="What's on your mind?"
                  className={`w-full p-3 rounded-lg mb-4 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} focus:outline-none`}
                  rows={4}
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                ></textarea>

                {newPostImage && (
                  <div className="mb-4 relative">
                    <img
                      src={newPostImage || "/placeholder.svg"}
                      alt="Post preview"
                      className="w-full h-60 object-cover rounded-lg"
                    />
                    <button
                      className="absolute top-2 right-2 p-1 rounded-full bg-gray-800 bg-opacity-70 text-white cursor-pointer"
                      onClick={() => setNewPostImage(null)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div className="flex justify-between mb-4">
                  <div className="flex space-x-2">
                    <button
                      className={`p-2 rounded-lg flex items-center space-x-1 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                      onClick={() => setShowImageInput(!showImageInput)}
                    >
                      <ImageIcon className="h-5 w-5 text-indigo-500" />
                      <span>Add Image</span>
                    </button>
                    <button
                      className={`p-2 rounded-lg flex items-center space-x-1 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Code className="h-5 w-5 text-indigo-500" />
                      <span>Add Code</span>
                    </button>
                  </div>
                </div>

                {showImageInput && (
                  <div className="mb-4 p-3 border rounded-lg border-gray-200 dark:border-gray-700">
                    <p className="mb-2 text-sm font-medium">Add an image URL:</p>
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        className={`flex-1 p-2 rounded-l-lg ${
                          darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
                        } focus:outline-none`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddImage(e.currentTarget.value)
                          }
                        }}
                      />
                      <button
                        className={`px-3 py-2 rounded-r-lg cursor-pointer ${darkMode ? "bg-indigo-600" : "bg-indigo-500"} text-white`}
                        onClick={(e) => handleAddImage((e.currentTarget.previousSibling as HTMLInputElement).value)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {showEmojiPicker && (
                  <div className="mb-4 p-3 border rounded-lg border-gray-200 dark:border-gray-700">
                    <p className="mb-2 text-sm font-medium">Select a tech topic:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {["Coding", "AI", "DevOps", "Web3", "Mobile", "Cloud", "Security", "Data"].map((topic) => (
                        <button
                          key={topic}
                          className={`p-2 rounded-lg text-sm cursor-pointer ${
                            newPostFeeling === topic
                              ? darkMode
                                ? "bg-indigo-600 text-white"
                                : "bg-indigo-100 text-indigo-800"
                              : darkMode
                                ? "bg-gray-700 hover:bg-gray-600"
                                : "bg-gray-100 hover:bg-gray-200"
                          }`}
                          onClick={() => handleAddFeeling(topic)}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                    {newPostFeeling && (
                      <div className="mt-2 flex items-center">
                        <p className="text-sm">
                          Topic: <span className="font-medium">{newPostFeeling}</span>
                        </p>
                        <button
                          className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => setNewPostFeeling(null)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <button
                  className={`w-full py-2 rounded-lg font-medium cursor-pointer ${
                    !newPostText.trim() && !newPostImage
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                  onClick={handleCreatePost}
                  disabled={!newPostText.trim() && !newPostImage}
                >
                  Post
                </button>
              </div>
            </div>
          )}

          {/* Feed Tab */}
          {activeTab === "feed" && (
            <div className="space-y-6">
              {/* Create Post */}
              <div className={`p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <div className="flex space-x-3">
                  <img
                    src={currentUser.avatar || "/placeholder.svg"}
                    alt={currentUser.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <button
                    className={`flex-1 p-2 rounded-full text-left ${darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"} focus:outline-none`}
                    onClick={() => setShowCreatePost(true)}
                  >
                    What's on your mind, {currentUser.name.split(" ")[0]}?
                  </button>
                </div>
                <div className="flex justify-between mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    className="flex items-center space-x-2 text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 cursor-pointer"
                    onClick={() => {
                      setShowCreatePost(true)
                      setShowImageInput(true)
                    }}
                  >
                    <ImageIcon className="h-5 w-5" />
                    <span>Photo</span>
                  </button>
                  <button
                    className="flex items-center space-x-2 text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 cursor-pointer"
                    onClick={() => {
                      setShowCreatePost(true)
                      setShowEmojiPicker(true)
                    }}
                  >
                    <Code className="h-5 w-5" />
                    <span>Code</span>
                  </button>
                  <button
                    className={`px-4 py-1.5 rounded-full font-medium cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white`}
                    onClick={() => setShowCreatePost(true)}
                  >
                    Post
                  </button>
                </div>
              </div>

              {/* Posts */}
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    darkMode={darkMode}
                    onLike={handleLike}
                    onBookmark={onBookmarkPost}
                    onComment={handleComment}
                    onShare={handleSharePost}
                    currentUser={currentUser}
                    onViewProfile={handleViewUserProfile}
                    activeDropdown={activeDropdown}
                    onToggleDropdown={toggleDropdown}
                    onPostAction={handlePostAction}
                    setPosts={setPosts}
                    posts={posts}
                  />
                ))
              ) : (
                <div className={`p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                  <p className="text-lg font-medium">No posts found</p>
                  <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {searchQuery ? "Try a different search term" : "Follow more people to see posts"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className={`rounded-xl shadow-sm hover:shadow-md transition-shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-6">Notifications</h2>
                <div className="space-y-6">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start justify-between p-4 rounded-lg ${
                          !notification.read ? (darkMode ? "bg-gray-700" : "bg-gray-100") : ""
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <img
                            src={notification.user.avatar || "/placeholder.svg"}
                            alt={notification.user.name}
                            className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                          />
                          <div>
                            <p className="font-medium text-lg">{notification.user.name}</p>
                            <p className={`text-base ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                              {notification.text}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm whitespace-nowrap ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-lg font-medium">No notifications</p>
                      <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        When someone interacts with your posts, you'll see it here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div>
              {viewedUserProfile ? (
                <div className="space-y-6">
                  {/* Back Button */}
                  <button
                    className={`flex items-center space-x-2 cursor-pointer ${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
                    onClick={handleBackToOwnProfile}
                  >
                    <ChevronLeft className="h-5 w-5" />
                    <span>Back to Profile</span>
                  </button>

                  {/* User Profile */}
                  <div className={`p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <div className="flex items-center space-x-6 mb-4">
                      <img
                        src={viewedUserProfile.avatar || "/placeholder.svg"}
                        alt={viewedUserProfile.name}
                        className="h-24 w-24 rounded-full object-cover"
                      />
                      <div>
                        <h2 className="text-2xl font-bold">{viewedUserProfile.name}</h2>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          @{viewedUserProfile.username}
                        </p>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {viewedUserProfile.bio}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{viewedUserProfile.followers}</p>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Followers</p>
                      </div>
                      <div>
                        <p className="font-medium">{viewedUserProfile.following}</p>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Following</p>
                      </div>
                    </div>

                    <button
                      className={`mt-4 px-4 py-2 rounded-full font-medium cursor-pointer ${
                        viewedUserProfile.isFollowing
                          ? "bg-gray-300 text-gray-500"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                      onClick={() => handleFollowUser(viewedUserProfile.id)}
                    >
                      {viewedUserProfile.isFollowing ? "Following" : "Follow"}
                    </button>
                  </div>

                  {/* User Posts */}
                  <div className="space-y-6">
                    {posts
                      .filter((post) => post.user.id === viewedUserProfile.id)
                      .map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          darkMode={darkMode}
                          onLike={handleLike}
                          onBookmark={onBookmarkPost}
                          onComment={handleComment}
                          onShare={handleSharePost}
                          currentUser={currentUser}
                          onViewProfile={handleViewUserProfile}
                          activeDropdown={activeDropdown}
                          onToggleDropdown={toggleDropdown}
                          onPostAction={handlePostAction}
                          setPosts={setPosts}
                          posts={posts}
                        />
                      ))}
                  </div>
                </div>
              ) : (
                <div className={`p-4 rounded-xl shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                  <div className="flex items-center space-x-6 mb-4">
                    <img
                      src={currentUser.avatar || "/placeholder.svg"}
                      alt={currentUser.name}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="text-2xl font-bold">{currentUser.name}</h2>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        @{currentUser.username}
                      </p>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{currentUser.bio}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">{currentUser.followers}</p>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Followers</p>
                    </div>
                    <div>
                      <p className="font-medium">{currentUser.following}</p>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Following</p>
                    </div>
                  </div>

                  <div className="space-y-6 mt-6">
                    {posts
                      .filter((post) => post.user.id === currentUser.id)
                      .map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          darkMode={darkMode}
                          onLike={handleLike}
                          onBookmark={onBookmarkPost}
                          onComment={handleComment}
                          onShare={handleSharePost}
                          currentUser={currentUser}
                          onViewProfile={handleViewUserProfile}
                          activeDropdown={activeDropdown}
                          onToggleDropdown={toggleDropdown}
                          onPostAction={handlePostAction}
                          setPosts={setPosts}
                          posts={posts}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden md:block w-64 ml-8">
          <div className={`sticky top-24 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h2 className="text-lg font-bold mb-4">Your Stats</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">Posts</p>
                <span className="text-sm">{posts.filter((post) => post.user.id === currentUser.id).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium">Likes</p>
                <span className="text-sm">
                  {posts.filter((post) => post.user.id === currentUser.id).reduce((acc, post) => acc + post.likes, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium">Comments</p>
                <span className="text-sm">
                  {posts
                    .filter((post) => post.user.id === currentUser.id)
                    .reduce((acc, post) => acc + post.comments.length, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium">Shares</p>
                <span className="text-sm">
                  {posts.filter((post) => post.user.id === currentUser.id).reduce((acc, post) => acc + post.shares, 0)}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-md z-50 flex items-center space-x-2 transition-all duration-300 animate-fade-in opacity-90 ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-blue-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : toast.type === "error" ? (
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  )
}

// PostCard component
interface PostCardProps {
  post: Post;
  darkMode: boolean;
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onShare: (postId: string) => void;
  currentUser: AppUser;
  onViewProfile: (user: AppUser) => void;
  activeDropdown: string | null;
  onToggleDropdown: (id: string) => void;
  onPostAction: (action: string, postId: string) => void;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  posts: Post[];
}

function PostCard({
  post,
  darkMode,
  onLike,
  onBookmark,
  onComment,
  onShare,
  currentUser,
  onViewProfile,
  activeDropdown,
  onToggleDropdown,
  onPostAction,
  setPosts,
  posts,
}: PostCardProps) {
  const [commentText, setCommentText] = useState("")
  const [showComments, setShowComments] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [expandedReplies, setExpandedReplies] = useState<string[]>([])

  const handleSubmitComment = () => {
    if (!commentText.trim()) return
    onComment(post.id, commentText)
    setCommentText("")
  }

  const handleLikeComment = (commentId: string) => {
    setPosts(
      posts.map((p: Post) => {
        if (p.id === post.id) {
          return {
            ...p,
            comments: p.comments.map((comment: Comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  likes: comment.liked ? (comment.likes || 1) - 1 : (comment.likes || 0) + 1,
                  liked: !comment.liked,
                }
              }
              return comment
            }),
          } as Post
        }
        return p
      })
    )
  }

  const handleReplyToComment = (commentId: string) => {
    if (!replyText.trim()) return

    setPosts(
      posts.map((p: Post) => {
        if (p.id === post.id) {
          return {
            ...p,
            comments: p.comments.map((comment: Comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  replies: [
                    ...(comment.replies || []),
                    {
                      id: `reply-${Date.now()}`,
                      user: currentUser,
                      text: replyText,
                      timestamp: new Date().toISOString(),
                      likes: 0,
                      liked: false,
                    },
                  ],
                }
              }
              return comment
            }),
          } as Post
        }
        return p
      })
    )

    setReplyText("")
    setReplyingTo(null)
  }

  const handleLikeReply = (commentId: string, replyId: string) => {
    setPosts(
      posts.map((p: Post) => {
        if (p.id === post.id) {
          return {
            ...p,
            comments: p.comments.map((comment: Comment) => {
              if (comment.id === commentId && comment.replies) {
                return {
                  ...comment,
                  replies: comment.replies.map((reply: Reply) => {
                    if (reply.id === replyId) {
                      return {
                        ...reply,
                        likes: reply.liked ? (reply.likes || 1) - 1 : (reply.likes || 0) + 1,
                        liked: !reply.liked,
                      }
                    }
                    return reply
                  }),
                }
              }
              return comment
            }),
          } as Post
        }
        return p
      })
    )
  }

  const toggleReplyToComment = (commentId: string) => {
    // If we're already replying to this comment, cancel it
    if (replyingTo === commentId) {
      setReplyingTo(null)
      return
    }

    // Otherwise, set this comment as the one we're replying to
    setReplyingTo(commentId)

    // Also make sure replies are expanded for this comment
    if (!expandedReplies.includes(commentId)) {
      setExpandedReplies([...expandedReplies, commentId])
    }
  }

  return (
    <div className={`rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={post.user.avatar || "/placeholder.svg"}
            alt={post.user.name}
            className="h-10 w-10 rounded-full object-cover cursor-pointer"
            onClick={() => onViewProfile(post.user)}
          />
          <div>
            <p className="font-medium cursor-pointer" onClick={() => onViewProfile(post.user)}>
              {post.user.name}
            </p>
            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{formatTimeAgo(post.timestamp)}</p>
          </div>
        </div>
        <div className="relative">
          <button
            className={`p-2 rounded-full cursor-pointer ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            onClick={() => onToggleDropdown(`post-${post.id}`)}
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
          {activeDropdown === `post-${post.id}` && (
            <div
              className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10 ${
                darkMode ? "bg-gray-800" : "bg-white"
              } overflow-hidden`}
            >
              <div className="py-1" role="menu" aria-orientation="vertical">
                {post.user.id === currentUser.id && (
                  <button
                    className={`flex items-center w-full px-4 py-3 text-sm font-medium text-left cursor-pointer transition-colors ${
                      darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => onPostAction("delete", post.id)}
                  >
                    Delete
                  </button>
                )}
                <button
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium text-left cursor-pointer transition-colors ${
                    darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => onPostAction("save", post.id)}
                >
                  {post.bookmarked ? "Unsave" : "Save"}
                </button>
                <button
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium text-left cursor-pointer transition-colors ${
                    darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => onPostAction("copy", post.id)}
                >
                  Copy text
                </button>
                <button
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium text-left cursor-pointer transition-colors ${
                    darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => onPostAction("report", post.id)}
                >
                  Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-2">
        <p className="mb-3">{post.text}</p>
        {post.image && (
          <img
            src={post.image || "/placeholder.svg"}
            alt="Post"
            className="rounded-lg w-full h-auto object-cover mb-3"
          />
        )}
      </div>

      {/* Post Stats */}
      <div
        className={`px-4 py-3 flex items-center justify-between ${darkMode ? "text-gray-300" : "text-gray-700"}`}
      >
        <div className="flex items-center space-x-2">
          <Heart className={`h-5 w-5 cursor-pointer ${post.liked ? "text-indigo-500 fill-indigo-500" : ""}`} />
          <span className="text-sm font-medium">{post.likes}</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className={`text-sm font-medium cursor-pointer ${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setShowComments(!showComments)}
          >
            {post.comments.length} comments
          </button>
          <button
            className={`text-sm font-medium cursor-pointer ${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
          >
            {post.shares} shares
          </button>
        </div>
      </div>

      {/* Post Actions */}
      <div
        className={`px-4 py-3 flex items-center justify-between border-t ${darkMode ? "border-gray-700/30" : "border-gray-200/70"}`}
      >
        <button
          className={`flex items-center space-x-2 px-3 py-2 rounded-full cursor-pointer transition-colors ${
            post.liked 
              ? "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" 
              : darkMode 
                ? "text-gray-300 hover:bg-gray-700/30" 
                : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => onLike(post.id)}
        >
          <Heart className={`h-5 w-5 ${post.liked ? "fill-indigo-500" : ""}`} />
          <span className="hidden sm:inline font-medium">Like</span>
        </button>

        <button
          className={`flex items-center space-x-2 px-3 py-2 rounded-full cursor-pointer transition-colors ${
            showComments
              ? darkMode
                ? "bg-gray-700/30 text-gray-200"
                : "bg-gray-100 text-gray-700"
              : darkMode
                ? "text-gray-300 hover:bg-gray-700/30"
                : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline font-medium">Comment</span>
        </button>

        <button
          className={`flex items-center space-x-2 px-3 py-2 rounded-full cursor-pointer transition-colors ${
            darkMode
              ? "text-gray-300 hover:bg-gray-700/30"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => onShare(post.id)}
        >
          <Share2 className="h-5 w-5" />
          <span className="hidden sm:inline font-medium">Share</span>
        </button>

        <button
          className={`flex items-center space-x-2 px-3 py-2 rounded-full cursor-pointer transition-colors ${
            post.bookmarked
              ? "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
              : darkMode
                ? "text-gray-300 hover:bg-gray-700/30"
                : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => onBookmark(post.id)}
        >
          <Bookmark className={`h-5 w-5 ${post.bookmarked ? "fill-indigo-500" : ""}`} />
          <span className="hidden sm:inline font-medium">Save</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-4">
          {/* Comment Input */}
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={currentUser.avatar || "/placeholder.svg"}
              alt={currentUser.name}
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="flex-1 flex items-center">
              <input
                type="text"
                placeholder="Write a comment..."
                className={`flex-1 p-2 rounded-full ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} focus:outline-none`}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmitComment()
                  }
                }}
              />
              <button
                className={`ml-2 p-2 rounded-full cursor-pointer ${darkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-500 hover:bg-indigo-600"} text-white`}
                onClick={handleSubmitComment}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {post.comments.map((comment: Comment) => (
              <div key={comment.id} className="space-y-2">
                <div className="flex items-start space-x-3">
                  <img
                    src={comment.user.avatar || "/placeholder.svg"}
                    alt={comment.user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{comment.user.name}</p>
                        <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {formatTimeAgo(comment.timestamp)}
                        </p>
                      </div>
                      <p className="mt-1">{comment.text}</p>
                    </div>

                    {/* Comment Actions */}
                    <div className="flex items-center space-x-4 mt-1 ml-1">
                      <button
                        className={`text-xs cursor-pointer ${comment.liked ? "text-indigo-500" : darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
                        onClick={() => handleLikeComment(comment.id)}
                      >
                        Like {comment.likes ? `(${comment.likes})` : ""}
                      </button>
                      <button
                        className={`text-xs cursor-pointer ${replyingTo === comment.id ? "text-indigo-500" : darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
                        onClick={() => toggleReplyToComment(comment.id)}
                      >
                        Reply {comment.replies && comment.replies.length > 0 ? `(${comment.replies.length})` : ""}
                      </button>
                    </div>

                    {/* Replies */}
                    {expandedReplies.includes(comment.id) && comment.replies && comment.replies.length > 0 && (
                      <div className="ml-8 mt-2 space-y-2">
                        {comment.replies.map((reply: Reply) => (
                          <div key={reply.id} className="flex items-start space-x-2">
                            <img
                              src={reply.user.avatar || "/placeholder.svg"}
                              alt={reply.user.name}
                              className="h-6 w-6 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className={`p-2 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-sm">{reply.user.name}</p>
                                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    {formatTimeAgo(reply.timestamp)}
                                  </p>
                                </div>
                                <p className="mt-1 text-sm">{reply.text}</p>
                              </div>

                              {/* Reply Actions */}
                              <div className="flex items-center space-x-3 mt-1 ml-1">
                                <button
                                  className={`text-xs cursor-pointer ${reply.liked ? "text-indigo-500" : darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
                                  onClick={() => handleLikeReply(comment.id, reply.id)}
                                >
                                  Like {reply.likes ? `(${reply.likes})` : ""}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply */} 
                    {replyingTo === comment.id && (
                      <div className="flex items-center space-x-2 mt-2 ml-8">
                        <img
                          src={currentUser.avatar || "/placeholder.svg"}
                          alt={currentUser.name}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        <div className="flex-1 flex items-center">
                          <input
                            type="text"
                            placeholder={`Reply to ${comment.user.name}...`}
                            className={`flex-1 p-1.5 text-sm rounded-full ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} focus:outline-none`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleReplyToComment(comment.id)
                              }
                            }}
                          />
                          <button
                            className={`ml-1 p-1.5 rounded-full cursor-pointer ${darkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-500 hover:bg-indigo-600"} text-white`}
                            onClick={() => handleReplyToComment(comment.id)}
                          >
                            <Send className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}