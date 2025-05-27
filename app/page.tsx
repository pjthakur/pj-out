"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Book,
  Plus,
  Search,
  User,
  LogOut,
  Star,
  TrendingUp,
  PieChart,
  Calendar,
  Filter,
  Menu,
  X,
  BarChart3,
  BookOpen,
  Target,
  Award,
  Clock,
  Settings,
  Moon,
  Sun,
  Download,
  Upload,
  Flame,
  Trophy,
  Users,
  Heart,
  Share2,
  Bell,
  CheckCircle,
  AlertCircle,
  BookmarkPlus,
  Timer,
  Zap,
  Activity,
  Globe,
  MessageCircle,
  Bookmark,
  ArrowRight,
  PlayCircle,
  Smartphone,
  Shield,
  ChevronDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  BarChart,
  Bar,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter,
} from "recharts";

// Types
interface BookType {
  id: string;
  title: string;
  author: string;
  genre: string;
  totalPages: number;
  currentPage: number;
  isCompleted: boolean;
  rating?: number;
  cover: string;
  dateAdded: string;
  dateCompleted?: string;
  readingSessions: ReadingSession[];
  notes?: string;
  favorite: boolean;
  isbn?: string;
  publishedYear?: number;
  language: string;
  tags: string[];
}

interface ReadingSession {
  date: string;
  startPage: number;
  endPage: number;
  duration: number; // in minutes
  notes?: string;
}

interface DailyProgress {
  date: string;
  pages: number;
  minutes: number;
  books: number;
}

interface ReadingGoal {
  id: string;
  type: "books" | "pages" | "minutes";
  target: number;
  current: number;
  period: "daily" | "weekly" | "monthly" | "yearly";
  startDate: string;
  endDate: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  target: number;
}

interface LoginCredentials {
  username: string;
  password: string;
}

