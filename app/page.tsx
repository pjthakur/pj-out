"use client"
import type React from "react"
import { useState, useEffect } from "react"
import {
Star, Clock, Calendar, Play, X, Search, TrendingUp, Film, Award, ChevronRight, Heart, Share2, ChevronDown, ChevronLeft, 
} from "lucide-react"
import { toast, Toaster } from "sonner"

// Types
interface Review {
  id: number
  title: string
  content: string
  rating: number
  userId: number
  userName: string
  userAvatar: string
  likes: number
  createdAt: string
  criticScore: number
  imageUrl: string
  genres: string[]
  duration: string
  releaseDate: string
  userLiked?: boolean
  type: "movie" | "series"
  isTopRated?: boolean
}

interface Show {
  id: number
  title: string
  posterUrl: string
  genre: string
  rating: number
  reviews: number
}

interface CarouselItem {
  id: number
  title: string
  description: string
  imageUrl: string
  posterUrl: string
}

// Data 
const mockReviews: Review[] = [
  {
    id: 1,
    title: "A Masterpiece of Modern Cinema",
    content:
      "An exceptional film that redefines the boundaries of storytelling and visual artistry. The performances are outstanding and the cinematography is breathtaking. A must-see experience that will leave you pondering long after the credits roll.",
    rating: 9.5,
    userId: 101,
    userName: "Emily Johnson",
    userAvatar: "https://randomuser.me/api/portraits/women/11.jpg",
    likes: 42,
    createdAt: "2025-01-15",
    criticScore: 92,
    imageUrl: "https://images.unsplash.com/photo-1726137569906-14f8079861fa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8",
    genres: ["Drama", "Mystery", "Sci-Fi"],
    duration: "2h 37m",
    releaseDate: "2025",
    type: "movie",
    isTopRated: true,
  },
  {
    id: 2,
    title: "Underwhelming Experience",
    content:
      "Despite the impressive cast and promising premise, this film failed to deliver on multiple fronts. The pacing was inconsistent and the plot twists felt forced. While some performances were good, the overall execution fell short of expectations.",
    rating: 6.0,
    userId: 102,
    userName: "Marcus Chen",
    userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    likes: 15,
    createdAt: "2025-01-12",
    criticScore: 68,
    imageUrl: "https://images.unsplash.com/photo-1743484977289-22999cb8c001?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8",
    genres: ["Action", "Thriller"],
    duration: "1h 55m",
    releaseDate: "2025",
    type: "movie",
  },
  {
    id: 3,
    title: "Brilliant Series Finale",
    content:
      "After five seasons of incredible storytelling, this series delivers a satisfying conclusion that ties up all loose ends. The character development throughout the series has been phenomenal, and this final season is no exception.",
    rating: 9.2,
    userId: 103,
    userName: "Sarah Williams",
    userAvatar: "https://randomuser.me/api/portraits/women/25.jpg",
    likes: 67,
    createdAt: "2025-01-20",
    criticScore: 89,
    imageUrl: "https://images.unsplash.com/photo-1743423054685-4b109da0403a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8",
    genres: ["Drama", "Crime", "Thriller"],
    duration: "8 episodes",
    releaseDate: "2025",
    type: "series",
    isTopRated: true,
  },
  {
    id: 4,
    title: "Visually Stunning but Hollow",
    content:
      "This movie is a feast for the eyes with incredible special effects and cinematography. However, the story lacks depth and the characters feel one-dimensional. It's entertainment value is high, but don't expect profound storytelling.",
    rating: 7.3,
    userId: 104,
    userName: "David Rodriguez",
    userAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
    likes: 28,
    createdAt: "2025-01-18",
    criticScore: 74,
    imageUrl: "https://images.unsplash.com/photo-1743917836519-44f2b58deed3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D",
    genres: ["Action", "Adventure", "Sci-Fi"],
    duration: "2h 15m",
    releaseDate: "2025",
    type: "movie",
  },
  {
    id: 5,
    title: "Addictive Binge-Watch",
    content:
      "This series hooks you from the first episode and doesn't let go. The writing is sharp, the acting is superb, and each episode ends with a cliffhanger that makes it impossible to stop watching. Highly recommended for thriller fans.",
    rating: 8.7,
    userId: 105,
    userName: "Lisa Thompson",
    userAvatar: "https://randomuser.me/api/portraits/women/33.jpg",
    likes: 54,
    createdAt: "2025-01-22",
    criticScore: 85,
    imageUrl: "https://plus.unsplash.com/premium_photo-1744395627449-fc1cc8c1fa7e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D",
    genres: ["Thriller", "Mystery", "Drama"],
    duration: "10 episodes",
    releaseDate: "2025",
    type: "series",
  },
  {
    id: 6,
    title: "Emotional Rollercoaster",
    content:
      "Rarely does a film manage to balance humor and heartbreak so perfectly. This movie will make you laugh, cry, and everything in between. The performances are raw and authentic, making every emotion feel genuine.",
    rating: 9.1,
    userId: 106,
    userName: "Michael Brown",
    userAvatar: "https://randomuser.me/api/portraits/men/28.jpg",
    likes: 73,
    createdAt: "2025-01-25",
    criticScore: 91,
    imageUrl: "https://images.unsplash.com/photo-1745236781096-be405b87d05c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D",
    genres: ["Drama", "Comedy", "Romance"],
    duration: "2h 8m",
    releaseDate: "2025",
    type: "movie",
    isTopRated: true,
  },
  {
    id: 7,
    title: "Disappointing Follow-up",
    content:
      "After the success of the first season, expectations were high. Unfortunately, this second season feels rushed and lacks the charm that made the original so special. Some good moments, but overall a letdown.",
    rating: 5.8,
    userId: 107,
    userName: "Jennifer Davis",
    userAvatar: "https://randomuser.me/api/portraits/women/42.jpg",
    likes: 12,
    createdAt: "2025-01-10",
    criticScore: 62,
    imageUrl: "https://images.unsplash.com/photo-1726607424623-6d9fee974241?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzMXx8fGVufDB8fHx8fA%3D%3D",
    genres: ["Comedy", "Drama"],
    duration: "8 episodes",
    releaseDate: "2025",
    type: "series",
  },
  {
    id: 8,
    title: "Genre-Defining Masterpiece",
    content:
      "This film sets a new standard for its genre. Every aspect from direction to sound design is meticulously crafted. It's not just entertainment; it's art. This will be studied in film schools for years to come.",
    rating: 9.8,
    userId: 108,
    userName: "Robert Wilson",
    userAvatar: "https://randomuser.me/api/portraits/men/55.jpg",
    likes: 89,
    createdAt: "2025-01-23",
    criticScore: 96,
    imageUrl: "https://images.unsplash.com/photo-1745770998338-eb50b0c89b16?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzOHx8fGVufDB8fHx8fA%3D%3D",
    genres: ["Drama", "Thriller", "Mystery"],
    duration: "2h 42m",
    releaseDate: "2025",
    type: "movie",
    isTopRated: true,
  },
]

