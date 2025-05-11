"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Moon, Sun, Search, Info, Heart, Share2, ChevronDown, Sparkles, Clock, MapPin } from "lucide-react";

const paintings = [
  {
    id: 1,
    title: "WHISPERS OF THE COSMIC TEACUP",
    artist: "Stella Dreamweaver",
    year: "2023",
    image: "https://images.unsplash.com/photo-1693067821550-064a6c8683f8?q=80&w=1922&auto=format&fit=crop&&q=80",
    frameStyle: "gold-swirl",
    hoverEffect: "float-vertical",
    description: "A whimsical journey through the stars, where teacups dance with nebulae and cosmic sugar cubes dissolve into stardust."
  },
  {
    id: 2,
    title: "DANCING WITH NEON SHADOWS",
    artist: "Max Colorfield",
    year: "2022",
    image: "https://images.unsplash.com/photo-1584440947229-eeff7372b251?q=80&w=2018&auto=format&fit=crop&q=80",
    frameStyle: "silver-wave",
    hoverEffect: "rotate-gentle",
    description: "Electric silhouettes groove across vibrant cityscapes as day turns to night, blurring the line between reality and dream."
  },
  {
    id: 3,
    title: "MIDNIGHT SYMPHONY OF CATS",
    artist: "Luna Whiskerton",
    year: "2024",
    image: "https://images.unsplash.com/photo-1741805190534-1bb410acfba0?q=80&w=1920&auto=format&fit=crop&q=80",
    frameStyle: "bronze-leaves",
    hoverEffect: "pulse-subtle",
    description: "Mischievous felines conduct an orchestra of moonbeams and shadows, composing melodies only heard by those who dream awake."
  }
];

const additionalPaintings = [
  {
    id: 4,
    title: "LAUGHTER IN THE PUZZLE DIMENSION",
    artist: "Felix Joybrush",
    year: "2021",
    image: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?q=80&w=2070&auto=format&fit=crop&q=80",
    frameStyle: "rainbow-ripple",
    hoverEffect: "zoom-bounce",
    description: "Reality fragments into giggles and geometric impossibilities where every piece fits perfectly despite defying all logic."
  },
  {
    id: 5,
    title: "BREAKFAST WITH TIME TRAVELERS",
    artist: "Chronos Bakerfield",
    year: "2025",
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=2044&auto=format&fit=crop&q=80",
    frameStyle: "copper-twist",
    hoverEffect: "spin-slow",
    description: "Toast pops up from different centuries while eggs cook in quantum pans, capturing the cheerful chaos of cross-temporal dining."
  },
  {
    id: 6,
    title: "DREAMS OF FLYING PICKLES",
    artist: "Dill Skywalker",
    year: "2023",
    image: "https://images.unsplash.com/photo-1541680670548-88e8cd23c0f4?q=80&w=2069&auto=format&fit=crop&q=80",
    frameStyle: "emerald-dots",
    hoverEffect: "wobble-fun",
    description: "Aerodynamic cucumbers soar through cotton candy clouds, a delightful reminder that absurdity is the spice of imagination."
  }
];

