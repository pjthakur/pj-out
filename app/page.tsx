"use client";

import React, { useEffect, useState } from "react";
import { 
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Sun, 
  Moon, 
  Share2, 
  FileDown,
  BarChart2,
  PieChart as PieChartIcon,
  Globe
} from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

// Add a hook to detect mobile screen
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < breakpoint);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
}

export default function DashboardPage() {
  // State for theme management
  const [theme, setTheme] = useState("dark"); // Default to dark theme
  const [mounted, setMounted] = useState(false);
  
  // Define color constants
  const colors = {
    primary: {
      light: "#2563eb", // Blue 600
      dark: "#3b82f6",  // Blue 500
    },
    secondary: {
      light: "#059669", // Emerald 600
      dark: "#10b981",  // Emerald 500
    },
    accent: {
      light: "#7c3aed", // Violet 600
      dark: "#8b5cf6",  // Violet 500
    },
    success: {
      light: "#059669", // Emerald 600
      dark: "#10b981",  // Emerald 500
    },
    warning: {
      light: "#d97706", // Amber 600
      dark: "#f59e0b",  // Amber 500
    },
    danger: {
      light: "#dc2626", // Red 600
      dark: "#ef4444",  // Red 500
    },
    background: {
      light: "#f8fafc", // Slate 50
      dark: "#0f172a",  // Slate 900
    },
    card: {
      light: "#ffffff",
      dark: "#1e293b",  // Slate 800
    },
    border: {
      light: "#e2e8f0", // Slate 200
      dark: "#334155",  // Slate 700
    },
    text: {
      primary: {
        light: "#0f172a", // Slate 900
        dark: "#f8fafc",  // Slate 50
      },
      secondary: {
        light: "#475569", // Slate 600
        dark: "#94a3b8",  // Slate 400
      }
    }
  };

  // Sample data for the dashboard
  const salesData = [
    { name: "Jan", sales: 4000, target: 3500 },
    { name: "Feb", sales: 3000, target: 3200 },
    { name: "Mar", sales: 5000, target: 4800 },
    { name: "Apr", sales: 4500, target: 4200 },
    { name: "May", sales: 6000, target: 5500 },
    { name: "Jun", sales: 5500, target: 5800 }
  ];

  // Make pie chart data static
  const customerData = [
    { name: "New", value: 40, color: colors.primary.dark },
    { name: "Returning", value: 30, color: colors.secondary.dark },
    { name: "Inactive", value: 30, color: colors.warning.dark }
  ];
  const salesDistribution = [
    { name: "Online", value: 47, color: colors.primary.dark },
    { name: "In-Store", value: 33, color: colors.secondary.dark },
    { name: "Wholesale", value: 20, color: colors.accent.dark }
  ];
  // Only regionsData remains real-time
  const [regionsData, setRegionsData] = useState([
    { region: "North America", value: 55, color: colors.primary.dark },
    { region: "Europe", value: 40, color: colors.accent.dark },
    { region: "Asia Pacific", value: 30, color: colors.secondary.dark },
    { region: "South America", value: 20, color: colors.warning.dark },
    { region: "Other Regions", value: 10, color: colors.warning.dark }
  ]);

  // Update dark mode styles
  const darkModeStyles = {
    backgroundColor: theme === "dark" ? colors.background.dark : colors.background.light,
    color: theme === "dark" ? colors.text.primary.dark : colors.text.primary.light
  };
  
  const cardStyles = {
    backgroundColor: theme === "dark" ? colors.card.dark : colors.card.light,
    borderColor: theme === "dark" ? colors.border.dark : colors.border.light,
    color: theme === "dark" ? colors.text.primary.dark : colors.text.primary.light
  };
  
  const secondaryTextStyle = {
    color: theme === "dark" ? colors.text.secondary.dark : colors.text.secondary.light
  };

  // Update chart colors
  const chartColors = {
    sales: theme === "dark" ? colors.primary.dark : colors.primary.light,
    target: theme === "dark" ? colors.secondary.dark : colors.secondary.light,
    customer: [
      theme === "dark" ? colors.primary.dark : colors.primary.light,
      theme === "dark" ? colors.secondary.dark : colors.secondary.light,
      theme === "dark" ? colors.warning.dark : colors.warning.light
    ],
    distribution: [
      theme === "dark" ? colors.primary.dark : colors.primary.light,
      theme === "dark" ? colors.secondary.dark : colors.secondary.light,
      theme === "dark" ? colors.accent.dark : colors.accent.light
    ],
    regions: [
      theme === "dark" ? colors.primary.dark : colors.primary.light,
      theme === "dark" ? colors.accent.dark : colors.accent.light,
      theme === "dark" ? colors.secondary.dark : colors.secondary.light,
      theme === "dark" ? colors.warning.dark : colors.warning.light
    ]
  };

  // Move stat card values to state for realtime updates
  const [stats, setStats] = useState([
    {
      icon: <ShoppingCart className="w-6 h-6" style={{ color: theme === "dark" ? colors.primary.dark : colors.primary.light }} />, 
      label: "Total Sales",
      value: 28450,
      prefix: "$",
      diff: 12,
      diffColor: "success"
    },
    {
      icon: <Users className="w-6 h-6" style={{ color: theme === "dark" ? colors.secondary.dark : colors.secondary.light }} />, 
      label: "Active Customers",
      value: 1245,
      prefix: "",
      diff: 8,
      diffColor: "success"
    },
    {
      icon: <DollarSign className="w-6 h-6" style={{ color: theme === "dark" ? colors.accent.dark : colors.accent.light }} />, 
      label: "Avg. Order Value",
      value: 2150,
      prefix: "$",
      diff: -5,
      diffColor: "danger"
    },
    {
      icon: <TrendingUp className="w-6 h-6" style={{ color: theme === "dark" ? colors.warning.dark : colors.warning.light }} />, 
      label: "Conversion Rate",
      value: 4.2,
      prefix: "",
      suffix: "%",
      diff: 15,
      diffColor: "success"
    }
  ]);

  // Simulate realtime updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => prevStats.map((stat, idx) => {
        // Simulate small random changes
        let change = 0;
        let diffChange = 0;
        if (idx === 0) { change = Math.round((Math.random() - 0.5) * 200); diffChange = (Math.random() - 0.5) * 2; }
        if (idx === 1) { change = Math.round((Math.random() - 0.5) * 10); diffChange = (Math.random() - 0.5) * 1; }
        if (idx === 2) { change = Math.round((Math.random() - 0.5) * 20); diffChange = (Math.random() - 0.5) * 1.5; }
        if (idx === 3) { change = ((Math.random() - 0.5) * 0.1); diffChange = (Math.random() - 0.5) * 0.5; }
        let newValue = stat.value + change;
        let newDiff = stat.diff + diffChange;
        if (idx === 3) newValue = Math.max(0, Math.min(100, parseFloat((newValue).toFixed(2))));
        else newValue = Math.max(0, newValue);
        // Clamp diff between -99 and 99 for realism
        newDiff = Math.max(-99, Math.min(99, parseFloat(newDiff.toFixed(1))));
        // Set color based on sign
        let diffColor = newDiff >= 0 ? "success" : "danger";
        return { ...stat, value: newValue, diff: newDiff, diffColor };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simulate real-time updates for only regionsData
  useEffect(() => {
    const interval = setInterval(() => {
      setRegionsData(prev => {
        let total = 100;
        let vals = prev.map(d => d.value);
        let idx = Math.floor(Math.random() * vals.length);
        let change = Math.round((Math.random() - 0.5) * 4);
        vals[idx] = Math.max(0, vals[idx] + change);
        let sum = vals.reduce((a, b) => a + b, 0);
        vals = vals.map(v => Math.round((v / sum) * 100));
        let diff = 100 - vals.reduce((a, b) => a + b, 0);
        vals[0] += diff;
        return prev.map((d, i) => ({ ...d, value: vals[i] }));
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Initialize dark mode before React hydration to prevent flash
  useEffect(() => {
    // Inject dark mode CSS variables into document
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --text-primary: #111827;
        --text-secondary: #4b5563;
        --bg-primary: #f9fafb;
        --bg-secondary: #ffffff;
        --border: #e5e7eb;
      }
      
      .dark {
        --text-primary: #f9fafb;
        --text-secondary: #d1d5db;
        --bg-primary: #111827;
        --bg-secondary: #1f2937;
        --border: #374151;
      }
      
      body {
        background-color: var(--bg-primary);
        color: var(--text-primary);
        transition: background-color 0.3s ease, color 0.3s ease;
      }
    `;
    
    if (!document.getElementById('dark-mode-styles')) {
      style.id = 'dark-mode-styles';
      document.head.appendChild(style);
    }
    
    // Force dark mode initially
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
    
    // Mark component as mounted
    setMounted(true);
    
    return () => {
      const existingStyles = document.getElementById('dark-mode-styles');
      if (existingStyles) document.head.removeChild(existingStyles);
    };
  }, []);
  
  // Toggle theme function with improved implementation
  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      
      // Apply to document element
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      
      // Update color-scheme property
      document.documentElement.style.colorScheme = newTheme;
      
      // Save preference to localStorage
      localStorage.setItem('dashboard-theme', newTheme);
      
      return newTheme;
    });
  };

  // Custom tooltip for charts
  const isMobile = useIsMobile();

  const CustomTooltip = ({ active, payload, label, isMobile }: { 
    active?: boolean; 
    payload?: Array<{ name: string; value: number | string; color: string; }>; 
    label?: string; 
    isMobile: boolean;
  }) => {
    const [tooltipStyle, setTooltipStyle] = React.useState<React.CSSProperties>({});
    React.useEffect(() => {
      if (typeof window === 'undefined') return;
      function handleMove(e: MouseEvent | TouchEvent) {
        let x = 0;
        if ('touches' in e && e.touches.length > 0) {
          x = e.touches[0].clientX;
        } else if ('clientX' in e) {
          x = e.clientX;
        }
        const vw = window.innerWidth;
        let left = x - 150; // try to center
        if (left < 8) left = 8;
        if (left + 300 > vw) left = vw - 308;
        setTooltipStyle({ left, position: 'fixed', zIndex: 50, maxWidth: '90vw', wordBreak: 'break-word', pointerEvents: 'none' });
      }
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('touchmove', handleMove);
      return () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('touchmove', handleMove);
      };
    }, []);
    if (active && payload && payload.length) {
      return (
        <div 
          className="p-3 rounded-lg shadow-lg border max-w-xs"
          style={{
            backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
            borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
            color: theme === "dark" ? "#f9fafb" : "#111827",
            ...tooltipStyle
          }}
        >
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: entry.color }}
                />
                <span style={{ color: theme === "dark" ? "#d1d5db" : "#4b5563" }}>
                  {entry.name}
                </span>
              </div>
              <span className="font-medium ml-4">
                {typeof entry.value === "number"
                  ? entry.name.toLowerCase().includes("sales")
                    ? `$${entry.value.toLocaleString()}`
                    : entry.value.toLocaleString()
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Show a loading skeleton until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#111827" }}>
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 rounded mb-4" style={{ backgroundColor: "#1f2937" }}></div>
          <div className="h-4 w-48 rounded" style={{ backgroundColor: "#1f2937" }}></div>
        </div>
      </div>
    );
  }

  // Add these functions before the return statement
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: theme === 'dark' ? '#1f2937' : '#ffffff',
          color: theme === 'dark' ? '#f9fafb' : '#111827',
          border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
        },
      });
    } catch (err) {
      toast.error('Failed to copy link', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: theme === 'dark' ? '#1f2937' : '#ffffff',
          color: theme === 'dark' ? '#f9fafb' : '#111827',
          border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
        },
      });
    }
  };

  const handleExportPDF = () => {
    // Simulate PDF export
    toast.success('Dashboard exported as PDF!', {
      duration: 2000,
      position: 'top-center',
      style: {
        background: theme === 'dark' ? '#1f2937' : '#ffffff',
        color: theme === 'dark' ? '#f9fafb' : '#111827',
        border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
      },
    });
  };

  // Remove react-spring usage, use framer-motion for animation
  function AnimatedNumber({ value, format }: { value: number, format?: (v: number) => string }) {
    const motionValue = useMotionValue(value);
    const ref = React.useRef<HTMLSpanElement>(null);
    React.useEffect(() => {
      motionValue.set(value);
    }, [value, motionValue]);
    useAnimationFrame(() => {
      if (ref.current) {
        ref.current.textContent = format ? format(motionValue.get()) : Math.round(motionValue.get()).toLocaleString();
      }
    });
    return <span ref={ref}>{format ? format(value) : Math.round(value).toLocaleString()}</span>;
  }

  return (
    <div className={`min-h-screen p-4 md:p-6 transition-colors duration-200 ${montserrat.className}`} style={darkModeStyles}>
      <Toaster />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: theme === "dark" ? colors.primary.dark : colors.primary.light }}>
              Sales Analytics Dashboard
            </h1>
            <p style={secondaryTextStyle} className="text-sm md:text-base">
              Comprehensive overview of sales performance and customer metrics
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
        <button 
              onClick={toggleTheme}
              className="p-2 rounded-full shadow-sm border cursor-pointer hover:bg-opacity-80 transition-colors"
              style={cardStyles}
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" style={{ color: theme === "dark" ? colors.warning.dark : colors.warning.light }} />
              ) : (
                <Moon className="w-5 h-5" style={{ color: theme === "dark" ? colors.warning.dark : colors.warning.light }} />
              )}
            </button>
                <button 
              onClick={handleShare}
              className="p-2 md:px-4 rounded-lg flex items-center cursor-pointer gap-2 border shadow-sm text-sm hover:bg-opacity-80 transition-colors"
              style={cardStyles}
                >
              <Share2 className="w-4 h-4" style={{ color: theme === "dark" ? colors.primary.dark : colors.primary.light }} />
              <span>Share</span>
                </button>
                <button 
              onClick={handleExportPDF}
              className="p-2 md:px-4 rounded-lg flex items-center cursor-pointer gap-2 text-white shadow-sm text-sm hover:bg-opacity-80 transition-colors"
              style={{ backgroundColor: theme === "dark" ? colors.primary.dark : colors.primary.light }}
                >
              <FileDown className="w-4 h-4" />
              Export PDF
                </button>
              </div>
            </div>
            
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((card, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow"
              style={cardStyles}
            >
              <div className="flex justify-between items-center mb-3">
                {card.icon}
                <span
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: card.diffColor === "success" 
                      ? (theme === "dark" ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.1)") 
                      : (theme === "dark" ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.1)"),
                    color: card.diffColor === "success" 
                      ? (theme === "dark" ? colors.success.dark : colors.success.light)
                      : (theme === "dark" ? colors.danger.dark : colors.danger.light)
                  }}
                >
                  <AnimatedNumber
                    value={card.diff}
                    format={val => `${val > 0 ? '+' : ''}${val.toFixed(1)}%`}
                  />
                </span>
              </div>
              <div style={secondaryTextStyle} className="text-sm">
                {card.label}
                </div>
              <div className="text-2xl font-bold mt-1">
                <AnimatedNumber
                  value={card.value}
                  format={index === 3
                    ? (val) => `${val.toFixed(1)}${card.suffix || ''}`
                    : (val) => `${card.prefix || ''}${Math.round(val).toLocaleString()}`}
                />
              </div>
          </div>
        ))}
      </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Sales Performance Chart */}
          <div 
            className="lg:col-span-2 p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow" 
            style={cardStyles}
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="w-5 h-5" style={{ color: theme === "dark" ? colors.primary.dark : colors.primary.light }} />
              <h2 className="text-lg font-semibold">Sales Performance</h2>
            </div>
            <div className="h-64 md:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme === "dark" ? colors.border.dark : colors.border.light}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: theme === "dark" ? colors.text.secondary.dark : colors.text.secondary.light }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: theme === "dark" ? colors.text.secondary.dark : colors.text.secondary.light }}
                  />
                  <Tooltip content={<CustomTooltip isMobile={isMobile} />} />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke={chartColors.sales}
                    strokeWidth={3}
                    dot={{ fill: chartColors.sales, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Actual Sales"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke={chartColors.target}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: chartColors.target, r: 4 }}
                    name="Target"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div 
            className="p-4 rounded-xl border shadow-sm" 
            style={cardStyles}
          >
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5" style={{ color: theme === "dark" ? colors.secondary.dark : colors.secondary.light }} />
              <h2 className="text-lg font-semibold">Customer Distribution</h2>
            </div>
            <div className="flex flex-col items-center w-full max-w-md mx-auto">
              <div className="w-full h-56 md:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerData}
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      labelLine={false}
                    >
                      {customerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:justify-center gap-2 mt-2 mb-2">
                {customerData.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-base">
                    <span className="w-4 h-4 rounded-full block" style={{ backgroundColor: entry.color }}></span>
                    <span>{entry.name} <span className="font-semibold">{entry.value}%</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div 
            className="p-4 rounded-xl border shadow-sm" 
            style={cardStyles}
          >
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="w-5 h-5" style={{ color: theme === "dark" ? colors.primary.dark : colors.primary.light }} />
              <h2 className="text-lg font-semibold">Sales Channel Distribution</h2>
                    </div>
            <div className="flex flex-col items-center w-full max-w-md mx-auto">
              <div className="w-full h-56 md:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesDistribution}
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      labelLine={false}
                    >
                      {salesDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:justify-center gap-2 mt-2 mb-2">
                {salesDistribution.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-base">
                    <span className="w-4 h-4 rounded-full block" style={{ backgroundColor: entry.color }}></span>
                    <span>{entry.name} <span className="font-semibold">{entry.value}%</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
                  
          <div 
            className="p-4 rounded-xl border shadow-sm" 
            style={cardStyles}
          >
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5" style={{ color: theme === "dark" ? colors.primary.dark : colors.primary.light }} />
              <h2 className="text-lg font-semibold">Regional Sales Performance</h2>
                      </div>
            <div className="space-y-5 mt-4 px-2">
              {regionsData.map((region, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span style={secondaryTextStyle}>
                      {region.region}
                    </span>
                    <span className="font-medium">
                      {region.value}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" 
                    style={{ backgroundColor: theme === "dark" ? colors.border.dark : colors.border.light }}
                  >
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${region.value}%`,
                        backgroundColor: region.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm pb-4" style={secondaryTextStyle}>
          <p>Dashboard last updated: {new Date().toLocaleDateString()}</p>
      </div>
      </div>
    </div>
  );
}