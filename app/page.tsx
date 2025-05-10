"use client";

import { useState, useEffect, useRef } from "react";
import { Playfair_Display } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, X, Sparkles, Copy, Check } from "lucide-react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
});

export default function QuotePage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<
    Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      life: number;
    }>
  >([]);
  const [visibleQuotesCount, setVisibleQuotesCount] = useState(8);

  // Quotes
  const quotes = [
    {
      text: "Art is not what you see, but what you make others see.",
      author: "Edgar Degas",
    },
    {
      text: "Every artist was first an amateur.",
      author: "Ralph Waldo Emerson",
    },
    {
      text: "Creativity takes courage.",
      author: "Henri Matisse",
    },
    {
      text: "Art enables us to find ourselves and lose ourselves at the same time.",
      author: "Thomas Merton",
    },
    {
      text: "The purpose of art is washing the dust of daily life off our souls.",
      author: "Pablo Picasso",
    },
    {
      text: "Art is the lie that enables us to realize the truth.",
      author: "Pablo Picasso",
    },
    {
      text: "Art is the most intense mode of individualism that the world has known.",
      author: "Oscar Wilde",
    },
    {
      text: "Art is not a thing; it is a way.",
      author: "Elbert Hubbard",
    },
    {
      text: "Art is the only way to run away without leaving home.",
      author: "Twyla Tharp",
    },
    {
      text: "Art is the stored honey of the human soul.",
      author: "Theodore Dreiser",
    },
    {
      text: "Art is the signature of civilizations.",
      author: "Beverly Sills",
    },
    {
      text: "Art is the most beautiful of all lies.",
      author: "Claude Debussy",
    }
  ];

  // Theme toggle
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    // Save theme preference
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Mouse trail effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Add new particles on mouse move
      if (Math.random() > 0.7) {
        const newParticle = {
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 5 + 1,
          speedX: (Math.random() - 0.5) * 2,
          speedY: (Math.random() - 0.5) * 2,
          color:
            theme === "dark"
              ? `hsl(${Math.random() * 60 + 180}, 100%, 70%)`
              : `hsl(${Math.random() * 60 + 300}, 100%, 70%)`,
          life: 100,
        };
        setParticles((prev) => [...prev, newParticle]);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [theme]);

  // Update particles
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.speedX,
            y: p.y + p.speedY,
            life: p.life - 1,
          }))
          .filter((p) => p.life > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [particles]);

  // Draw particles on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle =
        p.color +
        Math.floor((p.life / 100) * 255)
          .toString(16)
          .padStart(2, "0");
      ctx.fill();
    });

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [particles]);

  // Prevent background scroll when popup is open
  useEffect(() => {
    if (showPopup) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    // Clean up in case the component unmounts while popup is open
    return () => document.body.classList.remove('overflow-hidden');
  }, [showPopup]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
      style={{ fontFamily: playfair.style.fontFamily }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
      />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-full z-50 transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
            : "bg-yellow-100 text-gray-800 hover:bg-yellow-200"
        }`}
        aria-label={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
      >
        {theme === "dark" ? (
          <Sun className="h-6 w-6" />
        ) : (
          <Moon className="h-6 w-6" />
        )}
      </button>

      {/* Main content */}
      <main className="w-full px-4 md:px-8 py-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <h1 className="text-4xl md:text-7xl font-bold mb-8 tracking-tight">
            <span
              className={`bg-clip-text text-transparent ${
                theme === "dark"
                  ? "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
                  : "bg-gradient-to-r from-purple-600 via-pink-600 to-red-600"
              }`}
            >
              Artistic Quotes
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 leading-relaxed">
            Where you can see truly inspiring quotes in a canvas of breathtaking
            designs. A true feast for your eyes!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 w-full mb-16 items-stretch">
            {quotes.slice(0, visibleQuotesCount).map((quote, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03, rotate: index % 2 === 0 ? 1 : -1 }}
                onClick={() => {
                  setSelectedQuote(index);
                  setShowPopup(true);
                }}
                className={`p-6 rounded-2xl shadow-lg transition-all duration-300 cursor-pointer ${
                  theme === "dark"
                    ? "bg-gray-800 hover:shadow-indigo-500/20"
                    : "bg-white hover:shadow-indigo-500/30"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center ${
                    theme === "dark" ? "bg-indigo-900" : "bg-indigo-100"
                  }`}
                >
                  <Sparkles
                    className={
                      theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                    }
                  />
                </div>
                <h3 className="text-xl font-bold mb-3">Quote {index + 1}</h3>
                <p
                  className={`italic ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  "{quote.text.substring(0, 50)}..."
                </p>
                <p className="text-right mt-2 font-medium">— {quote.author}</p>
              </motion.div>
            ))}
          </div>

          {visibleQuotesCount < quotes.length && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setVisibleQuotesCount((prev) => Math.min(prev + 8, quotes.length));
              }}
              className={`px-8 py-4 rounded-full text-lg font-medium transition-colors duration-300 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              }`}
            >
              View More Quotes
            </motion.button>
          )}

          {visibleQuotesCount >= quotes.length && quotes.length > 8 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setVisibleQuotesCount(8)}
              className={`px-8 py-4 rounded-full text-lg font-medium transition-colors duration-300 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-purple-700 to-pink-700 text-white hover:from-purple-800 hover:to-pink-800"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
              }`}
            >
              Show Less Quotes
            </motion.button>
          )}
        </motion.div>

        {/* Decorative elements */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <div
            className={`absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl opacity-20 ${
              theme === "dark" ? "bg-purple-700" : "bg-purple-500"
            }`}
          ></div>
          <div
            className={`absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl opacity-20 ${
              theme === "dark" ? "bg-pink-700" : "bg-pink-500"
            }`}
          ></div>
        </div>

        {/* Mouse follower */}
        <motion.div
          className={`fixed w-8 h-8 rounded-full pointer-events-none z-50 mix-blend-difference ${
            theme === "dark" ? "bg-white" : "bg-black"
          }`}
          animate={{
            x: mousePosition.x - 16,
            y: mousePosition.y - 16,
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            mass: 0.5,
          }}
        />

        {/* Popup for detailed quote view */}
        <AnimatePresence>
          {showPopup && selectedQuote !== null && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={() => setShowPopup(false)}
              />
              <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className={`w-full max-w-lg p-4 rounded-2xl ${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-6 gap-2">
                    <h2 className="text-3xl font-bold m-0">Inspirational Quote</h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(`\"${quotes[selectedQuote].text}\" — ${quotes[selectedQuote].author}`)}
                        className={`p-2 rounded-full flex items-center transition-colors z-10 ${
                          theme === "dark"
                            ? "bg-gray-700 hover:bg-gray-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                        }`}
                        aria-label="Copy quote"
                      >
                        {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => setShowPopup(false)}
                        className={`p-2 rounded-full ${
                          theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }`}
                        aria-label="Close popup"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div
                    className={`p-6 rounded-lg mb-6 ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <p className="italic text-xl">
                      "{quotes[selectedQuote].text}"
                    </p>
                    <p className="text-right mt-4 font-medium">
                      — {quotes[selectedQuote].author}
                    </p>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}