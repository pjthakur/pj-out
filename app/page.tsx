"use client";

import type React from "react";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  type FormEvent,
} from "react";
import Head from 'next/head'
import { motion, AnimatePresence } from "framer-motion";
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
  ResponsiveContainer,
} from "recharts";
import {
  Menu,
  X,
  Sun,
  Moon,
  Home,
  Info,
  Mail,
  AlertTriangle,
  Thermometer,
  TreePine,
  Droplets,
  DollarSign,
  Check,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Globe,
} from "lucide-react";


type ThemeType = "light" | "dark";

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
    card: string;
    glass: string;
    gradient: string;
    gradientSecondary: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const deforestationData = [
  { year: "2010", area: 5.2 },
  { year: "2012", area: 5.8 },
  { year: "2014", area: 6.1 },
  { year: "2016", area: 6.5 },
  { year: "2018", area: 7.2 },
  { year: "2020", area: 7.8 },
  { year: "2022", area: 8.3 },
  { year: "2023", area: 8.7 },
  { year: "2024", area: 9.1 },
  { year: "2025", area: 9.5 },
];

const glacierMeltingData = [
  { year: "2010", volume: 100 },
  { year: "2012", volume: 95 },
  { year: "2014", volume: 89 },
  { year: "2016", volume: 82 },
  { year: "2018", volume: 74 },
  { year: "2020", volume: 65 },
  { year: "2022", volume: 55 },
  { year: "2023", volume: 48 },
  { year: "2024", volume: 42 },
  { year: "2025", volume: 35 },
];

const temperatureData = [
  { year: "2010", temperature: 14.5 },
  { year: "2012", temperature: 14.6 },
  { year: "2014", temperature: 14.7 },
  { year: "2016", temperature: 14.9 },
  { year: "2018", temperature: 15.1 },
  { year: "2020", temperature: 15.3 },
  { year: "2022", temperature: 15.5 },
  { year: "2023", temperature: 15.7 },
  { year: "2024", temperature: 15.9 },
  { year: "2025", temperature: 16.1 },
];

const impactDistributionData = [
  { name: "Deforestation", value: 35 },
  { name: "Ocean Pollution", value: 25 },
  { name: "Air Pollution", value: 20 },
  { name: "Glacier Melting", value: 15 },
  { name: "Other", value: 5 },
];

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const donationOptions = [
  { id: 1, amount: 5, label: "$5" },
  { id: 2, amount: 10, label: "$10" },
  { id: 3, amount: 25, label: "$25" },
  { id: 4, amount: 50, label: "$50" },
  { id: 5, amount: 100, label: "$100" },
  { id: 6, amount: 0, label: "Custom" },
];

