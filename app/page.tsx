"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Heart, Menu, User, Sun, Moon, MapPin, Star, X, Calendar,
  Users, Gift, Globe, Phone, Mail, ChevronLeft, ChevronRight,
  LogIn, UserPlus, Coffee, Wifi, Tv, Car, Wind, DollarSign, Shield,
  Flag, Newspaper, Lightbulb, Briefcase, Lock, MessageCircle,
  FileText, Map, Check, Waves, Bed, Droplet, Sparkles, Award,
  Compass, TrendingUp, Zap, ThumbsUp, Info
} from "lucide-react";

import { FaHome, FaFacebook, FaGoogle, FaApple, FaBook } from "react-icons/fa";
// Import Inter font for a more modern look
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [selectedListing, setSelectedListing] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingStatus, setBookingStatus] = useState<null | "success" | "error">(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);
  const [showAllProperties, setShowAllProperties] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    avatar: "https://ui-avatars.com/api/?background=random"
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    show: false,
    message: '',
    type: 'info'
  });

  // New state for form validation
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [formSuccess, setFormSuccess] = useState("");
  const [authFormData, setAuthFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [bookingFormData, setBookingFormData] = useState({
    checkin: "",
    checkout: "",
    guests: "1",
    name: "",
    email: "",
    phone: "",
    notes: ""
  });

  // Add state for offer modal and selected offer
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<null | {
    title: string;
    description: string;
    image: string;
    offerLabel: string;
    offerColor: string;
    relatedListingId: number;
  }>(null);

  useEffect(() => {
    // Check for system preference
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Check localStorage or use system preference
    const savedTheme = localStorage.getItem("theme") || (systemPrefersDark ? "dark" : "light");
    setTheme(savedTheme);

    // Apply theme to document
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(savedTheme);

    const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(savedFavorites);

    // Enable smooth scroll globally
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  // Add event listener to handle clicks outside the user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserMenu && !target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
  };

  const toggleFavorite = (id: number) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];

    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearSearch = () => {
    setSearchValue("");
  };

  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const openListingDetail = (id: number) => {
    setSelectedListing(id);
    setCurrentImageIndex(0);
  };

  const closeListingDetail = () => {
    setSelectedListing(null);
  };

  const nextImage = () => {
    if (!selectedListing) return;
    const listing = listings.find(l => l.id === selectedListing);
    if (!listing) return;
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  const prevImage = () => {
    if (!selectedListing) return;
    const listing = listings.find(l => l.id === selectedListing);
    if (!listing) return;
    setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  // Add new function for booking
  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate booking process
    const isSuccess = Math.random() > 0.3; // 70% success rate

    setBookingStatus(isSuccess ? "success" : "error");
  };

  const listings = [
    {
      id: 1,
      title: "Modern Beachfront Villa",
      location: "Malibu, California",
      price: 350,
      rating: 4.9,
      reviews: 128,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",

      ],
      description: "Experience the ultimate luxury beachfront villa with breathtaking ocean views. This spacious property features 4 bedrooms, a private pool, and direct beach access.",
      amenities: ["Pool", "WiFi", "Kitchen", "Beach access", "Air conditioning", "Parking"],
      type: "Beach",
      guests: 8,
      bedrooms: 4,
      beds: 5,
      baths: 3.5
    },
    {
      id: 2,
      title: "Cozy Mountain Cabin",
      location: "Aspen, Colorado",
      price: 225,
      rating: 4.8,
      reviews: 95,
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1265&q=80",
      images: [
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1265&q=80",

      ],
      description: "Nestled in the heart of the mountains, this charming cabin offers a perfect retreat for those seeking tranquility and natural beauty. Enjoy breathtaking views and cozy evenings by the fireplace.",
      amenities: ["Fireplace", "WiFi", "Hot tub", "Kitchen", "Heating", "Mountain view"],
      type: "Mountain",
      guests: 4,
      bedrooms: 2,
      beds: 3,
      baths: 2
    },
    {
      id: 3,
      title: "Urban Loft Apartment",
      location: "New York City, NY",
      price: 280,
      rating: 4.7,
      reviews: 112,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",

      ],
      description: "This stylish loft in the heart of NYC offers the perfect urban getaway. Featuring exposed brick walls, high ceilings, and modern furnishings, it's just steps away from popular restaurants and attractions.",
      amenities: ["WiFi", "Cable TV", "Kitchen", "Washer/Dryer", "Air conditioning", "Elevator"],
      type: "City",
      guests: 2,
      bedrooms: 1,
      beds: 1,
      baths: 1
    },
    {
      id: 4,
      title: "Lakefront Retreat",
      location: "Lake Tahoe, Nevada",
      price: 295,
      rating: 4.9,
      reviews: 87,
      image: "https://images.unsplash.com/photo-1464146072230-91cabc968266?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      images: [
        "https://images.unsplash.com/photo-1464146072230-91cabc968266?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",

      ],
      description: "Unwind at this peaceful lakefront property with stunning views of Lake Tahoe. Enjoy your morning coffee on the deck overlooking the water or take a short walk to the private beach.",
      amenities: ["Lake view", "Private beach", "Fireplace", "Boat dock", "BBQ grill", "WiFi"],
      type: "Lake",
      guests: 6,
      bedrooms: 3,
      beds: 4,
      baths: 2
    },
    {
      id: 5,
      title: "Tropical Island Bungalow",
      location: "Maui, Hawaii",
      price: 420,
      rating: 5.0,
      reviews: 152,
      image: "https://images.unsplash.com/photo-1552873547-b88e7b2760e2?q=80&w=2070&auto=format&fit=crop&q=80",
      images: [
        "https://images.unsplash.com/photo-1552873547-b88e7b2760e2?q=80&w=2070&auto=format&fit=crop&q=80",

      ],
      description: "Paradise awaits at this luxurious Hawaiian bungalow. With direct beach access and breathtaking ocean views, this property offers the ultimate tropical getaway experience.",
      amenities: ["Ocean view", "Beach access", "Pool", "Air conditioning", "WiFi", "Outdoor shower"],
      type: "Beach",
      guests: 4,
      bedrooms: 2,
      beds: 2,
      baths: 2.5
    },
    {
      id: 6,
      title: "Countryside Villa",
      location: "Tuscany, Italy",
      price: 310,
      rating: 4.8,
      reviews: 79,
      image: "https://images.unsplash.com/photo-1542928658-22251e208ac1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      images: [
        "https://images.unsplash.com/photo-1542928658-22251e208ac1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",

      ],
      description: "Experience the authentic Italian lifestyle in this stunning Tuscan villa surrounded by vineyards and olive groves. Enjoy panoramic countryside views and savor the local cuisine.",
      amenities: ["Vineyard view", "Pool", "Wine cellar", "Garden", "Fireplace", "WiFi"],
      type: "Countryside",
      guests: 10,
      bedrooms: 5,
      beds: 7,
      baths: 4
    },
  ];

  const filters = ["All", "Beach", "Mountain", "City", "Lake", "Countryside"];

  // Filter listings based on both category and search term
  const filteredListings = listings
    .filter(listing => activeFilter === "All" || listing.type === activeFilter)
    .filter(listing =>
      searchValue === "" ||
      listing.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchValue.toLowerCase()) ||
      listing.type.toLowerCase().includes(searchValue.toLowerCase())
    );

  const selectedListingData = selectedListing ? listings.find(listing => listing.id === selectedListing) : null;

  // New functions for form handling
  const handleAuthInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAuthFormData({
      ...authFormData,
      [id]: value
    });

    // Clear error when user types
    if (formErrors[id]) {
      setFormErrors({
        ...formErrors,
        [id]: ""
      });
    }
  };

  const handleBookingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setBookingFormData({
      ...bookingFormData,
      [id]: value
    });

    // Clear error when user types
    if (formErrors[id]) {
      setFormErrors({
        ...formErrors,
        [id]: ""
      });
    }
  };

  const validateAuthForm = () => {
    let errors: { [key: string]: string } = {};
    let isValid = true;

    if (authMode === "signup" && !authFormData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!authFormData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(authFormData.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    if (!authFormData.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (authFormData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const validateBookingForm = () => {
    let errors: { [key: string]: string } = {};
    let isValid = true;

    if (!bookingFormData.checkin) {
      errors.checkin = "Check-in date is required";
      isValid = false;
    }

    if (!bookingFormData.checkout) {
      errors.checkout = "Check-out date is required";
      isValid = false;
    }

    // Add validation for dates
    if (bookingFormData.checkin && bookingFormData.checkout) {
      const checkinDate = new Date(bookingFormData.checkin);
      const checkoutDate = new Date(bookingFormData.checkout);
      
      // Make sure checkout is after checkin
      if (checkoutDate <= checkinDate) {
        errors.checkout = "Check-out date must be after check-in date";
        isValid = false;
      }
      
      // Make sure checkin is not in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (checkinDate < today) {
        errors.checkin = "Check-in date cannot be in the past";
        isValid = false;
      }
    }

    if (!bookingFormData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!bookingFormData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(bookingFormData.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    if (!bookingFormData.phone.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(bookingFormData.phone)) {
      errors.phone = "Phone number is invalid";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess("");

    if (validateAuthForm()) {
      // Simulate auth success (would call API in real app)
      setTimeout(() => {
        setFormSuccess(authMode === "login" ? "Login successful!" : "Account created successfully!");
        
        // On successful authentication
        setIsAuthenticated(true);
        setUserProfile({
          name: authFormData.name || "User",
          email: authFormData.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authFormData.name || authFormData.email)}&background=random`
        });
        
        // Clear form after success
        setTimeout(() => {
          setShowAuthModal(false);
          setFormSuccess("");
          setAuthFormData({
            name: "",
            email: "",
            password: ""
          });
        }, 2000);
      }, 1000);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess("");

    if (validateBookingForm()) {
      // Simulate booking process
      setTimeout(() => {
        const isSuccess = Math.random() > 0.3; // 70% success rate
        setBookingStatus(isSuccess ? "success" : "error");

        if (isSuccess) {
          // Reset form on success
          setBookingFormData({
            checkin: "",
            checkout: "",
            guests: "1",
            name: "",
            email: "",
            phone: "",
            notes: ""
          });
        }
      }, 1000);
    }
  };

  // Add offer data (can be moved to a better place if needed)
  const specialOffers = [
    {
      title: 'Summer Escape Deal',
      description: 'Book a beach property for 5+ nights and receive a 20% discount. Enjoy the sun, sand, and exclusive amenities at our top-rated beachfront villas.',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      offerLabel: '20% OFF',
      offerColor: 'bg-rose-600',
      relatedListingId: 1,
    },
    {
      title: 'Luxury Retreat Package',
      description: 'Book a luxury property and receive a complimentary room upgrade. Experience the best in comfort and style at our premium listings.',
      image: 'https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      offerLabel: 'FREE UPGRADE',
      offerColor: 'bg-indigo-600',
      relatedListingId: 3,
    },
  ];

  // Smooth scroll handler for menu links
  const handleMenuClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    const el = document.querySelector(target);
    if (el) {
      const yOffset = -150;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({
      show: true,
      message,
      type
    });

    // Auto hide toast after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Function to handle social login buttons
  const handleSocialLogin = (provider: string) => {
    showToast(`${provider} login is not available at this time`, 'info');
  };

  return (
    <div className={`min-h-screen ${inter.variable} font-sans ${theme === "dark" ? "dark bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"} transition-colors duration-200`}>
      <header className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-gray-200'} backdrop-blur-md shadow-sm border-b`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`font-bold text-2xl mr-2 tracking-tight ${theme === 'dark' ? 'text-rose-500' : 'text-rose-600'}`}
            >
              StayAway
              <span className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}>.</span>
            </motion.div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <a href="#popular" onClick={e => handleMenuClick(e, '#popular')} className={`font-medium transition ${theme === 'dark' ? 'text-gray-300 hover:text-rose-500' : 'text-gray-800 hover:text-rose-600'}`}>
              Popular
            </a>

            <a href="#recommended" onClick={e => handleMenuClick(e, '#recommended')} className={`font-medium transition ${theme === 'dark' ? 'text-gray-300 hover:text-rose-500' : 'text-gray-800 hover:text-rose-600'}`}>
              Recommended
            </a>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800 ' : 'text-gray-700 hover:bg-gray-100 '}`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {isAuthenticated ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="relative flex items-center focus:outline-none"
                  aria-label="User menu"
                >
                  <img 
                    src={userProfile.avatar} 
                    alt="User avatar" 
                    className="w-10 h-10 rounded-full border-2 border-rose-500" 
                  />
                </button>
                
                {showUserMenu && (
                  <div className={`absolute right-0 mt-2 w-48 py-2 rounded-lg shadow-lg z-50 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                    <div className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-800'}`}>
                      <p className="font-medium text-sm">{userProfile.name}</p>
                      <p className="text-xs truncate">{userProfile.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsAuthenticated(false);
                        setUserProfile({
                          name: "",
                          email: "",
                          avatar: "https://ui-avatars.com/api/?background=random"
                        });
                        setShowUserMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'}`}
                    >
                      <LogIn className="inline-block mr-2 w-4 h-4 rotate-180" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal("login")}
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-full font-medium transition"
              >
                Sign in
              </button>
            )}
          </div>

          <button
            className={`md:hidden ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className={`relative bg-gradient-to-br ${theme === 'dark' ? 'from-gray-900 to-gray-800' : 'from-indigo-100 to-rose-100'} pt-16 pb-24 px-4`}>
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4 leading-tight`}>
              Find Your Perfect <span className={theme === 'dark' ? 'text-rose-500' : 'text-rose-600'}>Stay</span>
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} max-w-2xl mx-auto`}>
              Discover amazing places to stay around the world, with exclusive deals and personalized recommendations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-2xl shadow-lg max-w-4xl mx-auto`}
          >
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Where</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Destination, city, or property"
                    className={`w-full py-3 pl-10 pr-3 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-rose-500`}
                  />
                  <MapPin size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Check-in / Check-out</label>
                <div className="relative">
                  <input
                    type="date"
                    placeholder="Add dates"
                    className={`w-full py-3 pl-10 pr-3 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-rose-500`}
                  />
                  <Calendar size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </div>
            </form>
          </motion.div>
        </div>

        <div className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t ${theme === 'dark' ? 'from-gray-950' : 'from-gray-50'} to-transparent`}></div>
      </section>

      {/* Filter bar */}
      <div className={`sticky top-16 z-40 shadow-sm border-b ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="container mx-auto px-4 py-3">
          <div className="overflow-x-auto hide-scrollbar p-1">
            <div className="flex space-x-4">
              {filters.map((filter) => (
                <motion.button
                  key={filter}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${activeFilter === filter
                    ? 'bg-rose-600 text-white'
                    : theme === 'dark'
                      ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  {filter === "All" && <Compass size={16} className="mr-2" />}
                  {filter === "Beach" && <Waves size={16} className="mr-2" />}
                  {filter === "Mountain" && <TrendingUp size={16} className="mr-2" />}
                  {filter === "City" && <FaHome size={16} className="mr-2" />}
                  {filter === "Lake" && <Droplet size={16} className="mr-2" />}
                  {filter === "Countryside" && <Wind size={16} className="mr-2" />}
                  {filter}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 min-h-screen">
        {/* Popular Properties Section */}
        <section id="popular" className="mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div className="flex-column items-center mb-2 sm:mb-0">
              <h2 className={`text-2xl font-bold mb-1 flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <Star className="mr-2 text-yellow-500" size={24} />
                Popular Properties
              </h2>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Most booked properties this month</p>
            </div>
            <button 
              onClick={() => {
                setSearchValue("");
                setActiveFilter("All");
                setShowAllProperties(true);
                // Scroll to all properties section
                const allPropertiesSection = document.getElementById('all-properties');
                if (allPropertiesSection) {
                  allPropertiesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`font-medium hover:underline flex items-center ${theme === 'dark' ? 'text-rose-500' : 'text-rose-600'}`}
            >
              View all <ChevronRight size={16} className="ml-1" />
            </button>
          </div>

          {filteredListings.length === 0 && activeFilter !== "All" ? (
            <div className={`rounded-xl p-6 border text-center mx-auto w-16 h-16 mb-4 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-rose-900' : 'bg-rose-100'}`}>
                <X size={24} className={theme === 'dark' ? 'text-rose-400' : 'text-rose-600'} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>No {activeFilter} Properties</h3>
              <p className={theme === 'dark' ? 'text-gray-400 mb-4' : 'text-gray-600 mb-4'}>
                We couldn't find any {activeFilter.toLowerCase()} properties. Try another category or check back later.
              </p>
              <button
                onClick={() => setActiveFilter("All")}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
              >
                View All Properties
              </button>
            </div>
          ) : (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`}>
              {filteredListings.slice(0, 4).map((listing) => (
                <motion.div
                  key={listing.id}
                  whileHover={{ y: -5 }}
                  className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border cursor-pointer group ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                  onClick={() => openListingDetail(listing.id)}
                >
                  <div className="relative">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 z-10 flex flex-col space-y-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(listing.id);
                        }}
                        className="p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition"
                        aria-label="Add to favorites"
                      >
                        <Heart
                          size={18}
                          className={favorites.includes(listing.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}
                        />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4">
                      <div className="flex items-center">
                        <Star size={14} className="text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{listing.rating} · {listing.reviews} reviews</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{listing.title}</h3>
                    <div className={`flex items-center text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      <MapPin size={14} className="mr-1 flex-shrink-0" />
                      <span className="truncate">{listing.location}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {listing.amenities.slice(0, 3).map((amenity, i) => (
                        <span key={i} className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>{amenity}</span>
                      ))}
                      {listing.amenities.length > 3 && (
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          +{listing.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${listing.price}</span>
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}> / night</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedListingId(listing.id);
                          setShowBookingModal(true);
                        }}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                      >
                        Book now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>



        {/* Recommended Properties Section */}
        <section id="recommended" className="mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div className="flex-column items-center mb-2 sm:mb-0">
              <h2 className={`text-2xl font-bold mb-1 flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <ThumbsUp className="mr-2 text-indigo-500" size={24} />
                Recommended For You
              </h2>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Personalized suggestions based on your preferences</p>
            </div>
            <button 
              onClick={() => {
                setSearchValue("");
                setActiveFilter("All");
                setShowAllProperties(true);
                // Scroll to all properties section
                const allPropertiesSection = document.getElementById('all-properties');
                if (allPropertiesSection) {
                  allPropertiesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`font-medium hover:underline flex items-center ${theme === 'dark' ? 'text-rose-500' : 'text-rose-600'}`}
            >
              View all <ChevronRight size={16} className="ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.slice(1, 5).map((listing) => (
              <motion.div
                key={listing.id}
                whileHover={{ y: -5 }}
                className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border cursor-pointer group ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                onClick={() => openListingDetail(listing.id)}
              >
                <div className="relative">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 z-10 flex flex-col space-y-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(listing.id);
                      }}
                      className="p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition"
                      aria-label="Add to favorites"
                    >
                      <Heart
                        size={18}
                        className={favorites.includes(listing.id) ? "fill-rose-500 text-rose-500" : "text-gray-600"}
                      />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4">
                    <div className="flex items-center">
                      <Star size={14} className="text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{listing.rating} · {listing.reviews} reviews</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{listing.title}</h3>
                  <div className={`flex items-center text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <MapPin size={14} className="mr-1 flex-shrink-0" />
                    <span className="truncate">{listing.location}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {listing.amenities.slice(0, 3).map((amenity, i) => (
                      <span key={i} className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>{amenity}</span>
                    ))}
                    {listing.amenities.length > 3 && (
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        +{listing.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${listing.price}</span>
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}> / night</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedListingId(listing.id);
                        setShowBookingModal(true);
                      }}
                      className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                    >
                      Book now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* "All Properties" Section - show when search/filter is active */}
        <section id="all-properties" className="mb-16">
          {(searchValue || activeFilter !== "All" || showAllProperties) && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {searchValue ? `Search results for "${searchValue}"` :
                      activeFilter !== "All" ? `${activeFilter} properties` :
                        "All properties"}
                  </h2>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    {filteredListings.length} {filteredListings.length === 1 ? 'property' : 'properties'} found
                  </p>
                </div>
                {(searchValue || activeFilter !== "All" || showAllProperties) && (
                  <button
                    onClick={() => {
                      setSearchValue("");
                      setActiveFilter("All");
                      setShowAllProperties(false);
                    }}
                    className={`font-medium hover:underline flex items-center ${theme === 'dark' ? 'text-rose-500' : 'text-rose-600'}`}
                  >
                    Clear filters <X size={16} className="ml-1" />
                  </button>
                )}
              </div>

              {filteredListings.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`flex flex-col items-center justify-center py-16 px-4 rounded-xl border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                >
                  <img
                    src="https://illustrations.popsy.co/gray/digital-nomad.svg"
                    alt="No results"
                    className={`w-64 h-64 mb-6 ${theme === 'dark' ? 'invert' : ''}`}
                  />
                  <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>No properties found</h3>
                  <p className={`mb-6 text-center max-w-md ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    We couldn't find any properties matching your search criteria. Try adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={() => {
                      setSearchValue("");
                      setActiveFilter("All");
                      setShowAllProperties(false);
                    }}
                    className="px-6 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition flex items-center"
                  >
                    <X size={16} className="mr-2" />
                    Clear filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {filteredListings.map((listing) => (
                    <motion.div
                      key={listing.id}
                      whileHover={{ y: -5 }}
                      className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border cursor-pointer group ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                      onClick={() => openListingDetail(listing.id)}
                    >
                      <div className="relative">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 right-3 z-10 flex flex-col space-y-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(listing.id);
                            }}
                            className="p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition"
                            aria-label="Add to favorites"
                          >
                            <Heart
                              size={18}
                              className={favorites.includes(listing.id) ? "fill-rose-500 text-rose-500" : "text-gray-600"}
                            />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4">
                          <div className="flex items-center">
                            <Star size={14} className="text-yellow-400 mr-1" />
                            <span className="text-sm font-medium">{listing.rating} · {listing.reviews} reviews</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{listing.title}</h3>
                        <div className={`flex items-center text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          <MapPin size={14} className="mr-1 flex-shrink-0" />
                          <span className="truncate">{listing.location}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {listing.amenities.slice(0, 3).map((amenity, i) => (
                            <span key={i} className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
                              {amenity}
                            </span>
                          ))}
                          {listing.amenities.length > 3 && (
                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              +{listing.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${listing.price}</span>
                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}> / night</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedListingId(listing.id);
                              setShowBookingModal(true);
                            }}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                          >
                            Book now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </section>
      </main>

      <footer className={`py-16 border-t ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className={`font-bold text-2xl mb-6 tracking-tight ${theme === 'dark' ? 'text-rose-500' : 'text-rose-600'}`}>
                StayAway<span className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}>.</span>
              </div>
              <p className={`mb-6 max-w-md ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Find your perfect accommodation worldwide. From cozy apartments to luxury villas, we've got the perfect place for your next adventure.
              </p>
              <div className="flex space-x-4">
                <a href="#" className={`p-2 rounded-full transition ${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                  <FaFacebook size={20} />
                </a>
                <a href="#" className={`p-2 rounded-full transition ${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                  <FaGoogle size={20} />
                </a>
                <a href="#" className={`p-2 rounded-full transition ${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                  <FaApple size={20} />
                </a>
              </div>
            </div>
            <div>
              <h3 className={`font-bold text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Support</h3>
              <ul className={`space-y-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#" className={`transition ${theme === 'dark' ? 'hover:text-rose-500' : 'hover:text-rose-600'}`}>Help Center</a></li>
                <li><a href="#" className={`transition ${theme === 'dark' ? 'hover:text-rose-500' : 'hover:text-rose-600'}`}>Safety information</a></li>
                <li><a href="#" className={`transition ${theme === 'dark' ? 'hover:text-rose-500' : 'hover:text-rose-600'}`}>Cancellation options</a></li>
                <li><a href="#" className={`transition ${theme === 'dark' ? 'hover:text-rose-500' : 'hover:text-rose-600'}`}>Report a concern</a></li>
              </ul>
            </div>
            <div>
              <h3 className={`font-bold text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Hosting</h3>
              <ul className={`space-y-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#" className={`transition ${theme === 'dark' ? 'hover:text-rose-500' : 'hover:text-rose-600'}`}>Try hosting</a></li>
                <li><a href="#" className={`transition ${theme === 'dark' ? 'hover:text-rose-500' : 'hover:text-rose-600'}`}>Protection for hosts</a></li>
                <li><a href="#" className={`transition ${theme === 'dark' ? 'hover:text-rose-500' : 'hover:text-rose-600'}`}>Hosting resources</a></li>
                <li><a href="#" className={`transition ${theme === 'dark' ? 'hover:text-rose-500' : 'hover:text-rose-600'}`}>Community forum</a></li>
              </ul>
            </div>
            <div>
              <h3 className={`font-bold text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>StayAway</h3>
              <ul className={`space-y-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#" className={`transition ${theme === 'dark' ? 'hover:text-rose-500' : 'hover:text-rose-600'}`}>Newsroom</a></li>
                <li><a href="#" className={`transition ${theme === 'dark' ? 'hover:text-rose-500' : 'hover:text-rose-600'}`}>Features</a></li>
                <li><a href="#" className={`transition ${theme === 'dark' ? 'hover:text-rose-500' : 'hover:text-rose-600'}`}>Careers</a></li>
                <li><a href="#" className={`transition ${theme === 'dark' ? 'hover:text-rose-500' : 'hover:text-rose-600'}`}>Investors</a></li>
              </ul>
            </div>
          </div>
          <div className={`mt-12 pt-8 flex flex-col md:flex-row justify-between items-center border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className={`text-sm mb-4 md:mb-0 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2025 StayAway, Inc. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className={`transition ${theme === 'dark' ? 'text-gray-400 hover:text-rose-500' : 'text-gray-600 hover:text-rose-600'}`}>
                Privacy
              </a>
              <a href="#" className={`transition ${theme === 'dark' ? 'text-gray-400 hover:text-rose-500' : 'text-gray-600 hover:text-rose-600'}`}>
                Terms
              </a>
              <a href="#" className={`transition ${theme === 'dark' ? 'text-gray-400 hover:text-rose-500' : 'text-gray-600 hover:text-rose-600'}`}>
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeAuthModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-2xl shadow-xl p-6 w-full max-w-md border`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{authMode === "login" ? "Welcome back" : "Create account"}</h2>
                <button
                  onClick={closeAuthModal}
                  className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition`}
                >
                  <X size={20} />
                </button>
              </div>

              {formSuccess && (
                <div className={`mb-6 p-4 rounded-xl ${theme === 'dark' ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'} text-sm`}>
                  <div className="flex items-start">
                    <Check className={`mr-2 mt-0.5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} size={16} />
                    <span>{formSuccess}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === "signup" && (
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`} htmlFor="name">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={authFormData.name}
                      onChange={handleAuthInputChange}
                      className={`w-full py-2.5 px-3 rounded-lg border ${formErrors.name ? 'border-red-500' : theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-rose-500 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                      placeholder="John Doe"
                    />
                    {formErrors.name && (
                      <p className={`mt-1.5 text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'} flex items-center`}>
                        <X size={14} className="mr-1" />
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`} htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={authFormData.email}
                    onChange={handleAuthInputChange}
                    className={`w-full py-2.5 px-3 rounded-lg border ${formErrors.email ? 'border-red-500' : theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-rose-500 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                    placeholder="you@example.com"
                  />
                  {formErrors.email && (
                    <p className={`mt-1.5 text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'} flex items-center`}>
                      <X size={14} className="mr-1" />
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`} htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={authFormData.password}
                    onChange={handleAuthInputChange}
                    className={`w-full py-2.5 px-3 rounded-lg border ${formErrors.password ? 'border-red-500' : theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-rose-500 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                    placeholder="••••••••"
                  />
                  {formErrors.password && (
                    <p className={`mt-1.5 text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'} flex items-center`}>
                      <X size={14} className="mr-1" />
                      {formErrors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-medium flex items-center justify-center"
                >
                  {authMode === "login" ? "Sign in" : "Create account"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {authMode === "login" ? "Don't have an account?" : "Already have an account?"}
                  <button
                    onClick={() => {
                      setAuthMode(authMode === "login" ? "signup" : "login");
                      setFormErrors({});
                    }}
                    className="ml-1 text-rose-600 hover:text-rose-700 font-medium transition"
                  >
                    {authMode === "login" ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className={`px-2 ${theme === 'dark' ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-600'}`}>
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => handleSocialLogin('Google')}
                    className={`flex justify-center items-center py-2.5 px-4 border rounded-lg transition ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-800 text-gray-300' : 'border-gray-300 hover:bg-gray-50 text-gray-600'}`}
                  >
                    <FaGoogle className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleSocialLogin('Facebook')}
                    className={`flex justify-center items-center py-2.5 px-4 border rounded-lg transition ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}
                  >
                    <FaFacebook className="w-5 h-5 text-blue-600" />
                  </button>
                  <button 
                    onClick={() => handleSocialLogin('Apple')}
                    className={`flex justify-center items-center py-2.5 px-4 border rounded-lg transition ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-800 text-gray-300' : 'border-gray-300 hover:bg-gray-50 text-gray-700'}`}
                  >
                    <FaApple className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Form Modal */}
      <AnimatePresence>
        {showBookingModal && selectedListingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => {
              setShowBookingModal(false);
              setBookingStatus(null);
              setFormErrors({});
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800`}
              onClick={(e) => e.stopPropagation()}
            >
              {bookingStatus === null ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Book Your Stay</h2>
                    <button
                      onClick={() => {
                        setShowBookingModal(false);
                        setFormErrors({});
                      }}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-400"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form
                    onSubmit={handleBookingSubmit}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-800 dark:text-gray-200" htmlFor="checkin">
                          Check-in Date
                        </label>
                        <input
                          type="date"
                          id="checkin"
                          value={bookingFormData.checkin}
                          onChange={handleBookingInputChange}
                          className={`w-full py-2.5 px-3 rounded-lg border ${formErrors.checkin ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                        />
                        {formErrors.checkin && (
                          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center">
                            <X size={14} className="mr-1" />
                            {formErrors.checkin}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-800 dark:text-gray-200" htmlFor="checkout">
                          Check-out Date
                        </label>
                        <input
                          type="date"
                          id="checkout"
                          value={bookingFormData.checkout}
                          onChange={handleBookingInputChange}
                          className={`w-full py-2.5 px-3 rounded-lg border ${formErrors.checkout ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                        />
                        {formErrors.checkout && (
                          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center">
                            <X size={14} className="mr-1" />
                            {formErrors.checkout}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-800 dark:text-gray-200" htmlFor="guests">
                        Number of Guests
                      </label>
                      <select
                        id="guests"
                        value={bookingFormData.guests}
                        onChange={handleBookingInputChange}
                        className={`w-full py-2.5 px-3 rounded-lg border ${formErrors.guests ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                      >
                        <option value="1">1 guest</option>
                        <option value="2">2 guests</option>
                        <option value="3">3 guests</option>
                        <option value="4">4 guests</option>
                        <option value="5">5 guests</option>
                      </select>
                      {formErrors.guests && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center">
                          <X size={14} className="mr-1" />
                          {formErrors.guests}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-800 dark:text-gray-200" htmlFor="name">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={bookingFormData.name}
                        onChange={handleBookingInputChange}
                        className={`w-full py-2.5 px-3 rounded-lg border ${formErrors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                        placeholder="John Doe"
                      />
                      {formErrors.name && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center">
                          <X size={14} className="mr-1" />
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-800 dark:text-gray-200" htmlFor="email">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={bookingFormData.email}
                        onChange={handleBookingInputChange}
                        className={`w-full py-2.5 px-3 rounded-lg border ${formErrors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                        placeholder="you@example.com"
                      />
                      {formErrors.email && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center">
                          <X size={14} className="mr-1" />
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-800 dark:text-gray-200" htmlFor="phone">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={bookingFormData.phone}
                        onChange={handleBookingInputChange}
                        className={`w-full py-2.5 px-3 rounded-lg border ${formErrors.phone ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                        placeholder="+1 (123) 456-7890"
                      />
                      {formErrors.phone && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center">
                          <X size={14} className="mr-1" />
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-800 dark:text-gray-200" htmlFor="notes">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        id="notes"
                        rows={2}
                        value={bookingFormData.notes}
                        onChange={handleBookingInputChange}
                        className="w-full py-2.5 px-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Any special requests or requirements?"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-medium flex items-center justify-center"
                    >
                      <Calendar className="mr-2" size={18} />
                      Confirm Booking
                    </button>
                  </form>
                </>
              ) : bookingStatus === "success" ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <Check size={32} className="text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Booking Successful!</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Your booking has been confirmed. A confirmation email has been sent to your email address.
                  </p>
                  <button
                    onClick={() => {
                      setShowBookingModal(false);
                      setBookingStatus(null);
                      setFormErrors({});
                    }}
                    className="px-6 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-medium"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                    <X size={32} className="text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Booking Failed</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    We couldn't process your booking at this time. Please try again later or contact our support team.
                  </p>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-center">
                    <button
                      onClick={() => {
                        setBookingStatus(null);
                      }}
                      className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium text-gray-800 dark:text-white"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => {
                        setShowBookingModal(false);
                        setBookingStatus(null);
                        setFormErrors({});
                      }}
                      className="px-6 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offer Modal */}
      <AnimatePresence>
        {showOfferModal && selectedOffer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowOfferModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selectedOffer.image}
                alt={selectedOffer.title}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`${selectedOffer.offerColor} text-white px-3 py-1 rounded-full text-sm font-bold`}>{selectedOffer.offerLabel}</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedOffer.title}</h2>
                  </div>
                  <button
                    onClick={() => setShowOfferModal(false)}
                    className="p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedOffer.description}</p>
                {/* Show related listing details */}
                {(() => {
                  const listing = listings.find(l => l.id === selectedOffer.relatedListingId);
                  if (!listing) return null;
                  return (
                    <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center">
                      <img src={listing.image} alt={listing.title} className="w-32 h-24 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{listing.title}</h3>
                        <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-2">
                          <MapPin size={14} className="mr-1 flex-shrink-0" />
                          <span>{listing.location}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          {listing.amenities.slice(0, 3).map((amenity, i) => (
                            <span key={i} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full">
                              {amenity}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center">
                          <Star size={14} className="text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{listing.rating} · {listing.reviews} reviews</span>
                        </div>
                        <div className="mt-2">
                          <span className="font-bold text-gray-900 dark:text-white">${listing.price}</span>
                          <span className="text-gray-600 dark:text-gray-400"> / night</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`md:hidden fixed top-16 inset-x-0 ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} shadow-lg z-50 border-b`}
        >
          <div className="p-4 flex flex-col space-y-3">
            <a 
              href="#popular" 
              onClick={e => handleMenuClick(e, '#popular')} 
              className={`font-medium ${theme === 'dark' 
                ? 'text-gray-200 hover:text-rose-500 hover:bg-gray-800' 
                : 'text-gray-900 hover:text-rose-600 hover:bg-gray-50'} 
                py-2 px-3 rounded-lg transition flex items-center`}
            > 
              <Star size={16} className={`mr-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'}`} /> 
              Popular
            </a>

            <a 
              href="#recommended" 
              onClick={e => handleMenuClick(e, '#recommended')} 
              className={`font-medium ${theme === 'dark' 
                ? 'text-gray-200 hover:text-rose-500 hover:bg-gray-800' 
                : 'text-gray-900 hover:text-rose-600 hover:bg-gray-50'} 
                py-2 px-3 rounded-lg transition flex items-center`}
            > 
              <ThumbsUp size={16} className={`mr-2 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'}`} /> 
              Recommended
            </a>
            
            <hr className={theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} />
            
            {isAuthenticated ? (
              <>
                <div className={`flex items-center py-2 px-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <img 
                    src={userProfile.avatar} 
                    alt="User avatar" 
                    className="w-8 h-8 rounded-full mr-3 border border-rose-500" 
                  />
                  <div className="flex flex-col">
                    <span className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {userProfile.name}
                    </span>
                    <span className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {userProfile.email}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsAuthenticated(false);
                    setUserProfile({
                      name: "",
                      email: "",
                      avatar: "https://ui-avatars.com/api/?background=random"
                    });
                    setShowUserMenu(false);
                  }}
                  className={`text-left font-medium ${theme === 'dark' 
                    ? 'text-gray-200 hover:bg-gray-800' 
                    : 'text-gray-900 hover:bg-gray-50'} 
                    py-2 px-3 rounded-lg transition flex items-center`}
                >
                  <LogIn size={16} className={`mr-2 rotate-180 ${theme === 'dark' ? 'text-rose-400' : 'text-rose-600'}`} />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    openAuthModal("signup");
                    setIsMenuOpen(false);
                  }}
                  className={`text-left font-medium ${theme === 'dark' 
                    ? 'text-gray-200 hover:bg-gray-800' 
                    : 'text-gray-900 hover:bg-gray-50'} 
                    py-2 px-3 rounded-lg transition flex items-center`}
                >
                  <UserPlus size={16} className={`mr-2 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  Sign up
                </button>
                
                <button
                  onClick={() => {
                    openAuthModal("login");
                    setIsMenuOpen(false);
                  }}
                  className={`text-left font-medium ${theme === 'dark' 
                    ? 'text-gray-200 hover:bg-gray-800' 
                    : 'text-gray-900 hover:bg-gray-50'} 
                    py-2 px-3 rounded-lg transition flex items-center`}
                >
                  <LogIn size={16} className={`mr-2 ${theme === 'dark' ? 'text-rose-400' : 'text-rose-600'}`} />
                  Sign in
                </button>
              </>
            )}
            
            <button
              onClick={toggleTheme}
              className={`text-left font-medium ${theme === 'dark' 
                ? 'text-gray-200 hover:bg-gray-800' 
                : 'text-gray-900 hover:bg-gray-50'} 
                py-2 px-3 rounded-lg transition flex items-center`}
            >
              {theme === "dark" ? 
                <Sun size={16} className="mr-2 text-amber-400" /> : 
                <Moon size={16} className="mr-2 text-indigo-600" />
              }
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Listing Detail Modal */}
      <AnimatePresence>
        {selectedListing && selectedListingData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={closeListingDetail}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedListingData.images[currentImageIndex]}
                  alt={selectedListingData.title}
                  className="w-full h-64 sm:h-96 object-cover"
                />
                <button
                  onClick={closeListingDetail}
                  className={`absolute top-4 right-4 p-2 rounded-full ${theme === 'dark'
                    ? 'bg-gray-800/90 hover:bg-gray-800 text-white'
                    : 'bg-white/90 hover:bg-white text-gray-800'
                    } shadow-sm transition`}
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <button
                    onClick={prevImage}
                    className={`p-2 rounded-full ${theme === 'dark'
                      ? 'bg-gray-800/90 hover:bg-gray-800 text-white'
                      : 'bg-white/90 hover:bg-white text-gray-800'
                      } shadow-sm transition`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className={`p-2 rounded-full ${theme === 'dark'
                      ? 'bg-gray-800/90 hover:bg-gray-800 text-white'
                      : 'bg-white/90 hover:bg-white text-gray-800'
                      } shadow-sm transition`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                      {selectedListingData.title}
                    </h2>
                    <div className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      <MapPin size={16} className="mr-1" />
                      <span>{selectedListingData.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star size={18} className="text-yellow-400 mr-1" />
                    <span className="font-medium">{selectedListingData.rating}</span>
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} ml-1`}>
                      ({selectedListingData.reviews} reviews)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} p-3 rounded-lg`}>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Guests</div>
                    <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedListingData.guests}</div>
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} p-3 rounded-lg`}>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Bedrooms</div>
                    <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedListingData.bedrooms}</div>
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} p-3 rounded-lg`}>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Beds</div>
                    <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedListingData.beds}</div>
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} p-3 rounded-lg`}>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Baths</div>
                    <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedListingData.baths}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Description</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{selectedListingData.description}</p>
                </div>

                <div className="mb-6">
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedListingData.amenities.map((amenity, index) => (
                      <div key={index} className={`flex items-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Check size={16} className="mr-2 text-green-500" />
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} pt-6`}>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        ${selectedListingData.price}
                      </span>
                      <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}> / night</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedListingId(selectedListing);
                        setShowBookingModal(true);
                        closeListingDetail();
                      }}
                      className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg font-medium transition"
                    >
                      Book now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        /* Base styles */
        body {
          font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background-color: ${theme === 'dark' ? '#111827' : '#F9FAFB'};
          color: ${theme === 'dark' ? '#F3F4F6' : '#111827'};
        }

        /* Headings */
        h1, h2, h3, h4, h5, h6 {
          color: ${theme === 'dark' ? '#F9FAFB' : '#111827'};
          font-weight: 700;
        }

        /* Paragraphs and body text */
        p, span, li, div, label {
          color: ${theme === 'dark' ? '#E5E7EB' : '#1F2937'};
        }

        /* Links */
        a {
          color: ${theme === 'dark' ? '#93C5FD' : '#2563EB'};
          text-decoration: none;
        }
        a:hover {
          color: #F43F5E;
        }

        /* Buttons */
        .btn-primary {
          background-color: #F43F5E;
          color: #FFF;
        }
        .btn-secondary {
          background-color: ${theme === 'dark' ? '#374151' : '#F3F4F6'};
          color: ${theme === 'dark' ? '#F3F4F6' : '#1F2937'};
        }
        button, .cursor-pointer {
          cursor: pointer !important;
        }

        /* Inputs, selects, textareas */
        input, select, textarea {
          color: ${theme === 'dark' ? '#F3F4F6' : '#111827'};
          background-color: ${theme === 'dark' ? '#1F2937' : '#FFF'};
          border-color: ${theme === 'dark' ? '#4B5563' : '#E5E7EB'};
        }
        input:focus, select:focus, textarea:focus {
          outline: 2px solid #F43F5E;
          outline-offset: 2px;
        }
        ::placeholder {
          color: ${theme === 'dark' ? '#9CA3AF' : '#6B7280'};
          opacity: 1;
        }

        /* Error and success messages */
        .text-red-600 {
          color: ${theme === 'dark' ? '#F87171' : '#DC2626'} !important;
        }
        .text-green-600 {
          color: ${theme === 'dark' ? '#4ADE80' : '#16A34A'} !important;
        }

        /* Card and modal backgrounds */
        .card, .modal-content {
          background-color: ${theme === 'dark' ? '#1F2937' : '#FFF'};
          color: ${theme === 'dark' ? '#F3F4F6' : '#111827'};
        }
        .modal-backdrop {
          background-color: ${theme === 'dark' ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.5)'};
        }

        /* Border colors */
        .border {
          border-color: ${theme === 'dark' ? '#4B5563' : '#E5E7EB'};
        }

        /* Focus and hover states for accessibility */
        button:focus, a:focus, [role="button"]:focus, input[type="submit"]:focus, input[type="button"]:focus, select:focus {
          outline: 2px solid #F43F5E;
          outline-offset: 2px;
        }
        button:hover, a:hover, [role="button"]:hover, input[type="submit"]:hover, input[type="button"]:hover, select:hover {
          opacity: 0.92;
        }

        /* Mobile styles */
        @media (max-width: 640px) {
          .container {
            padding-left: 16px;
            padding-right: 16px;
          }
          .grid {
            gap: 16px;
          }
          input[type="date"], select, textarea, input[type="text"], input[type="email"], input[type="tel"] {
            font-size: 16px;
          }
          .max-h-\[90vh\] {
            max-height: 80vh;
          }
        }

        /* Hide scrollbar */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Toast notification */}
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-lg ${
            theme === 'dark' 
              ? 'bg-gray-800 border border-gray-700 text-white' 
              : 'bg-white border border-gray-200 text-gray-900'
          } ${
            toast.type === 'success' 
              ? 'border-l-4 border-l-green-500' 
              : toast.type === 'error' 
                ? 'border-l-4 border-l-red-500' 
                : 'border-l-4 border-l-blue-500'
          }`}
        >
          <div className="flex items-center">
            {toast.type === 'success' && <Check className="mr-2 text-green-500" size={18} />}
            {toast.type === 'error' && <X className="mr-2 text-red-500" size={18} />}
            {toast.type === 'info' && <Info className="mr-2 text-blue-500" size={18} />}
            <span>{toast.message}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}