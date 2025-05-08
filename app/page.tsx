"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Search,
  Plus,
  Camera,
  X,
  Menu,
  Home,
  Compass,
  BookOpen,
  User,
  ChevronLeft,
  Calendar,
  Tag,
  ArrowUpRight,
  Trash2,
  Loader,
  Heart,
  Sun,
  Moon,
  Edit,
  RefreshCw,
  DollarSign,
  Bookmark,
  Star,
  TrendingUp,
  Grid,
  List,
  Umbrella,
  LandmarkIcon,
  Mountain,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_COVERS = [
  "https://images.unsplash.com/photo-1707343848552-893e05dba6ac?fm=jpg&q=60&w=3000",
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?fm=jpg&q=60&w=3000",
  "https://plus.unsplash.com/premium_photo-1661960937960-1883bf00f480?fm=jpg&q=60&w=3000",
  "https://plus.unsplash.com/premium_photo-1664908364593-729f67b1a0e4?fm=jpg&q=60&w=3000",
  "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?fm=jpg&q=60&w=3000",
  "https://plus.unsplash.com/premium_photo-1661962660197-6c2430fb49a6?fm=jpg&q=60&w=3000",
];

const mockTrips = [
  {
    id: 1,
    title: "Bali Adventure",
    coverImage:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?fm=jpg&q=60&w=3000",
    startDate: "2025-01-15",
    endDate: "2025-01-28",
    location: "Bali, Indonesia",
    favorite: true,
    entries: [
      {
        id: 101,
        date: "2025-01-16",
        title: "Rice Terraces Hike",
        content:
          "Explored the stunning Tegallalang Rice Terraces today. The views were absolutely breathtaking with layers of green stretching as far as the eye could see.",
        location: "Tegallalang, Bali",
        coordinates: { lat: -8.4312, lng: 115.2767 },
        images: [
          "https://images.unsplash.com/photo-1621217308295-afe2f0b40a69?fm=jpg&q=60&w=3000",
          "https://images.unsplash.com/photo-1555400038-63f5ba517a47?fm=jpg&q=60&w=3000",
        ],
        tags: ["hiking", "nature", "views"],
      },
      {
        id: 102,
        date: "2025-01-18",
        title: "Sacred Monkey Forest",
        content:
          "Visited the Sacred Monkey Forest in Ubud. So many playful monkeys everywhere! Had to be careful with my belongings though.",
        location: "Ubud, Bali",
        coordinates: { lat: -8.5188, lng: 115.2582 },
        images: [
          "https://images.unsplash.com/photo-1565970141923-345a5f05a6e6?fm=jpg&q=60&w=3000",
        ],
        tags: ["wildlife", "culture"],
      },
    ],
  },
  {
    id: 2,
    title: "Japan Expedition",
    coverImage:
      "https://images.squarespace-cdn.com/content/56569c86e4b0a63eb2b56f75/1705446726772-VFQOKKZDJTT6IRQDMUQX/manuel-cosentino-n--CMLApjfI-unsplash.jpg?format=1500w&content-type=image%2Fjpeg",
    startDate: "2024-11-03",
    endDate: "2024-11-17",
    location: "Tokyo, Japan",
    favorite: false,
    entries: [
      {
        id: 201,
        date: "2024-11-05",
        title: "Shibuya Crossing",
        content:
          "Experienced the famous Shibuya Crossing today. The organized chaos of so many people crossing at once was a sight to behold!",
        location: "Shibuya, Tokyo",
        coordinates: { lat: 35.6595, lng: 139.7004 },
        images: [
          "https://images.unsplash.com/photo-1573456373835-579c408de263?fm=jpg&q=60&w=3000",
        ],
        tags: ["city", "crowded", "iconic"],
      },
    ],
  },
  {
    id: 3,
    title: "Italian Getaway",
    coverImage:
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?fm=jpg&q=60&w=3000",
    startDate: "2024-09-10",
    endDate: "2024-09-20",
    location: "Rome, Italy",
    favorite: true,
    entries: [
      {
        id: 301,
        date: "2024-09-12",
        title: "Colosseum Visit",
        content:
          "Finally saw the magnificent Colosseum in person. The historical significance and architectural marvel left me in awe.",
        location: "Rome, Italy",
        coordinates: { lat: 41.8902, lng: 12.4922 },
        images: [
          "https://images.unsplash.com/photo-1699012462295-bace478f27bc?fm=jpg&q=60&w=3000",
          "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?fm=jpg&q=60&w=3000",
        ],
        tags: ["history", "architecture"],
      },
    ],
  },
];

// Popular destinations data
const destinations = [
  {
    id: 1,
    name: "Bali, Indonesia",
    image:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?fm=jpg&q=60&w=3000",
    description:
      "Tropical paradise with stunning beaches, lush rice terraces, and vibrant culture.",
    category: "beach",
    averageCost: "$50-100/day",
    bestTimeToVisit: "April to October",
    rating: 4.8,
    trending: true,
  },
  {
    id: 2,
    name: "Kyoto, Japan",
    image:
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?fm=jpg&q=60&w=3000",
    description:
      "Ancient temples, traditional gardens, and serene bamboo forests.",
    category: "cultural",
    averageCost: "$70-150/day",
    bestTimeToVisit: "March-May and Oct-Nov",
    rating: 4.9,
    trending: true,
  },
  {
    id: 3,
    name: "Santorini, Greece",
    image:
      "https://plus.unsplash.com/premium_photo-1661963643348-e95c6387ee8a?fm=jpg&q=60&w=3000",
    description:
      "Iconic white buildings with blue domes overlooking the Aegean Sea.",
    category: "beach",
    averageCost: "$80-200/day",
    bestTimeToVisit: "May to October",
    rating: 4.7,
    trending: true,
  },
  {
    id: 4,
    name: "Machu Picchu, Peru",
    image:
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?fm=jpg&q=60&w=3000",
    description: "Ancient Incan citadel set high in the Andes Mountains.",
    category: "adventure",
    averageCost: "$60-120/day",
    bestTimeToVisit: "May to September",
    rating: 4.9,
    trending: false,
  },
  {
    id: 5,
    name: "Swiss Alps, Switzerland",
    image:
      "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?fm=jpg&q=60&w=3000",
    description:
      "Breathtaking mountain landscapes perfect for hiking and skiing.",
    category: "adventure",
    averageCost: "$100-250/day",
    bestTimeToVisit: "June to September (summer), December to March (winter)",
    rating: 4.8,
    trending: false,
  },
  {
    id: 6,
    name: "Rome, Italy",
    image:
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?fm=jpg&q=60&w=3000",
    description: "Ancient ruins, Renaissance art, and incredible cuisine.",
    category: "cultural",
    averageCost: "$70-150/day",
    bestTimeToVisit: "April to May, September to October",
    rating: 4.6,
    trending: false,
  },
  {
    id: 7,
    name: "Marrakech, Morocco",
    image:
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?fm=jpg&q=60&w=3000",
    description:
      "Vibrant markets, stunning palaces, and rich cultural heritage.",
    category: "cultural",
    averageCost: "$40-100/day",
    bestTimeToVisit: "March to May, September to November",
    rating: 4.5,
    trending: true,
  },
  {
    id: 8,
    name: "New Zealand",
    image:
      "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?fm=jpg&q=60&w=3000",
    description:
      "Dramatic landscapes from mountains to beaches, perfect for outdoor activities.",
    category: "adventure",
    averageCost: "$70-150/day",
    bestTimeToVisit: "December to February",
    rating: 4.8,
    trending: false,
  },
];

