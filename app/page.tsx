"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSun, FiMoon, FiBell, FiBarChart2,
  FiClock, FiStar, FiSettings, FiRefreshCw,
  FiChevronUp, FiChevronDown, FiActivity,
  FiAlertCircle
} from "react-icons/fi";
import {
  GiSoccerBall, GiBasket, GiTennisBall,
  GiBaseballBat, GiHockey
} from "react-icons/gi";

// Types for our data
type Sport = 'soccer' | 'basketball' | 'tennis' | 'baseball' | 'hockey';

type Team = {
  id: string;
  name: string;
  logo: string;
  score: number;
  isFav: boolean; // Track if this team is a favorite
  showAlert: boolean; // Flag to show alert for this team
  lastAlertShownAt: number; // Timestamp of last alert
};

type Player = {
  id: string;
  name: string;
  team: string;
  stats: string;
};

type LiveMatch = {
  id: string;
  sport: Sport;
  homeTeam: Team;
  awayTeam: Team;
  time: string;
  timeSeconds?: number; // Add countdown in seconds
  status: 'upcoming' | 'live' | 'finished';
  period: string;
  commentary: string[];
};

type TickerUpdate = {
  id: string;
  text: string;
  time: string;
  type: 'score' | 'event' | 'news';
};

type Alert = {
  id: string;
  teamId: string;
  message: string;
  read: boolean;
  timestamp: number; // Add timestamp to ensure uniqueness
};

type AlertData = {
  teamId: string;
  teamName: string;
  newScore: number;
  message: string;
} | null;

// Mock Data
const mockSports: Sport[] = ['soccer', 'basketball', 'tennis', 'baseball', 'hockey'];

// Team logos - more reliable image sources
const teamLogos = {
  barcelona: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iIzA1MjM4OCIgLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iI2EwMDAzMyIgLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNSIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QkFSQ0E8L3RleHQ+PC9zdmc+',
  realMadrid: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjY2NjIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzAwNjZiMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TUFEUklEPC90ZXh0Pjwvc3ZnPg==',
  lakers: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iIzU1MmQ4ZiIgLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzNSIgZmlsbD0iI2ZkYjkyNyIgLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TEFLRVJTPC90ZXh0Pjwvc3ZnPg==',
  warriors: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iIzFkNDI4YSIgLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzNSIgZmlsbD0iI2ZmYzUyZCIgLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+V0FSUklPUlM8L3RleHQ+PC9zdmc+',
  djokovic: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iI2QyMTAzNCIgLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzNSIgZmlsbD0iI2ZmZiIgLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIyNSIgZmlsbD0iIzE4NDFhMSIgLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U1JCPC90ZXh0Pjwvc3ZnPg==',
  nadal: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iI2YxYzkwMCIgLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzNSIgZmlsbD0iI2ZmMDAwMCIgLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U1BBSU48L3RleHQ+PC9zdmc+',
  yankees: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMTgzMzVhIiBzdHJva2Utd2lkdGg9IjMiLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzE4MzM1YSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tlk8L3RleHQ+PC9zdmc+',
  redSox: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iI2JkMmIzMSIgLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UkVEIFNPWDwvdGV4dD48L3N2Zz4=',
  bruins: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iIzAwMDAwMCIgLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzNSIgZmlsbD0iI2ZkYjUxNSIgLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QlJVSU5TPC90ZXh0Pjwvc3ZnPg==',
  mapleLeafs: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iIzIzNTc4NyIgLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzNSIgZmlsbD0iI2ZmZmZmZiIgLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzIzNTc4NyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VE9ST05UTzwvdGV4dD48L3N2Zz4='
};

const mockLiveMatches: LiveMatch[] = [
  {
    id: '1',
    sport: 'soccer',
    homeTeam: { id: 't1', name: 'Barcelona', logo: teamLogos.barcelona, score: 2, isFav: false, showAlert: false, lastAlertShownAt: 0 },
    awayTeam: { id: 't2', name: 'Real Madrid', logo: teamLogos.realMadrid, score: 1, isFav: false, showAlert: false, lastAlertShownAt: 0 },
    time: '75:00',
    timeSeconds: 15 * 60, // 15 minutes left in the game
    status: 'live',
    period: '2nd Half',
    commentary: [
      'Messi with a brilliant run!',
      'Goal! Barcelona scores again!',
      'Yellow card for Ramos after a hard tackle'
    ]
  },
  {
    id: '2',
    sport: 'basketball',
    homeTeam: { id: 't3', name: 'Lakers', logo: teamLogos.lakers, score: 87, isFav: false, showAlert: false, lastAlertShownAt: 0 },
    awayTeam: { id: 't4', name: 'Warriors', logo: teamLogos.warriors, score: 92, isFav: false, showAlert: false, lastAlertShownAt: 0 },
    time: '3rd',
    timeSeconds: 10 * 60, // 10 minutes left
    status: 'live',
    period: 'Q3 - 4:35',
    commentary: [
      'Curry with a deep three!',
      'James with the dunk!',
      'Warriors on a 10-0 run'
    ]
  },
  {
    id: '3',
    sport: 'tennis',
    homeTeam: { id: 't5', name: 'Djokovic', logo: teamLogos.djokovic, score: 2, isFav: false, showAlert: false, lastAlertShownAt: 0 },
    awayTeam: { id: 't6', name: 'Nadal', logo: teamLogos.nadal, score: 1, isFav: false, showAlert: false, lastAlertShownAt: 0 },
    time: '3rd Set',
    timeSeconds: 20 * 60, // 20 minutes left
    status: 'live',
    period: '3-2 (40-15)',
    commentary: [
      'Ace by Djokovic!',
      'Great backhand down the line by Nadal',
      'Break point for Djokovic'
    ]
  },
  {
    id: '4',
    sport: 'baseball',
    homeTeam: { id: 't7', name: 'Yankees', logo: teamLogos.yankees, score: 5, isFav: false, showAlert: false, lastAlertShownAt: 0 },
    awayTeam: { id: 't8', name: 'Red Sox', logo: teamLogos.redSox, score: 3, isFav: false, showAlert: false, lastAlertShownAt: 0 },
    time: '7th Inning',
    timeSeconds: 25 * 60, // 25 minutes left
    status: 'live',
    period: 'Bottom 7th',
    commentary: [
      'Home run by Judge!',
      'Strikeout by Cole',
      'Yankees looking strong in the 7th'
    ]
  },
  {
    id: '5',
    sport: 'hockey',
    homeTeam: { id: 't9', name: 'Bruins', logo: teamLogos.bruins, score: 2, isFav: false, showAlert: false, lastAlertShownAt: 0 },
    awayTeam: { id: 't10', name: 'Maple Leafs', logo: teamLogos.mapleLeafs, score: 2, isFav: false, showAlert: false, lastAlertShownAt: 0 },
    time: '2nd Period',
    timeSeconds: 12 * 60, // 12 minutes left
    status: 'live',
    period: '15:23 remaining',
    commentary: [
      'Great save by the goalie!',
      'Power play coming up for the Bruins',
      'Tied game in the second period'
    ]
  },
];

