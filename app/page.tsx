"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { Heart, MessageCircle, Users, MapPin, Calendar, Search, Bell, User, Plus, Share2, X, Send,ChevronDown, Check, Menu, Home, Briefcase, Filter, Clock, DollarSign, } from "lucide-react" 

interface AppUser {
  id: string
  name: string
  avatar: string
  verified: boolean
}

interface Comment {
  id: string
  user: AppUser
  content: string
  likes: number
  isLiked: boolean
  replies: Comment[]
  timestamp: string
}

interface EventPost {
  id: string
  user: AppUser
  eventName: string
  venue: string
  city: string
  description: string
  image: string
  eventDate: string
  eventTime: string
  duration: string
  ticketPrice: string
  maxAttendees: number
  currentAttendees: number
  category: string
  tags: string[]
  likes: number
  comments: Comment[]
  isLiked: boolean
  postedAt: string
  hasJoined: boolean
}

interface Notification {
  id: string
  type: "join" | "like" | "comment"
  message: string
  timestamp: string
  read: boolean
  postId: string
}

const currentUser: AppUser = {
  id: "current-user",
  name: "Priya Sharma",
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  verified: true,
}

const mockUsers: AppUser[] = [
  {
    id: "1",
    name: "Arjun Patel",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    verified: true,
  },
  {
    id: "2",
    name: "Kavya Reddy",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    verified: false,
  },
  {
    id: "3",
    name: "Rohit Singh",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    verified: true,
  },
  {
    id: "4",
    name: "Ananya Gupta",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    verified: false,
  },
]

const eventCategories = [
  "All",
  "Standup Comedy",
  "Movies",
  "Poetry Show",
  "Concert",
  "Theater",
  "Magic Show",
  "Dance",
  "Music",
  "Art Exhibition",
]

