"use client";

import type React from "react";

import { useState, useEffect, useRef, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Montserrat } from "next/font/google";
import {
  Search,
  Plus,
  X,
  Moon,
  Sun,
  Filter,
  Calendar,
  Tag,
} from "lucide-react";
import { createPortal } from "react-dom";

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

type ThemeType = {
  background: string;
  foreground: string;
  card: string;
  cardHover: string;
  primary: string;
  primaryHover: string;
  secondary: string;
  secondaryHover: string;
  accent: string;
  accentHover: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  error: string;
};

type ThemeContextType = {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
};

const lightTheme: ThemeType = {
  background: "#f8f9fc",
  foreground: "#1a1c23",
  card: "#ffffff",
  cardHover: "#f1f5f9",
  primary: "#6366f1",
  primaryHover: "#4f46e5",
  secondary: "#f97316",
  secondaryHover: "#ea580c",
  accent: "#10b981",
  accentHover: "#059669",
  muted: "#f1f5f9",
  mutedForeground: "#64748b",
  border: "#e2e8f0",
  input: "#e2e8f0",
  ring: "rgba(99, 102, 241, 0.3)",
  error: "#ef4444",
};

const darkTheme: ThemeType = {
  background: "#0f172a",
  foreground: "#f8fafc",
  card: "#1e293b",
  cardHover: "#334155",
  primary: "#818cf8",
  primaryHover: "#6366f1",
  secondary: "#fb923c",
  secondaryHover: "#f97316",
  accent: "#34d399",
  accentHover: "#10b981",
  muted: "#334155",
  mutedForeground: "#94a3b8",
  border: "#334155",
  input: "#334155",
  ring: "rgba(129, 140, 248, 0.3)",
  error: "#f87171",
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

type PostTag = "Announcement" | "Reminder" | "Event";

type UserType = {
  id: string;
  name: string;
  avatar: string;
  role: "Student" | "Faculty" | "Admin";
};

type Post = {
  id: string;
  title: string;
  content: string;
  author: UserType;
  createdAt: Date;
  year: "Freshman" | "Sophomore" | "Junior" | "Senior" | "All Years";
  tags: PostTag[];
  likes: number;
  comments: number;
  isBookmarked: boolean;
};

const currentUser: UserType = {
  id: "1",
  name: "Alex Johnson",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
  role: "Student",
};

const mockUsers: UserType[] = [
  currentUser,
  {
    id: "2",
    name: "Professor Smith",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    role: "Faculty",
  },
  {
    id: "3",
    name: "Dean Williams",
    avatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    role: "Admin",
  },
  {
    id: "4",
    name: "Sarah Chen",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    role: "Student",
  },
  {
    id: "5",
    name: "Marcus Lee",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    role: "Student",
  },
];

const mockPosts: Post[] = [
  {
    id: "1",
    title: "Final Exam Schedule Posted",
    content:
      "The final exam schedule for this semester has been posted. Please check the university portal for your specific exam times and locations. Remember to bring your student ID and necessary materials.",
    author: mockUsers[1],
    createdAt: new Date("2023-05-15T10:30:00"),
    year: "All Years",
    tags: ["Announcement"],
    likes: 45,
    comments: 12,
    isBookmarked: true,
  },
  {
    id: "2",
    title: "Campus Career Fair Next Week",
    content:
      "Don't miss the annual Career Fair happening next Tuesday in the Student Union Building from 10am to 3pm. Over 50 companies will be present with internship and job opportunities. Bring your resume and dress professionally!",
    author: mockUsers[2],
    createdAt: new Date("2023-05-14T14:15:00"),
    year: "Junior",
    tags: ["Event", "Reminder"],
    likes: 78,
    comments: 23,
    isBookmarked: false,
  },
  {
    id: "4",
    title: "Housing Application Deadline",
    content:
      "Reminder: The deadline for next year's housing application is this Friday at 5pm. Late applications will not be accepted. Make sure to complete all sections and submit your deposit to secure your spot.",
    author: mockUsers[2],
    createdAt: new Date("2023-05-12T09:20:00"),
    year: "All Years",
    tags: ["Reminder"],
    likes: 56,
    comments: 8,
    isBookmarked: true,
  },
  {
    id: "6",
    title: "Campus Sustainability Initiative",
    content:
      "The Environmental Club is launching a new sustainability initiative next month. We're looking for volunteers to help with recycling programs, energy conservation efforts, and awareness campaigns. Join us for an info session this Thursday at 5pm in the Science Building, room 103.",
    author: mockUsers[3],
    createdAt: new Date("2023-05-10T11:45:00"),
    year: "All Years",
    tags: ["Announcement", "Event"],
    likes: 89,
    comments: 31,
    isBookmarked: false,
  },
  {
    id: "7",
    title: "Library Hours Extended for Finals",
    content:
      "The university library will be extending its hours during finals week. Starting next Monday, the library will be open 24/7 until the end of finals. Study rooms can be reserved online up to 3 days in advance.",
    author: mockUsers[1],
    createdAt: new Date("2023-05-09T13:15:00"),
    year: "All Years",
    tags: ["Announcement"],
    likes: 103,
    comments: 14,
    isBookmarked: true,
  },
  {
    id: "8",
    title: "Senior Graduation Ceremony Details",
    content:
      "Important information for graduating seniors: The commencement ceremony will take place on May 28th at 10am in the University Stadium. Graduates should arrive by 8:30am for lineup and instructions. Each student will receive 6 guest tickets, which will be available for pickup starting next week.",
    author: mockUsers[2],
    createdAt: new Date("2023-05-08T10:00:00"),
    year: "Senior",
    tags: ["Announcement", "Reminder"],
    likes: 145,
    comments: 42,
    isBookmarked: false,
  },
];

type ToastType = "success" | "error" | "info";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

function Footer() {
  const { theme } = useContext(ThemeContext);

  return (
    <footer
      className="py-6 mt-8 border-t"
      style={{
        backgroundColor: theme.card,
        borderColor: theme.border,
      }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-montserrat">
              <span style={{ color: theme.primary }}>Campus</span>Connect
            </h2>
            <span style={{ color: theme.mutedForeground }}>•</span>
            <span className="text-sm" style={{ color: theme.mutedForeground }}>
              {new Date().getFullYear()} All rights reserved
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm hover:underline transition-all"
              style={{ color: theme.mutedForeground }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = theme.foreground;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = theme.mutedForeground;
              }}
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm hover:underline transition-all"
              style={{ color: theme.mutedForeground }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = theme.foreground;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = theme.mutedForeground;
              }}
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm hover:underline transition-all"
              style={{ color: theme.mutedForeground }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = theme.foreground;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = theme.mutedForeground;
              }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function CampusCommunicationPlatform() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(mockPosts);
  const [selectedYear, setSelectedYear] = useState<"Freshman" | "Sophomore" | "Junior" | "Senior" | "All Years">("All Years");
  const [selectedTags, setSelectedTags] = useState<PostTag[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const themeContextValue = {
    theme: isDarkMode ? darkTheme : lightTheme,
    isDark: isDarkMode,
    toggleTheme: () => setIsDarkMode(!isDarkMode),
  };

  useEffect(() => {
    let filtered = [...posts];

    if (selectedYear !== "All Years") {
      filtered = filtered.filter(
        (post) => post.year === selectedYear || post.year === "All Years"
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) =>
        post.tags.some((tag) => selectedTags.includes(tag))
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query)
      );
    }

    setFilteredPosts(filtered);
  }, [posts, selectedYear, selectedTags, searchQuery]);

  const addPost = (
    post: Omit<Post, "id" | "createdAt" | "likes" | "comments" | "isBookmarked">
  ) => {
    const newPost: Post = {
      id: Date.now().toString(),
      ...post,
      createdAt: new Date(),
      likes: 0,
      comments: 0,
      isBookmarked: false,
    };

    setPosts((prev) => [newPost, ...prev]);
    showToast("Post created successfully!", "success");
  };

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <div
        className={`min-h-screen flex flex-col transition-colors duration-200 ${montserrat.variable}`}
        style={{
          backgroundColor: themeContextValue.theme.background,
          color: themeContextValue.theme.foreground,
        }}
      >
        <Header
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
          showToast={showToast}
        />

        <main className="container mx-auto px-4 py-8 max-w-6xl flex-1">
          <div className="flex flex-col md:flex-row gap-6">
            <Sidebar
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              showMobileMenu={showMobileMenu}
              setShowMobileMenu={setShowMobileMenu}
            />

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold font-montserrat">
                  Campus Feed
                  {selectedYear !== "All Years" && (
                    <span
                      className="ml-2 text-lg font-medium"
                      style={{ color: themeContextValue.theme.primary }}
                    >
                      • {selectedYear}
                    </span>
                  )}
                </h1>

                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: themeContextValue.theme.input,
                        borderColor: themeContextValue.theme.border,
                        color: themeContextValue.theme.foreground,
                        boxShadow: `0 0 0 2px ${themeContextValue.theme.ring}`,
                      }}
                    />
                    <Search
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                      style={{ color: themeContextValue.theme.mutedForeground }}
                    />
                  </div>

                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
                    style={{
                      backgroundColor: themeContextValue.theme.primary,
                      color: "#ffffff",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor =
                        themeContextValue.theme.primaryHover;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor =
                        themeContextValue.theme.primary;
                    }}
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">New Post</span>
                  </button>
                </div>
              </div>

              {filteredPosts.length === 0 ? (
                <EmptyState
                  setSelectedYear={setSelectedYear}
                  setSelectedTags={setSelectedTags}
                  setSearchQuery={setSearchQuery}
                />
              ) : (
                <div className="space-y-6">
                  {filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
        {showCreateModal && (
          <CreatePostModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={addPost}
            currentUser={currentUser}
          />
        )}
        <ToastContainer toasts={toasts} />
      </div>
    </ThemeContext.Provider>
  );
}

function Header({
  showMobileMenu,
  setShowMobileMenu,
  showToast,
}: {
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
  showToast: (message: string, type: ToastType) => void;
}) {
  const { theme, isDark, toggleTheme } = useContext(ThemeContext);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileAction = (action: string) => {
    showToast(`${action} feature is not available yet`, "info");
    setShowProfileMenu(false);
  };

  return (
    <header
      className="sticky top-0 z-10 py-4 px-6 shadow-sm"
      style={{
        backgroundColor: theme.card,
        borderBottom: `1px solid ${theme.border}`,
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              className="md:hidden cursor-pointer"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <X className="w-6 h-6" style={{ color: theme.foreground }} />
              ) : (
                <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
                  <div
                    className="h-0.5 w-6 rounded-full"
                    style={{ backgroundColor: theme.foreground }}
                  ></div>
                  <div
                    className="h-0.5 w-6 rounded-full"
                    style={{ backgroundColor: theme.foreground }}
                  ></div>
                  <div
                    className="h-0.5 w-6 rounded-full"
                    style={{ backgroundColor: theme.foreground }}
                  ></div>
                </div>
              )}
            </button>

            <h1 className="text-xl font-bold font-montserrat">
              <span style={{ color: theme.primary }}>Campus</span>Connect
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="p-2 rounded-full transition-colors cursor-pointer"
              onClick={toggleTheme}
              style={{ backgroundColor: theme.muted }}
            >
              {isDark ? (
                <Sun className="w-5 h-5" style={{ color: theme.foreground }} />
              ) : (
                <Moon className="w-5 h-5" style={{ color: theme.foreground }} />
              )}
            </button>
            <div className="flex items-center gap-2 ml-2 relative" ref={profileMenuRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 rounded-full transition-transform hover:scale-105"
              >
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
                  alt="User avatar"
                  className="w-8 h-8 rounded-full object-cover border-2"
                  style={{ borderColor: theme.primary }}
                />
                <span className="hidden md:block font-medium">Alex</span>
              </button>
              
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg z-50 overflow-hidden"
                  style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}
                >
                  <div className="py-1">
                    <div className="px-4 py-3 border-b" style={{ borderColor: theme.border }}>
                      <p className="text-sm font-medium">Alex Johnson</p>
                      <p className="text-xs truncate" style={{ color: theme.mutedForeground }}>
                        alex@university.edu
                      </p>
                    </div>
                    
                    <button
                      className="w-full text-left px-4 py-2 text-sm transition-colors hover:bg-opacity-10"
                      style={{ 
                        color: theme.foreground
                      }}
                      onClick={() => handleProfileAction("View Profile")}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = theme.muted;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      View Profile
                    </button>
                    
                    <button
                      className="w-full text-left px-4 py-2 text-sm transition-colors hover:bg-opacity-10"
                      style={{ 
                        color: theme.foreground
                      }}
                      onClick={() => handleProfileAction("Account Settings")}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = theme.muted;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      Account Settings
                    </button>
                    
                    <button
                      className="w-full text-left px-4 py-2 text-sm transition-colors hover:bg-opacity-10"
                      style={{ 
                        color: theme.foreground
                      }}
                      onClick={() => handleProfileAction("Messages")}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = theme.muted;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      Messages
                    </button>
                    
                    <div className="border-t my-1" style={{ borderColor: theme.border }}></div>
                    
                    <button
                      className="w-full text-left px-4 py-2 text-sm transition-colors hover:bg-opacity-10"
                      style={{ 
                        color: theme.error
                      }}
                      onClick={() => handleProfileAction("Sign Out")}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = theme.muted;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Sidebar({
  selectedYear,
  setSelectedYear,
  selectedTags,
  setSelectedTags,
  showMobileMenu,
  setShowMobileMenu,
}: {
  selectedYear: "Freshman" | "Sophomore" | "Junior" | "Senior" | "All Years";
  setSelectedYear: (year: "Freshman" | "Sophomore" | "Junior" | "Senior" | "All Years") => void;
  selectedTags: PostTag[];
  setSelectedTags: (tags: PostTag[]) => void;
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
}) {
  const { theme } = useContext(ThemeContext);
  const years = ["All Years", "Freshman", "Sophomore", "Junior", "Senior"] as const;
  const tags: PostTag[] = ["Announcement", "Reminder", "Event"];

  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showMobileMenu]);

  const toggleTag = (tag: PostTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 backdrop-blur-sm z-40 transition-all duration-300 md:hidden ${
          showMobileMenu ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: showMobileMenu ? 0 : "-100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-[280px] h-full shadow-xl relative"
          style={{ backgroundColor: theme.card }}
        >
          <button
            onClick={() => setShowMobileMenu(false)}
            className="absolute top-4 right-4 p-2 rounded-full cursor-pointer"
            style={{ backgroundColor: theme.muted }}
          >
            <X className="w-5 h-5" style={{ color: theme.foreground }} />
          </button>

          <div className="p-4 pt-14">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 font-montserrat">
                <Calendar
                  className="w-5 h-5"
                  style={{ color: theme.primary }}
                />
                Year
              </h2>
              <div className="space-y-2">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-between`}
                    style={{
                      backgroundColor:
                        selectedYear === year ? theme.primary : "transparent",
                      color:
                        selectedYear === year ? "#ffffff" : theme.foreground,
                    }}
                  >
                    {year}
                    {selectedYear === year && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 font-montserrat">
                <Tag className="w-5 h-5" style={{ color: theme.primary }} />
                Tags
              </h2>
              <div className="space-y-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-between`}
                    style={{
                      backgroundColor: selectedTags.includes(tag)
                        ? theme.muted
                        : "transparent",
                      color: theme.foreground,
                      borderLeft: selectedTags.includes(tag)
                        ? `3px solid ${theme.primary}`
                        : "3px solid transparent",
                    }}
                  >
                    {tag}
                    {selectedTags.includes(tag) && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: theme.primary }}
                      ></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
      <aside className="hidden md:block w-64 flex-shrink-0">
        <div
          className="sticky top-[88px] rounded-lg overflow-hidden"
          style={{
            backgroundColor: theme.card,
            borderLeft: `4px solid ${theme.primary}`,
          }}
        >
          <div className="p-4">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 font-montserrat">
                <Calendar
                  className="w-5 h-5"
                  style={{ color: theme.primary }}
                />
                Year
              </h2>
              <div className="space-y-2">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-between`}
                    style={{
                      backgroundColor:
                        selectedYear === year ? theme.primary : "transparent",
                      color:
                        selectedYear === year ? "#ffffff" : theme.foreground,
                    }}
                  >
                    {year}
                    {selectedYear === year && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 font-montserrat">
                <Tag className="w-5 h-5" style={{ color: theme.primary }} />
                Tags
              </h2>
              <div className="space-y-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-between`}
                    style={{
                      backgroundColor: selectedTags.includes(tag)
                        ? theme.muted
                        : "transparent",
                      color: theme.foreground,
                      borderLeft: selectedTags.includes(tag)
                        ? `3px solid ${theme.primary}`
                        : "3px solid transparent",
                    }}
                  >
                    {tag}
                    {selectedTags.includes(tag) && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: theme.primary }}
                      ></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function PostCard({ post }: { post: Post }) {
  const { theme } = useContext(ThemeContext);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg overflow-hidden"
      style={{
        backgroundColor: theme.card,
        borderLeft: `4px solid ${
          post.tags.includes("Announcement")
            ? theme.primary
            : post.tags.includes("Event")
            ? theme.secondary
            : post.tags.includes("Reminder")
            ? theme.accent
            : theme.muted
        }`,
      }}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar || "/placeholder.svg"}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="font-medium">{post.author.name}</div>
              <div className="text-sm" style={{ color: theme.mutedForeground }}>
                {post.author.role} • {formatDate(post.createdAt)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {post.year !== "All Years" && (
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  backgroundColor: theme.muted,
                  color: theme.mutedForeground,
                }}
              >
                {post.year}
              </span>
            )}
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2 font-montserrat">
          {post.title}
        </h3>
        <p className="mb-4" style={{ color: theme.foreground }}>
          {post.content}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{
                backgroundColor:
                  tag === "Announcement"
                    ? `${theme.primary}20`
                    : tag === "Event"
                    ? `${theme.secondary}20`
                    : tag === "Reminder"
                    ? `${theme.accent}20`
                    : tag === "Question"
                    ? `${theme.muted}`
                    : `${theme.muted}`,
                color:
                  tag === "Announcement"
                    ? theme.primary
                    : tag === "Event"
                    ? theme.secondary
                    : tag === "Reminder"
                    ? theme.accent
                    : theme.foreground,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState({
  setSelectedYear,
  setSelectedTags,
  setSearchQuery,
}: {
  setSelectedYear: (year: "Freshman" | "Sophomore" | "Junior" | "Senior" | "All Years") => void;
  setSelectedTags: (tags: PostTag[]) => void;
  setSearchQuery: (query: string) => void;
}) {
  const { theme } = useContext(ThemeContext);

  const handleClearFilters = () => {
    setSelectedYear("All Years");
    setSelectedTags([]);
    setSearchQuery("");
  };

  return (
    <div
      className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-lg"
      style={{ backgroundColor: theme.card }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: theme.muted }}
      >
        <Filter className="w-8 h-8" style={{ color: theme.mutedForeground }} />
      </div>
      <h3 className="text-xl font-semibold mb-2 font-montserrat">
        No posts found
      </h3>
      <p className="max-w-md mb-6" style={{ color: theme.mutedForeground }}>
        No posts match your current filters. Try adjusting your year selection,
        tags, or search query.
      </p>
      <button
        onClick={handleClearFilters}
        className="px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
        style={{
          backgroundColor: theme.primary,
          color: "#ffffff",
        }}
      >
        Clear Filters
      </button>
    </div>
  );
}

