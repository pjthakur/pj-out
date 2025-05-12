"use client";

import React, { useState, useEffect, useRef } from "react";
import { Moon, Sun, Camera, Monitor, Smartphone, BarChart3, Check, X, AlertCircle, Info, Bell, CheckCircle, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Toast = {
  id: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
};

type Service = {
  id: string;
  name: string;
  basePrice: number;
  icon: React.ReactNode;
  description: string;
  color: {
    light: string;
    dark: string;
  };
};

type Extra = {
  id: string;
  name: string;
  price: number;
  description: string;
};

const services: Service[] = [
  {
    id: "photography",
    name: "Photography",
    basePrice: 800,
    icon: <Camera size={24} />,
    description: "Professional photography services for any occasion",
    color: {
      light: "from-pink-500 to-rose-500",
      dark: "from-pink-600 to-rose-600",
    }
  },
  {
    id: "web-design",
    name: "Web Design",
    basePrice: 1200,
    icon: <Monitor size={24} />,
    description: "Custom website design with responsive layouts",
    color: {
      light: "from-indigo-500 to-blue-500",
      dark: "from-indigo-600 to-blue-600",
    }
  },
  {
    id: "marketing",
    name: "Digital Marketing",
    basePrice: 1500,
    icon: <Smartphone size={24} />,
    description: "Comprehensive digital marketing campaigns",
    color: {
      light: "from-emerald-500 to-teal-500",
      dark: "from-emerald-600 to-teal-600",
    }
  },
  {
    id: "consulting",
    name: "Business Consulting",
    basePrice: 2000,
    icon: <BarChart3 size={24} />,
    description: "Expert business strategy and growth consulting",
    color: {
      light: "from-amber-500 to-yellow-500",
      dark: "from-amber-600 to-yellow-600",
    }
  },
];

const extras: Extra[] = [
  {
    id: "fast-delivery",
    name: "Fast Delivery",
    price: 250,
    description: "Get your project completed within 5 business days",
  },
  {
    id: "premium-style",
    name: "Premium Style",
    price: 350,
    description: "Premium design elements and exclusive features",
  },
  {
    id: "seo-optimization",
    name: "SEO Optimization",
    price: 300,
    description: "Complete SEO setup to improve visibility",
  },
  {
    id: "24-7-support",
    name: "24/7 Support",
    price: 450,
    description: "Round-the-clock customer support",
  },
];

export default function Home() {
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number>(0);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [mounted, setMounted] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [formErrors, setFormErrors] = useState({ name: "", email: "" });
  const [showMobilePrice, setShowMobilePrice] = useState(true);

  const priceSummaryRef = useRef<HTMLDivElement>(null);

  const selectedService = services[selectedServiceIndex];

  const addToast = (message: string, type: "success" | "info" | "warning" | "error" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem("theme", theme);

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, mounted]);

  useEffect(() => {
    let price = selectedService?.basePrice || 0;
    selectedExtras.forEach((extraId) => {
      const extra = extras.find((e) => e.id === extraId);
      if (extra) {
        price += extra.price;
      }
    });

    if (billingCycle === "yearly") {
      price = Math.round(price * 0.8);
    }

    setTotalPrice(price);
  }, [selectedService, selectedExtras, billingCycle]);

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      if (priceSummaryRef.current) {
        const rect = priceSummaryRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        setShowMobilePrice(!isVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mounted]);

  const toggleExtra = (extraId: string) => {
    const isAdding = !selectedExtras.includes(extraId);
    setSelectedExtras((prev) =>
      prev.includes(extraId)
        ? prev.filter((id) => id !== extraId)
        : [...prev, extraId]
    );
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const toggleBillingCycle = () => {
    const newCycle = billingCycle === "monthly" ? "yearly" : "monthly";
    setBillingCycle(newCycle);
  };

  const handleServiceSelect = (index: number) => {
    if (index !== selectedServiceIndex) {
      setSelectedServiceIndex(index);
    }
  };

  const handleGetStarted = () => {
    setShowConfirmation(true);
  };

  const validateForm = () => {
    const errors = { name: "", email: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      addToast(`Thank you ${formData.name}! We'll contact you shortly.`, "success");
      setShowConfirmation(false);

      setFormData({ name: "", email: "" });
    }
  };

  const bgPattern = theme === "light"
    ? "bg-[url('https://images.unsplash.com/photo-1554629947-334ff61d85dc?q=80&w=1000&auto=format&fit=crop')] bg-no-repeat bg-right-top bg-fixed bg-cover"
    : "bg-[url('https://images.unsplash.com/photo-1686425374911-e0d752e09806?q=80&w=1000&auto=format&fit=crop')] bg-no-repeat bg-right-top bg-fixed bg-cover";

  const scrollToPriceSummary = () => {
    priceSummaryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen ${bgPattern} ${theme === "light"
      ? "bg-gradient-to-br from-slate-50 via-white to-indigo-50"
      : "bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950"} 
      transition-colors duration-500`}
    >
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className={`rounded-lg shadow-lg p-4 flex items-center justify-between max-w-md backdrop-blur-sm ${toast.type === "success" ? "bg-green-600/90 text-white" :
                toast.type === "error" ? "bg-red-600/90 text-white" :
                  toast.type === "warning" ? "bg-amber-600/90 text-white" :
                    "bg-indigo-600/90 text-white"
                }`}
            >
              <div className="flex items-center">
                <span className="mr-3">
                  {toast.type === "success" ? <CheckCircle size={18} /> :
                    toast.type === "error" ? <AlertCircle size={18} /> :
                      toast.type === "warning" ? <Bell size={18} /> :
                        <Info size={18} />}
                </span>
                <p className="font-medium">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 text-white/80 hover:text-white"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${theme === "light" ? "bg-white" : "bg-gray-900"}`}
            >
              <div className="relative">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-indigo-500/20 blur-2xl"></div>
                  <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-purple-500/20 blur-2xl"></div>
                  <div className="absolute left-1/2 top-1/3 w-32 h-32 rounded-full bg-indigo-300/10 blur-xl transform -translate-x-1/2"></div>
                  <div className="absolute left-1/4 bottom-1/4 w-24 h-24 rounded-full bg-purple-300/10 blur-lg"></div>
                  <div className="absolute right-1/4 top-1/4 w-16 h-16 rounded-full bg-indigo-300/10 blur-md"></div>
                </div>

                <div className="relative p-3 sm:p-4 max-h-[85vh] overflow-y-auto scrollbar-thin">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center">
                      <div className={`p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 ${theme === "light" ? "bg-indigo-100" : "bg-indigo-900/50"}`}>
                        <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${theme === "light" ? "text-indigo-600" : "text-indigo-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h2 className={`text-base sm:text-lg font-bold ${theme === "light" ? "text-gray-800" : "text-white"}`}>
                        Complete Your Order
                      </h2>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: theme === "light" ? "rgba(243, 244, 246, 1)" : "rgba(31, 41, 55, 1)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowConfirmation(false)}
                      className={`rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                    >
                      <X size={18} />
                    </motion.button>
                  </div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`mb-3 sm:mb-4 p-3 sm:p-4 rounded-xl ${theme === "light"
                      ? "bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-100"
                      : "bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border border-indigo-800/30"}`}
                  >
                    <h3 className={`font-medium mb-2 flex items-center text-xs sm:text-sm ${theme === "light" ? "text-indigo-700" : "text-indigo-300"}`}>
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Order Summary
                    </h3>
                    <div className={`space-y-1.5 text-xs ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${theme === "light"
                            ? "bg-white/80"
                            : "bg-gray-800"}`}
                          >
                            {selectedService.icon}
                          </div>
                          <span className="font-medium">{selectedService.name}</span>
                        </div>
                        <span className={`font-bold ${theme === "light" ? "text-indigo-700" : "text-indigo-400"}`}>
                          ${billingCycle === "monthly" ? selectedService.basePrice : Math.round(selectedService.basePrice * 0.8)}
                        </span>
                      </div>

                      {selectedExtras.length > 0 && (
                        <div className={`mt-2 pt-2 border-t ${theme === "light" ? "border-indigo-200/50" : "border-gray-700/50"}`}>
                          <p className="text-[10px] uppercase mb-1.5 opacity-70">Selected Add-ons</p>
                          <div className="max-h-24 overflow-y-auto pr-1">
                            {selectedExtras.map(extraId => {
                              const extra = extras.find(e => e.id === extraId);
                              return extra && (
                                <div key={extra.id} className="flex justify-between items-center text-xs py-0.5">
                                  <span>{extra.name}</span>
                                  <span>${extra.price}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className={`mt-2 pt-2 border-t ${theme === "light" ? "border-indigo-200/50" : "border-gray-700/50"}`}>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Billing Cycle:</span>
                          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${billingCycle === "yearly"
                            ? theme === "light" ? "bg-green-300 text-green-800" : "bg-green-900/30 text-green-400"
                            : theme === "light" ? "bg-indigo-300 text-indigo-800" : "bg-indigo-900/30 text-indigo-400"}`}
                          >
                            {billingCycle === "monthly" ? "Monthly" : "Yearly (20% off)"}
                          </span>
                        </div>
                      </div>

                      <div className={`mt-3 pt-2 border-t ${theme === "light" ? "border-indigo-200" : "border-gray-700"} flex justify-between items-center`}>
                        <span className="font-bold text-sm sm:text-base">Total:</span>
                        <div className="text-right">
                          <span className={`font-bold text-sm sm:text-base ${theme === "light"
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                            : "bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"}`}
                          >
                            ${totalPrice}
                          </span>
                          <span className="text-[10px] ml-1">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.form
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleFormSubmit}
                    className="space-y-3"
                  >
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="name" className={`block text-xs font-medium mb-1 ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                          Your Name
                        </label>
                        <div className="relative">
                          <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs ${theme === "light"
                              ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white text-gray-800"
                              : "bg-gray-800 border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 text-white"} 
                              focus:outline-none focus:ring-1 focus:ring-opacity-50 transition-all duration-200`}
                            placeholder="Enter your name"
                          />
                        </div>
                        {formErrors.name && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1 text-xs text-red-500 flex items-center"
                          >
                            <AlertCircle size={12} className="mr-1" />
                            {formErrors.name}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className={`block text-xs font-medium mb-1 ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                          Email Address
                        </label>
                        <div className="relative">
                          <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs ${theme === "light"
                              ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white text-gray-800"
                              : "bg-gray-800 border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 text-white"} 
                              focus:outline-none focus:ring-1 focus:ring-opacity-50 transition-all duration-200`}
                            placeholder="Enter your email"
                          />
                        </div>
                        {formErrors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1 text-xs text-red-500 flex items-center"
                          >
                            <AlertCircle size={12} className="mr-1" />
                            {formErrors.email}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02, backgroundColor: theme === "light" ? "rgb(243, 244, 246)" : "rgb(55, 65, 81)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowConfirmation(false)}
                        className={`flex-1 px-3 py-2 rounded-lg border text-xs ${theme === "light"
                          ? "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                          : "border-gray-700 text-gray-300 bg-gray-700 hover:bg-gray-800"} 
                          transition-colors duration-200`}
                      >
                        Cancel
                      </motion.button>

                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3), 0 4px 6px -4px rgba(99, 102, 241, 0.3)" }}
                        whileTap={{ scale: 0.98 }}
                        className="relative overflow-hidden flex-1 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 
                          hover:to-purple-500 text-white font-medium rounded-lg shadow-md text-xs
                          hover:shadow-lg transition-all duration-200"
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          <CheckCircle size={14} className="mr-1" />
                          Confirm Order
                        </span>

                        <motion.div
                          className="absolute inset-0 rounded-lg pointer-events-none"
                          initial={{ scale: 0, opacity: 0 }}
                          whileTap={{
                            scale: [0, 2],
                            opacity: [0.5, 0],
                          }}
                          transition={{ duration: 0.5 }}
                          style={{
                            background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)",
                            transformOrigin: "center"
                          }}
                        />
                      </motion.button>
                    </div>

                    <div className={`mt-3 pt-3 border-t ${theme === "light" ? "border-gray-200" : "border-gray-800"}`}>
                      <div className="flex items-center justify-center space-x-3 text-[10px]">
                        <div className="flex items-center">
                          <svg className={`w-3 h-3 mr-1 ${theme === "light" ? "text-green-600" : "text-green-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span className={theme === "light" ? "text-gray-600" : "text-gray-400"}>Secure Payment</span>
                        </div>
                        <div className="flex items-center">
                          <svg className={`w-3 h-3 mr-1 ${theme === "light" ? "text-green-600" : "text-green-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <span className={theme === "light" ? "text-gray-600" : "text-gray-400"}>Privacy Protected</span>
                        </div>
                      </div>
                    </div>
                  </motion.form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6 max-w-7xl mx-auto gap-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r ${theme === "light"
              ? "from-indigo-700 via-blue-600 to-indigo-800 bg-clip-text text-transparent"
              : "from-indigo-400 via-pink-300 to-purple-300 bg-clip-text text-transparent"}`}
          >
            ESTIMATE YOUR COST
          </motion.h1>

          <div className={`flex justify-center items-center ${theme === "light"
            ? "text-gray-700"
            : "text-gray-200"}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`px-4 sm:px-6 py-3 rounded-full flex items-center ${theme === "light"
                ? "bg-white shadow-lg border border-indigo-100 backdrop-blur-sm"
                : "bg-gray-800/90 shadow-lg border-2 border-indigo-500/50 backdrop-blur-sm"}`}>
              <span className={`mr-2 sm:mr-4 text-sm sm:text-base font-semibold transition-colors duration-300 ${billingCycle === "monthly"
                ? theme === "light" ? "text-indigo-600 font-bold" : "text-white font-bold"
                : theme === "light" ? "text-gray-400" : "text-gray-400"}`}>
                Monthly
              </span>
              <div 
                onClick={toggleBillingCycle}
                className={`relative w-12 sm:w-14 h-6 sm:h-7 rounded-full cursor-pointer ${theme === "light"
                  ? "bg-indigo-100"
                  : "bg-indigo-900"}`}
              >
                <div 
                  className={`absolute inset-0 rounded-full transition-colors duration-300 ${theme === "light"
                    ? "border border-indigo-200"
                    : "border-2 border-indigo-500"}`}
                />
                <div 
                  className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full shadow-lg transform transition-transform duration-300 ${
                    billingCycle === "yearly" 
                      ? "translate-x-6 sm:translate-x-8 bg-gradient-to-r from-indigo-400 to-indigo-500" 
                      : "translate-x-1 bg-gradient-to-r from-gray-400 to-gray-500"
                  }`}
                />
              </div>
              <span className={`ml-2 sm:ml-4 text-sm sm:text-base font-semibold transition-colors duration-300 ${billingCycle === "yearly"
                ? theme === "light" ? "text-indigo-600 font-bold" : "text-white font-bold"
                : theme === "light" ? "text-gray-400" : "text-gray-400"}`}>
                Yearly
              </span>
            </motion.div>
          </div>
        </header>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className={`fixed bottom-4 right-4 p-3 rounded-full ${theme === "light"
            ? "bg-white/80 text-indigo-700 shadow-lg border border-indigo-100 backdrop-blur-sm"
            : "bg-gray-800/80 text-indigo-200 shadow-lg border border-gray-700 backdrop-blur-sm"} 
            hover:shadow-xl transition-all duration-300 z-50`}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </motion.button>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-7xl mx-auto">
          <div className="lg:w-2/3 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`p-4 sm:p-6 mb-6 rounded-2xl ${theme === "light"
                ? "bg-white/80 backdrop-blur-md shadow-xl border border-indigo-50"
                : "bg-gray-900/80 backdrop-blur-md shadow-xl border border-gray-800"} 
                transition-colors duration-300`}
            >
              <h2 className={`${theme === "light" ? "text-gray-800" : "text-gray-100"} text-lg font-semibold mb-4`}>
                Select Service
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    whileHover={{
                      scale: selectedServiceIndex === index ? 1 : 1.02,
                      boxShadow: selectedServiceIndex === index ? undefined : "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleServiceSelect(index)}
                    animate={selectedServiceIndex === index ? {
                      boxShadow: [
                        "0 0 0 0px rgba(99, 102, 241, 0.4)",
                        "0 0 0 4px rgba(99, 102, 241, 0.4)",
                        "0 0 0 2px rgba(99, 102, 241, 0.2)"
                      ]
                    } : {}}
                    transition={{
                      boxShadow: { duration: 0.5, ease: "easeOut" }
                    }}
                    className={`relative p-4 rounded-xl text-left cursor-pointer transition-all duration-300 overflow-hidden h-full
                      ${selectedServiceIndex === index
                        ? theme === "light"
                          ? "scale-105 z-10"
                          : "scale-105 z-10"
                        : "hover:shadow-md"
                      }`}
                    style={{
                      boxShadow: selectedServiceIndex === index
                        ? theme === "light"
                          ? "0 4px 6px -1px rgba(99, 102, 241, 0.2), 0 2px 4px -1px rgba(99, 102, 241, 0.1), 0 0 0 4px rgba(99, 102, 241, 0.5), 0 0 0 2px rgba(79, 70, 229, 0.4)"
                          : "0 4px 6px -1px rgba(99, 102, 241, 0.3), 0 2px 4px -1px rgba(99, 102, 241, 0.2), 0 0 0 4px rgba(99, 102, 241, 0.5), 0 0 0 2px rgba(79, 70, 229, 0.4)"
                        : theme === "light"
                          ? "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06), 0 0 0 2px rgba(229, 231, 235, 1)"
                          : "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 0 0 2px rgba(55, 65, 81, 1)",
                      background: theme === "light"
                        ? selectedServiceIndex === index
                          ? "linear-gradient(to bottom right, rgba(238, 242, 255, 1), rgba(255, 255, 255, 1), rgba(238, 242, 255, 1))"
                          : "#ffffff"
                        : selectedServiceIndex === index
                          ? "linear-gradient(to bottom right, rgba(67, 56, 202, 0.1), rgba(17, 24, 39, 1), rgba(67, 56, 202, 0.1))"
                          : "rgb(31, 41, 55)"
                    }}
                  >
                    {selectedServiceIndex === index && (
                      <div className="absolute bottom-2 right-2 overflow-visible z-10">
                        <div className={`px-2 py-0.5 rounded-full ${theme === "light" ? "bg-gradient-to-r from-indigo-600 to-purple-600" : "bg-gradient-to-r from-indigo-500 to-purple-500"} flex items-center justify-center shadow-sm border border-white/40`}>
                          <span className="text-[10px] font-bold text-white tracking-wide">SELECTED</span>
                        </div>
                      </div>
                    )}

                    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-20 bg-gradient-to-br 
                      ${selectedServiceIndex === index
                        ? service.color.light + " opacity-60"
                        : service.color.light + " opacity-20"
                      }`}>
                    </div>

                    {selectedServiceIndex === index && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent shimmer"></div>
                    )}

                    <div className="flex h-full relative z-10">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center 
                        ${selectedServiceIndex === index
                          ? theme === "light"
                            ? "bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md shadow-indigo-500/30 text-white"
                            : "bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md shadow-indigo-500/30 text-white"
                          : `bg-gradient-to-br ${service.color.light} ${theme === "light"
                            ? "shadow-md text-white"
                            : "shadow-lg text-white"}`
                        }`}>
                        <motion.div
                          animate={{
                            scale: selectedServiceIndex === index ? [1, 1.2, 1] : [1, 1.05, 1],
                            opacity: [1, 0.8, 1]
                          }}
                          transition={{
                            duration: selectedServiceIndex === index ? 1.5 : 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                            delay: index * 0.2
                          }}
                        >
                          {service.icon}
                        </motion.div>
                      </div>

                      <div className="ml-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className={`text-base font-bold ${selectedServiceIndex === index
                            ? theme === "light"
                              ? "text-indigo-700"
                              : "text-indigo-300"
                            : theme === "light"
                              ? "text-gray-800"
                              : "text-white"}`}
                          >
                            {service.name}
                            {selectedServiceIndex === index && (
                              <span className="ml-2 inline-flex items-center">
                                <Check size={14} className={`${theme === "light" ? "text-indigo-600" : "text-indigo-400"}`} />
                              </span>
                            )}
                          </h3>
                          <p className={`text-xs mt-1 ${selectedServiceIndex === index
                            ? theme === "light" ? "text-indigo-600" : "text-indigo-400"
                            : theme === "light" ? "text-gray-500" : "text-gray-300"}`}>
                            {service.description}
                          </p>
                        </div>

                        <div className="mt-4 space-y-1 flex justify-between items-center mb-4">
                          <div className="flex items-center mt-1">
                            <span className={`text-xs font-semimedium ${selectedServiceIndex === index
                              ? theme === "light" ? "text-indigo-700" : "text-indigo-400"
                              : theme === "light" ? "text-gray-600" : "text-gray-400"
                              }`}>
                              Monthly:
                            </span>
                            <span className={`ml-2 text-xs font-bold ${selectedServiceIndex === index && billingCycle === "monthly"
                              ? theme === "light"
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                                : "bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
                              : selectedServiceIndex === index
                                ? theme === "light" ? "text-indigo-700" : "text-indigo-400"
                                : theme === "light" ? "text-indigo-600" : "text-indigo-400"
                              }`}
                            >
                              ${service.basePrice}/mo
                            </span>
                          </div>
                          <div className="flex  items-center">
                            <span className={`text-xs font-semimedium ${selectedServiceIndex === index
                              ? theme === "light" ? "text-indigo-700" : "text-indigo-400"
                              : theme === "light" ? "text-gray-600" : "text-gray-400"
                              }`}>
                              Yearly:
                            </span>
                            <span className={`ml-2  text-xs font-bold ${selectedServiceIndex === index && billingCycle === "yearly"
                              ? theme === "light"
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                                : "bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
                              : selectedServiceIndex === index
                                ? theme === "light" ? "text-indigo-700" : "text-indigo-400"
                                : theme === "light" ? "text-indigo-600" : "text-indigo-400"
                              }`}
                            >
                              ${Math.round(service.basePrice * 0.8)}/mo
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`p-4 sm:p-6 rounded-2xl ${theme === "light"
                ? "bg-white/80 backdrop-blur-md shadow-xl border border-indigo-50"
                : "bg-gray-900/80 backdrop-blur-md shadow-xl border border-gray-800"} 
                transition-colors duration-300`}
            >
              <h2 className={`${theme === "light" ? "text-gray-800" : "text-gray-100"} text-lg font-semibold mb-4`}>
                Add-Ons
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {extras.map((extra) => (
                  <motion.div
                    key={extra.id}
                    whileHover={{
                      y: -3,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                    }}
                    className={`rounded-xl transition-all duration-300 h-full border overflow-hidden
                      ${selectedExtras.includes(extra.id)
                        ? theme === "light"
                          ? "bg-gradient-to-br from-indigo-50 to-white border-indigo-200 shadow-md"
                          : "bg-gradient-to-br from-gray-800 to-gray-900 border-indigo-900 shadow-md"
                        : theme === "light"
                          ? "bg-white border-gray-100 shadow-sm"
                          : "bg-gray-800 border-gray-700 shadow-sm"
                      }`}
                  >
                    <label className="flex p-4 cursor-pointer w-full h-full">
                      <div className="relative flex-none mr-3 pt-1">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={selectedExtras.includes(extra.id)}
                          onChange={() => toggleExtra(extra.id)}
                        />
                        <motion.div
                          whileTap={{ scale: 0.9 }}
                          className={`w-5 h-5 rounded-md border-2 transition-colors duration-300 flex items-center justify-center
                            ${selectedExtras.includes(extra.id)
                              ? theme === "light"
                                ? "bg-gradient-to-r from-indigo-500 to-indigo-600 border-transparent"
                                : "bg-gradient-to-r from-indigo-500 to-purple-600 border-transparent"
                              : theme === "light"
                                ? "bg-white border-indigo-300"
                                : "bg-gray-800 border-indigo-500"}`}
                        >
                          {selectedExtras.includes(extra.id) && (
                            <motion.svg
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </motion.svg>
                          )}
                        </motion.div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className={`font-semibold text-base ${theme === "light" ? "text-gray-800" : "text-white"}`}>
                            {extra.name}
                          </p>
                          <motion.p
                            animate={{
                              scale: selectedExtras.includes(extra.id) ? [1, 1.1, 1] : 1,
                            }}
                            transition={{
                              duration: 0.5,
                              repeat: selectedExtras.includes(extra.id) ? 1 : 0,
                            }}
                            className={`font-bold text-base ml-2 ${selectedExtras.includes(extra.id)
                              ? "bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent"
                              : theme === "light" ? "text-indigo-600" : "text-indigo-400"
                              }`}
                          >
                            +${extra.price}
                          </motion.p>
                        </div>
                        <p className={`text-xs mt-1 ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
                          {extra.description}
                        </p>
                      </div>
                    </label>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            ref={priceSummaryRef}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:w-1/3 w-full lg:sticky lg:top-10 self-start"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden h-full">
                <div className="absolute inset-0 overflow-hidden opacity-30">
                  <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/20 blur-2xl"></div>
                  <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-white/20 blur-2xl"></div>
                  <div className="absolute left-1/2 top-1/3 w-32 h-32 rounded-full bg-white/20 blur-xl transform -translate-x-1/2"></div>
                </div>

                <div className="relative p-8 sm:p-10 h-full flex flex-col">
                  <motion.div
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="flex items-center"
                  >
                    <div className={`w-3 h-3 rounded-full mr-2 animate-pulse ${billingCycle === "monthly" ? "bg-green-400" : "bg-indigo-300"}`}></div>
                    <h2 className="text-xl font-medium">
                      {billingCycle === "monthly" ? "Monthly Billing" : "Yearly Billing"}
                    </h2>
                  </motion.div>

                  <div className="mt-10 mb-4">
                    <div className="text-indigo-100 font-medium mb-2">TOTAL COST</div>
                    <div className="flex items-center">
                      <motion.div
                        key={totalPrice}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="flex items-baseline"
                      >
                        <span className="text-6xl font-bold">
                          ${totalPrice}
                        </span>
                        <span className="text-xl ml-2 text-indigo-200">
                          /{billingCycle === "monthly" ? "mo" : "yr"}
                        </span>
                      </motion.div>

                      <AnimatePresence mode="wait">
                        {billingCycle === "yearly" && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30, delay: 0.2 }}
                            className="ml-2 bg-green-500/90 text-white text-xs font-bold py-1 px-3 rounded-full flex"
                          >
                            <svg className="w-4 mt-0.5 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="ml-1 text-center">20% SAVED</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="mb-8 bg-white/10 rounded-lg p-5 backdrop-blur-sm">
                    <h3 className="text-white font-medium mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Price Breakdown
                    </h3>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-indigo-200/30 pb-2">
                        <span className="text-indigo-100">Base Service</span>
                        <span className="font-medium text-white">${selectedService?.basePrice}</span>
                      </div>

                      {selectedExtras.length > 0 ? (
                        selectedExtras.map(extraId => {
                          const extra = extras.find(e => e.id === extraId);
                          return extra ? (
                            <div key={extra.id} className="flex justify-between text-sm">
                              <span className="text-indigo-100">{extra.name}</span>
                              <span className="font-medium text-white">+${extra.price}</span>
                            </div>
                          ) : null;
                        })
                      ) : (
                        <div className="text-indigo-100 italic">No add-ons selected</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 mr-3 text-indigo-100 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-indigo-100">No commitment required</p>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 mr-3 text-indigo-200 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-indigo-100">Cancel anytime with no fees</p>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 mr-3 text-indigo-200 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-indigo-100">Dedicated support team</p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                      background: theme === "light"
                        ? "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(238,242,255,1) 100%)"
                        : "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(224,231,255,1) 100%)"
                    }}
                    whileTap={{
                      scale: 0.97,
                      boxShadow: "0 5px 15px -5px rgba(0, 0, 0, 0.1)"
                    }}
                    onClick={handleGetStarted}
                    animate={{
                      boxShadow: ["0 4px 6px -1px rgba(99, 102, 241, 0.1), 0 2px 4px -1px rgba(99, 102, 241, 0.06)",
                        "0 8px 10px -3px rgba(99, 102, 241, 0.2), 0 4px 6px -2px rgba(99, 102, 241, 0.1)",
                        "0 4px 6px -1px rgba(99, 102, 241, 0.1), 0 2px 4px -1px rgba(99, 102, 241, 0.06)"],
                    }}
                    transition={{
                      boxShadow: {
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut"
                      }
                    }}
                    className="relative overflow-hidden group bg-white text-indigo-600 font-bold py-4 px-8 rounded-xl hover:bg-opacity-95 shadow-lg mb-8"
                  >
                    <span className="relative z-10">Get Started</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        x: ["0%", "100%", "0%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"
                      initial={{ width: "0%" }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />

                    <motion.div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      initial={{ scale: 0, opacity: 0 }}
                      whileTap={{
                        scale: [0, 1.5],
                        opacity: [0.5, 0],
                      }}
                      transition={{ duration: 0.5 }}
                      style={{
                        background: "radial-gradient(circle, rgba(99,102,241,0.5) 0%, rgba(255,255,255,0) 70%)",
                        transformOrigin: "center"
                      }}
                    />
                  </motion.button>

                  <div className="mt-auto pt-6 border-t border-indigo-200/50 text-center text-sm text-indigo-100">
                    <p>© 2025 Service Price Calculator</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showMobilePrice && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 lg:hidden z-40"
          >
            <div className={`py-3 px-4 ${theme === "light"
              ? "bg-white/95 border-t border-indigo-100 shadow-lg backdrop-blur-sm"
              : "bg-gray-900/95 border-t border-gray-800 shadow-lg backdrop-blur-sm"}`}
            >
              <div className="flex flex-col items-center">
                <div className="mb-2">
                  <p className={`text-xs text-center ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                    Total Price
                  </p>
                  <p className={`text-lg font-bold text-center ${theme === "light"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"}`}
                  >
                    ${totalPrice}
                    <span className="text-xs ml-1 font-normal">
                      /{billingCycle === "monthly" ? "mo" : "yr"}
                    </span>
                    {billingCycle === "yearly" && (
                      <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${theme === "light" ? "bg-green-100 text-green-800" : "bg-green-900/30 text-green-400"}`}>
                        20% OFF
                      </span>
                    )}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={scrollToPriceSummary}
                  className={`flex items-center py-2 px-5 rounded-lg ${theme === "light"
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-500 text-white"} text-sm font-medium shadow-md`}
                >
                  <span>View Details</span>
                  <ArrowUp size={14} className="ml-2 rotate-45" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}