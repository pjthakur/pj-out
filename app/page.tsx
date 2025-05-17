"use client";

import { useState, useEffect, useRef, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Moon,
  Sun,
  HelpCircle,
  X,
  Trophy,
  RotateCcw,
  Zap,
  Shield,
  Rocket,
  AlertTriangle,
  Check,
  ChevronRight,
  XCircle,
  Info,
} from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
});

type ThemeType = "light" | "dark";
type ThemeContextType = {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: typeof themeColors.light;
};

const themeColors = {
  light: {
    background: "bg-gradient-to-br from-blue-50 to-purple-100",
    text: "text-slate-800",
    card: "bg-white",
    primary: "bg-purple-600",
    primaryHover: "hover:bg-purple-700",
    secondary: "bg-blue-500",
    secondaryHover: "hover:bg-blue-600",
    accent: "bg-pink-500",
    accentHover: "hover:bg-pink-600",
    border: "border-slate-200",
    shadow: "shadow-lg shadow-slate-200/50",
    muted: "text-slate-500",
    success: "bg-green-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-cyan-500",
  },
  dark: {
    background: "bg-gradient-to-br from-slate-900 to-purple-950",
    text: "text-slate-100",
    card: "bg-slate-800",
    primary: "bg-purple-700",
    primaryHover: "hover:bg-purple-800",
    secondary: "bg-blue-600",
    secondaryHover: "hover:bg-blue-700",
    accent: "bg-pink-600",
    accentHover: "hover:bg-pink-700",
    border: "border-slate-700",
    shadow: "shadow-lg shadow-black/30",
    muted: "text-slate-400",
    success: "bg-green-600",
    warning: "bg-amber-600",
    danger: "bg-red-600",
    info: "bg-cyan-600",
  },
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  colors: themeColors.light,
});

const DIFFICULTY_SETTINGS = {
  easy: {
    name: "Easy",
    gridSize: 3,
    initialSpeed: 1000,
    speedReduction: 50,
    minSpeed: 600,
    maxRounds: 10,
  },
  medium: {
    name: "Medium",
    gridSize: 6,
    initialSpeed: 800,
    speedReduction: 50,
    minSpeed: 500,
    maxRounds: 15,
  },
  hard: {
    name: "Hard",
    gridSize: 9,
    initialSpeed: 600,
    speedReduction: 50,
    minSpeed: 400,
    maxRounds: 20,
  },
};

const PAD_COLORS = [
  {
    name: "red",
    bg: "bg-red-500",
    activeBg: "bg-red-400",
    glow: "shadow-red-500/70",
  },
  {
    name: "blue",
    bg: "bg-blue-500",
    activeBg: "bg-blue-400",
    glow: "shadow-blue-500/70",
  },
  {
    name: "green",
    bg: "bg-green-500",
    activeBg: "bg-green-400",
    glow: "shadow-green-500/70",
  },
  {
    name: "yellow",
    bg: "bg-yellow-500",
    activeBg: "bg-yellow-400",
    glow: "shadow-yellow-500/70",
  },
  {
    name: "purple",
    bg: "bg-purple-500",
    activeBg: "bg-purple-400",
    glow: "shadow-purple-500/70",
  },
  {
    name: "pink",
    bg: "bg-pink-500",
    activeBg: "bg-pink-400",
    glow: "shadow-pink-500/70",
  },
  {
    name: "cyan",
    bg: "bg-cyan-500",
    activeBg: "bg-cyan-400",
    glow: "shadow-cyan-500/70",
  },
  {
    name: "amber",
    bg: "bg-amber-500",
    activeBg: "bg-amber-400",
    glow: "shadow-amber-500/70",
  },
  {
    name: "emerald",
    bg: "bg-emerald-500",
    activeBg: "bg-emerald-400",
    glow: "shadow-emerald-500/70",
  },
];

type GameState =
  | "idle"
  | "displaying"
  | "awaiting"
  | "success"
  | "failure"
  | "complete";
type Difficulty = "easy" | "medium" | "hard";
type Pad = { id: number; color: (typeof PAD_COLORS)[number] };

type ToastType = "success" | "error" | "info" | "warning";
type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
};

