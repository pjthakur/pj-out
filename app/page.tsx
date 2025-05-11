"use client";
import { useEffect, useState, useRef } from "react";
import React from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Moon, Sun, ChevronRight, Heart, Info, ArrowLeft, CheckCircle, Twitter, Facebook, Linkedin, Instagram, CheckCircle2, CircleCheck, Check } from "lucide-react";
import { Inter, Quicksand, Satisfy } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const quicksand = Quicksand({ subsets: ['latin'] });
const satisfy = Satisfy({ weight: "400", subsets: ['latin'] });

const blogPosts = [
  {
    id: 1,
    title: "Beginning the Journey",
    date: "January 15, 2023",
    readTime: "5 min read",
    quote: "Every great story begins with a single step into the unknown.",
    color: "bg-teal-100 dark:bg-teal-900/60",
    accent: "from-teal-400 to-cyan-500",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    highlight: true,
    likes: 42,
    description: "The journey began on a cold winter morning, with nothing but a backpack and a sense of adventure. I remember standing at the edge of my comfort zone, heart racing with both fear and excitement. What lay ahead was unknown, but that's exactly what made it so appealing. This first step would lead to a thousand more, each one taking me further into experiences I could never have imagined. The beginning of any journey is special - it's filled with pure potential and endless possibilities.",
  },
  {
    id: 2,
    title: "The Unexpected Turn",
    date: "March 23, 2023",
    readTime: "8 min read",
    quote: "Sometimes the best adventures come from taking the wrong path.",
    color: "bg-teal-100 dark:bg-teal-900/60",
    accent: "from-teal-400 to-cyan-500",
    image: "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e",
    highlight: true,
    likes: 29,
    description: "I was supposed to head east, following the carefully planned route I had mapped out weeks before. Instead, I found myself heading north, having misread a critical sign at a fork in the road. By the time I realized my mistake, I was hours off course. But this wrong turn led me to a hidden waterfall that wasn't on any tourist map, and to a small village where I was welcomed like family. Had I stuck to my original plan, I would have missed this entire experience. Sometimes, getting lost is the best way to find exactly what you need.",
  },
  {
    id: 3,
    title: "Finding Hidden Treasures",
    date: "May 7, 2023",
    readTime: "6 min read",
    quote: "The most valuable discoveries are often hiding in plain sight.",
    color: "bg-teal-100 dark:bg-teal-900/60",
    accent: "from-teal-400 to-cyan-500",
    image: "https://images.unsplash.com/photo-1533577116850-9cc66cad8a9b",
    highlight: true,
    likes: 37,
    description: "The old bookstore looked unassuming from the outside - just another dusty shop on a quiet street. I almost walked past it, but something about the faded sign caught my eye. Inside, shelves stretched from floor to ceiling, packed with volumes of every shape and size. In the corner, a stack of worn journals turned out to be handwritten accounts from a 19th-century explorer. The shopkeeper told me they'd been sitting there for years, with customers passing them by in favor of newer, shinier books. I spent hours poring over these forgotten treasures, each page revealing insights from a world long gone.",
  },
  {
    id: 4,
    title: "Challenges Overcome",
    date: "July 19, 2023",
    readTime: "10 min read",
    quote: "The mountain seemed impossible until I reached the summit.",
    color: "bg-teal-100 dark:bg-teal-900/60",
    accent: "from-teal-400 to-cyan-500",
    image: "https://images.unsplash.com/photo-1454982523318-4b6396f39d3a",
    highlight: true,
    likes: 51,
    description: "The ascent was brutal. My lungs burned with each breath of thin mountain air, and my muscles screamed for rest. Three times I considered turning back, convinced I had reached my limit. Each time, I promised myself just ten more minutes of effort before making the final decision. Those ten-minute extensions stretched into hours of grueling climb. When I finally reached the summit, the view that greeted me was worth every moment of suffering. Standing above the clouds, looking out at peaks extending to the horizon, I understood something profound about challenges - they're not obstacles to our journey, but essential parts of it.",
  },
  {
    id: 5,
    title: "Lessons Learned",
    date: "October 4, 2023",
    readTime: "7 min read",
    quote: "Growth comes from embracing both success and failure equally.",
    color: "bg-teal-100 dark:bg-teal-900/60",
    accent: "from-teal-400 to-cyan-500",
    image: "https://images.unsplash.com/photo-1695548303337-7ca0759400d0?q=80",
    highlight: true,
    likes: 46,
    description: "Looking back on six months of travel, I realized that my most valuable experiences weren't what I had expected. The perfectly executed plans were pleasant but forgettable. It was the disasters that taught me the most - the missed connections that led to unexpected friendships, the language barriers that taught me new ways to communicate, the lost belongings that showed me how little I actually needed. I had collected more than souvenirs; I had gathered lessons that would shape how I approached life. The journey had changed me in ways I was only beginning to understand, forging resilience and perspective through both triumphs and setbacks.",
  },
  {
    id: 6,
    title: "New Horizons",
    date: "December 31, 2023",
    readTime: "9 min read",
    quote: "As one chapter ends, another begins with endless possibilities.",
    color: "bg-teal-100 dark:bg-teal-900/60",
    accent: "from-teal-400 to-cyan-500",
    image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
    highlight: true,
    likes: 39,
    description: "Standing at the harbor watching the last sunset of the year, I felt a profound sense of completion. The journey that had begun twelve months ago had come full circle, yet I was nowhere near the same person who had set out with such uncertainty. As the sun dipped below the horizon, painting the sky in brilliant oranges and purples, I knew this wasn't an ending but a transition. Tomorrow would bring a new year, new paths to explore, and new stories to create. The most exciting part of any journey is that moment when you realize it never truly ends - it just evolves into something new. With gratitude for the road traveled and excitement for what lay ahead, I welcomed the coming dawn.",
  },
  {
    id: 7,
    title: "The Northern Lights",
    date: "February 12, 2024",
    readTime: "8 min read",
    quote: "Standing beneath the aurora, I finally understood what magic felt like.",
    color: "bg-teal-100 dark:bg-teal-900/60",
    accent: "from-teal-400 to-cyan-500",
    image: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73",
    highlight: true,
    likes: 64,
    description: "The anticipation had built for days as we waited for the perfect conditions. Clear skies, solar activity, and the right location all had to align. When it finally happened, no photograph or video could capture the reality of standing beneath those dancing lights. Green and purple waves rippled across the sky, shifting and transforming with hypnotic beauty. The locals said that the lights were the spirits of ancestors looking down, and in that moment, it was easy to believe in something greater than ourselves. Time seemed to stand still as we watched in silent awe, the cold forgotten as the heavens put on their spectacular show. It was a humbling reminder of how small we are, and how wondrous our world can be.",
  },
  {
    id: 8,
    title: "Desert Dreams",
    date: "April 5, 2024",
    readTime: "6 min read",
    quote: "In the silence of the dunes, even whispers echo for eternity.",
    color: "bg-teal-100 dark:bg-teal-900/60",
    accent: "from-teal-400 to-cyan-500",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35",
    highlight: true,
    likes: 27,
    description: "The desert had always called to me, its vast emptiness promising a kind of clarity that I couldn't find in the chaos of city life. I arrived at the edge of the sand sea as the heat of the day began to wane. With each step into the dunes, the sounds of civilization fell away until all that remained was the whisper of sand shifting beneath my feet and the sound of my own breath. As night fell, the temperature dropped dramatically, and the sky revealed a canopy of stars undiminished by artificial light. Lying on the still-warm sand, I felt both infinitely small beneath that cosmic display and strangely connected to everything. The desert wasn't empty as I had thought - it was full of subtle life and ancient wisdom, speaking to those quiet enough to listen.",
  },
];

