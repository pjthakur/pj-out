"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon,
  MapPin,
  Calendar,
  Info,
  Send,
} from "lucide-react";
import type { JSX } from "react";

type ThemeType = "light" | "dark";
type ThemeColors = {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  card: string;
  border: string;
  overlay: string;
};

const themes: Record<ThemeType, ThemeColors> = {
  light: {
    background: "bg-amber-50",
    text: "text-gray-900",
    primary: "text-red-700",
    secondary: "text-amber-800",
    accent: "text-yellow-600",
    muted: "text-gray-600",
    card: "bg-white",
    border: "border-amber-200",
    overlay: "bg-black/50",
  },
  dark: {
    background: "bg-gray-900",
    text: "text-gray-100",
    primary: "text-red-500",
    secondary: "text-amber-400",
    accent: "text-yellow-500",
    muted: "text-gray-400",
    card: "bg-gray-800",
    border: "border-gray-700",
    overlay: "bg-black/70",
  },
};

type Destination = {
  id: number;
  name: string;
  description: string;
  image: string;
  location: string;
};

type CulturalHighlight = {
  id: number;
  title: string;
  description: string;
  image: string;
};

type TravelTip = {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
};

type ToastType = "success" | "error" | "info";
type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

const destinations: Destination[] = [
  {
    id: 1,
    name: "The Great Wall",
    description:
      "One of the greatest wonders of the world, the Great Wall of China stretches more than 13,000 miles across China's northern border.",
    image:
      "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    location: "Northern China",
  },
  {
    id: 2,
    name: "Forbidden City",
    description:
      "The imperial palace during the Ming and Qing dynasties, this massive complex features 980 buildings spanning 180 acres.",
    image:
      "https://images.unsplash.com/photo-1584646098378-0874589d76b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    location: "Beijing",
  },
  {
    id: 3,
    name: "Zhangjiajie",
    description:
      "Famous for its towering quartzite sandstone pillars, this stunning landscape inspired the floating mountains in Avatar.",
    image:
      "https://images.unsplash.com/photo-1537531383496-f4749b8032cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    location: "Hunan Province",
  },
  {
    id: 4,
    name: "Li River",
    description:
      "Cruise along the Li River to witness the breathtaking karst landscape that has inspired Chinese artists for centuries.",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    location: "Guangxi Province",
  },
  {
    id: 5,
    name: "Terracotta Army",
    description:
      "Discovered in 1974, this collection of terracotta sculptures depicts the armies of the first Emperor of China, Qin Shi Huang.",
    image:
      "https://images.pexels.com/photos/30584842/pexels-photo-30584842/free-photo-of-terracotta-warriors-in-xi-an-china.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    location: "Xi'an",
  },
];

