"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Users,
  Clock,
  MapPin,
  Filter,
  Search,
  Bell,
  User,
  Settings,
  Heart,
  Share2,
  Star,
  Zap,
  Coffee,
  Code,
  Camera,
  Music,
  BookOpen,
  Gamepad2,
  Palette,
  Globe,
  CheckCircle,
  AlertCircle,
  Calendar as CalendarIcon,
  Plus,
  Minus,
  X,
  Menu,
  Rocket,
  Mail,
  Twitter,
  Facebook,
  Instagram,
  Briefcase,
  GraduationCap,
  UserCheck,
  Trophy,
  Lightbulb,
  Target,
  Flame,
  Sparkles,
  Flame as FlameIcon,
} from "lucide-react";
import { LucideProps } from "lucide-react";

interface User {
  id: number;
  name: string;
  interests: string[];
  avatar: string;
  availability: "available" | "busy" | "maybe";
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  interests: string[];
  participants: number;
  maybeCount: number;
  maxCapacity: number;
  organizer: string;
  image: string;
  attendees: User[];
  calendarConflicts: number;
  trending?: boolean;
  popularity?: number;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "work" | "personal";
}

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

interface AIMatchData {
  compatibilityScore: number;
  suggestedConnections: User[];
  recommendedEvents: Event[];
  attendanceReason: string;
}

type AttendanceStatus = "attending" | "maybe" | null;

