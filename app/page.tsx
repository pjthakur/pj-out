"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { 
  Search, 
  Sun, 
  Moon, 
  Calendar, 
  MapPin, 
  User, 
  Trophy, 
  Target, 
  X,
  Users,
  Clock,
  Upload,
  Plus
} from "lucide-react"

// Types
interface Match {
  id: string
  title: string
  sport: string
  date: string
  time: string
  location: string
  maxPlayers: number
  currentPlayers: number
  organizer: string
  description: string
  image: string
  participants: string[]
  createdBy?: string
}

interface User {
  id: string
  name: string
  avatar: string
}

// data 
const mockMatches: Match[] = [
  {
    id: "1",
    title: "Weekend Football Match",
    sport: "Football",
    date: "2024-01-15",
    time: "14:00",
    location: "Central Park Field A",
    maxPlayers: 22,
    currentPlayers: 8,
    organizer: "Alex Johnson",
    description: "Friendly football match for all skill levels. Bring your own gear!",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop",
    participants: [
      "John Doe",
      "Jane Smith",
      "Mike Wilson",
      "Sarah Davis",
      "Tom Brown",
      "Lisa Garcia",
      "David Lee",
      "Emma Taylor",
    ],
    createdBy: "other",
  },
  {
    id: "2",
    title: "Basketball Tournament",
    sport: "Basketball",
    date: "2024-01-16",
    time: "18:00",
    location: "Downtown Sports Center",
    maxPlayers: 10,
    currentPlayers: 6,
    organizer: "Maria Rodriguez",
    description: "3v3 basketball tournament with prizes for winners!",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
    participants: ["Carlos Martinez", "Ashley Johnson", "Kevin Park", "Nicole White", "Ryan Adams", "Sophia Chen"],
    createdBy: "other",
  },
  {
    id: "3",
    title: "Tennis Doubles Match",
    sport: "Tennis",
    date: "2024-01-17",
    time: "10:00",
    location: "Riverside Tennis Club",
    maxPlayers: 4,
    currentPlayers: 2,
    organizer: "You",
    description: "Looking for doubles partners for a competitive match.",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop",
    participants: ["You", "Amanda Foster"],
    createdBy: "current-user",
  },
  {
    id: "4",
    title: "Swimming Competition",
    sport: "Swimming",
    date: "2024-01-18",
    time: "08:00",
    location: "Olympic Pool Complex",
    maxPlayers: 20,
    currentPlayers: 12,
    organizer: "Rachel Green",
    description: "Morning swimming competition for fitness enthusiasts.",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop",
    participants: [
      "Rachel Green",
      "Mark Thompson",
      "Linda Davis",
      "Chris Anderson",
      "Maya Patel",
      "Steve Rogers",
      "Anna Kim",
      "Paul Martinez",
      "Jessica Brown",
      "Daniel Lee",
      "Sophie Turner",
      "Michael Scott",
    ],
    createdBy: "other",
  },
  {
    id: "5",
    title: "Volleyball Beach Tournament",
    sport: "Volleyball",
    date: "2024-01-19",
    time: "16:00",
    location: "Sunset Beach",
    maxPlayers: 12,
    currentPlayers: 8,
    organizer: "Tyler Brooks",
    description: "Beach volleyball tournament with BBQ after the games!",
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=300&fit=crop",
    participants: [
      "Tyler Brooks",
      "Megan Clark",
      "Jake Miller",
      "Olivia Johnson",
      "Ethan Davis",
      "Chloe Wilson",
      "Noah Garcia",
      "Ava Martinez",
    ],
    createdBy: "other",
  },
  {
    id: "6",
    title: "Cricket Match",
    sport: "Cricket",
    date: "2024-01-20",
    time: "13:00",
    location: "City Cricket Ground",
    maxPlayers: 22,
    currentPlayers: 15,
    organizer: "Raj Patel",
    description: "Traditional cricket match with tea break included.",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=300&fit=crop",
    participants: [
      "Raj Patel",
      "Priya Sharma",
      "Arjun Kumar",
      "Sneha Gupta",
      "Vikram Singh",
      "Anita Reddy",
      "Rohit Mehta",
      "Kavya Nair",
      "Suresh Rao",
      "Deepika Joshi",
      "Amit Verma",
      "Pooja Agarwal",
      "Sanjay Iyer",
      "Ritu Malhotra",
      "Karan Chopra",
    ],
    createdBy: "other",
  },
  {
    id: "7",
    title: "Morning Yoga Session",
    sport: "Yoga",
    date: "2024-01-21",
    time: "07:00",
    location: "Peaceful Garden Park",
    maxPlayers: 15,
    currentPlayers: 9,
    organizer: "Zen Master Sarah",
    description: "Start your day with peaceful yoga in nature. All levels welcome!",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop",
    participants: [
      "Zen Master Sarah",
      "Lisa Park",
      "Michael Chen",
      "Anna Williams",
      "David Kim",
      "Sophie Lee",
      "James Wilson",
      "Emma Davis",
      "Ryan Taylor",
    ],
    createdBy: "other",
  },
  {
    id: "8",
    title: "Badminton Championship",
    sport: "Badminton",
    date: "2024-01-22",
    time: "15:00",
    location: "Sports Complex Hall 2",
    maxPlayers: 16,
    currentPlayers: 11,
    organizer: "Coach Martinez",
    description: "Competitive badminton tournament with trophies for winners!",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=300&fit=crop",
    participants: [
      "Coach Martinez",
      "Alice Johnson",
      "Bob Smith",
      "Carol White",
      "Dan Brown",
      "Eva Green",
      "Frank Miller",
      "Grace Lee",
      "Henry Wilson",
      "Ivy Chen",
      "Jack Davis",
    ],
    createdBy: "other",
  },
  {
    id: "9",
    title: "Rock Climbing Adventure",
    sport: "Climbing",
    date: "2024-01-23",
    time: "09:00",
    location: "Mountain Ridge Climbing Center",
    maxPlayers: 8,
    currentPlayers: 5,
    organizer: "Adventure Mike",
    description: "Indoor rock climbing session for beginners and intermediate climbers.",
    image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&h=300&fit=crop",
    participants: ["Adventure Mike", "Sarah Connor", "Tom Hardy", "Lisa Simpson", "Mark Johnson"],
    createdBy: "other",
  },
  {
    id: "10",
    title: "Table Tennis Tournament",
    sport: "Table Tennis",
    date: "2024-01-24",
    time: "19:00",
    location: "Community Center",
    maxPlayers: 12,
    currentPlayers: 7,
    organizer: "Ping Pong Pete",
    description: "Fast-paced table tennis tournament with multiple skill divisions.",
    image: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=400&h=300&fit=crop",
    participants: [
      "Ping Pong Pete",
      "Quick Draw McGraw",
      "Speedy Gonzalez",
      "Flash Gordon",
      "Rapid Fire Rita",
      "Lightning Luke",
      "Turbo Tim",
    ],
    createdBy: "other",
  },
]