const mockTickerUpdates: TickerUpdate[] = [
  { id: 'u1', text: 'GOAL! Barcelona 2-1 Real Madrid', time: '2m ago', type: 'score' },
  { id: 'u2', text: 'Warriors on a 10-0 run against Lakers', time: '4m ago', type: 'event' },
  { id: 'u3', text: 'Djokovic breaks Nadal in the 3rd set', time: '5m ago', type: 'score' },
  { id: 'u4', text: 'Home run by Judge puts Yankees up 5-3', time: '8m ago', type: 'score' },
  { id: 'u5', text: 'Breaking: Star player traded to championship contender', time: '15m ago', type: 'news' },
  { id: 'u6', text: 'GOAL! Man City 3-0 Arsenal', time: '18m ago', type: 'score' },
  { id: 'u7', text: 'Celtics defeat Bucks in overtime thriller', time: '45m ago', type: 'score' },
  { id: 'u8', text: 'NFL announces new playoff format for next season', time: '1h ago', type: 'news' },
];

const mockPlayers: Player[] = [
  { id: 'p1', name: 'Lionel Messi', team: 'Barcelona', stats: '1 goal, 1 assist' },
  { id: 'p2', name: 'Stephen Curry', team: 'Warriors', stats: '28 pts, 6 rebounds, 8 assists' },
  { id: 'p3', name: 'Novak Djokovic', team: 'Serbia', stats: '12 aces, 85% first serves' },
  { id: 'p4', name: 'Aaron Judge', team: 'Yankees', stats: '2-3, HR, 3 RBIs' },
  { id: 'p5', name: 'Brad Marchand', team: 'Bruins', stats: '1 goal, 5 shots' },
];

