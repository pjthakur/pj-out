"use client"
import React, { useState, useEffect, useRef } from 'react';
import "@fontsource/poppins";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';

interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path: string;
  dropdown?: NavigationItem[];
  hasNotification?: boolean;
}

interface BookmarkItem {
  id: string;
  label: string;
  path: string;
  iconType?: 'dashboard' | 'reports' | 'settings' | 'default';
}

interface NavigationData {
  main: NavigationItem[];
  bookmarks: NavigationItem[];
}

const Icon = ({ path, className = 'w-6 h-6' }: { path: string; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d={path} />
  </svg>
);

const navigationData: NavigationData = {
  main: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      path: '/dashboard/overview',
      dropdown: [
        { id: 'overview', label: 'Overview', path: '/dashboard/overview' },
        { id: 'metrics', label: 'Key Metrics', path: '/dashboard/metrics' },
        { id: 'performance', label: 'Performance', path: '/dashboard/performance' },
        { id: 'recent-activity', label: 'Recent Activity', path: '/dashboard/recent-activity' },
      ],
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      path: '/reports',
      dropdown: [
        { id: 'sales', label: 'Sales Reports', path: '/reports/sales' },
        { id: 'inventory', label: 'Inventory Reports', path: '/reports/inventory' },
        { id: 'customers', label: 'Customer Reports', path: '/reports/customers' },
        { id: 'analytics', label: 'Analytics', path: '/reports/analytics' },
      ],
    },
    
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      path: '/settings',
      dropdown: [
        { id: 'account', label: 'Account Settings', path: '/settings/account' },
      ],
    },
  ],
  bookmarks: [
    {
      id: 'sales-report',
      label: 'Sales Reports',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      ),
      path: '/reports/sales',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      path: '/reports/analytics',
    },
    {
      id: 'account-settings',
      label: 'Account Settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      path: '/settings/account',
    },
  ],
};

const BookmarkIcon = () => <Icon path="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />;