const initialPosts: EventPost[] = [
  {
    id: "1",
    user: mockUsers[0],
    eventName: "Comedy Night with Top Comedians",
    venue: "The Comedy Store",
    city: "Mumbai",
    description:
      "Join us for an evening of laughter with some of the best standup comedians in the city! Get ready for non-stop entertainment with hilarious acts and interactive comedy sessions.",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop",
    eventDate: "March 15, 2024",
    eventTime: "8:00 PM",
    duration: "3 hours",
    ticketPrice: "₹500 - ₹800",
    maxAttendees: 50,
    currentAttendees: 23,
    category: "Standup Comedy",
    tags: ["Comedy", "Entertainment", "Nightlife", "Laughter"],
    likes: 127,
    comments: [],
    isLiked: false,
    postedAt: "2 hours ago",
    hasJoined: false,
  },
  {
    id: "2",
    user: mockUsers[1],
    eventName: "Indie Film Screening & Discussion",
    venue: "Prithvi Theatre",
    city: "Mumbai",
    description:
      "Experience the magic of independent cinema with a special screening followed by an interactive discussion with the director and cast. Perfect for film enthusiasts and aspiring filmmakers.",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=600&fit=crop",
    eventDate: "April 10, 2024",
    eventTime: "7:00 PM",
    duration: "4 hours",
    ticketPrice: "₹300 - ₹500",
    maxAttendees: 80,
    currentAttendees: 45,
    category: "Movies",
    tags: ["Cinema", "Independent", "Discussion", "Art"],
    likes: 89,
    comments: [],
    isLiked: true,
    postedAt: "5 hours ago",
    hasJoined: false,
  },
  {
    id: "3",
    user: mockUsers[2],
    eventName: "Poetry & Open Mic Night",
    venue: "Cafe Mocha",
    city: "Delhi",
    description:
      "An intimate evening of spoken word poetry, storytelling, and open mic performances. Share your creativity or simply enjoy the beautiful expressions of fellow artists in a cozy atmosphere.",
    image: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=800&h=600&fit=crop",
    eventDate: "May 5, 2024",
    eventTime: "6:30 PM",
    duration: "3 hours",
    ticketPrice: "₹200 - ₹400",
    maxAttendees: 40,
    currentAttendees: 18,
    category: "Poetry Show",
    tags: ["Poetry", "Open Mic", "Storytelling", "Art"],
    likes: 203,
    comments: [],
    isLiked: false,
    postedAt: "1 day ago",
    hasJoined: false,
  },
  {
    id: "4",
    user: mockUsers[3],
    eventName: "Rock Concert - Local Bands",
    venue: "Hard Rock Cafe",
    city: "Bangalore",
    description:
      "Get ready to rock! An electrifying night featuring the best local rock bands. Experience live music, great energy, and connect with fellow music lovers in an unforgettable concert experience.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    eventDate: "June 20, 2024",
    eventTime: "9:00 PM",
    duration: "4 hours",
    ticketPrice: "₹800 - ₹1200",
    maxAttendees: 100,
    currentAttendees: 67,
    category: "Concert",
    tags: ["Rock", "Live Music", "Bands", "Energy"],
    likes: 156,
    comments: [],
    isLiked: true,
    postedAt: "3 days ago",
    hasJoined: false,
  },
  {
    id: "5",
    user: mockUsers[0],
    eventName: "Shakespeare's Hamlet - Modern Adaptation",
    venue: "National Theatre",
    city: "Delhi",
    description:
      "Experience the timeless classic in a bold new interpretation. This modern adaptation of Shakespeare's Hamlet explores contemporary themes while preserving the powerful essence of the original tragedy.",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop",
    eventDate: "July 15, 2024",
    eventTime: "7:30 PM",
    duration: "2.5 hours",
    ticketPrice: "₹600 - ₹1500",
    maxAttendees: 200,
    currentAttendees: 89,
    category: "Theater",
    tags: ["Shakespeare", "Drama", "Classic", "Acting"],
    likes: 112,
    comments: [],
    isLiked: false,
    postedAt: "4 days ago",
    hasJoined: false,
  },
  {
    id: "6",
    user: mockUsers[1],
    eventName: "The Grand Illusion - Magic Spectacular",
    venue: "Royal Opera House",
    city: "Mumbai",
    description:
      "Prepare to be amazed by mind-bending illusions and spectacular magic tricks! This world-class magic show combines visual spectacle, audience participation, and impossible feats that will leave you wondering how it's done.",
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&h=600&fit=crop",
    eventDate: "August 8, 2024",
    eventTime: "8:00 PM",
    duration: "2 hours",
    ticketPrice: "₹800 - ₹2000",
    maxAttendees: 150,
    currentAttendees: 42,
    category: "Magic Show",
    tags: ["Magic", "Illusion", "Entertainment", "Family"],
    likes: 78,
    comments: [],
    isLiked: false,
    postedAt: "1 week ago",
    hasJoined: false,
  },
  {
    id: "7",
    user: mockUsers[2],
    eventName: "Classical Bharatanatyam Performance",
    venue: "Kamani Auditorium",
    city: "Delhi",
    description:
      "Immerse yourself in the grace and beauty of classical Indian dance. This Bharatanatyam performance by renowned dancers showcases traditional storytelling through precise movements, expressions, and rhythmic footwork.",
    image: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=800&h=600&fit=crop",
    eventDate: "September 3, 2024",
    eventTime: "6:00 PM",
    duration: "2 hours",
    ticketPrice: "₹400 - ₹900",
    maxAttendees: 120,
    currentAttendees: 35,
    category: "Dance",
    tags: ["Classical", "Bharatanatyam", "Culture", "Traditional"],
    likes: 92,
    comments: [],
    isLiked: false,
    postedAt: "2 weeks ago",
    hasJoined: false,
  },
  {
    id: "8",
    user: mockUsers[3],
    eventName: "Jazz Night - Tribute to Legends",
    venue: "The Piano Man Jazz Club",
    city: "Bangalore",
    description:
      "A soulful evening dedicated to jazz legends. Experience the smooth sounds of saxophone, piano, and trumpet as talented musicians pay tribute to the greatest jazz artists of all time in an intimate setting.",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop",
    eventDate: "October 12, 2024",
    eventTime: "9:30 PM",
    duration: "3 hours",
    ticketPrice: "₹700 - ₹1000",
    maxAttendees: 80,
    currentAttendees: 28,
    category: "Music",
    tags: ["Jazz", "Live Music", "Tribute", "Nightlife"],
    likes: 64,
    comments: [],
    isLiked: false,
    postedAt: "3 weeks ago",
    hasJoined: false,
  },
  {
    id: "9",
    user: mockUsers[0],
    eventName: "Contemporary Art Exhibition - 'Reflections'",
    venue: "National Gallery of Modern Art",
    city: "Mumbai",
    description:
      "Explore thought-provoking artworks from emerging and established artists in this curated exhibition. 'Reflections' examines the relationship between humanity and nature through various mediums including paintings, sculptures, and digital installations.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    eventDate: "November 5, 2024",
    eventTime: "10:00 AM",
    duration: "All day",
    ticketPrice: "₹250 - ₹350",
    maxAttendees: 500,
    currentAttendees: 123,
    category: "Art Exhibition",
    tags: ["Contemporary", "Art", "Exhibition", "Culture"],
    likes: 87,
    comments: [],
    isLiked: false,
    postedAt: "1 month ago",
    hasJoined: false,
  },
]

