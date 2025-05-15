"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lora, Outfit } from "next/font/google";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Smartphone,
  Laptop,
  Tablet,
  Moon,
  Sun,
  ChevronRight,
  Info,
  X,
  ArrowLeft,
} from "lucide-react";
import { FiAward, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
});

type ThemeMode = "light" | "dark";

interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  card: string;
  border: string;
}

interface Theme {
  light: ThemeColors;
  dark: ThemeColors;
}

interface DailyUsage {
  hour: number;
  phone: number;
  laptop: number;
  tablet: number;
}

interface WeeklySummary {
  device: string;
  timeSpent: number;
  goal: number;
  icon: React.ReactNode;
  color: string;
}

interface UsageData {
  dailyUsage: DailyUsage[];
  deviceSwitching: { time: string; device: string }[];
  weeklyUsage: {
    day: string;
    phone: number;
    laptop: number;
    tablet: number;
  }[];
  weeklySummary: WeeklySummary[];
}

const ThemeContext = createContext<{
  theme: ThemeMode;
  toggleTheme: () => void;
  colors: ThemeColors;
}>({
  theme: "light",
  toggleTheme: () => {},
  colors: {} as ThemeColors,
});

const theme: Theme = {
  light: {
    background: "#F8F9FC",
    foreground: "#121212",
    primary: "#6366F1",
    secondary: "#EC4899",
    accent: "#34D399",
    muted: "#E2E8F0",
    card: "#FFFFFF",
    border: "#E2E8F0",
  },
  dark: {
    background: "#111827",
    foreground: "#F3F4F6",
    primary: "#818CF8",
    secondary: "#F472B6",
    accent: "#10B981",
    muted: "#1F2937",
    card: "#1E293B",
    border: "#374151",
  },
};