interface ToastProps {
  message: string;
  type: "success" | "error" | "warning";
  onClose: () => void;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface DonationFormData {
  name: string;
  email: string;
  amount: number;
  customAmount?: number;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface ToastContextType {
  addToast: (message: string, type: "success" | "error" | "warning") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export default function Page() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "about" | "contact">(
    "dashboard"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeType>("light");
  const [toasts, setToasts] = useState<
    Array<{
      id: number;
      message: string;
      type: "success" | "error" | "warning";
    }>
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
  }>({
    title: "",
    content: null,
  });

  const themeColors = {
    light: {
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      foreground: "#1e293b",
      primary: "#6366f1",
      secondary: "#10b981",
      accent: "#8b5cf6",
      muted: "#64748b",
      border: "rgba(143, 146, 150, 0.8)",
      success: "#22c55e",
      warning: "#f59e0b",
      danger: "#ef4444",
      card: "rgba(255, 255, 255, 0.8)",
      glass: "rgba(255, 255, 255, 0.80)",
      gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      gradientSecondary: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    dark: {
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      foreground: "#f8fafc",
      primary: "#818cf8",
      secondary: "#34d399",
      accent: "#a78bfa",
      muted: "#64748b",
      border: "rgba(51, 65, 85, 0.8)",
      success: "#4ade80",
      warning: "#fbbf24",
      danger: "#f87171",
      card: "rgba(30, 41, 59, 0.8)",
      glass: "rgba(30, 41, 59, 0.80)",
      gradient: "linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)",
      gradientSecondary: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
    },
  };

  const colors = themeColors[currentTheme];

  const themeContextValue: ThemeContextType = {
    theme: currentTheme,
    toggleTheme: () =>
      setCurrentTheme(currentTheme === "light" ? "dark" : "light"),
    colors,
  };

  const toastContextValue: ToastContextType = {
    addToast: (message: string, type: "success" | "error" | "warning") => {
      const id = Date.now();
      setToasts((prev) => {
        const updatedToasts = [...prev, { id, message, type }];
        if (updatedToasts.length > 2) {
          return updatedToasts.slice(-2);
        }
        return updatedToasts;
      });

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 5000);
    },
  };

  const addToast = (message: string, type: "success" | "error" | "warning") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const openModal = (title: string, content: React.ReactNode) => {
    setModalContent({ title, content });
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleDonationClick = () => {
    const handleDonationSubmitWithToast = (data: DonationFormData) => {
      handleDonationSubmit(data);
      closeModal();
    };

    openModal(
      "Make a Donation",
      <DonationForm
        onSubmit={handleDonationSubmitWithToast}
        showToast={(message: string, type: "success" | "error" | "warning") =>
          addToast(message, type)
        }
        onClose={closeModal}
      />
    );
  };

  const handleDonationSubmit = (data: DonationFormData) => {
    console.log("Donation data:", data);
    addToast(
      `Thank you for your donation of $${data.customAmount || data.amount}!`,
      "success"
    );
  };

  const handleContactSubmit = (data: ContactFormData) => {
    console.log("Contact form data:", data);
    addToast("Your message has been sent successfully!", "success");
  };

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(currentTheme);
    document.body.style.background = colors.background;
    document.body.style.color = colors.foreground;
  }, [currentTheme, colors]);

  const setActiveTabWithScroll = (tab: "dashboard" | "about" | "contact") => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <ToastContext.Provider value={toastContextValue}>
      <Head>
      <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <style>{`
          .font-montserrat {
            font-family: 'Montserrat', sans-serif;
          }
        `}</style>
      </Head>
        <div
          className={`--font-montserrat min-h-screen relative overflow-hidden`}
          style={{
            background: colors.background,
            color: colors.foreground,
          }}
        >
          {/* Background decorative elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl"
              style={{ background: colors.gradient }}
            />
            <div
              className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl"
              style={{ background: colors.gradientSecondary }}
            />
          </div>

          <AnimatePresence>
            {sidebarOpen && (
              <>
                {/* Mobile backdrop overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                  className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden cursor-pointer"
                />
                
                {/* Mobile sidebar */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed inset-y-0 left-0 z-50 w-72 backdrop-blur-xl border-r md:hidden"
                  style={{
                    background: colors.glass,
                    borderColor: colors.border,
                    backdropFilter: "blur(20px)",
                  }}
                >
                <div
                  className="flex items-center justify-between p-6 border-b"
                  style={{ borderColor: colors.border }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: colors.gradient }}
                    >
                      <Globe size={20} color="white" />
                    </div>
                    <h2
                      className="text-xl font-bold font-montserrat"
                      style={{ color: colors.primary }}
                    >
                      EcoVision
                    </h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-xl backdrop-blur-sm"
                    style={{ background: colors.glass }}
                  >
                    <X size={20} style={{ color: colors.foreground }} />
                  </motion.button>
                </div>
                <nav className="p-6">
                  <ul className="space-y-3">
                    {[
                      { key: "dashboard", icon: Home, label: "Dashboard" },
                      { key: "about", icon: Info, label: "About" },
                      { key: "contact", icon: Mail, label: "Contact" },
                    ].map(({ key, icon: Icon, label }) => (
                      <li key={key}>
                        <motion.button
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setActiveTabWithScroll(key as "dashboard" | "about" | "contact");
                            setSidebarOpen(false);
                          }}
                          className="flex items-center w-full p-4 space-x-4 rounded-2xl transition-all duration-300 cursor-pointer"
                          style={{
                            background:
                              activeTab === key
                                ? colors.gradient
                                : colors.glass,
                            color:
                              activeTab === key ? "white" : colors.foreground,
                            backdropFilter: "blur(10px)",
                          }}
                        >
                          <Icon size={20} />
                          <span className="font-medium">{label}</span>
                        </motion.button>
                      </li>
                    ))}
                  </ul>
                </nav>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <header
            className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl border-b"
            style={{
              background: colors.glass,
              borderColor: colors.border,
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="flex items-center p-4 relative">
              {/* Left side - Logo and title */}
              <div className="flex items-center space-x-4">
                {/* Mobile menu button - only visible on mobile */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSidebarOpen(true)}
                  className="p-3 rounded-2xl backdrop-blur-sm md:hidden cursor-pointer"
                  style={{ background: colors.glass }}
                >
                  <Menu size={20} style={{ color: colors.foreground }} />
                </motion.button>
                
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: colors.gradient }}
                  >
                    <Globe size={20} color="white" />
                  </div>
                  <h1
                    className="text-xl font-bold font-montserrat bg-gradient-to-r bg-clip-text text-transparent"
                    style={{ backgroundImage: colors.gradient }}
                  >
                    <span className="hidden sm:inline">EcoVision</span>
                    <span className="sm:hidden">EcoVision</span>
                  </h1>
                </div>
              </div>

              {/* Center - Desktop navigation - only visible on desktop */}
              <nav className="hidden md:flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
                {[
                  { key: "dashboard", icon: Home, label: "Dashboard" },
                  { key: "about", icon: Info, label: "About" },
                  { key: "contact", icon: Mail, label: "Contact" },
                ].map(({ key, icon: Icon, label }) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTabWithScroll(key as "dashboard" | "about" | "contact")}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer"
                    style={{
                      background: activeTab === key ? colors.gradient : colors.glass,
                      color: activeTab === key ? "white" : colors.foreground,
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{label}</span>
                  </motion.button>
                ))}
              </nav>

              {/* Right side - Theme toggle */}
              <div className="ml-auto">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={themeContextValue.toggleTheme}
                  className="p-3 rounded-2xl backdrop-blur-sm transition-all duration-300 cursor-pointer"
                  style={{ background: colors.glass }}
                >
                  {currentTheme === "light" ? (
                    <Moon size={20} style={{ color: colors.foreground }} />
                  ) : (
                    <Sun size={20} style={{ color: colors.foreground }} />
                  )}
                </motion.button>
              </div>
            </div>
          </header>

          <main className="container p-6 mx-auto relative z-10 pt-20">
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "about" && <About />}
            {activeTab === "contact" && (
              <Contact onSubmit={handleContactSubmit} />
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-8 mt-12 rounded-3xl backdrop-blur-xl border relative overflow-hidden"
              style={{
                background: colors.glass,
                borderColor: colors.border,
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl"
                  style={{ background: colors.gradientSecondary }}
                />
              </div>
              <div className="flex flex-col items-center justify-between gap-6 md:flex-row relative z-10">
                <div>
                  <h2
                    className="text-2xl font-bold font-montserrat mb-3 bg-gradient-to-r bg-clip-text text-transparent"
                    style={{ backgroundImage: colors.gradientSecondary }}
                  >
                    Support Our Environmental Initiatives
                  </h2>
                  <p className="text-lg" style={{ color: colors.muted }}>
                    Your donation helps us continue our work to protect the
                    environment and combat climate change.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDonationClick}
                  className="px-8 py-4 font-semibold rounded-2xl shadow-lg transition-all duration-300 cursor-pointer"
                  style={{
                    background: colors.gradientSecondary,
                    color: "white",
                    boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)",
                  }}
                >
                  <span className="flex items-center space-x-2">
                    <span>Donate Now</span>
                    <DollarSign size={18} />
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </main>

          {/* Footer */}
          <footer
            className="relative mt-20 backdrop-blur-xl border-t"
            style={{
              background: colors.glass,
              borderColor: colors.border,
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl"
                style={{ background: colors.gradient }}
              />
              <div
                className="absolute bottom-0 right-0 w-40 h-40 rounded-full blur-3xl"
                style={{ background: colors.gradientSecondary }}
              />
            </div>
            
            <div className="container mx-auto px-6 py-12 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Company Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: colors.gradient }}
                    >
                      <Globe size={20} color="white" />
                    </div>
                    <h3
                      className="text-xl font-bold font-montserrat bg-gradient-to-r bg-clip-text text-transparent"
                      style={{ backgroundImage: colors.gradient }}
                    >
                      EcoVision
                    </h3>
                  </div>
                  <p className="mb-4 leading-relaxed" style={{ color: colors.muted }}>
                    Leading the way in environmental monitoring and sustainable solutions for a better tomorrow.
                  </p>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: colors.success }}
                    />
                    <span className="text-sm" style={{ color: colors.muted }}>
                      Monitoring 24/7
                    </span>
                  </div>
                </motion.div>

                {/* Quick Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h4 className="text-lg font-semibold font-montserrat mb-6">
                    Quick Links
                  </h4>
                  <ul className="space-y-3">
                    {['Dashboard', 'About Us', 'Contact', 'Donate'].map((link, index) => (
                      <li key={link}>
                        <motion.button
                          whileHover={{ x: 4 }}
                          onClick={() => {
                            if (link === 'Dashboard') setActiveTabWithScroll('dashboard');
                            if (link === 'About Us') setActiveTabWithScroll('about');
                            if (link === 'Contact') setActiveTabWithScroll('contact');
                            if (link === 'Donate') handleDonationClick();
                          }}
                          className="transition-colors duration-300 cursor-pointer hover:opacity-80"
                          style={{ color: colors.muted }}
                        >
                          {link}
                        </motion.button>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Resources */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="text-lg font-semibold font-montserrat mb-6">
                    Resources
                  </h4>
                  <ul className="space-y-3">
                    {['Climate Reports', 'Research Papers', 'Data API', 'News & Updates'].map((resource) => (
                      <li key={resource}>
                        <motion.a
                          href="#"
                          whileHover={{ x: 4 }}
                          className="transition-colors duration-300 cursor-pointer hover:opacity-80"
                          style={{ color: colors.muted }}
                        >
                          {resource}
                        </motion.a>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h4 className="text-lg font-semibold font-montserrat mb-6">
                    Get in Touch
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Mail size={16} style={{ color: colors.primary, marginTop: '2px' }} />
                      <div>
                        <p className="text-sm" style={{ color: colors.muted }}>
                          hello@ecovision.org
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Globe size={16} style={{ color: colors.primary, marginTop: '2px' }} />
                      <div>
                        <p className="text-sm" style={{ color: colors.muted }}>
                          San Francisco, CA
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Sparkles size={16} style={{ color: colors.primary, marginTop: '2px' }} />
                      <div>
                        <p className="text-sm" style={{ color: colors.muted }}>
                          Making a difference since 2020
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Bottom Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col md:flex-row items-center justify-between pt-8 mt-8 border-t"
                style={{ borderColor: colors.border }}
              >
                <p className="text-sm mb-4 md:mb-0" style={{ color: colors.muted }}>
                  © 2024 EcoVision. All rights reserved. Built for a sustainable future.
                </p>
                <div className="flex items-center space-x-6">
                  <motion.a
                    href="#"
                    whileHover={{ y: -2 }}
                    className="text-sm transition-colors duration-300 cursor-pointer hover:opacity-80"
                    style={{ color: colors.muted }}
                  >
                    Privacy Policy
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ y: -2 }}
                    className="text-sm transition-colors duration-300 cursor-pointer hover:opacity-80"
                    style={{ color: colors.muted }}
                  >
                    Terms of Service
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ y: -2 }}
                    className="text-sm transition-colors duration-300 cursor-pointer hover:opacity-80"
                    style={{ color: colors.muted }}
                  >
                    Cookies
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </footer>

          <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:max-w-md z-50 space-y-4">
            <AnimatePresence>
              {toasts.map((toast) => (
                <Toast
                  key={toast.id}
                  message={toast.message}
                  type={toast.type}
                  onClose={() =>
                    setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                  }
                />
              ))}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {isModalOpen && (
              <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={modalContent.title}
              >
                {modalContent.content}
              </Modal>
            )}
          </AnimatePresence>
        </div>
      </ToastContext.Provider>
    </ThemeContext.Provider>
  );
}