const currentUser: User = {
  id: "current-user",
  name: "You",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
}

const sports = ["All", "Football", "Basketball", "Tennis", "Swimming", "Volleyball", "Cricket"]

export default function SportsApp() {
  const [matches, setMatches] = useState<Match[]>(mockMatches)
  const [filteredMatches, setFilteredMatches] = useState<Match[]>(mockMatches)
  const [selectedSport, setSelectedSport] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showMyGames, setShowMyGames] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: "", show: false })
  const [newMatch, setNewMatch] = useState({
    title: "",
    sport: "Football",
    date: "",
    time: "",
    location: "",
    maxPlayers: 10,
    description: "",
    image: "",
  })

  // Carousel autoplay 
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // Filter matches
  useEffect(() => {
    let filtered = matches

    if (selectedSport !== "All") {
      filtered = filtered.filter((match) => match.sport === selectedSport)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (match) =>
          match.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredMatches(filtered)
  }, [selectedSport, searchQuery, matches])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showCreateModal || showMyGames) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [showCreateModal, showMyGames])

  const toggleMatchParticipation = (matchId: string) => {
    // Check current state before making changes
    const currentMatch = matches.find(m => m.id === matchId)
    const isCurrentlyParticipant = currentMatch?.participants.includes(currentUser.name)
    const isOrganizer = currentMatch?.organizer === currentUser.name
    
    // Prevent organizer from leaving their own match
    if (isCurrentlyParticipant && isOrganizer) {
      showToast("You cannot leave a match you organized!")
      return
    }
    
    setMatches((prev) =>
      prev.map((match) => {
        if (match.id === matchId) {
          const isUserParticipant = match.participants.includes(currentUser.name)
          
          if (isUserParticipant) {
            // User is leaving the match
            return {
              ...match,
              currentPlayers: Math.max(1, match.currentPlayers - 1), // Ensure at least 1 (organizer)
              participants: match.participants.filter(name => name !== currentUser.name),
            }
          } else {
            // User is joining the match
            if (match.currentPlayers < match.maxPlayers) {
              return {
                ...match,
                currentPlayers: match.currentPlayers + 1,
                participants: [...match.participants, currentUser.name],
              }
            }
          }
        }
        return match
      }),
    )
    
    // Show appropriate toast message
    if (isCurrentlyParticipant) {
      showToast("Left the match successfully!")
    } else {
      showToast("Successfully joined the match!")
    }
  }

  const createMatch = () => {
    // Validate all fields
    if (
      !newMatch.title ||
      !newMatch.date ||
      !newMatch.time ||
      !newMatch.location ||
      !newMatch.description ||
      !newMatch.image
    ) {
      showToast("Please fill in all fields including image upload")
      return
    }

    const match: Match = {
      id: Date.now().toString(),
      ...newMatch,
      currentPlayers: 1,
      organizer: currentUser.name,
      participants: [currentUser.name],
      createdBy: "current-user",
    }
    setMatches((prev) => [match, ...prev])
    setShowCreateModal(false)
    setNewMatch({
      title: "",
      sport: "Football",
      date: "",
      time: "",
      location: "",
      maxPlayers: 10,
      description: "",
      image: "",
    })
    showToast("Match created successfully!")
  }

  const showToast = (message: string) => {
    setToast({ message, show: true })
    setTimeout(() => setToast({ message: "", show: false }), 3000)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Simulate image upload in real app, you'd upload to a service 
      const imageUrl = `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&random=${Date.now()}`
      setNewMatch((prev) => ({ ...prev, image: imageUrl }))
    }
  }

  const featuredMatches = matches.slice(0, 3)
  const myCreatedGames = matches.filter((match) => match.createdBy === "current-user")
  const myJoinedGames = matches.filter(
    (match) => match.participants.includes(currentUser.name) && match.createdBy !== "current-user",
  )

  const themeClasses = isDarkMode
    ? "bg-gradient-to-br from-slate-900 via-teal-900/20 to-slate-800 text-slate-100"
    : "bg-gradient-to-br from-teal-50 via-cyan-50 to-rose-50 text-slate-900"

  return (
    <>
      {/* Font and Global Styles */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&display=swap");
        
        body {
          font-family: "Comfortaa", sans-serif;
          font-optical-sizing: auto;
          font-style: normal;
        }
        
        .comfortaa-font {
          font-family: "Comfortaa", sans-serif;
          font-optical-sizing: auto;
          font-style: normal;
        }

        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>

      <div className={`min-h-screen transition-all duration-300 ${themeClasses} comfortaa-font`}>
        {/* Toast Notification - Bottom Right */}
        {toast.show && (
          <div className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-lg shadow-xl shadow-teal-500/25 transform transition-all duration-300 animate-in slide-in-from-right backdrop-blur-sm border border-teal-400/20">
            {toast.message}
          </div>
        )}

        {/* Header */}
        <header
          className={`sticky top-0 z-40 ${isDarkMode ? "bg-slate-900/80 backdrop-blur-xl border-teal-500/20" : "bg-white/80 backdrop-blur-xl border-teal-200/50"} border-b shadow-lg shadow-teal-500/10`}
        >
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left side - Logo */}
              <div className="flex items-center flex-shrink-0">
                <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">SportConnect</div>
              </div>

              {/* Center - Search Bar (Hidden on mobile) */}
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search matches, sports, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full px-4 py-2 pl-10 rounded-full ${isDarkMode ? "bg-slate-800/50 text-slate-100 border-teal-500/30" : "bg-white/70 text-slate-900 border-teal-300/50"} border backdrop-blur-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm`}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500">
                    <Search size={16} />
                  </div>
                </div>
              </div>

              {/* Right side - Controls */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Dark/Light Mode Toggle */}
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-2 rounded-full ${isDarkMode ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/25" : "bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 hover:from-teal-200 hover:to-cyan-200"} transition-all duration-300 cursor-pointer`}
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:from-teal-700 hover:via-cyan-700 hover:to-blue-700 text-white px-3 py-2 sm:px-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105 text-sm sm:text-base cursor-pointer flex items-center gap-2 shadow-xl shadow-teal-500/25"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Create Match</span>
                  <span className="sm:hidden">Create</span>
                </button>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="w-8 h-8 rounded-full overflow-hidden border-2 border-teal-500 hover:border-cyan-500 transition-all duration-300 cursor-pointer shadow-lg shadow-teal-500/25"
                  >
                    <img
                      src={currentUser.avatar || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {showUserDropdown && (
                    <div
                      className={`absolute right-0 mt-2 w-48 ${isDarkMode ? "bg-slate-800/90 backdrop-blur-xl border-teal-500/30" : "bg-white/90 backdrop-blur-xl border-teal-200/50"} rounded-lg shadow-xl border py-2 z-50`}
                    >
                      <button
                        onClick={() => {
                          setShowMyGames(true)
                          setShowUserDropdown(false)
                        }}
                        className={`w-full text-left px-4 py-2 ${isDarkMode ? "hover:bg-teal-500/20" : "hover:bg-teal-50"} transition-colors font-medium cursor-pointer`}
                      >
                        My Games
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="md:hidden pb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search matches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-4 py-2 pl-10 rounded-full ${isDarkMode ? "bg-slate-800/50 text-slate-100 border-teal-500/30" : "bg-white/70 text-slate-900 border-teal-300/50"} border backdrop-blur-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm`}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500">
                  <Search size={16} />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* My Games Page */}
        {showMyGames && (
          <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-md">
            {/* Blurred background overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xl"></div>
            
            {/* Modal content */}
            <div className={`relative min-h-screen transition-all duration-300 ${isDarkMode ? "bg-slate-900/95 text-slate-100" : "bg-white/95 text-slate-900"} p-4 backdrop-blur-xl`}>
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold">My Games Dashboard</h1>
                  <button
                    onClick={() => setShowMyGames(false)}
                    className="text-2xl hover:text-teal-600 transition-colors p-2 cursor-pointer"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div
                    className={`${isDarkMode ? "bg-slate-800/50 backdrop-blur-xl border-teal-500/20" : "bg-white/80 backdrop-blur-xl border-teal-200/30"} rounded-xl p-6 shadow-xl border`}
                  >
                    <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">{myCreatedGames.length}</div>
                    <div className="text-sm opacity-70">Games Created</div>
                  </div>
                  <div
                    className={`${isDarkMode ? "bg-slate-800/50 backdrop-blur-xl border-teal-500/20" : "bg-white/80 backdrop-blur-xl border-teal-200/30"} rounded-xl p-6 shadow-xl border`}
                  >
                    <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                      {myJoinedGames.length}
                    </div>
                    <div className="text-sm opacity-70">Games Joined</div>
                  </div>
                  <div
                    className={`${isDarkMode ? "bg-slate-800/50 backdrop-blur-xl border-teal-500/20" : "bg-white/80 backdrop-blur-xl border-teal-200/30"} rounded-xl p-6 shadow-xl border`}
                  >
                    <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                      {myCreatedGames.length + myJoinedGames.length}
                    </div>
                    <div className="text-sm opacity-70">Total Games</div>
                  </div>
                  <div
                    className={`${isDarkMode ? "bg-slate-800/50 backdrop-blur-xl border-teal-500/20" : "bg-white/80 backdrop-blur-xl border-teal-200/30"} rounded-xl p-6 shadow-xl border`}
                  >
                    <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                      {myCreatedGames.reduce((acc, match) => acc + match.currentPlayers, 0)}
                    </div>
                    <div className="text-sm opacity-70">Total Players</div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Created Games */}
                  <div>
                    <h2 className="text-xl font-semibold mb-6 flex items-center">
                      <span className="w-3 h-3 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full mr-3"></span>
                      Created by Me ({myCreatedGames.length})
                    </h2>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {myCreatedGames.map((match) => (
                        <div
                          key={match.id}
                          className={`${isDarkMode ? "bg-slate-800/50 backdrop-blur-xl border-teal-500/20" : "bg-white/80 backdrop-blur-xl border-teal-200/30"} rounded-xl p-6 shadow-xl border hover:shadow-2xl transition-all duration-300 h-56 flex flex-col`}
                        >
                          <div className="flex items-start justify-between mb-4 flex-1">
                            <div className="flex-1 flex flex-col justify-between h-full">
                              <div>
                                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{match.title}</h3>
                                <div className="flex flex-wrap gap-2 text-sm opacity-70 mb-3">
                                  <span className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-2 py-1 rounded-full">{match.sport}</span>
                                  <span>{match.date}</span>
                                  <span>{match.time}</span>
                                </div>
                                <p className="text-sm opacity-80 mb-3 line-clamp-1">{match.location}</p>
                              </div>
                              
                              <div className="mt-auto">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="text-sm">
                                    <span className="font-medium">
                                      {match.currentPlayers}/{match.maxPlayers}
                                    </span>{" "}
                                    players
                                  </div>
                                </div>
                                <div
                                  className={`w-full ${isDarkMode ? "bg-slate-700/50" : "bg-slate-200/50"} rounded-full h-2 backdrop-blur-sm`}
                                >
                                  <div
                                    className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-300 shadow-sm"
                                    style={{ width: `${(match.currentPlayers / match.maxPlayers) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                            <img
                              src={match.image || "/placeholder.svg"}
                              alt={match.title}
                              className="w-16 h-16 rounded-lg object-cover ml-4 flex-shrink-0"
                            />
                          </div>
                        </div>
                      ))}
                      {myCreatedGames.length === 0 && (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4 flex justify-center">
                            <Trophy size={64} className="text-teal-500" />
                          </div>
                          <p className="text-lg opacity-70 mb-4">No games created yet</p>
                          <button
                            onClick={() => {
                              setShowMyGames(false)
                              setShowCreateModal(true)
                            }}
                            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-xl shadow-teal-500/25"
                          >
                            Create Your First Game
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Joined Games */}
                  <div>
                    <h2 className="text-xl font-semibold mb-6 flex items-center">
                      <span className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></span>
                      Joined Games ({myJoinedGames.length})
                    </h2>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {myJoinedGames.map((match) => (
                        <div
                          key={match.id}
                          className={`${isDarkMode ? "bg-slate-800/50 backdrop-blur-xl border-teal-500/20" : "bg-white/80 backdrop-blur-xl border-teal-200/30"} rounded-xl p-6 shadow-xl border hover:shadow-2xl transition-all duration-300 h-56 flex flex-col`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2 line-clamp-1">{match.title}</h3>
                              <div className="flex flex-wrap gap-2 text-sm opacity-70 mb-2">
                                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2 py-1 rounded-full">{match.sport}</span>
                                <span>{match.date}</span>
                                <span>{match.time}</span>
                              </div>
                              <p className="text-sm opacity-80 mb-2 line-clamp-1">{match.location}</p>
                              <p className="text-sm mb-3 line-clamp-1">
                                <span className="font-medium">By:</span> {match.organizer}
                              </p>
                            </div>
                            <img
                              src={match.image || "/placeholder.svg"}
                              alt={match.title}
                              className="w-16 h-16 rounded-lg object-cover ml-4 flex-shrink-0"
                            />
                          </div>
                          
                          {/* Leave Game Button - Full Width */}
                          <div className="mt-auto">
                            <button
                              onClick={() => toggleMatchParticipation(match.id)}
                              className="bg-gradient-to-r from-rose-500 to-pink-500 cursor-pointer hover:from-rose-600 hover:to-pink-600 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-rose-500/25 text-sm w-full"
                            >
                              Leave Game
                            </button>
                          </div>
                        </div>
                      ))}
                      {myJoinedGames.length === 0 && (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4 flex justify-center">
                            <Target size={64} className="text-teal-500" />
                          </div>
                          <p className="text-lg opacity-70 mb-4">No games joined yet</p>
                          <button
                            onClick={() => setShowMyGames(false)}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-xl shadow-emerald-500/25"
                          >
                            Browse Available Games
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Carousel - Hidden during search */}
        {!searchQuery && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl">
              <div
                className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredMatches.map((match) => (
                  <div key={match.id} className="w-full flex-shrink-0 relative">
                    <img
                      src={match.image || "/placeholder.svg"}
                      alt={match.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent rounded-2xl sm:rounded-3xl">
                      <div className="h-full flex items-center px-4 sm:px-8">
                        <div className="max-w-lg">
                          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4 text-white">
                            {match.title}
                          </h2>
                          <p className="text-sm sm:text-base lg:text-lg text-gray-200 mb-3 sm:mb-6 line-clamp-2">
                            {match.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-300">
                            <span>{match.date}</span>
                            <span>•</span>
                            <span className="truncate">{match.location}</span>
                            <span>•</span>
                            <span>
                              {match.currentPlayers}/{match.maxPlayers} players
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {featuredMatches.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${currentSlide === index ? "bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/50" : "bg-white/30 hover:bg-white/50"} cursor-pointer`}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Filters */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div
            className={`${isDarkMode ? "bg-slate-800/40 backdrop-blur-xl border-teal-500/20" : "bg-white/60 backdrop-blur-xl border-teal-200/40"} rounded-xl sm:rounded-2xl p-4 sm:p-6 border shadow-xl shadow-teal-500/10`}
          >
            <h3 className="text-base sm:text-lg font-semibold mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Filter by Sport</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {sports.map((sport) => (
                <button
                  key={sport}
                  onClick={() => setSelectedSport(sport)}
                  className={`px-3 py-2 sm:px-4 rounded-full font-medium transition-all duration-300 text-sm sm:text-base cursor-pointer ${
                    selectedSport === sport
                      ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/25 transform scale-105"
                      : `${isDarkMode ? "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-teal-500/20" : "bg-white/70 text-slate-700 hover:bg-white/90 border border-teal-200/50"} shadow-md hover:shadow-lg backdrop-blur-sm`
                  }`}
                >
                  {sport}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Matches Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredMatches.map((match) => (
              <div
                key={match.id}
                className={`${isDarkMode ? "bg-slate-800/60 backdrop-blur-xl border-teal-500/20" : "bg-white/80 backdrop-blur-xl border-teal-200/30"} rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border hover:shadow-2xl hover:shadow-teal-500/20 transition-all duration-300 transform hover:scale-105 flex flex-col h-full`}
              >
                <div className="relative h-40 sm:h-48 flex-shrink-0">
                  <img
                    src={match.image || "/placeholder.svg"}
                    alt={match.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                    <span className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium shadow-lg backdrop-blur-sm">
                      {match.sport}
                    </span>
                  </div>
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                    <span className="bg-black/40 backdrop-blur-md text-white px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm border border-white/20">
                      {match.currentPlayers}/{match.maxPlayers}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2">{match.title}</h3>
                    <p className={`${isDarkMode ? "text-slate-300" : "text-slate-600"} text-sm mb-4 line-clamp-3`}>
                      {match.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className={`flex items-center text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                        <Calendar size={16} className="mr-2 flex-shrink-0 text-teal-500" />
                        <span className="truncate">{match.date} at {match.time}</span>
                      </div>
                      <div className={`flex items-center text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                        <MapPin size={16} className="mr-2 flex-shrink-0 text-teal-500" />
                        <span className="truncate">{match.location}</span>
                      </div>
                      <div className={`flex items-center text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                        <User size={16} className="mr-2 flex-shrink-0 text-teal-500" />
                        <span className="truncate">Organized by {match.organizer}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar - positioned above button */}
                  <div className="mb-4 mt-auto">
                    <div
                      className={`flex justify-between text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"} mb-1`}
                    >
                      <span className="flex items-center gap-1">
                        <Users size={14} className="text-teal-500" />
                        Players joined
                      </span>
                      <span>
                        {match.currentPlayers}/{match.maxPlayers}
                      </span>
                    </div>
                    <div className={`w-full ${isDarkMode ? "bg-slate-700/50" : "bg-slate-200/50"} rounded-full h-2 backdrop-blur-sm`}>
                      <div
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-300 shadow-sm"
                        style={{ width: `${(match.currentPlayers / match.maxPlayers) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Button - always at bottom */}
                  <button
                    onClick={() => toggleMatchParticipation(match.id)}
                    disabled={
                      (match.currentPlayers >= match.maxPlayers && !match.participants.includes(currentUser.name)) ||
                      (match.participants.includes(currentUser.name) && match.organizer === currentUser.name)
                    }
                    className={`w-full py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base cursor-pointer ${
                      match.currentPlayers >= match.maxPlayers && !match.participants.includes(currentUser.name)
                        ? `${isDarkMode ? "bg-slate-600/50 text-slate-400" : "bg-slate-300/50 text-slate-500"} cursor-not-allowed backdrop-blur-sm`
                        : match.participants.includes(currentUser.name) && match.organizer === currentUser.name
                          ? `${isDarkMode ? "bg-slate-600/50 text-slate-400" : "bg-slate-300/50 text-slate-500"} cursor-not-allowed backdrop-blur-sm`
                          : match.participants.includes(currentUser.name)
                            ? "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white transform hover:scale-105 shadow-lg shadow-rose-500/25"
                            : "bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white transform hover:scale-105 shadow-lg shadow-teal-500/25"
                    }`}
                  >
                    {match.currentPlayers >= match.maxPlayers && !match.participants.includes(currentUser.name)
                      ? "Match Full"
                      : match.participants.includes(currentUser.name) && match.organizer === currentUser.name
                        ? "Organizer"
                        : match.participants.includes(currentUser.name)
                          ? "Leave Match"
                          : "Join Match"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredMatches.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 flex justify-center">
                <Search size={64} className="text-slate-400" />
              </div>
              <p className="text-xl opacity-70 mb-4">No matches found</p>
              <p className="opacity-60">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer
          className={`${isDarkMode ? "bg-slate-800/80 backdrop-blur-xl border-teal-500/20" : "bg-white/80 backdrop-blur-xl border-teal-200/30"} border-t py-8 sm:py-12`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">SportConnect</h3>
                <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Connect with sports enthusiasts and join exciting matches in your area.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => showToast("About page coming soon!")}
                    className={`block text-sm ${isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-800"} transition-colors cursor-pointer`}
                  >
                    About
                  </button>
                  <button
                    onClick={() => showToast("How it works page coming soon!")}
                    className={`block text-sm ${isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-800"} transition-colors cursor-pointer`}
                  >
                    How it Works
                  </button>
                  <button
                    onClick={() => showToast("Safety guidelines coming soon!")}
                    className={`block text-sm ${isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-800"} transition-colors cursor-pointer`}
                  >
                    Safety
                  </button>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => showToast("Help center coming soon!")}
                    className={`block text-sm ${isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-800"} transition-colors cursor-pointer`}
                  >
                    Help Center
                  </button>
                  <button
                    onClick={() => showToast("Contact support coming soon!")}
                    className={`block text-sm ${isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-800"} transition-colors cursor-pointer`}
                  >
                    Contact Us
                  </button>
                  <button
                    onClick={() => showToast("Report feature coming soon!")}
                    className={`block text-sm ${isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-800"} transition-colors cursor-pointer`}
                  >
                    Report Issue
                  </button>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => showToast("Privacy policy coming soon!")}
                    className={`block text-sm ${isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-800"} transition-colors cursor-pointer`}
                  >
                    Privacy Policy
                  </button>
                  <button
                    onClick={() => showToast("Terms of service coming soon!")}
                    className={`block text-sm ${isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-800"} transition-colors cursor-pointer`}
                  >
                    Terms of Service
                  </button>
                  <button
                    onClick={() => showToast("Cookie policy coming soon!")}
                    className={`block text-sm ${isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-800"} transition-colors cursor-pointer`}
                  >
                    Cookie Policy
                  </button>
                </div>
              </div>
            </div>
            <div
              className={`mt-6 sm:mt-8 pt-6 sm:pt-8 border-t ${isDarkMode ? "border-slate-700" : "border-slate-200"} text-center`}
            >
              <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                © 2024 SportConnect. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        {/* Create Match Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-gradient-to-br from-black/40 to-slate-900/60">
            <div
              className={`${isDarkMode ? "bg-slate-800/80 backdrop-blur-xl border-teal-500/20" : "bg-white/90 backdrop-blur-xl border-teal-200/30"} rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-md border shadow-2xl max-h-[90vh] overflow-y-auto`}
            >
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Create New Match</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Match Title *</label>
                  <input
                    type="text"
                    value={newMatch.title}
                    onChange={(e) => setNewMatch((prev) => ({ ...prev, title: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg ${isDarkMode ? "bg-slate-700/50 border-teal-500/30 text-slate-100" : "bg-white/70 border-teal-300/50 text-slate-900"} border backdrop-blur-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all`}
                    placeholder="Enter match title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sport *</label>
                  <select
                    value={newMatch.sport}
                    onChange={(e) => setNewMatch((prev) => ({ ...prev, sport: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg ${isDarkMode ? "bg-slate-700/50 border-teal-500/30 text-slate-100" : "bg-white/70 border-teal-300/50 text-slate-900"} border backdrop-blur-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all`}
                  >
                    {sports.slice(1).map((sport) => (
                      <option key={sport} value={sport} className={isDarkMode ? "bg-slate-800" : "bg-white"}>
                        {sport}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date *</label>
                    <input
                      type="date"
                      value={newMatch.date}
                      onChange={(e) => setNewMatch((prev) => ({ ...prev, date: e.target.value }))}
                      className={`w-full px-4 py-2 rounded-lg ${isDarkMode ? "bg-slate-700/50 border-teal-500/30 text-slate-100" : "bg-white/70 border-teal-300/50 text-slate-900"} border backdrop-blur-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Time *</label>
                    <input
                      type="time"
                      value={newMatch.time}
                      onChange={(e) => setNewMatch((prev) => ({ ...prev, time: e.target.value }))}
                      className={`w-full px-4 py-2 rounded-lg ${isDarkMode ? "bg-slate-700/50 border-teal-500/30 text-slate-100" : "bg-white/70 border-teal-300/50 text-slate-900"} border backdrop-blur-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location *</label>
                  <input
                    type="text"
                    value={newMatch.location}
                    onChange={(e) => setNewMatch((prev) => ({ ...prev, location: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg ${isDarkMode ? "bg-slate-700/50 border-teal-500/30 text-slate-100" : "bg-white/70 border-teal-300/50 text-slate-900"} border backdrop-blur-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all`}
                    placeholder="Enter location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Max Players *</label>
                  <input
                    type="number"
                    value={newMatch.maxPlayers}
                    onChange={(e) => setNewMatch((prev) => ({ ...prev, maxPlayers: Number.parseInt(e.target.value) }))}
                    className={`w-full px-4 py-2 rounded-lg ${isDarkMode ? "bg-slate-700/50 border-teal-500/30 text-slate-100" : "bg-white/70 border-teal-300/50 text-slate-900"} border backdrop-blur-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all`}
                    min="2"
                    max="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Upload size={16} className="text-teal-500" />
                    Upload Image *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={`w-full px-4 py-2 rounded-lg ${isDarkMode ? "bg-slate-700/50 border-teal-500/30 text-slate-100" : "bg-white/70 border-teal-300/50 text-slate-900"} border backdrop-blur-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all`}
                  />
                  {newMatch.image && (
                    <div className="mt-2">
                      <img
                        src={newMatch.image || "/placeholder.svg"}
                        alt="Preview"
                        className="w-20 h-12 rounded-lg object-cover border-2 border-teal-500 shadow-lg"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    value={newMatch.description}
                    onChange={(e) => setNewMatch((prev) => ({ ...prev, description: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg ${isDarkMode ? "bg-slate-700/50 border-teal-500/30 text-slate-100" : "bg-white/70 border-teal-300/50 text-slate-900"} border backdrop-blur-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all h-20 resize-none`}
                    placeholder="Describe your match..."
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className={`flex-1 py-2 sm:py-3 rounded-lg ${isDarkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-200 hover:bg-slate-300"} font-medium transition-colors text-sm sm:text-base cursor-pointer`}
                >
                  Cancel
                </button>
                <button
                  onClick={createMatch}
                  className="flex-1 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-medium transition-all duration-300 transform hover:scale-105 text-sm sm:text-base cursor-pointer shadow-lg shadow-teal-500/25"
                >
                  Create Match
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}