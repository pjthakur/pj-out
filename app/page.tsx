"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  PieChart,
  BarChart3,
  Plus,
  X,
  Menu,
  LogOut,
  User,
  Target,
  Briefcase,
  Globe,
  ChevronDown,
  Eye,
  EyeOff,
  Download,
  Filter,
  Moon,
  Sun,
  Bell,
  Settings,
  Users,
  FileText,
  CreditCard,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Search,
  RefreshCw,
  Award,
  Shield,
  Zap,
  Check,
  Star,
  ArrowRight,
  PlayCircle,
  Activity,
  Smartphone,
  Mail,
  Phone,
  MapPin,
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
  BarChart,
  Bar,
  Pie,
  AreaChart,
  Area,
} from "recharts";

// Types
interface IncomeEntry {
  id: string;
  platform: "Upwork" | "Fiverr" | "Direct Client" | "Freelancer" | "Toptal";
  amount: number;
  date: string;
  projectType: string;
  hours: number;
  description: string;
  clientName: string;
  status: "Paid" | "Pending" | "Overdue";
}

interface User {
  email: string;
  name: string;
}

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  type: "monthly" | "yearly" | "project" | "quarterly";
}

// Google Fonts component
const GoogleFontsLink = () => {
  useEffect(() => {
    // Check if the font link already exists
    const existingLink = document.querySelector('link[href*="fonts.googleapis.com"]');
    if (!existingLink) {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    
    // Apply font to body
    document.body.style.fontFamily = "'Poppins', sans-serif";
    
    return () => {
      // Don't remove the link on cleanup to avoid re-downloading
      document.body.style.fontFamily = '';
    };
  }, []);
  
  return null;
};

const IncomeDashboard: React.FC = () => {
  // Add Google Fonts component
  GoogleFontsLink();
  
  // Add global styles for Poppins font
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      * {
        font-family: 'Poppins', sans-serif !important;
      }
      body {
        font-family: 'Poppins', sans-serif !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Page state
  const [currentPage, setCurrentPage] = useState<"landing" | "dashboard">(
    "landing"
  );
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Theme and UI state
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "analytics" | "goals" | "clients"
  >("overview");

  // Dashboard state
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([
    {
      id: "1",
      platform: "Upwork",
      amount: 2500,
      date: "2024-01-15",
      projectType: "UI/UX",
      hours: 40,
      description: "E-commerce website",
      clientName: "TechCorp Inc.",
      status: "Paid",
    },
    {
      id: "2",
      platform: "Fiverr",
      amount: 800,
      date: "2024-01-20",
      projectType: "Design",
      hours: 16,
      description: "Logo design package",
      clientName: "StartupXYZ",
      status: "Paid",
    },
    {
      id: "3",
      platform: "Direct Client",
      amount: 3200,
      date: "2024-02-01",
      projectType: "Tooling",
      hours: 32,
      description: "Technical consultation",
      clientName: "Enterprise Solutions",
      status: "Paid",
    },
    {
      id: "4",
      platform: "Upwork",
      amount: 1800,
      date: "2024-02-10",
      projectType: "UiUx",
      hours: 24,
      description: "React dashboard",
      clientName: "DigitalFlow",
      status: "Paid",
    },
    {
      id: "5",
      platform: "Fiverr",
      amount: 600,
      date: "2024-02-15",
      projectType: "Writing",
      hours: 12,
      description: "Content creation",
      clientName: "ContentHub",
      status: "Pending",
    },
    {
      id: "6",
      platform: "Direct Client",
      amount: 4500,
      date: "2024-03-01",
      projectType: "UiUx",
      hours: 60,
      description: "Full-stack application",
      clientName: "InnovateLab",
      status: "Paid",
    },
    {
      id: "7",
      platform: "Toptal",
      amount: 5200,
      date: "2024-03-05",
      projectType: "Consult",
      hours: 52,
      description: "System architecture",
      clientName: "GlobalTech",
      status: "Paid",
    },
    {
      id: "8",
      platform: "Freelancer",
      amount: 950,
      date: "2024-03-10",
      projectType: "Mobile",
      hours: 19,
      description: "iOS app development",
      clientName: "MobileFirst",
      status: "Pending",
    },
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Monthly Revenue Goal",
      target: 8000,
      current: 6500,
      deadline: "2024-03-31",
      type: "monthly",
    },
    {
      id: "2",
      title: "Annual Income Target",
      target: 120000,
      current: 22650,
      deadline: "2024-12-31",
      type: "yearly",
    },
    {
      id: "3",
      title: "New Client Acquisition",
      target: 10,
      current: 6,
      deadline: "2024-06-30",
      type: "project",
    },
    {
      id: "4",
      title: "Social Media Growth",
      target: 5000,
      current: 3200,
      deadline: "2024-08-31",
      type: "monthly",
    },
    {
      id: "5",
      title: "Product Launch Completion",
      target: 1,
      current: 0,
      deadline: "2024-09-15",
      type: "project",
    },
    {
      id: "6",
      title: "Customer Retention Rate",
      target: 90,
      current: 75,
      deadline: "2024-07-31",
      type: "monthly",
    },
    {
      id: "7",
      title: "Quarterly Training Hours",
      target: 40,
      current: 28,
      deadline: "2024-06-30",
      type: "quarterly",
    },
    {
      id: "8",
      title: "Website Traffic Increase",
      target: 100000,
      current: 76500,
      deadline: "2024-10-31",
      type: "monthly",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [newEntry, setNewEntry] = useState({
    platform: "Upwork" as const,
    amount: "",
    date: "",
    projectType: "",
    hours: "",
    description: "",
    clientName: "",
    status: "Paid" as const,
  });

  const [newGoal, setNewGoal] = useState({
    title: "",
    target: "",
    deadline: "",
    type: "monthly" as const,
  });

  // Add body scroll lock effect
  useEffect(() => {
    if (showLoginModal || showAddModal || showGoalModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLoginModal, showAddModal, showGoalModal]);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setShowMobileMenu(false);
    }
  }, []);

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation function
  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  // Handle email input change with validation
  const handleEmailChange = (email: string) => {
    setLoginForm((prev) => ({ ...prev, email }));
    
    if (email.trim() === "") {
      setEmailError("");
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  // Handle password input change with validation
  const handlePasswordChange = (password: string) => {
    setLoginForm((prev) => ({ ...prev, password }));
    
    if (password === "") {
      setPasswordError("");
    } else if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters long");
    } else {
      setPasswordError("");
    }
  };

  // Login handler - Updated to accept any credentials
  const handleLogin = useCallback(() => {
    if (!loginForm.email.trim()) {
      setEmailError("Email is required");
      return;
    }
    
    if (!validateEmail(loginForm.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    if (!loginForm.password.trim()) {
      setPasswordError("Password is required");
      return;
    }

    if (!validatePassword(loginForm.password)) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    setIsAuthenticated(true);
    setUser({ 
      email: loginForm.email, 
      name: loginForm.email.split('@')[0].charAt(0).toUpperCase() + loginForm.email.split('@')[0].slice(1)
    });
    setCurrentPage("dashboard");
    setShowLoginModal(false);
    setLoginForm({ email: "", password: "" });
    setEmailError("");
    setPasswordError("");
  }, [loginForm, validateEmail, validatePassword]);

  // Logout handler
  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage("landing");
    setMobileMenuOpen(false);
  }, []);

  // Export to Excel
  // const handleExportToExcel = useCallback(() => {
  //     try {
  //         const exportData = filteredEntries.map(entry => ({
  //             Date: new Date(entry.date).toLocaleDateString(),
  //             Platform: entry.platform,
  //             Client: entry.clientName,
  //             'Project Type': entry.projectType,
  //             Description: entry.description,
  //             Amount: entry.amount,
  //             Hours: entry.hours,
  //             'Hourly Rate': (entry.amount / entry.hours).toFixed(2),
  //             Status: entry.status
  //         }));

  //         const worksheet = XLSX.utils.json_to_sheet(exportData);
  //         const workbook = XLSX.utils.book_new();

  //         // Add some styling and formatting
  //         const colWidths = [
  //             { wch: 12 }, // Date
  //             { wch: 15 }, // Platform
  //             { wch: 20 }, // Client
  //             { wch: 18 }, // Project Type
  //             { wch: 30 }, // Description
  //             { wch: 12 }, // Amount
  //             { wch: 8 },  // Hours
  //             { wch: 12 }, // Hourly Rate
  //             { wch: 10 }  // Status
  //         ];

  //         worksheet['!cols'] = colWidths;

  //         XLSX.utils.book_append_sheet(workbook, worksheet, 'Income Data');

  //         const fileName = `freelance-income-${new Date().toISOString().split('T')[0]}.xlsx`;
  //         XLSX.writeFile(workbook, fileName);
  //     } catch (error) {
  //         console.error('Export failed:', error);
  //         alert('Export failed. Please try again.');
  //     }
  // }, [filteredEntries]);

  // Add new income entry
  const handleAddEntry = useCallback(() => {
    if (
      newEntry.amount &&
      newEntry.date &&
      newEntry.projectType &&
      newEntry.hours &&
      newEntry.description &&
      newEntry.clientName
    ) {
      const entry: IncomeEntry = {
        id: Date.now().toString(),
        platform: newEntry.platform,
        amount: parseFloat(newEntry.amount),
        date: newEntry.date,
        projectType: newEntry.projectType,
        hours: parseFloat(newEntry.hours),
        description: newEntry.description,
        clientName: newEntry.clientName,
        status: newEntry.status,
      };
      setIncomeEntries((prev) => [...prev, entry]);
      setNewEntry({
        platform: "Upwork",
        amount: "",
        date: "",
        projectType: "",
        hours: "",
        description: "",
        clientName: "",
        status: "Paid",
      });
      setShowAddModal(false);
    }
  }, [newEntry]);

  // Add new goal
  const handleAddGoal = useCallback(() => {
    if (newGoal.title && newGoal.target && newGoal.deadline) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        target: parseFloat(newGoal.target),
        current: 0,
        deadline: newGoal.deadline,
        type: newGoal.type,
      };
      setGoals((prev) => [...prev, goal]);
      setNewGoal({
        title: "",
        target: "",
        deadline: "",
        type: "monthly",
      });
      setShowGoalModal(false);
    }
  }, [newGoal]);

  // Filter entries based on date and search
  const filteredEntries = useMemo(() => {
    let filtered = [...incomeEntries];

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      let filterDate = new Date();

      switch (dateFilter) {
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "quarter":
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          filterDate = new Date(0); // Beginning of time for 'all'
      }

      filtered = filtered.filter((entry) => {
        const entryDate = new Date(entry.date);
        return entryDate >= filterDate && entryDate <= now;
      });
    }

    // Apply search filter
    if (searchTerm && searchTerm.trim().length > 0) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (entry) =>
          entry.description.toLowerCase().includes(searchLower) ||
          entry.clientName.toLowerCase().includes(searchLower) ||
          entry.projectType.toLowerCase().includes(searchLower) ||
          entry.platform.toLowerCase().includes(searchLower)
      );
    }

    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [incomeEntries, dateFilter, searchTerm]);

  // Memoized calculations to prevent re-renders
  const dashboardStats = useMemo(() => {
    const totalEarnings = filteredEntries.reduce(
      (sum, entry) => sum + entry.amount,
      0
    );
    const totalHours = filteredEntries.reduce(
      (sum, entry) => sum + entry.hours,
      0
    );
    const averageHourlyRate = totalHours > 0 ? totalEarnings / totalHours : 0;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const thisMonthEarnings = incomeEntries
      .filter((entry) => {
        const entryDate = new Date(entry.date);
        return (
          entryDate.getMonth() === currentMonth &&
          entryDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, entry) => sum + entry.amount, 0);

    const lastMonthEarnings = incomeEntries
      .filter((entry) => {
        const entryDate = new Date(entry.date);
        return (
          entryDate.getMonth() === lastMonth &&
          entryDate.getFullYear() === lastMonthYear
        );
      })
      .reduce((sum, entry) => sum + entry.amount, 0);

    const monthlyGrowth =
      lastMonthEarnings > 0
        ? ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100
        : 0;

    const pendingAmount = incomeEntries
      .filter((entry) => entry.status === "Pending")
      .reduce((sum, entry) => sum + entry.amount, 0);

    return {
      totalEarnings,
      averageHourlyRate,
      thisMonthEarnings,
      lastMonthEarnings,
      monthlyGrowth,
      totalHours,
      pendingAmount,
      totalClients: new Set(incomeEntries.map((e) => e.clientName)).size,
    };
  }, [filteredEntries, incomeEntries]);

  // Monthly data for charts
  const monthlyData = useMemo(() => {
    const monthlyStats: { [key: string]: { earnings: number; hours: number } } =
      {};

    incomeEntries.forEach((entry) => {
      const date = new Date(entry.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = { earnings: 0, hours: 0 };
      }
      monthlyStats[monthKey].earnings += entry.amount;
      monthlyStats[monthKey].hours += entry.hours;
    });

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return Object.entries(monthlyStats)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => {
        const [year, month] = key.split("-");
        return {
          month: months[parseInt(month) - 1],
          earnings: value.earnings,
          hours: value.hours,
          rate: value.hours > 0 ? value.earnings / value.hours : 0,
        };
      });
  }, [incomeEntries]);

  // Platform distribution for pie chart
  const platformData = useMemo(() => {
    const platformStats: { [key: string]: number } = {};

    filteredEntries.forEach((entry) => {
      platformStats[entry.platform] =
        (platformStats[entry.platform] || 0) + entry.amount;
    });

    const colors = ["#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

    return Object.entries(platformStats).map(([platform, amount], index) => ({
      name: platform,
      value: amount,
      color: colors[index % colors.length],
    }));
  }, [filteredEntries]);

  // Project type distribution
  const projectTypeData = useMemo(() => {
    const typeStats: { [key: string]: number } = {};

    filteredEntries.forEach((entry) => {
      typeStats[entry.projectType] =
        (typeStats[entry.projectType] || 0) + entry.amount;
    });

    return Object.entries(typeStats).map(([type, amount]) => ({
      type,
      amount,
    }));
  }, [filteredEntries]);

  // Top clients data
  const topClientsData = useMemo(() => {
    const clientStats: { [key: string]: number } = {};

    incomeEntries.forEach((entry) => {
      clientStats[entry.clientName] =
        (clientStats[entry.clientName] || 0) + entry.amount;
    });

    return Object.entries(clientStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([client, amount]) => ({ client, amount }));
  }, [incomeEntries]);

  const themeClasses = darkMode ? "dark bg-gray-900" : "bg-gray-50";
  const cardClasses = darkMode
    ? "bg-gray-800 text-white"
    : "bg-white text-gray-900";
  const textClasses = darkMode ? "text-gray-300" : "text-gray-600";

  // Landing Page
  if (currentPage === "landing") {
    return (
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  FreelanceTracker Pro
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Contact
                </button>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Menu */}
            {showMobileMenu && (
              <div className="md:hidden border-t border-gray-200 py-4">
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={() => scrollToSection("home")}
                    className="text-left text-gray-700 hover:text-blue-600 transition-colors px-4 cursor-pointer"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="text-left text-gray-700 hover:text-blue-600 transition-colors px-4 cursor-pointer"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => scrollToSection("pricing")}
                    className="text-left text-gray-700 hover:text-blue-600 transition-colors px-4 cursor-pointer"
                  >
                    Pricing
                  </button>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="text-left text-gray-700 hover:text-blue-600 transition-colors px-4 cursor-pointer"
                  >
                    About
                  </button>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="text-left text-gray-700 hover:text-blue-600 transition-colors px-4 cursor-pointer"
                  >
                    Contact
                  </button>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors mx-4 cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section
          id="home"
          className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 md:flex md:items-center"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Track Your
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {" "}
                    Freelance
                  </span>
                  <br />
                  Income Like a Pro
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  The ultimate income tracking platform for professional
                  freelancers. Monitor earnings, analyze trends, and maximize
                  your revenue across all platforms.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    Start Free Trial
                  </button>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 cursor-pointer"
                  >
                    Learn More
                  </button>
                </div>
                <div className="flex items-center space-x-6 mt-8 flex-wrap">
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">14-day free trial</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">
                      No credit card required
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur-3xl opacity-20"></div>
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Professional Dashboard"
                  className="relative rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Powerful Features for Modern Freelancers
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to track, analyze, and optimize your
                freelancing income
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group p-8 rounded-2xl bg-gradient-to-b from-blue-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Advanced Analytics
                </h3>
                <p className="text-gray-600 text-center">
                  Comprehensive insights into your income patterns, hourly
                  rates, and platform performance with interactive charts
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-gradient-to-b from-green-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Goal Tracking
                </h3>
                <p className="text-gray-600 text-center">
                  Set and monitor income goals, track progress, and achieve your
                  financial targets with visual progress indicators
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-gradient-to-b from-purple-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Multi-Platform Support
                </h3>
                <p className="text-gray-600 text-center">
                  Track income from Upwork, Fiverr, Toptal, direct clients, and
                  any other platform in one unified dashboard
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-gradient-to-b from-orange-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Secure & Private
                </h3>
                <p className="text-gray-600 text-center">
                  Bank-level security with encrypted data storage and
                  privacy-first approach to protect your financial information
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-gradient-to-b from-red-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Real-time Updates
                </h3>
                <p className="text-gray-600 text-center">
                  Instant synchronization and real-time updates across all your
                  devices with automatic data backup
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-gradient-to-b from-indigo-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Mobile Optimized
                </h3>
                <p className="text-gray-600 text-center">
                  Fully responsive design that works perfectly on all devices,
                  from desktop to mobile phones
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-white mb-2">50K+</div>
                <div className="text-blue-100">Active Freelancers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">$2B+</div>
                <div className="text-blue-100">Income Tracked</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">99.9%</div>
                <div className="text-blue-100">Uptime</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">4.9★</div>
                <div className="text-blue-100">User Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600">
                Choose the plan that fits your freelancing needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Starter
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">$9</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600">Perfect for new freelancers</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Track up to 50 projects</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Email support</span>
                  </li>
                </ul>
                <button
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
                  onClick={() => setShowLoginModal(true)}
                >
                  Get Started
                </button>
              </div>

              <div className="bg-blue-600 rounded-2xl p-8 shadow-xl text-white relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">Professional</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$29</span>
                    <span className="text-blue-200">/month</span>
                  </div>
                  <p className="text-blue-200">For serious freelancers</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Unlimited projects</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Goal tracking</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <button
                  className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setShowLoginModal(true)}
                >
                  Start Free Trial
                </button>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Enterprise
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      $99
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600">For agencies and teams</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Team collaboration</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>24/7 phone support</span>
                  </li>
                </ul>
                <button
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
                  onClick={() => setShowLoginModal(true)}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Built by Freelancers, for Freelancers
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  We understand the challenges of freelancing because we've been
                  there. Our team of experienced freelancers and developers
                  created FreelanceTracker Pro to solve the real problems we
                  faced managing our own income.
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  From tracking multiple income streams to understanding
                  seasonal patterns, our platform provides the insights you need
                  to build a sustainable freelancing business.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
                  >
                    Try It Free
                  </button>
                </div>
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                  alt="Team collaboration"
                  className="rounded-2xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600">
                Have questions? We'd love to hear from you.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Email Us
                </h3>
                <p className="text-gray-600">support@freelancetracker.com</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Call Us
                </h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Visit Us
                </h3>
                <p className="text-gray-600">San Francisco, CA</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">
                    FreelanceTracker Pro
                  </span>
                </div>
                <p className="text-gray-400">
                  The ultimate income tracking platform for professional
                  freelancers.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <button
                      onClick={() => scrollToSection("features")}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Features
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("pricing")}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Pricing
                    </button>
                  </li>
                  <li>
                    <button className="hover:text-white transition-colors cursor-pointer">
                      API
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <button
                      onClick={() => scrollToSection("about")}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      About
                    </button>
                  </li>
                  <li>
                    <button className="hover:text-white transition-colors cursor-pointer">
                      Blog
                    </button>
                  </li>
                  <li>
                    <button className="hover:text-white transition-colors cursor-pointer">
                      Careers
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <button
                      onClick={() => scrollToSection("contact")}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Contact
                    </button>
                  </li>
                  <li>
                    <button className="hover:text-white transition-colors cursor-pointer">
                      Help Center
                    </button>
                  </li>
                  <li>
                    <button className="hover:text-white transition-colors cursor-pointer">
                      Privacy Policy
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 FreelanceTracker Pro. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    setEmailError("");
                    setPasswordError("");
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      emailError 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="Enter your email"
                    required
                  />
                  {emailError && (
                    <p className="mt-2 text-sm text-red-600">{emailError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 pr-12 ${
                        passwordError 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="mt-2 text-sm text-red-600">{passwordError}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200 cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Dashboard (existing code remains the same)
  return (
    <div className={`min-h-screen ${themeClasses}`}>
      {/* Navigation */}
      <nav
        className={`${cardClasses} shadow-lg border-b ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span
                  className={`text-xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  FreelanceTracker Pro
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${
                  darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                } transition-colors cursor-pointer`}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <div className="relative">
                {/* <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className={`p-2 rounded-lg ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors relative cursor-pointer`}
                                >
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                                </button> */}

                {/* {showNotifications && (
                                    <div className={`absolute right-0 mt-2 w-80 ${cardClasses} rounded-lg shadow-xl z-50 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                        <div className="p-4">
                                            <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                                            <div className="space-y-3">
                                                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                                                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-blue-800'}`}>Payment received from TechCorp Inc. - $2,500</p>
                                                    <p className={`text-xs ${textClasses} mt-1`}>2 hours ago</p>
                                                </div>
                                                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                                                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-yellow-800'}`}>Invoice overdue from StartupXYZ - $800</p>
                                                    <p className={`text-xs ${textClasses} mt-1`}>1 day ago</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )} */}
              </div>

              <div className={`flex items-center space-x-2 ${textClasses}`}>
                <User className="w-4 h-4" />
                <span className="font-medium">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className={`flex items-center space-x-2 ${textClasses} hover:text-red-600 transition-colors cursor-pointer`}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden ${textClasses} hover:${
                darkMode ? "text-white" : "text-gray-900"
              } transition-colors cursor-pointer`}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div
              className={`md:hidden border-t ${
                darkMode ? "border-gray-700" : "border-gray-200"
              } py-4`}
            >
              <div className="flex flex-col space-y-4">
                <div
                  className={`flex items-center space-x-2 ${textClasses} px-4`}
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">{user?.name}</span>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`flex items-center space-x-2 ${textClasses} hover:${
                    darkMode ? "text-white" : "text-gray-900"
                  } transition-colors px-4 cursor-pointer`}
                >
                  {darkMode ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                  <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className={`flex items-center space-x-2 ${textClasses} hover:text-red-600 transition-colors px-4 cursor-pointer`}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "goals", label: "Goals", icon: Target },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : darkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {activeTab === "overview" && (
          <>
            {/* Header with Controls */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 space-y-4 lg:space-y-0">
              <div>
                <h1
                  className={`text-3xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  } mb-2`}
                >
                  Income Dashboard
                </h1>
                <p className={textClasses}>
                  Track and analyze your freelancing income across all platforms
                  {(searchTerm || dateFilter !== "all") && (
                    <span className="ml-2 text-blue-600">
                      • {filteredEntries.length} filtered results
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textClasses}`}
                  />
                  <input
                    type="text"
                    placeholder="Search entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-4 py-2 rounded-lg border ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64`}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${textClasses} hover:${
                        darkMode ? "text-white" : "text-gray-900"
                      } cursor-pointer`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* <div className="relative">
                                    <select
                                        value={dateFilter}
                                        onChange={(e) => setDateFilter(e.target.value)}
                                        className={`pl-4 pr-10 py-2 rounded-lg border ${darkMode
                                                ? 'bg-gray-800 border-gray-700 text-white'
                                                : 'bg-white border-gray-300 text-gray-900'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer ${dateFilter !== 'all' ? 'ring-2 ring-blue-500' : ''
                                            }`}
                                    >
                                        <option value="all">All Time</option>
                                        <option value="week">Last Week</option>
                                        <option value="month">Last Month</option>
                                        <option value="quarter">Last Quarter</option>
                                        <option value="year">Last Year</option>
                                    </select>
                                    <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textClasses} pointer-events-none`} />
                                </div> */}

                {(searchTerm || dateFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setDateFilter("all");
                    }}
                    className={`px-3 hidden md:block py-2 rounded-lg text-sm ${textClasses} hover:${
                      darkMode ? "text-white" : "text-gray-900"
                    } border ${
                      darkMode ? "border-gray-700" : "border-gray-300"
                    } hover:border-gray-400 transition-colors cursor-pointer`}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Income</span>
                </button>
              </div>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div
                className={`${cardClasses} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${textClasses}`}>
                      Total Earnings
                    </p>
                    <p
                      className={`text-3xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ${dashboardStats.totalEarnings.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      {dashboardStats.monthlyGrowth >= 0 ? (
                        <ArrowUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm ml-1 ${
                          dashboardStats.monthlyGrowth >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {Math.abs(dashboardStats.monthlyGrowth).toFixed(1)}%
                      </span>
                      <span className={`text-sm ml-1 ${textClasses}`}>
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div
                className={`${cardClasses} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${textClasses}`}>
                      This Month
                    </p>
                    <p
                      className={`text-3xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ${dashboardStats.thisMonthEarnings.toLocaleString()}
                    </p>
                    <p className={`text-sm ${textClasses} mt-2`}>
                      Last: ${dashboardStats.lastMonthEarnings.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div
                className={`${cardClasses} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${textClasses}`}>
                      Avg. Hourly Rate
                    </p>
                    <p
                      className={`text-3xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ${dashboardStats.averageHourlyRate.toFixed(0)}
                    </p>
                    <p className={`text-sm ${textClasses} mt-2`}>
                      {dashboardStats.totalHours} total hours
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div
                className={`${cardClasses} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${textClasses}`}>
                      Pending Amount
                    </p>
                    <p
                      className={`text-3xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ${dashboardStats.pendingAmount.toLocaleString()}
                    </p>
                    <p className={`text-sm ${textClasses} mt-2`}>
                      {dashboardStats.totalClients} active clients
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Monthly Earnings Area Chart */}
              <div className={`${cardClasses} rounded-xl p-6 shadow-lg`}>
                <div className="flex items-center justify-between mb-6">
                  <h3
                    className={`text-lg font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Monthly Earnings
                  </h3>
                  <BarChart3 className={`w-5 h-5 ${textClasses}`} />
                </div>
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient
                          id="colorEarnings"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#2563eb"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#2563eb"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="opacity-30"
                      />
                      <XAxis dataKey="month" className="text-sm" />
                      <YAxis className="text-sm" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? "#1f2937" : "white",
                          border: "none",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          color: darkMode ? "white" : "#1f2937",
                        }}
                        formatter={(value: number) => [
                          `$${value.toLocaleString()}`,
                          "Earnings",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="earnings"
                        stroke="#2563eb"
                        strokeWidth={3}
                        fill="url(#colorEarnings)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Platform Distribution Fixed */}
              <div className={`${cardClasses} rounded-xl p-6 shadow-lg`}>
                <div className="flex items-center justify-between mb-6">
                  <h3
                    className={`text-lg font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Platform Distribution
                    {(searchTerm || dateFilter !== "all") && (
                      <span className="text-sm font-normal text-blue-600 ml-2">
                        (Filtered)
                      </span>
                    )}
                  </h3>
                  <PieChart className={`w-5 h-5 ${textClasses}`} />
                </div>
                {platformData.length === 0 ? (
                  <div className="h-64 sm:h-80 flex items-center justify-center">
                    <div className="text-center">
                      <PieChart
                        className={`w-12 h-12 ${textClasses} mx-auto mb-4`}
                      />
                      <p className={`text-sm ${textClasses}`}>
                        No data available for current filters
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="h-64 sm:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          {/* Only show tooltip on desktop screens */}
                          <Pie
                            data={platformData}
                            cx="50%"
                            cy="50%"
                            innerRadius={window.innerWidth < 640 ? 30 : 40}
                            outerRadius={window.innerWidth < 640 ? 60 : 80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {platformData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* Platform Legend */}
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {platformData.map((platform, index) => (
                        <div key={platform.name} className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: platform.color }}
                          ></div>
                          <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {platform.name}: ${platform.value.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Top Clients and Project Types */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Top Clients */}
              <div className={`${cardClasses} rounded-xl p-6 shadow-lg`}>
                <h3
                  className={`text-lg font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  } mb-6`}
                >
                  Top Clients
                </h3>
                <div className="space-y-4">
                  {topClientsData.map((client, index) => (
                    <div
                      key={client.client}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                            [
                              "bg-blue-500",
                              "bg-green-500",
                              "bg-purple-500",
                              "bg-orange-500",
                              "bg-red-500",
                              "bg-indigo-500",
                              "bg-pink-500",
                              "bg-teal-500",
                            ][index]
                          }`}
                        >
                          {client.client.charAt(0)}
                        </div>
                        <span
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {client.client}
                        </span>
                      </div>
                      <span
                        className={`font-semibold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        ${client.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Types */}
              <div className={`${cardClasses} rounded-xl p-6 shadow-lg`}>
                <h3
                  className={`text-lg font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  } mb-6`}
                >
                  Income by Project Type
                  {(searchTerm || dateFilter !== "all") && (
                    <span className="text-sm font-normal text-blue-600 ml-2">
                      (Filtered)
                    </span>
                  )}
                </h3>
                {projectTypeData.length === 0 ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3
                        className={`w-12 h-12 ${textClasses} mx-auto mb-4`}
                      />
                      <p className={`text-sm ${textClasses}`}>
                        No project data available for current filters
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={projectTypeData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="opacity-30"
                          />
                          <XAxis
                            dataKey="type"
                            className="text-sm"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval={0}
                          />
                          <YAxis className="text-sm" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: darkMode ? "#1f2937" : "white",
                              border: "none",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                              color: darkMode ? "white" : "#1f2937",
                            }}
                            formatter={(value: number) => [
                              `$${value.toLocaleString()}`,
                              "Earnings",
                            ]}
                          />
                          <Bar
                            dataKey="amount"
                            fill="#10b981"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Show project type summary below chart */}
                    <div className="mt-4 space-y-2">
                      {projectTypeData.slice(0, 3).map((item, index) => (
                        <div
                          key={item.type}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                index === 0
                                  ? "bg-green-500"
                                  : index === 1
                                  ? "bg-green-400"
                                  : "bg-green-300"
                              }`}
                            ></div>
                            <span
                              className={`text-sm ${
                                darkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {item.type}
                            </span>
                          </div>
                          <span
                            className={`text-sm font-semibold ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            ${item.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            {/* Recent Entries */}
            <div
              className={`${cardClasses} rounded-xl p-6 shadow-lg overflow-x-auto`}
            >
              <table className="w-full table-auto">
                <thead className="hidden sm:table-header-group">
                  <tr
                    className={`border-b ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <th
                      className={`text-center py-3 px-4 font-medium ${textClasses}`}
                    >
                      Platform
                    </th>
                    <th
                      className={`text-left py-3 px-4 font-medium ${textClasses}`}
                    >
                      Client
                    </th>
                    <th
                      className={`text-left py-3 px-4 font-medium ${textClasses}`}
                    >
                      Project
                    </th>
                    <th
                      className={`text-left py-3 px-4 font-medium ${textClasses}`}
                    >
                      Amount
                    </th>
                    <th
                      className={`text-left py-3 px-4 font-medium ${textClasses}`}
                    >
                      Status
                    </th>
                    <th
                      className={`text-left py-3 px-4 font-medium ${textClasses}`}
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.slice(0, 10).map((entry) => (
                    <tr
                      key={entry.id}
                      className={`block sm:table-row border-b ${
                        darkMode
                          ? "border-gray-700 hover:bg-gray-800"
                          : "border-gray-200 hover:bg-gray-50"
                      } transition-colors mb-4 sm:mb-0`}
                    >
                      {/* Mobile Card Layout */}
                      <td className="block sm:table-cell sm:py-3 sm:px-4 pb-4 sm:pb-0 sm:text-center sm:align-middle">
                        <div className={`sm:hidden p-4 rounded-lg ${
                          darkMode ? "bg-gray-800" : "bg-gray-50"
                        }`}>
                          {/* Platform */}
                          <div className="flex items-center justify-between mb-3">
                            <span className={`text-sm font-medium ${textClasses}`}>Platform</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                entry.platform === "Upwork"
                                  ? "bg-green-100 text-green-800"
                                  : entry.platform === "Fiverr"
                                  ? "bg-blue-100 text-blue-800"
                                  : entry.platform === "Toptal"
                                  ? "bg-purple-100 text-purple-800"
                                  : entry.platform === "Freelancer"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {entry.platform}
                            </span>
                          </div>
                          
                          {/* Client */}
                          <div className="flex items-center justify-between mb-3">
                            <span className={`text-sm font-medium ${textClasses}`}>Client</span>
                            <span className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                              {entry.clientName}
                            </span>
                          </div>
                          
                          {/* Project */}
                          <div className="flex items-center justify-between mb-3">
                            <span className={`text-sm font-medium ${textClasses}`}>Project</span>
                            <span className={`text-sm ${textClasses}`}>
                              {entry.projectType}
                            </span>
                          </div>
                          
                          {/* Amount */}
                          <div className="flex items-center justify-between mb-3">
                            <span className={`text-sm font-medium ${textClasses}`}>Amount</span>
                            <span className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                              ${entry.amount.toLocaleString()}
                            </span>
                          </div>
                          
                          {/* Status */}
                          <div className="flex items-center justify-between mb-3">
                            <span className={`text-sm font-medium ${textClasses}`}>Status</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                entry.status === "Paid"
                                  ? "bg-green-100 text-green-800"
                                  : entry.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {entry.status}
                            </span>
                          </div>
                          
                          {/* Date */}
                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-medium ${textClasses}`}>Date</span>
                            <span className={`text-sm ${textClasses}`}>
                              {new Date(entry.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        {/* Desktop Table Cell */}
                        <div className="hidden sm:flex sm:justify-center sm:items-center sm:h-full">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              entry.platform === "Upwork"
                                ? "bg-green-100 text-green-800"
                                : entry.platform === "Fiverr"
                                ? "bg-blue-100 text-blue-800"
                                : entry.platform === "Toptal"
                                ? "bg-purple-100 text-purple-800"
                                : entry.platform === "Freelancer"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {entry.platform}
                          </span>
                        </div>
                      </td>
                      
                      {/* Desktop Table Cells */}
                      <td className={`hidden sm:table-cell py-3 px-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {entry.clientName}
                      </td>
                      <td className={`hidden sm:table-cell py-3 px-4 ${textClasses}`}>
                        {entry.projectType}
                      </td>
                      <td className={`hidden sm:table-cell py-3 px-4 font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        ${entry.amount.toLocaleString()}
                      </td>
                      <td className="hidden sm:table-cell py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            entry.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : entry.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {entry.status}
                        </span>
                      </td>
                      <td className={`hidden sm:table-cell py-3 px-4 ${textClasses}`}>
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "goals" && (
          <>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
              <div>
                <h1
                  className={`text-3xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  } mb-2`}
                >
                  Income Goals
                </h1>
                <p className={textClasses}>
                  Set and track your financial targets
                </p>
              </div>
              <button
                onClick={() => setShowGoalModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 mt-4 sm:mt-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Goal</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => {
                const progress = (goal.current / goal.target) * 100;
                const isOverdue =
                  new Date(goal.deadline) < new Date() && progress < 100;

                return (
                  <div
                    key={goal.id}
                    className={`${cardClasses} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        className={`font-semibold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {goal.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          goal.type === "monthly"
                            ? "bg-blue-100 text-blue-800"
                            : goal.type === "yearly"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {goal.type}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className={textClasses}>Progress</span>
                        <span
                          className={`font-semibold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {progress.toFixed(1)}%
                        </span>
                      </div>
                      <div
                        className={`w-full bg-gray-200 ${
                          darkMode ? "bg-gray-700" : ""
                        } rounded-full h-3`}
                      >
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${
                            progress >= 100
                              ? "bg-green-500"
                              : isOverdue
                              ? "bg-red-500"
                              : "bg-blue-500"
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className={textClasses}>Current</span>
                        <span
                          className={`font-semibold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          ${goal.current.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={textClasses}>Target</span>
                        <span
                          className={`font-semibold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          ${goal.target.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={textClasses}>Deadline</span>
                        <span
                          className={`font-semibold ${
                            isOverdue
                              ? "text-red-500"
                              : darkMode
                              ? "text-white"
                              : "text-gray-900"
                          }`}
                        >
                          {new Date(goal.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Add Income Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
              className={`${cardClasses} rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Add Income Entry
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className={`${textClasses} hover:${
                    darkMode ? "text-white" : "text-gray-900"
                  } transition-colors cursor-pointer`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    Platform
                  </label>
                  <div className="relative">
                    <select
                      value={newEntry.platform}
                      onChange={(e) =>
                        setNewEntry((prev) => ({
                          ...prev,
                          platform: e.target.value as any,
                        }))
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="Upwork">Upwork</option>
                      <option value="Fiverr">Fiverr</option>
                      <option value="Direct Client">Direct Client</option>
                      <option value="Toptal">Toptal</option>
                      <option value="Freelancer">Freelancer</option>
                    </select>
                    <ChevronDown
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${textClasses} pointer-events-none`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={newEntry.clientName}
                    onChange={(e) =>
                      setNewEntry((prev) => ({
                        ...prev,
                        clientName: e.target.value,
                      }))
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="e.g., Web Development"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      } mb-2`}
                    >
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      value={newEntry.amount}
                      onChange={(e) =>
                        setNewEntry((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="2500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      } mb-2`}
                    >
                      Hours
                    </label>
                    <input
                      type="number"
                      value={newEntry.hours}
                      onChange={(e) =>
                        setNewEntry((prev) => ({
                          ...prev,
                          hours: e.target.value,
                        }))
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="40"
                      min="0"
                      step="0.5"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) =>
                      setNewEntry((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    required
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={newEntry.status}
                      onChange={(e) =>
                        setNewEntry((prev) => ({
                          ...prev,
                          status: e.target.value as any,
                        }))
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                    <ChevronDown
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${textClasses} pointer-events-none`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    Description
                  </label>
                  <textarea
                    value={newEntry.description}
                    onChange={(e) =>
                      setNewEntry((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    rows={3}
                    placeholder="Brief description of the project"
                    required
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className={`flex-1 py-3 rounded-lg font-semibold transition-colors duration-200 cursor-pointer ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddEntry}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200 cursor-pointer"
                  >
                    Add Entry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Goal Modal */}
        {showGoalModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
              className={`${cardClasses} rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-300`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Add Income Goal
                </h2>
                <button
                  onClick={() => setShowGoalModal(false)}
                  className={`${textClasses} hover:${
                    darkMode ? "text-white" : "text-gray-900"
                  } transition-colors cursor-pointer`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    Goal Title
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) =>
                      setNewGoal((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="e.g., Q2 Revenue Target"
                    required
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    Target Amount ($)
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="10000"
                    min="0"
                    step="100"
                    required
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    Goal Type
                  </label>
                  <div className="relative">
                    <select
                      value={newGoal.type}
                      onChange={(e) =>
                        setNewGoal((prev) => ({
                          ...prev,
                          type: e.target.value as any,
                        }))
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="project">Project-based</option>
                    </select>
                    <ChevronDown
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${textClasses} pointer-events-none`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) =>
                      setNewGoal((prev) => ({
                        ...prev,
                        deadline: e.target.value,
                      }))
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    required
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowGoalModal(false)}
                    className={`flex-1 py-3 rounded-lg font-semibold transition-colors duration-200 cursor-pointer ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddGoal}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200 cursor-pointer"
                  >
                    Add Goal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeDashboard;

// Zod Schema
export const Schema = {
    "commentary": "This code generates a dashboard to track freelancing income across multiple platforms. It includes features such as total earnings, monthly breakdowns, and average hourly rate using graphs and number cards. Users can tag income sources with project types and view pie charts of income distribution. The layout is smooth and responsive, built with TypeScript and Next.js, and the UI is self-contained in a single .tsx file.",
    "template": "nextjs-developer",
    "title": "Freelance Dashboard",
    "description": "A dashboard to track freelancing income across multiple platforms.",
    "additional_dependencies": ["lucide-react"],
    "has_additional_dependencies": true,
    "install_dependencies_command": "npm install lucide-react",
    "port": 3000,
    "file_path": "pages/index.tsx",
    "code": "<see code above>"
}