const NavigationComponent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/dashboard/overview');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [toasts, setToasts] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
  }>>([]);
  const [userBookmarks, setUserBookmarks] = useState<BookmarkItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountData, setAccountData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com'
  });
  const [isMobile, setIsMobile] = useState(false);
  
  const dropdownRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Load bookmarks and account data from localStorage on component mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('userBookmarks');
    if (savedBookmarks) {
      try {
        setUserBookmarks(JSON.parse(savedBookmarks));
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    }

    const savedAccountData = localStorage.getItem('accountData');
    if (savedAccountData) {
      try {
        setAccountData(JSON.parse(savedAccountData));
      } catch (error) {
        console.error('Error loading account data:', error);
      }
    }
  }, []);

  // Handle screen size detection for mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Save bookmarks to localStorage whenever bookmarks change
  useEffect(() => {
    localStorage.setItem('userBookmarks', JSON.stringify(userBookmarks));
  }, [userBookmarks]);

  // Handle keyboard navigation and clicks outside dropdowns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setUserDropdownOpen(false);
      }
      
      if (e.key === 'Tab' && openDropdown) {
        const dropdown = dropdownRefs.current[openDropdown];
        if (dropdown) {
          const focusableElements = dropdown.querySelectorAll('a, button');
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          
          if (e.shiftKey && document.activeElement === firstElement) {
            (lastElement as HTMLElement).focus();
            e.preventDefault();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            (firstElement as HTMLElement).focus();
            e.preventDefault();
          }
        }
      }
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (openDropdown && dropdownRefs.current[openDropdown] && 
          !dropdownRefs.current[openDropdown]?.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
      
      if (userDropdownOpen && userDropdownRef.current && 
          !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
      
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarExpanded(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown, userDropdownOpen]);
  

    // Initialize dark mode and add the Tailwind dark mode script
    useEffect(() => {
      // Add the Tailwind dark mode script
      const script = document.createElement('script');
      script.src = 'https://cdn.tailwindcss.com';
      script.onload = () => {
        // Configure Tailwind to use class-based dark mode
        // @ts-ignore
        tailwind.config = {
          darkMode: 'class'
        };
      };
      document.head.appendChild(script);
  
      // Check for saved preference or system preference
      const savedMode = localStorage.getItem('darkMode');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedMode !== null) {
        setDarkMode(savedMode === 'true');
      } else if (systemPrefersDark) {
        setDarkMode(true);
      }
  
      return () => {
        document.head.removeChild(script);
      };
    }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };
  
  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };
  
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
  };
  
  const handleNavigation = (path: string) => {
    // Redirect dashboard root path to overview
    // Redirect settings root path to account
    let targetPath = path;
    if (path === '/dashboard') {
      targetPath = '/dashboard/overview';
    } else if (path === '/settings') {
      targetPath = '/settings/account';
    }
    setCurrentPath(targetPath);
    setOpenDropdown(null);
    setUserDropdownOpen(false);
  };
  
  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };
  
  const getPageTitle = () => {
    if (currentPath === '/dashboard' || currentPath === '/dashboard/overview') return 'Dashboard Overview';
    if (currentPath === '/dashboard/metrics') return 'Key Metrics';
    if (currentPath === '/dashboard/performance') return 'Performance';
    if (currentPath === '/dashboard/recent-activity') return 'Recent Activity';
    if (currentPath.startsWith('/reports')) return 'Reports';
    if (currentPath.startsWith('/settings')) return 'Settings';
    return 'Page';
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success', duration: number = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };



  const clearNotifications = () => {
    setNotifications(0);
    showToast('All notifications cleared!', 'info');
  };

  // Export functions
  const exportToCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header.toLowerCase().replace(/\s+/g, '')];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(`${filename}.csv exported successfully!`, 'success');
  };

  const exportToExcel = (data: any[], filename: string, headers: string[]) => {
    // Create CSV content but save as .xlsx for Excel compatibility
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header.toLowerCase().replace(/\s+/g, '')];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(`${filename}.xlsx exported successfully!`, 'success');
  };

  const handleSalesExport = (format: 'csv' | 'excel') => {
    const headers = ['Product', 'Sales', 'Revenue', 'Rating'];
    const data = productPerformanceData.map(product => ({
      product: product.name,
      sales: product.sales,
      revenue: product.revenue,
      rating: product.rating
    }));

    if (format === 'csv') {
      exportToCSV(data, 'sales_report', headers);
    } else {
      exportToExcel(data, 'sales_report', headers);
    }
  };

  const handleInventoryExport = () => {
    const headers = ['Category', 'In Stock', 'Low Stock', 'Out of Stock', 'Status'];
    const data = inventoryData.map(item => ({
      category: item.category,
      instock: item.inStock,
      lowstock: item.lowStock,
      outofstock: item.outOfStock,
      status: item.outOfStock > 20 ? 'Critical' : item.lowStock > 50 ? 'Warning' : 'Good'
    }));

    exportToCSV(data, 'inventory_report', headers);
  };

  const handleCustomerExport = () => {
    const headers = ['Segment', 'Customers', 'Revenue', 'Avg Order', 'Growth'];
    const data = customerSegmentData.map(segment => ({
      segment: segment.segment,
      customers: segment.customers,
      revenue: segment.revenue,
      avgorder: segment.avgOrder,
      growth: segment.segment === 'Premium' ? '+15.3%' :
              segment.segment === 'Regular' ? '+8.1%' :
              segment.segment === 'New' ? '+24.7%' : '-5.2%'
    }));

    exportToCSV(data, 'customer_report', headers);
  };

  const handleAnalyticsExport = () => {
    const headers = ['Source', 'Visitors', 'Conversions', 'Rate', 'Trend'];
    const data = trafficSourceData.map(source => ({
      source: source.source,
      visitors: source.visitors,
      conversions: source.conversions,
      rate: source.rate,
      trend: source.rate > 8 ? 'Excellent' : source.rate > 6 ? 'Good' : 'Average'
    }));

    exportToCSV(data, 'analytics_report', headers);
  };

  const handleSaveAccountSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setIsSaving(true);
    setIsSaved(false);

    // Get form data
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;

    const newAccountData = { fullName, email };

    // Simulate saving delay
    setTimeout(() => {
      // Save to localStorage
      localStorage.setItem('accountData', JSON.stringify(newAccountData));
      setAccountData(newAccountData);
      
      setIsSaving(false);
      setIsSaved(true);
      
      showToast('Account settings saved successfully!', 'success');

      // Reset saved state after 3 seconds
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    }, 2000);
  };

  // Bookmark management functions
  const isBookmarked = (path: string) => {
    // Check both default bookmarks and user bookmarks
    const isDefaultBookmark = navigationData.bookmarks.some(bookmark => bookmark.path === path);
    const isUserBookmark = userBookmarks.some(bookmark => bookmark.path === path);
    return isDefaultBookmark || isUserBookmark;
  };

  const getIconTypeFromPath = (path: string): 'dashboard' | 'reports' | 'settings' | 'default' => {
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/settings')) return 'settings';
    return 'default';
  };

  const getIconFromType = (iconType: 'dashboard' | 'reports' | 'settings' | 'default'): React.ReactNode => {
    switch (iconType) {
      case 'dashboard':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        );
      case 'reports':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        );
      case 'settings':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        );
    }
  };

  const addBookmark = (path: string, label: string) => {
    // Check if it's already a default bookmark
    const isDefaultBookmark = navigationData.bookmarks.some(bookmark => bookmark.path === path);
    if (isDefaultBookmark) {
      showToast('This page is already in your default bookmarks!', 'info');
      return;
    }

    // Check if it's already in user bookmarks
    const isUserBookmark = userBookmarks.some(bookmark => bookmark.path === path);
    if (isUserBookmark) {
      showToast('Page is already bookmarked!', 'info');
      return;
    }

    const newBookmark: BookmarkItem = {
      id: `bookmark-${Date.now()}`,
      label: label,
      path: path,
      iconType: getIconTypeFromPath(path)
    };

    setUserBookmarks(prev => [...prev, newBookmark]);
    showToast(`${label} added to bookmarks!`, 'success');
  };

  const removeBookmark = (path: string) => {
    // Check if it's a default bookmark (cannot be removed)
    const isDefaultBookmark = navigationData.bookmarks.some(bookmark => bookmark.path === path);
    if (isDefaultBookmark) {
      showToast('Default bookmarks cannot be removed!', 'warning');
      return;
    }

    const bookmark = userBookmarks.find(b => b.path === path);
    if (!bookmark) {
      showToast('Bookmark not found!', 'error');
      return;
    }

    setUserBookmarks(prev => prev.filter(bookmark => bookmark.path !== path));
    showToast(`${bookmark.label} removed from bookmarks!`, 'success');
  };

  const toggleBookmark = (path: string, label: string) => {
    // Check if it's a default bookmark
    const isDefaultBookmark = navigationData.bookmarks.some(bookmark => bookmark.path === path);
    
    if (isDefaultBookmark) {
      showToast('This is a default bookmark and cannot be removed!', 'info');
      return;
    }

    // For user bookmarks, toggle normally
    const isUserBookmark = userBookmarks.some(bookmark => bookmark.path === path);
    if (isUserBookmark) {
      removeBookmark(path);
    } else {
      addBookmark(path, label);
    }
  };

  const getPageIcon = (path: string) => {
    if (path.includes('/dashboard')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      );
    } else if (path.includes('/reports')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      );
    } else if (path.includes('/settings')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    );
  };

  // Chart data and configurations
  const revenueData = [
    { month: 'Jan', revenue: 12000, expenses: 8000, profit: 4000 },
    { month: 'Feb', revenue: 15000, expenses: 9000, profit: 6000 },
    { month: 'Mar', revenue: 18000, expenses: 10000, profit: 8000 },
    { month: 'Apr', revenue: 22000, expenses: 12000, profit: 10000 },
    { month: 'May', revenue: 25000, expenses: 13000, profit: 12000 },
    { month: 'Jun', revenue: 28000, expenses: 14000, profit: 14000 },
  ];

  const userGrowthData = [
    { month: 'Jan', users: 1200, active: 800, new: 120 },
    { month: 'Feb', users: 1350, active: 920, new: 150 },
    { month: 'Mar', users: 1500, active: 1050, new: 150 },
    { month: 'Apr', users: 1680, active: 1200, new: 180 },
    { month: 'May', users: 1850, active: 1350, new: 170 },
    { month: 'Jun', users: 2000, active: 1429, new: 150 },
  ];

  const salesByCategory = [
    { name: 'Electronics', value: 35, color: '#8B5CF6' },
    { name: 'Clothing', value: 25, color: '#06B6D4' },
    { name: 'Home & Garden', value: 20, color: '#10B981' },
    { name: 'Sports', value: 12, color: '#F59E0B' },
    { name: 'Books', value: 8, color: '#EF4444' },
  ];

  const performanceData = [
    { metric: 'Page Load', score: 85, fill: '#10B981' },
    { metric: 'SEO', score: 92, fill: '#06B6D4' },
    { metric: 'Accessibility', score: 78, fill: '#8B5CF6' },
    { metric: 'Best Practices', score: 88, fill: '#F59E0B' },
  ];

  const dailyActivityData = [
    { time: '00:00', views: 45, users: 12 },
    { time: '04:00', views: 32, users: 8 },
    { time: '08:00', views: 156, users: 45 },
    { time: '12:00', views: 289, users: 87 },
    { time: '16:00', views: 234, users: 76 },
    { time: '20:00', views: 198, users: 65 },
  ];

  // Reports data
  const salesReportData = [
    { month: 'Jan', sales: 45000, target: 50000, units: 450 },
    { month: 'Feb', sales: 52000, target: 55000, units: 520 },
    { month: 'Mar', sales: 48000, target: 50000, units: 480 },
    { month: 'Apr', sales: 61000, target: 60000, units: 610 },
    { month: 'May', sales: 55000, target: 58000, units: 550 },
    { month: 'Jun', sales: 67000, target: 65000, units: 670 },
  ];

  const inventoryData = [
    { category: 'Electronics', inStock: 1250, lowStock: 45, outOfStock: 12 },
    { category: 'Clothing', inStock: 2100, lowStock: 78, outOfStock: 23 },
    { category: 'Home & Garden', inStock: 890, lowStock: 34, outOfStock: 8 },
    { category: 'Sports', inStock: 650, lowStock: 28, outOfStock: 15 },
    { category: 'Books', inStock: 340, lowStock: 12, outOfStock: 5 },
  ];

  const customerSegmentData = [
    { segment: 'Premium', customers: 1250, revenue: 450000, avgOrder: 360 },
    { segment: 'Regular', customers: 3400, revenue: 680000, avgOrder: 200 },
    { segment: 'New', customers: 890, revenue: 125000, avgOrder: 140 },
    { segment: 'Inactive', customers: 560, revenue: 45000, avgOrder: 80 },
  ];

  const trafficSourceData = [
    { source: 'Organic Search', visitors: 12450, conversions: 892, rate: 7.2 },
    { source: 'Social Media', visitors: 8900, conversions: 534, rate: 6.0 },
    { source: 'Direct', visitors: 6780, conversions: 456, rate: 6.7 },
    { source: 'Email', visitors: 4350, conversions: 387, rate: 8.9 },
    { source: 'Paid Ads', visitors: 3200, conversions: 289, rate: 9.0 },
  ];

  const productPerformanceData = [
    { name: 'UltraMax Pro 2024', sales: 2340, revenue: 234000, rating: 4.8 },
    { name: 'SmartHome Hub X1', sales: 1890, revenue: 189000, rating: 4.6 },
    { name: 'FitTracker Elite', sales: 1560, revenue: 156000, rating: 4.7 },
    { name: 'EcoFriendly Pack', sales: 1234, revenue: 98720, rating: 4.5 },
    { name: 'TechGadget Mini', sales: 987, revenue: 78960, rating: 4.4 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-900 p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-xl backdrop-blur-sm">
          <p className="text-gray-900 dark:text-gray-100 font-medium text-sm mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-500" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-800 dark:text-gray-200 font-medium">
                {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                {entry.payload && entry.payload.value && typeof entry.payload.value === 'number' ? `%` : ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const BookmarkButton = ({ currentPath, label }: { currentPath: string, label: string }) => (
    <button
      onClick={() => toggleBookmark(currentPath, label)}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
        isBookmarked(currentPath)
          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-800'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
      title={isBookmarked(currentPath) ? 'Remove bookmark' : 'Add bookmark'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 mr-2"
        fill={isBookmarked(currentPath) ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
      <span className="text-xs sm:text-sm">
        {isBookmarked(currentPath) ? 'Bookmarked' : 'Bookmark'}
      </span>
    </button>
  );

  const renderPageContent = () => {
    if (currentPath === '/dashboard' || currentPath === '/dashboard/overview') {
      return (
        <div className="space-y-4 sm:space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-3 lg:ml-4">
                  <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                  <p className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">$28,000</p>
                </div>
              </div>
              <div className="mt-3 lg:mt-4">
                <span className="text-green-500 text-xs lg:text-sm font-medium">+12.5%</span>
                <span className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm ml-2">vs last month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-3 lg:ml-4">
                  <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                  <p className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">2,000</p>
                </div>
              </div>
              <div className="mt-3 lg:mt-4">
                <span className="text-green-500 text-xs lg:text-sm font-medium">+8.2%</span>
                <span className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm ml-2">vs last month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-3 lg:ml-4">
                  <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">Orders</p>
                  <p className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">892</p>
                </div>
              </div>
              <div className="mt-3 lg:mt-4">
                <span className="text-red-500 text-xs lg:text-sm font-medium">-2.1%</span>
                <span className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm ml-2">vs last month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <div className="ml-3 lg:ml-4">
                  <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">Conversions</p>
                  <p className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">3.2%</p>
                </div>
              </div>
              <div className="mt-3 lg:mt-4">
                <span className="text-green-500 text-xs lg:text-sm font-medium">+0.3%</span>
                <span className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm ml-2">vs last month</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
            {/* Revenue Chart */}
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Revenue Overview</h3>
              <div className="h-48 sm:h-64 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                    <XAxis 
                      dataKey="month" 
                      stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                      fontSize={isMobile ? 10 : 12}
                    />
                    <YAxis 
                      stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                      fontSize={isMobile ? 10 : 12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sales by Category */}
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sales by Category</h3>
              <div className="h-48 sm:h-64 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesByCategory}
                      cx="50%"
                      cy="50%"
                      outerRadius={isMobile ? 60 : 80}
                      fill="#8884d8"
                      dataKey="value"
                      label={!isMobile ? ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` : false}
                      labelLine={false}
                    >
                      {salesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    {!isMobile && <Tooltip content={<CustomTooltip />} />}
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Mobile Legend */}
              <div className="block sm:hidden mt-4 space-y-2">
                <div className="grid grid-cols-1 gap-2">
                  {salesByCategory.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-gray-900 dark:text-white font-medium">
                          {entry.name}
                        </span>
                      </div>
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {entry.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>


        </div>
      );
    }

    if (currentPath === '/dashboard/metrics') {
      return (
        <div className="space-y-6">
          {/* User Growth Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">User Growth Metrics</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                  <XAxis 
                    dataKey="month" 
                    stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                    fontSize={12}
                  />
                  <YAxis 
                    stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Total Users"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="active" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Active Users"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="new" 
                    stroke="#06B6D4" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="New Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Comparison</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                    <XAxis 
                      dataKey="month" 
                      stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                      fontSize={12}
                    />
                    <YAxis 
                      stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" fill="#8B5CF6" name="Revenue" />
                    <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Key Performance Indicators</h4>
              <div className="space-y-4">
                {performanceData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{item.metric}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${item.score}%`, 
                            backgroundColor: item.fill 
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white w-8">{item.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentPath === '/dashboard/performance') {
      return (
        <div className="space-y-6">
          {/* Performance Radial Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Performance Scores</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={performanceData}>
                  <RadialBar
                    background
                    dataKey="score"
                    cornerRadius={10}
                    fill="#8884d8"
                  />
                  <Legend 
                    iconSize={18} 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    wrapperStyle={{
                      color: darkMode ? '#F3F4F6' : '#374151',
                      fontSize: isMobile ? '12px' : '14px'
                    }}
                  />
                  {!isMobile && <Tooltip content={<CustomTooltip />} />}
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Activity */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Daily Activity Pattern</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyActivityData}>
                  <defs>
                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                  <XAxis 
                    dataKey="time" 
                    stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                    fontSize={12}
                  />
                  <YAxis 
                    stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stackId="1"
                    stroke="#06B6D4"
                    fill="url(#viewsGradient)"
                    name="Page Views"
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stackId="2"
                    stroke="#10B981"
                    fill="url(#usersGradient)"
                    name="Active Users"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );
    }

    if (currentPath === '/dashboard/recent-activity') {
      return (
        <div className="space-y-6">
          {/* Activity Timeline */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
                             {[
                 { time: '2 mins ago', action: 'New user registration', user: 'john.doe@email.com', type: 'success' },
                 { time: '15 mins ago', action: 'Payment processed', amount: '$250.00', type: 'info' },
                 { time: '1 hour ago', action: 'System backup completed', size: '2.4 GB', type: 'success' },
                 { time: '2 hours ago', action: 'Login attempt failed', user: 'admin@domain.com', type: 'warning' },
                 { time: '3 hours ago', action: 'Database optimized', duration: '45 seconds', type: 'info' },
               ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                                         <p className="text-sm text-gray-500 dark:text-gray-400">
                       {activity.user || activity.amount || activity.size || activity.duration}
                     </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Activity Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                  <XAxis 
                    dataKey="time" 
                    stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                    fontSize={12}
                  />
                  <YAxis 
                    stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Page Views"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Active Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );
    }

    // Sales Reports
    if (currentPath === '/reports' || currentPath === '/reports/sales') {
      return (
        <div className="space-y-6">
          {/* Sales Overview Chart */}
          <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sales Performance</h3>
            </div>
            <div className="h-64 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesReportData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                  <XAxis dataKey="month" stroke={darkMode ? '#9CA3AF' : '#6B7280'} fontSize={12} />
                  <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="sales" stroke="#10B981" fill="url(#salesGradient)" name="Actual Sales" />
                  <Area type="monotone" dataKey="target" stroke="#8B5CF6" fill="url(#targetGradient)" name="Target" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products Table */}
          <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top Performing Products</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sales</th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Revenue</th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rating</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {productPerformanceData.map((product, index) => (
                    <tr key={index}>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{product.name}</td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{product.sales.toLocaleString()}</td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${product.revenue.toLocaleString()}</td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1 text-gray-900 dark:text-white">{product.rating}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Export Options</h4>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleSalesExport('csv')}
                className="flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors text-sm cursor-pointer"
                title="Export CSV"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
              <button
                onClick={() => handleSalesExport('excel')}
                className="flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors text-sm cursor-pointer"
                title="Export Excel"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Inventory Reports
    if (currentPath === '/reports/inventory') {
      return (
        <div className="space-y-6">
          {/* Inventory Status Chart */}
          <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Inventory Status Overview</h3>
            </div>
            <div className="h-64 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                  <XAxis dataKey="category" stroke={darkMode ? '#9CA3AF' : '#6B7280'} fontSize={12} />
                  <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="inStock" fill="#10B981" name="In Stock" />
                  <Bar dataKey="lowStock" fill="#F59E0B" name="Low Stock" />
                  <Bar dataKey="outOfStock" fill="#EF4444" name="Out of Stock" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Inventory Details Table */}
          <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Inventory Details by Category</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">In Stock</th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Low Stock</th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Out of Stock</th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {inventoryData.map((item, index) => (
                    <tr key={index}>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.category}</td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">{item.inStock.toLocaleString()}</td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-yellow-600 dark:text-yellow-400">{item.lowStock}</td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">{item.outOfStock}</td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.outOfStock > 20 ? 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100' :
                          item.lowStock > 50 ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100' :
                          'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100'
                        }`}>
                          {item.outOfStock > 20 ? 'Critical' : item.lowStock > 50 ? 'Warning' : 'Good'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inventory Actions */}
          <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Export Options</h4>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleInventoryExport()}
                className="flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors text-sm cursor-pointer"
                title="Export CSV"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Customer Reports
    if (currentPath === '/reports/customers') {
      return (
        <div className="space-y-6">
          {/* Customer Segments Chart */}
          <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Customer Segments Analysis</h3>
              <button
                onClick={() => handleCustomerExport()}
                className="flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors text-sm cursor-pointer"
                title="Export CSV"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </div>
            <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
              {/* Pie Chart Section */}
              <div className="w-full">
                <div className="h-64 sm:h-72 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerSegmentData}
                        cx="50%"
                        cy="50%"
                        outerRadius={isMobile ? 60 : 80}
                        fill="#8884d8"
                        dataKey="customers"
                        label={!isMobile ? ({ segment, percent }) => `${segment} ${(percent * 100).toFixed(0)}%` : false}
                        labelLine={false}
                      >
                        {customerSegmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={
                            index === 0 ? '#8B5CF6' : 
                            index === 1 ? '#10B981' : 
                            index === 2 ? '#06B6D4' : '#F59E0B'
                          } />
                        ))}
                      </Pie>
                      {!isMobile && <Tooltip content={<CustomTooltip />} />}
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Mobile Legend for Customer Segments */}
                <div className="block lg:hidden mt-4 space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    {customerSegmentData.map((entry, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: 
                            index === 0 ? '#8B5CF6' : 
                            index === 1 ? '#10B981' : 
                            index === 2 ? '#06B6D4' : '#F59E0B'
                          }}
                        />
                        <div className="flex flex-col">
                          <span className="text-gray-900 dark:text-white font-medium text-xs">
                            {entry.segment}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 text-xs">
                            {((entry.customers / customerSegmentData.reduce((sum, item) => sum + item.customers, 0)) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Bar Chart Section */}
              <div className="w-full">
                <div className="h-64 sm:h-72 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={customerSegmentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                      <XAxis 
                        dataKey="segment" 
                        stroke={darkMode ? '#9CA3AF' : '#6B7280'} 
                        fontSize={isMobile ? 10 : 12}
                        angle={isMobile ? -45 : 0}
                        textAnchor={isMobile ? 'end' : 'middle'}
                        height={isMobile ? 60 : 30}
                      />
                      <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} fontSize={isMobile ? 10 : 12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="revenue" fill="#8B5CF6" name="Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details Table */}
          <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Customer Segment Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Segment</th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customers</th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Revenue</th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Avg Order</th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Growth</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {customerSegmentData.map((segment, index) => (
                    <tr key={index}>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{segment.segment}</td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{segment.customers.toLocaleString()}</td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${segment.revenue.toLocaleString()}</td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${segment.avgOrder}</td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`text-xs font-medium ${
                          segment.segment === 'Premium' ? 'text-green-600 dark:text-green-400' :
                          segment.segment === 'Regular' ? 'text-blue-600 dark:text-blue-400' :
                          segment.segment === 'New' ? 'text-purple-600 dark:text-purple-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {segment.segment === 'Premium' ? '+15.3%' :
                           segment.segment === 'Regular' ? '+8.1%' :
                           segment.segment === 'New' ? '+24.7%' : '-5.2%'}
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
    }

    // Analytics Reports
    if (currentPath === '/reports/analytics') {
      return (
        <div className="space-y-6">
          {/* Traffic Sources */}
          <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Traffic Sources & Conversions</h3>
              <button
                onClick={() => handleAnalyticsExport()}
                className="flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors text-sm cursor-pointer"
                title="Export CSV"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </div>
            <div className="h-64 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficSourceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                  <XAxis dataKey="source" stroke={darkMode ? '#9CA3AF' : '#6B7280'} fontSize={12} />
                  <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="visitors" fill="#06B6D4" name="Visitors" />
                  <Bar dataKey="conversions" fill="#10B981" name="Conversions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Analytics Table */}
          <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Traffic Source Performance</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Source</th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Visitors</th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Conversions</th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rate</th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Trend</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {trafficSourceData.map((source, index) => (
                    <tr key={index}>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{source.source}</td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{source.visitors.toLocaleString()}</td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{source.conversions.toLocaleString()}</td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{source.rate}%</td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`text-xs font-medium ${
                          source.rate > 8 ? 'text-green-600 dark:text-green-400' :
                          source.rate > 6 ? 'text-blue-600 dark:text-blue-400' :
                          'text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {source.rate > 8 ? 'Excellent' : source.rate > 6 ? 'Good' : 'Average'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Analytics Actions */}
          <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Export Options</h4>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleAnalyticsExport()}
                className="flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors text-sm cursor-pointer"
                title="Export CSV"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (currentPath.startsWith('/settings')) {
      return (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Account Settings</h3>
            <form className="space-y-4" onSubmit={handleSaveAccountSettings}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  defaultValue={accountData.fullName}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={accountData.email}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSaving || isSaved}
                  className={`px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${
                    isSaved 
                      ? 'bg-green-600 text-white cursor-default' 
                      : isSaving 
                        ? 'bg-blue-400 text-white cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  }`}
                >
                  {isSaving && (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isSaved && (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isSaving ? 'Saving...' : isSaved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    // Default content for other pages
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Page Content</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          This is the content area for the current page: <span className="font-medium">{currentPath}</span>
        </p>
      </div>
    );
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-4 sm:top-4 z-50 space-y-2 sm:w-auto w-full max-w-sm sm:max-w-none mx-auto sm:mx-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between p-3 sm:p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out w-full sm:min-w-80 sm:max-w-96 ${
            toast.type === 'success'
              ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 border-l-4 border-green-500'
              : toast.type === 'error'
              ? 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 border-l-4 border-red-500'
              : toast.type === 'warning'
              ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 border-l-4 border-yellow-500'
              : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 border-l-4 border-blue-500'
          }`}
        >
          <div className="flex items-start sm:items-center">
            <div className="flex-shrink-0 mr-2 sm:mr-3 mt-0.5 sm:mt-0">
              {toast.type === 'success' && (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {toast.type === 'error' && (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {toast.type === 'warning' && (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {toast.type === 'info' && (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium break-words leading-5">{toast.message}</p>
            </div>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 ml-2 sm:ml-4 text-current opacity-70 hover:opacity-100 transition-opacity cursor-pointer p-1"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
  

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        rel="stylesheet"
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        html {
          font-family: 'Poppins', sans-serif;
        }
        
        /* Specific font weights */
        .poppins-light { font-weight: 300; }
        .poppins-regular { font-weight: 400; }
        .poppins-medium { font-weight: 500; }
        .poppins-semibold { font-weight: 600; }
        .poppins-bold { font-weight: 700; }
        
        /* Custom shadow for floating sidebar */
        .hover\\:shadow-3xl:hover {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
      
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-30">
          <div className="container px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo and main navigation */}
              <div className="flex items-center">
                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 mr-3 cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
                
                <div className="flex-shrink-0 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">AppNav</span>
                </div>
                
                <div className="hidden lg:block ml-6">
                  <div className="flex space-x-1">
                    {navigationData.main.map((item) => (
                      <div key={item.id} className="relative">
                        {item.dropdown ? (
                          <>
                            <button
                              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors relative cursor-pointer
                                ${isActive(item.path) 
                                  ? 'text-indigo-700 dark:text-indigo-300 border-b-2 border-indigo-500 dark:border-indigo-400' 
                                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                              onClick={() => toggleDropdown(item.id)}
                              aria-expanded={openDropdown === item.id}
                              aria-haspopup="true"
                            >
                              <span className="mr-1">{item.label}</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                              {item.hasNotification && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                              )}
                            </button>
                            
                            {openDropdown === item.id && (
                              <div
                                ref={(el: HTMLDivElement | null) => {
                                  if (el) {
                                    dropdownRefs.current[item.id] = el;
                                  }
                                }}
                                className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby={`${item.id}-menu-button`}
                              >
                                <div className="py-1" role="none">
                                  {item.dropdown.map((subItem) => (
                                    <a
                                      key={subItem.id}
                                      href="#"
                                      className={`block px-4 py-2 text-sm transition-colors cursor-pointer
                                        ${isActive(subItem.path)
                                          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleNavigation(subItem.path);
                                      }}
                                      role="menuitem"
                                    >
                                      {subItem.label}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <a
                            href="#"
                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors relative cursor-pointer
                              ${isActive(item.path) 
                                ? 'text-indigo-700 dark:text-indigo-300 border-b-2 border-indigo-500 dark:border-indigo-400' 
                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavigation(item.path);
                            }}
                          >
                            {item.label}
                            {item.hasNotification && (
                              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigationData.main.map((item) => (
                  <div key={item.id}>
                    {item.dropdown ? (
                      <>
                        <div className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-600">
                          {item.label}
                        </div>
                        {item.dropdown.map((subItem) => (
                          <a
                            key={subItem.id}
                            href="#"
                            className={`block px-6 py-2 text-sm transition-colors cursor-pointer ${
                              isActive(subItem.path)
                                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavigation(subItem.path);
                              setMobileMenuOpen(false);
                            }}
                          >
                            {subItem.label}
                          </a>
                        ))}
                      </>
                    ) : (
                      <a
                        href="#"
                        className={`block px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                          isActive(item.path)
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigation(item.path);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center">
                          {item.icon}
                          <span className="ml-3">{item.label}</span>
                        </div>
                      </a>
                    )}
                  </div>
                ))}
                
                {/* Dark mode toggle for mobile */}
                <button
                  onClick={() => {
                    toggleDarkMode();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  {darkMode ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                  <span className="ml-3">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>
            </div>
          )}
        </header>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Floating Sidebar */}
          <aside 
            ref={sidebarRef}
            className={`fixed top-16 left-1 sm:left-2 md:left-4 bottom-2 sm:bottom-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-20 transition-all duration-300 ease-in-out ${sidebarExpanded ? 'w-48 sm:w-56 md:w-64' : 'w-12 sm:w-14 md:w-16'} overflow-hidden hover:shadow-indigo-500/10 hover:shadow-3xl`}
            onMouseEnter={() => setSidebarExpanded(true)}
            onMouseLeave={() => setSidebarExpanded(false)}
            onTouchStart={() => setSidebarExpanded(true)}
          >
            {/* Main navigation items */}
            <div className="mt-2 sm:mt-4 px-1 md:px-2">
              {navigationData.main.map((item) => (
                <a
                  key={item.id}
                  href="#"
                  className={`flex items-center ${sidebarExpanded ? 'px-1 sm:px-2 md:px-3 justify-start' : 'px-1 sm:px-2 md:px-3 justify-center'} py-2 sm:py-3 mb-1 text-xs sm:text-sm transition-colors relative group rounded-lg sm:rounded-xl cursor-pointer
                    ${isActive(item.path)
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-700/50'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.path);
                  }}
                >
                  <div className="flex-shrink-0 flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5">{item.icon}</div>
                  {sidebarExpanded && (
                    <span className="ml-2 sm:ml-3 whitespace-nowrap transition-opacity duration-300 opacity-100 text-xs sm:text-sm">
                      {item.label}
                    </span>
                  )}
                  {item.hasNotification && (
                    <span className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {!sidebarExpanded && (
                    <div className="absolute left-full ml-2 sm:ml-4 px-2 sm:px-3 py-1 sm:py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transform transition-all duration-300 shadow-lg whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </a>
              ))}
            </div>
            
            <div className="border-t border-gray-200/50 dark:border-gray-700/50 mx-2 md:mx-4 my-4"></div>
            
            {/* Bookmarks section */}
            <div className="mt-2 px-1 md:px-2">
              <h3 className={`text-xs font-semibold text-gray-500 dark:text-gray-400 ${sidebarExpanded ? 'px-1 sm:px-2 md:px-3 py-1 justify-start' : 'flex justify-center px-1 sm:px-2 md:px-3 py-1'} uppercase tracking-wider transition-opacity duration-300`}>
                {sidebarExpanded ? 'Bookmarks' : <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center"><BookmarkIcon/></div>}
              </h3>
              
              <div className="mt-2 space-y-1">
                {/* Default bookmarks */}
                {navigationData.bookmarks.map((bookmark) => (
                  <a
                    key={bookmark.id}
                    href="#"
                    className={`flex items-center ${sidebarExpanded ? 'px-2 md:px-3 justify-start' : 'px-2 md:px-3 justify-center'} py-2 mb-1 text-sm transition-colors group rounded-xl cursor-pointer
                      ${isActive(bookmark.path)
                        ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-700/50'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(bookmark.path);
                    }}
                  >
                    <div className="flex-shrink-0 flex items-center justify-center w-5 h-5">{bookmark.icon}</div>
                    {sidebarExpanded && (
                      <span className="ml-3 whitespace-nowrap transition-opacity duration-300 opacity-100">
                        {bookmark.label}
                      </span>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {!sidebarExpanded && (
                      <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transform transition-all duration-300 shadow-lg whitespace-nowrap z-50">
                        {bookmark.label}
                      </div>
                    )}
                  </a>
                ))}

                {/* User bookmarks */}
                {userBookmarks.length > 0 && (
                  <>
                    {userBookmarks.map((bookmark) => (
                      <div key={bookmark.id} className="relative group">
                        <a
                          href="#"
                          className={`flex items-center ${sidebarExpanded ? 'px-2 md:px-3 justify-start' : 'px-2 md:px-3 justify-center'} py-2 mb-1 text-sm transition-colors group rounded-xl cursor-pointer
                            ${isActive(bookmark.path)
                              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-700/50'}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavigation(bookmark.path);
                          }}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            removeBookmark(bookmark.path);
                          }}
                        >
                          <div className="flex-shrink-0 flex items-center justify-center w-5 h-5">{getIconFromType(bookmark.iconType || 'default')}</div>
                          {sidebarExpanded && (
                            <span className="ml-3 whitespace-nowrap transition-opacity duration-300 opacity-100">
                              {bookmark.label}
                            </span>
                          )}
                          
                          {/* Remove bookmark button */}
                          {sidebarExpanded && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeBookmark(bookmark.path);
                              }}
                              className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-500 dark:text-red-400 cursor-pointer"
                              title="Remove bookmark"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                          
                          {/* Tooltip for collapsed state */}
                          {!sidebarExpanded && (
                            <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transform transition-all duration-300 shadow-lg whitespace-nowrap z-50">
                              <div>{bookmark.label}</div>
                              <div className="text-xs opacity-75">Right-click to remove</div>
                            </div>
                          )}
                        </a>
                      </div>
                    ))}
                  </>
                )}
                
                {/* Empty state for bookmarks */}
                {userBookmarks.length === 0 && navigationData.bookmarks.length === 0 && sidebarExpanded && (
                  <div className="px-2 md:px-3 py-3 text-xs text-gray-500 dark:text-gray-400 italic">
                    No bookmarks yet. Use the bookmark button on any page to add it here.
                  </div>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-200/50 dark:border-gray-700/50 mx-2 md:mx-4 my-4"></div>
            
            {/* Theme toggle */}
            <div className="px-1 md:px-2 pb-2">
              <button
                onClick={toggleDarkMode}
                className={`flex items-center ${sidebarExpanded ? 'px-2 md:px-3 justify-start' : 'px-2 md:px-3 justify-center'} py-3 mb-1 text-sm transition-colors relative group rounded-xl w-full text-gray-600 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-700/50 cursor-pointer`}
              >
                <div className="flex-shrink-0 flex items-center justify-center w-5 h-5">
                  {darkMode ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </div>
                {sidebarExpanded && (
                  <span className="ml-3 whitespace-nowrap transition-opacity duration-300 opacity-100">
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                  </span>
                )}
                
                {/* Tooltip for collapsed state */}
                {!sidebarExpanded && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transform transition-all duration-300 shadow-lg whitespace-nowrap z-50">
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                  </div>
                )}
              </button>
            </div>
          </aside>
          
          {/* Main content area */}
          <main className={`flex-1 overflow-auto transition-all duration-300 ${sidebarExpanded ? 'ml-50 sm:ml-60 lg:ml-60 xl:ml-72' : 'ml-14 sm:ml-16 lg:ml-16 xl:ml-24'}`}>
            <div className="container mx-auto px-4 sm:px-6 pt-2 sm:pt-4 pb-4 sm:pb-8 max-w-full">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                    {getPageTitle()}
                  </h1>
                  <BookmarkButton currentPath={currentPath} label={getPageTitle()} />
                </div>
                
                {renderPageContent()}
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Toast Container */}
      <ToastContainer />
    </>
    
  );
};

export default NavigationComponent;