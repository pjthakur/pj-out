"use client";

import type React from "react";

import { useState, useEffect, useRef, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Montserrat } from "next/font/google";
import { Moon, Sun, Zap, Award, RefreshCw, X } from "lucide-react";
import { createPortal } from "react-dom";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

type ThemeType = "light" | "dark";
type ThemeContextType = {
  theme: ThemeType;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeType>("dark");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const themeColors = {
  light: {
    background: "bg-gradient-to-br from-slate-50 to-slate-200",
    text: "text-slate-800",
    textMuted: "text-gray-500",
    textSecondary: "text-gray-600",
    primary: "bg-purple-600",
    primaryHover: "hover:bg-purple-700",
    secondary: "bg-teal-500",
    secondaryHover: "hover:bg-teal-600",
    accent: "bg-amber-500",
    card: "bg-white",
    cardSecondary: "bg-gray-100",
    border: "border-slate-200",
    modalOverlay: "bg-slate-900/50",
    buttonBg: "bg-gray-200",
    buttonHover: "hover:bg-gray-300",
    inputBg: "bg-white",
    heartFilled: "text-red-500",
    heartEmpty: "text-gray-300",
  },
  dark: {
    background: "bg-gradient-to-br from-slate-900 to-slate-800",
    text: "text-slate-100",
    textMuted: "text-gray-400",
    textSecondary: "text-gray-500",
    primary: "bg-violet-600",
    primaryHover: "hover:bg-violet-700",
    secondary: "bg-teal-600",
    secondaryHover: "hover:bg-teal-700",
    accent: "bg-amber-500",
    card: "bg-slate-800",
    cardSecondary: "bg-gray-700",
    border: "border-slate-700",
    modalOverlay: "bg-black/70",
    buttonBg: "bg-gray-700",
    buttonHover: "hover:bg-gray-600",
    inputBg: "bg-gray-700",
    heartFilled: "text-red-500",
    heartEmpty: "text-gray-600",
  },
};

type ToastType = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

type ToastContextType = {
  toasts: ToastType[];
  addToast: (message: string, type: ToastType["type"]) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [toasts, setToasts] = useState<ToastType[]>([]);
  
  // Deduplicate toasts with the same message and type that arrive within a short time window
  const toastTimeouts = useRef<Record<string, number>>({});

  const addToast = (message: string, type: ToastType["type"]) => {
    // Create a unique key for this type of toast
    const toastKey = `${message}-${type}`;
    
    // Check if we already have this toast in progress
    if (toastTimeouts.current[toastKey]) {
      return; // Skip adding duplicate toast
    }
    
    const id = Math.random().toString(36).substring(2, 9);
    
    setToasts((prev) => {
      const newToasts = [...prev, { id, message, type }];
      return newToasts.slice(-2);
    });

    // Set a timeout to remove this toast
    const timeoutId = window.setTimeout(() => {
      removeToast(id);
      // Clear the tracking for this toast type
      delete toastTimeouts.current[toastKey];
    }, 2000);
    
    // Track this toast type
    toastTimeouts.current[toastKey] = timeoutId;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(toastTimeouts.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
            <AnimatePresence>
              {toasts.map((toast) => (
                <Toast
                  key={toast.id}
                  toast={toast}
                  onClose={() => removeToast(toast.id)}
                />
              ))}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

const Toast: React.FC<{ toast: ToastType; onClose: () => void }> = ({
  toast,
  onClose,
}) => {
  const { theme } = useContext(ThemeContext);
  const colors = themeColors[theme];

  const bgColor = {
    success: "bg-green-500/90",
    error: "bg-red-500/90",
    info: "bg-blue-500/90",
  }[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8, transition: { duration: 0.2 } }}
      className={`${bgColor} ${colors.text} rounded-lg shadow-lg px-4 py-2 text-center font-medium text-sm backdrop-blur-sm`}
    >
      {toast.message}
    </motion.div>
  );
};

type ModalContextType = {
  isOpen: boolean;
  content: React.ReactNode | null;
  openModal: (content: React.ReactNode, onClose?: () => void) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType>({
  isOpen: false,
  content: null,
  openModal: () => {},
  closeModal: () => {},
});

const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode | null>(null);
  const [customCloseHandler, setCustomCloseHandler] = useState<(() => void) | null>(null);

  const openModal = (content: React.ReactNode, onClose?: () => void) => {
    setContent(content);
    setIsOpen(true);
    setCustomCloseHandler(() => onClose || null);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
    
    // Execute custom close handler if one was provided
    if (customCloseHandler) {
      customCloseHandler();
      setCustomCloseHandler(null);
    }
  };

  return (
    <ModalContext.Provider value={{ isOpen, content, openModal, closeModal }}>
      {children}
      {typeof document !== "undefined" &&
        isOpen &&
        createPortal(
          <Modal content={content} onClose={closeModal} />,
          document.body
        )}
    </ModalContext.Provider>
  );
};

const Modal: React.FC<{ content: React.ReactNode; onClose: () => void }> = ({
  content,
  onClose,
}) => {
  const { theme } = useContext(ThemeContext);
  const colors = themeColors[theme];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 ${colors.modalOverlay} backdrop-blur-sm flex items-center justify-center px-2`}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className={`${colors.card} ${colors.text} rounded-xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto relative`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 ${colors.textSecondary} ${colors.buttonHover} z-10 cursor-pointer rounded-full`}
          >
            <X size={24} />
          </button>
          <div className="pt-2">{content}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

type Word = {
  id: string;
  text: string;
  x: number;
  y: number;
  speed: number;
  color: string;
  points: number;
  specialEffect?: SpecialEffect;
  matchedChars?: number;
};

type SpecialEffect =
  | "speedUp"
  | "slowDown"
  | "doublePoints"
  | "clearScreen"
  | "extraLife";

type GameStats = {
  score: number;
  combo: number;
  maxCombo: number;
  wordsTyped: number;
  accuracy: number;
  lives: number;
};

type GameSettings = {
  difficulty: "easy" | "medium" | "hard";
  effectsEnabled: boolean;
};

const wordList = [
  "code",
  "react",
  "next",
  "typescript",
  "javascript",
  "tailwind",
  "framer",
  "motion",
  "animation",
  "component",
  "function",
  "variable",
  "constant",
  "array",
  "object",
  "promise",
  "async",
  "await",
  "fetch",
  "render",
  "state",
  "effect",
  "context",
  "reducer",
  "hook",
  "props",
  "children",
  "fragment",
  "portal",
  "memo",
  "callback",
  "ref",
  "forward",
  "lazy",
  "suspense",
  "error",
  "boundary",
  "testing",
  "deploy",
  "build",
  "compile",
  "bundle",
  "module",
  "import",
  "export",
  "default",
  "named",
  "dynamic",
  "static",
  "server",
  "client",
  "hydration",
  "routing",
  "navigation",
  "link",
  "redirect",
  "params",
  "query",
  "middleware",
  "api",
  "request",
  "response",
  "header",
  "cookie",
  "session",
  "token",
  "auth",
  "user",
  "profile",
  "dashboard",
  "layout",
  "theme",
  "style",
  "design",
  "responsive",
  "mobile",
  "desktop",
  "tablet",
  "grid",
  "flex",
  "container",
  "box",
  "shadow",
  "gradient",
  "animation",
  "transition",
  "transform",
  "scale",
  "rotate",
  "translate",
  "opacity",
  "visibility",
  "z-index",
  "position",
  "absolute",
  "relative",
  "fixed",
  "sticky",
  "overflow",
  "scroll",
];

const WordFallGame: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);
  const { openModal, closeModal } = useContext(ModalContext);

  const colors = themeColors[theme];
  const canvasRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [gameActive, setGameActive] = useState(false);
  const [words, setWords] = useState<Word[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    combo: 0,
    maxCombo: 0,
    wordsTyped: 0,
    accuracy: 100,
    lives: 5,
  });

  const [settings, setSettings] = useState<GameSettings>({
    difficulty: "medium",
    effectsEnabled: true,
  });

  const [totalAttempts, setTotalAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!gameActive || gameOver) return;

    const difficultySettings = {
      easy: { interval: 2000, speed: 0.2, chance: 0.05 },
      medium: { interval: 1500, speed: 0.5, chance: 0.1 },
      hard: { interval: 1000, speed: 1, chance: 0.15 },
    };

    const config = difficultySettings[settings.difficulty];

    // Track words that have already caused life loss
    const wordsProcessed = new Set<string>();

    const wordInterval = setInterval(() => {
      if (canvasRef.current) {
        const canvasWidth = canvasRef.current.clientWidth;
        const randomWord =
          wordList[Math.floor(Math.random() * wordList.length)];
        const randomX = Math.random() * (canvasWidth - 150);

        const colors = [
          "text-purple-500",
          "text-teal-500",
          "text-pink-500",
          "text-amber-500",
          "text-blue-500",
          "text-emerald-500",
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const points = randomWord.length * 10;

        let specialEffect: SpecialEffect | undefined = undefined;
        if (settings.effectsEnabled && Math.random() < config.chance) {
          const effects: SpecialEffect[] = [
            "speedUp",
            "slowDown",
            "doublePoints",
            "clearScreen",
            "extraLife",
          ];
          specialEffect = effects[Math.floor(Math.random() * effects.length)];
        }

        const newWord: Word = {
          id: Math.random().toString(36).substring(2, 9),
          text: randomWord,
          x: randomX,
          y: 0,
          speed: config.speed * (0.8 + Math.random() * 0.4),
          color: randomColor,
          points,
          specialEffect,
        };

        setWords((prev) => [...prev, newWord]);
      }
    }, config.interval);

    const moveInterval = setInterval(() => {
      if (canvasRef.current) {
        const canvasHeight = canvasRef.current.clientHeight;

        setWords((prev) => {
          // Handle words that hit the bottom
          let lifeWasLost = false;
          let filteredWords = [];

          for (const word of prev) {
            // Update word position
            const updatedWord = {
              ...word,
              y: word.y + word.speed,
            };

            // Check if word hit the bottom
            if (updatedWord.y > canvasHeight - 30) {
              // Only process this word if we haven't already
              if (!wordsProcessed.has(word.id)) {
                wordsProcessed.add(word.id);
                lifeWasLost = true;
              }
            } else {
              // Keep words that haven't hit the bottom
              filteredWords.push(updatedWord);
            }
          }

          // Update lives outside the loop to ensure it happens only once
          if (lifeWasLost) {
            setTimeout(() => {
              setStats((prevStats) => {
                const newLives = prevStats.lives - 1;
                
                // Only show toast if we actually lost a life
                if (newLives < prevStats.lives) {
                  // Ensure this runs after the state update to avoid duplicate toasts
                  setTimeout(() => {
                    addToast("❤️ Life lost!", "error");
                  }, 0);
                }
                
                // Check if game over
                if (newLives <= 0) {
                  // End game on next tick to avoid state update during render
                  setTimeout(() => {
                    setGameOver(true);
                    setGameActive(false);
                    showGameOverModal();
                  }, 0);
                }
                
                return {
                  ...prevStats,
                  lives: Math.max(0, newLives),
                  combo: 0,
                };
              });
            }, 0);
          }

          return filteredWords;
        });
      }
    }, 16);

    if (inputRef.current) {
      inputRef.current.focus();
    }

    return () => {
      clearInterval(wordInterval);
      clearInterval(moveInterval);
    };
  }, [gameActive, settings, gameOver]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    setCurrentInput(newInput);

    // Update matched characters for words
    setWords((prev) =>
      prev.map((word) => {
        const matchedChars = word.text
          .toLowerCase()
          .split("")
          .reduce((count, char, index) => {
            return newInput.toLowerCase()[index] === char ? count + 1 : count;
          }, 0);
        return { ...word, matchedChars };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentInput.trim()) return;

    setTotalAttempts((prev) => prev + 1);

    const matchedWordIndex = words.findIndex(
      (word) => word.text.toLowerCase() === currentInput.toLowerCase()
    );

    if (matchedWordIndex !== -1) {
      const matchedWord = words[matchedWordIndex];

      setWords((prev) => prev.filter((_, i) => i !== matchedWordIndex));

      setStats((prev) => {
        const newCombo = prev.combo + 1;
        const newMaxCombo = Math.max(prev.maxCombo, newCombo);
        const comboMultiplier = Math.floor(newCombo / 5) + 1;
        const pointsEarned = matchedWord.points * comboMultiplier;

        const newAccuracy = Math.round(
          ((prev.wordsTyped + 1) / (totalAttempts + 1)) * 100
        );

        return {
          ...prev,
          score: prev.score + pointsEarned,
          combo: newCombo,
          maxCombo: newMaxCombo,
          wordsTyped: prev.wordsTyped + 1,
          accuracy: newAccuracy,
        };
      });

      if (stats.combo > 0 && stats.combo % 5 === 0) {
        addToast(`${stats.combo}x Combo! Multiplier increased!`, "success");
      }

      if (matchedWord.specialEffect && settings.effectsEnabled) {
        handleSpecialEffect(matchedWord.specialEffect);
      }
    } else {
      setStats((prev) => ({
        ...prev,
        combo: 0,
      }));
    }
    setCurrentInput("");
  };

  const handleSpecialEffect = (effect: SpecialEffect) => {
    switch (effect) {
      case "speedUp":
        addToast("⚡ Speed Boost! Words are falling faster now!", "info");
        setWords((prev) =>
          prev.map((word) => ({
            ...word,
            speed: word.speed * 1.5,
          }))
        );
        break;
      case "slowDown":
        addToast("🐢 Speed Reduction! Words are falling slower now!", "info");
        setWords((prev) =>
          prev.map((word) => ({
            ...word,
            speed: word.speed * 0.5,
          }))
        );
        break;
      case "doublePoints":
        addToast("Double Points! Next 5 words worth double!", "success");
        break;
      case "clearScreen":
        addToast("Clear Screen! All words removed!", "success");
        setWords([]);
        break;
      case "extraLife":
        addToast("Extra Life! +1 life added!", "success");
        setStats((prev) => ({
          ...prev,
          lives: prev.lives + 1,
        }));
        break;
    }
  };

  const startGame = () => {
    setGameActive(true);
    setGameOver(false);
    setWords([]);
    setCurrentInput("");
    setStats({
      score: 0,
      combo: 0,
      maxCombo: 0,
      wordsTyped: 0,
      accuracy: 100,
      lives: 5,
    });
    setTotalAttempts(0);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);

    addToast("Game started! Type the falling words!", "info");
  };

  const showGameOverModal = () => {
    // Define game reset function
    const resetGame = () => {
      setGameActive(false);
      setWords([]);
      setCurrentInput("");
      setStats({
        score: 0,
        combo: 0,
        maxCombo: 0,
        wordsTyped: 0,
        accuracy: 100,
        lives: 5,
      });
      setTotalAttempts(0);
      setGameOver(false);
    };
    
    openModal(
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold mb-2">Game Over!</h2>

        <div className="space-y-4 py-4">
          <div className="text-5xl font-bold">{stats.score}</div>
          <div className={`text-xl ${colors.textMuted}`}>Final Score</div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className={`${colors.cardSecondary} p-3 rounded-lg`}>
              <div className="text-2xl font-bold">{stats.wordsTyped}</div>
              <div className={`text-sm ${colors.textMuted}`}>Words Typed</div>
            </div>
            <div className={`${colors.cardSecondary} p-3 rounded-lg`}>
              <div className="text-2xl font-bold">{stats.maxCombo}x</div>
              <div className={`text-sm ${colors.textMuted}`}>Max Combo</div>
            </div>
            <div className={`${colors.cardSecondary} p-3 rounded-lg`}>
              <div className="text-2xl font-bold">{stats.accuracy}%</div>
              <div className={`text-sm ${colors.textMuted}`}>Accuracy</div>
            </div>
            <div className={`${colors.cardSecondary} p-3 rounded-lg`}>
              <div className="text-2xl font-bold capitalize">
                {settings.difficulty}
              </div>
              <div className={`text-sm ${colors.textMuted}`}>Difficulty</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            closeModal();
            startGame();
          }}
          className={`w-full py-3 rounded-lg ${colors.primary} ${colors.primaryHover} text-white font-medium text-lg cursor-pointer`}
        >
          Play Again
        </button>
      </div>,
      resetGame // Pass the reset function as the custom close handler
    );
  };

  const showInstructionsModal = () => {
    openModal(
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">How to Play</h2>

        <div className="space-y-4">
          <p>
            Words will fall from the top of the screen. Type them correctly
            before they reach the bottom!
          </p>

          <div className={`${colors.cardSecondary} p-4 rounded-lg`}>
            <h3 className="font-bold mb-2">Game Features:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Type words before they hit the bottom</li>
              <li>Build combos for multipliers</li>
              <li>Special effects can help or challenge you</li>
              <li>Adjust difficulty in settings</li>
              <li>Track your stats and high scores</li>
            </ul>
          </div>

          <div className={`${colors.cardSecondary} p-4 rounded-lg`}>
            <h3 className="font-bold mb-2">Special Effects:</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-blue-500">
                  <Zap size={18} />
                </span>
                <span>Speed Up</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-500">
                  <Zap size={18} />
                </span>
                <span>Slow Down</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">
                  <Award size={18} />
                </span>
                <span>Double Points</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">
                  <RefreshCw size={18} />
                </span>
                <span>Clear Screen</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">
                  <Award size={18} />
                </span>
                <span>Extra Life</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`pt-4 border-t ${colors.border}`}>
          <button
            onClick={() => {
              closeModal();
              startGame();
            }}
            className={`w-full py-2 rounded-lg ${colors.primary} ${colors.primaryHover} text-white font-medium cursor-pointer`}
          >
            Start Game
          </button>
        </div>
      </div>
    );
  };

  const exitGame = () => {
    openModal(
      <div className="space-y-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Exit Game?</h2>
        <p className={`${colors.textMuted}`}>
          Are you sure you want to exit? Your current progress will be lost.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setGameActive(false);
              setWords([]);
              setCurrentInput("");
              setStats({
                score: 0,
                combo: 0,
                maxCombo: 0,
                wordsTyped: 0,
                accuracy: 100,
                lives: 5,
              });
              setTotalAttempts(0);
              closeModal();
            }}
            className={`flex-1 py-2.5 rounded-lg ${colors.primary} ${colors.primaryHover} text-white font-medium cursor-pointer`}
          >
            Yes, Exit
          </button>
          <button
            onClick={() => {
              closeModal();
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }}
            className={`flex-1 py-2.5 rounded-lg ${colors.buttonBg} ${colors.buttonHover} font-medium cursor-pointer`}
          >
            Continue Playing
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen ${colors.background} ${colors.text} ${montserrat.className}`}
    >
      <header className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              WordFall
            </h1>
            {gameActive && (
              <button
                onClick={exitGame}
                className={`ml-4 px-3 py-1.5 rounded-lg text-sm ${colors.buttonBg} ${colors.buttonHover} transition-colors cursor-pointer flex items-center gap-1`}
                title="Exit current game"
              >
                <X size={16} />
                <span className="hidden sm:inline">Exit Game</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <label className={`text-sm ${colors.textMuted} hidden sm:inline`}>
                Difficulty:
              </label>
              <div className="flex gap-1">
                {["easy", "medium", "hard"].map((level) => (
                  <button
                    key={level}
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        difficulty: level as any,
                      }))
                    }
                    disabled={gameActive}
                    className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                      settings.difficulty === level
                        ? `${colors.primary} text-white`
                        : gameActive
                        ? `${colors.buttonBg} opacity-50 cursor-not-allowed`
                        : `${colors.buttonBg} ${colors.buttonHover} cursor-pointer`
                    }`}
                    title={
                      gameActive ? "Cannot change difficulty during game" : ""
                    }
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  effectsEnabled: !prev.effectsEnabled,
                }))
              }
              disabled={gameActive}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                settings.effectsEnabled ? colors.primary : colors.buttonBg
              } ${
                gameActive
                  ? "opacity-50 cursor-not-allowed"
                  : settings.effectsEnabled
                  ? colors.primaryHover
                  : colors.buttonHover
              }`}
              title={
                gameActive
                  ? "Cannot toggle effects during game"
                  : settings.effectsEnabled
                  ? "Disable Effects"
                  : "Enable Effects"
              }
            >
              <Zap
                size={20}
                className={settings.effectsEnabled ? "text-white" : ""}
              />
            </button>

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${colors.buttonBg} ${colors.buttonHover} transition-colors cursor-pointer`}
              title={
                theme === "light"
                  ? "Switch to Dark Mode"
                  : "Switch to Light Mode"
              }
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
          <div className="flex items-center gap-6">
            <div>
              <div className={`text-sm ${colors.textMuted}`}>Score</div>
              <div className="text-2xl font-bold">{stats.score}</div>
            </div>

            <div>
              <div className={`text-sm ${colors.textMuted}`}>Combo</div>
              <div className="text-2xl font-bold">{stats.combo}x</div>
            </div>

            <div>
              <div className={`text-sm ${colors.textMuted}`}>Lives</div>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < stats.lives ? colors.heartFilled : colors.heartEmpty
                    }
                  >
                    ❤
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <div className={`text-sm ${colors.textMuted}`}>Accuracy</div>
              <div className="text-xl font-bold">{stats.accuracy}%</div>
            </div>

            <div>
              <div className={`text-sm ${colors.textMuted}`}>Words</div>
              <div className="text-xl font-bold">{stats.wordsTyped}</div>
            </div>
          </div>
        </div>

        <div
          ref={canvasRef}
          className={`relative w-full h-[50vh] sm:h-[60vh] rounded-xl overflow-hidden ${colors.card} shadow-xl border ${colors.border}`}
        >
          {!gameActive && !gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <motion.h2
                className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Word Fall Challenge
              </motion.h2>

              <motion.div
                className="flex flex-col gap-3 sm:gap-4 w-full max-w-xs sm:max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  onClick={startGame}
                  className={`w-full py-2.5 sm:py-3 rounded-lg ${colors.primary} ${colors.primaryHover} text-white font-medium text-base sm:text-lg cursor-pointer`}
                >
                  Start Game
                </button>

                <button
                  onClick={showInstructionsModal}
                  className={`w-full py-2.5 sm:py-3 rounded-lg ${colors.buttonBg} ${colors.buttonHover} font-medium text-base sm:text-lg cursor-pointer`}
                >
                  How to Play
                </button>
              </motion.div>
            </div>
          )}

          <AnimatePresence>
            {words.map((word) => (
              <motion.div
                key={word.id}
                className={`absolute ${word.color} font-medium text-base sm:text-lg`}
                style={{
                  left: word.x,
                  top: word.y,
                  textShadow: word.specialEffect
                    ? "0 0 8px currentColor"
                    : "none",
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {word.text.split("").map((char, index) => (
                  <span
                    key={index}
                    className={
                      word.matchedChars && index < word.matchedChars
                        ? "text-white"
                        : ""
                    }
                  >
                    {char}
                  </span>
                ))}
                {word.specialEffect && (
                  <span className="absolute -right-4 sm:-right-6 text-base sm:text-lg">
                    {word.specialEffect === "speedUp" && (
                      <Zap className="text-blue-500" size={16} />
                    )}
                    {word.specialEffect === "slowDown" && (
                      <Zap className="text-purple-500" size={16} />
                    )}
                    {word.specialEffect === "doublePoints" && (
                      <Award className="text-yellow-500" size={16} />
                    )}
                    {word.specialEffect === "clearScreen" && (
                      <RefreshCw className="text-red-500" size={16} />
                    )}
                    {word.specialEffect === "extraLife" && (
                      <Award className="text-green-500" size={16} />
                    )}
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-4 sm:mt-6">
          <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-4">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              disabled={!gameActive}
              className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg ${colors.inputBg} border ${colors.border} focus:outline-none focus:ring-2 focus:ring-purple-500 text-base sm:text-lg`}
              placeholder={
                gameActive
                  ? "Type the falling words..."
                  : "Press Start to begin..."
              }
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />

            {gameActive ? (
              <button
                type="submit"
                disabled={!currentInput.trim()}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors ${
                  currentInput.trim()
                    ? `${colors.primary} ${colors.primaryHover} text-white cursor-pointer`
                    : `${colors.buttonBg} cursor-not-allowed opacity-50`
                } font-medium text-base sm:text-lg whitespace-nowrap`}
              >
                Submit
              </button>
            ) : (
              <button
                type="button"
                onClick={startGame}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg ${colors.primary} ${colors.primaryHover} text-white font-medium text-base sm:text-lg cursor-pointer whitespace-nowrap`}
              >
                Start
              </button>
            )}
          </form>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-4 sm:py-6 mt-auto">
        <div className={`text-center text-xs sm:text-sm ${colors.textMuted}`}>
          <p>
            Type quickly and accurately to score points. Build combos for
            multipliers!
          </p>
          <p className="mt-2">
            Watch out for special effect words that can help or challenge you.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function Page() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ModalProvider>
          <WordFallGame />
        </ModalProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}