"use client"
import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  ChartBarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  Bars3Icon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  ChartPieIcon,
  MapPinIcon,
  ClockIcon,
  CogIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  DocumentTextIcon,
  PresentationChartLineIcon,
  PlayIcon,
  StarIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  LightBulbIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";

// Enhanced mock survey data with overlapping keywords for better comparison
const mockSurveyData = {
  dataset1: {
    name: "Customer Satisfaction Q1 2024",
    overallSentiment: 78,
    totalResponses: 2847,
    responseRate: 84.3,
    demographics: {
      age: { "18-25": 23, "26-35": 34, "36-45": 28, "46-55": 12, "55+": 3 },
      gender: { Male: 45, Female: 52, Other: 3 },
      location: { "North America": 67, Europe: 23, Asia: 8, Other: 2 },
    },
    keywords: {
      excellent: 89,
      good: 76,
      satisfied: 67,
      quality: 45,
      friendly: 43,
      responsive: 34,
      professional: 32,
      efficient: 28,
      helpful: 25,
      reliable: 23,
      supportive: 31,
      innovative: 22,
      flexible: 18,
      challenging: 12,
      growth: 15,
    },
    insights: [
      "Customer satisfaction increased by 12% compared to Q4 2023",
      "Quality and friendliness are top drivers of positive sentiment",
      "Millennials show highest satisfaction rates across all metrics",
    ],
    timeSeriesData: [
      { month: "Jan", sentiment: 72 },
      { month: "Feb", sentiment: 76 },
      { month: "Mar", sentiment: 78 },
    ],
    geographicSentiment: {
      "New York": 82,
      California: 79,
      Texas: 75,
      Florida: 77,
      Illinois: 73,
      London: 81,
      Paris: 78,
      Berlin: 76,
      Madrid: 74,
      Rome: 80,
      Tokyo: 85,
      Seoul: 83,
      Singapore: 87,
      Sydney: 79,
      Mumbai: 71,
    },
    categorySentiment: {
      "Product Quality": 85,
      "Customer Service": 78,
      Pricing: 65,
      Delivery: 82,
      Support: 77,
    },
  },
  dataset2: {
    name: "Employee Engagement Q1 2024",
    overallSentiment: 65,
    totalResponses: 1923,
    responseRate: 76.8,
    demographics: {
      age: { "18-25": 18, "26-35": 42, "36-45": 25, "46-55": 13, "55+": 2 },
      gender: { Male: 48, Female: 49, Other: 3 },
      location: { "North America": 58, Europe: 28, Asia: 12, Other: 2 },
    },
    keywords: {
      challenging: 67,
      growth: 54,
      balance: 43,
      supportive: 38,
      innovative: 35,
      collaborative: 32,
      flexible: 29,
      rewarding: 26,
      stressful: 24,
      demanding: 21,
      professional: 28,
      quality: 33,
      efficient: 19,
      helpful: 17,
      responsive: 22,
    },
    insights: [
      "Work-life balance remains a key concern for 43% of employees",
      "Innovation and growth opportunities drive engagement",
      "Stress levels have decreased by 8% since remote work policies",
    ],
    timeSeriesData: [
      { month: "Jan", sentiment: 62 },
      { month: "Feb", sentiment: 64 },
      { month: "Mar", sentiment: 65 },
    ],
    geographicSentiment: {
      "New York": 68,
      California: 72,
      Texas: 61,
      Florida: 64,
      Illinois: 59,
      London: 69,
      Paris: 66,
      Berlin: 71,
      Madrid: 63,
      Rome: 67,
      Tokyo: 74,
      Seoul: 70,
      Singapore: 76,
      Sydney: 65,
      Mumbai: 58,
    },
    categorySentiment: {
      "Work Environment": 72,
      Management: 58,
      Benefits: 67,
      "Career Growth": 61,
      "Work-Life Balance": 52,
    },
  },
};

