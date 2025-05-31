"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  User,
  ShoppingBag,
  Plus,
  MapPin,
  Clock,
  Star,
  Menu,
  X,
  LogIn,
  LogOut,
  Eye,
  EyeOff,
  Search,
  Filter,
  TrendingUp,
  Users,
  Award,
  CheckCircle,
  ChevronDown,
  Calendar,
  DollarSign,
  Tag,
  Phone,
  Mail,
  Shield,
  ArrowRight,
  PlayCircle,
  Quote,
  Building,
  Globe,
  Zap,
  Heart,
  Target,
  Handshake,
} from "lucide-react";

// Types
interface Deal {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  shopName: string;
  location: string;
  category: string;
  expiresAt: string;
  image: string;
  rating: number;
  reviews: number;
  isVerified: boolean;
  createdBy?: string;
  isClaimed?: boolean;
  claimedBy?: string[];
}

interface User {
  email: string;
  name: string;
  shopName?: string;
}

interface FormErrors {
  [key: string]: string;
}

const LocalDeals: React.FC = () => {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  // UI state
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const [showClaimModal, setShowClaimModal] = useState<boolean>(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // Form states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState<FormErrors>({});
  const [dealForm, setDealForm] = useState({
    title: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
    shopName: "",
    location: "",
    category: "",
    expiresAt: "",
  });
  const [dealErrors, setDealErrors] = useState<FormErrors>({});
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");

  // Data state
  const [deals, setDeals] = useState<Deal[]>([]);
  const [showDealForm, setShowDealForm] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Sample deals data
  const sampleDeals: Deal[] = [
    {
      id: "1",
      title: "50% Off Premium Coffee Beans",
      description:
        "Get the finest arabica coffee beans at half price. Limited time offer for coffee enthusiasts who appreciate quality and flavor.",
      originalPrice: 29.99,
      discountedPrice: 14.99,
      discountPercentage: 50,
      shopName: "Bean There Coffee Co.",
      location: "Downtown Plaza, Suite 101",
      category: "Food & Beverage",
      expiresAt: "2024-06-15",
      image:
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500&h=400&fit=crop&q=80",
      rating: 4.8,
      reviews: 342,
      isVerified: true,
      createdBy: "other@user.com",
      isClaimed: false,
      claimedBy: [],
    },
    {
      id: "2",
      title: "Handbags - Up to 70% Off",
      description:
        "Luxury designer handbags from top brands. End of season sale with authentic products and warranty included.",
      originalPrice: 299.99,
      discountedPrice: 89.99,
      discountPercentage: 70,
      shopName: "Fashion Forward",
      location: "Mall Center, 2nd Floor",
      category: "Fashion",
      expiresAt: "2024-06-20",
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=400&fit=crop&q=80",
      rating: 4.6,
      reviews: 128,
      isVerified: true,
      createdBy: "other@user.com",
      isClaimed: false,
      claimedBy: [],
    },
    {
      id: "3",
      title: "Professional Massage Therapy",
      description:
        "Relaxing full-body massage therapy sessions. Perfect for stress relief and muscle tension. Book now and save big!",
      originalPrice: 120.0,
      discountedPrice: 60.0,
      discountPercentage: 50,
      shopName: "Zen Wellness Spa",
      location: "Health District, Main St",
      category: "Health & Beauty",
      expiresAt: "2024-06-25",
      image:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&h=400&fit=crop&q=80",
      rating: 4.9,
      reviews: 256,
      isVerified: true,
      createdBy: "other@user.com",
      isClaimed: false,
      claimedBy: [],
    },
    {
      id: "4",
      title: "Latest Smartphones - 40% Off",
      description:
        "Brand new smartphones with latest features. All models available with full warranty and technical support.",
      originalPrice: 899.99,
      discountedPrice: 539.99,
      discountPercentage: 40,
      shopName: "TechHub Electronics",
      location: "Tech Quarter, Building A",
      category: "Electronics",
      expiresAt: "2024-06-18",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=400&fit=crop&q=80",
      rating: 4.7,
      reviews: 89,
      isVerified: false,
      createdBy: "other@user.com",
      isClaimed: false,
      claimedBy: [],
    },
    {
      id: "5",
      title: "Gourmet Pizza - Buy 1 Get 1 Free",
      description:
        "Authentic Italian gourmet pizzas made with fresh ingredients. Perfect for family dinners and parties.",
      originalPrice: 24.99,
      discountedPrice: 12.5,
      discountPercentage: 50,
      shopName: "Mama Mia Pizzeria",
      location: "Little Italy District",
      category: "Food & Beverage",
      expiresAt: "2024-06-12",
      image:
        "https://images.unsplash.com/photo-1620374643762-9c0e91a22b10?w=500&h=400&fit=crop&q=80",
      rating: 4.5,
      reviews: 445,
      isVerified: true,
      createdBy: "other@user.com",
      isClaimed: false,
      claimedBy: [],
    },
    {
      id: "6",
      title: "Home Fitness Equipment Sale",
      description:
        "Professional grade fitness equipment for home use. Dumbbells, yoga mats, resistance bands and more.",
      originalPrice: 199.99,
      discountedPrice: 99.99,
      discountPercentage: 50,
      shopName: "FitLife Equipment",
      location: "Sports Complex, Unit 5",
      category: "Sports & Recreation",
      expiresAt: "2024-06-30",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop&q=80",
      rating: 4.4,
      reviews: 67,
      isVerified: true,
      createdBy: "other@user.com",
      isClaimed: false,
      claimedBy: [],
    },
    {
      id: "7",
      title: "Modern Sofa Set - 45% Off",
      description:
        "Upgrade your living room with this stylish and comfortable 5-seater sofa. Premium fabric and solid wood frame.",
      originalPrice: 799.99,
      discountedPrice: 439.99,
      discountPercentage: 45,
      shopName: "Comfort Living",
      location: "Home Street, Block C",
      category: "Home & Garden",
      expiresAt: "2024-06-22",
      image:
        "https://images.unsplash.com/photo-1713283391486-b92cda2562e8?w=500&h=400&fit=crop&q=80",
      rating: 4.6,
      reviews: 98,
      isVerified: true,
      createdBy: "other@user.com",
      isClaimed: false,
      claimedBy: [],
    },
    {
      id: "8",
      title: "Home Cleaning Services - Flat ₹999",
      description:
        "Full home deep cleaning by verified professionals. Eco-friendly products and 100% satisfaction guaranteed.",
      originalPrice: 1999,
      discountedPrice: 999,
      discountPercentage: 50,
      shopName: "SparkleClean",
      location: "Service Lane, Sector 15",
      category: "Services",
      expiresAt: "2024-06-28",
      image:
        "https://images.unsplash.com/photo-1686178827149-6d55c72d81df?w=500&h=400&fit=crop&q=80",
      rating: 4.7,
      reviews: 120,
      isVerified: true,
      createdBy: "other@user.com",
      isClaimed: false,
      claimedBy: [],
    },

    {
      id: "9",
      title: "Pet Grooming Kit - 60% Off",
      description:
        "All-in-one grooming kit for your pets. Includes clippers, combs, and nail trimmer.",
      originalPrice: 49.99,
      discountedPrice: 19.99,
      discountPercentage: 60,
      shopName: "Pawfect Pets",
      location: "Pet Avenue, Block D",
      category: "Other",
      expiresAt: "2024-06-19",
      image:
        "https://images.unsplash.com/photo-1728013309800-404df8c036b6?w=500&h=400&fit=crop&q=80",
      rating: 4.5,
      reviews: 132,
      isVerified: true,
      createdBy: "other@user.com",
      isClaimed: false,
      claimedBy: [],
    },
  ];

  const categories = [
    "Food & Beverage",
    "Fashion",
    "Electronics",
    "Health & Beauty",
    "Home & Garden",
    "Services",
    "Sports & Recreation",
    "Other",
  ];

  useEffect(() => {
    const shouldLockScroll =
      showLoginModal || showDealForm || showClaimModal || showMobileMenu;

    if (shouldLockScroll) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showLoginModal, showDealForm, showClaimModal, showMobileMenu]);

  useEffect(() => {
    setDeals(sampleDeals);
  }, []);

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setShowMobileMenu(false);
  };

  // Show message function
  const showMessage = useCallback(
    (msg: string, type: "success" | "error" = "success") => {
      setMessage(msg);
      setMessageType(type);
      setTimeout(() => setMessage(""), 4000);
    },
    []
  );

  // Newsletter signup
  const handleNewsletterSignup = () => {
    if (
      !newsletterEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)
    ) {
      showMessage("Please enter a valid email address", "error");
      return;
    }
    showMessage("🎉 Successfully subscribed to our newsletter!", "success");
    setNewsletterEmail("");
  };

  // Validation functions
  const validateLoginForm = (): boolean => {
    const errors: FormErrors = {};

    if (!loginForm.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!loginForm.password) {
      errors.password = "Password is required";
    } else if (loginForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateDealForm = (): boolean => {
    const errors: FormErrors = {};

    if (!dealForm.title.trim()) errors.title = "Title is required";
    if (!dealForm.description.trim())
      errors.description = "Description is required";
    if (!dealForm.shopName.trim()) errors.shopName = "Shop name is required";
    if (!dealForm.location.trim()) errors.location = "Location is required";
    if (!dealForm.category) errors.category = "Category is required";
    if (!dealForm.expiresAt) errors.expiresAt = "Expiration date is required";

    if (!dealForm.originalPrice) {
      errors.originalPrice = "Original price is required";
    } else if (parseFloat(dealForm.originalPrice) <= 0) {
      errors.originalPrice = "Original price must be greater than 0";
    }

    if (!dealForm.discountedPrice) {
      errors.discountedPrice = "Discounted price is required";
    } else if (parseFloat(dealForm.discountedPrice) <= 0) {
      errors.discountedPrice = "Discounted price must be greater than 0";
    } else if (
      parseFloat(dealForm.discountedPrice) >= parseFloat(dealForm.originalPrice)
    ) {
      errors.discountedPrice =
        "Discounted price must be less than original price";
    }

    if (dealForm.expiresAt && new Date(dealForm.expiresAt) <= new Date()) {
      errors.expiresAt = "Expiration date must be in the future";
    }

    setDealErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Login function
  const handleLogin = () => {
    if (!validateLoginForm()) {
      showMessage("Please fix the errors in the form", "error");
      return;
    }

    // Allow any user to login with valid email format and password
    setIsLoggedIn(true);
    setUser({
      email: loginForm.email,
      name: "Shop Owner", // Generic name or could be extracted from email
      shopName: "Local Shop", // Generic shop name
    });
    setShowLoginModal(false);
    setLoginForm({ email: "", password: "" });
    setLoginErrors({});
    showMessage("Welcome! Successfully logged in.", "success");
  };

  // Logout function
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setShowDealForm(false);
    showMessage("Successfully logged out. See you next time!", "success");
  };

  // Claim deal function
  const handleClaimDeal = (deal: Deal) => {
    if (!isLoggedIn) {
      showMessage("Please login to claim deals", "error");
      setShowLoginModal(true);
      return;
    }

    if (deal.createdBy === user?.email) {
      showMessage("You cannot claim your own deals", "error");
      return;
    }

    if (deal.claimedBy?.includes(user?.email || "")) {
      showMessage("You have already claimed this deal", "error");
      return;
    }

    setSelectedDeal(deal);
    setShowClaimModal(true);
  };

  const confirmClaimDeal = () => {
    if (selectedDeal && user) {
      const updatedDeals = deals.map((deal) => {
        if (deal.id === selectedDeal.id) {
          return {
            ...deal,
            isClaimed: true,
            claimedBy: [...(deal.claimedBy || []), user.email],
          };
        }
        return deal;
      });

      setDeals(updatedDeals);
      setShowClaimModal(false);
      setSelectedDeal(null);
      showMessage(
        "🎉 Deal claimed successfully! Enjoy your savings!",
        "success"
      );
    }
  };

  // Add deal function
  const handleAddDeal = () => {
    if (!validateDealForm()) {
      // showMessage('Please fix the errors in the form', 'error');
      return;
    }

    const originalPrice = parseFloat(dealForm.originalPrice);
    const discountedPrice = parseFloat(dealForm.discountedPrice);
    const discountPercentage = Math.round(
      ((originalPrice - discountedPrice) / originalPrice) * 100
    );

    const newDeal: Deal = {
      id: Date.now().toString(),
      title: dealForm.title.trim(),
      description: dealForm.description.trim(),
      originalPrice,
      discountedPrice,
      discountPercentage,
      shopName: dealForm.shopName.trim(),
      location: dealForm.location.trim(),
      category: dealForm.category,
      expiresAt: dealForm.expiresAt,
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=400&fit=crop&q=80",
      rating: 4.5,
      reviews: 0,
      isVerified: false,
      createdBy: user?.email,
      isClaimed: false,
      claimedBy: [],
    };

    setDeals([newDeal, ...deals]);
    setDealForm({
      title: "",
      description: "",
      originalPrice: "",
      discountedPrice: "",
      shopName: "",
      location: "",
      category: "",
      expiresAt: "",
    });
    setDealErrors({});
    setShowDealForm(false);
    showMessage(
      "🎉 Deal posted successfully! It will be reviewed shortly.",
      "success"
    );
  };

  // Sort and filter deals
  const sortedAndFilteredDeals = deals
    .filter((deal) => {
      const matchesSearch =
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory || deal.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "discount":
          return b.discountPercentage - a.discountPercentage;
        case "price-low":
          return a.discountedPrice - b.discountedPrice;
        case "price-high":
          return b.discountedPrice - a.discountedPrice;
        case "rating":
          return b.rating - a.rating;
        case "expiring":
          return (
            new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
          );
        default:
          return parseInt(b.id) - parseInt(a.id);
      }
    });

  return (
    <>
      <style>{`
       @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');

       body {
         font-family: 'Roboto', sans-serif;
       }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
        .animate-bounce-in {
          animation: fadeInScale 0.5s ease-out;
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .corporate-gradient {
            background: linear-gradient(
              135deg,
              #2563eb 0%,     /* blue-600 */
              #4f46e5 25%,    /* indigo-600 (optional blend) */
              #7c3aed 50%,    /* violet-600 */
              #9333ea 75%,    /* purple-600 */
              #9333ea 100%    /* purple-600 */
            );
          }
          
          .primary-gradient {
            background: linear-gradient(
              135deg,
              #2563eb 0%,     /* blue-600 */
              #4f46e5 50%,    /* indigo-600 */
              #9333ea 100%    /* purple-600 */
            );
          }
          
          .accent-gradient {
            background: linear-gradient(
              135deg,
              #2563eb 0%,     /* blue-600 */
              #3b82f6 50%,    /* blue-500 */
              #9333ea 100%    /* purple-600 */
            );
          }
          
        .professional-card {
          background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .glass-effect {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .hover-lift {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        @media (max-width: 320px) {
          .text-4xl { font-size: 1.875rem; line-height: 1.2; }
          .text-5xl { font-size: 2.25rem; line-height: 1.2; }
          .text-6xl { font-size: 2.5rem; line-height: 1.1; }
          .px-4 { padding-left: 0.75rem; padding-right: 0.75rem; }
          .py-6 { padding-top: 1.25rem; padding-bottom: 1.25rem; }
          .space-x-4 > * + * { margin-left: 0.75rem; }
          .space-y-4 > * + * { margin-top: 0.75rem; }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Message Toast */}
        {message && (
          <div
            className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-xl animate-bounce-in max-w-[300px] md:max-w-sm ${
              messageType === "success"
                ? "bg-orange-400 text-white"
                : "bg-red-600 text-white"
            }`}
            style={{ zIndex: 9999 }}
          >
            <div className="flex items-center space-x-2">
              {messageType === "success" ? (
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
              ) : (
                <X className="h-4 w-4 flex-shrink-0" />
              )}
              <span className="font-medium text-sm">{message}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="glass-effect shadow-lg border-b border-white/20 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <div className="corporate-gradient p-2 rounded-lg shadow-md">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <span className="text-md md:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    LDeals
                  </span>

                  <div className="text-xs text-gray-500 font-medium hidden sm:block">
                    Enterprise Marketplace
                  </div>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex space-x-8">
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-gray-700 hover:text-orange-400  transition-colors duration-200 font-medium border-b-2 border-transparent hover:border-orange-400  pb-1 cursor-pointer"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("deals")}
                  className="text-gray-700 hover:text-orange-400  transition-colors duration-200 font-medium border-b-2 border-transparent hover:border-orange-400  pb-1 cursor-pointer"
                >
                  Deals
                </button>
                <button
                  onClick={() => scrollToSection("categories")}
                  className="text-gray-700 hover:text-orange-400  transition-colors duration-200 font-medium border-b-2 border-transparent hover:border-orange-400  pb-1 cursor-pointer"
                >
                  Categories
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-gray-700 hover:text-orange-400  transition-colors duration-200 font-medium border-b-2 border-transparent hover:border-orange-400  pb-1 cursor-pointer"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-gray-700 hover:text-orange-400  transition-colors duration-200 font-medium border-b-2 border-transparent hover:border-orange-400  pb-1 cursor-pointer"
                >
                  About
                </button>
              </nav>

              {/* User Actions */}
              <div className="flex items-center space-x-3">
                {!isLoggedIn ? (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center space-x-2 corporate-gradient text-white px-4 py-2 rounded-lg hover:shadow-lg hover:opacity-90 transition-all duration-200 font-medium text-sm cursor-pointer"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">Business Login</span>
                    <span className="sm:hidden">Login</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowDealForm(true)}
                      className="flex items-center space-x-2 accent-gradient text-white px-2 md:px-4 py-1 md:py-2 rounded-lg hover:shadow-lg hover:opacity-90 transition-all duration-200 font-medium text-sm cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Post Deal</span>
                      <span className="sm:hidden">Post</span>
                    </button>
                    <div className="hidden sm:flex items-center space-x-2 professional-card px-3 py-2 rounded-lg border border-gray-200">
                      <User className="h-5 w-5 text-gray-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user?.shopName}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden sm:inline font-medium">
                        Logout
                      </span>
                    </button>
                  </div>
                )}

                {/* Mobile menu button */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                >
                  {showMobileMenu ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {showMobileMenu && (
              <div className="lg:hidden py-4 border-t border-white/20 animate-slide-up">
                <nav className="flex flex-col space-y-2">
                  <button
                    onClick={() => scrollToSection("home")}
                    className="text-gray-700 hover:text-orange-400  py-2 transition-colors duration-200 font-medium text-left cursor-pointer"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => scrollToSection("deals")}
                    className="text-gray-700 hover:text-orange-400  py-2 transition-colors duration-200 font-medium text-left cursor-pointer"
                  >
                    Deals
                  </button>
                  <button
                    onClick={() => scrollToSection("categories")}
                    className="text-gray-700 hover:text-orange-400  py-2 transition-colors duration-200 font-medium text-left cursor-pointer"
                  >
                    Categories
                  </button>
                  <button
                    onClick={() => scrollToSection("how-it-works")}
                    className="text-gray-700 hover:text-orange-400  py-2 transition-colors duration-200 font-medium text-left cursor-pointer"
                  >
                    How It Works
                  </button>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="text-gray-700 hover:text-orange-400  py-2 transition-colors duration-200 font-medium text-left cursor-pointer"
                  >
                    About
                  </button>
                  {isLoggedIn && (
                    <div className="sm:hidden pt-3 border-t border-white/20">
                      <div className="text-sm font-medium text-gray-900">
                        {user?.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user?.shopName}
                      </div>
                    </div>
                  )}
                </nav>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section
          id="home"
          className="corporate-gradient text-white relative overflow-hidden min-h-screen flex items-center"
        >
          <div className="absolute inset-0  bg-gradient-to-r from-blue-600 to-purple-600"></div>

          <div
            className="absolute bottom-20 right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "3s" }}
          ></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mb-6 border border-white/20">
                <Shield className="h-4 w-4 text-orange-400" />
                <span>Trusted by 10,000+ Local Businesses</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Discover Premium
                <br />
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                  Local Deals
                </span>
              </h1>

              <p className="text-lg sm:text-xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Connect with premium local businesses and unlock exclusive
                savings on products and services you love. Join the smartest
                marketplace community in your area.
              </p>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
                <div className="bg-white/10 backdrop-blur-sm text-white border border-white/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-400  mb-1">
                    500+
                  </div>
                  <div className="text-xs text-white font-medium">
                    Active Deals
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm text-white border border-white/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-400 mb-1">
                    50K+
                  </div>
                  <div className="text-xs text-white font-medium">
                    Happy Customers
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm text-white border border-white/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-400 mb-1">
                    1000+
                  </div>
                  <div className="text-xs text-white font-medium">
                    Local Partners
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm text-white border border-white/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-400 mb-1">
                    $5M+
                  </div>
                  <div className="text-xs text-white font-medium">
                    Total Savings
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => scrollToSection("deals")}
                  className="professional-card text-gray-900 px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:opacity-90 transition-all duration-300 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Explore Deals</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="border border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 hover:opacity-90 transition-all duration-300 backdrop-blur-sm cursor-pointer flex items-center justify-center space-x-2"
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>How It Works</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Search and Filter Section */}
        <section className="glass-effect -mt-10 relative z-10 mx-4 sm:mx-8 lg:mx-16 rounded-2xl shadow-xl border border-white/20">
          <div className="px-6 py-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Find Your Perfect Deal
                </h3>
                <p className="text-gray-600">
                  Search through hundreds of verified local offers
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search deals, shops, or products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300  focus:border-orange-300  transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="relative">
                    <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300  focus:border-orange-300  transition-all duration-200 appearance-none bg-white/80 backdrop-blur-sm shadow-sm cursor-pointer"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300  focus:border-orange-300  transition-all duration-200 appearance-none bg-white/80 backdrop-blur-sm shadow-sm cursor-pointer"
                    >
                      <option value="newest">Newest First</option>
                      <option value="discount">Highest Discount</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="expiring">Expiring Soon</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>

                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("");
                      setSortBy("newest");
                    }}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200 cursor-pointer shadow-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Deals Section */}
        <section
          id="deals"
          className="py-16 bg-gradient-to-b from-white to-gray-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                Premium Deals
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Handpicked deals from the most trusted local businesses. Quality
                guaranteed.
              </p>
            </div>

            {/* Results Counter */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center space-2 md:space-x-3 professional-card px-4 py-2 rounded-full">
                <span className="text-gray-700 font-medium">
                  Showing{" "}
                  <span className="text-orange-400  font-semibold">
                    {sortedAndFilteredDeals.length}
                  </span>{" "}
                  of{" "}
                  <span className="text-gray-900 font-semibold">
                    {deals.length}
                  </span>{" "}
                  deals
                </span>
                {selectedCategory && (
                  <span className="text-gray-500">in {selectedCategory}</span>
                )}
                {searchTerm && (
                  <span className="text-gray-500">matching "{searchTerm}"</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedAndFilteredDeals.map((deal, index) => {
                const isOwnDeal = deal.createdBy === user?.email;
                const isClaimed =
                  deal.claimedBy?.includes(user?.email || "") || false;

                return (
                  <div
                    key={deal.id}
                    className="professional-card rounded-xl overflow-hidden hover-lift animate-slide-up border border-gray-200 flex flex-col h-full"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative">
                      <img
                        src={deal.image}
                        alt={deal.title}
                        className="w-full h-48 object-cover"
                      />

                      {/* Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                      <div className="absolute top-3 left-3 accent-gradient text-white px-2 py-1 rounded-full text-sm font-semibold shadow-lg">
                        -{deal.discountPercentage}% OFF
                      </div>

                      {deal.isVerified && (
                        <div className="absolute top-3 right-3 bg-orange-400  text-white p-1.5 rounded-full shadow-lg">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                      )}

                      {isOwnDeal && (
                        <div className="absolute bottom-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                          Your Deal
                        </div>
                      )}

                      {isClaimed && (
                        <div className="absolute bottom-3 right-3 bg-orange-400 /90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                          ✓ Claimed
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight flex-1 mr-2 min-h-[3.5rem] flex items-start">
                          {deal.title}
                        </h3>
                        <div className="flex items-center space-x-1 flex-shrink-0 bg-amber-50 px-2 py-1 rounded-full">
                          <Star className="h-3 w-3 text-amber-400 fill-current" />
                          <span className="text-xs font-semibold text-amber-700">
                            {deal.rating}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 text-sm leading-relaxed min-h-[3rem] flex items-start">
                        {deal.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-bold text-orange-400 ">
                            ${deal.discountedPrice}
                          </span>
                          <span className="text-base text-gray-500 line-through">
                            ${deal.originalPrice}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {deal.reviews} reviews
                        </div>
                      </div>

                      <div className="space-y-2 mb-5 text-sm text-gray-600 flex-grow">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate font-medium">
                            {deal.shopName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span>
                            Expires{" "}
                            {new Date(deal.expiresAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <button
                          onClick={() => handleClaimDeal(deal)}
                          disabled={isOwnDeal || isClaimed}
                          className={`w-full py-3 px-4 rounded-lg transition-all duration-200 font-semibold cursor-pointer ${
                            isOwnDeal
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : isClaimed
                              ? "bg-orange-100 text-orange-700 cursor-not-allowed"
                              : "corporate-gradient text-white hover:shadow-lg hover:opacity-90"
                          }`}
                        >
                          {isOwnDeal
                            ? " Your Deal"
                            : isClaimed
                            ? "Already Claimed"
                            : " Claim Deal"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {sortedAndFilteredDeals.length === 0 && (
              <div className="text-center py-16">
                <div className="professional-card max-w-md mx-auto p-8 rounded-xl">
                  <div className="text-gray-400 mb-6">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    No deals found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search terms or category filter
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("");
                      setSortBy("newest");
                    }}
                    className="accent-gradient text-white px-4 py-2 rounded-lg font-medium cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Enhanced Categories Section */}
        <section
          id="categories"
          className="py-16 bg-gradient-to-br from-gray-100 via-white to-gray-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                Browse by Category
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Find exactly what you're looking for in our curated categories
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {categories.map((category) => {
                const categoryDeals = deals.filter(
                  (deal) => deal.category === category
                );

                // Define image URLs for each category
                const getCategoryImage = (category: any) => {
                  const imageMap = {
                    "Food & Beverage":
                      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=150&h=150&fit=crop&crop=center",
                    Fashion:
                      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=150&h=150&fit=crop&crop=center",
                    Electronics:
                      "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=150&h=150&fit=crop&crop=center",
                    "Health & Beauty":
                      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150&h=150&fit=crop&crop=center",
                    "Home & Garden":
                      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150&h=150&fit=crop&crop=center",
                    Services:
                      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=150&h=150&fit=crop&crop=center",
                    "Sports & Recreation":
                      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center",
                    Other:
                      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=150&h=150&fit=crop&crop=center",
                  };
                  return (
                    imageMap[category as keyof typeof imageMap] ||
                    imageMap["Other"]
                  );
                };

                return (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      scrollToSection("deals");
                    }}
                    className="professional-card p-5 rounded-xl hover-lift text-center group cursor-pointer border border-gray-200"
                  >
                    <div className="mb-4 group-hover:opacity-80 transition-all duration-300">
                      <img
                        src={getCategoryImage(category)}
                        alt={category}
                        className="w-12 h-12 mx-auto rounded-lg object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-orange-400 transition-colors duration-200">
                      {category}
                    </h3>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {categoryDeals.length} deals
                      </span>
                      <ArrowRight className="h-3 w-3 text-gray-400 group-hover:text-orange-300 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="py-16 corporate-gradient text-white relative overflow-hidden"
        >
          {/* <div className="absolute top-0 left-0 w-96 h-96 bg-orange-300 /10 rounded-full blur-3xl"></div> */}
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">How LDeals Works</h2>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                Simple, secure, and rewarding for everyone
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="professional-card w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:opacity-80 transition-all duration-300">
                  <Search className="h-8 w-8 text-orange-400 " />
                </div>
                <h3 className="text-2xl font-bold mb-3">1. Discover</h3>
                <p className="text-gray-200 leading-relaxed">
                  Browse through hundreds of verified deals from local
                  businesses in your area
                </p>
              </div>

              <div className="text-center group">
                <div className="professional-card w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:opacity-80 transition-all duration-300">
                  <Tag className="h-8 w-8 text-orange-400 " />
                </div>
                <h3 className="text-2xl font-bold mb-3">2. Claim</h3>
                <p className="text-gray-200 leading-relaxed">
                  Claim your favorite deals with one click and get instant
                  access to savings
                </p>
              </div>

              <div className="text-center group">
                <div className="professional-card w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:opacity-80 transition-all duration-300">
                  <Heart className="h-8 w-8 text-orange-400 " />
                </div>
                <h3 className="text-2xl font-bold mb-3">3. Enjoy</h3>
                <p className="text-gray-200 leading-relaxed">
                  Visit the business, show your claimed deal, and enjoy premium
                  products at discounted prices
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <button
                onClick={() => scrollToSection("deals")}
                className="professional-card text-gray-900 px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:opacity-90 transition-all duration-300 cursor-pointer inline-flex items-center space-x-2"
              >
                <span>Start Exploring</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gradient-to-br from-white via-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                What Our Community Says
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Real stories from real customers and businesses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="professional-card p-6 rounded-xl hover-lift border border-gray-200">
                <div className="flex items-center mb-4">
                  <Quote className="h-6 w-6 text-orange-400  mr-3" />
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 text-amber-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                  "LDeals has completely transformed how I discover local
                  businesses. I've saved over $500 this month alone!"
                </p>
                <div className="flex items-center">
                  <img
                    src="https://randomuser.me/api/portraits/women/68.jpg"
                    alt="Sarah Johnson"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      Sarah Johnson
                    </div>
                    <div className="text-gray-500 text-sm">
                      Regular Customer
                    </div>
                  </div>
                </div>
              </div>

              <div className="professional-card p-6 rounded-xl hover-lift border border-gray-200">
                <div className="flex items-center mb-4">
                  <Quote className="h-6 w-6 text-orange-400  mr-3" />
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 text-amber-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                  "As a business owner, LDeals has brought us 40% more
                  customers. The platform is incredibly easy to use!"
                </p>
                <div className="flex items-center">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face&q=80"
                    alt="Mike Chen"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Mike Chen</div>
                    <div className="text-gray-500 text-sm">
                      Restaurant Owner
                    </div>
                  </div>
                </div>
              </div>

              <div className="professional-card p-6 rounded-xl hover-lift border border-gray-200 md:col-span-2 lg:col-span-1">
                <div className="flex items-center mb-4">
                  <Quote className="h-6 w-6 text-orange-400  mr-3" />
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 text-amber-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                  "The quality of deals and businesses on LDeals is unmatched.
                  Every experience has been fantastic!"
                </p>
                <div className="flex items-center">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop&crop=face&q=80"
                    alt="Emily Rodriguez"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      Emily Rodriguez
                    </div>
                    <div className="text-gray-500 text-sm">Power User</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA Section */}
        <section className="py-16 accent-gradient text-white relative overflow-hidden">
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="  bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Never Miss a Deal
              </h2>
              <p className="text-xl text-orange-100 mb-6 leading-relaxed">
                Get exclusive deals, early access, and personalized
                recommendations delivered to your inbox.
              </p>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-white px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:outline-none"
                />
                <button
                  onClick={handleNewsletterSignup}
                  className="professional-card text-gray-900 px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:opacity-90 transition-all duration-300 cursor-pointer whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>

              <p className="text-orange-200 text-sm mt-4">
                Join 25,000+ subscribers • No spam, unsubscribe anytime
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center professional-card p-8 rounded-xl hover-lift border border-gray-200">
                <div className="accent-gradient w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Premium Deals
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Curated deals from the most trusted local businesses with
                  verified quality and authenticity
                </p>
              </div>

              <div className="text-center professional-card p-8 rounded-xl hover-lift border border-gray-200">
                <div className="primary-gradient w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Community First
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Building stronger local communities by connecting neighbors
                  with their favorite businesses
                </p>
              </div>

              <div className="text-center professional-card p-8 rounded-xl hover-lift border border-gray-200">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Trust & Quality
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Every business is verified and every deal is quality-checked
                  for your complete peace of mind
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer className="corporate-gradient text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-center mb-6">
                  <div className="accent-gradient p-2 rounded-lg shadow-lg">
                    <ShoppingBag className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <div className="ml-3">
                    <span className="text-2xl font-bold">LDeals</span>
                    <div className="text-sm text-gray-300">
                      Enterprise Marketplace
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Connecting premium local businesses with smart customers
                  through exclusive deals and authentic experiences. Building
                  stronger communities, one deal at a time.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="  bg-white/40 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                    <span className="text-2xl font-bold text-orange-300 ">
                      $5M+
                    </span>
                    <div className="text-sm text-gray-300">
                      Total Customer Savings
                    </div>
                  </div>
                  <div className="  bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                    <span className="text-2xl font-bold text-orange-300 ">
                      99.8%
                    </span>
                    <div className="text-sm text-gray-300">
                      Customer Satisfaction
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-6">Quick Links</h4>
                <ul className="space-y-3 text-gray-300">
                  <li>
                    <button
                      onClick={() => scrollToSection("home")}
                      className="hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                      Home
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("deals")}
                      className="hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                      Deals
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("categories")}
                      className="hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                      Categories
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("how-it-works")}
                      className="hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                      How It Works
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("about")}
                      className="hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                      About Us
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-6">For Businesses</h4>
                <ul className="space-y-3 text-gray-300">
                  <li>
                    <button className="hover:text-white transition-colors duration-200 cursor-pointer">
                      Post Deals
                    </button>
                  </li>
                  <li>
                    <button className="hover:text-white transition-colors duration-200 cursor-pointer">
                      Business Dashboard
                    </button>
                  </li>
                  <li>
                    <button className="hover:text-white transition-colors duration-200 cursor-pointer">
                      Analytics Suite
                    </button>
                  </li>
                  <li>
                    <button className="hover:text-white transition-colors duration-200 cursor-pointer">
                      Premium Support
                    </button>
                  </li>
                  <li>
                    <button className="hover:text-white transition-colors duration-200 cursor-pointer">
                      API Access
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/20 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-gray-300">
                  &copy; 2024 LDeals Enterprise. All rights reserved.
                </p>
                <div className="flex flex-wrap justify-center space-x-6">
                  <button className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">
                    Privacy Policy
                  </button>
                  <button className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">
                    Terms of Service
                  </button>
                  <button className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">
                    Cookie Policy
                  </button>
                  <button className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">
                    Security
                  </button>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="professional-card rounded-xl max-w-md w-full p-6 transform transition-all duration-300 scale-100 animate-bounce-in shadow-2xl border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Welcome Back
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Sign in to your business account
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    setLoginErrors({});
                  }}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => {
                      setLoginForm({ ...loginForm, email: e.target.value });
                      if (loginErrors.email)
                        setLoginErrors({ ...loginErrors, email: "" });
                    }}
                    className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-300  focus:border-orange-300  transition-all duration-200 ${
                      loginErrors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                  />
                  {loginErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {loginErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) => {
                        setLoginForm({
                          ...loginForm,
                          password: e.target.value,
                        });
                        if (loginErrors.password)
                          setLoginErrors({ ...loginErrors, password: "" });
                      }}
                      className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-300  focus:border-orange-300  transition-all duration-200 pr-10 ${
                        loginErrors.password
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors duration-200 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {loginErrors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {loginErrors.password}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleLogin}
                  className="w-full corporate-gradient text-white py-3 px-4 rounded-lg hover:shadow-lg hover:opacity-90 transition-all duration-200 font-semibold cursor-pointer"
                >
                  Sign In to Your Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Claim Modal */}
        {showClaimModal && selectedDeal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="professional-card rounded-xl w-full max-w-md sm:max-w-lg p-4 sm:p-6 transform transition-all duration-300 scale-100 animate-bounce-in shadow-2xl border border-gray-200 max-h-screen overflow-y-auto">
              <div className="text-center">
                <div className="accent-gradient p-3 rounded-full w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <Tag className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>

                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                  Claim This Deal
                </h2>

                <div className="professional-card bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 rounded-lg mb-6 border border-gray-200">
                  <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-3">
                    {selectedDeal.title}
                  </h3>

                  <div className="flex flex-wrap items-center justify-center gap-2 sm:space-x-3 mb-3">
                    <span className="text-2xl sm:text-3xl font-bold text-orange-400">
                      ${selectedDeal.discountedPrice}
                    </span>
                    <span className="text-lg sm:text-xl text-gray-500 line-through">
                      ${selectedDeal.originalPrice}
                    </span>
                    <span className="accent-gradient text-white px-2 py-1 rounded-full text-xs sm:text-sm font-semibold">
                      -{selectedDeal.discountPercentage}% OFF
                    </span>
                  </div>

                  <div className="text-gray-600 text-xs sm:text-sm space-y-1">
                    <div className="flex items-center justify-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">
                        {selectedDeal.shopName}
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        Expires{" "}
                        {new Date(selectedDeal.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-xs sm:text-sm mb-6 leading-relaxed px-1">
                  By claiming this deal, you agree to our terms and conditions.
                  Visit the business location and present your claimed deal to
                  redeem.
                </p>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => {
                      setShowClaimModal(false);
                      setSelectedDeal(null);
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmClaimDeal}
                    className="flex-1 corporate-gradient text-white py-3 px-4 rounded-lg hover:shadow-lg hover:opacity-90 transition-all duration-200 font-semibold cursor-pointer"
                  >
                    Claim Deal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Post Deal Modal */}
        {showDealForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="professional-card rounded-xl max-w-4xl w-full p-6 max-h-screen overflow-y-auto animate-bounce-in shadow-2xl border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Post New Deal
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Create an attractive deal for your customers
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowDealForm(false);
                    setDealErrors({});
                  }}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4 hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Deal Title *
                    </label>
                    <input
                      type="text"
                      value={dealForm.title}
                      onChange={(e) => {
                        setDealForm({ ...dealForm, title: e.target.value });
                        if (dealErrors.title)
                          setDealErrors({ ...dealErrors, title: "" });
                      }}
                      className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-300  focus:border-orange-300  transition-all duration-200 ${
                        dealErrors.title ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter an attractive deal title"
                    />
                    {dealErrors.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {dealErrors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Shop Name *
                    </label>
                    <input
                      type="text"
                      value={dealForm.shopName}
                      onChange={(e) => {
                        setDealForm({ ...dealForm, shopName: e.target.value });
                        if (dealErrors.shopName)
                          setDealErrors({ ...dealErrors, shopName: "" });
                      }}
                      className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-300  focus:border-orange-300  transition-all duration-200 ${
                        dealErrors.shopName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your shop name"
                    />
                    {dealErrors.shopName && (
                      <p className="text-red-500 text-sm mt-1">
                        {dealErrors.shopName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deal Description *
                  </label>
                  <textarea
                    rows={4}
                    value={dealForm.description}
                    onChange={(e) => {
                      setDealForm({ ...dealForm, description: e.target.value });
                      if (dealErrors.description)
                        setDealErrors({ ...dealErrors, description: "" });
                    }}
                    className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-300  focus:border-orange-300  transition-all duration-200 ${
                      dealErrors.description
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Describe your deal in detail to attract customers"
                  />
                  {dealErrors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {dealErrors.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Original Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={dealForm.originalPrice}
                      onChange={(e) => {
                        setDealForm({
                          ...dealForm,
                          originalPrice: e.target.value,
                        });
                        if (dealErrors.originalPrice)
                          setDealErrors({ ...dealErrors, originalPrice: "" });
                      }}
                      className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-300  focus:border-orange-300  transition-all duration-200 ${
                        dealErrors.originalPrice
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="0.00"
                    />
                    {dealErrors.originalPrice && (
                      <p className="text-red-500 text-sm mt-1">
                        {dealErrors.originalPrice}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Discounted Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={dealForm.discountedPrice}
                      onChange={(e) => {
                        setDealForm({
                          ...dealForm,
                          discountedPrice: e.target.value,
                        });
                        if (dealErrors.discountedPrice)
                          setDealErrors({ ...dealErrors, discountedPrice: "" });
                      }}
                      className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-300  focus:border-orange-300  transition-all duration-200 ${
                        dealErrors.discountedPrice
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="0.00"
                    />
                    {dealErrors.discountedPrice && (
                      <p className="text-red-500 text-sm mt-1">
                        {dealErrors.discountedPrice}
                      </p>
                    )}
                  </div>
                </div>

                {dealForm.originalPrice &&
                  dealForm.discountedPrice &&
                  parseFloat(dealForm.originalPrice) >
                    parseFloat(dealForm.discountedPrice) && (
                    <div className="bg-gradient-to-br from-orange-50 to-teal-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <CheckCircle className="h-5 w-5 text-orange-400 " />
                        <span className="text-orange-800 font-semibold">
                          {Math.round(
                            ((parseFloat(dealForm.originalPrice) -
                              parseFloat(dealForm.discountedPrice)) /
                              parseFloat(dealForm.originalPrice)) *
                              100
                          )}
                          % Discount
                        </span>
                      </div>
                      <p className="text-orange-700 text-sm">
                        Customers save{" "}
                        <span className="font-semibold">
                          $
                          {(
                            parseFloat(dealForm.originalPrice) -
                            parseFloat(dealForm.discountedPrice)
                          ).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={dealForm.location}
                      onChange={(e) => {
                        setDealForm({ ...dealForm, location: e.target.value });
                        if (dealErrors.location)
                          setDealErrors({ ...dealErrors, location: "" });
                      }}
                      className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-300  focus:border-orange-300  transition-all duration-200 ${
                        dealErrors.location
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter shop location/address"
                    />
                    {dealErrors.location && (
                      <p className="text-red-500 text-sm mt-1">
                        {dealErrors.location}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={dealForm.category}
                      onChange={(e) => {
                        setDealForm({ ...dealForm, category: e.target.value });
                        if (dealErrors.category)
                          setDealErrors({ ...dealErrors, category: "" });
                      }}
                      className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-300  focus:border-orange-300  transition-all duration-200 cursor-pointer ${
                        dealErrors.category
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {dealErrors.category && (
                      <p className="text-red-500 text-sm mt-1">
                        {dealErrors.category}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deal Expires On *
                  </label>
                  <input
                    type="date"
                    value={dealForm.expiresAt}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      setDealForm({ ...dealForm, expiresAt: e.target.value });
                      if (dealErrors.expiresAt)
                        setDealErrors({ ...dealErrors, expiresAt: "" });
                    }}
                    className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-300  focus:border-orange-300  transition-all duration-200 cursor-pointer ${
                      dealErrors.expiresAt
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {dealErrors.expiresAt && (
                    <p className="text-red-500 text-sm mt-1">
                      {dealErrors.expiresAt}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <button
                    onClick={() => {
                      setShowDealForm(false);
                      setDealErrors({});
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddDeal}
                    className="flex-1 corporate-gradient text-white py-3 px-6 rounded-lg hover:shadow-lg hover:opacity-90 transition-all duration-200 font-semibold cursor-pointer"
                  >
                    Post Deal
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Deal Title *
                    </label>
                    <input
                      type="text"
                      value={dealForm.title}
                      onChange={(e) => {
                        setDealForm({ ...dealForm, title: e.target.value });
                        if (dealErrors.title)
                          setDealErrors({ ...dealErrors, title: "" });
                      }}
                      className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-300  focus:border-orange-300  transition-all duration-200 ${
                        dealErrors.title ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter an attractive deal title"
                    />
                    {dealErrors.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {dealErrors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Shop Name *
                    </label>
                    <input
                      type="text"
                      value={dealForm.shopName}
                      onChange={(e) => {
                        setDealForm({ ...dealForm, shopName: e.target.value });
                        if (dealErrors.shopName)
                          setDealErrors({ ...dealErrors, shopName: "" });
                      }}
                      className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-300  focus:border-orange-300  transition-all duration-200 ${
                        dealErrors.shopName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your shop name"
                    />
                    {dealErrors.shopName && (
                      <p className="text-red-500 text-sm mt-1">
                        {dealErrors.shopName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deal Description *
                  </label>
                  <textarea
                    rows={4}
                    value={dealForm.description}
                    onChange={(e) => {
                      setDealForm({ ...dealForm, description: e.target.value });
                      if (dealErrors.description)
                        setDealErrors({ ...dealErrors, description: "" });
                    }}
                    className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-300  focus:border-orange-300  transition-all duration-200 ${
                      dealErrors.description
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Describe your deal in detail to attract customers"
                  />
                  {dealErrors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {dealErrors.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Original Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={dealForm.originalPrice}
                      onChange={(e) => {
                        setDealForm({
                          ...dealForm,
                          originalPrice: e.target.value,
                        });
                        if (dealErrors.originalPrice)
                          setDealErrors({ ...dealErrors, originalPrice: "" });
                      }}
                      className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-300  focus:border-orange-300  transition-all duration-200 ${
                        dealErrors.originalPrice
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="0.00"
                    />
                    {dealErrors.originalPrice && (
                      <p className="text-red-500 text-sm mt-1">
                        {dealErrors.originalPrice}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Discounted Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={dealForm.discountedPrice}
                      onChange={(e) => {
                        setDealForm({
                          ...dealForm,
                          discountedPrice: e.target.value,
                        });
                        if (dealErrors.discountedPrice)
                          setDealErrors({ ...dealErrors, discountedPrice: "" });
                      }}
                      className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-300  focus:border-orange-300  transition-all duration-200 ${
                        dealErrors.discountedPrice
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="0.00"
                    />
                    {dealErrors.discountedPrice && (
                      <p className="text-red-500 text-sm mt-1">
                        {dealErrors.discountedPrice}
                      </p>
                    )}
                  </div>
                </div>

                {dealForm.originalPrice &&
                  dealForm.discountedPrice &&
                  parseFloat(dealForm.originalPrice) >
                    parseFloat(dealForm.discountedPrice) && (
                    <div className="bg-gradient-to-br from-orange-50 to-teal-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <CheckCircle className="h-5 w-5 text-orange-400 " />
                        <span className="text-orange-800 font-semibold">
                          {Math.round(
                            ((parseFloat(dealForm.originalPrice) -
                              parseFloat(dealForm.discountedPrice)) /
                              parseFloat(dealForm.originalPrice)) *
                              100
                          )}
                          % Discount
                        </span>
                      </div>
                      <p className="text-orange-700 text-sm">
                        Customers save{" "}
                        <span className="font-semibold">
                          $
                          {(
                            parseFloat(dealForm.originalPrice) -
                            parseFloat(dealForm.discountedPrice)
                          ).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={dealForm.location}
                      onChange={(e) => {
                        setDealForm({ ...dealForm, location: e.target.value });
                        if (dealErrors.location)
                          setDealErrors({ ...dealErrors, location: "" });
                      }}
                      className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-300  focus:border-orange-300  transition-all duration-200 ${
                        dealErrors.location
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter shop location/address"
                    />
                    {dealErrors.location && (
                      <p className="text-red-500 text-sm mt-1">
                        {dealErrors.location}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={dealForm.category}
                      onChange={(e) => {
                        setDealForm({ ...dealForm, category: e.target.value });
                        if (dealErrors.category)
                          setDealErrors({ ...dealErrors, category: "" });
                      }}
                      className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-300  focus:border-orange-300  transition-all duration-200 cursor-pointer ${
                        dealErrors.category
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {dealErrors.category && (
                      <p className="text-red-500 text-sm mt-1">
                        {dealErrors.category}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deal Expires On *
                  </label>
                  <input
                    type="date"
                    value={dealForm.expiresAt}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      setDealForm({ ...dealForm, expiresAt: e.target.value });
                      if (dealErrors.expiresAt)
                        setDealErrors({ ...dealErrors, expiresAt: "" });
                    }}
                    className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-300  focus:border-orange-300  transition-all duration-200 cursor-pointer ${
                      dealErrors.expiresAt
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {dealErrors.expiresAt && (
                    <p className="text-red-500 text-sm mt-1">
                      {dealErrors.expiresAt}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <button
                    onClick={() => {
                      setShowDealForm(false);
                      setDealErrors({});
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddDeal}
                    className="flex-1 corporate-gradient text-white py-3 px-6 rounded-lg hover:shadow-lg hover:opacity-90 transition-all duration-200 font-semibold cursor-pointer"
                  >
                    Post Deal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LocalDeals;

// Zod Schema
export const Schema = {
    "commentary": "",
    "template": "nextjs-developer",
    "title": "",
    "description": "",
    "additional_dependencies": ["lucide-react"],
    "has_additional_dependencies": true,
    "install_dependencies_command": "npm i lucide-react",
    "port": 3000,
    "file_path": "pages/index.tsx",
    "code": "<see code above>"
}