"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Trophy,
  Shuffle,
  Grid3X3,
  Circle,
  Square,
  Triangle,
  Star,
  Hexagon,
  Users,
  Zap,
  Target,
  Search,
  Filter,
  Clock,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Award,
  TrendingUp,
  Settings,
  Moon,
  Sun,
  Download,
  Share2,
  BarChart3,
  Calendar,
  Tag,
  Eye,
  Heart,
  MessageSquare,
  Bookmark,
  ArrowRight,
  CheckCircle2,
  Timer,
  Lightbulb,
  Palette,
  Code,
  Layers,
  Database,
  Bell,
  User,
  ChevronDown,
  Menu,
  X,
  Home,
  Activity,
  Archive,
  Plus,
  Edit3,
  ExternalLink,
} from "lucide-react";

interface Challenge {
  id: number;
  title: string;
  description: string;
  detailedDescription: string;
  shape: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  category: string;
  tags: string[];
  likes: number;
  views: number;
  completions: number;
  dateAdded: string;
  featured: boolean;
}

interface UserStats {
  totalCompleted: number;
  streakDays: number;
  totalTimeSpent: number;
  favoriteShape: string;
  rank: string;
  points: number;
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "Geometric Loader",
    description:
      "Create an animated loading spinner using only triangles that rotate and scale",
    detailedDescription:
      "Design a sophisticated loading animation that uses triangular shapes in various sizes. The animation should demonstrate smooth rotation, scaling effects, and color transitions. Consider using CSS transforms and keyframe animations for optimal performance.",
    shape: "triangles",
    difficulty: "Beginner",
    estimatedTime: "15 min",
    category: "Animation",
    tags: ["loader", "animation", "css", "triangles"],
    likes: 234,
    views: 1520,
    completions: 145,
    dateAdded: "2025-05-15",
    featured: true,
  },
  {
    id: 2,
    title: "Circular Progress Dashboard",
    description:
      "Design a comprehensive progress indicator using concentric circles with data visualization",
    detailedDescription:
      "Build an enterprise-grade progress dashboard featuring multiple circular progress indicators. Include percentage displays, smooth animations, and interactive hover states. Perfect for corporate dashboards and analytics platforms.",
    shape: "circles",
    difficulty: "Intermediate",
    estimatedTime: "25 min",
    category: "Data Visualization",
    tags: ["progress", "dashboard", "circles", "data-viz"],
    likes: 189,
    views: 980,
    completions: 87,
    dateAdded: "2025-05-10",
    featured: false,
  },
  {
    id: 3,
    title: "Interactive Square Grid System",
    description:
      "Build a responsive grid layout with squares that animate and reorganize dynamically",
    detailedDescription:
      "Create a sophisticated grid system using square elements that can be filtered, sorted, and animated. Include hover effects, smooth transitions, and responsive behavior. Ideal for portfolio layouts and product showcases.",
    shape: "squares",
    difficulty: "Advanced",
    estimatedTime: "35 min",
    category: "Layout",
    tags: ["grid", "responsive", "squares", "layout"],
    likes: 312,
    views: 2100,
    completions: 203,
    dateAdded: "2025-04-28",
    featured: true,
  },
  {
    id: 4,
    title: "Hexagonal Navigation Interface",
    description:
      "Create a honeycomb-style navigation menu with smooth animations and interactions",
    detailedDescription:
      "Design an innovative navigation system using hexagonal shapes arranged in a honeycomb pattern. Include hover effects, smooth transitions between states, and responsive behavior for mobile devices.",
    shape: "hexagons",
    difficulty: "Advanced",
    estimatedTime: "45 min",
    category: "Navigation",
    tags: ["navigation", "hexagons", "interface", "mobile"],
    likes: 156,
    views: 890,
    completions: 76,
    dateAdded: "2025-05-01",
    featured: false,
  },
  {
    id: 5,
    title: "Interactive Star Rating System",
    description:
      "Design a premium 5-star rating component with smooth animations and feedback",
    detailedDescription:
      "Build a production-ready star rating system with smooth fill animations, hover previews, and accessibility features. Include half-star support and visual feedback for user interactions.",
    shape: "stars",
    difficulty: "Beginner",
    estimatedTime: "12 min",
    category: "UI Components",
    tags: ["rating", "stars", "interactive", "accessibility"],
    likes: 445,
    views: 3200,
    completions: 334,
    dateAdded: "2025-05-20",
    featured: true,
  },
  {
    id: 6,
    title: "Triangular Masonry Gallery",
    description:
      "Build an artistic image gallery using triangular frames with masonry layout",
    detailedDescription:
      "Create a visually striking gallery layout using triangular frames arranged in a masonry-style grid. Include lazy loading, lightbox functionality, and smooth transitions between different view modes.",
    shape: "triangles",
    difficulty: "Intermediate",
    estimatedTime: "30 min",
    category: "Gallery",
    tags: ["gallery", "masonry", "triangles", "images"],
    likes: 278,
    views: 1650,
    completions: 142,
    dateAdded: "2025-04-15",
    featured: false,
  },
  {
    id: 7,
    title: "Radial Action Menu",
    description:
      "Create an expandable circular menu that reveals options in radial formation",
    detailedDescription:
      "Design a sophisticated radial menu system that expands from a central point, revealing action items in a circular pattern. Include smooth animations, keyboard navigation, and touch gesture support.",
    shape: "circles",
    difficulty: "Advanced",
    estimatedTime: "40 min",
    category: "Navigation",
    tags: ["menu", "radial", "circles", "gestures"],
    likes: 167,
    views: 1100,
    completions: 89,
    dateAdded: "2025-04-22",
    featured: false,
  },
  {
    id: 8,
    title: "Flip Card Dashboard",
    description:
      "Design a dashboard with square tiles that flip to reveal detailed information",
    detailedDescription:
      "Create an interactive dashboard featuring square cards that flip on hover or click to reveal additional content. Include smooth 3D transformations, loading states, and responsive grid behavior.",
    shape: "squares",
    difficulty: "Intermediate",
    estimatedTime: "28 min",
    category: "Dashboard",
    tags: ["cards", "flip", "squares", "dashboard"],
    likes: 201,
    views: 1350,
    completions: 118,
    dateAdded: "2025-05-05",
    featured: false,
  },
  {
    id: 9,
    title: "Diamond Pattern Parallax",
    description:
      "Create an animated background using diamond shapes with parallax scrolling",
    detailedDescription:
      "Build a sophisticated background animation featuring diamond shapes that move at different speeds to create a parallax effect. Include color transitions and performance optimizations for smooth scrolling.",
    shape: "diamonds",
    difficulty: "Beginner",
    estimatedTime: "18 min",
    category: "Background",
    tags: ["parallax", "diamonds", "animation", "background"],
    likes: 356,
    views: 2400,
    completions: 267,
    dateAdded: "2025-05-12",
    featured: true,
  },
  {
    id: 10,
    title: "Morphing Pentagon Logo",
    description:
      "Design a logo animation using pentagon transformations and state changes",
    detailedDescription:
      "Create a dynamic logo system that transforms between different pentagon configurations. Include smooth morphing animations, color transitions, and scalable vector graphics for crisp rendering at all sizes.",
    shape: "pentagons",
    difficulty: "Advanced",
    estimatedTime: "50 min",
    category: "Branding",
    tags: ["logo", "morphing", "pentagons", "svg"],
    likes: 134,
    views: 780,
    completions: 67,
    dateAdded: "2025-04-18",
    featured: false,
  },
  {
    id: 11,
    title: "Circular Data Visualization",
    description:
      "Build a complex data visualization using circular charts and indicators",
    detailedDescription:
      "Design a comprehensive data visualization dashboard featuring circular charts, donut charts, and radial progress indicators. Include interactive tooltips, smooth animations, and real-time data updates.",
    shape: "circles",
    difficulty: "Advanced",
    estimatedTime: "55 min",
    category: "Data Visualization",
    tags: ["charts", "data", "circles", "analytics"],
    likes: 289,
    views: 1890,
    completions: 134,
    dateAdded: "2025-04-08",
    featured: true,
  },
  {
    id: 12,
    title: "Geometric Pattern Generator",
    description:
      "Create a tool that generates patterns using various geometric shapes",
    detailedDescription:
      "Build an interactive pattern generator that allows users to create complex geometric patterns using different shapes. Include customization options, export functionality, and preset pattern libraries.",
    shape: "mixed",
    difficulty: "Advanced",
    estimatedTime: "60 min",
    category: "Tools",
    tags: ["generator", "patterns", "mixed", "tool"],
    likes: 412,
    views: 2800,
    completions: 178,
    dateAdded: "2025-03-25",
    featured: true,
  },
];