export default function Home() {
  // States
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>(mockLiveMatches);
  const [tickerUpdates, setTickerUpdates] = useState<TickerUpdate[]>(mockTickerUpdates);
  const [selectedSport, setSelectedSport] = useState<Sport | 'all'>('all');
  const [favoriteTeams, setFavoriteTeams] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertTeam, setAlertTeam] = useState<Team | null>(null);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState<boolean>(false);
  const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scoreUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const alertsDropdownRef = useRef<HTMLDivElement | null>(null);

  // Initialize theme from localStorage when component mounts
  useEffect(() => {
    const savedTheme = localStorage.getItem("sports-dashboard-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }

    // Load favorites
    const savedFavorites = localStorage.getItem("sports-dashboard-favorites");
    if (savedFavorites) {
      const favIds = JSON.parse(savedFavorites);
      setFavoriteTeams(favIds);

      // Mark teams as favorites in the live matches
      setLiveMatches(prev => {
        return prev.map(match => {
          return {
            ...match,
            homeTeam: {
              ...match.homeTeam,
              isFav: favIds.includes(match.homeTeam.id)
            },
            awayTeam: {
              ...match.awayTeam,
              isFav: favIds.includes(match.awayTeam.id)
            }
          };
        });
      });
    }
  }, []);

  // Set up automatic score updates
  useEffect(() => {
    // Start automatic score updates every 15 seconds
    scoreUpdateIntervalRef.current = setInterval(() => {
      updateRandomScore();
    }, 5000);

    // Clean up interval on unmount
    return () => {
      if (scoreUpdateIntervalRef.current) {
        clearInterval(scoreUpdateIntervalRef.current);
      }
    };
  }, []);

  // Timer update effect - update match times every second
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setLiveMatches(prevMatches => {
        return prevMatches.map(match => {
          // Only update live matches with timeSeconds property
          if (match.status === 'live' && match.timeSeconds !== undefined) {
            // Decrement time by 1 second
            const newTimeSeconds = Math.max(0, match.timeSeconds - 1);

            // Calculate minutes and seconds for display
            const minutes = Math.floor(newTimeSeconds / 60);
            const seconds = newTimeSeconds % 60;

            // Format the time string (e.g., "14:59")
            const timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            // If we reach 0, mark the match as finished
            const newStatus = newTimeSeconds === 0 ? 'finished' : 'live';

            return {
              ...match,
              timeSeconds: newTimeSeconds,
              time: timeString,
              status: newStatus
            };
          }
          return match;
        });
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  // Handle clicking outside alerts dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (alertsDropdownRef.current && !alertsDropdownRef.current.contains(event.target as Node)) {
        setShowAlertsDropdown(false);
      }
    };

    if (showAlertsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAlertsDropdown]);

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem("sports-dashboard-theme", theme);

    // Apply theme to body
    if (theme === "dark") {
      document.body.classList.add("bg-gray-900", "text-white");
      document.body.classList.remove("bg-gray-50", "text-gray-900");
    } else {
      document.body.classList.add("bg-gray-50", "text-gray-900");
      document.body.classList.remove("bg-gray-900", "text-white");
    }
  }, [theme]);

  // Save favorites
  useEffect(() => {
    localStorage.setItem("sports-dashboard-favorites", JSON.stringify(favoriteTeams));

    // Update isFav property on all teams
    setLiveMatches(prev => {
      return prev.map(match => {
        return {
          ...match,
          homeTeam: {
            ...match.homeTeam,
            isFav: favoriteTeams.includes(match.homeTeam.id)
          },
          awayTeam: {
            ...match.awayTeam,
            isFav: favoriteTeams.includes(match.awayTeam.id)
          }
        };
      });
    });
  }, [favoriteTeams]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Toggle favorite team - update both favoriteTeams array and team isFav property
  const toggleFavorite = (teamId: string) => {
    setFavoriteTeams(prev =>
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId) // Remove if exists
        : [...prev, teamId] // Add if doesn't exist
    );

    // If adding to favorites, immediately test a score for this team
    if (!favoriteTeams.includes(teamId)) {
      setTimeout(() => testScoreForTeam(teamId), 1000);
    }
  };

  // Dismiss currently shown alert
  const dismissAlert = () => {
    console.log("Dismissing alert");

    // Clear any pending timeouts
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
      alertTimeoutRef.current = null;
    }

    if (alertTeam) {
      // Reset the showAlert flag on the team that was showing an alert
      setLiveMatches(prev => {
        return prev.map(match => {
          if (match.homeTeam.id === alertTeam.id) {
            return {
              ...match,
              homeTeam: {
                ...match.homeTeam,
                showAlert: false
              }
            };
          } else if (match.awayTeam.id === alertTeam.id) {
            return {
              ...match,
              awayTeam: {
                ...match.awayTeam,
                showAlert: false
              }
            };
          }
          return match;
        });
      });
    }

    // Clear the current alert team
    setAlertTeam(null);
  };

  // Add alert for a team
  const addAlert = (teamId: string, message: string) => {
    // Check if a similar alert already exists (same team and message within last 5 seconds)
    const now = Date.now();
    const existingAlert = alerts.find(alert => 
      alert.teamId === teamId && 
      alert.message === message && 
      (now - alert.timestamp) < 5000 // Within 5 seconds
    );

    // Don't add duplicate alerts
    if (existingAlert) {
      console.log("Duplicate alert prevented:", message);
      return;
    }

    const newAlert: Alert = {
      id: `${teamId}-${now}-${Math.random().toString(36).substr(2, 9)}`, // More unique ID
      teamId,
      message,
      read: false,
      timestamp: now
    };
    
    console.log("Adding new alert:", newAlert);
    setAlerts(prev => [newAlert, ...prev]);
  };

  // Function to update a random match score - using team properties
  const updateRandomScore = () => {
    console.log("Updating random score...");
    setLiveMatches(prevMatches => {
      // Get only the live matches
      const liveMatches = prevMatches.filter(match => match.status === 'live');
      if (liveMatches.length === 0) return prevMatches;

      // Pick a random live match
      const matchIndex = Math.floor(Math.random() * liveMatches.length);
      const match = { ...liveMatches[matchIndex] };

      // Deep copy the teams
      const homeTeam = { ...match.homeTeam };
      const awayTeam = { ...match.awayTeam };

      // Decide which team scores
      const isHome = Math.random() > 0.4;
      const scoringTeam = isHome ? homeTeam : awayTeam;

      // Update the score
      if (isHome) {
        homeTeam.score += 1;
      } else {
        awayTeam.score += 1;
      }

      console.log(`Team ${scoringTeam.name} scored! New score: ${homeTeam.score}-${awayTeam.score}`);

      // If scoring team is a favorite, set showAlert flag and update lastAlertShownAt
      if (scoringTeam.isFav) {
        console.log(`Favorite team ${scoringTeam.name} scored! Setting showAlert=true`);
        
        // Check if we recently showed an alert for this team (within last 3 seconds)
        const now = Date.now();
        if (now - scoringTeam.lastAlertShownAt < 3000) {
          console.log("Alert recently shown for this team, skipping...");
          // Still update the score but skip the alert
          match.homeTeam = homeTeam;
          match.awayTeam = awayTeam;
          match.commentary = [
            `${scoringTeam.name} SCORES! The crowd goes wild!`,
            ...match.commentary.slice(0, 2)
          ];
          const updatedMatches = prevMatches.map(m =>
            m.id === match.id ? match : m
          );
          return updatedMatches;
        }
        
        scoringTeam.showAlert = true;
        scoringTeam.lastAlertShownAt = now;

        // Add to alerts list
        const alertMessage = `GOAL! ${scoringTeam.name} has scored! New score: ${homeTeam.name} ${homeTeam.score} - ${awayTeam.score} ${match.awayTeam.name}`;
        addAlert(scoringTeam.id, alertMessage);

        // Dismiss any current alert first
        dismissAlert();

        // Schedule showing this team's alert
        setTimeout(() => {
          // Set this team as the current alert team
          setAlertTeam(scoringTeam);

          // Set auto-dismiss timer
          alertTimeoutRef.current = setTimeout(dismissAlert, 5000);
        }, 100);
      }

      // Update the teams in the match
      match.homeTeam = homeTeam;
      match.awayTeam = awayTeam;

      // Add commentary
      match.commentary = [
        `${scoringTeam.name} SCORES! The crowd goes wild!`,
        ...match.commentary.slice(0, 2)
      ];

      // Create new matches array with the updated match
      const updatedMatches = prevMatches.map(m =>
        m.id === match.id ? match : m
      );

      // Add ticker update for ALL score changes
      const newUpdate = {
        id: Date.now().toString(),
        text: `GOAL! ${match.homeTeam.name} ${match.homeTeam.score} - ${match.awayTeam.score} ${match.awayTeam.name}`,
        time: 'Just now',
        type: 'score' as const
      };
      setTickerUpdates(prev => [newUpdate, ...prev.slice(0, 7)]);

      return updatedMatches;
    });
  };

  // Helper to test scoring for a specific team
  const testScoreForTeam = (teamId: string) => {
    setLiveMatches(prev => {
      // Find the match with this team
      const matchWithTeam = prev.find(
        match => match.homeTeam.id === teamId || match.awayTeam.id === teamId
      );

      if (!matchWithTeam) {
        console.log(`No match found with team ${teamId}`);
        return prev;
      }

      const match = { ...matchWithTeam };
      const isHome = match.homeTeam.id === teamId;

      // Deep copy the teams
      const homeTeam = { ...match.homeTeam };
      const awayTeam = { ...match.awayTeam };

      // Update score for the specified team
      if (isHome) {
        homeTeam.score += 1;
        // Set alert flag
        homeTeam.showAlert = true;
        homeTeam.lastAlertShownAt = Date.now();

        console.log(`TEST: ${homeTeam.name} scored! Setting showAlert=true`);
      } else {
        awayTeam.score += 1;
        // Set alert flag
        awayTeam.showAlert = true;
        awayTeam.lastAlertShownAt = Date.now();

        console.log(`TEST: ${awayTeam.name} scored! Setting showAlert=true`);
      }

      // Get scoring team reference
      const scoringTeam = isHome ? homeTeam : awayTeam;

      // Check if we recently showed an alert for this team (within last 3 seconds)
      const now = Date.now();
      if (now - scoringTeam.lastAlertShownAt < 3000) {
        console.log("TEST: Alert recently shown for this team, skipping...");
        // Still update the score but skip the alert
        match.homeTeam = homeTeam;
        match.awayTeam = awayTeam;
        match.commentary = [
          `${scoringTeam.name} SCORES! The crowd goes wild!`,
          ...match.commentary.slice(0, 2)
        ];
        const updatedMatches = prev.map(m =>
          m.id === match.id ? match : m
        );
        return updatedMatches;
      }

      // Update lastAlertShownAt timestamp
      scoringTeam.lastAlertShownAt = now;

      // Add to alerts list
      const alertMessage = `GOAL! ${scoringTeam.name} has scored! New score: ${homeTeam.name} ${homeTeam.score} - ${awayTeam.score} ${awayTeam.name}`;
      addAlert(scoringTeam.id, alertMessage);

      // Dismiss any current alert
      dismissAlert();

      // Schedule showing this team's alert
      setTimeout(() => {
        // Set this team as the current alert team
        setAlertTeam(scoringTeam);

        // Set auto-dismiss timer
        alertTimeoutRef.current = setTimeout(dismissAlert, 5000);
      }, 100);

      // Update match
      match.homeTeam = homeTeam;
      match.awayTeam = awayTeam;

      // Add commentary
      match.commentary = [
        `${scoringTeam.name} SCORES! The crowd goes wild!`,
        ...match.commentary.slice(0, 2)
      ];

      // Create updated matches array
      const updatedMatches = prev.map(m =>
        m.id === match.id ? match : m
      );

      // Add ticker update
      const newUpdate = {
        id: Date.now().toString(),
        text: `GOAL! ${match.homeTeam.name} ${match.homeTeam.score} - ${match.awayTeam.score} ${match.awayTeam.name}`,
        time: 'Just now',
        type: 'score' as const
      };
      setTickerUpdates(prevTicker => [newUpdate, ...prevTicker.slice(0, 7)]);

      return updatedMatches;
    });
  };

  // Filter matches by selected sport
  const filteredMatches = selectedSport === 'all'
    ? liveMatches
    : liveMatches.filter(match => match.sport === selectedSport);

  // Add a refresh button handler to manually update scores for testing
  const handleRefresh = () => {
    updateRandomScore();
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Parallax background with gradient overlay */}
      <div className="fixed inset-0 -z-10 opacity-10">
        <img
          src="https://images.unsplash.com/photo-1508098682722-e99c643e7d22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Sports background"
          className="object-cover w-full h-full"
        />
      </div>
      <div className={`fixed inset-0 -z-10 ${theme === "dark" ? "bg-gradient-to-br from-gray-900 via-blue-900/30 to-gray-900" : "bg-gradient-to-br from-blue-50 via-white/80 to-gray-100/90"}`} />

      {/* Real-time score update alert - using team properties */}
      <AnimatePresence mode="wait">
        {alertTeam && (
          <motion.div
            key={`score-alert-${alertTeam.lastAlertShownAt}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:right-6 sm:left-auto z-[100] sm:max-w-sm"
            onClick={() => dismissAlert()}
          >
            <div className={`relative rounded-xl backdrop-blur-md border ${
              theme === "dark" 
                ? "bg-gray-900/90 border-gray-700/50" 
                : "bg-white/90 border-gray-200/50"
            } shadow-lg`}>
              {/* Simple accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500 rounded-t-xl"></div>
              
              {/* Content */}
              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Simple icon */}
                  <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-red-500 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.4, repeat: 1 }}
                      className="text-sm sm:text-base"
                    >
                      ⚽
                    </motion.div>
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm sm:text-base ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>
                      {alertTeam.name} scored!
                    </p>
                    <p className={`text-xs sm:text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}>
                      New score: <span className="font-bold">{alertTeam.score}</span>
                    </p>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissAlert();
                    }}
                    className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center transition-colors ${
                      theme === "dark" 
                        ? "hover:bg-gray-800 text-gray-500 hover:text-gray-300" 
                        : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Simple progress bar */}
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-200"
              } rounded-b-xl overflow-hidden`}>
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="h-full bg-red-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className={`sticky top-0 z-30 w-full backdrop-blur-md border-b ${theme === "dark" ? "border-gray-700/40 bg-gray-900/80" : "border-gray-200/60 bg-white/80"}`}>
        <div className="container mx-auto px-3 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-red-600 text-xl"
            >
              <GiSoccerBall />
            </motion.div>
            <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
              SportsFusion
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative" ref={alertsDropdownRef}>
              <button
                className={`p-2 rounded-full ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"} relative transition-colors duration-200`}
                aria-label="Notifications"
                onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
              >
                <FiBell className="w-5 h-5" />
                {alerts.filter(a => !a.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold px-1">
                    {alerts.filter(a => !a.read).length}
                  </span>
                )}
              </button>

              {/* Modern Alerts Dropdown */}
              <AnimatePresence>
                {showAlertsDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-xl shadow-2xl overflow-hidden z-50 border ${
                      theme === "dark" 
                        ? "bg-gray-800 border-gray-700" 
                        : "bg-white border-gray-200"
                    }`}
                  >
                    {/* Header */}
                    <div className={`px-4 py-3 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-lg">Alerts</h4>
                        <button
                          onClick={() => setShowAlertsDropdown(false)}
                          className={`p-1 rounded-lg ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      {alerts.length > 0 && (
                        <p className="text-sm opacity-70 mt-1">
                          {alerts.filter(a => !a.read).length} unread alerts
                        </p>
                      )}
                    </div>

                    {/* Content */}
                    <div className="max-h-80 overflow-y-auto">
                      {alerts.length > 0 ? (
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                          {alerts.slice(0, 10).map((alert, index) => (
                            <motion.div
                              key={alert.id + index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                                !alert.read ? "bg-blue-50/50 dark:bg-blue-900/20" : ""
                              }`}
                              onClick={() => {
                                setAlerts(prev => prev.map(a => 
                                  a.id === alert.id ? { ...a, read: true } : a
                                ));
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                  !alert.read ? "bg-blue-500" : "bg-gray-300"
                                }`}></div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm leading-relaxed">{alert.message}</p>
                                  <p className="text-xs opacity-60 mt-1">
                                    {new Date(alert.timestamp).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                          }`}>
                            <FiBell className="w-8 h-8 opacity-50" />
                          </div>
                          <h3 className="font-medium mb-2">No alerts yet</h3>
                          <p className="text-sm opacity-70 max-w-xs mx-auto">
                            Star your favorite teams to receive score alerts and updates
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {alerts.length > 0 && (
                      <div className={`px-4 py-3 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`}>
                        <button
                          onClick={() => {
                            setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
                          }}
                          className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                            theme === "dark"
                              ? "bg-gray-700 hover:bg-gray-600 text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                          }`}
                        >
                          Mark all as read
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              className={`p-2 rounded-full ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-3 py-4">
        {/* Sports filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3">
          <button
            onClick={() => setSelectedSport('all')}
            className={`px-3 py-2 rounded-full flex items-center gap-2 whitespace-nowrap transition-all text-sm ${selectedSport === 'all'
              ? `${theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white"}`
              : `${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"}`
              }`}
          >
            <FiBarChart2 className="w-4 h-4" />
            All Sports
          </button>

          <button
            onClick={() => setSelectedSport('soccer')}
            className={`px-3 py-2 rounded-full flex items-center gap-2 whitespace-nowrap transition-all text-sm ${selectedSport === 'soccer'
              ? `${theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white"}`
              : `${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"}`
              }`}
          >
            <GiSoccerBall className="w-4 h-4" />
            Soccer
          </button>

          <button
            onClick={() => setSelectedSport('basketball')}
            className={`px-3 py-2 rounded-full flex items-center gap-2 whitespace-nowrap transition-all text-sm ${selectedSport === 'basketball'
              ? `${theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white"}`
              : `${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"}`
              }`}
          >
            <GiBasket className="w-4 h-4" />
            Basketball
          </button>

          <button
            onClick={() => setSelectedSport('tennis')}
            className={`px-3 py-2 rounded-full flex items-center gap-2 whitespace-nowrap transition-all text-sm ${selectedSport === 'tennis'
              ? `${theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white"}`
              : `${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"}`
              }`}
          >
            <GiTennisBall className="w-4 h-4" />
            Tennis
          </button>

          <button
            onClick={() => setSelectedSport('baseball')}
            className={`px-3 py-2 rounded-full flex items-center gap-2 whitespace-nowrap transition-all text-sm ${selectedSport === 'baseball'
              ? `${theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white"}`
              : `${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"}`
              }`}
          >
            <GiBaseballBat className="w-4 h-4" />
            Baseball
          </button>

          <button
            onClick={() => setSelectedSport('hockey')}
            className={`px-3 py-2 rounded-full flex items-center gap-2 whitespace-nowrap transition-all text-sm ${selectedSport === 'hockey'
              ? `${theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white"}`
              : `${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"}`
              }`}
          >
            <GiHockey className="w-4 h-4" />
            Hockey
          </button>
        </div>

        {/* Ticker - Scrolling scores */}
        <div className={`mt-3 mb-4 overflow-hidden rounded-lg shadow-lg relative ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex items-center p-2 gap-2 border-b border-gray-700/20">
            <FiActivity className="text-red-500 w-4 h-4" />
            <h2 className="font-bold text-sm">Live Updates</h2>
            <div className="ml-auto">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${theme === "dark" ? "bg-red-900/60 text-red-200" : "bg-red-100 text-red-600"}`}>
                <span className="w-2 h-2 mr-1 bg-red-500 rounded-full animate-pulse"></span>
                Live
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden h-10">
            <motion.div
              className="absolute whitespace-nowrap flex items-center h-full"
              animate={{
                x: [0, -2000]
              }}
              transition={{
                ease: "linear",
                duration: 30,
                repeat: Infinity,
              }}
            >
              {tickerUpdates.map((update, index) => (
                <motion.div
                  key={update.id + index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`px-3 py-1 mx-2 rounded-full flex items-center gap-2 whitespace-nowrap text-xs
                  ${update.type === 'score'
                      ? `${theme === "dark" ? "bg-red-950/40 text-red-200" : "bg-red-100 text-red-800"}`
                      : update.type === 'event'
                        ? `${theme === "dark" ? "bg-blue-950/40 text-blue-200" : "bg-blue-100 text-blue-800"}`
                        : `${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}`
                    }`}
                >
                  <FiClock className="text-xs" />
                  <span className="font-medium">{update.text}</span>
                  <span className="opacity-70">{update.time}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Main grid layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-4">
          {/* Live Matches */}
          <div className="xl:col-span-3 lg:col-span-2 space-y-4">
            <div className={`rounded-lg shadow-lg overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <div className="p-3 border-b border-gray-700/20 flex justify-between items-center">
                <h2 className="font-bold text-lg">Live Matches</h2>
                <button
                  className={`p-2 rounded-full ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} flex items-center gap-1`}
                  onClick={handleRefresh}
                  aria-label="Refresh"
                >
                  <FiRefreshCw className={`w-4 h-4 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                  <span className="text-sm">Refresh</span>
                </button>
              </div>

              <div className="p-3 space-y-3">
                <AnimatePresence>
                  {filteredMatches.map((match) => (
                    <motion.div
                      key={`match-${match.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        backgroundColor: theme === "dark"
                          ? ["rgba(55, 65, 81, 0.5)", "rgba(220, 38, 38, 0.3)", "rgba(55, 65, 81, 0.5)"]
                          : ["rgba(249, 250, 251, 1)", "rgba(254, 226, 226, 1)", "rgba(249, 250, 251, 1)"]
                      }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        duration: 0.8,
                        backgroundColor: {
                          duration: 2,
                          times: [0, 0.2, 1],
                          repeat: 0
                        }
                      }}
                      className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"}`}
                    >
                      {/* Header with sport type and status */}
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          {match.sport === 'soccer' && <GiSoccerBall className="text-green-500 text-lg" />}
                          {match.sport === 'basketball' && <GiBasket className="text-orange-500 text-lg" />}
                          {match.sport === 'tennis' && <GiTennisBall className="text-yellow-500 text-lg" />}
                          {match.sport === 'baseball' && <GiBaseballBat className="text-blue-500 text-lg" />}
                          {match.sport === 'hockey' && <GiHockey className="text-cyan-500 text-lg" />}
                          <span className="text-sm font-medium uppercase tracking-wider">{match.sport}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${match.status === 'live'
                          ? "bg-red-500/20 text-red-500 border border-red-500/30"
                          : match.status === 'upcoming'
                            ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
                            : "bg-gray-500/20 text-gray-500 border border-gray-500/30"
                          }`}>
                          {match.status === 'live' && "• "}
                          {match.status.toUpperCase()}
                        </div>
                      </div>

                      {/* Match content */}
                      <div className="grid grid-cols-7 items-center mb-4 gap-2">
                        {/* Home team */}
                        <div className="col-span-3 flex flex-col items-center text-center">
                          <div className="w-12 h-12 mb-2 relative">
                            <img
                              src={match.homeTeam.logo}
                              alt={match.homeTeam.name}
                              className="w-full h-full object-contain rounded-full"
                            />
                            <button
                              onClick={() => toggleFavorite(match.homeTeam.id)}
                              className="absolute -top-1 -right-1 bg-gray-800/40 p-1 rounded-full hover:bg-gray-700/80 tooltip-wrapper"
                              title={favoriteTeams.includes(match.homeTeam.id) ? "Remove from favorites" : "Add to favorites"}
                            >
                              <FiStar className={`w-3 h-3 ${favoriteTeams.includes(match.homeTeam.id) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                            </button>
                          </div>
                          <h3 className="font-bold text-sm">{match.homeTeam.name}</h3>
                        </div>

                        {/* Score */}
                        <div className="col-span-1 flex flex-col items-center">
                          {/* Time indicator with countdown */}
                          <div className={`text-xs text-center px-2 py-1 rounded-md mb-1 ${theme === "dark" ? "bg-gray-800" : "bg-white"
                            } ${match.status === 'live'
                              ? "text-red-500 font-bold animate-pulse"
                              : match.status === 'finished'
                                ? "text-green-500 font-bold"
                                : "opacity-70"
                            }`}>
                            {match.status === 'live' ? (
                              <>
                                <span className="inline-block w-2 h-2 mr-1 bg-red-500 rounded-full animate-pulse"></span>
                                {match.time}
                              </>
                            ) : match.status === 'finished' ? (
                              'FULL TIME'
                            ) : (
                              match.time
                            )}
                          </div>

                          <div className={`flex items-center justify-center ${theme === "dark" ? "bg-gray-800/50" : "bg-white"} rounded-lg py-2 px-3 gap-2 w-20 shadow-md border ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                            <motion.span
                              key={`${match.id}-home-${match.homeTeam.score}`}
                              animate={{
                                scale: match.homeTeam.score > 0 ? [1, 1.5, 1] : 1,
                                color: match.homeTeam.score > 0 ? ["inherit", "#ef4444", "inherit"] : "inherit"
                              }}
                              transition={{ duration: 0.8 }}
                              className={`text-xl font-bold text-center w-6 ${match.homeTeam.score > match.awayTeam.score ? "text-green-500" : ""}`}
                            >
                              {match.homeTeam.score}
                            </motion.span>
                            <span className="text-gray-400 font-normal">-</span>
                            <motion.span
                              key={`${match.id}-away-${match.awayTeam.score}`}
                              animate={{
                                scale: match.awayTeam.score > 0 ? [1, 1.5, 1] : 1,
                                color: match.awayTeam.score > 0 ? ["inherit", "#ef4444", "inherit"] : "inherit"
                              }}
                              transition={{ duration: 0.8 }}
                              className={`text-xl font-bold text-center w-6 ${match.awayTeam.score > match.homeTeam.score ? "text-green-500" : ""}`}
                            >
                              {match.awayTeam.score}
                            </motion.span>
                          </div>

                          {/* Winner indicator or match period */}
                          {match.status === 'live' ? (
                            <div className="mt-1 text-xs flex items-center">
                              <span className="text-red-500">{match.period}</span>
                            </div>
                          ) : match.status === 'finished' ? (
                            <div className="mt-2">
                              {match.homeTeam.score !== match.awayTeam.score && (
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${theme === "dark" ? "bg-green-800/30 text-green-400" : "bg-green-100 text-green-800"}`}>
                                  {match.homeTeam.score > match.awayTeam.score ? match.homeTeam.name : match.awayTeam.name} wins
                                </span>
                              )}
                              {match.homeTeam.score === match.awayTeam.score && (
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${theme === "dark" ? "bg-yellow-800/30 text-yellow-400" : "bg-yellow-100 text-yellow-800"}`}>
                                  Draw
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="mt-1 text-xs">
                              <span className="opacity-70">{match.period}</span>
                            </div>
                          )}
                        </div>

                        {/* Away team */}
                        <div className="col-span-3 flex flex-col items-center text-center">
                          <div className="w-12 h-12 mb-2 relative">
                            <img
                              src={match.awayTeam.logo}
                              alt={match.awayTeam.name}
                              className="w-full h-full object-contain rounded-full"
                            />
                            <button
                              onClick={() => toggleFavorite(match.awayTeam.id)}
                              className="absolute -top-1 -right-1 bg-gray-800/40 p-1 rounded-full hover:bg-gray-700/80 tooltip-wrapper"
                              title={favoriteTeams.includes(match.awayTeam.id) ? "Remove from favorites" : "Add to favorites"}
                            >
                              <FiStar className={`w-3 h-3 ${favoriteTeams.includes(match.awayTeam.id) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                            </button>
                          </div>
                          <h3 className="font-bold text-sm">{match.awayTeam.name}</h3>
                        </div>
                      </div>

                      {/* Live Commentary */}
                      <div className={`rounded-lg p-3 text-sm ${theme === "dark" ? "bg-gray-800/70" : "bg-white"} border ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                        <h4 className="font-medium mb-2 text-xs uppercase tracking-wider flex items-center">
                          <span className={`inline-block w-2 h-2 mr-2 rounded-full ${match.status === 'live' ? "bg-red-500 animate-pulse" : "bg-gray-500"}`}></span>
                          Live Commentary
                        </h4>
                        <ul className="space-y-1">
                          {match.commentary.slice(0, 2).map((comment, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-2 pb-1 border-b border-gray-700/10 last:border-0"
                            >
                              <span className={`inline-block w-1.5 h-1.5 mt-1.5 rounded-full flex-shrink-0 ${index === 0 ? "bg-red-500" : "bg-yellow-500"
                                }`}></span>
                              <span className="text-xs">{comment}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredMatches.length === 0 && (
                  <div className="text-center p-8 opacity-70">
                    <p>No matches found for this sport.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Player Stats */}
            <div className={`rounded-lg shadow-lg overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <div className="p-3 border-b border-gray-700/20">
                <h2 className="font-bold text-lg">Top Performers</h2>
              </div>

              <div className="p-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {mockPlayers.map((player) => (
                    <motion.div
                      key={player.id}
                      whileHover={{ scale: 1.03 }}
                      className={`p-3 rounded-lg border ${theme === "dark" ? "border-gray-700 bg-gray-700/30" : "border-gray-200 bg-gray-50"}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                          {player.team === 'Barcelona' && <GiSoccerBall className="text-red-500 text-sm" />}
                          {player.team === 'Warriors' && <GiBasket className="text-orange-500 text-sm" />}
                          {player.team === 'Serbia' && <GiTennisBall className="text-yellow-500 text-sm" />}
                          {player.team === 'Yankees' && <GiBaseballBat className="text-blue-500 text-sm" />}
                          {player.team === 'Bruins' && <GiHockey className="text-cyan-500 text-sm" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-sm truncate">{player.name}</h3>
                          <p className="text-xs opacity-70">{player.team}</p>
                        </div>
                      </div>
                      <p className="text-xs">{player.stats}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-1 lg:col-span-1 space-y-4">
            {/* Alerts and Notifications */}
            <div className={`rounded-xl shadow-lg overflow-hidden border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <div className={`p-3 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`}>
                <h2 className="font-bold text-base flex items-center">
                  <FiBell className="mr-2 w-4 h-4" /> 
                  Alerts
                  {alerts.filter(a => !a.read).length > 0 && (
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full font-bold ${theme === "dark" ? "bg-red-900 text-red-200" : "bg-red-500 text-white"}`}>
                      {alerts.filter(a => !a.read).length}
                    </span>
                  )}
                </h2>
              </div>

              <div className="p-3 space-y-3">
                {alerts.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold">Recent Updates</h3>
                      <button
                        onClick={() => setAlerts(prev => prev.map(alert => ({ ...alert, read: true })))}
                        className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                          theme === "dark"
                            ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                        }`}
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {alerts.slice(0, 4).map((alert, index) => (
                        <motion.div
                          key={alert.id + index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                            !alert.read
                              ? theme === "dark"
                                ? "bg-blue-900/20 border-blue-800/30 hover:bg-blue-900/30"
                                : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                              : theme === "dark"
                                ? "bg-gray-700/50 border-gray-600 hover:bg-gray-700"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            setAlerts(prev => prev.map(a => 
                              a.id === alert.id ? { ...a, read: true } : a
                            ));
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                              !alert.read ? "bg-blue-500" : "bg-gray-400"
                            }`}></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs leading-relaxed">{alert.message}</p>
                              <p className="text-xs opacity-60 mt-0.5">
                                {new Date(alert.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    }`}>
                      <FiBell className="w-5 h-5 opacity-50" />
                    </div>
                    <h3 className="font-medium mb-1 text-sm">No alerts yet</h3>
                    <p className="text-xs opacity-70">Star teams to receive alerts</p>
                  </div>
                )}

                {favoriteTeams.length === 0 ? (
                  <div className={`text-center py-3 px-2 rounded-lg border-2 border-dashed ${
                    theme === "dark" ? "border-gray-600" : "border-gray-300"
                  }`}>
                    <FiStar className="w-6 h-6 mx-auto mb-1 opacity-50" />
                    <p className="text-xs font-medium mb-1">No favorite teams</p>
                    <p className="text-xs opacity-70">Click ★ next to teams</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold flex items-center">
                      <FiStar className="w-3 h-3 mr-1 text-yellow-500" />
                      Favorite Teams ({favoriteTeams.length})
                    </h3>
                    <div className="space-y-1">
                      {favoriteTeams.slice(0, 4).map((teamId, index) => {
                        const team = [...liveMatches.map(m => m.homeTeam), ...liveMatches.map(m => m.awayTeam)]
                          .find(t => t.id === teamId);

                        return team && (
                          <motion.div
                            key={team.id + index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-2 rounded-lg flex items-center justify-between border ${
                              theme === "dark" 
                                ? "bg-gray-700/50 border-gray-600 hover:bg-gray-700" 
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            } transition-colors`}
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={team.logo}
                                alt={team.name}
                                className="w-5 h-5 object-contain rounded-full"
                              />
                              <span className="font-medium text-xs">{team.name}</span>
                            </div>
                            <button
                              className={`p-1 rounded-lg transition-colors ${
                                theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-200"
                              }`}
                              onClick={() => toggleFavorite(team.id)}
                              aria-label="Remove from favorites"
                              title="Remove from favorites"
                            >
                              <FiStar className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            </button>
                          </motion.div>
                        );
                      })}
                      {favoriteTeams.length > 4 && (
                        <p className="text-xs opacity-70 text-center">+{favoriteTeams.length - 4} more</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Leaderboard */}
            <div className={`rounded-xl shadow-lg overflow-hidden border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <div className={`p-3 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`}>
                <h2 className="font-bold text-base">
                  {selectedSport === 'all' ? 'Sport Leaderboard' : `${selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1)} Leaderboard`}
                </h2>
                <p className="text-xs opacity-70 mt-0.5">
                  {selectedSport === 'all' ? 'Top performers by sport' : 'Current standings'}
                </p>
              </div>

              <div className="p-3">
                {selectedSport === 'all' ? (
                  // Show condensed view of all sports when "all" is selected
                  <div className="space-y-2">
                    {mockSports.map((sport) => {
                      const sportMatches = liveMatches.filter(match => match.sport === sport);
                      if (sportMatches.length === 0) return null;

                      const sportTeams = [
                        ...sportMatches.map(m => ({ ...m.homeTeam, sport })),
                        ...sportMatches.map(m => ({ ...m.awayTeam, sport }))
                      ].sort((a, b) => b.score - a.score);

                      const uniqueTeams = sportTeams.filter((team, index, arr) => 
                        arr.findIndex(t => t.id === team.id) === index
                      );

                      const topTeam = uniqueTeams[0];
                      if (!topTeam) return null;

                      return (
                        <motion.div
                          key={sport}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: mockSports.indexOf(sport) * 0.05 }}
                          className={`flex items-center justify-between p-2 rounded-lg border ${
                            theme === "dark" ? "border-gray-700 bg-gray-700/30" : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {sport === 'soccer' && <GiSoccerBall className="text-green-500 text-sm" />}
                            {sport === 'basketball' && <GiBasket className="text-orange-500 text-sm" />}
                            {sport === 'tennis' && <GiTennisBall className="text-yellow-500 text-sm" />}
                            {sport === 'baseball' && <GiBaseballBat className="text-blue-500 text-sm" />}
                            {sport === 'hockey' && <GiHockey className="text-cyan-500 text-sm" />}
                            <div>
                              <p className="font-semibold text-xs capitalize">{sport}</p>
                              <p className="text-xs opacity-70">{topTeam.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <img
                              src={topTeam.logo}
                              alt={topTeam.name}
                              className="w-5 h-5 object-contain rounded-full"
                            />
                            <span className="font-bold text-sm text-yellow-600">{topTeam.score}</span>
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Overall Top Scorer - Compact Version */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: mockSports.length * 0.05 }}
                      className={`p-2 rounded-lg border-2 border-dashed ${
                        theme === "dark" ? "border-yellow-600/30 bg-yellow-900/10" : "border-yellow-400/50 bg-yellow-50"
                      }`}
                    >
                      {(() => {
                        const allTeams = [...liveMatches.map(m => m.homeTeam), ...liveMatches.map(m => m.awayTeam)];
                        const topScorer = allTeams.reduce((max, team) => 
                          team.score > max.score ? team : max
                        );
                        
                        return (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">👑</span>
                              <div>
                                <p className="font-semibold text-xs">Overall Champion</p>
                                <p className="text-xs opacity-70">{topScorer.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <img
                                src={topScorer.logo}
                                alt={topScorer.name}
                                className="w-5 h-5 object-contain rounded-full"
                              />
                              <span className="text-lg font-bold text-yellow-600">{topScorer.score}</span>
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  </div>
                ) : (
                  // Show detailed view for selected sport
                  (() => {
                    const sportMatches = liveMatches.filter(match => match.sport === selectedSport);
                    if (sportMatches.length === 0) {
                      return (
                        <div className="text-center py-6">
                          <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                          }`}>
                            {selectedSport === 'soccer' && <GiSoccerBall className="w-6 h-6 opacity-50" />}
                            {selectedSport === 'basketball' && <GiBasket className="w-6 h-6 opacity-50" />}
                            {selectedSport === 'tennis' && <GiTennisBall className="w-6 h-6 opacity-50" />}
                            {selectedSport === 'baseball' && <GiBaseballBat className="w-6 h-6 opacity-50" />}
                            {selectedSport === 'hockey' && <GiHockey className="w-6 h-6 opacity-50" />}
                          </div>
                          <h3 className="font-medium mb-1 text-sm">No {selectedSport} matches</h3>
                          <p className="text-xs opacity-70">Check back later for live games</p>
                        </div>
                      );
                    }

                    const sportTeams = [
                      ...sportMatches.map(m => ({ ...m.homeTeam, sport: selectedSport })),
                      ...sportMatches.map(m => ({ ...m.awayTeam, sport: selectedSport }))
                    ].sort((a, b) => b.score - a.score);

                    const uniqueTeams = sportTeams.filter((team, index, arr) => 
                      arr.findIndex(t => t.id === team.id) === index
                    );

                    return (
                      <div className="space-y-1">
                        {uniqueTeams.map((team, index) => (
                          <motion.div
                            key={team.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-center gap-2 p-2 rounded-lg ${
                              theme === "dark" ? "bg-gray-700/50 hover:bg-gray-700" : "bg-gray-50 hover:bg-gray-100"
                            } transition-colors`}
                          >
                            {/* Rank */}
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0 
                                ? "bg-yellow-500/20 text-yellow-600" 
                                : index === 1 
                                  ? "bg-gray-400/20 text-gray-500"
                                  : index === 2
                                    ? "bg-orange-500/20 text-orange-600"
                                    : "bg-gray-300/20 text-gray-400"
                            }`}>
                              {index + 1}
                            </div>

                            {/* Team Logo */}
                            <img
                              src={team.logo}
                              alt={team.name}
                              className="w-6 h-6 object-contain rounded-full"
                            />

                            {/* Team Name */}
                            <span className="font-medium flex-1 text-xs">{team.name}</span>

                            {/* Score and Favorite */}
                            <div className="flex items-center gap-1">
                              <span className={`text-lg font-bold ${
                                index === 0 ? "text-yellow-600" : ""
                              }`}>
                                {team.score}
                              </span>
                              {team.isFav && (
                                <FiStar className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    );
                  })()
                )}
              </div>
            </div>

            {/* Statistics Card */}
            <div className={`rounded-xl shadow-lg overflow-hidden border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <div className={`p-3 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`}>
                <h2 className="font-bold text-base">Quick Stats</h2>
              </div>

              <div className="p-3 space-y-2">
                <motion.div
                  className={`p-2 rounded-lg grid grid-cols-2 gap-2 ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-100"}`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div>
                    <p className="text-xs opacity-70">Live Games</p>
                    <p className="text-lg font-bold">{liveMatches.filter(m => m.status === 'live').length}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-70">Total Scores</p>
                    <p className="text-lg font-bold">
                      {liveMatches.reduce((acc, match) => acc + match.homeTeam.score + match.awayTeam.score, 0)}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className={`p-2 rounded-lg grid grid-cols-2 gap-2 ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-100"}`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div>
                    <p className="text-xs opacity-70">Teams</p>
                    <p className="text-lg font-bold">
                      {new Set([...liveMatches.map(m => m.homeTeam.name), ...liveMatches.map(m => m.awayTeam.name)]).size}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs opacity-70">Sports</p>
                    <p className="text-lg font-bold">{mockSports.length}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`mt-6 py-4 border-t ${theme === "dark" ? "border-gray-700/40" : "border-gray-200"}`}>
        <div className="container mx-auto px-3 text-center text-xs opacity-70">
          <p>© 2025 SportsFusion. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}