interface TimelinePointProps {
  isHighlight: boolean;
  isInView: boolean;
  year?: string;
  currentTheme: string;
}

const TimelinePoint: React.FC<TimelinePointProps> = ({ isHighlight, isInView, year, currentTheme }) => (
  <div className="relative">
    <div
      className={`${isHighlight ? 'h-14 w-14' : 'h-10 w-10'} relative z-20 flex items-center justify-center transition-all duration-500 -ml-6`}
    >
      {isHighlight ? (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`absolute inset-0 rounded-lg rotate-45 ${currentTheme === "dark"
            ? "bg-gradient-to-br from-teal-400 to-cyan-600 shadow-lg shadow-teal-500/20"
            : "bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg shadow-teal-500/20"}`}
        />
      ) : (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className={`absolute inset-0 rounded-md rotate-45 ${currentTheme === "dark"
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200 shadow-sm"}`}
        />
      )}

      {/* Icon or symbol inside the marker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 text-center"
      >
        {isHighlight ? (
          <CheckCircle2 size={20} className={`text-white`} />
        ) : (
          <div className={`h-2 w-2 rounded-full ${currentTheme === "dark" ? "bg-teal-400" : "bg-teal-500"}`}></div>
        )}
      </motion.div>
    </div>

    {isHighlight && (
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className={`absolute -inset-2 rounded-lg rotate-45 ${currentTheme === "dark"
          ? "bg-teal-400/10"
          : "bg-teal-500/10"
          }`}
      />
    )}

    {year && (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`absolute left-16 sm:left-20 top-1/2 -translate-y-1/2 text-xl sm:text-2xl font-bold bg-gradient-to-r ${currentTheme === "dark"
          ? "from-teal-300 to-cyan-500"
          : "from-teal-600 to-cyan-700"
          } bg-clip-text text-transparent`}
      >
        {year}
      </motion.div>
    )}
  </div>
);

// Timeline connector component
interface TimelineConnectorProps {
  isActive: boolean;
  currentTheme: string;
}

const TimelineConnector: React.FC<TimelineConnectorProps> = ({ isActive, currentTheme }) => (
  <motion.div
    initial={{ height: 0 }}
    animate={{ height: "100%" }}
    transition={{ duration: 0.5 }}
    className={`absolute left-7 top-0 bottom-0 ${isActive
      ? currentTheme === "dark"
        ? "w-[2px] bg-gradient-to-b from-teal-400 via-teal-500 to-teal-400/70"
        : "w-[2px] bg-gradient-to-b from-teal-500 via-teal-600 to-teal-500/70"
      : "w-[1px] border-dashed border-l border-gray-300 dark:border-gray-700"
      } z-10`}
  ></motion.div>
);

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);
  const [activePost, setActivePost] = useState(0);
  const [showMobileDescription, setShowMobileDescription] = useState(false);
  const [selectedMobilePost, setSelectedMobilePost] = useState<number | null>(null);
  const [showFullStory, setShowFullStory] = useState(false);
  const [fullStoryPost, setFullStoryPost] = useState<number | null>(null);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

  // Observer for each post to determine which is currently active
  const postRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const bottomPointRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");

    // Load liked posts from localStorage if available
    try {
      const savedLikedPosts = localStorage.getItem("likedPosts");
      if (savedLikedPosts) {
        setLikedPosts(new Set(JSON.parse(savedLikedPosts)));
      }
    } catch (error) {
      console.error("Error loading liked posts:", error);
    }

    // Create an array to store refs
    postRefs.current = Array(blogPosts.length).fill(null);

    // Scroll handler to check post positions
    const handleScroll = () => {
      // Description top position is approximately where the fixed description sits
      const descriptionTopPosition = 100;
      // Trigger earlier by increasing the threshold - activate when posts are approaching
      const earlyTriggerOffset = 200;

      // Check if we're at the bottom of the page
      const scrollPosition = window.scrollY + window.innerHeight;
      const bodyHeight = document.body.offsetHeight;
      const scrollThreshold = 300; // How close to the bottom to consider "at bottom"

      // Check if footer is visible in viewport
      if (footerRef.current) {
        const footerRect = footerRef.current.getBoundingClientRect();
        // If footer is visible or close to visible
        setIsFooterVisible(footerRect.top < window.innerHeight - 100);
      }

      if (bottomPointRef.current && scrollPosition > bodyHeight - scrollThreshold) {
        // If close to bottom, set the last post as active
        setActivePost(blogPosts.length - 1);
        return;
      }

      // Check each post's position for active post
      let foundActive = false;

      postRefs.current.forEach((ref, index) => {
        if (ref && !foundActive) {
          const rect = ref.getBoundingClientRect();
          // Trigger when post approaches the viewport from below or is just entering
          if (rect.top <= descriptionTopPosition + earlyTriggerOffset && rect.top >= -100) {
            setActivePost(index);
            foundActive = true;
          }
        }
      });
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mounted, blogPosts.length]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handlePostClick = (index: number) => {
    setSelectedMobilePost(index);
    setShowMobileDescription(true);
  };

  const handleReadFullStory = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFullStoryPost(index);
    setShowFullStory(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeFullStory = () => {
    setShowFullStory(false);
    document.body.style.overflow = ''; // Restore scrolling
  };

  const toggleLike = (postId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    
    // Create a new Set from the current liked posts
    const newLikedPosts = new Set(likedPosts);
    
    // Toggle the post ID in the set
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    
    // Update state and localStorage
    setLikedPosts(newLikedPosts);
    try {
      localStorage.setItem("likedPosts", JSON.stringify(Array.from(newLikedPosts)));
    } catch (error) {
      console.error("Error saving liked posts:", error);
    }
  };

  if (!mounted) return null;

  return (
    <div className={`${inter.className} min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-b from-blue-50 via-teal-50 to-emerald-50 text-gray-800"} transition-colors duration-300`}>
      {/* Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
        {theme === "dark" ? (
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-teal-100/30 via-cyan-100/20 to-transparent" />
        )}

        {/* Light rays effect (visible in both themes) */}
        <div className="absolute inset-0 overflow-hidden opacity-30 mix-blend-overlay pointer-events-none">
          <div className="absolute -inset-[10%] rotate-45 opacity-20">
            <div className="w-full h-[20px] bg-white blur-xl transform -rotate-45 translate-y-[400px] opacity-30"></div>
            <div className="w-full h-[40px] bg-white blur-xl transform -rotate-45 translate-y-[800px] opacity-10"></div>
            <div className="w-full h-[5px] bg-white blur-sm transform -rotate-45 translate-y-[300px] opacity-30"></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/30 dark:bg-black/20 border-b border-teal-200/50 dark:border-white/10">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className={`text-2xl font-bold ${satisfy.className} ${theme === "dark" ? "text-white" : "text-teal-700"}`}>
              Journey<span className={theme === "dark" ? "text-teal-400" : "text-teal-500"}>Timeline</span>
            </h1>
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${theme === "dark" ? "bg-gray-800/50 hover:bg-gray-700/50" : "bg-teal-100 hover:bg-teal-200"} transition-all duration-300 hover:shadow-md`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ?
                <Sun size={18} className="text-teal-400" /> :
                <Moon size={18} className="text-teal-700" />
              }
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto relative z-10 flex flex-wrap min-h-screen">
        {/* Left sidebar - hidden on mobile */}
        <div className="hidden md:block md:w-1/6 pt-8 pr-0 md:pr-4 px-4 md:px-0">
          <div className="sticky top-20 space-y-12">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`text-3xl md:text-4xl mb-4 font-bold ${theme === "dark" ? "text-white" : "text-teal-800"} ${quicksand.className}`}
              >
                About<br />Journey
              </motion.h2>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className={`h-1 bg-gradient-to-r ${theme === "dark" ? "from-teal-400 to-cyan-600" : "from-teal-400 to-cyan-600"} rounded-full mb-4`}
              ></motion.div>
              <p className={`${theme === "dark" ? "text-white/70" : "text-gray-700"}`}>Follow the timeline of this incredible story as it unfolds through time.</p>
            </div>

            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`text-3xl md:text-4xl mb-4 font-bold ${theme === "dark" ? "text-white" : "text-teal-800"} ${quicksand.className}`}
              >
                Travel<br />Stories
              </motion.h2>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className={`h-1 bg-gradient-to-r ${theme === "dark" ? "from-teal-400 to-cyan-600" : "from-teal-400 to-cyan-600"} rounded-full mb-4`}
              ></motion.div>
              <p className={`${theme === "dark" ? "text-white/70" : "text-gray-700"}`}>Discover adventures and experiences captured in this chronological collection of travel tales.</p>
            </div>

          </div>
        </div>

        {/* Main timeline - full width on mobile */}
        <div className="w-full xl:w-[50%] pt-8 pb-16 md:pb-32 px-4">
          <div className="relative mx-auto max-w-full md:max-w-2xl lg:max-w-2xl xl:ml-auto xl:mr-8">
            {/* Main timeline line */}
            <div className={`absolute left-7 top-0 bottom-0 w-[1px] border-l border-dashed ${theme === "dark" ? "border-gray-700" : "border-gray-300"} z-0`}></div>

            {/* Year marker - top */}
            <div className="relative mb-16 sm:mb-24 pl-6">
              <TimelinePoint isHighlight={true} isInView={true} year="2023" currentTheme={theme} />
            </div>

            {/* Timeline events */}
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                ref={(el) => {
                  postRefs.current[index] = el;
                  return undefined;
                }}
                className="relative mb-16 sm:mb-28 pl-6"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
              >
                {/* Timeline connector from previous point */}
                <TimelineConnector isActive={activePost >= index} currentTheme={theme} />

                {/* Timeline point */}
                <TimelinePoint
                  isHighlight={post.highlight}
                  isInView={true}
                  year={index === 4 ? "2024" : undefined}
                  currentTheme={theme}
                />

                {/* Content */}
                <div className="relative ml-10 sm:ml-20">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`rounded-xl overflow-hidden shadow-xl ${activePost === index ? theme === "dark" ? 'ring-2 ring-teal-400' : 'ring-2 ring-teal-500' : ''} transition-all duration-300 transform perspective-1000`}
                    onClick={() => handleReadFullStory(index)}
                    style={{
                      boxShadow: theme === "dark"
                        ? "0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 10px rgba(0, 0, 0, 0.3) inset"
                        : "0 10px 30px -10px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 0, 0, 0.05) inset"
                    }}
                  >
                    {/* Glass overlay */}
                    <div className="absolute inset-0 backdrop-blur-sm bg-white/5 z-0"></div>

                    {/* Card background */}
                    <div className={`absolute inset-0 ${theme === "dark"
                      ? "bg-gradient-to-br from-gray-800/90 to-gray-900/90"
                      : "bg-gradient-to-br from-white/90 to-white/70"}`}>
                    </div>

                    <div className={`${post.highlight ? "flex flex-col md:flex-row" : "block"} relative z-10`}>
                      {/* Image */}
                      {post.highlight && (
                        <div className={`${post.highlight ? "w-full md:w-2/5" : "w-full"} h-48 md:h-auto relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/40 to-transparent z-10"></div>
                          <motion.img
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.8 }}
                            src={`${post.image}?auto=format&fit=crop&w=800&q=80`}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700"
                          />
                          {/* Colored overlay for active post */}
                          {activePost === index && (
                            <div className="absolute inset-0 bg-teal-500/10 dark:bg-teal-500/10 mix-blend-overlay z-10"></div>
                          )}
                        </div>
                      )}

                      {/* Content */}
                      <div className={`${post.highlight ? "w-full md:w-3/5 p-6" : "p-6"} relative`}>
                        {activePost === index && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute right-1 top-1 h-6 w-6 flex items-center justify-center"
                          >
                            <div className="absolute h-full w-full bg-teal-400/20 dark:bg-teal-400/10 rounded-md rotate-45 animate-diamond-pulse"></div>
                            <div className="absolute h-6 w-6 bg-teal-400/30 dark:bg-teal-400/20 rounded-sm rotate-45"></div>
                            <div className="h-4 w-4 bg-teal-400 dark:bg-teal-400 rounded-sm rotate-45 shadow-lg"></div>
                          </motion.div>
                        )}

                        <div className="flex justify-between items-start mb-3">
                          <h3 className={`text-xl md:text-2xl font-bold ${quicksand.className} ${post.highlight ? theme === "dark" ? "bg-gradient-to-r from-teal-300 to-cyan-500 bg-clip-text text-transparent" : "bg-gradient-to-r from-teal-600 to-cyan-700 bg-clip-text text-transparent" : theme === "dark" ? "text-white" : "text-gray-800"}`}>
                            {post.title}
                          </h3>
                          {post.highlight && (
                            <button 
                              onClick={(e) => toggleLike(post.id, e)}
                              className="flex items-center group transition-all duration-300"
                            >
                              <Heart 
                                size={16} 
                                className={`${likedPosts.has(post.id) ? "text-red-500" : "text-gray-400 group-hover:text-red-400"} mr-1 transition-colors duration-300`} 
                                fill={likedPosts.has(post.id) ? "currentColor" : "none"} 
                              />
                              <span className={`text-xs ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}>
                                {likedPosts.has(post.id) ? post.likes + 1 : post.likes}
                              </span>
                            </button>
                          )}
                        </div>

                        <div className={`flex items-center mb-3 text-sm gap-3 ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}>
                          <div className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            <span>{post.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock size={12} className="mr-1" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>

                        <p className={`${theme === "dark" ? "text-white/90" : "text-gray-700"} italic mb-4 line-clamp-2`}>{post.quote}</p>

                        <div className="flex items-center justify-between">
                          <motion.button
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center text-sm font-medium ${post.highlight ? theme === "dark" ? "text-teal-400" : "text-teal-600" : theme === "dark" ? "text-white/80" : "text-gray-700"} group`}
                          >
                            <span>Read full story</span>
                            <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}

            {/* Final timeline connector to bottom point */}
            <div className="relative pl-6 mb-16 sm:mb-28">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "100%" }}
                transition={{ duration: 0.5 }}
                className={`absolute left-7 top-0 bottom-0 ${activePost === blogPosts.length - 1
                  ? theme === "dark"
                    ? "w-[2px] bg-gradient-to-b from-teal-400 via-teal-500 to-teal-400/70"
                    : "w-[2px] bg-gradient-to-b from-teal-500 via-teal-600 to-teal-500/70"
                  : "w-[1px] border-dashed border-l border-gray-300 dark:border-gray-700"
                  } z-10`}
                style={{
                  position: 'absolute',
                  left: '7px',
                  top: '-10px',
                  height: 'calc(100% + 10px)'
                }}
              ></motion.div>
            </div>

            {/* Bottom timeline point */}
            <div ref={bottomPointRef} className="relative pl-6 mb-10 md:mb-20">
              <div className="h-10 w-10 relative z-20 flex items-center justify-center">
                <div className={`absolute inset-0 rounded-md rotate-45 ${activePost === blogPosts.length - 1
                  ? theme === "dark"
                    ? "bg-gradient-to-br from-teal-400 to-cyan-600 shadow-lg shadow-teal-500/20"
                    : "bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg shadow-teal-500/20"
                  : theme === "dark"
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white border border-gray-200 shadow-sm"
                  }`}>
                </div>
                {activePost === blogPosts.length - 1 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative z-10"
                  >
                    <Check size={18} className="text-white" />
                  </motion.div>
                ) : (
                  <div className={`h-2 w-2 rounded-full ${theme === "dark" ? "bg-teal-400" : "bg-teal-500"}`}></div>
                )}
              </div>

              {activePost === blogPosts.length - 1 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className={`absolute -inset-2 rounded-lg rotate-45 ${theme === "dark"
                    ? "bg-teal-400/10"
                    : "bg-teal-500/10"
                    }`}
                  style={{ top: "50%", left: "26px", transform: "translateY(-50%) rotate(45deg)", width: "40px", height: "40px" }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right content area - description panel (only visible on xl screens and up) */}
        <div className="hidden xl:block xl:w-[45%] pt-8 pl-0 pr-4">
          <div
            ref={descriptionRef}
            className={`backdrop-blur-md ${theme === "dark" ? "bg-gradient-to-br from-gray-800/40 to-gray-900/40" : "bg-gradient-to-br from-white/60 to-teal-50/60"} border ${theme === "dark" ? "border-white/10" : "border-teal-200/50"} rounded-xl p-8 max-w-md transition-all duration-300 shadow-xl ${theme === "dark" ? "shadow-black/30" : "shadow-teal-900/10"}`}
            style={{
              position: 'fixed',
              width: 'calc(42% - 2rem)',
              maxWidth: '520px',
              right: '1.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              boxShadow: theme === "dark"
                ? "0 20px 40px -15px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 0, 0, 0.3) inset"
                : "0 20px 40px -15px rgba(0, 0, 0, 0.15), 0 0 15px rgba(0, 0, 0, 0.05) inset",
              zIndex: 30
            }}
          >
            {/* Small diagonal decorative line */}
            <div className="absolute top-0 left-0 w-16 h-1 bg-gradient-to-r from-transparent to-teal-400 dark:to-teal-400 transform rotate-45 translate-x-6 -translate-y-0.5"></div>

            <div className="flex justify-between items-start">
              <motion.h2
                key={`title-${activePost}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`text-2xl font-bold mb-4 ${theme === "dark" ? "bg-gradient-to-r from-teal-300 to-cyan-500 bg-clip-text text-transparent" : "bg-gradient-to-r from-teal-600 to-cyan-700 bg-clip-text text-transparent"} ${quicksand.className}`}
              >
                {blogPosts[activePost].title}
              </motion.h2>
              
              <button 
                onClick={(e) => toggleLike(blogPosts[activePost].id, e)}
                className="flex items-center group transition-all duration-300"
              >
                <Heart 
                  size={18} 
                  className={`${likedPosts.has(blogPosts[activePost].id) ? "text-red-500" : "text-gray-400 group-hover:text-red-400"} mr-1 transition-colors duration-300`} 
                  fill={likedPosts.has(blogPosts[activePost].id) ? "currentColor" : "none"} 
                />
                <span className={`text-xs ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}>
                  {likedPosts.has(blogPosts[activePost].id) ? blogPosts[activePost].likes + 1 : blogPosts[activePost].likes}
                </span>
              </button>
            </div>

            <div className="flex items-center mb-4 text-sm gap-3 pb-4 border-b border-teal-200/20 dark:border-white/10">
              <div className={`flex items-center ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}>
                <Calendar size={14} className="mr-1" />
                <span>{blogPosts[activePost].date}</span>
              </div>
              <div className={`flex items-center ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}>
                <Clock size={14} className="mr-1" />
                <span>{blogPosts[activePost].readTime}</span>
              </div>
            </div>

            {/* Quote section */}
            <div className="mb-4 pl-3 border-l-2 border-teal-400/30 dark:border-teal-400/30 italic">
              <p className={`${theme === "dark" ? "text-white/80" : "text-gray-600"} text-sm`}>"{blogPosts[activePost].quote}"</p>
            </div>

            <motion.div
              key={`content-${activePost}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`space-y-3 ${theme === "dark" ? "text-white/80" : "text-gray-700"} text-base max-h-[300px] overflow-y-auto pr-4 styled-scrollbar`}
            >
              <p className="leading-relaxed">{blogPosts[activePost].description}</p>
            </motion.div>

            {/* Read more button */}
            <div className="mt-6 text-right">
              <motion.button
                whileHover={{ scale: 1.03, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleReadFullStory(activePost)}
                className={`inline-flex items-center px-4 py-2 rounded-lg ${theme === "dark"
                  ? "bg-gradient-to-r from-teal-400/20 to-cyan-500/20 hover:from-teal-400/30 hover:to-cyan-500/30 text-teal-300"
                  : "bg-gradient-to-r from-teal-100 to-cyan-100 hover:from-teal-200 hover:to-cyan-200 text-teal-700"}`}
              >
                Read full story
                <ChevronRight size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
            </div>
          </div>
        </div>
      </main>

      {/* Full Story Modal - Completely redesigned for better responsiveness */}
      <AnimatePresence>
        {showFullStory && fullStoryPost !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4"
          >
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={closeFullStory}></div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-4xl sm:rounded-xl shadow-2xl relative z-10 flex flex-col overflow-hidden`}
            >
              {/* Cover image */}
              <div className="w-full h-56 sm:h-72 relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent z-10"></div>
                <div className={`absolute inset-0 ${theme === "dark" ? "bg-gradient-to-b from-transparent via-transparent to-gray-900" : "bg-gradient-to-b from-transparent via-transparent to-white"} z-10`}></div>
                <img
                  src={`${blogPosts[fullStoryPost].image}?auto=format&fit=crop&w=1200&q=90`}
                  alt={blogPosts[fullStoryPost].title}
                  className="w-full h-full object-cover"
                />

                {/* Back button - only on larger screens */}
                <button
                  onClick={closeFullStory}
                  className={`absolute top-6 left-6 z-20 flex items-center justify-center p-2 rounded-full ${theme === "dark" ? "bg-black/30 hover:bg-black/50" : "bg-white/30 hover:bg-white/50"} backdrop-blur-md transition-all group`}
                >
                  <ArrowLeft size={20} className="text-white group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Content - scrollable area */}
              <div className="flex-1 p-6 sm:p-8 overflow-y-auto styled-scrollbar">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div className={`px-3 py-1 rounded-full text-xs ${theme === "dark" ? "bg-teal-400/20 text-teal-300" : "bg-teal-100 text-teal-700"}`}>
                    {blogPosts[fullStoryPost].readTime}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
                    {blogPosts[fullStoryPost].date}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"} ${quicksand.className}`}>
                    {blogPosts[fullStoryPost].title}
                  </h1>
                  
                  <button 
                    onClick={(e) => toggleLike(blogPosts[fullStoryPost].id, e)}
                    className="flex items-center group transition-all duration-300"
                  >
                    <Heart 
                      size={22} 
                      className={`${likedPosts.has(blogPosts[fullStoryPost].id) ? "text-red-500" : "text-gray-400 group-hover:text-red-400"} mr-1 transition-colors duration-300`} 
                      fill={likedPosts.has(blogPosts[fullStoryPost].id) ? "currentColor" : "none"} 
                    />
                    <span className={`text-sm ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}>
                      {likedPosts.has(blogPosts[fullStoryPost].id) ? blogPosts[fullStoryPost].likes + 1 : blogPosts[fullStoryPost].likes}
                    </span>
                  </button>
                </div>

                <blockquote className={`text-base sm:text-xl italic mb-6 sm:mb-8 pl-4 border-l-4 ${theme === "dark" ? "border-teal-400 text-white/80" : "border-teal-500 text-gray-700"}`}>
                  "{blogPosts[fullStoryPost].quote}"
                </blockquote>

                <div className={`prose max-w-none prose-sm sm:prose ${theme === "dark" ? "prose-invert" : ""}`}>
                  {/* Generated full story content */}
                  <p className={`mb-4 sm:mb-6 leading-relaxed ${theme === "dark" ? "text-white/80" : "text-gray-700"}`}>
                    {blogPosts[fullStoryPost].description}
                  </p>

                  <p className={`mb-4 sm:mb-6 leading-relaxed ${theme === "dark" ? "text-white/80" : "text-gray-700"}`}>
                    The morning sun cast long shadows as I ventured further into the unknown. This journey wasn't planned—at least not in the way it had unfolded—but there was something liberating about letting go of expectations. Around me, the landscape gradually transformed, each step revealing new possibilities, new stories waiting to be told.
                  </p>

                  <p className={`mb-4 sm:mb-6 leading-relaxed ${theme === "dark" ? "text-white/80" : "text-gray-700"}`}>
                    People I met along the way shared their own tales—some of triumph, others of loss—but each contributing to the rich tapestry of human experience. It's easy to forget how connected we all are when surrounded by the familiar comfort of routine. Out here, those barriers dissolved, revealing our shared humanity beneath the surface differences.
                  </p>

                  <h2 className={`text-xl sm:text-2xl font-bold my-4 sm:my-6 ${theme === "dark" ? "text-white" : "text-gray-900"} ${quicksand.className}`}>
                    The Turning Point
                  </h2>

                  <p className={`mb-4 sm:mb-6 leading-relaxed ${theme === "dark" ? "text-white/80" : "text-gray-700"}`}>
                    What began as a simple exploration had evolved into something deeper—a journey not just through physical spaces, but through ideas and emotions I had long neglected. Each challenge overcome was a lesson learned, each beautiful vista a reminder of why the difficult path is often worth taking.
                  </p>

                  <p className={`mb-4 sm:mb-6 leading-relaxed ${theme === "dark" ? "text-white/80" : "text-gray-700"}`}>
                    As the days turned to weeks, I found myself thinking less about the destination and more about the journey itself. The small moments—a conversation with a stranger, the perfect sunset, the taste of unfamiliar food—these were the true souvenirs, more valuable than any photograph or keepsake.
                  </p>

                  <h2 className={`text-xl sm:text-2xl font-bold my-4 sm:my-6 ${theme === "dark" ? "text-white" : "text-gray-900"} ${quicksand.className}`}>
                    Looking Ahead
                  </h2>

                  <p className={`mb-4 sm:mb-6 leading-relaxed ${theme === "dark" ? "text-white/80" : "text-gray-700"}`}>
                    I don't know where this path will ultimately lead, but I've come to realize that not knowing is part of the adventure. There will be more challenges ahead, more uncertainty, more moments of doubt—but also more wonder, more discovery, more growth.
                  </p>

                  <p className={`mb-4 sm:mb-6 leading-relaxed ${theme === "dark" ? "text-white/80" : "text-gray-700"}`}>
                    And so I continue forward, one step at a time, embracing both the joys and hardships that come with charting one's own course. After all, the most meaningful journeys aren't about reaching a destination—they're about becoming the person you're meant to be along the way.
                  </p>
                </div>

                {/* Share section */}
                <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-800">
                  <h3 className={`font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Share this story</h3>
                  <div className="flex gap-2">
                    <button className={`p-2 rounded-full ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"} transition-colors`}>
                      <Twitter size={18} className={theme === "dark" ? "text-white/70" : "text-gray-700"} />
                    </button>
                    <button className={`p-2 rounded-full ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"} transition-colors`}>
                      <Facebook size={18} className={theme === "dark" ? "text-white/70" : "text-gray-700"} />
                    </button>
                    <button className={`p-2 rounded-full ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"} transition-colors`}>
                      <Linkedin size={18} className={theme === "dark" ? "text-white/70" : "text-gray-700"} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom indicator - only visible on smaller screens, hidden when footer is visible */}
      <div className={`xl:hidden fixed bottom-0 left-0 right-0 p-4 z-40 transition-all duration-300 ${isFooterVisible ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className={`rounded-xl p-4 backdrop-blur-md ${theme === "dark" ? "bg-gradient-to-br from-gray-800/90 to-gray-900/90" : "bg-gradient-to-br from-white/90 to-teal-50/90"} border ${theme === "dark" ? "border-white/10" : "border-teal-200/50"} shadow-xl`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h3 className={`text-lg font-bold ${theme === "dark" ? "bg-gradient-to-r from-teal-300 to-cyan-500 bg-clip-text text-transparent" : "bg-gradient-to-r from-teal-600 to-cyan-700 bg-clip-text text-transparent"} ${quicksand.className}`}>
                {blogPosts[activePost].title}
              </h3>
              
              <button 
                onClick={(e) => toggleLike(blogPosts[activePost].id, e)}
                className="flex items-center group transition-all duration-300 ml-3"
              >
                <Heart 
                  size={16} 
                  className={`${likedPosts.has(blogPosts[activePost].id) ? "text-red-500" : "text-gray-400 group-hover:text-red-400"} transition-colors duration-300`} 
                  fill={likedPosts.has(blogPosts[activePost].id) ? "currentColor" : "none"} 
                />
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleReadFullStory(activePost)}
              className={`px-3 py-1 rounded-lg ${theme === "dark"
                ? "bg-gradient-to-r from-teal-400/20 to-cyan-500/20 text-teal-300"
                : "bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700"} flex items-center text-sm`}
            >
              <span>Read</span>
              <ChevronRight size={14} className="ml-1" />
            </motion.button>
          </div>

          <div className="flex items-center my-2 text-xs gap-3">
            <div className={`flex items-center ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}>
              <Calendar size={12} className="mr-1" />
              <span>{blogPosts[activePost].date}</span>
            </div>
            <div className={`flex items-center ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}>
              <Clock size={12} className="mr-1" />
              <span>{blogPosts[activePost].readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with extra space to allow viewing the last blog description */}
      <footer
        ref={footerRef}
        className={`relative z-10 ${theme === "dark" ? "bg-gradient-to-b from-gray-900 to-black border-t border-white/10" : "bg-gradient-to-b from-teal-50 to-white border-t border-teal-200/50"}`}
      >
        <div className="container mx-auto px-4">
          <div className={`py-6 flex flex-col md:flex-row justify-between items-center`}>
            <div className="flex items-center flex-wrap justify-center md:justify-start mb-4 md:mb-0">
              <div className="flex items-center mr-6">
                <h3 className={`text-xl font-bold ${satisfy.className} ${theme === "dark" ? "text-white" : "text-teal-700"}`}>
                  Journey<span className={theme === "dark" ? "text-teal-400" : "text-teal-500"}>Timeline</span>
                </h3>
              </div>
              <p className={`text-xs ${theme === "dark" ? "text-white/50" : "text-gray-500"} mr-6`}>
                © {new Date().getFullYear()} JourneyTimeline. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-3">
              <a href="#" className={`${theme === "dark" ? "bg-white/5 hover:bg-white/10" : "bg-teal-100/50 hover:bg-teal-100"} p-2 rounded-full transition-all`}>
                <Twitter size={20} className={theme === "dark" ? "text-white/70" : "text-teal-700"} />
              </a>
              <a href="#" className={`${theme === "dark" ? "bg-white/5 hover:bg-white/10" : "bg-teal-100/50 hover:bg-teal-100"} p-2 rounded-full transition-all`}>
                <Instagram size={20} className={theme === "dark" ? "text-white/70" : "text-teal-700"} />
              </a>
              <a href="#" className={`${theme === "dark" ? "bg-white/5 hover:bg-white/10" : "bg-teal-100/50 hover:bg-teal-100"} p-2 rounded-full transition-all`}>
                <Facebook size={20} className={theme === "dark" ? "text-white/70" : "text-teal-700"} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .styled-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .styled-scrollbar::-webkit-scrollbar-track {
          background: ${theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"};
          border-radius: 10px;
        }
        .styled-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"};
          border-radius: 10px;
        }
        .styled-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"};
        }
        
        @keyframes diamond-pulse {
          0%, 100% {
            transform: scale(1) rotate(45deg);
          }
          50% {
            transform: scale(1.05) rotate(45deg);
          }
        }
        
        @keyframes slide-in {
          0% {
            transform: translateX(-10px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s forwards;
        }
        
        .animate-diamond-pulse {
          animation: diamond-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}