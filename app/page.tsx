"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Avatar from "@radix-ui/react-avatar";
import * as Form from "@radix-ui/react-form";
import * as Tabs from "@radix-ui/react-tabs";
import {
  Heart,
  MessageSquare,
  Moon,
  Sun,
  Menu,
  X,
  Instagram,
  Twitter,
  Github,
  Linkedin,
  Mail,
  Palette,
} from "lucide-react";
import { FaHeart } from "react-icons/fa";

// Types
interface ArtworkType {
  id: number;
  title: string;
  description: string;
  image: string;
  likes: number;
  liked: boolean;
  comments: CommentType[];
  category: string;
}

interface CommentType {
  id: number;
  author: string;
  avatar: string;
  text: string;
  date: string;
}

// Custom cursor component
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="custom-cursor hidden md:block"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: "none",
        mixBlendMode: "difference",
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    >
      <div className="cursor-dot w-8 h-8 rounded-full border-2 border-white" />
    </motion.div>
  );
};

// Main component
export default function ArtGallery() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkType | null>(
    null
  );
  const [newComment, setNewComment] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [artworks, setArtworks] = useState<ArtworkType[]>([
    {
      id: 1,
      title: "Ethereal Dreams",
      description:
        "A surreal landscape that explores the boundary between dreams and reality, featuring floating islands and luminescent flora.",
      image:
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2145&q=80",
      likes: 124,
      liked: false,
      comments: [
        {
          id: 1,
          author: "Alex Chen",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          text: "The use of color in this piece is absolutely mesmerizing. I can feel myself getting lost in this dreamscape.",
          date: "2 days ago",
        },
        {
          id: 2,
          author: "Maya Johnson",
          avatar: "https://randomuser.me/api/portraits/women/44.jpg",
          text: "This reminds me of the landscapes I see in my own dreams. Beautiful work!",
          date: "1 week ago",
        },
      ],
      category: "digital",
    },
    {
      id: 2,
      title: "Urban Solitude",
      description:
        "A contemplative piece depicting the paradoxical isolation one can feel in the midst of a bustling city.",
      image:
        "data:image/jpeg;base64,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",
      likes: 89,
      liked: false,
      comments: [
        {
          id: 1,
          author: "Jamie Smith",
          avatar: "https://randomuser.me/api/portraits/women/17.jpg",
          text: "This perfectly captures how I feel living in the city. Surrounded by people yet somehow alone.",
          date: "3 days ago",
        },
      ],
      category: "photography",
    },
    {
      id: 3,
      title: "Chromatic Harmony",
      description:
        "An abstract exploration of color relationships and emotional resonance through geometric forms.",
      image:
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      likes: 156,
      liked: false,
      comments: [
        {
          id: 1,
          author: "Taylor Wong",
          avatar: "https://randomuser.me/api/portraits/men/62.jpg",
          text: "The balance of colors here is extraordinary. I can't stop looking at it!",
          date: "5 days ago",
        },
        {
          id: 2,
          author: "Jordan Lee",
          avatar: "https://randomuser.me/api/portraits/women/63.jpg",
          text: "I'd love to know more about your process for creating these geometric patterns.",
          date: "1 week ago",
        },
      ],
      category: "abstract",
    },
    {
      id: 4,
      title: "Whispers of Nature",
      description:
        "A delicate watercolor capturing the ephemeral beauty of a forest after rainfall.",
      image:
        "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      likes: 112,
      liked: false,
      comments: [
        {
          id: 1,
          author: "Robin Garcia",
          avatar: "https://randomuser.me/api/portraits/women/26.jpg",
          text: "I can almost smell the petrichor in this painting. Wonderful work!",
          date: "1 day ago",
        },
      ],
      category: "traditional",
    },
    {
      id: 5,
      title: "Digital Dystopia",
      description:
        "A cyberpunk-inspired vision of a future where technology and humanity have become inseparably intertwined.",
      image:
        "https://images.unsplash.com/photo-1515266591878-f93e32bc5937?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2187&q=80",
      likes: 203,
      liked: false,
      comments: [
        {
          id: 1,
          author: "Casey Kim",
          avatar: "https://randomuser.me/api/portraits/men/22.jpg",
          text: "The attention to detail in this piece is incredible. I keep noticing new elements every time I look.",
          date: "4 days ago",
        },
        {
          id: 2,
          author: "Riley Johnson",
          avatar: "https://randomuser.me/api/portraits/women/28.jpg",
          text: "This gives me major Blade Runner vibes. Love the atmosphere you've created!",
          date: "1 week ago",
        },
      ],
      category: "digital",
    },
    {
      id: 6,
      title: "Sculptural Reflections",
      description:
        "A photographic study of light and shadow playing across modernist architectural forms.",
      image:
        "https://images.unsplash.com/photo-1518998053901-5348d3961a04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      likes: 78,
      liked: false,
      comments: [
        {
          id: 1,
          author: "Sam Rivera",
          avatar: "https://randomuser.me/api/portraits/men/42.jpg",
          text: "The composition here is masterful. The way you've captured light is truly special.",
          date: "2 days ago",
        },
      ],
      category: "photography",
    },
  ]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Filter artworks by category
  const filteredArtworks =
    activeCategory === "all"
      ? artworks
      : artworks.filter((artwork) => artwork.category === activeCategory);

  // Handle like functionality
  const handleLike = (id: number) => {
    // Update artworks state
    setArtworks(
      artworks.map((artwork) => {
        if (artwork.id === id) {
          return {
            ...artwork,
            likes: artwork.liked ? artwork.likes - 1 : artwork.likes + 1,
            liked: !artwork.liked,
          };
        }
        return artwork;
      })
    );

    // If we're viewing the artwork in the modal, update the selectedArtwork state too
    if (selectedArtwork && selectedArtwork.id === id) {
      setSelectedArtwork({
        ...selectedArtwork,
        likes: selectedArtwork.liked
          ? selectedArtwork.likes - 1
          : selectedArtwork.likes + 1,
        liked: !selectedArtwork.liked,
      });
    }
  };

  // Handle comment submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArtwork || !newComment.trim()) return;

    const newCommentObj = {
      id: Date.now(),
      author: "You",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      text: newComment,
      date: "Just now",
    };

    setArtworks(
      artworks.map((artwork) => {
        if (artwork.id === selectedArtwork.id) {
          return {
            ...artwork,
            comments: [newCommentObj, ...artwork.comments],
          };
        }
        return artwork;
      })
    );

    setSelectedArtwork({
      ...selectedArtwork,
      comments: [newCommentObj, ...selectedArtwork.comments],
    });

    setNewComment("");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // Scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div
      className={`min-h-screen font-['Playfair_Display'] ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      } transition-colors duration-300`}
      style={{
        fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
      }}
    >
      {/* Google Fonts Import */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap");

        body {
          font-family: "Playfair Display", "Cormorant Garamond", serif;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: "Cormorant Garamond", serif;
          font-weight: 700;
        }

        .font-sans {
          font-family: "Playfair Display", "Cormorant Garamond", serif;
        }
      `}</style>

      <CustomCursor />

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 ${
          darkMode
            ? "bg-gradient-to-r from-teal-900/90 via-gray-900/90 to-blue-900/90 text-gray-100"
            : "bg-gradient-to-r from-rose-100/90 via-purple-100/90 to-indigo-100/90 text-gray-900"
        } backdrop-blur-md transition-colors duration-300 shadow-lg`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="mr-3 text-purple-500"
              >
                <Palette size={28} />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold italic tracking-wider bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  ArtVista
                </h1>
                <p className="text-xs tracking-widest opacity-70 -mt-1">
                  GALLERY & EXPERIENCE
                </p>
              </div>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("home")}
                className="font-medium hover:text-purple-500 transition-colors relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("gallery")}
                className="font-medium hover:text-purple-500 transition-colors relative group"
              >
                Gallery
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("about")}
                className="font-medium hover:text-purple-500 transition-colors relative group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("contact")}
                className="font-medium hover:text-purple-500 transition-colors relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${
                  darkMode
                    ? "bg-teal-800 hover:bg-teal-700"
                    : "bg-purple-200 hover:bg-purple-300"
                } transition-colors`}
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>
            </div>

            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden ${
                darkMode
                  ? "bg-gradient-to-b from-purple-900 to-indigo-900"
                  : "bg-gradient-to-b from-rose-100 to-indigo-100"
              } transition-colors duration-300`}
            >
              <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                <motion.a
                  whileTap={{ scale: 0.95 }}
                  href="#home"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 font-medium hover:text-purple-500 transition-colors flex items-center cursor-pointer"
                >
                  <span className="mr-2 opacity-70"></span> Home
                </motion.a>
                <motion.a
                  whileTap={{ scale: 0.95 }}
                  href="#gallery"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 font-medium hover:text-purple-500 transition-colors flex items-center cursor-pointer"
                >
                  <span className="mr-2 opacity-70"></span> Gallery
                </motion.a>
                <motion.a
                  whileTap={{ scale: 0.95 }}
                  href="#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 font-medium hover:text-purple-500 transition-colors flex items-center cursor-pointer"
                >
                  <span className="mr-2 opacity-70"></span> About
                </motion.a>
                <motion.a
                  whileTap={{ scale: 0.95 }}
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 font-medium hover:text-purple-500 transition-colors flex items-center cursor-pointer"
                >
                  <span className="mr-2 opacity-70"></span> Contact
                </motion.a>
                <motion.a
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDarkMode();
                  }}
                  className="py-2 flex items-center font-medium hover:text-purple-500 transition-colors cursor-pointer"
                >
                  {darkMode ? (
                    <>
                      <Sun size={18} className="mr-2" /> Light Mode
                    </>
                  ) : (
                    <>
                      <Moon size={18} className="mr-2" /> Dark Mode
                    </>
                  )}
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className={`pt-32 pb-20 ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 via-teal-950 to-blue-950"
            : "bg-gradient-to-br from-rose-100 via-purple-100 to-indigo-100"
        } transition-colors duration-300`}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="mb-6 inline-block"
            >
              <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"></div>
              <p className="text-sm uppercase tracking-[0.3em] text-purple-600 dark:text-purple-400">
                Art Beyond Boundaries
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              <span className="block">Experience Art in a</span>
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                New Dimension
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className={`text-lg md:text-xl mb-8 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Immerse yourself in a curated collection of visual artistry where
              each piece tells a story and invites your participation.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("gallery")}
                className={`px-8 py-3 rounded-full font-medium ${
                  darkMode
                    ? "bg-gradient-to-r from-teal-600 to-blue-500 hover:from-teal-700 hover:to-blue-600 text-white"
                    : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
                } transition-colors shadow-lg`}
              >
                Explore Gallery
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("about")}
                className={`px-8 py-3 rounded-full font-medium ${
                  darkMode
                    ? "bg-transparent border border-purple-500 text-teal-400 hover:bg-purple-900/20"
                    : "bg-transparent border border-purple-500 text-purple-700 hover:bg-purple-50"
                } transition-colors`}
              >
                About the Artist
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div
              className={`relative rounded-xl overflow-hidden shadow-2xl ${
                darkMode ? "shadow-purple-500/20" : "shadow-purple-300/50"
              }`}
            >
              <img
                src="https://images.unsplash.com/photo-1577720643272-265f09367456?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80"
                alt="Art Gallery Exhibition"
                className="w-full h-auto"
              />
              <div
                className={`absolute inset-0 ${
                  darkMode
                    ? "bg-gradient-to-t from-purple-950/90 to-transparent"
                    : "bg-gradient-to-t from-purple-900/70 to-transparent"
                }`}
              ></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-sm uppercase tracking-wider mb-2 text-purple-300">
                  Featured Exhibition
                </p>
                <h2
                  className="text-2xl md:text-3xl font-bold"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Chromatic Visions: A Journey Through Color and Form
                </h2>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-32 left-10 w-24 h-24 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-pink-500/10 blur-3xl"></div>
      </section>

      {/* Gallery Section */}
      <section
        id="gallery"
        className={`py-10 ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 via-purple-950/30 to-gray-900"
            : "bg-gradient-to-br from-white via-purple-50 to-white"
        } transition-colors duration-300 relative overflow-hidden`}
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl"></div>
          <div className="absolute bottom-40 right-20 w-80 h-80 rounded-full bg-pink-500/5 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"></div>
            <h2
              className="text-3xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Gallery
            </h2>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Explore a diverse collection of artworks. Click on any piece to
              experience it in detail.
            </p>
          </motion.div>

          {/* Category Tabs */}
          <Tabs.Root
            defaultValue="all"
            onValueChange={setActiveCategory}
            className="mb-12"
          >
            <Tabs.List className="flex justify-center flex-wrap gap-2 mb-8">
              <Tabs.Trigger
                value="all"
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === "all"
                    ? darkMode
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                      : "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                    : darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All Works
              </Tabs.Trigger>
              <Tabs.Trigger
                value="digital"
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === "digital"
                    ? darkMode
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                      : "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                    : darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Digital
              </Tabs.Trigger>
              <Tabs.Trigger
                value="traditional"
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === "traditional"
                    ? darkMode
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                      : "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                    : darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Traditional
              </Tabs.Trigger>
              <Tabs.Trigger
                value="photography"
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === "photography"
                    ? darkMode
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                      : "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                    : darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Photography
              </Tabs.Trigger>
              <Tabs.Trigger
                value="abstract"
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === "abstract"
                    ? darkMode
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                      : "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                    : darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Abstract
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="all" className="outline-none">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredArtworks.map((artwork) => (
                  <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    setSelectedArtwork={setSelectedArtwork}
                    handleLike={handleLike}
                    darkMode={darkMode}
                    variants={itemVariants}
                  />
                ))}
              </motion.div>
            </Tabs.Content>

            <Tabs.Content value="digital" className="outline-none">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredArtworks.map((artwork) => (
                  <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    setSelectedArtwork={setSelectedArtwork}
                    handleLike={handleLike}
                    darkMode={darkMode}
                    variants={itemVariants}
                  />
                ))}
              </motion.div>
            </Tabs.Content>

            <Tabs.Content value="traditional" className="outline-none">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredArtworks.map((artwork) => (
                  <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    setSelectedArtwork={setSelectedArtwork}
                    handleLike={handleLike}
                    darkMode={darkMode}
                    variants={itemVariants}
                  />
                ))}
              </motion.div>
            </Tabs.Content>

            <Tabs.Content value="photography" className="outline-none">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredArtworks.map((artwork) => (
                  <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    setSelectedArtwork={setSelectedArtwork}
                    handleLike={handleLike}
                    darkMode={darkMode}
                    variants={itemVariants}
                  />
                ))}
              </motion.div>
            </Tabs.Content>

            <Tabs.Content value="abstract" className="outline-none">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredArtworks.map((artwork) => (
                  <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    setSelectedArtwork={setSelectedArtwork}
                    handleLike={handleLike}
                    darkMode={darkMode}
                    variants={itemVariants}
                  />
                ))}
              </motion.div>
            </Tabs.Content>
          </Tabs.Root>
        </div>

        {/* Artwork Detail Modal */}
        <Dialog.Root
          open={!!selectedArtwork}
          onOpenChange={(open) => !open && setSelectedArtwork(null)}
        >
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <Dialog.Content
              className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-4xl max-h-[90vh] overflow-auto rounded-xl shadow-xl z-50 ${
                darkMode
                  ? "bg-gray-800 text-gray-100"
                  : "bg-white text-gray-900"
              } p-0`}
            >
              {selectedArtwork && (
                <div className="flex flex-col">
                  <Dialog.Title className="sr-only">
                    {selectedArtwork.title}
                  </Dialog.Title>
                  <div className="relative">
                    <img
                      src={selectedArtwork.image || "/placeholder.svg"}
                      alt={selectedArtwork.title}
                      className="w-full h-auto object-cover max-h-[60vh]"
                    />
                    <Dialog.Close className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                      <X size={20} />
                    </Dialog.Close>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3
                          className="text-2xl font-bold"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                          {selectedArtwork.title}
                        </h3>
                        <p
                          className={`mt-1 ${
                            darkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {selectedArtwork.description}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(selectedArtwork.id);
                          }}
                          className="flex items-center gap-1 mr-4"
                          aria-label={selectedArtwork.liked ? "Unlike" : "Like"}
                        >
                          {selectedArtwork.liked ? (
                            <FaHeart className="text-red-500" size={18} />
                          ) : (
                            <Heart size={18} />
                          )}
                          <span>{selectedArtwork.likes}</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            const commentSection =
                              document.getElementById("artwork-comments");
                            commentSection?.scrollIntoView({
                              behavior: "smooth",
                            });
                          }}
                          className="flex items-center gap-1"
                          aria-label="View comments"
                        >
                          <MessageSquare size={18} />
                          <span>{selectedArtwork.comments.length}</span>
                        </motion.button>
                      </div>
                    </div>

                    <div id="artwork-comments" className="mt-6">
                      <h4 className="text-lg font-semibold mb-4">Comments</h4>

                      <Form.Root
                        onSubmit={handleCommentSubmit}
                        className="mb-6"
                      >
                        <div className="flex gap-3 items-end">
                          <Form.Field name="comment" className="flex-1">
                            <Form.Control asChild>
                              <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your thoughts..."
                                className={`w-full p-3 rounded-lg ${
                                  darkMode
                                    ? "bg-gray-700 border-gray-600 focus:border-purple-500"
                                    : "bg-gray-50 border-gray-200 focus:border-purple-500"
                                } border focus:ring-1 focus:ring-purple-500 outline-none transition-colors`}
                                rows={2}
                              />
                            </Form.Control>
                          </Form.Field>
                          <Form.Submit asChild>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`px-4 py-2 rounded-lg font-medium mb-2 ${
                                darkMode
                                  ? "bg-gradient-to-r from-teal-600 to-blue-500 hover:from-teal-700 hover:to-blue-600 text-white"
                                  : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
                              } transition-colors self-end`}
                              disabled={!newComment.trim()}
                            >
                              Post
                            </motion.button>
                          </Form.Submit>
                        </div>
                      </Form.Root>

                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                        {selectedArtwork.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className={`p-4 rounded-lg ${
                              darkMode ? "bg-gray-700" : "bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center mb-2">
                              <Avatar.Root className="w-8 h-8 rounded-full overflow-hidden mr-2">
                                <Avatar.Image
                                  src={comment.avatar}
                                  alt={comment.author}
                                />
                                <Avatar.Fallback className="bg-purple-200 text-purple-800 flex items-center justify-center text-sm font-medium">
                                  {comment.author.charAt(0)}
                                </Avatar.Fallback>
                              </Avatar.Root>
                              <div>
                                <p className="font-medium text-sm">
                                  {comment.author}
                                </p>
                                <p
                                  className={`text-xs ${
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  {comment.date}
                                </p>
                              </div>
                            </div>
                            <p
                              className={`text-sm ${
                                darkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {comment.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </section>

      {/* About Section */}
      <section
        id="about"
        className={`py-20 ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 via-teal-950 to-blue-950"
            : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
        } transition-colors duration-300 relative overflow-hidden`}
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl"></div>
          <div className="absolute bottom-40 left-20 w-80 h-80 rounded-full bg-pink-500/5 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div
                  className={`relative rounded-xl overflow-hidden shadow-xl ${
                    darkMode ? "shadow-purple-500/20" : "shadow-purple-300/50"
                  }`}
                >
                  <img
                    src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80"
                    alt="Artist in Studio"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent"></div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mb-6"></div>
                <h2
                  className="text-3xl md:text-4xl font-bold mb-6"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  About the Artist
                </h2>
                <div
                  className={`space-y-4 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <p>
                    I am a visual artist exploring the boundaries between
                    traditional and digital mediums. My work seeks to create
                    immersive experiences that invite viewers to engage with art
                    in new and meaningful ways.
                  </p>
                  <p>
                    With a background in both fine arts and digital design, I
                    blend techniques from various disciplines to create pieces
                    that challenge perceptions and evoke emotional responses.
                  </p>
                  <p>
                    Each artwork is a journey—both for me as the creator and for
                    you as the viewer. I believe that art should be experienced,
                    not just observed, which is why I've designed this platform
                    to facilitate a more interactive relationship with my work.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Tooltip.Provider>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <motion.a
                          href="https://instagram.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1, y: -5 }}
                          whileTap={{ scale: 0.9 }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            darkMode
                              ? "bg-gradient-to-br from-teal-800 to-blue-900 hover:from-teal-700 hover:to-blue-800"
                              : "bg-gradient-to-br from-purple-100 to-indigo-200 hover:from-purple-200 hover:to-indigo-300"
                          } shadow-md transition-colors`}
                        >
                          <Instagram size={18} />
                        </motion.a>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className={`px-3 py-1 rounded text-sm ${
                            darkMode
                              ? "bg-gray-700 text-gray-100"
                              : "bg-gray-800 text-white"
                          }`}
                          sideOffset={5}
                        >
                          Instagram
                          <Tooltip.Arrow
                            className={
                              darkMode ? "fill-gray-700" : "fill-gray-800"
                            }
                          />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </Tooltip.Provider>

                  <Tooltip.Provider>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <motion.a
                          href="https://twitter.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1, y: -5 }}
                          whileTap={{ scale: 0.9 }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            darkMode
                              ? "bg-gradient-to-br from-teal-800 to-blue-900 hover:from-teal-700 hover:to-blue-800"
                              : "bg-gradient-to-br from-purple-100 to-indigo-200 hover:from-purple-200 hover:to-indigo-300"
                          } shadow-md transition-colors`}
                        >
                          <Twitter size={18} />
                        </motion.a>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className={`px-3 py-1 rounded text-sm ${
                            darkMode
                              ? "bg-gray-700 text-gray-100"
                              : "bg-gray-800 text-white"
                          }`}
                          sideOffset={5}
                        >
                          Twitter
                          <Tooltip.Arrow
                            className={
                              darkMode ? "fill-gray-700" : "fill-gray-800"
                            }
                          />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </Tooltip.Provider>

                  <Tooltip.Provider>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <motion.a
                          href="https://github.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1, y: -5 }}
                          whileTap={{ scale: 0.9 }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            darkMode
                              ? "bg-gradient-to-br from-teal-800 to-blue-900 hover:from-teal-700 hover:to-blue-800"
                              : "bg-gradient-to-br from-purple-100 to-indigo-200 hover:from-purple-200 hover:to-indigo-300"
                          } shadow-md transition-colors`}
                        >
                          <Github size={18} />
                        </motion.a>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className={`px-3 py-1 rounded text-sm ${
                            darkMode
                              ? "bg-gray-700 text-gray-100"
                              : "bg-gray-800 text-white"
                          }`}
                          sideOffset={5}
                        >
                          Github
                          <Tooltip.Arrow
                            className={
                              darkMode ? "fill-gray-700" : "fill-gray-800"
                            }
                          />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </Tooltip.Provider>

                  <Tooltip.Provider>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <motion.a
                          href="https://linkedin.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1, y: -5 }}
                          whileTap={{ scale: 0.9 }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            darkMode
                              ? "bg-gradient-to-br from-teal-800 to-blue-900 hover:from-teal-700 hover:to-blue-800"
                              : "bg-gradient-to-br from-purple-100 to-indigo-200 hover:from-purple-200 hover:to-indigo-300"
                          } shadow-md transition-colors`}
                        >
                          <Linkedin size={18} />
                        </motion.a>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className={`px-3 py-1 rounded text-sm ${
                            darkMode
                              ? "bg-gray-700 text-gray-100"
                              : "bg-gray-800 text-white"
                          }`}
                          sideOffset={5}
                        >
                          LinkedIn
                          <Tooltip.Arrow
                            className={
                              darkMode ? "fill-gray-700" : "fill-gray-800"
                            }
                          />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className={`py-20 ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 via-purple-950/30 to-gray-900"
            : "bg-gradient-to-br from-white via-purple-50 to-white"
        } transition-colors duration-300 relative overflow-hidden`}
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl"></div>
          <div className="absolute bottom-40 right-20 w-80 h-80 rounded-full bg-pink-500/5 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"></div>
            <h2
              className="text-3xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Get in Touch
            </h2>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Have a question or interested in commissioning a piece? Reach out
              and let's create something amazing together.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className={`p-8 rounded-xl shadow-lg ${
                darkMode
                  ? "bg-gradient-to-br from-gray-800 to-gray-700 shadow-purple-500/10"
                  : "bg-gradient-to-br from-white to-purple-50 shadow-purple-300/30"
              }`}
            >
              <Form.Root className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Form.Field name="name">
                    <Form.Label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      Name
                    </Form.Label>
                    <Form.Control asChild>
                      <input
                        type="text"
                        className={`w-full p-3 rounded-lg ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 focus:border-purple-500 text-white"
                            : "bg-white border-gray-200 focus:border-purple-500"
                        } border focus:ring-1 focus:ring-purple-500 outline-none transition-colors`}
                        placeholder="Your name"
                      />
                    </Form.Control>
                  </Form.Field>

                  <Form.Field name="email">
                    <Form.Label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      Email
                    </Form.Label>
                    <Form.Control asChild>
                      <input
                        type="email"
                        className={`w-full p-3 rounded-lg ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 focus:border-purple-500 text-white"
                            : "bg-white border-gray-200 focus:border-purple-500"
                        } border focus:ring-1 focus:ring-purple-500 outline-none transition-colors`}
                        placeholder="Your email"
                      />
                    </Form.Control>
                  </Form.Field>
                </div>

                <Form.Field name="subject">
                  <Form.Label
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Subject
                  </Form.Label>
                  <Form.Control asChild>
                    <input
                      type="text"
                      className={`w-full p-3 rounded-lg ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 focus:border-purple-500 text-white"
                          : "bg-white border-gray-200 focus:border-purple-500"
                      } border focus:ring-1 focus:ring-purple-500 outline-none transition-colors`}
                      placeholder="Subject of your message"
                    />
                  </Form.Control>
                </Form.Field>

                <Form.Field name="message">
                  <Form.Label
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Message
                  </Form.Label>
                  <Form.Control asChild>
                    <textarea
                      className={`w-full p-3 rounded-lg ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 focus:border-purple-500 text-white"
                          : "bg-white border-gray-200 focus:border-purple-500"
                      } border focus:ring-1 focus:ring-purple-500 outline-none transition-colors`}
                      placeholder="Your message"
                      rows={5}
                    />
                  </Form.Control>
                </Form.Field>

                <Form.Submit asChild>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 rounded-lg font-medium ${
                      darkMode
                        ? "bg-gradient-to-r from-teal-600 to-blue-500 hover:from-teal-700 hover:to-blue-600 text-white"
                        : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
                    } transition-colors shadow-md`}
                  >
                    Send Message
                  </motion.button>
                </Form.Submit>
              </Form.Root>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`py-12 ${
          darkMode
            ? "bg-gradient-to-br from-teal-950 to-gray-900 text-gray-300"
            : "bg-gradient-to-br from-purple-100 to-indigo-100 text-gray-700"
        } transition-colors duration-300`}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center mb-4">
                  <Palette size={24} className="mr-2 text-purple-500" />
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                    ArtVista
                  </h3>
                </div>
                <p
                  className={`mb-6 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Transforming the way we experience art in the digital age.
                  Join me on this creative journey.
                </p>
                <div className="flex space-x-4">
                  <motion.a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="hover:text-purple-500 transition-colors"
                  >
                    <Instagram size={20} />
                    <span className="sr-only">Instagram</span>
                  </motion.a>
                  <motion.a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="hover:text-purple-500 transition-colors"
                  >
                    <Twitter size={20} />
                    <span className="sr-only">Twitter</span>
                  </motion.a>
                  <motion.a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="hover:text-purple-500 transition-colors"
                  >
                    <Github size={20} />
                    <span className="sr-only">Github</span>
                  </motion.a>
                  <motion.a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="hover:text-purple-500 transition-colors"
                  >
                    <Linkedin size={20} />
                    <span className="sr-only">LinkedIn</span>
                  </motion.a>
                </div>
              </div>

              <div>
                <h4
                  className="text-lg font-semibold mb-4"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Quick Links
                </h4>
                <ul className="space-y-2">
                  <li>
                    <motion.button
                      whileHover={{ x: 2 }}
                      onClick={() => scrollToSection("home")}
                      className={`hover:text-purple-500 transition-colors ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Home
                    </motion.button>
                  </li>
                  <li>
                    <motion.button
                      whileHover={{ x: 2 }}
                      onClick={() => scrollToSection("gallery")}
                      className={`hover:text-purple-500 transition-colors ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Gallery
                    </motion.button>
                  </li>
                  <li>
                    <motion.button
                      whileHover={{ x: 2 }}
                      onClick={() => scrollToSection("about")}
                      className={`hover:text-purple-500 transition-colors ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      About
                    </motion.button>
                  </li>
                  <li>
                    <motion.button
                      whileHover={{ x: 2 }}
                      onClick={() => scrollToSection("contact")}
                      className={`hover:text-purple-500 transition-colors ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Contact
                    </motion.button>
                  </li>
                </ul>
              </div>

              <div>
                <h4
                  className="text-lg font-semibold mb-4"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Contact
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Mail
                      size={16}
                      className={darkMode ? "text-gray-400" : "text-gray-600"}
                    />
                    <span
                      className={darkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      hello@artvista.com
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-gray-700">
              <p
                className={`text-center text-sm ${
                  darkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                © {new Date().getFullYear()} ArtVista. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Artwork Card Component
const ArtworkCard = ({
  artwork,
  setSelectedArtwork,
  handleLike,
  darkMode,
  variants,
}: {
  artwork: ArtworkType;
  setSelectedArtwork: (artwork: ArtworkType) => void;
  handleLike: (id: number) => void;
  darkMode: boolean;
  variants: any;
}) => {
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -5 }}
      className={`rounded-xl overflow-hidden shadow-lg ${
        darkMode
          ? "bg-gradient-to-br from-gray-800 to-gray-700 shadow-purple-500/10"
          : "bg-gradient-to-br from-white to-purple-50 shadow-purple-300/30"
      } transition-all duration-300`}
    >
      <motion.div
        className="relative cursor-pointer overflow-hidden"
        onClick={() => setSelectedArtwork(artwork)}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        <img
          src={artwork.image || "/placeholder.svg"}
          alt={artwork.title}
          className="w-full h-64 object-cover transition-transform"
        />
        <div
          className={`absolute inset-0 ${
            darkMode
              ? "bg-gradient-to-t from-gray-900/80 to-transparent"
              : "bg-gradient-to-t from-gray-900/60 to-transparent"
          } opacity-0 hover:opacity-100 transition-opacity flex items-end p-4`}
        >
          <p className="text-white font-medium">Click to view details</p>
        </div>
      </motion.div>

      <div className="p-4">
        <h3
          className="text-xl font-bold mb-1"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {artwork.title}
        </h3>
        <p
          className={`text-sm mb-4 line-clamp-2 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {artwork.description}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handleLike(artwork.id);
              }}
              className="flex items-center gap-1"
              aria-label={artwork.liked ? "Unlike" : "Like"}
            >
              {artwork.liked ? (
                <FaHeart className="text-red-500" size={18} />
              ) : (
                <Heart size={18} />
              )}
              <span>{artwork.likes}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedArtwork(artwork);
                // Allow a short delay for the modal to open before scrolling to comments
                setTimeout(() => {
                  const commentSection =
                    document.getElementById("artwork-comments");
                  commentSection?.scrollIntoView({ behavior: "smooth" });
                }, 300);
              }}
              className="flex items-center gap-1"
              aria-label="View comments"
            >
              <MessageSquare size={18} />
              <span>{artwork.comments.length}</span>
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedArtwork(artwork)}
            className={`text-sm font-medium ${
              darkMode
                ? "text-teal-400 hover:text-teal-300"
                : "text-purple-600 hover:text-purple-700"
            } transition-colors`}
          >
            View
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