export default function Page() {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>("light");
  const colors = themeColors[currentTheme];

  const [isMuted, setIsMuted] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [gameState, setGameState] = useState<GameState>("idle");
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [highScore, setHighScore] = useState<Record<Difficulty, number>>({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [displaySpeed, setDisplaySpeed] = useState(
    DIFFICULTY_SETTINGS[difficulty].initialSpeed
  );
  const [pads, setPads] = useState<Pad[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef<HTMLCanvasElement>(null);

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === "light" ? "dark" : "light"));
    showToast("Theme changed", "info");
  };

  const themeContextValue = {
    theme: currentTheme,
    toggleTheme,
    colors,
  };

  useEffect(() => {
    const gridSize = DIFFICULTY_SETTINGS[difficulty].gridSize;
    const newPads = Array.from({ length: gridSize }, (_, i) => ({
      id: i,
      color: PAD_COLORS[i % PAD_COLORS.length],
    }));
    setPads(newPads);
    setDisplaySpeed(DIFFICULTY_SETTINGS[difficulty].initialSpeed);
  }, [difficulty]);

  const showToast = (
    message: string,
    type: ToastType = "info",
    duration = 3000
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => {
      const updatedToasts =
        prev.length >= 2 ? [prev[prev.length - 1]] : [...prev];
      return [...updatedToasts, { id, message, type, duration }];
    });

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  };

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setRound(1);
    setGameState("idle");
    setDisplaySpeed(DIFFICULTY_SETTINGS[difficulty].initialSpeed);
    setGamesPlayed((prev) => prev + 1);
    setTimeout(() => {
      const newStep = Math.floor(Math.random() * pads.length);
      setSequence([newStep]);
      setGameState("displaying");
      displaySequence([newStep]);
    }, 100);
  };

  const nextRound = () => {
    const newStep = Math.floor(Math.random() * pads.length);
    const newSequence = [...sequence, newStep];
    setSequence(newSequence);
    setPlayerSequence([]);
    setGameState("displaying");
    displaySequence(newSequence);
  };

  const displaySequence = async (seq: number[]) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    for (let i = 0; i < seq.length; i++) {
      setActiveIndex(seq[i]);
      await new Promise((resolve) => setTimeout(resolve, displaySpeed));
      setActiveIndex(null);
      await new Promise((resolve) => setTimeout(resolve, displaySpeed / 2));
    }

    setGameState("awaiting");
  };

  const handlePadClick = (padId: number) => {
    if (gameState !== "awaiting") return;

    setActiveIndex(padId);
    setTimeout(() => setActiveIndex(null), 300);

    const newPlayerSequence = [...playerSequence, padId];
    setPlayerSequence(newPlayerSequence);

    const currentIndex = playerSequence.length;
    if (padId !== sequence[currentIndex]) {
      setGameState("failure");
      showToast("Wrong move! Try again.", "error");

      if (round > highScore[difficulty]) {
        setHighScore((prev) => ({ ...prev, [difficulty]: round }));
        showToast(`New high score: ${round}!`, "success");
      }
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setGameState("success");
      showToast(`Round ${round} completed!`, "success");

      if (round >= DIFFICULTY_SETTINGS[difficulty].maxRounds) {
        setGameState("complete");
        showToast(
          `Congratulations! You've completed all ${round} rounds!`,
          "success",
          5000
        );
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);

        if (round > highScore[difficulty]) {
          setHighScore((prev) => ({ ...prev, [difficulty]: round }));
        }
        return;
      }

      setTimeout(() => {
        setRound(round + 1);

        const settings = DIFFICULTY_SETTINGS[difficulty];
        const newSpeed = Math.max(
          settings.minSpeed,
          displaySpeed - settings.speedReduction
        );
        setDisplaySpeed(newSpeed);

        nextRound();
      }, 1000);
    }
  };

  const changeDifficulty = (newDifficulty: Difficulty) => {
    if (newDifficulty === difficulty) return;

    if (
      gameState === "idle" ||
      gameState === "failure" ||
      gameState === "complete"
    ) {
      setDifficulty(newDifficulty);
      showToast(
        `Difficulty set to ${DIFFICULTY_SETTINGS[newDifficulty].name}`,
        "info"
      );
    } else {
      showToast("Can't change difficulty during an active game", "warning");
    }
  };

  const getGridColumns = () => {
    switch (difficulty) {
      case "easy":
        return "grid-cols-3";
      case "medium":
        return "grid-cols-3";
      case "hard":
        return "grid-cols-3";
      default:
        return "grid-cols-3";
    }
  };

  const getToastBg = (type: ToastType) => {
    switch (type) {
      case "success":
        return colors.success;
      case "error":
        return colors.danger;
      case "warning":
        return colors.warning;
      case "info":
        return colors.info;
      default:
        return colors.primary;
    }
  };

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <Check className="h-5 w-5" />;
      case "error":
        return <X className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "info":
        return <ChevronRight className="h-5 w-5" />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (showConfetti && confettiRef.current) {
      const canvas = confettiRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles: {
        x: number;
        y: number;
        size: number;
        color: string;
        speed: number;
        angle: number;
        rotation: number;
        rotationSpeed: number;
      }[] = [];

      const colors = [
        "#FF577F",
        "#FF884B",
        "#FFDEB4",
        "#FFF9CA",
        "#B1B2FF",
        "#AAC4FF",
        "#D2DAFF",
        "#EEF1FF",
      ];

      for (let i = 0; i < 200; i++) {
        particles.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          size: Math.random() * 10 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: Math.random() * 5 + 2,
          angle: Math.random() * Math.PI * 2,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
        });
      }

      let animationId: number;
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p) => {
          p.x += Math.cos(p.angle) * p.speed;
          p.y += Math.sin(p.angle) * p.speed + 0.5;
          p.rotation += p.rotationSpeed;
          p.speed *= 0.99;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        });

        if (showConfetti) {
          animationId = requestAnimationFrame(animate);
        }
      };

      animate();

      return () => {
        cancelAnimationFrame(animationId);
      };
    }
  }, [showConfetti]);

  const exitGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setRound(1);
    setGameState("idle");
    setDisplaySpeed(DIFFICULTY_SETTINGS[difficulty].initialSpeed);
    showToast("Game exited", "info");
  };

  useEffect(() => {
    if (showRules || showStats || showInfo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showRules, showStats, showInfo]);

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <main
        className={`min-h-screen ${colors.background} ${colors.text} ${montserrat.variable} font-montserrat transition-colors duration-300 ease-in-out overflow-hidden`}
      >
        {showConfetti && (
          <canvas
            ref={confettiRef}
            className="fixed inset-0 pointer-events-none z-50"
          />
        )}

        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
          <header className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center sm:mb-6 mb-4">
            <div className="flex items-center mb-4 sm:mb-0">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="mr-3"
              >
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
              </motion.div>
              <h1
                className={`text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 inline-block py-2`}
              >
                Simon Says
              </h1>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${colors.card} ${colors.border} border transition-all duration-200 hover:scale-110 cursor-pointer`}
                aria-label={
                  currentTheme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                {currentTheme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              <button
                onClick={() => setShowInfo(true)}
                className={`p-2 rounded-full ${colors.card} ${colors.border} border transition-all duration-200 hover:scale-110 cursor-pointer`}
                aria-label="Show information"
              >
                <Info className="h-5 w-5" />
              </button>

              <button
                onClick={() => setShowStats(true)}
                className={`p-2 rounded-full ${colors.card} ${colors.border} border transition-all duration-200 hover:scale-110 cursor-pointer`}
                aria-label="Show statistics"
              >
                <Trophy className="h-5 w-5" />
              </button>

              <button
                onClick={() => setShowRules(true)}
                className={`p-2 rounded-full ${colors.card} ${colors.border} border transition-all duration-200 hover:scale-110  cursor-pointer`}
                aria-label="Show game rules"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div
            className={`w-full max-w-4xl ${colors.card} ${colors.border} border rounded-xl ${colors.shadow} p-3 sm:p-4 mb-3 sm:mb-6 flex flex-wrap justify-between items-center`}
          >
            <div className="flex items-center justify-between w-full mb-2 sm:mb-0 sm:flex-row sm:w-auto">
              <div className="flex flex-col items-center px-2 sm:px-4">
                <p className="text-xs sm:text-sm opacity-70">Current Round</p>
                <p className="text-2xl sm:text-3xl font-bold">{round}</p>
              </div>

              <div className="flex flex-col items-center px-2 sm:px-4">
                <p className="text-xs sm:text-sm opacity-70">High Score</p>
                <p className="text-2xl sm:text-3xl font-bold">{highScore[difficulty]}</p>
              </div>
            </div>

            <div className="flex flex-col items-center mx-auto sm:mx-0">
              <p className="text-xs sm:text-sm opacity-70">Difficulty</p>
              <div className="flex space-x-2 mt-1">
                {(Object.keys(DIFFICULTY_SETTINGS) as Difficulty[]).map(
                  (level) => (
                    <button
                      key={level}
                      onClick={() => changeDifficulty(level)}
                      className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-200 cursor-pointer ${
                        difficulty === level
                          ? `${colors.primary} text-white`
                          : `${colors.card} ${colors.border} border hover:opacity-80`
                      }`}
                    >
                      {DIFFICULTY_SETTINGS[level].name}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="mb-2 sm:mb-6 text-center">
            {gameState === "idle" && (
              <p className="text-lg sm:text-xl">Press Start to begin!</p>
            )}
            {gameState === "displaying" && (
              <p className="text-lg sm:text-xl animate-pulse">Watch the sequence...</p>
            )}
            {gameState === "awaiting" && (
              <p className="text-lg sm:text-xl">Your turn! Repeat the sequence.</p>
            )}
            {gameState === "success" && (
              <p className="text-lg sm:text-xl">Correct! Get ready for the next round.</p>
            )}
            {gameState === "failure" && (
              <p className="text-lg sm:text-xl">Game Over! Try again?</p>
            )}
            {gameState === "complete" && (
              <p className="text-lg sm:text-xl">
                Congratulations! You've completed all rounds!
              </p>
            )}
          </div>

          <div
            className={`grid ${getGridColumns()} gap-2 sm:gap-4 mb-3 sm:mb-8 max-w-md mx-auto`}
            style={{
              gridTemplateRows: `repeat(${Math.ceil(
                pads.length / 3
              )}, minmax(0, 1fr))`,
            }}
          >
            {pads.map((pad) => (
              <motion.button
                key={pad.id}
                onClick={() => handlePadClick(pad.id)}
                disabled={gameState !== "awaiting"}
                className={`
                  w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-xl cursor-pointer
                  ${pad.color.bg} 
                  ${activeIndex === pad.id ? pad.color.activeBg : ""} 
                  transition-all duration-300 ease-out
                  ${
                    activeIndex === pad.id
                      ? `shadow-2xl ${pad.color.glow}`
                      : "shadow-md"
                  }
                  hover:scale-105 transform
                  disabled:cursor-not-allowed disabled:opacity-50
                `}
                whileTap={{ scale: 0.9 }}
                animate={{
                  scale: activeIndex === pad.id ? 1.05 : 1,
                  boxShadow:
                    activeIndex === pad.id
                      ? `0 0 30px 8px ${pad.color.name}`
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  transition: {
                    duration: 0.3,
                    ease: "easeOut",
                  },
                }}
              />
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {(gameState === "idle" ||
              gameState === "failure" ||
              gameState === "complete") && (
              <motion.button
                onClick={startGame}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg font-bold ${colors.primary} ${colors.primaryHover} text-white transition-all duration-200 flex items-center cursor-pointer`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {gameState === "idle" ? (
                  <>
                    <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Start Game
                  </>
                ) : (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Play Again
                  </>
                )}
              </motion.button>
            )}

            {(gameState === "displaying" ||
              gameState === "awaiting" ||
              gameState === "success") && (
              <motion.button
                onClick={exitGame}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg font-bold ${colors.danger} hover:bg-red-600 text-white transition-all duration-200 flex items-center cursor-pointer`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <XCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Exit Game
              </motion.button>
            )}
          </div>

          <footer
            className={`w-full text-center py-2 sm:py-4 mt-auto ${colors.muted} text-xs sm:text-sm`}
          >
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
              <p>© {new Date().getFullYear()} Simon Says</p>
              <span className="hidden sm:inline">•</span>
              <p>Train your memory!</p>
            </div>
          </footer>

          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
                onClick={() => setShowInfo(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className={`${colors.background} backdrop-blur-md bg-opacity-80 border border-white/20 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-xl`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Game Features</h2>
                    <button
                      onClick={() => setShowInfo(false)}
                      className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                      className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl`}
                    >
                      <div className="flex items-center mb-3">
                        <Shield className="h-6 w-6 mr-2 text-blue-500" />
                        <h3 className="text-lg font-bold">Multiple Difficulties</h3>
                      </div>
                      <p className={`text-sm opacity-80`}>
                        Choose from three difficulty levels: Easy (3 tiles), Medium (6
                        tiles), or Hard (9 tiles) to test your memory skills.
                      </p>
                    </div>

                    <div
                      className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl`}
                    >
                      <div className="flex items-center mb-3">
                        <Rocket className="h-6 w-6 mr-2 text-pink-500" />
                        <h3 className="text-lg font-bold">Progressive Challenge</h3>
                      </div>
                      <p className={`text-sm opacity-80`}>
                        Each round adds one more step to the sequence, and the game
                        speeds up as you progress through the levels.
                      </p>
                    </div>

                    <div
                      className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl`}
                    >
                      <div className="flex items-center mb-3">
                        <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
                        <h3 className="text-lg font-bold">Track Your Progress</h3>
                      </div>
                      <p className={`text-sm opacity-80`}>
                        Keep track of your high scores for each difficulty level and
                        challenge yourself to beat your personal best.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showRules && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
                onClick={() => setShowRules(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className={`${colors.background} backdrop-blur-md bg-opacity-80 border border-white/20 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-xl`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">How to Play</h2>
                    <button
                      onClick={() => setShowRules(false)}
                      className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <p>Welcome to Simon Says Game!</p>

                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-lg">
                      <h3 className="font-bold mb-1">Game Rules:</h3>
                      <ol className="list-decimal list-inside space-y-2">
                        <li>
                          Watch as the game displays a sequence of colored pads.
                        </li>
                        <li>
                          After the sequence finishes, repeat it by clicking the
                          pads in the same order.
                        </li>
                        <li>Each round adds one more step to the sequence.</li>
                        <li>Make a mistake and the game ends.</li>
                        <li>Complete all rounds to win!</li>
                      </ol>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-lg">
                      <h3 className="font-bold mb-1">Difficulty Levels:</h3>
                      <ul className="list-disc list-inside space-y-2">
                        <li>
                          <span className="font-medium">Easy:</span> 3 pads,
                          slower sequence, 10 rounds
                        </li>
                        <li>
                          <span className="font-medium">Medium:</span> 6 pads,
                          medium speed, 15 rounds
                        </li>
                        <li>
                          <span className="font-medium">Hard:</span> 9 pads,
                          faster sequence, 20 rounds
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-lg">
                      <h3 className="font-bold mb-1">Tips:</h3>
                      <ul className="list-disc list-inside space-y-2">
                        <li>
                          Try to associate colors with positions to help
                          remember the sequence.
                        </li>
                        <li>
                          Start with Easy mode to get familiar with the game
                          mechanics.
                        </li>
                        <li>
                          Challenge yourself with harder difficulties as you
                          improve.
                        </li>
                        <li>
                          The game speeds up slightly with each round, so stay
                          focused!
                        </li>
                      </ul>
                    </div>

                    <p className="text-center font-medium">Challenge yourself to beat your high score!</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
                onClick={() => setShowStats(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className={`${colors.background} backdrop-blur-md bg-opacity-80 border border-white/20 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-xl`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Your Statistics</h2>
                    <button
                      onClick={() => setShowStats(false)}
                      className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-lg">
                      <h3 className="font-bold mb-3">High Scores</h3>
                      <div className={`grid grid-cols-3 gap-4`}>
                        {(Object.keys(DIFFICULTY_SETTINGS) as Difficulty[]).map(
                          (level) => (
                            <div
                              key={level}
                              className={`bg-white/5 border border-white/10 rounded-lg p-3 text-center transition-transform hover:scale-105 duration-200`}
                            >
                              <p className="text-sm opacity-70">
                                {DIFFICULTY_SETTINGS[level].name}
                              </p>
                              <p className="text-2xl font-bold">
                                {highScore[level]}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 text-center transition-transform hover:scale-105 duration-200`}
                      >
                        <p className="text-sm opacity-70">Games Played</p>
                        <p className="text-2xl font-bold">{gamesPlayed}</p>
                      </div>
                      <div
                        className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 text-center transition-transform hover:scale-105 duration-200`}
                      >
                        <p className="text-sm opacity-70">Current Difficulty</p>
                        <p className="text-xl font-bold">
                          {DIFFICULTY_SETTINGS[difficulty].name}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-lg">
                      <h3 className="font-bold mb-2">Achievement Progress</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Beginner</span>
                            <span className="text-sm">
                              {Math.min(gamesPlayed, 5)}/5
                            </span>
                          </div>
                          <div
                            className={`h-2 rounded-full bg-white/5 border border-white/10 overflow-hidden`}
                          >
                            <div
                              className={`h-full ${colors.success}`}
                              style={{
                                width: `${Math.min(
                                  (gamesPlayed / 5) * 100,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Memory Master</span>
                            <span className="text-sm">
                              {Math.min(
                                highScore.hard,
                                DIFFICULTY_SETTINGS.hard.maxRounds
                              )}
                              /{DIFFICULTY_SETTINGS.hard.maxRounds}
                            </span>
                          </div>
                          <div
                            className={`h-2 rounded-full bg-white/5 border border-white/10 overflow-hidden`}
                          >
                            <div
                              className={`h-full ${colors.primary}`}
                              style={{
                                width: `${Math.min(
                                  (highScore.hard /
                                    DIFFICULTY_SETTINGS.hard.maxRounds) *
                                    100,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 flex flex-col gap-2 items-center">
            <AnimatePresence>
              {toasts.map((toast) => (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className={`px-4 py-2 rounded-full ${getToastBg(
                    toast.type
                  )} text-white whitespace-nowrap flex items-center shadow-lg max-w-[90vw] overflow-hidden`}
                >
                  <span className="mr-2">{getToastIcon(toast.type)}</span>
                  <span className="truncate">{toast.message}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </ThemeContext.Provider>
  );
}