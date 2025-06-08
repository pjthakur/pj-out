"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  Zap,
  Globe,
  Smartphone,
  Laptop,
  Monitor,
  BarChart3,
  ArrowUpRight,
  Star,
  Users,
  Award,
  Target,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Play,
  CheckCircle,
  Lightbulb,
  Rocket,
  Heart,
  Shield,
  Clock,
  Download,
  ArrowRight,
  Building,
  TrendingDown,
  Cpu,
  Headphones,
  Tablet,
  Camera,
  Gamepad2,
  Watch,
  Home,
  Package,
  Brain,
  Info,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Filter,
  Search,
  Settings,
  Bell,
  User,
  LogOut,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from "recharts";

interface QuoteData {
  id: number;
  quote: string;
  author: string;
  category: string;
}

interface MetricData {
  name: string;
  value: number;
  change: number;
  trend: "up" | "down";
}

interface ProductData {
  id: number;
  name: string;
  category: string;
  price: number;
  sales: number;
  rating: number;
  image: string;
  status: "trending" | "new" | "bestseller";
}

const TechVisionApp: React.FC = () => {
  const [currentView, setCurrentView] = useState("landing");
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: "last3months",
    category: "all",
    region: "global",
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dummy user info; swap with your actual data source
  const userName = "Sachin Gurjar";
  const userEmail = "sachin.gurjar@example.com";

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [isDropdownOpen]);

  const quotes: QuoteData[] = [
    {
      id: 1,
      quote: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs",
      category: "Innovation",
    },
    {
      id: 2,
      quote:
        "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
      category: "Dreams",
    },
    {
      id: 3,
      quote: "Technology is best when it brings people together.",
      author: "Matt Mullenweg",
      category: "Technology",
    },
    {
      id: 4,
      quote:
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
      category: "Perseverance",
    },
    {
      id: 5,
      quote:
        "The only way to make sense out of change is to plunge into it, move with it, and join the dance.",
      author: "Alan Watts",
      category: "Change",
    },
  ];

  const salesData = [
    {
      month: "Jan",
      smartphones: 4000,
      laptops: 2400,
      monitors: 1200,
      tablets: 800,
      accessories: 600,
    },
    {
      month: "Feb",
      smartphones: 3000,
      laptops: 1398,
      monitors: 1800,
      tablets: 900,
      accessories: 750,
    },
    {
      month: "Mar",
      smartphones: 2000,
      laptops: 9800,
      monitors: 1600,
      tablets: 1100,
      accessories: 820,
    },
    {
      month: "Apr",
      smartphones: 2780,
      laptops: 3908,
      monitors: 2200,
      tablets: 1200,
      accessories: 900,
    },
    {
      month: "May",
      smartphones: 1890,
      laptops: 4800,
      monitors: 1900,
      tablets: 1000,
      accessories: 650,
    },
    {
      month: "Jun",
      smartphones: 2390,
      laptops: 3800,
      monitors: 2100,
      tablets: 1300,
      accessories: 780,
    },
  ];

  const revenueData = [
    { quarter: "Q1 2024", revenue: 125000, profit: 45000, expenses: 80000 },
    { quarter: "Q2 2024", revenue: 145000, profit: 52000, expenses: 93000 },
    { quarter: "Q3 2024", revenue: 165000, profit: 61000, expenses: 104000 },
    { quarter: "Q4 2024", revenue: 185000, profit: 68000, expenses: 117000 },
  ];

  const marketShareData = [
    { name: "Smartphones", value: 35, color: "#3B82F6" },
    { name: "Laptops", value: 28, color: "#8B5CF6" },
    { name: "Monitors", value: 20, color: "#06D6A0" },
    { name: "Tablets", value: 17, color: "#F59E0B" },
  ];

  const performanceData = [
    { name: "Customer Satisfaction", value: 94, fill: "#3B82F6" },
    { name: "Market Growth", value: 87, fill: "#8B5CF6" },
    { name: "Innovation Index", value: 91, fill: "#06D6A0" },
    { name: "Brand Recognition", value: 89, fill: "#F59E0B" },
  ];

  const keyMetrics: MetricData[] = [
    { name: "Total Revenue", value: 2.4, change: 12.5, trend: "up" },
    { name: "Active Users", value: 1.8, change: 8.3, trend: "up" },
    { name: "Market Share", value: 23.1, change: 3.2, trend: "up" },
    { name: "Customer Satisfaction", value: 94.2, change: 2.1, trend: "up" },
  ];

  const products: ProductData[] = [
    {
      id: 1,
      name: "TechPhone Pro Max",
      category: "Smartphones",
      price: 1299,
      sales: 15420,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop&crop=center",
      status: "trending",
    },
    {
      id: 2,
      name: "UltraBook Elite",
      category: "Laptops",
      price: 2199,
      sales: 8950,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop&crop=center",
      status: "bestseller",
    },
    {
      id: 3,
      name: "Vision Monitor 4K",
      category: "Monitors",
      price: 899,
      sales: 6340,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=300&fit=crop&crop=center",
      status: "new",
    },
    {
      id: 4,
      name: "TabletMax Pro",
      category: "Tablets",
      price: 799,
      sales: 4280,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop&crop=center",
      status: "trending",
    },
    {
      id: 5,
      name: "Gaming Headset Pro",
      category: "Accessories",
      price: 299,
      sales: 12560,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=300&h=300&fit=crop&crop=center",
      status: "bestseller",
    },
    {
      id: 6,
      name: "Smart Watch Series X",
      category: "Wearables",
      price: 599,
      sales: 7890,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop&crop=center",
      status: "new",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (showExportModal || showFilterModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showExportModal, showFilterModal]);

  const nextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % quotes.length);
  };

  const prevQuote = () => {
    setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const navigateTo = (view: string) => {
    setCurrentView(view);
    setIsMenuOpen(false);
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleFilter = () => {
    setShowFilterModal(true);
  };

  const applyFilters = () => {
    setShowFilterModal(false);
    // Filter logic is applied through getFilteredData function
  };

  const getFilteredData = () => {
    // Base data
    let filteredSales = [...salesData];
    let filteredRevenue = [...revenueData];
    let filteredMetrics = [...keyMetrics];

    // Apply date range filter
    if (filters.dateRange === "last7days") {
      filteredSales = salesData.slice(-1); // Show only last month for demo
      filteredRevenue = revenueData.slice(-1); // Show only last quarter for demo
    } else if (filters.dateRange === "last30days") {
      filteredSales = salesData.slice(-2); // Show last 2 months for demo
      filteredRevenue = revenueData.slice(-2); // Show last 2 quarters for demo
    } else if (filters.dateRange === "last12months") {
      // Show all data
      filteredSales = salesData;
      filteredRevenue = revenueData;
    }

    // Apply category filter
    if (filters.category !== "all") {
      filteredSales = filteredSales.map((item) => ({
        ...item,
        smartphones: filters.category === "smartphones" ? item.smartphones : 0,
        laptops: filters.category === "laptops" ? item.laptops : 0,
        monitors: filters.category === "monitors" ? item.monitors : 0,
        tablets: filters.category === "tablets" ? item.tablets : 0,
        accessories: filters.category === "accessories" ? item.accessories : 0,
      }));
    }

    // Apply region filter (simulate regional data adjustment)
    if (filters.region !== "global") {
      const regionMultiplier =
        {
          northamerica: 0.4,
          europe: 0.3,
          asia: 0.2,
          latam: 0.1,
        }[filters.region] || 1;

      filteredRevenue = filteredRevenue.map((item) => ({
        ...item,
        revenue: Math.round(item.revenue * regionMultiplier),
        profit: Math.round(item.profit * regionMultiplier),
        expenses: Math.round(item.expenses * regionMultiplier),
      }));

      filteredMetrics = filteredMetrics.map((metric) => ({
        ...metric,
        value: parseFloat((metric.value * regionMultiplier).toFixed(1)),
      }));
    }

    return { filteredSales, filteredRevenue, filteredMetrics };
  };

  const { filteredSales, filteredRevenue, filteredMetrics } = getFilteredData();

  const exportData = (format: string) => {
    // Simulate data export
    const data = {
      metrics: keyMetrics,
      sales: salesData,
      revenue: revenueData,
      marketShare: marketShareData,
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-data.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const getActiveTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Overall Performance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="20%"
                  outerRadius="90%"
                  data={performanceData}
                >
                  <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                  <Tooltip
                    formatter={(value: number, name: string, item: any) => [
                      value,
                      item.payload.name
                    ]}
                    contentStyle={{
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                    }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {performanceData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center p-2 bg-white/5 rounded-lg"
                  >
                    <div
                      className={`w-3 h-3 rounded-full mr-2`}
                      style={{ backgroundColor: item.fill }}
                    ></div>
                    <span className="text-gray-300 text-sm">{item.name}</span>
                    <span className="text-white text-sm ml-auto">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Growth Metrics
              </h3>
              <div className="space-y-4">
                {filteredMetrics.map((metric, index) => (
                  <div
                    key={metric.name}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                  >
                    <div>
                      <p className="text-gray-300 text-sm">{metric.name}</p>
                      <p className="text-white text-lg font-semibold">
                        {index === 0
                          ? `$${metric.value}B`
                          : index === 2
                          ? `${metric.value}%`
                          : index === 3
                          ? `${metric.value}%`
                          : `${metric.value}M`}
                      </p>
                    </div>
                    <div
                      className={`flex items-center text-sm ${
                        metric.trend === "up"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      {metric.change}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "sales":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">
                Product Sales Trends
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={filteredSales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="smartphones"
                    stroke="#3B82F6"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="laptops"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="monitors"
                    stroke="#06D6A0"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="tablets"
                    stroke="#F59E0B"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="accessories"
                    stroke="#EC4899"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">
                Sales by Category
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={filteredSales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="smartphones" fill="#3B82F6" radius={2} />
                  <Bar dataKey="laptops" fill="#8B5CF6" radius={2} />
                  <Bar dataKey="monitors" fill="#06D6A0" radius={2} />
                  <Bar dataKey="tablets" fill="#F59E0B" radius={2} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case "revenue":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">
                Revenue vs Profit
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={filteredRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="quarter" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stackId="2"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">
                Financial Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={filteredRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="quarter" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="revenue" fill="#3B82F6" radius={4} />
                  <Bar dataKey="expenses" fill="#EF4444" radius={4} />
                  <Bar dataKey="profit" fill="#10B981" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case "market":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">
                Market Share Distribution
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={marketShareData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={140}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {marketShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {marketShareData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center p-2 bg-white/5 rounded-lg"
                  >
                    <div
                      className={`w-3 h-3 rounded-full mr-2`}
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-300 text-sm">{item.name}</span>
                    <span className="text-white text-sm ml-auto">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">
                Market Trends
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Mobile Devices</span>
                    <span className="text-green-400 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +15.2%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "78%" }}
                    ></div>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Computing</span>
                    <span className="text-green-400 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +8.7%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Wearables</span>
                    <span className="text-green-400 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +23.4%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Gaming</span>
                    <span className="text-red-400 flex items-center">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      -2.1%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: "38%" }}
                    ></div>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Audio/Speakers</span>
                    <span className="text-green-400 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +11.3%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-pink-500 h-2 rounded-full"
                      style={{ width: "52%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderNavigation = () => (
    <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <button
              onClick={() => navigateTo("landing")}
              className="flex-shrink-0 flex items-center group cursor-pointer"
            >
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold text-white">
                TechVision
              </span>
            </button>
          </div>

          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {[
                { name: "Dashboard", view: "dashboard", icon: Home },
                { name: "Analytics", view: "analytics", icon: BarChart },
                { name: "Products", view: "products", icon: Package },
                { name: "Insights", view: "insights", icon: Brain },
                { name: "About", view: "about", icon: Info },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigateTo(item.view)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center cursor-pointer ${
                    currentView === item.view
                      ? "bg-white/20 text-white"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <User className="h-5 w-5 mr-2" />
                <span className="text-sm">Account</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white backdrop-blur-md rounded-lg border border-white/20 shadow-lg">
                  <div className="py-2 px-4">
                    <p className="text-sm  font-semibold">{userName}</p>
                    <p className="text-sm">{userEmail}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-black/90 backdrop-blur-md border-t border-white/20">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {[
              { name: "Dashboard", view: "dashboard", icon: Home },
              { name: "Analytics", view: "analytics", icon: BarChart },
              { name: "Products", view: "products", icon: Package },
              { name: "Insights", view: "insights", icon: Brain },
              { name: "About", view: "about", icon: Info },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => navigateTo(item.view)}
                className="flex items-center w-full text-gray-300 hover:text-white px-3 py-3 rounded-lg text-base font-medium hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );

  const renderLandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {renderNavigation()}

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Transform Your Business With
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {" "}
                AI-Driven Analytics
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Unlock the power of data-driven decision making with our
              enterprise-grade platform. Combine powerful analytics with
              inspirational insights to drive unprecedented growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button
                onClick={() => navigateTo("dashboard")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-2xl cursor-pointer"
              >
                <Play className="mr-3 h-6 w-6" />
                Get Started
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { value: "50K+", label: "Enterprise Clients" },
                { value: "99.9%", label: "Uptime SLA" },
                { value: "2.4B+", label: "Data Points Analyzed" },
                { value: "150+", label: "Countries Served" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to make data-driven decisions at scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="h-8 w-8" />,
                title: "Real-time Analytics",
                description:
                  "Monitor your business metrics in real-time with our advanced analytics engine. Get instant insights as your data changes.",
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Enterprise Security",
                description:
                  "Bank-grade security with SOC 2 compliance, end-to-end encryption, and advanced threat protection.",
              },
              {
                icon: <Rocket className="h-8 w-8" />,
                title: "AI-Powered Insights",
                description:
                  "Leverage machine learning algorithms to discover hidden patterns and predict future trends in your data.",
              },
              {
                icon: <Globe className="h-8 w-8" />,
                title: "Global Scale",
                description:
                  "Built to handle enterprise workloads with 99.9% uptime SLA and global content delivery network.",
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Team Collaboration",
                description:
                  "Share insights across your organization with advanced permission controls and collaborative workspaces.",
              },
              {
                icon: <Heart className="h-8 w-8" />,
                title: "24/7 Support",
                description:
                  "Get expert support whenever you need it with our dedicated customer success team and priority support.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-300">
              See what our customers are saying
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "TechVision transformed how we analyze our data. The insights we get are incredible and the platform is intuitive.",
                author: "Sarah Chen",
                title: "CTO, GlobalTech Corp",
                rating: 5,
              },
              {
                quote:
                  "The real-time analytics have given us a competitive edge. We can react to market changes instantly.",
                author: "Michael Rodriguez",
                title: "VP Analytics, Innovation Labs",
                rating: 5,
              },
              {
                quote:
                  "Best investment we've made. The ROI was evident within the first quarter of implementation.",
                author: "Emily Watson",
                title: "Head of Data, FutureTech Inc",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <blockquote className="text-gray-300 mb-6 text-lg leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-purple-300">{testimonial.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-12 border border-white/20 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Data?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Join thousands of companies using TechVision to make smarter,
              faster decisions. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => navigateTo("dashboard")}
                className="bg-white text-purple-600 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg cursor-pointer"
              >
                <CheckCircle className="mr-3 h-6 w-6" />
                Get Started
              </button>
              <button className="border-2 border-white text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300 flex items-center justify-center cursor-pointer">
                <Phone className="mr-3 h-6 w-6" />
                Talk to Sales
              </button>
            </div>
            <p className="text-blue-200 text-sm mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-md border-t border-white/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-2xl font-bold text-white">
                  TechVision
                </span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                Empowering businesses worldwide with intelligent analytics and
                inspirational insights to drive innovation and sustainable
                growth in the digital age.
              </p>
              <div className="flex gap-4 md:flex-row flex-col">
                {["Twitter", "LinkedIn", "GitHub", "YouTube"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300 text-lg cursor-pointer"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Product</h3>
              <ul className="space-y-3">
                {[
                  "Dashboard",
                  "Analytics",
                  "Reports",
                  "API",
                  "Integrations",
                  "Mobile App",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Company</h3>
              <ul className="space-y-3">
                {[
                  "About Us",
                  "Careers",
                  "Contact",
                  "Support",
                  "Privacy",
                  "Terms",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 TechVision Analytics Inc. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center text-gray-400 text-sm">
                <Shield className="h-4 w-4 mr-2" />
                SOC 2 Certified
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Award className="h-4 w-4 mr-2" />
                ISO 27001
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {renderNavigation()}

      {/* Dashboard Header */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-300">
                Monitor your business performance and market trends
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {filteredMetrics.map((metric, index) => (
              <div
                key={metric.name}
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    {index === 0 && (
                      <TrendingUp className="h-6 w-6 text-white" />
                    )}
                    {index === 1 && <Users className="h-6 w-6 text-white" />}
                    {index === 2 && <Target className="h-6 w-6 text-white" />}
                    {index === 3 && <Star className="h-6 w-6 text-white" />}
                  </div>
                  <div
                    className={`flex items-center text-sm font-medium ${
                      metric.trend === "up" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    {metric.change}%
                  </div>
                </div>
                <h3 className="text-gray-300 text-sm font-medium mb-2">
                  {metric.name}
                </h3>
                <p className="text-2xl font-bold text-white">
                  {index === 0
                    ? `$${metric.value}B`
                    : index === 2
                    ? `${metric.value}%`
                    : index === 3
                    ? `${metric.value}%`
                    : `${metric.value}M`}
                </p>
              </div>
            ))}
          </div>

          {/* Inspirational Quote */}
          <div className="mb-8">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5" />
                  Daily Inspiration
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevQuote}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                  >
                    <ChevronLeft className="h-5 w-5 text-white" />
                  </button>
                  <button
                    onClick={nextQuote}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                  >
                    <ChevronRight className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="text-center">
                <blockquote className="text-xl md:text-2xl font-light text-white mb-4 leading-relaxed">
                  "{quotes[currentQuote].quote}"
                </blockquote>
                <cite className="text-lg text-purple-300 font-medium">
                  — {quotes[currentQuote].author}
                </cite>
                <div className="mt-4">
                  <span className="inline-block bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm">
                    {quotes[currentQuote].category}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-1 border border-white/10 inline-flex">
              {["overview", "sales", "revenue", "market"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`md:px-8 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-300 capitalize cursor-pointer ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {getActiveTabContent()}

          {/* Export Modal */}
          {showExportModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 max-w-md w-full mx-4">
                <h3 className="text-xl font-semibold text-white mb-6">
                  Export Data
                </h3>
                <p className="text-gray-300 mb-6">
                  Choose your preferred format to download the analytics data.
                </p>
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => exportData("json")}
                    className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 cursor-pointer"
                  >
                    <span className="text-white">JSON Format</span>
                    <Download className="h-4 w-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => exportData("csv")}
                    className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 cursor-pointer"
                  >
                    <span className="text-white">CSV Format</span>
                    <Download className="h-4 w-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => exportData("xlsx")}
                    className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 cursor-pointer"
                  >
                    <span className="text-white">Excel Format</span>
                    <Download className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="flex-1 px-4 py-2 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filter Modal */}
          {showFilterModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 max-w-md w-full mx-4">
                <h3 className="text-xl font-semibold text-white mb-6">
                  Filter Data
                </h3>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Date Range
                    </label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) =>
                        setFilters({ ...filters, dateRange: e.target.value })
                      }
                      className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white"
                    >
                      <option value="last7days">Last 7 days</option>
                      <option value="last30days">Last 30 days</option>
                      <option value="last3months">Last 3 months</option>
                      <option value="last12months">Last 12 months</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Product Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) =>
                        setFilters({ ...filters, category: e.target.value })
                      }
                      className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white"
                    >
                      <option value="all">All Categories</option>
                      <option value="smartphones">Smartphones</option>
                      <option value="laptops">Laptops</option>
                      <option value="monitors">Monitors</option>
                      <option value="tablets">Tablets</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Region
                    </label>
                    <select
                      value={filters.region}
                      onChange={(e) =>
                        setFilters({ ...filters, region: e.target.value })
                      }
                      className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white"
                    >
                      <option value="global">Global</option>
                      <option value="northamerica">North America</option>
                      <option value="europe">Europe</option>
                      <option value="asia">Asia Pacific</option>
                      <option value="latam">Latin America</option>
                    </select>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="flex-1 px-4 py-2 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyFilters}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 cursor-pointer"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {renderNavigation()}

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Our Products</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover our comprehensive range of cutting-edge electronics
              designed to enhance your digital experience
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white/8 rounded-lg border border-white/10 hover:border-white/20 transition-colors duration-200"
              >
                {/* Image Container */}
                <div className="relative h-48 bg-white/5 rounded-t-lg overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        product.status === "trending"
                          ? "bg-blue-500 text-white"
                          : product.status === "new"
                          ? "bg-green-500 text-white"
                          : "bg-yellow-500 text-black"
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Category */}
                  <p className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">
                    {product.category}
                  </p>
                  
                  {/* Product Name */}
                  <h3 className="text-lg font-semibold text-white mb-3 leading-tight">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex mr-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-300 text-sm">
                      {product.rating}
                    </span>
                  </div>

                  {/* Price and Sales */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">
                      ${product.price.toLocaleString()}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {product.sales.toLocaleString()} sold
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {renderNavigation()}

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Advanced Analytics
            </h1>
            <p className="text-xl text-gray-300">
              Deep insights into your business performance
            </p>
          </div>

          {/* Analytics Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">
                Conversion Funnel
              </h3>
              <div className="space-y-4">
                {[
                  { stage: "Visitors", value: 10000, percentage: 100 },
                  { stage: "Product Views", value: 3500, percentage: 35 },
                  { stage: "Add to Cart", value: 1200, percentage: 12 },
                  { stage: "Checkout", value: 450, percentage: 4.5 },
                  { stage: "Purchase", value: 380, percentage: 3.8 },
                ].map((stage, index) => (
                  <div
                    key={stage.stage}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                  >
                    <span className="text-gray-300">{stage.stage}</span>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                          style={{ width: `${stage.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-medium w-16 text-right">
                        {stage.value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">
                Top Performing Regions
              </h3>
              <div className="space-y-4">
                {[
                  {
                    region: "North America",
                    revenue: "$2.4M",
                    growth: "+15.2%",
                  },
                  { region: "Europe", revenue: "$1.8M", growth: "+12.7%" },
                  {
                    region: "Asia Pacific",
                    revenue: "$1.5M",
                    growth: "+23.1%",
                  },
                  {
                    region: "Latin America",
                    revenue: "$0.9M",
                    growth: "+8.9%",
                  },
                  { region: "Middle East", revenue: "$0.6M", growth: "+18.3%" },
                ].map((region) => (
                  <div
                    key={region.region}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                  >
                    <span className="text-gray-300">{region.region}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-white font-medium">
                        {region.revenue}
                      </span>
                      <span className="text-green-400 text-sm">
                        {region.growth}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {renderNavigation()}

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Business Insights
            </h1>
            <p className="text-xl text-gray-300">
              AI-powered recommendations and trends
            </p>
          </div>

          {/* Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Market Opportunity",
                insight:
                  "Wearables market shows 23% growth potential in Q2 2025",
                impact: "High",
                action: "Expand product line",
              },
              {
                title: "Customer Behavior",
                insight: "Mobile users spend 40% more time on product pages",
                impact: "Medium",
                action: "Optimize mobile UX",
              },
              {
                title: "Seasonal Trend",
                insight: "Gaming accessories peak during holiday season",
                impact: "High",
                action: "Increase inventory",
              },
              {
                title: "Price Optimization",
                insight: "Premium products have 15% higher margins",
                impact: "Medium",
                action: "Adjust pricing strategy",
              },
              {
                title: "Geographic Expansion",
                insight: "Southeast Asia shows untapped potential",
                impact: "High",
                action: "Market research",
              },
              {
                title: "Competition Analysis",
                insight: "Competitors lag 6 months in innovation cycle",
                impact: "Medium",
                action: "Accelerate R&D",
              },
              {
                title: "Supply Chain Optimization",
                insight: "30% reduction possible in logistics costs through automation",
                impact: "High",
                action: "Implement AI logistics",
              },
              {
                title: "Customer Retention",
                insight: "Loyalty programs show 85% higher retention rates",
                impact: "Medium",
                action: "Launch loyalty program",
              },
              {
                title: "Sustainability Trend",
                insight: "Eco-friendly products drive 40% more engagement",
                impact: "High",
                action: "Green product line",
              },
            ].map((insight, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {insight.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      insight.impact === "High"
                        ? "bg-red-500/20 text-red-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {insight.impact} Impact
                  </span>
                </div>
                <p className="text-gray-300 mb-4">{insight.insight}</p>
                <div className="flex items-center justify-between">
                  <span className="text-purple-300 text-sm font-medium">
                    {insight.action}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {renderNavigation()}

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About TechVision
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're on a mission to democratize data analytics and inspire
              innovation across industries
            </p>
          </div>

          {/* Company Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { number: "2018", label: "Founded" },
              { number: "50K+", label: "Customers" },
              { number: "150+", label: "Countries" },
              { number: "500+", label: "Team Members" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">
                Our Mission
              </h2>
              <p className="text-gray-300 leading-relaxed">
                To empower businesses of all sizes with intelligent analytics
                tools that transform raw data into actionable insights, enabling
                smarter decisions and sustainable growth in an increasingly
                connected world.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
              <p className="text-gray-300 leading-relaxed">
                A future where every business decision is data-driven, where
                inspiration meets intelligence, and where technology serves
                humanity's greatest ambitions. We believe in building tools that
                inspire as much as they inform.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Leadership Team
            </h2>
            <p className="text-gray-300">
              Meet the visionaries behind TechVision
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Chen",
                role: "CEO & Co-Founder",
                bio: "Former VP of Engineering at Google, PhD in Computer Science from MIT",
              },
              {
                name: "Sarah Kim",
                role: "CTO & Co-Founder",
                bio: "Ex-Principal Engineer at Amazon, Expert in distributed systems and ML",
              },
              {
                name: "Marcus Rodriguez",
                role: "VP of Product",
                bio: "Previously led product teams at Spotify and Airbnb, Stanford MBA",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-purple-300 mb-3">{member.role}</p>
                <p className="text-gray-300 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Main render logic
  return (
    <div className="font-['Roboto']">
      {!currentView && renderLandingPage()}
      {currentView === "dashboard" && renderDashboard()}
      {currentView === "analytics" && renderAnalytics()}
      {currentView === "products" && renderProducts()}
      {currentView === "insights" && renderInsights()}
      {currentView === "about" && renderAbout()}
      {currentView === "landing" && renderLandingPage()}

            <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");
      `}</style>

    </div>
  );
};

export default TechVisionApp;

// Zod Schema
export const Schema = {
    "commentary": "This is a Next.js 13+ app that reloads automatically. Using the pages router. All components must be included one file.",
    "template": "nextjs-developer",
    "title": "Electronics Dashboard",
    "description": "A dashboard interface that displays electronics product metrics and trends.",
    "additional_dependencies": ["lucide-react", "recharts"],
    "has_additional_dependencies": true,
    "install_dependencies_command": "npm i lucide-react recharts",
    "port": 3000,
    "file_path": "pages/index.tsx",
    "code": "<see code above>"
}