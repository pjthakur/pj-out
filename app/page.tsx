"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Poppins } from 'next/font/google';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});
import { 
  MdTrendingUp, MdShoppingCart, MdPeople, MdGpsFixed, MdSearch, MdFilterList, MdNotifications, MdPerson, MdMenu, MdClose, MdExpandMore,
  MdAttachMoney, MdVisibility, MdCheckCircle, MdAccessTime, MdCancel, MdDarkMode, MdLightMode, MdChevronLeft,
  MdChevronRight, MdDownload, MdRefresh, MdBarChart, MdError, MdFlashOn, MdCheck
} from 'react-icons/md';
interface SalesDataPoint {
  date: string;
  sales: number;
  revenue: number;
}
interface Transaction {
  id: number;
  product: string;
  category: string;
  revenue: number;
  status: 'completed' | 'pending' | 'processing' | 'failed';
  date: string;
}
interface Metric {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}
interface Notification { 
  id: number;
  message: string;
  timestamp: Date;
  type: 'success' | 'info' | 'warning';
  isRead: boolean;
}
interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}
interface StatusConfig {
  icon: React.ReactElement;
  badge: string;
  label: string;
}
interface SalesDataCollection {
  [key: string]: SalesDataPoint[];
}
interface TransactionStatusProps {
  status: Transaction['status'];
}
interface NavBarProps {
  isDark: boolean;
  toggleTheme: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
  onProfileClick: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  onNotificationClick: () => void;
  unreadNotificationCount: number;
  showNotifications: boolean;
}
interface MetricCardProps {
  metric: Metric;
  isDark: boolean;
}
interface ChartCardProps {
  title: string;   
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  isDark: boolean;
  isLoading: boolean;
  onExport?: () => void;
}
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isDark: boolean;
}
const ProfileModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  isDark: boolean;
}> = ({ isOpen, onClose, userProfile, onSave, isDark }) => {
  const [name, setName] = useState(userProfile.name || 'John');
  const [email, setEmail] = useState(userProfile.email || 'john@businesshb.com');
  useEffect(() => {
    setName(userProfile.name || '');
    setEmail(userProfile.email || '');
  }, [userProfile]);
  useEffect(() => {
          if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
              document.body.style.overflow = 'hidden';
      } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
              }
      }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  const handleSave = () => {
    if (name && email && name.trim() && email.trim()) {
      onSave({ ...userProfile, name: name.trim(), email: email.trim() });
      onClose();
    }
  };
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  if (!isOpen) return null;
  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-lg z-[9999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      style={{ position: 'fixed', zIndex: 9999 }}
    >
      <div 
        className={`
          w-full max-w-lg mx-auto
          ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} 
          backdrop-blur-2xl rounded-3xl shadow-2xl
          border ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}
          transform transition-all duration-300 ease-out scale-100
          ring-1 ring-black/5
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center p-4 sm:p-8 pb-4 sm:pb-6">
          <div className="flex flex-col items-center space-y-3 sm:space-y-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
              <MdPerson className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
            <div>
              <h3 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                Edit Profile
              </h3>
              <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Update your personal information
              </p>
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-8 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
          <div className="space-y-1.5 sm:space-y-2">
            <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Full Name
            </label>
            <div className="relative group">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`
                  w-full px-3 sm:px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 text-sm sm:text-base
                  ${isDark 
                    ? 'bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-blue-500/50 focus:bg-gray-800' 
                    : 'bg-gray-50/50 border-gray-200/50 text-gray-900 placeholder-gray-500 focus:border-blue-500/50 focus:bg-white'
                  }
                  focus:outline-none focus:ring-4 focus:ring-blue-500/10
                  group-hover:border-gray-300
                `}
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Email Address
            </label>
            <div className="relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`
                  w-full px-3 sm:px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 text-sm sm:text-base
                  ${isDark 
                    ? 'bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-blue-500/50 focus:bg-gray-800' 
                    : 'bg-gray-50/50 border-gray-200/50 text-gray-900 placeholder-gray-500 focus:border-blue-500/50 focus:bg-white'
                  }
                  focus:outline-none focus:ring-4 focus:ring-blue-500/10
                  group-hover:border-gray-300
                `}
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2 sm:space-x-3 p-4 sm:p-8 pt-4 sm:pt-8">
          <button
            onClick={onClose}
            className={`
              px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base transition-all duration-200 cursor-pointer
              ${isDark 
                ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
              }
              hover:scale-105 active:scale-95
            `}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name || !email || !name.trim() || !email.trim()}
            className="
              px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 
              hover:from-blue-700 hover:to-indigo-700
              disabled:from-gray-400 disabled:to-gray-500
              text-white rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base
              transition-all duration-200 cursor-pointer
              hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed
              shadow-lg hover:shadow-xl disabled:shadow-none
              ring-2 ring-blue-500/20 hover:ring-blue-500/30
              flex items-center justify-center
            "
          >
            <MdCheck className="h-4 w-4 sm:h-5 sm:w-5 sm:hidden" />
            <span className="hidden sm:inline">Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
const TransactionStatus: React.FC<TransactionStatusProps> = ({ status }) => {
  const getStatusConfig = (status: Transaction['status']): StatusConfig => {
    switch (status) {
      case 'completed': 
        return {
          icon: <MdCheckCircle className="h-4 w-4 text-emerald-500" />,
          badge: "px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800",
          label: "Completed"
        };
      case 'pending': 
        return {
          icon: <MdAccessTime className="h-4 w-4 text-amber-500" />,
          badge: "px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800",
          label: "Pending"
        };
      case 'processing': 
        return {
          icon: <MdFlashOn className="h-4 w-4 text-blue-500" />,
          badge: "px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800",
          label: "Processing"
        };
      case 'failed': 
        return {
          icon: <MdCancel className="h-4 w-4 text-red-500" />,
          badge: "px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800",
          label: "Failed"
        };
      default: 
        return {
          icon: <MdError className="h-4 w-4 text-gray-500" />,
          badge: "px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800",
          label: "Unknown"
        };
    }
  };
  const config = getStatusConfig(status);
  return (
    <div className="flex items-center space-x-2">
      {config.icon}
      <span className={config.badge}>
        {config.label}
      </span>
    </div>
  );
};
const NavBar: React.FC<NavBarProps> = ({ 
  isDark, 
  toggleTheme, 
  onRefresh, 
  isRefreshing, 
  userProfile, 
  onProfileUpdate, 
  onProfileClick, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen,
  onNotificationClick,
  unreadNotificationCount,
  showNotifications
}) => {
  return (
    <nav className={`
      ${isDark ? 'bg-gray-900/80' : 'bg-white/80'} 
      backdrop-blur-xl border-b 
      ${isDark ? 'border-gray-700/50' : 'border-slate-200/50'} 
      sticky top-0 z-50 transition-all duration-300 shadow-lg
      ${isMobileMenuOpen ? 'blur-sm' : ''}
      ${showNotifications ? 'md:blur-none blur-sm' : ''}
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <MdTrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="hidden md:block">
              <h1 className={`text-xl font-bold bg-gradient-to-r ${isDark ? 'from-white to-gray-300' : 'from-slate-800 to-slate-600'} bg-clip-text text-transparent`}>
                BusinessHub
              </h1>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => {
                onRefresh();
              }}
              disabled={isRefreshing}
              className={`p-2 rounded-lg cursor-pointer ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'} transition-all disabled:opacity-50`}
              aria-label="Refresh data"
            >
              <MdRefresh className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg cursor-pointer ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'} transition-all`}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? <MdLightMode className="h-5 w-5" /> : <MdDarkMode className="h-5 w-5" />}
            </button>
            <div className="relative">
              <button
                onClick={onNotificationClick}
                className={`p-2 rounded-lg cursor-pointer ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'} transition-all relative`}
                aria-label="View notifications"
              >
                <MdNotifications className="h-5 w-5" />
                {unreadNotificationCount > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </button>
            </div>
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={onProfileClick}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <MdPerson className="h-4 w-4 text-white" />
              </div>
              <div className="hidden lg:block">
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'} group-hover:text-blue-600 transition-colors`}>
                  {userProfile.name}
                </p>
              </div>
            </div>
          </div>
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={onNotificationClick}
              className={`p-2 rounded-lg cursor-pointer ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'} transition-all relative`}
              aria-label="View notifications"
            >
              <MdNotifications className="h-5 w-5" />
              {unreadNotificationCount > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg cursor-pointer ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'} transition-all`}
            >
              {isMobileMenuOpen ? <MdClose className="h-5 w-5" /> : <MdMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
const MetricCard: React.FC<MetricCardProps> = ({ metric, isDark }) => (
  <div className={`bg-gradient-to-br ${isDark ? 'from-gray-800 to-gray-900' : metric.bgColor} rounded-2xl border ${isDark ? 'border-gray-700/50' : 'border-white/50'} p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-lg transition-all duration-300`}>
        <metric.icon className="h-6 w-6 text-white" />
      </div>
      <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
        {metric.change}
      </span>
    </div>
    <h3 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-slate-600'} mb-1`}>{metric.title}</h3>
    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} transition-all duration-300`}>{metric.value}</p>
  </div>
);
const ChartCard: React.FC<ChartCardProps> = ({ title, icon: Icon, children, isDark, isLoading, onExport }) => (
  <div className={`${isDark ? 'bg-gray-800/70' : 'bg-white/70'} backdrop-blur-sm rounded-2xl border ${isDark ? 'border-gray-700/50' : 'border-slate-200/50'} p-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <Icon className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-slate-500'}`} />
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{title}</h3>
      </div>
      {onExport && (
        <button
          onClick={onExport}
            className={`p-2 rounded-lg cursor-pointer ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'} transition-all`}
          aria-label="Export chart data"
        >
          <MdDownload className="h-4 w-4" />
        </button>
      )}
    </div>
    {isLoading ? (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    ) : (
      <div className="transition-opacity duration-500">
        {children}
      </div>
    )}
  </div>
  );
const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, isDark }) => {
  const pages: number[] = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return (
    <div className="flex items-center justify-center sm:justify-between px-6 py-4">
      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-600'} hidden sm:block`}>
        Showing page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-all ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : `cursor-pointer ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-slate-600'}`}`}
        >
          <MdChevronLeft className="h-4 w-4" />
        </button>
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              page === currentPage
                ? 'bg-blue-600 text-white shadow-lg'
                : isDark 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-slate-600 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-all ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : `cursor-pointer ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-slate-600'}`}`}
        >
          <MdChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
const BusinessDashboard: React.FC = () => {
  const [selectedDateRange, setSelectedDateRange] = useState<string>('7d');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [salesData, setSalesData] = useState<SalesDataCollection>({});
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'John',
    email: 'john@businesshb.com'
  });
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: "New order received", timestamp: new Date(Date.now() - 2 * 60 * 1000), type: "success", isRead: false },
    { id: 2, message: "Payment processed", timestamp: new Date(Date.now() - 5 * 60 * 1000), type: "info", isRead: false },
    { id: 3, message: "System update available", timestamp: new Date(Date.now() - 60 * 60 * 1000), type: "warning", isRead: false },
    { id: 4, message: "New customer registration", timestamp: new Date(Date.now() - 10 * 60 * 1000), type: "info", isRead: false },
    { id: 5, message: "Monthly report is ready", timestamp: new Date(Date.now() - 15 * 60 * 1000), type: "success", isRead: false }
  ]);
  const itemsPerPage = 5;
  const unreadCount = notifications.filter(notification => !notification.isRead).length;
  const getRelativeTime = (timestamp: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - timestamp.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };
  const handleNotificationClick = () => {
    if (!showNotifications && unreadCount > 0) {
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, isRead: true }))
      );
    }
    setShowNotifications(!showNotifications);
  };
  const fetchData = useCallback(async (dateRange: string, showRefresh: boolean = false): Promise<void> => {
    if (showRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    await new Promise(resolve => setTimeout(resolve, 800));
    const mockSalesData: SalesDataCollection = {
      '7d': [
        { date: 'Mon', sales: 4200, revenue: 8400 },
        { date: 'Tue', sales: 3800, revenue: 7600 },
        { date: 'Wed', sales: 5200, revenue: 10400 },
        { date: 'Thu', sales: 4600, revenue: 9200 },
        { date: 'Fri', sales: 6800, revenue: 13600 },
        { date: 'Sat', sales: 5900, revenue: 11800 },
        { date: 'Sun', sales: 4300, revenue: 8600 }
      ],
      '30d': [
        { date: 'Week 1', sales: 28000, revenue: 56000 },
        { date: 'Week 2', sales: 32000, revenue: 64000 },
        { date: 'Week 3', sales: 35000, revenue: 70000 },
        { date: 'Week 4', sales: 41000, revenue: 82000 }
      ],
      '90d': [
        { date: 'Month 1', sales: 120000, revenue: 240000 },
        { date: 'Month 2', sales: 135000, revenue: 270000 },
        { date: 'Month 3', sales: 148000, revenue: 296000 }
      ]
    };
    const mockTransactions: Transaction[] = [
      { id: 1, product: 'Premium Analytics Suite', category: 'Software', revenue: 2499, status: 'completed', date: '2025-06-26' },
      { id: 2, product: 'Marketing Dashboard Pro', category: 'SaaS', revenue: 899, status: 'pending', date: '2025-06-26' },
      { id: 3, product: 'Data Visualization Tool', category: 'Software', revenue: 1299, status: 'completed', date: '2025-06-25' },
      { id: 4, product: 'Business Intelligence Pack', category: 'Enterprise', revenue: 4999, status: 'failed', date: '2025-06-25' },
      { id: 5, product: 'Cloud Storage Pro', category: 'Storage', revenue: 199, status: 'completed', date: '2025-06-24' },
      { id: 6, product: 'AI Assistant Premium', category: 'AI/ML', revenue: 799, status: 'processing', date: '2025-06-24' },
      { id: 7, product: 'Security Shield Enterprise', category: 'Security', revenue: 3499, status: 'completed', date: '2025-06-23' },
      { id: 8, product: 'Workflow Automation', category: 'Productivity', revenue: 1599, status: 'completed', date: '2025-06-23' },
      { id: 9, product: 'Customer Support Suite', category: 'Support', revenue: 899, status: 'pending', date: '2025-06-22' },
      { id: 10, product: 'Advanced Analytics Pro', category: 'Analytics', revenue: 1999, status: 'completed', date: '2025-06-22' },
      { id: 11, product: 'Team Collaboration Hub', category: 'Productivity', revenue: 599, status: 'processing', date: '2025-06-21' },
      { id: 12, product: 'Enterprise Security Pack', category: 'Security', revenue: 5999, status: 'completed', date: '2025-06-21' }
    ];
    setSalesData(mockSalesData);
    setTransactions(mockTransactions);
    setIsLoading(false);
    setIsRefreshing(false);
  }, []);
  useEffect(() => {
    fetchData(selectedDateRange);
  }, [selectedDateRange, fetchData]);
  useEffect(() => {
    if (isRefreshing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isRefreshing]);
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setUserProfile(parsedProfile);
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    }
  }, []);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);
  useEffect(() => {
    if (showNotifications) {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showNotifications]);
  const [, forceUpdate] = useState({});
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate({});
    }, 60000); 
    return () => clearInterval(interval);
  }, []);
  const handleDateRangeChange = (range: string): void => {
    setSelectedDateRange(range);
    setCurrentPage(1);
  };
  const toggleTheme = (): void => {
    setIsDark(!isDark);
  };
  const handleRefresh = (): void => {
    fetchData(selectedDateRange, true);
    setShowNotifications(false); 
  };
  const handleProfileUpdate = (updatedProfile: UserProfile): void => {
    setUserProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };
  const exportTransactions = (): void => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Product,Category,Revenue,Status,Date\n" +
      filteredTransactions.map(t => 
        `"${t.product}","${t.category}",${t.revenue},"${t.status}","${t.date}"`
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const exportSalesData = (): void => {
    const currentData = salesData[selectedDateRange] || [];
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Date,Sales,Revenue\n" +
      currentData.map(item => 
        `"${item.date}",${item.sales},${item.revenue}`
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales-data-${selectedDateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const exportRevenueData = (): void => {
    const currentData = salesData[selectedDateRange] || [];
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Date,Revenue\n" +
      currentData.map(item => 
        `"${item.date}",${item.revenue}`
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `revenue-data-${selectedDateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const filteredTransactions = useMemo((): Transaction[] => {
    return transactions.filter(transaction => {
      const matchesSearch = transaction.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchTerm, selectedStatus]);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  const getMetricsForDateRange = (dateRange: string): Metric[] => {
    const metricsData = {
      '7d': {
        revenue: { value: '$124,530', change: '+12.5%' },
        orders: { value: '2,847', change: '+8.2%' },
        retention: { value: '94.3%', change: '+2.1%' },
        conversion: { value: '3.8%', change: '+0.5%' }
      },
      '30d': {
        revenue: { value: '$487,250', change: '+18.7%' },
        orders: { value: '11,240', change: '+15.3%' },
        retention: { value: '92.8%', change: '+1.8%' },
        conversion: { value: '4.2%', change: '+0.8%' }
      },
      '90d': {
        revenue: { value: '$1,425,800', change: '+24.1%' },
        orders: { value: '32,150', change: '+22.6%' },
        retention: { value: '91.5%', change: '+3.2%' },
        conversion: { value: '4.7%', change: '+1.2%' }
      }
    };
    const data = metricsData[dateRange as keyof typeof metricsData];
    return [
    {
      title: 'Total Revenue',
        value: data.revenue.value,
        change: data.revenue.change,
        icon: MdAttachMoney,
      color: 'from-blue-600 to-indigo-700',
      bgColor: 'from-blue-50 to-indigo-50'
    },
    {
      title: 'Orders',
        value: data.orders.value,
        change: data.orders.change,
        icon: MdShoppingCart,
      color: 'from-blue-600 to-indigo-700',
      bgColor: 'from-blue-50 to-indigo-50'
    },
    {
      title: 'Customer Retention',
        value: data.retention.value,
        change: data.retention.change,
        icon: MdPeople,
      color: 'from-blue-600 to-indigo-700',
      bgColor: 'from-blue-50 to-indigo-50'
    },
    {
      title: 'Conversion Rate',
        value: data.conversion.value,
        change: data.conversion.change,
        icon: MdGpsFixed,
      color: 'from-blue-600 to-indigo-700',
      bgColor: 'from-blue-50 to-indigo-50'
    }
  ];
  };
  const metrics = getMetricsForDateRange(selectedDateRange);
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'} ${poppins.className}`} style={{
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    }}>
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: transparent;
        }
        html {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        html::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
      `}</style>
      {isRefreshing && (
        <div className="fixed inset-0 backdrop-blur-sm z-[9998] flex items-center justify-center">
          <div className={`${isDark ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-md rounded-2xl border ${isDark ? 'border-gray-700/50' : 'border-slate-200/50'} p-6 shadow-2xl flex items-center space-x-4`}>
            <MdRefresh className="h-6 w-6 text-blue-600 animate-spin" />
            <span className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Refreshing...
            </span>
          </div>
        </div>
      )}
      <NavBar 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        userProfile={userProfile}
        onProfileUpdate={handleProfileUpdate}
        onProfileClick={() => setShowProfileModal(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onNotificationClick={handleNotificationClick}
        unreadNotificationCount={unreadCount}
        showNotifications={showNotifications}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>Dashboard Overview</h2>
          <p className={`${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Monitor your business performance and key metrics</p>
        </div>
        <div className="mb-8">
          <div className={`${isDark ? 'bg-gray-800/70' : 'bg-white/70'} backdrop-blur-sm rounded-2xl border ${isDark ? 'border-gray-700/50' : 'border-slate-200/50'} p-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'} flex-shrink-0`}>Performance Analytics</h3>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-start sm:justify-end">
                <MdFilterList className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-slate-500'} flex-shrink-0`} />
                <div className="relative min-w-0 flex-shrink-0">
                  <select
                    value={selectedDateRange}
                    onChange={(e) => handleDateRangeChange(e.target.value)}
                    className={`
                      appearance-none cursor-pointer w-full min-w-[140px]
                      ${isDark 
                        ? 'bg-gray-700/80 border-gray-600/50 text-white hover:bg-gray-700 focus:bg-gray-700' 
                        : 'bg-white/80 border-slate-300/50 text-slate-700 hover:bg-white focus:bg-white'
                      } 
                      backdrop-blur-sm border rounded-xl px-4 py-2.5 pr-10 
                      text-sm font-medium shadow-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                      transition-all duration-200 ease-out
                      hover:shadow-md hover:scale-[1.02]
                    `}
                  >
                    <option value="7d">Weekly</option>
                    <option value="30d">Monthly</option>
                    <option value="90d">Quarterly</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <MdExpandMore className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-slate-500'} transition-transform duration-200`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={`${selectedDateRange}-${index}`} className="transform transition-all duration-500 ease-out">
              <MetricCard metric={metric} isDark={isDark} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <ChartCard 
            title="Sales Overview" 
            icon={MdVisibility} 
            isDark={isDark} 
            isLoading={isLoading}
            onExport={exportSalesData}
          >
           <ResponsiveContainer width="100%" height={320}>
             <AreaChart data={salesData[selectedDateRange] || []}>
               <defs>
                 <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                   <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e2e8f0'} />
               <XAxis 
                 dataKey="date" 
                 stroke={isDark ? '#9ca3af' : '#64748b'}
                 fontSize={12}
               />
               <YAxis 
                 stroke={isDark ? '#9ca3af' : '#64748b'}
                 fontSize={12}
               />
               <Tooltip 
                 contentStyle={{
                   backgroundColor: isDark ? '#1f2937' : '#ffffff',
                   border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
                   borderRadius: '12px',
                   color: isDark ? '#ffffff' : '#1f2937',
                   fontSize: '14px',
                   fontFamily: 'Poppins, system-ui, -apple-system, sans-serif',
                   boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                 }}
               />
               <Area
                 type="monotone"
                 dataKey="sales"
                 stroke="#3b82f6"
                 strokeWidth={2}
                 fill="url(#salesGradient)"
               />
             </AreaChart>
           </ResponsiveContainer>
         </ChartCard>
         <ChartCard 
           title="Revenue Trends" 
             icon={MdBarChart} 
           isDark={isDark} 
           isLoading={isLoading}
           onExport={exportRevenueData}
         >
           <ResponsiveContainer width="100%" height={320}>
             <LineChart data={salesData[selectedDateRange] || []}>
               <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e2e8f0'} />
               <XAxis 
                 dataKey="date" 
                 stroke={isDark ? '#9ca3af' : '#64748b'}
                 fontSize={12}
                 fontFamily="Poppins, system-ui, -apple-system, sans-serif"
               />
               <YAxis 
                 stroke={isDark ? '#9ca3af' : '#64748b'}
                 fontSize={12}
                 fontFamily="Poppins, system-ui, -apple-system, sans-serif"
               />
               <Tooltip 
                 contentStyle={{
                   backgroundColor: isDark ? '#1f2937' : '#ffffff',
                   border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
                   borderRadius: '12px',
                   color: isDark ? '#ffffff' : '#1f2937',
                   fontSize: '14px',
                   fontFamily: 'Poppins, system-ui, -apple-system, sans-serif',
                   boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                 }}
               />
               <Line
                 type="monotone"
                 dataKey="revenue"
                 stroke="#10b981"
                 strokeWidth={3}
                 dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                 activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
               />
             </LineChart>
           </ResponsiveContainer>
         </ChartCard>
       </div>
       <div className={`${isDark ? 'bg-gray-800/70' : 'bg-white/70'} backdrop-blur-sm rounded-2xl border ${isDark ? 'border-gray-700/50' : 'border-slate-200/50'} shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}>
         <div className="p-4 sm:p-6 border-b border-gray-200/50">
           <div className="flex flex-col space-y-4">
             <div className="flex items-center space-x-3">
                 <MdFlashOn className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-slate-500'}`} />
                 <h3 className={`text-base sm:text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                 Recent Transactions
               </h3>
             </div>
             <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:gap-4">
               <div className="flex-1 min-w-0">
               <div className="relative">
                   <MdSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isDark ? 'text-gray-400' : 'text-slate-400'}`} />
                 <input
                   type="text"
                     placeholder="Search..."
                   value={searchTerm}
                     onChange={(e) => {
                       setSearchTerm(e.target.value);
                       setCurrentPage(1);
                     }}
                     className={`w-full ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-slate-300 text-slate-700 placeholder-slate-400'} border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                 />
               </div>
               </div>
               <div className="flex gap-2 sm:gap-3">
                 <div className="relative flex-1 sm:flex-none sm:min-w-[140px]">
               <select
                 value={selectedStatus}
                     onChange={(e) => {
                       setSelectedStatus(e.target.value);
                       setCurrentPage(1);
                     }}
                     className={`
                       appearance-none cursor-pointer w-full
                       ${isDark 
                         ? 'bg-gray-700/80 border-gray-600/50 text-white hover:bg-gray-700 focus:bg-gray-700' 
                         : 'bg-white/80 border-slate-300/50 text-slate-700 hover:bg-white focus:bg-white'
                       } 
                       backdrop-blur-sm border rounded-xl px-3 sm:px-4 py-2.5 pr-8 sm:pr-10 
                       text-sm font-medium shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                       transition-all duration-200 ease-out
                       hover:shadow-md hover:scale-[1.02]
                     `}
               >
                 <option value="all">All Status</option>
                 <option value="completed">Completed</option>
                 <option value="pending">Pending</option>
                 <option value="processing">Processing</option>
                 <option value="failed">Failed</option>
               </select>
                   <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                     <MdExpandMore className={`h-4 w-4 sm:h-5 sm:w-5 ${isDark ? 'text-gray-400' : 'text-slate-500'} transition-transform duration-200`} />
                   </div>
                 </div>
               <button
                 onClick={exportTransactions}
                   className={`px-3 sm:px-4 py-2 rounded-lg cursor-pointer ${isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} transition-all text-sm font-medium flex items-center justify-center whitespace-nowrap`}
               >
                   <MdDownload className="h-4 w-4" />
                   <span className="hidden sm:inline ml-2">Export</span>
               </button>
               </div>
             </div>
           </div>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full min-w-[640px]">
             <thead className={`${isDark ? 'bg-gray-700/50' : 'bg-slate-50/80'} backdrop-blur-sm`}>
               <tr>
                 <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-slate-600'} uppercase tracking-wider whitespace-nowrap`}>
                   Product
                 </th>
                 <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-slate-600'} uppercase tracking-wider whitespace-nowrap`}>
                   Category
                 </th>
                 <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-slate-600'} uppercase tracking-wider whitespace-nowrap`}>
                   Revenue
                 </th>
                 <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-slate-600'} uppercase tracking-wider whitespace-nowrap`}>
                   Status
                 </th>
                 <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-slate-600'} uppercase tracking-wider whitespace-nowrap`}>
                   Date
                 </th>
               </tr>
             </thead>
             <tbody className={`${isDark ? 'bg-gray-800/30' : 'bg-white/30'} backdrop-blur-sm divide-y ${isDark ? 'divide-gray-700/50' : 'divide-slate-200/50'}`}>
               {paginatedTransactions.map((transaction) => (
                 <tr key={transaction.id} className={`hover:${isDark ? 'bg-gray-700/30' : 'bg-slate-50/50'} transition-colors duration-200`}>
                   <td className={`px-3 sm:px-6 py-3 sm:py-4 text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                     <div className="min-w-[160px] max-w-[200px] truncate" title={transaction.product}>
                     {transaction.product}
                     </div>
                   </td>
                   <td className={`px-3 sm:px-6 py-3 sm:py-4 text-sm ${isDark ? 'text-gray-300' : 'text-slate-600'} whitespace-nowrap`}>
                     {transaction.category}
                   </td>
                   <td className={`px-3 sm:px-6 py-3 sm:py-4 text-sm font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'} whitespace-nowrap`}>
                     ${transaction.revenue.toLocaleString()}
                   </td>
                   <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                     <TransactionStatus status={transaction.status} />
                   </td>
                   <td className={`px-3 sm:px-6 py-3 sm:py-4 text-sm ${isDark ? 'text-gray-300' : 'text-slate-600'} whitespace-nowrap`}>
                     {new Date(transaction.date).toLocaleDateString('en-US', {
                       year: 'numeric',
                       month: 'short',
                       day: 'numeric'
                     })}
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
         {totalPages > 1 && (
           <Pagination
             currentPage={currentPage}
             totalPages={totalPages}
             onPageChange={setCurrentPage}
             isDark={isDark}
           />
         )}
       </div>
     </main>
     <footer className={`${isDark ? 'bg-gray-900/50' : 'bg-white/50'} backdrop-blur-sm border-t ${isDark ? 'border-gray-700/50' : 'border-slate-200/50'} py-6 mt-2`}>
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center">
           <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'} font-medium`}>
             {`2025 BusinessHub. Crafted for modern businesses. Last updated: ${mounted ? new Date().toLocaleString() : 'Loading...'}`}
           </p>
         </div>
       </div>
     </footer>
     {isMobileMenuOpen && (
       <>
         <div 
           className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
           onClick={() => setIsMobileMenuOpen(false)}
         />
         <div className={`
           md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50
           ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} 
           backdrop-blur-xl border-l ${isDark ? 'border-gray-700/50' : 'border-slate-200/50'}
           transform transition-transform duration-300 ease-out
           shadow-2xl
         `}>
           <div className="flex flex-col h-full">
             <div className="flex items-center justify-between h-18 px-6 border-b border-gray-200/20">
               <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                   <MdTrendingUp className="h-6 w-6 text-white" />
                 </div>
                 <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                   BusinessHub
                 </h2>
               </div>
               <button
                 onClick={() => setIsMobileMenuOpen(false)}
                 className={`p-2 rounded-lg cursor-pointer ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'} transition-all`}
               >
                 <MdClose className="h-5 w-5" />
               </button>
             </div>
             <div className="flex-1 p-6 space-y-6">
               <div 
                 className={`
                   p-4 rounded-2xl cursor-pointer transition-all duration-200
                   ${isDark ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-slate-50/50 hover:bg-slate-100'}
                   border ${isDark ? 'border-gray-700/50' : 'border-slate-200/50'}
                 `}
                 onClick={() => {
                   setShowProfileModal(true);
                   setIsMobileMenuOpen(false);
                 }}
               >
                 <div className="flex items-center space-x-4">
                   <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                     <MdPerson className="h-5 w-5 text-white" />
                   </div>
                   <div className="flex-1">
                     <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                       {userProfile.name}
                     </h3>
                     <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                       {userProfile.email}
                     </p>
                   </div>
                   <MdChevronRight className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-slate-400'}`} />
                 </div>
               </div>
               <div className="space-y-3">
                 <button
                   onClick={() => {
                     handleRefresh();
                     setIsMobileMenuOpen(false);
                   }}
                   disabled={isRefreshing}
                   className={`
                     w-full flex items-center space-x-4 p-4 rounded-2xl cursor-pointer transition-all duration-200
                     ${isDark ? 'hover:bg-gray-800/50 text-gray-300 hover:text-white' : 'hover:bg-slate-100/50 text-slate-600 hover:text-slate-800'}
                     disabled:opacity-50 disabled:cursor-not-allowed
                   `}
                 >
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-slate-200'}`}>
                     <MdRefresh className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                   </div>
                   <div className="flex-1 text-left">
                     <p className="font-medium">Refresh Data</p>
                     <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
                       {isRefreshing ? 'Refreshing...' : 'Update dashboard'}
                     </p>
                   </div>
                 </button>
                 <button
                   onClick={() => {
                     toggleTheme();
                     setIsMobileMenuOpen(false);
                   }}
                   className={`
                     w-full flex items-center space-x-4 p-4 rounded-2xl cursor-pointer transition-all duration-200
                     ${isDark ? 'hover:bg-gray-800/50 text-gray-300 hover:text-white' : 'hover:bg-slate-100/50 text-slate-600 hover:text-slate-800'}
                   `}
                 >
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-slate-200'}`}>
                     {isDark ? <MdLightMode className="h-5 w-5" /> : <MdDarkMode className="h-5 w-5" />}
                   </div>
                   <div className="flex-1 text-left">
                     <p className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</p>
                     <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
                       Switch to {isDark ? 'light' : 'dark'} theme
                     </p>
                   </div>
                 </button>
               </div>
             </div>
             <div className="p-6 border-t border-gray-200/20">
               <p className={`text-xs text-center ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
                 2025 BusinessHub
               </p>
             </div>
           </div>
         </div>
       </>
     )}
     {showNotifications && (
       <div className="hidden md:block fixed inset-0 z-40 pointer-events-none">
         <div className={`
           absolute right-4 top-20 w-80 max-w-[90vw] pointer-events-auto
           ${isDark ? 'bg-gray-800/95' : 'bg-white/95'} 
           backdrop-blur-2xl rounded-2xl shadow-2xl border 
           ${isDark ? 'border-gray-700/50' : 'border-slate-200/50'} 
           transition-all duration-300
           ring-1 ${isDark ? 'ring-gray-700/50' : 'ring-black/5'}
         `}>
           <div className="p-6">
             <div className="flex items-center justify-between mb-4">
               <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Notifications</h3>
               {unreadCount > 0 && (
                 <span className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full font-medium">
                   {unreadCount} new
                 </span>
               )}
             </div>
             <div className="space-y-3 max-h-80 overflow-y-auto">
               {notifications.map((notification) => (
                 <div 
                   key={notification.id} 
                   className={`
                     p-4 rounded-xl transition-all duration-200 relative cursor-pointer
                     ${isDark ? 'bg-gray-700/50 hover:bg-gray-700/70' : 'bg-slate-50/80 hover:bg-slate-100/80'}
                     ${!notification.isRead ? 'ring-2 ring-blue-500/30' : ''}
                     hover:scale-[1.02] hover:shadow-md
                   `}
                 >
                   {!notification.isRead && (
                     <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                   )}
                   <p className={`text-sm ${isDark ? 'text-gray-200' : 'text-slate-800'} ${!notification.isRead ? 'font-semibold' : 'font-medium'} pr-6 leading-relaxed`}>
                     {notification.message}
                   </p>
                   <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'} mt-2 font-medium`}>
                     {getRelativeTime(notification.timestamp)}
                   </p>
                 </div>
               ))}
             </div>
           </div>
         </div>
       </div>
      )}
     {showNotifications && (
       <div className="md:hidden">
         <div 
           className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
           onClick={() => setShowNotifications(false)}
         />
         <div className={`
           fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50
           ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} 
           backdrop-blur-xl border-l ${isDark ? 'border-gray-700/50' : 'border-slate-200/50'}
           transform transition-transform duration-300 ease-out
           shadow-2xl
         `}>
           <div className="flex flex-col h-full">
             <div className="flex items-center justify-between h-18 px-6 border-b border-gray-200/20">
               <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                   <MdNotifications className="h-6 w-6 text-white" />
                 </div>
                 <div>
                   <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                     Notifications
                   </h2>
                   {unreadCount > 0 && (
                     <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                       {unreadCount} new notification{unreadCount > 1 ? 's' : ''}
                     </p>
                   )}
                 </div>
               </div>
               <button
                 onClick={() => setShowNotifications(false)}
                 className={`p-2 rounded-lg cursor-pointer ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'} transition-all`}
               >
                 <MdClose className="h-5 w-5" />
               </button>
             </div>
             <div className="flex-1 p-6 space-y-4 overflow-y-auto">
               {notifications.map((notification) => (
                 <div 
                   key={notification.id} 
                   className={`
                     p-4 rounded-2xl transition-all duration-200 relative
                     ${isDark ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-slate-50/50 hover:bg-slate-100'}
                     border ${isDark ? 'border-gray-700/50' : 'border-slate-200/50'}
                     ${!notification.isRead ? 'ring-2 ring-blue-500/30' : ''}
                   `}
                 >
                   {!notification.isRead && (
                     <div className="absolute top-3 right-3 w-3 h-3 bg-blue-500 rounded-full"></div>
                   )}
                   <p className={`text-sm ${isDark ? 'text-gray-200' : 'text-slate-800'} ${!notification.isRead ? 'font-semibold' : 'font-medium'} pr-6 leading-relaxed`}>
                     {notification.message}
                   </p>
                   <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'} mt-2 font-medium`}>
                     {getRelativeTime(notification.timestamp)}
                   </p>
                 </div>
               ))}
             </div>
           </div>
         </div>
       </div>
     )}
     {showNotifications && (
       <div className="hidden md:block fixed inset-0 z-40 pointer-events-none">
         <div className={`
           absolute right-4 top-20 w-80 max-w-[90vw] pointer-events-auto
           ${isDark ? 'bg-gray-800/95' : 'bg-white/95'} 
           backdrop-blur-2xl rounded-2xl shadow-2xl border 
           ${isDark ? 'border-gray-700/50' : 'border-slate-200/50'} 
           transition-all duration-300
           ring-1 ${isDark ? 'ring-gray-700/50' : 'ring-black/5'}
         `}>
           <div className="p-6">
             <div className="flex items-center justify-between mb-4">
               <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Notifications</h3>
               {unreadCount > 0 && (
                 <span className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full font-medium">
                   {unreadCount} new
                 </span>
               )}
             </div>
             <div className="space-y-3 max-h-80 overflow-y-auto">
               {notifications.map((notification) => (
                 <div 
                   key={notification.id} 
                   className={`
                     p-4 rounded-xl transition-all duration-200 relative cursor-pointer
                     ${isDark ? 'bg-gray-700/50 hover:bg-gray-700/70' : 'bg-slate-50/80 hover:bg-slate-100/80'}
                     ${!notification.isRead ? 'ring-2 ring-blue-500/30' : ''}
                     hover:scale-[1.02] hover:shadow-md
                   `}
                 >
                   {!notification.isRead && (
                     <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                   )}
                   <p className={`text-sm ${isDark ? 'text-gray-200' : 'text-slate-800'} ${!notification.isRead ? 'font-semibold' : 'font-medium'} pr-6 leading-relaxed`}>
                     {notification.message}
                   </p>
                   <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'} mt-2 font-medium`}>
                     {getRelativeTime(notification.timestamp)}
                   </p>
                 </div>
               ))}
             </div>
           </div>
         </div>
       </div>
     )}
     <ProfileModal
       isOpen={showProfileModal}
       onClose={() => setShowProfileModal(false)}
       userProfile={userProfile}
       onSave={handleProfileUpdate}
       isDark={isDark}
     />
   </div>
 );
};
export default BusinessDashboard;