const mockData: UsageData = {
  dailyUsage: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    phone: Math.floor(Math.random() * 60),
    laptop: Math.floor(Math.random() * 60),
    tablet: Math.floor(Math.random() * 30),
  })),
  deviceSwitching: [
    { time: "08:00", device: "phone" },
    { time: "09:30", device: "laptop" },
    { time: "12:15", device: "phone" },
    { time: "13:00", device: "laptop" },
    { time: "17:30", device: "tablet" },
    { time: "19:45", device: "phone" },
    { time: "21:30", device: "laptop" },
    { time: "22:45", device: "phone" },
  ],
  weeklyUsage: [
    { day: "Mon", phone: 150, laptop: 240, tablet: 60 },
    { day: "Tue", phone: 120, laptop: 280, tablet: 45 },
    { day: "Wed", phone: 190, laptop: 220, tablet: 30 },
    { day: "Thu", phone: 160, laptop: 250, tablet: 70 },
    { day: "Fri", phone: 170, laptop: 230, tablet: 80 },
    { day: "Sat", phone: 210, laptop: 190, tablet: 110 },
    { day: "Sun", phone: 230, laptop: 160, tablet: 90 },
  ],
  weeklySummary: [
    {
      device: "Phone",
      timeSpent: 18.5,
      goal: 14,
      icon: <Smartphone size={24} />,
      color: "#F472B6",
    },
    {
      device: "Laptop",
      timeSpent: 24.2,
      goal: 30,
      icon: <Laptop size={24} />,
      color: "#818CF8",
    },
    {
      device: "Tablet",
      timeSpent: 8.3,
      goal: 10,
      icon: <Tablet size={24} />,
      color: "#34D399",
    },
  ],
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const colors = theme[themeMode];

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setThemeMode(prefersDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme: themeMode, toggleTheme, colors }}>
      <div
        style={{
          backgroundColor: colors.background,
          color: colors.foreground,
        }}
        className="min-h-screen transition-colors duration-300"
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
  const { colors } = useTheme();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const icons = {
    success: <FiCheckCircle size={20} />,
    error: <FiAlertCircle size={20} />,
    info: <Info size={20} />,
  };
  
  const bgColors = {
    success: colors.accent,
    error: colors.secondary,
    info: colors.primary,
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 shadow-lg flex items-center gap-2"
      style={{ backgroundColor: bgColors[type], color: "#fff" }}
    >
      {icons[type]}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2">
        <X size={16} />
      </button>
    </motion.div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const { colors } = useTheme();
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 backdrop-blur-sm bg-black/30"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="relative z-10 w-full max-w-md rounded-xl p-6 shadow-xl"
          style={{ backgroundColor: colors.card }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-opacity-10 transition-colors"
              style={{ backgroundColor: `${colors.muted}20` }}
            >
              <X size={20} />
            </button>
          </div>
          <div>{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

type VariantStyle = {
  bg: string;
  hover: string;
  text: string;
  border?: string;
};

const Button = ({
  variant = "primary",
  size = "md",
  children,
  className,
  ...props
}: ButtonProps) => {
  const { colors } = useTheme();
  
  const variantStyles: Record<string, VariantStyle> = {
    primary: {
      bg: colors.primary,
      hover: `${colors.primary}dd`,
      text: "#ffffff",
    },
    secondary: {
      bg: colors.secondary,
      hover: `${colors.secondary}dd`,
      text: "#ffffff",
    },
    outline: {
      bg: "transparent",
      hover: `${colors.muted}30`,
      text: colors.foreground,
      border: `1px solid ${colors.border}`,
    },
  };
  
  const sizeStyles = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
  };
  
  const selected = variantStyles[variant];
  
  return (
    <button
      style={{
        backgroundColor: selected.bg,
        color: selected.text,
        border: selected.border || "none",
      }}
      className={`rounded-lg font-medium transition-all duration-200 ${
        sizeStyles[size]
      } hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};


interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Card = ({ title, children, className, style }: CardProps) => {
  const { colors } = useTheme();
  
  return (
    <div
      style={{ 
        backgroundColor: colors.card, 
        borderWidth: "1px",
        borderStyle: "solid",
        borderTopColor: colors.border,
        borderRightColor: colors.border,
        borderBottomColor: colors.border,
        borderLeftColor: colors.border,
        ...style 
      }}
      className={`rounded-xl shadow-sm p-5 ${className}`}
    >
      {title && (
        <h3 className="text-lg font-medium mb-4" style={{ fontFamily: "var(--font-lora)" }}>{title}</h3>
      )}
      {children}
    </div>
  );
};


const BarChartComponent = () => {
  const { colors } = useTheme();
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={mockData.weeklyUsage} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={`${colors.border}80`} />
        <XAxis dataKey="day" stroke={colors.foreground} />
        <YAxis stroke={colors.foreground} />
        <Tooltip
          contentStyle={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.foreground,
          }}
        />
        <Bar dataKey="phone" stackId="a" fill="#F472B6" />
        <Bar dataKey="laptop" stackId="a" fill="#818CF8" />
        <Bar dataKey="tablet" stackId="a" fill="#34D399" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const AreaChartComponent = () => {
  const { colors } = useTheme();
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={mockData.dailyUsage} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={`${colors.border}80`} />
        <XAxis
          dataKey="hour"
          stroke={colors.foreground}
          tickFormatter={(hour) => `${hour}:00`}
        />
        <YAxis stroke={colors.foreground} />
        <Tooltip
          contentStyle={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.foreground,
          }}
        />
        <Area
          type="monotone"
          dataKey="phone"
          stackId="1"
          stroke="#F472B6"
          fill="#F472B6"
        />
        <Area
          type="monotone"
          dataKey="laptop"
          stackId="1"
          stroke="#818CF8"
          fill="#818CF8"
        />
        <Area
          type="monotone"
          dataKey="tablet"
          stackId="1"
          stroke="#34D399"
          fill="#34D399"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const PieChartComponent = () => {
  const { colors } = useTheme();
  
  const totalByDevice = mockData.weeklyUsage.reduce(
    (acc, day) => {
      acc.phone += day.phone;
      acc.laptop += day.laptop;
      acc.tablet += day.tablet;
      return acc;
    },
    { phone: 0, laptop: 0, tablet: 0 }
  );
  
  const data = [
    { name: "Phone", value: totalByDevice.phone, color: "#F472B6" },
    { name: "Laptop", value: totalByDevice.laptop, color: "#818CF8" },
    { name: "Tablet", value: totalByDevice.tablet, color: "#34D399" },
  ];
  
  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            innerRadius={50}
            dataKey="value"
            label={({ name, percent }) => {
              const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
              // Only show labels on screens larger than mobile (e.g., 768px)
              return screenWidth > 768 ? `${name} ${(percent * 100).toFixed(0)}%` : null;
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Legend for mobile screens */}
      <div className="flex justify-center flex-wrap gap-6 mt-4 md:hidden">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm">{entry.name} {((entry.value / Object.values(totalByDevice).reduce((a, b) => a + b, 0)) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const WeeklySummaryComponent = () => {
  const { colors } = useTheme();
  
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      {mockData.weeklySummary.map((item, index) => (
        <Card key={index} style={{ 
          borderLeftWidth: "4px",
          borderLeftStyle: "solid",
          borderLeftColor: item.color 
        }}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div
                className="p-2 rounded-full"
                style={{ backgroundColor: `${item.color}20` }}
              >
                {item.icon}
              </div>
              <h4 className="font-medium">{item.device}</h4>
            </div>
            <span
              className="text-sm px-2 py-1 rounded-full font-medium"
              style={{
                backgroundColor:
                  item.timeSpent > item.goal
                    ? `${colors.secondary}20`
                    : `${colors.accent}20`,
                color: item.timeSpent > item.goal ? colors.secondary : colors.accent,
              }}
            >
              {item.timeSpent > item.goal ? "Over Goal" : "Under Goal"}
            </span>
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between mb-1 text-sm">
              <span>Current: {item.timeSpent}h</span>
              <span>Goal: {item.goal}h</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.muted }}>
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (item.timeSpent / item.goal) * 100)}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
          
          <div className="text-sm mt-3" style={{ color: `${colors.foreground}80` }}>
            {item.timeSpent > item.goal ? (
              <span>{(item.timeSpent - item.goal).toFixed(1)}h over your weekly goal</span>
            ) : (
              <span>{(item.goal - item.timeSpent).toFixed(1)}h under your weekly goal</span>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

const Home = ({ onDashboardClick }: { onDashboardClick: () => void }) => {
  const { colors } = useTheme();
  
  return (
    <section className="py-10 md:py-20 px-4 min-h-[90vh] flex items-center">
      <div className="max-w-4xl mx-auto text-center">
        <div
          className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-4 md:mb-6"
          style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
        >
          Understand Your Digital Life
        </div>
        
        <h1
          className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          style={{ fontFamily: "var(--font-lora)" }}
        >
          Want to reduce screen time?
          <span
            className="block"
            style={{ color: colors.primary }}
          >
            Start by understanding it.
          </span>
        </h1>
        
        <p
          className="text-lg md:text-xl mb-10 max-w-2xl mx-auto"
          style={{ color: `${colors.foreground}90` }}
        >
          Our intuitive dashboard helps you visualize your device usage habits,
          identify patterns, and set achievable goals for a healthier digital
          lifestyle.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={onDashboardClick} className="flex items-center justify-center gap-1 w-64 mx-auto">
            Go to Dashboard <ChevronRight size={18} className="ml-1" />
          </Button>
        </div>
        
        <div className="mt-16">
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
            alt="Digital wellness illustration"
            className="rounded-xl shadow-lg w-full object-cover h-[300px] md:h-[400px]"
          />
        </div>
      </div>
    </section>
  );
};

const Dashboard = () => {
  const { colors } = useTheme();
  
  return (
    <section className="pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "var(--font-lora)" }}
          >
            Your Digital Dashboard
          </h2>
          <p style={{ color: `${colors.foreground}80` }}>
            Track, analyze, and optimize your screen time across all devices.
          </p>
        </div>
        
        <div className="mb-8">
          <h3
            className="text-xl font-semibold mb-4"
            style={{ fontFamily: "var(--font-lora)" }}
          >
            Weekly Summary
          </h3>
          <WeeklySummaryComponent />
        </div>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mb-6">
          <Card title="Daily Usage Breakdown">
            <AreaChartComponent />
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#F472B6" }} />
                <span className="text-sm">Phone</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#818CF8" }} />
                <span className="text-sm">Laptop</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#34D399" }} />
                <span className="text-sm">Tablet</span>
              </div>
            </div>
          </Card>
          
          <Card title="Total Screen Time Distribution">
            <PieChartComponent />
          </Card>
        </div>
        
        <Card title="Weekly Usage Trends">
          <BarChartComponent />
        </Card>
      </div>
    </section>
  );
};

const Header = ({ onThemeToggle }: { onThemeToggle: () => void }) => {
  const { theme, colors, toggleTheme } = useTheme();
  
  return (
    <header
      className="py-4 px-6 sticky top-0 z-10 backdrop-blur-md"
      style={{
        backgroundColor: `${colors.background}80`,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <FiAward className="text-white" size={18} />
          </div>
          <span
            className="text-xl font-semibold"
            style={{ fontFamily: "var(--font-lora)" }}
          >
            GadgetTrack
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full cursor-pointer"
            style={{ backgroundColor: `${colors.muted}30` }}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  const { colors } = useTheme();
  
  return (
    <footer
      className="py-8 px-6"
      style={{ borderTop: `1px solid ${colors.border}` }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <div
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <FiAward className="text-white" size={14} />
            </div>
            <span className="font-semibold">GadgetTrack</span>
          </div>
          <p className="text-sm" style={{ color: `${colors.foreground}80` }}>
            Take control of your digital habits
          </p>
        </div>
        
        <div className="text-sm text-center" style={{ color: `${colors.foreground}60` }}>
          © {new Date().getFullYear()} GadgetTrack. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [view, setView] = useState<"home" | "dashboard">("home");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  
  const handleShowToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
  };
  
  const handleHideToast = () => {
    setToast(null);
  };
  
  const handleDashboardClick = () => {
    setView("dashboard");
    handleShowToast("Welcome to your dashboard!", "success");
  };
  
  const handleBackToHome = () => {
    setView("home");
  };

  return (
    <ThemeProvider>
      <main className={`${lora.variable} ${outfit.variable} font-sans`}>
        <Header onThemeToggle={() => {}} />
        
        {view === "home" ? (
          <Home onDashboardClick={handleDashboardClick} />
        ) : (
          <div>
            <div className="max-w-6xl mx-auto pt-6 pl-4 lg:pl-0">
              <button
                onClick={handleBackToHome}
                className="flex items-center gap-1 mb-4 hover:underline text-sm cursor-pointer"
              >
                <ArrowLeft size={16} /> Back to Home
              </button>
            </div>
            <Dashboard />
          </div>
        )}
        
        <Footer />
        
        <AnimatePresence>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={handleHideToast}
            />
          )}
        </AnimatePresence>
      </main>
    </ThemeProvider>
  );
}