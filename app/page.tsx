"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiSun, FiMoon, FiUser, FiHash, FiVideo, FiX } from "react-icons/fi";
import { FaUser, FaHashtag, FaPlay, FaPause } from "react-icons/fa";
import { Poppins, Montserrat } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

const montserrat = Montserrat({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

type Category = "all" | "accounts" | "tags" | "videos";

interface Account {
  id: string;
  name: string;
  username: string;
  followers: number;
  avatar: string;
}

interface Tag {
  id: string;
  name: string;
  posts: number;
}

interface Video {
  id: string;
  title: string;
  views: number;
  duration: string;
  thumbnail: string;
  creator: string;
}

interface PopularSearch {
  id: string;
  term: string;
  count: number;
  category: "accounts" | "tags" | "videos";
}

type SearchResult = {
  accounts: Account[];
  tags: Tag[];
  videos: Video[];
};

const MOCK_DATA = {
  accounts: [
    {
      id: "1",
      name: "Sarah Johnson",
      username: "sarahj",
      followers: 15400,
      avatar: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      id: "2",
      name: "Michael Chen",
      username: "mikechen",
      followers: 8900,
      avatar: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
      id: "3",
      name: "Emma Wilson",
      username: "emmaw",
      followers: 23600,
      avatar: "https://randomuser.me/api/portraits/women/3.jpg"
    },
    {
      id: "4",
      name: "David Thompson",
      username: "davidt",
      followers: 42100,
      avatar: "https://randomuser.me/api/portraits/men/4.jpg"
    },
    {
      id: "5",
      name: "Sophia Garcia",
      username: "sophiag",
      followers: 31800,
      avatar: "https://randomuser.me/api/portraits/women/5.jpg"
    },
    {
      id: "6",
      name: "James Wilson",
      username: "jamesw",
      followers: 9700,
      avatar: "https://randomuser.me/api/portraits/men/6.jpg"
    },
    {
      id: "7",
      name: "Olivia Martinez",
      username: "oliviam",
      followers: 27300,
      avatar: "https://randomuser.me/api/portraits/women/7.jpg"
    },
    {
      id: "8",
      name: "Daniel Lee",
      username: "daniell",
      followers: 19500,
      avatar: "https://randomuser.me/api/portraits/men/8.jpg"
    },
    {
      id: "9",
      name: "Ava Brown",
      username: "avab",
      followers: 36200,
      avatar: "https://randomuser.me/api/portraits/women/9.jpg"
    },
    {
      id: "10",
      name: "Ethan Davis",
      username: "ethand",
      followers: 14700,
      avatar: "https://randomuser.me/api/portraits/men/10.jpg"
    }
  ],
  tags: [
    {
      id: "1",
      name: "photography",
      posts: 12500
    },
    {
      id: "2",
      name: "travel",
      posts: 38700
    },
    {
      id: "3",
      name: "food",
      posts: 24300
    },
    {
      id: "4",
      name: "fitness",
      posts: 18900
    },
    {
      id: "5",
      name: "technology",
      posts: 9800
    },
    {
      id: "6",
      name: "fashion",
      posts: 31200
    },
    {
      id: "7",
      name: "art",
      posts: 16700
    },
    {
      id: "8",
      name: "music",
      posts: 29500
    },
    {
      id: "9",
      name: "nature",
      posts: 22100
    },
    {
      id: "10",
      name: "gaming",
      posts: 27800
    },
    {
      id: "11",
      name: "design",
      posts: 14200
    },
    {
      id: "12",
      name: "books",
      posts: 8300
    },
    {
      id: "13",
      name: "trending",
      posts: 47600
    },
    {
      id: "14",
      name: "sports",
      posts: 33900
    },
    {
      id: "15",
      name: "lifestyle",
      posts: 19200
    }
  ],
  videos: [
    {
      id: "1",
      title: "Amazing Photography Tips for Beginners",
      views: 324000,
      duration: "12:45",
      thumbnail: "https://picsum.photos/seed/vid1/300/200",
      creator: "PhotoPro"
    },
    {
      id: "2",
      title: "Travel Vlog: Exploring Japan",
      views: 198000,
      duration: "18:23",
      thumbnail: "https://picsum.photos/seed/vid2/300/200",
      creator: "TravelWithMe"
    },
    {
      id: "3",
      title: "Cooking Tutorial: Perfect Pasta",
      views: 567000,
      duration: "15:10",
      thumbnail: "https://picsum.photos/seed/vid3/300/200",
      creator: "ChefMasters"
    },
    {
      id: "4",
      title: "Home Workout Routine - No Equipment Needed",
      views: 429000,
      duration: "22:34",
      thumbnail: "https://picsum.photos/seed/vid4/300/200",
      creator: "FitLife"
    },
    {
      id: "5",
      title: "Tech Review: Latest Smartphone Comparison",
      views: 712000,
      duration: "14:29",
      thumbnail: "https://picsum.photos/seed/vid5/300/200",
      creator: "TechToday"
    },
    {
      id: "6",
      title: "Fashion Haul: Summer Collection 2024",
      views: 287000,
      duration: "19:52",
      thumbnail: "https://picsum.photos/seed/vid6/300/200",
      creator: "StyleGuru"
    },
    {
      id: "7",
      title: "Digital Art Tutorial: Character Design",
      views: 163000,
      duration: "27:16",
      thumbnail: "https://picsum.photos/seed/vid7/300/200",
      creator: "ArtCreators"
    },
    {
      id: "8",
      title: "Music Production Basics: Beat Making",
      views: 398000,
      duration: "31:08",
      thumbnail: "https://picsum.photos/seed/vid8/300/200",
      creator: "MusicMakers"
    },
    {
      id: "9",
      title: "Nature Documentary: Amazon Rainforest",
      views: 876000,
      duration: "45:22",
      thumbnail: "https://picsum.photos/seed/vid9/300/200",
      creator: "NatureExplorer"
    },
    {
      id: "10",
      title: "Gaming Stream Highlights: Tournament Finals",
      views: 529000,
      duration: "16:47",
      thumbnail: "https://picsum.photos/seed/vid10/300/200",
      creator: "GameMaster"
    },
    {
      id: "11",
      title: "UI/UX Design Tips for Modern Apps",
      views: 241000,
      duration: "20:33",
      thumbnail: "https://picsum.photos/seed/vid11/300/200",
      creator: "DesignPro"
    },
    {
      id: "12",
      title: "Book Review: Must-Read Novels of 2024",
      views: 137000,
      duration: "13:51",
      thumbnail: "https://picsum.photos/seed/vid12/300/200",
      creator: "BookWorm"
    }
  ],
  popularSearches: [
    {
      id: "1",
      term: "photography",
      count: 45200,
      category: "tags"
    },
    {
      id: "2",
      term: "travel",
      count: 38700,
      category: "tags"
    },
    {
      id: "3",
      term: "Emma Wilson",
      count: 32100,
      category: "accounts"
    },
    {
      id: "5",
      term: "Technology Review",
      count: 26800,
      category: "videos"
    },
    {
      id: "6",
      term: "David Thompson",
      count: 23500,
      category: "accounts"
    },
    {
      id: "7",
      term: "Music Production",
      count: 21900,
      category: "videos"
    },
    {
      id: "8",
      term: "gaming",
      count: 19200,
      category: "tags"
    },
    {
      id: "9",
      term: "Nature Documentary",
      count: 18600,
      category: "videos"
    },
    {
      id: "10",
      term: "Sophia Garcia",
      count: 17500,
      category: "accounts"
    }
  ]
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [btnClicked, setBtnClicked] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [searchResults, setSearchResults] = useState<SearchResult>({
    accounts: [],
    tags: [],
    videos: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const [followedAccounts, setFollowedAccounts] = useState<string[]>([]);
  const [exploredTags, setExploredTags] = useState<string[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeVideoData, setActiveVideoData] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const featured = useMemo(() => {
    return {
      accounts: [...searchResults.accounts].sort(() => 0.5 - Math.random()).slice(0, 3),
      tags: [...searchResults.tags].sort(() => 0.5 - Math.random()).slice(0, 3),
      videos: [...searchResults.videos].sort(() => 0.5 - Math.random()).slice(0, 3)
    };
  }, [searchResults.accounts, searchResults.tags, searchResults.videos]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark-theme", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  const mockSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults({
        accounts: [],
        tags: [],
        videos: [],
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const queryLower = query.toLowerCase();

      const filteredAccounts = MOCK_DATA.accounts.filter(account =>
        account.name.toLowerCase().includes(queryLower) ||
        account.username.toLowerCase().includes(queryLower)
      );

      const filteredTags = MOCK_DATA.tags.filter(tag =>
        tag.name.toLowerCase().includes(queryLower)
      );

      const filteredVideos = MOCK_DATA.videos.filter(video =>
        video.title.toLowerCase().includes(queryLower) ||
        video.creator.toLowerCase().includes(queryLower)
      );

      const results: SearchResult = {
        accounts: filteredAccounts,
        tags: filteredTags,
        videos: filteredVideos
      };

      setSearchResults(results);
      setIsLoading(false);
    }, 800);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setBtnClicked(true);
    mockSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults({
      accounts: [],
      tags: [],
      videos: [],
    });
  };
  useEffect(() => {
    setBtnClicked(false);
  }, [searchQuery])

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
    { id: "all", label: "All", icon: <FiSearch /> },
    { id: "accounts", label: "Accounts", icon: <FiUser /> },
    { id: "tags", label: "Tags", icon: <FiHash /> },
    { id: "videos", label: "Videos", icon: <FiVideo /> },
  ];

  const hasResults =
    searchResults.accounts.length > 0 ||
    searchResults.tags.length > 0 ||
    searchResults.videos.length > 0;

  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      :root {
        --font-poppins: ${poppins.style.fontFamily};
        --font-montserrat: ${montserrat.style.fontFamily};
      }
      .bg-grid-pattern {
        background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${theme === 'light' ? '%239C92AC' : '%23ffffff'}' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      }
      .font-montserrat {
        font-family: var(--font-montserrat);
      }
      .font-poppins {
        font-family: var(--font-poppins);
      }
      ::-webkit-scrollbar {
        height: 6px;
        width: 6px;
      }
      ::-webkit-scrollbar-track {
        background: ${theme === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"};
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb {
        background: ${theme === "light" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)"};
        border-radius: 10px;
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, [theme, poppins.style.fontFamily, montserrat.style.fontFamily]);

  // Find active video data when activeVideo changes
  useEffect(() => {
    if (activeVideo) {
      const videoData = [...MOCK_DATA.videos, ...searchResults.videos].find(v => v.id === activeVideo);
      if (videoData) {
        setActiveVideoData(videoData);
      }
    } else {
      setActiveVideoData(null);
    }
  }, [activeVideo, searchResults.videos]);

  // Toggle play/pause state
  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };
  
  // Reset isPlaying when modal is closed
  useEffect(() => {
    if (!activeVideo) {
      setIsPlaying(false);
    }
  }, [activeVideo]);

  return (
    <div className={`min-h-screen bg-gradient-to-br transition-all duration-300 ${theme === "light"
      ? "from-indigo-50 via-purple-50 to-pink-50 text-gray-800"
      : "from-gray-900 via-purple-900 to-gray-900 text-gray-100"
      } ${poppins.variable} ${montserrat.variable} font-poppins`}>

      <div className="relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
          <motion.div
            className="absolute rounded-full w-96 h-96 bg-purple-400 filter blur-3xl opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div
            className="absolute right-0 bottom-0 rounded-full w-96 h-96 bg-pink-400 filter blur-3xl opacity-20"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-10 relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className={`text-3xl font-bold font-montserrat ${theme === "light" ? "text-purple-600" : "text-purple-300"}`}>
              Social<span className="text-pink-500">Search</span>
            </h1>
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-full ${theme === "light"
                ? "bg-white text-gray-800 shadow-lg ring-1 ring-purple-100"
                : "bg-gray-800 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"}`}
            >
              {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
            </button>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`${theme === "light"
              ? "bg-white/90 shadow-xl backdrop-blur-lg ring-1 ring-purple-100"
              : "bg-gray-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.3)]"} 
              rounded-2xl p-6 mb-8`}
          >
            <form onSubmit={handleSearch} className="relative">
              <div className="flex flex-row gap-2 items-center">
                <div className={`flex items-center overflow-hidden rounded-xl flex-1 ${theme === "light"
                  ? "bg-gray-100"
                  : "bg-gray-700"}`}>
                  <div className="pl-4">
                    <FiSearch className={theme === "light" ? "text-gray-500" : "text-gray-300"} size={20} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for accounts, tags, or videos..."
                    autoFocus
                    className={`w-full p-4 outline-none font-poppins ${theme === "light"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-gray-700 text-white"}`}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className={`pr-4 ${theme === "light" ? "text-gray-500" : "text-gray-300"} hover:text-pink-500`}
                    >
                      <FiX size={20} />
                    </button>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className={`p-4 sm:py-3 sm:px-6 rounded-xl font-medium font-poppins flex-shrink-0 flex items-center justify-center ${theme === "light"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_4px_15px_rgba(157,23,77,0.2)]"}`}
                >
                  <FiSearch className="sm:hidden" size={20} />
                  <span className="hidden sm:block">Search</span>
                </motion.button>
              </div>
            </form>
          </motion.div>

          <div className="mb-8">
            <div className={`flex space-x-2 overflow-x-auto pb-2 ${theme === "light"
              ? "scrollbar-thin scrollbar-thumb-gray-300"
              : "scrollbar-thin scrollbar-thumb-gray-600"}`}>
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center py-2 px-4 rounded-full whitespace-nowrap font-medium font-poppins ${activeCategory === category.id
                    ? theme === "light"
                      ? "bg-purple-600 text-white"
                      : "bg-purple-500 text-white"
                    : theme === "light"
                      ? "bg-white text-gray-700 hover:bg-gray-100"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                </motion.button>
              ))}
            </div>
          </div>

          {isLoading && (
            <div className="flex justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className={`w-10 h-10 border-4 rounded-full ${theme === "light"
                  ? "border-t-purple-500 border-purple-200"
                  : "border-t-purple-400 border-purple-800"}`}
              />
            </div>
          )}

          {/* Video Modal - Single instance outside of the video list */}
          <AnimatePresence>
            {activeVideoData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                onClick={() => setActiveVideo(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="aspect-video bg-black relative">
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <img
                        src={activeVideoData.thumbnail}
                        alt={activeVideoData.title}
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center cursor-pointer"
                          onClick={togglePlayPause}
                        >
                          {isPlaying ? (
                            <FaPause size={30} className="text-pink-600" />
                          ) : (
                            <FaPlay size={30} className="text-pink-600 ml-1" />
                          )}
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-900">
                    <h3 className="text-xl font-bold font-poppins text-white mb-2">{activeVideoData.title}</h3>
                    <p className="text-gray-300 font-poppins">{formatNumber(activeVideoData.views)} views • By {activeVideoData.creator}</p>
                  </div>
                  <button
                    onClick={() => setActiveVideo(null)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white"
                  >
                    <FiX size={24} />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {activeCategory === "all" && !hasResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`p-8 text-center rounded-xl ${theme === "light"
                    ? "bg-white/80 shadow-lg"
                    : "bg-gray-800/80 shadow-[0_8px_20px_rgba(0,0,0,0.2)]"} 
                    backdrop-filter backdrop-blur-md`}
                >
                  <div className="mb-6">
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${theme === "light"
                      ? "bg-gradient-to-br from-purple-100 to-pink-100"
                      : "bg-gradient-to-br from-purple-900/30 to-pink-900/30"}`}
                    >
                      <FiSearch size={36} className={theme === "light" ? "text-purple-500" : "text-purple-400"} />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold font-montserrat mb-3">Welcome to SocialSearch</h2>
                  <p className={`mb-6 max-w-md mx-auto font-poppins ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
                    Discover accounts, trending tags, and popular videos by searching for topics that interest you.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {["photography", "travel", "food", "technology", "fashion"].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          setBtnClicked(true);
                          mockSearch(suggestion);
                        }}
                        className={`px-4 py-2 rounded-full text-sm capitalize font-poppins ${theme === "light"
                          ? "bg-purple-100 text-purple-600 hover:bg-purple-200"
                          : "bg-purple-900/40 text-purple-300 hover:bg-purple-800/60"}`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-12 border-t pt-8">
                    <h3 className="text-xl font-bold font-montserrat mb-5">Popular Searches</h3>
                    
                    <div className="space-y-8">
                      {/* Popular Accounts Searches */}
                      <div>
                        <div className="flex items-center mb-3">
                          <FaUser className={`mr-2 ${theme === "light" ? "text-purple-600" : "text-purple-400"}`} />
                          <h4 className="font-bold font-montserrat">Popular Account Searches</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {MOCK_DATA.popularSearches
                            .filter(search => search.category === "accounts")
                            .map((search) => (
                              <motion.div
                                key={search.id}
                                whileHover={{ scale: 1.03 }}
                                onClick={() => {
                                  setSearchQuery(search.term);
                                  setBtnClicked(true);
                                  mockSearch(search.term);
                                }}
                                className={`p-3 rounded-lg cursor-pointer ${theme === "light"
                                  ? "bg-gradient-to-r from-purple-50 to-purple-100 shadow-sm hover:shadow-md"
                                  : "bg-gradient-to-r from-purple-900/20 to-purple-800/30 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.2)]"}`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="overflow-hidden">
                                    <p className="font-medium truncate">{search.term}</p>
                                    <p className={`text-xs ${theme === "light" ? "text-purple-600" : "text-purple-400"}`}>
                                      {formatNumber(search.count)} searches
                                    </p>
                                  </div>
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === "light"
                                    ? "bg-white text-purple-500"
                                    : "bg-gray-800 text-purple-400"}`}>
                                    <FiUser size={14} />
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                        </div>
                      </div>

                      {/* Popular Tag Searches */}
                      <div>
                        <div className="flex items-center mb-3">
                          <FaHashtag className={`mr-2 ${theme === "light" ? "text-pink-600" : "text-pink-400"}`} />
                          <h4 className="font-bold font-montserrat">Popular Tag Searches</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {MOCK_DATA.popularSearches
                            .filter(search => search.category === "tags")
                            .map((search) => (
                              <motion.div
                                key={search.id}
                                whileHover={{ scale: 1.03 }}
                                onClick={() => {
                                  setSearchQuery(search.term);
                                  setBtnClicked(true);
                                  mockSearch(search.term);
                                }}
                                className={`p-3 rounded-lg cursor-pointer ${theme === "light"
                                  ? "bg-gradient-to-r from-pink-50 to-pink-100 shadow-sm hover:shadow-md"
                                  : "bg-gradient-to-r from-pink-900/20 to-pink-800/30 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.2)]"}`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="overflow-hidden">
                                    <p className="font-medium truncate">#{search.term}</p>
                                    <p className={`text-xs ${theme === "light" ? "text-pink-600" : "text-pink-400"}`}>
                                      {formatNumber(search.count)} searches
                                    </p>
                                  </div>
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === "light"
                                    ? "bg-white text-pink-500"
                                    : "bg-gray-800 text-pink-400"}`}>
                                    <FiHash size={14} />
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                        </div>
                      </div>

                      {/* Popular Video Searches */}
                      <div>
                        <div className="flex items-center mb-3">
                          <FaPlay className={`mr-2 ${theme === "light" ? "text-blue-600" : "text-blue-400"}`} />
                          <h4 className="font-bold font-montserrat">Popular Video Searches</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {MOCK_DATA.popularSearches
                            .filter(search => search.category === "videos")
                            .map((search) => (
                              <motion.div
                                key={search.id}
                                whileHover={{ scale: 1.03 }}
                                onClick={() => {
                                  setSearchQuery(search.term);
                                  setBtnClicked(true);
                                  mockSearch(search.term);
                                }}
                                className={`p-3 rounded-lg cursor-pointer ${theme === "light"
                                  ? "bg-gradient-to-r from-blue-50 to-blue-100 shadow-sm hover:shadow-md"
                                  : "bg-gradient-to-r from-blue-900/20 to-blue-800/30 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.2)]"}`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="overflow-hidden">
                                    <p className="font-medium truncate">{search.term}</p>
                                    <p className={`text-xs ${theme === "light" ? "text-blue-600" : "text-blue-400"}`}>
                                      {formatNumber(search.count)} searches
                                    </p>
                                  </div>
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === "light"
                                    ? "bg-white text-blue-500"
                                    : "bg-gray-800 text-blue-400"}`}>
                                    <FiVideo size={14} />
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeCategory === "all" && hasResults && (
                <div className="mb-10">
                  <h2 className={`text-2xl font-bold font-montserrat mb-6 ${theme === "light" ? "text-purple-600" : "text-purple-300"}`}>
                    Discover
                  </h2>

                  {featured.accounts.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <FaUser className={`mr-2 ${theme === "light" ? "text-purple-600" : "text-purple-400"}`} />
                          <h3 className="text-xl font-bold font-montserrat">Featured Accounts</h3>
                        </div>
                        <button
                          onClick={() => setActiveCategory("accounts")}
                          className={`text-sm ${theme === "light" ? "text-purple-600" : "text-purple-400"} font-medium font-poppins`}
                        >
                          View all →
                        </button>
                      </div>
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                        {featured.accounts.map((account) => (
                          <motion.div
                            key={account.id}
                            whileHover={{ y: -5 }}
                            className={`rounded-xl overflow-hidden ${theme === "light"
                              ? "bg-white/80 shadow-md"
                              : "bg-gray-800/80 shadow-[0_8px_20px_rgba(0,0,0,0.2)]"} 
                              backdrop-filter backdrop-blur-md p-4`}
                          >
                            <div className="flex items-center">
                              <div className="relative w-14 h-14 rounded-full overflow-hidden mr-4 flex-shrink-0">
                                <img
                                  src={account.avatar}
                                  alt={account.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-grow min-w-0">
                                <h3 className="font-bold font-poppins truncate">{account.name}</h3>
                                <p className={`text-sm truncate font-poppins ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                                  @{account.username}
                                </p>
                                <p className={`text-xs font-poppins ${theme === "light" ? "text-purple-600" : "text-purple-400"}`}>
                                  {formatNumber(account.followers)} followers
                                </p>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setFollowedAccounts(prev => {
                                  if (prev.includes(account.id)) {
                                    return prev.filter(id => id !== account.id);
                                  } else {
                                    return [...prev, account.id];
                                  }
                                })}
                                className={`ml-2 flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium font-poppins ${followedAccounts.includes(account.id)
                                  ? theme === "light"
                                    ? "bg-purple-600 text-white"
                                    : "bg-purple-500 text-white"
                                  : theme === "light"
                                    ? "bg-purple-100 text-purple-600 hover:bg-purple-200"
                                    : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"
                                  }`}
                              >
                                {followedAccounts.includes(account.id) ? "Following" : "Follow"}
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {featured.tags.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <FaHashtag className={`mr-2 ${theme === "light" ? "text-pink-600" : "text-pink-400"}`} />
                          <h3 className="text-xl font-bold font-montserrat">Trending Tags</h3>
                        </div>
                        <button
                          onClick={() => setActiveCategory("tags")}
                          className={`text-sm ${theme === "light" ? "text-pink-600" : "text-pink-400"} font-medium font-poppins`}
                        >
                          View all →
                        </button>
                      </div>
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                        {featured.tags.map((tag) => (
                          <motion.div
                            key={tag.id}
                            whileHover={{ y: -5 }}
                            className={`rounded-xl ${theme === "light"
                              ? "bg-gradient-to-br from-pink-100 to-purple-100 shadow-md"
                              : "bg-gradient-to-br from-pink-900/30 to-purple-900/30 shadow-[0_8px_20px_rgba(0,0,0,0.2)]"} 
                              p-6 text-center`}
                          >
                            <h3 className={`text-xl font-bold font-montserrat mb-1 ${theme === "light" ? "text-pink-600" : "text-pink-400"}`}>
                              #{tag.name}
                            </h3>
                            <p className={`font-poppins ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
                              {formatNumber(tag.posts)} posts
                            </p>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setExploredTags(prev => {
                                if (prev.includes(tag.id)) {
                                  return prev.filter(id => id !== tag.id);
                                } else {
                                  return [...prev, tag.id];
                                }
                              })}
                              className={`mt-4 w-full py-2 px-4 rounded-full text-sm font-medium font-poppins ${exploredTags.includes(tag.id)
                                ? theme === "light"
                                  ? "bg-pink-600 text-white"
                                  : "bg-pink-500 text-white"
                                : theme === "light"
                                  ? "bg-white/70 text-pink-600 hover:bg-white"
                                  : "bg-gray-800/70 text-pink-300 hover:bg-gray-800"
                                }`}
                            >
                              {exploredTags.includes(tag.id) ? "Exploring" : "Explore"}
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {featured.videos.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <FaPlay className={`mr-2 ${theme === "light" ? "text-blue-600" : "text-blue-400"}`} />
                          <h3 className="text-xl font-bold font-montserrat">Recommended Videos</h3>
                        </div>
                        <button
                          onClick={() => setActiveCategory("videos")}
                          className={`text-sm ${theme === "light" ? "text-blue-600" : "text-blue-400"} font-medium font-poppins`}
                        >
                          View all →
                        </button>
                      </div>
                      <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
                        {featured.videos.map((video) => (
                          <motion.div
                            key={video.id}
                            whileHover={{ y: -5 }}
                            className={`rounded-xl overflow-hidden ${theme === "light"
                              ? "bg-white/80 shadow-lg"
                              : "bg-gray-800/80 shadow-[0_8px_20px_rgba(0,0,0,0.2)]"}`}
                          >
                            <div className="relative">
                              <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full aspect-video object-cover"
                              />
                              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                {video.duration}
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  onClick={() => {
                                    setActiveVideo(video.id);
                                    setIsPlaying(false);
                                  }}
                                  className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center cursor-pointer"
                                >
                                  <FaPlay className="text-pink-600 ml-1" />
                                </motion.div>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-bold font-poppins mb-1 line-clamp-2">{video.title}</h3>
                              <p className={`text-sm font-poppins ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                                {formatNumber(video.views)} views
                              </p>
                              <p className={`text-xs mt-1 font-poppins ${theme === "light" ? "text-purple-600" : "text-purple-400"}`}>
                                {video.creator}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {(activeCategory === "accounts") && searchResults.accounts.length > 0 && (
                <div className="mb-10">
                  <div className="flex items-center mb-4">
                    <FaUser className={`mr-2 ${theme === "light" ? "text-purple-600" : "text-purple-400"}`} />
                    <h2 className="text-xl font-bold font-montserrat">Accounts</h2>
                  </div>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {searchResults.accounts.map((account) => (
                      <motion.div
                        key={account.id}
                        whileHover={{ y: -5 }}
                        className={`rounded-xl overflow-hidden ${theme === "light"
                          ? "bg-white/80 shadow-md"
                          : "bg-gray-800/80 shadow-[0_8px_20px_rgba(0,0,0,0.2)]"} 
                          backdrop-filter backdrop-blur-md p-4`}
                      >
                        <div className="flex items-center">
                          <div className="relative w-14 h-14 rounded-full overflow-hidden mr-4 flex-shrink-0">
                            <img
                              src={account.avatar}
                              alt={account.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h3 className="font-bold font-poppins truncate">{account.name}</h3>
                            <p className={`text-sm truncate font-poppins ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                              @{account.username}
                            </p>
                            <p className={`text-xs font-poppins ${theme === "light" ? "text-purple-600" : "text-purple-400"}`}>
                              {formatNumber(account.followers)} followers
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setFollowedAccounts(prev => {
                              if (prev.includes(account.id)) {
                                return prev.filter(id => id !== account.id);
                              } else {
                                return [...prev, account.id];
                              }
                            })}
                            className={`ml-2 flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium font-poppins ${followedAccounts.includes(account.id)
                              ? theme === "light"
                                ? "bg-purple-600 text-white"
                                : "bg-purple-500 text-white"
                              : theme === "light"
                                ? "bg-purple-100 text-purple-600 hover:bg-purple-200"
                                : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"
                              }`}
                          >
                            {followedAccounts.includes(account.id) ? "Following" : "Follow"}
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {(activeCategory === "accounts") && searchResults.accounts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-8 text-center ${theme === "light" 
                    ? "bg-white/80 shadow-md" 
                    : "bg-gray-800/80 shadow-[0_8px_20px_rgba(0,0,0,0.2)]"} 
                    backdrop-filter backdrop-blur-md`}
                >
                  <div className="mb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${theme === "light"
                      ? "bg-purple-100"
                      : "bg-purple-900/30"}`}
                    >
                      <FaUser size={30} className={theme === "light" ? "text-purple-500" : "text-purple-400"} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-2">No accounts to show</h3>
                  <p className={`mb-6 max-w-md mx-auto font-poppins ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
                    Search for people, creators or influencers to discover accounts
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {["Emma Wilson", "David Thompson", "Sophia Garcia"].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          setBtnClicked(true);
                          mockSearch(suggestion);
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-poppins ${theme === "light"
                          ? "bg-purple-100 text-purple-600 hover:bg-purple-200"
                          : "bg-purple-900/40 text-purple-300 hover:bg-purple-800/60"}`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {(activeCategory === "tags") && searchResults.tags.length > 0 && (
                <div className="mb-10">
                  <div className="flex items-center mb-4">
                    <FaHashtag className={`mr-2 ${theme === "light" ? "text-pink-600" : "text-pink-400"}`} />
                    <h2 className="text-xl font-bold font-montserrat">Tags</h2>
                  </div>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {searchResults.tags.map((tag) => (
                      <motion.div
                        key={tag.id}
                        whileHover={{ y: -5 }}
                        className={`rounded-xl ${theme === "light"
                          ? "bg-gradient-to-br from-pink-100 to-purple-100 shadow-md"
                          : "bg-gradient-to-br from-pink-900/30 to-purple-900/30 shadow-[0_8px_20px_rgba(0,0,0,0.2)]"} 
                          p-6 text-center`}
                      >
                        <h3 className={`text-xl font-bold font-montserrat mb-1 ${theme === "light" ? "text-pink-600" : "text-pink-400"}`}>
                          #{tag.name}
                        </h3>
                        <p className={`font-poppins ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
                          {formatNumber(tag.posts)} posts
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setExploredTags(prev => {
                            if (prev.includes(tag.id)) {
                              return prev.filter(id => id !== tag.id);
                            } else {
                              return [...prev, tag.id];
                            }
                          })}
                          className={`mt-4 w-full py-2 px-4 rounded-full text-sm font-medium font-poppins ${exploredTags.includes(tag.id)
                            ? theme === "light"
                              ? "bg-pink-600 text-white"
                              : "bg-pink-500 text-white"
                            : theme === "light"
                              ? "bg-white/70 text-pink-600 hover:bg-white"
                              : "bg-gray-800/70 text-pink-300 hover:bg-gray-800"
                            }`}
                        >
                          {exploredTags.includes(tag.id) ? "Exploring" : "Explore"}
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {(activeCategory === "tags") && searchResults.tags.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-8 text-center ${theme === "light" 
                    ? "bg-white/80 shadow-md" 
                    : "bg-gray-800/80 shadow-[0_8px_20px_rgba(0,0,0,0.2)]"} 
                    backdrop-filter backdrop-blur-md`}
                >
                  <div className="mb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${theme === "light"
                      ? "bg-pink-100"
                      : "bg-pink-900/30"}`}
                    >
                      <FaHashtag size={30} className={theme === "light" ? "text-pink-500" : "text-pink-400"} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-2">No tags to show</h3>
                  <p className={`mb-6 max-w-md mx-auto font-poppins ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
                    Search for topics, trends or categories to discover popular tags
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {["photography", "travel", "fashion", "gaming"].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          setBtnClicked(true);
                          mockSearch(suggestion);
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-poppins ${theme === "light"
                          ? "bg-pink-100 text-pink-600 hover:bg-pink-200"
                          : "bg-pink-900/40 text-pink-300 hover:bg-pink-800/60"}`}
                      >
                        #{suggestion}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {(activeCategory === "videos") && searchResults.videos.length > 0 && (
                <div className="mb-10">
                  <div className="flex items-center mb-4">
                    <FaPlay className={`mr-2 ${theme === "light" ? "text-blue-600" : "text-blue-400"}`} />
                    <h2 className="text-xl font-bold font-montserrat">Videos</h2>
                  </div>
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {searchResults.videos.map((video) => (
                      <motion.div
                        key={video.id}
                        whileHover={{ y: -5 }}
                        className={`rounded-xl overflow-hidden ${theme === "light"
                          ? "bg-white/80 shadow-lg"
                          : "bg-gray-800/80 shadow-[0_8px_20px_rgba(0,0,0,0.2)]"}`}
                      >
                        <div className="relative">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full aspect-video object-cover"
                          />
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              onClick={() => {
                                setActiveVideo(video.id);
                                setIsPlaying(false);
                              }}
                              className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center cursor-pointer"
                            >
                              <FaPlay className="text-pink-600 ml-1" />
                            </motion.div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold font-poppins mb-1 line-clamp-2">{video.title}</h3>
                          <p className={`text-sm font-poppins ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                            {formatNumber(video.views)} views
                          </p>
                          <p className={`text-xs mt-1 font-poppins ${theme === "light" ? "text-purple-600" : "text-purple-400"}`}>
                            {video.creator}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {(activeCategory === "videos") && searchResults.videos.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-8 text-center ${theme === "light" 
                    ? "bg-white/80 shadow-md" 
                    : "bg-gray-800/80 shadow-[0_8px_20px_rgba(0,0,0,0.2)]"} 
                    backdrop-filter backdrop-blur-md`}
                >
                  <div className="mb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${theme === "light"
                      ? "bg-blue-100"
                      : "bg-blue-900/30"}`}
                    >
                      <FaPlay size={30} className={theme === "light" ? "text-blue-500" : "text-blue-400"} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-2">No videos to show</h3>
                  <p className={`mb-6 max-w-md mx-auto font-poppins ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
                    Search for content, creators or topics to discover popular videos
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {["Technology Review", "Music Production", "Nature Documentary"].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          setBtnClicked(true);
                          mockSearch(suggestion);
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-poppins ${theme === "light"
                          ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                          : "bg-blue-900/40 text-blue-300 hover:bg-blue-800/60"}`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {!isLoading && searchQuery && btnClicked && !hasResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-xl ${theme === "light"
                ? "bg-white/80"
                : "bg-gray-800/80"} 
                backdrop-filter backdrop-blur-md p-8 text-center`}
            >
              <div className="mb-4 inline-block p-4 rounded-full bg-gray-100">
                <FiSearch size={32} className={theme === "light" ? "text-gray-400" : "text-gray-500"} />
              </div>
              <h3 className="text-xl font-bold font-montserrat mb-2">No results found</h3>
              <p className={`font-poppins ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                We couldn't find anything for "{searchQuery}". Try another search term.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}