// Travel inspiration articles
const travelArticles = [
  {
    id: 1,
    title: "10 Hidden Beaches You Need to Visit",
    image:
      "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?fm=jpg&q=60&w=3000",
    excerpt: "Discover secluded paradise beaches away from the tourist crowds.",
    readTime: "5 min read",
    category: "beach",
  },
  {
    id: 2,
    title: "Ultimate Guide to Solo Travel",
    image:
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?fm=jpg&q=60&w=3000",
    excerpt: "Everything you need to know for your first solo adventure.",
    readTime: "8 min read",
    category: "tips",
  },
  {
    id: 3,
    title: "Budget Travel: See More for Less",
    image:
      "https://images.unsplash.com/photo-1679678691006-0ad24fecb769?fm=jpg&q=60&w=3000",
    excerpt:
      "Smart strategies to maximize your travel budget without sacrificing experiences.",
    readTime: "6 min read",
    category: "tips",
  },
];

// ─── 1) TYPES ────────────────────────────────────────────────────────────────

interface Entry {
  id: number;
  date: string;
  title: string;
  content: string;
  location: string;
  coordinates: { lat: number; lng: number };
  images: string[];
  tags: string[];
}

interface Trip {
  id: number;
  title: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  location: string;
  favorite: boolean;
  entries: Entry[];
}

type View =
  | "home"
  | "trip-detail"
  | "entry-detail"
  | "explore"
  | "journal"
  | "profile";

interface Notification {
  show: boolean;
  message: string;
  type: "info" | "success" | "error";
}

// ─── 2) PROPS FOR CHILD COMPONENTS ─────────────────────────────────────────

interface NavbarItemProps {
  icon: React.ReactNode;
  label?: string;
  isActive?: boolean;
  onClick: () => void;
  special?: boolean;
  minimal?: boolean;
  darkMode: boolean;
}