const ShapeIcon = ({
  shape,
  className = "w-6 h-6",
}: {
  shape: string;
  className?: string;
}) => {
  switch (shape) {
    case "triangles":
      return <Triangle className={className} />;
    case "circles":
      return <Circle className={className} />;
    case "squares":
      return <Square className={className} />;
    case "hexagons":
      return <Hexagon className={className} />;
    case "stars":
      return <Star className={className} />;
    case "diamonds":
      return <Grid3X3 className={className} />;
    case "pentagons":
      return <Target className={className} />;
    case "mixed":
      return <Layers className={className} />;
    default:
      return <Circle className={className} />;
  }
};

const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  const colors = {
    Beginner:
      "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700",
    Intermediate:
      "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700",
    Advanced:
      "bg-gradient-to-r from-red-100 to-red-200 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
        colors[difficulty as keyof typeof colors]
      }`}
    >
      {difficulty}
    </span>
  );
};

export default function DesignChallengePlatform() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<Set<number>>(
    new Set()
  );
  const [viewMode, setViewMode] = useState<
    "challenge" | "completed" | "analytics" | "discover"
  >("challenge");
  const [isAnimating, setIsAnimating] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const currentChallenge = challenges[currentIndex];

  const categories = [
    "All",
    ...Array.from(new Set(challenges.map((c) => c.category))),
  ];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  const filteredChallenges = useMemo(() => {
    let filtered = challenges.filter((challenge) => {
      const matchesSearch =
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        challenge.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === "All" || challenge.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === "All" ||
        challenge.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    switch (sortBy) {
      case "featured":
        return filtered.sort(
          (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        );
      case "popular":
        return filtered.sort((a, b) => b.likes - a.likes);
      case "recent":
        return filtered.sort(
          (a, b) =>
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
      case "difficulty":
        return filtered.sort((a, b) => {
          const order = { Beginner: 1, Intermediate: 2, Advanced: 3 };
          return (
            order[a.difficulty as keyof typeof order] -
            order[b.difficulty as keyof typeof order]
          );
        });
      default:
        return filtered;
    }
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  const completedList = challenges.filter((challenge) =>
    completedChallenges.has(challenge.id)
  );
  const completionPercentage = Math.round(
    (completedChallenges.size / challenges.length) * 100
  );

  const userStats: UserStats = {
    totalCompleted: completedChallenges.size,
    streakDays: 7,
    totalTimeSpent: completedChallenges.size * 25,
    favoriteShape: "circles",
    rank: "Advanced Designer",
    points: completedChallenges.size * 100 + favoriteIds.size * 25,
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const navigateToChallenge = (direction: "next" | "prev") => {
    // Reset timer when changing challenges
    setTimerSeconds(0);
    setTimerActive(false);
    
    setIsAnimating(true);
    setTimeout(() => {
      if (direction === "next") {
        setCurrentIndex((prev) => (prev + 1) % filteredChallenges.length);
      } else {
        setCurrentIndex(
          (prev) =>
            (prev - 1 + filteredChallenges.length) % filteredChallenges.length
        );
      }
      setIsAnimating(false);
    }, 200);
  };

  const shuffleChallenge = () => {
    // Reset timer when changing challenges
    setTimerSeconds(0);
    setTimerActive(false);
    
    setIsAnimating(true);
    setTimeout(() => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * filteredChallenges.length);
      } while (newIndex === currentIndex && filteredChallenges.length > 1);
      setCurrentIndex(newIndex);
      setIsAnimating(false);
    }, 200);
  };

  const toggleCompleted = (challengeId: number) => {
    setCompletedChallenges((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(challengeId)) {
        newSet.delete(challengeId);
      } else {
        newSet.add(challengeId);
      }
      return newSet;
    });
  };

  const toggleFavorite = (challengeId: number) => {
    setFavoriteIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(challengeId)) {
        newSet.delete(challengeId);
      } else {
        newSet.add(challengeId);
      }
      return newSet;
    });
  };

  const startTimer = () => {
    setTimerSeconds(0);
    setTimerActive(true);
  };

  const pauseTimer = () => {
    setTimerActive(false);
  };

  const resetTimer = () => {
    setTimerSeconds(0);
    setTimerActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const exportData = () => {
    const data = {
      completedChallenges: Array.from(completedChallenges),
      favorites: Array.from(favoriteIds),
      stats: userStats,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shapeforge-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareChallenge = async () => {
    const shareData = {
      title: `${currentChallenge.title} - ShapeForge Challenge`,
      text: currentChallenge.description,
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(
        `${shareData.title}\n${shareData.text}\n${shareData.url}`
      );
      // Show toast notification (would be implemented in a real app)
    }
  };

  useEffect(() => {
    if (showSettings || sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Clean up in case the component unmounts while modal is open
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSettings, sidebarOpen]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-[Roboto] ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white"
          : "bg-gradient-to-br from-white via-purple-50 to-blue-50 text-gray-900"
      }`}
    >
      {/* Navigation Header */}
      <header
        className={`${
          darkMode ? "bg-gray-900" : "bg-white"
        } sticky top-0 z-50`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                aria-label="Open mobile menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div
                onClick={() => setViewMode("challenge")}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Triangle className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="">
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    ShapeForge
                  </h1>
                  <p
                    className={`text-sm md:block hidden  ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Professional Design Platform
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section - Desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setViewMode("challenge")}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors font-medium cursor-pointer ${
                    viewMode === "challenge"
                      ? "bg-indigo-600 text-white"
                      : darkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Triangle className="w-4 h-4" />
                  <span>Practice</span>
                </button>
                
                <button
                  onClick={() => setViewMode("discover")}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors font-medium cursor-pointer ${
                    viewMode === "discover"
                      ? "bg-indigo-600 text-white"
                      : darkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Discover</span>
                </button>
                
                <button
                  onClick={() => setViewMode("analytics")}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors font-medium cursor-pointer ${
                    viewMode === "analytics"
                      ? "bg-indigo-600 text-white"
                      : darkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </button>
                
                <button
                  onClick={() => setViewMode("completed")}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors font-medium cursor-pointer ${
                    viewMode === "completed"
                      ? "bg-indigo-600 text-white"
                      : darkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Completed</span>
                </button>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
                aria-label="Open settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Right Section - Mobile */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {sidebarOpen && (
          <div className="lg:hidden">
            <div
              className={`${darkMode ? "bg-gray-900" : "bg-white"} px-4 py-4 space-y-4`}
            >
              {/* Mobile Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div
                  className={`text-center p-3 rounded-lg ${
                    darkMode ? "bg-gray-800" : "bg-gray-100"
                  }`}
                >
                  <Users className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                  <div className="text-sm font-semibold">
                    {challenges.length}
                  </div>
                  <div
                    className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Challenges
                  </div>
                </div>
                <div
                  className={`text-center p-3 rounded-lg ${
                    darkMode ? "bg-gray-800" : "bg-gray-100"
                  }`}
                >
                  <Trophy className="w-5 h-5 mx-auto mb-1 text-yellow-600" />
                  <div className="text-sm font-semibold">
                    {completedChallenges.size}
                  </div>
                  <div
                    className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Completed
                  </div>
                </div>
                <div
                  className={`text-center p-3 rounded-lg ${
                    darkMode ? "bg-gray-800" : "bg-gray-100"
                  }`}
                >
                  <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-600" />
                  <div className="text-sm font-semibold">
                    {userStats.points}
                  </div>
                  <div
                    className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Points
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setViewMode("challenge");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "challenge"
                      ? "bg-indigo-600 text-white"
                      : darkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Triangle className="w-5 h-5" />
                  <span>Practice Mode</span>
                </button>

                <button
                  onClick={() => {
                    setViewMode("discover");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "discover"
                      ? "bg-indigo-600 text-white"
                      : darkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Search className="w-5 h-5" />
                  <span>Discover</span>
                </button>

                <button
                  onClick={() => {
                    setViewMode("analytics");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "analytics"
                      ? "bg-indigo-600 text-white"
                      : darkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Analytics</span>
                </button>

                <button
                  onClick={() => {
                    setViewMode("completed");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "completed"
                      ? "bg-indigo-600 text-white"
                      : darkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Completed</span>
                </button>
              </div>

              {/* Mobile Settings */}
              <div className="pt-4">
                <button
                  onClick={() => {
                    setShowSettings(!showSettings);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                    darkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div
          onClick={() => setShowSettings(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()} // ← prevent the overlay click
            className={`${
              darkMode
                ? "bg-gray-900"
                : "bg-white"
            } rounded-2xl p-6 w-full max-w-md`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Dark Mode</span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                    darkMode ? "bg-indigo-600" : "bg-gray-300"
                  } relative`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      darkMode ? "translate-x-6" : "translate-x-0.5"
                    } absolute top-0.5`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Export Progress</span>
                <button
                  onClick={exportData}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>

              <div className="pt-4">
                <h4 className="font-medium mb-2">Statistics</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Total Points:</span>
                    <span className="font-medium">{userStats.points}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Streak:</span>
                    <span className="font-medium">
                      {userStats.streakDays} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Spent:</span>
                    <span className="font-medium">
                      {userStats.totalTimeSpent} min
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="md:max-w-7xl mx-auto md:px-6 px-2 py-8">
        {viewMode === "analytics" ? (
          /* Analytics Dashboard */
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Analytics Dashboard</h2>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Track your progress and performance metrics
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                className={`${
                  darkMode
                    ? "bg-gray-800 border border-gray-700 shadow-lg"
                    : "bg-white border border-gray-200 shadow-lg"
                } rounded-xl p-6`}
              >
                <div className="flex items-center justify-between mb-4">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  <span
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {userStats.totalCompleted}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">Challenges Completed</h3>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {completionPercentage}% of total
                </p>
              </div>

              <div
                className={`${
                  darkMode
                    ? "bg-gray-800 border border-gray-700 shadow-lg"
                    : "bg-white border border-gray-200 shadow-lg"
                } rounded-xl p-6`}
              >
                <div className="flex items-center justify-between mb-4">
                  <Zap className="w-8 h-8 text-orange-500" />
                  <span
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {userStats.streakDays}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">Day Streak</h3>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Keep it up!
                </p>
              </div>

              <div
                className={`${
                  darkMode
                    ? "bg-gray-800 border border-gray-700 shadow-lg"
                    : "bg-white border border-gray-200 shadow-lg"
                } rounded-xl p-6`}
              >
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-8 h-8 text-blue-500" />
                  <span
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {userStats.totalTimeSpent}m
                  </span>
                </div>
                <h3 className="font-semibold mb-1">Time Invested</h3>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Learning & creating
                </p>
              </div>

              <div
                className={`${
                  darkMode
                    ? "bg-gray-800 border border-gray-700 shadow-lg"
                    : "bg-white border border-gray-200 shadow-lg"
                } rounded-xl p-6`}
              >
                <div className="flex items-center justify-between mb-4">
                  <Star className="w-8 h-8 text-purple-500" />
                  <span
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {userStats.points}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">Total Points</h3>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {userStats.rank}
                </p>
              </div>
            </div>

            {/* Progress Charts */}
            <div className="space-y-8">
              <div
                className={`${
                  darkMode
                    ? "bg-gray-800 border border-gray-700 shadow-lg"
                    : "bg-white border border-gray-200 shadow-lg"
                } rounded-xl p-6`}
              >
                <h3 className="text-xl font-semibold mb-6">
                  Completion by Difficulty
                </h3>
                <div className="space-y-4">
                  {difficulties.slice(1).map((difficulty) => {
                    const challengesOfDifficulty = challenges.filter(
                      (c) => c.difficulty === difficulty
                    );
                    const completedOfDifficulty = challengesOfDifficulty.filter(
                      (c) => completedChallenges.has(c.id)
                    );
                    const percentage = Math.round(
                      (completedOfDifficulty.length /
                        challengesOfDifficulty.length) *
                        100
                    );

                    return (
                      <div key={difficulty}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{difficulty}</span>
                          <span
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {completedOfDifficulty.length}/
                            {challengesOfDifficulty.length}
                          </span>
                        </div>
                        <div
                          className={`w-full ${
                            darkMode ? "bg-gray-700" : "bg-gray-200"
                          } rounded-full h-2`}
                        >
                          <div
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                className={`${
                  darkMode
                    ? "bg-gray-800 border border-gray-700 shadow-lg"
                    : "bg-white border border-gray-200 shadow-lg"
                } rounded-xl p-6`}
              >
                <h3 className="text-xl font-semibold mb-6">
                  Category Progress
                </h3>
                <div className="space-y-4">
                  {categories.slice(1).map((category) => {
                    const challengesOfCategory = challenges.filter(
                      (c) => c.category === category
                    );
                    const completedOfCategory = challengesOfCategory.filter(
                      (c) => completedChallenges.has(c.id)
                    );
                    const percentage = Math.round(
                      (completedOfCategory.length /
                        challengesOfCategory.length) *
                        100
                    );

                    return (
                      <div key={category}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{category}</span>
                          <span
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {completedOfCategory.length}/
                            {challengesOfCategory.length}
                          </span>
                        </div>
                        <div
                          className={`w-full ${
                            darkMode ? "bg-gray-700" : "bg-gray-200"
                          } rounded-full h-2`}
                        >
                          <div
                            className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : viewMode === "discover" ? (
          /* Discover Mode */
          <div className="space-y-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Discover Challenges</h2>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Find your next design challenge
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Search challenges..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-6 py-3 rounded-lg transition-colors cursor-pointer flex items-center space-x-2 ${
                    darkMode
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div
                              className={`${
                darkMode
                  ? "bg-gray-800"
                  : "bg-white"
              } rounded-xl p-6`}
              >
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className={`w-full p-2 rounded-lg border ${
                        darkMode
                          ? "bg-gray-900 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Difficulty
                    </label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className={`w-full p-2 rounded-lg border ${
                        darkMode
                          ? "bg-gray-900 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      {difficulties.map((difficulty) => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`w-full p-2 rounded-lg border ${
                        darkMode
                          ? "bg-gray-900 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="featured">Featured</option>
                      <option value="popular">Most Popular</option>
                      <option value="recent">Most Recent</option>
                      <option value="difficulty">By Difficulty</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Challenge Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className={`${
                    darkMode
                      ? "bg-gray-800"
                      : "bg-white"
                  } rounded-xl hover:bg-opacity-80 transition-all duration-300 overflow-hidden group cursor-pointer`}
                  onClick={() => {
                    // Reset timer when changing challenges
                    setTimerSeconds(0);
                    setTimerActive(false);
                    
                    setCurrentIndex(
                      challenges.findIndex((c) => c.id === challenge.id)
                    );
                    setViewMode("challenge");
                  }}
                >
                  {challenge.featured && (
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold px-3 py-1">
                      ✨ FEATURED
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <ShapeIcon shape={challenge.shape} />
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(challenge.id);
                          }}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            favoriteIds.has(challenge.id)
                              ? "text-red-500 hover:bg-red-50"
                              : darkMode
                              ? "text-gray-400 hover:bg-gray-700"
                              : "text-gray-400 hover:bg-gray-50"
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              favoriteIds.has(challenge.id)
                                ? "fill-current"
                                : ""
                            }`}
                          />
                        </button>

                        {completedChallenges.has(challenge.id) && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-600 transition-colors">
                      {challenge.title}
                    </h3>
                    <p
                      className={`${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } text-sm mb-4 line-clamp-2`}
                    >
                      {challenge.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <DifficultyBadge difficulty={challenge.difficulty} />
                      <span
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {challenge.estimatedTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{challenge.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{challenge.views}</span>
                        </span>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {challenge.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : viewMode === "completed" ? (
          /* Completed Challenges */
          <div className="space-y-8">
            <div>
              <h2 className="md:text-3xl text-2xl font-bold mb-2">
                Completed Challenges
              </h2>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                You've completed {completedChallenges.size} out of{" "}
                {challenges.length} challenges ({completionPercentage}%)
              </p>
            </div>

            {completedList.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedList.map((challenge) => (
                  <div
                    key={challenge.id}
                    className={`${
                      darkMode
                        ? "bg-gray-800"
                        : "bg-white"
                    } rounded-xl p-6 hover:bg-opacity-80 transition-all`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center text-emerald-600">
                        <ShapeIcon shape={challenge.shape} />
                      </div>
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>

                    <h3 className="text-xl font-semibold mb-2">
                      {challenge.title}
                    </h3>
                    <p
                      className={`${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } text-sm mb-4`}
                    >
                      {challenge.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <DifficultyBadge difficulty={challenge.difficulty} />
                      <span
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {challenge.estimatedTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div
                  className={`w-24 h-24 ${
                    darkMode ? "bg-gray-800" : "bg-gray-100"
                  } rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <Trophy
                    className={`w-12 h-12 ${
                      darkMode ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  No completed challenges yet
                </h3>
                <p
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } mb-6`}
                >
                  Start completing challenges to see them here!
                </p>
                <button
                  onClick={() => setViewMode("challenge")}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium cursor-pointer"
                >
                  Start Your First Challenge
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Main Challenge View */
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Progress Overview */}
            <div
              className={`${
                darkMode
                  ? "bg-gray-800"
                  : "bg-white"
              } rounded-2xl md:px-6 py-6 px-3`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Your Progress</h3>
                <div className="flex items-center space-x-4">
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {completedChallenges.size}/{challenges.length} completed
                  </span>
                  <span className="text-sm font-semibold text-indigo-600">
                    {completionPercentage}%
                  </span>
                </div>
              </div>
              <div
                className={`w-full ${
                  darkMode ? "bg-gray-700" : "bg-gray-200"
                } rounded-full h-3`}
              >
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Timer & Tools */}
            <div
              className={`${
                darkMode
                  ? "bg-gray-800"
                  : "bg-white"
              } rounded-2xl md:px-6 py-6 px-3`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Timer className="w-5 h-5 text-blue-600" />
                    <span className="text-lg font-mono font-semibold">
                      {formatTime(timerSeconds)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!timerActive ? (
                      <button
                        onClick={startTimer}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm cursor-pointer"
                      >
                        <Play className="w-4 h-4" />
                        <span>Start</span>
                      </button>
                    ) : (
                      <button
                        onClick={pauseTimer}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm cursor-pointer"
                      >
                        <Pause className="w-4 h-4" />
                        <span>Pause</span>
                      </button>
                    )}

                    <button
                      onClick={resetTimer}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={shareChallenge}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    }`}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleFavorite(currentChallenge.id)}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      favoriteIds.has(currentChallenge.id)
                        ? "text-red-500 hover:bg-red-50"
                        : darkMode
                        ? "text-gray-400 hover:bg-gray-700"
                        : "text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favoriteIds.has(currentChallenge.id)
                          ? "fill-current"
                          : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Challenge Card */}
            <div
              className={`${
                darkMode
                  ? "bg-gray-800"
                  : "bg-white"
              } rounded-2xl overflow-hidden transition-all duration-300 ${
                isAnimating ? "scale-95 opacity-50" : "scale-100 opacity-100"
              }`}
            >
              {currentChallenge.featured && (
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold px-6 py-2">
                  Featured Challenge
                </div>
              )}

              <div className="md:px-6 py-6 px-3 md:p-12">
                {/* Mobile Layout */}
                <div className="block md:hidden mb-8">
                  {/* Line 1: Icon and Title */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center text-blue-600">
                      <ShapeIcon
                        shape={currentChallenge.shape}
                        className="w-6 h-6"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h1 className="text-xl font-bold">
                          {currentChallenge.title}
                        </h1>
                        {completedChallenges.has(currentChallenge.id) && (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Line 2: Badges and Info */}
                  <div className="flex items-center flex-wrap gap-2 mb-4">
                    <DifficultyBadge difficulty={currentChallenge.difficulty} />
                    <span
                      className={`flex items-center space-x-1 text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span>{currentChallenge.estimatedTime}</span>
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {currentChallenge.category}
                    </span>
                  </div>

                  {/* Line 3: Stats */}
                  <div className="flex items-center flex-wrap gap-3 text-sm text-gray-500 mb-4">
                    <span className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{currentChallenge.likes}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{currentChallenge.views}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{currentChallenge.completions} completed</span>
                    </span>
                  </div>

                  {/* Line 4: Full Width Completed Button */}
                  <button
                    onClick={() => toggleCompleted(currentChallenge.id)}
                    className={`w-full py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 font-medium cursor-pointer ${
                      completedChallenges.has(currentChallenge.id)
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                    }`}
                  >
                    <Check className="w-5 h-5" />
                    <span>
                      {completedChallenges.has(currentChallenge.id)
                        ? "Mark as Incomplete"
                        : "Mark as Complete"}
                    </span>
                  </button>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex items-start justify-between mb-8">
                  <div className="flex items-start space-x-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center text-blue-600">
                      <ShapeIcon
                        shape={currentChallenge.shape}
                        className="w-10 h-10"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h1 className="text-4xl font-bold">
                          {currentChallenge.title}
                        </h1>
                        {completedChallenges.has(currentChallenge.id) && (
                          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        )}
                      </div>

                      <div className="flex items-center space-x-4 mb-4">
                        <DifficultyBadge
                          difficulty={currentChallenge.difficulty}
                        />
                        <span
                          className={`flex items-center space-x-1 text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          <Clock className="w-4 h-4" />
                          <span>{currentChallenge.estimatedTime}</span>
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {currentChallenge.category}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{currentChallenge.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{currentChallenge.views}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{currentChallenge.completions} completed</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleCompleted(currentChallenge.id)}
                    className={`p-4 rounded-2xl transition-all duration-200 cursor-pointer ${
                      completedChallenges.has(currentChallenge.id)
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg"
                        : darkMode
                        ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    }`}
                  >
                    <Check className="w-6 h-6" />
                  </button>
                </div>
                <div className="mb-8">
                  <p
                    className={`text-lg leading-relaxed mb-6 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {currentChallenge.description}
                  </p>

                  <div
                    className={`${
                      darkMode
                        ? "bg-gray-900"
                        : "bg-gray-100"
                    } rounded-xl p-6`}
                  >
                    <h3 className="font-semibold mb-3 flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      <span>Detailed Instructions</span>
                    </h3>
                    <p
                      className={`${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } leading-relaxed`}
                    >
                      {currentChallenge.detailedDescription}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                    <button
                      onClick={() => navigateToChallenge("prev")}
                      className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-5 py-3 rounded-xl transition-all duration-200 cursor-pointer border-2 ${
                        darkMode
                          ? "bg-gray-800 hover:bg-gray-700 text-white border-gray-600 hover:border-gray-500 shadow-lg"
                          : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 shadow-lg"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">Previous</span>
                    </button>

                    <button
                      onClick={shuffleChallenge}
                      className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">Random</span>
                    </button>

                    <button
                      onClick={() => navigateToChallenge("next")}
                      className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-5 py-3 rounded-xl transition-all duration-200 cursor-pointer border-2 ${
                        darkMode
                          ? "bg-gray-800 hover:bg-gray-700 text-white border-gray-600 hover:border-gray-500 shadow-lg"
                          : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 shadow-lg"
                      }`}
                    >
                      <span className="text-sm sm:text-base">Next</span>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  {/* Progress Info */}
                  <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      } text-center sm:text-left`}
                    >
                      Challenge {currentIndex + 1} of {challenges.length}
                    </span>

                    <button
                      onClick={() => setViewMode("completed")}
                      className="flex items-center space-x-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer w-full sm:w-auto justify-center"
                    >
                      <Trophy className="w-5 h-5" />
                      <span>View Progress</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Challenge Grid Navigation */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">All Challenges</h3>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Quick navigation
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {challenges.map((challenge, index) => (
                  <button
                    key={challenge.id}
                    onClick={() => {
                      // Reset timer when changing challenges
                      setTimerSeconds(0);
                      setTimerActive(false);
                      
                      setIsAnimating(true);
                      setTimeout(() => {
                        setCurrentIndex(index);
                        setIsAnimating(false);
                      }, 200);
                    }}
                    className={`p-4 rounded-xl transition-all duration-200 relative overflow-hidden group cursor-pointer ${
                      index === currentIndex
                        ? "bg-indigo-100 dark:bg-indigo-900/30"
                        : darkMode
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    {challenge.featured && (
                      <div className="absolute top-2 right-2">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <ShapeIcon
                        shape={challenge.shape}
                        className="w-6 h-6 text-blue-600"
                      />
                      {completedChallenges.has(challenge.id) && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>

                    <h4 className="text-sm font-semibold text-left mb-2 line-clamp-2">
                      {challenge.title}
                    </h4>

                    <div className="flex items-center justify-between">
                      <DifficultyBadge difficulty={challenge.difficulty} />
                      <span
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {challenge.estimatedTime}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Premium Footer */}
      <footer
        className={`${
          darkMode ? "bg-gray-900" : "bg-white"
        } mt-16`}
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Triangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    ShapeForge
                  </h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Professional Design Platform
                  </p>
                </div>
              </div>
              <p
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-600"
                } mb-6 max-w-md`}
              >
                Elevate your design skills with our comprehensive collection of
                shape-based challenges. Perfect for designers, developers, and
                creative professionals.
              </p>
              <div className="flex items-center space-x-4">
                <div
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  © 2025 ShapeForge. Crafted with passion.
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div
                className={`space-y-3 text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <a href="#" className="block hover:text-indigo-600 transition-colors cursor-pointer">Challenges</a>
                <a href="#" className="block hover:text-indigo-600 transition-colors cursor-pointer">Analytics</a>
                <a href="#" className="block hover:text-indigo-600 transition-colors cursor-pointer">Progress Tracking</a>
                <a href="#" className="block hover:text-indigo-600 transition-colors cursor-pointer">Achievements</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div
                className={`space-y-3 text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <a href="#" className="block hover:text-indigo-600 transition-colors cursor-pointer">Design Guidelines</a>
                <a href="#" className="block hover:text-indigo-600 transition-colors cursor-pointer">Best Practices</a>
                <a href="#" className="block hover:text-indigo-600 transition-colors cursor-pointer">Community</a>
                <a href="#" className="block hover:text-indigo-600 transition-colors cursor-pointer">Support</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");
      `}</style>
    </div>
  );
}