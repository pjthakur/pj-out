"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Shuffle,
  RotateCcw,
  Trophy,
  Clock,
  Medal,
  Share2,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Settings,
  HelpCircle,
  BrainCircuit,
  Zap,
  Star,
  BarChart,
  AlertTriangle,
  Gift,
  Lock,
  Brain,
  Award,
  Menu,
  X,
  ChevronRight,
  CheckCircle,
  Users,
} from "lucide-react";

// Define card interface
interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// Define achievement interface
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

// Define theme interface
interface Theme {
  id: string;
  name: string;
  gradient: string;
  text: string;
  cardBack: string;
  cardFront: string;
  accent: string;
  locked?: boolean;
}

// Define Category interface for card sets
interface Category {
  id: string;
  name: string;
  emojis: {
    easy: string[];
    medium: string[];
    hard: string[];
  };
  locked?: boolean;
}

// Define Toast interface
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface GameProps {
  setShowGame: React.Dispatch<React.SetStateAction<boolean>>;
}

// Main component
const Game: React.FC<GameProps> = ({ setShowGame }) => {
  // Game state
  const [cards, setCards] = useState<Card[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const [moves, setMoves] = useState<number>(0);
  const [firstCard, setFirstCard] = useState<Card | null>(null);
  const [secondCard, setSecondCard] = useState<Card | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gamePaused, setGamePaused] = useState<boolean>(false);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [showAchievements, setShowAchievements] = useState<boolean>(false);
  const [hintsRemaining, setHintsRemaining] = useState<number>(3);
  const [hintUsed, setHintUsed] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(500); // milliseconds
  const [challengeMode, setChallengeMode] = useState<boolean>(false);
  const [timeLimit, setTimeLimit] = useState<number>(120); // 2 minutes default
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [selectedTheme, setSelectedTheme] = useState<string>("default");
  const [selectedCategory, setSelectedCategory] = useState<string>("animals");
  const [totalGamesPlayed, setTotalGamesPlayed] = useState<number>(0);
  const [totalMatches, setTotalMatches] = useState<number>(0);
  
  // Toast notifications state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast management functions
  const showToast = (message: string, type: Toast['type'] = 'info', duration: number = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  // Helper function to create the default achievements array
  const createDefaultAchievements = (): Achievement[] => [
    {
      id: "first_win",
      name: "First Victory",
      description: "Complete your first memory match game",
      icon: <Trophy size={24} className="text-yellow-500" />,
      unlocked: false,
    },
    {
      id: "speed_demon",
      name: "Speed Demon",
      description: "Complete a game in under 60 seconds",
      icon: <Zap size={24} className="text-blue-500" />,
      unlocked: false,
    },
    {
      id: "perfect_memory",
      name: "Perfect Memory",
      description: "Complete a game with minimal moves (pairs × 1.5 or less)",
      icon: <BrainCircuit size={24} className="text-purple-500" />,
      unlocked: false,
    },
    {
      id: "master_matcher",
      name: "Master Matcher",
      description: "Win 5 games in total",
      icon: <Star size={24} className="text-amber-500" />,
      unlocked: false,
    },
    {
      id: "challenge_accepted",
      name: "Challenge Accepted",
      description: "Win a game in challenge mode",
      icon: <AlertTriangle size={24} className="text-red-500" />,
      unlocked: false,
    },
  ];
  
  const [achievements, setAchievements] = useState<Achievement[]>(createDefaultAchievements());

  // Available themes
  const themes: Theme[] = [
    {
      id: "default",
      name: "Corporate Blue",
      gradient: "from-blue-50 to-indigo-100",
      text: "text-slate-800",
      cardBack: "bg-white border-indigo-100",
      cardFront: "from-indigo-500 to-indigo-700",
      accent: "bg-indigo-600 hover:bg-indigo-700",
    },
    {
      id: "sunset",
      name: "Sunset Orange",
      gradient: "from-orange-50 to-amber-100",
      text: "text-slate-800",
      cardBack: "bg-white border-orange-100",
      cardFront: "from-orange-500 to-red-600",
      accent: "bg-orange-600 hover:bg-orange-700",
    },
    {
      id: "forest",
      name: "Forest Green",
      gradient: "from-green-50 to-emerald-100",
      text: "text-slate-800",
      cardBack: "bg-white border-green-100",
      cardFront: "from-green-500 to-emerald-700",
      accent: "bg-green-600 hover:bg-green-700",
    },
    {
      id: "midnight",
      name: "Midnight Purple",
      gradient: "from-violet-100 to-purple-200",
      text: "text-slate-800",
      cardBack: "bg-white border-violet-100",
      cardFront: "from-violet-600 to-purple-800",
      accent: "bg-violet-600 hover:bg-violet-700",
      locked: true,
    },
  ];

  // Dark mode variants for themes
  const getDarkThemeVariant = (theme: Theme) => {
    const darkVariants: { [key: string]: Partial<Theme> } = {
      default: {
        gradient: "from-slate-900 to-slate-800",
        text: "text-white",
        cardBack: "bg-slate-800 border-slate-600",
        cardFront: "from-indigo-600 to-indigo-800",
        accent: "bg-indigo-600 hover:bg-indigo-700",
      },
      sunset: {
        gradient: "from-slate-900 to-slate-800",
        text: "text-white",
        cardBack: "bg-slate-800 border-slate-600",
        cardFront: "from-orange-600 to-red-700",
        accent: "bg-orange-600 hover:bg-orange-700",
      },
      forest: {
        gradient: "from-slate-900 to-slate-800",
        text: "text-white",
        cardBack: "bg-slate-800 border-slate-600",
        cardFront: "from-green-600 to-emerald-800",
        accent: "bg-green-600 hover:bg-green-700",
      },
      midnight: {
        gradient: "from-slate-900 to-slate-800",
        text: "text-white",
        cardBack: "bg-slate-800 border-slate-600",
        cardFront: "from-violet-700 to-purple-900",
        accent: "bg-violet-600 hover:bg-violet-700",
      },
    };

    return {
      ...theme,
      ...darkVariants[theme.id],
    };
  };

  // Available categories
  const categories: Category[] = [
    {
      id: "animals",
      name: "Animals",
      emojis: {
        easy: ["🐶", "🐱", "🐭"], // 3 pairs = 6 cards
        medium: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊"], // 6 pairs = 12 cards
        hard: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"], // 8 pairs = 16 cards
      },
    },
    {
      id: "foods",
      name: "Foods",
      emojis: {
        easy: ["🍎", "🍌", "🍇"], // 3 pairs = 6 cards
        medium: ["🍎", "🍌", "🍇", "🍓", "🍕", "🍔"], // 6 pairs = 12 cards
        hard: ["🍎", "🍌", "🍇", "🍓", "🍕", "🍔", "🍩", "🍦"], // 8 pairs = 16 cards
      },
    },
    {
      id: "travel",
      name: "Travel",
      emojis: {
        easy: ["✈️", "🚗", "🚢"], // 3 pairs = 6 cards
        medium: ["✈️", "🚗", "🚢", "🚂", "🏖️", "🗼"], // 6 pairs = 12 cards
        hard: ["✈️", "🚗", "🚢", "🚂", "🏖️", "🗼", "🏰", "🏝️"], // 8 pairs = 16 cards
      },
      locked: true,
    },
  ];

  const [bestScores, setBestScores] = useState<{
    [key: string]: { moves: number; time: number } | null;
  }>({
    easy: null,
    medium: null,
    hard: null,
  });

  // Stats for current game session
  const [currentStats, setCurrentStats] = useState({
    matchesFound: 0,
    hintsUsed: 0,
    fastestMatch: 0,
    longestMatch: 0,
  });

  // Refs for audio
  const flipSound = useRef<HTMLAudioElement | null>(null);
  const matchSound = useRef<HTMLAudioElement | null>(null);
  const victorySound = useRef<HTMLAudioElement | null>(null);
  const errorSound = useRef<HTMLAudioElement | null>(null);
  const buttonSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("memoryMatchDarkMode");
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === "true");
    } else {
      localStorage.setItem("memoryMatchDarkMode", "true"); // Default to dark mode
    }
  }, []);

  useEffect(() => {
    const modalOpen =
      showSettings ||
      showStats ||
      showAchievements ||
      showTutorial ||
      gamePaused ||
      gameWon;

    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Clean up on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [
    showSettings,
    showStats,
    showAchievements,
    showTutorial,
    gamePaused,
    gameWon,
  ]);

  // Initialize audio elements

  useEffect(() => {
    flipSound.current = new Audio(
      "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
    );
    matchSound.current = new Audio(
      "https://actions.google.com/sounds/v1/cartoon/pop.ogg"
    );
    victorySound.current = new Audio(
      "https://actions.google.com/sounds/v1/cartoon/drum_roll.ogg"
    );
    errorSound.current = new Audio(
      "data:audio/wav;base64,UklGRl9nAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YTtnAAAAvgACAFsACQC+AAoASAAVAGsALgA1AEoAIQAYAAAA///7/+X/x/+0/5n/iv+G/4X/gf98/37/i/+c/6z/wP/c/wAA//8CAP//+f/3/+X/yf+r/5H/ff9m/1L/Sf9M/1n/ZP91/5D/tv/t/xAAKAA7AE0AVgBWAFIA/AAHAAcACwAQABcAIgAqADQAPQBHAFEAXABnAHQAggCVAKgAuwDNAOAA8wAGARkBLAE/AVMBZgF6AY4BoAG0AccB2wHuAQICFgEbARkBFQESAQ0BBgH9APQAMgA3ADwAQABFAEkAzQDSANcA3QDjAOgA7QDyAPgA/QADAAoAkQCWAJ0AogApACMAGwAWABEACQADAP3/+P/y/+3/6P/j/9//2v/W/9H/zf/K/8b/wf+9/7r/"
    );
    buttonSound.current = new Audio(
      "https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg"
    );

    // Check if it's first visit
    const firstVisit = localStorage.getItem("memoryMatchFirstVisit");
    if (!firstVisit) {
      setShowTutorial(true);
      localStorage.setItem("memoryMatchFirstVisit", "false");
    } else {
      setIsFirstVisit(false);
    }

    // Initialize other stats
    const savedTotalGames = localStorage.getItem("memoryMatchTotalGames");
    if (savedTotalGames) {
      setTotalGamesPlayed(parseInt(savedTotalGames));
    }

    const savedTotalMatches = localStorage.getItem("memoryMatchTotalMatches");
    if (savedTotalMatches) {
      setTotalMatches(parseInt(savedTotalMatches));
    }

    const savedAchievements = localStorage.getItem("memoryMatchAchievements");
    if (savedAchievements) {
      try {
        const savedData = JSON.parse(savedAchievements);
        // Check if it's the old format (full achievements) or new format (just id and unlocked)
        if (savedData.length > 0 && savedData[0].hasOwnProperty('icon')) {
          // Old format with React elements - extract only essential data
          const essentialData = savedData.map((a: any) => ({
            id: a.id,
            unlocked: a.unlocked
          }));
          // Rebuild achievements array with default structure and saved unlock status
          const defaultAchievements = createDefaultAchievements();
          const updatedAchievements = defaultAchievements.map(defaultAchievement => {
            const savedAchievement = essentialData.find((saved: any) => saved.id === defaultAchievement.id);
            return {
              ...defaultAchievement,
              unlocked: savedAchievement ? savedAchievement.unlocked : false
            };
          });
          setAchievements(updatedAchievements);
        } else {
          // New format (just id and unlocked) - rebuild with default structure
          const defaultAchievements = createDefaultAchievements();
          const updatedAchievements = defaultAchievements.map(defaultAchievement => {
            const savedAchievement = savedData.find((saved: any) => saved.id === defaultAchievement.id);
            return {
              ...defaultAchievement,
              unlocked: savedAchievement ? savedAchievement.unlocked : false
            };
          });
          setAchievements(updatedAchievements);
        }
      } catch (error) {
        console.error("Error loading achievements:", error);
        // Fall back to default achievements if there's an error
        setAchievements(createDefaultAchievements());
      }
    }

    const savedTheme = localStorage.getItem("memoryMatchTheme");
    if (savedTheme) {
      setSelectedTheme(savedTheme);
    }

    const savedDarkMode = localStorage.getItem("memoryMatchDarkMode");
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === "true");
    }

    const savedSoundEnabled = localStorage.getItem("memoryMatchSound");
    if (savedSoundEnabled) {
      setSoundEnabled(savedSoundEnabled === "true");
    }
  }, []);

  // Get current theme
  const getCurrentTheme = (): Theme => {
    return themes.find((theme) => theme.id === selectedTheme) || themes[0];
  };

  // Get current category
  const getCurrentCategory = (): Category => {
    return (
      categories.find((category) => category.id === selectedCategory) ||
      categories[0]
    );
  };

  // Play sound if enabled
  const playSound = (sound: HTMLAudioElement | null) => {
    if (soundEnabled && sound) {
      try {
        sound.currentTime = 0;
        sound.play().catch(() => {}); // prevent console error
      } catch (e) {
        // ignore autoplay errors
      }
    }
  };

  // Initialize or reset the game
  const initializeGame = () => {
    const category = getCurrentCategory();
    const difficultyEmojis = category.emojis[difficulty];

    // Create pairs of cards with emojis
    const cardPairs = [...difficultyEmojis].flatMap((emoji) => [
      { id: Math.random(), emoji, isFlipped: false, isMatched: false },
      { id: Math.random(), emoji, isFlipped: false, isMatched: false },
    ]);

    // Shuffle the cards
    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);

    // Reset ALL game state variables
    setCards(shuffledCards);
    setMoves(0);
    setFirstCard(null);
    setSecondCard(null);
    setIsChecking(false);
    setGameWon(false);
    setTimer(0);
    setGameStarted(false);
    setGamePaused(false);
    setHintUsed(false);
    setHintsRemaining(3);

    // Reset current game stats
    setCurrentStats({
      matchesFound: 0,
      hintsUsed: 0,
      fastestMatch: 0,
      longestMatch: 0,
    });

    // Close any open modals/overlays when starting new game
    setShowStats(false);
    setShowAchievements(false);
    setShowSettings(false);
    setShowTutorial(false);

    // Play button sound
    playSound(buttonSound.current);
  };

  // Handle card click
  const handleCardClick = (clickedCard: Card) => {
    // Prevent clicking if paused, already checking, or card is already flipped/matched
    if (
      gamePaused ||
      isChecking ||
      clickedCard.isFlipped ||
      clickedCard.isMatched
    ) {
      return;
    }

    // Start the game on first click
    if (!gameStarted) {
      setGameStarted(true);
    }

    // Play flip sound
    playSound(flipSound.current);

    // Flip the card
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === clickedCard.id ? { ...card, isFlipped: true } : card
      )
    );

    // Logic for checking pairs
    if (!firstCard) {
      setFirstCard(clickedCard);
    } else {
      setMoves((prevMoves) => prevMoves + 1);
      setSecondCard(clickedCard);
    }
  };

  // Show hint - flip two matching cards briefly
  const showHint = () => {
    if (hintsRemaining > 0 && gameStarted && !gameWon && !gamePaused) {
      setHintsRemaining((prev) => prev - 1);
      setHintUsed(true);
      setCurrentStats((prev) => ({
        ...prev,
        hintsUsed: prev.hintsUsed + 1,
      }));

      // Find unmatched pairs
      const unmatchedCards = cards.filter((card) => !card.isMatched);
      const unmatchedPairs: { [key: string]: Card[] } = {};

      // Group by emoji
      unmatchedCards.forEach((card) => {
        if (!unmatchedPairs[card.emoji]) {
          unmatchedPairs[card.emoji] = [];
        }
        unmatchedPairs[card.emoji].push(card);
      });

      // Find a pair that hasn't been flipped yet
      const availablePairs = Object.values(unmatchedPairs).filter(
        (pair) => pair.length === 2 && pair.some((card) => !card.isFlipped)
      );

      if (availablePairs.length > 0) {
        // Select a random pair
        const selectedPair =
          availablePairs[Math.floor(Math.random() * availablePairs.length)];

        // Flip the pair briefly
        setCards((prevCards) =>
          prevCards.map((card) =>
            selectedPair.find((p) => p.id === card.id)
              ? { ...card, isFlipped: true }
              : card
          )
        );

        // Flip them back after a delay
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              selectedPair.find((p) => p.id === card.id) && !card.isMatched
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setHintUsed(false);
        }, 1000);

        // Play sound
        playSound(buttonSound.current);
      }
    }
  };

  // Toggle pause game
  const togglePause = () => {
    if (gameStarted && !gameWon) {
      setGamePaused((prev) => !prev);
      playSound(buttonSound.current);
    }
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Update best scores when game is won
  const updateBestScores = () => {
    const currentScore = { moves, time: timer };

    setBestScores((prevScores) => {
      const prevBest = prevScores[difficulty];

      // Update if this is the first score or better than previous
      if (
        !prevBest ||
        moves < prevBest.moves ||
        (moves === prevBest.moves && timer < prevBest.time)
      ) {
        const newScores = {
          ...prevScores,
          [difficulty]: currentScore,
        };
        localStorage.setItem(
          "memoryMatchBestScores",
          JSON.stringify(newScores)
        );
        return newScores;
      }

      return prevScores;
    });
  };

  // Update achievements
  const updateAchievements = () => {
    const updatedAchievements = [...achievements];
    let achievementUnlocked = false;

    // First win achievement
    if (!achievements.find((a) => a.id === "first_win")?.unlocked) {
      updatedAchievements.find((a) => a.id === "first_win")!.unlocked = true;
      achievementUnlocked = true;
    }

    // Speed demon achievement
    if (
      !achievements.find((a) => a.id === "speed_demon")?.unlocked &&
      timer < 60
    ) {
      updatedAchievements.find((a) => a.id === "speed_demon")!.unlocked = true;
      achievementUnlocked = true;
    }

    // Perfect memory achievement
    const perfectMoveCount = Math.ceil((cards.length / 2) * 1.5);
    if (
      !achievements.find((a) => a.id === "perfect_memory")?.unlocked &&
      moves <= perfectMoveCount
    ) {
      updatedAchievements.find((a) => a.id === "perfect_memory")!.unlocked =
        true;
      achievementUnlocked = true;
    }

    // Master matcher achievement (5 games)
    if (
      !achievements.find((a) => a.id === "master_matcher")?.unlocked &&
      totalGamesPlayed + 1 >= 5
    ) {
      updatedAchievements.find((a) => a.id === "master_matcher")!.unlocked =
        true;
      achievementUnlocked = true;
    }

    // Challenge accepted achievement
    if (
      !achievements.find((a) => a.id === "challenge_accepted")?.unlocked &&
      challengeMode
    ) {
      updatedAchievements.find((a) => a.id === "challenge_accepted")!.unlocked =
        true;
      achievementUnlocked = true;
    }

    if (achievementUnlocked) {
      setAchievements(updatedAchievements);
      
      // Only save the essential data (id and unlocked status) to avoid circular reference errors
      const achievementData = updatedAchievements.map(achievement => ({
        id: achievement.id,
        unlocked: achievement.unlocked
      }));
      
      localStorage.setItem(
        "memoryMatchAchievements",
        JSON.stringify(achievementData)
      );
    }

    return achievementUnlocked;
  };

  // Check if the current score is a new best score
  const isNewBestScore = (): boolean => {
    const prevBest = bestScores[difficulty];
    return (
      !prevBest ||
      moves < prevBest.moves ||
      (moves === prevBest.moves && timer < prevBest.time)
    );
  };

  // Share results (simulated)
  const shareResults = () => {
    const shareMessage = `I completed the MemMatch game on ${difficulty} difficulty with ${moves} moves in ${formatTime(
      timer
    )}! Can you beat my score? #MemMatch`;

    if (navigator.share) {
      navigator
        .share({
          title: "MemMatch Results",
          text: shareMessage,
        })
        .then(() => {
          showToast("Results shared successfully!", "success");
        })
        .catch((error) => {
          showToast("Share Cancelled");
        });
    } else {
      // Fallback for browsers that don't support sharing
      showToast(shareMessage, "info", 5000);
    }

    playSound(buttonSound.current);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("memoryMatchDarkMode", newMode.toString());
      return newMode;
    });
    playSound(buttonSound.current);
  };

  // Toggle sound
  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const newMode = !prev;
      localStorage.setItem("memoryMatchSound", newMode.toString());
      return newMode;
    });

    // Play test sound if enabled
    if (!soundEnabled) {
      playSound(buttonSound.current);
    }
  };

  // Change theme
  const changeTheme = (themeId: string) => {
    // Check if theme is locked
    const theme = themes.find((t) => t.id === themeId);
    if (theme && theme.locked) {
      // Show unlock message
      showToast("This theme will be unlocked after you earn more achievements!", "warning");
      return;
    }

    setSelectedTheme(themeId);
    localStorage.setItem("memoryMatchTheme", themeId);
    playSound(buttonSound.current);
  };

  // Change category
  const changeCategory = (categoryId: string) => {
    // Check if category is locked
    const category = categories.find((c) => c.id === categoryId);
    if (category && category.locked) {
      // Show unlock message
      showToast("This category will be unlocked after you earn more achievements!", "warning");
      return;
    }

    setSelectedCategory(categoryId);
    localStorage.setItem("memoryMatchCategory", categoryId);
    initializeGame();
  };

  // Toggle challenge mode
  const toggleChallengeMode = () => {
    // Prevent toggling during an active game
    if (gameStarted && !gameWon) {
      showToast("Start a new game to change the challenge mode!", "warning");
      return;
    }
    
    setChallengeMode((prev) => !prev);
    playSound(buttonSound.current);
  };

  // Determine number of columns based on difficulty
  const getGridCols = () => {
    switch (difficulty) {
      case "easy":
        return "grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3"; // 6 cards = 3x2 (better for mobile)
      case "medium":
        return "grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4"; // 12 cards = 4x3 (better for mobile)
      case "hard":
        return "grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4"; // 16 cards = 4x4
    }
  };

  // Start timer when game starts
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameStarted && !gameWon && !gamePaused) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          // Check for time limit in challenge mode
          if (challengeMode && prevTimer + 1 >= timeLimit) {
            setGameWon(false);
            setGameStarted(false);
            playSound(errorSound.current);
            showToast("Time's up! Challenge failed.", "error");
            return prevTimer;
          }
          return prevTimer + 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, gameWon, gamePaused, challengeMode, timeLimit]);

  // Check if game is won
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      setGameWon(true);
      setGameStarted(false);

      // Play victory sound
      playSound(victorySound.current);

      // Update game statistics
      setTotalGamesPlayed((prev) => {
        const newTotal = prev + 1;
        localStorage.setItem("memoryMatchTotalGames", newTotal.toString());
        return newTotal;
      });

      // Update match count
      setTotalMatches((prev) => {
        const newTotal = prev + cards.length / 2;
        localStorage.setItem("memoryMatchTotalMatches", newTotal.toString());
        return newTotal;
      });

      // Update best scores
      updateBestScores();

      // Update achievements
      const achieved = updateAchievements();

      // If achievement was unlocked, unlock more content
      if (achieved) {
        const unlockedCount = achievements.filter((a) => a.unlocked).length + 1;

        // Unlock a theme if 3 achievements
        if (unlockedCount >= 3) {
          const lockedThemes = themes.filter((t) => t.locked);
          if (lockedThemes.length > 0) {
            // Simulate unlocking the first locked theme
            showToast(`You've unlocked the ${lockedThemes[0].name} theme!`, "success");
          }
        }

        // Unlock a category if 4 achievements
        if (unlockedCount >= 4) {
          const lockedCategories = categories.filter((c) => c.locked);
          if (lockedCategories.length > 0) {
            // Simulate unlocking the first locked category
            showToast(`You've unlocked the ${lockedCategories[0].name} category!`, "success");
          }
        }
      }
    }
  }, [cards]);

  // Check for card matches
  useEffect(() => {
    if (firstCard && secondCard) {
      setIsChecking(true);

      const matchStartTime = Date.now();

      if (firstCard.emoji === secondCard.emoji) {
        // Cards match
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isMatched: true, isFlipped: true }
              : card
          )
        );

        // Update current stats
        setCurrentStats((prev) => {
          const matchTime = (Date.now() - matchStartTime) / 1000;
          return {
            ...prev,
            matchesFound: prev.matchesFound + 1,
            fastestMatch:
              prev.fastestMatch === 0
                ? matchTime
                : Math.min(prev.fastestMatch, matchTime),
            longestMatch: Math.max(prev.longestMatch, matchTime),
          };
        });

        // Play match sound
        playSound(matchSound.current);

        resetSelection();
      } else {
        // Cards don't match - flip them back after a delay
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, isFlipped: false }
                : card
            )
          );

          // Play error sound
          playSound(errorSound.current);

          resetSelection();
        }, animationSpeed);
      }
    }
  }, [firstCard, secondCard, animationSpeed]);

  // Reset card selection
  const resetSelection = () => {
    setFirstCard(null);
    setSecondCard(null);
    setIsChecking(false);
  };

  // Initialize the game on component mount or difficulty/category change
  useEffect(() => {
    initializeGame();
  }, [difficulty, selectedCategory]);

  // Load best scores from local storage on component mount
  useEffect(() => {
    const savedScores = localStorage.getItem("memoryMatchBestScores");
    if (savedScores) {
      setBestScores(JSON.parse(savedScores));
    }
  }, []);

  // Get current theme
  const theme = getCurrentTheme();
  const currentTheme = darkMode ? getDarkThemeVariant(theme) : theme;

  // Determine overall background based on dark mode and theme
  const bgClass = `bg-gradient-to-br ${currentTheme.gradient} ${currentTheme.text} transition-colors duration-300`;

  // Determine card styles based on theme
  const cardBackClass = currentTheme.cardBack;

  const cardFrontClass = currentTheme.cardFront;

  const accentClass = currentTheme.accent;

  // Header and modal backgrounds
  const headerBgClass = darkMode ? "bg-slate-800" : "bg-white";
  const modalBgClass = darkMode ? "bg-slate-800" : "bg-white";

  // Get unlocked achievements count
  const unlockedAchievementsCount = achievements.filter(
    (a) => a.unlocked
  ).length;

  // JSX for the MemMatch game
  return (
    <div
      className={`flex flex-col min-h-screen ${bgClass}`}
    >
      {/* Header with company branding */}
      <header
        className={`${headerBgClass} shadow-md transition-colors duration-300`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div
              className={`w-10 h-10 ${accentClass.split(" ")[0]} rounded-lg flex items-center justify-center mr-3`}
            >
              <span className="text-white text-xl font-bold">M</span>
            </div>
            <h1
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : currentTheme.text.includes("indigo") ? "text-indigo-600" : currentTheme.text
              }`}
            >
              MemMatch
            </h1>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`${
                darkMode
                  ? "bg-slate-700 hover:bg-slate-600"
                  : "bg-slate-100 hover:bg-slate-200"
              } p-2 rounded-lg transition-colors duration-300 shadow-md cursor-pointer`}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? (
                <Sun size={18} className="text-white" />
              ) : (
                <Moon size={18} className="text-slate-700" />
              )}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`${
                darkMode
                  ? "bg-slate-700 hover:bg-slate-600"
                  : "bg-slate-100 hover:bg-slate-200"
              } p-2 rounded-lg transition cursor-pointer`}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? (
                <Volume2
                  size={18}
                  className={darkMode ? "text-white" : "text-slate-700"}
                />
              ) : (
                <VolumeX
                  size={18}
                  className={darkMode ? "text-white" : "text-slate-700"}
                />
              )}
            </button>

            {/* Settings */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`${
                darkMode
                  ? "bg-slate-700 hover:bg-slate-600"
                  : "bg-slate-100 hover:bg-slate-200"
              } p-2 rounded-lg transition cursor-pointer`}
              aria-label="Settings"
            >
              <Settings
                size={18}
                className={darkMode ? "text-white" : "text-slate-700"}
              />
            </button>

            {/* New Game */}
            <button
              onClick={initializeGame}
              className={`flex items-center ${accentClass} text-white px-4 py-2 rounded-lg transition cursor-pointer`}
            >
              <RotateCcw size={18} className="mr-2" />
              <span className="hidden sm:inline">{gameStarted && !gameWon ? "Restart" : "New Game"}</span>
            </button>

            {/* Exit Game */}
            <button
              onClick={() => {
                initializeGame();
                setShowGame(false);
              }}
              className={`flex items-center ${
                darkMode
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-red-500 hover:bg-red-600"
              } text-white px-4 py-2 rounded-lg transition cursor-pointer`}
            >
              <X size={18} className="mr-2" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg cursor-pointer"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className={`md:hidden ${headerBgClass} transition-all duration-300 border-t ${
              darkMode ? "border-slate-700" : "border-gray-200"
            }`}
          >
            <div className="px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Quick Actions Row */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={toggleDarkMode}
                  className={`${
                    darkMode
                      ? "bg-slate-700 hover:bg-slate-600 text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  } flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 cursor-pointer`}
                  aria-label="Toggle Dark Mode"
                >
                  {darkMode ? (
                    <Sun size={20} className="mb-1" />
                  ) : (
                    <Moon size={20} className="mb-1" />
                  )}
                  <span className="text-xs font-medium">Theme</span>
                </button>

                <button
                  onClick={toggleSound}
                  className={`${
                    darkMode
                      ? "bg-slate-700 hover:bg-slate-600 text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  } flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 cursor-pointer`}
                  aria-label="Toggle Sound"
                >
                  {soundEnabled ? (
                    <Volume2 size={20} className="mb-1" />
                  ) : (
                    <VolumeX size={20} className="mb-1" />
                  )}
                  <span className="text-xs font-medium">Sound</span>
                </button>

                <button
                  onClick={() => {
                    setShowSettings(!showSettings);
                    setMenuOpen(false);
                  }}
                  className={`${
                    darkMode
                      ? "bg-slate-700 hover:bg-slate-600 text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  } flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 cursor-pointer`}
                  aria-label="Settings"
                >
                  <Settings size={20} className="mb-1" />
                  <span className="text-xs font-medium">Settings</span>
                </button>
              </div>

              {/* Game Stats - Quick View */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`${
                  darkMode ? "bg-slate-700" : "bg-slate-50"
                } p-3 rounded-xl`}>
                  <div className="flex items-center">
                    <Clock size={16} className={`mr-2 ${darkMode ? "text-blue-400" : "text-indigo-600"}`} />
                    <div>
                      <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {challengeMode ? "Time Left" : "Time"}
                      </p>
                      <p className="text-sm font-bold">
                        {challengeMode
                          ? formatTime(Math.max(0, timeLimit - timer))
                          : formatTime(timer)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`${
                  darkMode ? "bg-slate-700" : "bg-slate-50"
                } p-3 rounded-xl`}>
                  <div className="flex items-center">
                    <Shuffle size={16} className={`mr-2 ${darkMode ? "text-blue-400" : "text-indigo-600"}`} />
                    <div>
                      <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Moves</p>
                      <p className="text-sm font-bold">{moves}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    initializeGame();
                    setMenuOpen(false);
                  }}
                  className={`flex items-center justify-center w-full ${accentClass} text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer shadow-sm`}
                >
                  <RotateCcw size={18} className="mr-2" />
                  <span>{gameStarted && !gameWon ? "Restart Game" : "New Game"}</span>
                </button>

                <button
                  onClick={() => {
                    initializeGame();
                    setShowGame(false);
                  }}
                  className={`flex items-center justify-center w-full ${
                    darkMode
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer shadow-sm`}
                >
                  <X size={18} className="mr-2" />
                  <span>Exit Game</span>
                </button>
              </div>

              {/* Additional Quick Actions */}
              {gameStarted && !gameWon && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      togglePause();
                      setMenuOpen(false);
                    }}
                    className={`flex items-center justify-center w-full ${
                      darkMode
                        ? "bg-slate-700 hover:bg-slate-600"
                        : "bg-slate-200 hover:bg-slate-300"
                    } text-current px-4 py-2.5 rounded-xl font-medium transition-all duration-200 cursor-pointer`}
                  >
                    {gamePaused ? "Resume Game" : "Pause Game"}
                  </button>
                </div>
              )}

              {/* Hint Button for Mobile */}
              {gameStarted && !gameWon && !gamePaused && (
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Hints Available: {hintsRemaining}
                  </span>
                  <button
                    onClick={() => {
                      showHint();
                      setMenuOpen(false);
                    }}
                    disabled={hintsRemaining === 0}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                      hintsRemaining > 0
                        ? `${darkMode ? "bg-blue-600 hover:bg-blue-700" : accentClass} text-white`
                        : `${darkMode ? "bg-slate-700" : "bg-slate-200"} ${
                            darkMode ? "text-slate-400" : "text-slate-500"
                          } cursor-not-allowed`
                    }`}
                  >
                    Use Hint
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow container mx-auto px-4 py-4 md:py-8">
        {/* Game statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 md:mb-8">
          <div
            className={`${
              darkMode ? "bg-slate-800" : "bg-white"
            } rounded-xl shadow-md p-3 md:p-4 flex items-center transition-colors duration-300`}
          >
            <div
              className={`${
                darkMode ? "bg-slate-700" : "bg-indigo-100"
              } p-2 sm:p-3 rounded-lg mr-4`}
            >
              <Clock
                size={24}
                className={darkMode ? "text-blue-500" : "text-indigo-600"}
              />
            </div>
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {challengeMode ? `Time Left` : `Time`}
              </p>
              <p className="text-xl font-bold">
                {challengeMode
                  ? formatTime(Math.max(0, timeLimit - timer))
                  : formatTime(timer)}
              </p>
            </div>
          </div>

          <div
            className={`${
              darkMode ? "bg-slate-800" : "bg-white"
            } rounded-xl shadow-md p-3 md:p-4 flex items-center transition-colors duration-300`}
          >
            <div
              className={`${
                darkMode ? "bg-slate-700" : "bg-indigo-100"
              } p-2 sm:p-3 rounded-lg mr-4`}
            >
              <Shuffle
                size={24}
                className={darkMode ? "text-blue-500" : "text-indigo-600"}
              />
            </div>
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Moves
              </p>
              <p className="text-xl font-bold">{moves}</p>
            </div>
          </div>

          <div
            className={`${
              darkMode ? "bg-slate-800" : "bg-white"
            } rounded-xl shadow-md p-3 md:p-4 flex items-center transition-colors duration-300`}
          >
            <div
              className={`${
                darkMode ? "bg-slate-700" : "bg-indigo-100"
              } p-2 sm:p-3 rounded-lg mr-4`}
            >
              <BrainCircuit
                size={24}
                className={darkMode ? "text-blue-500" : "text-indigo-600"}
              />
            </div>
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Hints
              </p>
              <div className="flex items-center">
                <p className="text-xl font-bold mr-2">{hintsRemaining}</p>
                <button
                  onClick={showHint}
                  disabled={
                    hintsRemaining === 0 ||
                    !gameStarted ||
                    gameWon ||
                    gamePaused
                  }
                  className={`text-xs px-2 py-1 rounded-md cursor-pointer ${
                    hintsRemaining > 0 && gameStarted && !gameWon && !gamePaused
                      ? `${
                          darkMode
                            ? "bg-blue-600 hover:bg-blue-700"
                            : accentClass
                        } text-white`
                      : `${darkMode ? "bg-slate-700" : "bg-slate-200"} ${
                          darkMode ? "text-slate-400" : "text-slate-500"
                        } cursor-not-allowed`
                  }`}
                >
                  Use
                </button>
              </div>
            </div>
          </div>

          <div
            className={`${
              darkMode ? "bg-slate-800" : "bg-white"
            } rounded-xl shadow-md p-3 md:p-4 flex items-center transition-colors duration-300`}
          >
            <div
              className={`${
                darkMode ? "bg-slate-700" : "bg-indigo-100"
              } p-3 rounded-lg mr-4`}
            >
              <Trophy
                size={24}
                className={darkMode ? "text-blue-500" : "text-indigo-600"}
              />
            </div>
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Stats
              </p>
              <button
                onClick={() => setShowStats(!showStats)}
                className={`text-xs px-2 py-1 rounded-md ${
                  darkMode ? "bg-blue-600 hover:bg-blue-700" : accentClass
                } text-white cursor-pointer`}
              >
                View
              </button>
            </div>
          </div>
        </div>

        {/* Game controls */}
        <div
          className={`${
            darkMode ? "bg-slate-800" : "bg-white"
          } rounded-xl shadow-md p-3 md:p-4 mb-4 md:mb-8 transition-colors duration-300`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Difficulty selector */}
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                } mb-2`}
              >
                Difficulty
              </p>
              <div className="flex space-x-2">
                {(["easy", "medium", "hard"] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                      difficulty === level
                        ? `${
                            darkMode
                              ? "bg-blue-600"
                              : theme.accent.split(" ")[0]
                          } text-white shadow-md`
                        : `${darkMode ? "bg-slate-700" : "bg-slate-100"} ${
                            darkMode ? "text-slate-300" : "text-slate-600"
                          } ${
                            darkMode
                              ? "hover:bg-slate-600"
                              : "hover:bg-slate-200"
                          }`
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Category selector */}
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                } mb-2`}
              >
                Category
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => changeCategory(category.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center cursor-pointer ${
                      selectedCategory === category.id
                        ? `${
                            darkMode
                              ? "bg-blue-600"
                              : theme.accent.split(" ")[0]
                          } text-white shadow-md`
                        : `${darkMode ? "bg-slate-700" : "bg-slate-100"} ${
                            darkMode ? "text-slate-300" : "text-slate-600"
                          } ${
                            darkMode
                              ? "hover:bg-slate-600"
                              : "hover:bg-slate-200"
                          }`
                    }`}
                  >
                    {category.locked && <Lock size={14} className="mr-1" />}
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Game mode options */}
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                } mb-2`}
              >
                Game Mode
              </p>
              <div className="flex items-center mb-2">
                <label htmlFor="challengeMode" className={`relative inline-flex items-center ${
                  gameStarted && !gameWon ? "cursor-not-allowed" : "cursor-pointer"
                }`}>
                  <input
                    type="checkbox"
                    id="challengeMode"
                    checked={challengeMode}
                    onChange={toggleChallengeMode}
                    disabled={gameStarted && !gameWon}
                    className="sr-only peer"
                  />
                  <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 peer-focus:outline-none peer-focus:ring-4 ${
                    gameStarted && !gameWon
                      ? darkMode 
                        ? "bg-slate-800 opacity-50" 
                        : "bg-slate-300 opacity-50"
                      : darkMode 
                        ? "peer-focus:ring-blue-800 bg-slate-700 peer-checked:bg-blue-600" 
                        : "peer-focus:ring-blue-300 bg-slate-200 peer-checked:bg-blue-600"
                  }`}>
                    <div className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-300 peer-checked:translate-x-full peer-checked:border-white ${
                      challengeMode ? "translate-x-full" : ""
                    } ${
                      gameStarted && !gameWon ? "opacity-70" : ""
                    }`}></div>
                  </div>
                  <span className={`ml-3 text-sm font-medium ${
                    gameStarted && !gameWon 
                      ? darkMode ? "text-slate-500" : "text-slate-400"
                      : ""
                  }`}>
                    Challenge Mode (Time Limit)
                    {gameStarted && !gameWon && (
                      <span className={`text-xs ml-2 ${
                        darkMode ? "text-slate-600" : "text-slate-500"
                      }`}>
                        - Disabled during game
                      </span>
                    )}
                  </span>
                </label>
              </div>
              {challengeMode && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Time Limit
                    </span>
                    <span className={`text-sm font-semibold px-2 py-1 rounded-md ${
                      darkMode ? "bg-slate-700 text-blue-400" : "bg-blue-50 text-blue-600"
                    }`}>
                      {Math.floor(timeLimit / 60)}:{(timeLimit % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="60"
                      max="300"
                      step="30"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                      disabled={gameStarted && !gameWon}
                      className={`w-full h-2 rounded-lg appearance-none transition-all duration-200 ${
                        gameStarted && !gameWon
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      } ${
                        darkMode 
                          ? "bg-slate-700 focus:bg-slate-600" 
                          : "bg-slate-200 focus:bg-slate-300"
                      } slider-thumb`}
                      style={{
                        background: darkMode 
                          ? `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((timeLimit - 60) / (300 - 60)) * 100}%, #475569 ${((timeLimit - 60) / (300 - 60)) * 100}%, #475569 100%)`
                          : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((timeLimit - 60) / (300 - 60)) * 100}%, #e2e8f0 ${((timeLimit - 60) / (300 - 60)) * 100}%, #e2e8f0 100%)`
                      }}
                    />
                    <div className="flex justify-between mt-1 text-xs opacity-70">
                      <span>1m</span>
                      <span>2.5m</span>
                      <span>5m</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Best score display */}
        {bestScores[difficulty] && (
          <div
            className={`${
              darkMode ? "bg-slate-800" : "bg-white"
            } rounded-xl shadow-md p-3 sm:p-4 md:p-6 mb-4 md:mb-8 transition-colors duration-300`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0">
              {/* Medal Icon and Score Info */}
              <div className="flex items-center flex-1 min-w-0">
                <div
                  className={`${
                    darkMode ? "bg-amber-800" : "bg-amber-100"
                  } p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0`}
                >
                  <Medal
                    size={20}
                    className={`sm:w-6 sm:h-6 ${darkMode ? "text-amber-400" : "text-amber-600"}`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs sm:text-sm ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    } mb-1`}
                  >
                    Best Score ({difficulty})
                  </p>
                  <p className="text-base sm:text-lg md:text-xl font-bold leading-tight break-words">
                    {bestScores[difficulty]?.moves} moves in{" "}
                    {formatTime(bestScores[difficulty]?.time || 0)}
                  </p>
                </div>
              </div>

              {/* Achievements Button */}
              <div className="w-full sm:w-auto sm:ml-4 flex-shrink-0">
                <button
                  onClick={() => setShowAchievements(!showAchievements)}
                  className={`w-full sm:w-auto text-xs sm:text-sm px-3 py-2 rounded-lg ${
                    darkMode
                      ? "bg-amber-800 hover:bg-amber-700 text-white"
                      : "bg-amber-100 hover:bg-amber-200 text-amber-800"
                  } flex items-center justify-center cursor-pointer transition-colors duration-200`}
                >
                  <Gift size={12} className="mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">
                    Achievements ({unlockedAchievementsCount}/{achievements.length})
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game control buttons */}
        {gameStarted && !gameWon && (
          <div className="flex justify-center mb-6">
            <button
              onClick={togglePause}
              className={`px-4 py-2 rounded-lg text-white shadow-md transition-colors cursor-pointer ${
                darkMode ? "bg-blue-600 hover:bg-blue-700" : accentClass
              }`}
            >
              {gamePaused ? "Resume Game" : "Pause Game"}
            </button>
          </div>
        )}

        {/* Pause overlay */}
        {gamePaused && (
          <div className="fixed inset-0 bg-black/40 bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div
              className={`${modalBgClass} rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center transition-colors duration-300`}
            >
              <h2
                className={`text-3xl font-bold ${
                  darkMode ? "text-white" : "text-indigo-600"
                } mb-6`}
              >
                Game Paused
              </h2>
              <button
                onClick={togglePause}
                className={`px-6 py-3 rounded-lg text-white shadow-md transition-colors ${accentClass} cursor-pointer`}
              >
                Resume Game
              </button>
            </div>
          </div>
        )}

        {/* Tutorial overlay */}
        {showTutorial && (
          <div className="fixed inset-0 bg-black/40 bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm">
            <div
              className={`${modalBgClass} rounded-2xl shadow-2xl p-8 max-w-lg mx-4 text-center transition-colors duration-300`}
            >
              <h2
                className={`text-3xl font-bold ${
                  darkMode ? "text-white" : "text-indigo-600"
                } mb-4`}
              >
                Welcome to MemMatch!
              </h2>
              <div className="text-left mb-6">
                <h3 className="text-xl font-semibold mb-2">How to Play:</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Cards are shuffled and placed face down</li>
                  <li>Click on a card to flip it over</li>
                  <li>Try to find matching pairs</li>
                  <li>Remember card positions to minimize moves</li>
                  <li>Match all pairs to win the game</li>
                </ol>

                <h3 className="text-xl font-semibold mt-4 mb-2">Features:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Choose different difficulty levels</li>
                  <li>Use hints when you get stuck</li>
                  <li>Track your best scores</li>
                  <li>Earn achievements to unlock themes</li>
                  <li>Challenge mode with time limits</li>
                </ul>
              </div>
              <button
                onClick={() => setShowTutorial(false)}
                className={`px-6 py-3 rounded-lg text-white shadow-md transition-colors ${accentClass} cursor-pointer`}
              >
                Start Playing
              </button>
            </div>
          </div>
        )}

        {/* Settings panel */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/40 bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm px-4">
            <div
              className={`w-full max-w-lg ${modalBgClass} rounded-2xl shadow-2xl p-6 sm:p-8 transition-colors duration-300`}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2
                  className={`text-xl sm:text-2xl font-bold ${
                    darkMode ? "text-white" : "text-indigo-600"
                  }`}
                >
                  Game Settings
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className={`p-2 rounded-full ${
                    darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
                  } cursor-pointer`}
                  aria-label="Close Settings"
                >
                  ✕
                </button>
              </div>

              {/* Settings Sections */}
              <div className="space-y-6 text-sm sm:text-base">
                {/* Theme selector */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Visual Theme</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => changeTheme(theme.id)}
                        className={`p-3 rounded-xl flex items-center justify-between ${
                          theme.id === selectedTheme
                            ? "ring-2 ring-offset-2 ring-blue-500"
                            : ""
                        } ${theme.gradient} transition-all duration-300 cursor-pointer`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${
                              theme.accent.split(" ")[0]
                            } mr-2 flex-shrink-0`}
                          ></div>
                          <div className="font-medium truncate">
                            {theme.name}
                          </div>
                        </div>
                        {theme.locked && <Lock size={16} className="ml-2" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animation speed */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Animation Speed
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Speed
                    </span>
                    <span className={`text-sm font-semibold px-2 py-1 rounded-md ${
                      darkMode ? "bg-slate-700 text-blue-400" : "bg-blue-50 text-blue-600"
                    }`}>
                      {animationSpeed}ms
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="200"
                      max="1000"
                      step="100"
                      value={animationSpeed}
                      onChange={(e) =>
                        setAnimationSpeed(parseInt(e.target.value))
                      }
                      className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-all duration-200 ${
                        darkMode 
                          ? "bg-slate-700 focus:bg-slate-600" 
                          : "bg-slate-200 focus:bg-slate-300"
                      } slider-thumb`}
                      style={{
                        background: darkMode 
                          ? `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((animationSpeed - 200) / (1000 - 200)) * 100}%, #475569 ${((animationSpeed - 200) / (1000 - 200)) * 100}%, #475569 100%)`
                          : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((animationSpeed - 200) / (1000 - 200)) * 100}%, #e2e8f0 ${((animationSpeed - 200) / (1000 - 200)) * 100}%, #e2e8f0 100%)`
                      }}
                    />
                    <div className="flex justify-between mt-1 text-xs opacity-70">
                      <span>Fast</span>
                      <span>Medium</span>
                      <span>Slow</span>
                    </div>
                  </div>
                </div>

                {/* Sound and dark mode toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center group">
                    <label htmlFor="soundToggle" className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="soundToggle"
                        checked={soundEnabled}
                        onChange={toggleSound}
                        className="sr-only peer"
                      />
                      <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 peer-focus:outline-none peer-focus:ring-4 ${
                        darkMode 
                          ? "peer-focus:ring-blue-800 bg-slate-700 peer-checked:bg-blue-600" 
                          : "peer-focus:ring-blue-300 bg-slate-200 peer-checked:bg-blue-600"
                      }`}>
                        <div className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-300 peer-checked:translate-x-full peer-checked:border-white ${
                          soundEnabled ? "translate-x-full" : ""
                        }`}></div>
                      </div>
                      <span className="ml-3 text-sm font-medium truncate">Sound Effects</span>
                    </label>
                  </div>
                  <div className="flex items-center group">
                    <label htmlFor="darkModeToggle" className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="darkModeToggle"
                        checked={darkMode}
                        onChange={toggleDarkMode}
                        className="sr-only peer"
                      />
                      <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 peer-focus:outline-none peer-focus:ring-4 ${
                        darkMode 
                          ? "peer-focus:ring-blue-800 bg-slate-700 peer-checked:bg-blue-600" 
                          : "peer-focus:ring-blue-300 bg-slate-200 peer-checked:bg-blue-600"
                      }`}>
                        <div className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-300 peer-checked:translate-x-full peer-checked:border-white ${
                          darkMode ? "translate-x-full" : ""
                        }`}></div>
                      </div>
                      <span className="ml-3 text-sm font-medium truncate">Dark Mode</span>
                    </label>
                  </div>
                </div>

                {/* Tutorial button */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setShowSettings(false);
                      setShowTutorial(true);
                    }}
                    className="flex items-center text-blue-600 dark:text-blue-400 cursor-pointer"
                  >
                    <HelpCircle size={16} className="mr-2" />
                    <span>Show Tutorial</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats panel */}
        {showStats && (
          <div className="fixed inset-0 bg-black/40 bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div
              className={`${
                darkMode ? "bg-slate-800" : "bg-white"
              } rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg mx-4 transition-colors duration-300 max-h-[90vh] overflow-y-auto`}
            >
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2
                  className={`text-xl sm:text-2xl font-bold ${
                    darkMode ? "text-white" : "text-indigo-600"
                  }`}
                >
                  Game Statistics
                </h2>
                <button
                  onClick={() => setShowStats(false)}
                  className={`p-2 rounded-full ${
                    darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
                  } transition-colors duration-200 cursor-pointer`}
                  aria-label="Close statistics"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div
                    className={`p-3 sm:p-4 rounded-xl ${
                      darkMode ? "bg-slate-700" : "bg-slate-100"
                    }`}
                  >
                    <p
                      className={`text-xs sm:text-sm ${
                        darkMode ? "text-slate-400" : "text-slate-500"
                      } mb-1`}
                    >
                      Games Played
                    </p>
                    <p className="text-xl sm:text-2xl font-bold">{totalGamesPlayed}</p>
                  </div>
                  <div
                    className={`p-3 sm:p-4 rounded-xl ${
                      darkMode ? "bg-slate-700" : "bg-slate-100"
                    }`}
                  >
                    <p
                      className={`text-xs sm:text-sm ${
                        darkMode ? "text-slate-400" : "text-slate-500"
                      } mb-1`}
                    >
                      Total Matches Found
                    </p>
                    <p className="text-xl sm:text-2xl font-bold">{totalMatches}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Best Scores</h3>
                  <div
                    className={`p-3 sm:p-4 rounded-xl ${
                      darkMode ? "bg-slate-700" : "bg-slate-100"
                    }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <p
                          className={`text-xs sm:text-sm ${
                            darkMode ? "text-slate-400" : "text-slate-500"
                          } mb-1`}
                        >
                          Easy
                        </p>
                        <p className="text-sm sm:text-base font-semibold leading-tight">
                          {bestScores.easy
                            ? `${bestScores.easy.moves} moves in ${formatTime(
                                bestScores.easy.time
                              )}`
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <p
                          className={`text-xs sm:text-sm ${
                            darkMode ? "text-slate-400" : "text-slate-500"
                          } mb-1`}
                        >
                          Medium
                        </p>
                        <p className="text-sm sm:text-base font-semibold leading-tight">
                          {bestScores.medium
                            ? `${bestScores.medium.moves} moves in ${formatTime(
                                bestScores.medium.time
                              )}`
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <p
                          className={`text-xs sm:text-sm ${
                            darkMode ? "text-slate-400" : "text-slate-500"
                          } mb-1`}
                        >
                          Hard
                        </p>
                        <p className="text-sm sm:text-base font-semibold leading-tight">
                          {bestScores.hard
                            ? `${bestScores.hard.moves} moves in ${formatTime(
                                bestScores.hard.time
                              )}`
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Current Game</h3>
                  <div
                    className={`p-3 sm:p-4 rounded-xl ${
                      darkMode ? "bg-slate-700" : "bg-slate-100"
                    }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <p
                          className={`text-xs sm:text-sm ${
                            darkMode ? "text-slate-400" : "text-slate-500"
                          } mb-1`}
                        >
                          Matches Found
                        </p>
                        <p className="text-xl sm:text-2xl font-bold">
                          {currentStats.matchesFound}
                        </p>
                      </div>
                      <div>
                        <p
                          className={`text-xs sm:text-sm ${
                            darkMode ? "text-slate-400" : "text-slate-500"
                          } mb-1`}
                        >
                          Hints Used
                        </p>
                        <p className="text-xl sm:text-2xl font-bold">
                          {currentStats.hintsUsed}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowStats(false)}
                  className={`w-full py-3 rounded-lg text-white shadow-md transition-colors ${accentClass} cursor-pointer`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Achievements panel */}
        {showAchievements && (
          <div className="fixed inset-0 bg-black/40 bg-opacity-70 flex items-center justify-center z-100 backdrop-blur-sm p-4">
            <div
              className={`${modalBgClass} rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg mx-4 transition-colors duration-300 max-h-[90vh] overflow-y-auto`}
            >
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2
                  className={`text-xl sm:text-2xl font-bold ${
                    darkMode ? "text-white" : "text-indigo-600"
                  }`}
                >
                  Achievements
                </h2>
                <button
                  onClick={() => setShowAchievements(false)}
                  className={`p-2 rounded-full ${
                    darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
                  } transition-colors duration-200 cursor-pointer`}
                  aria-label="Close achievements"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 sm:p-4 rounded-xl transition-all duration-200 ${
                      achievement.unlocked
                        ? darkMode
                          ? "bg-slate-700"
                          : "bg-slate-100"
                        : darkMode
                        ? "bg-slate-900 opacity-70"
                        : "bg-slate-200 opacity-70"
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${
                          achievement.unlocked
                            ? darkMode
                              ? "bg-blue-900"
                              : "bg-blue-100"
                            : darkMode
                            ? "bg-slate-800"
                            : "bg-slate-300"
                        }`}
                      >
                        <div className="w-5 h-5 sm:w-6 sm:h-6">
                          {achievement.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-sm sm:text-base truncate">
                            {achievement.name}
                          </h3>
                          {achievement.unlocked && (
                            <span
                              className={`px-2 py-1 rounded-full text-xs whitespace-nowrap flex-shrink-0 ${
                                darkMode
                                  ? "bg-green-900 text-green-300"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              Unlocked
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                            darkMode ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p
                  className={`text-xs sm:text-sm ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  } mb-3 sm:mb-4 text-center leading-relaxed`}
                >
                  Unlock achievements to access more themes and categories!
                </p>
                <button
                  onClick={() => setShowAchievements(false)}
                  className={`w-full py-2.5 sm:py-3 rounded-lg text-white shadow-md transition-colors text-sm sm:text-base font-medium ${
                    darkMode ? "bg-blue-600 hover:bg-blue-700" : accentClass
                  } cursor-pointer`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Win overlay */}
        {gameWon && (
          <div
            className="fixed inset-0 bg-indigo-900 bg-opacity-80 flex items-center justify-center z-[60] backdrop-blur-sm"
            style={{ animation: "fadeIn 0.5s ease-out forwards" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`${
                darkMode ? "bg-slate-800" : "bg-white"
              } rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center transition-colors duration-300`}
              style={{ animation: "scaleIn 0.5s ease-out forwards" }}
            >
              <div
                className={`w-20 h-20 ${
                  darkMode ? "bg-blue-900" : "bg-indigo-100"
                } rounded-full flex items-center justify-center mx-auto mb-6`}
              >
                <Trophy
                  size={40}
                  className={darkMode ? "text-yellow-500" : "text-indigo-600"}
                />
              </div>
              <h2
                className={`text-3xl font-bold ${
                  darkMode ? "text-white" : "text-indigo-600"
                } mb-4`}
              >
                Congratulations!
              </h2>
              <p
                className={`text-xl ${
                  darkMode ? "text-slate-300" : "text-slate-600"
                } mb-6`}
              >
                You've matched all the cards!
              </p>

              {isNewBestScore() && (
                <div
                  className={`${
                    darkMode ? "bg-amber-900" : "bg-amber-50"
                  } p-4 rounded-xl mb-6`}
                  style={{ animation: "pulse 2s infinite" }}
                >
                  <p
                    className={`${
                      darkMode ? "text-amber-300" : "text-amber-600"
                    } font-bold`}
                  >
                    New Best Score!
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div
                  className={`${
                    darkMode ? "bg-slate-700" : "bg-indigo-50"
                  } p-4 rounded-xl`}
                >
                  <p
                    className={`text-sm ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Time
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-indigo-600"
                    }`}
                  >
                    {formatTime(timer)}
                  </p>
                </div>
                <div
                  className={`${
                    darkMode ? "bg-slate-700" : "bg-indigo-50"
                  } p-4 rounded-xl`}
                >
                  <p
                    className={`text-sm ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Moves
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-indigo-600"
                    }`}
                  >
                    {moves}
                  </p>
                </div>
              </div>

              {/* Achievement unlocked notification */}
              {achievements.some((a) => a.unlocked) &&
                unlockedAchievementsCount > 0 && (
                  <div
                    className={`${
                      darkMode ? "bg-blue-900" : "bg-blue-50"
                    } p-4 rounded-xl mb-6`}
                  >
                    <p
                      className={`${
                        darkMode ? "text-blue-300" : "text-blue-600"
                      } font-semibold flex items-center justify-center`}
                    >
                      <Gift size={18} className="mr-2" />
                      Achievements Unlocked! ({unlockedAchievementsCount}/
                      {achievements.length})
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAchievements(true);
                      }}
                      className={`mt-2 text-sm px-4 py-1 rounded-lg transition-colors cursor-pointer ${
                        darkMode
                          ? "bg-blue-700 hover:bg-blue-600 text-white"
                          : "bg-blue-100 hover:bg-blue-200 text-blue-700"
                      }`}
                    >
                      View Achievements
                    </button>
                  </div>
                )}

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    initializeGame();
                  }}
                  className={`${accentClass} text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300 shadow-md cursor-pointer`}
                >
                  Play Again
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    shareResults();
                  }}
                  className={`${
                    darkMode
                      ? "bg-slate-700 border-2 border-slate-600 text-white hover:bg-slate-600"
                      : "bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                  } py-3 px-6 rounded-lg font-medium transition-colors duration-300 shadow-md flex items-center justify-center cursor-pointer`}
                >
                  <Share2 size={18} className="mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game board */}
        <div className="mt-8 md:mt-20 mb-8 md:mb-12 pt-4 md:pt-12 py-4 md:py-8 max-h-[50vh] md:max-h-[40vh] flex items-center justify-center">
          <div className={`grid ${getGridCols()} gap-2 sm:gap-2 w-full max-w-sm sm:max-w-sm md:max-w-md mx-auto`}>
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={`aspect-square transform transition-transform duration-300 ${
                  card.isMatched
                    ? "opacity-60 scale-100 cursor-default border-2 border-green-400 rounded-lg "
                    : `${
                        hintUsed ? "hover:scale-100" : "hover:scale-105"
                      } cursor-pointer`
                }`}
                style={{ perspective: "1000px" }}
              >
                <div
                  className={`relative w-full h-full transition-all duration-${
                    animationSpeed / 100
                  } ${card.isMatched ? "opacity-80" : ""}`}
                  style={{
                    transformStyle: "preserve-3d",
                    transform:
                      card.isFlipped || card.isMatched ? "rotateY(180deg)" : "",
                  }}
                >
                  {/* Card back */}
                  <div
                    className={`absolute w-full h-full ${cardBackClass} rounded-lg shadow-sm flex items-center justify-center border ${
                      darkMode ? "border-slate-700" : "border-indigo-100"
                    }`}
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div
                      className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${accentClass.split(" ")[0]} rounded-sm flex items-center justify-center`}
                    >
                      <span className="text-white text-xs md:text-sm font-bold">M</span>
                    </div>
                  </div>

                  {/* Card front */}
                  <div
                    className={`absolute w-full h-full bg-gradient-to-br ${cardFrontClass} rounded-lg shadow-sm flex items-center justify-center`}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">{card.emoji}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Toast notifications */}
      <div className="fixed top-4 left-4 right-4 sm:top-4 sm:right-4 sm:left-auto sm:w-96 sm:max-w-96 z-[70] space-y-2 sm:space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`w-full shadow-lg rounded-lg pointer-events-auto overflow-hidden transform transition-all duration-300 ease-in-out ${
              darkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200"
            } ${
              toast.type === 'success' ? 'border-l-4 border-l-green-500' :
              toast.type === 'error' ? 'border-l-4 border-l-red-500' :
              toast.type === 'warning' ? 'border-l-4 border-l-yellow-500' :
              'border-l-4 border-l-blue-500'
            }`}
            style={{
              animation: "slideInRight 0.3s ease-out forwards"
            }}
          >
            <div className="p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {toast.type === 'success' && (
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                  )}
                  {toast.type === 'error' && (
                    <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
                  )}
                  {toast.type === 'warning' && (
                    <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                  )}
                  {toast.type === 'info' && (
                    <BrainCircuit className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <p className={`text-sm sm:text-base font-medium leading-relaxed break-words ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {toast.message}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 cursor-pointer ${
                      darkMode 
                        ? "text-slate-400 hover:text-slate-300 hover:bg-slate-700 focus:ring-slate-500" 
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:ring-indigo-500"
                    }`}
                    onClick={() => removeToast(toast.id)}
                    aria-label="Dismiss notification"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer
        className={`${
          darkMode ? "bg-slate-900" : "bg-slate-800"
        } text-white py-6 mt-8 transition-colors duration-300`}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white rounded-lg flex items-center justify-center mr-3">
                  <span
                    className={`${
                      darkMode
                        ? "text-blue-600"
                        : "text-indigo-600"
                    } text-lg sm:text-xl font-bold`}
                  >
                    M
                  </span>
                </div>
                <h2 className="text-xl font-bold">MemMatch</h2>
              </div>
              <p className="text-slate-400 text-sm mt-2">
                © 2025 MemMatch Inc. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4 sm:space-x-6">
              <a
                href="#"
                className="text-slate-300 hover:text-white transition-colors duration-300 cursor-pointer text-sm sm:text-base"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-slate-300 hover:text-white transition-colors duration-300 cursor-pointer text-sm sm:text-base"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-slate-300 hover:text-white transition-colors duration-300 cursor-pointer text-sm sm:text-base"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 640px) {
          @keyframes slideInRight {
            from {
              transform: translateY(-20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        }

        .slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
          border: 2px solid white;
        }

        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
        }

        .slider-thumb::-webkit-slider-thumb:active {
          transform: scale(1.1);
        }

        .slider-thumb::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
          border: 2px solid white;
          -moz-appearance: none;
        }

        .slider-thumb::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
        }

        .slider-thumb:focus {
          outline: none;
        }

        .slider-thumb:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
      `}</style>
    </div>
  );
};

const MemoryMatch: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showGame, setShowGame] = useState(false);

  // Initialize darkMode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("memoryMatchDarkMode");
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === "true");
    } else {
      localStorage.setItem("memoryMatchDarkMode", "true"); // Default to dark mode
    }
  }, []);

  // Lock/unlock body scroll when mobile menu is open/closed
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Clean up on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("memoryMatchDarkMode", newMode.toString());
      return newMode;
    });
  };

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setActiveSection(sectionId);
    setMenuOpen(false);
  };

  // Features data
  const features = [
    {
      title: "Multiple Difficulty Levels",
      description:
        "Challenge yourself with easy, medium, or hard levels featuring different grid sizes and complexity.",
      icon: <Brain className="w-12 h-12" />,
    },
    {
      title: "Various Card Categories",
      description:
        "Choose from different card categories like animals, foods, travel and more to keep the game fresh.",
      icon: <Shuffle className="w-12 h-12" />,
    },
    {
      title: "Achievements System",
      description:
        "Earn achievements and unlock new themes and categories as you improve your skills.",
      icon: <Trophy className="w-12 h-12" />,
    },
    {
      title: "Time Challenge Mode",
      description:
        "Race against the clock with configurable time limits for an extra challenge.",
      icon: <Clock className="w-12 h-12" />,
    },
    {
      title: "Statistics Tracking",
      description:
        "Track your progress with detailed statistics about your performance and improvements.",
      icon: <Award className="w-12 h-12" />,
    },
    {
      title: "Customizable Themes",
      description:
        "Personalize your gaming experience with multiple visual themes and color schemes.",
      icon: <Gift className="w-12 h-12" />,
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Regular Player",
      content:
        "MemMatch has become my go-to brain training app. The variety of difficulty levels and categories keeps me engaged, and I've noticed real improvements in my memory.",
      rating: 5,
    },
    {
      name: "Sarah Miller",
      role: "Teacher",
      content:
        "I use MemMatch with my students as a fun educational activity. The kids love unlocking new themes and the competitive aspect keeps them motivated to improve.",
      rating: 5,
    },
    {
      name: "David Chen",
      role: "Game Enthusiast",
      content:
        "What I love about MemMatch is the perfect balance of challenge and fun. The achievement system gives me goals to work toward, and the stats help me track my progress.",
      rating: 4,
    },
  ];

  // Pricing plans
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "Basic game modes",
        "3 difficulty levels",
        "2 card categories",
        "Basic statistics",
        "Dark/Light mode",
      ],
      cta: "Play Now",
      popular: false,
    },
    {
      name: "Premium",
      price: "$4.99",
      period: "monthly",
      features: [
        "All game modes",
        "All difficulty levels",
        "All card categories",
        "Advanced statistics",
        "Priority updates",
        "No advertisements",
        "Cloud save progress",
      ],
      cta: "Get Premium",
      popular: true,
    },
    {
      name: "Family",
      price: "$9.99",
      period: "monthly",
      features: [
        "Everything in Premium",
        "Up to 5 user profiles",
        "Family leaderboards",
        "Multiplayer challenges",
        "Parental controls",
        "Premium support",
      ],
      cta: "Choose Family",
      popular: false,
    },
  ];

  return (
    <div style={{ fontFamily: "var(--font-roboto), sans-serif" }}>
      {showGame ? (
        <Game setShowGame={setShowGame} />
      ) : (
        <div
          className={`min-h-screen flex flex-col ${
            darkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"
          } transition-colors duration-300`}
        >
          {/* Navbar */}
          <nav
            className={`fixed w-full z-50 ${
              darkMode ? "bg-slate-800" : "bg-white"
            } shadow-md transition-colors duration-300`}
          >
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center py-4">
                {/* Logo */}
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 ${
                      darkMode ? "bg-blue-600" : "bg-indigo-600"
                    } rounded-lg flex items-center justify-center mr-3`}
                  >
                    <span className="text-white text-xl font-bold">M</span>
                  </div>
                  <h1
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-indigo-600"
                    }`}
                  >
                    MemMatch
                  </h1>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex space-x-8">
                  <button
                    onClick={() => scrollToSection("home")}
                    className={`font-medium transition-colors duration-300 cursor-pointer ${
                      activeSection === "home"
                        ? darkMode
                          ? "text-blue-400"
                          : "text-indigo-600"
                        : ""
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => scrollToSection("features")}
                    className={`font-medium transition-colors duration-300 cursor-pointer ${
                      activeSection === "features"
                        ? darkMode
                          ? "text-blue-400"
                          : "text-indigo-600"
                        : ""
                    }`}
                  >
                    Features
                  </button>
                  <button
                    onClick={() => scrollToSection("testimonials")}
                    className={`font-medium transition-colors duration-300 cursor-pointer ${
                      activeSection === "testimonials"
                        ? darkMode
                          ? "text-blue-400"
                          : "text-indigo-600"
                        : ""
                    }`}
                  >
                    Testimonials
                  </button>
                </div>

                {/* Right side buttons */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleDarkMode}
                    className={`${
                      darkMode
                        ? "bg-slate-700 hover:bg-slate-600"
                        : "bg-slate-100 hover:bg-slate-200"
                    } p-2 rounded-lg transition-colors duration-300 shadow-md cursor-pointer`}
                    aria-label={
                      darkMode ? "Switch to light mode" : "Switch to dark mode"
                    }
                  >
                    {darkMode ? (
                      <Sun size={18} className="text-white" />
                    ) : (
                      <Moon size={18} className="text-slate-700" />
                    )}
                  </button>
                  <button
                    onClick={() => setShowGame(!showGame)}
                    className={`hidden md:flex items-center ${
                      darkMode
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md cursor-pointer`}
                  >
                    {showGame ? "Hide Game" : "Play Now"}
                  </button>

                  {/* Mobile menu button */}
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden p-2 rounded-lg cursor-pointer"
                    aria-label="Toggle menu"
                  >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                </div>
              </div>
            </div>
            {/* loveleen */}
            {/* Mobile Navigation Menu */}
            {menuOpen && (
              <div
                className={`md:hidden ${
                  darkMode ? "bg-slate-800" : "bg-white"
                } py-4 px-4 shadow-lg transition-all duration-300 max-h-screen overflow-y-auto`}
              >
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={() => scrollToSection("home")}
                    className={`font-medium p-2 rounded-lg cursor-pointer ${
                      activeSection === "home"
                        ? darkMode
                          ? "bg-slate-700 text-blue-400"
                          : "bg-slate-100 text-indigo-600"
                        : ""
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => scrollToSection("features")}
                    className={`font-medium p-2 rounded-lg cursor-pointer ${
                      activeSection === "features"
                        ? darkMode
                          ? "bg-slate-700 text-blue-400"
                          : "bg-slate-100 text-indigo-600"
                        : ""
                    }`}
                  >
                    Features
                  </button>
                  <button
                    onClick={() => scrollToSection("testimonials")}
                    className={`font-medium p-2 rounded-lg cursor-pointer ${
                      activeSection === "testimonials"
                        ? darkMode
                          ? "bg-slate-700 text-blue-400"
                          : "bg-slate-100 text-indigo-600"
                        : ""
                    }`}
                  >
                    Testimonials
                  </button>

                  <button
                    onClick={() => setShowGame(!showGame)}
                    className={`flex items-center justify-center ${
                      darkMode
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md cursor-pointer`}
                  >
                    {showGame ? "Hide Game" : "Play Now"}
                  </button>
                </div>
              </div>
            )}
          </nav>

          {/* Main Content */}
          <div className="pt-20">
            {/* Hero Section */}
            <section id="home" className="py-12 sm:py-16 md:py-24">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 mb-8 sm:mb-10 md:mb-0">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                      Train Your Brain with{" "}
                      <span
                        className={
                          darkMode ? "text-blue-400" : "text-indigo-600"
                        }
                      >
                        MemMatch
                      </span>
                    </h1>
                    <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-80 leading-relaxed">
                      Challenge your memory with our engaging card-matching
                      game. Improve focus, concentration, and cognitive skills
                      while having fun.
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                      <button
                        onClick={() => setShowGame(true)}
                        className={`flex items-center justify-center ${
                          darkMode
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        } text-white px-6 py-3 rounded-lg transition-colors duration-300 shadow-md text-base sm:text-lg cursor-pointer`}
                      >
                        Play Now <ChevronRight size={20} className="ml-2" />
                      </button>
                      <button
                        onClick={() => scrollToSection("features")}
                        className={`flex items-center justify-center ${
                          darkMode
                            ? "bg-slate-800 hover:bg-slate-700 border border-slate-700"
                            : "bg-white hover:bg-slate-50 border border-slate-200"
                        } px-6 py-3 rounded-lg transition-colors duration-300 shadow-md text-base sm:text-lg cursor-pointer`}
                      >
                        See Features
                      </button>
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <div
                      className={`${
                        darkMode ? "bg-slate-800" : "bg-slate-100"
                      } rounded-xl shadow-xl overflow-hidden transition-colors duration-300 p-3 sm:p-4 md:p-6`}
                    >
                      <div className="aspect-video rounded-lg overflow-hidden shadow-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <div className="text-center text-white p-4 sm:p-6 md:p-8 w-full">
                          <div className="flex justify-center mb-3 sm:mb-4">
                            <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-xs">
                              {[...Array(8)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`aspect-square ${
                                    i % 3 === 0 ? "bg-white/20" : "bg-white/10"
                                  } rounded-lg flex items-center justify-center ${
                                    i % 5 === 0 ? "animate-pulse" : ""
                                  }`}
                                >
                                  {i % 4 === 0 && (
                                    <span className="text-lg sm:text-xl md:text-2xl">🎮</span>
                                  )}
                                  {i % 4 === 1 && (
                                    <span className="text-lg sm:text-xl md:text-2xl">🧠</span>
                                  )}
                                  {i % 4 === 2 && (
                                    <span className="text-lg sm:text-xl md:text-2xl">🏆</span>
                                  )}
                                  {i % 4 === 3 && (
                                    <span className="text-lg sm:text-xl md:text-2xl">⭐</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          <h3 className="text-lg sm:text-xl md:text-xl font-bold mb-1 sm:mb-2">
                            MemMatch Game
                          </h3>
                          <p className="text-sm sm:text-base leading-relaxed">Flip cards, find matches, and train your memory</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section
              id="features"
              className={`py-16 ${
                darkMode ? "bg-slate-800/50" : "bg-slate-50"
              } transition-colors duration-300`}
            >
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Game Features
                  </h2>
                  <p className="text-xl opacity-80 max-w-2xl mx-auto">
                    Discover all the exciting features that make MemMatch the
                    perfect game for entertainment and mental exercise.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`${
                        darkMode ? "bg-slate-900" : "bg-white"
                      } rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1`}
                    >
                      <div
                        className={`${
                          darkMode ? "text-blue-400" : "text-indigo-600"
                        } mb-4`}
                      >
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        {feature.title}
                      </h3>
                      <p className="opacity-80">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-16">
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    What Players Say
                  </h2>
                  <p className="text-xl opacity-80 max-w-2xl mx-auto">
                    Join thousands of satisfied players who are improving their
                    memory skills with MemMatch.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      className={`${
                        darkMode ? "bg-slate-800" : "bg-white"
                      } rounded-xl shadow-lg p-6 transition-all duration-300`}
                    >
                      <div className="flex space-x-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className={
                              i < testimonial.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-slate-400"
                            }
                          />
                        ))}
                      </div>
                      <p className="mb-6 opacity-90 italic">
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full ${
                            darkMode ? "bg-slate-700" : "bg-slate-100"
                          } flex items-center justify-center mr-3`}
                        >
                          <Users
                            size={20}
                            className={
                              darkMode ? "text-blue-400" : "text-indigo-600"
                            }
                          />
                        </div>
                        <div>
                          <p className="font-bold">{testimonial.name}</p>
                          <p className="text-sm opacity-70">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-16">
              <div className="container mx-auto px-4">
                <div
                  className={`${
                    darkMode ? "bg-slate-800" : "bg-white"
                  } rounded-xl shadow-xl overflow-hidden transition-colors duration-300 p-8 md:p-12`}
                >
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-2/3 mb-8 md:mb-0">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to challenge your memory?
                      </h2>
                      <p className="text-xl opacity-80 mb-6">
                        Start playing now and see how your memory skills improve
                        over time.
                      </p>
                      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <button
                          onClick={() => setShowGame(true)}
                          className={`flex items-center justify-center ${
                            darkMode
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-indigo-600 hover:bg-indigo-700"
                          } text-white px-6 py-3 rounded-lg transition-colors duration-300 shadow-md text-lg cursor-pointer`}
                        >
                          Play Now <ChevronRight size={20} className="ml-2" />
                        </button>
                      </div>
                    </div>
                    <div className="md:w-1/3 flex justify-center">
                      <div
                        className={`${
                          darkMode ? "bg-slate-900" : "bg-indigo-50"
                        } p-4 rounded-full`}
                      >
                        <div className="relative">
                          <div className="absolute -top-6 -right-6 animate-pulse">
                            <div
                              className={`${
                                darkMode ? "bg-blue-600" : "bg-indigo-600"
                              } text-white p-3 rounded-full shadow-lg`}
                            >
                              <Trophy size={24} />
                            </div>
                          </div>
                          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-white">
                            <div className="text-center">
                              <h3 className="text-xl font-bold mb-1">
                                Start Now
                              </h3>
                              <p className="text-sm">Train your brain</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <footer
            className={`${
              darkMode ? "bg-slate-800" : "bg-slate-900"
            } text-white py-8 sm:py-12 mt-auto transition-colors duration-300`}
          >
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
                <div className="col-span-1 sm:col-span-2 md:col-span-1">
                  <div className="flex items-center mb-4">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white rounded-lg flex items-center justify-center mr-3">
                      <span
                        className={`${
                          darkMode
                            ? "text-blue-600"
                            : "text-indigo-600"
                        } text-lg sm:text-xl font-bold`}
                      >
                        M
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold">MemMatch</h2>
                  </div>
                  <p className="text-slate-400 mb-4 text-sm sm:text-base leading-relaxed">
                    Challenging your memory in a fun and engaging way. Improve
                    focus, concentration, and cognitive skills.
                  </p>
                  <div className="flex space-x-3 sm:space-x-4">
                    <a
                      href="#"
                      className="text-slate-300 hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                      <div className="w-8 sm:w-10 h-8 sm:h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors duration-300">
                        <span className="text-white font-bold text-sm sm:text-lg">F</span>
                      </div>
                    </a>
                    <a
                      href="#"
                      className="text-slate-300 hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                      <div className="w-8 sm:w-10 h-8 sm:h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors duration-300">
                        <span className="text-white font-bold text-sm sm:text-lg">T</span>
                      </div>
                    </a>
                    <a
                      href="#"
                      className="text-slate-300 hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                      <div className="w-8 sm:w-10 h-8 sm:h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors duration-300">
                        <span className="text-white font-bold text-sm sm:text-lg">I</span>
                      </div>
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
                  <ul className="space-y-1 sm:space-y-2">
                    <li>
                      <button
                        onClick={() => scrollToSection("home")}
                        className="text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer text-sm sm:text-base block"
                      >
                        Home
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSection("features")}
                        className="text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer text-sm sm:text-base block"
                      >
                        Features
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSection("testimonials")}
                        className="text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer text-sm sm:text-base block"
                      >
                        Testimonials
                      </button>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Resources</h3>
                  <ul className="space-y-1 sm:space-y-2">
                    <li>
                      <a
                        href="#"
                        className="text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer text-sm sm:text-base block"
                      >
                        Help Center
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer text-sm sm:text-base block"
                      >
                        Blog
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer text-sm sm:text-base block"
                      >
                        Memory Science
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer text-sm sm:text-base block"
                      >
                        Developer API
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Legal</h3>
                  <ul className="space-y-1 sm:space-y-2">
                    <li>
                      <a
                        href="#"
                        className="text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer text-sm sm:text-base block"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer text-sm sm:text-base block"
                      >
                        Terms of Service
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer text-sm sm:text-base block"
                      >
                        Cookie Policy
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer text-sm sm:text-base block"
                      >
                        Contact Us
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6 sm:pt-8 border-t border-slate-700 text-slate-400 text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                  <p className="text-center sm:text-left">© 2025 MemMatch Inc. All rights reserved.</p>
                  <p className="text-center sm:text-right">
                    Made with <span className="text-red-500">♥</span> for memory
                    enthusiasts around the world
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default MemoryMatch;