const ReadMetrics: React.FC = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [loginForm, setLoginForm] = useState<LoginCredentials>({
    username: "admin",
    password: "password123",
  });
  const [loginError, setLoginError] = useState<string>("");

  // UI state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showAddBookModal, setShowAddBookModal] = useState<boolean>(false);
  const [showGoalsModal, setShowGoalsModal] = useState<boolean>(false);
  const [showSessionModal, setShowSessionModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("dateAdded");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [bookValidation, setBookValidation] = useState({
    title: "",
    author: "",
    genre: "",
    totalPages: "",
    currentPage: "",
  });
  const [goalValidation, setGoalValidation] = useState({ target: "" });
  const [sessionValidation, setSessionValidation] = useState({
    bookId: "",
    pages: "",
    minutes: "",
  });
  // Books state with comprehensive data
  const [books, setBooks] = useState<BookType[]>([
    {
      id: "1",
      title: "The Psychology of Money",
      author: "Morgan Housel",
      genre: "Finance",
      totalPages: 256,
      currentPage: 180,
      isCompleted: false,
      cover:
        "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=300&h=400&fit=crop",
      dateAdded: "2024-01-15",
      readingSessions: [
        { date: "2024-05-20", startPage: 150, endPage: 170, duration: 45 },
        { date: "2024-05-21", startPage: 170, endPage: 180, duration: 30 },
      ],
      favorite: true,
      isbn: "9780857197689",
      publishedYear: 2020,
      language: "English",
      tags: ["Personal Finance", "Psychology", "Investment"],
    },
    {
      id: "2",
      title: "Atomic Habits",
      author: "James Clear",
      genre: "Self-Help",
      totalPages: 320,
      currentPage: 320,
      isCompleted: true,
      rating: 5,
      cover:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      dateAdded: "2024-01-10",
      dateCompleted: "2024-02-15",
      readingSessions: [
        {
          date: "2024-02-10",
          startPage: 280,
          endPage: 320,
          duration: 60,
          notes: "Excellent conclusion",
        },
      ],
      favorite: true,
      isbn: "9780735211292",
      publishedYear: 2018,
      language: "English",
      tags: ["Habits", "Productivity", "Self-Improvement"],
    },
    {
      id: "3",
      title: "Dune",
      author: "Frank Herbert",
      genre: "Science Fiction",
      totalPages: 688,
      currentPage: 245,
      isCompleted: false,
      cover:
        "https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=300&h=400&fit=crop",
      dateAdded: "2024-02-01",
      readingSessions: [
        { date: "2024-05-22", startPage: 200, endPage: 245, duration: 90 },
      ],
      favorite: false,
      isbn: "9780441013593",
      publishedYear: 1965,
      language: "English",
      tags: ["Space Opera", "Politics", "Philosophy"],
    },
    {
      id: "4",
      title: "Educated",
      author: "Tara Westover",
      genre: "Biography",
      totalPages: 334,
      currentPage: 334,
      isCompleted: true,
      rating: 4,
      cover:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      dateAdded: "2024-03-01",
      dateCompleted: "2024-04-10",
      readingSessions: [],
      favorite: true,
      isbn: "9780399590504",
      publishedYear: 2018,
      language: "English",
      tags: ["Memoir", "Education", "Family"],
    },
    {
      id: "5",
      title: "The Lean Startup",
      author: "Eric Ries",
      genre: "Business",
      totalPages: 336,
      currentPage: 120,
      isCompleted: false,
      cover:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=400&fit=crop",
      dateAdded: "2024-04-15",
      readingSessions: [
        { date: "2024-05-23", startPage: 100, endPage: 120, duration: 40 },
      ],
      favorite: false,
      isbn: "9780307887894",
      publishedYear: 2011,
      language: "English",
      tags: ["Entrepreneurship", "Innovation", "Startups"],
    },
    {
      id: "6",
      title: "Sapiens",
      author: "Yuval Noah Harari",
      genre: "History",
      totalPages: 443,
      currentPage: 443,
      isCompleted: true,
      rating: 5,
      cover:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
      dateAdded: "2024-01-05",
      dateCompleted: "2024-03-20",
      readingSessions: [],
      favorite: true,
      isbn: "9780062316097",
      publishedYear: 2014,
      language: "English",
      tags: ["Anthropology", "Evolution", "Civilization"],
    },
    {
      id: "7",
      title: "The Midnight Library",
      author: "Matt Haig",
      genre: "Fiction",
      totalPages: 288,
      currentPage: 150,
      isCompleted: false,
      cover:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      dateAdded: "2024-05-01",
      readingSessions: [
        { date: "2024-05-24", startPage: 120, endPage: 150, duration: 55 },
      ],
      favorite: false,
      isbn: "9780525559474",
      publishedYear: 2020,
      language: "English",
      tags: ["Philosophy", "Life", "Choices"],
    },
    {
      id: "8",
      title: "Becoming",
      author: "Michelle Obama",
      genre: "Biography",
      totalPages: 448,
      currentPage: 448,
      isCompleted: true,
      rating: 5,
      cover:
        "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=400&fit=crop",
      dateAdded: "2024-02-20",
      dateCompleted: "2024-04-05",
      readingSessions: [],
      favorite: true,
      isbn: "9781524763138",
      publishedYear: 2018,
      language: "English",
      tags: ["Politics", "Leadership", "Inspiration"],
    },
  ]);

  // Enhanced daily progress with more data points
  const [dailyProgress] = useState<DailyProgress[]>([
    { date: "2024-05-10", pages: 35, minutes: 45, books: 0 },
    { date: "2024-05-11", pages: 28, minutes: 35, books: 0 },
    { date: "2024-05-12", pages: 42, minutes: 55, books: 1 },
    { date: "2024-05-13", pages: 0, minutes: 0, books: 0 },
    { date: "2024-05-14", pages: 55, minutes: 70, books: 0 },
    { date: "2024-05-15", pages: 38, minutes: 50, books: 0 },
    { date: "2024-05-16", pages: 47, minutes: 60, books: 0 },
    { date: "2024-05-17", pages: 33, minutes: 40, books: 0 },
    { date: "2024-05-18", pages: 45, minutes: 55, books: 0 },
    { date: "2024-05-19", pages: 32, minutes: 40, books: 0 },
    { date: "2024-05-20", pages: 58, minutes: 75, books: 0 },
    { date: "2024-05-21", pages: 41, minutes: 50, books: 0 },
    { date: "2024-05-22", pages: 52, minutes: 65, books: 0 },
    { date: "2024-05-23", pages: 38, minutes: 45, books: 0 },
    { date: "2024-05-24", pages: 47, minutes: 60, books: 0 },
  ]);

  // Reading goals
  const [readingGoals, setReadingGoals] = useState<ReadingGoal[]>([
    {
      id: "1",
      type: "books",
      target: 52,
      current: 4,
      period: "yearly",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
    },
    {
      id: "2",
      type: "pages",
      target: 500,
      current: 420,
      period: "monthly",
      startDate: "2024-05-01",
      endDate: "2024-05-31",
    },
    {
      id: "3",
      type: "minutes",
      target: 30,
      current: 25,
      period: "daily",
      startDate: "2024-05-24",
      endDate: "2024-05-24",
    },
  ]);

  // Achievements system
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "1",
      title: "First Book",
      description: "Complete your first book",
      icon: "📚",
      unlockedAt: "2024-02-15",
      progress: 1,
      target: 1,
    },
    {
      id: "2",
      title: "Speed Reader",
      description: "Read 100 pages in a day",
      icon: "⚡",
      progress: 0,
      target: 1,
    },
    {
      id: "3",
      title: "Bookworm",
      description: "Read 10 books",
      icon: "🐛",
      progress: 4,
      target: 10,
    },
    {
      id: "4",
      title: "Streak Master",
      description: "Read for 7 consecutive days",
      icon: "🔥",
      unlockedAt: "2024-05-21",
      progress: 7,
      target: 7,
    },
    {
      id: "5",
      title: "Genre Explorer",
      description: "Read books from 5 different genres",
      icon: "🌍",
      progress: 5,
      target: 5,
      unlockedAt: "2024-04-10",
    },
  ]);

  // New state for additional features
  const [currentStreak, setCurrentStreak] = useState<number>(12);
  const [longestStreak, setLongestStreak] = useState<number>(28);
  const [newGoal, setNewGoal] = useState({
    type: "books",
    target: "",
    period: "monthly",
  });
  const [newSession, setNewSession] = useState({
    bookId: "",
    pages: "",
    minutes: "",
    notes: "",
  });

  // New book form state
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    totalPages: "",
    currentPage: "0",
    isbn: "",
    publishedYear: "",
    language: "English",
    tags: "",
  });

  // Sample credentials
  const validCredentials = { username: "admin", password: "password123" };

  // Enhanced computed values
  const stats = useMemo(() => {
    const totalBooks = books.length;
    const completedBooks = books.filter((book) => book.isCompleted).length;
    const inProgressBooks = books.filter(
      (book) => !book.isCompleted && book.currentPage > 0
    ).length;
    const totalPagesRead = books.reduce(
      (sum, book) => sum + book.currentPage,
      0
    );
    const totalPages = books.reduce((sum, book) => sum + book.totalPages, 0);
    const completionRate =
      totalPages > 0 ? (totalPagesRead / totalPages) * 100 : 0;
    const avgRating =
      books
        .filter((book) => book.rating)
        .reduce((sum, book) => sum + (book.rating || 0), 0) /
        books.filter((book) => book.rating).length || 0;
    const favoriteBooks = books.filter((book) => book.favorite).length;
    const uniqueGenres = new Set(books.map((book) => book.genre)).size;
    const totalReadingTime = books.reduce(
      (sum, book) =>
        sum +
        book.readingSessions.reduce(
          (sessionSum, session) => sessionSum + session.duration,
          0
        ),
      0
    );
    const avgPagesPerDay =
      dailyProgress
        .filter((day) => day.pages > 0)
        .reduce((sum, day) => sum + day.pages, 0) /
      Math.max(1, dailyProgress.filter((day) => day.pages > 0).length);

    return {
      totalBooks,
      completedBooks,
      inProgressBooks,
      totalPagesRead,
      completionRate,
      avgRating,
      favoriteBooks,
      uniqueGenres,
      totalReadingTime,
      avgPagesPerDay,
    };
  }, [books, dailyProgress]);

  const genreData = useMemo(() => {
    const genres = books.reduce((acc, book) => {
      acc[book.genre] = (acc[book.genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = [
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#06B6D4",
      "#F97316",
      "#84CC16",
    ];
    return Object.entries(genres).map(([genre, count], index) => ({
      name: genre,
      value: count,
      color: colors[index % colors.length],
    }));
  }, [books]);

  const monthlyProgress = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May"];
    return months.map((month) => ({
      month,
      books: Math.floor(Math.random() * 5) + 1,
      pages: Math.floor(Math.random() * 800) + 200,
    }));
  }, []);

  const readingHeatmapData = useMemo(() => {
    return dailyProgress.slice(-30).map((day) => ({
      date: day.date,
      value: day.pages,
      level:
        day.pages === 0
          ? 0
          : day.pages < 20
          ? 1
          : day.pages < 40
          ? 2
          : day.pages < 60
          ? 3
          : 4,
    }));
  }, [dailyProgress]);

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        const matchesSearch =
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          );
        const matchesGenre =
          genreFilter === "all" || book.genre === genreFilter;
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "completed" && book.isCompleted) ||
          (statusFilter === "reading" &&
            !book.isCompleted &&
            book.currentPage > 0) ||
          (statusFilter === "toread" && book.currentPage === 0);
        return matchesSearch && matchesGenre && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "title":
            return a.title.localeCompare(b.title);
          case "author":
            return a.author.localeCompare(b.author);
          case "progress":
            return b.currentPage / b.totalPages - a.currentPage / a.totalPages;
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          case "dateAdded":
            return (
              new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
            );
          default:
            return 0;
        }
      });
  }, [books, searchTerm, genreFilter, statusFilter, sortBy]);

  useEffect(() => {
    const anyModalOpen =
      showAddBookModal ||
      showGoalsModal ||
      showSessionModal ||
      showLoginModal ||
      isMobileMenuOpen;

    if (anyModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden"); // Cleanup
    };
  }, [
    showAddBookModal,
    showGoalsModal,
    showSessionModal,
    showLoginModal,
    isMobileMenuOpen,
  ]);

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  // Enhanced handlers
  const handleLogin = () => {
    if (
      loginForm.username === validCredentials.username &&
      loginForm.password === validCredentials.password
    ) {
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setLoginError("");
    } else {
      setLoginError("Invalid credentials. Try admin/password123");
    }
  };

  const validateBook = () => {
    const errors = {
      title: "",
      author: "",
      genre: "",
      totalPages: "",
      currentPage: "",
    };
    let isValid = true;

    if (!newBook.title.trim()) {
      errors.title = "Title is required";
      isValid = false;
    }
    if (!newBook.author.trim()) {
      errors.author = "Author is required";
      isValid = false;
    }
    if (!newBook.genre.trim()) {
      errors.genre = "Genre is required";
      isValid = false;
    }
    if (!newBook.totalPages || parseInt(newBook.totalPages) <= 0) {
      errors.totalPages = "Total pages must be greater than 0";
      isValid = false;
    }
    if (parseInt(newBook.currentPage) > parseInt(newBook.totalPages)) {
      errors.currentPage = "Current page cannot exceed total pages";
      isValid = false;
    }

    setBookValidation(errors);
    return isValid;
  };

  const validateGoal = () => {
    const errors = { target: "" };
    let isValid = true;

    if (!newGoal.target || parseInt(newGoal.target) <= 0) {
      errors.target = "Target must be greater than 0";
      isValid = false;
    }

    setGoalValidation(errors);
    return isValid;
  };

  const validateSession = () => {
    const errors = { bookId: "", pages: "", minutes: "" };
    let isValid = true;

    if (!newSession.bookId) {
      errors.bookId = "Please select a book";
      isValid = false;
    }
    if (!newSession.pages || parseInt(newSession.pages) <= 0) {
      errors.pages = "Pages must be greater than 0";
      isValid = false;
    }
    if (!newSession.minutes || parseInt(newSession.minutes) <= 0) {
      errors.minutes = "Minutes must be greater than 0";
      isValid = false;
    }

    setSessionValidation(errors);
    return isValid;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginForm({ username: "", password: "" });
    setIsMobileMenuOpen(false);
  };

  const handleAddBook = () => {
    if (!validateBook()) return;

    if (
      newBook.title &&
      newBook.author &&
      newBook.genre &&
      newBook.totalPages
    ) {
      const book: BookType = {
        id: Date.now().toString(),
        title: newBook.title,
        author: newBook.author,
        genre: newBook.genre,
        totalPages: parseInt(newBook.totalPages),
        currentPage: parseInt(newBook.currentPage),
        isCompleted:
          parseInt(newBook.currentPage) >= parseInt(newBook.totalPages),
        cover: `https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop`,
        dateAdded: new Date().toISOString().split("T")[0],
        readingSessions: [],
        favorite: false,
        isbn: newBook.isbn,
        publishedYear: newBook.publishedYear
          ? parseInt(newBook.publishedYear)
          : undefined,
        language: newBook.language,
        tags: newBook.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };
      setBooks((prev) => [...prev, book]);
      setNewBook({
        title: "",
        author: "",
        genre: "",
        totalPages: "",
        currentPage: "0",
        isbn: "",
        publishedYear: "",
        language: "English",
        tags: "",
      });
      setShowAddBookModal(false);
    }
    setBookValidation({
      title: "",
      author: "",
      genre: "",
      totalPages: "",
      currentPage: "",
    });
  };

  const handleAddGoal = () => {
    if (!validateGoal()) return;

    if (newGoal.target) {
      const goal: ReadingGoal = {
        id: Date.now().toString(),
        type: newGoal.type as "books" | "pages" | "minutes",
        target: parseInt(newGoal.target),
        current: 0,
        period: newGoal.period as "daily" | "weekly" | "monthly" | "yearly",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      };
      setReadingGoals((prev) => [...prev, goal]);
      setNewGoal({ type: "books", target: "", period: "monthly" });
      setShowGoalsModal(false);
    }
    setGoalValidation({ target: "" });
  };

  const updateBookProgress = (bookId: string, newPage: number) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === bookId
          ? {
              ...book,
              currentPage: newPage,
              isCompleted: newPage >= book.totalPages,
              dateCompleted:
                newPage >= book.totalPages
                  ? new Date().toISOString().split("T")[0]
                  : undefined,
            }
          : book
      )
    );
  };

  const toggleFavorite = (bookId: string) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === bookId ? { ...book, favorite: !book.favorite } : book
      )
    );
  };

  const rateBook = (bookId: string, rating: number) => {
    setBooks((prev) =>
      prev.map((book) => (book.id === bookId ? { ...book, rating } : book))
    );
  };

  const exportData = () => {
    const data = {
      books,
      readingGoals,
      achievements,
      stats,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "booktracker-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setGenreFilter("all");
    setStatusFilter("all");
    setSortBy("dateAdded");
  };

  const hasActiveFilters = () => {
    return (
      searchTerm !== "" ||
      genreFilter !== "all" ||
      statusFilter !== "all" ||
      sortBy !== "dateAdded"
    );
  };

  const StarRating = ({
    rating,
    onRate,
    readOnly = false,
  }: {
    rating?: number;
    onRate?: (rating: number) => void;
    readOnly?: boolean;
  }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => !readOnly && onRate?.(star)}
          className={`${
            !readOnly ? "hover:scale-110 cursor-pointer" : "cursor-default"
          } transition-transform`}
          disabled={readOnly}
        >
          <Star
            size={16}
            className={`${
              rating && rating >= star
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );

  const ProgressRing = ({
    progress,
    size = 60,
    strokeWidth = 6,
  }: {
    progress: number;
    size?: number;
    strokeWidth?: number;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="text-blue-600 transition-all duration-300"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  const themeClasses = isDarkMode
    ? "bg-gray-900 text-white"
    : "bg-gray-50 text-gray-900";
  const cardClasses = isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-100";
  const inputClasses = isDarkMode
    ? "bg-gray-700 border-gray-600 text-white"
    : "bg-white border-gray-300 text-gray-900";

  // Landing Page Component
  const LandingPage = () => (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-white">
                  <h1 className="text-xl font-bold">ReadMetrics</h1>
                  <p className="text-xs text-blue-200 hidden sm:block">
                    Pro Reading Analytics
                  </p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <button
                  onClick={() => scrollToSection("hero")}
                  className="text-white hover:text-blue-300 transition-colors cursor-pointer"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-white hover:text-blue-300 transition-colors cursor-pointer"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-white hover:text-blue-300 transition-colors cursor-pointer"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-white hover:text-blue-300 transition-colors cursor-pointer"
                >
                  Contact
                </button>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer"
                >
                  Login
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white p-2 rounded-lg hover:bg-white/10 cursor-pointer"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="md:hidden absolute top-16 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-b border-white/20">
                <div className="px-4 py-6 space-y-4">
                  <button
                    onClick={() => scrollToSection("hero")}
                    className="block w-full text-left text-white hover:text-blue-300 transition-colors py-2 cursor-pointer"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="block w-full text-left text-white hover:text-blue-300 transition-colors py-2 cursor-pointer"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="block w-full text-left text-white hover:text-blue-300 transition-colors py-2 cursor-pointer"
                  >
                    About
                  </button>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="block w-full text-left text-white hover:text-blue-300 transition-colors py-2 cursor-pointer"
                  >
                    Contact
                  </button>
                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all mt-4 cursor-pointer"
                  >
                    Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
        {/* Enhanced Add Book Modal */}
        {showAddBookModal && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div
              className={`rounded-xl max-w-2xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto ${cardClasses} mx-2`}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold">
                  Add New Book
                </h3>
                <button
                  onClick={() => setShowAddBookModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={newBook.title}
                      onChange={(e) =>
                        setNewBook((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                      placeholder="Enter book title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">
                      Author *
                    </label>
                    <input
                      type="text"
                      value={newBook.author}
                      onChange={(e) =>
                        setNewBook((prev) => ({
                          ...prev,
                          author: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                      placeholder="Enter author name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">
                      Genre *
                    </label>
                    <input
                      type="text"
                      value={newBook.genre}
                      onChange={(e) =>
                        setNewBook((prev) => ({
                          ...prev,
                          genre: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                      placeholder="e.g., Fiction, Non-fiction, Science"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">
                      ISBN
                    </label>
                    <input
                      type="text"
                      value={newBook.isbn}
                      onChange={(e) =>
                        setNewBook((prev) => ({
                          ...prev,
                          isbn: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                      placeholder="Enter ISBN"
                    />
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">
                        Total Pages *
                      </label>
                      <input
                        type="number"
                        value={newBook.totalPages}
                        onChange={(e) =>
                          setNewBook((prev) => ({
                            ...prev,
                            totalPages: e.target.value,
                          }))
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                        placeholder="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">
                        Current Page
                      </label>
                      <input
                        type="number"
                        value={newBook.currentPage}
                        onChange={(e) =>
                          setNewBook((prev) => ({
                            ...prev,
                            currentPage: e.target.value,
                          }))
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">
                        Published Year
                      </label>
                      <input
                        type="number"
                        value={newBook.publishedYear}
                        onChange={(e) =>
                          setNewBook((prev) => ({
                            ...prev,
                            publishedYear: e.target.value,
                          }))
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                        placeholder="2024"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">
                        Language
                      </label>
                      <select
                        value={newBook.language}
                        onChange={(e) =>
                          setNewBook((prev) => ({
                            ...prev,
                            language: e.target.value,
                          }))
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base cursor-pointer ${inputClasses}`}
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={newBook.tags}
                      onChange={(e) =>
                        setNewBook((prev) => ({
                          ...prev,
                          tags: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                      placeholder="Add tags separated by commas"
                    />
                    <p className="text-xs opacity-70 mt-1">
                      e.g., Psychology, Self-Help, Business
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-600 mt-4 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddBookModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddBook}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm sm:text-base"
                >
                  Add Book
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Goals Modal */}
        {showGoalsModal && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div
              className={`rounded-xl max-w-md w-full p-4 sm:p-6 ${cardClasses} mx-2`}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold">
                  Set New Goal
                </h3>
                <button
                  onClick={() => setShowGoalsModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">
                    Goal Type
                  </label>
                  <select
                    value={newGoal.type}
                    onChange={(e) =>
                      setNewGoal((prev) => ({ ...prev, type: e.target.value }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base cursor-pointer ${inputClasses}`}
                  >
                    <option value="books">Books</option>
                    <option value="pages">Pages</option>
                    <option value="minutes">Minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">
                    Target
                  </label>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) =>
                      setNewGoal((prev) => ({
                        ...prev,
                        target: e.target.value,
                      }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                    placeholder="Enter target number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">
                    Time Period
                  </label>
                  <select
                    value={newGoal.period}
                    onChange={(e) =>
                      setNewGoal((prev) => ({
                        ...prev,
                        period: e.target.value,
                      }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base cursor-pointer ${inputClasses}`}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-600 mt-4 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setShowGoalsModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddGoal}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm sm:text-base"
                >
                  Create Goal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reading Session Modal */}
        {showSessionModal && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div
              className={`rounded-xl max-w-md w-full p-4 sm:p-6 ${cardClasses} mx-2`}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold">
                  Log Reading Session
                </h3>
                <button
                  onClick={() => setShowSessionModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">
                    Book
                  </label>
                  <select
                    value={newSession.bookId}
                    onChange={(e) =>
                      setNewSession((prev) => ({
                        ...prev,
                        bookId: e.target.value,
                      }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base cursor-pointer ${inputClasses}`}
                  >
                    <option value="">Select a book</option>
                    {books
                      .filter((book) => !book.isCompleted)
                      .map((book) => (
                        <option key={book.id} value={book.id}>
                          {book.title}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">
                      Pages Read
                    </label>
                    <input
                      type="number"
                      value={newSession.pages}
                      onChange={(e) =>
                        setNewSession((prev) => ({
                          ...prev,
                          pages: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">
                      Minutes
                    </label>
                    <input
                      type="number"
                      value={newSession.minutes}
                      onChange={(e) =>
                        setNewSession((prev) => ({
                          ...prev,
                          minutes: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={newSession.notes}
                    onChange={(e) =>
                      setNewSession((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                    placeholder="Any thoughts or notes about this session..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-600 mt-4 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Handle session logging logic here
                    setNewSession({
                      bookId: "",
                      pages: "",
                      minutes: "",
                      notes: "",
                    });
                    setShowSessionModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer text-sm sm:text-base"
                >
                  Log Session
                </button>
              </div>
            </div>
          </div>
        )}

        {/* <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900"> */}

        {/* Hero Section */}
        <section id="hero" className="pt-20   px-4 sm:px-6 lg:px-8 ">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Transform Your
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {" "}
                    Reading Journey
                  </span>
                </h1>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Discover the power of data-driven reading with advanced
                  analytics, goal tracking, and personalized insights that help
                  you read smarter, not harder.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Start Reading</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-green-400 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">
                          Reading Analytics
                        </h3>
                        <p className="text-blue-200 text-sm">
                          Track your progress in real-time
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-purple-400 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">
                          Smart Goals
                        </h3>
                        <p className="text-blue-200 text-sm">
                          Set and achieve reading targets
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 w-12 h-12 rounded-full flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">
                          Achievements
                        </h3>
                        <p className="text-blue-200 text-sm">
                          Unlock reading milestones
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-20 animate-pulse delay-75"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="pt-10 pb-20 px-4 sm:px-6 lg:px-8  backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Powerful Features
              </h2>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                Everything you need to become a better reader, backed by data
                and designed for success.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <BarChart3 className="w-8 h-8" />,
                  title: "Advanced Analytics",
                  description:
                    "Detailed insights into your reading patterns, speed, and preferences with beautiful visualizations.",
                  gradient: "from-blue-500 to-cyan-500",
                },
                {
                  icon: <Target className="w-8 h-8" />,
                  title: "Goal Tracking",
                  description:
                    "Set daily, weekly, monthly, or yearly reading goals and track your progress automatically.",
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  icon: <BookOpen className="w-8 h-8" />,
                  title: "Library Management",
                  description:
                    "Organize your books with smart categorization, tags, and powerful search capabilities.",
                  gradient: "from-green-500 to-emerald-500",
                },
                {
                  icon: <Trophy className="w-8 h-8" />,
                  title: "Achievement System",
                  description:
                    "Unlock badges and achievements as you hit reading milestones and build lasting habits.",
                  gradient: "from-yellow-500 to-orange-500",
                },
                {
                  icon: <Smartphone className="w-8 h-8" />,
                  title: "Mobile Responsive",
                  description:
                    "Access your reading data anywhere, anytime with our fully responsive design.",
                  gradient: "from-indigo-500 to-blue-500",
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Data Security",
                  description:
                    "Your reading data is secure and private, with export options to keep you in control.",
                  gradient: "from-red-500 to-pink-500",
                },
              ].map((feature, index) => (
                <div key={index} className="group relative">
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105">
                    <div
                      className={`bg-gradient-to-r ${feature.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-blue-200 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  About ReadMetrics Pro
                </h2>
                <p className="text-xl text-blue-200 mb-8 leading-relaxed">
                  Born from the passion for reading and the power of data,
                  ReadMetrics Pro transforms how you approach your reading
                  journey. We believe that understanding your reading habits is
                  the key to becoming a more engaged and successful reader.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">
                        Data-Driven Insights
                      </h4>
                      <p className="text-blue-200">
                        Make informed decisions about your reading habits with
                        comprehensive analytics.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">
                        Personal Growth
                      </h4>
                      <p className="text-blue-200">
                        Track your progress and celebrate achievements as you
                        build better reading habits.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">
                        Community Focus
                      </h4>
                      <p className="text-blue-200">
                        Join a community of readers who are passionate about
                        personal development through reading.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-8 backdrop-blur-lg border border-white/20">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">
                        10K+
                      </div>
                      <div className="text-blue-200 text-sm">
                        Active Readers
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">
                        500K+
                      </div>
                      <div className="text-blue-200 text-sm">Books Tracked</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">
                        95%
                      </div>
                      <div className="text-blue-200 text-sm">
                        Goal Achievement
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">
                        4.9★
                      </div>
                      <div className="text-blue-200 text-sm">User Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Reading Journey?
            </h2>
            <p className="text-xl text-blue-200 mb-12 max-w-2xl mx-auto">
              Join thousands of readers who have transformed their reading
              habits with ReadMetrics Pro.
            </p>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">
                    Global Community
                  </h3>
                  <p className="text-blue-200 text-sm">
                    Connect with readers worldwide
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">
                    24/7 Support
                  </h3>
                  <p className="text-blue-200 text-sm">
                    We're here to help you succeed
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">
                    Instant Setup
                  </h3>
                  <p className="text-blue-200 text-sm">
                    Start tracking in under 5 minutes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 cursor-pointer"
              >
                Get Started Today
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-white">
                  <h1 className="text-lg font-bold">ReadMetrics Pro</h1>
                  <p className="text-xs text-blue-200">
                    Enterprise Reading Analytics
                  </p>
                </div>
              </div>
              <div className="text-blue-200 text-sm text-center md:text-right">
                <p>© 2024 ReadMetrics Pro. All rights reserved.</p>
                <p className="mt-1">
                  Transform your reading journey with data-driven insights.
                </p>
              </div>
            </div>
          </div>
        </footer>
        {/* </div> */}
      </div>
    </>
  );

  if (!isAuthenticated) {
    return (
      <>
        <LandingPage />

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
              <div className="relative mb-6">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="absolute -top-2 -right-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
                <div className="text-center">
                  <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome Back
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Sign in to your ReadMetrics Pro account
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={(e) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter password"
                    required
                  />
                </div>

                {loginError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{loginError}</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium cursor-pointer"
                >
                  Sign In
                </button>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  <strong>Demo Credentials:</strong>
                  <br />
                  Username: admin
                  <br />
                  Password: password123
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${themeClasses}`}
    >
      {/* Enhanced Navigation */}
      <nav
        className={`shadow-sm border-b transition-colors duration-300 ${cardClasses}`}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="hidden xs:block">
                <h1 className="text-sm sm:text-xl font-bold">
                  ReadMetrics Pro
                </h1>
                <p className="text-xs opacity-70 hidden sm:block">
                  Enterprise Reading Analytics
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {["dashboard", "library", "analytics", "goals"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}

              <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4 pl-2 sm:pl-4 border-l border-gray-200 dark:border-gray-700">
                {/* <button
                                    onClick={() => setIsDarkMode(!isDarkMode)}
                                    className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                >
                                    {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                                </button> */}

                <button
                  onClick={exportData}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  title="Export Data"
                >
                  <Download size={16} />
                </button>

                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  <span className="text-xs sm:text-sm">Logout</span>
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t py-3 sm:py-4">
              <div className="space-y-1 sm:space-y-2">
                {["dashboard", "library", "analytics", "goals"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      activeTab === tab
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : ""
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
                <div className="border-t pt-2 mt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Enhanced Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Welcome Section */}
            <div
              className={`rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border ${cardClasses}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">
                    Welcome back! 📚
                  </h2>
                  <p className="opacity-70 text-sm sm:text-base">
                    You're doing great! Keep up the reading momentum.
                  </p>
                </div>
                <div className="flex items-center justify-center sm:justify-end space-x-4 sm:space-x-6">
                  <div className="text-center">
                    <div className="flex items-center space-x-1 text-orange-500 justify-center">
                      <Flame size={16} className="sm:w-5 sm:h-5" />
                      <span className="font-bold text-sm sm:text-lg">
                        {currentStreak}
                      </span>
                    </div>
                    <p className="text-xs opacity-70">Day Streak</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center space-x-1 text-purple-500 justify-center">
                      <Trophy size={16} className="sm:w-5 sm:h-5" />
                      <span className="font-bold text-sm sm:text-lg">
                        {achievements.filter((a) => a.unlockedAt).length}
                      </span>
                    </div>
                    <p className="text-xs opacity-70">Achievements</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <div
                className={`rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border hover:shadow-lg transition-shadow ${cardClasses}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium opacity-70 truncate">
                      Total Books
                    </p>
                    <p className="text-lg sm:text-2xl lg:text-3xl font-bold">
                      {stats.totalBooks}
                    </p>
                    <p className="text-xs opacity-50 mt-1 truncate">
                      {stats.inProgressBooks} in progress
                    </p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 sm:p-3 rounded-lg ml-2">
                    <Book className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div
                className={`rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border hover:shadow-lg transition-shadow ${cardClasses}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium opacity-70 truncate">
                      Completed
                    </p>
                    <p className="text-lg sm:text-2xl lg:text-3xl font-bold">
                      {stats.completedBooks}
                    </p>
                    <p className="text-xs opacity-50 mt-1 truncate">
                      {Math.round(stats.completionRate)}% completion rate
                    </p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900 p-2 sm:p-3 rounded-lg ml-2">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div
                className={`rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border hover:shadow-lg transition-shadow ${cardClasses}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium opacity-70 truncate">
                      Pages Read
                    </p>
                    <p className="text-lg sm:text-2xl lg:text-3xl font-bold">
                      {stats.totalPagesRead.toLocaleString()}
                    </p>
                    <p className="text-xs opacity-50 mt-1 truncate">
                      {Math.round(stats.avgPagesPerDay)} avg/day
                    </p>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 sm:p-3 rounded-lg ml-2">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div
                className={`rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border hover:shadow-lg transition-shadow ${cardClasses}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium opacity-70 truncate">
                      Reading Time
                    </p>
                    <p className="text-lg sm:text-2xl lg:text-3xl font-bold">
                      {Math.round(stats.totalReadingTime / 60)}h
                    </p>
                    <p className="text-xs opacity-50 mt-1 truncate">
                      {stats.totalReadingTime} minutes total
                    </p>
                  </div>
                  <div className="bg-yellow-100 dark:bg-yellow-900 p-2 sm:p-3 rounded-lg ml-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Goals Progress Section */}
            <div
              className={`rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border ${cardClasses}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                <h3 className="text-base sm:text-lg font-semibold">
                  Reading Goals
                </h3>
                <button
                  onClick={() => setShowGoalsModal(true)}
                  className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 cursor-pointer text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
                >
                  <Plus size={16} />
                  <span>Add Goal</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {readingGoals.map((goal) => (
                  <div key={goal.id} className="text-center">
                    <div className="relative inline-flex items-center justify-center mb-3 sm:mb-4">
                      <ProgressRing
                        progress={(goal.current / goal.target) * 100}
                        size={60}
                        strokeWidth={6}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm sm:text-lg font-bold">
                          {Math.round((goal.current / goal.target) * 100)}%
                        </span>
                      </div>
                    </div>
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">
                      {goal.current}/{goal.target} {goal.type}
                    </h4>
                    <p className="text-xs sm:text-sm opacity-70 capitalize">
                      {goal.period} Goal
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Enhanced Reading Progress Chart */}
              <div
                className={`rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border ${cardClasses}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Reading Activity
                  </h3>
                  <div className="flex space-x-2 sm:space-x-3 justify-center sm:justify-end">
                    <div className="flex items-center space-x-1 text-blue-600">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-600"></div>
                      <span className="text-xs">Pages</span>
                    </div>
                    <div className="flex items-center space-x-1 text-green-600">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-600"></div>
                      <span className="text-xs">Minutes</span>
                    </div>
                  </div>
                </div>
                <div className="h-48 sm:h-56 lg:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyProgress.slice(-7)}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDarkMode ? "#374151" : "#f0f0f0"}
                      />
                      <XAxis
                        dataKey="date"
                        tick={{
                          fontSize: 10,
                          fill: isDarkMode ? "#9CA3AF" : "#6B7280",
                        }}
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString("en-US", {
                            weekday: "short",
                          })
                        }
                      />
                      <YAxis
                        tick={{
                          fontSize: 10,
                          fill: isDarkMode ? "#9CA3AF" : "#6B7280",
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDarkMode ? "#374151" : "#ffffff",
                          border: `1px solid ${
                            isDarkMode ? "#4B5563" : "#E5E7EB"
                          }`,
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        labelFormatter={(value) =>
                          new Date(value).toLocaleDateString()
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="pages"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ fill: "#3B82F6", strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, stroke: "#3B82F6", strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="minutes"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ fill: "#10B981", strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, stroke: "#10B981", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Progress */}
              <div
                className={`rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border ${cardClasses}`}
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Monthly Progress
                  </h3>
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="h-48 sm:h-56 lg:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyProgress}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDarkMode ? "#374151" : "#f0f0f0"}
                      />
                      <XAxis
                        dataKey="month"
                        tick={{
                          fontSize: 10,
                          fill: isDarkMode ? "#9CA3AF" : "#6B7280",
                        }}
                      />
                      <YAxis
                        tick={{
                          fontSize: 10,
                          fill: isDarkMode ? "#9CA3AF" : "#6B7280",
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDarkMode ? "#374151" : "#ffffff",
                          border: `1px solid ${
                            isDarkMode ? "#4B5563" : "#E5E7EB"
                          }`,
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar
                        dataKey="books"
                        fill="#3B82F6"
                        name="Books"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Achievements Section */}
            <div
              className={`rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border ${cardClasses}`}
            >
              <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">
                Recent Achievements
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 sm:p-4 rounded-lg border text-center transition-all hover:scale-105   ${
                      achievement.unlockedAt
                        ? "bg-gradient-to-r from-blue-900 to-blue-800 border-blue-700" // blue dark mode
                        : "opacity-50"
                    }`}
                  >
                    <div className="text-xl sm:text-2xl mb-2">
                      {achievement.icon}
                    </div>
                    <h4 className="font-semibold text-xs sm:text-sm mb-1">
                      {achievement.title}
                    </h4>
                    <p className="text-xs opacity-70 mb-2 hidden sm:block">
                      {achievement.description}
                    </p>

                    <div
                      className={`w-full bg-gray-700 rounded-full h-1.5 sm:h-2 ${
                        achievement.unlockedAt ? "hidden" : ""
                      }`}
                    >
                      <div
                        className="bg-blue-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (achievement.progress / achievement.target) * 100
                          }%`,
                        }}
                      ></div>
                    </div>

                    {achievement.unlockedAt && (
                      <div className="flex items-center justify-center space-x-1 text-green-500">
                        <CheckCircle size={10} className="sm:w-3 sm:h-3" />
                        <span className="text-xs">Unlocked</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Currently Reading with Enhanced UI */}
            <div
              className={`rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border ${cardClasses}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                <h3 className="text-base sm:text-lg font-semibold">
                  Currently Reading
                </h3>
                {/* <button
                                    onClick={() => setShowSessionModal(true)}
                                    className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 cursor-pointer text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
                                >
                                    <Timer size={16} />
                                    <span>Log Session</span>
                                </button> */}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {books
                  .filter((book) => !book.isCompleted)
                  .map((book) => (
                    <div
                      key={book.id}
                      className={`border rounded-lg p-3 sm:p-4 hover:shadow-lg transition-all ${
                        isDarkMode ? "border-gray-600" : "border-gray-200"
                      }`}
                    >
                      <div className="flex space-x-3 sm:space-x-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={book.cover}
                            alt={book.title}
                            className="w-12 h-16 sm:w-16 sm:h-20 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => toggleFavorite(book.id)}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-white shadow-md hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Heart
                              size={10}
                              className={`sm:w-3 sm:h-3 ${
                                book.favorite
                                  ? "text-red-500 fill-current"
                                  : "text-gray-400"
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-xs sm:text-sm mb-1 truncate">
                            {book.title}
                          </h4>
                          <p className="text-xs opacity-70 mb-2 truncate">
                            {book.author}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {book.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded truncate"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="opacity-70">Progress</span>
                              <span className="font-medium">
                                {Math.round(
                                  (book.currentPage / book.totalPages) * 100
                                )}
                                %
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${
                                    (book.currentPage / book.totalPages) * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                max={book.totalPages}
                                value={book.currentPage}
                                onChange={(e) =>
                                  updateBookProgress(
                                    book.id,
                                    Math.min(
                                      parseInt(e.target.value) || 0,
                                      book.totalPages
                                    )
                                  )
                                }
                                className={`flex-1 px-2 py-1 border rounded text-xs ${inputClasses}`}
                                placeholder="Page"
                              />
                              <span className="text-xs opacity-50 whitespace-nowrap">
                                / {book.totalPages}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Library Tab */}
        {activeTab === "library" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Enhanced Search and Filter */}
            <div
              className={`rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border ${cardClasses}`}
            >
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search books, authors, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${inputClasses}`}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer ${inputClasses}`}
                  >
                    <option value="all">All Status</option>
                    <option value="reading">Currently Reading</option>
                    <option value="completed">Completed</option>
                    <option value="toread">To Read</option>
                  </select>
                  <select
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer ${inputClasses}`}
                  >
                    <option value="all">All Genres</option>
                    {Array.from(new Set(books.map((book) => book.genre))).map(
                      (genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      )
                    )}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer ${inputClasses}`}
                  >
                    <option value="dateAdded">Date Added</option>
                    <option value="title">Title</option>
                    <option value="author">Author</option>
                    <option value="progress">Progress</option>
                    <option value="rating">Rating</option>
                  </select>
                  <div className="flex border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-3 py-2 cursor-pointer ${
                        viewMode === "grid"
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="grid grid-cols-2 gap-1 w-3 h-3 sm:w-4 sm:h-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="bg-current rounded-sm"></div>
                        ))}
                      </div>
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-3 py-2 cursor-pointer ${
                        viewMode === "list"
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="space-y-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="bg-current h-0.5 w-3 sm:w-4 rounded"
                          ></div>
                        ))}
                      </div>
                    </button>
                  </div>
                  {hasActiveFilters() && (
                    <button
                      onClick={resetFilters}
                      className="bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2 cursor-pointer text-sm sm:text-base justify-center"
                    >
                      <X size={16} />
                      <span className="sm:inline">Reset Filters</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowAddBookModal(true)}
                    className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 cursor-pointer text-sm sm:text-base justify-center"
                  >
                    <Plus size={16} />
                    <span className="sm:inline">Add Book</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Books Display */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    className={`group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300 hover:-translate-y-1 ${
                      isDarkMode ? "" : "hover:shadow-xl hover:shadow-gray-100/50"
                    }`}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-40 sm:h-48 lg:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(book.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 hover:scale-110 transition-all duration-200 cursor-pointer shadow-sm"
                      >
                        <Heart
                          size={14}
                          className={`${
                            book.favorite
                              ? "text-red-500 fill-current"
                              : "text-gray-400 hover:text-red-400"
                          } transition-colors`}
                        />
                      </button>
                      
                      {/* Completion Badge */}
                      {book.isCompleted && (
                        <div className="absolute top-3 left-3 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
                          ✓ Completed
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 sm:p-5">
                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate mb-3">
                          {book.author}
                        </p>
                        
                        {/* Genre and Year */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2.5 py-1 rounded-lg font-medium">
                            {book.genre}
                          </span>
                          {book.publishedYear && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {book.publishedYear}
                            </span>
                          )}
                        </div>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {book.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded truncate"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {book.isCompleted ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-medium text-green-600">
                              Completed
                            </span>
                            <Award className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm opacity-70">
                              Rating:
                            </span>
                            <StarRating
                              rating={book.rating}
                              onRate={(rating) => rateBook(book.id, rating)}
                            />
                          </div>
                          {book.dateCompleted && (
                            <p className="text-xs opacity-50">
                              Finished:{" "}
                              {new Date(
                                book.dateCompleted
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="opacity-70">Progress</span>
                            <span className="font-medium">
                              {Math.round(
                                (book.currentPage / book.totalPages) * 100
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${
                                  (book.currentPage / book.totalPages) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              max={book.totalPages}
                              value={book.currentPage}
                              onChange={(e) =>
                                updateBookProgress(
                                  book.id,
                                  Math.min(
                                    parseInt(e.target.value) || 0,
                                    book.totalPages
                                  )
                                )
                              }
                              className={`flex-1 px-2 py-1 border rounded text-xs ${inputClasses}`}
                              placeholder="Page"
                            />
                            <span className="text-xs opacity-50 whitespace-nowrap">
                              / {book.totalPages}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="flex items-start space-x-4 sm:space-x-6">
                      <div className="relative flex-shrink-0">
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-16 h-20 sm:w-20 sm:h-28 object-cover rounded-xl shadow-sm"
                        />
                        {book.isCompleted && (
                          <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1.5 shadow-sm">
                            <CheckCircle size={12} className="sm:w-4 sm:h-4" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {book.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base truncate mb-3">
                              {book.author}
                            </p>
                            
                            {/* Metadata */}
                            <div className="flex items-center space-x-4 mb-3 flex-wrap gap-2">
                              <span className="inline-flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2.5 py-1 rounded-lg font-medium">
                                {book.genre}
                              </span>
                              {book.publishedYear && (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {book.publishedYear}
                                </span>
                              )}
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {book.totalPages} pages
                              </span>
                            </div>
                            
                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {book.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => toggleFavorite(book.id)}
                              className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                            >
                              <Heart
                                size={16}
                                className={`${
                                  book.favorite
                                    ? "text-red-500 fill-current"
                                    : "text-gray-400 hover:text-red-400"
                                } transition-colors`}
                              />
                            </button>
                          </div>
                        </div>
                        
                        {/* Progress Section */}
                        <div className="mt-4">
                          {book.isCompleted ? (
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <div className="flex items-center space-x-3">
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium text-sm flex items-center gap-1.5">
                                  <Award className="w-4 h-4" />
                                  Completed
                                </span>
                                <StarRating
                                  rating={book.rating}
                                  onRate={(rating) => rateBook(book.id, rating)}
                                />
                              </div>
                              {book.dateCompleted && (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  Finished: {new Date(book.dateCompleted).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  Progress: {Math.round((book.currentPage / book.totalPages) * 100)}%
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {book.currentPage} / {book.totalPages} pages
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-4">
                                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 relative overflow-hidden"
                                    style={{
                                      width: `${(book.currentPage / book.totalPages) * 100}%`,
                                    }}
                                  >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                  </div>
                                </div>
                                
                                <input
                                  type="number"
                                  max={book.totalPages}
                                  value={book.currentPage}
                                  onChange={(e) =>
                                    updateBookProgress(
                                      book.id,
                                      Math.min(
                                        parseInt(e.target.value) || 0,
                                        book.totalPages
                                      )
                                    )
                                  }
                                  className="w-20 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Enhanced Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Analytics Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <div
                className={`rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border text-center ${cardClasses}`}
              >
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold text-sm sm:text-base">
                  Daily Average
                </h4>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                  {Math.round(
                    dailyProgress.reduce((sum, day) => sum + day.pages, 0) /
                      dailyProgress.length
                  )}{" "}
                  pages
                </p>
                <p className="text-xs sm:text-sm opacity-70">
                  {Math.round(
                    dailyProgress.reduce((sum, day) => sum + day.minutes, 0) /
                      dailyProgress.length
                  )}{" "}
                  minutes
                </p>
              </div>
              <div
                className={`rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border text-center ${cardClasses}`}
              >
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-sm sm:text-base">
                  Completion Rate
                </h4>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                  {Math.round((stats.completedBooks / stats.totalBooks) * 100)}%
                </p>
                <p className="text-xs sm:text-sm opacity-70">
                  {stats.completedBooks} of {stats.totalBooks} books
                </p>
              </div>
              <div
                className={`rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border text-center ${cardClasses}`}
              >
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold text-sm sm:text-base">
                  Pages per Book
                </h4>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
                  {Math.round(stats.totalPagesRead / stats.totalBooks)}
                </p>
                <p className="text-xs sm:text-sm opacity-70">
                  Average across all books
                </p>
              </div>
              <div
                className={`rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border text-center ${cardClasses}`}
              >
                <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-semibold text-sm sm:text-base">
                  Genre Diversity
                </h4>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">
                  {stats.uniqueGenres}
                </p>
                <p className="text-xs sm:text-sm opacity-70">
                  Different genres explored
                </p>
              </div>
            </div>

            {/* Detailed Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Genre Distribution */}
              <div
                className={`rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border ${cardClasses}`}
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Genre Distribution
                  </h3>
                  <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="h-48 sm:h-56 lg:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={genreData}
                        cx="50%"
                        cy="50%"
                        outerRadius={47}
                        dataKey="value"
                        tooltipType="none"
                        label={({ name, percent }) => `${name}`}
                      >
                        {genreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDarkMode ? "#374151" : "#ffffff",
                          border: `1px solid ${
                            isDarkMode ? "#4B5563" : "#E5E7EB"
                          }`,
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Reading Heatmap */}
              <div
                className={`rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border ${cardClasses}`}
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Reading Heatmap
                  </h3>
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {readingHeatmapData.slice(-28).map((day, index) => (
                    <div
                      key={index}
                      className={`aspect-square rounded-sm cursor-pointer hover:scale-110 transition-transform ${
                        day.level === 0
                          ? "bg-gray-100 dark:bg-gray-800"
                          : day.level === 1
                          ? "bg-green-200 dark:bg-green-800"
                          : day.level === 2
                          ? "bg-green-300 dark:bg-green-700"
                          : day.level === 3
                          ? "bg-green-400 dark:bg-green-600"
                          : "bg-green-500 dark:bg-green-500"
                      }`}
                      title={`${day.date}: ${day.value} pages`}
                    ></div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 text-xs sm:text-sm opacity-70">
                  <span>Less</span>
                  <div className="flex space-x-1">
                    {[0, 1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-sm ${
                          level === 0
                            ? "bg-gray-100 dark:bg-gray-800"
                            : level === 1
                            ? "bg-green-200 dark:bg-green-800"
                            : level === 2
                            ? "bg-green-300 dark:bg-green-700"
                            : level === 3
                            ? "bg-green-400 dark:bg-green-600"
                            : "bg-green-500 dark:bg-green-500"
                        }`}
                      ></div>
                    ))}
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>

            {/* Reading Streaks */}
            <div
              className={`rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border ${cardClasses}`}
            >
              <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">
                Reading Streaks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold mb-2">
                    {currentStreak} days
                  </h4>
                  <p className="opacity-70 text-sm sm:text-base">
                    Current Streak
                  </p>
                  <p className="text-xs sm:text-sm opacity-50 mt-2">
                    Keep it up! You're doing great!
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-r from-purple-400 to-pink-500 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold mb-2">
                    {longestStreak} days
                  </h4>
                  <p className="opacity-70 text-sm sm:text-base">
                    Longest Streak
                  </p>
                  <p className="text-xs sm:text-sm opacity-50 mt-2">
                    Your personal best record
                  </p>
                </div>
              </div>
            </div>

            {/* Completed Books Timeline */}
            <div
              className={`rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border ${cardClasses}`}
            >
              <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">
                Completed Books
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {books
                  .filter((book) => book.isCompleted)
                  .map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-10 h-12 sm:w-12 sm:h-16 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm sm:text-base truncate">
                            {book.title}
                          </h4>
                          <p className="text-xs sm:text-sm opacity-70 truncate">
                            {book.author}
                          </p>
                          <div className="flex items-center space-x-2 mt-1 flex-wrap">
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                              {book.genre}
                            </span>
                            <span className="text-xs opacity-50">
                              {book.totalPages} pages
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <StarRating rating={book.rating} readOnly />
                        <p className="text-xs opacity-50 mt-1">
                          Completed:{" "}
                          {book.dateCompleted
                            ? new Date(book.dateCompleted).toLocaleDateString()
                            : "Unknown"}
                        </p>
                        <div className="flex items-center justify-end space-x-1 mt-2">
                          {book.favorite && (
                            <Heart
                              size={10}
                              className="sm:w-3 sm:h-3 text-red-500 fill-current"
                            />
                          )}
                          <span className="text-xs opacity-50">
                            {book.readingSessions.length} sessions
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === "goals" && (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Goals Overview */}
            <div
              className={`rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border ${cardClasses}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                <h2 className="text-xl sm:text-2xl font-bold">Reading Goals</h2>
                <button
                  onClick={() => setShowGoalsModal(true)}
                  className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 cursor-pointer text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
                >
                  <Plus size={16} />
                  <span>New Goal</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {readingGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="text-center p-4 sm:p-6 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <div className="relative inline-flex items-center justify-center mb-3 sm:mb-4">
                      <ProgressRing
                        progress={(goal.current / goal.target) * 100}
                        size={80}
                        strokeWidth={8}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg sm:text-xl font-bold">
                          {goal.current}
                        </span>
                        <span className="text-xs opacity-70">
                          /{goal.target}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg mb-2 capitalize">
                      {goal.period} {goal.type} Goal
                    </h3>
                    <p className="text-sm opacity-70 mb-3 sm:mb-4">
                      {Math.round((goal.current / goal.target) * 100)}% Complete
                    </p>
                    <div className="text-xs opacity-50">
                      {new Date(goal.startDate).toLocaleDateString()} -{" "}
                      {new Date(goal.endDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Goal Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div
                className={`rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border ${cardClasses}`}
              >
                <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">
                  Goal Progress Over Time
                </h3>
                <div className="h-48 sm:h-56 lg:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyProgress.slice(-14)}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDarkMode ? "#374151" : "#f0f0f0"}
                      />
                      <XAxis
                        dataKey="date"
                        tick={{
                          fontSize: 10,
                          fill: isDarkMode ? "#9CA3AF" : "#6B7280",
                        }}
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        }
                      />
                      <YAxis
                        tick={{
                          fontSize: 10,
                          fill: isDarkMode ? "#9CA3AF" : "#6B7280",
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDarkMode ? "#374151" : "#ffffff",
                          border: `1px solid ${
                            isDarkMode ? "#4B5563" : "#E5E7EB"
                          }`,
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="pages"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div
                className={`rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border ${cardClasses}`}
              >
                <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">
                  Achievement Progress
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {achievements
                    .filter((a) => !a.unlockedAt)
                    .slice(0, 5)
                    .map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center space-x-3 sm:space-x-4"
                      >
                        <div className="text-xl sm:text-2xl flex-shrink-0">
                          {achievement.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm sm:text-base truncate">
                              {achievement.title}
                            </h4>
                            <span className="text-xs sm:text-sm opacity-70 ml-2 flex-shrink-0">
                              {achievement.progress}/{achievement.target}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm opacity-70 mb-2">
                            {achievement.description}
                          </p>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${
                                  (achievement.progress / achievement.target) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Add Book Modal */}
      {showAddBookModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div
            className={`rounded-xl max-w-2xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto ${cardClasses} mx-2`}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold">Add New Book</h3>
              <button
                onClick={() => setShowAddBookModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newBook.title}
                    onChange={(e) =>
                      setNewBook((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                    placeholder="Enter book title"
                    required
                  />
                  {bookValidation.title && (
                    <p className="text-red-500 text-xs mt-1">
                      {bookValidation.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    value={newBook.author}
                    onChange={(e) =>
                      setNewBook((prev) => ({
                        ...prev,
                        author: e.target.value,
                      }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                    placeholder="Enter author name"
                    required
                  />
                  {bookValidation.author && (
                    <p className="text-red-500 text-xs mt-1">
                      {bookValidation.author}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">
                    Genre *
                  </label>
                  <input
                    type="text"
                    value={newBook.genre}
                    onChange={(e) =>
                      setNewBook((prev) => ({ ...prev, genre: e.target.value }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                    placeholder="e.g., Fiction, Non-fiction, Science"
                    required
                  />
                  {bookValidation.genre && (
                    <p className="text-red-500 text-xs mt-1">
                      {bookValidation.genre}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">
                    ISBN
                  </label>
                  <input
                    type="text"
                    value={newBook.isbn}
                    onChange={(e) =>
                      setNewBook((prev) => ({ ...prev, isbn: e.target.value }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                    placeholder="Enter ISBN"
                  />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">
                      Total Pages *
                    </label>
                    <input
                      type="number"
                      value={newBook.totalPages}
                      onChange={(e) =>
                        setNewBook((prev) => ({
                          ...prev,
                          totalPages: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                      placeholder="0"
                      required
                    />
                    {bookValidation.totalPages && (
                      <p className="text-red-500 text-xs mt-1">
                        {bookValidation.totalPages}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">
                      Current Page
                    </label>
                    <input
                      type="number"
                      value={newBook.currentPage}
                      onChange={(e) =>
                        setNewBook((prev) => ({
                          ...prev,
                          currentPage: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                      placeholder="0"
                    />
                    {bookValidation.currentPage && (
                      <p className="text-red-500 text-xs mt-1">
                        {bookValidation.currentPage}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">
                      Published Year
                    </label>
                    <input
                      type="number"
                      value={newBook.publishedYear}
                      onChange={(e) =>
                        setNewBook((prev) => ({
                          ...prev,
                          publishedYear: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                      placeholder="2024"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">
                      Language
                    </label>
                    <select
                      value={newBook.language}
                      onChange={(e) =>
                        setNewBook((prev) => ({
                          ...prev,
                          language: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base cursor-pointer ${inputClasses}`}
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={newBook.tags}
                    onChange={(e) =>
                      setNewBook((prev) => ({ ...prev, tags: e.target.value }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                    placeholder="Add tags separated by commas"
                  />
                  <p className="text-xs opacity-70 mt-1">
                    e.g., Psychology, Self-Help, Business
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-600 mt-4 sm:mt-6">
              <button
                type="button"
                onClick={() => setShowAddBookModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddBook}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm sm:text-base"
              >
                Add Book
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Goals Modal */}
      {showGoalsModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div
            className={`rounded-xl max-w-md w-full p-4 sm:p-6 ${cardClasses} mx-2`}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold">Set New Goal</h3>
              <button
                onClick={() => setShowGoalsModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  Goal Type
                </label>
                <select
                  value={newGoal.type}
                  onChange={(e) =>
                    setNewGoal((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base cursor-pointer ${inputClasses}`}
                >
                  <option value="books">Books</option>
                  <option value="pages">Pages</option>
                  <option value="minutes">Minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  Target
                </label>
                <input
                  type="number"
                  value={newGoal.target}
                  onChange={(e) =>
                    setNewGoal((prev) => ({ ...prev, target: e.target.value }))
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                  placeholder="Enter target number"
                  required
                />
                {goalValidation.target && (
                  <p className="text-red-500 text-xs mt-1">
                    {goalValidation.target}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  Time Period
                </label>
                <select
                  value={newGoal.period}
                  onChange={(e) =>
                    setNewGoal((prev) => ({ ...prev, period: e.target.value }))
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base cursor-pointer ${inputClasses}`}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-600 mt-4 sm:mt-6">
              <button
                type="button"
                onClick={() => setShowGoalsModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddGoal}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm sm:text-base"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reading Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div
            className={`rounded-xl max-w-md w-full p-4 sm:p-6 ${cardClasses} mx-2`}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold">
                Log Reading Session
              </h3>
              <button
                onClick={() => setShowSessionModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  Book
                </label>
                <select
                  value={newSession.bookId}
                  onChange={(e) =>
                    setNewSession((prev) => ({
                      ...prev,
                      bookId: e.target.value,
                    }))
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base cursor-pointer ${inputClasses}`}
                >
                  <option value="">Select a book</option>
                  {books
                    .filter((book) => !book.isCompleted)
                    .map((book) => (
                      <option key={book.id} value={book.id}>
                        {book.title}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">
                    Pages Read
                  </label>
                  <input
                    type="number"
                    value={newSession.pages}
                    onChange={(e) =>
                      setNewSession((prev) => ({
                        ...prev,
                        pages: e.target.value,
                      }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">
                    Minutes
                  </label>
                  <input
                    type="number"
                    value={newSession.minutes}
                    onChange={(e) =>
                      setNewSession((prev) => ({
                        ...prev,
                        minutes: e.target.value,
                      }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={newSession.notes}
                  onChange={(e) =>
                    setNewSession((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${inputClasses}`}
                  placeholder="Any thoughts or notes about this session..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-600 mt-4 sm:mt-6">
              <button
                type="button"
                onClick={() => setShowSessionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  // Handle session logging logic here
                  setNewSession({
                    bookId: "",
                    pages: "",
                    minutes: "",
                    notes: "",
                  });
                  setShowSessionModal(false);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer text-sm sm:text-base"
              >
                Log Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadMetrics;

// Zod Schema
export const Schema = {
    "commentary": "To create a dashboard for tracking books, pages completed per day, and visualizing progress, I will use Next.js with TypeScript and Tailwind CSS for styling. The dashboard will include a chart for daily reading habits, a pie chart for genre distribution, and a section for finished books where users can mark books as completed and rate them. State management will be handled using React's useState and useEffect hooks.",
    "template": "nextjs-developer",
    "title": "Reading Dashboard",
    "description": "A dashboard to track reading progress and visualize book data.",
    "additional_dependencies": [
        "recharts",
        "lucide-react"
    ],
    "has_additional_dependencies": true,
    "install_dependencies_command": "npm install recharts lucide-react",
    "port": 3000,
    "file_path": "pages/index.tsx",
    "code": "<see code above>"
}