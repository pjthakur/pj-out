"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Heart,
  Shuffle,
  Sparkles,
  Zap,
  Target,
  Lightbulb,
  BookOpen,
  Palette,
  Camera,
  Music,
  Pen,
  Globe,
  Star,
  Search,
  Download,
  Share2,
  Settings,
  Moon,
  Sun,
  Menu,
  X,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Award,
  Users,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  PieChart,
} from "lucide-react";

interface Prompt {
  id: number;
  text: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  estimatedTime: string;
  type: "Visual" | "Written" | "Strategic" | "Technical";
}

interface UserStats {
  totalCompleted: number;
  currentStreak: number;
  favoriteCategory: string;
  timeSpent: number;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

// In a real app, this would use localStorage or a database
const useLocalStorage = (key: string, initialValue: any) => {
  // Always start with initial value to match server rendering
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isClient, setIsClient] = useState(false);

  // Hydrate the actual stored value after client-side rendering
  useEffect(() => {
    setIsClient(true);
    try {
      // For demo purposes, we'll simulate persistence using sessionStorage
      // In production, you'd use localStorage
      const item = sessionStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.log("Storage not available");
    }
  }, [key]);

  const setValue = (value: any) => {
    try {
      setStoredValue(value);
      if (isClient) {
        sessionStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.log("Storage not available");
    }
  };

  return [storedValue, setValue];
};

const CREATIVE_PROMPTS: Prompt[] = [
  {
    id: 1,
    text: "Design a mobile app that helps people form better habits through gamification",
    category: "UX/UI",
    difficulty: "Medium",
    tags: ["mobile", "gamification", "habits"],
    estimatedTime: "45 min",
    type: "Technical",
  },
  {
    id: 2,
    text: "Write a short story from the perspective of the last tree on Earth",
    category: "Writing",
    difficulty: "Hard",
    tags: ["environment", "fiction", "dystopian"],
    estimatedTime: "60 min",
    type: "Written",
  },
  {
    id: 3,
    text: "Create a brand identity for a sustainable fashion startup targeting Gen Z",
    category: "Branding",
    difficulty: "Medium",
    tags: ["sustainability", "fashion", "branding"],
    estimatedTime: "90 min",
    type: "Visual",
  },
  {
    id: 4,
    text: "Compose a 30-second jingle for a fictional coffee shop in space",
    category: "Music",
    difficulty: "Easy",
    tags: ["audio", "commercial", "space"],
    estimatedTime: "30 min",
    type: "Technical",
  },
  {
    id: 5,
    text: "Design a public art installation that brings communities together",
    category: "Art",
    difficulty: "Hard",
    tags: ["community", "public art", "social"],
    estimatedTime: "120 min",
    type: "Strategic",
  },
  {
    id: 6,
    text: "Write a product description for a time machine that only goes backwards 5 minutes",
    category: "Copywriting",
    difficulty: "Easy",
    tags: ["humor", "product", "sci-fi"],
    estimatedTime: "20 min",
    type: "Written",
  },
  {
    id: 7,
    text: "Create a photography series capturing 'invisible' emotions",
    category: "Photography",
    difficulty: "Medium",
    tags: ["emotion", "abstract", "series"],
    estimatedTime: "180 min",
    type: "Visual",
  },
  {
    id: 8,
    text: "Design a user interface for controlling dreams",
    category: "UX/UI",
    difficulty: "Hard",
    tags: ["dreams", "interface", "futuristic"],
    estimatedTime: "75 min",
    type: "Technical",
  },
  {
    id: 9,
    text: "Write a haiku about the Internet having feelings",
    category: "Poetry",
    difficulty: "Easy",
    tags: ["technology", "emotion", "poetry"],
    estimatedTime: "15 min",
    type: "Written",
  },
  {
    id: 10,
    text: "Create a logo using only geometric shapes for a meditation app",
    category: "Design",
    difficulty: "Medium",
    tags: ["minimal", "geometric", "wellness"],
    estimatedTime: "40 min",
    type: "Visual",
  },
  {
    id: 11,
    text: "Develop a creative solution to reduce food waste in restaurants",
    category: "Innovation",
    difficulty: "Hard",
    tags: ["sustainability", "business", "innovation"],
    estimatedTime: "90 min",
    type: "Strategic",
  },
  {
    id: 12,
    text: "Write dialogue between two AI assistants falling in love",
    category: "Writing",
    difficulty: "Medium",
    tags: ["AI", "romance", "dialogue"],
    estimatedTime: "35 min",
    type: "Written",
  },
  {
    id: 13,
    text: "Design packaging for a product that doesn't exist yet",
    category: "Product Design",
    difficulty: "Medium",
    tags: ["packaging", "future", "product"],
    estimatedTime: "60 min",
    type: "Visual",
  },
  {
    id: 14,
    text: "Create a dance routine inspired by data visualization",
    category: "Performance",
    difficulty: "Hard",
    tags: ["data", "movement", "performance"],
    estimatedTime: "150 min",
    type: "Technical",
  },
  {
    id: 15,
    text: "Write a review for a restaurant on Mars",
    category: "Creative Writing",
    difficulty: "Easy",
    tags: ["space", "humor", "review"],
    estimatedTime: "25 min",
    type: "Written",
  },
  {
    id: 16,
    text: "Design a board game that teaches empathy",
    category: "Game Design",
    difficulty: "Hard",
    tags: ["empathy", "education", "games"],
    estimatedTime: "180 min",
    type: "Strategic",
  },
  {
    id: 17,
    text: "Create a color palette inspired by your favorite memory",
    category: "Design",
    difficulty: "Easy",
    tags: ["color", "memory", "personal"],
    estimatedTime: "30 min",
    type: "Visual",
  },
  {
    id: 18,
    text: "Write instructions for building happiness from scratch",
    category: "Writing",
    difficulty: "Medium",
    tags: ["happiness", "instructions", "philosophy"],
    estimatedTime: "45 min",
    type: "Written",
  },
  {
    id: 19,
    text: "Design a smart home feature for introverts",
    category: "UX/UI",
    difficulty: "Medium",
    tags: ["smart home", "introvert", "technology"],
    estimatedTime: "55 min",
    type: "Technical",
  },
  {
    id: 20,
    text: "Create a sculpture using only everyday office supplies",
    category: "Art",
    difficulty: "Easy",
    tags: ["sculpture", "office", "upcycling"],
    estimatedTime: "45 min",
    type: "Visual",
  },
  {
    id: 21,
    text: "Write a news report from 100 years in the future",
    category: "Journalism",
    difficulty: "Medium",
    tags: ["future", "news", "speculation"],
    estimatedTime: "40 min",
    type: "Written",
  },
  {
    id: 22,
    text: "Design a social platform for connecting with your past selves",
    category: "Product Design",
    difficulty: "Hard",
    tags: ["social", "time", "self-reflection"],
    estimatedTime: "120 min",
    type: "Strategic",
  },
  {
    id: 23,
    text: "Create a recipe that tells a story with each ingredient",
    category: "Culinary Arts",
    difficulty: "Medium",
    tags: ["food", "storytelling", "recipe"],
    estimatedTime: "50 min",
    type: "Written",
  },
  {
    id: 24,
    text: "Write a love letter from Earth to the Moon",
    category: "Poetry",
    difficulty: "Easy",
    tags: ["astronomy", "romance", "poetry"],
    estimatedTime: "20 min",
    type: "Written",
  },
  {
    id: 25,
    text: "Design a voting system that encourages participation through creativity",
    category: "Civic Design",
    difficulty: "Hard",
    tags: ["civic", "democracy", "engagement"],
    estimatedTime: "100 min",
    type: "Strategic",
  },
];

const CATEGORIES = [
  "All",
  "UX/UI",
  "Writing",
  "Design",
  "Art",
  "Photography",
  "Music",
  "Innovation",
  "Poetry",
  "Branding",
  "Copywriting",
  "Product Design",
  "Performance",
  "Creative Writing",
  "Game Design",
  "Journalism",
  "Culinary Arts",
  "Civic Design",
];
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];
const TYPES = ["All", "Visual", "Written", "Strategic", "Technical"];