// Toast Component
const Toast: React.FC<ToastProps> = ({ message, type = "info", onClose }) => (
  <div
    className={`fixed top-4 right-4 z-[60] p-4 rounded-lg backdrop-blur-md border shadow-lg transition-all duration-300 ${
      type === "success"
        ? "bg-green-800/90 border-green-600/50 text-green-100"
        : type === "error"
        ? "bg-red-800/90 border-red-600/50 text-red-100"
        : "bg-blue-800/90 border-blue-600/50 text-blue-100"
    }`}
  >
    <div className="flex items-center justify-between space-x-3">
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// Sample Data
const mockUsers: User[] = [
  {
    id: 1,
    name: "Alice Chen",
    interests: ["tech", "photography", "coffee"],
    avatar: "Code",
    availability: "available",
  },
  {
    id: 2,
    name: "Bob Smith",
    interests: ["design", "music", "travel"],
    avatar: "Palette",
    availability: "busy",
  },
  {
    id: 3,
    name: "Carol Davis",
    interests: ["books", "coffee", "photography"],
    avatar: "BookOpen",
    availability: "available",
  },
  {
    id: 4,
    name: "David Wilson",
    interests: ["gaming", "tech", "music"],
    avatar: "Gamepad2",
    availability: "maybe",
  },
  {
    id: 5,
    name: "Eva Rodriguez",
    interests: ["art", "travel", "design"],
    avatar: "Camera",
    availability: "available",
  },
];

const initialEvents: Event[] = [
  {
    id: 1,
    title: "Tech Innovators Meetup",
    date: "2025-06-15",
    time: "18:00",
    location: "Silicon Valley Hub",
    description:
      "Join fellow tech enthusiasts for networking and innovation discussions.",
    interests: ["tech", "networking"],
    participants: 24,
    maybeCount: 12,
    maxCapacity: 50,
    organizer: "Alice Chen",
    image: "Rocket",
    attendees: mockUsers.slice(0, 3),
    calendarConflicts: 2,
  },
  {
    id: 2,
    title: "Photography Walk",
    date: "2025-06-18",
    time: "10:00",
    location: "Central Park",
    description:
      "Explore the city through your lens with fellow photographers.",
    interests: ["photography", "outdoor"],
    participants: 16,
    maybeCount: 8,
    maxCapacity: 25,
    organizer: "Bob Smith",
    image: "Camera",
    attendees: mockUsers.slice(1, 4),
    calendarConflicts: 0,
  },
  {
    id: 3,
    title: "Coffee & Code",
    date: "2025-06-20",
    time: "09:00",
    location: "Downtown Café",
    description: "Casual coding session over great coffee.",
    interests: ["coffee", "tech", "coding"],
    participants: 18,
    maybeCount: 15,
    maxCapacity: 30,
    organizer: "Carol Davis",
    image: "Coffee",
    attendees: mockUsers.slice(0, 2),
    calendarConflicts: 1,
  },
  {
    id: 4,
    title: "Music Production Workshop",
    date: "2025-06-22",
    time: "14:00",
    location: "Sound Studio",
    description:
      "Learn music production techniques from industry professionals.",
    interests: ["music", "workshop"],
    participants: 22,
    maybeCount: 6,
    maxCapacity: 35,
    organizer: "David Wilson",
    image: "Music",
    attendees: mockUsers.slice(2, 5),
    calendarConflicts: 0,
  },
  {
    id: 5,
    title: "Art Gallery Opening",
    date: "2025-06-25",
    time: "19:00",
    location: "Modern Art Museum",
    description: "Exclusive preview of contemporary art exhibition.",
    interests: ["art", "culture"],
    participants: 31,
    maybeCount: 9,
    maxCapacity: 40,
    organizer: "Eva Rodriguez",
    image: "Palette",
    attendees: mockUsers.slice(1, 3),
    calendarConflicts: 3,
  },
  {
    id: 6,
    title: "Gaming Tournament",
    date: "2025-06-28",
    time: "16:00",
    location: "E-Sports Arena",
    description: "Competitive gaming with prizes and networking.",
    interests: ["gaming", "competition"],
    participants: 28,
    maybeCount: 11,
    maxCapacity: 45,
    organizer: "Alice Chen",
    image: "Trophy",
    attendees: mockUsers.slice(0, 4),
    calendarConflicts: 1,
  },
];

type InterestIconType = {
  [key: string]: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
};

const interestIcons: InterestIconType = {
  tech: Code,
  photography: Camera,
  coffee: Coffee,
  music: Music,
  books: BookOpen,
  gaming: Gamepad2,
  art: Palette,
  design: Palette,
  travel: Globe,
  networking: Users,
  outdoor: MapPin,
  coding: Code,
  workshop: Star,
  culture: BookOpen,
  competition: Zap,
};

// Helper function to render dynamic icons
const iconMap = {
  Rocket,
  Camera,
  Coffee,
  Music,
  Palette,
  Trophy,
  Code,
  BookOpen,
  Gamepad2,
  Users,
  Briefcase,
  GraduationCap,
  UserCheck,
  Lightbulb,
  Target,
  Flame,
  Sparkles,
};

const DynamicIcon = ({ iconName, className = "w-6 h-6", ...props }: { iconName: string; className?: string; [key: string]: any }) => {
  const IconComponent = iconMap[iconName as keyof typeof iconMap];
  return IconComponent ? <IconComponent className={className} {...props} /> : <Star className={className} {...props} />;
};

const CommunityMeetupPlatform: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [userAttendance, setUserAttendance] = useState<
    Record<number, AttendanceStatus>
  >({});
  const [showAIMatching, setShowAIMatching] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [timelineView, setTimelineView] = useState(false);
  const [showCalendarIntegration, setShowCalendarIntegration] = useState(false);
  const [aiMatchingData, setAiMatchingData] = useState<
    Record<number, AIMatchData>
  >({});
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Toast
  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const allInterests = [...new Set(events.flatMap((event) => event.interests))];

  // Filters
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesInterests =
        selectedInterests.length === 0 ||
        event.interests.some((interest) =>
          selectedInterests.includes(interest)
        );
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesInterests && matchesSearch;
    });
  }, [selectedInterests, searchTerm, events]);

  // AI Matching
  const generateAIMatches = (eventId: number): AIMatchData => {
    const event = events.find((e) => e.id === eventId);
    if (!event) throw new Error("Event not found");

    const userInterests = ["tech", "photography", "coffee"]; // Mock current user interests

    const compatibilityScore =
      (event.interests.filter((interest) => userInterests.includes(interest))
        .length /
        event.interests.length) *
      100;

    const matches = mockUsers.filter((user) =>
      user.interests.some((interest) => event.interests.includes(interest))
    );

    const recommendations = events
      .filter(
        (e) =>
          e.id !== eventId &&
          e.interests.some((interest) => userInterests.includes(interest))
      )
      .slice(0, 2);

    return {
      compatibilityScore: Math.round(compatibilityScore),
      suggestedConnections: matches.slice(0, 3),
      recommendedEvents: recommendations,
      attendanceReason:
        compatibilityScore > 50
          ? `High compatibility (${Math.round(compatibilityScore)}%)`
          : "Some shared interests",
    };
  };

  const handleAttendance = (eventId: number, status: AttendanceStatus) => {
    const previousStatus = userAttendance[eventId];

    setUserAttendance((prev) => ({
      ...prev,
      [eventId]: status,
    }));

    setEvents((prev) =>
      prev.map((event) => {
        if (event.id === eventId) {
          let newParticipants = event.participants;
          let newMaybeCount = event.maybeCount;

          if (previousStatus === "attending") newParticipants--;
          if (previousStatus === "maybe") newMaybeCount--;

          if (status === "attending") newParticipants++;
          if (status === "maybe") newMaybeCount++;

          return {
            ...event,
            participants: Math.max(0, newParticipants),
            maybeCount: Math.max(0, newMaybeCount),
          };
        }
        return event;
      })
    );

    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent((prev) => {
        if (!prev) return null;
        let newParticipants = prev.participants;
        let newMaybeCount = prev.maybeCount;

        if (previousStatus === "attending") newParticipants--;
        if (previousStatus === "maybe") newMaybeCount--;

        if (status === "attending") newParticipants++;
        if (status === "maybe") newMaybeCount++;

        return {
          ...prev,
          participants: Math.max(0, newParticipants),
          maybeCount: Math.max(0, newMaybeCount),
        };
      });
    }
  };

  const addToGoogleCalendar = (event: Event) => {
    const eventDate = new Date(`${event.date}T${event.time}`);
    const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

    const googleUrl = new URL("https://calendar.google.com/calendar/render");
    googleUrl.searchParams.set("action", "TEMPLATE");
    googleUrl.searchParams.set("text", event.title);
    googleUrl.searchParams.set(
      "dates",
      `${eventDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${
        endDate.toISOString().replace(/[-:]/g, "").split(".")[0]
      }Z`
    );
    googleUrl.searchParams.set("details", event.description);
    googleUrl.searchParams.set("location", event.location);
    googleUrl.searchParams.set("organizer", event.organizer);

    window.open(googleUrl.toString(), "_blank");
    showToast("Opening Google Calendar...", "success");
  };

  useEffect(() => {
    const newAIData: Record<number, AIMatchData> = {};
    events.forEach((event) => {
      newAIData[event.id] = generateAIMatches(event.id);
    });
    setAiMatchingData(newAIData);
  }, [events]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedEvent]);

  // Timeline Component
  const Timeline = () => (
    <div className="w-full overflow-x-auto pb-1">
      <div
        className="relative flex items-start min-w-max px-6"
        style={{ height: "350px" }}
      >
        <div className="absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>

        {events.map((event, index) => (
          <div
            key={event.id}
            className="relative flex flex-col items-center mx-12 mt-8"
          >
            <div className="relative z-10 mb-4">
              <div className="absolute inset-0 bg-purple-500/30 blur-md rounded-full"></div>
              <div className="relative w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-white/20">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="relative w-72 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:scale-105 transition-all hover:bg-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="text-2xl">
                  <DynamicIcon iconName={event.image} className="w-8 h-8 text-purple-300" />
                </div>
                {calendarConnected && event.calendarConflicts > 0 && (
                  <div className="flex items-center space-x-1 text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                    <AlertCircle className="w-3 h-3" />
                    <span className="text-xs">
                      {event.calendarConflicts} conflicts
                    </span>
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2">
                {event.title}
              </h3>
              <div className="flex items-center space-x-1.5 text-white/70 mb-3">
                <MapPin className="w-3 h-3" />
                <p className="text-xs">{event.location}</p>
              </div>

              <div className="flex items-center space-x-2 text-white/80 mb-3">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span className="text-xs">{event.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">{event.time}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-white/10 px-2 py-0.5 rounded-full">
                    <Users className="w-3 h-3" />
                    <span className="text-xs">{event.participants}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                    <Heart className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-yellow-400">
                      {event.maybeCount}
                    </span>
                  </div>
                </div>

                {userAttendance[event.id] && (
                  <div
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      userAttendance[event.id] === "attending"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {userAttendance[event.id] === "attending"
                      ? "Going"
                      : "Maybe"}
                  </div>
                )}
              </div>

              <div className="text-center">
                <button
                  onClick={() => addToGoogleCalendar(event)}
                  className="cursor-pointer group relative w-full py-2 px-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-blue-300 group-hover:text-blue-200 transition-colors" />
                    <span className="text-sm font-medium text-blue-200 group-hover:text-white transition-colors">
                      Add to Calendar
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/10 group-hover:to-indigo-500/10 rounded-lg transition-all duration-300"></div>
                </button>
              </div>
            </div>

            <div className="mt-3 text-xs text-white/50 font-medium">
              {new Date(event.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // AI Matching Panel
  const AIMatchingPanel = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {events.slice(0, 4).map((event) => {
        const matchData = aiMatchingData[event.id];
        if (!matchData) return null;

        return (
          <div
            key={event.id}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 cursor-pointer hover:bg-white/15 hover:border-white/30 transition-all duration-200 hover:scale-105"
            onClick={() => setSelectedEvent(event)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <DynamicIcon iconName={event.image} className="w-8 h-8 text-purple-300" />
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-white/70">
                    {matchData.attendanceReason}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-400">
                  {matchData.compatibilityScore}%
                </div>
                <div className="text-xs text-white/60">Match</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Suggested Connections</span>
                </h4>
                <div className="flex space-x-2">
                  {matchData.suggestedConnections.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-2 bg-white/10 rounded-lg p-2 flex-1 cursor-pointer hover:bg-white/15 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast(`Connect with ${user.name} feature coming soon!`, "info");
                      }}
                    >
                      <DynamicIcon iconName={user.avatar} className="w-4 h-4 text-blue-300" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-white/60 truncate">
                          {user.interests.slice(0, 2).join(", ")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {matchData.recommendedEvents.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>You might also like</span>
                  </h4>
                  <div className="space-y-2">
                    {matchData.recommendedEvents.map((recEvent) => (
                      <div
                        key={recEvent.id}
                        className="flex items-center space-x-3 bg-white/5 rounded-lg p-2 cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(recEvent);
                        }}
                      >
                        <DynamicIcon iconName={recEvent.image} className="w-4 h-4 text-purple-300" />
                        <div>
                          <p className="text-xs font-medium">
                            {recEvent.title}
                          </p>
                          <p className="text-xs text-white/60">
                            {recEvent.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MeetupHub
              </h1>
            </div>

            <nav className="hidden md:flex items-center space-x-3">
              <button
                onClick={() => setTimelineView(!timelineView)}
                className={`group relative px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer overflow-hidden ${
                  timelineView
                    ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-400/50 shadow-lg shadow-purple-500/25"
                    : "bg-white/10 text-white/80 border border-white/20 hover:bg-white/15 hover:text-white hover:border-white/30 hover:shadow-lg hover:shadow-white/10"
                } transform hover:scale-105 active:scale-95`}
              >
                {/* Background glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    timelineView ? "opacity-100" : ""
                  }`}
                ></div>

                {/* Icon and text */}
                <div className="relative flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Timeline</span>
                </div>

                {/* Active indicator */}
                {timelineView && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                )}

                {/* Hover shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
                </div>
              </button>

              <button
                onClick={() => setShowAIMatching(!showAIMatching)}
                className={`group relative px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer overflow-hidden ${
                  showAIMatching
                    ? "bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-white border border-blue-400/50 shadow-lg shadow-blue-500/25"
                    : "bg-white/10 text-white/80 border border-white/20 hover:bg-white/15 hover:text-white hover:border-white/30 hover:shadow-lg hover:shadow-white/10"
                } transform hover:scale-105 active:scale-95`}
              >
                {/* Background glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    showAIMatching ? "opacity-100" : ""
                  }`}
                ></div>

                {/* Icon and text */}
                <div className="relative flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>AI Matching</span>
                </div>

                {/* Active indicator */}
                {showAIMatching && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                )}

                {/* Hover shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
                </div>
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <Menu className="w-6 h-6" />
              </button>

              <button
                onClick={() =>
                  showToast("Notifications feature coming soon!", "info")
                }
                className="hidden md:flex p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
              </button>
              <button
                onClick={() => showToast("Settings panel coming soon!", "info")}
                className="hidden md:flex p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  showToast("Profile management coming soon!", "info")
                }
                className="hidden md:flex w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/50"
              />
            </div>
            {(selectedInterests.length > 0 || searchTerm.length > 0) && (
              <button
                onClick={() => {
                  setSelectedInterests([]);
                  setSearchTerm("");
                  showToast("Filters reset successfully!", "success");
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all cursor-pointer flex items-center space-x-2"
              >
                <X className="w-5 h-5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {allInterests.map((interest) => {
              const IconComponent = interestIcons[interest] || Star;
              return (
                <button
                  key={interest}
                  onClick={() => {
                    setSelectedInterests((prev) =>
                      prev.includes(interest)
                        ? prev.filter((i) => i !== interest)
                        : [...prev, interest]
                    );
                  }}
                  className={`px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center space-x-1.5 text-sm ${
                    selectedInterests.includes(interest)
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105"
                      : "bg-white/10 hover:bg-white/20 text-white/70 hover:text-white hover:scale-105"
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span className="capitalize">{interest}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeline View */}
        {timelineView && !searchTerm && (
          <div className="mb-8 bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-2 flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Event Timeline</span>
            </h2>
            <Timeline />
          </div>
        )}

        {/* AI Matching Panel */}
        {showAIMatching && !searchTerm && (
          <div className="mb-8 bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span>AI-Powered Matching</span>
            </h2>
            <AIMatchingPanel />
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="group relative w-80 h-80 cursor-pointer transform-gpu transition-all duration-500 hover:scale-110"
                style={{ perspective: "1000px" }}
              >
                <div
                  className="w-full h-full relative transform-gpu transition-all duration-500 group-hover:rotateY-12 group-hover:rotateX-6"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    onClick={() => setSelectedEvent(event)}
                    className="w-full h-full relative overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-500/30"
                    style={{
                      clipPath:
                        "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)",
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 transform translate-x-1 translate-y-1 -z-10"
                      style={{
                        clipPath:
                          "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)",
                      }}
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-indigo-500/15 transform translate-x-2 translate-y-2 -z-20"
                      style={{
                        clipPath:
                          "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)",
                      }}
                    />

                    <div className="absolute inset-0 flex flex-col items-center text-center">
                      <div className="flex-shrink-0 pt-6 pb-0">
                        <div className="flex justify-center space-x-1 mb-2">
                          {event.trending && (
                            <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/40 rounded-full px-2 py-0.5">
                              <FlameIcon className="w-3 h-3 text-red-300" />
                            </div>
                          )}
                          {calendarConnected &&
                            event.calendarConflicts === 0 && (
                              <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/40 rounded-full px-2 py-0.5">
                                <CheckCircle className="w-3 h-3 text-green-300" />
                              </div>
                            )}
                        </div>

                        <div className="text-3xl transition-all duration-300 group-hover:scale-125 group-hover:rotate-6">
                          <DynamicIcon iconName={event.image} className="w-12 h-12 text-purple-300" />
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-center items-center px-8 pb-2 max-w-60">
                        <h3 className="font-bold text-base mb-2 line-clamp-2 transition-all duration-300 group-hover:text-purple-200 leading-tight">
                          {event.title}
                        </h3>

                        <div className="text-xs text-white/80 mb-2 font-medium">
                          {event.date} • {event.time}
                        </div>

                        <div className="flex items-center space-x-1 mb-3 text-xs text-white/70">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate max-w-28">
                            {event.location}
                          </span>
                        </div>

                        <div className="flex items-center justify-center space-x-3 mb-3">
                          <div className="flex items-center space-x-1 bg-white/15 rounded-full px-2 py-1">
                            <Users className="w-3 h-3 text-blue-300" />
                            <span className="text-xs font-medium">
                              {event.participants}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 bg-yellow-500/20 rounded-full px-2 py-1">
                            <Heart className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs font-medium">
                              {event.maybeCount}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-1 justify-center mb-3">
                          {event.interests.slice(0, 2).map((interest) => (
                            <span
                              key={interest}
                              className="text-xs bg-purple-500/30 px-2 py-0.5 rounded-full font-medium"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>

                        <div className="flex space-x-1 justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentStatus = userAttendance[event.id];
                              const newStatus = currentStatus === "attending" ? null : "attending";
                              handleAttendance(event.id, newStatus);
                            }}
                            className={`px-3 py-1 text-xs rounded-full font-medium transition-all cursor-pointer transform hover:scale-105 ${
                              userAttendance[event.id] === "attending"
                                ? "bg-green-500 text-white shadow-md shadow-green-500/30"
                                : "bg-white/20 hover:bg-green-500/60 backdrop-blur-sm border border-white/30 text-white"
                            }`}
                          >
                            {userAttendance[event.id] === "attending"
                              ? "✓ Going"
                              : "Join"}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentStatus = userAttendance[event.id];
                              const newStatus = currentStatus === "maybe" ? null : "maybe";
                              handleAttendance(event.id, newStatus);
                            }}
                            className={`px-2 py-1 text-xs rounded-full font-medium transition-all cursor-pointer transform hover:scale-105 ${
                              userAttendance[event.id] === "maybe"
                                ? "bg-yellow-500 text-white shadow-md shadow-yellow-500/30"
                                : "bg-white/20 hover:bg-yellow-500/60 backdrop-blur-sm border border-white/30 text-white"
                            }`}
                          >
                            {userAttendance[event.id] === "maybe"
                              ? "✓"
                              : "Maybe"}
                          </button>
                        </div>
                      </div>

                      <div className="flex-shrink-0 pb-4">
                        {calendarConnected && event.calendarConflicts > 0 && (
                          <div className="flex items-center justify-center space-x-1 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/40 rounded-full px-2 py-1">
                            <AlertCircle className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-yellow-300">
                              {event.calendarConflicts}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10"
                        style={{
                          clipPath:
                            "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex space-x-2 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      showToast("Sharing feature coming soon!", "info");
                    }}
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all cursor-pointer transform hover:scale-110 shadow-lg"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-16 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`w-full transition-all duration-1000 rounded-full ${
                          (event.popularity ?? 75) >= 90
                            ? "bg-gradient-to-t from-emerald-500 to-green-400"
                            : (event.popularity ?? 75) >= 75
                            ? "bg-gradient-to-t from-blue-500 to-cyan-400"
                            : "bg-gradient-to-t from-yellow-500 to-orange-400"
                        }`}
                        style={{ height: `${event.popularity ?? 75}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/70 mt-1">
                      {event.popularity ?? 75}%
                    </span>
                  </div>
                </div>

                <div className="absolute inset-0 -m-2 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">
                      <DynamicIcon iconName={selectedEvent.image} className="w-12 h-12 text-purple-300" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">
                        {selectedEvent.title}
                      </h2>
                      <p className="text-white/70">
                        Organized by {selectedEvent.organizer}
                      </p>
                      {aiMatchingData[selectedEvent.id] && (
                        <div className="mt-2 flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-yellow-400">
                            {
                              aiMatchingData[selectedEvent.id]
                                .compatibilityScore
                            }
                            % match for you
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-3">Event Details</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {selectedEvent.date} at {selectedEvent.time}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedEvent.location}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Users className="w-4 h-4" />
                        <span>
                          {selectedEvent.participants}/
                          {selectedEvent.maxCapacity} attending
                        </span>
                      </div>
                      {calendarConnected && (
                        <div
                          className={`flex items-center space-x-3 ${
                            selectedEvent.calendarConflicts === 0
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {selectedEvent.calendarConflicts === 0 ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <AlertCircle className="w-4 h-4" />
                          )}
                          <span>
                            {selectedEvent.calendarConflicts === 0
                              ? "No calendar conflicts"
                              : `${selectedEvent.calendarConflicts} calendar conflicts`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Interests & Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.interests.map((interest) => {
                        const IconComponent = interestIcons[interest] || Star;
                        return (
                          <span
                            key={interest}
                            className="flex items-center space-x-1 bg-purple-500/20 px-3 py-2 rounded-full text-sm"
                          >
                            <IconComponent className="w-3 h-3" />
                            <span className="capitalize">{interest}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Description</h3>
                  <p className="text-white/80 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Attendees</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedEvent.attendees.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-3 bg-white/10 rounded-lg p-3"
                      >
                        <DynamicIcon iconName={user.avatar} className="w-6 h-6 text-blue-300" />
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-white/60">
                            {user.interests.slice(0, 2).join(", ")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      const currentStatus = userAttendance[selectedEvent.id];
                      const newStatus = currentStatus === "attending" ? null : "attending";
                      handleAttendance(selectedEvent.id, newStatus);
                    }}
                    className={`flex-1 py-3 rounded-lg transition-all cursor-pointer ${
                      userAttendance[selectedEvent.id] === "attending"
                        ? "bg-green-500 text-white"
                        : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    }`}
                  >
                    {userAttendance[selectedEvent.id] === "attending"
                      ? "Attending ✓"
                      : "Join Event"}
                  </button>
                  <button
                    onClick={() => {
                      const currentStatus = userAttendance[selectedEvent.id];
                      const newStatus = currentStatus === "maybe" ? null : "maybe";
                      handleAttendance(selectedEvent.id, newStatus);
                    }}
                    className={`px-6 py-3 rounded-lg transition-all cursor-pointer ${
                      userAttendance[selectedEvent.id] === "maybe"
                        ? "bg-yellow-500 text-white"
                        : "bg-white/10 hover:bg-yellow-500/50"
                    }`}
                  >
                    Maybe ({selectedEvent.maybeCount})
                  </button>
                  <button
                    onClick={() => addToGoogleCalendar(selectedEvent)}
                    className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all cursor-pointer border border-blue-500/30"
                  >
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Add to Calendar</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-md border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg">MeetupHub</span>
              </div>
              <p className="text-white/60 text-sm">
                Connect with like-minded individuals and discover amazing events
                in your community.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li
                  onClick={() =>
                    showToast("AI Matching feature coming soon!", "info")
                  }
                  className="cursor-pointer hover:text-white transition-colors"
                >
                  AI Matching
                </li>
                <li
                  onClick={() =>
                    showToast(
                      "Calendar Integration feature coming soon!",
                      "info"
                    )
                  }
                  className="cursor-pointer hover:text-white transition-colors"
                >
                  Calendar Integration
                </li>
                <li
                  onClick={() =>
                    showToast("Interest Filtering feature coming soon!", "info")
                  }
                  className="cursor-pointer hover:text-white transition-colors"
                >
                  Interest Filtering
                </li>
                <li
                  onClick={() =>
                    showToast("Event Timeline feature coming soon!", "info")
                  }
                  className="cursor-pointer hover:text-white transition-colors"
                >
                  Event Timeline
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li
                  onClick={() =>
                    showToast("Event creation feature coming soon!", "info")
                  }
                  className="cursor-pointer hover:text-white transition-colors"
                >
                  Create Events
                </li>
                <li
                  onClick={() =>
                    showToast("Group joining feature coming soon!", "info")
                  }
                  className="cursor-pointer hover:text-white transition-colors"
                >
                  Join Groups
                </li>
                <li
                  onClick={() =>
                    showToast("Partner finding feature coming soon!", "info")
                  }
                  className="cursor-pointer hover:text-white transition-colors"
                >
                  Find Partners
                </li>
                <li
                  onClick={() =>
                    showToast("Interest sharing feature coming soon!", "info")
                  }
                  className="cursor-pointer hover:text-white transition-colors"
                >
                  Share Interests
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li
                  onClick={() => showToast("Help Center coming soon!", "info")}
                  className="cursor-pointer hover:text-white transition-colors"
                >
                  Help Center
                </li>
                <li
                  onClick={() => showToast("Contact form coming soon!", "info")}
                  className="cursor-pointer hover:text-white transition-colors"
                >
                  Contact Us
                </li>
                <li
                  onClick={() =>
                    showToast("Privacy Policy coming soon!", "info")
                  }
                  className="cursor-pointer hover:text-white transition-colors"
                >
                  Privacy Policy
                </li>
                <li
                  onClick={() =>
                    showToast("Terms of Service coming soon!", "info")
                  }
                  className="cursor-pointer hover:text-white transition-colors"
                >
                  Terms of Service
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">
              © 2025 MeetupHub. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button
                onClick={() =>
                  showToast("Email subscription coming soon!", "info")
                }
                className="text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <Mail className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  showToast("Twitter integration coming soon!", "info")
                }
                className="text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  showToast("Facebook integration coming soon!", "info")
                }
                className="text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  showToast("Instagram integration coming soon!", "info")
                }
                className="text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <Instagram className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-64 h-full bg-white/10 backdrop-blur-md border-l border-white/20 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Menu</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="space-y-4">
              <button
                onClick={() => {
                  setTimelineView(!timelineView);
                  setShowMobileMenu(false);
                }}
                className={`w-full px-4 py-3 rounded-lg transition-all cursor-pointer text-left ${
                  timelineView
                    ? "bg-purple-500/20 text-purple-300"
                    : "hover:bg-white/10"
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => {
                  setShowAIMatching(!showAIMatching);
                  setShowMobileMenu(false);
                }}
                className={`w-full px-4 py-3 rounded-lg transition-all cursor-pointer text-left ${
                  showAIMatching
                    ? "bg-purple-500/20 text-purple-300"
                    : "hover:bg-white/10"
                }`}
              >
                AI Matching
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityMeetupPlatform;