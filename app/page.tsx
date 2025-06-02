"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  ScatterChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  TrendingUp,
  Users,
  Eye,
  Clock,
  Globe,
  Search,
  Share2,
  BarChart3,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet,
  Menu,
  X,
  Bell,
  MapPin,
  Zap,
  DollarSign,
  UserCheck,
  MousePointer,
  ShoppingCart,
  Star,
  AlertCircle,
  ChevronDown,
  Mail,
  Phone,
  LogOut,
  User,
  HelpCircle,
  FileText,
  Bookmark,
  TrendingDown,
  Play,
  Pause,
  SkipForward,
  Timer,
  Wifi,
  UserPlus,
  Repeat,
  BarChart2,
  PieChart as PieChartIcon,
} from "lucide-react";

// Enhanced Types
interface TrafficData {
  date: string;
  visitors: number;
  pageViews: number;
  sessions: number;
  bounceRate: number;
  revenue: number;
  conversions: number;
  avgSessionDuration: number;
}

interface SourceData {
  name: string;
  value: number;
  color: string;
  change: number;
}

interface DeviceData {
  name: string;
  visitors: number;
  percentage: number;
  revenue: number;
}

interface KPIMetric {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  trend: "up" | "down";
  target?: string;
}

interface GeographicData {
  country: string;
  visitors: number;
  revenue: number;
  flag: string;
}

interface RealtimeData {
  activeUsers: number;
  pageViews: number;
  topPages: { page: string; users: number }[];
  recentEvents: { event: string; time: string; location: string }[];
}

interface AudienceData {
  age: string;
  users: number;
  sessions: number;
  bounceRate: number;
}

