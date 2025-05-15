"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Utensils,
  Music,
  Camera,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { Shippori_Mincho } from "next/font/google";
import { createPortal } from "react-dom";

const shipporiMincho = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-shippori-mincho",
});

type Region = {
  id: number;
  name: string;
  description: string;
  image: string;
  highlights: string[];
};

type CulturalHighlight = {
  id: number;
  title: string;
  category: "food" | "festival" | "landmark";
  description: string;
  image: string;
};

type ItineraryDay = {
  day: number;
  title: string;
  description: string;
  activities: string[];
  image: string;
};

type Theme = {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  card: string;
  border: string;
};

type ThemeMode = "light" | "dark";

const themes: Record<ThemeMode, Theme> = {
  light: {
    background: "#f8f7f4",
    foreground: "#1a202c",
    primary: "#d64545",
    secondary: "#2c5282",
    accent: "#c05621",
    muted: "#e2e8f0",
    card: "#ffffff",
    border: "#cbd5e0",
  },
  dark: {
    background: "#1a1a2e",
    foreground: "#f7fafc",
    primary: "#f56565",
    secondary: "#4299e1",
    accent: "#ed8936",
    muted: "#2d3748",
    card: "#2a2a3c",
    border: "#4a5568",
  },
};

const regions: Region[] = [
  {
    id: 1,
    name: "Tokyo",
    description:
      "Experience the perfect blend of traditional culture and cutting-edge technology in Japan's bustling capital.",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
    highlights: [
      "Shibuya Crossing",
      "Tokyo Skytree",
      "Meiji Shrine",
      "Akihabara",
    ],
  },
  {
    id: 2,
    name: "Kyoto",
    description:
      "Discover ancient temples, traditional tea houses, and beautiful gardens in Japan's cultural heart.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
    highlights: [
      "Fushimi Inari Shrine",
      "Kinkaku-ji",
      "Arashiyama Bamboo Grove",
      "Gion District",
    ],
  },
  {
    id: 3,
    name: "Hokkaido",
    description:
      "Explore Japan's northernmost island with its unspoiled nature, hot springs, and world-class skiing.",
    image:
      "https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    highlights: [
      "Sapporo Snow Festival",
      "Furano Flower Fields",
      "Lake Toya",
      "Niseko Ski Resort",
    ],
  },
  {
    id: 4,
    name: "Okinawa",
    description:
      "Relax on pristine beaches and experience the unique culture of Japan's tropical southern islands.",
    image:
      "https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    highlights: [
      "Naha Kokusai Dori",
      "Churaumi Aquarium",
      "Ishigaki Island",
      "Shuri Castle",
    ],
  },
];

const culturalHighlights: CulturalHighlight[] = [
  {
    id: 1,
    title: "Sushi & Sashimi",
    category: "food",
    description:
      "Experience the artistry of Japan's most famous culinary tradition with fresh seafood prepared by master chefs.",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
  },
  {
    id: 2,
    title: "Ramen",
    category: "food",
    description:
      "Savor the regional varieties of this beloved noodle dish, from the miso ramen of Hokkaido to the tonkotsu of Kyushu.",
    image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e",
  },
  {
    id: 3,
    title: "Cherry Blossom Festival",
    category: "festival",
    description:
      "Join locals in celebrating sakura season with hanami parties under blooming cherry trees across the country.",
    image: "https://images.unsplash.com/photo-1522383225653-ed111181a951",
  },
  {
    id: 4,
    title: "Gion Matsuri",
    category: "festival",
    description:
      "Experience Kyoto's largest festival featuring enormous floats, traditional music, and vibrant street celebrations.",
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186",
  },
  {
    id: 5,
    title: "Mount Fuji",
    category: "landmark",
    description:
      "Climb Japan's iconic sacred mountain or admire its perfect symmetry from scenic viewpoints in the surrounding area.",
    image: "https://images.unsplash.com/photo-1546529249-8de036dd3c9a",
  },
  {
    id: 6,
    title: "Hiroshima Peace Memorial",
    category: "landmark",
    description:
      "Visit this UNESCO World Heritage site dedicated to the legacy of peace following the 1945 atomic bombing.",
    image: "https://images.unsplash.com/photo-1565967511849-76a60a516170",
  },
];