function Dashboard() {
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const { addToast } = useContext(ToastContext) as ToastContextType;

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold font-montserrat mb-4 bg-gradient-to-r bg-clip-text text-transparent"
            style={{ backgroundImage: colors.gradient }}
          >
            Environmental Impact Overview
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl"
            style={{ color: colors.muted }}
          >
            Real-time data and insights on global environmental changes
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Deforestation",
              icon: TreePine,
              data: deforestationData,
              color: colors.secondary,
              gradient: colors.gradientSecondary,
              description: "Global forest loss has increased by 60% since 2010, with over 8.3 million hectares lost in 2022 alone.",
              chartType: "area",
              dataKey: "area",
              unit: "Million Hectares"
            },
            {
              title: "Glacier Melting",
              icon: Droplets,
              data: glacierMeltingData,
              color: colors.primary,
              gradient: colors.gradient,
              description: "Glaciers have lost over 45% of their volume since 2010, contributing to rising sea levels worldwide.",
              chartType: "line",
              dataKey: "volume",
              unit: "Volume Index"
            },
            {
              title: "Global Temperature",
              icon: Thermometer,
              data: temperatureData,
              color: colors.danger,
              gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              description: "Global average temperatures have risen by 1°C since pre-industrial times, with accelerating warming in recent years.",
              chartType: "bar",
              dataKey: "temperature",
              unit: "°C"
            }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="p-6 rounded-3xl backdrop-blur-xl border relative overflow-hidden group"
              style={{
                background: colors.glass,
                borderColor: colors.border,
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl"
                  style={{ background: item.gradient }}
                />
              </div>
              <div className="relative z-10">
                <div className="flex items-center mb-6 space-x-3">
                  <div
                    className="p-3 rounded-2xl"
                    style={{ background: `${item.color}20` }}
                  >
                    <item.icon size={24} style={{ color: item.color }} />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat">
                    {item.title}
                  </h3>
                  <div className="ml-auto">
                    <TrendingUp size={16} style={{ color: colors.muted }} />
                  </div>
                </div>
                <div className="h-64 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    {item.chartType === "area" ? (
                      <AreaChart data={item.data}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={colors.border}
                          opacity={0.3}
                        />
                        <XAxis 
                          dataKey="year" 
                          stroke={colors.foreground}
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke={colors.foreground}
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            color: colors.foreground,
                            borderRadius: "16px",
                            border: "none",
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey={item.dataKey}
                          stroke={item.color}
                          fill={`url(#gradient-${index})`}
                          strokeWidth={3}
                          name={item.unit}
                        />
                        <defs>
                          <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={item.color} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={item.color} stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    ) : item.chartType === "line" ? (
                      <LineChart data={item.data}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={colors.border}
                          opacity={0.3}
                        />
                        <XAxis 
                          dataKey="year" 
                          stroke={colors.foreground}
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke={colors.foreground}
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            color: colors.foreground,
                            borderRadius: "16px",
                            border: "none",
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey={item.dataKey}
                          stroke={item.color}
                          strokeWidth={3}
                          dot={{ fill: item.color, strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, stroke: item.color, strokeWidth: 2 }}
                          name={item.unit}
                        />
                      </LineChart>
                    ) : (
                      <BarChart data={item.data}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={colors.border}
                          opacity={0.3}
                        />
                        <XAxis 
                          dataKey="year" 
                          stroke={colors.foreground}
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke={colors.foreground}
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            color: colors.foreground,
                            borderRadius: "16px",
                            border: "none",
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Bar
                          dataKey={item.dataKey}
                          fill={item.color}
                          name={item.unit}
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: colors.muted }}>
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Impact Distribution Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-8 rounded-3xl backdrop-blur-xl border relative overflow-hidden"
        style={{
          background: colors.glass,
          borderColor: colors.border,
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl"
            style={{ background: colors.gradient }}
          />
          <div
            className="absolute bottom-0 right-0 w-40 h-40 rounded-full blur-3xl"
            style={{ background: colors.gradientSecondary }}
          />
        </div>
        <div className="relative z-10">
          <h3
            className="mb-8 text-2xl font-bold font-montserrat text-center bg-gradient-to-r bg-clip-text text-transparent"
            style={{ backgroundImage: colors.gradient }}
          >
            Environmental Impact Distribution
          </h3>
          <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
            <div className="w-full lg:w-1/2 h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={impactDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => {
                      const screenWidth =
                        typeof window !== "undefined" ? window.innerWidth : 0;
                      return screenWidth < 768
                        ? `${(percent * 100).toFixed(0)}%`
                        : `${name} ${(percent * 100).toFixed(0)}%`;
                    }}
                  >
                    {impactDistributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      color: colors.foreground,
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full lg:w-1/2">
              <h4 className="mb-6 text-xl font-bold font-montserrat">
                Key Findings
              </h4>
              <div className="space-y-4">
                {impactDistributionData.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 rounded-2xl backdrop-blur-sm"
                    style={{ background: colors.glass }}
                  >
                    <div
                      className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <div>
                      <h5 className="font-semibold mb-1">{item.name} ({item.value}%)</h5>
                      <p className="text-sm" style={{ color: colors.muted }}>
                        {index === 0 && "Primarily in tropical regions, threatening biodiversity and climate stability."}
                        {index === 1 && "Threatens marine ecosystems and coastal communities worldwide."}
                        {index === 2 && "Contributes to respiratory diseases and accelerates climate change."}
                        {index === 3 && "Leads to rising sea levels and habitat loss for polar species."}
                        {index === 4 && "Including soil degradation, biodiversity loss, and other factors."}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Critical Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="p-4 sm:p-6 md:p-8 rounded-3xl backdrop-blur-xl border relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.warning}15 0%, ${colors.warning}05 100%)`,
          borderColor: colors.warning,
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl"
            style={{ backgroundColor: colors.warning }}
          />
        </div>
        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
          <div
            className="p-3 sm:p-4 rounded-2xl flex-shrink-0 self-center sm:self-start"
            style={{ backgroundColor: `${colors.warning}20` }}
          >
            <AlertTriangle size={24} className="sm:w-8 sm:h-8" style={{ color: colors.warning }} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3
              className="text-xl sm:text-2xl font-bold font-montserrat mb-3"
              style={{ color: colors.warning }}
            >
              Critical Alert: Accelerating Environmental Degradation
            </h3>
            <p className="text-base sm:text-lg mb-6 leading-relaxed">
              Recent data indicates that environmental degradation is
              accelerating at an alarming rate. Without immediate action, we
              risk irreversible damage to ecosystems worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  addToast(
                    "Thank you for your interest! The detailed report will be sent to your email.",
                    "success"
                  )
                }
                className="w-full sm:w-auto px-6 py-3 font-semibold rounded-2xl transition-all duration-300 cursor-pointer"
                style={{ 
                  backgroundColor: colors.warning, 
                  color: "white",
                  boxShadow: "0 10px 30px rgba(245, 158, 11, 0.3)",
                }}
              >
                View Detailed Report
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  addToast(
                    "We appreciate your willingness to share! We'll follow up with you.",
                    "success"
                  )
                }
                className="w-full sm:w-auto px-6 py-3 font-semibold rounded-2xl backdrop-blur-sm transition-all duration-300 cursor-pointer"
                style={{
                  background: colors.glass,
                  border: `2px solid ${colors.warning}`,
                  color: colors.warning,
                }}
              >
                Share Findings
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function About(): React.ReactElement {
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const { addToast } = useContext(ToastContext) as ToastContextType;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold font-montserrat mb-4 bg-gradient-to-r bg-clip-text text-transparent"
          style={{ backgroundImage: colors.gradient }}
        >
          About Our Mission
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl"
          style={{ color: colors.muted }}
        >
          Building a sustainable future through innovation and collaboration
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
        className="p-8 rounded-3xl backdrop-blur-xl border relative overflow-hidden"
        style={{
          background: colors.glass,
          borderColor: colors.border,
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl"
            style={{ background: colors.gradientSecondary }}
          />
        </div>
        <div className="flex flex-col gap-8 lg:flex-row relative z-10">
          <div className="lg:w-1/2">
            <h3
              className="mb-6 text-2xl font-bold font-montserrat bg-gradient-to-r bg-clip-text text-transparent"
              style={{ backgroundImage: colors.gradientSecondary }}
            >
              Our Vision
            </h3>
            <p className="mb-6 text-lg leading-relaxed">
              We envision a world where humanity lives in harmony with nature,
              where ecosystems thrive, and where future generations inherit a
              planet that is healthier than the one we inhabit today.
            </p>
            <p className="text-lg leading-relaxed">
              Through data-driven insights, community engagement, and
              sustainable solutions, we aim to reverse the trends of
              environmental degradation and build a more resilient planet.
            </p>
          </div>
          <div className="lg:w-1/2">
            <div className="relative rounded-2xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80"
                alt="Pristine forest landscape"
                className="object-cover w-full h-80 rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-8 rounded-3xl backdrop-blur-xl border relative overflow-hidden"
        style={{
          background: colors.glass,
          borderColor: colors.border,
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute bottom-0 left-0 w-40 h-40 rounded-full blur-3xl"
            style={{ background: colors.gradient }}
          />
        </div>
        <div className="relative z-10">
          <h3
            className="mb-8 text-2xl font-bold font-montserrat text-center bg-gradient-to-r bg-clip-text text-transparent"
            style={{ backgroundImage: colors.gradientSecondary }}
          >
            Key Focus Areas
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Forest Conservation",
                color: colors.primary,
                gradient: colors.gradient,
                description: "Protecting existing forests and promoting reforestation efforts to combat climate change and preserve biodiversity."
              },
              {
                title: "Climate Action",
                color: colors.secondary,
                gradient: colors.gradientSecondary,
                description: "Advocating for policies that reduce greenhouse gas emissions and supporting communities in adapting to climate change impacts."
              },
              {
                title: "Water Protection",
                color: colors.accent,
                gradient: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                description: "Safeguarding freshwater resources, reducing pollution, and ensuring equitable access to clean water for all communities."
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
                className="p-6 rounded-2xl backdrop-blur-sm border relative overflow-hidden group"
                style={{ 
                  background: `linear-gradient(135deg, ${item.color}10 0%, ${item.color}05 100%)`,
                  borderColor: `${item.color}30`
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                  <div
                    className="absolute top-0 right-0 w-20 h-20 rounded-full blur-xl"
                    style={{ background: item.gradient }}
                  />
                </div>
                <div className="relative z-10">
                  <h4
                    className="mb-4 text-xl font-bold font-montserrat"
                    style={{ color: item.color }}
                  >
                    {item.title}
                  </h4>
                  <p className="leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-8 rounded-3xl backdrop-blur-xl border relative overflow-hidden"
        style={{
          background: colors.glass,
          borderColor: colors.border,
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute top-0 left-0 w-32 h-32 rounded-full blur-2xl"
            style={{ background: colors.gradient }}
          />
          <div
            className="absolute bottom-0 right-0 w-32 h-32 rounded-full blur-2xl"
            style={{ background: colors.gradientSecondary }}
          />
        </div>
        <div className="relative z-10">
          <h3
            className="mb-8 text-2xl font-bold font-montserrat text-center bg-gradient-to-r bg-clip-text text-transparent"
            style={{ backgroundImage: colors.gradientSecondary }}
          >
            Our Impact
          </h3>
          <div className="space-y-8">
            {[
              {
                icon: TreePine,
                title: "5 Million Trees Planted",
                description: "Our reforestation initiatives have helped restore degraded landscapes and create carbon sinks across three continents.",
                color: colors.primary,
                gradient: colors.gradient
              },
              {
                icon: Droplets,
                title: "Clean Water for 2 Million People",
                description: "Our water conservation projects have improved access to clean water in vulnerable communities worldwide.",
                color: colors.secondary,
                gradient: colors.gradientSecondary
              },
              {
                icon: Thermometer,
                title: "500,000 Tons of CO₂ Offset",
                description: "Through renewable energy projects and carbon capture initiatives, we've helped mitigate climate change impacts.",
                color: colors.accent,
                gradient: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 10, transition: { duration: 0.2 } }}
                className="flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-2xl backdrop-blur-sm"
                style={{ background: colors.glass }}
              >
                <div
                  className="flex items-center justify-center w-20 h-20 rounded-2xl md:shrink-0"
                  style={{ background: `${item.color}20` }}
                >
                  <item.icon size={32} style={{ color: item.color }} />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold font-montserrat mb-2">
                    {item.title}
                  </h4>
                  <p className="leading-relaxed" style={{ color: colors.muted }}>
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-8 rounded-3xl backdrop-blur-xl border relative overflow-hidden"
        style={{
          background: colors.glass,
          borderColor: colors.border,
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl"
            style={{ background: colors.gradient }}
          />
        </div>
        <div className="flex flex-col gap-8 lg:flex-row relative z-10">
          <div className="lg:w-1/2">
            <div className="relative rounded-2xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
                alt="Team working on environmental projects"
                className="object-cover w-full h-80 rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
            </div>
          </div>
          <div className="lg:w-1/2">
            <h3
              className="mb-6 text-2xl font-bold font-montserrat bg-gradient-to-r bg-clip-text text-transparent"
              style={{ backgroundImage: colors.gradientSecondary }}
            >
              Join Our Community
            </h3>
            <p className="mb-6 text-lg leading-relaxed">
              We believe that meaningful change happens when people come
              together with a shared purpose. Our global community of
              environmental advocates, scientists, policymakers, and concerned
              citizens is working to create a more sustainable future.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                addToast(
                  "Thank you for your interest! We'll be in touch soon.",
                  "success"
                )
              }
              className="px-8 py-4 font-semibold rounded-2xl shadow-lg transition-all duration-300 cursor-pointer"
              style={{ 
                background: colors.gradient, 
                color: "white",
                boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)",
              }}
            >
              <span className="flex items-center space-x-2">
                <span>Get Involved</span>
                <ArrowRight size={18} />
              </span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Contact({
  onSubmit,
}: {
  onSubmit: (data: ContactFormData) => void;
}): React.ReactElement {
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const { addToast } = useContext(ToastContext) as ToastContextType;
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
      setFormData({ name: "", email: "", message: "" });
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newsletterEmail.trim()) {
      addToast("Please enter your email address", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      addToast("Please enter a valid email address", "error");
      return;
    }

    setIsSubscribing(true);

    setTimeout(() => {
      setIsSubscribing(false);
      setNewsletterEmail("");
      addToast("Thank you for subscribing to our newsletter!", "success");
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h2
        className="mb-6 text-2xl font-bold font-montserrat"
        style={{ color: colors.primary }}
      >
        Contact Us
      </h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <motion.div
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          className="p-6 rounded-lg shadow-md"
          style={{
            backgroundColor: colors.card,
            border: `1px solid ${colors.border}`,
          }}
        >
          <h3
            className="mb-4 text-xl font-semibold font-montserrat"
            style={{ color: colors.secondary }}
          >
            Get in Touch
          </h3>
          <p className="mb-6">
            Have questions about our environmental initiatives or want to get
            involved? We&apos;d love to hear from you. Fill out the form and our
            team will respond as soon as possible.
            Have questions about our environmental initiatives or want to get
            involved? We&apos;d love to hear from you. Fill out the form and our
            team will respond as soon as possible.
            Have questions about our environmental initiatives or want to get
            involved? We&apos;d love to hear from you. Fill out the form and our
            team will respond as soon as possible.
            Have questions about our environmental initiatives or want to get
            involved? We&apos;d love to hear from you. Fill out the form and our
            team will respond as soon as possible.
            Have questions about our environmental initiatives or want to get
            involved? We&apos;d love to hear from you. Fill out the form and our
            team will respond as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg cursor-pointer"
                style={{
                  backgroundColor: `${colors.background}`,
                  border: `1px solid ${
                    errors.name ? colors.danger : colors.border
                  }`,
                  color: colors.foreground,
                }}
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm" style={{ color: colors.danger }}>
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg cursor-pointer"
                style={{
                  backgroundColor: `${colors.background}`,
                  border: `1px solid ${
                    errors.email ? colors.danger : colors.border
                  }`,
                  color: colors.foreground,
                }}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm" style={{ color: colors.danger }}>
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block mb-2 font-medium">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 rounded-lg cursor-pointer"
                style={{
                  backgroundColor: `${colors.background}`,
                  border: `1px solid ${
                    errors.message ? colors.danger : colors.border
                  }`,
                  color: colors.foreground,
                }}
                placeholder="Your message..."
              />
              {errors.message && (
                <p className="mt-1 text-sm" style={{ color: colors.danger }}>
                  {errors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="px-6 py-3 font-semibold rounded-lg cursor-pointer"
              style={{ backgroundColor: colors.primary, color: "#ffffff" }}
            >
              Send Message
            </button>
          </form>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="p-6 rounded-lg shadow-md"
            style={{
              backgroundColor: colors.card,
              border: `1px solid ${colors.border}`,
            }}
          >
            <h3
              className="mb-4 text-xl font-semibold font-montserrat"
              style={{ color: colors.secondary }}
            >
              Our Locations
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Headquarters</h4>
                <p style={{ color: colors.muted }}>
                  123 Environmental Way
                  <br />
                  San Francisco, CA 94107
                  <br />
                  United States
                </p>
              </div>
              <div>
                <h4 className="font-semibold">European Office</h4>
                <p style={{ color: colors.muted }}>
                  45 Green Street
                  <br />
                  London, EC1V 9HX
                  <br />
                  United Kingdom
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Asia Pacific Office</h4>
                <p style={{ color: colors.muted }}>
                  78 Nature Boulevard
                  <br />
                  Singapore, 018956
                  <br />
                  Singapore
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="p-6 rounded-lg shadow-md"
            style={{
              backgroundColor: colors.card,
              border: `1px solid ${colors.border}`,
            }}
          >
            <h3
              className="mb-4 text-xl font-semibold font-montserrat"
              style={{ color: colors.secondary }}
            >
              Connect With Us
            </h3>
            <p className="mb-4">
              Follow our work and join the conversation on social media.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg cursor-pointer transition-all duration-300 backdrop-blur-sm"
                style={{ 
                  background: `${colors.primary}20`,
                  color: colors.primary,
                  border: `1px solid ${colors.primary}30`,
                  backdropFilter: "blur(10px)",
                }}
              >
                F
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg cursor-pointer transition-all duration-300 backdrop-blur-sm"
                style={{ 
                  background: `${colors.secondary}20`,
                  color: colors.secondary,
                  border: `1px solid ${colors.secondary}30`,
                  backdropFilter: "blur(10px)",
                }}
              >
                T
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg cursor-pointer transition-all duration-300 backdrop-blur-sm"
                style={{ 
                  background: `${colors.accent}20`,
                  color: colors.accent,
                  border: `1px solid ${colors.accent}30`,
                  backdropFilter: "blur(10px)",
                }}
              >
                I
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg cursor-pointer transition-all duration-300 backdrop-blur-sm"
                style={{ 
                  background: `${colors.muted}20`,
                  color: colors.muted,
                  border: `1px solid ${colors.muted}30`,
                  backdropFilter: "blur(10px)",
                }}
              >
                L
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="p-6 rounded-lg shadow-md"
            style={{
              backgroundColor: `${colors.secondary}10`,
              border: `1px solid ${colors.secondary}`,
            }}
          >
            <h3
              className="mb-4 text-xl font-semibold font-montserrat"
              style={{ color: colors.secondary }}
            >
              Newsletter
            </h3>
            <p className="mb-4">
              Subscribe to our newsletter to receive updates on our
              environmental initiatives and impact.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-2 rounded-l-lg cursor-pointer"
                style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                  borderRight: "none",
                  color: colors.foreground,
                }}
              />
              <button
                onClick={handleNewsletterSubmit}
                disabled={isSubscribing}
                className="px-4 py-2 font-medium rounded-r-lg cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: colors.secondary, color: "#ffffff" }}
              >
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

interface DonationFormProps {
  onSubmit: (data: DonationFormData) => void;
  showToast: (message: string, type: "success" | "error" | "warning") => void;
  onClose: () => void;
}

function DonationForm({
  onSubmit,
  showToast,
  onClose
}: DonationFormProps): React.ReactElement {
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const [formData, setFormData] = useState<DonationFormData>({
    name: "",
    email: "",
    amount: 10,
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof DonationFormData, string>>
  >({});
  const [customAmount, setCustomAmount] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let validatedValue = value;

    switch (name) {
      case "cardNumber":
        validatedValue = value
          .replace(/\D/g, "")
          .replace(/(\d{4})/g, "$1 ")
          .trim();
        break;
      case "cvv":
        validatedValue = value.replace(/\D/g, "").slice(0, 4);
        break;
      case "expiryDate":
        const numericValue = value.replace(/\D/g, "");
        if (numericValue.length <= 2) {
          validatedValue = numericValue;
        } else {
          validatedValue = `${numericValue.slice(0, 2)}/${numericValue.slice(
            2,
            4
          )}`;
        }
        break;
      default:
        break;
    }

    setFormData((prev) => ({ ...prev, [name]: validatedValue }));

    if (errors[name as keyof DonationFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAmountSelect = (amount: number) => {
    setFormData((prev) => ({ ...prev, amount }));
    setCustomAmount(amount === 0);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof DonationFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (
      customAmount &&
      (!formData.customAmount || formData.customAmount <= 0)
    ) {
      newErrors.customAmount = "Please enter a valid amount";
    }

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required";
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
    }

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Please use MM/YY format";
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "Please enter a valid CVV";
    }

    if (formData.expiryDate) {
      const [month, year] = formData.expiryDate.split("/");
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const today = new Date();

      if (expiry < today) {
        newErrors.expiryDate = "Card has expired";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const [month, year] = formData.expiryDate.split("/");
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const today = new Date();

      if (expiry < today) {
        showToast("Card has expired. Please use a valid card.", "error");
        return;
      }

      onSubmit(formData);
    }
  };

  const handleClose = () => onClose();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold font-montserrat">
          Choose an Amount
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {donationOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleAmountSelect(option.amount)}
              className="px-4 py-2 text-center rounded-lg cursor-pointer"
              style={{
                backgroundColor:
                  formData.amount === option.amount
                    ? colors.primary
                    : `${colors.muted}20`,
                color:
                  formData.amount === option.amount
                    ? "#ffffff"
                    : colors.foreground,
                border: `1px solid ${
                  formData.amount === option.amount
                    ? colors.primary
                    : colors.border
                }`,
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        {customAmount && (
          <div className="mt-4">
            <label htmlFor="customAmount" className="block mb-2 font-medium">
              Custom Amount ($)
            </label>
            <input
              type="number"
              id="customAmount"
              name="customAmount"
              value={formData.customAmount || ""}
              onChange={handleChange}
              min="1"
              step="1"
              className="w-full px-4 py-2 rounded-lg cursor-pointer"
              style={{
                backgroundColor: colors.background,
                border: `1px solid ${
                  errors.customAmount ? colors.danger : colors.border
                }`,
                color: colors.foreground,
              }}
              placeholder="Enter amount"
            />
            {errors.customAmount && (
              <p className="mt-1 text-sm" style={{ color: colors.danger }}>
                {errors.customAmount}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="block mb-2 font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg cursor-pointer"
            style={{
              backgroundColor: colors.background,
              border: `1px solid ${
                errors.name ? colors.danger : colors.border
              }`,
              color: colors.foreground,
            }}
            placeholder="Your name"
          />
          {errors.name && (
            <p className="mt-1 text-sm" style={{ color: colors.danger }}>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block mb-2 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg cursor-pointer"
            style={{
              backgroundColor: colors.background,
              border: `1px solid ${
                errors.email ? colors.danger : colors.border
              }`,
              color: colors.foreground,
            }}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm" style={{ color: colors.danger }}>
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold font-montserrat">
          Payment Information
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block mb-2 font-medium">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg cursor-pointer"
              style={{
                backgroundColor: colors.background,
                border: `1px solid ${
                  errors.cardNumber ? colors.danger : colors.border
                }`,
                color: colors.foreground,
              }}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
            {errors.cardNumber && (
              <p className="mt-1 text-sm" style={{ color: colors.danger }}>
                {errors.cardNumber}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block mb-2 font-medium">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg cursor-pointer"
                style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${
                    errors.expiryDate ? colors.danger : colors.border
                  }`,
                  color: colors.foreground,
                }}
                placeholder="MM/YY"
                maxLength={5}
              />
              {errors.expiryDate && (
                <p className="mt-1 text-sm" style={{ color: colors.danger }}>
                  {errors.expiryDate}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="cvv" className="block mb-2 font-medium">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg cursor-pointer"
                style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${
                    errors.cvv ? colors.danger : colors.border
                  }`,
                  color: colors.foreground,
                }}
                placeholder="123"
                maxLength={4}
              />
              {errors.cvv && (
                <p className="mt-1 text-sm" style={{ color: colors.danger }}>
                  {errors.cvv}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => handleClose()}
          className="px-4 py-2 font-medium rounded-lg cursor-pointer"
          style={{
            backgroundColor: "transparent",
            border: `1px solid ${colors.border}`,
            color: colors.foreground,
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 font-medium rounded-lg cursor-pointer"
          style={{ backgroundColor: colors.success, color: "#ffffff" }}
        >
          Complete Donation
        </button>
      </div>
    </form>
  );
}

function Toast({ message, type, onClose }: ToastProps): React.ReactElement {
  const { colors } = useContext(ThemeContext) as ThemeContextType;

  const toastColors = {
    success: {
      bg: colors.success,
      gradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
      icon: <Check size={20} color="#ffffff" />,
    },
    error: {
      bg: colors.danger,
      gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      icon: <X size={20} color="#ffffff" />,
    },
    warning: {
      bg: colors.warning,
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      icon: <AlertTriangle size={20} color="#ffffff" />,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.02 }}
      className="flex items-center w-full p-4 md:p-6 space-x-3 md:space-x-4 rounded-2xl backdrop-blur-xl border shadow-2xl relative overflow-hidden"
      style={{ 
        background: colors.glass,
        borderColor: toastColors[type].bg,
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-0 right-0 w-20 h-20 rounded-full blur-xl"
          style={{ background: toastColors[type].gradient }}
        />
      </div>
      <div 
        className="flex-shrink-0 p-2 rounded-xl relative z-10"
        style={{ background: toastColors[type].gradient }}
      >
        {toastColors[type].icon}
      </div>
      <div className="flex-1 text-sm md:text-base font-medium relative z-10" style={{ color: colors.foreground }}>
        {message}
      </div>
      <motion.button 
        onClick={onClose} 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex-shrink-0 p-2 rounded-xl backdrop-blur-sm relative z-10 cursor-pointer"
        style={{ background: colors.glass }}
      >
        <X size={18} style={{ color: colors.foreground }} />
      </motion.button>
    </motion.div>
  );
}

function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps): React.ReactElement {
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30"
          style={{ 
            backdropFilter: "blur(20px)",
          }}
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-auto rounded-3xl backdrop-blur-xl border shadow-2xl relative"
            style={{ 
              background: colors.glass,
              borderColor: colors.border,
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl"
                style={{ background: colors.gradient }}
              />
              <div
                className="absolute bottom-0 left-0 w-40 h-40 rounded-full blur-3xl"
                style={{ background: colors.gradientSecondary }}
              />
            </div>
            <div
              className="flex items-center justify-between p-8 border-b relative z-10"
              style={{ borderColor: colors.border }}
            >
              <h3
                className="text-2xl font-bold font-montserrat bg-gradient-to-r bg-clip-text text-transparent"
                style={{ backgroundImage: colors.gradient }}
              >
                {title}
              </h3>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-2xl backdrop-blur-sm transition-all duration-300 cursor-pointer"
                style={{ background: colors.glass }}
              >
                <X size={24} style={{ color: colors.foreground }} />
              </motion.button>
            </div>
            <div className="p-8 relative z-10">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}