const Dashboard: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [realtimeData, setRealtimeData] = useState<RealtimeData>({
    activeUsers: 1247,
    pageViews: 5834,
    topPages: [
      { page: "/dashboard", users: 423 },
      { page: "/products", users: 312 },
      { page: "/analytics", users: 267 },
      { page: "/pricing", users: 189 },
      { page: "/contact", users: 156 },
    ],
    recentEvents: [
      { event: "Page View", time: "2s ago", location: "New York, US" },
      { event: "Sign Up", time: "5s ago", location: "London, UK" },
      { event: "Purchase", time: "12s ago", location: "Toronto, CA" },
      { event: "Page View", time: "18s ago", location: "Berlin, DE" },
      { event: "Download", time: "23s ago", location: "Sydney, AU" },
    ],
  });

  // Simulate real-time updates only for dashboard and real-time views
  useEffect(() => {
    if (activeTab !== "dashboard" && activeTab !== "realtime") {
      return; // Don't update if not on dashboard or real-time view
    }

    const interval = setInterval(() => {
      setRealtimeData((prev) => ({
        ...prev,
        activeUsers: Math.max(
          800,
          prev.activeUsers + Math.floor(Math.random() * 20) - 10
        ),
        pageViews: prev.pageViews + Math.floor(Math.random() * 15) - 5,
        recentEvents: [
          {
            event: ["Page View", "Sign Up", "Purchase", "Download"][
              Math.floor(Math.random() * 4)
            ],
            time: "Just now",
            location: ["New York, US", "London, UK", "Paris, FR", "Tokyo, JP"][
              Math.floor(Math.random() * 4)
            ],
          },
          ...prev.recentEvents.slice(0, 4),
        ],
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scrolling
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }

    // Cleanup function to ensure body scroll is restored if component unmounts
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isMenuOpen]);

  // Generate data based on time range
  const generateTrafficData = (days: number): TrafficData[] => {
    const data: TrafficData[] = [];
    const baseDate = new Date("2025-05-31");

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i);

      const visitors = Math.floor(1200 + Math.random() * 800 + i * 50);
      const sessions = Math.floor(visitors * 0.85);

      data.push({
        date: date.toISOString().split("T")[0],
        visitors,
        pageViews: Math.floor(visitors * (2.5 + Math.random() * 1.5)),
        sessions,
        bounceRate: Number((25 + Math.random() * 15).toFixed(1)),
        revenue: Number((visitors * (15 + Math.random() * 25)).toFixed(2)),
        conversions: Math.floor(sessions * (0.02 + Math.random() * 0.03)),
        avgSessionDuration: Number((180 + Math.random() * 240).toFixed(0)),
      });
    }
    return data;
  };

  const trafficData = useMemo(() => {
    const daysMap = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 };
    return generateTrafficData(
      daysMap[selectedTimeRange as keyof typeof daysMap]
    );
  }, [selectedTimeRange]);

  // Static data for reports and audiences (doesn't change)
  const staticSourceData: SourceData[] = [
    { name: "Organic Search", value: 45.2, color: "#4F46E5", change: 12.3 },
    { name: "Direct Traffic", value: 28.7, color: "#059669", change: 8.7 },
    { name: "Social Media", value: 15.3, color: "#DC2626", change: -2.4 },
    { name: "Paid Search", value: 7.8, color: "#7C3AED", change: 15.6 },
    { name: "Email Marketing", value: 3.0, color: "#EA580C", change: 5.2 },
  ];

  const staticDeviceData: DeviceData[] = [
    { name: "Desktop", visitors: 8234, percentage: 52.3, revenue: 125420 },
    { name: "Mobile", visitors: 5891, percentage: 37.4, revenue: 89650 },
    { name: "Tablet", visitors: 1623, percentage: 10.3, revenue: 23890 },
  ];

  const staticGeographicData: GeographicData[] = [
    { country: "United States", visitors: 5234, revenue: 78540, flag: "🇺🇸" },
    { country: "United Kingdom", visitors: 3421, revenue: 52340, flag: "🇬🇧" },
    { country: "Germany", visitors: 2897, revenue: 43200, flag: "🇩🇪" },
    { country: "France", visitors: 2156, revenue: 32890, flag: "🇫🇷" },
    { country: "Canada", visitors: 1876, revenue: 28450, flag: "🇨🇦" },
  ];

  const staticAudienceData: AudienceData[] = [
    { age: "18-24", users: 2340, sessions: 3421, bounceRate: 32.1 },
    { age: "25-34", users: 4567, sessions: 6789, bounceRate: 28.4 },
    { age: "35-44", users: 3890, sessions: 5234, bounceRate: 35.7 },
    { age: "45-54", users: 2134, sessions: 2987, bounceRate: 41.2 },
    { age: "55-64", users: 1456, sessions: 1876, bounceRate: 45.8 },
    { age: "65+", users: 987, sessions: 1234, bounceRate: 52.3 },
  ];

  // Generate static traffic data for reports (doesn't change)
  const staticReportsData = useMemo(() => {
    const data: TrafficData[] = [];
    const baseDate = new Date("2025-05-31");

    for (let i = 29; i >= 0; i--) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i);

      const visitors = Math.floor(1200 + Math.sin(i * 0.2) * 400 + i * 30);
      const sessions = Math.floor(visitors * 0.85);

      data.push({
        date: date.toISOString().split("T")[0],
        visitors,
        pageViews: Math.floor(visitors * (2.5 + Math.sin(i * 0.15) * 0.5)),
        sessions,
        bounceRate: Number((25 + Math.sin(i * 0.3) * 8).toFixed(1)),
        revenue: Number((visitors * (15 + Math.sin(i * 0.25) * 10)).toFixed(2)),
        conversions: Math.floor(sessions * (0.02 + Math.sin(i * 0.1) * 0.01)),
        avgSessionDuration: Number((180 + Math.sin(i * 0.2) * 60).toFixed(0)),
      });
    }
    return data;
  }, []); // Empty dependency array means this never changes

  const kpiMetrics: KPIMetric[] = [
    {
      title: "Total Visitors",
      value: trafficData
        .reduce((sum, day) => sum + day.visitors, 0)
        .toLocaleString(),
      change: 15.3,
      icon: <Users className="w-6 h-6" />,
      trend: "up",
      target: "50K",
    },
    {
      title: "Revenue",
      value: `${trafficData
        .reduce((sum, day) => sum + day.revenue, 0)
        .toLocaleString()}`,
      change: 22.8,
      icon: <DollarSign className="w-6 h-6" />,
      trend: "up",
      target: "$150K",
    },
    {
      title: "Conversion Rate",
      value: `${(
        (trafficData.reduce((sum, day) => sum + day.conversions, 0) /
          trafficData.reduce((sum, day) => sum + day.sessions, 0)) *
        100
      ).toFixed(2)}%`,
      change: 8.4,
      icon: <ShoppingCart className="w-6 h-6" />,
      trend: "up",
      target: "4.5%",
    },
    {
      title: "Page Load Speed",
      value: "1.2s",
      change: -12.5,
      icon: <Zap className="w-6 h-6" />,
      trend: "up",
      target: "<1s",
    },
  ];

  const timeRanges = [
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 30 Days", value: "30d" },
    { label: "Last 90 Days", value: "90d" },

  ];

  const notifications = [
    {
      id: 1,
      title: "Traffic spike detected",
      message: "40% increase in organic traffic",
      time: "2 minutes ago",
      type: "success",
    },
    {
      id: 2,
      title: "Goal completed",
      message: "Monthly revenue target reached",
      time: "1 hour ago",
      type: "success",
    },
    {
      id: 3,
      title: "Page load warning",
      message: "/checkout page loading slowly",
      time: "3 hours ago",
      type: "warning",
    },
    {
      id: 4,
      title: "New user milestone",
      message: "10,000 unique visitors this month",
      time: "1 day ago",
      type: "info",
    },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const handleExport = () => {
    const csvContent = [
      ["Date", "Visitors", "Page Views", "Sessions", "Revenue", "Conversions"],
      ...trafficData.map((row) => [
        row.date,
        row.visitors,
        row.pageViews,
        row.sessions,
        row.revenue,
        row.conversions,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${selectedTimeRange}-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-100 backdrop-blur-sm">
          <p className="font-semibold text-gray-900 mb-2">{`${new Date(
            label
          ).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}`}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              style={{ color: entry.color }}
              className="text-sm font-medium"
            >
              {`${entry.name}: ${
                typeof entry.value === "number"
                  ? entry.value.toLocaleString()
                  : entry.value
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Real-time View Component
  const RealtimeView = () => (
    <div className="space-y-8">
      {/* Real-time Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-green-600" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-700">
              {realtimeData.activeUsers.toLocaleString()}
            </div>
            <div className="text-green-600 font-medium">
              Active Users Right Now
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-8 h-8 text-blue-600" />
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-700">
              {realtimeData.pageViews.toLocaleString()}
            </div>
            <div className="text-blue-600 font-medium">
              Page Views (Last 30 min)
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <Timer className="w-8 h-8 text-purple-600" />
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-700">3.4s</div>
            <div className="text-purple-600 font-medium">
              Avg. Page Load Time
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Activity Feed */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Live Activity Feed
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {realtimeData.recentEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    event.event === "Purchase"
                      ? "bg-green-500"
                      : event.event === "Sign Up"
                      ? "bg-blue-500"
                      : event.event === "Download"
                      ? "bg-purple-500"
                      : "bg-gray-400"
                  } animate-pulse`}
                ></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{event.event}</div>
                  <div className="text-sm text-gray-600">{event.location}</div>
                </div>
                <div className="text-xs text-gray-500">{event.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Active Pages */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Top Active Pages
          </h3>
          <div className="space-y-4">
            {realtimeData.topPages.map((page, index) => (
              <div
                key={page.page}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">{page.page}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600 font-medium">
                    {page.users} users
                  </span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Reports View Component
  const ReportsView = () => (
    <div className="space-y-8">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Traffic Report",
              description: "Detailed visitor analytics",
              icon: <BarChart3 className="w-6 h-6" />,
              color: "blue",
            },
            {
              title: "Revenue Report",
              description: "Financial performance metrics",
              icon: <DollarSign className="w-6 h-6" />,
              color: "green",
            },
            {
              title: "Conversion Report",
              description: "Goal completion analysis",
              icon: <Target className="w-6 h-6" />,
              color: "purple",
            },
          ].map((report) => (
            <div
              key={report.title}
              className={`bg-gradient-to-r from-${report.color}-50 to-${report.color}-100 p-6 rounded-xl hover:shadow-md transition-all cursor-pointer`}
            >
              <div className={`text-${report.color}-600 mb-4`}>
                {report.icon}
              </div>
              <h3
                className={`text-lg font-semibold text-${report.color}-900 mb-2`}
              >
                {report.title}
              </h3>
              <p className={`text-${report.color}-700 text-sm`}>
                {report.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Traffic Sources Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={staticSourceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Monthly Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={staticReportsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#059669"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Performance Table */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Detailed Performance Metrics
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Metric
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Current Period
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Previous Period
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Change
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                {
                  metric: "Total Sessions",
                  current: "45,230",
                  previous: "39,120",
                  change: "+15.6%",
                  trend: "up",
                },
                {
                  metric: "Average Session Duration",
                  current: "4:32",
                  previous: "4:18",
                  change: "+5.4%",
                  trend: "up",
                },
                {
                  metric: "Pages per Session",
                  current: "3.2",
                  previous: "2.8",
                  change: "+14.3%",
                  trend: "up",
                },
                {
                  metric: "Bounce Rate",
                  current: "28.4%",
                  previous: "32.1%",
                  change: "-11.5%",
                  trend: "up",
                },
                {
                  metric: "New Users",
                  current: "12,450",
                  previous: "10,890",
                  change: "+14.3%",
                  trend: "up",
                },
              ].map((row, index) => (
                <tr key={row.metric} className="hover:bg-gray-50/50 cursor-pointer">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {row.metric}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{row.current}</td>
                  <td className="px-6 py-4 text-gray-500">{row.previous}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`flex items-center ${
                        row.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {row.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {row.change}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        row.trend === "up"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {row.trend === "up" ? "Excellent" : "Needs Attention"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Audience View Component
  const AudienceView = () => (
    <div className="space-y-8">
      {/* Audience Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Age Demographics
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={staticAudienceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="age" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip />
              <Bar dataKey="users" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            User Behavior by Age
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={staticAudienceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="age" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bounceRate"
                stroke="#DC2626"
                strokeWidth={3}
                name="Bounce Rate %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Interests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            User Interests
          </h3>
          <div className="space-y-4">
            {[
              { interest: "Technology", percentage: 45, users: 12450 },
              { interest: "Business", percentage: 32, users: 8890 },
              { interest: "Marketing", percentage: 28, users: 7650 },
              { interest: "Design", percentage: 22, users: 5980 },
              { interest: "Analytics", percentage: 18, users: 4870 },
            ].map((item) => (
              <div key={item.interest} className="space-y-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">
                    {item.interest}
                  </span>
                  <span className="text-gray-600">
                    {item.users.toLocaleString()} users
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500">
                  {item.percentage}% of total audience
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            New vs Returning Users
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "New Users", value: 68.4, color: "#4F46E5" },
                  { name: "Returning Users", value: 31.6, color: "#059669" },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                <Cell fill="#4F46E5" />
                <Cell fill="#059669" />
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">68.4%</div>
              <div className="text-blue-600 text-sm">New Users</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">31.6%</div>
              <div className="text-green-600 text-sm">Returning Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Audience Table */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Audience Segments
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Age Group
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Users
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Sessions
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Bounce Rate
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Avg. Session Duration
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Pages/Session
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staticAudienceData.map((row) => (
                <tr key={row.age} className="hover:bg-gray-50/50 cursor-pointer">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {row.age}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {row.users.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {row.sessions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        row.bounceRate < 35
                          ? "bg-green-100 text-green-700"
                          : row.bounceRate < 45
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {row.bounceRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {Math.floor(Math.random() * 300 + 180)}s
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {(Math.random() * 2 + 2).toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 mx-auto mb-6"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-600 absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-800 text-xl font-semibold">
              Loading Analytics Dashboard
            </p>
            <p className="text-gray-600">
              Fetching your latest performance data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "realtime":
        return <RealtimeView />;
      case "reports":
        return <ReportsView />;
      case "audiences":
        return <AudienceView />;

      default:
        return (
          <>
            {/* Enhanced KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {kpiMetrics.map((metric, index) => (
                <div
                  key={metric.title}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-gray-900/5 border border-gray-200/50 hover:shadow-xl hover:shadow-gray-900/10 transition-all duration-300 group cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                      <div className="text-blue-600">{metric.icon}</div>
                    </div>
                    <div
                      className={`flex items-center text-sm font-semibold px-2 py-1 rounded-full ${
                        metric.trend === "up"
                          ? "text-green-700 bg-green-100"
                          : "text-red-700 bg-red-100"
                      }`}
                    >
                      {metric.trend === "up" ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(metric.change)}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-gray-900">
                      {metric.value}
                    </h3>
                    <p className="text-gray-600 font-medium">{metric.title}</p>
                    {metric.target && (
                      <p className="text-xs text-gray-500">
                        Target: {metric.target}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Advanced Visitors & Revenue Chart */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-gray-900/5 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Visitors & Revenue Trend
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Daily performance overview
                    </p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={trafficData}>
                    <defs>
                      <linearGradient
                        id="colorVisitors"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#4F46E5"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#4F46E5"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      stroke="#6B7280"
                      fontSize={12}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <YAxis yAxisId="left" stroke="#6B7280" fontSize={12} />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#6B7280"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="visitors"
                      stroke="#4F46E5"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorVisitors)"
                      name="Visitors"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#059669"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      name="Revenue ($)"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Conversion Funnel */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-gray-900/5 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Conversion Funnel
                    </h3>
                    <p className="text-gray-600 text-sm">
                      User journey analysis
                    </p>
                  </div>
                  <ShoppingCart className="w-6 h-6 text-blue-500" />
                </div>
                <div className="space-y-4">
                  {[
                    {
                      stage: "Visitors",
                      count: 15420,
                      percentage: 100,
                      color: "bg-blue-500",
                    },
                    {
                      stage: "Page Views",
                      count: 12890,
                      percentage: 83.6,
                      color: "bg-indigo-500",
                    },
                    {
                      stage: "Add to Cart",
                      count: 3240,
                      percentage: 21.0,
                      color: "bg-purple-500",
                    },
                    {
                      stage: "Checkout",
                      count: 1680,
                      percentage: 10.9,
                      color: "bg-pink-500",
                    },
                    {
                      stage: "Purchase",
                      count: 892,
                      percentage: 5.8,
                      color: "bg-green-500",
                    },
                  ].map((stage, index) => (
                    <div key={stage.stage} className="space-y-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {stage.stage}
                        </span>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {stage.count.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {stage.percentage}%
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`${stage.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${stage.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Traffic Sources & Geographic Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Enhanced Traffic Sources */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-gray-900/5 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Traffic Sources
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Channel performance breakdown
                    </p>
                  </div>
                  <Target className="w-6 h-6 text-purple-500" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={staticSourceData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={false}
                      >
                        {staticSourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {staticSourceData.map((source, index) => (
                      <div
                        key={source.name}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: source.color }}
                          ></div>
                          <span className="font-medium text-gray-900 text-sm">
                            {source.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {source.value}%
                          </div>
                          <div
                            className={`text-xs flex items-center ${
                              source.change > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {source.change > 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {Math.abs(source.change)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Geographic Performance */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-gray-900/5 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Top Countries
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Geographic performance
                    </p>
                  </div>
                  <Globe className="w-6 h-6 text-blue-500" />
                </div>
                <div className="space-y-4">
                  {staticGeographicData.map((country, index) => (
                    <div
                      key={country.country}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{country.flag}</span>
                        <div>
                          <div className="font-medium text-gray-900">
                            {country.country}
                          </div>
                          <div className="text-sm text-gray-600">
                            {country.visitors.toLocaleString()} visitors
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          ${country.revenue.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Device Analytics & Real-time Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Enhanced Device Breakdown */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-gray-900/5 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Device Analytics
                    </h3>
                    <p className="text-gray-600 text-sm">
                      User device preferences
                    </p>
                  </div>
                  <Monitor className="w-6 h-6 text-indigo-500" />
                </div>
                <div className="space-y-6">
                  {staticDeviceData.map((device, index) => (
                    <div key={device.name} className="space-y-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {device.name === "Desktop" && (
                            <Monitor className="w-5 h-5 text-gray-600" />
                          )}
                          {device.name === "Mobile" && (
                            <Smartphone className="w-5 h-5 text-gray-600" />
                          )}
                          {device.name === "Tablet" && (
                            <Tablet className="w-5 h-5 text-gray-600" />
                          )}
                          <span className="font-medium text-gray-900">
                            {device.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {device.visitors.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            ${device.revenue.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Traffic Share</span>
                          <span className="font-medium">
                            {device.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${device.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time Activity */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-gray-900/5 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-green-700">
                        {realtimeData.activeUsers.toLocaleString()}
                      </div>
                      <div className="text-green-600 text-sm">Active Users</div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-blue-700">
                        {realtimeData.pageViews.toLocaleString()}
                      </div>
                      <div className="text-blue-600 text-sm">Page Views</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Top Active Pages
                    </h4>
                    <div className="space-y-3">
                      {realtimeData.topPages.slice(0, 3).map((page, index) => (
                        <div
                          key={page.page}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <span className="font-medium text-gray-900 text-sm">
                            {page.page}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {page.users} users
                            </span>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Top Pages Table */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-gray-900/5 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Page Performance
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Detailed page analytics and metrics
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Page URL
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Page Views
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Unique Views
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Avg. Time
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Bounce Rate
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      {
                        page: "/dashboard",
                        views: 8234,
                        unique: 6123,
                        time: "4:32",
                        bounce: "22.4%",
                        revenue: 12540,
                        trend: "up",
                      },
                      {
                        page: "/products/analytics",
                        views: 6567,
                        unique: 5891,
                        time: "5:18",
                        bounce: "18.7%",
                        revenue: 18920,
                        trend: "up",
                      },
                      {
                        page: "/pricing",
                        views: 5891,
                        unique: 4234,
                        time: "3:45",
                        bounce: "35.2%",
                        revenue: 8760,
                        trend: "down",
                      },
                      {
                        page: "/features",
                        views: 4345,
                        unique: 3987,
                        time: "2:56",
                        bounce: "42.1%",
                        revenue: 5430,
                        trend: "up",
                      },
                      {
                        page: "/contact",
                        views: 3456,
                        unique: 3156,
                        time: "2:12",
                        bounce: "48.5%",
                        revenue: 2840,
                        trend: "down",
                      },
                      {
                        page: "/blog/analytics-guide",
                        views: 2987,
                        unique: 2765,
                        time: "6:23",
                        bounce: "25.8%",
                        revenue: 4320,
                        trend: "up",
                      },
                    ].map((row, index) => (
                      <tr
                        key={row.page}
                        className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {row.page}
                            </span>
                            {row.trend === "up" ? (
                              <TrendingUp className="w-4 h-4 text-green-500" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700 font-medium">
                          {row.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {row.unique.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{row.time}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              parseFloat(row.bounce) < 30
                                ? "bg-green-100 text-green-700"
                                : parseFloat(row.bounce) < 40
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {row.bounce}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          ${row.revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-[Roboto]">
      {/* Enhanced Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-lg shadow-gray-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Analytics Enterprise
                </span>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-1">
                {[
                  { name: "Dashboard", id: "dashboard" },
                  { name: "Real-time", id: "realtime" },
                  { name: "Reports", id: "reports" },
                  { name: "Audiences", id: "audiences" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-700 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Real-time indicator */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 text-sm font-medium">Live</span>
              </div>

              <button
                className="md:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg cursor-pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200/50">
          <div className="px-4 pt-4 pb-4 space-y-1">
            {[
              { name: "Dashboard", id: "dashboard" },
              { name: "Real-time", id: "realtime" },
              { name: "Reports", id: "reports" },
              { name: "Audiences", id: "audiences" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          
          {/* Menu Content */}
          <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 mx-4 w-full max-w-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Navigation</h3>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-2">
                {[
                  { name: "Dashboard", id: "dashboard", icon: <BarChart3 className="w-5 h-5" /> },
                  { name: "Real-time", id: "realtime", icon: <Activity className="w-5 h-5" /> },
                  { name: "Reports", id: "reports", icon: <FileText className="w-5 h-5" /> },
                  { name: "Audiences", id: "audiences", icon: <Users className="w-5 h-5" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-700 shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <div className={activeTab === tab.id ? "text-blue-600" : "text-gray-400"}>
                      {tab.icon}
                    </div>
                    <span>{tab.name}</span>
                    {activeTab === tab.id && (
                      <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">
                {activeTab === "realtime"
                  ? "Real-time Analytics"
                  : activeTab === "reports"
                  ? "Analytics Reports"
                  : activeTab === "audiences"
                  ? "Audience Analytics"
                  : activeTab === "goals"
                  ? "Goals & Conversions"
                  : "Analytics Dashboard"}
              </h1>
              <p className="text-gray-600 text-lg">
                {activeTab === "realtime"
                  ? "Live user activity and real-time performance metrics"
                  : activeTab === "reports"
                  ? "Comprehensive performance insights and detailed analytics"
                  : activeTab === "audiences"
                  ? "Understand your visitors' demographics and behavior patterns"
                  : activeTab === "goals"
                  ? "Track conversions and goal completions"
                  : "Real-time insights and comprehensive performance analytics"}
              </p>
              {activeTab === "dashboard" && (
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">
                      {realtimeData.activeUsers.toLocaleString()} active users
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              {activeTab !== "realtime" && (
                <select
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm font-medium cursor-pointer"
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                >
                  {timeRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              )}

              {activeTab !== "realtime" && (
                <button
                  onClick={handleExport}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl font-medium cursor-pointer"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </button>
              )}

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center bg-white shadow-sm font-medium disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                {isRefreshing ? "Refreshing..." : activeTab === "realtime" ? "Refresh Live Data" : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        {/* Render Content Based on Active Tab */}
        {renderContent()}
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Analytics Enterprise
                </span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
                Enterprise-grade analytics platform trusted by Fortune 500
                companies worldwide. Get deep insights into your website
                performance with our advanced tracking and AI-powered reporting
                tools.
              </p>
              <div className="flex space-x-4">
                {[Share2, Search, Globe, Mail].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                Analytics
              </h3>
              <ul className="space-y-3">
                {[
                  "Real-time Dashboard",
                  "Custom Reports",
                  "Goal Tracking",
                  "A/B Testing",
                  "Heatmaps",
                ].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm cursor-pointer">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                Enterprise
              </h3>
              <ul className="space-y-3">
                {[
                  "API Access",
                  "Custom Integrations",
                  "White-label Solution",
                  "Advanced Security",
                  "Priority Support",
                ].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm cursor-pointer">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                {[
                  "Documentation",
                  "API Reference",
                  "24/7 Support",
                  "Community",
                  "Status Page",
                ].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm cursor-pointer">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col lg:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm text-center">
              © 2025 Analytics Enterprise. All rights reserved. SOC 2 Type II
              Certified.
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");
        
        /* Hide scrollbars for webkit browsers (Chrome, Safari, Edge) */
        ::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbars for Firefox */
        * {
          scrollbar-width: none;
        }
        
        /* Hide scrollbars for IE and Edge Legacy */
        * {
          -ms-overflow-style: none;
        }
        
        /* Ensure scrolling still works */
        html, body {
          overflow-x: hidden;
        }
        
        /* Hide scrollbars in specific containers while maintaining scroll */
        .overflow-y-auto,
        .overflow-x-auto,
        .overflow-auto {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .overflow-y-auto::-webkit-scrollbar,
        .overflow-x-auto::-webkit-scrollbar,
        .overflow-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;


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