const culturalHighlights: CulturalHighlight[] = [
  {
    id: 1,
    title: "Chinese Calligraphy",
    description:
      "An ancient art form dating back thousands of years, Chinese calligraphy combines aesthetics with philosophical expression.",
    image:
      "https://images.pexels.com/photos/2599543/pexels-photo-2599543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 2,
    title: "Traditional Opera",
    description:
      "Chinese opera combines music, vocal performance, mime, dance, and acrobatics in a spectacular theatrical experience.",
    image:
      "https://images.pexels.com/photos/36474/dresden-semper-opera-house-historically-at-night.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 3,
    title: "Tea Culture",
    description:
      "Tea drinking in China is an art form with rituals and ceremonies that reflect harmony, respect, and gratitude.",
    image:
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
];

const createTravelTips = (): TravelTip[] => [
  {
    id: 1,
    title: "Best Time to Visit",
    description:
      "Spring (April-May) and Autumn (September-October) offer the most comfortable temperatures and fewer crowds.",
    icon: <Calendar className="w-8 h-8" />,
  },
  {
    id: 2,
    title: "Transportation",
    description:
      "China has an extensive high-speed rail network that connects major cities, offering a comfortable and efficient way to travel.",
    icon: <MapPin className="w-8 h-8" />,
  },
  {
    id: 3,
    title: "Language",
    description:
      "While English is spoken in major tourist areas, learning a few basic Mandarin phrases will enhance your experience.",
    icon: <Info className="w-8 h-8" />,
  },
];

export default function Page() {
  const [theme, setTheme] = useState<ThemeType>("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const travelTips = createTravelTips();

  const heroRef = useRef<HTMLDivElement>(null);
  const destinationsRef = useRef<HTMLDivElement>(null);
  const culturalRef = useRef<HTMLDivElement>(null);
  const tipsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeType;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }

    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalOpen]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === destinations.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? destinations.length - 1 : prev - 1
    );
  };

  const addToast = (message: string, type: ToastType = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => {
      const newToasts = [...prev, { id, message, type }];
      return newToasts.slice(-3);
    });

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubscribe = () => {
    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    setEmailError("");
    addToast(`Thank you for subscribing with ${email}!`);
    setEmail("");
    setModalOpen(false);
  };

  const t = themes[theme];

  return (
    <main
      className={`font-sans min-h-screen ${t.background} ${t.text} transition-colors duration-300`}
    >
      <nav
        className={`fixed w-full z-50 ${t.card} shadow-md transition-colors duration-300`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1
              className={`text-2xl md:text-3xl font-serif font-bold ${t.primary}`}
            >
              <span className={t.secondary}>Explore</span>China 
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection(heroRef)}
              className={`${t.text} hover:${t.primary} transition-colors cursor-pointer`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection(destinationsRef)}
              className={`${t.text} hover:${t.primary} transition-colors cursor-pointer`}
            >
              Destinations
            </button>
            <button
              onClick={() => scrollToSection(culturalRef)}
              className={`${t.text} hover:${t.primary} transition-colors cursor-pointer`}
            >
              Cultural
            </button>
            <button
              onClick={() => scrollToSection(tipsRef)}
              className={`${t.text} hover:${t.primary} transition-colors cursor-pointer`}
            >
              Travel Tips
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className={`px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer`}
            >
              Subscribe
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${t.card} ${t.border} border cursor-pointer`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          <div className="flex items-center space-x-4 md:hidden">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${t.card} ${t.border} border cursor-pointer`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="cursor-pointer"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className={`fixed inset-0 z-50 ${t.card} ${t.text} pt-20`}
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="cursor-pointer p-2"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col items-center space-y-8 p-8">
              <button
                onClick={() => scrollToSection(heroRef)}
                className={`text-xl ${t.text} hover:${t.primary} transition-colors cursor-pointer`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection(destinationsRef)}
                className={`text-xl ${t.text} hover:${t.primary} transition-colors cursor-pointer`}
              >
                Destinations
              </button>
              <button
                onClick={() => scrollToSection(culturalRef)}
                className={`text-xl ${t.text} hover:${t.primary} transition-colors cursor-pointer`}
              >
                Cultural
              </button>
              <button
                onClick={() => scrollToSection(tipsRef)}
                className={`text-xl ${t.text} hover:${t.primary} transition-colors cursor-pointer`}
              >
                Travel Tips
              </button>
              <button
                onClick={() => {
                  setModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className={`px-6 py-3 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer`}
              >
                Subscribe
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={heroRef} className="relative h-screen overflow-hidden">
        <img
          src="https://images.pexels.com/photos/1531660/pexels-photo-1531660.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="China landscape with mountains and traditional architecture"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>

        <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6">
              Discover the Wonders of{" "}
              <span className="text-yellow-400">China</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Experience thousands of years of history, breathtaking landscapes,
              and rich cultural heritage in one of the world's most fascinating
              countries.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection(destinationsRef)}
              className="px-8 py-3 bg-red-600 text-white rounded-md text-lg font-medium hover:bg-red-700 transition-colors cursor-pointer"
            >
              Explore Destinations
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div
        ref={destinationsRef}
        className={`py-20 transition-colors duration-300 ${t.background}`}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2
              className={`text-3xl md:text-5xl font-serif font-bold mb-4 ${t.primary}`}
            >
              Top Destinations
            </h2>
            <p className={`text-lg ${t.muted} max-w-2xl mx-auto`}>
              From ancient wonders to natural landscapes, China offers a diverse
              range of unforgettable destinations.
            </p>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            <div className="overflow-hidden rounded-xl">
              <div className="relative aspect-[16/9]">
                {destinations.map((destination, index) => (
                  <motion.div
                    key={destination.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: currentSlide === index ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-0 ${
                      currentSlide === index ? "block" : "hidden"
                    }`}
                  >
                    <img
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                      <h3 className="text-2xl md:text-4xl font-serif font-bold text-white mb-2">
                        {destination.name}
                      </h3>
                      <div className="flex items-center text-yellow-400 mb-3">
                        <MapPin size={16} className="mr-2" />
                        <span>{destination.location}</span>
                      </div>
                      <p className="text-gray-200 text-sm md:text-base max-w-2xl">
                        {destination.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-4 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-4 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>

            <div className="flex justify-center mt-4 space-x-2">
              {destinations.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
                    currentSlide === index ? "bg-red-600" : "bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        ref={culturalRef}
        className={`py-20 ${
          theme === "light" ? "bg-red-50" : "bg-gray-800"
        } transition-colors duration-300`}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2
              className={`text-3xl md:text-5xl font-serif font-bold mb-4 ${t.primary}`}
            >
              Cultural Highlights
            </h2>
            <p className={`text-lg ${t.muted} max-w-2xl mx-auto`}>
              Immerse yourself in China's rich cultural heritage, from ancient
              traditions to modern expressions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {culturalHighlights.map((highlight, index) => (
              <motion.div
                key={highlight.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-xl overflow-hidden ${t.card} shadow-lg`}
              >
                <div className="relative h-48">
                  <img
                    src={highlight.image || "/placeholder.svg"}
                    alt={highlight.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3
                    className={`text-xl font-serif font-bold mb-3 ${t.primary}`}
                  >
                    {highlight.title}
                  </h3>
                  <p className={`${t.muted} text-sm`}>
                    {highlight.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={tipsRef}
        className={`py-20 ${t.background} transition-colors duration-300`}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2
              className={`text-3xl md:text-5xl font-serif font-bold mb-4 ${t.primary}`}
            >
              Travel Tips
            </h2>
            <p className={`text-lg ${t.muted} max-w-2xl mx-auto`}>
              Make the most of your journey with these essential tips for
              traveling in China.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {travelTips.map((tip, index) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-6 rounded-xl ${t.card} ${t.border} border shadow-sm`}
              >
                <div className={`${t.secondary} mb-4`}>{tip.icon}</div>
                <h3 className={`text-xl font-bold mb-3 ${t.text}`}>
                  {tip.title}
                </h3>
                <p className={`${t.muted} text-sm`}>{tip.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`mt-16 p-8 rounded-xl ${t.card} ${t.border} border shadow-md max-w-3xl mx-auto text-center`}
          >
            <h3 className={`text-2xl font-serif font-bold mb-4 ${t.primary}`}>
              Ready to Explore China?
            </h3>
            <p className={`${t.muted} mb-6`}>
              Subscribe to our newsletter for travel guides, exclusive offers,
              and insider tips.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors cursor-pointer"
            >
              Subscribe Now
            </button>
          </motion.div>
        </div>
      </div>

      <footer
        className={`py-12 ${
          theme === "light"
            ? "bg-gray-900 text-white"
            : "bg-gray-950 text-gray-200"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-serif font-bold text-yellow-400 mb-4">
                <span className="text-amber-400">Explore</span>
                <span className="text-red-500">China</span>
              </h3>
              <p className="text-gray-400 text-sm">
                Your gateway to experiencing the wonders of China, from ancient
                traditions to modern marvels.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection(heroRef)}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(destinationsRef)}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Destinations
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(culturalRef)}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cultural Highlights
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(tipsRef)}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Travel Tips
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() =>
                      addToast("Travel Guide coming soon!", "info")
                    }
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Travel Guide
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => addToast("FAQ section coming soon!", "info")}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    FAQs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      addToast("Blog section coming soon!", "info")
                    }
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Blog
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">Email: info@explorechina.com</li>
                <li className="text-gray-400">Phone: +1 (123) 456-7890</li>
                <li className="text-gray-400">
                  Address: 123 Tourism St, Beijing, China
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>
              © {new Date().getFullYear()} Explore China. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${t.overlay} backdrop-blur-sm`}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative max-w-md w-full rounded-xl ${t.card} p-8 shadow-xl`}
            >
              <button
                onClick={() => setModalOpen(false)}
                className={`absolute top-4 right-4 ${t.muted} hover:${t.text} transition-colors cursor-pointer`}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <h3
                  className={`text-2xl font-serif font-bold ${t.primary} mb-2`}
                >
                  Subscribe to Our Newsletter
                </h3>
                <p className={t.muted}>
                  Get the latest travel tips, exclusive offers, and destination
                  guides.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className={`block text-sm font-medium ${t.text} mb-1`}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-2 rounded-md ${t.border} border bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500`}
                  />
                  {emailError && (
                    <p className="mt-1 text-sm text-red-500">{emailError}</p>
                  )}
                </div>

                <button
                  onClick={handleSubscribe}
                  className="w-full px-4 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors flex items-center justify-center cursor-pointer"
                >
                  Subscribe <Send size={16} className="ml-2" />
                </button>

                <p className={`text-xs ${t.muted} text-center mt-4`}>
                  By subscribing, you agree to our Privacy Policy and Terms of
                  Service.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className={`px-4 py-3 rounded-md shadow-lg ${
                toast.type === "success"
                  ? "bg-green-600"
                  : toast.type === "error"
                  ? "bg-red-600"
                  : "bg-blue-600"
              } text-white max-w-xs`}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
}