const ParticleEffect = () => {
  const particleCount = 25;
  const particles = Array.from({ length: particleCount });

  return (
    <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
      {particles.map((_, i) => {
        const randomX = Math.floor(Math.random() * 100);
        const randomY = Math.floor(Math.random() * 100);
        const randomSize = Math.random() * 2 + 1;
        const randomDelay = Math.random() * 5;
        const randomDuration = Math.random() * 10 + 10;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${randomX}%`,
              top: `${randomY}%`,
              width: `${randomSize}px`,
              height: `${randomSize}px`,
              background: `radial-gradient(circle at center, #f9e076, #d4af37)`,
              boxShadow: '0 0 8px #f9e076'
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: randomDuration,
              repeat: Infinity,
              delay: randomDelay
            }}
          />
        );
      })}
    </div>
  );
};

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hoveredPainting, setHoveredPainting] = useState<number | null>(null);
  const [spotlight, setSpotlight] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPaintings, setFilteredPaintings] = useState([...paintings, ...additionalPaintings]);
  const [likedPaintings, setLikedPaintings] = useState<number[]>([]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedPainting, setSelectedPainting] = useState<any>(null);

  // Add refs for scroll animations
  const galleryRef = useRef<HTMLDivElement>(null);
  const historicalRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);

  // Create scroll-based animations
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [1, 0.8, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.4], [1, 0.95, 1]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDarkMode(savedTheme === "dark" || savedTheme === null);

    // Start spotlight effect after a delay
    const timer = setTimeout(() => {
      setSpotlight(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark-theme", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPaintings([...paintings, ...additionalPaintings]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = [...paintings, ...additionalPaintings].filter(
      painting =>
        painting.title.toLowerCase().includes(query) ||
        painting.artist.toLowerCase().includes(query) ||
        painting.year.includes(query)
    );

    setFilteredPaintings(filtered);
  }, [searchQuery]);

  // Handle like button click
  const handleLikeClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPaintings(prev =>
      prev.includes(id)
        ? prev.filter(paintingId => paintingId !== id)
        : [...prev, id]
    );
  };

  // Handle share button click
  const handleShareClick = (painting: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `${painting.title} by ${painting.artist}`,
        text: `Check out this amazing painting: ${painting.title} by ${painting.artist} (${painting.year})`,
        url: window.location.href,
      }).catch(err => {
        alert("Sharing is not available on this device or browser.");
      });
    } else {
      alert("Copied painting details to clipboard!");
      navigator.clipboard.writeText(
        `${painting.title} by ${painting.artist} (${painting.year})`
      );
    }
  };

  // Handle info button click
  const handleInfoClick = (painting: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPainting(painting);
    setShowInfoModal(true);
  };

  // Handle explore button click
  const handleExploreClick = () => {
    // Smooth scroll to the explored gallery section
    document.querySelector(".explored-gallery-section")?.scrollIntoView({
      behavior: "smooth"
    });
  };

  // Render search results
  const renderSearchResults = () => {
    if (searchQuery === "") return null;

    return (
      <div className="relative mb-16">
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-[#0a0a0a] px-12 py-2 z-10 border-l-2 border-r-2 border-[#d4af37]">
          <h2 className="text-lg uppercase tracking-[6px] gold-text font-semibold">Search Results</h2>
        </div>
        <div className="h-px w-full gold-gradient mb-20"></div>

        {filteredPaintings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredPaintings.map((painting, index) => (
              <motion.div
                key={painting.id}
                className={`flex flex-col items-center ${index === 1 && filteredPaintings.length >= 3 ? 'md:mt-16' : ''} w-full`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <motion.div
                  className="mb-6 relative mx-auto"
                  style={{ width: '320px', height: '420px' }}
                  whileHover={{
                    scale: 1.07,
                    boxShadow: isDarkMode
                      ? "0 15px 30px rgba(0,0,0,0.8), 0 10px 20px rgba(212,175,55,0.3)"
                      : "0 15px 30px rgba(0,0,0,0.2), 0 10px 20px rgba(212,175,55,0.5)",
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  onHoverStart={() => setHoveredPainting(painting.id)}
                  onHoverEnd={() => setHoveredPainting(null)}
                >
                  <div className="luxurious-frame relative">
                    <div className="frame-corner frame-corner-tl"></div>
                    <div className="frame-corner frame-corner-tr"></div>
                    <div className="frame-corner frame-corner-bl"></div>
                    <div className="frame-corner frame-corner-br"></div>
                    <div className="frame-inner">
                      <img
                        src={painting.image}
                        alt={painting.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <AnimatePresence>
                      {hoveredPainting === painting.id && (
                        <motion.div
                          className="hover-card p-3"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xs text-[#d4af37] font-medium">{painting.title}</h4>
                            <div className="flex space-x-3">
                              <Heart
                                size={14}
                                className={`hover-icon ${likedPaintings.includes(painting.id) ? "text-[#f9e076] fill-[#f9e076]" : ""}`}
                                onClick={(e) => handleLikeClick(painting.id, e)}
                              />
                              <Share2
                                size={14}
                                className="hover-icon"
                                onClick={(e) => handleShareClick(painting, e)}
                              />
                              <Info
                                size={14}
                                className="hover-icon"
                                onClick={(e) => handleInfoClick(painting, e)}
                              />
                            </div>
                          </div>
                          <div className="flex justify-between text-[10px] text-gray-400">
                            <span className={isDarkMode ? "" : "text-[#593c15]"}>{painting.artist}</span>
                            <span className={isDarkMode ? "" : "text-[#593c15]"}>{painting.year}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
                <h3 className="text-sm uppercase tracking-wide font-medium text-center mb-1"
                  style={{
                    background: 'linear-gradient(to right, #d4af37, #f9e076, #d4af37)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: isDarkMode ? '0 2px 10px rgba(212, 175, 55, 0.3)' : '0 1px 1px rgba(0, 0, 0, 0.8)'
                  }}
                >
                  {painting.title}
                </h3>
                <p className={`text-xs mb-1 ${isDarkMode ? "text-gray-400" : "text-[#593c15]"}`}>{painting.artist}</p>
                <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-[#593c15]"}`}>{painting.year}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400">No paintings found matching your search.</p>
            <button
              className="mt-4 px-6 py-2 border border-[#d4af37] text-[#d4af37] text-sm hover:bg-[#d4af37] hover:text-black transition-all"
              onClick={() => setSearchQuery("")}
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-[#0a0a0a]" : "bg-[#f8f4e8]"} ${isDarkMode ? "text-white" : "text-[#3a2f1d]"} relative overflow-hidden`}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          font-family: 'Cinzel', serif;
          background-color: ${isDarkMode ? '#0a0a0a' : '#f8f4e8'};
          overflow-x: hidden;
          -webkit-tap-highlight-color: transparent;
        }

        .gold-gradient {
          background: linear-gradient(to right, #d4af37 0%, #f9e076 20%, #d4af37 40%, #d4af37 60%, #f9e076 80%, #d4af37 100%);
          background-size: 200% auto;
          animation: shimmer 2s linear infinite;
          box-shadow: ${isDarkMode ? 'none' : '0 2px 10px rgba(212, 175, 55, 0.5)'};
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        .spotlight {
          pointer-events: none;
          position: fixed;
          width: 100vw;
          height: 100vh;
          top: 0;
          left: 0;
          background: radial-gradient(
            circle at 50% 30%, 
            rgba(0,0,0,0) 0%, 
            ${isDarkMode ? 'rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.5) 70%' : 'rgba(137, 94, 38, 0.05) 20%, rgba(137, 94, 38, 0.15) 70%'}
          );
          opacity: ${isDarkMode ? '0.7' : '0.5'};
          z-index: 10;
          transition: opacity 1s ease;
        }
        
        .title-stroke {
          -webkit-text-stroke: 1px rgba(212, 175, 55, 0.5);
          text-stroke: 1px rgba(212, 175, 55, 0.5);
        }
        
        .luxurious-frame {
          position: relative;
          padding: 22px;
          background: linear-gradient(45deg, #d4af37, #f9e076, #d4af37, #bb9837);
          box-shadow: 
            0 10px 30px rgba(0, 0, 0, ${isDarkMode ? '0.8' : '0.2'}),
            0 5px 15px rgba(212, 175, 55, 0.5);
          transform-style: preserve-3d;
          perspective: 1000px;
          transition: transform 0.3s ease;
        }
        
        .luxurious-frame::before {
          content: '';
          position: absolute;
          top: 5px;
          left: 5px;
          right: 5px;
          bottom: 5px;
          background: ${isDarkMode ? '#0a0a0a' : '#f8f4e8'};
          z-index: 0;
        }
        
        .luxurious-frame::after {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: linear-gradient(45deg, #f9e076, #d4af37);
          z-index: -2;
          filter: blur(12px);
          opacity: ${isDarkMode ? '0.5' : '0.7'};
          transition: opacity 0.3s ease;
        }
        
        .luxurious-frame:hover::after {
          opacity: 1;
        }
        
        .frame-inner {
          position: relative;
          z-index: 1;
          transition: transform 0.3s ease;
        }
        
        .frame-corner {
          position: absolute;
          width: 24px;
          height: 24px;
          z-index: 2;
          box-shadow: 0 0 10px rgba(249, 224, 118, 0.5);
        }
        
        @media (min-width: 640px) {
          .frame-corner {
            width: 30px;
            height: 30px;
          }
        }
        
        .frame-corner::before {
          content: '';
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #f9e076;
          box-shadow: 0 0 5px #f9e076;
        }
        
        .frame-corner-tl {
          top: 8px;
          left: 8px;
          border-top: 2px solid #f9e076;
          border-left: 2px solid #f9e076;
        }
        
        .frame-corner-tl::before {
          top: -2px;
          left: -2px;
        }
        
        .frame-corner-tr {
          top: 8px;
          right: 8px;
          border-top: 2px solid #f9e076;
          border-right: 2px solid #f9e076;
        }
        
        .frame-corner-tr::before {
          top: -2px;
          right: -2px;
        }
        
        .frame-corner-bl {
          bottom: 8px;
          left: 8px;
          border-bottom: 2px solid #f9e076;
          border-left: 2px solid #f9e076;
        }
        
        .frame-corner-bl::before {
          bottom: -2px;
          left: -2px;
        }
        
        .frame-corner-br {
          bottom: 8px;
          right: 8px;
          border-bottom: 2px solid #f9e076;
          border-right: 2px solid #f9e076;
        }
        
        .frame-corner-br::before {
          bottom: -2px;
          right: -2px;
        }
        
        .gold-text {
          background: linear-gradient(to right, #d4af37, #f9e076, #d4af37);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          text-shadow: ${isDarkMode ? '0 2px 10px rgba(212, 175, 55, 0.3)' : '0 2px 5px rgba(0, 0, 0, 0.6)'};
        }
        
        .hover-card {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: ${isDarkMode ? 'rgba(10, 10, 10, 0.9)' : 'rgba(248, 244, 232, 0.95)'};
          backdrop-filter: blur(5px);
          border-top: 1px solid rgba(212, 175, 55, 0.3);
          z-index: 5;
          box-shadow: ${isDarkMode ? 'none' : '0 -4px 10px rgba(0, 0, 0, 0.05)'};
        }
        
        .hover-icon {
          color: #d4af37;
          transition: all 0.3s ease;
        }
        
        .hover-icon:hover {
          color: #f9e076;
          transform: scale(1.2);
        }
        
        .nav-item {
          position: relative;
        }
        
        .nav-item::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          width: 0;
          height: 1px;
          background: #d4af37;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        
        .nav-item:hover::after {
          width: 100%;
        }
        
        .title-3d {
          transform: perspective(500px) rotateX(10deg);
          text-shadow: 
            0 1px 0 #ccc,
            0 2px 0 #c9c9c9,
            0 3px 0 #bbb,
            0 4px 0 #b9b9b9,
            0 5px 0 #aaa,
            0 6px 1px rgba(0,0,0,.1),
            0 0 5px rgba(0,0,0,.1),
            0 1px 3px rgba(0,0,0,.3),
            0 3px 5px rgba(0,0,0,.2),
            0 5px 10px rgba(0,0,0,.25),
            0 10px 10px rgba(0,0,0,.2),
            0 20px 20px rgba(0,0,0,.15);
        }
        
        .tailwind-gold-text {
          @apply font-bold text-amber-600 dark:text-yellow-400 drop-shadow-sm;
        }
        
        .tailwind-gold-title {
          @apply font-bold text-amber-600 dark:text-white drop-shadow-sm dark:drop-shadow-gold uppercase tracking-wide;
        }
        
        .dark .drop-shadow-gold {
          filter: drop-shadow(0 0 1px #d4af37) drop-shadow(0 0 2px #d4af37);
        }
        
        .painting-card {
          @apply transition-all duration-300 hover:scale-105 hover:rotate-1;
        }
        
        .painting-image {
          @apply transition-all duration-500 hover:scale-110;
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        .float-animation-delay-1 {
          animation: float 6s ease-in-out 2s infinite;
        }
        
        .float-animation-delay-2 {
          animation: float 6s ease-in-out 4s infinite;
        }
        
        /* Mobile specific styles */
        @media (max-width: 640px) {
          .float-animation,
          .float-animation-delay-1,
          .float-animation-delay-2 {
            animation-duration: 8s;
            animation-name: float;
          }
          
          .luxurious-frame {
            padding: 16px;
          }
          
          .title-3d {
            transform: perspective(400px) rotateX(8deg);
          }
        }

        .gold-swirl {
          background: linear-gradient(45deg, #f9e076, #ffa500, #bb9837, #ffd700);
          animation: gradient-shift 8s ease infinite;
          background-size: 400% 400%;
          border-radius: 15px 5px 15px 5px;
        }

        .silver-wave {
          background: linear-gradient(135deg, #ff6b6b, #e5e5e5, #4ecdc4, #ff6b6b);
          animation: wave-animation 6s ease infinite;
          background-size: 400% 400%;
          border-radius: 10px 10px 35px 35px;
        }

        .bronze-leaves {
          background: linear-gradient(90deg, #cd7f32, #ff9966, #ff7f50);
          animation: leaf-sway 7s ease-in-out infinite;
          background-size: 300% 300%;
          border-radius: 30px 30px 5px 5px;
        }

        .rainbow-ripple {
          background: linear-gradient(to right, #ff9966, #ff5e62, #00d2ff, #96c93d, #ff9966);
          animation: rainbow-shift 10s linear infinite;
          background-size: 500% 500%;
          border-radius: 50% 20% 50% 20%;
        }

        .copper-twist {
          background: linear-gradient(225deg, #b87333, #ff9966, #b87333);
          animation: twist-turn 8s ease infinite;
          background-size: 300% 300%;
          border-radius: 8px 32px 8px 32px;
        }

        .emerald-dots {
          background: radial-gradient(circle, #2ecc71, #1abc9c, #3498db);
          animation: dot-pulse 9s ease-in-out infinite;
          background-size: 200% 200%;
          border-radius: 25px;
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes wave-animation {
          0% { background-position: 0% 50%; border-radius: 10px 10px 35px 35px; }
          50% { background-position: 100% 50%; border-radius: 35px 35px 10px 10px; }
          100% { background-position: 0% 50%; border-radius: 10px 10px 35px 35px; }
        }

        @keyframes leaf-sway {
          0% { background-position: 0% 50%; transform: translateY(-1px); }
          50% { background-position: 100% 50%; transform: translateY(1px); }
          100% { background-position: 0% 50%; transform: translateY(-1px); }
        }

        @keyframes rainbow-shift {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }

        @keyframes twist-turn {
          0% { background-position: 0% 50%; transform: scale(1); }
          25% { transform: scale(1.01); }
          50% { background-position: 100% 50%; transform: scale(1); }
          75% { transform: scale(0.99); }
          100% { background-position: 0% 50%; transform: scale(1); }
        }

        @keyframes dot-pulse {
          0% { background-position: 0% 0%; background-size: 200% 200%; }
          50% { background-position: 100% 100%; background-size: 250% 250%; }
          100% { background-position: 0% 0%; background-size: 200% 200%; }
        }

        /* Featured paintings have continuous animations */
        .featured-painting .float-vertical {
          animation: float-v 3s ease-in-out infinite;
        }

        .featured-painting .rotate-gentle {
          animation: rotate-g 4s ease infinite;
        }

        .featured-painting .pulse-subtle {
          animation: pulse-s 2s ease-in-out infinite;
        }

        /* Other paintings only animate on hover */
        .float-vertical:not(.featured-painting .float-vertical):hover {
          animation: float-v 3s ease-in-out infinite;
        }

        .rotate-gentle:not(.featured-painting .rotate-gentle):hover {
          animation: rotate-g 4s ease infinite;
        }

        .pulse-subtle:not(.featured-painting .pulse-subtle):hover {
          animation: pulse-s 2s ease-in-out infinite;
        }

        .zoom-bounce:hover {
          animation: zoom-b 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .spin-slow:hover {
          animation: spin-s 6s linear infinite;
        }

        .wobble-fun:hover {
          animation: wobble-f 2s ease-in-out infinite;
        }

        /* Add animation keyframes back */
        @keyframes float-v {
          0% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0); }
        }

        @keyframes rotate-g {
          0% { transform: translateY(-2px); }
          25% { transform: translateY(2px); }
          75% { transform: translateY(-2px); }
          100% { transform: translateY(0); }
        }

        @keyframes pulse-s {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        @keyframes zoom-b {
          0% { transform: scale(1); }
          40% { transform: scale(1.08); }
          60% { transform: scale(0.98); }
          100% { transform: scale(1); }
        }

        @keyframes spin-s {
          0% { filter: brightness(1); }
          50% { filter: brightness(1.1); }
          100% { filter: brightness(1); }
        }

        @keyframes wobble-f {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-5px); }
          30% { transform: translateX(5px); }
          45% { transform: translateX(-5px); }
          60% { transform: translateX(5px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
      `}</style>

      {/* Background Elements */}
      {spotlight && (
        <div className="spotlight"></div>
      )}

      {/* Dynamic Spotlight */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-5"
        animate={{
          background: isDarkMode ? [
            'radial-gradient(circle at 30% 20%, rgba(0,0,0,0) 5%, rgba(0,0,0,0.8) 70%)',
            'radial-gradient(circle at 70% 20%, rgba(0,0,0,0) 5%, rgba(0,0,0,0.8) 70%)',
            'radial-gradient(circle at 30% 70%, rgba(0,0,0,0) 5%, rgba(0,0,0,0.8) 70%)',
            'radial-gradient(circle at 70% 70%, rgba(0,0,0,0) 5%, rgba(0,0,0,0.8) 70%)',
            'radial-gradient(circle at 30% 20%, rgba(0,0,0,0) 5%, rgba(0,0,0,0.8) 70%)'
          ] : [
            'radial-gradient(circle at 30% 20%, rgba(137, 94, 38, 0) 5%, rgba(137, 94, 38, 0.15) 70%)',
            'radial-gradient(circle at 70% 20%, rgba(137, 94, 38, 0) 5%, rgba(137, 94, 38, 0.15) 70%)',
            'radial-gradient(circle at 30% 70%, rgba(137, 94, 38, 0) 5%, rgba(137, 94, 38, 0.15) 70%)',
            'radial-gradient(circle at 70% 70%, rgba(137, 94, 38, 0) 5%, rgba(137, 94, 38, 0.15) 70%)',
            'radial-gradient(circle at 30% 20%, rgba(137, 94, 38, 0) 5%, rgba(137, 94, 38, 0.15) 70%)'
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ opacity: isDarkMode ? 0.6 : 0.6 }}
      />

      {/* Additional Light Mode Spotlight for better visibility */}
      {!isDarkMode && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-4"
          animate={{
            background: [
              'radial-gradient(circle at 40% 30%, rgba(212, 175, 55, 0) 5%, rgba(212, 175, 55, 0.05) 40%, rgba(137, 94, 38, 0.1) 70%)',
              'radial-gradient(circle at 60% 40%, rgba(212, 175, 55, 0) 5%, rgba(212, 175, 55, 0.05) 40%, rgba(137, 94, 38, 0.1) 70%)',
              'radial-gradient(circle at 40% 60%, rgba(212, 175, 55, 0) 5%, rgba(212, 175, 55, 0.05) 40%, rgba(137, 94, 38, 0.1) 70%)',
              'radial-gradient(circle at 60% 70%, rgba(212, 175, 55, 0) 5%, rgba(212, 175, 55, 0.05) 40%, rgba(137, 94, 38, 0.1) 70%)',
              'radial-gradient(circle at 40% 30%, rgba(212, 175, 55, 0) 5%, rgba(212, 175, 55, 0.05) 40%, rgba(137, 94, 38, 0.1) 70%)'
            ]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ opacity: 0.8 }}
        />
      )}

      {/* Decorative Particles */}
      <ParticleEffect />

      <div className="relative border border-[rgba(212,175,55,0.3)] m-3 sm:m-5">
        <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-t border-l border-[#d4af37] opacity-40"></div>
        <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-t border-r border-[#d4af37] opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-b border-l border-[#d4af37] opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-b border-r border-[#d4af37] opacity-40"></div>

        {/* Main Content */}
        <main className="px-4 sm:px-6 py-4 relative z-10">
          <div className="mx-auto max-w-screen-xl text-center">
            <motion.h1
              className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 sm:mb-8 tracking-wide relative z-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              style={{
                background: 'linear-gradient(to bottom, #f9e076 0%, #d4af37 50%, #8a7530 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: isDarkMode ? 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.8))' : 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.6))',
                transform: 'perspective(500px) rotateX(10deg)',
                transformOrigin: 'center'
              }}
            >
              ONLINE GALLERY
            </motion.h1>

            <motion.p
              className={`text-xs sm:text-sm uppercase tracking-wider mb-6 sm:mb-8 max-w-2xl mx-auto px-2 ${isDarkMode ? "text-[#ccc]" : "text-[#2a2415] font-medium"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              HERE YOU CAN SEE THE MOST FAMOUS WORKS OF ART,<br className="hidden sm:block" />
              LEARN THE HISTORY OF THEIR CREATION AND MUCH MORE
            </motion.p>

            <motion.div
              className="flex justify-center items-center my-6 sm:my-8"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <div className={`h-px gold-gradient w-20 sm:w-32 ${!isDarkMode && "shadow-sm"}`}></div>
              <div className="mx-3 sm:mx-4 w-2 h-2 rounded-full bg-[#d4af37]"></div>
              <div className={`h-px gold-gradient w-20 sm:w-32 ${!isDarkMode && "shadow-sm"}`}></div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              className="flex justify-center mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="relative w-full max-w-md group px-4 sm:px-0">
                <input
                  type="text"
                  placeholder="Search for artworks, artists, periods..."
                  className={`w-full py-2 sm:py-3 px-3 sm:px-4 pl-10 sm:pl-12 border-2 focus:outline-none focus:border-[#f9e076] rounded-sm transition-all duration-300 text-sm sm:text-base ${isDarkMode
                    ? "bg-[rgba(10,10,10,0.8)] border-[#d4af37] text-white placeholder-gray-400"
                    : "bg-[#f9f6eb] border-[#d4af37] text-[#593c15] placeholder-[#8B6D2B] font-medium"
                    }`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-6 sm:left-4 top-3 sm:top-3.5 text-[#d4af37] group-hover:text-[#f9e076] transition-colors duration-300" size={16} />
                <div className={`absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl bg-[#d4af37] ${!isDarkMode && "group-hover:opacity-70"}`}></div>
              </div>
            </motion.div>

            <motion.button
              className={`uppercase tracking-wider border-2 border-[#d4af37] py-2 sm:py-3 px-8 sm:px-12 mb-12 sm:mb-16 hover:bg-[#d4af37] hover:text-black transition-colors relative overflow-hidden group text-sm sm:text-base ${isDarkMode ? "text-[#d4af37]" : "text-[#d4af37] bg-[#f9f6eb] shadow-md"
                }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExploreClick}
            >
              <span className="relative z-10 font-semibold tracking-[2px] sm:tracking-[3px]">Explore Now</span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-[#d4af37] via-[#f9e076] to-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 -z-10 opacity-0 blur-xl bg-[#d4af37] group-hover:opacity-70 transition-opacity duration-500"></div>
            </motion.button>

            {/* Search Results */}
            {searchQuery && renderSearchResults()}

            {/* Gallery Layout - First Row */}
            <div className="relative mb-12 sm:mb-16 gallery-section" ref={galleryRef}>
              <div className={`absolute -top-12 sm:-top-14 left-1/2 transform -translate-x-1/2 px-6 sm:px-12 py-2 z-10 border-l-2 border-r-2 border-[#d4af37] ${isDarkMode ? "bg-[#0a0a0a]" : "bg-[#f9f6eb] shadow-lg"}`}>
                <h2 className="text-base sm:text-lg uppercase tracking-[4px] sm:tracking-[6px] tailwind-gold-title">
                  Featured Masterpieces
                </h2>
              </div>
              <div className={`h-px w-full gold-gradient mb-16 sm:mb-20 ${!isDarkMode && "shadow-md"}`}></div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
                {paintings.map((painting, index) => (
                  <motion.div
                    key={painting.id}
                    className={`flex flex-col items-center ${index === 1 ? 'md:mt-16' : ''} hover:z-10 featured-painting w-full`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <motion.div
                      className={`mb-6 relative w-[280px] h-[380px] sm:w-[320px] sm:h-[420px] painting-card ${painting.hoverEffect} mx-auto`}
                      whileHover={{
                        boxShadow: isDarkMode
                          ? "0 15px 30px rgba(0,0,0,0.8), 0 10px 20px rgba(212,175,55,0.3)"
                          : "0 15px 30px rgba(0,0,0,0.2), 0 10px 20px rgba(212,175,55,0.5)",
                      }}
                      onHoverStart={() => setHoveredPainting(painting.id)}
                      onHoverEnd={() => setHoveredPainting(null)}
                    >
                      <div className={`luxurious-frame ${painting.frameStyle} relative overflow-hidden`}>
                        <div className="frame-corner frame-corner-tl"></div>
                        <div className="frame-corner frame-corner-tr"></div>
                        <div className="frame-corner frame-corner-bl"></div>
                        <div className="frame-corner frame-corner-br"></div>
                        <div className="frame-inner">
                          <img
                            src={painting.image}
                            alt={painting.title}
                            className="w-full h-full object-cover painting-image"
                          />
                        </div>

                        <AnimatePresence>
                          {hoveredPainting === painting.id && (
                            <motion.div
                              className="hover-card p-3"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xs text-[#d4af37] font-medium">{painting.title}</h4>
                                <div className="flex space-x-3">
                                  <Heart
                                    size={14}
                                    className={`hover-icon ${likedPaintings.includes(painting.id) ? "text-[#f9e076] fill-[#f9e076]" : ""}`}
                                    onClick={(e) => handleLikeClick(painting.id, e)}
                                  />
                                  <Share2
                                    size={14}
                                    className="hover-icon"
                                    onClick={(e) => handleShareClick(painting, e)}
                                  />
                                  <Info
                                    size={14}
                                    className="hover-icon"
                                    onClick={(e) => handleInfoClick(painting, e)}
                                  />
                                </div>
                              </div>
                              <div className="flex justify-between text-[10px] text-gray-400">
                                <span className={isDarkMode ? "" : "text-[#593c15]"}>{painting.artist}</span>
                                <span className={isDarkMode ? "" : "text-[#593c15]"}>{painting.year}</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                    <h3 className="text-sm uppercase tracking-wide font-medium text-center mb-1 tailwind-gold-title px-2">
                      {painting.title}
                    </h3>
                    <p className={`text-xs mb-1 ${isDarkMode ? "text-gray-400" : "text-[#3a2f1d] font-medium"}`}>{painting.artist}</p>
                    <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-[#3a2f1d] font-medium"}`}>{painting.year}</p>
                    <p className={`mt-3 text-center text-xs max-w-[280px] sm:max-w-[320px] px-2 ${isDarkMode ? "text-gray-400" : "text-[#593c15]"}`}>
                      {painting.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Divider between gallery sections */}
            <motion.div
              className="flex justify-center items-center my-12 sm:my-20 relative"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <div className={`h-px gold-gradient w-20 sm:w-32 ${!isDarkMode && "shadow-sm"}`}></div>
              <div className={`mx-3 sm:mx-4 rounded-full p-1.5 sm:p-2 border border-[#d4af37] ${isDarkMode ? "bg-[#0a0a0a]" : "bg-white shadow-md"}`}>
                <ChevronDown size={16} className="text-[#d4af37]" />
              </div>
              <div className={`h-px gold-gradient w-20 sm:w-32 ${!isDarkMode && "shadow-sm"}`}></div>
            </motion.div>

            {/* Gallery Layout - Second Row */}
            <div className="relative mb-12 sm:mb-16">
              <div className={`absolute -top-12 sm:-top-14 left-1/2 transform -translate-x-1/2 px-6 sm:px-12 py-2 z-10 border-l-2 border-r-2 border-[#d4af37] ${isDarkMode ? "bg-[#0a0a0a]" : "bg-[#f9f6eb] shadow-lg"}`}>
                <h2 className="text-base sm:text-lg uppercase tracking-[4px] sm:tracking-[6px] font-bold"
                  style={{
                    color: isDarkMode ? '#ffffff' : '#a47e1b',
                    textShadow: isDarkMode
                      ? '0 0 1px #d4af37, 0 0 2px #d4af37'
                      : '0 1px 0 rgba(0, 0, 0, 0.5)'
                  }}>
                  Historical Collection
                </h2>
              </div>
              <div className={`h-px w-full gold-gradient mb-16 sm:mb-20 ${!isDarkMode && "shadow-md"}`}></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12 sm:mb-16 px-4">
                {additionalPaintings.map((painting, index) => (
                  <motion.div
                    key={painting.id}
                    className="flex flex-col items-center w-full"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                  >
                    <motion.div
                      className={`mb-6 relative w-[280px] h-[380px] sm:w-[320px] sm:h-[420px] ${painting.hoverEffect} mx-auto`}
                      onHoverStart={() => setHoveredPainting(painting.id)}
                      onHoverEnd={() => setHoveredPainting(null)}
                    >
                      <div className={`luxurious-frame ${painting.frameStyle} relative`}>
                        <div className="frame-corner frame-corner-tl"></div>
                        <div className="frame-corner frame-corner-tr"></div>
                        <div className="frame-corner frame-corner-bl"></div>
                        <div className="frame-corner frame-corner-br"></div>
                        <div className="frame-inner">
                          <img
                            src={painting.image}
                            alt={painting.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <AnimatePresence>
                          {hoveredPainting === painting.id && (
                            <motion.div
                              className="hover-card p-3"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xs text-[#d4af37] font-medium">{painting.title}</h4>
                                <div className="flex space-x-3">
                                  <Heart
                                    size={14}
                                    className={`hover-icon ${likedPaintings.includes(painting.id) ? "text-[#f9e076] fill-[#f9e076]" : ""}`}
                                    onClick={(e) => handleLikeClick(painting.id, e)}
                                  />
                                  <Share2
                                    size={14}
                                    className="hover-icon"
                                    onClick={(e) => handleShareClick(painting, e)}
                                  />
                                  <Info
                                    size={14}
                                    className="hover-icon"
                                    onClick={(e) => handleInfoClick(painting, e)}
                                  />
                                </div>
                              </div>
                              <div className="flex justify-between text-[10px] text-gray-400">
                                <span className={isDarkMode ? "" : "text-[#593c15]"}>{painting.artist}</span>
                                <span className={isDarkMode ? "" : "text-[#593c15]"}>{painting.year}</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                    <h3 className="text-sm uppercase tracking-wide font-medium text-center mb-1 px-2"
                      style={{
                        background: 'linear-gradient(to right, #d4af37, #f9e076, #d4af37)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        textShadow: isDarkMode ? '0 2px 10px rgba(212, 175, 55, 0.3)' : '0 1px 1px rgba(0, 0, 0, 0.8)'
                      }}>
                      {painting.title}
                    </h3>
                    <p className={`text-xs mb-1 ${isDarkMode ? "text-gray-400" : "text-[#3a2f1d] font-medium"}`}>{painting.artist}</p>
                    <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-[#3a2f1d] font-medium"}`}>{painting.year}</p>
                    <p className={`mt-3 text-center text-xs max-w-[280px] sm:max-w-[320px] px-2 ${isDarkMode ? "text-gray-400" : "text-[#593c15]"}`}>
                      {painting.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="max-w-4xl mx-auto my-12 sm:my-16 px-4 sm:px-6">
                <div className={`p-6 sm:p-8 border border-[#d4af37] ${isDarkMode ? "bg-[rgba(10,10,10,0.6)]" : "bg-[rgba(248,244,232,0.7)]"}`}>
                  <h3 className="text-lg sm:text-xl mb-4 text-center"
                    style={{
                      color: isDarkMode ? '#ffffff' : '#a47e1b',
                      textShadow: isDarkMode
                        ? '0 0 1px #d4af37, 0 0 2px #d4af37'
                        : '0 1px 0 rgba(0, 0, 0, 0.5)'
                    }}>
                    The Art of Classical Painting
                  </h3>
                  <p className={`text-center mb-4 text-sm sm:text-base ${isDarkMode ? "text-gray-300" : "text-[#3a2f1d]"}`}>
                    Classical paintings are more than just beautiful images—they're windows into history, showcasing the evolution of artistic techniques and cultural values through the centuries.
                  </p>
                  <p className={`text-center text-sm sm:text-base ${isDarkMode ? "text-gray-300" : "text-[#3a2f1d]"}`}>
                    Each work in our collection has been carefully selected for its historical significance, technical brilliance, and emotional resonance. From Renaissance masterpieces to Baroque brilliance, our gallery celebrates the timeless appeal of classical art.
                  </p>
                </div>
              </div>
            </div>

            {/* Divider between gallery sections */}
            <motion.div
              className="flex justify-center items-center my-12 sm:my-20 relative"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <div className={`h-px gold-gradient w-20 sm:w-32 ${!isDarkMode && "shadow-sm"}`}></div>
              <div className={`mx-3 sm:mx-4 rounded-full p-1.5 sm:p-2 border border-[#d4af37] ${isDarkMode ? "bg-[#0a0a0a]" : "bg-white shadow-md"}`}>
                <ChevronDown size={16} className="text-[#d4af37]" />
              </div>
              <div className={`h-px gold-gradient w-20 sm:w-32 ${!isDarkMode && "shadow-sm"}`}></div>
            </motion.div>

            {/* Explored Gallery Section */}
            <motion.div
              className="explored-gallery-section relative mt-16 sm:mt-24 mb-12 sm:mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <div className={`absolute -top-12 sm:-top-14 left-1/2 transform -translate-x-1/2 px-6 sm:px-12 py-2 z-10 border-l-2 border-r-2 border-[#d4af37] ${isDarkMode ? "bg-[#0a0a0a]" : "bg-[#f9f6eb] shadow-lg"}`}>
                <h2 className="text-base sm:text-lg uppercase tracking-[4px] sm:tracking-[6px] font-bold"
                  style={{
                    color: isDarkMode ? '#ffffff' : '#a47e1b',
                    textShadow: isDarkMode
                      ? '0 0 1px #d4af37, 0 0 2px #d4af37'
                      : '0 1px 0 rgba(0, 0, 0, 0.5)'
                  }}>
                  Explore More Art
                </h2>
              </div>
              <div className={`h-px w-full gold-gradient mb-16 sm:mb-20 ${!isDarkMode && "shadow-md"}`}></div>

              <div className="w-full max-w-[1400px] mx-auto px-4 py-4 sm:py-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10 justify-items-center">
                  {[...paintings, ...additionalPaintings].slice(0, 6).map((painting, index) => (
                    <motion.div
                      key={`explore-${painting.id}-${index}`}
                      className="flex flex-col items-center w-full max-w-[150px] sm:max-w-[180px]"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                    >
                      <motion.div
                        className={`mb-3 sm:mb-4 relative w-full h-[200px] sm:h-[240px] ${painting.hoverEffect} mx-auto`}
                        whileHover={{
                          scale: 1.1,
                          boxShadow: isDarkMode
                            ? "0 10px 20px rgba(0,0,0,0.8), 0 5px 15px rgba(212,175,55,0.3)"
                            : "0 10px 20px rgba(0,0,0,0.2), 0 5px 15px rgba(212,175,55,0.5)",
                        }}
                        onHoverStart={() => setHoveredPainting(painting.id + 100)}
                        onHoverEnd={() => setHoveredPainting(null)}
                      >
                        <div className={`luxurious-frame ${painting.frameStyle} relative overflow-hidden w-full h-full`} style={{ padding: '10px' }}>
                          <div className="frame-inner w-full h-full">
                            <img
                              src={painting.image}
                              alt={painting.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <AnimatePresence>
                            {hoveredPainting === painting.id + 100 && (
                              <motion.div
                                className="hover-card p-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="flex justify-center items-center space-x-2">
                                  <Heart
                                    size={12}
                                    className={`hover-icon ${likedPaintings.includes(painting.id) ? "text-[#f9e076] fill-[#f9e076]" : ""}`}
                                    onClick={(e) => handleLikeClick(painting.id, e)}
                                  />
                                  <Info
                                    size={12}
                                    className="hover-icon"
                                    onClick={(e) => handleInfoClick(painting, e)}
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                      <h3 className="text-xs uppercase tracking-wide font-medium text-center w-full px-1"
                        style={{
                          color: isDarkMode ? '#ffffff' : '#a47e1b',
                          textShadow: isDarkMode
                            ? '0 0 1px #d4af37, 0 0 2px #d4af37'
                            : '0 1px 0 rgba(0, 0, 0, 0.5)'
                        }}>
                        {painting.title.length > 12 ? painting.title.substring(0, 12) + '...' : painting.title}
                      </h3>
                      <p className={`text-xs text-center ${isDarkMode ? "text-gray-400" : "text-[#593c15]"}`}>{painting.artist}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Painting Info Modal */}
            <AnimatePresence>
              {showInfoModal && selectedPainting && (
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center px-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-70" onClick={() => setShowInfoModal(false)}></div>
                  <motion.div
                    className={`relative w-full max-w-lg p-4 sm:p-6 mx-4 border-2 border-[#d4af37] max-h-[90vh] overflow-y-auto ${isDarkMode ? "bg-[#0a0a0a]" : "bg-[#f9f6eb]"}`}
                    initial={{ scale: 0.5, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.5, y: 50 }}
                    whileHover={{ boxShadow: "0 0 30px rgba(212, 175, 55, 0.3)" }}
                  >
                    <button
                      className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[#d4af37] hover:text-[#f9e076] text-xl font-bold transition-colors"
                      onClick={() => setShowInfoModal(false)}
                    >
                      ×
                    </button>
                    <h2 className="text-lg sm:text-xl mb-4 tailwind-gold-title pr-8">{selectedPainting.title}</h2>
                    <div className="flex flex-col md:flex-row mb-6">
                      <motion.div
                        className="w-full md:w-1/2 pr-0 md:pr-4 mb-4 md:mb-0"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <img
                          src={selectedPainting.image}
                          alt={selectedPainting.title}
                          className="w-full h-auto border border-[#d4af37] painting-image"
                        />
                      </motion.div>
                      <div className="w-full md:w-1/2 pl-0 md:pl-4">
                        <p className={`mb-2 text-sm sm:text-base ${isDarkMode ? "text-[#ccc]" : "text-[#593c15]"}`}>
                          <span className="tailwind-gold-text">Artist:</span> {selectedPainting.artist}
                        </p>
                        <p className={`mb-2 text-sm sm:text-base ${isDarkMode ? "text-[#ccc]" : "text-[#593c15]"}`}>
                          <span className="tailwind-gold-text">Year:</span> {selectedPainting.year}
                        </p>
                        <p className={`mb-4 text-sm sm:text-base ${isDarkMode ? "text-[#ccc]" : "text-[#593c15]"}`}>
                          <span className="tailwind-gold-text">Style:</span> Classical
                        </p>
                        <motion.p
                          className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? "text-[#ccc]" : "text-[#593c15]"}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {selectedPainting.description}
                        </motion.p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <motion.button
                        className="text-xs sm:text-sm uppercase px-3 sm:px-4 py-1.5 sm:py-2 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-colors"
                        onClick={() => setShowInfoModal(false)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Close
                      </motion.button>
                      <div className="flex space-x-4">
                        <Heart
                          size={18}
                          className={`hover-icon ${likedPaintings.includes(selectedPainting.id) ? "text-[#f9e076] fill-[#f9e076]" : ""}`}
                          onClick={(e) => {
                            handleLikeClick(selectedPainting.id, e);
                          }}
                        />
                        <Share2
                          size={18}
                          className="hover-icon"
                          onClick={(e) => handleShareClick(selectedPainting, e)}
                        />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Theme Switcher (Fixed Position) */}
      <motion.button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-opacity-80 border border-[#d4af37] shadow-lg transition-all ${isDarkMode ? "bg-black" : "bg-[#f9f6eb]/75"} text-[#d4af37]`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </motion.button>
    </div>
  );
}