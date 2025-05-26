"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Search,
  Menu,
  X,
  ClipboardList,
  BarChart3,
  Clock,
  LightbulbIcon,
  ArrowUpRight,
  Quote,
  Trophy,
  Share2,
  Keyboard,
  Facebook,
  Link2,
  MessageSquare,
} from "lucide-react";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"] });

interface DifficultyStats {
  rounds: number;
  wins: number;
  guesses: number;
  bestScore: number | null;
}

interface GameStats {
  totalRounds: number;
  totalGuesses: number;
  wins: number;
  currentStreak: number;
  bestStreak: number;
  achievements: {
    easy: string[];
    medium: string[];
    hard: string[];
  };
  byDifficulty: {
    easy: DifficultyStats;
    medium: DifficultyStats;
    hard: DifficultyStats;
  };
}

interface GuessHistory {
  value: number;
  feedback: "too high" | "too low" | "correct";
}

type Difficulty = "easy" | "medium" | "hard";

interface DifficultySettings {
  min: number;
  max: number;
  attempts: number;
}

const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  easy: { min: 1, max: 50, attempts: 10 },
  medium: { min: 1, max: 100, attempts: 8 },
  hard: { min: 1, max: 200, attempts: 6 },
};

const ACHIEVEMENTS = {
  easy: [
    {
      id: "easy_first_win",
      name: "First Easy Win",
      description: "Win your first easy game",
    },
    {
      id: "easy_perfect",
      name: "Easy Perfect",
      description: "Win easy mode in 3 or fewer guesses",
    },
    {
      id: "easy_streak_3",
      name: "Easy Streak",
      description: "Win 3 easy games in a row",
    },
  ],
  medium: [
    {
      id: "medium_first_win",
      name: "First Medium Win",
      description: "Win your first medium game",
    },
    {
      id: "medium_perfect",
      name: "Medium Perfect",
      description: "Win medium mode in 4 or fewer guesses",
    },
    {
      id: "medium_streak_3",
      name: "Medium Streak",
      description: "Win 3 medium games in a row",
    },
  ],
  hard: [
    {
      id: "hard_first_win",
      name: "First Hard Win",
      description: "Win your first hard game",
    },
    {
      id: "hard_perfect",
      name: "Hard Perfect",
      description: "Win hard mode in 5 or fewer guesses",
    },
    {
      id: "hard_streak_3",
      name: "Hard Streak",
      description: "Win 3 hard games in a row",
    },
  ],
};

const useSounds = () => {
  const [sounds, setSounds] = useState<{
    correct: HTMLAudioElement | null;
    wrong: HTMLAudioElement | null;
    gameOver: HTMLAudioElement | null;
    achievement: HTMLAudioElement | null;
    win: HTMLAudioElement | null;
  }>({
    correct: null,
    wrong: null,
    gameOver: null,
    achievement: null,
    win: null,
  });

  useEffect(() => {
    setSounds({
      correct: new Audio(
        "https://cdn.freesound.org/previews/131/131142_2337290-lq.mp3"
      ),
      wrong: new Audio(
        "https://cdn.freesound.org/previews/270/270404_5123851-lq.mp3"
      ),
      gameOver: new Audio(
        "https://cdn.freesound.org/previews/76/76376_1022651-lq.mp3"
      ),
      achievement: new Audio(
        "https://cdn.freesound.org/previews/270/270310_5123851-lq.mp3"
      ),
      win: new Audio(
        "https://cdn.freesound.org/previews/270/270402_5123851-lq.mp3"
      ),
    });

    const preloadSounds = async () => {
      try {
        const soundPromises = Object.values(sounds).map((sound) => {
          if (sound) {
            return new Promise((resolve, reject) => {
              sound.addEventListener("canplaythrough", resolve, { once: true });
              sound.addEventListener("error", reject);
              sound.load();
            });
          }
          return Promise.resolve();
        });
        await Promise.all(soundPromises);
      } catch (error) {
        console.warn("Some sounds failed to preload:", error);
      }
    };

    preloadSounds();
  }, []);

  const setVolume = useCallback(
    (volume: number) => {
      Object.values(sounds).forEach((sound) => {
        if (sound) {
          sound.volume = Math.max(0, Math.min(1, volume));
        }
      });
    },
    [sounds]
  );

  const [isMuted, setIsMuted] = useState(false);
  const toggleMute = useCallback(() => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    Object.values(sounds).forEach((sound) => {
      if (sound) {
        sound.muted = newMutedState;
      }
    });
  }, [isMuted, sounds]);

  return { sounds, setVolume, isMuted, toggleMute };
};