const itineraries: ItineraryDay[] = [
  {
    day: 1,
    title: "Tokyo Exploration",
    description: "Begin your journey in the vibrant capital city.",
    activities: [
      "Morning visit to Meiji Shrine",
      "Explore the trendy streets of Harajuku",
      "Evening at Tokyo Skytree for panoramic city views",
    ],
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
  },
  {
    day: 2,
    title: "Cultural Kyoto",
    description: "Immerse yourself in traditional Japanese culture.",
    activities: [
      "Early morning visit to Fushimi Inari Shrine",
      "Tea ceremony experience in Gion",
      "Explore Arashiyama Bamboo Grove",
    ],
    image: "https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f",
  },
  {
    day: 3,
    title: "Natural Wonders",
    description: "Experience Japan's breathtaking natural beauty.",
    activities: [
      "Day trip to Mount Fuji",
      "Relaxing onsen (hot spring) experience",
      "Scenic hike through Japanese countryside",
    ],
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9",
  },
];

interface CulturalHighlightsCarouselProps {
  culturalHighlights: CulturalHighlight[];
  theme: Theme;
  themeMode: ThemeMode;
  shipporiMincho: {
    className: string;
  };
}

const CulturalHighlightsCarousel: React.FC<CulturalHighlightsCarouselProps> = ({
  culturalHighlights,
  theme,
  themeMode,
  shipporiMincho,
}) => {
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
  const highlightRef = useRef<HTMLDivElement>(null);

  const nextHighlight = () => {
    setCurrentHighlightIndex((prev) =>
      prev === culturalHighlights.length - 1 ? 0 : prev + 1
    );
  };

  const prevHighlight = () => {
    setCurrentHighlightIndex((prev) =>
      prev === 0 ? culturalHighlights.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextHighlight();
    }, 5000);
    return () => clearInterval(interval);
  }, [culturalHighlights.length]);

  return (
    <section
      id="culture"
      className="py-20"
      style={{
        backgroundColor: themeMode === "light" ? "#f1f5f9" : "#111827",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className={`${shipporiMincho.className} text-3xl md:text-4xl font-bold mb-4`}
            >
              Experience Japanese{" "}
              <span style={{ color: theme.primary }}>Culture</span>
            </h2>
            <p
              className="text-lg max-w-3xl mx-auto"
              style={{ color: theme.foreground }}
            >
              Immerse yourself in Japan's rich cultural heritage, from exquisite
              cuisine to vibrant festivals and historic landmarks.
            </p>
          </motion.div>
        </div>

        <div className="relative" ref={highlightRef}>
          <div className="flex justify-between absolute top-1/2 transform -translate-y-1/2 left-4 right-4 z-10">
            <button
              onClick={prevHighlight}
              className="p-2 rounded-full shadow-lg cursor-pointer"
              style={{ backgroundColor: theme.card }}
              aria-label="Previous highlight"
            >
              <ChevronLeft size={24} style={{ color: theme.foreground }} />
            </button>
            <button
              onClick={nextHighlight}
              className="p-2 rounded-full shadow-lg cursor-pointer"
              style={{ backgroundColor: theme.card }}
              aria-label="Next highlight"
            >
              <ChevronRight size={24} style={{ color: theme.foreground }} />
            </button>
          </div>

          <div className="overflow-hidden">
            <motion.div
              key={currentHighlightIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col lg:flex-row rounded-xl overflow-hidden shadow-xl"
              style={{ backgroundColor: theme.card }}
            >
              <div className="lg:w-1/2 h-96 relative">
                <img
                  src={
                    culturalHighlights[currentHighlightIndex]?.image ||
                    "/placeholder.svg"
                  }
                  alt={culturalHighlights[currentHighlightIndex]?.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center mb-4">
                  {culturalHighlights[currentHighlightIndex]?.category ===
                    "food" && (
                    <Utensils
                      size={20}
                      className="mr-2"
                      style={{ color: theme.primary }}
                    />
                  )}
                  {culturalHighlights[currentHighlightIndex]?.category ===
                    "festival" && (
                    <Music
                      size={20}
                      className="mr-2"
                      style={{ color: theme.primary }}
                    />
                  )}
                  {culturalHighlights[currentHighlightIndex]?.category ===
                    "landmark" && (
                    <Camera
                      size={20}
                      className="mr-2"
                      style={{ color: theme.primary }}
                    />
                  )}
                  <span
                    className="text-sm font-medium px-3 py-1 rounded-full"
                    style={{
                      backgroundColor:
                        themeMode === "light" ? "#f1f5f9" : "#1f2937",
                      color: theme.primary,
                    }}
                  >
                    {culturalHighlights[currentHighlightIndex]?.category
                      .charAt(0)
                      .toUpperCase() +
                      culturalHighlights[currentHighlightIndex]?.category.slice(
                        1
                      )}
                  </span>
                </div>
                <h3
                  className={`${shipporiMincho.className} text-2xl md:text-3xl font-bold mb-4`}
                  style={{ color: theme.foreground }}
                >
                  {culturalHighlights[currentHighlightIndex]?.title}
                </h3>
                <p className="mb-6" style={{ color: theme.foreground }}>
                  {culturalHighlights[currentHighlightIndex]?.description}
                </p>
                <div className="flex">
                  {culturalHighlights.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentHighlightIndex(index)}
                      className={`w-3 h-3 rounded-full mx-1 transition-colors cursor-pointer`}
                      style={{
                        backgroundColor:
                          currentHighlightIndex === index
                            ? theme.primary
                            : theme.muted,
                      }}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface TravelPlannerModalProps {
  theme: Theme;
  themeMode: ThemeMode;
  shipporiMincho: { className: string };
  closeModal: () => void;

  name: string;
  setName: (name: string) => void;
  nameError: string;
  setNameError: (error: string) => void;

  email: string;
  setEmail: (email: string) => void;
  emailError: string;
  setEmailError: (error: string) => void;

  travelDates: string;
  setTravelDates: (dates: string) => void;
  travelDatesError: string;
  setTravelDatesError: (error: string) => void;

  message: string;
  setMessage: (message: string) => void;
  messageError: string;
  setMessageError: (error: string) => void;

  handleFormSubmit: () => void;
}

const TravelPlannerModal: React.FC<TravelPlannerModalProps> = React.memo(
  ({
    theme,
    themeMode,
    shipporiMincho,
    closeModal,
    name,
    setName,
    nameError,
    setNameError,
    email,
    setEmail,
    emailError,
    setEmailError,
    travelDates,
    setTravelDates,
    travelDatesError,
    setTravelDatesError,
    message,
    setMessage,
    messageError,
    setMessageError,
    handleFormSubmit,
  }) => {
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
      setIsMounted(true);
    }, []);
    
    if (!isMounted) return null;

    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 backdrop-blur-sm"
          style={{
            backgroundColor: `${
              themeMode === "light" ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.7)"
            }`,
          }}
          onClick={closeModal}
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative z-10 w-full max-w-md p-6 rounded-xl shadow-2xl"
          style={{ backgroundColor: theme.card, color: theme.foreground }}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 p-1 rounded-full transition-colors cursor-pointer"
            style={{ color: theme.foreground, backgroundColor: theme.muted }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
          <h2 className={`${shipporiMincho.className} text-2xl font-bold mb-4`}>
            Contact a Travel Specialist
          </h2>
          <p className="mb-6">
            Fill out this form and our Japan travel experts will create a
            personalized itinerary just for you.
          </p>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleFormSubmit();
            }}
          >
            <div>
              <label htmlFor="modal-name" className="block mb-1 font-medium">
                Name
              </label>
              <input
                id="modal-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError("");
                }}
                className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 transition-all ${
                  nameError
                    ? "border-red-500 ring-red-500"
                    : "focus:ring-primary-500"
                }`}
                style={
                  {
                    backgroundColor: theme.background,
                    color: theme.foreground,
                    borderColor: nameError ? "red" : theme.border,
                    "--tw-ring-color": nameError ? "red" : theme.primary,
                  } as React.CSSProperties
                }
                placeholder="Your name"
                aria-invalid={!!nameError}
                aria-describedby={nameError ? "modal-name-error" : undefined}
              />
              {nameError && (
                <p id="modal-name-error" className="mt-1 text-sm text-red-500">
                  {nameError}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="modal-email" className="block mb-1 font-medium">
                Email
              </label>
              <input
                id="modal-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 transition-all ${
                  emailError
                    ? "border-red-500 ring-red-500"
                    : "focus:ring-primary-500"
                }`}
                style={
                  {
                    backgroundColor: theme.background,
                    color: theme.foreground,
                    borderColor: emailError ? "red" : theme.border,
                    "--tw-ring-color": emailError ? "red" : theme.primary,
                  } as React.CSSProperties
                }
                placeholder="your@email.com"
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "modal-email-error" : undefined}
              />
              {emailError && (
                <p id="modal-email-error" className="mt-1 text-sm text-red-500">
                  {emailError}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="modal-dates" className="block mb-1 font-medium">
                Travel Dates
              </label>
              <input
                id="modal-dates"
                type="text"
                value={travelDates}
                onChange={(e) => {
                  setTravelDates(e.target.value);
                  if (travelDatesError) setTravelDatesError("");
                }}
                className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 transition-all ${
                  travelDatesError
                    ? "border-red-500 ring-red-500"
                    : "focus:ring-primary-500"
                }`}
                style={
                  {
                    backgroundColor: theme.background,
                    color: theme.foreground,
                    borderColor: travelDatesError ? "red" : theme.border,
                    "--tw-ring-color": travelDatesError ? "red" : theme.primary,
                  } as React.CSSProperties
                }
                placeholder="MM/YYYY or specific dates"
                aria-invalid={!!travelDatesError}
                aria-describedby={
                  travelDatesError ? "modal-dates-error" : undefined
                }
              />
              {travelDatesError && (
                <p id="modal-dates-error" className="mt-1 text-sm text-red-500">
                  {travelDatesError}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="modal-message" className="block mb-1 font-medium">
                Message
              </label>
              <textarea
                id="modal-message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (messageError) setMessageError("");
                }}
                className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 transition-all ${
                  messageError
                    ? "border-red-500 ring-red-500"
                    : "focus:ring-primary-500"
                }`}
                style={
                  {
                    backgroundColor: theme.background,
                    color: theme.foreground,
                    borderColor: messageError ? "red" : theme.border,
                    "--tw-ring-color": messageError ? "red" : theme.primary,
                  } as React.CSSProperties
                }
                placeholder="Tell us about your dream Japan trip..."
                rows={4}
                aria-invalid={!!messageError}
                aria-describedby={
                  messageError ? "modal-message-error" : undefined
                }
              />
              {messageError && (
                <p
                  id="modal-message-error"
                  className="mt-1 text-sm text-red-500"
                >
                  {messageError}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md font-medium transition-colors cursor-pointer"
              style={{ backgroundColor: theme.primary, color: "white" }}
            >
              Submit Inquiry
            </button>
          </form>
        </motion.div>
      </div>,
      document.body
    );
  }
);
TravelPlannerModal.displayName = "TravelPlannerModal";