const PromptJournal: React.FC = () => {
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [favorites, setBookmarks] = useLocalStorage(
    "creativeflow-favorites",
    new Set()
  );
  const [seenPrompts, setSeenPrompts] = useState<Set<number>>(new Set());
  const [completedPrompts, setCompletedPrompts] = useLocalStorage(
    "creativeflow-completed",
    new Set()
  );
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [darkMode, setDarkMode] = useLocalStorage(
    "creativeflow-darkmode",
    false
  );
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [activeTab, setActiveTab] = useState("generator");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [userStats, setUserStats] = useLocalStorage("creativeflow-stats", {
    totalCompleted: 0,
    currentStreak: 3,
    favoriteCategory: "Design",
    timeSpent: 247,
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  // Add tab transition state
  const [tabTransition, setTabTransition] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Convert Set to Array for persistence and back
  const favoritesArray = Array.from(favorites);
  const completedArray = Array.from(completedPrompts);

  // Toast functionality
  const showToast = (message: string, type: "success" | "error" | "info" = "info", duration: number = 4000) => {
    const id = Date.now();
    const newToast: Toast = { id, message, type, duration };
    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  };

  const dismissToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const filteredPrompts = CREATIVE_PROMPTS.filter((prompt) => {
    const matchesSearch =
      searchQuery === "" ||
      prompt.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "All" || prompt.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "All" || prompt.difficulty === selectedDifficulty;
    const matchesType = selectedType === "All" || prompt.type === selectedType;

    if (activeTab === "favorites") {
      return (
        matchesSearch &&
        matchesCategory &&
        matchesDifficulty &&
        matchesType &&
        favoritesArray.includes(prompt.id)
      );
    }

    // For library tab, don't apply showOnlyFavorites filter
    return (
      matchesSearch &&
      matchesCategory &&
      matchesDifficulty &&
      matchesType
    );
  });

  // Separate filtering for generator tab (includes showOnlyFavorites)
  const getGeneratorFilteredPrompts = () => {
    return CREATIVE_PROMPTS.filter((prompt) => {
      const matchesSearch =
        searchQuery === "" ||
        prompt.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === "All" || prompt.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === "All" || prompt.difficulty === selectedDifficulty;
      const matchesType = selectedType === "All" || prompt.type === selectedType;
      const matchesBookmarks =
        !showOnlyFavorites || favoritesArray.includes(prompt.id);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDifficulty &&
        matchesType &&
        matchesBookmarks
      );
    });
  };

  const getRandomPrompt = () => {
    const generatorPrompts = getGeneratorFilteredPrompts();
    const availablePrompts = generatorPrompts.filter(
      (p) => !seenPrompts.has(p.id)
    );

    if (availablePrompts.length === 0) {
      if (generatorPrompts.length === 0) return null;
      setSeenPrompts(new Set());
      return generatorPrompts[
        Math.floor(Math.random() * generatorPrompts.length)
      ];
    }

    return availablePrompts[
      Math.floor(Math.random() * availablePrompts.length)
    ];
  };

  const handleNewPrompt = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const newPrompt = getRandomPrompt();
      if (newPrompt) {
        setCurrentPrompt(newPrompt);
        setSeenPrompts((prev) => new Set([...prev, newPrompt.id]));
        resetTimer();
      } else {
        // Clear current prompt if no prompts are available
        setCurrentPrompt(null);
      }
      setIsAnimating(false);
    }, 300);
  };

  const toggleFavorite = (promptId: number) => {
    const newBookmarks = new Set(favoritesArray);
    if (newBookmarks.has(promptId)) {
      newBookmarks.delete(promptId);
    } else {
      newBookmarks.add(promptId);
    }
    setBookmarks(newBookmarks);
  };

  const markComplete = (promptId: number) => {
    const newCompleted = new Set(completedArray);
    newCompleted.add(promptId);
    setCompletedPrompts(newCompleted);

    const newStats = {
      ...userStats,
      totalCompleted: userStats.totalCompleted + 1,
      timeSpent: userStats.timeSpent + Math.floor(timerSeconds / 60),
    };
    setUserStats(newStats);

    pauseTimer();

    // Show completion feedback
    showToast(
      `🎉 Congratulations! You've completed this prompt in ${formatTime(
        timerSeconds
      )}!`,
      "success",
      5000
    );
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const exportPrompts = () => {
    const bookmarkedPrompts = CREATIVE_PROMPTS.filter((p) =>
      favoritesArray.includes(p.id)
    );
    const data = JSON.stringify(bookmarkedPrompts, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `creativeflow-favorites-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sharePrompt = async () => {
    if (!currentPrompt) return;

    const shareText = `Check out this creative prompt: "${currentPrompt.text}" - via CreativeFlow Professional`;

    // Try native sharing first if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Creative Prompt from CreativeFlow",
          text: shareText,
          url: window.location.href,
        });
        return; // Exit early if sharing was successful
      } catch (err) {
        console.log("Error sharing:", err);
        // Fall through to clipboard copy
      }
    }

    // Fallback to clipboard copy
    try {
      await navigator.clipboard.writeText(shareText);
      showToast("Prompt copied to clipboard!", "success");
    } catch (err) {
      console.log("Error copying to clipboard:", err);
      showToast("Failed to copy prompt", "error");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Easy: darkMode
        ? "text-emerald-400 bg-emerald-900/30"
        : "text-emerald-600 bg-emerald-50",
      Medium: darkMode
        ? "text-amber-400 bg-amber-900/30"
        : "text-amber-600 bg-amber-50",
      Hard: darkMode ? "text-red-400 bg-red-900/30" : "text-red-600 bg-red-50",
    };
    return (
      colors[difficulty as keyof typeof colors] || "text-gray-600 bg-gray-50"
    );
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      "UX/UI": <Target className="w-4 h-4" />,
      Writing: <Pen className="w-4 h-4" />,
      Branding: <Star className="w-4 h-4" />,
      Music: <Music className="w-4 h-4" />,
      Art: <Palette className="w-4 h-4" />,
      Photography: <Camera className="w-4 h-4" />,
      Design: <Lightbulb className="w-4 h-4" />,
      Innovation: <Zap className="w-4 h-4" />,
      "Product Design": <BookOpen className="w-4 h-4" />,
      Performance: <Music className="w-4 h-4" />,
      "Game Design": <Target className="w-4 h-4" />,
      Journalism: <Globe className="w-4 h-4" />,
    };
    return iconMap[category] || <Sparkles className="w-4 h-4" />;
  };

  useEffect(() => {
    if (activeTab === "generator" && !currentPrompt) {
      handleNewPrompt();
    }
  }, [activeTab]);

  // Handle favorites-only toggle changes
  useEffect(() => {
    if (activeTab === "generator") {
      if (showOnlyFavorites && currentPrompt && !favoritesArray.includes(currentPrompt.id)) {
        // Clear current prompt if it's not a favorite and favorites-only is active
        setCurrentPrompt(null);
        // Generate a new prompt that matches the favorites filter
        setTimeout(() => handleNewPrompt(), 100);
      } else if (!showOnlyFavorites && !currentPrompt) {
        // Generate a new prompt when favorites filter is turned off and no prompt is shown
        setTimeout(() => handleNewPrompt(), 100);
      }
    }
  }, [showOnlyFavorites, favoritesArray, currentPrompt, activeTab]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);



  const themeClass = darkMode
    ? "dark bg-gray-900"
    : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100";
  const cardClass = darkMode
    ? "bg-gray-800/80 border-gray-700/50"
    : "bg-white/80 border-gray-200/50";
  const textClass = darkMode ? "text-gray-100" : "text-gray-900";
  const textSecondaryClass = darkMode ? "text-gray-300" : "text-gray-600";

  // Handle tab switching with animation
  const handleTabSwitch = (newTab: string) => {
    setTabTransition(true);
    setTimeout(() => {
      setActiveTab(newTab);
      setTabTransition(false);
    }, 150);
  };

  return (
    <motion.div 
      className={`min-h-screen transition-all duration-500 font-[Roboto] ${themeClass}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Navigation */}
      <motion.nav
        className={`${cardClass} backdrop-blur-lg sticky top-0 z-50 transition-all duration-300`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  CreativeFlow
                </span>
                <div className="text-xs text-gray-500 font-medium">
                  Professional Edition
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <button
                onClick={() => handleTabSwitch("generator")}
                className={`cursor-pointer ${
                  activeTab === "generator"
                    ? "text-indigo-600"
                    : textSecondaryClass
                } hover:text-indigo-600 transition-colors font-semibold`}
              >
                Generator
              </button>
              <button
                onClick={() => handleTabSwitch("analytics")}
                className={`cursor-pointer ${
                  activeTab === "analytics"
                    ? "text-indigo-600"
                    : textSecondaryClass
                } hover:text-indigo-600 transition-colors font-semibold`}
              >
                Analytics
              </button>
              <button
                onClick={() => handleTabSwitch("library")}
                className={`cursor-pointer ${
                  activeTab === "library"
                    ? "text-indigo-600"
                    : textSecondaryClass
                } hover:text-indigo-600 transition-colors font-semibold`}
              >
                Library
              </button>
              <button
                onClick={() => handleTabSwitch("favorites")}
                className={`cursor-pointer ${
                  activeTab === "favorites"
                    ? "text-indigo-600"
                    : textSecondaryClass
                } hover:text-indigo-600 transition-colors font-semibold flex items-center space-x-1`}
              >
                <Heart className="w-4 h-4" />
                <span>Favorites ({favoritesArray.length})</span>
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`cursor-pointer ${textSecondaryClass} hover:text-indigo-600 transition-colors font-semibold flex items-center space-x-1`}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span>{darkMode ? 'Light' : 'Dark'} Mode</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`cursor-pointer lg:hidden p-2 rounded-lg ${textClass} hover:bg-gray-100/50 ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100/50'} transition-colors duration-200`}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className={`lg:hidden border-t py-4 ${darkMode ? "border-gray-700/50" : "border-gray-200/50"}`}>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    handleTabSwitch("generator");
                    setMobileMenuOpen(false);
                  }}
                  className={`cursor-pointer block w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === "generator"
                      ? "bg-indigo-500 text-white shadow-lg"
                      : `${textClass} ${darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100/50"}`
                  }`}
                >
                  Generator
                </button>
                <button
                  onClick={() => {
                    handleTabSwitch("analytics");
                    setMobileMenuOpen(false);
                  }}
                  className={`cursor-pointer block w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === "analytics"
                      ? "bg-indigo-500 text-white shadow-lg"
                      : `${textClass} ${darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100/50"}`
                  }`}
                >
                  Analytics
                </button>
                <button
                  onClick={() => {
                    handleTabSwitch("library");
                    setMobileMenuOpen(false);
                  }}
                  className={`cursor-pointer block w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === "library"
                      ? "bg-indigo-500 text-white shadow-lg"
                      : `${textClass} ${darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100/50"}`
                  }`}
                >
                  Library
                </button>
                <button
                  onClick={() => {
                    handleTabSwitch("favorites");
                    setMobileMenuOpen(false);
                  }}
                  className={`cursor-pointer block w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === "favorites"
                      ? "bg-indigo-500 text-white shadow-lg"
                      : `${textClass} ${darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100/50"}`
                  }`}
                >
                  Favorites ({favoritesArray.length})
                </button>
                <button
                  onClick={() => {
                    setDarkMode(!darkMode);
                    setMobileMenuOpen(false);
                  }}
                  className={`cursor-pointer block w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${textClass} ${darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100/50"} flex items-center space-x-2`}
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{darkMode ? 'Light' : 'Dark'} Mode</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={tabTransition ? "opacity-50" : "opacity-100"}
        >
          {activeTab === "generator" && (
            <div>
            {/* Hero Section */}
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1
                className={`md:text-6xl text-5xl font-bold ${textClass} mb-6 leading-tight`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Professional Creative
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  Intelligence{" "}
                </span>
                Platform
              </motion.h1>
              <motion.p
                className={`md:text-xl text-lg ${textSecondaryClass} mb-8 md:max-w-3xl mx-auto leading-relaxed`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Advanced prompt generation system trusted by creative
                professionals worldwide. AI-powered insights, analytics, and
                workflow optimization for maximum creative output.
              </motion.p>

              {/* Key Metrics */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <motion.div
                  className={`${cardClass} backdrop-blur-sm rounded-2xl p-6 hover:shadow-xl transition-all duration-300`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl font-bold text-indigo-600 mb-2">
                    25+
                  </div>
                  <div className={`${textSecondaryClass} font-medium`}>
                    Premium Prompts
                  </div>
                </motion.div>
                <motion.div
                  className={`${cardClass} backdrop-blur-sm rounded-2xl p-6 hover:shadow-xl transition-all duration-300`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {userStats.currentStreak}
                  </div>
                  <div className={`${textSecondaryClass} font-medium`}>
                    Day Streak
                  </div>
                </motion.div>
                <motion.div
                  className={`${cardClass} backdrop-blur-sm rounded-2xl p-6 hover:shadow-xl transition-all duration-300`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {favoritesArray.length}
                  </div>
                  <div className={`${textSecondaryClass} font-medium`}>
                    Favorited
                  </div>
                </motion.div>
                <motion.div
                  className={`${cardClass} backdrop-blur-sm rounded-2xl p-6 hover:shadow-xl transition-all duration-300`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {userStats.timeSpent}h
                  </div>
                  <div className={`${textSecondaryClass} font-medium`}>
                    Time Invested
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Simple Controls */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <motion.button
                onClick={handleNewPrompt}
                disabled={isAnimating}
                className="cursor-pointer group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 font-semibold text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Shuffle
                  className={`w-6 h-6 transition-transform duration-300 ${
                    isAnimating ? "animate-spin" : "group-hover:rotate-180"
                  }`}
                />
                <span>Generate New Prompt</span>
              </motion.button>

              <motion.button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`cursor-pointer px-8 py-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold text-lg ${
                  showOnlyFavorites
                    ? "bg-pink-500 text-white border-pink-500 hover:bg-pink-600"
                    : `${cardClass} ${textClass} hover:border-pink-300 hover:text-pink-600`
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Heart className="w-6 h-6" />
                <span>Favorites Only</span>
              </motion.button>
            </motion.div>

            {/* Timer & Progress */}
            {currentPrompt && (
              <div
                className={`${cardClass} backdrop-blur-sm rounded-3xl p-4 sm:p-6 mb-8 shadow-lg`}
              >
                {/* Mobile Layout */}
                <div className="flex flex-col space-y-4 md:hidden">
                  {/* Timer and Controls Row */}
                  <div className="flex items-center justify-between">
                    <div className="text-3xl sm:text-4xl font-mono font-bold text-indigo-600">
                      {formatTime(timerSeconds)}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={isTimerRunning ? pauseTimer : startTimer}
                        className="cursor-pointer p-2.5 sm:p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300"
                      >
                        {isTimerRunning ? (
                          <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>
                      <button
                        onClick={resetTimer}
                        className="cursor-pointer p-2.5 sm:p-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300"
                      >
                        <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Estimated Time */}
                  <div className={`text-sm ${textSecondaryClass} text-center`}>
                    Estimated: {currentPrompt.estimatedTime}
                  </div>
                  
                  {/* Action Buttons Row */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={sharePrompt}
                      className="cursor-pointer bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold flex-1"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <button
                      onClick={() =>
                        currentPrompt && markComplete(currentPrompt.id)
                      }
                      disabled={completedArray.includes(currentPrompt.id)}
                      className={`cursor-pointer px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 font-semibold flex-1 ${
                        completedArray.includes(currentPrompt.id)
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        {completedArray.includes(currentPrompt.id)
                          ? "Completed"
                          : "Mark Complete"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl font-mono font-bold text-indigo-600">
                      {formatTime(timerSeconds)}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={isTimerRunning ? pauseTimer : startTimer}
                        className="cursor-pointer p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300"
                      >
                        {isTimerRunning ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={resetTimer}
                        className="cursor-pointer p-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`text-sm ${textSecondaryClass}`}>
                      Estimated: {currentPrompt.estimatedTime}
                    </div>
                    <button
                      onClick={sharePrompt}
                      className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2 font-semibold"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                    <button
                      onClick={() =>
                        currentPrompt && markComplete(currentPrompt.id)
                      }
                      disabled={completedArray.includes(currentPrompt.id)}
                      className={`cursor-pointer px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 font-semibold ${
                        completedArray.includes(currentPrompt.id)
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>
                        {completedArray.includes(currentPrompt.id)
                          ? "Completed"
                          : "Mark Complete"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Current Prompt Display */}
            <AnimatePresence mode="wait">
              {currentPrompt && (!showOnlyFavorites || favoritesArray.includes(currentPrompt.id)) ? (
                <motion.div
                  key={currentPrompt.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`${cardClass} backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500`}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                <div className="mb-8">
                  {/* Desktop layout - hidden on mobile */}
                  <div className="hidden md:flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                        {getCategoryIcon(currentPrompt.category)}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`text-lg font-semibold ${textClass}`}
                          >
                            {currentPrompt.category}
                          </span>
                          <div
                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(
                              currentPrompt.difficulty
                            )}`}
                          >
                            {currentPrompt.difficulty}
                          </div>
                          <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                            {currentPrompt.type}
                          </div>
                          {completedArray.includes(currentPrompt.id) && (
                            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center space-x-1">
                              <CheckCircle className="w-4 h-4" />
                              <span>Completed</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {currentPrompt.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`px-2 py-1 bg-gray-100 ${
                                darkMode
                                  ? "bg-gray-700 text-gray-300"
                                  : "text-gray-600"
                              } rounded-md text-xs`}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(currentPrompt.id)}
                      className={`cursor-pointer p-4 rounded-full transition-all duration-300 hover:scale-110 relative ${
                        favoritesArray.includes(currentPrompt.id)
                          ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg ring-2 ring-pink-200"
                          : "bg-gray-100 text-gray-400 hover:bg-pink-50 hover:text-pink-500"
                      }`}
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          favoritesArray.includes(currentPrompt.id)
                            ? "fill-current animate-pulse"
                            : ""
                        }`}
                      />
                      {favoritesArray.includes(currentPrompt.id) && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Star className="w-2.5 h-2.5 text-yellow-800 fill-current" />
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Mobile layout - hidden on desktop */}
                  <div className="md:hidden space-y-3">
                    {/* First line: Icon + Category */}
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                        {getCategoryIcon(currentPrompt.category)}
                      </div>
                      <span className={`text-lg font-semibold ${textClass}`}>
                        {currentPrompt.category}
                      </span>
                    </div>

                    {/* Second line: Badges + Like button */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-2 flex-1">
                        <div
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(
                            currentPrompt.difficulty
                          )}`}
                        >
                          {currentPrompt.difficulty}
                        </div>
                        <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                          {currentPrompt.type}
                        </div>
                        {completedArray.includes(currentPrompt.id) && (
                          <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>Completed</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => toggleFavorite(currentPrompt.id)}
                        className={`cursor-pointer p-3 rounded-full transition-all duration-300 hover:scale-110 flex-shrink-0 relative ${
                          favoritesArray.includes(currentPrompt.id)
                            ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg ring-2 ring-pink-200"
                            : "bg-gray-100 text-gray-400 hover:bg-pink-50 hover:text-pink-500"
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favoritesArray.includes(currentPrompt.id)
                              ? "fill-current animate-pulse"
                              : ""
                          }`}
                        />
                        {favoritesArray.includes(currentPrompt.id) && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Star className="w-2 h-2 text-yellow-800 fill-current" />
                          </div>
                        )}
                      </button>
                    </div>

                    {/* Third line: Tags */}
                    <div className="flex flex-wrap gap-2">
                      {currentPrompt.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-1 bg-gray-100 ${
                            darkMode
                              ? "bg-gray-700 text-gray-300"
                              : "text-gray-600"
                          } rounded-md text-xs`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Main Prompt Display */}
                <div className="relative mb-8">
                  {/* Main prompt container */}
                  <div className={`relative ${darkMode ? 'bg-gray-800/40' : 'bg-gray-50/60'} backdrop-blur-sm border ${darkMode ? 'border-gray-600/30' : 'border-gray-200/40'} rounded-xl p-6 md:p-8`}>
                    {/* Prompt label */}
                    <div className="flex items-center justify-center mb-4">
                      <div className={`flex items-center space-x-2 px-3 py-1.5 ${darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100/80 text-gray-600'} rounded-full text-xs font-medium`}>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Creative Prompt</span>
                      </div>
                    </div>
                    
                    {/* Main prompt text */}
                    <div className={`text-center text-xl md:text-2xl ${textClass} leading-relaxed font-medium mb-4`}>
                      "{currentPrompt.text}"
                    </div>
                    
                    {/* Visual accent line */}
                    <div className="flex justify-center">
                      <div className={`w-16 h-0.5 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full`}></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                    <h4 className="font-semibold text-indigo-900 mb-3 flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      Pro Tips
                    </h4>
                    <ul className="text-sm text-indigo-800 space-y-2">
                      <li>
                        • Break down the challenge into smaller components
                      </li>
                      <li>• Research similar projects for inspiration</li>
                      <li>• Set a timer to maintain focus and momentum</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      Success Metrics
                    </h4>
                    <ul className="text-sm text-green-800 space-y-2">
                      <li>• Clear concept development</li>
                      <li>• Original approach or perspective</li>
                      <li>• Attention to target audience</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div
                className={`${cardClass} backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center`}
              >
                {favoritesArray.length === 0 ? (
                  <>
                    <Heart className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                    <p className={`text-xl ${textSecondaryClass} mb-4`}>
                      No favorite prompts yet!
                    </p>
                    <p className={`${textSecondaryClass} mb-6`}>
                      Start exploring prompts and mark your favorites to build your personal collection.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => setShowOnlyFavorites(false)}
                        className="cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all duration-300"
                      >
                        Browse All Prompts
                      </button>
                      <button
                        onClick={() => handleTabSwitch("library")}
                        className="cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                      >
                        Explore Library
                      </button>
                    </div>
                  </>
                ) : showOnlyFavorites ? (
                  <>
                    <Heart className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                    <p className={`text-xl ${textSecondaryClass} mb-4`}>
                      No favorite prompts available right now.
                    </p>
                    <p className={`${textSecondaryClass} mb-6`}>
                      Generate new prompts to find ones you'd like to favorite.
                    </p>
                    <button
                      onClick={() => setShowOnlyFavorites(false)}
                      className="cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all duration-300"
                    >
                      Browse All Prompts
                    </button>
                  </>
                ) : (
                  <>
                    <Shuffle className="w-16 h-16 text-indigo-300 mx-auto mb-4" />
                    <p className={`text-xl ${textSecondaryClass} mb-4`}>
                      No prompts available.
                    </p>
                    <p className={`${textSecondaryClass} mb-6`}>
                      Try generating a new prompt or check your filters.
                    </p>
                    <button
                      onClick={handleNewPrompt}
                      className="cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all duration-300"
                    >
                      Generate New Prompt
                    </button>
                  </>
                )}
              </div>
            )}
            </AnimatePresence>
          </div>
        )}

          {(activeTab === "library" || activeTab === "favorites") && (
            <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className={`text-4xl font-bold ${textClass} mb-4`}>
                {activeTab === "favorites"
                  ? "Your Favorite Prompts"
                  : "Creative Library"}
              </h2>
              <p className={`text-lg ${textSecondaryClass}`}>
                {activeTab === "favorites"
                  ? `${favoritesArray.length} favorite prompts ready for your next creative session`
                  : "Browse, search, and organize your complete creative prompt collection"}
              </p>
            </div>

            {/* Advanced Filters */}
            <div
              className={`${cardClass} backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-lg`}
            >
              <h3 className={`text-lg font-semibold ${textClass} mb-6`}>
                Advanced Filtering & Search
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search prompts, tags, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white"
                    }`}
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`cursor-pointer px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white"
                  }`}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} Category
                    </option>
                  ))}
                </select>

                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className={`cursor-pointer px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white"
                  }`}
                >
                  {DIFFICULTIES.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff} Difficulty
                    </option>
                  ))}
                </select>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className={`cursor-pointer px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white"
                  }`}
                >
                  {TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type} Type
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSelectedDifficulty("All");
                    setSelectedType("All");
                  }}
                  className={`cursor-pointer w-full sm:w-auto px-6 py-3 rounded-xl border-2 ${cardClass} ${textClass} hover:border-indigo-300 hover:text-indigo-600 transition-all duration-300 font-semibold`}
                >
                  Clear Filters
                </button>

                {activeTab === "favorites" && (
                  <button
                    onClick={exportPrompts}
                    className={`cursor-pointer w-full sm:w-auto px-6 py-3 rounded-xl border-2 ${cardClass} ${textClass} hover:border-green-300 hover:text-green-600 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold`}
                  >
                    <Download className="w-5 h-5" />
                    <span>Export Favorites</span>
                  </button>
                )}

                <div
                  className={`w-full sm:w-auto px-4 py-3 rounded-xl ${cardClass} ${textSecondaryClass} text-sm text-center sm:text-left`}
                >
                  Showing {filteredPrompts.length} prompt
                  {filteredPrompts.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>

            {filteredPrompts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrompts.map((prompt) => (
                  <div
                    key={prompt.id}
                    className={`${cardClass} backdrop-blur-sm rounded-2xl p-6 hover:shadow-xl transition-all duration-300 flex flex-col h-full`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                          {getCategoryIcon(prompt.category)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500">
                            {prompt.category}
                          </div>
                          <div
                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
                              prompt.difficulty
                            )}`}
                          >
                            {prompt.difficulty}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {completedArray.includes(prompt.id) && (
                          <div className="p-2 bg-green-100 text-green-600 rounded-full">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        )}
                        <button
                          onClick={() => toggleFavorite(prompt.id)}
                          className={`cursor-pointer p-2 rounded-full transition-all duration-300 ${
                            favoritesArray.includes(prompt.id)
                              ? "bg-pink-500 text-white"
                              : "bg-gray-100 text-gray-400 hover:bg-pink-50 hover:text-pink-500"
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              favoritesArray.includes(prompt.id)
                                ? "fill-current"
                                : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <p
                      className={`${textClass} text-sm leading-relaxed mb-4 flex-grow`}
                    >
                      {prompt.text}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-wrap gap-1">
                        {prompt.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-1 bg-gray-100 ${
                              darkMode
                                ? "bg-gray-700 text-gray-300"
                                : "text-gray-600"
                            } rounded-md text-xs`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className={`text-xs ${textSecondaryClass}`}>
                        {prompt.estimatedTime}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentPrompt(prompt);
                        setShowOnlyFavorites(false); // Reset favorites filter when starting challenge from library
                        handleTabSwitch("generator");
                        resetTimer();
                      }}
                      className="cursor-pointer w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center justify-center space-x-2 mt-auto"
                    >
                      <span>Start Challenge</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`${cardClass} backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center`}
              >
                {activeTab === "favorites" ? (
                  <>
                    <Heart className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                    <p className={`text-xl ${textSecondaryClass} mb-4`}>
                      No favorite prompts yet!
                    </p>
                    <p className={`${textSecondaryClass} mb-6`}>
                      Start exploring prompts and mark your favorites to
                      build your personal collection.
                    </p>
                    <button
                      onClick={() => handleTabSwitch("library")}
                      className="cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      Browse Library
                    </button>
                  </>
                ) : (
                  <>
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className={`text-xl ${textSecondaryClass} mb-4`}>
                      No prompts match your search criteria.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("All");
                        setSelectedDifficulty("All");
                        setSelectedType("All");
                      }}
                      className="cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all duration-300"
                    >
                      Clear All Filters
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className={`text-4xl font-bold ${textClass} mb-4`}>
                Creative Analytics Dashboard
              </h2>
              <p className={`text-lg ${textSecondaryClass}`}>
                Track your creative progress and optimize your workflow
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Performance Metrics */}
              <div
                className={`${cardClass} backdrop-blur-sm rounded-3xl p-8 shadow-lg`}
              >
                <h3
                  className={`text-xl font-semibold ${textClass} mb-6 flex items-center`}
                >
                  <TrendingUp className="w-6 h-6 mr-2 text-indigo-600" />
                  Performance Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={textSecondaryClass}>Completion Rate</span>
                    <span className="font-bold text-green-600">
                      {Math.round(
                        (completedArray.length / CREATIVE_PROMPTS.length) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (completedArray.length / CREATIVE_PROMPTS.length) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={textSecondaryClass}>Total Completed</span>
                    <span className="font-bold text-blue-600">
                      {userStats.totalCompleted}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={textSecondaryClass}>Favorited</span>
                    <span className="font-bold text-pink-600">
                      {favoritesArray.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={textSecondaryClass}>Time Invested</span>
                    <span className="font-bold text-purple-600">
                      {userStats.timeSpent}h
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div
                className={`${cardClass} backdrop-blur-sm rounded-3xl p-8 shadow-lg`}
              >
                <h3
                  className={`text-xl font-semibold ${textClass} mb-6 flex items-center`}
                >
                  <PieChart className="w-6 h-6 mr-2 text-purple-600" />
                  Category Distribution
                </h3>
                <div className="space-y-3">
                  {["Design", "Writing", "UX/UI", "Art", "Innovation"].map(
                    (cat, idx) => {
                      const categoryPrompts = CREATIVE_PROMPTS.filter((p) => {
                        if (cat === "Design") {
                          return p.category.includes("Design") || p.category === "Branding";
                        }
                        if (cat === "Writing") {
                          return p.category.includes("Writing") || p.category === "Copywriting" || p.category === "Poetry" || p.category === "Journalism";
                        }
                        if (cat === "UX/UI") {
                          return p.category === "UX/UI";
                        }
                        if (cat === "Art") {
                          return p.category === "Art" || p.category === "Photography" || p.category === "Performance" || p.category === "Culinary Arts";
                        }
                        if (cat === "Innovation") {
                          return p.category === "Innovation" || p.category === "Music" || p.category === "Game Design";
                        }
                        return p.category === cat;
                      });
                      const completedInCategory = categoryPrompts.filter((p) =>
                        completedArray.includes(p.id)
                      ).length;
                      const percentage =
                        categoryPrompts.length > 0
                          ? Math.round(
                              (completedInCategory / categoryPrompts.length) *
                                100
                            )
                          : 0;

                      return (
                        <div
                          key={cat}
                          className="flex items-center gap-3"
                        >
                          <span className={`${textSecondaryClass} flex-shrink-0`} style={{ width: '85px' }}>
                            {cat}
                          </span>
                          <div className={`flex-1 rounded-full h-2.5 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                            <div
                              className={`h-2.5 rounded-full transition-all duration-300 ${
                                [
                                  "bg-blue-500",
                                  "bg-green-500",
                                  "bg-purple-500",
                                  "bg-yellow-500",
                                  "bg-red-500",
                                ][idx]
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-semibold ${textClass} flex-shrink-0`} style={{ width: '35px', textAlign: 'right' }}>
                            {percentage}%
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Achievements */}
              <div
                className={`${cardClass} backdrop-blur-sm rounded-3xl p-8 shadow-lg`}
              >
                <h3
                  className={`text-xl font-semibold ${textClass} mb-6 flex items-center`}
                >
                  <Award className="w-6 h-6 mr-2 text-yellow-600" />
                  Recent Achievements
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-yellow-800">
                        Creative Streak
                      </div>
                      <div className="text-sm text-yellow-600">
                        {userStats.currentStreak} days in a row
                      </div>
                    </div>
                  </div>
                  {completedArray.length > 0 && (
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-green-800">
                          First Completion
                        </div>
                        <div className="text-sm text-green-600">
                          You've completed your first prompt!
                        </div>
                      </div>
                    </div>
                  )}
                  {favoritesArray.length >= 5 && (
                    <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
                      <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white fill-current" />
                      </div>
                      <div>
                        <div className="font-semibold text-pink-800">
                          Curator
                        </div>
                        <div className="text-sm text-pink-600">
                          5+ prompts favorited
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        </motion.div>
      </main>

      {/* Toast Container */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`max-w-sm p-4 rounded-xl shadow-lg backdrop-blur-lg ${
                toast.type === "success"
                  ? "bg-green-500/90 text-white"
                  : toast.type === "error"
                  ? "bg-red-500/90 text-white"
                  : "bg-blue-500/90 text-white"
              }`}
            >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {toast.type === "success" && (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  {toast.type === "error" && (
                    <X className="w-5 h-5" />
                  )}
                  {toast.type === "info" && (
                    <Lightbulb className="w-5 h-5" />
                  )}
                </div>
                <p className="text-sm font-medium flex-1">{toast.message}</p>
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="cursor-pointer ml-3 p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className={`mt-12 ${cardClass} backdrop-blur-sm border-t`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    CreativeFlow
                  </span>
                  <div className="text-xs text-gray-500 font-medium">
                    Professional Edition
                  </div>
                </div>
              </div>
              <p
                className={`${textSecondaryClass} mb-6 max-w-md leading-relaxed`}
              >
                Empowering creative professionals worldwide with AI-driven
                prompt generation, advanced analytics, and workflow optimization
                tools.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="cursor-pointer w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  F
                </a>
                <a
                  href="#"
                  className="cursor-pointer w-12 h-12 bg-gradient-to-r from-sky-400 to-sky-500 text-white rounded-xl hover:from-sky-500 hover:to-sky-600 transition-all duration-300 flex items-center justify-center font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  T
                </a>
                <a
                  href="#"
                  className="cursor-pointer w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  L
                </a>
                <a
                  href="#"
                  className="cursor-pointer w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  I
                </a>
              </div>
            </div>

            <div>
              <h4 className={`font-semibold ${textClass} mb-6`}>Product</h4>
              <ul className={`space-y-3 ${textSecondaryClass}`}>
                <li>
                  <a
                    href="#"
                    className="cursor-pointer hover:text-indigo-600 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="cursor-pointer hover:text-indigo-600 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="cursor-pointer hover:text-indigo-600 transition-colors"
                  >
                    API Access
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="cursor-pointer hover:text-indigo-600 transition-colors"
                  >
                    Enterprise
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="cursor-pointer hover:text-indigo-600 transition-colors"
                  >
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className={`font-semibold ${textClass} mb-6`}>Company</h4>
              <ul className={`space-y-3 ${textSecondaryClass}`}>
                <li>
                  <a
                    href="#"
                    className="cursor-pointer hover:text-indigo-600 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="cursor-pointer hover:text-indigo-600 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="cursor-pointer hover:text-indigo-600 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="cursor-pointer hover:text-indigo-600 transition-colors"
                  >
                    Press Kit
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="cursor-pointer hover:text-indigo-600 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div
            className={`border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            } pt-8 mt-12`}
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className={`text-sm ${textSecondaryClass} mb-4 md:mb-0`}>
                © 2025 CreativeFlow Professional. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm">
                <a
                  href="#"
                  className={`cursor-pointer ${textSecondaryClass} hover:text-indigo-600 transition-colors`}
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className={`cursor-pointer ${textSecondaryClass} hover:text-indigo-600 transition-colors`}
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className={`cursor-pointer ${textSecondaryClass} hover:text-indigo-600 transition-colors`}
                >
                  Security
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");
      `}</style>
    </motion.div>
  );
};

export default PromptJournal;