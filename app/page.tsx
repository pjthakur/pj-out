"use client";
import { useState, useEffect, useRef } from "react";
import {
  FiSun,
  FiMoon,
  FiGrid,
  FiList,
  FiUpload,
  FiSearch,
  FiFilter,
  FiX,
  FiImage,
  FiVideo,
  FiMusic,
  FiFile,
  FiTrash2,
  FiDownload,
  FiInfo,
  FiCalendar,
  FiShare2,
  FiFolderPlus,
  FiCopy,
  FiAlignLeft
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

type MediaItem = {
  id: string;
  type: "image" | "video" | "audio" | "document";
  url: string;
  title: string;
  description?: string;
  category: string;
  dateAdded: Date;
  thumbnail?: string;
};


const initialMedia: MediaItem[] = [
  {
    id: "1",
    type: "image",
    url: "https://images.unsplash.com/photo-1561571994-3c61c554181a?q=80&w=1740&auto=format&fit=crop",
    title: "Beach Sunset",
    description: "Beautiful sunset at the beach",
    category: "nature",
    dateAdded: new Date("2024-02-10"),
  },
  {
    id: "2",
    type: "image",
    url: "https://images.unsplash.com/photo-1682687220509-61b8a906ca19?q=80&w=1740&auto=format&fit=crop",
    title: "Mountain Range",
    description: "Epic mountain range at dawn",
    category: "landscape",
    dateAdded: new Date("2024-04-15"),
  },
  {
    id: "3",
    type: "video",
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "Big Buck Bunny",
    description:
      "Big Buck Bunny is a short animated film by the Blender Foundation",
    category: "animation",
    dateAdded: new Date("2024-06-05"),
    thumbnail:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
  },
  {
    id: "4",
    type: "image",
    url: "https://images.unsplash.com/photo-1682687220566-5599dbbebf11?q=80&w=1740&auto=format&fit=crop",
    title: "City Skyline",
    description: "Night skyline of a modern city",
    category: "urban",
    dateAdded: new Date("2024-08-20"),
  },
  {
    id: "5",
    type: "audio",
    url: "https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg",
    title: "Bugle Tune",
    description: "A short bugle tune from Google Sound Library",
    category: "music",
    dateAdded: new Date("2024-10-29"),
    thumbnail:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1740&auto=format&fit=crop",
  },
  {
    id: "6",
    type: "image",
    url: "https://images.unsplash.com/photo-1682685797661-9e0c87f59c60?q=80&w=1740&auto=format&fit=crop",
    title: "Forest Path",
    description: "Peaceful path through a dense forest",
    category: "nature",
    dateAdded: new Date("2024-12-25"),
  },
  {
    id: "7",
    type: "video",
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    title: "Elephants Dream",
    description: "Another open-source animated short film",
    category: "animation",
    dateAdded: new Date("2025-01-12"),
    thumbnail:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
  },
  {
    id: "8",
    type: "audio",
    url: "https://actions.google.com/sounds/v1/alarms/spaceship_alarm.ogg",
    title: "Spaceship Alarm",
    description: "Futuristic spaceship alarm sound",
    category: "sound effects",
    dateAdded: new Date("2025-03-18"),
    thumbnail:
      "https://images.unsplash.com/photo-1539721972319-f0e80a00d424?q=80&w=1740&auto=format&fit=crop",
  },
];

export default function Home() {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    setMedia(initialMedia);
    setFilteredMedia(initialMedia);


    const storedTheme =
      typeof window !== "undefined"
        ? localStorage.getItem("mediaLibraryTheme")
        : null;
    if (storedTheme === "dark") {
      setIsDarkTheme(true);
    }
  }, []);


  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mediaLibraryTheme", isDarkTheme ? "dark" : "light");
    }
  }, [isDarkTheme]);


  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, []);


  useEffect(() => {
    let result = media;

    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description &&
            item.description.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }

    if (activeCategory) {
      result = result.filter((item) => item.category === activeCategory);
    }

    setFilteredMedia(result);
  }, [searchQuery, activeCategory, media]);


  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);


    setTimeout(() => {
      const newMedia: MediaItem[] = Array.from(files).map((file, index) => {
        const id = `new-${Date.now()}-${index}`;
        const fileType = file.type;
        let mediaType: "image" | "video" | "audio" | "document";

        if (fileType.startsWith("image/")) {
          mediaType = "image";
        } else if (fileType.startsWith("video/")) {
          mediaType = "video";
        } else if (fileType.startsWith("audio/")) {
          mediaType = "audio";
        } else {
          mediaType = "document";
        }


        const objectUrl = URL.createObjectURL(file);


        let thumbnailUrl: string | undefined;

        if (mediaType === "video") {

          thumbnailUrl =
            "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?q=80&w=1740&auto=format&fit=crop";
        } else if (mediaType === "audio") {

          thumbnailUrl =
            "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=1974&auto=format&fit=crop";
        }

        return {
          id,
          type: mediaType,
          url: objectUrl,
          title: file.name,
          category: mediaType === "image" ? "uploads" : mediaType,
          dateAdded: new Date(),
          thumbnail: thumbnailUrl,
        };
      });

      setMedia((prev) => [...newMedia, ...prev]);
      setIsUploading(false);


      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 1500);
  };


  const openMediaDetail = (item: MediaItem) => {
    setSelectedItem(item);

    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };


  const closeMediaDetail = () => {
    setSelectedItem(null);

    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  };


  const deleteMedia = (id: string) => {
    setMedia((prev) => prev.filter((item) => item.id !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
    setDeleteConfirmItem(null);
  };


  const openDeleteConfirmation = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDeleteConfirmItem(id);
  };


  const closeDeleteConfirmation = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDeleteConfirmItem(null);
  };


  const categories = [
    "all",
    ...Array.from(new Set(media.map((item) => item.category))),
  ];


  const toggleCategory = (category: string) => {
    if (category === "all") {
      setActiveCategory(null);
    } else {
      setActiveCategory((prevCategory) =>
        prevCategory === category ? null : category,
      );
    }
  };


  const themeClass = isDarkTheme
    ? "bg-gradient-to-br from-[#0f0f24] via-[#191940] to-[#1f1f3a] text-white"
    : "bg-gradient-to-br from-[#f0f2fa] via-[#f6f8ff] to-[#eef4ff] text-[#333]";

  const cardClass = isDarkTheme
    ? "bg-[#1e1e40]/60 backdrop-blur-lg border-[#3a3a6a] shadow-lg hover:shadow-[0_0_20px_rgba(106,61,232,0.3)] transition-shadow duration-300"
    : "bg-white/70 backdrop-blur-lg border-[#e1e1f1] shadow-lg hover:shadow-[0_0_20px_rgba(138,87,250,0.2)] transition-shadow duration-300";

  const buttonClass = isDarkTheme
    ? "bg-gradient-to-r from-[#6a3dea] to-[#4f2dda] text-white shadow-md hover:shadow-[0_0_15px_rgba(106,61,232,0.5)] transition-shadow duration-300"
    : "bg-gradient-to-r from-[#8a57fa] to-[#7846fa] text-white shadow-md hover:shadow-[0_0_15px_rgba(138,87,250,0.5)] transition-shadow duration-300";

  const secondaryButtonClass = isDarkTheme
    ? "bg-[#2a2a55]/70 text-white border border-[#3a3a6a] hover:shadow-[0_0_10px_rgba(106,61,232,0.2)] transition-shadow duration-300"
    : "bg-white/80 text-[#333] border border-[#e4e4f0] hover:shadow-[0_0_10px_rgba(138,87,250,0.15)] transition-shadow duration-300";

  const accentGradient = "bg-gradient-to-r from-[#8a57fa] to-[#23b8c1]";
  const glowAccent = isDarkTheme
    ? "relative after:absolute after:inset-0 after:rounded-full after:bg-[#8a57fa] after:blur-md after:opacity-40 after:-z-10"
    : "relative after:absolute after:inset-0 after:rounded-full after:bg-[#8a57fa] after:blur-md after:opacity-20 after:-z-10";


  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={`min-h-screen w-full ${themeClass}`}>
      <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col max-w-7xl mx-auto">
        <header
          className={`${cardClass} rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-center justify-center sm:justify-between border mb-4 sm:mb-6`}
        >
          <div className="flex items-center gap-2 sm:gap-3 justify-center w-full sm:w-auto">
            <div
              className={`${accentGradient} w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg ${glowAccent}`}
            >
              <FiImage className="text-white text-lg sm:text-xl" />
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Media Library</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 justify-center flex-wrap">
            <div
              className={`relative flex items-center ${secondaryButtonClass} rounded-full pl-2 sm:pl-3 pr-3 sm:pr-4 py-1 sm:py-1.5`}
            >
              <FiSearch className="mr-1 sm:mr-2" />
              <input
                type="text"
                placeholder="Search media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`bg-transparent border-none outline-none w-24 xs:w-28 sm:w-32 md:w-40 lg:w-48 text-sm ${isDarkTheme ? 'placeholder-gray-400' : 'placeholder-gray-800'}`}
              />
            </div>

            <div
              className={`${secondaryButtonClass} rounded-full p-1 sm:p-1.5 flex gap-1`}
            >
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1 sm:p-1.5 rounded-full ${viewMode === "grid" ? buttonClass : ""}`}
                aria-label="Grid view"
              >
                <FiGrid size={16} className="sm:hidden" />
                <FiGrid size={18} className="hidden sm:block" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1 sm:p-1.5 rounded-full ${viewMode === "list" ? buttonClass : ""}`}
                aria-label="List view"
              >
                <FiList size={16} className="sm:hidden" />
                <FiList size={18} className="hidden sm:block" />
              </button>
            </div>

            <button
              onClick={handleUpload}
              className={`${buttonClass} rounded-full px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2 relative overflow-hidden before:absolute before:inset-0 before:bg-white before:opacity-0 before:hover:opacity-20 before:transition-opacity before:duration-300 ${glowAccent}`}
            >
              <FiUpload size={16} className="sm:hidden" />
              <FiUpload size={18} className="hidden sm:block" />
              <span className="hidden xs:inline text-sm sm:text-base">Upload</span>
            </button>

            <button
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className={`${secondaryButtonClass} rounded-full p-2 sm:p-2.5 ${isDarkTheme ? 'hover:text-yellow-200' : 'hover:text-indigo-500'} transition-colors duration-300 ${isDarkTheme ? 'hover:shadow-[0_0_15px_rgba(250,240,137,0.3)]' : 'hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]'} transition-shadow duration-300`}
              aria-label={
                isDarkTheme ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              <FiSun size={16} className={`${isDarkTheme ? 'block' : 'hidden'}`} />
              <FiMoon size={16} className={`${isDarkTheme ? 'hidden' : 'block'}`} />
            </button>
          </div>
        </header>

        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6 max-w-full overflow-x-auto pb-1 -mx-1 px-1 justify-center sm:justify-start">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm whitespace-nowrap ${(category === "all" && !activeCategory) ||
                category === activeCategory
                ? `${buttonClass} ${glowAccent}`
                : secondaryButtonClass
                }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <main className="flex-1">
          {isUploading && (
            <div className={`${cardClass} rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border`}>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`${accentGradient} rounded-full p-1.5 sm:p-2`}>
                  <FiUpload className="text-white" size={14} />
                </div>
                <p className="text-sm sm:text-base">Uploading media...</p>
              </div>
            </div>
          )}

          {filteredMedia.length === 0 ? (
            <div
              className={`${cardClass} rounded-xl p-6 sm:p-12 text-center border h-56 sm:h-72 flex flex-col items-center justify-center`}
            >
              <div className="text-4xl sm:text-6xl mb-4 sm:mb-6 opacity-30">
                <FiImage />
              </div>
              <h3 className="text-xl sm:text-2xl mb-2 sm:mb-3 font-semibold">No media found</h3>
              <p className="mb-4 sm:mb-6 text-sm sm:text-base">
                {searchQuery || activeCategory
                  ? "Try adjusting your search or filters"
                  : "Your media library is empty"}
              </p>
              <button
                onClick={handleUpload}
                className={`${buttonClass} rounded-full px-5 sm:px-6 py-2 sm:py-3 flex items-center gap-2 text-sm sm:text-base`}
              >
                <FiUpload size={16} className="sm:hidden" />
                <FiUpload size={18} className="hidden sm:block" />
                Upload Media
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openMediaDetail(item)}
                  className={`${cardClass} rounded-xl overflow-hidden border cursor-pointer group hover:scale-[1.02] transition-all duration-300`}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <div className="absolute top-2 right-2 z-10 bg-black/40 backdrop-blur-sm p-1.5 rounded-full">
                      {item.type === "image" ? <FiImage size={16} className="text-white" /> :
                        item.type === "video" ? <FiVideo size={16} className="text-white" /> :
                          item.type === "audio" ? <FiMusic size={16} className="text-white" /> :
                            <FiFile size={16} className="text-white" />}
                    </div>

                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : item.type === "video" ? (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FiVideo size={42} className="text-white" />
                        )}
                      </div>
                    ) : item.type === "audio" ? (
                      <div className="w-full h-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`${accentGradient} p-4 rounded-full ${glowAccent}`}>
                            <FiMusic className="text-white" size={24} />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <FiFile size={42} />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="flex justify-center gap-2">
                        <button
                          className="p-2 rounded-full bg-white/20 text-white cursor-pointer transition-all duration-200 hover:bg-white/30 hover:scale-110 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                          onClick={(e) => {
                            e.stopPropagation();
                            openMediaDetail(item);
                          }}
                        >
                          <FiInfo size={18} className="transform transition-transform hover:scale-110" />
                        </button>
                        <button
                          className="p-2 rounded-full bg-white/20 text-white cursor-pointer transition-all duration-200 hover:bg-white/30 hover:scale-110 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast('No download available currently', { icon: '🚫' });
                          }}
                        >
                          <FiDownload size={18} className="transform transition-transform hover:scale-110" />
                        </button>
                        <button
                          className="p-2 rounded-full bg-white/20 text-white cursor-pointer transition-all duration-200 hover:bg-white/30 hover:scale-110 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteConfirmation(item.id, e);
                          }}
                        >
                          <FiTrash2 size={18} className="transform transition-transform hover:scale-110" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate mr-2 text-sm sm:text-base">{item.title}</h3>
                      <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(item.dateAdded)}</span>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            ) : (
              <div className={`${cardClass} rounded-xl border overflow-hidden`}>
                <div className="divide-y">
                  {filteredMedia.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                      onClick={() => openMediaDetail(item)}
                    >
                      <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden shadow-md">
                        {item.type === "image" ? (
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : item.type === "video" && item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : item.type === "audio" && item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            {item.type === "video" ? (
                              <FiVideo size={24} />
                            ) : item.type === "audio" ? (
                              <div className={`${accentGradient} p-4 rounded-full ${glowAccent}`}>
                                <FiMusic className="text-white" size={24} />
                              </div>
                            ) : (
                              <FiFile size={24} />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate text-sm sm:text-base">{item.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                          {item.description || `${item.type} file`}
                        </p>
                        <div className="flex items-center gap-2 sm:gap-3 mt-1">
                          <span className="text-xs text-gray-500">
                            {formatDate(item.dateAdded)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex gap-1 sm:gap-2">
                        <button
                          className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteConfirmation(item.id, e);
                          }}
                        >
                          <FiTrash2 size={16} className="text-red-500" />
                        </button>
                        <button
                          className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FiDownload size={16} className="text-green-500" />
                        </button>
                        <button
                          className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            openMediaDetail(item);
                          }}
                        >
                          <FiInfo size={16} className="text-purple-500" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </main>

        <footer className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
          <p>Media Library © {new Date().getFullYear()}</p>
        </footer>
      </div>

      {
        selectedItem && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 transition-opacity duration-300"
            onClick={closeMediaDetail}
          >
            <div
              className={`${cardClass} rounded-xl sm:rounded-2xl border-0 w-full max-w-xs xs:max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col shadow-xl backdrop-blur-xl ${isDarkTheme ? 'shadow-[0_0_30px_rgba(106,61,232,0.3)]' : 'shadow-[0_0_30px_rgba(138,87,250,0.2)]'} transition-all duration-300 transform scale-100 opacity-100`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`px-4 py-3 sm:px-5 sm:py-4 flex justify-between items-center ${accentGradient} text-white rounded-t-xl sm:rounded-t-2xl`}>
                <h2 className="text-base sm:text-xl font-semibold truncate mr-2 sm:mr-4 flex items-center gap-2 sm:gap-3">
                  {selectedItem.type === "image" ? <FiImage className="opacity-90" /> :
                    selectedItem.type === "video" ? <FiVideo className="opacity-90" /> :
                      selectedItem.type === "audio" ? <FiMusic className="opacity-90" /> :
                        <FiFile className="opacity-90" />}
                  {selectedItem.title}
                </h2>
                <button
                  className="p-2 sm:p-2.5 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm cursor-pointer hover:rotate-90 hover:scale-110"
                  onClick={closeMediaDetail}
                  aria-label="Close"
                >
                  <FiX size={18} className="sm:hidden" />
                  <FiX size={20} className="hidden sm:block" />
                </button>
              </div>

              <div className="flex-1 overflow-auto">
                <div className={`${isDarkTheme ? 'bg-[#0a0a1a]/70' : 'bg-[#fafafa]/70'} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20">
                    {selectedItem.type === "image" &&
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10"></div>
                    }
                    {selectedItem.type === "video" &&
                      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-orange-500/10"></div>
                    }
                    {selectedItem.type === "audio" &&
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10"></div>
                    }
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  {selectedItem.type === "image" ? (
                    <div className="relative z-10 p-5 w-full max-w-3xl mx-auto flex items-center justify-center">
                      <img
                        src={selectedItem.url}
                        alt={selectedItem.title}
                        className="max-h-[50vh] object-contain mx-auto rounded-md shadow-xl"
                      />
                    </div>
                  ) : selectedItem.type === "video" ? (
                    <div className="relative z-10 p-5 w-full max-w-3xl mx-auto flex items-center justify-center">
                      <video
                        src={selectedItem.url}
                        poster={selectedItem.thumbnail}
                        controls
                        className="max-h-[50vh] max-w-full rounded-md shadow-xl"
                      />
                      </div>
                    ) : selectedItem.type === "audio" ? (
                      <div className="relative z-10 w-full py-10 px-6">
                        <div className="w-full max-w-md mx-auto">
                          <div
                            className={`${cardClass} rounded-xl p-6 flex flex-col gap-6 items-center shadow-lg border-0`}
                          >
                              <div className="w-full flex justify-center">
                                <div className={`${accentGradient} w-24 h-24 rounded-full ${glowAccent} flex items-center justify-center p-5 shadow-lg`}>
                                  <div className="animate-pulse">
                                    <FiMusic className="text-white" size={36} />
                                  </div>
                                </div>
                              </div>
                              <div className="w-full">
                                <div className="mb-3 text-center">
                                  <h4 className="font-medium">{selectedItem.title}</h4>
                                  <p className="text-sm opacity-70 mt-1">{selectedItem.category}</p>
                                </div>
                                <audio
                                  src={selectedItem.url}
                                  controls
                                  autoPlay={false}
                                  className="w-full"
                                />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                      <FiFile size={48} />
                    </div>
                  )}
                </div>

                <div className="p-5 sm:p-6">
                  <div className="mb-6 sm:mb-8">
                    <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3">
                      <span className={`${accentGradient} w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white`}>
                        <FiInfo size={14} className="sm:hidden" />
                        <FiInfo size={16} className="hidden sm:block" />
                      </span>
                      Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className={`bg-opacity-50 dark:bg-opacity-50 rounded-xl p-4 transition-all duration-300 hover:translate-y-[-2px] ${isDarkTheme ? 'bg-[#2a2a55]/30 border border-[#3a3a6a]/50' : 'bg-white/50 border border-[#e4e4f0]/50'} ${selectedItem.type === "image" ? "shadow-[0_0_15px_rgba(16,185,129,0.15)]" : selectedItem.type === "video" ? "shadow-[0_0_15px_rgba(244,63,94,0.15)]" : selectedItem.type === "audio" ? "shadow-[0_0_15px_rgba(168,85,247,0.15)]" : "shadow-[0_0_15px_rgba(59,130,246,0.15)]"}`}>
                        <div className="flex items-start gap-3">
                          <div className={`rounded-full p-2.5 ${selectedItem.type === "image" ? "bg-emerald-500/10 text-emerald-500" : selectedItem.type === "video" ? "bg-rose-500/10 text-rose-500" : selectedItem.type === "audio" ? "bg-purple-500/10 text-purple-500" : "bg-blue-500/10 text-blue-500"}`}>
                            {selectedItem.type === "image" ? <FiImage size={18} /> : 
                            selectedItem.type === "video" ? <FiVideo size={18} /> : 
                            selectedItem.type === "audio" ? <FiMusic size={18} /> : 
                            <FiFile size={18} />}
                          </div>
                          <div>
                            <p className="text-sm opacity-60 mb-1">Type</p>
                            <p className="font-medium capitalize">{selectedItem.type}</p>
                          </div>
                        </div>
                      </div>
                      <div className={`bg-opacity-50 dark:bg-opacity-50 rounded-xl p-4 transition-all duration-300 hover:translate-y-[-2px] ${isDarkTheme ? 'bg-[#2a2a55]/30 border border-[#3a3a6a]/50' : 'bg-white/50 border border-[#e4e4f0]/50'} shadow-[0_0_15px_rgba(251,191,36,0.15)]`}>
                        <div className="flex items-start gap-3">
                          <div className="bg-amber-500/10 text-amber-500 rounded-full p-2.5">
                            <FiFilter size={18} />
                          </div>
                          <div>
                            <p className="text-sm opacity-60 mb-1">Category</p>
                            <p className="font-medium capitalize">{selectedItem.category}</p>
                          </div>
                        </div>
                      </div>
                      <div className={`bg-opacity-50 dark:bg-opacity-50 rounded-xl p-4 transition-all duration-300 hover:translate-y-[-2px] ${isDarkTheme ? 'bg-[#2a2a55]/30 border border-[#3a3a6a]/50' : 'bg-white/50 border border-[#e4e4f0]/50'} shadow-[0_0_15px_rgba(14,165,233,0.15)]`}>
                        <div className="flex items-start gap-3">
                          <div className="bg-sky-500/10 text-sky-500 rounded-full p-2.5">
                            <FiCalendar size={18} />
                          </div>
                          <div>
                            <p className="text-sm opacity-60 mb-1">Date Added</p>
                            <p className="font-medium">{formatDate(selectedItem.dateAdded)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedItem.description && (
                    <div className="mb-6 sm:mb-8">
                      <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3">
                        <span className={`${accentGradient} w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white`}>
                          <FiAlignLeft size={14} className="sm:hidden" />
                          <FiAlignLeft size={16} className="hidden sm:block" />
                        </span>
                        Description
                      </h3>
                      <div className={`bg-opacity-50 dark:bg-opacity-50 rounded-xl p-4 transition-all duration-300 hover:translate-y-[-2px] ${isDarkTheme ? 'bg-[#2a2a55]/30 border border-[#3a3a6a]/50' : 'bg-white/50 border border-[#e4e4f0]/50'} shadow-[0_0_15px_rgba(20,184,166,0.15)]`}>
                        <div className="flex items-start gap-3">
                          <div className="hidden sm:flex bg-teal-500/10 text-teal-500 rounded-full p-2.5 self-start mt-1">
                            <FiAlignLeft size={18} />
                          </div>
                          <p className="leading-relaxed text-sm sm:text-base">{selectedItem.description}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                    <button
                      className={`rounded-xl px-5 py-2.5 flex items-center justify-center gap-2 transition-all duration-300 ${isDarkTheme ? 'bg-[#2a2a55]/50 text-white hover:bg-red-500/20' : 'bg-white/70 text-gray-800 hover:bg-red-500/10'} border ${isDarkTheme ? 'border-[#3a3a6a]/50' : 'border-[#e4e4f0]/50'} hover:border-red-500/30 group cursor-pointer text-sm sm:text-base hover:translate-y-[-2px]`}
                      onClick={(e) => {
                        e?.stopPropagation();
                        openDeleteConfirmation(selectedItem.id);
                      }}
                    >
                      <FiTrash2 size={16} className="text-red-500 group-hover:scale-110 transition-transform" />
                      <span>Delete</span>
                    </button>
                    <button
                      className={`${buttonClass} rounded-xl px-6 py-2.5 flex cursor-pointer items-center justify-center gap-2 group relative overflow-hidden text-sm sm:text-base hover:translate-y-[-2px] transition-all duration-300`}
                      onClick={() => toast('No download available currently', { icon: '🚫' })}
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer"></span>
                      <FiDownload size={16} className="relative z-10 group-hover:scale-110 transition-transform" />
                      <span className="relative z-10">Download</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
      />

      {deleteConfirmItem && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 transition-opacity duration-300"
          onClick={closeDeleteConfirmation}
        >
          <div
            className={`${cardClass} rounded-xl border w-full max-w-xs sm:max-w-md overflow-hidden flex flex-col shadow-xl backdrop-blur-xl ${isDarkTheme ? 'shadow-[0_0_30px_rgba(226,61,61,0.3)]' : 'shadow-[0_0_30px_rgba(226,61,61,0.2)]'} transition-all duration-300 transform scale-100 opacity-100`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-3 sm:p-4 flex justify-between items-center bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-t-xl`}>
              <h2 className="text-base sm:text-lg font-semibold flex items-center gap-1 sm:gap-2">
                <FiTrash2 className="opacity-80" />
                Confirm Deletion
              </h2>
              <button
                className="p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm cursor-pointer"
                onClick={closeDeleteConfirmation}
                aria-label="Close"
              >
                <FiX size={16} className="sm:hidden" />
                <FiX size={18} className="hidden sm:block" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <p className="mb-4 sm:mb-6 text-sm sm:text-base">Are you sure you want to delete this item? This action cannot be undone.</p>

              <div className="flex justify-end gap-2 sm:gap-3">
                <button
                  className={`${secondaryButtonClass} rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer text-sm sm:text-base`}
                  onClick={closeDeleteConfirmation}
                >
                  Cancel
                </button>
                <button
                  className="bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2 shadow-md hover:shadow-[0_0_15px_rgba(226,61,61,0.5)] transition-shadow duration-300 cursor-pointer text-sm sm:text-base"
                  onClick={() => deleteMedia(deleteConfirmItem)}
                >
                  <FiTrash2 size={14} className="sm:hidden" />
                  <FiTrash2 size={16} className="hidden sm:block" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-center" />
    </div>
  );
}