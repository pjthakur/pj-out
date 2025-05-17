"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, UserPlus, Moon, Sun, MoreVertical, Instagram, Twitch, Music, Heart, Share2, Headphones, X } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function Home() {
  const [theme, setTheme] = useState("dark");
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [showMessage, setShowMessage] = useState(false);
  const [likedPhotos, setLikedPhotos] = useState<{[key: number]: boolean}>({});
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string} | null>(null);

  const mockContent = {
    photos: [
      { id: 1, src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&h=1200&q=100", alt: "Photo 1" },
      { id: 2, src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&h=1200&q=100", alt: "Photo 2" },
      { id: 3, src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&h=1200&q=100", alt: "Photo 3" },
      { id: 4, src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&h=1200&q=100", alt: "Photo 4" },
      { id: 5, src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&h=1200&q=100", alt: "Photo 5" },
      { id: 6, src: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=1200&h=1200&q=100", alt: "Photo 6" },
    ],
    videos: [
      { id: 1, src: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&h=1200&q=100", alt: "Video thumbnail 1", duration: "3:24" },
      { id: 2, src: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=1200&h=1200&q=100", alt: "Video thumbnail 2", duration: "1:08" },
      { id: 3, src: "https://images.unsplash.com/photo-1726409724841-016b6f4f8b1b?w=1200&h=1200&q=100", alt: "Video thumbnail 3", duration: "2:17" },
      { id: 4, src: "https://images.unsplash.com/photo-1584661156681-540e80a161d3?w=1200&h=1200&q=100", alt: "Video thumbnail 4", duration: "0:45" },
      { id: 5, src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=1200&q=100", alt: "Video thumbnail 5", duration: "4:02" },
      { id: 6, src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=1200&q=100", alt: "Video thumbnail 6", duration: "1:55" },
    ]
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || "dark";
      setTheme(savedTheme);
      document.body.className = savedTheme;
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
      document.body.className = newTheme;
    }
  };

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };

  const handleMessageClick = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleLikeClick = (id: number, type: string) => {
    setLikedPhotos(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleMusicClick = (id: number) => {
    if (playingVideo === id) {
      setPlayingVideo(null);
    } else {
      setPlayingVideo(id);
    }
  };

  const handleImageClick = (src: string, alt: string) => {
    setSelectedImage({ src, alt });
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 flex justify-center ${inter.className} ${
      theme === "dark" 
        ? "bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white" 
        : "bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100 text-gray-900"
    }`}>
      <motion.button 
        onClick={toggleTheme} 
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full backdrop-blur-md shadow-lg ${
          theme === "dark" 
            ? "bg-violet-900/40 text-yellow-300 border border-violet-700/40 shadow-[0_0_15px_3px_rgba(139,92,246,0.5)]" 
            : "bg-white/40 text-purple-700 border border-white/50 shadow-[0_0_15px_3px_rgba(236,72,153,0.3)]"
        }`}
        whileHover={{ 
          scale: 1.1, 
          rotate: 15, 
          boxShadow: theme === "dark" 
            ? "0 0 25px 5px rgba(139, 92, 246, 0.6)" 
            : "0 0 25px 5px rgba(236, 72, 153, 0.4)" 
        }}
        whileTap={{ scale: 0.9 }}
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </motion.button>

      <div className="max-w-2xl w-full sm:my-8 my-0 sm:px-0 px-0">
          <div className="hidden bg-white/60 backdrop-blur-xl border border-pink-200/60 shadow-[0_0_40px_10px_rgba(236,72,153,0.15)]"></div>
        <motion.div 
          className={`pt-8 px-6 rounded-2xl overflow-hidden ${
            theme === "dark" 
              ? "bg-gray-900/40 backdrop-blur-xl border border-purple-800/30 shadow-[0_0_40px_10px_rgba(139,92,246,0.15)]" 
              : "bg-white/60 backdrop-blur-xl border border-pink-200/60 shadow-[0_0_40px_10px_rgba(236,72,153,0.15)]"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start mb-6">
            <motion.div 
              className="relative mb-5 md:mb-0 md:mr-5"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 p-0.5 shadow-[0_0_25px_rgba(168,85,247,0.5)]">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <motion.div 
                    className="w-full h-full"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="Profile picture"
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </motion.div>
                </div>
              </div>
              <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center ${
                theme === "dark" ? "bg-gray-800/80" : "bg-white/80"
              } backdrop-blur-sm border ${
                theme === "dark" ? "border-purple-700/50" : "border-pink-300/80"
              } shadow-[0_0_15px_rgba(168,85,247,0.5)]`}>
                <span className="text-pink-500 text-lg">★</span>
              </div>
            </motion.div>

            <div className="flex-1 w-full text-center md:text-left">
              <div className="flex justify-center md:justify-start items-center">
                <motion.h1 
                  className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ 
                    duration: 15, 
                    repeat: Infinity,
                    ease: "linear" 
                  }}
                >
                  Mollika
                </motion.h1>
              </div>
              <p className={`text-sm mt-1 ${theme === "dark" ? "text-purple-300" : "text-purple-600"}`}>
                Member of ABC industry
              </p>
              
              <motion.div 
                className={`mt-4 p-4 rounded-xl w-full ${
                  theme === "dark" 
                    ? "bg-gray-800/50 backdrop-blur-sm border border-purple-700/50" 
                    : "bg-white/50 backdrop-blur-sm border border-pink-200/70"
                } ${
                  theme === "dark"
                    ? "shadow-[0_0_25px_rgba(139,92,246,0.2)]"
                    : "shadow-[0_0_25px_rgba(236,72,153,0.15)]"
                }`}
                whileHover={{ 
                  scale: 1.01, 
                  boxShadow: theme === "dark" 
                    ? "0 0 30px rgba(139, 92, 246, 0.3)" 
                    : "0 0 30px rgba(236, 72, 153, 0.2)" 
                }}
              >
                <p className={`text-sm ${theme === "dark" ? "text-purple-200" : "text-purple-800"}`}>
                  Passionate photographer and digital creator. Exploring the world one frame at a time. ✨ #TravelLover #ContentCreator
                </p>
              </motion.div>
            </div>
          </div>

          <div className={`flex justify-between mb-6 p-4 rounded-xl ${
            theme === "dark" 
              ? "bg-gray-800/30 backdrop-blur-sm border border-purple-700/40 shadow-[0_0_25px_rgba(139,92,246,0.15)]" 
              : "bg-white/50 backdrop-blur-sm border border-pink-200/50 shadow-[0_0_25px_rgba(236,72,153,0.15)]"
          }`}>
            <motion.div 
              className="text-center"
              whileHover={{ y: -5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className={`text-xl font-bold ${
                theme === "dark" ? "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" : "text-gray-800"
              }`}>110</p>
              <p className={`text-xs uppercase ${theme === "dark" ? "text-pink-300" : "text-purple-600"}`}>
                Posts
              </p>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ y: -5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className={`text-xl font-bold ${
                theme === "dark" ? "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" : "text-gray-800"
              }`}>{isFollowing ? '801' : '800'}</p>
              <p className={`text-xs uppercase ${theme === "dark" ? "text-pink-300" : "text-purple-600"}`}>
                Followers
              </p>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ y: -5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className={`text-xl font-bold ${
                theme === "dark" ? "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" : "text-gray-800"
              }`}>500</p>
              <p className={`text-xs uppercase ${theme === "dark" ? "text-pink-300" : "text-purple-600"}`}>
                Following
              </p>
            </motion.div>
          </div>

          <div className="flex gap-3 mb-6">
            <motion.button
              onClick={handleFollowClick}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium flex items-center justify-center backdrop-blur-sm ${
                isFollowing 
                  ? `${theme === "dark" 
                      ? "bg-gray-800/80 text-white border border-purple-700/50 shadow-[0_0_15px_rgba(139,92,246,0.2)]" 
                      : "bg-gray-200/80 text-gray-700 border border-gray-300 shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                    }`
                  : `${theme === "dark"
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_25px_rgba(168,85,247,0.4)]" 
                      : "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_25px_rgba(236,72,153,0.3)]"
                    }`
              }`}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: !isFollowing 
                  ? theme === "dark"
                    ? "0 0 35px rgba(168, 85, 247, 0.6)" 
                    : "0 0 35px rgba(236, 72, 153, 0.4)"
                  : theme === "dark"
                    ? "0 0 20px rgba(139, 92, 246, 0.3)" 
                    : "0 0 20px rgba(236, 72, 153, 0.2)" 
              }}
              whileTap={{ scale: 0.97 }}
            >
              {isFollowing ? 'Following' : 'Follow'}
              {!isFollowing && <UserPlus size={16} className="ml-1" />}
            </motion.button>
            
            <motion.button
              onClick={handleMessageClick}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium flex items-center justify-center ${
                theme === "dark" 
                  ? "bg-gray-800/60 backdrop-blur-sm text-white border border-purple-700/50 shadow-[0_0_15px_rgba(139,92,246,0.2)]" 
                  : "bg-white/60 backdrop-blur-sm border border-pink-300/50 text-purple-700 shadow-[0_0_15px_rgba(236,72,153,0.15)]"
              }`}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: theme === "dark" 
                  ? "0 0 25px rgba(139, 92, 246, 0.3)" 
                  : "0 0 25px rgba(236, 72, 153, 0.25)" 
              }}
              whileTap={{ scale: 0.97 }}
            >
              Message
              <MessageCircle size={16} className="ml-1" />
            </motion.button>
          </div>
          
          <AnimatePresence>
            {showMessage && (
              <motion.div 
                className={`py-2.5 px-4 rounded-lg text-sm mb-5 backdrop-blur-md ${
                  theme === "dark" 
                    ? "bg-gray-800/70 border border-purple-700/50 shadow-[0_0_20px_rgba(139,92,246,0.3)]" 
                    : "bg-white/60 border border-pink-200/50 shadow-[0_0_20px_rgba(236,72,153,0.25)]"
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center">
                  <MessageCircle size={16} className={`mr-2 ${theme === "dark" ? "text-pink-400" : "text-purple-500"}`} />
                  <span>Coming soon</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`border-b ${theme === "dark" ? "border-purple-700/30" : "border-pink-200/40"} flex mb-2`}>
            <div className="flex w-full">
              <motion.button
                onClick={() => handleTabClick("all")}
                className={`flex-1 py-3 text-center relative ${
                  activeTab === "all" 
                    ? `font-medium ${theme === "dark" ? "text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.7)]" : "text-purple-600"}` 
                    : `${theme === "dark" ? "text-gray-400" : "text-gray-500"}`
                }`}
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
              >
                All
                {activeTab === "all" && (
                  <motion.div 
                    className={`absolute bottom-0 left-0 w-full h-1 rounded-t-full ${
                      theme === "dark" 
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 shadow-[0_0_10px_3px_rgba(236,72,153,0.5)]" 
                        : "bg-gradient-to-r from-pink-500 to-purple-600 shadow-[0_0_8px_2px_rgba(236,72,153,0.4)]"
                    }`}
                    layoutId="activeTab"
                  />
                )}
              </motion.button>
              
              <motion.button
                onClick={() => handleTabClick("photo")}
                className={`flex-1 py-3 text-center relative ${
                  activeTab === "photo" 
                    ? `font-medium ${theme === "dark" ? "text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.7)]" : "text-purple-600"}` 
                    : `${theme === "dark" ? "text-gray-400" : "text-gray-500"}`
                }`}
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
              >
                Photo
                {activeTab === "photo" && (
                  <motion.div 
                    className={`absolute bottom-0 left-0 w-full h-1 rounded-t-full ${
                      theme === "dark" 
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 shadow-[0_0_10px_3px_rgba(236,72,153,0.5)]" 
                        : "bg-gradient-to-r from-pink-500 to-purple-600 shadow-[0_0_8px_2px_rgba(236,72,153,0.4)]"
                    }`}
                    layoutId="activeTab"
                  />
                )}
              </motion.button>
              
              <motion.button
                onClick={() => handleTabClick("video")}
                className={`flex-1 py-3 text-center relative ${
                  activeTab === "video" 
                    ? `font-medium ${theme === "dark" ? "text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.7)]" : "text-purple-600"}` 
                    : `${theme === "dark" ? "text-gray-400" : "text-gray-500"}`
                }`}
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
              >
                Video
                {activeTab === "video" && (
                  <motion.div 
                    className={`absolute bottom-0 left-0 w-full h-1 rounded-t-full ${
                      theme === "dark" 
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 shadow-[0_0_10px_3px_rgba(236,72,153,0.5)]" 
                        : "bg-gradient-to-r from-pink-500 to-purple-600 shadow-[0_0_8px_2px_rgba(236,72,153,0.4)]"
                    }`}
                    layoutId="activeTab"
                  />
                )}
              </motion.button>
             
            </div>
          </div>

          <div className="p-3">
            {activeTab === "all" && (
              <motion.div 
                className="grid grid-cols-3 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.05 }}
              >
                {mockContent.photos.map((photo, index) => (
                  <motion.div 
                    key={`photo-${photo.id}`} 
                    className={`aspect-square relative overflow-hidden rounded-xl cursor-pointer ${
                      theme === "dark" 
                        ? "shadow-[0_0_20px_rgba(139,92,246,0.25)]" 
                        : "shadow-[0_0_20px_rgba(236,72,153,0.2)]"
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ 
                      scale: 1.03, 
                      boxShadow: theme === "dark" 
                        ? "0 0 30px rgba(139, 92, 246, 0.5)" 
                        : "0 0 30px rgba(236, 72, 153, 0.3)" 
                    }}
                    onClick={() => handleImageClick(photo.src, photo.alt)}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    <motion.div 
                      className="absolute bottom-2 right-2"
                      whileHover={{ scale: 1.2 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikeClick(photo.id, 'photo');
                      }}
                    >
                      <div className={`rounded-full p-1.5 backdrop-blur-md ${
                        likedPhotos[photo.id]
                          ? "bg-pink-600/90 shadow-[0_0_20px_rgba(236,72,153,0.7)]"
                          : theme === "dark" 
                            ? "bg-pink-500/70 shadow-[0_0_15px_rgba(236,72,153,0.5)]" 
                            : "bg-pink-500/80 shadow-[0_0_15px_rgba(236,72,153,0.4)]"
                      }`}>
                        <Heart 
                          size={16} 
                          className={`${likedPhotos[photo.id] ? "text-white fill-white" : "text-white"} drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]`} 
                        />
                      </div>                     
                    </motion.div>
                  </motion.div>
                ))}
                {mockContent.videos.map((video, index) => (
                  <motion.div 
                    key={`video-${video.id}`} 
                    className={`aspect-square relative overflow-hidden rounded-xl ${
                      theme === "dark" 
                        ? "shadow-[0_0_20px_rgba(139,92,246,0.25)]" 
                        : "shadow-[0_0_20px_rgba(236,72,153,0.2)]"
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (index + mockContent.photos.length) * 0.05 }}
                    whileHover={{ 
                      scale: 1.03, 
                      boxShadow: theme === "dark" 
                        ? "0 0 30px rgba(139, 92, 246, 0.5)" 
                        : "0 0 30px rgba(236, 72, 153, 0.3)" 
                    }}
                  >
                    <img
                      src={video.src}
                      alt={video.alt}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent"></div>
                    
                    <div className="absolute top-3 left-3">
                      {index % 3 === 0 ? (
                        <Instagram size={18} className="text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.9)]" />
                      ) : index % 3 === 1 ? (
                        <Headphones size={18} className="text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.9)]" />
                      ) : (
                        <Twitch size={18} className="text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.9)]" />
                      )}
                    </div>

                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs text-white font-medium flex items-center shadow-[0_0_10px_rgba(0,0,0,0.3)] border border-white/10">
                      {video.duration}
                    </div>

                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center"
                      whileHover={{ scale: 1.2 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMusicClick(video.id);
                      }}
                    >
                      <div className={`rounded-full backdrop-blur-sm p-2.5 ${
                        playingVideo === video.id
                          ? "bg-purple-600/90 shadow-[0_0_25px_rgba(168,85,247,0.8)]"
                          : "bg-pink-500/80 shadow-[0_0_20px_rgba(236,72,153,0.5)]"
                      } border border-white/20`}>
                        <Music 
                          size={16} 
                          className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" 
                        />
                      </div>
                      {playingVideo === video.id && (
                        <motion.div 
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
                          <motion.div 
                            className="relative z-10"
                            animate={{ 
                              scale: [1, 1.05, 1],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 2
                            }}
                          >
                            <div className="text-white font-medium text-lg sm:text-base text-center flex flex-col items-center justify-center">
                              <Music size={24} className="mb-1" />
                              Now Playing
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {activeTab === "photo" && (
              <motion.div 
                className="grid grid-cols-3 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.05 }}
              >
                {mockContent.photos.map((photo, index) => (
                  <motion.div 
                    key={`photo-${photo.id}`} 
                    className={`aspect-square relative overflow-hidden rounded-xl cursor-pointer ${
                      theme === "dark" 
                        ? "shadow-[0_0_20px_rgba(139,92,246,0.25)]" 
                        : "shadow-[0_0_20px_rgba(236,72,153,0.2)]"
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ 
                      scale: 1.03, 
                      boxShadow: theme === "dark" 
                        ? "0 0 30px rgba(139, 92, 246, 0.5)" 
                        : "0 0 30px rgba(236, 72, 153, 0.3)" 
                    }}
                    onClick={() => handleImageClick(photo.src, photo.alt)}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 opacity-0 hover:opacity-100 transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-3">
                      <motion.div 
                        whileHover={{ scale: 1.2, boxShadow: "0 0 25px rgba(244, 114, 182, 0.7)" }}
                        className={`${likedPhotos[photo.id] ? "bg-pink-600/90" : "bg-pink-500/70"} backdrop-blur-md p-2 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-white/20`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeClick(photo.id, 'photo');
                        }}
                      >
                        <Heart 
                          size={20} 
                          className={`${likedPhotos[photo.id] ? "text-white fill-white" : "text-white"} drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]`} 
                        />
                      </motion.div>
                      {likedPhotos[photo.id] && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute top-8 right-8 z-10 w-6 h-6 bg-pink-500/90 rounded-full backdrop-blur-sm shadow-[0_0_10px_rgba(236,72,153,0.6)] border border-white/20"
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {activeTab === "video" && (
              <motion.div 
                className="grid grid-cols-3 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.05 }}
              >
                {mockContent.videos.map((video, index) => (
                  <motion.div 
                    key={`video-${video.id}`} 
                    className={`aspect-square relative overflow-hidden rounded-xl ${
                      theme === "dark" 
                        ? "shadow-[0_0_20px_rgba(139,92,246,0.25)]" 
                        : "shadow-[0_0_20px_rgba(236,72,153,0.2)]"
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ 
                      scale: 1.03, 
                      boxShadow: theme === "dark" 
                        ? "0 0 30px rgba(139, 92, 246, 0.5)" 
                        : "0 0 30px rgba(236, 72, 153, 0.3)" 
                    }}
                  >
                    <img
                      src={video.src}
                      alt={video.alt}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent"></div>
                    
                    <div className="absolute top-3 left-3">
                      {index % 3 === 0 ? (
                        <Instagram size={18} className="text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.9)]" />
                      ) : index % 3 === 1 ? (
                        <Headphones size={18} className="text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.9)]" />
                      ) : (
                        <Twitch size={18} className="text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.9)]" />
                      )}
                    </div>

                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs text-white font-medium flex items-center shadow-[0_0_10px_rgba(0,0,0,0.3)] border border-white/10">
                      {video.duration}
                    </div>

                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center"
                      whileHover={{ scale: 1.2 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMusicClick(video.id);
                      }}
                    >
                      <div className={`rounded-full backdrop-blur-sm p-2.5 ${
                        playingVideo === video.id
                          ? "bg-purple-600/90 shadow-[0_0_25px_rgba(168,85,247,0.8)]"
                          : "bg-pink-500/80 shadow-[0_0_20px_rgba(236,72,153,0.5)]"
                      } border border-white/20`}>
                        <Music 
                          size={16} 
                          className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" 
                        />
                      </div>
                      {playingVideo === video.id && (
                        <motion.div 
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
                          <motion.div 
                            className="relative z-10"
                            animate={{ 
                              scale: [1, 1.05, 1],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 2
                            }}
                          >
                            <div className="text-white font-medium text-lg sm:text-base text-center flex flex-col items-center justify-center">
                              <Music size={24} className="mb-1" />
                              Now Playing
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-auto h-auto max-w-full max-h-[90vh] p-2 sm:p-6 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModal}
                className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-[80vh] w-auto h-auto mx-auto block rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}