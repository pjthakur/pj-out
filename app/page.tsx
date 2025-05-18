"use client";

import type React from "react";

import { useState, useEffect, useRef, createContext, useContext } from "react";
import { Montserrat } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Tag,
  X,
  Moon,
  Sun,
  Plus,
  Search,
  Filter,
  ChevronDown,
  ThumbsUp,
  Heart,
  ThumbsDown,
} from "lucide-react";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

type ThemeType = "light" | "dark";
type ThemeColors = {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  card: string;
  border: string;
  input: string;
  buttonText: string;
  tag: string;
  tagText: string;
};

type ThemeConfig = {
  light: ThemeColors;
  dark: ThemeColors;
};

const themeConfig: ThemeConfig = {
  light: {
    background: "bg-slate-100",
    foreground: "text-slate-800",
    primary: "bg-indigo-600",
    secondary: "bg-indigo-100",
    accent: "bg-teal-500",
    muted: "text-slate-500",
    card: "bg-white",
    border: "border-slate-200",
    input: "bg-white border-slate-300",
    buttonText: "text-white",
    tag: "bg-indigo-100",
    tagText: "text-indigo-800",
  },
  dark: {
    background: "bg-slate-900",
    foreground: "text-slate-100",
    primary: "bg-indigo-500",
    secondary: "bg-indigo-900/50",
    accent: "bg-teal-500",
    muted: "text-slate-400",
    card: "bg-slate-800",
    border: "border-slate-700",
    input: "bg-slate-800 border-slate-600",
    buttonText: "text-white",
    tag: "bg-indigo-900/50",
    tagText: "text-indigo-300",
  },
};

type EventTag = string;
type RSVPStatus = "going" | "interested" | "skipping" | null;

interface RSVPCount {
  going: number;
  interested: number;
  skipping: number;
}

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: Date;
  time: string;
  tags: EventTag[];
  image?: string;
  rsvp: RSVPCount;
  userRSVP?: RSVPStatus;
}

interface ThemeContextType {
  theme: ThemeType;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  colors: themeConfig.light,
  toggleTheme: () => {},
});

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Downtown Open Mic Night",
    description:
      "Join us for a night of music, poetry, and comedy at our weekly open mic night. All talents welcome!",
    location: "The Acoustic Cafe, 123 Main St",
    date: new Date(2025, 5, 15),
    time: "7:00 PM - 10:00 PM",
    tags: ["#OpenMicNight", "#LiveMusic", "#Poetry"],
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000",
    rsvp: { going: 24, interested: 42, skipping: 3 },
  },
  {
    id: "2",
    title: "Sunrise Yoga in the Park",
    description:
      "Start your day with a rejuvenating yoga session in the beautiful Central Park. All levels welcome, bring your own mat!",
    location: "Central Park, East Meadow",
    date: new Date(2025, 5, 18),
    time: "6:30 AM - 7:30 AM",
    tags: ["#YogaInThePark", "#Wellness", "#MorningRoutine"],
    image:
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=1000",
    rsvp: { going: 18, interested: 35, skipping: 5 },
  },
  {
    id: "3",
    title: "Sunday Board Game Meetup",
    description:
      "Bring your favorite board games and meet new friends! We'll have some games available, but feel free to bring your own.",
    location: "The Game Room, 456 Oak Ave",
    date: new Date(2025, 5, 20),
    time: "2:00 PM - 6:00 PM",
    tags: ["#BoardGameSunday", "#TableTop", "#GameNight"],
    image:
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=1000",
    rsvp: { going: 31, interested: 17, skipping: 2 },
  },
  {
    id: "4",
    title: "Local Farmers Market",
    description:
      "Support local farmers and artisans at our weekly farmers market. Fresh produce, handmade crafts, and delicious food!",
    location: "Community Square, Downtown",
    date: new Date(2025, 5, 21),
    time: "9:00 AM - 1:00 PM",
    tags: ["#FarmersMarket", "#LocalProduce", "#Community"],
    image:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1000",
    rsvp: { going: 56, interested: 89, skipping: 7 },
  },
  {
    id: "5",
    title: "Tech Startup Networking",
    description:
      "Connect with local entrepreneurs, developers, and investors in the tech industry. Great opportunity for networking!",
    location: "Innovation Hub, 789 Tech Blvd",
    date: new Date(2025, 5, 25),
    time: "6:00 PM - 8:30 PM",
    tags: ["#TechNetworking", "#Startups", "#Innovation"],
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000",
    rsvp: { going: 42, interested: 63, skipping: 11 },
  },
  {
    id: "6",
    title: "Community Beach Cleanup",
    description:
      "Help keep our beaches clean! Join us for a community cleanup event. All supplies provided, just bring your enthusiasm!",
    location: "Sunset Beach, West End",
    date: new Date(2025, 5, 27),
    time: "10:00 AM - 12:00 PM",
    tags: ["#BeachCleanup", "#Environment", "#Volunteer"],
    image:
      "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?q=80&w=1000",
    rsvp: { going: 37, interested: 52, skipping: 4 },
  },
];