interface HomeViewProps {
  trips: Trip[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onCreateTrip: () => void;
  onSelectTrip: (trip: Trip) => void;
  toggleFavorite: (tripId: number) => void;
}

interface TripDetailViewProps {
  trip: Trip;
  onBack: () => void;
  onSelectEntry: (entry: Entry) => void;
  onCreateEntry: () => void;
  onUpdateTrip: (updatedTrip: Trip) => void;
  onDeleteTrip: (tripId: number) => void;
  toggleFavorite: (tripId: number) => void;
  setSelectedEntry: (entry: Entry) => void;
  setCurrentView: (view: View) => void;
  setSelectedTrip: (trip: Trip | null) => void;
}

interface EntryDetailViewProps {
  entry: Entry;
  onBack: () => void;
  onUpdate: (updatedEntry: Entry) => void;
  onDelete: (entryId: number) => void;
  onPhotoUpload: () => void;
  onRemovePhoto: (index: number) => void;
}

// Main App Component
export default function TravelJournalApp() {
  // State management
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentView, setCurrentView] = useState<View>("home");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [notification, setNotification] = useState<Notification>({
    show: false,
    message: "",
    type: "info",
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    // try to load saved trips
    const stored = localStorage.getItem("trips");
    if (stored) {
      setTrips(JSON.parse(stored));
      setIsLoading(false);
    } else {
      // Simulate loading time
      setTimeout(() => {
        setTrips(mockTrips);
        setIsLoading(false);
      }, 1500);
    }

    // Network status detection
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("trips", JSON.stringify(trips));
    }
  }, [trips]);

  // Service worker registration for offline support
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // This would be the actual implementation in a real app
      // navigator.serviceWorker.register('/service-worker.js');

      // For demo purposes we'll just log it
      console.log(
        "Service Worker would be registered here for offline support"
      );
    }
  }, []);

  // Handle notification display
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Filter trips based on search query
  const filteredTrips = trips.filter(
    (trip) =>
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.entries.some(
        (entry) =>
          entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
  );

  // Create new trip handler
  const handleCreateTrip = () => {
    const coverImage =
      DEFAULT_COVERS[Math.floor(Math.random() * DEFAULT_COVERS.length)];

    const newTrip: Trip = {
      id: Date.now(),
      title: "New Trip",
      coverImage,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      location: "Add location",
      favorite: false,
      entries: [],
    };

    setTrips([newTrip, ...trips]);
    setSelectedTrip(newTrip);
    setCurrentView("trip-detail");
    showNotification("New trip created!", "success");
  };

  // Create new entry handler
  const handleCreateEntry = () => {
    if (!selectedTrip) return;

    // Create new entry with geolocation (in a real app would use the browser's geolocation API)
    const mockCoordinates = { lat: 40.7128, lng: -74.006 }; // New York coordinates as placeholder

    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      title: "New Entry",
      content: "",
      location: "Add location",
      coordinates: mockCoordinates,
      images: [],
      tags: [],
    };

    const updatedTrip = {
      ...selectedTrip,
      entries: [newEntry, ...selectedTrip.entries],
    };

    setTrips(
      trips.map((trip) => (trip.id === selectedTrip.id ? updatedTrip : trip))
    );
    setSelectedTrip(updatedTrip);
    setSelectedEntry(newEntry);
    setCurrentView("entry-detail");
    showNotification("New entry created!", "success");
  };

  // Toggle favorite status for a trip
  const toggleFavorite = (tripId: number) => {
    setTrips(
      trips.map((trip) =>
        trip.id === tripId ? { ...trip, favorite: !trip.favorite } : trip
      )
    );

    // Update selected trip if it's the current one
    if (selectedTrip && selectedTrip.id === tripId) {
      setSelectedTrip({ ...selectedTrip, favorite: !selectedTrip.favorite });
    }
  };

  // Delete trip handler
  const deleteTrip = (tripId: number) => {
    setTrips(trips.filter((trip) => trip.id !== tripId));

    if (selectedTrip && selectedTrip.id === tripId) {
      setSelectedTrip(null);
      setCurrentView("home");
    }

    showNotification("Trip deleted!", "success");
  };

  // Delete entry handler
  const deleteEntry = (entryId: number) => {
    if (!selectedTrip) return;

    const updatedEntries = selectedTrip.entries.filter(
      (entry) => entry.id !== entryId
    );
    const updatedTrip = {
      ...selectedTrip,
      entries: updatedEntries,
    };

    setTrips(
      trips.map((trip) => (trip.id === selectedTrip.id ? updatedTrip : trip))
    );
    setSelectedTrip(updatedTrip);

    if (selectedEntry && selectedEntry.id === entryId) {
      setSelectedEntry(null);
      setCurrentView("trip-detail");
    }

    showNotification("Entry deleted!", "success");
  };

  // Update trip handler
  const updateTrip = (updatedTrip: Trip) => {
    setTrips(
      trips.map((trip) => (trip.id === updatedTrip.id ? updatedTrip : trip))
    );
    setSelectedTrip(updatedTrip);
    showNotification("Trip updated!", "success");
  };

  // Update entry handler
  const updateEntry = (updatedEntry: Entry) => {
    if (!selectedTrip) return;

    const updatedEntries = selectedTrip.entries.map((entry) =>
      entry.id === updatedEntry.id ? updatedEntry : entry
    );

    const updatedTrip = {
      ...selectedTrip,
      entries: updatedEntries,
    };

    setTrips(
      trips.map((trip) => (trip.id === selectedTrip.id ? updatedTrip : trip))
    );
    setSelectedTrip(updatedTrip);
    setSelectedEntry(updatedEntry);
    showNotification("Entry updated!", "success");
  };

  // Photo upload handler
  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  // Process uploaded photo
  const processPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedEntry) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const updatedEntry: Entry = {
        ...selectedEntry,
        images: [...selectedEntry.images, base64],
      };
      updateEntry(updatedEntry);
    };
    reader.readAsDataURL(file);
  };

  // Remove photo handler
  const removePhoto = (index: number) => {
    if (!selectedEntry) return;

    const updatedImages = [...selectedEntry.images];
    updatedImages.splice(index, 1);

    const updatedEntry = {
      ...selectedEntry,
      images: updatedImages,
    };

    updateEntry(updatedEntry);
  };

  // Show notification helper
  const showNotification = (
    message: string,
    type: "info" | "success" | "error" = "info"
  ) => {
    setNotification({
      show: true,
      message,
      type,
    });
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Main renderer - decides which view to show
  const renderMainContent = () => {
    switch (currentView) {
      case "home":
        return (
          <HomeView
            trips={filteredTrips}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onCreateTrip={handleCreateTrip}
            onSelectTrip={(trip) => {
              setSelectedTrip(trip);
              setCurrentView("trip-detail");
            }}
            toggleFavorite={toggleFavorite}
          />
        );

      case "trip-detail":
        return selectedTrip ? (
          <TripDetailView
            trip={selectedTrip}
            onBack={() => setCurrentView("home")}
            onSelectEntry={(entry) => {
              setSelectedEntry(entry);
              setCurrentView("entry-detail");
            }}
            onCreateEntry={handleCreateEntry}
            onUpdateTrip={updateTrip}
            onDeleteTrip={deleteTrip}
            toggleFavorite={toggleFavorite}
            setSelectedEntry={setSelectedEntry}
            setCurrentView={setCurrentView}
            setSelectedTrip={setSelectedTrip}
          />
        ) : null;

      case "entry-detail":
        return selectedEntry ? (
          <EntryDetailView
            entry={selectedEntry}
            onBack={() => {
              setSelectedEntry(null);
              setCurrentView("trip-detail");
            }}
            onUpdate={updateEntry}
            onDelete={deleteEntry}
            onPhotoUpload={handlePhotoUpload}
            onRemovePhoto={removePhoto}
          />
        ) : null;

      case "explore":
        return <ExploreView />;

      case "journal":
        return <JournalView trips={trips} />;

      case "profile":
        return <ProfileView />;

      default:
        return (
          <HomeView
            trips={filteredTrips}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onCreateTrip={handleCreateTrip}
            onSelectTrip={(trip) => {
              setSelectedTrip(trip);
              setCurrentView("trip-detail");
            }}
            toggleFavorite={toggleFavorite}
          />
        );
    }
  };

  return (
    <div
      className={`${
        darkMode
          ? "dark bg-slate-900 text-gray-100"
          : "bg-amber-50 text-gray-800"
      } min-h-screen flex flex-col transition-colors duration-300`}
      style={{ fontFamily: "var(--font-roboto), sans-serif" }}
    >
      {/* Offscreen file input for photo uploads */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={processPhoto}
      />

      {/* Header */}
      <header
        className={`${
          darkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-amber-100 border-amber-200"
        } px-4 py-3 flex items-center justify-between border-b transition-colors duration-300 fixed top-0 left-0 right-0 z-20`}
      >
        <div className="flex items-center gap-3">
          {currentView !== "home" && (
            <button
              onClick={() => {
                if (currentView === "entry-detail") {
                  setCurrentView("trip-detail");
                  setSelectedEntry(null);
                } else {
                  setCurrentView("home");
                  setSelectedTrip(null);
                }
              }}
              className={`${
                darkMode
                  ? "text-gray-200 hover:bg-slate-700"
                  : "text-amber-900 hover:bg-amber-200"
              } p-2 rounded-full transition-colors`}
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <h1
            className={`font-bold text-xl ${
              darkMode ? "text-amber-100" : "text-amber-800"
            } flex items-center gap-2`}
          >
            <Compass
              className={darkMode ? "text-amber-400" : "text-amber-600"}
              size={24}
            />
            Wanderlust
          </h1>
        </div>
      </header>
      
      {/* Add padding to account for fixed header */}
      <div className="pt-12 md:pt-14"></div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-0 z-20 ${
              darkMode ? "bg-black/70" : "bg-black/50"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`${
                darkMode ? "bg-slate-800" : "bg-amber-100"
              } w-64 h-full p-4 flex flex-col gap-4`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <h2
                  className={`font-bold text-xl ${
                    darkMode ? "text-amber-100" : "text-amber-800"
                  }`}
                >
                  Menu
                </h2>
                <button onClick={() => setIsMenuOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="mt-4"></div>
              <NavbarItem
                icon={<Home size={20} />}
                label="Home"
                isActive={currentView === "home"}
                onClick={() => {
                  setCurrentView("home");
                  setIsMenuOpen(false);
                }}
                darkMode={darkMode}
              />
              <NavbarItem
                icon={<Compass size={20} />}
                label="Explore"
                isActive={currentView === "explore"}
                onClick={() => {
                  setCurrentView("explore");
                  setIsMenuOpen(false);
                }}
                darkMode={darkMode}
              />
              <NavbarItem
                icon={<BookOpen size={20} />}
                label="Journal"
                isActive={currentView === "journal"}
                onClick={() => {
                  setCurrentView("journal");
                  setIsMenuOpen(false);
                }}
                darkMode={darkMode}
              />
              <NavbarItem
                icon={<User size={20} />}
                label="Profile"
                isActive={currentView === "profile"}
                onClick={() => {
                  setCurrentView("profile");
                  setIsMenuOpen(false);
                }}
                darkMode={darkMode}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Container */}
      <div className="flex md:pl-20">
        {/* Desktop Sidebar Navigation */}
        <nav
          className={`${
            darkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-amber-100 border-amber-200"
          } hidden md:flex flex-col w-20 border-r transition-colors duration-300 fixed left-0 top-[48px] bottom-0 overflow-hidden z-10 pt-6`}
        >
          <NavbarItem
            icon={<Home size={24} />}
            label="Home"
            isActive={currentView === "home"}
            onClick={() => setCurrentView("home")}
            darkMode={darkMode}
          />
          <NavbarItem
            icon={<Compass size={24} />}
            label="Explore"
            isActive={currentView === "explore"}
            onClick={() => setCurrentView("explore")}
            darkMode={darkMode}
          />
          <NavbarItem
            icon={<BookOpen size={24} />}
            label="Journal"
            isActive={currentView === "journal"}
            onClick={() => setCurrentView("journal")}
            darkMode={darkMode}
          />
          <NavbarItem
            icon={<User size={24} />}
            label="Profile"
            isActive={currentView === "profile"}
            onClick={() => setCurrentView("profile")}
            darkMode={darkMode}
          />
        </nav>

        {/* Dynamic Content Area */}
        <div className="w-full max-h-[calc(100vh-48px)] overflow-y-auto overflow-x-hidden pb-16 md:pb-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader
                className={`${
                  darkMode ? "text-amber-400" : "text-amber-600"
                } animate-spin`}
                size={48}
              />
              <p className="mt-4 font-medium">Loading your adventures...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderMainContent()}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <nav
        className={`${
          darkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-amber-100 border-amber-200"
        } md:hidden flex items-center justify-around border-t py-2 transition-colors duration-300 fixed bottom-0 left-0 right-0 z-20`}
      >
        <NavbarItem
          icon={<Home size={24} />}
          isActive={currentView === "home"}
          onClick={() => setCurrentView("home")}
          minimal
          darkMode={darkMode}
        />
        <NavbarItem
          icon={<Compass size={24} />}
          isActive={currentView === "explore"}
          onClick={() => setCurrentView("explore")}
          minimal
          darkMode={darkMode}
        />
        <NavbarItem
          icon={<Plus size={28} />}
          special
          onClick={handleCreateTrip}
          darkMode={darkMode}
        />
        <NavbarItem
          icon={<BookOpen size={24} />}
          isActive={currentView === "journal"}
          onClick={() => setCurrentView("journal")}
          minimal
          darkMode={darkMode}
        />
        <NavbarItem
          icon={<User size={24} />}
          isActive={currentView === "profile"}
          onClick={() => setCurrentView("profile")}
          minimal
          darkMode={darkMode}
        />
      </nav>

      {/* Offline Indicator */}
      {!isOnline && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`fixed bottom-16 left-0 right-0 ${
            darkMode ? "bg-red-900 text-white" : "bg-red-500 text-white"
          } p-2 text-center text-sm`}
        >
          You're currently offline. Changes will sync when you reconnect.
        </motion.div>
      )}

      {/* Notification Toast */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`fixed top-20 right-4 max-w-xs p-3 rounded shadow-lg 
            ${
              notification.type === "success"
                ? darkMode
                  ? "bg-green-800 text-green-100"
                  : "bg-green-500 text-white"
                : notification.type === "error"
                ? darkMode
                  ? "bg-red-800 text-red-100"
                  : "bg-red-500 text-white"
                : darkMode
                ? "bg-blue-800 text-blue-100"
                : "bg-blue-500 text-white"
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Navbar Item Component
function NavbarItem({
  icon,
  label,
  isActive,
  onClick,
  special,
  minimal,
  darkMode,
}: NavbarItemProps) {
  if (special) {
    return (
      <button
        onClick={onClick}
        className={`${
          darkMode
            ? "bg-amber-500 text-white hover:bg-amber-600"
            : "bg-amber-600 text-white hover:bg-amber-700"
        } rounded-full p-3 shadow-lg transition-transform hover:scale-105 transform -translate-y-2`}
      >
        {icon}
      </button>
    );
  }

  if (minimal) {
    return (
      <button
        onClick={onClick}
        className={`p-2 rounded-full transition-colors
          ${
            isActive
              ? darkMode
                ? "text-amber-400"
                : "text-amber-800"
              : darkMode
              ? "text-gray-400 hover:text-gray-200"
              : "text-amber-600/70 hover:text-amber-800"
          }`}
      >
        {icon}
      </button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={`flex flex-col items-center justify-center py-5 gap-2 transition-colors
        ${
          isActive
            ? darkMode
              ? "text-amber-400 border-r-4 border-amber-400"
              : "text-amber-800 border-r-4 border-amber-600"
            : darkMode
            ? "text-gray-400 hover:text-gray-200"
            : "text-amber-600/70 hover:text-amber-800"
        }`}
      whileHover={{ scale: isActive ? 1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div>{icon}</div>
      {label && <span className="text-xs font-medium">{label}</span>}
    </motion.button>
  );
}

// Home View Component
function HomeView({
  trips,
  searchQuery,
  setSearchQuery,
  onCreateTrip,
  onSelectTrip,
  toggleFavorite,
}: HomeViewProps) {
  const favoriteTrips = trips.filter((trip) => trip.favorite);
  const recentTrips = [...trips].sort(
    (a, b) => (new Date(b.startDate) as any) - (new Date(a.startDate) as any)
  );

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    }),
    hover: { 
      y: -10,
      scale: 1.02,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 pb-20 md:pb-6 overflow-y-auto max-h-screen">
      {/* Search Bar */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search your trips and memories..."
          value={searchQuery || ""}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500  shadow-sm transition-all"
        />
      </motion.div>

      {/* Welcome Section */}
      <motion.section 
        className="rounded-3xl overflow-hidden relative h-64 md:h-80 group"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <img
          src="https://images.unsplash.com/photo-1489641024260-20e5cb3ee4aa?fm=jpg&q=60&w=3000"
          alt="Travel memories"
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 flex flex-col justify-end p-6">
          <motion.h1 
            className="text-white text-3xl md:text-4xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            Your Travel Journey
          </motion.h1>
          <motion.p 
            className="text-amber-100 text-sm md:text-base mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Capture and relive your most precious travel moments
          </motion.p>
          <motion.button
            onClick={onCreateTrip}
            className="bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-5 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg w-full md:w-auto md:self-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            Start a New Adventure
          </motion.button>
        </div>
      </motion.section>

      {/* Favorites Section */}
      {favoriteTrips.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Favorite Journeys</h2>
            <a href="#see-all">
              <motion.button 
                className="text-sm font-medium flex items-center gap-1 text-amber-700"
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.95 }}
              >
                See all <ArrowUpRight size={16} />
              </motion.button>
            </a>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {favoriteTrips.map((trip, index) => (
              <motion.div
                key={`favorite-${trip.id}`}
                className="snap-start rounded-xl overflow-hidden flex-shrink-0 w-64 bg-white shadow-md cursor-pointer"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                custom={index}
                onClick={() => onSelectTrip(trip)}
              >
                <div className="relative h-40">
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    className="w-full h-full object-cover"
                  />
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(trip.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full backdrop-blur-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart
                      size={18}
                      fill="#F59E0B"
                      className="text-amber-500"
                    />
                  </motion.button>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-amber-800 ">{trip.title}</h3>
                  <div className="flex items-center text-gray-600  text-sm mt-1">
                    <MapPin size={14} className="mr-1" />
                    {trip.location}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Trips Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Adventures</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentTrips.map((trip, index) => (
            <motion.div
              key={`trip-${trip.id}`}
              className="rounded-xl overflow-hidden bg-white shadow-md cursor-pointer"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              custom={index}
              onClick={() => onSelectTrip(trip)}
            >
              <div className="relative h-48">
                <img
                  src={trip.coverImage}
                  alt={trip.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 right-0 px-3 py-2 bg-gradient-to-b from-black/50 to-transparent">
                  <div className="text-white text-xs flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {trip.startDate} - {trip.endDate || "Ongoing"}
                  </div>
                </div>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(trip.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-white/80/80 rounded-full backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart
                    size={18}
                    fill={trip.favorite ? "#F59E0B" : "none"}
                    className={
                      trip.favorite ? "text-amber-500" : "text-gray-500 "
                    }
                  />
                </motion.button>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-amber-800 ">
                  {trip.title}
                </h3>
                <div className="flex items-center text-gray-600  text-sm mt-1">
                  <MapPin size={14} className="mr-1" />
                  {trip.location}
                </div>
                <div className="mt-2 text-sm text-gray-500 ">
                  {trip.entries.length}{" "}
                  {trip.entries.length === 1 ? "entry" : "entries"}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Create Trip Card */}
          <motion.div
            className="rounded-xl overflow-hidden border-2 border-dashed border-amber-200 flex flex-col items-center justify-center p-6 h-64 cursor-pointer hover:border-amber-400 transition-colors"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ 
              scale: 1.03, 
              borderColor: "#F59E0B",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
            }}
            whileTap={{ scale: 0.97 }}
            custom={recentTrips.length}
            onClick={onCreateTrip}
          >
            <motion.div 
              className="bg-amber-100 rounded-full p-3 mb-4"
              whileHover={{ rotate: 90, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Plus size={24} className="text-amber-600" />
            </motion.div>
            <h3 className="font-bold text-amber-800  text-center">
              Create New Trip
            </h3>
            <p className="text-gray-500  text-sm text-center mt-2">
              Start documenting your next adventure
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Trip Detail View Component
function TripDetailView({
  trip,
  onBack,
  onSelectEntry,
  onCreateEntry,
  onUpdateTrip,
  onDeleteTrip,
  toggleFavorite,
  setSelectedEntry,
  setCurrentView,
  setSelectedTrip,
}: TripDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTrip, setEditedTrip] = useState(trip);

  const [showEntryModal, setShowEntryModal] = useState(false);
  const [entryForm, setEntryForm] = useState<Partial<Entry>>({
    date: new Date().toISOString().split("T")[0],
    title: "",
    content: "",
    location: "",
    coordinates: { lat: /* default or 0 */ 0, lng: 0 },
    images: [],
    tags: [],
  });

  // Animation variants
  const entryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    }),
    hover: { 
      y: -5,
      scale: 1.02,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { duration: 0.2 }
    }
  };

  const handleSave = () => {
    onUpdateTrip(editedTrip);
    setIsEditing(false);
  };

  // Format dates for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Group entries by date
  const entriesByDate = trip.entries.reduce((groups: any, entry) => {
    const date = entry.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {});

  // Sort dates in descending order
  const sortedDates = Object.keys(entriesByDate).sort(
    (a, b) => (new Date(b) as any) - (new Date(a) as any)
  );

  return (
    <div className="overflow-y-auto max-h-screen pb-20 md:pb-6">
      {/* Cover Photo and Trip Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={
          isEditing
            ? "relative group h-96 md:h-80"
            : "relative h-64 md:h-80 group"
        }
      >
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="w-full h-full object-cover transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/80">
          {!isEditing ? (
            <div className="absolute bottom-0 left-0 w-full p-6 text-white">
              <div className="flex justify-between items-start">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <h1 className="text-3xl font-bold mb-1">{trip.title}</h1>
                  <div className="flex items-center gap-2 text-amber-100 mb-2">
                    <MapPin size={16} />
                    <span>{trip.location}</span>
                  </div>
                  <div className="text-sm text-gray-200">
                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <motion.button
                    onClick={() => toggleFavorite(trip.id)}
                    className="p-2 bg-white/20 rounded-full backdrop-blur-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart
                      size={20}
                      fill={trip.favorite ? "#F59E0B" : "none"}
                      className={
                        trip.favorite ? "text-amber-500" : "text-white"
                      }
                    />
                  </motion.button>
                  <motion.button
                    onClick={() => setIsEditing(true)}
                    className="py-1.5 px-3 bg-white/20 rounded-lg backdrop-blur-sm text-sm font-medium"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Edit Trip
                  </motion.button>
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="absolute bottom-0 left-0 w-full p-6 text-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input
                  value={editedTrip.title}
                  onChange={(e) =>
                    setEditedTrip({ ...editedTrip, title: e.target.value })
                  }
                  placeholder="Trip Title"
                  className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-white placeholder-gray-200 border border-white/30 w-full focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <input
                  value={editedTrip.location}
                  onChange={(e) =>
                    setEditedTrip({ ...editedTrip, location: e.target.value })
                  }
                  placeholder="Location"
                  className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-white placeholder-gray-200 border border-white/30 w-full focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <input
                  type="date"
                  value={editedTrip.startDate}
                  onChange={(e) =>
                    setEditedTrip({ ...editedTrip, startDate: e.target.value })
                  }
                  className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-white border border-white/30 w-full focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <input
                  type="date"
                  value={editedTrip.endDate || ""}
                  onChange={(e) =>
                    setEditedTrip({ ...editedTrip, endDate: e.target.value })
                  }
                  className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-white border border-white/30 w-full focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div className="flex justify-between gap-1 ">
                <motion.button
                  onClick={() => setIsEditing(false)}
                  className="py-2 md:px-4 px-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium"
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this trip?"
                        )
                      ) {
                        onDeleteTrip(trip.id);
                      }
                    }}
                    className="py-2 md:px-4 px-2 bg-red-600/80 backdrop-blur-sm rounded-lg text-sm font-medium"
                    whileHover={{ backgroundColor: "rgba(220, 38, 38, 0.9)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete Trip
                  </motion.button>
                  <motion.button
                    onClick={handleSave}
                    className="py-2 md:px-4 px-2 bg-amber-500/90 backdrop-blur-sm rounded-lg text-sm font-medium"
                    whileHover={{ backgroundColor: "rgba(245, 158, 11, 1)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showEntryModal && (
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEntryModal(false)}
          >
            <motion.div
              className="bg-white rounded-xl w-full max-w-lg p-0 shadow-2xl transform overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-amber-50 p-5 border-b border-amber-100">
                <h2 className="text-xl font-bold text-amber-800 flex items-center gap-2">
                  <Plus size={20} className="text-amber-600" />
                  New Journal Entry
                </h2>
              </div>

              <div className="p-5 max-h-[80vh] overflow-y-auto">
                {/* Form sections */}
                <div className="space-y-5">
                  {/* Basic Info Section */}
                  <div className="space-y-3">
                    {/* Title */}
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700 mb-1 block">
                        Title
                      </span>
                      <input
                        value={entryForm.title}
                        onChange={(e) =>
                          setEntryForm({ ...entryForm, title: e.target.value })
                        }
                        placeholder="What's memorable about this moment?"
                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                      />
                    </label>

                    {/* Date and Location in a row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="block">
                        <span className="text-sm font-medium text-gray-700 mb-1 block">
                          Date
                        </span>
                        <input
                          type="date"
                          value={entryForm.date}
                          onChange={(e) =>
                            setEntryForm({ ...entryForm, date: e.target.value })
                          }
                          className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium text-gray-700 mb-1 block">
                          Location
                        </span>
                        <div className="relative">
                          <MapPin
                            size={16}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600"
                          />
                          <input
                            value={entryForm.location}
                            onChange={(e) =>
                              setEntryForm({
                                ...entryForm,
                                location: e.target.value,
                              })
                            }
                            placeholder="Where was this?"
                            className="w-full border border-gray-300 p-2.5 pl-9 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                          />
                        </div>
                      </label>
                    </div>

                    {/* Notes */}
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700 mb-1 block">
                        Notes
                      </span>
                      <textarea
                        value={entryForm.content}
                        onChange={(e) =>
                          setEntryForm({ ...entryForm, content: e.target.value })
                        }
                        rows={4}
                        placeholder="Capture your experience..."
                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-none"
                      />
                    </label>
                  </div>

                  {/* Tags Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Tags
                      </span>
                      <span className="text-xs text-gray-500">
                        {(entryForm.tags || []).length} tags
                      </span>
                    </div>
                    <div className="flex mt-1">
                      <div className="relative flex-1">
                        <Tag
                          size={16}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600"
                        />
                        <input
                          className="flex-1 border border-gray-300 p-2.5 pl-9 rounded-l-lg w-full focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                          placeholder="Add a tag"
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter" &&
                              e.currentTarget.value.trim()
                            ) {
                              setEntryForm({
                                ...entryForm,
                                tags: [
                                  ...(entryForm.tags || []),
                                  e.currentTarget.value.trim(),
                                ],
                              });
                              e.currentTarget.value = "";
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                      <motion.button
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 rounded-r-lg flex items-center justify-center transition-colors"
                        whileHover={{ backgroundColor: "#b45309" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const input = document.querySelector(
                            'input[placeholder="Add a tag"]'
                          ) as HTMLInputElement;
                          const val = input?.value?.trim();
                          if (val) {
                            setEntryForm({
                              ...entryForm,
                              tags: [...(entryForm.tags || []), val],
                            });
                            if (input instanceof HTMLInputElement) {
                              input.value = "";
                            }
                          }
                        }}
                      >
                        Add
                      </motion.button>
                    </div>

                    {/* Tags Display */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(entryForm.tags || []).length > 0 ? (
                        (entryForm.tags || []).map((tag, i) => (
                          <motion.span
                            key={i}
                            className="bg-amber-50 text-amber-800 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-sm group transition-all hover:bg-amber-100"
                            whileHover={{ scale: 1.05 }}
                          >
                            #{tag}
                            <motion.button
                              onClick={() => {
                                setEntryForm({
                                  ...entryForm,
                                  tags: (entryForm.tags || []).filter(
                                    (_, idx) => idx !== i
                                  ),
                                });
                              }}
                              className="text-amber-600 hover:text-amber-800 rounded-full p-0.5 transition-colors"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <X size={14} />
                            </motion.button>
                          </motion.span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500 italic">
                          No tags added yet
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Image Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Photos
                      </span>
                      <span className="text-xs text-gray-500">
                        {(entryForm.images || []).length} photos
                      </span>
                    </div>

                    {/* Image URL Input */}
                    <div className="flex mt-1">
                      <div className="relative flex-1">
                        <Camera
                          size={16}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600"
                        />
                        <input
                          className="flex-1 border border-gray-300 p-2.5 pl-9 rounded-l-lg w-full focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                          placeholder="https://..."
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter" &&
                              e.currentTarget.value.trim()
                            ) {
                              setEntryForm({
                                ...entryForm,
                                images: [
                                  ...(entryForm.images || []),
                                  e.currentTarget.value.trim(),
                                ],
                              });
                              e.currentTarget.value = "";
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                      <motion.button
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 rounded-r-lg flex items-center justify-center transition-colors"
                        whileHover={{ backgroundColor: "#b45309" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="https://..."]') as HTMLInputElement;
                          const url = input?.value?.trim();
                          if (url) {
                            setEntryForm({
                              ...entryForm,
                              images: [...(entryForm.images || []), url],
                            });
                            if (input instanceof HTMLInputElement) {
                              input.value = "";
                            }
                          }
                        }}
                      >
                        Add
                      </motion.button>
                    </div>

                    {/* File Upload */}
                    <div className="mt-3">
                      <motion.label 
                        className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50/50 hover:bg-gray-100 transition-colors"
                        whileHover={{ borderColor: "#d97706", backgroundColor: "#fef3c7" }}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <motion.div 
                            whileHover={{ y: -3 }}
                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                          >
                            <Camera size={24} className="text-amber-600 mb-2" />
                          </motion.div>
                          <p className="text-sm text-gray-600">
                            Drag & drop photos or click to browse
                          </p>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            files.forEach((file) => {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setEntryForm((form) => ({
                                  ...form,
                                  images: [
                                    ...(form.images || []),
                                    reader.result as string,
                                  ],
                                }));
                              };
                              reader.readAsDataURL(file);
                            });
                          }}
                        />
                      </motion.label>
                    </div>

                    {/* Image Preview */}
                    {(entryForm.images || []).length > 0 && (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                        {(entryForm.images || []).map((src, i) => (
                          <motion.div
                            key={i}
                            className="relative group aspect-square overflow-hidden rounded-lg"
                            whileHover={{ scale: 1.05 }}
                          >
                            <img
                              src={src}
                              className="h-full w-full object-cover transition-transform group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <motion.button
                                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                  setEntryForm({
                                    ...entryForm,
                                    images: (entryForm.images || []).filter(
                                      (_, idx) => idx !== i
                                    ),
                                  });
                                }}
                              >
                                <Trash2 size={16} />
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-4 flex justify-end gap-3 bg-gray-50">
                <motion.button
                  onClick={() => setShowEntryModal(false)}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => {
                    const newEntry: Entry = {
                      id: Date.now(),
                      ...(entryForm as Omit<Entry, 'id'>),
                    };
                    onUpdateTrip({
                      ...trip,
                      entries: [newEntry, ...trip.entries],
                    });
                    setShowEntryModal(false);
                    setSelectedEntry(newEntry);
                    setCurrentView("entry-detail");
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors shadow-sm"
                  whileHover={{ scale: 1.05, backgroundColor: "#b45309" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BookOpen size={18} />
                  Save Entry
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Entries Section */}
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Trip Entries</h2>
          <motion.button
            onClick={() => setShowEntryModal(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg font-medium flex items-center gap-2"
            whileHover={{ scale: 1.05, backgroundColor: "#b45309" }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={18} />
            New Entry
          </motion.button>
        </div>

        {trip.entries.length === 0 ? (
          <motion.div 
            className="text-center p-6 bg-amber-50 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-amber-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-amber-600" size={24} />
            </div>
            <h3 className="font-medium text-amber-800 mb-2">No entries yet</h3>
            <p className="text-gray-600 text-sm mb-4">
              Start documenting your trip memories by creating your first entry.
            </p>
            <motion.button
              onClick={() => setShowEntryModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg font-medium inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={18} />
              Create First Entry
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {sortedDates.map((date, dateIndex) => (
              <motion.div 
                key={date}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: dateIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className="bg-amber-100 text-amber-800 rounded-full h-10 w-10 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20,
                      delay: dateIndex * 0.1 + 0.2 
                    }}
                  >
                    <Calendar size={18} />
                  </motion.div>
                  <h3 className="font-medium">{formatDate(date)}</h3>
                </div>

                <div className="space-y-4 pl-5 border-l-2 border-amber-200">
                  {entriesByDate[date].map((entry: Entry, entryIndex: number) => (
                    <motion.div
                      key={entry.id}
                      className="bg-white rounded-xl shadow-sm cursor-pointer p-4"
                      variants={entryVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      custom={entryIndex}
                      onClick={() => onSelectEntry(entry)}
                    >
                      <h4 className="font-bold text-amber-800 mb-2">
                        {entry.title}
                      </h4>

                      {entry.images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 mb-3 snap-x">
                          {entry.images.map((image: string, index: number) => (
                            <motion.img
                              key={`img-${index}`}
                              src={image}
                              alt={`Photo ${index + 1}`}
                              className="h-20 w-32 object-cover rounded-lg flex-shrink-0 snap-start"
                              whileHover={{ scale: 1.05 }}
                            />
                          ))}
                        </div>
                      )}

                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {entry.content}
                      </p>

                      <div className="flex items-center text-gray-500 text-xs">
                        <MapPin size={12} className="mr-1" />
                        {entry.location}
                      </div>

                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {entry.tags.map((tag: string, index: number) => (
                            <motion.span
                              key={`tag-${index}`}
                              className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full"
                              whileHover={{ scale: 1.1 }}
                            >
                              #{tag}
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Entry Detail View Component
function EntryDetailView({
  entry,
  onBack,
  onUpdate,
  onDelete,
  onPhotoUpload,
  onRemovePhoto,
}: EntryDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntry, setEditedEntry] = useState(entry);
  const [tagInput, setTagInput] = useState("");

  const handleSave = () => {
    onUpdate(editedEntry);
    setIsEditing(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !editedEntry.tags.includes(tagInput.trim())) {
      setEditedEntry({
        ...editedEntry,
        tags: [...editedEntry.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditedEntry({
      ...editedEntry,
      tags: editedEntry.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="pb-20 md:pb-6 overflow-y-auto max-h-screen">
      {!isEditing ? (
        <>
          {/* Image Gallery */}
          {entry.images && entry.images.length > 0 ? (
            <div className="relative h-64 md:h-80">
              <div className="flex h-full">
                {entry.images.map((image, index) => (
                  <img
                    key={`gallery-${index}`}
                    src={image}
                    alt={`Memory ${index + 1}`}
                    className={`object-cover ${
                      entry.images.length === 1 ? "w-full" : "w-1/2"
                    }`}
                  />
                ))}
              </div>
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white/20 backdrop-blur-sm rounded-lg py-1.5 px-3 text-white text-sm font-medium"
                >
                  Edit Entry
                </button>
              </div>
            </div>
          ) : (
            <div className="h-40 bg-gradient-to-r from-amber-600 to-amber-800   flex items-center justify-center">
              <div className="text-center text-white">
                <Camera size={32} className="mx-auto mb-2" />
                <p>No photos yet</p>
              </div>
              <div className="absolute md:bottom-4 bottom-26 right-4 z-10">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-amber-700 flex gap-2 items-center backdrop-blur-sm rounded-lg py-4 px-6 text-white text-sm font-medium"
                >
                  <Edit size={20} /> Edit Entry
                </button>
              </div>
            </div>
          )}

          {/* Entry Content */}
          <div className="p-4 md:p-6">
            <div className="flex items-center text-gray-500  text-sm mb-2">
              <Calendar size={14} className="mr-1" />
              {formatDate(entry.date)}
            </div>

            <h1 className="text-2xl font-bold text-amber-800  mb-2">
              {entry.title}
            </h1>

            <div className="flex items-center text-amber-600 mb-6">
              <MapPin size={16} className="mr-1" />
              <span>{entry.location}</span>
            </div>

            <div className="prose max-w-none mb-6">
              <p>{entry.content}</p>
            </div>

            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {entry.tags.map((tag, index) => (
                  <span
                    key={`detail-tag-${index}`}
                    className="bg-amber-100 text-amber-800  px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    <Tag size={14} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="p-4 md:p-6">
          <h2 className="text-xl font-bold mb-4">Edit Entry</h2>

          {/* Edit Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                value={editedEntry.title}
                onChange={(e) =>
                  setEditedEntry({ ...editedEntry, title: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={editedEntry.date}
                onChange={(e) =>
                  setEditedEntry({ ...editedEntry, date: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                value={editedEntry.location}
                onChange={(e) =>
                  setEditedEntry({ ...editedEntry, location: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={editedEntry.content}
                onChange={(e) =>
                  setEditedEntry({ ...editedEntry, content: e.target.value })
                }
                rows={6}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <div className="flex">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                  placeholder="Add tag and press Enter"
                  className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={addTag}
                  className="bg-amber-600 text-white p-2 rounded-r-lg"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {editedEntry.tags.map((tag, index) => (
                  <span
                    key={`edit-tag-${index}`}
                    className="bg-amber-100 text-amber-800  px-2 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-amber-800  hover:text-amber-900-200 ml-1"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Photos</label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {editedEntry.images.map((image, index) => (
                  <div key={`edit-img-${index}`} className="relative group">
                    <img
                      src={image}
                      alt={`Photo ${index + 1}`}
                      className="h-24 w-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => onRemovePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={onPhotoUpload}
                  className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-amber-600 hover:border-amber-400 transition-colors"
                >
                  <Camera size={24} />
                  <span className="text-xs mt-1">Add Photo</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="py-2 md:px-4 px-2 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this entry?"
                      )
                    ) {
                      onDelete(entry.id);
                    }
                  }}
                  className="py-2 md:px-4 px-2 bg-red-600 text-white rounded-lg"
                >
                  Delete
                </button>
                <button
                  onClick={handleSave}
                  className="py-2 md:px-4 px-2 bg-amber-600 text-white rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExploreView() {
  const [selectedCategory, setSelectedCategory] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("grid");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Detect dark mode from parent component (would be passed as prop in real implementation)
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  // Filter destinations based on category and search
  const filteredDestinations = destinations.filter((dest) => {
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "trending" && dest.trending) ||
      dest.category === selectedCategory;

    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Categories for filtering
  const categories = [
    { id: "trending", name: "Trending", icon: <ArrowUpRight size={16} /> },
    { id: "all", name: "All Destinations", icon: <Compass size={16} /> },
    { id: "beach", name: "Beaches & Islands", icon: <Umbrella size={16} /> },
    {
      id: "cultural",
      name: "Cultural Experiences",
      icon: <LandmarkIcon size={16} />,
    },
    {
      id: "adventure",
      name: "Adventure & Outdoors",
      icon: <Mountain size={16} />,
    },
  ];

  // Simulate loading destinations
  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  // Handle destination booking/saving
  const handleDestinationAction = (id: number, action: 'save' | 'explore') => {
    // In a real app, this would interact with an API
    console.log(`${action} destination ${id}`);

    // Show a temporary success message
    const message =
      action === "save"
        ? "Destination saved to favorites!"
        : "Exploring this destination!";
    alert(message);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 pb-20 md:pb-6 overflow-y-auto max-h-screen">
      {/* Hero Section */}
      <section className="rounded-3xl overflow-hidden relative h-64 md:h-80 group">
        <img
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?fm=jpg&q=60&w=3000"
          alt="Explore the world"
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 flex flex-col justify-end p-6">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
            Explore the World
          </h1>
          <p className="text-amber-100 text-sm md:text-base mb-4">
            Discover amazing destinations and plan your next adventure
          </p>

          {/* Search Bar */}
          <div className="relative w-full md:max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search destinations, experiences, activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full bg-white/90 backdrop-blur-sm border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm transition-all"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Explore Categories</h2>

        <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors whitespace-nowrap snap-start
                  ${
                    selectedCategory === category.id
                      ? darkMode
                        ? "bg-amber-500 text-white border-amber-600"
                        : "bg-amber-500 text-white border-amber-500"
                      : darkMode
                      ? "border-slate-700 text-gray-300 hover:bg-slate-700"
                      : "border-amber-200 text-amber-800 hover:bg-amber-100"
                  }`}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* View Toggle and Sort */}
      <div className="flex justify-between items-center">
        <div className="font-medium">
          {filteredDestinations.length}{" "}
          {filteredDestinations.length === 1 ? "destination" : "destinations"}{" "}
          found
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView("grid")}
            className={`p-2 rounded-md transition-colors ${
              activeView === "grid"
                ? darkMode
                  ? "bg-slate-700 text-amber-400"
                  : "bg-amber-100 text-amber-800"
                : "text-gray-500"
            }`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setActiveView("list")}
            className={`p-2 rounded-md transition-colors ${
              activeView === "list"
                ? darkMode
                  ? "bg-slate-700 text-amber-400"
                  : "bg-amber-100 text-amber-800"
                : "text-gray-500"
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Destinations Grid/List */}
      {filteredDestinations.length > 0 ? (
        <section>
          {activeView === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDestinations.map((destination) => (
                <div
                  key={destination.id}
                  className={`rounded-xl overflow-hidden ${
                    darkMode ? "bg-slate-800" : "bg-white"
                  } shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer`}
                >
                  <div className="relative h-48">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover"
                    />
                    {destination.trending && (
                      <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <TrendingUp size={12} />
                        Trending
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDestinationAction(destination.id, "save");
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full backdrop-blur-sm"
                    >
                      <Bookmark
                        size={18}
                        className={
                          darkMode ? "text-slate-700" : "text-amber-600"
                        }
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3
                      className={`font-bold text-lg ${
                        darkMode ? "text-white" : "text-amber-800"
                      }`}
                    >
                      {destination.name}
                    </h3>
                    <div className="flex items-center text-amber-500 text-sm mt-1 font-medium">
                      <Star size={14} className="mr-1" fill="currentColor" />
                      {destination.rating}
                      <span
                        className={`mx-2 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        •
                      </span>
                      <Tag size={14} className="mr-1" />
                      {destination.category.charAt(0).toUpperCase() +
                        destination.category.slice(1)}
                    </div>
                    <p
                      className={`mt-2 text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      } line-clamp-2`}
                    >
                      {destination.description}
                    </p>
                    <div
                      className={`mt-3 text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Calendar size={12} />
                        Best time: {destination.bestTimeToVisit}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={12} />
                        {destination.averageCost}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleDestinationAction(destination.id, "explore")
                      }
                      className={`mt-4 w-full py-2 rounded-lg flex items-center justify-center gap-2 transition-colors
                          ${
                            darkMode
                              ? "bg-amber-500 hover:bg-amber-600 text-white"
                              : "bg-amber-600 hover:bg-amber-700 text-white"
                          }`}
                    >
                      Explore Destination
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDestinations.map((destination) => (
                <div
                  key={destination.id}
                  className={`rounded-xl overflow-hidden ${
                    darkMode ? "bg-slate-800" : "bg-white"
                  } shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer flex flex-col md:flex-row`}
                >
                  <div className="relative h-48 md:h-auto md:w-1/3">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover"
                    />
                    {destination.trending && (
                      <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <TrendingUp size={12} />
                        Trending
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3
                          className={`font-bold text-lg ${
                            darkMode ? "text-white" : "text-amber-800"
                          }`}
                        >
                          {destination.name}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDestinationAction(destination.id, "save");
                          }}
                          className={`p-1.5 ${
                            darkMode
                              ? "text-gray-300 hover:text-amber-400"
                              : "text-amber-600 hover:text-amber-800"
                          }`}
                        >
                          <Bookmark size={18} />
                        </button>
                      </div>
                      <div className="flex items-center text-amber-500 text-sm mt-1 font-medium">
                        <Star size={14} className="mr-1" fill="currentColor" />
                        {destination.rating}
                        <span
                          className={`mx-2 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          •
                        </span>
                        <Tag size={14} className="mr-1" />
                        {destination.category.charAt(0).toUpperCase() +
                          destination.category.slice(1)}
                      </div>
                      <p
                        className={`mt-2 text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {destination.description}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap justify-between items-end">
                      <div
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <Calendar size={12} />
                          Best time: {destination.bestTimeToVisit}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign size={12} />
                          {destination.averageCost}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleDestinationAction(destination.id, "explore")
                        }
                        className={`mt-2 py-2 px-4 rounded-lg flex items-center gap-2 transition-colors
                            ${
                              darkMode
                                ? "bg-amber-500 hover:bg-amber-600 text-white"
                                : "bg-amber-600 hover:bg-amber-700 text-white"
                            }`}
                      >
                        <Compass size={16} />
                        Explore
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button
              onClick={handleLoadMore}
              className={`py-2 px-6 rounded-lg flex items-center gap-2 border transition-colors
                  ${
                    darkMode
                      ? "border-slate-700 hover:bg-slate-700 text-gray-300"
                      : "border-amber-200 hover:bg-amber-50 text-amber-800"
                  }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Loading more destinations...
                </>
              ) : (
                <>
                  <Compass size={16} />
                  Discover More Destinations
                </>
              )}
            </button>
          </div>
        </section>
      ) : (
        <div
          className={`text-center p-8 rounded-xl ${
            darkMode ? "bg-slate-800" : "bg-amber-50"
          }`}
        >
          <div
            className={`bg-amber-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4 ${
              darkMode ? "bg-slate-700" : ""
            }`}
          >
            <Search
              className={darkMode ? "text-amber-400" : "text-amber-600"}
              size={24}
            />
          </div>
          <h3
            className={`font-medium ${
              darkMode ? "text-white" : "text-amber-800"
            } mb-2`}
          >
            No destinations found
          </h3>
          <p
            className={`${
              darkMode ? "text-gray-400" : "text-gray-600"
            } text-sm mb-4`}
          >
            Try adjusting your search or category filters to find more
            destinations.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className={`py-2 px-4 rounded-lg font-medium inline-flex items-center gap-2
                ${
                  darkMode
                    ? "bg-amber-500 hover:bg-amber-600 text-white"
                    : "bg-amber-600 hover:bg-amber-700 text-white"
                }`}
          >
            <RefreshCw size={18} />
            Reset Filters
          </button>
        </div>
      )}

      {/* Travel Inspiration */}
      <section className="space-y-4 mt-8">
        <h2 className="text-xl font-bold">Travel Inspiration</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {travelArticles.map((article) => (
            <div
              key={article.id}
              className={`rounded-xl overflow-hidden ${
                darkMode ? "bg-slate-800" : "bg-white"
              } shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer`}
            >
              <div className="relative h-40">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    darkMode
                      ? "bg-slate-700 text-amber-400"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {article.category.charAt(0).toUpperCase() +
                    article.category.slice(1)}
                </span>
                <h3
                  className={`font-bold text-lg mt-2 ${
                    darkMode ? "text-white" : "text-amber-800"
                  }`}
                >
                  {article.title}
                </h3>
                <p
                  className={`mt-2 text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {article.excerpt}
                </p>
                <div className="mt-3 flex justify-between items-center">
                  <span
                    className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {article.readTime}
                  </span>
                  <a href="#">
                    <button
                      className={`text-sm font-medium flex items-center gap-1 
                        ${darkMode ? "text-amber-400" : "text-amber-700"}`}
                    >
                      Read more <ArrowRight size={14} />
                    </button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section
        className={`rounded-xl p-6 ${
          darkMode ? "bg-slate-800" : "bg-amber-50"
        } mt-8`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3
              className={`text-xl font-bold ${
                darkMode ? "text-white" : "text-amber-800"
              }`}
            >
              Get Travel Inspiration
            </h3>
            <p
              className={`text-sm mt-1 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Sign up for our newsletter to receive travel tips and destination
              recommendations.
            </p>
          </div>
          <div className="flex md:flex-row flex-col w-full md:w-auto gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 md:w-64 pl-4 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              className={`whitespace-nowrap py-2.5 px-4 rounded-lg font-medium 
                  ${
                    darkMode
                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                      : "bg-amber-600 hover:bg-amber-700 text-white"
                  }`}
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function JournalView({ trips }: { trips: Trip[] }) {
  return (
    <div className="flex items-center justify-center h-full p-6 text-center">
      <div>
        <div className="bg-amber-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="text-amber-600" size={24} />
        </div>
        <h2 className="text-xl font-bold mb-2">Travel Journal</h2>
        <p className="text-gray-600  max-w-md mx-auto">
          You have {trips.length} {trips.length === 1 ? "trip" : "trips"} in
          your journal. This section will soon let you view your journeys in a
          beautiful timeline!
        </p>
      </div>
    </div>
  );
}

function ProfileView() {
  return (
    <div className="flex items-center justify-center h-full p-6 text-center">
      <div>
        <div className="bg-amber-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
          <User className="text-amber-600" size={24} />
        </div>
        <h2 className="text-xl font-bold mb-2">Profile & Settings</h2>
        <p className="text-gray-600  max-w-md mx-auto">
          Profile settings including account preferences, notifications, and
          privacy controls will be available here soon.
        </p>
      </div>
    </div>
  );
}