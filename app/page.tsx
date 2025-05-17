"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { Lora, Cinzel_Decorative } from "next/font/google";
import {
  Moon,
  Sun,
  MapPin,
  Sparkles,
  Feather,
  Book,
  Wand2,
} from "lucide-react";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

const cinzel = Cinzel_Decorative({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-cinzel",
});

type ThemeType = "hogwarts" | "azkaban";

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  cardBg: string;
  headerBg: string;
  mapBg: string;
}

const themes: Record<ThemeType, ThemeColors> = {
  hogwarts: {
    primary: "#740001",
    secondary: "#D3A625",
    accent: "#1A472A",
    background: "#f5f3e8",
    text: "#2A2D34",
    cardBg: "rgba(255, 255, 255, 0.8)",
    headerBg: "rgba(245, 243, 232, 0.9)",
    mapBg: "#e0d5c0",
  },
  azkaban: {
    primary: "#2A623D",
    secondary: "#AAAAAA",
    accent: "#222F5B",
    background: "#121212",
    text: "#E0E0E0",
    cardBg: "rgba(30, 30, 30, 0.8)",
    headerBg: "rgba(18, 18, 18, 0.9)",
    mapBg: "#1e1e1e",
  },
};

const houses = [
  {
    id: "gryffindor",
    name: "Gryffindor",
    colors: ["#740001", "#D3A625"],
    animal: "Lion",
    traits: ["Bravery", "Courage", "Determination"],
    founder: "Godric Gryffindor",
    image:
      "https://images.pexels.com/photos/8391515/pexels-photo-8391515.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "hufflepuff",
    name: "Hufflepuff",
    colors: ["#ECB939", "#000000"],
    animal: "Badger",
    traits: ["Loyalty", "Patience", "Hard work"],
    founder: "Helga Hufflepuff",
    image:
      "https://images.pexels.com/photos/8391241/pexels-photo-8391241.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "ravenclaw",
    name: "Ravenclaw",
    colors: ["#222F5B", "#946B2D"],
    animal: "Eagle",
    traits: ["Intelligence", "Creativity", "Wisdom"],
    founder: "Rowena Ravenclaw",
    image:
      "https://images.pexels.com/photos/7979069/pexels-photo-7979069.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "slytherin",
    name: "Slytherin",
    colors: ["#1A472A", "#5D5D5D"],
    animal: "Serpent",
    traits: ["Ambition", "Cunning", "Resourcefulness"],
    founder: "Salazar Slytherin",
    image:
      "https://images.pexels.com/photos/7979113/pexels-photo-7979113.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];

const mapLocations = [
  {
    id: "hogwarts",
    name: "Hogwarts School",
    description:
      "The magical school of witchcraft and wizardry, home to students of all houses.",
    x: 50,
    y: 30,
    image:
      "https://images.unsplash.com/photo-1706147602723-6cbe74cececc?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "hogsmeade",
    name: "Hogsmeade Village",
    description:
      "The only all-wizarding village in Britain, famous for Honeydukes and The Three Broomsticks.",
    x: 75,
    y: 45,
    image:
      "https://plus.unsplash.com/premium_photo-1672440648762-5ba24a4feb77?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "forbidden-forest",
    name: "Forbidden Forest",
    description:
      "A dark and dangerous forest on the grounds of Hogwarts, home to many magical creatures.",
    x: 25,
    y: 60,
    image:
      "https://images.pexels.com/photos/13327765/pexels-photo-13327765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "black-lake",
    name: "The Black Lake",
    description:
      "A large body of water near Hogwarts, home to the Giant Squid and merpeople.",
    x: 60,
    y: 70,
    image:
      "https://images.pexels.com/photos/10071396/pexels-photo-10071396.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";

  return (
    <motion.div
      className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg text-white ${bgColor} shadow-lg z-50`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
    >
      {message}
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
  useEffect(() => {
    if (isOpen) {
    document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
    document.body.style.overflow = "auto";
  };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
      <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden"
            style={{ backgroundColor: "var(--color-card-bg)" }}
            initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: "var(--color-accent)" }}
            >
              <h3
                className={`${cinzel.className} text-xl font-bold`}
                style={{ color: "var(--color-text)" }}
              >
                {title}
              </h3>
          <button
            onClick={onClose}
                className="hover:opacity-70 transition-opacity cursor-pointer"
                style={{ color: "var(--color-text)" }}
          >
                ✕
          </button>
            </div>
            <div className="p-4" style={{ color: "var(--color-text)" }}>
              {children}
            </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
}

const FloatingElement = ({
  children,
  delay = 0,
  duration = 3,
  x = 10,
  y = 10,
}: FloatingElementProps) => {
  return (
    <motion.div
      animate={{
        y: [0, y, 0],
        x: [0, x, 0],
      }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};

export default function HarryPotterPortal() {
  const [theme, setTheme] = useState<ThemeType>("hogwarts");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<
    (typeof mapLocations)[0] | null
  >(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const mainRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const toggleTheme = () => {
    const newTheme = theme === "hogwarts" ? "azkaban" : "hogwarts";
    setTheme(newTheme);
    showToast(
      `Switched to ${
        newTheme === "hogwarts" ? "Day at Hogwarts" : "Night at Azkaban"
      } theme`,
      "info"
    );
  };

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  const handleLocationClick = (location: (typeof mapLocations)[0]) => {
    setSelectedLocation(location);
    setIsMapModalOpen(true);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError("");

    showToast("Successfully subscribed to the Daily Prophet!", "success");
    setIsSubscribeModalOpen(false);
    setEmail("");
  };

  const currentTheme = themes[theme];

  const themeStyle = {
    "--color-primary": currentTheme.primary,
    "--color-secondary": currentTheme.secondary,
    "--color-accent": currentTheme.accent,
    "--color-background": currentTheme.background,
    "--color-text": currentTheme.text,
    "--color-card-bg": currentTheme.cardBg,
    "--color-header-bg": currentTheme.headerBg,
    "--color-map-bg": currentTheme.mapBg,
  } as React.CSSProperties;

  return (
    <div
      className={`${lora.variable} ${cinzel.variable} font-lora transition-colors duration-500`}
      style={themeStyle}
    >
      <div
        ref={mainRef}
        style={{
          backgroundColor: "var(--color-background)",
          color: "var(--color-text)",
        }}
        className="min-h-screen relative overflow-x-hidden"
      >
        <motion.header
          style={{
            backgroundColor: "var(--color-header-bg)",
          }}
          className="fixed top-0 left-0 right-0 z-40 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1
              className={`${cinzel.className} text-2xl md:text-3xl font-bold`}
            >
              <span style={{ color: "var(--color-primary)" }}>Magical</span>
              <span style={{ color: "var(--color-secondary)" }}> Portal</span>
            </h1>
            <div className="flex items-center gap-4">
        <button
                onClick={toggleTheme}
                className="p-2 rounded-full transition-colors cursor-pointer"
                aria-label={
                  theme === "hogwarts"
                    ? "Switch to Night at Azkaban"
                    : "Switch to Day at Hogwarts"
                }
              >
                {theme === "hogwarts" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
          </div>
        </motion.header>

        <motion.section
          className="h-screen relative flex items-center justify-center overflow-hidden"
          style={{ scale: heroScale, opacity: heroOpacity }}
        >
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1618944913480-b67ee16d7b77?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Hogwarts Castle"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                position: "absolute",
              }}
            />
          </div>

          <div className="container mx-auto px-4 z-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1
                className={`${cinzel.className} text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-lg`}
              >
                Welcome to the <br />
                <span style={{ color: "var(--color-secondary)" }}>
                  Wizarding World
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto mb-8 drop-shadow-md">
                Discover the magic, explore the mysteries, and embark on an
                unforgettable journey.
              </p>
              <motion.button
                onClick={() => setIsSubscribeModalOpen(true)}
                className="px-6 py-3 rounded-lg text-white font-medium cursor-pointer"
                style={{ backgroundColor: "var(--color-primary)" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe to the Daily Prophet
              </motion.button>
            </motion.div>
        </div>

          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="text-white text-center">
              <p className="mb-2">Scroll to explore</p>
              <div className="w-6 h-10 border-2 border-white rounded-full mx-auto flex justify-center">
                <motion.div
                  className="w-1 h-2 bg-white rounded-full mt-2"
                  animate={{ y: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
        </div>
      </div>
          </motion.div>
        </motion.section>

        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.2 }}
              >
                <h2
                  className={`${cinzel.className} text-3xl md:text-4xl font-bold mb-4`}
                >
                  The Four{" "}
                  <span style={{ color: "var(--color-primary)" }}>Houses</span>{" "}
                  of Hogwarts
                </h2>
                <p className="max-w-2xl mx-auto text-lg opacity-80">
                  Each with their own values, traditions, and illustrious
                  histories.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {houses.map((house, index) => (
                <motion.div
                  key={house.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                  className="rounded-lg overflow-hidden shadow-lg"
                  style={{ backgroundColor: "var(--color-card-bg)" }}
                >
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={house.image || "/placeholder.svg"}
                      alt={house.name}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                      }}
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        background: `linear-gradient(to bottom, ${house.colors[0]}80, ${house.colors[1]}80)`,
                      }}
                    >
                      <h3
                        className={`${cinzel.className} text-3xl font-bold text-white drop-shadow-lg`}
                      >
                        {house.name}
                      </h3>
        </div>
      </div>
                  <div className="p-6">
                    <p className="mb-4">
                      <strong>Founder:</strong> {house.founder}
                    </p>
                    <p className="mb-4">
                      <strong>Animal:</strong> {house.animal}
                    </p>
                    <p>
                      <strong>Traits:</strong> {house.traits.join(", ")}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.2 }}
              >
                <h2
                  className={`${cinzel.className} text-3xl md:text-4xl font-bold mb-4`}
                >
                  The{" "}
                  <span style={{ color: "var(--color-primary)" }}>
                    Marauder's
                  </span>{" "}
                  Map
                </h2>
                <p className="max-w-2xl mx-auto text-lg opacity-80">
                  "I solemnly swear that I am up to no good."
                </p>
              </motion.div>
          </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-xl"
              style={{
                backgroundColor: "var(--color-map-bg)",
                padding: "2rem",
                border: "8px solid #8B4513",
              }}
            >
              <div className="absolute inset-0 opacity-10">
                <img
                  src="https://images.pexels.com/photos/235985/pexels-photo-235985.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Parchment texture"
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                  }}
                />
            </div>

              <div className="relative h-[500px] w-full">
                <svg 
                  className="absolute inset-0 w-full h-full z-0" 
                  style={{ 
                    stroke: "var(--color-primary)",
                    strokeWidth: "3px",
                    strokeDasharray: "6 4",
                    opacity: 0.9,
                    fill: "none"
                  }}
                >
                  <motion.path 
                    d={`M ${mapLocations[0].x}% ${mapLocations[0].y}% Q ${(mapLocations[0].x + mapLocations[1].x)/2 + 10}% ${(mapLocations[0].y + mapLocations[1].y)/2 - 15}%, ${mapLocations[1].x}% ${mapLocations[1].y}%`}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 0.5 }}
                  />
                  
                  <motion.path 
                    d={`M ${mapLocations[0].x}% ${mapLocations[0].y}% Q ${(mapLocations[0].x + mapLocations[2].x)/2 - 5}% ${(mapLocations[0].y + mapLocations[2].y)/2}%, ${mapLocations[2].x}% ${mapLocations[2].y}%`}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.8, delay: 0.7 }}
                  />
                  
                  <motion.path 
                    d={`M ${mapLocations[0].x}% ${mapLocations[0].y}% Q ${(mapLocations[0].x + mapLocations[3].x)/2}% ${(mapLocations[0].y + mapLocations[3].y)/2 + 10}%, ${mapLocations[3].x}% ${mapLocations[3].y}%`}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.9 }}
                  />
                  
                  <motion.path 
                    d={`M ${mapLocations[2].x}% ${mapLocations[2].y}% Q ${(mapLocations[2].x + mapLocations[3].x)/2}% ${(mapLocations[2].y + mapLocations[3].y)/2 + 5}%, ${mapLocations[3].x}% ${mapLocations[3].y}%`}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 1.1 }}
                  />
                  
                  <motion.line 
                    x1={`${mapLocations[0].x}%`} 
                    y1={`${mapLocations[0].y}%`} 
                    x2={`${mapLocations[1].x}%`} 
                    y2={`${mapLocations[1].y}%`}
                    strokeDasharray="4 2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 2 }}
                  />
                  
                  <motion.line 
                    x1={`${mapLocations[0].x}%`} 
                    y1={`${mapLocations[0].y}%`} 
                    x2={`${mapLocations[2].x}%`} 
                    y2={`${mapLocations[2].y}%`}
                    strokeDasharray="4 2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 2.1 }}
                  />
                  
                  <motion.line 
                    x1={`${mapLocations[0].x}%`} 
                    y1={`${mapLocations[0].y}%`} 
                    x2={`${mapLocations[3].x}%`} 
                    y2={`${mapLocations[3].y}%`}
                    strokeDasharray="4 2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 2.2 }}
                  />
                  
                  <motion.line 
                    x1={`${mapLocations[2].x}%`} 
                    y1={`${mapLocations[2].y}%`} 
                    x2={`${mapLocations[3].x}%`} 
                    y2={`${mapLocations[3].y}%`}
                    strokeDasharray="4 2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 2.3 }}
                  />
                  
                  {[0.3, 0.6, 0.9].map((pos, i) => (
                    <motion.path 
                      key={`footprint-1-${i}`}
                      d="M-4,0 C-3,1 -1,1 0,0 C1,-1 3,-1 4,0 M-2,-3 C-1,-2 1,-2 2,-3"
                      transform={`translate(${mapLocations[0].x * (1-pos) + mapLocations[1].x * pos}%, ${mapLocations[0].y * (1-pos) + mapLocations[1].y * pos}%) scale(0.7)`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1.5 + i*0.2 }}
                    />
                  ))}
                </svg>

                <svg 
                  className="absolute inset-0 w-full h-full z-5" 
                  style={{ 
                    stroke: "#8B4513",
                    strokeWidth: "2px",
                    opacity: 1,
                    fill: "none"
                  }}
                >
                  <path 
                    d={`M ${mapLocations[0].x}% ${mapLocations[0].y}% L ${mapLocations[1].x}% ${mapLocations[1].y}%`}
                    strokeDasharray="2 4"
                  />
                  <path 
                    d={`M ${mapLocations[0].x}% ${mapLocations[0].y}% L ${mapLocations[2].x}% ${mapLocations[2].y}%`}
                    strokeDasharray="2 4"
                  />
                  <path 
                    d={`M ${mapLocations[0].x}% ${mapLocations[0].y}% L ${mapLocations[3].x}% ${mapLocations[3].y}%`}
                    strokeDasharray="2 4"
                  />
                  <path 
                    d={`M ${mapLocations[2].x}% ${mapLocations[2].y}% L ${mapLocations[3].x}% ${mapLocations[3].y}%`}
                    strokeDasharray="2 4"
                  />
                </svg>

                {mapLocations.map((location) => (
                  <motion.div
                    key={location.id}
                    className="absolute cursor-pointer z-10"
                    style={{
                      left: `${location.x}%`,
                      top: `${location.y}%`,
                    }}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => handleLocationClick(location)}
                  >
                    <div className="relative">
                      <MapPin
                        size={32}
                        style={{ color: "var(--color-primary)" }}
                      />
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                        style={{ backgroundColor: "var(--color-secondary)" }}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      />
          </div>
                    <div
                      className={`${cinzel.className} absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-bold`}
                    >
                      {location.name}
        </div>
                  </motion.div>
                ))}
            </div>

              <div className="text-center mt-4">
                <p className="italic text-sm opacity-70">"Mischief managed."</p>
            </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.2 }}
              >
                <h2
                  className={`${cinzel.className} text-3xl md:text-4xl font-bold mb-4`}
                >
                  Magical{" "}
                  <span style={{ color: "var(--color-primary)" }}>
                    Features
                  </span>
                </h2>
                <p className="max-w-2xl mx-auto text-lg opacity-80">
                  Discover the enchanting elements of our wizarding world.
                </p>
              </motion.div>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Sparkles size={40} />,
                  title: "Animated Magic",
                  description:
                    "Experience the wonder of magical animations throughout your journey.",
                },
                {
                  icon: <Book size={40} />,
                  title: "Wizarding Stories",
                  description:
                    "Immerse yourself in the rich lore and captivating tales of the wizarding world.",
                },
                {
                  icon: <Wand2 size={40} />,
                  title: "Interactive Spells",
                  description:
                    "Cast spells and see their magical effects come to life before your eyes.",
                },
                {
                  icon: <Feather size={40} />,
                  title: "Daily Prophet",
                  description:
                    "Stay updated with the latest news and events from across the wizarding community.",
                },
                {
                  icon: <MapPin size={40} />,
                  title: "Magical Locations",
                  description:
                    "Explore iconic locations from Hogwarts to Diagon Alley and beyond.",
                },
                {
                  icon: <Sun size={40} />,
                  title: "Day & Night Themes",
                  description:
                    "Experience the magic in daylight at Hogwarts or under the moonlight at Azkaban.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={`feature-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                  className="rounded-lg p-6 text-center"
                  style={{ backgroundColor: "var(--color-card-bg)" }}
                >
                  <div
                    className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  >
                    <div style={{ color: "var(--color-secondary)" }}>
                      {feature.icon}
            </div>
            </div>
                  <h3 className={`${cinzel.className} text-xl font-bold mb-2`}>
                    {feature.title}
                  </h3>
                  <p className="opacity-80">{feature.description}</p>
                </motion.div>
              ))}
          </div>
        </div>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={`spark-${i}`}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: "var(--color-secondary)",
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: 0,
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0],
                  y: [0, -20, -40],
                  x: [0, (Math.random() - 0.5) * 40],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>
        </section>

        <section
          className="py-20 relative"
          style={{
            backgroundImage: `linear-gradient(to bottom, ${
              theme === "hogwarts"
                ? "rgba(245, 243, 232, 0.8)"
                : "rgba(18, 18, 18, 0.8)"
            }, ${
              theme === "hogwarts"
                ? "rgba(245, 243, 232, 0.8)"
                : "rgba(18, 18, 18, 0.8)"
            }), url('https://images.unsplash.com/photo-1654344009714-c582a009af5d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container mx-auto px-4 text-center">
              <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2
                className={`${cinzel.className} text-3xl md:text-4xl font-bold mb-6`}
              >
                Ready to Begin Your{" "}
                <span style={{ color: "var(--color-primary)" }}>Magical</span>{" "}
                Journey?
              </h2>
              <p className="max-w-2xl mx-auto text-lg mb-8 opacity-80">
                Subscribe to the Daily Prophet and stay updated with the latest
                news from the wizarding world.
              </p>
              <motion.button
                onClick={() => setIsSubscribeModalOpen(true)}
                className="px-6 py-3 rounded-lg text-white font-medium cursor-pointer"
                style={{ backgroundColor: "var(--color-primary)" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe Now
              </motion.button>
              </motion.div>
            </div>
        </section>

        <footer
          className="py-8 border-t"
          style={{ borderColor: "var(--color-accent)" }}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-center items-center text-center">
              <div className="mb-4 md:mb-0">
                <h2 className={`${cinzel.className} text-xl font-bold`}>
                  <span style={{ color: "var(--color-primary)" }}>Magical</span>
                  <span style={{ color: "var(--color-secondary)" }}>
                    {" "}
                    Portal
                  </span>
                </h2>
                <p className="text-sm opacity-70 mt-1">
                  A fan-made tribute to the wizarding world.
                </p>
        </div>
            </div>
            <div className="mt-8 text-center text-sm opacity-70">
              <p>
                This is a fan-made website. Harry Potter and all associated
                names are trademarks of Warner Bros. Entertainment Inc.
              </p>
              <p className="mt-2">
                © {new Date().getFullYear()} Magical Portal. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>

        <Modal
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
          title={selectedLocation?.name || ""}
        >
          {selectedLocation && (
            <div>
              <div className="mb-4 rounded-lg overflow-hidden">
                <img
                  src={selectedLocation.image || "/placeholder.svg"}
                  alt={selectedLocation.name}
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
              <p>{selectedLocation.description}</p>
            </div>
          )}
        </Modal>

        <Modal
          isOpen={isSubscribeModalOpen}
          onClose={() => setIsSubscribeModalOpen(false)}
          title="Subscribe to the Daily Prophet"
        >
          <form onSubmit={handleSubscribe} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--color-card-bg)",
                  color: "var(--color-text)",
                  borderColor: emailError ? "red" : "var(--color-accent)",
                  borderWidth: "1px",
                }}
                placeholder="your.email@example.com"
                required
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-500">{emailError}</p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-md text-white font-medium cursor-pointer"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Subscribe
              </button>
        </div>
          </form>
        </Modal>

        <AnimatePresence>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={closeToast}
            />
          )}
        </AnimatePresence>
        </div>
    </div>
  );
}