export default function EventsSocialPlatform() {
  const [posts, setPosts] = useState<EventPost[]>(initialPosts)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [expandedComments, setExpandedComments] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [filteredPosts, setFilteredPosts] = useState<EventPost[]>(initialPosts)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [currentView, setCurrentView] = useState<"feed" | "myevents">("feed")

  // Refs for click outside detection
  const notificationRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)

  // New event form state
  const [newEvent, setNewEvent] = useState({
    eventName: "",
    venue: "",
    city: "",
    description: "",
    image: null as File | null,
    eventDate: "",
    eventTime: "",
    duration: "",
    ticketPrice: "",
    maxAttendees: 1,
    category: "Standup Comedy",
    tags: [] as string[],
  })

  // Comment state
  const [commentText, setCommentText] = useState("")
  const [replyText, setReplyText] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  // Get user's events
  const userEvents = posts.filter((post) => post.user.id === currentUser.id)

  const [imagePreview, setImagePreview] = useState<string>("")

  useEffect(() => {
    let filtered = posts

    // Filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (post) =>
          post.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory)
    }

    setFilteredPosts(filtered)
  }, [searchQuery, selectedCategory, posts])

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement

      // Don't close if clicking on mark all as read button
      if (target.textContent === "Mark all as read") {
        return
      }

      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false)
      }
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setShowFilters(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showCreateEvent) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [showCreateEvent])

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const addNotification = (type: "join" | "like" | "comment", message: string, postId: string) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: "Just now",
      read: false,
      postId,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewEvent({ ...newEvent, image: file })
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const newIsLiked = !post.isLiked
          if (newIsLiked) {
            addNotification("like", `You liked ${post.eventName} event`, postId)
          }
          return {
            ...post,
            isLiked: newIsLiked,
            likes: newIsLiked ? post.likes + 1 : post.likes - 1,
          }
        }
        return post
      }),
    )
  }

  const handleJoin = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId && post.currentAttendees < post.maxAttendees && !post.hasJoined) {
          addNotification("join", `You joined the ${post.eventName} event!`, postId)
          showToastMessage("Successfully joined the event!")
          return {
            ...post,
            currentAttendees: post.currentAttendees + 1,
            hasJoined: true,
          }
        }
        return post
      }),
    )
  }

  // Add a new function to handle leaving an event
  const handleLeaveEvent = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId && post.hasJoined) {
          showToastMessage("You've left the event.")
          return {
            ...post,
            currentAttendees: post.currentAttendees - 1,
            hasJoined: false,
          }
        }
        return post
      }),
    )
  }

  // Add a new function to handle deleting an event
  const handleDeleteEvent = (postId: string) => {
    const eventToDelete = posts.find((post) => post.id === postId)
    if (eventToDelete) {
      setPosts(posts.filter((post) => post.id !== postId))
      showToastMessage(`"${eventToDelete.eventName}" has been deleted.`)
    }
  }

  const handleShare = (postId: string) => {
    const post = posts.find((p) => p.id === postId)
    if (post) {
      showToastMessage(`${post.eventName} event shared successfully!`)
    }
  }

  const handleCreateEvent = () => {
    if (!newEvent.eventName || !newEvent.description || !newEvent.image) {
      showToastMessage("Please fill all required fields including uploading an image!")
      return
    }

    const imageUrl = imagePreview || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop"

    const event: EventPost = {
      id: Date.now().toString(),
      user: currentUser,
      eventName: newEvent.eventName,
      venue: newEvent.venue,
      city: newEvent.city,
      description: newEvent.description,
      image: imageUrl,
      eventDate: newEvent.eventDate,
      eventTime: newEvent.eventTime,
      duration: newEvent.duration,
      ticketPrice: newEvent.ticketPrice,
      maxAttendees: newEvent.maxAttendees,
      currentAttendees: 1,
      category: newEvent.category,
      tags: newEvent.tags,
      likes: 0,
      comments: [],
      isLiked: false,
      postedAt: "Just now",
      hasJoined: true,
    }

    setPosts([event, ...posts])
    setNewEvent({
      eventName: "",
      venue: "",
      city: "",
      description: "",
      image: null,
      eventDate: "",
      eventTime: "",
      duration: "",
      ticketPrice: "",
      maxAttendees: 1,
      category: "Standup Comedy",
      tags: [],
    })
    setImagePreview("")
    setShowCreateEvent(false)
    showToastMessage("Event created successfully!")
  }

  const handleComment = (postId: string) => {
    if (!commentText.trim()) return

    const newComment: Comment = {
      id: Date.now().toString(),
      user: currentUser,
      content: commentText,
      likes: 0,
      isLiked: false,
      replies: [],
      timestamp: "Just now",
    }

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          addNotification("comment", `You commented on ${post.eventName} event`, postId)
          return {
            ...post,
            comments: [...post.comments, newComment],
          }
        }
        return post
      }),
    )

    setCommentText("")
  }

  const handleReply = (postId: string, commentId: string) => {
    if (!replyText.trim()) return

    const newReply: Comment = {
      id: Date.now().toString(),
      user: currentUser,
      content: replyText,
      likes: 0,
      isLiked: false,
      replies: [],
      timestamp: "Just now",
    }

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  replies: [...comment.replies, newReply],
                }
              }
              return comment
            }),
          }
        }
        return post
      }),
    )

    setReplyText("")
    setReplyingTo(null)
  }

  const handleCommentLike = (postId: string, commentId: string, isReply = false, parentCommentId?: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (isReply && comment.id === parentCommentId) {
                return {
                  ...comment,
                  replies: comment.replies.map((reply) => {
                    if (reply.id === commentId) {
                      return {
                        ...reply,
                        isLiked: !reply.isLiked,
                        likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                      }
                    }
                    return reply
                  }),
                }
              } else if (!isReply && comment.id === commentId) {
                return {
                  ...comment,
                  isLiked: !comment.isLiked,
                  likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                }
              }
              return comment
            }),
          }
        }
        return post
      }),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const addTag = (tag: string) => {
    if (tag && !newEvent.tags.includes(tag)) {
      setNewEvent({ ...newEvent, tags: [...newEvent.tags, tag] })
    }
  }

  const removeTag = (tagToRemove: string) => {
    setNewEvent({ ...newEvent, tags: newEvent.tags.filter((tag) => tag !== tagToRemove) })
  }

  const handleMyEvents = () => {
    setCurrentView("myevents")
    setShowUserMenu(false)
    setShowMobileMenu(false)
  }

  const handleFeed = () => {
    setCurrentView("feed")
    setShowMobileMenu(false)
  }

  const toggleComments = (postId: string) => {
    setExpandedComments(expandedComments === postId ? null : postId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-poppins">
      {/* Toast Notification - Bottom Right */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-1000 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border border-white/20"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mr-4 sm:mr-8"
              >
                EventHub
              </motion.h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 ml-auto">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 !text-slate-700 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 w-64 rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-slate-700 placeholder-slate-400 shadow-lg"
                />
              </motion.div>

              {/* Filter Dropdown - Desktop */}
              <div className="relative" ref={filtersRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 text-slate-600 hover:bg-white/80 transition-all shadow-lg cursor-pointer ${
                    selectedCategory !== "All" ? "bg-violet-500/20 text-violet-600" : ""
                  }`}
                >
                  <Filter className="w-5 h-5" />
                </motion.button>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute right-0 top-14 w-64 max-w-[calc(100vw-2rem)] bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 z-50"
                    >
                      <div className="p-4 border-b border-white/20">
                        <h3 className="font-semibold text-slate-700">Filter by Category</h3>
                        {selectedCategory !== "All" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedCategory("All")
                            }}
                            className="text-sm text-violet-600 hover:text-violet-700 transition-colors mt-1 cursor-pointer"
                          >
                            Clear filter
                          </button>
                        )}
                      </div>
                      <div className="p-2 max-h-64 overflow-y-auto">
                        {eventCategories.map((category) => (
                          <motion.button
                            key={category}
                            whileHover={{ x: 4, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedCategory(category)
                              setShowFilters(false)
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer ${
                              selectedCategory === category
                                ? "bg-violet-500/20 text-violet-700 font-medium"
                                : "text-slate-600 hover:bg-violet-500/10"
                            }`}
                          >
                            {category}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative" ref={notificationRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl bg-white/60 backdrop-blur-md border border-white/30 text-slate-600 hover:bg-white/80 transition-all relative shadow-lg cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                    >
                      {notifications.filter((n) => !n.read).length}
                    </motion.span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute right-0 top-14 w-80 max-w-[calc(100vw-2rem)] bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 z-50"
                    >
                      <div className="p-4 border-b border-white/20 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-700">Notifications</h3>
                        <button
                          onClick={markAllAsRead}
                          className="text-sm text-violet-600 hover:text-violet-700 transition-colors cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="p-4 text-slate-500 text-center">No notifications yet</p>
                        ) : (
                          notifications.map((notif) => (
                            <motion.div
                              key={notif.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`p-4 border-b border-white/10 ${!notif.read ? "bg-violet-500/5" : ""}`}
                            >
                              <p className="text-sm text-slate-700">{notif.message}</p>
                              <p className="text-xs text-slate-500 mt-1">{notif.timestamp}</p>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative" ref={userMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 text-slate-600 hover:bg-white/80 transition-all shadow-lg cursor-pointer"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-4 h-4" />
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute right-0 top-14 w-48 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 z-50"
                    >
                      <div className="p-4 border-b border-white/20">
                        <div className="flex items-center space-x-3">
                          <img
                            src={currentUser.avatar || "/placeholder.svg"}
                            alt={currentUser.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-slate-700">{currentUser.name}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <motion.button
                          whileHover={{ x: 4, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                          onClick={handleMyEvents}
                          className="w-full text-left px-3 py-2 text-slate-600 hover:bg-violet-500/10 rounded-xl transition-all cursor-pointer"
                        >
                          My Events
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateEvent(true)}
                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl hover:from-violet-600 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl cursor-pointer flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Event</span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Search */}
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.02 }}
              >
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 w-3 h-3" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-2 py-2 w-24 rounded-xl bg-white/60 backdrop-blur-md border border-white/30 focus:outline-none focus:ring-1 focus:ring-violet-500/50 text-slate-700 placeholder-slate-400 text-xs shadow-lg"
                />
              </motion.div>

              {/* Mobile Notifications */}
              <div className="relative" ref={notificationRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl bg-white/60 backdrop-blur-md border border-white/30 text-slate-600 hover:bg-white/80 transition-all relative shadow-lg cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                    >
                      {notifications.filter((n) => !n.read).length}
                    </motion.span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-12 w-72 max-w-[calc(100vw-2rem)] bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 z-50"
                    >
                      <div className="p-4 border-b border-white/20 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-700">Notifications</h3>
                        <button
                          onClick={markAllAsRead}
                          className="text-sm text-violet-600 hover:text-violet-700 transition-colors cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="p-4 text-slate-500 text-center">No notifications yet</p>
                        ) : (
                          notifications.map((notif) => (
                            <motion.div
                              key={notif.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`p-4 border-b border-white/10 ${!notif.read ? "bg-violet-500/5" : ""}`}
                            >
                              <p className="text-sm text-slate-700">{notif.message}</p>
                              <p className="text-xs text-slate-500 mt-1">{notif.timestamp}</p>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu */}
              <div ref={mobileMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="p-2 rounded-xl bg-white/60 backdrop-blur-md border border-white/30 text-slate-600 hover:bg-white/80 transition-all shadow-lg"
                >
                  <Menu className="w-5 h-5" />
                </motion.button>

                <AnimatePresence>
                  {showMobileMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-2 top-16 w-72 max-w-[calc(100vw-1rem)] bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 z-50"
                    >
                      <div className="p-4 border-b border-white/20">
                        <div className="flex items-center space-x-3">
                          <img
                            src={currentUser.avatar || "/placeholder.svg"}
                            alt={currentUser.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-slate-700">{currentUser.name}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <motion.button
                          whileHover={{ x: 4, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                          onClick={handleFeed}
                          className="w-full text-left px-3 py-2 text-slate-600 hover:bg-violet-500/10 rounded-xl transition-all flex items-center space-x-2 cursor-pointer"
                        >
                          <Home className="w-4 h-4" />
                          <span>Feed</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ x: 4, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                          onClick={handleMyEvents}
                          className="w-full text-left px-3 py-2 text-slate-600 hover:bg-violet-500/10 rounded-xl transition-all flex items-center space-x-2 cursor-pointer"
                        >
                          <Briefcase className="w-4 h-4" />
                          <span>My Events</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ x: 4, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                          onClick={() => {
                            setShowCreateEvent(true)
                            setShowMobileMenu(false)
                          }}
                          className="w-full text-left px-3 py-2 text-slate-600 hover:bg-violet-500/10 rounded-xl transition-all flex items-center space-x-2 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Create Event</span>
                        </motion.button>
                      </div>

                      {/* Filter Section in Mobile Menu */}
                      <div className="border-t border-white/20 mt-2 pt-2">
                        <div className="px-3 py-2">
                          <div className="flex items-center space-x-2 mb-2">
                            <Filter className="w-4 h-4 text-slate-500" />
                            <p className="text-sm font-medium text-slate-700">Filter by Category</p>
                          </div>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {eventCategories.map((category) => (
                              <motion.button
                                key={category}
                                whileHover={{ x: 4 }}
                                onClick={() => {
                                  setSelectedCategory(category)
                                  setShowMobileMenu(false)
                                }}
                                className={`w-full text-left px-2 py-1 rounded-lg text-sm transition-all cursor-pointer ${
                                  selectedCategory === category
                                    ? "bg-violet-500/20 text-violet-700 font-medium"
                                    : "text-slate-600 hover:bg-violet-500/10"
                                }`}
                              >
                                {category}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/30 shadow-2xl"
            >
              <div className="p-6 border-b border-white/20 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-700">Create New Event</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCreateEvent(false)}
                  className="p-2 hover:bg-slate-100/50 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </motion.button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Event Name</label>
                    <input
                      type="text"
                      value={newEvent.eventName}
                      onChange={(e) => setNewEvent({ ...newEvent, eventName: e.target.value })}
                      className="w-full px-4 py-3 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-white/60 backdrop-blur-md"
                      placeholder="e.g., Comedy Night"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                    <select
                      value={newEvent.category}
                      onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                      className="w-full px-4 py-3 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-white/60 backdrop-blur-md cursor-pointer"
                    >
                      {eventCategories.slice(1).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Venue</label>
                    <input
                      type="text"
                      value={newEvent.venue}
                      onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                      className="w-full px-4 py-3 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-white/60 backdrop-blur-md"
                      placeholder="e.g., The Comedy Store"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                    <input
                      type="text"
                      value={newEvent.city}
                      onChange={(e) => setNewEvent({ ...newEvent, city: e.target.value })}
                      className="w-full px-4 py-3 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-white/60 backdrop-blur-md"
                      placeholder="e.g., Mumbai"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-white/60 backdrop-blur-md"
                    placeholder="Describe your event..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Upload Image <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-white/60 backdrop-blur-md file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-violet-500 file:to-purple-600 file:text-white hover:file:from-violet-600 hover:file:to-purple-700 file:cursor-pointer cursor-pointer"
                    required
                  />
                  {imagePreview && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-3"
                    >
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-2xl border border-white/30"
                      />
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Event Date</label>
                    <input
                      type="date"
                      value={newEvent.eventDate}
                      onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                      className="w-full px-4 py-3 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-white/60 backdrop-blur-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Event Time</label>
                    <input
                      type="time"
                      value={newEvent.eventTime}
                      onChange={(e) => setNewEvent({ ...newEvent, eventTime: e.target.value })}
                      className="w-full px-4 py-3 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-white/60 backdrop-blur-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
                    <input
                      type="text"
                      value={newEvent.duration}
                      onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                      className="w-full px-4 py-3 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-white/60 backdrop-blur-md"
                      placeholder="e.g., 3 hours"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Ticket Price</label>
                    <input
                      type="text"
                      value={newEvent.ticketPrice}
                      onChange={(e) => setNewEvent({ ...newEvent, ticketPrice: e.target.value })}
                      className="w-full px-4 py-3 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-white/60 backdrop-blur-md"
                      placeholder="e.g., ₹500 - ₹800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Max Attendees</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={newEvent.maxAttendees}
                    onChange={(e) => setNewEvent({ ...newEvent, maxAttendees: Number.parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-3 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-white/60 backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newEvent.tags.map((tag, index) => (
                      <motion.span
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1 bg-violet-500/20 text-violet-700 rounded-full text-sm flex items-center space-x-1"
                      >
                        <span>{tag}</span>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          onClick={() => removeTag(tag)}
                          className="text-violet-600 hover:text-violet-800 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </motion.button>
                      </motion.span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a tag..."
                      className="flex-1 px-4 py-3 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-white/60 backdrop-blur-md"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addTag((e.target as HTMLInputElement).value)
                          ;(e.target as HTMLInputElement).value = ""
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCreateEvent(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateEvent}
                    className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    Create Event
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {currentView === "myevents" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"
              >
                My Events
              </motion.h1>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFeed}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Back to Feed
              </motion.button>
            </div>
            <div className="space-y-8">
              {userEvents.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-slate-600 text-lg mb-4">You haven't created any events yet.</p>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateEvent(true)}
                    className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl hover:from-violet-600 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    Create Your First Event
                  </motion.button>
                </motion.div>
              ) : (
                userEvents.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Post Header */}
                    <div className="p-3 sm:p-6 pb-2 sm:pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={post.user.avatar || "/placeholder.svg"}
                            alt={post.user.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white/60"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-slate-700">{post.user.name}</h3>
                              {post.user.verified && (
                                <div className="w-4 h-4 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                                  <Check className="w-2 h-2 text-white" />
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-slate-500">{post.postedAt}</p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleShare(post.id)}
                          className="p-2 rounded-full hover:bg-white/60 transition-all cursor-pointer"
                        >
                          <Share2 className="w-5 h-5 text-slate-500" />
                        </motion.button>
                      </div>

                      {/* Event Info */}
                      <div className="mb-3 sm:mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-2 sm:px-3 py-1 bg-violet-500/20 text-violet-700 rounded-full text-xs sm:text-sm font-medium">
                            {post.category}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h2 className="text-lg sm:text-xl font-bold text-slate-700">{post.eventName}</h2>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <MapPin className="w-3 sm:w-4 h-3 sm:h-4 text-slate-500" />
                          <span className="text-slate-600 text-sm sm:text-base">
                            {post.venue}, {post.city}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{post.description}</p>
                      </div>
                    </div>

                    {/* Post Image */}
                    <div className="relative">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.eventName}
                        className="w-full h-80 object-cover"
                      />
                    </div>

                    {/* Event Details */}
                    <div className="p-3 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/40">
                          <div className="flex items-center space-x-2 mb-1">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-medium text-slate-700">Date</span>
                          </div>
                          <p className="text-sm text-slate-600">{post.eventDate}</p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/40">
                          <div className="flex items-center space-x-2 mb-1">
                            <Clock className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-medium text-slate-700">Time</span>
                          </div>
                          <p className="text-sm text-slate-600">{post.eventTime}</p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/40">
                          <div className="flex items-center space-x-2 mb-1">
                            <DollarSign className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-medium text-slate-700">Price</span>
                          </div>
                          <p className="text-sm text-slate-600">{post.ticketPrice}</p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/40">
                          <div className="flex items-center space-x-2 mb-1">
                            <Users className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-medium text-slate-700">Attendees</span>
                          </div>
                          <p className="text-sm text-slate-600">
                            {post.currentAttendees}/{post.maxAttendees}
                          </p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                        {post.tags.map((tag, tagIndex) => (
                          <motion.span
                            key={tagIndex}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: tagIndex * 0.1 }}
                            className="px-2 sm:px-3 py-1 bg-violet-500/20 text-violet-700 rounded-full text-xs sm:text-sm font-medium border border-violet-500/30"
                          >
                            #{tag}
                          </motion.span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center space-x-4 sm:space-x-6">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleLike(post.id)}
                            className="flex items-center space-x-1 sm:space-x-2 text-slate-500 hover:text-red-500 transition-all cursor-pointer"
                          >
                            <Heart
                              className={`w-4 sm:w-5 h-4 sm:h-5 ${post.isLiked ? "fill-red-500 text-red-500" : ""}`}
                            />
                            <span className="font-medium text-sm sm:text-base">{post.likes}</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleComments(post.id)}
                            className="flex items-center space-x-1 sm:space-x-2 text-slate-500 hover:text-violet-600 transition-all cursor-pointer"
                          >
                            <MessageCircle className="w-4 sm:w-5 h-4 sm:h-5" />
                            <span className="font-medium text-sm sm:text-base">{post.comments.length}</span>
                          </motion.button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="px-4 py-2 rounded-2xl font-semibold bg-gradient-to-r from-violet-500 to-purple-600 text-white">Your Event</div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleDeleteEvent(post.id)}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-2xl transition-all shadow-lg cursor-pointer"
                          >
                            Delete
                          </motion.button>
                        </div>
                      </div>

                      {/* Comments Section */}
                      <AnimatePresence>
                        {expandedComments === post.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-6 border-t border-white/20 pt-6"
                          >
                            {/* Comment Input */}
                            <div className="flex space-x-3 mb-6">
                              <img
                                src={currentUser.avatar || "/placeholder.svg"}
                                alt={currentUser.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div className="flex-1 flex space-x-2">
                                <input
                                  type="text"
                                  value={commentText}
                                  onChange={(e) => setCommentText(e.target.value)}
                                  placeholder="Write a comment..."
                                  className="flex-1 px-4 py-3 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-white/60 backdrop-blur-md text-slate-700 placeholder-slate-400"
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      handleComment(post.id)
                                    }
                                  }}
                                />
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleComment(post.id)}
                                  className="px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg cursor-pointer"
                                >
                                  <Send className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </div>

                            {/* Comments List */}
                            <div className="space-y-4">
                              {post.comments.map((comment, commentIndex) => (
                                <motion.div
                                  key={comment.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: commentIndex * 0.1 }}
                                  className="flex items-start space-x-3"
                                >
                                  <img
                                    src={comment.user.avatar || "/placeholder.svg"}
                                    alt={comment.user.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                  <div className="flex-1">
                                    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white/30">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <span className="font-semibold text-slate-700 text-sm">{comment.user.name}</span>
                                        <span className="text-xs text-slate-500">{comment.timestamp}</span>
                                      </div>
                                      <p className="text-slate-600 text-sm">{comment.content}</p>
                                    </div>
                                    <div className="flex items-center space-x-4 mt-2">
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleCommentLike(post.id, comment.id)}
                                        className="flex items-center space-x-1 text-xs text-slate-500 hover:text-red-500 transition-all cursor-pointer"
                                      >
                                        <Heart
                                          className={`w-3 h-3 ${comment.isLiked ? "fill-red-500 text-red-500" : ""}`}
                                        />
                                        <span>{comment.likes}</span>
                                      </motion.button>
                                      <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => setReplyingTo(comment.id)}
                                        className="text-xs text-slate-500 hover:text-violet-600 transition-colors cursor-pointer"
                                      >
                                        Reply
                                      </motion.button>
                                    </div>

                                    {/* Replies */}
                                    {comment.replies.map((reply, replyIndex) => (
                                      <motion.div
                                        key={reply.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: (commentIndex + replyIndex) * 0.1 }}
                                        className="ml-6 mt-3 flex items-start space-x-3"
                                      >
                                        <img
                                          src={reply.user.avatar || "/placeholder.svg"}
                                          alt={reply.user.name}
                                          className="w-6 h-6 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-3 border border-white/30">
                                            <div className="flex items-center space-x-2 mb-1">
                                              <span className="font-semibold text-slate-700 text-xs">
                                                {reply.user.name}
                                              </span>
                                              <span className="text-xs text-slate-500">{reply.timestamp}</span>
                                            </div>
                                            <p className="text-slate-600 text-xs">{reply.content}</p>
                                          </div>
                                          <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleCommentLike(post.id, reply.id, true, comment.id)}
                                            className="flex items-center space-x-1 text-xs text-slate-500 hover:text-red-500 transition-all mt-1 cursor-pointer"
                                          >
                                            <Heart
                                              className={`w-3 h-3 ${reply.isLiked ? "fill-red-500 text-red-500" : ""}`}
                                            />
                                            <span>{reply.likes}</span>
                                          </motion.button>
                                        </div>
                                      </motion.div>
                                    ))}

                                    {/* Reply Input */}
                                    <AnimatePresence>
                                      {replyingTo === comment.id && (
                                        <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: "auto" }}
                                          exit={{ opacity: 0, height: 0 }}
                                          className="ml-6 mt-3 flex space-x-2"
                                        >
                                          <input
                                            type="text"
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Write a reply..."
                                            className="flex-1 px-3 py-2 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-sm bg-white/60 backdrop-blur-md text-slate-700 placeholder-slate-400"
                                            onKeyPress={(e) => {
                                              if (e.key === "Enter") {
                                                handleReply(post.id, comment.id)
                                              }
                                            }}
                                          />
                                          <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleReply(post.id, comment.id)}
                                            className="px-3 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg cursor-pointer"
                                          >
                                            <Send className="w-4 h-4" />
                                          </motion.button>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.article>
                ))
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {filteredPosts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <p className="text-slate-600 text-lg">No events found matching your search.</p>
              </motion.div>
            ) : (
              filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="p-3 sm:p-6 pb-2 sm:pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={post.user.avatar || "/placeholder.svg"}
                          alt={post.user.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white/60"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-slate-700">{post.user.name}</h3>
                            {post.user.verified && (
                              <div className="w-4 h-4 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                                <Check className="w-2 h-2 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-slate-500">{post.postedAt}</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleShare(post.id)}
                        className="p-2 rounded-full hover:bg-white/60 transition-all cursor-pointer"
                      >
                        <Share2 className="w-5 h-5 text-slate-500" />
                      </motion.button>
                    </div>

                    {/* Event Info */}
                    <div className="mb-3 sm:mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 sm:px-3 py-1 bg-violet-500/20 text-violet-700 rounded-full text-xs sm:text-sm font-medium">
                          {post.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-700">{post.eventName}</h2>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-3 sm:w-4 h-3 sm:h-4 text-slate-500" />
                        <span className="text-slate-600 text-sm sm:text-base">
                          {post.venue}, {post.city}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{post.description}</p>
                    </div>
                  </div>

                  {/* Post Image */}
                  <div className="relative">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.eventName}
                      className="w-full h-80 object-cover"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="p-3 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                      <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/40">
                        <div className="flex items-center space-x-2 mb-1">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700">Date</span>
                        </div>
                        <p className="text-sm text-slate-600">{post.eventDate}</p>
                      </div>
                      <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/40">
                        <div className="flex items-center space-x-2 mb-1">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700">Time</span>
                        </div>
                        <p className="text-sm text-slate-600">{post.eventTime}</p>
                      </div>
                      <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/40">
                        <div className="flex items-center space-x-2 mb-1">
                          <DollarSign className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700">Price</span>
                        </div>
                        <p className="text-sm text-slate-600">{post.ticketPrice}</p>
                      </div>
                      <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/40">
                        <div className="flex items-center space-x-2 mb-1">
                          <Users className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700">Attendees</span>
                        </div>
                        <p className="text-sm text-slate-600">
                          {post.currentAttendees}/{post.maxAttendees}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                      {post.tags.map((tag, tagIndex) => (
                        <motion.span
                          key={tagIndex}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: tagIndex * 0.1 }}
                          className="px-2 sm:px-3 py-1 bg-violet-500/20 text-violet-700 rounded-full text-xs sm:text-sm font-medium border border-violet-500/30"
                        >
                          #{tag}
                        </motion.span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center space-x-4 sm:space-x-6">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleLike(post.id)}
                          className="flex items-center space-x-1 sm:space-x-2 text-slate-500 hover:text-red-500 transition-all cursor-pointer"
                        >
                          <Heart
                            className={`w-4 sm:w-5 h-4 sm:h-5 ${post.isLiked ? "fill-red-500 text-red-500" : ""}`}
                          />
                          <span className="font-medium text-sm sm:text-base">{post.likes}</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleComments(post.id)}
                          className="flex items-center space-x-1 sm:space-x-2 text-slate-500 hover:text-violet-600 transition-all cursor-pointer"
                        >
                          <MessageCircle className="w-4 sm:w-5 h-4 sm:h-5" />
                          <span className="font-medium text-sm sm:text-base">{post.comments.length}</span>
                        </motion.button>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => (post.hasJoined ? handleLeaveEvent(post.id) : handleJoin(post.id))}
                        disabled={post.currentAttendees >= post.maxAttendees && !post.hasJoined}
                        className={`px-3 sm:px-6 py-2 sm:py-3 rounded-2xl font-semibold transition-all text-sm sm:text-base shadow-lg hover:shadow-xl cursor-pointer ${
                          post.hasJoined
                            ? "bg-gradient-to-r from-slate-400 to-slate-500 text-white hover:from-slate-500 hover:to-slate-600"
                            : post.currentAttendees >= post.maxAttendees
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700"
                        }`}
                      >
                        {post.hasJoined
                          ? "Leave Event"
                          : post.currentAttendees >= post.maxAttendees
                            ? "Event Full"
                            : "Join Event"}
                      </motion.button>
                    </div>

                    {/* Comments Section */}
                    <AnimatePresence>
                      {expandedComments === post.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-6 border-t border-white/20 pt-6"
                        >
                          {/* Comment Input */}
                          <div className="flex space-x-3 mb-6 items-center">
                            <img
                              src={currentUser.avatar || "/placeholder.svg"}
                              alt={currentUser.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1 flex space-x-2">
                              <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 px-4 py-3 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 bg-white/60 backdrop-blur-md text-slate-700 placeholder-slate-400"
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    handleComment(post.id)
                                  }
                                }}
                              />
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleComment(post.id)}
                                className="px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg cursor-pointer"
                              >
                                <Send className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>

                          {/* Comments List */}
                          <div className="space-y-4">
                            {post.comments.map((comment, commentIndex) => (
                              <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: commentIndex * 0.1 }}
                                className="flex space-x-3 items-start"
                              >
                                <img
                                  src={comment.user.avatar || "/placeholder.svg"}
                                  alt={comment.user.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white/30">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="font-semibold text-slate-700 text-sm">{comment.user.name}</span>
                                      <span className="text-xs text-slate-500">{comment.timestamp}</span>
                                    </div>
                                    <p className="text-slate-600 text-sm">{comment.content}</p>
                                  </div>
                                  <div className="flex items-center space-x-4 mt-2">
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleCommentLike(post.id, comment.id)}
                                      className="flex items-center space-x-1 text-xs text-slate-500 hover:text-red-500 transition-all cursor-pointer"
                                    >
                                      <Heart
                                        className={`w-3 h-3 ${comment.isLiked ? "fill-red-500 text-red-500" : ""}`}
                                      />
                                      <span>{comment.likes}</span>
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      onClick={() => setReplyingTo(comment.id)}
                                      className="text-xs text-slate-500 hover:text-violet-600 transition-colors cursor-pointer"
                                    >
                                      Reply
                                    </motion.button>
                                  </div>

                                  {/* Replies */}
                                  {comment.replies.map((reply, replyIndex) => (
                                    <motion.div
                                      key={reply.id}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: (commentIndex + replyIndex) * 0.1 }}
                                      className="ml-6 mt-3 flex items-start space-x-3"
                                    >
                                      <img
                                        src={reply.user.avatar || "/placeholder.svg"}
                                        alt={reply.user.name}
                                        className="w-6 h-6 rounded-full object-cover"
                                      />
                                      <div className="flex-1">
                                        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-3 border border-white/30">
                                          <div className="flex items-center space-x-2 mb-1">
                                            <span className="font-semibold text-slate-700 text-xs">
                                              {reply.user.name}
                                            </span>
                                            <span className="text-xs text-slate-500">{reply.timestamp}</span>
                                          </div>
                                          <p className="text-slate-600 text-xs">{reply.content}</p>
                                        </div>
                                        <motion.button
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                          onClick={() => handleCommentLike(post.id, reply.id, true, comment.id)}
                                          className="flex items-center space-x-1 text-xs text-slate-500 hover:text-red-500 transition-all mt-1 cursor-pointer"
                                        >
                                          <Heart
                                            className={`w-3 h-3 ${reply.isLiked ? "fill-red-500 text-red-500" : ""}`}
                                          />
                                          <span>{reply.likes}</span>
                                        </motion.button>
                                      </div>
                                    </motion.div>
                                  ))}

                                  {/* Reply Input */}
                                  <AnimatePresence>
                                    {replyingTo === comment.id && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="ml-6 mt-3 flex space-x-2"
                                      >
                                        <input
                                          type="text"
                                          value={replyText}
                                          onChange={(e) => setReplyText(e.target.value)}
                                          placeholder="Write a reply..."
                                          className="flex-1 px-3 py-2 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-sm bg-white/60 backdrop-blur-md text-slate-700 placeholder-slate-400"
                                          onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                              handleReply(post.id, comment.id)
                                            }
                                          }}
                                        />
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={() => handleReply(post.id, comment.id)}
                                          className="px-3 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg cursor-pointer"
                                        >
                                          <Send className="w-4 h-4" />
                                        </motion.button>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.article>
              ))
            )}
          </motion.div>
        )}
      </main>

      <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
          
          .font-poppins {
            font-family: "Poppins", sans-serif;
            font-optical-sizing: auto;
            font-style: normal;
          }
        `}</style>
    </div>
  )
}