const SurveyAnalytics: React.FC = () => {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    showPassword: false,
  });
  const [loginError, setLoginError] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  // UI state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("Q1 2024");
  const [activeView, setActiveView] = useState("overview");

  // Prevent scroll when modals are open
  useEffect(() => {
    if (showLoginModal || isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showLoginModal, isMobileMenuOpen]);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMobileMenuOpen(false);
    }
  }, []);

  // Handle login
  const handleLogin = useCallback(
    (e?: React.FormEvent | React.MouseEvent) => {
      if (e) e.preventDefault();
      setLoginError("");

      if (!loginForm.email || !loginForm.password) {
        setLoginError("Please fill in all fields");
        return;
      }

      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(loginForm.email)) {
        setLoginError("Please enter a valid email address");
        return;
      }

      // Accept any valid email with any password
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setMessage({ text: "Successfully logged in!", type: "success" });
      setLoginForm({ email: "", password: "", showPassword: false });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    },
    [loginForm]
  );

  // Handle logout
  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setActiveView("overview");
    setMessage({ text: "Successfully logged out!", type: "info" });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  }, []);

  // Export functionality
  const handleExport = useCallback((format: string) => {
    if (format === "pdf") {
      const pdfContent = `
      Survey Analytics Pro - Export Sample

      Dataset 1: ${mockSurveyData.dataset1.name}
      Total Responses: ${mockSurveyData.dataset1.totalResponses}
      Avg Sentiment: ${mockSurveyData.dataset1.overallSentiment}%

      Dataset 2: ${mockSurveyData.dataset2.name}
      Total Responses: ${mockSurveyData.dataset2.totalResponses}
      Avg Sentiment: ${mockSurveyData.dataset2.overallSentiment}%
    `;

      const blob = new Blob([pdfContent], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "survey-report.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({ text: "Sample PDF downloaded", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 2000);
    }
  }, []);

  // Close modals when clicking outside
  const handleModalClose = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowLoginModal(false);
      setIsMobileMenuOpen(false);
      setShowFilters(false);
    }
  }, []);

  // Radial Progress Chart Component
  const RadialChart = useMemo(
    () =>
      ({
        value,
        size = 120,
        strokeWidth = 8,
        color = "#3B82F6",
      }: {
        value: number;
        size?: number;
        strokeWidth?: number;
        color?: string;
      }) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (value / 100) * circumference;

        return (
          <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={isDarkMode ? "#374151" : "#E5E7EB"}
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div
              className={`absolute text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {value}%
            </div>
          </div>
        );
      },
    [isDarkMode]
  );

  // Advanced Geographic Heatmap
  const GeographicHeatmap = useMemo(
    () =>
      ({ data, title }: { data: Record<string, number>; title: string }) => {
        const maxValue = Math.max(...Object.values(data));
        const minValue = Math.min(...Object.values(data));

        const getHeatmapColor = (value: number) => {
          const intensity = (value - minValue) / (maxValue - minValue);
          if (intensity > 0.8) return "bg-red-500";
          if (intensity > 0.6) return "bg-orange-500";
          if (intensity > 0.4) return "bg-yellow-500";
          if (intensity > 0.2) return "bg-green-500";
          return "bg-blue-500";
        };

        return (
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-lg p-6`}
          >
            <h3
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              {title}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(data).map(([location, value]) => (
                <div key={location} className="text-center">
                  <div
                    className={`${getHeatmapColor(
                      value
                    )} rounded-lg p-3 mb-2 transition-all duration-300 hover:scale-105 cursor-pointer`}
                    title={`${location}: ${value}%`}
                  >
                    <div className="text-white font-bold text-sm">{value}%</div>
                  </div>
                  <div
                    className={`text-xs ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {location}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      },
    [isDarkMode]
  );

  // Category Sentiment Heatmap
  const CategoryHeatmap = useMemo(
    () =>
      ({
        data1,
        data2,
        title,
      }: {
        data1: Record<string, number>;
        data2: Record<string, number>;
        title: string;
      }) => {
        const categories = Array.from(
          new Set([...Object.keys(data1), ...Object.keys(data2)])
        );

        return (
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-lg p-6`}
          >
            <h3
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              } mb-6`}
            >
              {title}
            </h3>
            <div className="space-y-4">
              {categories.map((category) => {
                const val1 = data1[category] || 0;
                const val2 = data2[category] || 0;
                const diff = val1 - val2;

                return (
                  <div
                    key={category}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center"
                  >
                    <div
                      className={`font-medium ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {category}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${val1}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                          {val1}%
                        </span>
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${val2}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                          {val2}%
                        </span>
                      </div>
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        diff > 0
                          ? "text-green-600"
                          : diff < 0
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {diff > 0 ? "+" : ""}
                      {diff.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      },
    [isDarkMode]
  );

  // Enhanced Keyword Heatmap with better handling of missing keywords
  const KeywordHeatmap = useMemo(
    () =>
      ({
        keywords1,
        keywords2,
      }: {
        keywords1: Record<string, number>;
        keywords2: Record<string, number>;
      }) => {
        // Get all unique keywords and sort by total frequency
        const allKeywords = Array.from(
          new Set([...Object.keys(keywords1), ...Object.keys(keywords2)])
        ).sort((a, b) => {
          const totalA = (keywords1[a] || 0) + (keywords2[a] || 0);
          const totalB = (keywords1[b] || 0) + (keywords2[b] || 0);
          return totalB - totalA;
        });

        const maxValue = Math.max(
          ...allKeywords.map((k) =>
            Math.max(keywords1[k] || 0, keywords2[k] || 0)
          )
        );

        return (
          <div className="space-y-3">
            {allKeywords.slice(0, 12).map((keyword) => {
              const val1 = keywords1[keyword] || 0;
              const val2 = keywords2[keyword] || 0;

              return (
                <div
                  key={keyword}
                  className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4"
                >
                  <div
                    className={`w-full sm:w-28 text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } truncate`}
                  >
                    {keyword}
                  </div>
                  <div
                    className="flex-1 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-fullSurvey Analytics Pro
"
                  >
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span
                          className={`${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Dataset 1
                        </span>
                        <span
                          className={`font-medium ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {val1 > 0 ? val1 : "N/A"}
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-5 relative overflow-hidden">
                        {val1 > 0 ? (
                          <>
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${(val1 / maxValue) * 100}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                              {val1}
                            </span>
                          </>
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-500">
                            No data
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span
                          className={`${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Dataset 2
                        </span>
                        <span
                          className={`font-medium ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {val2 > 0 ? val2 : "N/A"}
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-5 relative overflow-hidden">
                        {val2 > 0 ? (
                          <>
                            <div
                              className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${(val2 / maxValue) * 100}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                              {val2}
                            </span>
                          </>
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-500">
                            No data
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      },
    [isDarkMode]
  );

  // Time Series Chart
  const TimeSeriesChart = useMemo(
    () =>
      ({
        data1,
        data2,
      }: {
        data1: Array<{ month: string; sentiment: number }>;
        data2: Array<{ month: string; sentiment: number }>;
      }) => {
        const maxValue = 100;

        return (
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-lg p-6`}
          >
            <h3
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              } mb-6`}
            >
              Sentiment Trends
            </h3>
            <div className="space-y-6">
              {data1.map((item, index) => {
                const val2 = data2[index]?.sentiment || 0;

                return (
                  <div key={item.month} className="space-y-2">
                    <div
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {item.month}
                    </div>
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span
                            className={
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }
                          >
                            Dataset 1
                          </span>
                          <span
                            className={`font-medium ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.sentiment}%
                          </span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-3">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: `${(item.sentiment / maxValue) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span
                            className={
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }
                          >
                            Dataset 2
                          </span>
                          <span
                            className={`font-medium ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {val2}%
                          </span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-3">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${(val2 / maxValue) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      },
    [isDarkMode]
  );

  // Demographic Chart Component
  const DemographicChart = useMemo(
    () =>
      ({
        data,
        title,
        colors,
      }: {
        data: Record<string, number>;
        title: string;
        colors: string[];
      }) => {
        const total = Object.values(data).reduce((sum, val) => sum + val, 0);

        return (
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } p-4 rounded-lg shadow`}
          >
            <h4
              className={`font-semibold ${
                isDarkMode ? "text-white" : "text-gray-800"
              } mb-3`}
            >
              {title}
            </h4>
            <div className="space-y-2">
              {Object.entries(data).map(([key, value], index) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {key}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${(value / total) * 100}%`,
                          backgroundColor: colors[index % colors.length],
                        }}
                      />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      } w-8`}
                    >
                      {value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      },
    [isDarkMode]
  );

  //   loveleen
  if (!isLoggedIn) {
    return (
      <div
        className={`min-h-screen ${
          isDarkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-blue-50 to-indigo-100"
        }`}
      >
        {/* Landing Page Header */}
        <header
          className={`${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white/95 border-gray-200"
          } backdrop-blur-md border-b sticky top-0 z-50`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1636907312269-d1facecaf8a7?w=40&h=40&fit=crop&auto=format"
                  alt="Survey Analytics Pro Logo"
                  className="w-10 h-10 rounded-full"
                />
                <h1
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } hidden sm:block`}
                >
                  Survey Analytics Pro
                </h1>
              </div>

              <nav className="hidden md:flex items-center space-x-8">
                <a
                  href="#features"
                  className={`text-sm font-medium cursor-pointer transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:text-blue-400"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Features
                </a>
                <a
                  href="#solutions"
                  className={`text-sm font-medium cursor-pointer transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:text-blue-400"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Solutions
                </a>
                <a
                  href="#testimonials"
                  className={`text-sm font-medium cursor-pointer transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:text-blue-400"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Testimonials
                </a>

                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-2 rounded-lg cursor-pointer transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {isDarkMode ? (
                    <SunIcon className="h-5 w-5" />
                  ) : (
                    <MoonIcon className="h-5 w-5" />
                  )}
                </button>

                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium"
                >
                  Sign In
                </button>
              </nav>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden p-2 rounded-md cursor-pointer transition-colors ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div
              className={`md:hidden border-t ${
                isDarkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-200 bg-white/95"
              } backdrop-blur-md`}
            >
              <div className="px-4 py-2 space-y-1">
                <a
                  href="#features"
                  className={`block px-3 py-2 font-medium cursor-pointer transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:text-blue-400"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Features
                </a>
                <a
                  href="#solutions"
                  className={`block px-3 py-2 font-medium cursor-pointer transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:text-blue-400"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Solutions
                </a>
                <a
                  href="#testimonials"
                  className={`block px-3 py-2 font-medium cursor-pointer transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:text-blue-400"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Testimonials
                </a>
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-4xl mx-auto">
              <h1
                className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } mb-6`}
              >
                Transform Your Survey Data Into
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {" "}
                  Actionable Insights
                </span>
              </h1>
              <p
                className={`text-xl lg:text-2xl ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                } mb-10 leading-relaxed`}
              >
                Enterprise-grade survey comparison platform with advanced
                sentiment analysis, interactive heatmaps, and real-time
                demographic insights.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium cursor-pointer flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <PlayIcon className="h-5 w-5" />
                  <span>Start Free Trial</span>
                </button>
              </div>

              <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    10M+
                  </div>
                  <div
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Surveys Analyzed
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    500+
                  </div>
                  <div
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Enterprise Clients
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    99.9%
                  </div>
                  <div
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Uptime
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    24/7
                  </div>
                  <div
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Support
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className={`py-20 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2
                className={`text-3xl lg:text-4xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } mb-4`}
              >
                Powerful Features for Data-Driven Decisions
              </h2>
              <p
                className={`text-xl ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                } max-w-3xl mx-auto`}
              >
                Everything you need to analyze, compare, and visualize survey
                data with professional-grade tools
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                } p-8 rounded-2xl transition-all duration-300 hover:scale-105`}
              >
                <div className="p-3 bg-blue-100 rounded-full w-fit mb-6">
                  <ChartBarIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } mb-4`}
                >
                  Advanced Analytics
                </h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Real-time sentiment analysis with statistical significance
                  testing and predictive modeling
                </p>
              </div>

              <div
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                } p-8 rounded-2xl transition-all duration-300 hover:scale-105`}
              >
                <div className="p-3 bg-green-100 rounded-full w-fit mb-6">
                  <MapPinIcon className="h-8 w-8 text-green-600" />
                </div>
                <h3
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } mb-4`}
                >
                  Interactive Heatmaps
                </h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Geographic and categorical heatmaps with drill-down
                  capabilities and custom filtering
                </p>
              </div>

              <div
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                } p-8 rounded-2xl transition-all duration-300 hover:scale-105`}
              >
                <div className="p-3 bg-purple-100 rounded-full w-fit mb-6">
                  <UserGroupIcon className="h-8 w-8 text-purple-600" />
                </div>
                <h3
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } mb-4`}
                >
                  Demographic Insights
                </h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Deep demographic analysis with cross-tabulation and cohort
                  comparison features
                </p>
              </div>

              <div
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                } p-8 rounded-2xl transition-all duration-300 hover:scale-105`}
              >
                <div className="p-3 bg-orange-100 rounded-full w-fit mb-6">
                  <RocketLaunchIcon className="h-8 w-8 text-orange-600" />
                </div>
                <h3
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } mb-4`}
                >
                  Real-time Processing
                </h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Lightning-fast data processing with live updates and instant
                  visualization rendering
                </p>
              </div>

              <div
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                } p-8 rounded-2xl transition-all duration-300 hover:scale-105`}
              >
                <div className="p-3 bg-red-100 rounded-full w-fit mb-6">
                  <ShieldCheckIcon className="h-8 w-8 text-red-600" />
                </div>
                <h3
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } mb-4`}
                >
                  Enterprise Security
                </h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  SOC 2 Type II compliant with end-to-end encryption and
                  role-based access controls
                </p>
              </div>

              <div
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                } p-8 rounded-2xl transition-all duration-300 hover:scale-105`}
              >
                <div className="p-3 bg-indigo-100 rounded-full w-fit mb-6">
                  <GlobeAltIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <h3
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } mb-4`}
                >
                  Global Scale
                </h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Multi-language support with global data centers and 99.99%
                  uptime guarantee
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section
          id="solutions"
          className={`py-20 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2
                className={`text-3xl lg:text-4xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } mb-4`}
              >
                Solutions for Every Industry
              </h2>
              <p
                className={`text-xl ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                } max-w-3xl mx-auto`}
              >
                Trusted by Fortune 500 companies across healthcare, finance,
                retail, and technology sectors
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop&auto=format"
                  alt="Professional team analyzing data"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <LightBulbIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      } mb-2`}
                    >
                      Customer Experience
                    </h3>
                    <p
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Track customer satisfaction trends and identify
                      improvement opportunities across touchpoints
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <UserGroupIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      } mb-2`}
                    >
                      Employee Engagement
                    </h3>
                    <p
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Measure workplace satisfaction and create data-driven HR
                      strategies for retention
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ChartPieIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      } mb-2`}
                    >
                      Market Research
                    </h3>
                    <p
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Analyze market sentiment and consumer preferences with
                      advanced demographic segmentation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className={`py-20 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2
                className={`text-3xl lg:text-4xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } mb-4`}
              >
                Trusted by Industry Leaders
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                } p-8 rounded-2xl`}
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-6`}
                >
                  "Survey Analytics Pro transformed how we understand our
                  customers. The insights are incredible."
                </p>
                <div className="flex items-center">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&auto=format"
                    alt="Sarah Johnson"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div
                      className={`font-medium ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Sarah Johnson
                    </div>
                    <div
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Director of Analytics, TechCorp
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                } p-8 rounded-2xl`}
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-6`}
                >
                  "The heatmap visualizations helped us identify key pain points
                  we never saw before."
                </p>
                <div className="flex items-center">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&auto=format"
                    alt="Michael Chen"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div
                      className={`font-medium ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Michael Chen
                    </div>
                    <div
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      VP of Operations, RetailPlus
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                } p-8 rounded-2xl`}
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-6`}
                >
                  "Best-in-class platform. The demographic analysis capabilities
                  are unmatched."
                </p>
                <div className="flex items-center">
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616c7f10c12?w=50&h=50&fit=crop&auto=format"
                    alt="Emily Rodriguez"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div
                      className={`font-medium ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Emily Rodriguez
                    </div>
                    <div
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Research Lead, HealthFirst
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className={`py-20 ${isDarkMode ? "bg-gray-900" : "bg-blue-600"}`}
        >
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Survey Data?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Join thousands of companies already using Survey Analytics Pro to
              make better decisions
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer font-medium text-lg shadow-lg hover:shadow-xl"
            >
              Start Your Free Trial Today
            </button>
          </div>
        </section>

        {/* Login Modal */}
        {showLoginModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-50"
            onClick={handleModalClose}
          >
            <div
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-xl p-8 w-full max-w-md`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-8">
                <h2
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } mb-2`}
                >
                  Welcome Back
                </h2>
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Enter any valid email address to access your dashboard
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    Email
                  </label>
                  <div className="relative">
                    <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleLogin(e as any)
                      }
                      className={`w-full pl-10 pr-4 py-3 border ${
                        isDarkMode
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type={loginForm.showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleLogin(e as any)
                      }
                      className={`w-full pl-10 pr-12 py-3 border ${
                        isDarkMode
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                      placeholder="Enter password"
                    />
                    <button
                      onClick={() =>
                        setLoginForm((prev) => ({
                          ...prev,
                          showPassword: !prev.showPassword,
                        }))
                      }
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {loginForm.showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="text-red-600 text-sm flex items-center space-x-2">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  onClick={handleLogin}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer
          className={`${
            isDarkMode ? "bg-gray-800 text-white" : "bg-gray-900 text-white"
          } py-12`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Survey Analytics Pro
                </h3>
                <p className="text-gray-400 text-sm">
                  Enterprise-grade survey analysis and comparison platform.
                </p>
              </div>
              <div>
                <h4 className="text-md font-semibold mb-4">Products</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <a
                      href="#"
                      className="hover:text-white cursor-pointer transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-md font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <a
                      href="#"
                      className="hover:text-white cursor-pointer transition-colors"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white cursor-pointer transition-colors"
                    >
                      Support
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white cursor-pointer transition-colors"
                    >
                      API Reference
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className={`border-t ${
                isDarkMode ? "border-gray-700" : "border-gray-800"
              } mt-6 lg:mt-8 pt-6 lg:pt-8 text-center text-sm text-gray-400`}
            >
              <p>&copy; 2024 Survey Analytics Pro. All rights reserved.</p>
            </div>
          </div>
        </footer>
        <style>{`
  html {
    scroll-behavior: smooth;
  }
`}</style>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div
        className={`min-h-screen ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        } font-roboto transition-colors duration-300`}
      >
        {/* Header */}
        <header
          className={`${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } shadow-sm border-b transition-colors duration-300`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&auto=format"
                  alt="Logo"
                  className="w-10 h-10 rounded-full"
                />
                <h1
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } hidden sm:block`}
                >
                  Survey Analytics Pro
                </h1>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-6">
                <button
                  onClick={() => setActiveView("overview")}
                  className={`px-3 py-2 font-medium cursor-pointer transition-colors ${
                    activeView === "overview"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : isDarkMode
                      ? "text-gray-300 hover:text-blue-400"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveView("heatmaps")}
                  className={`px-3 py-2 font-medium cursor-pointer transition-colors ${
                    activeView === "heatmaps"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : isDarkMode
                      ? "text-gray-300 hover:text-blue-400"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Heatmaps
                </button>
                <button
                  onClick={() => setActiveView("trends")}
                  className={`px-3 py-2 font-medium cursor-pointer transition-colors ${
                    activeView === "trends"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : isDarkMode
                      ? "text-gray-300 hover:text-blue-400"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Trends
                </button>
              </nav>

              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-2 rounded-lg cursor-pointer transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {isDarkMode ? (
                    <SunIcon className="h-5 w-5" />
                  ) : (
                    <MoonIcon className="h-5 w-5" />
                  )}
                </button>

                {/* <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg cursor-pointer transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <FunnelIcon className="h-5 w-5" />
                </button> */}

                {/* <div className="relative">
                  <button
                    className={`p-2 rounded-lg cursor-pointer transition-colors ${
                      isDarkMode
                        ? "text-gray-300 hover:text-white hover:bg-gray-700"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <BellIcon className="h-5 w-5" />
                    {notifications.some((n) => n.unread) && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                </div> */}

                <div className="hidden md:flex items-center space-x-2">
                  <button
                    onClick={() => handleExport("pdf")}
                    className={`p-2 rounded-lg cursor-pointer transition-colors ${
                      isDarkMode
                        ? "text-gray-300 hover:text-white hover:bg-gray-700"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>

                  <button
                    onClick={handleLogout}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`md:hidden p-2 rounded-md cursor-pointer transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {isMobileMenuOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div
              className={`md:hidden border-t ${
                isDarkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-200 bg-white"
              } transition-colors duration-300`}
            >
              <div className="px-4 py-2 space-y-1">
                <button
                  onClick={() => {
                    setActiveView("overview");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 font-medium cursor-pointer transition-colors ${
                    activeView === "overview"
                      ? "text-blue-600"
                      : isDarkMode
                      ? "text-gray-300 hover:text-blue-400"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => {
                    setActiveView("heatmaps");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 font-medium cursor-pointer transition-colors ${
                    activeView === "heatmaps"
                      ? "text-blue-600"
                      : isDarkMode
                      ? "text-gray-300 hover:text-blue-400"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Heatmaps
                </button>
                <button
                  onClick={() => {
                    setActiveView("trends");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 font-medium cursor-pointer transition-colors ${
                    activeView === "trends"
                      ? "text-blue-600"
                      : isDarkMode
                      ? "text-gray-300 hover:text-blue-400"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Trends
                </button>
                <div className="border-t border-gray-200 pt-2">
                  <button
                    onClick={() => handleExport("pdf")}
                    className={`block w-full text-left px-3 py-2 cursor-pointer transition-colors ${
                      isDarkMode
                        ? "text-gray-300 hover:text-blue-400"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    Export Data
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700 font-medium cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Filters Panel */}
        {/* {showFilters && (
          <div
            className={`${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } border-b px-4 py-3 transition-colors duration-300`}
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                  <select
                    value={selectedDateRange}
                    onChange={(e) => setSelectedDateRange(e.target.value)}
                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    <option value="Q1 2024">Q1 2024</option>
                    <option value="Q4 2023">Q4 2023</option>
                    <option value="Q3 2023">Q3 2023</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* Message Display */}
        {message.text && (
          <div
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : message.type === "error"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            <CheckCircleIcon className="h-5 w-5" />
            <span>{message.text}</span>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {activeView === "overview" && (
            <>
              {/* Hero Section */}
              <div className="text-center mb-8 lg:mb-12">
                <h1
                  className={`text-3xl lg:text-4xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } mb-4`}
                >
                  Survey Comparison Analytics
                </h1>
                <p
                  className={`text-lg lg:text-xl ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  } max-w-3xl mx-auto`}
                >
                  Compare sentiment analysis across multiple survey datasets
                  with advanced visualization and demographic insights
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12">
                <div
                  className={`${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } rounded-xl shadow-lg p-4 lg:p-6 border ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  } transition-colors duration-300`}
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <ChartBarIcon className="h-6 lg:h-8 w-6 lg:w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3
                        className={`text-sm lg:text-lg font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Total Responses
                      </h3>
                      <p className="text-2xl lg:text-3xl font-bold text-blue-600">
                        {(
                          mockSurveyData.dataset1.totalResponses +
                          mockSurveyData.dataset2.totalResponses
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } rounded-xl shadow-lg p-4 lg:p-6 border ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  } transition-colors duration-300`}
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-full">
                      <ArrowTrendingUpIcon className="h-6 lg:h-8 w-6 lg:w-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3
                        className={`text-sm lg:text-lg font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Avg Sentiment
                      </h3>
                      <p className="text-2xl lg:text-3xl font-bold text-green-600">
                        {Math.round(
                          (mockSurveyData.dataset1.overallSentiment +
                            mockSurveyData.dataset2.overallSentiment) /
                            2
                        )}
                        %
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } rounded-xl shadow-lg p-4 lg:p-6 border ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  } transition-colors duration-300`}
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <UserGroupIcon className="h-6 lg:h-8 w-6 lg:w-8 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3
                        className={`text-sm lg:text-lg font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Active Surveys
                      </h3>
                      <p className="text-2xl lg:text-3xl font-bold text-purple-600">
                        2
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } rounded-xl shadow-lg p-4 lg:p-6 border ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  } transition-colors duration-300`}
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <PresentationChartLineIcon className="h-6 lg:h-8 w-6 lg:w-8 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <h3
                        className={`text-sm lg:text-lg font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Response Rate
                      </h3>
                      <p className="text-2xl lg:text-3xl font-bold text-orange-600">
                        {Math.round(
                          (mockSurveyData.dataset1.responseRate +
                            mockSurveyData.dataset2.responseRate) /
                            2
                        )}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Comparison Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-12">
                {/* Dataset 1 */}
                <div
                  className={`${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  } rounded-xl shadow-lg border overflow-hidden transition-colors duration-300`}
                >
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 lg:p-6 text-white">
                    <h2 className="text-xl lg:text-2xl font-bold mb-2">
                      {mockSurveyData.dataset1.name}
                    </h2>
                    <p className="text-blue-100">
                      {mockSurveyData.dataset1.totalResponses.toLocaleString()}{" "}
                      responses
                    </p>
                  </div>

                  <div className="p-4 lg:p-6">
                    <div className="text-center mb-6">
                      <h3
                        className={`text-lg font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        } mb-4`}
                      >
                        Overall Sentiment Score
                      </h3>
                      <RadialChart
                        value={mockSurveyData.dataset1.overallSentiment}
                        color="#3B82F6"
                      />
                    </div>

                    <div className="mb-6">
                      <h4
                        className={`text-lg font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        } mb-4`}
                      >
                        Key Insights
                      </h4>
                      <ul className="space-y-2">
                        {mockSurveyData.dataset1.insights.map(
                          (insight, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-2"
                            >
                              <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span
                                className={`text-sm ${
                                  isDarkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {insight}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Dataset 2 */}
                <div
                  className={`${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  } rounded-xl shadow-lg border overflow-hidden transition-colors duration-300`}
                >
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 lg:p-6 text-white">
                    <h2 className="text-xl lg:text-2xl font-bold mb-2">
                      {mockSurveyData.dataset2.name}
                    </h2>
                    <p className="text-green-100">
                      {mockSurveyData.dataset2.totalResponses.toLocaleString()}{" "}
                      responses
                    </p>
                  </div>

                  <div className="p-4 lg:p-6">
                    <div className="text-center mb-6">
                      <h3
                        className={`text-lg font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        } mb-4`}
                      >
                        Overall Sentiment Score
                      </h3>
                      <RadialChart
                        value={mockSurveyData.dataset2.overallSentiment}
                        color="#10B981"
                      />
                    </div>

                    <div className="mb-6">
                      <h4
                        className={`text-lg font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        } mb-4`}
                      >
                        Key Insights
                      </h4>
                      <ul className="space-y-2">
                        {mockSurveyData.dataset2.insights.map(
                          (insight, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-2"
                            >
                              <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span
                                className={`text-sm ${
                                  isDarkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {insight}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demographics Section */}
              <div
                className={`${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } rounded-xl shadow-lg border p-4 lg:p-6 transition-colors duration-300`}
              >
                <h2
                  className={`text-xl lg:text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } mb-6 lg:mb-8`}
                >
                  Demographic Analysis
                </h2>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                  {/* Dataset 1 Demographics */}
                  <div>
                    <h3
                      className={`text-lg lg:text-xl font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      } mb-4 lg:mb-6`}
                    >
                      {mockSurveyData.dataset1.name}
                    </h3>
                    <div className="space-y-4 lg:space-y-6">
                      <DemographicChart
                        data={mockSurveyData.dataset1.demographics.age}
                        title="Age Distribution"
                        colors={[
                          "#3B82F6",
                          "#1D4ED8",
                          "#1E40AF",
                          "#1E3A8A",
                          "#172554",
                        ]}
                      />
                      <DemographicChart
                        data={mockSurveyData.dataset1.demographics.gender}
                        title="Gender Distribution"
                        colors={["#EF4444", "#F97316", "#84CC16"]}
                      />
                      <DemographicChart
                        data={mockSurveyData.dataset1.demographics.location}
                        title="Geographic Distribution"
                        colors={["#8B5CF6", "#A855F7", "#C084FC", "#DDD6FE"]}
                      />
                    </div>
                  </div>

                  {/* Dataset 2 Demographics */}
                  <div>
                    <h3
                      className={`text-lg lg:text-xl font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      } mb-4 lg:mb-6`}
                    >
                      {mockSurveyData.dataset2.name}
                    </h3>
                    <div className="space-y-4 lg:space-y-6">
                      <DemographicChart
                        data={mockSurveyData.dataset2.demographics.age}
                        title="Age Distribution"
                        colors={[
                          "#10B981",
                          "#059669",
                          "#047857",
                          "#065F46",
                          "#064E3B",
                        ]}
                      />
                      <DemographicChart
                        data={mockSurveyData.dataset2.demographics.gender}
                        title="Gender Distribution"
                        colors={["#F59E0B", "#D97706", "#B45309"]}
                      />
                      <DemographicChart
                        data={mockSurveyData.dataset2.demographics.location}
                        title="Geographic Distribution"
                        colors={["#06B6D4", "#0891B2", "#0E7490", "#155E75"]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeView === "heatmaps" && (
            <>
              <div className="text-center mb-8">
                <h1
                  className={`text-3xl lg:text-4xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } mb-4`}
                >
                  Advanced Heatmap Analysis
                </h1>
                <p
                  className={`text-lg ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Deep dive into sentiment patterns across different dimensions
                </p>
              </div>

              <div className="space-y-6 lg:space-y-8">
                {/* Keyword Frequency Heatmap */}
                <div
                  className={`${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  } rounded-xl shadow-lg border p-4 sm:p-5 lg:p-6 transition-colors duration-300 w-full`}
                >
                  <h2
                    className={`text-lg sm:text-xl lg:text-2xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    } mb-4 sm:mb-6`}
                  >
                    Keyword Frequency Heatmap
                  </h2>

                  <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {mockSurveyData.dataset1.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {mockSurveyData.dataset2.name}
                      </span>
                    </div>
                  </div>

                  <div className="w-full overflow-x-auto">
                    <KeywordHeatmap
                      keywords1={mockSurveyData.dataset1.keywords}
                      keywords2={mockSurveyData.dataset2.keywords}
                    />
                  </div>
                </div>

                {/* Geographic Sentiment Heatmaps */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                  <GeographicHeatmap
                    data={mockSurveyData.dataset1.geographicSentiment}
                    title="Geographic Sentiment - Dataset 1"
                  />
                  <GeographicHeatmap
                    data={mockSurveyData.dataset2.geographicSentiment}
                    title="Geographic Sentiment - Dataset 2"
                  />
                </div>

                {/* Category Sentiment Comparison */}
                <CategoryHeatmap
                  data1={mockSurveyData.dataset1.categorySentiment}
                  data2={mockSurveyData.dataset2.categorySentiment}
                  title="Category Sentiment Comparison"
                />
              </div>
            </>
          )}

          {activeView === "trends" && (
            <>
              <div className="text-center mb-8">
                <h1
                  className={`text-3xl lg:text-4xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } mb-4`}
                >
                  Trend Analysis
                </h1>
                <p
                  className={`text-lg ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Track sentiment changes over time and identify patterns
                </p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                <TimeSeriesChart
                  data1={mockSurveyData.dataset1.timeSeriesData}
                  data2={mockSurveyData.dataset2.timeSeriesData}
                />

                <div
                  className={`${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } rounded-xl shadow-lg p-6`}
                >
                  <h3
                    className={`text-lg font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    } mb-6`}
                  >
                    Trend Insights
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4
                          className={`font-medium ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Customer Satisfaction Growth
                        </h4>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Steady 6-point improvement over Q1, driven by service
                          quality enhancements
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <ClockIcon className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4
                          className={`font-medium ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Employee Engagement Stability
                        </h4>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Gradual 3-point increase with focus on work-life
                          balance initiatives
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <ChartPieIcon className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4
                          className={`font-medium ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Correlation Analysis
                        </h4>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Strong positive correlation (r=0.78) between customer
                          satisfaction and employee engagement
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>

        {/* Footer */}
        <footer
          className={`${
            isDarkMode ? "bg-gray-800 text-white" : "bg-gray-900 text-white"
          } py-8 lg:py-12 mt-12 lg:mt-16 transition-colors duration-300`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Survey Analytics Pro
                </h3>
                <p className="text-gray-400 text-sm">
                  Enterprise-grade survey analysis and comparison platform.
                </p>
              </div>
              <div>
                <h4 className="text-md font-semibold mb-4">Products</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <a
                      href="#"
                      className="hover:text-white cursor-pointer transition-colors"
                    >
                      Analytics Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white cursor-pointer transition-colors"
                    >
                      Survey Builder
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white cursor-pointer transition-colors"
                    >
                      Reporting Suite
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-md font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <a
                      href="#"
                      className="hover:text-white cursor-pointer transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white cursor-pointer transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white cursor-pointer transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-md font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <a
                      href="#"
                      className="hover:text-white cursor-pointer transition-colors"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white cursor-pointer transition-colors"
                    >
                      Support
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white cursor-pointer transition-colors"
                    >
                      API Reference
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className={`border-t ${
                isDarkMode ? "border-gray-700" : "border-gray-800"
              } mt-6 lg:mt-8 pt-6 lg:pt-8 text-center text-sm text-gray-400`}
            >
              <p>&copy; 2024 Survey Analytics Pro. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }
};

export default SurveyAnalytics;