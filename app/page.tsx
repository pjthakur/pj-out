"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
Heart, MessageCircle, Users, MapPin, Calendar, Search, Bell, User, Plus, Share2, X, Send, ChevronDown, Check, Menu, Home, Briefcase, Sidebar,
} from "lucide-react"

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

interface TravelPost {
  id: string
  user: AppUser
  destination: string
  state: string
  description: string
  image: string
  departureDate: string
  duration: string
  budget: string
  maxTravelers: number
  currentTravelers: number
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

const initialPosts: TravelPost[] = [
  {
    id: "1",
    user: mockUsers[0],
    destination: "Goa",
    state: "Goa",
    description:
      "Planning an amazing beach vacation in Goa! Looking for fellow travelers to explore the beautiful beaches, try water sports, and experience the vibrant nightlife. We'll visit Baga Beach, Anjuna, and take a sunset cruise.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop",
    departureDate: "2024-03-15",
    duration: "5 days",
    budget: "₹15,000 - ₹25,000",
    maxTravelers: 4,
    currentTravelers: 2,
    tags: ["Beach", "Nightlife", "Water Sports", "Cruise"],
    likes: 127,
    comments: [],
    isLiked: false,
    postedAt: "2 hours ago",
    hasJoined: false,
  },
  {
    id: "2",
    user: mockUsers[1],
    destination: "Manali",
    state: "Himachal Pradesh",
    description:
      "Adventure seekers wanted for an epic Himalayan expedition! Planning to trek through beautiful valleys, visit ancient temples, and experience the snow-capped mountains. Perfect for nature lovers and photography enthusiasts.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    departureDate: "2024-04-10",
    duration: "8 days",
    budget: "₹20,000 - ₹35,000",
    maxTravelers: 6,
    currentTravelers: 3,
    tags: ["Mountains", "Trekking", "Photography", "Adventure"],
    likes: 89,
    comments: [],
    isLiked: true,
    postedAt: "5 hours ago",
    hasJoined: false,
  },
  {
    id: "3",
    user: mockUsers[2],
    destination: "Rajasthan",
    state: "Rajasthan",
    description:
      "Royal heritage tour through the land of kings! Exploring magnificent palaces, riding camels in the Thar Desert, and experiencing the rich culture of Jaipur, Udaipur, and Jodhpur. A journey through India's royal history.",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop",
    departureDate: "2024-05-05",
    duration: "12 days",
    budget: "₹30,000 - ₹50,000",
    maxTravelers: 8,
    currentTravelers: 4,
    tags: ["Heritage", "Culture", "Desert", "Palaces"],
    likes: 203,
    comments: [],
    isLiked: false,
    postedAt: "1 day ago",
    hasJoined: false,
  },
  {
    id: "4",
    user: mockUsers[3],
    destination: "Kerala",
    state: "Kerala",
    description:
      "Backwater bliss and spice plantation tour! Seeking travel companions for a peaceful journey through Kerala's serene backwaters, lush tea gardens, and spice plantations. Includes houseboat stays and Ayurvedic treatments.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop",
    departureDate: "2024-06-20",
    duration: "10 days",
    budget: "₹25,000 - ₹40,000",
    maxTravelers: 5,
    currentTravelers: 2,
    tags: ["Backwaters", "Nature", "Ayurveda", "Houseboat"],
    likes: 156,
    comments: [],
    isLiked: true,
    postedAt: "3 days ago",
    hasJoined: false,
  },
  {
    id: "5",
    user: mockUsers[1],
    destination: "Leh Ladakh",
    state: "Jammu & Kashmir",
    description:
      "Ultimate high-altitude adventure in the Land of High Passes! Experience breathtaking landscapes, Buddhist monasteries, and the thrill of riding through the world's highest motorable roads. Perfect for adventure enthusiasts!",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    departureDate: "2024-07-15",
    duration: "14 days",
    budget: "₹40,000 - ₹60,000",
    maxTravelers: 6,
    currentTravelers: 4,
    tags: ["Mountains", "Adventure", "Biking", "Photography"],
    likes: 298,
    comments: [],
    isLiked: true,
    postedAt: "1 week ago",
    hasJoined: false,
  },
  {
    id: "6",
    user: mockUsers[2],
    destination: "Andaman",
    state: "Andaman",
    description:
      "Pristine beaches and crystal clear waters await! Explore untouched coral reefs, indulge in water sports, and witness stunning sunsets. A perfect tropical getaway for beach lovers and diving enthusiasts.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
    departureDate: "2024-08-10",
    duration: "7 days",
    budget: "₹35,000 - ₹50,000",
    maxTravelers: 8,
    currentTravelers: 6,
    tags: ["Beach", "Diving", "Island", "Adventure"],
    likes: 167,
    comments: [],
    isLiked: false,
    postedAt: "4 days ago",
    hasJoined: false,
  },
]

export default function TravelSocialPlatform() {
  const [posts, setPosts] = useState<TravelPost[]>(initialPosts)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showCreateTrip, setShowCreateTrip] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [expandedComments, setExpandedComments] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPosts, setFilteredPosts] = useState<TravelPost[]>(initialPosts)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [currentView, setCurrentView] = useState<"feed" | "mytrips">("feed")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [showStats, setShowStats] = useState(false)
  const [randomStats, setRandomStats] = useState({
    monthlyTrips: 35,
    activeUsers: 75,
    tipNumber: 42,
    userTripCounts: [5, 7, 3] // for suggested users
  })
  const [subscribeEmail, setSubscribeEmail] = useState("")

  // Refs for click outside detection
  const notificationRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileSidebarRef = useRef<HTMLDivElement>(null)

  // New trip form state
  const [newTrip, setNewTrip] = useState({
    destination: "",
    state: "",
    description: "",
    image: null as File | null,
    departureDate: "",
    duration: "",
    budget: "",
    maxTravelers: 1,
    tags: [] as string[],
  })

  // Comment state
  const [commentText, setCommentText] = useState("")
  const [replyText, setReplyText] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  // Get user's trips
  const userTrips = posts.filter((post) => post.user.id === currentUser.id)

  const [imagePreview, setImagePreview] = useState<string>("")

  // Get popular destinations
  const popularDestinations = Array.from(new Set(posts.map(post => post.destination)))
    .slice(0, 6)
    .map(dest => ({
      name: dest,
      count: posts.filter(post => post.destination === dest).length
    }))
    .sort((a, b) => b.count - a.count)

  // Get travel statistics
  const travelStats = {
    totalTrips: posts.length,
    activeUsers: mockUsers.length,
    totalTravelers: posts.reduce((sum, post) => sum + post.currentTravelers, 0),
    upcomingTrips: posts.filter(post => new Date(post.departureDate) > new Date()).length
  }

  // Filter options
  const filterOptions = [
    { value: "all", label: "All Trips" },
    { value: "Beach", label: "Beach" },
    { value: "Mountains", label: "Mountains" },
    { value: "Heritage", label: "Heritage" },
    { value: "Adventure", label: "Adventure" },
    { value: "Nature", label: "Nature" }
  ]

  useEffect(() => {
    let filtered = posts

    // Apply search filter
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (post) =>
          post.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Apply category filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter(post => 
        post.tags.some(tag => tag.toLowerCase().includes(selectedFilter.toLowerCase()))
      )
    }

    setFilteredPosts(filtered)
  }, [searchQuery, posts, selectedFilter])

  //outside 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement

       
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
      if (mobileSidebarRef.current && !mobileSidebarRef.current.contains(event.target as Node)) {
        setShowMobileSidebar(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Prevent scroll when modal is open 
  useEffect(() => {
    if (showCreateTrip || showMobileSidebar) {
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.width = "100%"
      document.body.style.height = "100%"
      // Prevent scroll on touch devices
      document.body.style.touchAction = "none"
    } else {
      document.body.style.overflow = "unset"
      document.body.style.position = "unset"
      document.body.style.width = "unset"
      document.body.style.height = "unset"
      document.body.style.touchAction = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
      document.body.style.position = "unset"
      document.body.style.width = "unset"
      document.body.style.height = "unset"
      document.body.style.touchAction = "unset"
    }
  }, [showCreateTrip, showMobileSidebar])

  // Set random values after component mounts to avoid hydration mismatch
  useEffect(() => {
    setRandomStats({
      monthlyTrips: Math.floor(Math.random() * 50 + 20),
      activeUsers: Math.floor(Math.random() * 100 + 50),
      tipNumber: Math.floor(Math.random() * 100 + 1),
      userTripCounts: [
        Math.floor(Math.random() * 10 + 1),
        Math.floor(Math.random() * 10 + 1),
        Math.floor(Math.random() * 10 + 1)
      ]
    })
  }, [])

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
      setNewTrip({ ...newTrip, image: file })
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
            addNotification("like", `You liked ${post.destination} trip`, postId)
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
        if (post.id === postId && post.currentTravelers < post.maxTravelers && !post.hasJoined) {
          addNotification("join", `You joined the ${post.destination} trip!`, postId)
          showToastMessage("Successfully joined the trip!")
          return {
            ...post,
            currentTravelers: post.currentTravelers + 1,
            hasJoined: true,
          }
        }
        return post
      }),
    )
  }

  const handleShare = (postId: string) => {
    const post = posts.find((p) => p.id === postId)
    if (post) {
      if (post.currentTravelers >= post.maxTravelers) {
        showToastMessage(`${post.destination} trip is full!`)
      } else {
        showToastMessage(`${post.destination} trip shared successfully!`)
      }
    }
  }

  const handleCreateTrip = () => {
    if (!newTrip.destination || !newTrip.description || !newTrip.image) {
      showToastMessage("Please fill all required fields including uploading an image!")
      return
    }

    const imageUrl = imagePreview || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop"

    const trip: TravelPost = {
      id: Date.now().toString(),
      user: currentUser,
      destination: newTrip.destination,
      state: newTrip.state,
      description: newTrip.description,
      image: imageUrl,
      departureDate: newTrip.departureDate,
      duration: newTrip.duration,
      budget: newTrip.budget,
      maxTravelers: newTrip.maxTravelers,
      currentTravelers: 1,
      tags: newTrip.tags,
      likes: 0,
      comments: [],
      isLiked: false,
      postedAt: "Just now",
      hasJoined: true,
    }

    setPosts([trip, ...posts])
    setNewTrip({
      destination: "",
      state: "",
      description: "",
      image: null,
      departureDate: "",
      duration: "",
      budget: "",
      maxTravelers: 1,
      tags: [],
    })
    setImagePreview("")
    setShowCreateTrip(false)
    showToastMessage("Trip created successfully!")
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
          addNotification("comment", `You commented on ${post.destination} trip`, postId)
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

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((notif) => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ))
  }

  const addTag = (tag: string) => {
    if (tag && !newTrip.tags.includes(tag)) {
      setNewTrip({ ...newTrip, tags: [...newTrip.tags, tag] })
    }
  }

  const removeTag = (tagToRemove: string) => {
    setNewTrip({ ...newTrip, tags: newTrip.tags.filter((tag) => tag !== tagToRemove) })
  }

  const handleMyTrips = () => {
    setCurrentView("mytrips")
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

  const handleSubscribe = () => {
    if (!subscribeEmail.trim()) {
      showToastMessage("Please enter a valid email address!")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(subscribeEmail)) {
      showToastMessage("Please enter a valid email address!")
      return
    }

    // Show success message and clear input
    showToastMessage("Successfully subscribed to newsletter! 🎉")
    setSubscribeEmail("")
  }

  // Helper function to format budget with k notation
  const formatBudget = (budget: string) => {
    // Extract numbers from budget string like "₹15,000 - ₹25,000"
    const numbers = budget.match(/[\d,]+/g)
    if (!numbers) return budget
    
    const formatNumber = (num: string) => {
      const cleanNum = num.replace(/,/g, '')
      const value = parseInt(cleanNum)
      if (value >= 1000) {
        return `${Math.floor(value / 1000)}k`
      }
      return cleanNum
    }
    
    if (numbers.length === 2) {
      return `₹${formatNumber(numbers[0])} - ₹${formatNumber(numbers[1])}`
    } else if (numbers.length === 1) {
      return `₹${formatNumber(numbers[0])}`
    }
    
    return budget
  }

  // Function to scroll to destination card
  const scrollToDestination = (destinationName: string) => {
    // First set the search query to filter posts
    setSearchQuery(destinationName)
    
    // Close mobile sidebar if open
    setShowMobileSidebar(false)
    
    // Switch to feed view if on My Trips
    if (currentView !== "feed") {
      setCurrentView("feed")
    }
    
    // Wait a bit for the search filter to apply, then scroll
    setTimeout(() => {
      // Find the post with matching destination
      const targetPost = posts.find(post => 
        post.destination.toLowerCase() === destinationName.toLowerCase()
      )
      
      if (targetPost) {
        // Find the element with data-destination attribute
        const element = document.querySelector(`[data-destination="${destinationName}"]`)
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          })
          
          // Add a highlight effect
          element.classList.add('highlight-destination')
          setTimeout(() => {
            element.classList.remove('highlight-destination')
          }, 2000)
        }
      }
    }, 100)
  }

  return (
    <div className="min-h-screen bg-[#EFE1D1] font-mulish">
      {/* Toast Notification - Bottom Right */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#3F2E3E] text-white px-6 py-3 rounded-lg shadow-lg animate-slide-up">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#A78295]/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[#3F2E3E] mr-8">Yatra</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 ml-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10" style={{ color: '#1f2937' }} />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 rounded-full bg-white/60 backdrop-blur-sm border border-[#A78295]/30 focus:outline-none focus:ring-2 focus:ring-[#A78295]/50 text-[#3F2E3E] placeholder-[#A78295]"
                />
              </div>

              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full bg-white/60 backdrop-blur-sm border border-[#A78295]/30 text-[#3F2E3E] hover:bg-[#A78295]/10 transition-all relative cursor-pointer"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#A78295] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/50 z-50 animate-fade-in">
                    <div className="p-4 border-b border-[#A78295]/20 flex justify-between items-center">
                      <h3 className="font-semibold text-[#3F2E3E]">Notifications</h3>
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-[#A78295] hover:text-[#3F2E3E] transition-colors cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-[#A78295] text-center">No notifications yet</p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)}
                            className={`p-4 border-b border-[#A78295]/10 cursor-pointer hover:bg-[#A78295]/10 transition-colors ${!notif.read ? "bg-[#A78295]/5" : ""}`}
                          >
                            <p className="text-sm text-[#3F2E3E]">{notif.message}</p>
                            <p className="text-xs text-[#A78295] mt-1">{notif.timestamp}</p>
                            {!notif.read && (
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-[#A78295] rounded-full"></div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-full bg-white/60 backdrop-blur-sm border border-[#A78295]/30 text-[#3F2E3E] hover:bg-[#A78295]/10 transition-all cursor-pointer"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-12 w-64 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/50 z-50 overflow-hidden animate-fade-in">
                    {/* Profile Header with Gradient */}
                    <div className="relative bg-gradient-to-br from-[#3F2E3E] via-[#5A4A5A] to-[#A78295] p-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
                      <div className="relative flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={currentUser.avatar || "/placeholder.svg"}
                            alt={currentUser.name}
                            className="w-12 h-12 rounded-full object-cover border-3 border-white/30 shadow-lg"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-lg">{currentUser.name}</h3>
                          <p className="text-white/80 text-sm">Travel Enthusiast</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-3 space-y-1">
                      <button
                        onClick={handleMyTrips}
                        className="w-full group flex items-center space-x-3 px-4 py-3 text-[#3F2E3E] hover:bg-gradient-to-r hover:from-[#A78295]/10 hover:to-[#3F2E3E]/10 rounded-xl transition-all duration-200 cursor-pointer transform hover:translate-x-1"
                      >
                        <div className="p-2 bg-gradient-to-br from-[#3F2E3E]/10 to-[#A78295]/10 rounded-lg group-hover:from-[#3F2E3E]/20 group-hover:to-[#A78295]/20 transition-all">
                          <Briefcase className="w-4 h-4 text-[#3F2E3E]" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium">My Trips</p>
                          <p className="text-xs text-[#A78295]">{userTrips.length} active trips</p>
                        </div>
                        <div className="w-2 h-2 bg-[#A78295] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentView("feed")
                          setShowUserMenu(false)
                        }}
                        className="w-full group flex items-center space-x-3 px-4 py-3 text-[#3F2E3E] hover:bg-gradient-to-r hover:from-[#A78295]/10 hover:to-[#3F2E3E]/10 rounded-xl transition-all duration-200 cursor-pointer transform hover:translate-x-1"
                      >
                        <div className="p-2 bg-gradient-to-br from-[#3F2E3E]/10 to-[#A78295]/10 rounded-lg group-hover:from-[#3F2E3E]/20 group-hover:to-[#A78295]/20 transition-all">
                          <Home className="w-4 h-4 text-[#3F2E3E]" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium">Explore Feed</p>
                          <p className="text-xs text-[#A78295]">Discover new trips</p>
                        </div>
                        <div className="w-2 h-2 bg-[#A78295] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </button>
                    </div>

                    {/* Stats Section */}
                    <div className="border-t border-[#A78295]/10 p-4 bg-gradient-to-r from-[#A78295]/5 to-transparent">
                      <div className="flex justify-between text-center">
                        <div>
                          <p className="text-lg font-bold text-[#3F2E3E]">{userTrips.length}</p>
                          <p className="text-xs text-[#A78295]">Trips</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-[#3F2E3E]">
                            {posts.filter(post => post.isLiked).length}
                          </p>
                          <p className="text-xs text-[#A78295]">Liked</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-[#3F2E3E]">
                            {posts.filter(post => post.hasJoined).length}
                          </p>
                          <p className="text-xs text-[#A78295]">Joined</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowCreateTrip(true)}
                className="px-4 py-2 bg-[#3F2E3E] text-white rounded-full hover:bg-[#331D2C] transition-all font-medium flex items-center space-x-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Trip</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10" style={{ color: '#1f2937' }} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-32 rounded-full bg-white/60 backdrop-blur-sm border border-[#A78295]/30 focus:outline-none focus:ring-2 focus:ring-[#A78295]/50 text-[#3F2E3E] placeholder-[#A78295] text-sm"
                />
              </div>

              {/* Mobile Sidebar Button */}
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="p-2 rounded-full bg-white/60 backdrop-blur-sm border border-[#A78295]/30 text-[#3F2E3E] hover:bg-[#A78295]/10 transition-all cursor-pointer"
              >
                <Sidebar className="w-4 h-4" />
              </button>

              {/* Mobile Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full bg-white/60 backdrop-blur-sm border border-[#A78295]/30 text-[#3F2E3E] hover:bg-[#A78295]/10 transition-all relative cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#A78295] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="fixed left-4 right-4 top-20 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/50 z-50 animate-fade-in">
                    <div className="p-4 border-b border-[#A78295]/20 flex justify-between items-center">
                      <h3 className="font-semibold text-[#3F2E3E]">Notifications</h3>
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-[#A78295] hover:text-[#3F2E3E] transition-colors cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-[#A78295] text-center">No notifications yet</p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)}
                            className={`relative p-4 border-b border-[#A78295]/10 cursor-pointer hover:bg-[#A78295]/10 transition-colors ${!notif.read ? "bg-[#A78295]/5" : ""}`}
                          >
                            <p className="text-sm text-[#3F2E3E] pr-4">{notif.message}</p>
                            <p className="text-xs text-[#A78295] mt-1">{notif.timestamp}</p>
                            {!notif.read && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-[#A78295] rounded-full"></div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu */}
              <div ref={mobileMenuRef}>
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="p-2 rounded-full bg-white/60 backdrop-blur-sm border border-[#A78295]/30 text-[#3F2E3E] hover:bg-[#A78295]/10 transition-all cursor-pointer"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {showMobileMenu && (
                  <div className="absolute right-4 top-16 w-72 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/50 z-50 overflow-hidden animate-fade-in">
                    {/* Profile Header with Gradient */}
                    <div className="relative bg-gradient-to-br from-[#3F2E3E] via-[#5A4A5A] to-[#A78295] p-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
                      <div className="relative flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={currentUser.avatar || "/placeholder.svg"}
                            alt={currentUser.name}
                            className="w-12 h-12 rounded-full object-cover border-3 border-white/30 shadow-lg"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-lg">{currentUser.name}</h3>
                          <p className="text-white/80 text-sm">Travel Enthusiast</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-3 space-y-1">
                      <button
                        onClick={handleFeed}
                        className="w-full group flex items-center space-x-3 px-4 py-3 text-[#3F2E3E] hover:bg-gradient-to-r hover:from-[#A78295]/10 hover:to-[#3F2E3E]/10 rounded-xl transition-all duration-200 cursor-pointer transform hover:translate-x-1"
                      >
                        <div className="p-2 bg-gradient-to-br from-[#3F2E3E]/10 to-[#A78295]/10 rounded-lg group-hover:from-[#3F2E3E]/20 group-hover:to-[#A78295]/20 transition-all">
                          <Home className="w-4 h-4 text-[#3F2E3E]" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium">Explore Feed</p>
                          <p className="text-xs text-[#A78295]">Discover new trips</p>
                        </div>
                        <div className="w-2 h-2 bg-[#A78295] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </button>

                      <button
                        onClick={handleMyTrips}
                        className="w-full group flex items-center space-x-3 px-4 py-3 text-[#3F2E3E] hover:bg-gradient-to-r hover:from-[#A78295]/10 hover:to-[#3F2E3E]/10 rounded-xl transition-all duration-200 cursor-pointer transform hover:translate-x-1"
                      >
                        <div className="p-2 bg-gradient-to-br from-[#3F2E3E]/10 to-[#A78295]/10 rounded-lg group-hover:from-[#3F2E3E]/20 group-hover:to-[#A78295]/20 transition-all">
                          <Briefcase className="w-4 h-4 text-[#3F2E3E]" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium">My Trips</p>
                          <p className="text-xs text-[#A78295]">{userTrips.length} active trips</p>
                        </div>
                        <div className="w-2 h-2 bg-[#A78295] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </button>

                      <button
                        onClick={() => {
                          setShowCreateTrip(true)
                          setShowMobileMenu(false)
                        }}
                        className="w-full group flex items-center space-x-3 px-4 py-3 text-[#3F2E3E] hover:bg-gradient-to-r hover:from-[#A78295]/10 hover:to-[#3F2E3E]/10 rounded-xl transition-all duration-200 cursor-pointer transform hover:translate-x-1"
                      >
                        <div className="p-2 bg-gradient-to-br from-[#3F2E3E]/10 to-[#A78295]/10 rounded-lg group-hover:from-[#3F2E3E]/20 group-hover:to-[#A78295]/20 transition-all">
                          <Plus className="w-4 h-4 text-[#3F2E3E]" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium">Create Trip</p>
                          <p className="text-xs text-[#A78295]">Plan your next adventure</p>
                        </div>
                        <div className="w-2 h-2 bg-[#A78295] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </button>
                    </div>

                    {/* Stats Section */}
                    <div className="border-t border-[#A78295]/10 p-4 bg-gradient-to-r from-[#A78295]/5 to-transparent">
                      <div className="flex justify-between text-center">
                        <div>
                          <p className="text-lg font-bold text-[#3F2E3E]">{userTrips.length}</p>
                          <p className="text-xs text-[#A78295]">Trips</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-[#3F2E3E]">
                            {posts.filter(post => post.isLiked).length}
                          </p>
                          <p className="text-xs text-[#A78295]">Liked</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-[#3F2E3E]">
                            {posts.filter(post => post.hasJoined).length}
                          </p>
                          <p className="text-xs text-[#A78295]">Joined</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Create Trip Modal */}
      {showCreateTrip && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#A78295]/20 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#3F2E3E]">Create New Trip</h2>
              <button
                onClick={() => setShowCreateTrip(false)}
                className="p-2 hover:bg-[#A78295]/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-[#A78295]" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#3F2E3E] mb-2">Destination</label>
                  <input
                    type="text"
                    value={newTrip.destination}
                    onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                    className="w-full px-3 py-2 border border-[#A78295]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78295]/50"
                    placeholder="e.g., Goa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3F2E3E] mb-2">State</label>
                  <input
                    type="text"
                    value={newTrip.state}
                    onChange={(e) => setNewTrip({ ...newTrip, state: e.target.value })}
                    className="w-full px-3 py-2 border border-[#A78295]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78295]/50"
                    placeholder="e.g., Goa"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3F2E3E] mb-2">Description</label>
                <textarea
                  value={newTrip.description}
                  onChange={(e) => setNewTrip({ ...newTrip, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-[#A78295]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78295]/50"
                  placeholder="Describe your trip plans..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3F2E3E] mb-2">
                  Upload Image <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-[#A78295]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78295]/50 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#3F2E3E] file:text-white hover:file:bg-[#331D2C] file:cursor-pointer"
                  required
                />
                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-[#A78295]/30"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#3F2E3E] mb-2">Departure Date</label>
                  <input
                    type="date"
                    value={newTrip.departureDate}
                    onChange={(e) => setNewTrip({ ...newTrip, departureDate: e.target.value })}
                    className="w-full px-3 py-2 border border-[#A78295]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78295]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3F2E3E] mb-2">Duration</label>
                  <input
                    type="text"
                    value={newTrip.duration}
                    onChange={(e) => setNewTrip({ ...newTrip, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-[#A78295]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78295]/50"
                    placeholder="e.g., 5 days"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#3F2E3E] mb-2">Budget</label>
                  <input
                    type="text"
                    value={newTrip.budget}
                    onChange={(e) => setNewTrip({ ...newTrip, budget: e.target.value })}
                    className="w-full px-3 py-2 border border-[#A78295]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78295]/50"
                    placeholder="e.g., ₹15,000 - ₹25,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3F2E3E] mb-2">Max Travelers</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newTrip.maxTravelers}
                    onChange={(e) => setNewTrip({ ...newTrip, maxTravelers: Number.parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-[#A78295]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78295]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3F2E3E] mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newTrip.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#A78295]/20 text-[#3F2E3E] rounded-full text-sm flex items-center space-x-1"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-[#A78295] hover:text-[#3F2E3E] cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add a tag..."
                    className="flex-1 px-3 py-2 border border-[#A78295]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78295]/50"
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
                <button
                  onClick={() => setShowCreateTrip(false)}
                  className="px-4 py-2 text-[#A78295] hover:text-[#3F2E3E] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTrip}
                  className="px-6 py-2 bg-[#3F2E3E] text-white rounded-lg hover:bg-[#331D2C] transition-colors cursor-pointer"
                >
                  Create Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Drawer */}
      {showMobileSidebar && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 lg:hidden" style={{ touchAction: 'none' }}>
          <div className="flex h-full">
            {/* Overlay */}
            <div 
              className="flex-1" 
              onClick={() => setShowMobileSidebar(false)}
            ></div>
            
            {/* Sidebar Content */}
            <div 
              ref={mobileSidebarRef}
              className="w-80 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-lg shadow-2xl h-full flex flex-col animate-slide-in-right"
              style={{ touchAction: 'auto' }}
            >
              {/* Header - Fixed */}
              <div className="flex-shrink-0 p-6 border-b border-[#A78295]/20 bg-gradient-to-r from-[#3F2E3E] to-[#5A4A5A] text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Explore</h2>
                  <button
                    onClick={() => setShowMobileSidebar(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#A78295]/50 scrollbar-track-transparent min-h-0">
                <div className="p-6 space-y-6 pb-8 min-h-full">
                {/* Trending Destinations */}
                <div>
                  <h3 className="text-lg font-bold text-[#3F2E3E] mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-[#A78295]" />
                    Trending Destinations
                  </h3>
                  <div className="space-y-3">
                    {popularDestinations.map((dest, index) => (
                      <button
                        key={dest.name}
                        onClick={() => scrollToDestination(dest.name)}
                        className="flex items-center justify-between w-full p-3 rounded-xl bg-white/50 hover:bg-white/70 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'}`}></div>
                          <span className="text-[#3F2E3E] font-medium">{dest.name}</span>
                        </div>
                        <span className="text-[#A78295] text-sm group-hover:text-[#3F2E3E] transition-colors">{dest.count} trips</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Community Stats */}
                <div>
                  <h3 className="text-lg font-bold text-[#3F2E3E] mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-[#A78295]" />
                    Community Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[#A78295] text-sm">This Month</span>
                      <span className="text-[#3F2E3E] font-bold">+{randomStats.monthlyTrips} trips</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#A78295] text-sm">Active Now</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[#3F2E3E] font-bold">{randomStats.activeUsers} users</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#A78295] text-sm">Success Rate</span>
                      <span className="text-green-600 font-bold">94%</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-bold text-[#3F2E3E] mb-4 flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-[#A78295]" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {[
                      { action: "joined", user: "Priya", trip: "Goa Beach", time: "2h ago" },
                      { action: "created", user: "Rahul", trip: "Himalayan Trek", time: "4h ago" },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-xl bg-white/30 hover:bg-white/50 transition-colors">
                        <div className="w-2 h-2 bg-[#A78295] rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-[#3F2E3E] text-sm">
                            <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">{activity.trip}</span>
                          </p>
                          <p className="text-[#A78295] text-xs">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Travel Tips */}
                <div className="bg-gradient-to-br from-[#A78295]/10 to-[#3F2E3E]/10 rounded-2xl p-6 relative overflow-hidden">
                  <h3 className="text-lg font-bold text-[#3F2E3E] mb-4 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#A78295] to-[#3F2E3E] rounded-full flex items-center justify-center mr-3 shadow-lg">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Travel Tip
                  </h3>
                  <p className="text-sm text-[#3F2E3E] leading-relaxed mb-4">
                    "Book accommodations 2-3 weeks in advance for the best deals. Popular destinations fill up quickly during peak seasons!"
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-[#A78295] bg-[#A78295]/10 px-3 py-1 rounded-full border border-[#A78295]/20">
                      💡 Tip #{randomStats.tipNumber} of 100
                    </div>
                    <div className="w-2 h-2 bg-[#A78295] rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-bold text-[#3F2E3E] mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => {
                        setShowCreateTrip(true)
                        setShowMobileSidebar(false)
                      }}
                      className="w-full p-3 bg-gradient-to-r from-[#3F2E3E] to-[#5A4A5A] text-white rounded-xl hover:shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Trip</span>
                    </button>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Stats */}
      <div className="bg-gradient-to-r from-[#3F2E3E] to-[#5A4A5A] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Your Next Adventure</h1>
            <p className="text-xl opacity-90">Connect with fellow travelers and explore the world together</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold">{travelStats.totalTrips}</div>
              <div className="text-sm opacity-80">Total Trips</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold">{travelStats.activeUsers}</div>
              <div className="text-sm opacity-80">Active Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold">{travelStats.totalTravelers}</div>
              <div className="text-sm opacity-80">Total Travelers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold">{travelStats.upcomingTrips}</div>
              <div className="text-sm opacity-80">Upcoming Trips</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24 h-fit">
            {/* Trending Destinations */}
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/50 shadow-lg p-6">
              <h3 className="text-lg font-bold text-[#3F2E3E] mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-[#A78295]" />
                Trending Destinations
              </h3>
              <div className="space-y-3">
                {popularDestinations.map((dest, index) => (
                  <button
                    key={dest.name}
                    onClick={() => scrollToDestination(dest.name)}
                    className="flex items-center justify-between w-full p-3 rounded-xl bg-white/50 hover:bg-white/70 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'}`}></div>
                      <span className="text-[#3F2E3E] font-medium">{dest.name}</span>
                    </div>
                    <span className="text-[#A78295] text-sm group-hover:text-[#3F2E3E] transition-colors">{dest.count} trips</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/50 shadow-lg p-6">
              <h3 className="text-lg font-bold text-[#3F2E3E] mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-[#A78295]" />
                Community Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#A78295] text-sm">This Month</span>
                  <span className="text-[#3F2E3E] font-bold">+{randomStats.monthlyTrips} trips</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A78295] text-sm">Active Now</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[#3F2E3E] font-bold">{randomStats.activeUsers} users</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A78295] text-sm">Success Rate</span>
                  <span className="text-green-600 font-bold">94%</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="col-span-1 lg:col-span-6">
            {/* Inline Filters - Only show on feed view */}
            {currentView === "feed" && (
              <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/50 shadow-lg p-4 mb-6">
                <div className="space-y-3">
                  {/* Filter Buttons - Horizontally Scrollable */}
                  <div className="relative">
                    <div className="flex items-center space-x-3 overflow-x-auto scrollbar-hide">
                      <div className="flex space-x-2 min-w-max">
                        {filterOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setSelectedFilter(option.value)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                              selectedFilter === option.value
                                ? "bg-[#3F2E3E] text-white shadow-lg"
                                : "bg-white/60 text-[#3F2E3E] hover:bg-[#A78295]/20"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Scroll fade indicator */}
                    <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white/60 to-transparent pointer-events-none"></div>
                  </div>

                  {/* Popular Destinations - Compact */}
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-medium text-[#A78295] flex-shrink-0">Popular:</span>
                    <div className="flex space-x-1.5 overflow-x-auto scrollbar-hide">
                      <div className="flex space-x-1.5 min-w-max">
                        {popularDestinations.slice(0, 4).map((dest) => (
                          <button
                            key={dest.name}
                            onClick={() => scrollToDestination(dest.name)}
                            className="px-2 py-0.5 bg-[#A78295]/15 text-[#3F2E3E] rounded-full text-xs hover:bg-[#A78295]/25 transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
                          >
                            {dest.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

        {currentView === "mytrips" ? (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-[#3F2E3E]">My Trips</h1>
              <button
                onClick={handleFeed}
                className="px-4 py-2 text-[#A78295] hover:text-[#3F2E3E] transition-colors cursor-pointer"
              >
                Back to Feed
              </button>
            </div>
            <div className="space-y-8">
              {userTrips.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mb-8">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#3F2E3E] to-[#A78295] rounded-full flex items-center justify-center mb-6 shadow-xl">
                      <Briefcase className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#3F2E3E] mb-4">Start Your Travel Journey</h3>
                    <p className="text-[#A78295] text-lg mb-8 max-w-md mx-auto">Create your first trip and connect with fellow travelers to explore the world together.</p>
                    <div className="space-y-4">
                  <button
                    onClick={() => setShowCreateTrip(true)}
                        className="px-8 py-4 bg-gradient-to-r from-[#3F2E3E] to-[#5A4A5A] text-white rounded-full hover:shadow-lg transition-all font-medium cursor-pointer transform hover:scale-105"
                  >
                        <Plus className="w-5 h-5 inline mr-2" />
                    Create Your First Trip
                  </button>
                      <div className="flex justify-center space-x-8 text-sm text-[#A78295]">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>Connect with travelers</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>Explore destinations</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4" />
                          <span>Share experiences</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                userTrips.map((post) => (
                  <article
                    key={post.id}
                    data-destination={post.destination}
                    className="bg-white/60 backdrop-blur-lg rounded-3xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in group relative w-full"
                  >
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      {post.currentTravelers >= post.maxTravelers ? (
                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-lg">
                          Full
                        </span>
                      ) : post.hasJoined ? (
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
                          Joined
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full shadow-lg">
                          Open
                        </span>
                      )}
                    </div>
                    {/* Post Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={post.user.avatar || "/placeholder.svg"}
                            alt={post.user.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white/60"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-[#3F2E3E]">{post.user.name}</h3>
                              {post.user.verified && (
                                <div className="w-4 h-4 bg-[#A78295] rounded-full flex items-center justify-center">
                                  <Check className="w-2 h-2 text-white" />
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-[#A78295]">{post.postedAt}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleShare(post.id)}
                          className="p-2 rounded-full hover:bg-white/40 transition-all cursor-pointer"
                        >
                          <Share2 className="w-5 h-5 text-[#A78295]" />
                        </button>
                      </div>

                      {/* Destination Info */}
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <MapPin className="w-5 h-5 text-[#A78295]" />
                          <h2 className="text-xl font-bold text-[#3F2E3E]">{post.destination}</h2>
                          <span className="text-[#A78295]">, {post.state}</span>
                        </div>
                        <p className="text-[#3F2E3E] leading-relaxed line-clamp-1 overflow-hidden text-ellipsis">{post.description}</p>
                      </div>
                    </div>

                    {/* Post Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.destination}
                        className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-sm font-medium">Explore {post.destination}</p>
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div className="p-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/60">
                          <div className="flex items-center space-x-2 mb-1">
                            <Calendar className="w-4 h-4 text-[#A78295]" />
                            <span className="text-sm font-medium text-[#3F2E3E]">Departure</span>
                          </div>
                          <p className="text-sm text-[#3F2E3E]">
                            {new Date(post.departureDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/60">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-[#3F2E3E]">Duration</span>
                          </div>
                          <p className="text-sm text-[#3F2E3E]">{post.duration}</p>
                        </div>
                        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/60">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-[#3F2E3E]">Budget</span>
                          </div>
                          <p className="text-sm text-[#3F2E3E]">{formatBudget(post.budget)}</p>
                        </div>
                        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/60">
                          <div className="flex items-center space-x-2 mb-2">
                            <Users className="w-4 h-4 text-[#A78295]" />
                            <span className="text-sm font-medium text-[#3F2E3E]">Travelers</span>
                          </div>
                          <p className="text-sm text-[#3F2E3E] mb-2">
                            {post.currentTravelers}/{post.maxTravelers}
                          </p>
                          <div className="w-full bg-[#A78295]/20 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-[#3F2E3E] to-[#A78295] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(post.currentTravelers / post.maxTravelers) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#A78295]/20 text-[#3F2E3E] rounded-full text-sm font-medium border border-[#A78295]/30"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <button
                            onClick={() => handleLike(post.id)}
                            className="flex items-center space-x-2 text-[#A78295] hover:text-[#3F2E3E] transition-all cursor-pointer"
                          >
                            <Heart className={`w-5 h-5 ${post.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                            <span className="font-medium">{post.likes}</span>
                          </button>
                          <button
                            onClick={() => toggleComments(post.id)}
                            className="flex items-center space-x-2 text-[#A78295] hover:text-[#3F2E3E] transition-all cursor-pointer"
                          >
                            <MessageCircle className="w-5 h-5" />
                            <span className="font-medium">{post.comments.length}</span>
                          </button>
                        </div>

                        <div className="px-6 py-3 rounded-full font-semibold bg-[#A78295] text-white">Your Trip</div>
                      </div>

                      {/*Comments Section */} 
                      {expandedComments === post.id && (
                        <div className="mt-6 border-t border-[#A78295]/20 pt-6">
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
                                className="flex-1 px-3 py-2 border border-[#A78295]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78295]/50 bg-white/50"
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    handleComment(post.id)
                                  }
                                }}
                              />
                              <button
                                onClick={() => handleComment(post.id)}
                                className="px-4 py-2 bg-[#3F2E3E] text-white rounded-lg hover:bg-[#331D2C] transition-colors cursor-pointer"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Comments List */}
                          <div className="space-y-4">
                            {post.comments.map((comment) => (
                              <div key={comment.id} className="flex items-start space-x-3">
                                <img
                                  src={comment.user.avatar || "/placeholder.svg"}
                                  alt={comment.user.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <div className="bg-white/70 rounded-lg p-3">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="font-semibold text-[#3F2E3E] text-sm">{comment.user.name}</span>
                                      <span className="text-xs text-[#A78295]">{comment.timestamp}</span>
                                    </div>
                                    <p className="text-[#3F2E3E] text-sm">{comment.content}</p>
                                  </div>
                                  <div className="flex items-center space-x-4 mt-2">
                                    <button
                                      onClick={() => handleCommentLike(post.id, comment.id)}
                                      className="flex items-center space-x-1 text-xs text-[#A78295] hover:text-[#3F2E3E] transition-colors cursor-pointer"
                                    >
                                      <Heart
                                        className={`w-3 h-3 ${comment.isLiked ? "fill-red-500 text-red-500" : ""}`}
                                      />
                                      <span>{comment.likes}</span>
                                    </button>
                                    <button
                                      onClick={() => setReplyingTo(comment.id)}
                                      className="text-xs text-[#A78295] hover:text-[#3F2E3E] transition-colors cursor-pointer"
                                    >
                                      Reply
                                    </button>
                                  </div>

                                  {/* Replies */}
                                  {comment.replies.map((reply) => (
                                    <div key={reply.id} className="ml-6 mt-3 flex items-start space-x-3">
                                      <img
                                        src={reply.user.avatar || "/placeholder.svg"}
                                        alt={reply.user.name}
                                        className="w-6 h-6 rounded-full object-cover"
                                      />
                                      <div className="flex-1">
                                        <div className="bg-white rounded-lg p-3 border border-[#A78295]/20">
                                          <div className="flex items-center space-x-2 mb-1">
                                            <span className="font-semibold text-[#3F2E3E] text-xs">
                                              {reply.user.name}
                                            </span>
                                            <span className="text-xs text-[#A78295]">{reply.timestamp}</span>
                                          </div>
                                          <p className="text-[#3F2E3E] text-xs">{reply.content}</p>
                                        </div>
                                        <button
                                          onClick={() => handleCommentLike(post.id, reply.id, true, comment.id)}
                                          className="flex items-center space-x-1 text-xs text-[#A78295] hover:text-[#3F2E3E] transition-colors mt-1 cursor-pointer"
                                        >
                                          <Heart
                                            className={`w-3 h-3 ${reply.isLiked ? "fill-red-500 text-red-500" : ""}`}
                                          />
                                          <span>{reply.likes}</span>
                                        </button>
                                      </div>
                                    </div>
                                  ))}

                                  {/* Reply Input */}
                                  {replyingTo === comment.id && (
                                    <div className="ml-6 mt-3 flex space-x-2">
                                      <input
                                        type="text"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Write a reply..."
                                        className="flex-1 px-3 py-2 border border-[#A78295]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78295]/50 text-sm bg-white/50"
                                        onKeyPress={(e) => {
                                          if (e.key === "Enter") {
                                            handleReply(post.id, comment.id)
                                          }
                                        }}
                                      />
                                      <button
                                        onClick={() => handleReply(post.id, comment.id)}
                                        className="px-3 py-2 bg-[#3F2E3E] text-white rounded-lg hover:bg-[#331D2C] transition-colors cursor-pointer"
                                      >
                                        <Send className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* Loading State */}
            {isLoading && (
          <div className="space-y-8">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white/60 backdrop-blur-lg rounded-3xl border border-white/50 shadow-lg overflow-hidden animate-pulse">
                    <div className="p-6 pb-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-[#A78295]/20 rounded-full"></div>
                        <div>
                          <div className="w-32 h-4 bg-[#A78295]/20 rounded mb-2"></div>
                          <div className="w-20 h-3 bg-[#A78295]/20 rounded"></div>
              </div>
                      </div>
                      <div className="w-48 h-6 bg-[#A78295]/20 rounded mb-2"></div>
                      <div className="w-full h-20 bg-[#A78295]/20 rounded"></div>
                    </div>
                    <div className="w-full h-80 bg-[#A78295]/20"></div>
                    <div className="p-6">
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="bg-[#A78295]/10 rounded-2xl p-4">
                            <div className="w-full h-4 bg-[#A78295]/20 rounded mb-2"></div>
                            <div className="w-2/3 h-3 bg-[#A78295]/20 rounded"></div>
                          </div>
                        ))}
                      </div>
                      <div className="flex space-x-2 mb-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-16 h-6 bg-[#A78295]/20 rounded-full"></div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-4">
                          <div className="w-12 h-6 bg-[#A78295]/20 rounded"></div>
                          <div className="w-12 h-6 bg-[#A78295]/20 rounded"></div>
                        </div>
                        <div className="w-24 h-10 bg-[#A78295]/20 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-8">
              {!isLoading && filteredPosts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mb-6">
                    <div className="w-24 h-24 mx-auto bg-[#A78295]/20 rounded-full flex items-center justify-center mb-4">
                      <MapPin className="w-12 h-12 text-[#A78295]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#3F2E3E] mb-2">No trips found</h3>
                    <p className="text-[#A78295] text-lg mb-6">Try adjusting your search or filters to find more trips</p>
                    <button
                      onClick={() => {
                        setSearchQuery("")
                        setSelectedFilter("all")
                      }}
                      className="px-6 py-3 bg-[#3F2E3E] text-white rounded-full hover:bg-[#331D2C] transition-colors cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              ) : !isLoading ? (
              filteredPosts.map((post) => (
                <article
                  key={post.id}
                  data-destination={post.destination}
                  className="bg-white/60 backdrop-blur-lg rounded-3xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in"
                >
                  {/* Post Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={post.user.avatar || "/placeholder.svg"}
                          alt={post.user.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white/60"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-[#3F2E3E]">{post.user.name}</h3>
                            {post.user.verified && (
                              <div className="w-4 h-4 bg-[#A78295] rounded-full flex items-center justify-center">
                                <Check className="w-2 h-2 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-[#A78295]">{post.postedAt}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleShare(post.id)}
                        className="p-2 rounded-full hover:bg-white/40 transition-all cursor-pointer"
                      >
                        <Share2 className="w-5 h-5 text-[#A78295]" />
                      </button>
                    </div>

                    {/* Destination Info */}
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-5 h-5 text-[#A78295]" />
                        <h2 className="text-xl font-bold text-[#3F2E3E]">{post.destination}</h2>
                        <span className="text-[#A78295]">, {post.state}</span>
                      </div>
                      <p className="text-[#3F2E3E] leading-relaxed line-clamp-1 overflow-hidden text-ellipsis">{post.description}</p>
                    </div>
                  </div>

                  {/* Post Image */}
                  <div className="relative">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.destination}
                      className="w-full h-80 object-cover"
                    />
                  </div>

                  {/* Trip Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/60">
                        <div className="flex items-center space-x-2 mb-1">
                          <Calendar className="w-4 h-4 text-[#A78295]" />
                          <span className="text-sm font-medium text-[#3F2E3E]">Departure</span>
                        </div>
                        <p className="text-sm text-[#3F2E3E]">{post.departureDate}</p>
                      </div>
                      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/60">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-[#3F2E3E]">Duration</span>
                        </div>
                        <p className="text-sm text-[#3F2E3E]">{post.duration}</p>
                      </div>
                      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/60">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-[#3F2E3E]">Budget</span>
                        </div>
                        <p className="text-sm text-[#3F2E3E]">{formatBudget(post.budget)}</p>
                      </div>
                      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/60">
                        <div className="flex items-center space-x-2 mb-1">
                          <Users className="w-4 h-4 text-[#A78295]" />
                          <span className="text-sm font-medium text-[#3F2E3E]">Travelers</span>
                        </div>
                        <p className="text-sm text-[#3F2E3E]">
                          {post.currentTravelers}/{post.maxTravelers}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#A78295]/20 text-[#3F2E3E] rounded-full text-sm font-medium border border-[#A78295]/30"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => handleLike(post.id)}
                          className="flex items-center space-x-2 text-[#A78295] hover:text-[#3F2E3E] transition-all cursor-pointer"
                        >
                          <Heart className={`w-5 h-5 ${post.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                          <span className="font-medium">{post.likes}</span>
                        </button>
                        <button
                          onClick={() => toggleComments(post.id)}
                          className="flex items-center space-x-2 text-[#A78295] hover:text-[#3F2E3E] transition-all cursor-pointer"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span className="font-medium">{post.comments.length}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleJoin(post.id)}
                        disabled={post.currentTravelers >= post.maxTravelers || post.hasJoined}
                        className={`px-6 py-3 rounded-full font-semibold transition-all cursor-pointer ${
                          post.hasJoined
                            ? "bg-[#A78295] text-white cursor-default"
                            : post.currentTravelers >= post.maxTravelers
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-[#3F2E3E] text-white hover:bg-[#331D2C] shadow-lg hover:shadow-xl"
                        }`}
                      >
                        {post.hasJoined
                          ? "Joined"
                          : post.currentTravelers >= post.maxTravelers
                            ? "Trip Full"
                            : "Join Trip"}
                      </button>
                    </div>

                    {/* Comments Section */} 
                    {expandedComments === post.id && (
                      <div className="mt-6 border-t border-[#A78295]/20 pt-6">
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
                              className="flex-1 px-3 py-2 border border-[#A78295]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78295]/50 bg-white/50"
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  handleComment(post.id)
                                }
                              }}
                            />
                            <button
                              onClick={() => handleComment(post.id)}
                              className="px-4 py-2 bg-[#3F2E3E] text-white rounded-lg hover:bg-[#331D2C] transition-colors cursor-pointer"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-4">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="flex items-start space-x-3">
                              <img
                                src={comment.user.avatar || "/placeholder.svg"}
                                alt={comment.user.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="bg-white/70 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-semibold text-[#3F2E3E] text-sm">{comment.user.name}</span>
                                    <span className="text-xs text-[#A78295]">{comment.timestamp}</span>
                                  </div>
                                  <p className="text-[#3F2E3E] text-sm">{comment.content}</p>
                                </div>
                                <div className="flex items-center space-x-4 mt-2">
                                  <button
                                    onClick={() => handleCommentLike(post.id, comment.id)}
                                    className="flex items-center space-x-1 text-xs text-[#A78295] hover:text-[#3F2E3E] transition-colors cursor-pointer"
                                  >
                                    <Heart
                                      className={`w-3 h-3 ${comment.isLiked ? "fill-red-500 text-red-500" : ""}`}
                                    />
                                    <span>{comment.likes}</span>
                                  </button>
                                  <button
                                    onClick={() => setReplyingTo(comment.id)}
                                    className="text-xs text-[#A78295] hover:text-[#3F2E3E] transition-colors cursor-pointer"
                                  >
                                    Reply
                                  </button>
                                </div>

                                {/* Replies */}
                                {comment.replies.map((reply) => (
                                  <div key={reply.id} className="ml-6 mt-3 flex items-start space-x-3">
                                    <img
                                      src={reply.user.avatar || "/placeholder.svg"}
                                      alt={reply.user.name}
                                      className="w-6 h-6 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                      <div className="bg-white rounded-lg p-3 border border-[#A78295]/20">
                                        <div className="flex items-center space-x-2 mb-1">
                                          <span className="font-semibold text-[#3F2E3E] text-xs">
                                            {reply.user.name}
                                          </span>
                                          <span className="text-xs text-[#A78295]">{reply.timestamp}</span>
                                        </div>
                                        <p className="text-[#3F2E3E] text-xs">{reply.content}</p>
                                      </div>
                                      <button
                                        onClick={() => handleCommentLike(post.id, reply.id, true, comment.id)}
                                        className="flex items-center space-x-1 text-xs text-[#A78295] hover:text-[#3F2E3E] transition-colors mt-1 cursor-pointer"
                                      >
                                        <Heart
                                          className={`w-3 h-3 ${reply.isLiked ? "fill-red-500 text-red-500" : ""}`}
                                        />
                                        <span>{reply.likes}</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}

                                {/* Reply Input */}
                                {replyingTo === comment.id && (
                                  <div className="ml-6 mt-3 flex space-x-2">
                                    <input
                                      type="text"
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      placeholder="Write a reply..."
                                      className="flex-1 px-3 py-2 border border-[#A78295]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78295]/50 text-sm bg-white/50"
                                      onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                          handleReply(post.id, comment.id)
                                        }
                                      }}
                                    />
                                    <button
                                      onClick={() => handleReply(post.id, comment.id)}
                                      className="px-3 py-2 bg-[#3F2E3E] text-white rounded-lg hover:bg-[#331D2C] transition-colors cursor-pointer"
                                    >
                                      <Send className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))
            ) : null}
            </div>
          </div>
        )}
        </div>

        {/* Right Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24 h-fit">

          {/* Recent Activity */}
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/50 shadow-lg p-6">
            <h3 className="text-lg font-bold text-[#3F2E3E] mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-[#A78295]" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {[
                { action: "joined", user: "Priya", trip: "Goa Beach", time: "2h ago" },
                { action: "created", user: "Rahul", trip: "Himalayan Trek", time: "4h ago" },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-xl bg-white/30 hover:bg-white/50 transition-colors">
                  <div className="w-2 h-2 bg-[#A78295] rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-[#3F2E3E] text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">{activity.trip}</span>
                    </p>
                    <p className="text-[#A78295] text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Travel Tips */}
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/50 shadow-lg p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#A78295]/10 to-[#3F2E3E]/10"></div>
            <div className="relative">
              <h3 className="text-lg font-bold text-[#3F2E3E] mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-[#A78295] to-[#3F2E3E] rounded-full flex items-center justify-center mr-3 shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                Travel Tip
              </h3>
              <p className="text-sm text-[#3F2E3E] leading-relaxed mb-4">
                "Book accommodations 2-3 weeks in advance for the best deals. Popular destinations fill up quickly during peak seasons!"
              </p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-[#A78295] bg-[#A78295]/10 px-3 py-1 rounded-full border border-[#A78295]/20">
                  💡 Tip #{randomStats.tipNumber} of 100
                </div>
                <div className="w-2 h-2 bg-[#A78295] rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/50 shadow-lg p-6">
            <h3 className="text-lg font-bold text-[#3F2E3E] mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => setShowCreateTrip(true)}
                className="w-full p-3 bg-gradient-to-r from-[#3F2E3E] to-[#5A4A5A] text-white rounded-xl hover:shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Trip</span>
              </button>
            </div>
          </div>
        </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#3F2E3E] to-[#5A4A5A] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Yatra</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Connect with fellow travelers and explore the world together. Create memories, share experiences, and discover amazing destinations.
              </p>
                <div className="flex space-x-3">
                 <a href="#"
                   className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
                   title="Follow us on Twitter"
                 >
                   <span className="text-white/60 group-hover:text-white/80 text-sm font-medium">T</span>
                 </a>
                 <a href="#"
                   className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
                   title="Follow us on Pinterest"
                 >
                   <span className="text-white/60 group-hover:text-white/80 text-sm font-medium">P</span>
                 </a>
                 <a href="#"
                   className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
                   title="Follow us on Instagram"
                 >
                   <span className="text-white/60 group-hover:text-white/80 text-sm font-medium">I</span>
                 </a>
                 <a href="#"
                   className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
                   title="Follow us on LinkedIn"
                 >
                   <span className="text-white/60 group-hover:text-white/80 text-sm font-medium">L</span>
                 </a>
               </div>
            </div>

            {/* Explore */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors cursor-pointer">Beach Destinations</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors cursor-pointer">Mountain Adventures</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors cursor-pointer">Cultural Heritage</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors cursor-pointer">Wildlife & Nature</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors cursor-pointer">City Breaks</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors cursor-pointer">Adventure Sports</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors cursor-pointer">Help Center</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors cursor-pointer">Safety Guidelines</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors cursor-pointer">Community Rules</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors cursor-pointer">Contact Us</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors cursor-pointer">Report Issue</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors cursor-pointer">Feedback</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Stay Updated</h4>
              <p className="text-white/80 text-sm">Get the latest travel tips and destination updates.</p>
              <div className="space-y-3">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSubscribe()
                      }
                    }}
                    className="flex-1 px-4 py-2 rounded-l-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  />
                  <button 
                    onClick={handleSubscribe}
                    className="px-4 py-2 bg-white text-[#3F2E3E] rounded-r-lg hover:bg-white/90 transition-colors font-medium cursor-pointer"
                  >
                    Subscribe
                  </button>
                </div>
                <p className="text-xs text-white/60">
                  By subscribing, you agree to our Privacy Policy and consent to receive updates.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 mt-8 pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-sm text-white/80">
                © 2024 Yatra. All rights reserved.
              </div>
              <div className="flex flex-wrap gap-6 text-sm">
                <a href="#" className="text-white/80 hover:text-white transition-colors cursor-pointer">Privacy Policy</a>
                <a href="#" className="text-white/80 hover:text-white transition-colors cursor-pointer">Terms of Service</a>
                <a href="#" className="text-white/80 hover:text-white transition-colors cursor-pointer">Cookie Policy</a>
                <a href="#" className="text-white/80 hover:text-white transition-colors cursor-pointer">Accessibility</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200..1000;1,200..1000&display=swap');
          
          .font-mulish {
            font-family: "Mulish", sans-serif;
            font-optical-sizing: auto;
            font-style: normal;
          }
          
          @keyframes slide-up {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes slide-in-right {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: .5;
            }
          }

          @keyframes bounce-in {
            0% {
              transform: scale(0.3);
              opacity: 0;
            }
            50% {
              transform: scale(1.05);
            }
            70% {
              transform: scale(0.9);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          .animate-slide-up {
            animation: slide-up 0.3s ease-out;
          }

          .animate-slide-in-right {
            animation: slide-in-right 0.3s ease-out;
          }
          
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }

          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          .animate-bounce-in {
            animation: bounce-in 0.6s ease-out;
          }

          /* Hide scrollbar but keep functionality */
          .scrollbar-hide {
            -ms-overflow-style: none;  /* Internet Explorer 10+ */
            scrollbar-width: none;  /* Firefox */
          }
          .scrollbar-hide::-webkit-scrollbar { 
            display: none;  /* Safari and Chrome */
          }

          /* Custom scrollbar for mobile sidebar */
          .scrollbar-thin {
            scrollbar-width: thin;
            scrollbar-color: rgba(167, 130, 149, 0.5) transparent;
            -webkit-overflow-scrolling: touch;
          }
          
          .scrollbar-thin::-webkit-scrollbar {
            width: 4px;
          }
          
          .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background-color: rgba(167, 130, 149, 0.5);
            border-radius: 20px;
          }
          
          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background-color: rgba(167, 130, 149, 0.7);
          }

          /* Prevent background scroll on mobile when sidebar is open */
          body.sidebar-open {
            overflow: hidden !important;
            position: fixed !important;
            width: 100% !important;
            height: 100% !important;
          }

          /* Highlight effect for destination cards */
          .highlight-destination {
            animation: highlight-pulse 2s ease-in-out;
            transform: scale(1.02);
            box-shadow: 0 20px 25px -5px rgba(63, 46, 62, 0.3), 0 10px 10px -5px rgba(63, 46, 62, 0.1) !important;
          }

          @keyframes highlight-pulse {
            0%, 100% {
              box-shadow: 0 20px 25px -5px rgba(63, 46, 62, 0.3), 0 10px 10px -5px rgba(63, 46, 62, 0.1);
            }
            50% {
              box-shadow: 0 25px 35px -5px rgba(167, 130, 149, 0.4), 0 15px 15px -5px rgba(167, 130, 149, 0.2);
            }
          }

          /* Smooth scrolling */
          .scrollbar-hide {
            scroll-behavior: smooth;
          }

          .cursor-pointer {
            cursor: pointer;
          }

          button {
            cursor: pointer;
          }

          input[type="text"], input[type="url"], input[type="date"], input[type="number"], textarea {
            cursor: text;
          }
        `}</style>
    </div>
  )
}