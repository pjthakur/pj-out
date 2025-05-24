"use client";

import { useEffect, useState, ReactNode, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSun, FaMoon, FaWallet, FaChartLine, FaPlusCircle, FaDollarSign,
  FaPiggyBank, FaUtensils, FaCar, FaGamepad, FaShoppingBag, FaHome,
  FaMedkit, FaPlus, FaEdit, FaTrash, FaList, FaCalendarAlt, FaTimes,
  FaExclamationTriangle, FaCheck,
  FaChevronDown
} from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

interface Expense {
  id: number;
  amount: number;
  category: string;
  description: string;
  date: Date;
}

interface CategoryInfo {
  icon: ReactNode;
  color: string;
  lightColor: string;
  darkColor: string;
  fillColor: string;
}

interface Categories {
  [key: string]: CategoryInfo;
}

interface CategoryTotals {
  [key: string]: number;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface DailyTotal {
  date: string;
  formattedDate: string;
  total: number;
  breakdown: { [key: string]: number };
}

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'pie' | 'bar'>('pie');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null);

  
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, amount: 12.50, category: "food", description: "Lunch", date: new Date(Date.now() - 86400000 * 0) }, 
    { id: 2, amount: 25.00, category: "transport", description: "Uber", date: new Date(Date.now() - 86400000 * 1) }, 
    { id: 3, amount: 18.75, category: "fun", description: "Movie tickets", date: new Date(Date.now() - 86400000 * 2) }, 
    { id: 4, amount: 32.99, category: "shopping", description: "T-shirt", date: new Date(Date.now() - 86400000 * 3) }, 
    { id: 5, amount: 8.50, category: "food", description: "Coffee", date: new Date(Date.now() - 86400000 * 4) }, 
    { id: 6, amount: 45.00, category: "healthcare", description: "Medicine", date: new Date(Date.now() - 86400000 * 5) }, 
    { id: 7, amount: 15.20, category: "transport", description: "Gas", date: new Date(Date.now() - 86400000 * 6) }, 
  ]);

  const [newExpense, setNewExpense] = useState({ amount: "", category: "food", description: "" });
  const [formErrors, setFormErrors] = useState({ amount: "", description: "" });
  const [formSuccess, setFormSuccess] = useState("");

  
  const categories: Categories = {
    food: {
      icon: <FaUtensils />,
      color: "from-orange-400 to-red-500",
      lightColor: "bg-orange-100",
      darkColor: "bg-orange-900",
      fillColor: "#f97316"
    },
    transport: {
      icon: <FaCar />,
      color: "from-blue-400 to-indigo-600",
      lightColor: "bg-blue-100",
      darkColor: "bg-blue-900",
      fillColor: "#3b82f6"
    },
    fun: {
      icon: <FaGamepad />,
      color: "from-fuchsia-400 to-purple-600",
      lightColor: "bg-fuchsia-100",
      darkColor: "bg-fuchsia-900",
      fillColor: "#d946ef"
    },
    shopping: {
      icon: <FaShoppingBag />,
      color: "from-emerald-400 to-green-600",
      lightColor: "bg-emerald-100",
      darkColor: "bg-emerald-900",
      fillColor: "#10b981"
    },
    home: {
      icon: <FaHome />,
      color: "from-amber-400 to-yellow-600",
      lightColor: "bg-amber-100",
      darkColor: "bg-amber-900",
      fillColor: "#f59e0b"
    },
    healthcare: {
      icon: <FaMedkit />,
      color: "from-rose-400 to-pink-600",
      lightColor: "bg-rose-100",
      darkColor: "bg-rose-900",
      fillColor: "#f43f5e"
    },
  };

  
  const todayTotal = expenses
    .filter(exp => {
      const today = new Date();
      const expDate = new Date(exp.date);
      return expDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
    })
    .reduce((sum, exp) => sum + exp.amount, 0);

  
  const todayExpenses = expenses.filter(exp => {
    const today = new Date();
    const expDate = new Date(exp.date);
    return expDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
  });

  
  const todayCategoryTotals: CategoryTotals = todayExpenses.reduce((acc: CategoryTotals, exp) => {
    if (!acc[exp.category]) acc[exp.category] = 0;
    acc[exp.category] += exp.amount;
    return acc;
  }, {});

  
  const categoryTotals: CategoryTotals = expenses.reduce((acc: CategoryTotals, exp) => {
    if (!acc[exp.category]) acc[exp.category] = 0;
    acc[exp.category] += exp.amount;
    return acc;
  }, {});

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  
  const chartData: ChartData[] = Object.entries(todayCategoryTotals).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount,
    color: categories[category].fillColor
  }));

  
  const getDailyTotals = (): DailyTotal[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    
    const last7Days: DailyTotal[] = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return {
        date: date.toISOString().split('T')[0],
        formattedDate: i === 0 ? 'Today' :
          i === 1 ? 'Yesterday' :
            date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        total: 0,
        breakdown: {}
      };
    });

    
    expenses.forEach(expense => {
      const expDate = new Date(expense.date);
      expDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today.getTime() - expDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays < 7) {
        last7Days[diffDays].total += expense.amount;

        
        if (!last7Days[diffDays].breakdown[expense.category]) {
          last7Days[diffDays].breakdown[expense.category] = 0;
        }
        last7Days[diffDays].breakdown[expense.category] += expense.amount;
      }
    });

    return last7Days;
  };

  const dailyTotals = getDailyTotals();

  
  const last7DaysTotal = dailyTotals.reduce((sum, day) => sum + day.total, 0);
  const averageDailySpend = last7DaysTotal / 7;

  
  const maxCategory = Object.entries(todayCategoryTotals).reduce(
    (max, [category, amount]) =>
      amount > max.amount ? { category, amount } : max,
    { category: '', amount: 0 }
  );

  const minCategory = Object.entries(todayCategoryTotals).reduce(
    (min, [category, amount]) =>
      (min.amount === 0 || amount < min.amount) ? { category, amount } : min,
    { category: '', amount: 0 }
  );

  const openAddModal = () => {
    setNewExpense({ amount: "", category: "food", description: "" });
    setIsAddModalOpen(true);
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setExpenseToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeAllModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setEditingExpense(null);
    setExpenseToDelete(null);
  };

  const validateForm = () => {
    let valid = true;
    const errors = { amount: "", description: "" };

    
    setFormSuccess("");

    
    if (!newExpense.amount) {
      errors.amount = "Amount is required";
      valid = false;
    } else if (isNaN(parseFloat(newExpense.amount)) || parseFloat(newExpense.amount) <= 0) {
      errors.amount = "Please enter a valid amount greater than zero";
      valid = false;
    }

    
    if (!newExpense.description.trim()) {
      errors.description = "Description is required";
      valid = false;
    } else if (newExpense.description.trim().length < 3) {
      errors.description = "Description must be at least 3 characters";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const addExpense = () => {
    if (!validateForm()) {
      return;
    }

    const expense: Expense = {
      id: Date.now(),
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      description: newExpense.description,
      date: new Date()
    };

    setExpenses([expense, ...expenses]);

    
    setFormSuccess("Expense added successfully!");
    setNewExpense({ amount: "", category: "food", description: "" });

    
    setTimeout(() => {
      closeAllModals();
      toast.success("Expense added successfully");
    }, 1500);
  };

  const updateExpense = () => {
    if (!editingExpense || !editingExpense.amount || !editingExpense.description) {
      toast.error("Please fill in all fields");
      return;
    }

    setExpenses(expenses.map(exp =>
      exp.id === editingExpense.id ? editingExpense : exp
    ));
    closeAllModals();
    toast.success("Expense updated successfully");
  };

  const deleteExpense = (id: number) => {
    if (id) {
      setExpenses(expenses.filter(exp => exp.id !== id));
      closeAllModals();
      toast.success("Expense deleted successfully");
    }
  };

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.className = savedTheme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900";
  }, []);

  
  useEffect(() => {
    const isAnyModalOpen = isAddModalOpen || isEditModalOpen || isDeleteModalOpen;

    if (isAnyModalOpen) {
      
      const scrollY = window.scrollY;

      
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll';
    } else {
      
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
    };
  }, [isAddModalOpen, isEditModalOpen, isDeleteModalOpen]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900";
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
          <p className="font-medium">{payload[0].name}</p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Amount: ${payload[0].value.toFixed(2)}
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {todayTotal > 0 ? ((payload[0].value / todayTotal) * 100).toFixed(1) : 0}% of today's total
          </p>
        </div>
      );
    }
    return null;
  };

  if (!mounted) return null;

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');
        
        .montserrat-font {
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>
      
      <div className={`min-h-screen montserrat-font ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
        {/* Toaster notification component */}
        <Toaster
          position="top-right"
          toastOptions={{
            className: '',
            duration: 3000,
            style: {
              background: theme === "dark" ? '#374151' : '#fff',
              color: theme === "dark" ? '#fff' : '#374151',
              boxShadow: theme === "dark" ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: 'white',
              },
            },
          }}
        />

        <header className={`sticky top-0 z-50 ${theme === "dark"
          ? "bg-gray-800/80 backdrop-blur-lg border-b border-gray-700/50"
          : "bg-white/80 backdrop-blur-lg border-b border-gray-200/50"
          } shadow-xl`}>
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center">
              <FaWallet className={`mr-2 ${theme === "dark"
                ? "text-teal-400 drop-shadow-[0_0_6px_rgba(20,184,166,0.5)]"
                : "text-teal-500 drop-shadow-[0_0_6px_rgba(20,184,166,0.5)]"
                }`} />
              <span className={`bg-clip-text text-transparent ${theme === "dark"
                ? "bg-gradient-to-r from-teal-400 via-emerald-500 to-cyan-600 drop-shadow-[0_0_2px_rgba(20,184,166,0.5)]"
                : "bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-600 drop-shadow-[0_0_2px_rgba(20,184,166,0.5)]"
                }`}>
                Daily Expense
              </span>
            </h1>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full cursor-pointer ${theme === "dark"
                ? "bg-gray-700 text-teal-300 shadow-inner shadow-gray-900/50 ring-1 ring-gray-600"
                : "bg-cyan-50 text-teal-700 shadow-inner shadow-gray-100 ring-1 ring-teal-200"
                } transition-all duration-300 hover:shadow-lg hover:shadow-${theme === "dark" ? "teal-700/20" : "teal-200/50"}`}
            >
              {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
          </div>
        </header>

        <div className={`container mx-auto px-4 py-8 ${theme === "dark"
          ? "bg-gradient-to-b from-gray-900 via-gray-850 to-gray-800"
          : "bg-gradient-to-b from-gray-50 via-gray-25 to-white"
          }`}>

          {/* 4 cards grid at the top */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Today's Spending Card */}
            <div className={`rounded-3xl overflow-hidden ${theme === "dark"
              ? "bg-gray-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-gray-700/50"
              : "bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100"
              } transition-all duration-300 hover:shadow-[0_15px_30px_rgba(0,0,0,0.25)] hover:translate-y-[-4px] hover:scale-[1.02]`}>
              <div className={`p-6 relative h-full ${theme === "dark"
                ? "bg-gradient-to-br from-teal-800/60 via-emerald-900/40 to-cyan-800/60 backdrop-blur-sm"
                : "bg-gradient-to-br from-teal-50 via-cyan-50/80 to-sky-50/90 backdrop-blur-sm"
                }`}>
                <div className="relative z-10">
                  <h2 className="text-base font-bold mb-2 flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${theme === "dark"
                      ? "bg-teal-800/90 text-teal-300"
                      : "bg-teal-100 text-teal-500"}`}>
                      <FaDollarSign className="text-lg" />
                    </div>
                    Today's Spending
                  </h2>
                  <div className="flex items-end gap-2">
                    <div className={`text-3xl font-bold ${theme === "dark"
                      ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                      : "text-gray-900 drop-shadow-[0_0_8px_rgba(0,0,0,0.1)]"
                      }`}>${todayTotal.toFixed(2)}</div>

                  </div>
                  <div className={`text-xs pb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>Today</div>
                </div>
                {/* Decorative orb */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30 ${theme === "dark"
                  ? "bg-teal-500/70"
                  : "bg-cyan-400/60"
                  }`}></div>
              </div>
            </div>

            {/* Maximum Spent Category Card */}
            <div className={`rounded-3xl overflow-hidden ${theme === "dark"
              ? "bg-gray-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-gray-700/50"
              : "bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100"
              } transition-all duration-300 hover:shadow-[0_15px_30px_rgba(0,0,0,0.25)] hover:translate-y-[-4px] hover:scale-[1.02]`}>
              <div className={`p-6 relative overflow-hidden h-full ${theme === "dark"
                ? "bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-800/80 backdrop-blur-sm"
                : "bg-gradient-to-br from-gray-50/90 via-white/90 to-gray-50/90 backdrop-blur-sm"
                }`}>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-sm`}
                      style={{
                        backgroundColor: maxCategory.category ? categories[maxCategory.category].fillColor : '#6b7280',
                        boxShadow: `0 0 12px ${maxCategory.category ? categories[maxCategory.category].fillColor + '60' : '#6b728060'}`
                      }}>
                      {maxCategory.category ? categories[maxCategory.category].icon : <FaChartLine />}
                    </div>
                    <h2 className="text-base font-bold">
                      Highest Spent
                    </h2>
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      ${maxCategory.amount.toFixed(2)}
                    </span>
                    <span className="text-xs capitalize text-gray-500">
                      {maxCategory.category || 'None'}
                    </span>
                  </div>
                </div>
                {/* Decorative orb */}
                <div className={`absolute -bottom-4 -right-4 w-32 h-32 rounded-full blur-3xl opacity-25`}
                  style={{ backgroundColor: maxCategory.category ? categories[maxCategory.category].fillColor : '#6b7280' }}></div>
              </div>
            </div>

            {/* Minimum Spent Category Card */}
            <div className={`rounded-3xl overflow-hidden ${theme === "dark"
              ? "bg-gray-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-gray-700/50"
              : "bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100"
              } transition-all duration-300 hover:shadow-[0_15px_30px_rgba(0,0,0,0.25)] hover:translate-y-[-4px] hover:scale-[1.02]`}>
              <div className={`p-6 relative overflow-hidden h-full ${theme === "dark"
                ? "bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-800/80 backdrop-blur-sm"
                : "bg-gradient-to-br from-gray-50/90 via-white/90 to-gray-50/90 backdrop-blur-sm"
                }`}>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-sm`}
                      style={{
                        backgroundColor: minCategory.category ? categories[minCategory.category].fillColor : '#6b7280',
                        boxShadow: `0 0 12px ${minCategory.category ? categories[minCategory.category].fillColor + '60' : '#6b728060'}`
                      }}>
                      {minCategory.category ? categories[minCategory.category].icon : <FaPiggyBank />}
                    </div>
                    <h2 className="text-base font-bold">
                      Lowest Spent
                    </h2>
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      ${minCategory.amount.toFixed(2)}
                    </span>
                    <span className="text-xs capitalize text-gray-500">
                      {minCategory.category || 'None'}
                    </span>
                  </div>
                </div>
                {/* Decorative orb */}
                <div className={`absolute -bottom-4 -right-4 w-32 h-32 rounded-full blur-3xl opacity-25`}
                  style={{ backgroundColor: minCategory.category ? categories[minCategory.category].fillColor : '#6b7280' }}></div>
              </div>
            </div>

            <div className={`rounded-3xl overflow-hidden ${theme === "dark"
              ? "bg-gray-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-gray-700/50"
              : "bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100"
              } transition-all duration-300 hover:shadow-[0_15px_30px_rgba(0,0,0,0.25)] hover:translate-y-[-4px] hover:scale-[1.02]`}>
              <div className={`p-6 relative overflow-hidden h-full ${theme === "dark"
                ? "bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-800/80 backdrop-blur-sm"
                : "bg-gradient-to-br from-gray-50/90 via-white/90 to-gray-50/90 backdrop-blur-sm"
                }`}>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-sm`}
                      style={{
                        backgroundColor: theme === "dark" ? "#3b82f6" : "#60a5fa",
                        boxShadow: theme === "dark" ? "0 0 12px rgba(59, 130, 246, 0.6)" : "0 0 12px rgba(96, 165, 250, 0.6)"
                      }}>
                      <FaCalendarAlt />
                    </div>
                    <h2 className="text-base font-bold">
                      7-Day Average
                    </h2>
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      ${averageDailySpend.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500">
                      per day
                    </span>
                  </div>
                </div>
                {/* Decorative orb */}
                <div className={`absolute -bottom-4 -right-4 w-32 h-32 rounded-full blur-3xl opacity-25 ${theme === "dark" ? "bg-blue-500" : "bg-blue-400"}`}></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className={`rounded-3xl p-7 ${theme === "dark"
              ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700/50"
              : "bg-white/90 backdrop-blur-sm border border-gray-100"
              } shadow-[0_10px_40px_rgba(0,0,0,0.15)] col-span-1 relative overflow-hidden transition-all duration-300 hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] hover:translate-y-[-4px]`}>

              {/* Decorative elements */}
              <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-10 ${theme === "dark"
                ? "bg-teal-500"
                : "bg-cyan-400"
                }`}></div>

              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaPlusCircle className={`${theme === "dark"
                    ? "text-teal-400 drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]"
                    : "text-teal-500 drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]"
                    }`} />
                  <span className={theme === "dark"
                    ? "bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400"
                    : "bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-sky-500"
                  }>Add New Expense</span>
                </h2>
                <p className={`text-sm mb-5 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Track your daily expenses by adding them to your dashboard.
                </p>
                <motion.button
                  onClick={openAddModal}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: theme === "dark"
                      ? "0 0 20px rgba(20, 184, 166, 0.5)"
                      : "0 0 20px rgba(20, 184, 166, 0.5)"
                  }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full py-3.5 rounded-xl cursor-pointer ${theme === "dark"
                    ? "bg-gradient-to-r from-teal-500 via-emerald-600 to-cyan-600 ring-1 ring-teal-700/50"
                    : "bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-600 ring-1 ring-teal-300/50"
                    } text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2`}
                >
                  <FaPlus className="drop-shadow-md" />
                  <span className="drop-shadow-md">Add Expense</span>
                </motion.button>
              </div>


              <div className="mt-4">
                <h3 className={`text-sm font-medium mb-3 ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>Today's Total: ${todayTotal.toFixed(2)}</h3>
                <div className="space-y-3">
                  {Object.entries(todayCategoryTotals).length > 0 ? (
                    Object.entries(todayCategoryTotals).map(([category, amount]) => {
                      const percentage = (amount / todayTotal) * 100;
                      const catInfo = categories[category];

                      return (
                        <div key={category} className="flex flex-col">
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs`} style={{ backgroundColor: catInfo.fillColor }}>
                                {catInfo.icon}
                              </div>
                              <span className="ml-2 capitalize">{category}</span>
                            </div>
                            <div className="font-medium">${amount.toFixed(2)}</div>
                          </div>
                          <div className={`w-full h-2 rounded-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: catInfo.fillColor
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className={`text-center py-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      <p className="text-sm">No expenses recorded for today.</p>
                      <p className="text-xs mt-1">Add an expense to see the breakdown!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={`rounded-3xl p-7 ${theme === "dark"
              ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700/50"
              : "bg-white/90 backdrop-blur-sm border border-gray-100"
              } shadow-[0_10px_40px_rgba(0,0,0,0.15)] col-span-1 md:col-span-2 relative overflow-hidden transition-all duration-300 hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] hover:translate-y-[-4px]`}>

              {/* Decorative elements */}
              <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-10 ${theme === "dark"
                ? "bg-cyan-500"
                : "bg-sky-400"
                }`}></div>

              <div className="relative z-10">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <FaChartLine className={`${theme === "dark"
                      ? "text-teal-400 drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]"
                      : "text-teal-500 drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]"
                      }`} />
                    <span className={theme === "dark"
                      ? "bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400"
                      : "bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-sky-500"
                    }>Expense Breakdown</span>
                  </h2>
                  <div className={`flex overflow-hidden rounded-xl border ${theme === "dark"
                    ? "border-gray-700 shadow-inner shadow-black/20"
                    : "border-gray-200 shadow-inner shadow-gray-200/50"
                    }`}>
                    <button
                      onClick={() => setActiveTab('pie')}
                      className={`sm:px-8 px-4 py-1.5 text-sm font-medium cursor-pointer transition-all duration-300 ${activeTab === 'pie'
                        ? (theme === 'dark'
                          ? 'bg-gradient-to-r from-teal-600 to-cyan-700 text-white shadow-[0_0_10px_rgba(20,184,166,0.3)]'
                          : 'bg-gradient-to-r from-teal-500 to-sky-600 text-white shadow-[0_0_10px_rgba(20,184,166,0.3)]')
                        : (theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
                        }`}
                    >
                      Pie
                    </button>
                    <button
                      onClick={() => setActiveTab('bar')}
                      className={`px-8 pl-4 sm:pl-8  py-1.5  text-sm font-medium cursor-pointer transition-all duration-300 ${activeTab === 'bar'
                        ? (theme === 'dark'
                          ? 'bg-gradient-to-r from-teal-600 to-cyan-700 text-white shadow-[0_0_10px_rgba(20,184,166,0.3)]'
                          : 'bg-gradient-to-r from-teal-500 to-sky-600 text-white shadow-[0_0_10px_rgba(20,184,166,0.3)]')
                        : (theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
                        }`}
                    >
                      Bar
                    </button>
                  </div>
                </div>
              </div>

              <div className="h-[300px] mt-4">
                {chartData.length > 0 ? (
                  activeTab === 'pie' ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ left: 30, right: 30, top: 10, bottom: 10 }}>
                        <Pie
                          data={chartData}
                          cx={"50%"}
                          cy="50%"
                          labelLine={false}
                          outerRadius={95}
                          innerRadius={60}
                          dataKey="value"
                          animationDuration={1500}
                          animationBegin={200}
                          paddingAngle={4}
                        >
                          {chartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              stroke={theme === 'dark' ? '#374151' : '#f3f4f6'}
                              strokeWidth={3}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          formatter={(value) => <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{value}</span>}
                          layout={"horizontal"}
                          align={"center"}
                          verticalAlign={"bottom"}
                          wrapperStyle={{ paddingTop: 20 }}
                          iconSize={10}
                          iconType="circle"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: theme === 'dark' ? '#9ca3af' : '#4b5563' }}
                        />
                        <YAxis
                          tick={{ fill: theme === 'dark' ? '#9ca3af' : '#4b5563' }}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1500} animationBegin={200}>
                          {chartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              style={{
                                filter: `drop-shadow(0 0 8px ${entry.color}50)`,
                              }}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>No expense data to display</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={`rounded-3xl p-7 ${theme === "dark"
            ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700/50"
            : "bg-white/90 backdrop-blur-sm border border-gray-100"
            } shadow-[0_10px_40px_rgba(0,0,0,0.15)] mb-10 relative overflow-hidden transition-all duration-300 hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] hover:translate-y-[-4px]`}>

            {/* Decorative elements */}
            <div className={`absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-10 ${theme === "dark"
              ? "bg-emerald-500"
              : "bg-emerald-400"
              }`}></div>

            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                <FaEdit className={`${theme === "dark"
                  ? "text-teal-400 drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]"
                  : "text-teal-500 drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]"
                  }`} />
                <span className={theme === "dark"
                  ? "bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400"
                  : "bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-emerald-500"
                }>Manage Expenses</span>
              </h2>

              <div className="overflow-x-auto rounded-xl">
                <table className="min-w-full">
                  <thead>
                    <tr className={`${theme === "dark"
                      ? "border-b border-gray-700 bg-gradient-to-r from-gray-800/90 to-gray-700/80"
                      : "border-b border-gray-200 bg-gradient-to-r from-gray-50/90 to-blue-50/80"
                      }`}>
                      <th className="py-4 px-3 text-left text-sm font-semibold">Description</th>
                      <th className="py-4 px-3 text-left text-sm font-semibold">Category</th>
                      <th className="py-4 px-3 text-left text-sm font-semibold">Date</th>
                      <th className="py-4 px-3 text-right text-sm font-semibold">Amount</th>
                      <th className="py-4 px-3 text-center text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`${theme === "dark"
                    ? "divide-y divide-gray-700"
                    : "divide-y divide-gray-200"
                    }`}>
                    {expenses.slice(0, 5).map(expense => (
                      <tr key={expense.id} className={`transition-colors hover:${theme === "dark"
                        ? "bg-gray-700/30 backdrop-blur-sm"
                        : "bg-blue-50/30 backdrop-blur-sm"
                        }`}>
                        <td className="py-4 px-3 text-sm">{expense.description}</td>
                        <td className="py-4 px-3 text-sm">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 shadow-sm ${theme === "dark"
                            ? `bg-${categories[expense.category].fillColor}30 text-${categories[expense.category].fillColor}`
                            : `bg-${categories[expense.category].fillColor}20 text-${categories[expense.category].fillColor}`
                            }`} style={{
                              boxShadow: theme === "dark"
                                ? `0 0 12px ${categories[expense.category].fillColor}30`
                                : `0 0 8px ${categories[expense.category].fillColor}25`
                            }}>
                            <span className="w-3 h-3">{categories[expense.category].icon}</span>
                            <span className="capitalize">{expense.category}</span>
                          </span>
                        </td>
                        <td className="py-4 px-3 text-sm">{new Date(expense.date).toLocaleDateString()}</td>
                        <td className="py-4 px-3 text-sm font-medium text-right">${expense.amount.toFixed(2)}</td>
                        <td className="py-4 px-3 text-sm">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => openEditModal(expense)}
                              className={`p-2 rounded-full cursor-pointer transition-all ${theme === "dark"
                                ? "hover:bg-gray-700 hover:text-teal-400"
                                : "hover:bg-gray-100 hover:text-teal-500"
                                }`}
                            >
                              <FaEdit className={theme === "dark" ? "text-gray-300" : "text-gray-600"} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(expense.id)}
                              className={`p-2 rounded-full cursor-pointer transition-all ${theme === "dark"
                                ? "hover:bg-gray-700 text-cyan-400 hover:text-cyan-300"
                                : "hover:bg-gray-100 text-sky-600 hover:text-sky-700"
                                }`}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 7-day Expense Summary */}
          <div className={`rounded-3xl ${theme === "dark"
            ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700/50"
            : "bg-white/90 backdrop-blur-sm border border-gray-100"
            } shadow-[0_10px_40px_rgba(0,0,0,0.15)] overflow-hidden relative transition-all duration-300 hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] hover:translate-y-[-4px]`}>

            {/* Decorative elements */}
            <div className={`absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 ${theme === "dark"
              ? "bg-teal-500"
              : "bg-sky-400"
              }`}></div>

            <div className="p-7 relative z-10">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-5">
                <FaCalendarAlt className={`${theme === "dark"
                  ? "text-teal-400 drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]"
                  : "text-teal-500 drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]"
                  }`} />
                <span className={theme === "dark"
                  ? "bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400"
                  : "bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-sky-500"
                }>Last 7 Days Expenses</span>
              </h2>

              <div className="overflow-x-auto rounded-xl">
                <table className="min-w-full">
                  <thead>
                    <tr className={`${theme === "dark"
                      ? "border-b border-gray-700 bg-gradient-to-r from-gray-800/90 to-gray-700/80"
                      : "border-b border-gray-200 bg-gradient-to-r from-gray-50/90 to-blue-50/80"
                      }`}>
                      <th className="py-4 px-3 text-left text-sm font-semibold">Date</th>
                      <th className="py-4 px-3 text-right text-sm font-semibold">Total</th>
                      <th className="py-4 px-3 text-left text-sm font-semibold">Breakdown</th>
                    </tr>
                  </thead>
                  <tbody className={`${theme === "dark"
                    ? "divide-y divide-gray-700"
                    : "divide-y divide-gray-200"
                    }`}>
                    {dailyTotals.map((day) => (
                      <tr key={day.date} className={`transition-colors hover:${theme === "dark"
                        ? "bg-gray-700/30 backdrop-blur-sm"
                        : "bg-blue-50/30 backdrop-blur-sm"
                        }`}>
                        <td className="py-4 px-3 text-sm font-medium">{day.formattedDate}</td>
                        <td className="py-4 px-3 text-sm text-right font-medium">
                          <span className={`${day.total > 0
                            ? (theme === "dark" ? "text-white" : "text-gray-900")
                            : "text-gray-500"
                            }`}>
                            ${day.total.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-sm">
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(day.breakdown).map(([category, amount]) => {
                              const catInfo = categories[category];
                              return (
                                <div
                                  key={category}
                                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm"
                                  style={{
                                    backgroundColor: theme === "dark"
                                      ? `${catInfo.fillColor}30`
                                      : `${catInfo.fillColor}20`,
                                    color: theme === "dark" ? "#fff" : catInfo.fillColor,
                                    boxShadow: theme === "dark"
                                      ? `0 0 15px ${catInfo.fillColor}30`
                                      : `0 0 12px ${catInfo.fillColor}25`
                                  }}
                                >
                                  <span className="w-3 h-3">{catInfo.icon}</span>
                                  <span className="capitalize">{category}</span>
                                  <span className="font-medium">${amount.toFixed(2)}</span>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className={`${theme === "dark"
                      ? "border-t border-gray-700 bg-gradient-to-r from-gray-800/90 to-gray-700/80"
                      : "border-t border-gray-200 bg-gradient-to-r from-gray-50/90 to-blue-50/80"
                      }`}>
                      <td className="py-4 px-3 text-sm font-semibold">Total</td>
                      <td className="py-4 px-3 text-sm text-right font-semibold">
                        <span className={`${theme === "dark"
                          ? "text-white text-opacity-90"
                          : "text-gray-900"
                          }`}>
                          ${dailyTotals.reduce((sum, day) => sum + day.total, 0).toFixed(2)}
                        </span>
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>

        <footer className={`mt-10 py-8 ${theme === "dark"
          ? "bg-gradient-to-b from-gray-800/90 to-gray-900 border-t border-gray-700/30"
          : "bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200/50"
          }`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-6 md:mb-0">
                <FaWallet className={`mr-2 ${theme === "dark"
                  ? "text-teal-400 drop-shadow-[0_0_6px_rgba(20,184,166,0.5)]"
                  : "text-teal-500 drop-shadow-[0_0_6px_rgba(20,184,166,0.5)]"
                  }`} />
                <span className={`font-bold text-lg ${theme === "dark"
                  ? "bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500"
                  : "bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-sky-500"
                  }`}>
                  Daily Expense
                </span>
              </div>
              <p className={`${theme === "dark"
                ? "text-gray-400 drop-shadow-sm"
                : "text-gray-600 drop-shadow-sm"
                }`}>
                Daily Expense Tracker © {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </footer>

        {/* Modal components */}
        <AnimatePresence>
          {/* Add Expense Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 backdrop-blur-sm bg-black/20"
                onClick={closeAllModals}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`relative rounded-2xl ${theme === "dark"
                  ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700/50"
                  : "bg-white/90 backdrop-blur-sm border border-gray-100"
                  } p-7 shadow-[0_10px_50px_rgba(0,0,0,0.5)] max-w-md w-full mx-4 overflow-hidden`}
              >
                {/* Decorative orb */}
                <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30 ${theme === "dark"
                  ? "bg-teal-600"
                  : "bg-teal-400"
                  }`}></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <FaPlusCircle className={`${theme === "dark"
                        ? "text-teal-400 drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]"
                        : "text-teal-500 drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]"
                        }`} />
                      <span className={`${theme === "dark"
                        ? "bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500"
                        : "bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-sky-500"
                        }`}>Add New Expense</span>
                    </h2>
                    <button
                      onClick={closeAllModals}
                      className={`p-2 rounded-full cursor-pointer ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Display success message */}
                  <AnimatePresence>
                    {formSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`p-3 rounded-lg flex items-center gap-2 ${theme === "dark"
                          ? "bg-teal-900/50 text-teal-300 border border-teal-700"
                          : "bg-teal-50 text-teal-800 border border-teal-200"
                          }`}
                      >
                        <FaCheck className="text-teal-500" />
                        <span>{formSuccess}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <label className={`block mb-2 text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Amount</label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                        <FaDollarSign className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
                      </div>
                      <input
                        type="number"
                        value={newExpense.amount}
                        onChange={(e) => {
                          setNewExpense({ ...newExpense, amount: e.target.value });
                          if (formErrors.amount) {
                            setFormErrors({ ...formErrors, amount: "" });
                          }
                        }}
                        className={`w-full py-2.5 px-10 rounded-xl shadow-sm ${formErrors.amount
                          ? (theme === "dark" ? "border-red-500" : "border-red-500")
                          : (theme === "dark" ? "border-gray-600" : "border-gray-300")
                          } ${theme === "dark"
                            ? "bg-gray-700/70 shadow-inner shadow-black/10 text-white"
                            : "bg-white"
                          } border focus:outline-none focus:ring-2 ${theme === "dark"
                            ? "focus:ring-teal-500 focus:border-teal-500"
                            : "focus:ring-amber-400 focus:border-amber-400"
                          } transition-all duration-200`}
                        placeholder="0.00"
                      />
                    </div>
                    <AnimatePresence>
                      {formErrors.amount && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -5 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
                        >
                          <FaExclamationTriangle className="text-red-500" size={12} />
                          {formErrors.amount}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div>
                    <label className={`block mb-2 text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Category</label>
                    <div className="relative">
                      <select
                        value={newExpense.category}
                        onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                        className={`w-full py-2.5 px-3.5 rounded-xl shadow-sm appearance-none ${theme === "dark"
                          ? "bg-gray-700/70 border-gray-600 shadow-inner shadow-black/10 text-white"
                          : "bg-white border-gray-300 shadow-sm"
                          } border focus:outline-none focus:ring-2 ${theme === "dark"
                            ? "focus:ring-teal-500 focus:border-teal-500"
                            : "focus:ring-amber-400 focus:border-amber-400"
                          } transition-all duration-200`}
                      >
                        {Object.keys(categories).map(cat => (
                          <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <FaChevronDown className={`h-4 w-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={`block mb-2 text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Description</label>
                    <input
                      type="text"
                      value={newExpense.description}
                      onChange={(e) => {
                        setNewExpense({ ...newExpense, description: e.target.value });
                        if (formErrors.description) {
                          setFormErrors({ ...formErrors, description: "" });
                        }
                      }}
                      className={`w-full py-2.5 px-3.5 rounded-xl shadow-sm ${formErrors.description
                        ? (theme === "dark" ? "border-red-500" : "border-red-500")
                        : (theme === "dark" ? "border-gray-600" : "border-gray-300")
                        } ${theme === "dark"
                          ? "bg-gray-700/70 shadow-inner shadow-black/10 text-white"
                          : "bg-white"
                        } border focus:outline-none focus:ring-2 ${theme === "dark"
                          ? "focus:ring-teal-500 focus:border-teal-500"
                          : "focus:ring-amber-400 focus:border-amber-400"
                        } transition-all duration-200`}
                      placeholder="What did you spend on?"
                    />
                    <AnimatePresence>
                      {formErrors.description && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -5 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
                        >
                          <FaExclamationTriangle className="text-red-500" size={12} />
                          {formErrors.description}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <motion.button
                    onClick={addExpense}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: theme === "dark"
                        ? "0 0 20px rgba(20, 184, 166, 0.5)"
                        : "0 0 20px rgba(20, 184, 166, 0.5)"
                    }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full py-3.5 rounded-xl cursor-pointer ${theme === "dark"
                      ? "bg-gradient-to-r from-teal-500 via-emerald-600 to-cyan-600 ring-1 ring-teal-700/50"
                      : "bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-600 ring-1 ring-teal-300/50"
                      } text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2`}
                  >
                    <FaPlus className="drop-shadow-md" />
                    <span className="drop-shadow-md">Add Expense</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Edit Expense Modal */}
          {isEditModalOpen && editingExpense && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 backdrop-blur-sm bg-black/20"
                onClick={closeAllModals}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`relative rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 shadow-2xl max-w-md w-full mx-4`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${theme === "dark"
                      ? "bg-teal-800/90 text-teal-300"
                      : "bg-blue-100 text-blue-600"}`}>
                      <FaEdit />
                    </div>
                    Edit Expense
                  </h2>
                  <button
                    onClick={closeAllModals}
                    className={`p-2 rounded-full cursor-pointer ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={`block mb-1 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Amount</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <FaDollarSign className={theme === "dark" ? "text-gray-500" : "text-gray-400"} />
                      </div>
                      <input
                        type="number"
                        value={editingExpense.amount}
                        onChange={(e) => setEditingExpense({ ...editingExpense, amount: parseFloat(e.target.value) })}
                        className={`w-full py-2 px-9 rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} border focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-purple-500" : "focus:ring-blue-500"}`}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block mb-1 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Category</label>
                    <select
                      value={editingExpense.category}
                      onChange={(e) => setEditingExpense({ ...editingExpense, category: e.target.value })}
                      className={`w-full py-2 px-3 rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} border focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-purple-500" : "focus:ring-blue-500"}`}
                    >
                      {Object.keys(categories).map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block mb-1 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Description</label>
                    <input
                      type="text"
                      value={editingExpense.description}
                      onChange={(e) => setEditingExpense({ ...editingExpense, description: e.target.value })}
                      className={`w-full py-2 px-3 rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} border focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-purple-500" : "focus:ring-blue-500"}`}
                      placeholder="What did you spend on?"
                    />
                  </div>
                  <motion.button
                    onClick={updateExpense}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: theme === "dark"
                        ? "0 0 20px rgba(20, 184, 166, 0.5)"
                        : "0 0 20px rgba(20, 184, 166, 0.5)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 rounded-lg cursor-pointer ${theme === "dark" ? "bg-gradient-to-r from-teal-500 to-cyan-600" : "bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-600"} text-white font-medium shadow-md hover:shadow-lg transition-shadow flex items-center justify-center gap-2`}
                  >
                    <FaEdit /> Update Expense
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {isDeleteModalOpen && expenseToDelete && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 backdrop-blur-sm bg-black/20"
                onClick={closeAllModals}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`relative rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"} p-6 shadow-2xl max-w-md w-full mx-4 flex flex-col items-center text-center`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${theme === "dark" ? "bg-red-900/30" : "bg-red-100"}`}>
                  <FaExclamationTriangle className="text-red-500 text-2xl" />
                </div>
                <h2 className="text-xl font-bold mb-2">Confirm Deletion</h2>
                <p className={`mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  Are you sure you want to delete this expense? This action cannot be undone.
                </p>
                <div className="flex gap-3 w-full">
                  <motion.button
                    onClick={closeAllModals}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 py-3 rounded-lg cursor-pointer ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} font-medium`}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={() => deleteExpense(expenseToDelete)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 rounded-lg cursor-pointer bg-red-500 hover:bg-red-600 text-white font-medium"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
