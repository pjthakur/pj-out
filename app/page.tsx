"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Home,
  CreditCard,
  Moon,
  Sun,
  Plus,
  Filter,
  ChevronDown,
  Clock,
  Wallet,
  PieChart as PieChartIcon,
  DollarSign,
  ArrowLeft,
  Menu,
  X,
  AlertCircle,
} from "lucide-react";

interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  paymentMethod: PaymentMethod;
  icon?: string;
  timestamp?: number;
}

type PaymentMethod = "Credit Card" | "PayPal" | "Net Banking";
type TimeFilter = "day" | "week" | "month" | "quarter" | "year" | "all";

interface Payment {
  method: PaymentMethod;
  monthlyLimit: number;
  spent: number;
  color: string;
  icon: React.ReactNode;
}

interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  paymentMethod: PaymentMethod;
  icon: string;
  color: string;
  date: string;
  timestamp: number;
}

interface User {
  name: string;
  fullName: string;
  position: string;
  avatar: string;
}

interface Category {
  name: string;
  color: string;
  icon: string;
}

interface DashboardData {
  user: User;
  totalIncome: number;
  totalSpent: number;
  savings: number;
  monthlyLimit: number;
  expenses: Expense[];
  payments: Payment[];
  transactions: Transaction[];
  categories: Category[];
}

interface NewExpense {
  description: string;
  amount: number;
  category: string;
  paymentMethod: PaymentMethod;
  date: string;
}

interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatCurrencyWithCents = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const getDateRangeForFilter = (
  filter: TimeFilter
): { start: number; end: number } => {
  const now = new Date();
  const end = now.getTime();
  let start: number;

  switch (filter) {
    case "day":
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      start = startOfDay.getTime();
      break;
    case "week":
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      start = startOfWeek.getTime();
      break;
    case "month":
      const startOfMonth = new Date(now);
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      start = startOfMonth.getTime();
      break;
    case "quarter":
      const startOfQuarter = new Date(now);
      const quarter = Math.floor(now.getMonth() / 3);
      startOfQuarter.setMonth(quarter * 3);
      startOfQuarter.setDate(1);
      startOfQuarter.setHours(0, 0, 0, 0);
      start = startOfQuarter.getTime();
      break;
    case "year":
      const startOfYear = new Date(now);
      startOfYear.setMonth(0);
      startOfYear.setDate(1);
      startOfYear.setHours(0, 0, 0, 0);
      start = startOfYear.getTime();
      break;
    case "all":
    default:
      start = 0;
      break;
  }

  return { start, end };
};

const getRandomRecentDate = (): { dateStr: string; timestamp: number } => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 365); // Random day within the last year
  const date = new Date(now);
  date.setDate(now.getDate() - daysAgo);

  return {
    dateStr: date.toISOString().split("T")[0],
    timestamp: date.getTime(),
  };
};