export default function Home() {
  const { sounds, setVolume, isMuted, toggleMute } = useSounds();

  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [targetNumber, setTargetNumber] = useState<number | null>(null);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [guessHistory, setGuessHistory] = useState<GuessHistory[]>([]);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<
    "selecting" | "playing" | "won" | "lost"
  >("selecting");
  const [stats, setStats] = useState<GameStats>({
    totalRounds: 0,
    totalGuesses: 0,
    wins: 0,
    currentStreak: 0,
    bestStreak: 0,
    achievements: {
      easy: [],
      medium: [],
      hard: [],
    },
    byDifficulty: {
      easy: { rounds: 0, wins: 0, guesses: 0, bestScore: null },
      medium: { rounds: 0, wins: 0, guesses: 0, bestScore: null },
      hard: { rounds: 0, wins: 0, guesses: 0, bestScore: null },
    },
  });
  const [showStats, setShowStats] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [shake, setShake] = useState<boolean>(false);
  const [showAchievement, setShowAchievement] = useState<{
    name: string;
    description: string;
  } | null>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const savedStats = localStorage.getItem("numberGuessStats");
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("numberGuessStats", JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    const modalsOpen =
      showStats || showTutorial || showKeyboardShortcuts || showShareModal;
    if (modalsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showStats, showTutorial, showKeyboardShortcuts, showShareModal]);

  useEffect(() => {
    if (showAchievement) {
      const timer = setTimeout(() => {
        setShowAchievement(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAchievement]);

  const startRound = useCallback((selectedDifficulty: Difficulty) => {
    const settings = DIFFICULTY_SETTINGS[selectedDifficulty];
    const newTargetNumber =
      Math.floor(Math.random() * (settings.max - settings.min + 1)) +
      settings.min;

    setDifficulty(selectedDifficulty);
    setTargetNumber(newTargetNumber);
    setCurrentGuess("");
    setGuessHistory([]);
    setAttemptsLeft(settings.attempts);
    setGameStatus("playing");
    setMessage(`Guess a number between ${settings.min} and ${settings.max}`);
  }, []);

  const resetGame = useCallback(() => {
    setDifficulty(null);
    setTargetNumber(null);
    setCurrentGuess("");
    setGuessHistory([]);
    setGameStatus("selecting");
    setMessage("Select a difficulty level to start");
  }, []);

  const checkAchievements = useCallback(
    (difficulty: Difficulty, guessesUsed: number, currentStats: GameStats) => {
      const currentAchievements =
        currentStats?.achievements?.[difficulty] || [];
      const newAchievements = [...currentAchievements];
      const difficultyStats = currentStats?.byDifficulty?.[difficulty];

      if (!difficultyStats) {
        return newAchievements;
      }

      if (difficultyStats.wins === 0) {
        const achievement = ACHIEVEMENTS[difficulty]?.find(
          (a) => a.id === `${difficulty}_first_win`
        );
        if (achievement && !newAchievements.includes(achievement.id)) {
          newAchievements.push(achievement.id);
          setShowAchievement(achievement);
          sounds.achievement?.play();
        }
      }

      const perfectThreshold =
        difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 5;
      if (guessesUsed <= perfectThreshold) {
        const achievement = ACHIEVEMENTS[difficulty]?.find(
          (a) => a.id === `${difficulty}_perfect`
        );
        if (achievement && !newAchievements.includes(achievement.id)) {
          newAchievements.push(achievement.id);
          setShowAchievement(achievement);
          sounds.achievement?.play();
        }
      }

      if (currentStats.currentStreak >= 3) {
        const achievement = ACHIEVEMENTS[difficulty]?.find(
          (a) => a.id === `${difficulty}_streak_3`
        );
        if (achievement && !newAchievements.includes(achievement.id)) {
          newAchievements.push(achievement.id);
          setShowAchievement(achievement);
          sounds.achievement?.play();
        }
      }

      return newAchievements;
    },
    [sounds]
  );

  const handleGuess = useCallback(() => {
    if (
      !currentGuess ||
      !targetNumber ||
      !difficulty ||
      gameStatus !== "playing"
    )
      return;

    const guessValue = parseInt(currentGuess);
    const settings = DIFFICULTY_SETTINGS[difficulty];

    if (guessValue < settings.min || guessValue > settings.max) {
      setShake(true);
      setMessage(
        `Please enter a number between ${settings.min} and ${settings.max}`
      );
      sounds.wrong?.play();
      setTimeout(() => setShake(false), 500);
      return;
    }

    let feedback: "too high" | "too low" | "correct";
    if (guessValue > targetNumber) {
      feedback = "too high";
      setMessage("Too high! Try again.");
      sounds.wrong?.play();
    } else if (guessValue < targetNumber) {
      feedback = "too low";
      setMessage("Too low! Try again.");
      sounds.wrong?.play();
    } else {
      feedback = "correct";
      setMessage(`Correct! The number was ${targetNumber}`);
      sounds.correct?.play();
    }

    const newHistory = [...guessHistory, { value: guessValue, feedback }];
    setGuessHistory(newHistory);
    setCurrentGuess("");

    const newAttemptsLeft = attemptsLeft - 1;
    setAttemptsLeft(newAttemptsLeft);

    if (feedback === "correct") {
      const guessesUsed =
        DIFFICULTY_SETTINGS[difficulty].attempts - newAttemptsLeft;
      const newStreak = (stats?.currentStreak || 0) + 1;

      const newAchievements = checkAchievements(
        difficulty,
        guessesUsed,
        stats || {
          totalRounds: 0,
          totalGuesses: 0,
          wins: 0,
          currentStreak: 0,
          bestStreak: 0,
          achievements: {
            easy: [],
            medium: [],
            hard: [],
          },
          byDifficulty: {
            easy: { rounds: 0, wins: 0, guesses: 0, bestScore: null },
            medium: { rounds: 0, wins: 0, guesses: 0, bestScore: null },
            hard: { rounds: 0, wins: 0, guesses: 0, bestScore: null },
          },
        }
      );

      const updatedStats = {
        totalRounds: (stats?.totalRounds || 0) + 1,
        totalGuesses: (stats?.totalGuesses || 0) + guessesUsed,
        wins: (stats?.wins || 0) + 1,
        currentStreak: newStreak,
        bestStreak: Math.max(stats?.bestStreak || 0, newStreak),
        achievements: {
          ...(stats?.achievements || {
            easy: [],
            medium: [],
            hard: [],
          }),
          [difficulty]: newAchievements,
        },
        byDifficulty: {
          ...(stats?.byDifficulty || {
            easy: { rounds: 0, wins: 0, guesses: 0, bestScore: null },
            medium: { rounds: 0, wins: 0, guesses: 0, bestScore: null },
            hard: { rounds: 0, wins: 0, guesses: 0, bestScore: null },
          }),
          [difficulty]: {
            rounds: (stats?.byDifficulty?.[difficulty]?.rounds || 0) + 1,
            wins: (stats?.byDifficulty?.[difficulty]?.wins || 0) + 1,
            guesses:
              (stats?.byDifficulty?.[difficulty]?.guesses || 0) + guessesUsed,
            bestScore:
              stats?.byDifficulty?.[difficulty]?.bestScore === null
                ? guessesUsed
                : Math.min(
                    stats?.byDifficulty?.[difficulty]?.bestScore || Infinity,
                    guessesUsed
                  ),
          },
        },
      };

      setStats(updatedStats);
      setGameStatus("won");
      sounds.win?.play();
    } else if (newAttemptsLeft <= 0) {
      sounds.gameOver?.play();
      const updatedStats = {
        ...stats,
        totalRounds: (stats?.totalRounds || 0) + 1,
        currentStreak: 0,
        byDifficulty: {
          ...(stats?.byDifficulty || {
            easy: { rounds: 0, wins: 0, guesses: 0, bestScore: null },
            medium: { rounds: 0, wins: 0, guesses: 0, bestScore: null },
            hard: { rounds: 0, wins: 0, guesses: 0, bestScore: null },
          }),
          [difficulty]: {
            ...(stats?.byDifficulty?.[difficulty] || {
              rounds: 0,
              wins: 0,
              guesses: 0,
              bestScore: null,
            }),
            rounds: (stats?.byDifficulty?.[difficulty]?.rounds || 0) + 1,
          },
        },
      };

      setStats(updatedStats);
      setGameStatus("lost");
      setMessage(`Game Over! The number was ${targetNumber}`);
    }
  }, [
    currentGuess,
    targetNumber,
    difficulty,
    gameStatus,
    attemptsLeft,
    guessHistory,
    stats,
    checkAchievements,
    sounds,
  ]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key) && gameStatus === "playing") {
        inputRef.current?.focus();
      }

      if (e.key === "Enter" && gameStatus === "playing" && currentGuess) {
        handleGuess();
      }

      if (e.key === "?") {
        setShowKeyboardShortcuts(true);
      }

      if (e.key === "Escape") {
        setShowKeyboardShortcuts(false);
        setShowTutorial(false);
        setShowStats(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameStatus, currentGuess, handleGuess]);

  const averageGuesses =
    stats.totalRounds > 0
      ? (stats.totalGuesses / stats.totalRounds).toFixed(1)
      : "0.0";
  const winRate =
    stats.totalRounds > 0
      ? Math.round((stats.wins / stats.totalRounds) * 100)
      : 0;
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const scrollToSection = useCallback(
    (sectionId: string) => {
      const section = document.getElementById(sectionId);
      if (section) {
        if (isMenuOpen) {
          setIsMenuOpen(false);
          setTimeout(() => {
            const isMobile = window.innerWidth < 768;
            const mobileOffset = 200;
            const headerHeight = isMobile ? 30 + mobileOffset : 80;
            const sectionPosition = section.getBoundingClientRect().top;
            const offsetPosition =
              sectionPosition + window.pageYOffset - headerHeight;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }, 100);
        } else {
          const isMobile = window.innerWidth < 768;
          const mobileOffset = 200;
          const headerHeight = isMobile ? 30 + mobileOffset : 80;
          const sectionPosition = section.getBoundingClientRect().top;
          const offsetPosition =
            sectionPosition + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
    },
    [isMenuOpen]
  );

  const scrollToTop = useCallback(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isMenuOpen]);

  const shareScore = useCallback(() => {
    if (!difficulty || gameStatus !== "won") return;

    const currentStats = stats.byDifficulty[difficulty as Difficulty];
    const guessesUsed =
      DIFFICULTY_SETTINGS[difficulty as Difficulty].attempts - attemptsLeft;
    const emoji = guessesUsed <= 3 ? "🎯" : guessesUsed <= 5 ? "🎮" : "🎲";

    const shareData = {
      title: "NumberMaster Score",
      text:
        `${emoji} I just won a game of NumberMaster on ${difficulty} mode!\n` +
        `🎯 Target number: ${targetNumber}\n` +
        `🎲 Guesses used: ${guessesUsed}\n` +
        `🏆 Total wins: ${currentStats.wins}\n` +
        `🔥 Current streak: ${stats.currentStreak}\n` +
        `💫 Best streak: ${stats.bestStreak}\n` +
        `Try to beat my score!`,
      url: window.location.href,
    };

    setShowShareModal(true);
  }, [difficulty, gameStatus, targetNumber, attemptsLeft, stats]);

  const shareToSocial = useCallback(
    (platform: string) => {
      if (!difficulty || gameStatus !== "won") return;

      const currentStats = stats.byDifficulty[difficulty as Difficulty];
      const guessesUsed =
        DIFFICULTY_SETTINGS[difficulty as Difficulty].attempts - attemptsLeft;
      const emoji = guessesUsed <= 3 ? "🎯" : guessesUsed <= 5 ? "🎮" : "🎲";

      const shareText =
        `${emoji} I just won a game of NumberMaster on ${difficulty} mode! ` +
        `Target: ${targetNumber}, Guesses: ${guessesUsed}, Wins: ${currentStats.wins}, ` +
        `Streak: ${stats.currentStreak} 🔥 Try to beat my score!`;

      const shareUrl = encodeURIComponent(window.location.href);
      const encodedText = encodeURIComponent(shareText);

      let shareLink = "";
      switch (platform) {
        case "twitter":
          shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${shareUrl}`;
          break;
        case "facebook":
          shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${encodedText}`;
          break;
        case "whatsapp":
          shareLink = `https://wa.me/?text=${encodedText}%20${shareUrl}`;
          break;
        case "telegram":
          shareLink = `https://t.me/share/url?url=${shareUrl}&text=${encodedText}`;
          break;
      }

      window.open(shareLink, "_blank", "width=600,height=400");
    },
    [difficulty, gameStatus, targetNumber, attemptsLeft, stats]
  );

  const copyToClipboard = useCallback(() => {
    if (!difficulty || gameStatus !== "won") return;

    const currentStats = stats.byDifficulty[difficulty as Difficulty];
    const guessesUsed =
      DIFFICULTY_SETTINGS[difficulty as Difficulty].attempts - attemptsLeft;
    const emoji = guessesUsed <= 3 ? "🎯" : guessesUsed <= 5 ? "🎮" : "🎲";

    const shareText =
      `${emoji} I just won a game of NumberMaster on ${difficulty} mode!\n` +
      `🎯 Target number: ${targetNumber}\n` +
      `🎲 Guesses used: ${guessesUsed}\n` +
      `🏆 Total wins: ${currentStats.wins}\n` +
      `🔥 Current streak: ${stats.currentStreak}\n` +
      `💫 Best streak: ${stats.bestStreak}\n` +
      `Try to beat my score! ${window.location.href}`;

    navigator.clipboard.writeText(shareText).then(() => {
      setMessage("Score copied to clipboard!");
      setTimeout(
        () => setMessage(`Correct! The number was ${targetNumber}`),
        2000
      );
    });
  }, [difficulty, gameStatus, targetNumber, attemptsLeft, stats]);

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const volume = parseFloat(e.target.value);
      setVolume(volume);
    },
    [setVolume]
  );

  return (
    <div className={`min-h-screen bg-black text-white ${outfit.className}`}>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/80 border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center">
              <span className="text-xl md:text-2xl font-bold text-indigo-400">
                NumberMaster
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={scrollToTop}
                className="text-white hover:text-indigo-300 transition-colors font-medium cursor-pointer bg-transparent border-none p-0"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("game-section")}
                className="text-white hover:text-indigo-300 transition-colors font-medium cursor-pointer bg-transparent border-none p-0"
              >
                Play
              </button>
              <button
                onClick={() => scrollToSection("tips-section")}
                className="text-white hover:text-indigo-300 transition-colors font-medium cursor-pointer bg-transparent border-none p-0"
              >
                Tips
              </button>
              <button
                onClick={() => scrollToSection("about-section")}
                className="text-white hover:text-indigo-300 transition-colors font-medium cursor-pointer bg-transparent border-none p-0"
              >
                About
              </button>
            </nav>
            <div className="md:hidden flex items-center space-x-2">
              <button
                className="p-2 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
                onClick={toggleMenu}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="py-3 space-y-4 border-t border-slate-800">
                  <button
                    className="block w-full text-left py-2 px-4 rounded-md hover:bg-slate-800 transition-colors cursor-pointer bg-transparent border-none"
                    onClick={scrollToTop}
                  >
                    Home
                  </button>
                  <button
                    className="block w-full text-left py-2 px-4 rounded-md hover:bg-slate-800 transition-colors cursor-pointer bg-transparent border-none"
                    onClick={() => scrollToSection("game-section")}
                  >
                    Play
                  </button>
                  <button
                    className="block w-full text-left py-2 px-4 rounded-md hover:bg-slate-800 transition-colors cursor-pointer bg-transparent border-none"
                    onClick={() => scrollToSection("tips-section")}
                  >
                    Tips
                  </button>
                  <button
                    className="block w-full text-left py-2 px-4 rounded-md hover:bg-slate-800 transition-colors cursor-pointer bg-transparent border-none"
                    onClick={() => scrollToSection("about-section")}
                  >
                    About
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full py-12 md:py-24 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            <div className="py-6">
              <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 text-indigo-600 dark:text-indigo-300">
                Test Your Intuition
              </h2>
              <p className="text-gray-600 dark:text-slate-300 mb-8 text-lg leading-relaxed max-w-xl">
                Challenge yourself with our number guessing game featuring three
                difficulty levels. Make strategic guesses, learn from feedback,
                and try to find the hidden number in as few attempts as
                possible.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("game-section")}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 
                          text-white px-8 py-3 rounded-lg font-medium text-lg transition-all duration-200 shadow-lg cursor-pointer"
              >
                Start Playing Now
              </motion.button>
            </div>
            <div className="relative overflow-hidden min-h-[300px] md:min-h-[500px] flex justify-center items-center">
              <motion.div
                whileHover={{
                  scale: 1.05,
                  rotate: 0,
                  boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
                }}
                initial={{ rotate: -3 }}
                className="relative w-full h-[350px] md:h-[450px] shadow-2xl transition-all duration-300"
              >
                <img
                  src="https://images.unsplash.com/photo-1553481187-be93c21490a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
                  alt="Colorful game controller"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 rounded-lg ring-1 ring-white/10"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full" id="game-section">
          <header className="mb-6 flex justify-between items-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold"
            >
              Number Guessing Game
            </motion.h1>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMute}
                className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg transition-all duration-200 cursor-pointer"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                )}
              </motion.button>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="0.5"
                  onChange={handleVolumeChange}
                  className="w-24 accent-indigo-500"
                  title="Volume"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowStats(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer"
              >
                View Stats
              </motion.button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-xl shadow-lg lg:col-span-2"
            >
              {gameStatus === "selecting" ? (
                <div className="flex flex-col items-center space-y-6">
                  <h2 className="text-2xl font-semibold mb-4">
                    Choose Difficulty
                  </h2>
                  <p className="text-gray-600 dark:text-slate-300 mb-6 text-center">
                    Select a difficulty level to start a new round
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    {Object.entries(DIFFICULTY_SETTINGS).map(
                      ([key, settings]) => (
                        <motion.button
                          key={key}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => startRound(key as Difficulty)}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-6 py-4 rounded-lg font-medium transition-all duration-200 shadow-md cursor-pointer"
                        >
                          <div className="text-lg font-bold mb-1 capitalize">
                            {key}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-slate-300">
                            {settings.min}-{settings.max}, {settings.attempts}{" "}
                            attempts
                          </div>
                        </motion.button>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-xl font-semibold capitalize">
                        {difficulty} Mode
                      </h2>
                      {stats.currentStreak > 0 && (
                        <div className="text-sm text-indigo-300">
                          🔥 {stats.currentStreak} game streak!
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      {gameStatus === "won" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={shareScore}
                          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                          <Share2 className="h-5 w-5" />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowKeyboardShortcuts(true)}
                        className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg transition-all duration-200 cursor-pointer"
                      >
                        <Keyboard className="h-5 w-5" />
                      </motion.button>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-300">
                          Attempts Left:
                        </span>
                        <motion.span
                          key={attemptsLeft}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          className="font-bold text-lg"
                        >
                          {attemptsLeft}
                        </motion.span>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={message}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-center mb-6 text-lg"
                    >
                      {message}
                    </motion.div>
                  </AnimatePresence>

                  {gameStatus === "won" || gameStatus === "lost" ? (
                    <div className="flex flex-col items-center space-y-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                        }}
                        className={`text-6xl font-bold mb-2 ${
                          gameStatus === "won" ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {gameStatus === "won" ? "You Won!" : "Game Over"}
                      </motion.div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetGame}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md cursor-pointer"
                      >
                        Next Round
                      </motion.button>
                    </div>
                  ) : (
                    <motion.div
                      animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleGuess();
                        }}
                        className="mb-6"
                      >
                        <div className="flex items-center space-x-4">
                          <input
                            ref={inputRef}
                            type="number"
                            value={currentGuess}
                            onChange={(e) => setCurrentGuess(e.target.value)}
                            placeholder="Enter your guess"
                            className="flex-1 bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 cursor-text"
                            disabled={gameStatus !== "playing"}
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={gameStatus !== "playing" || !currentGuess}
                            className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                          >
                            Guess
                          </motion.button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-800/40 backdrop-blur-sm p-4 rounded-xl shadow-lg"
              >
                <h3 className="text-lg font-semibold mb-3 border-b border-gray-200 dark:border-slate-700 pb-2">
                  {difficulty ? (
                    <div className="flex justify-between items-center">
                      <span>Current Stats</span>
                      <span className="text-sm capitalize text-indigo-600 dark:text-indigo-400">
                        {difficulty} Mode
                      </span>
                    </div>
                  ) : (
                    "Current Stats"
                  )}
                </h3>

                {difficulty ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-200/40 dark:bg-slate-700/40 p-3 rounded-lg">
                      <div className="text-gray-600 dark:text-slate-400 text-xs mb-1">
                        Rounds Played
                      </div>
                      <div className="font-bold text-xl">
                        {stats.byDifficulty[difficulty].rounds}
                      </div>
                    </div>
                    <div className="bg-gray-200/40 dark:bg-slate-700/40 p-3 rounded-lg">
                      <div className="text-gray-600 dark:text-slate-400 text-xs mb-1">
                        Wins
                      </div>
                      <div className="font-bold text-xl">
                        {stats.byDifficulty[difficulty].wins}
                      </div>
                    </div>
                    <div className="bg-gray-200/40 dark:bg-slate-700/40 p-3 rounded-lg">
                      <div className="text-gray-600 dark:text-slate-400 text-xs mb-1">
                        Win Rate
                      </div>
                      <div className="font-bold text-xl">
                        {stats.byDifficulty[difficulty].rounds > 0
                          ? Math.round(
                              (stats.byDifficulty[difficulty].wins /
                                stats.byDifficulty[difficulty].rounds) *
                                100
                            )
                          : 0}
                        %
                      </div>
                    </div>
                    <div className="bg-gray-200/40 dark:bg-slate-700/40 p-3 rounded-lg">
                      <div className="text-gray-600 dark:text-slate-400 text-xs mb-1">
                        Best Score
                      </div>
                      <div className="font-bold text-xl">
                        {stats.byDifficulty[difficulty].bestScore !== null
                          ? stats.byDifficulty[difficulty].bestScore
                          : "--"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-200/40 dark:bg-slate-700/40 p-3 rounded-lg">
                      <div className="text-gray-600 dark:text-slate-400 text-xs mb-1">
                        Rounds Played
                      </div>
                      <div className="font-bold text-xl">{stats.totalRounds}</div>
                    </div>
                    <div className="bg-gray-200/40 dark:bg-slate-700/40 p-3 rounded-lg">
                      <div className="text-gray-600 dark:text-slate-400 text-xs mb-1">
                        Win Rate
                      </div>
                      <div className="font-bold text-xl">{winRate}%</div>
                    </div>
                    <div className="bg-gray-200/40 dark:bg-slate-700/40 p-3 rounded-lg">
                      <div className="text-gray-600 dark:text-slate-400 text-xs mb-1">
                        Avg. Guesses
                      </div>
                      <div className="font-bold text-xl">{averageGuesses}</div>
                    </div>
                    <div className="bg-gray-200/40 dark:bg-slate-700/40 p-3 rounded-lg">
                      <div className="text-gray-600 dark:text-slate-400 text-xs mb-1">
                        Games Won
                      </div>
                      <div className="font-bold text-xl">{stats.wins}</div>
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-800/40 backdrop-blur-sm p-4 rounded-xl shadow-lg"
              >
                <h3 className="text-lg font-semibold mb-3 border-b border-gray-200 dark:border-slate-700 pb-2">
                  Guess History
                </h3>
                {guessHistory.length > 0 ? (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {guessHistory.map((guess, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center justify-between p-2 rounded-lg ${getFeedbackColor(
                          guess.feedback
                        )}`}
                      >
                        <span className="font-medium">{guess.value}</span>
                        <span className="text-sm capitalize">
                          {guess.feedback}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-600 dark:text-slate-300 text-center py-4">
                    No guesses yet
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          <AnimatePresence>
            {showStats && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="h-[80vh] bg-slate-800 rounded-xl shadow-lg w-full max-w-2xl mx-4 relative flex flex-col"
                >
                  <div className="p-4 md:p-6 border-b border-slate-700">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl md:text-2xl font-bold">
                        Game Statistics
                      </h2>
                      <button
                        onClick={() => setShowStats(false)}
                        className="text-slate-300 hover:text-white cursor-pointer"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                      <div className="bg-gray-200/40 dark:bg-slate-700/40 p-3 rounded-lg text-center">
                        <div className="text-gray-600 dark:text-slate-400 text-sm mb-1">
                          Total Rounds
                        </div>
                        <div className="font-bold text-xl md:text-2xl">
                          {stats.totalRounds}
                        </div>
                      </div>
                      <div className="bg-gray-200/40 dark:bg-slate-700/40 p-3 rounded-lg text-center">
                        <div className="text-gray-600 dark:text-slate-400 text-sm mb-1">
                          Win Rate
                        </div>
                        <div className="font-bold text-xl md:text-2xl">
                          {winRate}%
                        </div>
                      </div>
                      <div className="bg-gray-200/40 dark:bg-slate-700/40 p-3 rounded-lg text-center">
                        <div className="text-gray-600 dark:text-slate-400 text-sm mb-1">
                          Avg. Guesses
                        </div>
                        <div className="font-bold text-xl md:text-2xl">
                          {averageGuesses}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-3">
                      Difficulty Stats
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(DIFFICULTY_SETTINGS).map(([key]) => {
                        const diffStats = stats.byDifficulty[key as Difficulty];
                        const winRate =
                          diffStats.rounds > 0
                            ? Math.round(
                                (diffStats.wins / diffStats.rounds) * 100
                              )
                            : 0;
                        const avgGuesses =
                          diffStats.wins > 0
                            ? (diffStats.guesses / diffStats.wins).toFixed(1)
                            : "0.0";

                        return (
                          <div
                            key={key}
                            className="bg-gray-200/40 dark:bg-slate-700/40 p-3 rounded-lg"
                          >
                            <div className="flex justify-between items-center mb-2 border-b border-gray-200 dark:border-slate-600 pb-1">
                              <div className="text-base font-bold capitalize">
                                {key}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-slate-300">
                                {diffStats.rounds} rounds played
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              <div className="bg-gray-300/40 dark:bg-slate-600 p-2 rounded-lg">
                                <div className="text-gray-600 dark:text-slate-400 text-xs mb-1">
                                  Wins
                                </div>
                                <div className="font-bold text-base md:text-lg">
                                  {diffStats.wins}
                                </div>
                              </div>
                              <div className="bg-gray-300/40 dark:bg-slate-600 p-2 rounded-lg">
                                <div className="text-gray-600 dark:text-slate-400 text-xs mb-1">
                                  Win Rate
                                </div>
                                <div className="font-bold text-base md:text-lg">
                                  {winRate}%
                                </div>
                              </div>
                              <div className="bg-gray-300/40 dark:bg-slate-600 p-2 rounded-lg">
                                <div className="text-gray-600 dark:text-slate-400 text-xs mb-1">
                                  Avg. Guesses
                                </div>
                                <div className="font-bold text-base md:text-lg">
                                  {avgGuesses}
                                </div>
                              </div>
                              <div className="bg-gray-300/40 dark:bg-slate-600 p-2 rounded-lg">
                                <div className="text-gray-600 dark:text-slate-400 text-xs mb-1">
                                  Best Score
                                </div>
                                <div className="font-bold text-base md:text-lg">
                                  {diffStats.bestScore !== null
                                    ? diffStats.bestScore
                                    : "--"}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-4 md:p-6 border-t border-slate-700">
                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowStats(false)}
                        className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer"
                      >
                        Close
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <section
            id="tips-section"
            className="py-16 mt-12 border-t border-slate-800"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <h2 className="text-3xl font-bold mb-12 text-center">
                Tips & Tricks{" "}
                <span className="text-indigo-300">to Master the Game</span>
              </h2>

              <div className="space-y-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row gap-6 items-start"
                >
                  <div className="bg-indigo-900/30 h-14 w-14 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Search className="h-8 w-8 text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-indigo-300">
                      Use Binary Search Strategy
                    </h3>
                    <p className="text-slate-300 mb-4">
                      The most efficient approach is to use a binary search.
                      Always start with the middle number of the range. If it's
                      "too high," next guess the middle of the lower half. If it's
                      "too low," guess the middle of the upper half.
                    </p>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-indigo-200 font-medium">Example:</p>
                      <p className="text-slate-400">
                        For range 1-100, first guess 50. If "too high," next try
                        25. If "too low," try 75.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row gap-6 items-start"
                >
                  <div className="bg-purple-900/30 h-14 w-14 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ClipboardList className="h-8 w-8 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-purple-300">
                      Track Your Boundaries
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Keep track of the highest "too low" guess and the lowest
                      "too high" guess. These establish the current range where
                      the answer must be. This helps avoid wasting guesses on
                      numbers that have been logically eliminated.
                    </p>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-purple-200 font-medium">Pro Tip:</p>
                      <p className="text-slate-400">
                        Always check the guess history panel to remember your
                        previous guesses and their feedback.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row gap-6 items-start"
                >
                  <div className="bg-blue-900/30 h-14 w-14 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ArrowUpRight className="h-8 w-8 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-blue-300">
                      Practice to Improve
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Start with Easy mode to get comfortable, then challenge
                      yourself with harder difficulties. As you practice binary
                      search, you'll need fewer guesses even when the range is
                      larger.
                    </p>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-blue-200 font-medium">Challenge:</p>
                      <p className="text-slate-400">
                        Can you solve Hard mode in 7 or fewer guesses? A perfect
                        binary search can find a number 1-200 in at most 8 steps!
                      </p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row gap-6 items-start"
                >
                  <div className="bg-green-900/30 h-14 w-14 rounded-lg flex items-center justify-center flex-shrink-0">
                    <LightbulbIcon className="h-8 w-8 text-green-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-green-300">
                      Handle Edge Cases
                    </h3>
                    <p className="text-slate-300 mb-4">
                      When you narrow down to a small range (like 3 numbers), be
                      clever about which number to guess. For example, if you know
                      the number is between 26 and 28, guessing 27 first is
                      optimal as it eliminates one possibility while giving you
                      the answer if correct.
                    </p>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-green-200 font-medium">Remember:</p>
                      <p className="text-slate-400">
                        When down to just two possible numbers, guessing either
                        one is equally efficient.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <section
            id="about-section"
            className="py-16 mt-12 border-t border-slate-800"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <h2 className="text-3xl font-bold mb-12 text-center">
                Why Players Love Our Game
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-indigo-900/20 hover:shadow-xl"
                >
                  <div className="h-12 w-12 bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
                    <ArrowUpRight className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-indigo-300">
                    Adaptive Difficulty
                  </h3>
                  <p className="text-slate-400">
                    Choose between Easy, Medium, and Hard modes to match your
                    skill level. Each difficulty offers a different range of
                    numbers and limited attempts.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-purple-900/20 hover:shadow-xl"
                >
                  <div className="h-12 w-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-purple-300">
                    Detailed Statistics
                  </h3>
                  <p className="text-slate-400">
                    Track your performance with comprehensive stats for each
                    difficulty level. Monitor your win rate, average guesses, and
                    best scores to see your improvement.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-blue-900/20 hover:shadow-xl"
                >
                  <div className="h-12 w-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-300">
                    Progress Saving
                  </h3>
                  <p className="text-slate-400">
                    Your game progress and stats are automatically saved across
                    sessions. Return anytime to continue improving your guessing
                    skills.
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-8 md:p-10 rounded-2xl max-w-3xl mx-auto text-center shadow-lg"
              >
                <div className="mb-6 inline-flex justify-center">
                  <Quote className="h-10 w-10 text-indigo-500 opacity-80" />
                </div>
                <p className="text-lg md:text-xl italic text-gray-300 mb-6">
                  "I love how this game challenges my mind. The different
                  difficulty levels keep it fresh, and I can actually see my
                  improvement in the stats. The feedback after each guess helps me
                  develop better strategies."
                </p>
                <div className="flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-900/50 flex items-center justify-center mr-3">
                    <span className="text-indigo-300 font-bold">AS</span>
                  </div>
                  <div>
                    <div className="font-medium text-indigo-300">Alex Smith</div>
                    <div className="text-xs text-gray-400">
                      Number Game Enthusiast
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <footer className="py-12 mt-16 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-indigo-400">
                    NumberMaster
                  </h3>
                  <p className="text-slate-400 mb-4">
                    A strategic number guessing game built with Next.js,
                    TypeScript, and Tailwind CSS. Challenge your mind with three
                    difficulty levels and track your progress.
                  </p>
                  <p className="text-slate-500 text-sm">
                    © {new Date().getFullYear()} NumberMaster. All rights
                    reserved.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    Quick Links
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() =>
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                        className="text-slate-300 hover:text-indigo-300 transition-colors cursor-pointer bg-transparent border-none p-0"
                      >
                        Home
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSection("game-section")}
                        className="text-slate-300 hover:text-indigo-300 transition-colors cursor-pointer bg-transparent border-none p-0"
                      >
                        Play Game
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSection("tips-section")}
                        className="text-slate-300 hover:text-indigo-300 transition-colors cursor-pointer bg-transparent border-none p-0"
                      >
                        Tips & Tricks
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSection("about-section")}
                        className="text-slate-300 hover:text-indigo-300 transition-colors cursor-pointer bg-transparent border-none p-0"
                      >
                        About
                      </button>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    Connect With Us
                  </h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 p-2 rounded-full hover:bg-indigo-900/50 transition-colors cursor-pointer"
                    >
                      <Github className="h-5 w-5 text-gray-300" />
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 p-2 rounded-full hover:bg-indigo-900/50 transition-colors cursor-pointer"
                    >
                      <Twitter className="h-5 w-5 text-gray-300" />
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 p-2 rounded-full hover:bg-indigo-900/50 transition-colors cursor-pointer"
                    >
                      <Instagram className="h-5 w-5 text-gray-300" />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 p-2 rounded-full hover:bg-indigo-900/50 transition-colors cursor-pointer"
                    >
                      <Linkedin className="h-5 w-5 text-gray-300" />
                    </a>
                  </div>
                  <div className="mt-6"></div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>

      <AnimatePresence>
        {showTutorial && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-800 rounded-xl shadow-lg p-6 max-w-2xl w-full mx-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Welcome to NumberMaster!</h2>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <p>Here's how to play:</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Choose a difficulty level (Easy, Medium, or Hard)</li>
                  <li>Try to guess the hidden number within the given range</li>
                  <li>
                    After each guess, you'll get feedback if your guess was too
                    high or too low
                  </li>
                  <li>Use the feedback to make smarter guesses</li>
                  <li>
                    Win by guessing the correct number before running out of
                    attempts!
                  </li>
                </ol>
                <div className="mt-4">
                  <p className="font-semibold mb-2">Pro Tips:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use binary search strategy for optimal guessing</li>
                    <li>Track your boundaries to narrow down the range</li>
                    <li>Press '?' to see keyboard shortcuts</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTutorial(false)}
                  className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg font-medium cursor-pointer"
                >
                  Start Playing
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showKeyboardShortcuts && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-800 rounded-xl shadow-lg p-6 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
                <button
                  onClick={() => setShowKeyboardShortcuts(false)}
                  className="text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Type numbers</span>
                  <span className="text-slate-400">Focus input</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Enter</span>
                  <span className="text-slate-400">Submit guess</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>?</span>
                  <span className="text-slate-400">Show shortcuts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Esc</span>
                  <span className="text-slate-400">Close modals</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            className="fixed bottom-4 right-4 bg-indigo-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 z-50"
          >
            <Trophy className="h-6 w-6 text-yellow-300" />
            <div>
              <div className="font-bold">Achievement Unlocked!</div>
              <div className="text-sm">{showAchievement.name}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShareModal && difficulty && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-800 rounded-xl shadow-lg p-6 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Share Your Score</h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-indigo-300">
                    NumberMaster
                  </span>
                  <span className="text-sm text-indigo-200 capitalize">
                    {difficulty} Mode
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Target Number:</span>
                    <span className="font-bold">{targetNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Guesses Used:</span>
                    <span className="font-bold">
                      {DIFFICULTY_SETTINGS[difficulty as Difficulty].attempts -
                        attemptsLeft}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Current Streak:</span>
                    <span className="font-bold">{stats.currentStreak} 🔥</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Best Streak:</span>
                    <span className="font-bold">{stats.bestStreak} 💫</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => shareToSocial("twitter")}
                  className="flex items-center justify-center space-x-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <Twitter className="h-5 w-5" />
                  <span>Twitter</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => shareToSocial("facebook")}
                  className="flex items-center justify-center space-x-2 bg-[#4267B2] hover:bg-[#365899] text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <Facebook className="h-5 w-5" />
                  <span>Facebook</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => shareToSocial("whatsapp")}
                  className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#22c55e] text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>WhatsApp</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyToClipboard}
                  className="flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <Link2 className="h-5 w-5" />
                  <span>Copy Link</span>
                </motion.button>
              </div>

              <div className="text-center text-sm text-slate-400">
                Share your achievement and challenge your friends!
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getFeedbackColor(feedback: "too high" | "too low" | "correct") {
  switch (feedback) {
    case "correct":
      return "bg-green-100 dark:bg-green-600/30 border border-green-500";
    case "too high":
      return "bg-red-100 dark:bg-red-600/20 border border-red-500/50";
    case "too low":
      return "bg-blue-100 dark:bg-blue-600/20 border border-blue-500/50";
  }
}