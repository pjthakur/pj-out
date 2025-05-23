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
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  XCircle,
  CircleDot,
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
  debateScore?: number
  expertise?: string[]
}

// Define the Post interface
interface Debate {
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
  topic: string
  stance: "for" | "against" | "neutral"
  votes: {
    up: number
    down: number
  }
  userVote?: "up" | "down" | null
}

// Define the Notification interface
interface Notification {
  id: string
  user: AppUser
  text: string
  timestamp: string
  read: boolean
}

// Define the Message interface
interface Message {
  id: string
  sender: string
  text: string
  timestamp: string
}

// Define the Conversation interface
interface Conversation {
  id: string
  user: AppUser
  messages: Message[]
}

// Comment includes likes, liked status, and replies 
interface Comment {
  id: string
  user: AppUser
  text: string
  timestamp: string
  likes?: number
  liked?: boolean
  replies?: Reply[]
  stance: "for" | "against" | "neutral"
  votes: {
    up: number
    down: number
  }
  userVote?: "up" | "down" | null
}

// 
interface Reply {
  id: string
  user: AppUser
  text: string
  timestamp: string
  likes?: number
  liked?: boolean
  stance: "for" | "against" | "neutral"
  votes: {
    up: number
    down: number
  }
  userVote?: "up" | "down" | null
}

// Data
const sampleUsers: AppUser[] = [
  {
    id: "user-1",
    name: "Alex Chen",
    username: "debateAlex",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    bio: "Policy analyst | Critical thinker | Seeking truth through dialogue 🧠",
    isOnline: true,
    followers: 1234,
    following: 567,
    debateScore: 92,
    expertise: ["Politics", "Economics", "Philosophy"],
  },
  {
    id: "user-2",
    name: "Emma Watson",
    username: "logicalEmma",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    bio: "Debate champion | Logic enthusiast | Changing minds with facts 📊",
    isOnline: false,
    followers: 2456,
    following: 734,
    debateScore: 88,
    expertise: ["Climate", "Education", "Ethics"],
  },
  {
    id: "user-3",
    name: "David Park",
    username: "reasonDavid",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1748&q=80",
    bio: "Constitutional lawyer | Free speech advocate | Reasoned debate promoter 💬",
    isOnline: true,
    followers: 1789,
    following: 345,
    debateScore: 95,
    expertise: ["Law", "Rights", "Governance"],
  },
  {
    id: "user-4",
    name: "Sophia Rodriguez",
    username: "ethicalSophia",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1742&q=80",
    bio: "AI ethics researcher | PhD in Philosophy | Building ethical frameworks for debate 🤖",
    isOnline: false,
    followers: 3234,
    following: 456,
    debateScore: 91,
    expertise: ["AI Ethics", "Technology", "Philosophy"],
  },
  {
    id: "user-5",
    name: "Daniel Kim",
    username: "factualDan",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    bio: "Data scientist | Fact checker | Using evidence to win arguments ☁️",
    isOnline: true,
    followers: 967,
    following: 567,
    debateScore: 87,
    expertise: ["Data Science", "Statistics", "Research"],
  },
  {
    id: "user-6",
    name: "Olivia Brown",
    username: "securityOlivia",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    bio: "Cybersecurity specialist | Privacy advocate | Debating digital rights 🔒",
    isOnline: false,
    followers: 1890,
    following: 678,
    debateScore: 84,
    expertise: ["Cybersecurity", "Privacy", "Digital Rights"],
  },
  {
    id: "user-7",
    name: "Ethan Wilson",
    username: "futuristEthan",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    bio: "Futurist | Technology ethicist | Debating tomorrow's challenges today 🎮",
    isOnline: true,
    followers: 1321,
    following: 789,
    debateScore: 82,
    expertise: ["Future Tech", "Ethics", "Innovation"],
  },
  {
    id: "user-8",
    name: "Ava Garcia",
    username: "dataAva",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    bio: "Data analyst | Evidence-based debater | Turning data into winning arguments 📊",
    isOnline: false,
    followers: 2654,
    following: 890,
    debateScore: 89,
    expertise: ["Data Analysis", "Research Methods", "Statistics"],
  },
]

const sampleNotifications: Notification[] = [
  {
    id: "notif-1",
    user: sampleUsers[1],
    text: "challenged your stance on AI regulation.",
    timestamp: "2023-04-11T08:00:00Z",
    read: false,
  },
  {
    id: "notif-2",
    user: sampleUsers[2],
    text: "supported your argument on constitutional rights.",
    timestamp: "2023-04-10T21:30:00Z",
    read: true,
  },
  {
    id: "notif-3",
    user: sampleUsers[3],
    text: "invited you to a debate on ethical AI frameworks.",
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
        text: "I'd like to debate your position on climate policy. Are you available for a structured discussion?",
        timestamp: "2023-04-11T07:30:00Z",
      },
      {
        id: "msg-2",
        sender: "user-2",
        text: "I'd welcome that. Should we focus on carbon taxation or renewable subsidies as the main topic?",
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
        text: "Your argument on free speech limitations was compelling. I'd like to explore the nuances further if you're interested.",
        timestamp: "2023-04-10T21:00:00Z",
      },
      {
        id: "msg-4",
        sender: "user-3",
        text: "Thank you! I'd be happy to continue that discussion. The balance between free expression and harm prevention is complex and worth exploring in depth.",
        timestamp: "2023-04-10T21:30:00Z",
      },
    ],
  },
]

