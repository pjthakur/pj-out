"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Target,
  Clock,
  BookOpen,
  Menu,
  X,
  Star,
  Zap,
  Brain,
  Settings,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Award,
  TrendingUp,
  Users,
  ChevronRight,
  Lightbulb,
  CheckCircle,
  XCircle,
  BarChart3,
  Filter,
  Shuffle,
  ArrowRight,
  Globe,
  Shield,
  Smartphone,
  Headphones,
  LogOut,
} from "lucide-react";

interface Word {
  id: string;
  word: string;
  meaning: string;
  tip: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  pronunciation?: string;
}

interface GameStats {
  score: number;
  streak: number;
  bestStreak: number;
  totalCorrect: number;
  totalAttempts: number;
  learnedWords: Word[];
  multiplier: number;
}

interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  timeLeft: number;
  currentWord: Word | null;
  options: string[];
  showTip: boolean;
  tipMessage: string;
  gameStats: GameStats;
  showResults: boolean;
  showWordDefinition: boolean;
  lastAnswerCorrect: boolean | null;
  hintsUsed: number;
  maxHints: number;
}

interface Settings {
  soundEnabled: boolean;
  darkMode: boolean;
  difficulty: "all" | "easy" | "medium" | "hard";
  category: "all" | string;
  gameTime: 30 | 60 | 90;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

const VocabMasterPro: React.FC = () => {
  const [currentView, setCurrentView] = useState<"landing" | "game">("landing");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Settings state
  const [settings, setSettings] = useState<Settings>({
    soundEnabled: true,
    darkMode: false,
    difficulty: "all",
    category: "all",
    gameTime: 60,
  });

  // Achievements state
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first_word",
      title: "First Steps",
      description: "Learn your first word",
      unlocked: false,
      icon: "🎯",
    },
    {
      id: "streak_5",
      title: "On Fire",
      description: "Get a 5-word streak",
      unlocked: false,
      icon: "🔥",
    },
    {
      id: "streak_10",
      title: "Unstoppable",
      description: "Get a 10-word streak",
      unlocked: false,
      icon: "⚡",
    },
    {
      id: "perfect_game",
      title: "Perfectionist",
      description: "100% accuracy in a game",
      unlocked: false,
      icon: "💎",
    },
    {
      id: "speed_demon",
      title: "Speed Demon",
      description: "Answer 5 words in 30 seconds",
      unlocked: false,
      icon: "🚀",
    },
    {
      id: "word_master",
      title: "Word Master",
      description: "Learn 20 words in total",
      unlocked: false,
      icon: "👑",
    },
  ]);

  // Leaderboard state (stored in memory)
  const [leaderboard, setLeaderboard] = useState<
    Array<{ score: number; accuracy: number; date: string }>
  >([]);

  // Enhanced word bank with categories
  const wordBank: Word[] = useMemo(
    () => [
      {
        id: "1",
        word: "Serendipity",
        meaning: "A pleasant surprise or fortunate accident",
        tip: "Think of finding something wonderful when you least expect it",
        difficulty: "medium",
        category: "Life",
        pronunciation: "ser-en-DIP-i-tee",
      },
      {
        id: "2",
        word: "Ephemeral",
        meaning: "Lasting for a very short time",
        tip: "Like a butterfly's life or a shooting star",
        difficulty: "hard",
        category: "Time",
        pronunciation: "eh-FEM-er-al",
      },
      {
        id: "3",
        word: "Ubiquitous",
        meaning: "Present everywhere at the same time",
        tip: "Think of smartphones in today's world",
        difficulty: "hard",
        category: "General",
        pronunciation: "yoo-BIK-wi-tus",
      },
      {
        id: "4",
        word: "Resilient",
        meaning: "Able to recover quickly from difficulties",
        tip: "Like a rubber band that bounces back to its original shape",
        difficulty: "easy",
        category: "Character",
        pronunciation: "ri-ZIL-yent",
      },
      {
        id: "5",
        word: "Ambiguous",
        meaning: "Having more than one possible meaning",
        tip: "When something can be interpreted in multiple ways",
        difficulty: "medium",
        category: "Communication",
        pronunciation: "am-BIG-yoo-us",
      },
      {
        id: "6",
        word: "Paradigm",
        meaning: "A typical example or pattern of something",
        tip: "A model or framework for understanding",
        difficulty: "hard",
        category: "Science",
        pronunciation: "PAIR-a-dime",
      },
      {
        id: "7",
        word: "Catalyst",
        meaning: "Something that causes activity or change",
        tip: "Like a spark that starts a fire",
        difficulty: "medium",
        category: "Science",
        pronunciation: "KAT-a-list",
      },
      {
        id: "8",
        word: "Innovation",
        meaning: "The introduction of new ideas or methods",
        tip: "Creating something new and useful",
        difficulty: "easy",
        category: "Business",
        pronunciation: "in-o-VAY-shun",
      },
      {
        id: "9",
        word: "Synergy",
        meaning: "The combined effect is greater than individual parts",
        tip: "When teamwork creates better results than working alone",
        difficulty: "medium",
        category: "Business",
        pronunciation: "SIN-er-jee",
      },
      {
        id: "10",
        word: "Versatile",
        meaning: "Able to adapt to many different functions",
        tip: "Like a Swiss Army knife with many uses",
        difficulty: "easy",
        category: "Character",
        pronunciation: "VER-sa-tile",
      },
      {
        id: "11",
        word: "Meticulous",
        meaning: "Showing great attention to detail",
        tip: "Being very careful and precise about small things",
        difficulty: "medium",
        category: "Character",
        pronunciation: "meh-TIK-yoo-lus",
      },
      {
        id: "12",
        word: "Prudent",
        meaning: "Acting with careful thought and wisdom",
        tip: "Making smart, well-considered decisions",
        difficulty: "medium",
        category: "Character",
        pronunciation: "PROO-dent",
      },
      {
        id: "13",
        word: "Eloquent",
        meaning: "Fluent and persuasive in speaking or writing",
        tip: "Someone who speaks beautifully and convincingly",
        difficulty: "medium",
        category: "Communication",
        pronunciation: "EL-o-kwent",
      },
      {
        id: "14",
        word: "Tenacious",
        meaning: "Tending to keep a firm hold; persistent",
        tip: "Never giving up, like a dog with a bone",
        difficulty: "medium",
        category: "Character",
        pronunciation: "te-NAY-shus",
      },
      {
        id: "15",
        word: "Metamorphosis",
        meaning: "A complete change in form or nature",
        tip: "Like a caterpillar becoming a butterfly",
        difficulty: "hard",
        category: "Science",
        pronunciation: "met-a-MOR-fo-sis",
      },
      {
        id: "16",
        word: "Altruistic",
        meaning: "Showing a selfless concern for the well-being of others",
        tip: "Like helping someone without expecting anything in return",
        difficulty: "medium",
        category: "Character",
        pronunciation: "al-troo-IS-tik",
      },
      {
        id: "17",
        word: "Conundrum",
        meaning: "A confusing and difficult problem or question",
        tip: "Like a riddle you can't solve",
        difficulty: "easy",
        category: "General",
        pronunciation: "kuh-NUN-drum",
      },
      {
        id: "18",
        word: "Benevolent",
        meaning: "Well-meaning and kindly",
        tip: "Someone who always helps others",
        difficulty: "easy",
        category: "Character",
        pronunciation: "buh-NEV-uh-lent",
      },
      {
        id: "19",
        word: "Cryptic",
        meaning: "Having a meaning that is mysterious or obscure",
        tip: "Like a secret code or puzzle",
        difficulty: "hard",
        category: "Communication",
        pronunciation: "KRIP-tik",
      },
      {
        id: "20",
        word: "Diligent",
        meaning: "Showing careful and persistent work or effort",
        tip: "Someone who studies hard and never gives up",
        difficulty: "medium",
        category: "Character",
        pronunciation: "DIL-i-jent",
      },
      {
        id: "21",
        word: "Empathy",
        meaning: "The ability to understand and share the feelings of another",
        tip: "Putting yourself in someone else's shoes",
        difficulty: "easy",
        category: "Character",
        pronunciation: "EM-puh-thee",
      },
      {
        id: "22",
        word: "Fortitude",
        meaning: "Courage in pain or adversity",
        tip: "Bravery when things get tough",
        difficulty: "medium",
        category: "Character",
        pronunciation: "FOR-ti-tood",
      },
      {
        id: "23",
        word: "Gratuitous",
        meaning: "Uncalled for; lacking good reason",
        tip: "Something extra that wasn't needed",
        difficulty: "hard",
        category: "General",
        pronunciation: "gruh-TOO-i-tus",
      },
      {
        id: "24",
        word: "Harbinger",
        meaning:
          "A person or thing that announces or signals the approach of another",
        tip: "Like the first flower of spring",
        difficulty: "medium",
        category: "General",
        pronunciation: "HAR-bin-jer",
      },
      {
        id: "25",
        word: "Idiosyncrasy",
        meaning:
          "A mode of behavior or way of thought peculiar to an individual",
        tip: "A unique habit or quirk",
        difficulty: "hard",
        category: "General",
        pronunciation: "id-ee-oh-SIN-kruh-see",
      },
      {
        id: "26",
        word: "Juxtapose",
        meaning: "To place side by side for contrast",
        tip: "Like comparing two different photos",
        difficulty: "medium",
        category: "General",
        pronunciation: "JUK-stuh-pohz",
      },
      {
        id: "27",
        word: "Kaleidoscope",
        meaning: "A constantly changing pattern or sequence of elements",
        tip: "Like a colorful, ever-shifting tube toy",
        difficulty: "hard",
        category: "General",
        pronunciation: "kuh-LIE-duh-skohp",
      },
      {
        id: "28",
        word: "Lucid",
        meaning: "Expressed clearly; easy to understand",
        tip: "Like a dream you can remember well",
        difficulty: "easy",
        category: "Communication",
        pronunciation: "LOO-sid",
      },
      {
        id: "29",
        word: "Magnanimous",
        meaning: "Very generous or forgiving",
        tip: "Being kind even when you don't have to",
        difficulty: "medium",
        category: "Character",
        pronunciation: "mag-NAN-uh-mus",
      },
      {
        id: "30",
        word: "Nostalgia",
        meaning: "A sentimental longing for the past",
        tip: "Like missing your childhood toys",
        difficulty: "medium",
        category: "Emotion",
        pronunciation: "naw-STAL-juh",
      },
      {
        id: "31",
        word: "Obsolete",
        meaning: "No longer produced or used; out of date",
        tip: "Like floppy disks or old phones",
        difficulty: "easy",
        category: "Technology",
        pronunciation: "OB-suh-leet",
      },
      {
        id: "32",
        word: "Paradox",
        meaning: "A statement that seems contradictory but may be true",
        tip: 'Like "less is more"',
        difficulty: "medium",
        category: "Communication",
        pronunciation: "PAIR-uh-doks",
      },
      {
        id: "33",
        word: "Quintessential",
        meaning: "Representing the most perfect or typical example",
        tip: "The best representation of something",
        difficulty: "medium",
        category: "General",
        pronunciation: "kwin-tuh-SEN-shul",
      },
      {
        id: "34",
        word: "Renaissance",
        meaning: "A revival or renewed interest in something",
        tip: "Like a personal rebirth or fresh start",
        difficulty: "medium",
        category: "History",
        pronunciation: "REN-uh-sahns",
      },
      {
        id: "35",
        word: "Stoic",
        meaning: "Enduring pain or hardship without showing feelings",
        tip: "Like a statue in a storm",
        difficulty: "hard",
        category: "Character",
        pronunciation: "STOH-ik",
      },
      {
        id: "36",
        word: "Transcend",
        meaning: "To rise above or go beyond limits",
        tip: "Like an eagle soaring over a mountain",
        difficulty: "medium",
        category: "Philosophy",
        pronunciation: "tran-SEND",
      },
      {
        id: "37",
        word: "Utopia",
        meaning: "An imagined perfect place or state",
        tip: "Like a dream world without problems",
        difficulty: "medium",
        category: "Philosophy",
        pronunciation: "yoo-TOH-pee-uh",
      },
      {
        id: "38",
        word: "Vicarious",
        meaning: "Experienced through the feelings or actions of another",
        tip: "Like feeling happy from your friend's success",
        difficulty: "medium",
        category: "Emotion",
        pronunciation: "vye-KAIR-ee-us",
      },
      {
        id: "39",
        word: "Wistful",
        meaning: "Having or showing a feeling of vague or regretful longing",
        tip: "Like remembering something you miss",
        difficulty: "medium",
        category: "Emotion",
        pronunciation: "WIST-ful",
      },
      {
        id: "40",
        word: "Xenophile",
        meaning: "A person attracted to foreign peoples, cultures, or customs",
        tip: "Someone who loves other cultures",
        difficulty: "hard",
        category: "Culture",
        pronunciation: "ZEN-oh-file",
      },
      {
        id: "41",
        word: "Yearn",
        meaning: "To have an intense feeling of longing",
        tip: "Like deeply missing someone",
        difficulty: "easy",
        category: "Emotion",
        pronunciation: "YURN",
      },
      {
        id: "42",
        word: "Zealous",
        meaning: "Having or showing great energy or enthusiasm",
        tip: "Being super passionate about something",
        difficulty: "medium",
        category: "Character",
        pronunciation: "ZEL-us",
      },
      {
        id: "43",
        word: "Astute",
        meaning: "Having or showing an ability to accurately assess situations",
        tip: "Like reading between the lines",
        difficulty: "medium",
        category: "Character",
        pronunciation: "uh-STOOT",
      },
      {
        id: "44",
        word: "Brevity",
        meaning: "Concise and exact use of words",
        tip: "Saying more with less",
        difficulty: "easy",
        category: "Communication",
        pronunciation: "BREV-i-tee",
      },
      {
        id: "45",
        word: "Candor",
        meaning: "The quality of being open and honest",
        tip: "Speaking the truth without hiding",
        difficulty: "medium",
        category: "Character",
        pronunciation: "KAN-der",
      },
    ],
    []
  );

  // Get categories for filter
  const categories = useMemo(() => {
    const cats = [...new Set(wordBank.map((word) => word.category))];
    return ["all", ...cats];
  }, [wordBank]);

  // Game state management
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    timeLeft: settings.gameTime,
    currentWord: null,
    options: [],
    showTip: false,
    tipMessage: "",
    gameStats: {
      score: 0,
      streak: 0,
      bestStreak: 0,
      totalCorrect: 0,
      totalAttempts: 0,
      learnedWords: [],
      multiplier: 1,
    },
    showResults: false,
    showWordDefinition: false,
    lastAnswerCorrect: null,
    hintsUsed: 0,
    maxHints: 3,
  });

  // Tip timer state
  const [tipTimeLeft, setTipTimeLeft] = useState(0);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  }, []);

  // Generate wrong options for multiple choice
  const generateWrongOptions = useCallback(
    (correctMeaning: string, currentWordId: string): string[] => {
      const filteredWords = wordBank.filter((w) => {
        if (w.id === currentWordId) return false;
        if (
          settings.difficulty !== "all" &&
          w.difficulty !== settings.difficulty
        )
          return false;
        if (settings.category !== "all" && w.category !== settings.category)
          return false;
        return true;
      });

      const wrongOptions = filteredWords
        .map((w) => w.meaning)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      return wrongOptions;
    },
    [wordBank, settings.difficulty, settings.category]
  );

  // Select next word with filters
  const selectNextWord = useCallback(() => {
    let availableWords = wordBank.filter(
      (w) =>
        !gameState.gameStats.learnedWords.find((learned) => learned.id === w.id)
    );

    // Apply filters
    if (settings.difficulty !== "all") {
      availableWords = availableWords.filter(
        (w) => w.difficulty === settings.difficulty
      );
    }
    if (settings.category !== "all") {
      availableWords = availableWords.filter(
        (w) => w.category === settings.category
      );
    }

    if (availableWords.length === 0) {
      setGameState((prev) => ({
        ...prev,
        isPlaying: false,
        showResults: true,
      }));
      return;
    }

    const randomWord =
      availableWords[Math.floor(Math.random() * availableWords.length)];
    const wrongOptions = generateWrongOptions(
      randomWord.meaning,
      randomWord.id
    );
    const allOptions = [randomWord.meaning, ...wrongOptions].sort(
      () => 0.5 - Math.random()
    );

    setGameState((prev) => ({
      ...prev,
      currentWord: randomWord,
      options: allOptions,
      showTip: false,
      tipMessage: "",
      showWordDefinition: false,
      lastAnswerCorrect: null,
    }));
  }, [
    gameState.gameStats.learnedWords,
    wordBank,
    generateWrongOptions,
    settings.difficulty,
    settings.category,
  ]);

  // Play sound effect
  const playSound = useCallback(
    (type: "correct" | "incorrect" | "hint") => {
      if (!settings.soundEnabled) return;
      // Simple audio feedback using Web Audio API
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      if (type === "correct") {
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(
          659.25,
          audioContext.currentTime + 0.1
        ); // E5
      } else if (type === "incorrect") {
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
        oscillator.frequency.setValueAtTime(
          196,
          audioContext.currentTime + 0.1
        ); // G3
      } else {
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
      }

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.2
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    },
    [settings.soundEnabled]
  );

  // Check and unlock achievements
  const checkAchievements = useCallback((stats: GameStats) => {
    setAchievements((prev) =>
      prev.map((achievement) => {
        if (achievement.unlocked) return achievement;

        switch (achievement.id) {
          case "first_word":
            return { ...achievement, unlocked: stats.learnedWords.length >= 1 };
          case "streak_5":
            return { ...achievement, unlocked: stats.streak >= 5 };
          case "streak_10":
            return { ...achievement, unlocked: stats.streak >= 10 };
          case "perfect_game":
            return {
              ...achievement,
              unlocked:
                stats.totalAttempts > 0 &&
                stats.totalCorrect === stats.totalAttempts,
            };
          case "word_master":
            return {
              ...achievement,
              unlocked: stats.learnedWords.length >= 20,
            };
          default:
            return achievement;
        }
      })
    );
  }, []);

  // Handle answer selection with enhanced feedback
  const handleAnswerSelect = useCallback(
    (selectedMeaning: string) => {
      if (
        !gameState.currentWord ||
        gameState.showTip ||
        gameState.showWordDefinition
      )
        return;

      const isCorrect = selectedMeaning === gameState.currentWord.meaning;
      playSound(isCorrect ? "correct" : "incorrect");

      setGameState((prev) => {
        const newStats = { ...prev.gameStats };
        newStats.totalAttempts += 1;

        if (isCorrect) {
          const streakMultiplier = Math.floor(newStats.streak / 3) + 1;
          const baseScore =
            prev.currentWord!.difficulty === "easy"
              ? 10
              : prev.currentWord!.difficulty === "medium"
              ? 15
              : 20;

          newStats.score += baseScore * streakMultiplier;
          newStats.streak += 1;
          newStats.totalCorrect += 1;
          newStats.bestStreak = Math.max(newStats.bestStreak, newStats.streak);
          newStats.learnedWords = [...newStats.learnedWords, prev.currentWord!];
          newStats.multiplier = streakMultiplier;

          return {
            ...prev,
            gameStats: newStats,
            showTip: false,
            showWordDefinition: true,
            lastAnswerCorrect: true,
          };
        } else {
          newStats.streak = 0;
          newStats.multiplier = 1;
          return {
            ...prev,
            gameStats: newStats,
            showTip: true,
            tipMessage: prev.currentWord!.tip,
            lastAnswerCorrect: false,
          };
        }
      });

      if (isCorrect) {
        setTimeout(() => {
          selectNextWord();
        }, 2000); // Show word definition for 2 seconds
      } else {
        setTipTimeLeft(4); // Start 4-second tip timer
        setTimeout(() => {
          setGameState((prev) => ({
            ...prev,
            showTip: false,
            tipMessage: "",
          }));
          selectNextWord();
        }, 4000); // Show tip for 4 seconds
      }
    },
    [
      gameState.currentWord,
      gameState.showTip,
      gameState.showWordDefinition,
      selectNextWord,
      playSound,
    ]
  );

  // Use hint feature
  const useHint = useCallback(() => {
    if (gameState.hintsUsed >= gameState.maxHints || !gameState.currentWord)
      return;

    playSound("hint");
    setGameState((prev) => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
      showTip: true,
      tipMessage: prev.currentWord!.tip,
    }));

    setTipTimeLeft(3); // Start 3-second hint timer

    setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        showTip: false,
        tipMessage: "",
      }));
    }, 3000);
  }, [
    gameState.hintsUsed,
    gameState.maxHints,
    gameState.currentWord,
    playSound,
  ]);
  const isAnyModalOpen = showSettings || showAchievements || showLeaderboard;
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden"); // Cleanup on unmount
    };
  }, [isAnyModalOpen]);
  // Tip timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameState.showTip && tipTimeLeft > 0) {
      interval = setInterval(() => {
        setTipTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameState.showTip, tipTimeLeft]);

  // Timer effect with progress tracking
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameState.isPlaying && !gameState.isPaused && gameState.timeLeft > 0) {
      interval = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    } else if (gameState.timeLeft === 0 && gameState.isPlaying) {
      const finalStats = gameState.gameStats;
      checkAchievements(finalStats);

      // Add to leaderboard
      const accuracy =
        finalStats.totalAttempts > 0
          ? Math.round(
              (finalStats.totalCorrect / finalStats.totalAttempts) * 100
            )
          : 0;

      setLeaderboard((prev) =>
        [
          ...prev,
          {
            score: finalStats.score,
            accuracy,
            date: new Date().toLocaleDateString(),
          },
        ]
          .sort((a, b) => b.score - a.score)
          .slice(0, 10)
      );

      setGameState((prev) => ({
        ...prev,
        isPlaying: false,
        showResults: true,
      }));
    }

    return () => clearInterval(interval);
  }, [
    gameState.isPlaying,
    gameState.isPaused,
    gameState.timeLeft,
    gameState.gameStats,
    checkAchievements,
  ]);

  // Start game with settings
  const startGame = useCallback(() => {
    setIsMenuOpen(false);

    setGameState({
      isPlaying: true,
      isPaused: false,
      timeLeft: settings.gameTime,
      currentWord: null,
      options: [],
      showTip: false,
      tipMessage: "",
      gameStats: {
        score: 0,
        streak: 0,
        bestStreak: 0,
        totalCorrect: 0,
        totalAttempts: 0,
        learnedWords: [],
        multiplier: 1,
      },
      showResults: false,
      showWordDefinition: false,
      lastAnswerCorrect: null,
      hintsUsed: 0,
      maxHints: 3,
    });
    setGameStarted(true);
    setCurrentView("game");
    setTimeout(() => {
      selectNextWord();
    }, 100);
  }, [settings.gameTime, selectNextWord]);

  // Initialize first word when game starts
  useEffect(() => {
    if (gameState.isPlaying && !gameState.currentWord && gameStarted) {
      selectNextWord();
    }
  }, [gameState.isPlaying, gameState.currentWord, gameStarted, selectNextWord]);

  // Toggle functions
  const togglePause = useCallback(() => {
    setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      isPlaying: false,
      isPaused: false,
      timeLeft: settings.gameTime,
      currentWord: null,
      options: [],
      showTip: false,
      tipMessage: "",
      gameStats: {
        score: 0,
        streak: 0,
        bestStreak: 0,
        totalCorrect: 0,
        totalAttempts: 0,
        learnedWords: [],
        multiplier: 1,
      },
      showResults: false,
      showWordDefinition: false,
      lastAnswerCorrect: null,
      hintsUsed: 0,
      maxHints: 3,
    });
    setGameStarted(false);
    setCurrentView("landing");
  }, [settings.gameTime]);

  const accuracy =
    gameState.gameStats.totalAttempts > 0
      ? Math.round(
          (gameState.gameStats.totalCorrect /
            gameState.gameStats.totalAttempts) *
            100
        )
      : 0;

  const timeProgress = (gameState.timeLeft / settings.gameTime) * 100;

  const themeClasses = settings.darkMode
    ? "bg-gray-900 text-white"
    : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50";

  if (currentView === "landing") {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${themeClasses}`}
      >
        {/* Navigation */}
        <nav
          className={`${
            settings.darkMode ? "bg-gray-800/95" : "bg-white/95"
          } backdrop-blur-md border-b ${
            settings.darkMode ? "border-gray-700" : "border-gray-200"
          } fixed top-0 w-full z-50`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button 
                  onClick={resetGame}
                  className="flex-shrink-0 flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Brain className="h-8 w-8 text-indigo-600" />
                  <span
                    className={`ml-2 text-xl font-bold ${
                      settings.darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    VocabMaster Pro
                  </span>
                </button>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <button
                  onClick={() => scrollToSection("features")}
                  className={`${
                    settings.darkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-700 hover:text-indigo-600"
                  } px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer`}
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className={`${
                    settings.darkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-700 hover:text-indigo-600"
                  } px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer`}
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className={`${
                    settings.darkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-700 hover:text-indigo-600"
                  } px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer`}
                >
                  Testimonials
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className={`${
                    settings.darkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-700 hover:text-indigo-600"
                  } px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer`}
                >
                  Contact
                </button>
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 cursor-pointer"
                >
                  Start Learning
                </button>
              </div>

              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`inline-flex items-center justify-center p-2 rounded-md ${
                    settings.darkMode
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
                  } transition-colors cursor-pointer`}
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out ${
              isMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            <div
              className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${
                settings.darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border-t`}
            >
              <button
                onClick={() => scrollToSection("features")}
                className={`${
                  settings.darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-indigo-600"
                } block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left cursor-pointer`}
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className={`${
                  settings.darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-indigo-600"
                } block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left cursor-pointer`}
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className={`${
                  settings.darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-indigo-600"
                } block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left cursor-pointer`}
              >
                Testimonials
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className={`${
                  settings.darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-indigo-600"
                } block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left cursor-pointer`}
              >
                Contact
              </button>
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all mx-3 mt-2 cursor-pointer"
              >
                Start Learning
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="hero" className="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1
                className={`text-4xl md:text-6xl lg:text-7xl font-bold ${
                  settings.darkMode ? "text-white" : "text-gray-900"
                } mb-6`}
              >
                Master Your
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  Vocabulary
                </span>
              </h1>
              <p
                className={`text-xl md:text-2xl ${
                  settings.darkMode ? "text-gray-300" : "text-gray-600"
                } mb-8 max-w-3xl mx-auto`}
              >
                Professional vocabulary learning platform designed for rapid
                skill acquisition through gamified learning experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <Play className="h-5 w-5" />
                  Start Learning Now
                </button>

                <button
                  onClick={() => scrollToSection("features")}
                  className={`${
                    settings.darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-white hover:bg-gray-50 text-gray-900"
                  } px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl cursor-pointer`}
                >
                  Learn More
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>

              {/* Hero Image */}
              <div className="relative max-w-4xl mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop&crop=center"
                  alt="Professional learning environment"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className={`py-20 px-4 sm:px-6 lg:px-8 ${
            settings.darkMode ? "bg-gray-800/50" : "bg-white/50"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className={`text-3xl md:text-5xl font-bold ${
                  settings.darkMode ? "text-white" : "text-gray-900"
                } mb-4`}
              >
                Powerful Learning Features
              </h2>
              <p
                className={`text-xl ${
                  settings.darkMode ? "text-gray-300" : "text-gray-600"
                } max-w-3xl mx-auto`}
              >
                Built with enterprise-grade technology for maximum learning
                efficiency
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div
                className={`${
                  settings.darkMode ? "bg-gray-800" : "bg-white"
                } rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer`}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3
                  className={`text-2xl font-bold ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  } mb-4`}
                >
                  Lightning Fast Learning
                </h3>
                <p
                  className={`${
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Proprietary algorithms optimize learning speed with
                  customizable time intervals and difficulty progression.
                </p>
              </div>

              <div
                className={`${
                  settings.darkMode ? "bg-gray-800" : "bg-white"
                } rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer`}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3
                  className={`text-2xl font-bold ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  } mb-4`}
                >
                  Advanced Analytics
                </h3>
                <p
                  className={`${
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Comprehensive performance tracking with streak analysis,
                  accuracy metrics, and progress visualization.
                </p>
              </div>

              <div
                className={`${
                  settings.darkMode ? "bg-gray-800" : "bg-white"
                } rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer`}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <h3
                  className={`text-2xl font-bold ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  } mb-4`}
                >
                  Intelligent Hints
                </h3>
                <p
                  className={`${
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Context-aware learning assistance with strategic hint
                  allocation and contextual explanations.
                </p>
              </div>

              <div
                className={`${
                  settings.darkMode ? "bg-gray-800" : "bg-white"
                } rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer`}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3
                  className={`text-2xl font-bold ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  } mb-4`}
                >
                  Achievement System
                </h3>
                <p
                  className={`${
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Motivational reward system with unlockable achievements and
                  milestone tracking for sustained engagement.
                </p>
              </div>

              <div
                className={`${
                  settings.darkMode ? "bg-gray-800" : "bg-white"
                } rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer`}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <h3
                  className={`text-2xl font-bold ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  } mb-4`}
                >
                  Mobile Optimized
                </h3>
                <p
                  className={`${
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Fully responsive design optimized for all devices with
                  touch-friendly interfaces and offline capability.
                </p>
              </div>

              <div
                className={`${
                  settings.darkMode ? "bg-gray-800" : "bg-white"
                } rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer`}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl flex items-center justify-center mb-6">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <h3
                  className={`text-2xl font-bold ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  } mb-4`}
                >
                  Customizable Experience
                </h3>
                <p
                  className={`${
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Personalized learning paths with difficulty filters, category
                  selection, and adaptive timing controls.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2
                  className={`text-3xl md:text-5xl font-bold ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  } mb-6`}
                >
                  Revolutionizing Vocabulary Learning
                </h2>
                <p
                  className={`text-lg ${
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  } mb-6`}
                >
                  VocabMaster Pro combines cutting-edge educational psychology
                  with modern technology to create the most effective vocabulary
                  learning experience available today.
                </p>
                <p
                  className={`text-lg ${
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  } mb-8`}
                >
                  Our platform uses scientifically-proven spaced repetition
                  algorithms, gamification principles, and adaptive learning
                  techniques to maximize retention and engagement.
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600 mb-2">
                      98%
                    </div>
                    <div
                      className={`text-sm ${
                        settings.darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Retention Rate
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      15+
                    </div>
                    <div
                      className={`text-sm ${
                        settings.darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Word Categories
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      24/7
                    </div>
                    <div
                      className={`text-sm ${
                        settings.darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Availability
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      100%
                    </div>
                    <div
                      className={`text-sm ${
                        settings.darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Free Access
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=800&fit=crop&crop=center"
                  alt="Modern learning technology"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className={`py-20 px-4 sm:px-6 lg:px-8 ${
            settings.darkMode ? "bg-gray-800/50" : "bg-gray-50"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className={`text-3xl md:text-5xl font-bold ${
                  settings.darkMode ? "text-white" : "text-gray-900"
                } mb-4`}
              >
                What Our Users Say
              </h2>
              <p
                className={`text-xl ${
                  settings.darkMode ? "text-gray-300" : "text-gray-600"
                } max-w-3xl mx-auto`}
              >
                Join thousands of learners who have transformed their vocabulary
                skills
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div
                className={`${
                  settings.darkMode ? "bg-gray-800" : "bg-white"
                } rounded-2xl p-8 shadow-lg`}
              >
                <div className="flex items-center mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
                    alt="Alex Johnson"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4
                      className={`font-semibold ${
                        settings.darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Sarah Johnson
                    </h4>
                    <p
                      className={`text-sm ${
                        settings.darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Marketing Executive
                    </p>
                  </div>
                </div>
                <p
                  className={`${
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  } mb-4`}
                >
                  "VocabMaster Pro has completely transformed my communication
                  skills. The gamified approach makes learning addictive!"
                </p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>

              <div
                className={`${
                  settings.darkMode ? "bg-gray-800" : "bg-white"
                } rounded-2xl p-8 shadow-lg`}
              >
                <div className="flex items-center mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                    alt="Michael Chen"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4
                      className={`font-semibold ${
                        settings.darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Michael Chen
                    </h4>
                    <p
                      className={`text-sm ${
                        settings.darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Software Developer
                    </p>
                  </div>
                </div>
                <p
                  className={`${
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  } mb-4`}
                >
                  "The streak system and achievements keep me motivated. I've
                  learned over 200 new words in just two months!"
                </p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>

              <div
                className={`${
                  settings.darkMode ? "bg-gray-800" : "bg-white"
                } rounded-2xl p-8 shadow-lg`}
              >
                <div className="flex items-center mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
                    alt="Emily Rodriguez"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4
                      className={`font-semibold ${
                        settings.darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Emily Rodriguez
                    </h4>
                    <p
                      className={`text-sm ${
                        settings.darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Graduate Student
                    </p>
                  </div>
                </div>
                <p
                  className={`${
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  } mb-4`}
                >
                  "Perfect for academic writing. The categorized words and
                  pronunciation guides are incredibly helpful for my thesis."
                </p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className={`text-3xl md:text-5xl font-bold ${
                settings.darkMode ? "text-white" : "text-gray-900"
              } mb-8`}
            >
              Ready to Transform Your Vocabulary?
            </h2>
            <p
              className={`text-xl ${
                settings.darkMode ? "text-gray-300" : "text-gray-600"
              } mb-12`}
            >
              Join thousands of learners who have already elevated their
              communication skills with our professional platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl text-xl font-semibold flex items-center gap-3 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
              >
                <Play className="h-6 w-6" />
                Start Your Journey
              </button>

              <button
                onClick={() => setShowSettings(true)}
                className={`${
                  settings.darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-white hover:bg-gray-50 text-gray-900"
                } px-12 py-4 rounded-xl text-xl font-semibold flex items-center gap-3 transition-all shadow-lg hover:shadow-xl cursor-pointer`}
              >
                <Settings className="h-6 w-6" />
                Customize Settings
              </button>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3
                  className={`text-lg font-semibold ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  } mb-2`}
                >
                  Global Access
                </h3>
                <p
                  className={`${
                    settings.darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Available worldwide, 24/7
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3
                  className={`text-lg font-semibold ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  } mb-2`}
                >
                  Secure & Private
                </h3>
                <p
                  className={`${
                    settings.darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Your data is protected
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="h-8 w-8 text-white" />
                </div>
                <h3
                  className={`text-lg font-semibold ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  } mb-2`}
                >
                  Expert Support
                </h3>
                <p
                  className={`${
                    settings.darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Professional assistance
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className={`${
            settings.darkMode ? "bg-gray-800" : "bg-gray-900"
          } text-white py-12 px-4 sm:px-6 lg:px-8`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <div className="flex items-center mb-4">
                  <Brain className="h-8 w-8 text-indigo-400" />
                  <span className="ml-2 text-xl font-bold">
                    VocabMaster Pro
                  </span>
                </div>
                <p className="text-gray-300 mb-4 max-w-md">
                  The most advanced vocabulary learning platform, designed for
                  professionals who demand excellence in their communication
                  skills.
                </p>
                <div className="flex space-x-4">
                  <button className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                    <span className="text-sm">f</span>
                  </button>
                  <button className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                    <span className="text-sm">t</span>
                  </button>
                  <button className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                    <span className="text-sm">in</span>
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => scrollToSection("features")}
                    className="block text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="block text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    About
                  </button>
                  <button
                    onClick={() => scrollToSection("testimonials")}
                    className="block text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Testimonials
                  </button>
                  <button
                    onClick={startGame}
                    className="block text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Start Learning
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Support</h4>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="block text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Help Center
                  </a>
                  <a
                    href="#"
                    className="block text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="#"
                    className="block text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Terms of Service
                  </a>
                  <a
                    href="#"
                    className="block text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-8 pt-8 text-center">
              <p className="text-gray-400">
                © 2024 VocabMaster Pro. All rights reserved. Built with
                excellence for learning professionals.
              </p>
            </div>
          </div>
        </footer>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4 ">
            <div
              className={`${
                settings.darkMode ? "bg-gray-800" : "bg-white"
              } rounded-2xl p-6 max-w-md w-full max-h-[460px] overflow-y-auto`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3
                  className={`text-xl font-bold ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Settings
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className={`${
                    settings.darkMode
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-500 hover:text-gray-700"
                  } cursor-pointer`}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={
                      settings.darkMode ? "text-gray-300" : "text-gray-700"
                    }
                  >
                    Sound Effects
                  </span>
                  <button
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        soundEnabled: !prev.soundEnabled,
                      }))
                    }
                    className={`p-2 rounded-lg ${
                      settings.soundEnabled
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-100 text-gray-400"
                    } cursor-pointer`}
                  >
                    {settings.soundEnabled ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={
                      settings.darkMode ? "text-gray-300" : "text-gray-700"
                    }
                  >
                    Dark Mode
                  </span>
                  <button
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        darkMode: !prev.darkMode,
                      }))
                    }
                    className={`p-2 rounded-lg ${
                      settings.darkMode
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-100 text-gray-700"
                    } cursor-pointer`}
                  >
                    {settings.darkMode ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      settings.darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    Game Duration
                  </label>
                  <select
                    value={settings.gameTime}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        gameTime: Number(e.target.value) as 30 | 60 | 90,
                      }))
                    }
                    className={`w-full p-2 rounded-lg border ${
                      settings.darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    } cursor-pointer`}
                  >
                    <option value={30}>30 seconds</option>
                    <option value={60}>60 seconds</option>
                    <option value={90}>90 seconds</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      settings.darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    Difficulty Level
                  </label>
                  <select
                    value={settings.difficulty}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        difficulty: e.target.value as any,
                      }))
                    }
                    className={`w-full p-2 rounded-lg border ${
                      settings.darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    } cursor-pointer`}
                  >
                    <option value="all">All Levels</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                {/* <div>
                                    <label className={`block text-sm font-medium ${settings.darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Word Category
                                    </label>
                                    <select
                                        value={settings.category}
                                        onChange={(e) => setSettings(prev => ({ ...prev, category: e.target.value }))}
                                        className={`w-full p-2 rounded-lg border ${settings.darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} cursor-pointer`}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>
                                                {cat === 'all' ? 'All Categories' : cat}
                                            </option>
                                        ))}
                                    </select>
                                </div> */}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${themeClasses}`}
    >
      {/* Game Navigation */}
      <nav
        className={`${
          settings.darkMode ? "bg-gray-800/90" : "bg-white/90"
        } backdrop-blur-md border-b ${
          settings.darkMode ? "border-gray-700" : "border-gray-200"
        } sticky top-0 z-50`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={resetGame}
                className="flex-shrink-0 flex items-center cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Brain className="h-8 w-8 text-indigo-600" />
                <span
                  className={`ml-2 text-xl font-bold ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  VocabMaster Pro
                </span>
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setShowLeaderboard(true)}
                className={`${
                  settings.darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-indigo-600"
                } px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer`}
              >
                <BarChart3 className="h-4 w-4" />
                Leaderboard
              </button>
              <button
                onClick={() => setShowAchievements(true)}
                className={`${
                  settings.darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-indigo-600"
                } px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer`}
              >
                <Award className="h-4 w-4" />
                Achievements
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className={`${
                  settings.darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-indigo-600"
                } px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer`}
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-md ${
                  settings.darkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
                } transition-colors cursor-pointer`}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div
            className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${
              settings.darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } border-t`}
          >
            <button
              onClick={() => {
                setShowLeaderboard(true);
                setIsMenuOpen(false);
              }}
              className={`${
                settings.darkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-700 hover:text-indigo-600"
              } block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left cursor-pointer`}
            >
              📊 Leaderboard
            </button>
            <button
              onClick={() => {
                setShowAchievements(true);
                setIsMenuOpen(false);
              }}
              className={`${
                settings.darkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-700 hover:text-indigo-600"
              } block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left cursor-pointer`}
            >
              🏆 Achievements
            </button>
            <button
              onClick={() => {
                setShowSettings(true);
                setIsMenuOpen(false);
              }}
              className={`${
                settings.darkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-700 hover:text-indigo-600"
              } block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left cursor-pointer`}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>
      </nav>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div
            className={`${
              settings.darkMode ? "bg-gray-800" : "bg-white"
            } rounded-2xl p-6 max-w-md w-full max-h-[480px] overflow-y-auto`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3
                className={`text-xl font-bold ${
                  settings.darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Settings
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className={`${
                  settings.darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-700"
                } cursor-pointer`}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={
                    settings.darkMode ? "text-gray-300" : "text-gray-700"
                  }
                >
                  Sound Effects
                </span>
                <button
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      soundEnabled: !prev.soundEnabled,
                    }))
                  }
                  className={`p-2 rounded-lg ${
                    settings.soundEnabled
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-400"
                  } cursor-pointer`}
                >
                  {settings.soundEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={
                    settings.darkMode ? "text-gray-300" : "text-gray-700"
                  }
                >
                  Dark Mode
                </span>
                <button
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      darkMode: !prev.darkMode,
                    }))
                  }
                  className={`p-2 rounded-lg ${
                    settings.darkMode
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-700"
                  } cursor-pointer`}
                >
                  {settings.darkMode ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${
                    settings.darkMode ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
                >
                  Game Duration
                </label>
                <select
                  value={settings.gameTime}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      gameTime: Number(e.target.value) as 30 | 60 | 90,
                    }))
                  }
                  className={`w-full p-2 rounded-lg border ${
                    settings.darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  } cursor-pointer`}
                >
                  <option value={30}>30 seconds</option>
                  <option value={60}>60 seconds</option>
                  <option value={90}>90 seconds</option>
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${
                    settings.darkMode ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
                >
                  Difficulty Level
                </label>
                <select
                  value={settings.difficulty}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      difficulty: e.target.value as any,
                    }))
                  }
                  className={`w-full p-2 rounded-lg border ${
                    settings.darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  } cursor-pointer`}
                >
                  <option value="all">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* <div>
                              <label className={`block text-sm font-medium ${settings.darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                  Word Category
                              </label>
                              <select
                                  value={settings.category}
                                  onChange={(e) => setSettings(prev => ({ ...prev, category: e.target.value }))}
                                  className={`w-full p-2 rounded-lg border ${settings.darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} cursor-pointer`}
                              >
                                  {categories.map(cat => (
                                      <option key={cat} value={cat}>
                                          {cat === 'all' ? 'All Categories' : cat}
                                      </option>
                                  ))}
                              </select>
                          </div> */}
            </div>
          </div>
        </div>
      )}

      {/* Achievements Modal */}
      {showAchievements && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div
            className={`${
              settings.darkMode ? "bg-gray-800" : "bg-white"
            } rounded-2xl p-6 max-w-md w-full `}
          >
            <div className="flex justify-between items-center mb-6">
              <h3
                className={`text-xl font-bold ${
                  settings.darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Achievements
              </h3>
              <button
                onClick={() => setShowAchievements(false)}
                className={`${
                  settings.darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-700"
                } cursor-pointer`}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="max-h-[470px] overflow-y-auto">
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      achievement.unlocked
                        ? "border-green-200 bg-green-50"
                        : settings.darkMode
                        ? "border-gray-600 bg-gray-700"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <h4
                          className={`font-semibold ${
                            achievement.unlocked
                              ? "text-green-800"
                              : settings.darkMode
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          {achievement.title}
                        </h4>
                        <p
                          className={`text-sm ${
                            achievement.unlocked
                              ? "text-green-600"
                              : settings.darkMode
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div
            className={`${
              settings.darkMode ? "bg-gray-800" : "bg-white"
            } rounded-2xl p-6 max-w-md w-full max-h-[480px] overflow-y-auto`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3
                className={`text-xl font-bold ${
                  settings.darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Leaderboard
              </h3>
              <button
                onClick={() => setShowLeaderboard(false)}
                className={`${
                  settings.darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-700"
                } cursor-pointer`}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {leaderboard.length === 0 ? (
              <p
                className={`text-center ${
                  settings.darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No games played yet. Start playing to see your scores!
              </p>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      settings.darkMode ? "bg-gray-700" : "bg-gray-50"
                    } flex justify-between items-center`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0
                            ? "bg-yellow-100 text-yellow-800"
                            : index === 1
                            ? "bg-gray-100 text-gray-800"
                            : index === 2
                            ? "bg-orange-100 text-orange-800"
                            : settings.darkMode
                            ? "bg-gray-600 text-gray-300"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div>
                        <div
                          className={`font-semibold ${
                            settings.darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {entry.score} points
                        </div>
                        <div
                          className={`text-sm ${
                            settings.darkMode
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          {entry.accuracy}% accuracy • {entry.date}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!gameState.isPlaying && !gameState.showResults ? (
          // Enhanced Welcome Screen
          <div className="text-center">
            <div className="relative h-64 sm:h-80 mb-8 rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=400&fit=crop&crop=center"
                alt="Learning concept"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 flex items-center justify-center">
                <div className="text-white text-center">
                  <h1 className="text-4xl sm:text-6xl font-bold mb-4">
                    Master Vocabulary
                  </h1>
                  <p className="text-xl sm:text-2xl opacity-90">
                    Professional learning platform for vocabulary mastery
                  </p>
                </div>
              </div>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div
                  className={`${
                    settings.darkMode ? "bg-gray-800" : "bg-white"
                  } rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
                >
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Zap className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3
                    className={`text-lg font-semibold ${
                      settings.darkMode ? "text-white" : "text-gray-900"
                    } mb-2`}
                  >
                    Quick Learning
                  </h3>
                  <p
                    className={`${
                      settings.darkMode ? "text-gray-400" : "text-gray-600"
                    } text-sm`}
                  >
                    Customizable time rounds for rapid acquisition
                  </p>
                </div>

                <div
                  className={`${
                    settings.darkMode ? "bg-gray-800" : "bg-white"
                  } rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <h3
                    className={`text-lg font-semibold ${
                      settings.darkMode ? "text-white" : "text-gray-900"
                    } mb-2`}
                  >
                    Smart Analytics
                  </h3>
                  <p
                    className={`${
                      settings.darkMode ? "text-gray-400" : "text-gray-600"
                    } text-sm`}
                  >
                    Comprehensive progress tracking
                  </p>
                </div>

                <div
                  className={`${
                    settings.darkMode ? "bg-gray-800" : "bg-white"
                  } rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Lightbulb className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3
                    className={`text-lg font-semibold ${
                      settings.darkMode ? "text-white" : "text-gray-900"
                    } mb-2`}
                  >
                    Intelligent Hints
                  </h3>
                  <p
                    className={`${
                      settings.darkMode ? "text-gray-400" : "text-gray-600"
                    } text-sm`}
                  >
                    Contextual learning assistance
                  </p>
                </div>

                <div
                  className={`${
                    settings.darkMode ? "bg-gray-800" : "bg-white"
                  } rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Award className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3
                    className={`text-lg font-semibold ${
                      settings.darkMode ? "text-white" : "text-gray-900"
                    } mb-2`}
                  >
                    Achievements
                  </h3>
                  <p
                    className={`${
                      settings.darkMode ? "text-gray-400" : "text-gray-600"
                    } text-sm`}
                  >
                    Unlock rewards and milestones
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <Play className="h-5 w-5" />
                  Start Learning
                </button>

                <button
                  onClick={() => setShowSettings(true)}
                  className={`${
                    settings.darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  } px-6 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all cursor-pointer`}
                >
                  <Settings className="h-4 w-4" />
                  Customize Game
                </button>
              </div>
            </div>
          </div>
        ) : gameState.showResults ? (
          // Enhanced Results Screen
          <div className="max-w-3xl mx-auto text-center">
            <div
              className={`${
                settings.darkMode ? "bg-gray-800" : "bg-white"
              } rounded-2xl p-8 shadow-2xl`}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-10 w-10 text-white" />
              </div>

              <h2
                className={`text-3xl font-bold ${
                  settings.darkMode ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                Excellent Performance!
              </h2>
              <p
                className={`${
                  settings.darkMode ? "text-gray-400" : "text-gray-600"
                } mb-8`}
              >
                Here's your detailed performance analysis
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-indigo-600">
                    {gameState.gameStats.score}
                  </div>
                  <div className="text-sm text-gray-600">Total Score</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {accuracy}%
                  </div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {gameState.gameStats.bestStreak}
                  </div>
                  <div className="text-sm text-gray-600">Best Streak</div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-orange-600">
                    {gameState.gameStats.learnedWords.length}
                  </div>
                  <div className="text-sm text-gray-600">Words Mastered</div>
                </div>
              </div>

              {gameState.gameStats.learnedWords.length > 0 && (
                <div className="mb-8">
                  <h3
                    className={`text-lg font-semibold ${
                      settings.darkMode ? "text-white" : "text-gray-900"
                    } mb-4`}
                  >
                    Your Vocabulary Achievements
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {gameState.gameStats.learnedWords.map((word) => (
                      <span
                        key={word.id}
                        className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
                        title={`${word.word}: ${word.meaning}`}
                      >
                        {word.word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer"
                >
                  <Play className="h-4 w-4" />
                  Play Again
                </button>

                <button
                  onClick={() => setShowLeaderboard(true)}
                  className={`${
                    settings.darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  } px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all cursor-pointer`}
                >
                  <BarChart3 className="h-4 w-4" />
                  View Leaderboard
                </button>

                <button
                  onClick={resetGame}
                  className={`${
                    settings.darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  } px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all cursor-pointer`}
                >
                  <RotateCcw className="h-4 w-4" />
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Enhanced Game Screen
          <div className="max-w-4xl mx-auto">
            {/* Enhanced Game Header */}
            <div
              className={`${
                settings.darkMode ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-lg p-6 mb-6`}
            >
              <div className="flex flex-col gap-4">
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${timeProgress}%` }}
                  ></div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-600" />
                      <span
                        className={`text-2xl font-bold ${
                          gameState.timeLeft <= 10
                            ? "text-red-600"
                            : settings.darkMode
                            ? "text-white"
                            : "text-gray-900"
                        } ${gameState.timeLeft <= 10 ? "animate-pulse" : ""}`}
                      >
                        {gameState.timeLeft}s
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      <span
                        className={`text-xl font-semibold ${
                          settings.darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {gameState.gameStats.score}
                        {gameState.gameStats.multiplier > 1 && (
                          <span className="text-sm text-indigo-600 ml-1">
                            ×{gameState.gameStats.multiplier}
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-indigo-600" />
                      <span
                        className={`text-lg font-medium ${
                          settings.darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Streak: {gameState.gameStats.streak}
                        {gameState.gameStats.streak >= 5 && (
                          <span className="ml-1">🔥</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Hint Button */}
                    <button
                      onClick={useHint}
                      disabled={
                        gameState.hintsUsed >= gameState.maxHints ||
                        !gameState.currentWord
                      }
                      className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                        gameState.hintsUsed < gameState.maxHints
                          ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Lightbulb className="h-4 w-4" />
                      Hints ({gameState.maxHints - gameState.hintsUsed})
                    </button>

                    <button
                      onClick={togglePause}
                      className={`${
                        settings.darkMode
                          ? "bg-gray-700 hover:bg-gray-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      } p-2 rounded-lg transition-colors cursor-pointer`}
                    >
                      {gameState.isPaused ? (
                        <Play className="h-4 w-4" />
                      ) : (
                        <Pause className="h-4 w-4" />
                      )}
                    </button>

                    <button
                      onClick={resetGame}
                      className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Game Content */}
            <div
              className={`${
                settings.darkMode ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-lg p-8`}
            >
              {gameState.isPaused ? (
                <div className="text-center py-16">
                  <Pause className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3
                    className={`text-2xl font-semibold ${
                      settings.darkMode ? "text-white" : "text-gray-900"
                    } mb-2`}
                  >
                    Game Paused
                  </h3>
                  <p
                    className={`${
                      settings.darkMode ? "text-gray-400" : "text-gray-600"
                    } mb-6`}
                  >
                    Take a moment to rest, then continue when ready
                  </p>
                  <button
                    onClick={togglePause}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto transition-all cursor-pointer"
                  >
                    <Play className="h-4 w-4" />
                    Resume Game
                  </button>
                </div>
              ) : gameState.currentWord ? (
                <div>
                  {/* Enhanced Current Word Display */}
                  <div className="text-center mb-8">
                    <div className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-6 rounded-2xl mb-4 relative">
                      <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                        {gameState.currentWord.word}
                      </h2>
                      {gameState.currentWord.pronunciation && (
                        <p className="text-indigo-100 text-sm font-medium">
                          /{gameState.currentWord.pronunciation}/
                        </p>
                      )}
                    </div>

                    <div className="flex justify-center items-center gap-4 text-sm">
                      <div
                        className={`flex items-center gap-2 ${
                          gameState.currentWord.difficulty === "easy"
                            ? "text-green-600"
                            : gameState.currentWord.difficulty === "medium"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            gameState.currentWord.difficulty === "easy"
                              ? "bg-green-400"
                              : gameState.currentWord.difficulty === "medium"
                              ? "bg-yellow-400"
                              : "bg-red-400"
                          }`}
                        ></span>
                        {gameState.currentWord.difficulty
                          .charAt(0)
                          .toUpperCase() +
                          gameState.currentWord.difficulty.slice(1)}
                      </div>

                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          settings.darkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {gameState.currentWord.category}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Tip Display with Better Visibility */}
                  {gameState.showTip && (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-40 p-4">
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-pulse">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Lightbulb className="h-5 w-5 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-amber-800 font-bold text-lg mb-2">
                              💡 Helpful Tip
                            </h4>
                            <p className="text-amber-700 text-base leading-relaxed">
                              {gameState.tipMessage}
                            </p>
                            <div className="mt-4 text-center">
                              <div className="inline-flex items-center gap-2 text-amber-600 text-sm">
                                <Clock className="h-4 w-4" />
                                <span>Closing in {tipTimeLeft} seconds...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Word Definition Display */}
                  {gameState.showWordDefinition &&
                    gameState.lastAnswerCorrect && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                          <div>
                            <p className="text-green-800 font-bold">
                              Correct! Well done! 🎉
                            </p>
                            <p className="text-green-700">
                              <strong>{gameState.currentWord.word}:</strong>{" "}
                              {gameState.currentWord.meaning}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Enhanced Answer Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {gameState.options.map((option, index) => (
                      <button
                        key={`option-${
                          gameState.currentWord?.id
                        }-${index}-${option.slice(0, 10)}`}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={
                          gameState.showTip || gameState.showWordDefinition
                        }
                        className={`p-6 text-left rounded-xl border-2 transition-all transform hover:scale-105 cursor-pointer ${
                          gameState.showTip || gameState.showWordDefinition
                            ? settings.darkMode
                              ? "bg-gray-700 border-gray-600 cursor-not-allowed"
                              : "bg-gray-50 border-gray-200 cursor-not-allowed"
                            : settings.darkMode
                            ? "bg-gray-700 border-gray-600 hover:border-indigo-400 hover:bg-gray-600 hover:shadow-md"
                            : "bg-gray-50 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] rounded-full flex items-center justify-center font-semibold border-2 text-sm ${
                              settings.darkMode
                                ? "bg-gray-600 text-gray-300 border-gray-500"
                                : "bg-white text-gray-600 border-gray-200"
                            }`}
                          >
                            {String.fromCharCode(65 + index)}
                          </div>
                          <p
                            className={`font-medium leading-relaxed ${
                              settings.darkMode
                                ? "text-gray-300"
                                : "text-gray-900"
                            }`}
                          >
                            {option}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-spin" />
                  <p
                    className={`${
                      settings.darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Loading next word...
                  </p>
                </div>
              )}
            </div>

            {/* Enhanced Learned Words Stack */}
            {gameState.gameStats.learnedWords.length > 0 && (
              <div
                className={`mt-6 ${
                  settings.darkMode ? "bg-gray-800" : "bg-white"
                } rounded-2xl shadow-lg p-6`}
              >
                <h3
                  className={`text-lg font-semibold ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  } mb-4 flex items-center gap-2`}
                >
                  <BookOpen className="h-5 w-5 text-green-600" />
                  Vocabulary Mastered ({gameState.gameStats.learnedWords.length}
                  )
                  <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    +{gameState.gameStats.learnedWords.length * 10} XP
                  </span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {gameState.gameStats.learnedWords.map((word, index) => (
                    <span
                      key={`learned-${word.id}-${index}`}
                      className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium hover:shadow-md transition-shadow cursor-help"
                      title={`${word.word}: ${word.meaning} (${word.category})`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {word.word} ✨
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default VocabMasterPro;

// Zod Schema
export const Schema = {
    "commentary": "",
    "template": "nextjs-developer",
    "title": "Word Match Game",
    "description": "A simple word-matching game where users match words with their meanings.",
    "additional_dependencies": ["lucide-react"],
    "has_additional_dependencies": true,
    "install_dependencies_command": "npm i lucide-react",
    "port": 3000,
    "file_path": "pages/index.tsx",
    "code": "<see code above>"
}