function CreatePostModal({
  onClose,
  onSubmit,
  currentUser,
}: {
  onClose: () => void;
  onSubmit: (
    post: Omit<Post, "id" | "createdAt" | "likes" | "comments" | "isBookmarked">
  ) => void;
  currentUser: UserType;
}) {
  const { theme } = useContext(ThemeContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [year, setYear] = useState<
    "Freshman" | "Sophomore" | "Junior" | "Senior" | "All Years"
  >("All Years");
  const [tags, setTags] = useState<PostTag[]>([]);
  const [hasSubmitAttempt, setHasSubmitAttempt] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const toggleTag = (tag: PostTag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitAttempt(true);

    if (!title.trim() || !content.trim() || tags.length === 0) {
      return;
    }

    onSubmit({
      title,
      content,
      author: currentUser,
      year,
      tags,
    });

    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl rounded-lg overflow-hidden"
        style={{ backgroundColor: theme.card }}
        ref={modalRef}
      >
        <div
          className="flex justify-between items-center p-4 border-b"
          style={{ borderColor: theme.border }}
        >
          <h2
            className="text-xl font-semibold font-montserrat"
            style={{ color: theme.foreground }}
          >
            Create New Post
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-opacity-10 transition-colors cursor-pointer"
            style={{ color: theme.foreground }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = theme.muted;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <X className="w-6 h-6" style={{ color: theme.foreground }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label
              className="block mb-2 font-medium"
              style={{ color: theme.foreground }}
            >
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your post"
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: theme.input,
                borderColor: theme.border,
                color: theme.foreground,
              }}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block mb-2 font-medium"
              style={{ color: theme.foreground }}
            >
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What would you like to share?"
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all min-h-[150px]"
              style={{
                backgroundColor: theme.input,
                borderColor: theme.border,
                color: theme.foreground,
              }}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block mb-2 font-medium"
              style={{ color: theme.foreground }}
            >
              Audience
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value as any)}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all appearance-none"
              style={{
                backgroundColor: theme.input,
                borderColor: theme.border,
                color: theme.foreground,
              }}
            >
              <option value="All Years">All Years</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              className="block mb-2 font-medium"
              style={{ color: theme.foreground }}
            >
              Tags <span style={{ color: theme.error }}>*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {(["Announcement", "Reminder", "Event"] as PostTag[]).map(
                (tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer`}
                    style={{
                      backgroundColor: tags.includes(tag)
                        ? tag === "Announcement"
                          ? `${theme.primary}20`
                          : tag === "Event"
                          ? `${theme.secondary}20`
                          : tag === "Reminder"
                          ? `${theme.accent}20`
                          : `${theme.muted}`
                        : theme.muted,
                      color: tags.includes(tag)
                        ? tag === "Announcement"
                          ? theme.primary
                          : tag === "Event"
                          ? theme.secondary
                          : tag === "Reminder"
                          ? theme.accent
                          : theme.foreground
                        : theme.foreground,
                      border: tags.includes(tag)
                        ? `1px solid ${
                            tag === "Announcement"
                              ? theme.primary
                              : tag === "Event"
                              ? theme.secondary
                              : tag === "Reminder"
                              ? theme.accent
                              : theme.border
                          }`
                        : `1px solid ${theme.border}`,
                    }}
                  >
                    {tag}
                  </button>
                )
              )}
            </div>
            {hasSubmitAttempt && tags.length === 0 && (
              <p className="mt-2 text-sm" style={{ color: theme.error }}>
                Please select at least one tag
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: theme.muted,
                color: theme.foreground,
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: theme.primary,
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = theme.primaryHover;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = theme.primary;
              }}
            >
              Post
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
}

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  const { theme } = useContext(ThemeContext);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.2 }}
            className="px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-xs"
            style={{
              backgroundColor:
                toast.type === "success"
                  ? theme.accent
                  : toast.type === "error"
                  ? theme.error
                  : theme.card,
              color:
                toast.type === "success" || toast.type === "error"
                  ? "#ffffff"
                  : theme.foreground,
            }}
          >
            {toast.type === "success" && (
              <div className="w-5 h-5 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 3L4.5 8.5L2 6"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
            {toast.type === "error" && (
              <div className="w-5 h-5 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 3L3 9M3 3L9 9"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
            {toast.type === "info" && (
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: theme.primary }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 8V6M6 4H6.005M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
            <span>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}