const trendingTopics = [
  {
    id: "topic-1",
    category: "Politics",
    title: "Universal Basic Income",
    debates: 1234,
    trend: "up",
  },
  {
    id: "topic-2",
    category: "Technology",
    title: "AI Regulation",
    debates: 5678,
    trend: "up",
  },
  {
    id: "topic-3",
    category: "Economics",
    title: "Wealth Tax",
    debates: 3101,
    trend: "down",
  },
  {
    id: "topic-4",
    category: "Society",
    title: "Social Media Impact",
    debates: 2121,
    trend: "up",
  },
  {
    id: "topic-5",
    category: "Environment",
    title: "Nuclear Energy",
    debates: 1456,
    trend: "down",
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

const sampleDebates: Debate[] = [
  {
    id: "debate-1",
    user: sampleUsers[1],
    text: "Universal Basic Income would reduce poverty and stimulate economic growth by providing a safety net that encourages entrepreneurship and education. The evidence from pilot programs shows promising results.",
    image:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    timestamp: "2023-04-10T14:30:00Z",
    likes: 78,
    liked: false,
    comments: [
      {
        id: "comment-1",
        user: sampleUsers[2],
        text: "While I appreciate the intent, UBI could lead to inflation and reduced work incentives. The funding mechanism is also unclear - would it replace existing welfare programs?",
        timestamp: "2023-04-10T15:00:00Z",
        likes: 5,
        liked: false,
        stance: "against",
        votes: {
          up: 12,
          down: 3,
        },
        replies: [
          {
            id: "reply-1",
            user: sampleUsers[1],
            text: "Studies from Finland and Canada show no significant reduction in work hours. As for inflation, it would primarily affect luxury goods, not necessities, as spending would be directed toward basic needs.",
            timestamp: "2023-04-10T15:05:00Z",
            likes: 2,
            liked: false,
            stance: "for",
            votes: {
              up: 8,
              down: 2,
            },
          },
          {
            id: "reply-2",
            user: sampleUsers[4],
            text: "The data on inflation is mixed. Some models suggest a 2-3% increase in consumer prices, which could negate the benefits for the most vulnerable populations.",
            timestamp: "2023-04-10T15:30:00Z",
            likes: 1,
            liked: false,
            stance: "against",
            votes: {
              up: 5,
              down: 4,
            },
          },
        ],
      },
      {
        id: "comment-2",
        user: sampleUsers[3],
        text: "We should consider a targeted approach rather than universal. Directing resources to those most in need would be more efficient and less costly.",
        timestamp: "2023-04-10T15:15:00Z",
        likes: 3,
        liked: false,
        stance: "neutral",
        votes: {
          up: 7,
          down: 6,
        },
        replies: [],
      },
    ],
    shares: 12,
    bookmarked: false,
    topic: "Economics",
    stance: "for",
    votes: {
      up: 145,
      down: 67,
    },
  },
  {
    id: "debate-2",
    user: sampleUsers[0],
    text: "AI regulation should focus on transparency and accountability rather than restricting innovation. Companies should be required to disclose AI decision-making processes and be held liable for harmful outcomes.",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",
    timestamp: "2023-04-09T19:45:00Z",
    likes: 93,
    liked: true,
    comments: [
      {
        id: "comment-3",
        user: sampleUsers[4],
        text: "Transparency alone isn't enough. We need proactive regulation that prevents harm before it occurs, especially in high-risk applications like healthcare and criminal justice.",
        timestamp: "2023-04-09T20:00:00Z",
        likes: 8,
        liked: true,
        stance: "against",
        votes: {
          up: 18,
          down: 5,
        },
        replies: [
          {
            id: "reply-3",
            user: sampleUsers[0],
            text: "Pre-emptive regulation often stifles innovation. A better approach would be regulatory sandboxes that allow controlled testing with strong oversight before wider deployment.",
            timestamp: "2023-04-09T20:15:00Z",
            likes: 3,
            liked: false,
            stance: "for",
            votes: {
              up: 12,
              down: 7,
            },
          },
        ],
      },
    ],
    shares: 15,
    bookmarked: true,
    topic: "Technology",
    stance: "for",
    votes: {
      up: 203,
      down: 89,
    },
  },
  {
    id: "debate-3",
    user: sampleUsers[3],
    text: "The ethical framework for AI development must prioritize human autonomy and well-being over efficiency. We need global standards that ensure AI systems respect human rights and dignity across all applications.",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",
    timestamp: "2023-04-08T10:15:00Z",
    likes: 156,
    liked: false,
    comments: [
      {
        id: "comment-4",
        user: sampleUsers[0],
        text: "I agree with the principle, but global standards are impractical given different cultural and political values. Regional approaches with core shared principles would be more effective.",
        timestamp: "2023-04-08T10:30:00Z",
        likes: 4,
        liked: false,
        stance: "neutral",
        votes: {
          up: 9,
          down: 3,
        },
        replies: [],
      },
      {
        id: "comment-5",
        user: sampleUsers[5],
        text: "We should also consider the security implications. Ethical AI must be secure against manipulation and misuse, which requires technical standards beyond just ethical guidelines.",
        timestamp: "2023-04-08T11:00:00Z",
        likes: 2,
        liked: false,
        stance: "for",
        votes: {
          up: 14,
          down: 2,
        },
        replies: [
          {
            id: "reply-4",
            user: sampleUsers[3],
            text: "Excellent point. Security and ethics are intertwined in AI systems. Perhaps a multi-layered framework addressing both would be most effective.",
            timestamp: "2023-04-08T11:15:00Z",
            likes: 1,
            liked: false,
            stance: "for",
            votes: {
              up: 8,
              down: 1,
            },
          },
        ],
      },
      {
        id: "comment-6",
        user: sampleUsers[2],
        text: "The focus on human autonomy could limit beneficial AI applications where automated decision-making outperforms humans. We need a balanced approach that recognizes both human and AI strengths.",
        timestamp: "2023-04-08T12:45:00Z",
        likes: 1,
        liked: false,
        stance: "against",
        votes: {
          up: 7,
          down: 9,
        },
        replies: [
          {
            id: "reply-5",
            user: sampleUsers[3],
            text: "Autonomy doesn't mean rejecting AI assistance, but ensuring humans maintain meaningful control over important decisions affecting their lives. It's about partnership, not competition.",
            timestamp: "2023-04-08T13:00:00Z",
            likes: 2,
            liked: false,
            stance: "for",
            votes: {
              up: 11,
              down: 3,
            },
          },
        ],
      },
    ],
    shares: 34,
    bookmarked: false,
    topic: "AI Ethics",
    stance: "for",
    votes: {
      up: 278,
      down: 92,
    },
  },
  {
    id: "debate-4",
    user: sampleUsers[4],
    text: "Nuclear energy should be a central component of our climate strategy. Modern reactor designs are safer than ever, produce minimal waste, and provide reliable carbon-free electricity that renewable sources cannot yet match.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    timestamp: "2023-04-07T18:20:00Z",
    likes: 67,
    liked: false,
    comments: [
      {
        id: "comment-7",
        user: sampleUsers[4],
        text: "For context: France generates about 70% of its electricity from nuclear power and has some of the lowest carbon emissions in Europe. The data supports nuclear as a climate solution.",
        timestamp: "2023-04-07T18:25:00Z",
        likes: 6,
        liked: false,
        stance: "for",
        votes: {
          up: 16,
          down: 4,
        },
        replies: [],
      },
      {
        id: "comment-8",
        user: sampleUsers[1],
        text: "The upfront costs and construction time for nuclear plants make them less practical than rapidly deploying renewables. We should focus on solar, wind, and storage technologies.",
        timestamp: "2023-04-07T19:00:00Z",
        likes: 2,
        liked: false,
        stance: "against",
        votes: {
          up: 8,
          down: 12,
        },
        replies: [
          {
            id: "reply-6",
            user: sampleUsers[4],
            text: "Small modular reactors address both cost and time concerns. They can be factory-built and deployed in 3-4 years, comparable to large renewable projects with storage.",
            timestamp: "2023-04-07T19:10:00Z",
            likes: 1,
            liked: false,
            stance: "for",
            votes: {
              up: 9,
              down: 5,
            },
          },
        ],
      },
    ],
    shares: 19,
    bookmarked: false,
    topic: "Environment",
    stance: "for",
    votes: {
      up: 189,
      down: 102,
    },
  },
]

// Toast interface
interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export default function SocialMediaPlatform() {
  // 
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState("feed")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [debates, setDebates] = useState<Debate[]>(sampleDebates)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchInput, setSearchInput] = useState("")  // New state for input before search
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications)
  const [messages, setMessages] = useState<Conversation[]>(sampleConversations)
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [currentUser, setCurrentUser] = useState(sampleUsers[0])
  const [suggestedUsers, setSuggestedUsers] = useState(sampleUsers.slice(1))
  const [activeTrendingTopic, setActiveTrendingTopic] = useState<string | null>(null)
  const [newDebateText, setNewDebateText] = useState("")
  const [newDebateImage, setNewDebateImage] = useState<string | null>(null)
  const [newDebateTopic, setNewDebateTopic] = useState<string | null>(null)
  const [newDebateStance, setNewDebateStance] = useState<"for" | "against" | "neutral" | null>(null)
  const [showTopicPicker, setShowTopicPicker] = useState(false)
  const [showImageInput, setShowImageInput] = useState(false)
  const [showCreateDebate, setShowCreateDebate] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [viewedUserProfile, setViewedUserProfile] = useState<AppUser | null>(null)
  
  // Toast state
  const [toasts, setToasts] = useState<Toast[]>([])

  // Add useEffect to prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [mobileMenuOpen])

  // Add useEffect to prevent body scrolling when create debate modal is open
  useEffect(() => {
    if (showCreateDebate) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    
    // Return priority to mobile menu control if it's open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    }
  }, [showCreateDebate, mobileMenuOpen])

  // Add toast
  const addToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}`
    setToasts(prevToasts => [...prevToasts, { id, message, type }])
    
    // Auto remove toast after 3 seconds
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id))
    }, 3000)
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  // Modified tab handlers to show toast for unavailable features
  const handleTabChange = (tab: string) => {
    if (tab === "explore" || tab === "messages" || tab === "notifications") {
      addToast(`${tab.charAt(0).toUpperCase() + tab.slice(1)} functionality is not available yet.`, 'info')
      return
    }
    setActiveTab(tab)
  }

  // Handle debate reactions
  const handleLike = (debateId: string) => {
    setDebates(
      debates.map((debate) => {
        if (debate.id === debateId) {
          return {
            ...debate,
            likes: debate.liked ? debate.likes - 1 : debate.likes + 1,
            liked: !debate.liked,
          }
        }
        return debate
      }),
    )
  }

  // Handle debate votes
  const handleVote = (debateId: string, voteType: "up" | "down") => {
    setDebates(
      debates.map((debate) => {
        if (debate.id === debateId) {
          // If already voted the same way, remove vote
          if (debate.userVote === voteType) {
            return {
              ...debate,
              votes: {
                ...debate.votes,
                [voteType]: debate.votes[voteType] - 1,
              },
              userVote: null,
            }
          }
          // If voted the opposite way, switch vote
          else if (debate.userVote) {
            return {
              ...debate,
              votes: {
                up: voteType === "up" ? debate.votes.up + 1 : debate.votes.up - 1,
                down: voteType === "down" ? debate.votes.down + 1 : debate.votes.down - 1,
              },
              userVote: voteType,
            }
          }
          // If not voted yet, add vote
          else {
            return {
              ...debate,
              votes: {
                ...debate.votes,
                [voteType]: debate.votes[voteType] + 1,
              },
              userVote: voteType,
            }
          }
        }
        return debate
      }),
    )
  }

  // Handle debate bookmarks
  const handleBookmark = (debateId: string) => {
    setDebates(
      debates.map((debate) => (debate.id === debateId ? { ...debate, bookmarked: !debate.bookmarked } : debate)),
    )
  }

  // Handle comment submission
  const handleComment = (debateId: string, comment: string, stance: "for" | "against" | "neutral") => {
    if (!comment.trim()) return

    setDebates(
      debates.map((debate) =>
        debate.id === debateId
          ? {
              ...debate,
              comments: [
                ...debate.comments,
                {
                  id: `comment-${Date.now()}`,
                  user: currentUser,
                  text: comment,
                  timestamp: new Date().toISOString(),
                  stance: stance,
                  votes: {
                    up: 0,
                    down: 0,
                  },
                },
              ],
            }
          : debate,
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

    // If a topic is selected, filter debates related to that topic
    if (topicId !== activeTrendingTopic) {
      const topic = trendingTopics.find((t) => t.id === topicId)
      if (topic) {
        setSearchInput(topic.title)
        setSearchQuery(topic.title)
        setActiveTab("feed")
      }
    } else {
      setSearchInput("")
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

  // Handle debate actions from dropdown
  const handleDebateAction = (action: string, debateId: string) => {
    switch (action) {
      case "delete":
        setDebates(debates.filter((debate) => debate.id !== debateId))
        alert("Debate deleted")
        break
      case "report":
        alert("Debate reported")
        break
      case "save":
        onBookmarkDebate(debateId)
        break
      case "copy":
        navigator.clipboard.writeText(debates.find((p) => p.id === debateId)?.text || "")
        alert("Debate content copied to clipboard")
        break
      default:
        break
    }
    setActiveDropdown(null)
  }

  // Handle creating a new debate
  const handleCreateDebate = () => {
    if (!newDebateText.trim()) return

    const newDebate: Debate = {
      id: `debate-${Date.now()}`,
      user: currentUser,
      text: newDebateText,
      image: newDebateImage || undefined,
      timestamp: new Date().toISOString(),
      likes: 0,
      liked: false,
      comments: [],
      shares: 0,
      bookmarked: false,
      topic: newDebateTopic || "General",
      stance: newDebateStance || "neutral",
      votes: {
        up: 0,
        down: 0,
      },
    }

    setDebates([newDebate, ...debates])
    setNewDebateText("")
    setNewDebateImage(null)
    setNewDebateTopic(null)
    setNewDebateStance(null)
    setShowTopicPicker(false)
    setShowImageInput(false)
    setShowCreateDebate(false)
  }

  // Handle adding an image to a new debate
  const handleAddImage = (url: string) => {
    setNewDebateImage(url)
    setShowImageInput(false)
  }

  // Handle adding a topic to a new debate
  const handleAddTopic = (topic: string) => {
    setNewDebateTopic(topic)
    setShowTopicPicker(false)
  }

  // Handle setting stance for a new debate
  const handleSetStance = (stance: "for" | "against" | "neutral") => {
    setNewDebateStance(stance)
  }

  // Handle sharing a debate
  const handleShareDebate = (debateId: string) => {
    setDebates(debates.map((debate) => (debate.id === debateId ? { ...debate, shares: debate.shares + 1 } : debate)))

    // Show notification for sharing
    const sharedDebate = debates.find((p) => p.id === debateId)
    if (sharedDebate) {
      alert(`Debate shared successfully!`)
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

  // Mark notifications as read when notifications tab is opened
  useEffect(() => {
    if (activeTab === "notifications") {
      markNotificationsAsRead()
    }
  }, [activeTab])

  // Filter debates based on search query or active trending topic
  const filteredDebates = debates.filter(
    (debate) =>
      debate.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      debate.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      debate.topic.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter users based on search query
  const filteredUsers = suggestedUsers.filter(
    (user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()) && user.id !== currentUser.id,
  )

  const onBookmarkDebate = (debateId: string) => {
    setDebates(
      debates.map((debate) => (debate.id === debateId ? { ...debate, bookmarked: !debate.bookmarked } : debate)),
    )
  }

  // Primary color 
  const primaryColor = "#A35C7A"
  const primaryLightColor = "#C78DA6"
  const primaryDarkColor = "#7A3F59"

  // Add a search function that updates the searchQuery from searchInput
  const handleSearch = () => {
    setSearchQuery(searchInput)
  }

  // Add a reset search function
  const resetSearch = () => {
    setSearchQuery("")
    setSearchInput("")
  }

  return (
    <div
      className={`min-h-screen flex flex-col font-sans ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} tracking-wide`}
      style={{ fontFamily: "'Inter', 'Roboto', system-ui, sans-serif" }}
    >
      {/* Toast Container */}
      <div className="fixed top-20 right-4 z-[100] flex flex-col space-y-2 max-w-xs">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`px-4 py-3 rounded-lg shadow-lg text-white transition-all transform animate-in fade-in slide-in-from-top-4 ${
              toast.type === 'error' ? 'bg-red-500' : 
              toast.type === 'warning' ? 'bg-amber-500' :
              toast.type === 'success' ? 'bg-green-500' :
              'bg-blue-500'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <header
        className={`sticky top-0 z-50 ${darkMode ? "bg-gray-800" : "bg-white"} border-b ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-sm`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold cursor-pointer" style={{ color: primaryColor }}>
              DebateX
            </h1>
          </div>

          {/* Replace the desktop search UI */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search debates, topics, users..."
                className={`w-full pl-10 pr-12 py-2 rounded-full outline-none ${
                  darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
                }`}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch()
                  }
                }}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <button
                className={`absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center rounded-r-full transition-colors cursor-pointer ${
                  darkMode 
                    ? "bg-gray-600 hover:bg-gray-500 text-gray-300" 
                    : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                }`}
                onClick={handleSearch}
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
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
              className={`relative p-2 rounded-full cursor-pointer ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
              onClick={() => addToast("Notifications functionality is not available yet.", "info")}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {notifications.some((n) => !n.read) && (
                <span
                  className="absolute top-0 right-0 h-3 w-3 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                ></span>
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

      {/* Mobile Menu - Improved */}
      {mobileMenuOpen && (
        <div className={`md:hidden fixed inset-0 z-40 flex flex-col ${darkMode ? "bg-gray-900" : "bg-white"}`}>
          <div className={`flex items-center justify-between px-4 py-3 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            <h1 className="text-xl font-bold" style={{ color: primaryColor }}>
              DebateX
            </h1>
            <button
              className="p-2 rounded-full cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            <div className="mb-6 mt-2">
              {/* Replace the mobile search UI */}
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search debates, topics, users..."
                  className={`w-full pl-11 pr-12 py-3 rounded-xl outline-none ${
                    darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <button
                  className={`absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center rounded-r-xl transition-colors cursor-pointer ${
                    darkMode 
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300" 
                      : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                  }`}
                  onClick={() => {
                    handleSearch()
                    setMobileMenuOpen(false)
                  }}
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>

            <nav className="flex flex-col space-y-1">
              <button
                className={`flex items-center space-x-4 p-4 rounded-xl transition-colors cursor-pointer ${
                  activeTab === "feed" 
                    ? darkMode 
                      ? "bg-gray-800 text-white" 
                      : "bg-gray-200 text-gray-900"
                    : darkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => {
                  setActiveTab("feed")
                  setMobileMenuOpen(false)
                }}
              >
                <Home className="h-6 w-6" />
                <span className="font-medium">Home</span>
              </button>

              <button
                className={`flex items-center space-x-4 p-4 rounded-xl transition-colors cursor-pointer ${
                  activeTab === "messages" 
                    ? darkMode 
                      ? "bg-gray-800 text-white" 
                      : "bg-gray-200 text-gray-900"
                    : darkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => {
                  addToast("Messages functionality is not available yet.", "info")
                  setMobileMenuOpen(false)
                }}
              >
                <MessageSquare className="h-6 w-6" />
                <span className="font-medium">Messages</span>
              </button>

              <button
                className={`flex items-center space-x-4 p-4 rounded-xl transition-colors cursor-pointer ${
                  activeTab === "explore" 
                    ? darkMode 
                      ? "bg-gray-800 text-white" 
                      : "bg-gray-200 text-gray-900"
                    : darkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => {
                  addToast("Explore functionality is not available yet.", "info")
                  setMobileMenuOpen(false)
                }}
              >
                <Compass className="h-6 w-6" />
                <span className="font-medium">Explore</span>
              </button>

              <button
                className={`flex items-center space-x-4 p-4 rounded-xl transition-colors cursor-pointer ${
                  activeTab === "notifications" 
                    ? darkMode 
                      ? "bg-gray-800 text-white" 
                      : "bg-gray-200 text-gray-900"
                    : darkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => {
                  addToast("Notifications functionality is not available yet.", "info")
                  setMobileMenuOpen(false)
                }}
              >
                <Bell className="h-6 w-6" />
                <span className="font-medium">Notifications</span>
              </button>

              <button
                className={`flex items-center space-x-4 p-4 rounded-xl transition-colors cursor-pointer ${
                  activeTab === "profile" 
                    ? darkMode 
                      ? "bg-gray-800 text-white" 
                      : "bg-gray-200 text-gray-900"
                    : darkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => {
                  setActiveTab("profile")
                  setMobileMenuOpen(false)
                }}
              >
                <User className="h-6 w-6" />
                <span className="font-medium">Profile</span>
              </button>
            </nav>

            <div className={`mt-6 pt-6 border-t ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
              <button
                className={`flex items-center justify-center w-full p-4 rounded-xl font-medium cursor-pointer text-white transition-colors`}
                style={{ backgroundColor: primaryColor }}
                onClick={() => {
                  setShowCreateDebate(true)
                  setMobileMenuOpen(false)
                }}
              >
                <PenSquare className="h-6 w-6 mr-2" />
                <span>Start Debate</span>
              </button>
            </div>
          </div>

          <div className={`border-t ${darkMode ? "border-gray-800" : "border-gray-100"} p-4`}>
            <div className="flex items-center space-x-3">
              <img
                src={currentUser.avatar || "/placeholder.svg"}
                alt={currentUser.name}
                className={`h-12 w-12 rounded-full object-cover border-2 ${darkMode ? "border-gray-800" : "border-white"}`}
              />
              <div>
                <p className="font-medium">{currentUser.name}</p>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>@{currentUser.username}</p>
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
              onClick={() => handleTabChange("feed")}
            >
              <Home className="h-6 w-6" />
              <span>Home</span>
            </button>

            <button
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors cursor-pointer ${activeTab === "explore" ? (darkMode ? "bg-gray-800" : "bg-gray-200") : darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
              onClick={() => handleTabChange("explore")}
            >
              <Compass className="h-6 w-6" />
              <span>Explore</span>
            </button>

            <button
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors cursor-pointer ${activeTab === "messages" ? (darkMode ? "bg-gray-800" : "bg-gray-200") : darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
              onClick={() => handleTabChange("messages")}
            >
              <MessageSquare className="h-6 w-6" />
              <span>Messages</span>
            </button>

            <button
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors cursor-pointer ${activeTab === "notifications" ? (darkMode ? "bg-gray-800" : "bg-gray-200") : darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
              onClick={() => handleTabChange("notifications")}
            >
              <Bell className="h-6 w-6" />
              <span>Notifications</span>
            </button>

            <button
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors cursor-pointer ${activeTab === "profile" ? (darkMode ? "bg-gray-800" : "bg-gray-200") : darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
              onClick={() => handleTabChange("profile")}
            >
              <User className="h-6 w-6" />
              <span>Profile</span>
            </button>

            <button
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors cursor-pointer text-white mt-4`}
              style={{ backgroundColor: primaryColor }}
              onClick={() => setShowCreateDebate(true)}
            >
              <PenSquare className="h-6 w-6" />
              <span>Start Debate</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 max-w-2xl mx-auto">
          {/* Create Debate Modal */}
          {showCreateDebate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 p-4 overflow-y-auto">
              <div className={`w-full max-w-lg rounded-xl shadow-md ${darkMode ? "bg-gray-800" : "bg-white"} mx-auto my-4 max-h-[90vh] overflow-y-auto`}>
                <div className={`sticky top-0 z-10 flex justify-between items-center p-4 md:p-6 ${darkMode ? "bg-gray-800" : "bg-white"} border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                  <h2 className="text-xl font-bold">Start a Debate</h2>
                  <button
                    className={`p-2 rounded-full cursor-pointer ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
                    onClick={() => setShowCreateDebate(false)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-5 md:p-6">
                  <div className="flex items-center space-x-3 mb-5">
                    <img
                      src={currentUser.avatar || "/placeholder.svg"}
                      alt={currentUser.name}
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-offset-2 ring-gray-100 dark:ring-gray-700"
                    />
                    <div>
                      <p className="font-medium">{currentUser.name}</p>
                      <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>@{currentUser.username}</p>
                    </div>
                  </div>

                  <textarea
                    placeholder="Present your argument..."
                    className={`w-full p-4 rounded-xl mb-5 ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} focus:outline-none resize-none`}
                    rows={4}
                    value={newDebateText}
                    onChange={(e) => setNewDebateText(e.target.value)}
                  ></textarea>

                  {/* Stance Selection */}
                  <div className="mb-5">
                    <p className="text-sm font-medium mb-2.5">Your stance:</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          newDebateStance === "for"
                            ? "text-white"
                            : darkMode
                              ? "bg-gray-700 text-gray-300"
                              : "bg-gray-100 text-gray-700"
                        }`}
                        style={{ backgroundColor: newDebateStance === "for" ? "#6B9E76" : undefined }}
                        onClick={() => handleSetStance("for")}
                      >
                        For
                      </button>
                      <button
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          newDebateStance === "against"
                            ? "text-white"
                            : darkMode
                              ? "bg-gray-700 text-gray-300"
                              : "bg-gray-100 text-gray-700"
                        }`}
                        style={{ backgroundColor: newDebateStance === "against" ? "#C97878" : undefined }}
                        onClick={() => handleSetStance("against")}
                      >
                        Against
                      </button>
                      <button
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          newDebateStance === "neutral"
                            ? "text-white"
                            : darkMode
                              ? "bg-gray-700 text-gray-300"
                              : "bg-gray-100 text-gray-700"
                        }`}
                        style={{ backgroundColor: newDebateStance === "neutral" ? "#7B96B8" : undefined }}
                        onClick={() => handleSetStance("neutral")}
                      >
                        Neutral
                      </button>
                    </div>
                  </div>

                  {newDebateImage && (
                    <div className="mb-5 relative">
                      <img
                        src={newDebateImage || "/placeholder.svg"}
                        alt="Debate preview"
                        className="w-full h-64 object-cover rounded-xl"
                      />
                      <button
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-black bg-opacity-60 text-white cursor-pointer transition-opacity hover:bg-opacity-80"
                        onClick={() => setNewDebateImage(null)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-5">
                    <button
                      className={`p-3 rounded-xl flex items-center space-x-2 transition-colors cursor-pointer ${
                        darkMode 
                          ? "bg-gray-700/50 hover:bg-gray-700 text-gray-300" 
                          : "bg-gray-50 hover:bg-gray-100 text-gray-600"
                      }`}
                      onClick={() => setShowImageInput(!showImageInput)}
                    >
                      <ImageIcon className="h-5 w-5" style={{ color: primaryColor }} />
                      <span>Add Image</span>
                    </button>
                    <button
                      className={`p-3 rounded-xl flex items-center space-x-2 transition-colors cursor-pointer ${
                        darkMode 
                          ? "bg-gray-700/50 hover:bg-gray-700 text-gray-300" 
                          : "bg-gray-50 hover:bg-gray-100 text-gray-600"
                      }`}
                      onClick={() => setShowTopicPicker(!showTopicPicker)}
                    >
                      <TrendingUp className="h-5 w-5" style={{ color: primaryColor }} />
                      <span>Add Topic</span>
                    </button>
                  </div>

                  {showImageInput && (
                    <div className={`mb-5 p-4 rounded-xl ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                      <p className="mb-3 text-sm font-medium">Add an image URL:</p>
                      <div className="flex flex-col sm:flex-row">
                        <input
                          type="text"
                          placeholder="https://example.com/image.jpg"
                          className={`flex-1 p-3 rounded-xl sm:rounded-r-none ${
                            darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
                          } focus:outline-none mb-2 sm:mb-0`}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddImage(e.currentTarget.value)
                            }
                          }}
                        />
                        <button
                          className={`px-4 py-3 rounded-xl sm:rounded-l-none text-white transition-colors`}
                          style={{ backgroundColor: primaryColor }}
                          onClick={(e) => handleAddImage((e.currentTarget.previousSibling as HTMLInputElement).value)}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}

                  {showTopicPicker && (
                    <div className={`mb-5 p-4 rounded-xl ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                      <p className="mb-3 text-sm font-medium">Select a topic:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "Politics",
                          "Economics",
                          "Technology",
                          "Environment",
                          "Ethics",
                          "Education",
                          "Health",
                          "Society",
                        ].map((topic) => (
                          <button
                            key={topic}
                            className={`p-3 rounded-xl text-sm cursor-pointer transition-colors ${
                              newDebateTopic === topic
                                ? "text-white"
                                : darkMode
                                  ? "bg-gray-700 hover:bg-gray-600"
                                  : "bg-gray-100 hover:bg-gray-200"
                            }`}
                            style={{ backgroundColor: newDebateTopic === topic ? primaryColor : undefined }}
                            onClick={() => handleAddTopic(topic)}
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                      {newDebateTopic && (
                        <div className="mt-3 flex items-center">
                          <p className="text-sm">
                            Topic: <span className="font-medium">{newDebateTopic}</span>
                          </p>
                          <button
                            className="ml-2 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                            onClick={() => setNewDebateTopic(null)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    className={`w-full py-3 rounded-xl font-medium cursor-pointer text-white transition-colors ${
                      !newDebateText.trim() ? "bg-gray-300 text-gray-500 cursor-not-allowed" : ""
                    }`}
                    style={{ backgroundColor: newDebateText.trim() ? primaryColor : undefined }}
                    onClick={handleCreateDebate}
                    disabled={!newDebateText.trim()}
                  >
                    Start Debate
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Feed Tab */}
          {activeTab === "feed" && (
            <div className="space-y-6">
              {/* Create Debate - Modern Flat Design */}
              <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-none border-0`}>
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={currentUser.avatar || "/placeholder.svg"}
                      alt={currentUser.name}
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-offset-2 ring-gray-100 dark:ring-gray-700"
                    />
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
                  </div>
                  <div 
                    className={`flex-1 ml-4 p-3.5 rounded-xl text-left transition-colors cursor-pointer ${
                      darkMode 
                        ? "bg-gray-700/50 hover:bg-gray-700 text-gray-300" 
                        : "bg-gray-50 hover:bg-gray-100 text-gray-500"
                    } focus:outline-none`}
                    onClick={() => setShowCreateDebate(true)}
                  >
                    <span className="text-sm font-normal">What's your argument, {currentUser.name.split(" ")[0]}?</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mt-5">
                  <button
                    className={`flex items-center justify-center p-3 rounded-xl transition-colors cursor-pointer ${
                      darkMode 
                        ? "bg-gray-700/50 hover:bg-gray-700 text-gray-300" 
                        : "bg-gray-50 hover:bg-gray-100 text-gray-600"
                    }`}
                    onClick={() => {
                      setShowCreateDebate(true)
                      setShowImageInput(true)
                    }}
                  >
                    <ImageIcon className="h-4.5 w-4.5 mr-2" />
                    <span className="text-sm">Image</span>
                  </button>
                  
                  <button
                    className={`flex items-center justify-center p-3 rounded-xl transition-colors cursor-pointer ${
                      darkMode 
                        ? "bg-gray-700/50 hover:bg-gray-700 text-gray-300" 
                        : "bg-gray-50 hover:bg-gray-100 text-gray-600"
                    }`}
                    onClick={() => {
                      setShowCreateDebate(true)
                      setShowTopicPicker(true)
                    }}
                  >
                    <TrendingUp className="h-4.5 w-4.5 mr-2" />
                    <span className="text-sm">Topic</span>
                  </button>
                  
                  <button
                    className={`flex items-center justify-center p-3 rounded-xl font-medium transition-colors text-white cursor-pointer`}
                    style={{ backgroundColor: primaryColor }}
                    onClick={() => setShowCreateDebate(true)}
                  >
                    <PenSquare className="h-4.5 w-4.5 mr-2" />
                    <span className="text-sm">Debate</span>
                  </button>
                </div>
              </div>

              {/* Debates */}
              {filteredDebates.length > 0 ? (
                filteredDebates
                  .filter((debate) => debate.user.id !== "user-3")
                  .map((debate) => (
                    <DebateCard
                      key={debate.id}
                      debate={debate}
                      darkMode={darkMode}
                      onLike={handleLike}
                      onVote={handleVote}
                      onBookmark={onBookmarkDebate}
                      onComment={handleComment}
                      onShare={handleShareDebate}
                      currentUser={currentUser}
                      onViewProfile={handleViewUserProfile}
                      activeDropdown={activeDropdown}
                      onToggleDropdown={toggleDropdown}
                      onDebateAction={handleDebateAction}
                      setDebates={setDebates}
                      debates={debates}
                      primaryColor={primaryColor}
                    />
                  ))
              ) : (
                <div className={`p-8 rounded-xl text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                  <p className="text-lg font-medium">No debates found</p>
                  <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {searchQuery ? "Try a different search term" : "Follow more people to see debates"}
                  </p>
                  
                  {searchQuery && (
                    <button
                      className={`mt-4 px-4 py-2 rounded-lg font-medium cursor-pointer text-white transition-colors`}
                      style={{ backgroundColor: primaryColor }}
                      onClick={resetSearch}
                    >
                      Reset Search
                    </button>
                  )}
                </div>
              )}
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
                  <div className={`p-4 rounded-xl shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
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
                        <div className="mt-2 flex flex-wrap gap-2">
                          {viewedUserProfile.expertise?.map((topic) => (
                            <span
                              key={topic}
                              className="px-2 py-1 text-xs rounded-full text-white"
                              style={{ backgroundColor: primaryColor }}
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <div>
                        <p className="font-medium">{viewedUserProfile.followers}</p>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Followers</p>
                      </div>
                      <div>
                        <p className="font-medium">{viewedUserProfile.following}</p>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Following</p>
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: primaryColor }}>
                          {viewedUserProfile.debateScore}
                        </p>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Debate Score</p>
                      </div>
                    </div>

                    <button
                      className={`mt-2 px-4 py-2 rounded-full font-medium cursor-pointer ${
                        viewedUserProfile.isFollowing ? "bg-gray-300 text-gray-500" : "text-white"
                      }`}
                      style={{ backgroundColor: viewedUserProfile.isFollowing ? undefined : primaryColor }}
                      onClick={() => handleFollowUser(viewedUserProfile.id)}
                    >
                      {viewedUserProfile.isFollowing ? "Following" : "Follow"}
                    </button>
                  </div>

                  {/* User Debates */}
                  <div className="space-y-6">
                    {debates
                      .filter((debate) => debate.user.id === viewedUserProfile.id)
                      .map((debate) => (
                        <DebateCard
                          key={debate.id}
                          debate={debate}
                          darkMode={darkMode}
                          onLike={handleLike}
                          onVote={handleVote}
                          onBookmark={onBookmarkDebate}
                          onComment={handleComment}
                          onShare={handleShareDebate}
                          currentUser={currentUser}
                          onViewProfile={handleViewUserProfile}
                          activeDropdown={activeDropdown}
                          onToggleDropdown={toggleDropdown}
                          onDebateAction={handleDebateAction}
                          setDebates={setDebates}
                          debates={debates}
                          primaryColor={primaryColor}
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
                      <div className="mt-2 flex flex-wrap gap-2">
                        {currentUser.expertise?.map((topic) => (
                          <span
                            key={topic}
                            className="px-2 py-1 text-xs rounded-full text-white"
                            style={{ backgroundColor: primaryColor }}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <div>
                      <p className="font-medium">{currentUser.followers}</p>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Followers</p>
                    </div>
                    <div>
                      <p className="font-medium">{currentUser.following}</p>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Following</p>
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: primaryColor }}>
                        {currentUser.debateScore}
                      </p>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Debate Score</p>
                    </div>
                  </div>

                  <div className="space-y-6 mt-6">
                    {debates
                      .filter((debate) => debate.user.id === currentUser.id)
                      .map((debate) => (
                        <DebateCard
                          key={debate.id}
                          debate={debate}
                          darkMode={darkMode}
                          onLike={handleLike}
                          onVote={handleVote}
                          onBookmark={onBookmarkDebate}
                          onComment={handleComment}
                          onShare={handleShareDebate}
                          currentUser={currentUser}
                          onViewProfile={handleViewUserProfile}
                          activeDropdown={activeDropdown}
                          onToggleDropdown={toggleDropdown}
                          onDebateAction={handleDebateAction}
                          setDebates={setDebates}
                          debates={debates}
                          primaryColor={primaryColor}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        {activeTab === "feed" && (
          <aside className="hidden md:block w-64 ml-8">
            <div className="sticky top-24 space-y-6">
              <div className={`p-4 rounded-xl shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <h2 className="text-lg font-bold mb-4">Trending Debates</h2>
                <div className="space-y-3">
                  {trendingTopics.slice(0, 5).map((topic) => (
                    <button
                      key={topic.id}
                      className={`flex items-center justify-between w-full p-3 rounded-lg cursor-pointer ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                      onClick={() => handleTrendingTopicClick(topic.id)}
                    >
                      <div className="flex-1 flex items-center">
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">{topic.title}</p>
                          <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{topic.category}</p>
                        </div>
                        <div className="flex items-center">
                          {topic.trend === "up" ? (
                            <ArrowUp className="h-3.5 w-3.5 text-green-500 mr-1" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5 text-red-500 mr-1" />
                          )}
                          <span className="text-sm font-medium">{topic.debates}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}
      </main>
    </div>
  )
}

// DebateCard component props interface
interface DebateCardProps {
  debate: Debate;
  darkMode: boolean;
  onLike: (debateId: string) => void;
  onVote: (debateId: string, voteType: "up" | "down") => void;
  onBookmark: (debateId: string) => void;
  onComment: (debateId: string, comment: string, stance: "for" | "against" | "neutral") => void;
  onShare: (debateId: string) => void;
  currentUser: AppUser;
  onViewProfile: (user: AppUser) => void;
  activeDropdown: string | null;
  onToggleDropdown: (id: string) => void;
  onDebateAction: (action: string, debateId: string) => void;
  setDebates: React.Dispatch<React.SetStateAction<Debate[]>>;
  debates: Debate[];
  primaryColor: string;
}

// DebateCard component
function DebateCard({
  debate,
  darkMode,
  onLike,
  onVote,
  onBookmark,
  onComment,
  onShare,
  currentUser,
  onViewProfile,
  activeDropdown,
  onToggleDropdown,
  onDebateAction,
  setDebates,
  debates,
  primaryColor,
}: DebateCardProps) {
  const [commentText, setCommentText] = useState("")
  const [commentStance, setCommentStance] = useState<"for" | "against" | "neutral">("neutral")
  const [showComments, setShowComments] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [expandedReplies, setExpandedReplies] = useState<string[]>([])

  const handleSubmitComment = () => {
    if (!commentText.trim()) return
    onComment(debate.id, commentText, commentStance)
    setCommentText("")
    setCommentStance("neutral")
  }

  const handleCommentVote = (commentId: string, voteType: "up" | "down") => {
    setDebates(
      debates.map((d: Debate) => {
        if (d.id === debate.id) {
          return {
            ...d,
            comments: d.comments.map((comment: Comment) => {
              if (comment.id === commentId) {
                // If already voted the same way, remove vote
                if (comment.userVote === voteType) {
                  return {
                    ...comment,
                    votes: {
                      ...comment.votes,
                      [voteType]: comment.votes[voteType] - 1,
                    },
                    userVote: null,
                  }
                }
                // If voted the opposite way, switch vote
                else if (comment.userVote) {
                  return {
                    ...comment,
                    votes: {
                      up: voteType === "up" ? comment.votes.up + 1 : comment.votes.up - 1,
                      down: voteType === "down" ? comment.votes.down + 1 : comment.votes.down - 1,
                    },
                    userVote: voteType,
                  }
                }
                // If not voted yet, add vote
                else {
                  return {
                    ...comment,
                    votes: {
                      ...comment.votes,
                      [voteType]: comment.votes[voteType] + 1,
                    },
                    userVote: voteType,
                  }
                }
              }
              return comment
            }),
          }
        }
        return d
      }),
    )
  }

  const handleReplyToComment = (commentId: string, stance: "for" | "against" | "neutral") => {
    if (!replyText.trim()) return

    setDebates(
      debates.map((d: Debate) => {
        if (d.id === debate.id) {
          return {
            ...d,
            comments: d.comments.map((comment: Comment) => {
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
                      stance: stance,
                      votes: {
                        up: 0,
                        down: 0,
                      },
                    },
                  ],
                }
              }
              return comment
            }),
          }
        }
        return d
      }),
    )

    setReplyText("")
    setReplyingTo(null)
  }

  const handleReplyVote = (commentId: string, replyId: string, voteType: "up" | "down") => {
    setDebates(
      debates.map((d: Debate) => {
        if (d.id === debate.id) {
          return {
            ...d,
            comments: d.comments.map((comment: Comment) => {
              if (comment.id === commentId && comment.replies) {
                return {
                  ...comment,
                  replies: comment.replies.map((reply: Reply) => {
                    if (reply.id === replyId) {
                      // If already voted the same way, remove vote
                      if (reply.userVote === voteType) {
                        return {
                          ...reply,
                          votes: {
                            ...reply.votes,
                            [voteType]: reply.votes[voteType] - 1,
                          },
                          userVote: null,
                        }
                      }
                      // If voted the opposite way, switch vote
                      else if (reply.userVote) {
                        return {
                          ...reply,
                          votes: {
                            up: voteType === "up" ? reply.votes.up + 1 : reply.votes.up - 1,
                            down: voteType === "down" ? reply.votes.down + 1 : reply.votes.down - 1,
                          },
                          userVote: voteType,
                        }
                      }
                      // If not voted yet, add vote
                      else {
                        return {
                          ...reply,
                          votes: {
                            ...reply.votes,
                            [voteType]: reply.votes[voteType] + 1,
                          },
                          userVote: voteType,
                        }
                      }
                    }
                    return reply
                  }),
                }
              }
              return comment
            }),
          }
        }
        return d
      }),
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

  const getStanceColor = (stance: "for" | "against" | "neutral") => {
    switch (stance) {
      case "for":
        return "#6B9E76" // Subtle green
      case "against":
        return "#C97878" // Subtle red
      case "neutral":
        return "#7B96B8" // Subtle blue
      default:
        return "#757575" // Gray
    }
  }

  return (
    <div className={`rounded-xl shadow-sm overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      {/* Debate Header - Modern Flat Design */}
      <div className="p-5 flex items-center">
        <img
          src={debate.user.avatar || "/placeholder.svg"}
          alt={debate.user.name}
          className="h-10 w-10 rounded-full object-cover cursor-pointer border-2 border-white shadow-sm"
          onClick={() => onViewProfile(debate.user)}
        />
        <div className="ml-4 flex-1">
          <div className="flex items-center">
            <p className="font-medium cursor-pointer" onClick={() => onViewProfile(debate.user)}>
              {debate.user.name}
            </p>
            <span
              className="ml-2.5 px-2.5 py-0.5 text-xs rounded-full text-white font-medium"
              style={{ backgroundColor: getStanceColor(debate.stance) }}
            >
              {debate.stance.charAt(0).toUpperCase() + debate.stance.slice(1)}
            </span>
          </div>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            <span>{formatTimeAgo(debate.timestamp)}</span>
            <span className="mx-1.5">•</span>
            <span>{debate.topic}</span>
          </div>
        </div>
      </div>

      {/* Debate Content - Modern Flat Design */}
      <div className="px-5 pb-4">
        <p className="mb-4 text-sm leading-relaxed">{debate.text}</p>
        {debate.image && (
          <div className="rounded-lg overflow-hidden shadow-sm">
            <img
              src={debate.image || "/placeholder.svg"}
              alt="Debate"
              className="w-full h-auto object-cover"
            />
          </div>
        )}
      </div>

      {/* Debate Stats - Modern Flat Design */}
      <div
        className={`px-5 py-2.5 flex items-center justify-between text-xs ${darkMode ? "bg-gray-750 text-gray-300" : "bg-gray-50 text-gray-500"}`}
      >
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <ThumbsUp
              className={`h-4 w-4 mr-2 cursor-pointer transition-colors ${debate.userVote === "up" ? "fill-current text-green-500" : ""}`}
              onClick={() => onVote(debate.id, "up")}
              style={{ color: debate.userVote === "up" ? "#6B9E76" : undefined }}
            />
            <span className="font-medium">{debate.votes.up}</span>
          </div>
          <div className="flex items-center">
            <ThumbsDown
              className={`h-4 w-4 mr-2 cursor-pointer transition-colors ${debate.userVote === "down" ? "fill-current text-red-500" : ""}`}
              onClick={() => onVote(debate.id, "down")}
              style={{ color: debate.userVote === "down" ? "#C97878" : undefined }}
            />
            <span className="font-medium">{debate.votes.down}</span>
          </div>
        </div>
        <div className="flex items-center space-x-5">
          <span>{debate.comments.length} comments</span>
          <span>{debate.shares} shares</span>
        </div>
      </div>

      {/* Debate Actions - Modern Flat Design */}
      <div
        className={`px-5 py-2.5 flex items-center justify-between ${darkMode ? "border-t border-gray-700" : "border-t border-gray-100"}`}
      >
        <button
          className={`flex-1 flex items-center justify-center p-2.5 rounded-md transition-colors cursor-pointer ${
            debate.liked 
              ? "text-pink-500" 
              : darkMode 
                ? "text-gray-400 hover:bg-gray-700 hover:text-gray-200" 
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          }`}
          onClick={() => onLike(debate.id)}
        >
          <Heart className={`h-5 w-5 ${debate.liked ? "fill-current" : ""}`} />
          <span className="ml-2 text-sm">Like</span>
        </button>

        <button
          className={`flex-1 flex items-center justify-center p-2.5 mx-2 rounded-md transition-colors cursor-pointer ${
                      darkMode 
                        ? "text-gray-400 hover:bg-gray-700 hover:text-gray-200" 
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    }`}
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="ml-2 text-sm">Comment</span>
        </button>

        <button
          className={`flex-1 flex items-center justify-center p-2.5 rounded-md transition-colors cursor-pointer ${
            darkMode 
              ? "text-gray-400 hover:bg-gray-700 hover:text-gray-200" 
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          }`}
          onClick={() => onShare(debate.id)}
        >
          <Share2 className="h-5 w-5" />
          <span className="ml-2 text-sm">Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-4">
          {/* Comment Input */}
          <div className="mb-4">
            <div className="flex items-center space-x-3 mb-2">
              <img
                src={currentUser.avatar || "/placeholder.svg"}
                alt={currentUser.name}
                className="h-8 w-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <textarea
                  placeholder="Add to the debate..."
                  className={`w-full p-2 rounded-lg ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} focus:outline-none`}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={2}
                ></textarea>
              </div>
            </div>

                          <div className="flex justify-between items-center ml-11">
              <div className="flex space-x-2">
                <button
                  className={`flex items-center justify-center p-2 rounded-lg ${
                    commentStance === "for"
                      ? "text-white"
                      : darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-700"
                  }`}
                  style={{ backgroundColor: commentStance === "for" ? "#6B9E76" : undefined }}
                  onClick={() => setCommentStance("for")}
                  aria-label="For"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="ml-1 text-xs hidden sm:inline">For</span>
                </button>
                <button
                  className={`flex items-center justify-center p-2 rounded-lg ${
                    commentStance === "against"
                      ? "text-white"
                      : darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-700"
                  }`}
                  style={{ backgroundColor: commentStance === "against" ? "#C97878" : undefined }}
                  onClick={() => setCommentStance("against")}
                  aria-label="Against"
                >
                  <XCircle className="h-4 w-4" />
                  <span className="ml-1 text-xs hidden sm:inline">Against</span>
                </button>
                <button
                  className={`flex items-center justify-center p-2 rounded-lg ${
                    commentStance === "neutral"
                      ? "text-white"
                      : darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-700"
                  }`}
                  style={{ backgroundColor: commentStance === "neutral" ? "#7B96B8" : undefined }}
                  onClick={() => setCommentStance("neutral")}
                  aria-label="Neutral"
                >
                  <CircleDot className="h-4 w-4" />
                  <span className="ml-1 text-xs hidden sm:inline">Neutral</span>
                </button>
              </div>

              <button
                className={`flex items-center justify-center p-2 rounded-lg text-white ${
                  !commentText.trim() ? "opacity-50 cursor-not-allowed" : ""
                }`}
                style={{ backgroundColor: primaryColor }}
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
                aria-label="Send Comment"
              >
                <Send className="h-4 w-4" />
                <span className="ml-1.5 text-xs hidden sm:inline">Comment</span>
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {debate.comments.map((comment: Comment) => (
              <div key={comment.id} className="space-y-2">
                <div className="flex items-start space-x-3">
                  <img
                    src={comment.user.avatar || "/placeholder.svg"}
                    alt={comment.user.name}
                    className="h-8 w-8 rounded-full object-cover cursor-pointer"
                    onClick={() => onViewProfile(comment.user)}
                  />
                  <div className="flex-1">
                    <div
                      className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                      style={{ borderLeft: `3px solid ${getStanceColor(comment.stance)}` }}
                    >
                      <div className="flex items-center">
                        <div className="flex items-center flex-1">
                          <p className="font-medium cursor-pointer" onClick={() => onViewProfile(comment.user)}>
                            {comment.user.name}
                          </p>
                          <span
                            className="ml-2 px-1.5 py-0.5 text-xs rounded-full text-white"
                            style={{ backgroundColor: getStanceColor(comment.stance) }}
                          >
                            {comment.stance.charAt(0).toUpperCase() + comment.stance.slice(1)}
                          </span>
                          <p className={`ml-2 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {formatTimeAgo(comment.timestamp)}
                          </p>
                        </div>
                      </div>
                      <p className="mt-1">{comment.text}</p>

                      {/* Comment Voting */}
                      <div className="flex items-center space-x-3 mt-2">
                        <div className="flex items-center space-x-1">
                          <ThumbsUp
                            className={`h-3.5 w-3.5 cursor-pointer ${comment.userVote === "up" ? "fill-current" : ""}`}
                            style={{ color: comment.userVote === "up" ? "#6B9E76" : undefined }}
                            onClick={() => handleCommentVote(comment.id, "up")}
                          />
                          <span className="text-xs">{comment.votes?.up || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ThumbsDown
                            className={`h-3.5 w-3.5 cursor-pointer ${comment.userVote === "down" ? "fill-current" : ""}`}
                            style={{ color: comment.userVote === "down" ? "#C97878" : undefined }}
                            onClick={() => handleCommentVote(comment.id, "down")}
                          />
                          <span className="text-xs">{comment.votes?.down || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Comment Actions */}
                    <div className="flex items-center space-x-4 mt-1 ml-1">
                      <button
                        className={`text-xs cursor-pointer ${replyingTo === comment.id ? "" : darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
                        style={{ color: replyingTo === comment.id ? primaryColor : undefined }}
                        onClick={() => toggleReplyToComment(comment.id)}
                      >
                        Reply {comment.replies && comment.replies.length > 0 ? `(${comment.replies.length})` : ""}
                      </button>
                    </div>

                    {/* Replies */}
                    {expandedReplies.includes(comment.id) && comment.replies && comment.replies.length > 0 && (
                      <div className="ml-6 mt-2 space-y-2">
                        {comment.replies.map((reply: Reply) => (
                          <div key={reply.id} className="flex items-start space-x-2">
                            <img
                              src={reply.user.avatar || "/placeholder.svg"}
                              alt={reply.user.name}
                              className="h-6 w-6 rounded-full object-cover cursor-pointer"
                              onClick={() => onViewProfile(reply.user)}
                            />
                            <div className="flex-1">
                              <div
                                className={`p-2 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                                style={{ borderLeft: `2px solid ${getStanceColor(reply.stance)}` }}
                              >
                                <div className="flex items-center">
                                  <div className="flex items-center flex-1">
                                    <p
                                      className="font-medium text-sm cursor-pointer"
                                      onClick={() => onViewProfile(reply.user)}
                                    >
                                      {reply.user.name}
                                    </p>
                                    <span
                                      className="ml-2 px-1 py-0.5 text-xs rounded-full text-white"
                                      style={{ backgroundColor: getStanceColor(reply.stance) }}
                                    >
                                      {reply.stance.charAt(0).toUpperCase() + reply.stance.slice(1)}
                                    </span>
                                    <p className={`ml-2 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                      {formatTimeAgo(reply.timestamp)}
                                    </p>
                                  </div>
                                </div>
                                <p className="mt-1 text-sm">{reply.text}</p>

                                {/* Reply Voting */}
                                <div className="flex items-center space-x-3 mt-1">
                                  <div className="flex items-center space-x-1">
                                    <ThumbsUp
                                      className={`h-3 w-3 cursor-pointer ${reply.userVote === "up" ? "fill-current" : ""}`}
                                      style={{ color: reply.userVote === "up" ? "#6B9E76" : undefined }}
                                      onClick={() => handleReplyVote(comment.id, reply.id, "up")}
                                    />
                                    <span className="text-xs">{reply.votes?.up || 0}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <ThumbsDown
                                      className={`h-3 w-3 cursor-pointer ${reply.userVote === "down" ? "fill-current" : ""}`}
                                      style={{ color: reply.userVote === "down" ? "#C97878" : undefined }}
                                      onClick={() => handleReplyVote(comment.id, reply.id, "down")}
                                    />
                                    <span className="text-xs">{reply.votes?.down || 0}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input */}
                    {replyingTo === comment.id && (
                      <div className="ml-6 mt-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <img
                            src={currentUser.avatar || "/placeholder.svg"}
                            alt={currentUser.name}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <textarea
                              placeholder={`Reply to ${comment.user.name}...`}
                              className={`w-full p-2 text-sm rounded-lg ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} focus:outline-none`}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              rows={2}
                            ></textarea>
                          </div>
                        </div>

                        <div className="flex justify-between items-center ml-6">
                          <div className="flex space-x-2">
                            <button
                              className="flex items-center justify-center p-1.5 rounded-lg text-white cursor-pointer"
                              style={{ backgroundColor: "#6B9E76" }}
                              onClick={() => handleReplyToComment(comment.id, "for")}
                              aria-label="For"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span className="ml-1 text-xs hidden sm:inline">For</span>
                            </button>
                            <button
                              className="flex items-center justify-center p-1.5 rounded-lg text-white cursor-pointer"
                              style={{ backgroundColor: "#C97878" }}
                              onClick={() => handleReplyToComment(comment.id, "against")}
                              aria-label="Against"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              <span className="ml-1 text-xs hidden sm:inline">Against</span>
                            </button>
                            <button
                              className="flex items-center justify-center p-1.5 rounded-lg text-white cursor-pointer"
                              style={{ backgroundColor: "#7B96B8" }}
                              onClick={() => handleReplyToComment(comment.id, "neutral")}
                              aria-label="Neutral"
                            >
                              <CircleDot className="h-3.5 w-3.5" />
                              <span className="ml-1 text-xs hidden sm:inline">Neutral</span>
                            </button>
                          </div>

                          <button
                            className="flex items-center justify-center p-1.5 rounded-lg cursor-pointer"
                            style={{ color: primaryColor }}
                            onClick={() => setReplyingTo(null)}
                            aria-label="Cancel"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span className="ml-1 text-xs hidden sm:inline">Cancel</span>
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