const mockShows: Show[] = [
  {
    id: 201,
    title: "Quantum Shadows",
    posterUrl:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=750&q=80",
    genre: "Sci-Fi",
    rating: 9.3,
    reviews: 124,
  },
  {
    id: 202,
    title: "Moonlight Serenade",
    posterUrl:
      "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=750&q=80",
    genre: "Romance",
    rating: 9.0,
    reviews: 89,
  },
  {
    id: 203,
    title: "Cyber Nexus",
    posterUrl:
      "https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=750&q=80",
    genre: "Action",
    rating: 8.7,
    reviews: 156,
  },
  {
    id: 204,
    title: "The Lost Kingdom",
    posterUrl:
      "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=750&q=80",
    genre: "Advent",
    rating: 9.1,
    reviews: 112,
  },
]

const carouselItems: CarouselItem[] = [
  {
    id: 1,
    title: "Quantum Shadows",
    description: "A mind-bending sci-fi thriller that explores the boundaries of reality and consciousness.",
    imageUrl: "https://images.unsplash.com/photo-1745905932716-431e50eac74b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NHx8fGVufDB8fHx8fA%3D%3D",
    posterUrl:
      "https://images.unsplash.com/photo-1745905932716-431e50eac74b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "Moonlight Serenade",
    description: "A romantic drama that captures the essence of love in the digital age.",
    imageUrl: "https://images.unsplash.com/photo-1735825764485-93a381fd5779?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1MXx8fGVufDB8fHx8fA%3D%3D",
    posterUrl:
      "https://images.unsplash.com/photo-1735825764485-93a381fd5779?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1MXx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    title: "Cyber Nexus",
    description: "An action-packed adventure through virtual worlds and digital landscapes.",
    imageUrl: "https://images.unsplash.com/photo-1745750747233-c09276a878b3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1N3x8fGVufDB8fHx8fA%3D%3D",
    posterUrl:
      "https://images.unsplash.com/photo-1745750747233-c09276a878b3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1N3x8fGVufDB8fHx8fA%3D%3D",
  },
]

// Helper Functions
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }
}

// Components
const RatingBar = ({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) => {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-1.5 text-xs"
      case "lg":
        return "h-3 text-base"
      default:
        return "h-2 text-sm"
    }
  }

  const getColorClasses = () => {
    if (score >= 7.5) return "from-emerald-400 to-teal-500"
    if (score >= 5) return "from-amber-400 to-yellow-500"
    return "from-red-400 to-rose-500"
  }

  return (
    <div
      className="w-full bg-gray-700 rounded-full overflow-hidden border border-gray-600"
      role="progressbar"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={10}
    >
      <div
        className={`bg-gradient-to-r ${getColorClasses()} font-medium text-white text-center leading-none rounded-full flex items-center justify-center ${getSizeClasses()}`}
        style={{ width: `${score * 10}%` }}
      >
        {size === "lg" && <span className="px-1">{score.toFixed(1)}</span>}
      </div>
    </div>
  )
}

const GenreTag = ({ genre }: { genre: string }) => (
  <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-800 text-white transition-colors duration-200 hover:bg-gray-700">
    {genre}
  </span>
)

