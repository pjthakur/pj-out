"use client"
import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import toast, { Toaster } from 'react-hot-toast';
import { 
  MdFavorite, 
  MdPeople, 
  MdAccessTime, 
  MdChat, 
  MdMic, 
  MdRadio, 
  MdVisibility, 
  MdHome, 
  MdCalendarToday, 
  MdInfo,
  MdEmail,
  MdCheckCircle,
  MdVolumeUp,
  MdVolumeOff
} from "react-icons/md";
type Show = {
  id: string;
  title: string;
  startTime: Date;
  hosts: string[];
  description: string;
  image: string;
  category: string;
  duration: number;
};
type ReactionType = "like" | "funny" | "love" | "fire";
type FloatingReaction = {
  id: string;
  type: ReactionType;
  x: number;
  y: number;
  timestamp: number;
};
type ChatMessage = {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  answered?: boolean;
};
type TabType = "home" | "live" | "upcoming" | "about";
const upcomingShows: Show[] = [
  {
    id: "2",
    title: "Coffee & Code",
    startTime: new Date(Date.now() + 1000 * 60 * 45),
    hosts: ["Sarah Chen"],
    description: "Morning conversations about development practices and coding.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&fit=crop",
    category: "Development",
    duration: 45,
  },
  {
    id: "3",
    title: "Night Owl Live",
    startTime: new Date(Date.now() + 1000 * 60 * 180),
    hosts: ["Mitch R."],
    description: "Late-night conversations about tech culture and innovation.",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&fit=crop",
    category: "Culture",
    duration: 90,
  },
  {
    id: "4",
    title: "Startup Stories",
    startTime: new Date(Date.now() + 1000 * 60 * 300),
    hosts: ["Emma Wilson"],
    description: "Real stories from startup founders and their journeys.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&fit=crop",
    category: "Business",
    duration: 75,
  },
  {
    id: "5",
    title: "Design Deep Dive",
    startTime: new Date(Date.now() + 1000 * 60 * 420),
    hosts: ["Alex Kim"],
    description: "Exploring modern design trends and user experience principles.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&fit=crop",
    category: "Design",
    duration: 60,
  },
];
const currentLiveShow: Show & { isLive: true } = {
  id: "1",
  title: "Tech Roundtable",
  startTime: new Date(Date.now() - 1000 * 60 * 15),
  hosts: ["Alice Johnson", "Bob Smith"],
  description: "Deep dive into the latest trends in technology, AI, and software development with industry experts.",
  image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&fit=crop",
  category: "Technology",
  duration: 120,
  isLive: true,
};
const dummyMessages = [
  { user: "TechEnthusiast92", content: "This is so insightful! Thanks for breaking it down." },
  { user: "CodeNewbie", content: "Can you recommend any beginner-friendly resources?" },
  { user: "StartupFounder", content: "How do you handle technical debt in fast-growing companies?" },
  { user: "DevOpsGuru", content: "What's your experience with Kubernetes in production?" },
  { user: "AIResearcher", content: "Thoughts on the future of machine learning?" },
  { user: "WebDeveloper", content: "Great explanation of REST vs GraphQL!" },
  { user: "MobileDevPro", content: "Any advice for cross-platform development?" },
  { user: "DataScientist", content: "How do you ensure data quality in ML pipelines?" },
  { user: "CloudArchitect", content: "What's your preferred cloud provider and why?" },
  { user: "SecurityExpert", content: "Can you talk about zero-trust architecture?" },
  { user: "ProductManager", content: "How do you balance technical debt with new features?" },
  { user: "FullStackDev", content: "This is exactly what I was looking for!" },
  { user: "SystemAdmin", content: "Any tips for monitoring distributed systems?" },
  { user: "FrontendDev", content: "What's your take on the latest JavaScript frameworks?" },
  { user: "BackendDev", content: "How do you handle database scaling challenges?" },
  { user: "TechLead", content: "Great insights on team management and technical decisions." },
  { user: "InternDeveloper", content: "As someone new to the field, this is incredibly helpful!" },
  { user: "SeniorEngineer", content: "Solid advice based on real experience. Thank you!" },
  { user: "OpenSourceContrib", content: "Do you contribute to open source? Any recommendations?" },
  { user: "RemoteWorker", content: "How do you maintain team culture in remote-first companies?" }
];
function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  return { h, m, s, done: diff === 0 };
}
function useIsDesktop(breakpoint = 1024) {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(window.innerWidth >= breakpoint);
    function handle() {
      setIsDesktop(window.innerWidth >= breakpoint);
    }
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, [breakpoint]);
  return isDesktop;
}
const Navigation: React.FC<{
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  platformMetrics: { totalListeners: number };
}> = ({ activeTab, onTabChange, platformMetrics }) => {
  const isDesktop = useIsDesktop();
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: MdHome },
    { id: 'live' as TabType, label: 'Live', icon: MdRadio },
    { id: 'upcoming' as TabType, label: 'Upcoming', icon: MdCalendarToday },
    { id: 'about' as TabType, label: 'About', icon: MdInfo },
  ];
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (isLeftSwipe && currentIndex < tabs.length - 1) {
      onTabChange(tabs[currentIndex + 1].id);
    }
    if (isRightSwipe && currentIndex > 0) {
      onTabChange(tabs[currentIndex - 1].id);
    }
  };
  if (isDesktop) {
    return (
      <nav className="bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/30 px-8 py-3 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <MdRadio size={20} color="white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white m-0 tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              AudioHub
            </h1>
              <p className="text-xs text-gray-500 m-0 font-medium">
                Professional Podcast Platform
            </p>
            </div>
          </div>
          <div className="flex gap-1 bg-gray-800/60 backdrop-blur-md rounded-full p-1 border border-gray-600/30 shadow-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
                          return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full border-none text-sm font-medium cursor-pointer relative overflow-hidden backdrop-blur-sm transition-all duration-200 ${
                  isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                      : 'bg-transparent text-gray-300 hover:bg-gray-700/40 hover:text-white'
                }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Icon size={16} />
                  <span className="font-medium">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
            })}
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-2 bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-md px-4 py-2 rounded-full border border-red-500/30">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 text-sm font-semibold">LIVE</span>
              <span className="text-gray-400 text-xs">{platformMetrics.totalListeners} listeners</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }
  return (
    <>
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="touch-pan-x"
      >
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-xl border-t border-gray-700/50 px-4 py-2 z-50 shadow-2xl">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl border-none cursor-pointer min-w-0 backdrop-blur-sm ${
                  isActive 
                      ? 'text-blue-400' 
                      : 'text-gray-400 hover:text-white active:text-blue-400'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  animate={{ 
                    y: isActive ? -2 : 0,
                    scale: isActive ? 1.1 : 1 
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Icon size={22} />
                </motion.div>
                <motion.span 
                  className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}
                  animate={{ scale: isActive ? 1.05 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {tab.label}
                </motion.span>
                {isActive && (
                  <motion.div 
                      className="w-1 h-1 bg-blue-400 rounded-full mt-0.5"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 600, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </nav>
      </div>
    </>
  );
};
const CountdownTimer: React.FC<{ target: Date }> = ({ target }) => {
  const { h, m, s, done } = useCountdown(target);
  if (done) {
    return (
      <div className="flex items-center gap-2 text-white font-bold text-sm backdrop-blur-xl bg-green-600/90 px-3 py-2 rounded-xl border border-green-400/50 shadow-lg">
        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
        LIVE NOW
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-white text-sm font-bold tabular-nums backdrop-blur-xl bg-gray-900/90 px-3 py-2 rounded-xl border border-gray-500/50 shadow-lg">
      <MdAccessTime size={14} />
      <span>
      {h.toString().padStart(2, "0")}:{m.toString().padStart(2, "0")}:{s.toString().padStart(2, "0")}
      </span>
    </div>
  );
};
type Speaker = {
  id: string;
  name: string;
  avatar: string;
  role: string;
  color: string;
};
const LiveStage: React.FC<{
  show: Show & { isLive: true };
  audienceMetrics: {
    listeners: number;
    activeInChat: number;
  };
  totalReactions: number;
  timeRemaining: string;
  onOpenMobileChat?: () => void;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  isAudioMuted: boolean;
  setIsAudioMuted: (muted: boolean) => void;
}> = ({ show, audienceMetrics, totalReactions, timeRemaining, onOpenMobileChat, audioEnabled, setAudioEnabled, isAudioMuted, setIsAudioMuted }) => {
  const speakers: Speaker[] = [
    {
      id: '1',
      name: show.hosts[0] || 'Alice Johnson',
      avatar: 'https://images.unsplash.com/photo-1676146260286-1a84d61b9df9?w=150&h=150&fit=crop&crop=face',
      role: 'Host',
      color: '#6366f1',
    },
    {
      id: '2', 
      name: show.hosts[1] || 'Bob Smith',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      role: 'Co-Host',
      color: '#f59e0b',
    },
    {
      id: '3',
      name: 'Sarah Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 
      role: 'Guest',
      color: '#ec4899',
    }
  ];
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(speakers[0].id);
  const [lastSpeaker, setLastSpeaker] = useState<string>(speakers[0].id);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  const createAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = 0.1;
    }
  };
  useEffect(() => {
    if (audioEnabled) {
      createAudioContext();
    }
  }, [audioEnabled]);
  const handleEnableAudioClick = () => {
    createAudioContext();
    setAudioEnabled(true);
    setIsAudioMuted(false);
  };
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsTabVisible(isVisible);
      if (!isVisible && oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
    };
    const handleWindowFocus = () => {
      setIsWindowFocused(true);
    };
    const handleWindowBlur = () => {
      setIsWindowFocused(false);
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
    };
    const handleBeforeUnload = () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === 'Tab') || 
          (e.ctrlKey && e.key === 'w') || 
          (e.altKey && e.key === 'Tab')) {
        setIsWindowFocused(false);
        if (oscillatorRef.current) {
          oscillatorRef.current.stop();
          oscillatorRef.current = null;
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  const getSpeakerAudioConfig = (speakerId: string) => {
    switch (speakerId) {
      case '1':
        return { 
          frequency: 120, 
          type: 'sine' as OscillatorType, 
          filterFreq: 300,
          volume: 0.08 
        };
      case '2':  
        return { 
          frequency: 80, 
          type: 'sawtooth' as OscillatorType, 
          filterFreq: 250,
          volume: 0.1 
        };
      case '3':
        return { 
          frequency: 150, 
          type: 'triangle' as OscillatorType, 
          filterFreq: 350,
          volume: 0.09 
        };
      default:
        return { 
          frequency: 100, 
          type: 'sine' as OscillatorType, 
          filterFreq: 300,
          volume: 0.08 
        };
    }
  };
  const playAmbientSound = (speakerId?: string) => {
    if (!audioContextRef.current || !gainNodeRef.current || !audioEnabled || !speakerId || 
        !isTabVisible || !isWindowFocused || isAudioMuted) {
      return;
    }
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }
    const config = getSpeakerAudioConfig(speakerId);
    oscillatorRef.current = audioContextRef.current.createOscillator();
    const filter = audioContextRef.current.createBiquadFilter();
    oscillatorRef.current.type = config.type;
    oscillatorRef.current.frequency.setValueAtTime(config.frequency, audioContextRef.current.currentTime);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(config.filterFreq, audioContextRef.current.currentTime);
    gainNodeRef.current.gain.value = config.volume;
    oscillatorRef.current.connect(filter);
    filter.connect(gainNodeRef.current);
    oscillatorRef.current.start();
  };
  const stopAmbientSound = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
  };
  const toggleAudioMute = () => {
    setIsAudioMuted(!isAudioMuted);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        const randomSpeaker = speakers[Math.floor(Math.random() * speakers.length)];
        setCurrentSpeaker(randomSpeaker.id);
        setLastSpeaker(randomSpeaker.id);
        if (audioEnabled && !isAudioMuted) {
          playAmbientSound(randomSpeaker.id);
        }
      } else {
        setCurrentSpeaker(null);
        stopAmbientSound();
      }
    }, 2000 + Math.random() * 3000); 
    return () => clearInterval(interval);
  }, [audioEnabled, isAudioMuted]);
  useEffect(() => {
    if (currentSpeaker && audioEnabled && !isAudioMuted) {
      playAmbientSound(currentSpeaker);
    } else {
      stopAmbientSound();
    }
  }, [currentSpeaker, audioEnabled, isAudioMuted]);
  useEffect(() => {
    if (!isTabVisible || !isWindowFocused) {
      stopAmbientSound();
    } else if (currentSpeaker && audioEnabled && !isAudioMuted) {
      playAmbientSound(currentSpeaker);
    }
  }, [isTabVisible, isWindowFocused, currentSpeaker, audioEnabled, isAudioMuted]);
  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);
  const isDesktop = useIsDesktop();
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden rounded-3xl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-500/5 to-purple-600/5 rounded-full blur-3xl" />
      </div>
    <motion.div 
        className="relative z-10 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-blue-800/90 backdrop-blur-xl border-b border-white/10"
        initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
        <div className="px-4 lg:px-6 py-4 lg:py-5">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="relative flex-shrink-0">
                <img
                  src={show.image}
                  alt={show.title}
                  className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
                />
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                LIVE
              </div>
            </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg lg:text-2xl font-bold text-white mb-1 tracking-tight truncate">
                  {show.title}
                </h1>
                <p className="text-white/80 text-xs lg:text-sm mb-2 leading-relaxed line-clamp-1">
                  {show.description}
                </p>
                <div className="flex items-center gap-2 lg:gap-3 text-white/70">
                  <div className="flex items-center gap-1">
                    <MdAccessTime size={12} />
                    <span className="text-xs font-medium">Started 15 min ago</span>
          </div>
                  <div className="flex items-center gap-1">
                    <MdPeople size={12} />
                    <span className="text-xs font-medium">{show.duration} min duration</span>
        </div>
                  <div className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold">
            {show.category}
        </div>
      </div>
          </div>
        </div>
          </div>
        </div>
      </motion.div>
      <div className="flex-1 relative z-20 p-3 lg:p-4 min-h-0 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col min-h-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 h-full min-h-0">
            <motion.div 
              className="lg:col-span-2 bg-gray-900/80 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-gray-700/30 p-4 lg:p-5 shadow-2xl h-full min-h-0 flex flex-col overflow-hidden"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-3 lg:mb-4 flex-shrink-0">
                <h2 className="text-base lg:text-lg font-bold text-white flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Live Speakers
                </h2>
                <div className="flex items-center gap-1 text-gray-400 text-xs lg:text-sm">
                  <MdMic size={14} />
                  <span>{speakers.length} speakers</span>
                </div>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                    {currentSpeaker ? 'Currently Speaking' : 'Last Speaker'}
                  </h3>
                  {(() => {
                    const displaySpeaker = currentSpeaker ? 
                      speakers.find(speaker => speaker.id === currentSpeaker) : 
                      speakers.find(speaker => speaker.id === lastSpeaker);
                    if (displaySpeaker) {
                      const isCurrentlySpeaking = currentSpeaker === displaySpeaker.id;
                      return (
                        <div className={`rounded-2xl p-4 border backdrop-blur-md ${
                          isCurrentlySpeaking 
                            ? 'bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/30' 
                            : 'bg-gray-800/40 border-gray-700/30'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={displaySpeaker.avatar}
                                alt={displaySpeaker.name}
                                className={`w-16 h-16 rounded-xl object-cover border-2 shadow-lg ${
                                  isCurrentlySpeaking 
                                    ? 'border-blue-400 shadow-blue-500/30 ring-2 ring-blue-500/20' 
                                    : 'border-gray-500 shadow-gray-900/30'
                                }`}
                              />
                              {isCurrentlySpeaking && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-gray-900 animate-pulse flex items-center justify-center">
                                  <MdMic size={10} className="text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className={`text-lg font-bold mb-1 ${
                                isCurrentlySpeaking ? 'text-blue-300' : 'text-white'
                              }`}>
                                {displaySpeaker.name}
                              </h3>
                              <p className={`text-sm mb-2 ${
                                isCurrentlySpeaking ? 'text-blue-200/80' : 'text-gray-400'
                              }`}>
                                {displaySpeaker.role}
                              </p>
                              <div className="flex items-center gap-2">
                                {isCurrentlySpeaking ? (
                                  <>
                                                                        <div className="flex items-center gap-0.5">
                                      {[0, 1, 2, 3, 4, 5].map((i) => (
                                        <div
                                          key={i}
                                          className={`w-0.5 bg-blue-400 rounded-full animate-audio-bars audio-bar-${i}`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-blue-300 text-sm font-medium ml-1">Speaking now</span>
                                  </>
                                ) : (
                                  <span className="text-gray-500 text-sm">Silent</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">All Speakers</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {speakers.map((speaker) => {
            const isSpeaking = currentSpeaker === speaker.id;
            return (
                    <div 
                key={speaker.id}
                          className={`relative bg-gray-800/60 backdrop-blur-md rounded-xl border transition-all duration-300 overflow-hidden hover:bg-gray-800/80 ${
                  isSpeaking 
                              ? 'border-blue-500/60 bg-blue-500/10 shadow-lg shadow-blue-500/20' 
                              : 'border-gray-700/40 hover:border-gray-600/60'
                      }`}
                    >
                          <div className="relative z-10 p-3">
                            <div className="flex items-center gap-3">
                              <div className="relative flex-shrink-0">
                  <img
                    src={speaker.avatar}
                    alt={speaker.name}
                                  className={`w-12 h-12 rounded-lg object-cover transition-all duration-300 ${
                              isSpeaking 
                                      ? 'border-2 border-blue-500 shadow-lg shadow-blue-500/30' 
                                : 'border-2 border-gray-600'
                            }`}
                          />
                  {isSpeaking && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-gray-900 animate-pulse" />
                          )}
                        </div>
                              <div className="flex-1 min-w-0">
                                <h3 className={`font-semibold mb-1 text-sm transition-colors duration-300 truncate ${
                          isSpeaking ? 'text-blue-300' : 'text-white'
                        }`}>
                          {speaker.name}
                        </h3>
                                <p className="text-gray-400 text-xs mb-1 truncate">{speaker.role}</p>
                                <div className="flex items-center gap-1">
                          {isSpeaking ? (
                                    <>
                            <div className="flex items-center gap-0.5">
                              {[0, 1, 2, 3, 4].map((i) => (
                                <div
                                  key={i}
                                            className={`w-0.5 bg-blue-400 rounded-full animate-audio-bars audio-bar-${i}`}
                    />
                              ))}
                            </div>
                                      <span className="text-blue-400 text-xs font-medium ml-2">Speaking</span>
                                    </>
                          ) : (
                                    <span className="text-gray-500 text-xs">Silent</span>
                  )}
                                </div>
                              </div>
                </div>
                      </div>
                    </div>
                  );
                })}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Live Stats</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-800/40 rounded-lg p-3 border border-gray-700/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-gray-400 text-xs">Active Speakers</span>
                      </div>
                      <div className="text-white font-bold text-lg">
                        {speakers.filter(s => currentSpeaker === s.id).length} / {speakers.length}
                      </div>
                    </div>
                    <div className="bg-gray-800/40 rounded-lg p-3 border border-gray-700/30">
                      <div className="flex items-center gap-2 mb-2">
                        <MdAccessTime size={12} className="text-blue-400" />
                        <span className="text-gray-400 text-xs">Time Remaining</span>
                      </div>
                      <div className="text-white font-bold text-lg">{timeRemaining}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="h-full min-h-0 flex flex-col overflow-hidden"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-gray-700/30 p-3 lg:p-4 shadow-2xl h-full flex flex-col overflow-hidden">
                <h3 className="text-base lg:text-lg font-bold text-white mb-3 lg:mb-4 flex items-center gap-2 flex-shrink-0">
                  <MdAccessTime size={16} className="text-blue-400" />
                  Session Info
                </h3>
                <div className="space-y-2 lg:space-y-3 flex-1 min-h-0 overflow-y-auto">
                  <div className="flex items-center justify-between p-2 lg:p-3 rounded-xl bg-gray-800/60 border border-gray-700/20">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-gray-300 text-xs lg:text-sm">Status</span>
                  </div>
                    <span className="text-green-400 font-semibold text-xs lg:text-sm">LIVE</span>
                  </div>
                  <div className="flex items-center justify-between p-2 lg:p-3 rounded-xl bg-gray-800/60 border border-gray-700/20">
                    <div className="flex items-center gap-2">
                      <MdAccessTime size={14} className="text-blue-400" />
                      <span className="text-gray-300 text-xs lg:text-sm">Duration</span>
                    </div>
                    <span className="text-white font-semibold text-xs lg:text-sm">120 min</span>
                  </div>
                  <div className="flex items-center justify-between p-2 lg:p-3 rounded-xl bg-gray-800/60 border border-gray-700/20">
                    <div className="flex items-center gap-2">
                      <MdPeople size={14} className="text-purple-400" />
                      <span className="text-gray-300 text-xs lg:text-sm">Peak Viewers</span>
                    </div>
                    <span className="text-white font-semibold text-xs lg:text-sm">312</span>
                  </div>
                  <div className="border-t border-gray-700/30 pt-2 lg:pt-3">
                    <h4 className="text-xs lg:text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <MdCalendarToday size={12} className="text-green-400" />
                      Coming Up
                    </h4>
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-800/40 border border-gray-700/10">
                        <div className="w-1 h-4 bg-green-500 rounded-full flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium text-xs">Q&A Session</div>
                          <div className="text-gray-400 text-xs">In 10 minutes</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-800/40 border border-gray-700/10">
                        <div className="w-1 h-4 bg-blue-500 rounded-full flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium text-xs">Expert Panel</div>
                          <div className="text-gray-400 text-xs">In 25 minutes</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!isDesktop && onOpenMobileChat && (
                    <button 
                      onClick={onOpenMobileChat}
                      className="w-full flex items-center justify-center gap-2 p-2 lg:p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl text-blue-300 font-medium transition-colors cursor-pointer mt-2"
                    >
                      <MdChat size={16} />
                      Open Chat
                    </button>
                    )}
                  {!audioEnabled && (
                    <button 
                      onClick={handleEnableAudioClick}
                      className="w-full flex items-center justify-center gap-2 p-2 lg:p-3 bg-green-500/20 hover:bg-green-500/30 rounded-xl text-green-300 font-medium transition-colors cursor-pointer mt-2"
                    >
                      <MdMic size={16} />
                      Enable Audio
                    </button>
                  )}
                  {audioEnabled && (
                    <button 
                      onClick={toggleAudioMute}
                      className={`w-full flex items-center justify-center gap-2 p-2 lg:p-3 rounded-xl font-medium transition-colors cursor-pointer mt-2 ${
                        isAudioMuted 
                          ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300' 
                          : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300'
                      }`}
                    >
                      {isAudioMuted ? (
                        <>
                          <MdVolumeOff size={18} />
                          Unmute Audio
                        </>
                      ) : (
                        <>
                          <MdVolumeUp size={18} />
                          Mute Audio
                        </>
                      )}
                    </button>
                    )}
                  </div>
                </div>
              </motion.div>
          </div>
        </div>
      </div>
      <motion.div 
        className="relative z-10 bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/30 px-3 lg:px-4 py-2 lg:py-3 flex-shrink-0"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400 text-xs lg:text-sm">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium">Live Audience Metrics</span>
            </div>
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <MdVisibility size={14} className="text-blue-400" />
          </div>
          <div>
                  <div className="text-base lg:text-xl font-bold text-white">
              {audienceMetrics.listeners.toLocaleString()}
            </div>
                  <div className="text-xs text-gray-400 font-medium">Listening Now</div>
          </div>
        </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <MdChat size={14} className="text-purple-400" />
          </div>
          <div>
                  <div className="text-base lg:text-xl font-bold text-white">
              {audienceMetrics.activeInChat}
            </div>
                  <div className="text-xs text-gray-400 font-medium">Engaging in Chat</div>
          </div>
        </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                  <MdFavorite size={14} className="text-pink-400" />
          </div>
          <div>
                  <div className="text-base lg:text-xl font-bold text-white">
                    {totalReactions}
            </div>
                  <div className="text-xs text-gray-400 font-medium">Total Reactions</div>
            </div>
          </div>
        </div>
      </div>
        </div>
      </motion.div>
    </div>
  );
};
const MobileChatDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onReact: (type: ReactionType) => void;
  floatingReactions: FloatingReaction[];
  audienceMetrics: {
    listeners: number;
    activeInChat: number;
  };
  typingUsers: string[];
}> = ({ isOpen, onClose, messages, onSendMessage, onReact, floatingReactions, audienceMetrics, typingUsers }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm [touch-action:none]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/30 rounded-t-3xl flex flex-col h-[calc(100vh-100px)] max-h-[85vh] [touch-action:auto]"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-white">Live Chat</h3>
            <div className="flex items-center gap-2 text-gray-400 text-sm bg-gray-800/50 px-3 py-1 rounded-lg">
              <MdChat size={14} />
              <span>{audienceMetrics.activeInChat} active</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800/60 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden relative">
          <LiveChat
            messages={messages}
            onSendMessage={onSendMessage}
            onReact={onReact}
            floatingReactions={floatingReactions}
            audienceMetrics={audienceMetrics}
            typingUsers={typingUsers}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
const MobileLiveStage: React.FC<{
  show: Show & { isLive: true };
  audienceMetrics: {
    listeners: number;
    activeInChat: number;
  };
  totalReactions: number;
  timeRemaining: string;
  onOpenChat: () => void;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  isAudioMuted: boolean;
  setIsAudioMuted: (muted: boolean) => void;
}> = ({ show, audienceMetrics, totalReactions, timeRemaining, onOpenChat, audioEnabled, setAudioEnabled, isAudioMuted, setIsAudioMuted }) => {
  const speakers: Speaker[] = [
    {
      id: '1',
      name: show.hosts[0] || 'Alice Johnson',
      avatar: 'https://images.unsplash.com/photo-1676146260286-1a84d61b9df9?w=150&h=150&fit=crop&crop=face',
      role: 'Host',
      color: '#6366f1',
    },
    {
      id: '2', 
      name: show.hosts[1] || 'Bob Smith',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      role: 'Co-Host',
      color: '#f59e0b',
    },
    {
      id: '3',
      name: 'Sarah Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 
      role: 'Guest',
      color: '#ec4899',
    }
  ];
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(speakers[0].id);
  const [lastSpeaker, setLastSpeaker] = useState<string>(speakers[0].id);
  const mobileAudioContextRef = useRef<AudioContext | null>(null);
  const mobileOscillatorRef = useRef<OscillatorNode | null>(null);
  const mobileGainNodeRef = useRef<GainNode | null>(null);
  const [isMobileTabVisible, setIsMobileTabVisible] = useState(true);
  const [isMobileWindowFocused, setIsMobileWindowFocused] = useState(true);
  const createMobileAudioContext = () => {
    if (!mobileAudioContextRef.current) {
      mobileAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      mobileGainNodeRef.current = mobileAudioContextRef.current.createGain();
      mobileGainNodeRef.current.connect(mobileAudioContextRef.current.destination);
      mobileGainNodeRef.current.gain.value = 0.1;
    }
  };
  useEffect(() => {
    if (audioEnabled) {
      createMobileAudioContext();
    }
  }, [audioEnabled]);
  const handleEnableMobileAudioClick = () => {
    createMobileAudioContext();
    setAudioEnabled(true);
    setIsAudioMuted(false);
  };
  useEffect(() => {
    const handleMobileVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsMobileTabVisible(isVisible);
      if (!isVisible && mobileOscillatorRef.current) {
        mobileOscillatorRef.current.stop();
        mobileOscillatorRef.current = null;
      }
    };
    const handleMobileWindowFocus = () => {
      setIsMobileWindowFocused(true);
    };
    const handleMobileWindowBlur = () => {
      setIsMobileWindowFocused(false);
      if (mobileOscillatorRef.current) {
        mobileOscillatorRef.current.stop();
        mobileOscillatorRef.current = null;
      }
    };
    const handleMobileBeforeUnload = () => {
      if (mobileOscillatorRef.current) {
        mobileOscillatorRef.current.stop();
        mobileOscillatorRef.current = null;
      }
    };
    document.addEventListener('visibilitychange', handleMobileVisibilityChange);
    window.addEventListener('focus', handleMobileWindowFocus);
    window.addEventListener('blur', handleMobileWindowBlur);
    window.addEventListener('beforeunload', handleMobileBeforeUnload);
    window.addEventListener('pagehide', handleMobileBeforeUnload);
    return () => {
      document.removeEventListener('visibilitychange', handleMobileVisibilityChange);
      window.removeEventListener('focus', handleMobileWindowFocus);
      window.removeEventListener('blur', handleMobileWindowBlur);
      window.removeEventListener('beforeunload', handleMobileBeforeUnload);
      window.removeEventListener('pagehide', handleMobileBeforeUnload);
    };
  }, []);
  const getMobileSpeakerAudioConfig = (speakerId: string) => {
    switch (speakerId) {
      case '1':
        return { 
          frequency: 120, 
          type: 'sine' as OscillatorType, 
          filterFreq: 300,
          volume: 0.08 
        };
      case '2': 
        return { 
          frequency: 80, 
          type: 'sawtooth' as OscillatorType, 
          filterFreq: 250,
          volume: 0.1 
        };
      case '3':
        return { 
          frequency: 150, 
          type: 'triangle' as OscillatorType, 
          filterFreq: 350,
          volume: 0.09 
        };
      default:
        return { 
          frequency: 100, 
          type: 'sine' as OscillatorType, 
          filterFreq: 300,
          volume: 0.08 
        };
    }
  };
  const playMobileAmbientSound = (speakerId?: string) => {
    if (!mobileAudioContextRef.current || !mobileGainNodeRef.current || !audioEnabled || !speakerId ||
        !isMobileTabVisible || !isMobileWindowFocused || isAudioMuted) {
      return;
    }
    if (mobileOscillatorRef.current) {
      mobileOscillatorRef.current.stop();
    }
    const config = getMobileSpeakerAudioConfig(speakerId);
    mobileOscillatorRef.current = mobileAudioContextRef.current.createOscillator();
    const filter = mobileAudioContextRef.current.createBiquadFilter();
    mobileOscillatorRef.current.type = config.type;
    mobileOscillatorRef.current.frequency.setValueAtTime(config.frequency, mobileAudioContextRef.current.currentTime);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(config.filterFreq, mobileAudioContextRef.current.currentTime);
    mobileGainNodeRef.current.gain.value = config.volume;
    mobileOscillatorRef.current.connect(filter);
    filter.connect(mobileGainNodeRef.current);
    mobileOscillatorRef.current.start();
  };
  const stopMobileAmbientSound = () => {
    if (mobileOscillatorRef.current) {
      mobileOscillatorRef.current.stop();
      mobileOscillatorRef.current = null;
    }
  };
  const toggleMobileAudioMute = () => {
    setIsAudioMuted(!isAudioMuted);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        const randomSpeaker = speakers[Math.floor(Math.random() * speakers.length)];
        setCurrentSpeaker(randomSpeaker.id);
        setLastSpeaker(randomSpeaker.id);
        if (audioEnabled && !isAudioMuted) {
          playMobileAmbientSound(randomSpeaker.id);
        }
      } else {
        setCurrentSpeaker(null);
        stopMobileAmbientSound();
      }
    }, 2000 + Math.random() * 3000); 
    return () => clearInterval(interval);
    }, [audioEnabled, isAudioMuted]);
  useEffect(() => {
    if (currentSpeaker && audioEnabled && !isAudioMuted) {
      playMobileAmbientSound(currentSpeaker);
    } else {
      stopMobileAmbientSound();
    }
  }, [currentSpeaker, audioEnabled, isAudioMuted]);
  useEffect(() => {
    if (!isMobileTabVisible || !isMobileWindowFocused) {
      stopMobileAmbientSound();
    } else if (currentSpeaker && audioEnabled && !isAudioMuted) {
      playMobileAmbientSound(currentSpeaker);
    }
  }, [isMobileTabVisible, isMobileWindowFocused, currentSpeaker, audioEnabled, isAudioMuted]);
  useEffect(() => {
    return () => {
      stopMobileAmbientSound();
    };
  }, []);
  return (
    <div className="min-h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
      </div>
    <motion.div 
        className="relative z-10 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-blue-800/90 backdrop-blur-xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
        <div className="px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-shrink-0">
              <img
                src={show.image}
                alt={show.title}
                className="w-16 h-16 rounded-xl object-cover border-2 border-white/20 shadow-lg"
              />
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                 LIVE
               </div>
             </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-white mb-1 tracking-tight truncate">
               {show.title}
              </h1>
              <div className="flex items-center gap-3 text-white/70 text-sm mb-2">
                <div className="flex items-center gap-1">
                  <MdVisibility size={14} />
                  <span>{audienceMetrics.listeners}</span>
                </div>
                <div className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold">
                  {show.category}
                </div>
              </div>
              <div className="flex items-center gap-3 text-white/60 text-xs">
                <div className="flex items-center gap-1">
                  <MdAccessTime size={12} />
                  <span>Started 15 min ago</span>
                </div>
                <div className="flex items-center gap-1">
                  <MdPeople size={12} />
                  <span>{show.duration} min duration</span>
                </div>
              </div>
           </div>
         </div>
          <p className="text-white/80 text-sm leading-relaxed mb-4">
            {show.description}
          </p>
           </div>
      </motion.div>
      <div className="flex-1 relative z-10 p-3 pb-2">
        <div className="flex flex-col">
          <motion.div 
            className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-3 mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                Live Speakers
              </h2>
              <div className="text-gray-400 text-xs">
                {speakers.length} speakers
         </div>
      </div>
            <div className="space-y-2 p-1">
             {speakers.map((speaker) => {
               const isSpeaking = currentSpeaker === speaker.id;
               return (
                  <div 
                   key={speaker.id}
                    className={`relative flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 overflow-hidden ${
                     isSpeaking 
                        ? 'border-blue-500/60 bg-blue-500/15 shadow-lg shadow-blue-500/25' 
                        : 'border-gray-700/50 bg-gray-800/70'
                    }`}
                  >
                    {isSpeaking && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-purple-500/10 animate-pulse" />
                    )}
                    <div className="relative flex-shrink-0 z-10">
                     <img
                       src={speaker.avatar}
                       alt={speaker.name}
                        className={`w-11 h-11 rounded-full object-cover transition-all duration-300 ${
                          isSpeaking 
                            ? 'border-2 border-blue-500 shadow-lg shadow-blue-500/30 ring-2 ring-blue-500/20' 
                            : 'border-2 border-gray-600'
                        }`}
                      />
                     {isSpeaking && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-gray-900 animate-pulse" />
                     )}
                   </div>
                    <div className="flex-1 min-w-0 relative z-10">
                      <h3 className={`font-semibold mb-0.5 text-sm transition-colors duration-300 ${
                        isSpeaking ? 'text-blue-300' : 'text-white'
                      }`}>
                        {speaker.name}
                      </h3>
                      <p className="text-gray-400 text-xs">{speaker.role}</p>
                    </div>
                    <div className="flex items-center gap-0.5 h-4 min-w-[40px] flex-shrink-0 relative z-10">
                      {isSpeaking ? (
                        <div className="flex items-center gap-0.5">
                          {[0, 1, 2, 3, 4].map((i) => (
                           <div
                             key={i}
                             className={`w-0.5 bg-blue-400 rounded-full animate-audio-bars mobile-audio-bar-${i}`}
                           />
                         ))}
                       </div>
                      ) : (
                        <div className="text-gray-500 text-xs">Silent</div>
                     )}
                   </div>
                  </div>
               );
             })}
            </div>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 gap-2 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button 
              onClick={onOpenChat}
              className="flex items-center justify-center gap-2 p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-300 font-medium transition-colors cursor-pointer"
            >
              <MdChat size={16} />
              Open Chat
            </button>
            {!audioEnabled && (
              <button 
                onClick={handleEnableMobileAudioClick}
                className="flex items-center justify-center gap-2 p-3 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-300 font-medium transition-colors cursor-pointer"
              >
                <MdMic size={16} />
                Enable Audio
              </button>
            )}
            {audioEnabled && (
              <button 
                onClick={toggleMobileAudioMute}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-colors cursor-pointer ${
                  isAudioMuted 
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300' 
                    : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300'
                }`}
              >
                {isAudioMuted ? (
                  <>
                    <MdVolumeOff size={18} />
                    Unmute Audio
                  </>
                ) : (
                  <>
                    <MdVolumeUp size={18} />
                    Mute Audio
                  </>
                )}
              </button>
            )}
          </motion.div>
           </div>
         </div>
      <motion.div 
        className="relative z-10 bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/30 p-3 mt-4 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <MdAccessTime size={16} className="text-blue-400" />
          Session Info
        </h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-800/60 border border-gray-700/20">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-gray-300 text-xs">Status</span>
            </div>
            <span className="text-green-400 font-semibold text-xs">LIVE</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-800/60 border border-gray-700/20">
            <div className="flex items-center gap-1">
              <MdAccessTime size={12} className="text-blue-400" />
              <span className="text-gray-300 text-xs">Duration</span>
            </div>
            <span className="text-white font-semibold text-xs">{show.duration} min</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-800/60 border border-gray-700/20">
            <div className="flex items-center gap-1">
              <MdPeople size={12} className="text-purple-400" />
              <span className="text-gray-300 text-xs">Peak Viewers</span>
            </div>
            <span className="text-white font-semibold text-xs">312</span>
          </div>
          </div>
        <div className="border-t border-gray-700/30 pt-3 mb-4">
          <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Live Stats
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-800/40 rounded-lg p-2 border border-gray-700/30">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-gray-400 text-xs">Active Speakers</span>
            </div>
              <div className="text-white font-bold text-sm">
                {speakers.filter(s => currentSpeaker === s.id).length} / {speakers.length}
          </div>
        </div>
            <div className="bg-gray-800/40 rounded-lg p-2 border border-gray-700/30">
              <div className="flex items-center gap-1 mb-1">
                <MdAccessTime size={10} className="text-blue-400" />
                <span className="text-gray-400 text-xs">Time Remaining</span>
              </div>
              <div className="text-white font-bold text-sm">{timeRemaining}</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700/30 pt-3">
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <MdCalendarToday size={12} className="text-green-400" />
            Coming Up
          </h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-800/40 border border-gray-700/10">
              <div className="w-1 h-4 bg-green-500 rounded-full flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium text-xs">Q&A Session</div>
                <div className="text-gray-400 text-xs">In 10 minutes</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-800/40 border border-gray-700/10">
              <div className="w-1 h-4 bg-blue-500 rounded-full flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium text-xs">Expert Panel</div>
                <div className="text-gray-400 text-xs">In 25 minutes</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div 
        className="relative z-10 bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/30 px-3 py-3 mt-4 mb-1"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="font-medium">Live Audience Metrics</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center mb-1">
              <MdVisibility size={14} className="text-blue-400" />
            </div>
            <div className="text-lg font-bold text-white">
              {audienceMetrics.listeners.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 font-medium text-center">Listening Now</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center mb-1">
              <MdChat size={14} className="text-purple-400" />
            </div>
            <div className="text-lg font-bold text-white">
              {audienceMetrics.activeInChat}
            </div>
            <div className="text-xs text-gray-400 font-medium text-center">Engaging in Chat</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-lg bg-pink-500/20 flex items-center justify-center mb-1">
              <MdFavorite size={14} className="text-pink-400" />
            </div>
            <div className="text-lg font-bold text-white">
              {totalReactions}
            </div>
            <div className="text-xs text-gray-400 font-medium text-center">Total Reactions</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
const UpcomingShowCard: React.FC<{ show: Show }> = ({ show }) => {
  const handleSetReminder = () => {
    toast.custom(
      (t) => (
        <div className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-sm bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl rounded-2xl pointer-events-auto`}>
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <MdCheckCircle className="h-4 w-4 text-green-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">Reminder Set</span>
                  <MdEmail className="h-3.5 w-3.5 text-blue-400" />
                </div>
                <p className="text-xs text-gray-300 truncate">
                  You'll be notified before "{show.title}"
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: 3000,
      }
    );
  };
  return (
    <motion.div 
      className="group bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-600/30 overflow-hidden shadow-xl relative h-full flex flex-col"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -6, 
        scale: 1.02,
        boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.2)"
      }}
      whileTap={{ scale: 0.99 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        opacity: { duration: 0.4 },
        y: { duration: 0.4 }
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-purple-600/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative flex flex-col h-full">
        <div className="relative overflow-hidden h-48 flex-shrink-0">
          <div className="relative w-full h-full transition-transform duration-500 ease-out group-hover:scale-105">
        <img
          src={show.image}
          alt={show.title}
              className="w-full h-full object-cover"
        />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-900/40" />
          </div>
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/90 backdrop-blur-xl rounded-xl text-white text-xs font-bold border border-white/20 shadow-lg z-10">
          {show.duration}min
      </div>
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl text-white text-xs font-bold uppercase tracking-wider shadow-lg border border-white/10 z-10">
            {show.category}
          </div>
          <div className="absolute bottom-4 right-4 z-10">
          <CountdownTimer target={show.startTime} />
          </div>
        </div>
        <div className="p-6 relative flex flex-col flex-1">
          <h3 className="text-xl font-bold text-white mb-3 leading-tight tracking-tight group-hover:text-blue-400 transition-colors duration-200">
          {show.title}
        </h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
          {show.description}
        </p>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0" />
              <span className="text-gray-400 text-sm font-medium truncate">
          with {show.hosts.join(", ")}
              </span>
            </div>
            <motion.button
              onClick={handleSetReminder}
              className="px-4 py-2 bg-gradient-to-r from-blue-600/30 to-purple-700/30 hover:from-blue-600/40 hover:to-purple-700/40 border border-blue-500/40 rounded-lg text-blue-300 text-sm font-semibold transition-all duration-200 backdrop-blur-sm flex-shrink-0 ml-4 cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              Set Reminder
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
const UpcomingShowsGrid: React.FC<{ shows: Show[] }> = ({ shows }) => {
  return (
    <motion.div 
      className="mb-12 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-600/5 rounded-full blur-3xl -z-10" />
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-5xl font-bold text-white my-4 tracking-tight bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
        Upcoming Shows
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Don't miss these exciting upcoming podcast episodes
        </p>
      </motion.div>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {shows.map((show, index) => (
          <motion.div
            key={show.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.6 + index * 0.15,
              type: "spring",
              stiffness: 100
            }}
          >
            <UpcomingShowCard show={show} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
const ReactionButton: React.FC<{
  type: ReactionType;
  onReact: () => void;
}> = ({ type, onReact }) => {
  const [isPressed, setIsPressed] = useState(false);
  const getReactionConfig = (type: ReactionType) => {
    switch (type) {
      case 'like': return { emoji: '👍', color: '#065fd4' };
      case 'funny': return { emoji: '😂', color: '#ff6d01' };
      case 'love': return { emoji: '❤️', color: '#ff0000' };
      case 'fire': return { emoji: '🔥', color: '#ff6d01' };
    }
  };
  const config = getReactionConfig(type);
  const handleClick = () => {
    setIsPressed(true);
    onReact();
    setTimeout(() => setIsPressed(false), 300);
  };
  return (
    <motion.button
      onClick={handleClick}
      className={`flex items-center justify-center w-11 h-11 rounded-full border-none text-white text-xl cursor-pointer backdrop-blur-md transition-all duration-200 ${
        isPressed 
          ? 'bg-white/20 shadow-lg' 
          : 'bg-white/10 shadow-sm'
      }`}
      whileHover={{ 
        scale: 1.15, 
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        boxShadow: `0 0 15px ${config.color}30`
      }}
      whileTap={{ 
        scale: 0.9,
        backgroundColor: `${config.color}30`,
        boxShadow: `0 0 25px ${config.color}50`
      }}
      animate={{
        scale: isPressed ? 0.85 : 1,
        rotate: isPressed ? [0, -10, 10, 0] : 0
      }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17,
        rotate: { duration: 0.3 }
      }}
    >
      <motion.span
        animate={{ 
          scale: isPressed ? 1.2 : 1,
          y: isPressed ? -2 : 0
        }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
      >
        {config.emoji}
      </motion.span>
    </motion.button>
  );
};
const FloatingReactionComponent: React.FC<{ reaction: FloatingReaction }> = ({ reaction }) => {
  const getReactionConfig = (type: ReactionType) => {
    switch (type) {
      case 'like': return { emoji: '👍' };
      case 'funny': return { emoji: '😂' };
      case 'love': return { emoji: '❤️' };
      case 'fire': return { emoji: '🔥' };
    }
  };
  const config = getReactionConfig(reaction.type);
  return (
    <motion.div
      className="absolute text-4xl pointer-events-none z-50 select-none"
      style={{
        left: `${reaction.x}%`,
        bottom: `${reaction.y}%`,
      }}
      initial={{ 
        opacity: 0, 
        scale: 0.5, 
        y: 0, 
        rotate: -15 
      }}
      animate={{ 
        opacity: [0, 1, 1, 0], 
        scale: [0.5, 1.2, 1, 0.8], 
        y: [-120, -140, -160, -180], 
        rotate: [0, 5, -5, 0] 
      }}
      transition={{ 
        duration: 3, 
        ease: "easeOut",
        times: [0, 0.1, 0.8, 1]
      }}
    >
      {config.emoji}
    </motion.div>
  );
};
const LiveChat: React.FC<{
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onReact: (type: ReactionType) => void;
  floatingReactions: FloatingReaction[];
  audienceMetrics: {
    listeners: number;
    activeInChat: number;
  };
  typingUsers?: string[];
}> = ({ messages, onSendMessage, onReact, floatingReactions, audienceMetrics, typingUsers = [] }) => {
  const [input, setInput] = useState('');
  const [reactionsExpanded, setReactionsExpanded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (messagesRef.current) {
      const scrollContainer = messagesRef.current;
      const isNearBottom = scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 100;
      if (isNearBottom || messages.length === 1) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [messages.length, messages]);
  useEffect(() => {
    if (messagesRef.current && typingUsers.length > 0) {
      const scrollContainer = messagesRef.current;
      const isNearBottom = scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 100;
      if (isNearBottom) {
        setTimeout(() => {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [typingUsers.length]);
  useEffect(() => {
    const interval = setInterval(() => {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }, 10000); 
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
        setReactionsExpanded(false);
      }
    };
    if (reactionsExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [reactionsExpanded]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '';
      }
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  const isDesktop = useIsDesktop();
  return (
    <div
      ref={chatContainerRef}
      className={`bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl ${isDesktop ? 'rounded-3xl h-full' : 'h-full'} ${isDesktop ? 'border border-gray-600/50' : ''} flex flex-col overflow-hidden relative shadow-2xl`}
    >
      <div className="absolute inset-0 pointer-events-none z-50">
        {floatingReactions.map((reaction) => (
          <FloatingReactionComponent key={reaction.id} reaction={reaction} />
        ))}
      </div>
      {showNotification && (
        <motion.div
          className={`absolute ${isDesktop ? 'top-16 left-4 right-4' : 'top-2 left-3 right-3'} bg-blue-500/90 backdrop-blur-xl text-white px-4 py-3 rounded-xl shadow-lg z-40 border border-blue-400/50`}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-medium">
              Your questions will be answered soon! Keep them coming.
            </span>
          </div>
        </motion.div>
      )}
      {isDesktop && (
        <div className="px-6 py-4 border-b border-gray-600/50 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white m-0 tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Live Chat
          </h3>
            <div className="flex items-center gap-2 text-gray-400 text-sm backdrop-blur-sm bg-gray-800/50 px-3 py-1 rounded-lg">
              <MdChat size={14} />
              <span>{audienceMetrics.activeInChat} active</span>
            </div>
        </div>
      </div>
      )}
      <div
        ref={messagesRef}
        className={`flex-1 overflow-y-auto ${isDesktop ? 'p-4' : 'p-3'} ${isDesktop ? 'bg-gray-900' : 'bg-transparent'}`}
      >
        {messages.length === 0 ? (
          <div className="text-center py-8 px-4 text-gray-500">
            <MdChat size={32} className="mb-3 opacity-50 mx-auto" />
            <p className="text-base mb-1">No messages yet</p>
            <p className="text-xs">Be the first to start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <motion.div 
                key={message.id}
                className={`p-4 rounded-xl mb-3 shadow-sm max-w-full overflow-hidden ${
                  message.answered 
                    ? 'bg-blue-500/10 border border-blue-500/30' 
                    : 'bg-gray-800/60 border border-gray-700/30'
                }`}
                initial={{ opacity: 0, x: -30, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                whileHover={{ scale: 1.01, y: -1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 25,
                  duration: 0.3 
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white text-sm">
                    {message.user}
                  </span>
                  <div className="flex items-center gap-2">
                    {message.answered && (
                      <span className="text-blue-400 text-xs font-medium uppercase tracking-wider">
                        ✓ Answered
                      </span>
                    )}
                    <span className="text-gray-500 text-xs">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed m-0 break-words overflow-wrap-anywhere">
                  {message.content}
                </p>
              </motion.div>
            ))}
            {typingUsers.length > 0 && (
              <motion.div 
                className="p-3 rounded-xl mb-3 bg-gray-800/40 border border-gray-700/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                  <span className="text-gray-400 text-xs">
                    {typingUsers.length === 1 
                      ? `${typingUsers[0]} is typing...`
                      : `${typingUsers.length} people are typing...`
                    }
                  </span>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
      {reactionsExpanded && (
        <div className={`absolute ${isDesktop ? 'bottom-16 left-4 right-4' : 'bottom-14 left-3 right-3'} bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-2xl rounded-2xl p-3 px-4 flex gap-3 items-center justify-center shadow-2xl border border-purple-500/20 z-50 animate-popup-in`}>
          {(['like', 'funny', 'love', 'fire'] as ReactionType[]).map((type) => (
            <ReactionButton
              key={type}
              type={type}
              onReact={() => {
                onReact(type);
              }}
            />
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className={`${isDesktop ? 'px-6 py-2.5' : 'px-4 py-3'} ${isDesktop ? 'border-t border-gray-600/50 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl shadow-2xl' : 'border-t border-gray-700/50 bg-gray-900/80 backdrop-blur-xl'} flex-shrink-0`}>
        <div className="flex gap-3 items-start">
          <button
            type="button"
            onClick={() => setReactionsExpanded(!reactionsExpanded)}
            className={`flex items-center justify-center w-11 h-11 rounded-xl border-none cursor-pointer transition-all duration-200 backdrop-blur-md flex-shrink-0 ${
              reactionsExpanded 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            <MdFavorite 
              size={16}
              className={`transition-transform duration-300 ${reactionsExpanded ? 'rotate-180' : 'rotate-0'}`}
            />
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message"
            rows={1}
            className="flex-1 p-3 rounded-xl border border-gray-600/50 bg-gray-900/80 backdrop-blur-md text-white text-sm outline-none resize-none h-11 font-inherit leading-4 overflow-y-auto transition-all duration-200 focus:border-blue-500 focus:bg-gray-900/90"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (input.trim()) {
                  handleSubmit(e as any);
                }
              }
            }}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={`px-4 py-2 h-11 rounded-xl border-none text-sm font-medium cursor-pointer transition-all duration-200 whitespace-nowrap backdrop-blur-sm flex-shrink-0 ${
              input.trim() 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25' 
                : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
            }`}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
const HomePage: React.FC<{ onTabChange: (tab: TabType) => void }> = ({ onTabChange }) => {
  const isDesktop = useIsDesktop();
  const featuredShows = [
    {
      id: "featured-1",
      title: "Tech Innovators Weekly",
      host: "Sarah Chen",
      image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=400&h=400&fit=crop",
      listeners: "12.5K",
      category: "Technology",
      description: "Weekly deep dives with tech industry leaders"
    },
    {
      id: "featured-2", 
      title: "Creative Minds",
      host: "Alex Rodriguez",
      image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop",
      listeners: "8.2K",
      category: "Design",
      description: "Conversations with creative professionals"
    },
    {
      id: "featured-3",
      title: "Business Decoded",
      host: "Michael Park",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop",
      listeners: "15.1K", 
      category: "Business",
      description: "Startup stories and business insights"
    }
  ];
  return (
    <div className="relative">
      <section className={`relative ${isDesktop ? 'px-8 py-20' : 'px-6 py-16'} text-center overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-600/5 to-transparent backdrop-blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={`${isDesktop ? 'text-7xl mb-8' : 'text-4xl mb-6'} font-bold text-white leading-tight tracking-tight`}>
              Experience Live{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                Podcasts
              </span>
        </h1>
            <p className={`${isDesktop ? 'text-2xl mb-12 max-w-4xl' : 'text-lg mb-8 max-w-md'} text-gray-300 leading-relaxed mx-auto font-light`}>
              Join thousands of listeners for live podcast recordings. Interact with hosts, 
              ask questions, and be part of the conversation in real-time.
            </p>
            <div className={`flex ${isDesktop ? 'gap-6 justify-center' : 'flex-col gap-4'} items-center`}>
              <button 
                onClick={() => onTabChange('live')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-full text-white font-semibold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                Join Live Shows
              </button>
              <button 
                onClick={() => onTabChange('upcoming')}
                className="bg-gray-800/60 backdrop-blur-md hover:bg-gray-700/60 border border-gray-600/50 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                Browse Shows
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      <section className={`${isDesktop ? 'px-8 py-16' : 'px-6 py-12'} bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl border-y border-gray-700/30`}>
        <div className="max-w-6xl mx-auto">
          <div className={`grid ${isDesktop ? 'grid-cols-4' : 'grid-cols-2'} gap-8 text-center`}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className={`${isDesktop ? 'text-4xl' : 'text-3xl'} font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent`}>
                50K+
              </div>
              <div className="text-gray-400 font-medium">Daily Listeners</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className={`${isDesktop ? 'text-4xl' : 'text-3xl'} font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent`}>
                2.5K+
              </div>
              <div className="text-gray-400 font-medium">Live Shows</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className={`${isDesktop ? 'text-4xl' : 'text-3xl'} font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent`}>
                150+
              </div>
              <div className="text-gray-400 font-medium">Shows Available</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className={`${isDesktop ? 'text-4xl' : 'text-3xl'} font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent`}>
                24/7
              </div>
              <div className="text-gray-400 font-medium">Live Content</div>
            </motion.div>
          </div>
        </div>
      </section>
      <section className={`${isDesktop ? 'px-8 py-20' : 'px-6 py-16'}`}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className={`${isDesktop ? 'text-5xl' : 'text-3xl'} font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent`}>
              Popular Live Shows
            </h2>
            <p className={`${isDesktop ? 'text-xl' : 'text-lg'} text-gray-400 max-w-2xl mx-auto`}>
              Join the most engaging live podcast conversations
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {featuredShows.map((show, index) => (
              <motion.div
                key={show.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring", 
                  stiffness: 400, 
                  damping: 25
                }}
                className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl border border-gray-600/50 overflow-hidden shadow-xl group h-full flex flex-col"
              >
                <div className="relative h-48 flex-shrink-0 overflow-hidden">
                  <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-300 ease-out">
                    <img 
                      src={show.image} 
                      alt={show.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 rounded-full text-white text-xs font-semibold">
                    {show.category}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm font-medium">
                    {show.listeners} listeners
                  </div>
          </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{show.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">by {show.host}</p>
                  <p className="text-gray-300 text-sm leading-relaxed flex-1">{show.description}</p>
            </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className={`${isDesktop ? 'px-8 py-20' : 'px-6 py-16'} bg-gradient-to-br from-blue-500/10 to-purple-600/10 backdrop-blur-xl`}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={`${isDesktop ? 'text-5xl' : 'text-3xl'} font-bold text-white mb-6`}>
              Ready to Join the{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Conversation?
              </span>
            </h2>
            <p className={`${isDesktop ? 'text-xl' : 'text-lg'} text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed`}>
              Be part of live podcast recordings as they happen. Ask questions, react in real-time, 
              and connect with hosts and fellow listeners in an interactive experience.
            </p>
            <div className={`flex ${isDesktop ? 'gap-6 justify-center' : 'flex-col gap-4'} items-center`}>
                              <button 
                  onClick={() => onTabChange('about')}
                  className="text-blue-400 hover:text-blue-300 font-semibold text-lg transition-colors duration-300 flex items-center gap-2 cursor-pointer"
                >
                  Learn More 
                  <span className="text-sm">→</span>
                </button>
          </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
const AboutPage: React.FC = () => {
  const isDesktop = useIsDesktop();
  return (
    <div className={`max-w-4xl mx-auto ${isDesktop ? 'px-8 py-20' : 'px-6 py-16'} relative`}>
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-600/5 rounded-full blur-3xl -z-10" />
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className={`${isDesktop ? 'w-20 h-20' : 'w-16 h-16'} bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-500/20`}>
          <MdRadio size={isDesktop ? 32 : 24} color="white" />
            </div>
        <h1 className={`${isDesktop ? 'text-4xl' : 'text-3xl'} font-bold text-white mb-6 leading-tight`}>
          About AudioHub
        </h1>
                  <div className="max-w-2xl mx-auto space-y-6 text-gray-300 leading-relaxed">
            <p className={`${isDesktop ? 'text-lg' : 'text-base'}`}>
              AudioHub is your gateway to live podcast experiences. Join thousands of listeners as they engage 
              with their favorite shows in real-time, ask questions, and participate in interactive conversations 
              that shape the content as it happens.
            </p>
            <p className={`${isDesktop ? 'text-lg' : 'text-base'}`}>
              Experience podcasts like never before with live chat, real-time reactions, Q&A sessions, and 
              the ability to connect with both hosts and fellow listeners during live recordings.
            </p>
          </div>
        <div className={`mt-12 grid ${isDesktop ? 'grid-cols-3' : 'grid-cols-1'} gap-8 max-w-3xl mx-auto`}>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MdRadio size={24} className="text-blue-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Live Listening</h3>
            <p className="text-gray-400 text-sm">Join live podcast recordings in real-time</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MdChat size={24} className="text-purple-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Interactive Chat</h3>
            <p className="text-gray-400 text-sm">Chat with hosts and fellow listeners</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MdVisibility size={24} className="text-green-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Live Metrics</h3>
            <p className="text-gray-400 text-sm">See real-time listener engagement</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
const Footer: React.FC = () => {
  const isDesktop = useIsDesktop();
  return (
    <footer className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border-t border-gray-700/50">
      <div className={`max-w-7xl mx-auto ${isDesktop ? 'px-8 py-8' : 'px-6 py-10 pb-28'}`}>
        <div className={`grid ${isDesktop ? 'grid-cols-12 gap-8' : 'grid-cols-1 gap-10'}`}>
          <div className={`${isDesktop ? 'col-span-5' : 'text-center'}`}>
            <div className={`flex items-center gap-3 mb-6 ${!isDesktop ? 'justify-center' : ''}`}>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <MdRadio size={24} color="white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white m-0 tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  AudioHub
            </h3>
                <p className="text-sm text-gray-500 m-0 font-medium">
                  Professional Podcast Platform
            </p>
          </div>
        </div>
            <p className={`text-gray-300 leading-relaxed mb-8 ${isDesktop ? 'text-base max-w-md' : 'text-sm'}`}>
              Join live podcast recordings as they happen. Engage with hosts, ask questions, and be part of interactive conversations with fellow listeners.
            </p>
            <div className={`flex gap-3 ${!isDesktop ? 'justify-center' : ''}`}>
              <a href="#" className="w-11 h-11 bg-gray-800/60 backdrop-blur-md hover:bg-blue-500/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                <span className="text-gray-400 group-hover:text-blue-400 text-sm font-bold">X</span>
              </a>
              <a href="#" className="w-11 h-11 bg-gray-800/60 backdrop-blur-md hover:bg-blue-500/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                <span className="text-gray-400 group-hover:text-blue-400 text-sm font-bold">F</span>
              </a>
              <a href="#" className="w-11 h-11 bg-gray-800/60 backdrop-blur-md hover:bg-blue-500/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                <span className="text-gray-400 group-hover:text-blue-400 text-sm font-bold">L</span>
              </a>
              <a href="#" className="w-11 h-11 bg-gray-800/60 backdrop-blur-md hover:bg-blue-500/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                <span className="text-gray-400 group-hover:text-blue-400 text-sm font-bold">Y</span>
              </a>
      </div>
    </div>
          <div className={`${isDesktop ? 'col-span-7 grid grid-cols-3 gap-6' : 'grid grid-cols-1 gap-8'}`}>
            <div>
              <h4 className="text-white font-semibold mb-5 text-base">Features</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm block">Live Shows</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm block">Interactive Chat</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm block">Real-time Reactions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm block">Q&A Sessions</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-5 text-base">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm block">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm block">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm block">Guidelines</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm block">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-5 text-base">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm block">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm block">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm block">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm block">Careers</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className={`mt-12 pt-6 border-t border-gray-700/30 text-center`}>
          <div className="text-gray-500 text-sm">
            2024 AudioHub. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
const PodcastAudioHub: React.FC = () => {
  const isDesktop = useIsDesktop();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const handleTabChange = (newTab: TabType) => {
    if (activeTab === 'live' && newTab !== 'live') {
      if(audioEnabled && !isAudioMuted) {
        toast.custom(
          (t) => (
            <div className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-sm bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl rounded-2xl pointer-events-auto`}>
              <div className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <MdRadio className="h-4 w-4 text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">Audio Paused</span>
                    </div>
                    <p className="text-xs text-gray-300">
                      Return to the Live tab to resume listening.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ),
          {
            duration: 4000,
          }
        );
      }
      setIsAudioMuted(true);
    }
    setActiveTab(newTab);
  };
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      user: "Emma Thompson",
      content: "Great discussion on AI ethics! Will this be recorded?",
      timestamp: new Date(Date.now() - 600000),
    },
    {
      id: "2",
      user: "Alex Chen",
      content: "What's your take on the latest React developments?",
      timestamp: new Date(Date.now() - 480000),
    },
    {
      id: "3",
      user: "Jordan Smith",
      content: "Thanks for the system design insights! Very helpful.",
      timestamp: new Date(Date.now() - 420000),
      answered: true,
    },
    {
      id: "4",
      user: "Sarah Kim",
      content: "Can you explain the difference between microservices and monoliths?",
      timestamp: new Date(Date.now() - 360000),
    },
    {
      id: "5",
      user: "Mike Rodriguez",
      content: "Love the real-world examples you're sharing!",
      timestamp: new Date(Date.now() - 300000),
      answered: true,
    },
    {
      id: "6",
      user: "Lisa Wang",
      content: "How do you handle state management in large React apps?",
      timestamp: new Date(Date.now() - 240000),
    },
    {
      id: "7",
      user: "David Park",
      content: "This is exactly what I needed to learn. Thank you!",
      timestamp: new Date(Date.now() - 180000),
    },
    {
      id: "8",
      user: "Maria Garcia",
      content: "Could you share some resources for learning system design?",
      timestamp: new Date(Date.now() - 120000),
    },
    {
      id: "9",
      user: "James Wilson",
      content: "The scalability discussion is fascinating. More please!",
      timestamp: new Date(Date.now() - 90000),
      answered: true,
    },
    {
      id: "10",
      user: "Anna Chen",
      content: "What tools do you recommend for monitoring distributed systems?",
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const [reactionCount, setReactionCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [audienceMetrics, setAudienceMetrics] = useState({
    listeners: 247,
    activeInChat: 18,
  });
  const [platformMetrics, setPlatformMetrics] = useState({
    totalListeners: 1247, 
  });
  const [timeRemaining, setTimeRemaining] = useState('105 min');
  useEffect(() => {
    const startTime = Date.now();
    const initialMinutes = 105;
    const updateRemainingTime = () => {
      const elapsed = Math.floor((Date.now() - startTime) / (1000 * 30));
      const remaining = Math.max(0, initialMinutes - elapsed);
      if (remaining <= 0) {
        setTimeRemaining('Session Ended');
      } else {
        setTimeRemaining(`${remaining} min`);
      }
    };
    updateRemainingTime();
    const timeInterval = setInterval(updateRemainingTime, 30000);
    return () => clearInterval(timeInterval);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setFloatingReactions(prev => prev.filter(reaction => now - reaction.timestamp < 3000));
    }, 100);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setAudienceMetrics(prev => ({
        listeners: Math.max(200, prev.listeners + Math.floor(Math.random() * 20 - 10)),
        activeInChat: Math.max(10, prev.activeInChat + Math.floor(Math.random() * 6 - 3)),
      }));
      setAudienceMetrics(currentAudience => {
        setPlatformMetrics(prev => ({
          totalListeners: Math.max(currentAudience.listeners + 800, prev.totalListeners + Math.floor(Math.random() * 30 - 15)),
        }));
        return currentAudience;
      });
    }, 5000);
    const messageTimer = setInterval(() => {
      if (Math.random() > 0.6) { 
        const randomMessage = dummyMessages[Math.floor(Math.random() * dummyMessages.length)];
        const newMessage: ChatMessage = {
          id: Math.random().toString(36).substr(2, 9),
          user: randomMessage.user,
          content: randomMessage.content,
          timestamp: new Date(),
          answered: Math.random() > 0.8 
        };
        setMessages(prev => [...prev, newMessage]);
      }
    }, 8000 + Math.random() * 12000); 
    const answerTimer = setInterval(() => {
      setMessages(prev => prev.map(msg => {
        const messageAge = Date.now() - msg.timestamp.getTime();
        if (!msg.answered && messageAge >= 5000 && messageAge <= 6000 && Math.random() > 0.3) {
          return { ...msg, answered: true };
        }
        return msg;
      }));
    }, 1000); 
    const reactionTimer = setInterval(() => {
      if (Math.random() > 0.7) { 
        const types: ReactionType[] = ['like', 'funny', 'love', 'fire'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        handleReact(randomType);
      }
    }, 3000 + Math.random() * 4000);
    const typingTimer = setInterval(() => {
      if (Math.random() > 0.8) { 
        const typingUser = dummyMessages[Math.floor(Math.random() * dummyMessages.length)].user;
        setTypingUsers(prev => {
          if (!prev.includes(typingUser)) {
            return [...prev, typingUser];
          }
          return prev;
        });
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(user => user !== typingUser));
        }, 2000 + Math.random() * 3000);
      }
    }, 5000 + Math.random() * 10000);
    return () => {
      clearInterval(interval);
      clearInterval(messageTimer);
      clearInterval(answerTimer);
      clearInterval(reactionTimer);
      clearInterval(typingTimer);
    };
  }, []);
  const handleSendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      user: "You", 
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };
  const handleReact = (type: ReactionType) => {
    const newReaction: FloatingReaction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x: Math.random() * 80 + 10, 
      y: Math.random() * 20 + 5,  
      timestamp: Date.now(),
    };
    setFloatingReactions(prev => [...prev, newReaction]);
    setReactionCount(prev => prev + 1);
  };
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <HomePage onTabChange={handleTabChange} />
          </motion.main>
        );
      case 'live':
        if (isDesktop) {
          return (
            <motion.main 
              className="max-w-[1600px] mx-auto p-4 lg:p-6 flex gap-4 lg:gap-6 flex-row h-[calc(100vh-80px)] overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
                <div className="h-full overflow-hidden">
                  <LiveStage 
                    show={currentLiveShow} 
                    audienceMetrics={audienceMetrics}
                    totalReactions={reactionCount}
                    timeRemaining={timeRemaining}
                    onOpenMobileChat={() => setIsMobileChatOpen(true)}
                    audioEnabled={audioEnabled}
                    setAudioEnabled={setAudioEnabled}
                    isAudioMuted={isAudioMuted}
                    setIsAudioMuted={setIsAudioMuted}
                  />
                </div>
              </div>
              <div className="w-[350px] lg:w-[400px] flex-shrink-0 h-full overflow-hidden">
                <LiveChat
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onReact={handleReact}
                  floatingReactions={floatingReactions}
                  audienceMetrics={audienceMetrics}
                  typingUsers={typingUsers}
                />
              </div>
            </motion.main>
          );
        }
        return (
          <>
          <motion.div 
              className="min-h-[calc(100vh-120px)] mobile-container overflow-y-auto pb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
              <MobileLiveStage 
                show={currentLiveShow} 
                audienceMetrics={audienceMetrics}
                totalReactions={reactionCount}
                timeRemaining={timeRemaining}
                onOpenChat={() => setIsMobileChatOpen(true)}
                audioEnabled={audioEnabled}
                setAudioEnabled={setAudioEnabled}
                isAudioMuted={isAudioMuted}
                setIsAudioMuted={setIsAudioMuted}
              />
            </motion.div>
            <MobileChatDrawer
              isOpen={isMobileChatOpen}
              onClose={() => setIsMobileChatOpen(false)}
                messages={messages}
                onSendMessage={handleSendMessage}
                onReact={handleReact}
                floatingReactions={floatingReactions}
                audienceMetrics={audienceMetrics}
              typingUsers={typingUsers}
              />
          </>
        );
      case 'upcoming':
        return (
          <motion.main 
            className={`max-w-[1400px] mx-auto ${isDesktop ? 'p-8' : 'p-4'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <UpcomingShowsGrid shows={upcomingShows} />
          </motion.main>
        );
      case 'about':
        return (
          <motion.main 
            className={`${isDesktop ? '' : 'pt-4 pb-8'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <AboutPage />
          </motion.main>
        );
      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden flex flex-col box-border m-0 p-0 antialiased overflow-x-hidden selection:bg-blue-500/30 selection:text-white">
      <Toaster 
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName="!top-5 !right-5"
      />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-purple-600/5 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} platformMetrics={platformMetrics} />
        <div className={`flex-1`}>
        {renderContent()}
      </div>
        {(isDesktop || activeTab !== 'live') && <Footer />}
      </div>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
          * {
            scrollbar-width: none;
            -ms-overflow-style: none;
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          *::-webkit-scrollbar {
            display: none;
          }
          html, body {
            scrollbar-width: none;
            -ms-overflow-style: none;
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          html::-webkit-scrollbar,
          body::-webkit-scrollbar {
            display: none;
          }
          @keyframes animate-audio-bars {
            0%, 100% { 
              transform: scaleY(0.7); 
              opacity: 0.8; 
            }
            50% { 
              transform: scaleY(1.2); 
              opacity: 1; 
            }
          }
          .animate-audio-bars {
            animation: animate-audio-bars 0.6s ease-in-out infinite;
            transform-origin: bottom;
          }
          .audio-bar-0 {
            height: 8px;
            animation-delay: 0s;
          }
          .audio-bar-1 {
            height: 12px;
            animation-delay: 0.1s;
            }
          .audio-bar-2 {
            height: 10px;
            animation-delay: 0.2s;
            }
          .audio-bar-3 {
            height: 14px;
            animation-delay: 0.3s;
          }
          .audio-bar-4 {
            height: 11px;
            animation-delay: 0.4s;
          }
          .audio-bar-5 {
            height: 9px;
            animation-delay: 0.5s;
          }
          .mobile-audio-bar-0 {
            height: 6px;
            animation-delay: 0s;
          }
          .mobile-audio-bar-1 {
            height: 9px;
            animation-delay: 0.1s;
            }
          .mobile-audio-bar-2 {
            height: 7px;
            animation-delay: 0.2s;
          }
          .mobile-audio-bar-3 {
            height: 10px;
            animation-delay: 0.3s;
          }
          .mobile-audio-bar-4 {
            height: 8px;
            animation-delay: 0.4s;
          }
          @keyframes animate-enter {
            0% {
              transform: translate3d(100%, 0, 0) scale(0.95);
              opacity: 0;
            }
            100% {
              transform: translate3d(0, 0, 0) scale(1);
              opacity: 1;
            }
          }
          @keyframes animate-leave {
            0% {
              transform: translate3d(0, 0, 0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate3d(100%, 0, 0) scale(0.95);
              opacity: 0;
            }
          }
          .animate-enter {
            animation: animate-enter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-leave {
            animation: animate-leave 0.2s cubic-bezier(0.4, 0, 1, 1) forwards;
          }
        `}
      </style>
    </div>
  );
};
export default PodcastAudioHub;