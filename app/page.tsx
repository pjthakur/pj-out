"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Quote,
  Plus,
  Shuffle,
  Heart,
  Star,
  Trash2,
  Edit3,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Search,
  Filter,
  Download,
  TrendingUp,
  BarChart3,
  Target,
  Award,
  BookOpen,
  Copy,
  Moon,
  Sun,
  ChevronDown,
  Eye,
  Check,
} from "lucide-react";

interface QuoteData {
  id: string;
  text: string;
  author: string;
  category: string;
  isFavorite: boolean;
  isFeatured: boolean;
  dateAdded: string;
  views: number;
  tags: string[];
}

interface Analytics {
  totalQuotes: number;
  favoriteQuotes: number;
  featuredQuotes: number;
  categories: number;
  totalViews: number;
  mostViewedQuote: QuoteData | null;
  recentlyAdded: number;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

const InspirationalQuoteWebsite: React.FC = () => {
  const [quotes, setQuotes] = useState<QuoteData[]>([
    {
      id: "1",
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      category: "Success",
      isFavorite: false,
      isFeatured: true,
      dateAdded: "2025-01-15",
      views: 245,
      tags: ["work", "passion", "success"],
    },
    {
      id: "2",
      text: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs",
      category: "Innovation",
      isFavorite: true,
      isFeatured: false,
      dateAdded: "2025-01-20",
      views: 189,
      tags: ["innovation", "leadership", "business"],
    },
    {
      id: "3",
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
      category: "Dreams",
      isFavorite: false,
      isFeatured: false,
      dateAdded: "2025-01-25",
      views: 156,
      tags: ["dreams", "future", "belief"],
    },
    {
      id: "4",
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
      category: "Motivation",
      isFavorite: true,
      isFeatured: false,
      dateAdded: "2025-01-28",
      views: 298,
      tags: ["success", "failure", "courage", "persistence"],
    },
  ]);

  const [currentQuote, setCurrentQuote] = useState<QuoteData>(quotes[0]);
  const [isAddingQuote, setIsAddingQuote] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("dateAdded");
  const [filterBy, setFilterBy] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const [newQuote, setNewQuote] = useState({
    text: "",
    author: "",
    category: "",
    tags: [] as string[],
    tagInput: "",
  });
  const [editingQuote, setEditingQuote] = useState<QuoteData | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<QuoteData | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const categories = [
    "Success",
    "Innovation",
    "Dreams",
    "Leadership",
    "Motivation",
    "Life",
    "Wisdom",
    "Business",
    "Creativity",
    "Growth",
  ];

  // Toast functions
  const addToast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Analytics computation
  const analytics: Analytics = useMemo(() => {
    const totalQuotes = quotes.length;
    const favoriteQuotes = quotes.filter((q) => q.isFavorite).length;
    const featuredQuotes = quotes.filter((q) => q.isFeatured).length;
    const categoriesCount = new Set(quotes.map((q) => q.category)).size;
    const totalViews = quotes.reduce((sum, q) => sum + q.views, 0);
    const mostViewedQuote = quotes.reduce(
      (max, q) => (q.views > (max?.views || 0) ? q : max),
      null as QuoteData | null
    );
    const recentlyAdded = quotes.filter((q) => {
      const addedDate = new Date(q.dateAdded);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return addedDate > weekAgo;
    }).length;

    return {
      totalQuotes,
      favoriteQuotes,
      featuredQuotes,
      categories: categoriesCount,
      totalViews,
      mostViewedQuote,
      recentlyAdded,
    };
  }, [quotes]);

  // Filtered and sorted quotes
  const filteredQuotes = useMemo(() => {
    let filtered = quotes.filter((quote) => {
      const matchesSearch =
        quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "All" || quote.category === selectedCategory;

      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "favorites" && quote.isFavorite) ||
        (filterBy === "featured" && quote.isFeatured);

      return matchesSearch && matchesCategory && matchesFilter;
    });

    // Sort quotes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "views":
          return b.views - a.views;
        case "author":
          return a.author.localeCompare(b.author);
        case "category":
          return a.category.localeCompare(b.category);
        case "dateAdded":
        default:
          return (
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
          );
      }
    });

    return filtered;
  }, [quotes, searchTerm, selectedCategory, sortBy, filterBy]);

  // Get featured quotes
  const featuredQuotes = quotes.filter((q) => q.isFeatured);

  // Prevent body scrolling when modals are open
  useEffect(() => {
    if (isAddingQuote || editingQuote || selectedQuote || isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAddingQuote, editingQuote, selectedQuote, isMobileMenuOpen]);

  useEffect(() => {
    if (quotes.length > 0) {
      const nonFeaturedQuotes = quotes.filter((q) => !q.isFeatured);
      const quotesToChooseFrom = nonFeaturedQuotes.length > 0 ? nonFeaturedQuotes : quotes;
      setCurrentQuote(quotesToChooseFrom[Math.floor(Math.random() * quotesToChooseFrom.length)]);
    }
  }, []); // <-- empty dependency: only on initial mount

  const getRandomQuote = () => {
    if (quotes.length > 0) {
      const nonFeaturedQuotes = quotes.filter((q) => !q.isFeatured);
      const quotesToChooseFrom = nonFeaturedQuotes.length > 0 ? nonFeaturedQuotes : quotes;
      
      // Make sure we get a different quote than the current one
      let randomQuote;
      let attempts = 0;
      do {
        const randomIndex = Math.floor(Math.random() * quotesToChooseFrom.length);
        randomQuote = quotesToChooseFrom[randomIndex];
        attempts++;
      } while (
        randomQuote.id === currentQuote.id &&
        quotesToChooseFrom.length > 1 &&
        attempts < 10
      );

      setCurrentQuote(randomQuote);
      incrementViews(randomQuote.id);
      addToast("New quote loaded!", "info");
    }
  };

  const incrementViews = (id: string) => {
    setQuotes(
      quotes.map((q) => (q.id === id ? { ...q, views: q.views + 1 } : q))
    );
  };

  const addQuote = () => {
    if (newQuote.text && newQuote.author) {
      const quote: QuoteData = {
        id: Date.now().toString(),
        text: newQuote.text,
        author: newQuote.author,
        category: newQuote.category || "General",
        isFavorite: false,
        isFeatured: false,
        dateAdded: new Date().toISOString().split("T")[0],
        views: 0,
        tags: newQuote.tags,
      };
      setQuotes([...quotes, quote]);
      setNewQuote({
        text: "",
        author: "",
        category: "",
        tags: [],
        tagInput: "",
      });
      setIsAddingQuote(false);
      addToast("Quote added successfully!", "success");
    }
  };

  const deleteQuote = (id: string) => {
    const quoteToDelete = quotes.find((q) => q.id === id);
    const updatedQuotes = quotes.filter((q) => q.id !== id);
    setQuotes(updatedQuotes);
    if (currentQuote.id === id && updatedQuotes.length > 0) {
      setCurrentQuote(updatedQuotes[0]);
    }
    addToast(`Quote by ${quoteToDelete?.author} deleted`, "info");
  };

  const toggleFavorite = (id: string) => {
    const quote = quotes.find((q) => q.id === id);
    const newFavoriteStatus = !quote?.isFavorite;

    setQuotes(
      quotes.map((q) =>
        q.id === id ? { ...q, isFavorite: newFavoriteStatus } : q
      )
    );

    // Update currentQuote if it's the one being toggled
    if (currentQuote.id === id) {
      setCurrentQuote({ ...currentQuote, isFavorite: newFavoriteStatus });
    }

    // Update selectedQuote if it's the one being toggled
    if (selectedQuote && selectedQuote.id === id) {
      setSelectedQuote({ ...selectedQuote, isFavorite: newFavoriteStatus });
    }

    addToast(
      newFavoriteStatus ? "Added to favorites!" : "Removed from favorites",
      newFavoriteStatus ? "success" : "info"
    );
  };

  const toggleFeatured = (id: string) => {
    const quote = quotes.find((q) => q.id === id);
    const newFeaturedStatus = !quote?.isFeatured;

    setQuotes(
      quotes.map((q) =>
        q.id === id ? { ...q, isFeatured: newFeaturedStatus } : q
      )
    );

    addToast(
      newFeaturedStatus ? "Quote featured!" : "Removed from featured",
      newFeaturedStatus ? "success" : "info"
    );
  };

  const setAsFeatured = (id: string) => {
    // Remove featured status from all quotes, then set this one as featured
    setQuotes(
      quotes.map((q) => ({
        ...q,
        isFeatured: q.id === id,
      }))
    );

    // Set as current quote without incrementing views
    const quote = quotes.find((q) => q.id === id);
    if (quote) {
      setCurrentQuote({ ...quote, isFeatured: true });
      addToast("Quote set as featured!", "success");
    }
  };

  const updateQuote = (updatedQuote: QuoteData) => {
    setQuotes(quotes.map((q) => (q.id === updatedQuote.id ? updatedQuote : q)));
    setEditingQuote(null);
    addToast("Quote updated successfully!", "success");
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  const exportQuotes = () => {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "quotes.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    addToast("Quotes exported successfully!", "success");
  };

  const copyQuote = async (quote: QuoteData) => {
    const text = `"${quote.text}" - ${quote.author}`;
    try {
      await navigator.clipboard.writeText(text);
      addToast("Quote copied to clipboard!", "success");
    } catch (err) {
      addToast("Failed to copy quote", "error");
    }
  };

  const addTag = () => {
    if (newQuote.tagInput && !newQuote.tags.includes(newQuote.tagInput)) {
      setNewQuote({
        ...newQuote,
        tags: [...newQuote.tags, newQuote.tagInput],
        tagInput: "",
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewQuote({
      ...newQuote,
      tags: newQuote.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const themeClasses = isDarkMode
    ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    : "bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50";

  const cardClasses = isDarkMode
    ? "bg-white/10 backdrop-blur-lg border-white/20"
    : "bg-white/90 backdrop-blur-lg border-gray-200";

  const textClasses = isDarkMode ? "text-white" : "text-gray-900";
  const mutedTextClasses = isDarkMode ? "text-white/70" : "text-gray-600";

  return (
    <div className={`min-h-screen ${themeClasses} font-[Roboto]`}>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full ${cardClasses} border-b z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className={`text-xl font-bold ${textClasses}`}>
                  QuoteVault Pro
                </span>
                <div className="text-xs text-purple-500 font-medium">
                  Enterprise Edition
                </div>
              </div>
            </div>

            {/* Center Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
              <button
                onClick={() => scrollToSection("dashboard")}
                className={`cursor-pointer px-6 py-2 rounded-lg transition-all duration-200 font-medium ${
                  activeSection === "dashboard"
                    ? "bg-purple-600 text-white shadow-lg"
                    : `${mutedTextClasses} hover:${textClasses}`
                }`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("quotes")}
                className={`cursor-pointer px-6 py-2 rounded-lg transition-all duration-200 font-medium ${
                  activeSection === "quotes"
                    ? "bg-purple-600 text-white shadow-lg"
                    : `${mutedTextClasses} hover:${textClasses}`
                }`}
              >
                Browse
              </button>
            </div>

            {/* Right Action Buttons */}
            <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`cursor-pointer p-2.5 rounded-lg ${mutedTextClasses} hover:${textClasses} transition-colors`}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => setIsAddingQuote(true)}
                className="cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg font-medium"
              >
                <Plus className="h-4 w-4" />
                <span>Add Quote</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`cursor-pointer md:hidden p-2 ${textClasses}`}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden ${cardClasses} border-t border-white/20`}>
            <div className="px-4 py-3 space-y-2">
              {["dashboard", "quotes"].map(
                (section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`cursor-pointer block w-full text-left px-3 py-2 rounded-lg transition-colors capitalize ${
                      activeSection === section
                        ? "bg-purple-600 text-white"
                        : `${mutedTextClasses} hover:${textClasses}`
                    }`}
                  >
                    {section === "dashboard" ? "Home" : "Browse"}
                  </button>
                )
              )}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`cursor-pointer p-2 rounded-lg ${mutedTextClasses} hover:${textClasses} transition-colors`}
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => setIsAddingQuote(true)}
                  className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Quote</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Dashboard Section */}
      {activeSection === "dashboard" && (
        <section className="min-h-screen pt-16 px-4 sm:px-6 lg:px-8 flex flex-col">
          <div className="max-w-7xl mx-auto flex-1 flex flex-col">
            {/* Hero Section */}
            <div className="text-center flex-1 flex flex-col justify-center py-20 sm:py-40">
              <h1
                className={`text-5xl md:text-7xl lg:text-8xl font-bold ${textClasses} mb-8 animate-fade-in`}
              >
                Inspiration
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {" "}
                  Unleashed
                </span>
              </h1>
              <p
                className={`text-xl lg:text-2xl ${mutedTextClasses} mb-12 max-w-4xl mx-auto leading-relaxed`}
              >
                Transform your mindset with our enterprise-grade quote
                management platform. Curate, organize, and access powerful
                insights that drive success.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <button
                  onClick={() => scrollToSection("quotes")}
                  className={`cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-full text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl text-white`}
                >
                  Explore Library
                  <ChevronRight className="inline-block ml-2 h-6 w-6" />
                </button>
                <button
                  onClick={() => setIsAddingQuote(true)}
                  className={`${cardClasses} cursor-pointer  border px-8 py-4 rounded-full text-xl font-semibold transition-all duration-300 transform hover:scale-105 ${textClasses}`}
                >
                  Add Quote
                  <Plus className="inline-block ml-2 h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div
                className={`${cardClasses} rounded-2xl p-6 border transition-all duration-300 hover:scale-105`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${mutedTextClasses}`}>
                      Total Quotes
                    </p>
                    <p className={`text-3xl font-bold ${textClasses}`}>
                      {analytics.totalQuotes}
                    </p>
                  </div>
                  <BookOpen className="h-12 w-12 text-purple-500" />
                </div>
                <div className="mt-4">
                  <span className="text-purple-500 text-sm font-medium">
                    +{analytics.recentlyAdded} this week
                  </span>
                </div>
              </div>

              <div
                className={`${cardClasses} rounded-2xl p-6 border transition-all duration-300 hover:scale-105`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${mutedTextClasses}`}>
                      Total Views
                    </p>
                    <p className={`text-3xl font-bold ${textClasses}`}>
                      {analytics.totalViews.toLocaleString()}
                    </p>
                  </div>
                  <Eye className="h-12 w-12 text-pink-500" />
                </div>
                <div className="mt-4">
                  <span className="text-pink-500 text-sm font-medium">
                    Engagement metrics
                  </span>
                </div>
              </div>

              <div
                className={`${cardClasses} rounded-2xl p-6 border transition-all duration-300 hover:scale-105`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${mutedTextClasses}`}>
                      Favorites
                    </p>
                    <p className={`text-3xl font-bold ${textClasses}`}>
                      {analytics.favoriteQuotes}
                    </p>
                  </div>
                  <Heart className="h-12 w-12 text-purple-400" />
                </div>
                <div className="mt-4">
                  <span className="text-purple-400 text-sm font-medium">
                    Your top picks
                  </span>
                </div>
              </div>

              <div
                className={`${cardClasses} rounded-2xl p-6 border transition-all duration-300 hover:scale-105`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${mutedTextClasses}`}>
                      Categories
                    </p>
                    <p className={`text-3xl font-bold ${textClasses}`}>
                      {analytics.categories}
                    </p>
                  </div>
                  <Target className="h-12 w-12 text-pink-400" />
                </div>
                <div className="mt-4">
                  <span className="text-pink-400 text-sm font-medium">
                    Well organized
                  </span>
                </div>
              </div>
            </div>

            {/* Featured Quote Display */}
            <div className="max-w-5xl mx-auto pb-16">
              <div
                className={`${cardClasses} rounded-3xl p-8 md:p-12 border shadow-2xl transform hover:scale-102 transition-all duration-500 h-[600px] flex flex-col`}
              >
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Star className="h-6 w-6 text-yellow-500 fill-current" />
                    <span className={`text-lg font-semibold ${textClasses}`}>
                      Quote of the Day
                    </span>
                    <Star className="h-6 w-6 text-yellow-500 fill-current" />
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center min-h-0">
                  <Quote className="h-16 w-16 text-purple-400 mb-8 mx-auto opacity-30" />
                  <div className="flex-1 flex flex-col justify-center">
                    <blockquote
                      className={`text-2xl md:text-4xl font-light ${textClasses} text-center mb-4 leading-relaxed ${
                        currentQuote.text.length > 120 ? 'cursor-pointer hover:text-purple-300 transition-colors' : ''
                      }`}
                      onClick={() => currentQuote.text.length > 120 && setSelectedQuote(currentQuote)}
                    >
                      "{currentQuote.text.length > 120 ? currentQuote.text.substring(0, 120) + '...' : currentQuote.text}"
                    </blockquote>
                    {currentQuote.text.length > 120 && (
                      <div className="text-center mb-4">
                        <button
                          onClick={() => setSelectedQuote(currentQuote)}
                          className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors underline"
                        >
                          Click to read full quote
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center mb-8">
                  <p className="text-purple-400 text-xl font-medium mb-2">
                    — {currentQuote.author}
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <span className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium">
                      {currentQuote.category}
                    </span>
                    <span
                      className={`${mutedTextClasses} text-sm flex items-center`}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {currentQuote.views} views
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={getRandomQuote}
                    className={`${cardClasses} cursor-pointer  border px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 ${textClasses}`}
                  >
                    <Shuffle className="h-5 w-5" />
                    <span>New Quote</span>
                  </button>
                  <button
                    onClick={() => copyQuote(currentQuote)}
                    className={`${cardClasses} cursor-pointer border px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 ${textClasses}`}
                  >
                    <Copy className="h-5 w-5" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => toggleFavorite(currentQuote.id)}
                    className={`${cardClasses} cursor-pointer  border px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 ${textClasses}`}
                  >
                    <Heart
                      className={`h-5 w-5  ${
                        currentQuote.isFavorite
                          ? "fill-current text-red-500"
                          : ""
                      }`}
                    />
                    <span>
                      {currentQuote.isFavorite ? "Favorited" : "Favorite"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Browse Quotes Section */}
      {activeSection === "quotes" && (
        <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <div>
                <h2 className={`text-4xl font-bold ${textClasses} mb-2`}>
                  Quote Library
                </h2>
                <p className={`${mutedTextClasses}`}>
                  Discover and manage your inspirational content
                </p>
              </div>

              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <button
                  onClick={exportQuotes}
                  className={`cursor-pointer ${cardClasses} border px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${textClasses}`}
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className={`${cardClasses} rounded-2xl p-6 border mb-8`}>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${mutedTextClasses}`}
                    />
                    <input
                      type="text"
                      placeholder="Search quotes, authors, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        isDarkMode
                          ? "bg-white/10 border-white/20 text-white placeholder-white/50"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    />
                  </div>
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                >
                  <option value="All">All Categories</option>
                  {categories.map((cat) => (
                    <option
                      key={cat}
                      value={cat}
                      className={isDarkMode ? "bg-gray-800" : "bg-white"}
                    >
                      {cat}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                >
                  <option
                    value="dateAdded"
                    className={isDarkMode ? "bg-gray-800" : "bg-white"}
                  >
                    Newest First
                  </option>
                  <option
                    value="views"
                    className={isDarkMode ? "bg-gray-800" : "bg-white"}
                  >
                    Most Viewed
                  </option>
                  <option
                    value="author"
                    className={isDarkMode ? "bg-gray-800" : "bg-white"}
                  >
                    By Author
                  </option>
                  <option
                    value="category"
                    className={isDarkMode ? "bg-gray-800" : "bg-white"}
                  >
                    By Category
                  </option>
                </select>
              </div>

              <div className="pt-4 border-t border-white/20">
                <div className="md:hidden grid grid-cols-2 gap-2 mb-2">
                  {["all", "favorites"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setFilterBy(filter)}
                      className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-200 capitalize ${
                        filterBy === filter
                          ? "bg-purple-600 text-white"
                          : `${cardClasses} border ${textClasses}`
                      }`}
                    >
                      {filter === "all" ? "All Quotes" : filter}
                    </button>
                  ))}
                </div>
                <div className="md:hidden w-full">
                  <button
                    onClick={() => setFilterBy("featured")}
                    className={`cursor-pointer w-full px-4 py-2 rounded-lg transition-all duration-200 capitalize ${
                      filterBy === "featured"
                        ? "bg-purple-600 text-white"
                        : `${cardClasses} border ${textClasses}`
                    }`}
                  >
                    Featured
                  </button>
                </div>
                
                {/* Desktop layout */}
                <div className="hidden md:flex gap-3 justify-center">
                  {["all", "favorites", "featured"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setFilterBy(filter)}
                      className={`cursor-pointer px-6 py-2 rounded-lg transition-all duration-200 capitalize min-w-[120px] ${
                        filterBy === filter
                          ? "bg-purple-600 text-white"
                          : `${cardClasses} border ${textClasses}`
                      }`}
                    >
                      {filter === "all" ? "All Quotes" : filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Info */}
            <div className="flex justify-between items-center mb-6">
              <p className={`${mutedTextClasses}`}>
                Showing {filteredQuotes.length} of {quotes.length} quotes
              </p>
            </div>

            {/* Quotes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className={`${cardClasses} rounded-2xl p-6 border hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl h-80 flex flex-col`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-lg text-xs font-medium">
                        {quote.category}
                      </span>
                      {quote.isFeatured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleFavorite(quote.id)}
                        className={`cursor-pointer transition-colors ${
                          quote.isFavorite
                            ? "text-red-500"
                            : `${mutedTextClasses} hover:text-red-500`
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            quote.isFavorite
                              ? "fill-current"
                              : ""
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => copyQuote(quote)}
                        className={`cursor-pointer ${mutedTextClasses} hover:${textClasses} transition-colors`}
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <blockquote
                      className={`${textClasses} mb-4 leading-relaxed text-sm cursor-pointer hover:text-purple-300 transition-colors flex-1`}
                      onClick={() => setSelectedQuote(quote)}
                    >
                      "{quote.text.length > 120 ? quote.text.substring(0, 120) + '...' : quote.text}"
                    </blockquote>

                    <div className="mb-4">
                      <p className="text-purple-400 text-sm font-medium">
                        — {quote.author}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`${mutedTextClasses} text-xs flex items-center`}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          {quote.views} views
                        </span>
                        <span className={`${mutedTextClasses} text-xs`}>
                          {new Date(quote.dateAdded).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mb-4 min-h-[24px]">
                      {quote.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {quote.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className={`bg-gray-500/20 ${isDarkMode ? 'text-gray-100' : 'text-gray-600'} px-2 py-1 rounded text-xs`}
                            >
                              #{tag}
                            </span>
                          ))}
                          {quote.tags.length > 3 && (
                            <span className="bg-gray-500/10 text-gray-500 px-2 py-1 rounded text-xs">
                              +{quote.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-auto">
                    <button
                      onClick={() => {
                        setCurrentQuote(quote);
                        incrementViews(quote.id);
                        addToast("Set as Quote of the Day!", "success");
                        scrollToSection("dashboard");
                      }}
                      className="cursor-pointer flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 rounded-lg transition-colors text-sm font-semibold shadow-md hover:shadow-lg"
                    >
                      Set as Quote of Day
                    </button>
                    <button
                      onClick={() => setEditingQuote(quote)}
                      className={`cursor-pointer px-3 py-2 rounded-lg transition-colors ${mutedTextClasses} hover:${textClasses}`}
                    >
                      <Edit3 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteQuote(quote.id)}
                      className={`cursor-pointer px-3 py-2 rounded-lg transition-colors ${mutedTextClasses} hover:text-red-500`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredQuotes.length === 0 && (
              <div className="text-center py-12">
                <BookOpen
                  className={`h-16 w-16 ${mutedTextClasses} mx-auto mb-4`}
                />
                <h3 className={`text-xl font-semibold ${textClasses} mb-2`}>
                  No quotes found
                </h3>
                <p className={`${mutedTextClasses} mb-6`}>
                  Try adjusting your search criteria or add some new quotes.
                </p>
                <button
                  onClick={() => setIsAddingQuote(true)}
                  className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Add Your First Quote
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Add Quote Modal */}
      {isAddingQuote && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className={`${cardClasses} rounded-3xl p-8 w-full max-w-lg border shadow-2xl`}
          >
            <h3 className={`text-2xl font-bold ${textClasses} mb-6`}>
              Add New Quote
            </h3>

            <div className="space-y-6">
              <div>
                <label
                  className={`block ${textClasses} text-sm font-medium mb-2`}
                >
                  Quote Text *
                </label>
                <textarea
                  value={newQuote.text}
                  onChange={(e) =>
                    setNewQuote({ ...newQuote, text: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-lg border resize-none ${
                    isDarkMode
                      ? "bg-white/10 border-white/20 text-white placeholder-white/50"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  rows={4}
                  placeholder="Enter the inspirational quote..."
                />
              </div>

              <div>
                <label
                  className={`block ${textClasses} text-sm font-medium mb-2`}
                >
                  Author *
                </label>
                <input
                  type="text"
                  value={newQuote.author}
                  onChange={(e) =>
                    setNewQuote({ ...newQuote, author: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? "bg-white/10 border-white/20 text-white placeholder-white/50"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="Quote author"
                />
              </div>

              <div>
                <label
                  className={`block ${textClasses} text-sm font-medium mb-2`}
                >
                  Category
                </label>
                <select
                  value={newQuote.category}
                  onChange={(e) =>
                    setNewQuote({ ...newQuote, category: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option
                      key={cat}
                      value={cat}
                      className={isDarkMode ? "bg-gray-800" : "bg-white"}
                    >
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className={`block ${textClasses} text-sm font-medium mb-2`}
                >
                  Tags
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newQuote.tagInput}
                    onChange={(e) =>
                      setNewQuote({ ...newQuote, tagInput: e.target.value })
                    }
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-white/10 border-white/20 text-white placeholder-white/50"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    placeholder="Add a tag..."
                  />
                  <button
                    onClick={addTag}
                    className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                {newQuote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newQuote.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-lg text-sm flex items-center space-x-2"
                      >
                        <span>#{tag}</span>
                        <button
                          onClick={() => removeTag(tag)}
                          className="cursor-pointer text-purple-300 hover:text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <button
                onClick={() => setIsAddingQuote(false)}
                className={`cursor-pointer flex-1 py-3 rounded-lg transition-colors ${cardClasses} border ${textClasses}`}
              >
                Cancel
              </button>
              <button
                onClick={addQuote}
                disabled={!newQuote.text || !newQuote.author}
                className="cursor-pointer flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors font-medium"
              >
                Add Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Quote Modal */}
      {editingQuote && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className={`${cardClasses} rounded-3xl p-8 w-full max-w-lg border shadow-2xl`}
          >
            <h3 className={`text-2xl font-bold ${textClasses} mb-6`}>
              Edit Quote
            </h3>

            <div className="space-y-6">
              <div>
                <label
                  className={`block ${textClasses} text-sm font-medium mb-2`}
                >
                  Quote Text
                </label>
                <textarea
                  value={editingQuote.text}
                  onChange={(e) =>
                    setEditingQuote({ ...editingQuote, text: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-lg border resize-none ${
                    isDarkMode
                      ? "bg-white/10 border-white/20 text-white placeholder-white/50"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  rows={4}
                />
              </div>

              <div>
                <label
                  className={`block ${textClasses} text-sm font-medium mb-2`}
                >
                  Author
                </label>
                <input
                  type="text"
                  value={editingQuote.author}
                  onChange={(e) =>
                    setEditingQuote({ ...editingQuote, author: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? "bg-white/10 border-white/20 text-white placeholder-white/50"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                />
              </div>

              <div>
                <label
                  className={`block ${textClasses} text-sm font-medium mb-2`}
                >
                  Category
                </label>
                <select
                  value={editingQuote.category}
                  onChange={(e) =>
                    setEditingQuote({
                      ...editingQuote,
                      category: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                >
                  {categories.map((cat) => (
                    <option
                      key={cat}
                      value={cat}
                      className={isDarkMode ? "bg-gray-800" : "bg-white"}
                    >
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <button
                onClick={() => setEditingQuote(null)}
                className={`cursor-pointer flex-1 py-3 rounded-lg transition-colors ${cardClasses} border ${textClasses}`}
              >
                Cancel
              </button>
              <button
                onClick={() => updateQuote(editingQuote)}
                className="cursor-pointer flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg transition-colors font-medium"
              >
                Update Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className={`${cardClasses} rounded-3xl p-8 w-full max-w-2xl border shadow-2xl max-h-[80vh] overflow-y-auto`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-2">
                <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-lg text-sm font-medium">
                  {selectedQuote.category}
                </span>
                {selectedQuote.isFeatured && (
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                )}
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className={`cursor-pointer ${mutedTextClasses} hover:${textClasses} transition-colors`}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <Quote className="h-16 w-16 text-purple-400 mb-8 mx-auto opacity-30" />

            <blockquote
              className={`text-xl md:text-2xl ${textClasses} mb-8 leading-relaxed font-light text-center`}
            >
              "{selectedQuote.text}"
            </blockquote>

            <div className="text-center mb-8">
              <p className="text-purple-400 text-lg font-medium mb-4">
                — {selectedQuote.author}
              </p>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <span
                  className={`${mutedTextClasses} text-sm flex items-center`}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {selectedQuote.views} views
                </span>
                <span className={`${mutedTextClasses} text-sm`}>
                  {new Date(selectedQuote.dateAdded).toLocaleDateString()}
                </span>
              </div>

              {/* Tags */}
              {selectedQuote.tags.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {selectedQuote.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-500/20 text-gray-400 px-3 py-1 rounded-lg text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setCurrentQuote(selectedQuote);
                  incrementViews(selectedQuote.id);
                  setSelectedQuote(null);
                  addToast("Set as Quote of the Day!", "success");
                }}
                className="cursor-pointer flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl transition-all duration-200 font-medium"
              >
                Set as Quote of Day
              </button>
              <button
                onClick={() => {
                  copyQuote(selectedQuote);
                  setSelectedQuote(null);
                }}
                className={`cursor-pointer px-6 py-3 rounded-xl transition-colors ${cardClasses} border ${textClasses} flex items-center justify-center space-x-2`}
              >
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </button>
              <button
                onClick={() => toggleFavorite(selectedQuote.id)}
                className={`cursor-pointer px-6 py-3 rounded-xl transition-colors ${cardClasses} border ${textClasses} flex items-center justify-center space-x-2`}
              >
                <Heart
                  className={`h-4 w-4 ${
                    selectedQuote.isFavorite ? "fill-current text-red-500" : ""
                  }`}
                />
                <span>
                  {selectedQuote.isFavorite ? "Unfavorite" : "Favorite"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`${cardClasses} border-t mt-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className={`text-xl font-bold ${textClasses}`}>
                    QuoteVault Pro
                  </span>
                  <div className="text-xs text-purple-500 font-medium">
                    Enterprise Edition
                  </div>
                </div>
              </div>
              <p className={`${mutedTextClasses} mb-6 max-w-md`}>
                The most advanced inspirational quote management platform. Built
                for professionals who understand the power of words.
              </p>
            </div>

            <div>
              <h4 className={`${textClasses} font-semibold mb-4`}>Features</h4>
              <ul className={`${mutedTextClasses} space-y-2 text-sm`}>
                <li>Advanced Search & Filtering</li>
                <li>Quote Analytics Dashboard</li>
                <li>Featured Collections</li>
                <li>Export & Import Tools</li>
                <li>Dark/Light Mode</li>
              </ul>
            </div>

            <div>
              <h4 className={`${textClasses} font-semibold mb-4`}>
                Your Collection
              </h4>
              <div className={`${mutedTextClasses} space-y-2 text-sm`}>
                <div className="flex justify-between">
                  <span>Total Quotes:</span>
                  <span className={`font-medium ${textClasses}`}>
                    {analytics.totalQuotes}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Categories:</span>
                  <span className={`font-medium ${textClasses}`}>
                    {analytics.categories}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Favorites:</span>
                  <span className={`font-medium ${textClasses}`}>
                    {analytics.favoriteQuotes}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Featured:</span>
                  <span className={`font-medium ${textClasses}`}>
                    {analytics.featuredQuotes}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Views:</span>
                  <span className={`font-medium ${textClasses}`}>
                    {analytics.totalViews.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`border-t ${
              isDarkMode ? "border-white/20" : "border-gray-200"
            } mt-8 pt-8 text-center`}
          >
            <p className={`${mutedTextClasses} text-sm`}>
              © 2025 QuoteVault Pro. Empowering minds through curated wisdom.
              <span className={`${textClasses} font-medium ml-2`}>
                Built for Excellence.
              </span>
            </p>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-lg border animate-slide-in ${
              toast.type === "success"
                ? "bg-green-500/20 border-green-500/30 text-green-100"
                : toast.type === "error"
                ? "bg-red-500/20 border-red-500/30 text-red-100"
                : "bg-blue-500/20 border-blue-500/30 text-blue-100"
            }`}
          >
            <div
              className={`p-1 rounded-full ${
                toast.type === "success"
                  ? "bg-green-500"
                  : toast.type === "error"
                  ? "bg-red-500"
                  : "bg-blue-500"
              }`}
            >
              <Check className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="cursor-pointer text-white/60 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        /* Hide scrollbars */
        * {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* Internet Explorer 10+ */
        }

        *::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }

        html, body {
          overflow-x: hidden;
        }

        /* Ensure smooth scrolling */
        * {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default InspirationalQuoteWebsite;

// Zod Schema
export const Schema = {
    "commentary": "Building an inspirational quote website that allows users to add their own quotes, which are then displayed randomly.",
    "template": "nextjs-developer",
    "title": "Quote Website",
    "description": "A website that displays inspirational quotes randomly, allowing users to add their own quotes.",
    "additional_dependencies": ["lucide-react"],
    "has_additional_dependencies": true,
    "install_dependencies_command": "npm i lucide-react",
    "port": 3000,
    "file_path": "pages/index.tsx",
    "code": "<see code above>"
}