const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select option",
  className = "",
}: {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-600 text-white text-left flex items-center justify-between cursor-pointer hover:bg-gray-700 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value || placeholder}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-600 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className="w-full px-4 py-3 text-left hover:bg-gray-700 cursor-pointer transition-all duration-300 first:rounded-t-2xl last:rounded-b-2xl text-white"
              onClick={() => {
                onChange(option)
                setIsOpen(false)
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const Carousel = ({ items }: { items: CarouselItem[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length)
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative rounded-xl md:rounded-2xl overflow-hidden">
      <div className="relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] w-full">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${item.posterUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/90 via-black/60 sm:via-black/50 to-transparent z-10" />

            <div className="absolute inset-0 z-20 flex flex-col justify-center p-3 sm:p-4 md:p-8 lg:p-16 text-white">
              <div className="max-w-2xl">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold mb-2 md:mb-4 leading-tight">{item.title}</h1>
                <p className="text-xs sm:text-sm md:text-lg lg:text-xl text-gray-200 mb-3 sm:mb-4 md:mb-6 max-w-xl line-clamp-2 sm:line-clamp-3 md:line-clamp-none">
                  {item.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                  <button
                    className="bg-gray-800 hover:bg-gray-700 text-white px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center cursor-pointer text-sm md:text-base"
                    onClick={() => toast.info(`Viewing details for ${item.title}`)}
                  >
                    <Play className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
                    View Details
                  </button>
                  <button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium transition-colors duration-200 cursor-pointer text-sm md:text-base"
                    onClick={() => scrollToSection("reviews")}
                  >
                    Read Reviews
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-1 sm:left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-30 bg-gray-800 hover:bg-gray-700 text-white p-1.5 sm:p-2 md:p-3 rounded-xl transition-colors duration-200 cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-1 sm:right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-30 bg-gray-800 hover:bg-gray-700 text-white p-1.5 sm:p-2 md:p-3 rounded-xl transition-colors duration-200 cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6" />
      </button>

      <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-1 sm:space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 rounded-full transition-colors duration-200 cursor-pointer ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

const ReviewCard = ({
  review,
  onOpen,
  onLike,
  variant = "standard",
}: {
  review: Review
  onOpen: (id: number) => void
  onLike: (id: number) => void
  variant?: "standard" | "featured"
}) => {
  if (variant === "featured") {
    return (
      <article className="group relative overflow-hidden rounded-2xl cursor-pointer transition-colors duration-200 hover:bg-gray-800/50 bg-gray-900 border border-gray-700">
        <div className="flex flex-col lg:flex-row h-full min-h-[400px] lg:h-[300px]" onClick={() => onOpen(review.id)}>
          {/* Image Section */}
          <div 
            className="relative w-full lg:w-2/5 h-48 lg:h-full overflow-hidden bg-cover bg-center bg-gray-800"
            style={{
              backgroundImage: `url(${review.imageUrl}), url('https://picsum.photos/600/400?random=${review.id}')`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-gray-900/90 via-gray-900/30 to-transparent"></div>
            
            {/* Rating Badge */}
            <div className="absolute top-3 left-3 lg:top-4 lg:left-4 flex items-center bg-gray-900 text-white px-3 py-2 rounded-xl z-10">
              <Star className="w-4 h-4 lg:w-5 lg:h-5 text-amber-400 fill-amber-400 mr-2" />
              <span className="font-bold text-sm lg:text-lg">{review.rating.toFixed(1)}</span>
            </div>

            {/* Genre Tags - Mobile Only */}
            <div className="absolute bottom-3 left-3 lg:hidden flex flex-wrap gap-1">
              {review.genres.slice(0, 2).map((genre, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-900 text-white"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 lg:p-8 flex flex-col">
            {/* Header */}
            <div className="flex-1">
              {/* Genre Tags - Desktop Only */}
              <div className="hidden lg:flex flex-wrap gap-2 mb-4">
                {review.genres.map((genre, index) => (
                  <GenreTag key={index} genre={genre} />
                ))}
              </div>

              <h2 className="text-2xl lg:text-3xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors duration-200 line-clamp-2">
                {review.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-300">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{review.duration}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{review.releaseDate}</span>
                </div>
                <div className="text-gray-400">{formatDate(review.createdAt)}</div>
              </div>

              <p className="text-gray-300 line-clamp-3 lg:line-clamp-2 leading-relaxed">
                {review.content}
              </p>
            </div>

            {/* Footer - Profile and Actions */}
            <div className="flex justify-between items-center gap-3 lg:gap-4 mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-gray-700">
              <div className="flex items-center gap-2 lg:gap-3">
                <img
                  src={review.userAvatar || "/placeholder.svg"}
                  alt={review.userName}
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.onerror = null
                    target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(review.userName)
                  }}
                />
                <div>
                  <span className="font-medium text-white text-sm lg:text-base">{review.userName}</span>
                  <div className="text-xs text-gray-400">Critic Score: {review.criticScore}/100</div>
                </div>
              </div>

              <div className="flex items-center gap-3 lg:gap-4">
                <button
                  className="flex items-center gap-1 lg:gap-2 text-gray-300 hover:text-rose-400 transition-colors duration-200 cursor-pointer text-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onLike(review.id)
                  }}
                >
                  <Heart className={`w-4 h-4 lg:w-5 lg:h-5 ${review.userLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                  <span>{review.likes}</span>
                </button>
                <button
                  className="flex items-center gap-1 lg:gap-2 text-gray-300 hover:text-emerald-400 transition-colors duration-200 cursor-pointer text-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    toast.success("Review shared!")
                  }}
                >
                  <Share2 className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden transition-colors duration-200 hover:bg-gray-800/50">
      <div className="flex flex-col md:flex-row min-h-[280px] md:min-h-[300px]">
        <div 
          className="w-full md:w-56 h-48 md:h-auto md:min-h-full relative bg-cover bg-center bg-gray-800"
          style={{
            backgroundImage: `url(${review.imageUrl}), url('https://picsum.photos/400/600?random=${review.id}')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-gray-900/80 via-gray-900/20 to-transparent"></div>
          <div className="absolute top-3 left-3 md:top-4 md:left-4 flex items-center gap-1 bg-gray-900 text-white px-3 py-2 rounded-xl z-10">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold">{review.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="p-4 md:p-6 flex-1 flex flex-col">
          {/* Header Content */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div className="flex-1">
                <h2
                  className="text-lg md:text-xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-200 cursor-pointer line-clamp-2"
                  onClick={() => onOpen(review.id)}
                >
                  {review.title}
                </h2>
                <div className="flex items-center mt-2 gap-2">
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 md:w-4 md:h-4 ${i < Math.round(review.rating / 2) ? "fill-current" : "text-gray-600"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end ml-3 md:ml-4">
                <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                <div className="mt-2 flex gap-1 flex-wrap">
                  {review.genres.slice(0, 2).map((genre, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-200"
                    >
                      {genre}
                    </span>
                  ))}
                  {review.genres.length > 2 && (
                    <span className="text-xs text-gray-400 self-center">+{review.genres.length - 2}</span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-gray-300 line-clamp-2 md:line-clamp-3 text-sm leading-relaxed">{review.content}</p>
          </div>

          {/* Footer - Profile and Actions */}
          <div className="flex justify-between items-center gap-3 md:gap-4 mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-700">
            <div className="flex items-center gap-2 md:gap-3">
              <img
                src={review.userAvatar || "/placeholder.svg"}
                alt={review.userName}
                className="w-7 h-7 md:w-8 md:h-8 rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.onerror = null
                  target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(review.userName)
                }}
              />
              <span className="text-sm font-medium text-gray-300">{review.userName}</span>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
              <button
                className={`flex items-center gap-1 text-sm transition-colors duration-200 cursor-pointer ${
                  review.userLiked ? "text-rose-400" : "text-gray-400 hover:text-rose-400"
                }`}
                onClick={() => onLike(review.id)}
                aria-label="Like Review"
              >
                <Heart className={`w-4 h-4 ${review.userLiked ? "fill-rose-500" : ""}`} />
                <span>{review.likes}</span>
              </button>

              <button
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200 cursor-pointer"
                onClick={() => toast.success("Review shared!")}
                aria-label="Share Review"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

const ShowCard = ({ show }: { show: Show }) => {
  const [imageError, setImageError] = useState(false)

  const backupImages = [
    "https://picsum.photos/400/600?random=1",
    "https://picsum.photos/400/600?random=2", 
    "https://picsum.photos/400/600?random=3",
    "https://picsum.photos/400/600?random=4",
  ]

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true)
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-xl md:rounded-2xl transition-colors duration-200 hover:bg-gray-800/30 cursor-pointer bg-gray-900 border border-gray-700">
      <div 
        className="relative aspect-[3/4] overflow-hidden bg-cover bg-center bg-gray-800"
        style={{
          backgroundImage: `url(${imageError ? backupImages[show.id % backupImages.length] : show.posterUrl}), url('https://picsum.photos/400/600?random=${show.id}')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-200"></div>

        {/* Rating Badge */}
        <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-gray-900 text-white text-xs md:text-sm font-bold px-2 py-1 md:px-3 md:py-2 rounded-lg md:rounded-xl z-10">
          <div className="flex items-center">
            <Star className="w-3 h-3 md:w-4 md:h-4 text-amber-400 fill-amber-400 mr-1" />
            <span>{show.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Hover Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 bg-black/40">
          <button
            className="flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 md:py-3 md:px-6 rounded-xl transition-colors duration-200 cursor-pointer mb-3 md:mb-4 text-sm md:text-base"
            onClick={() => toast.info(`Opening show details for ${show.title}`)}
            aria-label={`View ${show.title}`}
          >
            <Play className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span>View Details</span>
          </button>

          <button
            className="p-2 md:p-3 bg-gray-900 rounded-full hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              toast.success(`Shared ${show.title}!`)
            }}
            aria-label={`Share ${show.title}`}
          >
            <Share2 className="w-3 h-3 md:w-4 md:h-4 text-white" />
          </button>
        </div>

        {/* Bottom Content - Always Visible */}
        <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 z-10 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="font-bold text-white text-sm md:text-lg mb-1 md:mb-2 line-clamp-1 group-hover:text-emerald-300 transition-colors duration-200">
            {show.title}
          </h3>
          
          <div className="flex justify-between items-center">
            <span className="inline-flex items-center px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-medium bg-gray-900 text-white">
              {show.genre}
            </span>
            <span className="text-xs text-gray-300 bg-gray-900 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">
              {show.reviews} reviews
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

const FilterBar = ({
  filters,
  currentFilter,
  onFilterChange,
}: {
  filters: { id: string; label: string }[]
  currentFilter: string
  onFilterChange: (filter: string) => void
}) => {
  return (
    <div className="flex overflow-x-auto space-x-3 py-4 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`px-6 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-colors duration-200 cursor-pointer ${
            currentFilter === filter.id
              ? "bg-emerald-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => onFilterChange(filter.id)}
          aria-label={`Filter by ${filter.label}`}
        >
          {filter.id === "all" && <Film className="w-4 h-4 mr-2 inline-block" />}
          {filter.id === "movies" && <Film className="w-4 h-4 mr-2 inline-block" />}
          {filter.id === "series" && <Play className="w-4 h-4 mr-2 inline-block" />}
          {filter.id === "top-rated" && <Award className="w-4 h-4 mr-2 inline-block" />}
          {filter.id === "recent" && <TrendingUp className="w-4 h-4 mr-2 inline-block" />}
          {filter.label}
        </button>
      ))}
    </div>
  )
}

const Trailer = ({ url, title }: { url: string; title: string }) => {
  const [error, setError] = useState(false)

  return error ? (
    <div className="w-full h-full flex items-center justify-center bg-gray-900">
      <div className="text-center p-4">
        <Film className="w-12 h-12 mx-auto mb-2 text-gray-500" />
        <p className="text-white text-sm">Image unavailable</p>
        <button
          className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm cursor-pointer"
          onClick={() => setError(false)}
        >
          Retry
        </button>
      </div>
    </div>
  ) : (
    <img 
      className="w-full h-full object-cover" 
      src={url} 
      alt={title}
      onError={() => setError(true)}
    />
  )
}

const ReviewForm = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (
    review: Omit<Review, "id" | "userId" | "userAvatar" | "userName" | "likes" | "createdAt" | "userLiked">,
  ) => void
}) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [criticScore, setCriticScore] = useState(75)
  const [imageUrl, setImageUrl] = useState("")
  const [genres, setGenres] = useState<string[]>([])
  const [duration, setDuration] = useState("")
  const [releaseDate, setReleaseDate] = useState("")
  const [type, setType] = useState<"movie" | "series">("movie")
  const [newGenre, setNewGenre] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const availableGenres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "Western",
  ]

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) newErrors.title = "Title is required"
    if (!content.trim()) newErrors.content = "Review content is required"
    if (rating === 0) newErrors.rating = "Rating is required"
    if (!imageUrl.trim()) newErrors.imageUrl = "Image URL is required"
    if (!imageUrl.includes("unsplash.com")) newErrors.imageUrl = "Please provide a valid Unsplash URL"
    if (genres.length === 0) newErrors.genres = "At least one genre is required"
    if (!duration.trim()) newErrors.duration = "Duration is required"
    if (!releaseDate.trim()) newErrors.releaseDate = "Release date is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validate()) {
      setIsSubmitting(true)
      onSubmit({
        title,
        content,
        rating,
        criticScore,
        imageUrl,
        genres,
        duration,
        releaseDate,
        type,
        isTopRated: rating >= 8.5,
      })
      setIsSubmitting(false)
    }
  }

  const addGenre = () => {
    if (newGenre && !genres.includes(newGenre)) {
      setGenres([...genres, newGenre])
      setNewGenre("")
    }
  }

  const removeGenre = (genre: string) => {
    setGenres(genres.filter((g) => g !== genre))
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <button
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-200 z-10 bg-gray-800 border border-gray-600 hover:bg-gray-700 rounded-full p-3 transition-all duration-300 cursor-pointer"
          onClick={onClose}
          aria-label="Close Form"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-white mb-8">Write a Review</h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                className={`w-full px-4 py-3 rounded-2xl bg-gray-800 border ${
                  errors.title ? "border-red-500" : "border-gray-600"
                } text-white focus:ring-2 focus:ring-emerald-500 transition-all duration-300`}
                placeholder="Give your review a compelling title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Rating
                </label>
                <div className="flex items-center">
                  {[...Array(10)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`w-8 h-8 cursor-pointer ${
                        i < (hoverRating || rating) ? "text-amber-400" : "text-gray-600"
                      } transition-colors`}
                      onClick={() => setRating(i + 1)}
                      onMouseEnter={() => setHoverRating(i + 1)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`Rate ${i + 1} stars`}
                    >
                      <Star className="w-full h-full fill-current" />
                    </button>
                  ))}
                  <span className="ml-3 text-gray-300 font-medium">{rating > 0 ? `${rating}/10` : ""}</span>
                </div>
                {errors.rating && <p className="mt-1 text-sm text-red-500">{errors.rating}</p>}
              </div>

              <div>
                <label htmlFor="criticScore" className="block text-sm font-medium text-gray-300 mb-2">
                  Critic Score (0-100)
                </label>
                <input
                  type="number"
                  id="criticScore"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                  value={criticScore}
                  onChange={(e) => setCriticScore(Number.parseInt(e.target.value) || 0)}
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">
                  Type
                </label>
                <select
                  id="type"
                  className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                  value={type}
                  onChange={(e) => setType(e.target.value as "movie" | "series")}
                >
                  <option value="movie">Movie</option>
                  <option value="series">Series</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                Review Content
              </label>
              <textarea
                id="content"
                rows={6}
                className={`w-full px-4 py-3 rounded-2xl bg-gray-800 border ${
                  errors.content ? "border-red-500" : "border-gray-600"
                } text-white focus:ring-2 focus:ring-emerald-500 transition-all duration-300`}
                placeholder="Share your thoughts about this film or show..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
              {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-2">
                Image URL (Unsplash)
              </label>
              <input
                type="text"
                id="imageUrl"
                className={`w-full px-4 py-3 rounded-2xl bg-gray-800 border ${
                  errors.imageUrl ? "border-red-500" : "border-gray-600"
                } text-white focus:ring-2 focus:ring-emerald-500 transition-all duration-300`}
                placeholder="https://images.unsplash.com/photo-..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              {errors.imageUrl && <p className="mt-1 text-sm text-red-500">{errors.imageUrl}</p>}
              <p className="mt-1 text-xs text-gray-400">
                Use an Unsplash image URL for the best quality
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  className={`w-full px-4 py-3 rounded-2xl bg-gray-800 border ${
                    errors.duration ? "border-red-500" : "border-gray-600"
                  } text-white focus:ring-2 focus:ring-emerald-500 transition-all duration-300`}
                  placeholder="2h 15m or 8 episodes"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
                {errors.duration && <p className="mt-1 text-sm text-red-500">{errors.duration}</p>}
              </div>

              <div>
                <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-300 mb-2">
                  Release Year
                </label>
                <input
                  type="text"
                  id="releaseDate"
                  className={`w-full px-4 py-3 rounded-2xl bg-gray-800 border ${
                    errors.releaseDate ? "border-red-500" : "border-gray-600"
                  } text-white focus:ring-2 focus:ring-emerald-500 transition-all duration-300`}
                  placeholder="2025"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                />
                {errors.releaseDate && <p className="mt-1 text-sm text-red-500">{errors.releaseDate}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Genres</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {genres.map((genre) => (
                  <div
                    key={genre}
                    className="bg-emerald-600 text-white border border-emerald-500 px-4 py-2 rounded-full text-sm flex items-center"
                  >
                    {genre}
                    <button
                      type="button"
                      onClick={() => removeGenre(genre)}
                      className="ml-2 text-emerald-200 hover:text-white cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <CustomDropdown
                  options={availableGenres}
                  value={newGenre}
                  onChange={setNewGenre}
                  placeholder="Select a genre"
                  className="flex-1"
                />
                <button
                  type="button"
                  className="px-6 py-3 bg-emerald-600 border border-emerald-500 text-white rounded-2xl hover:bg-emerald-700 transition-all duration-300 cursor-pointer"
                  onClick={addGenre}
                >
                  Add
                </button>
              </div>
              {errors.genres && <p className="mt-1 text-sm text-red-500">{errors.genres}</p>}
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
              <button
                type="button"
                className="px-6 py-3 bg-gray-800 border border-gray-600 text-gray-200 rounded-2xl hover:bg-gray-700 transition-all duration-300 cursor-pointer"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-emerald-600 border border-emerald-500 text-white rounded-2xl hover:bg-emerald-700 transition-all duration-300 cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Publish Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Main Page Component
export default function FilmReviewPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [trendingShows] = useState<Show[]>(mockShows)
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(mockReviews)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredReviews(reviews)
    } else {
      const filtered = reviews.filter(
        (review) =>
          review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.genres.some((genre) => genre.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setFilteredReviews(filtered)
    }
  }, [searchQuery, reviews])

  // Filter functionality
  useEffect(() => {
    let filtered = reviews

    if (searchQuery.trim() !== "") {
      filtered = reviews.filter(
        (review) =>
          review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.genres.some((genre) => genre.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    switch (activeFilter) {
      case "movies":
        filtered = filtered.filter((review) => review.type === "movie")
        break
      case "series":
        filtered = filtered.filter((review) => review.type === "series")
        break
      case "top-rated":
        filtered = filtered.filter((review) => review.isTopRated || review.rating >= 8.5)
        break
      case "recent":
        filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      default:
        // "all" - no additional filtering
        break
    }

    setFilteredReviews(filtered)
  }, [activeFilter, searchQuery, reviews])

  const handleLike = (reviewId: number) => {
    setReviews(
      reviews.map((review) => {
        if (review.id === reviewId) {
          const liked = !review.userLiked
          return {
            ...review,
            likes: liked ? review.likes + 1 : review.likes - 1,
            userLiked: liked,
          }
        }
        return review
      }),
    )
  }

  const handleOpenReview = (id: number) => {
    const review = reviews.find((r) => r.id === id)
    if (review) {
      setSelectedReview(review)
      setUserRating(0)
      setHoverRating(0)
    }
  }

  const handleCloseReview = () => {
    setSelectedReview(null)
  }

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
  }

  const handleUserRate = (rating: number) => {
    setUserRating(rating)
  }

  const handleHoverRate = (rating: number) => {
    setHoverRating(rating)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      toast.info(`Searching for: ${searchQuery}`)
    }
  }

  const handleOpenReviewForm = () => {
    setShowReviewForm(true)
  }

  const handleSubmitReview = (
    reviewData: Omit<Review, "id" | "userId" | "userAvatar" | "userName" | "likes" | "createdAt" | "userLiked">,
  ) => {
    const newReview: Review = {
      id: reviews.length + 1,
      userId: 103,
      userName: "Current User",
      userAvatar: "https://randomuser.me/api/portraits/women/68.jpg",
      likes: 0,
      createdAt: new Date().toISOString().split("T")[0],
      userLiked: false,
      ...reviewData,
    }

    setReviews([newReview, ...reviews])
    setActiveFilter("all") // Reset filter to show the new review
    setShowReviewForm(false)
    toast.success("Your review has been published!")
  }

  useEffect(() => {
    document.body.style.overflow = selectedReview || showReviewForm || showMobileMenu ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [selectedReview, showReviewForm, showMobileMenu])

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 quicksand-font">
      <Toaster richColors position="top-center" />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
        
        .quicksand-font {
          font-family: "Quicksand", sans-serif;
          font-optical-sizing: auto;
          font-weight: 400;
          font-style: normal;
        }

        .quicksand-light {
          font-family: "Quicksand", sans-serif;
          font-optical-sizing: auto;
          font-weight: 300;
          font-style: normal;
        }

        .quicksand-medium {
          font-family: "Quicksand", sans-serif;
          font-optical-sizing: auto;
          font-weight: 500;
          font-style: normal;
        }

        .quicksand-semibold {
          font-family: "Quicksand", sans-serif;
          font-optical-sizing: auto;
          font-weight: 600;
          font-style: normal;
        }

        .quicksand-bold {
          font-family: "Quicksand", sans-serif;
          font-optical-sizing: auto;
          font-weight: 700;
          font-style: normal;
        }

        /* Remove number input arrows */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }

        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl quicksand-bold text-emerald-400">
                  CineCritic
                </span>
              </div>

              <nav className="hidden md:ml-8 md:flex space-x-6">
                <button
                  onClick={() => scrollToSection("hero")}
                  className="text-gray-300 hover:text-emerald-400 px-3 py-2 rounded-lg text-sm quicksand-medium cursor-pointer transition-colors duration-200"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("featured")}
                  className="text-gray-300 hover:text-emerald-400 px-3 py-2 rounded-lg text-sm quicksand-medium cursor-pointer transition-colors duration-200"
                >
                  Featured
                </button>
                <button
                  onClick={() => scrollToSection("trending")}
                  className="text-gray-300 hover:text-emerald-400 px-3 py-2 rounded-lg text-sm quicksand-medium cursor-pointer transition-colors duration-200"
                >
                  Trending
                </button>
                <button
                  onClick={() => scrollToSection("reviews")}
                  className="text-gray-300 hover:text-emerald-400 px-3 py-2 rounded-lg text-sm quicksand-medium cursor-pointer transition-colors duration-200"
                >
                  Reviews
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleOpenReviewForm}
                className="hidden md:flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl quicksand-medium transition-colors duration-200 cursor-pointer"
              >
                <Film className="w-4 h-4 mr-2" />
                Post Review
              </button>

              <form onSubmit={handleSearch} className="hidden md:block">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    className="bg-gray-800 border border-gray-600 h-10 pl-10 pr-4 rounded-xl text-sm w-60 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200 text-white placeholder-gray-400 quicksand-font"
                    type="search"
                    placeholder="Search films & shows..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>

              {/* Mobile menu and search */}
              <div className="flex items-center gap-2 md:hidden">
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-800 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => setShowMobileSearch(!showMobileSearch)}
                >
                  <Search className="h-5 w-5 text-gray-300" />
                </button>

                <button
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-800 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  <div className="flex flex-col space-y-1">
                    <span className="block w-4 h-0.5 bg-gray-300"></span>
                    <span className="block w-4 h-0.5 bg-gray-300"></span>
                    <span className="block w-4 h-0.5 bg-gray-300"></span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="md:hidden bg-gray-900 border-b border-gray-700 px-4 py-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                className="bg-gray-800 border border-gray-600 h-10 pl-10 pr-4 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200 text-white placeholder-gray-400 quicksand-font"
                type="search"
                placeholder="Search films & shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/70" onClick={() => setShowMobileMenu(false)}></div>
          <div className="fixed top-0 right-0 h-full w-80 bg-gray-900 border-l border-gray-700">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-700">
                <span className="text-2xl quicksand-bold text-emerald-400">
                  Menu
                </span>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-300" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-6 space-y-2">
                <button
                  onClick={() => {
                    scrollToSection("hero")
                    setShowMobileMenu(false)
                  }}
                  className="w-full text-left px-6 py-4 rounded-xl bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-200 quicksand-medium text-lg"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    scrollToSection("featured")
                    setShowMobileMenu(false)
                  }}
                  className="w-full text-left px-6 py-4 rounded-xl bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-200 quicksand-medium text-lg"
                >
                  Featured
                </button>
                <button
                  onClick={() => {
                    scrollToSection("trending")
                    setShowMobileMenu(false)
                  }}
                  className="w-full text-left px-6 py-4 rounded-xl bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-200 quicksand-medium text-lg"
                >
                  Trending
                </button>
                <button
                  onClick={() => {
                    scrollToSection("reviews")
                    setShowMobileMenu(false)
                  }}
                  className="w-full text-left px-6 py-4 rounded-xl bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors duration-200 quicksand-medium text-lg"
                >
                  Reviews
                </button>
                
                {/* Divider */}
                <div className="py-3">
                  <div className="h-px bg-gray-700"></div>
                </div>
                
                <button
                  onClick={() => {
                    handleOpenReviewForm()
                    setShowMobileMenu(false)
                  }}
                  className="w-full text-left px-6 py-4 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-200 quicksand-semibold text-lg flex items-center"
                >
                  <Film className="w-5 h-5 mr-3" />
                  Post Review
                </button>
              </nav>

              {/* Footer */}
              <div className="p-6 border-t border-gray-700">
                <div className="text-center">
                  <p className="text-sm text-gray-400 quicksand-medium">
                    CineCritic
                  </p>
                  <p className="text-xs text-gray-500 mt-1 quicksand-font">
                    Discover amazing films & shows
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10">
        {/* Show hero, featured, and trending sections only when not searching */}
        {!searchQuery.trim() && (
          <>
            {/* Hero Section with Carousel */}
            <section id="hero" className="mb-8 sm:mb-12 md:mb-16">
              <Carousel items={carouselItems} />
            </section>

            {/* Featured Reviews */}
            <section id="featured" className="mb-8 sm:mb-12 md:mb-16">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl quicksand-bold text-white">Featured Reviews</h2>
                  <p className="text-gray-400 mt-1 quicksand-font">Handpicked reviews from our top critics</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                {filteredReviews.slice(0, 2).map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onOpen={handleOpenReview}
                    onLike={handleLike}
                    variant="featured"
                  />
                ))}
              </div>
            </section>

            {/* Trending Shows */}
            <section id="trending" className="mb-8 sm:mb-12 md:mb-16">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl quicksand-bold text-white">Trending Now</h2>
                  <p className="text-gray-400 mt-1 quicksand-font">The most popular films and shows this week</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {trendingShows.map((show) => (
                  <ShowCard key={show.id} show={show} />
                ))}
              </div>
            </section>
          </>
        )}

        {/* Archive Section - Always visible */}
        <section id="reviews" className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl quicksand-bold text-white">
                {searchQuery.trim() ? `Search Results for "${searchQuery}"` : "Review Archive"}
              </h2>
              <p className="text-gray-400 mt-1 quicksand-font">
                {searchQuery.trim() ? `Found ${filteredReviews.length} result${filteredReviews.length !== 1 ? 's' : ''}` : "Browse our collection of thoughtful analyses"}
              </p>
            </div>
          </div>

          <FilterBar
            filters={[
              { id: "all", label: "All" },
              { id: "movies", label: "Movies" },
              { id: "series", label: "Series" },
              { id: "top-rated", label: "Top Rated" },
              { id: "recent", label: "Recent" },
            ]}
            currentFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />

          <div className="mt-2 grid gap-6">
            {filteredReviews.map((review) => (
              <ReviewCard key={`archive-${review.id}`} review={review} onOpen={handleOpenReview} onLike={handleLike} />
            ))}
          </div>

          {filteredReviews.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg quicksand-semibold text-white mb-2">No results found</h3>
              <p className="text-gray-400 quicksand-font">Try adjusting your search terms or browse all reviews</p>
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg quicksand-bold mb-4 text-white">CineCritic</h3>
              <p className="text-sm text-gray-400 quicksand-font">
                Discover, rate, and review your favorite movies and shows.
              </p>
            </div>
            <div>
              <h3 className="text-sm quicksand-semibold uppercase tracking-wider text-gray-400 mb-4">Categories</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    className="text-gray-300 hover:text-emerald-400 cursor-pointer transition-colors quicksand-font"
                    onClick={() => toast.info("Navigating to Movies section")}
                  >
                    Movies
                  </button>
                </li>
                <li>
                  <button
                    className="text-gray-300 hover:text-emerald-400 cursor-pointer transition-colors quicksand-font"
                    onClick={() => toast.info("Navigating to TV Shows section")}
                  >
                    TV Shows
                  </button>
                </li>
                <li>
                  <button
                    className="text-gray-300 hover:text-emerald-400 cursor-pointer transition-colors quicksand-font"
                    onClick={() => toast.info("Navigating to Documentaries section")}
                  >
                    Documentaries
                  </button>
                </li>
                <li>
                  <button
                    className="text-gray-300 hover:text-emerald-400 cursor-pointer transition-colors quicksand-font"
                    onClick={() => toast.info("Navigating to Coming Soon section")}
                  >
                    Coming Soon
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm quicksand-semibold uppercase tracking-wider text-gray-400 mb-4">Community</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    className="text-gray-300 hover:text-emerald-400 cursor-pointer transition-colors quicksand-font"
                    onClick={() => toast.info("Navigating to Critics section")}
                  >
                    Critics
                  </button>
                </li>
                <li>
                  <button
                    className="text-gray-300 hover:text-emerald-400 cursor-pointer transition-colors quicksand-font"
                    onClick={() => toast.info("Navigating to Forums section")}
                  >
                    Forums
                  </button>
                </li>
                <li>
                  <button
                    className="text-gray-300 hover:text-emerald-400 cursor-pointer transition-colors quicksand-font"
                    onClick={() => toast.info("Navigating to Events section")}
                  >
                    Events
                  </button>
                </li>
                <li>
                  <button
                    className="text-gray-300 hover:text-emerald-400 cursor-pointer transition-colors quicksand-font"
                    onClick={() => toast.info("Navigating to News section")}
                  >
                    News
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm quicksand-semibold uppercase tracking-wider text-gray-400 mb-4">About</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    className="text-gray-300 hover:text-emerald-400 cursor-pointer transition-colors quicksand-font"
                    onClick={() => toast.info("Navigating to About Us section")}
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    className="text-gray-300 hover:text-emerald-400 cursor-pointer transition-colors quicksand-font"
                    onClick={() => toast.info("Navigating to Contact section")}
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button
                    className="text-gray-300 hover:text-emerald-400 cursor-pointer transition-colors quicksand-font"
                    onClick={() => toast.info("Navigating to Privacy Policy section")}
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    className="text-gray-300 hover:text-emerald-400 cursor-pointer transition-colors quicksand-font"
                    onClick={() => toast.info("Navigating to Terms of Service section")}
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 quicksand-font">© 2025 CineCritic. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button
                className="text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors"
                onClick={() => toast.info("Navigating to Facebook page")}
              >
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                className="text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors"
                onClick={() => toast.info("Navigating to Twitter page")}
              >
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>
              <button
                className="text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors"
                onClick={() => toast.info("Navigating to Instagram page")}
              >
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Review Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-start md:items-center justify-center p-2 md:p-4 bg-black/80 backdrop-blur-sm scrollbar-hide">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl md:rounded-3xl max-w-5xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto shadow-2xl relative scrollbar-hide mt-2 md:mt-0">
            <button
              className="absolute top-3 right-3 md:top-6 md:right-6 text-gray-400 hover:text-gray-200 z-10 bg-gray-800 border border-gray-600 hover:bg-gray-700 rounded-full p-2 md:p-3 transition-all duration-300 cursor-pointer"
              onClick={handleCloseReview}
              aria-label="Close Review"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            <div className="relative h-64 md:h-80 lg:h-96">
              <Trailer url={selectedReview.imageUrl} title="Review Image" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end">
                <div className="p-4 md:p-8 w-full">
                  <div className="flex flex-wrap gap-1 md:gap-2 mb-2 md:mb-3">
                    {selectedReview.genres.map((genre, index) => (
                      <GenreTag key={index} genre={genre} />
                    ))}
                  </div>
                  <h1 className="text-2xl md:text-4xl quicksand-bold text-white mb-2 md:mb-4 leading-tight">{selectedReview.title}</h1>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4">
                    <div className="flex items-center text-white bg-gray-800 border border-gray-600 px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                      <Star className="w-4 h-4 md:w-5 md:h-5 text-amber-400 fill-amber-400 mr-1 md:mr-2" />
                      <span className="quicksand-semibold text-sm md:text-lg">{selectedReview.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center text-white bg-gray-800 border border-gray-600 px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                      <Clock className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                      <span className="quicksand-font text-sm md:text-base">{selectedReview.duration}</span>
                    </div>
                    <div className="flex items-center text-white bg-gray-800 border border-gray-600 px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                      <span className="quicksand-font text-sm md:text-base">{selectedReview.releaseDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-6 md:mb-10">
                <div className="bg-gray-800 border border-gray-600 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm">
                  <h3 className="text-xs md:text-sm text-gray-400 uppercase tracking-wider quicksand-semibold mb-2">
                    Critic Score
                  </h3>
                  <div className="flex items-center mb-3">
                    <span className="text-2xl md:text-4xl quicksand-bold text-emerald-400">{selectedReview.criticScore}</span>
                    <span className="text-lg md:text-xl ml-1 text-gray-400 quicksand-font">/ 100</span>
                  </div>
                  <RatingBar score={selectedReview.criticScore / 10} size="lg" />
                </div>
                <div className="bg-gray-800 border border-gray-600 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm">
                  <h3 className="text-xs md:text-sm text-gray-400 uppercase tracking-wider quicksand-semibold mb-2">
                    User Rating
                  </h3>
                  <div className="flex items-center mb-3">
                    <span className="text-2xl md:text-4xl quicksand-bold text-emerald-400">{selectedReview.rating.toFixed(1)}</span>
                    <span className="text-lg md:text-xl ml-1 text-gray-400 quicksand-font">/ 10</span>
                  </div>
                  <RatingBar score={selectedReview.rating} size="lg" />
                </div>
                <div className="bg-gray-800 border border-gray-600 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm">
                  <h3 className="text-xs md:text-sm text-gray-400 uppercase tracking-wider quicksand-semibold mb-2">Rate This</h3>
                  <div className="flex flex-col">
                    <div className="flex items-center justify-center mb-3 md:mb-4">
                      {[...Array(10)].map((_, i) => (
                        <button
                          key={i}
                          className={`w-6 h-6 md:w-8 md:h-8 cursor-pointer ${
                            i < (hoverRating || userRating) ? "text-amber-400" : "text-gray-600"
                          } transition-colors`}
                          onClick={() => handleUserRate(i + 1)}
                          onMouseEnter={() => handleHoverRate(i + 1)}
                          onMouseLeave={() => handleHoverRate(0)}
                          aria-label={`Rate ${i + 1} stars`}
                        >
                          <Star className="w-full h-full fill-current" />
                        </button>
                      ))}
                    </div>
                    <button
                      className="bg-emerald-600 border border-emerald-500 hover:bg-emerald-700 text-white py-2 md:py-3 px-3 md:px-4 rounded-xl md:rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer quicksand-medium text-sm md:text-base"
                      onClick={() => {
                        if (userRating > 0) {
                          toast.success(`You rated ${selectedReview.title} ${userRating} stars!`)
                        }
                      }}
                      disabled={userRating === 0}
                      aria-label="Submit Rating"
                    >
                      Submit Rating
                    </button>
                  </div>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-2xl md:text-3xl quicksand-bold mb-4 md:mb-6 text-white">Review</h2>
                <p className="text-gray-300 mb-6 md:mb-8 text-base md:text-lg leading-relaxed quicksand-font">{selectedReview.content}</p>

                <div className="flex justify-between items-center gap-4 md:gap-6 text-sm text-gray-400 mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-700">
                  <div className="flex items-center gap-3 md:gap-4">
                    <img
                      src={selectedReview.userAvatar || "/placeholder.svg"}
                      alt={selectedReview.userName}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-600"
                    />
                    <div>
                      <div className="quicksand-semibold text-white text-sm md:text-base">{selectedReview.userName}</div>
                      <div className="text-xs md:text-sm quicksand-font">Published {formatDate(selectedReview.createdAt)}</div>
                    </div>
                  </div>
                  <div className="flex space-x-4 md:space-x-8">
                    <button
                      className={`flex items-center gap-2 transition-colors cursor-pointer quicksand-font ${
                        reviews.find(r => r.id === selectedReview.id)?.userLiked ? "text-rose-400" : "hover:text-rose-400"
                      }`}
                      onClick={() => handleLike(selectedReview.id)}
                    >
                      <Heart className={`w-4 h-4 md:w-5 md:h-5 ${reviews.find(r => r.id === selectedReview.id)?.userLiked ? "fill-rose-500" : ""}`} />
                      <span className="hidden sm:inline">{reviews.find(r => r.id === selectedReview.id)?.likes || selectedReview.likes}</span>
                    </button>
                    <button
                      className="flex items-center gap-2 hover:text-emerald-400 transition-colors cursor-pointer quicksand-font"
                      onClick={() => toast.success("Review shared!")}
                    >
                      <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="hidden sm:inline">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review*/} 
      {showReviewForm && <ReviewForm onClose={() => setShowReviewForm(false)} onSubmit={handleSubmitReview} />}
    </div>
  )
}