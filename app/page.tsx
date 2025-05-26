"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Search,
  MapPin,
  Star,
  Filter,
  Plus,
  User,
  LogOut,
  Menu,
  X,
  Camera,
  Mic,
  Send,
  Heart,
  Share2,
  Clock,
  ChefHat,
  Utensils,
  Globe,
  Award,
  Shield,
  Instagram,
  Facebook,
  Twitter,
  Copy,
  ArrowUpDown,
  Eye,
  Users,
  Quote,
} from "lucide-react";

interface Review {
  id: string;
  vendorName: string;
  dishName: string;
  city: string;
  location: string;
  rating: number;
  review: string;
  author: string;
  authorAvatar: string;
  date: string;
  image: string;
  dishType: string;
  price: string;
  likes: number;
  isLiked: boolean;
  comments: number;
  views: number;
  verified: boolean;
  vendorRating: number;
  tags: string[];
  staticTag: string;
}

interface User {
  name: string;
  email: string;
  isAuthenticated: boolean;
  avatar: string;
}

const ReviewStreetFood: React.FC = () => {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    isAuthenticated: false,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "user@streeteats.com",
    password: "password123",
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [shareReview, setShareReview] = useState<Review | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedDishType, setSelectedDishType] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const citiesRef = useRef<HTMLDivElement | null>(null);

  const [reviewForm, setReviewForm] = useState({
    vendorName: "",
    dishName: "",
    city: "",
    location: "",
    rating: 0,
    review: "",
    dishType: "",
    price: "",
    image: null as File | null,
    tags: [] as string[],
  });

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      vendorName: "Mumbai Street Delights",
      dishName: "Vada Pav",
      city: "Mumbai",
      location: "Juhu Beach, Mumbai",
      rating: 5,
      review:
        "Absolutely incredible! The vada was perfectly crispy with amazing spice blend. The vendor has been serving this spot for 20 years and it shows in every bite. Fresh ingredients, authentic flavors, and the perfect balance of textures. This is what street food dreams are made of!",
      author: "Priya Sharma",
      authorAvatar:
        "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face",
      date: "2024-05-20",
      image:
        "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&h=350&fit=crop",
      dishType: "Snacks",
      price: "₹15",
      likes: 124,
      isLiked: false,
      comments: 18,
      views: 847,
      verified: true,
      vendorRating: 4.8,
      tags: [
        "Authentic",
        "Fresh Ingredients",
        "Local Favorite",
        "Budget Friendly",
      ],
      staticTag: "Editor's Pick",
    },
    {
      id: "2",
      vendorName: "Delhi Chat Corner",
      dishName: "Chole Bhature",
      city: "Delhi",
      location: "Chandni Chowk, Delhi",
      rating: 4,
      review:
        "Generous portion and authentic taste. The bhature was fluffy and the chole had the perfect balance of spices. A bit crowded during lunch hours but absolutely worth the wait. The vendor knows his craft and has been perfecting this recipe for decades.",
      author: "Raj Kumar",
      authorAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      date: "2024-05-19",
      image:
        "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=350&fit=crop",
      dishType: "Main Course",
      price: "₹60",
      likes: 89,
      isLiked: false,
      comments: 12,
      views: 523,
      verified: true,
      vendorRating: 4.6,
      tags: ["Generous Portion", "Traditional", "Spicy", "Must Try"],
      staticTag: "Trending",
    },
    {
      id: "3",
      vendorName: "Bangkok Street Kitchen",
      dishName: "Pad Thai",
      city: "Bangkok",
      location: "Khao San Road",
      rating: 5,
      review:
        "Best Pad Thai I have ever had! Fresh ingredients, perfect balance of sweet and sour. The vendor speaks great English and is very friendly. Watching him cook is like watching an artist at work. Every ingredient is fresh and the flavors are perfectly balanced.",
      author: "Sarah Johnson",
      authorAvatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      date: "2024-05-18",
      image:
        "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500&h=350&fit=crop",
      dishType: "Noodles",
      price: "฿80",
      likes: 156,
      isLiked: true,
      comments: 24,
      views: 1247,
      verified: true,
      vendorRating: 4.9,
      tags: [
        "Fresh Ingredients",
        "Friendly Vendor",
        "Tourist Friendly",
        "Instagram Worthy",
      ],
      staticTag: "Most Popular",
    },
    {
      id: "4",
      vendorName: "Istanbul Kebab Master",
      dishName: "Döner Kebab",
      city: "Istanbul",
      location: "Sultanahmet Square",
      rating: 4,
      review:
        "Traditional flavors with high-quality meat. The bread was fresh and warm. Great value for money in the heart of the historic district. The meat was perfectly seasoned and cooked to perfection. A true taste of Istanbul!",
      author: "Ahmed Hassan",
      authorAvatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      date: "2024-05-17",
      image:
        "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&h=350&fit=crop",
      dishType: "Meat",
      price: "₺25",
      likes: 67,
      isLiked: false,
      comments: 8,
      views: 432,
      verified: true,
      vendorRating: 4.5,
      tags: [
        "High Quality",
        "Traditional",
        "Historic Location",
        "Value for Money",
      ],
      staticTag: "Hidden Gem",
    },
    {
      id: "5",
      vendorName: "Mexico City Tacos",
      dishName: "Tacos al Pastor",
      city: "Mexico City",
      location: "Plaza Mayor",
      rating: 5,
      review:
        "Authentic street tacos with perfectly seasoned meat and fresh salsa. The vendor has been perfecting this recipe for decades! The pineapple adds the perfect sweetness and the meat is incredibly tender. This is authentic Mexican street food at its finest.",
      author: "Carlos Rodriguez",
      authorAvatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      date: "2024-05-16",
      image:
        "https://images.unsplash.com/photo-1613409385222-3d0decb6742a?w=500&h=350&fit=crop",
      dishType: "Tacos",
      price: "$3",
      likes: 203,
      isLiked: false,
      comments: 31,
      views: 1856,
      verified: true,
      vendorRating: 4.9,
      tags: ["Authentic", "Perfect Seasoning", "Fresh Salsa", "Local Legend"],
      staticTag: "Authentic",
    },
    {
      id: "6",
      vendorName: "New York Hot Dog Stand",
      dishName: "Classic Hot Dog",
      city: "New York",
      location: "Central Park South",
      rating: 3,
      review:
        "Good quality hot dog with all the classic toppings. A bit pricey for what you get, but convenient location makes up for it. Perfect for a quick bite while exploring the city. The vendor is friendly and service is fast.",
      author: "Mike Chen",
      authorAvatar:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
      date: "2024-05-15",
      image:
        "https://images.unsplash.com/photo-1695089028667-6f7d84ddbe01?w=500&h=350&fit=crop",
      dishType: "Fast Food",
      price: "$5",
      likes: 34,
      isLiked: false,
      comments: 5,
      views: 267,
      verified: false,
      vendorRating: 4.2,
      tags: ["Quick Bite", "Tourist Spot", "High Quality", "Convenient"],
      staticTag: "Quick Bite",
    },
  ]);

  const cities = [
    "Mumbai",
    "Delhi",
    "Bangkok",
    "Istanbul",
    "Mexico City",
    "New York",
  ];
  const dishTypes = [
    "Snacks",
    "Main Course",
    "Noodles",
    "Meat",
    "Tacos",
    "Fast Food",
    "Desserts",
    "Beverages",
  ];

  const handleLogin = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (
        loginForm.email === "user@streeteats.com" &&
        loginForm.password === "password123"
      ) {
                setUser({          name: "Food Explorer",          email: loginForm.email,          isAuthenticated: true,          avatar:            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",        });        setShowLoginModal(false);        setLoginForm({ email: "", password: "" });        toast.success("Welcome back, Food Explorer!", {          position: "bottom-center",          autoClose: 2000,          hideProgressBar: true,          closeOnClick: true,          pauseOnHover: true,          draggable: true,          theme: "light",        });
      } else {
        toast.error("Invalid credentials. Try: user@streeteats.com / password123", {          position: "bottom-center",          autoClose: 4000,          hideProgressBar: false,          closeOnClick: true,          pauseOnHover: true,          draggable: true,          theme: "light",        });
      }
    },
    [loginForm]
  );

    const handleLogout = useCallback(() => {    setUser({ name: "", email: "", isAuthenticated: false, avatar: "" });    setIsMobileMenuOpen(false);    toast.success("Successfully signed out", {      position: "bottom-center",      autoClose: 2000,      hideProgressBar: true,      closeOnClick: true,      pauseOnHover: true,      draggable: true,      theme: "light",    });  }, []);

  const handleLike = useCallback(
    (reviewId: string) => {
      if (!user.isAuthenticated) {
        setShowLoginModal(true);
        return;
      }

      setReviews((prev) =>
        prev.map((review) => {
          if (review.id === reviewId) {
            const newIsLiked = !review.isLiked;
            return {
              ...review,
              isLiked: newIsLiked,
              likes: newIsLiked ? review.likes + 1 : review.likes - 1,
            };
          }
          return review;
        })
      );
    },
    [user]
  );

  const handleShare = useCallback((review: Review) => {
    setShareReview(review);
    setShowShareModal(true);
  }, []);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  const searchSuggestions = useMemo(() => {
    const allItems = [
      ...reviews.map((r) => r.vendorName),
      ...reviews.map((r) => r.dishName),
      ...reviews.map((r) => r.city),
      ...reviews.map((r) => r.dishType),
      ...reviews.flatMap((r) => r.tags),
    ];
    return [...new Set(allItems)];
  }, [reviews]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = searchSuggestions
        .filter((item) =>
          item.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery, searchSuggestions]);
  useEffect(() => {
    const isModalOpen =
      showLoginModal || showReviewModal || showShareModal || showAboutModal;
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLoginModal, showReviewModal, showShareModal, showAboutModal]);

  const filteredAndSortedReviews = useMemo(() => {
    let filtered = reviews.filter((review) => {
      const matchesSearch =
        searchQuery === "" ||
        review.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.dishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCity =
        selectedCity === "all" || review.city === selectedCity;
      const matchesDishType =
        selectedDishType === "all" || review.dishType === selectedDishType;
      const matchesRating =
        selectedRating === "all" || review.rating >= parseInt(selectedRating);

      return matchesSearch && matchesCity && matchesDishType && matchesRating;
    });

    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "highest-rated":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "most-liked":
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case "most-viewed":
        filtered.sort((a, b) => b.views - a.views);
        break;
      default:
        break;
    }

    return filtered;
  }, [
    reviews,
    searchQuery,
    selectedCity,
    selectedDishType,
    selectedRating,
    sortBy,
  ]);

  const handleReviewSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!user.isAuthenticated) {
        setShowLoginModal(true);
        return;
      }

      // Validation
      if (!reviewForm.vendorName.trim()) {
        toast.error("Please enter vendor name");
        return;
      }
      if (!reviewForm.dishName.trim()) {
        toast.error("Please enter dish name");
        return;
      }
      if (!reviewForm.city) {
        toast.error("Please select a city");
        return;
      }
      if (!reviewForm.location.trim()) {
        toast.error("Please enter location");
        return;
      }
      if (!reviewForm.dishType) {
        toast.error("Please select dish type");
        return;
      }
      if (reviewForm.rating === 0) {
        toast.error("Please rate the dish");
        return;
      }
      if (!reviewForm.review.trim()) {
        toast.error("Please write your review");
        return;
      }
      if (reviewForm.review.trim().length < 20) {
        toast.error("Review should be at least 20 characters long");
        return;
      }

      const newReview: Review = {
        id: Date.now().toString(),
        vendorName: reviewForm.vendorName,
        dishName: reviewForm.dishName,
        city: reviewForm.city,
        location: reviewForm.location,
        rating: reviewForm.rating,
        review: reviewForm.review,
        author: user.name,
        authorAvatar: user.avatar,
        date: new Date().toISOString().split("T")[0],
        image:
          "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=350&fit=crop",
        dishType: reviewForm.dishType,
        price: reviewForm.price,
        likes: 0,
        isLiked: false,
        comments: 0,
        views: 0,
        verified: false,
        vendorRating: 4.0,
        tags: reviewForm.tags,
        staticTag: "New Review",
      };

      setReviews((prev) => [newReview, ...prev]);
      setShowReviewModal(false);
      setReviewForm({
        vendorName: "",
        dishName: "",
        city: "",
        location: "",
        rating: 0,
        review: "",
        dishType: "",
        price: "",
        image: null,
        tags: [],
      });
      toast.success("Review submitted successfully! Thank you for sharing.", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    },
    [reviewForm, user]
  );

  const StarRating: React.FC<{
    rating: number;
    interactive?: boolean;
    onRate?: (rating: number) => void;
    size?: "sm" | "md" | "lg";
  }> = ({ rating, interactive = false, onRate, size = "md" }) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${
              interactive
                ? "cursor-pointer hover:text-yellow-400 transition-colors"
                : ""
            }`}
            onClick={interactive && onRate ? () => onRate(star) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      style={{ fontFamily: "var(--font-roboto), sans-serif" }}
    >
      <ToastContainer />
      <nav className="bg-white/95 backdrop-blur-lg shadow-xl sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-2.5 rounded-xl shadow-lg">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 text-transparent bg-clip-text">
                  StreetEats
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Community Reviews
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => {
                  if (citiesRef.current) {
                      const yOffset = -40;
                    const y =
                      citiesRef.current.getBoundingClientRect().top +
                      window.pageYOffset +
                      yOffset;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                }}
                className="text-gray-700 cursor-pointer hover:text-orange-600 font-medium transition-colors relative group"
              >
                Cities
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all group-hover:w-full"></span>
              </button>
              <button
                onClick={() => setShowAboutModal(true)}
                className="text-gray-700 cursor-pointer hover:text-orange-600 font-medium transition-colors relative group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all group-hover:w-full"></span>
              </button>

              {user.isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-5 py-2.5 rounded-xl cursor-pointer hover:from-orange-700 hover:to-red-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                    Add Review
                  </button>

                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <span className="font-medium text-gray-800">
                      {user.name}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="text-gray-500 cursor-pointer hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2.5 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-105"
                >
                  Sign In
                </button>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 cursor-pointer rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden border-t bg-white/95 backdrop-blur-lg py-4 space-y-4 animate-in slide-in-from-top duration-200">
              <button
                onClick={() => {
                  if (citiesRef.current) {
                      const yOffset = -230;
                    const y =
                      citiesRef.current.getBoundingClientRect().top +
                      window.pageYOffset +
                      yOffset;
                    window.scrollTo({ top: y, behavior: "smooth" });
                    setIsMobileMenuOpen(false);
                  }
                }}
                className="block w-full cursor-pointer  text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg mx-4"
              >
                Cities
              </button>
              <button
                onClick={() => {
                  setShowAboutModal(true);
                  setIsMobileMenuOpen(false);
                }}
                className="block  cursor-pointer w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg mx-4"
              >
                About
              </button>

              {user.isAuthenticated ? (
                <div className="px-4 space-y-3">
                  <button
                    onClick={() => {
                      setShowReviewModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all flex items-center  cursor-pointer justify-center gap-2 shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Add Review
                  </button>

                  <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <span className="font-medium text-gray-800">
                        {user.name}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-red-600 cursor-pointer  hover:text-red-700 p-2 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-4">
                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full cursor-pointer  bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all shadow-lg"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
              Discover Amazing
              <span className="block bg-gradient-to-r from-yellow-300 to-yellow-500 text-transparent bg-clip-text">
                Street Food
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 text-orange-100 leading-relaxed max-w-3xl mx-auto px-4">
              Join our community of food lovers sharing authentic street food
              experiences from around the world
            </p>

            <div className="relative max-w-2xl mx-auto mb-8 sm:mb-12 px-4">
              <div className="relative">
                <Search className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />

                <input
                  type="text"
                  placeholder="Search vendors, dishes, cities, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 sm:pl-14 pr-12 sm:pr-14 py-4 sm:py-5 text-base sm:text-lg rounded-2xl text-gray-900 bg-white/95 backdrop-blur-sm shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/20 transition-all border border-white/20"
                />

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute  cursor-pointer right-4 sm:right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                )}
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white rounded-xl mt-3 shadow-lg border border-gray-100 overflow-hidden z-10 mx-4 max-h-72 overflow-y-auto">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        setShowSuggestions(false);
                      }}
                      className="w-full cursor-pointer  text-left px-5 py-3 text-gray-700 hover:bg-orange-100/20 transition-colors border-b last:border-b-0 flex items-center gap-3"
                    >
                      <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-lg sm:max-w-2xl lg:max-w-4xl mx-auto px-4">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2">
                  12K+
                </div>
                <div className="text-orange-200 text-xs sm:text-sm font-medium">
                  Reviews
                </div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2">
                  50+
                </div>
                <div className="text-orange-200 text-xs sm:text-sm font-medium">
                  Cities
                </div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2">
                  8K+
                </div>
                <div className="text-orange-200 text-xs sm:text-sm font-medium">
                  Vendors
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={filterRef}
        className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100   top-16 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-6 items-start lg:items-center justify-between">
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center cursor-pointer  gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors lg:hidden shadow-sm"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <div className="hidden lg:flex items-center gap-3 sm:gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="px-2 sm:px-3 py-1 sm:py-2 border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg text-sm sm:text-base text-black cursor-pointer"
                  >
                    <option value="all">All Cities</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
                  <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  <select
                    value={selectedDishType}
                    onChange={(e) => setSelectedDishType(e.target.value)}
                    className="px-2 sm:px-3 py-1 sm:py-2 border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg text-sm sm:text-base text-black cursor-pointer"
                  >
                    <option value="all">All Dishes</option>
                    {dishTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="px-2 sm:px-3 py-1 sm:py-2 border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg text-sm sm:text-base text-black cursor-pointer"
                  >
                    <option value="all">All Ratings</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-4 flex-wrap justify-between lg:justify-end w-full lg:w-auto">
              {(searchQuery || selectedCity !== "all" || selectedDishType !== "all" || selectedRating !== "all" || sortBy !== "newest") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCity("all");
                    setSelectedDishType("all");
                    setSelectedRating("all");
                    setSortBy("newest");
                  }}
                  className="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-2 lg:py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all border border-red-200 hover:border-red-300 cursor-pointer text-xs lg:text-sm font-medium"
                >
                  <X className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="hidden sm:inline">Reset</span>
                  <span className="sm:hidden">Reset</span>
                </button>
              )}

              <div className="flex items-center gap-1.5 lg:gap-2 bg-gray-50 rounded-xl p-1.5 lg:p-2">
                <ArrowUpDown className="w-3 h-3 lg:w-4 lg:h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-1.5 lg:px-3 py-1 lg:py-2 border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg text-xs lg:text-sm text-black cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest-rated">Highest Rated</option>
                  <option value="most-liked">Most Liked</option>
                  <option value="most-viewed">Most Viewed</option>
                </select>
              </div>

              <div className="text-gray-600 text-xs lg:text-sm bg-gray-50 px-2 lg:px-3 py-1.5 lg:py-2 rounded-xl whitespace-nowrap">
                <span className="hidden sm:inline">{filteredAndSortedReviews.length} of {reviews.length} reviews</span>
                <span className="sm:hidden">{filteredAndSortedReviews.length}/{reviews.length}</span>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="lg:hidden mt-4 sm:mt-6 p-4 sm:p-6 bg-gray-50 rounded-2xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="all">All Cities</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dish Type
                  </label>
                  <select
                    value={selectedDishType}
                    onChange={(e) => setSelectedDishType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="all">All Dishes</option>
                    {dishTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="all">All Ratings</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest-rated">Highest Rated</option>
                    <option value="most-liked">Most Liked</option>
                    <option value="most-viewed">Most Viewed</option>
                  </select>
                </div>
              </div>

              {(searchQuery || selectedCity !== "all" || selectedDishType !== "all" || selectedRating !== "all" || sortBy !== "newest") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCity("all");
                  setSelectedDishType("all");
                  setSelectedRating("all");
                  setSortBy("newest");
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all border border-red-200 hover:border-red-300 cursor-pointer font-medium"
              >
                <X className="w-4 h-4" />
                Reset All Filters
              </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredAndSortedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-gray-100 hover:border-orange-200"
            >
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img
                  src={review.image}
                  alt={review.dishName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-white/95 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold text-gray-900 shadow-lg">
                  {review.price}
                </div>

                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                  {review.staticTag}
                </div>

                {review.verified && (
                  <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-green-500 text-white p-1.5 sm:p-2 rounded-full shadow-lg">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                )}

                <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs sm:text-sm font-bold text-gray-900">
                    {review.rating}.0
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-lg sm:text-xl text-gray-900 leading-tight">
                      {review.dishName}
                    </h3>

                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Eye className="w-3 h-3" />
                      <span>{review.views}</span>
                    </div>
                  </div>
                  <p className="text-orange-600 font-semibold text-base sm:text-lg">
                    {review.vendorName}
                  </p>

                  <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{review.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-xl">
                  <Award className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-600">
                    Vendor Rating:
                  </span>
                  <StarRating
                    rating={Math.floor(review.vendorRating)}
                    size="sm"
                  />
                  <span className="text-xs sm:text-sm font-medium">
                    {review.vendorRating}
                  </span>
                </div>

                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed line-clamp-3">
                  {review.review}
                </p>

                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {review.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 px-2 sm:px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  {review.tags.length > 3 && (
                    <span className="bg-gray-100 text-gray-600 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                      +{review.tags.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100">
                  <div className="flex items-center  justify-between w-full">
                    <button
                      onClick={() => handleLike(review.id)}
                      className={`flex  cursor-pointer items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all text-xs sm:text-sm ${
                        review.isLiked
                          ? "text-red-600 bg-red-50"
                          : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <Heart
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${
                          review.isLiked ? "fill-current" : ""
                        }`}
                      />
                      <span className="font-medium">{review.likes}</span>
                    </button>

                    <button
                      onClick={() => handleShare(review)}
                      className="flex items-center gap-1 sm:gap-1.5 text-gray-500 hover:text-blue-600 cursor-pointer  hover:bg-blue-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all text-xs sm:text-sm"
                    >
                      <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-medium">Share</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <img
                      src={review.authorAvatar}
                      alt={review.author}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-gray-100"
                    />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">
                        {review.author}
                      </p>
                      <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-500">
                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {review.date}
                      </div>
                    </div>
                  </div>

                  <span className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                    {review.dishType}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedReviews.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="text-gray-300 mb-4 sm:mb-6">
              <Search className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              No reviews found
            </h3>
            <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCity("all");
                setSelectedDishType("all");
                setSelectedRating("all");
                setSortBy("newest");
              }}
              className="bg-orange-600 text-white cursor-pointer  px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
      <div className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Why Choose <span className="text-orange-600">StreetEats?</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the world's best street food through our trusted
              community of food enthusiasts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-orange-100 hover:shadow-lg transition-all duration-300">
              <div className="bg-orange-500 p-3 sm:p-4 rounded-2xl w-fit mb-4 sm:mb-6">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Verified Reviews
              </h3>
              <p className="text-gray-600 leading-relaxed">
                All reviews are verified by our community. Get honest, authentic
                feedback from real food lovers who've been there.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="bg-blue-500 p-3 sm:p-4 rounded-2xl w-fit mb-4 sm:mb-6">
                <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Global Coverage
              </h3>
              <p className="text-gray-600 leading-relaxed">
                From Mumbai's vada pav to Bangkok's pad thai, discover authentic
                street food from over 50 cities worldwide.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-purple-100 hover:shadow-lg transition-all duration-300">
              <div className="bg-purple-500 p-3 sm:p-4 rounded-2xl w-fit mb-4 sm:mb-6">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Community Driven
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Join thousands of food enthusiasts sharing their discoveries and
                helping others find incredible street food.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={citiesRef}
        className="bg-gradient-to-br from-gray-50 to-gray-100 py-12 sm:py-16 lg:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Explore <span className="text-orange-600">Popular Cities</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Discover amazing street food destinations around the world
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {cities.map((city, index) => {
              const cityImages = [
                "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&h=200&fit=crop",
                "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300&h=200&fit=crop",
                "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=300&h=200&fit=crop",
                "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=300&h=200&fit=crop",
                "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=300&h=200&fit=crop",
                "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&h=200&fit=crop",
              ];

              return (
                <div
                  key={city}
                  className="group cursor-pointer"
                  onClick={() => {
                    setSelectedCity(city);
                    setShowFilters(false);
                    setTimeout(() => {
                      if (filterRef.current) {
                        const yOffset = -40;
                        const y =
                          filterRef.current.getBoundingClientRect().top +
                          window.pageYOffset +
                          yOffset;
                        window.scrollTo({ top: y, behavior: "smooth" });
                      }
                    }, 100);
                  }}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                    <img
                      src={cityImages[index]}
                      alt={city}
                      className="w-full h-32 sm:h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                      <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg">
                        {city}
                      </h3>
                      <p className="text-white/80 text-xs sm:text-sm">
                        {reviews.filter((r) => r.city === city).length} reviews
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              What Our <span className="text-orange-600">Community</span> Says
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Real stories from food lovers around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-orange-100">
              <Quote className="w-8 h-8 text-orange-500 mb-4 sm:mb-6" />
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                "StreetEats helped me discover the most amazing tacos in Mexico
                City. The community reviews are spot on!"
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
                  alt="Sarah"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">Travel Blogger</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-blue-100">
              <Quote className="w-8 h-8 text-blue-500 mb-4 sm:mb-6" />
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                "As a food enthusiast, this platform is a goldmine. I've found
                hidden gems in every city I visit."
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
                  alt="Raj"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">Raj Kumar</p>
                  <p className="text-sm text-gray-600">Food Critic</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-purple-100">
              <Quote className="w-8 h-8 text-purple-500 mb-4 sm:mb-6" />
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                "The reviews are brilliant! You can hear the passion in
                people's voices when they talk about great food."
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face"
                  alt="Carlos"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    Carlos Rodriguez
                  </p>
                  <p className="text-sm text-gray-600">Chef</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Ready to Share Your Experience?
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-orange-100">
            Join thousands of food lovers and help others discover amazing
            street food
          </p>
          {user.isAuthenticated ? (
            <button
              onClick={() => setShowReviewModal(true)}
              className="bg-white text-orange-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer "
            >
              Write Your First Review
            </button>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-white text-orange-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer "
            >
              Join StreetEats Today
            </button>
          )}
        </div>
      </div>

      {showAboutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50  ">
          <div className="bg-white p-1 rounded-lg max-w-4xl w-full animate-in zoom-in-95 duration-300 shadow-2xl border border-gray-100 my-8">
            <div className="max-h-[90vh] overflow-y-auto rounded-b-lg">
              <div className="relative bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white p-6 sm:p-8 lg:p-12 rounded-t-lg ">
                <button
                  onClick={() => setShowAboutModal(false)}
                  className="absolute top-4  cursor-pointer sm:top-6 right-4 sm:right-6 text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="text-center">
                  <div className="bg-white/20 p-4 rounded-2xl w-fit mx-auto mb-6">
                    <Utensils className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                    About StreetEats
                  </h2>
                  <p className="text-lg sm:text-xl text-orange-100 max-w-2xl mx-auto">
                    Connecting food lovers with authentic street food
                    experiences worldwide
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8 lg:p-12 space-y-8 sm:space-y-12">
                  <div className="text-center max-w-3xl mx-auto">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Our Mission
                  </h3>
                  <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                    To create the world's most trusted community for street food
                    discovery, where authentic experiences are shared,
                    celebrated, and preserved for food lovers everywhere.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 sm:p-6 rounded-2xl border border-orange-100">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-600 mb-2">
                      12K+
                    </div>
                    <div className="text-sm sm:text-base text-gray-600 font-medium">
                      Reviews
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 sm:p-6 rounded-2xl border border-blue-100">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                      50+
                    </div>
                    <div className="text-sm sm:text-base text-gray-600 font-medium">
                      Cities
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-6 rounded-2xl border border-green-100">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-2">
                      8K+
                    </div>
                    <div className="text-sm sm:text-base text-gray-600 font-medium">
                      Vendors
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 rounded-2xl border border-purple-100">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 mb-2">
                      25K+
                    </div>
                    <div className="text-sm sm:text-base text-gray-600 font-medium">
                      Users
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  <div className="text-center">
                    <div className="bg-orange-100 p-4 rounded-2xl w-fit mx-auto mb-4">
                      <Shield className="w-8 h-8 text-orange-600" />
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      Verified Reviews
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Every review is verified by our community to ensure
                      authenticity and reliability.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-blue-100 p-4 rounded-2xl w-fit mx-auto mb-4">
                      <Globe className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      Global Reach
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Discover street food treasures from major cities across
                      six continents.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-purple-100 p-4 rounded-2xl w-fit mx-auto mb-4">
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      Community First
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Built by food lovers, for food lovers. Every feature is
                      community-driven.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-green-100 p-4 rounded-2xl w-fit mx-auto mb-4">
                      <Mic className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      Great Reviews
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Hear the passion in reviewers' voices with our verified
                      reviews.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-red-100 p-4 rounded-2xl w-fit mx-auto mb-4">
                      <Camera className="w-8 h-8 text-red-600" />
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      Visual Stories
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Every review includes high-quality photos to showcase the
                      food experience.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-yellow-100 p-4 rounded-2xl w-fit mx-auto mb-4">
                      <Award className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      Quality Ratings
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Detailed ratings for both dishes and vendors to help you
                      make informed choices.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-8 rounded-3xl text-center">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Join Our Community
                  </h3>
                  <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
                    Whether you're a seasoned foodie or just beginning your
                    culinary journey, StreetEats is your gateway to authentic
                    street food experiences.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                    {user.isAuthenticated ? (
                      <button
                        onClick={() => {
                          setShowAboutModal(false);
                          setShowReviewModal(true);
                        }}
                        className="w-full cursor-pointer  sm:w-auto bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
                      >
                        Share Your Experience
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setShowAboutModal(false);
                          setShowLoginModal(true);
                        }}
                        className="w-full  cursor-pointer sm:w-auto bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
                      >
                        Get Started Today
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full animate-in zoom-in-95 duration-300 shadow-2xl border border-gray-100">
            <div className="text-center mb-6 sm:mb-8">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 sm:p-4 rounded-2xl w-fit mx-auto mb-4 sm:mb-6 shadow-xl">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                Welcome Back
              </h2>
              <p className="text-gray-600 text-base sm:text-lg">
                Sign in to share your street food experiences
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Email
                </label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-base sm:text-lg text-gray-900 bg-white"
                  placeholder="user@streeteats.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-base sm:text-lg text-gray-900 bg-white"
                  placeholder="password123"
                />
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-3 sm:p-4 rounded-xl border border-orange-200">
                <div className="text-sm text-orange-800">
                  <div className="font-semibold mb-1">🔐 Demo Credentials:</div>
                  <div>Email: user@streeteats.com</div>
                  <div>Password: password123</div>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 px-4 cursor-pointer  sm:px-6 py-3 sm:py-4 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogin(e);
                  }}
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all font-semibold shadow-lg hover:shadow-xl cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showShareModal && shareReview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full animate-in zoom-in-95 duration-300 shadow-2xl border border-gray-100 h-[90vh] overflow-y-scroll">
            <div className="text-center mb-6 sm:mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 sm:p-4 rounded-2xl w-fit mx-auto mb-4 sm:mb-6 shadow-xl">
                <Share2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                Share Review
              </h2>
              <p className="text-gray-600">
                Share this amazing food review with others
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-3 mb-2 sm:mb-3">
                <img
                  src={shareReview.image}
                  alt={shareReview.dishName}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                    {shareReview.dishName}
                  </h3>
                  <p className="text-orange-600 font-medium text-xs sm:text-sm truncate">
                    {shareReview.vendorName}
                  </p>
                  <StarRating rating={shareReview.rating} size="sm" />
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <button
                onClick={() => {
                  window.open(
                    `https://twitter.com/intent/tweet?text=Check out this amazing ${shareReview.dishName} review from ${shareReview.vendorName}!&url=${window.location.href}`
                  );
                }}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border cursor-pointer  border-blue-200"
              >
                <div className="bg-blue-500 p-2 rounded-lg">
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="font-semibold text-blue-700 text-sm sm:text-base">
                  Share on Twitter
                </span>
              </button>

              <button
                onClick={() => {
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`
                  );
                }}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all cursor-pointer  border border-blue-200"
              >
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="font-semibold text-blue-700 text-sm sm:text-base">
                  Share on Facebook
                </span>
              </button>

              <button
                onClick={() => {
                  window.open(`https://www.instagram.com/`);
                }}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-pink-50 hover:bg-pink-100 rounded-xl transition-all cursor-pointer  border border-pink-200"
              >
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="font-semibold text-pink-700 text-sm sm:text-base">
                  Share on Instagram
                </span>
              </button>

              <button
                onClick={() =>
                  copyToClipboard(
                    `Check out this amazing ${shareReview.dishName} review from ${shareReview.vendorName}! ${window.location.href}`
                  )
                }
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all cursor-pointer border border-gray-200"
              >
                <div className="bg-gray-500 p-2 rounded-lg">
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-700 text-sm sm:text-base">
                  Copy Link
                </span>
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 cursor-pointer  border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl p-4 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300 shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Share Your Experience
                </h2>
                <p className="text-gray-600">
                  Help others discover amazing street food
                </p>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-500 cursor-pointer  hover:text-gray-700 p-2 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor Name *
                  </label>
                  <input
                    type="text"
                    value={reviewForm.vendorName}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        vendorName: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                    placeholder="e.g., Mumbai Street Delights"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    What's the name of the food stall or vendor?
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    value={reviewForm.dishName}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        dishName: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                    placeholder="e.g., Vada Pav"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    What dish did you try?
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <select
                    value={reviewForm.city}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dish Type *
                  </label>
                  <select
                    value={reviewForm.dishType}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        dishType: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                    required
                  >
                    <option value="">Select Type</option>
                    {dishTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={reviewForm.location}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                    placeholder="e.g., Near Central Park"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Specific location or landmark
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    type="text"
                    value={reviewForm.price}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                    placeholder="e.g., $5 or ₹50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    How much did it cost?
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 sm:mb-4">
                  Rating *
                </label>
                <div className="flex items-center gap-4 p-4 sm:p-6 bg-gray-50 rounded-xl">
                  <StarRating
                    rating={reviewForm.rating}
                    interactive={true}
                    onRate={(rating) =>
                      setReviewForm((prev) => ({ ...prev, rating }))
                    }
                    size="lg"
                  />
                  <span className="text-base sm:text-lg font-semibold text-gray-700">
                    {reviewForm.rating > 0
                      ? `${reviewForm.rating}/5`
                      : "Click to rate"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Your Review *
                </label>
                <textarea
                  value={reviewForm.review}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      review: e.target.value,
                    }))
                  }
                  rows={5}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none text-gray-900 bg-white"
                  placeholder="Share your honest experience! What made this dish special? How was the taste, portion size, and overall experience? Be descriptive and help other food lovers!"
                  required
                />
                <div className="mt-3 p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-xs sm:text-sm text-blue-800">
                    <span className="font-semibold">
                      💡 Tips for a great review:
                    </span>{" "}
                    Mention the taste, texture, freshness, portion size, vendor
                    friendliness, and overall experience. Be specific and
                    honest!
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">
                      Photo will be added automatically
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-500  items-center gap-1 hidden md:flex">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Help the community</span>
                  <span className="sm:hidden">Help others</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-6 sm:px-8 cursor-pointer  py-3 sm:py-4 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold text-base sm:text-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleReviewSubmit(e);
                  }}
                  className="flex-1 px-6 sm:px-8 py-3  cursor-pointer sm:py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all flex items-center justify-center gap-2 sm:gap-3 font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {user.isAuthenticated && (
        <button
          onClick={() => setShowReviewModal(true)}
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-3xl transition-all  cursor-pointer duration-300 hover:scale-110 z-40 group"
        >
          <Plus className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      )}

      <footer className="bg-gray-900 text-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-2.5 rounded-xl shadow-lg">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 text-transparent bg-clip-text">
                    StreetEats
                  </h1>
                  <p className="text-xs text-gray-400">Community Reviews</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4 sm:mb-6">
                Connecting food lovers with authentic street food experiences
                from around the world.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => window.open('https://www.instagram.com/', '_blank')}
                  className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <Instagram className="w-5 h-5" />
                </button>
                <button
                  onClick={() => window.open('https://www.facebook.com/', '_blank')}
                  className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button
                  onClick={() => window.open('https://www.twitter.com/', '_blank')}
                  className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <Twitter className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 sm:mb-6">Quick Links</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-gray-300 hover:text-orange-400 transition-colors cursor-pointer"
                  >
                    Discover
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      if (citiesRef.current) {
                        const yOffset = -40;
                        const y = citiesRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }}
                    className="text-gray-300 hover:text-orange-400 transition-colors cursor-pointer"
                  >
                    Popular Cities
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedRating("4");
                      if (filterRef.current) {
                        const yOffset = -40;
                        const y = filterRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }}
                    className="text-gray-300 hover:text-orange-400 transition-colors cursor-pointer"
                  >
                    Top Vendors
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSortBy("highest-rated");
                      if (filterRef.current) {
                        const yOffset = -40;
                        const y = filterRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }}
                    className="text-gray-300 hover:text-orange-400 transition-colors cursor-pointer"
                  >
                    Best Dishes
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 sm:mb-6">Support</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <button
                    onClick={() => setShowAboutModal(true)}
                    className="text-gray-300 hover:text-orange-400 transition-colors cursor-pointer"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowAboutModal(true)}
                    className="text-gray-300 hover:text-orange-400 transition-colors cursor-pointer"
                  >
                    Community Guidelines
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      if (user.isAuthenticated) {
                        setShowReviewModal(true);
                      } else {
                        setShowLoginModal(true);
                      }
                    }}
                    className="text-gray-300 hover:text-orange-400 transition-colors cursor-pointer"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      toast.info("Report feature coming soon! For now, please contact us directly.", {
                        position: "bottom-center",
                        autoClose: 3000,
                      });
                    }}
                    className="text-gray-300 hover:text-orange-400 transition-colors cursor-pointer"
                  >
                    Report Issue
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 sm:mb-6">Company</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <button
                    onClick={() => setShowAboutModal(true)}
                    className="text-gray-300 hover:text-orange-400 transition-colors cursor-pointer"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      if (user.isAuthenticated) {
                        setShowReviewModal(true);
                      } else {
                        setShowLoginModal(true);
                      }
                    }}
                    className="text-gray-300 hover:text-orange-400 transition-colors cursor-pointer"
                  >
                    Feedback
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      toast.info("Partnership opportunities available! Contact us for more details.", {
                        position: "bottom-center",
                        autoClose: 3000,
                      });
                    }}
                    className="text-gray-300 hover:text-orange-400 transition-colors cursor-pointer"
                  >
                    Partnerships
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center sm:text-left">
              © 2024 StreetEats. All rights reserved. Made with ❤️ for food
              lovers worldwide.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <button 
                onClick={() => {
                  toast.info("Privacy Policy coming soon!", {
                    position: "bottom-center",
                    autoClose: 2000,
                  });
                }}
                className="hover:text-orange-400 transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => {
                  toast.info("Terms of Service coming soon!", {
                    position: "bottom-center",
                    autoClose: 2000,
                  });
                }}
                className="hover:text-orange-400 transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReviewStreetFood;