"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar, FiMapPin, FiClock, FiUser, FiMoon, FiSun,
  FiMenu, FiX, FiMail, FiPhone, FiCheck, FiAlertCircle,
  FiGlobe, FiSend, FiAward, FiCoffee, FiMessageCircle,
  FiUsers, FiBookmark, FiStar, FiHeart, FiBriefcase,
  FiTwitter, FiLinkedin, FiChevronRight, FiArrowRight, FiLayers, FiLock
} from "react-icons/fi";

// Color palette
const colors = {
  dark: {
    bg: "#0E1428",
    card: "#19203A",
    cardLight: "#222C48",
    accent: "#FF6B6B", // Coral red
    accentAlt: "#4ECDC4", // Teal
    accentLight: "rgba(255, 107, 107, 0.2)",
    text: "#FFFFFF",
    textSecondary: "#CCD6F6",
    textTertiary: "#8892B0",
    border: "rgba(255, 255, 255, 0.1)"
  },
  light: {
    bg: "#F5F9FF",
    card: "#FFFFFF",
    cardLight: "#F0F4FA",
    accent: "#FF6B6B", // Coral red
    accentAlt: "#4ECDC4", // Teal
    accentLight: "rgba(255, 107, 107, 0.1)",
    text: "#1E293B",
    textSecondary: "#334155",
    textTertiary: "#64748B",
    border: "rgba(0, 0, 0, 0.1)"
  }
};

export default function Home() {
  const [theme, setTheme] = useState("dark");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Form validation state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    ticketType: ""
  });
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    ticketType: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formTouched, setFormTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    ticketType: false
  });

  // Event details
  const eventDate = new Date("2025-12-15T09:00:00");
  const eventName = "TechConf 2025";
  const eventTagline = "Where Innovation Meets Opportunity";
  const eventLocation = "Tech Center, San Francisco";
  const eventDescription = "Join us for the most innovative tech conference of the year, featuring industry leaders, workshops, and networking opportunities!";

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Set theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme("dark");
    }
  }, []);

  // Apply theme class to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Schedule data
  const scheduleData = [
    { time: "09:00 AM - 09:30 AM", title: "Registration & Breakfast", speaker: "" },
    { time: "09:30 AM - 09:45 AM", title: "Kickoff and Intros", speaker: "Sarah Johnson" },
    { time: "09:45 AM - 10:15 AM", title: "Intro to Modern Web Development", speaker: "Michael Chen" },
    { time: "10:15 AM - 11:15 AM", title: "AI-driven Architecture", speaker: "Elena Rodriguez" },
    { time: "11:15 AM - 12:15 PM", title: "Cloud Architecture Presentation", speaker: "David Kim" },
    { time: "12:15 PM - 01:15 PM", title: "Lunch Break", speaker: "" },
    { time: "01:15 PM - 01:30 PM", title: "Partner Introduction", speaker: "TechConf Team" },
    { time: "01:30 PM - 03:30 PM", title: "Hands-on Workshop", speaker: "Dev Team" },
    { time: "03:30 PM - 04:00 PM", title: "Coffee Break", speaker: "" },
    { time: "04:00 PM - 05:00 PM", title: "Panel Discussion", speaker: "Industry Leaders" },
    { time: "05:00 PM - 07:00 PM", title: "Networking Reception", speaker: "" },
  ];

  // Speakers data
  const speakersData = [
    {
      name: "Sarah Thompson",
      role: "Vice President, AWS Generative Builders",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      bio: "Sarah is the CTO of TechWave, a leading innovator in cloud architecture. With over 15 years of experience in the tech industry, she excels in developing impactful solutions that drive growth and sustainability.",
    },
    {
      name: "Michael Rodriguez",
      role: "Chief Operations Officer, Apex Automations",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      bio: "Michael leads the product development team at Apex Automations, a company renowned for its cutting-edge robotic systems. His expertise in AI and robotics has been pivotal in launching groundbreaking products.",
    },
    {
      name: "Sarah Lee",
      role: "Head of Human Resources, Future Corp",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      bio: "Sarah oversees HR at Future Corp, a sustainability-focused company. With a decade of experience in talent management and organizational development, she is passionate about fostering inclusive workplaces.",
    },
  ];

  // Form handling functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Mark field as touched
    setFormTouched({
      ...formTouched,
      [name]: true
    });

    // Clear errors when typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { ...formErrors };
    const touched = { ...formTouched };

    // Mark all fields as touched on submission
    Object.keys(touched).forEach(key => {
      touched[key as keyof typeof touched] = true;
    });
    setFormTouched(touched);

    // Validate firstName
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
      isValid = false;
    }

    // Validate lastName
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email";
      isValid = false;
    }

    // Validate ticketType
    if (!formData.ticketType) {
      errors.ticketType = "Please select a ticket type";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);

        // Reset form after success
        setTimeout(() => {
          setSubmitSuccess(false);
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            company: "",
            ticketType: ""
          });
          setFormTouched({
            firstName: false,
            lastName: false,
            email: false,
            ticketType: false
          });
        }, 5000);
      }, 1500);
    }
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-[#0E1428] text-white" : "bg-[#F5F9FF] text-[#1E293B]"} font-sans`}>
      {/* Navigation Bar - inspired by the image */}
      <nav className={`fixed w-full z-50 ${theme === "dark" ? "bg-[#19203A]/90" : "bg-white/90"} backdrop-blur-sm`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-md flex items-center justify-center bg-[#FF6B6B] text-white font-bold`}>
                TC
              </div>
              <span className="text-xl font-bold tracking-tight font-montserrat">TechConf</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-sm hover:text-[#FF6B6B] transition-colors">About</a>
              <a href="#agenda" className="text-sm hover:text-[#FF6B6B] transition-colors">Agenda</a>
              <a href="#speakers" className="text-sm hover:text-[#FF6B6B] transition-colors">Speakers</a>
              <a href="#location" className="text-sm hover:text-[#FF6B6B] transition-colors">Location</a>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`p-2 rounded-full ml-2 ${theme === "dark" ? "bg-[#222C48]" : "bg-gray-100"}`}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
              </button>
              <a
                href="#register"
                className="px-4 py-2 rounded-md bg-[#FF6B6B] hover:bg-[#FF5252] text-white text-sm font-medium transition-colors"
              >
                Register now
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`p-2 rounded-full ${theme === "dark" ? "bg-[#222C48]" : "bg-gray-100"}`}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`md:hidden ${theme === "dark" ? "bg-[#19203A]" : "bg-white"} py-4 border-t ${theme === "dark" ? "border-[#222C48]" : "border-gray-200"}`}
          >
            <div className="container mx-auto px-6 flex flex-col space-y-4">
              <a href="#about" className="py-2 hover:text-[#FF6B6B] transition-colors" onClick={() => setIsMenuOpen(false)}>About</a>
              <a href="#agenda" className="py-2 hover:text-[#FF6B6B] transition-colors" onClick={() => setIsMenuOpen(false)}>Agenda</a>
              <a href="#speakers" className="py-2 hover:text-[#FF6B6B] transition-colors" onClick={() => setIsMenuOpen(false)}>Speakers</a>
              <a href="#location" className="py-2 hover:text-[#FF6B6B] transition-colors" onClick={() => setIsMenuOpen(false)}>Location</a>
              <a
                href="#register"
                className="px-4 py-2 rounded-md bg-[#FF6B6B] hover:bg-[#FF5252] text-white text-sm font-medium transition-colors w-fit"
                onClick={() => setIsMenuOpen(false)}
              >
                Register now
              </a>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section - Update for light theme */}
      <section className="relative min-h-screen pt-28 pb-16 px-6 flex items-center">
        {/* Background Image with Overlay */}
        <div className={`absolute inset-0 ${theme === "dark"
          ? "bg-gradient-to-b from-[#0E1428]/80 via-[#0E1428]/90 to-[#0E1428]"
          : "bg-gradient-to-b from-[#F5F9FF]/20 via-[#F5F9FF]/50 to-[#F5F9FF]"} z-0`}>
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Tech conference background"
            className={`w-full h-full object-cover opacity-30 mix-blend-overlay`}
          />
          {theme === "light" && <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F5F9FF]/30 to-[#F5F9FF]/60 z-10"></div>}
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-4xl md:text-6xl font-bold mb-4 tracking-tight ${theme === "dark" ? "text-white" : "text-[#1E293B]"}`}
            >
              {eventName}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`text-xl md:text-2xl mb-8 ${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"}`}
            >
              {eventTagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-6 mb-10"
            >
              <div className={`flex items-center gap-2 ${theme === "dark" ? "text-[#CCD6F6] bg-[#19203A]/80" : "text-[#334155] bg-white/80"} px-4 py-2 rounded-full border ${theme === "dark" ? "border-white/10" : "border-black/5"}`}>
                <FiCalendar className="h-5 w-5 text-[#FF6B6B]" />
                <span>{eventDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              </div>
              <div className={`flex items-center gap-2 ${theme === "dark" ? "text-[#CCD6F6] bg-[#19203A]/80" : "text-[#334155] bg-white/80"} px-4 py-2 rounded-full border ${theme === "dark" ? "border-white/10" : "border-black/5"}`}>
                <FiMapPin className="h-5 w-5 text-[#FF6B6B]" />
                <span>{eventLocation}</span>
              </div>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mb-10"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-xs md:max-w-lg mx-auto">
                <div className={`${theme === "dark" ? "bg-[#19203A]/90" : "bg-white/90"} p-3 md:p-4 rounded-xl border ${theme === "dark" ? "border-[#FF6B6B]/20" : "border-[#FF6B6B]/10"} backdrop-blur-sm shadow-lg min-w-0`}> 
                  <div className={`text-2xl md:text-5xl font-bold truncate ${theme === "dark" ? "text-white" : "text-[#1E293B]"}`}>{timeLeft.days}</div>
                  <div className={`text-xs md:text-xs ${theme === "dark" ? "text-[#8892B0]" : "text-[#64748B]"} uppercase tracking-wider mt-1 truncate`}>Days</div>
                </div>
                <div className={`${theme === "dark" ? "bg-[#19203A]/90" : "bg-white/90"} p-3 md:p-4 rounded-xl border ${theme === "dark" ? "border-[#FF6B6B]/20" : "border-[#FF6B6B]/10"} backdrop-blur-sm shadow-lg min-w-0`}>
                  <div className={`text-2xl md:text-5xl font-bold truncate ${theme === "dark" ? "text-white" : "text-[#1E293B]"}`}>{timeLeft.hours}</div>
                  <div className={`text-xs md:text-xs ${theme === "dark" ? "text-[#8892B0]" : "text-[#64748B]"} uppercase tracking-wider mt-1 truncate`}>Hours</div>
                </div>
                <div className={`${theme === "dark" ? "bg-[#19203A]/90" : "bg-white/90"} p-3 md:p-4 rounded-xl border ${theme === "dark" ? "border-[#FF6B6B]/20" : "border-[#FF6B6B]/10"} backdrop-blur-sm shadow-lg min-w-0`}>
                  <div className={`text-2xl md:text-5xl font-bold truncate ${theme === "dark" ? "text-white" : "text-[#1E293B]"}`}>{timeLeft.minutes}</div>
                  <div className={`text-xs md:text-xs ${theme === "dark" ? "text-[#8892B0]" : "text-[#64748B]"} uppercase tracking-wider mt-1 truncate`}>Minutes</div>
                </div>
                <div className={`${theme === "dark" ? "bg-[#19203A]/90" : "bg-white/90"} p-3 md:p-4 rounded-xl border ${theme === "dark" ? "border-[#FF6B6B]/20" : "border-[#FF6B6B]/10"} backdrop-blur-sm shadow-lg min-w-0`}>
                  <div className={`text-2xl md:text-5xl font-bold truncate ${theme === "dark" ? "text-white" : "text-[#1E293B]"}`}>{timeLeft.seconds}</div>
                  <div className={`text-xs md:text-xs ${theme === "dark" ? "text-[#8892B0]" : "text-[#64748B]"} uppercase tracking-wider mt-1 truncate`}>Seconds</div>
                </div>
              </div>
              <div className={`text-sm ${theme === "dark" ? "text-[#4ECDC4]" : "text-[#1E293B] font-medium"} mt-4`}>Until the event begins</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <a
                href="#register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-md bg-[#FF6B6B] hover:bg-[#FF5252] text-white font-medium transition-colors shadow-lg"
              >
                Register Now
                <FiArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`py-10 md:py-16 px-4 md:px-6 ${theme === "dark" ? "bg-[#0E1428]" : "bg-[#F5F9FF]"}`}>
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <div className={`text-[#FF6B6B] uppercase text-sm font-semibold tracking-wider mb-3`}>OVERVIEW</div>
            <h2 className={`text-3xl md:text-4xl font-bold ${theme === "dark" ? "text-white" : "text-[#1E293B]"}`}>About The Event</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left Column - Overview and Text */}
            <div>
              <div className={`backdrop-blur-md ${theme === "dark" ? "bg-[#19203A]/30 border-white/10" : "bg-white/30 border-white/30"} p-8 rounded-2xl border shadow-xl h-full`}>
                <p className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"} mb-6`}>
                  This will be an interactive event with a mix of lecture and instructor-led workshops
                  from AWS experts. Did you know that a Serverless event-driven approach can help
                  build resilient GenAI applications? In this full day training event, you'll learn how to
                  build serverless, event-driven applications leveraging cloud-native services such as
                  Amazon EventBridge, AWS Step Functions, and AWS Lambda.
                </p>

                <p className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"} mb-6`}>
                  Through leveraging serverless or container platforms, these applications can almost
                  instantly benefit from the scalability, reliability, and cost effectiveness of the cloud.
                  Early cloud adoption approaches were primarily focused on migrations or greenfield
                  applications.
                </p>

                <div className={`flex items-center gap-3 ${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"} mt-8 border-l-4 border-[#FF6B6B] pl-4 py-2`}>
                  <span className="text-[#4ECDC4] text-xl">💻</span>
                  <p className="font-medium">Please bring your own laptop</p>
                </div>
              </div>
            </div>

            {/* Right Column - Info Boxes */}
            <div className="flex flex-col h-full space-y-8" style={{height: '100%'}}>
              <div className={`flex-1 flex flex-col justify-start backdrop-blur-md ${theme === "dark" ? "bg-[#19203A]/30 border-white/10" : "bg-white/30 border-white/30"} p-8 rounded-2xl border shadow-xl`}>
                <h3 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-[#1E293B]"}`}>WHY ATTEND?</h3>
                <p className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"}`}>
                  Learn how to build cost-efficient and agile applications using event-driven architecture.
                </p>
              </div>
              <div className={`flex-1 flex flex-col justify-start backdrop-blur-md ${theme === "dark" ? "bg-[#19203A]/30 border-white/10" : "bg-white/30 border-white/30"} p-8 rounded-2xl border shadow-xl`}>
                <h3 className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-[#1E293B]"}`}>WHO SHOULD ATTEND?</h3>
                <p className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"}`}>
                  Technical decision makers: CTOs, engineering leads, solutions architects, developers. Architects and developers that are ready to get hands-on with these services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agenda Section */}
      <section id="agenda" className={`py-10 md:py-16 px-4 md:px-6 ${theme === "dark" ? "bg-[#0E1428]" : "bg-[#F5F9FF]"}`}>
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12 text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl backdrop-blur-md ${theme === "dark" ? "bg-[#19203A]/30 border-white/10" : "bg-white/30 border-white/30"} border shadow-xl mb-4`}>
                <FiCalendar className="h-5 w-5 text-[#FF6B6B]" />
              </div>
              <h2 className={`text-3xl md:text-4xl font-bold ${theme === "dark" ? "text-white" : "text-[#1E293B]"}`}>Event Agenda</h2>
              <p className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"} mt-3 max-w-lg mx-auto`}>
                Explore our carefully curated schedule of talks and workshops
              </p>
            </div>

            <div className={`backdrop-blur-md ${theme === "dark" ? "bg-[#19203A]/30 border-white/10" : "bg-white/30 border-white/30"} p-8 rounded-2xl border mb-8 shadow-xl`}>
              <div className="flex flex-wrap justify-between items-baseline mb-6">
                <div className="flex items-center gap-3">
                  <div className={`${theme === "dark" ? "bg-[#222C48]/30 border-white/10" : "bg-white/30 border-white/30"} backdrop-blur-sm p-2 rounded-lg border shadow`}>
                    <FiCalendar className="h-5 w-5 text-[#FF6B6B]" />
                  </div>
                  <span className={`text-xl font-semibold ${theme === "dark" ? "text-[#CCD6F6]" : "text-[#1E293B]"}`}>
                    Monday, December 15, 2025
                  </span>
                </div>
                <div className={`mt-3 md:mt-0 px-3 py-1 rounded-full text-xs font-medium ${theme === "dark" ? "bg-[#222C48]/30 text-[#CCD6F6] border-white/10" : "bg-white/30 text-[#334155] border-white/30"} backdrop-blur-sm border shadow`}>
                  All times in PST
                </div>
              </div>

              <div className="space-y-4">
                {scheduleData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="relative"
                  >
                    <div className={`p-5 rounded-xl transition-all duration-300 backdrop-blur-md ${item.speaker
                      ? theme === "dark"
                        ? "bg-[#222C48]/30 border-white/10"
                        : "bg-white/30 border-white/30"
                      : theme === "dark"
                        ? "bg-[#19203A]/30 border-white/10"
                        : "bg-white/30 border-white/30"
                      } border shadow`}>
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Time Column */}
                        <div className="col-span-12 sm:col-span-3 lg:col-span-2">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#FF6B6B] mt-2 hidden sm:block"></div>
                            <span className="font-mono text-sm text-[#4ECDC4]">{item.time}</span>
                          </div>
                        </div>

                        {/* Content Column */}
                        <div className="col-span-12 sm:col-span-9 lg:col-span-10">
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                              <h3 className={`font-semibold text-lg ${theme === "dark" ? "text-white" : "text-[#1E293B]"}`}>{item.title}</h3>
                              {item.speaker && (
                                <div className="flex items-center gap-2 mt-1">
                                  <FiUser className="h-4 w-4 text-[#FF6B6B]" />
                                  <p className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"} text-sm`}>{item.speaker}</p>
                                </div>
                              )}
                            </div>

                            {item.speaker && (
                              <a 
                                href="#"
                                className="mt-3 md:mt-0 text-[#FF6B6B] text-sm flex items-center gap-1 group hover:text-[#FF5252] transition-colors"
                              >
                                Session Details
                                <FiChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                              </a>
                            )}
                          </div>

                          {/* For lunch and breaks, add a special indicator */}
                          {(item.title.includes("Break") || item.title.includes("Lunch")) && (
                            <div className="mt-2 flex items-center gap-2">
                              {item.title.includes("Lunch") ? (
                                <FiCoffee className="text-[#4ECDC4] h-4 w-4" />
                              ) : (
                                <FiCoffee className="text-[#FF6B6B] h-4 w-4" />
                              )}
                              <span className={`text-sm ${theme === "dark" ? "text-[#8892B0]" : "text-[#64748B]"}`}>
                                {item.title.includes("Lunch") ? "Food provided for all attendees" : "Refreshments available"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <p className={`${theme === "dark" ? "text-[#8892B0]" : "text-[#64748B]"} text-sm`}>
                The schedule is subject to minor changes. All registered attendees will be notified of any updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers Section */}
      <section id="speakers" className={`py-10 md:py-16 px-4 md:px-6 ${theme === "dark" ? "bg-[#0E1428]" : "bg-[#F5F9FF]"}`}>
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl backdrop-blur-md ${theme === "dark" ? "bg-[#19203A]/30 border-white/10" : "bg-white/30 border-white/30"} border shadow-xl mb-4`}>
              <FiUsers className="h-5 w-5 text-[#FF6B6B]" />
            </div>
            <div className="text-[#FF6B6B] uppercase text-sm font-semibold tracking-wider mb-3">Speakers</div>
            <h2 className={`text-3xl md:text-4xl font-bold ${theme === "dark" ? "text-white" : "text-[#1E293B]"}`}>The Voices Of The Event</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {speakersData.map((speaker, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`backdrop-blur-md ${theme === "dark" ? "bg-[#19203A]/30 border-white/10" : "bg-white/30 border-white/30"} rounded-2xl overflow-hidden border shadow-xl`}
              >
                <div className="aspect-[3/2] relative overflow-hidden">
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="object-cover w-full h-full object-center"
                    style={{
                      objectPosition: "center 30%"
                    }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${theme === "dark" ? "from-[#19203A]" : "from-white"} to-transparent opacity-70`}></div>
                </div>
                <div className="p-6">
                  <h3 className={`text-xl font-bold mb-1 ${theme === "dark" ? "text-white" : "text-[#1E293B]"}`}>{speaker.name}</h3>
                  <p className="text-[#FF6B6B] mb-4 text-sm">{speaker.role}</p>
                  <p className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"} text-sm line-clamp-4`}>{speaker.bio}</p>

                  <div className="flex gap-3 mt-5">
                    <a href="#" className={`p-2 rounded-full ${theme === "dark" ? "bg-[#222C48]/30 border-white/10" : "bg-white/30 border-white/30"} backdrop-blur-sm hover:bg-[#222C48] transition-colors border shadow`} aria-label="Twitter">
                      <FiTwitter className="h-4 w-4 text-[#FF6B6B]" />
                    </a>
                    <a href="#" className={`p-2 rounded-full ${theme === "dark" ? "bg-[#222C48]/30 border-white/10" : "bg-white/30 border-white/30"} backdrop-blur-sm hover:bg-[#222C48] transition-colors border shadow`} aria-label="LinkedIn">
                      <FiLinkedin className="h-4 w-4 text-[#FF6B6B]" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration and Location Section */}
      <section className={`py-10 md:py-16 px-4 md:px-6 ${theme === "dark" ? "bg-[#0E1428]" : "bg-[#F5F9FF]"}`}>
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center">
              <div className="text-[#FF6B6B] uppercase text-sm font-semibold tracking-wider mb-3">Join Us</div>
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-[#1E293B]"}`}>Register and Visit</h2>
              <p className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"} max-w-2xl mx-auto`}>Secure your spot and find your way to our state-of-the-art venue</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Registration Form */}
              <div id="register" className={`backdrop-blur-md ${theme === "dark" ? "bg-[#19203A]/30 border-white/10" : "bg-white/30 border-white/30"} rounded-2xl p-8 border shadow-xl`}>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FF6B6B] mb-4">
                    <FiSend className="h-5 w-5 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-[#1E293B]"}`}>Register Now</h3>
                  <p className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"} mt-2`}>Secure your spot at the most anticipated tech event of the year</p>
                </div>

                <AnimatePresence mode="wait">
                  {submitSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`p-8 rounded-xl text-center ${theme === "dark" ? "bg-[#222C48]/80" : "bg-white/80"} backdrop-blur-md shadow-lg border ${theme === "dark" ? "border-[#4ECDC4]/20" : "border-[#4ECDC4]/30"}`}
                    >
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-[#4ECDC4] to-[#4ECDC4]/70 flex items-center justify-center mb-6 shadow-lg">
                        <FiCheck className="h-10 w-10 text-white" />
                      </div>
                      <h3 className={`text-2xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-[#1E293B]"}`}>Registration Successful!</h3>
                      <p className={`mb-6 ${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"}`}>Thank you for registering for {eventName}. We've sent a confirmation email to <span className="font-medium text-[#4ECDC4]">{formData.email}</span>.</p>
                      <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${theme === "dark" ? "bg-[#19203A]" : "bg-gray-50"} ${theme === "dark" ? "text-[#8892B0]" : "text-[#64748B]"} text-sm`}>
                        <FiCalendar className="h-4 w-4" />
                        <span>We're excited to see you on December 15, 2025!</span>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="firstName" className={`flex items-center gap-2 mb-2 text-sm font-medium ${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"}`}>
                            <FiUser className={formErrors.firstName && formTouched.firstName ? "text-red-500" : "text-[#FF6B6B]"} />
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`w-full p-3 rounded-lg ${theme === "dark" ? "bg-[#222C48]/50 text-white" : "bg-white text-[#1E293B]"} backdrop-blur-sm border ${formErrors.firstName && formTouched.firstName
                              ? "border-red-500 ring-1 ring-red-500"
                              : theme === "dark" ? "border-white/10" : "border-gray-200"} focus:border-[#FF6B6B] focus:outline-none focus:ring-1 focus:ring-[#FF6B6B] transition-all`}
                          />
                          {formErrors.firstName && formTouched.firstName && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-red-500 mt-2 text-sm flex items-center gap-1.5 font-medium"
                            >
                              <FiAlertCircle className="h-4 w-4" />
                              {formErrors.firstName}
                            </motion.p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="lastName" className={`flex items-center gap-2 mb-2 text-sm font-medium ${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"}`}>
                            <FiUser className={formErrors.lastName && formTouched.lastName ? "text-red-500" : "text-[#FF6B6B]"} />
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`w-full p-3 rounded-lg ${theme === "dark" ? "bg-[#222C48]/50 text-white" : "bg-white text-[#1E293B]"} backdrop-blur-sm border ${formErrors.lastName && formTouched.lastName
                              ? "border-red-500 ring-1 ring-red-500"
                              : theme === "dark" ? "border-white/10" : "border-gray-200"} focus:border-[#FF6B6B] focus:outline-none focus:ring-1 focus:ring-[#FF6B6B] transition-all`}
                          />
                          {formErrors.lastName && formTouched.lastName && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-red-500 mt-2 text-sm flex items-center gap-1.5 font-medium"
                            >
                              <FiAlertCircle className="h-4 w-4" />
                              {formErrors.lastName}
                            </motion.p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className={`flex items-center gap-2 mb-2 text-sm font-medium ${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"}`}>
                          <FiMail className={formErrors.email && formTouched.email ? "text-red-500" : "text-[#FF6B6B]"} />
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full p-3 rounded-lg ${theme === "dark" ? "bg-[#222C48]/50 text-white" : "bg-white text-[#1E293B]"} backdrop-blur-sm border ${formErrors.email && formTouched.email
                            ? "border-red-500 ring-1 ring-red-500"
                            : theme === "dark" ? "border-white/10" : "border-gray-200"} focus:border-[#FF6B6B] focus:outline-none focus:ring-1 focus:ring-[#FF6B6B] transition-all`}
                        />
                        {formErrors.email && formTouched.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-500 mt-2 text-sm flex items-center gap-1.5 font-medium"
                          >
                            <FiAlertCircle className="h-4 w-4" />
                            {formErrors.email}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="company" className={`flex items-center gap-2 mb-2 text-sm font-medium ${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"}`}>
                          <FiBriefcase className="text-[#FF6B6B]" />
                          Company/Organization
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className={`w-full p-3 rounded-lg ${theme === "dark" ? "bg-[#222C48]/50 text-white" : "bg-white text-[#1E293B]"} backdrop-blur-sm border ${theme === "dark" ? "border-white/10" : "border-gray-200"} focus:border-[#FF6B6B] focus:outline-none focus:ring-1 focus:ring-[#FF6B6B] transition-all`}
                        />
                      </div>

                      <div>
                        <label htmlFor="ticketType" className={`flex items-center gap-2 mb-2 text-sm font-medium ${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"}`}>
                          <FiBookmark className={formErrors.ticketType && formTouched.ticketType ? "text-red-500" : "text-[#FF6B6B]"} />
                          Ticket Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="ticketType"
                          name="ticketType"
                          value={formData.ticketType}
                          onChange={handleInputChange}
                          className={`w-full p-3 rounded-lg ${theme === "dark" ? "bg-[#222C48]/50 text-white" : "bg-white text-[#1E293B]"} backdrop-blur-sm border ${formErrors.ticketType && formTouched.ticketType
                            ? "border-red-500 ring-1 ring-red-500"
                            : theme === "dark" ? "border-white/10" : "border-gray-200"} focus:border-[#FF6B6B] focus:outline-none focus:ring-1 focus:ring-[#FF6B6B] transition-all`}
                        >
                          <option value="">Select ticket type</option>
                          <option value="standard">Standard Pass ($299)</option>
                          <option value="premium">Premium Pass ($499)</option>
                          <option value="vip">VIP Pass ($799)</option>
                        </select>
                        {formErrors.ticketType && formTouched.ticketType && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-500 mt-2 text-sm flex items-center gap-1.5 font-medium"
                          >
                            <FiAlertCircle className="h-4 w-4" />
                            {formErrors.ticketType}
                          </motion.p>
                        )}
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-6"
                      >
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3.5 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] hover:from-[#FF5252] hover:to-[#FF4040] disabled:from-[#FF6B6B]/70 disabled:to-[#FF5252]/70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              Secure Your Spot
                              <FiArrowRight className="h-5 w-5" />
                            </span>
                          )}
                        </button>
                      </motion.div>

                      <div className="pt-2 text-center text-sm text-[#8892B0]">
                        <p className="flex items-center justify-center gap-2">
                          <FiLock className="text-[#FF6B6B]" />
                          Your information is secure and will never be shared with third parties
                        </p>
                      </div>
                    </form>
                  )}
                </AnimatePresence>
              </div>

              {/* Location Information */}
              <div id="location" className={`backdrop-blur-md ${theme === "dark" ? "bg-[#19203A]/30 border-white/10" : "bg-white/30 border-white/30"} rounded-2xl overflow-hidden border shadow-xl`}>
                <div className="h-[300px] overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.1034026272367!2d-122.41941608468212!3d37.77492197975918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858099c824510f%3A0x71f43d5a857f763f!2sMoscone%20Center!5e0!3m2!1sen!2sus!4v1629940433187!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>

                <div className="p-8">
                  <h3 className={`text-2xl font-bold mb-6 flex items-center gap-2 font-montserrat ${theme === "dark" ? "text-white" : "text-[#1E293B]"}`}>
                    <FiMapPin className="text-[#FF6B6B]" />
                    Event Venue
                  </h3>

                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${theme === "dark" ? "bg-[#222C48]/30 border-white/10" : "bg-white/30 border-white/30"} backdrop-blur-sm border shadow`}>
                        <FiMapPin className="h-5 w-5 text-[#FF6B6B]" />
                      </div>
                      <div>
                        <h4 className={`font-medium mb-1 ${theme === "dark" ? "text-white" : "text-[#1E293B]"}`}>Address</h4>
                        <p className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"}`}>123 Innovation Way</p>
                        <p className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"}`}>San Francisco, CA 94103</p>
                        <p className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"}`}>United States</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${theme === "dark" ? "bg-[#222C48]/30 border-white/10" : "bg-white/30 border-white/30"} backdrop-blur-sm border shadow`}>
                        <FiClock className="h-5 w-5 text-[#FF6B6B]" />
                      </div>
                      <div>
                        <h4 className={`font-medium mb-1 ${theme === "dark" ? "text-white" : "text-[#1E293B]"}`}>Event Hours</h4>
                        <p className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"}`}>December 15, 2025</p>
                        <p className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"}`}>9:00 AM - 5:00 PM</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 mt-8 w-full">
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#FF6B6B] hover:bg-[#FF5252] text-white transition-colors text-base md:text-lg font-medium"
                    >
                      <FiMapPin className="w-6 h-6 md:w-5 md:h-5" />
                      Get Directions
                    </a>
                    <a
                      href="tel:+11234567890"
                      className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-lg ${theme === "dark" ? "bg-[#222C48]/30 border-white/10 hover:bg-[#222C48]" : "bg-white/30 border-white/30 hover:bg-gray-200"} transition-colors border shadow text-base md:text-lg font-medium ${theme === "dark" ? "text-white" : "text-[#1E293B]"}`}
                    >
                      <FiPhone className={`w-6 h-6 md:w-5 md:h-5 ${theme === "dark" ? "text-[#FF6B6B]" : "text-[#FF6B6B]"}`} />
                      Contact Venue
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 ${theme === "dark" ? "bg-[#19203A]/90" : "bg-white/90"} backdrop-blur-md border-t ${theme === "dark" ? "border-white/10" : "border-black/5"} mt-8`}>
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-md flex items-center justify-center bg-[#FF6B6B] text-white font-bold">
                  TC
                </div>
                <span className={`text-xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-[#1E293B]"}`}>TechConf</span>
              </div>
              <p className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"} mb-6`}>The premier tech conference of 2025. Join us for a day of innovation, learning, and networking.</p>
              <div className="flex gap-4">
                <a href="#" className={`p-2 rounded-full ${theme === "dark" ? "bg-[#222C48]/30 border-white/10" : "bg-white/30 border-white/30"} backdrop-blur-sm hover:bg-${theme === "dark" ? "[#222C48]" : "gray-200"} transition-colors border shadow`}>
                  <FiTwitter className="h-5 w-5 text-[#FF6B6B]" />
                </a>
                <a href="#" className={`p-2 rounded-full ${theme === "dark" ? "bg-[#222C48]/30 border-white/10" : "bg-white/30 border-white/30"} backdrop-blur-sm hover:bg-${theme === "dark" ? "[#222C48]" : "gray-200"} transition-colors border shadow`}>
                  <FiLinkedin className="h-5 w-5 text-[#FF6B6B]" />
                </a>
              </div>
            </div>

            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h3 className={`font-bold mb-4 ${theme === "dark" ? "text-white" : "text-[#1E293B]"}`}>Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="#about" className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"} hover:text-[#FF6B6B] transition-colors`}>About</a></li>
                  <li><a href="#agenda" className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"} hover:text-[#FF6B6B] transition-colors`}>Agenda</a></li>
                  <li><a href="#speakers" className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"} hover:text-[#FF6B6B] transition-colors`}>Speakers</a></li>
                  <li><a href="#register" className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"} hover:text-[#FF6B6B] transition-colors`}>Register</a></li>
                  <li><a href="#location" className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"} hover:text-[#FF6B6B] transition-colors`}>Location</a></li>
                </ul>
              </div>

              <div>
                <h3 className={`font-bold mb-4 ${theme === "dark" ? "text-white" : "text-[#1E293B]"}`}>Contact</h3>
                <ul className="space-y-2">
                  <li className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"}`}>info@techconf.event</li>
                  <li className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"}`}>+1 (123) 456-7890</li>
                </ul>
              </div>

              <div>
                <h3 className={`font-bold mb-4 ${theme === "dark" ? "text-white" : "text-[#1E293B]"}`}>Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"} hover:text-[#FF6B6B] transition-colors`}>Privacy Policy</a></li>
                  <li><a href="#" className={`${theme === "dark" ? "text-[#CCD6F6]" : "text-[#334155]"} hover:text-[#FF6B6B] transition-colors`}>Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className={`border-t ${theme === "dark" ? "border-white/10" : "border-black/5"} mt-12 pt-8 ${theme === "dark" ? "text-[#8892B0]" : "text-[#64748B]"} text-center text-sm`}>
            <p>© 2025 TechConf. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
        html, body, * {
          font-family: 'Montserrat', system-ui, sans-serif !important;
        }
        .shadow-neumorph {
          box-shadow: ${theme === "dark"
          ? "0 4px 20px rgba(0, 0, 0, 0.4), 0 8px 16px rgba(0, 0, 0, 0.3)"
          : "0 4px 20px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)"};
        }
        
        .shadow-neumorph-lg {
          box-shadow: ${theme === "dark"
          ? "0 10px 30px rgba(0, 0, 0, 0.5), 0 15px 25px rgba(0, 0, 0, 0.4)"
          : "0 10px 30px rgba(0, 0, 0, 0.15), 0 15px 25px rgba(0, 0, 0, 0.1)"};
        }
        
        .shadow-neumorph-hover {
          box-shadow: ${theme === "dark"
          ? "0 10px 20px rgba(0, 0, 0, 0.6), 0 6px 15px rgba(0, 0, 0, 0.5)"
          : "0 10px 20px rgba(0, 0, 0, 0.2), 0 6px 15px rgba(0, 0, 0, 0.15)"};
        }
        
        .backdrop-blur-md {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        
        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}