const generateMockData = (): DashboardData => {
  const categories: Category[] = [
    { name: "Investment", color: "#6c5ce7", icon: "I" },
    { name: "Food", color: "#fdcb6e", icon: "F" },
    { name: "Transport", color: "#e84393", icon: "T" },
    { name: "Bills", color: "#0984e3", icon: "B" },
    { name: "Shopping", color: "#00b894", icon: "S" },
    { name: "Entertainment", color: "#a29bfe", icon: "E" },
  ];

  const timeline: Expense[] = [];

  for (let q = 0; q < 6; q++) {
    categories.forEach((category) => {
      const randomDate = getRandomRecentDate();
      timeline.push({
        id: `q${q}-${category.name}`,
        date: `Q${q + 15}`, // Q15, Q16, ...
        amount: 100 + Math.floor(Math.random() * 900),
        category: category.name,
        description: `${category.name} expenses for Q${q + 15}`,
        paymentMethod: ["Credit Card", "PayPal", "Net Banking"][
          Math.floor(Math.random() * 3)
        ] as PaymentMethod,
        timestamp: randomDate.timestamp,
      });
    });
  }

  for (let d = 0; d < 30; d++) {
    const numCategoriesForDay = 2 + Math.floor(Math.random() * 2);
    const shuffledCategories = [...categories].sort(() => 0.5 - Math.random());
    const dailyCategories = shuffledCategories.slice(0, numCategoriesForDay);

    const date = new Date();
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().split("T")[0];

    dailyCategories.forEach((category) => {
      timeline.push({
        id: `d${d}-${category.name}`,
        date: dateStr,
        amount: 10 + Math.floor(Math.random() * 90),
        category: category.name,
        description: `${category.name} expenses for ${dateStr}`,
        paymentMethod: ["Credit Card", "PayPal", "Net Banking"][
          Math.floor(Math.random() * 3)
        ] as PaymentMethod,
        timestamp: date.getTime(),
      });
    });
  }

  const transactions: Transaction[] = [
    {
      id: "tx1",
      name: "Domino's Pizza",
      category: "Food",
      amount: 17.25,
      paymentMethod: "Credit Card",
      icon: "D",
      color: categories.find((c) => c.name === "Food")?.color || "#fdcb6e",
      date: new Date().toISOString().split("T")[0],
      timestamp: new Date().getTime() - 2 * 3600 * 1000,
    },
    {
      id: "tx2",
      name: "Electricity",
      category: "Bills",
      amount: 60.5,
      paymentMethod: "PayPal",
      icon: "E",
      color: categories.find((c) => c.name === "Bills")?.color || "#0984e3",
      date: new Date().toISOString().split("T")[0],
      timestamp: new Date().getTime() - 5 * 3600 * 1000,
    },
    {
      id: "tx3",
      name: "Clothes",
      category: "Shopping",
      amount: 124.75,
      paymentMethod: "Credit Card",
      icon: "C",
      color: categories.find((c) => c.name === "Shopping")?.color || "#00b894",
      date: new Date().toISOString().split("T")[0],
      timestamp: new Date().getTime() - 12 * 3600 * 1000,
    },
    {
      id: "tx4",
      name: "Earphones",
      category: "Shopping",
      amount: 110.95,
      paymentMethod: "Net Banking",
      icon: "E",
      color: categories.find((c) => c.name === "Shopping")?.color || "#00b894",
      date: new Date(new Date().getTime() - 24 * 3600 * 1000)
        .toISOString()
        .split("T")[0],
      timestamp: new Date().getTime() - 24 * 3600 * 1000,
    },
    {
      id: "tx5",
      name: "Mutual Funds",
      category: "Investment",
      amount: 509.25,
      paymentMethod: "Net Banking",
      icon: "M",
      color:
        categories.find((c) => c.name === "Investment")?.color || "#6c5ce7",
      date: new Date(new Date().getTime() - 48 * 3600 * 1000)
        .toISOString()
        .split("T")[0],
      timestamp: new Date().getTime() - 48 * 3600 * 1000,
    },
    {
      id: "tx6",
      name: "Netflix",
      category: "Entertainment",
      amount: 15.99,
      paymentMethod: "PayPal",
      icon: "N",
      color:
        categories.find((c) => c.name === "Entertainment")?.color || "#a29bfe",
      date: new Date(new Date().getTime() - 72 * 3600 * 1000)
        .toISOString()
        .split("T")[0],
      timestamp: new Date().getTime() - 72 * 3600 * 1000,
    },
    {
      id: "tx7",
      name: "Uber",
      category: "Transport",
      amount: 23.5,
      paymentMethod: "Credit Card",
      icon: "U",
      color: categories.find((c) => c.name === "Transport")?.color || "#e84393",
      date: new Date(new Date().getTime() - 4 * 24 * 3600 * 1000)
        .toISOString()
        .split("T")[0],
      timestamp: new Date().getTime() - 4 * 24 * 3600 * 1000,
    },
    {
      id: "tx8",
      name: "Coffee Shop",
      category: "Food",
      amount: 8.75,
      paymentMethod: "Credit Card",
      icon: "C",
      color: categories.find((c) => c.name === "Food")?.color || "#fdcb6e",
      date: new Date(new Date().getTime() - 5 * 24 * 3600 * 1000)
        .toISOString()
        .split("T")[0],
      timestamp: new Date().getTime() - 5 * 24 * 3600 * 1000,
    },
  ];

  const payments: Payment[] = [
    {
      method: "Credit Card",
      monthlyLimit: 2000,
      spent: 1200,
      color: "#e84393",
      icon: <CreditCard size={20} />,
    },
    {
      method: "PayPal",
      monthlyLimit: 1000,
      spent: 350,
      color: "#0984e3",
      icon: <DollarSign size={20} />,
    },
    {
      method: "Net Banking",
      monthlyLimit: 1500,
      spent: 850,
      color: "#00b894",
      icon: <CreditCard size={20} />,
    },
  ];

  const totalIncome = 5000;
  const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0) + 500; // Add some padding
  const savings = totalIncome - totalSpent;

  return {
    user: {
      name: "John",
      fullName: "John Doe",
      position: "UI Designer",
      avatar: "/avatar.jpg",
    },
    totalIncome,
    totalSpent,
    savings,
    monthlyLimit: 3500,
    expenses: timeline,
    payments,
    transactions,
    categories,
  };
};