export default function JapanTourism() {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentItineraryDay, setCurrentItineraryDay] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [modalName, setModalName] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  const [modalTravelDates, setModalTravelDates] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const [modalNameError, setModalNameError] = useState("");
  const [modalEmailError, setModalEmailError] = useState("");
  const [modalTravelDatesError, setModalTravelDatesError] = useState("");
  const [modalMessageError, setModalMessageError] = useState("");

  const theme = themes[themeMode];
  const shipporiMinchoFont = shipporiMincho;

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const changeItineraryDay = (index: number) => {
    setCurrentItineraryDay(index);
    setShowModal(false);
    document.body.style.overflow = "auto";
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Email address is required.");
      return;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError("");
    setEmail("");
    setToastMessage("Thanks for subscribing! We'll send you travel updates.");
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const openModal = () => {
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
    resetModalFormFields();
  };

  const resetModalFormFields = () => {
    setModalName("");
    setModalEmail("");
    setModalTravelDates("");
    setModalMessage("");
    setModalNameError("");
    setModalEmailError("");
    setModalTravelDatesError("");
    setModalMessageError("");
  };

  const handleModalFormSubmit = () => {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!modalName.trim()) {
      setModalNameError("Name is required.");
      isValid = false;
    } else {
      setModalNameError("");
    }

    if (!modalEmail.trim()) {
      setModalEmailError("Email is required.");
      isValid = false;
    } else if (!emailRegex.test(modalEmail)) {
      setModalEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setModalEmailError("");
    }

    if (!modalTravelDates.trim()) {
      setModalTravelDatesError("Travel dates are required.");
      isValid = false;
    } else {
      setModalTravelDatesError("");
    }

    if (!modalMessage.trim()) {
      setModalMessageError("Message is required.");
      isValid = false;
    } else {
      setModalMessageError("");
    }

    if (isValid) {
      console.log("Modal Form Submitted:", {
        name: modalName,
        email: modalEmail,
        travelDates: modalTravelDates,
        message: modalMessage,
      });
      closeModal();
      setToastMessage("Thanks for your inquiry! We'll be in touch soon.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      resetModalFormFields();
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const CherryBlossomAnimation = () => {
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
      setIsMounted(true);
    }, []);
    
    if (!isMounted) return null;
    
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 rounded-full"
            style={{
              backgroundColor: themeMode === "light" ? "#ffd7e9" : "#ff9dc4",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0,
            }}
            animate={{
              y: [0, 500 + Math.random() * 200],
              x: [0, 100 - Math.random() * 200],
              opacity: [0, 0.7, 0],
              rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>
    );
  };

  const Toast = () => {
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
      setIsMounted(true);
    }, []);
    
    if (!isMounted || !showToast) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg"
        style={{
          backgroundColor: theme.card,
          color: theme.foreground,
          borderLeft: `4px solid ${theme.primary}`,
        }}
      >
        {toastMessage}
      </motion.div>
    );
  };

  return (
    <div
      className={`${shipporiMincho.variable} font-sans min-h-screen transition-colors duration-300`}
      style={{ backgroundColor: theme.background, color: theme.foreground }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{
          backgroundColor:
            themeMode === "light"
              ? "rgba(248, 247, 244, 0.8)"
              : "rgba(26, 26, 46, 0.8)",
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className={`${shipporiMincho.className} text-2xl font-bold`}>
              <span style={{ color: theme.primary }}>日本</span>
              <span className="ml-2">Discover Japan</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("regions")}
              className="font-medium hover:underline underline-offset-4 decoration-2 transition-all cursor-pointer"
              style={{ textDecorationColor: theme.primary }}
            >
              Regions
            </button>
            <button
              onClick={() => scrollToSection("culture")}
              className="font-medium hover:underline underline-offset-4 decoration-2 transition-all cursor-pointer"
              style={{ textDecorationColor: theme.primary }}
            >
              Culture
            </button>
            <button
              onClick={() => scrollToSection("itinerary")}
              className="font-medium hover:underline underline-offset-4 decoration-2 transition-all cursor-pointer"
              style={{ textDecorationColor: theme.primary }}
            >
              Itineraries
            </button>
            <button
              onClick={openModal}
              className="py-2 px-4 rounded-md font-medium transition-colors cursor-pointer"
              style={{ backgroundColor: theme.primary, color: "white" }}
            >
              Plan Your Trip
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full transition-colors cursor-pointer"
              style={{ backgroundColor: theme.muted }}
              aria-label="Toggle theme"
            >
              {themeMode === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 mr-2 rounded-full transition-colors cursor-pointer"
              style={{ backgroundColor: theme.muted }}
              aria-label="Toggle theme"
            >
              {themeMode === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full transition-colors cursor-pointer"
              style={{ backgroundColor: theme.muted }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
              style={{ backgroundColor: theme.background }}
            >
              <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                <button
                  onClick={() => scrollToSection("regions")}
                  className="py-2 font-medium hover:underline underline-offset-4 decoration-2 transition-all cursor-pointer"
                  style={{ textDecorationColor: theme.primary }}
                >
                  Regions
                </button>
                <button
                  onClick={() => scrollToSection("culture")}
                  className="py-2 font-medium hover:underline underline-offset-4 decoration-2 transition-all cursor-pointer"
                  style={{ textDecorationColor: theme.primary }}
                >
                  Culture
                </button>
                <button
                  onClick={() => scrollToSection("itinerary")}
                  className="py-2 font-medium hover:underline underline-offset-4 decoration-2 transition-all cursor-pointer"
                  style={{ textDecorationColor: theme.primary }}
                >
                  Itineraries
                </button>
                <button
                  onClick={() => {
                    openModal();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 px-4 rounded-md font-medium transition-colors cursor-pointer text-center"
                  style={{ backgroundColor: theme.primary, color: "white" }}
                >
                  Plan Your Trip
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e"
            alt="Japan landscape with temple and cherry blossoms"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundColor:
                themeMode === "light"
                  ? "rgba(0, 0, 0, 0.75)"
                  : "rgba(0, 0, 0, 0.8)",
            }}
          />
        </div>

        <CherryBlossomAnimation />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              className={`${shipporiMincho.className} text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6`}
            >
              Experience the Beauty of{" "}
              <span style={{ color: theme.primary }}>Japan</span>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
              Discover ancient traditions, breathtaking landscapes, and
              unforgettable experiences in the Land of the Rising Sun
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => scrollToSection("regions")}
                className="py-3 px-8 rounded-md font-medium text-lg transition-colors cursor-pointer"
                style={{ backgroundColor: theme.primary, color: "white" }}
              >
                Explore Regions
              </button>
              <button
                onClick={openModal}
                className="py-3 px-8 rounded-md font-medium text-lg transition-colors cursor-pointer"
                style={{
                  backgroundColor: "transparent",
                  color: "white",
                  border: "2px solid white",
                }}
              >
                Plan Your Trip
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={() => scrollToSection("regions")}
        >
          <div className="flex flex-col items-center text-white">
            <p className="mb-2">Scroll to explore</p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              <ChevronDown size={24} />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Featured Regions */}
      <section id="regions" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className={`${shipporiMincho.className} text-3xl md:text-4xl font-bold mb-4`}
              >
                Discover Japan's{" "}
                <span style={{ color: theme.primary }}>Diverse Regions</span>
              </h2>
              <p
                className="text-lg max-w-3xl mx-auto"
                style={{ color: theme.foreground }}
              >
                From bustling metropolises to serene countryside, each region of
                Japan offers unique experiences and unforgettable memories.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {regions.map((region, index) => (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group rounded-xl overflow-hidden shadow-lg"
                style={{
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                }}
                whileHover={{ y: -8 }}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={region.image || "/placeholder.svg"}
                    alt={region.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3
                      className={`${shipporiMincho.className} text-2xl font-bold text-white`}
                    >
                      {region.name}
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="mb-4" style={{ color: theme.foreground }}>
                    {region.description}
                  </p>
                  <div>
                    <h4
                      className="font-medium mb-2"
                      style={{ color: theme.primary }}
                    >
                      Highlights:
                    </h4>
                    <ul className="space-y-1">
                      {region.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start">
                          <MapPin
                            size={16}
                            className="mr-2 mt-1 flex-shrink-0"
                            style={{ color: theme.secondary }}
                          />
                          <span style={{ color: theme.foreground }}>
                            {highlight}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Highlights Carousel */}
      <CulturalHighlightsCarousel
        culturalHighlights={culturalHighlights}
        theme={theme}
        themeMode={themeMode}
        shipporiMincho={shipporiMincho}
      />

      {/* Itinerary Section */}
      <section id="itinerary" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className={`${shipporiMincho.className} text-3xl md:text-4xl font-bold mb-4`}
              >
                Plan Your <span style={{ color: theme.primary }}>Journey</span>
              </h2>
              <p
                className="text-lg max-w-3xl mx-auto"
                style={{ color: theme.foreground }}
              >
                Explore our suggested itineraries to make the most of your time
                in Japan, from bustling cities to tranquil countryside.
              </p>
            </motion.div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3">
              <div
                className="rounded-xl overflow-hidden shadow-lg"
                style={{
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                }}
              >
                <div className="p-6">
                  <h3
                    className={`${shipporiMincho.className} text-2xl font-bold mb-6`}
                    style={{ color: theme.foreground }}
                  >
                    3-Day Highlights Tour
                  </h3>
                  <div className="space-y-4">
                    {itineraries.map((day, index) => (
                      <button
                        key={day.day}
                        onClick={() => changeItineraryDay(index)}
                        className={`w-full text-left p-4 rounded-lg transition-colors cursor-pointer flex items-center`}
                        style={{
                          backgroundColor:
                            currentItineraryDay === index
                              ? theme.primary
                              : theme.muted,
                          color:
                            currentItineraryDay === index
                              ? "white"
                              : theme.foreground,
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                          style={{
                            backgroundColor:
                              currentItineraryDay === index
                                ? "white"
                                : theme.primary,
                            color:
                              currentItineraryDay === index
                                ? theme.primary
                                : "white",
                          }}
                        >
                          <span className="font-bold">{day.day}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{day.title}</h4>
                          <p
                            className={`text-sm ${
                              currentItineraryDay === index
                                ? "text-white/80"
                                : ""
                            }`}
                          >
                            {day.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={openModal}
                      className="w-full py-3 px-4 rounded-md font-medium transition-colors cursor-pointer flex items-center justify-center"
                      style={{
                        backgroundColor: "transparent",
                        color: theme.primary,
                        border: `2px solid ${theme.primary}`,
                      }}
                    >
                      <span>Customize This Itinerary</span>
                      <ArrowRight size={18} className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3">
              <motion.div
                key={currentItineraryDay}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl overflow-hidden shadow-lg h-full"
                style={{
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                }}
              >
                <div className="relative h-64 md:h-80">
                  <img
                    src={
                      itineraries[currentItineraryDay].image ||
                      "/placeholder.svg"
                    }
                    alt={itineraries[currentItineraryDay].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-2"
                      style={{ backgroundColor: theme.primary, color: "white" }}
                    >
                      Day {itineraries[currentItineraryDay].day}
                    </div>
                    <h3
                      className={`${shipporiMincho.className} text-2xl md:text-3xl font-bold text-white`}
                    >
                      {itineraries[currentItineraryDay].title}
                    </h3>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <p
                    className="mb-6 text-lg"
                    style={{ color: theme.foreground }}
                  >
                    {itineraries[currentItineraryDay].description}
                  </p>
                  <div>
                    <h4
                      className="font-medium mb-4 text-lg"
                      style={{ color: theme.primary }}
                    >
                      Today's Activities:
                    </h4>
                    <ul className="space-y-4">
                      {itineraries[currentItineraryDay].activities.map(
                        (activity, i) => (
                          <motion.li
                            key={i}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                          >
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1"
                              style={{
                                backgroundColor: theme.secondary,
                                color: "white",
                              }}
                            >
                              <span className="font-bold">{i + 1}</span>
                            </div>
                            <div>
                              <p
                                className="text-lg"
                                style={{ color: theme.foreground }}
                              >
                                {activity}
                              </p>
                            </div>
                          </motion.li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          backgroundColor: themeMode === "light" ? "#f1f5f9" : "#111827",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="cherry-blossom"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M20 1C21 5 25 9 29 10C25 11 21 15 20 19C19 15 15 11 11 10C15 9 19 5 20 1Z"
                  fill={themeMode === "light" ? theme.primary : theme.secondary}
                />
              </pattern>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#cherry-blossom)"
            />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className={`${shipporiMincho.className} text-3xl md:text-4xl font-bold mb-4`}
              >
                Stay Updated on{" "}
                <span style={{ color: theme.primary }}>Japan Travel</span>
              </h2>
              <p className="text-lg mb-8" style={{ color: theme.foreground }}>
                Subscribe to our newsletter for travel tips, seasonal
                highlights, and exclusive offers.
              </p>
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      placeholder="Your email address"
                      className={`w-full p-3 rounded-md border focus:outline-none focus:ring-2 transition-all ${
                        emailError
                          ? "border-red-500 ring-red-500"
                          : "focus:ring-primary-500"
                      }`}
                      style={
                        {
                          backgroundColor: theme.background,
                          color: theme.foreground,
                          borderColor: emailError ? "red" : theme.border,
                          "--tw-ring-color": emailError ? "red" : theme.primary,
                        } as React.CSSProperties
                      }
                      aria-invalid={!!emailError}
                      aria-describedby={
                        emailError ? "newsletter-email-error" : undefined
                      }
                    />
                    {emailError && (
                      <p
                        id="newsletter-email-error"
                        className="mt-1 text-sm text-red-500 text-left"
                      >
                        {emailError}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="py-3 px-6 rounded-md font-medium transition-colors cursor-pointer"
                    style={{ backgroundColor: theme.primary, color: "white" }}
                  >
                    Subscribe
                  </button>
                </div>
              </form>
              <p className="mt-4 text-sm" style={{ color: theme.foreground }}>
                We respect your privacy and will never share your information.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t" style={{ borderColor: theme.border }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto">
            <div>
              <h3
                className={`${shipporiMincho.className} text-xl font-bold mb-4`}
              >
                <span style={{ color: theme.primary }}>日本</span>
                <span className="ml-2">Discover Japan</span>
              </h3>
              <p className="mb-4" style={{ color: theme.foreground }}>
                Your gateway to authentic Japanese experiences and unforgettable
                adventures.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="p-2 rounded-full transition-colors cursor-pointer"
                  style={{ backgroundColor: theme.muted }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full transition-colors cursor-pointer"
                  style={{ backgroundColor: theme.muted }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full transition-colors cursor-pointer"
                  style={{ backgroundColor: theme.muted }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4
                className="font-bold mb-4"
                style={{ color: theme.foreground }}
              >
                Contact Us
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span style={{ color: theme.foreground }}>
                    info@discoverjapan.com
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span style={{ color: theme.foreground }}>
                    +81 3-1234-5678
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span style={{ color: theme.foreground }}>
                    1-1-1 Chiyoda, Tokyo, Japan
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div
            className="mt-12 pt-8 border-t"
            style={{ borderColor: theme.border }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p
                className="text-sm mb-4 md:mb-0"
                style={{ color: theme.foreground }}
              >
                © {new Date().getFullYear()} Discover Japan. All rights
                reserved.
              </p>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="text-sm hover:underline cursor-pointer"
                  style={{ color: theme.foreground }}
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-sm hover:underline cursor-pointer"
                  style={{ color: theme.foreground }}
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-sm hover:underline cursor-pointer"
                  style={{ color: theme.foreground }}
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showModal && (
          <TravelPlannerModal
            theme={theme}
            themeMode={themeMode}
            shipporiMincho={shipporiMincho}
            closeModal={closeModal}
            name={modalName}
            setName={setModalName}
            nameError={modalNameError}
            setNameError={setModalNameError}
            email={modalEmail}
            setEmail={setModalEmail}
            emailError={modalEmailError}
            setEmailError={setModalEmailError}
            travelDates={modalTravelDates}
            setTravelDates={setModalTravelDates}
            travelDatesError={modalTravelDatesError}
            setTravelDatesError={setModalTravelDatesError}
            message={modalMessage}
            setMessage={setModalMessage}
            messageError={modalMessageError}
            setMessageError={setModalMessageError}
            handleFormSubmit={handleModalFormSubmit}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>{showToast && <Toast />}</AnimatePresence>
    </div>
  );
}