export default function EventTagApp() {
  const [theme, setTheme] = useState<ThemeType>("light");
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<EventTag[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });
  const [allTags, setAllTags] = useState<EventTag[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const [newEvent, setNewEvent] = useState<Omit<Event, "id" | "rsvp">>({
    title: "",
    description: "",
    location: "",
    date: new Date(),
    time: "",
    tags: [],
  });

  const modalRef = useRef<HTMLDivElement>(null);

  const themeContextValue = {
    theme,
    colors: theme === "light" ? themeConfig.light : themeConfig.dark,
    toggleTheme: () =>
      setTheme((prev) => (prev === "light" ? "dark" : "light")),
  };

  useEffect(() => {
    const tags = events.flatMap((event) => event.tags);
    setAllTags([...new Set(tags)]);
  }, [events]);

  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((event) =>
        selectedTags.some((tag) => event.tags.includes(tag))
      );
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedTags]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowCreateModal(false);
        setShowEventModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showCreateModal || showEventModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showCreateModal, showEventModal]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showTagDropdown) {
        const target = event.target as Node;
        const filterButton = document.getElementById("filter-button");
        const filterDropdown = document.getElementById("filter-dropdown");

        if (
          filterButton &&
          filterDropdown &&
          !filterButton.contains(target) &&
          !filterDropdown.contains(target)
        ) {
          setShowTagDropdown(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTagDropdown]);

  const handleRSVP = (eventId: string, status: RSVPStatus) => {
    const currentEvent = events.find((event) => event.id === eventId);
    const isUnselecting = currentEvent?.userRSVP === status;
    const newStatus = isUnselecting ? null : status;

    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          const updatedRSVP = { ...event.rsvp };

          if (event.userRSVP) {
            updatedRSVP[event.userRSVP] -= 1;
          }

          if (newStatus) {
            updatedRSVP[newStatus] += 1;
          }

          return {
            ...event,
            userRSVP: newStatus,
            rsvp: updatedRSVP,
          };
        }
        return event;
      })
    );

    if (status && !isUnselecting) {
      const statusMessages = {
        going: "You're going to this event!",
        interested: "You're interested in this event!",
        skipping: "You're skipping this event.",
      };

      setToast({
        message: statusMessages[status],
        visible: true,
      });

      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3000);
    }
  };

  const toggleTag = (tag: EventTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleNewEventTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value) {
      e.preventDefault();
      const newTag = e.currentTarget.value.startsWith("#")
        ? e.currentTarget.value
        : `#${e.currentTarget.value}`;

      if (!newEvent.tags.includes(newTag)) {
        setNewEvent((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
        e.currentTarget.value = "";
      }
    }
  };

  const removeNewEventTag = (tagToRemove: string) => {
    setNewEvent((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newEvent.title ||
      !newEvent.description ||
      !newEvent.location ||
      !newEvent.time
    ) {
      setToast({
        message: "Please fill in all required fields",
        visible: true,
      });

      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3000);

      return;
    }

    const createdEvent: Event = {
      id: (events.length + 1).toString(),
      ...newEvent,
      rsvp: { going: 1, interested: 0, skipping: 0 },
      userRSVP: "going",
    };

    setEvents((prev) => [createdEvent, ...prev]);
    setShowCreateModal(false);

    setNewEvent({
      title: "",
      description: "",
      location: "",
      date: new Date(),
      time: "",
      tags: [],
    });

    setToast({
      message: "Event created successfully!",
      visible: true,
    });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <div
        className={`min-h-screen flex flex-col ${themeContextValue.colors.background} ${themeContextValue.colors.foreground} ${montserrat.variable} font-sans transition-colors duration-300`}
      >
        <header
          className={`sticky top-0 z-10 ${themeContextValue.colors.card} ${themeContextValue.colors.border} border-b shadow-sm`}
        >
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ rotate: -20 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.5 }}
                className={`${themeContextValue.colors.accent} p-2 rounded-lg`}
              >
                <Tag className="w-6 h-6 text-white" />
              </motion.div>
              <h1 className="text-2xl font-bold font-montserrat tracking-tight">
                Event<span className={`text-indigo-600`}>Tag</span>
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className={`${themeContextValue.colors.primary} ${themeContextValue.colors.buttonText} px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-sm hover:opacity-90 transition-opacity cursor-pointer`}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Event</span>
              </button>

              <button
                onClick={themeContextValue.toggleTheme}
                className={`p-2 rounded-full ${themeContextValue.colors.secondary} ${themeContextValue.colors.muted} hover:opacity-80 transition-opacity cursor-pointer`}
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 space-y-4">
            <div className={`flex flex-col sm:flex-row gap-4`}>
              <div className={`relative flex-1`}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg ${themeContextValue.colors.input} ${themeContextValue.colors.border} border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                />
              </div>

              <div className="relative">
                <button
                  id="filter-button"
                  onClick={() => setShowTagDropdown(!showTagDropdown)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg ${themeContextValue.colors.input} ${themeContextValue.colors.border} border hover:bg-opacity-90 transition-all cursor-pointer`}
                >
                  <Filter className="w-5 h-5 text-slate-400" />
                  <span>Filter by tags</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showTagDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showTagDropdown && (
                  <div
                    id="filter-dropdown"
                    className={`absolute top-full mt-2 right-0 w-64 max-h-60 overflow-y-auto rounded-lg ${themeContextValue.colors.card} ${themeContextValue.colors.border} border shadow-lg z-10`}
                  >
                    <div className="p-2">
                      {allTags.length > 0 ? (
                        allTags.map((tagItem) => (
                          <div
                            key={tagItem}
                            onClick={() => toggleTag(tagItem)}
                            className={`px-3 py-2 rounded-md cursor-pointer flex items-center gap-2 transition-colors duration-200 ${
                              selectedTags.includes(tagItem)
                                ? themeContextValue.colors.secondary
                                : theme === "light"
                                ? "hover:bg-slate-50"
                                : `hover:${themeContextValue.colors.card}`
                            } ${themeContextValue.colors.muted}`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedTags.includes(tagItem)}
                              onChange={() => {}}
                              className="w-4 h-4 accent-indigo-600"
                            />
                            <span>{tagItem}</span>
                          </div>
                        ))
                      ) : (
                        <p className="px-3 py-2 text-sm">No tags available</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className={`${themeContextValue.colors.tag} ${themeContextValue.colors.tagText} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1`}
                  >
                    {tag}
                    <button
                      onClick={() => toggleTag(tag)}
                      className="rounded-full p-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                <button
                  onClick={() => setSelectedTags([])}
                  className="text-sm text-slate-500 cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onRSVP={handleRSVP}
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowEventModal(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              className={`text-center py-16 ${themeContextValue.colors.muted}`}
            >
              <h3 className="text-xl font-semibold mb-2">No events found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </main>

        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50 backdrop-blur-sm">
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl ${themeContextValue.colors.card} ${themeContextValue.colors.border} border shadow-xl`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold font-montserrat">
                      Create New Event
                    </h2>
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className={`p-2 rounded-full hover:${themeContextValue.colors.secondary} cursor-pointer`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateEvent} className="space-y-6">
                    <div>
                      <label htmlFor="title" className="block mb-2 font-medium">
                        Event Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="title"
                        type="text"
                        required
                        value={newEvent.title}
                        onChange={(e) =>
                          setNewEvent((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className={`w-full px-4 py-3 rounded-lg ${themeContextValue.colors.input} ${themeContextValue.colors.border} border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        placeholder="Enter event title"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block mb-2 font-medium"
                      >
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        required
                        value={newEvent.description}
                        onChange={(e) =>
                          setNewEvent((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className={`w-full px-4 py-3 rounded-lg ${themeContextValue.colors.input} ${themeContextValue.colors.border} border focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]`}
                        placeholder="Describe your event"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="location"
                          className="block mb-2 font-medium"
                        >
                          Location <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="location"
                          type="text"
                          required
                          value={newEvent.location}
                          onChange={(e) =>
                            setNewEvent((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          className={`w-full px-4 py-3 rounded-lg ${themeContextValue.colors.input} ${themeContextValue.colors.border} border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                          placeholder="Event location"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="time"
                          className="block mb-2 font-medium"
                        >
                          Time <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="time"
                          type="text"
                          required
                          value={newEvent.time}
                          onChange={(e) =>
                            setNewEvent((prev) => ({
                              ...prev,
                              time: e.target.value,
                            }))
                          }
                          className={`w-full px-4 py-3 rounded-lg ${themeContextValue.colors.input} ${themeContextValue.colors.border} border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                          placeholder="e.g. 7:00 PM - 9:00 PM"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="date" className="block mb-2 font-medium">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <div className={`relative`}>
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="date"
                          type="date"
                          required
                          value={newEvent.date.toISOString().split("T")[0]}
                          onChange={(e) =>
                            setNewEvent((prev) => ({
                              ...prev,
                              date: new Date(e.target.value),
                            }))
                          }
                          className={`w-full pl-11 pr-4 py-3 rounded-lg ${themeContextValue.colors.input} ${themeContextValue.colors.border} border focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none`}
                          style={{
                            colorScheme: theme === "dark" ? "dark" : "light",
                          }}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="image" className="block mb-2 font-medium">
                        Image URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="image"
                        type="url"
                        required
                        value={newEvent.image || ""}
                        onChange={(e) =>
                          setNewEvent((prev) => ({
                            ...prev,
                            image: e.target.value,
                          }))
                        }
                        className={`w-full px-4 py-3 rounded-lg ${themeContextValue.colors.input} ${themeContextValue.colors.border} border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div>
                      <label htmlFor="tags" className="block mb-2 font-medium">
                        Tags
                      </label>
                      <div className={`flex flex-wrap gap-2 mb-2`}>
                        {newEvent.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`${themeContextValue.colors.tag} ${themeContextValue.colors.tagText} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1`}
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeNewEventTag(tag)}
                              className="cursor-pointer rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        id="tags"
                        type="text"
                        onKeyDown={handleNewEventTag}
                        className={`w-full px-4 py-3 rounded-lg ${themeContextValue.colors.input} ${themeContextValue.colors.border} border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        placeholder="Type a tag and press Enter (e.g. #OpenMicNight)"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className={`px-4 py-2 rounded-lg border ${themeContextValue.colors.border} cursor-pointer transition-colors`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={`${themeContextValue.colors.primary} ${themeContextValue.colors.buttonText} px-6 py-2 rounded-lg font-medium shadow-sm hover:opacity-90 transition-opacity cursor-pointer`}
                      >
                        Create Event
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showEventModal && selectedEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50 backdrop-blur-sm">
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl ${themeContextValue.colors.card} ${themeContextValue.colors.border} border shadow-xl`}
              >
                <div className="relative">
                  {selectedEvent.image && (
                    <div className="h-48 sm:h-64 overflow-hidden rounded-t-xl">
                      <img
                        src={selectedEvent.image || "/placeholder.svg"}
                        alt={selectedEvent.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <button
                    onClick={() => setShowEventModal(false)}
                    className={`absolute top-4 right-4 p-2 rounded-full bg-opacity-50 text-white hover:bg-opacity-70 transition-opacity cursor-pointer`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold font-montserrat mb-4">
                    {selectedEvent.title}
                  </h2>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedEvent.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`${themeContextValue.colors.tag} ${themeContextValue.colors.tagText} px-3 py-1 rounded-full text-sm font-medium`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="mb-6 whitespace-pre-line">
                    {selectedEvent.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div
                      className={`flex items-center gap-3 ${themeContextValue.colors.muted}`}
                    >
                      <MapPin className="w-5 h-5 flex-shrink-0" />
                      <span>{selectedEvent.location}</span>
                    </div>

                    <div
                      className={`flex items-center gap-3 ${themeContextValue.colors.muted}`}
                    >
                      <Calendar className="w-5 h-5 flex-shrink-0" />
                      <span>{formatDate(selectedEvent.date)}</span>
                    </div>

                    <div
                      className={`flex items-center gap-3 ${themeContextValue.colors.muted}`}
                    >
                      <Clock className="w-5 h-5 flex-shrink-0" />
                      <span>{selectedEvent.time}</span>
                    </div>
                  </div>
                  
                  <div className={`pt-4 mt-4 border-t ${themeContextValue.colors.border}`}>
                    <h3 className="font-medium mb-4">Will you be attending?</h3>
                    <div className="flex flex-col sm:flex-row w-full gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRSVP(selectedEvent.id, "going");
                          setSelectedEvent({
                            ...selectedEvent,
                            userRSVP: selectedEvent.userRSVP === "going" ? null : "going",
                            rsvp: {
                              ...selectedEvent.rsvp,
                              going: selectedEvent.userRSVP === "going" 
                                ? selectedEvent.rsvp.going - 1 
                                : selectedEvent.rsvp.going + 1,
                              interested: selectedEvent.userRSVP === "interested" ? selectedEvent.rsvp.interested - 1 : selectedEvent.rsvp.interested,
                              skipping: selectedEvent.userRSVP === "skipping" ? selectedEvent.rsvp.skipping - 1 : selectedEvent.rsvp.skipping
                            }
                          });
                        }}
                        className={`flex items-center justify-center gap-3 px-5 py-3 rounded-lg w-full ${
                          selectedEvent.userRSVP === "going" 
                            ? `${themeContextValue.colors.secondary} text-indigo-600` 
                            : `border ${themeContextValue.colors.border} ${themeContextValue.colors.muted}`
                        } transition-colors hover:bg-indigo-50 hover:text-indigo-600`}
                      >
                        <ThumbsUp 
                          className="w-5 h-5" 
                          fill={selectedEvent.userRSVP === "going" ? "currentColor" : "none"} 
                        />
                        <span className="font-medium">Going</span>
                        <span className="text-sm">{selectedEvent.rsvp.going}</span>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRSVP(selectedEvent.id, "interested");
                          setSelectedEvent({
                            ...selectedEvent,
                            userRSVP: selectedEvent.userRSVP === "interested" ? null : "interested",
                            rsvp: {
                              ...selectedEvent.rsvp,
                              going: selectedEvent.userRSVP === "going" ? selectedEvent.rsvp.going - 1 : selectedEvent.rsvp.going,
                              interested: selectedEvent.userRSVP === "interested" 
                                ? selectedEvent.rsvp.interested - 1 
                                : selectedEvent.rsvp.interested + 1,
                              skipping: selectedEvent.userRSVP === "skipping" ? selectedEvent.rsvp.skipping - 1 : selectedEvent.rsvp.skipping
                            }
                          });
                        }}
                        className={`flex items-center justify-center gap-3 px-5 py-3 rounded-lg w-full ${
                          selectedEvent.userRSVP === "interested" 
                            ? `${themeContextValue.colors.secondary} text-teal-600` 
                            : `border ${themeContextValue.colors.border} ${themeContextValue.colors.muted}`
                        } transition-colors hover:bg-teal-50 hover:text-teal-600`}
                      >
                        <Heart 
                          className="w-5 h-5" 
                          fill={selectedEvent.userRSVP === "interested" ? "currentColor" : "none"} 
                        />
                        <span className="font-medium">Interested</span>
                        <span className="text-sm">{selectedEvent.rsvp.interested}</span>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRSVP(selectedEvent.id, "skipping");
                          setSelectedEvent({
                            ...selectedEvent,
                            userRSVP: selectedEvent.userRSVP === "skipping" ? null : "skipping",
                            rsvp: {
                              ...selectedEvent.rsvp,
                              going: selectedEvent.userRSVP === "going" ? selectedEvent.rsvp.going - 1 : selectedEvent.rsvp.going,
                              interested: selectedEvent.userRSVP === "interested" ? selectedEvent.rsvp.interested - 1 : selectedEvent.rsvp.interested,
                              skipping: selectedEvent.userRSVP === "skipping" 
                                ? selectedEvent.rsvp.skipping - 1 
                                : selectedEvent.rsvp.skipping + 1
                            }
                          });
                        }}
                        className={`flex items-center justify-center gap-3 px-5 py-3 rounded-lg w-full ${
                          selectedEvent.userRSVP === "skipping" 
                            ? `${themeContextValue.colors.secondary} text-red-600` 
                            : `border ${themeContextValue.colors.border} ${themeContextValue.colors.muted}`
                        } transition-colors hover:bg-red-50 hover:text-red-600`}
                      >
                        <ThumbsDown 
                          className="w-5 h-5" 
                          fill={selectedEvent.userRSVP === "skipping" ? "currentColor" : "none"} 
                        />
                        <span className="font-medium">Not going</span>
                        <span className="text-sm">{selectedEvent.rsvp.skipping}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {toast.visible && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 z-50"
            >
              <div
                className={`${themeContextValue.colors.card} ${themeContextValue.colors.border} border shadow-lg rounded-lg px-4 py-2.5 flex items-center justify-center text-center whitespace-nowrap mx-auto max-w-md`}
              >
                <span className="text-sm">{toast.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer
          className={`${themeContextValue.colors.card} ${themeContextValue.colors.border} border-t mt-auto`}
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ rotate: -20 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`${themeContextValue.colors.accent} p-1.5 rounded-lg`}
                >
                  <Tag className="w-4 h-4 text-white" />
                </motion.div>
                <span className="text-lg font-bold font-montserrat tracking-tight">
                  Event<span className={`text-indigo-600`}>Tag</span>
                </span>
              </div>
              <p className={`text-sm ${themeContextValue.colors.muted}`}>
                Discover and join amazing events in your community
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeContext.Provider>
  );
}

function EventCard({
  event,
  onRSVP,
  onClick,
}: {
  event: Event;
  onRSVP: (id: string, status: RSVPStatus) => void;
  onClick: () => void;
}) {
  const { colors } = useContext(ThemeContext);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${colors.card} ${colors.border} border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
    >
      <div className="relative" onClick={onClick}>
        {event.image ? (
          <div className="h-48 overflow-hidden">
            <img
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
            />
          </div>
        ) : (
          <div
            className={`h-48 ${colors.secondary} flex items-center justify-center`}
          >
            <Tag className="w-12 h-12 text-indigo-600 dark:text-indigo-400 opacity-70" />
          </div>
        )}

        <div
          className={`absolute top-4 left-4 ${colors.accent} text-white font-medium px-3 py-1 rounded-lg text-sm`}
        >
          {formatDate(event.date)}
        </div>
      </div>

      <div className="p-5" onClick={onClick}>
        <h3 className="text-xl font-bold font-montserrat mb-2 line-clamp-1">
          {event.title}
        </h3>

        <div className="flex flex-wrap gap-2 mb-3">
          {event.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className={`${colors.tag} ${colors.tagText} px-2 py-0.5 rounded-full text-xs font-medium`}
            >
              {tag}
            </span>
          ))}
          {event.tags.length > 3 && (
            <span className={`${colors.muted} text-xs`}>
              +{event.tags.length - 3} more
            </span>
          )}
        </div>

        <p className={`${colors.muted} mb-4 line-clamp-2 text-sm`}>
          {event.description}
        </p>

        <div className="flex items-center gap-2 mb-3 text-sm">
          <MapPin className="w-4 h-4 flex-shrink-0 text-slate-400" />
          <span className="truncate">{event.location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 flex-shrink-0 text-slate-400" />
          <span>{event.time}</span>
        </div>
      </div>

      <div
        className={`px-5 py-3 border-t ${colors.border} flex justify-between items-center`}
      >
        <div className="flex space-x-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRSVP(event.id, "going");
            }}
            className={`flex items-center space-x-2 ${
              event.userRSVP === "going" ? "text-indigo-600" : colors.muted
            } hover:text-indigo-500 transition-colors`}
          >
            <ThumbsUp 
              className="w-5 h-5" 
              fill={event.userRSVP === "going" ? "currentColor" : "none"} 
            />
            <span className="text-sm font-medium">{event.rsvp.going}</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRSVP(event.id, "interested");
            }}
            className={`flex items-center space-x-2 ${
              event.userRSVP === "interested" ? "text-teal-600" : colors.muted
            } hover:text-teal-500 transition-colors`}
          >
            <Heart 
              className="w-5 h-5" 
              fill={event.userRSVP === "interested" ? "currentColor" : "none"} 
            />
            <span className="text-sm font-medium">{event.rsvp.interested}</span>
          </button>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRSVP(event.id, "skipping");
          }}
          className={`flex items-center space-x-2 ${
            event.userRSVP === "skipping" ? "text-red-600" : colors.muted
          } hover:text-red-500 transition-colors`}
        >
          <ThumbsDown 
            className="w-5 h-5" 
            fill={event.userRSVP === "skipping" ? "currentColor" : "none"} 
          />
          <span className="text-sm font-medium">{event.rsvp.skipping}</span>
        </button>
      </div>
    </motion.div>
  );
}