const NotificationSystem: React.FC<{
  notifications: Notification[];
  removeNotification: (id: string) => void;
}> = ({ notifications, removeNotification }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center justify-between p-4 rounded-xl shadow-lg text-white transform transition-all duration-300 ease-in-out ${
            notification.type === "success"
              ? "bg-gradient-to-r from-green-500 to-green-400"
              : notification.type === "error"
              ? "bg-gradient-to-r from-red-500 to-red-400"
              : "bg-gradient-to-r from-blue-500 to-purple-500"
          }`}
          style={{ minWidth: "300px", maxWidth: "400px" }}
        >
          <div className="flex items-center">
            <AlertCircle size={18} className="mr-2" />
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-4 text-white hover:text-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

const ExpensesDashboardClient: React.FC = () => {
    const [isClient, setIsClient] = useState(false);

  const [dashboardData, setDashboardData] = useState<DashboardData>(
    generateMockData()
  );
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("month");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [newExpense, setNewExpense] = useState<NewExpense>({
    description: "",
    amount: 0,
    category: dashboardData.categories[0].name,
    paymentMethod: "Credit Card",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Add useEffect to prevent background scrolling when modal is open
  useEffect(() => {
    if (showAddExpense) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddExpense]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSidebarOpen(window.innerWidth >= 1024);
      
      const handleResize = () => {
        setIsSidebarOpen(window.innerWidth >= 1024);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const addNotification = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications([...notifications, { id, message, type }]);

    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  };

  const removeNotification = (id: string) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const getFilteredData = () => {
    const { start, end } = getDateRangeForFilter(timeFilter);
    console.log("Filter range:", new Date(start), "to", new Date(end)); 
  
    let filteredTransactions = dashboardData.transactions.filter(
      (tx) => tx.timestamp >= start && tx.timestamp <= end
    );
  
    if (categoryFilter) {
      filteredTransactions = filteredTransactions.filter(
        (tx) => tx.category === categoryFilter
      );
    }
  
    let filteredExpenses = dashboardData.expenses.filter(
      (exp) => (exp.timestamp || 0) >= start && (exp.timestamp || 0) <= end
    );
  
    if (categoryFilter) {
      filteredExpenses = filteredExpenses.filter(
        (exp) => exp.category === categoryFilter
      );
    }
  
    return { filteredTransactions, filteredExpenses };
  };

  const { filteredTransactions, filteredExpenses } = getFilteredData();

  const getUpdatedPaymentMethods = () => {
    const updatedPayments = dashboardData.payments.map((payment) => ({
      method: payment.method,
      monthlyLimit: payment.monthlyLimit,
      spent: 0,
      color: payment.color,
      icon: payment.icon,
    }));

    filteredTransactions.forEach((tx) => {
      const paymentMethod = updatedPayments.find(
        (p) => p.method === tx.paymentMethod
      );
      if (paymentMethod) {
        paymentMethod.spent += tx.amount;
      }
    });

    return updatedPayments;
  };

  const updatedPaymentMethods = getUpdatedPaymentMethods();

  const generateTimelineChartData = () => {
    if (
      timeFilter === "quarter" ||
      timeFilter === "year" ||
      timeFilter === "all"
    ) {
      const quarterData: Record<string, Record<string, number>> = {};

      filteredExpenses.forEach((expense) => {
        if (expense.date.startsWith("Q")) {
          const quarter = expense.date;
          if (!quarterData[quarter]) {
            quarterData[quarter] = {};
          }

          if (!quarterData[quarter][expense.category]) {
            quarterData[quarter][expense.category] = 0;
          }

          quarterData[quarter][expense.category] += expense.amount;
        } else {
          const date = new Date(expense.date);
          const quarter = `Q${
            Math.floor(date.getMonth() / 3) + 1
          } ${date.getFullYear()}`;

          if (!quarterData[quarter]) {
            quarterData[quarter] = {};
          }

          if (!quarterData[quarter][expense.category]) {
            quarterData[quarter][expense.category] = 0;
          }

          quarterData[quarter][expense.category] += expense.amount;
        }
      });

      return Object.keys(quarterData)
        .sort()
        .map((quarter) => {
          return {
            name: quarter,
            ...quarterData[quarter],
          };
        });
    } else if (timeFilter === "month") {
      const weekData: Record<string, Record<string, number>> = {};

      filteredExpenses.forEach((expense) => {
        if (!expense.date) return;

        const date = new Date(expense.date);
        const weekNumber = Math.ceil(
          (date.getDate() +
            new Date(date.getFullYear(), date.getMonth(), 1).getDay()) /
            7
        );
        const weekLabel = `Week ${weekNumber}`;

        if (!weekData[weekLabel]) {
          weekData[weekLabel] = {};
        }

        if (!weekData[weekLabel][expense.category]) {
          weekData[weekLabel][expense.category] = 0;
        }

        weekData[weekLabel][expense.category] += expense.amount;
      });

      return Object.keys(weekData)
        .sort()
        .map((week) => {
          return {
            name: week,
            ...weekData[week],
          };
        });
    } else if (timeFilter === "week") {
      const dayData: Record<string, Record<string, number>> = {};

      filteredExpenses.forEach((expense) => {
        if (!expense.date) return;

        const date = new Date(expense.date);
        const day = date.toLocaleDateString("en-US", { weekday: "short" });

        if (!dayData[day]) {
          dayData[day] = {};
        }

        if (!dayData[day][expense.category]) {
          dayData[day][expense.category] = 0;
        }

        dayData[day][expense.category] += expense.amount;
      });

      const daysOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      return daysOrder.map((day) => {
        return {
          name: day,
          ...dayData[day],
        };
      });
    } else {
      const hourData: Record<string, Record<string, number>> = {};

      filteredExpenses.forEach((expense) => {
        if (!expense.timestamp) return;

        const date = new Date(expense.timestamp);
        const hour = date.getHours();
        const hourLabel = `${hour}:00`;

        if (!hourData[hourLabel]) {
          hourData[hourLabel] = {};
        }

        if (!hourData[hourLabel][expense.category]) {
          hourData[hourLabel][expense.category] = 0;
        }

        hourData[hourLabel][expense.category] += expense.amount;
      });

      return Object.keys(hourData)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map((hour) => {
          return {
            name: hour,
            ...hourData[hour],
          };
        });
    }
  };

  const timelineChartData = generateTimelineChartData();

  const getCategoryTotals = () => {
    const categoryTotals: Record<string, number> = {};

    filteredTransactions.forEach((tx) => {
      if (!categoryTotals[tx.category]) {
        categoryTotals[tx.category] = 0;
      }

      categoryTotals[tx.category] += tx.amount;
    });

    return Object.keys(categoryTotals).map((category) => {
      const categoryData = dashboardData.categories.find(
        (c) => c.name === category
      );
      return {
        name: category,
        value: categoryTotals[category],
        color: categoryData?.color || "#000",
      };
    });
  };

  const categoryPieData = getCategoryTotals();

  const totalFilteredExpenses = filteredTransactions.reduce(
    (sum, tx) => sum + tx.amount,
    0
  );
  const remainingBudget = dashboardData.monthlyLimit - totalFilteredExpenses;

  const handleAddExpense = () => {
    const newId = `tx${dashboardData.transactions.length + 1}`;
    const category = dashboardData.categories.find(
      (c) => c.name === newExpense.category
    );

    const newTransaction: Transaction = {
      id: newId,
      name: newExpense.description,
      category: newExpense.category,
      amount: newExpense.amount,
      paymentMethod: newExpense.paymentMethod,
      icon: newExpense.description.charAt(0).toUpperCase(),
      color: category?.color || "#000",
      date: newExpense.date,
      timestamp: new Date(newExpense.date).getTime(),
    };

    setDashboardData((prev) => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions],
      expenses: [
        ...prev.expenses,
        {
          id: `exp${prev.expenses.length + 1}`,
          date: newExpense.date,
          amount: newExpense.amount,
          category: newExpense.category,
          description: newExpense.description,
          paymentMethod: newExpense.paymentMethod,
          timestamp: new Date(newExpense.date).getTime(),
        },
      ],
    }));

    addNotification("Expense added successfully!", "success");

    setShowAddExpense(false);

    setNewExpense({
      description: "",
      amount: 0,
      category: dashboardData.categories[0].name,
      paymentMethod: "Credit Card",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const clearCategoryFilter = () => {
    setCategoryFilter(null);
    setDropdownOpen(false);
  };

  const handleSignOut = () => {
    addNotification("You have been signed out", "info");
  };

  const handleExpensesClick = () => {
    addNotification("Expenses section is coming soon", "info");
  };

  const getThemeStyles = () => {
    const baseStyles = {
      text: isDarkMode ? "text-gray-100" : "text-gray-800",
      background: isDarkMode ? "bg-gray-900" : "bg-gray-100",
      card: isDarkMode ? "bg-gray-800" : "bg-white",
      cardNeumorphic: isDarkMode
        ? "bg-gray-800 shadow-[8px_8px_16px_0px_rgba(0,0,0,0.3),-8px_-8px_16px_0px_rgba(35,35,45,0.7)]"
        : "bg-white shadow-[6px_6px_12px_0px_rgba(174,174,192,0.4),-6px_-6px_12px_0px_rgba(255,255,255,0.8),inset_1px_1px_1px_0px_rgba(255,255,255,1),inset_-1px_-1px_1px_0px_rgba(174,174,192,0.2)]",
      buttonNeumorphic: isDarkMode
        ? "bg-gray-800 shadow-[4px_4px_8px_0px_rgba(0,0,0,0.3),-4px_-4px_8px_0px_rgba(35,35,45,0.7)] hover:shadow-[2px_2px_4px_0px_rgba(0,0,0,0.3),-2px_-2px_4px_0px_rgba(35,35,45,0.7)] active:shadow-inner"
        : "bg-white shadow-[4px_4px_8px_0px_rgba(174,174,192,0.4),-4px_-4px_8px_0px_rgba(255,255,255,0.8)] hover:shadow-[2px_2px_4px_0px_rgba(174,174,192,0.4),-2px_-2px_4px_0px_rgba(255,255,255,0.8)] active:shadow-inner",
      inputNeumorphic: isDarkMode
        ? "bg-gray-800 shadow-inner shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3),inset_-2px_-2px_5px_rgba(35,35,45,0.7)]"
        : "bg-white shadow-inner shadow-[inset_2px_2px_4px_rgba(174,174,192,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]",
      progressBarBg: isDarkMode ? "bg-gray-700" : "bg-gray-200",
      border: isDarkMode ? "border-gray-700" : "border-gray-200",
      iconColor: isDarkMode ? "text-blue-400" : "text-blue-600",
      accent: isDarkMode ? "text-purple-400" : "text-blue-600",
      muted: isDarkMode ? "text-gray-400" : "text-gray-500",
      highlight: isDarkMode ? "bg-gray-700" : "bg-gray-100",
      chartColors: isDarkMode
        ? ["#bd93f9", "#ff79c6", "#8be9fd", "#50fa7b", "#ffb86c", "#ff5555"]
        : ["#6c5ce7", "#e84393", "#0984e3", "#00b894", "#fdcb6e", "#a29bfe"],
    };

    return baseStyles;
  };

  const theme = getThemeStyles();

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-medium text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col min-h-screen font-sans ${theme.text} ${theme.background} transition-colors duration-300`}
    >
      {/* Notifications */}
      <NotificationSystem
        notifications={notifications}
        removeNotification={removeNotification}
      />

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50 p-4">
          <div
            className={`${theme.card} rounded-3xl p-6 max-w-md w-full ${theme.cardNeumorphic}`}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Plus size={20} className={`mr-2 ${theme.accent}`} />
              Add New Expense
            </h2>

            <div className="space-y-4">
              <div>
                <label className={`block mb-1 font-medium ${theme.muted}`}>
                  Description
                </label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      description: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-3 rounded-xl outline-none ${
                    isDarkMode
                      ? "bg-gray-700 border border-gray-600 shadow-inner text-white placeholder-gray-400"
                      : theme.inputNeumorphic
                  }`}
                  placeholder="What did you spend on?"
                />
              </div>

              <div>
                <label className={`block mb-1 font-medium ${theme.muted}`}>
                  Amount
                </label>
                <input
                  type="number"
                  value={newExpense.amount || ""}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className={`w-full px-4 py-3 rounded-xl outline-none ${
                    isDarkMode
                      ? "bg-gray-700 border border-gray-600 shadow-inner text-white placeholder-gray-400"
                      : theme.inputNeumorphic
                  }`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className={`block mb-1 font-medium ${theme.muted}`}>
                  Category
                </label>
                <select
                  value={newExpense.category}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, category: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-xl outline-none appearance-none cursor-pointer ${
                    isDarkMode
                      ? "bg-gray-700 border border-gray-600 shadow-inner text-white"
                      : theme.inputNeumorphic
                  }`}
                >
                  {dashboardData.categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block mb-1 font-medium ${theme.muted}`}>
                  Payment Method
                </label>
                <select
                  value={newExpense.paymentMethod}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      paymentMethod: e.target.value as PaymentMethod,
                    })
                  }
                  className={`w-full px-4 py-3 rounded-xl outline-none appearance-none cursor-pointer ${
                    isDarkMode
                      ? "bg-gray-700 border border-gray-600 shadow-inner text-white"
                      : theme.inputNeumorphic
                  }`}
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Net Banking">Net Banking</option>
                </select>
              </div>

              <div>
                <label className={`block mb-1 font-medium ${theme.muted}`}>
                  Date
                </label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, date: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-xl outline-none cursor-pointer ${
                    isDarkMode
                      ? "bg-gray-700 border border-gray-600 shadow-inner text-white"
                      : theme.inputNeumorphic
                  }`}
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setShowAddExpense(false)}
                  className={`flex-1 py-3 rounded-xl font-medium cursor-pointer ${theme.buttonNeumorphic} ${theme.muted}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddExpense}
                  className={`flex-1 py-3 rounded-xl font-medium cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg`}
                  disabled={!newExpense.description || newExpense.amount <= 0}
                >
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-screen overflow-hidden">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`fixed top-4 left-4 z-40 lg:hidden ${theme.buttonNeumorphic} p-2 rounded-xl ${theme.accent}`}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Left Sidebar - Fixed */}
        <div
          className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                      w-64 h-screen p-4 fixed lg:static z-30 
                      transition-transform duration-300 ease-in-out 
                      bg-inherit lg:translate-x-0 flex-shrink-0 overflow-hidden`}
        >
          <div
            className={`${theme.cardNeumorphic} rounded-3xl p-6 h-full overflow-y-auto`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-center mb-8">
                <div
                  className={`${theme.buttonNeumorphic} p-2 rounded-xl mr-2 ${theme.accent}`}
                >
                  <Wallet size={20} />
                </div>
                <span className={`text-lg font-bold ${theme.accent}`}>
                  Expense Manager
                </span>
              </div>

              <div className="flex flex-col items-center mb-8">
                <div
                  className={`${theme.buttonNeumorphic} w-20 h-20 rounded-full overflow-hidden mb-4`}
                >
                  <img
                    src="https://i.pravatar.cc/300"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold mb-1">
                  {dashboardData.user.fullName}
                </h2>
                <p className={`text-sm ${theme.muted}`}>
                  {dashboardData.user.position}
                </p>
              </div>

              <nav className="w-full mb-8">
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className={`flex items-center py-3 px-4 rounded-xl font-medium cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg`}
                    >
                      <Home size={18} className="mr-3" />
                      <span>Dashboard</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleExpensesClick();
                      }}
                      className={`flex items-center py-3 px-4 rounded-xl font-medium cursor-pointer ${theme.buttonNeumorphic}`}
                    >
                      <CreditCard size={18} className="mr-3" />
                      <span>Expenses</span>
                    </a>
                  </li>
                </ul>
              </nav>

              <div className="mt-auto">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`flex items-center w-full py-3 px-4 rounded-xl font-medium cursor-pointer ${theme.buttonNeumorphic}`}
                >
                  {isDarkMode ? (
                    <Sun size={18} className="mr-3" />
                  ) : (
                    <Moon size={18} className="mr-3" />
                  )}
                  <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                </button>

                <button
                  onClick={handleSignOut}
                  className={`flex items-center w-full py-3 px-4 mt-4 rounded-xl font-medium cursor-pointer ${theme.buttonNeumorphic} text-red-500`}
                >
                  <ArrowLeft size={18} className="mr-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - Scrollable */}
        <div
          className={`flex-1 overflow-y-auto p-4 ${
            !isSidebarOpen ? "ml-0" : "ml-0 lg:ml-64"
          } transition-all duration-300 w-full`}
          style={{
            marginLeft: isSidebarOpen
              ? window.innerWidth < 1024
                ? "0"
                : "0"
              : "0",
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="h-12 lg:hidden"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
              <div className="col-span-1 lg:col-span-8">
                <div
                  className={`${theme.cardNeumorphic} p-6 rounded-3xl h-full`}
                >
                  <div className="flex flex-col mb-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                      <div>
                        <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                          Hello, {dashboardData.user.name}
                        </h1>
                        <p className={`${theme.muted} mt-2`}>
                          Let's manage your expenses today!
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                        <button
                          onClick={() => setShowAddExpense(true)}
                          className={`flex items-center py-2 px-4 rounded-xl font-medium cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg`}
                        >
                          <Plus size={18} className="mr-2" />
                          <span>Add Expense</span>
                        </button>
                      </div>
                    </div>

                    {/* Time Filter */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <button
                        onClick={() => setTimeFilter("day")}
                        className={`py-2 px-4 rounded-xl font-medium cursor-pointer transition-all ${
                          timeFilter === "day"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                            : theme.buttonNeumorphic
                        }`}
                      >
                        <span>Today</span>
                      </button>
                      <button
                        onClick={() => setTimeFilter("week")}
                        className={`py-2 px-4 rounded-xl font-medium cursor-pointer transition-all ${
                          timeFilter === "week"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                            : theme.buttonNeumorphic
                        }`}
                      >
                        <span>This Week</span>
                      </button>
                      <button
                        onClick={() => setTimeFilter("month")}
                        className={`py-2 px-4 rounded-xl font-medium cursor-pointer transition-all ${
                          timeFilter === "month"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                            : theme.buttonNeumorphic
                        }`}
                      >
                        <span>This Month</span>
                      </button>
                      <button
                        onClick={() => setTimeFilter("quarter")}
                        className={`py-2 px-4 rounded-xl font-medium cursor-pointer transition-all ${
                          timeFilter === "quarter"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                            : theme.buttonNeumorphic
                        }`}
                      >
                        <span>Quarter</span>
                      </button>
                      <button
                        onClick={() => setTimeFilter("year")}
                        className={`py-2 px-4 rounded-xl font-medium cursor-pointer transition-all ${
                          timeFilter === "year"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                            : theme.buttonNeumorphic
                        }`}
                      >
                        <span>Year</span>
                      </button>
                      <button
                        onClick={() => setTimeFilter("all")}
                        className={`py-2 px-4 rounded-xl font-medium cursor-pointer transition-all ${
                          timeFilter === "all"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                            : theme.buttonNeumorphic
                        }`}
                      >
                        <span>All</span>
                      </button>
                    </div>

                    {/* Financial summary information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div
                        className={`${theme.buttonNeumorphic} p-4 rounded-xl`}
                      >
                        <div className="flex flex-col">
                          <span className={`${theme.muted} text-sm`}>
                            Total Income
                          </span>
                          <span className="text-xl font-bold">
                            {formatCurrency(dashboardData.totalIncome)}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`${theme.buttonNeumorphic} p-4 rounded-xl`}
                      >
                        <div className="flex flex-col">
                          <span className={`${theme.muted} text-sm`}>
                            Total Spent ({timeFilter})
                          </span>
                          <span className="text-xl font-bold">
                            {formatCurrency(totalFilteredExpenses)}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`${theme.buttonNeumorphic} p-4 rounded-xl`}
                      >
                        <div className="flex flex-col">
                          <span className={`${theme.muted} text-sm`}>
                            Remaining Budget
                          </span>
                          <span className="text-xl font-bold">
                            {formatCurrency(remainingBudget)}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`${theme.buttonNeumorphic} p-4 rounded-xl`}
                      >
                        <div className="flex flex-col">
                          <span className={`${theme.muted} text-sm`}>
                            Savings
                          </span>
                          <span className="text-xl font-bold">
                            {formatCurrency(dashboardData.savings)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Budget progress bar - Fixed with visible background */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className={`${theme.muted} text-sm`}>
                          Budget Usage
                        </span>
                        <span className={`${theme.muted} text-sm`}>
                          {Math.round(
                            (totalFilteredExpenses /
                              dashboardData.monthlyLimit) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <div
                        className={`h-3 rounded-full ${theme.progressBarBg} overflow-hidden`}
                      >
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (totalFilteredExpenses /
                                dashboardData.monthlyLimit) *
                                100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-1 lg:col-span-4">
                <div
                  className={`${theme.cardNeumorphic} p-6 rounded-3xl h-full`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Spending by Category</h3>
                  </div>

                  <div className="flex justify-center mb-4">
                    <div
                      className="relative"
                      style={{ width: 160, height: 160 }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <div className="text-2xl font-bold">
                          {formatCurrency(totalFilteredExpenses)}
                        </div>
                        <div className={`${theme.muted} text-sm`}>
    {timeFilter === "all" ? "Total" : `${timeFilter} Total`}  {/* Show which filter is active */}
  </div>                      </div>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart key={`pie-${timeFilter}`}>
                          <Pie
                            data={categoryPieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {categoryPieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [
                              formatCurrency(value as number),
                              "Spent",
                            ]}
                            contentStyle={{
                              backgroundColor: isDarkMode ? "#333" : "#fff",
                              borderColor: isDarkMode ? "#444" : "#eee",
                              borderRadius: "12px",
                              boxShadow: isDarkMode
                                ? "4px 4px 10px rgba(0, 0, 0, 0.3), -4px -4px 10px rgba(35, 35, 45, 0.7)"
                                : "4px 4px 10px rgba(174, 174, 192, 0.4), -4px -4px 10px rgba(255, 255, 255, 0.8)",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {categoryPieData.length > 0 ? (
                      categoryPieData.map((category, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <span className={`${theme.muted} text-sm`}>
                              {category.name}
                            </span>
                          </div>
                          <span className="font-bold text-sm">
                            {formatCurrency(category.value)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className={`${theme.muted} text-center text-sm`}>
                        No expenses in this period
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="col-span-1 lg:col-span-8">
                <div
                  className={`${theme.cardNeumorphic} p-6 rounded-3xl h-full`}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Expenses Timeline</h3>
                    <div className="flex items-center">
                      <Clock size={16} className={`mr-2 ${theme.muted}`} />
                      <span className={`${theme.muted} text-sm`}>
                        {timeFilter === "day" && "Today"}
                        {timeFilter === "week" && "This Week"}
                        {timeFilter === "month" && "This Month"}
                        {timeFilter === "quarter" && "This Quarter"}
                        {timeFilter === "year" && "This Year"}
                        {timeFilter === "all" && "All Time"}
                        {categoryFilter && ` • ${categoryFilter}`}
                      </span>
                    </div>
                  </div>

                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      {timelineChartData.length > 0 ? (
                        <AreaChart data={timelineChartData}>
                          <defs>
                            {dashboardData.categories.map((category, index) => (
                              <linearGradient
                                key={category.name}
                                id={`color-${category.name}`}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor={
                                    theme.chartColors[
                                      index % theme.chartColors.length
                                    ]
                                  }
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor={
                                    theme.chartColors[
                                      index % theme.chartColors.length
                                    ]
                                  }
                                  stopOpacity={0.2}
                                />
                              </linearGradient>
                            ))}
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={isDarkMode ? "#444" : "#eee"}
                          />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            stroke={isDarkMode ? "#aaa" : "#888"}
                          />
                          <YAxis
                            tickFormatter={(value) => `$${value}`}
                            tick={{ fontSize: 12 }}
                            stroke={isDarkMode ? "#aaa" : "#888"}
                          />
                          <Tooltip
                            formatter={(value, name) => [
                              formatCurrency(value as number),
                              name,
                            ]}
                            contentStyle={{
                              backgroundColor: isDarkMode ? "#333" : "#fff",
                              borderColor: isDarkMode ? "#444" : "#eee",
                              borderRadius: "12px",
                              boxShadow: isDarkMode
                                ? "4px 4px 10px rgba(0, 0, 0, 0.3), -4px -4px 10px rgba(35, 35, 45, 0.7)"
                                : "4px 4px 10px rgba(174, 174, 192, 0.4), -4px -4px 10px rgba(255, 255, 255, 0.8)",
                            }}
                          />
                          <Legend />
                          {dashboardData.categories
                            .filter(
                              (category) =>
                                !categoryFilter ||
                                category.name === categoryFilter
                            )
                            .map((category, index) => (
                              <Area
                                key={category.name}
                                type="monotone"
                                dataKey={category.name}
                                name={category.name}
                                stroke={
                                  theme.chartColors[
                                    index % theme.chartColors.length
                                  ]
                                }
                                fillOpacity={1}
                                fill={`url(#color-${category.name})`}
                                strokeWidth={2}
                              />
                            ))}
                        </AreaChart>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <div className={`${theme.muted} text-center`}>
                            No data available for this period
                          </div>
                        </div>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="col-span-1 lg:col-span-4">
                <div
                  className={`${theme.cardNeumorphic} p-6 rounded-3xl h-full`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Essential Recent Expenses</h3>

                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className={`${
                          theme.buttonNeumorphic
                        } w-8 h-8 flex items-center justify-center rounded-xl cursor-pointer ${
                          categoryFilter ? theme.accent : theme.muted
                        }`}
                      >
                        <Filter size={16} />
                      </button>

                      {dropdownOpen && (
                        <div
                          className={`absolute right-0 mt-2 w-48 rounded-xl ${theme.cardNeumorphic} p-2 z-10`}
                        >
                          <div className="py-1">
                            {dashboardData.categories.map((category, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setCategoryFilter(category.name);
                                  setDropdownOpen(false);
                                }}
                                className={`block w-full text-left px-4 py-2 text-sm rounded-lg cursor-pointer ${
                                  categoryFilter === category.name
                                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                    : theme.buttonNeumorphic
                                } mb-1`}
                              >
                                {category.name}
                              </button>
                            ))}
                            {categoryFilter && (
                              <>
                                <div className="border-t my-1 border-gray-500 opacity-20"></div>
                                <button
                                  onClick={clearCategoryFilter}
                                  className={`block w-full text-left px-4 py-2 text-sm rounded-lg cursor-pointer ${theme.buttonNeumorphic} mb-1 ${theme.accent}`}
                                >
                                  Clear Filter
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="h-72 overflow-y-auto pr-1">
                    <div className="space-y-3">
                      {filteredTransactions.length === 0 ? (
                        <div
                          className={`${theme.inputNeumorphic} p-4 rounded-xl text-center ${theme.muted}`}
                        >
                          No transactions for the selected period.
                        </div>
                      ) : (
                        filteredTransactions.map((transaction, index) => (
                          <div
                            key={transaction.id}
                            className={`${theme.buttonNeumorphic} p-3 rounded-xl cursor-pointer transition-all hover:shadow-md`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div
                                  className={`${theme.cardNeumorphic} w-10 h-10 rounded-xl flex items-center justify-center mr-3`}
                                  style={{ color: transaction.color }}
                                >
                                  <span className="font-bold text-sm">
                                    {transaction.icon}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium text-sm">
                                    {transaction.name}
                                  </div>
                                  <div className={`text-xs ${theme.muted}`}>
                                    {transaction.category} •{" "}
                                    {formatDate(transaction.timestamp)}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-sm">
                                  {formatCurrencyWithCents(transaction.amount)}
                                </div>
                                <div className={`text-xs ${theme.muted}`}>
                                  {transaction.paymentMethod}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {updatedPaymentMethods.map((payment, index) => (
                <div key={index}>
                  <div
                    className={`${theme.cardNeumorphic} p-5 rounded-3xl h-full`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span
                          className={`${theme.buttonNeumorphic} w-10 h-10 flex items-center justify-center rounded-xl mr-3`}
                          style={{ color: payment.color }}
                        >
                          {payment.icon}
                        </span>
                        <span className="font-medium">{payment.method}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="relative w-16 h-16">
                        <svg width="64" height="64" viewBox="0 0 64 64">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke={isDarkMode ? "#444" : "#e2e8f0"}
                            strokeWidth="6"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke={`url(#gradient-${index})`}
                            strokeWidth="6"
                            strokeDasharray="176"
                            strokeDashoffset={
                              176 - (176 * payment.spent) / payment.monthlyLimit
                            }
                            strokeLinecap="round"
                            transform="rotate(-90 32 32)"
                          />
                          <defs>
                            <linearGradient
                              id={`gradient-${index}`}
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="0%"
                            >
                              <stop offset="0%" stopColor={payment.color} />
                              <stop
                                offset="100%"
                                stopColor={
                                  payment.color === "#e84393"
                                    ? "#a29bfe"
                                    : "#e84393"
                                }
                              />
                            </linearGradient>
                          </defs>
                          <text
                            x="32"
                            y="32"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={payment.color}
                            fontSize="14"
                            fontWeight="bold"
                          >
                            {Math.round(
                              (payment.spent / payment.monthlyLimit) * 100
                            )}
                            %
                          </text>
                        </svg>
                      </div>

                      <div className="flex flex-col">
                        <div className={`${theme.muted} text-sm mb-1`}>
                          Monthly limit
                        </div>
                        <div className="font-bold text-sm">
                          {formatCurrency(payment.monthlyLimit)}
                        </div>
                        <div className={`${theme.muted} text-sm mt-2 mb-1`}>
                          Spent
                        </div>
                        <div className="font-bold text-sm">
                          {formatCurrency(payment.spent)}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`${theme.buttonNeumorphic} p-2 rounded-xl mt-2 flex justify-between items-center`}
                    >
                      <span className={`${theme.muted} text-sm`}>
                        Available
                      </span>
                      <span className="font-bold text-sm">
                        {formatCurrency(payment.monthlyLimit - payment.spent)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

  
  export default ExpensesDashboardClient;